## 背景介绍

### 为什么需要性能监控

TL;DR

Node.js作为Javascript在服务端的一个运行时（Runtime），极大的丰富了Javascript的应用场景。

但是Node.js Runtime本身是一个黑盒，我们**无法感知**运行时的状态，对于线上问题也**难以复现**。

因此**性能监控**是Node.js应用程序「正常运行」的基石。不仅可以随时监控运行时的各项指标，还可以帮助排查异常场景问题。

### 组成部分

性能监控可以分为两个部分：

-   性能指标的采集和展示
    
    -   进程级别的数据：CPU，Memory，Heap，GC等
    -   系统级别的数据：磁盘占用率，I/O负载，TCP/UDP连接状态等
    -   应用层的数据：QPS，慢HTTP，业务处理链路日志等
-   性能数据的抓取和分析
    
    -   Heapsnapshot：堆内存快照
    -   Cpuprofile：CPU快照
    -   Coredump：应用崩溃快照

### 方案对比

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fa68a79e2594b0387fc73de549c54d1~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

从上图可以看到目前主流的三种Node.js性能监控方案的优缺点，以下是简单介绍这三种方案的组成：

-   Prometheus
    
    -   [prom-client](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fsiimon%2Fprom-client "https://github.com/siimon/prom-client")是prometheus的nodejs实现，用于采集性能指标
    -   [grafana](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fgrafana%2Fgrafana "https://github.com/grafana/grafana")是一个可视化平台，用来展示各种数据图表，支持prometheus的接入
    -   只支持了性能指标的采集和展示，排查问题还需要其他快照工具，才能组成闭环
-   AliNode
    
    -   alinode是一个兼容官方nodejs的拓展运行时，提供了一些额外功能：
        
        -   v8的运行时内存状态监控
        -   libuv的运行时状态监控
        -   在线故障诊断功能：堆快照、CPU Profile、GC Trace等
    -   [agenthub](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Faliyun-node%2Fagenthub "https://github.com/aliyun-node/agenthub")是一个常驻进程，用来收集性能指标并上报
        
        -   整合了[agentx](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Faliyun-node%2Fagentx "https://github.com/aliyun-node/agentx") + [commdx](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Faliyun-node%2Fcommands "https://github.com/aliyun-node/commands")的便利工具
    -   整体从监控，展示，快照，分析形成闭环，接入便捷简单，但是拓展运行时还是有风险
        
-   [Easy-Monitor](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fhyj1991%2Feasy-monitor "https://github.com/hyj1991/easy-monitor")
    
    -   [xprofiler](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FX-Profiler%2Fxprofiler "https://github.com/X-Profiler/xprofiler") 负责进行实时的运行时状态采样，以及输出性能日志（也就是性能数据的抓取）
    -   [xtransit](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FX-Profiler%2Fxtransit "https://github.com/X-Profiler/xtransit") 负责性能日志的采集与传输
    -   跟AliNode最大的区别在于使用了`Node.js Addon`来实现采样器

## 性能指标

### CPU

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30dc36766101451da0fe2a6869bdc04b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

通过`process.cpuUsage()`可以获取当前进程的CPU耗时数据，返回值的单位是微秒

-   user：进程执行时本身消耗的CPU时间
-   system：进程执行时系统消耗的CPU时间

### Memory

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/406f4e76b6b84bfc88f8247b0d550503~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

通过`process.memoryUsage()`可以获取当前进程的内存分配数据，返回值的单位是字节

-   rss：常驻内存，node进程分配的总内存大小
-   heapTotal：v8申请的堆内存大小
-   heapUsed：v8已使用的堆内存大小
-   external：v8管理的C++所占用的内存大小
-   arrayBuffers：分配给ArrayBuffer的内存大小

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f15f8433a6e4c98bef383720a8bfa6b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

从上图可以看出，`rss`包含代码段(`Code Segment`)、栈内存(`Stack`)、堆内存(`Heap`)

-   Code Segment：存储代码段
-   Stack：存储局部变量和管理函数调用
-   Heap：存储对象、闭包、或者其他一切

### Heap

