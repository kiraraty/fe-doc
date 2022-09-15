   

[![](https://p3-passport.byteimg.com/img/user-avatar/2f1121c7a51da903bef8e69205671785~100x100.awebp)](https://juejin.cn/user/3403743730867767)

2022年02月10日 14:41 ·  阅读 2583

![移动端开发必备知识-Hybrid App](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/643ddb35fff04912a542e90c04a6551e~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?)  

「这是我参与2022首次更文挑战的第3天，活动详情查看：[2022首次更文挑战](https://juejin.cn/post/7052884569032392740 "https://juejin.cn/post/7052884569032392740")」

## 简介

面试的时候小伙伴们有没有被问到过`Hybrid App`呢？不得不说了解`Hybrid App`是我们前端面试中的一个加分项。今天就跟随笔者的步伐让你彻底弄懂`Hybrid App`，让你就算没做过也能对面试官的问题应答自如。

前面笔者已经介绍了 [移动端H5网页开发必备知识](https://juejin.cn/post/7055267089895915527 "https://juejin.cn/post/7055267089895915527")和[移动端H5网页开发常见问题汇总](https://juejin.cn/post/7055599228478816270 "https://juejin.cn/post/7055599228478816270")两篇文章，感兴趣的同学可以看一看。今天这篇文章主要是介绍Hybrid App以及H5页面是怎么和App通信的。

## APP的种类

看到这好奇宝宝肯定就要问了，什么是Hybrid App呢？别急，接下来容笔者一一介绍。

App目前主要分为三类，分为Web App、Hybrid App、 Native App。

### Web App

`Web App`即移动端的网站，将页面部署在服务器上，然后用户使用各大浏览器访问，不是独立APP，无法安装和发布。[手机淘宝](https://link.juejin.cn/?target=https%3A%2F%2Fmain.m.taobao.com%2F "https://main.m.taobao.com/")就是一个最常见的Web App。

#### 优点：

1.  开发成本低，可以跨平台，调试方便。
2.  维护成本低 更新无需通知用户，不需要手动升级 无需安装App，不会占用手机内存。

#### 缺点：

1.  无法获取系统级别的通知，提醒，动效等等。
2.  用户留存率低 设计受限制诸多 体验较差。

### Native App

`Native App`就是我们常说的原生App啦，分为Android开发和IOS开发。Android基于Java语言，底层调用Goolge提供的API，IOS基于Objective c或Swift，底层调用Apple官方提供的Api。

#### 优点：

1.  直接依托于操作系统,交互性最强,性能最好。
2.  功能最为强大,特别是在与系统交互中,几乎所有功能都能实现。

#### 缺点

1.  开发成本高，无法跨平台，不同平台Android和iOS上都要各自独立开发。
2.  门槛较高，原生人员有一定的入门门槛，相比广大的前端人员而言较少。更新缓慢，特别是发布应用商店后，需要等到审核周期。维护成本高。

### Hybrid App

接下来就是今天的主角啦，`Hybrid App(混合应用程序)`，主要原理就是将 APP 的一部分需要动态变动的内容通过 H5 来实现，通过原生的网页加载控件 WebView (Android)或 WKWebView（iOS）来加载H5页面（以后若无特殊说明，我们用 WebView 来统一指代 android 和 iOS 中的网页加载控件）。这样以来，H5 部分是可以随时改变而不用发版，动态化需求能满足；同时，由于 H5 代码只需要一次开发，就能同时在 Android 和 iOS 两个平台运行，这也可以减小开发成本，也就是说，H5 部分功能越多，开发成本就越小。我们称这种 h5+原生的开发模式为混合开发，采用混合模式开发的 APP 我们称之为混合应用或 Hybrid APP。

你可以简单的理解为是Web App和Native App的杂合体。

#### 优点：

1.  开发成本较低，可以跨平台，调试方便 维护成本低，功能可复用。
2.  功能更加完善，性能和体验要比起web app好太多，更新较为自由。

#### 缺点：

1.  相比原生，性能仍然有较大损耗，不适用于交互性较强的app。

### 总结

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7b014fd6a8645fca295ac6757d6ffbd~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

说到这小伙伴们对App种类以及Hybrid App是不是有一定的了解了呢。好奇的宝宝又要问了，难道我们嵌入到App里面的H5页面不需要动态通信的吗？对，是需要的。接下来我们介绍Hybrid App和我们的H5页面的通信方式。

## App和H5通信

通信分为H5端调用原生App端方法和原生App端调用H5端方法。App又分为IOS和Android两端，他们之间是有区别的，下面我们分开来介绍。

### App端调用H5端方法

App端调用H5端的方法，调用的必须是绑定到window对象上面的方法。

把say方法注册到window对象上。

```
window.say = (name) => {
 alert(name)
}
复制代码
```

#### Android调用H5端方法

```
private void isAutoUser () {
    String username = mSpHelper.getAutoUser();
    
    if (TextUtils.isEmpty(username)) {
        return;
    }

    // 1.Android: loadUrl (Android系统4.4- 支持)
    // 该方法的弊端是无法获取函数返回值；
    // say 方法是H5端挂载在window对象上的方法。
    mWebView.loadUrl("javascript:say('" + username + "')")

    // 2.Android: evaluateJavascript (Android系统4.4+ 支持)
    // 这里着重介绍 evaluateJavascript，这也是目前主流使用的方法。
    // 该方法可以在回调方法中获取函数返回值；
    // say 方法是H5端挂载在window对象上的方法。
    mWebView.evaluateJavascript("javascript:say('" + username + "')", new ValueCallback<String>() {
        @Override
        public void onReceiveValue(String s) {
          //此处为 js 返回的结果
        }
    });
    
    // 下面这两种通信方式用的不多，这里就不着重介绍了。
    
    // 3.Android: loadUrl (Android系统4.4- 支持)
    // 直接打开某网页链接并传递参数，这种也能给H5端传递参数
    // mWebView.loadUrl("file:///android_asset/shop.html?name=" + username);
    
    // 4. Android端还可以通过重写onJsAlert, onJsConfirm, onJsPrompt方法拦截js中调用警告框，输入框，和确认框。
}
复制代码
```

#### IOS调用H5端的方法

IOS使用不同的语言有不同的调用方法。

```
// Objective-C
// say 方法是H5端挂载在window对象上的方法
[self.webView evaluateJavaScript:@"say('params')" completionHandler:nil];

// Swift
// say 方法是H5端挂载在window对象上的方法
webview.stringByEvaluatingJavaScriptFromString("say('params')")
复制代码
```

### H5端调用App端方法

提供给H5端调用的方法，Android 与 IOS 分别拥有对应的挂载方式。分别对应是:`苹果 UIWebview JavaScriptCore 注入`（这里不介绍）、`安卓 addJavascriptInterface 注入`、`苹果 WKWebView scriptMessageHandler 注入`。

#### H5调用Android端方法

安卓 addJavascriptInterface 注入。

```
// 这里的对象名 androidJSBridge 是可以随意更改的，不固定。
addJavascriptInterface(new MyJaveScriptInterface(mContext), "androidJSBridge");

// MyJaveScriptInterface类里面的方法
@JavascriptInterface
public aliPay (String payJson) {
  aliPayHelper.pay(payJson);
  // Android 在暴露给 H5端调用的方法能直接有返回值。
  return 'success';
}
复制代码
```

H5调用Android端暴露的方法。

```
// 这里的 androidJSBridge 是根据上面注册的名字来的。
// js调用Android Native原生方法传递的参数必须是基本类型的数据，不能是引用数据类型，如果想传递引用类型需要使用JSON.stringify()。
const result = window.androidJSBridge.aliPay('string参数');
console.log(result);
复制代码
```

#### H5调用IOS端方法

苹果 WKWebView scriptMessageHandler 注入

```
#pragma mark -  OC注册供JS调用的方法 register方法
- (void)addScriptFunction {
    self.wkUserContentController = [self.webView configuration].userContentController;

    [self.wkUserContentController addScriptMessageHandler:self name:@"register"];
}

#pragma mark - register方法
- (void)register:(id)body {
     NSDictionary *dict = body;
    [self.userDefaults setObject:[dict objectForKey:@"password"] forKey:[dict objectForKey:@"username"]];
    不能直接返回结果，需要再次调用H5端的方法，告诉H5端注册成功。
    [self.webView evaluateJavaScript:@"registerCallback(true)" completionHandler:nil];
}
复制代码
```

ios 在暴露给 web 端调用的方法不能直接有返回值，如果需要有返回值需要再调用 web 端的方法来传递返回值。（也就是需要两步完成）。

H5调用IOS端暴露的方法。

```
// 与android不同，ios这里的webkit.messageHandlers是固定写法，不能变。
// 不传参数
window.webkit.messageHandlers.register.postMessage(null);
// 传递参数
// 与android不同，ios这里的参数可以是基本类型和引用数据类型。
window.webkit.messageHandlers.register.postMessage(params);
复制代码
```

### Android与IOS的双向通讯注意点

1.  H5端调用Android端方法使用`window.androidJSBridge.方法名(参数)`，这里的`androidJSBridge`名称不固定可自定义。而H5端调用IOS端方法固定写法为`window.webkit.messageHandlers.方法名.postMessage(参数)`。
2.  H5端调用Android端方法传递的参数只能是基本数据类型，如果需要传递引用数据类型需要使用`JSON.stringfy()`处理。而IOS端既可以传递基本数据类型也可以传递引用数据类型。
3.  H5端调用Android端方法可以直接有返回值。而IOS端不能直接有返回值。

### 统一处理

看到这，宝宝们是不是又要问了，在H5端调用Android和IOS方法的方式都不同我们应该怎么区分当前是什么环境呢？别急，笔者早已准备好了方法。

```
/**
 * 判断手机系统类型
 * @returns phoneSys
 */
function phoneSystem() {
  var u = navigator.userAgent.toLowerCase();
  let phoneSys = ''
  if (/android|linux/.test(u)) {//安卓手机
    phoneSys = 'android'
  } else if (/iphone|ipad|ipod/.test(u)) {//苹果手机
    phoneSys = 'ios'
  } else if (u.indexOf('windows Phone') > -1) {//winphone手机
    phoneSys = 'other'
  }
  return phoneSys
}

// 调用
// 这里笔者只区分方法的调用方式，其实参数的类型和方法的返回值都需要处理。
function call(message) {
  let phoneSys = phoneSystem()
  if (typeof window.webkit != "undefined" && phoneSys == 'ios') {
    window.webkit.messageHandlers.call.postMessage(message);
  } else if (typeof jimiJS !== "undefined" && phoneSys == 'android') {
    window.jimiJS.call(message);
  }
}
复制代码
```

## 后记

本文为笔者个人学习笔记，如有谬误，还请告知，万分感谢！如果本文对你有所帮助，还请点个赞~~

文章被收录于专栏：

![cover](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09b095a3afc64138b78dbe1ed0fedc45~tplv-k3u1fbpfcp-no-mark:160:160:160:120.awebp?)

![](https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/c794682f2184652c07e62d648e048460.svg) 68

![](https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/3d482c7a948bac826e155953b2a28a9e.svg) 收藏