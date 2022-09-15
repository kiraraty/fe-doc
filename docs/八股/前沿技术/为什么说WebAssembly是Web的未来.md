![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c00e8adeb71541faba751fbd206295a2~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98e87ba0b4de429d8a462ee95b1a5aea~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

## 这篇文章打算讲什么？

了解 WebAssembly 的前世今生，这一致力于让 Web 更广泛使用的伟大创造是如何在整个 Web/Node.js 的生命周期起作用的。

在整篇文章的讲解过程中，你可以了解到 WebAssembly 原生、AssemblyScript、Emscripten 编译器、以及如何在浏览器调试 WebAssembly 程序的。

最后还对 WebAssembly 的未来进行了展望，列举了一些令人兴奋的技术的发展方向。

本文旨在对那些有兴趣了解 WebAssembly，但是一直没有时间深入探究它的边界的同学提供一个快速入门且具有一定深度的分享，希望本文能为你在学习 WebAssembly 的路上一个比较有意思的指引。

同时本文还试图回答之前分享文章的一些问题：[WebAssembly 入门：如何和有 C 项目结合使用](https://bytedance.feishu.cn/docs/doccnmiuQS1dKSWaMwUABoHkxez "https://bytedance.feishu.cn/docs/doccnmiuQS1dKSWaMwUABoHkxez")

-   如何将复杂的 CMake 项目编译到 WebAssembly？
-   在编译复杂的 CMake 项目到 WebAssembly 时如何探索一套通用的最佳实践？
-   如何和 CMake 项目结合起来进行 Debug？

## 为什么需要 WebAssembly ？

## 动态语言之踵

首先先来看一下 JS 代码的执行过程：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53078bccb5f445439169fed86fdf0a10~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

> 上述是 Microsoft Edge 之前的 ChakraCore 引擎结构，目前 Microsoft Edge 的 JS 引擎已经切换为 V8 。

整体的流程就是：

-   拿到了 JS 源代码，交给 Parser，生成 AST
-   ByteCode Compiler 将 AST 编译为字节码（ByteCode）
-   ByteCode 进入翻译器，翻译器将字节码一行一行翻译（Interpreter）为机器码（Machine Code），然后执行

但其实我们平时写的代码有很多可以优化的地方，如多次执行同一个函数，那么可以将这个函数生成的 Machine Code 标记可优化，然后打包送到 JIT Compiler（Just-In-Time），下次再执行这个函数的时候，就不需要经过 Parser-Compiler-Interpreter 这个过程，可以直接执行这份准备好的 Machine Code，大大提高的代码的执行效率。

但是上述的 JIT 优化只能针对静态类型的变量，如我们要优化的函数，它只有两个参数，每个参数的类型是确定的，而 JavaScript 却是一门动态类型的语言，这也意味着，函数在执行过程中，可能类型会动态变化，参数可能变成三个，第一个参数的类型可能从对象变为数组，这就会导致 JIT 失效，需要重新进行 Parser-Compiler-Interpreter-Execuation，而 Parser-Compiler 这两步是整个代码执行过程中最耗费时间的两步，这也是为什么 JavaScript 语言背景下，Web 无法执行一些高性能应用，如大型游戏、视频剪辑等。

## 静态语言优化

通过上面的说明了解到，其实 JS 执行慢的一个主要原因是因为其动态语言的特性，导致 JIT 失效，所以如果我们能够为 JS 引入静态特性，那么可以保持有效的 JIT，势必会加快 JS 的执行速度，这个时候 asm.js 出现了。

asm.js 只提供两种数据类型：

-   32 位带符号整数
-   64 位带符号浮点数

其他类似如字符串、布尔值或对象都是以数值的形式保存在内存中，通过 TypedArray 调用。整数和浮点数表示如下：

> `ArrayBuffer`对象、`TypedArray`视图和`DataView` 视图是 JavaScript 操作二进制数据的一个接口，以数组的语法处理二进制数据，统称为二进制数组。参考 [ArrayBuffer](https://link.juejin.cn/?target=https%3A%2F%2Fes6.ruanyifeng.com%2F%23docs%2Farraybuffer "https://es6.ruanyifeng.com/#docs/arraybuffer") 。

```
var a = 1;

var x = a | 0;  // x 是32位整数

var y = +a;  // y 是64位浮点数
复制代码
```

而函数的写法如下：

```
function add(x, y) {

  x = x | 0;

  y = y | 0;

  return (x + y) | 0;

}
复制代码
```

上述的函数参数及返回值都需要声明类型，这里都是 32 位整数。

而且 asm.js 也不提供垃圾回收机制，内存操作都是由开发者自己控制，通过 TypedArray 直接读写内存：

```
var buffer = new ArrayBuffer(32768); // 申请 32 MB 内存

var HEAP8 = new Int8Array(buffer); // 每次读 1 个字节的视图 HEAP8

function compiledCode(ptr) {

  HEAP[ptr] = 12;

  return HEAP[ptr + 4];

}  
复制代码
```

从上可见，asm.js 是一个严格的 JavaScript 子集要求变量的类型在运行时确定且不可改变，且去除了 JavaScript 拥有的垃圾回收机制，需要开发者手动管理内存。这样 JS 引擎就可以基于 asm.js 的代码进行大量的 JIT 优化，据统计 asm.js 在浏览器里面的运行速度，大约是原生代码（机器码）的 50% 左右。

## 推陈出新

但是不管 asm.js 再怎么静态化，干掉一些需要耗时的上层抽象（垃圾收集等），也还是属于 JavaScript 的范畴，代码执行也需要 Parser-Compiler 这两个过程，而这两个过程也是代码执行中最耗时的。

为了极致的性能，Web 的前沿开发者们抛弃 JavaScript，创造了一门可以直接和 Machine Code 打交道的汇编语言 WebAssembly，直接干掉 Parser-Compiler，同时 WebAssembly 是一门强类型的静态语言，能够进行最大限度的 JIT 优化，使得 WebAssembly 的速度能够无限逼近 C/C++ 等原生代码。

相当于下面的过程：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ce0b1c01d7e4129a2e974ac94baf2f6~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

## WebAssembly 初探

我们可以通过一张图来直观了解 WebAssembly 在 Web 中的位置：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/629f7bdc3cc3466886bb7d223b19e75d~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

WebAssembly（也称为 WASM），是一种可在 Web 中运行的全新语言格式，同时兼具体积小、性能高、可移植性强等特点，在底层上类似 Web 中的 JavaScript，同时也是 W3C 承认的 Web 中的第 4 门语言。

为什么说在底层上类似 JavaScript，主要有以下几个理由：

-   和 JavaScript 在同一个层次执行：JS Engine，如 Chrome 的 V8
-   和 JavaScript 一样可以操作各种 Web API

同时 WASM 也可以运行在 Node.js 或其他 WASM Runtime 中。

## WebAssembly 文本格式

实际上 WASM 是一堆可以直接执行二进制格式，但是为了易于在文本编辑器或开发者工具里面展示，WASM 也设计了一种 “中间态” 的[文本格式](https://link.juejin.cn/?target=https%3A%2F%2Fwebassembly.github.io%2Fspec%2Fcore%2Ftext%2Findex.html "https://webassembly.github.io/spec/core/text/index.html")，以 `.wat` 或 `.wast` 为扩展命名，然后通过 [wabt](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FWebAssembly%2Fwabt "https://github.com/WebAssembly/wabt") 等工具，将文本格式下的 WASM 转为二进制格式的可执行代码，以 `.wasm` 为扩展的格式。

来看一段 WASM 文本格式下的模块代码：

```
(module

  (func $i (import "imports" "imported_func") (param i32))

  (func (export "exported_func")

    i32.const 42

    call $i

  )

)
复制代码
```

上述代码逻辑如下：

-   首先定义了一个 WASM 模块，然后从一个 `imports` JS 模块导入了一个函数 `imported_func` ，将其命名为 `$i` ，接收参数 `i32`
-   然后导出一个名为 `exported_func` 的函数，可以从 Web App，如 JS 中导入这个函数使用
-   接着为参数 `i32` 传入 42，然后调用函数 `$i`

我们通过 wabt 将上述文本格式转为二进制代码：

-   将上述代码复制到一个新建的，名为 `simple.wat` 的文件中保存
-   使用 [wabt](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FWebAssembly%2Fwabt "https://github.com/WebAssembly/wabt") 进行编译转换

当你安装好 wabt 之后，运行如下命令进行编译：

```
wat2wasm simple.wat -o simple.wasm
复制代码
```

虽然转换成了二进制，但是无法在文本编辑器中查看其内容，为了查看二进制的内容，我们可以在编译时加上 `-v` 选项，让内容在命令行输出：

```
wat2wasm simple.wat -v
复制代码
```

输出结果如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1541619506104e90b1c8e7d451b0b966~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

可以看到，WebAssembly 其实是二进制格式的代码，即使其提供了稍为易读的文本格式，也很难真正用于实际的编码，更别提开发效率了。

## 将 WebAssembly 作为编程语言的一种尝试

因为上述的二进制和文本格式都不适合编码，所以不适合将 WASM 作为一门可正常开发的语言。

为了突破这个限制，[AssemblyScript](https://link.juejin.cn/?target=https%3A%2F%2Fwww.assemblyscript.org%2F "https://www.assemblyscript.org/") 走到台前，AssemblyScript 是 TypeScript 的一种变体，为 JavaScript 添加了 **[WebAssembly 类型](https://link.juejin.cn/?target=https%3A%2F%2Fwww.assemblyscript.org%2Ftypes.html%23type-rules "https://www.assemblyscript.org/types.html#type-rules")** **，** 可以使用 [Binaryen](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FWebAssembly%2Fbinaryen "https://github.com/WebAssembly/binaryen") 将其编译成 WebAssembly。

> WebAssembly 类型大致如下：

-   > i32、u32、i64、v128 等
    
-   > 小整数类型：i8、u8 等
    
-   > 变量整数类型：isize、usize 等
    

Binaryen 会前置将 AssemblyScript 静态编译成强类型的 WebAssembly 二进制，然后才会交给 JS 引擎去执行，所以说虽然 AssemblyScript 带来了一层抽象，但是实际用于生产的代码依然是 WebAssembly，保有 WebAssembly 的性能优势。AssemblyScript 被设计的和 TypeScript 非常相似，提供了一组内建的函数可以直接操作 WebAssembly 以及编译器的特性.

> 内建函数：

-   > 静态类型检查：
    
    -   > `function isInteger<T>(value?: T): bool` 等
        
-   > 实用函数：
    
    -   > `function sizeof<T>(): usize` 等
        
-   > 操作 WebAssembly：
    
    -   > 数学操作
        
        -   > `function clz<T>(value: T): T` 等
            
    -   > 内存操作
        
        -   > `function load<T>(ptr: usize, immOffset?: usize): T` 等
            
    -   > 控制流
        
        -   > `function select<T>(ifTrue: T, ifFalse: T, condition: bool): T` 等
            
    -   > SIMD
        
    -   > Atomics
        
    -   > Inline instructions
        

然后基于这套内建的函数向上构建一套标准库。

> 标准库：

-   > Globals
    
-   > Array
    
-   > ArrayBuffer
    
-   > DataView
    
-   > Date
    
-   > Error
    
-   > Map
    
-   > Math
    
-   > Number
    
-   > Set
    
-   > String
    
-   > Symbol
    
-   > TypedArray
    

如一个典型的 Array 的使用如下：

```
var arr = new Array<string>(10)



// arr[0]; // 会出错 😢



// 进行初始化

for (let i = 0; i < arr.length; ++i) {

  arr[i] = ""

}

arr[0]; // 可以正确工作 😊
复制代码
```

可以看到 AssemblyScript 在为 JavaScript 添加类似 TypeScript 那样的语法，然后在使用上需要保持和 C/C++ 等静态强类型的要求，如不初始化，进行内存分配就访问就会报错。

还有一些扩展库，如 Node.js 的 process、crypto 等，JS 的 console，还有一些和内存相关的 StaticArray、heap 等。

可以看到通过上面基础的类型、内建库、标准库和扩展库，AssemblyScript 基本上构造了 JavaScript 所拥有的的全部特性，同时 AssemblyScript 提供了类似 TypeScript 的语法，在写法上严格遵循强类型静态语言的规范。

值得一提的是，因为当前 WebAssembly 的 ES 模块规范依然在草案中，AssemblyScript 自行进行了模块的实现，例如导出一个模块：

```
// env.ts

export declare function doSomething(foo: i32): void { /* ... 函数体 */ }
复制代码
```

导入一个模块：

```
import { doSomething } from "./env";
复制代码
```

一个大段代码、使用类的例子：

```
class Animal<T> {

  static ONE: i32 = 1;

  static add(a: i32, b: i32): i32 { return a + b + Animal.ONE; }



  two: i16 = 2; // 6

  instanceSub<T>(a: T, b: T): T { return a - b + <T>Animal.ONE; } // tsc does not allow this

}



export function staticOne(): i32 {

  return Animal.ONE;

}



export function staticAdd(a: i32, b: i32): i32 {

  return Animal.add(a, b);

}



export function instanceTwo(): i32 {

  let animal = new Animal<i32>();

  return animal.two;

}



export function instanceSub(a: f32, b: f32): f32 {

  let animal = new Animal<f32>();

  return animal.instanceSub<f32>(a, b);

}
复制代码
```

AssemblyScript 为我们打开了一扇新的大门，可以以 TS 形式的语法，遵循静态强类型的规范进行高效编码，同时又能够便捷的操作 WebAssembly/编译器相关的 API，代码写完之后，通过 Binaryen 编译器将其编译为 WASM 二进制，然后获取到 WASM 的执行性能。

得益于 AssemblyScript 兼具灵活性与性能，目前使用 AssemblyScript 构建的应用生态已经初具繁荣，目前在区块链、构建工具、编辑器、模拟器、游戏、图形编辑工具、库、IoT、测试工具等方面都有大量使用 AssemblyScript 构建的产物：[www.assemblyscript.org/built-with-…](https://link.juejin.cn/?target=https%3A%2F%2Fwww.assemblyscript.org%2Fbuilt-with-assemblyscript.html%23games "https://www.assemblyscript.org/built-with-assemblyscript.html#games")

## 一种鬼才哲学：将 C/C++ 代码跑在浏览器

虽然 AssemblyScript 的出现极大的改善了 WebAssembly 在高效率编码方面的缺陷，但是作为一门新的编程语言，其最大的劣势就是生态、开发者与积累。

WebAssembly 的设计者显然在设计上同时考虑到了各种完善的情况，既然 WebAssembly 是一种二进制格式，那么其就可以作为其他语言的编译目标，如果能够构建一种编译器，能够将已有的、成熟的、且兼具海量的开发者和强大的生态的语言编译到 WebAssembly 使用，那么相当于可以直接复用这个语言多年的积累，并用它们来完善 WebAssembly 生态，将它们运行在 Web、Node.js 中。

幸运的是，针对 C/C++ 已经有 [Emscripten](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Femscripten-core%2Femscripten "https://github.com/emscripten-core/emscripten") 这样优秀的编译器存在了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/671768b6f6e1489bbfb1bf84466e6179~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

可以通过下面这张图直观的阐述 Emscripten 在开发链路中的地位：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d136ed0580042dfa06b87e4012f6efa~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

即将 C/C++ 的代码（或者 Rust/Go 等）编译成 WASM，然后通过 JS 胶水代码将 WASM 跑在浏览器中（或 Node.js）的 runtime，如 ffmpeg 这个使用 C 编写音视频转码工具，通过 Emscripten 编译器编译到 Web 中使用，可直接在浏览器前端转码音视频。

> 上述的 JS “Gule” 代码是必须的，因为如果需要将 C/C++ 编译到 WASM，还能在浏览器中执行，就得实现映射到 C/C++ 相关操作的 Web API，这样才能保证执行有效，这些胶水代码目前包含一些比较流行的 C/C++ 库，如 [SDL](https://link.juejin.cn/?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FSimple_DirectMedia_Layer "https://en.wikipedia.org/wiki/Simple_DirectMedia_Layer")、[OpenGL](https://link.juejin.cn/?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FOpenGL "https://en.wikipedia.org/wiki/OpenGL")、[OpenAL](https://link.juejin.cn/?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FOpenAL "https://en.wikipedia.org/wiki/OpenAL")、以及 [POSIX](https://link.juejin.cn/?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FPOSIX "https://en.wikipedia.org/wiki/POSIX") 的一部分 API。

目前使用 WebAssembly 最大的场景也是这种将 C/C++ 模块编译到 WASM 的方式，比较有名的例子有 [Unreal Engine 4](https://link.juejin.cn/?target=https%3A%2F%2Fblog.mozilla.org%2Fblog%2F2014%2F03%2F12%2Fmozilla-and-epic-preview-unreal-engine-4-running-in-firefox%2F "https://blog.mozilla.org/blog/2014/03/12/mozilla-and-epic-preview-unreal-engine-4-running-in-firefox/")、[Unity](https://link.juejin.cn/?target=https%3A%2F%2Fblogs.unity3d.com%2F2018%2F08%2F15%2Fwebassembly-is-here%2F "https://blogs.unity3d.com/2018/08/15/webassembly-is-here/") 之类的大型库或应用。

## WebAssembly 会取代 JavaScript 吗？

答案是不会。

根据上面的层层阐述，实际上 WASM 的设计初衷就可以梳理为以下几点：

-   最大程度的复用现有的底层语言生态，如 C/C++ 在游戏开发、编译器设计等方面的积淀
-   在 Web、Node.js 或其他 WASM runtime 获得近乎于原生的性能，也就是可以让浏览器也能跑大型游戏、图像剪辑等应用
-   还有最大程度的兼容 Web、保证安全
-   同时在开发上（如果需要开发）易于读写和可调试，这一点 AssemblyScript 走得更远

所以从初衷出发，WebAssembly 的作用更适合下面这张图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/767f978dded4443b803423751029ee08~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

WASM 桥接各种系统编程语言的生态，进一步补齐了 Web 开发生态之外，还为 JS 提供性能的补充，正是 Web 发展至今所缺失的重要的一块版图。

> Rust Web Framework：[github.com/yewstack/ye…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fyewstack%2Fyew "https://github.com/yewstack/yew")

## 深入探索 Emscripten

> 地址：[github.com/emscripten-…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Femscripten-core%2Femscripten "https://github.com/emscripten-core/emscripten")

> 下面所有的 demo 都可以在仓库：[code.byted.org/huangwei.fp…](https://link.juejin.cn/?target=https%3A%2F%2Fcode.byted.org%2Fhuangwei.fps%2Fwebassembly-demos%2Ftree%2Fmaster "https://code.byted.org/huangwei.fps/webassembly-demos/tree/master") 找到

> Star：21.4K

> 维护：活跃

> ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2785eafd64b4b75b25044b943e35628~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

Emscripten 是一个开源的，跨平台的，用于将 C/C++ 编译为 WebAssembly 的编译器工具链，由 LLVM、Binaryen、Closure Compiler 和其他工具等组成。

Emscripten 的核心工具为 Emscripten Compiler Frontend（emcc），emcc 是用于替代一些原生的编译器如 gcc 或 clang，对 C/C++ 代码进行编译。

实际上为了能让几乎所有的可移植的 C/C++ 代码库能够编译为 WebAssembly，并在 Web 或 Node.js 执行，Emscripten Runtime 其实还提供了兼容 C/C++ 标准库、相关 API 到 Web/Node.js API 的映射，这份映射存在于编译之后的 JS 胶水代码中。

再看下面这张图，红色部分为 Emscripten 编译后的产物，绿色部分为 Emscripten 为保证 C/C++ 代码能够运行的一些 runtime 支持：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3de0a0e0d750496694b17550cca834d7~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

## 简单体验一下 “Hello World”

值得一提的是，WebAssembly 相关工具链的安装几乎都是以源码的形式提供，这可能和 C/C++ 生态的习惯不无关系。

为了完成简单的 C/C++ 程序运行在 Web，我们首先需要安装 Emscripten 的 SDK：

```
# Clone 代码仓库

git clone https: // github . com / emscripten-core / emsdk . git



# 进入仓库

cd emsdk



# 获取最新代码，如果是新 clone 的这一步可以不需要

git pull



# 安装 SDK 工具，我们安装 1.39.18，方便测试

./emsdk install 1.39.18



# 激活 SDK

./emsdk activate 1.39.18



# 将相应的环境变量加入到系统 PATH

source ./emsdk_env.sh



# 运行命令测试是否安装成功

emcc -v # 
复制代码
```

如果安装成功，上述的命令运行之后会输出如下结果：

```
emcc (Emscripten gcc/clang-like replacement + linker emulating GNU ld) 1.39.18

clang version 11.0.0 (/b/s/w/ir/cache/git/chromium.googlesource.com-external-github.com-llvm-llvm--project 613c4a87ba9bb39d1927402f4dd4c1ef1f9a02f7)

Target: x86_64-apple-darwin21.1.0

Thread model: posix
复制代码
```

让我们准备初始代码：

```
mkdir -r webassembly/hello_world

cd webassembly/hello_world && touch main.c
复制代码
```

在 `main.c` 中加入如下代码：

```
 #include <stdio.h>



int main() {

  printf("hello, world!\n");

  return 0;

}
复制代码
```

然后使用 emcc 来编译这段 C 代码，在命令行切换到 `webassembly/hello_world` 目录，运行：

```
emcc main.c
复制代码
```

上述命令会输出两个文件：`a.out.js` 和 `a.out.wasm` ，后者为编译之后的 wasm 代码，前者为 JS 胶水代码，提供了 WASM 运行的 runtime。

可以使用 Node.js 进行快速测试：

```
node a.out.js
复制代码
```

会输出 `"hello, world!"` ，我们成功将 C/C++ 代码运行在了 Node.js 环境。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff7f6ac00f1748f0aa3ad55f2d002aa2~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

接下来我们尝试一下将代码运行在 Web 环境，修改编译代码如下：

```
emcc main.c -o main.html
复制代码
```

上述命令会生成三个文件：

-   `main.js` 胶水代码
-   `main.wasm` WASM 代码
-   `main.html` 加载胶水代码，执行 WASM 的一些逻辑

> Emscripten 生成代码有一定的规则，具体可以参考：[emscripten.org/docs/compil…](https://link.juejin.cn/?target=https%3A%2F%2Femscripten.org%2Fdocs%2Fcompiling%2FBuilding-Projects.html%23emscripten-linker-output-files "https://emscripten.org/docs/compiling/Building-Projects.html#emscripten-linker-output-files")

如果要在浏览器打开这个 HTML，需要在本地起一个服务器，因为单纯的打开通过 `file://` 协议访问时，主流浏览器不支持 XHR 请求，只有在 HTTP 服务器下，才能进行 XHR 请求，所以我们运行如下命令来打开网站：

```
npx serve .
复制代码
```

打开网页，访问 localhost:3000/main.html，可以看到如下结果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b91b46fc7cdd4b08ad60b976e36bebe3~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

同时开发者工具里面也会有相应的打印输出：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f74debed3b34b42a495e47df24eb5d1~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

## 尝试在 JS 中调用 C/C++ 函数

上一小节我们初步体验了一下如何在 Web 和 Node.js 中运行 C 程序，但其实如果我们想要让复杂的 C/C++ 应用，如 Unity 运行在 Web，那我们还有很长的路要走，其中一条，就是能够在 JS 中操作 C/C++ 函数。

让我们在目录下新建 `function.c` 文件，添加如下代码：

```
 #include <stdio.h>

 #include <emscripten/emscripten.h>



int main() {

    printf("Hello World\n");

}



EMSCRIPTEN_KEEPALIVE void myFunction(int argc, char ** argv) {

    printf("MyFunction Called\n");

}
复制代码
```

值得注意的是 Emscripten 默认编译的代码只会调用 `main` 函数，其他的代码会作为 “死代码” 在编译时被删掉，所以为了使用我们在上面定义的 `myFunction` ，我们需要在其定义之前加上 `EMSCRIPTEN_KEEPALIVE` 声明，确保在编译时不会删掉 `myFunction` 函数相关的代码。

> 我们需要导入 `emscripten/emscripten.h` 头文件，才能使用 `EMSCRIPTEN_KEEPALIVE` 声明。

同时我们还需要对编译命令做一下改进如下：

```
emcc function.c -o function.html -s NO_EXIT_RUNTIME=1 -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall']"
复制代码
```

上述额外增加了两个参数：

-   `-s NO_EXIT_RUNTIME=1` 表示在 `main` 函数运行完之后，程序不退出，依然保持可执行状态，方便后续可调用 `myFunction` 函数
-   `-s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall']"` 则表示导出一个运行时的函数 `ccall` ，这个函数可以在 JS 中调用 C 程序的函数

进行编译之后，我们还需要修改生成的 `function.html` 文件，加入我们的函数调用逻辑如下：

```
<html>

  <body>

    <!-- 其它 HTML 内容 -->

    <button class="mybutton">Run myFunction</button>

  </body>

  <!-- 其它 JS 引入 -->

  <script>

      document

        .querySelector(".mybutton")

        .addEventListener("click", function () {

          alert("check console");

          var result = Module.ccall(

            "myFunction", // 需要调用的 C 函数名

            null, // 函数返回类型

            null, // 函数参数类型，默认是数组

            null // 函数需要传入的参数，默认是数组

          );

        });

    </script>

</html>
复制代码
```

可以看到我们增加了一个 Button，然后增加了一段脚本，为这个 Button 注册了 `click` 事件，在回调函数里，我们调用了 `myFunction` 函数。

在命令行中运行 `npx serve .` 打开浏览器访问 [http://localhost:3000/function.html](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost%3A3000%2Ffunction.html "http://localhost:3000/function.html")，查看结果如下：

只执行 `main` 函数：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9bb1a17abc0d46179e5e988dedbb5612~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

尝试点击按钮执行 `myFunction` 函数：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/728969743b7b4a1d8d2e12d93c0d4d16~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6798dd8f37bb4c5a88267b33ce1e6999~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

可以看到首先进行 alert 弹框展示，然后打开控制台，可以看到 `myFunction` 的调用结果，打印 `"MyFunction Called"` 。

## 初尝 Emscripten 文件系统

我们可以在 C/C++ 程序中使用 libc stdio API 如 `fopen` 、`fclose` 来访问你文件系统，但是 JS 是运行在浏览器提供的沙盒环境里，无法直接访问到本地文件系统。所以为了兼容 C/C++ 程序访问文件系统，编译为 WASM 之后依然能够正常运行，Emscripten 会在其 JS 胶水代码里面模拟一个文件系统，并提供和 libc stdio 一致的 API。

让我们重新创建一个名为 `file.c` 的程序，添加如下代码：

```
#include <stdio.h>



int main() {

  FILE *file = fopen("file.txt", "rb");

  if (!file) {

    printf("cannot open file\n");

    return 1;

  }

  while (!feof(file)) {

    char c = fgetc(file);

    if (c != EOF) {

      putchar(c);

    }

  }

  fclose (file);

  return 0;

}
复制代码
```

上述代码我们首先使用 `fopen` 访问 `file.txt` ，然后一行一行的读取文件内容，如果程序执行过程中有任何的出错，就会打印错误。

我们在目录下新建 `file.txt` 文件，并加入如下内容：

```
==

This data has been read from a file.

The file is readable as if it were at the same location in the filesystem, including directories, as in the local filesystem where you compiled the source.

==
复制代码
```

如果我们要编译这个程序，并确保能够在 JS 中正常运行，还需要在编译时加上 `preload` 参数，提前将文件内容加载进 Emscripten runtime，因为在 C/C++ 等程序上访问文件都是同步操作，而 JS 是基于事件模型的异步操作，且在 Web 中只能通过 XHR 的形式去访问文件（Web Worker、Node.js 可同步访问文件），所以需要提前将文件加载好，确保在代码编译之前，文件已经准备好了，这样 C/C++ 代码可以直接访问到文件。

运行如下命令进行代码编译：

```
emcc file.c -o file.html -s EXIT_RUNTIME=1 --preload-file file.txt
复制代码
```

> 上述添加了 `-s EXIT_RUNTIME=1` ，依然是确保 `main` 逻辑执行完之后，程序不会退出。

然后运行我们的本地服务器，访问 [http://localhost:3000/file.html](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost%3A3000%2Ffile.html "http://localhost:3000/file.html")，可以查看结果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1e9ae6263df4c568f42b0ffbc2a6dab~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

## 尝试编译已存在的 WebP 模块并使用

通过上面三个例子，我们已经了解了基础的 C/C++ 如打印、函数调用、文件系统相关的内容如何编译为 WASM，并在 JS 中运行，这里的 JS 特指 Web 和 Node.js 环境，通过上面的例子基本上绝大部分自己写的 C/C++ 程序都可以自行编译到 WASM 使用了。

而之前我们也提到过，其实当前 WebAssembly 最大的一个应用场景，就是最大程度的复用当前已有语言的生态，如 C/C++ 生态的库，这些库通常都依赖 C 标准库、操作系统、文件系统或其他依赖，而 Emscripten 最厉害的一点就在于能够兼容绝大部分这些依赖的特性，尽管还存在一些限制，但是已经足够可用。

### 简单的测试

接下来我们来了解一下如何将一个现存的、比较复杂且广泛使用的 C 模块：libwebp，将其编译到 WASM 并允许到 Web。libwebp 的源码是用 C 实现的，能够在 [Github](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fwebmproject%2Flibwebp "https://github.com/webmproject/libwebp") 上找到它，同时可以了解到它的一些 [API 文档](https://link.juejin.cn/?target=https%3A%2F%2Fdevelopers.google.com%2Fspeed%2Fwebp%2Fdocs%2Fapi "https://developers.google.com/speed/webp/docs/api")。

首先准备代码，在我们的目录下运行如下命令：

```
git clone https://github.com/webmproject/libwebp
复制代码
```

为了快速测试是否正确的接入了 libwebp 进行使用，我们可以编写一个简单的 C 函数，然后在里面调用 `libwebp` 获取版本的函数，测试版本是否可以正确获取。

我们在目录下创建 `webp.c` 文件，添加如下内容：

```
#include "emscripten.h"

#include "src/webp/encode.h"



EMSCRIPTEN_KEEPALIVE int version() {

  return WebPGetEncoderVersion();

}
复制代码
```

上述的 `WebPGetEncoderVersion` 就是 libwebp 里面获取当前版本的函数，而我们是通过导入 `src/webp/encode.h` 头文件来获取这个函数的，为了让编译器在编译时能够找到这个头文件，我们需要在编译的时候将 libwebp 库的头文件地址告诉编译器，并将编译器需要的所有 libwebp 库下的 C 文件传给编译器。

让我们运行如下编译命令：

```
emcc -O3 -s WASM=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' \

 -I libwebp \

 webp.c \

 libwebp/src/{dec,dsp,demux,enc,mux,utils}/*.c
复制代码
```

上述命令中主要做了如下工作：

-   `-I libwebp` 将 libwebp 库的头文件地址告诉编译器
-   `libwebp/src/{dec,dsp,demux,enc,mux,utils}/*.c` 将编译器所需的 C 文件传给编译器，这里将 `dec,dsp,demux,enc,mux,utils` 等目录下的所有 C 文件都传递给了编译器，避免了一个个列出所需文件的繁琐，然后让编译器去自动识别那些没有使用的文件，并将其过滤掉
-   `webp.c` 是我们编写的 C 函数，用于调用 `WebPGetEncoderVersion` 获取库版本
-   `-O3` 代表在编译时进行等级为 3 的优化，包含内联函数、去除无用代码、对代码进行各种压缩优化等
-   而 `-s WASM=1` 其实是默认的，就是在编译时输出 `xx.out.wasm` ，这里之所以会设置这个选项主要是针对那些不支持 WASM 的 runtime，可以设置 `-s WASM=0` ，输出等价的 JS 代码替代 WASM
-   `EXTRA_EXPORTED_RUNTIME_METHODS= '["cwrap"]'` 则是输出 runtime 的函数 `cwrap` ，类似 `ccall` 可以在 JS 中调用 C 函数

上述的编译输出只有 `a.out.js` 和 `a.out.wasm` ，我们还需要建一份 HTML 文档来使用输出的脚本代码，新建 `webp.html` ，添加如下内容：

```
<html>

  <head></head>

  <body></body>

  <script src="./a.out.js"></script>

    <script>

      Module.onRuntimeInitialized = async _ => {

        const api = {

          version: Module.cwrap('version', 'number', []),

        };

        console.log(api.version());

      };

    </script>

</html>
复制代码
```

> 值得注意的是，我们通常在 `Module.onRuntimeInitialized` 的回调里面去执行我们 WASM 相关的操作，因为 WASM 相关的代码从加载到可用是需要一段时间的，而 `onRuntimeInitialized` 的回调则是确保 WASM 相关的代码已经加载完成，达到可用状态。

接着我们可以运行 `npx serve .` ，然后访问 [http://localhost:3000/webp.html，查看结果：](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost%3A3000%2Fwebp.html%25EF%25BC%258C%25E6%259F%25A5%25E7%259C%258B%25E7%25BB%2593%25E6%259E%259C%25EF%25BC%259A "http://localhost:3000/webp.html%EF%BC%8C%E6%9F%A5%E7%9C%8B%E7%BB%93%E6%9E%9C%EF%BC%9A")

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95c4d1501b124aee95c564501237aba0~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

可以看到控制台打印了 66049 版本号。

> libwebp 通过十六进制的 `0xabc` 的 abc 来表示当前版本 `a.b.c` ，例如 v0.6.1，则会被编码成十六进制 `0x000601` ，对应的十进制为 1537。而这里为十进制 66049，转成 16 进制则为 `0x010201` ，表示当前版本为 v1.2.1。

> ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d586f7c1f2bc4a758e2e65e6341a3060~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### 在 JavaScript 中获取图片并放入 wasm 中运行

刚刚通过调用编码器的 `WebPGetEncoderVersion` 方法来获取版本号来证实了已经成功编译了 libwebp 库到 wasm，然后可以在 JavaScript 使用它，接下来我们将了解更加复杂的操作，如何使用 libwebp 的编码 API 来转换图片格式。

libwebp 的 encoding API 需要接收一个关于 RGB、RGBA、BGR 或 BGRA 的字节数组，幸运的是，Canvas API 有一个 `CanvasRenderingContext2D.getImageData` 方法，能够返回一个 `Uint8ClampedArray` ，这个数组包含 RGBA 格式的图片数据。

首先我们需要在 JavaScript 中编写加载图片的函数，将其写到上一步创建的 HTML 文件里：

```
<script src="./a.out.js"></script>

<script>

  Module.onRuntimeInitialized = async _ => {

    const api = {

      version: Module.cwrap('version', 'number', []),

    };

    console.log(api.version());

  };

  

   async function loadImage(src) {

     // 加载图片

      const imgBlob = await fetch(src).then(resp => resp.blob());

      const img = await createImageBitmap(imgBlob);

      

      // 设置 canvas 画布的大小与图片一致

      const canvas = document.createElement('canvas');

      canvas.width = img.width;

      canvas.height = img.height;

      

      // 将图片绘制到 canvas 上

      const ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0);

      return ctx.getImageData(0, 0, img.width, img.height);

    }

</script>
复制代码
```

现在剩下的操作则是如何将图片数据从 JavaScript 复制到 wasm，为了达成这个目的，需要在先前的 `webp.c` 函数里面暴露额外的方法：

-   一个为 wasm 里面的图片分配内存的方法
-   一个释放内存的方法

修改 `webp.c` 如下：

```
#include <stdlib.h> // 此头文件导入用于分配内存的 malloc 方法和释放内存的 free 方法



EMSCRIPTEN_KEEPALIVE

uint8_t* create_buffer(int width, int height) {

  return malloc(width * height * 4 * sizeof(uint8_t));

}



EMSCRIPTEN_KEEPALIVE

void destroy_buffer(uint8_t* p) {

  free(p);

}
复制代码
```

`create_buffer` 为 RGBA 的图片分配内存，RGBA 图片一个像素包含 4 个字节，所以代码中需要添加 `4 * sizeof(uint8_t)` ，`malloc` 函数返回的指针指向所分配内存的第一块内存单元地址，当这个指针返回给 JavaScript 使用时，会被当做一个简单的数字处理。当通过 `cwrap` 函数获取暴露给 JavaScript 的对应 C 函数时，可以使用这个指针数字找到复制图片数据的内存开始位置。

我们在 HTML 文件中添加额外的代码如下：

```
<script src="./a.out.js"></script>

<script>

  Module.onRuntimeInitialized = async _ => {    

    const api = {

      version: Module.cwrap('version', 'number', []),

      create_buffer: Module.cwrap('create_buffer', 'number', ['number', 'number']),

      destroy_buffer: Module.cwrap('destroy_buffer', '', ['number']),

      encode: Module.cwrap("encode", "", ["number","number","number","number",]),

      free_result: Module.cwrap("free_result", "", ["number"]),

      get_result_pointer: Module.cwrap("get_result_pointer", "number", []),

      get_result_size: Module.cwrap("get_result_size", "number", []),

    };

    

    const image = await loadImage('./image.jpg');

    const p = api.create_buffer(image.width, image.height);

    Module.HEAP8.set(image.data, p);

    

    // ... call encoder ...

    

    api.destroy_buffer(p);

  };

  

   async function loadImage(src) {

     // 加载图片

      const imgBlob = await fetch(src).then(resp => resp.blob());

      const img = await createImageBitmap(imgBlob);

      

      // 设置 canvas 画布的大小与图片一致

      const canvas = document.createElement('canvas');

      canvas.width = img.width;

      canvas.height = img.height;

      

      // 将图片绘制到 canvas 上

      const ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0);

      return ctx.getImageData(0, 0, img.width, img.height);

    }

</script>
复制代码
```

可以看到上述代码除了导入之前添加的 `create_buffer` 和 `destroy_buffer` 外，还有很多用于编码文件等方面的函数，我们将在后续讲解，除此之外，代码首先加载了一份 `image.jpg` 的图片，然后调用 C 函数为此图片数据分配内存，并相应的拿到返回的指针传给 WebAssembly 的 `Module.HEAP8` ，在内存开始位置 p，写入图片的数据，最后会释放分配的内存。

### 编码图片

现在图片数据已经加载进 wasm 的内存中，可以调用 libwebp 的 encoder 方法来完成编码过程了，通过查阅 [WebP 的文档](https://link.juejin.cn/?target=https%3A%2F%2Fdevelopers.google.com%2Fspeed%2Fwebp%2Fdocs%2Fapi%23simple_encoding_api "https://developers.google.com/speed/webp/docs/api#simple_encoding_api")，发现可以使用 `WebPEncodeRGBA` 函数来完成工作。这个函数接收一个指向图片数据的指针以及它的尺寸，以及每次需要跨越的 `stride` 步长，这里为 4 个字节（RGBA），一个区间在 0-100 的可选的质量参数。在编码的过程中，`WebPEncodeRGBA` 会分配一块用于输出数据的内存，我们需要在编码完成之后调用 `WebPFree` 来释放这块内存。

我们打开 `webp.c` 文件，添加如下处理编码的代码：

```
int result[2];



EMSCRIPTEN_KEEPALIVE

void encode(uint8_t* img_in, int width, int height, float quality) {

  uint8_t* img_out;

  size_t size;



  size = WebPEncodeRGBA(img_in, width, height, width * 4, quality, &img_out);



  result[0] = (int)img_out;

  result[1] = size;

}



EMSCRIPTEN_KEEPALIVE

void free_result(uint8_t* result) {

  WebPFree(result);

}



EMSCRIPTEN_KEEPALIVE

int get_result_pointer() {

  return result[0];

}



EMSCRIPTEN_KEEPALIVE

int get_result_size() {

  return result[1];

}
复制代码
```

上述 `WebPEncodeRGBA` 函数执行的结果为分配一块输出数据的内存以及返回内存的大小。因为 C 函数无法使用数组作为返回值（除非我们需要进行动态内存分配），所以我们使用一个全局静态数组来获取返回的结果，这可能不是很规范的 C 代码写法，同时它要求 wasm 指针为 32 比特长，但是为了简单起见我们可以暂时容忍这种做法。

现在 C 侧的相关逻辑已经编写完毕，可以在 JavaScript 侧调用编码函数，获取图片数据的指针和图片所占用的内存大小，将这份数据保存到 WASM 的缓冲中，然后释放 wasm 在处理图片时所分配的内存，让我们打开 HTML 文件完成上述描述的逻辑：

```
<script src="./a.out.js"></script>

<script>

  Module.onRuntimeInitialized = async _ => {    

    const api = {

      version: Module.cwrap('version', 'number', []),

      create_buffer: Module.cwrap('create_buffer', 'number', ['number', 'number']),

      destroy_buffer: Module.cwrap('destroy_buffer', '', ['number']),

      encode: Module.cwrap("encode", "", ["number","number","number","number",]),

      free_result: Module.cwrap("free_result", "", ["number"]),

      get_result_pointer: Module.cwrap("get_result_pointer", "number", []),

      get_result_size: Module.cwrap("get_result_size", "number", []),

    };

    

    const image = await loadImage('./image.jpg');

    const p = api.create_buffer(image.width, image.height);

    Module.HEAP8.set(image.data, p);

    

    api.encode(p, image.width, image.height, 100);

    const resultPointer = api.get_result_pointer();

    const resultSize = api.get_result_size();

    const resultView = new Uint8Array(Module.HEAP8.buffer, resultPointer, resultSize);

    const result = new Uint8Array(resultView);

    api.free_result(resultPointer);

    

    api.destroy_buffer(p);

  };

  

   async function loadImage(src) {

     // 加载图片

      const imgBlob = await fetch(src).then(resp => resp.blob());

      const img = await createImageBitmap(imgBlob);

      

      // 设置 canvas 画布的大小与图片一致

      const canvas = document.createElement('canvas');

      canvas.width = img.width;

      canvas.height = img.height;

      

      // 将图片绘制到 canvas 上

      const ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0);

      return ctx.getImageData(0, 0, img.width, img.height);

    }

</script>
复制代码
```

在上述代码中我们通过 `loadImage` 函数加载了一张本地的 `image.jpg` 图片，你需要事先准备一张图片放置在 `emcc` 编译器输出的目录下，也就是我们的 HTML 文件目录下使用。

> 注意：`new Uint8Array(someBuffer)` 将会在同样的内存块上创建一个新视图，而 `new Uint8Array(someTypedArray)` 只会复制 `someTypedArray` 的数据，确保使用复制的数据进行操作，不会修改原内存数据。

当你的图片比较大时，因为 wasm 不能自动扩充内存，如果默认分配的内存无法容纳 `input` 和 `output` 图片数据的内存，你可能会遇到如下报错：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26b2c179143d437fae2a479f3d5b282e~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

但是我们例子中使用的图片比较小，所以只需要单纯的在编译时加上一个过滤参数 `-s ALLOW_MEMORY_GROWTH=1` 忽略这个报错信息即可：

```
emcc -O3 -s WASM=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' \

    -I libwebp \

    webp.c \

    libwebp/src/{dec,dsp,demux,enc,mux,utils}/*.c \

    -s ALLOW_MEMORY_GROWTH=1
复制代码
```

再次运行上述命令，得到添加了编码函数的 wasm 代码和对应的 JavaScript 胶水代码，这样当我们打开 HTML 文件时，它已经能够将一份 JPG 文件编码成 WebP 的格式，为了进一步证实这个观点，我们可以将图片展示到 Web 界面上，通过修改 HTML 文件，添加如下代码：

```
<script>

  // ...

    api.encode(p, image.width, image.height, 100);

    const resultPointer = api.get_result_pointer();

    const resultSize = api.get_result_size();

    const resultView = new Uint8Array(Module.HEAP8.buffer, resultPointer, resultSize);

    const result = new Uint8Array(resultView);

    

    // 添加到这里

    const blob = new Blob([result], {type: 'image/webp'});

    const blobURL = URL.createObjectURL(blob);

    const img = document.createElement('img');

    img.src = blobURL;

    document.body.appendChild(img)

    

    api.free_result(resultPointer);

    

    api.destroy_buffer(p);

</script>
复制代码
```

然后刷新浏览器，你应该可以看到如下界面：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c2518fa30d243f68398f96a86b22e71~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

通过将这个文件下载到本地，可以看到其格式转成了 WebP：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac80e471ee674d11bc987d86a93fa3ed~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

通过上述的流程我们成功编译了现有的 libwebp C 库到 wasm 使用，并将 JPG 图片转成了 WebP 格式并展示在 Web 界面上，通过 wasm 来处理计算密集型的转码操作可以大大提高网页的性能，这也是 WebAssembly 带来的主要优势之一。

## 如何编译 FFmpeg 到 WebAssembly？

> 好家伙，刚刚教会 1+1，就开始解二次方程了。🌚

在上个例子中我们成功编译了已经存在的 C 模块到 WebAssembly，但是有很多更大型的项目依赖于 C 标准库、操作系统、文件系统或其他依赖，这些项目在编译前依赖 autoconfig/automake 等库来生成系统特定的代码。

所以你经常会看到一些库在使用之前，需要经过如下的步骤：

```
./configure # 处理前置依赖

make # 使用 gcc 等进行编译构建，生成对象文件
复制代码
```

而 Emscripten 提供了 `emconfigure` 和 `emmake` 来封装这些命令，并注入合适的参数来抹平那些有前置依赖的项目，如果使用 emcc 来处理这些有大量前置依赖的项目，命令会变成如下操作：

```
emmconfigure ./configure # 将配置中的默认编译器，如 gcc 替换成 emcc 编译器

emmake make # emmake make -j4 调起多核编译，生成 wasm 对象文件，而非传统的 C 对象文件

emcc xxx.o # 将 make 生成的对象文件编译成 wasm 文件 + JS 胶水代码
复制代码
```

接下来我们通过实际编译 ffmpeg 来讲解如何处理这种依赖 autoconfig/automake 等库来生成特定的代码。

> 经过实践发现 ffmpeg 的编译依赖于特定的 ffmpeg 版本、Emscripten 版本、操作系统环境等，所以以下的 ffmpeg 的编译都是限制在特定的条件下进行的，主要是为之后通用的 ffmpeg 的编译提供一种思路和调试方法。

### 准备目录

这一次我们创建 WebAssembly 目录，然后在这个目录下放置 ffmpeg 源码、以及后续要用到的 x264 解码器的相关代码：

```
mkdir WebAssembly



# Clone 代码仓库

git clone https: // github . com / emscripten-core / emsdk . git



# 进入仓库

cd emsdk



# 获取最新代码，如果是新 clone 的这一步可以不需要

git pull
复制代码
```

### 编译步骤

使用 Emscripten 编译大部分复杂的 C/C++ 库时，主要需要三个步骤：

1.  使用 `emconfigure` 运行项目的 `configure` 文件将 C/C++ 代码编译器从 `gcc/g++` 换成 `emcc/em++`
2.  通过 `emmake make` 来构建 C/C++ 项目，生成 wasm 对象的 `.o` 文件
3.  调用 `emcc` 接收编译的对象文件 `.o` 文件，然后输出最终的 WASM 和 JS 胶水代码

### 安装特定依赖

> 注意：这一步我们在讲解 Emscripten 的开头就已经安装了对应的版本，这里只是再强调一下版本。

为了验证 ffmpeg 的验证，我们需要依赖特定的版本，下面详细讲解依赖的各种文件版本。

首先安装 `1.39.18` 版本的 Emscripten 编译器，进入之前我们 Clone 到本地的 emsdk 项目运行如下命令：

```
./emsdk install 1.39.18

./emsdk activate 1.39.18

source ./emsdk_env.sh
复制代码
```

通过在命令行中输入如下命令验证是否切换成功：

```
emcc -v # 输出 1.39.18
复制代码
```

在 emsdk 同级下载分支为 `n4.3.1` 的 ffmpeg 代码：

```
git clone --depth 1 --branch n4.3.1 https://github.com/FFmpeg/FFmpeg
复制代码
```

### 使用 emconfigure 处理 configure 文件

通过如下脚本来处理 `configure` 文件：

```
export CFLAGS="-s USE_PTHREADS -O3"

export LDFLAGS="$CFLAGS -s INITIAL_MEMORY=33554432"



emconfigure ./configure \

  --target-os=none \ # 设置为 none 来去除特定操作系统的一些依赖

  --arch=x86_32 \ # 选中架构为 x86_32                                                                                                                

  --enable-cross-compile \ # 处理跨平台操作

  --disable-x86asm \  # 关闭 x86asm                                                                                                                

  --disable-inline-asm \  # 关闭内联的 asm                                                        

  --disable-stripping \ # 关闭处理 strip 的功能，避免误删一些内容

  --disable-programs \ # 加速编译

  --disable-doc \  # 添加一些 flag 输出

  --extra-cflags="$CFLAGS" \

  --extra-cxxflags="$CFLAGS" \

  --extra-ldflags="$LDFLAGS" \                  

  --nm="llvm-nm" \  # 使用 llvm 的编译器                                                             

  --ar=emar \                        

  --ranlib=emranlib \

  --cc=emcc \ # 将 gcc 替换为 emcc

  --cxx=em++ \ # 将 g++ 替换为 em++

  --objcc=emcc \

  --dep-cc=emcc 
复制代码
```

上述脚本主要做了如下几件事：

-   `USE_PTHREADS` 开启 `pthreads` 支持
-   `-O3` 表示在编译时优化代码体积，一般可以从 30MB 压缩到 15MB
-   `INITIAL_MEMORY` 设置为 33554432 （32MB），主要是 Emscripten 可能占用 19MB，所以设置更大的内存容量来避免在编译过程中可分配的内存不足的问题
-   实际使用 `emconfigure` 来配置 `configure` 文件，替换 `gcc` 编译器为 `emcc` ，以及设置一些必要的操作来处理可能遇到的编译 BUG，最终生成用于编译构建的配置文件

### 使用 emmake make 来构建依赖

通过上述步骤，就处理好了配置文件，接下来需要通过 emmake 来构建实际的依赖，通过在命令行中运行如下命令：

```
# 构建最终的 ffmpeg.wasm 文件

emmake make -j4
复制代码
```

通过上述的编译，会生成如下四个文件：

-   ffmpeg

-   ffmpeg\_g

-   ffmpeg\_g.wasm

-   ffmpeg\_g.worker.js

前两个都是 JS 文件，第三个为 wasm 模块，第四个是处理 worker 中运行相关逻辑的函数，上述生成的文件的理想形式应该为三个，为了达成这种自定义的编译，有必要自定义使用 `emcc` 命令来进行处理。

### 使用 emcc 进行编译输出

在 `FFmpeg` 目录下创建 `wasm` 文件夹，用于放置构建之后的文件，然后自定义编译文件输出如下：

```
mkdir -p wasm/dist



emcc \                   

 -I. -I./fftools \  

  -Llibavcodec -Llibavdevice -Llibavfilter -Llibavformat -Llibavresample -Llibavutil -Llibpostproc -Llibswscale -Llibswresample \

  -Qunused-arguments \    

  -o wasm/dist/ffmpeg-core.js fftools/ffmpeg_opt.c fftools/ffmpeg_filter.c fftools/ffmpeg_hw.c fftools/cmdutils.c fftools/ffmpeg.c \

  -lavdevice -lavfilter -lavformat -lavcodec -lswresample -lswscale -lavutil -lm \

  -O3 \                

  -s USE_SDL=2 \    # 使用 SDL2

  -s USE_PTHREADS=1 \

  -s PROXY_TO_PTHREAD=1 \ # 将 main 函数与浏览器/UI主线程分离  

  -s INVOKE_RUN=0 \ # 执行 C 函数时不首先执行 main 函数           

  -s EXPORTED_FUNCTIONS="[_main, _proxy_main]" \

  -s EXTRA_EXPORTED_RUNTIME_METHODS="[FS, cwrap, setValue, writeAsciiToMemory]" \

  -s INITIAL_MEMORY=33554432
复制代码
```

上述的脚本主要有如下几点改进：

4.  `-s PROXY_TO_PTHREAD=1` 在编译时设置了 `pthread` 时，使得程序具备响应式特效
5.  `-o wasm/dist/ffmpeg-core.js` 则将原 `ffmpeg` js 文件的输出重命名为 `ffmpeg-core.js` ，对应的输出 `ffmpeg-core.wasm` 和 `ffmpeg-core.worker.js`
6.  `-s EXPORTED_FUNCTIONS="[_main, _proxy_main]"` 导出 ffmpeg 对应的 C 文件里的 `main` 函数，`proxy_main` 则是通过设置 `PROXY_TO_PTHREAD` 代理 `main` 函数用于外部使用
7.  `-s EXTRA_EXPORTED_RUNTIME_METHODS="[FS, cwrap, setValue, writeAsciiToMemory]"` 则是导出一些 runtime 的辅助函数，用于导出 C 函数、处理文件系统、指针的操作

通过上述编译命令最终输出下面三个文件：

-   `ffmpeg-core.js`

-   `ffmpeg-core.wasm`

-   `ffmpeg-core.worker.js`

### 使用编译完成的 ffmpeg wasm 模块

在 `wasm` 目录下创建 `ffmpeg.js` 文件，在其中写入如下代码：

```
const Module = require('./dist/ffmpeg-core.js');



Module.onRuntimeInitialized = () => {

  const ffmpeg = Module.cwrap('proxy_main', 'number', ['number', 'number']);

};
复制代码
```

然后通过如下命令运行上述代码：

```
node --experimental-wasm-threads --experimental-wasm-bulk-memory ffmpeg.js
复制代码
```

上述代码解释如下：

-   `onRuntimeInitialized` 是加载 WebAssembly 模块完成之后执行的逻辑，我们所有相关逻辑需要在这个函数中编写
    
-   `cwrap` 则用于导出 C 文件中（`fftools/ffmpeg.c` ）的 `proxy_main` 使用，函数的签名为 `int main(int argc, char **argv)` ，其中 `int` 对应到 JavaScript 就是 `number` ，argc 表示参数的个数 ，而 `char **argv` 是 C 中的指针，表示实际参数的指针数组，也可以映射到 `number`
    
-   接着处理 `ffmpeg` 的传参兼容逻辑，对于命令行中运行 `ffmpeg -hide_banner` ，在我们代码里通过函数调用需要 `main(2, ["./ffmpeg", "-hide_banner"])` ，第一个参数很好解决，那么我们如何传递一个字符串数组呢？这个问题可以分解为两个部分：
    
    -   我们需要将 JavaScript 的字符串转换成 C 中的字符数组
    -   我们需要将 JavaScript 中的数组转换为 C 中的指针数组

第一部分很简单，因为 Emscripten 提供了一个辅助函数 `writeAsciiToMemory` 来完成这一工作：

```
const str = "FFmpeg.wasm";

const buf = Module._malloc(str.length + 1); // 额外分配一个字节的空间来存放 0 表示字符串的结束

Module.writeAsciiToMemory(str, buf);
复制代码
```

第二部分有一点困难，我们需要创建 C 中的 32 位整数的指针数组，可以借助 `setValue` 来帮助我们创建这个数组：

```
const ptrs = [123, 3455];

const buf = Module._malloc(ptrs.length * Uint32Array.BYTES_PER_ELEMENT);

ptrs.forEach((p, idx) => {

  Module.setValue(buf + (Uint32Array.BYTES_PER_ELEMENT * idx), p, 'i32');

});
复制代码
```

将上述的代码合并起来，我们就可以获取一个能与 `ffmpeg` 交互的程序：

```
const Module = require('./dist/ffmpeg-core');



Module.onRuntimeInitialized = () => {

  const ffmpeg = Module.cwrap('proxy_main', 'number', ['number', 'number']);

  const args = ['ffmpeg', '-hide_banner'];

  const argsPtr = Module._malloc(args.length * Uint32Array.BYTES_PER_ELEMENT);

  args.forEach((s, idx) => {

    const buf = Module._malloc(s.length + 1);

    Module.writeAsciiToMemory(s, buf);

    Module.setValue(argsPtr + (Uint32Array.BYTES_PER_ELEMENT * idx), buf, 'i32');

  })

  ffmpeg(args.length, argsPtr);

};
复制代码
```

然后通过同样的命令运行程序：

```
node --experimental-wasm-threads --experimental-wasm-bulk-memory ffmpeg.js
复制代码
```

上述运行的结果如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/746ac8277b924ff6b1eebef187f1139f~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

可以看到我们成功编译并运行了 ffmpeg 🎉。

### 处理 Emscripten 文件系统

Emscripten 内建了一个虚拟的文件系统来支持 C 中标准的文件读取和写入，所以我们需要将音频文件传给 ffmpeg.wasm 时先写入到文件系统中。

> 可以戳此查看更多关于[文件系统 API](https://link.juejin.cn/?target=https%3A%2F%2Femscripten.org%2Fdocs%2Fapi_reference%2FFilesystem-API.html "https://emscripten.org/docs/api_reference/Filesystem-API.html") 。

为了完成上述的任务，只需要使用到 FS 模块的两个函数 `FS.writeFile()` 和 `FS.readFile()` ，对于从文件系统中读取和写入的所有数据都要求是 JavaScript 中的 Uint8Array 类型，所以在消费数据之前有必要约定数据类型。

我们将通过 `fs.readFileSync()` 方法读取名为 `flame.avi` 的视频文件，然后使用 `FS.writeFile()` 将其写入到 Emscripten 文件系统。

```
const fs = require('fs');

const Module = require('./dist/ffmpeg-core');



Module.onRuntimeInitialized = () => {

  const data = Uint8Array.from(fs.readFileSync('./flame.avi'));

  Module.FS.writeFile('flame.avi', data);



  const ffmpeg = Module.cwrap('proxy_main', 'number', ['number', 'number']);

  const args = ['ffmpeg', '-hide_banner'];

  const argsPtr = Module._malloc(args.length * Uint32Array.BYTES_PER_ELEMENT);

  args.forEach((s, idx) => {

    const buf = Module._malloc(s.length + 1);

    Module.writeAsciiToMemory(s, buf);

    Module.setValue(argsPtr + (Uint32Array.BYTES_PER_ELEMENT * idx), buf, 'i32');

  })

  ffmpeg(args.length, argsPtr);

};
复制代码
```

### 使用 ffmpeg.wasm 编译视频

现在我们已经可以将视频文件保存到 Emscripten 文件系统了，接下来就是实际使用编译好的 ffmepg 来进行视频的转码了。

我们修改代码如下：

```
const fs = require('fs');

const Module = require('./dist/ffmpeg-core');



Module.onRuntimeInitialized = () => {

  const data = Uint8Array.from(fs.readFileSync('./flame.avi'));

  Module.FS.writeFile('flame.avi', data);



  const ffmpeg = Module.cwrap('proxy_main', 'number', ['number', 'number']);

  const args = ['ffmpeg', '-hide_banner', '-report', '-i', 'flame.avi', 'flame.mp4'];

  const argsPtr = Module._malloc(args.length * Uint32Array.BYTES_PER_ELEMENT);

  args.forEach((s, idx) => {

    const buf = Module._malloc(s.length + 1);

    Module.writeAsciiToMemory(s, buf);

    Module.setValue(argsPtr + (Uint32Array.BYTES_PER_ELEMENT * idx), buf, 'i32');

  });

  ffmpeg(args.length, argsPtr);



  const timer = setInterval(() => {

    const logFileName = Module.FS.readdir('.').find(name => name.endsWith('.log'));

    if (typeof logFileName !== 'undefined') {

      const log = String.fromCharCode.apply(null, Module.FS.readFile(logFileName));

      if (log.includes("frames successfully decoded")) {

        clearInterval(timer);

        const output = Module.FS.readFile('flame.mp4');

        fs.writeFileSync('flame.mp4', output);

      }

    }

  }, 500);



};
复制代码
```

在上述代码中，我们添加了一个定时器，因为 ffmpeg 转码视频的过程是异步的，所以我们需要不断的去读取 Emscripten 文件系统中是否有转码好的文件标志，当拿到文件标志且不为 undefined，我们就使用 `Module.FS.readFile()` 方法从 Emscripten 文件系统中读取转码好的视频文件，然后通过 `fs.writeFileSync()` 将视频写入到本地文件系统。最终我们会收到如下结果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8ab564b8fd84cf1b3783c0f10de7c98~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

## 在浏览器中使用 ffmpeg 转码视频并播放

在上一步中，我们成功在 Node 端使用了编译好的 ffmpeg 完成从了 `avi` 格式到 `mp4` 格式的转码，接下来我们将在浏览器中使用 ffmpeg 转码视频，并在浏览器中播放。

之前我们编译的 ffmpeg 虽然可以将 `avi` 格式转码到 `mp4` ，但是这种通过默认编码格式转码的 `mp4` 的文件无法直接在浏览器中播放，因为浏览器不支持这种编码，所以我们需要使用 `libx264` 编码器来将 `mp4` 文件编码成浏览器可播放的编码格式。

首先在 `WebAssembly` 目录下下载 `x264` 的编码器源码：

```
curl -OL https://download.videolan.org/pub/videolan/x264/snapshots/x264-snapshot-20170226-2245-stable.tar.bz2

tar xvfj x264-snapshot-20170226-2245-stable.tar.bz2
复制代码
```

然后进入 x264 的文件夹，可以创建一个 `build-x264.sh` 文件，并加入如下内容：

```
 #!/bin/bash -x



ROOT=$PWD

BUILD_DIR=$ROOT/build



cd $ROOT/x264-snapshot-20170226-2245-stable

ARGS=(

  --prefix=$BUILD_DIR

  --host=i686-gnu                     # use i686 gnu

  --enable-static                     # enable building static library

  --disable-cli                       # disable cli tools

  --disable-asm                       # disable asm optimization

  --extra-cflags="-s USE_PTHREADS=1"  # pass this flags for using pthreads

)

emconfigure ./configure "${ARGS[@]}"



emmake make install-lib-static -j4



cd -
复制代码
```

注意需要在 WebAssembly 目录下运行如下命令来构建 x264：

```
bash x264-snapshot-20170226-2245-stable/build-x264.sh
复制代码
```

安装了 `x264` 编码器之后，就可以在 ffmpeg 的编译脚本中加入打开 `x264` 的开关，这一次我们在 `ffmpeg` 文件夹下创建 Bash 脚本用于构建，创建 `build.sh` 如下：

```
 #!/bin/bash -x



emcc -v



ROOT=$PWD

BUILD_DIR=$ROOT/build



cd $ROOT/FFmpeg



CFLAGS="-s USE_PTHREADS -I$BUILD_DIR/include"

LDFLAGS="$CFLAGS -L$BUILD_DIR/lib -s INITIAL_MEMORY=33554432" # 33554432 bytes = 32 MB



CONFIG_ARGS=(

 --target-os=none        # use none to prevent any os specific configurations

 --arch=x86_32           # use x86_32 to achieve minimal architectural optimization

 --enable-cross-compile  # enable cross compile

 --disable-x86asm        # disable x86 asm

 --disable-inline-asm    # disable inline asm

 --disable-stripping

 --disable-programs      # disable programs build (incl. ffplay, ffprobe & ffmpeg)

 --disable-doc           # disable doc

 --enable-gpl            ## required by x264

 --enable-libx264        ## enable x264

 --extra-cflags="$CFLAGS"

 --extra-cxxflags="$CFLAGS"

 --extra-ldflags="$LDFLAGS"

 --nm="llvm-nm"

 --ar=emar

 --ranlib=emranlib

 --cc=emcc

 --cxx=em++

 --objcc=emcc

 --dep-cc=emcc

 )



emconfigure ./configure "${CONFIG_ARGS[@]}"



 # build ffmpeg.wasm

emmake make -j4



cd -
复制代码
```

针对上述编译脚本，在 WebAssembly 目录下运行如下命令来进行配置文件的处理以及文件编译：

```
bash FFmpeg/build.sh
复制代码
```

然后创建用于自定义输出构建文件的脚本文件 `build-with-emcc.sh` ：

```
ROOT=$PWD

BUILD_DIR=$ROOT/build



cd FFmpeg



ARGS=(

  -I. -I./fftools -I$BUILD_DIR/include

  -Llibavcodec -Llibavdevice -Llibavfilter -Llibavformat -Llibavresample -Llibavutil -Llibpostproc -Llibswscale -Llibswresample -L$BUILD_DIR/lib

  -Qunused-arguments

  # 这一行加入 -lpostproc 和 -lx264，添加加入 x264 的编译

  -o wasm/dist/ffmpeg-core.js fftools/ffmpeg_opt.c fftools/ffmpeg_filter.c fftools/ffmpeg_hw.c fftools/cmdutils.c fftools/ffmpeg.c

  -lavdevice -lavfilter -lavformat -lavcodec -lswresample -lswscale -lavutil -lpostproc -lm -lx264 -pthread

  -O3                                           # Optimize code with performance first

  -s USE_SDL=2                                  # use SDL2

  -s USE_PTHREADS=1                             # enable pthreads support

  -s PROXY_TO_PTHREAD=1                         # detach main() from browser/UI main thread

  -s INVOKE_RUN=0                               # not to run the main() in the beginning

  -s EXPORTED_FUNCTIONS="[_main, _proxy_main]"  # export main and proxy_main funcs

  -s EXTRA_EXPORTED_RUNTIME_METHODS="[FS, cwrap, setValue, writeAsciiToMemory]"   # export preamble funcs

  -s INITIAL_MEMORY=268435456                    # 268435456 bytes = 268435456 MB

)

emcc "${ARGS[@]}"



cd -
复制代码
```

然后运行这个脚本，接收上一步编译的对象文件，编译成 WASM 和 JS 胶水代码：

```
bash FFmpeg/build-with-emcc.sh
复制代码
```

### 实际使用 ffmpeg 转码

我们将创建一个 Web 网页，然后提供一个上传视频文件的按钮，以及播放上传的视频文件。尽管无法直接在 Web 端播放 avi 格式的视频文件，但是我们可以通过 ffmpeg 转码之后播放。

在 ffmpeg 目录下的 `wasm` 文件夹下创建 `index.html` 文件，然后添加如下内容：

```
<html>                                                                                                                                            

  <head>                                                                                                                                          

    <style>                                                                                                                                       

      html, body {                                                       

        margin: 0;                                                       

        width: 100%;                                                     

        height: 100%                                                     

      }                                                                  

      body {                                                                                                                                      

        display: flex;                                                   

        flex-direction: column;

        align-items: center;                                             

      }   

    </style>                                                                                                                                      

  </head>                                                                

  <body>                                                                 

    <h3>上传视频文件，然后转码到 mp4 (x264) 进行播放!</h3>

    <video id="output-video" controls></video><br/> 

    <input type="file" id="uploader">                   

    <p id="message">ffmpeg 脚本需要等待 5S 左右加载完成</p>

    <script type="text/javascript">                                                                                                               

      const readFromBlobOrFile = (blob) => (

        new Promise((resolve, reject) => {

          const fileReader = new FileReader();

          fileReader.onload = () => {

            resolve(fileReader.result);

          };

          fileReader.onerror = ({ target: { error: { code } } }) => {

            reject(Error(`File could not be read! Code=${code}`));

          };

          fileReader.readAsArrayBuffer(blob);

        })

      );

      

      const message = document.getElementById('message');

      const transcode = async ({ target: { files } }) => {

        const { name } = files[0];

        message.innerHTML = '将文件写入到 Emscripten 文件系统';

        const data = await readFromBlobOrFile(files[0]);                                                                                          

        Module.FS.writeFile(name, new Uint8Array(data));                                                                                          

        const ffmpeg = Module.cwrap('proxy_main', 'number', ['number', 'number']);

        const args = ['ffmpeg', '-hide_banner', '-nostdin', '-report', '-i', name, 'out.mp4'];

        

        const argsPtr = Module._malloc(args.length * Uint32Array.BYTES_PER_ELEMENT);

        args.forEach((s, idx) => {                                       

          const buf = Module._malloc(s.length + 1);                      

          Module.writeAsciiToMemory(s, buf);                                                                                                      

          Module.setValue(argsPtr + (Uint32Array.BYTES_PER_ELEMENT * idx), buf, 'i32');

        });                   

         

        message.innerHTML = '开始转码';                        

        ffmpeg(args.length, argsPtr);

                                                           

        const timer = setInterval(() => {               

          const logFileName = Module.FS.readdir('.').find(name => name.endsWith('.log'));

          if (typeof logFileName !== 'undefined') {                                                                                               

            const log = String.fromCharCode.apply(null, Module.FS.readFile(logFileName));

            if (log.includes("frames successfully decoded")) {

              clearInterval(timer);                                      

              message.innerHTML = '完成转码';

              const out = Module.FS.readFile('out.mp4');

              const video = document.getElementById('output-video');

              video.src = URL.createObjectURL(new Blob([out.buffer], { type: 'video/mp4' }));

            }                                                            

          } 

        }, 500);                                                         

      };  

      document.getElementById('uploader').addEventListener('change', transcode);

    </script>                                                            

    <script type="text/javascript" src="./dist/ffmpeg-core.js"></script>

  </body>                         

</html>           
复制代码
```

打开上述网页运行。

## 如何调试 WebAssembly 代码？

### WebAssembly 的原始调试方式

Chrome 开发者工具目前已经支持 WebAssembly 的调试，虽然存在一些限制，但是针对 WebAssembly 的文本格式的文件能进行单个指令的分析以及查看原始的堆栈追踪，具体见如下图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/382ee5cc502b4453bd9136108f121308~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

上述的方法对于一些无其他依赖函数的 WebAssembly 模块来说可以很好的运行，因为这些模块只涉及到很小的调试范围。但是对于复杂的应用来说，如 C/C++ 编写的复杂应用，一个模块依赖其他很多模块，且源代码与编译后的 WebAssembly 的文本格式的映射有较大的区别时，上述的调试方式就不太直观了，只能靠猜的方式才能理解其中的代码运行方式，且大多数人很难以看懂复杂的汇编代码。

### 更加直观的调试方式

现代的 JavaScript 项目在开发时通常也会存在编译的过程，使用 ES6 进行开发，编译到 ES5 及以下的版本进行运行，这个时候如果需要调试代码，就涉及到 Source Map 的概念，source map 用于映射编译后的对应代码在源代码中的位置，source map 使得客户端的代码更具可读性、更方便调试，但是又不会对性能造成很大的影响。

而 C/C++ 到 WebAssembly 代码的编译器 Emscripten 则支持在编译时，为代码注入相关的调试信息，生成对应的 source map，然后安装 Chrome 团队编写的 [C/C++ Devtools Support](https://link.juejin.cn/?target=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fcc%2B%2B-devtools-support-dwa%2Fpdcpmagijalfljmkmjngeonclgbbannb "https://chrome.google.com/webstore/detail/cc++-devtools-support-dwa/pdcpmagijalfljmkmjngeonclgbbannb") 浏览器扩展，就可以使用 Chrome 开发者工具调试 C/C++ 代码了。

这里的原理其实就是，Emscripten 在编译时，会生成一种 DWARF 格式的调试文件，这是一种被大多数编译器使用的通用调试文件格式，而 [C/C++ Devtools Support](https://link.juejin.cn/?target=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fcc%2B%2B-devtools-support-dwa%2Fpdcpmagijalfljmkmjngeonclgbbannb "https://chrome.google.com/webstore/detail/cc++-devtools-support-dwa/pdcpmagijalfljmkmjngeonclgbbannb") 则会解析 DWARF 文件，为 Chrome Devtools 在调试时提供 source map 相关的信息，使得开发者可以在 89+ 版本以上的 Chrome Devtools 上调试 C/C++ 代码。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbb6c809f7fc408795a66d89f854cb50~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### 调试简单的 C 应用

因为 DWARF 格式的调试文件可以提供处理变量名、格式化类型打印消息、在源代码中执行表达式等等，现在就让我们实际来编写一个简单的 C 程序，然后编译到 WebAssembly 并在浏览器中运行，查看实际的调试效果吧。

首先让我们进入到之前创建的 WebAssembly 目录下，激活 emcc 相关的命令，然后查看激活效果：

```
cd emsdk && source emsdk_env.sh

emcc --version # emcc (Emscripten gcc/clang-like replacement) 1.39.18 (a3beeb0d6c9825bd1757d03677e817d819949a77)
复制代码
```

接着在 WebAssembly 创建一个 `temp` 文件夹，然后创建 `temp.c` 文件，填充如下内容并保存：

```
#include <stdlib.h>



void assert_less(int x, int y) {

  if (x >= y) {

    abort();

  }

}



int main() {

  assert_less(10, 20);

  assert_less(30, 20);

}
复制代码
```

上述代码在执行 `asset_less` 时，如果遇到 `x >= y` 的情况会抛出异常，终止程序执行。

在终端切换目录到 `temp` 目录下执行 `emcc` 命令进行编译：

```
emcc -g temp.c -o temp.html
复制代码
```

上述命令在普通的编译形式上，加入了 `-g` 参数，告诉 Emscripten 在编译时为代码注入 DWARF 调试信息。

现在可以开启一个 HTTP 服务器，可以使用 `npx serve .` ，然后访问 `localhost:5000/temp.html` 查看运行效果。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ba0e9094c1a46e7bb5496631a68f8df~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

> 需要确保已经安装了 Chrome 扩展：[chrome.google.com/webstore/de…](https://link.juejin.cn/?target=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fcc%2B%2B-devtools-support-dwa%2Fpdcpmagijalfljmkmjngeonclgbbannb%25EF%25BC%258C%25E4%25BB%25A5%25E5%258F%258A "https://chrome.google.com/webstore/detail/cc++-devtools-support-dwa/pdcpmagijalfljmkmjngeonclgbbannb%EF%BC%8C%E4%BB%A5%E5%8F%8A") Chrome Devtools 升级到 89+ 版本。

为了查看调试效果，需要设置一些内容。

8.  打开 Chrome Devtools 里面的 WebAssembly 调试选项

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8418b600d36c4691b8afedc7296f97cf~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc4d09946d6447aa8d0318c8ebfd294b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

设置完之后，在工具栏顶部会出现一个 Reload 的蓝色按钮，需要重新加载配置，点击一下就好。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fdceab4dab347ea8d3f162a6f7e1515~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

9.  设置调试选项，在遇到异常的地方暂停

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c2bfabf63f14931b5b43a440b8a5b44~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

10.  刷新浏览器，然后你会发现断点停在了 `temp.js` ，由 Emscripten 编译生成的 JS 胶水代码，然后顺着调用栈去找，可以查看到 `temp.c` 并定位到抛出异常的位置：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e3e977470914035bbd32727cbe00c61~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b67736bac097478c8d9e5316f657c152~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

可以看到，我们成功在 Chrome Devtools 里面查看了 C 代码，并且代码停在了 `abort()` 处，同时还可以类似我们调试 JS 时一样，查看当前 scope 下的值：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cc5ae8d8ae64880b3ada9605055833b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

如上述可以查看 `x` 、`y` 值，将鼠标浮动到 `x` 上还可以显示此时的值。

### 查看复杂类型值

实际上 Chrome Devtools 不仅可以查看原 C/C++ 代码中一些变量的普通类型值，如数字、字符串，还可以查看更加复杂的结构，如结构体、数组、类等内容，我们拿另外一个例子来展现这个效果。

我们通过一个在 C++ 里面绘制 曼德博图形 的例子来展示上述的效果，同样在 WebAssembly 目录下创建 `mandelbrot` 文件夹，然后添加 `mandelbrot.cc` 文件，并填入如下内容：

```
#include <SDL2/SDL.h>

#include <complex>



int main() {

  // 初始化 SDL 

  int width = 600, height = 600;

  SDL_Init(SDL_INIT_VIDEO);

  SDL_Window* window;

  SDL_Renderer* renderer;

  SDL_CreateWindowAndRenderer(width, height, SDL_WINDOW_OPENGL, &window,

                              &renderer);



  // 为画板填充随机的颜色

  enum { MAX_ITER_COUNT = 256 };

  SDL_Color palette[MAX_ITER_COUNT];

  srand(time(0));

  for (int i = 0; i < MAX_ITER_COUNT; ++i) {

    palette[i] = {

        .r = (uint8_t)rand(),

        .g = (uint8_t)rand(),

        .b = (uint8_t)rand(),

        .a = 255,

    };

  }

  

  



  // 计算 曼德博 集合并绘制 曼德博 图形

  std::complex<double> center(0.5, 0.5);

  double scale = 4.0;

  for (int y = 0; y < height; y++) {

    for (int x = 0; x < width; x++) {

      std::complex<double> point((double)x / width, (double)y / height);

      std::complex<double> c = (point - center) * scale;

      std::complex<double> z(0, 0);

      int i = 0;

      for (; i < MAX_ITER_COUNT - 1; i++) {

        z = z * z + c;

        if (abs(z) > 2.0)

          break;

      }

      SDL_Color color = palette[i];

      SDL_SetRenderDrawColor(renderer, color.r, color.g, color.b, color.a);

      SDL_RenderDrawPoint(renderer, x, y);

    }

  }





  // 将我们在 canvas 绘制的内容渲染出来

  SDL_RenderPresent(renderer);





  // SDL_Quit();

}
复制代码
```

上述代码差不多 50 行左右，但是引用了两个 C++ 标准库：[SDL](https://link.juejin.cn/?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FSimple_DirectMedia_Layer "https://en.wikipedia.org/wiki/Simple_DirectMedia_Layer") 和 [complex numbers](https://link.juejin.cn/?target=https%3A%2F%2Fen.cppreference.com%2Fw%2Fcpp%2Fnumeric%2Fcomplex "https://en.cppreference.com/w/cpp/numeric/complex") ，这使得我们的代码变得有一点复杂了，我们接下来编译上述代码，来看看 Chrome Devtools 的调试效果如何。

通过在编译时带上 `-g` 标签，告诉 Emscripten 编译器带上调试信息，并寻求 Emscripten 在编译时注入 SDL2 库以及允许库在运行时可以使用任意内存大小：

```
emcc -g mandelbrot.cc -o mandelbrot.html \

     -s USE_SDL=2 \

     -s ALLOW_MEMORY_GROWTH=1
复制代码
```

同样使用 `npx serve .` 命令开启一个本地的 Web 服务器，然后访问 [http://localhost:5000/mandelbrot.html](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost%3A5000%2Fmandelbrot.html "http://localhost:5000/mandelbrot.html") 可以看到如下效果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/feb927e715464ef1ac2fc31f21832d6d~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

打开开发者工具，然后可以搜索到 `mandelbrot.cc` 文件，我们可以看到如下内容：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21aed7bed9c14b48888999ea0e1bf727~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

我们可以在第一个 for 循环里面的 `palette` 赋值语句哪一行打一个断点，然后重新刷新网页，我们发现执行逻辑会暂停到我们的断点处，通过查看右侧的 Scope 面板，可以看到一些有意思的内容。

#### 使用 Scope 面板

我们可以看到复杂类型如 `center` 、`palette` ，还可以展开它们，查看复杂类型里面具体的值：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/438eef03692341908c23d76b44c001b7~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

#### 直接在程序中查看

同时将鼠标移动到 `palette` 等变量上面，同样可以查看值的类型：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dcdfa52277b44ac98ced74324c842d7e~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

#### 在控制台中使用

同时在控制台里面也可以通过输入变量名获取到值，依然可以查看复杂类型：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc3745231239402f984e74c32160143a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

还可以对复杂类型进行取值、计算相关的操作：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/437bd6ac81b34d309524a339f7942c68~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

#### 使用 watch 功能

我们也可以把使用调试面板里面的 watch 功能，添加 for 循环里面的 i 到 watch 列表，然后恢复程序执行就可以看到 i 的变化：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27972da1732b4da4a5bb4c86b4c517f2~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### 更加复杂的步进调试

我们同样可以使用另外几个调试工具：step over、step in、step out、step 等，如我们使用 step over，向后执行两步：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33dd687bf087434d91ab82d2ea0df5ac~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

可以查看到当前步的变量值，也可以在 Scope 面板中看到对应的值。

### 针对非源码编译的第三方库进行调试

在之前我们只编译了 `mandelbrot.cc` 文件，并在编译时要求 Emscripten 为我们提供内建的 SDL 相关的库，由于 SDL 库并不是我们从源码编译而来，所以不会带上调试相关的信息，所以我们仅仅在 `mandelbrot.cc` 里面可以通过查看 C++ 代码的形式来调试，而对于 SDL 相关的内容则只能查看 WebAssembly 相关的代码来进行调试。

如我们在 41 行，SDL\_SetRenderDrawColor 调用处打上断点，并使用 step in 进入到函数内部：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42ab16f85585444b8e2bc9876dfb7173~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

会变成如下的形式：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03391ca955cd4645b105d2575cd78615~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

我们又回到了原始的 WebAssembly 的调试形式，这也是难以避免的一种情况，因为我们在开发过程中可能会遇到各种第三方库，但是我们并不能保证每个库都能从源码编译而来且带上了类似 DWARF 的调试信息，绝大部分情况下我们无法控制第三方库的行为；而另外一种情况则是有时我们会在生产情况下遇到问题，而生产环境也是没有调试信息的。

上述情况暂时还没有比较好的处理方法，但是开发者工具却改进了上述的调试体验，将所有的代码都打包成单一的 WebAssembly 文件，对应到我们这次就是 `mandelbrot.wasm` 文件，这样我们再也无需担心其中的某段代码到底来自那个源文件。

### 新的命名生成策略

之前的调试面板里面，针对 WebAssembly 只有一些数字索引，而对于函数则连名字都没有，如果没有必要的类型信息，那么很难追踪到某个具体的值，因为指针将以整数的形式展示出来，但你不知道这些整数背后存储着什么。

新的命名策略参考了其他反汇编工具的命名策略，使用了 [WebAssembly 命名策略](https://link.juejin.cn/?target=https%3A%2F%2Fwebassembly.github.io%2Fspec%2Fcore%2Fappendix%2Fcustom.html%23name-section "https://webassembly.github.io/spec/core/appendix/custom.html#name-section")部分的内容、import/export 的路径相关的内容，可以看到我们现在的调试面板中针对函数可以展示函数名相关的信息：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/304a27bc724b40f69c34323673a4ef34~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

即使遇到了程序错误，基于语句的类型和索引也可以生成类似 `$func123` 这样的名字，大大提高了栈追踪和反汇编的体验。

### 查看内存面板

如果想要调试此时程序占用的内存相关的内容，可以在 WebAssembly 的上下文下，查看 Scope 面板里的 `Module.memories.$env.memory` ，但是这只能看到一些独立的字节，无法了解到这些字节对应到的其他数据格式，如 ASCII 格式。但是 Chrome 开发者工具还为我们提供了一些其他更加强大的内存查看形式，当我们右键点击 `env.memory` 时，可以选择 Reveal in Memory Inspector panel：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ed8b556d99844c3a96c5d6ada601294~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

或者点击 `env.memory` 旁边的小图标：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31b637e75ea44f7d8d164a3cac4b3325~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

可以打开内存面板：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2aa3e3caf7634c99b37b01630bf50782~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

从内存面板里面可以查看以十六进制或 ASCII 的形式查看 WebAssembly 的内存，导航到特定的内存地址，将特定数据解析成各种不同的格式，如十六进制 65 代表的 e 这个 ASCII 字符。

### 对 WebAssembly 代码进行性能分析

因为我们在编译时为代码注入了很多调试信息，运行的代码是未经优化且冗长的代码，所以运行时会很慢，所以如果为了评估程序运行的性能，你不能使用 `performance.now` 或者 `console.time` 等 API，因为这些函数调用获得的性能相关的数字通常不能反应真实世界的效果。

所以如果需要对代码进行性能分析，你需要使用开发者工具提供的性能面板，性能面板里面会全速运行代码，并且提供不同函数执行时花费时间的明确断点信息：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3857997b5224038b80016982c167d40~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

可以看到上述几个比较典型的时间点如 161ms，或者 461ms 的 LCP 与 FCP ，这些都是能反应真实世界下的性能指标。

或者你可以在加载网页时关闭控制台，这样就不会涉及到调试信息等相关内容的调用，可以确保比较真实的效果，等到页面加载完成，然后再打开控制台查看相关的指标信息。

### 在不同的机器上进行调试

当在 Docker、虚拟机或者其他原创服务器上进行构建时，你可能会遇到那种构建时使用的源文件路径和本地文件系统上的文件路径不一致，这会导致开发者工具在运行时可以在 Sources 面板里展示出有这个文件，但是无法加载文件内容。

为了解决这个问题，我们需要在之前安装的 [C/C++ Devtools Support](https://link.juejin.cn/?target=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fcc%2520%2520-devtools-support-dwa%2Fpdcpmagijalfljmkmjngeonclgbbannb "https://chrome.google.com/webstore/detail/cc%20%20-devtools-support-dwa/pdcpmagijalfljmkmjngeonclgbbannb") 配置里面设置路径映射，点击扩展的 “选项”：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32ebed3e05e34d218971024e571e67c7~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

然后添加路径映射，在 old/path 里填入之前的源文件构建时的路径，在 new/path 里填入现在存在本地文件系统上的文件路径：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b85fcd69962747da94c02129ebaacc49~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

上述映射的功能和一些 C++ 的调试器如 GDB 的 `set substitute-path` 以及 LLDB 的 `target.source-map` 很像。这样开发者工具在查找源文件时，会查看是否在配置的路径映射里有对应的映射，如果源路径无法加载文件，那么开发者工具会尝试从映射路径加载文件，否则会加载失败。

### 调试优化性构建的代码

如果你想调试一些在构建时进行优化后的代码，可能会获得不太理想的调试体验，因为进行优化构建时，函数内联在一起，可能还会对代码进行重排序或去除一部分无用的代码，这些都可能会混淆调试者。

目前开发者工具除了对函数内联时不能搞很好的支持外，能够支持绝大部分优化后代码的调试体验，为了减少函数内联支持能力欠缺带来的调试影响，建议在对代码进行编译时加入 `-fno-inline` 标志来取消优化构建时（通常是带上 `-O` 参数）对函数进行内联处理的功能，未来开发者工具会修复这个问题。所以针对之前提到的简单 C 程序的编译脚本如下：

```
emcc -g temp.c -o temp.html \

     -O3 -fno-inline
复制代码
```

### 将调试信息单独存储

调试信息包含代码的详细信息，定义的类型、变量、函数、函数作用域、以及文件位置等任何有利于调试器使用的信息，所以通常调试信息比源代码还要大。

为了加速 WebAssembly 模块的编译和加载速度，你可以在编译时将调试信息拆分成独立的 WebAssembly 文件，然后单独加载，为了实现拆分单独文件，可以在编译时加入 `-gseparate-dwarf` 操作：

```
emcc -g temp.c -o temp.html \

     -gseparate-dwarf=temp.debug.wasm
复制代码
```

进行上述操作之后，编译之后的主应用代码只会存储一个 `temp.debug.wasm` 的文件名，然后在代码加载时，插件会定位到调试文件的位置并将其加载进开发者工具。

如果我们想同时进行优化构建，并将调试信息单独拆分，并在之后需要调试时，加载本地的调试文件进行调试，在这种场景下，我们需要重载调试文件存储的地址来帮助插件能够找到这个文件，可以运行如下命令来处理：

```
emcc -g temp.c -o temp.html \

     -O3 -fno-inline \

     -gseparate-dwarf=temp.debug.wasm \

     -s SEPARATE_DWARF_URL=file://[temp.debug.wasm 在本地文件系统的存储地址]
复制代码
```

### 在浏览器中调试 ffmpeg 代码

通过这篇文章我们深入了解了如何在浏览器中调试通过 Emscripten 构建而来的 C/C++ 代码，上述讲解了一个普通无依赖的例子以及一个依赖于 C++ 标准库 SDL 的例子，并且讲解了现阶段调试工具可以做的事情和限制，接下来我们就通过学到的知识来了解如何在浏览器中调试 ffmpeg 相关的代码。

#### 带上调试信息的构建

我们只需要修改在之前的文章中提到的构建脚本 `build-with-emcc.sh` ，加入 `-g` 对应的标志：

```
ROOT=$PWD

BUILD_DIR=$ROOT/build





cd ffmpeg-4.3.2-3





ARGS=(

  -g # 在这里添加，告诉编译器需要添加调试

  -I. -I./fftools -I$BUILD_DIR/include

  -Llibavcodec -Llibavdevice -Llibavfilter -Llibavformat -Llibavresample -Llibavutil -Llibpostproc -Llibswscale -Llibswresample -L$BUILD_DIR/lib

  -Qunused-arguments

  -o wasm/dist/ffmpeg-core.js fftools/ffmpeg_opt.c fftools/ffmpeg_filter.c fftools/ffmpeg_hw.c fftools/cmdutils.c fftools/ffmpeg.c

  -lavdevice -lavfilter -lavformat -lavcodec -lswresample -lswscale -lavutil -lpostproc -lm -lx264 -pthread

  -O3                                           # Optimize code with performance first

  -s USE_SDL=2                                  # use SDL2

  -s USE_PTHREADS=1                             # enable pthreads support

  -s PROXY_TO_PTHREAD=1                         # detach main() from browser/UI main thread

  -s INVOKE_RUN=0                               # not to run the main() in the beginning

  -s EXPORTED_FUNCTIONS="[_main, _proxy_main]"  # export main and proxy_main funcs

  -s EXTRA_EXPORTED_RUNTIME_METHODS="[FS, cwrap, setValue, writeAsciiToMemory]"   # export preamble funcs

  -s INITIAL_MEMORY=268435456                    # 268435456 bytes = 268435456 MB

)

emcc "${ARGS[@]}"





cd -
复制代码
```

然后以此执行其他操作，最后通过 `node server.js` 运行我们的脚本，然后打开 [http://localhost:8080/](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost%3A8080%2F "http://localhost:8080/") 查看效果如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3303a1febbb24e0a91c1e01e9f302d67~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

可以看到，我们在 Sources 面板里面可以搜索到构建后的 `ffmpeg.c` 文件，我们可以在 4865 行，在循环操作 `nb_output` 时打一个断点：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01f75ed5fb774bda95f28d410bc8d46f~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

然后在网页中上传一个 `avi` 格式的视频，接着程序会暂停到断点位置：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb313b2f6c2b45ffae9800736b98209a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1573b3025400411fbf9769636a827856~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

可以发现，我们依然可以像之前一样在程序中鼠标移动上去查看变量值，以及在右侧的 Scope 面板里查看变量值，以及可以在控制台中查看变量值。

类似的，我们也可以进行 step over、step in、step out、step 等复杂调试操作，或者 watch 某个变量值，或查看此时的内存等。

可以看到通过这篇文章介绍的知识，你可以在浏览器中对任意大小的 C/C++ 项目进行调试，并且可以使用目前开发者工具提供的绝大部分功能。

## 关于 WebAssembly 的未来

本文仅仅列举了一些 WebAssembly 当前的一些主要应用场景，包含 WebAssembly 的高性能、轻量和跨平台，使得我们可以将 C/C++ 等语言运行在 Web，也可以将桌面端应用跑在 Web 容器。

但是这篇文章没有涉及到的内容有 [WASI](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FWebAssembly%2FWASI "https://github.com/WebAssembly/WASI")，一种将 WebAssembly 跑在任何系统上的标准化系统接口，当 WebAssembly 的性能逐渐增强时，WASI 可以提供一种确实可行的方式，可以在任意平台上运行任意的代码，就像 Docker 所做的一样，但是不需要受限于操作系统。正如 Docker 的创始人所说：

> “ 如果 WASM+WASI 在 2008 年就出现的话，那么就不需要创造 Docker 了，服务器上的 WASM 是计算的未来，是我们期待已久的标准化的系统接口。

另一个有意思的内容是 WASM 的客户端开发框架如 [yew](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fyewstack%2Fyew "https://github.com/yewstack/yew")，未来可能将像 React/Vue/Angular 一样流行。

而 WASM 的包管理工具 [WAPM](https://link.juejin.cn/?target=https%3A%2F%2Fwapm.io%2F "https://wapm.io/")，得益于 WASM 的跨平台特性，可能会变成一种在不同语言的不同框架之间共享包的首选方式。

同时 WebAssembly 也是由 W3C 主要负责开发，各大厂商，包括 Microsoft、Google、Mozilla 等赞助和共同维护的一个项目，相信 WebAssembly 会有一个非常值得期待的未来。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e9873cbf0b645319d324faffdb2c32b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

## Q & A

> 答疑...

-   如何将复杂的 CMake 项目编译到 WebAssembly？
-   在编译复杂的 CMake 项目到 WebAssembly 时如何探索一套通用的最佳实践？
-   如何和 CMake 项目结合起来进行 Debug？

问题：

-   编译之后的代码的体积

## 参考链接

-   [www.ruanyifeng.com/blog/2017/0…](https://link.juejin.cn/?target=https%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2017%2F09%2Fasmjs_emscripten.html "https://www.ruanyifeng.com/blog/2017/09/asmjs_emscripten.html")
-   [pspdfkit.com/blog/2017/w…](https://link.juejin.cn/?target=https%3A%2F%2Fpspdfkit.com%2Fblog%2F2017%2Fwebassembly-a-new-hope%2F "https://pspdfkit.com/blog/2017/webassembly-a-new-hope/")
-   [hacks.mozilla.org/2017/02/wha…](https://link.juejin.cn/?target=https%3A%2F%2Fhacks.mozilla.org%2F2017%2F02%2Fwhat-makes-webassembly-fast%2F "https://hacks.mozilla.org/2017/02/what-makes-webassembly-fast/")
-   [www.sitepoint.com/understandi…](https://link.juejin.cn/?target=https%3A%2F%2Fwww.sitepoint.com%2Funderstanding-asm-js%2F "https://www.sitepoint.com/understanding-asm-js/")
-   [www.cmake.org/download/](https://link.juejin.cn/?target=http%3A%2F%2Fwww.cmake.org%2Fdownload%2F "http://www.cmake.org/download/")
-   [developer.mozilla.org/en-US/docs/…](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWebAssembly%2Fexisting_C_to_wasm "https://developer.mozilla.org/en-US/docs/WebAssembly/existing_C_to_wasm")
-   [research.mozilla.org/webassembly…](https://link.juejin.cn/?target=https%3A%2F%2Fresearch.mozilla.org%2Fwebassembly%2F "https://research.mozilla.org/webassembly/")
-   [itnext.io/build-ffmpe…](https://link.juejin.cn/?target=https%3A%2F%2Fitnext.io%2Fbuild-ffmpeg-webassembly-version-ffmpeg-js-part-2-compile-with-emscripten-4c581e8c9a16%3Fgi%3De525b34f2c21 "https://itnext.io/build-ffmpeg-webassembly-version-ffmpeg-js-part-2-compile-with-emscripten-4c581e8c9a16?gi=e525b34f2c21")
-   [dev.to/alfg/ffmpeg…](https://link.juejin.cn/?target=https%3A%2F%2Fdev.to%2Falfg%2Fffmpeg-webassembly-2cbl "https://dev.to/alfg/ffmpeg-webassembly-2cbl")
-   [gist.github.com/rinthel/f4d…](https://link.juejin.cn/?target=https%3A%2F%2Fgist.github.com%2Frinthel%2Ff4df3023245dd3e5a27218e8b3d79926 "https://gist.github.com/rinthel/f4df3023245dd3e5a27218e8b3d79926")
-   [github.com/Kagami/ffmp…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FKagami%2Fffmpeg.js%2F "https://github.com/Kagami/ffmpeg.js/")
-   [qdmana.com/2021/04/202…](https://link.juejin.cn/?target=https%3A%2F%2Fqdmana.com%2F2021%2F04%2F20210401214625324n.html "https://qdmana.com/2021/04/20210401214625324n.html")
-   [github.com/leandromore…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fleandromoreira%2Fffmpeg-libav-tutorial "https://github.com/leandromoreira/ffmpeg-libav-tutorial")
-   [ffmpeg.org/doxygen/4.1…](https://link.juejin.cn/?target=http%3A%2F%2Fffmpeg.org%2Fdoxygen%2F4.1%2Fexamples.html "http://ffmpeg.org/doxygen/4.1/examples.html")
-   [github.com/alfg/ffmpeg…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Falfg%2Fffmpeg-webassembly-example "https://github.com/alfg/ffmpeg-webassembly-example")
-   [github.com/alfg/ffprob…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Falfg%2Fffprobe-wasm "https://github.com/alfg/ffprobe-wasm")
-   [gist.github.com/rinthel/f4d…](https://link.juejin.cn/?target=https%3A%2F%2Fgist.github.com%2Frinthel%2Ff4df3023245dd3e5a27218e8b3d79926%23file-ffmpeg-emscripten-build-sh "https://gist.github.com/rinthel/f4df3023245dd3e5a27218e8b3d79926#file-ffmpeg-emscripten-build-sh")
-   [emscripten.org/docs/compil…](https://link.juejin.cn/?target=https%3A%2F%2Femscripten.org%2Fdocs%2Fcompiling%2FBuilding-Projects.html%23integrating-with-a-build-system "https://emscripten.org/docs/compiling/Building-Projects.html#integrating-with-a-build-system")
-   [itnext.io/build-ffmpe…](https://link.juejin.cn/?target=https%3A%2F%2Fitnext.io%2Fbuild-ffmpeg-webassembly-version-ffmpeg-js-part-2-compile-with-emscripten-4c581e8c9a16 "https://itnext.io/build-ffmpeg-webassembly-version-ffmpeg-js-part-2-compile-with-emscripten-4c581e8c9a16")
-   [github.com/mymindstorm…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fmymindstorm%2Fsetup-emsdk "https://github.com/mymindstorm/setup-emsdk")
-   [github.com/emscripten-…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Femscripten-core%2Femsdk "https://github.com/emscripten-core/emsdk")
-   [github.com/FFmpeg/FFmp…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FFFmpeg%2FFFmpeg%2Fblob%2Fn4.3.1%2FINSTALL.md "https://github.com/FFmpeg/FFmpeg/blob/n4.3.1/INSTALL.md")
-   [yeasy.gitbook.io/docker\_prac…](https://link.juejin.cn/?target=https%3A%2F%2Fyeasy.gitbook.io%2Fdocker_practice%2Fcontainer%2Frun "https://yeasy.gitbook.io/docker_practice/container/run")
-   [Debugging WebAssembly with modern tools - Chrome Developers](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.chrome.com%2Fblog%2Fwasm-debugging-2020%2F "https://developer.chrome.com/blog/wasm-debugging-2020/")
-   [www.infoq.com/news/2021/0…](https://link.juejin.cn/?target=https%3A%2F%2Fwww.infoq.com%2Fnews%2F2021%2F01%2Fchrome-extension-debug-wasm-c%2F "https://www.infoq.com/news/2021/01/chrome-extension-debug-wasm-c/")
-   [developer.chrome.com/blog/wasm-d…](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.chrome.com%2Fblog%2Fwasm-debugging-2020%2F "https://developer.chrome.com/blog/wasm-debugging-2020/")
-   [lucumr.pocoo.org/2020/11/30/…](https://link.juejin.cn/?target=https%3A%2F%2Flucumr.pocoo.org%2F2020%2F11%2F30%2Fhow-to-wasm-dwarf%2F "https://lucumr.pocoo.org/2020/11/30/how-to-wasm-dwarf/")
-   [v8.dev/docs/wasm-c…](https://link.juejin.cn/?target=https%3A%2F%2Fv8.dev%2Fdocs%2Fwasm-compilation-pipeline "https://v8.dev/docs/wasm-compilation-pipeline")
-   [Debugging WebAssembly with Chrome DevTools | by Charuka Herath | Bits and Pieces (bitsrc.io)](https://link.juejin.cn/?target=https%3A%2F%2Fblog.bitsrc.io%2Fdebugging-webassembly-with-chrome-devtools-99dbad485451 "https://blog.bitsrc.io/debugging-webassembly-with-chrome-devtools-99dbad485451")
-   [Making Web Assembly Even Faster: Debugging Web Assembly Performance with AssemblyScript and a Gameboy Emulator | by Aaron Turner | Medium](https://link.juejin.cn/?target=https%3A%2F%2Fmedium.com%2F%40torch2424%2Fmaking-web-assembly-even-faster-debugging-web-assembly-performance-with-assemblyscript-and-a-4d30cb6463f1 "https://medium.com/@torch2424/making-web-assembly-even-faster-debugging-web-assembly-performance-with-assemblyscript-and-a-4d30cb6463f1")
-   [zhuanlan.zhihu.com/p/68048524](https://link.juejin.cn/?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F68048524 "https://zhuanlan.zhihu.com/p/68048524")
-   [www.ruanyifeng.com/blog/2017/0…](https://link.juejin.cn/?target=https%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2017%2F09%2Fasmjs_emscripten.html "https://www.ruanyifeng.com/blog/2017/09/asmjs_emscripten.html")
-   [www.jianshu.com/p/e4a75cb6f…](https://link.juejin.cn/?target=https%3A%2F%2Fwww.jianshu.com%2Fp%2Fe4a75cb6f268 "https://www.jianshu.com/p/e4a75cb6f268")
-   [www.cloudsavvyit.com/13696/why-w…](https://link.juejin.cn/?target=https%3A%2F%2Fwww.cloudsavvyit.com%2F13696%2Fwhy-webassembly-frameworks-are-the-future-of-the-web%2F "https://www.cloudsavvyit.com/13696/why-webassembly-frameworks-are-the-future-of-the-web/")
-   [mp.weixin.qq.com/s/LSIi2P6FK…](https://link.juejin.cn/?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FLSIi2P6FKnJ0GTodaTUGKw "https://mp.weixin.qq.com/s/LSIi2P6FKnJ0GTodaTUGKw")

## ❤️ 谢谢支持

以上便是本次分享的全部内容，希望对你有所帮助^\_^

喜欢的话别忘了 **分享、点赞、收藏** 三连哦~。

欢迎关注公众号 **ELab团队** 收获大厂一手好文章~

> 我们来自字节跳动，是旗下大力教育前端部门，负责字节跳动教育全线产品前端开发工作。
> 
> 我们围绕产品品质提升、开发效率、创意与前沿技术等方向沉淀与传播专业知识及案例，为业界贡献经验价值。包括但不限于性能监控、组件库、多端技术、Serverless、可视化搭建、音视频、人工智能、产品设计与营销等内容。

字节跳动校/社招内推码: 6466HRE

投递链接: [job.toutiao.com/s/LdnSw2C](https://link.juejin.cn/?target=https%3A%2F%2Fjob.toutiao.com%2Fs%2FLdnSw2C "https://job.toutiao.com/s/LdnSw2C")