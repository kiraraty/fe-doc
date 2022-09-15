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

HTML5 为什么只需要写 `<!DOCTYPE HTML>`

- `HTML5` 不基于 `SGML`，因此不需要对`DTD`进行引用，但是需要`doctype`来规范浏览器的行为
- 而`HTML4.01`基于`SGML`,所以需要对`DTD`进行引用，才能告知浏览器文档所使用的文档类型

```html
<!DOCTYPE html>
<html>
<head>
<style>

</style>
</head>
<body>

<h1>background 属性</h1>

<script></script>
</body>

</html>
```



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

#### 资源预加载 prefetch/preload

------

> 都是告知浏览器提前加载文件(图片、视频、js、css等)，但执行上是有区别的。

- `prefetch`：其利用浏览器空闲时间来下载或预取用户在不久的将来可能访问的文档。`<link href="/js/xx.js" rel="prefetch">`
- `preload` : 可以指明哪些资源是在页面加载完成后即刻需要的，浏览器在主渲染机制介入前就进行预加载，这一机制使得资源可以更早的得到加载并可用，且更不易阻塞页面的初步渲染，进而提升性能。 `<link href="/js/xxx.js" rel="preload" as="script">`需要 `as` 指定资源类型**目前可用的属性类型有如下**：

```text
audio: 音频文件。
document: 一个将要被嵌入到<frame>或<iframe>内部的HTML文档。
embed: 一个将要被嵌入到<embed>元素内部的资源。
fetch: 那些将要通过fetch和XHR请求来获取的资源，比如一个ArrayBuffer或JSON文件。
font: 字体文件。
image: 图片文件。
object: 一个将会被嵌入到<embed>元素内的文件。
script: JavaScript文件。
style: 样式表。
track: WebVTT文件。
worker: 一个JavaScript的web worker或shared worker。
video: 视频文件。 
```

### 6.script标签中defer与async的区别

如果没有defer或async属性，浏览器会立即加载并执行相应的脚本。它不会等待后续加载的文档元素，读取到就会开始加载和执行，这样就阻塞了后续文档的加载。

下图可以直观的看出三者之间的区别:

<img src="https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsesdfD6zRcFYknxX.png" style="zoom:150%;" />

其中蓝色代表js脚本**网络加载时间**，红色代表js脚本**执行时间**，绿色代表html解析。

**defer 和 async属性都是去异步加载外部的JS脚本文件，它们都不会阻塞页面的解析**，其区别如下：

- **执行顺序：** 多个带async属性的标签，不能保证加载的顺序；多个带defer属性的标签，按照加载顺序执行；
- **脚本是否并行执行：async属性，表示后续文档的加载和执行与js脚本的加载和执行是并行进行的**，即异步执行；defer属性，加载后续文档的过程和js脚本的加载(此时仅加载不执行)是并行进行的(异步)，js脚本需要等到文档所有元素解析完成之后才执行，DOMContentLoaded事件触发执行之前。

### 7.offset、scroll、client的区别

------

**client**:

- `oEvent.clientX`是指鼠标到可视区左边框的距离。
- `oEvent.clientY`是指鼠标到可视区上边框的距离。
- `clientWidth`是指可视区的宽度。
- `clientHeight`是指可视区的高度。
- `clientLeft`获取左边框的宽度。
- `clientTop`获取上边框的宽度。

**offset**:

- `offsetWidth`是指div的宽度（包括div的边框）
- `offsetHeight`是指div的高度（包括div的边框）
- `offsetLeft`是指div到整个页面左边框的距离（不包括div的边框）
- `offsetTop`是指div到整个页面上边框的距离（不包括div的边框）

**scroll**:

- `scrollTop`是指可视区顶部边框与整个页面上部边框的看不到的区域。
- `scrollLeft`是指可视区左边边框与整个页面左边边框的看不到的区域。
- `scrollWidth`是指左边看不到的区域加可视区加右边看不到的区域即整个页面的宽度（包括边框）
- `scrollHeight`是指上边看不到的区域加可视区加右边看不到的区域即整个页面的高度（包括边框）

