# Vue面试题

## 基本原理

### 1.什么是MVVM,MVC？

**（1）MVC**

MVC 通过分离 Model、View 和 Controller 的方式来组织代码结构。其中 View 负责页面的显示逻辑，Model 负责存储页面的业务数据，以及对相应数据的操作。并且 View 和 Model 应用了观察者模式，当 Model 层发生改变的时候它会通知有关 View 层更新页面。Controller 层是 View 层和 Model 层的纽带，它主要负责用户与应用的响应操作，当用户与页面产生交互的时候，Controller 中的事件触发器就开始工作了，通过调用 Model 层，来完成对 Model 的修改，然后 Model 层再去通知 View 层更新。 ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a65e1b9145894647a25788caf12ddd26~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

（2）MVVM

MVVM 分为 Model、View、ViewModel：

- Model代表数据模型，数据和业务逻辑都在Model层中定义；
- View代表UI视图，负责数据的展示；
- ViewModel负责监听Model中数据的改变并且控制视图的更新，处理用户交互操作；

Model和View并无直接关联，而是通过ViewModel来进行联系的，Model和ViewModel之间有着双向数据绑定的联系。因此当Model中的数据改变时会触发View层的刷新，View中由于用户交互操作而改变的数据也会在Model中同步。

这种模式实现了 Model和View的数据自动同步，因此开发者只需要专注于数据的维护操作即可，而不需要自己操作DOM。 ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5ce15b7b704483eb91ee1f5d1d64786~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

### 2.数据代理和劫持是怎么实现的？

当一个Vue实例创建时，Vue会遍历data中的属性，用 Object.defineProperty（vue3.0使用proxy ）将它们转为 getter/setter，并且在内部追踪相关依赖，在属性被访问和修改时通知变化。 每个组件实例都有相应的 watcher 程序实例，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的setter被调用时，会通知watcher重新计算，从而致使它关联的组件得以更新。 ![0_tB3MJCzh_cB6i3mS-1.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1b16025a35b4cd2b343a92e740621b7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

### 3.双向绑定是怎么实现的？ 如何通过发布订阅模式实现数据的双向绑定？

Vue.js 是采用**数据劫持**结合**发布者-订阅者模式**的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。主要分为以下几个步骤：

1. 需要observe的数据对象进行递归遍历，包括子属性对象的属性，都加上setter和getter这样的话，给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化
2. compile解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图
3. Watcher订阅者是Observer和Compile之间通信的桥梁，主要做的事情是: ①在自身实例化时往属性订阅器(dep)里面添加自己 ②自身必须有一个update()方法 ③待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。
4. MVVM作为数据绑定的入口，整合Observer、Compile和Watcher三者，通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer和Compile之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据model变更的双向绑定效果。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a286bdc076ae425fb9591bb8c4153240~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/4/10/162ad3d5be3e5105~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)