通过`v8.getHeapStatistics()`和`v8.getHeapSpaceStatistics()`可以获取v8堆内存和堆空间的分析数据，下图展示了v8的堆内存组成分布：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a4b6423dadd4483bd678c309b182ba6~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

堆内存空间先划分为空间（space），空间又划分为页（page），内存按照1MB对齐进行分页。

-   New Space：新生代空间，用来存放一些生命周期比较短的对象数据，平分为两个空间（空间类型为`semi space`）：`from space`，`to space`
    
    -   晋升条件：在New space中经过两次GC依旧存活
-   Old Space：老生代空间，用来存放`New Space`晋升的对象
    
-   Code Space：存放v8 JIT编译后的可执行代码
    
-   Map Space：存放Object指向的隐藏类的指针对象，隐藏类指针是v8根据运行时记录下的对象布局结构，用于快速访问对象成员
    
-   Large Object Space：用于存放大于1MB而无法分配到页的对象
    

### GC

v8的垃圾回收算法分为两类：

-   Major GC：使用了`Mark-Sweep-Compact`算法，用于老生代的对象回收
-   Minor GC：使用了`Scavenge`算法，用于新生代的对象回收

#### Scavenge

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21e8fd2293184324843373a06797ff68~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

前提：`New space`分为`from`和`to`两个对象空间

触发时机：当`New space`空间满了

步骤：

-   在`from space`中，进行宽度优先遍历
    
-   发现存活（可达）对象
    
    -   已经存活过一次（经历过一次Scavange），晋升到`Old space`
    -   其他的复制到`to space`中
-   当复制结束时，`to space`中只有存活的对象，`from space`就被清空了
    
-   交换`from space`和`to space`，开始下一轮`Scavenge`
    

**适用于回收频繁，内存不大的对象，典型的空间换时间的策略，缺点是浪费了多一倍的空间**

#### Mark-Sweep-Compact

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33e9e484aa244f21b48d3718d378768f~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

三个步骤：标记、清除、整理

触发时机：当`Old space`空间满了

步骤：

-   Marking（三色标记法）
    
    -   白色：代表可回收对象
    -   黑色：代表不可回收对象，且其所产生的引用都已经扫描完毕
    -   灰色：代表不可回收对象，且其所产生的引用还没扫描完
    -   将V8根对象直接引用的对象放进一个`marking queue`（显式栈）中，并将这些对象标记为灰色
    -   从这些对象开始做深度优先遍历，每访问一个对象，将该对象从`marking queue` `pop`出来，并标记为黑色
    -   然后将该对象引用下的所有白色对象标记为灰色，`push`到`marking queue`上，如此往复
    -   直到栈上所有对象都pop掉为止，老生代的对象只剩下黑色（不可回收）和白色（可以回收）两种了
    -   PS：当一个对象太大，无法push到空间有限的栈时，v8会把这个对象保留灰色跳过，将整个栈标记为溢出状态（overflowed），等栈清空后，再次进行遍历标记，这样导致需要额外扫描一遍堆
-   Sweep
    
    -   清除白色对象
    -   会造成内存空间不连续
-   Compact
    
    -   由于Sweep会造成内存空间不连续，不利于新对象进入GC
    -   把黑色（存活）对象移到`Old space`的一端，这样清除出来的空间就是连续完整的
    -   虽然可以解决内存碎片问题，但是会增加停顿时间（执行速度慢）
    -   在空间不足以对新生代晋升过来的对象进行分配时才使用mark-compact

#### Stop-The-World

在最开始v8进行垃圾回收时，需要停止程序的运行，扫描完整个堆，回收完内存，才会重新运行程序。这种行为就叫全停顿（`Stop-The-World`）

虽然新生代活动对象较小，回收频繁，全停顿，影响不大，但是老生代存活对象多且大，标记、清理、整理等造成的停顿就会比较严重。

#### 优化策略

-   增量回收（Incremental Marking）：在Marking阶段，当堆达到一定大小时，开始增量GC，每次分配了一定量的内存后，就暂停运行程序，做几毫秒到几十毫秒的marking，然后恢复程序的运行。

这个理念其实有点像React框架中的Fiber架构，只有在浏览器的空闲时间才会去遍历Fiber Tree执行对应的任务，否则延迟执行，尽可能少地影响主线程的任务，避免应用卡顿，提升应用性能。

