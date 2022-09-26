# WebWorker 优化数据导出下载 Excel 

---


## 一、业务背景

## 1.1 业务概述

在项目当中存在着表格数据导出 Excel 文件的业务需求场景，最原始的技术实现流程是：

1.  点击按钮发送请求获取要导出 Excel 的原始数据；
2.  接口返回处理拼装组装导出的形式的数据；
3.  然后将数据直接使用 excel.js 进行 Excel 文件的导出。

上述的过程在优化前仅使用当前网页的 js 单线程进行处理。

  

## 1.2 性能瓶颈

一开始业务还不算复杂，数据量还不算大的情况下上述的技术实现架构也还说暂时能够应付得来。但是随着业务不断更新迭代，用户的深度使用系统，**数据量急剧上升，这时候技术架构使用的还是单线程 js 处理导出 Excel 文件的形式，此时 js 的 script 处理逻辑进程压力也因此而暴增**，render 渲染进程从而受到阻碍，对系统用户的体验就是灾难性了，点击了下载后页面会直到处理完 Excel 导出数据组装并且 excel.js 成功导出 Excel 文件时都像是卡住了似得，无法在页面当中进行其他的任何操作。

  

## 1.3 技术优化改造

很明显，限制了用户体验的性能瓶颈就是大量的导出数据，单线程模式下的计算逻辑压力过大全程执行 script 逻辑，导致页面卡顿无法响应用户的其他操作。要想解决这个问题有两个技术优化的方向：

-   **前端利用浏览器的多线程的能力**：开辟单独处理导出数据的子线程，在系统背后多线程处理导出，让出主线程去响应处理用户的其他操作。
-   **后台生成对应的 Excel 文件**：这种形式，前端仅需要在点击了相关导出按钮后异步等待后台接口请求返回对应 Excel 文件的下载地址即可。

这里最后决策还是选择前端多线程的方式解决这个性能瓶颈的问题，实现性能、用户体验优化的功能；而说到前端多线程就指的是浏览器提供的 **Webworker** 的能力了。

___

  

## 二、WebWorker 基础知识

篇幅和时间关系，这里就简单介绍相关最基础使用的 api，相关 Webworker 能力和 API 请自行查阅相关资料。

## 2.1 基础概念

Web Worker 是 HTML5 标准的一部分，这一规范定义了一套 API，它允许一段 JavaScript 程序运行在主线程之外的另外一个线程中。

### 场景

**当我们有些任务需要花费大量的时间，进行复杂的运算，就会导致页面卡死**：用户点击页面需要很长的时间才能响应，因为前面的任务还未完成，后面的任务只能排队等待。对用户来说，这样的体验无疑是糟糕的，web worker 就是为了解决这种花费大量时间的复杂运算而诞生的！

### WebWorker 的作用：创建 worker 线程

WebWorker 允许在主线程之外再创建一个 worker 线程，**在主线程执行任务的同时，worker 线程也可以在后台执行它自己的任务，互不干扰。**

这样就利用浏览器提供的能力让 JS 变成多线程的环境，可以把高延迟、花费大量时间的运算，分给 worker 线程，最后再把结果返回给主线程就可以了，因为时间花费多的任务被 web worker 承担了，主线程自然会减轻了script 进程计算压力。

  

## 2.2 基本使用

### 主线程相关

#### 创建 Worker 实例

主线程调用`new Worker()`构造函数，新建一个 worker 线程，构造函数的参数是一个 url，生成这个 url 的方法有两种：

##### 1\. 脚本文件：

```js
const worker = new Worker('https://xxx.yyy.js');
```

worker 的两个限制：