[双向绑定原理](https://juejin.cn/post/7065967379095748638#heading-9)

vue接收一个模板和data参数。

1，首先将data中的数据进行递归遍历，对每个属性执行Object.defineProperty，定义get和set函数。**并为每个属性添加一个dep数组**。当get执行时，会为调用的dom节点创建一个watcher存放在该数组中。当set执行时，重新赋值，并调用dep数组的notify方法，通知所有使用了该属性watcher，并更新对应dom的内容。

2，将模板加载到内存中，递归模板中的元素，检测到元素有v-开头的命令或者双大括号的指令，就会从data中取对应的值去修改模板内容，这个时候就将该dom元素添加到了该属性的dep数组中。这就实现了数据驱动视图。在处理v-model指令的时候，为该dom添加input事件（或change），输入时就去修改对应的属性的值，实现了页面驱动数据。

3，将模板与数据进行绑定后，将模板添加到真实dom树中

#### 收集依赖具体过程

-   Dep：`用于收集某个data属性依赖的dom节点集合，并提供更新方法`
-   Watcher：`每个dom节点的包裹对象`
    -   attr：该dom使用的data属性
    -   cb：修改该dom内容的回调函数，在对象创建的时候会接收

-   为data的每个属性添加一个dep数组，用来收集依赖的dom节点。
-   因为vue实例初始化的时候会解析模板，会触发data数据的getter，所以在此收集dom

-   在CompilerUtil类解析v-model，{{}}等命令时，会触发getter。
-   我们在触发之前创建Wather对象，该对象在初始化的时候调用getOldValue，首先为Dep添加一个静态属性target，值为该dom节点。
-   再调用CompilerUtil.getValue，获取该data的当前值，此时就以及触发了getter。然后我们在getter函数里面获取该静态变量Dep.target，并添加到对应的依赖数组dep中了，就完成了一次收集。
-   因为每次触发getter之前都对该静态变量赋值，所以不存在收集错依赖的情况。

#### 实现视图驱动数据

监听输入框的input、change事件。修改CompilerUtil的model方法

```js
model: function (node, value, vm) {
    new Watcher(vm, value, (newValue, oldValue)=>{
        node.value = newValue;
    });
    let val = this.getValue(vm, value);
    node.value = val;
	// 看这里
    node.addEventListener('input', (e)=>{
        let newValue = e.target.value;
        this.setValue(vm, value, newValue);
    })
},

```



#### 如何将watcher放在dep数组中？

在解析模板的时候，会根据v-指令获取对应data属性值，这个时候就会调用属性的get方法，我们先创建Watcher实例，并在其内部获取该属性值，作为旧值存放在watcher内部，我们在获取该值之前，在Watcher原型对象上添加属性Watcher.target = this;然后取值，将讲Watcher.target = null；这样get在被调用的时候就可以根据Watcher.target获取到watcher实例对象。

#### methods的原理

创建vue实例的时候，接收methods参数

在解析模板的时候遇到v-on的指令。会对**该dom元素添加对应事件的监听**，并使用call方法将vue绑定为该方法的this：`vm.$methods[value].call(vm, e);`

#### computed的原理

创建vue实例的时候，接收computed参数

初始化vue实例的时候，为computed的key进行Object.defineProperty处理，并添加get属性。

#### 更新时候发生了什么

属性set方法被触发 执行dep.notify()

通知所有使用了该属性watcher，执行watcher的update()方法  执行传过来的callback

并更新对应dom的内容



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/7/16ede2ff5a75589d~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

[代码实现](https://juejin.cn/post/6844903903822086151)

### 4.v-model原理是什么? 语法糖实际是什么？

在自己封装组件的时在Vue中，我们可以使用`v-bind`实现单向的数据绑定，也就是通过**父组件向子组件传入数据** ，但是反过来，**子组件不可以修改父组件传递过来的数据** ，这也就是所谓的单向数据绑定。

而`v-model`就实现了双向数据绑定，实际上它就是通过Vue提供的事件机制。即在子组件通过`$emit()`触发一个事件，在父组件使用`v-on`来监听对应的事件并修改相应的数据时候，特别是输入框，下拉选择框等交互组件的时候，一般绑定值的时候，采用的是 `v-model`，使用 `v-model` 的主要好处是无需记特定的 `prop` 字段名，即可绑定到组件中的值，降低组件的使用成本。

毕竟，一个好的公共组件，首先是 `API` 的设计应该让人容易理解，并且使用方便。

其次，应该尽量将**重复的逻辑处理**放在子组件中，这样子才会让组件的封装更有意义。

当然，通过本文的学习，即使不是交互组件，**任何组件都可以**通过这种方式来实现 `v-model`。

`v-model` 实际上就是 `$emit('input')` 以及 `props:value` 的组合语法糖，只要组件中满足这两个条件，就可以在组件中使用 `v-model`。

**虽然在有些交互组件中有些许不同**，例如：

`checkbox` 和 `radio` 使用 `props:checked` 属性和 `$emit('change')` 事件。

`select` 使用 `props:value` 属性和 `$emit('change')` 事件。

但是，除了上面列举的这些，别的都是 `$emit('input')` 以及 `props:value` 。



**（1）作用在表单元素上** 动态绑定了 input 的 value 指向了 messgae 变量，并且在触发 input 事件的时候去动态把 message设置为目标值：

```javascript
<input v-model="sth" />
//  等同于
<input 
    v-bind:value="message" 
    v-on:input="message=$event.target.value"
>
//$event 指代当前触发的事件对象;
//$event.target 指代当前触发的事件对象的dom;
//$event.target.value 就是当前dom的value值;
//在@input方法中，value => sth;
//在:value中,sth => value;
```

**（2）作用在组件上** 在自定义组件中，v-model 默认会利用名为 value 的 prop和名为 input 的事件

**本质是一个父子组件通信的语法糖，通过prop和$.emit实现。** 因此父组件 v-model 语法糖本质上可以修改为：

```javascript
<child :value="message"  @input="function(e){message = e}"></child>
```

在组件的实现中，可以通过 v-model属性来配置子组件接收的prop名称，以及派发的事件名称。 例子：

```javascript
// 父组件
<aa-input v-model="aa"></aa-input>
// 等价于
<aa-input v-bind:value="aa" v-on:input="aa=$event.target.value"></aa-input>

// 子组件：
<input v-bind:value="aa" v-on:input="onmessage"></aa-input>

props:{value:aa,}
methods:{
    onmessage(e){
        $emit('input',e.target.value)
    }
}
```

默认情况下，一个组件上的v-model 会把 value 用作 prop且把 input 用作 event。但是一些输入类型比如单选框和复选框按钮可能想使用 value prop 来达到不同的目的。使用 model 选项可以回避这些情况产生的冲突。js 监听input 输入框输入数据改变，用oninput，数据改变以后就会立刻出发这个事件。通过input事件把数据$emit 出去，在父组件接受。父组件设置v-model的值为input `$emit`过来的值。

### 4.Object.defineproperty和Proxy特点对比分析  属性描述符有哪些 ？



### 5.v-if和v-show特点对比分析

- **手段**：v-if是动态的向DOM树内添加或者删除DOM元素；v-show是通过设置DOM元素的display样式属性控制显隐；
- **编译过程**：v-if切换有一个局部编译/卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件；v-show只是简单的基于css切换；
- **编译条件**：v-if是惰性的，如果初始条件为假，则什么也不做；只有在条件第一次变为真时才开始局部编译; v-show是在任何条件下，无论首次条件是否为真，都被编译，然后被缓存，而且DOM元素保留；
- **性能消耗**：v-if有更高的切换消耗；v-show有更高的初始渲染消耗；
- **使用场景**：v-if适合运营条件不大可能改变；v-show适合频繁切换。

### 6.computed和method、computed和watch  对比分析

#### Computed 和 Methods 的区别

可以将同一函数定义为一个 method 或者一个计算属性。对于最终的结果，两种方式是相同的

**不同点：**

- computed: 计算属性是基于它们的依赖进行缓存的，只有在它的相关依赖发生改变时才会重新求值；
- method 调用总会执行该函数。

#### Computed 和 Watch 的区别

**对于Computed：**

- 它支持缓存，只有依赖的数据发生了变化，才会重新计算
- 不支持异步，当Computed中有异步操作时，无法监听数据的变化
- computed的值会默认走缓存，计算属性是基于它们的响应式依赖进行缓存的，也就是基于data声明过，或者父组件传递过来的props中的数据进行计算的。
- 如果一个属性是由其他属性计算而来的，这个属性依赖其他的属性，一般会使用computed
- 如果computed属性的属性值是函数，那么默认使用get方法，函数的返回值就是属性的属性值；在computed中，属性有一个get方法和一个set方法，当数据发生变化时，会调用set方法。

**对于Watch：**

- 它不支持缓存，数据变化时，它就会触发相应的操作
- 支持异步监听
- 监听的函数接收两个参数，第一个参数是最新的值，第二个是变化之前的值
- 当一个属性发生变化时，就需要执行相应的操作
- 监听数据必须是data中声明的或者父组件传递过来的props中的数据，当发生变化时，会触发其他操作，函数有两个的参数：
  - immediate：组件加载立即触发回调函数
  - deep：深度监听，发现数据内部的变化，在复杂数据类型中使用，例如数组中的对象发生变化。需要注意的是，deep无法监听到数组和对象内部的变化。

当想要执行异步或者昂贵的操作以响应不断的变化时，就需要使用watch。

**总结：**

- computed 计算属性 : 依赖其它属性值，并且 computed 的值有缓存，只有它依赖的属性值发生改变，下一次获取 computed 的值时才会重新计算 computed 的值。
- watch 侦听器 : 更多的是**观察**的作用，**无缓存性**，类似于某些数据的监听回调，每当监听的数据变化时都会执行回调进行后续操作。

**运用场景：**

- 当需要进行数值计算,并且依赖于其它数据时，应该使用 computed，因为可以利用 computed 的缓存特性，避免每次获取值时都要重新计算。
- 当需要在数据变化时执行异步或开销较大的操作时，应该使用 watch，使用 watch 选项允许执行异步操作 ( 访问一个 API )，限制执行该操作的频率，并在得到最终结果前，设置中间状态。这些都是计算属性无法做到的。

### 7.nextTick有什么应用场景？原理是什么？

Vue 的 nextTick 其本质是对 JavaScript 执行原理 EventLoop 的一种应用。

nextTick 的核心是利用了如 Promise 、MutationObserver、setImmediate、setTimeout的原生 JavaScript 方法来模拟对应的微/宏任务的实现，本质是为了利用 JavaScript 的这些异步回调任务队列来实现 Vue 框架中自己的异步回调队列。

nextTick 不仅是 Vue 内部的异步队列的调用方法，同时也允许开发者在实际项目中使用这个方法来满足实际应用中对 DOM 更新数据时机的后续逻辑处理

nextTick 是典型的将底层 JavaScript 执行原理应用到具体案例中的示例，引入异步更新队列机制的原因∶

- 如果是同步更新，则多次对一个或多个属性赋值，会频繁触发 UI/DOM 的渲染，可以减少一些无用渲染
- 同时由于 VirtualDOM 的引入，每一次状态发生变化后，状态变化的信号会发送给组件，组件内部使用 VirtualDOM 进行计算得出需要更新的具体的 DOM 节点，然后对 DOM 进行更新操作，每次更新状态后的渲染过程需要更多的计算，而这种无用功也将浪费更多的性能，所以异步渲染变得更加至关重要

Vue采用了数据驱动视图的思想，但是在一些情况下，仍然需要操作DOM。有时候，可能遇到这样的情况，DOM1的数据发生了变化，而DOM2需要从DOM1中获取数据，那这时就会发现DOM2的视图并没有更新，这时就需要用到了`nextTick`了。

由于Vue的DOM操作是异步的，所以，在上面的情况中，就要将DOM2获取数据的操作写在`$nextTick`中。

```javascript
this.$nextTick(() => {    // 获取数据的操作...})
```

所以，在以下情况下，会用到nextTick：

- 在数据变化后执行的某个操作，而这个操作需要使用随数据变化而变化的DOM结构的时候，这个操作就需要方法在`nextTick()`的回调函数中。
- 在vue生命周期中，如果在created()钩子进行DOM操作，也一定要放在`nextTick()`的回调函数中。

因为在created()钩子函数中，页面的DOM还未渲染，这时候也没办法操作DOM，所以，此时如果想要操作DOM，必须将操作的代码放在`nextTick()`的回调函数中。

 vue 采用的**异步更新策略**，当监听到数据发生变化的时候不会立即去更新DOM，
而是开启一个任务队列，并缓存在同一事件循环中发生的所有数据变更;

nextTick 接收一个回调函数作为参数，并将这个回调函数延迟到DOM更新后才执行；
**使用场景**：想要操作 *基于最新数据的生成DOM* 时，就将这个操作放在 nextTick 的回调中

nextTick 提供了四种异步方法 Promise.then、MutationObserver、setImmediate、setTimeOut(fn,0)

源码解析

```js
import { noop } from 'shared/util'
import { handleError } from './error'
import { isIE, isIOS, isNative } from './env'

//  上面三行与核心代码关系不大，了解即可
//  noop 表示一个无操作空函数，用作函数默认值，防止传入 undefined 导致报错
//  handleError 错误处理函数
//  isIE, isIOS, isNative 环境判断函数，
//  isNative 判断是否原生支持，如果通过第三方实现支持也会返回 false


export let isUsingMicroTask = false     // nextTick 最终是否以微任务执行

const callbacks = []     // 存放调用 nextTick 时传入的回调函数
let pending = false     // 标识当前是否有 nextTick 在执行，同一时间只能有一个执行


// 声明 nextTick 函数，接收一个回调函数和一个执行上下文作为参数
export function nextTick(cb?: Function, ctx?: Object) {
    let _resolve
    // 将传入的回调函数存放到数组中，后面会遍历执行其中的回调
    callbacks.push(() => {
        if (cb) {   // 对传入的回调进行 try catch 错误捕获
            try {
                cb.call(ctx)
            } catch (e) {
                handleError(e, ctx, 'nextTick')
            }
        } else if (_resolve) {
            _resolve(ctx)
        }
    })
    
    // 如果当前没有在 pending 的回调，就执行 timeFunc 函数选择当前环境优先支持的异步方法
    if (!pending) {
        pending = true
        timerFunc()
    }
    
    // 如果没有传入回调，并且当前环境支持 promise，就返回一个 promise
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(resolve => {
            _resolve = resolve
        })
    }
}


// 判断当前环境优先支持的异步方法，优先选择微任务
// 优先级：Promise---> MutationObserver---> setImmediate---> setTimeout
// setTimeOut 最小延迟也要4ms，而 setImmediate 会在主线程执行完后立刻执行
// setImmediate 在 IE10 和 node 中支持

// 多次调用 nextTick 时 ,timerFunc 只会执行一次

let timerFunc   
// 判断当前环境是否支持 promise
if (typeof Promise !== 'undefined' && isNative(Promise)) {  // 支持 promise
    const p = Promise.resolve()
    timerFunc = () => {
    // 用 promise.then 把 flushCallbacks 函数包裹成一个异步微任务
        p.then(flushCallbacks)
        if (isIOS) setTimeout(noop)
    }
    // 标记当前 nextTick 使用的微任务
    isUsingMicroTask = true
    
    
    // 如果不支持 promise，就判断是否支持 MutationObserver
    // 不是IE环境，并且原生支持 MutationObserver，那也是一个微任务
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
    let counter = 1
    // new 一个 MutationObserver 类
    const observer = new MutationObserver(flushCallbacks) 
    // 创建一个文本节点
    const textNode = document.createTextNode(String(counter))   
    // 监听这个文本节点，当数据发生变化就执行 flushCallbacks 
    observer.observe(textNode, { characterData: true })
    timerFunc = () => {
        counter = (counter + 1) % 2
        textNode.data = String(counter)  // 数据更新
    }
    isUsingMicroTask = true    // 标记当前 nextTick 使用的微任务
    
    
    // 判断当前环境是否原生支持 setImmediate
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    timerFunc = () => { setImmediate(flushCallbacks)  }
} else {

    // 以上三种都不支持就选择 setTimeout
    timerFunc = () => { setTimeout(flushCallbacks, 0) }
}


// 如果多次调用 nextTick，会依次执行上面的方法，将 nextTick 的回调放在 callbacks 数组中
// 最后通过 flushCallbacks 函数遍历 callbacks 数组的拷贝并执行其中的回调
function flushCallbacks() {
    pending = false
    const copies = callbacks.slice(0)    // 拷贝一份
    callbacks.length = 0    // 清空 callbacks
    for (let i = 0; i < copies.length; i++) {    // 遍历执行传入的回调
        copies[i]()
    }
}

// 为什么要拷贝一份 callbacks

// callbacks.slice(0) 将 callbacks 拷贝出来一份，
// 是因为考虑到 nextTick 回调中可能还会调用 nextTick 的情况,
// 如果 nextTick 回调中又调用了一次 nextTick，则又会向 callbacks 中添加回调，
// nextTick 回调中的 nextTick 应该放在下一轮执行，
// 如果不将 callbacks 复制一份就可能一直循环

```



### 8.data为什么是一个函数而不是一个对象？

JavaScript中的对象是引用类型的数据，当多个实例引用同一个对象时，只要一个实例对这个对象进行操作，其他实例中的数据也会发生变化。

而在Vue中，更多的是想要复用组件，那就需要每个组件都有自己的数据，这样组件之间才不会相互干扰。

所以组件的数据不能写成对象的形式，而是要写成函数的形式。数据以函数返回值的形式定义，这样当每次复用组件的时候，就会返回一个新的data，也就是说每个组件都有自己的私有数据空间，它们各自维护自己的数据，不会干扰其他组件的正常运行。

### 9.单页面Web应用的优缺点

单页面应用程序将所有的活动局限于一个Web页面中，在该Web页面初始化时加载相应的HTML、JavaScript 和 CSS。一旦页面加载完成，单页面应用不会因为用户的操作而进行页面的重新加载或跳转。取而代之的是利用 JavaScript 动态的变换HTML的内容，从而实现UI与用户的交互。由于避免了页面的重新加载，单页面应用可以提供较为流畅的用户体验。

###### 1.单页面应用的优点

- 良好的交互体验

单页应用的内容的改变不需要重新加载整个页面，获取数据也是通过Ajax异步获取，没有页面之间的切换，就不会出现“白屏现象”,也不会出现假死并有“闪烁”现象，页面显示流畅

- 良好的前后端工作分离模式

后端不再负责模板渲染、输出页面工作，后端API通用化，即同一套后端程序代码，不用修改就可以用于Web界面、手机、平板等多种客户端

- 减轻服务器压力

单页应用相对服务器压力小，服务器只用出数据就可以，不用管展示逻辑和页面合成，吞吐能力会提高几倍

###### 2.缺点

- 首屏加载慢

解决方案： 1，vue-router懒加载

Vue-router懒加载就是按需加载组件，只有当路由被访问时才会加载对应的组件，而不是在加载首页的时候就加载，项目越大，对首屏加载的速度提升得越明显

2，使用CDN加速

在做项目时，我们会用到很多库，采用cdn加载可以加快加载速度。

3，异步加载组件

4，服务端渲染

服务端渲染还能对seo优化起到作用，有利于搜索引擎抓取更多有用的信息（如果页面纯前端渲染，搜索引擎抓取到的就只是空页面）

- 不利于SEO

seo 本质是一个服务器向另一个服务器发起请求，解析请求内容。但一般来说搜索引擎是不会去执行请求到的js的。也就是说，搜索引擎的基础爬虫的原理就是抓取url，然后获取html源代码并解析。 如果一个单页应用，html在服务器端还没有渲染部分数据数据，在浏览器才渲染出数据，即搜索引擎请求到的html是模型页面而不是最终数据的渲染页面。 这样就很不利于内容被搜索引擎搜索到

解决方案：1，服务端渲染

服务器合成完整的 html 文件再输出到浏览器

2，页面预渲染

3，路由采用h5 history模式

- 不适合开发大型项目

大型项目中可能会涉及大量的DOM操作、复杂的动画效果，也就不适合使用Vue、react框架进行开发

### 10.slot的应用场景

我们知道在Vue中 Child 组件的标签 的中间是不可以包着什么的 。

![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/692ecedc80604d4ea8921e84bf0baf19~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

可是往往在很多时候我们在使用组件的时候总想在组件间外面自定义一些标签，vue新增了一种插槽机制，叫做作用域插槽。

插槽，其实就相当于占位符。它在组件中给你的HTML模板占了一个位置，让你来传入一些东西。插槽又分为 匿名插槽、具名插槽、作用域插槽。

在 2.6.0 中，我们为具名插槽和作用域插槽引入了一个新的统一的语法 (即 `v-slot` 指令)。它取代了 `slot` 和 `slot-scope`

子组件里面写<slot>标签

#### 匿名插槽

匿名插槽，我们也可以叫它单个插槽或者默认插槽。和具名插槽相对，它是不需要设置 name 属性的，它隐藏的name属性为default。

father.vue

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b5551cd66a641a0b820a19b64843bd4~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

child.vue

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86bfb664e726408795fea99b1b31f94c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

匿名插槽，name的属性对应的是 default 也可以不写就是默认的意思啦；

在使用的时候还有一个问题要注意的 如果是有2个以上的匿名插槽是会child标签里面的内容全部都替换到每个slot；

#### 具名插槽 （vue2.6.0+被废弃的slot='name'）

顾名思义就是slot 是带有name的 定义， 或者使用简单缩写的定义 #header 使用：要用一个 template标签包裹

父组件 `v-slot:myName`

子组件 `<slot name="myName">`

father.vue

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b958f0c39ba49199f1ca07a40acfab0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

child.vue

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f9351d528ba46fab189c25c72ec4d2e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

多个具名插槽的使用 多个具名插槽，插槽的位置不是使用插槽的位置而定的，是在定义的时候的位置来替换的(子组件里面确定)

father.vue

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3170af0fc9734742ba7e267bd8dc5a7d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

child.vue

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87ea2bab1e924d7cb07d930ea84d8237~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

#### 作用域插槽

就是用来传递数据的插槽

当你想在一个插槽中使用数据时，要注意一个问题作用域的问题，Vue 官方文档中说了父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的;

为了让 子组件中的数据 在父级的插槽 内容中可用我们可以将 数据 作为 元素的一个特性绑定上去： v-bind:text="text"

注意：

匿名的作用域插槽和具名的作用域插槽 区别在v-slot:defult="接受的名称"(defult(匿名的可以不写，具名的相反要写的是对应的name))

v-solt可以解构接收 解构接收的字段要和传的字段一样才可以 

子组件`<slot :one="user2" >`对应父组件里面 `v-slot="{one}"`   父组件可以通过one来取值

子组件`<slot name="footer" v-bind:users='user1'>`对应父组件里面  `v-slot:footer="slotProps"`   父组件可以通过slotProps.users来取值user1

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/673251ec449244c9b117815e942def8d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

效果图

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91f07516db4a4831b28a019275172349~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

### 11.如何保存当前页面状态，(keep-alive)原理是什么？

既然是要保持页面的状态（其实也就是组件的状态），那么会出现以下两种情况：

- 前组件会被卸载
- 前组件不会被卸载

那么可以按照这两种情况分别得到以下方法：

**组件会被卸载：**

**（1）将状态存储在LocalStorage / SessionStorage**

只需要在组件即将被销毁的生命周期 `componentWillUnmount` （react）中在 LocalStorage / SessionStorage 中把当前组件的 state 通过 JSON.stringify() 储存下来就可以了。在这里面需要注意的是组件更新状态的时机。

比如从 B 组件跳转到 A 组件的时候，A 组件需要更新自身的状态。但是如果从别的组件跳转到 B 组件的时候，实际上是希望 B 组件重新渲染的，也就是不要从 Storage 中读取信息。所以需要在 Storage 中的状态加入一个 flag 属性，用来控制 A 组件是否读取 Storage 中的状态。

**优点：**

- 兼容性好，不需要额外库或工具。
- 简单快捷，基本可以满足大部分需求。

**缺点：**

- 状态通过 JSON 方法储存（相当于深拷贝），如果状态中有特殊情况（比如 Date 对象、Regexp 对象等）的时候会得到字符串而不是原来的值。（具体参考用 JSON 深拷贝的缺点）
- 如果 B 组件后退或者下一页跳转并不是前组件，那么 flag 判断会失效，导致从其他页面进入 A 组件页面时 A 组件会重新读取 Storage，会造成很奇怪的现象

**（2）路由传值**

通过 react-router 的 Link 组件的 prop —— to 可以实现路由间传递参数的效果。

在这里需要用到 state 参数，在 B 组件中通过 history.location.state 就可以拿到 state 值，保存它。返回 A 组件时再次携带 state 达到路由状态保持的效果。

**优点：**

- 简单快捷，不会污染 LocalStorage / SessionStorage。
- 可以传递 Date、RegExp 等特殊对象（不用担心 JSON.stringify / parse 的不足）

**缺点：**

- 如果 A 组件可以跳转至多个组件，那么在每一个跳转组件内都要写相同的逻辑。

**组件不会被卸载：**

**（1）单页面渲染**

要切换的组件作为子组件全屏渲染，父组件中正常储存页面状态。

**优点：**

- 代码量少
- 不需要考虑状态传递过程中的错误

**缺点：**

- 增加 A 组件维护成本
- 需要传入额外的 prop 到 B 组件
- 无法利用路由定位页面

除此之外，在Vue中，还可以是用keep-alive来缓存页面，当组件在keep-alive内被切换时组件的**activated、deactivated**这两个生命周期钩子函数会被执行 被包裹在keep-alive中的组件的状态将会被保留：

```javascript
<keep-alive>
	<router-view v-if="$route.meta.keepAlive"></router-view>
</kepp-alive>
```

**router.js**

```javascript
{
  path: '/',
  name: 'xxx',
  component: ()=>import('../src/views/xxx.vue'),
  meta:{
    keepAlive: true // 需要被缓存
  }
},
```

如果需要在组件切换的时候，保存一些组件的状态防止多次渲染，就可以使用 keep-alive 组件包裹需要保存的组件。

**（1）keep-alive**

keep-alive有以下三个属性：

- include 字符串或正则表达式，只有名称匹配的组件会被匹配；
- exclude 字符串或正则表达式，任何名称匹配的组件都不会被缓存；
- max 数字，最多可以缓存多少组件实例。

注意：keep-alive 包裹动态组件时，会缓存不活动的组件实例。

**主要流程**

1. 判断组件 name ，不在 include 或者在 exclude 中，直接返回 vnode，说明该组件不被缓存。
2. 获取组件实例 key ，如果有获取实例的 key，否则重新生成。
3. key生成规则，cid +"∶∶"+ tag ，仅靠cid是不够的，因为相同的构造函数可以注册为不同的本地组件。
4. 如果缓存对象内存在，则直接从缓存对象中获取组件实例给 vnode ，不存在则添加到缓存对象中。 5.最大缓存数量，当缓存组件数量超过 max 值时，清除 keys 数组内第一个组件。

**（2）keep-alive 的实现**

```javascript
const patternTypes: Array<Function> = [String, RegExp, Array] // 接收：字符串，正则，数组

export default {
  name: 'keep-alive',
  abstract: true, // 抽象组件，是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在父组件链中。

  props: {
    include: patternTypes, // 匹配的组件，缓存
    exclude: patternTypes, // 不去匹配的组件，不缓存
    max: [String, Number], // 缓存组件的最大实例数量, 由于缓存的是组件实例（vnode），数量过多的时候，会占用过多的内存，可以用max指定上限
  },

  created() {
    // 用于初始化缓存虚拟DOM数组和vnode的key
    this.cache = Object.create(null)
    this.keys = []
  },

  destroyed() {
    // 销毁缓存cache的组件实例
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted() {
    // prune 削减精简[v.]
    // 去监控include和exclude的改变，根据最新的include和exclude的内容，来实时削减缓存的组件的内容
    this.$watch('include', (val) => {
      pruneCache(this, (name) => matches(val, name))
    })
    this.$watch('exclude', (val) => {
      pruneCache(this, (name) => !matches(val, name))
    })
  },
}
```

**render函数：**

1. 会在 keep-alive 组件内部去写自己的内容，所以可以去获取默认 slot 的内容，然后根据这个去获取组件
2. keep-alive 只对第一个组件有效，所以获取第一个子组件。
3. 和 keep-alive 搭配使用的一般有：动态组件 和router-view

```javascript
render () {
  //
  function getFirstComponentChild (children: ?Array<VNode>): ?VNode {
    if (Array.isArray(children)) {
  for (let i = 0; i < children.length; i++) {
    const c = children[i]
    if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
      return c
    }
  }
  }
  }
  const slot = this.$slots.default // 获取默认插槽
  const vnode: VNode = getFirstComponentChild(slot)// 获取第一个子组件
  const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions // 组件参数
  if (componentOptions) { // 是否有组件参数
    // check pattern
    const name: ?string = getComponentName(componentOptions) // 获取组件名
    const { include, exclude } = this
    if (
      // not included
      (include && (!name || !matches(include, name))) ||
      // excluded
      (exclude && name && matches(exclude, name))
    ) {
      // 如果不匹配当前组件的名字和include以及exclude
      // 那么直接返回组件的实例
      return vnode
    }

    const { cache, keys } = this

    // 获取这个组件的key
    const key: ?string = vnode.key == null
      // same constructor may get registered as different local components
      // so cid alone is not enough (#3269)
      ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
      : vnode.key

    if (cache[key]) {
      // LRU缓存策略执行
      vnode.componentInstance = cache[key].componentInstance // 组件初次渲染的时候componentInstance为undefined

      // make current key freshest
      remove(keys, key)
      keys.push(key)
      // 根据LRU缓存策略执行，将key从原来的位置移除，然后将这个key值放到最后面
    } else {
      // 在缓存列表里面没有的话，则加入，同时判断当前加入之后，是否超过了max所设定的范围，如果是，则去除
      // 使用时间间隔最长的一个
      cache[key] = vnode
      keys.push(key)
      // prune oldest entry
      if (this.max && keys.length > parseInt(this.max)) {
        pruneCacheEntry(cache, keys[0], keys, this._vnode)
      }
    }
    // 将组件的keepAlive属性设置为true
    vnode.data.keepAlive = true // 作用：判断是否要执行组件的created、mounted生命周期函数
  }
  return vnode || (slot && slot[0])
}
```

keep-alive 具体是通过 cache 数组缓存所有组件的 vnode 实例。当 cache 内原有组件被使用时会将该组件 key 从 keys 数组中删除，然后 push 到 keys数组最后，以便清除最不常用组件。

**实现步骤：**

1. 获取 keep-alive 下第一个子组件的实例对象，通过他去获取这个组件的组件名
2. 通过当前组件名去匹配原来 include 和 exclude，判断当前组件是否需要缓存，不需要缓存，直接返回当前组件的实例vNode
3. 需要缓存，判断他当前是否在缓存数组里面：

- 存在，则将他原来位置上的 key 给移除，同时将这个组件的 key 放到数组最后面（LRU）
- 不存在，将组件 key 放入数组，然后判断当前 key数组是否超过 max 所设置的范围，超过，那么削减未使用时间最长的一个组件的 key

1. 最后将这个组件的 keepAlive 设置为 true

**（3）keep-alive 本身的创建过程和 patch 过程**

缓存渲染的时候，会根据 vnode.componentInstance（首次渲染 vnode.componentInstance 为 undefined） 和 keepAlive 属性判断不会执行组件的 created、mounted 等钩子函数，而是对缓存的组件执行 patch 过程∶ 直接把缓存的 DOM 对象直接插入到目标元素中，完成了数据更新的情况下的渲染过程。

**首次渲染**

- 组件的首次渲染∶判断组件的 abstract 属性，才往父组件里面挂载 DOM

```javascript
// core/instance/lifecycle
function initLifecycle (vm: Component) {
  const options = vm.$options

  // locate first non-abstract parent
  let parent = options.parent
  if (parent && !options.abstract) { // 判断组件的abstract属性，才往父组件里面挂载DOM
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }

  vm.$parent = parent
  vm.$root = parent ? parent.$root : vm

  vm.$children = []
  vm.$refs = {}

  vm._watcher = null
  vm._inactive = null
  vm._directInactive = false
  vm._isMounted = false
  vm._isDestroyed = false
  vm._isBeingDestroyed = false
}
```

- 判断当前 keepAlive 和 componentInstance 是否存在来判断是否要执行组件 prepatch 还是执行创建 componentlnstance

```javascript
// core/vdom/create-component
init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) { // componentInstance在初次是undefined!!!
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode) // prepatch函数执行的是组件更新的过程
    } else {
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      )
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  },
```

prepatch 操作就不会在执行组件的 mounted 和 created 生命周期函数，而是直接将 DOM 插入

**（4）LRU （least recently used）缓存策略**

LRU 缓存策略∶ 从内存中找出最久未使用的数据并置换新的数据。 LRU（Least rencently used）算法根据数据的历史访问记录来进行淘汰数据，其核心思想是 **"如果数据最近被访问过，那么将来被访问的几率也更高"**。 最常见的实现是使用一个链表保存缓存数据，详细算法实现如下∶

- 新数据插入到链表头部
- 每当缓存命中（即缓存数据被访问），则将数据移到链表头部
- 链表满的时候，将链表尾部的数据丢弃。

### 12.vue如何监听对象或数组的属性变化 数组检测缺陷问题

在 Vue 的数据绑定中会对一个对象属性的变化进行监听，并且通过依赖收集做出相应的视图更新

一个对象所有类型的属性变化都能被监听到吗？

之前用 Object.defineProperty通过对象的 getter/setter简单的实现了对象属性变化的监听，并且去通过依赖关系去做相应的依赖处理。

但是，这是存在问题的，尤其是当对象中某个属性的值是数组的时候。

**正如 Vue 文档所说：**

由于 JavaScript 的限制，Vue 无法检测到以下数组变动：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30a28bbf7caa44b1ae172601e0f32a9c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

对于响应式数组，当浏览器支持_proto_属性时，使用push等方法时先从其原型arrayMethods上寻找push方法，也就是重写后的方法，处理之后数组变化会通知到其订阅者，更新页面，当在arrayMethods上查询不到时会向上在Array.prototype上查询；

当浏览器不支持_proto_属性时，使用push等方法时会从数组自身上查询，如果查询不到会向上再Array.proptotype上查询。

对于非响应式数组，当使用push等方法时会直接从Array.prototype上查询。

值得一提的是源码中通过判断浏览器是否支持_proto_来分别使用protoAugment和copyAugment方法将重写后的数组方法应用到数组中，这是因为对于IE10及以下浏览器是不支持_proto_属性的

判断当前环境是否可以使用对象的_proto_属性,该属性在IE11及更高浏览器中使用 export const hasProp = '*proto*' in {}

**结论：**

在将数组处理成响应式数据后，如果使用数组原始方法改变数组时，数组值会发生变化，但是并不会触发数组的setter来通知所有依赖该数组的地方进行更新，为此，vue通过重写数组的某些方法来监听数组变化，重写后的方法中会手动触发通知该数组的所有依赖进行更新。

**Vue重新的属性**

push pop shift unshift splice sort reverse

看来Vue能对数组进行监听的原因是，把数组的方法重写了。总结起来就是这几步：

**01**先获取原生 Array 的原型方法，因为拦截后还是需要原生的方法帮我们实现数组的变化。

**02**对 Array 的原型方法使用 Object.defineProperty 做一些拦截操作。

**03**把需要被拦截的 Array 类型的数据原型指向改造后原型

```js
// 触发更新视图
function updateView() {
    console.log('视图更新')
}

// 重新定义数组原型
const oldArrayProperty = Array.prototype
// 创建新对象，原型指向 oldArrayProperty ，再扩展新的方法不会影响原型
const arrProto = Object.create(oldArrayProperty);
['push', 'pop', 'shift', 'unshift', 'splice'].forEach(methodName => {
    arrProto[methodName] = function () {
        updateView() // 触发视图更新
        oldArrayProperty[methodName].call(this, ...arguments)
        // Array.prototype.push.call(this, ...arguments)
    }
})

// 重新定义属性，监听起来
function defineReactive(target, key, value) {
    // 深度监听
    observer(value)

    // 核心 API
    Object.defineProperty(target, key, {
        get() {
            return value
        },
        set(newValue) {
            if (newValue !== value) {
                // 深度监听
                observer(newValue)

                // 设置新值
                // 注意，value 一直在闭包中，此处设置完之后，再 get 时也是会获取最新的值
                value = newValue

                // 触发更新视图
                updateView()
            }
        }
    })
}

// 监听对象属性
function observer(target) {
    if (typeof target !== 'object' || target === null) {
        // 不是对象或数组
        return target
    }

    // 污染全局的 Array 原型
    // Array.prototype.push = function () {
    //     updateView()
    //     ...
    // }

    if (Array.isArray(target)) {
        target.__proto__ = arrProto
    }

    // 重新定义各个属性（for in 也可以遍历数组）
    for (let key in target) {
        defineReactive(target, key, target[key])
    }
}

// 准备数据
const data = {
    name: 'zhangsan',
    age: 20,
    info: {
        address: '北京' // 需要深度监听
    },
    nums: [10, 20, 30]
}

// 监听数据
observer(data)

// 测试
// data.name = 'lisi'
// data.age = 21
// // console.log('age', data.age)
// data.x = '100' // 新增属性，监听不到 —— 所以有 Vue.set
// delete data.name // 删除属性，监听不到 —— 所有已 Vue.delete
// data.info.address = '上海' // 深度监听
data.nums.push(4) // 监听数组
```

### 13.事件修饰符有哪些

- `.stop`：等同于 JavaScript 中的 `event.stopPropagation()` ，防止事件冒泡；
- `.prevent` ：等同于 JavaScript 中的 `event.preventDefault()` ，防止执行预设的行为（如果事件可取消，则取消该事件，而不停止事件的进一步传播）；
- `.capture` ：与事件冒泡的方向相反，事件捕获由外到内；
- `.self` ：只会触发自己范围内的事件，不包含子元素；
- `.once` ：只会触发一次。

### 14.template渲染过程 ，模板编译原理

vue的模版编译过程主要如下：**template -> ast -> render函数**

vue 在模版编译版本的码中会执行 compileToFunctions 将template转化为render函数：

```javascript
// 将模板编译为render函数const { render, staticRenderFns } = compileToFunctions(template,options//省略}, this)
```

CompileToFunctions中的主要逻辑如下∶ **（1）调用parse方法将template转化为ast（抽象语法树）**

```javascript
constast = parse(template.trim(), options)
```

- **parse的目标**：把tamplate转换为AST树，它是一种用 JavaScript对象的形式来描述整个模板。
- **解析过程**：利用正则表达式顺序解析模板，当解析到开始标签、闭合标签、文本的时候都会分别执行对应的 回调函数，来达到构造AST树的目的。

AST元素节点总共三种类型：type为1表示普通元素、2为表达式、3为纯文本

**（2）对静态节点做优化**

```javascript
optimize(ast,options)
```

这个过程主要分析出哪些是静态节点，给其打一个标记，为后续更新渲染可以直接跳过静态节点做优化

深度遍历AST，查看每个子树的节点元素是否为静态节点或者静态节点根。如果为静态节点，他们生成的DOM永远不会改变，这对运行时模板更新起到了极大的优化作用。

**（3）生成代码**

```javascript
const code = generate(ast, options)
```

generate将ast抽象语法树编译成 render字符串并将静态部分放到 staticRenderFns 中，最后通过 `new Function(`` render``)` 生成render函数。

### 15.mixin和extends的应用

**（1）mixin 和 extends** mixin 和 extends均是用于合并、拓展组件的，两者均通过 mergeOptions 方法实现合并。

- mixins 接收一个混入对象的数组，其中混入对象可以像正常的实例对象一样包含实例选项，这些选项会被合并到最终的选项中。Mixin 钩子按照传入顺序依次调用，并在调用组件自身的钩子之前被调用。
- extends 主要是为了便于扩展单文件组件，接收一个对象或构造函数。

**（2）mergeOptions 的执行过程**

- 规范化选项（normalizeProps、normalizelnject、normalizeDirectives)
- 对未合并的选项，进行判断

```javascript
if(!child._base) {
    if(child.extends) {        
        parent = mergeOptions(parent, child.extends, vm)    }    
    if(child.mixins) {      
     for(let i = 0, l = child.mixins.length; i < l; i++){            
         parent = mergeOptions(parent, child.mixins[i], vm)       
        }    
    }
}
```

- 合并处理。根据一个通用 Vue 实例所包含的选项进行分类逐一判断合并，如 props、data、 methods、watch、computed、生命周期等，将合并结果存储在新定义的 options 对象里。
- 返回合并结果 options。

### 16.v-cloak的应用

在开发过程中，会遇到刷新或者切换路由页面闪烁的情况，等数据加载成功再重新展示，需要用到v-cloak防止闪烁。

v-cloak 指令设置样式，样式会在 Vue 实例编译结束时，从 HTML 元素上被移除。

这个指令可以隐藏未编译的 Mustache 标签直到实例准备完毕。

解决方法

> 1.在vue容器的div里面加上 v-cloak：

```vue
<div id="app" v-cloak>
```

> 2.css样式中加：

```css
<style>
    [v-cloak] {
        display: none !important;
    }
</style>
```

### 17.执行命令后浏览器渲染显示出页面的过程

### 18.修改后页面保存渲染的原理

### 19.Vue data 中某一个属性的值发生改变后，视图会立即同步执行重新渲染吗？

不会立即同步执行重新渲染。Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，而是按一定的策略进行 DOM 的更新。Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化， Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。

如果同一个watcher被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个的事件循环tick中，Vue 刷新队列并执行实际（已去重的）工作。

### 20.Vue中 scoped css原理

在开发环境我们的组件会先经过 vue-loader 的处理，然后结合运行时的框架代码渲染到页面上

Scope CSS 的本质是基于 HTML 和 CSS 选择器的属性，通过分别给 HTML 标签和 CSS 选择器添加 `data-v-xxxx` 属性的方式实现

针对 Scope CSS 而言，vue-loader 会做这 3 件事：

-   解析组件，提取出 `template`、`script`、`style` 对应的代码块
-   构造并导出 `export` 组件实例，在组件实例的选项上绑定 ScopId
-   对 `style` 的 CSS 代码进行编译转化，应用 ScopId生成选择器的属性

vue-loader 的底层使用了 Vue 官方提供的包（package） [@vue/component-compiler-utils](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fcomponent-compiler-utils)，其提供了解析组件（.vue 文件）、编译模版 `template`、编译 `style`等 3 种能力

`template` 会被编译成 `render` 函数，然后会根据 `render` 函数创建对应的 VNode，最后再由 VNode 渲染成真实的 DOM 在页面上：

### 21.vue-cli实现原理

[精简版](https://juejin.cn/post/6844904041823240205)

### 22.render函数触发过程

[第一次挂载和每次数据更新都会触发render函数](https://www.zhihu.com/question/406811368)

在vue内部的$mount方法里（$mount为Vue处理mount相关的方法），调用了mountComponent方法

在mountComponent内，可以发现两点：

**1.定义了updateComponent函数**，updateComponent调用了vm._render()。vm._render()内会调用this.$options.render。

2.**将updateComponent函数传给实例化的Watcher。**

传给了watcher之后，只要有任何数据等变化，那么watcher就会调用updateComponent函数，之后render就会被调用。

## 生命周期

### 1.生命周期有哪些，vue2和vue3有什么区别

#### Vue2生命周期

Vue 实例有⼀个完整的⽣命周期，也就是从开始创建、初始化数据、编译模版、挂载Dom -> 渲染、更新 -> 渲染、卸载 等⼀系列过程，称这是Vue的⽣命周期。

1. **beforeCreate（创建前）**：数据观测和初始化事件还未开始，此时 data 的响应式追踪、event/watcher 都还没有被设置，也就是说不能访问到data、computed、watch、methods上的方法和数据。
2. **created（创建后）** ：实例创建完成，实例上配置的 options 包括 data、computed、watch、methods 等都配置完成，但是此时渲染得节点还未挂载到 DOM，所以不能访问到 `$el` 属性。
3. **beforeMount（挂载前）**：在挂载开始之前被调用，相关的render函数首次被调用。实例已完成以下的配置：编译模板，把data里面的数据和模板生成html。此时还没有挂载html到页面上。
4. **mounted（挂载后）**：在el被新创建的 vm.$el 替换，并挂载到实例上去之后调用。实例已完成以下的配置：用上面编译好的html内容替换el属性指向的DOM对象。完成模板中的html渲染到html 页面中。此过程中进行ajax交互。
5. **beforeUpdate（更新前）**：响应式数据更新时调用，此时虽然响应式数据更新了，但是对应的真实 DOM 还没有被渲染。
6. **updated（更新后）** ：在由于数据更改导致的虚拟DOM重新渲染和打补丁之后调用。此时 DOM 已经根据响应式数据的变化更新了。调用时，组件 DOM已经更新，所以可以执行依赖于DOM的操作。然而在大多数情况下，应该避免在此期间更改状态，因为这可能会导致更新无限循环。该钩子在服务器端渲染期间不被调用。
7. **beforeDestroy（销毁前）**：实例销毁之前调用。这一步，实例仍然完全可用，`this` 仍能获取到实例。
8. **destroyed（销毁后）**：实例销毁后调用，调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。该钩子在服务端渲染期间不被调用。

另外还有 `keep-alive` 独有的生命周期，分别为 `activated` 和 `deactivated` 。用 `keep-alive` 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 `deactivated` 钩子函数，命中缓存渲染后会执行 `activated` 钩子函数。

首先给出结论：created 和 mounted 中发起 ajax 请求是一样的，没有区别。
为啥没有区别：created 和 mounted 是在同一个 tick 中执行的，而ajax 请求的时间一定会超过一个 tick。所以即便ajax的请求耗时是 0ms， 那么也是在 nextTick 中更新数据到 DOM 中。所以说在不依赖 DOM 节点的情况下一点区别都没有。



#### Vue3生命周期

 beforeMount => onBeforeMount

 mounted => onMounted

 beforeUpdate => onBeforeUpdate

 updated => onUpdated

 beforeUnmount => onBeforeUnmount

 unmount => onUnmounted

在comsition API 中不存在beforeCreate和created这两个生命周期函数 因为setup函数的执行时间在beforeCreate和created之前，有需要执行的内容可以直接在setup函数中执行，没必要再写在beforeCreate和created中

vue3中新增了onRenderTracked生命周期函数 指的是每次渲染之后收集页面响应式的依赖的时候会自动执行的函数

当页面渲染的时候，vue都会重新收集响应式的依赖，响应式的依赖一旦重新渲染需要重新收集的时候onRenderTracked便会自动执行一次 页面首次渲染便会执行 页面再次重新渲染也会执行 与onRenderTracked对应的函数是onRenderTriggered 指每次重新渲染被触发的时候，首次页面加载不会触发，当数据改变，页面重新渲染的时候触发，onRenderTracked也会再次触发。

### 2.created和mounted有什么区别

- created:在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
- mounted:在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。

### 3.异步请求放在那个生命周期函数

我们可以在钩子函数 created、beforeMount、mounted 中进行调用，因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。

推荐在 created 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求有以下优点：

- 能更快获取到服务端数据，减少页面加载时间，用户体验更好；
- SSR不支持 beforeMount 、mounted 钩子函数，放在 created 中有助于一致性。

### 4.keep-alive生命周期

keep-alive是 Vue 提供的一个内置组件，用来对组件进行缓存——在组件切换过程中将状态保留在内存中，防止重复渲染DOM。

如果为一个组件包裹了 keep-alive，那么它会多出两个生命周期：deactivated、activated。同时，beforeDestroy 和 destroyed 就不会再被触发了，因为组件不会被真正销毁。

当组件被换掉时，会被缓存到内存中、触发 deactivated 生命周期；当组件被切回来时，再去缓存里找这个组件、触发 activated钩子函数。

### 5.Vue 子组件和父组件执行顺序

**加载渲染过程：**

1. 父组件 beforeCreate
2. 父组件 created
3. 父组件 beforeMount
4. 子组件 beforeCreate
5. 子组件 created
6. 子组件 beforeMount
7. 子组件 mounted
8. 父组件 mounted

**更新过程：**

1. 父组件 beforeUpdate
2. 子组件 beforeUpdate
3. 子组件 updated
4. 父组件 updated

**销毁过程：**

1. 父组件 beforeDestroy
2. 子组件 beforeDestroy
3. 子组件 destroyed
4. 父组件 destoryed

## 组件间通信

### 1.vue2的组件间通信方式

组件通信的方式如下：

#### （1） props  /  $emit

父组件通过`props`向子组件传递数据，子组件通过`$emit`和父组件通信

##### 1. 父组件向子组件传值

- `props`只能是父组件向子组件进行传值，`props`使得父子组件之间形成了一个单向下行绑定。子组件的数据会随着父组件不断更新。
- `props` 可以显示定义一个或一个以上的数据，对于接收的数据，可以是各种数据类型，同样也可以传递一个函数。
- `props`属性名规则：若在`props`中使用驼峰形式，模板中需要使用短横线的形式

```javascript
// 父组件
<template>
    <div id="father">
        <son :msg="msgData" :fn="myFunction"></son>
    </div>
</template>

<script>
import son from "./son.vue";
export default {
    name: father,
    data() {
        msgData: "父组件数据";
    },
    methods: {
        myFunction() {
            console.log("vue");
        }
    },
    components: {
        son
    }
};
</script>

// 子组件
<template>
    <div id="son">
        <p>{{msg}}</p>
        <button @click="fn">按钮</button>
    </div>
</template>
<script>
export default {
    name: "son",
    props: ["msg", "fn"]
};
</script>
```

##### 2. 子组件向父组件传值

- `$emit`绑定一个自定义事件，当这个事件被执行的时就会将参数传递给父组件，而父组件通过`v-on`监听并接收参数。

```javascript
// 父组件
<template>
  <div class="section">
    <com-article :articles="articleList" @onEmitIndex="onEmitIndex"></com-article>
    <p>{{currentIndex}}</p>
  </div>
</template>

<script>
import comArticle from './test/article.vue'
export default {
  name: 'comArticle',
  components: { comArticle },
  data() {
    return {
      currentIndex: -1,
      articleList: ['红楼梦', '西游记', '三国演义']
    }
  },
  methods: {
    onEmitIndex(idx) {
      this.currentIndex = idx
    }
  }
}
</script>


//子组件
<template>
  <div>
    <div v-for="(item, index) in articles" :key="index" @click="emitIndex(index)">{{item}}</div>
  </div>
</template>

<script>
export default {
  props: ['articles'],
  methods: {
    emitIndex(index) {
      this.$emit('onEmitIndex', index) // 触发父组件的方法，并传递参数index
    }
  }
}
</script>
```

#### （2）eventBus事件总线（`$emit / $on`）

`eventBus`事件总线适用于**父子组件**、**非父子组件**等之间的通信，使用步骤如下： **（1）创建事件中心管理组件之间的通信**

```javascript
// event-bus.js

import Vue from 'vue'
export const EventBus = new Vue()

```

**（2）发送事件** 假设有两个兄弟组件`firstCom`和`secondCom`：

```javascript
<template>
  <div>
    <first-com></first-com>
    <second-com></second-com>
  </div>
</template>

<script>
import firstCom from './firstCom.vue'
import secondCom from './secondCom.vue'
export default {
  components: { firstCom, secondCom }
}
</script>
```

在`firstCom`组件中发送事件：

```javascript
<template>
  <div>
    <button @click="add">加法</button>    
  </div>
</template>

<script>
import {EventBus} from './event-bus.js' // 引入事件中心

export default {
  data(){
    return{
      num:0
    }
  },
  methods:{
    add(){
      EventBus.$emit('addition', {
        num:this.num++
      })
    }
  }
}
</script>
```

**（3）接收事件** 在`secondCom`组件中发送事件：

```javascript
<template>
  <div>求和: {{count}}</div>
</template>

<script>
import { EventBus } from './event-bus.js'
export default {
  data() {
    return {
      count: 0
    }
  },
  mounted() {
    EventBus.$on('addition', param => {
      this.count = this.count + param.num;
    })
  }
}
</script>
```

在上述代码中，这就相当于将`num`值存贮在了事件总线中，在其他组件中可以直接访问。事件总线就相当于一个桥梁，不用组件通过它来通信。

虽然看起来比较简单，但是这种方法也有不变之处，如果项目过大，使用这种方式进行通信，后期维护起来会很困难。

#### （3）依赖注入（provide / inject）

这种方式就是Vue中的**依赖注入**，该方法用于**父子组件之间的通信**。当然这里所说的父子不一定是真正的父子，也可以是祖孙组件，在层数很深的情况下，可以使用这种方法来进行传值。就不用一层一层的传递了。

`provide / inject`是Vue提供的两个钩子，和`data`、`methods`是同级的。并且`provide`的书写形式和`data`一样。

- `provide` 钩子用来发送数据或方法
- `inject`钩子用来接收数据或方法

在父组件中：

```javascript
provide() { 
    return {     
        num: this.num  
    };
}
```

在子组件中：

```javascript
inject: ['num']
```

还可以这样写，这样写就可以访问父组件中的所有属性：

```javascript
provide() {
 return {
    app: this
  };
}
data() {
 return {
    num: 1
  };
}

inject: ['app']
console.log(this.app.num)
```

**注意：** 依赖注入所提供的属性是**非响应式**的。

#### （3）ref / $refs

这种方式也是实现**父子组件**之间的通信。

`ref`： 这个属性用在子组件上，它的引用就指向了子组件的实例。可以通过实例来访问组件的数据和方法。

在子组件中：

```javascript
export default {
  data () {
    return {
      name: 'JavaScript'
    }
  },
  methods: {
    sayHello () {
      console.log('hello')
    }
  }
}
```

在父组件中：

```javascript
<template>
  <child ref="child"></component-a>
</template>
<script>
  import child from './child.vue'
  export default {
    components: { child },
    mounted () {
      console.log(this.$refs.child.name);  // JavaScript
      this.$refs.child.sayHello();  // hello
    }
  }
</script>
```

#### （4）`$parent / $children`

- 使用`$parent`可以让组件访问父组件的实例（访问的是上一级父组件的属性和方法）
- 使用`$children`可以让组件访问子组件的实例，但是，`$children`并不能保证顺序，并且访问的数据也不是响应式的。

在子组件中：

```javascript
<template>
  <div>
    <span>{{message}}</span>
    <p>获取父组件的值为:  {{parentVal}}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Vue'
    }
  },
  computed:{
    parentVal(){
      return this.$parent.msg;
    }
  }
}
</script>
```

在父组件中：

```javascript
// 父组件中
<template>
  <div class="hello_world">
    <div>{{msg}}</div>
    <child></child>
    <button @click="change">点击改变子组件值</button>
  </div>
</template>

<script>
import child from './child.vue'
export default {
  components: { child },
  data() {
    return {
      msg: 'Welcome'
    }
  },
  methods: {
    change() {
      // 获取到子组件
      this.$children[0].message = 'JavaScript'
    }
  }
}
</script>
```

在上面的代码中，子组件获取到了父组件的`parentVal`值，父组件改变了子组件中`message`的值。 **需要注意：**

- 通过`$parent`访问到的是上一级父组件的实例，可以使用`$root`来访问根组件的实例
- 在组件中使用`$children`拿到的是所有的子组件的实例，它是一个数组，并且是无序的
- 在根组件`#app`上拿`$parent`得到的是`new Vue()`的实例，在这实例上再拿`$parent`得到的是`undefined`，而在最底层的子组件拿`$children`是个空数组
- `$children` 的值是**数组**，而`$parent`是个**对象**

#### （5）`$attrs / $listeners`

考虑一种场景，如果A是B组件的父组件，B是C组件的父组件。如果想要组件A给组件C传递数据，这种隔代的数据，该使用哪种方式呢？

如果是用`props/$emit`来一级一级的传递，确实可以完成，但是比较复杂；如果使用事件总线，在多人开发或者项目较大的时候，维护起来很麻烦；如果使用Vuex，的确也可以，但是如果仅仅是传递数据，那可能就有点浪费了。

针对上述情况，Vue引入了`$attrs / $listeners`，实现组件之间的跨代通信。

先来看一下`inheritAttrs`，它的默认值true，继承所有的父组件属性除`props`之外的所有属性；`inheritAttrs：false` 只继承class属性 。

- `$attrs`：继承所有的父组件属性（除了prop传递的属性、class 和 style ），一般用在子组件的子元素上
- `$listeners`：该属性是一个对象，里面包含了作用在这个组件上的所有监听器，可以配合 `v-on="$listeners"` 将所有的事件监听器指向这个组件的某个特定的子元素。（相当于子组件继承父组件的事件）

A组件（`APP.vue`）：

```javascript
<template>
    <div id="app">
        //此处监听了两个事件，可以在B组件或者C组件中直接触发 
        <child1 :p-child1="child1" :p-child2="child2" @test1="onTest1" @test2="onTest2"></child1>
    </div>
</template>
<script>
import Child1 from './Child1.vue';
export default {
    components: { Child1 },
    methods: {
        onTest1() {
            console.log('test1 running');
        },
        onTest2() {
            console.log('test2 running');
        }
    }
};
</script>
```

B组件（`Child1.vue`）：

```javascript
<template>
    <div class="child-1">
        <p>props: {{pChild1}}</p>
        <p>$attrs: {{$attrs}}</p>
        <child2 v-bind="$attrs" v-on="$listeners"></child2>
    </div>
</template>
<script>
import Child2 from './Child2.vue';
export default {
    props: ['pChild1'],
    components: { Child2 },
    inheritAttrs: false,
    mounted() {
        this.$emit('test1'); // 触发APP.vue中的test1方法
    }
};
</script>
```

C 组件 (`Child2.vue`)：

```javascript
<template>
    <div class="child-2">
        <p>props: {{pChild2}}</p>
        <p>$attrs: {{$attrs}}</p>
    </div>
</template>
<script>
export default {
    props: ['pChild2'],
    inheritAttrs: false,
    mounted() {
        this.$emit('test2');// 触发APP.vue中的test2方法
    }
};
</script>
```

在上述代码中：

- C组件中能直接触发test的原因在于 B组件调用C组件时 使用 v-on 绑定了`$listeners` 属性
- 在B组件中通过v-bind 绑定`$attrs`属性，C组件可以直接获取到A组件中传递下来的props（除了B组件中props声明的）

#### （6）总结

**（1）父子组件间通信**

- 子组件通过 props 属性来接受父组件的数据，然后父组件在子组件上注册监听事件，子组件通过 emit 触发事件来向父组件发送数据。
- 通过 ref 属性给子组件设置一个名字。父组件通过 `$refs` 组件名来获得子组件，子组件通过 `$parent` 获得父组件，这样也可以实现通信。
- 使用 provide/inject，在父组件中通过 provide提供变量，在子组件中通过 inject 来将变量注入到组件中。不论子组件有多深，只要调用了 inject 那么就可以注入 provide中的数据。

**（2）兄弟组件间通信**

- 使用 eventBus 的方法，它的本质是通过创建一个空的 Vue 实例来作为消息传递的对象，通信的组件引入这个实例，通信的组件通过在这个实例上监听和触发事件，来实现消息的传递。
- 通过 `$parent/$refs` 来获取到兄弟组件，也可以进行通信。

**（3）任意组件之间**

- 使用 eventBus ，其实就是创建一个事件中心，相当于中转站，可以用它来传递事件和接收事件。

如果业务逻辑复杂，很多组件之间需要同时处理一些公共的数据，这个时候采用上面这一些方法可能不利于项目的维护。这个时候可以使用 vuex ，vuex 的思想就是将这一些公共的数据抽离出来，将它作为一个全局的变量来管理，然后其他组件就可以对这个公共数据进行读写操作，这样达到了解耦的目的。

### 2.vue3的组件间通信方式

七种组件通信方式：

- props
- emit
- v-model
- refs
- provide/inject
- eventBus
- vuex/pinia(状态管理工具)

#### Props方式

`Props`方式是Vue中最常见的一种**父传子**的一种方式，使用也比较简单。

根据上面的demo，我们将数据以及对数据的操作定义在父组件，子组件仅做列表的一个渲染；

父组件代码如下：

```html
<template>
  <!-- 子组件 -->
  <child-components :list="list"></child-components>
  <!-- 父组件 -->
  <div class="child-wrap input-group">
    <input
      v-model="value"
      type="text"
      class="form-control"
      placeholder="请输入"
    />
    <div class="input-group-append">
      <button @click="handleAdd" class="btn btn-primary" type="button">
        添加
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import ChildComponents from './child.vue'
const list = ref(['JavaScript', 'HTML', 'CSS'])
const value = ref('')
// add 触发后的事件处理函数
const handleAdd = () => {
  list.value.push(value.value)
  value.value = ''
}
</script>

```

子组件只需要对父组件传递的值进行渲染即可，代码如下：

```html
<template>
  <ul class="parent list-group">
    <li class="list-group-item" v-for="i in props.list" :key="i">{{ i }}</li>
  </ul>
</template>
<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})
</script>
```

#### emit方式

`emit`方式也是Vue中最常见的组件通信方式，该方式用于**子传父**；

根据上面的demo，我们将列表定义在父组件，子组件只需要传递添加的值即可。

子组件代码如下：

```html
<template>
  <div class="child-wrap input-group">
    <input
      v-model="value"
      type="text"
      class="form-control"
      placeholder="请输入"
    />
    <div class="input-group-append">
      <button @click="handleSubmit" class="btn btn-primary" type="button">
        添加
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, defineEmits } from 'vue'
const value = ref('')
const emits = defineEmits(['add'])
const handleSubmit = () => {
  emits('add', value.value)
  value.value = ''
}
</script>
```

在子组件中点击【添加】按钮后，`emit`一个自定义事件，并将添加的值作为参数传递。

父组件代码如下：

```html
<template>
  <!-- 父组件 -->
  <ul class="parent list-group">
    <li class="list-group-item" v-for="i in list" :key="i">{{ i }}</li>
  </ul>
  <!-- 子组件 -->
  <child-components @add="handleAdd"></child-components>
</template>
<script setup>
import { ref } from 'vue'
import ChildComponents from './child.vue'
const list = ref(['JavaScript', 'HTML', 'CSS'])
// add 触发后的事件处理函数
const handleAdd = value => {
  list.value.push(value)
}
</script>

```

在父组件中只需要监听子组件自定义的事件，然后执行对应的添加操作。

#### v-model方式

`v-model`是Vue中一个比较出色的语法糖，就比如下面这段代码

```html
<ChildComponent v-model:title="pageTitle" />

```

就是下面这段代码的简写形势

```html
<ChildComponent :title="pageTitle" @update:title="pageTitle = $event" />
```

`v-model`确实简便了不少，现在我们就来看一下上面那个demo，如何用v-model实现。

子组件

```html
<template>
  <div class="child-wrap input-group">
    <input
      v-model="value"
      type="text"
      class="form-control"
      placeholder="请输入"
    />
    <div class="input-group-append">
      <button @click="handleAdd" class="btn btn-primary" type="button">
        添加
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, defineEmits, defineProps } from 'vue'
const value = ref('')
const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})
const emits = defineEmits(['update:list'])
// 添加操作
const handleAdd = () => {
  const arr = props.list
  arr.push(value.value)
  emits('update:list', arr)
  value.value = ''
}
</script>

```

在子组件中我们首先定义`props`和`emits`，然后添加完成之后`emit`指定事件。

> 注：`update:*`是Vue中的固定写法，`*`表示`props`中的某个属性名。

父组件中使用就比较简单，代码如下：

```html
<template>
  <!-- 父组件 -->
  <ul class="parent list-group">
    <li class="list-group-item" v-for="i in list" :key="i">{{ i }}</li>
  </ul>
  <!-- 子组件 -->
  <child-components v-model:list="list"></child-components>
</template>
<script setup>
import { ref } from 'vue'
import ChildComponents from './child.vue'
const list = ref(['JavaScript', 'HTML', 'CSS'])
</script>
```

#### refs方式

在使用选项式API时，我们可以通过`this.$refs.name`的方式获取指定元素或者组件，但是组合式API中就无法使用哪种方式获取。如果我们想要通过`ref`的方式获取组件或者元素，需要定义一个同名的Ref对象，在组件挂载后就可以访问了。

示例代码如下：

```html
<template>
  <ul class="parent list-group">
    <li class="list-group-item" v-for="i in childRefs?.list" :key="i">
      {{ i }}
    </li>
  </ul>
  <!-- 子组件 ref的值与<script>中的保持一致 -->
  <child-components ref="childRefs"></child-components>
  <!-- 父组件 -->
</template>
<script setup>
import { ref } from 'vue'
import ChildComponents from './child.vue'
const childRefs = ref(null)
</script>
```

子组件代码如下：

```html
<template>
  <div class="child-wrap input-group">
    <input
      v-model="value"
      type="text"
      class="form-control"
      placeholder="请输入"
    />
    <div class="input-group-append">
      <button @click="handleAdd" class="btn btn-primary" type="button">
        添加
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, defineExpose } from 'vue'
const list = ref(['JavaScript', 'HTML', 'CSS'])
const value = ref('')
// add 触发后的事件处理函数
const handleAdd = () => {
  list.value.push(value.value)
  value.value = ''
}
defineExpose({ list })
</script>
```

`setup`组件默认是关闭的，也即通过模板`ref`获取到的组件的公开实例，**不会暴露任何在****`<script setup>`***\*中声明的绑定\**。如果需要**公开需要通过****`defineExpose`**** API暴露**。

#### provide/inject方式

`provide`和`inject`是Vue中提供的一对API，该API可以实现父组件向子组件传递数据，无论层级有多深，都可以通过这对API实现。示例代码如下所示：

父组件

```html
<template>
  <!-- 子组件 -->
  <child-components></child-components>
  <!-- 父组件 -->
  <div class="child-wrap input-group">
    <input
      v-model="value"
      type="text"
      class="form-control"
      placeholder="请输入"
    />
    <div class="input-group-append">
      <button @click="handleAdd" class="btn btn-primary" type="button">
        添加
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, provide } from 'vue'
import ChildComponents from './child.vue'
const list = ref(['JavaScript', 'HTML', 'CSS'])
const value = ref('')
// 向子组件提供数据
provide('list', list.value)
// add 触发后的事件处理函数
const handleAdd = () => {
  list.value.push(value.value)
  value.value = ''
}
</script>
```

子组件

```html
<template>
  <ul class="parent list-group">
    <li class="list-group-item" v-for="i in list" :key="i">{{ i }}</li>
  </ul>
</template>
<script setup>
import { inject } from 'vue'
// 接受父组件提供的数据
const list = inject('list')
</script>
```

值得注意的是**使用`provide`进行数据传递时，尽量`readonly`进行数据的包装，避免子组件修改父级传递过去的数据**。

#### 事件总线

Vue3中移除了事件总线，但是可以借助于第三方工具来完成，Vue官方推荐[mitt](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fmitt)或[tiny-emitter](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Ftiny-emitter)；

在大多数情况下不推荐使用全局事件总线的方式来实现组件通信，虽然比较简单粗暴，但是长久来说维护事件总线是一个大难题，所以这里就不展开讲解了，具体可以阅读具体工具的文档

## 路由

### 1.hash和history模式区别

Vue-Router有两种模式：**hash模式**和**history模式**。默认的路由模式是hash模式。

#### 1. hash模式

**简介：** hash模式是开发中默认的模式，它的URL带着一个#，例如：[www.abc.com/#/vue](https://link.juejin.cn/?target=http%3A%2F%2Fwww.abc.com%2F%23%2Fvue)，它的hash值就是`#/vue`。

**特点**：hash值会出现在URL里面，但是不会出现在HTTP请求中，对后端完全没有影响。所以改变hash值，不会重新加载页面。这种模式的浏览器支持度很好，低版本的IE浏览器也支持这种模式。hash路由被称为是前端路由，已经成为SPA（单页面应用）的标配。

**原理：** hash模式的主要原理就是**onhashchange()事件**：

```javascript
window.onhashchange = function(event){
	console.log(event.oldURL, event.newURL);
	let hash = location.hash.slice(1);
}
```

使用onhashchange()事件的好处就是，在页面的hash值发生变化时，无需向后端发起请求，window就可以监听事件的改变，并按规则加载相应的代码。除此之外，hash值变化对应的URL都会被浏览器记录下来，这样浏览器就能实现页面的前进和后退。虽然是没有请求后端服务器，但是页面的hash值和对应的URL关联起来了。

#### 2. history模式

**简介：** history模式的URL中没有#，它使用的是传统的路由分发模式，即用户在输入一个URL时，服务器会接收这个请求，并解析这个URL，然后做出相应的逻辑处理。 **特点：** 当使用history模式时，URL就像这样：[abc.com/user/id](https://link.juejin.cn/?target=http%3A%2F%2Fabc.com%2Fuser%2Fid)。相比hash模式更加好看。但是，history模式需要后台配置支持。如果后台没有正确配置，访问时会返回404。 **API：** history api可以分为两大部分，切换历史状态和修改历史状态：

- **修改历史状态**：包括了 HTML5 History Interface 中新增的 `pushState()` 和 `replaceState()` 方法，这两个方法应用于浏览器的历史记录栈，提供了对历史记录进行修改的功能。只是当他们进行修改时，虽然修改了url，但浏览器不会立即向后端发送请求。如果要做到改变url但又不刷新页面的效果，就需要前端用上这两个API。
- **切换历史状态：** 包括`forward()`、`back()`、`go()`三个方法，对应浏览器的前进，后退，跳转操作。

history.state    用于存储2个方法的data数据，不同浏览器的读写权限不一样

响应pushState或者replaceState的调用

 每当活动的历史记录项发生变化时， `popstate` 事件都会被传递给window对象。如果当前活动的历史记录项是被 `pushState` 创建的，或者是由 `replaceState` 改变的，那么 `popstate` 事件的状态属性 `state` 会包含一个当前历史记录状态对象的拷贝



虽然history模式丢弃了丑陋的#。但是，它也有自己的缺点，就是在刷新页面的时候，如果没有相应的路由或资源，就会刷出404来。

如果想要切换到history模式，就要进行以下配置（后端也要进行配置）：

```javascript
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```

#### 3. 两种模式对比

调用 history.pushState() 相比于直接修改 hash，存在以下优势:

- pushState() 设置的新 URL 可以是与当前 URL 同源的任意 URL；而 hash 只可修改 # 后面的部分，因此只能设置与当前 URL 同文档的 URL；
- pushState() 设置的新 URL 可以与当前 URL 一模一样，这样也会把记录添加到栈中；而 hash 设置的新值必须与原来不一样才会触发动作将记录添加到栈中；
- pushState() 通过 stateObject 参数可以添加任意类型的数据到记录中；而 hash 只可添加短字符串；
- pushState() 可额外设置 title 属性供后续使用。
- hash模式下，仅hash符号之前的url会被包含在请求中，后端如果没有做到对路由的全覆盖，也不会返回404错误；history模式下，前端的url必须和实际向后端发起请求的url一致，如果没有对用的路由处理，将返回404错误。

hash模式和history模式都有各自的优势和缺陷，还是要根据实际情况选择性的使用。

### 2.前端路由和后端路由的区别

1.什么是路由

路由是根据不同的url展示不同的内容或页面。

2.什么是前端路由

特点：不向后台发送请求，不刷新页面，前后端分离

前端路由即响应页面内容的任务是由前端来做的，根据不同的url更新页面的内容，随着SPA（单页面应用）的普遍使用，前后端开发分离，项目中基本都使用前端路由，通过路由实现页面的变化。例如，通过vue开发的SPA中，切换路由，并不刷新页面，而是根据路由在虚拟DOM中加载所需要的数据，实现页面内容的改变。

3.什么是后端路由

特点：向服务器发送请求，会刷新页面，前后端不能分离

在浏览器的地址栏中切换不同的url时，每次都向后台服务器发出请求，服务器根据不同的响应不同的数据，浏览器接收到数据后再进行渲染，所以后端路由会刷新页面，如果网速慢的话，就会看到一个空白页面等待服务端返回数据，后台路由最大的问题就是不能前后端分离。

4.什么时候使用前端路由

在单页面应用中，大部分页面结构不变，只改变部分内容时使用

5.前端路由的优缺点

优点：

1.用户体验好，页面初始化后，只需要根据路由变换页面内容，不需要再向服务器发送请求，内容变换速度快。

2.可以在浏览器中输入指定想要访问的url

3.实现了前后端分离，方便开发。

缺点：

1.使用浏览器的前进、后退键的时候会重新发送请求，没有合理的利用缓存

2.单页面无法记住之前滚动的位置，无法在前进、后退的时候记住滚动的位置

### 3.如何获取页面的hash变化

**（1）监听$route的变化**

```javascript
// 监听,当路由发生变化的时候执行
watch: {
  $route: {
    handler: function(val, oldVal){
      console.log(val);
    },
    // 深度观察监听
    deep: true
  }
},
```

**（2）window.location.hash读取#值** window.location.hash 的值可读可写，读取来判断状态是否改变，写入时可以在不重载网页的前提下，添加一条历史访问记录。

### 4.route和router的区别

- $route 是“路由信息对象”，包括 path，params，hash，query，fullPath，matched，name 等路由信息参数
- $router 是“路由实例”对象包括了路由的跳转方法，钩子函数等

### 5.params和query的区别

#### 1.跳转方式不同

query可以使用name或者path方式跳转

```js
//query传参，使用name跳转
this.$router.push({
    name:'second',
    query: {
        queryId:'20180822',
        queryName: 'query'
    }
})

//query传参，使用path跳转
this.$router.push({
    path:'second',
    query: {
        queryId:'20180822',
        queryName: 'query'
    }
})

//query传参接收
this.queryName = this.$route.query.queryName;
this.queryId = this.$route.query.queryId;
```

params只能使用name方式进行跳转引入

```js
//params传参 使用name
this.$router.push({
  name:'second',
  params: {
    id:'20180822',
     name: 'query'
  }
})

//params接收参数
this.id = this.$route.params.id ;
this.name = this.$route.params.name ;
```

#### 2.浏览器url显示的不同

```js
//使用params时
//路由 
{ 
    path: '/second/:id/:name', 
    name: 'second', 
    component: () => import('@/view/second') 
}
//传参
this.$router.push({
    name: 'second',
    params: {
        id: '1245314',
        name: 'wendy'
    }
})
//浏览器url地址 页面刷新时参数不会丢失
localhost:8080/second/1245314/wendy
//如果路由后面没有 /:id/:name效果如下图，注意：地址栏没有参数,页面一刷新参数就会丢失
localhost:8080/second
//接收参数
this.$route.params.id
this.$route.params.name
复制代码
//使用query时
//传参
this.$router.push({
    name:'second',
    query: {
        queryId:'20180822',
        queryName: 'query'
    }
})
//浏览器url地址
localhost:8080?queryId='20180822'&queryName='query'
//页面刷新时参数不会丢失，因为参数写在地址栏上了
```

#### params:

1.params是路由的一部分，因此使用params传参，路由上必须写对应的参数；
2.进行路由跳转的时候要传值，否则会跳转页面失败；
3.params只能使用name来传参；
4.params相当于post请求，参数对用来说是不可见的

#### Query:

1.query传参可以使用path,也可以使用name;
2.query相当于get请求，参数拼接在路由的后面；
3.query是拼接在路由后面的，因此有没有没关系；

### 6.动态路由怎么定义

**（1）param方式**

- 配置路由格式：`/router/:id`
- 传递的方式：在path后面跟上对应的值
- 传递后形成的路径：`/router/123`

1）路由定义

```javascript
//在APP.vue中
<router-link :to="'/user/'+userId" replace>用户</router-link>    

//在index.js
{
   path: '/user/:userid',
   component: User,
},
```

2）路由跳转

```javascript
// 方法1：
<router-link :to="{ name: 'users', params: { uname: wade }}">按钮</router-link

// 方法2：
this.$router.push({name:'users',params:{uname:wade}})

// 方法3：
this.$router.push('/user/' + wade)
```

3）参数获取 通过 `$route.params.userid` 获取传递的值

**（2）query方式**

- 配置路由格式：`/router`，也就是普通配置
- 传递的方式：对象中使用query的key作为传递方式
- 传递后形成的路径：`/route?id=123`

1）路由定义

```javascript
//方式1：直接在router-link 标签上以对象的形式
<router-link :to="{path:'/profile',query:{name:'why',age:28,height:188}}">档案</router-link>

// 方式2：写成按钮以点击事件形式
<button @click='profileClick'>我的</button>    

profileClick(){
  this.$router.push({
    path: "/profile",
    query: {
        name: "kobi",
        age: "28",
        height: 198
    }
  });
}
```

2）跳转方法

```javascript
// 方法1：
<router-link :to="{ name: 'users', query: { uname: james }}">按钮</router-link>

// 方法2：
this.$router.push({ name: 'users', query:{ uname:james }})

// 方法3：
<router-link :to="{ path: '/user', query: { uname:james }}">按钮</router-link>

// 方法4：
this.$router.push({ path: '/user', query:{ uname:james }})

// 方法5：
this.$router.push('/user?uname=' + jsmes)
```

3）获取参数

```javascript
通过$route.query 获取传递的值
```

### 7.VueRouter和Location.href跳转方式的区别

- 使用 `location.href= /url `来跳转，简单方便，但是刷新了页面；
- 使用 `history.pushState( /url )` ，无刷新页面，静态跳转；
- 引进 router ，然后使用 `router.push( /url )` 来跳转，使用了 `diff` 算法，实现了按需加载，减少了 dom 的消耗。其实使用 router 跳转和使用 `history.pushState()` 没什么差别的，因为vue-router就是用了 `history.pushState()` ，尤其是在history模式下。

### 8.Vue-Router 的懒加载如何实现

非懒加载：

```javascript
import List from '@/components/list.vue'
const router = new VueRouter({
  routes: [
    { path: '/list', component: List }
  ]
})
```

（1）方案一(常用)：使用箭头函数+import动态加载

```javascript
const List = () => import('@/components/list.vue')
const router = new VueRouter({
  routes: [
    { path: '/list', component: List }
  ]
})
```

（2）方案二：使用箭头函数+require动态加载

```javascript
const router = new Router({
  routes: [
   {
     path: '/list',
     component: resolve => require(['@/components/list'], resolve)
   }
  ]
})
```

（3）方案三：使用webpack的require.ensure技术，也可以实现按需加载。 这种情况下，多个路由指定相同的chunkName，会合并打包成一个js文件。

```javascript
// r就是resolve
const List = r => require.ensure([], () => r(require('@/components/list')), 'list');
// 路由也是正常的写法  这种是官方推荐的写的 按模块划分懒加载 
const router = new Router({
  routes: [
  {
    path: '/list',
    component: List,
    name: 'list'
  }
 ]
}))
```

### 9.路由导航守卫

- 全局前置/钩子：beforeEach、beforeResolve、afterEach
- 路由独享的守卫：beforeEnter
- 组件内的守卫：beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave

### 10.两种路由的工作原理

`Hash`模式的工作原理。

- `URL`中`#`后面的内容作为路径地址，当地址改变的时候不会向服务器发送请求，但是会触发`hashchange`事件。
- 监听`hashchange`事件，在该事件中记录当前的路由地址，然后根据路由地址找到对应组件。
- 根据当前路由地址找到对应组件重新渲染。

`History`模式

- 通过`history.pushState()`方法改变地址栏，并且将当前地址记录到浏览器的历史记录中。当前浏览器不会向服务器发送请求
- 监听`popstate`事件，可以发现浏览器历史操作的变化，记录改变后的地址，单击前进或者是后退按钮的时候触发该事件
- 根据当前路由地址找到对应组件重新渲染

### 11.vue router基本原理

`Vue Router`的核心代码

```js
//注册插件
Vue.use(VueRouter)
//创建路由对象
const router=new VueRouter({
    routes:[
        {name:'home',path:'/',component:homeComponent}
    ]
})
// 创建Vue实例，注册router对象
new Vue({
    router,
    render:h=>h(App)
}).$mount('#apps')
```

use`方法需要的参数可以是一个函数或者是对象，如果传递的是函数，`use`内部会直接调用该函数，

如果传递的是一个对象，那么在`use`内部会调用该对象的`install`方法。

![类图](https://s2.loli.net/2022/04/30/ILdSwKy4FH1oVYv.png)

上半部分是`VueRouter`的属性，而下半部分是`VueRouter`的方法

options`作用是记录构造函数中传入的对象, 我们在创建`Vue Router`的实例的时候，传递了一个对象，而该对象中定义了路由规则。而`options`就是记录传入的这个对象的。

`routeMap`:是一个对象，记录路由地址与组件的对应关系，也就是一个键值对的形式，后期会options中路由规则解析到`routeMap`中。

`data`是一个对象，该对象中有一个属性`current`,该属性用来记录当前的路由地址，`data`是一个响应式的对象，因为当前路由地址发生变化后，对应的组件要发生更新（*也就说当地址变化后，要加载对应组件*）

`install`是一个静态方法，用来实现`Vue`的插件机制。

`Constructor`是一个构造方法，该该构造方法中会初始化`options` ,`data`,`routeMap`这几个属性。

init方法主要是用来调用下面的三个方法，也就把不同的代码分隔到不同的方法中去实现。

`initEvent`方法，用来注册`popstate`事件，

`createRouteMap`方法，该方法会把构造函数中传入进来的路由规则，转换成键值对的形式存储到`routeMap`中。 键就是路由的地址，值就是对应的组件

`initComponents`方法，主要作用是用来创建`router-link`和`router-view`这两个组件的。

#### install方法实现

```
let _Vue = null;
export default class VueRouter {
  //调用install方法的时候，会传递Vue的构造函数
  static install(Vue) {
    //首先判断插件是否已经被安装，如果已经被安装，就不需要重复安装。   
    //1、判断当前插件是否已经被安装:  
    if (VueRouter.install.installed) {
      //条件成立，表明插件已经被安装，什么都不要做。
      return;
    }
    VueRouter.install.installed = true;
    //2、把Vue构造函数记录到全局变量中。
    _Vue = Vue;

    //3、把创建Vue实例时候传入的router对象注入到Vue实例上。
    _Vue.mixin({
      beforeCreate() {
        //在创建Vue实例的时候
        // 也就是new Vue()的时候，才会有$options这个属性，
        //组件中是没有$options这个属性的。
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router;
        }
      },
    });
  }
}
```

#### 构造函数

`Constructor`是一个构造方法，该该构造方法中会初始化`options` ,`data`,`routeMap`这几个属性

```js
 constructor(options) {
  
    this.options = options;
 
    this.routeMap = {};
  
    this.data = _Vue.observable({
      current: "/",
    }); 
  }
```

#### createRouteMap方法实现

`createRouteMap`方法，该方法会把构造函数中传入进来的`options`参数中的路由规则，转换成键值对的形式存储到`routeMap`中。 键就是路由的地址，值就是对应的组件

```js
  createRouteMap() {
   
    this.options.routes.forEach((route) => {
      this.routeMap[route.path] = route.component;
    });
  }
```

#### initComponents方法实现

initComponents`方法，主要作用是用来创建`router-link`和`router-view`这两个组件的。

下面先在这个方法中创建`router-link`这个组件。

`<router-link to="/users"> 用户管理</router-link>`

`router-link`这个组件最终会被渲染成`a`标签，同时`to`作为一个属性，其值会作为`a`标签中的`href`属性的值。同时还要获取`<router-link>`这个组件中的文本，作为最终超链接的文本

```js
 initComponents(Vue) {
    Vue.component("router-link", {
      props: {
        to: String,
      },
      template: '<a :href="to"><slot></slot></a>',
    });
  }
```

我们通过`Vue.component`来创建`router-link`这个组件，同时通过`props`接收`to`属性传递过来的值，并且对应的类型为字符串。

最终渲染的模板是一个`a`标签，**`href`属性绑定了`to`属性的值**，同时使用`<slot>`插槽作为占位符，用具体的文字内容填充该占位符。

在VueRoute对象创建成功后，并且将`VueRouter`对象注册到`Vue`的实例上的时候，调用这两个方法。

也就是在`beforeCreate`这个钩子函数中

当然为了调用这两个方便，在这里我们又定义了`init`方法，来做了一次封装处理。

```js
  init() {
    this.createRouteMap();
    this.initComponents(_Vue);
  }
```

对`init`方法的调用如下：

```js
   beforeCreate() {
        //在创建Vue实例的时候
        // 也就是new Vue()的时候，才会有$options这个属性，
        //组件中是没有$options这个属性的。
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router;
            //调用init
          this.$options.router.init();
        }
      },
```

this.$options.router.init();

this`表示的就是Vue实例，`$options`表示的就是在创建`Vue`的实例的时候传递的选项，如下所示：

```js
  const vm = new Vue({
        el: "#app",
        router,
      });
```

传递过来的选项中是有router

router就是VueRouter类的实例

`init`方法就是`VueRouter`这个类的实例方法

可以通过`this.$options.router.init()`的方式来调用

#### render函数

完整版中的编译器的作用就是将`template`模板转成`render`函数，所以在运行时版本中我们可以自己编写`render`函数

```js
 //该方法需要一个参数为Vue的构造函数。
  //当然也可以使用全局的_Vue.
  initComponents(Vue) {
    Vue.component("router-link", {
      props: {
        to: String,
      },
      // template: '<a :href="to"><slot></slot></a>',
      render(h) {
     
        return h(
          "a",
          {
            attrs: {
              href: this.to,
            },
          },
          [this.$slots.default]
        );
      },
    });
  }
```

#### 创建`router-view`组件

router-view`组件就是一个占位符。当根据路由规则找到组件后，会渲染到`router-view`的位置。

在`initComponents`方法中创建`router-view`组件

```js
 //该方法需要一个参数为Vue的构造函数。
  //当然也可以使用全局的_Vue.
  initComponents(Vue) {
    Vue.component("router-link", {
      props: {
        to: String,
      },
      // template: '<a :href="to"><slot></slot></a>',
      render(h) {
      
        return h(
          "a",
          {
            attrs: {
              href: this.to,
            },
          },
          [this.$slots.default]
        );
      },
    });
    const self = this;//修改this的指向
    Vue.component("router-view", {
      render(h) {
        //根据当前的路径从routeMap中查找对应的组件.
        const component = self.routeMap[self.data.current];
        //将组件转换成虚拟dom
        return h(component);
      },
    });
  }
```

当我们单击链接的时候，发现了浏览器进行了刷新操作。表明向服务器发送了请求，而我们单页面应用中是不希望向服务器发送请求。

```js
 //该方法需要一个参数为Vue的构造函数。
  //当然也可以使用全局的_Vue.
  initComponents(Vue) {
    Vue.component("router-link", {
      props: {
        to: String,
      },
      // template: '<a :href="to"><slot></slot></a>',
      render(h) {
  
        return h(
          "a",
          {
            attrs: {
              href: this.to,
            },
            on: {
              click: this.clickHandler,
            },
          },
          [this.$slots.default]
        );
      },
      methods: {
        clickHandler(e) {
        
          history.pushState({}, "", this.to);
        
          this.$router.data.current = this.to;

          //阻止向服务器发送器。
          e.preventDefault();
        },
      },
    });
    const self = this;
    Vue.component("router-view", {
      render(h) {
        //根据当前的路径从routeMap中查找对应的组件.
        const component = self.routeMap[self.data.current];
        //将组件转换成虚拟dom
        return h(component);
      },
    });
  }
```

#### initEvent方法实现

当点击浏览器中的后退与前进按钮的时候，地址栏中的地址发生了变化，但是对应的组件没有发生变化。

这时候要解决这个问题， 就需要用到`popstate`事件

`popstate`事件，可以发现浏览器历史操作的变化，记录改变后的地址，单击前进或者是后退按钮的时候触发该事件

```js
initEvent() {
    window.addEventListener("popstate", () => {
   
      this.data.current = window.location.pathname;
    });
  }
```

```js
init() {
    this.createRouteMap();
    this.initComponents(_Vue);
    this.initEvent();
  }
```



## Vuex

### 1.Vuex基本原理，有哪些属性，为什么用Vuex

有什么状态时需要我们在多个组件间共享呢？

比如用户的登录状态、用户名称、头像、地理位置等等。

比如商品的收藏、购物车中的物品等等。

这些状态信息，我们都可以放在统一的地方，对它进行保护管理，而且它们还是响应式的。

以下是一个表示“单向数据流”理念的极简示意：

但是，当我们的应用遇到多个组件共享状态时，单向数据流的简洁性很容易被破坏：
- 多个视图依赖于同一状态。
- 来自不同视图的行为需要变更同一状态。
对于问题一，传参的方法对于多层嵌套的组件将会非常繁琐，并且对于兄弟组件间的状态传递无能为力。

对于问题二，我们经常会采用父子组件直接引用或者通过事件来变更和同步状态的多份拷贝。以上的这些模式非常脆弱，通常会导致无法维护的代码。



因此，我们为什么不把组件的共享状态抽取出来，以一个全局单例模式管理呢？在这种模式下，我们的组件树构成了一个巨大的“视图”，不管在树的哪个位置，任何组件都能获取状态或者触发行为！

另外，通过定义和隔离状态管理中的各种概念并强制遵守一定的规则，我们的代码将会变得更结构化且易维护。

这就是 Vuex 背后的基本思想，借鉴了 Flux、Redux、和 The Elm Architecture。与其他模式不同的是，Vuex 是专门为 Vue.js 设计的状态管理库，以利用 Vue.js 的细粒度数据响应机制来进行高效的状态更新。

什么情况下应该使用 Vuex？

虽然 Vuex 可以帮助我们管理共享状态，但也附带了更多的概念和框架。这需要对短期和长期效益进行权衡。

如果您不打算开发大型单页应用，使用 Vuex 可能是繁琐冗余的。确实是如此——如果您的应用够简单，您最好不要使用 Vuex。一个简单的 global event bus 就足够您所需了。但是，如果您需要构建是一个中大型单页应用，您很可能会考虑如何更好地在组件外部管理状态，Vuex 将会成为自然而然的选择。引用 Redux 的作者 Dan Abramov 的话说就是：

Flux 架构就像眼镜：您自会知道什么时候需要它。



使用 vue/react 等框架，需要关注点基本就是数据，因为框架解决了数据和页面更新的实现。页面和数据的关系是y=f(x)

那么我们需要关注数据(model) 和 视图(组件) 之间的关系.

一个组件使用一个 model，一对一的关系
2. 一个组件使用多个 model，一对多的关系
3. 多个组件使用一个 model，多对一的关系
4. 多个组件使用多个 model，多对多的关系
所以组件和数据之间的对应关系，随着项目的复杂，变得混乱。所以需要统一管理数据，把数据的存取集中到一个地方，所有的组件都从这个地方取数据，更新数据也集中到同一个地方。

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。每一个 Vuex 应用的核心就是 store（仓库）。“store” 基本上就是一个容器，它包含着你的应用中大部分的状态 ( state )。

- Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
- 改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样可以方便地跟踪每一个状态的变化。

![b025e120ca3d0bd2ded3d038d58cacf4.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92fc4b2c6e414344b9b22bc057dcd39c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp) 

Vuex为Vue Components建立起了一个完整的生态圈，包括开发中的API调用一环。 

**（1)核心流程中的主要功能：**

- Vue Components 是 vue 组件，组件会触发（dispatch）一些事件或动作，也就是图中的 Actions;
- 在组件中发出的动作，肯定是想获取或者改变数据的，但是在 vuex 中，数据是集中管理的，不能直接去更改数据，所以会把这个动作提交（Commit）到 Mutations 中;
- 然后 Mutations 就去改变（Mutate）State 中的数据;
- 当 State 中的数据被改变之后，就会重新渲染（Render）到 Vue Components 中去，组件展示更新后的数据，完成一个流程。
- 有五种属性，分别是 State、 Getter、Mutation 、Action、 Module
  - state => 基本数据(数据源存放地)
  - getters => 从基本数据派生出来的数据
  - mutations => 提交更改数据的方法，同步
  - actions => 像一个装饰器，包裹mutations，使之可以异步。
  - modules => 模块化Vuex

**（2）各模块在核心流程中的主要功能：**

- `Vue Components`∶ Vue组件。HTML页面上，负责接收用户操作等交互行为，执行dispatch方法触发对应action进行回应。
- `dispatch`∶操作行为触发方法，是唯一能执行action的方法。
- `actions`∶ 操作行为处理模块。负责处理Vue Components接收到的所有交互行为。包含同步/异步操作，支持多个同名方法，按照注册的顺序依次触发。向后台API请求的操作就在这个模块中进行，包括触发其他action以及提交mutation的操作。该模块提供了Promise的封装，以支持action的链式触发。
- `commit`∶状态改变提交操作方法。对mutation进行提交，是唯一能执行mutation的方法。
- `mutations`∶状态改变操作方法。是Vuex修改state的唯一推荐方法，其他修改方式在严格模式下将会报错。该方法只能进行同步操作，且方法名只能全局唯一。操作之中会有一些hook暴露出来，以进行state的监控等。
- `state`∶ 页面状态管理容器对象。集中存储Vuecomponents中data对象的零散数据，全局唯一，以进行统一的状态管理。页面显示所需的数据从该对象中进行读取，利用Vue的细粒度数据响应机制来进行高效的状态更新。
- `getters`∶ state对象读取方法。图中没有单独列出该模块，应该被包含在了render中，Vue Components通过该方法读取全局state对象。

### 2.Vuex中的actions和mutations的区别

mutation中的操作是一系列的同步函数，用于修改state中的变量的的状态。当使用vuex时需要通过commit来提交需要操作的内容。mutation 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是实际进行状态更改的地方，并且它会接受 state 作为第一个参数：

```javascript
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      state.count++      // 变更状态
    }
  }
})
```

当触发一个类型为 increment 的 mutation 时，需要调用此函数：

```javascript
store.commit('increment')
```

而Action类似于mutation，不同点在于：

- Action 可以包含任意异步操作。
- Action 提交的是 mutation，而不是直接变更状态。

```javascript
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```

Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters。 所以，两者的不同点如下：

- Mutation专注于修改State，理论上是修改State的唯一途径；Action业务代码、异步请求。
- Mutation：必须同步执行；Action：可以异步，但不能直接操作State。
- 在视图更新时，先触发actions，actions再触发mutation
- mutation的参数是state，它包含store中的数据；store的参数是context，它是 state 的父级，包含 state、getters

### 3.Vuex和localstorage的区别

**（1）最重要的区别**

- vuex存储在内存中
- localstorage 则以文件的方式存储在本地，只能存储字符串类型的数据，存储对象需要 JSON的stringify和parse方法进行处理。 读取内存比读取硬盘速度要快

**（2）应用场景**

- Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。vuex用于组件之间的传值。
- localstorage是本地存储，是将数据存储到浏览器的方法，一般是在跨页面传递数据时使用 。
- Vuex能做到数据的响应式，localstorage不能

**（3）永久性**

刷新页面时vuex存储的值会丢失，localstorage不会。

**注意：** 对于不变的数据确实可以用localstorage可以代替vuex，但是当两个组件共用一个数据源（对象或数组）时，如果其中一个组件改变了该数据源，希望另一个组件响应该变化时，localstorage无法做到，原因就是区别1。

### 4.Vuex的mutations为什么不能做异步操作

- Vuex中所有的状态更新的唯一途径都是mutation，异步操作通过 Action 来提交 mutation实现，这样可以方便地跟踪每一个状态的变化，从而能够实现一些工具帮助更好地了解我们的应用。
- 每个mutation执行完成后都会对应到一个新的状态变更，这样devtools就可以打个快照存下来，然后就可以实现 time-travel 了。如果mutation支持异步操作，就没有办法知道状态是何时更新的，无法很好的进行状态的追踪，给调试带来困难。

### 5.基本注意

在组件里面  用方法执行dispatch('函数名'，value)

actions 对象中函数接受参数（context,value)   执行context.commit('函数名',value)

mutations  对象 中函数接受参数（state,value)

getters  用于将state中的数据进行加工

mapState  传入对象包含计算属性名和state对应的变量名  产生了一个对象  可以在计算属性对象里面进行展开 mapstate生成计算属性 从state中读取数据  对象可以简写成数组[ '  ' ]       namespaced true 才能让mapstate识别模块名简写

mapGetters  传入对象包含计算属性名和state对应的变量名

mapActions 生成对应方法  方法中会调用dispatch去联系actions  注意模块名

mapMutations 生成对应方法  方法中会调用commit去联系mutations 注意模块名

## Vue3

### 1.Vue3有哪些新特性？

**（1）监测机制的改变**

- 3.0 将带来基于代理 Proxy的 observer 实现，提供全语言覆盖的反应性跟踪。
- 消除了 Vue 2 当中基于 Object.defineProperty 的实现所存在的很多限制：

**（2）只能监测属性，不能监测对象**

- 检测属性的添加和删除；
- 检测数组索引和长度的变更；
- 支持 Map、Set、WeakMap 和 WeakSet。

**（3）模板**

- 作用域插槽，2.x 的机制导致作用域插槽变了，父组件会重新渲染，而 3.0 把作用域插槽改成了函数的方式，这样只会影响子组件的重新渲染，提升了渲染的性能。
- 同时，对于 render 函数的方面，vue3.0 也会进行一系列更改来方便习惯直接使用 api 来生成 vdom 。

**（4）对象式的组件声明方式**

- vue2.x 中的组件是通过声明的方式传入一系列 option，和 TypeScript 的结合需要通过一些装饰器的方式来做，虽然能实现功能，但是比较麻烦。
- 3.0 修改了组件的声明方式，改成了类式的写法，这样使得和 TypeScript 的结合变得很容易

**（5）其它方面的更改**

- 支持自定义渲染器，从而使得 weex 可以通过自定义渲染器的方式来扩展，而不是直接 fork 源码来改的方式。
- 支持 Fragment（多个根节点）和 Protal（在 dom 其他部分渲染组建内容）组件，针对一些特殊的场景做了处理。
- 基于 tree shaking 优化，提供了更多的内置功能。

### 2.Proxy的优点

Vue 在实例初始化时遍历 data 中的所有属性，并使用 Object.defineProperty 把这些属性全部转为 getter/setter。这样当追踪数据发生变化时，setter 会被自动调用。

Object.defineProperty 是 ES5 中一个无法 shim 的特性，这也就是 Vue 不支持 IE8 以及更低版本浏览器的原因。

但是这样做有以下问题：

1. 添加或删除对象的属性时，Vue 检测不到。因为添加或删除的对象没有在初始化进行响应式处理，只能通过`$set` 来调用`Object.defineProperty()`处理。
2. 无法监控到数组下标和长度的变化。

Vue3 使用 Proxy 来监控数据的变化。Proxy 是 ES6 中提供的功能，其作用为：用于定义基本操作的自定义行为（如属性查找，赋值，枚举，函数调用等）。相对于`Object.defineProperty()`，其有以下特点：

1. Proxy 直接代理整个对象而非对象属性，这样只需做一层代理就可以监听同级结构下的所有属性变化，包括新增属性和删除属性。
2. Proxy 可以监听数组的变化。

在 Vue2 中， 0bject.defineProperty 会改变原始数据，而 Proxy 是创建对象的虚拟表示，并提供 set 、get 和 deleteProperty 等处理器，这些处理器可在访问或修改原始对象上的属性时进行拦截，有以下特点∶

- 不需用使用 `Vue.$set` 或 `Vue.$delete` 触发响应式。
- 全方位的数组变化检测，消除了Vue2 无效的边界情况。
- 支持 Map，Set，WeakMap 和 WeakSet。

Proxy 实现的响应式原理与 Vue2的实现原理相同，实现方式大同小异∶

- get 收集依赖
- Set、delete 等触发依赖
- 对于集合类型，就是对集合对象的方法做一层包装：原方法执行后执行依赖相关的收集或触发逻辑。

### 3.如何理解composition API

在 Vue2 中，代码是 Options API 风格的，也就是通过填充 (option) data、methods、computed 等属性来完成一个 Vue 组件。这种风格使得 Vue 相对于 React极为容易上手，同时也造成了几个问题：

1. 由于 Options API 不够灵活的开发方式，使得Vue开发缺乏优雅的方法来在组件间共用代码。
2. Vue 组件过于依赖`this`上下文，Vue 背后的一些小技巧使得 Vue 组件的开发看起来与 JavaScript 的开发原则相悖，比如在`methods` 中的`this`竟然指向组件实例来不指向`methods`所在的对象。这也使得 TypeScript 在Vue2 中很不好用。

于是在 Vue3 中，舍弃了 Options API，转而投向 Composition API。Composition API本质上是将 Options API 背后的机制暴露给用户直接使用，这样用户就拥有了更多的灵活性，也使得 Vue3 更适合于 TypeScript 结合。

如下，是一个使用了 Vue Composition API 的 Vue3 组件：

```javascript
<template>
  <button @click="increment">
    Count: {{ count }}
  </button>