-   并发清除（Concurrent Sweeping）：让其他线程同时来做 sweeping，而不用担心和执行程序的主线程冲突
-   并行清除（Parallel Sweeping）：让多个 Sweeping 线程同时工作，提升 sweeping 的吞吐量，缩短整个 GC 的周期

#### 空间调整

由于v8对于新老生代的空间默认限制了大小

-   `New space` 默认限制：64位系统为32M，32位系统为16M
-   `Old space` 默认限制：64位系统为1400M，32位系统为700M

因此`node`提供了两个参数用于调整新老生代的空间上限

-   `--max-semi-space-size`：设置`New Space`空间的最大值
-   `--max-old-space-size`：设置`Old Space`空间的最大值

#### 查看GC日志

`node`也提供了三种查看GC日志的方式：

-   `--trace_gc`：一行日志简要描述每次GC时的时间、类型、堆大小变化和产生原因
-   `--trace_gc_verbose`：展示每次GC后每个V8堆空间的详细状况
-   `--trace_gc_nvp`：每次GC的详细键值对信息，包含GC类型，暂停时间，内存变化等

由于GC日志比较原始，还需要二次处理，可以使用AliNode团队开发的[v8-gc-log-parser](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Faliyun-node%2Fv8-gc-log-parser "https://github.com/aliyun-node/v8-gc-log-parser")

## 快照工具

### Heapsnapshot

对于运行程序的**堆内存**进行快照采样，可以用来分析内存的消耗以及变化

#### 生成方式

生成`.heapsnapshot`文件有以下几种方式：

-   使用[heapdump](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fbnoordhuis%2Fnode-heapdump "https://github.com/bnoordhuis/node-heapdump")
    
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c885b8e032a49a5a64a2b57b172d57a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)
    
-   使用v8的[heap-profile](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fv8%2Fsampling-heap-profiler "https://github.com/v8/sampling-heap-profiler")
    
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c733f40a2ddc4982b11e7a68a2dc8638~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)
    
-   使用nodejs内置的v8模块提供的api
    
    -   `v8.getHeapSnapshot()`
        
        ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5b8165035da48939ddf67b430a10b77~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)
        
    -   `v8.writeHeapSnapshot(fileName)`
        
        ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f519c9149544108a056b6e6d48d2ab5~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)
        
-   使用[v8-profiler-next](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fhyj1991%2Fv8-profiler-next "https://github.com/hyj1991/v8-profiler-next")
    
    ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82b29230a1614ec0a938237281cf6b4b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)
    

#### 分析方法

生成的`.heapsnapshot`文件，可以在Chrome devtools工具栏的Memory，选择上传后，展示结果如下图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c69c87b68a940e9a5e2c2f0c0da543b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

默认的视图是`Summary`视图，在这里我们要关注最右边两栏：`Shallow Size` 和 `Retained Size`

-   `Shallow Size`：表示该对象本身在v8堆内存分配的大小
-   `Retained Size`：表示该对象所有引用对象的`Shallow Size`之和

当发现`Retained Size`特别大时，该对象内部可能存在内存泄漏，可以进一步展开去定位问题

还有`Comparison`视图是用于比较分析两个不同时段的堆快照，通过`Delta`列可以筛选出内存变化最大的对象

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87f3ba8ec8b04993b9c0c0f01b91a0c1~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### Cpuprofile

对于运行程序的**CPU**进行快照采样，可以用来分析CPU的耗时及占比

#### 生成方式

生成`.cpuprofile`文件有以下几种方式：

-   [v8-profiler](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fnode-inspector%2Fv8-profiler "https://github.com/node-inspector/v8-profiler")（node官方提供的工具，不过已经无法支持node v10以上的版本，并不再维护）
-   [v8-profiler-next](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fhyj1991%2Fv8-profiler-next "https://github.com/hyj1991/v8-profiler-next")（国人维护版本，支持到最新node v18，持续维护中）

这是采集5分钟的CPU Profile样例

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6977fe83c925491fbbf3b81082bac2d8~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

#### 分析方法

