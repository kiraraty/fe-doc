## 背景

这段时间一个性能号称可以吊打Node和Deno的JavaScript运行时**Bun**(包子)横空出世，立即在JavaScript社区闹得沸沸扬扬。那么到底这个号称快到飞起的包子运行时到底几斤几两呢？这篇文章就让我们通过一些实际的例子来了解一下Bun提供的功能以及它比Node到底快了多少，最后再探讨一下Bun是不是会成为真正的Node killer。

## 什么是Bun

我们先来看官方描述：

> Bun is a fast all-in-one JavaScript runtime
> 
> Bundle, transpile, install and run JavaScript & TypeScript projects — all in Bun. Bun is a new JavaScript runtime with a native bundler, transpiler, task runner and npm client built-in.

**简单来说Bun是一个大而全的JavaScript运行时**。

它不止做了Node和Deno的工作(JavaScript运行时)，而且还`原生`支持下面这些功能:

-   bundler: Bun可以像Webpack等工具一样对我们的项目进行打包
    
-   transpiler: 支持TypeScript/JavaScript/JSX的Transpiling，换句话来说就是你可以在项目里面直接写TypeScript和JSX语法而不用担心配错环境了
    
-   task runner: 可以跑package.json里面的script脚本，类似于`npm run xxx`
    
-   内置的和npm一样的包管理工具: 实现了和npm，yarn和pnpm等包管理工具一样的功能，不过更快
    

有同学看到这里可以会问：这些功能不是现在前端和node生态都支持了吗？有什么好学的？其实不然，Bun的特色其实不在这些功能，而是在`原生`和`快`这两个方面。原生就意味着这是Bun自带的，我们不需要写任何配置文件或者安装任何插件就可以用，这就降低了我们编写代码的成本以及编写效率。而Bun另外一个特点是快，那它有多么快呢？看一些官网的描述:

![图片](https://mmbiz.qpic.cn/mmbiz_png/UdSiaWwo964Mm0eqlibuOlSkzsCdt25Dk3xpqUlia0fAF9Gqoga9ia7WmD9YD2fM6akohjA1dnRSQvxZtc1y3FSuMg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

![图片](https://mmbiz.qpic.cn/mmbiz_png/UdSiaWwo964Mm0eqlibuOlSkzsCdt25Dk30gxETicD0aQcQcSeNicRKyzr7ib6HL6g03Vrm6icbqppxmRvvviabwJiarbA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

  

从上面的描述可以看出这些数据:

-   Bun的服务端渲染速度大概是Node的3倍
    
-   Bun跑脚本的速度大概是`npm run`的30倍
    
-   Bun的下载包的速度是yarn的20倍
    

听起来确实有点快，到底实际效果如何呢？接着就让我们实际看一下。

## Bun功能介绍

这部分内容将会介绍Bun和Node或者Node生态其他工具如npm的对比，而不会涉及到Deno，因为Deno其实和Node的性能没有太大的区别。

### Bundler和Transpiler

作为一个前端工程师，我们经常需要使用Webpack等工具来对我们的代码进行transpile和bundle。和Node不同的是，Bun原生就支持了Bundler和Transipler这些能力，而不用我们额外安装其它依赖。除了这些，Bun还内置了React脚手架的功能，你输入一个命令即可创建一个React应用:

```
bun create react ./react-app
```

上面的命令跑完后会生成一个这样目录结构的项目代码:

```
react-app├── node_modules├── README.md├── bun.lockb├── node_modules.bun├── package.json├── public│   ├── favicon.ico│   ├── index.html│   ├── logo192.png│   ├── logo512.png│   ├── manifest.json│   └── robots.txt└── src    ├── App.css    ├── App.jsx    ├── images.d.ts    ├── index.css    ├── index.jsx    ├── logo.svg    └── reportWebVitals.js
```

从上面的目录结构来看，使用bun创建的React应用十分清爽，基本没有额外的配置文件，可以直接进行代码的编写。最重要的是，**在笔者的渣渣电脑上跑这个命令只需要6.55s!**。而相比之下使用`npx create-react-app`跑了足足`四分钟`才创建出一个React项目来。**换句话来说Bun创建一个React项目的速度是用npm通过create-react-app创建速度的40倍**！单纯从这个速度上看，Bun说自己快如闪电真的不足不为过。

上面生成的代码虽然只有JS文件，不过bun是原生支持TypeScript Transpiler的，所以你直接写TypeScript的代码也是可以运行的。

代码生成后，我们可以通过`bun dev`命令来启动一个监听在`3000`端口的`带热更新`的dev server。这个命令在我的电脑的执行时间是**0.3s**!，还没反应过来服务就起来的。相反使用create-react-app创建的项目用`npm start`耗时是**25s**。单纯看这个case的话，Bun task runner是npm task runner的**83倍**。

在你开发完代码之后运行`bun bun`这个命令就可以对项目打包了，这个命令会打包出一个带有`.bun`后缀的二进制文件，这个命令大概执行了**0.1s**，打包完的文件你直接扔到一个静态服务器就可以访问了。而相对之下，create-react-app创建的应用运行`npm run build`打包耗时**28s**，所以这个情况下，**Bun的速度是npm的280倍**。

这里值得一提的是，虽然bun打包文件相对于使用npm来打包文件快的不止一个数量级，不过**bun还不支持minify和tree-shaking等常见的静态代码优化手段**，这些都在它的RoadMap上面，后面会支持的。到时候加上了这些功能后还有没有这么快，就只能拭目以待了。

### 用Bun开发一个Web服务器

Bun对HTTP服务的支持是很好的，你可以编写极其精简的代码来启动一个Web服务:

```
// http.jsexport default {  port: 3000,  fetch(request) {    return new Response("Hello World!")  }}
```

上面的代码会在3000端口启动一个HTTP服务，这个服务会返回一个`Hello World!`字符串。在笔者的电脑(Macbook Pro 2.9GHz 双核 Intel Core i5 8GB内存)上使用`wrk`工具来测试一下这个服务的性能:

```
wrk -t 10 -c256 -d30s http://localhost:3000/
```

上面的命令会启动10个线程256个链接来连续测试我们的接口30s，最后得到的数据是:

```
Running 30s test @ http://localhost:3000/  10 threads and 256 connections  Thread Stats   Avg      Stdev     Max   +/- Stdev    Latency    17.42ms   40.52ms 515.51ms   96.32%    Req/Sec     2.33k   822.60     4.26k    65.55%  660630 requests in 30.08s, 57.33MB read  Socket errors: connect 0, read 3, write 0, timeout 0Requests/sec:  21963.67Transfer/sec:      1.91MB
```

我们可以看到Bun原生的HTTP服务在我的电脑上的QPS可以达到21963.67，那么我们再来看一下Node的原生HTTP服务的性能可以到多少，代码如下:

```
const http = require('http')const server = http.createServer((req, res) => {  res.end('Hello World!')})server.listen(3000, () => {  console.log('server is up')})
```

上面的代码实现了和Bun的HTTP服务器一样的逻辑，只不过编写的代码多了一丢丢。在同样的电脑使用同样的参数来测试一下Node原生HTTP服务的性能得到的结果是:

```
Running 30s test @ http://localhost:3000/  10 threads and 256 connections  Thread Stats   Avg      Stdev     Max   +/- Stdev    Latency    23.80ms   34.24ms 460.40ms   96.19%    Req/Sec     1.31k   341.72     2.02k    82.15%  376228 requests in 30.07s, 46.64MB read  Socket errors: connect 0, read 58, write 1, timeout 0Requests/sec:  12513.65Transfer/sec:      1.55MB
```

从上面的结果可以看到，Node原生的HTTP服务的QPS是12513。单纯从这个测试结果来看，**Bun的性能大概是Node的1.75倍**。这么一看虽然Bun是快点，不过也没有很夸张。不过这可能也和机器有关，因为我看了一下一些国外博主的测试结果，他们电脑的性能比较好，一样的测试代码，Bun的QPS可以达到200k，而Node只有20k。**从他们的结果来看Bun的性能一下子比Node好了10倍**，这真是质的飞跃了。所以在你的电脑上用Bun和Node实现一个简单的HTTP服务的性能差距又有多大呢？你还不抓紧试一下？

## Bun用作包管理器

上面提到了，Bun内置了一个类似于npm的包管理器。使用Bun安装一个包(moment.js)的命令是:

```
bun install moment
```

上面的命令和`npm install moment`是一样的，会安装一个依赖到node\_modules文件夹里面，这个命令在笔者电脑跑了**2.6s**，然后我们再来跑一下npm:

```
npm install moment
```

一样的电脑，npm跑了差不多**12s**，单纯从安装moment这个包的速度来看，**bun的速度是npm的4.6倍**。而国外博主一般测出的范围是4到80倍，这应该是因为不同依赖安装时间不同导致的。总的来说，Bun作为包管理工具来说真的比npm快了不少，至于和yarn以及pnpm比怎么样的话，有待读者自己验证并将结果留在评论区了。

## Bun作为React服务端渲染的解决方案

Bun原生支持React的server-side rendering，使用Bun实现一个最简单的SSR是这样的:

```
import { renderToReadableStream } from "react-dom/server"const dt = new Intl.DateTimeFormat()export default {  port: 3000,  async fetch(request: Request) {    return new Response(      await renderToReadableStream(        <html>          <head>            <title>Hello World</title>          </head>          <body>            <h1>Hello from React!</h1>            <p>The date is {dt.format(new Date())}</p>          </body>        </html>      )    )  },}
```

访问`localhost:3000`可以得到:

![图片](https://mmbiz.qpic.cn/mmbiz_png/UdSiaWwo964Mm0eqlibuOlSkzsCdt25Dk3GWQVaYBTZpu7tFT5SBa2tVcIP8BWqGdqnsNDXVaCuicqLBK7ibeRKMIg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

截屏2022-08-20 上午10.45.00.png

不过一般人应该不会这么裸写SSR而是用NextJS这种现代化的框架。Bun也考虑到这点，所以它也原生支持Next脚手架。使用下面的命令可以创建一个Bun的Next应用:

```
bun create next next-app
```

上面的命令跑了在我电脑跑了**20s**，而使用npm运行create-next-app跑了10分钟。单纯从这个速度上看**Bun是npm的30倍**。

上面的命令会创建一个监听在3000端口的next应用:![图片](https://mmbiz.qpic.cn/mmbiz_png/UdSiaWwo964Mm0eqlibuOlSkzsCdt25Dk3ACxsyncfCt5VtRfLId4rIlhyNpmQJKRiceahax2Q5TMicV8gQnGjutTQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

我们同样尝试使用`wrk`来测试一下这个Next应用的并发性能:

```
wrk -t 10 -c256 -d30s http://localhost:3000/
```

测试过程中可以看到Bun应用在标准输出疯狂输出然后就奔溃了！没错是真的崩溃了

```
[603.38ms] / - 3 transpiled, 15 imports[604.97ms] / - 3 transpiled, 15 imports[613.77ms] / - 3 transpiled, 15 imports[618.38ms] / - 3 transpiled, 15 imports[621.86ms] / - 3 transpiled, 15 imports[623.29ms] / - 3 transpiled, 15 imports[648.52ms] / - 3 transpiled, 15 importsSegmentationFault at 0x0000000000000000----- bun meta -----Bun v0.1.10 (fe7180bc) macOS x64 21.6.0DevCommand: fast_refresh hot_module_reloading tsconfig filesystem_router framework public_folder bunfig Elapsed: 87754ms | User: 3341ms | Sys: 662msRSS: 127.34MB | Peak: 127.34MB | Commit: 67.15MB | Faults: 4894----- bun meta -----Ask for #help in https://bun.sh/discord or go to https://bun.sh/issues
```

具体原因不知道，不过官方文档也说了现在Bun对Next只是`Partial Support`，也就是部分支持，我们也就不深究原因了。接着我们来看一下一个使用Node跑的Next应用:

而使用create-next-app创建的运行在Node的Next应用是可以通过wrk的测试的，结果如下:

```
Running 30s test @ http://localhost:3000/  10 threads and 256 connections  Thread Stats   Avg      Stdev     Max   +/- Stdev    Latency   922.74ms  200.38ms   2.00s    78.20%    Req/Sec    30.48     22.34   160.00     80.72%  7635 requests in 30.09s, 31.90MB read  Socket errors: connect 0, read 0, write 0, timeout 97Requests/sec:    253.71Transfer/sec:      1.06MB
```

Node的Next应用QPS可以达到253。这也得出一个结论就是**现在Bun还没有完全支持Next的功能，并且很不稳定**。

## Bun一些其他的功能

由于文章篇幅有限，这里就不全部列出Bun所有的功能了，总的来说Bun还有下面这些功能值得读者去自行探索:

-   `bun:sqlite`: Bun内置的对Sqlite数据库操作，性能同样很好
    
-   `bun:ffi`: Bun可以通过ffi调用任何支持C ABI的语言，例如Zig, Rust和C/C++等
    
-   `napi`: Bun支持Node 90%的napi
    

## Bun为什么这么快

从上面笔者的实际使用效果来看，Bun的确比Node快了不少，接着就让我们探索一下Bun比Node快的一些可能原因。

### JavaScriptCore替代V8

这个是Bun官方给出的原因。Bun使用了Apple的JavaScriptCore引擎而不是Google的V8引擎，JavaScriptCore是Safari底层的JS引擎，和V8比起来嵌入成本高一点。至于JavaScriptCore是不是真的比V8性能好的话，这个真的很难判断，我在网上没找到一些不同JS引擎Benchmark的对比数据，反而是一些国外博主实际测试了一下Hermes(Facebook出品)，JavaScriptCore和V8，发现性能上来说**Hermes 略好于 JavaScriptCore 略好于 v8**。不过也就差了一点点，这也和测试代码有关，如果大家能有一些实际的比较权威的测试数据欢迎在留言区评论。

### 使用Zig语言

这个也是Bun官方给出的原因，我们先来看一下原话怎么说的:

> Zig's low-level control over memory and lack of hidden control flow makes it much simpler to write fast software.

它的意思是Bun快的一个原因是使用了Zig这门对内存有更低层次的控制和隐藏控制流的语言。老实说要不是因为Bun我都不知道有这个语言的存在。我Google了一下这门语言，它大概借鉴了Rust的一些思想，目的是想改进C语言，而且发布时间非常短，最早发布于2016年，现在在TIOBE的语言受欢迎榜单连前50都没有。**所以我对这门语言保持了怀疑的态度**。

### 我认为的原因

老实说官网给出的原因我觉得说服力是不够的。依我看来，可能是下面这些原因导致Bun目前性能好于Node

-   Bun还不成熟，很多工业级的功能都没有，等加上这些功能后是不是还比Node快真不知道
    
-   Bun的目的性很强，一开始就知道自己需要提供什么工具解决什么问题，所以它在设计的时候自然而然就会根据具体场景设计一些优化的方案，所以在某些场景下性能会优点，例如包管理等
    

## Bun相比Deno哪里做对了

和之前另外一个Node Killer Deno比起来，我觉得Bun做得对的地方有两点。一个是**兼容Node生态而不是推陈出新**。这一点其实很重要，因为从Node 2009年发布而来已经在很多大公司使用实践了，拥有巨大的生态系统。Deno一开始压根就没有想着兼容Node，所以它的很多轮子都要重新造，并且现有Node应用迁移起来十分困难，所以你看看Deno v1也发布了两年多了，该用Node的还在用Node。不过幸运的是，Deno团队也意识到了这些问题，在1.15后允许你使用std/node来运行部分Node应用。和Deno不同，Bun一开始就将兼容Node放在了第一位，虽然现在还没有做到完全兼容Node的API，不过这是它一直奋斗的目标，你想一下，如果有一天Bun做到Node应用无缝迁移，还有Deno什么事吗？

Bun做对的另外一个事是，它解决了一个Node生态的痛点，**就是慢**，特别是安装依赖和启动项目慢。这些是很重要也是很普遍的问题，所以它可以成为一个充足的理由让Node开发者愿意迁移到成熟的Bun。而相反Deno并没有解决这个问题，而是解决了一些我个人觉得不是那么普遍的问题，所以原来的Node开发者迁移到Deno动力也就不足了。

## Bun会不会成为Node Killer

Bun和Deno比起来好那么多，那么是不是意味着它会成为真正的Node killer呢？先说结论，**我觉得Bun不会成为Node Killer，最起码未来几年不会**。

在我看来，Bun存在下面这些问题。

-   Zig语言的局限性
    
-   All-in-one的架构设计
    
-   远不完备的功能
    

### Zig语言的局限性

上面在说Bun为什么这么快的原因时有提到Zig语言是一门很年轻而且并不受欢迎的语言。很年轻就意味着这门语言可能还会存在很多没经过实践检验的bug，不那么受欢迎就意味着这门语言的开发者群体少，也就意味着Bun的contributor的潜在开发人员少。这些原因都会阻碍Bun的发展。

### All-in-one的架构设计

在日常工作中，我发现如果一个人什么都想做好的话，往往会导致他最后什么都没做好，究其原因是因为一个人的精力是有限的。

虽然项目不同于人，不过也可以进行类比。Bun的目标很远大什么都想做，并且什么都想做好(你不做好别人也不会用)。这里有两个问题，一个是你真的是什么都可以做吗？按照官网的介绍来说Bun现在支持JSX，可是Vue和Angular的Transpile方式是和React不一样的，除了这两个框架还有Svelte等等其他框架而且未来可能还有更多新的框架，你真的可以每一个框架都支持吗？另外一个问题是什么都想做好，前面提到Zig语言的时候就说了，这是一门不那么受欢迎的语言，也就是说很少这方面优秀的编程专家，因此Bun后面开发起来估计会很吃力，总不能一直靠这几个人吧？既然开源出去了社区参与才是王道，而Zig语言的局限性就意味着能参与的优秀开发会很少，质量自然而然就比较难保证了。

相反我觉得Bun可以学习Unix的那种办法`having small independent tools that do one thing well and still can play together`的思想。换句话来说，就是不用什么都要做，而是提供一个类似于bun-core的核心，这个核心是一个JS运行时+包管理器，**它保证了Bun飞快的JS运行速度，高效的包管理以及兼容所有的NodeAPI**，因为这些才是它的核心。然后bun-core对外提供API支持外界扩展它的功能，这部分扩展的功能由对应的社区开发者开发，这样Bun才不会最后变成一个什么都做不好的庞然大物。

### 远不完备的功能

我觉得Bun暂时替代不了Node的最后一个原因是它目前还欠缺了很多核心的功能，所以远远达不到可以在生产环境使用的效果。在介绍Bun的Transpiler功能的时候，你也发现Bun还不支持Minify和Tree-Shaking等常用的功能，其实不止这样，如果你看一下Bun的RoadMap，你会发现它连百分之20的功能都没开发完，也就是说还需要很长很长的一段时间我们才能在实际中使用。

## 总结

这篇文章我为大家介绍了一个全新的JS运行时Bun，它最大的特点就是快，不过我觉得大家现在大概了解这个技术并保持一定的关注程度即可，不用那么着急投入到学习中去，因为它未来的道路不确定性还是很大的，**目前来说还做不了Node killer**。