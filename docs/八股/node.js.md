## node.js基础



# fs文件系统模块

**是什么？**

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642769419188-9dfdf3fd-8dce-41a9-b009-0ca446356fb6.png)

### 读取文件

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642769486290-ebcb0a60-68cd-487a-b59f-71e83085190a.png)

### 写入文件

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642770075183-ab24706c-b292-4a07-8255-0caca8b9bdef.png)

### 拼接路径错误问题

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642771449309-72b0609f-6d69-4bdb-9fb1-c8c2e1df0b9b.png)

# 路径模块path

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642771985339-76551412-137d-46ec-b3a7-8329bd708472.png)

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642771997778-c37616ab-6026-4ba6-b49e-ef5a938f5547.png)

### 路径拼接

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642772031154-4df76436-8cc8-4fce-bac9-4872c4f9a555.png)

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642772772407-40622d8f-c934-415a-9d52-73bd7f190a98.png)

### 获取文件名

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642772728181-797442cb-2ccd-4052-8913-a771ccf6e33f.png)

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642772791349-572d412a-cbea-41cb-8642-021e886c82aa.png)

### 获取拓展名

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642773006127-0536479a-afcf-467a-94a8-68db9e732c66.png)

# http模块

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642863290838-b32f749f-84d4-47fb-bd5e-827a375968ea.png)

## 创建web服务器步骤

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642863705127-a5d02c97-a504-4dd4-97fe-291210afcc70.png)

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642863722209-580ed275-4a9f-4cbf-b623-d36a68857fd7.png)

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642863730780-ba764e5c-d9a2-44f2-a49e-4d2eac7f1dc9.png)

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642863747682-2f11edd8-2b3c-45e8-9142-555ace26bdca.png)

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642863761275-cebcbb0f-bd2b-4156-b647-c7c8309f20aa.png)

## req请求对象

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642863785275-027e3bb0-3948-4fa3-a666-e50465d31acd.png)

## res响应对象

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642863812528-2dcb5ab0-d594-4a18-a435-9b7df9da2c5a.png)

## 解决中文乱码问题

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642863832699-b95df7d5-5ae1-4ba6-93de-b3a3fa3a1462.png)

## 根据不同url响应不同的html内容(核心)

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642863992611-1a48ff59-376b-428d-ab37-312674e643cb.png)

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642864044462-801084a2-7a56-49f0-8c8f-e329b622bc92.png)



![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642868962004-f7960f12-7a17-44e9-a12b-a7cac51afc6d.png)

# node模块化

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642869014410-0b94e93b-dbaf-457d-9b98-dfce73124e8b.png)

## 加载模块

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642869036333-bbe20051-a94f-41bc-9136-adaf69cd61ff.png)

## 模块作用域

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642869056811-48067876-79d5-4352-8b89-e622797373e6.png)

模块作用域的好处

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1642869099212-e75140f3-d4a7-44eb-8699-2b73bd4c5a40.png)

# nodemon

npm i --save nodemon

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1643267937500-cff294d1-7223-48c5-b72f-1d4485d5cc18.png)

