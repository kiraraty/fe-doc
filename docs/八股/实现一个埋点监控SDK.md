大家好，我是年年！

这是小伙伴上周被问到的一个综合性设计题，如果是没有用过埋点监控系统，或者没有深入了解，基本就凉凉。

这篇文章会讲清楚：

1.  埋点监控系统负责处理哪些问题，需要怎么设计api？
2.  为什么用img的src做请求的发送，sendBeacon又是什么？
3.  在react、vue的错误边界中要怎么处理？

## 什么是埋点监控SDK

举个例子，公司开发上线了一个网站，但开发人员不可能预测，用户实际使用时会发生什么：用户浏览过哪几个页面？几成用户会点击某个弹窗的确认按钮，几成会点击取消？有没有出现页面崩溃？

所以我们需要一个埋点监控SDK去做数据的收集，后续再统计分析。有了分析数据，才能有针对性对网站进行优化：PV特别少的页面就不要浪费大量人力；有bug的页面赶紧修复，不然要325了。

比较有名的埋点监控有Google Analytics，除了web端，还有iOS、安卓的SDK。

> 公众号后台回复「ReactSDK」可获取react版本的github

## 埋点监控的职能范围

因为业务需要的不同，大部分公司都会自己开发一套埋点监控系统，但基本上都会涵盖这三类功能：

## 用户行为监控

负责统计PV（页面访问次数）、UV（页面访问人数）以及用户的点击操作等行为。

这类统计是用的最多的，有了这些数据才能量化我们的工作成果。

## 页面性能监控

开发和测试人员固然在上线之前会对这些数据做评估，但用户的环境和我们不一样，也许是3G网，也许是很老的机型，我们需要知道在实际使用场景中的性能数据，比如页面加载时间、白屏时间等。

## 错误报警监控

获取错误数据，及时处理才能避免大量用户受到影响。除了全局捕获到的错误信息，还有在代码内部被catch住的错误告警，这些都需要被收集到。

下面会从api的设计出发，对上述三种类型进一步展开。

## SDK的设计

在开始设计之前，先看一下SDK怎么使用

```
import StatisticSDK from 'StatisticSDK';
// 全局初始化一次
window.insSDK = new StatisticSDK('uuid-12345');


<button onClick={()=>{
  window.insSDK.event('click','confirm');
  ...// 其他业务代码
}}>确认</button>
复制代码
```

首先把SDK实例挂载到全局，之后在业务代码中调用，这里的新建实例时需要传入一个id，因为这个埋点监控系统往往是给多个业务去使用的，通过id去区分不同的数据来源。

首先实现实例化部分：

```
class StatisticSDK {
  constructor(productID){
    this.productID = productID;
  }
}
复制代码
```

## 数据发送

数据发送是一个最基础的api，后面的功能都要基于此进行。通常这种前后端分离的场景会使用AJAX的方式发送数据，但是这里使用图片的src属性。原因有两点：

1.  没有跨域的限制，像srcipt标签、img标签都可以直接发送跨域的GET请求，不用做特殊处理；
2.  兼容性好，一些静态页面可能禁用了脚本，这时script标签就不能使用了；

但要注意，这个图片不是用来展示的，我们的目的是去「传递数据」，只是借助img标签的的src属性，在其url后面拼接上参数，服务端收到再去解析。

```
class StatisticSDK {
  constructor(productID){
    this.productID = productID;
  }
  send(baseURL,query={}){
    query.productID = this.productID;
    let queryStr = Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&')
    let img = new Image();
    img.src = `${baseURL}?${queryStr}`
  }
}
复制代码
```

img标签的优点是不需要将其append到文档，只需设置src属性便能成功发起请求。

通常请求的这个url会是一张1X1px的GIF图片，网上的文章对于这里为什么返回图片的是一张GIF都是含糊带过，这里查阅了一些资料并测试了：

1.  同样大小，不同格式的的图片中GIF大小是最小的，所以选择返回一张GIF，这样对性能的损耗更小；
2.  如果返回204，会走到img的onerror事件，并抛出一个全局错误；如果返回200和一个空对象会有一个CORB的告警；

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e50e255a2bf34f46a259d26f78ca50a6~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

