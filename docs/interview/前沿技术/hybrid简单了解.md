技术点总有它的来由。文中例子参考[Jockeyjs.js](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ftcoulter%2Fjockeyjs%2Fblob%2Fmaster%2FJockeyJS%2Fjs%2Fjockey.js "https://github.com/tcoulter/jockeyjs/blob/master/JockeyJS/js/jockey.js")容易理解一点。

文章概要：

-   1.hybrid 基本概念
-   2.前端和客户端的交互
-   3.前端和客户端的交互实现
-   4.前端交互实现关注点
-   5.小结

## 1.hybrid 基本概念

### 1.1什么是hybrid？

hybrid即“混合”，前端和客户端的混合开发模式，某些环节也可能涉及到 server 端。 hybrid 底层依赖于Native提供的容器**（WebView）**，上层使用html&css&JS做业务开发。

### 1.2webview是什么？

app中的一个组件，类似于小型浏览器内核。native提供的容器盒子，用于加载h5页面。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/21/16a409ce9927b838~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

图中表示了两种h5页面资源运用的方式

**①以静态资源打包到app内的方式。**

前端将代码提供给native，native客户端拿到前端静态页面，以文件形式存储在 app 中。这种模式，如果前端静态页面需要更新，客户端就需要去server端下载静态资源，即客户端每次打开需要去线上检查有无更新包有就下载压缩包，解压更新静态资源。

　优点：因为资源在本地，通过file 协议读取，读取速度非常快，且可以做到断网模式下页面合理的展示。

-   这样就涉及到了一个server端静态资源包管理系统。
-   同时H5的资源是静态的存储在native本地，以file的方式读取，那么H5向远端发起的请求就存在跨域，所以H5的请求需要经过native做一层代理转发。
-   静态资源越多native包就越大（所以这种模式更适用于，产品功能稳定，体验要求又高，且迭代频繁的场景）。

**②以线上url方式（更偏H5）**

　将资源部署在线上，native打开一个新的webview请求线上资源展示（同在浏览器中输入url,查看页面过程一致）

　优点：按需加载，用户使用到的页面才会更新，发请求可以不经过native做代理。

-   不可避免请求线上资源，都需要时间，所以会出现瞬间白屏（弱网模式特别明显）。
-   断网模式下没有内容显示。

**③两种模式资源加载**

**本地读取：过file 协议**

**线上读取：通过http或着https 请求加载资源**

### 1.3.hybrid存在的意义？

可以快速迭代开发更新。（无需app审核，哈哈因为对手机的操作权限不高，所以无需审核？）

hybrid开发效率高,低成本,跨平台,ios和安卓共用一套h5代码。(ios和安卓接口一致)

hybrid从业务开发上讲，没有版本问题，有BUG能及时修复（相对于app）。

## 2.前端和客户端的通讯

native提供的容器盒子，用于加载h5页面，那么h5的页面要怎么跟native交互？

前端和客户端的交互大概描述：

-   JS访问客户端的能力，传递参数和回调函数。
-   客户端通过回调函数返回内容。

****前端**的页面跟native交互，是通过******schema**协议。（事实上Native能捕捉webview发出的一切请求，这个协议的意义在于可以在浏览器中直接打开APP）**

### 2.1什么是schema协议？

大概描述 ：scheme是一种页面内跳转协议，通过定义自己的scheme协议，native 拦截这个请求，按需求处理，可以非常方便跳转app中的各个页面。

通过执行以下操作支持自定义URL方案：

-   定义应用程序**schema** URL的格式。
-   注册应用程序**schema** URL方案，以便系统将适当的URL定向到应用程序。
-   应用程序处理接收到的**schema**URL。

**一些URL Scheme**

