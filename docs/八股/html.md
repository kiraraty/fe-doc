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

- 行内元素有：`a b span img input select strong button` ；
- 块级元素有：`div ul ol li dl dt dd h1 h2 h3 h4 h5 h6 p`
- 空元素，即没有内容的HTML元素。空元素是在开始标签中关闭的，也就是空元素没有闭合标签：
  - 常见的有：`<br>`、`<hr>`、`<img>`、`<input>`、`<link>`、`<meta>`

### 5.src和href有什么区别

src是**指向外部资源的位置**，指向的内容会嵌⼊到⽂档中当前标签所在的位置，在请求src资源时会将其指向的资源 下载并应⽤到⽂档内，如js脚本，img图⽚和frame等元素。当浏览器解析到该元素时，**会暂停其他资源的下载和处理**，知道将该资源加载、编译、执⾏完毕，所以⼀般**js脚本会放在底部⽽不是头部**。
href是指向**⽹络资源所在位置（的超链接）**，⽤来建⽴和当前元素或⽂档之间的连接，当浏览器识别到它他指向的⽂件时，就会并⾏下载资源，不会停⽌对当前⽂档的处理。

### 6.script标签中defer与async的区别

如果没有defer或async属性，浏览器会立即加载并执行相应的脚本。它不会等待后续加载的文档元素，读取到就会开始加载和执行，这样就阻塞了后续文档的加载。

下图可以直观的看出三者之间的区别:

<img src="https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsesdfD6zRcFYknxX.png" style="zoom:150%;" />

其中蓝色代表js脚本**网络加载时间**，红色代表js脚本**执行时间**，绿色代表html解析。

**defer 和 async属性都是去异步加载外部的JS脚本文件，它们都不会阻塞页面的解析**，其区别如下：

- **执行顺序：** 多个带async属性的标签，不能保证加载的顺序；多个带defer属性的标签，按照加载顺序执行；
- **脚本是否并行执行：async属性，表示后续文档的加载和执行与js脚本的加载和执行是并行进行的**，即异步执行；defer属性，加载后续文档的过程和js脚本的加载(此时仅加载不执行)是并行进行的(异步)，js脚本需要等到文档所有元素解析完成之后才执行，DOMContentLoaded事件触发执行之前。

### 7.Webworker特性

由于JAVASCRIPT语言采用的是**单线程模型**,所有任务只能再**一个线程**上执行。早期得计算机是单核心所以没有问题。但是随着计算机能力得增强，特别是多核CPU的出现。单线程就带来很大的不便，无法充分发挥计算机的计算能力。

所以在HTML5的规范中提供了一个多线程的解决方案，这就是WEB-WORKER

WEB-WORKER允许JAVASCRIPT创造多线程环境,允许**主线程创建WORKER线程**,将任务分配在后台运行。这样**高延迟，密集型**的任务可以由WORKER线程负担，**主线程负责UI交互**就会很流畅,不会会阻塞或拖慢

Web Worker (工作线程) 是 HTML5 中提出的概念，分为两种类型，**专用线程（Dedicated Web Worker） 和共享线程（Shared Web Worker）**。专用线程仅能被创建它的脚本所使用（一个专用线程对应一个主线程），而共享线程能够在不同的脚本中使用（一个共享线程对应多个主线程）。

在 HTML 页面中，如果在执行脚本时，页面的状态是不可相应的，直到脚本执行完成后，页面才变成可相应。web worker 是运行在后台的 js，独立于其他脚本，**不会影响页面的性能**。 并且通过 postMessage 将结果回传到主线程。这样在进行复杂操作的时候，就不会阻塞主线程了。

Web Worker 的意义在于可以将**一些耗时的数据处理操作从主线程中剥离，使主线程更加专注于页面渲染和交互**。

如何创建 web worker：

1. 检测浏览器对于 web worker 的支持性
2. 创建 web worker 文件（js，回传函数等）
3. 创建 web worker 对象

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

  import  Scripts

  - `importScripts('scripts1.js')`
  - 该方法可以同时加载多个脚本 `importScripts('scripts1.js'，'scripts2.js')`