> 当然如果不在意这个报错可以采取返回空对象，事实上也有一些工具是这样做的

3.  有一些埋点需要真实的加到页面上，比如垃圾邮件的发送者会添加这样一个隐藏标志来验证邮件是否被打开，如果返回204或者是200空对象会导致一个明显图片占位符

```
<img src="http://www.example.com/logger?event_id=1234">
复制代码
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b05d3be1ce842618aa4972bbc86ee31~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### 更优雅的web beacon

这种打点标记的方式被称web beacon（网络信标）。除了gif图片，从2014年开始，浏览器逐渐实现专门的API，来更优雅的完成这件事：Navigator.sendBeacon

使用很简单

```
Navigator.sendBeacon(url,data)
复制代码
```

相较于图片的src，这种方式的更有优势：

1.  不会和主要业务代码抢占资源，而是在浏览器空闲时去做发送；
2.  并且在页面卸载时也能保证请求成功发送，不阻塞页面刷新和跳转；

现在的埋点监控工具通常会优先使用sendBeacon，但由于浏览器兼容性，还是需要用图片的src兜底。

## 用户行为监控

上面实现了数据发送的api，现在可以基于它去实现用户行为监控的api。

```
class StatisticSDK {
  constructor(productID){
    this.productID = productID;
  }
  // 数据发送
  send(baseURL,query={}){
    query.productID = this.productID;
      let queryStr = Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&')
      let img = new Image();
      img.src = `${baseURL}?${queryStr}`
  }
  // 自定义事件
  event(key, val={}) {
    let eventURL = 'http://demo/'
    this.send(eventURL,{event:key,...val})
  }
  // pv曝光
  pv() {
    this.event('pv')
  }
}
复制代码
```

用户行为包括自定义事件和pv曝光，也可以把pv曝光看作是一种特殊的自定义行为事件。

## 页面性能监控

页面的性能数据可以通过performance.timing这个API获取到，获取的数据是单位为毫秒的时间戳。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eabe9749d5b84f2b8ef932cff2076a08~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp) 上面的不需要全部了解，但比较关键的数据有下面几个，根据它们可以计算出FP/DCL/Load等关键事件的时间点：

1.  页面首次渲染时间：`FP(firstPaint)=domLoading-navigationStart`
2.  DOM加载完成：`DCL(DOMContentEventLoad)=domContentLoadedEventEnd-navigationStart`
3.  图片、样式等外链资源加载完成：`L(Load)=loadEventEnd-navigationStart`

上面的数值可以跟performance面板里的结果对应。

回到SDK，我们只用实现一个上传所有性能数据的api就可以了：

```
class StatisticSDK {
  constructor(productID){
    this.productID = productID;
    // 初始化自动调用性能上报
    this.initPerformance()
  }
  // 数据发送
  send(baseURL,query={}){
    query.productID = this.productID;
      let queryStr = Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&')
      let img = new Image();
      img.src = `${baseURL}?${queryStr}`
  }
  // 性能上报
  initPerformance(){
    let performanceURL = 'http://performance/'
    this.send(performanceURL,performance.timing)
  }
}
复制代码
```

并且，在构造函数里自动调用，因为性能数据是必须要上传的，就不需要用户每次都手动调用了。

## 错误告警监控

错误报警监控分为JS原生错误和React/Vue的组件错误的处理。

### JS原生错误

除了try catch中捕获住的错误，我们还需要上报没有被捕获住的错误——通过error事件和unhandledrejection事件去监听。

#### error

error事件是用来监听DOM操作错误`DOMException`和JS错误告警的，具体来说，JS错误分为下面8类：

1.  InternalError: 内部错误，比如如递归爆栈;
2.  RangeError: 范围错误，比如new Array(-1);
3.  EvalError: 使用eval()时错误;
4.  ReferenceError: 引用错误，比如使用未定义变量;
5.  SyntaxError: 语法错误，比如var a = ;
6.  TypeError: 类型错误，比如\[1,2\].split('.');
7.  URIError: 给 encodeURI或 decodeURl()传递的参数无效，比如decodeURI('%2')
8.  Error: 上面7种错误的基类，通常是开发者抛出

也就是说，代码运行时发生的上述8类错误，都可以被检测到。

#### unhandledrejection

Promise内部抛出的错误是无法被error捕获到的，这时需要用unhandledrejection事件。

回到SDK的实现，处理错误报警的代码如下：

```
class StatisticSDK {
  constructor(productID){
    this.productID = productID;
    // 初始化错误监控
    this.initError()
  }
  // 数据发送
  send(baseURL,query={}){
    query.productID = this.productID;
      let queryStr = Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&')
      let img = new Image();
      img.src = `${baseURL}?${queryStr}`
  }
  // 自定义错误上报
  error(err, etraInfo={}) {
    const errorURL = 'http://error/'
    const { message, stack } = err;
    this.send(errorURL, { message, stack, ...etraInfo})
  }
  // 初始化错误监控
  initError(){
    window.addEventListener('error', event=>{
      this.error(error);
    })
    window.addEventListener('unhandledrejection', event=>{
      this.error(new Error(event.reason), { type: 'unhandledrejection'})
    })
  }
}
复制代码
```

和初始化性能监控一样，初始化错误监控也是一定要做的，所以需要在构造函数中调用。后续开发人员只用在业务代码的try catch中调用error方法即可。

### React/Vue组件错误

成熟的框架库都会有错误处理机制，React和Vue也不例外。

#### React的错误边界

错误边界是希望当应用内部发生渲染错误时，不会整个页面崩溃。我们提前给它设置一个兜底组件，并且可以细化粒度，只有发生错误的部分被替换成这个「兜底组件」，不至于整个页面都不能正常工作。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d09ecffb71b4439c96950643a5ccd2b1~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

它的使用很简单，就是一个带有特殊生命周期的类组件，用它把业务组件包裹起来。

这两个生命周期是`getDerivedStateFromError`和`componentDidCatch`，

代码如下：

```
// 定义错误边界
class ErrorBoundary extends React.Component {
  state = { error: null }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, errorInfo) {
    // 调用我们实现的SDK实例
    insSDK.error(error, errorInfo)
  }
  render() {
    if (this.state.error) {
      return <h2>Something went wrong.</h2>
    }
    return this.props.children
  }
}
...
<ErrorBoundary>
  <BuggyCounter />
