## React源码目录

### 源码目录结构

源码中主要包括如下部分

-   fixtures：为代码贡献者提供的测试React
-   packages：主要部分，包含Scheduler，reconciler等
-   scripts：react构建相关

下面来看下packages主要包含的模块

- react：核心Api如：React.createElement、React.Component都在这

- 和平台相关render相关的文件夹：

    react-art：如canvas svg的渲染 react-dom：浏览器环境 react-native-renderer：原生相关 react-noop-renderer：调试或者fiber用

- 试验性的包

    react-server: ssr相关

    react-fetch: 请求相关

    react-interactions: 和事件如点击事件相关

    react-reconciler: 构建节点

- shared：包含公共方法和变量

- 辅助包：

    react-is : 判断类型

    react-client: 流相关

    react-fetch: 数据请求相关

react-refresh: 热加载相关

-   scheduler：调度器相关

-   React-reconciler：在render阶段用它来构建fiber节点

### 怎样调试源码

本课程使用的react版本是17.0.1，通过下面几步就可以调试源码了，

方法一：可以用现成的包含本课程所有demo的项目来调试，建议使用已经构建好的项目，地址：[https://github.com/xiaochen1024/react\_source\_demo](https://github.com/xiaochen1024/react_source_demo)

方法二：

1.  clone源码：`git clone https://github.com/facebook/react.git`
2.  依赖安装：`npm install` or `yarn`
3.  build源码：npm run build react/index,react/jsx,react-dom/index,scheduler --type=NODE

- 为源码建立软链：

    ```
    cd build/node_modules/react
    npm link
    cd build/node_modules/react-dom
    npm link
    ```

- create-react-app创建项目

    ```
    npx create-react-app demo
    npm link react react-dom
    ```

## React源码架构

认识一下react源码架构和各个模块。

在真正的代码学习之前，我们需要在大脑中有一个react源码的地图，知道react渲染的大致流程和框架，这样才能从上帝视角看react是怎么更新的，来吧少年。

react的核心可以用ui=fn(state)来表示，更详细可以用

```js
const state = reconcile(update);
const UI = commit(state);
```

上面的fn可以分为如下一个部分：

-   Scheduler（调度器）： 排序优先级，让优先级高的任务先进行reconcile
-   Reconciler（协调器）： 找出哪些节点发生了改变，并打上不同的Flags（旧版本react叫Tag）
-   Renderer（渲染器）： 将Reconciler中打好标签的节点渲染到视图上

一图胜千言：

![react源码3.1](https://xiaochen1024.com/react%E6%BA%90%E7%A0%813.1.png)

![react源码3.2](https://xiaochen1024.com/20210602082005.png)

#### jsx

jsx是js语言的扩展，react通过babel词法解析（具体怎么转换可以查阅babel相关插件），将jsx**转换成React.createElement**，React.createElement方法返回**virtual-dom对象**（内存中用来描述dom阶段的对象），所有**jsx本质上就是React.createElement的语法糖**，它能声明式的编写我们想要组件呈现出什么样的ui效果。

#### Fiber双缓存

**Fiber对象**上面保存了包括**这个节点的属性、类型、dom等**，Fiber通过child、sibling、return（指向父节点）来形成Fiber树，还保存了**更新状态时用于计算state的updateQueue**，**updateQueue是一种链表结构**，上面可能存在多个未计算的update，update也是一种数据结构，上面包含了更新的数据、优先级等，除了这些之外，上面还有和副作用有关的信息。

双缓存是指存在两颗Fiber树，**current Fiber树描述了当前呈现的dom树，workInProgress Fiber是正在更新的Fiber树**，这两颗Fiber树都是在内存中运行的，**在workInProgress Fiber构建完成之后会将它作为current Fiber应用到dom上**

在mount时（**首次渲染**），会根据jsx对象（Class Component或者的render函数 Function Component的返回值），构建Fiber对象，形成Fiber树，然后这颗**Fiber树会作为current Fiber**应用到真实dom上，在update（状态更新时如setState）的时候，会**根据状态变更后的jsx对象**和current Fiber做对比形成**新的workInProgress Fiber**，然后workInProgress Fiber切换成current Fiber应用到真实dom就达到了更新的目的，而这一切都是在内存中发生的，从而减少了对dom好性能的操作。

 例如下面代码的Fiber双缓存结构如下，

```js
function App() {
  const [count, setCount] = useState(0);
  return (
   <>
      <h1
    onClick={() => {
          // debugger;
          setCount(() => count + 1);
        }}
    >
 <p title={count}>{count}</p> xiaochen
      </h1>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById("root"));
```

![react源码7.3](https://xiaochen1024.com/react%E6%BA%90%E7%A0%817.3.png)

#### scheduler

Scheduler的作用是调度任务，react15没有Scheduler这部分，**所以所有任务没有优先级，也不能中断，只能同步执行**。

我们知道了要**实现异步可中断的更新，需要浏览器指定一个时间，如果没有时间剩余了就需要暂停任务**，**requestIdleCallback**貌似是个不错的选择，但是它存在兼容和触发不稳定的原因，react17中采用**MessageChannel**来实现。

```js
//ReactFiberWorkLoop.old.js
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {//shouldYield判断是否暂停任务
    workInProgress = performUnitOfWork(workInProgress); 
  }
}
```

在Scheduler中的每个任务的优先级使用过期时间表示的，**如果一个任务的过期时间离现在很近，说明它马上就要过期了，优先级很高**，**如果过期时间很长，那它的优先级就低**，**没有过期的任务存放在timerQueue中，过期的任务存放在taskQueue中**，timerQueue和timerQueue都是**小顶堆**，所以p**eek取出来的都是离现在时间最近也就是优先级最高的那个任务，然后优先执行它**。

![react源码15.2](https://xiaochen1024.com/react%E6%BA%90%E7%A0%8115.2.png)

#### Lane模型

react之前的版本用`expirationTime`属性**代表优先级**，该**优先级和IO不能很好的搭配工作**（io的优先级高于cpu的优先级），现在有了**更加细粒度的优先级表示方法Lane**，**Lane用二进制位表示优先级**，二进制中的1表示位置，同一个二进制数可以有多个相同优先级的位，这就可以表示‘批’的概念，而且二进制方便计算。

这好比赛车比赛，在比赛开始的时候会分配一个赛道，比赛开始之后大家都会抢内圈的赛道（react中就是抢优先级高的Lane），比赛的尾声，最后一名赛车如果落后了很多，它也会跑到内圈的赛道，最后到达目的地（对应react中就是饥饿问题，低优先级的任务如果被高优先级的任务一直打断，到了它的过期时间，它也会变成高优先级）

Lane的二进制位如下，**1的bits越多，优先级越低**

```js
//ReactFiberLane.js
export const NoLanes: Lanes = /*                        */ 0b0000000000000000000000000000000;
export const NoLane: Lane = /*                          */ 0b0000000000000000000000000000000;

export const SyncLane: Lane = /*                        */ 0b0000000000000000000000000000001;
export const SyncBatchedLane: Lane = /*                 */ 0b0000000000000000000000000000010;

export const InputDiscreteHydrationLane: Lane = /*      */ 0b0000000000000000000000000000100;
const InputDiscreteLanes: Lanes = /*                    */ 0b0000000000000000000000000011000;

const InputContinuousHydrationLane: Lane = /*           */ 0b0000000000000000000000000100000;
const InputContinuousLanes: Lanes = /*                  */ 0b0000000000000000000000011000000;

export const DefaultHydrationLane: Lane = /*            */ 0b0000000000000000000000100000000;
export const DefaultLanes: Lanes = /*                   */ 0b0000000000000000000111000000000;

const TransitionHydrationLane: Lane = /*                */ 0b0000000000000000001000000000000;
const TransitionLanes: Lanes = /*                       */ 0b0000000001111111110000000000000;

const RetryLanes: Lanes = /*                            */ 0b0000011110000000000000000000000;

export const SomeRetryLane: Lanes = /*                  */ 0b0000010000000000000000000000000;

export const SelectiveHydrationLane: Lane = /*          */ 0b0000100000000000000000000000000;

const NonIdleLanes = /*                                 */ 0b0000111111111111111111111111111;

export const IdleHydrationLane: Lane = /*               */ 0b0001000000000000000000000000000;
const IdleLanes: Lanes = /*                             */ 0b0110000000000000000000000000000;

export const OffscreenLane: Lane = /*                   */ 0b1000000000000000000000000000000;
```

#### reconciler （render phase）

Reconciler发生在**render阶段**，render阶段会分别为**节点执行beginWork和completeWork**（后面会讲），或者**计算state，对比节点的差异，为节点赋值相应的effectFlags**（对应dom节点的增删改）

协调器是在render阶段工作的，简单一句话概括就是**Reconciler会创建或者更新Fiber节点**。在**mount的时候会根据jsx生成Fiber对象，在update的时候会根据最新的state形成的jsx对象和current Fiber树对比构建workInProgress Fiber树，这个对比的过程就是diff算法**。

**diff算法**发生在render阶段的**reconcileChildFibers函数中**，diff算法分为单节点的diff和多节点的diff（例如一个节点中包含多个子节点就属于多节点的diff），单节点会根据节点的key和type，props等来判断节点是复用还是直接新创建节点，多节点diff会涉及节点的增删和节点位置的变化。

reconcile时会在这些**Fiber上打上Flags标签**，在commit阶段把这些标签应用到真实dom上，这些标签代表节点的增删改，如

```js
//ReactFiberFlags.js
export const Placement = /*             */ 0b0000000000010;
export const Update = /*                */ 0b0000000000100;
export const PlacementAndUpdate = /*    */ 0b0000000000110;
export const Deletion = /*              */ 0b0000000001000;
```

render阶段**遍历Fiber树类似dfs的过程**，

‘捕获’阶段发生在beginWork函数中，该函数做的主要工作是创建Fiber节点，计算state和diff算法，

‘冒泡’阶段发生在completeWork中，该函数主要是做一些收尾工作，例如处理节点的props、和形成一条effectList的链表，该链表是被标记了更新的节点形成的链表

深度优先遍历过程如下，图中的数字是顺序，return指向父节点，第9章详细讲解

```js
function App() {
  return (
   <>
      <h1>
        <p>count</p> xiaochen
      </h1>
    </>
  )
}
```

![react源码7.2](https://xiaochen1024.com/react%E6%BA%90%E7%A0%817.2.png)

看如下代码

```js
function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <h1
        onClick={() => {
          setCount(() => count + 1);
        }}
      >
        <p title={count}>{count}</p> xiaochen
      </h1>
    </>
  )
}
```

如果p和h1节点更新了则effectList如下，从**rootFiber->h1->p**,，顺便说下fiberRoot是整个项目的根节点，只存在一个，**rootFiber是应用的根节点**，可能存在多个，例如多个`ReactDOM.render(<App />, document.getElementById("root"));`创建多个应用节点

![react源码8.3](https://xiaochen1024.com/react%E6%BA%90%E7%A0%818.3.png)

#### renderer（commit phase）

Renderer发生在commit阶段，commit阶段遍历effectList执行对应的dom操作或部分生命周期。

Renderer是在commit阶段工作的，**commit阶段会遍历render阶段形成的effectList，并执行真实dom节点的操作和一些生命周期，不同平台对应的Renderer不同，例如浏览器对应的就是react-dom**。

commit阶段发生在**commitRoot函数中，该函数主要遍历effectList，分别用三个函数来处理effectList上的节点，这三个函数是commitBeforeMutationEffects、commitMutationEffects、commitLayoutEffects**

![react源码10.1](https://xiaochen1024.com/react%E6%BA%90%E7%A0%8110.1.png)

#### concurrent

它是一类功能的合集（如fiber、schduler、lane、suspense），其目的是**为了提高应用的响应速度，使应用cpu密集型的更新不在那么卡顿，其核心是实现了一套异步可中断、带优先级的更新**。

我们知道一般浏览器的fps是60Hz，也就是每16.6ms会刷新一次，而**js执行线程和GUI也就是浏览器的绘制是互斥的，因为js可以操作dom，影响最后呈现的结果，所以如果js执行的时间过长，会导致浏览器没时间绘制dom，造成卡顿**。react17会在**每一帧分配一个时间（时间片）给js执行**，如果在这个时间内js还没执行完，那就要暂停它的执行，等下一帧继续执行，把执行权交回给浏览器去绘制。

![react源码15.3](https://xiaochen1024.com/react%E6%BA%90%E7%A0%8115.3.png)

对比下开启和未开启concurrent mode的区别，**开启之后，构建Fiber的任务的执行不会一直处于阻塞状态，而是分成了一个个的task**

**未开启concurrent**

![react源码1.2](https://xiaochen1024.com/20210529135848.png)

**开启concurrent**

![react源码3.3](https://xiaochen1024.com/react%E6%BA%90%E7%A0%813.3.png)

## React设计理念

### 异步可中断

-   **React15慢在哪里**

在讲这部分之前，需要讲是那些因素导致了react变慢，并且需要重构呢。

React15之前的协调过程是同步的，也叫stack reconciler，又因为js的执行是单线程的，这就导致了在更新比较耗时的任务时，不能及时响应一些高优先级的任务，比如用户的输入，所以页面就会卡顿，这就是cpu的限制。

-   **解决方案**

如何解决这个问题呢，试想一下，如果我们在日常的开发中，在单线程的环境中，遇到了比较耗时的代码计算会怎么做呢，首先我们可能会将任务分割，让它能够被中断，在其他任务到来的时候让出执行权，当其他任务执行后，再从之前中断的部分开始异步执行剩下的计算。所以关键是实现一套异步可中断的方案。

-   **实现**

在刚才的解决方案中提到了任务分割，和异步执行，并且能让出执行权，由此可以带出react中的三个概念

1. Fiber：react15的更新是同步的，因为它不能将任务分割，所以需要一套数据结构让它既能对应真实的dom又能作为分隔的单元，这就是Fiber。

    ```js
    let firstFiber
    let nextFiber = firstFiber
    let shouldYield = false
    //firstFiber->firstChild->sibling
    function performUnitOfWork(nextFiber){
      //...
      return nextFiber.next
    }
       
    function workLoop(deadline){
      while(nextFiber && !shouldYield){
              nextFiber = performUnitOfWork(nextFiber)
              shouldYield = deadline.timeReaming < 1
            }
      requestIdleCallback(workLoop)
    }
       
    requestIdleCallback(workLoop)
    ```

2. Scheduler：有了Fiber，我们就需要用浏览器的时间片异步执行这些Fiber的工作单元，我们知道浏览器有一个api叫做**requestIdleCallback**，它可以在浏览器空闲的时候执行一些任务，我们用这个api执行react的更新，让高优先级的任务优先响应不就可以了吗，但事实是requestIdleCallback存在着浏览器的兼容性和触发不稳定的问题，所以我们需要用js实现一套时间片运行的机制，在react中这部分叫做scheduler。

3. Lane：有了异步调度，我们还需要细粒度的管理各个任务的优先级，让高优先级的任务优先执行，各个Fiber工作单元还能比较优先级，相同优先级的任务可以一起更新，想想是不是更cool呢。

- **产生出来的上层实现**

    由于有了这一套异步可中断的机制，我们就能实现batchedUpdates批量更新和Suspense

下面这两张图就是使用异步可中断更新前后的区别，可以体会一下

![react源码2.2](https://xiaochen1024.com/react%E6%BA%90%E7%A0%812.2.png)

![react源码2.3](https://xiaochen1024.com/react%E6%BA%90%E7%A0%812.3.png)

### 代数效应（Algebraic Effects）

除了cpu的瓶颈问题，还有一类问题是和副作用相关的问题，比如获取数据、文件操作等。不同设备性能和网络状况都不一样，react怎样去处理这些副作用，让我们在编码时最佳实践，运行应用时表现一致呢，这就需要react有分离副作用的能力，为什么要分离副作用呢，因为要解耦，这就是代数效应。

提问：我们都写过获取数据的代码，在获取数据前展示loading，数据获取之后取消loading，假设我们的设备性能和网络状况都很好，数据很快就获取到了，那我们还有必要在一开始的时候展示loading吗？如何才能有更好的用户体验呢？

看下下面这个例子

```js
function getPrice(id) {
  return fetch(`xxx.com?id=${productId}`).then((res)=>{
    return res.price
  })
}

async function getTotalPirce(id1, id2) {
  const p1 = await getPrice(id1);
  const p2 = await getPrice(id2);

  return p1 + p2;
}

async function run(){
await getTotalPrice('001', '002');  
}

```

getPrice是一个异步获取数据的方法，我们可以用async+await的方式获取数据，但是这会导致调用getTotalPrice的run方法也会变成异步函数，这就是async的传染性，所以没法分离副作用。

```js
function getPrice(id) {
  const price = perform id;
  return price;
}

function getTotalPirce(id1, id2) {
  const p1 = getPrice(id1);
  const p2 = getPrice(id2);

  return p1 + p2;
}

try {
  getTotalPrice('001', '002');
} handle (productId) {
  fetch(`xxx.com?id=${productId}`).then((res)=>{
    resume with res.price
  })
}
```

现在改成下面这段代码，其中perform和handle是虚构的语法，当代码执行到perform的时候会暂停当前函数的执行，并且被handle捕获，handle函数体内会拿到productId参数获取数据之后resume价格price，resume会回到之前perform暂停的地方并且返回price，这就完全把副作用分离到了getTotalPirce和getPrice之外。

这里的关键流程是perform暂停函数的执行，handle获取函数执行权，resume交出函数执行权。

但是这些语法毕竟是虚构的，但是请看下下面的代码

```js
function usePrice(id) {
  useEffect((id)=>{
      fetch(`xxx.com?id=${productId}`).then((res)=>{
        return res.price
  })
  }, [])
}

function TotalPirce({id1, id2}) {
  const p1 = usePrice(id1);
  const p2 = usePrice(id2);

  return <TotalPirce props={...}>
}

```

如果把getPrice换成usePrice，getTotalPirce换成TotalPirce组件，是不是有点熟悉呢，这就是hook分离副作用的能力。

我们知道generator也可以做到程序的暂停和恢复啊，那用generator不行就行了吗，但是generator暂停之后的恢复执行，**还是得把执行权交换给直接调用者，调用者会沿着调用栈继续上交，所以也是有传染性的，并且generator不能计算优先级，排序优先级**。

```js
function getPrice(id) {
  return fetch(`xxx.com?id=${productId}`).then((res)=>{
    return res.price
  })
}

function* getTotalPirce(id1, id2) {
  const p1 = yield getPrice(id1);
  const p2 = yield getPrice(id2);

  return p1 + p2;
}

function* run(){
yield getTotalPrice('001', '002');  
}

```

**解耦副作用**在函数式编程的实践中非常常见，例如redux-saga，将副作用从saga中分离，自己不处理副作用，只负责发起请求

```js
function* fetchUser(action) {
   try {
      const user = yield call(Api.fetchUser, action.payload.userId);
      yield put({type: "USER_FETCH_SUCCEEDED", user: user});
   } catch (e) {
      yield put({type: "USER_FETCH_FAILED", message: e.message});
   }
}
```

严格意义上讲react是不支持Algebraic Effects的，但是react有Fiber啊，**执行完这个Fiber的更新之后交还执行权给浏览器，让浏览器决定后面怎么调度，由此可见Fiber得是一个链表结构才能达到这样的效果**，

Suspense也是这种概念的延伸，后面看到了具体的Suspense的源码就有些感觉了。先看个例子

```js
const ProductResource = createResource(fetchProduct);

const Proeuct = (props) => {
    const p = ProductResource.read( // 用同步的方式来编写异步代码!
          props.id
    );
  return <h3>{p.price}</h3>;
}

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Proeuct id={123} />
      </Suspense>
    </div>
  );
}
```

可以看到ProductResource.read完全是同步的写法，把获取数据的部分完全分离出了Proeuct组件之外，在源码中，ProductResource.read会在获取数据之前会throw一个特殊的Promise，由于scheduler的存在，**scheduler可以捕获这个promise，暂停更新，等数据获取之后交还执行权**。ProductResource可以是localStorage甚至是redis、mysql等数据库，也就是组件即服务，可能以后会有server Component的出现。

## jsx&核心api

### virtual Dom是什么

一句话概括就是，用js对象表示dom信息和结构，更新时重新渲染更新后的对象对应的dom，这个对象就是React.createElement()的返回结果

virtual Dom是一种编程方式，它以**对象的形式保存在内存中，它描述了我们dom的必要信息，并且用类似react-dom等模块与真实dom同步**，这一过程也叫协调(reconciler)，这种方式**可以声明式的渲染相应的ui状态，让我们从dom操作中解放出来**，**在react中是以fiber树的形式存放组件树的相关信息，在更新时可以增量渲染相关dom，所以fiber也是virtual Dom实现的一部分**

### 为什么要用virtual Dom

**大量的dom操作慢，很小的更新都有可能引起页面的重新排列，js对象优于在内存中，处理起来更快，可以通过diff算法比较新老virtual Dom的差异，并且批量、异步、最小化的执行dom的变更，以提高性能**

另外就是可以跨平台，jsx --> ReactElement对象 --> 真实节点，有中间层的存在，就可以在操作真实节点之前进行对应的处理，处理的结果反映到真实节点上，这个真实节点可以是浏览器环境，也可以是Native环境

virtual Dom真的快吗？其实virtual Dom**只是在更新的时候快**，在应用初始的时候不一定快

![react源码5.1](https://xiaochen1024.com/20210529105653.png)

```js
const div = document.createElement('div');
let str = ''
for(let k in div){
  str+=','+k
}
console.log(str)
```

![react源码5.2](https://xiaochen1024.com/20210529110136.png)

### jsx&createElement

jsx可以声明式的描述视图，提升开发效率，通过babel可以转换成React.createElement()的语法糖，也是js语法的扩展。

jsx是**ClassComponent的render函数**或者**FunctionComponent的返回值**，可以用来表示组件的内容，在经过babel编译之后，最后会被编译成`React.createElement`，这就是为什么jsx文件要声明`import React from 'react'`的原因（react17之后不用导入），你可以在 babel编译jsx 站点查看jsx被编译后的结果

 `React.createElement`的源码中做了如下几件事

-   处理config，把除了保留属性外的其他config赋值给props
-   把children处理后赋值给props.children
-   处理defaultProps
-   调用ReactElement返回一个**jsx对象**(virtual-dom)

```js
//ReactElement.js
export function createElement(type, config, children) {
  let propName;

  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  if (config != null) {
    //处理config，把除了保留属性外的其他config赋值给props
    //...
  }

  const childrenLength = arguments.length - 2;
  //把children处理后赋值给props.children
  //...

  //处理defaultProps
  //...

  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}

const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,//表示是ReactElement类型

    type: type,//class或function
    key: key,//key
    ref: ref,//ref属性
    props: props,//props
    _owner: owner,
  };

  return element;
};
```

`$$typeof`表示的是**组件的类型**，例如在源码中有一个检查是否是合法Element的函数，就是根`object.$$typeof === REACT_ELEMENT_TYPE`来判断的

```js
//ReactElement.js
export function isValidElement(object) {
  return (
    typeof object === 'object' &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
}
```

如果**组件是ClassComponent则type是class本身**，**如果组件是FunctionComponent创建的，则type是这个function**，源码中用ClassComponent.prototype.isReactComponent来区别二者。注意class或者function创建的组件一定要首**字母大写，不然后被当成普通节点，type就是字符串**。

jsx对象**上没有优先级、状态、effectTag等标记**，这些**标记在Fiber对象上**，在mount时Fiber根据jsx对象来构建，**在update时根据最新状态的jsx和current Fiber对比**，形成新的workInProgress Fiber，**最后workInProgress Fiber切换成current Fiber**。

### render

```js
//ReactDOMLegacy.js
export function render(
  element: React$Element<any>,//jsx对象
  container: Container,//挂载dom
  callback: ?Function,//回调
) {
  
  return legacyRenderSubtreeIntoContainer(
    null,
    element,
    container,
    false,
    callback,
  );
}
```

可以看到render所做的事也就是调用legacyRenderSubtreeIntoContainer，这个函数在下一章讲解，这里重点关注ReactDom.render()使用时候的三个参数。

#### component

```js
//ReactBaseClasses.js
function Component(props, context, updater) {
  this.props = props;//props属性
  this.context = context;//当前的context
  this.refs = emptyObject;//ref挂载的对象
  this.updater = updater || ReactNoopUpdateQueue;//更新的对像
}

Component.prototype.isReactComponent = {};//表示是classComponent
```

component函数中主要在当前实例上**挂载了props、context、refs、updater等**，所以在组件的实例上能拿到这些，而更新主要的承载结构就是updater， 主要关注isReactComponent，它用来表示这个组件是类组件

总结：jsx是React.createElement的语法糖，jsx通过babel转化成React.createElement函数，React.createElement执行之后**返回jsx对象，也叫virtual-dom**，Fiber会根据jsx对象和current Fiber进行对比形成workInProgress Fiber

pureComponent也很简单，和component差不多，**他会进行原型继承，然后赋值isPureReactComponent**

```js
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
pureComponentPrototype.constructor = PureComponent;
Object.assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true;

export {Component, PureComponent};
```

## legacy和concurrent模式入口函数

### react启动的模式

react有3种模式进入主体函数的入口，我们可以从 react官方文档 [使用 Concurrent 模式（实验性）](https://zh-hans.reactjs.org/docs/concurrent-mode-adoption.html#feature-comparison)中对比三种模式：

-   **legacy 模式：** `ReactDOM.render(<App />, rootNode)`。这是当前 React app 使用的方式。当前没有计划删除本模式，但是这个模式可能不支持这些新功能。
-   **blocking 模式：** `ReactDOM.createBlockingRoot(rootNode).render(<App />)`。目前正在实验中。作为迁移到 concurrent 模式的第一个步骤。
-   **concurrent 模式：** `ReactDOM.createRoot(rootNode).render(<App />)`。目前在实验中，未来稳定之后，打算作为 React 的默认开发模式。这个模式开启了_所有的_新功能。

**特性对比：**

#### ![react源码6.1](https://xiaochen1024.com/20210529105705.png)

legacy 模式在合成事件中有自动批处理的功能，但仅限于一个浏览器任务。非 React 事件想使用这个功能必须使用 `unstable_batchedUpdates`。在 blocking 模式和 concurrent 模式下，所有的 `setState` 在默认情况下都是批处理的。会在开发中发出警告

#### 不同模式在react运行时的含义

legacy模式是我们常用的，它构建dom的过程是同步的，所以在render的reconciler中，如果diff的过程特别耗时，那么导致的结果就是js一直阻塞高优先级的任务(例如用户的点击事件)，表现为页面的卡顿，无法响应。

concurrent Mode是react未来的模式，它用时间片调度实现了异步可中断的任务，根据设备性能的不同，时间片的长度也不一样，在每个时间片中，如果任务到了过期时间，就会主动让出线程给高优先级的任务。这部分将在 scheduler&lane模型 中解释。

#### 两种模式函数主要执行过程

**1.主要执行流程：**

![react源码6.3](https://xiaochen1024.com/20210529105709.png)

2.**详细函数调用过程**：

用demo\_0跟着视频调试更加清晰，黄色部分是主要任务是创建fiberRootNode和rootFiber，红色部分是创建Update，蓝色部分是调度render阶段的入口函数

![react源码6.2](https://xiaochen1024.com/20210529105712.png)

**3.legacy模式：**

- render调用legacyRenderSubtreeIntoContainer，最后createRootImpl会调用到createFiberRoot创建fiberRootNode,然后调用createHostRootFiber创建rootFiber，其中fiberRootNode是整个项目的的根节点，rootFiber是当前应用挂在的节点，也就是ReactDOM.render调用后的根节点

    ```js
    //最上层的节点是整个项目的根节点fiberRootNode
    ReactDOM.render(<App />, document.getElementById("root"));//rootFiber
    ReactDOM.render(<App />, document.getElementById("root"));//rootFiber
    ```

    ![react源码7.1](https://xiaochen1024.com/20210529105717.png)

- 创建完Fiber节点后，legacyRenderSubtreeIntoContainer调用updateContainer创建创建Update对象挂载到updateQueue的环形链表上，然后执行scheduleUpdateOnFiber调用performSyncWorkOnRoot进入render阶段和commit阶段

**4.concurrent模式：**

-   createRoot调用createRootImpl创建fiberRootNode和rootNode
-   创建完Fiber节点后，调用ReactDOMRoot.prototype.render执行updateContainer，然后scheduleUpdateOnFiber异步调度performConcurrentWorkOnRoot进入render阶段和commit阶段

**5.legacy模式主要函数注释**

```js
function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
  //...
  var root = container._reactRootContainer;
  var fiberRoot;

  if (!root) {
    // mount时
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate);//创建root节点
    fiberRoot = root._internalRoot;

    if (typeof callback === 'function') {//处理回调
      var originalCallback = callback;

      callback = function () {
        var instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    } 


    unbatchedUpdates(function () {
      updateContainer(children, fiberRoot, parentComponent, callback);//创建update入口
    });
  } else {
    // update时
    fiberRoot = root._internalRoot;

    if (typeof callback === 'function') {//处理回调
      var _originalCallback = callback;

      callback = function () {
        var instance = getPublicRootInstance(fiberRoot);

        _originalCallback.call(instance);
      };
    } 
    
    updateContainer(children, fiberRoot, parentComponent, callback);
  }
}
```

```js
function createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks) {
  var root = new FiberRootNode(containerInfo, tag, hydrate);//创建fiberRootNode
  const uninitializedFiber = createHostRootFiber(tag);//创建rootFiber
  //rootFiber和fiberRootNode连接
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;
  //创建updateQueue
  initializeUpdateQueue(uninitializedFiber);
  return root;
}

//对于HostRoot或者ClassComponent会使用initializeUpdateQueue创建updateQueue，然后将updateQueue挂载到fiber节点上
export function initializeUpdateQueue<State>(fiber: Fiber): void {
  const queue: UpdateQueue<State> = {
    baseState: fiber.memoizedState,//初始state，后面会基于这个state，根据Update计算新的state
    firstBaseUpdate: null,//Update形成的链表的头
    lastBaseUpdate: null,//Update形成的链表的尾
//新产生的update会以单向环状链表保存在shared.pending上，计算state的时候会剪开这个环状链表，并且连接在  //lastBaseUpdate后
    shared: {
      pending: null,
    },
    effects: null,
  };
  fiber.updateQueue = queue;
}
```

```js
function updateContainer(element, container, parentComponent, callback) {
  var lane = requestUpdateLane(current$1);//获取当前可用lane 在12章讲解
  var update = createUpdate(eventTime, lane); //创建update

  update.payload = {
    element: element//jsx
  };

  enqueueUpdate(current$1, update);//update入队
  scheduleUpdateOnFiber(current$1, lane, eventTime);//调度update
  return lane;
}
```

```js
function scheduleUpdateOnFiber(fiber, lane, eventTime) {
  if (lane === SyncLane) {//同步lane 对应legacy模式
    //...
    performSyncWorkOnRoot(root);//render阶段的起点 render在第6章讲解
  } else {//concurrent模式
    //...
    ensureRootIsScheduled(root, eventTime);//确保root被调度
  } 
}
```

**6.concurrent主要函数注释：**

```js
function ensureRootIsScheduled(root, currentTime) {
  //...
  var nextLanes = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes); //计算nextLanes

  //...

 //将lane的优先级转换成schduler的优先级
  var schedulerPriorityLevel = lanePriorityToSchedulerPriority(newCallbackPriority);
  //以schedulerPriorityLevel的优先级执行performConcurrentWorkOnRoot 也就是concurrent模式的起点
  newCallbackNode =   scheduleCallback(schedulerPriorityLevel,performConcurrentWorkOnRoot.bind(null, root));
}
```

**7.两种模式的不同点：**

1.  createRootImpl中传入的第二个参数不一样 一个是LegacyRoot一个是ConcurrentRoot
2.  requestUpdateLane中获取的lane的优先级不同
3.  在函数scheduleUpdateOnFiber中根据不同优先级进入不同分支，legacy模式进入performSyncWorkOnRoot，concurrent模式会异步调度performConcurrentWorkOnRoot

## Fiber架构

### Fiber的深度理解

react15在render阶段的reconcile是不可打断的，这会在进行大量节点的reconcile时可能产生卡顿，因为浏览器所有的时间都交给了js执行，并且js的执行时单线程。为此react16之后就有了**scheduler进行时间片的调度，给每个task（工作单元）一定的时间，如果在这个时间内没执行完，也要交出执行权给浏览器进行绘制和重排，所以异步可中断的更新需要一定的数据结构在内存中来保存工作单元的信息，这个数据结构就是Fiber**。

那么有了Fiber这种数据结构后，能完成哪些事情呢，

-   **工作单元 任务分解** ：Fiber最重要的功能就是作为工作单元，保存原生节点或者组件节点对应信息（包括优先级），这些节点通过指针的形似形成Fiber树
-   **增量渲染**：通过jsx对象和current Fiber的对比，生成最小的差异补丁，应用到真实节点上
-   **根据优先级暂停、继续、排列优先级**：Fiber节点上保存了优先级，能通过不同节点优先级的对比，达到任务的暂停、继续、排列优先级等能力，也为上层实现批量更新、Suspense提供了基础
-   **保存状态**：因为Fiber能保存状态和更新的信息，所以就能实现函数组件的状态更新，也就是hooks

#### Fiber的数据结构

Fiber的自带的属性如下：

```js
//ReactFiber.old.js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  //作为静态的数据结构 保存节点的信息 
  this.tag = tag;//对应组件的类型
  this.key = key;//key属性
  this.elementType = null;//元素类型
  this.type = null;//func或者class
  this.stateNode = null;//真实dom节点

  //作为fiber数架构 连接成fiber树
  this.return = null;//指向父节点
  this.child = null;//指向child
  this.sibling = null;//指向兄弟节点
  this.index = 0;

  this.ref = null;

  //用作为工作单元 来计算state
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;
    
//effect相关
  this.effectTag = NoEffect;
  this.nextEffect = null;
  this.firstEffect = null;
  this.lastEffect = null;

  //优先级相关的属性
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  //current和workInProgress的指针
  this.alternate = null;
}
```

#### Fiber双缓存

现在我们知道了Fiber可以保存真实的dom，真实dom对应在内存中的Fiber节点会形成Fiber树，这颗Fiber树在react中叫current Fiber，也就是当前dom树对应的Fiber树，而正在构建Fiber树叫workInProgress Fiber，这两颗树的节点通过alternate相连.

```js
function App() {
  return (
<>
      <h1>
        <p>count</p> xiaochen
      </h1>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById("root"));
```

![react源码7.2](https://xiaochen1024.com/20210529105724.png)

构建workInProgress Fiber发生在createWorkInProgress中，它能创建或者服用Fiber

```js
//ReactFiber.old.js
export function createWorkInProgress(current: Fiber, pendingProps: any): Fiber {
  let workInProgress = current.alternate;
  if (workInProgress === null) {//区分是在mount时还是在update时
    workInProgress = createFiber(
      current.tag,
      pendingProps,
      current.key,
      current.mode,
    );
    workInProgress.elementType = current.elementType;
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
   
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = pendingProps;//复用属性
    workInProgress.type = current.type;
    workInProgress.flags = NoFlags;

    workInProgress.nextEffect = null;
    workInProgress.firstEffect = null;
    workInProgress.lastEffect = null;

    //...
  }

  workInProgress.childLanes = current.childLanes;//复用属性
  workInProgress.lanes = current.lanes;

  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;

  const currentDependencies = current.dependencies;
  workInProgress.dependencies =
    currentDependencies === null
      ? null
      : {
          lanes: currentDependencies.lanes,
          firstContext: currentDependencies.firstContext,
        };

  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;
  workInProgress.ref = current.ref;


  return workInProgress;
}
```

- 在mount时：会创建fiberRoot和rootFiber，然后根据jsx对象创建Fiber节点，节点连接成current Fiber树。 ![react源码7.1](https://xiaochen1024.com/20210529105729.png)

- 在update时：会根据新的状态形成的jsx（ClassComponent的render或者FuncComponent的返回值）和current Fiber对比形（diff算法）成一颗叫workInProgress的Fiber树，然后将fiberRoot的current指向workInProgress树，此时workInProgress就变成了current Fiber。fiberRoot：指整个应用的根节点，只存在一个

    > fiberRoot：指整个应用的根节点，只存在一个
    >
    > rootFiber：ReactDOM.render或者ReactDOM.unstable\_createRoot创建出来的应用的节点，可以存在多个。

我们现在知道了存在current Fiber和workInProgress Fiber两颗Fiber树，Fiber双缓存指的就是，在经过reconcile（diff）形成了新的workInProgress Fiber然后将workInProgress Fiber切换成current Fiber应用到真实dom中，存在双Fiber的好处是在内存中形成视图的描述，在最后应用到dom中，减少了对dom的操作。

**现在来看看Fiber双缓存创建的过程图**：

-   **mount时：**

    1.  刚开始只创建了fiberRoot和rootFiber两个节点 ![react源码7.6](https://xiaochen1024.com/20210529105732.png)

    2.  然后根据jsx创建workInProgress Fiber： ![react源码7.7](https://xiaochen1024.com/20210529105735.png)

    3.  把workInProgress Fiber切换成current Fiber ![react源码7.8](https://xiaochen1024.com/20210529105738.png)

-   **update时**

    1.  根据current Fiber创建workInProgress Fiber ![react源码7.9](https://xiaochen1024.com/20210529105741.png)
    2.  把workInProgress Fiber切换成current Fiber

![react源码7.8](https://xiaochen1024.com/20210529105745.png)

## render阶段

#### render阶段的入口

render阶段的主要工作是构建Fiber树和生成effectList，我们知道了react入口的两种模式会进入**performSyncWorkOnRoot**或者**performConcurrentWorkOnRoot**，而这两个方法分别会调用**workLoopSync**或者**workLoopConcurrent**

```js
//ReactFiberWorkLoop.old.js
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```

这两函数的区别是判断条件**是否存在shouldYield的执行**，**如果浏览器没有足够的时间，那么会终止while循环，也不会执行后面的performUnitOfWork函数，自然也不会执行后面的render阶段和commit阶段**，这部分属于scheduler的知识点。

- workInProgress：新创建的workInProgress fiber

- performUnitOfWork：workInProgress fiber和会和已经创建的Fiber连接起来形成Fiber树。这个过程类似深度优先遍历，我们暂且称它们为‘捕获阶段’和‘冒泡阶段’。伪代码执行的过程大概如下

    ```js
    function performUnitOfWork(fiber) {
      if (fiber.child) {
        performUnitOfWork(fiber.child);//beginWork
      }
      
      if (fiber.sibling) {
        performUnitOfWork(fiber.sibling);//completeWork
      }
    }
    ```

#### render阶段整体执行流程

![react源码8.1](https://xiaochen1024.com/20210529105753.png)

- 捕获阶段 从根节点rootFiber开始，遍历到叶子节点，每次遍历到的节点都会执行beginWork，并且传入当前Fiber节点，然后创建或复用它的子Fiber节点，并赋值给workInProgress.child。

- 冒泡阶段 在捕获阶段遍历到子节点之后，会执行completeWork方法，执行完成之后会判断此节点的兄弟节点存不存在，如果存在就会为兄弟节点执行completeWork，当全部兄弟节点执行完之后，会向上‘冒泡’到父节点执行completeWork，直到rootFiber。

- 示例

    ```js
    function App() {
      return (
    <>
          <h1>
            <p>count</p> xiaochen
          </h1>
        </>
      )
    }
      
    ReactDOM.render(<App />, document.getElementById("root"));
    ```

    当执行完深度优先遍历之后形成的Fiber树：

    ![react源码7.2](https://xiaochen1024.com/20210529105757.png)

图中的数字是遍历过程中的顺序，可以看到，遍历的过程中会从应用的根节点rootFiber开始，依次执行beginWork和completeWork，最后形成一颗Fiber树，每个节点以child和return相连。

> 注意：当遍历到只有一个子文本节点的Fiber时，该Fiber节点的子节点不会执行beginWork和completeWork，如图中的‘chen’文本节点。这是react的一种优化手段

#### beginWork

beginWork主要的工作是创建或复用子fiber节点

```js
function beginWork(
  current: Fiber | null,//当前存在于dom树中对应的Fiber树
  workInProgress: Fiber,//正在构建的Fiber树
  renderLanes: Lanes,//第12章在讲
): Fiber | null {
 // 1.update时满足条件即可复用current fiber进入bailoutOnAlreadyFinishedWork函数
  if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;
    if (
      oldProps !== newProps ||
      hasLegacyContextChanged() ||
      (__DEV__ ? workInProgress.type !== current.type : false)
    ) {
      didReceiveUpdate = true;
    } else if (!includesSomeLane(renderLanes, updateLanes)) {
      didReceiveUpdate = false;
      switch (workInProgress.tag) {
        // ...
      }
      return bailoutOnAlreadyFinishedWork(
        current,
        workInProgress,
        renderLanes,
      );
    } else {
      didReceiveUpdate = false;
    }
  } else {
    didReceiveUpdate = false;
  }

  //2.根据tag来创建不同的fiber 最后进入reconcileChildren函数
  switch (workInProgress.tag) {
    case IndeterminateComponent: 
      // ...
    case LazyComponent: 
      // ...
    case FunctionComponent: 
      // ...
    case ClassComponent: 
      // ...
    case HostRoot:
      // ...
    case HostComponent:
      // ...
    case HostText:
      // ...
  }
}
```

从代码中可以看到参数中有current Fiber，也就是当前真实dom对应的Fiber树，在之前介绍Fiber双缓存机制中，我们知道在首次渲染时除了rootFiber外，current 等于 null，因为首次渲染dom还没构建出来，在update时current不等于 null，因为update时dom树已经存在了，所以beginWork函数中用current === null来判断是mount还是update进入不同的逻辑

-   mount：根据fiber.tag进入不同fiber的创建函数，最后都会调用到reconcileChildren创建子Fiber
-   update：在构建workInProgress的时候，当满足条件时，会复用current Fiber来进行优化，也就是进入bailoutOnAlreadyFinishedWork的逻辑，能复用didReceiveUpdate变量是false，复用的条件是
    1.  oldProps ==`= newProps && workInProgress.type =`== current.type 属性和fiber的type不变
    2.  !includesSomeLane(renderLanes, updateLanes) 更新的优先级是否足够，第15章讲解

#### reconcileChildren/mountChildFibers

创建子fiber的过程会进入reconcileChildren，该函数的作用是为workInProgress fiber节点生成它的child fiber即 workInProgress.child。然后继续深度优先遍历它的子节点执行相同的操作。

```js
//ReactFiberBeginWork.old.js
export function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any,
  renderLanes: Lanes
) {
  if (current === null) {
    //mount时
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes,
    );
  } else {
    //update
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes,
    );
  }
}
```

reconcileChildren会区分mount和update两种情况，进入reconcileChildFibers或mountChildFibers，reconcileChildFibers和mountChildFibers最终其实就是ChildReconciler传递不同的参数返回的函数，这个参数用来表示是否追踪副作用，在ChildReconciler中用shouldTrackSideEffects来判断是否为对应的节点打上effectTag，例如如果一个节点需要进行插入操作，需要满足两个条件：

1. fiber.stateNode!==null 即fiber存在真实dom，真实dom保存在stateNode上

2. (fiber.effectTag & Placement) !== 0 fiber存在Placement的effectTag

    ```js
    var reconcileChildFibers = ChildReconciler(true);
    var mountChildFibers = ChildReconciler(false);
    ```

    ```js
    function ChildReconciler(shouldTrackSideEffects) {
    function placeChild(newFiber, lastPlacedIndex, newIndex) {
        newFiber.index = newIndex;
         
        if (!shouldTrackSideEffects) {//是否追踪副作用
          // Noop.
          return lastPlacedIndex;
        }
         
        var current = newFiber.alternate;
         
        if (current !== null) {
          var oldIndex = current.index;
         
          if (oldIndex < lastPlacedIndex) {
            // This is a move.
            newFiber.flags = Placement;
            return lastPlacedIndex;
          } else {
            // This item can stay in place.
            return oldIndex;
          }
        } else {
          // This is an insertion.
          newFiber.flags = Placement;
          return lastPlacedIndex;
        }
      }
    }
    ```

在之前心智模型的介绍中，我们知道为Fiber打上effectTag之后在commit阶段会被执行对应dom的增删改，而且在reconcileChildren的时候，rootFiber是存在alternate的，即rootFiber存在对应的current Fiber，所以rootFiber会走reconcileChildFibers的逻辑，所以shouldTrackSideEffects等于true会追踪副作用，最后为rootFiber打上Placement的effectTag，然后将dom一次性插入，提高性能。

```js
export const NoFlags = /*                      */ 0b0000000000000000000;
// 插入dom
export const Placement = /*                */ 0b00000000000010;
```

在源码的ReactFiberFlags.js文件中，用二进制位运算来判断是否存在Placement,例如让var a = NoFlags,如果需要在a上增加Placement的effectTag，就只要 effectTag | Placement就可以了

![react源码8.4](https://xiaochen1024.com/20210529110149.png)

#### bailoutOnAlreadyFinishedWork

```js
//ReactFiberBeginWork.old.js
function bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes) {
  
  //...
if (!includesSomeLane(renderLanes, workInProgress.childLanes)) {
    
    return null;
    
  } else {
    
    cloneChildFibers(current, workInProgress);
    
    return workInProgress.child;
    
  }
}
```

如果进入了bailoutOnAlreadyFinishedWork复用的逻辑，会判断优先级第12章介绍，优先级足够则进入cloneChildFibers否则返回null

#### completeWork

completeWork主要工作是处理fiber的props、创建dom、创建effectList

```js
//ReactFiberCompleteWork.old.js
function completeWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  const newProps = workInProgress.pendingProps;
    
//根据workInProgress.tag进入不同逻辑，这里我们关注HostComponent，HostComponent，其他类型之后在讲
  switch (workInProgress.tag) {
    case IndeterminateComponent:
    case LazyComponent:
    case SimpleMemoComponent:
    case HostRoot:
   //...
      
    case HostComponent: {
      popHostContext(workInProgress);
      const rootContainerInstance = getRootHostContainer();
      const type = workInProgress.type;

      if (current !== null && workInProgress.stateNode != null) {
        // update时
       updateHostComponent(
          current,
          workInProgress,
          type,
          newProps,
          rootContainerInstance,
        );
      } else {
        // mount时
        const currentHostContext = getHostContext();
        // 创建fiber对应的dom节点
        const instance = createInstance(
            type,
            newProps,
            rootContainerInstance,
            currentHostContext,
            workInProgress,
          );
        // 将后代dom节点插入刚创建的dom里
        appendAllChildren(instance, workInProgress, false, false);
        // dom节点赋值给fiber.stateNode
        workInProgress.stateNode = instance;

        // 处理props和updateHostComponent类似
        if (
          finalizeInitialChildren(
            instance,
            type,
            newProps,
            rootContainerInstance,
            currentHostContext,
          )
        ) {
          markUpdate(workInProgress);
        }
     }
      return null;
    }
```

从简化版的completeWork中可以看到，这个函数做了一下几件事

-   根据workInProgress.tag进入不同函数，我们以HostComponent举例
-   update时（除了判断`current===null外还需要判断workInProgress.stateNode===null`），调用updateHostComponent处理props（包括onClick、style、children ...），并将处理好的props赋值给updatePayload,最后会保存在workInProgress.updateQueue上
-   mount时 调用createInstance创建dom，将后代dom节点插入刚创建的dom中，调用finalizeInitialChildren处理props（和updateHostComponent处理的逻辑类似）

之前我们有说到在beginWork的mount时，rootFiber存在对应的current，所以他会执行mountChildFibers打上Placement的effectTag，在冒泡阶段也就是执行completeWork时，我们将子孙节点通过appendAllChildren挂载到新创建的dom节点上，最后就可以一次性将内存中的节点用dom原生方法反应到真实dom中。

 在beginWork 中我们知道有的节点被打上了effectTag的标记，有的没有，而在commit阶段时要遍历所有包含effectTag的Fiber来执行对应的增删改，那我们还需要从Fiber树中找到这些带effectTag的节点嘛，答案是不需要的，这里是以空间换时间，在执行completeWork的时候遇到了带effectTag的节点，会将这个节点加入一个叫effectList中,所以在commit阶段只要遍历effectList就可以了（rootFiber.firstEffect.nextEffect就可以访问带effectTag的Fiber了）

 effectList的指针操作发生在completeUnitOfWork函数中，例如我们的应用是这样的

```js
function App() {
  
  const [count, setCount] = useState(0);
  
  return (
    
    <>
      <h1
        onClick={() => {
          setCount(() => count + 1);
        }}
      >
        <p title={count}>{count}</p> xiaochen
      </h1>
    </>
  )
  
}
```

那么我们的操作effectList指针如下（这张图是操作指针过程中的图，此时遍历到了app Fiber节点，当遍历到rootFiber时，h1，p节点会和rootFiber形成环状链表）

![react源码8.2](https://xiaochen1024.com/20210529105807.png)

```js
rootFiber.firstEffect===h1

rootFiber.firstEffect.next===p
```

形成环状链表的时候会从触发更新的节点向上合并effectList直到rootFiber，这一过程发生在completeUnitOfWork函数中，整个函数的作用就是向上合并effectList

```js
//ReactFiberWorkLoop.old.js
function completeUnitOfWork(unitOfWork: Fiber): void {
  let completedWork = unitOfWork;
  do {
    //...

      if (
        returnFiber !== null &&
        (returnFiber.flags & Incomplete) === NoFlags
      ) {
        if (returnFiber.firstEffect === null) {
          returnFiber.firstEffect = completedWork.firstEffect;//父节点的effectList头指针指向completedWork的effectList头指针
        }
        if (completedWork.lastEffect !== null) {
          if (returnFiber.lastEffect !== null) {
            //父节点的effectList头尾指针指向completedWork的effectList头指针
            returnFiber.lastEffect.nextEffect = completedWork.firstEffect;
          }
          //父节点头的effectList尾指针指向completedWork的effectList尾指针
          returnFiber.lastEffect = completedWork.lastEffect;
        }

        const flags = completedWork.flags;
        if (flags > PerformedWork) {
          if (returnFiber.lastEffect !== null) {
            //completedWork本身追加到returnFiber的effectList结尾
            returnFiber.lastEffect.nextEffect = completedWork;
          } else {
            //returnFiber的effectList头节点指向completedWork
            returnFiber.firstEffect = completedWork;
          }
          //returnFiber的effectList尾节点指向completedWork
          returnFiber.lastEffect = completedWork;
        }
      }
    } else {

      //...

      if (returnFiber !== null) {
        returnFiber.firstEffect = returnFiber.lastEffect = null;//重制effectList
        returnFiber.flags |= Incomplete;
      }
    }

  } while (completedWork !== null);

//...
}
```

最后生成的fiber树如下

![react源码8.3](https://xiaochen1024.com/20210529105811.png)

然后commitRoot(root);进入commit阶段

## diff算法

在render阶段**更新Fiber节点**时，我们会调用**reconcileChildFibers**对比**current Fiber和jsx对象构建workInProgress Fiber**，这里current Fiber是指当前dom对应的fiber树，jsx是class组件render方法或者函数组件的返回值。

在`reconcileChildFibers`中会根据`newChild`的类型来进入**单节点的diff或者多节点diff**

```js
//ReactChildFiber.old.js
function reconcileChildFibers(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChild: any,
): Fiber | null {

  const isObject = typeof newChild === 'object' && newChild !== null;

  if (isObject) {
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE:
//单一节点diff
        return placeSingleChild(
            reconcileSingleElement(
              returnFiber,
              currentFirstChild,
              newChild,
              lanes,
            ),
          );
    }
  }
//...
  
  if (isArray(newChild)) {
     //多节点diff
    return reconcileChildrenArray(
        returnFiber,
        currentFirstChild,
        newChild,
        lanes,
      );
  }

  // 删除节点
  return deleteRemainingChildren(returnFiber, currentFirstChild);
}
```

**diff过程的主要流程如下图：**

![react源码9.5](https://xiaochen1024.com/20210529105818.png)

我们知道对比**[两颗树的复杂度本身是O(n3)](https://zhuanlan.zhihu.com/p/344702969)**，对我们的应用来说这个是不能承受的量级，react为了降低复杂度，**提出了三个前提：**

1. 只对**同级比较**，跨层级的dom不会进行复用

2. **不同类型节点生成的dom树不同**，此时**会直接销毁老节点及子孙节点，并新建节点**

3. 可以**通过key来对元素diff的过程提供复用的线索**，例如：

    ```js
    const a = (
        <>
          <p key="0">0</p>
          <p key="1">1</p>
        </>
      );
    const b = (
      <>
        <p key="1">1</p>
        <p key="0">0</p>
      </>
    );
    ```

     如果a和b里的元素都没有key，因为节点的**更新前后文本节点不同**，导致他们都不能复用，所以**会销毁之前的节点**，并新建节点，但是现在**有key**了，b中的节点会**在老的a中寻找key相同的节点尝试复用，最后发现只是交换位置就可以完成更新**，具体对比过程后面会讲到。

#### 单节点diff

单点diff有如下几种情况：

-   **key和type相同表示**可以复用节点
-   key不同**直接标记删除节点**，然后新建节点
-   key相同type不同，标记删除该节点和兄弟节点，然后**新创建节点**

```js
function reconcileSingleElement(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  element: ReactElement
): Fiber {
  const key = element.key;
  let child = currentFirstChild;
  
  //child节点不为null执行对比
  while (child !== null) {

    // 1.比较key
    if (child.key === key) {

      // 2.比较type

      switch (child.tag) {
        //...
        
        default: {
          if (child.elementType === element.type) {
            // type相同则可以复用 返回复用的节点
            return existing;
          }
          // type不同跳出
          break;
        }
      }
      //key相同，type不同则把fiber及和兄弟fiber标记删除
      deleteRemainingChildren(returnFiber, child);
      break;
    } else {
      //key不同直接标记删除该节点
      deleteChild(returnFiber, child);
    }
    child = child.sibling;
  }
   
  //新建新Fiber
}
```

#### 多节点diff

多节点diff比较复杂，我们分三种情况进行讨论，其中**a表示更新前的节点，b表示更新后的节点**

- 属性变化

    ```js
    const a = (
        <>
          <p key="0" name='0'>0</p>
          <p key="1">1</p>
        </>
      );
      const b = (
        <>
          <p key="0" name='00'>0</p>
          <p key="1">1</p>
        </>
      );
    ```

- type变化

    ```js
    const a = (
        <>
          <p key="0">0</p>
          <p key="1">1</p>
        </>
      );
      const b = (
        <>
          <div key="0">0</div>
          <p key="1">1</p>
        </>
      );
    ```

- 新增节点

    ```js
    const a = (
        <>
          <p key="0">0</p>
          <p key="1">1</p>
        </>
      );
      const b = (
        <>
          <p key="0">0</p>
          <p key="1">1</p>
          <p key="2">2</p>
        </>
      );
    ```

- 节点删除

    ```js
    const a = (
        <>
          <p key="0">0</p>
          <p key="1">1</p>
          <p key="2">2</p>
        </>
      );
      const b = (
        <>
          <p key="0">0</p>
          <p key="1">1</p>
        </>
      );
    ```

- 节点位置变化

    ```js
    const a = (
        <>
          <p key="0">0</p>
          <p key="1">1</p>
        </>
      );
      const b = (
        <>
          <p key="1">1</p>
          <p key="0">0</p>
        </>
      );
    ```

在源码中**多节点diff有三个for循环遍历**（并不意味着所有更新都有经历三个遍历，进入循环体有条件，也有条件跳出循环），第一个**遍历处理节点的更新**（包括props更新和type更新和删除），第二个遍历处理其他的情况（节点新增），其原因在于在大多数的应用中，节点更新的频率更加频繁，第三个**处理节点位置改变**

- 第一次遍历 因为**老的节点**存在于**current Fiber**中，所以它是个**链表结构**，还记得Fiber双缓存结构嘛，节点通过child、return、sibling连接，而**newChildren存在于jsx当中**，所以遍历对比的时候，首先让`newChildren[i]` `oldFiber`对比，然后让i++、nextOldFiber = oldFiber.sibling。在第一轮遍历中，会处理三种情况，其中第1，2两种情况会结束第一次循环

    1.  key不同，第一次循环结束
    2.  newChildren或者oldFiber遍历完，第一次循环结束
    3.  key同type不同，标记oldFiber为DELETION
    4.  key相同type相同则可以复用

     newChildren遍历完，oldFiber没遍历完，在第一次遍历完成之后将oldFiber中没遍历完的节点标记为DELETION，即删除的DELETION Tag

- 第二个遍历 第二个遍历考虑三种情况

    1.  newChildren和oldFiber都遍历完：多节点diff过程结束

    2.  newChildren没遍历完，oldFiber遍历完，将剩下的newChildren的节点标记为Placement，即插入的Tag

    3.  newChildren和oldFiber没遍历完，则进入节点移动的逻辑

- 第三个遍历 主要逻辑在placeChild函数中，例如更新前节点顺序是ABCD，更新后是ACDB

    1.  newChild中第一个位置的A和oldFiber第一个位置的A，key相同可复用，lastPlacedIndex=0

    2.  newChild中第二个位置的C和oldFiber第二个位置的B，key不同跳出第一次循环，将oldFiber中的BCD保存在map中

    3.  newChild中第二个位置的C在oldFiber中的index=2 > lastPlacedIndex=0不需要移动，lastPlacedIndex=2

    4.  newChild中第三个位置的D在oldFiber中的index=3 > lastPlacedIndex=2不需要移动，lastPlacedIndex=3

    5.  newChild中第四个位置的B在oldFiber中的index=1 < lastPlacedIndex=3,移动到最后

    **看图更直观**

    ![react源码9.6](https://xiaochen1024.com/20210529105824.png)

    例如更新前节点顺序是ABCD，更新后是DABC

    1.  newChild中第一个位置的D和oldFiber第一个位置的A，key不相同不可复用，将oldFiber中的ABCD保存在map中，lastPlacedIndex=0

    2.  newChild中第一个位置的D在oldFiber中的index=3 > lastPlacedIndex=0不需要移动，lastPlacedIndex=3

        3.  newChild中第二个位置的A在oldFiber中的index=0 < lastPlacedIndex=3,移动到最后
        4.  newChild中第三个位置的B在oldFiber中的index=1 < lastPlacedIndex=3,移动到最后
        5.  newChild中第四个位置的C在oldFiber中的index=2 < lastPlacedIndex=3,移动到最后

    **看图更直观**

    ![react源码9.7](https://xiaochen1024.com/20210529105827.png)

 **代码如下**：

```js
//ReactChildFiber.old.js

function placeChild(newFiber, lastPlacedIndex, newIndex) {
       newFiber.index = newIndex;
   
       if (!shouldTrackSideEffects) {
         return lastPlacedIndex;
       }
   
    var current = newFiber.alternate;
 
       if (current !== null) {
         var oldIndex = current.index;
   
         if (oldIndex < lastPlacedIndex) {
           //oldIndex小于lastPlacedIndex的位置 则将节点插入到最后
           newFiber.flags = Placement;
           return lastPlacedIndex;
         } else {
           return oldIndex;//不需要移动 lastPlacedIndex = oldIndex;
         }
       } else {
         //新增插入
         newFiber.flags = Placement;
         return lastPlacedIndex;
       }
     }
```

```js
//ReactChildFiber.old.js

function reconcileChildrenArray(
    returnFiber: Fiber,//父fiber节点
    currentFirstChild: Fiber | null,//childs中第一个节点
    newChildren: Array<*>,//新节点数组 也就是jsx数组
    lanes: Lanes,//lane相关 第12章介绍
  ): Fiber | null {

    let resultingFirstChild: Fiber | null = null;//diff之后返回的第一个节点
    let previousNewFiber: Fiber | null = null;//新节点中上次对比过的节点

    let oldFiber = currentFirstChild;//正在对比的oldFiber
    let lastPlacedIndex = 0;//上次可复用的节点位置 或者oldFiber的位置
    let newIdx = 0;//新节点中对比到了的位置
    let nextOldFiber = null;//正在对比的oldFiber
    for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {//第一次遍历
      if (oldFiber.index > newIdx) {//nextOldFiber赋值
        nextOldFiber = oldFiber;
        oldFiber = null;
      } else {
        nextOldFiber = oldFiber.sibling;
      }
      const newFiber = updateSlot(//更新节点，如果key不同则newFiber=null
        returnFiber,
        oldFiber,
        newChildren[newIdx],
        lanes,
      );
      if (newFiber === null) {
        if (oldFiber === null) {
          oldFiber = nextOldFiber;
        }
        break;//跳出第一次遍历
      }
      if (shouldTrackSideEffects) {//检查shouldTrackSideEffects
        if (oldFiber && newFiber.alternate === null) {
          deleteChild(returnFiber, oldFiber);
        }
      }
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);//标记节点插入
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }

    if (newIdx === newChildren.length) {
      deleteRemainingChildren(returnFiber, oldFiber);//将oldFiber中没遍历完的节点标记为DELETION
      return resultingFirstChild;
    }

    if (oldFiber === null) {
      for (; newIdx < newChildren.length; newIdx++) {//第2次遍历
        const newFiber = createChild(returnFiber, newChildren[newIdx], lanes);
        if (newFiber === null) {
          continue;
        }
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);//插入新增节点
        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
      }
      return resultingFirstChild;
    }

    // 将剩下的oldFiber加入map中
    const existingChildren = mapRemainingChildren(returnFiber, oldFiber);

    for (; newIdx < newChildren.length; newIdx++) {//第三次循环 处理节点移动
      const newFiber = updateFromMap(
        existingChildren,
        returnFiber,
        newIdx,
        newChildren[newIdx],
        lanes,
      );
      if (newFiber !== null) {
        if (shouldTrackSideEffects) {
          if (newFiber.alternate !== null) {
            existingChildren.delete(//删除找到的节点
              newFiber.key === null ? newIdx : newFiber.key,
            );
          }
        }
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);//标记为插入的逻辑
        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
      }
    }

    if (shouldTrackSideEffects) {
      //删除existingChildren中剩下的节点
      existingChildren.forEach(child => deleteChild(returnFiber, child));
    }

    return resultingFirstChild;
  }
```