主线程与Worker之间通信时拷贝的方式进行,即是传值而不是传址。Worker中对通信数据的修改并不会影响到主线程。

> 事实上，浏览器内部的运行机制是，先将通信内容串行化，然后把串行化后的字符串发给 Worker，后者再将它还原

但是拷贝的形式做数据传输会造成性能问题，比如主线程向Worker发送几百MB的数据,默认情况下,浏览器会生成一份拷贝。为了解决这个问题,JAVASCRIPT允许主线程将二进制数据直接转移给Worker,但是转移控制权后，主线程就不再能使用这些数据。这是为了防止多个线程同时修改数据的情况发生

**用途**

前端会定期检测后端服务的可用情况,一般情况下处理都是通过开启定时轮询发送ajax检测。这就会占用主线程资源

所以可以放在Worker中进行处理.出现异常再通知主线程渲染UI给予提示等操作

#### 优点与缺点

- 优点
  - 独立于主线程,不造成阻塞
  - 非常适合处理高频、高延时的任务
  - 可以内部做队列机制,做为延时任务的缓冲层
- 缺点
  - 无法操作DOM,无法获取window, document, parent等对象
  - 遵守同源限制, Worker线程的脚本文件，必须于主线程同源。并且加载脚本文件是阻塞的
  - 不当的操作或者疏忽容易引起性能问题

#### 共享的shareWorkers

**共享workers，页面之间需要符合同源策略**。
index.js

```js
if (!!window.SharedWorker) {
  var myWorker = new SharedWorker("work.js");
	
  myWorker.port.onmessage = function(e) {
    console.log('Message received from worker');
  }
}
```

和workes的区别在于多一个端口调用。
必须设置一个onmessage或者port.start()

什么时候使用start？
当我们需要addEventListener()时候
如何使用？
父页面直接执行 myWorker.port.start()
workers执行 port.start()完成打开端口即可

这是为了与后续的work.js的connect相呼应，因为相当于注册一个端口。
在workers是隐性的，并不是必需进行这步。
如果使用start打开端口，就需要在work.js中调用相同的方法。port.start()

work.js

```js
var clients = [];
onconnect = function(e) {
    var port = e.ports[0];
    clients.push(port);
    port.onmessage=function(e) {
        clients.forEach((item,i)=>{
            item.postMessage(e.data)
        })
    }
}
```

这里不在是onmessage来设置监听事件了，我们使用一个变量，将所有的注册端口保存起来，这就是共享的意义，一个worker相当于一个单例，所以页面访问的是同一个上下文。
如果想要广播所有端口，就可以像例子中遍历端口发送数据。
如果你需要对某个特定的页面端口进行特别处理，你可以通过父页面的传递信息约定一个数据，进行判断处理事件。
注意：**需要页面是同源的情况下才能访问**。

### 8.ServiceWorker

##### 基本原理

>Service worker是一个注册在指定源和路径下的事件驱动worker。
>它采用JavaScript控制关联的页面或者网站，拦截并修改访问和资源请求，细粒度地缓存资源。
>常见于网络不可用的情况下

service worker同样是workers的另一个类型。但是由于目前支持度不是很高，所以还是遇到很大的兼容性的问题，得不到广泛的使用。

同步API（如XHR和localStorage）不能在service worker中使用。
出于安全考量，Service workers只能由HTTPS承载
如果一个网页没有了网络，那就将失去所有意义。
所以为了解决这个问题，就需要一个线程脚本，在没有网络连接的时候来控制网页。这样就导致离线页面和service worker的出现。有了这一功能，也代表着网页APP有了与原生APP叫板的底气。

缺点：非常明显，开启service worker可能会导致浏览器的缓存数据大大增加。
![在这里插入图片描述](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsmvHaji6xfMdy2h1.png)

用户首次访问service works控制的网站和网址的时候，service works会立刻下载。

