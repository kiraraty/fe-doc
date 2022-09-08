接下来将介绍 `context` 原理。重点流程放在 context 的**传递**和**更新**两个方面。对于原理部分，我在这里只介绍了新版本 Context 的原理。感兴趣的同学可以看一下源码。

以 `React 16.8` 为例子🌰：

-   新版本 Context 位置：`react-reconciler/src/ReactFiberNewContext.js`
-   老版本 Context 位置：`react-reconciler/src/ReactFiberContext.js`

希望大家带着这些问题去阅读

-   1 Provder 如何传递 context？
-   2 三种获取 context 原理 （ `Consumer`， `useContext`，`contextType` ）？
-   3 消费 `context` 的组件，context 改变，为什么会订阅更新 （如何实现） 。
-   4 context 更新，如何避免 `pureComponent` ， `shouldComponentUpdate` 渲染控制策略的影响。
-   5 如何实现的 context 嵌套传递 （ 多个 Povider ）?

### 1 context 对象

上述所说的老版本 context 就是 Legacy Context 模式下的 context ，老版本的 context 是采用约定式的使用规则，于是有了 `getChildContext` 和 `childContextTypes` 协商的属性和方法，这种方式不仅不够灵活，而且对于函数组件也存在局限性，所以在 `v16.3` 推出了新版本的 `context`，开发者能够更加灵活的运用 Context。新版本引入 context 对象的概念，而且 context 对象上除了保留了传递的信息 `value` 外 ， 还有提供者 `Provder` 和消费者 `Consumer`。

#### context 对象

要想吃透 context ，首先要研究一下 Context 对象是什么。上述讲到可以通过 `createContext` 创建一个 context 。那么万物之源就是这个 API ，接下来一起揭开 context 对象面纱。

```
export function createContext(defaultValue,calculateChangedBits){
   /* context 对象本质  */ 
  const context  = {
        $$typeof: REACT_CONTEXT_TYPE, /* 本质上就是 Consumer element 类型 */
        _calculateChangedBits: calculateChangedBits,
        _currentValue: defaultValue,
        _threadCount: 0,
        Provider: null,
        Consumer: null,
  };
  /* 本质上就是 Provider element 类型。  */
  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context,
  };
  context.Consumer = context 
}
```

如上可以很容易的看清楚 context 对象的本质，这里重点介绍三个属性

-   **`Provider`** 本质上是一个 element 对象 $$typeof -> `REACT_PROVIDER_TYPE`
-   **`Consumer`** 本质上也是一个 element 对象 $$typeof -> `REACT_CONTEXT_TYPE`
-   **`_currentValue`** 这个用来保存传递给 Provider 的 value 。

#### Provider 提供者

上述明白了 Provider 本质上是一个特殊的 React Element 对象，那么接下来重点看一下 Provider 的实现原理，研究 Provider 重点围绕这两个点。

-   Provider 如何传递 context 状态的。
-   Provider 中 value 改变，如何通知订阅 context。

之前的章节讲述了 **jsx -> element -> fiber** 的流程，按照这个逻辑，接下来看一下 Provdier 的处理。

-   首先标签形式的 `<Provider>` 本质上就是 `REACT_PROVIDER_TYPE` 的 React Element 。`<Provider>` -> `REACT_PROVIDER_TYPE` React element 。
-   接下来 element 会转化成 fiber ，fiber 类型为 **ContextProvider** ， React element -> `ContextProvide fiber`。

ContextProvider 类型的 fiber ，在 fiber 调和阶段会进入到 `beginWork` 流程，这个阶段会发生两件事。

-   如果当前类型的 fiber 不需要更新，那么会 `FinishedWork` 中止当前节点和子节点的更新。
-   如果当前类型 fiber 需要更新，那么会调用不同类型 fiber 的处理方法。当然 `ContextProvider` 也有特有的 fiber 更新方法 —— `updateContextProvider`，那么如果想要深入 `Provder` 的奥秘，有必要看一下这个方法做了些什么？

> react-reconciler/src/ReactFiberBeginWork.js

