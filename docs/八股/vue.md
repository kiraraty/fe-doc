# Vue面试题

## 基本原理

### 1.什么是MVVM,MVC？

**（1）MVC**

MVC 通过分离 Model、View 和 Controller 的方式来组织代码结构。其中 View 负责页面的显示逻辑，Model 负责存储页面的业务数据，以及对相应数据的操作。并且 View 和 Model 应用了观察者模式，当 Model 层发生改变的时候它会通知有关 View 层更新页面。Controller 层是 View 层和 Model 层的纽带，它主要负责用户与应用的响应操作，当用户与页面产生交互的时候，Controller 中的事件触发器就开始工作了，通过调用 Model 层，来完成对 Model 的修改，然后 Model 层再去通知 View 层更新。

 ![image.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202258494.webp)

（2）MVVM

MVVM 分为 Model、View、ViewModel：

- Model代表数据模型，数据和业务逻辑都在Model层中定义；
- View代表UI视图，负责数据的展示；
- ViewModel负责监听Model中数据的改变并且控制视图的更新，处理用户交互操作；

Model和View并无直接关联，而是通过ViewModel来进行联系的，Model和ViewModel之间有着双向数据绑定的联系。因此当Model中的数据改变时会触发View层的刷新，View中由于用户交互操作而改变的数据也会在Model中同步。

这种模式实现了 Model和View的数据自动同步，因此开发者只需要专注于数据的维护操作即可，而不需要自己操作DOM。 ![image.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202258529.webp)



### 2.vue的响应式原理

![4.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202258995.webp)

当一个Vue实例创建时，Vue会遍历data中的属性，用 Object.defineProperty（vue3.0使用proxy ）将它们转为 getter/setter，并且在内部追踪相关依赖，在属性被访问和修改时通知变化。 每个组件实例都有相应的 watcher 程序实例，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的setter被调用时，会通知watcher重新计算，从而致使它关联的组件得以更新。 

Vue.js 是采用**数据劫持**结合**发布者-订阅者模式**的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。主要分为以下几个步骤：

1. 需要observe的数据对象进行递归遍历，包括子属性对象的属性，都加上setter和getter这样的话，给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化
2. compile解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图
3. Watcher订阅者是Observer和Compile之间通信的桥梁，主要做的事情是: ①在自身实例化时往属性订阅器(dep)里面添加自己 ②自身必须有一个update()方法 ③待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。
4. MVVM作为数据绑定的入口，整合Observer、Compile和Watcher三者，通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer和Compile之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据model变更的双向绑定效果。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202259163.webp)

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202259845.webp)



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

- 1.我们如何知道哪里用了data里面的数据？
- 2.数据变更了，如何通知render更新视图？

在视图渲染过程中，被使用的数据需要被记录下来，并且只针对这些数据的变化触发视图更新

这就需要做依赖收集，需要为属性创建 dep 用来收集渲染 watcher

我们可以来看下官方介绍图，这里的`collect as Dependency`就是源码中的`dep.depend()`依赖收集，`Notify`就是源码中的`dep.notify()`通知订阅者

![响应式原理.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202259404.webp)

##### 依赖收集中的各个类

Vue源码中负责依赖收集的类有三个：

- Observer：`可观测类`，将数组/对象转成可观测数据，每个`Observer`的实例成员中都有一个`Dep`的实例（上一篇文章实现过这个类）
- Dep：`观察目标类`，每一个数据都会有一个`Dep`类实例，它内部有个subs队列，subs就是subscribers的意思，保存着依赖本数据的`观察者`，当本数据变更时，调用`dep.notify()`通知观察者
- Watcher：`观察者类`，进行`观察者函数`的包装处理。如`render()`函数，会被进行包装成一个`Watcher`实例

依赖就是`Watcher`,只有`Watcher`触发的`getter`才会收集依赖，哪个`Watcher`触发了`getter`，就把哪个`watcher`收集到`Dep`中。Dep使用发布订阅模式，当数据发生变化时，会循环依赖列表，把所有的`watcher`都通知一遍，这里我自己画了一张更清晰的图：

![vue响应式原理.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202259194.webp)

##### Observer类

这个类我们上一期已经实现过了，这一期我们主要增加的是`defineReactive`在劫持数据`gētter`时进行依赖收集，劫持数据`setter`时进行通知依赖更新，这里就是Vue收集依赖的入口

```js
class Observer {
     constructor(v){
         // 每一个Observer实例身上都有一个Dep实例
         this.dep = new Dep()
        // 如果数据层次过多，需要递归去解析对象中的属性，依次增加set和get方法
        def(v,'__ob__',this)  //给数据挂上__ob__属性，表明已观测
        if(Array.isArray(v)) {
            // 把重写的数组方法重新挂在数组原型上
            v.__proto__ = arrayMethods
            // 如果数组里放的是对象，再进行监测
            this.observerArray(v)
        }else{
            // 非数组就直接调用defineReactive将数据定义成响应式对象
            this.walk(v)
        }
        
     }
     observerArray(value) {
         for(let i=0; i<value.length;i++) {
             observe(value[i])
         }
     }
     walk(data) {
         let keys = Object.keys(data); //获取对象key
         keys.forEach(key => {
            defineReactive(data,key,data[key]) // 定义响应式对象
         })
     }
 }

 function  defineReactive(data,key,value){
     const dep = new Dep() //实例化dep,用于收集依赖，通知订阅者更新
     observe(value) // 递归实现深度监测，注意性能
     Object.defineProperty(data,key,{
         configurable:true,
         enumerable:true,
         get(){
             //获取值
             // 如果现在处于依赖的手机阶段
             if(Dep.target) {
                 dep.depend()
             }
            //  依赖收集
            return value
         },
         set(newV) {
             //设置值
            if(newV === value) return
            observe(newV) //继续劫持newV,用户有可能设置的新值还是一个对象
            value = newV
            console.log('值变化了:',value)
            // 发布订阅模式，通知
            dep.notify()
            // cb() //订阅者收到消息回调
         }
     })
 }
```

将`Observer`类的实例挂在`__ob__`属性上，提供后期数据观察时使用，实例化`Dep`类实例，并且将`对象/数组`作为value属性保存下来 - 如果value是个对象，就执行`walk()`过程，遍历对象把每一项数据都变为可观测数据（调用`defineReactive`方法处理） - 如果value是个数组，就执行`observeArray()`过程，递归地对数组元素调用`observe()`。

##### Dep类（订阅者）

`Dep`类的角色是一个`订阅者`，它主要作用是用来存放`Watcher`观察者对象，每一个数据都有一个`Dep`类实例，在一个项目中会有多个观察者，但由于JavaScript是单线程的，所以在同一时刻，只能有一个`观察者`在执行，此刻正在执行的那个`观察者`所对应的`Watcher`实例就会赋值给`Dep.target`这个变量，从而只要访问`Dep.target`就能知道当前的观察者是谁。

```js
var uid = 0
export default class Dep {
    constructor() {
        this.id = uid++
        this.subs = [] // subscribes订阅者，存储订阅者，这里放的是Watcher的实例
    }

    //收集观察者
    addSub(watcher) {
        this.subs.push(watcher)
    }
    // 添加依赖
    depend() {
        // 自己指定的全局位置，全局唯一
      //自己指定的全局位置，全局唯一,实例化Watcher时会赋值Dep.target = Watcher实例
        if(Dep.target) {
            this.addSub(Dep.target)
        }
    }
    //通知观察者去更新
    notify() {
        console.log('通知观察者更新～')
        const subs = this.subs.slice() // 复制一份
        subs.forEach(w=>w.update())
    }
}
```

`Dep`实际上就是对`Watcher`的管理，`Dep`脱离`Watcher`单独存在是没有意义的。

- `Dep`是一个发布者，可以订阅多个观察者，依赖收集之后`Dep`中会有一个`subs`存放一个或多个观察者，在数据变更的时候通知所有的`watcher`。
- `Dep`和`Observer`的关系就是`Observer`监听整个data，遍历data的每个属性给每个属性绑定`defineReactive`方法劫持`getter`和`setter`, 在`getter`的时候往`Dep`类里塞依赖`（dep.depend）`，在`setter`的时候通知所有`watcher`进行`update(dep.notify)`。

##### Watcher类（观察者）

`Watcher`类的角色是`观察者`，它关心的是数据，在数据变更之后获得通知，通过回调函数进行更新。

由上面的`Dep`可知，`Watcher`需要实现以下两个功能：

- `dep.depend()`的时候往subs里面添加自己
- `dep.notify()`的时候调用`watcher.update()`，进行更新视图

**同时要注意的是，watcher有三种：render watcher、 computed watcher、user watcher(就是vue方法中的那个watch)**

```js
var uid = 0
import {parsePath} from "../util/index"
import Dep from "./dep"
export default class Watcher{
    constructor(vm,expr,cb,options){
        this.vm = vm // 组件实例
        this.expr = expr // 需要观察的表达式
        this.cb = cb // 当被观察的表达式发生变化时的回调函数
        this.id = uid++ // 观察者实例对象的唯一标识
        this.options = options // 观察者选项
        this.getter = parsePath(expr)
        this.value = this.get()
    }

    get(){
        // 依赖收集,把全局的Dep.target设置为Watcher本身
        Dep.target = this
        const obj = this.vm
        let val
        // 只要能找就一直找
        try{
            val = this.getter(obj)
        } finally{
            // 依赖收集完需要将Dep.target设为null，防止后面重复添加依赖。
            Dep.target = null
        }
        return val
        
    }
    // 当依赖发生变化时，触发更新
    update() {
        this.run()
    }
    run() {
        this.getAndInvoke(this.cb)
    }
    getAndInvoke(cb) {
        let val = this.get()

        if(val !== this.value || typeof val == 'object') {
            const oldVal = this.value
            this.value = val
            cb.call(this.target,val, oldVal)
        }
    }
}
```

要注意的是，`watcher`中有个`sync`属性，绝大多数情况下，`watcher`并不是同步更新的，而是采用异步更新的方式，也就是调用`queueWatcher(this)`推送到观察者队列当中，待`nextTick`的时候进行调用。

这里的`parsePath`函数比较有意思，它是一个高阶函数，用于把表达式解析成getter，也就是取值，我们可以试着写写看：

```js
export function parsePath (str) {
   const segments = str.split('.') // 先将表达式以.切割成一个数据
  // 它会返回一个函数
  	return obj = > {
      for(let i=0; i< segments.length; i++) {
        if(!obj) return
        // 遍历表达式取出最终值
        obj = obj[segments[i]]
      }
      return obj
    }
}
```

##### Dep与Watcher的关系

watcher 中实例化了 dep 并向 dep.subs 中添加了订阅者, dep 通过 notify 遍历了 dep.subs 通知每个 watcher 更新。

##### 总结

###### 依赖收集

1. `initState `时,对` computed` 属性初始化时,触发 `computed watcher` 依赖收集
2. `initState` 时,对侦听属性初始化时,触发 `user watcher` 依赖收集(这里就是我们常写的那个watch)
3. `render()`时,触发 `render watcher` 依赖收集
4. `re-render` 时,`render()`再次执行,会移除所有 `subs` 中的 `watcer` 的订阅,重新赋值。

```js
observe->walk->defineReactive->get->dep.depend()->
watcher.addDep(new Dep()) -> 
watcher.newDeps.push(dep) -> 
dep.addSub(new Watcher()) -> 
dep.subs.push(watcher)
```

###### 派发更新

1. 组件中对响应的数据进行了修改,触发`defineReactive`中的 `setter` 的逻辑
2. 然后调用 `dep.notify()`
3. 最后遍历所有的 `subs（Watcher 实例）`,调用每一个 `watcher` 的 `update` 方法。

```js
set -> 
dep.notify() -> 
subs[i].update() -> 
watcher.run() || queueWatcher(this) -> 
watcher.get() || watcher.cb -> 
watcher.getter() -> 
vm._update() -> 
vm.__patch__()
```

###### 实现视图驱动数据

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



![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202259705.webp)

[代码实现](https://juejin.cn/post/6844903903822086151)

#### 设计模式

##### **1. 发布/订阅模式**

- 发布/订阅模式
    - 订阅者
    - 发布者
    - 信号中心

> 我们假定，存在一个"信号中心"，某个任务执行完成，就向信号中心"发布"(publish)一个信 号，其他任务可以向信号中心"订阅"(subscribe)这个信号，从而知道什么时候自己可以开始执 行。这就叫做"发布/订阅模式"(publish-subscribe pattern)

> Vue 的自定义事件

```js
let vm = new Vue()
vm.$on('dataChange', () => { console.log('dataChange')})
vm.$on('dataChange', () => { 
  console.log('dataChange1')
}) 
vm.$emit('dataChange') 
```

兄弟组件通信过程

```js
// eventBus.js
// 事件中心
let eventHub = new Vue()

// ComponentA.vue
// 发布者
addTodo: function () {
  // 发布消息(事件)
  eventHub.$emit('add-todo', { text: this.newTodoText }) 
  this.newTodoText = ''
}
// ComponentB.vue
// 订阅者
created: function () {
  // 订阅消息(事件)
  eventHub.$on('add-todo', this.addTodo)
} 
```

> 模拟 Vue 自定义事件的实现

```js
class EventEmitter {
  constructor(){
    // { eventType: [ handler1, handler2 ] }
    this.subs = {}
  }
  // 订阅通知
  $on(eventType, fn) {
    this.subs[eventType] = this.subs[eventType] || []
    this.subs[eventType].push(fn)
  }
  // 发布通知
  $emit(eventType) {
    if(this.subs[eventType]) {
      this.subs[eventType].forEach(v=>v())
    }
  }
}

// 测试
var bus = new EventEmitter()

// 注册事件
bus.$on('click', function () {
  console.log('click')
})

bus.$on('click', function () {
  console.log('click1')
})

// 触发事件 
bus.$emit('click') 
```

##### **2. 观察者模式**

- 观察者(订阅者) --Watcher
    - `update()`:当事件发生时，具体要做的事情
- 目标(发布者) --Dep
    - `subs` 数组:存储所有的观察者
    - `addSub()`:添加观察者
    - `notify()`:当事件发生，调用所有观察者的 `update()` 方法
- 没有事件中心

```js
// 目标(发布者) 
// Dependency
class Dep {
  constructor () {
    // 存储所有的观察者
    this.subs = []
  }
  // 添加观察者
  addSub (sub) {
    if (sub && sub.update) {
      this.subs.push(sub)
    }
  }
  // 通知所有观察者
  notify () {
    this.subs.forEach(sub => sub.update())
  }
}

// 观察者(订阅者)
class Watcher {
  update () {
    console.log('update')
  }
}

// 测试
let dep = new Dep()
let watcher = new Watcher()
dep.addSub(watcher) 
dep.notify() 
```

##### **3. 总结**

- **观察者模式**是由具体目标调度，比如当事件触发，`Dep` 就会去调用观察者的方法，所以观察者模 式的订阅者与发布者之间是存在依赖的
- **发布/订阅模式**由统一调度中心调用，因此发布者和订阅者不需要知道对方的存在

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs233118.png)



### 3.v-model原理是什么? 语法糖实际是什么？

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

### 4.Object.defineProperty和Proxy特点对比分析？

#### Object.defineProperty()

作用：在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回这个对象。

##### 1.基本使用

语法：`Object.defineProperty(obj, prop, descriptor)`

参数：

1.  要添加属性的对象
2.  要定义或修改的属性的名称或 [`Symbol`]
3.  要定义或修改的属性描述符

看一个简单的例子

```js
let person = {}
let personName = 'lihua'

//在person对象上添加属性namep,值为personName
Object.defineProperty(person, 'namep', {
    //但是默认是不可枚举的(for in打印打印不出来)，可：enumerable: true
    //默认不可以修改，可：wirtable：true
    //默认不可以删除，可：configurable：true
    get: function () {
        console.log('触发了get方法')
        return personName
    },
    set: function (val) {
        console.log('触发了set方法')
        personName = val
    }
})

//当读取person对象的namp属性时，触发get方法
console.log(person.namep)

//当修改personName时，重新访问person.namep发现修改成功
personName = 'liming'
console.log(person.namep)

// 对person.namep进行修改，触发set方法
person.namep = 'huahua'
console.log(person.namep)
```

通过这种方法，我们成功监听了person上的name属性的变化。

##### 2.监听对象上的多个属性

一个错误的版本

```js
Object.keys(person).forEach(function (key) {
    Object.defineProperty(person, key, {
        enumerable: true,
        configurable: true,
        // 默认会传入this
        get() {
            return person[key]
        },
        set(val) {
            console.log(`对person中的${key}属性进行了修改`)
            person[key] = val
            // 修改之后可以执行渲染操作
        }
    })
})
console.log(person.age)
```

栈溢出问题：我们在访问person身上的属性时，就会触发get方法，返回person[key]，但是访问person[key]也会触发get方法，导致递归调用，最终栈溢出

我们需要设置一个中转Obsever，来让get中return的值并不是直接访问obj[key]

```js
let person = {
    name: '',
    age: 0
}
// 实现一个响应式函数
function defineProperty(obj, key, val) {
    Object.defineProperty(obj, key, {
        get() {
            console.log(`访问了${key}属性`)
            return val
        },
        set(newVal) {
            console.log(`${key}属性被修改为${newVal}了`)
            val = newVal
        }
    })
}
// 实现一个遍历函数Observer
function Observer(obj) {
    Object.keys(obj).forEach((key) => {
        defineProperty(obj, key, obj[key])
    })
}
Observer(person)
console.log(person.age)
person.age = 18
console.log(person.age)
```

##### 3.深度监听一个对象

只要把对象传入其中，就可以实现对这个对象的属性监视，即使该对象的属性也是一个对象。
我们在defineProperty()函数中，添加一个递归的情况：

```js
function defineProperty(obj, key, val) {
    //如果某对象的属性也是一个对象，递归进入该对象，进行监听
    if(typeof val === 'object'){
    observer(val)
    }
    Object.defineProperty(obj, key, {
        get() {
            console.log(`访问了${key}属性`)
            return val
        },
        set(newVal) {
            console.log(`${key}属性被修改为${newVal}了`)
            val = newVal
        }
    })
}
```

##### 4.监听数组

对象的属性是一个数组  如何实现监听

```js
let arr = [1, 2, 3]
let obj = {}
//把arr作为obj的属性监听
Object.defineProperty(obj, 'arr', {
    get() {
        console.log('get arr')
        return arr
    },
    set(newVal) {
        console.log('set', newVal)
        arr = newVal
    }
})
console.log(obj.arr)//输出get arr [1,2,3]  正常
obj.arr = [1, 2, 3, 4] //输出set [1,2,3,4] 正常
obj.arr.push(3) //输出get arr 不正常，监听不到push
```

通过`push`方法给数组增加的元素，set方法是监听不到的

通过索引访问或者修改数组中已经存在的元素，是可以出发get和set的，但是对于通过push、unshift增加的元素，会增加一个索引，这种情况需要手动初始化，新增加的元素才能被监听到。另外， 通过 pop 或 shift 删除元素，会删除并更新索引，也会触发 setter 和 getter 方法

通过重写Array原型上的方法解决了这个问题

#### Proxy

当我们要给对象新增加一个属性时，也需要手动去监听这个新增属性

使用vue给 data 中的数组或对象新增属性时，需要使用 vm.$set 才能保证新增的属性也是响应式的

##### 1.基本使用

语法：`const p = new Proxy(target, handler)` 参数:

1.  target:要使用 `Proxy` 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）
2.  handler:一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 `p` 的行为。

通过Proxy，我们可以对`设置代理的对象`上的一些操作进行拦截，外界对这个对象的各种操作，都要先通过这层拦截。（和defineProperty差不多）

例子

```js
//定义一个需要代理的对象
let person = {
    age: 0,
    school: 'upc'
}
//定义handler对象
let hander = {
    get(obj, key) {
        // 如果对象里有这个属性，就返回属性值，如果没有，就返回默认值66
        return key in obj ? obj[key] : 66
    },
    set(obj, key, val) {
        obj[key] = val
        return true
    }
}
//把handler对象传入Proxy
let proxyObj = new Proxy(person, hander)

// 测试get能否拦截成功
console.log(proxyObj.age)//输出0
console.log(proxyObj.school)//输出西电
console.log(proxyObj.name)//输出默认值66

// 测试set能否拦截成功
proxyObj.age = 18
console.log(proxyObj.age)//输出18 修改成功
```

Proxy代理的是整个对象，而不是对象的某个特定属性，不需要我们通过遍历来逐个进行数据绑定。

>   值得注意的是:之前我们在使用Object.defineProperty()给对象添加一个属性之后，我们对对象属性的读写操作仍然在对象本身。
>   但是一旦使用Proxy，如果想要读写操作生效，我们就要对Proxy的实例对象`proxyObj`进行操作

##### 2.解决Object.defineProperty中遇到的问题

使用Object.defineProperty的时候，我们遇到的问题有：

1.一次只能对一个属性进行监听，需要遍历来对所有属性监听。这个我们在上面已经解决了。

2.在遇到一个对象的属性还是一个对象的情况下，需要递归监听。
3.对于对象的新增属性，需要手动监听
4.对于数组通过push、unshift方法增加的元素，也无法监听



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

[源码学习](https://juejin.cn/post/6974293549135167495)

watch用法

```js
<body>
    <div id="app">
        姓： <input type="text" v-model=firstName> 名：
        <input type="text" v-model=lastName> 姓名：
        <span>{{fullname}}</span>
    </div>
</body>
<script type="text/javascript">
    var app = new Vue({
        el: "#app",
        data: {
            firstName: 'z',
            lastName: 's',
            fullname: 'zs'
        },
        watch: {
            firstName(newval) {
​
                this.fullname = newval + this.lastName
            },
            lastName(newval) {
                this.fullname = this.firstName + newval
            }
​
        }
    })
​
</script>
```

computed用法

```js
<body>
    <div id="app">
        姓： <input type="text" v-model=firstName> 名：
        <input type="text" v-model=lastName> 姓名：
        <span>{{fullname}}</span>
    </div>
</body>
<script type="text/javascript">
    var app = new Vue({
        el: "#app",
        data: {
            firstName: 'z',
            lastName: 's'
        },
        computed: {
            fullname() {
                return this.firstName + this.lastName
            }
        }
    })
​
</script>
```



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

#### 源码实现

##### Watcher的种类

`name`变量被三处地方所依赖，分别是`html里，computed里，watch里`。只要`name`一改变，html里就会重新渲染，computed里就会重新计算，watch里就会重新执行。那么是谁去通知这三个地方`name`修改了呢？那就是`Watcher`了

```js
<div>{{name}}</div>

data() {
        return {
            name: '林三心'
        }
    },
    computed: {
        info () {
            return this.name
        }
    },
    watch: {
        name(newVal) {
            console.log(newVal)
        }
    }
```

-   `渲染Watcher`：变量修改时，负责通知HTML里的重新渲染
-   `computed Watcher`：变量修改时，负责通知computed里依赖此变量的computed属性变量的修改
-   `user Watcher`：变量修改时，负责通知watch属性里所对应的变量函数的执行

##### computed的本质 —— computed watch

我们知道new Vue()的时候会调用_init方法，该方法会初始化生命周期，初始化事件，初始化render，初始化data，computed，methods，wacther等等。[Vue.js源码角度：剖析模版和数据渲染成最终的DOM的过程](https://juejin.cn/post/6844903664998416392)。今天主要来看以下初始化watch(initWatch)的实现，我加上了注释方便理解，定义在src/core/instance/state.js中：

```JS
// 用于传入Watcher实例的一个对象，即computed watcher
const computedWatcherOptions = { computed: true }

function initComputed (vm: Component, computed: Object) {
  // $flow-disable-line
  // 声明一个watchers且同时挂载到vm实例上
  const watchers = vm._computedWatchers = Object.create(null)
  // 在SSR模式下computed属性只能触发getter方法
  const isSSR = isServerRendering()

  // 遍历传入的computed方法
  for (const key in computed) {
    // 取出computed对象中的每个方法并赋值给userDef
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        `Getter is missing for computed property "${key}".`,
        vm
      )
    }

    // 如果不是SSR服务端渲染，则创建一个watcher实例
    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      // 如果computed中的key没有设置到vm中，通过defineComputed函数挂载上去 
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      // 如果data和props有和computed中的key重名的，会产生warning
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      }
    }
  }
}
```

通过源码我们可以发现它先声明了一个名为watchers的空对象，同时在vm上也挂载了这个空对象。之后**遍历计算属性，并把每个属性的方法赋给userDef**，如果userDef是function的话就赋给getter，接着判断是否是服务端渲染，如果不是的话就创建一个Watcher实例。

这里**新建的Watcher实例中我们传入了第四个参数computedWatcherOptions**。

const computedWatcherOptions = { computed: true }，这个对象是实现computed watcher的关键。这时，Watcher中的逻辑就有变化了：

```JS
    // 源码定义在src/core/observer/watcher.js中
    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.computed = !!options.computed
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.computed = this.sync = false
    }
    // 其他的代码......
    this.dirty = this.computed // for computed watchers
```

这里传入的**options**就是上边定义的computedWatcherOptions，当走initData方法的时候，options并不存在，但当走到**initComputed**的时候，computedWatcherOptions中的computed为true，注意上边的一行代码**this.dirty = this.computed**，将this.computed赋值给this.dirty。接着看下边的代码：

```JS
  evaluate () {
    if (this.dirty) {
      this.value = this.get()
      this.dirty = false
    }
    return this.value
  }
```

只有this.dirty为true的时候才能通过 this.get() 求值，然后把 this.dirty 设置为 false。在求值过程中，会执行 value = this.getter.call(vm, vm)，**这实际上就是执行了计算属性定义的 getter 函数**，否则直接返回value。

当对**计算属性依赖的数据做修改**的时候，会触发 setter 过程，通知所有订阅它变化的 watcher 更新，**执行 watcher.update() 方法**：

```JS
  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  update () {
    /* istanbul ignore else */
    if (this.computed) {
      // A computed property watcher has two modes: lazy and activated.
      // It initializes as lazy by default, and only becomes activated when
      // it is depended on by at least one subscriber, which is typically
      // another computed property or a component's render function.
      if (this.dep.subs.length === 0) {
        // In lazy mode, we don't want to perform computations until necessary,
        // so we simply mark the watcher as dirty. The actual computation is
        // performed just-in-time in this.evaluate() when the computed property
        // is accessed.
        this.dirty = true
      } else {
        // In activated mode, we want to proactively perform the computation
        // but only notify our subscribers when the value has indeed changed.
        this.getAndInvoke(() => {
          this.dep.notify()
        })
      }
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }
```

那么对于计算属性这样的 computed watcher，它实际上是有 2 种模式，lazy 和 active。如果 this.dep.subs.length === 0 成立，则说明没有人去订阅这个 computed watcher 的变化，就把 this.dirty = true，只有当下次再访问这个计算属性的时候才会重新求值。否则会执行getAndInvoke方法：

```JS
  getAndInvoke (cb: Function) {
    const value = this.get()
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      const oldValue = this.value
      this.value = value
      this.dirty = false
      if (this.user) {
        try {
          cb.call(this.vm, value, oldValue)
        } catch (e) {
          handleError(e, this.vm, `callback for watcher "${this.expression}"`)
        }
      } else {
        cb.call(this.vm, value, oldValue)
      }
    }
  }
```

getAndInvoke 函数会重新计算，然后对比新旧值，在三种情况下(1.新旧值不相等的情况2.value是对象或数组的时候3.设置deep属性的时候)会执行回调函数，那么这里这个回调函数是 this.dep.notify()，在我们这个场景下就是触发了渲染 watcher 重新渲染。这就能解释官网中所说的**计算属性是基于它们的依赖进行缓存的**。

##### Computed源码总结

基于Watcher类，有一个lazy属性，可以进行缓存作用，如果lazy是true证明是计算属性，直接返回数据，不用继续求值，这就是缓存值的原理

![image-20220621085011422](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsFSHsPfdICcehav7.png)

1.遍历计算属性，并把每个属性的方法赋给userDef

2.新建的Watcher实例中我们传入了第四个参数computedWatcherOptions

3.**initComputed**的时候，computedWatcherOptions中的computed为true

4.evaluate () 中 只有this.dirty为true的时候才能通过 this.get() 求值，然后把 this.dirty 设置为 false

5.求值过程中，会执行 value = this.getter.call(vm, vm)，**这实际上就是执行了计算属性定义的 getter 函数**，如果dirty为false直接返回value

6.**计算属性依赖的数据做修改**的时候，会触发 setter 过程，通知所有订阅它变化的 watcher 更新，**执行 watcher.update() 方法**

7.computed watcher是有 2 种模式，lazy 和 active。如果 this.dep.subs.length === 0 成立，则说明没有人去订阅这个 computed watcher 的变化，就把 this.dirty = true只有当下次再访问这个计算属性的时候才会重新求值

8.getAndInvoke 函数会重新计算，然后对比新旧值，在三种情况下(1.新旧值不相等的情况2.value是对象或数组的时候3.设置deep属性的时候)会执行回调函数

##### watch底层是如何工作的？

上边提到了在new Vue()的时候调用了_init方法完成了初始化。在这当中有调用了initWatch方法，定义在src/core/instance/state.js中：

```JS
function initWatch (vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key]
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}
```

遍历watch对象，并将每个watch[key]赋值给handler，如果是数组则遍历createWatcher方法，否则直接调用createWatcher方法。接下来看一下createWatcher方法的定义：

```JS
function createWatcher (
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(expOrFn, handler, options)
}
```

通过代码可以发现，createWatcher方法vm.?watch(keyOrFn, handler, options) 函数，调用了Vue.prototype.$watch方法，定义在src/core/instance/state.js中：

```JS
  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      cb.call(vm, watcher.value)
    }
    return function unwatchFn () {
      watcher.teardown()
    }
  }
}
```

通过代码我们可以发现， watch 最终会调用Vue.prototype.watch 方法，

这个方法首先判断 cb 如果是一个对象，则调用 createWatcher 方法，这是因为*w**a**t**c**h*方法，这个方法首先判断*cb*如果是一个对象，则调用***createWatcher***方法，

接着执行 const watcher = new Watcher(vm, expOrFn, cb, options) 实例化了一个 watcher，这里需要注意一点这是一个 user watcher，因为 options.user = true。

通过实例化 watcher 的方式，一旦我们 watch 的数据发送变化，它最终会执行 watcher 的 run 方法，执行回调函数 cb，并且如果我们设置了 immediate 为 true，则直接会执行回调函数 cb。即设置immediate属性为true的时候，第一次watch绑定的时候就可以执行。

最后返回了一个 unwatchFn 方法，它会调用 teardown 方法去移除这个 watcher。

所以watcher是如何工作的？本质上也是基于 Watcher 实现的，它是一个 user watcher。前面提到了计算属性computed本质上是一个computed watcher

##### Watch源码总结

双向数据绑定有一个Watcher类，只是普通的watch实例化，有没有deep参数只需要加上判断，即可。

还有可以监听函数，将当前函数赋值给getter,监听的函数里面涉及到的状态都会被监听到，发生了变化就会触发watch。

还要新增一个取消观察函数的函数

watch中deep:true实现：当用户指定了 watch 中的deep属性为 true 时，如果当前监控的值是数组或者对象。 在watch类里面有get方法对deep，和复杂对象处理方法，**会对对象中的每一项进行求值**，此时会将当前 watcher 存入到对应属性的依赖中(将当前依赖放到 Dep.target上)，这样数组中对象发生变化时也会通知数据更新

_traverse()方法里面

不是数组也不是对象返回，冰冻对象返回，Vnode实例返回

对数组和对象进行递归判断

### 7.nextTick有什么应用场景？原理是什么？

![12c574e8b85e729b0d9905959cc281ab.png](https://img-blog.csdnimg.cn/img_convert/12c574e8b85e729b0d9905959cc281ab.png)

**打印的结果是begin, 而不是我们设置的end。**这个结果足以说明Vue中DOM的更新并非同步

ue异步执行DOM更新。只要观察到数据变化，Vue将开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。如果同一个watcher被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和DOM操作上非常重要。然后，在下一个的事件循环“tick”中，Vue刷新队列并执行实际 (已去重的) 工作

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

### 9.Vue中的三种Watcher

`Vue`可以说存在三种`watcher`，第一种是在定义`data`函数时定义数据的`render watcher`；第二种是`computed watcher`，是`computed`函数在自身内部维护的一个`watcher`，配合其内部的属性`dirty`开关来决定`computed`的值是需要重新计算还是直接复用之前的值；第三种就是`whtcher api`了，就是用户自定义的`export`导出对象的`watch`属性；当然实际上他们都是通过`class Watcher`类来实现的。

#### 描述

`Vue.js`的数据响应式，通常有以下的的场景：

- 数据变`->`使用数据的视图变。
- 数据变`->`使用数据的计算属性变`->`使用计算属性的视图变。
- 数据变`->`开发者主动注册的`watch`回调函数执行。

三个场景，对应三种`watcher`：

- 负责视图更新的`render watcher`。
- 执行计算属性更新的`computed watcher`。
- 用户注册的普通`watcher api`。

#### render watcher

##### 建立联系

如何才能建立视图渲染与属性值之间的联系？先来搞清楚两个问题

- 谁**用了**这个数据
- 数据**变了**之后怎么办

在视图渲染这个场景下，这两个问题的解答分别是：

- 负责生成视图的render函数要用这个数据
- 数据变了得执行render函数

##### 数据劫持

**用了**和**变了**，是可以通过对该属性值设置访问描述符（get/set）知道的。

因此，需要遍历所有data属性值，用Object.defineProperty设置访问描述符（get/set）。

- 谁用了这个数据？
   触发了属性值get的就是要用到的，应该在getter里记录下使用者。
- 数据变了怎么办？
   数据变就会触发属性值set，应该在setter里告知使用者。

##### 订阅-发布

从上面的描述可以看出，这个场景是典型的发布&订阅。

在视图渲染的场景中，render-watcher是订阅者。每个属性值都有一个依赖管理者——dep，负责记录和通知订阅者。

##### 依赖的收集与通知

###### 收集订阅（依赖）者的流程

1. 订阅者执行回调（render函数）
2. 触发属性值getter
3. 添加到订阅者队列
4. 重复2、3直至所有getter执行完

###### 通知订阅者的流程

1. 属性改变
2. 触发属性值setter
3. dep通知订阅者（render watcher）
4. 订阅者执行回调（render函数）

##### 取消订阅

当某些属性值不再被视图使用的时候，就应该取消掉对这些属性的订阅。

怎么才能知道哪些属性值不再被引用呢？我们可以这么做：

订阅者（render-watcher）也维护一个依赖集合，将依赖的属性值的dep存储在这个集合里。

每当render function执行一次，也就是触发属性值的getter时，订阅者（render-watcher）会存储一份新的依赖集合。对比新旧依赖集合，找出已经不再依赖的旧dep，将render-watcher从这个旧dep的订阅者队列中删除。这样就不会通知到当前的订阅者了（render-watcher）。




在`render watcher`中，响应式就意味着，当数据中的值改变时，在视图上的渲染内容也需要跟着改变，在这里就需要一个视图渲染与属性值之间的联系，`Vue`中的响应式，简单点来说分为以下三个部分：

- `Observer`: 这里的主要工作是递归地监听对象上的所有属性，在属性值改变的时候，触发相应的`Watcher`。
- `Watcher`: 观察者，当监听的数据值修改时，执行响应的回调函数，在`Vue`里面的更新模板内容。
- `Dep`: 链接`Observer`和`Watcher`的桥梁，每一个`Observer`对应一个`Dep`，它内部维护一个数组，保存与该`Observer`相关的`Watcher`。

根据上面的三部分实现一个功能非常简单的`Demo`，实际`Vue`中的数据在页面的更新是异步的，且存在大量优化，实际非常复杂。
首先实现`Dep`方法，这是链接`Observer`和`Watcher`的桥梁，简单来说，就是一个监听者模式的事件总线，负责接收`watcher`并保存。其中`subscribers`数组用以保存将要触发的事件，`addSub`方法用以添加事件，`notify`方法用以触发事件。

```javascript
function __dep(){
    this.subscribers = [];
    this.addSub = function(watcher){
        if(__dep.target && !this.subscribers.includes(__dep.target) ) this.subscribers.push(watcher);
    }
    this.notifyAll = function(){
        this.subscribers.forEach( watcher => watcher.update());
    }
}Copy to clipboardErrorCopied
```

`Observer`方法就是将数据进行劫持，使用`Object.defineProperty`对属性进行重定义，注意一个属性描述符只能是数据描述符和存取描述符这两者其中之一，不能同时是两者，所以在这个小`Demo`中使用`getter`与`setter`操作的的是定义的`value`局部变量，主要是利用了`let`的块级作用域定义`value`局部变量并利用闭包的原理实现了`getter`与`setter`操作`value`，对于每个数据绑定时都有一个自己的`dep`实例，利用这个总线来保存关于这个属性的`Watcher`，并在`set`更新数据的时候触发。

```javascript
function __observe(obj){
    for(let item in obj){
        let dep = new __dep();
        let value = obj[item];
        if (Object.prototype.toString.call(value) === "[object Object]") __observe(value);
        Object.defineProperty(obj, item, {
            configurable: true,
            enumerable: true,
            get: function reactiveGetter() {
                if(__dep.target) dep.addSub(__dep.target);
                return value;
            },
            set: function reactiveSetter(newVal) {
                if (value === newVal) return value;
                value = newVal;
                dep.notifyAll();
            }
        });
    }
    return obj;
}Copy to clipboardErrorCopied
```

`Watcher`方法传入一个回调函数，用以执行数据变更后的操作，一般是用来进行模板的渲染，`update`方法就是在数据变更后执行的方法，`activeRun`是首次进行绑定时执行的操作，关于这个操作中的`__dep.target`，他的主要目的是将执行回调函数相关的数据进行`sub`，例如在回调函数中用到了`msg`，那么在执行这个`activeRun`的时候`__dep.target`就会指向`this`，然后执行`fn()`的时候会取得`msg`，此时就会触发`msg`的`get()`，而`get`中会判断这个`__dep.target`是不是空，此时这个`__dep.target`不为空，上文提到了每个属性都会有一个自己的`dep`实例，此时这个`__dep.target`便加入自身实例的`subscribers`，在执行完之后，便将`__dep.target`设置为`null`，重复这个过程将所有的相关属性与`watcher`进行了绑定，在相关属性进行`set`时，就会触发各个`watcher`的`update`然后执行渲染等操作。

```javascript
function __watcher(fn){
    this.update = function(){
        fn();
    }

    this.activeRun = function(){
        __dep.target = this;
        fn();
        __dep.target = null;
    }
    this.activeRun();
}Copy to clipboardErrorCopied
```

这是上述的小`Demo`的代码示例，其中上文没有提到的`__proxy`函数主要是为了将`vm.$data`中的属性直接代理到`vm`对象上，两个`watcher`中第一个是为了打印并查看数据，第二个是之前做的一个非常简单的模板引擎的渲染，为了演示数据变更使得页面数据重新渲染，在这个`Demo`下打开控制台，输入`vm.msg = 11;`即可触发页面的数据更改，也可以通过在`40`行添加一行`console.log(dep);`来查看每个属性的`dep`绑定的`watcher`。

```html
<!DOCTYPE html>
<html>
<head>
    <title>数据绑定</title>
</head>
<body>
    <div id="app">
        <div>{{msg}}</div>
        <div>{{date}}</div>
    </div> 
</body>
<script type="text/javascript">

    var Mvvm = function(config) {
        this.$el = config.el;
        this.__root = document.querySelector(this.$el);
        this.__originHTML = this.__root.innerHTML;

        function __dep(){
            this.subscribers = [];
            this.addSub = function(watcher){
                if(__dep.target && !this.subscribers.includes(__dep.target) ) this.subscribers.push(watcher);
            }
            this.notifyAll = function(){
                this.subscribers.forEach( watcher => watcher.update());
            }
        }


        function __observe(obj){
            for(let item in obj){
                let dep = new __dep();
                let value = obj[item];
                if (Object.prototype.toString.call(value) === "[object Object]") __observe(value);
                Object.defineProperty(obj, item, {
                    configurable: true,
                    enumerable: true,
                    get: function reactiveGetter() {
                        if(__dep.target) dep.addSub(__dep.target);
                        return value;
                    },
                    set: function reactiveSetter(newVal) {
                        if (value === newVal) return value;
                        value = newVal;
                        dep.notifyAll();
                    }
                });
            }
            return obj;
        }

        this.$data = __observe(config.data);

        function __proxy (target) {
            for(let item in target){
                Object.defineProperty(this, item, {
                    configurable: true,
                    enumerable: true,
                    get: function proxyGetter() {
                        return this.$data[item];
                    },
                    set: function proxySetter(newVal) {
                        this.$data[item] = newVal;
                    }
                });
            }
        }

        __proxy.call(this, config.data);

        function __watcher(fn){
            this.update = function(){
                fn();
            }

            this.activeRun = function(){
                __dep.target = this;
                fn();
                __dep.target = null;
            }
            this.activeRun();
        }

        new __watcher(() => {
            console.log(this.msg, this.date);
        })

        new __watcher(() => {
            var html = String(this.__originHTML||'').replace(/"/g,'\\"').replace(/\s+|\r|\t|\n/g, ' ')
            .replace(/\{\{(.)*?\}\}/g, function(value){ 
                return  value.replace("{{",'"+(').replace("}}",')+"');
            })
            html = `var targetHTML = "${html}";return targetHTML;`;
            var parsedHTML = new Function(...Object.keys(this.$data), html)(...Object.values(this.$data));
            this.__root.innerHTML = parsedHTML;
        })

    }

    var vm = new Mvvm({
        el: "#app",
        data: {
            msg: "1",
            date: new Date(),
            obj: {
                a: 1,
                b: 11
            }
        }
    })

</script>
</html>Copy to clipboardErrorCopied
```

#### computed watcher

`computed`函数在自身内部维护的一个`watcher`，配合其内部的属性`dirty`开关来决定`computed`的值是需要重新计算还是直接复用之前的值。
在`Vue`中`computed`是计算属性，其会根据所依赖的数据动态显示新的计算结果，虽然使用`{{}}`模板内的表达式非常便利，但是设计它们的初衷是用于简单运算的，在模板中放入太多的逻辑会让模板过重且难以维护，所以对于任何复杂逻辑，都应当使用计算属性。计算属性是基于数据的响应式依赖进行缓存的，只在相关响应式依赖发生改变时它们才会重新求值，也就是说只要计算属性依赖的数据还没有发生改变，多次访问计算属性会立即返回之前的计算结果，而不必再次执行函数，当然如果不希望使用缓存可以使用方法属性并返回值即可，`computed`计算属性非常适用于一个数据受多个数据影响以及需要对数据进行预处理的条件下使用。
`computed`计算属性可以定义两种方式的参数，`{ [key: string]: Function | { get: Function, set: Function } }`，计算属性直接定义在`Vue`实例中，所有`getter`和`setter`的`this`上下文自动地绑定为`Vue`实例，此外如果为一个计算属性使用了箭头函数，则`this`不会指向这个组件的实例，不过仍然可以将其实例作为函数的第一个参数来访问，计算属性的结果会被缓存，除非依赖的响应式`property`变化才会重新计算，注意如果某个依赖例如非响应式`property`在该实例范畴之外，则计算属性是不会被更新的。

```html
<!DOCTYPE html>
<html>
<head>
    <title>Vue</title>
</head>
<body>
    <div id="app"></div>
</body>
<script src="https://cdn.bootcss.com/vue/2.4.2/vue.js"></script>
<script type="text/javascript">
    var vm = new Vue({
        el: "#app",
        data: {
            a: 1,
            b: 2
        },
        template:`
            <div>
                <div>{{multiplication}}</div>
                <div>{{multiplication}}</div>
                <div>{{multiplication}}</div>
                <div>{{multiplicationArrow}}</div>
                <button @click="updateSetting">updateSetting</button>
            </div>
        `,
        computed:{
            multiplication: function(){
                console.log("a * b"); // 初始只打印一次 返回值被缓存
                return this.a * this.b;
            },
            multiplicationArrow: vm => vm.a * vm.b * 3, // 箭头函数可以通过传入的参数获取当前实例
            setting: {
                get: function(){
                    console.log("a * b * 6");
                    return this.a * this.b * 6;
                },
                set: function(v){
                    console.log(`${v} -> a`);
                    this.a = v;
                }
            }
        },
        methods:{
            updateSetting: function(){ // 点击按钮后
                console.log(this.setting); // 12
                this.setting = 3; // 3 -> a
                console.log(this.setting); // 36
            }
        },

    })
</script>
</html>Copy to clipboardErrorCopied
```

#### watcher api

在`watch api`中可以定义`deep`与`immediate`属性，分别为深度监听`watch`和最初绑定即执行回调的定义，在`render watch`中定义数组的每一项由于性能与效果的折衷是不会直接被监听的，但是使用`deep`就可以对其进行监听，当然在`Vue3`中使用`Proxy`就不存在这个问题了，这原本是`Js`引擎的内部能力，拦截行为使用了一个能够响应特定操作的函数，即通过`Proxy`去对一个对象进行代理之后，我们将得到一个和被代理对象几乎完全一样的对象，并且可以从底层实现对这个对象进行完全的监控。
对于`watch api`，类型`{ [key: string]: string | Function | Object | Array }`，是一个对象，键是需要观察的表达式，值是对应回调函数，值也可以是方法名，或者包含选项的对象，`Vue`实例将会在实例化时调用`$watch()`，遍历`watch`对象的每一个`property`。 不应该使用箭头函数来定义`watcher`函数，例如`searchQuery: newValue => this.updateAutocomplete(newValue)`，理由是箭头函数绑定了父级作用域的上下文，所以`this`将不会按照期望指向`Vue`实例，`this.updateAutocomplete`将是`undefined`。

```html
<!DOCTYPE html>
<html>
<head>
    <title>Vue</title>
</head>
<body>
    <div id="app"></div>
</body>
<script src="https://cdn.bootcss.com/vue/2.4.2/vue.js"></script>
<script type="text/javascript">
    var vm = new Vue({
        el: "#app",
        data: {
            a: 1,
            b: 2,
            c: 3,
            d: {
                e: 4,
            },
            f: {
                g: 5
            }
        },
        template:`
            <div>
                <div>a: {{a}}</div>
                <div>b: {{b}}</div>
                <div>c: {{c}}</div>
                <div>d.e: {{d.e}}</div>
                <div>f.g: {{f.g}}</div>
                <button @click="updateA">updateA</button>
                <button @click="updateB">updateB</button>
                <button @click="updateC">updateC</button>
                <button @click="updateDE">updateDE</button>
                <button @click="updateFG">updateFG</button>
            </div>
        `,
        watch: {
            a: function(n, o){ // 普通watcher
                console.log("a", o, "->", n);
            },
            b: { // 可以指定immediate属性
                handler: function(n, o){
                    console.log("b", o, "->", n);
                },
                immediate: true
            },
            c: [ // 逐单元执行
                function handler(n, o){
                    console.log("c1", o, "->", n);
                },{
                    handler: function(n, o){
                        console.log("c2", o, "->", n);
                    },
                    immediate: true
                }
            ],
            d: {
                handler: function(n, o){ // 因为是内部属性值 更改不会执行
                    console.log("d.e1", o, "->", n);
                },
            },
            "d.e": { // 可以指定内部属性的值
                handler: function(n, o){
                    console.log("d.e2", o, "->", n);
                }
            },
            f: { // 深度绑定内部属性
                handler: function(n){
                    console.log("f.g", n.g);
                },
                deep: true
            }
        },
        methods:{
            updateA: function(){
                this.a = this.a * 2;
            },
            updateB: function(){
                this.b = this.b * 2;
            },
            updateC: function(){
                this.c = this.c * 2;
            },
            updateDE: function(){
                this.d.e = this.d.e * 2;
            },
            updateFG: function(){
                this.f.g = this.f.g * 2;
            }
        },

    })
</script>
</html>
```

### 10.slot的应用场景

我们知道在Vue中 Child 组件的标签 的中间是不可以包着什么的 。

![image-20220714223514708](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsld6RJOhpcTbBPvN.png)

可是往往在很多时候我们在使用组件的时候总想在组件间外面自定义一些标签，vue新增了一种插槽机制，叫做作用域插槽。

插槽，其实就相当于占位符。**它在组件中给你的HTML模板占了一个位置，让你来传入一些东西**。插槽又分为 匿名插槽、具名插槽、作用域插槽。

在 2.6.0 中，我们为具名插槽和作用域插槽引入了一个新的统一的语法 (即 `v-slot` 指令)。它取代了 `slot` 和 `slot-scope`

子组件里面写`<slot>`标签

#### 匿名插槽

匿名插槽，我们也可以叫它单个插槽或者默认插槽。和具名插槽相对，它是不需要设置 name 属性的，它隐藏的name属性为default。

father.vue

![image-20220621091100389](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs2aHchKi93d7uADY.png)

child.vue

![image-20220621091115897](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs6AZtGqxIcYzTF7S.png)

匿名插槽，name的属性对应的是 default 也可以不写就是默认的意思啦；

在使用的时候还有一个问题要注意的 如果是有2个以上的匿名插槽是会child标签里面的内容全部都替换到每个slot；

#### 具名插槽 （vue2.6.0+被废弃的slot='name'）

顾名思义就是slot 是带有name的 定义， 或者使用简单缩写的定义 #header 使用：要用一个 template标签包裹

父组件 `v-slot:myName`

子组件 `<slot name="myName">`

father.vue

![image-20220621091140171](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsFuYa7PyUZ9EHipx.png)

child.vue

![image-20220621091151645](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsXKOCJqS7DVU1GhM.png)

多个具名插槽的使用 多个具名插槽，插槽的位置不是使用插槽的位置而定的，是在定义的时候的位置来替换的(子组件里面确定)

father.vue

![image-20220621091208254](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsCSzm39cRM2WVQ4q.png)

child.vue

![image-20220621091217351](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsHQG3KPIelOzysAR.png)

#### 作用域插槽

就是用来传递数据的插槽

当你想在一个插槽中使用数据时，要注意一个问题作用域的问题，Vue 官方文档中说了父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的;

为了让 子组件中的数据 在父级的插槽 内容中可用我们可以将 数据 作为 元素的一个特性绑定上去： v-bind:text="text"

注意：

匿名的作用域插槽和具名的作用域插槽 区别在v-slot:defult="接受的名称"(defult(匿名的可以不写，具名的相反要写的是对应的name))

v-solt可以解构接收 解构接收的字段要和传的字段一样才可以 

子组件`<slot :one="user2" >`对应父组件里面 `v-slot="{one}"`   父组件可以通过one来取值

子组件`<slot name="footer" v-bind:users='user1'>`对应父组件里面  `v-slot:footer="slotProps"`   父组件可以通过slotProps.users来取值user1

![image-20220621091229483](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsqgjwZ1r2EcJOsmC.png)

效果图

![image-20220621091246267](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsUAzp31qG6lXSrhn.png)

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

数组通过索引值修改内容 vm.arr[1] = ‘aa’

```js
// 数组值虽然变化了，但是并没有相应到页面上，此时的数组值其实是 ['aaa','b','c']
btnClick(){
  this.letters[0]('aaa');

  // 替换方法一：splice()
  this.letters.splice(0,1,'aaa')
  // 替换方法二：Vue.set()。vue内部函数（这个也是响应式的）
  Vue.set(this.letters,0,'aaa')
}
```

数组长度的变化 vm.arr.length = 4

![image.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsnA6bieGWTtERalj.webp)

Vue.$set(target,key,value)：可以动态的给数组、对象添加和修改数据，并更新视图中数据的显示。

Vue.set(target, key/index, value) 向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新。它必须用于向响应式对象上添加新属性，因为 Vue 无法探测普通的新增属性 (比如 this.obj.newProperty = 'hi')

- `Vue.set()` 方法内部是一个循环处理的过程，如果当前新增监听的是一个对象，那就继续调用自己形成一个递归，直到最后的**子属性**是一个`数组/非对象类型`的参数后，递归结束，然后为自己添加监听，在监听中又会触发其他相关的方法(Dep 中订阅的事件就会被触发)。形成我们常见的双向数据绑定

Vue.set( ) 是将 set 函数绑定在 Vue 构造函数上，this.$set() 是将 set 函数绑定在 Vue原型上。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs5420598-b147c6f4580c131d.png)



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

转换成AST的是Vue模板，Vue需要根据模版去处理各种插值、指令；生成虚拟DOM的是最终要展示在页面上的内容的对象描述，Vue每次需要通过Diff算法对比新旧虚拟DOM的差异；固定模版生成的AST是不变的，虚拟DOM是不断变化、需要进行差异对比的（数据等会变）

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

[vue渲染过程](https://segmentfault.com/a/1190000018495383)

1. 把模板编译为render函数
2. 实例进行挂载, 根据根节点render函数的调用，递归的生成虚拟dom
3. 对比虚拟dom，渲染到真实dom
4. 组件内部data发生变化，组件和子组件引用data作为props重新调用render函数，生成虚拟dom, 返回到步骤3

#### 第一步: 模板到render

在我们使用Vue的组件化进行开发应用的时候, 如果仔细的查看我们要引入的组件, 例子如下

```javascript
// App.vue 
<template>
    <div>
        hello word
    </div>
</template>

<script>

export default {
}

</script>

<style>

</style>
```

在我们的主入口main.js

```javascript
import Vue from 'vue'
import App from './App'

console.log(App)

new Vue({
  render: h => h(App)
}).$mount('#app')
```

![clipboard.png](https://segmentfault.com/img/bVbpyO2?w=1143&h=140)

我们能够看到在我们引入的App这个模块，里面是一个对象，对象里面存在一个方法叫做render。在说render函数之前，我们可以想一想，每一次加载一个组件，然后对模板进行解析，解析完后，生成Dom，挂载到页面上。这样会导致效率很低效。而使用Vue-cli进行组件化开发，在我们引入组件的后，其实会有一个解析器(`vue-loader`)对此模板进行了解析，生成了render函数。当然，如果没有通过解析器解析为render函数，也没有关系，在组件第一次挂载的时候，Vue会自己进行解析。源码请参考: [https://github.com/vuejs/vue/...](https://link.segmentfault.com/?enc=1siedWNl%2FJiTt88QwG8ihw%3D%3D.%2Fo3W7WUR%2FZobCnNu8f0%2BVPj0AW4tdwsYnN6dRvDoexwg752EEpjJl52SJ2CtATv3ZKrf9XODxHyLz%2B9UBsIW%2BkrIkcnVhg9r64BOKXxAe0qiSFZWs6S%2FIVdZd%2BW9Gscy)
这样，能保证组件每次调用的都是render函数，使用render函数生成VNode。

#### 第二步：虚拟节点VNode

我们把Vue的实例挂载到`#app`, 会调用实例里面的render方法，生成虚拟DOM。来看看什么是虚拟节点，把例子修改一下。

```arcade
new Vue({
  render: h => {
    let root = h(App)
    console.log('root:', root)
    return root
  }
}).$mount('#app')
```

![clipboard.png](https://segmentfault.com/img/bVbpAmx?w=1146&h=414)

上面生成的VNode就是虚拟节点，虚拟节点里面有一个属性**`elm`**, 这个属性指向真实的DOM节点。因为VNode指向了真实的DOM节点，那么虚拟节点经过对比后，生成的DOM节点就可以直接进行替换。
**这样有什么好处呢？**
一个组件对象，如果内部的`data`发生变化，触发了render函数，重新生成了VNode节点。那么就可以直接找到所对应的节点，然后直接替换。那么这个过程只会在本组件内发生，不会影响其他的组件。于是组件与组件是隔离的。
例子如下:

```javascript
// main.js
const root = new Vue({
  data: {
    state: true
  },
  mounted() {
    setTimeout(() => {
      console.log(this)
      this.state = false
    }, 1000)
  },
  render: function(h) {
    const { state } = this // state 变化重新触发render
    let root = h(App)
    console.log('root:', root)
    return root
  }
}).$mount('#app')
// App.vue
<script>
export default {
  render: (h) => {
    let app = h('h1', ['hello world'])
    console.log('app:', app)
    return app
  }
}
</script>
```

![clipboard.png](https://segmentfault.com/img/bVbpAvU?w=1203&h=285)
我们可以看到，当`main.js`中重新触发render函数的时候，render方法里面有引用App.vue这个子组件。但是并没有触发App.vue组件的的render函数。

**`在一个组件内，什么情况会触发render?`**。

#### 如何才能触发组件的render

数据劫持是Vue的一大特色，原理官方已经讲的很多了[深入响应式原理](https://link.segmentfault.com/?enc=nG3Xm0TdYEcB%2Bd%2F5LHODGA%3D%3D.RtXq4EIfRNFMdPrs%2Bkd3qxSB2AkDvc1jUSHWFl3W6Nt4xo6b%2Bo3A2WcgrS%2BLnRCt)。在我们给组件的data的属性进行的赋值的时候(set)，此属性如果在组件内部初次渲染过程被引用(`data的属性被访问，也就是数据劫持的get`), 包括生命周期方法或者render方法。于是会触发组件的update(beforeUpdate -> render -> updated)。

> 注: 为了防止data被多次set从而触发多次update, Vue把update存放到异步队列中。这样就能保证多次data的set只会触发一次update。

**`当props会触发组件的重新渲染是怎么发生的呢？`**

把父组件的data通过props传递给子组件的时候，子组件在初次渲染的时候生命周期或者render方法，有调用data相关的props的属性, 这样子组件也被添加到父组件的data的相关属性依赖中，这样父组件的data在set的时候，就相当于触发自身和子组件的update。
例子如下:

```javascript
// main.vue
import Vue from 'vue'
import App from './App'

const root = new Vue({
  data: {
    state: false
  },
  mounted() {
    setTimeout(() => {
      this.state = true
    }, 1000)
  },
  render: function(h) {
    const { state } = this // state 变化重新触发render
    let root = h(App, { props: { status: state } })
    console.log('root:', root)
    return root
  }
}).$mount('#app')

window.root = root
// App.vue
<script>
export default {
  props: {
    status: Boolean
  },
  render: function (h){
    const { status } = this
    let app = h('h1', ['hello world'])
    console.log('app:', app)
    return app
  }
}
</script>
```

截图如下:

![clipboard.png](https://segmentfault.com/img/bVbpLBL?w=937&h=164)
在`main.js`中 **state** 状态发生了变化，由`false` => `true`, 触发了**自身**与**子组件**的render方法。

### 18.修改后页面更新渲染的过程

![在这里插入图片描述](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs5EZMmAjgp3Olv1w.png)

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsKWtlC9SIxfFOkhA.png)

一、初始化

 ![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsOP6ZFBQD1WRbMay.png)

在 new Vue() 之后。 Vue 会调用 _init 函数进行初始化，也就是这里的 init 过程，它会初始化生命周期、事件、 props、 methods、 data、 computed 与 watch 等。

二、模板编译

 ![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsQH8LvVxN1BediCp.png)

上面就是使用vue template complier（compile编译可以分成 parse、optimize 与 generate 三个阶段），将模板编译成render函数，执行render函数后，变成vnode。

parse、optimize 与 generate 三个阶段

parse

parse 会用正则等方式解析 template 模板中的指令、class、style等数据，形成AST，就是with语法的过程。

optimize

optimize 的主要作用是标记 static 静态节点，这是 Vue 在编译过程中的一处优化，后面当 update更新界面时，会有一个 patch 的过程， diff 算法会直接跳过静态节点，从而减少了比较的过程，优化了 patch 的性能。

generate

generate 是将 AST 转化成 render function 字符串的过程，得到结果是 render 的字符串以及 staticRenderFns 字符串。

在经历过 parse、optimize 与 generate 这三个阶段以后，组件中就会存在渲染 VNode 所需的 render function 了。

三、vue的响应式原理：

 ![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgstzy3aGYQmgcwK5n.png)

前置知识: 

observer (value) ，其中 value（需要「响应式」化的对象）。
defineReactive ，这个方法通过 Object.defineProperty 来实现对对象的「响应式」化，入参是一个 obj（需要绑定的对象）、key（obj的某一个属性），val（具体的值）。
对象被读，就是说，这个值已经在页面中使用或则说已经使用插值表达式插入。
正式知识: 

 1.首先我们一开始会进行响应式初始化，也即是我们开始前的哪个init过程，通过observer (value) 方法，然后通过defineReactive()方法遍历，对每个对象的每个属性进行setter和getter初始化。

2.依赖收集：我们在闭包中增加了一个 Dep 类的对象，用来收集 Watcher 对象。在对象被「读」的时候，会触发 reactiveGetter 函数把当前的 Watcher 对象，收集到 Dep 类中去。之后如果当该对象被「写」的时候，则会触发 reactiveSetter 方法，通知 Dep 类调用 notify 来触发所有 Watcher 对象的 update 方法更新对应视图。

附加知识点：object.defineproperty()的缺点

我们知道vue响应式主要使用的是object.defineproperty()这个api，那他也会带来一些缺点：

需要深度监听，需要递归到底，一次性计算量大（比如引用类型层级较深）

无法监听新增属性/删除属性，需要使用Vue.set和Vue.delete才行
无法监听原生数组，需要重写数组方法
 四、虚拟dom

DOM操作非常耗时，所以使用VDOM，我们把计算转移为JS计算，
VDOM-用JS模拟DOM结构，计算出最小的变更，操作DOM
因为有了虚拟DOM，所以让Vue有了跨平台的能力

五、patch函数，diff算法上台

 ![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsgKfwp6R9qtZ4okX.png)

这部分涉及算法

前置知识：

insert：在父几点下插入节点，如果指定ref则插入道ref这个子节点的前面。
createElm：用来新建一些节点，tag节点存在创建一个标签节点，否则创建一个文本节点。
addVnodes：用来批量调用createElm新建节点。
removeNode：用来移除一个节点
removeVnodes：会批量调用removeNode移除节点
patch函数：

patch的核心就是diff算法，diff算法通过同层的树节点进行比较而非对树进行逐层搜索遍历的方式，所以时间复杂度只有o(n)，比较高效，我们看下图所示：

 ![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs9Sz7lEO5gQjtpi2.png)

我们看下patch这个函数的demo:

```js
 1 function patch (oldVnode, vnode, parentElm) {
 2     if (!oldVnode) {
 3         addVnodes(parentElm, null, vnode, 0, vnode.length - 1);
 4     } else if (!vnode) {
 5         removeVnodes(parentElm, oldVnode, 0, oldVnode.length - 1);
 6     } else {
 7         if (sameVnode(oldVNode, vnode)) {
 8             patchVnode(oldVNode, vnode);
 9         } else {
10             removeVnodes(parentElm, oldVnode, 0, oldVnode.length - 1);
11             addVnodes(parentElm, null, vnode, 0, vnode.length - 1);
12         }
13     }
14 }
```


首先在 oldVnode（老 VNode 节点）不存在的时候，相当于新的 VNode 替代原本没有的节点，所以直接用 addVnodes 将这些节点批量添加到 parentElm 上。
如果 vnode（新 VNode 节点）不存在的时候，相当于要把老的节点删除，所以直接使用 removeVnodes 进行批量的节点删除即可。
当 oldVNode 与 vnode 都存在的时候，需要判断它们是否属于 sameVnode（相同的节点）。如果是则进行patchVnode（比对 VNode ）操作，否则删除老节点，增加新节点 
patchVnode函数:

我们看下关键代码

```js
 1 function patchVnode (oldVnode, vnode) {
 2     // 新老节点相同，直接return
 3     if (oldVnode === vnode) {
 4         return;
 5     }
 6     // 节点是否静态，并且新老接待你的key相同，只要把老节点拿来用就好了
 7     if (vnode.isStatic && oldVnode.isStatic && vnode.key === oldVnode.key) {
 8         vnode.elm = oldVnode.elm;
 9         vnode.componentInstance = oldVnode.componentInstance;
10         return;
11     }
12  
13     const elm = vnode.elm = oldVnode.elm;
14     const oldCh = oldVnode.children;
15     const ch = vnode.children;
16     // 当VNode是文本节点，直接setTextContent来设置text
17     if (vnode.text) {
18         nodeOps.setTextContent(elm, vnode.text);
19     // 不是文本节点
20     } else {
21         // oldch(老)与ch(新)存在且不同，使用updateChildren()
22         if (oldCh && ch && (oldCh !== ch)) {
23             updateChildren(elm, oldCh, ch);
24         // 只有ch存在，若oldch(老)节点是文本节点，先删除，再将ch(新)节点插入elm节点下
25         } else if (ch) {
26             if (oldVnode.text) nodeOps.setTextContent(elm, '');
27             addVnodes(elm, null, ch, 0, ch.length - 1);
28         // 同理当只有oldch(老)节点存在，说明需要将oldch(老)节点通过removeVnode全部删除
29         } else if (oldCh) {
30             removeVnodes(elm, oldCh, 0, oldCh.length - 1)
31         // 当老节点是文本节点，清除其节点内容
32         } else if (oldVnode.text) {
33             nodeOps.setTextContent(elm, '')
34         }
35     }
36 }
```


整理如下：

新老节点相同，直接return
节点是否静态，并且新老接待你的key相同，只要把老节点拿来用就好了
当VNode是文本节点，直接setTextContent来设置text，若不是文本节点者执行4-7
oldch(老)与ch(新)存在且不同，使用updateChildren()（后面介绍）
只有ch存在，若oldch(老)节点是文本节点，先删除，再将ch(新)节点插入elm节点下
同理当只有oldch(老)节点存在，说明需要将oldch(老)节点通过removeVnode全部删除
当老节点是文本节点，清除其节点内容
updateChildren函数

下面是关键代码：

 ![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsSwqaBmjKc9NxPIA.png)

直接看我的代码注释吧！

```js
 1 // sameVnode() 就是说key，tag，iscomment(注释节点)，data四个同时定义
 2 while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
 3   if (!oldStartVnode) {
 4       oldStartVnode = oldCh[++oldStartIdx];
 5   } else if (!oldEndVnode) {
 6       oldEndVnode = oldCh[--oldEndIdx];
 7   // 老节点的开头与新节点的开头对比
 8   } else if (sameVnode(oldStartVnode, newStartVnode)) {
 9       patchVnode(oldStartVnode, newStartVnode);
10       oldStartVnode = oldCh[++oldStartIdx];
11       newStartVnode = newCh[++newStartIdx];
12   // 老节点的结尾与新节点的结尾对比
13   } else if (sameVnode(oldEndVnode, newEndVnode)) {
14       patchVnode(oldEndVnode, newEndVnode);
15       oldEndVnode = oldCh[--oldEndIdx];
16       newEndVnode = newCh[--newEndIdx];
17   // 老节点的开头与新节点的结尾
18   } else if (sameVnode(oldStartVnode, newEndVnode)) {
19       patchVnode(oldStartVnode, newEndVnode);
20       nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
21       oldStartVnode = oldCh[++oldStartIdx];
22       newEndVnode = newCh[--newEndIdx];
23   // 老节点的结尾与新节点的开头
24   } else if (sameVnode(oldEndVnode, newStartVnode)) {
25       patchVnode(oldEndVnode, newStartVnode);
26       nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
27       oldEndVnode = oldCh[--oldEndIdx];
28       newStartVnode = newCh[++newStartIdx];
29   // 如果上面的情况都没有满足
30   } else {
31       // 把老的元素进行移动
32       let elmToMove = oldCh[idxInOld];
33       // 如果老的节点找不到对应索引则创建
34       if (!oldKeyToIdx) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
35       // 在新节点中的key值找到老节点索引
36       idxInOld = newStartVnode.key ? oldKeyToIdx[newStartVnode.key] : null;
37       // 如果没有找到相同的节点，则通过 createElm 创建一个新节点，并将 newStartIdx 向后移动一位。
38       if (!idxInOld) {
39           createElm(newStartVnode, parentElm);
40           newStartVnode = newCh[++newStartIdx];
41       // 否则如果找到了节点，同时它符合 sameVnode，则将这两个节点进行 patchVnode，将该位置的老节点赋值 undefined
42       } else {
43           // 这是是想把相同的节点进行移动
44           elmToMove = oldCh[idxInOld];
45           // 然后再进行对比
46           if (sameVnode(elmToMove, newStartVnode)) {
47               patchVnode(elmToMove, newStartVnode);
48               oldCh[idxInOld] = undefined;
49               nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm);
50               newStartVnode = newCh[++newStartIdx];
51               // 如果不符合 sameVnode，只能创建一个新节点插入到 parentElm 的子节点中，newStartIdx 往后移动一位。
52           } else {
53               createElm(newStartVnode, parentElm);
54               newStartVnode = newCh[++newStartIdx];
55           }
56       }
57   }
58 }
59 // 当oldStartIdx > oldEndIdx 或oldStartIdx> oldEndIdx说明结束
60 if (oldStartIdx > oldEndIdx) {
61   refElm = (newCh[newEndIdx + 1]) ? newCh[newEndIdx + 1].elm : null;
62   addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx);
63 } else if (newStartIdx > newEndIdx) {
64   removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
65 }
66 }
```


上面涉及了很多东西，也不是一时半会能够讲完的，看代码的过程也挺艰辛的！

**最后总结下渲染过程**

初次渲染：

解析模板为render函数(或再开发环境已完成)
触发响应式，监听data属性的getter的依赖收集，也即是往dep里面添加watcher的过程
执行render函数，生成vnode，patch
更新过程:

修改data，setter(必需是初始渲染已经依赖过的)调用Dep.notify()，将通知它内部的所有的Watcher对象进行视图更新
重新执行rendern函数，生成newVnode
然后就是patch的过程(diff算法)



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

`template` 会被编译成 `render` 函数，然后会根据 `render` 函数创建对应的 VNode，最后再由 VNode 渲染成真实的 DOM 在页面上

### 21.vue-cli实现原理

[精简版](https://juejin.cn/post/6844904041823240205)

献上源码地址： [源码](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMasonEast%2Fmasoneast-cli)

```js
$ npm i masoneast-cli -g
$ masoneast init my-project
```

现在， 我们一起来了解下`vue-cli`到底帮我们做了什么，让我们可以一行命令就可以生成一个工程吧！

#### 整体流程

我们先了解下如何使用`vue-cli`， 再详细讲解每一步的实现。

`vue-cli`提供了多种模板， 我们这里以`webpack`模板为例。

- 安装: `npm install vue-cli -g`
- 使用：
  1. 直接下载使用： `vue init webpack my-project`
  2. 离线使用： `vue init webpack my-projiect --offline`
  3. clone使用： `vue init webpack my-projiect --clone`

这样， 我们就能在当前目录下得到一个vue的初始工程了。

当我们使用`vue-cli`时， 其实依赖了两个东西： 一个是`vue-cli`命令行， 一个是`vue-template`模板， 用于生成工程。

#### 流程：

1. 当我们**全局安装了`vue-cli`后**， 会注册环境变量，生成软连接， 这样我们在命令行中任意路径就可以使用该命令了。
2. 当我们**敲下`vue init webpack my-project`时**， `vue-cli`会提示你正在下载模板。

此时， `vue-cli`就是从github托管的代码中`download`对应的`webpack`模板。 对应的webpack模板的git地址在这里： [webpack模板](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fvuejs-templates%2Fwebpack)

拼接url代码是这段：

```
function getUrl (repo, clone) {
    var url

    // Get origin with protocol and add trailing slash or colon (for ssh)
    var origin = addProtocol(repo.origin, clone)
    if (/^git\@/i.test(origin))
        origin = origin + ':'
    else
        origin = origin + '/'

    // Build url
    if (clone) {
        url = origin + repo.owner + '/' + repo.name + '.git'
    } else {
        if (repo.type === 'github')
            url = origin + repo.owner + '/' + repo.name + '/archive/' + repo.checkout + '.zip'
        else if (repo.type === 'gitlab')
            url = origin + repo.owner + '/' + repo.name + '/repository/archive.zip?ref=' + repo.checkout
        else if (repo.type === 'bitbucket')
            url = origin + repo.owner + '/' + repo.name + '/get/' + repo.checkout + '.zip'
    }

    return url
}
```

1. **当模板下载完毕后**， `vue-cli`会将它放在你的本地，方便你以后离线使用它生成项目， 路径是`/Users/xxx/.vue-templates`， 如果你之前有使用`vue-cli`生成过项目， 应该在你的管理员路径下能找到对应的`.vue-templates`文件夹。里面的webpack文件就和上面git地址里的代码一模一样。

**注意：** .开头的文件夹默认是隐藏的， 你需要让它展示出来才能看到。

1. **询问交互**



![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsimgs9MhlgVd6PuGSIY2.webp)



接下， `vue-cli`会问你一堆问题， 你回答的这些问题它会将它们的答案存起来， 在接下来的生成中， 会根据你的答案来渲染生成对应的文件。

1. **文件筛选**

在你回答完问题后， `vue-cli`就会根据你的需求从webpack模板中筛选出无用的文件， 并删除， 它不是从你本地删除， 只是在给你生成的项目中删除这些文件。

1. **模板渲染**

在模板中， 你的`src/App.vue`长这样：

```
<template>
  <div id="app">
    <img src="./assets/logo.png">
    {{#router}}
    <router-view/>
    {{else}}
    <HelloWorld/>
    {{/router}}
  </div>
</template>

<script>
{{#unless router}}
import HelloWorld from './components/HelloWorld'

{{/unless}}
export default {
  name: 'App'{{#router}}{{else}},
  components: {
    HelloWorld
  }{{/router}}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

如果在选择是否需要路由， 你选是，那最后生成在你的项目的`App.vue`长这样：

```
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

它会根据你的要求，渲染出不同的文件给你。

1. **文件生成**

在完成渲染后， 接下来就会在你当前目录下生成对应的文件了， 至此， `vue-cli`的工作就完成了。

#### 动手实现

搞明白了`vue-cli`的工作原理， 我们完全可以自己做一个简单点的cli出来了。

##### 命令注册

通过`npm init`生成你的`package.json`文件, 在里面加入bin

```
  "bin": {
    "xxx": "bin/index.js"
  },
```

这样， 当你全局装包的时候才会把你`xxx`命令注册到环境变量中。

接下来就是`bin/index.js`的事了。

##### 使用`commander`完成命令行中的命令

```
program
   .command('init [project-name]')
   .description('create a project')
   .option("-c, --clone", `it will clone from ${tmpUrl}`)
   .option('--offline', 'use cached template')
   .action(function (name, options) {
       console.log('we are try to create "%s"....', name);
       downloadAndGenerate(name, options)
   }).on('--help', function () {
       console.log('');
       console.log('Examples:');
       console.log('');
       console.log('  $ masoneast init my-project');
       console.log(`  $ path: ${home}`);
   });

program.parse(process.argv)
```

通过上面代码， 你就有了`init`命令， 和`clone`, `offline`参数了， 此时你就有了：

```
$ masoneast init my-project
$ masoneast init my-project --clone
$ masoneast init my-project --offline
```

关于`commander`包的具体使用， 可以看这里： [commander](https://link.juejin.cn?target=)

##### 实现下载和clone模板

这里你需要有有个模板的地址供你下载和clone， 如果你只是玩玩的话也可以直接使用`vue`提供的模板地址， 或者我的模板地址： [模板](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMasonEast%2Fmasoneast-template)

下载实现代码：

这里依赖了两个库: `git-clone`和`download`。

```
function download (name, clone, fn) {
    if (clone) {
        gitclone(tmpUrl, tmpPath, err => {
            if (err) fn(err)
            rm(tmpPath + '/.git')
            fn()
        })
    } else {
        const url = tmpUrl.replace(/\.git*/, '') + '/archive/master.zip'
        console.log(url)
        downloadUrl(url, tmpPath, { extract: true, strip: 1, mode: '666', headers: { accept: 'application/zip' } })
            .then(function (data) {
                fn()
            })
            .catch(function (err) {
                fn(err)
            })
    }
}
```

##### 实现询问交互

交互的实现， 主要依赖了`inquirer`库。

```
function askQuestion (prompts) {                    //询问交互
    return (files, metalsmith, done) => {
        async.eachSeries(Object.keys(prompts), (key, next) => {
            prompt(metalsmith.metadata(), key, prompts[key], next)
        }, done)
    }
}
```

将询问得到的答案存贮起来， 留给后面渲染使用

```
function prompt (data, key, prompt, done) {                    //将用户操作存储到metaData中
    inquirer.prompt([{
        type: prompt.type,
        name: key,
        message: prompt.message || prompt.label || key,
        default: prompt.default,
        choices: prompt.choices || [],
        validate: prompt.validate || (() => true)
    }]).then(answers => {
        if (Array.isArray(answers[key])) {
            data[key] = {}
            answers[key].forEach(multiChoiceAnswer => {
                data[key][multiChoiceAnswer] = true
            })
        } else if (typeof answers[key] === 'string') {
            data[key] = answers[key].replace(/"/g, '\\"')
        } else {
            data[key] = answers[key]
        }
        done()
    }).catch(done)
}
```

##### 实现模板渲染

模板渲染， 依赖了前端模板引擎`handlebar`和解析模板引擎的`consolidate`库。 上面看到的`vue-template`模板里的`{{#router}}`其实就是`handlebar`的语法。

```
function renderTemplateFiles () {

    return (files, metalsmith, done) => {

        const keys = Object.keys(files)
        const metalsmithMetadata = metalsmith.metadata()            //之前用户操作后的数据存在这里面
        async.each(keys, (file, next) => {                          //对模板进行遍历， 找到需要渲染内容的文件
            const str = files[file].contents.toString()
            if (!/{{([^{}]+)}}/g.test(str)) {                       //正则匹配文件内容， 如果没有就不需要修改文件， 直接去往下一个
                return next()
            }
            render(str, metalsmithMetadata, (err, res) => {
                if (err) {
                    err.message = `[${file}] ${err.message}`
                    return next(err)
                }
                files[file].contents = new Buffer(res)
                next()
            })
        }, done)
    }
}
```

##### 实现将文件从本地写到你的项目目录中

这里用到了一个核心库： `metalsmith`。它主要功能就是读取你的文件， 并通过一系列的中间件对你的文件进行处理， 然后写到你想要的路径中去。就是通过这个库， 将我们的各个流程串联起来， 实现对模板的改造， 写出你想要的项目。

```
    metalsmith.use(askQuestion(options.prompts))                            //这一段是generator的精华， 通过各种中间件对用户选择的模板进行处理
        .use(filterFiles(options.filters))                                  //文件筛选过滤
        .use(renderTemplateFiles())                                         //模板内部变量渲染
        .source('.')
        .destination(projectPath)                                            //项目创建的路径
        .build((err, files) => {
            if (err) console.log(err)

        })
```

##### 后话

我这里实现的demo就是`vue-cli`的精简版， 主要功能有：

- 1. 从git上download和clone项目模板
- 1. 保存模板到本地，方便离线使用
- 1. 询问问题， 按用户需求定制模板

`vue-cli`还有有很多的容错判断， 以及其他模板， 下载源等的切换我这里都没有做处理了。



### 22.render函数使用

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsRdTW6LmoK5j8wBx.webp)



在了解vue render函数之前, 需要先了解下Vue的整体流程(如上图)

通过上图, 应该可以理解一个Vue组件是如何运行起来的.

- 模板通过编译生成AST树
- AST树生成Vue的render渲染函数
- render渲染函数结合数据生成vNode(Virtual DOM Node)树
- Diff和Patch后生新的UI界面(真实DOM渲染)

在这张图中, 我们需要了解以下几个概念:

- 模板, Vue模板是纯HTML, 基于Vue的模板语法, 可以比较方便的处理数据和UI界面的关系
- AST, 即Abstract Syntax Tree的简称, Vue将HTML模板解析为AST,并对AST进行一些优化的标记处理, 提取最大的静态树,以使Virtual DOM直接跳过后面的Diff
- render渲染函数, render渲染函数是用来生成Virtual DOM的. Vue推荐使用模板来构建我们的应用程序, 在底层实现中Vue最终还是会将模板编译成渲染函数. 因此, 若我们想要得到更好的控制, 可以直接写渲染函数.(**重点**)
- Virtual DOM, 虚拟DOM
- Watcher, 每个Vue组件都有一个对应的`watcher`, 它会在组件`render`时收集组件所依赖的数据, 并在依赖有更新时, 触发组件重新渲染, Vue会自动优化并更新需要更新DOM

在上图中, `render`函数可以作为一道分割线:

- `render`函数左边可以称为**编译期**, 将Vue板转换为渲染函数
- `render`函数右边, 是Vue运行时, 主要是将渲染函数生成Virtual DOM树, 以及Diff和Patch

#### render渲染组件

Vue 推荐在绝大多数情况下使用模板来创建你的 HTML。然而在一些场景中，你真的需要 JavaScript 的完全编程的能力。这时你可以用渲染函数，它比模板更接近编译器。

这个例子里 `render` 函数很实用。假设我们要生成一些带锚点的标题：

```js
<h1>
  <a name="hello-world" href="#hello-world">
    Hello world!
  </a>
</h1>
```

对于上面的 HTML，你决定这样定义组件接口：

```js
<anchored-heading :level="1">Hello world!</anchored-heading>
```

当开始写一个只能通过 `level` prop 动态生成标题 (heading) 的组件时，你可能很快想到这样实现：

```js
<script type="text/x-template" id="anchored-heading-template">
  <h1 v-if="level === 1">
    <slot></slot>
  </h1>
  <h2 v-else-if="level === 2">
    <slot></slot>
  </h2>
  <h3 v-else-if="level === 3">
    <slot></slot>
  </h3>
  <h4 v-else-if="level === 4">
    <slot></slot>
  </h4>
  <h5 v-else-if="level === 5">
    <slot></slot>
  </h5>
  <h6 v-else-if="level === 6">
    <slot></slot>
  </h6>
</script>
Vue.component('anchored-heading', {
  template: '#anchored-heading-template',
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

这里用模板并不是最好的选择：不但代码冗长，而且在每一个级别的标题中重复书写了 `<slot></slot>`，在要插入锚点元素时还要再次重复。

虽然模板在大多数组件中都非常好用，但是显然在这里它就不合适了。那么，我们来尝试使用 `render` 函数重写上面的例子：

```js
Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // 标签名称
      this.$slots.default // 子节点数组
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

#### Node & tree & Virtual DOM

HTML代码:

```xml
<div>
    <h1>My title</h1>
    Some text content
    <!-- TODO: Add tagline -->
</div>

```

当浏览器读取到这些代码时, 它会建立一个[DOM节点树](https://link.juejin.cn?target=https%3A%2F%2Fjavascript.info%2Fdom-nodes)来保持追踪, 如果你要画一张家谱树来追踪家庭成员的发展的话, HTML的DOM节点树的可能如下图所示:



![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsyZqHADgsTkrjdLO.webp)



每个**元素**和**文字**都是一个节点, 甚至注释也是节点. 一个节点就是页面的一部分, 就像家谱树中一样, 每个节点都可以有孩子节点.

高效的更新所有节点可能是比较困难的, 不过你不用担心, 这些Vue都会自动帮你完成, 你只需要通知Vue页面上HTML是什么?

可以是一个HTML模板, 例如:

```css
<h1>{{title}}</h1>
```

也可以是一个渲染函数:

```javascript
render(h){
  return h('h1', this.title)
}
```

在这两种情况下，若`title`值发生了改变, Vue 都会自动保持页面的更新.

#### 虚拟DOM

Vue编译器在编译模板之后, 会将这些模板编译为渲染函数(render), 当渲染函数(render)被调用时, 就会返回一个虚拟DOM树.

当我们得到虚拟DOM树后, 再转交给一个**Patch函数**, 它会负责把这些虚拟DOM渲染为真实DOM. 在这个过程中, Vue自身的响应式系统会侦测在渲染过程中所依赖的数据来源, 在渲染过程中, 侦测到数据来源后即可精确感知数据源的变动, 以便在需要的时候重新进行渲染. 当重新进行渲染之后, 会生成一个新的树, 将新的树与旧的树进行对比, 就可以得到最终需要对真实DOM进行修改的改动点, 最后通过Patch函数实施改动.

简单来讲, 即: 在Vue的底层实现上，Vue将模板编译成虚拟DOM渲染函数。结合Vue自带的响应系统，在应该状态改变时，Vue能够智能地计算出重新渲染组件的最小代价并应到DOM操作上。

Vue支持我们通过`data`参数传递一个JavaScript对象作为组件数据, Vue将遍历data对象属性, 使用`Object.defineProperty`方法设置描述对象, 通过`gett/setter`函数来拦截对该属性的读取和修改.

Vue创建了一层`Watcher`层, 在组件渲染的过程中把属性记录为依赖, 当依赖项的`setter`被调用时, 会通知`Watcher`重新计算, 从而使它关联的组件得以更新.

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgstRAXZKzB6hrYju8.webp)





通过前面的学习, 我们初步了解到Vue通过建立一个**虚拟DOM"对真实DOM发生变化保持追踪. 例如

```kotlin
return createElement('h1', this.title)
```

`createElement`, 即`createNodeDescription`, 返回虚拟节点(Virtual Node), 通常简写为"VNode". 虚拟DOM是由Vue组件树建立起来的整个VNode树的总称.

Vue组件树建立起来的整个VNode树是唯一的, 不可重复的. 例如, 下面的render函数是无效的.

```javascript
render(createElement) {
  const vP = createElement('p', 'hello james')
  return createElement('div', [
    // error, 有重复的vNode
    vP, vP
  ])
}
```

若需要很多重复的组件/元素, 可以使用工厂函数来实现. 例如:

```javascript
render(createElement){
  return createElement('div', Array.apply(null, {length: 20}).map(() => {
    return createElement('p', 'hi james')
  }))
}
```

#### Vue 渲染机制

下图展示的是独立构建时, 一个组件的渲染流程图:



![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs4R8GYfyKgCltSzb.webp)



会涉及到Vue的2个概念:

- 独立构建, 包含模板编译器, 渲染过程: HTML字符串 => render函数 => vNode => 真实DOM
- 运行时构建, 不包含模板编译器, 渲染过程: render函数 => vNode => 真实DOM

运行时构建的包, 会比独立构建少一个模板编译器(因此运行速度上会更快). 在`$mount`函数上也不同, 而`$mount`方法是整个渲染过程中的起始点, 用下面这张流程图来说明:



![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs3MULJGrseoOEAXa.webp)



从上图可以看出, 在渲染过程中, 提供了三种模板:

- 自定义render函数
- template
- el

均可以渲染页面, 也就对应我们使用Vue时的三种写法. 这3种模式最终都是要得到`render`函数.

对于平时开发来讲, 使用template和el会比较友好些, 容易理解, 但灵活性较差. 而render函数, 能够胜任更加复杂的逻辑, 灵活性高, 但对于用户理解相对较差.

##### 自定义render函数

```js
Vue.component('anchored-heading', {
    render(createElement) {
        return createElement (
            'h' + this.level,   
            this.$slots.default 
        )
    },
    props: {
        level: {
            type: Number,
            required: true
        }
    }
})
```

##### template写法

```js
const app = new Vue({
    template: `<div>{{ msg }}</div>`,
    data () {
        return {
            msg: 'Hello Vue.js!'
        }
    }
})
```

##### el写法

```js
let app = new Vue({
    el: '#app',
    data () {
        return {
            msg: 'Hello Vue!'
        }
    }
})
```

#### vue的h函数

在vue脚手架中，我们经常会看到这样一段代码：

```javascript
  const app = new Vue({
    ··· ···
    render: h => h(App)
  })
```

这个render方法也可以写成这样：

```javascript
  const app = new Vue({
    ··· ···
    render:function(createElement){
        return createElment(App)
    }
  })
```

**h函数就是vue中的createElement方法，这个函数作用就是创建虚拟dom，追踪dom变化**

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs20190715150357696.png)

**上边代码：最终html代码会被编译成h函数的渲染形式。返回的是一个虚拟DOM对象，通过diff算法，来追踪自己要如何改变真实DOM**

```js
function h(tag,props,...children){//h函数，返回一个虚拟dom对象
    return {
        tag,
        props:props || {},
        children:children.flat()//扁平化数组，降至一维数组
    }
}
```

**createElement函数，它返回的实际上不是一个DOM元素，更准确的名字是：createNodeDescription（直译为——创建节点描述），因为它所包含的信息会告诉vue页面上需要渲染什么样的节点，包括其子节点的描述信息**

#### 理解&使用render函数

render 函数即渲染函数，它接收一个`createElement` 方法作为第一个参数用来创建 `VNode`。（简单的说就是 render函数的参数也是一个函数）

createElement也是一个函数，它接受三个参数

-   【必填】一个 HTML **标签**名、**组件**选项对象，或者resolve 了上述任何一种的一个 async 函数。`类型：{String | Object | Function}`
-   【可选】一个与模板中 attribute 对应的数据对象。 `类型:{Object}`
-   【可选】子级虚拟节点 (VNodes) `类型：{String | Array}`

将 `h` 作为 `createElement` 的别名是 Vue 生态系统中的一个通用惯例

![image-20220403211335766](https://s2.loli.net/2022/04/03/4jENmaDQyK1YWVu.png)

在vue-cli生成的项目中

vue-template-complier  可以将template转换成  withIthis){  return h('p',[...])  }  

![DOM的流程图 (1).png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsPWVyCU5BtrkQKjS.webp)

#### createElement 参数

`createElement`可以接受多个参数

##### 第1个参数: `{String | Object | Function }`, 必传

第一个参数是必传参数, 可以是字符串`String`, 也可以是`Object`对象或函数`Function`

```javascript
// String
Vue.component('custom-element', {
    render(createElement) {
        return createElement('div', 'hello world!')
    }
})
// Object
Vue.component('custom-element', {
    render(createElement) {
        return createElement({
          template: `<div>hello world!</div>`
        })
    }
})
// Function
Vue.component('custom-element', {
    render(createElement) {
      const elFn = () => { template: `<div>hello world!</div>` }
      return createElement(elFn())
    }
})
```

以上代码, 等价于:

```xml
<template>
  <div>hello world!</>
</template>
<script>
  export default {
    name: 'custom-element'
  }
</script>
```

##### 第2个参数: `{ Object }`, 可选

`createElemen`的第二个参数是可选参数, 这个参数是一个Object, 例如:

```php
Vue.component('custom-element', {
  render(createElement) {
    const self = this;
    return createElement('div', {
      'class': {
        foo: true,
        bar: false
      },
      style: {
        color: 'red',
        fontSize: '18px'
      },
      attrs: {
        ...self.attrs,
        id: 'id-demo'
      },
      on: {
        ...self.$listeners,
        click: (e) => {console.log(e)}
      },
      domProps: {
        innerHTML: 'hello world!'
      },
      staticClass: 'wrapper'
    })
  }
})
```

等价于:

```xml
<template>
  <div :id="id" class="wrapper" :class="{'foo': true, 'bar': false}" :style="{color: 'red', fontSize: '18px'}" v-bind="$attrs" v-on="$listeners" @click="(e) => console.log(e)"> hello world! </div>
</template>
<script>
export default {
  name: 'custom-element',
  data(){
    return {
      id: 'id-demo'
    }
  }
}
</script>

<style>
.wrapper{
  display: block;
  width: 100%;
}
</style>
复制代码
```

##### 第3个参数: `{ String | Array }`, 可选

`createElement`第3个参数是可选的，可以给其传一个`String`或`Array`, 例如:

```js
Vue.component('custom-element', {
    render (createElement) {
        var self = this
        return createElement(
            'div',
            {
                class: {
                    title: true
                },
                style: {
                    border: '1px solid',
                    padding: '10px'
                }
            }, 
            [
                createElement('h1', 'Hello Vue!'),
                createElement('p', 'Hello world!')
            ]
        )
    }
})
```

等价于:

```js
<template>
  <div :class="{'title': true}" :style="{border: '1px solid', padding: '10px'}">
    <h1>Hello Vue!</h1>
    <p>Hello world!</p>
  </div>
</template>
<script>
export default {
  name: 'custom-element',
  data(){
    return {
      id: 'id-demo'
    }
  }
}
</script>
```

##### 使用template和render创建相同效果的组件

template方式

```xml
<template>
  <div id="wrapper" :class="{show: show}" @click="clickHandler">
    Hello Vue!
  </div>
</template>
<script>
export default {
  name: 'custom-element',
  data(){
    return {
      show: true
    }
  },
  methods: {
    clickHandler(){
      console.log('you had click me!');
    }
  }
}
</script>
```

render方式

```php
Vue.component('custom-element', {
      data () {
        return {
            show: true
        }
      },
      methods: {
          clickHandler: function(){
            console.log('you had click me!');
          }
      },
      render: function (createElement) {
          return createElement('div', {
              class: {
                show: this.show
              },
              attrs: {
                id: 'wrapper'
              },
              on: {
                click: this.handleClick
              }
          }, 'Hello Vue!')
      }
})
```

#### createElement解析过程

createElement解析流程图

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgscAN4GmIKa7wFWbp.webp)



[`createElement`解析过程核心源代码](https://segmentfault.com/a/1190000008291645)

```scss
const SIMPLE_NORMALIZE = 1
const ALWAYS_NORMALIZE = 2

function createElement (context, tag, data, children, normalizationType, alwaysNormalize) {

    // 兼容不传data的情况
    if (Array.isArray(data) || isPrimitive(data)) {
        normalizationType = children
        children = data
        data = undefined
    }

    // 如果alwaysNormalize是true
    // 那么normalizationType应该设置为常量ALWAYS_NORMALIZE的值
    if (alwaysNormalize) normalizationType = ALWAYS_NORMALIZE
        // 调用_createElement创建虚拟节点
        return _createElement(context, tag, data, children, normalizationType)
    }

    function _createElement (context, tag, data, children, normalizationType) {
        /**
        * 如果存在data.__ob__，说明data是被Observer观察的数据
        * 不能用作虚拟节点的data
        * 需要抛出警告，并返回一个空节点
        * 
        * 被监控的data不能被用作vnode渲染的数据的原因是：
        * data在vnode渲染过程中可能会被改变，这样会触发监控，导致不符合预期的操作
        */
        if (data && data.__ob__) {
            process.env.NODE_ENV !== 'production' && warn(
            `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
            'Always create fresh vnode data objects in each render!',
            context
            )
            return createEmptyVNode()
        }

        // 当组件的is属性被设置为一个falsy的值
        // Vue将不会知道要把这个组件渲染成什么
        // 所以渲染一个空节点
        if (!tag) {
            return createEmptyVNode()
        }

        // 作用域插槽
        if (Array.isArray(children) && typeof children[0] === 'function') {
            data = data || {}
            data.scopedSlots = { default: children[0] }
            children.length = 0
        }

        // 根据normalizationType的值，选择不同的处理方法
        if (normalizationType === ALWAYS_NORMALIZE) {
            children = normalizeChildren(children)
        } else if (normalizationType === SIMPLE_NORMALIZE) {
            children = simpleNormalizeChildren(children)
        }
        let vnode, ns

        // 如果标签名是字符串类型
        if (typeof tag === 'string') {
            let Ctor
            // 获取标签名的命名空间
            ns = config.getTagNamespace(tag)

            // 判断是否为保留标签
            if (config.isReservedTag(tag)) {
                // 如果是保留标签,就创建一个这样的vnode
                vnode = new VNode(
                    config.parsePlatformTagName(tag), data, children,
                    undefined, undefined, context
                )

                // 如果不是保留标签，那么我们将尝试从vm的components上查找是否有这个标签的定义
            } else if ((Ctor = resolveAsset(context.$options, 'components', tag))) {
                // 如果找到了这个标签的定义，就以此创建虚拟组件节点
                vnode = createComponent(Ctor, data, context, children, tag)
            } else {
                // 兜底方案，正常创建一个vnode
                vnode = new VNode(
                    tag, data, children,
                    undefined, undefined, context
                )
            }

        // 当tag不是字符串的时候，我们认为tag是组件的构造类
        // 所以直接创建
        } else {
            vnode = createComponent(tag, data, context, children)
        }

        // 如果有vnode
        if (vnode) {
            // 如果有namespace，就应用下namespace，然后返回vnode
            if (ns) applyNS(vnode, ns)
            return vnode
        // 否则，返回一个空节点
        } else {
            return createEmptyVNode()
        }
    }
}
```

Vue渲染中, 核心关键的几步是:

- `new Vue`, 执行初始化
- 挂载`$mount`, 通过自定义`render`方法, `template`, `el`等生成`render`渲染函数
- 通过`Watcher`监听数据的变化
- 当数据发生变化时, `render`函数执行生成VNode对象
- 通过`patch`方法, 对比新旧VNode对象, 通过`DOM Diff`算法, 添加/修改/删除真正的DOM元素

至此, 整个`new Vue`渲染过程完成.




#### render函数触发过程

[第一次挂载和每次数据更新都会触发render函数](https://www.zhihu.com/question/406811368)

在vue内部的$mount方法里（$mount为Vue处理mount相关的方法），调用了mountComponent方法

在mountComponent内，可以发现两点：

**1.定义了updateComponent函数**，updateComponent调用了vm._render()。vm._render()内会调用this.$options.render。

2.**将updateComponent函数传给实例化的Watcher。**

传给了watcher之后，只要有任何数据等变化，那么watcher就会调用updateComponent函数，之后render就会被调用。

### 23.new Vue发生了什么

[原理](https://juejin.cn/post/6997776616294187015)

![5f17cedf4e974df89fb807ff961ae00b](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs75EQRtOALMcUkC2.png)

#### 初始化及挂载

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsGtsq3B1RCFEcgAT.png)

在 `new Vue()` 之后。 Vue 会调用 `_init` 函数进行初始化，也就是这里的 `init` 过程，它会初始化生命周期、事件、 props、 methods、 data、 computed 与 watch 等。其中最重要的是通过 `Object.defineProperty` 设置 `setter` 与 `getter` 函数，用来实现「**响应式**」以及「**依赖收集**」，后面会详细讲到，这里只要有一个印象即可。

初始化之后调用 `$mount` 会挂载组件，如果是运行时编译，即不存在 render function 但是存在 template 的情况，需要进行「**编译**」步骤。

```js
new Vue({
    el:'#app',
    store,
    router,
    render: h => h(App)
})
```

new Vue()是创建Vue实例，而Vue是一个类，当执行 new Vue()的时候，它的内部主要是执行了一个`_init`私有函数

```jsx
// 从源码可以看到vue类中非常干净，只是执行了一个_init私有函数, 并且只能通过new关键字初始化
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```

 看下 `_init`私有函数内部，这个函数主要是做了一堆初始化工作，比如对options进行合并，初始化生命周期，初始化事件中心，初始化渲染，初始化data,props,computed,watcher等，最后调用 vm.$mount做挂载

```tsx
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
```

#### 编译

compile编译可以分成 `parse`、`optimize` 与 `generate` 三个阶段，最终需要得到 render function。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgstoyDrG7Fz8IH5Mh.png)

##### parse

`parse` 会用正则等方式解析 template 模板中的指令、class、style等数据，形成AST。

##### optimize

`optimize` 的主要作用是标记 static 静态节点，这是 Vue 在编译过程中的一处优化，后面当 `update` 更新界面时，会有一个 `patch` 的过程， diff 算法会直接跳过静态节点，从而减少了比较的过程，优化了 `patch` 的性能。

##### generate

`generate` 是将 AST 转化成 render function 字符串的过程，得到结果是 render 的字符串以及 staticRenderFns 字符串。

在经历过 `parse`、`optimize` 与 `generate` 这三个阶段以后，组件中就会存在渲染 VNode 所需的 render function 了。

#### 响应式

接下来也就是 Vue.js 响应式核心部分。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsHNEGnT9c3Qqoz2F.png)

这里的 `getter` 跟 `setter` 已经在之前介绍过了，在 `init` 的时候通过 `Object.defineProperty` 进行了绑定，它使得当被设置的对象被读取的时候会执行 `getter` 函数，而在当被赋值的时候会执行 `setter` 函数。

当 render function 被渲染的时候，因为会读取所需对象的值，所以会触发 `getter` 函数进行「**依赖收集**」，「**依赖收集**」的目的是将观察者 Watcher 对象存放到当前闭包中的订阅者 Dep 的 subs 中。形成如下所示的这样一个关系。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgssxMCPi7qQw2ApmV.png)

在修改对象的值的时候，会触发对应的 `setter`， `setter` 通知之前「**依赖收集**」得到的 Dep 中的每一个 Watcher，告诉它们自己的值改变了，需要重新渲染视图。这时候这些 Watcher 就会开始调用 `update` 来更新视图，当然这中间还有一个 `patch` 的过程以及使用队列来异步更新的策略，这个我们后面再讲。

#### Virtual DOM

我们知道，render function 会被转化成 VNode 节点。Virtual DOM 其实就是一棵以 JavaScript 对象（ VNode 节点）作为基础的树，用对象属性来描述节点，实际上它只是一层对真实 DOM 的抽象。最终可以通过一系列操作使这棵树映射到真实环境上。由于 Virtual DOM 是以 JavaScript 对象为基础而不依赖真实平台环境，所以使它具有了跨平台的能力，比如说浏览器平台、Weex、Node 等。

比如说下面这样一个例子：

```
{
    tag: 'div',                 /*说明这是一个div标签*/
    children: [                 /*存放该标签的子节点*/
        {
            tag: 'a',           /*说明这是一个a标签*/
            text: 'click me'    /*标签的内容*/
        }
    ]
}
```

渲染后可以得到

```
<div>
    <a>click me</a>
</div>
```

这只是一个简单的例子，实际上的节点有更多的属性来标志节点，比如 isStatic （代表是否为静态节点）、 isComment （代表是否为注释节点）等。

#### 更新视图

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsAn3LVpCH1BESxjO.png)

前面我们说到，在修改一个对象值的时候，会通过 `setter -> Watcher -> update` 的流程来修改对应的视图，那么最终是如何更新视图的呢？

当数据变化后，执行 render function 就可以得到一个新的 VNode 节点，我们如果想要得到新的视图，最简单粗暴的方法就是直接解析这个新的 VNode 节点，然后用 `innerHTML` 直接全部渲染到真实 DOM 中。但是其实我们只对其中的一小块内容进行了修改，这样做似乎有些「**浪费**」。

那么我们为什么不能只修改那些「改变了的地方」呢？这个时候就要介绍我们的「**`patch`**」了。我们会将新的 VNode 与旧的 VNode 一起传入 `patch` 进行比较，经过 diff 算法得出它们的「**差异**」。最后我们只需要将这些「**差异**」的对应 DOM 进行修改即可。

#### 再看全局

<img src="https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsULjhe4DXv16xNl8.png" alt="img" style="zoom:50%;" />

### 24.Vue性能优化

#### 编码优化

##### 避免响应所有数据

不要将所有的数据都放到`data`中，`data`中的数据都会增加`getter`和`setter`，并且会收集`watcher`，这样还占内存，不需要响应式的数据我们可以直接定义在实例上。

```html
<template>
    <view>

    </view>
</template>

<script>
    export default {
        components: {},
        data: () => ({

        }),
        beforeCreate: function(){
            this.timer = null;
        }
    }
</script>

<style scoped>
</style>Copy to clipboardErrorCopied
```

##### 函数式组件

函数组是一个不包含状态和实例的组件，简单的说，就是组件不支持响应式，并且不能通过`this`关键字引用自己。因为函数式组件没有状态，所以它们不需要像`Vue`的响应式系统一样需要经过额外的初始化，这样就可以避免相关操作带来的性能消耗。当然函数式组件仍然会对相应的变化做出响应式改变，比如新传入新的`props`，但是在组件本身中，它无法知道数据何时发生了更改，因为它不维护自己的状态。很多场景非常适合使用函数式组件：

- 一个简单的展示组件，也就是所谓的`dumb`组件。例如`buttons`、`pills`、`tags`、`cards`等，甚至整个页面都是静态文本，比如`About`页面。
- 高阶组件，即用于接收一个组件作为参数，返回一个被包装过的组件。
- `v-for`循环中的每项通常都是很好的候选项。

##### 区分computed和watch使用场景

`computed`是计算属性，依赖其它属性值，并且`computed`的值有缓存，只有它依赖的属性值发生改变，下一次获取`computed`的值时才会重新计算`computed`的值。
`watch`更多的是观察的作用，类似于某些数据的监听回调，每当监听的数据变化时都会执行回调进行后续操作。
当我们需要进行数值计算，并且依赖于其它数据时，应该使用`computed`，因为可以利用`computed`的缓存特性，避免每次获取值时，都要重新计算。当我们需要在数据变化时执行异步或开销较大的操作时，应该使用`watch`，使用`watch`选项允许我们执行异步操作，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。

##### v-for添加key且避免同时使用v-if

- `v-for`遍历必须为`item`添加`key`，且尽量不要使用`index`而要使用唯一`id`去标识`item`，在列表数据进行遍历渲染时，设置唯一`key`值方便`Vue.js`内部机制精准找到该条列表数据，当`state`更新时，新的状态值和旧的状态值对比，较快地定位到`diff`。
- `v-for`遍历避免同时使用`v-if`，`v-for`比`v-if`优先级高，如果每一次都需要遍历整个数组，将会影响速度。

##### 区分v-if与v-show使用场景

- 实现方式: `v-if`是动态的向`DOM`树内添加或者删除`DOM`元素，`v-show`是通过设置`DOM`元素的`display`样式属性控制显隐。
- 编译过程: `v-if`切换有一个局部编译卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件，`v-show`只是简单的基于`CSS`切换。
- 编译条件: `v-if`是惰性的，如果初始条件为假，则什么也不做，只有在条件第一次变为真时才开始局部编译， `v-show`是在任何条件下都被编译，然后被缓存，而且`DOM`元素保留。
- 性能消耗: `v-if`有更高的切换消耗，`v-show`有更高的初始渲染消耗。
- 使用场景: `v-if`适合条件不太可能改变的情况，`v-show`适合条件频繁切换的情况。

##### 长列表性能优化

`Vue`会通过`Object.defineProperty`对数据进行劫持，来实现视图响应数据的变化，然而有些时候我们的组件就是纯粹的数据展示，不会有任何改变，我们就不需要`Vue`来劫持我们的数据，在大量数据展示的情况下，这能够很明显的减少组件初始化的时间，可以通过`Object.freeze`方法来冻结一个对象，一旦被冻结的对象就再也不能被修改了。对于需要修改的长列表的优化大列表两个核心，一个分段一个区分，具体执行分为：仅渲染视窗可见的数据、进行函数节流、 减少驻留的`VNode`和`Vue`组件，不使用显示的子组件`slot`方式，改为手动创建虚拟`DOM`来切断对象引用。

```javascript
export default {
  data: () => ({
      users: {}
  }),
  async created() {
      const users = await axios.get("/api/users");
      this.users = Object.freeze(users);
  }
};Copy to clipboardErrorCopied
```

##### 路由懒加载

`Vue`是单页面应用，可能会有很多的路由引入，这样使用`webpcak`打包后的文件很大，当进入首页时，加载的资源过多，页面会出现白屏的情况，不利于用户体验。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应的组件，这样就更加高效。对于`Vue`路由懒加载的方式有`Vue`异步组件、动态`import`、`webpack`提供的`require.ensure`，最常用的就是动态`import`的方式。

```javascript
{
  path: "/example",
  name: "example",
  //打包后，每个组件单独生成一个chunk文件
  component: () => import("@/views/example.vue")
}Copy to clipboardErrorCopied
```

##### 服务端渲染SSR

如果需要优化首屏加载速度并且首屏加载速度是至关重要的点，那么就需要服务端渲染`SSR`，服务端渲染`SSR`其实是优缺点并行的，需要合理决定是否真的需要服务端渲染。

##### 优点

- 更好的`SEO`，由于搜索引擎爬虫抓取工具可以直接查看完全渲染的页面，如果`SEO`对站点至关重要，而页面又是异步获取内容，则可能需要服务器端渲染`SSR`解决此问题。
- 更快的内容到达时间`time-to-content`，特别是对于缓慢的网络情况或运行缓慢的设备，无需等待所有的`JavaScript`都完成下载并执行，用户将会更快速地看到完整渲染的页面，通常可以产生更好的用户体验，并且对于那些内容到达时间`time-to-content`与转化率直接相关的应用程序而言，服务器端渲染`SSR`至关重要。

##### 缺点

- 开发条件所限，浏览器特定的代码，只能在某些生命周期钩子函数`lifecycle hook`中使用，一些外部扩展库`external library`可能需要特殊处理，才能在服务器渲染应用程序中运行。
- 涉及构建设置和部署的更多要求，与可以部署在任何静态文件服务器上的完全静态单页面应用程序`SPA`不同，服务器渲染应用程序，通常需要处于`Node.js server`运行环境。
- 更大的服务器端负载，在`Node.js`中渲染完整的应用程序，显然会比仅仅提供静态文件的`server`更加大量占用`CPU`资源`CPU-intensive`-`CPU`密集型，因此如果预料在高流量环境`high traffic`下使用，需要准备相应的服务器负载，并明智地采用缓存策略。

##### 使用keep-alive组件

当在组件之间切换的时候，有时会想保持这些组件的状态，以避免反复重渲染导致的性能等问题，使用`<keep-alive>`包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。重新创建动态组件的行为通常是非常有用的，但是在有些情况下我们更希望那些标签的组件实例能够被在它们第一次被创建的时候缓存下来，此时使用`<keep-alive>`包裹组件即可缓存当前组件实例，将组件缓存到内存，用于保留组件状态或避免重新渲染，和`<transition>`相似它，其自身不会渲染一个`DOM`元素，也不会出现在组件的父组件链中。

```html
<keep-alive>
    <component v-bind:is="currentComponent" class="tab"></component>
</keep-alive>Copy to clipboardErrorCopied
```

#### 打包优化

##### 模板预编译

当使用`DOM`内模板或`JavaScript`内的字符串模板时，模板会在运行时被编译为渲染函数，通常情况下这个过程已经足够快了，但对性能敏感的应用还是最好避免这种用法。预编译模板最简单的方式就是使用单文件组件——相关的构建设置会自动把预编译处理好，所以构建好的代码已经包含了编译出来的渲染函数而不是原始的模板字符串。如果使用`webpack`，并且喜欢分离`JavaScript`和模板文件，可以使用`vue-template-loader`，其可以在构建过程中把模板文件转换成为`JavaScript`渲染函数。

##### SourceMap

在项目进行打包后，会将开发中的多个文件代码打包到一个文件中，并且经过压缩、去掉多余的空格、`babel`编译化后，最终将编译得到的代码会用于线上环境，那么这样处理后的代码和源代码会有很大的差别，当有`bug`的时候，我们只能定位到压缩处理后的代码位置，无法定位到开发环境中的代码，对于开发来说不好调式定位问题，因此`sourceMap`出现了，它就是为了解决不好调式代码问题的，在线上环境则需要关闭`sourceMap`。

##### 配置splitChunksPlugins

`Webpack`内置了专门用于提取多个`Chunk`中的公共部分的插件`CommonsChunkPlugin`，是用于提取公共代码的工具，`CommonsChunkPlugin`于`4.0`及以后被移除，使用`SplitChunksPlugin`替代。

##### 使用treeShaking

`tree shaking`是一个术语，通常用于描述移除`JavaScript`上下文中的未引用代码`dead-code`，其依赖于`ES2015`模块系统中的静态结构特性，例如`import`和`export`，这个术语和概念实际上是兴起于`ES2015`模块打包工具`rollup`。

##### 第三方插件的按需引入

我们在项目中经常会需要引入第三方插件，如果我们直接引入整个插件，会导致项目的体积太大，我们可以借助`babel-plugin-component`，然后可以只引入需要的组件，以达到减小项目体积的目的，以项目中引入`element-ui`组件库为例。

```js
{
  "presets": [["es2015", { "modules": false }]],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
Copy to clipboardErrorCopied
import Vue from 'vue';
import { Button, Select } from 'element-ui';

Vue.use(Button)
Vue.use(Select)
```

### 25.Vue首屏性能优化组件

简单实现一个`Vue`首屏性能优化组件，现代化浏览器提供了很多新接口，在不考虑`IE`兼容性的情况下，这些接口可以很大程度上减少编写代码的工作量以及做一些性能优化方面的事情，当然为了考虑`IE`我们也可以在封装组件的时候为其兜底，本文的首屏性能优化组件主要是使用`IntersectionObserver`以及`requestIdleCallback`两个接口。

#### 描述

先考虑首屏场景，当做一个主要为展示用的首屏时，通常会加载较多的资源例如图片等，如果我们不想在用户打开时就加载所有资源，而是希望用户滚动到相关位置时再加载组件，此时就可以选择`IntersectionObserver`这个接口，当然也可以使用`onscroll`事件去做一个监听，只不过这样性能可能比较差一些。还有一些组件，我们希望他必须要加载，但是又不希望他在初始化页面时同步加载，这样我们可以使用异步的方式比如`Promise`和`setTimeout`等，但是如果想再降低这个组件加载的优先级，我们就可以考虑`requestIdleCallback`这个接口，相关代码在`https://github.com/WindrunnerMax/webpack-simple-environment`的`vue--first-screen-optimization`分支。

##### IntersectionObserver

`IntersectionObserver`接口，从属于`Intersection Observer API`，提供了一种异步观察目标元素与其祖先元素或顶级文档视窗`viewport`交叉状态的方法，祖先元素与视窗`viewport`被称为根`root`，也就是说`IntersectionObserver API`，可以自动观察元素是否可见，由于可见`visible`的本质是，目标元素与视口产生一个交叉区，所以这个`API`叫做交叉观察器，兼容性`https://caniuse.com/?search=IntersectionObserver`。

```javascript
const io = new IntersectionObserver(callback, option);

// 开始观察
io.observe(document.getElementById("example"));
// 停止观察
io.unobserve(element);
// 关闭观察器
io.disconnect();Copy to clipboardErrorCopied
```

- 参数`callback`，创建一个新的`IntersectionObserver`对象后，当其监听到目标元素的可见部分穿过了一个或多个阈`thresholds`时，会执行指定的回调函数。

- 参数

  ```
  option
  ```

  ，

  ```
  IntersectionObserver
  ```

  构造函数的第二个参数是一个配置对象，其可以设置以下属性:

  - `threshold`属性决定了什么时候触发回调函数，它是一个数组，每个成员都是一个门槛值，默认为`[0]`，即交叉比例`intersectionRatio`达到`0`时触发回调函数，用户可以自定义这个数组，比如`[0, 0.25, 0.5, 0.75, 1]`就表示当目标元素`0%`、`25%`、`50%`、`75%`、`100%`可见时，会触发回调函数。
  - `root`属性指定了目标元素所在的容器节点即根元素，目标元素不仅会随着窗口滚动，还会在容器里面滚动，比如在`iframe`窗口里滚动，这样就需要设置`root`属性，注意，容器元素必须是目标元素的祖先节点。
  - `rootMargin`属性定义根元素的`margin`，用来扩展或缩小`rootBounds`这个矩形的大小，从而影响`intersectionRect`交叉区域的大小，它使用`CSS`的定义方法，比如`10px 20px 30px 40px`，表示`top`、`right`、`bottom`和`left`四个方向的值。

- 属性`IntersectionObserver.root`只读，所监听对象的具体祖先元素`element`，如果未传入值或值为`null`，则默认使用顶级文档的视窗。

- 属性`IntersectionObserver.rootMargin`只读，计算交叉时添加到根`root`边界盒`bounding box`的矩形偏移量，可以有效的缩小或扩大根的判定范围从而满足计算需要，此属性返回的值可能与调用构造函数时指定的值不同，因此可能需要更改该值，以匹配内部要求，所有的偏移量均可用像素`pixel`、`px`或百分比`percentage`、`%`来表达，默认值为`0px 0px 0px 0px`。

- 属性`IntersectionObserver.thresholds`只读，一个包含阈值的列表，按升序排列，列表中的每个阈值都是监听对象的交叉区域与边界区域的比率，当监听对象的任何阈值被越过时，都会生成一个通知`Notification`，如果构造器未传入值，则默认值为`0`。

- 方法`IntersectionObserver.disconnect()`，使`IntersectionObserver`对象停止监听工作。

- 方法`IntersectionObserver.observe()`，使`IntersectionObserver`开始监听一个目标元素。

- 方法`IntersectionObserver.takeRecords()`，返回所有观察目标的`IntersectionObserverEntry`对象数组。

- 方法`IntersectionObserver.unobserve()`，使`IntersectionObserver`停止监听特定目标元素。

此外当执行`callback`函数时，会传递一个`IntersectionObserverEntry`对象参数，其提供的信息如下。

- `time:`可见性发生变化的时间，是一个高精度时间戳，单位为毫秒。
- `target:`被观察的目标元素，是一个`DOM`节点对象。
- `rootBounds:`根元素的矩形区域的信息，是`getBoundingClientRect`方法的返回值，如果没有根元素即直接相对于视口滚动，则返回`null`。
- `boundingClientRect:`目标元素的矩形区域的信息。
- `intersectionRect:`目标元素与视口或根元素的交叉区域的信息。
- `intersectionRatio:`目标元素的可见比例，即`intersectionRect`占`boundingClientRect`的比例，完全可见时为`1`，完全不可见时小于等于`0`。

```
{
  time: 3893.92,
  rootBounds: ClientRect {
    bottom: 920,
    height: 1024,
    left: 0,
    right: 1024,
    top: 0,
    width: 920
  },
  boundingClientRect: ClientRect {
     // ...
  },
  intersectionRect: ClientRect {
    // ...
  },
  intersectionRatio: 0.54,
  target: element
}Copy to clipboardErrorCopied
```

##### requestIdleCallback

`requestIdleCallback`方法能够接受一个函数，这个函数将在浏览器空闲时期被调用，这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应，函数一般会按先进先调用的顺序执行，如果回调函数指定了执行超时时间`timeout`，则有可能为了在超时前执行函数而打乱执行顺序，兼容性`https://caniuse.com/?search=requestIdleCallback`。

```javascript
const handle = window.requestIdleCallback(callback[, options]);Copy to clipboardErrorCopied
```

- `requestIdleCallback`方法返回一个`ID`，可以把它传入`window.cancelIdleCallback()`方法来结束回调。

- 参数`callback`，一个在事件循环空闲时即将被调用的函数的引用，函数会接收到一个名为`IdleDeadline`的参数，这个参数可以获取当前空闲时间以及回调是否在超时时间前已经执行的状态。

- 参数

  ```
  options
  ```

  可选，包括可选的配置参数，具有如下属性:

  - `timeout`: 如果指定了`timeout`，并且有一个正值，而回调在`timeout`毫秒过后还没有被调用，那么回调任务将放入事件循环中排队，即使这样做有可能对性能产生负面影响。

#### 实现

实际上编写组件主要是搞清楚如何使用这两个主要的`API`就好，首先关注`IntersectionObserver`，因为考虑需要使用动态组件`<component />`，那么我们向其传值的时候就需要使用异步加载组件`() => import("component")`的形式。监听的时候，可以考虑加载完成之后即销毁监听器，或者离开视觉区域后就将其销毁等，这方面主要是策略问题。在页面销毁的时候就必须将`Intersection Observer`进行`disconnect`，防止内存泄漏。另外我们为了使用`IntersectionObserver`则必须需要一个可以观察的目标，如果什么不都渲染，我们就无从观察，所以我们需要引入一个骨架屏，我们可以为真实的组件做一个在尺寸上非常接近真实组件的组件，在这里为了演示只是简单的渲染了`<section />`作为骨架屏。使用`requestIdleCallback`就比较简单了，只需要将回调函数执行即可，同样也类似于`Promise.resolve().then`这种异步处理的情况。
这里是简单的实现逻辑，通常`observer`的使用方案是先使用一个`div`等先进行占位，然后在`observer`监控其占位的容器，当容器在视区时加载相关的组件，相关的代码在`https://github.com/WindrunnerMax/webpack-simple-environment`的`vue--first-screen-optimization`分支，请尽量使用`yarn`进行安装，可以使用`yarn.lock`文件锁住版本，避免依赖问题。使用`npm run dev`运行之后可以在`Console`中看到这四个懒加载组件`created`创建的顺序，其中`A`的`observer`懒加载是需要等其加载页面渲染完成之后，判断在可视区，才进行加载，首屏使能够直接看到的，而`D`的懒加载则是需要将滚动条滑动到`D`的外部容器出现在视图之后才会出现，也就是说只要不滚动到底部是不会加载`D`组件的，另外还可以通过`component-params`和`component-events`将`attrs`和`listeners`传递到懒加载的组件，类似于`$attrs`和`$listeners`，至此懒加载组件已简单实现。

```html
<!-- App.vue -->
<template>
    <div>
        <section>1</section>
        <section>
            <div>2</div>
            <lazy-load
                :lazy-component="Example"
                type="observer"
                :component-params="{ content: 'Example A' }"
                :component-events="{
                    'test-event': testEvent,
                }"
            ></lazy-load>
        </section>
        <section>
            <div>3</div>
            <lazy-load
                :lazy-component="Example"
                type="idle"
                :component-params="{ content: 'Example B' }"
                :component-events="{
                    'test-event': testEvent,
                }"
            ></lazy-load>
        </section>
        <section>
            <div>4</div>
            <lazy-load
                :lazy-component="Example"
                type="lazy"
                :component-params="{ content: 'Example C' }"
                :component-events="{
                    'test-event': testEvent,
                }"
            ></lazy-load>
        </section>
        <section>
            <div>5</div>
            <lazy-load
                :lazy-component="Example"
                type="observer"
                :component-params="{ content: 'Example D' }"
                :component-events="{
                    'test-event': testEvent,
                }"
            ></lazy-load>
        </section>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LazyLoad from "./components/lazy-load/lazy-load.vue";
@Component({
    components: { LazyLoad },
})
export default class App extends Vue {
    protected Example = () => import("./components/example/example.vue");

    protected testEvent(content: string) {
        console.log(content);
    }
}
</script>

<style lang="scss">
@import "./common/styles.scss";
body {
    padding: 0;
    margin: 0;
}
section {
    margin: 20px 0;
    color: #fff;
    height: 500px;
    background: $color-blue;
}
</style>Copy to clipboardErrorCopied
<!-- lazy-load.vue -->
<template>
    <div>
        <component
            :is="renderComponent"
            v-bind="componentParams"
            v-on="componentEvents"
        ></component>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class LazyLoad extends Vue {
    @Prop({ type: Function, required: true })
    lazyComponent!: () => Vue;
    @Prop({ type: String, required: true })
    type!: "observer" | "idle" | "lazy";
    @Prop({ type: Object, default: () => ({}) })
    componentParams!: Record<string, unknown>;
    @Prop({ type: Object, default: () => ({}) })
    componentEvents!: Record<string, unknown>;

    protected observer: IntersectionObserver | null = null;
    protected renderComponent: (() => Vue) | null = null;

    protected mounted() {
        this.init();
    }

    private init() {
        if (this.type === "observer") {
            // 存在`window.IntersectionObserver`
            if (window.IntersectionObserver) {
                this.observer = new IntersectionObserver(entries => {
                    entries.forEach(item => {
                        // `intersectionRatio`为目标元素的可见比例，大于`0`代表可见
                        // 在这里也有实现策略问题 例如加载后不解除`observe`而在不可见时销毁等
                        if (item.intersectionRatio > 0) {
                            this.loadComponent();
                            // 加载完成后将其解除`observe`
                            this.observer?.unobserve(item.target);
                        }
                    });
                });
                this.observer.observe(this.$el.parentElement || this.$el);
            } else {
                // 直接加载
                this.loadComponent();
            }
        } else if (this.type === "idle") {
            // 存在`requestIdleCallback`
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (window.requestIdleCallback) {
                requestIdleCallback(this.loadComponent, { timeout: 3 });
            } else {
                // 直接加载
                this.loadComponent();
            }
        } else if (this.type === "lazy") {
            // 存在`Promise`
            if (window.Promise) {
                Promise.resolve().then(this.loadComponent);
            } else {
                // 降级使用`setTimeout`
                setTimeout(this.loadComponent);
            }
        } else {
            throw new Error(`type: "observer" | "idle" | "lazy"`);
        }
    }

    private loadComponent() {
        this.renderComponent = this.lazyComponent;
        this.$emit("loaded");
    }

    protected destroyed() {
        this.observer && this.observer.disconnect();
    }
}
</script>
```



### 26.Vue的双向绑定和单向数据流冲突吗？

`Vue`中更加推荐单向数据流的状态管理模式(比如`Vuex`)，但`Vue`同时支持通过`v-model`实现双向数据绑定。

#### props传递问题

不管是react还是vue，父级组件与子组件的通信都是通过props来实现的，在vue中父组件的props遵循的是单向数据流，用官方的话说就是，父级的props的更新会向下流动到子组件中，反之则不行。也就是说，子组件不应该去修改props。但实际开发过程中，可能会有一些情况试图去修改props数据：

1、这个props只是传递一个初始值，子组件把它当做一个局部变量来使用，这种情况一般定义一个本地的data属性，将props的值赋值给它。如下：

```js
props: [ 'initialCounter' ],
data: function () {
   return  {
     counter:  this .initialCounter
   }
}
```

2、这个props的值以原始数据传入，但是子组件对其需要转换。这种情况，最好使用computed来定义一个计算属性，如下：

```js
props: ['size'],
computed: {
  normalizedSize: function () {
    return this.size.trim().toLowerCase()
  }
}
```

以上两种情况，传递的值都是基本数据类型，但是大多数情况下，我们需要向子组件传递一个引用类型数据，那么问题就来了

JavaScript 中对象和数组是通过引用传入的，所以对于一个数组或对象类型的 prop 来说，在子组件中改变这个对象或数组本身将会影响到父组件的状态。

比如，在父组件中有一个列表，双击其中一个元素进行编辑，该元素的数据作为props传递给一个子组件，在子组件中需要对该数据进行编辑，你会发现如上所说，编辑后父组件的值也发生了变化。**实际上我们想父组件影响子组件，但是子组件修改不要影响父组件**

对于仅仅是复制了引用（地址），换句话说，复制了之后，原来的变量和新的变量指向同一个东西，彼此之间的操作会互相影响，为 **浅拷贝**。

而如果是在堆中重新分配内存，拥有不同的地址，但是值是一样的，复制后的对象与原来的对象是完全隔离，互不影响，为 **深拷贝**。

所以props的传递应该是浅拷贝

虽然通过拷贝props数据解决了问题，但是拷贝后修改新数据的属性并不会触发vue的更新机制，需要强制更新$forceUpdate()

#### 单向绑定 `vs` 双向绑定

单双向绑定，指的是`View`层和`Model`层之间的映射关系。
`react`采取单向绑定

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsnyXa5egWtK1iG8A.webp)



在`React`中，当`View`层发生更改时，用户通过发出`Actions`进行处理，`Actions`中通过`setState`对`State`进行更新，`State`更新后触发`View`更新。可以看出，`View`层不能直接修改`State`，必须要通过`Actions`来进行操作，这样更加清晰可控

单向绑定的方式的优点在于清晰可控，缺点则在于会有一些模板代码，`Vue`则同时支持单向绑定和双向绑定

- 单向绑定：插值形式`{{data}}`，`v-bind`也是单向绑定
- 双向绑定：表单的`v-model`，用户对`View`层的更改会直接同步到`Model`层

实际上`v-model`只是`v-bind:value` 和 `v-on:input`的语法糖，我们也可以采取类似`react`的单向绑定。两者各有利弊，单向绑定清晰可控，但是模板代码过多，双向绑定可以简化开发，但是也会导致数据变化不透明，优缺点共存，大家可以根据情况使用。

#### 单向数据流 `vs` 双向数据流

数据流指的是组件之间的数据流动。
 `Vue`与`React`都是单向数据流的模型，虽然`vue`有双向绑定`v-model`，但是`vue`和`react`父子组件之间数据传递，仍然还是遵循单向数据流的，父组件可以向子组件传递`props`，但是子组件不能修改父组件传递来的`props`，子组件只能通过事件通知父组件进行数据更改


![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsOcgMQGnyUfeXZbd.webp)

通过单向数据流的模型，所有状态的改变可记录、可跟踪，相比于双向数据流可加容易维护与定位问题

#### 为什么说`v-model`只是语法糖

>你可以用 `v-model` 指令在表单 `<input>`、`<textarea>` 及 `<select>` 元素上创建双向数据绑定。它会根据控件类型自动选取正确的方法来更新元素。尽管有些神奇，但 `v-model` 本质上不过是语法糖。它负责监听用户的输入事件以更新数据，并对一些极端场景进行一些特殊处理

正如上面所述，`Vue`文档中说`v-model`只是语法糖

```javascript
<input v-model=“phoneInfo.phone”/>

//在组件中使用时，实际相当于下面的简写
<input :value="PhoneInfo.phone" @input="val => { PhoneInfo.phone = val }"
```

那么问题来了，为什么说`v-model`不是真正的双向数据流呢？按照这道理，是不是可以认为`model->view`的单向数据流也是语法糖啊，也是`vue`作者通过一定方法实现的而已
 真正的原因上面已经说了，**数据绑定是`View`与`Model`之间的映射关系，数据流指的是组件之间的数据流动**
 `v-model`不是真正的双向数据流，是因为它不能直接修改父组件的值，比如你在`v-model`中绑定`props`中的值是会报错的，它只能绑定组件的值
 而真正的双向数据流，比如`AngularJs`，是允许在子组件中直接更新父组件的值的，这就是为什么说`v-model`只是语法糖的原因

#### 总结

总得来说，单双向数据绑定与数据流是两个不同维度的概念，数据绑定是`View`与`Model`之间的映射关系，数据流指的是组件之间的数据流动。因此，单向数据流也可有双向绑定，双向数据流也可以有双向绑定，两者不应该混为一谈

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsq3NVdyOxcBLACDb.webp)

### 27.自定义指令

[vue中如何自定义指令](https://blog.csdn.net/weixin_58032613/article/details/122759818)

#### 指令使用的几种方式

```js
//会实例化一个指令，但这个指令没有参数 
`v-xxx`
 
// -- 将值传到指令中
`v-xxx="value"`  
 
// -- 将字符串传入到指令中，如`v-html="'<p>内容</p>'"`
`v-xxx="'string'"` 
 
// -- 传参数（`arg`），如`v-bind:class="className"`
`v-xxx:arg="value"` 
 
// -- 使用修饰符（`modifier`）
`v-xxx:arg.modifier="value"` 

```

#### 如何自定义指令

注册一个自定义指令有全局注册与局部注册

全局注册注册主要是用过**Vue.directive**方法进行注册

**Vue.directive**第一个参数是**指令的名字**（不需要写上v-前缀），第二个参数可以是**对象数据**，也可以是一个**指令函数**

```js
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()  // 页面加载完成之后自动让输入框获取到焦点的小功能
  }
})
```

局部注册通过在组件options选项中设置directive属性  是定义在组件内部的，只能在当前组件中使用

```js
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus() // 页面加载完成之后自动让输入框获取到焦点的小功能
    }
  }
}
```

然后你可以在模板中任何元素上使用新的 v-focus property，如下：

```js
<input v-focus />
```

**钩子函数**

自定义指令也像组件那样存在钩子函数：

bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置
inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)
update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新
componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用
unbind：只调用一次，指令与元素解绑时调用

所有的钩子函数的参数都有以下：

- el：指令所绑定的元素，可以用来直接操作 DOM
- binding：一个对象，包含以下 property：



`name`：指令名，不包括 v- 前缀。

`value`：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。

`oldValue`：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。

`expression`：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。

`arg`：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。

`modifiers`：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }

`vnode`：Vue 编译生成的虚拟节点

`oldVnode`：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用



除了 el 之外，其它参数都应该是只读的，切勿进行修改。如果需要在钩子之间共享数据，建议通过元素的 dataset 来进行

```js
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
<script>
    Vue.directive('demo', function (el, binding) {
    console.log(binding.value.color) // "white"
    console.log(binding.value.text)  // "hello!"
    })
</script>
```

#### 批量注册使用

批量注册指令，新建 `directives/index.js` 文件

```js
import copy from './copy'
import longpress from './longpress'
// 自定义指令
const directives = {
  copy,
  longpress,
}

export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  },
}

```

在 `main.js` 引入并调用

```js
import Vue from 'vue'
import Directives from './JS/directives'
Vue.use(Directives)
```

#### 实现v-lazyload

背景：在类电商类项目，往往存在大量的图片，如 banner 广告图，菜单导航图，美团等商家列表头图等。图片众多以及图片体积过大往往会影响页面加载速度，造成不良的用户体验，所以进行图片懒加载优化势在必行。

需求：实现一个图片懒加载指令，只加载浏览器可见区域的图片。

思路：

1. 图片懒加载的原理主要是判断当前图片是否到了可视区域这一核心逻辑实现的
2. 拿到所有的图片 Dom ，遍历每个图片判断当前图片是否到了可视区范围内
3. 如果到了就设置图片的 `src` 属性，否则显示默认图片

图片懒加载有两种方式可以实现，一是绑定 `srcoll` 事件进行监听，二是使用 `IntersectionObserver` 判断图片是否到了可视区域，但是有浏览器兼容性问题。

下面封装一个懒加载指令兼容两种方法，判断浏览器是否支持 `IntersectionObserver` API，如果支持就使用 `IntersectionObserver` 实现懒加载，否则则使用 `srcoll` 事件监听 + 节流的方法实现

```js
const LazyLoad = {
  // install方法
  install(Vue, options) {
    const defaultSrc = options.default
    Vue.directive('lazy', {
      bind(el, binding) {
        LazyLoad.init(el, binding.value, defaultSrc)
      },
      inserted(el) {
        if (IntersectionObserver) {
          LazyLoad.observe(el)
        } else {
          LazyLoad.listenerScroll(el)
        }
      },
    })
  },
  // 初始化
  init(el, val, def) {
    el.setAttribute('data-src', val)
    el.setAttribute('src', def)
  },
  // 利用IntersectionObserver监听el
  observe(el) {
    var io = new IntersectionObserver((entries) => {
      const realSrc = el.dataset.src
      if (entries[0].isIntersecting) {
        if (realSrc) {
          el.src = realSrc
          el.removeAttribute('data-src')
        }
      }
    })
    io.observe(el)
  },
  // 监听scroll事件
  listenerScroll(el) {
    const handler = LazyLoad.throttle(LazyLoad.load, 300)
    LazyLoad.load(el)
    window.addEventListener('scroll', () => {
      handler(el)
    })
  },
  // 加载真实图片
  load(el) {
    const windowHeight = document.documentElement.clientHeight
    const elTop = el.getBoundingClientRect().top
    const elBtm = el.getBoundingClientRect().bottom
    const realSrc = el.dataset.src
    if (elTop - windowHeight < 0 && elBtm > 0) {
      if (realSrc) {
        el.src = realSrc
        el.removeAttribute('data-src')
      }
    }
  },
  // 节流
  throttle(fn, delay) {
    let timer
    let prevTime
    return function (...args) {
      const currTime = Date.now()
      const context = this
      if (!prevTime) prevTime = currTime
      clearTimeout(timer)

      if (currTime - prevTime > delay) {
        prevTime = currTime
        fn.apply(context, args)
        clearTimeout(timer)
        return
      }

      timer = setTimeout(function () {
        prevTime = Date.now()
        timer = null
        fn.apply(context, args)
      }, delay)
    }
  },
}

export default LazyLoad
```

使用，将组件内标签的 `src` 换成 `v-LazyLoad`

```js
<img v-LazyLoad="xxx.jpg" />
```

#### 实现一个v-debounce

背景：在开发中，有些提交保存按钮有时候会在短时间内被点击多次，这样就会多次重复请求后端接口，造成数据的混乱，比如新增表单的提交按钮，多次点击就会新增多条重复的数据。

需求：防止按钮在短时间内被多次点击，使用防抖函数限制规定时间内只能点击一次。

思路：

1. 定义一个延迟执行的方法，如果在延迟时间内再调用该方法，则重新计算执行时间。
2. 将事件绑定在 click 方法上。

```js
const debounce = {
  inserted: function (el, binding) {
    let timer
    el.addEventListener('click', () => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        binding.value()
      }, 1000)
    })
  },
}

export default debounce
```

使用：给 Dom 加上 `v-debounce` 及回调函数即可

```html
<template>
  <button v-debounce="debounceClick">防抖</button>
</template>

<script>
export default {
  methods: {
    debounceClick () {
      console.log('只触发一次')
    }
  }
}
</script>
```

#### 常用案例

- 代码复用和抽象的主要形式是组件。
- 当需要对普通 DOM 元素进行底层操作，此时就会用到自定义指令
- 但是，对于大幅度的 DOM 变动，还是应该使用组件

##### 输入框自动聚焦

```vue
输入框自动聚焦
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
//<input v-focus>
```

##### 下拉菜单

点击下拉菜单本身不会隐藏菜单
点击下拉菜单以外的区域隐藏菜单

```js
<script>
Vue.directive('clickoutside', {
  bind(el, binding) {
    function documentHandler(e) {
      if (el.contains(e.target)) {
       return false 
      }
      
      if (binding.expression) {
        binding.value(e)
      }
    }
    
    el.__vueMenuHandler__ = documentHandler
    document.addEventListener('click', el.__vueMenuHandler__)
  },
  unbind(el) {
    document.removeEventListener('click', el.__vueMenuHandler__)
    delete el.__vueMenuHandler__
  }
})

new Vue({
  el: '#app',
  data: {
    show: false
  },
  methods: {
    handleHide() {
      this.show = false
    }
  }
})
</script>
<div class="main" v-menu="handleHide">
  <button @click="show = !show">点击显示下拉菜单</button>
  <div class="dropdown" v-show="show">
    <div class="item"><a href="#">选项 1</a></div>
    <div class="item"><a href="#">选项 2</a></div>
    <div class="item"><a href="#">选项 3</a></div>
  </div>
</div>

```

##### 相对时间转换

类似微博、朋友圈发布动态后的相对时间，比如刚刚、两分钟前等等

```js
<span v-relativeTime="time"></span>
<script>
new Vue({
  el: '#app',
  data: {
    time: 1565753400000
  }
})

Vue.directive('relativeTime', {
  bind(el, binding) {
    // Time.getFormatTime() 方法，自行补充
    el.innerHTML = Time.getFormatTime(binding.value)
    el.__timeout__ = setInterval(() => {
      el.innerHTML = Time.getFormatTime(binding.value)
    }, 6000)
  },
  unbind(el) {
    clearInterval(el.innerHTML)
    delete el.__timeout__
  }
})
</script>
```

##### 输入框防抖

防抖这种情况设置一个v-throttle自定义指令来实现

```js
// 1.设置v-throttle自定义指令
Vue.directive('throttle', {
  bind: (el, binding) => {
    let throttleTime = binding.value; // 防抖时间
    if (!throttleTime) { // 用户若不设置防抖时间，则默认2s
      throttleTime = 2000;
    }
    let cbFun;
    el.addEventListener('click', event => {
      if (!cbFun) { // 第一次执行
        cbFun = setTimeout(() => {
          cbFun = null;
        }, throttleTime);
      } else {
        event && event.stopImmediatePropagation();
      }
    }, true);
  },
});
// 2.为button标签设置v-throttle自定义指令
<button @click="sayHello" v-throttle>提交</button>
```

##### 一键 Copy的功能

```js
import { Message } from 'ant-design-vue';
 
const vCopy = { //
  /*
    bind 钩子函数，第一次绑定时调用，可以在这里做初始化设置
    el: 作用的 dom 对象
    value: 传给指令的值，也就是我们要 copy 的值
  */
  bind(el, { value }) {
    el.$value = value; // 用一个全局属性来存传进来的值，因为这个值在别的钩子函数里还会用到
    el.handler = () => {
      if (!el.$value) {
      // 值为空的时候，给出提示，我这里的提示是用的 ant-design-vue 的提示，你们随意
        Message.warning('无复制内容');
        return;
      }
      // 动态创建 textarea 标签
      const textarea = document.createElement('textarea');
      // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
      textarea.readOnly = 'readonly';
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      // 将要 copy 的值赋给 textarea 标签的 value 属性
      textarea.value = el.$value;
      // 将 textarea 插入到 body 中
      document.body.appendChild(textarea);
      // 选中值并复制
      textarea.select();
      // textarea.setSelectionRange(0, textarea.value.length);
      const result = document.execCommand('Copy');
      if (result) {
        Message.success('复制成功');
      }
      document.body.removeChild(textarea);
    };
    // 绑定点击事件，就是所谓的一键 copy 啦
    el.addEventListener('click', el.handler);
  },
  // 当传进来的值更新的时候触发
  componentUpdated(el, { value }) {
    el.$value = value;
  },
  // 指令与元素解绑的时候，移除事件绑定
  unbind(el) {
    el.removeEventListener('click', el.handler);
  },
};
 
export default vCopy;
```

##### 拖拽

```js
<div ref="a" id="bg" v-drag></div>

  directives: {
    drag: {
      bind() {},
      inserted(el) {
        el.onmousedown = (e) => {
          let x = e.clientX - el.offsetLeft;
          let y = e.clientY - el.offsetTop;
          document.onmousemove = (e) => {
            let xx = e.clientX - x + "px";
            let yy = e.clientY - y + "px";
            el.style.left = xx;
            el.style.top = yy;
          };
          el.onmouseup = (e) => {
            document.onmousemove = null;
          };
        };
      },
    },
  }
```

### 28.Vue中的vm和VueComponent

关于vm和vc,vm为Vue的实例对象，vc为VueComponent的是对象

#### 1、Vue的实例对象，以后简称vm。

(1) vm的隐式原型属性指向Vue的原型对象。

(2) VueComponent的原型对象的隐式原型属性指向Vue的原型对象。

#### 2、Vue解析时会帮我们创建school组件的实例对象

我们只需要写`<school></school>`，，
即Vue帮我们执行的：new VueComponent(options)

#### 3、**特别注意**：

每次调用Vue.extend，返回的都是一个全新的VueComponent

```js
//定义school组件
const school = Vue.extend({
	name: 'school',
	data(){
		name:'ycu',
		address:'学府路576号',
	}, 
	methods:{}
})
```

在非单文件组件中，组件可以定义多个

#### 4、关于this指向

##### 1.组件配置中：

data函数、methods中的函数、watch中的函数、computed中的函数 它们的this均是VueComponent实例对象（也就是天禹老师课堂上的vc，也可称之为组件实例对象）。

###### (1)：VueComponent的实例对象，我们暂且记为vc。

![在这里插入图片描述](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs0277b0039eb545ef98c9e58288b88986.png)

###### (2)：Vue的实例对象 vm

![在这里插入图片描述](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs62b50a8434594125b290afd86fa9b467.png)

##### 2.new Vue(options)配置中：

data函数、methods中的函数、watch中的函数、computed中的函数 它们的this均是Vue实例对象。

#### 5、vc 与 vm 的区别：

vm和vc在某种程度上确实有很多相像之处，但又有着本质的区别，vc差不多像是vm的小弟，可以理解为类似生活中的一对双胞胎，一个稍微早出生几分钟的是大哥，也就是vm，另外一个就是小弟vc，虽然会很像，但是还是有区别的。

总体上来说，vm身上有的，vc基本也有。

data函数、methods中的函数、watch中的函数、computed中的函数在vm和vc里边都有，生命周期也都是一样的，以及相同的数据代理模式。

**vc有的vm都有，vm可以通过el决定为哪一个容器服务，但是vc是没有 el 的！且 vc 的data要写成函数式，在vm中的data写成对象或者函数都行**

#### 6、Vue和VueComponent的内置关系

VueComponent.prototype.**proto** === Vue.prototype (这里的proto前后都是有__的，编辑器误以为是加粗的标识了)

**即构造函数的显示原型属性 === 实例对象的隐式原型属性**

![在这里插入图片描述](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsf76c327ba18b49f391b9cafd498a7d03.png)

## 生命周期

### 1.生命周期有哪些，vue2和vue3有什么区别

#### Vue2生命周期

<img src="https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202300568.png" alt="b1493c640d7e4cf2bd7785cea7c86789" style="zoom: 50%;" />

Vue 实例有⼀个完整的⽣命周期，也就是从开始创建、初始化数据、编译模版、挂载Dom -> 渲染、更新 -> 渲染、卸载 等⼀系列过程，称这是Vue的⽣命周期。

1. **beforeCreate（创建前）**：数据观测和初始化事件还未开始，此时 data 的响应式追踪、event/watcher 都还没有被设置，也就是说不能访问到data、computed、watch、methods上的方法和数据。
2. **created（创建后）** ：实例创建完成，实例上配置的 options 包括 data、computed、watch、methods 等都配置完成，但是此时渲染得节点还未挂载到 DOM，所以不能访问到 `$el` 属性。
3. **beforeMount（挂载前）**：在挂载开始之前被调用，相关的render函数首次被调用。实例已完成以下的配置：编译模板，把data里面的数据和模板生成html。此时还没有挂载html到页面上。
4. **mounted（挂载后）**：在el被新创建的 vm.$el 替换，并挂载到实例上去之后调用。实例已完成以下的配置：用上面编译好的html内容替换el属性指向的DOM对象。完成模板中的html渲染到html 页面中。mounted以后可以进行dom操作
5. **beforeUpdate（更新前）**：响应式数据更新时调用，此时虽然响应式数据更新了，但是对应的真实 DOM 还没有被渲染。
6. **updated（更新后）** ：在由于数据更改导致的虚拟DOM重新渲染和打补丁之后调用。此时 DOM 已经根据响应式数据的变化更新了。调用时，组件 DOM已经更新，所以可以执行依赖于DOM的操作。然而在大多数情况下，应该避免在此期间更改状态，因为这可能会导致更新无限循环。该钩子在服务器端渲染期间不被调用。
7. **beforeDestroy（销毁前）**：实例销毁之前调用。这一步，实例仍然完全可用，`this` 仍能获取到实例。
8. **destroyed（销毁后）**：实例销毁后调用，调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。该钩子在服务端渲染期间不被调用。

另外还有 `keep-alive` 独有的生命周期，分别为 `activated` 和 `deactivated` 。用 `keep-alive` 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 `deactivated` 钩子函数，命中缓存渲染后会执行 `activated` 钩子函数。

首先给出结论：created 和 mounted 中发起 ajax 请求是一样的，没有区别。
为啥没有区别：created 和 mounted 是在同一个 tick 中执行的，而ajax 请求的时间一定会超过一个 tick。所以即便ajax的请求耗时是 0ms， 那么也是在 nextTick 中更新数据到 DOM 中。所以说在不依赖 DOM 节点的情况下一点区别都没有。



#### Vue3生命周期

组件中setup的执行顺序

创建组件，先初始化props，再依次执行setup、beforeCreate、created

setup() 内部(组合式api)调用的生命周期钩子里是没有`beforeCreate` 和 `Create`函数的。
官方解释： 因为 `setup` 是围绕 `beforeCreate` 和 `created` 生命周期钩子运行的，所以不需要显式地定义它们。换句话说，在这些钩子中编写的任何代码都应该直接在 `setup` 函数中编写

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

把父组件的data通过props传递给子组件的时候，子组件在初次渲染的时候生命周期或者render方法，有调用data相关的props的属性, 这样子组件也被添加到父组件的data的相关属性依赖中，这样父组件的data在set的时候，就相当于触发自身和子组件的update。
例子如下:

```javascript
// main.vue
import Vue from 'vue'
import App from './App'

const root = new Vue({
  data: {
    state: false
  },
  mounted() {
    setTimeout(() => {
      this.state = true
    }, 1000)
  },
  render: function(h) {
    const { state } = this // state 变化重新触发render
    let root = h(App, { props: { status: state } })
    console.log('root:', root)
    return root
  }
}).$mount('#app')

window.root = root
// App.vue
<script>
export default {
  props: {
    status: Boolean
  },
  render: function (h){
    const { status } = this
    let app = h('h1', ['hello world'])
    console.log('app:', app)
    return app
  }
}
</script>
```

截图如下:

<img src="https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202300173.png" alt="clipboard.png" style="zoom:150%;" />
在`main.js`中 **state** 状态发生了变化，由`false` => `true`, 触发了**自身**与**子组件**的render方法。

### 6.生命周期源码分析

[Vue 的完整生命周期源码流程详解](https://juejin.cn/post/7017712966485147678)

[Vue 的生命周期之间到底做了什么事清？](https://juejin.cn/post/6844904114879463437)

#### 初始化流程

```js
export function initMixin (Vue: Class<Component>) {
  // 在原型上添加 _init 方法
  Vue.prototype._init = function (options?: Object) {
    // 保存当前实例
    const vm: Component = this
    // 合并配置
    if (options && options._isComponent) {
      // 把子组件依赖父组件的 props、listeners 挂载到 options 上，并指定组件的$options
      initInternalComponent(vm, options)
    } else {
      // 把我们传进来的 options 和当前构造函数和父级的 options 进行合并，并挂载到原型上
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    vm._self = vm
    initLifecycle(vm) // 初始化实例的属性、数据：$parent, $children, $refs, $root, _watcher...等
    initEvents(vm) // 初始化事件：$on, $off, $emit, $once
    initRender(vm) // 初始化渲染： render, mixin
    callHook(vm, 'beforeCreate') // 调用生命周期钩子函数
    initInjections(vm) // 初始化 inject
    initState(vm) // 初始化组件数据：props, data, methods, watch, computed
    initProvide(vm) // 初始化 provide
    callHook(vm, 'created') // 调用生命周期钩子函数

    if (vm.$options.el) {
      // 如果传了 el 就会调用 $mount 进入模板编译和挂载阶段
      // 如果没有传就需要手动执行 $mount 才会进入下一阶段
      vm.$mount(vm.$options.el)
    }
  }
}
```

#### new Vue

从 `new Vue(options)` 开始作为入口，`Vue` 只是一个简单的构造函数，内部是这样的：

```js
function Vue (options) {
  this._init(options)
}
```

进入了 `_init` 函数之后，先初始化了一些属性。

1.  `initLifecycle`：初始化一些属性如`$parent`，`$children`。根实例没有 `$parent`，`$children` 开始是空数组，直到它的 `子组件` 实例进入到 `initLifecycle` 时，才会往父组件的 `$children` 里把自身放进去。所以 `$children` 里的一定是组件的实例。
2.  `initEvents`：初始化事件相关的属性，如 `_events` 等。
3.  `initRender`：初始化渲染相关如 `$createElement`，并且定义了 `$attrs` 和 `$listeners` 为`浅层`响应式属性。具体可以查看`细节`章节。并且还定义了`$slots`、`$scopedSlots`，其中 `$slots` 是立刻赋值的，但是 `$scopedSlots` 初始化的时候是一个 `emptyObject`，直到组件的 `vm._render` 过程中才会通过 `normalizeScopedSlots` 去把真正的 `$scopedSlots` 整合后挂到 `vm` 上。

然后开始第一个生命周期：

```js
callHook(vm, 'beforeCreate')
```

#### beforeCreate被调用完成

`beforeCreate` 之后

1.  初始化 `inject`
2.  初始化  `state`
    -   初始化 `props`
    -   初始化 `methods`
    -   初始化 `data`
    -   初始化 `computed`
    -   初始化 `watch`
3.  初始化 `provide`

所以在 `data` 中可以使用 `props` 上的值，反过来则不行

然后进入 `created` 阶段：

```js
callHook(vm, 'created')
```

#### created被调用完成

调用 `$mount` 方法，开始挂载组件到 `dom` 上。

如果使用了 `runtime-with-compile` 版本，则会把你传入的 `template` 选项，或者 `html` 文本，通过一系列的编译生成 `render` 函数。

-   编译这个 `template`，生成 `ast` 抽象语法树。
-   优化这个 `ast`，标记静态节点。（渲染过程中不会变的那些节点，优化性能）。
-   根据 `ast`，生成 `render` 函数。

对应具体的代码就是：

```js
const ast = parse(template.trim(), options)
if (options.optimize !== false) {
  optimize(ast, options)
}
const code = generate(ast, options)
```

如果是脚手架搭建的项目的话，这一步 `vue-cli` 已经帮你做好了，所以就直接进入 `mountComponent` 函数。

那么，确保有了 `render` 函数后，我们就可以往`渲染`的步骤继续进行了

#### beforeMount被调用完成

把 `渲染组件的函数` 定义好，具体代码是：

```js
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
```

拆解来看，`vm._render` 其实就是调用我们上一步拿到的 `render` 函数生成一个 `vnode`，而 `vm._update` 方法则会对这个 `vnode` 进行 `patch` 操作，帮我们把 `vnode` 通过 `createElm`函数创建新节点并且渲染到 `dom节点` 中

接下来就是执行这段代码了，是由 `响应式原理` 的一个核心类 `Watcher` 负责执行这个函数，为什么要它来代理执行呢？因为我们需要在这段过程中去 `观察` 这个函数读取了哪些响应式数据，将来这些**响应式数据更新**的时候，我们需要重新执行 `updateComponent` 函数

如果是更新后调用 `updateComponent` 函数的话，`updateComponent` 内部的 `patch` 就不再是初始化时候的创建节点，而是对新旧 `vnode` 进行 `diff`，最小化的更新到 `dom节点` 上去

这一切交给 `Watcher` 完成：

```js
new Watcher(vm, updateComponent, noop, {
  before () {
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate')
    }
  }
}, true /* isRenderWatcher */)
```

注意这里在`before` 属性上定义了`beforeUpdate` 函数，也就是说在 `Watcher` 被响应式属性的更新触发之后，重新渲染新视图之前，会先调用 `beforeUpdate` 生命周期。

注意，在 `render` 的过程中，如果遇到了 `子组件`，则会调用 `createComponent` 函数。

`createComponent` 函数内部，会为子组件生成一个属于自己的`构造函数`，可以理解为子组件自己的 `Vue` 函数：

```js
Ctor = baseCtor.extend(Ctor)
```

在普通的场景下，其实这就是 `Vue.extend` 生成的构造函数，它继承自 `Vue` 函数，拥有它的很多全局属性。

这里插播一个知识点，除了组件有自己的`生命周期`外，其实 `vnode` 也是有自己的 `生命周期的`，只不过我们平常开发的时候是接触不到的。

那么`子组件的 vnode` 会有自己的 `init` 周期，这个周期内部会做这样的事情：

```js
// 创建子组件
const child = createComponentInstanceForVnode(vnode)
// 挂载到 dom 上
child.$mount(vnode.elm)
```

而 `createComponentInstanceForVnode` 内部又做了什么事呢？它会去调用 `子组件` 的构造函数。

```js
new vnode.componentOptions.Ctor(options)
```

构造函数的内部是这样的：

```js
const Sub = function VueComponent (options) {
  this._init(options)
}
```

这个 `_init` 其实就是我们文章开头的那个函数，也就是说，如果遇到 `子组件`，那么就会优先开始`子组件`的构建过程，也就是说，从 `beforeCreated` 重新开始。这是一个递归的构建过程。

也就是说，如果我们有 `父 -> 子 -> 孙` 这三个组件，那么它们的初始化生命周期顺序是这样的：

```
父 beforeCreate 
父 create 
父 beforeMount 
子 beforeCreate 
子 create 
子 beforeMount 
孙 beforeCreate 
孙 create 
孙 beforeMount 
孙 mounted 
子 mounted 
父 mounted 
```

然后，`mounted` 生命周期被触发

#### mounted被调用完成

到此为止，组件的挂载就完成了，初始化的生命周期结束

#### 更新流程

当一个响应式属性被更新后，触发了 `Watcher` 的回调函数，也就是 `vm._update(vm._render())`，在更新之前，会先调用刚才在 `before` 属性上定义的函数，也就是

```js
callHook(vm, 'beforeUpdate')
```

注意，由于 Vue 的异步更新机制，`beforeUpdate` 的调用已经是在 `nextTick` 中了。 具体代码如下：

```js
nextTick(flushSchedulerQueue)

function flushSchedulerQueue {
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    if (watcher.before) {
     // callHook(vm, 'beforeUpdate')
      watcher.before()
    }
 }
}
```

#### beforeUpdate被调用完成

然后经历了一系列的 `patch`、`diff` 流程后，组件重新渲染完毕，调用 `updated` 钩子。

注意，这里是对 `watcher` 倒序 `updated` 调用的。

也就是说，假如同一个属性通过 `props` 分别流向 `父 -> 子 -> 孙` 这个路径，那么收集到依赖的先后也是这个顺序，但是触发 `updated` 钩子确是 `孙 -> 子 -> 父` 这个顺序去触发的。

```js
function callUpdatedHooks (queue) {
  let i = queue.length
  while (i--) {
    const watcher = queue[i]
    const vm = watcher.vm
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated')
    }
  }
}
```

#### updated被调用完成

至此，渲染更新流程完毕

#### 销毁流程

在刚刚所说的更新后的 `patch` 过程中，如果发现有组件在下一轮渲染中消失了，比如 `v-for` 对应的数组中少了一个数据。那么就会调用 `removeVnodes` 进入组件的销毁流程。

`removeVnodes` 会调用 `vnode` 的 `destroy` 生命周期，而 `destroy` 内部则会调用我们相对比较熟悉的 `vm.$destroy()`。（keep-alive 包裹的子组件除外）

这时，就会调用 `callHook(vm, 'beforeDestroy')`

#### beforeDestroy被调用完成

之后就会经历一系列的`清理`逻辑，清除父子关系、`watcher` 关闭等逻辑。但是注意，`$destroy` 并不会把组件从视图上移除，如果想要手动销毁一个组件，则需要我们自己去完成这个逻辑。

然后，调用最后的 `callHook(vm, 'destroyed')`

#### destroyed被调用完成

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

从⽤户的⾓度看，前端路由主要实现了两个功能（使⽤ajax更新页⾯状态的情况下）：
1. 记录当前页⾯的状态（保存或分享当前页的url，再次打开该url时，⽹页还是保存（分享）时的状态）；
2. 可以使⽤浏览器的前进后退功能（如点击后退按钮，可以使页⾯回到使⽤ajax更新页⾯之前的状态，url也回到之前的状态）；

作为开发者，要实现这两个功能，我们需要做到：

1.改变url且不让浏览器向服务器发出请求；

2.监测 url 的变化；

3.截获 url 地址，并解析出需要的信息来匹配路由规则。
我们路由常⽤的hash模式和history模式实际上就是实现了上⾯的功能

Vue-Router有两种模式：**hash模式**和**history模式**。默认的路由模式是hash模式。

#### 1. hash模式

**简介：** hash模式是开发中默认的模式，它的URL带着一个#，例如：[www.abc.com/#/vue](https://link.juejin.cn/?target=http%3A%2F%2Fwww.abc.com%2F%23%2Fvue)，它的hash值就是`#/vue`。

**特点**：hash值会出现在URL里面，但是不会出现在HTTP请求中，对后端完全没有影响。所以改变hash值，不会重新加载页面。这种模式的浏览器支持度很好，低版本的IE浏览器也支持这种模式。hash路由被称为是前端路由，已经成为SPA（单页面应用）的标配。

**原理：** hash模式的主要原理就是**onhashchange()事件**：

使⽤到的api：

```js
window.location.hash = 'qq' // 设置 url 的 hash，会在当前url后加上 '#qq'
var hash = window.location.hash // '#qq'  
window.addEventListener('hashchange', function(){ 
    // 监听hash变化，点击浏览器的前进后退会触发
})
```



```javascript
window.onhashchange = function(event){
	console.log(event.oldURL, event.newURL);
	let hash = location.hash.slice(1);
}
```

使用onhashchange()事件的好处就是，在页面的hash值发生变化时，无需向后端发起请求，window就可以监听事件的改变，并按规则加载相应的代码。除此之外，hash值变化对应的URL都会被浏览器记录下来，这样浏览器就能实现页面的前进和后退。虽然是没有请求后端服务器，但是页面的hash值和对应的URL关联起来了。

#### 2. history模式

**简介：** history模式的URL中没有#，它使用的是传统的路由分发模式，即用户在输入一个URL时，服务器会接收这个请求，并解析这个URL，然后做出相应的逻辑处理。 **特点：** 当使用history模式时，URL就像这样：`abc.com/user/id`。相比hash模式更加好看。但是，history模式需要后台配置支持。如果后台没有正确配置，访问时会返回404。 **API：** history api可以分为两大部分，切换历史状态和修改历史状态：

- **修改历史状态**：包括了 HTML5 History Interface 中新增的 `pushState()` 和 `replaceState()` 方法，这两个方法应用于浏览器的历史记录栈，提供了对历史记录进行修改的功能。只是当他们进行修改时，虽然修改了url，但浏览器不会立即向后端发送请求。如果要做到改变url但又不刷新页面的效果，就需要前端用上这两个API。
- **切换历史状态：** 包括`forward()`、`back()`、`go()`三个方法，对应浏览器的前进，后退，跳转操作。

history.state    用于存储2个方法的data数据，不同浏览器的读写权限不一样

响应pushState或者replaceState的调用

 每当活动的历史记录项发生变化时， `popstate` 事件都会被传递给window对象。如果当前活动的历史记录项是被 `pushState` 创建的，或者是由 `replaceState` 改变的，那么 `popstate` 事件的状态属性 `state` 会包含一个当前历史记录状态对象的拷贝

```js
window.history.pushState(state, title, url) 
// state：需要保存的数据，这个数据在触发popstate事件时，可以在event.state⾥获取
// title：标题，基本没⽤，⼀般传 null
// url：设定新的历史记录的 url。新的 url 与当前 url 的 origin 必须是⼀樣的，否则会抛出错误。url可以是绝对路径，也可以是相对路径。
//如当前url是 https://www.baidu.com/a/,执⾏history.pushState(null, null, './qq/')，则变成 https://www.baidu.com/a/qq/，
//执⾏history.pushState(null, null, '/qq/')，则变成 https://www.baidu.com/qq/
window.history.replaceState(state, title, url)
// 与 pushState 基本相同，但她是修改当前历史记录，⽽ pushState 是创建新的历史记录
window.addEventListener("popstate", function() {
 // 监听浏览器前进后退事件，pushState 与 replaceState ⽅法不会触发
});
window.history.back() // 后退
window.history.forward() // 前进
window.history.go(1) // 前进⼀步，-2为后退两步，window.history.lengthk可以查看当前历史堆栈中页⾯的数量
```

虽然history模式丢弃了丑陋的#。但是，它也有自己的缺点，就是在刷新页面的时候，如果没有相应的路由或资源，就会刷出404来。

history 模式改变 url 的⽅式会导致浏览器向服务器发送请求，这不是我们想看到的，我们需要在服务器端做处理：如果匹配不到任何静态资源，则应该始终返回同⼀个 html 页⾯。

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

什么是动态路由 

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

### 11.单页面应用实现无刷新更新原理

>目前主流的前端 SPA 框架如：React/Vue 是通过 Hash 和 History 两种方式实现无刷新路由。
>无刷新更新页面本质上是改变页面的DOM，而不是跳转到新页面

#### 问题

##### 1、如何改变 URL 不引起页面刷新。

Hash 模式：更新 window.location.hash, \#是用来指导浏览器动作的，http请求中是不包括#部分的，不会发送到服务器端。因此改变location.hash部分，浏览器不会发送请求重新加载页面
History 模式：通过 pushState 或 replaceState 方法改变浏览器的 URL。

##### 2、如何监控 URL 的变化。

在 Hash 模式下可以通过监听 Hashchange 事件来监控 URL 的变化。

在 History 模式只有浏览器的前进和后退会触发 popstate 事件， History API 提供的 pushState 和 replaceState 并不会触发相关事件。故需要劫持 pushState / replaceState 方法，再手动触发事件。

既然 History 这么麻烦，那为什么还要用 History 模式呢？

来先看下完整 URL 的组成：

```ruby
protocol://hostname:port/pathname?search#hash
```

- protocol：通信协议，常用的有http、https、ftp、mailto等。
- hostname：主机域名或IP地址。
- port：端口号，可选。省略时使用协议的默认端口，如http默认端口为80。
- pathname：路径由零或多个"/"符号隔开的字符串组成，一般用来表示主机上的一个目录或文件地址。
- search：查询，可选。用于传递参数，可有多个参数，用"&“符号隔开，每个参数的名和值用”="符号隔开。
- hash：信息片断字符串，也称为锚点。用于指定网络资源中的片断。

可以看到 Hash 前面固定有一个井号 "#"，即不美观，也不符合一般我们对路由认知，如：

```ruby
https://www.test.com/#/home
https://www.test.com/#/about
```

而 History 就可以解决这个问题，它可以直接修改 **pathname** 部分的内容：

```cpp
https://www.test.com/home
https://www.test.com/about
```

##### 3、如何根据 URL 改变页面内容。

文章开头说了，*无刷新更新页面本质上是改变页面的DOM，而不是跳转到新页面。* 我们也知道了如何监控 URL 的变化，那最简单粗暴的方式就是直接通过 innerHTML 改变 DOM 内容。

当然主流的 SPA 框架如：React/Vue 是通过 **虚拟DOM(Virtual DOM)** 结合优化后的 **diff 策略** 实现最小 DOM 操作来更新页面。

#### 路由的实现

##### 1、路由的需求和解决思路

- 如何生成路由
  创建一个 **Router** 类，传入一个类似 Vue-router 的路由参数数组 **routes** 来配置路由：

  ```dart
  const routes = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        page: home,
    },
    {
        path: '/about',
        page: about,
    },
    {
        path: '/about/me',
        page: aboutMe,
    }
    // ...
  ];
  export { routes };
  ```

- 如何跳转地址
  使用 History API 提供的 **pushState 和 replaceState** 方法：

  ```dart
  // 本质上只是改变了浏览器的 URL 显示
  window.history.pushState({}, '', '/someurl');
  window.history.replaceState({}, '', '/someurl');
  ```

- 如何监听 URL 变化
  由于**pushState 和 replaceState** 并不会触发相应事件，故需劫持 pushState 和 replaceState 方法，手动触发事件：

  ```tsx
  bindHistoryEventListener(type: string): any {
        const historyFunction: Function = (<any>history)[type];
        return function() {
            const newHistoryFunction = historyFunction.apply(history, arguments);
            const e = new Event(type);
            (<any>e).arguments = arguments;
            // 触发事件, 让 addEventListener 可以监听到
            window.dispatchEvent(e);
            return newHistoryFunction;
        };
    };
  ```

  然后就可以监听相关事件了

  ```tsx
  window.history.pushState = this.bindHistoryEventListener('pushState');
  window.addEventListener('pushState', () => {
      // ...
  });
  window.history.replaceState = this.bindHistoryEventListener('replaceState');
  window.addEventListener('replaceState', () => {
      // ...
  });
  ```

- **/about 和 /about/me 是两个不同的页面**
  转换 pathname 为数组，再判断数组长度来区分：

  ```tsx
  // 浏览器 URL 的 pathname 转化为数组
  // browserPath 为 window.location.pathname
  const browserPathQueryArray: Array<string> = browserPath.substring(1).split('/');
  // routes的 path 属性转化为数组
  // route 为 routes 遍历后的单个元素
  const routeQueryArray: Array<string> = route.path.substring(1).split('/');
  // 对两者比长度
  if (routeQueryArray.length !== browserPathQueryArray.length) {
     return false;
  }
  ```

- **/blogs/:id 可以动态匹配 /blogs/1、 /blogs/99**
  转换 pathname 为数组，字符串判断以冒号 ":" 开头，则为动态属性，把其加入到全局变量 $route 中：

  ```ruby
  for (let i = 0; i < routeQueryArray.length; i++) {
      if (routeQueryArray[i].indexOf(':') === 0) {
         // :id 可以用 $router.id 访问
         (<any>window).$route[routeQueryArray[i].substring(1)] = pathQueryArray[i];
      }
  }
  ```

- **路由有的地址会 \*跳转 / 重新定向\* 到其他地址上**
  在路由参数中约定 redirect 属性为 跳转 / 重新定向 的目标地址，查找中再次遇到 redirect 属性则重新查找新的目标地址，直到找到最终地：

  ```kotlin
  // Router 类 的 redirect 方法
  if (this.routes[index].redirect !== undefined && this.routes[index].redirect !== '') {
      this.redirect(this.routes[index].redirect);
  } else {
      // 更新 URL 为最终的地址
      window.history.pushState({}, '', window.location.origin + this.routes[index].path);
      // 然后执行更新页面逻辑 ...
  }
  ```

##### 2、History 路由的实现

1、路由参数 routes.ts：

```dart
// 该数组会作为参数传给路由器的实例，其中 page 参数接收一个 Page 对象，该对象包含一些页面更新的方法，可以是 innerHTML 也可以是 虚拟 DOM 更新，这里不重要，只要知道可以调用它的方法更新页面就行

// 甚至可以把 page 参数改为接收 HTML 字符串，路由器直接把这些 HTML 字符串通过 innerHTML 更新进页面

const routes = [
    {
        // 地址
        path: '/',
        // redirect 为要重新定向的地址
        redirect: '/home',
    },
    {
        path: '/home',
        page: homePage,
    },
    {
        path: '/about',
        page: aboutPage,
    },
    {
        path: '/about/me',
        page: aboutMePage,
    },
    {
        path: '/blogs/:id',
        page: blogsPage,
    },
    {
        path: '/404',
        page: pageNotFound,
    },
];
export { routes };
```

2、路由 router.ts：

```tsx
// 路由参数就是 Route 的数组
interface Route {
    path: string,
    page?: Page,
    redirect?: string,
}

// 路由器接收的参数
interface Config {
    // 内容区容器 ID
    container: HTMLElement,
    routes: Route[],
}

class Router {
    // 页面需要更新的区域
    container: HTMLElement;
    routes: Route[];
    constructor(config: Config) {
        this.routes = config.routes;
        this.container = config.container;

        // 先执行一次，初始化页面
        this.monitor();

        // 劫持 pushState
        window.history.pushState = this.bindHistoryEventListener('pushState');
        window.addEventListener('pushState', () => {
            this.monitor();
        });
        window.addEventListener('popstate', () => {
            this.monitor();
        });
    }

    // 根据路由地址查找相应的参数
    monitor(): void {
        let index: number = this.routes.findIndex((item: Route) => {
            return this.verifyPath(item, window.location.pathname);
        });
        
        // 找到结果
        if (index >= 0) {
            if (this.routes[index].redirect !== undefined && this.routes[index].redirect !== '') {
           
            // 重新定向 
                this.redirect(this.routes[index].redirect);
            } else {
                // 不需重新定向，执行更新页面的方法
                this.updatePage(index);
            }
        } else {
            // 没找到结果跳转到 /404 地址
            window.history.pushState({}, '', '/404');
            console.log('404!');
        }
    }

    // 重新定向
    redirect(redirectPath: string): void {
        let index: number = this.routes.findIndex((item: Route) => {
            return redirectPath === item.path;
        });
        // 定向到的地址还是 redirect 则继续找最终 path
        if (this.routes[index].redirect !== undefined && this.routes[index].redirect !== '') {
            this.redirect(this.routes[index].redirect);
        } else {
            // 更新 URL 为最终的地址
            window.history.pushState({}, '', window.location.origin + this.routes[index].path);
            this.updatePage(index);
        }
    }

    // 更新页面
    updatePage(index: number): void {
        // 向全局变量 $route 加入动态属性
        const pathQueryArray: Array<string> = window.location.pathname.substring(1).split('/');
        const routeQueryArray: Array<string> = this.routes[index].path.substring(1).split('/');
        for (let i = 0; i < routeQueryArray.length; i++) {
            if (routeQueryArray[i].indexOf(':') === 0) {
                (<any>window).$route[routeQueryArray[i].substring(1)] = pathQueryArray[i];
            }
        }
        
        // 这里假设 Page 有 create 方法可以更新页面内容，而不用纠结它的具体实现
        this.routes[index].page.create(this.container);
    }

    // 对比路由地址
    verifyPath(route: Route, browserPath: string): boolean {
        const browserPathQueryArray: Array<string> = browserPath.substring(1).split('/');
        const routeQueryArray: Array<string> = route.path.substring(1).split('/');
        // 先核对长度
        if (routeQueryArray.length !== browserPathQueryArray.length) {
            return false;
        }
        for (let i = 0; i < routeQueryArray.length; i++) {
            // 判断是否以冒号开头, 如 :id
            // 不是, 则将其与路由 path进行比对
            if (routeQueryArray[i].indexOf(':') !== 0) {
                if (routeQueryArray[i] !== browserPathQueryArray[i]) {
                    return false;
                }
            }
        }
        return true;
    }

    // 劫持 pushState / popState
    bindHistoryEventListener(type: string): any {
        const historyFunction: Function = (<any>history)[type];
        return function() {
            const newHistoryFunction = historyFunction.apply(history, arguments);
            const e = new Event(type);
            (<any>e).arguments = arguments;
            // 触发事件, 让 addEventListener 可以监听到
            window.dispatchEvent(e);
            return newHistoryFunction;
        };
    };
}

export { Router };
```

3、使用路由器

```jsx
import { routes } from 'routes.js';
import { Router } from 'router.js';
new Router({
    // 更新页面 div#app 中的内容
    container: document.getElementById('app'),
    routes: routes,
});
```

### 12.单页面应用和多页面应用

#### 单页面应用（SinglePage Web Application，SPA）

只有一张Web页面的应用，是一种从Web服务器加载的富客户端，单页面跳转仅刷新局部资源 ，公共资源(js、css等)仅需加载一次，常用于PC端官网、购物等网站

![单页面应用结构视图](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202301546.webp)

#### 多页面应用（MultiPage Application，MPA）

多页面跳转刷新所有资源，每个公共资源(js、css等)需选择性重新加载，常用于 app 或 客户端等

![多页面应用结构视图](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202301146.webp)

#### 具体对比分析：

|                   | 单页面应用（SinglePage Web Application，SPA）                | 多页面应用（MultiPage Application，MPA）     |
| ----------------- | ------------------------------------------------------------ | -------------------------------------------- |
| 组成              | 一个外壳页面和多个页面片段组成                               | 多个完整页面构成                             |
| 资源共用(css,js)  | 共用，只需在外壳部分加载                                     | 不共用，每个页面都需要加载                   |
| 刷新方式          | 页面局部刷新或更改                                           | 整页刷新                                     |
| url 模式          | a.com/#/pageone   a.com/#/pagetwo                            | a.com/pageone.html   a.com/pagetwo.html      |
| 用户体验          | 页面片段间的切换快，用户体验良好                             | 页面切换加载缓慢，流畅度不够，用户体验比较差 |
| 转场动画          | 容易实现                                                     | 无法实现                                     |
| 数据传递          | 容易                                                         | 依赖 url传参、或者cookie 、localStorage等    |
| 搜索引擎优化(SEO) | 需要单独方案、实现较为困难、不利于SEO检索 可利用服务器端渲染(SSR)优化 | 实现方法简易                                 |
| 试用范围          | 高要求的体验度、追求界面流畅的应用                           | 适用于追求高度支持搜索引擎的应用             |
| 开发成本          | 较高，常需借助专业的框架                                     | 较低 ，但页面重复代码多                      |
| 维护成本          | 相对容易                                                     | 相对复杂                                     |



单页面应用程序将所有的活动局限于一个Web页面中，在该Web页面初始化时加载相应的HTML、JavaScript 和 CSS。一旦页面加载完成，单页面应用不会因为用户的操作而进行页面的重新加载或跳转。取而代之的是利用 JavaScript 动态的变换HTML的内容，从而实现UI与用户的交互。由于避免了页面的重新加载，单页面应用可以提供较为流畅的用户体验。

#### 单页面应用的优点

- 良好的交互体验

单页应用的内容的改变不需要重新加载整个页面，获取数据也是通过Ajax异步获取，没有页面之间的切换，就不会出现“白屏现象”,也不会出现假死并有“闪烁”现象，页面显示流畅

- 良好的前后端工作分离模式

后端不再负责模板渲染、输出页面工作，后端API通用化，即同一套后端程序代码，不用修改就可以用于Web界面、手机、平板等多种客户端

- 减轻服务器压力

单页应用相对服务器压力小，服务器只用出数据就可以，不用管展示逻辑和页面合成，吞吐能力会提高几倍

#### 缺点

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

#### seo怎么做

##### 1. TKD设置

指对网站中的title标签(标题)、keywords标签(关键词)、description标签(描述)进行seo优化设置

页面TKD要包含品牌词及业务词，提升页面排名

例如：掘金的 TKD

Title：掘金 - 代码不止，掘金不停

Keywords：掘金,稀土,Vue.js,前端面试题,nginx配置,Kotlin,RxJava,React Native,敏捷开发,Python

Description：掘金是一个帮助开发者成长的社区,是给开发者用的 `Hacker News`,给设计师用的 `Designer News`,和给产品经理用的 `Medium`。掘金的技术文章由稀土上聚集的技术大牛和极客共同编辑为你筛选出最优质的干货,其中包括：`Android、iOS`、前端、后端等方面的内容。用户每天都可以在这里找到技术世界的头条内容。与此同时,掘金内还有沸点、掘金翻译计划、线下活动、专栏文章等内容。即使你是 `GitHub、StackOverflow、`开源中国的用户,我们相信你也可以在这里有所收获。

![image.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202301134.webp)

##### 2. 页面内容优化

（1）网页代码语义化调整：多使用语义话标签，便于爬虫检索。

（2）页面内容关键词强化：在页面大小标题和文案中重复关键词，以达到内容强化目的；关键词汇避免使用图片，便于爬虫检索，收录。

（3）img 添加 alt 属性，用 h1 标签去写内容关键字

##### 3. 引导链接

网站底部推荐部分保留产品介绍、常见问题汇总等降低跳出率的引导，提高页面留存与转化；或者与所推荐页面形成互链形式，以稳定页面流量权重。

##### 4. 移动端优化

设置移动页面，或将pc页面设置为自适应，增加移动端搜索的体验和留存转化。

移动页面设计需注意以下规则：

（1）页面字体、字符大小、文本行间距等设计，应适合手机用户阅读，不可明显过大过小，正文文本字号不小于10pt。

（2）首屏主体内容必须占屏幕的50%以上。

（3）主体内容应与其他板块有明显区分，且位于屏幕的中心位置，使用户获取信息时不受任何干扰。

（4）导航的功能与位置明确，避免用户使用过程中被误导。

（5）除以上提到的内容外，网站还应避免其他影响页面内容辨识的情况，例如页面出现大面积空白、文本无任何排版、段落/图片排版错乱不整齐、主体内容展示不全等。

##### 5. 站外优化

（1）在搜素引擎排名较高的公众平台（百家号 ，知道，贴吧、搜狐、知乎等）发布正面网站信息，以建设良好口碑 ；负面信息排名较高的需删除或者屏蔽处理。

（2）百度，互动，搜狗等百科的创建更新与维护，(互动百科在今日头条有着较高的排名，现在今日头条也在发展搜素引擎)，百科对树立品牌形象较为重要。

（3）公关舆情传播，宣传新闻源发布。

（4）站外推广与外链建设。

根据竞争对手及品牌业务分析，拓展高质量、高权重的外链渠道、科技论坛、自媒体平台、分类信息网等，发布高质量锚文本外链，另进行友情链接交换，以提高关键词排名及自然流量。

### 13.Js实现history路由变化监听

通过history的改变，进行js操作加载页面，然而history并不像hash那样简单，因为history的改变，除了浏览器的几个前进后退（使用 history.back(), history.forward()和 history.go() 方法来完成在用户历史记录中向后和向前的跳转。）等操作会主动触发popstate 事件，pushState，replaceState 并不会触发popstate事件

首先完成一个订阅-发布模式，然后重写history.pushState, history.replaceState,并添加消息通知，这样一来只要history的无法实现监听函数就被我们加上了事件通知，只不过这里用的不是浏览器原生事件，而是通过我们创建的event-bus  来实现通知，然后触发事件订阅函数的执行。

#### 订阅-发布模式示例

```javascript
class Dep {                  // 订阅池
    constructor(name){
        this.id = new Date() //这里简单的运用时间戳做订阅池的ID
        this.subs = []       //该事件下被订阅对象的集合
    }
    defined(){              // 添加订阅者
        Dep.watch.add(this);
    }
    notify() {              //通知订阅者有变化
        this.subs.forEach((e, i) => {
            if(typeof e.update === 'function'){
                try {
                   e.update.apply(e)  //触发订阅者更新函数
                } catch(err){
                    console.warr(err)
                }
            }
        })
    }
    
}
Dep.watch = null;

class Watch {
    constructor(name, fn){
        this.name = name;       //订阅消息的名称
        this.id = new Date();   //这里简单的运用时间戳做订阅者的ID
        this.callBack = fn;     //订阅消息发送改变时->订阅者执行的回调函数     
    }
    add(dep) {                  //将订阅者放入dep订阅池
       dep.subs.push(this);
    }
    update() {                  //将订阅者更新方法
        var cb = this.callBack; //赋值为了不改变函数内调用的this
        cb(this.name);          
    }
}

```

#### 重写history方法，并添加window.addHistoryListener事件机制

下面我们只需要对history的方法进行重写，并添加event-bus即可，代码如下：

```js
var addHistoryMethod = (function(){
        var historyDep = new Dep();
        return function(name) {
            if(name === 'historychange'){
                return function(name, fn){
                    var event = new Watch(name, fn)
                    Dep.watch = event;
                    historyDep.defined();
                    Dep.watch = null;       //置空供下一个订阅者使用
                }
            } else if(name === 'pushState' || name === 'replaceState') {
                var method = history[name];
                return function(){
                    method.apply(history, arguments);
                    historyDep.notify();
                }
            }
            
        }
}())

window.addHistoryListener = addHistoryMethod('historychange');
history.pushState =  addHistoryMethod('pushState');
history.replaceState =  addHistoryMethod('replaceState');

```

#### 测试History事件监听

上面我们给window添加了一个addHistoryListener事件监听，类似于 addEventListener的方法，然后我们有做了history的pushState， replaceState的改写，接下来我们测试一下。

```javascript
window.addHistoryListener('history',function(){
    console.log('窗口的history改变了');
})
window.addHistoryListener('history',function(){
    console.log('窗口的history改变了-我也听到了');
})
history.pushState({first:'first'}, "page2", "/first")
```

### 14.Js实现hash路由

[原生js实现一个路由hash router](http://t.zoukankan.com/littleboyck-p-13607016.html)

[手动实现hash模式前端路由](https://juejin.cn/post/6844903924206403591)

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>
    <a href="#/" data-href="/">home</a>
    <a href="#/book" data-href="/">book</a>
    <a href="#/movie" data-href="/">movie</a>
    <div id="content">

    </div>
    <script src="https://cdn.bootcss.com/vue/2.6.10/vue.min.js"></script>
    <script>
        // window.onload = function (params) {
        //     window.location.href += '#/' 
        // }

        const Home = {
            template: '<div>home</div>'
        }
        const Book = {
            template: '<div>book</div>'
        }
        const Movie = {
            template: '<div>movie</div>'
        }
        class Router {
            constructor(opts) {
                // this.path = opts.path;
                // this.component = opts.component;
                // this.routes = opts.routes;
                this.routes = {

                }
                // console.log(opts);
                
                opts.forEach(item => {
                    this.route(item.path,()=>{
                        document.getElementById('content').innerHTML = item.component;
                    })
                })
                console.log(this.routes);
                
                this.init()
            }
            bindEvent() { }
            init() {
                window.addEventListener('load',this.updateView.bind(this))
                window.addEventListener('hashchange', this.updateView.bind(this))

            }
            updateView(e) {
                // console.log(e,'updated');
                // console.log(e.newURL.indexOf(e.oldURL));

                // console.log(e.newURL.substring(e.newURL.indexOf(e.oldURL)));
                const hashTag = window.location.hash.slice(1) || '/'
                console.log(window.location.hash.slice(1));
                this.routes[hashTag] && this.routes[hashTag]()

            }
            route(path,cb){
                this.routes[path] = cb;
            }
        }
        new Router([
            {
                path: '/',
                component: 'home',
            },
            {
                path: '/book',
                component: 'book'
            },
            {
                path: '/movie',
                component: 'movie'
            }
        ])
    </script>
</body>

</html>
```



### 15.vue router基本原理

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

![类图](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202301604.png)

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

```js
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

![b025e120ca3d0bd2ded3d038d58cacf4.jpg](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202301928.webp) 

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

### 6.vuex持久化

vuex的 store 中的数据是保存在运行内存中的，当页面刷新时，页面会重新加载 vue 实例，vuex 里面的数据就会被重新赋值，这样就会出现页面刷新vuex中的数据丢失的问题。 如何解决浏览器刷新数据丢失问题呢？

#### 方法一：

全局监听，页面刷新的时候将 store 里 state 的值存到 sessionStorage 中，然后从sessionStorage 中获取，再赋值给 store ，并移除 sessionStorage 中的数据。在 app.vue 中添加以下代码：

```js
 created() {
    window.addEventListener('beforeunload',()=>{
       sessionStorage.setItem('list', JSON.stringify(this.$store.state))
    })
    
    try{
      sessionStorage.getItem('list') && this.$store.replaceState(Object.assign({},this.$store.state,JSON.parse(sessionStorage.getItem('list'))))
    }catch(err) {
      console.log(err);
    }
  
    sessionStorage.removeItem("list");
  }
 注意!!! storage 只能存储字符串的数据，对于 JS 中常用的数组或对象不能直接存储。但我们可以通过JSON 对象提供的 parse 和 stringify 方法将其他数据类型转化成字符串，再存储到storage中就可以了。
```

#### 方法二：

安装 vuex-persistedstate 插件

```js
1. npm install vuex-persistedstate -S //安装插件
2. 在 store/index.js 文件中添加以下代码：
import persistedState from 'vuex-persistedstate'
const store = new Vuex.Store({
 state:{},
 getters:{},
 ...
 plugins: [persistedState()] //添加插件
})
注意!!! vuex-persistedstate 默认使用 localStorage 来存储数据，若要实现无痕浏览该如何实现呢？
```

这时候就需要使用 sessionStorage 进行存储，修改 plugins 中的代码

```js
plugins: [
    persistedState({ storage: window.sessionStorage })
]
```

### 7.Vuex为什么是响应式的

#### `vuex`响应式原理

一旦理解了`vue`的模板如何响应数据变化，那么`vuex`就好理解了

`vuex`本质上是将`state`值绑定到了一个`vue`对象上，请看超简略源码：

```js
class Store {
    constructor(options){
        this.state = new Vue({
            data:options.state
        })
    }
}
```

于是当我们在`test.vue`中写出这种代码：

```js
<template>
	<div>{{ $store.state.xx }}</div>
</template>
```

`test.vue`实例`mount`的时候执行`updateComponent`，就会为`updateComponent`函数绑定一个依赖：`Store.state.xx`这个属性的`Dep`对象（暂时命名为`xxDep`,便于后续说明）

那么一旦通过`commit`或其他手段更新了属性`Store.state.xx`，`xxDep`就会通知`updateComponent`所绑定的`Watcher`去执行`update`

```js
Watcher.prototype.update = function(){
	if (this.lazy) {
    	...
    } else {
    	// 将此watcher加入队列，在nextick中执行
        // 最终会执行到Watcher.getter，本例中也就是updateComponent
		queueWatcher(this);
	}
}
```

从而最终又执行到了`updateComponent`去更新dom树，而在执行`updateComponent`过程中解析dom树时会重新获取`{{ $store.state.xx }}`，从而正确的更新了dom，实现了`store.state`到`vue`对象的绑定

#### store.getters

上面讲了`store.state`如何绑定到`vue`对象，那么`store.getters`呢？

```js
var wrappedGetters = store._wrappedGetters;
var computed = {};
forEachValue(wrappedGetters, function (fn, key) {
  computed[key] = partial(fn, store);
  Object.defineProperty(store.getters, key, {
    get: function () { return store._vm[key]; },
    enumerable: true // for local getters
  });
});

store._vm = new Vue({
  data: {
    $$state: state
  },
  computed: computed
});
```

可以看到对于每个getters的值，最终放在两个地方：`store.getters`, `store`内部的`vue`对象上的`computed`属性，`computed`属性的双向绑定机制跟`data`属性类似，这里不多讲

而通过`store.getters.key`获取的值根据以上代码，得到的是`store._vm[key]`,而这个就是`computed[key]`,因为`computed`属性都会绑定到`vm`对象上。所以`store.getters[key]===computed[key]`，是完完全全的同一个值

#### 装载到`vue`

`vue2`中使用`vuex`需要执行`vue.use(vuex)`。最终会执行到`vuex`的`install`方法

```js
// 初始化全局Vue对象时挂载store，并在跟元素上生成
new Vue({
    store,
    ...
})

function install() {
    Vue.mixin({
        beforeCreate() {
            if (this.$options.store) {
                this.$store = this.$options.store // 这里对应根组件
                return
            }
            this.$store = this.$parent.$store // 其他组件逐级向上取
        } 
    })
}
```

通过生命周期给每个组件单独挂载`$store`，而不是直接`Vue.prototype.$store =`，这样可以防止声明多个`vuex`实例后覆盖

```
vue3`中挂载`vuex`要执行`app.use(store)`。最终会执行到`Store.prototype.install
function install (app, injectKey) {
    // globalProperties属性上挂载的属性可以在app下所有组件实例中访问到
    app.config.globalProperties.$store = this;
}
```

### 8.Vuex源码分析

[Vuex源码分析](https://juejin.cn/post/6895980141466386440)



```js
// store/index
import Vue from 'vue'
import Vuex from 'vuex'
import cart from './modules/cart'
import products from './modules/products'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    rootState: 'rootState'
  },
  mutations: {
    rootMutation (state, payload) {
      state.value = payload
    }
  },
  actions: {
    rootAction ({ commit }, payload) {
      commit('updateValue', payload)
    }
  },
  getters: {
    rootGetter: state => state.rootState
  },
  modules: {
    cart,
    products
  },
})

```

```js
// app.js
import Vue from 'vue'
import store from './store'

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})

```

使用vuex有如下3个步骤；

  **1. 显式地通过 Vue.use() 来安装 Vuex；**

  **2. 通过 Vuex.Store 构造与实际业务相关的 store;**

  **3. 在 Vue 的实例化时，添加 store 属性；**

Vuex是专门为Vuejs应用程序设计的**状态管理工具**。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

#### **1、Vuex的构成和使用**



![img](https://pic4.zhimg.com/v2-f330e46f1a97cfe60b8914802688083b_r.jpg)



由上图，我们可以看出Vuex有以下几个部分构成：

**1）state**

state是存储的单一状态，是存储的基本数据。

**2）Getters**

getters是store的计算属性，对state的加工，是派生出来的数据。就像computed计算属性一样，getter返回的值会根据它的依赖被缓存起来，且只有当它的依赖值发生改变才会被重新计算。

**3）Mutations**

mutations提交更改数据，使用store.commit方法更改state存储的状态。（mutations同步函数）

**4）Actions**

actions像一个装饰器，提交mutation，而不是直接变更状态。（actions可以包含任何异步操作）

**5）Module**

Module是store分割的模块，每个模块拥有自己的state、getters、mutations、actions。

```js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

**6）辅助函数**

Vuex提供了mapState、MapGetters、MapActions、mapMutations等辅助函数给开发在vm中处理store。



![img](https://pic1.zhimg.com/v2-90437dee8c4d7b465b2d0e6e07778ff0_r.jpg)



```text
import Vuex from 'vuex';
Vue.use(Vuex); // 1. vue的插件机制，安装vuex
let store = new Vuex.Store({ // 2.实例化store，调用install方法
    state,
    getters,
    modules,
    mutations,
    actions,
    plugins
});
new Vue({ // 3.注入store, 挂载vue实例
    store,
    render: h=>h(app)
}).$mount('#app');
```

**Vuex的设计思想**

Vuex的设计思想，借鉴了Flux、Redux，将数据存放到全局的store，再将store挂载到每个vue实例组件中，利用Vue.js的细粒度数据响应机制来进行高效的状态更新。

看了Vuex设计思想，心里难免会有这样的疑问：

- vuex的store是如何挂载注入到组件中呢？
- vuex的state和getters是如何映射到各个组件实例中响应式更新状态呢？

#### 2.**Vuex的原理解析**

我们来看下vuex的源码，分析看看上面2个疑惑的问题：

**疑问1：vuex的store是如何挂载注入到组件中呢？**

1、在vue项目中先安装vuex，核心代码如下：

```text
import Vuex from 'vuex';
Vue.use(vuex);// vue的插件机制
```

2、利用vue的[插件机制](https://cn.vuejs.org/v2/guide/plugins.html)，使用Vue.use(vuex)时，会调用vuex的install方法，装载vuex，install方法的代码如下：

```text
export function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}
```

3、applyMixin方法使用vue[混入机制](https://cn.vuejs.org/v2/guide/mixins.html)，vue的生命周期beforeCreate钩子函数前混入vuexInit方法，核心代码如下：

```text
Vue.mixin({ beforeCreate: vuexInit });

function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
}
```

分析源码，我们知道了vuex是利用vue的mixin混入机制，在beforeCreate钩子前混入vuexInit方法，vuexInit方法实现了store注入vue组件实例，并注册了vuex store的引用属性$store。store注入过程如下图所示：

![img](https://pic4.zhimg.com/v2-a8b969f8771a1fc13b7cedfdfe86f0e7_r.jpg)



**疑问2：vuex的state和getters是如何映射到各个组件实例中响应式更新状态呢？**

store实现的源码在src/store.js

1、我们在源码中找到resetStoreVM核心方法：

```text
function resetStoreVM (store, state, hot) {
  const oldVm = store._vm

  // 设置 getters 属性
  store.getters = {}
  const wrappedGetters = store._wrappedGetters
  const computed = {}
  // 遍历 wrappedGetters 属性
  forEachValue(wrappedGetters, (fn, key) => {
    // 给 computed 对象添加属性
    computed[key] = partial(fn, store)
    // 重写 get 方法
    // store.getters.xx 其实是访问了store._vm[xx]，其中添加 computed 属性
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true // for local getters
    })
  })

  const silent = Vue.config.silent
  Vue.config.silent = true
  // 创建Vue实例来保存state，同时让state变成响应式
  // store._vm._data.$$state = store.state
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
  Vue.config.silent = silent

  // 只能通过commit方式更改状态
  if (store.strict) {
    enableStrictMode(store)
  }
}
```

从上面源码，我们可以看出Vuex的state状态是响应式，是借助vue的data是响应式，将state存入vue实例组件的data中；Vuex的getters则是借助vue的计算属性computed实现数据实时监听。

computed计算属性监听data数据变更主要经历以下几个过程：

![img](https://pic3.zhimg.com/v2-2730644102b66eef140110b814a90496_r.jpg)



**小结**

Vuex是通过全局注入store对象，来实现组件间的状态共享。在大型复杂的项目中（多级组件嵌套），需要实现一个组件更改某个数据，多个组件自动获取更改后的数据进行业务逻辑处理，这时候使用vuex比较合适。假如只是多个组件间传递数据，使用vuex未免有点大材小用，其实只用使用组件间常用的通信方法即可。

Vue组件简单常用的通信方式有以下几种：

1、父子通信：

父向子传值，通过props；子向父传值通过events ($emit)；父调用子方法通过ref；provide / inject。

2、兄弟通信：bus

3、跨级嵌套通信：bus；provide / inject等。



### 9.Pinia和Vuex对比

完整的 typescript 的支持；

足够轻量，压缩后的体积只有1.6kb;

去除 mutations，只有 state，getters，actions（这是我最喜欢的一个特点）；

actions 支持同步和异步；

没有模块嵌套，只有 store 的概念，store 之间可以自由使用，更好的代码分割；

### 10.手写vuex

index.js

```js
import Vue from 'vue'
// import Vuex from 'vuex' //引用三方库
import Vuex from './vuex'  //使用自定义vuex.js

Vue.use(Vuex)  //使用插件

//每一个vue实例中都有一个属性$store
export default new Vuex.Store({
  state: {
    num: 1
  },
  getters: {
    getNum(state) {
      return state.num;
    }
  },
  mutations: {  //同步
    //payload---传入参数
    syncAdd(state, payload) {
      state.num += payload;
    },
    syncMinus(state, payload) {
      state.num -= payload;
    }
  },
  actions: {  //异步
    asyncAdd({commit, dispatch}, payload) {
      //模拟ajax
      setTimeout(()=>{
        //调用mutation
        commit("syncAdd", payload);
      }, 1000)
    }
  },
  modules: {
  }
})
```

vuex.js

```js
//自己实现vuex
let Vue;

const forEach = (obj, callback) => {
    Object.keys(obj).forEach(key => {
        callback(key, obj[key]);
    })
}

class Store{
    constructor(options){
        this.vm = new Vue({
            data: {
                state: options.state
            }
        })

        //for getters
        let getters = options.getters || {}
        this.getters = {}
        //把getters中属性定义到this.getters
        Object.keys(getters).forEach(getterName=>{
            Object.defineProperty(this.getters, getterName, {
                get: ()=>{
                    return getters[getterName](this.state);
                }
            })
        })
        //for mutations
        let mutations = options.mutations || {}
        this.mutations = {}
        Object.keys(mutations).forEach(mutationName=>{
            this.mutations[mutationName] = payload => {
                mutations[mutationName](this.state, payload);
            }
        })
        //for actions
        let actions = options.actions || {}
        this.actions = {}
        Object.keys(actions).forEach(actionName=>{
            this.actions[actionName] = payload=>{
                actions[actionName](this, payload);
            }
        })
    }
    dispatch(type, payload) {
        this.actions[type](payload);
    }
    commit = (type, payload)=>{
        console.log(this)
        this.mutations[type](payload)
    }
    get state(){
        return this.vm.state;
    }
}

// 安装插件
// 目的：让每一个组件都有$store
const install = (_Vue)=>{
    Vue = _Vue;
    //给每一个组件都注册一个beforeCreate
    Vue.mixin({
        beforeCreate(){
            console.log(this.$options.name)
            if (this.$options && this.$options.store) {
                //根
                this.$store = this.$options.store;
            } else {
                //子
                this.$store = this.$parent && this.$parent.$store;
            }
        }
    })
}

export default {
    install, Store
}
```



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

- 支持 Fragment（多个根节点）和 Protal（在 dom 其他部分渲染组建内容）组件，针对一些特殊的场景做了处理。
- 基于 tree shaking 优化，提供了更多的内置功能。
- 生命周期   名称发生变化  使用setup    在 beforeCreate 钩子之前调用
- diff算法 

#### 1. vue2和vue3响应式原理发生了改变

**vue2** 的双向数据绑定是利用ES5 的一个 [API](https://so.csdn.net/so/search?q=API&spm=1001.2101.3001.7020) `Object.definePropert()`对数据进行劫持 结合 发布订阅模式的方式来实现的。

**vue3** 中使用了 [es6](https://so.csdn.net/so/search?q=es6&spm=1001.2101.3001.7020) 的 `Proxy`API 对数据代理。

> 相比于vue2.x，使用proxy的优势如下
>
> 1. defineProperty只能监听某个属性，不能对全对象监听
> 2. 可以省去for in、闭包等内容来提升效率（直接绑定整个对象即可）
> 3. 可以监听数组，不用再去单独的对数组做特异性操作 vue3.x可以检测到数组内部数据的变化

在vue2中只需要在data里定义数据，就可以实现数据层-视图层的双向绑定，而在vue3中使用ref接受一个内部值并返回一个响应式且可变的 ref 对象。ref 对象具有指向内部值的单个 property.value

reactive的作用和ref的作用是类似的，都是将数据变成可相应的对象，其实ref的底层其实利用了reactive。 两者的区别，ref包装的对象需要.value ,而reactive中的不需要

#### 2. Vue3支持碎片(Fragments)

就是说在组件可以拥有多个根节点。
**vue2**

```html
<template>
  <div class='form-element'>
  <h2> {{ title }} </h2>
  </div>
</template>
```

**vue3**

```html
<template>
  <div class='form-element'>
  </div>
   <h2> {{ title }} </h2>
</template>
```

#### 3. Composition API

Vue2与Vue3 `最大的`区别 — Vue2使用选项类型API（Options API）对比Vue3合成型API（Composition API）

> 旧的选项型API在代码里分割了不同的属性: data,computed属性，methods，等等。新的合成型API能让我们用方法（function）来分割，相比于旧的API使用属性来分组，`这样代码会更加简便和整洁`。

`Composition API`也叫组合式API，是Vue3.x的新特性。

> 通过创建 Vue 组件，我们可以将接口的可重复部分及其功能提取到可重用的代码段中。仅此一项就可以使我们的应用程序在可维护性和灵活性方面走得更远。然而，我们的经验已经证明，光靠这一点可能是不够的，尤其是当你的应用程序变得非常大的时候——想想几百个组件。在处理如此大的应用程序时，共享和重用代码变得尤为重要

- Vue2.0中，随着功能的增加，组件变得越来越复杂，越来越难维护，而难以维护的根本原因是Vue的API设计迫使开发者使用`watch，computed，methods`选项组织代码，而不是实际的业务逻辑。
- 另外Vue2.0缺少一种较为简洁的低成本的机制来完成逻辑复用，虽然可以`minxis`完成逻辑复用，但是当`mixin`变多的时候，会使得难以找到对应的`data、computed`或者`method`来源于哪个`mixin`，使得类型推断难以进行。
- 所以`Composition API`的出现，主要是也是为了解决Option API带来的问题，第一个是代码组织问题，`Compostion API`可以让开发者根据业务逻辑组织自己的代码，让代码具备更好的可读性和可扩展性，也就是说当下一个开发者接触这一段不是他自己写的代码时，他可以更好的利用代码的组织反推出实际的业务逻辑，或者根据业务逻辑更好的理解代码。
- 第二个是实现代码的逻辑提取与复用，当然`mixin`也可以实现逻辑提取与复用，但是像前面所说的，多个`mixin`作用在同一个组件时，很难看出`property`是来源于哪个`mixin`，来源不清楚，另外，多个`mixin`的`property`存在变量命名冲突的风险。而`Composition API`刚好解决了这两个问题。

**vue2**

```js
export default {
  props: {
    title: String
  },
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login () {
      // 登陆方法
    }
  },
  components:{
            "buttonComponent":btnComponent
        },
  computed:{
	  fullName(){
	    return this.firstName+" "+this.lastName;     
	  }
}
 
}
```

**vue3**

```js
export default {
  props: {
    title: String
  },
  
  setup () {
    const state = reactive({ //数据
      username: '',
      password: '',
      lowerCaseUsername: computed(() => state.username.toLowerCase()) //计算属性
    })
     //方法
    const login = () => {
      // 登陆方法
    }
    return { 
      login,
      state
    }
  }
}
```

#### 4. 建立数据 data

**Vue2 - 这里把数据放入data属性中**

```js
export default {
  props: {
    title: String
  },
  data () {
    return {
      username: '',
      password: ''
    }
  }
}
```

在Vue3.0，我们就需要使用一个新的setup()方法，此方法在组件初始化构造的时候触发。

使用以下三步来建立反应性数据:

1. 从vue引入reactive
2. 使用reactive()方法来声名我们的数据为响应性数据
3. 使用setup()方法来返回我们的响应性数据，从而我们的template可以获取这些响应性数据

```js
import { reactive } from 'vue'

export default {
  props: {
    title: String
  },
  setup () {
    const state = reactive({
      username: '',
      password: ''
    })

    return { state }
  }
}
```

template使用，可以通过state.username和state.password获得数据的值。

```html
<template>
  <div>
    <h2> {{ state.username }} </h2>
  </div>
</template>
```

#### 5. 生命周期钩子 — Lifecyle Hooks

```js
Vue2--------------vue3
beforeCreate  -> setup()
created       -> setup()
beforeMount   -> onBeforeMount
mounted       -> onMounted
beforeUpdate  -> onBeforeUpdate
updated       -> onUpdated
beforeDestroy -> onBeforeUnmount
destroyed     -> onUnmounted
activated     -> onActivated
deactivated   -> onDeactivated
```

1. setup() :开始创建组件之前，在beforeCreate和created之前执行。创建的是data和method
2. onBeforeMount() : 组件挂载到节点上之前执行的函数。
3. onMounted() : 组件挂载完成后执行的函数。
4. onBeforeUpdate(): 组件更新之前执行的函数。
5. onUpdated(): 组件更新完成之后执行的函数。
6. onBeforeUnmount(): 组件卸载之前执行的函数。
7. onUnmounted(): 组件卸载完成后执行的函数

- 若组件被`<keep-alive>`包含，则多出下面两个钩子函数。

1. onActivated(): 被包含在中的组件，会多出两个生命周期钩子函数。被激活时执行 。
2. onDeactivated(): 比如从 A组件，切换到 B 组件，A 组件消失时执行。

#### 6.父子传参不同，setup() 函数特性

总结：
1、setup 函数时，它将接受两个参数：（props、context(包含attrs、slots、emit)）

2、setup函数是处于 生命周期函数 beforeCreate 和 Created 两个钩子函数之前的函数

3、执行 setup 时，组件实例尚未被创建（在 setup() 内部，this 不会是该活跃实例的引用，即不指向vue实例，Vue 为了避免我们错误的使用，直接将 `setup函数中的this修改成了 undefined`）

4、与模板一起使用：需要返回一个对象 (在setup函数中定义的变量和方法最后都是需要 return 出去的 不然无法再模板中使用)

5、使用渲染函数：可以返回一个渲染函数，该函数可以直接使用在同一作用域中声明的响应式状态

**注意事项：**

1、setup函数中不能使用this。Vue 为了避免我们错误的使用，直接将 `setup函数中的this修改成了 undefined`）

2、setup 函数中的 props 是响应式的，当传入新的 prop 时，它将被更新。但是，因为 props 是响应式的，你`不能使用 ES6 解构`，因为它会消除 prop 的响应性。

如果需要解构 prop，可以通过使用 setup 函数中的`toRefs` 来完成此操作：
**父传子，props**

```js
import { toRefs } from 'vue'
 
setup(props) {
	const { title } = toRefs(props)
 
	console.log(title.value)
	 onMounted(() => {
      console.log('title: ' + props.title)
    })

}
```

**子传父，事件 - Emitting Events**

举例，现在我们想在点击提交按钮时触发一个login的事件。

在 Vue2 中我们会调用到this.$emit然后传入事件名和参数对象。

```js
login () {
      this.$emit('login', {
        username: this.username,
        password: this.password
      })
 }
```

在setup()中的第二个参数content对象中就有emit，这个是和this.$emit是一样的。那么我们只要在setup()接收第二个参数中使用分解对象法取出emit就可以在setup方法中随意使用了。

然后我们在login方法中编写登陆事件
另外：context 是一个普通的 JavaScript 对象，也就是说，它不是响应式的，这意味着你可以安全地对 context 使用 ES6 解构

```js
setup (props, { attrs, slots, emit }) {
    // ...
    const login = () => {
      emit('login', {
        username: state.username,
        password: state.password
      })
    }

    // ...
}

```

3、 setup()内使用响应式数据时，需要通过.value获取

```js
import { ref } from 'vue'
 
const count = ref(0)
console.log(count.value) // 0
```

4、从 setup() 中返回的对象上的 property 返回并可以在模板中被访问时，它将自动展开为内部值。不需要在模板中追加 .value

5、setup函数只能是同步的不能是异步的

#### 7. vue3 Teleport瞬移组件

Teleport一般被翻译成瞬间移动组件,实际上是不好理解的.我把他理解成"独立组件",
他可以那你写的组件挂载到任何你想挂载的DOM上,所以是很自由很独立的
以一个例子来看:编写一个弹窗组件

```html
<template>
<teleport to="#modal">
  <div id="center" v-if="isOpen">
    <h2><slot>this is a modal</slot></h2>
    <button @click="buttonClick">Close</button>
  </div>
</teleport>
</template>
<script lang="ts">

export default {
  props: {
    isOpen: Boolean,
  },
  emits: {
    'close-modal': null
  },
  setup(props, context) {
    const buttonClick = () => {
      context.emit('close-modal')
    }
    return {
      buttonClick
    }
  }
}
</script>
<style>
  #center {
    width: 200px;
    height: 200px;
    border: 2px solid black;
    background: white;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -100px;
    margin-top: -100px;
  }
</style>
```

在app.vue中使用的时候跟普通组件调用是一样的

```html
<template>
<div id="app">
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
  <HooksDemo></HooksDemo>
  <button @click="openModal">Open Modal</button><br/>
<modal :isOpen="modalIsOpen" @close-modal="onModalClose"> My Modal !!!!</modal>
</div>
  
</template>
<script>
import HelloWorld from './components/HelloWorld.vue'
import HooksDemo from './components/HooksDemo.vue'
import Modal from './components/Modal.vue'
import{ref} from 'vue'
export default {
  name: 'App',
  components: {
    HelloWorld,
    HooksDemo,
    Modal
  },
  setup() {
    const modalIsOpen = ref(false)
    const openModal = () => {
      modalIsOpen.value = true
    }
    const onModalClose = () => {
      modalIsOpen.value = false
    }
    return {
      modalIsOpen,
      openModal,
      onModalClose
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

要是在app.vue文件中使用的时候,modal是在app的 DOM节点之下的,父节点的dom结构和css都会给modal产生影响
于是产生的问题

1. modal被包裹在其它组件之中，容易被干扰
2. 样式也在其它组件中，容易变得非常混乱

Teleport 可以把modal组件渲染到任意你想渲染的外部Dom上,不必嵌套在#app中,这样就可以互不干扰了,可以把Teleport看成一个传送门,把你的组件传送到任何地方
使用的时候 to属性可以确定想要挂载的DOM节点下面

```html
<template>
  <teleport to="#modal">
    <div id="center">
      <h2>柏特better</h2>
    </div>
  </teleport>
</template>

12345678
```

在public文件夹下的index.html中增加一个节点

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <noscript>
      <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
    <div id="modal"></div>
    <!-- built files will be auto injected -->
  </body>
</html>

12345678910111213141516171819
```

这样可以看到modal组件就是没有挂载在app下,不再受app组件的影响了



### 2.Proxy的优点

#### proxy使用

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

-   vue3使用 [proxy](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FProxy) 监听对象的变化

>   -   针对对象：针对整个对象，而不是对象的某个属性，所以也就不需要对 keys 进行遍历。
>   -   支持数组：Proxy 不需要对数组的方法进行重载，省去了众多 hack，减少代码量等于减少了维护成本，而且标准的就是最好的。
>   -   Proxy 的第二个参数可以有 13 种拦截方法，这比起 Object.defineProperty() 要更加丰富
>   -   Proxy 作为新标准受到浏览器厂商的重点关注和性能优化，相比之下 Object.defineProperty() 是一个已有的老方法。

每当我们改变代理对象(vue2对象)的时候，比如我们新增一个`age`属性，即使`change`函数里面没有使用到`age`, 我们也会触发`change`函数。 所以我们要正确收集依赖，怎样正确收集依赖呢

-   不同的对象单独存储
-   同一个对象不同属性也要单独存储

-   存储对象我们可以使用 [WeakMap](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FWeakMap)

>   **`WeakMap`** 对象是一组键/值对的集合，其中的键是弱引用(原对象销毁的时候可以被垃圾回收)的。其键必须是`对象`，而值可以是任意的。

-   存储对象不同属性可以使用 [Map](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FMap)

>   **`Map`** 对象保存键值对，并且能够记住键的原始插入顺序。任何值(对象或者[原始值](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FGlossary%2FPrimitive)) 都可以作为一个键或一个值。

### 3.Vue3的响应式

[手写简单vue3响应式原理](https://juejin.cn/post/7134281691295645732)

vue2跟vue3实现方式不同：

-   vue2使用 Object.defineProperty() 劫持对象监听数据的变化

>   -   不能监听数组的变化
>   -   必须遍历对象的每个属性
>   -   必须深层遍历嵌套的对象

-   vue3使用 [proxy](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FProxy) 监听对象的变化

>   -   针对对象：针对整个对象，而不是对象的某个属性，所以也就不需要对 keys 进行遍历。
>   -   支持数组：Proxy 不需要对数组的方法进行重载，省去了众多 hack，减少代码量等于减少了维护成本，而且标准的就是最好的。
>   -   Proxy 的第二个参数可以有 13 种拦截方法，这比起 Object.defineProperty() 要更加丰富
>   -   Proxy 作为新标准受到浏览器厂商的重点关注和性能优化，相比之下 Object.defineProperty() 是一个已有的老方法。

#### 依赖收集

每当我们改变代理对象(vue2对象)的时候，比如我们新增一个`age`属性，即使`change`函数里面没有使用到`age`, 我们也会触发`change`函数。 所以我们要正确收集依赖，怎样正确收集依赖呢

-   不同的对象单独存储
-   同一个对象不同属性也要单独存储

-   存储对象我们可以使用 WeakMap

>   **`WeakMap`** 对象是一组键/值对的集合，其中的键是弱引用(原对象销毁的时候可以被垃圾回收)的。其键必须是`对象`，而值可以是任意的。

-   存储对象不同属性可以使用 [Map](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FMap)

>   **`Map`** 对象保存键值对，并且能够记住键的原始插入顺序。任何值(对象或者[原始值](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FGlossary%2FPrimitive)) 都可以作为一个键或一个值。

![image.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202301735.webp)

```js
const targetMap = new WeakMap()
const getDepend = (target, key) => {
  // 根据target对象获取Map
  let desMap = targetMap.get(target)
  if (!desMap) {
    desMap = new Map()
    targetMap.set(target, desMap)
  }
  // 根据key获取 depend类
  let depend = desMap.get(key)
  if (!depend) {
    depend = new Depend()
    desMap.set(key, depend)
  }
  return depend
}
```



```js
const reactive = (obj) => {
  return new Proxy(obj, {
    get: (target, key) => {
      // 收集依赖
      const depend = getDepend(target, key)
      depend.addDepend()
      return Reflect.get(target, key)
    },
    set: (target, key, value) => {
      const depend = getDepend(target, key)
      Reflect.set(target, key, value)
      // 当值发生改变时 触发
      depend.notify()
    }
  })
}
```

在源码中

核心就是在访问响应式数据的时候，触发 `getter` 函数，进而执行 `track` 函数收集依赖：

```js
let shouldTrack = true
// 当前激活的 effect
let activeEffect
// 原始数据对象 map
const targetMap = new WeakMap()
function track(target, type, key) {
  if (!shouldTrack || activeEffect === undefined) {
    return
  }
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    // 每个 target 对应一个 depsMap
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    // 每个 key 对应一个 dep 集合
    depsMap.set(key, (dep = new Set()))
  }
  if (!dep.has(activeEffect)) {
    // 收集当前激活的 effect 作为依赖
    dep.add(activeEffect)
   // 当前激活的 effect 收集 dep 集合作为依赖
    activeEffect.deps.push(dep)
  }
}
```

分析这个函数的实现前，我们先想一下要收集的依赖是什么，我们的目的是实现响应式，就是当数据变化的时候可以自动做一些事情，比如执行某些函数，所以我们收集的依赖就是数据变化后执行的副作用函数。

`track` 函数拥有三个参数，其中 `target` 表示原始数据；`type` 表示这次依赖收集的类型；`key` 表示访问的属性。

`track` 函数外部创建了全局的 `targetMap` 作为原始数据对象的 `Map`，它的键是 `target`，值是 `depsMap`，作为依赖的 `Map`；这个 `depsMap` 的键是 `target` 的 `key`，值是 `dep` 集合，`dep` 集合中存储的是依赖的副作用函数。为了方便理解，可以通过下图表示它们之间的关系：

![image-20220828113446237](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsimage-20220828113446237.png)

因此每次执行 `track` 函数，就是把当前激活的副作用函数 `activeEffect` 作为依赖，然后收集到 `target` 相关的 `depsMap` 对应 `key` 下的依赖集合 `dep` 中

#### 派发通知

派发通知发生在数据更新的阶段，核心就是在修改响应式数据时，触发 `setter` 函数，进而执行 `trigger` 函数派发通知:

```js
const targetMap = new WeakMap()
function trigger(target, type, key) {
  // 通过 targetMap 拿到 target 对应的依赖集合
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    // 没有依赖，直接返回
    return
  }
  // 创建运行的 effects 集合
  const effects = new Set()
  // 添加 effects 的函数
  const add = (effectsToAdd) => {
    if (effectsToAdd) {
      effectsToAdd.forEach(effect => {
        effects.add(effect)
      })
    }
  }
  // SET | ADD | DELETE 操作之一，添加对应的 effects
  if (key !== void 0) {
    add(depsMap.get(key))
  }
  const run = (effect) => {
    // 调度执行
    if (effect.options.scheduler) {
      effect.options.scheduler(effect)
    }
    else {
      // 直接运行
      effect()
    }
  }
  // 遍历执行 effects
  effects.forEach(run)
}
```

`trigger` 函数拥有三个参数，其中 `target` 表示目标原始对象；`type` 表示更新的类型；`key` 表示要修改的属性。

`trigger` 函数 主要做了四件事情：

1. 从 `targetMap` 中拿到 `target` 对应的依赖集合 `depsMap`；
2. 创建运行的 `effects` 集合；
3. 根据 `key` 从 `depsMap` 中找到对应的 `effect` 添加到 `effects` 集合；
4. 遍历 `effects` 执行相关的副作用函数。

因此每次执行 `trigger` 函数，就是根据 `target` 和 `key`，从 `targetMap` 中找到相关的所有副作用函数遍历执行一遍。

在描述依赖收集和派发通知的过程中，我们都提到了一个词：副作用函数，依赖收集过程中我们把 `activeEffect`（当前激活副作用函数）作为依赖收集

#### 副作用函数

那么，什么是副作用函数，在介绍它之前，我们先回顾一下响应式的原始需求，即我们修改了数据就能自动做某些事情，举个简单的例子：

```js
import { reactive } from 'vue'
const counter = reactive({
  num: 0
})
function logCount() {
  console.log(counter.num)
}
function count() {
  counter.num++
}
logCount()
count()
复制代码
```

我们定义了响应式对象 `counter`，然后在 `logCount` 中访问了 `counter.num`，我们希望在执行 `count` 函数修改 `counter.num` 值的时候，能自动执行 `logCount` 函数。

按我们之前对依赖收集过程的分析，如果`logCount` 是 `activeEffect` 的话，那么就可以实现需求，但显然是做不到的，因为代码在执行到 `console.log(counter.num)` 这一行的时候，它对自己在 `logCount` 函数中的运行是一无所知的。

那么该怎么办呢？其实只要我们运行 `logCount` 函数前，把 `logCount` 赋值给 `activeEffect` 就好了：

```js
activeEffect = logCount 
logCount()
复制代码
```

顺着这个思路，我们可以利用高阶函数的思想，对 `logCount` 做一层封装：

```js
function wrapper(fn) {
  const wrapped = function(...args) {
    activeEffect = fn
    fn(...args)
  }
  return wrapped
}
const wrappedLog = wrapper(logCount)
wrappedLog()
复制代码
```

`wrapper` 本身也是一个函数，它接受 `fn` 作为参数，返回一个新的函数 `wrapped`，然后维护一个全局变量 `activeEffect`，当 `wrapped` 执行的时候，把 `activeEffect` 设置为 `fn`，然后执行 `fn` 即可。

这样当我们执行 `wrappedLog` 后，再去修改 `counter.num`，就会自动执行 `logCount` 函数了。

实际上 Vue 3 就是采用类似的做法，在它内部就有一个 `effect` 副作用函数，我们来看一下它的实现：

```js
// 全局 effect 栈
const effectStack = []
// 当前激活的 effect
let activeEffect
function effect(fn, options = EMPTY_OBJ) {
  if (isEffect(fn)) {
    // 如果 fn 已经是一个 effect 函数了，则指向原始函数
    fn = fn.raw
  }
  // 创建一个 wrapper，它是一个响应式的副作用的函数
  const effect = createReactiveEffect(fn, options)
  if (!options.lazy) {
    // lazy 配置，计算属性会用到，非 lazy 则直接执行一次
    effect()
  }
  return effect
}
function createReactiveEffect(fn, options) {
  const effect = function reactiveEffect() {
    if (!effect.active) {
      // 非激活状态，则判断如果非调度执行，则直接执行原始函数。
      return options.scheduler ? undefined : fn()
    }
    if (!effectStack.includes(effect)) {
      // 清空 effect 引用的依赖
      cleanup(effect)
      try {
        // 开启全局 shouldTrack，允许依赖收集
        enableTracking()
        // 压栈
        effectStack.push(effect)
        activeEffect = effect
        // 执行原始函数
        return fn()
      }
      finally {
        // 出栈
        effectStack.pop()
        // 恢复 shouldTrack 开启之前的状态
        resetTracking()
        // 指向栈最后一个 effect
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  }
  effect.id = uid++
  // 标识是一个 effect 函数
  effect._isEffect = true
  // effect 自身的状态
  effect.active = true
  // 包装的原始函数
  effect.raw = fn
  // effect 对应的依赖，双向指针，依赖包含对 effect 的引用，effect 也包含对依赖的引用
  effect.deps = []
  // effect 的相关配置
  effect.options = options
  return effect
}
```

结合上述代码来看，`effect` 内部通过执行 `createReactiveEffect` 函数去创建一个新的 `effect` 函数，为了和外部的 `effect` 函数区分，我们把它称作 `reactiveEffect` 函数，并且还给它添加了一些额外属性（我在注释中都有标明）。另外，`effect` 函数还支持传入一个配置参数以支持更多的 `feature`，这里就不展开了。

`reactiveEffect` 函数就是响应式的副作用函数，当执行 `trigger` 过程派发通知的时候，执行的 `effect` 就是它。

按我们之前的分析，`reactiveEffect` 函数只需要做两件事情：让全局的 `activeEffect` 指向它， 然后执行被包装的原始函数 `fn`。

但实际上它的实现要更复杂一些，首先它会判断 `effect` 的状态是否是 `active，`这其实是一种控制手段，允许在非 `active` 状态且非调度执行情况，则直接执行原始函数 `fn` 并返回。

接着判断 `effectStack` 中是否包含 `effect`，如果没有就把 `effect` 压入栈内。之前我们提到，只要设置 `activeEffect = effect` 即可，那么这里为什么要设计一个栈的结构呢？

其实是考虑到以下这样一个嵌套 `effect` 的场景：

```js
import { reactive} from 'vue' 
import { effect } from '@vue/reactivity' 
const counter = reactive({ 
  num: 0, 
  num2: 0 
}) 
function logCount() { 
  effect(logCount2) 
  console.log('num:', counter.num) 
} 
function count() { 
  counter.num++ 
} 
function logCount2() { 
  console.log('num2:', counter.num2) 
} 
effect(logCount) 
count()
```

我们每次执行 `effect` 函数时，如果仅仅把 `reactiveEffect` 函数赋值给 `activeEffect`，那么针对这种嵌套场景，执行完 `effect(logCount2)` 后，`activeEffect` 还是 `effect(logCount2)` 返回的 `reactiveEffect` 函数，这样后续访问 `counter.num` 的时候，依赖收集对应的 `activeEffect` 就不对了，此时我们外部执行 `count` 函数修改 `counter.num` 后执行的便不是 `logCount` 函数，而是 `logCount2` 函数，最终输出的结果如下：

```js
num2: 0 
num: 0 
num2: 0
```

而我们期望的结果应该如下：

```js
num2: 0 
num: 0 
num2: 0 
num: 1
```

因此针对嵌套 `effect` 的场景，我们不能简单地赋值 `activeEffect`，应该考虑到函数的执行本身就是一种入栈出栈操作，因此我们也可以设计一个 `effectStack`，这样每次进入 `reactiveEffect` 函数就先把它入栈，然后 `activeEffect` 指向这个 `reactiveEffect` 函数，接着在 `fn` 执行完毕后出栈，再把 `activeEffect` 指向 `effectStack` 最后一个元素，也就是外层 `effect` 函数对应的 `reactiveEffect`。

这里我们还注意到一个细节，在入栈前会执行 `cleanup` 函数清空 `reactiveEffect` 函数对应的依赖 。在执行 `track` 函数的时候，除了收集当前激活的 `effect` 作为依赖，还通过 `activeEffect.deps.push(dep)` 把 `dep` 作为 `activeEffect` 的依赖，这样在 `cleanup` 的时候我们就可以找到 `effect` 对应的 `dep` 了，然后把 `effect` 从这些 `dep` 中删除。`cleanup` 函数的代码如下所示：

```js
function cleanup(effect) {
  const { deps } = effect
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect)
    }
    deps.length = 0
  }
}
复制代码
```

为什么需要 `cleanup` 呢？如果遇到这种场景：

```vue
<template>
  <div v-if="state.showMsg">
    {{ state.msg }}
  </div>
  <div v-else>
    {{ Math.random()}}
  </div>
  <button @click="toggle">Toggle Msg</button>
  <button @click="switchView">Switch View</button>
</template>
<script>
  import { reactive } from 'vue'

  export default {
    setup() {
      const state = reactive({
        msg: 'Hello World',
        showMsg: true
      })

      function toggle() {
        state.msg = state.msg === 'Hello World' ? 'Hello Vue' : 'Hello World'
      }

      function switchView() {
        state.showMsg = !state.showMsg
      }

      return {
        toggle,
        switchView,
        state
      }
    }
  }
</script>
```

结合代码可以知道，这个组件的视图会根据 `showMsg` 变量的控制显示 `msg` 或者一个随机数，当我们点击 `Switch View` 的按钮时，就会修改这个变量值。

假设没有 `cleanup`，在第一次渲染模板的时候，`activeEffect` 是组件的副作用渲染函数，因为模板 `render` 的时候访问了 `state.msg`，所以会执行依赖收集，把副作用渲染函数作为 `state.msg` 的依赖，我们把它称作 `render effect`。然后我们点击 `Switch View` 按钮，视图切换为显示随机数，此时我们再点击 `Toggle Msg` 按钮，由于修改了 `state.msg` 就会派发通知，找到了 `render effect` 并执行，就又触发了组件的重新渲染。

但这个行为实际上并不符合预期，因为当我们点击 `Switch View` 按钮，视图切换为显示随机数的时候，也会触发组件的重新渲染，但这个时候视图并没有渲染 `state.msg`，所以对它的改动并不应该影响组件的重新渲染。

因此在组件的 `render effect` 执行之前，如果通过 `cleanup` 清理依赖，我们就可以删除之前 `state.msg` 收集的 `render effect` 依赖。这样当我们修改 `state.msg` 时，由于已经没有依赖了就不会触发组件的重新渲染，符合预期

### 4.如何理解composition API

在 Vue2 中，代码是 Options API 风格的，也就是通过填充 (option) data、methods、computed 等属性来完成一个 Vue 组件。这种风格使得 Vue 相对于 React极为容易上手，同时也造成了几个问题：

1. 由于 Options API 不够灵活的开发方式，使得Vue开发缺乏优雅的方法来在组件间共用代码。
2. Vue 组件过于依赖`this`上下文，Vue 背后的一些小技巧使得 Vue 组件的开发看起来与 JavaScript 的开发原则相悖，比如在`methods` 中的`this`竟然指向组件实例来不指向`methods`所在的对象。这也使得 TypeScript 在Vue2 中很不好用。

Options Api可以理解为就是组件的各个选项，data、methods、computed、watch等等就像是组件的一个个选项，在对应的选项里做对应的事情。

不在data中定义的数据，是无法做到响应式的，那是因为Object.definePropety只会对data选项中的数据进行递归拦截

因为所有的数据都是挂载在this下面，typescript的类型推导也很麻烦，代码的复用、公共组件的导入导出也都很困难

```js
export default {
    data () {
        return {
            // 定义响应式数据的选项
        }
    },
    methods: {
        // 定义相关方法的选项
    },
    computed: {
        // 计算属性的选项
    },
    watch: {
        // 监听数据的选项
    }
    ...
}
```



于是在 Vue3 中，舍弃了 Options API，转而投向 Composition API。Composition API本质上是将 Options API 背后的机制暴露给用户直接使用，这样用户就拥有了更多的灵活性，也使得 Vue3 更适合于 TypeScript 结合。

Composition Api，我们也从名字来看，Composition表示组合，在Compostion Api的写法中，没有选项的概念了，设计指向的是组合，各种功能模块的组合。Composition Api支持将相同的功能模块代码写在一起，甚至可以将某个功能单独的封装成函数，随意导入引用；也可以**将任意的数据定义成响应式，再也不用局限于data中，我们只需要将每个实现的功能组合起来就可以了**。

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

例子

```js
<template>
    <div @click="add">{{count}}</div>
</template>
<script setup>
    import { ref } from "vue";
    let count = ref(0);
    function add () {
        count.value++;
    };
</script>
```

功能单独封装成一个函数，供其他地方引用

定义一个新的count.js文件。

```js
import { ref } from "vue";
export default function Count () {
    let count = ref(0);
    function add () {
        count.value++;
    };
    return {count, add};
}
```

在我们的源代码里，只需要引入一下。

```js
<template>
    <div @click="add">{{count}}</div>
</template>
<script setup>
    import Count from "./count.js";
    const { count, add } = Count();
</script>
```

添加一个计算属性，每当count的值改变的时候，就计算出count * 2的值，大家应该马上就想到了computed，而在Compostion Api中，computed需要通过import导入使用。

```vue
<template>
    <div @click="add">{{count}}</div>
    <div>{{doubleCount}}</div>
</template>
<script setup>
    import { computed } from "vue";
    import Count from "./count.js";
    const { count, add } = Count();
    let doubleCount = computed(() => count.value * 2);
</script>

```

现在给count加点颜色，如果count是偶数，想让文字显示红色，如果是奇数，让文字显示绿色，这次我们使用watch来实现，在Composition Api中对应的是watchEffect。

```vue
<style scope>
    .count{
        color: v-bind(color)
    }
</style>
<template>
    <div @click="add" class="count">{{count}}</div>
    <div>{{doubleCount}}</div>
</template>
<script setup>
    import { computed, ref, watchEffect } from "vue";
    ...
    let color = ref('red');
    const watchEffectStop = watchEffect(() => {
        if (count.value % 2) {
            color.value = 'green';
        } else {
            color.value = 'red';
        }
    })
</script>
```

我们已经添加了一个watchEffect来监听count值的变化，相对于Vue2中的watch方法，watchEffect的使用还是有一些差别的。

1.  watchEffect是立即执行的，不需要添加immediate属性。

1.  watchEffect不需要指定对某个具体的数据监听，watchEffect会根据内容自动去感知，所以我们也可以在一个watchEffect中添加多个数据的监听处理（如果watchEffect中没有任何响应式数据，会不会执行呢？大家可以试一下）。

1.  watchEffect不能获取数据改变之前的值。

同时，watchEffect会返回一个对象watchEffectStop，通过执行watchEffectStop，我们可以控制监听在什么时候结束

### 5.reactive和ref

在vue2中只需要在data里定义数据，就可以实现数据层-视图层的双向绑定，而在vue3中使用ref接受一个内部值并返回一个响应式且可变的 ref 对象。ref 对象具有指向内部值的单个 property.value

reactive的作用和ref的作用是类似的，都是将数据变成可相应的对象，其实ref的底层其实利用了reactive。 两者的区别，ref包装的对象需要.value ,而reactive中的不需要

![image-20220316213837203](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202301420.png)

`toRefs`会将我们一个`响应式`的对象转变为一个`普通`对象，然后将这个`普通对象`里的每一个属性变为一个响应式的数据

如果利用toRef将一个数据变成响应式数据，是会影响到原始数据，但是响应式数据通过toRef。并不回出发ui界面更新(ref式改变，不会影响到原始数据)

toRefs类似toRef,只是一次性处理多次toRef

### 6.setup

`setup` 选项是一个接收 `props` 和 `context` 的函数

```js
export default{
    name: 'test',
    setup(props,context){

     return {}   // 这里返回的任何内容都可以用于组件的其余部分
    }
    // 组件的“其余部分”
}

```

接收一个`props`和`context`函数并且将`setup`内的内容通过`return`暴露给组件的其余部分

-   由于在执行 setup函数的时候，还没有执行 Created 生命周期方法，所以在 setup 函数中，无法使用 data 和 methods 的变量和方法
-   由于我们不能在 setup函数中使用 data 和 methods，所以 Vue 为了避免我们错误的使用，直接将 setup函数中的this 修改成了 undefined

![image-20220316213946552](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsaJAiv7qclpgNeyS.png)



#### setup script优势

##### 1.自动注册子组件

vue3语法

在引入Child组件后，需要在components中注册对应的组件才可使用

```js
<template>
  <div>
    <h2>我是父组件!</h2>
    <Child />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import Child from './Child.vue'

export default defineComponent({
  components: {
      Child
  },
  setup() {

    return {
      
    }
  }
});
</script>
```

setup script写法

直接省略了子组件注册的过程

```js
<template>
  <div>
    <h2>我是父组件!-setup script</h2>
    <Child />
  </div>
</template>

<script setup>
import Child from './Child.vue'

</script>
```

##### 2.属性和方法无需返回

composition API写起来有点繁琐的原因在于需要手动返回模板需要使用的属性和方法。

而在setup script中可以省略这一步

vue3语法

```js
<template>
  <div>
    <h2 @click="ageInc">{{ name }} is {{ age }}</h2>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const name = ref('CoCoyY1')
    const age = ref(18)

    const ageInc = () => {
      age.value++
    }

    return {
      name,
      age,

      ageInc
    }
  }
})
</script>
```

setup script语法

```js
<template>
  <div>
    <h2 @click="ageInc">{{ name }} is {{ age }}</h2>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const name = ref('CoCoyY1')
const age = ref(18)

const ageInc = () => {
  age.value++
}

</script>
```

##### 3.支持props、emit和context

vue3语法

```js
//Father.vue
<template>
  <div >
    <h2 >我是父组件！</h2>
    <Child msg="hello" @child-click="childCtx" />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import Child from './Child.vue';

export default defineComponent({
  components: {
    Child
  },
  setup(props, context) {
    const childCtx = (ctx) => {
      console.log(ctx);
    }

    return {
      childCtx
    }
  }
})
</script>


//Child.vue
<template>
  <span @click="handleClick">我是子组件! -- msg: {{ props.msg }}</span>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  emits: [
    'child-click'
  ],
  props: {
    msg: String
  },
  setup(props, context) {
    const handleClick = () => {
      context.emit('child-click', context)
    }

    return {
      props,
      handleClick
    }
  },
})
</script>
```

setup script写法

```js
//Father.vue
<template>
  <div >
    <h2 >我是父组件！</h2>
    <Child msg="hello" @child-click="childCtx" />
  </div>
</template>

<script setup>
import Child from './Child.vue';

const childCtx = (ctx) => {
  console.log(ctx);
}
</script>


//Child.vue
<template>
  <span @click="handleClick">我是子组件! -- msg: {{ props.msg }}</span>
</template>

<script setup>
import { useContext, defineProps, defineEmit } from 'vue'

const emit = defineEmit(['child-click'])
const ctx = useContext()
const props = defineProps({
  msg: String
})

const handleClick = () => {
  emit('child-click', ctx)
}
</script>

```

setup script语法糖提供了三个新的API来供我们使用：`defineProps`、`defineEmit`和`useContext`。

其中`defineProps`用来接收父组件传来的值props。`defineEmit`用来声明触发的事件表。`useContext`用来获取组件上下文context



### 7.Vue3 中 watch 与 watchEffect 有什么区别？

- `watch` 与 `watchEffect` 的不同
  1. `watch` 初次渲染不执行
  2. `watch` 侦听的更具体
  3. `watch` 可以访问侦听数据变化前后的值

同一个功能的两种不同形态，底层的实现是一样的。

-   `watch`- 显式指定依赖源，依赖源更新时执行回调函数
-   `watchEffect` - 自动收集依赖源，依赖源更新时重新执行自身

Watch

这里的依赖源函数只会执行一次，回调函数会在每次依赖源改变的时候触发，但是并不对回调函数进行依赖收集。也就是说，依赖源和回调函数之间并不一定要有直接关系

```js
watch(
  () => { /* 依赖源收集函数 */ },
  () => { /* 依赖源改变时的回调函数 */ }
)
```

WatchEffect

`watchEffect` 相当于将 `watch` 的依赖源和回调函数合并，当任何你有用到的响应式依赖更新时，该回调函数便会重新执行。不同于 `watch`，`watchEffect` 的回调函数会被立即执行（即 `{ immediate: true }`）

简单理解watchEffect会在第一次运行时创建副作用函数并执行一次，如果存在响应式变量，取值会触发get函数，这个时候收集依赖存储起来，当其他地方给响应式变量重新赋值的时候，set函数中会触发方法派发更新，执行收集到的副作用函数，如果不存在响应式变量，就不会被收集触发

```js
watchEffect(
  () => { /* 依赖源同时是回调函数 */ }
)
```

### 8.Teleport

这个组件的作用主要用来将模板内的 DOM 元素移动到其他位置

业务开发的过程中，我们经常会封装一些常用的组件，例如 Modal 组件

有时组件模板的一部分逻辑上属于该组件，而从技术角度来看，最好将模板的这一部分移动到 DOM 中 Vue app 之外的其他位置 最常见的就是类似于element的dialog组件 dialog是fixed定位，而dialog父元素的css会影响dialog  因此要将dialog放在body下

>eleport 提供了一种干净的方法，允许我们控制在 DOM 中哪个父节点下呈现 HTML，而不必求助于全局状态或将其拆分为两个组件。 -- Vue 官方文档

我们只需要将弹窗内容放入 `Teleport` 内，并设置 `to` 属性为 `body`，表示弹窗组件每次渲染都会做为 `body` 的子级，这样之前的问题就能得到解决

```javascript
<template>
  <teleport to="body">
    <div class="modal__mask">
      <div class="modal__main">
        ...
      </div>
    </div>
  </teleport>
</template>

```

### 9.Suspense

前端开发中异步请求是非常常见的事情,比如远程读取图片,调用后端接口等等 Suspense是有两个template插槽的，第一个default代表异步请求完成后，显示的模板内容。fallback代表在加载中时，显示的模板内容。 子组件 child

```xml
<template>
  <h1>{{result}}</h1>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  setup() {
    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve({
          result: 1000
        })
      }, 5000)
    })
  }
})
</script>
```

父组件 当异步没有执行完的时候。使用fallback里面的组件，当执行成功之后使用default

```xml
<Suspense>
  <template #default>
    <Child />
  </template>
  <template #fallback>
    <h1>Loading !...</h1>
  </template>
</Suspense>
```

### 10.实现一个mini-vue3

#### dom渲染过程

![image-20220828193515638](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsimage-20220828193515638.png)

![image-20220828193541719](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsimage-20220828193541719.png)

<img src="https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsimage-20220828193608830.png" alt="image-20220828193608830" style="zoom:150%;" />

#### 渲染系统实现  

功能一：h函数，用于返回一个VNode对象；
功能二：mount函数，用于将VNode挂载到DOM上；
功能三：patch函数，用于对两个VNode进行对比，决定如何处理新的VNode 

##### h函数

```js
const h = (tag, props, children) => {
  // vnode -> javascript对象 -> {}
  return {
    tag,
    props,
    children
  }
}
```

##### mount函数

**第一步**：根据tag，创建HTML元素，并且存储
到vnode的el中；
**第二步**：处理props属性
如果以on开头，那么监听事件；
普通属性直接通过 setAttribute 添加即可；
**第三步**：处理子节点
如果是字符串节点，那么直接设置
textContent；
如果是数组节点，那么遍历调用 mount 函
数；  

```js
const mount = (vnode, container) => {
  // vnode -> element
  // 1.创建出真实的原生, 并且在vnode上保留el
  const el = vnode.el = document.createElement(vnode.tag);

  // 2.处理props
  if (vnode.props) {
    for (const key in vnode.props) {
      const value = vnode.props[key];

      if (key.startsWith("on")) { // 对事件监听的判断
        el.addEventListener(key.slice(2).toLowerCase(), value)
      } else {
        el.setAttribute(key, value);
      }
    }
  }

  // 3.处理children
  if (vnode.children) {
    if (typeof vnode.children === "string") {
      el.textContent = vnode.children;
    } else {
      vnode.children.forEach(item => {
        mount(item, el);
      })
    }
  }

  // 4.将el挂载到container上
  container.appendChild(el);
}
```

##### patch函数

![image-20220828194432401](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsimage-20220828194432401.png)

```js
const patch = (n1, n2) => {
  if (n1.tag !== n2.tag) {
    const n1ElParent = n1.el.parentElement;
    n1ElParent.removeChild(n1.el);
    mount(n2, n1ElParent);
  } else {
    // 1.取出element对象, 并且在n2中进行保存
    const el = n2.el = n1.el;

    // 2.处理props
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    // 2.1.获取所有的newProps添加到el
    for (const key in newProps) {
      const oldValue = oldProps[key];
      const newValue = newProps[key];
      if (newValue !== oldValue) {
        if (key.startsWith("on")) { // 对事件监听的判断
          el.addEventListener(key.slice(2).toLowerCase(), newValue)
        } else {
          el.setAttribute(key, newValue);
        }
      }
    }

    // 2.2.删除旧的props
    for (const key in oldProps) {
      if (key.startsWith("on")) { // 对事件监听的判断
        const value = oldProps[key];
        el.removeEventListener(key.slice(2).toLowerCase(), value)
      } 
      if (!(key in newProps)) {
        el.removeAttribute(key);
      }
    }

    // 3.处理children
    const oldChildren = n1.children || [];
    const newChidlren = n2.children || [];

    if (typeof newChidlren === "string") { // 情况一: newChildren本身是一个string
      // 边界情况 (edge case)
      if (typeof oldChildren === "string") {
        if (newChidlren !== oldChildren) {
          el.textContent = newChidlren
        }
      } else {
        el.innerHTML = newChidlren;
      }
    } else { // 情况二: newChildren本身是一个数组
      if (typeof oldChildren === "string") {
        el.innerHTML = "";
        newChidlren.forEach(item => {
          mount(item, el);
        })
      } else {
        // oldChildren: [v1, v2, v3, v8, v9]
        // newChildren: [v1, v5, v6]
        // 1.前面有相同节点的原生进行patch操作
        const commonLength = Math.min(oldChildren.length, newChidlren.length);
        for (let i = 0; i < commonLength; i++) {
          patch(oldChildren[i], newChidlren[i]);
        }

        // 2.newChildren.length > oldChildren.length
        if (newChidlren.length > oldChildren.length) {
          newChidlren.slice(oldChildren.length).forEach(item => {
            mount(item, el);
          })
        }

        // 3.newChildren.length < oldChildren.length
        if (newChidlren.length < oldChildren.length) {
          oldChildren.slice(newChidlren.length).forEach(item => {
            el.removeChild(item.el);
          })
        }
      }
    }
  }
}

```

#### 依赖收集系统  

```js
class Dep {
  constructor() {
    this.subscribers = new Set();
  }

  depend() {
    if (activeEffect) {
      this.subscribers.add(activeEffect);
    }
  }

  notify() {
    this.subscribers.forEach(effect => {
      effect();
    })
  }
}

let activeEffect = null;
function watchEffect(effect) {
  activeEffect = effect;
  effect();
  activeEffect = null;
}


// Map({key: value}): key是一个字符串
// WeakMap({key(对象): value}): key是一个对象, 弱引用
const targetMap = new WeakMap();
function getDep(target, key) {
  // 1.根据对象(target)取出对应的Map对象
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  // 2.取出具体的dep对象
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }
  return dep;
}


// vue3对raw进行数据劫持
function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      const dep = getDep(target, key);
      dep.depend();
      return target[key];
    },
    set(target, key, newValue) {
      const dep = getDep(target, key);
      target[key] = newValue;
      dep.notify();
    }
  })
}
```

#### 外层设计

```js
function createApp(rootComponent) {
  return {
    mount(selector) {
      const container = document.querySelector(selector);
      let isMounted = false;
      let oldVNode = null;

      watchEffect(function() {
        if (!isMounted) {
          oldVNode = rootComponent.render();
          mount(oldVNode, container);
          isMounted = true;
        } else {
          const newVNode = rootComponent.render();
          patch(oldVNode, newVNode);
          oldVNode = newVNode;
        }
      })
    }
  }
}
```



## Virtual DOM

所谓的virtual dom，也就是虚拟节点。它通过JS的Object对象模拟DOM中的节点，然后再通过特定的render方法将其渲染成真实的DOM节点 dom diff 则是通过JS层面的计算，返回一个patch对象，即补丁对象，在通过特定的操作解析patch对象，完成页面的重新渲染![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202301988.webp)



### 1.如何理解虚拟DOM

从本质上来说，Virtual Dom是一个JavaScript对象，通过对象的方式来表示DOM结构。将页面的状态抽象为JS对象的形式，配合不同的渲染工具，使跨平台渲染成为可能。通过事务处理机制，将多次DOM修改的结果一次性的更新到页面上，从而有效的减少页面渲染的次数，减少修改DOM的重绘重排次数，提高渲染性能。**保障了性能的下限**

虚拟DOM是对DOM的抽象，这个对象是更加轻量级的对 DOM的描述。它设计的最初目的，**就是更好的跨平台**，比如Node.js就没有DOM，如果想实现SSR，那么一个方式就是借助虚拟DOM，因为虚拟DOM本身是js对象。 在代码渲染到页面之前，vue会把代码转换成一个对象（虚拟 DOM）。以对象的形式来描述真实DOM结构，最终渲染到页面。在每次数据发生变化前，虚拟DOM都会缓存一份，变化之时，现在的虚拟DOM会与缓存的虚拟DOM进行比较。在vue内部封装了diff算法，通过这个算法来进行比较，渲染时修改改变的变化，原先没有发生改变的通过原先的数据进行渲染。

另外现代前端框架的一个基本要求就是无须手动操作DOM，一方面是因为手动操作DOM无法保证程序性能，多人协作的项目中如果review不严格，可能会有开发者写出性能较低的代码，另一方面更重要的是省略手动DOM操作可以大大提高开发效率。

**为什么使用 Virtual DOM**

- 手动操作 `DOM` 比较麻烦，还需要考虑浏览器兼容性问题，虽然有 `jQuery` 等库简化 `DOM` 操作，但是随着项目的复杂 DOM 操作复杂提升
- 为了简化 `DOM` 的复杂操作于是出现了各种 `MVVM` 框架，`MVVM` 框架解决了视图和状态的同步问题
- 为了简化视图的操作我们可以使用模板引擎，但是模板引擎没有解决跟踪状态变化的问题，于是`Virtual DOM` 出现了
- `Virtual DOM` 的好处是当状态改变时不需要立即更新 DOM，只需要创建一个虚拟树来描述`DOM`，`Virtual DOM` 内部将弄清楚如何有效(`diff`)的更新 `DOM`
- 虚拟 `DOM` 可以维护程序的状态，跟踪上一次的状态
- 通过比较前后两次状态的差异更新真实 `DOM`

**为什么Svelte不使用虚拟dom,性能却好？**

Svelte 是一个构建 web 应用程序的工具，与 React 和 Vue 等 JavaScript 框架类似，都怀揣着一颗让构建交互式用户界面变得更容易的心。

但是有一个关键的区别：**Svelte 在 *构建/编译阶段* 将你的应用程序转换为理想的 JavaScript 应用，而不是在 *运行阶段* 解释应用程序的代码**。这意味着你不需要为框架所消耗的性能付出成本，并且在应用程序首次加载时没有额外损失。

许多人在学习 react 或者 vue 时可能听说过诸如“虚拟dom很快”之类的言论，所以看到这里就会疑惑，svelte 没有虚拟dom，为什么反而更快呢？

这其实是一个误区，**react 和 vue 等框架实现虚拟 dom 的最主要的目的不是性能，而是为了掩盖底层 dom 操作，让用户通过声明式的、基于状态驱动UI的方式去构建我们的应用程序，提高代码的可维护性**。

另外 react 或者 vue 所说的虚拟 dom 的性能好，**是指我们在没有对页面做特殊优化的情况下，框架依然能够提供不错的性能保障**。例如以下场景，我们每次从服务端接收数据后就重新渲染列表，如果我们通过普通dom操作不做特殊优化，每次都重新渲染所有列表项，性能消耗比较高。而像react等框架会通过key对列表项做标记，只对发生变化的列表项重新渲染，如此一来性能便提高了。

如果我们操作真实dom时也对列表项做标记，只对发生变化的列表项重新渲染，省去了虚拟dom diff等环节，那么性能是比虚拟dom还要高的。

svelte便实现了这种优化，通过将数据和真实dom的映射关系，在编译的时候通过 ast 计算并保存起来，数据发生变动时直接更新dom，由于不依赖虚拟dom，初始化和更新时都都十分迅速

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

#### VNode的实例对象

一个VNode的实例对象包含了以下属性

- `tag`: 当前节点的标签名
- `data`: 当前节点的数据对象，具体包含哪些字段可以参考vue源码`types/vnode.d.ts`中对`VNodeData`的定义
  ![clipboard.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs6lpF9OrxEYutqI7.png)
- `children`: 数组类型，包含了当前节点的子节点
- `text`: 当前节点的文本，一般文本节点或注释节点会有该属性
- `elm`: 当前虚拟节点对应的真实的dom节点
- `ns`: 节点的namespace
- `context`: 编译作用域
- `functionalContext`: 函数化组件的作用域
- `key`: 节点的key属性，用于作为节点的标识，有利于patch的优化
- `componentOptions`: 创建组件实例时会用到的选项信息
- `child`: 当前节点对应的组件实例
- `parent`: 组件的占位节点
- `raw`: raw html
- `isStatic`: 静态节点的标识
- `isRootInsert`: 是否作为根节点插入，被`<transition>`包裹的节点，该属性的值为`false`
- `isComment`: 当前节点是否是注释节点
- `isCloned`: 当前节点是否为克隆节点
- `isOnce`: 当前节点是否有`v-once`指令

#### VNode分类

![clipboard.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202301734.png)

`VNode`可以理解为vue框架的虚拟dom的基类，通过`new`实例化的`VNode`大致可以分为几类

- `EmptyVNode`: 没有内容的注释节点
- `TextVNode`: 文本节点
- `ElementVNode`: 普通元素节点
- `ComponentVNode`: 组件节点
- `CloneVNode`: 克隆节点，可以是以上任意类型的节点，唯一的区别在于`isCloned`属性为`true`

#### 虚拟DOM和AST区别和联系

ST语法树概念

> 象语法树 (Abstract Syntax Tree)，简称 AST，它是源代码语法结构的一种抽象表示。 它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构。

虚拟DOM概念

> Virtual DOM (虚拟 DOM)，是由**普通的 JS 对象来描述 DOM 对象**，因为不是真实的 DOM 对象，所以叫 Virtual DOM

通过概念可以总结：AST是对原生语法结构的描述，虚拟DOM是对于DOM节点的描述，两者共同点都是使用对象来进行描述

现在有这个一段HTML

```html
<div id="app">
  <p>{{name}}</p>
</div>
```

在`Vue`中生成的对应AST

```js
{
  "type": 1,
  "tag": "div",
  "attrsList": [
    {
      "name": "id",
      "value": "app",
      "start": 5,
      "end": 13
    }
  ],
  "attrsMap": {
    "id": "app"
  },
  "rawAttrsMap": {
    "id": {
      "name": "id",
      "value": "app",
      "start": 5,
      "end": 13
    }
  },
  "children": [
    {
      "type": 1,
      "tag": "p",
      "attrsList": [],
      "attrsMap": {},
      "rawAttrsMap": {},
      "parent": "[Circular ~]",
      "children": [
        {
          "type": 2,
          "expression": "_s(name)",
          "tokens": [
            {
              "@binding": "name"
            }
          ],
          "text": "{{name}}",
          "start": 22,
          "end": 30,
          "static": false
        }
      ],
      "start": 19,
      "end": 34,
      "plain": true,
      "static": false,
      "staticRoot": false
    }
  ],
  "start": 0,
  "end": 41,
  "plain": false,
  "attrs": [
    {
      "name": "id",
      "value": "\"app\"",
      "start": 5,
      "end": 13
    }
  ],
  "static": false,
  "staticRoot": false
}
```

在`Vue`中生成的对应`render`函数

```js
_c('div', {
  attrs: {
    "id": "app"
  }
}, [_c('p', [_v(_s(name))])])
```

虚拟DOM通过调用`render`函数中的`_c`、`_v`等函数创建,最终形式如下图

![image.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202302640.webp)



### 2.Diff算法

[精简版](https://juejin.cn/post/6986463124358430756)

#### 基本比较

在新老虚拟DOM对比时：

- 首先，对比节点本身，判断是否为同一节点，如果不为相同节点，则删除该节点重新创建节点进行替换
- 如果为相同节点，进行patchVnode，判断如何对该节点的子节点进行处理，先判断一方有子节点一方没有子节点的情况(如果新的children没有子节点，将旧的子节点移除)
- 比较如果都有子节点，则进行updateChildren，判断如何对这些新老节点的子节点进行操作（diff核心）。
- 匹配时，找到相同的子节点，递归比较子节点

在diff中，只对同层的子节点进行比较，放弃跨级的节点比较，使得时间复杂从O(n3)降低值O(n)，也就是说，只有当新旧children都为多个子节点时才需要用核心的Diff算法进行同层级比较。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202302417.webp)

> Diff算法真的很美，整个流程如下图所示：

![diffvue2](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202302162.png)

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

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202302431.webp)

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

其实就简单的看一眼我们就能发现，这两段文字是有**一部分是相同**的，**这些文字是不需要修改也不需要移动的**，真正需要进行修改中间的几个字母，所以`diff`就变成以下部分

```
text1: 'llo'
text2: 'y'
```

接下来换成`vnode`，我们以下图为例。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202302522.webp)

图中的**被绿色框起来的节点，他们是不需要移动的，只需要进行打补丁`patch`就可以了**。我们把该逻辑写成代码。

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

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202302866.webp)

我们以这张图为例，**此时`j > prevEnd`且`j <= nextEnd`，我们只需要把新列表中`j`到`nextEnd`之间剩下的节点插入进去就可以了。相反， 如果`j > nextEnd`时，我们把旧列表中`j`到`prevEnd`之间的节点删除**就可以了。

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

##### 判断是否需要移动

其实几个算法看下来，套路已经很明显了，就是找到移动的节点，然后给他移动到正确的位置。把该加的新节点添加好，把该删的旧节点删了，整个算法就结束了。这个算法也不例外，我们接下来看一下它是如何做的。

当`前/后置`的预处理结束后，我们进入真正的`diff`环节。首先，我们先根据**新列表**剩余的节点数量，创建一个`source`数组，并将数组填满`-1`。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202302428.webp)

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

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202302039.webp)

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

##### DOM如何移动

判断完是否需要移动后，我们就需要考虑如何移动了。一旦需要进行DOM移动，我们首先要做的就是找到`source`的**最长递增子序列**。

从后向前进行遍历`source`每一项。此时会出现三种情况：

1. 当前的值为`-1`，这说明该节点是全新的节点，又由于我们是**从后向前**遍历，我们直接创建好DOM节点插入到队尾就可以了。
2. 当前的索引为`最长递增子序列`中的值，也就是`i === seq[j]`，这说说明该节点不需要移动
3. 当前的索引不是`最长递增子序列`中的值，那么说明该DOM节点需要移动，这里也很好理解，我们也是直接将DOM节点插入到队尾就可以了，因为队尾是排好序的。

![image.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202302120.webp)

```js
function vue3Diff(prevChildren, nextChildren, parent) {
  //...
  if (move) {
	const seq = lis(source); // [0, 1]
    let j = seq.length - 1;  // 最长子序列的指针
    // 从后向前遍历
    for (let i = nextLeft - 1； i >= 0; i--) {
      let pos = nextStart + i, // 对应新列表的index
        nextNode = nextChildren[pos],	// 找到vnode
      	nextPos = pos + 1，    // 下一个节点的位置，用于移动DOM
        refNode = nextPos >= nextChildren.length ? null : nextChildren[nextPos].el, //DOM节点
        cur = source[i];  // 当前source的值，用来判断节点是否需要移动
    
      if (cur === -1) {
        // 情况1，该节点是全新节点
      	mount(nextNode, parent, refNode)
      } else if (cur === seq[j]) {
        // 情况2，是递增子序列，该节点不需要移动
        // 让j指向下一个
        j--
      } else {
        // 情况3，不是递增子序列，该节点需要移动
        parent.insetBefore(nextNode.el, refNode)
      }
    }
  } else {
    //不需要移动: 我们只需要判断是否有全新的节点【其在source数组中对应的值就是初始的-1】，给他添加进去
    for (let i = nextLeft - 1； i >= 0; i--) {
      let cur = source[i];  // 当前source的值，用来判断节点是否需要移动
    
      if (cur === -1) {
       let pos = nextStart + i, // 对应新列表的index
          nextNode = nextChildren[pos],	// 找到vnode
          nextPos = pos + 1，    // 下一个节点的位置，用于移动DOM
          refNode = nextPos >= nextChildren.length ? null : nextChildren[nextPos].el, //DOM节点
      	mount(nextNode, parent, refNode)
      }
    }
  }
}
```



### 3.虚拟DOM怎么解析

![DOM的流程图 (1).png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202303863.webp)

虚拟DOM的解析过程：

- 首先对将要插入到文档中的 DOM 树结构进行分析，使用 js 对象将其表示出来，比如一个元素对象，包含 TagName、props 和 Children 这些属性。然后将这个 js 对象树给保存下来，最后再将 DOM 片段插入到文档中。
- 当页面的状态发生改变，需要对页面的 DOM 的结构进行调整的时候，首先根据变更的状态，重新构建起一棵对象树，然后将这棵新的对象树和旧的对象树进行比较，记录下两棵树的的差异。
- 最后将记录的有差异的地方应用到真正的 DOM 树中去，这样视图就更新了。

### 4.patch原理

一个Vue组件是如何运行起来的.

-   template模板通过编译生成AST树
-   AST树生成Vue的render渲染函数  有with的那种
-   render渲染函数结合数据返回生成vNode(Virtual DOM Node)树
-   Diff和Patch后生新的UI界面(真实DOM渲染)

patch

当节点发生变化时, 对比新旧节点并进行更新。**以新的VNode为基准，改造旧的oldVNode使之成为跟新的VNode一样**

```js
<div>
  <h3 class="box" title="标题" data-type="3">你好</h3>
  <ul>
    <li>A</li>
    <li>B</li>
    <li>C</li>
  </ul>
</div>

```



`patch`函数的定义在`src/core/vdom/patch.js`中，我们先来看下这个函数的逻辑

`patch`函数接收6个参数：

- `oldVnode`: 旧的虚拟节点或旧的真实dom节点
- `vnode`: 新的虚拟节点
- `hydrating`: 是否要跟真是dom混合
- `removeOnly`: 特殊flag，用于`<transition-group>`组件
- `parentElm`: 父节点
- `refElm`: 新节点将插入到`refElm`之前

`patch`的策略是：

1. 如果`vnode`不存在但是`oldVnode`存在，说明意图是要销毁老节点，那么就调用`invokeDestroyHook(oldVnode)`来进行销毁

2. 如果`oldVnode`不存在但是`vnode`存在，说明意图是要创建新节点，那么就调用`createElm`来创建新节点

3. 当`vnode`和`oldVnode`都存在时

   - 如果`oldVnode`和`vnode`是同一个节点，就调用`patchVnode`来进行`patch`
   - 当`vnode`和`oldVnode`不是同一个节点时，如果`oldVnode`是真实dom节点或`hydrating`设置为`true`，需要用`hydrate`函数将虚拟dom和真是dom进行映射，然后将`oldVnode`设置为对应的虚拟dom，找到`oldVnode.elm`的父节点，根据vnode创建一个真实dom节点并插入到该父节点中`oldVnode.elm`的位置

   这里面值得一提的是`patchVnode`函数，因为真正的patch算法是由它来实现的（patchVnode中更新子节点的算法其实是在`updateChildren`函数中实现的，为了便于理解，我统一放到`patchVnode`中来解释）。

`patchVnode`算法是：

1. 如果`oldVnode`跟`vnode`完全一致，那么不需要做任何事情
2. 如果`oldVnode`跟`vnode`都是静态节点，且具有相同的`key`，当`vnode`是克隆节点或是`v-once`指令控制的节点时，只需要把`oldVnode.elm`和`oldVnode.child`都复制到`vnode`上，也不用再有其他操作
3. 否则，如果`vnode`不是文本节点或注释节点
   - 如果`oldVnode`和`vnode`都有子节点，且2方的子节点不完全一致，就执行更新子节点的操作（这一部分其实是在`updateChildren`函数中实现），算法如下
     - 分别获取`oldVnode`和`vnode`的`firstChild`、`lastChild`，赋值给`oldStartVnode`、`oldEndVnode`、`newStartVnode`、`newEndVnode`
     - 如果`oldStartVnode`和`newStartVnode`是同一节点，调用`patchVnode`进行`patch`，然后将`oldStartVnode`和`newStartVnode`都设置为下一个子节点，重复上述流程
       ![clipboard.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202303863.webp)
     - 如果`oldEndVnode`和`newEndVnode`是同一节点，调用`patchVnode`进行`patch`，然后将`oldEndVnode`和`newEndVnode`都设置为上一个子节点，重复上述流程
       ![clipboard.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsYaKR9NTWAMDEuwZ.png)
     - 如果`oldStartVnode`和`newEndVnode`是同一节点，调用`patchVnode`进行`patch`，如果`removeOnly`是`false`，那么可以把`oldStartVnode.elm`移动到`oldEndVnode.elm`之后，然后把`oldStartVnode`设置为下一个节点，`newEndVnode`设置为上一个节点，重复上述流程
       ![clipboard.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202303851.png)
     - 如果`newStartVnode`和`oldEndVnode`是同一节点，调用`patchVnode`进行`patch`，如果`removeOnly`是`false`，那么可以把`oldEndVnode.elm`移动到`oldStartVnode.elm`之前，然后把`newStartVnode`设置为下一个节点，`oldEndVnode`设置为上一个节点，重复上述流程
       ![clipboard.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202303304.png)
     - 如果以上都不匹配，就尝试在`oldChildren`中寻找跟`newStartVnode`具有相同`key`的节点，如果找不到相同`key`的节点，说明`newStartVnode`是一个新节点，就创建一个，然后把`newStartVnode`设置为下一个节点
     - 如果上一步找到了跟`newStartVnode`相同`key`的节点，那么通过其他属性的比较来判断这2个节点是否是同一个节点，如果是，就调用`patchVnode`进行`patch`，如果`removeOnly`是`false`，就把`newStartVnode.elm`插入到`oldStartVnode.elm`之前，把`newStartVnode`设置为下一个节点，重复上述流程
       ![clipboard.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202303574.png)
     - 如果在`oldChildren`中没有寻找到`newStartVnode`的同一节点，那就创建一个新节点，把`newStartVnode`设置为下一个节点，重复上述流程
     - 如果`oldStartVnode`跟`oldEndVnode`重合了，并且`newStartVnode`跟`newEndVnode`也重合了，这个循环就结束了
   - 如果只有`oldVnode`有子节点，那就把这些节点都删除
   - 如果只有`vnode`有子节点，那就创建这些子节点
   - 如果`oldVnode`和`vnode`都没有子节点，但是`oldVnode`是文本节点或注释节点，就把`vnode.elm`的文本设置为空字符串
4. 如果`vnode`是文本节点或注释节点，但是`vnode.text != oldVnode.text`时，只需要更新`vnode.elm`的文本内容就可以

### 5.虚拟DOM性能真的好吗

- MVVM框架解决视图和状态同步问题

- 模板引擎可以简化视图操作,没办法跟踪状态

- 虚拟DOM跟踪状态变化

- 参考github上virtual-dom的动机描述

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

Virtual DOM的更新DOM的准备工作耗费更多的时间，也就是JS层面，相比于更多的DOM操作它的消费是极其便宜的。尤雨溪在社区论坛中说道∶ 框架给你的保证是，你不需要手动优化的情况下，依然可以给你提供过得去的性能。 

**（2）跨平台** Virtual DOM本质上是JavaScript的对象，它可以很方便的跨平台操作，比如服务端渲染、uniapp等。

- 首次渲染大量DOM时，由于多了一层虚拟DOM的计算，会比innerHTML插入慢。
- 正如它能保证性能下限，在真实DOM操作的时候进行针对性的优化时，还是更快的。

### 6.Vue key的作用是什么，为什么不建议index做key

vue 中 key 值的作用可以分为两种情况来考虑：

- 第一种情况是 v-if 中使用 key。由于 Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。因此当使用 v-if 来实现元素切换的时候，如果切换前后含有相同类型的元素，那么这个元素就会被复用。如果是相同的 input 元素，那么切换前后用户的输入不会被清除掉，这样是不符合需求的。因此可以通过使用 key 来唯一的标识一个元素，这个情况下，使用 key 的元素不会被复用。这个时候 key 的作用是用来标识一个独立的元素。
- 第二种情况是 v-for 中使用 key。用 v-for 更新已渲染过的元素列表时，它默认使用“就地复用”的策略。如果数据项的顺序发生了改变，Vue 不会移动 DOM 元素来匹配数据项的顺序，而是简单复用此处的每个元素。因此通过为每个列表项提供一个 key 值，来以便 Vue 跟踪元素的身份，从而高效的实现复用。这个时候 key 的作用是为了高效的更新渲染虚拟 DOM。

key 是为 Vue 中 vnode 的唯一标记，通过这个 key，diff 操作可以更准确、更快速

- 更准确：因为带 key 就不是就地复用了，在 sameNode 函数a.key === b.key对比中可以避免就地复用的情况。所以会更加准确。
- 更快速：利用 key 的唯一性生成 map 对象来获取对应节点，比遍历方式更快

使用index 作为 key和没写基本上没区别，因为不管数组的顺序怎么颠倒，index 都是 0, 1, 2...这样排列，导致 Vue 会复用错误的旧子节点，做很多额外的工作。

### 7.vnode的挂载和更新流程

本文主要介绍在视图的渲染过程中，Vue 是如何把 vnode 解析并挂载到页面中的。我们通过一个最简单的例子来分析主要流程：

```html
  <div id="app">
      {{someVar}}
  </div>

  <script type="text/javascript">
      new Vue({
          el: '#app',

          data: {
              someVar: 'init'
          },

          mounted(){
              setTimeout(() => this.someVar = 'changed', 3000)
          }

      })
  </script>
```

页面初始会显示 "init" 字符串，3秒钟之后，会更新为 "changed" 字符串。

为了便于理解，将流程分为两个阶段：

1. 首次渲染，生成 vnode，并将其挂载到页面中
2. 再次渲染，根据更新后的数据，再次生成 vnode，并将其更新到页面中

#### 第一阶段

##### 流程

vm.$mount(vm.$el) => **render = compileToFunctions(template).render** => updateComponent() => **vnode = render()** => vm._update(vnode) => **patch(vm.$el, vnode)**

##### 说明

由 render() 方法生成 vnode，然后由 patch() 方法挂载到页面中。

##### render() 方法

render() 方法根据当前 vm 的数据生成 vnode。

该方法可以是新建 Vue 实例时传入的 render() 方法，也可以由 Vue 的 compiler 模块根据传入的 template 自动生成。

本例中该方法是由 el 属性对应的 template 生成的，代码如下：

```javascript
(function() {
    with (this) {
        return _c('div', {
            attrs: {
                "id": "app"
            }
        }, [_v("
            " + _s(someVar) + "
        ")])
    }
})
```

实例化 Vue 时传入这样的参数可以达到相似的效果（区别在于变量两边的空格）：

```javascript
new Vue({
  data: {
    someVar: 'init'
  },
  render: function(createElement){
    return createElement(
      'div',
      {
        attrs: {
          "id": "app"
        }
      },
      [
        this.someVar
      ]
    )
  },
  mounted(){
    setTimeout(() => this.someVar = 'changed', 3000)
  }

}).$mount('#app')
  
```

##### Vnode() 类

Vnode 是虚拟 DOM 节点类，其实例 vnode 是一个包含着渲染 DOM 节点所需要的一切信息的普通对象。

上述的 render() 方法调用后会生成 vnode 对象，这是第一次生成，将其称为 initVnode，结构如下（选取部分属性）：

```javascript
{
    children: [
        {
            children: undefined,
            data: undefined,
            elm: undefined,
            tag: undefined,
            text: 'init'
        }
    ],
    data: {
        attrs: {
            id: 'app'
        }
    },
    elm: undefined,
    tag: 'div',
    text: undefined
}
```

简要介绍其属性：

1. children 是当前 vnode 的子节点（VNodes）数组，当前只有一个文本子节点
2. data 是当前 vnode 代表的节点的各种属性，是 createElement() 方法的第二个参数
3. elm 是根据 vnode 生成 HTML 元素挂载到页面中后对应的 DOM 节点，此时还没有挂载，所以为空
4. tag 是当前 vnode 对应的 html 标签
5. text 是当前 vnode 对应的文本或者注释

children 和 text 是互斥的，不会同时存在。

生成了 vnode 之后，就要根据其属性生成 DOM 元素并挂载到页面中了，这是 patch() 方法要做的事情，下面看其内部的流程：

patch(vm.$el, vnode) => createElm(vnode, [], parentElm, nodeOps.nextSibling(oldElm)) => removeVnodes(parentElm, [oldVnode], 0, 0)

##### patch(oldVnode, vnode) 方法

根据参数的不同，该方法的处理方式也不同，oldVnode 有这几种可能的取值：undefined、ELEMENT_NODE、VNode，vnode 有这几种可能的取值：undefined、VNode，所以组合起来一共是 3 * 2 = 6 种处理方式：

| oldVnode     | vnode     | 操作                                    |
| ------------ | --------- | --------------------------------------- |
| undefined    | undefined | -                                       |
| ELEMENT_NODE | undefined | invokeDestroyHook(oldVnode)             |
| Vnode        | undefined | invokeDestroyHook(oldVnode)             |
| undefined    | Vnode     | createElm(vnode, [], parentElm, refElm) |
| ELEMENT_NODE | Vnode     | createElm(vnode, [], parentElm, refElm) |
| Vnode        | Vnode     | patchVnode(oldVnode, vnode)             |

可以看到，处理方式可以分为3种情况：

1. 如果 vnode 为 undefined，就要删除节点
2. 如果 oldVnode 是 undefined 或者是 DOM 节点，vnode 是 VNode 实例的话，表示是第一次渲染 vnode，调用 createElm() 方法创建新节点
3. 如果 oldVnode 和 vnode 都是 VNode 类型的话，就要调用 patchVnode() 方法来对 oldVnode 和 vnode 做进一步处理了，第二阶段流程会介绍这种情况

本阶段流程是首次渲染，符合第 2 种情况，下面看 createElm() 方法的实现：

##### createElm(vnode, [], parentElm, refElm) 方法

该方法根据 vnode 的属性创建组件或者普通 DOM 元素，有如下几种处理方式：

1. 调用 createComponent() 方法对 component 做处理，这里就不再展开讨论。
2. vnode.tag 存在：
   1. 调用 nodeOps.createElement(tag, vnode) 创建 DOM 元素，
   2. 调用 createChildren() 方法递归创建子节点。
   3. 调用 invokeCreateHooks() 方法调用生命周期相关的 create 钩子处理 vnode.data 数据
3. vnode 是文本类型，调用 nodeOps.createTextNode(vnode.text) 创建文本元素

对于2，3 这两种情况，最后都会调用 insert() 方法将生成的 DOM 元素挂载到页面中。此时，页面的 DOM 结构如下：

```html
<body>
  <div id="app">
    {{someVar}}
  </div>
  <div id="app">
    init
  </div>
</body>
```

可以看到，原始的 DOM 元素还保留在页面中，所以在createElm() 方法调用之后，还会调用 removeVnodes() 方法，将原始的 DOM 元素删除掉。

这样，就完成了首次视图的渲染。在这个过程中，Vue 还会做一些额外的操作：

1. 将 vnode 保存到 vm._vnode 属性上，供再次渲染视图时与新 vnode 做比较
2. vnode 会更新一些属性：

```javascript
{
    children: [
        {
            children: undefined,
            data: undefined,
            elm: Text, // text
            tag: undefined,
            text: 'init'
        }
    ],
    data: {
        attrs: {
            id: 'app'
        }
    },
    elm: HTMLDivElement, // div#app
    tag: 'div',
    text: undefined
}
```

可以看到，vnode 及其子节点的 elm 属性更新为了页面中对应的 DOM 节点，不再是 undefined，也是为了再次渲染时使用。

#### 第二阶段

##### 流程

updateComponent() => **vnode = render()** => vm._update(vnode) => **patch(oldVnode, vnode)**

第二阶段渲染时，会根据更新后的 vm 数据，再次生成 vnode 节点，称之为 updateVnode，结构如下：

```javascript
{
    children: [
        {
            children: undefined,
            data: undefined,
            elm: undefined,
            tag: undefined,
            text: 'changed'
        }
    ],
    data: {
        attrs: {
            id: 'app'
        }
    },
    elm: undefined,
    tag: 'div',
    text: undefined
}
```

可以看到， updateVnode 与 最初生成的 initVnode 的区别就是子节点的 text 属性由 init 变为了 changed，正是符合我们预期的变化。

生成新的 vnode 之后，还是要调用 patch 方法对 vnode 做处理，不过这次参数发生了变化，第一个参数不再是要挂载的DOM节点，而是 initVnode，本次 patch() 方法调用的流程如下：

patch(oldVnode, vnode) => patchVnode(oldVnode, vnode) => updateChildren(elm, oldCh, ch) => patchVnode(oldCh, ch) => nodeOps.setTextContent(elm, vnode.text)

其中 oldVnode 就是第一阶段保存的 vm._vnode，elm 就是第一阶段更新的 elm 属性。

根据上面对 patch() 方法的分析，此时 oldVnode 和 vnode 都是 VNode 类型，所以调用 patchVnode() 方法做进一步处理。

##### patchVnode(oldVnode, vnode) 方法

该方法包含两个主要流程：

1. 更新自身属性，调用 Vue 内置的组件生命周期 update 阶段的钩子方法更新节点自身的属性，类似之前的 invokeCreateHooks() 方法，这里不再展开说明
2. 更新子节点，根据子节点的不同类型调用不同的方法

根据 vnode 的 children 和 text 属性的取值，子节点有 3 种可能：

1. children 不为空，text 为空
2. children 为空，text 不为空
3. children 和 text 都为空

由于 oldVnode 和 vnode 的子节点都有 3 种可能：undefined、children 或 text，所以一共有 3 * 3 = 9 种操作：

| oldCh     | ch        | 操作                                                         |
| --------- | --------- | ------------------------------------------------------------ |
| children  | text      | nodeOps.setTextContent(elm, vnode.text)                      |
| text      | text      | nodeOps.setTextContent(elm, vnode.text)                      |
| undefined | text      | nodeOps.setTextContent(elm, vnode.text)                      |
| children  | children  | updateChildren(elm, oldCh, ch)                               |
| text      | children  | setTextContent(elm, ''); addVnodes(elm, null, ch, 0, ch.length - 1) |
| undefined | children  | addVnodes(elm, null, ch, 0, ch.length - 1)                   |
| children  | undefined | removeVnodes(elm, oldCh, 0, oldCh.length - 1)                |
| text      | undefined | nodeOps.setTextContent(elm, '')                              |
| undefined | undefined | -                                                            |

可以看到，大概分为这几类处理方式：

1. 如果 ch 是 text ，那么就对 DOM 节点直接设置新的文本；
2. 如果 ch 为 undefined 了，那么就清空 DOM 节点的内容
3. 如果 ch 是 children 类型，而 oldCh是 文本或者为 undefined ，那么就是在 DOM 节点内新增节点
4. ch 和 oldCh 都是 children 类型，那么就要调用 updateChildren() 方法来更新 DOM 元素的子节点

##### updateChildren(elm, oldCh, ch) 方法

updateChildren() 方法是 Vnode 处理方法中最复杂也是最核心的方法，它主要做两件事情：

1. 递归调用 patchVnode 方法处理更下一级子节点
2. 根据各种判断条件，对页面上的 DOM 节点进行**尽可能少**的添加、移动和删除操作

下面分析方法的具体实现：

oldCh 和 ch 是代表旧和新两个 Vnode 节点序列，oldStartIdx、newStartIdx、oldEndIdx、newEndIdx 是 4 个指针，指向 oldCh 和 ch 未处理节点序列中的的开始和结束节点，指向的节点命名为 oldStartVnode、newStartVnode、oldEndVnode、newEndVnode。指针在序列中从两边向中间移动，直到 oldCh 或 ch 中的某个序列中的全部节点都处理完毕，这时，如果另一个序列尚有未处理完毕的节点，会再对这些节点进行添加或删除。

先看 while 循环，在 oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx 条件下，分为这几种情况：

1. isUndef(oldStartVnode) 和 isUndef(oldEndVnode) 在第一次循环时是不会触发的，需要后续条件才可能触发，下面会分析到
2. sameVnode(oldStartVnode, newStartVnode) 和 sameVnode(oldEndVnode, newEndVnode) 情况下不用移动 DOM 节点，只移动指针，比如：[A, B] => [A, C]
3. sameVnode(oldStartVnode, newEndVnode) 情况下，是要将 oldStartVnode 向右移动到 oldEndIdx 对应的节点后面，比如：[A, B] => [C, A]
4. sameVnode(oldEndVnode, newStartVnode) 情况下，是要将 oldEndVnode 向左移动到 oldStartIdx 对应的节点前面，比如：[A, B] => [B, C]
5. 在以上条件都不满足的情况下，就要根据 newStartVnode 的 key 属性来进一步处理：
   1. 如果 newStartVnode 没有对应到 oldCh 中的某个元素，比如：[A, B] => [C]，说明这个节点是新增加的，那么就调用 createElm() 新建节点及其子节点
   2. 如果 newStartVnode 对应到了 oldCh 中的某个元素，比如：[A, B, C] => [B, A, E]，那么就直接移动该元素到 oldStartIdx 对应的节点前面，同时还会将 oldCh 中对应的节点置为 undefined，表示元素已经处理过了，此时，oldCh == [A, undefined, C]，这样，在后续的循环中，就可以触发 isUndef(oldStartVnode) 或 isUndef(oldEndVnode) 条件了
   3. 另外，还可能会有重复 key 或者 key 相同但是 tag 等属性不同的情况，比如：[A, B, C] => [B, A, A, C]，对于这类情况，newStartVnode 也会被作为新元素处理

循环结束时，必然会满足 oldStartIdx > oldEndIdx 或 newStartIdx > newEndIdx 两种情况之一，所以对这两种情况需要进一步处理：

1. oldStartIdx > oldEndIdx 的情况，比如 [A] => [A, B, C]，循环结束时，ch 中的 B 和 C 都还没有添加到页面中，这时就会调用 addVnodes() 方法将他们依次添加
2. newStartIdx > newEndIdx 的情况，比如 [A, B, C] => [D]，循环结束时，A, B, C 都还保留在页面中，这时需要调用 removeVnodes() 将他们从页面中移除

如果循环结束时，新旧序列中的节点全部都处理完毕了，如：[A, B] => [B, A]，那么，虽然也会触发这两种逻辑之一，但是并不会对 DOM 产生实际的影响。

下面通过一些例子来展示该方法对 DOM 节点的操作流程：

[A, B] => [A, C]

| 序号 | 说明                                                         | oldStartIdx | oldEndIdx | newStartIdx | newEndIdx | DOM     |
| ---- | ------------------------------------------------------------ | ----------- | --------- | ----------- | --------- | ------- |
| 0    | 初始状态                                                     | 0           | 1         | 0           | 1         | A, B    |
| 1    | 第一次循环，满足 sameVnode(oldStartVnode, newStartVnode)， 无 DOM 操作 | 1           | 1         | 1           | 1         | A, B    |
| 2    | 第二次循环，满足 isUndef(idxInOld) 条件，新增 C 到 B 之前    | 1           | 1         | 2           | 1         | A, C, B |
| 2    | 循环结束，满足 newStartIdx > newEndIdx，将 B 移除            | 1           | 1         | 2           | 1         | A, C    |

[A, B] => [C, A]

| 序号 | 说明                                                         | oldStartIdx | oldEndIdx | newStartIdx | newEndIdx | DOM     |
| ---- | ------------------------------------------------------------ | ----------- | --------- | ----------- | --------- | ------- |
| 0    | 初始状态                                                     | 0           | 1         | 0           | 1         | A, B    |
| 1    | 第一次循环，满足 sameVnode(oldStartVnode, newEndVnode) ，移动 A 到 B 之后 | 1           | 1         | 0           | 0         | B, A    |
| 2    | 第二次循环，满足 isUndef(idxInOld) 条件，新增 C 到 B 之前    | 1           | 1         | 1           | 0         | C, B, A |
| 2    | 循环结束，满足 newStartIdx > newEndIdx，将 B 移除            | 1           | 1         | 1           | 0         | C, A    |

[A, B, C] => [B, A, E]

| 序号 | 说明                                                         | oldCh             | oldStartIdx | oldEndIdx | ch        | newStartIdx | newEndIdx | DOM        |
| ---- | ------------------------------------------------------------ | ----------------- | ----------- | --------- | --------- | ----------- | --------- | ---------- |
| 0    | 初始状态                                                     | [A, B, C]         | 0           | 2         | [B, A, E] | 0           | 2         | A, B, C    |
| 1    | 第一次循环，满足 sameVnode(elmToMove, newStartVnode)，移动 B 到 A 之前 | [A, undefined, C] | 0           | 2         | [B, A, E] | 1           | 2         | B, A, C    |
| 2    | 第二次循环，满足 sameVnode(oldStartVnode, newStartVnode)，无 DOM 操作 | [A, undefined, C] | 1           | 2         | [B, A, E] | 2           | 2         | B, A, C    |
| 3    | 第三次循环，满足 isUndef(oldStartVnode)，无 DOM 操作         | [A, undefined, C] | 2           | 2         | [B, A, E] | 2           | 2         | B, A, C    |
| 4    | 第四次循环，满足 isUndef(idxInOld)，新增 E 到 C 之前         | [A, undefined, C] | 2           | 2         | [B, A, E] | 3           | 2         | B, A, E, C |
| 5    | 循环结束，满足 newStartIdx > newEndIdx，将 C 移除            | [A, undefined, C] | 2           | 2         | [B, A, E] | 3           | 2         | B, A, E    |

[A] => [B, A]

| 序号 | 说明                                                         | oldStartIdx | oldEndIdx | newStartIdx | newEndIdx | DOM  |
| ---- | ------------------------------------------------------------ | ----------- | --------- | ----------- | --------- | ---- |
| 0    | 初始状态                                                     | 0           | 0         | 0           | 1         | A    |
| 1    | 第一次循环，满足 sameVnode(oldStartVnode, newEndVnode)，无 DOM 操作 | 1           | 0         | 0           | 0         | A    |
| 2    | 循环结束，满足 oldStartIdx > oldEndIdx ，新增 B 到 A 之前    | 1           | 0         | 0           | 1         | B, A |

[A, B] => [B, A]

| 序号 | 说明                                                         | oldStartIdx | oldEndIdx | newStartIdx | newEndIdx | DOM  |
| ---- | ------------------------------------------------------------ | ----------- | --------- | ----------- | --------- | ---- |
| 0    | 初始状态                                                     | 0           | 1         | 0           | 1         | A, B |
| 1    | 第一次循环，满足 sameVnode(oldStartVnode, newEndVnode)，移动 A 到 B 之后 | 1           | 1         | 0           | 0         | B, A |
| 2    | 第二次循环，满足 sameVnode(oldStartVnode, newStartVnode) 条件，无 DOM 操作 | 2           | 1         | 1           | 0         | B, A |
| 3    | 循环结束，满足 oldStartIdx > oldEndIdx ，无 DOM 操作         | 2           | 1         | 1           | 0         | B, A |

通过以上流程，视图再次得到了更新。同时，新的 vnode 和 elm 也会被保存，供下一次视图更新时使用。

以上分析了 Vnode 渲染和更新过程中的主要方法和流程，下面是本例中涉及到的主要方法的流程图：
![Vnode 流程图](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202303671.png)

## vue源码分析

### 基本实现

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

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202303860.png)

diff 算法的逻辑比较复杂，可以单独摘出来研究，由于我们的目的是理解框架的核心逻辑，因此代码实现里只考虑了最简单的情形。

[完整代码](https://github.com/bison1994/vue-for-learning/blob/master/stage-3/vue-0.3.js)

 

**第三步：对数据做响应式处理，当数据变化时，自动执行更新方法**

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202304012.jpeg)

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
    ![WX20220315-161349@2x.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208202304631.png)

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





## 框架对比

### Vue和js、jquery对比

jQuery这个诞生于2006年的js类库，因为它强大的选择器大大解决了许多前端小白取不到元素的痛、链式操作使得jQuery代码简洁优雅、丰富的插件支持让可扩展性相当高、轻量又不会污染顶级变量的优点，曾经风靡一时。但长江后浪推前浪，于2013年尤雨溪个人开发的Vue框架，现在已然成为全世界三大前端框架之一。那么Vue到底有什么优势能够脱颖而出呢？总的来说，Vue的核心优势就是减少DOM操作、双向数据绑定和组件化3个方面。

#### 减少DOM操作

从jQuery到Vue，是前端思维的转变，从传统的直接操作DOM元素转变为操作虚拟DOM，这是Vue较jQuery乃至原生JS，更具优势的一个原因。
那么什么叫做直接操作DOM元素？什么叫操作虚拟DOM？虚拟DOM的优势是什么？

- jQuery直接操作DOM元素，是使用选择器（$）选取DOM对象，对其进行赋值、取值、事件绑定等操作。每次对元素处理的前提都是先取到元素，DOM操作较多。
- Vue操作虚拟DOM，是在Vue类下面新建对象模拟DOM元素，在操作过程中对数据进行处理而不是直接操作DOM元素，当数据处理完成后，仅仅比较开始和结束状态虚拟DOM有哪些变换，最终根据结束状态虚拟DOM去操作DOM。
- 虚拟DOM的出现将前端的工作从操作元素为主转变为处理数据，减少了DOM操作，减少浏览器的渲染引擎的工作量，渲染更快，大大解决了前端性能优化的难题。

#### 双向数据绑定

数据绑定分单向数据绑定和双向数据绑定。传统的单向数据绑定一般是数据影响页面，而页面不影响数据。Vue在MVVM框架中的双向数据绑定通过v-model实现（在 MVVM 框架中，View(视图，也就是常说的页面) 和 Model(数据) 不可以直接通讯），使得视图和数据可以根据一方的改变自身做出相应改变。最直观的就是，在Vue中数据改变，视图无需刷新即可实时改变，而jQuery中数据改变，视图需要用户手动刷新才会改变。

#### 组件化

Vue组件具有独立的逻辑和功能或界面，同时又能根据规定的接口规则进行相互融合，变成一个完整的应用，简单来说，就是将页面的功能等需求进行划分成多个模块，可以根据需求增减，同时不影响整个页面的运行。在工作中，有这方面的需求时，可以自己写组件进行重复使用，还可以从网上获取相应组件，也可以对别人封装的组件进行二次封装等等。Vue组件的优势就是组件进行重复使用，便于协同开发，提高开发效率。

#### 单页面应用

单页面的实现一般是几个div在来回切换。如果一开始已经写好html，再来回切的话，html是太长了。如果用js去写又拼的很麻烦。如果用jq、原生实现页面切换，比较好的方式是用模版引擎，但其实单页面的实现没那么简单，不单单要考虑html能否单独写出来，还要考虑js需不需要按需加载，路由需不需要等等。。。用vue就不需要烦这些东西，vue自动构建单页应用，使用router模拟跳转

总的来说，jQuery和Vue的关系并非你死我活，各自都有不同的侧重点。jQuery侧重样式操作，动画效果，而Vue侧重数据绑定。大家可以根据需求进行结合使用。



#### Vue比JQuery减少了 DOM 操作

在这里我先提出一个问题，为什么要较少DOM操作

回答：当DOM操作影响到布局的时候，浏览器的渲染引擎就要重新计算然后渲染，越多的DOM操作就会导致越多的计算，自然会影响页面性能，所以DOM操作减少是最好的

那Vue又是怎么样减少DOM操作的呢？

Vue通过虚拟DOM技术减少DOM操作。什么是虚拟DOM？使用js对象模拟DOM，在操作过程中不会直接操作DOM，等待虚拟DOM操作完成，仅仅比较开始和结束状态虚拟DOM有哪些变换，最终根据结束状态虚拟DOM去操作DOM。至于虚拟DOM怎么比较则是采用diff算法，具体算法我也不会。不过diff算法里有一个很好的措施来减少DOM操作。

#### diff的处理措施：

##### （一）、优先处理特殊场景

（1）、头部的同类型节点、尾部的同类型节点

这类节点更新前后位置没有发生变化，所以不用移动它们对应的DOM

（2）、头尾/尾头的同类型节点

这类节点位置很明确，不需要再花心思查找，直接移动DOM就好

##### （二）、“原地复用”

“原地复用”是指Vue会尽可能复用DOM，尽可能不发生DOM的移动。Vue在判断更新前后指针是否指向同一个节点，其实不要求它们真实引用同一个DOM节点，实际上它仅判断指向的是否是同类节点，如果是同类节点，那么Vue会直接复用DOM，例如通过对换文本内容的方式，这样的好处是不需要移动DOM。

#### Vue支持双向数据绑定

数据绑定有单向数据绑定和双向数据绑定。

##### 什么是单向数据绑定？

单向数据绑定即一方面只受另一方面影响，却无法影响另一方面。前端常说的单向数据绑定一般都指数据影响页面，而页面不影响数据。

##### 什么是双向数据绑定？

双向的意思即两个方面相互影响，前端来说，即数据影响页面，页面同时影响数据。例如，在 MVVM 框架中，View(视图) 和 Model(数据) 是不可以直接通讯的，在它们之间存在着 ViewModel 这个中间介充当着观察者的角色。当用户操作 View(视图)，ViewModel 感知到变化，然后通知 Model 发生相应改变；反之当 Model(数据) 发生改变，ViewModel 也能感知到变化，使 View 作出相应更新。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs11989392-be71514e8de9219b.png)

v-model双向绑定

以上代码将input的value和页面显示双向绑定在一起。其实v-model只是语法糖，双向绑定其实就等于单向绑定+UI时间监听，只不过Vue将过程采用黑箱封装起来了。

##### 那双向绑定有什么好处？

好处就是方便，数据自动更新。而缺点就是无法得知是哪里更改了数据。

#### Vue支持组件化

##### 组件化的概念

Web 中的组件其实就是页面组成的一部分，好比是电脑中的每一个元件（如硬盘、键盘、鼠标），它是一个具有独立的逻辑和功能或界面，同时又能根据规定的接口规则进行相互融合，变成一个完整的应用，页面就是有一个个类似这样的部分组成，比如导航、列表、弹窗、下拉菜单等。页面只不过是这些组件的容器，组件自由组合形成功能完善的界面，当不需要某个组件，或者想要替换某个组件时，可以随时进行替换和删除，而不影响整个应用的运行。

##### 组件化的特性

**高内聚性**，组建功能必须是完整的，如我要实现下拉菜单功能，那在下拉菜单这个组件中，就把下拉菜单所需要的所有功能全部实现。

**低耦合度**，通俗点说，代码独立不会和项目中的其他代码发生冲突。在实际工程中，我们经常会涉及到团队协作，传统按照业务线去编写代码的方式，就很容易相互冲突，所以运用组件化方式就可大大避免这种冲突的存在、

每一个组件都有子集清晰的职责，完整的功能，较低的耦合便于单元测试和重复利用。

##### 组件化的优点

1.提高开发效率 2.方便重复使用 3.简化调试步骤 4.提升整个项目的可维护性 5.便于协同开发

### Vue3 与 Vue2 区别详述

#### **1\. 生命周期**

对于生命周期来说，整体上变化不大，只是大部分生命周期钩子名称上 + “on”，功能上是类似的。不过有一点需要注意，Vue3 在组合式API（Composition API，下面展开）中使用生命周期钩子时需要先引入，而 Vue2 在选项API（Options API）中可以直接调用生命周期钩子，如下所示。

```js
// vue3
<script setup>     
import { onMounted } from 'vue';   // 使用前需引入生命周期钩子
 
onMounted(() => {
  // ...
});
 
// 可将不同的逻辑拆开成多个onMounted，依然按顺序执行，不会被覆盖
onMounted(() => {
  // ...
});
</script>
 
// vue2
<script>     
export default {         
  mounted() {   // 直接调用生命周期钩子            
    // ...         
  },           
}
</script> 
```

常用生命周期对比如下表所示。

| vue2          | vue3            |
| ------------- | --------------- |
| beforeCreate  |                 |
| created       |                 |
| beforeMount   | onBeforeMount   |
| mounted       | onMounted       |
| beforeUpdate  | onBeforeUpdate  |
| updated       | onUpdated       |
| beforeDestroy | onBeforeUnmount |
| destroyed     | onUnmounted     |

> Tips： setup 是围绕 beforeCreate 和 created 生命周期钩子运行的，所以不需要显式地去定义。

#### **2\. 多根节点**

熟悉 Vue2 的朋友应该清楚，在模板中如果使用多个根节点时会报错，如下所示。

```js
// vue2中在template里存在多个根节点会报错
<template>
  <header></header>
  <main></main>
  <footer></footer>
</template>
 
// 只能存在一个根节点，需要用一个<div>来包裹着
<template>
  <div>
    <header></header>
    <main></main>
    <footer></footer>
  </div>
</template>
```

但是，Vue3 支持多个根节点，也就是 fragment。即以下多根节点的写法是被允许的。

```js
<template>
  <header></header>
  <main></main>
  <footer></footer>
</template>
```

#### **3\. Composition API**

Vue2 是选项API（Options API），一个逻辑会散乱在文件不同位置（data、props、computed、watch、生命周期钩子等），导致代码的可读性变差。当需要修改某个逻辑时，需要上下来回跳转文件位置。

Vue3 组合式API（Composition API）则很好地解决了这个问题，可将同一逻辑的内容写到一起，增强了代码的可读性、内聚性，其还提供了较为完美的逻辑复用性方案。

#### **4\. 异步组件（Suspense）**

Vue3 提供 Suspense 组件，允许程序在等待异步组件加载完成前渲染兜底的内容，如 loading ，使用户的体验更平滑。使用它，需在模板中声明，并包括两个命名插槽：default 和 fallback。Suspense 确保加载完异步内容时显示默认插槽，并将 fallback 插槽用作加载状态。

```js
<tempalte>
  <suspense>
    <template #default>
      <List />
    </template>
    <template #fallback>
      <div>
        Loading...
      </div>
    </template>
  </suspense>
</template>
```

在 List 组件（有可能是异步组件，也有可能是组件内部处理逻辑或查找操作过多导致加载过慢等）未加载完成前，显示 Loading...（即 fallback 插槽内容），加载完成时显示自身（即 default 插槽内容）。

#### **5\. Teleport**

Vue3 提供 Teleport 组件可将部分 DOM 移动到 Vue app 之外的位置。比如项目中常见的 Dialog 弹窗。

```js
<button @click="dialogVisible = true">显示弹窗</button>
<teleport to="body">
  <div class="dialog" v-if="dialogVisible">
    我是弹窗，我直接移动到了body标签下
  </div>
</teleport>
```

#### **6\. 响应式原理**

Vue2 响应式原理基础是 Object.defineProperty；Vue3 响应式原理基础是 Proxy。

-   Object.defineProperty

基本用法：直接在一个对象上定义新的属性或修改现有的属性，并返回对象。

```js
let obj = {};
let name = 'leo';
Object.defineProperty(obj, 'name', {
  enumerable: true,   // 可枚举（是否可通过 for...in 或 Object.keys() 进行访问）
  configurable: true,   // 可配置（是否可使用 delete 删除，是否可再次设置属性）
  // value: '',   // 任意类型的值，默认undefined
  // writable: true,   // 可重写
  get() {
    return name;
  },
  set(value) {
    name = value;
  }
});
```

> Tips： `writable` 和 `value` 与 `getter` 和 `setter` 不共存。

搬运 Vue2 核心源码。

```js
function defineReactive(obj, key, val) {
  // 一 key 一个 dep
  const dep = new Dep()
  
  // 获取 key 的属性描述符，发现它是不可配置对象的话直接 return
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) { return }
  
  // 获取 getter 和 setter，并获取 val 值
  const getter = property && property.get
  const setter = property && property.set
  if((!getter || setter) && arguments.length === 2) { val = obj[key] }
  
  // 递归处理，保证对象中所有 key 被观察
  let childOb = observe(val)
  
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    // get 劫持 obj[key] 的 进行依赖收集
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val
      if(Dep.target) {
        // 依赖收集
        dep.depend()
        if(childOb) {
          // 针对嵌套对象，依赖收集
          childOb.dep.depend()
          // 触发数组响应式
          if(Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
    }
    return value
  })
  // set 派发更新 obj[key]
  set: function reactiveSetter(newVal) {
    ...
    if(setter) {
      setter.call(obj, newVal)
    } else {
      val = newVal
    }
    // 新值设置响应式
    childOb = observe(val)
    // 依赖通知更新
    dep.notify()
  }
}
```

那 Vue3 为何会抛弃它呢？那肯定是因为它存在某些局限性。

主要原因：无法监听对象或数组新增、删除的元素。

Vue2 相应解决方案：针对常用数组原型方法push、pop、shift、unshift、splice、sort、reverse进行了hack处理；提供Vue.set监听对象/数组新增属性。对象的新增/删除响应，还可以new个新对象，新增则合并新属性和旧对象；删除则将删除属性后的对象深拷贝给新对象。

-   Proxy

Proxy 是 ES6 新特性，通过第2个参数 handler 拦截目标对象的行为。相较于 Object.defineProperty 提供语言全范围的响应能力，消除了局限性。

局限性：

(1)、对象/数组的新增、删除

(2)、监测 .length 修改

(3)、Map、Set、WeakMap、WeakSet 的支持

基本用法：创建对象的代理，从而实现基本操作的拦截和自定义操作。

```js
let handler = {
  get(obj, prop) {
    return prop in obj ? obj[prop] : '';
  },
  set() {
    // ...
  },
  ...
};
```

搬运 vue3 的源码 reactive.ts 文件。

```js
function createReactiveObject(target, isReadOnly, baseHandlers, collectionHandlers, proxyMap) {
  ...
  // collectionHandlers: 处理Map、Set、WeakMap、WeakSet
  // baseHandlers: 处理数组、对象
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
  )
  proxyMap.set(target, proxy)
  return proxy
}
```

#### **7\. 虚拟DOM**

Vue3 相比于 Vue2，虚拟DOM上增加 patchFlag 字段。我们借助Vue3 Template Explorer来看。

```vue
<div id="app">
  <h1>vue3虚拟DOM讲解</h1>
  <p>今天天气真不错</p>
  <div>{{name}}</div>
</div>
```

渲染函数如下所示。

```js
import { createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock, pushScopeId as _pushScopeId, popScopeId as _popScopeId } from vue
 
const _withScopeId = n => (_pushScopeId(scope-id),n=n(),_popScopeId(),n)
const _hoisted_1 = { id: app }
const _hoisted_2 = /*#__PURE__*/ _withScopeId(() => /*#__PURE__*/_createElementVNode(h1, null, vue3虚拟DOM讲解, -1 /* HOISTED */))
const _hoisted_3 = /*#__PURE__*/ _withScopeId(() => /*#__PURE__*/_createElementVNode(p, null, 今天天气真不错, -1 /* HOISTED */))
 
export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock(div, _hoisted_1, [
    _hoisted_2,
    _hoisted_3,
    _createElementVNode(div, null, _toDisplayString(_ctx.name), 1 /* TEXT */)
  ]))
}
```

注意第3个\_createElementVNode的第4个参数即 patchFlag 字段类型。

字段类型情况：1 代表节点为动态文本节点，那在 diff 过程中，只需比对文本对容，无需关注 class、style等。除此之外，发现所有的静态节点（HOISTED 为 -1），都保存为一个变量进行静态提升，可在重新渲染时直接引用，无需重新创建。

```js
// patchFlags 字段类型列举
export const enum PatchFlags { 
  TEXT = 1,   // 动态文本内容
  CLASS = 1 << 1,   // 动态类名
  STYLE = 1 << 2,   // 动态样式
  PROPS = 1 << 3,   // 动态属性，不包含类名和样式
  FULL_PROPS = 1 << 4,   // 具有动态 key 属性，当 key 改变，需要进行完整的 diff 比较
  HYDRATE_EVENTS = 1 << 5,   // 带有监听事件的节点
  STABLE_FRAGMENT = 1 << 6,   // 不会改变子节点顺序的 fragment
  KEYED_FRAGMENT = 1 << 7,   // 带有 key 属性的 fragment 或部分子节点
  UNKEYED_FRAGMENT = 1 << 8,   // 子节点没有 key 的fragment
  NEED_PATCH = 1 << 9,   // 只会进行非 props 的比较
  DYNAMIC_SLOTS = 1 << 10,   // 动态的插槽
  HOISTED = -1,   // 静态节点，diff阶段忽略其子节点
  BAIL = -2   // 代表 diff 应该结束
}
```

**8\. 事件缓存**

Vue3 的`cacheHandler`可在第一次渲染后缓存我们的事件。相比于 Vue2 无需每次渲染都传递一个新函数。加一个 click 事件。

```vue
<div id="app">
  <h1>vue3事件缓存讲解</h1>
  <p>今天天气真不错</p>
  <div>{{name}}</div>
  <span onCLick=() => {}><span>
</div>
```

渲染函数如下所示。

```javascript
import { createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock, pushScopeId as _pushScopeId, popScopeId as _popScopeId } from vue
 
const _withScopeId = n => (_pushScopeId(scope-id),n=n(),_popScopeId(),n)
const _hoisted_1 = { id: app }
const _hoisted_2 = /*#__PURE__*/ _withScopeId(() => /*#__PURE__*/_createElementVNode(h1, null, vue3事件缓存讲解, -1 /* HOISTED */))
const _hoisted_3 = /*#__PURE__*/ _withScopeId(() => /*#__PURE__*/_createElementVNode(p, null, 今天天气真不错, -1 /* HOISTED */))
const _hoisted_4 = /*#__PURE__*/ _withScopeId(() => /*#__PURE__*/_createElementVNode(span, { onCLick: () => {} }, [
  /*#__PURE__*/_createElementVNode(span)
], -1 /* HOISTED */))
 
export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock(div, _hoisted_1, [
    _hoisted_2,
    _hoisted_3,
    _createElementVNode(div, null, _toDisplayString(_ctx.name), 1 /* TEXT */),
    _hoisted_4
  ]))
}
```

观察以上渲染函数，你会发现 click 事件节点为静态节点（HOISTED 为 -1），即不需要每次重新渲染。

**9\. Diff算法优化**

搬运 Vue3 patchChildren 源码。结合上文与源码，patchFlag 帮助 diff 时区分静态节点，以及不同类型的动态节点。一定程度地减少节点本身及其属性的比对。

```javascript
function patchChildren(n1, n2, container, parentAnchor, parentComponent, parentSuspense, isSVG, optimized) {
  // 获取新老孩子节点
  const c1 = n1 && n1.children
  const c2 = n2.children
  const prevShapeFlag = n1 ? n1.shapeFlag : 0
  const { patchFlag, shapeFlag } = n2
  
  // 处理 patchFlag 大于 0 
  if(patchFlag > 0) {
    if(patchFlag && PatchFlags.KEYED_FRAGMENT) {
      // 存在 key
      patchKeyedChildren()
      return
    } els if(patchFlag && PatchFlags.UNKEYED_FRAGMENT) {
      // 不存在 key
      patchUnkeyedChildren()
      return
    }
  }
  
  // 匹配是文本节点（静态）：移除老节点，设置文本节点
  if(shapeFlag && ShapeFlags.TEXT_CHILDREN) {
    if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      unmountChildren(c1 as VNode[], parentComponent, parentSuspense)
    }
    if (c2 !== c1) {
      hostSetElementText(container, c2 as string)
    }
  } else {
    // 匹配新老 Vnode 是数组，则全量比较；否则移除当前所有的节点
    if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense,...)
      } else {
        unmountChildren(c1 as VNode[], parentComponent, parentSuspense, true)
      }
    } else {
      
      if(prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, '')
      } 
      if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(c2 as VNodeArrayChildren, container,anchor,parentComponent,...)
      }
    }
  }
}
```

patchUnkeyedChildren 源码如下所示。

```javascript
function patchUnkeyedChildren(c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, optimized) {
  c1 = c1 || EMPTY_ARR
  c2 = c2 || EMPTY_ARR
  const oldLength = c1.length
  const newLength = c2.length
  const commonLength = Math.min(oldLength, newLength)
  let i
  for(i = 0; i < commonLength; i++) {
    // 如果新 Vnode 已经挂载，则直接 clone 一份，否则新建一个节点
    const nextChild = (c2[i] = optimized ? cloneIfMounted(c2[i] as Vnode)) : normalizeVnode(c2[i])
    patch()
  }
  if(oldLength > newLength) {
    // 移除多余的节点
    unmountedChildren()
  } else {
    // 创建新的节点
    mountChildren()
  }
 
}
```

**10\. 打包优化**

Tree-shaking：模块打包 webpack、rollup 等中的概念。移除 JavaScript 上下文中未引用的代码。主要依赖于 import 和 export 语句，用来检测代码模块是否被导出、导入，且被 JavaScript 文件使用。

以 nextTick 为例子，在 Vue2 中，全局API暴露在Vue实例上，即使未使用，也无法通过 tree-shaking 进行消除。

```javascript
import Vue from 'vue';
 
Vue.nextTick(() => {
  // 一些和DOM有关的东西
});
```

Vue3 中针对全局和内部的API进行了重构，并考虑到 tree-shaking 的支持。因此，全局API现在只能作为ES模块构建的命名导出进行访问。

```javascript
import { nextTick } from 'vue';   // 显式导入
 
nextTick(() => {
  // 一些和DOM有关的东西
});
```

通过这一更改，只要模块绑定器支持 tree-shaking，则Vue应用程序中未使用的 api 将从最终的捆绑包中消除，获得最佳文件大小。

受此更改影响的全局API如下所示。

-   Vue.nextTick
-   Vue.observable （用 Vue.reactive 替换）
-   Vue.version
-   Vue.compile （仅全构建）
-   Vue.set （仅兼容构建）
-   Vue.delete （仅兼容构建）

内部API也有诸如 transition、v-model 等标签或者指令被命名导出。只有在程序真正使用才会被捆绑打包。Vue3 将所有运行功能打包也只有约22.5kb，比 Vue2 轻量很多。

**11\. TypeScript支持**

Vue3 由 TypeScript 重写，相对于 Vue2 有更好的 TypeScript 支持。

-   Vue2 Options API 中 option 是个简单对象，而 TypeScript 是一种类型系统，面向对象的语法，不是特别匹配。

-   Vue2 需要vue-class-component强化vue原生组件，也需要vue-property-decorator增加更多结合Vue特性的装饰器，写法比较繁琐。

**二、Options API 与 Composition API**

Vue 组件可以用两种不同的 API 风格编写：Options API 和 Composition API。

1\. Options API

使用 Options API，我们使用选项对象定义组件的逻辑，例如data、methods和mounted。由选项定义的属性在 this 内部函数中公开，指向组件实例，如下所示。

```javascript
<template>
  <button @click="increment">count is: {{ count }}</button>
</template>
 
<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++;
    }
  },
  mounted() {
    console.log(`The initial count is ${this.count}.`);
  }
}
</script>
```

2\. Composition API

使用 Composition API，我们使用导入的 API 函数定义组件的逻辑。在 SFC 中，Composition API 通常使用

```javascript
<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
 
<script setup>
import { ref, onMounted } from 'vue';
 
const count = ref(0);
 
function increment() {
  count.value++;
}
 
onMounted(() => {
  console.log(`The initial count is ${count.value}.`);
})
</script>
```

### vue和react

相似之处：

-   都将注意力集中保持在核心库，而将其他功能如路由和全局状态管理交给相关的库
-   都有自己的构建工具，能让你得到一个根据最佳实践设置的项目模板。
-   都使用了Virtual DOM（虚拟DOM）提高重绘性能
-   都有props的概念，允许组件间的数据传递
-   都鼓励组件化应用，将应用分拆成一个个功能明确的模块，提高复用性

**不同之处：**

**1）数据流**

Vue默认支持数据双向绑定，而React一直提倡单向数据流

**2）虚拟DOM**

Vue2.x开始引入"Virtual DOM"，消除了和React在这方面的差异，但是在具体的细节还是有各自的特点。

-   Vue宣称可以更快地计算出Virtual DOM的差异，这是由于它在渲染过程中，会跟踪每一个组件的依赖关系，不需要重新渲染整个组件树。
-   对于React而言，每当应用的状态被改变时，全部子组件都会重新渲染。当然，这可以通过 PureComponent/shouldComponentUpdate这个生命周期方法来进行控制，但Vue将此视为默认的优化。

**3）组件化**

React与Vue最大的不同是模板的编写。

-   Vue鼓励写近似常规HTML的模板。写起来很接近标准 HTML元素，只是多了一些属性。
-   React推荐你所有的模板通用JavaScript的语法扩展——JSX书写。

具体来讲：React中render函数是支持闭包特性的，所以我们import的组件在render中可以直接调用。但是在Vue中，由于模板中使用的数据都必须挂在 this 上进行一次中转，所以 import 完组件之后，还需要在 components 中再声明下。

**4）监听数据变化的实现原理不同**

-   Vue 通过 getter/setter 以及一些函数的劫持，能精确知道数据变化，不需要特别的优化就能达到很好的性能
-   React 默认是通过比较引用的方式进行的，如果不优化（PureComponent/shouldComponentUpdate）可能导致大量不必要的vDOM的重新渲染。这是因为 Vue 使用的是可变数据，而React更强调数据的不可变。

**5）高阶组件**

react可以通过高阶组件（Higher Order Components-- HOC）来扩展，而vue需要通过mixins来扩展。

原因高阶组件就是高阶函数，而React的组件本身就是纯粹的函数，所以高阶函数对React来说易如反掌。相反Vue.js使用HTML模板创建视图组件，这时模板无法有效的编译，因此Vue不采用HOC来实现。

**6）构建工具**

两者都有自己的构建工具

-   React ==> Create React APP
-   Vue ==> vue-cli

**7）跨平台**

-   React ==> React Native
-   Vue ==> Weex





相同点:

- 核心库都只关注ui层面的问题解决，路由/状态管理都由其他库处理。

- 都使用了虚拟dom来提高重渲染效率。

- 都采用了组件化思想，将应用中不同功能抽象成一个组件，提高了代码复用性。

- 都能进行跨平台，react使用react native，vue使用weex

- 都有自己的构建工具:

  vue: vue-cli

  react: create-react-app

不同点:

- 最大的不同是组件的编写方式

  vue推荐使用类似于常规html模板的方式来编写组件, 基于vue强大的指令系统来进行数据的绑定和添加事件监听。在vue中，一个组件就是一个.vue文件。

  而react中采用jsx语法，每一个jsx表达式都是一个react元素. 在react中，一个组件本质就是一个函数或者一个类。

- 虚拟dom渲染效率方面

  由于vue对数据进行了劫持，因此每一个响应式数据都能进行依赖跟踪。当组件重新渲染时，不必重新渲染它的整个子组件树，而是只渲染应该重渲染的子组件。

  在react中，一旦组件状态变化导致重渲染后，其整个子组件树都会默认重新渲染。可以通过pureComponent或者shouldComponentUpdate来进行优化。

- 响应式方面

  vue由于使用defineProperty或者proxy, 能对数据进行劫持。因此只要修改了响应式数据本身就能导致组件的重渲染。

  而在react中，并没有对数据本身进行劫持，需要手动调用setState才能触发组件的重渲染。并且react强调使用不可变数据，即每次更改状态时，新状态的引用必须和旧状态不同。如果说没有使用不可变数据并且又在组件内使用了pureComponent或者shouldComponentUpdate进行优化，可能会导致状态变化组件没有重新渲染。

- 高阶组件

  react中存在HOC(高阶组件)的概念，因为react中的每一个组件本质都是一个函数或者类，都是编写在js代码中。因此可以轻松的实现高阶组件来对组件进行扩展。而vue采用模板编译的方式编写组件，无法使用HOC, 通常通过mixin来扩展组件.

- 指令系统

  vue有一套强大的指令系统并且支持自定义指令来封装一些功能。

  react则更偏向底层，使用javascript原生代码进行封装功能。

### vue3的composition api 和 react hook的区别？

react:

 由于react没有实现真正的数据双向绑定即没有对数据进行劫持，react是依靠hook的调用顺序来知道重渲染时，本次的state对应于哪一个useState hook。因此在react中使用hook有如下要求:

-   不能在循环/判断/嵌套函数内使用hook 
-   总是确保hook出现在函数组件的最顶部 
-   对于一些hook如useEffect, useMemo, useCallBack, 必须手动注册依赖项。 

而在vue中, 基于vue的响应式系统，composiiton api在调用时可以不用考虑顺序并且能使用在判断/循环/内部函数中。并且由于vue的响应式数据会自动收集依赖，因此使用一些composiiton api如computed以及watchEffect时无需手动注册依赖。

后面基本是一些小的问题比如:

> 从React Hook的实现角度看，React Hook是根据useState调用的顺序来确定下一次重渲染时的state是来源于哪个useState，所以出现了以下限制

- 不能在循环、条件、嵌套函数中调用Hook
- 必须确保总是在你的React函数的顶层调用Hook
- `useEffect、useMemo`等函数必须手动确定依赖关系

> 而Composition API是基于Vue的响应式系统实现的，与React Hook的相比

- 声明在`setup`函数内，一次组件实例化只调用一次`setup`，而React Hook每次重渲染都需要调用Hook，使得React的GC比Vue更有压力，性能也相对于Vue来说也较慢
- `Compositon API`的调用不需要顾虑调用顺序，也可以在循环、条件、嵌套函数中使用
- 响应式系统自动实现了依赖收集，进而组件的部分的性能优化由Vue内部自己完成，而`React Hook`需要手动传入依赖，而且必须必须保证依赖的顺序，让`useEffect`、`useMemo`等函数正确的捕获依赖变量，否则会由于依赖不正确使得组件性能下降。

> 虽然`Compositon API`看起来比`React Hook`好用，但是其设计思想也是借鉴`React Hook`的

## Demo实现

### 1.实现一个modal框

```js
<template>
  <div class="container">
    <transition name="modal-fade">
      <div class="modal-container" v-show="visible" :style="{ width: width }">
        <!-- 头部标题 -->
        <div class="modal-header">
          <div class="modal-title">{{ title }}</div>
          <i class="iconfont close-icon" @click="close">&#xe7fc;</i>
        </div>
        <!-- 内容区域 -->
        <div class="modal-content">
          <slot></slot>
        </div>
        <!-- 底部按钮 -->
        <div class="modal-footer" v-show="showOperation">
          <div class="modal-btn">
            <button class="cancel" ref="cancelBtn" @click="close" @mousedown="cancelMouseDown" @mouseup="cancelMouseUp">取消</button>
            <button class="ok" @click="ok">确认</button>
          </div>
        </div>
      </div>
    </transition>
    <!-- 遮罩层 -->
    <div class="mask" v-show="visible" @click="close"></div>
  </div>
</template>
 
<script>
export default {
  data() {
    return {}
  },
  props: {
    // 模态框标题
    title: {
      type: String,
      default: () => {
        return '模态框标题'
      },
    },
    // 显示隐藏控件
    visible: {
      type: Boolean,
      default: () => {
        return false
      },
    },
    // 隐藏底部区域
    showOperation: {
      type: Boolean,
      dafault: () => {
        return true
      },
    },
    // 宽度
    width: {
      type: String,
      default: '250px',
    },
  },
  methods: {
    // 取消
    close() {
      this.$emit('cancel')
      this.$emit('update:visible', false)
    },
    // 确认
    ok() {
      this.$emit('submit')
      this.$emit('update:visible', false)
    },
    // 取消按钮 鼠标按下事件
    cancelMouseDown() {
      this.$refs.cancelBtn.style.color = '#096dd9'
      this.$refs.cancelBtn.style.border = '1px solid #096dd9'
    },
    // 取消按钮 鼠标松开事件
    cancelMouseUp() {
      this.$refs.cancelBtn.style.color = '#595959'
      this.$refs.cancelBtn.style.border = '1px solid #d9d9d9'
    },
  },
  watch: {
    // 操作遮罩层的展示/隐藏
    visible() {
      if (this.visible == true) {
        document.querySelector('body').setAttribute('style', 'overflow:hidden !important;')
      } else {
        document.querySelector('body').removeAttribute('style')
      }
    },
  },
}
</script>
 
<style scoped>
.modal-container {
  z-index: 999;
  background-color: #fff;
  min-width: 250px;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: none;
  border-radius: 4px;
  transition: 0.5s;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.modal-header {
  width: 100%;
  height: 50px;
  border: none;
  border-bottom: 1px solid #e8e8e8;
  padding: 20px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.modal-title {
  color: #262626;
  font-weight: 600;
  font-size: 17px;
}
.close-icon {
  color: #4d4d4d;
  cursor: pointer;
  width: 80px;
  text-align: right;
}
.modal-content {
  width: 100%;
  min-height: 100px;
  border: none;
  border-radius: none;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.modal-footer {
  width: 100%;
  height: 60px;
  border: none;
  border-top: 1px solid #e8e8e8;
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.modal-btn {
  width: 150px;
  display: flex;
  justify-content: space-between;
}
.cancel {
  border: 1px solid #d9d9d9;
  background-color: #fff;
  color: #595959;
  width: 70px;
  height: 32px;
  border-radius: 4px;
  font-size: 14px;
  transition: 0.5s;
}
.cancel :hover {
  border: 1px solid #40a9ff;
  color: #40a9ff;
}
.ok {
  border: 1px solid #1890ff;
  background-color: #1890ff;
  color: #ffffff;
  width: 70px;
  height: 32px;
  border-radius: 4px;
  font-size: 14px;
  transition: 0.5s;
}
.ok :hover {
  border: 1px solid #40a9ff;
  background-color: #40a9ff;
}
.mask {
  z-index: 998;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}
.modal-fade-enter-active {
  transition: all 0.3s ease;
}
.modal-fade-leave-active {
  transition: all 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  transform: translateX(-400px);
  opacity: 0;
}
</style>
```



### 2.实现一个Confirm框

```vue
<template>
		<div class="content-pop" v-if="bool_show">
			<div class="result" v-html="content"></div>
			<div class="bottom">
				<div class="cancel" @click="cancel">取消</div>
				<div class="confirm" @click="confirm">确定</div>
			</div>
		</div>
</template>
 
<script>
export default {
	name: 'msgConfirmPro',
	data() {
		return {
			bool_show: false,
			content: '',
			cancelBack:undefined,
			confirmBack:undefined,
		}
	},
	methods: {
		// 打开弹窗
		show(content,confirm,cancel) {
			if(confirm){
				this.confirmBack = confirm;
			}
			if(cancel){
				this.cancelBack = cancel;
			}
			this.content = content;
			this.bool_show = true;
		},
		cancel() {
			this.bool_show = false;
			if(this.cancelBack){
			this.cancelBack();	
			}
			
		},
		confirm() {
			this.bool_show = false;
			if(this.confirmBack){
				this.confirmBack();
			}
			
		}
	}
};
</script>
 
<style scoped="">
.content-pop {
    width: 250px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    /* padding: 0.04rem 0 0 0; */
    box-sizing: border-box;
	background: #ffffff;
	    height: 149px;
	    border-radius: 24px;
}
 
.result {
overflow: auto;
    padding: 20px 30px;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    /* bottom: 87px; */
    font-size: 16px;
    position: absolute;
    text-align: center;
    color: #333;
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
}
.content-pop .bottom {
font-size: 16px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #f5f5f5;
}
 
.content-pop .bottom .cancel {
color: #666666;
    width: 50%;
    height: 100%;
    line-height: 48px;
    text-align: center;
    border-right: 01px solid #f5f5f5;
}
 
.content-pop .bottom .confirm {
    color: #2283e2;
    width: 50%;
    height: 100%;
    text-align: center;
    line-height: 48px;
}
 
.content-pop .title {
	box-sizing: border-box;
	padding: 40px 0;
	width: 100%;
	margin: 0 auto;
	text-align: center;
	color: #333;
	border-bottom: 0.003rem solid #f5f5f5;
}
</style>
```

使用

```vue
<template>
  <div id="app" style="background-color: #ff0000;height: 100vh;">
    
	<div @click="show()">点击出现弹窗</div>
	
	<ylConfirm ref="MSGCONFIRMPRO"></ylConfirm>
	
  </div>
</template>
 
<script>
import HelloWorld from './components/HelloWorld.vue'
import ylConfirm from './components/yl-confirm.vue'
 
export default {
  name: 'app',
  components: {
    HelloWorld,ylConfirm
  },methods:{
	  show() {
		  this.$refs.MSGCONFIRMPRO.show('我是弹窗里面的内容，我可以随便定义哦',
		  () => {
		  	// 确定的回调
			alert("点击了确认");
		  },
		  () => {
			  // 取消的回调
		  	alert("点击了取消");
		  })
	  }
	  
  }
}
</script>
 
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```



### 3.实现一个通用alert组件

[vue封装通用的通知组件alert](https://juejin.cn/post/6844904081085956109)

### 4.封装通用table组件

 [Vue封装通用table组件](https://juejin.cn/post/6990593017874743310)

```vue
<!-- src/components/table-slot/table.vue -->
<template>
  <table>
    <thead>
      <tr>
        <th v-for="col in columns">{{ col.title }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in data">
        <td v-for="col in columns">
          <template v-if="'render' in col">
            <Render :row="row" :column="col" :index="rowIndex" :render="col.render"></Render>
          </template>
          <template v-else-if="'slot' in col">
            <slot :row="row" :column="col" :index="rowIndex" :name="col.slot"></slot>
          </template>
          <template v-else>{{ row[col.key] }}</template>
        </td>
      </tr>
    </tbody>
  </table>
</template>
```

示例中在 `<table-slot>` 内的每一个 `<template>` 就对应某一列的 slot-scope 模板，通过配置的 `slot` 字段，指定具名的 slot-scope。可以看到，基本是把 Render 函数还原成了 html 的写法，这样看起来直接多了，渲染效果是完全一样的。在 slot-scope 中，平时怎么写组件，这里就怎么写，Vue.js 所有的 API 都是可以直接使用的。

````vue
<!-- src/views/table-slot.vue -->
<template>
  <div>
    <table-slot :columns="columns" :data="data">
      <template slot-scope="{ row, index }" slot="name">
        <input type="text" v-model="editName" v-if="editIndex === index" />
        <span v-else>{{ row.name }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="age">
        <input type="text" v-model="editAge" v-if="editIndex === index" />
        <span v-else>{{ row.age }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="birthday">
        <input type="text" v-model="editBirthday" v-if="editIndex === index" />
        <span v-else>{{ getBirthday(row.birthday) }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="address">
        <input type="text" v-model="editAddress" v-if="editIndex === index" />
        <span v-else>{{ row.address }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="action">
        <div v-if="editIndex === index">
          <button @click="handleSave(index)">保存</button>
          <button @click="editIndex = -1">取消</button>
        </div>
        <div v-else>
          <button @click="handleEdit(row, index)">操作</button>
        </div>
      </template>
    </table-slot>
  </div>
</template>
<script>
  import TableSlot from '../components/table-slot/table.vue';

  export default {
    components: { TableSlot },
    data () {
      return {
        columns: [
          {
            title: '姓名',
            slot: 'name'
          },
          {
            title: '年龄',
            slot: 'age'
          },
          {
            title: '出生日期',
            slot: 'birthday'
          },
          {
            title: '地址',
            slot: 'address'
          },
          {
            title: '操作',
            slot: 'action'
          }
        ],
        data: [
          {
            name: '王小明',
            age: 18,
            birthday: '919526400000',
            address: '北京市朝阳区芍药居'
          },
          {
            name: '张小刚',
            age: 25,
            birthday: '696096000000',
            address: '北京市海淀区西二旗'
          },
          {
            name: '李小红',
            age: 30,
            birthday: '563472000000',
            address: '上海市浦东新区世纪大道'
          },
          {
            name: '周小伟',
            age: 26,
            birthday: '687024000000',
            address: '深圳市南山区深南大道'
          }
        ],
        editIndex: -1,  // 当前聚焦的输入框的行数
        editName: '',  // 第一列输入框，当然聚焦的输入框的输入内容，与 data 分离避免重构的闪烁
        editAge: '',  // 第二列输入框
        editBirthday: '',  // 第三列输入框
        editAddress: '',  // 第四列输入框
      }
    },
    methods: {
      handleEdit (row, index) {
        this.editName = row.name;
        this.editAge = row.age;
        this.editAddress = row.address;
        this.editBirthday = row.birthday;
        this.editIndex = index;
      },
      handleSave (index) {
        this.data[index].name = this.editName;
        this.data[index].age = this.editAge;
        this.data[index].birthday = this.editBirthday;
        this.data[index].address = this.editAddress;
        this.editIndex = -1;
      },
      getBirthday (birthday) {
        const date = new Date(parseInt(birthday));
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return `${year}-${month}-${day}`;
      }
    }
  }
</script>
````



### 5.实现checkbox

```vue
<template>
  <div>
    <span>全选</span>
    <input type="checkbox" v-model="checkAll" />
    <div v-for="(item,index) in test" :key="index">
      <span>{{item.name}}</span>
	  <input type="checkbox" v-model="item.isSelected" />
    </div>
  </div>
</template>
<script>
  export default {
  data() {
    return {
      test: [
        { name: "测试1", isSelected: true },
        { name: "测试2", isSelected: true },
        { name: "测试3", isSelected: true },
        { name: "测试4", isSelected: true },
        { name: "测试5", isSelected: true }
      ]
    };
  },
  computed: {
    checkAll: {
      get() {
        // 返回什么结果接赋予给 checkAll 属性
        return this.test.every(item => item.isSelected);
      },
      set(val) {
        // val 是给 checkAll 赋予值的时候传递过来的
        return this.test.forEach(item => (item.isSelected = val));
      }
    }
  }
}
</script>
```

### 6.实现内容绑定

```js
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<script src="js/vue.js" type="text/javascript" charset="utf-8"></script>
	</head>
	<body>
		<div id="app">
			<h2>{{username}}</h2>
			<h1>单行文本输入框</h1>
			<input type="text" name="username" v-model.lazy.trim="username" value="" />
			<h1>多行文本输入框</h1>
			<textarea rows="" cols="" v-model="username"></textarea>
			
			<h1>复选框:选择喜欢的水果</h1>
			<span v-for="item in fruits">
				{{item}}
				<input  type="checkbox" name="fruit" v-model="checkFruits" :value="item" />
			</span>
			<h2>{{checkFruits}}</h2>
			
			
			<h1>单选框:选择最喜欢的水果</h1>
			<span v-for="item in fruits">
				{{item}}
				<input  type="radio" name="zfruit" v-model="radioFruits" :value="item" />
			</span>
			<h2>{{radioFruits}}</h2>
			
			
			<h1>选项框：选择你居住的城市</h1>
			<select v-model="chooseCity">
				<option disabled value="">请选择</option>
				<option v-for="item in citys" :value="item">{{item}}</option>
			</select>
			<h3>{{chooseCity}}</h3>
			
			
			<h1>选项框：选择你喜欢的城市</h1>
			<select v-model="moreCity" multiple="multiple">
				<option v-for="item in citys" :value="item">{{item}}</option>
			</select>
			<h3>{{moreCity}}</h3>
			
			<h1>将字符串变为数字获取</h1>
			<input type="text" name="age" v-model.number="age" value="" />
			
		</div>
		
		<script type="text/javascript">
			let app = new Vue({
				el:"#app",
				data:{
					username:"小明",
					fruits:['苹果','雪梨',"香蕉","葡萄"],
					checkFruits:[],
					radioFruits:"",
					citys:['北京',"上海","深圳","广州"],
					chooseCity:"",
					moreCity:[],
					age:16
				},
				watch:{
					age:function(val){
						console.log(val)
					}
				}
			})
		</script>
	</body>
</html>

```

### 7.实现todolist

```vue
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
		<link rel="stylesheet" type="text/css" href="css/style.css"/>
		<link rel="stylesheet" type="text/css" href="css/animate.min.css"/>
		<script src="js/lcXys.js" type="text/javascript" charset="utf-8"></script>
		<script src="js/vue.js" type="text/javascript" charset="utf-8"></script>
		
	</head>
	<body>
		<div id="app">
			<div class="main">
				<div class="header">
					<div class="logo">LcTodo</div>
					<!-- 绑定回车事件,v-model绑定输入框的value值 -->
					<input type="text" v-model="inputValue" id="input" @keydown.enter="enterEvent" placeholder="请输入待办事项" />
				</div>
				<div class="doing todo">
					<h3><span class="title">正在进行</span><span class="num">0</span></h3>
					<div class="list">
						<transition-group name="slide" mode="out-in" enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
						<div class="todoItem" v-for="item,index in doingList" :key="'doing'+index">
							<input @click.prevent="checkDone(item.id)" :data-id="item.id" type="checkbox">
							<div class="content">{{item.content}}</div>
							<div class="del" @click="deleteItem(item.id)">删除</div>
						</div>
						</transition-group>
					</div>
				</div>
				<div class="done todo">
					<h3><span class="title">正在进行</span><span class="num">0</span></h3>
					<div class="list">
						<transition-group name="slide" enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
						<div class="todoItem" v-for="item,index in doneList" :key="'done'+index">
							<input @click.prevent="checkDone(item.id)" :data-id="item.id" type="checkbox" checked="checked">
							<div class="content">{{item.content}}</div>
							<div class="del" @click="deleteItem(item.id)">删除</div>
						</div>
						</transition-group>
					</div>
				</div>
			</div>
		</div>
		<script type="text/javascript">
			var app = new Vue({
				el:"#app",
				data:{
					todoList:[],
					inputValue:""
				},
				computed:{
					//通过过滤todolist数据，得到未做好的列表和已做好的列表
					doingList:function(){
						let arr = this.todoList.filter(function(item,index){
							return !item.isDone
						})
						return arr;
					},
					doneList:function(){
						let arr = this.todoList.filter(function(item,index){
							return item.isDone
						})
						return arr;
					}
				},
				methods:{
					enterEvent:function(event){
						//将数据添加至todolist
						this.todoList.push({
							content:this.inputValue,
							isDone:false,
							id:this.todoList.length
						})
						//保存
						this.saveData()
						//清除输入框的值
						this.inputValue = "";
					},
					// 将数据保存到本地存储
					saveData:function(){
						localStorage.todoList = JSON.stringify(this.todoList)
					},
					checkDone:function(id){
						//console.log(id)
						this.todoList[id].isDone = !this.todoList[id].isDone;
						//每次修改都必须保存
						this.saveData()
					},
					deleteItem:function(id){
						this.todoList.splice(id,1)
						this.todoList.forEach(function(item,i){
							item.id = i;
						})
						this.saveData()
					}
					
					
				},
				mounted:function(){
					this.todoList = localStorage.todoList?JSON.parse(localStorage.todoList):[];
				}
			})
		</script>
	</body>
</html>
```

css

```css
*{
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

body{
	background-color: #efefef;
	font-size: 16px;
}
#app{
	width: 3.75rem;
}
.main{
	width: 3.75rem;
	/* height: 10vh; */
}

.header{
	width: 3.75rem;
	height: 0.5rem;
	background: deepskyblue;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.header>.logo{
	width: 1.2rem;
	height: 0.5rem;
	text-align: center;
	line-height: 0.5rem;
	font-size: 0.25rem;
	font-weight: 900;
}
.header>input{
	width: 2.2rem;
	height: 0.3rem;
	margin: 0 0.2rem;
	border-radius: 0.05rem;
	border: none;
	outline: none;
	padding: 0 0.1rem;
}

.todo h3{
	height: 0.6rem;
	line-height: 0.6rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0  0.15rem;
}

.todo .list{
	padding: 0 0.15rem;
}
.todo .todoItem{
	display: flex;
	height: 0.38rem;
	line-height: 0.38rem;
	align-items: center;
	background: lightcyan;
	border-radius: 0.05rem;
	overflow: hidden;
	margin-bottom: 0.1rem;
}
.todo .todoItem:before{
	width: 0.04rem;
	height: 0.38rem;
	background: deepskyblue;
	content: "";
}
.todo .todoItem>input{
	width: 0.25rem;
	height: 0.25rem;
	margin: 0 0.1rem;
	
}
.todo .todoItem .content{
	width: 2.65rem;
	color:#333;
}
.todo .todoItem .del{
	background: orangered;
	width: 0.4rem;
	height: 0.2rem;
	font-size: 0.12rem;
	text-align: center;
	line-height: 0.2rem;
	border-radius: 0.05rem;
	margin: 0 0.1rem;
	color: #fff;
}

.done.todo .todoItem{
	opacity: 0.3;
	-webkit-filter:grayscale(1);
}

.pc{
	font-size: 200px !important;
	
}

.pc .main{
	margin:  0 auto;
}
```