之后每24小时就会被下载以此，期间可能频繁更新，不过每24小时一定会被下载一次，以避免不良脚本长时间生效。

如果这是首次启用service worker，页面会首先尝试安装，安装成功后它会被激活。

如果新版本的service worker已经下载完但是正在安装，但是不会被激活，这个时候称为 worker in waiting。
直到所有已经加载页面不再使用旧的service worker 的时候，才会激活新的service worker。新激活的service worker称为active worker注册一个service worker

##### 注册一个service worker

`·'/sw-test/'·`，表示 app 的 origin 下的所有内容。如果你留空的话，默认值也是这个值， 我们在指定只是作为例子。

```js
if ('serviceWorker' in navigator) {
	// 读取js，进行注册
  navigator.serviceWorker.register('/sw-test/sw.js', { scope: '/sw-test/' }).then(function(reg) {
    if(reg.installing) {// 这里有判断service worker状态
      console.log('Service worker installing');
    } else if(reg.waiting) {
      console.log('Service worker installed');
    } else if(reg.active) {
      console.log('Service worker active');
    }

  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}
```

##### 使用servers worker

###### 设置缓存和缓存数据

进行了上面的注册，就可以开始使用service worker的API了

```js
// sw.js

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/sw-test/',
        '/sw-test/index.html',
        '/sw-test/style.css',
        '/sw-test/app.js',
        '/sw-test/image-list.js',
        '/sw-test/star-wars-logo.jpg',
        '/sw-test/gallery/bountyHunters.jpg',
        '/sw-test/gallery/myLittleVader.jpg',
        '/sw-test/gallery/snowTroopers.jpg'
      ]);
    })
  );
});

```

我们先讨论首次加载的情况
这里添加的是安装的监听事件。
waitUntil是确保service worker安装前，读取到所有的数据。
caches.open()方法，是创建一个缓存v1区域，保存下面的文件。这里使用的是promise来实现。
service worker安装完成之后，就开始变成激活状态。
虽然都是缓存，但是service worker不允许使用localstorage

###### 使用缓存

添加fetch事件，进行操作。

```js
self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();
        
        caches.open('v1').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('/sw-test/gallery/myLittleVader.jpg');
      });
    }
  }));
});
```

当service worker控制的资源被请求时候，就会触发fetch事件。这些资源包含了指定的scope文档。
事件上的EVENT上的respondWith劫持HTTPS的请求，劫持之后你就可以进行任何的操作
例子中caches.match是用于匹配本地资源是否存在这个文件。
然后判断本地缓存是否有网络请求的响应报文，如果有则使用本地资源缓存，如果没有则使用fetch进行请求，当然也可以使用xht，如果使用后者，你还需要配置路径和方法，而fetch是封装好的API，只需要传入请求文段即可发送请求。
fetch这个方法本身是支持promise的，所以是异步进行请求的。
如果想要下次不需要网络请求，你可以将请求报文段保存到缓存，这样下次请求能够直接使用本地的缓存文件了。
最后如果不出意外，请求会返回一些数据，你可以将他们保存到本地，然后再返回给客户端。
cache.put(event.request, responseClone);

其实service worker更新一个中间代理服务器。它特别的地方是离线状态也可以访问，如果存在你需要的资源就可以返回给你，这样达到离线访问web app的目的。
当然，这种API自然对资源管理要求更加严格，如果滥用很可能会导致缓存过大，打开一个网页会让计算机占的内存变大等问题。目前支持度主要是谷歌的CHROM 和火狐的FIRFOX。这些都是默认关闭的，需要用户自己打开才能使用这个API，所以目前还处在测试的环节。
不过抛开这些短板来看，web app或许真的可能会代替native app。