```
function updateContextProvider(current ,workInProgress,renderExpirationTime,) {
  /*  获取 Provder 上的 value  */
  pushProvider(workInProgress, newProps.value;);
  /* 更新 context  */
  if (oldProps !== null) {
    const changedBits = calculateChangedBits(context, newProps.value;, oldProps.value);
    if (changedBits === 0) {
      //context 没有变化。如果孩子们都是一样的话。那么不需要更新
      if (
        oldProps.children === newProps.children &&
        !hasLegacyContextChanged() 
      ) {
         return ...  // 停止调合子节点,收尾工作
      }
    } else { /* context 改变，更新 context */
      propagateContextChange( workInProgress,context, changedBits, renderExpirationTime,);
    }
  }
  /* 继续向下调和子代 fiber  */
  ...
}
```

如上保留了 `updateContextProvider` 的核心流程如下：

-   第一步： 首先会调用 `pushProvider`，`pushProvider` 会获取 type 属性上的 \_context 对象，就是上述通过 `createContext` 创建的 context 对象。然后将 Provider 的 value 属性，赋值给 context 的 \_currentValue 属性上。**这里解释了 Provder 通过什么手段传递 context value，即通过挂载 context 的 \_currentValue 属性。**
    
-   第二步： 通过 `calculateChangedBits` 计算出 changedBits ，`calculateChangedBits` 内部触发 context 对象上的 `_calculateChangedBits` ，细心的同学可以发现，在调用 `createContext` 的时候，实际上是有第二个参数的 `calculateChangedBits`，在更新 Provider 的时候这个参数就派上用场了，当它返回的 `changedBits === 0` 的时候，那么还会浅比较 children 是否发生变化，还有就是有没有 `legacy context`，如果这三点都满足的话，那么会判断当前 Provider 和子节点不需要更新，那么会 return 停止向下调和子节点。
    
-   第三步（**重点**）：在实际开发中，绝大多数当 value 发生变化，会走 `propagateContextChange` 这个流程，也是 Provider 更新的特点。那么这个方法到底做了些什么呢？接下来重点看一下这个函数做了些什么？
    

**propagateContextChange** 函数流程很繁琐，这里简化了流程，保留了最核心的部分。

```
function propagateContextChange(workInProgress,context){
    let fiber = workInProgress.child;
    if (fiber !== null) {
        fiber.return = workInProgress;
    }
    while(fiber !== null){
        const list = fiber.dependencies;
         while (dependency !== null) {
              if (dependency.context === context){
                   /* 类组件：不受 PureComponent 和 shouldComponentUpdate 影响 */
                   if (fiber.tag === ClassComponent) {
                         /* 会走 forceUpdate 逻辑 */
                        const update = createUpdate(renderExpirationTime, null);
                        update.tag = ForceUpdate;
                        enqueueUpdate(fiber, update);
                   }
                   /* 重要：TODO: 提高 fiber 的优先级，让当前 fiber 可以 beginWork ，并且向上更新父级 fiber 链上的优先级 */
                   ...
              } 
         }
    }
}
```

`propagateContextChange` 非常重要，它的职责就是深度遍历所有的子代 fiber ，然后找到里面具有 `dependencies` 的属性，对比 dependencies 中的 context 和当前 Provider 的 context 是否是同一个，如果是同一个，那么如果当前 fiber 是类组件，那么会给绑定一个 forceUpdate 标识 。然后会提高 fiber 的更新优先级，让 fiber 在接下来的调和过程中，处于一个高优先级待更新的状态。接下来的代码比较长，我这里没有全部罗列出来，大致逻辑就是，找到当前 fiber 向上的父级链上的 fiber ，统一更新他们的优先级，使之变成高优先级待更新状态。

那么上述流程中暴露出几个问题：

-   1 什么情况下 fiber 会存在 dependencies ，首先 dependencies 在第十七章中会讲到，它保存的是 context 的依赖项，那么什么情况下会存在 **context 依赖项**。
    
-   2 为什么对于 class 类组件会创建一个 ForceUpdate 类型的 update 对象呢？  
    知其然，知其所以然，首先看一下它是什么？
    

**｜--------问与答--------｜**  

问： **ForceUpdate 类型 update**： 什么是 forceUpdate 类型的 update 呢？

