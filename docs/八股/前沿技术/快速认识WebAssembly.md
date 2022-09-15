   

[![](https://p3-passport.byteimg.com/img/user-avatar/ee5b3d33c959244bf7b70b28bb3a4d07~100x100.awebp)](https://juejin.cn/user/4406498333033918)

2022年06月19日 22:21 ·  阅读 5616

![快速认识 WebAssembly ](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31c5f5fbdc0a4acf8b6d14633e1aa357~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?)  

持续创作，加速成长！这是我参与「掘金日新计划 · 6 月更文挑战」的第 19 天，[点击查看活动详情](https://juejin.cn/post/7099702781094674468 "https://juejin.cn/post/7099702781094674468")

WebAssembly 即 Wasm 就像浏览器运行时的一种高效的低级编程语言，它可以将高级语言编译成二进制格式，并在WEB上运行它们，而不需要浏览器或插件。

### 为什么需要WebAssembly

尽管现代 JavaScript 是一种相当快的语言，但它是不可预测的，执行也不一致。而且，它不是一个好的编译目标。实用插件对于用户体验相当不友好且不可行，诸如 `Elm`、`Dart` 等新语言来编译脚本语言。谷歌和Mozilla创建了[Native Client](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.chrome.com%2Fdocs%2Fnative-client%2F "https://developer.chrome.com/docs/native-client/")和 [asm.js](https://link.juejin.cn/?target=https%3A%2F%2Fcodedocs.org%2Fwhat-is%2Fasm-js "https://codedocs.org/what-is/asm-js") 来满足复杂应用的需求。然而，所有这些尝试都未能解决WEB上安全快速代码的问题。

WebAssembly 最早是在2015年由 JavaScript 的创造者Brendan Eich提出的。继JavaScript之后，它是第一种得到普遍支持的语言。万维网联盟（W3C）在2017年开发了WebAssembly，当时的目标：

-   **快速，高效和平台**：它使用常见的硬件功能在不同的平台上执行接近本机的代码性能。紧凑的代码可以在一次传递中被解码、验证和编译，与即时或提前编译一样。
-   **可读可调试**：代码定义良好，便于检查和调试，程序可以被分解成可以独立工作的模块（更小的部分）。
-   解码、验证和编译是可流式的（在看到所有数据之前开始）和可并行化（可以拆分为许多独立的并行任务）。
-   不要破坏WEB，保持向后兼容性。

### WebAssembly 定义

Wasm 是基于堆栈的虚拟机的二进制指令格式。 Wasm 被设计为可移植的目标，用于编译 `C/C++` 或 `Rust` 等高级语言，支持在 Web 上部署客户端和服务器应用程序。

-   **二进制指令格式**：文本格式的 WebAssembly 代码用于定义抽象语法树，它描述了程序的组件并简化了验证和编译。AST 被编译（使用 Emscripten SDK 等编译器）为二进制格式的 `.wasm` 文件，该文件被加载到网页中。浏览器的 JavaScript 引擎然后使用解码堆栈将文件解码回 AST 来解释它。
-   **用于编译的便携式目标**：由于 WebAssembly 被设计为在虚拟机上运行；无论操作系统和指令集架构如何，它都可以在各种设备上运行。

### WebAssembly 优势

WebAssembly 正在迅速成为一种主流技术，它被所有主要的浏览器供应商采用，特别是因为接近原生的代码性能。除此之外 WebAssembly 还拥有以下优势：

-   **更好的性能**：WebAssembly 在两个方面提供了增强的性能，即启动速度和吞吐量。缩小的 JavaScript 需要被解析、解释、编译和优化。另一方面，`wasm` 更紧凑，并且由于其简洁的设计，二进制格式允许更快的解析和快速优化。
-   **便携且安全**：它独立于平台、独立于硬件和独立于语言，它不对设备或浏览器没有任何特殊要求，这增强了其便携性，代码在内存安全的沙盒环境中进行验证和执行，可以防止安全漏洞和数据损坏。
-   **集成遗留库**：如果应用程序使用 `C/C++` 或任何其他兼容语言，WebAssembly 可以轻松地将代码或桌面应用程序可用于 Web。通常使用两个库；用于 Rust 的 `wasm-pack` 和用于 `C/C++` 的 `Emscripten`。

### WebAssembly 应用场景

WebAssembly 通常用于需要高性能的计算密集型应用程序。这些包括元宇宙相关技术 AR/VR 实时开发、视频编辑、VPN、图像识别等。要了解学习 `wasm` 的各种技术，请[单击此处](https://link.juejin.cn/?target=https%3A%2F%2Fmadewithwebassembly.com%2F "https://madewithwebassembly.com/")。

-   在 `tensorflow.js` 中加入 `wasm` 后端支持后，模型的性能提升了 10 倍左右。
-   由于它最初是用 `C++` 编写的，因此 `Figma` 使用 `Emscripten` 导出到 `Asm.js`，通过添加适当的 `Emscripten` 标志启动 WebAssembly 后，大概 3 倍的性能提升。
-   切换到 WebAssembly 后，`OpenCV Python` 库的性能提升非常明显。 `ResNet50` 的推理时间增加了 15 倍，内核性能测试速度提高了 **3.5** 倍。
-   Unity 使用 Emscripten 输出 WebAssembly 为游戏导出网络播放器，传统上由于 JavaScript 速度变慢而无法导出到 Web 的游戏，在 Web 上获得了始终如一的良好性能。

在被浏览器广泛支持后，一些重量级的应用也逐渐移植到了Web上，包括：

-   [Google Earth](https://link.juejin.cn/?target=https%3A%2F%2Fearth.google.com%2Fweb%2F "https://earth.google.com/web/")：一种主要基于卫星图像呈现地球 3D 表示的软件。
-   [AutoCAD](https://link.juejin.cn/?target=https%3A%2F%2Fweb.autocad.com%2Flogin "https://web.autocad.com/login")：计算机辅助设计和绘图软件应用程序，它是在带有内部图形控制器的微型计算机上运行的桌面应用程序。
-   [TensorFlow](https://link.juejin.cn/?target=https%3A%2F%2Fblog.tensorflow.org%2F2020%2F03%2Fintroducing-webassembly-backend-for-tensorflow-js.html "https://blog.tensorflow.org/2020/03/introducing-webassembly-backend-for-tensorflow-js.html")：用于机器学习和人工智能的免费开源软件库。

### WebAssembly 实现

根据所使用的语言，有四种方法可以在 Web 应用程序中实现 WebAssembly。

-   使用 [Emscripten](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWebAssembly%2FC_to_wasm "https://developer.mozilla.org/en-US/docs/WebAssembly/C_to_wasm") 移植 `C/C++` 应用程序。
-   直接在程序集级别编写或生成 WebAssembly
-   编写一个 Rust 应用程序并将 WebAssembly 作为其输出。
-   使用编译为 WebAssembly 二进制文件的 AssemblyScript。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77690ffba242485b9a90a57b9472eb3d~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

### 应用程序中嵌入 WebAssembly

如下图所示，无论是 Web 应用还是非 Web 应用，都需要在宿主程序中嵌入 WebAssembly 运行时才能使用 WebAssembly。唯一的区别是，在Web应用程序中，宿主程序是浏览器，而在非Web场景中，宿主程序是自己的应用程序，具体到本文所关注的后端应用程序，宿主程序是后端服务。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5009e349b4e46be930c493bf6ec84c1~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

目前可用的 WebAssembly 运行时包括 [Wasmtime](https://link.juejin.cn/?target=https%3A%2F%2Fwasmtime.dev%2F "https://wasmtime.dev/")、[WasmEdge](https://link.juejin.cn/?target=https%3A%2F%2Fwasmedge.org%2F "https://wasmedge.org/")、[WAVM](https://link.juejin.cn/?target=https%3A%2F%2Fwavm.org%2F "https://wavm.org/")、[Wasmer](https://link.juejin.cn/?target=https%3A%2F%2Fwasmer.io%2F "https://wasmer.io/") 等，各有优缺点。

### WebAssembly 局限性

虽然不断开发新功能，但 WebAssembly 的功能是有限的。

-   **没有垃圾收集**：与采用垃圾回收的 JavaScript 不同，`Wasm` 使用平面/线性内存模型，在实例化时分配大量内存并且不会自动回收内存。
-   **不能直接访问DOM**：WebAssembly 无法访问文档对象模型 (DOM)，任何 DOM 操作都需要使用 JavaScript 间接完成。或者，在通过 JavaScript 胶水代码完成 DOM 操作的情况下，也可以使用任何工具链，例如 Emscripten。性能取决于所使用的库。
-   **旧浏览器不支持**：通常较旧的浏览器没有可用于实例化和加载 `Wasm` 模块的所需对象。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aec10e19e8ce4d4cbd0c9e27da4009ba~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

![](https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/00ba359ecd0075e59ffbc3d810af551d.svg) 11

![](https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/3d482c7a948bac826e155953b2a28a9e.svg) 收藏