</template>
 
<script>
// Composition API 将组件属性暴露为函数，因此第一步是导入所需的函数
import { ref, computed, onMounted } from 'vue'
 
export default {
  setup() {
// 使用 ref 函数声明了称为 count 的响应属性，对应于Vue2中的data函数
    const count = ref(0)
 
// Vue2中需要在methods option中声明的函数，现在直接声明
    function increment() {
      count.value++
    }
 // 对应于Vue2中的mounted声明周期
    onMounted(() => console.log('component mounted!'))
 
    return {
      count,
      increment
    }
  }
}
</script>
```

显而易见，Vue Composition API 使得 Vue3 的开发风格更接近于原生 JavaScript，带给开发者更多地灵活性

### 4.reactive和ref

![image-20220316213837203](https://s2.loli.net/2022/04/03/298TSq6sEyKnQIX.png)

5.setup

![image-20220316213946552](https://s2.loli.net/2022/04/03/aJAiv7qclpgNeyS.png)

## Virtual DOM

所谓的virtual dom，也就是虚拟节点。它通过JS的Object对象模拟DOM中的节点，然后再通过特定的render方法将其渲染成真实的DOM节点 dom diff 则是通过JS层面的计算，返回一个patch对象，即补丁对象，在通过特定的操作解析patch对象，完成页面的重新渲染![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/4/18/162d461714ff4e2d~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)



### 1.如何理解虚拟DOM

从本质上来说，Virtual Dom是一个JavaScript对象，通过对象的方式来表示DOM结构。将页面的状态抽象为JS对象的形式，配合不同的渲染工具，使跨平台渲染成为可能。通过事务处理机制，将多次DOM修改的结果一次性的更新到页面上，从而有效的减少页面渲染的次数，减少修改DOM的重绘重排次数，提高渲染性能。

虚拟DOM是对DOM的抽象，这个对象是更加轻量级的对 DOM的描述。它设计的最初目的，就是更好的跨平台，比如Node.js就没有DOM，如果想实现SSR，那么一个方式就是借助虚拟DOM，因为虚拟DOM本身是js对象。 在代码渲染到页面之前，vue会把代码转换成一个对象（虚拟 DOM）。以对象的形式来描述真实DOM结构，最终渲染到页面。在每次数据发生变化前，虚拟DOM都会缓存一份，变化之时，现在的虚拟DOM会与缓存的虚拟DOM进行比较。在vue内部封装了diff算法，通过这个算法来进行比较，渲染时修改改变的变化，原先没有发生改变的通过原先的数据进行渲染。

另外现代前端框架的一个基本要求就是无须手动操作DOM，一方面是因为手动操作DOM无法保证程序性能，多人协作的项目中如果review不严格，可能会有开发者写出性能较低的代码，另一方面更重要的是省略手动DOM操作可以大大提高开发效率。

>   真实DOM 结构

```html
<div class="container">
  <p>哈哈</p>
  <ul class="list">
    <li>1</li>
    <li>2</li>
  </ul>
