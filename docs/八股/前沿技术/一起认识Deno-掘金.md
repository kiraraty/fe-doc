动态语言都是非常实用的工具，用户可以通过脚本把非常复杂的系统给链接到一起，并且不用花费心思去考虑内存管理等问题。

JavaScript 是应用最广泛的动态语言，只需一个 Web 浏览器就能在所有设备上运行。而Node.js是一个基于Chrome V8引擎的JavaScript运行时（可以理解为一个容器，提供JavaScript解析+各种能力）。

## 🤔️Node.js怎么了？

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/245983/1589805719512-dfb25271-4d0a-4500-85a5-482c50f3d69c.png "image.png")

Node.js诞生2009年，它的到来对前端领域产生了非常重大的影响，它也使得前后端使用同一种语言，统一模型的梦想得以实现。但是在这十多年间，强大的Node.js也慢慢地暴露出了它的缺点。在2018年，Node.js之父Ryan Dahl发表了一篇演讲，在这次演讲中他提到了“Node.js令我感到遗憾的10件事”。

## 1\. 没有坚持使用Promise

在Node.js中，对于异步处理同时存在两种方式：callback写法与Promise写法。在8.0版本以前，Node.js的异步API基本上都是用callback的方式来写的：

```
fs.readFile('文件.txt', data, (err) => {
  if (err) throw err;
  console.log('文件已被保存');
});
复制代码
```

为了靠近Promise，一方面Node.js慢慢增加了一部分Promise写法的API，另一方面在util包中增加了一个promisify接口用于把回调方式的API转换为Promise方式：

```
const {promisify} = require('util')
const readFile = promisify(fs.readFile)
readFile('./conf.js').then(data=>console.log(data))
复制代码
```

## 2\. 没有足够的安全性

在Node.js中，任何人编写的程序都可以随意地访问系统和网络，这将会很容易导致安全问题。例如：假如我们通过`npm`安装了一个依赖`a-mod`，但很多情况下我们并不知道这个包内部的代码逻辑是怎么样的，它有可能会在提供服务的同时，在我们毫不知情的情况下偷偷地删除我们本地的文档（只是恶趣味），甚至更危险的事情。

## 3\. node\_modules

随着Node.js的发展，`node_modules`很容易变得越来越大越来越沉重，并且模块的解析复杂度也在随着它增大而增大。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/245983/1590053812889-ac358887-bafa-44f3-8640-df937a9173a7.png "image.png")

## ......

## 🤯Deno又是啥？

2020年5月13日，Deno 1.0正式发布，它正是出于我们上文中提到的Node.js的作者Ryan Dahl之手。而Deno与Node.js一样，都是一个基于Chrome V8引擎的JavaScript运行时。通过它的名字（no与de的拼接），结合作者在18年时对Node.js的吐槽，虽然我们不能认定Deno会是Node.js的替代品，但是它肯定是一个避免了Node.js某些设计缺陷的新尝试。

## 1\. 统一使用Promise接口

与Node.js不同，Deno统一使用Promise接口，配合async写法使得整个系统变得流畅和统一了。

```
// Deno.create方法可以创建或读取一个文件
const file = await Deno.create("./foo.txt");
console.log(file);
复制代码
```