答：在类组件中，通过调用 `this.forceUpdate()` 带来的更新就会被打上 ForceUpdate 类型的 update tag，这里可以理解为强制更新。 生命周期章节讲过， 在类组件更新流程中，强制更新会跳过 `PureComponent` 和 `shouldComponentUpdate` 等优化策略。 **｜---------end---------｜**

-   3 存在 dependency 的 fiber ，为什么要向上更新父级 fiber 链上的优先级，让所有父级 fiber 都处于一个高优先级。

对于上面这三个问题，跟上我的思路逐一突破。

**第一个问题：** 首先就是 dependencies 属性，这个属性可以把当前的 fiber 和 context 建立起关联，那么可以理解成，使用了当前 context 的 fiber 会把 context 放在 dependencies 中，dependencies 属性本身是一个链表结构，一个 fiber 可以有多个 context 与之对应。反过来推测一下，什么情况下会使用 context 呢。那么有以下几种可能：

1 有 `contextType` 静态属性指向的类组件。  
2 使用 `useContext` hooks 的函数组件。  
3 context 提供的 `Consumer`。

那么可以大胆的推测一下，**使用过 contextType useContext 的组件对应 fiber,和 Consumer 类型 fiber，会和 dependencies 建立起联系，会把当前消费的 context 放入 dependencies 中。这个下面会给详细解释**

**第二个问题：** 为什么对于 class 组件会创建一个 ForceUpdate 的 update 呢？

在**生命周期章节**和**渲染控制章节**，讲到过如果想要让类组件调用 render，得到新的 children，那么就要通过 `PureComponent` 和 `shouldComponentUpdate` 等层层阻碍，那么 context 要突破这些控制，就要做到当 value 改变，消费 context 的类组件更新，则需要通过 forceUpdate 强制更新。这样就解决了类组件更新限制。

那么总结一下流程，当 Provider 的 value 更新之后，Provider 下面的只要有消费了 context 的类组件，就会触发强制更新。这也就解释了最开始的问题——**context 更新，如何避免 `pureComponent` ， `shouldComponentUpdate` 渲染控制策略的影响。** 用一幅流程图表示：