</div>
```


```js


{ 
  // 选择器
  "sel": "div",
  // 数据
  "data": {
    "class": { "container": true }
  },
  // DOM
  "elm": undefined,
  // 和 Vue :key 一样是一种优化
  "key": undefined,
  // 子节点
  "children": [
    {
      "elm": undefined,
      "key": undefined,
      "sel": "p",
      "data": { "text": "哈哈" }
    },
    {
      "elm": undefined,
      "key": undefined,
      "sel": "ul",
      "data": {
        "class": { "list": true }
      },
      "children": [
        {
          "elm": undefined,
          "key": undefined,
          "sel": "li",
          "data": {
            "text": "1"
          },
          "children": undefined
        },
        {
          "elm": undefined,
          "key": undefined,
          "sel": "li",
          "data": {
            "text": "1"
          },
          "children": undefined
        }
      ]
    }
  ]
}


```



### 2.Diff算法

[精简版](https://juejin.cn/post/6986463124358430756)

#### 基本比较

在新老虚拟DOM对比时：

- 首先，对比节点本身，判断是否为同一节点，如果不为相同节点，则删除该节点重新创建节点进行替换
- 如果为相同节点，进行patchVnode，判断如何对该节点的子节点进行处理，先判断一方有子节点一方没有子节点的情况(如果新的children没有子节点，将旧的子节点移除)
- 比较如果都有子节点，则进行updateChildren，判断如何对这些新老节点的子节点进行操作（diff核心）。
- 匹配时，找到相同的子节点，递归比较子节点

在diff中，只对同层的子节点进行比较，放弃跨级的节点比较，使得时间复杂从O(n3)降低值O(n)，也就是说，只有当新旧children都为多个子节点时才需要用核心的Diff算法进行同层级比较。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/19/163777930be304eb~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

> Diff算法真的很美，整个流程如下图所示：

![diffvue2](https://s2.loli.net/2022/04/23/SBxVQguP9j8MyJF.png)

**一、 首先比较一下新旧节点是不是同一个节点（可通过比较sel（选择器）和key（唯一标识）值是不是相同），不是同一个节点则进行暴力删除（注：先以旧节点为基准插入新节点，然后再删除旧节点）。**

**二、 若是同一个节点则需要进一步比较**

1. 完全相同，不做处理
2. 新节点内容为文本，直接替换完事
3. 新节点有子节点，这个时候就要仔细考虑一下了:若老节点没有子元素，则直接清空老节点，将新节点的子元素插入即可；若老节点有子元素则就需要按照上述的更新策略老搞定了

我们把旧节点的一个元素称为旧前节点 旧节点的最后一个元素称为旧后节点
新节点的一个元素称为新前节点 新节点的最后一个元素称为新后节点
精细化比较主要分为五种情况

1. 旧前节点 === 新前节点
2. 旧后节点 === 新后节点
3. 新后节点 === 旧前节点
4. 新前节点 === 旧后节点
5. 以上四种情况都不满足，遍历旧节点所有子元素，寻找是否有新节点的元素

以上五种情况顺序执行。满足其中一种情况，后续的就不在比较，就会去下一个节点进行比较

#### vue2双端比较

所谓`双端比较`就是**新列表**和**旧列表**两个列表的头与尾互相对比，，在对比的过程中指针会逐渐向内靠拢，直到某一个列表的节点全部遍历过，对比停止。

我们先用四个指针指向两个列表的头尾

```js
function vue2Diff(prevChildren, nextChildren, parent) {
  let oldStartIndex = 0,
    oldEndIndex = prevChildren.length - 1
    newStartIndex = 0,
    newEndIndex = nextChildren.length - 1;
  let oldStartNode = prevChildren[oldStartIndex],
    oldEndNode = prevChildren[oldEndIndex],
    newStartNode = nextChildren[nextStartIndex],
    newEndNode = nextChildren[nextEndIndex];
}
```

我们根据四个指针找到四个节点，然后进行对比，那么如何对比呢？我们按照以下四个步骤进行对比

1.  使用**旧列表**的头一个节点`oldStartNode`与**新列表**的头一个节点`newStartNode`对比
2.  使用**旧列表**的最后一个节点`oldEndNode`与**新列表**的最后一个节点`newEndNode`对比
3.  使用**旧列表**的头一个节点`oldStartNode`与**新列表**的最后一个节点`newEndNode`对比
4.  使用**旧列表**的最后一个节点`oldEndNode`与**新列表**的头一个节点`newStartNode`对比

使用以上四步进行对比，去寻找`key`相同的可复用的节点，当在某一步中找到了则停止后面的寻找。具体对比顺序如下图

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/847306f303ab4177891b56cccff1ebd3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

对比顺序代码结构如下:

```js
function vue2Diff(prevChildren, nextChildren, parent) {
  let oldStartIndex = 0,
    oldEndIndex = prevChildren.length - 1
    newStartIndex = 0,
    newEndIndex = nextChildren.length - 1;
  let oldStartNode = prevChildren[oldStartIndex],
    oldEndNode = prevChildren[oldEndIndex],
    newStartNode = nextChildren[newStartIndex],
    newEndNode = nextChildren[newEndIndex];
  
  if (oldStartNode.key === newStartNode.key) {

  } else if (oldEndNode.key === newEndNode.key) {

  } else if (oldStartNode.key === newEndNode.key) {

  } else if (oldEndNode.key === newStartNode.key) {

  }
}
```

当对比时找到了可复用的节点，我们还是先`patch`给元素打补丁，然后将指针进行`前/后移`一位指针。

根据对比节点的不同，我们移动的**指针**和**方向**也不同，具体规则如下：

1.  当**旧列表**的头一个节点`oldStartNode`与**新列表**的头一个节点`newStartNode`对比时`key`相同。那么**旧列表**的头指针`oldStartIndex`与**新列表**的头指针`newStartIndex`同时向**后**移动一位。      **旧前比新前     后移**
2.  当**旧列表**的最后一个节点`oldEndNode`与**新列表**的最后一个节点`newEndNode`对比时`key`相同。那么**旧列表**的尾指针`oldEndIndex`与**新列表**的尾指针`newEndIndex`同时向**前**移动一位。      **旧后比新后     前移**
3.  当**旧列表**的头一个节点`oldStartNode`与**新列表**的最后一个节点`newEndNode`对比时`key`相同。那么**旧列表**的头指针`oldStartIndex`向**后**移动一位；**新列表**的尾指针`newEndIndex`向**前**移动一位。  **旧前比新后**       远离
4.  当**旧列表**的最后一个节点`oldEndNode`与**新列表**的头一个节点`newStartNode`对比时`key`相同。那么**旧列表**的尾指针`oldEndIndex`向**前**移动一位；**新列表**的头指针`newStartIndex`向**后**移动一位。    **旧后比新前**    靠近

在小节的开头，提到了要让指针向内靠拢，所以我们需要循环。循环停止的条件是当其中一个列表的节点全部遍历完成，代码如下

```js
function vue2Diff(prevChildren, nextChildren, parent) {
  let oldStartIndex = 0,
    oldEndIndex = prevChildren.length - 1,
    newStartIndex = 0,
    newEndIndex = nextChildren.length - 1;
  let oldStartNode = prevChildren[oldStartIndex],
    oldEndNode = prevChildren[oldEndIndex],
    newStartNode = nextChildren[newStartIndex],
    newEndNode = nextChildren[newEndIndex];
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (oldStartNode.key === newStartNode.key) {
      patch(oldStartNode, newStartNode, parent)

      oldStartIndex++
      newStartIndex++
      oldStartNode = prevChildren[oldStartIndex]
      newStartNode = nextChildren[newStartIndex]
    } else if (oldEndNode.key === newEndNode.key) {
      patch(oldEndNode, newEndNode, parent)

      oldEndIndex--
      newndIndex--
      oldEndNode = prevChildren[oldEndIndex]
      newEndNode = nextChildren[newEndIndex]
    } else if (oldStartNode.key === newEndNode.key) {
      patch(oldvStartNode, newEndNode, parent)

      oldStartIndex++
      newEndIndex--
      oldStartNode = prevChildren[oldStartIndex]
      newEndNode = nextChildren[newEndIndex]
    } else if (oldEndNode.key === newStartNode.key) {
      patch(oldEndNode, newStartNode, parent)

      oldEndIndex--
      newStartIndex++
      oldEndNode = prevChildren[oldEndIndex]
      newStartNode = nextChildren[newStartIndex]
    }
  }
}
```

##### 非理想情况

有一种特殊情况，当四次对比都**没找到**复用节点时，我们只能拿**新列表**的第一个节点去**旧列表**中找与其`key`相同的节点

```js
function vue2Diff(prevChildren, nextChildren, parent) {
  //...
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (oldStartNode.key === newStartNode.key) {
    //...
    } else if (oldEndNode.key === newEndNode.key) {
    //...
    } else if (oldStartNode.key === newEndNode.key) {
    //...
    } else if (oldEndNode.key === newStartNode.key) {
    //...
    } else {
      // 在旧列表中找到 和新列表头节点key 相同的节点
      let newKey = newStartNode.key,
        oldIndex = prevChildren.findIndex(child => child.key === newKey);
      
    }
  }
}
```

找节点的时候其实会有两种情况：一种在**旧列表**中找到了，另一种情况是没找到

当我们在旧列表中找到对应的`VNode`，我们只需要将找到的节点的`DOM`元素，移动到开头就可以了。这里的逻辑其实和`第四步`的逻辑是一样的，只不过`第四步`是移动的尾节点，这里是移动找到的节点。`DOM`移动后，由我们将**旧列表**中的节点改为`undefined`，这是**至关重要**的一步，因为我们已经做了节点的移动了所以我们不需要进行再次的对比了。最后我们将头指针`newStartIndex`向后移一位

如果在**旧列表**中没有找到复用节点呢？很简单，直接创建一个新的节点放到最前面就可以了，然后后**移头指针`newStartIndex`**。

最后当**旧列表**遍历到`undefind`时就跳过当前节点。

```javascript
if (newStartVNode.key === oldStartVNode.key) {
  // 第一步
} else if (newEndVNode.key === oldEndVNode.key) {
  // 第二步
} else if (newEndVNode.key === oldStartVNode.key) {
  // 第三步
} else if (newStartVNode.key = oldEndVNode.key) {
  // 第四步
} else {
	// 特殊情况
  const idxInOld = oldChildren.findIndex(node => node.key === newStartVNode.key)
  if (idxInOld > 0) {
    const vnodeToMove = oldChildren[idxInOld]
    patch(vnodeToMove, newStartVNode, container) // 补丁修改不同
    insert(vnodeToMove.el, container, oldStartVNode.el) // 移动dom到旧节点第一个前面
    oldChildren[idxInOld] = undefined // 将旧节点设置为undefined
    newStartVNode = newChildren[++newStartIdx] // 更新索引值，指向下一个节点
  }
}