值得一提的是，Deno支持 `top-level-await`，即我们可以直接在最外层代码中使用`await`关于`top-level-await`的更多信息可以参考以下文章：[Top-level await](https://link.juejin.cn/?target=https%3A%2F%2Fv8.dev%2Ffeatures%2Ftop-level-await "https://v8.dev/features/top-level-await")。

## 2.内置Typescript

如果我们要在 Deno 中使用TypeScript的话，无需执行任何操作。没有Deno时，我们必须要将我们编写的TypeScript代码编译为JavaScript才能够运行。Deno将会直接在它内部进行这个编译的过程，降低了上手的成本。

## 3\. 兼容ES6模块语法

Node.js模块遵循的是CommonJS规范，这就导致了它无法完美兼容ES6的module语法。而Deno使用了TypeScript语言，这将完全兼容ES模块（TypeScript也有一套它自己的模块管理规范，但同时兼容ES6 module语法）。如果想要再了解一下这些模块管理规范的区别的话，可以参考以下文章：[exports、module.exports 和 export、export default 到底是咋回事](https://juejin.cn/post/6844903489257095181 "https://juejin.cn/post/6844903489257095181")。

## 4.再也没有node\_modules

我们在使用Node.js时，通常每个工程都需要通过`npm i`来安装所需依赖。npm的存在的优点是集思广益，极大地丰富了Node.js生态，为使用者提供了又大又全的功能。但是它也有一些缺点，例如它导致全世界都被`node_modules`占领了：一个发布到npm上的包在全世界无数台电脑上都有它各种版本的副本，这正是中心化的模块存储方式造成的。

Deno采用不强制中心化存储方式，换句话说你可以加载任何地方的模块。

```
// 可以直接通过url引入
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
复制代码
```

它具有以下特点：

-   不再有中心化的包管理器了。你可以直接通过url导入ECMAScript模块；
    
-   不再有“神奇的”Node.js 模块解析。现在语法是明确的，这让各种事情更容易推理；
    
-   不再有`node_modules`目录；
    

上述第一点提到的去中心化可以说是Deno作出的一次勇敢的尝试，但是它其实也有一些问题：

-   实际上还存在一个`node_modules`（下文会提到）只是不会被用户轻易看到；
-   正常来说依赖的下载会放在第一次加载的时候（也可以通过deno cache命令在不执行代码的情况下缓存依赖），所以整体看来第一次启动还是很慢的；
-   很难控制版本，需要配合 `deps.ts` 使用（下文会提到）；

既然Deno并没有`node_modules`，那么总得有一个地方存放依赖吧？

其实存放依赖的目录是通过`DENO_DIR`这个环境变量来控制的（其实也是`node_modules`），它的初始值为 `$HOME/.deno`。

我们可以通过以下命令，查看当前电脑已经缓存的依赖：

```
tree $HOME/Library/Caches/deno
复制代码
```

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/245983/1590063121826-5cfa1e52-51c7-4dd0-af0b-47143c8e794c.png "image.png")

## 5\. 使用dep.ts和url进行版本控制

基本上我们每个工程都是围绕`package.json`建立的。它已经膨胀得很大了，其中包含许多职责，诸如：

-   保留项目的元数据；
    
-   列出项目依赖项和版本控制；
    
-   将依赖项分类为`dpendencies`或`devDependencies`；
    
-   定义程序的入口点；
    
-   存储与项目相关的 Shell 脚本；
    
-   ......
    

相比于`package.json`最早的用意（可能只是描述一个包信息而已），它变得过于复杂。Deno选择将它抛弃，利用`deps.ts`取而代之，进行版本控制（和我们工程中`Constant.js`差不多）。

在内部，依赖项被重新导出。这就能让应用程序中的不同模块都引用相同的源。

```
export { assert } from "https://deno.land/std@v0.39.0/testing/asserts.ts";
export { green, bold } from "https://deno.land/std@v0.39.0/fmt/colors.ts";
复制代码
```

如果要更新任何模块，我们只需要在`deps.ts`中更改url。

## 6\. 具有安全机制

默认情况下 Deno 中的代码会在安全的沙箱中执行。未经允许，脚本无法访问硬盘驱动器、打开网络连接或进行其他任何可能引入恶意行为的操作。浏览器提供了用于访问相机和麦克风的 API，但用户必须首先授予权限才能启用它们。Deno在终端中提供了模拟行为。

要查看权限示例的完整列表，请输入以下命令：

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/245983/1590063807760-3c605d00-3f6f-4b60-9e29-2365251cf768.png "image.png")

## 7\. 提供一套内置工具

在我们开发的过程中，很多时候需要使用一些实用工具（例如：webpack，babel，eslint，prettier......），Deno 内置了开发者需要的各种功能包括打包、格式美化、测试、安装、文档生成等软件生命周期的各种功能。

```
deno bundle：将脚本和依赖打包
deno eval：执行代码
deno fetch：将依赖抓取到本地
deno fmt：代码的格式美化
deno help：等同于-h参数
deno info：显示本地的依赖缓存
deno install：将脚本安装为可执行文件
deno repl：进入 REPL 环境
deno run：运行脚本
deno test：运行测试
复制代码
```

