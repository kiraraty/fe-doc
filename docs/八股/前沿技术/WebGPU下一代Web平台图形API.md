   

[![](https://p3-passport.byteimg.com/img/user-avatar/1b99863cd5a91e6784407941bb66409a~100x100.awebp)](https://juejin.cn/user/2559318802827933)

2022年01月19日 11:22 ·  阅读 5287

![WebGPU 下一代Web平台图形API](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fdb052cdcc584ba8af74fa6ecb505e67~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?)  

「这是我参与2022首次更文挑战的第1天，活动详情查看：[2022首次更文挑战](https://juejin.cn/post/7052884569032392740 "https://juejin.cn/post/7052884569032392740")」。

## 什么是WebGPU？

WebGPU是为Web平台设计的全新一代，暴露GPU硬件底层能力的API

## 当前Web平台使用图形API的现状

-   目前WebGPU的相关工作仍在有条不紊的快速推进中
-   目前Web平台中实现图形加速的方法依然是基于WebGL。

## 为什么要开发WebGPU

既然我们现在有了现成的WebGL，为什么我们还需要去开发WebGPU这一套全新的API呢？首先我们要从WebGL的发展开始讲起：

## WebGL

-   WebGL是当下Web平台的实际图形标准。
-   WebGL是一套 low-level的3D图形API
-   WebGL的设计与OpenGL ES的标准非常的接近

但是由于随着计算机科学的发展，人们对性能的追求是无止境的，渐渐的WebGL也开始暴露出一些问题了。

### WebGL太老了

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea2ed9d4235f4a56a86636fd47dc303f~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

我们可以看出，最新的WebGL2.0对应的是OpenGL ES3.0的版本，而OpenGL ES3.0对应的则是桌面OpenGL 3.2的版本（2010），现在已经2022了，我们却还在使用十年前的标准。这导致很多现代GPU的强悍能力无法得到发挥。

而且，OpenGL有着非常重的历史包袱。由于在OpenGL2.0时代之前，那时候GPU几乎没有什么可编程的能力，几乎都是固定渲染管线。所以OpenGL被设计为了一个“大号状态机”的形式。所有的状态都是全局的，每次的drawCall都是用的同一份状态。

在OpenGL2.0之后，虽然出现了可编程的渲染管线，但是全局状态的设计仍然被保留了下来。

### WebGL难以向前发展

-   苹果仅支持OpenGL4.1 和OpenGL ES3.0，并且不支持计算Shader
-   在Metal之上实现WebGL需要花费大量的工作（这也是为什么现在Safari 15才刚刚支持WebGL2的原因）

渐渐地各大厂商开始抛弃OpenGL，GPU最新的特性在OpenGL上不再被支持。

## WebGPU的优势

WebGPU的设计更容易被D3D12（D3D12 \[Direct3D 12\]是Microsoft开发的图形API）、Metal(Apple)、Vulkan(Khronos Group开发的跨平台的图形API)所实现，并且还具有以下优点：

### 减少CPU的开销

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3621f84cdb214f6b9b165f8db8166975~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

根据上图我们可以看到，如果WebGL是直接调用的OpenGL/OpenGL ES的API的话，那么实现WebGL的成本是相对较低的，但是由于OpenGL的设计问题，OpenGL的驱动要求进行一系列的错误检测，我们希望错误检查仅仅在开发阶段进行就可以了，在实际运行时，这些错误检查都是不必要的。所以这里会导致CPU的开销增大。而WebGPU并不需要驱动去做这些错误检查。

另外，如果WebGL是构建在非OpenGL的平台上，比如D3D12，那么还需要额外的实现另一套程序来适配，更加导致CPU的开销增加。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb04c2d2f54544bcb708082026ac6c49~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

针对于WebGL对于全局状态的设定有所不同的是，WebGPU采用了`PipelineStateObject`这样的一个对象来设置渲染管线中的相关信息。这样在运行时，就很容易的切换渲染管线之间不同的状态。

### 多线程的支持

WebGPU另一个强大的能力在于能够支持多线程。WebGL由于全局状态的设定，一旦状态设定了后就立即执行，这导致WebGL不能支持多线程。而WebGPU能够支持多线程的秘密在于：WebGPU的执行被分为了“录制命令”和“提交命令”两个阶段。

-   录制命令是纯CPU的过程，它可以在多线程中分别的进行录制，然后将其提交到一个“队列中”
-   提交命令就是根据之前录制好的命令，按照录制的顺序，GPU真正的依次执行相关命令。

Web Worker是支持上述的特性的。

## WebGPU的发展现状

WebGPU仍在开发的状态当中，在Chrome Canary版本中WebGPU可以通过打开Flags的方式进行尝鲜。

但是WebGPU的API仍然不稳定并且一直在发展中。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3eff27aec2c43c6b02ae801c7c8e84c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

## WebGPU的发展

## 浏览器的支持情况

1.  开源项目 `gfx-rs` 计算被用于Firefox中作为WebGPU的实现。
2.  Apple 也正在实现WebGPU的工作中
3.  Microsoft Edge基于Chromium，但是还未支持WebGPU

## 3D 开发框架支持情况

1.  Babylon.js 计算在5.0版本支持WebGPU
2.  Three.js 已经开始实现WebGPU的后端渲染器

## 总结

好了，今天关于WebGPU的相关介绍就这么多，如果你觉得本文有用，别忘了点赞。您的点赞就是对作者最好的鼓励！

## 参考文章

[WebGPU，下一代 Web 图形技术 - YouTube](https://link.juejin.cn/?target=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dy2dZYG5YTRU "https://www.youtube.com/watch?v=y2dZYG5YTRU")

![](https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/00ba359ecd0075e59ffbc3d810af551d.svg) 43

![](https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/3d482c7a948bac826e155953b2a28a9e.svg) 收藏