```



##### 添加节点

此时`oldEndIndex`以及小于了`oldStartIndex`，但是**新列表**中还有剩余的节点，我们只需要将剩余的节点依次插入到`oldStartNode`的`DOM`之前就可以了。为什么是插入`oldStartNode`之前呢？原因是剩余的节点在**新列表**的位置是位于`oldStartNode`之前的，如果剩余节点是在`oldStartNode`之后，`oldStartNode`就会先行对比，这个需要思考一下，其实还是与`第四步`的思路一样。

##### 移除节点

与上一小节的情况相反，当**新列表**的`newEndIndex`小于`newStartIndex`时，我们将**旧列表**剩余的节点删除即可。这里我们需要注意，**旧列表**的`undefind`。在第二小节中我们提到过，当头尾节点都不相同时，我们会去**旧列表**中找**新列表**的第一个节点，移动完DOM节点后，将**旧列表**的那个节点改为`undefind`。所以我们在最后的删除时，需要注意这些`undefind`，遇到的话跳过当前循环即可。

#### vue3 最长递增子序列

其实就简单的看一眼我们就能发现，这两段文字是有一部分是相同的，**这些文字是不需要修改也不需要移动的**，真正需要进行修改中间的几个字母，所以`diff`就变成以下部分

```
text1: 'llo'
text2: 'y'
```

接下来换成`vnode`，我们以下图为例。

![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90a27b4fa05b434889d99ae6fe832b4d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

图中的被绿色框起来的节点，他们是不需要移动的，只需要进行打补丁`patch`就可以了。我们把该逻辑写成代码。

```js
function vue3Diff(prevChildren, nextChildren, parent) {
  let j = 0,
    prevEnd = prevChildren.length - 1,
    nextEnd = nextChildren.length - 1,
    prevNode = prevChildren[j],
    nextNode = nextChildren[j];
  while (prevNode.key === nextNode.key) {
    patch(prevNode, nextNode, parent)
    j++
    prevNode = prevChildren[j]
    nextNode = nextChildren[j]
  }
  
  prevNode = prevChildren[prevEnd]
  nextNode = prevChildren[nextEnd]
  
  while (prevNode.key === nextNode.key) {
    patch(prevNode, nextNode, parent)
    prevEnd--
    nextEnd--
    prevNode = prevChildren[prevEnd]
    nextNode = prevChildren[nextEnd]
  }
}

