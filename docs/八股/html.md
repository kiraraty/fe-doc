# HTML面试题

### 1.语义化标签

**语义化是指根据内容的结构化（内容语义化），选择合适的标签（代码语义化）**。通俗来讲就是用正确的标签做正确的事情。

语义化的优点如下：

- 对机器友好，带有语义的文字表现力丰富，更适合搜索引擎的爬虫爬取有效信息，有利于SEO。除此之外，语义类还支持读屏软件，根据文章可以自动生成目录；

- 对开发者友好，使用语义类标签增强了可读性，结构更加清晰，开发者能清晰的看出网页的结构，便于团队的开发与维护。

  ```html
  <header></header>  头部
  
  <nav></nav>  导航栏
  
  <section></section>  区块（有语义化的div）
  
  <main></main>  主要区域
  
  <article></article>  主要内容
  
  <aside></aside>  侧边栏
  
  <footer></footer>  底部
  ```

### 2.Doctype作用

DOCTYPE是HTML5中一种标准通用标记语言的文档类型声明，它的目的是**告诉浏览器（解析器）应该以什么样（html或xhtml）的文档类型定义来解析文档**，不同的渲染模式会影响浏览器对 CSS 代码甚⾄ JavaScript 脚本的解析。它必须声明在HTML⽂档的第⼀⾏。

浏览器渲染页面的两种模式（可通过document.compatMode获取，比如，语雀官网的文档类型是**CSS1Compat**）：

- **CSS1Compat：标准模式（Strick mode）**，默认模式，浏览器使用W3C的标准解析渲染页面。在标准模式中，浏览器以其支持的最高标准呈现页面。
- **BackCompat：怪异模式(混杂模式)(Quick mode)**，浏览器使用自己的怪异模式解析渲染页面。在怪异模式中，页面以一种比较宽松的向后兼容的方式显示。

### 3.Meta标签有哪些？有什么作用

`meta` 标签由 `name` 和 `content` 属性定义，**用来描述网页文档的属性**，比如网页的作者，网页描述，关键词等，除了HTTP标准固定了一些`name`作为大家使用的共识，开发者还可以自定义name。

常用的meta标签： （1）`charset`，用来描述HTML文档的编码类型：

```html
<meta charset="UTF-8" >
```

（2） `keywords`，页面关键词：

```html
<meta name="keywords" content="关键词" />
```

（3）`description`，页面描述：

```html
<meta name="description" content="页面描述内容" />
```

（4）`refresh`，页面重定向和刷新：

```html
<meta http-equiv="refresh" content="0;url=" />
```