### 8.`<img>`的`title`和`alt`有什么区别

- 通常当鼠标滑动到元素上的时候显示
- `alt`是`<img>`的特有属性，是图片内容的等价描述，用于图片无法加载时显示、读屏器阅读图片。可提图片高可访问性，除了纯装饰图片外都必须设置有意义的值，搜索引擎会重点分析。

### 9.iframe的使用

#### iframe基础

- 通常我们使用iframe直接直接在页面嵌套iframe标签指定src就可以了。

```xml
<iframe src="demo_iframe_sandbox.htm"></iframe>
```

- frame中还可以设置些什么属性

> iframe常用属性:
> 1.frameborder:是否显示边框，1(yes),0(no)
> 2.height:框架作为一个普通元素的高度，建议在使用css设置。
> 3.width:框架作为一个普通元素的宽度，建议使用css设置。
> 4.name:框架的名称，window.frames[name]时专用的属性。
> 5.scrolling:框架的是否滚动。yes,no,auto。
> 6.src：内框架的地址，可以使页面地址，也可以是图片的地址。
> 7.srcdoc , 用来替代原来HTML body里面的内容。但是IE不支持, 不过也没什么卵用
> 8.sandbox: 对iframe进行一些列限制，IE10+支持

- `iframe`会阻塞主页面的`Onload`事件
- 搜索引擎的检索程序无法解读这种页面，不利于`SEO`
- `iframe`和主页面共享连接池，而浏览器对相同域的连接有限制，所以会影响页面的并行加载
- 使用`iframe`之前需要考虑这两个缺点。如果需要使用`iframe`，最好是通过`javascript`动态给`iframe`添加`src`属性值，这样可以绕开以上两个问题

我们通常使用iframe最基本的特性，就是能自由操作iframe和父框架的内容(DOM). 但前提条件是同域. 如果跨域顶多只能实现页面跳转window.location.href.
那什么是同域/ 什么是跨域呢?
就是判断你的url首部是否一样，下面会有讲解，这里只是提及。
同域不同域的问题:

```jsx
A:<iframe id="mainIframe" name="mainIframe" src="/main.html" frameborder="0" scrolling="auto" ></iframe>
B:<iframe id="mainIframe" name="mainIframe" src="http://www.baidu.com" frameborder="0" scrolling="auto" ></iframe>
```

> 使用A时，因为同域，父页面可以对子页面进行改写,反之亦然。
> 使用B时，不同域，父页面没有权限改动子页面,但可以实现页面的跳转

**主页面和iframe同域时，我们可以干些什么。**

##### 获取iframe里的内容

主要的两个API就是contentWindow,和contentDocument
iframe.contentWindow, 获取iframe的window对象
iframe.contentDocument, 获取iframe的document对象
这两个API只是DOM节点提供的方式(即getELement系列对象)

```jsx
var iframe = document.getElementById("iframe1");
var iwindow = iframe.contentWindow;
var idoc = iwindow.document;
       console.log("window",iwindow);//获取iframe的window对象
       console.log("document",idoc);  //获取iframe的document
       console.log("html",idoc.documentElement);//获取iframe的html
       console.log("head",idoc.head);  //获取head
       console.log("body",idoc.body);  //获取body
```

另外更简单的方式是，结合Name属性，通过window提供的frames获取.



```xml
<iframe src ="/index.html" id="ifr1" name="ifr1" scrolling="yes">
  <p>Your browser does not support iframes.</p>
</iframe>

<script type="text/javascript">
    console.log(window.frames['ifr1'].window);
    console.dir(document.getElementById("ifr1").contentWindow);
</script>
```