</ErrorBoundary>
复制代码
```

> 建了一个在线sandbox可以体验，公众号后台回复「错误边界demo」获取地址

回到SDK的整合上，在生产环境下，被错误边界包裹的组件，如果内部抛出错误，全局的error事件是无法监听到的，因为这个错误边界本身就相当于一个try catch。所以需要在错误边界这个组件内部去做上报处理。也就是上面代码中的`componentDidCatch`生命周期。

#### Vue的错误边界

vue也有一个类似的生命周期来做这件事，不再赘述：`errorCaptured`

```
Vue.component('ErrorBoundary', {
  data: () => ({ error: null }),
  errorCaptured (err, vm, info) {
    this.error = `${err.stack}\n\nfound in ${info} of component`
    // 调用我们的SDK，上报错误信息
    insSDK.error(err,info)
    return false
  },
  render (h) {
    if (this.error) {
      return h('pre', { style: { color: 'red' }}, this.error)
    }
    return this.$slots.default[0]
  }
})
...
<error-boundary>
  <buggy-counter />
</error-boundary>

复制代码
```

现在我们已经实现了一个完整的SDK的骨架，并且处理了在实际开发时，react/vue项目应该怎么接入。

实际生产使用的SDK会更健壮，但思路也不外乎，感兴趣的可以去读一读源码。

## 结语

文章比较长，但想答好这个问题，这些知识储备都是必须的。

我们要设计SDK，首先要清楚它的基本使用方法，才知道后面的代码框架要怎么搭；然后是明确SDK的职能范围：需要能处理用户行为、页面性能以及错误报警三类监控；最后是react、vue的项目，通常会做错误边界处理，要怎么接入我们自己的SDK。

如果觉得这篇文章对你有用，点赞关注是对我最大的鼓励！

![IMG_6474.JPG](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a7060e993014a478998941a655d97dc~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

你的支持是我创作的动力！