（5）`viewport`，适配移动端，可以控制视口的大小和比例：

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
```

其中，`content` 参数有以下几种：

- `width viewport` ：宽度(数值/device-width)
- `height viewport` ：高度(数值/device-height)
- `initial-scale` ：初始缩放比例
- `maximum-scale` ：最大缩放比例
- `minimum-scale` ：最小缩放比例
- `user-scalable` ：是否允许用户缩放(yes/no）

（6）搜索引擎索引方式：

```html
<meta name="robots" content="index,follow" />
```

其中，`content` 参数有以下几种：

- `all`：文件将被检索，且页面上的链接可以被查询；
- `none`：文件将不被检索，且页面上的链接不可以被查询；
- `index`：文件将被检索；
- `follow`：页面上的链接可以被查询；
- `noindex`：文件将不被检索；
- `nofollow`：页面上的链接不可以被查询。

### 4.行内元素，块级元素，空元素有哪些

- 行内元素有：`a b span img input select strong`；
- 块级元素有：`div ul ol li dl dt dd h1 h2 h3 h4 h5 h6 p`
- 空元素，即没有内容的HTML元素。空元素是在开始标签中关闭的，也就是空元素没有闭合标签：
  - 常见的有：`<br>`、`<hr>`、`<img>`、`<input>`、`<link>`、`<meta>`

### 5.src和href有什么区别

src是指向外部资源的位置，指向的内容会嵌⼊到⽂档中当前标签所在的位置，在请求src资源时会将其指向的资源 下载并应⽤到⽂档内，如js脚本，img图⽚和frame等元素。当浏览器解析到该元素时，会暂停其他资源的下载和处 理，知道将该资源加载、编译、执⾏完毕，所以⼀般js脚本会放在底部⽽不是头部。
href是指向⽹络资源所在位置（的超链接），⽤来建⽴和当前元素或⽂档之间的连接，当浏览器识别到它他指向的 ⽂件时，就会并⾏下载资源，不会停⽌对当前⽂档的处理。

### 6.script标签中defer与async的区别

如果没有defer或async属性，浏览器会立即加载并执行相应的脚本。它不会等待后续加载的文档元素，读取到就会开始加载和执行，这样就阻塞了后续文档的加载。

下图可以直观的看出三者之间的区别:

![](https://s2.loli.net/2022/04/06/esdfD6zRcFYknxX.png)

其中蓝色代表js脚本网络加载时间，红色代表js脚本执行时间，绿色代表html解析。

**defer 和 async属性都是去异步加载外部的JS脚本文件，它们都不会阻塞页面的解析**，其区别如下：

- **执行顺序：** 多个带async属性的标签，不能保证加载的顺序；多个带defer属性的标签，按照加载顺序执行；
- **脚本是否并行执行：async属性，表示后续文档的加载和执行与js脚本的加载和执行是并行进行的**，即异步执行；defer属性，加载后续文档的过程和js脚本的加载(此时仅加载不执行)是并行进行的(异步)，js脚本需要等到文档所有元素解析完成之后才执行，DOMContentLoaded事件触发执行之前。

### 7.Webworker特性

由于JAVASCRIPT语言采用的是单线程模型,所有任务只能再一个线程上执行。早期得计算机是单核心所以没有问题。但是随着计算机能力得增强，特别是多核CPU的出现。单线程就带来很大的不便，无法充分发挥计算机的计算能力。

所以在HTML5的规范中提供了一个多线程的解决方案，这就是WEB-WORKER

WEB-WORKER允许JAVASCRIPT创造多线程环境,允许主线程创建WORKER线程,将任务分配在后台运行。这样高延迟，密集型的任务可以由WORKER线程负担，主线程负责UI交互就会很流畅,不会会阻塞或拖慢

主线程使用new命令调用Worker()构造函数创建一个Worker线程

- `var worker = new Worker('xxxxx.js')`
- Worker构造函数接收参数为脚本文件路径
-  worker 的两个限制：
  1. **分配给 Worker 线程运行的脚本文件，必须与主线程的脚本文件同源**。
  2. **worker 不能读取本地的文件**(不能打开本机的文件系统`file://`)，它所加载的脚本必须来自网络

主线程指定监听函数监听Worker线程的返回消息

- `worker.onmessage = function (event) {console.log(event.data)}`
- `data`为Worker发来的数据

由于主线程与Worker线程存在通信限制,不再同一个上下文中,所以只能通过消息完成

- `worker.postMessage("hello world")`
- `worker.postMessage({action: "ajax", url: "xxxxx", method: "post"})`

当使用完成后，如果不需要再使用可以在主线程中关闭Worker

- `worker.terminate()`
- Worker也可以关闭自身,在Worker的脚本中执行 `self.close()`

- 如果需要引用其他脚本可以使用

  importScripts

  - `importScripts('scripts1.js')`
  - 该方法可以同时加载多个脚本 `importScripts('scripts1.js'，'scripts2.js')`

主线程与Worker之间通信时拷贝的方式进行,即是传值而不是传址。Worker中对通信数据的修改并不会影响到主线程。

> 事实上，浏览器内部的运行机制是，先将通信内容串行化，然后把串行化后的字符串发给 Worker，后者再将它还原

但是拷贝的形式做数据传输会造成性能问题，比如主线程向Worker发送几百MB的数据,默认情况下,浏览器会生成一份拷贝。为了解决这个问题,JAVASCRIPT允许主线程将二进制数据直接转移给Worker,但是转移控制权后，主线程就不再能使用这些数据。这是为了防止多个线程同时修改数据的情况发生

