## 前言

最近在学习node监控的知识，虽然没有精力去学习写一个简易版监控，但还是忍不住了解一下如何获取这些指标（查阅了很多资料，觉得国内网上对于这块内容介绍是在太少了，自己也在整理服务端node知识点，就汇总为此文章，与君共享）。

本文有些指标可能存在问题，欢迎交流，其实这些数据你都可以整理一下写成一个监控的库，用在自己的中小项目上了。然后前端react有bizcharts，g2这些工具，前端自己绘制数据大屏。我看esay monitor 收集的数据维度还没有我们这个全呢。

服务器的性能瓶颈通常为以下几个：

-   CPU 使用率
-   CPU 负载(load)
-   内存
-   磁盘
-   I/O
-   吞吐量 （Throughput）
-   每秒查询率 QPS（Query Per Second）
-   日志监控/真实QPS
-   响应时间
-   进程监控

## 获取 CPU 指标

CPU 使用率与CPU 负载，这两个从一定程度上都可以反映一台机器的繁忙程度。

## CPU 使用率

CPU 使用率是运行的程序占用的 CPU 资源，表示机器在某个时间点的运行程序的情况。使用率越高，说明机器在这个时间上运行了很多程序，反之较少。使用率的高低与 CPU 强弱有直接关系。我们先了解一下相关的API和一些名词解释，帮助我们理解获取CPU使用率的代码。

### `os.cpus()`

返回包含有关每个逻辑 CPU 内核的信息的对象数组。

-   **model:** 一个字符串，指定CPU内核的型号。
    
-   **speed:** 一个数字，指定CPU内核的速度(以MHz为单位)。
    
-   **times:** 包含以下属性的对象：
    
    -   user CPU 在用户模式下花费的毫秒数。
    -   nice CPU 在良好模式下花费的毫秒数。
    -   sys CPU 在系统模式下花费的毫秒数。
    -   idle CPU 在空闲模式下花费的毫秒数。
    -   irq CPU 在中断请求模式下花费的毫秒数。

**注意：** 的`nice`值仅用于POSIX。在Windows操作系统上，`nice`所有处理器的值始终为0。

大家看到user，nice字段，有些同学就优点懵逼了，我也是，所以仔细查询了一下其意义，请接着。

### user

user 表示 CPU 运行在 **用户态** 的时间占比。