Deno 本身就是一个完整的生态系统，具有运行时和自己的模块/包管理系统。这才有了更大的空间来内置所有工具。

虽然目前还没有办法在Deno中替换整个前端构建管道，但是随着Deno生态的发展，相信这一天已经不会太远了。

## 8\. 更靠近JavaScript API

Deno是精心设计的，避免偏离标准化的浏览器JavaScript API。Deno 1.0 提供以下与 Web 兼容的 API：

-   addEventListener
-   atob
-   btoa
-   clearInterval
-   clearTimeout
-   dispatchEvent
-   fetch
-   queueMicrotask
-   removeEventListener
-   setInterval
-   setTimeout
-   AbortSignal
-   Blob
-   File
-   FormData
-   Headers
-   ReadableStream
-   Request
-   Response
-   URL
-   URLSearchParams
-   console
-   isConsoleInstance
-   location
-   onload
-   onunload
-   self
-   window
-   AbortController
-   CustomEvent
-   DOMException
-   ErrorEvent
-   Event
-   EventTarget
-   MessageEvent
-   TextDecoder
-   TextEncoder
-   Worker
-   ImportMeta
-   Location

这些都可以在程序的顶级范围内使用。这意味着如果你不去用`Deno()`命名空间上的任何方法，那么你的代码应该能同时与Deno和浏览器兼容。尽管这些Deno API并不是都 100％符合其等效的Web规范，但这对前端开发人员而言仍然是一个很大的好处。

总体而言，如果服务端和浏览器端存在相同概念，Deno就不会创造新的概念。这一点其实Node.js也在做，旨在实现 `Universal JavaScript` 和 `Spec compliance and Web Compatibility`的思想，这是一个大趋势。

## 9.标准库

Deno团队为开发者提供了一个没有外部依赖的、实用的、高频的开发库，减轻我们开发的负担：