**[www.zhihu.com/question/19…](https://link.juejin.cn/?target=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F19907735 "https://www.zhihu.com/question/19907735")**

**![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/21/16a409ce98ffb0f3~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)**

截取一段代码，代码来源：[github.com/tcoulter/jo…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ftcoulter%2Fjockeyjs%2Fblob%2Fmaster%2FJockeyJS%2Fjs%2Fjockey.js "https://github.com/tcoulter/jockeyjs/blob/master/JockeyJS/js/jockey.js")

```
// 这段代码主要功能是前端通过一个特殊的协议给客户端发消息，客户端拦截请求然后处理
dispatchMessage: function(type, envelope) {
    // We send the message by navigating the browser to a special URL.
    // The iOS library will catch the navigation, prevent the UIWebView
    // from continuing, and use the data in the URL to execute code
    // within the iOS app.

    var src = "jockey://" + type + "/" + envelope.id + "?" + encodeURIComponent(JSON.stringify(envelope));
    var iframe = document.createElement("iframe");
    iframe.setAttribute("src", src);
    document.documentElement.appendChild(iframe);
    iframe.parentNode.removeChild(iframe);
    iframe = null;
}复制代码
```

### 2.2.具体H5与Native通信，JS to native？

JS与Native通信一般都是创建这类URL被Native捕获处理。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/21/16a409ce9a5944d7~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

### 2.3.native到h5页面,native to JS？

native提供的容器盒子那么native，可否调用它提供的webview中window对象的方法了？

native 可以 调用之前跟前端约定好的挂载在window对象上面的方法。（具体实现了？）

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/21/16a409ce9fe307eb~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

[（图片来源点击）](https://link.juejin.cn/?target=https%3A%2F%2Fblog.csdn.net%2Fgongch0604%2Farticle%2Fdetails%2F80510005 "https://blog.csdn.net/gongch0604/article/details/80510005")

```
/ Send an event to JavaScript, passing a payload.
// payload can be an NSDictionary or NSArray, or anything that is serializable to JSON.
// It can be nil.
[Jockey send:@"event-name" withPayload:payload toWebView:webView];

// If you want to send an event and also execute code within the iOS app when all
// JavaScript listeners have finished processing.
[Jockey send:@"event-name" withPayload:payload toWebView:webView perform:^{
  // Respond to callback.
}];复制代码
```

## 3.前端和客户端的交互实现

前端与Native两种交互形式：

① URL Schema（前端先定义对象，以及交互方法）

② 客户端定义对象，注入全局变量（Android本身就支持类似的实现,所以此处讨论ios的JavaScriptCore ）

JavaScriptCore是一个C++实现的开源项目。使用Apple提供的JavaScriptCore框架，可以在Objective-C或者基于C的程序中执行Javascript代码，也可以向JavaScript环境中插入一些自定义的对象。JavaScriptCore从iOS 7.0之后可以直接使用，资料：https://developer.apple.com/documentation/javascriptcore。

### 3.1URL Schema（前端先定义对象，以及交互方法）

```
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1">
    <title>Document</title>
</head>
<body>
    <button id="btn1">扫一扫</button>
    <script type="text/javascript">
        function send(type, payload,callback) {
            var envelope = {
                id: id,
                type: type,
                host: host,
                payload: payload
            };
            window.myapp.[envelop.id] = callback;
            var src = "myapp://"+envelope.id + "?" + encodeURIComponent(JSON.stringify(envelop));
            //告诉客户端此时调用的函数， 函数执行完成后，告诉h5执行window.myapp.[envelop.id]这个函数。　　　　　　　// host 加入使得客户端更容易控制是否响应和处理（毕竟app内可能有需求内嵌第三方页面）
            var iframe = document.createElement("iframe");
            iframe.setAttribute("src", src);
            document.documentElement.appendChild(iframe);
            iframe.parentNode.removeChild(iframe);
            iframe = null;
        }

        document.getElementById('btn1').addEventListener('click', function () {
            send("scan", {}, (payload) => {
                console.log("hi")
            })
        })
    </script>
</body>
</html>复制代码
```

通常代码实现会把send函数部分进行封装，前端只需要实现与native约定的功能函数。

```
getPort: function() {
    window.send("getPort", {}, (payload) => {

    });
},
login: function(args = {}) {
    window.send("login", args, (payload) => {

    });
},复制代码
```

### 3.2.客户端定义对象，注入全局变量（客户端注入全局变量，供h5使用）

```
// 页面调用了未声明方法，事实上是Native注入给window对象的。（native在本地实现了js方法并注入h5）
// 在页面加载完成前注入全局变量myapp，myapp下面的方法，即app提供的API方法
myapp.getPort(data, (payload) => {

});
myapp.login(data, (payload) => {

});复制代码
```

两种方式的区别，由客户端还是由h5预先定义对象，以及交互方法 。

## 4.前端交互实现关注点

代码来源：[github.com/tcoulter/jo…](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ftcoulter%2Fjockeyjs%2Fblob%2Fmaster%2FJockeyJS%2Fjs%2Fjockey.js "https://github.com/tcoulter/jockeyjs/blob/master/JockeyJS/js/jockey.js")（以下代码例子，以URL Schema方式为基础）

### 4.1.导航栏的设置

导航栏通常是native实现，有回按钮退防止页面假死，即页面卡死可以回退。

同时native需要提供API供h5进行简单的定制（比如有的需要关闭按钮，分享按钮，收藏按钮等）

```
setBarBack() {
    Jockey.send("setBarBack", {
        "bar": {
            "position": "left",
            "cliekEvent": "onBack",
        }
    });　
    // 取消监听onBack事件
    Jockey.off('onBack');
    // 监听onBack事件
    Jockey.on('onBack', () => {
        history.back()
    });
},复制代码
```

### 4.2.跳转是Hybrid必用API之一，对前端来说有以下跳转：

① H5跳转Native界面

② H5新开Webview跳转H5页面。

用native的方法来跳转，一般是为了做页面的动画切换。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/21/16a409cea27ed623~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

如图我们通常只会使用到导航栏下面部分，但我们关注页面的导航栏，H5端可以注册事件监听native的导航栏的事件（非必须）

### 4.3获取基本信息

在具备用户体系的模式下，H5页面能从native拿到基本的登录信息，Native本身就保存了用户信息，提供接口给h5使用。

```
function getInfo() {
    return new Promise((resolve, reject) => {
        Jockey.send("getInfo", {}, (payload) => {
        
        });
    });
},复制代码
```

### 4.4调用native原生具备的功能

相机，手机页面横屏显示或者竖屏显示等。

### 4.5关于调试

**Android：输入chrome://inspect/#devices即可（前提native打开了调试模式），当然Android也可以使用模拟器，但与Android的真机表现过于不一样，还是建议使用真机测试。**

**![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/21/16a409cedfe5cc3c~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)**

**iOS:需一台Mac机，然后打开safari，在偏好设置中将开发模式打开，然后点击打开safari浏览器，查看菜单栏开发菜单（前提native打开了调试模式）...**

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/21/16a409cf05288687~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

## 5.小结

文章只是一个对hybrid的简单了解，文中例子比较粗糙，理解不准确之处，还请教正。对于有兴趣深入了解Hybrid技术的设计与实现前端部分细节的可以看看参考资料~~

参考资料：

[www.cnblogs.com/yexiaochai/…](https://link.juejin.cn/?target=http%3A%2F%2Fwww.cnblogs.com%2Fyexiaochai%2Fp%2F4921635.html "http://www.cnblogs.com/yexiaochai/p/4921635.html")

[www.cnblogs.com/yexiaochai/…](https://link.juejin.cn/?target=http%3A%2F%2Fwww.cnblogs.com%2Fyexiaochai%2Fp%2F5524783.html "http://www.cnblogs.com/yexiaochai/p/5524783.html")

[www.cnblogs.com/yexiaochai/…](https://link.juejin.cn/?target=http%3A%2F%2Fwww.cnblogs.com%2Fyexiaochai%2Fp%2F5813248.html "http://www.cnblogs.com/yexiaochai/p/5813248.html")