生成的`.cpuprofile`文件，可以在Chrome devtools工具栏的`Javascript Profiler`（不在默认tab，需要在工具栏右侧的更多中打开显示），选择上传文件后，展示结果如下图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a790b49111c494a86c0836608ed8665~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

默认的视图是`Heavy`视图，在这里我们看到有两栏：`Self Time`和`Total Time`

-   `Self Time`：代表此函数本身（不包含其他调用）的执行耗时
-   `Total Time`：代表此函数（包含其他调用函数）的总执行耗时

当发现`Total Time`和`Self Time`偏差较大时，该函数可能存在耗时比较多的CPU密集型计算，也可以展开进一步定位排查

### Codedump

当应用意外崩溃终止时，系统会自动记录下进程crash掉那一刻的内存分配信息，Program Counter以及堆栈指针等关键信息来生成core文件

#### 生成方式

生成`.core`文件的三种方法：

-   `ulimit -c unlimited`打开内核限制
-   `node --abort-on-uncaught-exception`node启动添加此参数，可以在应用出现未捕获的异常时也能生成一份core文件
-   `gcore <pid>`手动生成core文件

#### 分析方法

获取`.core`文件后，可以通过mdb、gdb、lldb等工具实现解析诊断实际进程crash的原因

-   ``llnode `which node` -c /path/to/core/dump``

## 案例分析

### 观察

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/597ac947447b494cb6365cd782d73eab~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

从监控可以观察到堆内存在持续上升，因此需要堆快照进行排查

### 分析

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32d769c3afbb4dc5908d6294c019503f~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

根据`heapsnapshot`可以分析排查到有一个`newThing`的对象一直保持着比较大的内存

### 排查

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc15303672b64ed1a51929ab3a5d65e6~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

从代码中可以看到虽然`unused`方法没有调用，但是`newThing`对象是引用自`theThing`，导致其一直存在于`replaceThing`这个函数的执行上下文中，没有被释放，这就是典型的由于闭包产生的内存泄漏案例

### 小结

常见的内存泄漏有以下几种情况：

-   全局变量
-   闭包
-   定时器
-   事件监听
-   缓存

因此在上述这几种情况时，一定要谨慎考虑对象在内存中是否会被自动回收，不会被自动回收的话，需要手动进行回收，比如手动把对象设置为`null`、移除定时器、解绑事件监听等

## 总结

至此，本文已经对整个Node.js的性能监控体系进行了详细的介绍。

首先，介绍了性能监控解决的问题，组成部分以及主流方案的优缺点对比。

然后，针对两大部分性能指标和快照工具进行了具体的介绍，

-   性能指标主要关注CPU、内存、堆空间、GC几个指标，同时介绍了v8的GC策略和GC优化方案，
-   快照工具主要有堆快照、CPU快照以及崩溃时的Coredump

最后，从观察、分析、排查再现一个简单的内存泄漏案例，并总结了常见内存泄漏的情况和解决方案。

希望这一篇文章能够帮助大家对整个Node.js的性能监控体系有所了解。

## 参考链接

-   [developer.aliyun.com/article/592…](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.aliyun.com%2Farticle%2F592878 "https://developer.aliyun.com/article/592878")
-   [developer.aliyun.com/article/592…](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.aliyun.com%2Farticle%2F592880 "https://developer.aliyun.com/article/592880")
-   [deepu.tech/memory-mana…](https://link.juejin.cn/?target=https%3A%2F%2Fdeepu.tech%2Fmemory-management-in-v8%2F "https://deepu.tech/memory-management-in-v8/")
-   [www.ruanyifeng.com/blog/2017/0…](https://link.juejin.cn/?target=https%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2017%2F04%2Fmemory-leak.html "https://www.ruanyifeng.com/blog/2017/04/memory-leak.html")
-   [github.com/aliyun-node…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Faliyun-node%2FNode.js-Troubleshooting-Guide "https://github.com/aliyun-node/Node.js-Troubleshooting-Guide")
-   [mp.weixin.qq.com/s/dQYS7M9m\_…](https://link.juejin.cn/?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FdQYS7M9m_ylNaUV4no_LaA "https://mp.weixin.qq.com/s/dQYS7M9m_ylNaUV4no_LaA")