**应用场景**
响应推送：启动一个service work，获取服务器推送的消息，不会影响用户体验
后台同步：启动一个service work，更新服务器的数据，不会影响用户体验
自定义模板用于特定URL模式：因为service worker能够劫持HTTP请求，所以可以自己自定义格式进行处理。
性能增强：我们可以对用户的预处理进行预请求，比如图片的懒加载，可以先使用service worker保存前几页的数据，这样用户交互的时候，就会减少等待时间。
其实上面的功能，普通的web workers都可以实现，但是由于service work已经封装好了API，如劫持HTTP请求的方法，对上面的场景实现起来非常方便


### 9.多个标签页怎么进行通信

实现多个标签页之间的通信，本质上都是通过中介者模式来实现的。因为标签页之间没有办法直接通信，因此我们可以找一个中介者，让标签页和中介者进行通信，然后让这个中介者来进行消息的转发。通信方法如下：

#### 使用 websocket 协议

因为 websocket 协议可以实现服务器推送，所以服务器就可以用来当做这个中介者。标签页通过向服务器发送数据，然后由服务器向其他标签页推送转发。

#### **使用 ShareWorker 的方式**

shareWorker 会在页面存在的生命周期内创建一个唯一的线程，并且开启多个页面也只会使用同一个线程。这个时候共享线程就可以充当中介者的角色。标签页间通过共享一个线程，然后通过这个共享的线程来实现数据的交换。

- SharedWorker可以被多个window共同使用，但必须保证这些标签页都是同源的(相同的协议，主机和端口号)
- 首先新建一个js文件`worker.js`，具体代码如下：

```js
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

```js
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

```js
window.onstorage = (e) => {console.log(e)}
// 或者这样
window.addEventListener('storage', (e) => console.log(e))
```

onstorage以及storage事件，针对都是**非当前页面**对localStorage进行修改时才会触发，当前页面修改localStorage不会触发监听函数。然后就是在对原有的数据的值进行修改时才会触发，比如原本已经有一个key会a值为b的localStorage，你再执行：`localStorage.setItem('a', 'b')`代码，同样是不会触发监听函数的。


### 10.canvas和svg有什么区别

**（1）SVG：** SVG**可缩放矢量图形**（Scalable Vector Graphics）是基于可扩展标记语言XML描述的2D图形的语言，**SVG基于XML就意味着SVG DOM中的每个元素都是可用的**，可以为某个元素附加Javascript事件处理器。在 SVG 中，**每个被绘制的图形均被视为对象**。如果 SVG 对象的属性发生变化，那么浏览器能够自动重现图形。

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

### 11.H5的离线存储

离线存储指的是：在用户没有与因特网连接时，可以正常访问站点或应用，在用户与因特网连接时，更新用户机器上的缓存文件。

**原理：**HTML5的**离线存储**是基于一个新建的 `.appcache` 文件的缓存机制(不是存储技术)，通过这个文件上的**解析清单离线存储资源**，这些资源就会像cookie一样被存储了下来。之后当网络在处于离线状态下时，浏览器会通过被离线存储的数据进行页面展示

**使用方法：** （1）创建一个和 html 同名的 manifest 文件，然后在页面头部加入 manifest 属性：

```html
<html lang="en" manifest="index.manifest">
```

（2）在 `cache.manifest` 文件中编写需要离线存储的资源：