![img](https://cdn.nlark.com/yuque/0/2022/png/23076793/1643267946860-09d66c4a-0a07-4b3d-a2b0-c0f30725f1f1.png)

## Koa

### 1.Koa的中间件原理

[Koa之洋葱模型分析](https://juejin.cn/post/7095566716347875336)

Koa 是一个由 Express 原班人马打造的新的 web 框架，Koa 本身并没有捆绑任何中间件，只提供了应用（`Application`）、上下文（`Context`）、请求（`Request`）、响应（`Response`）四个模块（源码中可以发现）。原本 Express 中的路由（`Router`）模块已经被移除，改为通过中间件的方式实现。相比较 Express，Koa 能让使用者更大程度上构建个性化的应用。

Koa 是一个中间件框架，本身没有捆绑任何中间件。本身支持的功能并不多，功能都可以通过中间件拓展实现。通过添加不同的中间件，实现不同的需求，从而构建一个 Koa 应用

#### 中间件基本使用

```js
const Koa = require('Koa')
const app = new Koa()

// async 函数
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 普通函数
app.use((ctx, next) => {
  const start = Date.now()
  return next().then(() => {
    const ms = Date.now() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  })
})

app.listen(3001, () => {
  console.log(`Server port is 3000.`)
})
```

Koa 的中间件就是函数，可以是 `async` 函数，或是普通函数。而`next()`函数则是一个异步promise函数。

#### 中间件执行顺序

```js
// 最外层的中间件
app.use(async (ctx, next) => {
  await console.log(`第 1 个执行`)
  await next()
  await console.log(`第 6 个执行`)
})

// 第二层中间件
app.use(async (ctx, next) => {
  await console.log(`第 2 个执行`)
  await next()
  await console.log(`第 5 个执行`)
})

// 最里层的中间件
app.use(async (ctx, next) => {
  await console.log(`第 3 个执行`)
  ctx.body = 'Hello world.'
  await console.log(`第 4 个执行`)
})
```

中间件的执行顺序受 `next()`函数影响，以 `next()`为界分为上下两部分，`next()`上面的部分为从上到下顺序执行，直到执行到最深处 `ctx`上下文执行返回结果后（无next函数），再从下到上执行，直到执行到最外层

把关注点集中在 `next()`函数和`ctx`上下文，再看一遍：

```js
// 最外层的中间件
app.use(async (ctx, next) => {
  // 这里是针对ctx.request做一些处理
  ctx.request.query.name = ctx.request.query.name + '_query1'
  await next()
  // 这里是针对ctx.response做一些处理
  ctx.response.body = ctx.response.body + '_query1'

  ctx.res.end(ctx.response.body)
})

// 第二层中间件
app.use(async (ctx, next) => {
  ctx.request.query.name = ctx.request.query.name + '_query2'
  await next()
  ctx.response.body = ctx.response.body + '_query2'
})

// 最里层的中间件
app.use(async (ctx, next) => {
  const query = ctx.request.query
  // console.log(query) => { name: 'zhangsan_query1_query2' }
  ctx.response.body = 'hello world'
})

// 请求参数如下：
// http://localhost:3001?name=zhangsan
// 返回结果如下：
// hello world_query2_query1
```

简单分析可以发现，**我们以`next`函数为分界线，`next`函数的上面部分可以理解为`request`请求的流程（从外到内），`next`函数下面的部分可以理解为`response`响应的流程（从内到外）**

从表现上来看，我觉得这和递归的模式还挺相似的，开始都是先一层层往里调用，直到调用到最后一层，开始执行，得到结果，返回给上一层，然后再从最后一层往回执行，直到回到第一层，得到最终的结果



中间件的使方式非常简单，只需要在 `app.use(fn)` 中添加中间件函数即可。

该函数接受两个参数：`ctx`——上下文、`next`——下一个中间件函数。

```js
const Koa = require('Koa')
const app = new Koa()

const fn = async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
}

app.use(fn)
```

### 2.Koa的洋葱模型

![洋葱模型](https://s2.loli.net/2022/06/19/6DNXLofT1lvgc28.webp)

Koa 中间件采用的是洋葱圈模型，每次执行下一个中间件传入两个参数 `ctx` 和 `next`，参数 `ctx` 是由 koa 传入的，封装了 `request` 和 `response` 对象，可以通过它访问 `request` 和 `response`，`next` 就是进入下一个要执行的中间件。

在洋葱模型中，每一层相当于一个中间件，用来处理特定的功能，比如错误处理、`Session` 处理等等。其处理顺序先是 `next()` 前请求（`Request`，从外层到内层）然后执行 `next()` 函数，最后是 `next()` 后响应（`Response`，从内层到外层），也就是说每一个中间件都有两次处理时机。

按照传统逻辑分析，一个中间件函数应该是自上而下的执行，执行结束后再执行下一个中间件，即从头到尾按顺序链式调用。

但是这样会产生一些问题，比如：

-   如果只链式执行一次，怎么能保证前面的中间件能使用之后的中间件所添加的东西呢？
-   如何正确划分请求前和请求后的关联逻辑？

简要说明：

问题一：如果不是`next`分层这种执行方式，对于普通的链式调用，在执行下一个中间件并对数据做了一些特殊处理之后，怎么做到让上一个中间件获取到该特殊数据后并且再次执行呢，以及如何避免对其他中间件的影响和整个应用的执行呢？

问题二：以对一个数据库的查询时间做计算来说明，中间件以`next`分层，上面为开始请求逻辑部分，标记开始的时间，然后执行`next`函数进入下一个中间件，调用数据库查询相关的中间件功能函数，执行结束后，来到了`next`函数的下面部分，这里为返回结果，标记结束请求的时间，两数相减即可，非常的简单，功能划分也是很清晰。对于中间件的各种添加、拓展等等，都可以很好集成进去，并做到功能的纯净。

可以发现使用洋葱模型可以很好（优雅）的解决这些问题。

## Egg



## 综合问题

### 1.Express和Koa的区别

##### Koa

-   基于node的一个web开发框架，利用co作为底层运行框架，利用Generator的特性，实现“无回调”的异步处理；
-   ES7;
-   更小、更富有表现力、更健壮的基石；
-   利用async函数、Koa丢弃回调函数，增强错误处理；
-   很小的体积，因为没有捆绑任何中间件；
-   类似堆栈的方式组织和执行；
-   低级中间件层中提供高级“语法糖”，提高了互操性、稳健性；

##### Express

-   Node的基础框架，基础Connect中间件，自身封装了路由、视图处理等功能；
-   线性逻辑，路由和中间件完美融合，清晰明了；
-   弊端是callback回调方式，不可组合、异常不可捕获；
-   ES5;
-   connect的执行流程： connect的中间件模型是线性的，即一个一个往下执行；