**用途**

前端会定期检测后端服务的可用情况,一般情况下处理都是通过开启定时轮询发送ajax检测。这就会占用主线程资源

所以可以放在Worker中进行处理.出现异常再通知主线程渲染UI给予提示等操作

> ### 优点与缺点

- 优点
  - 独立于主线程,不造成阻塞
  - 非常适合处理高频、高延时的任务
  - 可以内部做队列机制,做为延时任务的缓冲层
- 缺点
  - 无法操作DOM,无法获取window, document, parent等对象
  - 遵守同源限制, Worker线程的脚本文件，必须于主线程同源。并且加载脚本文件是阻塞的
  - 不当的操作或者疏忽容易引起性能问题



Web Worker (工作线程) 是 HTML5 中提出的概念，分为两种类型，专用线程（Dedicated Web Worker） 和共享线程（Shared Web Worker）。专用线程仅能被创建它的脚本所使用（一个专用线程对应一个主线程），而共享线程能够在不同的脚本中使用（一个共享线程对应多个主线程）。

在 HTML 页面中，如果在执行脚本时，页面的状态是不可相应的，直到脚本执行完成后，页面才变成可相应。web worker 是运行在后台的 js，独立于其他脚本，不会影响页面的性能。 并且通过 postMessage 将结果回传到主线程。这样在进行复杂操作的时候，就不会阻塞主线程了。

Web Worker 的意义在于可以将一些耗时的数据处理操作从主线程中剥离，使主线程更加专注于页面渲染和交互。

如何创建 web worker：

1. 检测浏览器对于 web worker 的支持性
2. 创建 web worker 文件（js，回传函数等）
3. 创建 web worker 对象

### 8.多个标签页怎么进行通信

实现多个标签页之间的通信，本质上都是通过中介者模式来实现的。因为标签页之间没有办法直接通信，因此我们可以找一个中介者，让标签页和中介者进行通信，然后让这个中介者来进行消息的转发。通信方法如下：

#### 使用 websocket 协议

因为 websocket 协议可以实现服务器推送，所以服务器就可以用来当做这个中介者。标签页通过向服务器发送数据，然后由服务器向其他标签页推送转发。

#### **使用 ShareWorker 的方式**

shareWorker 会在页面存在的生命周期内创建一个唯一的线程，并且开启多个页面也只会使用同一个线程。这个时候共享线程就可以充当中介者的角色。标签页间通过共享一个线程，然后通过这个共享的线程来实现数据的交换。

- SharedWorker可以被多个window共同使用，但必须保证这些标签页都是同源的(相同的协议，主机和端口号)
- 首先新建一个js文件`worker.js`，具体代码如下：

```
// sharedWorker所要用到的js文件，不必打包到项目中，直接放到服务器即可
let data = ''
onconnect = function (e) {
  let port = e.ports[0]

  port.onmessage = function (e) {
    if (e.data === 'get') {
      port.postMessage(data)
    } else {
      data = e.data
    }
  }
}
```

webworker端的代码就如上，只需注册一个onmessage监听信息的事件，客户端(即使用sharedWorker的标签页)发送message时就会触发。

因为客户端和webworker端的通信不像websocket那样是全双工的，所以客户端发送数据和接收数据要分成两步来处理。示例中会有两个按钮，分别对应的向sharedWorker发送数据的请求以及获取数据的请求，但他们本质上都是相同的事件--发送消息。

webworker端会进行判断，传递的数据为'get'时，就把变量data的值回传给客户端，其他情况，则把客户端传递过来的数据存储到data变量中。下面是客户端的代码：

```
// 这段代码是必须的，打开页面后注册SharedWorker，显示指定worker.port.start()方法建立与worker间的连接
    if (typeof Worker === "undefined") {
      alert('当前浏览器不支持webworker')
    } else {
      let worker = new SharedWorker('worker.js')
      worker.port.addEventListener('message', (e) => {
        console.log('来自worker的数据：', e.data)
      }, false)
      worker.port.start()
      window.worker = worker
    }
// 获取和发送消息都是调用postMessage方法，我这里约定的是传递'get'表示获取数据。
window.worker.port.postMessage('get')
window.worker.port.postMessage('发送信息给worker')
```