> 其实window.frames['ifr1']返回的就是window对象，即
> window.frames['ifr1']===window
> 这里就看你想用哪一种方式获取window对象，两者都行，不过本人更倾向于第二种使用frames[xxx].因为，字母少啊~ 然后，你就可以操控iframe里面的DOM内容。

##### 在iframe中获取父级内容

同理，在同域下，父页面可以获取子iframe的内容，那么子iframe同样也能操作父页面内容。在iframe中，可以通过在window上挂载的几个API进行获取.

> window.parent 获取上一级的window对象，如果还是iframe则是该iframe的window对象
> window.top 获取最顶级容器的window对象，即，就是你打开页面的文档
> window.self 返回自身window的引用。可以理解 window===window.self(脑残)

#### iframe长轮询

如果写过ajax的童鞋，应该知道，长轮询就是在ajax的readyState = 4的时，再次执行原函数即可。 这里使用iframe也是一样，异步创建iframe，然后reload, 和后台协商好, 看后台哥哥们将返回的信息放在,然后获取里面信息即可. 这里是直接放在body里.

```jsx
var iframeCon = docuemnt.querySelector('#container'),
        text; //传递的信息
    var iframe = document.createElement('iframe'),
        iframe.id = "frame",
        iframe.style = "display:none;",
        iframe.name="polling",
        iframe.src="target.html";
    iframeCon.appendChild(iframe);
    iframe.οnlοad= function(){
        var iloc = iframe.contentWindow.location,
            idoc  = iframe.contentDocument;
        setTimeout(function(){
            text = idoc.getElementsByTagName('body')[0].textContent;
            console.log(text);
            iloc.reload(); //刷新页面,再次获取信息，并且会触发onload函数
        },2000);
    }
```

这样就可以实现ajax的长轮询的效果。 当然，这里只是使用reload进行获取，你也可以添加iframe和删除iframe的方式，进行发送信息，这些都是根据具体场景应用的。另外在iframe中还可以实现异步加载js文件，不过，iframe和主页是共享连接池的，所以还是很蛋疼的，现在基本上都被XHR和hard calllback取缔了，这里也不过多介绍了。

#### 自适应iframe广告

网页为了赚钱，引入广告是很正常的事了。通常的做法就是使用iframe，引入广告地址就可以了，然后根据广告内容设置相应的显示框。但是，为什么是使用iframe来进行设置，而不是在某个div下嵌套就行了呢？
要知道，广告是与原文无关的，这样硬编码进去，会造成网页布局的紊乱,而且,这样势必需要引入额外的css和js文件，极大的降低了网页的安全性。 这些所有的弊端，都可以使用iframe进行解决。
我们通常可以将iframe理解为一个沙盒，里面的内容能够被top window 完全控制，而且，主页的css样式是不会入侵iframe里面的样式，这些都给iframe的广告命运埋下伏笔。可以看一下各大站点是否都在某处放了些广告，以维持生计比如:W3School
但，默认情况下，iframe是不适合做展示信息的，所以我们需要对其进行decorate.

#### 自适应iframe

认情况下，iframe会自带滚动条，不会全屏.如果你想自适应iframe的话:第一步：去掉滚动条

```xml
<iframe src="./iframe1.html" id="iframe1" scrolling="no"></iframe>
```

第二步,设置iframe的高为body的高

```dart
var iwindow = iframe.contentWindow;
var idoc = iwindow.document;
iframe.height = idoc.body.offsetHeight;
```

另外,还可以添加其它的装饰属性:

| 属性              | 效果                                                |
| ----------------- | --------------------------------------------------- |
| allowtransparency | true or false 是否允许iframe设置为透明，默认为false |
| allowfullscreen   | true or false 是否允许iframe全屏，默认为false       |

例子:

```xml
<iframe id="google_ads_frame2" name="google_ads_frame2" width="160" height="600" frameborder="0" src="target.html" marginwidth="0" marginheight="0" vspace="0" hspace="0" allowtransparency="true" scrolling="no" allowfullscreen="true"></iframe>
```