```

这时候，我们就需要考虑边界情况了，这里有两种情况。一种是`j > prevEnd`；另一种是`j > nextEnd`。

![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52779ed5f26a451d8098e945709132cf~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

我们以这张图为例，此时`j > prevEnd`且`j <= nextEnd`，我们只需要把**新列表**中`j`到`nextEnd`之间剩下的节点**插入**进去就可以了。相反， 如果`j > nextEnd`时，我们把**旧列表**中`j`到`prevEnd`之间的节点**删除**就可以了。

```js
function vue3Diff(prevChildren, nextChildren, parent) {
  // ...
  if (j > prevEnd && j <= nextEnd) {
    let nextpos = nextEnd + 1,
      refNode = nextpos >= nextChildren.length
                ? null
                : nextChildren[nextpos].el;
    while(j <= nextEnd) mount(nextChildren[j++], parent, refNode)
    
  } else if (j > nextEnd && j <= prevEnd) {
    while(j <= prevEnd) parent.removeChild(prevChildren[j++].el)
  }
}

```

我们再继续思考，在我们`while`循环时，指针是从两端向内逐渐靠拢的，所以我们应该在循环中就应该去判断边界情况，我们使用`label`语法，当我们触发边界情况时，退出全部的循环，直接进入判断。代码如下：

```js
function vue3Diff(prevChildren, nextChildren, parent) {
  let j = 0,
    prevEnd = prevChildren.length - 1,
    nextEnd = nextChildren.length - 1,
    prevNode = prevChildren[j],
    nextNode = nextChildren[j];
  // label语法
  outer: {
    while (prevNode.key === nextNode.key) {
      patch(prevNode, nextNode, parent)
      j++
      // 循环中如果触发边界情况，直接break，执行outer之后的判断
      if (j > prevEnd || j > nextEnd) break outer
      prevNode = prevChildren[j]
      nextNode = nextChildren[j]
    }

    prevNode = prevChildren[prevEnd]
    nextNode = prevChildren[nextEnd]

    while (prevNode.key === nextNode.key) {
      patch(prevNode, nextNode, parent)
      prevEnd--
      nextEnd--
      // 循环中如果触发边界情况，直接break，执行outer之后的判断
      if (j > prevEnd || j > nextEnd) break outer
      prevNode = prevChildren[prevEnd]
      nextNode = prevChildren[nextEnd]
    }
  }
  
  // 边界情况的判断
  if (j > prevEnd && j <= nextEnd) {
    let nextpos = nextEnd + 1,
      refNode = nextpos >= nextChildren.length
                ? null
                : nextChildren[nextpos].el;
    while(j <= nextEnd) mount(nextChildren[j++], parent, refNode)
    
  } else if (j > nextEnd && j <= prevEnd) {
    while(j <= prevEnd) parent.removeChild(prevChildren[j++].el)
  }
}