1.  **分配给 Worker 线程运行的脚本文件，必须与主线程的脚本文件同源**。
2.  **worker 不能读取本地的文件**(不能打开本机的文件系统file://)，它所加载的脚本必须是网络资源文件。

在项目中推荐把文件放在静态文件夹（eg. static 文件夹）中，打包的时候直接拷贝进去。

##### 2\. 字符串形式：

```js
const data = `worker线程 do something`;
// 转成二进制对象
const blob = new Blob([data]);
// 生成url
const url = window.URL.createObjectURL(blob);
// 加载url
const worker = new Worker(url);
```

在项目中可以把worker线程的逻辑写在js文件里面，然后字符串化，然后再export、import，配合webpack进行模块化管理，这样也是一种加载 js 模块脚本的方式。

#### 主线程的其他 API

##### 1\. 主线程与 Worker 线程通信

```js
worker.postMessage({
  type: 'init',
  data: {xxx}
});
```

线程之间通过`postMessage/onMessage`api 进行通信。**相互之间的通信可以传递对象和数组**。

##### 2\. 主线程监听接收 Worker 线程返回的信息

```js
worker.onmessage = function (event) {
    console.log(event.data);
}
```

##### 3\. 主线程关闭 Worker 线程

```js
worker.terminate(); // 主线程主动关闭Worker线程
```

Worker 线程一旦新建成功，就会始终运行，这样有利于随时响应主线程的通信。这是 Worker 比较耗费CPU的原因，一旦使用完毕，就应该关闭 worker 线程。

##### 4\. 监听错误

```js
worker.onerror = error => {
    // error.filename - 发生错误的脚本文件名
    // error.lineno - 出现错误的行号
    // error.message - 可读性良好的错误消息
    console.log('onerror', error);
};
```

### Worker 线程相关

#### self 代表 worker 进程自身

worker 线程的执行上下文是一个叫做WorkerGlobalScope的东西跟主线程的上下文(window)不一样。可以使用self/WorkerGlobalScope 来访问全局对象。

#### 监听主线程传过来的信息

```js
self.onmessage = event => {
    console.log(event.data);
};
```

#### 发送信息给主线程

```js
self.postMessage({
    type: 'success',
    data: {yyy}
});
```

#### worker 线程关闭自身

```js
self.close()
```

#### worker 线程加载脚本

Worker 线程能够访问一个全局函数 imprtScripts()来引入脚本，该函数接受 0 个或者多个 URI 作为参数。

```js
importScripts('http~.js','http~2.js');
```

注：脚本的下载顺序是不固定的，但执行时会按照调用 importScripts 顺序进行，且是同步的。

#### Worker 线程限制

**因为 worker 创造了另外一个线程，不在主线程上，浏览器给设定了一些限制**

**无法使用下列对象**：

1.  window 对象
2.  document 对象
3.  DOM 对象
4.  parent 对象

**可以使用下列对象/功能**：

1.  浏览器：navigator 对象
2.  URL：location 对象，只读
3.  发送请求：XMLHttpRequest 对象
4.  定时器：setTimeout/setInterval
5.  应用缓存：Application Cache

  

#### 线程间转移二进制数据

因为主线程与 worker 线程之间的通信是拷贝关系，当需要传递一个巨大的二进制文件给 worker 线程处理时(worker 线程就是用来干这个的)，这时候使用拷贝的方式来传递数据，无疑会造成性能问题。

**Web Worker 提供了一种转移数据的方式，允许主线程把二进制数据直接转移给子线程**。这种方式比原先拷贝的方式，有巨大的性能提升。

**一旦数据转移到其他线程，原先线程就无法再使用这些二进制数据了，这是为了防止出现多个线程同时修改数据的麻烦局面**

```js
// 创建二进制数据
var uInt8Array = new Uint8Array(1024*1024*32); // 32MB
for (var i = 0; i < uInt8Array .length; ++i) {
    uInt8Array[i] = i;
}
console.log(uInt8Array.length); // 传递前长度:33554432
// 字符串形式创建worker线程
var myTask = `
    onmessage = function (e) {
        var data = e.data;
        console.log('worker:', data);
    };
`;

var blob = new Blob([myTask]);
var myWorker = new Worker(window.URL.createObjectURL(blob));

// 使用这个格式(a,[a]) 来转移二进制数据
myWorker.postMessage(uInt8Array.buffer, [uInt8Array.buffer]); // 发送数据、转移数据

console.log(uInt8Array.length); // 传递后长度:0，原先线程内没有这个数据了
```

___

  

## 三、业务优化的落地

## 3.1 技术调研

梳理下数据导出的先决条件：

1.  在 WebWorker 中需要能调用 ajax 获取接口数据；
2.  在 WebWorker 中要能动态加载脚本，为了实现不同的 Excel 数据组装格式化及加载 excel.js 脚本进行 excel 文件流转换；
3.  调用 file-saver 中的 saveAs 功能进行文件导出保存操作；

基于以上的条件，逐一讨论答案：

1.  WebWorker 支持使用 XMLHttpRequest 发起 ajax 请求数据；
2.  WebWorker 中提供了 importScripts() 接口能够动态导入 js 脚本文件，因此在 WebWorker 中也能生成 Excel 的实例；
3.  WebWorker 中是无法使用 DOM 对象， 而 file-saver 正好使用了 DOM，因此只能是子线程中处理完数据后传递数据给主线程由主线程执行文件保存操作；

  

## 3.2 实践落地

### 设计思路与流程伪代码

#### 1\. 主线程实例化 Worker 线程

实例化 Worker 线程：

-   使用 statics 不进行打包构建的 js 资源

```js
const worker = new Worker(`${window.location.origin}/js/export-excel.js`)
```

  

#### 2\. 主线程与 Worker 线程之间通信

主线程通过 worker 实例的 onmessage api 来接受 worker 线程的信息：

-   通过定义不同的 type 来区分要执行的操作
-   主要划分为三类操作：
    -   **ready**：worker 线程已经实例化初始化准备好了，主线程可以传输要导出的数据；
    -   **success**：worker 线程已经处理好要导出的数据，主线程准备接收并且调用 FileSaver.saveAs 导出成 xlsx 文件
    -   **error**：遇到错误

```js
worker.onmessage = (event) => {
  const msgType = event.data.type

  switch (msgType) {
    case 'ready':
      worker.postMessage({
        type: 'init',
        data: {
          type: 'xxx',
          data: {},
        },
      })
      break

    case 'success':
      // FileSaver 导出 Excel 文件...
      resolve()
      break

    case 'error':
      reject(event.data.data)
      break

    default: break
  }
}
```

  

#### 3\. 主线程通知 worker 线程开始，worker 线程加载数据

worker 接收 init 初始化信号并且利用 XMLHttpRequest 发送请求获取数据

```js
onmessage = event => {
  const msgType = event.data.type
  switch(msgType) {
      case 'init': {
        getData()
      }
  }
};

function getData() {
  //构造表单数据
  var formData = new FormData();
  formData.append('key', 'value');
  //创建xhr对象 
  var xhr = new XMLHttpRequest();
  //设置xhr请求的超时时间
  xhr.timeout = 3000;
  //设置响应返回的数据格式为 json
  xhr.responseType = "json";
  //创建一个 post 请求，采用异步
  xhr.open('POST', '/server-api', true);
  //注册相关事件回调处理函数
  xhr.onload = function(e) { 
    if(this.status == 200||this.status == 304){
        console.log(this.response);
    }
  };
  xhr.ontimeout = function(e) { ... };
  xhr.onerror = function(e) { ... };
  xhr.upload.onprogress = function(e) { ... };
  
  //发送数据
  xhr.send(formData);
}
```

  

#### 4\. Worker 线程处理组装要导出的数据

根据不同类型的导出文件进行对数据组装，这里涉及业务就不过多讲述了。

加载 excel.js 并进行数据转换 （这里主要介绍 Webworker，因此 excel.js 的用法这里就不累述了。

```js
importScripts('/js/xlsx.js');

const wbout = XLSX.write({
  SheetNames: ['未命名'],
  Sheets: {
    '未命名': 'xxx'
  }
}, {
  bookType: 'xlsx',
  bookSST: false,
  type: 'binary'
})
```

  

#### 5\. Worker 线程向主线程通信传输数据

这里是使用二进制数据形式在 worker 线程与主线程之间进行传输上述经过 excel.js 转换后的数据

```js
self.postMessage({
  type: 'success',
  data: {
    xlsxBlob: new Blob([wbout], {
      type: 'application/octet-stream'
    }),
  }
});
```

  

#### 6\. 主线程接受 Worker 线程数据并调用 file-saver saveAs 方法保存为 Excel 文件

```js
import FileSaver from 'file-saver'

worker.onmessage = (event) => {
  const msgType = event.data.type

  switch (msgType) {
    case 'success':
      FileSaver.saveAs(event.data.data.xlsxBlob, `${fileName}.xlsx`)
      resolve()
      break

      // ...
     
    default: break
  }
}
```

  

### 遇到的问题

#### 1\. Worker 实例化参数形式抉择

前面提及到 Worker 线程实例化时候有两种传递参数的形式，一种是通过脚本 url 形式，一种是通过 js 逻辑字符串转化成资源 url；因为第二种首先是工程化经过编译、混淆压缩后代码的不好明确拆分并且不同形式的导出 Excel 文件有对应不同的数据处理组装逻辑脚本，因此这里选择的还是第一种，将要运行的脚本放到不会进行构建打包处理的静态资源目录（eg. static 目录）。

  

#### 2\. 请求的封装逻辑与数据组装格式的逻辑的复用的困境？

因为 Worker 线程内部能使用的请求是原生的`XMLHttpRequest`，并且是独立的，因此需要重新调整请求的封装。而数据组装因为技术决策实例化 WebWorker 线程实例时候选择的是使用静态没编译打包的 static 静态脚本资源，因此数组组装这块复用原项目当中的工具 util 函数变的不可能，因此目前也只能调整重新 CP 一份封装在静态资源当中使用 importScripts 来进行加载了。

  

#### 3\. Worker 往主线程传输大数据优化

当要导出的数据量极大的时候，主线程与 Worker 线程之间还使用对象形式进行数据通信就会造成性能问题，所幸 WebWorker 在线程之间的通信支持以二进制形式数据进行通信。项目当中使用的为`new Blob([string])`来对导出的数据进行二进制形式转换，恰巧 file-saver 也可以使用 Blob 二进制数据形式进行对文件的导出。

```js
FileSaver.saveAs(new Blob([outputString], {
  type: 'application/octet-stream'
}), `${fileName}.xlsx`)
```

  

## 3.3 优化成效与总结

数据导出过程中，页面没有丝毫的卡顿之感。

在点击各类下载的按钮后并不会再因为 js 的 script 进程遇到计算量极大的场景而导致对页面造成卡顿感觉，解放了浏览器的主线程，在处理组装导出 Excel 数据的同时能够处理用户的点击、输入等操作，使得用户得到了直线上升的使用体验，收到了客户和 PM 的一致好评！

技术的优化还是需要扎根在业务上面，只有真正解决了用户的痛点，这样子的技术优化落地才能说更为有价值所在。

___

  

## 参考资料

-   前端er来学习一下webWorker吧：[juejin.cn/post/684490…](https://juejin.cn/post/6844903725249593352 "https://juejin.cn/post/6844903725249593352")
-   Web Worker 使用教程：[www.ruanyifeng.com/blog/2018/0…](https://link.juejin.cn/?target=https%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2018%2F07%2Fweb-worker.html "https://www.ruanyifeng.com/blog/2018/07/web-worker.html")
-   前端中如何使用webWorker对户体验进行革命性的提升：[juejin.cn/post/697033…](https://juejin.cn/post/6970336963647766559 "https://juejin.cn/post/6970336963647766559")
