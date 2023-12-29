sourcemap原理和实践
sourcemap的配置分析
webpack 的 sourcemap 配置比较麻烦，但其实也是有规律的。
它是对一些基础配置按照一定顺序的组合，理解了每个基础配置，知道了怎么组合就理解了各种 devtool 配置。
● eval：浏览器 devtool 支持通过 sourceUrl 来把 eval 的内容单独生成文件，还可以进一步通过 sourceMappingUrl 来映射回源码，webpack 利用这个特性来简化了 sourcemap 的处理，可以直接从模块开始映射，不用从 bundle 级别。
● cheap：只映射到源代码的某一行，不精确到列，可以提升 sourcemap 生成速度
● source-map：生成 sourcemap 文件，可以配置 inline，会以 dataURL 的方式内联，可以配置 hidden，只生成 sourcemap，不和生成的文件关联
● nosources：不生成 sourceContent 内容，可以减小 sourcemap 文件的大小
● module： sourcemap 生成时会关联每一步 loader 生成的 sourcemap，配合 sourcemap-loader 可以映射回最初的源码
sourcemap原理
sourcemap确定映射关系需要 8 个要素，8 个元素组成了一个映射段: 编译后文件|编译后变量起始行|编译后变量起始列|编译后变量名|源文件|源代码起始行|源代码起始列|源代码变量名，在 sourcemap 中，通过一个 mappings 字段，将所有映射段以 , 链接形成一个字符串，那这个字符串就可以确定完整的代码映射.
● 编译后文件：一个编译后文件只会指向一个 sourcemap 文件，所以在一个 sourcemap 文件中，编译后文件名都是一样的，sourcemap 标准中就是用一个 file 字段记录下编译后文件名称，就可以在映射段去除掉编译后文件这个要素。
● 编译后变量起始行：我们解析编译后的代码，都是从头到尾按照顺序来的，也就是说行也是从头到尾按照顺序解析的。那么这种顺序结构，我们通常可以用数组记录，例如第一行编译后代码的映射放到数组下标 0、第二行放到下标 1……而 sourcemap 标准中所有映射段都放在一个字符串中，采用 ; 分隔每一行的映射，就可以去掉映射段中的编译后代码起始行。
● 编译后变量起始列：许多时候，编译后代码只有一行，列可能达到几万甚至几十万，意味着到了靠后的映射段我们需要一个很大的数字去记录起始列。我们知道编译后的代码是从头到尾按顺序的，那么根据这个思路，我们可以使用增量来记录，即记录的是当前这个变量相对于同一行上一个变量的所在的起始列的增量，例如function print(variable)，print 起始列下标为 9，variable 其实列下标是 11，那么增量就是 variable 相对于 print 的起始列增量就是 2，我们记录 2 来代替 11。
● 编译后变量名：我们都知道，js 变量名都是以字母、数字、$ 或者 _ 组成的连续字符串(不能以数字开始)，我们已经有了编译后的代码和编译后变量的起始列，自然知道编译后的变量名是什么，所以不需要再映射段中记录编译后变量名.
● 源文件：因为一个 sourcemap 只对应一个编译后文件，那源文件能省略吗？答案是不能。以 webpack 为例，打包过程中可能将多个源文件打包到一个 chunk 中(编译后文件)，也就是说一个 sourcemap 对应多个编译前文件，所以源文件的信息我们需要记录。但是我们可以不必再每个映射段中都记录源文件，因为通常很多个映射段对于一个源文件，所以我们可以将源文件作为一个数组提出来，sourcemap 用 sources 字段记录了源文件的数组，然后每个映射段记录的是对应源文件在 sources 数组总的下标
● 源代码起始行：mappings 中映射段的顺序是按照编译后代码顺序来的，其对应的编译前代码不一定是按序的，所以源代码的起始行我们无法通过数组或者 ; 等形式省略，但是我们同样可以用相对于上一个映射段中源代码起始行的相对增量来记录行数，以减小记录的行数位数.
● 源代码变量名：上面我们通过已知编译后代码和编译后变量的起始位置得到了编译后变量名，所以可以在映射段中省略编译后变量名的记录。但是我们是不知道源代码具体内容的，所以我们无法省略源代码变量名。但是同源文件的思路一样，源代码中同一个变量是被多次使用的，所以 sourcemap 用 names 字段记录了源代码中的变量数组，然后在映射段中记录对应变量名在 names 数组中下标。
然后进行进一步精简，采用base64 VLQ 编码
 
VLQ 通过 6 位二进制数进行存储，第一位表示连续位(1 表示连续，0 表示不连续，也就是说如果是 1 代表这部分还没结束)，最后一位表示是正数还是负数(1 是负数，0 是正数)，中间的 4 位用了存储数据，所以一个 6 位二进制存储的范围是 [-15, 15]，超过就需要用连续 6 位二进制数（连续的 6 位二进制数从第二个开始不需要记录是正负数了，所以第二个之后后 5 位存储数据）
一个转换网站
https://www.murzwin.com/base64vlq.html

sourcemap的工具
例如restore-source-tree，reverse-sourcemap这两个工具包 可以利用.map文件还原出源代码
reverse-sourcemap --output-dir sourceCode test.js.map
restore-source-tree --out-dir sourceRestore test.js.map