-   [node](https://link.juejin.cn/?target=https%3A%2F%2Fdeno.land%2Fstd%2Fnode "https://deno.land/std/node")：node API 兼容模块；
-   [io](https://link.juejin.cn/?target=https%3A%2F%2Fdeno.land%2Fstd%2Fio "https://deno.land/std/io")：二进制读写操作；
-   [http](https://link.juejin.cn/?target=https%3A%2F%2Fdeno.land%2Fstd%2Fhttp "https://deno.land/std/http")：网络和 web 服务相关；
-   [path](https://link.juejin.cn/?target=https%3A%2F%2Fdeno.land%2Fstd%2Fpath "https://deno.land/std/path")：文件路径相关；
-   [colors](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fdenoland%2Fdeno%2Fblob%2Fmaster%2Fstd%2Ffmt%2Fcolors.ts "https://github.com/denoland/deno/blob/master/std/fmt/colors.ts")：输出有颜色的文字，类似 chalk 库；
-   [printf](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fdenoland%2Fdeno%2Fblob%2Fmaster%2Fstd%2Ffmt%2Fsprintf.ts "https://github.com/denoland/deno/blob/master/std/fmt/sprintf.ts")：格式化输出，类似 C 语言的 printf；
-   [tar](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fdenoland%2Fdeno%2Fblob%2Fmaster%2Fstd%2Farchive%2Ftar.ts "https://github.com/denoland/deno/blob/master/std/archive/tar.ts")：解压与压缩；
-   [async](https://link.juejin.cn/?target=https%3A%2F%2Fdeno.land%2Fstd%2Fasync "https://deno.land/std/async")：生成异步函数的；
-   [bytes](https://link.juejin.cn/?target=https%3A%2F%2Fdeno.land%2Fstd%2Fbytes "https://deno.land/std/bytes")：二进制比较和查找等；
-   [datetime](https://link.juejin.cn/?target=https%3A%2F%2Fdeno.land%2Fstd%2Fdatetime "https://deno.land/std/datetime")：日期相关；
-   [encoding](https://link.juejin.cn/?target=https%3A%2F%2Fdeno.land%2Fstd%2Fencoding "https://deno.land/std/encoding")：文本的与二进制的转化、CSV和对象转化、yarml 和对象转化等；
-   [flags](https://link.juejin.cn/?target=https%3A%2F%2Fdeno.land%2Fstd%2Fflags "https://deno.land/std/flags")：命令行参数解析；
-   [hash](https://link.juejin.cn/?target=https%3A%2F%2Fdeno.land%2Fstd%2Fhash "https://deno.land/std/hash")：字符转 sha1 和 sha256；
-   [fs](https://link.juejin.cn/?target=https%3A%2F%2Fdeno.land%2Fstd%2Ffs "https://deno.land/std/fs")：文件系统模块，类似 node 的 fs 模块；
-   [log](https://link.juejin.cn/?target=https%3A%2F%2Fdeno.land%2Fstd%2Flog "https://deno.land/std/log")：日志管理；
-   [permissions](https://link.juejin.cn/?target=https%3A%2F%2Fdeno.land%2Fstd%2Fpermissions "https://deno.land/std/permissions")：权限相关；
-   [testing](https://link.juejin.cn/?target=https%3A%2F%2Fdeno.land%2Fstd%2Ftesting "https://deno.land/std/testing")：测试和断言相关；
-   [uuid](https://link.juejin.cn/?target=https%3A%2F%2Fdeno.land%2Fstd%2Fuuid "https://deno.land/std/uuid")：用于生成 UUID；
-   [ws](https://link.juejin.cn/?target=https%3A%2F%2Fdeno.land%2Fstd%2Fws "https://deno.land/std/ws")：WebSocket 相关；

从这个点上来看，Deno 既做运行环境又做基础生态，有效缓解了npm生态下选择困难症。集成了官方包对功能确定的模块来说是很有必要的，而且提高了底层库的稳定性，除此之外Deno生态也有三方库，而且本质上三方库和官方库在功能上没有任何壁垒，因为实现代码都是类似的。

## ......

## 🤩总结

以下图片概括了Node与Deno之间的差异：

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2020/png/245983/1590052541357-c19161c9-0cbd-41a7-a59f-4011840e3dfa.png "image.png")

Deno的出现令人振奋，但是它仍不能完全替代 Nodejs，这背后的原因主要是历史兼容成本，也就是完整支持整个Node生态不只是设计的问题，更是一个体力活，需要一个个高地去攻克。

同样的，Deno对Web的支持也让人耳目一新，但是目前阶段应该仍不能放到生产环境使用，除了官方和三方生态还在逐渐完善外，`deno bundle`对`Tree Shaking`能力的缺失以及构建产物无法保证与现在的webpack完全相同，这样会导致对稳定性要求极高的大型应用迁移成本非常高。

最亮眼的改动是模块化部分，依赖完全去中心化从长远来看是一个非常好的设计，只是基础设施和生态要达到一个较为理想的水平。

尽管Deno可能还无法完全替代Node.js，但它已经成为了可以日常使用的绝佳编程环境。

## 😘参考文档

-   [Deno 1.0即将发布，你需要知道的都在这里了](https://link.juejin.cn/?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FYZ39X_-nij-8Hl8vwsFBJA "https://mp.weixin.qq.com/s/YZ39X_-nij-8Hl8vwsFBJA")；
-   [Deno - 下一代Nodejs来了](https://juejin.cn/post/6844904118297821192 "https://juejin.cn/post/6844904118297821192")；
-   [20 分钟入门 deno](https://juejin.cn/post/6844904158512807949 "https://juejin.cn/post/6844904158512807949")；
-   [Deno手册](https://link.juejin.cn/?target=https%3A%2F%2Fnugine.github.io%2Fdeno-manual-cn%2Fintroduction.html "https://nugine.github.io/deno-manual-cn/introduction.html")；
-   [Deno 正式发布，彻底弄明白和 node 的区别](https://juejin.cn/post/6844904158617665544 "https://juejin.cn/post/6844904158617665544")；
-   [精读《Deno 1.0 你需要了解的》](https://juejin.cn/post/6844904153106350088 "https://juejin.cn/post/6844904153106350088")；
-   [Deno 1.0正式发布！这是来自官方团队的安利](https://link.juejin.cn/?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FCiZOtVoFl-LhzHXyLHiJ2Q "https://mp.weixin.qq.com/s/CiZOtVoFl-LhzHXyLHiJ2Q")；