你可以直接写在内联里面，也可以在css里面定义，不过对于广告iframe来说，样式写在属性中，是best pratice

#### iframe安全性问题

iframe出现安全性有两个方面，一个是你的网页被别人iframe,一个是你iframe别人的网页。 当你的网页被别人iframe时，比较蛋疼的是被钓鱼网站利用，然后victim+s留言逼逼你。真.简直了。 所以为了防止页面被一些不法分子利用，我们需要做好安全性措施。

##### 防嵌套网页

比如，最出名的clickhacking就是使用iframe来 拦截click事件。因为iframe享有着click的最优先权，当有人在伪造的主页中进行点击的话，如果点在iframe上，则会默认是在操作iframe的页面。 所以，钓鱼网站就是使用这个技术，通过诱导用户进行点击，比如，设计一个"妹妹寂寞了"等之类的网页，诱导用户点击，但实际结果，你看到的不是"妹妹",而是被恶意微博吸粉。
所以，为了防止网站被钓鱼，可以使用window.top来防止你的网页被iframe.

```dart
//iframe2.html
if(window != window.top){
 window.top.location.href = correctURL;
}
```

这段代码的主要用途是限定你的网页不能嵌套在任意网页内。如果你想引用同域的框架的话，可以判断域名。

```dart
if (top.location.host != window.location.host) {
　　top.location.href = window.location.href;
}
```

当然，如果你网页不同域名的话，上述就会报错。
所以，这里可以使用try...catch...进行错误捕获。如果发生错误，则说明不同域，表示你的页面被盗用了。可能有些浏览器这样写是不会报错，所以需要降级处理。
这时候再进行跳转即可.



```dart
try{
　　top.location.hostname;  //检测是否出错
　　//如果没有出错，则降级处理
　　if (top.location.hostname != window.location.hostname) { 
　　　　top.location.href =window.location.href;
　　}
}
catch(e){
　　top.location.href = window.location.href;
}
```

这只是浏览器端，对iframe页面的权限做出相关的设置。 我们还可以在服务器上，对使用iframe的权限进行设置.

##### X-Frame-Options

X-Frame-Options是一个相应头，主要是描述服务器的网页资源的iframe权限。目前的支持度是IE8+(已经很好了啊喂)有3个选项:

> DENY：当前页面不能被嵌套iframe里，即便是在相同域名的页面中嵌套也不允许,也不允许网页中有嵌套iframe
> SAMEORIGIN：iframe页面的地址只能为同源域名下的页面
> ALLOW-FROM：可以在指定的origin url的iframe中加载
> X-Frame-Options: DENY
> 拒绝任何iframe的嵌套请求
> X-Frame-Options: SAMEORIGIN
> 只允许同源请求，例如网页为 foo.com/123.php，則 foo.com 底下的所有网页可以嵌入此网页，但是 foo.com 以外的网页不能嵌入
> X-Frame-Options: ALLOW-FROM [http://s3131212.com](https://links.jianshu.com/go?to=http%3A%2F%2Fs3131212.com)
> 只允许指定网页的iframe请求，不过兼容性较差Chrome不支持
> X-Frame-Options其实就是将前端js对iframe的把控交给服务器来进行处理。

```dart
//js
if(window != window.top){
    window.top.location.href = window.location.href;
}
//等价于
X-Frame-Options: DENY
//js
if (top.location.hostname != window.location.hostname) { 
　　　　top.location.href =window.location.href;
}
//等价于
X-Frame-Options: SAMEORIGIN
```

该属性是对页面的iframe进行一个主要限制，不过，涉及iframe的header可不止这一个，另外还有一个Content Security Policy, 他同样也可以对iframe进行限制，而且，他应该是以后网页安全防护的主流。

##### CSP之页面防护

和X-Frames-Options一样，都需要在服务器端设置好相关的Header. CSP 的作用， 真的是太大了，他能够极大的防止你的页面被XSS攻击，而且可以制定js,css,img等相关资源的origin，防止被恶意注入。不过他的兼容性，也是渣的一逼。目前支持Edge12+ 以及 IE10+。
而且目前市面上，流行的是3种CSP头，以及各种浏览器的兼容性

使用主要是在后端服务器上配置，在前端，我们可以观察Response Header 里是否有这样的一个Header:

Content-Security-Policy: default-src 'self'
这就表明，你的网页是启用CSP的。通常我们可以在CSP后配置各种指定资源路径，有

```csharp
 default-src,
script-src,
style-src,
img-src,
connect-src,
font-src,
object-src,
media-src,
sandbox,
child-src,
...
```

如果你未指定的话，则是使用default-src规定的加载策略.
默认配置就是同域: default-src "self".
这里和iframe有一点瓜葛的就是 child-src 和 sandbox.
child-src就是用来指定iframe的有效加载路径。其实和X-Frame-Options中配置allow-origin是一个道理。不过,allow-origin 没有得到厂商们的支持。
而，sandbox其实就和iframe的sandbox属性（下文介绍）,是一样一样的，他可以规定来源能够带有什么权限.
来个demo:

```csharp
Content-Security-Policy: child-src 'self' http://example.com; sandbox allow-forms allow-same-origin
```

此时，iframe的src就只能加载同域和example.com页面。 最后再补充一点: 使用CSP 能够很好的防止XSS攻击，原理就是CSP会默认escape掉内联样式和脚本，以及eval执行。但是，你可以使用srcipt-src进行降低限制.

```bash
Content-Security-Policy: script-src 'unsafe-inline'
```

如果想更深入的了解CSP,可以参阅:CSP,中文CSP,H5rock之CSP
ok, 上面基本上就是防止自己页面被嵌套而做的一些安全防护工作。 当然，我们面临的安全问题还有一个，就是当iframe别人的页面时，我们需要对其进行安全设限，虽然，跨域时iframe的安全性会大很多，但是，互联网是没有安全的地方。在以前，我们会进行各种trick来防止自己的页面被污染，现在h5提供的一个新属性sandbox可以很好的解决这个问题。

##### sandbox

> sandbox就是用来给指定iframe设置一个沙盒模型限制iframe的更多权限.
> sandbox是h5的一个新属性,IE10+支持(md~).
> 启用方式就是使用sandbox属性:

```xml
 <iframe sandbox src="..."></iframe>
```

这样会对iframe页面进行一系列的限制:

> 1. script脚本不能执行
> 2. 不能发送ajax请求
> 3. 不能使用本地存储，即localStorage,cookie等
> 4. 不能创建新的弹窗和window
> 5. 不能发送表单
> 6. 不能加载额外插件比如flash等

看到这里，我也是醉了。 好好的一个iframe，你这样是不是有点过分了。 不过，你可以放宽一点权限。在sandbox里面进行一些简单设置

```xml
<iframe sandbox="allow-same-origin" src="..."></iframe>
```

常用的配置项有:

| 配置                 | 效果                                                    |
| -------------------- | ------------------------------------------------------- |
| allow-forms          | 允许进行提交表单                                        |
| allow-scripts        | 运行执行脚本                                            |
| allow-same-origin    | 允许同域请求,比如ajax,storage                           |
| allow-top-navigation | 允许iframe能够主导window.top进行页面跳转                |
| allow-popups         | 允许iframe中弹出新窗口,比如,window.open,target="_blank" |
| allow-pointer-lock   | 在iframe中可以锁定鼠标，主要和鼠标锁定有关              |

可以通过在sandbox里，添加允许进行的权限.



```xml
<iframe sandbox="allow-forms allow-same-origin allow-scripts" src="..."></iframe>
```

这样，就可以保证js脚本的执行，但是禁止iframe里的javascript执行top.location = self.location。
哎，其实，iframe的安全问题还是超级有的。比如location劫持，Refers检查等。 不过目前而言，知道怎么简单的做一些安全措施就over了，白帽子们会帮我们测试的。

##### resolve iframe跨域

iframe就是一个隔离沙盒，相当于我们在一个页面内可以操控很多个标签页一样。如果踩坑的童鞋应该知道，iframe的解决跨域也是很有套套的。
首先我们需要明确什么是跨域。
浏览器判断你跨没跨域，主要根据两个点。 一个是你网页的协议(protocol)，一个就是你的host是否相同，即，就是url的首部:

window.location.protocol +window.location.host
需要强调的是，url首部必须一样，比如:二级域名或者IP地址，都算是跨域.

> 域名和域名对应ip, 跨域
> [http://www.a.com/a.js](https://links.jianshu.com/go?to=http%3A%2F%2Fwww.a.com%2Fa.js)
> [http://70.32.92.74/b.js](https://links.jianshu.com/go?to=http%3A%2F%2F70.32.92.74%2Fb.js)
> //统一域名，不同二级域名。 跨域
> [http://www.a.com/a.js](https://links.jianshu.com/go?to=http%3A%2F%2Fwww.a.com%2Fa.js)
> [http://a.com/b.js](https://links.jianshu.com/go?to=http%3A%2F%2Fa.com%2Fb.js)

对于第二种方式的跨域（主域相同而子域不同）,可以使用iframe进行解决。
在两个不同子域下(某一方使用iframe嵌套在另一方)，
即:
[http://www.foo.com/a.html](https://links.jianshu.com/go?to=http%3A%2F%2Fwww.foo.com%2Fa.html)和[http://script.foo.com/b.html](https://links.jianshu.com/go?to=http%3A%2F%2Fscript.foo.com%2Fb.html)
两个文件中分别加上document.domain = ‘foo.com’,指定相同的主域，然后,两个文档就可以进行交互。



```jsx
//b.html是以iframe的形式嵌套在a.html中
//www.foo.com上的a.html
document.domain = 'foo.com';
var ifr = document.createElement('iframe');
ifr.src = 'http://script.foo.com/b.html';
ifr.style.display = 'none';
document.body.appendChild(ifr);
ifr.onload = function(){
    var doc = ifr.contentDocument || ifr.contentWindow.document;
    // 在这里操纵b.html
    alert(doc.getElementsByTagName("h1")[0].childNodes[0].nodeValue);
};
//script.foo.com上的b.html
document.domain = 'foo.com';
```

默认情况下document.domain 是指window.location.hostname. 你可以手动更改，但是最多只能设置为主域名。 通常，主域名就是指不带www的hostname, 比如: [foo.com](https://links.jianshu.com/go?to=http%3A%2F%2Ffoo.com) , [baidu.com](https://links.jianshu.com/go?to=http%3A%2F%2Fbaidu.com) 。 如果，带上www或者其他的前缀，就是二级域名或者多级域名。通过上述设置，相同的domain之后，就可以进行同域的相关操作。另外还可以使用iframe和location.hash，不过由于技术out了，这里就不做介绍了。

##### H5的CDM跨域与iframe

如果你设置的iframe的域名和你top window的域名完全不同。 则可以使用CDM(cross document messaging)进行跨域消息的传递。该API的兼容性较好 ie8+都支持.
发送消息: 使用postmessage方法
接受消息: 监听message事件

##### postmessage

该方法挂载到window对象上，即，使用window.postmessage()调用.
该方法接受两个参数:postMessage(message, targetOrigin):
message: 就是传递给iframe的内容, 通常是string,如果你想传object对象也可以。不过使用前请参考这一句话:

Objects listed in transfer are transferred, not just cloned, meaning that they are no longer usable on the sending side.
意思就是，希望亲爱的不要直接传Object。 如果有条件，可以使用是JSON.stringify进行转化。这样能保证不会出bug.
targetOrigin: 接受你传递消息的域名，可以设置绝对路径，也可以设置""或者"/"。 表示任意域名都行，"/"表示只能传递给同域域名。

来个栗子:

```jsx
<iframe src="http://tuhao.com" name="sendMessage"></iframe>
//当前脚本
let ifr = window.frames['sendMessage'];
   //使用iframe的window向iframe发送message。
ifr.postmessage('give u a message', "http://tuhao.com");
//tuhao.com的脚本
window.addEventListener('message', receiver, false);
function receiver(e) {
    if (e.origin == 'http://tuhao.com') {
        if (e.data == 'give u a message') {
            e.source.postMessage('received', e.origin);  //向原网页返回信息
        } else {
            alert(e.data);
        }
    }
}
```

当targetOrigin接受到message消息之后,会触发message事件。 message提供的event对象上有3个重要的属性，data,origin,source.

> data：postMessage传递进来的值
> origin：发送消息的文档所在的域
> source：发送消息文档的window对象的代理，如果是来自同一个域，则该对象就是window，可以使用其所有方法，如果是不同的域，则window只能调用postMessage()方法返回信息


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

**浏览器是怎么对`HTML5`的离线储存资源进行管理和加载的呢**

- 在线的情况下，浏览器发现`html`头部有`manifest`属性，它会请求`manifest`文件，如果是第一次访问`app`，那么浏览器就会根据manifest文件的内容下载相应的资源并且进行离线存储。如果已经访问过`app`并且资源已经离线存储了，那么浏览器就会使用离线的资源加载页面，然后浏览器会对比新的`manifest`文件与旧的`manifest`文件，如果文件没有发生改变，就不做任何操作，如果文件改变了，那么就会重新下载文件中的资源并进行离线存储。
- 离线的情况下，浏览器就直接使用离线存储的资源。

### 12.drag API

一个典型的拖放操作是这样的：用户选中一个**可拖拽的(draggable)** 元素，并将其拖拽（鼠标不放开）到一个**可放置的(droppable)** 元素，然后释放鼠标。

1. 可以通过给标签设置`draggable`属性来实现元素的拖拽，`img和a标签`默认是可以拖拽的
2. 拖拽者身上的三个事件：`ondragstart`、`ondrag`、`ondragend`
3. 拖拽要放到的元素：`ondragenter`、`ondragover`、`ondragleave`、`ondrap`

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

- 移除的元素：
    - 纯表现的元素：`basefont`、`big`、`center`、`font`、 `s`、`strike`、`tt`、`u`
    - 对可用性产生负面影响的元素：`frame`、`frameset`、`noframes`
- 支持`HTML5`新标签：
    - `IE8/IE7/IE6`支持通过`document.createElement`方法产生的标签
    - 可以利用这一特性让这些浏览器支持`HTML5`新标签
    - 浏览器支持新标签后，还需要添加标签默认的样式
- 当然也可以直接使用成熟的框架、比如`html5shim`

### 14.SEO的概念以及如何实现

#### 一、搜索引擎工作原理

在搜索引擎网站的后台会有一个非常庞大的数据库，里面存储了海量的关键词，而每个关键词又对应着很多网址，这些网址是被称之为“搜索引擎蜘蛛”或“网络爬虫”程序从茫茫的互联网上一点一点下载收集而来的。随着各种各样网站的出现，这些勤劳的“蜘蛛”每天在互联网上爬行，从一个链接到另一个链接，下载其中的内容，进行分析提炼，找到其中的关键词，如果“蜘蛛”认为关键词在数据库中没有而对用户是有用的便存入后台的数据库中。反之，如果“蜘蛛”认为是垃圾信息或重复信息，就舍弃不要，继续爬行，寻找最新的、有用的信息保存起来提供用户搜索。当用户搜索时，就能检索出与关键字相关的网址显示给访客。

一个关键词对用多个网址，因此就出现了排序的问题，相应的当与关键词最吻合的网址就会排在前面了。在“蜘蛛”抓取网页内容，提炼关键词的这个过程中，就存在一个问题：“蜘蛛”能否看懂。如果网站内容是flash和js等，那么它是看不懂的，会犯迷糊，即使关键字再贴切也没用。相应的，如果网站内容可以被搜索引擎能识别，那么搜索引擎就会提高该网站的权重，增加对该网站的友好度。这样一个过程我们称之为SEO。

#### 二、SEO简介

SEO(Search Engine Optimization)，即搜索引擎优化。SEO是随着搜索引擎的出现而来的，两者是相互促进，互利共生的关系。SEO的存在就是为了提升网页在搜索引擎自然搜索结果中的收录数量以及排序位置而做的优化行为。而优化的目的就是为了提升网站在搜索引擎中的权重，增加对搜索引擎的友好度，使得用户在访问网站时能排在前面。

分类：白帽SEO和黑帽SEO。白帽SEO，起到了改良和规范网站设计的作用，使网站对搜索引擎和用户更加友好，并且网站也能从搜索引擎中获取合理的流量，这是搜索引擎鼓励和支持的。黑帽SEO，利用和放大搜索引擎政策缺陷来获取更多用户的访问量，这类行为大多是欺骗搜索引擎，一般搜索引擎公司是不支持与鼓励的。本文针对白帽SEO，那么白帽SEO能做什么呢？

1.对网站的标题、关键字、描述精心设置，反映网站的定位，让搜索引擎明白网站是做什么的；

2.网站内容优化：内容与关键字的对应，增加关键字的密度；

3.在网站上合理设置Robots.txt文件；

4.生成针对搜索引擎友好的网站地图；

5.增加外部链接，到各个网站上宣传。

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

导航应该尽量采用文字方式，也可以搭配图片导航，但是图片代码一定要进行优化，标签必须添加“alt”和“title”属性，告诉搜索引擎导航的定位，做到即使图片未能正常显示时，用户也能看到提示文字。

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

### 15.HTML渲染优化

- 禁止使用`iframe`（阻塞父文档`onload`事件）
    - `iframe`会阻塞主页面的`Onload`事件
    - 搜索引擎的检索程序无法解读这种页面，不利于SEO
    - `iframe`和主页面共享连接池，而浏览器对相同域的连接有限制，所以会影响页面的并行加载
    - 使用`iframe`之前需要考虑这两个缺点。如果需要使用`iframe`，最好是通过`javascript`
    - 动态给`iframe`添加`src`属性值，这样可以绕开以上两个问题
- 禁止使用`gif`图片实现`loading`效果（降低`CPU`消耗，提升渲染性能）
- 使用`CSS3`代码代替`JS`动画（尽可能避免重绘重排以及回流）
- 对于一些小图标，可以使用base64位编码，以减少网络请求。但不建议大图使用，比较耗费`CPU`
    - 小图标优势在于
        - 减少`HTTP`请求
        - 避免文件跨域
        - 修改及时生效
- 页面头部的`<style></style>` `<script></script>` 会阻塞页面；（因为 `Renderer`进程中 `JS`线程和渲染线程是互斥的）
- 页面中空的 `href` 和 `src` 会阻塞页面其他资源的加载 (阻塞下载进程)
- 网页`gzip`，`CDN`托管，`data`缓存 ，图片服务器
- 前端模板 JS+数据，减少由于`HTML`标签导致的带宽浪费，前端用变量保存AJAX请求结果，每次操作本地变量，不用请求，减少请求次数
- 用`innerHTML`代替`DOM`操作，减少`DOM`操作次数，优化`javascript`性能
- 当需要设置的样式很多时设置`className`而不是直接操作`style`
- 少用全局变量、缓存`DOM`节点查找的结果。减少`IO`读取操作
- 图片预加载，将样式表放在顶部，将脚本放在底部 加上时间戳
- 对普通的网站有一个统一的思路，就是尽量向前端优化、减少数据库操作、减少磁盘`IO`