```

#### 判断是否需要移动

其实几个算法看下来，套路已经很明显了，就是找到移动的节点，然后给他移动到正确的位置。把该加的新节点添加好，把该删的旧节点删了，整个算法就结束了。这个算法也不例外，我们接下来看一下它是如何做的。

当`前/后置`的预处理结束后，我们进入真正的`diff`环节。首先，我们先根据**新列表**剩余的节点数量，创建一个`source`数组，并将数组填满`-1`。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75944ec3b6a245989a0eaf7e474ef174~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

我们先写这块逻辑。

```js
function vue3Diff(prevChildren, nextChildren, parent) {
  //...
  outer: {
  // ...
  }
  
  // 边界情况的判断
  if (j > prevEnd && j <= nextEnd) {
    // ...
  } else if (j > nextEnd && j <= prevEnd) {
    // ...
  } else {
    let prevStart = j,
      nextStart = j,
      nextLeft = nextEnd - nextStart + 1,     // 新列表中剩余的节点长度
      source = new Array(nextLeft).fill(-1);  // 创建数组，填满-1
     
  }
}
```

那么这个`source`数组，是要做什么的呢？他就是来做新旧节点的对应关系的，我们将**新节点**在**旧列表**的位置存储在该数组中，我们在根据`source`计算出它的`最长递增子序列`用于移动DOM节点。为此，我们先建立一个对象存储当前**新列表**中的`节点`与`index`的关系，再去**旧列表**中去找位置。

在找节点时要注意，**如果旧节点在新列表中没有的话，直接删除就好**。除此之外，我们还需要一个数量表示记录我们已经`patch`过的节点，如果数量已经与**新列表**剩余的节点数量一样，那么剩下的`旧节点`我们就直接删除了就可以了

```js
function vue3Diff(prevChildren, nextChildren, parent) {
  //...
  outer: {
  // ...
  }
  
  // 边界情况的判断
  if (j > prevEnd && j <= nextEnd) {
    // ...
  } else if (j > nextEnd && j <= prevEnd) {
    // ...
  } else {
    let prevStart = j,
      nextStart = j,
      nextLeft = nextEnd - nextStart + 1,     // 新列表中剩余的节点长度
      source = new Array(nextLeft).fill(-1),  // 创建数组，填满-1
      nextIndexMap = {},                      // 新列表节点与index的映射
      patched = 0;                            // 已更新过的节点的数量
      
    // 保存映射关系  
    for (let i = nextStart; i <= nextEnd; i++) {
      let key = nextChildren[i].key
      nextIndexMap[key] = i
    } 
    
    // 去旧列表找位置
    for (let i = prevStart; i <= prevEnd; i++) {
      let prevNode = prevChildren[i],
      	prevKey = prevNode.key,
        nextIndex = nextIndexMap[prevKey];
      // 新列表中没有该节点 或者 已经更新了全部的新节点，直接删除旧节点
      if (nextIndex === undefind || patched >= nextLeft) {
        parent.removeChild(prevNode.el)
        continue
      }
      // 找到对应的节点
      let nextNode = nextChildren[nextIndex];
      patch(prevNode, nextNode, parent);
      // 给source赋值
      source[nextIndex - nextStart] = i
      patched++
    }
  }
}
```

![img](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01f5d145e4a84e3f922b4d39f80bcb6a~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

找到位置后，我们观察这个重新赋值后的`source`，我们可以看出，如果是全新的节点的话，其在`source`数组中对应的值就是初始的`-1`，通过这一步我们可以区分出来哪个为全新的节点，哪个是可复用的。

其次，我们要判断是否需要移动。那么如何判断移动呢？很简单，和`React`一样我们用递增法，如果我们找到的`index`是一直递增的，说明不需要移动任何节点。我们通过设置一个变量来保存是否需要移动的状态。

```js
function vue3Diff(prevChildren, nextChildren, parent) {
  //...
  outer: {
  // ...
  }
  
  // 边界情况的判断
  if (j > prevEnd && j <= nextEnd) {
    // ...
  } else if (j > nextEnd && j <= prevEnd) {
    // ...
  } else {
    let prevStart = j,
      nextStart = j,
      nextLeft = nextEnd - nextStart + 1,     // 新列表中剩余的节点长度
      source = new Array(nextLeft).fill(-1),  // 创建数组，填满-1
      nextIndexMap = {},                      // 新列表节点与index的映射
      patched = 0,
      move = false,                           // 是否移动
      lastIndex = 0;                          // 记录上一次的位置
      
    // 保存映射关系  
    for (let i = nextStart; i <= nextEnd; i++) {
      let key = nextChildren[i].key
      nextIndexMap[key] = i
    } 
    
    // 去旧列表找位置
    for (let i = prevStart; i <= prevEnd; i++) {
      let prevNode = prevChildren[i],
      	prevKey = prevNode.key,
        nextIndex = nextIndexMap[prevKey];
      // 新列表中没有该节点 或者 已经更新了全部的新节点，直接删除旧节点
      if (nextIndex === undefind || patched >= nextLeft) {
        parent.removeChild(prevNode.el)
        continue
      }
      // 找到对应的节点
      let nextNode = nextChildren[nextIndex];
      patch(prevNode, nextNode, parent);
      // 给source赋值
      source[nextIndex - nextStart] = i
      patched++
      
      // 递增方法，判断是否需要移动
      if (nextIndex < lastIndex) {
      	move = false
      } else {
      	lastIndex = nextIndex
      }
    }
    
    if (move) {
    
    // 需要移动
    } else {
	
    //不需要移动
    }
  }
}