页面A发送数据给worker，然后打开页面B，调用`window.worker.port.postMessage('get')`，即可收到页面A发送给worker的数据。



#### **使用 localStorage 的方式**

我们可以在一个标签页对 localStorage 的变化事件进行监听，然后当另一个标签页修改数据的时候，我们就可以通过这个监听事件来获取到数据。这个时候 localStorage 对象就是充当的中介者的角色。

localstorage是浏览器多个标签共用的存储空间，所以可以用来实现多标签之间的通信(ps：session是会话级的存储空间，每个标签页都是单独的）。

直接在window对象上添加监听即可：

```
window.onstorage = (e) => {console.log(e)}
// 或者这样
window.addEventListener('storage', (e) => console.log(e))
```

onstorage以及storage事件，针对都是**非当前页面**对localStorage进行修改时才会触发，当前页面修改localStorage不会触发监听函数。然后就是在对原有的数据的值进行修改时才会触发，比如原本已经有一个key会a值为b的localStorage，你再执行：`localStorage.setItem('a', 'b')`代码，同样是不会触发监听函数的。




### 9.canvas和svg有什么区别

**（1）SVG：** SVG可缩放矢量图形（Scalable Vector Graphics）是基于可扩展标记语言XML描述的2D图形的语言，SVG基于XML就意味着SVG DOM中的每个元素都是可用的，可以为某个元素附加Javascript事件处理器。在 SVG 中，每个被绘制的图形均被视为对象。如果 SVG 对象的属性发生变化，那么浏览器能够自动重现图形。

其特点如下：

- 不依赖分辨率
- 支持事件处理器
- 最适合带有大型渲染区域的应用程序（比如谷歌地图）
- 复杂度高会减慢渲染速度（任何过度使用 DOM 的应用都不快）
- 不适合游戏应用

**（2）Canvas：** Canvas是画布，通过Javascript来绘制2D图形，是逐像素进行渲染的。其位置发生改变，就会重新进行绘制。

其特点如下：

- 依赖分辨率
- 不支持事件处理器
- 弱的文本渲染能力
- 能够以 .png 或 .jpg 格式保存结果图像
- 最适合图像密集型的游戏，其中的许多对象会被频繁重绘

注：矢量图，也称为面向对象的图像或绘图图像，在数学上定义为一系列由线连接的点。矢量文件中的图形元素称为对象。每个对象都是一个自成一体的实体，它具有颜色、形状、轮廓、大小和屏幕位置等属性。

### 10.H5的离线存储

离线存储指的是：在用户没有与因特网连接时，可以正常访问站点或应用，在用户与因特网连接时，更新用户机器上的缓存文件。

**原理：**HTML5的离线存储是基于一个新建的 `.appcache` 文件的缓存机制(不是存储技术)，通过这个文件上的解析清单离线存储资源，这些资源就会像cookie一样被存储了下来。之后当网络在处于离线状态下时，浏览器会通过被离线存储的数据进行页面展示

**使用方法：** （1）创建一个和 html 同名的 manifest 文件，然后在页面头部加入 manifest 属性：

```html
<html lang="en" manifest="index.manifest">
```

（2）在 `cache.manifest` 文件中编写需要离线存储的资源：

```html
CACHE MANIFEST
    #v0.11
    CACHE:
    js/app.js
    css/style.css
    NETWORK:
    resourse/logo.png
    FALLBACK:
    / /offline.html
```

- **CACHE**: 表示需要离线存储的资源列表，由于包含 manifest 文件的页面将被自动离线存储，所以不需要把页面自身也列出来。
- **NETWORK**: 表示在它下面列出来的资源只有在在线的情况下才能访问，他们不会被离线存储，所以在离线情况下无法使用这些资源。不过，如果在 CACHE 和 NETWORK 中有一个相同的资源，那么这个资源还是会被离线存储，也就是说 CACHE 的优先级更高。
- **FALLBACK**: 表示如果访问第一个资源失败，那么就使用第二个资源来替换他，比如上面这个文件表示的就是如果访问根目录下任何一个资源失败了，那么就去访问 offline.html 。

（3）在离线状态时，操作 `window.applicationCache` 进行离线缓存的操作。

**如何更新缓存：**

（1）更新 manifest 文件

（2）通过 javascript 操作

（3）清除浏览器缓存

### 11.drag API

一个典型的拖放操作是这样的：用户选中一个**可拖拽的(draggable)** 元素，并将其拖拽（鼠标不放开）到一个**可放置的(droppable)** 元素，然后释放鼠标。

在这个过程中，最重要的三个点是：

- 让元素可拖拽
- 让另一个元素支持可放置
- 可拖拽和可放置元素之间的数据传递
- dragstart：事件主体是被拖放元素，在开始拖放被拖放元素时触发。
- darg：事件主体是被拖放元素，在正在拖放被拖放元素时触发。
- dragenter：事件主体是目标元素，在被拖放元素进入某元素时触发。
- dragover：事件主体是目标元素，在被拖放在某元素内移动时触发。
- dragleave：事件主体是目标元素，在被拖放元素移出目标元素是触发。
- drop：事件主体是目标元素，在目标元素完全接受被拖放元素时触发。
- dragend：事件主体是被拖放元素，在整个拖放操作结束时触发。

>选中 --->  拖动  ---> 释放

拖动事件：dragstart、drag、dragend

放置事件：dragenter、dragover、drop

拖拽事件流：当拖动一个元素放置到目标元素上的时候将会按照如下顺序依次触发dragstart->drag->dragenter->dragover->drop->dragend

#### 选中

在HTML5标准中，为了使元素可拖动，把draggable属性设置为true。
文本、图片和链接是默认可以拖放的，它们的draggable属性自动被设置成了true。
图片和链接按住鼠标左键选中，就可以拖放。
文本只有在被选中的情况下才能拖放。如果显示设置文本的draggable属性为true，按住鼠标左键也可以直接拖放。

draggable属性：设置元素是否可拖动。语法：`<element draggable="true | false | auto" >`

- true: 可以拖动  
- false: 禁止拖动  
- auto: 跟随浏览器定义是否可以拖动  

#### 拖动

每一个可拖动的元素，在拖动过程中，都会经历三个过程，`拖动开始`-->`拖动过程中`--> `拖动结束`。

| 针对对象     | 事件名称  | 说明                                             |
| ------------ | --------- | ------------------------------------------------ |
| 被拖动的元素 | dragstart | 在元素开始被拖动时候触发                         |
|              | drag      | 在元素被拖动时反复触发                           |
|              | dragend   | 在拖动操作完成时触发                             |
|              |           |                                                  |
| 目的地对象   | dragenter | 当被拖动元素进入目的地元素所占据的屏幕空间时触发 |
|              | dragover  | 当被拖动元素在目的地元素内时触发                 |
|              | dragleave | 当被拖动元素没有放下就离开目的地元素时触发       |

dragenter和dragover事件的默认行为是拒绝接受任何被拖放的元素。因此，我们必须阻止浏览器这种默认行为。e.preventDefault();

#### 释放

到达目的地之后，释放元素事件

| 针对对象   | 事件名称 | 说明                                                         |
| ---------- | -------- | ------------------------------------------------------------ |
| 目的地对象 | drop     | 当被拖动元素在目的地元素里放下时触发，一般需要取消浏览器的默认行为。 |



### 12.H5有那些新特性

#### 1. 语义化标签

- header：定义文档的页眉（头部）；
- nav：定义导航链接的部分；
- footer：定义文档或节的页脚（底部）；
- article：定义文章内容；
- section：定义文档中的节（section、区段）；
- aside：定义其所处内容之外的内容（侧边）；

#### 2. 媒体标签

（1） audio：音频

```html
<audio src='' controls autoplay loop='true'></audio>
```

属性：

- controls 控制面板
- autoplay 自动播放
- loop=‘true’ 循环播放

（2）video视频

```html
<video src='' poster='imgs/aa.jpg' controls></video>
```

属性：

- poster：指定视频还没有完全下载完毕，或者用户还没有点击播放前显示的封面。默认显示当前视频文件的第一针画面，当然通过poster也可以自己指定。
- controls 控制面板
- width
- height

（3）source标签 因为浏览器对视频格式支持程度不一样，为了能够兼容不同的浏览器，可以通过source来指定视频源。

```html
<video>
 	<source src='aa.flv' type='video/flv'></source>
 	<source src='aa.mp4' type='video/mp4'></source>
</video>
```

#### 3. 表单

**表单类型：**

- email ：能够验证当前输入的邮箱地址是否合法
- url ： 验证URL
- number ： 只能输入数字，其他输入不了，而且自带上下增大减小箭头，max属性可以设置为最大值，min可以设置为最小值，value为默认值。
- search ： 输入框后面会给提供一个小叉，可以删除输入的内容，更加人性化。
- range ： 可以提供给一个范围，其中可以设置max和min以及value，其中value属性可以设置为默认值
- color ： 提供了一个颜色拾取器
- time ： 时分秒
- data ： 日期选择年月日
- datatime ： 时间和日期(目前只有Safari支持)
- datatime-local ：日期时间控件
- week ：周控件
- month：月控件

**表单属性：**

- placeholder ：提示信息
- autofocus ：自动获取焦点
- autocomplete=“on” 或者 autocomplete=“off” 使用这个属性需要有两个前提：
  - 表单必须提交过
  - 必须有name属性。
- required：要求输入框不能为空，必须有值才能够提交。
- pattern=" " 里面写入想要的正则模式，例如手机号patte="^(+86)?\d{10}$"
- multiple：可以选择多个文件或者多个邮箱
- form=" form表单的ID"

**表单事件：**

- oninput 每当input里的输入框内容发生变化都会触发此事件。
- oninvalid 当验证不通过时触发此事件。

#### 4. 进度条、度量器

- progress标签：用来表示任务的进度（IE、Safari不支持），max用来表示任务的进度，value表示已完成多少
- meter属性：用来显示剩余容量或剩余库存（IE、Safari不支持）
  - high/low：规定被视作高/低的范围
  - max/min：规定最大/小值
  - value：规定当前度量值

设置规则：min < low < high < max

#### 5. DOM查询操作

- document.querySelector()
- document.querySelectorAll()

它们选择的对象可以是标签，可以是类(需要加点)，可以是ID(需要加#)

#### 6. Web存储

HTML5 提供了两种在客户端存储数据的新方法：

- localStorage - 没有时间限制的数据存储
- sessionStorage - 针对一个 session 的数据存储

#### 7. 其他

- 拖放：拖放是一种常见的特性，即抓取对象以后拖到另一个位置。设置元素可拖放：

```html
<img draggable="true" />
```

- 画布（canvas ）： canvas 元素使用 JavaScript 在网页上绘制图像。画布是一个矩形区域，可以控制其每一像素。canvas 拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法。

```html
<canvas id="myCanvas" width="200" height="100"></canvas>
```

- SVG：SVG 指可伸缩矢量图形，用于定义用于网络的基于矢量的图形，使用 XML 格式定义图形，图像在放大或改变尺寸的情况下其图形质量不会有损失，它是万维网联盟的标准
- 地理定位：Geolocation（地理定位）用于定位用户的位置。‘

**总结：** 

**（1）新增语义化标签：nav、header、footer、aside、section、article** 

**（2）音频、视频标签：audio、video** 

**（3）数据存储：localStorage、sessionStorage** 

**（4）canvas（画布）、Geolocation（地理定位）、websocket（通信协议）**

 **（5）input标签新增属性：placeholder、autocomplete、autofocus、required** 

**（6）history API：go、forward、back、pushstate**