```js
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

### 12.drag API

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



### 13.H5有那些新特性

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

#### 3. 表单(input)

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

### 14.SEO的概念以及如何实现

#### 一、搜索引擎工作原理

在搜索引擎网站的后台会有一个非常庞大的数据库，里面存储了海量的关键词，而每个关键词又对应着很多网址，这些网址是被称之为“搜索引擎蜘蛛”或“网络爬虫”程序从茫茫的互联网上一点一点下载收集而来的。随着各种各样网站的出现，这些勤劳的“蜘蛛”每天在互联网上爬行，从一个链接到另一个链接，下载其中的内容，进行分析提炼，找到其中的关键词，如果“蜘蛛”认为关键词在数据库中没有而对用户是有用的便存入后台的数据库中。反之，如果“蜘蛛”认为是垃圾信息或重复信息，就舍弃不要，继续爬行，寻找最新的、有用的信息保存起来提供用户搜索。当用户搜索时，就能检索出与关键字相关的网址显示给访客。

一个关键词对用多个网址，因此就出现了排序的问题，相应的当与关键词最吻合的网址就会排在前面了。在“蜘蛛”抓取网页内容，提炼关键词的这个过程中，就存在一个问题：“蜘蛛”能否看懂。如果网站内容是flash和js等，那么它是看不懂的，会犯迷糊，即使关键字再贴切也没用。相应的，如果网站内容可以被搜索引擎能识别，那么搜索引擎就会提高该网站的权重，增加对该网站的友好度。这样一个过程我们称之为SEO。

#### 二、SEO简介

SEO(Search Engine Optimization)，即搜索引擎优化。SEO是随着搜索引擎的出现而来的，两者是相互促进，互利共生的关系。SEO的存在就是为了提升网页在搜索引擎自然搜索结果中的收录数量以及排序位置而做的优化行为。而优化的目的就是为了提升网站在搜索引擎中的权重，增加对搜索引擎的友好度，使得用户在访问网站时能排在前面。

分类：白帽SEO和黑帽SEO。白帽SEO，起到了改良和规范网站设计的作用，使网站对搜索引擎和用户更加友好，并且网站也能从搜索引擎中获取合理的流量，这是搜索引擎鼓励和支持的。黑帽SEO，利用和放大搜索引擎政策缺陷来获取更多用户的访问量，这类行为大多是欺骗搜索引擎，一般搜索引擎公司是不支持与鼓励的。本文针对白帽SEO，那么白帽SEO能做什么呢？

\1. 对网站的标题、关键字、描述精心设置，反映网站的定位，让搜索引擎明白网站是做什么的；

\2. 网站内容优化：内容与关键字的对应，增加关键字的密度；

\3. 在网站上合理设置Robots.txt文件；

\4. 生成针对搜索引擎友好的网站地图；

\5. 增加外部链接，到各个网站上宣传。

#### 三、为什么要做SEO

提高网站的权重，增强搜索引擎友好度，以达到提高排名，增加流量，改善（潜在）用户体验，促进销售的作用。

#### 四、前端SEO规范

前端是构建网站中很重要的一个环节，前端的工作主要是负责页面的HTML+CSS+JS，优化好这几个方面会为SEO工作打好一个坚实的基础。通过网站的结构布局设计和网页代码优化，使前端页面既能让浏览器用户能够看懂（提升用户体验），也能让“蜘蛛”看懂（提高搜索引擎友好度）。

前端SEO注意事项：

1、网站结构布局优化：尽量简单、开门见山，提倡扁平化结构

一般而言，建立的网站结构层次越少，越容易被“蜘蛛”抓取，也就容易被收录。一般中小型网站目录结构超过三级，“蜘蛛”便不愿意往下爬了。并且根据相关数据调查：如果访客经过跳转3次还没找到需要的信息，很可能离开。因此，三层目录结构也是体验的需要。为此我们需要做到：

（1）控制首页链接数量

网站首页是权重最高的地方，如果首页链接太少，没有“桥”，“蜘蛛”不能继续往下爬到内页，直接影响网站收录数量。但是首页链接也不能太多，一旦太多，没有实质性的链接，很容易影响用户体验，也会降低网站首页的权重，收录效果也不好。

（2）扁平化的目录层次

尽量让“蜘蛛”只要跳转3次，就能到达网站内的任何一个内页。

（3）导航优化

导航应该尽量采用文字方式，也可以搭配图片导航，但是图片代码一定要进行优化，![img](https://juejin.cn/post/6844903824428105735)标签必须添加“alt”和“title”属性，告诉搜索引擎导航的定位，做到即使图片未能正常显示时，用户也能看到提示文字。

其次，在每一个网页上应该加上面包屑导航，好处：从用户体验方面来说，可以让用户了解当前所处的位置以及当前页面在整个网站中的位置，帮助用户很快了解网站组织形式，从而形成更好的位置感，同时提供了返回各个页面的接口，方便用户操作；对“蜘蛛”而言，能够清楚的了解网站结构，同时还增加了大量的内部链接，方便抓取，降低跳出率。

（4）网站的结构布局---不可忽略的细节

页面头部：logo及主导航，以及用户的信息。

页面主体：左边正文，包括面包屑导航及正文；右边放热门文章及相关文章，好处：留住访客，让访客多停留，对“蜘蛛”而言，这些文章属于相关链接，增强了页面相关性，也能增强页面的权重。

页面底部：版权信息和友情链接。

特别注意：分页导航写法，推荐写法：“首页 1 2 3 4 5 6 7 8 9 下拉框”，这样“蜘蛛”能够根据相应页码直接跳转，下拉框直接选择页面跳转。而下面的写法是不推荐的，“首页 下一页 尾页”，特别是当分页数量特别多时，“蜘蛛”需要经过很多次往下爬，才能抓取，会很累、会容易放弃。

（5）利用布局，把重要内容HTML代码放在最前

搜索引擎抓取HTML内容是从上到下，利用这一特点，可以让主要代码优先读取，广告等不重要代码放在下边。例如，在左栏和右栏的代码不变的情况下，只需改一下样式，利用float:left;和float:right;就可以随意让两栏在展现上位置互换，这样就可以保证重要代码在最前，让爬虫最先抓取。同样也适用于多栏的情况。

（6）控制页面的大小，减少http请求，提高网站的加载速度。

一个页面最好不要超过100k，太大，页面加载速度慢。当速度很慢时，用户体验不好，留不住访客，并且一旦超时，“蜘蛛”也会离开。

2、网页代码优化

（1）突出重要内容---合理的设计title、description和keywords

标题：只强调重点即可，尽量把重要的关键词放在前面，关键词不要重复出现，尽量做到每个页面的`title`标题中不要设置相同的内容。 标签：关键词，列举出几个页面的重要关键字即可，切记过分堆砌。

标签：网页描述，需要高度概括网页内容，切记不能太长，过分堆砌关键词，每个页面也要有所不同。

（2）语义化书写HTML代码，符合W3C标准

尽量让代码语义化，在适当的位置使用适当的标签，用正确的标签做正确的事。让阅读源码者和“蜘蛛”都一目了然。比如：h1-h6 是用于标题类的，

标签是用来设置页面主导航，列表形式的代码使用ul或ol，重要的文字使用strong等。

（3）标签：页内链接，要加 “title” 属性加以说明，让访客和 “蜘蛛” 知道。而外部链接，链接到其他网站的，则需要加上 el="nofollow" 属性, 告诉 “蜘蛛” 不要爬，因为一旦“蜘蛛”爬了外部链接之后，就不会再回来了。

==`<a href="https://www.360.cn" title="360安全中心" class="logo"></a>`== 

（4）正文标题要用标签：h1标签自带权重“蜘蛛” 认为它最重要，一个页面有且最多只能有一个H1标签，放在该页面最重要的标题上面，如首页的logo上可以加H1标签。副标题用标签, 而其它地方不应该随便乱用 h 标题标签。

（5）应使用 "alt" 属性加以说明当网络速度很慢，或者图片地址失效的时候，就可以体现出alt属性的作用，他可以让用户在图片没有显示的时候知道这个图片的作用。同时为图片设置高度和宽度，可提高页面的加载速度。

（6）表格应该使用表格标题标签caption 元素定义表格标题。caption 标签必须紧随 table 标签之后，您只能对每个表格定义一个表格标题                           

（7） 标签：只用于文本内容的换行，比如：      第一行文字内容     第二行文字内容     第三行文字内容  

（8）标签 ：需要强调时使用。动态地址：`www.360.cn/index.php`

伪静态地址：`www.360.cn/index.html`

结束语：正确认识SEO，不过分SEO，网站还是以内容为主。
