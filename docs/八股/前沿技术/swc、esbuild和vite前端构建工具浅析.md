## 背景

过去几年里，前端又推出了一堆新的构建工具🔧，例如像以轻量快速著称的`snowpack`（目前已经不维护了，并推荐使用Vite）、编译速度超越`Babel`几十倍的`SWC`、打包和压缩资源速度惊人的`esbuild`，以及如今呼声最高，被誉为前端下一代构建工具的`Vite`。这么多的工具的推出，让以前一家独大的`webpack`突然失去的声音，甚至前端构建领域掀起了一场`去webpack`的浪潮🌊。今天就让我们简单了解下这些构建工具的代表`SWC`、`esbuild`和`Vite`。

## SWC

## 简介

受限于JS的语言本身效率的问题，近几年前端领域出现了不少工具被`Rust`重写，其中就包括编译`JS/TS`文件速度比`Babel`快不少的`SWC`，其所对标的工具就是`Babel`。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ffe0fa17a82400fa15e53379939aa7b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

`SWC`全称为`Speed Web Compiler`，其是基于Rust实现的工具，目前被很多前端知名项目（Next.js、Parcel和Deno）所使用。

## 核心功能库

**@swc/cli:** CLI 命令行工具，可通过命令行编译文件。

**@swc/core:** 编译转码核心的API的集合。

**swc-loader:** 该模块允许您将 SWC 与 webpack 一起使用。

**@swc/wasm-web:** 该模块允许您使用 WebAssembly 在浏览器内同步转换代码。

**@swc/jest:** 该模块可以让jest的tranform速度更快。

而这些功能库几乎都能在Babel找到对应的库，例如`@babel/cli`、`@babel/core`、以及`babel-loader`等。也更加印证了SWC的竞争对手就是Babel。

## 功能介绍

### 编译JS文件

通过将一个es6语法的JS文件，编译为es5的语法来比较两款工具编译能力：

**Babel的编译结果：** ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d36a9b9ab18a414099f8acfb97e2de2c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

**SWC的编译结果：** ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e308e1276291455f9bc24991c040efa6~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp) 最终SWC只花了`0.12s`，Babel花了`1.08s`，SWC的编译速度约为Babel的近9倍🚀。

### 在webpack中使用

在webpack中SWC也可以和babel掰掰手腕，SWC提供了`swc-loader`，其实也跟`babel-loader`的作用差不多。

在没有无缓存的情况下比较babel-loader与swc-loader在webpack中的编译情况：

**babel-loader的编译耗时：** ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5bce088e3354117a23398a443979241~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

**swc-loader的编译耗时：**

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d5621b385b94ce7ba485370b7045212~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

最终swc-loader只花了`4.89s`就完成了文件编译工作，而babel-loader花了`12.56s`，可见即使是在webpack中，swc的编译效率依旧很高。

### swcpack

swc的打包能力还在建设中，目前只能在`spack.config.js`文件中进行一些简单的配置，预计在V2版本会SWC的bundle能力会有较大的提升。

```
// spack.config.js
const { config } = require('@swc/core/spack')

module.exports = config({
    entry: {
        'web': __dirname + '/src/index.ts',
    },
    output: {
        path: __dirname + '/lib'
    },
    module: {},
});
复制代码
```

### 配置文件

swc有自己的配置文件`.swcrc`，与babel的配置文件不同的是swc的配置文件基本做到开箱即用，不需要进行对插件或预设进行二次安装。

```
{
  "jsc": {
    "parser": { 
      // 语法,支持ecmascript和typescript 
      "syntax": "ecmascript", 
      // 是否解析jsx，对应插件 @babel/plugin-transform-react-jsx 
      "jsx": false, 
      // 动态加载 等同于 @babel/plugin-syntax-dynamic-import 
      "dynamicImport": true, 
      // 装饰器 等同于 @babel/plugin-syntax-decorators 
      "decorators": false, 
      //顶层await 等同于@babel/plugin-syntax-top-level-await 
      "topLevelAwait": false, 
      ... 
      // 支持多种编译插件的配置
      },
    // 编译目标 
    "target": "es5", 
    // 等同babel-preset-env的松散配置 
    "loose": false, 
    // 输出代码可能依赖于辅助函数来支持目标环境。
    "externalHelpers": false
  }, 
  // 压缩代码 
  "minify": false
}
复制代码
```