sourcemap实践
实现一个本地批量转换.map文件的函数
const fs = require('fs')
const { existsSync, mkdirSync, writeFileSync } = require('fs')
const path = require('path')
const sourceMap = require('source-map')
const https = require('https')
const execa = require('execa')
/* const target = 'https://s2-12537.kwimgs.com/kos/nlav12537/micro/original/static/polaris-original/js/908.0a7e0f1e.js'  // searchBtnClick   342 12     实际是391行
const lineNumber = 605
const columnNumber = 1183
const afterLineNumber = 1
const beforeLineNumber = 1

// const target = 'https://s2-12537.kwimgs.com/kos/nlav12537/public/js/vendors.28ca3a66.js'
// const lineNumber = 2
// const columnNumber = 5142356
const afterLineNumber = 3
const beforeLineNumber = 3


//https://s2-12537.kwimgs.com/kos/nlav12537/public/js/chunk/index/index.1fd0f6fc.js:1:174034
/* const target = 'https://s2-12537.kwimgs.com/kos/nlav12537/public/js/chunk/2.4955c113.js'
const lineNumber = 1
const columnNumber = 1000 */
/* const target = 'https://s2-12537.kwimgs.com/kos/nlav12537/public/js/chunk/vendors.ba41ee0c.js'
const lineNumber = 5990
const columnNumber = 99740
const afterLineNumber = 1
const beforeLineNumber = 1 */
var filepath = path.join(__dirname, './1.js.map');


async function fetch(url) {
	return new Promise((resolve, reject) => {
		https.get(url, function (response) {
			let data = '';
			if (response.statusMessage !== 'OK') {
				console.log('ERROR: ', response.statusCode, ' ', response.statusMessage);
				reject();
			}
			response.setEncoding('utf8');
			response.on('data', function (chunk) {
				data += chunk;
			});
			response.on('end', function () {
				resolve(JSON.parse(data));
			});
		});
	});
}
async function getSourceCodePosition(target, lineNumber, columnNumber) {
	const rawSourceMap = await fetch(target + '.map');
	console.log(rawSourceMap)
	let sourceCodePosition = {};
	SourceMapConsumer.with(rawSourceMap, null, (consumer) => {
		// 获取函数 `myFunction` 的位置信息
		sourceCodePosition = consumer.originalPositionFor({
			line: lineNumber,
			column: columnNumber,
		});
		console.log(sourceCodePosition); // 案例  { source: 'test.js', line: 1, column: 14, name: 'add' }
	});

	return sourceCodePosition
}

function createSourceMapConsumer(sourceMapCode) {
	const consumer = new sourceMap.SourceMapConsumer(sourceMapCode)
	return consumer
}
async function getSourcesBySourceMapCode(sourceMapCode) {
	const consumer = await createSourceMapConsumer(sourceMapCode)
	const { sources } = consumer
	const result = sources.map((source) => {
		return {
			source,
			code: consumer.sourceContentFor(source)
		}
	})
	return result
}
async function outPutSources(
	sources,
	outPutDir = 'source-map-result'
) {
	for (const sourceItem of sources) {
		const { source, code } = sourceItem
		const filepath = path.resolve(process.cwd(), outPutDir, source)
		if (!existsSync(path.dirname(filepath))) {
			mkdirSync(path.dirname(filepath), { recursive: true })
		}
		writeFileSync(filepath, code, 'utf-8')
	}
}


async function parse(target, lineNumber, columnNumber, afterLineNumber, beforeLineNumber) {
	const rawSourceMap = await fetch(target + '.map');
	fs.writeFileSync(filepath, JSON.stringify(rawSourceMap));
	const sourceCode = await getSourcesBySourceMapCode(rawSourceMap)
	console.log(sourceCode.length, '个文件')
	outPutSources(sourceCode)
	const consumer = await new sourceMap.SourceMapConsumer(rawSourceMap);
	// 传入要查找的行列数，查找到压缩前的源文件及行列数
	const sm = consumer.originalPositionFor({
		line: lineNumber, // 压缩后的行数
		column: columnNumber, // 压缩后的列数
	});
	if (!sm.source || !sm.line) {
		throw new Error('没有找到源文件');
	}
	// 压缩前的所有源文件列表
	const sources = consumer.sources;
	// 根据查到的source，到源文件列表中查找索引位置
	const smIndex = sources.indexOf(sm.source);
	// 到源码列表中查到源代码
	const smContent = consumer.sourcesContent[smIndex];
	// 将源代码串按"行结束标记"拆分为数组形式
	const rawLines = smContent.split(/\r?\n/g);
	console.log('111', sm.source);
	console.log('222', sm);
	console.log('333', consumer.sourcesContent.length);
	/* 	const code = JSON.stringify(consumer.sourcesContent.map(item => item.split(/\r?\n/g)));
		//const buffer = Buffer.from(consumer.sourcesContent);
		fs.writeFile('test.js', code, { encoding: 'utf-8' }, (err) => {
			if (err) throw err;
			console.log('File saved!');
		}); */
	// 输出源码行，因为数组索引从0开始，故行数需要-1
	for (let i = -1 * beforeLineNumber; i <= afterLineNumber; i++) {
		/* 		if (i === 0) {
					console.log(i, sm.line + i, "66666", rawLines[sm.line + i]);
				} */
		console.log(i, sm.line + i, rawLines[sm.line + i - 1]);
	}
	console.log(sm.line, rawLines[sm.line - 1]);
	const str = 'webpack:///src/store/modules/message-configure.ts';
	const regex = /webpack:\/\/\/(.+?)(?:\?.*)?$/;
	const match = sm.source.match(regex);
	const path = match ? match[1] : null;
	const encodedFilePath = encodeURIComponent(path);
	console.log(path);
	console.log(encodedFilePath)
}
parse(target, lineNumber, columnNumber, afterLineNumber, beforeLineNumber)
execa('reverse-sourcemap', ['--output-dir', 'sourceCode', '1.js.map']);
// 输出 "/src/store/modules/message-configure.ts"
// 对线上的
/*
{
	source: 'webpack:///src/page/reach/component/step-content-smart-to-call.vue?cd5a',
	line: 1,   25
	column: 736,  30
	name: null
}