![context7.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ad02d5d2b0640ca8d376abebff714a2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

**第三个问题：** 这个问题就要从 Provider 类型的 fiber 调和开始讲。

#### Provider 和 beiginWork 调和更新机制

接下来重点介绍 Provider 和 beiginWork 调和更新机制。首先引出两个思考点：

-   第一个类组件执行 render ，函数组件执行就是渲染么？
-   第二个 Context 改变如何做到消费 context 的组件更新的？（更新原理）

先来看一下第一个思考点，关于渲染的思考，实际上在 React 整个 `Reconciler` 调和流程中，从更新调度任务的发起，再到在 commit 和 render 两大阶段，再到真实的 dom 元素绘制，每一个环节都属于渲染的一部分。而开发者能够控制的 render ，只是其中的一小部分——类组件执行 render ，函数组件执行。而且这些本质上都发生在 FunctionComponent fiber 和 ClassComponent fiber 上。但是整个 fiber 树在调和阶段都需要更新的。更新调和 fiber 的方法在 React 底层叫做 **`beginWork`**。有一个问题需要注意，就是 `beginWork` 非 render。先来看看两者的区别。

-   `beginWork` ： 在一次更新中，只要需要更新的 fiber 或者受到牵连的 fiber，都会执行 beginWork 。
-   `render` ： 在一次更新中，只有组件类型的 fiber 会执行 render ，得到新的 children 。如果组件触发 render 那么它一定经历过 `beginWork`

这里如果有同学不明白不要紧，接着往下看。

比如发生一次更新任务，此次更新可能发生整个 fiber 树的任意枝叶上，但是因为 context props 穿透影响，React 不知道此次更新的波及范围，那么如何处理呢？ React 会从 rootFiber 开始更新，每一个更新 fiber 都会走 `beginWork` 流程，开始找不同，找到有没有需要更新的地方，那么指标是什么呢，其中一个重要的指标就是**更新的优先级**，老版本用的是 `expirationTime` ，新版本用的是 `lane`，那么就要保证一个问题，就是如果更新发生在一个子代节点，那么只有父节点 `beginWork` 才能让子代节点 `beginWork`。这样就形成了一条 root fiber -> 父 fiber -> 子 fiber 的 `beginWork` 链。在 beginwork 过程中，有几种情况：

-   第一种： 如果遇到组件，而且更新不涉及当前组件，也不在当前组件的父子递归链上，那么就不会 render，也不会向下 beginWork 。
-   第二种： 如果遇到组件，而且更新不涉及当前组件，但是更新组件属于当前组件的子孙后代，那么不会 render，但是会向下 beginWork ，目的很明确，找到对应的更新组件。
-   第三种： 如果遇到其他类型的 fiber 比如 hostComponent `<div>` ，那么会对比当前的更新优先级，如果低优先级，那么不需要向下 beginWork 。反之向下 beginWork。

这么说可能大家不是很理解，我举一个例子：

如下当点击 componentB 下面的 span 触发 setState 更新 ，如下可以清晰看见 beginWork 和 render 流程。

![context8.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4be69acfeb8d42c68249f96b8bbb7b98~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

-   从 root 开始第一次调和， 三个 fiber 都会经历 beginWork ，通过对比优先级， `componentA` 和 `div` 停止向下 beginwork。
-   更新发生在 componentB ，所以 componentB 渲染，触发 `render` ，得到新的 element，通过对比， `div` `span` 都会 beginwork。
-   componentC 由于父组件更新，没有任何优化策略的情况，那么也会跟着 `render`，接着 div 也会跟着 beginwork。

那么如上，如果 componentC 通过 `PureComponent` 或者 `shouldComponentUpdate` 限制更新之后。那么会变成如下的样子：

![context9.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/76bac2d4e134455dbdf31fa33cd7f27b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

-   如上 componentC 通过 `PureComponent` 处理后，不再 render ，当然也不会再向下 beginwork。

接下来，如果点击 componentC 下的 div，触发 setState 更新，那么又会发生什么呢？

-   此时更新发生在 `componentC` 上，所以 componentB 只会发生 beginwork ，不会发生 render。
-   `componentB` 下面的 `div` 会停止向下的 beiginwork 。

![context10.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/015b6ad8e1404fae88319b150cd05451~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

**我们总结流程如下：**

-   1 如果一个组件发生更新，那么当前组件到 fiber root 上的父级链上的所有 fiber ，更新优先级都会升高，都会触发 beginwork 。
-   2 render 不等于 beginWork，但是 render 发生，一定触发了 beginwork 。
-   3 一次 beginwork ，一个 fiber 下的同级兄弟 fiber 会发生对比，找到任务优先级高的 fiber 。向下 beginwork 。

对于 beginwork 的流程，接下来会有专门的章节维护。

**Context 原理**

接下来言归正传，我们来研究一下 context 的更新原理，上面说到 `Provider` 更新，会递归所有的子组件，只要消费了 context 的子代 fiber ，都会给一个高优先级。而且向上更新父级 fiber 链上的优先级，让所有父级 fiber 都处于一个高优先级。那么接下来高优先级的 fiber 都会 beginWork 。

那么将上述例子进行修改，`propagateContextChange` 的流程会下如下一样，把父级 fiber 的优先级提高。

![context11.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84210209b512493889a9d2c3a066324e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

那么整个 fiber 更新流程会像如下一样

![context12.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/761505beb9664b09a27599550b6a0cf7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

### 2 Consumer

我们已经讲了 Provider 核心原理，还有另外一部分就是 Consumer ，研究一下其原理。

#### Consumer 流程

上文说道，Consumer 本质上是类型为 `REACT_CONTEXT_TYPE` 的 element 对象。在调和阶段，会转化成 `ContextConsumer` 类型的 fiber 对象。在 beginwork 中，会调用 `updateContextConsumer` 方法。那么这个方法做了些什么呢？

> react/react-reconcider/src/ReactFiberBeginWork.js

```
function updateContextConsumer(current,workInProgress,renderExpirationTime,) {
  let context  = workInProgress.type;
  const newProps = workInProgress.pendingProps;
  /* 得到 render props children */
  const render = newProps.children;
  /* 读取 context */ 
  prepareToReadContext(workInProgress, renderExpirationTime);
  /* 得到最新的新的 context value */
  const newValue = readContext(context, newProps.unstable_observedBits);
  let newChildren;
  /* 得到最新的 children element */
  newChildren = render(newValue);
  workInProgress.effectTag |= PerformedWork;
  /* 调和 children */
  reconcileChildren(current, workInProgress, newChildren, renderExpirationTime);
  return workInProgress.child;
}
```

`updateContextConsumer`的核心流程：

-   首先调用 `readContext` 获取最新的 value 。
-   然后通过 `render props` 函数，传入最新的 value，得到最新的 `children` 。
-   接下来调和 children 。

那么有一个问题**就是 fiber 上的 dependencies 如何和 context 建立起关联。** 那么就是 **`readContext`** 这个函数做的事，可以提前透露一下，useContext 和 contextType 本质上也是

#### readContext

readContext 是除了 `Provider` 之外，第二个核心知识点。

> react/react-reconcider/src/ReactFiberNewContext.js

```
export function readContext( context,observedBits ){
    /* 创建一个 contextItem */
    const contextItem = {
      context,
      observedBits: resolvedObservedBits,
      next: null,
    };
    /* 不存在最后一个 context Dependency  */
    if (lastContextDependency === null) {
      lastContextDependency = contextItem;
      currentlyRenderingFiber.dependencies = {
        expirationTime: NoWork,
        firstContext: contextItem,
        responders: null,
      };
    } else {
      /* 存在的情况 */
      lastContextDependency = lastContextDependency.next = contextItem;
    }
   
  return isPrimaryRenderer ? context._currentValue : context._currentValue2;
}
```

-   readContext 主要做的事情是这样的，首先会创建一个 contextItem ，上述说到过 fiber 上会存在多个 `dependencies` ，它们以链表的形式联系到一起，如果不存在最后一个 `context dependency` ，那证明 context dependencies 为空 ，那么会创建第一个 dependency ，如果存在最后一个 dependency ，那么 contextItem 会以链表形式保存，并变成最后一个 lastContextDependency 。

#### 多个 Provider 嵌套

如果有多个 Provider 的情况，那么后一个 contextValue 会覆盖前一个 contextValue，在开发者脑海中，要有一个定律就是：**`Provider` 是用来传递 value，而非保存 value 。**

### 3 contextType 和 useContext

#### useContext 原理

`useContext` 原理，调用 useContext 本质上调用 `readContext` 方法。

> react/react-reconcider/src/ReactFiberHooks.js

```
const HooksDispatcherOnMount ={
    useContext: readContext
}
```

-   函数组件通过 readContext ，将函数组件的 `dependencies`和当前 context 建立起关联，context 改变，将当前函数组件设置高优先级，促使其渲染。

#### contextType 原理

类组件的静态属性 `contextType` 和 useContext 一样，本质上就是调用 readContext 方法。

> react/react-reconcider/src/ReactFiberClassComponent.js

```
function constructClassInstance(workInProgress,ctor,props){
     if (typeof contextType === 'object' && contextType !== null) {
         /* 读取 context  */
        context = readContext(contextType);
    } 

    const instance = new ctor(props, context);
}
```

-   静态属性 contextType ，在类组件实例化的时候被使用，本质上也是调用 `readContext`将 context 和 fiber 上的 `dependencies` 建立起关联。

### 4 Context 流程总结

下面对整个 context 原理部分做总结。

-   Provider 传递流程：Provider 的更新，会深度遍历子代 fiber，消费 context 的 fiber 和父级链都会提升更新优先级。 对于类组件的 fiber ，会 forceUpdate 处理。接下来所有消费的 fiber，都会 beginWork 。
    
-   context 订阅流程： `contextType` ， `useContext`， `Consumer` 会内部调用 `readContext` ，readContext 会把 fiber 上的 `dependencies` 属性和 context 对象建立起关联。
    

### 5 总结

本章节知识点总结:

-   context 原理，Provider 做了些什么。
-   beginWork 和 render 的更新原则和区别。
-   三种 context 传递模式原理。
-   context 订阅消费原理。
-   Provider 嵌套传递原理。

透漏一下，接下来会更新另外一个新的章节 fiber 初始化和调和流程。