应用进程执行分为 **用户态** 以及 **内核态** ： CPU 在用户态执行应用进程自身的代码逻辑，通常是一些 **逻辑** 或 **数值计算** ； CPU 在内核态执行进程发起的 [系统调用](https://link.juejin.cn/?target=https%3A%2F%2Flinux.fasionchan.com%2Fzh_CN%2Flatest%2Fsystem-programming%2Fsyscall%2Findex.html "https://linux.fasionchan.com/zh_CN/latest/system-programming/syscall/index.html") ，通常是响应进程对资源的请求。

用户空间程序是任何不属于内核的进程。 Shell、编译器、数据库、Web 服务器以及与桌面相关的程序都是用户空间进程。 如果处理器没有空闲，那么大部分 CPU 时间应该花在运行用户空间进程上是很正常的。

### nice

nice 表示 CPU 运行在 **低优先级用户态** 的时间占比，低优先级意味着进程 nice 值小于 0 。

### system

user 表示 CPU 运行在 **内核态** 的时间占比。

一般而言， **内核态** CPU 使用率不应过高，除非应用进程发起大量系统调用。如果太高，表示系统调用时间长，例如是IO操作频繁。

### idle

idle 表示 CPU 在空闲状态的时间占比，该状态下 CPU 没有任何任务可执行。

### irq

irq 表示 CPU 处理 **硬件中断** 的时间占比。

**网卡中断** 是一个典型的例子：网卡接到数据包后，通过硬件中断通知 CPU 进行处理。 如果系统网络流量非常大，则可观察到 irq 使用率明显升高。

### 结论：

用户态小于70%，内核态小于35%且整体小于70%，可以算作健康状态。

以下示例说明了Node.js中os.cpus()方法的使用：

**范例1：**

```
// Node.js program to demonstrate the    
// os.cpus() method 
  
// Allocating os module 
const os = require('os'); 
  
// Printing os.cpus() values 
console.log(os.cpus());
复制代码
```

**输出：**

```
[ { model:'Intel(R) Core(TM) i5-7200U CPU @ 2.50GHz',
    speed:2712,
    times:
     { user:900000, nice:0, sys:940265, idle:11928546, irq:147046 } },
  { model:'Intel(R) Core(TM) i5-7200U CPU @ 2.50GHz',
    speed:2712,
    times:
     { user:860875, nice:0, sys:507093, idle:12400500, irq:27062 } },
  { model:'Intel(R) Core(TM) i5-7200U CPU @ 2.50GHz',
    speed:2712,
    times:
     { user:1273421, nice:0, sys:618765, idle:11876281, irq:13125 } },
  { model:'Intel(R) Core(TM) i5-7200U CPU @ 2.50GHz',
    speed:2712,
    times:
     { user:943921, nice:0, sys:460109, idle:12364453, irq:12437 } } ]
复制代码
```

下面是如何获取cpu利用率的代码

```
const os = require('os');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class OSUtils {
  constructor() {
    this.cpuUsageMSDefault = 1000; // CPU 利用率默认时间段
  }

  /**
   * 获取某时间段 CPU 利用率
   * @param { Number } Options.ms [时间段，默认是 1000ms，即 1 秒钟]
   * @param { Boolean } Options.percentage [true（以百分比结果返回）|false] 
   * @returns { Promise }
   */
  async getCPUUsage(options={}) {
    const that = this;
    let { cpuUsageMS, percentage } = options;
    cpuUsageMS = cpuUsageMS || that.cpuUsageMSDefault;
    const t1 = that._getCPUInfo(); // t1 时间点 CPU 信息

    await sleep(cpuUsageMS);

    const t2 = that._getCPUInfo(); // t2 时间点 CPU 信息
    const idle = t2.idle - t1.idle;
    const total = t2.total - t1.total;
    let usage = 1 - idle / total;

    if (percentage) usage = (usage * 100.0).toFixed(2) + "%";

    return usage;
  }

  /**
   * 获取 CPU 瞬时时间信息
   * @returns { Object } CPU 信息
   * user <number> CPU 在用户模式下花费的毫秒数。
   * nice <number> CPU 在良好模式下花费的毫秒数。
   * sys <number> CPU 在系统模式下花费的毫秒数。
   * idle <number> CPU 在空闲模式下花费的毫秒数。
   * irq <number> CPU 在中断请求模式下花费的毫秒数。
   */
  _getCPUInfo() {
    const cpus = os.cpus();
    let user = 0, nice = 0, sys = 0, idle = 0, irq = 0, total = 0;

    for (let cpu in cpus) {
      const times = cpus[cpu].times;
      user += times.user;
      nice += times.nice;
      sys += times.sys;
      idle += times.idle;
      irq += times.irq;
    }

    total += user + nice + sys + idle + irq;

    return {
      user,
      sys,
      idle,
      total,
    }
  }
}

const cpuUsage = new OSUtils().getCPUUsage({ percentage: true });
console.log('cpuUsage: ', cpuUsage.then(data=>console.log(data)));  // 我的电脑是6.15%
复制代码
```

## CPU 负载

CPU的负载（loadavg）很好理解，指某段时间内占用 CPU 时间的进程和等待 CPU 时间的进程数为平均负载（load average），这里等待CPU 时间的进程是指等待被唤醒的进程，不包括处于wait状态进程。

在此之前我们需要学习一个node的API

### `os.loadavg()`

返回包含 1、5 和 15 分钟平均负载的数组。

平均负载是操作系统计算的系统活动量度，并表示为小数。

平均负载是 Unix 特有的概念。 在 Windows 上，返回值始终为 `[0, 0, 0]`

它用来描述操作系统当前的繁忙程度，可以简单地理解为CPU在单位时间内正在使用和等待使用CPU的平均任务数。CPU load过高，说明进程数量过多，在Node中可能体现在用紫禁城模块反复启动新的进程。

```
const os = require('os');
// CPU线程数
const length = os.cpus().length;
// 单核CPU的平均负载，返回一个包含 1、5、15 分钟平均负载的数组
os.loadavg().map(load => load / length);
复制代码
```

## 内存指标

我们先解释一个API，要么你看不懂我们获取内存指标的代码

### process.memoryUsage()：

该函数返回4个参数，含义及差别如下：

-   rss: (Resident Set Size)操作系统分配给进程的总的内存大小。包括所有 C++ 和 JavaScript 对象和代码。（比如，堆栈和代码段）
-   heapTotal：堆的总大小，包括3个部分，
    -   已分配的内存，用于对象的创建和存储，对应于heapUsed
    -   未分配的但可用于分配的内存
    -   未分配的但不能分配的内存，例如在垃圾收集（GC）之前对象之间的内存碎片
-   heapUsed: 已分配的内存，即堆中所有对象的总大小，是heapTotal的子集。
-   external: 进程使用到的系统链接库所占用的内存， 比如buffer就是属于external里的数据。buffer数据不同于其他对象，它不经过V8的内存分配机制，所以也不会有堆内存大小限制。 用如下代码，打印一个子进程的内存使用情况，可以看出rss大致等于top命令的RES。另外，主进程的内存只有33M比子进程的内存还小，可见它们的内存占用情况是独立统计的。

```
var showMem = function(){
   var mem = process.memoryUsage();
   var format = function(bytes){
       return (bytes / 1024 / 1024).toFixed(2) + ' MB';
   };
   console.log('Process: heapTotal ' + format(mem.heapTotal) + ' heapUsed ' + format(mem.heapUsed) + ' rss ' + format(mem.rss) + ' external:' + format(mem.external));
   console.log('-----------------------------------------------------------');
};
复制代码
```

对于Node而言，一旦出现内存泄漏，不是那么容易排查。如果监控到内存只升不降，那么铁定存在内存泄露问题。健康的内存使用应该有升有降。访问大的时候上升，访问回落下降

### 获取内存指标的代码

```
const os = require('os');
// 查看当前 Node 进程内存使用情况
const { rss, heapUsed, heapTotal } = process.memoryUsage();
// 获取系统空闲内存
const systemFree = os.freemem();
// 获取系统总内存
const systemTotal = os.totalmem();

module.exports = {
  memory: () => {
    return {
      system: 1 - systemFree / systemTotal,  // 系统内存占用率
      heap: heapUsed / headTotal,   // 当前 Node 进程内存占用率
      node: rss / systemTotal,         // 当前 Node 进程内存占用系统内存的比例
    }
  }
}
复制代码
```

## 磁盘空间指标

磁盘监控主要是监控磁盘的用量。由于日志频繁写的缘故，磁盘空间被渐渐用光。一旦磁盘不够用，将会引发系统的各种问题。给磁盘的使用量设置一个上限，一旦磁盘用量超过警戒值，服务器的管理者就应该整理日志或者清理磁盘。

以下代码参考easy monitor3.0

-   先用df -P获得所有磁盘情况，这个-P是为了防止有换行
-   startsWith('/')保证是真实磁盘，不是虚拟的
-   line.match(/(\\d+)%\\s+(/.\*$)/) => 匹配磁盘情况和挂载的磁盘，比如'1% /System/Volumes/Preboot'
-   match\[1\]是字符串，表示使用率， match\[2\]表示挂载的磁盘名称

```
const { execSync } = require('child_process');
const result = execSync('df -P', { encoding: 'utf8'})
const lines = result.split('\n');
const metric = {};
lines.forEach(line => {
  if (line.startsWith('/')) {
    const match = line.match(/(\d+)%\s+(\/.*$)/);
    if (match) {
      const rate = parseInt(match[1] || 0);
      const mounted = match[2];
      if (!mounted.startsWith('/Volumes/') && !mounted.startsWith('/private/')) {
        metric[mounted] = rate;
      }
    }
  }
});
console.log(metric)
复制代码
```

## I/O指标

I/O负载指的主要是磁盘I/O。反应的是磁盘上的读写情况，对于Node编写的应用，主要是面向网络服务，是不太可能出现I/O负载过高的情况，多读书的I/O的压力来源于数据库。

获取I/O指标，我们要了解一个linux命令，叫iostat，如果没有安装，需要安装一下，我们看一下这个命令为啥能反应I/O指标

```
iostat -dx
复制代码
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3931ba19a5a1428589978c287acaf2ff~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

属性说明

```
rrqm/s: 每秒进行 merge 的读操作数目。即 rmerge/s（每秒对该设备的读请求被合并次数，文件系统会对读取同块(block)的请求进行合并）
wrqm/s: 每秒进行 merge 的写操作数目。即 wmerge/s（每秒对该设备的写请求被合并次数）
r/s: 每秒完成的读 I/O 设备次数。即 rio/s
w/s: 每秒完成的写 I/O 设备次数。即 wio/s
rsec/s: 每秒读扇区数。即 rsect/s
wsec/s: 每秒写扇区数。即 wsect/s
rkB/s: 每秒读K字节数。是 rsect/s 的一半，因为每扇区大小为512字节。
wkB/s: 每秒写K字节数。是 wsect/s 的一半。
avgrq-sz: 平均每次设备I/O操作的数据大小 (扇区)。
avgqu-sz: 平均I/O队列长度。
await: 平均每次设备I/O操作的等待时间 (毫秒)。
svctm: 平均每次设备I/O操作的处理时间 (毫秒)。
%util: 一秒中有百分之多少的时间用于 I/O 操作，即被io消耗的cpu百分比
复制代码
```

我们只监控%util就行

1.  如果 **%util 接近 100%** ，说明产生的I/O请求太多，**I/O系统已经满负荷**，该磁盘可能存在瓶颈。
2.  如果 await 远大于 svctm，说明 I/O 队列太长，应用得到的响应时间变慢，如果响应时间超过了用户可以容许的范围，这时可以考虑更换更快的磁盘，调整内核 elevator 算法，优化应用，或者升级 CPU。

## 响应时间RT监控

监控Nodejs的页面响应时间, 方案选自廖雪峰老师的博客文章。

最近想监控一下Nodejs的性能。记录分析Log太麻烦，最简单的方式是记录每个HTTP请求的处理时间，直接在HTTP Response Header中返回。

记录HTTP请求的时间很简单，就是收到请求记一个时间戳，响应请求的时候再记一个时间戳，两个时间戳之差就是处理时间。

但是，res.send()代码遍布各个js文件，总不能把每个URL处理函数都改一遍吧。

正确的思路是用middleware实现。但是Nodejs没有任何拦截res.send()的方法，怎么破？

其实只要稍微转换一下思路，放弃传统的OOP方式，以函数对象看待res.send()，我们就可以先保存原始的处理函数res.send，再用自己的处理函数替换res.send：

```
app.use(function (req, res, next) {
    // 记录start time:
    var exec_start_at = Date.now();
    // 保存原始处理函数:
    var _send = res.send;
    // 绑定我们自己的处理函数:
    res.send = function () {
        // 发送Header:
        res.set('X-Execution-Time', String(Date.now() - exec_start_at));
        // 调用原始处理函数:
        return _send.apply(res, arguments);
    };
    next();
});
复制代码
```

只用了几行代码，就把时间戳搞定了。

对于res.render()方法不需要处理，因为res.render()内部调用了res.send()。

调用apply()函数时，传入res对象很重要，否则原始的处理函数的this指向undefined直接导致出错。

实测首页响应时间9毫秒

## 监控吞吐量/每秒查询率 QPS

名词解释：

### 一、QPS，每秒查询

QPS：Queries Per Second意思是“每秒查询率”，是一台服务器每秒能够响应的查询次数，是对一个特定的查询服务器在规定时间内所处理流量多少的衡量标准。

互联网中，作为域名系统服务器的机器的性能经常用每秒查询率来衡量。

### 二、TPS，每秒事务

TPS：是TransactionsPerSecond的缩写，也就是事务数/秒。它是软件测试结果的测量单位。一个事务是指一个客户机向服务器发送请求然后服务器做出反应的过程。客户机在发送请求时开始计时，收到服务器响应后结束计时，以此来计算使用的时间和完成的事务个数。

QPS vs TPS：QPS基本类似于TPS，但是不同的是，对于一个页面的一次访问，形成一个TPS；但一次页面请求，可能产生多次对服务器的请求，服务器对这些请求，就可计入“QPS”之中。如，访问一个页面会请求服务器2次，一次访问，产生一个“T”，产生2个“Q”。

### 三、RT，响应时间

响应时间：执行一个请求从开始到最后收到响应数据所花费的总体时间,即从客户端发起请求到收到服务器响应结果的时间。

响应时间RT(Response-time)，是一个系统最重要的指标之一，它的数值大小直接反应了系统的快慢。

### 四、并发数

并发数是指系统同时能处理的请求数量，这个也是反应了系统的负载能力。

### 五、吞吐量

系统的吞吐量（承压能力）与request对CPU的消耗、外部接口、IO等等紧密关联。单个request 对CPU消耗越高，外部系统接口、IO速度越慢，系统吞吐能力越低，反之越高。

系统吞吐量几个重要参数：QPS（TPS）、并发数、响应时间。

1.  QPS（TPS）：（Query Per Second）每秒钟request/事务 数量
2.  并发数： 系统同时处理的request/事务数
3.  响应时间： 一般取平均响应时间

理解了上面三个要素的意义之后，就能推算出它们之间的关系：

-   **QPS（TPS）= 并发数/平均响应时间**
-   **并发数 = QPS\*平均响应时间**

### 六、实际举例

我们通过一个实例来把上面几个概念串起来理解。按二八定律来看，如果每天 80% 的访问集中在 20% 的时间里，这 20% 时间就叫做峰值时间。

-   公式：( 总PV数 \* 80% ) / ( 每天秒数 \* 20% ) = 峰值时间每秒请求数(QPS)
-   机器：峰值时间每秒QPS / 单台机器的QPS = 需要的机器

**1、每天300w PV 的在单台机器上，这台机器需要多少QPS？**   
( 3000000 \* 0.8 ) / (86400 \* 0.2 ) = 139 (QPS)

**2、如果一台机器的QPS是58，需要几台机器来支持？**   
139 / 58 = 3

到这里，以后如果你做一般中小项目的前端架构，在部署自己的node服务，就知道需要多少机器组成集群来汇报ppt了吧，哈哈，有pv就能推算一个初略值。

我们需要了解一下压力测试（我们要靠压测获取qps），以ab命令为例：

命令格式：

```
ab [options] [http://]hostname[:port]/path
复制代码
```

常用参数如下：

```
-n requests 总请求数
-c concurrency 并发数
-t timelimit 测试所进行的最大秒数, 可以当做请求的超时时间
-p postfile 包含了需要POST的数据的文件
-T content-type POST数据所使用的Content-type头信息
复制代码
```

更多参数请查看[官方文档](https://link.juejin.cn/?target=http%3A%2F%2Fhttpd.apache.org%2Fdocs%2F2.2%2Fprograms%2Fab.html "http://httpd.apache.org/docs/2.2/programs/ab.html")。

例如测试某个GET请求接口：

```
ab -n 10000 -c 100 -t 10 "http://127.0.0.1:8080/api/v1/posts?size=10"
复制代码
```

得到一下数据：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae52dd93e7fc4f4a9874a484a6796502~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

我们从中获取几个关键指标：

-   吞吐率（Requests per second）在图上有显示 服务器并发处理能力的量化描述，单位是reqs/s，指的是在某个并发用户数下单位时间内处理的请求数。某个并发用户数下单位时间内能处理的最大请求数，称之为最大吞吐率。

记住：吞吐率是基于并发用户数的。这句话代表了两个含义：

-   a、吞吐率和并发用户数相关
-   b、不同的并发用户数下，吞吐率一般是不同的

计算公式：

```
总请求数/处理完成这些请求数所花费的时间
复制代码
```

必须要说明的是，这个数值表示当前机器的整体性能，值越大越好。

2、QPS每秒查询率(Query Per Second)

　　每秒查询率QPS是对一个特定的查询服务器在规定时间内所处理流量多少的衡量标准，在因特网上，作为域名系统服务器的机器的性能经常用每秒查询率来衡量，即每秒的响应请求数，也即是最大吞吐能力。

计算公式

```
QPS（TPS）= 并发数/平均响应时间（Time per request）
复制代码
```

在上图里有Time per request的值，然后我们也有并发数数据，就可以计算出QPS。

这个QPS是压测数据，真实的qps，可使用日志监控来获取。

## 日志监控

通常情况下，随着系统的运行，我们的后台服务会产生各种日志，应用程序会产生应用程序的访问日志、错误日志，运行日志，网络日志，我们需要一个展示平台去展示这些日志。

后端一般都用比如ELk去展示，我们前端都是ui老手了，自己可以画定制的UI界面，不多说了，主要是日志本身要打印符合一定的规范，这样格式化的数据更利于分析和展示。

并且业务逻辑型的监控主要体现在日志上。通过监控异常日志文件的变动，将新增的异常按异常类型和数量反映出来。某些异常与具体的某个子系统相关，监控出现的某个异常也能反映出子系统的状态。

在体制监控里也能体现出实际业务的QPS值。观察QPS的表现能够检查业务在时间上的分部。

此外，从访问日志中也能实现PV和UV的监控。并且可以从中分析出使用者的习惯，预知访问高峰。

## 响应时间

这个也可以通过访问日志来获取，并且真实响应时间是需要在controller上打log的。

## 进程监控

监控进程一般是检查操作系统中运行的应用进程数，比如对于采用多进程架构的node应用，就需要检查工作进程的数量，如果低于预期值，就当发出报警。

查看进程数在linux下很简单，

假如我们通过Node 提供 child\_process 模块来实现多核 CPU 的利用。child\_process.fork() 函数来实现进程的复制。

worker.js 代码如下：

```
var http = require('http')\
http.createServer(function(req, res) {\
res.writeHead(200, { 'Content-Type': 'text/plain' })\
res.end('Hello World\n')\
}).listen(Math.round((1 + Math.random()) * 1000), '127.0.0.1')\
复制代码
```

通过 `node worker.js` 启动它，会监听 1000 到 2000 之间的一个随机端口。

master.js 代码如下：

```
var fork = require('child_process').fork
var cpus = require('os').cpus()
for (var i = 0; i < cpus.length; i++) {
  fork('./worker.js')
}
复制代码
```

查看进程数的 命令如下：

```
ps aux | grep worker.js
复制代码
```

```
$ ps aux | grep worker.js
lizhen 1475 0.0 0.0 2432768 600 s003 S+ 3:27AM 0:00.00 grep worker.js\
lizhen 1440 0.0 0.2 3022452 12680 s003 S 3:25AM 0:00.14 /usr/local/bin/node ./worker.js\
lizhen 1439 0.0 0.2 3023476 12716 s003 S 3:25AM 0:00.14 /usr/local/bin/node ./worker.js\
lizhen 1438 0.0 0.2 3022452 12704 s003 S 3:25AM 0:00.14 /usr/local/bin/node ./worker.js\
lizhen 1437 0.0 0.2 3031668 12696 s003 S 3:25AM 0:00.15 /usr/local/bin/node ./worker.js\
复制代码
```

参考文章

-   [Node服务性能监控](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fpfan123%2FArticles%2Fissues%2F102 "https://github.com/pfan123/Articles/issues/102")
-   《深入浅出的Nodejs》