详细配置见[官网配置](https://link.juejin.cn/?target=https%3A%2F%2Fswc.rs%2Fdocs%2Fconfiguration%2Fswcrc "https://swc.rs/docs/configuration/swcrc")。

## 小结

**优势：**

-   编译速度快
-   迁移成本低，基本可以从babel无痛迁移并能覆盖基本的使用场景。

**不足：**

-   生态相比于babel来说不够完善，用户的覆盖面也不高，某些场景可能会有试错成本。
-   若需要深入开发的话，需要学习Rust，有较高的学习成本。
-   SWC虽然有bundle能力，但是bundle能力还不太完善，目前其在工程化领域更像是Compiler（编译工具）。

## esbuild

## 简介

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d51d171e16434fa981794c07e27d3a9d~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

`esbuild`基于Golang开发的一款打包构建工具，相比传统的打包构建工具，主打性能优势，在构建速度上可以快 10~100 倍。

下图为esbuild和其他的构建工具用默认配置打包10个three.js库所花费时间的对比，我们能看见esbuild比webpack5的构建速度快了很多倍。 ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63cbbab4f2b24adf8176182be0ca7a2f~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

## 为什么能这么快？

根据官网esbuild的FAQ给出解释，简要总结下esbuild相比于传统构建工具有以下优势：

-   **语言优势**。esbuild是基于go语言，传统的JS开发的构建工具并不适合资源打包这种 CPU 密集场景下，go更具性能优势。
-   **多线程能力**。go具有多线程运行能力，而JS本质上就是一门单线程语言。由于go的多个线程是可以共享内存的，所以可以将解析、编译和生成的工作并行化。
-   **从零开始**。从一开始就考虑性能，不使用第三方依赖，从始至终是使用的是一致的数据结构从而避免昂贵的数据转换。
-   **内存的有效利用**。webpack的工作机制在经过不同的工具链的时候，都会进行（`string => AST => string => ... => string`）string到AST的不断转换，这样实际上会占用更多的内存并降低速度。而esbuild从头到尾尽可能的共用一份AST，从而降低内存的占用，提升编译速度。

## 主要功能

### 核心API

esbuild对外提供了两个核心API——tranform和build，主要功能如下：

-   支持将js、ts、jsx、tsx、css等一系列文件的转译。
-   支持文件监听和devServer。
-   支持sourcemap。
-   支持code-splitting。
-   支持tree-shaking和文件压缩。
-   ...

详细的可见[官方文档](https://link.juejin.cn/?target=https%3A%2F%2Fesbuild.github.io%2Fapi%2F%23transform-api "https://esbuild.github.io/api/#transform-api")。

### esbuild-loader

也许我们单纯去使用esbuild去编译打包我们的项目还是比较麻烦，esbuild所提供的esbuild-loader帮我们解决了这个难题。在webpack中我们可以通过esbuild-loader体验到惊人的JS/TS文件编译的速度和高效的压缩能力。

接下来对比下在webpack环境下`esbuild-loader`和`TerserPlugin`的压缩效率：

**TerserPlugin的压缩耗时：** ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00cc62c2e33c46169789efb629db0279~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

**esbuild-loader的压缩耗时：** ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/141d7567ef5e4e77971eebe7f53f542c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

两者压缩之后的JS产物的大小几乎没有太大差别，但是`TerserPlugin`所花费的时间是`esbuild-loader`的10多倍。

## 小结

**优势：**

-   构建速度非常快
-   压缩能力也非常强，可支持JS和CSS的压缩。

**不足：**

-   其tranform的API不能将产物编译到es5及以下，产物无法兼容低版本的浏览器。
-   直接使用esbuild进行打包具有一定的使用成本，并且不能完全覆盖使用场景。
-   在代码分割和 CSS 处理方面功能还有待完善。

## Vite

## 简介

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/067e2f0b8f2b4a7c8e04918ea004c6c5~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp) webpack的`冷启动`和`热更新速度`一直被人诟病，也由此被戏称没有一个程序员能拒绝在启动一个webpack项目的时候冲一杯咖啡☕️。而一众`基于浏览器原生ESM支持`实现的`no-bundle`构建工具的问世，让前端开发者又看到了新的希望，其中Vite又属于是`no-bundle`构建工具阵营中的集大成者。

## 特点

-   **快速的冷启动**：Vite基于`ESM`的支持实现了`no-bundle`服务，并且通过`esbuild`完成对依赖预构建工作。
-   **毫秒级的热更新**：不同于webpack的HMR（热更替），`Vite基于原生ESM实现一套HMR方案`，其可以精确锁定HMR的更新边界，无需重新构建；并利用浏览器缓存策略提升请求速度。
-   **开箱即用**：Vite就像CRA一样内置了对大部分文件的支持，并拥有一套，把用户的使用成本降到最低。
-   **强大的插件生态**：Vite继承了Rollup优秀的插件接口设计，意味着Vite用户可以利用Rollup强大的生态系统进行功能的扩展。

## 预构建的作用

-   **转换文件格式**：由于一些第三方依赖并没有ESM版本，而为了能在Vite上运行他们，则需要将其他格式转化为ESM的格式并缓存入 `node_modules/.vite`（默认路径）。
-   **减少HTTP请求**：Vite 将有许多内部模块的 ESM 依赖关系转换为单个模块，以提高后续页面加载性能。例如像lodash-es这种库里面许多单独的文件相互导入，当我们执行 `import { debounce } from 'lodash-es'` 时，浏览器同时发出 600 多个 HTTP 请求。

## 小结

**优势：** 前面我们介绍Vite特点的时候就已经介绍了Vite的优势了，这边就不再赘述了。

**不足：**

-   项目启动或使用懒加载时页面加载时间过长
    
    `no-bundle`是一个双刃剑，虽然减少了开发环节构建时间，但是大量未经打包的ESM模块可能导致出现大量HTTP请求，从而导致页面加载会变得很慢。这也是为什么Vite在生产环境还是选择rollup进行打包，而不是直接用原生ESM模块。
    
-   预构建影响devServer性能
    
    由于首次预构建在devServer启动之前，若页面依赖较多预构建就会长时间阻塞devServer，从而导致页面加载时间过长；当依赖发生变化，导致页面重新加载。
    
-   生态相比于webpack还有一定差距，不过差距正在不断缩小。
    

## 总结

未来肯定会有更多的人不断的开始使用这些非JS开发的前端工具链，因为JS本身语言的种种性能问题，随着前端越来越注重性能和体验，像`SWC`和`esbuild`这类工具会越来越多。并且随着浏览器兼容性越来越好，`no-bundle`可能将是未来的一个趋势，未来会有更多的开发者完善相关的生态，而像Vite这类`no-bundle`工具和传统的`bundle`类构建工具终会有一次“时代交接”。

## 附录

-   [swc官方文档](https://link.juejin.cn/?target=https%3A%2F%2Fswc.rs%2F "https://swc.rs/")
-   [esbuild官方文档](https://link.juejin.cn/?target=https%3A%2F%2Fesbuild.github.io%2F "https://esbuild.github.io/")
-   [webpack or esbuild: Why not both?](https://link.juejin.cn/?target=https%3A%2F%2Fblog.logrocket.com%2Fwebpack-or-esbuild-why-not-both%2F "https://blog.logrocket.com/webpack-or-esbuild-why-not-both/")
-   [Vite官方文档](https://link.juejin.cn/?target=https%3A%2F%2Fwww.vitejs.net%2F "https://www.vitejs.net/")
-   [深入理解Vite核心原理](https://juejin.cn/post/7064853960636989454 "https://juejin.cn/post/7064853960636989454")