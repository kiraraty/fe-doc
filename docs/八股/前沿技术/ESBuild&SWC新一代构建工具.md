   

[![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8bf7260e68824c658d505ccd0d451669~tplv-k3u1fbpfcp-watermark.image)](https://juejin.cn/team/6954914058332176397/posts)

2022年04月28日 22:04 ·  阅读 4768

![ESBuild & SWC浅谈: 新一代构建工具](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9982a3bba6ca4060a918d026a3b86f10~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?)

![](https://p3-passport.byteimg.com/img/user-avatar/2fcea6a9c80b959f2f0e11c9d8667dc3~100x100.awebp)

[ELab ![lv-5](https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/lv-5.d08789d.png "创作等级")](https://juejin.cn/user/4169764695465239)   

前端工程师 @ 公众号：ELab团队

## 首先, ESBuild & swc是什么?

-   [ESBuild](https://link.juejin.cn/?target=https%3A%2F%2Fesbuild.github.io%2F "https://esbuild.github.io/")是基于Go语言开发的JavaScript Bundler, 由Figma前CTO Evan Wallace开发, 并且也被Vite用于开发环境的依赖解析和Transform.

-   [SWC](https://link.juejin.cn/?target=https%3A%2F%2Fswc.rs%2F "https://swc.rs/")则是基于Rust的JavaScript Compiler(其生态中也包含打包工具spack), 目前为Next.JS/Parcel/Deno等前端圈知名项目使用.

## 为什么要关注这两个工具？

-   因为...
    
    -   ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f56e9133183f4a0b987c13d41d0bc6a1~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

-   大家可能在日常工作中遇到过, 项目的构建时间随着项目体积和复杂度逐渐递增, 有的时候本地编辑一个项目要等上个大几分钟(此处@Webpack)
    
    -   ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4c85a5182fa4056a6f2327685a4b99f~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

-   这个是ESBuild官网对于其打包10份three.js的速度对比
    
    -   ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bed17ae37811408bbf20bec6253a7b68~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

-   SWC则宣称其比Babel快20倍(四核情况下可以快70倍)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dcb34c4439c84c7c844c964e9cbe5ba2~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

-   那么ESBuild & SWC是真的有这么快? 还是开发者的自说自话? 我们通过实验来检验一下, 先看ESBuild
    
    -   让我们先写一段非常简单的代码
        
        ```
        import * as React from 'react'
        import * as ReactServer from 'react-dom/server'
        
        const Greet = () => <h1>Hello, world!</h1>
        console.log(ReactServer.renderToString(<Greet />))
        复制代码
        ```
        
    -   然后我们来通过Webpack & ESBuild构建它
        
        -   用ESBuild打包一下
            
            ```
            # 编译
            > build-esb
            > esbuild ./src/app.jsx --bundle --outfile=out_esb.js --minify
            
            # 构建产物的大小和构建时间
            out_esb.js  27.4kb
            ⚡ Done in 13ms
            
            # 运行产物
            node out_esb.js 
            <h1 data-reactroot="">Hello, world!</h1>
            复制代码
            ```
            
        -   用Webpack打包一下
            
            ```
            # 编译
            > build-wp
            > webpack --mode=production
            
            # 构建产物
            asset out_webpack.js 25.9 KiB [compared for emit] [minimized] (name: main) 1 related asset
            modules by path ./node_modules/react/ 8.5 KiB
              ./node_modules/react/index.js 189 bytes [built] [code generated]
              ./node_modules/react/cjs/react.production.min.js 8.32 KiB [built] [code generated]
            modules by path ./node_modules/react-dom/ 28.2 KiB
              ./node_modules/react-dom/server.browser.js 227 bytes [built] [code generated]
              ./node_modules/react-dom/cjs/react-dom-server.browser.production.min.js 28 KiB [built] [code generated]
            ./src/app.jsx 254 bytes [built] [code generated]
            ./node_modules/object-assign/index.js 2.17 KiB [built] [code generated]
            
            # 构建时间
            webpack 5.72.0 compiled successfully in 1680 ms
            
            npm run build-wp  2.79s user 0.61s system 84% cpu 4.033 total
            
            # 运行
            node out_webpack.js  
            <h1 data-reactroot="">Hello, world!</h1>
            复制代码
            ```
            

-   再来看看swc的编译效率
    
    -   又是一段简单的ES6代码
        
        ```
        // 一些变量声明
        const PI = 3.1415;
        let x = 1;
        
        // spread
        let [foo, [[bar], baz]] = [1, [[2], 3]];
        const node = {
          loc: {
            start: {
              line: 1,
              column: 5
            }
          }
        };
        let { loc, loc: { start }, loc: { start: { line }} } = node;
        
        // arrow function
        var sum = (num1, num2) => { return num1 + num2; }
        
        // set
        const s = new Set();
        [2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));
        
        // class
        class Point {
          constructor(x, y) {
            this.x = x;
            this.y = y;
          }
        
          toString() {
            return '(' + this.x + ', ' + this.y + ')';
          }
        }
        复制代码
        ```
        
    -   先用Babel转译一下
        
        ```
        yarn compile-babel
        yarn run v1.16.0
        warning package.json: No license field
        $ babel src/es6.js -o es6_babel.js
        ✨  Done in 2.38s.
        复制代码
        ```
        
    -   再用swc转译一下
        
        ```
        yarn compile-swc  
        yarn run v1.16.0
        warning package.json: No license field
        $ swc src/es6.js -o es6_swc.js
        Successfully compiled 1 file with swc.
        ✨  Done in 0.63s.
        复制代码
        ```
        
    -   两者的产物对比
        
        ```
        // es6_babel
        "use strict";
        
        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
        
        function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
        
        function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
        
        var PI = 3.1415;
        var x = 1;
        var foo = 1,
            bar = 2,
            baz = 3;
        var node = {
          loc: {
            start: {
              line: 1,
              column: 5
            }
          }
        };
        var loc = node.loc,
            start = node.loc.start,
            line = node.loc.start.line;
        
        var sum = function sum(num1, num2) {
          return num1 + num2;
        };
        
        var s = new Set();
        [2, 3, 5, 4, 5, 2, 2].forEach(function (x) {
          return s.add(x);
        });
        
        var Point = /*#__PURE__*/function () {
          function Point(x, y) {
            _classCallCheck(this, Point);
        
            this.x = x;
            this.y = y;
          }
        
          _createClass(Point, [{
            key: "toString",
            value: function toString() {
              return '(' + this.x + ', ' + this.y + ')';
            }
          }]);
        
          return Point;
        }();
        
        // es6 swc
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        function _defineProperties(target, props) {
            for(var i = 0; i < props.length; i++){
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps) _defineProperties(Constructor.prototype, protoProps);
            if (staticProps) _defineProperties(Constructor, staticProps);
            return Constructor;
        }
        var PI = 3.1415;
        var x = 1;
        var foo = 1, bar = 2, baz = 3;
        var node = {
            loc: {
                start: {
                    line: 1,
                    column: 5
                }
            }
        };
        var loc = node.loc, start = node.loc.start, _loc = node.loc, line = _loc.start.line;
        var sum = function(num1, num2) {
            return num1 + num2;
        };
        var s = new Set();
        [
            2,
            3,
            5,
            4,
            5,
            2,
            2
        ].forEach(function(x1) {
            return s.add(x1);
        });
        var Point = /*#__PURE__*/ function() {
            "use strict";
            function Point(x2, y) {
                _classCallCheck(this, Point);
                this.x = x2;
                this.y = y;
            }
            _createClass(Point, [
                {
                    key: "toString",
                    value: function toString() {
                        return "(" + this.x + ", " + this.y + ")";
                    }
                }
            ]);
            return Point;
        }();
        
        
        //# sourceMappingURL=es6_swc.js.map
        复制代码
        ```
        

-   从上面的数据可以看出
    
    -   在打包代码的对比, ESBuild的速度(20ms)远快于Webpack(1680ms)
    -   在编译代码的对比, swc也对babel有比较明显的性能优势(0.63s vs 2.38s).
    -   需要额外说明的是, 用作实例的代码非常简单, 并且在对比中也没有充分使用各个构建工具所有的构建优化策略, 只是对比最基础的配置下几种工具的速度, 这个和各个工具所罗列的benchmark数据会有差异, 并且构建速度也和硬件性能/运行时状态有关.

-   ESBuild/swc这么快? 那是不是可以直接把Webpack/Babel扔掉了? 也别急, 目前的ESBuild和Swc可能还不能完全替代Webpack. 但是通过这篇分享我们也许可以对它们有一个更全面的认知, 也可以探索后边在工作中使用这些新一代前端工具的机会

## ESBuild/swc在前端生态中的定位

-   在当今的前端世界里, 新工具层出不穷, 有的时候不同的工具太多以至于有段时间我完全分不清这些工具各自的功能是什么, 所以我们先来研究一下ESBuild/swc在当今前端工程体系中的角色.

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1d50efb90f8457b813d218a2dbeca6a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

-   从上面的截图中选择几个我们日常接触最频繁的前端工程化工具:
    
    -   **Task Runner 任务运行器**: 开发者设置脚本让构建工具完成开发、构建、部署中的一系列任务, 大家日常常用的是npm/yarn的脚本功能; 在更早一些时候, 比较流行Gulp/Grunt这样的工具
        
    -   **Package Manager 包管理器**: 这个大家都不会陌生, npm/Yarn/pnmp帮开发者下载并管理好依赖, 对于现在的前端开发来说必不可少.
        
    -   **Compiler/Transpiler 编译器**: 在市场上很多浏览器还只支持ES5语法的时候, Babel这样的Comipler在前端开发中必不可少; 如果你是用TypeScript的话, 也需要通过tsc或者ts-loader进行编译.
        
    -   **Bundler 打包工具:** 从开发者设置的入口出发, 分析模块依赖, 加载并将各类资源最终打包成1个或多个文件的工具.
        
        -   Loader: 因为前端项目中包含各种文件类型和数据, 需要将其进行相应的转换变成JS模块才能为打包工具使用并进行构建. JS的Compiler和其他类型文件的Loader可以统称为Transfomer.
        -   Plugin: 可以更一步定制化构建流程, 对模块进行改造(比如压缩JS的Terser)
        -   还有一些前端构建工具是基于通用构建工具进行了一定封装或者增加额外功能的, 比如CRA/Jupiter/Vite/Umi

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99772dda41f841e98884551c4ac00143~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

-   ESBuild的定位是Bundler, 但是它也是Compiler(有Transform代码的能力)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ff3e5e9bbc9418a9d349e644ab26cdd~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

-   swc自称其定位为Compiler + Bundler, 但是目前spack还不是很好用

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d24dd1d5d62f4e9f8157f47d9e01b7e7~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

## ESBuild/SWC为何这么快?

-   思考一下, Go & Rust这两个语言和JavaScript相比有什么差异?

### ESBuild的实现(参考ESBuild [FAQ](https://link.juejin.cn/?target=https%3A%2F%2Fesbuild.github.io%2Ffaq%2F "https://esbuild.github.io/faq/"))

-   **由Go实现并编译成本地代码**: 多数Bundler都是由JavaScript实现的, 但是CLI应用对于JIT编译语言来说是性能表现最不好的。每次运行Bundler的时候, JS虚拟机都是以第一次运行代码的视角来解析Bundler(比如Webpack)的代码, 没有优化信息. 当ESBuild在解析JavaScript的时候, Node还在解析Bundler的JS代码

-   **重度使用并行计算**: Go语言本身的设计就很重视并行计算, 所以ESBuild对这一点会加以利用. 在构建中主要有三个环节: 解析(Parsing), 链接(Linking)和代码生成(Code generation), 在解析和代码生成环节会尽可能使用多核进行并行计算

-   **ESBuild** **中的一切代码从零实现:** 通过自行实现所有逻辑来避免第三方库带来的性能问题, 统一的数据结构可以减少数据转换开销, 并且可以根据需要改变架构, 当然最大的缺点就是工作量倍增.
    
    -   令人想到了SpaceX这家公司, 大量零部件都是自己内部生产, 有效降低生产成本 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bccc1ec726cc4cb6b4bda0f69af27184~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

-   **对内存的高效使用:** ESBuild在实现时尽量减少数据的传递以及数据的转换, ESBuild尽量减少了对整体AST的传递, 并且尽可能复用AST数据, 其他的Bundler可能会在编译的不同阶段往复转换数据格式(string -> TS -> JS -> older JS -> string...). 在内存存储效率方面Go也比JavaScript更高效.

### swc的实现

-   swc的官方文档和网站并没有对swc内部实现的较为具体的解释, 根据其[博客](https://link.juejin.cn/?target=https%3A%2F%2Fswc.rs%2Fblog%2Fperf-swc-vs-babel "https://swc.rs/blog/perf-swc-vs-babel")中的一些分析, babel缓慢的主要原因还是来自于其单线程的特性

### 一点总结

-   从ESBuild和swc的官方资源中, 共同提到的一点就是利用好**并行计算**。JS因为在设计之初的目标就是服务好浏览器场景, 所以单线程 & 事件驱动并不适合用来进行CPU密集的计算, 而ESBuild/Rust也正是在这一点上对基于Node的构建工具拥有系统性的速度优势。

## 如何用ESBuild/swc提效?

-   现在我们知道ESBuild/Rust是做什么的, 并且有什么特点, 我们可以在工作中如何利用ESBuild/swc去改善我们的开发体验呢?

### 使用ESBuild

-   ESBuild在API层面上非常简洁, 主要的API只有两个: Transform和Build, 这两个API可以通过CLI, JavaScript, Go的方式调用
    
    -   Transform主要用于对源代码的转换, 接受的输入是字符串, 输出的是转换后的代码
        
        ```
        # 用CLI方式调用, 将ts代码转化为js代码
        echo 'let x: number = 1' | esbuild --loader=ts => let x = 1;
        复制代码
        ```
        
    -   Build主要用于构建, 接受的输入是一个或多个文件
        
        ```
        // 用JS模式调用build方法
        require('esbuild').buildSync({
          entryPoints: ['in.js'],
          bundle: true,
          outfile: 'out.js',
        })
        复制代码
        ```
        

-   ESBuild的内容类型(Content Type)包括了ES在打包时可以解析的文件类型, 这一点和Webpack的loader概念类似, 下面的例子是在打包时用JSX Loader解析JS文件.

```
require('esbuild').buildSync({
  entryPoints: ['app.js'],
  bundle: true,
  loader: { '.js': 'jsx' },
  outfile: 'out.js',
})
复制代码
```

-   ESBuild也包含插件系统, 可以在构建过程中(Transform API无法使用插件)通过插件更改你的构建流程

```
// 来自于官网的插件示范
let envPlugin = {
  name: 'env',
  setup(build) {
    // Intercept import paths called "env" so esbuild doesn't attempt
    // to map them to a file system location. Tag them with the "env-ns"
    // namespace to reserve them for this plugin.
    build.onResolve({ filter: /^env$/ }, args => ({
      path: args.path,
      namespace: 'env-ns',
    }))

    // Load paths tagged with the "env-ns" namespace and behave as if
    // they point to a JSON file containing the environment variables.
    build.onLoad({ filter: /.*/, namespace: 'env-ns' }, () => ({
      contents: JSON.stringify(process.env),
      loader: 'json',
    }))
  },
}

// 使用插件
require('esbuild').build({
  entryPoints: ['app.js'],
  bundle: true,
  outfile: 'out.js',
  plugins: [envPlugin],
}).catch(() => process.exit(1))
复制代码
```

-   在其他工具中使用ESBuild
    
    -   如果你觉得目前完全使用ESBuild还不成熟, 也可以在Webpack体系中使用ESBuild的loader来替代babel用于进行代码转换, 除此之外, [esbuild-loader](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fprivatenumber%2Fesbuild-loader "https://github.com/privatenumber/esbuild-loader")还可以用于JS & CSS的代码最小化.
        
        ```
        const { ESBuildMinifyPlugin } = require('esbuild-loader')
        
        module.exports = {
            rules: [
              {
                test: /.js$/,
                // 使用esbuild作为js/ts/jsx/tsx loader
                loader: 'esbuild-loader',
                options: {
                  loader: 'jsx',  
                  target: 'es2015'
                }
              },
            ],
            // 或者使用esbuild-loader作为JS压缩工具
            optimization: {
              minimizer: [
                new ESBuildMinifyPlugin({
                  target: 'es2015'
                })
              ]
            }
        }
        复制代码
        ```
        

-   注意点
    
    -   ESBuild不能转ES5代码和一些其他语法, 详情可参考[esbuild.github.io/content-typ…](https://link.juejin.cn/?target=https%3A%2F%2Fesbuild.github.io%2Fcontent-types%2F%23javascript-caveats "https://esbuild.github.io/content-types/#javascript-caveats")

### 使用Vite

-   要说2021年前端圈关注度较高的新工具, Vite可以说是名列前茅, 那么Vite和ESBuild/swc有什么关系呢?

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb125fda8e404b53b5eb17397fbebc33~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

-   Vite的核心理念是使用ESM+编译语言工具(ESBuild)加快本地运行

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9dacb9b990d34349902b58b5b694e12b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

-   Vite在开发环境使用了ESBuild进行预构建, 在生产环境使用了Rollup打包, 后续也有可能使用ESBuild进行生产环境的构建.

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7083f48875524ddbaf0690f91a19df33~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

-   支持ES5需要引入插件 [github.com/vitejs/vite…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fvitejs%2Fvite%2Ftree%2Fmain%2Fpackages%2Fplugin-legacy "https://github.com/vitejs/vite/tree/main/packages/plugin-legacy")

### 使用swc

-   Comilation
    
    -   可以使用swc命令行工具(swc/cli)配合[配置文件](https://link.juejin.cn/?target=https%3A%2F%2Fswc.rs%2Fdocs%2Fconfiguration%2Fswcrc "https://swc.rs/docs/configuration/swcrc")对文件进行编译
        
        ```
        # Transpile one file and emit to stdout
        npx swc ./file.js
        
        # Transpile one file and emit to `output.js`
        npx swc ./file.js -o output.js
        
        # Transpile and write to /output dir
        npx swc ./my-dir -d output
        复制代码
        ```
        
    -   swc的核心部分swc/core主要有三种API
        
        -   Transform: 代码转换API, 输入源代码 => 输出转换后的代码
        -   Parse: 对源代码进行解析, 输出AST
        -   Minify: 对代码进行最小化
    -   swc也推出了swc/wasm模块, 可以让用户在浏览器环境使用wasm进行代码转换
        
    -   如果你想在Webpack体系下使用swc(替代babel), 也可以使用swc-loader
        
        ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea3e9435d7ca4efcb433854a641c4ec5~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)
        

-   Bundle
    
    -   ⚠️swc也支持进行打包功能, 但是目前功能还不很完备, 并且在使用中也有不少Bug. 笔者目前在本地尝试用spack打包一个简单的React应用目前还不成功, 还做不到开箱即用
    -   ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b6a79ef0ca54b3c879a4b0d88b67657~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)
    -   目前swc的Bundle工具叫spack, 后续会改名为swcpack.
    -   打包可以通过[spack.config.js](https://link.juejin.cn/?target=https%3A%2F%2Fswc.rs%2Fdocs%2Fconfiguration%2Fbundling "https://swc.rs/docs/configuration/bundling")文件进行配置

## 一点点总结和思考

### 全文总结

-   ESBuild/swc是用编译型语言编写的新一代前端工具, 对JS编写的构建工具有系统级的速度优势

-   ESBuild可以用于编译JS代码和模块打包, swc号称也都可以支持两者但是其打包工具还处于早期开发阶段

-   目前这两个工具还不能完全替代Webpack等主流工具这些年发展出的庞大生态

-   当已有的基础设施稳定并且替换成本较大时, 可以尝试渐进式的利用新工具(loader)或者Vite这种基于ESBuild二次封装的构建工具

### 延伸思考

-   持续关注前端生态新发展, 利用好开源社区提升研发效率和体验的新工具.

-   在使用新工具的同时, 了解或参与到其背后的技术原理, Go可以作为服务端语言, Rust可以作为系统编程语言, 学习新语言能打开新天地, 岂不美哉?

## ❤️感谢收看❤️

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f960985a9e3345acb498745efcf021ce~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

## 参考资料

-   ESBuild [esbuild.github.io/](https://link.juejin.cn/?target=https%3A%2F%2Fesbuild.github.io%2F "https://esbuild.github.io/")

-   SWC [swc.rs/](https://link.juejin.cn/?target=https%3A%2F%2Fswc.rs%2F "https://swc.rs/")

-   Vite [cn.vitejs.dev/](https://link.juejin.cn/?target=https%3A%2F%2Fcn.vitejs.dev%2F "https://cn.vitejs.dev/")

-   [blog.logrocket.com/using-spack…](https://link.juejin.cn/?target=https%3A%2F%2Fblog.logrocket.com%2Fusing-spack-bundler-in-rust-to-speed-up-builds%2F "https://blog.logrocket.com/using-spack-bundler-in-rust-to-speed-up-builds/")

-   [datastation.multiprocess.io/blog/2021-1…](https://link.juejin.cn/?target=https%3A%2F%2Fdatastation.multiprocess.io%2Fblog%2F2021-11-13-benchmarking-esbuild-swc-typescript-babel.html "https://datastation.multiprocess.io/blog/2021-11-13-benchmarking-esbuild-swc-typescript-babel.html")

-   [blog.logrocket.com/webpack-or-…](https://link.juejin.cn/?target=https%3A%2F%2Fblog.logrocket.com%2Fwebpack-or-esbuild-why-not-both%2F "https://blog.logrocket.com/webpack-or-esbuild-why-not-both/")

## ❤️ 谢谢支持

以上便是本次分享的全部内容，希望对你有所帮助^\_^

喜欢的话别忘了 **分享、点赞、收藏** 三连哦~。

欢迎关注公众号 **ELab团队** 收获大厂一手好文章~

> 我们来自字节跳动，是旗下大力教育前端部门，负责字节跳动教育全线产品前端开发工作。
> 
> 我们围绕产品品质提升、开发效率、创意与前沿技术等方向沉淀与传播专业知识及案例，为业界贡献经验价值。包括但不限于性能监控、组件库、多端技术、Serverless、可视化搭建、音视频、人工智能、产品设计与营销等内容。
> 
> 欢迎感兴趣的同学在评论区或使用内推码内推到作者部门拍砖哦 🤪

字节跳动校/社招投递链接: [job.toutiao.com/s/FFsm2o3](https://link.juejin.cn/?target=https%3A%2F%2Fjob.toutiao.com%2Fs%2FFFsm2o3 "https://job.toutiao.com/s/FFsm2o3")

内推码：3RTMNZM

文章被收录于专栏：

![cover](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d43021e1c95426793444e895b194a88~tplv-k3u1fbpfcp-no-mark:160:160:160:120.awebp)

字节教育前端

我们来自字节跳动，是旗下大力教育前端部门，负责字节跳动教育全线产品前端开发工作。 我们围绕产品品质提升、开发效率、创意与前沿技术等方向沉淀与传播专业知识及案例，为业界贡献经验价值。包括但不限于性能监控、组件库、多端技术、Serverless、可视化搭建、音视频、人工智能、产品设计与营销等内容。

![](https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/00ba359ecd0075e59ffbc3d810af551d.svg) 87

![](https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/3d482c7a948bac826e155953b2a28a9e.svg) 收藏