```

然而在`vue3.0`中，我们需要的是最长递增子序列在原本数组中的索引。所以我们还需要在创建一个数组用于保存每个值的最长子序列所对应在数组中的`index`

在 vue2 中是通过对旧节点列表建立一个 `{ key, oldVnode }`的映射表，然后遍历新节点列表的剩余节点，根据`newVnode.key`在旧映射表中寻找可复用的节点，然后打补丁并且移动到正确的位置。

而在 vue3 中是**建立一个存储新节点数组中的剩余节点在旧节点数组上的索引的映射关系数组**，建立完成这个数组后也即找到了**可复用的节点**，然后通过这个**数组计算得到最长递增子序列**，这个序列中的节点保持不动，然后将**新节点数组中的剩余节点移动到正确的位置**。

### 3. DOM如何移动

判断完是否需要移动后，我们就需要考虑如何移动了。一旦需要进行DOM移动，我们首先要做的就是找到`source`的**最长递增子序列**。

### 3.虚拟DOM怎么解析

虚拟DOM的解析过程：

- 首先对将要插入到文档中的 DOM 树结构进行分析，使用 js 对象将其表示出来，比如一个元素对象，包含 TagName、props 和 Children 这些属性。然后将这个 js 对象树给保存下来，最后再将 DOM 片段插入到文档中。
- 当页面的状态发生改变，需要对页面的 DOM 的结构进行调整的时候，首先根据变更的状态，重新构建起一棵对象树，然后将这棵新的对象树和旧的对象树进行比较，记录下两棵树的的差异。
- 最后将记录的有差异的地方应用到真正的 DOM 树中去，这样视图就更新了。

### 4.虚拟DOM性能真的好吗

- MVVM框架解决视图和状态同步问题

- 模板引擎可以简化视图操作,没办法跟踪状态

- 虚拟DOM跟踪状态变化

- 参考github上

  virtual-dom

  的动机描述

  - 虚拟DOM可以维护程序的状态,跟踪上一次的状态
  - 通过比较前后两次状态差异更新真实DOM

- 跨平台使用

  - 浏览器平台渲染DOM
  - 服务端渲染SSR(Nuxt.js/Next.js),前端是vue向,后者是react向
  - 原生应用(Weex/React Native)
  - 小程序(mpvue/uni-app)等

- 真实DOM的属性很多，创建DOM节点开销很大

- 虚拟DOM只是普通JavaScript对象，描述属性并不需要很多，创建开销很小

- **复杂视图情况下提升渲染性能**(操作dom性能消耗大,减少操作dom的范围可以提升性能)

- **复杂视图情况下提升渲染性能**,因为`虚拟DOM+Diff算法`可以精准找到DOM树变更的地方,减少DOM的操作(重排重绘)

**（1）保证性能下限，在不进行手动优化的情况下，提供过得去的性能** 看一下页面渲染的流程：**解析HTML -> 生成DOM -> 生成 CSSOM -> Layout -> Paint -> Compiler** 下面对比一下修改DOM时真实DOM操作和Virtual DOM的过程，来看一下它们重排重绘的性能消耗∶

- 真实DOM∶ 生成HTML字符串＋重建所有的DOM元素
- 虚拟DOM∶ 生成vNode+ DOMDiff＋必要的dom更新

Virtual DOM的更新DOM的准备工作耗费更多的时间，也就是JS层面，相比于更多的DOM操作它的消费是极其便宜的。尤雨溪在社区论坛中说道∶ 框架给你的保证是，你不需要手动优化的情况下，依然可以给你提供过得去的性能。 **（2）跨平台** Virtual DOM本质上是JavaScript的对象，它可以很方便的跨平台操作，比如服务端渲染、uniapp等。

- 首次渲染大量DOM时，由于多了一层虚拟DOM的计算，会比innerHTML插入慢。
- 正如它能保证性能下限，在真实DOM操作的时候进行针对性的优化时，还是更快的。

### 5.Vue key的作用是什么，为什么不建议index做key

vue 中 key 值的作用可以分为两种情况来考虑：

- 第一种情况是 v-if 中使用 key。由于 Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。因此当使用 v-if 来实现元素切换的时候，如果切换前后含有相同类型的元素，那么这个元素就会被复用。如果是相同的 input 元素，那么切换前后用户的输入不会被清除掉，这样是不符合需求的。因此可以通过使用 key 来唯一的标识一个元素，这个情况下，使用 key 的元素不会被复用。这个时候 key 的作用是用来标识一个独立的元素。
- 第二种情况是 v-for 中使用 key。用 v-for 更新已渲染过的元素列表时，它默认使用“就地复用”的策略。如果数据项的顺序发生了改变，Vue 不会移动 DOM 元素来匹配数据项的顺序，而是简单复用此处的每个元素。因此通过为每个列表项提供一个 key 值，来以便 Vue 跟踪元素的身份，从而高效的实现复用。这个时候 key 的作用是为了高效的更新渲染虚拟 DOM。

key 是为 Vue 中 vnode 的唯一标记，通过这个 key，diff 操作可以更准确、更快速

- 更准确：因为带 key 就不是就地复用了，在 sameNode 函数a.key === b.key对比中可以避免就地复用的情况。所以会更加准确。
- 更快速：利用 key 的唯一性生成 map 对象来获取对应节点，比遍历方式更快

使用index 作为 key和没写基本上没区别，因为不管数组的顺序怎么颠倒，index 都是 0, 1, 2...这样排列，导致 Vue 会复用错误的旧子节点，做很多额外的工作。



## vue源码分析

 [深入理解Vue完整版和runtime版](https://juejin.cn/post/6844904029877698568)

[一步一步实现一个VUe](https://www.cnblogs.com/kidney/p/8018226.html)

核心功能：响应式的数据绑定、虚拟 DOM、diff 算法、patch 方法（用于更新真实 DOM）

**当 new Vue() 的时候发生了什么？**

我们的实现会参考源码的套路，但会大量的简化其中的细节。为了理解源码的结构，最好的突破口就是了解程序的起点 new Vue() 的背后究竟发生了什么。

简单梳理下源码的执行流：

=> 初始化生命周期

=> 初始化事件系统

=> 初始化state，依次处理 props、data、computed …

=> 开始渲染 _mount() => _render() 返回 vdom=> _update() => __patch__() 更新真实DOM

更详细的说明可以参考[这篇文章](https://github.com/DDFE/DDFE-blog/issues/17)，我们只会实现其中最核心的部分

**第一步：将虚拟 DOM 树渲染到真实的 DOM**

每一个 DOM 节点都是一个 node 对象，这个对象含有大量的属性与方法，虚拟 DOM 其实就是超轻量版的 node 对象。

![img](https://images2017.cnblogs.com/blog/925891/201712/925891-20171210204107208-1422789571.png)

 

我们要生成的 DOM 树看上去是这样的：

![img](https://images2017.cnblogs.com/blog/925891/201712/925891-20171210204251833-1151977100.png)

关于 data 参数的属性，请参考[官方文档](https://cn.vuejs.org/v2/guide/render-function.html#深入-data-对象)

随后我们会通过 createElm 方法和 createChildren 方法的相互调用，遍历整棵虚拟节点树，生成真实的 DOM 节点树，最后替换到挂载点。

[完整代码](https://github.com/bison1994/vue-for-learning/blob/master/stage-1/vue-0.1.js)

 

**第二步：修改数据，执行 diff 算法，并将变化的部分 patch 到真实 DOM**

![img](https://images2017.cnblogs.com/blog/925891/201712/925891-20171210224300083-1995638876.png)

diff 算法的逻辑比较复杂，可以单独摘出来研究，由于我们的目的是理解框架的核心逻辑，因此代码实现里只考虑了最简单的情形。

[完整代码](https://github.com/bison1994/vue-for-learning/blob/master/stage-3/vue-0.3.js)

 

**第三步：对数据做响应式处理，当数据变化时，自动执行更新方法**

![img](https://images2017.cnblogs.com/blog/925891/201712/925891-20171210224314927-1241933347.jpg)

data 中的每一个属性都会被处理为存取器属性，同时每一个属性都会在闭包中维护一个属于自己的 dep 对象，用于存放该属性的依赖项。当属性被赋予新的值时，就会触发 set 方法，并通知所有依赖项进行更新。

[完整代码](https://github.com/bison1994/vue-for-learning/blob/master/stage-4/vue-0.4.js)

### 初始化、更新流程分析

[vue更新流程](https://segmentfault.com/a/1190000041560503)

```js
<div id="demo">
    <child :list="list"></child>
    <button @click="handleAdd">add</button>
</div>
<script>
    Vue.component('child', {
        props: {
            list: {
                type: Array,
                default: () => []
            }
        },
        template: '<p>{{ list }}</p>'
    })

    new Vue({
        el: "#demo",
        data() {
          return {
              list: [1,2]
          }
        },
        methods: {
            handleAdd() {
                this.list.push(Math.random())
            }
        }
    })
</script>
```

很简单的例子，一个父组件一个子组件，子组件接受一个list，父组件有个按钮，可以往list里push数据改变list

#### 初始化流程：

1.  首先从 `new Vue({el: "#app"})` 开始，会执行 `_init` 方法。

    ```javascript
    function Vue (options) {
       // 省略...
       this._init(options)
    }
    ```

2.  `_init` 方法的最后执行了 `vm.$mount` 挂载实例。

    ```javascript
    Vue.prototype._init = function (options) {
       var vm = this;
       // 省略...
       if (vm.$options.el) {
           vm.$mount(vm.$options.el);
       }
    }
    ```

3.  如果此时运行的版本是 `runtime with compiler` 版本，这个版本的 `$mount` 会被进行重写，增加了把template模板转成render渲染函数的操作，但最终都会走到 `mountComponent` 方法。

    ```javascript
    Vue.prototype.$mount = function (el, hydrating) {
         el = el && inBrowser ? query(el) : undefined;
         return mountComponent(this,el,hydrating);
    };
    
    var mount = Vue.prototype.$mount; //缓存上一次的Vue.prototype.$mount
    
    Vue.prototype.$mount = function (el, hydrating) { //重写Vue.prototype.$mount
         // 省略，将template转化为render渲染函数
         return mount.call(
           this,
           el,
           hydrating
         )
    };
    ```

4.  `mountComponent` 里触发了 `beforeMount` 和 `mounted` 生命周期，更重要的是创建了 `Watcher`，传入的 `updateComponent` 就是Watcher的 `getter`。

    ```javascript
    function mountComponent(vm, el, hydrating) {
         // 执行生命周期函数 beforeMount
         callHook(vm, 'beforeMount');
    
         var updateComponent;
         //如果开发环境
         if ("development" !== 'production' && config.performance && mark) {
                // 省略...
         } else {
             updateComponent = function () {
                 vm._update(
                     vm._render(), // 先执行_render,返回vnode
                     hydrating
                 );
             };
         }
    
         new Watcher(
             vm,
             updateComponent,
             noop,
             null,
             true // 是否渲染过得观察者
         );
        
         if (vm.$vnode == null) {
             vm._isMounted = true;
             // 执行生命周期函数mounted
             callHook(vm, 'mounted');
         }
         return vm
     }
    ```

5.  在创建 `Watcher` 时会触发 `get()` 方法，`pushTarget(this)` 将 `Dep.target` 设置为当前 Watcher 实例。

    ```javascript
    function Watcher(vm, expOrFn, cb, options, isRenderWatcher) {
       if (typeof expOrFn === 'function') {
           this.getter = expOrFn;
       }
       this.value = this.lazy ?  // 这个有是组件才为真
           undefined :
           this.get(); //计算getter，并重新收集依赖项。 获取值
    };
    
     Watcher.prototype.get = function get() {
         pushTarget(this);
         var value;
         var vm = this.vm;
         try {
             value = this.getter.call(vm, vm);
         } catch (e) {
    
         } finally {
             popTarget();
         }
         return value
     };
    ```

6.  `Watcher` 的 `get()` 里会去读取数据，触发 `initData` 时使用 `Object.defineProperty` 为数据设置的 `get`，在这里进行依赖收集。我们知道Vue中每个响应式属性都有一个 `__ob__` 属性，存放的是一个Observe实例，这里的 `childOb` 就是这个 `__ob__`，通过 `childOb.dep.depend()` 往这个属性的`__ob__`中的dep里收集依赖，如下图。
    ![WX20220315-161349@2x.png](https://segmentfault.com/img/bVcYvAZ)

    ```javascript
    export function defineReactive (
      obj: Object,
      key: string,
      val: any,
      customSetter?: Function
    ) {
      /*在闭包中定义一个dep对象*/
      const dep = new Dep()
    
      let childOb = observe(val)
      Object.defineProperty(obj, key, {
       enumerable: true,
       configurable: true,
       get: function reactiveGetter () {
         /*如果原本对象拥有getter方法则执行*/
         const value = getter ? getter.call(obj) : val
         if (Dep.target) {
           /*进行依赖收集*/
           dep.depend()
           if (childOb) {
             childOb.dep.depend()
           }
           if (Array.isArray(value)) {
             dependArray(value)
           }
         }
         return value
       },
       set: function reactiveSetter (newVal) {
       }
      })
    }
    ```

7.  在我们的例子中，这个list会收集两次依赖，所以它 `__ob__` 的subs里会有 `两个Watcher`，第一次是在父组件 `data` 中的 list，第二次是在创建组件时调用 `createComponent` ，然后又会走到 `_init` => `initState` => `initProps` ，在 `initProps` 内对 `props` 传入的属性进行依赖收集。有两个Watcher就说明list改变时要通知两个地方，这很好理解。
    .

8.  最后，触发 `getter`，上面说过 `getter` 就是 `updateComponent`，里面执行 `_update` 更新视图。

#### 下面来说说更新的流程：

1.  点击按钮往数组中添加一个数字，在Vue中，为了监听数组变化，对数组的常用方法做了重写，所以先会走到 `ob.dep.notify()` 这里，`ob` 就是 list 的 `__ob__` 属性，上面保存着Observe实例，里面的dep中有两个 `Watcher`，调用 `notify` 去通知所有Watcher对象更新视图。

    ```javascript
    [
      'push',
      'pop',
      'shift',
      'unshift',
      'splice',
      'sort',
      'reverse'
    ]
    .forEach(function (method) {
     const original = arrayProto[method]
     def(arrayMethods, method, function mutator () {
       let i = arguments.length
       const args = new Array(i)
       while (i--) {
         args[i] = arguments[i]
       }
       /*调用原生的数组方法*/
       const result = original.apply(this, args)
    
       const ob = this.__ob__
       let inserted
       switch (method) {
         case 'push':
           inserted = args
           break
         case 'unshift':
           inserted = args
           break
         case 'splice':
           inserted = args.slice(2)
           break
       }
       if (inserted) ob.observeArray(inserted)
    
       /*dep通知所有注册的观察者进行响应式处理*/
       ob.dep.notify()
       return result
     })
    })
    ```

2.  `notify` 方法里去通知所有 `Watcher` 更新，执行 `Watcher` 的 `update` 方法，`update` 里的 `queueWatcher` 过滤了一些重复的 `Watcher`, 但最终会走到 `Watcher` 的 `run()` 方法。

    ```javascript
    Dep.prototype.notify = function notify() {
       var subs = this.subs.slice();
       for (var i = 0, l = subs.length; i < l; i++) {
           subs[i].update();
       }
    };
    
    Watcher.prototype.update = function update() {
     if (this.lazy) {
         this.dirty = true;
    
     } else if (this.sync) {
         this.run();
     } else {
         queueWatcher(this);
     }
    };
    ```

3.  `run` 方法里会调用 `get()`, `get` 方法里回去触发Watcher的 `getter`，上面说过，`getter` 就是 `updateComponent`。

    ```javascript
    Watcher.prototype.run = function run() {
      if (this.active) {
     /* get操作在获取value本身也会执行getter从而调用update更新视图 */
     const value = this.get()
      }
    }
    
    updateComponent = function () {
      vm._update(
          vm._render(),
          hydrating
      );
     };
    ```

4.  最后在 `_update` 方法中，进行 `patch` 操作
