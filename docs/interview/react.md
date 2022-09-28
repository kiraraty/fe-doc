# react面试题

## 组件基础

### 1.React 事件机制

```javascript
<div onClick={this.handleClick.bind(this)}>点我</div>
```

React并不是将click事件绑定到了div的真实DOM上，而是在document处监听了所有的事件，当事件发生并且冒泡到document处的时候，React将**事件内容封装并交由真正的处理函数运行**。这样的方式不仅仅减少了**内存的消耗**，还能在组件挂载销毁时**统一订阅和移除事件**。

除此之外，冒泡到document上的事件也不是原生的浏览器事件，而是由react自己实现的合成事件（SyntheticEvent）。因此如果不想要是事件冒泡的话应该**调用event.preventDefault()方法**，而不是调用event.stopProppagation()方法。

![image-20220701085916823](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs4FsyP1ml5Tpgq8w.png)

实现合成事件的目的如下：

- 合成事件首先抹平了浏览器之间的兼容问题，另外这是一个跨浏览器原生事件包装器，赋予了跨浏览器开发的能力；
- 对于原生浏览器事件来说，浏览器会给监听器创建一个事件对象。如果你有很多的事件监听，那么就需要分配很多的事件对象，造成高额的内存分配问题。但是对于合成事件来说，有一个事件池专门来管理它们的创建和销毁，当事件需要被使用时，就会从池子中复用对象，事件回调结束后，就会销毁事件对象上的属性，从而便于下次复用事件对象。

### 2.React的事件和普通的HTML事件有什么不同？

区别：

- 对于事件名称命名方式，原生事件为全小写，react 事件采用小驼峰；
- 对于事件函数处理语法，原生事件为字符串，react 事件为函数；
- react 事件不能采用 return false 的方式来阻止浏览器的默认行为，而必须要地明确地调用`preventDefault()`来阻止默认行为。

合成事件是 react 模拟原生 DOM 事件所有能力的一个事件对象，其优点如下：

- 兼容所有浏览器，更好的跨平台；
- 将事件统一存放在一个数组，避免频繁的新增与删除（垃圾回收）。
- 方便 react 统一管理和事务机制。

事件的执行顺序为原生事件先执行，合成事件后执行，合成事件会冒泡绑定到 document 上，所以尽量避免原生事件与合成事件混用，如果原生事件阻止冒泡，可能会导致合成事件不执行，因为需要冒泡到document 上合成事件才会执行。

### 3.React.Component 和React.PureComponent 的区别

PureComponent表示一个纯组件，可以用来优化React程序，**减少render函数执行的次数，从而提高组件的性能**。

在React中，当prop或者state发生变化时，可以通过在**shouldComponentUpdate**生命周期函数中**执行return false**来阻止页面的更新，从而减少不必要的render执行。React.PureComponent会**自动执行** shouldComponentUpdate。

不过，pureComponent中的 shouldComponentUpdate() 进行的是**浅比较**，也就是说如果是引用数据类型的数据，**只会比较不是同一个地址**，**而不会比较这个地址里面的数据是否一致。浅比较会忽略属性和或状态突变情况，其实也就是数据引用指针没有变化，而数据发生改变的时候render是不会执行的。如果需要重新渲染那么就需要重新开辟空间引用数，PureComponent一般会用在一些纯展示组件上**。

使用pureComponent的**好处**：当组件更新时，如果组件的props或者state都没有改变，render函数就不会触发。省去虚拟DOM的生成和对比过程，达到提升性能的目的。这是因为react自动做了一层浅比较。

### 4.React 高阶组件(HOC)是什么，和普通组件有什么区别，适用什么场景

官方解释∶

> 高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧。HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式。

高阶组件（HOC）就是**一个函数，且该函数接受一个组件作为参数，并返回一个新的组件**，它只是一种组件的设计模式，这种设计模式是由react自身的组合性质必然产生的。我们将它们称为纯组件，因为它们可以**接受任何动态提供的子组件**，但它们不会修改或复制其输入组件中的任何行为。

```js
// hoc的定义
function withSubscription(WrappedComponent, selectData) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: selectData(DataSource, props)
      };
    }
    // 一些通用的逻辑处理
    render() {
      // ... 并使用新数据渲染被包装的组件!
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };

// 使用
const BlogPostWithSubscription = withSubscription(BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id));
```

**1）HOC的优缺点**

- 优点∶逻辑复用、不影响被包裹组件的内部逻辑。
- 缺点∶hoc传递给被包裹组件的props容易和被包裹后的组件重名，进而被覆盖

**2）适用场景**

- 代码复用，逻辑抽象
- 渲染劫持
- State 抽象和更改
- Props 更改

**3）具体应用例子**

- **权限控制：** 利用高阶组件的 **条件渲染** 特性可以对页面进行权限控制，权限控制一般分为两个维度：页面级别和 页面元素级别

```javascript
// HOC.js
function withAdminAuth(WrappedComponent) {
    return class extends React.Component {
        state = {
            isAdmin: false,
        }
        async UNSAFE_componentWillMount() {
            const currentRole = await getCurrentUserRole();
            this.setState({
                isAdmin: currentRole === 'Admin',
            });
        }
        render() {
            if (this.state.isAdmin) {
                return <WrappedComponent {...this.props} />;
            } else {
                return (<div>您没有权限查看该页面，请联系管理员！</div>);
            }
        }
    };
}

// pages/page-a.js
class PageA extends React.Component {
    constructor(props) {
        super(props);
        // something here...
    }
    UNSAFE_componentWillMount() {
        // fetching data
    }
    render() {
        // render page with data
    }
}
export default withAdminAuth(PageA);


// pages/page-b.js
class PageB extends React.Component {
    constructor(props) {
        super(props);
    // something here...
        }
    UNSAFE_componentWillMount() {
    // fetching data
    }
    render() {
    // render page with data
    }
}
export default withAdminAuth(PageB);
```

- **组件渲染性能追踪：** 借助父组件子组件生命周期规则捕获子组件的生命周期，可以方便的对某个组件的渲染时间进行记录∶

```javascript
class Home extends React.Component {
        render() {
            return (<h1>Hello World.</h1>);
        }
    }
    function withTiming(WrappedComponent) {
        return class extends WrappedComponent {
            constructor(props) {
                super(props);
                this.start = 0;
                this.end = 0;
            }
            UNSAFE_componentWillMount() {
                super.componentWillMount && super.componentWillMount();
                this.start = Date.now();
            }
            componentDidMount() {
                super.componentDidMount && super.componentDidMount();
                this.end = Date.now();
                console.log(`${WrappedComponent.name} 组件渲染时间为 ${this.end - this.start} ms`);
            }
            render() {
                return super.render();
            }
        };
    }

    export default withTiming(Home);   
```

注意：withTiming 是利用 反向继承 实现的一个高阶组件，功能是计算被包裹组件（这里是 Home 组件）的渲染时间。

- **页面复用**

```javascript
const withFetching = fetching => WrappedComponent => {
    return class extends React.Component {
        state = {
            data: [],
        }
        async UNSAFE_componentWillMount() {
            const data = await fetching();
            this.setState({
                data,
            });
        }
        render() {
            return <WrappedComponent data={this.state.data} {...this.props} />;
        }
    }
}

// pages/page-a.js
export default withFetching(fetching('science-fiction'))(MovieList);
// pages/page-b.js
export default withFetching(fetching('action'))(MovieList);
// pages/page-other.js
export default withFetching(fetching('some-other-type'))(MovieList);
```

### 5.对componentWillReceiveProps 的理解

该方法当`props`发生变化时执行，初始化`render`时不执行，在这个回调函数里面，你可以根据属性的变化，通过调用`this.setState()`来更新你的组件状态，旧的属性还是可以通过`this.props`来获取,这里调用更新状态是安全的，并不会触发额外的`render`调用。

**使用好处：** 在这个生命周期中，可以**在子组件的render函数执行前获取新的props，从而更新子组件自己的state**。 可以将数据请求放在这里进行执行，需要传的参数则从componentWillReceiveProps(nextProps)中获取。而**不必将所有的请求都放在父组件中。于是该请求只会在该组件渲染时才会发出，从而减轻请求负担**。

componentWillReceiveProps在初始化render的时候不会执行，它会在Component**接受到新的状态(Props)时被触发**，一般用于**父组件状态更新时子组件的重新渲染**。

### 6.哪些方法会触发 React 重新渲染？重新渲染 render 会做些什么？

#### 哪些方法会触发 react 重新渲染?

- **setState（）方法被调用**

setState 是 React 中最常用的命令，通常情况下，执行 setState 会触发 render。但是这里有个点值得关注，执行 setState 的时候不一定会重新渲染。当 setState 传入 null 时，并不会触发 render。

```react
class App extends React.Component {
  state = {
    a: 1
  };

  render() {
    console.log("render");
    return (
      <React.Fragement>
        <p>{this.state.a}</p>
        <button
          onClick={() => {
            this.setState({ a: 1 }); // 这里并没有改变 a 的值
          }}
        >
          Click me
        </button>
        <button onClick={() => this.setState(null)}>setState null</button>
        <Child />
      </React.Fragement>
    );
  }
}
```

- **父组件重新渲染**

只要父组件重新渲染了，即使传入子组件的 props 未发生变化，那么子组件也会重新渲染，进而触发 render

父组件数据变化，子组件数据更新方法：

**利用componentWillReceiveProps方法**

```javascript
componentWillReceiveProps(nextProps){
  this.setState({
    isLogin: nextProps.isLogin,
    userInfo: nextProps.userInfo,
  });
   }
```

**子组件数据变化，通知父组件**

```javascript
  // 父组件：
  <FromCom demo={this.demo} />
  //子组件：利用setState的回调函数
  this.setState({}, () => {
      this.props.demo(userInfo);
    });
```

#### **重新渲染 render 会做些什么?**

- 会对新旧 VNode 进行对比，也就是我们所说的Diff算法。
- 对新旧两棵树进行一个深度优先遍历，这样每一个节点都会一个标记，在到深度遍历的时候，每遍历到一和个节点，就把该节点和新的节点树进行对比，如果有差异就放到一个对象里面
- 遍历差异对象，根据差异的类型，根据对应对规则更新VNode

React 的处理 render 的基本思维模式是每次一有变动就会去重新渲染整个应用。在 Virtual DOM 没有出现之前，最简单的方法就是直接调用 innerHTML。Virtual DOM厉害的地方并不是说它比直接操作 DOM 快，而是说不管数据怎么变，都会尽量以最小的代价去更新 DOM。React 将 render 函数返回的虚拟 DOM 树与老的进行比较，从而确定 DOM 要不要更新、怎么更新。当 DOM 树很大时，遍历两棵树进行各种比对还是相当耗性能的，特别是在顶层 setState 一个微小的修改，默认会去遍历整棵树。尽管 React 使用高度优化的 Diff 算法，但是这个过程仍然会损耗性能.

#### **判断什么时候重新渲染组件**

组件状态的改变可以因为`props`的改变，或者直接通过`setState`方法改变。组件获得新的状态，然后React决定是否应该重新渲染组件。只要组件的state发生变化，React就会对组件进行重新渲染。这是因为React中的`shouldComponentUpdate`方法默认返回`true`，这就是导致每次更新都重新渲染的原因。

当React将要渲染组件时会执行`shouldComponentUpdate`方法来看它是否返回`true`（组件应该更新，也就是重新渲染）。所以需要重写`shouldComponentUpdate`方法让它根据情况返回`true`或者`false`来告诉React什么时候重新渲染什么时候跳过重新渲染。





### 7.React如何跳过子组件更新，减少不必要的render

#### 什么是shouldComponent？

1. React中的一个生命周期，
2. 运行时机：在getDerivedStateFromProps之后，render之前执行
3. 触发条件：
    a. props更新
    b. setState

forceUpdate不会导致shouldComponentUpdate的触发

1. 作用，如果返回true，那组件就继续render；如果返回false，组件就不更新渲染

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/8ea77210ba975bb7f632729af039755a.png)

#### 什么是pureComponent

1. React的一种组件类；
2. 与React.Component很相似。两者的区别在于React.Component中，并没有实现shouldComponentUpdate,需要继承类自己实现。而React.PureComponent中，会浅层对比prop和state，如果内容相同，那么组件将会跳过此次的render更新；
3. React.PureComponent 中的 shouldComponentUpdate() 将跳过所有子组件树的 prop 更新。因此，请确保所有子组件也都是“纯”的组件。

> 纯组件的含义，就是传入相同的props对象，总会有相同的渲染内容。
>
> 类似于**纯函数**的定义

4.判断步骤：
如果 PureComponent 里有 shouldComponentUpdate 函数的话，直接使用 shouldComponentUpdate 的结果作为是否更新的依据。

没有 shouldComponentUpdate 函数的话，才会去判断是不是 PureComponent ，是的话再去做 **shallowEqual** 浅比较。

```js
 const instance = workInProgress.stateNode;
// 如果实利实现了shouldComponentUpdate则返回调用它的结果
if (typeof instance.shouldComponentUpdate === 'function') {
    const shouldUpdate = instance.shouldComponentUpdate(
        newProps,
        newState,
        nextContext,
    );
    return shouldUpdate;
}

// PureReactComponent的时候进行浅对比
if (ctor.prototype && ctor.prototype.isPureReactComponent) {
    return (
        !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
    );
  } 
```

> 从上面的代码就可以看出，pureComponent不是实现了shouldComponentUpdate的[Component](https://so.csdn.net/so/search?q=Component&spm=1001.2101.3001.7020)，而是在对比的时候就返回浅对比的结果。

PureComponent不可滥用，他使用在class组件内，只有那些状态和属性不经常的更新的组件我们用来做优化，对于经常更新的，这样处理后反而浪费性能，因为每一次浅比较也是要消耗时间的

##### 什么是shallowEqual浅比较

[浅谈React 中的浅比较是如何工作的](https://link.juejin.cn/?target=https%3A%2F%2Fwww.yht7.com%2Fnews%2F186392)

- 浅比较的对象，是新旧两个props、新旧两个state

```js
// PureReactComponent的时候进行浅对比
  if (ctor.prototype && ctor.prototype.isPureReactComponent) {
    return (
      !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
    );
  } 
```

- 先判断两个对象是否地址相同。如果地址相同，就直接返回true；如果地址不相同，就继续判断

网上很多文章把第一步的意义判定为，基本类型的相等性判断

- 再判断有没有不是对象的值，或者等于null的值。如果有，直接返回false；如果没有，就继续判断

> 只有这一步通过了，下面的判断才有了意义
>
> 如果把第一步判定为，基本类型的判断，那第二步又如何解释呢？
>
> 话又说回来了，传进来的props或者state一定是对像啊。如果传进来的是非对象，又是怎么做到的呢？

- 再判断两个props的key数量，是否相同，如果相同就继续下一步的判断；如果不相同，就直接返回false
- 最后一步，分别判断每个key对应的value值，是否相同。判断value是否相同，使用的是object.is()

##### shallowEqual的源码

```js
// shallowEqual.js
function shallowEqual(objA: mixed, objB: mixed): boolean {
    // 一样的对象返回true
    if (Object.is(objA, objB)) {
        return true;
    }
    
    // 不是对象或者为null返回false
    if (
        typeof objA !== 'object' || objA === null ||
        typeof objB !== 'object' || objB === null
    ) {
        return false;
    }
    
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    
    // key数量不同返回false
    if (keysA.length !== keysB.length) {
        return false;
    }
    
    // 对应key的值不相同返回false
    for (let i = 0; i < keysA.length; i++) {
        if (
            !hasOwnProperty.call(objB, keysA[i]) ||
            !Object.is(objA[keysA[i]], objB[keysA[i]])
        ) {
            return false;
        }
    }
    
    return true;
} 
```

#### 什么是React.memo

```js
const MyComponent = React.memo(function MyComponent(props) {
  /* 使用 props 渲染 */
},areEqual); 
```

1. React.memo是高阶组件，
2. 包裹其中的组件，并返回新的组件。该组件在props没有变更的时候，就会返回相同的渲染结果，也就是直接跳过渲染阶段。该阶段及其之后的阶段的生命周期函数就不会得到调用。当然，进行的也是浅比较
3. 用法：
    1. 第一个参数,是函数组件（ React.FunctionComponent)
    2. 第二个参数，回调函数。如果我们觉得浅比较不行，我们就填入第二个参数，React会把第二个参数的返回值，当作是否跳过更新的标准

```js
function areEqual(prevProps, nextProps) {
  /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，
  否则返回 false
  */
} 
```

1. 与 class 组件中 shouldComponentUpdate() 方法不同的是，如果 props 相等，areEqual 会返回 true；如果 props 不相等，则返回 false。这与 shouldComponentUpdate 方法的返回值相反

#### 总结

React 基于虚拟 DOM 和高效 Diff 算法的完美配合，实现了对 DOM 最小粒度的更新。大多数情况下，React 对 DOM 的渲染效率足以业务日常。但在个别复杂业务场景下，性能问题依然会困扰我们。此时需要采取一些措施来提升运行性能，其很重要的一个方向，就是避免不必要的渲染（Render）。这里提下优化的点：

-   **shouldComponentUpdate 和 PureComponent**

在 React 类组件中，可以利用 shouldComponentUpdate或者 PureComponent 来减少因父组件更新而触发子组件的 render，从而达到目的。shouldComponentUpdate 来决定是否组件是否重新渲染，如果不希望组件重新渲染，返回 false 即可。

-   **利用高阶组件**

在函数组件中，并没有 shouldComponentUpdate 这个生命周期，可以利用高阶组件，封装一个类似 PureComponet 的功能

-   **使用 React.memo**

React.memo 是 React 16.6 新的一个 API，用来缓存组件的渲染，避免不必要的更新，其实也是一个高阶组件，与 PureComponent 十分类似，但不同的是， **React.memo只能用于函数组件**。

### 8.React声明组件有哪几种方法，有什么不同

#### React 声明组件的三种方式：

-   函数式定义的`无状态组件`
-   ES5原生方式`React.createClass`定义的组件
-   ES6形式的`extends React.Component`定义的组件

（1）**无状态函数式组件** 

它是为了创建纯展示组件，这种组件只负责根据传入的props来展示，不涉及到state状态的操作 组件不会被实例化，整体渲染性能得到提升，不能访问this对象，不能访问生命周期的方法

**（2）ES5 原生方式 React.createClass // RFC** 

React.createClass会自绑定函数方法，导致不必要的性能开销，增加代码过时的可能性。

**（3）E6继承形式 React.Component // RCC** 

目前极为推荐的创建有状态组件的方式，最终会取代React.createClass形式；相对于 React.createClass可以更好实现代码复用。

**无状态组件相对于于后者的区别：** 与无状态组件相比，React.createClass和React.Component都是创建**有状态**的组件，这些组件是要被实例化的，并且可以访问组件的**生命周期**方法。

#### **React.createClass与React.Component区别：**

**① 函数this自绑定**

-   React.createClass创建的组件，其每一个成员函数的this都有React自动绑定，函数中的this会被正确设置。
-   React.Component创建的组件，其成员函数**不会自动绑定this**，需要开发者手动绑定，否则this不能获取当前组件实例对象。

**② 组件属性类型propTypes及其默认props属性defaultProps配置不同**

-   React.createClass在创建组件时，有关组件props的属性类型及组件默认的属性会作为组件实例的属性来配置，其中defaultProps是使用getDefaultProps的方法来获取默认组件属性的
-   React.Component在创建组件时配置这两个对应信息时，他们是作为组件类的属性，不是组件实例的属性，也就是所谓的类的静态属性来配置的。

**③ 组件初始状态state的配置不同**

-   React.createClass创建的组件，其状态state是通过getInitialState方法来配置组件相关的状态；
-   React.Component创建的组件，其状态state是在constructor中像初始化组件属性一样声明的。

### 9.有状态组件和无状态组件的理解及使用场景

（1）**有状态组件**

**特点：**

-   是类组件
-   有继承
-   可以使用this
-   可以使用react的生命周期
-   使用较多，容易频繁触发生命周期钩子函数，影响性能
-   内部使用 state，维护自身状态的变化，有状态组件根据外部组件传入的 props 和自身的 state进行渲染。

**使用场景：**

-   需要使用到状态的。
-   需要使用状态操作组件的（无状态组件的也可以实现新版本react hooks也可实现）

**总结：** 类组件可以维护自身的状态变量，即组件的 state ，类组件还有不同的生命周期方法，可以让开发者能够在组件的不同阶段（挂载、更新、卸载），对组件做更多的控制。类组件则既可以充当无状态组件，也可以充当有状态组件。当一个类组件不需要管理自身状态时，也可称为无状态组件。

2）**无状态组件** **特点：**

-   不依赖自身的状态state
-   可以是类组件或者函数组件。
-   可以完全避免使用 this 关键字。（由于使用的是箭头函数事件无需绑定）
-   有更高的性能。当不需要使用生命周期钩子时，应该首先使用无状态函数组件
-   组件内部不维护 state ，只根据外部组件传入的 props 进行渲染的组件，当 props 改变时，组件重新渲染。

**使用场景：**

-   组件不需要管理 state，纯展示

**优点：**

-   简化代码、专注于 render
-   组件不需要被实例化，无生命周期，提升性能。 输出（渲染）只取决于输入（属性），无副作用
-   视图和数据的解耦分离

**缺点：**

-   无法使用 ref
-   无生命周期方法
-   无法控制组件的重渲染，因为无法使用shouldComponentUpdate 方法，当组件接受到新的属性时则会重渲染

**总结：** 组件内部状态且与外部无关的组件，可以考虑用状态组件，这样状态树就不会过于复杂，易于理解和管理。当一个组件不需要管理自身状态时，也就是无状态组件，应该优先设计为函数组件。比如自定义的 `<Button/>`、 `<Input />` 等组件。

### 10.React中什么是受控组件和非控组件？

**（1）受控组件** 在使用表单来收集用户输入时，例如`<input><select><textearea>`等元素都要绑定一个change事件，**当表单的状态发生变化，就会触发onChange事件**，**更新组件的state**。这种组件在React中被称为**受控组件**，在受控组件中，组件渲染出的状态与它的value或checked属性相对应，react通过这种方式消除了组件的局部状态，使整个状态可控。react官方推荐使用受控表单组件。

受控组件更新state的流程：

-   可以通过初始state中设置表单的默认值
-   每当表单的值发生变化时，**调用onChange事件处理器**
-   事件处理器通过事件对象e拿到改变后的状态，并更新组件的state
-   一旦通过setState方法更新state，就会**触发视图的重新渲染**，完成表单组件的更新

**受控组件缺陷：** 表单元素的值都是由React组件进行管理，当有多个输入框，或者多个这种组件时，如果想同时获取到**全部的值就必须每个都要编写事件处理函数**，这会让代码看着很臃肿，所以为了解决这种情况，出现了非受控组件。

**（2）非受控组件** 如果一个表单组件**没有value props**（单选和复选按钮对应的是checked props）时，就可以称为非受控组件。**在非受控组件中，可以使用一个ref来从DOM获得表单值。而不是为每个状态更新编写一个事件处理程序**。

React官方的解释：

> 要编写一个非受控组件，而不是为每个状态更新都编写数据处理函数，你可以使用 ref来从 DOM 节点中获取表单数据。 因为非受控组件将真实数据储存在 DOM 节点中，所以在使用非受控组件时，有时候反而更容易同时集成 React 和非 React 代码。如果你不介意代码美观性，并且希望快速编写代码，使用非受控组件往往可以减少你的代码量。否则，你应该使用受控组件。

例如，下面的代码在非受控组件中接收单个属性：

```jsx
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.value);
    event.preventDefault();
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={(input) => this.input = input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

**总结：** 页面中所有输入类的DOM如果是现用现取的称为非受控组件，而通过setState将输入的值维护到了state中，需要时再从state中取出，这里的数据就受到了state的控制，称为受控组件。

### 11.React context的使用和理解

[React Context用法整理(附完整代码)](https://blog.csdn.net/qq_34307801/article/details/109774612)

在React中，数据传递一般使用props传递数据，维持单向数据流，这样可以让组件之间的关系变得简单且可预测，但是单项数据流在某些场景中并不适用。**单纯一对的父子组件传递并无问题，但要是组件之间层层依赖深入，props就需要层层传递显然，这样做太繁琐了**。

**Context 提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 props**。

**可以把context当做是特定一个组件树内共享的store，用来做数据传递**。**简单说就是，当你不想在组件树中通过逐层传递props或者state的方式来传递数据时，可以使用Context来实现跨层级的组件数据传递。**

JS的代码块在执行期间，会创建一个相应的作用域链，这个作用域链记录着运行时JS代码块执行期间所能访问的活动对象，包括变量和函数，JS程序通过作用域链访问到代码块内部或者外部的变量和函数。

假如以JS的作用域链作为类比，React组件提供的Context对象其实就好比一个提供给子组件访问的作用域，而 Context对象的属性可以看成作用域上的活动对象。由于组件 的 Context 由其父节点链上所有组件通 过 getChildContext（）返回的Context对象组合而成，所以，组件通过Context是可以访问到其父组件链上所有节点组件提供的Context的属性。

**React并不推荐优先考虑使用Context？**

-   Context目前还处于实验阶段，可能会在后面的发行版本中有很大的变化，事实上这种情况已经发生了，所以为了避免给今后升级带来大的影响和麻烦，不建议在app中使用context。
-   尽管不建议在app中使用context，但是独有组件而言，由于影响范围小于app，如果可以做到高内聚，不破坏组件树之间的依赖关系，可以考虑使用context
-   对于组件之间的数据通信或者状态管理，有效使用props或者state解决，然后再考虑使用第三方的成熟库进行解决，以上的方法都不是最佳的方案的时候，在考虑context。
-   context的更新需要通过setState()触发，但是这并不是很可靠的，Context支持跨组件的访问，但是如果中间的子组件通过一些方法不影响更新，比如 shouldComponentUpdate() 返回false 那么不能保证Context的更新一定可以使用Context的子组件，因此，Context的可靠性需要关注

**使用场景：**

- 父组件使用`Provider`生产数据，子组件使用`Consumer`消费数据
- 子组件使用`ContextType`接收数据
- 动态和静态Context(父组件更新Context，被Provider包裹的子组件刷新数据，没被Provider包裹的子组件使用Context默认值)
- 在嵌套组件中更新Context(子组件通过Context传递的函数更新数据)
- 消费多个Context

#### Context 什么时候用？

Context 设计目的是为了共享那些对于一个组件树而言是“全局”的数据，例如当前认证的用户、主题或首选语言。举个例子，在下面的代码中，我们通过一个 “theme” 属性手动调整一个按钮组件的样式

```javascript
class App extends React.Component {
  render() {
    return <Toolbar theme="dark" />;
  }
}
 
function Toolbar(props) {
  // Toolbar 组件接受一个额外的“theme”属性，然后传递给 ThemedButton 组件。
  // 如果应用中每一个单独的按钮都需要知道 theme 的值，这会是件很麻烦的事，
  // 因为必须将这个值层层传递所有组件。
  return (
    <div>
      <ThemedButton theme={props.theme} />
    </div>
  );
}
 
class ThemedButton extends React.Component {
  render() {
    return <Button theme={this.props.theme} />;
  }
}
 
// 通过props传递：App -> Toolbar -> ThemedButton
// 如果嵌套很深，那么需要逐层传递props，即使中间不需要该props，显得很繁琐
```

使用 context, 我们可以避免通过中间元素传递 props

```javascript
// Context 可以让我们无须明确地传遍每一个组件，就能将值深入传递进组件树。
// 为当前的 theme 创建一个 context（"light"为默认值）。
const ThemeContext = React.createContext('light');
class App extends React.Component {
  render() {
    // 使用一个 Provider 来将当前的 theme 传递给以下的组件树。
    // 无论多深，任何组件都能读取这个值。
    // 在这个例子中，我们将 “dark” 作为当前的值传递下去。
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}
 
// 中间的组件再也不必指明往下传递 theme 了。
function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}
 
class ThemedButton extends React.Component {
  // 指定 contextType 读取当前的 theme context。
  // React 会往上找到最近的 theme Provider，然后使用它的值。
  // 在这个例子中，当前的 theme 值为 “dark”。
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
// 也可以使用 ThemedButto.contextType = ThemeContext;
```

#### API介绍

##### **`React.createContext`**

```javascript
const MyContext = React.createContext(defaultValue);
```

创建一个 Context 对象。当 React 渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 `Provider` 中读取到当前的 context 值。

只有当组件所处的树中没有匹配到 Provider 时，其 `defaultValue` 参数才会生效。这有助于在不使用 Provider 包装组件的情况下对组件进行测试。注意：将 `undefined` 传递给 Provider 的 value 时，消费组件的 `defaultValue` 不会生效。

##### `Context.Provider`

```javascript
<MyContext.Provider value={/* 某个值 */}>
```

每个 Context 对象都会返回一个 Provider React 组件，它允许消费组件订阅 context 的变化。

Provider 接收一个 `value` 属性，传递给消费组件。一个 Provider 可以和多个消费组件有对应关系。多个 Provider 也可以嵌套使用，里层的会覆盖外层的数据。

当 Provider 的 `value` 值发生变化时，它内部的所有消费组件都会重新渲染。Provider 及其内部 consumer 组件都不受制于 `shouldComponentUpdate` 函数，因此当 consumer 组件在其祖先组件退出更新的情况下也能更新。

##### `Class.contextType`

挂载在 class 上的 `contextType` 属性会被重赋值为一个由 React.createContext() 创建的 Context 对象。这能让你使用 `this.context` 来消费最近 Context 上的那个值。你可以在任何生命周期中访问到它，包括 render 函数中

```javascript
import MyContext from './MyContext';
 
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* 在组件挂载完成后，使用 MyContext 组件的值来执行一些有副作用的操作 */
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /* 基于 MyContext 组件的值进行渲染 */
  }
  // 或者如上边例子一样使用 static contextType = MyContext;
}
MyClass.contextType = MyContext;
```

##### `Context.Consumer`

```javascript
import MyContext from './MyContext';
 
function ToolList() {
  return (
    <MyContext.Consumer
      {value => /* 基于 context 值进行渲染*/}
    </MyContext.Consumer>
  )
}
```

这里，React 组件也可以订阅到 context 变更。这能让你在函数式组件中完成订阅 context。

这需要**函数作为子元素（function as a child）**这种做法。这个函数接收当前的 context 值，返回一个 React 节点。传递给函数的 `value` 值等同于往上组件树离这个 context 最近的 Provider 提供的 `value` 值。如果没有对应的 Provider，`value` 参数等同于传递给 `createContext()` 的 `defaultValue`。

##### `Context.displayName`

context 对象接受一个名为 `displayName` 的 property，类型为字符串。React DevTools 使用该字符串来确定 context 要显示的内容。

如下述组件在 DevTools 中将显示为 MyDisplayName

```javascript
const MyContext = React.createContext(/* some value */);
MyContext.displayName = 'MyDisplayName';
 
<MyContext.Provider>   // "MyDisplayName.Provider" 在 DevTools 中
<MyContext.Consumer>   // "MyDisplayName.Consumer" 在 DevTools 中
```

#### 示例

##### 动态 Context

对于上面的 theme 例子，使用动态值（dynamic values）后更复杂的用法

**theme-context.js**

```javascript
export const themes = {
  light: {
    foreground: '#000000',
    background: '#eeeeee',
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222',
  },
};
 
export const ThemeContext = React.createContext(themes.dark);   // 该处为默认值
```

**themed-button.js**

```javascript
import { ThemeContext } from './theme-context';
 
class ThemedButton extends React.Component {
  render() {
    let props = this.props;
    // 获取到ThemeContext中的默认值
    let theme = this.context;
    return (
      <button
        {...props}
        style={{backgroundColor: theme.background}}
      />
    );
  }
  // static contextType = ThemeContext;
}
ThemedButton.contextType = ThemeContext;
 
export default ThemedButton;
```

**app.js**

```javascript
import { ThemeContext, themes } from './theme-context';
import ThemedButton from './themed-button';
 
// 一个使用 ThemedButton 的中间组件
function Toolbar(props) {
  return (
    <ThemedButton onClick={props.changeTheme}>
      Change Theme
    </ThemedButton>
  );
}
 
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: themes.light,
    };
 
    this.toggleTheme = () => {
      this.setState(state => ({
        theme: state.theme === themes.dark ? themes.light : themes.dark,
      }));
    };
  }
 
  render() {
    // 在 ThemeProvider 内部的 ThemedButton 按钮组件使用 state 中的 theme 值，
    // 而外部的组件使用默认的 theme 值
    return (
      <Page>
        <ThemeContext.Provider value={this.state.theme}>
          <Toolbar changeTheme={this.toggleTheme} />
        </ThemeContext.Provider>
        <Section>
          <ThemedButton />
        </Section>
      </Page>
    );
  }
}
 
ReactDOM.render(<App />, document.root);
 
// 使用ThemeContext.Provider包裹的组件，可以消费到ThemeContext中的value
// 即Toolbar、ThemedButton中都可以使用this.context来获取到value
// 注意观察，更新state的方法是通过props向下传递，由子孙组件触发更新，下面会讲到通过context的方式传递更新函数
```

##### 在嵌套组件中更新 Context

在上面的例子中，我们通过 props 的方式向下传递一个更新函数，从而改变 App 中 themes 的值。我们知道，从一个在组件树中嵌套很深的组件中更新 context 是很有必要的。在这种场景下，你可以通过 context 传递一个函数，使得 consumers 组件更新 context

**theme-context.js**

```javascript
// 确保传递给 createContext 的默认值数据结构是调用的组件（consumers）所能匹配的！
export const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {},   // 定义更新主题的方法，向下传递
});
```

**theme-toggler-button.js**

```javascript
import { ThemeContext } from './theme-context';
 
function ThemeTogglerButton() {
  // Theme Toggler 按钮不仅仅只获取 theme 值，它也从 context 中获取到一个 toggleTheme 函数（下面app.js部分）
  return (
    <ThemeContext.Consumer>
      {({theme, toggleTheme}) => (
        <button onClick={toggleTheme} style={{backgroundColor: theme.background}}>
          Toggle Theme
        </button>
      )}
    </ThemeContext.Consumer>
  );
}
 
export default ThemeTogglerButton;
```

**app.js**

```javascript
import { ThemeContext, themes } from './theme-context';
import ThemeTogglerButton from './theme-toggler-button';
 
class App extends React.Component {
  constructor(props) {
    super(props);
 
    this.toggleTheme = () => {
      this.setState(state => ({
        theme: state.theme === themes.dark ? themes.light : themes.dark,
      }));
    };
 
    // State 也包含了更新函数，因此它会被传递进 context provider。
    this.state = {
      theme: themes.light,
      toggleTheme: this.toggleTheme,   // 定义更新函数，通过context方式向下传递
    };
  }
 
  render() {
    // 整个 state 都被传递进 provider
    return (
      <ThemeContext.Provider value={this.state}>
        <Content />
      </ThemeContext.Provider>
    );
  }
}
 
function Content() {
  return (
    <div>
      <ThemeTogglerButton />
    </div>
  );
}
 
ReactDOM.render(<App />, document.root);
```

##### 消费多个 Context

为了确保 context 快速进行重渲染，React 需要使每一个 consumers 组件的 context 在组件树中成为一个单独的节点

```javascript
// Theme context，默认的 theme 是 "light" 值
const ThemeContext = React.createContext('light');
 
// 用户登录 context
const UserContext = React.createContext({
  name: 'Guest',
});
 
class App extends React.Component {
  render() {
    const { signedInUser, theme } = this.props;
 
    // 提供初始 context 值的 App 组件
    return (
      <ThemeContext.Provider value={theme}>
        <UserContext.Provider value={signedInUser}>
          <Layout />
        </UserContext.Provider>
      </ThemeContext.Provider>
    );
  }
}
 
function Layout() {
  return (
    <div>
      <Sidebar />
      <Content />
    </div>
  );
}
 
// 一个组件可能会消费多个 context
function Content() {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <UserContext.Consumer>
          {user => (
            <ProfilePage user={user} theme={theme} />
          )}
        </UserContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
}
```

如果两个或者更多的 context 值经常被一起使用，那你可能要考虑一下另外创建你自己的渲染组件，以提供这些值。

#### 注意事项

因为 context 会使用参考标识（reference identity）来决定何时进行渲染，这里可能会有一些陷阱，当 provider 的父组件进行重渲染时，可能会在 consumers 组件中触发意外的渲染。举个例子，当每一次 Provider 重渲染时，以下的代码会重渲染所有下面的 consumers 组件，因为 `value` 属性总是被赋值为新的对象

```javascript
class App extends React.Component {
  render() {
    return (
      <MyContext.Provider value={{something: 'something'}}>
        <Toolbar />
      </MyContext.Provider>
    );
  }
}
```

为了防止这种情况，将 value 状态提升到父节点的 state 里

```javascript
class App extends React.Component {
  constructor(props) {
    super(props);
    // 多次渲染，state 会被保留，当value不变时，下面的 consumers 组件不会重新渲染 
    this.state = {
      value: {something: 'something'},
    };
  }
 
  render() {
    return (
      <Provider value={this.state.value}>
        <Toolbar />
      </Provider>
    );
  }
}
```

### 12.React的插槽(Portals)的理解，如何使用，有哪些使用场景

React 官方对 Portals 的定义：

> Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案

Portals 是React 16提供的官方解决方案，使得**组件可以脱离父组件层级挂载在DOM树的任何位置**。通俗来讲，就是我们 **render 一个组件，但这个组件的 DOM 结构并不在本组件内**。

Portals语法如下：

```jsx
ReactDOM.createPortal(child, container);
```

-   第一个参数 child 是可渲染的 React 子项，比如元素，字符串或者片段等;
-   第二个参数 container 是一个 DOM 元素。

一般情况下，组件的render函数返回的元素会被挂载在它的父级组件上：

```jsx
import DemoComponent from './DemoComponent';
render() {
  // DemoComponent元素会被挂载在id为parent的div的元素上
  return (
    <div id="parent">
        <DemoComponent />
    </div>
  );
}
```

然而，有些元素需要被挂载在更高层级的位置。最典型的应用场景：当父组件具有`overflow: hidden`或者`z-index`的样式设置时，组件有可能被其他元素遮挡，这时就可以考虑要不要使用Portal使组件的挂载脱离父组件。例如：对话框，模态窗。

```jsx
import DemoComponent from './DemoComponent';
render() {
  // DemoComponent元素会被挂载在id为parent的div的元素上
  return (
    <div id="parent">
        <DemoComponent />
    </div>
  );
}
```



### 13.React中Fragment的理解，它的使用场景是什么？

在React中，组件返回的元素只能有一个根元素。**为了不添加多余的DOM节点，我们可以使用Fragment标签来包裹所有的元素，Fragment标签不会渲染出任何元素**。React官方对Fragment的解释：

> React 中的一个常见模式是一个组件返回多个元素。Fragments 允许你将子列表分组，而无需向 DOM 添加额外节点。

```jsx
import React, { Component, Fragment } from 'react'

// 一般形式
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
// 也可以写成以下形式
render() {
  return (
    <>
      <ChildA />
      <ChildB />
      <ChildC />
    </>
  );
}

```

### 14.React中refs的作用是什么？有哪些应用场景？

Refs 提供了一种方式，用于访问在 render 方法中创建的 React 元素或 DOM 节点。Refs 应该谨慎使用，如下场景使用 Refs 比较适合：

-   处理焦点、文本选择或者媒体的控制
-   触发必要的动画
-   集成第三方 DOM 库

不可以在render访问refs，render 阶段 DOM 还没有生成，无法获取 DOM。DOM 的获取需要在 pre-commit 阶段和 commit 阶段

Refs 是使用 `React.createRef()` 方法创建的，他通过 `ref` 属性附加到 React 元素上。要在整个组件中使用 Refs，需要将 `ref` 在**构造函数中分配给其实例属性**：

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef()
  }
  render() {
    return <div ref={this.myRef} />
  }
}
```

由于函数组件没有实例，因此不能在函数组件上直接使用 `ref`：

```jsx
function MyFunctionalComponent() {
  return <input />;
}
class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }
  render() {
    // 这将不会工作！
    return (
      <MyFunctionalComponent ref={this.textInput} />
    );
  }
}
```

但可以通过闭合的帮助在函数组件内部进行使用 Refs：

```jsx
function CustomTextInput(props) {
  // 这里必须声明 textInput，这样 ref 回调才可以引用它
  let textInput = null;
  function handleClick() {
    textInput.focus();
  }
  return (
    <div>
      <input
        type="text"
        ref={(input) => { textInput = input; }} />
      <input
        type="button"
        value="Focus the text input"
        onClick={handleClick}
      />
    </div>
  );  
}
```

**注意：**

-   不应该过度的使用 Refs
-   `ref` 的返回值取决于节点的类型：
    -   当 `ref` 属性被用于一个普通的 HTML 元素时，`React.createRef()` 将接收底层 DOM 元素作为他的 `current` 属性以创建 `ref`。
    -   当 `ref` 属性被用于一个自定义的类组件时，`ref` 对象将接收该组件已挂载的实例作为他的 `current`。
-   当在父组件中需要访问子组件中的 `ref` 时可使用传递 Refs 或回调 Refs。



### 15.类组件与函数组件有什么异同？

**相同点：** 组件是 React 可复用的最小代码片段，它们会返回要在页面中渲染的 React 元素。也正因为组件是 React 的最小编码单位，所以无论是函数组件还是类组件，在使用方式和最终呈现效果上都是完全一致的。

我们甚至可以将一个类组件改写成函数组件，或者把函数组件改写成一个类组件（虽然并不推荐这种重构行为）。从使用者的角度而言，很难从使用体验上区分两者，而且在现代浏览器中，闭包和类的性能只在极端场景下才会有明显的差别。所以，基本可认为两者作为组件是完全一致的。

**不同点：**

-   它们在开发时的心智模型上却存在巨大的差异。类组件是基于面向对象编程的，它主打的是继承、生命周期等核心概念；而函数组件内核是函数式编程，主打的是 immutable、没有副作用、引用透明等特点。
-   之前，在使用场景上，如果存在需要使用生命周期的组件，那么主推类组件；设计模式上，如果需要使用继承，那么主推类组件。但现在由于 React Hooks 的推出，生命周期概念的淡出，函数组件可以完全取代类组件。其次继承并不是组件最佳的设计模式，官方更推崇“组合优于继承”的设计概念，所以类组件在这方面的优势也在淡出。
-   性能优化上，**类组件主要依靠 shouldComponentUpdate 阻断渲染来提升性能，而函数组件依靠 React.memo 缓存渲染结果来提升性能**。
-   从上手程度而言，类组件更容易上手，从未来趋势上看，由于React Hooks 的推出，函数组件成了社区未来主推的方案。
-   类组件在未来时间切片与并发模式中，由于生命周期带来的复杂度，并不易于优化。而函数组件本身轻量简单，且在 Hooks 的基础上提供了比原先更细粒度的逻辑组织与复用，更能适应 React 的未来发展。

### 16.React组件的构造函数有什么作用？它是必须的吗？

构造函数主要用于两个目的：

-   通过将对象分配给this.state来初始化本地状态
-   将事件处理程序方法绑定到实例上

所以，当在React class中需要设置state的初始值或者绑定事件时，需要加上构造函数，官方Demo：

```jsx
class LikeButton extends React.Component {
  constructor() {
    super();
    this.state = {
      liked: false
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({liked: !this.state.liked});
  }
  render() {
    const text = this.state.liked ? 'liked' : 'haven\'t liked';
    return (
      <div onClick={this.handleClick}>
        You {text} this. Click to toggle.
      </div>
    );
  }
}
ReactDOM.render(
  <LikeButton />,
  document.getElementById('example')
);
```

构造函数用来新建父类的this对象；子类必须在constructor方法中调用super方法；否则新建实例时会报错；因为子类没有自己的this对象，而是继承父类的this对象，然后对其进行加工。如果不调用super方法；子类就得不到this对象。

**注意：**

-   constructor () 必须配上 super(), 如果要在constructor 内部使用 this.props 就要 传入props , 否则不用
-   JavaScript中的 bind 每次都会返回一个新的函数, 为了性能等考虑, 尽量在constructor中绑定事件

### 17.React.forwardRef的作用？

React.forwardRef 会创建一个React组件，这个组件能够将其接受的 ref 属性转发到其组件树下的另一个组件中。这种技术并不常见，但在以下两种场景中特别有用：

-   转发 refs 到 DOM 组件
-   在高阶组件中转发 refs

### 18.HOC相比 mixins 有什么优点？

HOC 和 Vue 中的 mixins 作用是一致的，并且在早期 React 也是使用 mixins 的方式。但是在使用 class 的方式创建组件以后，mixins 的方式就不能使用了，并且其实 mixins 也是存在一些问题的，比如：

-   隐含了一些依赖，比如我在组件中写了某个 `state` 并且在 `mixin` 中使用了，就这存在了一个依赖关系。万一下次别人要移除它，就得去 `mixin` 中查找依赖
-   多个 `mixin` 中可能存在相同命名的函数，同时代码组件中也不能出现相同命名的函数，否则就是重写了，其实我一直觉得命名真的是一件麻烦事。。
-   雪球效应，虽然我一个组件还是使用着同一个 `mixin`，但是一个 `mixin` 会被多个组件使用，可能会存在需求使得 `mixin` 修改原本的函数或者新增更多的函数，这样可能就会产生一个维护成本

HOC 解决了这些问题，并且它们达成的效果也是一致的，同时也更加函数式了。

### 19.React 中的高阶组件运用了什么设计模式？

使用了装饰模式，高阶组件的运用：

```jsx
function withWindowWidth(BaseComponent) {
  class DerivedClass extends React.Component {
    state = {
      windowWidth: window.innerWidth,
    }
    onResize = () => {
      this.setState({
        windowWidth: window.innerWidth,
      })
    }
    componentDidMount() {
      window.addEventListener('resize', this.onResize)
    }
    componentWillUnmount() {
      window.removeEventListener('resize', this.onResize);
    }
    render() {
      return <BaseComponent {...this.props} {...this.state}/>
    }
  }
  return DerivedClass;
}
const MyComponent = (props) => {
  return <div>Window width is: {props.windowWidth}</div>
};
export default withWindowWidth(MyComponent);
```

装饰模式的特点是不需要改变 被装饰对象 本身，而只是在外面套一个外壳接口。JavaScript 目前已经有了原生装饰器的提案，其用法如下：

```jsx
@testable
   class MyTestableClass {
}
```

### 20.React渲染流程

![image-20220712105045979](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsAY26fwZWbCOvnli.png)

![image-20220712111025690](https://s2.loli.net/2022/07/12/ms5WQ6ZxHoIXnAw.png)

#### 协调

协调，在 React 官方博客的原文中是 Reconciler，它的本意是“和解者，调解员”

Reconciler 是协助 React 确认状态变化时要更新哪些 DOM 元素的 diff 算法

在 React 源码中还有一个叫作 reconcilers 的模块，它通过抽离公共函数与 diff 算法使声明式渲染、自定义组件、state、生命周期方法和 refs 等特性实现跨平台工作

Reconciler 模块以 React 16 为分界线分为两个版本。

- **Stack Reconciler**是 React 15 及以前版本的渲染方案，其核心是以**递归的方式**逐级调度栈中子节点到父节点的渲染。
- **Fiber Reconciler**是 React 16 及以后版本的渲染方案，它的核心设计是**增量渲染**（incremental rendering），也就是将渲染工作分割为多个区块，并将其分散到多个帧中去执行。它的设计初衷是提高 React 在动画、画布及手势等场景下的性能表现。

#### 渲染

为了更好地理解两者之间的差异，我们需要先梳理一遍 Stack Reconciler。

**Stack Reconciler**

Stack Reconciler 没有单独的包，并没有像 Fiber Reconclier 一样抽取为独立的[React-Reconciler 模块](https://github.com/facebook/react/tree/16.3-dev/packages/react-reconciler)。但这并不妨碍它成为一个经典的设计。在 React 的官方文档中，是通过伪代码的形式介绍其[实现方案](https://react.html.cn/docs/implementation-notes.html)的。与官方文档略有不同，下面我会介绍一些真实代码的信息。

**挂载**

这里的挂载与生命周期一讲中的挂载不同，它是将整个 React 挂载到 ReactDOM.render 之上，就像以下代码中的 App 组件挂载到 root 节点上一样。

```jsx
class App extends React.Component {
  render() {
    return (
        <div>Hello World</div>
      )
  }
} 
ReactDOM.render(<App />, document.getElementById('root'))
```

JSX 会被 Babel 编译成 React.creatElemnt 的形式：

```jsx
ReactDOM.render(React.creatElement(App), document.getElementById('root'))
```

但一定要记住，这项工作发生在本地的 Node 进程中，而不是通过浏览器中的 React 完成的。以为 JSX 是通过 React 完成编译，这是完全不正确的。

ReactDOM.render 调用之后，实际上是**透传参数给 ReactMount.render**。

- ReactDOM 是对外暴露的模块接口；
- 而 **ReactMount** 是实际执行者，完成初始化 React 组件的整个过程。

初始化第一步就是通过 React.creatElement 创建 React Element。不同的组件类型会被构建为不同的 Element：

- App 组件会被标记为 type function，作为用户自定义的组件，被 ReactComponentsiteComponent 包裹一次，生成一个对象实例；
- div 标签作为 React 内部的已知 DOM 类型，会实例化为 ReactDOMComponent；
- "Hello World" 会被直接判断是否为字符串，实例化为 ReactDOMComponent。

![image-20220712111330887](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs58BHPtXjbEaLmZl.png)

这段逻辑在 React 源码中大致是这样的，其中 isInternalComponentType 就是判断当前的组件是否为内部已知类型。

```jsx
if (typeof element.type === 'string') {
    instance = ReactHostComponent.createInternalComponent(element);
  } else if (isInternalComponentType(element.type)) {
    instance = new element.type(element);
  } else {
    instance = new ReactCompositeComponentWrapper();
}
```

到这里仅仅完成了实例化，我们还需要与 React 产生一些联动，比如改变状态、更新界面等。在 setState 一讲中，我们提到在状态变更后，涉及一个**变更收集再批量处理**的过程。在这里 **ReactUpdates** 模块就专门**用于批量处理**，而批量处理的前后操作，是由 React 通过**建立事务的概念**来处理的。

React 事务都是基于 Transaction 类继承拓展。每个 Transaction 实例都是一个封闭空间，保持不可变的任务常量，并提供对应的事务处理接口 。一段事务在 React 源码中大致是这样的：

```jsx
mountComponentIntoNode: function(rootID, container) {
      var transaction = ReactComponent.ReactReconcileTransaction.getPooled();
      transaction.perform(
        this._mountComponentIntoNode,
        this,
        rootID,
        container,
        transaction
      );
      ReactComponent.ReactReconcileTransaction.release(transaction);
 }
```

如果有操作数据库经验的同学，应该看到过相似的例子。React 团队将其从后端领域借鉴到前端是因为事务的设计有以下优势。

- 原子性: 事务作为一个整体被执行，要么全部被执行，要么都不执行。
- 隔离性: 多个事务并发执行时，一个事务的执行不应影响其他事务的执行。
- 一致性: 相同的输入，确定能得到同样的执行结果。

上面提到的事务会调用 ReactCompositeComponent.mountComponent 函数进入 React 组件生命周期，它的源码大致是这样的。

```jsx
if (inst.componentWillMount) {
    inst.componentWillMount();
    if (this._pendingStateQueue) {
        inst.state = this._processPendingState(inst.props, inst.context);
    }
}
```

首先会判断是否有 componentWillMount，然后初始化 state 状态。当 state 计算完毕后，就会调用在 App 组件中声明的 render 函数。接着 render 返回的结果，会处理为新的 React Element，再走一遍上面提到的流程，不停地往下解析，逐步递归，直到开始处理 HTML 元素。到这里我们的 App 组件就完成了首次渲染。

**更新**

接下来我们用同样的方式解析下当调用 setState 时会发生什么。setState 时会调用 Component 类中的 enqueueSetState 函数。

```js
this.updater.enqueueSetState(this, partialState)
```

在执行 enqueueSetState 后，会调用 ReactCompositeComponent 实例中的_pendingStateQueue，将**新的状态变更加入实例的等待更新状态队列中**，再调用ReactUpdates 模块中的 enqueueUpdate 函数执行更新。这个过程会检查更新是否已经在进行中：

- 如果是，则把组件加入 dirtyComponents 中；
- 如果不是，先初始化更新事务，然后把组件加入 dirtyComponents 列表。

这里的初始化更新事务，就是 setState 一讲中提到的 batchingstrategy.isBatchingUpdates 开关。接下来就会在更新事务中处理所有记录的 dirtyComponents。

**卸载**

对于自定义组件，也就是对 ReactCompositeComponent 而言，卸载过程需要递归地调用生命周期函数。

```
class CompositeComponent{
  unmount(){
    var publicInstance = this.publicInstance
    if(publicInstance){
      if(publicInstance.componentWillUnmount){
        publicInstance.componentWillUnmount()
      }
    }
    var renderedComponent = this.renderedComponent
    renderedComponent.unmount()
  }
}
```

而对于 ReactDOMComponent 而言，卸载子元素需要清除事件监听器并清理一些缓存。

```
class DOMComponent{
  unmount(){
    var renderedChildren = this.renderedChildren
    renderedChildren.forEach(child => child.unmount())
  }
}
```

那么到这里，卸载的过程就算完成了

在挂载阶段， ReactMount 模块已经不存在了，是直接构造 Fiber 树。而更新流程大致一样，依然通过 IsBatchingUpdates 控制。那么 Fiber Reconciler 最大的不同有两点：

- 协作式多任务模式；
- 基于循环遍历计算 diff

#### 总结

React 的渲染过程大致一致，但协调并不相同，以 React 16 为分界线，分为 Stack Reconciler 和 Fiber Reconciler。这里的协调从狭义上来讲，特指 React 的 diff 算法，广义上来讲，有时候也指 React 的 reconciler 模块，它通常包含了 diff 算法和一些公共逻辑。

回到 Stack Reconciler 中，Stack Reconciler 的核心调度方式是递归。调度的基本处理单位是事务，它的事务基类是 Transaction，这里的事务是 React 团队从后端开发中加入的概念。在 React 16 以前，挂载主要通过 ReactMount 模块完成，更新通过 ReactUpdate 模块完成，模块之间相互分离，落脚执行点也是事务。

在 React 16 及以后，协调改为了 Fiber Reconciler。它的调度方式主要有两个特点，第一个是**协作式多任务模式**，在这个模式下，线程会定时放弃自己的运行权利，交还给主线程，通过requestIdleCallback 实现。第二个特点是策略优先级，调度任务通过标记 tag 的方式分优先级执行，比如动画，或者标记为 high 的任务可以优先执行。Fiber Reconciler的基本单位是 Fiber，Fiber 基于过去的 React Element 提供了二次封装，提供了指向父、子、兄弟节点的引用，为 diff 工作的双链表实现提供了基础。

在新的架构下，整个生命周期被划分为 Render 和 Commit 两个阶段。Render 阶段的执行特点是可中断、可停止、无副作用，主要是**通过构造 workInProgress 树计算出 diff。以 current 树为基础，将每个 Fiber 作为一个基本单位，自下而上逐个节点检查并构造 workInProgress 树。**这个过程不再是递归，而是基于循环来完成。

在执行上通过 requestIdleCallback 来调度执行每组任务，每组中的每个计算任务被称为 work，每个 work 完成后确认是否有优先级更高的 work 需要插入，如果有就让位，没有就继续。优先级通常是标记为动画或者 high 的会先处理。每完成一组后，将调度权交回主线程，直到下一次 requestIdleCallback 调用，再继续构建 workInProgress 树。

在 commit 阶段需要处理 effect 列表，这里的 effect 列表包含了根据 diff 更新 DOM 树、回调生命周期、响应 ref 等。

但一定要注意，这个阶段是同步执行的，不可中断暂停，所以不要在 componentDidMount、componentDidUpdate、componentWiilUnmount 中去执行重度消耗算力的任务。

如果只是一般的应用场景，比如管理后台、H5 展示页等，两者性能差距并不大，但在动画、画布及手势等场景下，Stack Reconciler 的设计会占用占主线程，造成卡顿，而 fiber reconciler 的设计则能带来高性能的表现。

![image-20220712111542109](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgstJYXI2FsGgw3cdk.png)

## 数据管理

### 1\.React setState 调用的原理

![image-20220701204358623](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsgfEvcmzMYtxnBAs.png)



具体的执行过程如下（源码级解析）：

-   首先调用了`setState` 入口函数，入口函数在这里就是充当一个分发器的角色，根据入参的不同，将其分发到不同的功能函数中去；

```jsx
ReactComponent.prototype.setState = function (partialState, callback) {
  this.updater.enqueueSetState(this, partialState);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState');
  }
};
```

-   `enqueueSetState` 方法将新的 `state` 放进**组件的状态队列**里，并调用 `enqueueUpdate` 来处理将要更新的实例对象；

```jsx
enqueueSetState: function (publicInstance, partialState) {
  // 根据 this 拿到对应的组件实例
  var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'setState');
  // 这个 queue 对应的就是一个组件实例的 state 数组
  var queue = internalInstance._pendingStateQueue || (internalInstance._pendingStateQueue = []);
  queue.push(partialState);
  //  enqueueUpdate 用来处理当前的组件实例
  enqueueUpdate(internalInstance);
}
```

-   在 `enqueueUpdate` 方法中引出了一个关键的对象——`batchingStrategy`，该对象所具备的`isBatchingUpdates` 属性直接决定了当下**是要走更新流程，还是应该排队等待**；如果轮到执行，就调用 `batchedUpdates` 方法来直接发起更新流程。由此可以推测，`batchingStrategy` 或许正是 React 内部专门用于管控批量更新的对象。

```jsx
function enqueueUpdate(component) {
  ensureInjected();
  // 注意这一句是问题的关键，isBatchingUpdates标识着当前是否处于批量创建/更新组件的阶段
  if (!batchingStrategy.isBatchingUpdates) {
    // 若当前没有处于批量创建/更新组件的阶段，则立即更新组件
    batchingStrategy.batchedUpdates(enqueueUpdate, component);
    return;
  }
  // 否则，先把组件塞入 dirtyComponents 队列里，让它“再等等”
  dirtyComponents.push(component);
  if (component._updateBatchNumber == null) {
    component._updateBatchNumber = updateBatchNumber + 1;
  }
}
```

**注意：**`batchingStrategy` 对象可以理解为“锁管理器”。这里的“锁”，是指 React 全局唯一的 `isBatchingUpdates` 变量，`isBatchingUpdates` 的初始值是 `false`，意味着“当前并未进行任何批量更新操作”。每当 React 调用 `batchedUpdate` 去执行更新动作时，会先把这个锁给“锁上”（置为 `true`），表明“现在正处于批量更新过程中”。当锁被“锁上”的时候，任何需要更新的组件都只能暂时进入 `dirtyComponents` 里排队等候下一次的批量更新，而不能随意“插队”。此处体现的“任务锁”的思想，是 React 面对大量状态仍然能够实现有序分批处理的基石。

### 2.React setState是同步还是异步？ 调用之后发生了什么？

**（1）React中setState后发生了什么**

在代码中调用setState函数之后，React 会将**传入的参数对象与组件当前的状态合并**，然后触发调和过程(Reconciliation)。经过调和过程，React 会以相对高效的方式根据新的状态构建 React 元素树并且着手重新渲染整个UI界面。

在 React 得到**元素树之后，React 会自动计算出新的树与老树的节点差异，然后根据差异对界面进行最小化重渲染。在差异计算算法中，React 能够相对精确地知道哪些位置发生了改变以及应该如何改变，这就保证了按需更新，而不是全部重新渲染**。

如果在短时间内频繁setState。React会将state的改变压入栈中，在合适的时机，批量更新state和视图，达到提高性能的效果。

**（2）setState 是同步还是异步的**

假如所有setState是同步的，意味着每执行一次setState时（有可能一个同步代码中，多次setState），都重新vnode diff + dom修改，这对性能来说是极为不好的。如果是异步，则可以把一个同步代码中的多个setState合并成一次组件更新。**所以默认是异步的，但是在一些情况下是同步的**。

setState 并不是单纯同步/异步的，它的表现会因调用场景的不同而不同。**在源码中，通过 `isBatchingUpdates` 来判断setState 是先存进 state 队列还是直接更新，如果值为 true 则执行异步操作，为 false 则直接更新。**

-   **异步：** 在 React 可以控制的地方，就为 true，比如在 React 生命周期事件和合成事件中，都会走**合并操作，延迟更新的策略**。
-   **同步：** 在 **React 无法控制的地方**，比如**原生事件，具体就是在 addEventListener 、setTimeout、setInterval 等事件中，就只能同步更新**。

一般认为，做异步设计是为了性能优化、减少渲染次数：

-   `setState`设计为异步，可以显著的提升性能。如果每次调用 `setState`都进行一次更新，那么意味着`render`函数会被频繁调用，界面重新渲染，这样效率是很低的；最好的办法应该是获取到多个更新，之后进行批量更新；
-   如果同步更新了`state`，但是还没有执行`render`函数，那么`state`和`props`不能保持同步。`state`和`props`不能保持一致性，会在开发中产生很多的问题；

### 3.React组件的state和props有什么区别？

**（1）props**

props是一个从外部传进组件的参数，主要作为就是从父组件向子组件传递数据，它具有可读性和不变性，只能通过外部组件主动传入新的props来重新渲染子组件，否则子组件的props以及展现形式不会改变。

**（2）state**

state的主要作用是用于组件保存、控制以及修改自己的状态，它只能在constructor中初始化，它算是组件的私有属性，不可通过外部访问和修改，只能通过组件内部的this.setState来修改，修改state属性会导致组件的重新渲染。

**（3）区别**

-   props 是传递给组件的（类似于函数的形参），而state 是在组件内被组件自己管理的（类似于在一个函数内声明的变量）。
-   props 是不可修改的，所有 React 组件都必须像纯函数一样保护它们的 props 不被更改。
-   state 是在组件中创建的，一般在 constructor中初始化 state。state 是多变的、可以修改，每次setState都异步更新的。

### 4.React中的setState批量更新的过程是什么？

调用 `setState` 时，组件的 `state` 并不会立即改变， `setState` 只是把要修改的 `state` 放入一个队列， `React` 会优化真正的执行时机，并出于性能原因，会将 `React` 事件处理程序中的多次`React` 事件处理程序中的多次 `setState` 的状态修改合并成一次状态修改。 最终更新只产生一次组件及其子组件的重新渲染，这对于大型应用程序中的性能提升至关重要。

```jsx
this.setState({
  count: this.state.count + 1    ===>    入队，[count+1的任务]
});
this.setState({
  count: this.state.count + 1    ===>    入队，[count+1的任务，count+1的任务]
});
                                          ↓
                                         合并 state，[count+1的任务]
                                          ↓
                                         执行 count+1的任务
```

需要注意的是，只要同步代码还在执行，“攒起来”这个动作就不会停止。（注：这里之所以多次 +1 最终只有一次生效，是因为在同一个方法中多次 setState 的合并动作不是单纯地将更新累加。比如这里对于相同属性的设置，React 只会为其保留最后一次的更新）。

### 5.React中组件的props改变时更新组件的有哪些方法？

在一个组件传入的props更新时重新渲染该组件常用的方法是在`componentWillReceiveProps`中将新的props更新到组件的state中（这种state被成为派生状态（Derived State）），从而实现重新渲染。React 16.3中还引入了一个新的钩子函数`getDerivedStateFromProps`来专门实现这一需求。

**（1）componentWillReceiveProps（17已废弃）**

在react的componentWillReceiveProps(nextProps)生命周期中，可以在子组件的render函数执行前，通过this.props获取旧的属性，通过nextProps获取新的props，对比两次props是否相同，从而更新子组件自己的state。

这样的好处是，可以将数据请求放在这里进行执行，需要传的参数则从componentWillReceiveProps(nextProps)中获取。而不必将所有的请求都放在父组件中。于是该请求只会在该组件渲染时才会发出，从而减轻请求负担。

**（2）getDerivedStateFromProps（16.3引入）**

这个生命周期函数是为了替代`componentWillReceiveProps`存在的，所以在需要使用`componentWillReceiveProps`时，就可以考虑使用`getDerivedStateFromProps`来进行替代。

两者的参数是不相同的，而`getDerivedStateFromProps`是一个静态函数，也就是这个函数不能通过this访问到class的属性，也并不推荐直接访问属性。而是应该通过参数提供的nextProps以及prevState来进行判断，根据新传入的props来映射到state。

需要注意的是，**如果props传入的内容不需要影响到你的state，那么就需要返回一个null**，这个返回值是必须的，所以尽量将其写到函数的末尾：

```jsx
static getDerivedStateFromProps(nextProps, prevState) {
    const {type} = nextProps;
    // 当传入的type发生变化的时候，更新state
    if (type !== prevState.type) {
        return {
            type,
        };
    }
    // 否则，对于state不进行任何操作
    return null;
}
```

### 6.React中的props为什么是只读的？

`this.props`是组件之间沟通的一个接口，原则上来讲，它只能从父组件流向子组件。React具有浓重的函数式编程的思想。

提到函数式编程就要提一个概念：纯函数。它有几个特点：

-   给定相同的输入，总是返回相同的输出。
-   过程没有副作用。
-   不依赖外部状态。

`this.props`就是汲取了纯函数的思想。props的不可以变性就保证的相同的输入，页面显示的内容是一样的，并且不会产生副作用

### 7.React中setState的第二个参数作用是什么？

`setState` 的第二个参数是一个可选的回调函数。**这个回调函数将在组件重新渲染后执行**。等价于在 `componentDidUpdate` 生命周期内执行。通常建议使用 `componentDidUpdate` 来代替此方式。在这个回调函数中你可以拿到更新后 `state` 的值：

```jsx
this.setState({
    key1: newState1,
    key2: newState2,
    ...
}, callback) // 第二个参数是 state 更新完成后的回调函数
```

### 8.React中的setState和replaceState的区别是什么？

**（1）setState()** setState()用于设置状态对象，其语法如下：

```jsx
setState(object nextState[, function callback])
```

-   nextState，将要设置的新状态，该状态会和当前的state合并
-   callback，可选参数，回调函数。该函数会在setState设置成功，且组件重新渲染后调用。

合并nextState和当前state，并重新渲染组件。setState是React事件处理函数中和请求回调函数中触发UI更新的主要方法。

**（2）replaceState()** replaceState()方法与setState()类似，但是方法只会保留nextState中状态，原state不在nextState中的状态都会被删除。其语法如下：

```jsx
replaceState(object nextState[, function callback])
```

-   nextState，将要设置的新状态，该状态会替换当前的state。
-   callback，可选参数，回调函数。该函数会在replaceState设置成功，且组件重新渲染后调用。

**总结：** setState 是修改其中的部分状态，相当于 Object.assign，只是覆盖，不会减少原来的状态。而replaceState 是完全替换原来的状态，相当于赋值，将原来的 state 替换为另一个对象，如果新状态属性减少，那么 state 中就没有这个状态了。

### 9.React中怎么检验props？验证props的目的是什么？

**React**为我们**提供了PropTypes以供验证使用**。当我们**向Props传入的数据无效（向Props传入的数据类型和验证的数据类型不符）就会在控制台发出警告信息。**它可以避免随着应用越来越复杂从而出现的问题。并且，它还可以让程序变得更易读。

```jsx
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

Greeting.propTypes = {
  name: PropTypes.string
};
```

当然，如果项目中使用了TypeScript，那么就可以不用PropTypes来校验，而使用TypeScript定义接口来校验props.

### 10.React如何获取上一轮的props和state？

react获取上一轮的props和state ,有的时候 需要 获取 改变前的 state,和props 做个对比处理，或者其它处理。

效果图：

![](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs1Am7bjDYKHOisal.png)

如果只是 想实现 这个效果 下面的代码 也行 。就不用借助其它的了。 这个思路就是，在 改变 state之前 就 备份一下 值 。

####  **hook**

```jsx
import React, { useState, useEffect } from 'react'
import { Select } from 'antd';
const { Option } = Select;
function Index() {
 
    
    const [val, setVal] = useState("--")//name
    const [val2, setVal2] = useState("--")//name
   
    const handleChange = (value) => {
        console.log(val,value)
        setVal2(val)
        setVal(value);
    };
 
 
    return (
        <div>
            <Select
                defaultValue="lucy"
                style={{
                    width: 120,
                }}
                onChange={handleChange}
            >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="disabled" disabled>
                    Disabled
                </Option>
                <Option value="Yiminghe">yiminghe</Option>
            </Select>
            <h1>现在的值: {val}, 之前的值: {val2}</h1>
        </div >
    )
}
 
export default Index
```

#### **class** 

  不借助生命周期

```jsx
import React, { Component } from 'react';
import { Select } from 'antd';
const { Option } = Select;
class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            val: "--",
            val2: "--"
        }
    }
    componentDidMount() {
 
    }
 
    handleChange = (value) => {
       
        this.setState({
            val: value,
            val2:this.state.val
        })
    }
   
    render() {
        let { val,val2 } = this.state;
        return (
            <div>
 
                <Select
                    defaultValue="lucy"
                    style={{
                        width: 120,
                    }}
                    onChange={this.handleChange}
                >
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="disabled" disabled>
                        Disabled
                    </Option>
                    <Option value="Yiminghe">yiminghe</Option>
                </Select>
                <h1>现在的值: {val}, 之前的值: {val2}</h1>
            </div>
        );
    }
}
 
export default Index
```

借助生命周期 componentDidUpdate

```jsx
import React, { Component } from 'react';
import { Select } from 'antd';
const { Option } = Select;
class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            val: "--",
            val2:"--"
        }
    }
    componentDidMount() {
 
    }
 
    handleChange = (value) => {
        this.setState({
            val: value
        })
    }
    componentDidUpdate(prevProps, prevState, snapshot){
        console.log(prevProps, prevState, snapshot,"10")
        if(prevState.val!=this.state.val){
            this.setState({
                val2:prevState.val
            })
        }
        
    }
    // getSnapshotBeforeUpdate(prevProps, prevState) {
    //     console.log(prevProps, prevState,"09")
    //     return null;
    //   }
    render() {
        let { val ,val2} = this.state;
        return (
            <div>
 
                <Select
                    defaultValue="lucy"
                    style={{
                        width: 120,
                    }}
                    onChange={this.handleChange}
                >
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="disabled" disabled>
                        Disabled
                    </Option>
                    <Option value="Yiminghe">yiminghe</Option>
                </Select>
                <h1>现在的值: {val}, 之前的值: { val2}</h1>
            </div>
        );
    }
}
 
export default Index
```

下面的方法是 获取到整个 state 和 props 

#### react 类组(class)件实现 

react Class 组件 很好实现因为有生命周期，可以用 componentDidUpdate(prevProps, prevState, snapshot) 和 getSnapshotBeforeUpdate(prevProps, prevState) 获取到

**`componentDidUpdate()介绍`**

```jsx
componentDidUpdate(prevProps, prevState, snapshot)
```

`componentDidUpdate()` 会在更新后会被立即调用。首次渲染不会执行此方法。

当组件更新后，可以在此处对 DOM 进行操作。如果你对更新前后的 props 进行了比较，也可以选择在此处进行网络请求。（例如，当 props 未发生变化时，则不会执行网络请求）。

```jsx
componentDidUpdate(prevProps) {if (this.props.userID !== prevProps.userID) {this.fetchData(this.props.userID);  }}
```

你也可以在 `componentDidUpdate()` 中**直接调用 `setState()`**，但请注意**它必须被包裹在一个条件语句里**，正如上述的例子那样进行处理，否则会导致死循环。它还会导致额外的重新渲染，虽然用户不可见，但会影响组件性能。不要将 props “镜像”给 state，请考虑直接使用 props。 欲了解更多有关内容，请参阅[为什么 props 复制给 state 会产生 bug](https://zh-hans.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html "为什么 props 复制给 state 会产生 bug")。

如果组件实现了 `getSnapshotBeforeUpdate()` 生命周期（不常用），则它的返回值将作为 `componentDidUpdate()` 的第三个参数 “snapshot” 参数传递。否则此参数将为 undefined。

> 注意
>
> 如果 [shouldComponentUpdate()](https://zh-hans.reactjs.org/docs/react-component.html#shouldcomponentupdate "shouldComponentUpdate()") 返回值为 false，则不会调用 `componentDidUpdate()`。

___

**getSnapshotBeforeUpdate 介绍**

```jsx
getSnapshotBeforeUpdate(prevProps, prevState)
```

`getSnapshotBeforeUpdate()` 在最近一次渲染输出（提交到 DOM 节点）之前调用。它使得组件能在发生更改之前从 DOM 中捕获一些信息（例如，滚动位置）。此生命周期方法的任何返回值将作为参数传递给 `componentDidUpdate()`。

此用法并不常见，但它可能出现在 UI 处理中，如需要以特殊方式处理滚动位置的聊天线程等。

应返回 snapshot 的值（或 `null`）。

例如：

```jsx
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }
 
  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 我们是否在 list 中添加新的 items ？
    // 捕获滚动​​位置以便我们稍后调整滚动位置。
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }
 
  componentDidUpdate(prevProps, prevState, snapshot) {
    // 如果我们 snapshot 有值，说明我们刚刚添加了新的 items，
    // 调整滚动位置使得这些新 items 不会将旧的 items 推出视图。
    //（这里的 snapshot 是 getSnapshotBeforeUpdate 的返回值）
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }
 
  render() {
    return (
      <div ref={this.listRef}>{/* ...contents... */}</div>
    );
  }
}
```

在上述示例中，重点是从 `getSnapshotBeforeUpdate` 读取 `scrollHeight` 属性，因为 “render” 阶段生命周期（如 `render`）和 “commit” 阶段生命周期（如 `getSnapshotBeforeUpdate` 和 `componentDidUpdate`）之间可能存在延迟。

   上面参考于：[react 官网 -生命周期](https://zh-hans.reactjs.org/docs/react-component.html#mounting "react 官网 -生命周期") 

    实现代码如下：

```jsx
import React, { Component } from 'react';
import { Select } from 'antd';
const { Option } = Select;
class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            val: "--"
        }
    }
    componentDidMount() {
 
    }
 
    handleChange = (value) => {
        this.setState({
            val: value
        })
    }
    componentDidUpdate(prevProps, prevState, snapshot){
        console.log(prevProps, prevState, snapshot,"10")
    }
    getSnapshotBeforeUpdate(prevProps, prevState) {
        console.log(prevProps, prevState,"09")
        return null;
      }
    render() {
        let { val } = this.state;
        return (
            <div>
 
                <Select
                    defaultValue="lucy"
                    style={{
                        width: 120,
                    }}
                    onChange={this.handleChange}
                >
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="disabled" disabled>
                        Disabled
                    </Option>
                    <Option value="Yiminghe">yiminghe</Option>
                </Select>
                <h1>现在的值: {val}, 之前的值: { }</h1>
            </div>
        );
    }
}
 
export default Index
```

#### 函数组件（react Hook实现）

 借用useEffect, useRef 实现 。

**`useEffect`**

```jsx
useEffect(didUpdate);
```

该 Hook 接收一个包含命令式、且可能有副作用代码的函数。

在函数组件主体内（这里指在 React 渲染阶段）改变 DOM、添加订阅、设置定时器、记录日志以及执行其他包含副作用的操作都是不被允许的，因为这可能会产生莫名其妙的 bug 并破坏 UI 的一致性。

使用 `useEffect` 完成副作用操作。赋值给 `useEffect` 的函数会在组件渲染到屏幕之后执行。你可以把 effect 看作从 React 的纯函数式世界通往命令式世界的逃生通道。

默认情况下，effect 将在每轮渲染结束后执行，但你可以选择让它 [在只有某些值改变的时候](https://zh-hans.reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect "在只有某些值改变的时候") 才执行。

清除 effect

通常，组件卸载时需要清除 effect 创建的诸如订阅或计时器 ID 等资源。要实现这一点，`useEffect` 函数需返回一个清除函数。以下就是一个创建订阅的例子：

```jsx
useEffect(() => {const subscription = props.source.subscribe();return () => {    subscription.unsubscribe();  };});
```

为防止内存泄漏，清除函数会在组件卸载前执行。另外，如果组件多次渲染（通常如此），则**在执行下一个 effect 之前，上一个 effect 就已被清除**。在上述示例中，意味着组件的每一次更新都会创建新的订阅。若想避免每次更新都触发 effect 的执行，请参阅下一小节。

effect 的执行时机

与 `componentDidMount`、`componentDidUpdate` 不同的是，传给 `useEffect` 的函数会在浏览器完成布局与绘制**之后**，在一个延迟事件中被调用。这使得它适用于许多常见的副作用场景，比如设置订阅和事件处理等情况，因为绝大多数操作不应阻塞浏览器对屏幕的更新。

然而，并非所有 effect 都可以被延迟执行。例如，一个对用户可见的 DOM 变更就必须在浏览器执行下一次绘制前被同步执行，这样用户才不会感觉到视觉上的不一致。（概念上类似于被动监听事件和主动监听事件的区别。）React 为此提供了一个额外的 [useLayoutEffect](https://zh-hans.reactjs.org/docs/hooks-reference.html#uselayouteffect "useLayoutEffect") Hook 来处理这类 effect。它和 `useEffect` 的结构相同，区别只是调用时机不同。

此外，从 React 18 开始，当它是离散的用户输入（如点击）的结果时，或者当它是由 [flushSync](https://zh-hans.reactjs.org/docs/react-dom.html#flushsync "flushSync") 包装的更新结果时，传递给 `useEffect` 的函数将在屏幕布局和绘制**之前**同步执行。这种行为便于事件系统或 [flushSync](https://zh-hans.reactjs.org/docs/react-dom.html#flushsync "flushSync") 的调用者观察该效果的结果。

> 注意
>
> 这只影响传递给 `useEffect` 的函数被调用时 — 在这些 effect 中执行的更新仍会被推迟。这与 [useLayoutEffect](https://zh-hans.reactjs.org/docs/hooks-reference.html#uselayouteffect "useLayoutEffect") 不同，后者会立即启动该函数并处理其中的更新。

即使在 `useEffect` 被推迟到浏览器绘制之后的情况下，它也能保证在任何新的渲染前启动。React 在开始新的更新前，总会先刷新之前的渲染的 effect。

effect 的条件执行

默认情况下，effect 会在每轮组件渲染完成后执行。这样的话，一旦 effect 的依赖发生变化，它就会被重新创建。

然而，在某些场景下这么做可能会矫枉过正。比如，在上一章节的订阅示例中，我们不需要在每次组件更新时都创建新的订阅，而是仅需要在 `source` prop 改变时重新创建。

要实现这一点，可以给 `useEffect` 传递第二个参数，它是 effect 所依赖的值数组。更新后的示例如下：

```jsx
useEffect(() => {const subscription = props.source.subscribe();return () => {      subscription.unsubscribe();    };  },  [props.source],);
```

此时，只有当 `props.source` 改变后才会重新创建订阅。

> 注意
>
> 如果你要使用此优化方式，请确保数组中包含了**所有外部作用域中会发生变化且在 effect 中使用的变量**，否则你的代码会引用到先前渲染中的旧变量。请参阅文档，了解更多关于[如何处理函数](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies "如何处理函数") 以及[数组频繁变化时的措施](https://zh-hans.reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often "数组频繁变化时的措施") 的内容。
>
> 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（`[]`）作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行。这并不属于特殊情况 —— 它依然遵循输入数组的工作方式。
>
> 如果你传入了一个空数组（`[]`），effect 内部的 props 和 state 就会一直持有其初始值。尽管传入 `[]` 作为第二个参数有点类似于 `componentDidMount` 和 `componentWillUnmount` 的思维模式，但我们有 [更好的](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies "更好的") [方式](https://zh-hans.reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often "方式") 来避免过于频繁的重复调用 effect。除此之外，请记得 React 会等待浏览器完成画面渲染之后才会延迟调用 `useEffect`，因此会使得处理额外操作很方便。
>
> 我们推荐启用 [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation "eslint-plugin-react-hooks") 中的 [exhaustive-deps](https://github.com/facebook/react/issues/14920 "exhaustive-deps") 规则。此规则会在添加错误依赖时发出警告并给出修复建议。

依赖项数组不会作为参数传给 effect 函数。虽然从概念上来说它表现为：所有 effect 函数中引用的值都应该出现在依赖项数组中。未来编译器会更加智能，届时自动创建数组将成为可能。

**`useRef`**

```
const refContainer = useRef(initialValue);
```

`useRef` 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数（`initialValue`）。返回的 ref 对象在组件的整个生命周期内持续存在。

一个常见的用例便是命令式地访问子组件：

```jsx
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` 指向已挂载到 DOM 上的文本输入元素
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

本质上，`useRef` 就像是可以在其 `.current` 属性中保存一个可变值的“盒子”。

你应该熟悉 ref 这一种[访问 DOM](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html "访问 DOM") 的主要方式。如果你将 ref 对象以 `<div ref={myRef} />` 形式传入组件，则无论该节点如何改变，React 都会将 ref 对象的 `.current` 属性设置为相应的 DOM 节点。

然而，`useRef()` 比 `ref` 属性更有用。它可以[很方便地保存任何可变值](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables "很方便地保存任何可变值")，其类似于在 class 中使用实例字段的方式。

这是因为它创建的是一个普通 Javascript 对象。而 `useRef()` 和自建一个 `{current: ...}` 对象的唯一区别是，`useRef` 会在每次渲染时返回同一个 ref 对象。

请记住，当 ref 对象内容发生变化时，`useRef` 并_不会_通知你。变更 `.current` 属性不会引发组件重新渲染。如果想要在 React 绑定或解绑 DOM 节点的 ref 时运行某些代码，则需要使用[回调 ref](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node "回调 ref") 来实现。

实现代码如下：

```jsx
 
import React, { useState, useEffect, useRef } from 'react'
import { Select } from 'antd';
const { Option } = Select;
function Index() {
 
    const prevCountRef = useRef();
    const [val, setVal] = useState("--")//name
    useEffect(() => {
        prevCountRef.current = val;
    });
 
    const handleChange = (value) => {
        setVal(value);
    };
 
 
    return (
        <div>
            <Select
                defaultValue="lucy"
                style={{
                    width: 120,
                }}
                onChange={handleChange}
            >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="disabled" disabled>
                    Disabled
                </Option>
                <Option value="Yiminghe">yiminghe</Option>
            </Select>
            <h1>现在的值: {val}, 之前的值: {prevCountRef.current}</h1>
        </div >
    )
}
 
export default Index
 
```

#### 如何获取上一轮的 props 或 state？官方的示例

```jsx
function Counter() {
  const [count, setCount] = useState(0);
 
  const prevCountRef = useRef();
  useEffect(() => {
    prevCountRef.current = count;
  });
  const prevCount = prevCountRef.current;
 
  return <h1>Now: {count}, before: {prevCount}</h1>;
}
```

### 11.setSate的缺点

调用时机不恰当的话可能引起循环调用的问题：比如在componentWillUpdate render componentDidUpdate调用都有可能引起这种问题
setState可能会引用不必要的re-render：setState任何值都会引起组件的render函数执行，可能导致性能的浪费

#### setState更新数组

你会发现，如果直接使用push等方法改变state，按理来说，push会改变原数组，数组应该更新，但渲染出来的state并不会更改

```js
let newValue = 1;
const [array, setArray] = useState([]);
const handleChange = (newValue: number) =>{
	array.push(newValue);
	setState(array);//array更新了，但无法触发渲染
	console.log(array);//[1]
	//array增加了newValue，但渲染并未发生改变
}

render:
<p>This array is {JSON.stringify(array)}</p> //[]
```

这是由于js中，数组的赋值是引用传递的，array.push相当于直接更改了数组对应的内存块，但react内部用于对比的array的内存并没有更改，是指向同一个内存的，setState只做shallow compare，因此没有触发re-render。
可以使用扩展运算符，创建一个新数组，更改内存引用

```js
const handleChange = (newValue: number) =>{
	const newArray = [...array, newValue];
	setState(newArray);//此处本质上是改变了引用
	console.log(array);//[]
	//array并未改变，但渲染改变了
}

render:
<p>This array is {JSON.stringify(array)}</p> //[1]
```

或者触发展示组件的re-render，这样即使不改变数组的引用，依然可以正确显示变动。

```js
const handleChange = (newValue: number) =>{
	setValue(newValue);
	setState(array.push(newValue));//其他更新触发了组件的re-render，此时可以正常显示变动
	console.log(array);//[1]
	//array改变，且渲染改变
}

render:
<p>This array is {JSON.stringify(array)}</p> //[1]
```

再给一个直观的例子（感谢我的同事@ling）
直接尝试：https://codepen.io/ling-cao/pen/NWrMRrq

```js
const { useRef, useEffect, useState } = React

const useMemoryState = (init) => {
  const [arr, setArr] = useState(init)
  const lastArrRef = useRef(null)
  const updateArr = next => {
    lastArrRef.current = [...arr];
    console.log(next);
    setArr(next)
  }
  return [arr, updateArr, lastArrRef.current]
}

let i = 0;
const App = () => {
  const [arr, setArr, lastArr] = useMemoryState([0])
  const [updateSign, setUpdateSign] = useState(false)
  
  return(
    <>
      <div className="text"><label>Current array :</label> {JSON.stringify(arr)}</div>
      <div className="box-container">
        <div className="box">
          <h1>Push a number to array</h1>
          <pre>setArr(arr.push(i) && arr)</pre>
          <br />
          <button
            onClick={() => {
              i++;
              setArr(arr.push(i) && arr)
            }}
            className="btn btn-2 btn-2c">
              Try it
           </button>
        </div>
        <div className="box">
          <h1>Push a number to array and renew array</h1> 
          <pre>setArr(arr.push(i) && [...arr])</pre>
          <br />
          <button
            onClick={() => {
              i++;
              setArr(arr.push(i) && [...arr])
            }}
            className="btn btn-2 btn-2c">
              Try it
           </button>
        </div>
        <div className="box">
          <h1>Push a number to array and update another state</h1>
          <pre>setArr(arr.push(i) && arr); setUpdateSign(x => !x)</pre>
          <br />
          <button
            onClick={() => {
              i++;
              {
                setArr(arr.push(i) && arr)
                setUpdateSign(x => !x)
              }
            }}
            className="btn btn-2 btn-2c">
              Try it
           </button>
        </div>
      </div>
      </>
  );
}
```

逐次点击第二个按钮或第三个按钮都可以正常更新渲染。

点击第一个按钮，通过console可以看出来，array数组值有更新，但没有渲染（Current array 没变）；再点其他两个按钮时，会把第一个按钮点击更新的结果一起渲染出来。
![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs1337511-20201220185158312-33093066.gif)

侧面展示并不是没有更新数组，而是更新后未渲染。

#### setState不会立即改变数据

setState某种意义上是类似于异步函数的。

```js
// name is ""
this.setState({
    name: "name"
})
console.log(`name is ${this.state.name}`)
```

这样写，name是不能正常显示。
最常用的办法就是使用回调函数

```js
this.setState({
    name: "name"
}, () => {
  console.log(`name is ${this.state.name}`)
})
```

#### 多个setState的更新

setState的“异步”是本身执行的过程和代码是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没办法立马拿到更新后的值，形成了所谓的异步。批量更新优化也是建立在“异步”之上的，如果对同一个值进行多次setState，setState的批量更新策略会对其进行覆盖，取最后一次执行；如果是同时setState多个不同的值，在更新时会对其合并批量更新。

#### setState异步回调获取不到最新值

```js
  useEffect(() => {
    const newModel = {
      name: props.name,
      datasetId: props.datasetId,
      modelId: null,
      trainingStatus: TrainingStatus.Init,
      modelStatus: Status.NotStarted,
    } as TrainingModel;
    setModels([...models, newModel]);
    startTraining(newModel);
  }, [props.datasetId]);

  const startTraining = async (newModel: TrainingModel) => {
    const dataset = await getDataset(newModel.datasetId);
    let newModels = [...models];
    let currModel = newModels.find(x => x.datasetId == newModels.datasetId);
    currModel.trainingStatus = TrainingStatus.CreateDataset;
    //此时可通过页面的渲染效果知道models中已有值，但此处断点models为空
    setModels(newModels);
  };
```

类似的，老生常谈的，在useEffect里面设置一个Interval，过了Interval time，也同样是useEffect更新时的state值，而得不到最新的state值。
为解决异步导致的获取不到最新state的问题，使用setState的回调函数获取state的当前最新值

```javascript
  const startTraining = async (newModel: TrainingModel) => {
    const dataset = await getDataset(newModel.datasetId);
      setModels(lastModels => { //此时的lastModels是models的最新值
        const nextModels = [...lastModels];
        let currModel = nextModels.find(x => x.datasetId == newModel.datasetId);
        currModel.trainingStatus = TrainingStatus.CreateDataset;
        return nextModels;
      });
  };
```

原因是，**组件内部的任何函数，包括事件处理函数和effect，都是从它被创建的那次渲染中被[看到]的**，也就是说，组件内部的函数拿到的总是定义它的那次渲染中的props和state。想要解决，一般两种方法，一种是上述的使用setState回调函数获取state最新值，一种是**使用ref**保存修改并读取state。

## 生命周期

### 1\.React的生命周期有哪些？



React15 生命周期

![image-20220710144706498](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsSmsniRfZalLIEdj.png)

React 通常将组件生命周期分为三个阶段：

-   装载阶段（Mount），组件第一次在DOM树中被渲染的过程；
-   更新过程（Update），组件状态发生变化，重新更新渲染的过程；
-   卸载过程（Unmount），组件从DOM树中被移除的过程；

![image-20220701205623153](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsp8JywQrYdEvAkUs.png)

#### 1）组件挂载阶段

挂载阶段组件被创建，然后组件实例插入到 DOM 中，完成组件的第一次渲染，该过程只会发生一次，在此阶段会依次调用以下这些方法：

-   constructor
-   getDerivedStateFromProps
-   render
-   componentDidMount

##### （1）constructor

组件的构造函数，第一个被执行，若没有显式定义它，会有**一个默认的构造函数**，但是若显式定义了构造函数，我们必须在构造函数中执行 `super(props)`，否则无法在构造函数中拿到this。

如果不初始化 state 或不进行方法绑定，则不需要为 React 组件实现构造函数**Constructor**。

constructor中通常只做两件事：

-   **初始化组件的 state**
-   **给事件处理方法绑定 this**

```jsx
constructor(props) {
  super(props);
  // 不要在构造函数中调用 setState，可以直接给 state 设置初始值
  this.state = { counter: 0 }
  this.handleClick = this.handleClick.bind(this)
}
```

##### （2）getDerivedStateFromProps

```jsx
static getDerivedStateFromProps(props, state)
```

这是个静态方法，所以不能在这个函数里使用 `this`，有两个参数 `props` 和 `state`，分别指接收到的新参数和当前组件的 `state` 对象，这个函数会返回一个对象用来更新当前的 `state` 对象，如果不需要更新可以返回 `null`。

该函数会在装载时，接收到新的 `props` 或者调用了 `setState` 和 `forceUpdate` 时被调用。如当接收到新的属性想修改 `state` ，就可以使用。

```jsx
// 当 props.counter 变化时，赋值给 state 
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      counter: 0
    }
  }
  static getDerivedStateFromProps(props, state) {
    if (props.counter !== state.counter) {
      return {
        counter: props.counter
      }
    }
    return null
  }
  
  handleClick = () => {
    this.setState({
      counter: this.state.counter + 1
    })
  }
  render() {
    return (
      <div>
        <h1 onClick={this.handleClick}>Hello, world!{this.state.counter}</h1>
      </div>
    )
  }
}
```

现在可以显式传入 `counter` ，但是这里有个问题，如果想要通过点击实现 `state.counter` 的增加，但这时会发现值不会发生任何变化，一直保持 `props` 传进来的值。这是由于在 React 16.4^ 的版本中 `setState` 和 `forceUpdate` 也会触发这个生命周期，所以当组件内部 `state` 变化后，就会重新走这个方法，同时会把 `state` 值赋值为 `props` 的值。因此需要多加一个字段来记录之前的 `props` 值，这样就会解决上述问题。具体如下：

```jsx
// 这里只列出需要变化的地方
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // 增加一个 preCounter 来记录之前的 props 传来的值
      preCounter: 0,
      counter: 0
    }
  }
  static getDerivedStateFromProps(props, state) {
    // 跟 state.preCounter 进行比较
    if (props.counter !== state.preCounter) {
      return {
        counter: props.counter,
        preCounter: props.counter
      }
    }
    return null
  }
  handleClick = () => {
    this.setState({
      counter: this.state.counter + 1
    })
  }
  render() {
    return (
      <div>
        <h1 onClick={this.handleClick}>Hello, world!{this.state.counter}</h1>
      </div>
    )
  }
}
```

##### （3）render

render是React 中最核心的方法，一个组件中必须要有这个方法，它会根据状态 `state` 和属性 `props` 渲染组件。这个函数只做一件事，就是返回需要渲染的内容，所以不要在这个函数内做其他业务逻辑，通常调用该方法会返回以下类型中一个：

-   **React 元素**：这里包括原生的 DOM 以及 React 组件；
-   **数组和 Fragment（片段）**：可以返回多个元素；
-   **Portals（插槽）**：可以将子元素渲染到不同的 DOM 子树种；
-   **字符串和数字**：被渲染成 DOM 中的 text 节点；
-   **布尔值或 null**：不渲染任何内容。

##### （4）componentDidMount()

componentDidMount()会在组件挂载后（插入 DOM 树中）立即调用。该阶段通常进行以下操作：

-   **执行依赖于DOM的操作；**
-   **发送网络请求；（官方建议）**
-   **添加订阅消息（会在componentWillUnmount取消订阅）；**

如果在 `componentDidMount` 中调用 `setState` ，就会触发一次额外的渲染，多调用了一次 `render` 函数，由于它是在浏览器刷新屏幕前执行的，所以用户对此是没有感知的，但是我应当避免这样使用，这样会带来一定的性能问题，尽量是在 `constructor` 中初始化 `state` 对象。

在组件装载之后，将计数数字变为1：

```jsx
class App extends React.Component  {
  constructor(props) {
    super(props)
    this.state = {
      counter: 0
    }
  }
  componentDidMount () {
    this.setState({
      counter: 1
    })
  }
  render ()  {
    return (
      <div className="counter">
        counter值: { this.state.counter }
      </div>
    )
  }
}
```

#### 2）组件更新阶段

当组件的 `props` 改变了，或组件内部调用了 `setState/forceUpdate`，会触发更新重新渲染，这个过程可能会发生多次。这个阶段会依次调用下面这些方法：

-   getDerivedStateFromProps
-   shouldComponentUpdate
-   render
-   getSnapshotBeforeUpdate
-   componentDidUpdate

##### （1）shouldComponentUpdate

```jsx
shouldComponentUpdate(nextProps, nextState)
```

在说这个生命周期函数之前，来看两个问题：

-   **setState 函数在任何情况下都会导致组件重新渲染吗？例如下面这种情况：**

```jsx
this.setState({number: this.state.number})
```

-   **如果没有调用 setState，props 值也没有变化，是不是组件就不会重新渲染？**

第一个问题答案是 **会** ，第二个问题如果是父组件重新渲染时，不管传入的 props 有没有变化，都会引起子组件的重新渲染。

那么有没有什么方法解决在这两个场景下不让组件重新渲染进而提升性能呢？这个时候 `shouldComponentUpdate` 登场了，这个生命周期函数是用来提升速度的，它是在重新渲染组件开始前触发的，默认返回 `true`，可以比较 `this.props` 和 `nextProps` ，`this.state` 和 `nextState` 值是否变化，来确认返回 true 或者 `false`。当返回 `false` 时，组件的更新过程停止，后续的 `render`、`componentDidUpdate` 也不会被调用。

**注意：** 添加 `shouldComponentUpdate` 方法时，不建议使用深度相等检查（如使用 `JSON.stringify()`），因为深比较效率很低，可能会比重新渲染组件效率还低。而且该方法维护比较困难，建议使用该方法会产生明显的性能提升时使用。

##### （2）getSnapshotBeforeUpdate

```jsx
getSnapshotBeforeUpdate(prevProps, prevState)
```

这个方法在 `render` 之后，`componentDidUpdate` 之前调用，有两个参数 `prevProps` 和 `prevState`，表示更新之前的 `props` 和 `state`，这个函数必须要和 `componentDidUpdate` 一起使用，并且要有一个返回值，默认是 `null`，这个返回值作为第三个参数传给 `componentDidUpdate`。

##### （3）componentDidUpdate

componentDidUpdate() 会在更新后会被立即调用，首次渲染不会执行此方法。 该阶段通常进行以下操作：

-   当组件更新后，对 DOM 进行操作；
-   如果你对更新前后的 props 进行了比较，也可以选择在此处进行网络请求；（例如，当 props 未发生变化时，则不会执行网络请求）。

```jsx
componentDidUpdate(prevProps, prevState, snapshot){}
```

该方法有三个参数：

-   prevProps: 更新前的props
-   prevState: 更新前的state
-   snapshot: getSnapshotBeforeUpdate()生命周期的返回值

#### 3）组件卸载阶段

卸载阶段只有一个生命周期函数，componentWillUnmount() 会在组件卸载及销毁之前直接调用。在此方法中执行必要的清理操作：

-   清除 timer，取消网络请求或清除
-   取消在 componentDidMount() 中创建的订阅等；

这个生命周期在一个组件被卸载和销毁之前被调用，因此你不应该再这个方法中使用 `setState`，因为组件一旦被卸载，就不会再装载，也就不会重新渲染。

#### 4）错误处理阶段

componentDidCatch(error, info)，此生命周期在后代组件抛出错误后被调用。 它接收两个参数∶

-   error：抛出的错误。
-   info：带有 componentStack key 的对象，其中包含有关组件引发错误的栈信息

React常见的生命周期如下：

![image-20220701210106222](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsQG5YaiAczNrgWol.png)

### 2.生命周期过程

#### React常见生命周期的过程大致如下：

-   挂载阶段，首先执行constructor构造方法，来创建组件
-   创建完成之后，就会执行render方法，该方法会返回需要渲染的内容
-   随后，React会将需要渲染的内容挂载到DOM树上
-   **挂载完成之后就会执行componentDidMount生命周期函数**
-   如果我们给组件创建一个props（用于组件通信）、调用setState（更改state中的数据）、调用forceUpdate（强制更新组件）时，都会重新调用render函数
-   render函数重新执行之后，就会重新进行DOM树的挂载
-   **挂载完成之后就会执行componentDidUpdate生命周期函数**
-   **当移除组件时，就会执行componentWillUnmount生命周期函数**

#### **React主要生命周期总结：**

1.  **getDefaultProps**：这个函数会在组件创建之前被调用一次（有且仅有一次），它被用来初始化组件的 Props；
2.  **getInitialState**：用于初始化组件的 state 值；
3.  **componentWillMount**：在组件创建后、render 之前，会走到 componentWillMount 阶段。这个阶段我个人一直没用过、非常鸡肋。后来React 官方已经不推荐大家在 componentWillMount 里做任何事情、到现在 **React16 直接废弃了这个生命周期**，足见其鸡肋程度了；
4.  **render**：这是所有生命周期中唯一一个你必须要实现的方法。一般来说需要返回一个 jsx 元素，这时 React 会根据 props 和 state 来把组件渲染到界面上；不过有时，你可能不想渲染任何东西，这种情况下让它返回 null 或者 false 即可；
5.  **componentDidMount**：会在组件挂载后（插入 DOM 树中后）立即调用，标志着组件挂载完成。一些操作如果依赖获取到 DOM 节点信息，我们就会放在这个阶段来做。此外，这还是 React 官方推荐的发起 ajax 请求的时机。该方法和 componentWillMount 一样，有且仅有一次调用。

### 3.React 性能优化在哪个生命周期？它优化的原理是什么？

react的父级组件的render函数重新渲染会引起子组件的render方法的重新渲染。但是，有的时候子组件的接受父组件的数据没有变动。子组件render的执行会影响性能，这时就可以使用**shouldComponentUpdate**来解决这个问题。

使用方法如下：

```jsx
shouldComponentUpdate(nexrProps) {
    if (this.props.num === nexrProps.num) {
        return false
    }
    return true;
}
```

shouldComponentUpdate提供了两个参数nextProps和nextState，表示下一次props和一次state的值，当函数返回false时候，render()方法不执行，组件也就不会渲染，返回true时，组件照常重渲染。此方法就是拿当前props中值和下一次props中的值进行对比，数据相等时，返回false，反之返回true。

需要注意，在进行新旧对比的时候，是浅对比,也就是说如果比较的数据时引用数据类型，只要数据的引用的地址没变，即使内容变了，也会被判定为true。

面对这个问题，可以使用如下方法进行解决： 

（1）使用setState改变数据之前，先采用ES6中assgin进行拷贝，但是assgin只深拷贝的数据的第一层，所以说不是最完美的解决办法：

```jsx
const o2 = Object.assign({},this.state.obj)
    o2.student.count = '00000';
    this.setState({
        obj: o2,
    })
```

（2）使用JSON.parse(JSON.stringfy())进行深拷贝，但是遇到数据为undefined和函数时就会错。

```jsx
const o2 = JSON.parse(JSON.stringify(this.state.obj))
    o2.student.count = '00000';
    this.setState({
        obj: o2,
    })
```

### 4.state 和 props 触发更新的生命周期分别有什么区别？

**state 更新流程：** 

<img src="https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsemzZkdM6cTqIhHN.png" alt="image-20220701210537329" style="zoom:67%;" />

这个过程当中涉及的函数：

1.  shouldComponentUpdate: 当组件的 state 或 props 发生改变时，都会首先触发这个生命周期函数。它会接收两个参数：nextProps, nextState——它们分别代表传入的新 props 和新的 state 值。拿到这两个值之后，我们就可以通过一些对比逻辑来决定是否有 re-render（重渲染）的必要了。如果该函数的返回值为 false，则生命周期终止，反之继续；

> 注意：此方法仅作为**性能优化的方式**而存在。不要企图依靠此方法来“阻止”渲染，因为这可能会产生 bug。应该**考虑使用内置的 PureComponent 组件**，而不是手动编写 `shouldComponentUpdate()`

2.  componentWillUpdate：当组件的 state 或 props 发生改变时，会在渲染之前调用 componentWillUpdate。componentWillUpdate **是 React16 废弃的三个生命周期之一**。过去，我们可能希望能在这个阶段去收集一些必要的信息（比如更新前的 DOM 信息等等），现在我们完全可以在 React16 的 getSnapshotBeforeUpdate 中去做这些事；
3.  componentDidUpdate：componentDidUpdate() 会在UI更新后会被立即调用。它接收 prevProps（上一次的 props 值）作为入参，也就是说在此处我们仍然可以进行 props 值对比.

### 5.React中发起网络请求应该在哪个生命周期中进行？为什么？

对于异步请求，最好放在componentDidMount中去操作，对于同步的状态改变，可以放在componentWillMount中，一般用的比较少。

如果认为在componentWillMount里发起请求能提早获得结果，这种想法其实是错误的，通常componentWillMount比componentDidMount早不了多少微秒，网络上任何一点延迟，这一点差异都可忽略不计。

**react的生命周期：** constructor() -> componentWillMount() -> render() -> componentDidMount()

上面这些方法的调用是有次序的，由上而下依次调用。

-   constructor被调用是在组件准备要挂载的最开始，此时组件尚未挂载到网页上。
-   componentWillMount方法的调用在constructor之后，在render之前，在这方法里的代码调用setState方法不会触发重新render，所以它一般不会用来作加载数据之用。
-   componentDidMount方法中的代码，是在组件已经完全挂载到网页上才会调用被执行，所以可以保证数据的加载。此外，在这方法中调用setState方法，会触发重新渲染。所以，官方设计这个方法就是用来加载外部数据用的，或处理其他的副作用代码。与组件上的数据无关的加载，也可以在constructor里做，但constructor是做组件state初绐化工作，并不是做加载数据这工作的，constructor里也不能setState，还有加载的时间太长或者出错，页面就无法加载出来。所以有副作用的代码都会集中在componentDidMount方法里。

总结：

-   跟服务器端渲染（同构）有关系，如果在componentWillMount里面获取数据，fetch data会执行两次，一次在服务器端一次在客户端。在componentDidMount中可以解决这个问题，componentWillMount同样也会render两次。
-   在componentWillMount中fetch data，数据一定在render后才能到达，如果忘记了设置初始状态，用户体验不好。
-   react16.0以后，componentWillMount可能会被执行多次。

### 6.React 16.X 中 props 改变后在哪个生命周期中处理

**在getDerivedStateFromProps中进行处理。**

这个生命周期函数是为了替代`componentWillReceiveProps`存在的，所以在需要使用`componentWillReceiveProps`时，就可以考虑使用`getDerivedStateFromProps`来进行替代。

两者的参数是不相同的，而`getDerivedStateFromProps`是一个静态函数，也就是这个函数不能通过this访问到class的属性，也并不推荐直接访问属性。而是应该通过参数提供的nextProps以及prevState来进行判断，根据新传入的props来映射到state。

需要注意的是，**如果props传入的内容不需要影响到你的state，那么就需要返回一个null**，这个返回值是必须的，所以尽量将其写到函数的末尾：

```jsx
static getDerivedStateFromProps(nextProps, prevState) {
    const {type} = nextProps;
    // 当传入的type发生变化的时候，更新state
    if (type !== prevState.type) {
        return {
            type,
        };
    }
    // 否则，对于state不进行任何操作
    return null;
}
```

### 7.React 16中新生命周期有哪些

关于 React16 开始应用的新生命周期： 

![image-20220701212035138](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsdT7qgQS41Liojhk.png)



 可以看出，React16 自上而下地对生命周期做了另一种维度的解读：

-   **Render 阶段**：用于计算一些必要的状态信息。这个阶段可能会被 React 暂停，这一点和 React16 引入的 Fiber 架构是有关的；
-   **Pre-commit阶段**：所谓“commit”，这里指的是“更新真正的 DOM 节点”这个动作。所谓 Pre-commit，就是说我在这个阶段其实还并没有去更新真实的 DOM，不过 DOM 信息已经是可以读取的了；
-   **Commit 阶段**：在这一步，React 会完成真实 DOM 的更新工作。Commit 阶段，我们可以拿到真实 DOM（包括 refs）。

与此同时，新的生命周期在流程方面，仍然遵循“挂载”、“更新”、“卸载”这三个广义的划分方式。它们分别对应到：

-   挂载过程：
    -   **constructor**
    -   **getDerivedStateFromProps**
    -   **render**
    -   **componentDidMount**
-   更新过程：
    -   **getDerivedStateFromProps**
    -   **shouldComponentUpdate**
    -   **render**
    -   **getSnapshotBeforeUpdate**
    -   **componentDidUpdate**
-   卸载过程：
    -   **componentWillUnmount**

### 8.React 废弃了哪些生命周期？为什么？

被废弃的三个函数都是在render之前，因为fiber的出现，很可能因为高优先级任务的出现而打断现有任务导致它们会被执行多次。另外的一个原因则是，React想约束使用者，好的框架能够让人不得已写出容易维护和扩展的代码，这一点又是从何谈起，可以从新增加以及即将废弃的生命周期分析入手

**1) `componentWillMount`**

首先这个函数的功能完全可以使用componentDidMount和 constructor来代替，异步获取的数据的情况上面已经说明了，而如果抛去异步获取数据，其余的即是初始化而已，这些功能都可以在constructor中执行，除此之外，如果在 willMount 中订阅事件，但在服务端这并不会执行 willUnMount事件，也就是说服务端会导致内存泄漏所以componentWilIMount完全可以不使用，但使用者有时候难免因为各 种各样的情况在 componentWilMount中做一些操作，那么React为了约束开发者，干脆就抛掉了这个API

**2) `componentWillReceiveProps`**

在老版本的 React 中，如果组件自身的某个 state 跟其 props 密切相关的话，一直都没有一种很优雅的处理方式去更新 state，而是需要在 componentWilReceiveProps 中判断前后两个 props 是否相同，如果不同再将新的 props更新到相应的 state 上去。这样做一来会破坏 state 数据的单一数据源，导致组件状态变得不可预测，另一方面也会增加组件的重绘次数。类似的业务需求也有很多，如一个可以横向滑动的列表，当前高亮的 Tab 显然隶属于列表自身的时，根据传入的某个值，直接定位到某个 Tab。为了解决这些问题，React引入了第一个新的生命周期：getDerivedStateFromProps。它有以下的优点∶

-   getDSFP是静态方法，在这里不能使用this，也就是一个纯函数，开发者不能写出副作用的代码
-   开发者只能通过prevState而不是prevProps来做对比，保证了state和props之间的简单关系以及不需要处理第一次渲染时prevProps为空的情况
-   基于第一点，将状态变化（setState）和昂贵操作（tabChange）区分开，更加便于 render 和 commit 阶段操作或者说优化。

**3) `componentWillUpdate`**

与 componentWillReceiveProps 类似，许多开发者也会在 componentWillUpdate 中根据 props 的变化去触发一些回调 。 但不论是 componentWilReceiveProps 还 是 componentWilUpdate，都有可能在一次更新中被调用多次，也就是说写在这里的回调函数也有可能会被调用多次，这显然是不可取的。与 componentDidMount 类 似， componentDidUpdate 也不存在这样的问题，一次更新中 componentDidUpdate 只会被调用一次，所以将原先写在 componentWillUpdate 中 的 回 调 迁 移 至 componentDidUpdate 就可以解决这个问题。

另外一种情况则是需要获取DOM元素状态，但是由于在fber中，render可打断，可能在wilMount中获取到的元素状态很可能与实际需要的不同，这个通常可以使用第二个新增的生命函数的解决 getSnapshotBeforeUpdate(prevProps, prevState)

4) `getSnapshotBeforeUpdate(prevProps, prevState)`

返回的值作为componentDidUpdate的第三个参数。与willMount不同的是，getSnapshotBeforeUpdate会在最终确定的render执行之前执行，也就是能保证其获取到的元素状态与didUpdate中获取到的元素状态相同。官方参考代码：

```jsx
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 我们是否在 list 中添加新的 items ？
    // 捕获滚动位置以便我们稍后调整滚动位置。
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 如果我们 snapshot 有值，说明我们刚刚添加了新的 items，
    // 调整滚动位置使得这些新 items 不会将旧的 items 推出视图。
    //（这里的 snapshot 是 getSnapshotBeforeUpdate 的返回值）
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...contents... */}</div>
    );
  }
}
```

## 组件通信

React组件间通信常见的几种情况:

-   父组件向子组件通信
-   子组件向父组件通信
-   跨级组件通信
-   非嵌套关系的组件通信

### 1.父子组件的通信方式？

在 React 中，**父子组件**的通信是常见的问题，除了使用状态管理工具（如`redux`）以外，也可以实现父子组件的相互通信。

其中，父组件可以通过`props`、**原型方法**向子组件通信，子组件可以通过**回调函数**、**事件冒泡**向父组件通信。

#### 父组件向子组件通信

#####  props

如下代码，`name`作为`props`由父组件传递给子组件，子组件拿到`name`后，渲染在页面上。

参数`name`由父组件传递给了子组件。

```javascript
import { useState } from 'react';

const Son = ({ name }) => {
    return <div>{name}</div>;
};

const Father = () => {
    const [name, setName] = useState('Jack');
    return (
        <>
            <Son name={name} />
        </>
    );
};

export default Father;
```

##### 原型方法

父组件通过`React.createRef()`创建`Ref`，保存在实例属性`myRef`上。父组件中，渲染子组件时，定义一个`Ref`属性，值为刚创建的`myRef`。

父组件调用子组件的`myFunc`函数，传递一个参数，子组件接收到参数，打印出参数。

参数从父组件传递给子组件，完成了父组件向子组件通信。

```javascript
import React, { Component, Fragment } from 'react';

class Son extends Component {
    myFunc(name) {
        console.log(name);
    }
    render() {
        return <></>;
    }
}

// 父组件
export default class Father extends Component {
    constructor(props) {
        super(props);
        // 创建Ref，并保存在实例属性myRef上
        this.myRef = React.createRef();
    }

    componentDidMount() {
        // 调用子组件的函数，传递一个参数
        this.myRef.current.myFunc('Jack');
    }
    render() {
        return (
            <>
                <Son ref={this.myRef} />
            </>
        );
    }
}
```

#### 子组件向父组件通信

##### 回调函数

如下代码所示，父组件显示当前计数值，但不通过父组件本身修改这个值。父组件给子组件传递一个**函数**，子组件点击按钮时，调用这个函数，实现计数值加一。

在子组件内部，修改了父组件中的值，从而完成了子组件向父组件通信。

```javascript
import { useState } from 'react';

const Son = ({ setCount }) => {
    return <button onClick={() => setCount(count => count + 1)}>点击+1</button>;
};

const Father = () => {
    const [count, setCount] = useState(0);
    return (
        <>
            <div>计数值：{count}</div>
            <Son setCount={setCount} />
        </>
    );
};

export default Father;
```

##### 事件冒泡

如下代码，利用了**事件冒泡**机制，点击子组件的`button`按钮，事件会冒泡到父组件身上，触发父组件的`onClick`函数，打印出`Jack`。

点击的是子组件，父组件执行函数，完成了子组件向父组件通信。

```javascript
const Son = () => {
    return <button>点击</button>;
};

const Father = () => {
    const sayName = name => {
        console.log(name);
    };
    return (
        <div onClick={() => sayName('Jack')}>
            <Son />
        </div>
    );
};

export default Father;
```

### 2\.跨级组件的通信方式？

父组件向子组件的子组件通信，向更深层子组件通信：

-   使用props，利用中间组件层层传递,但是如果父组件结构较深，那么中间每一层组件都要去传递props，增加了复杂度，并且这些props并不是中间组件自己需要的。
-   使用context，context相当于一个大容器，可以把要通信的内容放在这个容器中，这样不管嵌套多深，都可以随意取用，对于跨越多层的全局数据可以使用context实现。

```jsx
// context方式实现跨级组件通信 
// Context 设计目的是为了共享那些对于一个组件树而言是“全局”的数据
const BatteryContext = createContext();
//  子组件的子组件 
class GrandChild extends Component {
    render(){
        return (
            <BatteryContext.Consumer>
                {
                    color => <h1 style={{"color":color}}>我是红色的:{color}</h1>
                }
            </BatteryContext.Consumer>
        )
    }
}
//  子组件
const Child = () =>{
    return (
        <GrandChild/>
    )
}
// 父组件
class Parent extends Component {
      state = {
          color:"red"
      }
      render(){
          const {color} = this.state
          return (
          <BatteryContext.Provider value={color}>
              <Child></Child>
          </BatteryContext.Provider>
          )
      }
}
```

### 3\.非嵌套关系组件的通信方式？

即没有任何包含关系的组件，包括兄弟组件以及不在同一个父级中的非兄弟组件。

-   可以使用自定义事件通信（发布订阅模式）
-   可以通过redux等进行全局状态管理
-   如果是兄弟组件通信，可以找到这两个兄弟节点共同的父节点, 结合父子间通信方式进行通信。

### 4\.组件通信的方式有哪些

-   **⽗组件向⼦组件通讯**: ⽗组件可以向⼦组件通过传 props 的⽅式，向⼦组件进⾏通讯
-   **⼦组件向⽗组件通讯**: props+回调的⽅式，⽗组件向⼦组件传递props进⾏通讯，此props为作⽤域为⽗组件⾃身的函 数，⼦组件调⽤该函数，将⼦组件想要传递的信息，作为参数，传递到⽗组件的作⽤域中
-   **兄弟组件通信**: 找到这两个兄弟节点共同的⽗节点,结合上⾯两种⽅式由⽗节点转发信息进⾏通信
-   **跨层级通信**: Context 设计⽬的是为了共享那些对于⼀个组件树⽽⾔是“全局”的数据，例如当前认证的⽤户、主题或⾸选语⾔，对于跨越多层的全局数据通过 Context 通信再适合不过
-   **发布订阅模式**: 发布者发布事件，订阅者监听事件并做出反应,我们可以通过引⼊event模块进⾏通信
-   **全局状态管理⼯具**: 借助Redux或者Mobx等全局状态管理⼯具进⾏通信,这种⼯具会维护⼀个全局状态中⼼Store,并根据不同的事件产⽣新的状态

### 5\.如何解决 props 层级过深的问题

-   使用Context API：提供一种组件之间的状态共享，而不必通过显式组件树逐层传递props；
-   使用Redux等状态库。



## 路由

[React-Router 的 Hooks 实现(推荐阅读)](https://blog.csdn.net/hsany330/article/details/106198493)

[从零实现react-router](https://www.bilibili.com/video/av973312837/?vd_source=2f86d510fad313ff38cc4685adff7ab0)

### 1\.React-Router的实现原理是什么？

客户端路由实现的思想：

-   基于 hash 的路由：通过监听`hashchange`事件，感知 hash 的变化
    -   改变 hash 可以直接通过 location.hash=xxx
-   基于 H5 history 路由：
    -   改变 url 可以通过 history.pushState 和 resplaceState 等，会将URL压入堆栈，同时能够应用 `history.go()` 等 API
    -   监听 url 的变化可以通过自定义事件触发实现

**react-router 实现的思想：**

-   基于 `history` 库来实现上述不同的客户端路由实现思想，并且能够保存历史记录等，磨平浏览器差异，上层无感知
-   通过维护的列表，在每次 URL 发生变化的回收，通过配置的 路由路径，匹配到对应的 Component，并且 render

### 2\.如何配置 React-Router 实现路由切换

**（1）使用`<Route>` 组件**

路由匹配是通过比较 `<Route>` 的 path 属性和当前地址的 pathname 来实现的。当一个 `<Route>` 匹配成功时，它将渲染其内容，当它不匹配时就会渲染 null。没有路径的 `<Route>` 将始终被匹配。

```jsx
// when location = { pathname: '/about' }
<Route path='/about' component={About}/> // renders <About/>
<Route path='/contact' component={Contact}/> // renders null
<Route component={Always}/> // renders <Always/>
```

**（2）结合使用 `<Switch>` 组件和 `<Route>` 组件**

`<Switch>` 用于将 `<Route>` 分组。

```jsx
<Switch>
    <Route exact path="/" component={Home} />
    <Route path="/about" component={About} />
    <Route path="/contact" component={Contact} />
</Switch>
```

`<Switch>` 不是分组 `<Route>` 所必须的，但他通常很有用。 一个 `<Switch>` 会遍历其所有的子 `<Route>`元素，并仅渲染与**当前地址匹配的第一个元素**。

**（3）使用 `<Link>、 <NavLink>、<Redirect>` 组件**

`<Link>` 组件来在你的应用程序中创建链接。无论你在何处渲染一个`<Link>` ，都会在应用程序的 HTML 中渲染锚（`<a>`）。

```jsx
<Link to="/">Home</Link>   
// <a href='/'>Home</a>
```

是一种特殊类型的 当它的 to属性与当前地址匹配时，可以将其定义为"活跃的"。

```jsx
// location = { pathname: '/react' }
<NavLink to="/react" activeClassName="hurray">
    React
</NavLink>
// <a href='/react' className='hurray'>React</a>
```

当我们想强制导航时，可以渲染一个`<Redirect>`，当一个`<Redirect>`渲染时，它将使用它的to属性进行定向。

### 3\.React-Router怎么设置重定向？

使用`<Redirect>`组件实现路由的重定向：

```jsx
<Switch>
  <Redirect from='/users/:id' to='/users/profile/:id'/>
  <Route path='/users/profile/:id' component={Profile}/>
</Switch>
```

当请求 `/users/:id` 被重定向去 `'/users/profile/:id'`：

-   属性 `from: string`：需要匹配的将要被重定向路径。
-   属性 `to: string`：重定向的 URL 字符串
-   属性 `to: object`：重定向的 location 对象
-   属性 `push: bool`：若为真，重定向操作将会把新地址加入到访问历史记录里面，并且无法回退到前面的页面。

### 4\.react-router 里的 Link 标签和 a 标签的区别

从最终渲染的 DOM 来看，这两者都是链接，都是 标签，区别是∶ `<Link>`是react-router 里实现路由跳转的链接，一般配合`<Route>` 使用，react-router接管了其默认的链接跳转行为，区别于传统的页面跳转，`<Link>` 的“跳转”行为只会触发相匹配的`<Route>`对应的页面内容更新，而不会刷新整个页面。

`<Link>`做了3件事情:

-   有onclick那就执行onclick
-   click的时候阻止a标签默认事件
-   根据跳转href(即是to)，用history (web前端路由两种方式之一，history & hash)跳转，此时只是链接变了，并没有刷新页面而`<a>`标签就是普通的超链接了，用于从当前页面跳转到href指向的另一 个页面(非锚点情况)。

a标签默认事件禁掉之后做了什么才实现了跳转?

```jsx
let domArr = document.getElementsByTagName('a')
[...domArr].forEach(item=>{
    item.addEventListener('click',function () {
        location.href = this.href
    })
})
```

### 5\.React-Router如何获取URL的参数和历史对象？

**（1）获取URL的参数**

-   **get传值**

路由配置还是普通的配置，如：`'admin'`，传参方式如：`'admin?id='1111''`。通过`this.props.location.search`获取url获取到一个字符串`'?id='1111'` 可以用url，qs，querystring，浏览器提供的api URLSearchParams对象或者自己封装的方法去解析出id的值。

-   **动态路由传值**

路由需要配置成动态路由：如`path='/admin/:id'`，传参方式，如`'admin/111'`。通过`this.props.match.params.id` 取得url中的动态路由id部分的值，除此之外还可以通过`useParams（Hooks）`来获取

-   **通过query或state传值**

传参方式如：在Link组件的to属性中可以传递对象`{pathname:'/admin',query:'111',state:'111'};`。通过`this.props.location.state`或`this.props.location.query`来获取即可，传递的参数可以是对象、数组等，但是存在缺点就是只要刷新页面，参数就会丢失。

**（2）获取历史对象**

-   如果React >= 16.8 时可以使用 React Router中提供的Hooks

```jsx
import { useHistory } from "react-router-dom";
let history = useHistory();
```

2.使用this.props.history获取历史对象

```jsx
let history = this.props.history;
```

### 6\.React-Router 4怎样在路由变化时重新渲染同一个组件？

当路由变化时，即组件的props发生了变化，会调用componentWillReceiveProps等生命周期钩子。那需要做的只是： 当路由改变时，根据路由，也去请求数据：

```jsx
class NewsList extends Component {
  componentDidMount () {
     this.fetchData(this.props.location);
  }
  
  fetchData(location) {
    const type = location.pathname.replace('/', '') || 'top'
    this.props.dispatch(fetchListData(type))
  }
  componentWillReceiveProps(nextProps) {
     if (nextProps.location.pathname != this.props.location.pathname) {
         this.fetchData(nextProps.location);
     } 
  }
  render () {
    ...
  }
}
```

利用生命周期componentWillReceiveProps，进行重新render的预处理操作。

### 7\.React-Router的路由有几种模式？

React-Router 支持使用 hash（对应 HashRouter）和 browser（对应 BrowserRouter） 两种路由规则， react-router-dom 提供了 BrowserRouter 和 HashRouter 两个组件来实现应用的 UI 和 URL 同步：

-   BrowserRouter 创建的 URL 格式：[xxx.com/path](https://link.juejin.cn/?target=http%3A%2F%2Fxxx.com%2Fpath "http://xxx.com/path")
-   HashRouter 创建的 URL 格式：[xxx.com/#/path](https://link.juejin.cn/?target=http%3A%2F%2Fxxx.com%2F%23%2Fpath "http://xxx.com/#/path")

**（1）BrowserRouter**

它使用 HTML5 提供的 history API（pushState、replaceState 和 popstate 事件）来保持 UI 和 URL 的同步。由此可以看出，**BrowserRouter 是使用 HTML 5 的 history API 来控制路由跳转的：**

```jsx
<BrowserRouter
    basename={string}
    forceRefresh={bool}
    getUserConfirmation={func}
    keyLength={number}
/>
```

**其中的属性如下：**

-   basename 所有路由的基准 URL。basename 的正确格式是前面有一个前导斜杠，但不能有尾部斜杠；

```jsx
<BrowserRouter basename="/calendar">
    <Link to="/today" />
</BrowserRouter>
```

等同于

```jsx
<a href="/calendar/today" />
```

-   forceRefresh 如果为 true，在导航的过程中整个页面将会刷新。一般情况下，只有在不支持 HTML5 history API 的浏览器中使用此功能；
-   getUserConfirmation 用于确认导航的函数，默认使用 window.confirm。例如，当从 /a 导航至 /b 时，会使用默认的 confirm 函数弹出一个提示，用户点击确定后才进行导航，否则不做任何处理；

```jsx
// 这是默认的确认函数
const getConfirmation = (message, callback) => {
  const allowTransition = window.confirm(message);
  callback(allowTransition);
}
<BrowserRouter getUserConfirmation={getConfirmation} />
```

> 需要配合`<Prompt>` 一起使用。

-   KeyLength 用来设置 Location.Key 的长度。

**（2）HashRouter**

使用 URL 的 hash 部分（即 window.location.hash）来保持 UI 和 URL 的同步。由此可以看出，**HashRouter 是通过 URL 的 hash 属性来控制路由跳转的：**

```jsx
<HashRouter
    basename={string}
    getUserConfirmation={func}
    hashType={string}  
/>
```

**其参数如下**：

-   basename, getUserConfirmation 和 `BrowserRouter` 功能一样；
-   hashType window.location.hash 使用的 hash 类型，有如下几种：
    -   slash - 后面跟一个斜杠，例如 #/ 和 #/sunshine/lollipops；
    -   noslash - 后面没有斜杠，例如 # 和 #sunshine/lollipops；
    -   hashbang - Google 风格的 ajax crawlable，例如 #!/ 和 #!/sunshine/lollipops。

### 8\.React-Router 4的Switch有什么用？

Switch 通常被用来包裹 Route，用于渲染与路径匹配的第一个子 `<Route>` 或 `<Redirect>`，它里面不能放其他元素。

假如不加 `<Switch>` ：

```jsx
import { Route } from 'react-router-dom'

<Route path="/" component={Home}></Route>
<Route path="/login" component={Login}></Route>
```

Route 组件的 path 属性用于匹配路径，因为需要匹配 `/` 到 `Home`，匹配 `/login` 到 `Login`，所以需要两个 Route，但是不能这么写。这样写的话，当 URL 的 path 为 “/login” 时，`<Route path="/" />`和`<Route path="/login" />` 都会被匹配，因此页面会展示 Home 和 Login 两个组件。这时就需要借助 `<Switch>` 来做到只显示一个匹配组件：

```jsx
import { Switch, Route} from 'react-router-dom'
    
<Switch>
    <Route path="/" component={Home}></Route>
    <Route path="/login" component={Login}></Route>
</Switch>
```

此时，再访问 “/login” 路径时，却只显示了 Home 组件。这是就用到了exact属性，它的作用就是精确匹配路径，经常与`<Switch>` 联合使用。只有当 URL 和该 `<Route>` 的 path 属性完全一致的情况下才能匹配上：

```jsx
import { Switch, Route} from 'react-router-dom'
   
<Switch>
   <Route exact path="/" component={Home}></Route>
   <Route exact path="/login" component={Login}></Route>
</Switch>
```

### 9.Router Hooks的使用

Router hooks 可以让我们更加容易地访问到 `history`,`location`,路由参数 等等

#### useHistory

`useHistory` 帮助我们直接访问到`history`,而不再需要通过 props 访问

```tsx
import { useHistory } from "react-router-dom";

const Contact = () => {
  const history = useHistory();
  return (
    <Fragment>
      <h1>Contact</h1>
      <button onClick={() => history.push("/")}>Go to home</button>
    </Fragment>
  );
};
```

#### useParams

`useParams` 帮助我们直接访问到路由参数,而不再需要通过 props 访问

```tsx
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  useParams,
} from "react-router-dom";

export default function App() {
  const name = "John Doe";
  return (
    <Router>
      <main>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to={`/about/${name}`}>About</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about/:name" component={About} />
        </Switch>
      </main>
    </Router>
  );
}

const About = () => {
  const { name } = useParams();
  return (
    // props.match.params.name
    <Fragment>
      {name !== "John Doe" ? <Redirect to="/" /> : null}
      <h1>About {name}</h1>
      <Route component={Contact} />
    </Fragment>
  );
};
```

#### useLocation

`useLocation` 会返回当前 URL 的 location 对象

```tsx
import { useLocation } from "react-router-dom";

const Contact = () => {
  const { pathname } = useLocation();

  return (
    <Fragment>
      <h1>Contact</h1>
      <p>Current URL: {pathname}</p>
    </Fragment>
  );
};
```



## 状态管理

### 1\.对Redux的理解，主要解决了什么问题

React是视图层框架。Redux是一个用来**管理数据状态和UI状态的JavaScript应用工具**。随着JavaScript单页应用（SPA）开发日趋复杂， JavaScript需要管理比任何时候都要多的state（状态）， Redux就是降低管理难度的。（Redux支持React、Angular、jQuery甚至纯JavaScript）。

在 React 中，UI 以组件的形式来搭建，组件之间可以嵌套组合。但 React 中组件间通信的数据流是单向的，顶层组件可以通过 props 属性向下层组件传递数据，而下层组件不能向上层组件传递数据，兄弟组件之间同样不能。这样简单的单向数据流支撑起了 React 中的数据可控性。

**当项目越来越大的时候，管理数据的事件或回调函数将越来越多，也将越来越不好管理。管理不断变化的 state 非常困难。如果一个 model 的变化会引起另一个 model 变化，那么当 view 变化时，就可能引起对应 model 以及另一个 model 的变化，依次地，可能会引起另一个 view 的变化**。直至你搞不清楚到底发生了什么。state 在什么时候，由于什么原因，如何变化已然不受控制。 当系统变得错综复杂的时候，想重现问题或者添加新功能就会变得举步维艰。如果这还不够糟糕，考虑一些来自前端开发领域的新需求，如更新调优、服务端渲染、路由跳转前请求数据等。state 的管理在大项目中相当复杂。

Redux 提供了一个叫 store 的统一仓储库，**组件通过 dispatch 将 state 直接传入store，不用通过其他的组件。并且组件通过 subscribe 从 store获取到 state 的改变。使用了 Redux，所有的组件都可以从 store 中获取到所需的 state，他们也能从store 获取到 state 的改变**。这比组件之间互相传递数据清晰明朗的多。

为什么要使用单向数据流的方式，因为前端项目有大多数是mvc 或者是mvvm架构。这种架构有什么缺点，有一个很大的缺点就是 当业务复杂度变得越来越高的时候，因为允许view 层和model层 直接传递。因为model可能不止对应一个view 层，就会出现下图这样的情况：

![image-20220920221818343](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/image-20220920221818343.png)

从图上看数据流这是混乱的，如果项目中出现bug就很难定位到到底是哪一步出现问题，所以Redux的核心是**单向数据流， 因为视图更新就是从store通知视图更新**

**主要解决的问题：** **单纯的Redux只是一个状态机，是没有UI呈现的，react- redux作用是将Redux的状态机和React的UI呈现绑定在一起**，当你dispatch action改变state的时候，会自动更新页面。

### 2.Redux与React-Redux

redux 是一个应用数据流框架，主要是解决了组件间状态共享的问题，原理是集中式管理。

React-redux是为方便react使用，在redux上封装的库。在实际的项目中我们可以使用redux也可以直接使用react-redux。

#### 1.redux

##### 1.redux的概念

redux和react之间是没有关系的，Redux支持React、angular、jQuery甚至Javascript

redux 是一个应用数据流框架，主要是解决了组件间状态共享的问题，原理是集中式管理，主要有三个核心方法，`action，store，reducer`

**(1)单一数据源**

**(2)state是只读的**

唯一改变state的方法就是触发action,action是一个用于描述已经发生事件的普通对象

```js
store.dispatch({type:'COMPLETE_TODO',index:1})
```

**(3)使用纯函数来执行修改**

为了描述action如何修改state tree，你需要去编写reducers

Reducers只是一些纯函数，它接收先前的state和action,并且返回新的state.可以复用、可以控制顺序、传入附加参数

##### 2.redux的组成

state:就是我们传递的数据，可以分为三类：DomainData、UI State、App State

**(1)Action:**将我们的数据从应用传递到store的载体，它是store数据的唯一来源。我们可通过store.dispatch()将action传递给store

```js
{
 type:'USE_LIST',//必须字段
 list:{...}
 }
// action只是描述有事件发生，并不更新state

//action的创建函数
function addAction(params){
	return{
		type:'add',
		...params
	}
}
```

**(2)Reducer:**本质是一个函数，用来响应发送过来的actions,经处理将state发生给store

接收两个参数：一是初始化state,二是action

```js
const initState = {...}
rootReducer = (state = initState,action)=>{...return{...}}
```

**(3)Store**作为action和reducer的桥梁

```js
import {createStore} from 'redux'
const store = createStore(传递reducer)
```

拥有以下属性和方法：

| State     | 应用的数据状态                      |
| --------- | ----------------------------------- |
| getState  | 获取数据状态                        |
| Dispatch  | 发送action                          |
| Subscribe | 注册监听，Subscribe的返回值注销监听 |

redux的使用例子：

**1.创建store/index.js**

store就是保存数据的地方，可以看作是一个容器。

```js
import { createStore } from "redux";
//导入已经创建的reducer
import {reducer} from '../reducer'
export default createStore(reducer)
```

**2.创建action/index.js**

Action 就是 View 发出的通知，表示 State 应该要发生变化了。

Action 是一个对象。其中的`type`属性是必须的，表示 Action 的名称。其他属性可以自由设置.

```js
const sendAction = ()=>{
    return {
        type:'send_action',
        value:'发送了某个数据——--'
    }
}
module.exports = {
    sendAction
}
```

**3.创建reducer/index.js**

store 收到 action 以后，会给一个新的 State，这样 View 才会发生变化。这种 State 的计算过程就叫做 Reducer。

```js
//第一个参数为state,我们可以定义默认值，然后进行赋值
//在函数中判断第二个参数action的type值是否是我们发送的，是则通过return返回新的state,
//将reducer导出
/**
 * 专门处理发送过来的action
 */
const reducer = (state={value:'默认值'},action)=>{
    console.log('reducer',state,action)
    switch (action.type) {
        case 'send_action':
            return Object.assign({},state,action)
        default:
            return state;
    }
}

module.exports = {
    reducer
}
```

**4.在组件中的使用**

```js
import { Button } from "antd";
import React, {Component}  from "react";
import store from "../../store";
import {sendAction} from "../../action"
class UrlList extends Component{
    constructor(props){
        super(props)
        //也可以使用箭头函数哈
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(){
         const action = sendAction()
         store.dispatch(action)
    }
    //当组件加载完毕来监听
    componentDidMount () {
        console.log(this.context.router)
         store.subscribe(()=>{
         //通过store.getState().value来获取state中的值
             console.log('subscribe',store.getState().value)
             this.setState({})
         })
    }
   
    render(){
        return (
            <>
               <Button onClick={this.handleClick}>按钮发送</Button>
                <h1>{store.getState().value}</h1>
            </>
        )
    }

}
export default Com

```

#### 2.react-redux

React-redux中的两个核心成员：Provider、Connect

Provider:这个组件使得整个app都能获取到store中的数据

Connect:使得**组件能够跟store关联**

##### provider

- Provider包装在根组件的最外层，使得所有组件都可以拿到state
- Provider接收state作为props,通过context往下传递，这样react中任何组件都可以通过context获取store

##### connect

- Provider 内部组件如果想要使用到state中的数据，就必须要connect进行层包裹封装，换-句话来说就是必须要被connect进行加强
- connect 就是方便我们组件能够获取到store中的state

##### 使用

###### （1）react-redux的安装：

yarn add redux

yarn add react-redux

###### （2）构建store和reducer

1.创建reducer/index.js文件，构建reducer来响应actions

```react
//render/index.js
//一、state 二、action
let initState={
    count:0
}
exports.reducer = (state = initState, action) => {
    switch (action.type) {
        case 'send_action':
            return {
                count:state.count+1
            }
        default:
            return state;
    }
}
```

2.创建store/index.js文件，通过createStore方法，把我们的reducer传入进来

```react
import { createStore } from "redux";
//导入已经创建的reducer
import {reducer} from '../reducer'
export default createStore(reducer)
```

###### (3)Provider的实现

1.导入Provider组件，在react-redux中进行导入

2.需要利用Provider组件，对我们整个结构进行包裹

3.给我们Provider组件设置store的属性，而这个属性值是通过createStore构建出的store实例对象

```react
import './App.css';
import ComA from './pages/ComA'
import ComB from './pages/ComB'
import store from "./store";
import { Provider } from 'react-redux';
function App() {
  return (
    <Provider store={store}>
          <ComA/>
          <ComB/>
      </Provider>
  );
}

export default App;
```

###### (4)connect

对connect简单分析一下

mapStateToProps方法：`connect` 的第一个参数传入的，而且会在每次`store`中的state改变时调用。用户获取state 中的数据,必须有返回值（普通对象）。

| 参数     | 备注                |
| -------- | ------------------- |
| state    | 必传                |
| ownProps | 非必传，自己的props |

mapDispatchToProps：`connect` 的第二个参数传入的，用于将操作分配给store.

`dispatch` 是 Redux store 的一个函数。你调用 store.dispatch 来调度一个动作。这是触发状态更改的唯一方法。

第三个是要加强的组件

```js
Connect(mapStateToProps,mapDispatchToProps)(要加强的组件)
```

##### 案例：

我们实现从在ComB中点击按钮+1,在ComA中获取+1后的值。

所以说ComB是发送方，ComA是接收方。

实现步骤：

1.导入connect

2.利用connect对组件进行加强

```react
import React, {Component}  from "react";
import {connect} from 'react-redux'
class ComB extends Component{
    handleClick=()=>{
        console.log('ComB',this.props)
        this.props.sendAction()
    }

    render(){
        return (
            <>
            <button onClick={this.handleClick}>按钮+1</button>
            </>
        )
    }

}
const mapDispatchToProps = (dispatch)=>{
    return {
      //将sendAction注册到ComB的props中，然后就直接在ComB中直接使用this.props.sendAction()
        sendAction:()=>{
            dispatch({
                type:'send_action'
            })
        }
    }
}

export default connect(null,mapDispatchToProps)(ComB)
//connect(null,mapDispatchToProps)(ComB)

第一个参数：要接收的函数
第二个参数：要发送action的函数
第三个参数：后面的括号里面是要加强的组件
```

3.在ComA的组件方法中可以通过this.props拿到sendAction

```react
import React, {Component}  from "react";
import { connect } from "react-redux";

class ComA extends Component{
    render(){
        console.log('Home render',this.props)
        return (
            <>
           <div>
           {this.props.count}
           </div>
            </>
        )
    }

}
const mapstateToProps = (state)=>{
    console.log('Home',state)
    return state;
}
export default connect(mapstateToProps)(ComA)
//简写：
//export default connect((state)=>state)(ComA)
```

大概总结一下整个流程：
![在这里插入图片描述](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/674b80c5fdac4f2f9e6252590b22276f.png)

### 3.Redux原理及工作流程

![redux原理图](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsredux%E5%8E%9F%E7%90%86%E5%9B%BE.png)

#### **（1）原理** 

Redux源码主要分为以下几个模块文件

-   compose.js 提供从右到左进行函数式编程
-   createStore.js 提供作为生成唯一store的函数
-   combineReducers.js 提供合并多个reducer的函数，保证store的唯一性
-   bindActionCreators.js 可以让开发者在不直接接触dispacth的前提下进行更改state的操作
-   applyMiddleware.js 这个方法通过中间件来增强dispatch的功能

```jsx
const actionTypes = {
    ADD: 'ADD',
    CHANGEINFO: 'CHANGEINFO',
}

const initState = {
    info: '初始化',
}

export default function initReducer(state=initState, action) {
    switch(action.type) {
        case actionTypes.CHANGEINFO:
            return {
                ...state,
                info: action.preload.info || '',
            }
        default:
            return { ...state };
    }
}

export default function createStore(reducer, initialState, middleFunc) {

    if (initialState && typeof initialState === 'function') {
        middleFunc = initialState;
        initialState = undefined;
    }

    let currentState = initialState;

    const listeners = [];

    if (middleFunc && typeof middleFunc === 'function') {
        // 封装dispatch 
        return middleFunc(createStore)(reducer, initialState);
    }

    const getState = () => {
        return currentState;
    }

    const dispatch = (action) => {
        currentState = reducer(currentState, action);

        listeners.forEach(listener => {
            listener();
        })
    }

    const subscribe = (listener) => {
        listeners.push(listener);
    }

    return {
        getState,
        dispatch,
        subscribe
    }
}

```

#### **（2）工作流程**

-   const store= createStore（fn）生成数据;
-   action: {type: Symble('action01), payload:'payload' }定义行为;
-   dispatch发起action：store.dispatch(doSomething('action001'));
-   reducer：处理action，返回新的state;

**通俗点解释：**

-   首先，用户（通过View）发出Action，发出方式就用到了dispatch方法
-   然后，Store自动调用Reducer，并且传入两个参数：当前State和收到的Action，Reducer会返回新的State
-   State—旦有变化，Store就会调用监听函数，来更新View
-   

以 store 为核心，可以把它看成数据存储中心，但是他要更改数据的时候不能直接修改，数据修改更新的角色由Reducers来担任，store只做存储，中间人，当Reducers的更新完成以后会通过store的订阅来通知react component，组件把新的状态重新获取渲染，组件中也能主动发送action，创建action后这个动作是不会执行的，所以要dispatch这个action，让store通过reducers去做更新React Component 就是react的每个组件。

#### 单向数据流

![Redux数据流向图](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/8/170b7ee3c499efaa~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

图中容易看出所有的东西都是以store为核心,我们把它看成数据存储中心,但是他要更改数据的时候不能直接修改,数据修改**更新的角色由Reducers来担任**,	**store只做存储,中间人**,当**Reducers的更新完成**以后会通过**store的订阅来通知react component** ,组件获取新的状态，进行重新渲染,组件中我们也能**主动发送action,**创建action后这个动作是不会执行的,所以要dispatch这个action,让**store通过reducers去做更新** React Component 就是react的每个组件





### 4.Redux中异步的请求怎么处理



可以在 componentDidmount 中直接进⾏请求⽆须借助redux。但是在⼀定规模的项⽬中,上述⽅法很难进⾏异步流的管理,通常情况下我们会借助**redux的异步中间件**进⾏异步处理。redux异步流中间件其实有很多，当下主流的异步中间件有两种redux-thunk、redux-saga。

#### **使用react-thunk中间件**

**redux-thunk**优点:

-   体积⼩: redux-thunk的实现⽅式很简单,只有不到20⾏代码
-   使⽤简单: redux-thunk没有引⼊像redux-saga或者redux-observable额外的范式,上⼿简单

**redux-thunk**缺陷:

-   样板代码过多: 与redux本身⼀样,通常⼀个请求需要⼤量的代码,⽽且很多都是重复性质的
-   耦合严重: 异步操作与redux的action偶合在⼀起,不⽅便管理
-   功能孱弱: 有⼀些实际开发中常⽤的功能需要⾃⼰进⾏封装

使用步骤：

-   配置中间件，在store的创建中配置

```jsx
import {createStore, applyMiddleware, compose} from 'redux';
import reducer from './reducer';
import thunk from 'redux-thunk'

// 设置调试工具
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
// 设置中间件
const enhancer = composeEnhancers(
  applyMiddleware(thunk)
);

const store = createStore(reducer, enhancer);

export default store;
```

-   添加一个返回函数的actionCreator，将异步请求逻辑放在里面

```jsx
/**
  发送get请求，并生成相应action，更新store的函数
  @param url {string} 请求地址
  @param func {function} 真正需要生成的action对应的actionCreator
  @return {function} 
*/
// dispatch为自动接收的store.dispatch函数 
export const getHttpAction = (url, func) => (dispatch) => {
    axios.get(url).then(function(res){
        const action = func(res.data)
        dispatch(action)
    })
}
```

-   生成action，并发送action

```jsx
componentDidMount(){
    var action = getHttpAction('/getData', getInitTodoItemAction)
    // 发送函数类型的action时，该action的函数体会自动执行
    store.dispatch(action)
}
```

#### **使用redux-saga中间件**

**redux-saga**优点:

-   异步解耦: 异步操作被被转移到单独 saga.js 中，不再是掺杂在 action.js 或 component.js 中
-   action摆脱thunk function: dispatch 的参数依然是⼀个纯粹的 action (FSA)，⽽不是充满 “⿊魔法” thunk function
-   异常处理: 受益于 generator function 的 saga 实现，代码异常/请求失败 都可以直接通过 try/catch 语法直接捕获处理
-   功能强⼤: redux-saga提供了⼤量的Saga 辅助函数和Effect 创建器供开发者使⽤,开发者⽆须封装或者简单封装即可使⽤
-   灵活: redux-saga可以将多个Saga可以串⾏/并⾏组合起来,形成⼀个⾮常实⽤的异步flow
-   易测试，提供了各种case的测试⽅案，包括mock task，分⽀覆盖等等

**redux-saga**缺陷:

-   额外的学习成本: redux-saga不仅在使⽤难以理解的 generator function,⽽且有数⼗个API,学习成本远超redux-thunk,最重要的是你的额外学习成本是只服务于这个库的,与redux-observable不同,redux-observable虽然也有额外学习成本但是背后是rxjs和⼀整套思想
-   体积庞⼤: 体积略⼤,代码近2000⾏，min版25KB左右
-   功能过剩: 实际上并发控制等功能很难⽤到,但是我们依然需要引⼊这些代码
-   ts⽀持不友好: yield⽆法返回TS类型

redux-saga可以捕获action，然后执行一个函数，那么可以把异步代码放在这个函数中，使用步骤如下：

-   配置中间件

```jsx
import {createStore, applyMiddleware, compose} from 'redux';
import reducer from './reducer';
import createSagaMiddleware from 'redux-saga'
import TodoListSaga from './sagas'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
const sagaMiddleware = createSagaMiddleware()

const enhancer = composeEnhancers(
  applyMiddleware(sagaMiddleware)
);

const store = createStore(reducer, enhancer);
sagaMiddleware.run(TodoListSaga)

export default store;
```

-   将异步请求放在sagas.js中

```jsx
import {takeEvery, put} from 'redux-saga/effects'
import {initTodoList} from './actionCreator'
import {GET_INIT_ITEM} from './actionTypes'
import axios from 'axios'

function* func(){
    try{
        // 可以获取异步返回数据
        const res = yield axios.get('/getData')
        const action = initTodoList(res.data)
        // 将action发送到reducer
        yield put(action)
    }catch(e){
        console.log('网络请求失败')
    }
}

function* mySaga(){
    // 自动捕获GET_INIT_ITEM类型的action，并执行func
    yield takeEvery(GET_INIT_ITEM, func)
}

export default mySaga
```

-   发送action

```jsx
componentDidMount(){
  const action = getInitTodoItemAction()
  store.dispatch(action)
}
```

#### 总结

使用redux-thunk，当我们返回的是函数时，store会帮我们调用这个返回的函数，并且把dispatch暴露出来供我们使用。**对于redux-thunk的整个流程来说，它是等异步任务执行完成之后，我们再去调用dispatch，然后去store去调用reduces**

![image-20220927214653024](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/image-20220927214653024.png)

使用了redux-saga，当我们dispatch的action类型不在reducer中时，redux-saga的监听函数`takeEvery`就会监听到，等异步任务有结果就执行`put`方法，相当于`dispatch`，再一次触发dispatch。**对于redux-saga的整个流程来说，它是等执行完action和reducer之后，判断reducer中有没有这个action**



![image-20220927214704531](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/image-20220927214704531.png)

总结来看，**redux-thunk和redux-saga处理异步任务的时机不一样。对于redux-saga，相对于在redux的action基础上，重新开辟了一个 async action的分支，单独处理异步任务**

saga 自己基本上完全弄了一套 asyc 的事件监听机制，代码量大大增加，从我自己的使用体验来看 redux-thunk 更简单，和 redux 本身联系地更紧密。尤其是整个生态都向函数式编程靠拢的今天，redux-thunk 的高阶函数看上去更加契合这个闭环

### 5.Redux 怎么实现属性传递，原理是什么

react-redux 数据传输∶ view-->action-->reducer-->store-->view。看下点击事件的数据是如何通过redux传到view上：

-   view 上的AddClick 事件通过mapDispatchToProps 把数据传到action ---> click:()=>dispatch(ADD)
-   action 的ADD 传到reducer上
-   reducer传到store上 const store = createStore(reducer);
-   store再通过 mapStateToProps 映射穿到view上text:State.text

代码示例∶

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
class App extends React.Component{
    render(){
        let { text, click, clickR } = this.props;
        return(
            <div>
                <div>数据:已有人{text}</div>
                <div onClick={click}>加人</div>
                <div onClick={clickR}>减人</div>
            </div>
        )
    }
}
const initialState = {
    text:5
}
const reducer = function(state,action){
    switch(action.type){
        case 'ADD':
            return {text:state.text+1}
        case 'REMOVE':
            return {text:state.text-1}
        default:
            return initialState;
    }
}

let ADD = {
    type:'ADD'
}
let Remove = {
    type:'REMOVE'
}

const store = createStore(reducer);

let mapStateToProps = function (state){
    return{
        text:state.text
    }
}

let mapDispatchToProps = function(dispatch){
    return{
        click:()=>dispatch(ADD),
        clickR:()=>dispatch(Remove)
    }
}

const App1 = connect(mapStateToProps,mapDispatchToProps)(App);

ReactDOM.render(
    <Provider store = {store}>
        <App1></App1>
    </Provider>,document.getElementById('root')
)
```

### 6.Redux 中间件是什么？接受几个参数？柯里化函数两端的参数具体是什么？

Redux 的中间件提供的是**位于 action 被发起之后，到达 reducer 之前的扩展点**，换而言之，原本 view -→> action -> reducer -> store 的数据流加上中间件后变成了 view -> action -> middleware -> reducer -> store ，在这一环节可以做一些"副作用"的操作，如异步请求、打印日志等。

applyMiddleware源码：

```jsx
export default function applyMiddleware(...middlewares) {
    return createStore => (...args) => {
        // 利用传入的createStore和reducer和创建一个store
        const store = createStore(...args)
        let dispatch = () => {
            throw new Error()
        }
        const middlewareAPI = {
            getState: store.getState,
            dispatch: (...args) => dispatch(...args)
        }
        // 让每个 middleware 带着 middlewareAPI 这个参数分别执行一遍
        const chain = middlewares.map(middleware => middleware(middlewareAPI))
        // 接着 compose 将 chain 中的所有匿名函数，组装成一个新的函数，即新的 dispatch
        dispatch = compose(...chain)(store.dispatch)
        return {
            ...store,
            dispatch
        }
    }
}
```

从applyMiddleware中可以看出∶

-   redux中间件**接受一个对象作为参数，对象的参数上有两个字段 dispatch 和 getState，分别代表着 Redux Store 上的两个同名函数**。
-   柯里化函数两端一个是 middewares，一个是store.dispatch

### 7.Redux 请求中间件如何处理并发

**使用redux-Saga** redux-saga是一个管理redux应用异步操作的中间件，用于代替 redux-thunk 的。它通过创建 Sagas 将所有异步操作逻辑存放在一个地方进行集中处理，以此将react中的同步操作与异步操作区分开来，以便于后期的管理与维护。 redux-saga如何处理并发：

-   **takeEvery**

可以让多个 saga 任务并行被 fork 执行。

```jsx
import {
    fork,
    take
} from "redux-saga/effects"

const takeEvery = (pattern, saga, ...args) => fork(function*() {
    while (true) {
        const action = yield take(pattern)
        yield fork(saga, ...args.concat(action))
    }
})
```

-   **takeLatest**

takeLatest 不允许多个 saga 任务并行地执行。一旦接收到新的发起的 action，它就会取消前面所有 fork 过的任务（如果这些任务还在执行的话）。 在处理 AJAX 请求的时候，如果只希望获取最后那个请求的响应， takeLatest 就会非常有用。

```jsx
import {
    cancel,
    fork,
    take
} from "redux-saga/effects"

const takeLatest = (pattern, saga, ...args) => fork(function*() {
    let lastTask
    while (true) {
        const action = yield take(pattern)
        if (lastTask) {
            yield cancel(lastTask) // 如果任务已经结束，则 cancel 为空操作
        }
        lastTask = yield fork(saga, ...args.concat(action))
    }
})

```

### 8.Redux 状态管理器和变量挂载到 window 中有什么区别

两者都是存储数据以供后期使用。但是Redux状态更改可回溯——Time travel，数据多了的时候可以很清晰的知道改动在哪里发生，完整的提供了一套状态管理模式。

随着 JavaScript 单页应用开发日趋复杂，JavaScript 需要管理比任何时候都要多的 state （状态）。 这些 state 可能包括服务器响应、缓存数据、本地生成尚未持久化到服务器的数据，也包括 UI状态，如激活的路由，被选中的标签，是否显示加载动效或者分页器等等。

管理不断变化的 state 非常困难。如果一个 model 的变化会引起另一个 model 变化，那么当 view 变化时，就可能引起对应 model 以及另一个model 的变化，依次地，可能会引起另一个 view 的变化。直至你搞不清楚到底发生了什么。state 在什么时候，由于什么原因，如何变化已然不受控制。 当系统变得错综复杂的时候，想重现问题或者添加新功能就会变得举步维艰。 如果这还不够糟糕，考虑一些来自前端开发领域的新需求，如更新调优、服务端渲染、路由跳转前请求数据等等。前端开发者正在经受前所未有的复杂性，难道就这么放弃了吗?当然不是。

这里的复杂性很大程度上来自于：我们总是将两个难以理清的概念混淆在一起：变化和异步。 可以称它们为曼妥思和可乐。如果把二者分开，能做的很好，但混到一起，就变得一团糟。一些库如 React 视图在视图层禁止异步和直接操作 DOM来解决这个问题。美中不足的是，React 依旧把处理 state 中数据的问题留给了你。Redux就是为了帮你解决这个问题。

### 9.Redux 中间件是怎么拿到store 和 action? 然后怎么处理?

1.redux中间件本质就是一个函数柯里化。redux applyMiddleware Api 源码中每个middleware 接受2个参数， Store 的**getState 函数和dispatch 函数，**分别获得**store和action，最终返回一个函数**。

2.该函数会被传入 next 的**下一个 middleware 的 dispatch 方法**，并**返回一个接收 action 的新函数，这个函数可以直接调用 next（action）**，或者在其他需要的时刻调用，甚至根本不去调用它。

3.调用链中最后一个 middleware 会接受**真实的 store的 dispatch 方法**作为 next 参数，并借此结束调用链。所以，middleware 的函数签名是（{ getState，dispatch })=> next => action。

### 10.Redux中的connect有什么作用

connect负责连接React和Redux

**（1）获取state**

connect 通过 context获取 Provider 中的 store，通过 `store.getState()` 获取整个store tree 上所有state

**（2）包装原组件**

将state和action通过props的方式传入到原组件内部 wrapWithConnect 返回—个 ReactComponent 对 象 Connect，Connect 重 新 render 外部传入的原组件 WrappedComponent ，并把 connect 中传入的 mapStateToProps，mapDispatchToProps与组件上原有的 props合并后，通过属性的方式传给WrappedComponent

**（3）监听store tree变化**

connect缓存了store tree中state的状态，通过当前state状态 和变更前 state 状态进行比较，从而确定是否调用 `this.setState()`方法触发Connect及其子组件的重新渲染

### 11.Redux 和 Vuex 有什么区别，它们的共同思想

**（1）Redux 和 Vuex区别**

-   Vuex改进了Redux中的Action和Reducer函数，以mutations变化函数取代Reducer，无需switch，只需在对应的mutation函数里改变state值即可
-   Vuex由于Vue自动重新渲染的特性，无需订阅重新渲染函数，只要生成新的State即可
-   Vuex数据流的顺序是∶View调用store.commit提交对应的请求到Store中对应的mutation函数->store改变（vue检测到数据变化自动渲染）

通俗点理解就是，vuex 弱化 dispatch，通过commit进行 store状态的一次更变；取消了action概念，不必传入特定的 action形式进行指定变更；弱化reducer，基于commit参数直接对数据进行转变，使得框架更加简易;

**（2）共同思想**

-   单—的数据源
-   变化可以预测

本质上∶ redux与vuex都是对mvvm思想的服务，将数据从视图中抽离的一种方案。

### 12.mobx的使用

#### 响应式对象

MobX 通过 `makeObservable` 方法来构造响应式对象，传入的对象属性会通过  `Proxy` 代理，与 Vue 类似，在 6.0 版本之前使用的是   `Object.defineProperty`  API，当然 6.0 也提供了降级方案。

```js
import { configure, makeObservable, observable, action, computed } from 'mobx'

// 使用该配置，可以将 Proxy 降级为 Object.defineProperty
configure({ useProxies: "never" });

// 构造响应对象
const store = makeObservable(
  // 需要代理的响应对象
  {
    count: 0,
    get double() {
      return this.count * 2
    },
    increment() {
      this.count += 1
    },
    decrement() {
      this.count -= 1
    }
  },
  // 对各个属性进行包装，用于标记该属性的作用
  {
    count: observable, // 需要跟踪的响应属性
    double: computed,  // 计算属性
    increment: action, // action 调用后，会修改响应对象
    decrement: action, // action 调用后，会修改响应对象
  }
)
```

我们在看看之前版本的 MobX，使用装饰器的写法：

```js
class Store {
  @observable count = 0
  constructor() {
    makeObservable(this)
  }
  @action increment() {
    this.count++;
  }
  @action decrement() {
    this.count--;
  }
  @computed get double() {
    return this.count * 2
  }
}

const store = new Store()
```

这么看起来，好像写法并没有得到什么简化，好像比写装饰器还要复杂点。下面我们看看 6.0 版本一个更强大的 API：`makeAutoObservable`。

`makeAutoObservable` 是一个更强大的 `makeObservable`，可以自动为属性加上对象的包装函数，上手成本直线下降。

```js
import { makeAutoObservable } from 'mobx'

const store = makeAutoObservable({
  count: 0,
  get double() {
    return this.count * 2
  },
  increment() {
    this.count += 1
  },
  decrement() {
    this.count -= 1
  }
})
```

#### 计算属性

MobX 的属性与 Vue 的 `computed` 一样，在 `makeAutoObservable` 中就是一个 `getter`，`getter` 依赖的值一旦发生变化，`getter` 本身的返回值也会跟随变化。

```js
import { makeAutoObservable } from 'mobx'

const store = makeAutoObservable({
  count: 0,
  get double() {
    return this.count * 2
  }
})
```

当 `store.count` 为 1 时，调用 `store.double` 会返回 2。

#### 修改行为

当我们需要修改 store 上的响应属性时，我们可以通过直接重新赋值的方式修改，但是这样会得到 MobX 的警告⚠️。

```js
const store = makeAutoObservable({
  count: 0
});

document.getElementById("increment").onclick = function () {
  store.count += 1
}
```

![warn](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb4328c95ca9477b8df74bfa5d484bd9~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

MobX 会提示，在修改响应式对象的属性时，需要通过 action 的方式修改。虽然直接修改也能生效，但是这样会让 MobX 状态的管理比较混乱，而且将状态修改放到 action 中，能够让 MobX 在内部的事务流程中进行修改，以免拿到的某个属性还处于中间态，最后计算的结果不够准确。

`makeAutoObservable` 中的所有方法都会被处理成 **action**。

```js
import { makeAutoObservable } from 'mobx'

const store = makeAutoObservable({
  count: 0,
  get double() {
    return this.count * 2
  },
  increment() { // action
    this.count += 1
  },
  decrement() { // action
    this.count -= 1
  }
})
```

不同于 Vuex，将状态的修改划分为 mutation 和 action，同步修改放到 mutation 中，异步的操作放到 action 中。在 MobX 中，不管是同步还是异步操作，都可以放到 action 中，只是异步操作在修改属性时，需要将赋值操作放到 `runInAction` 中。

```js
import { runInAction, makeAutoObservable } from 'mobx'

const store = makeAutoObservable({
  count: 0,
  async initCount() {
    // 模拟获取远程的数据
    const count = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(10)
      }, 500)
    })
    // 获取数据后，将赋值操作放到 runInAction 中
    runInAction(() => {
      this.count = count
    })
  }
})

store.initCount()
```

如果不调用 `runInAction` ，则可以直接调用本身已经存在的 action。

```js
import { runInAction, makeAutoObservable } from 'mobx'

const store = makeAutoObservable({
  count: 0,
  setCount(count) {
    this.count = count
  },
  async initCount() {
    // 模拟获取远程的数据
    const count = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(10)
      }, 500)
    })
    // 获取数据后，调用已有的 action
    this.setCount(count)
  }
})

store.initCount()
```

#### 监听对象变更

无论是在 React 还是在小程序中想要引入 MobX，都需要在对象变更的时候，通知调用原生的 `setState/setData` 方法，将状态同步到视图上。

通过 `autorun` 方法可以实现这个能力，我们可以把 `autorun` 理解为 React Hooks 中的 `useEffect`。每当 store 的响应属性发生修改时，传入 `autorun` 的方法（`effect`）就会被调用一次。

```js
import { autorun, makeAutoObservable } from 'mobx'

const store = makeAutoObservable({
  count: 0,
  setCount(count) {
    this.count = count
  },
  increment() {
    this.count++
  },
  decrement() {
    this.count--
  }
})

document.getElementById("increment").onclick = function () {
  store.count++
}

const $count = document.getElementById("count")
$count.innerText = `${store.count}`
autorun(() => {
  $count.innerText = `${store.count}`
})

```

每当  `button#increment` 按钮被点击的时候，`span#count` 内的值就会自动进行同步。👉[查看完整代码](https://link.juejin.cn?target=https%3A%2F%2Fcodesandbox.io%2Fembed%2Fmobx6-d9bex)。

![效果演示](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/prm9iBeoZyjOEHh.webp)

除了 `autorun` ，MobX 还提供了更精细化的监听方法：`reaction`、 `when`。

```js
const store = makeAutoObservable({
  count: 0,
  setCount(count) {
    this.count = count
  },
  increment() {
    this.count++
  },
  decrement() {
    this.count--
  }
})

// store 发生修改立即调用 effect
autorun(() => {
  $count.innerText = `${store.count}`
});

// 第一个方法的返回值修改后才会调用后面的 effect
reaction(
  // 表示 store.count 修改后才会调用
  () => store.count,
  // 第一个参数为当前值，第二个参数为修改前的值
  // 有点类似与 Vue 中的 watch
  (value, prevValue) => {
    console.log('diff', value - prevValue)
  }
);

// 第一个方法的返回值为真，立即调用后面的 effect
when(() => store.count > 10, () => {
  console.log(store.count)
})
// when 方法还能返回一个 promise
(async function() {
  await when(() => store.count > 10)
  console.log('store.count > 10')
})()
```



#### mobox 和 redux 有什么区别？

**（1）共同点**

-   为了解决状态管理混乱，无法有效同步的问题统一维护管理应用状态;
-   某一状态只有一个可信数据来源（通常命名为store，指状态容器）;
-   操作更新状态方式统一，并且可控（通常以action方式提供更新状态的途径）;
-   支持将store与React组件连接，如react-redux，mobx- react;

**（2）区别** Redux更多的是遵循Flux模式的一种实现，是一个 JavaScript库，它关注点主要是以下几方面∶

- Action∶ 一个JavaScript对象，描述动作相关信息，主要包含type属性和payload属性∶

  ```jsx
  o type∶ action 类型; o payload∶ 负载数据;
  ```

- Reducer∶ 定义应用状态如何响应不同动作（action），如何更新状态;

- Store∶ 管理action和reducer及其关系的对象，主要提供以下功能∶

  ```jsx
  o 维护应用状态并支持访问状态(getState());
  o 支持监听action的分发，更新状态(dispatch(action)); 
  o 支持订阅store的变更(subscribe(listener));
  ```

- 异步流∶ 由于Redux所有对store状态的变更，都应该通过action触发，异步任务（通常都是业务或获取数据任务）也不例外，而为了不将业务或数据相关的任务混入React组件中，就需要使用其他框架配合管理异步任务流程，如redux-thunk，redux-saga等;

Mobx是一个透明函数响应式编程的状态管理库，它使得状态管理简单可伸∶

-   Action∶定义改变状态的动作函数，包括如何变更状态;
-   Store∶ 集中管理模块状态（State）和动作(action)
-   Derivation（衍生）∶ 从应用状态中派生而出，且没有任何其他影响的数据

**对比总结：**

-   redux将数据保存在单一的store中，mobx将数据保存在分散的多个store中
-   redux使用plain object保存数据，需要手动处理变化后的操作;mobx适用observable保存数据，数据变化后自动处理响应的操作
-   redux使用不可变状态，这意味着状态是只读的，不能直接去修改它，而是应该返回一个新的状态，同时使用纯函数;mobx中的状态是可变的，可以直接对其进行修改
-   mobx相对来说比较简单，在其中有很多的抽象，mobx更多的使用面向对象的编程思维;redux会比较复杂，因为其中的函数式编程思想掌握起来不是那么容易，同时需要借助一系列的中间件来处理异步和副作用
-   mobx中有更多的抽象和封装，调试会比较困难，同时结果也难以预测;而redux提供能够进行时间回溯的开发工具，同时其纯函数以及更少的抽象，让调试变得更加的容易

### 13.dva的使用

[一文彻底搞懂 DvaJS 原理](https://juejin.cn/post/6963466553601835044)

#### Dva 是什么

dva 首先是一个基于[redux](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Freduxjs%2Fredux)和[redux-saga](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fredux-saga%2Fredux-saga)的数据流方案，然后为了简化开发体验，dva 还额外内置了[react-router](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FReactTraining%2Freact-router)和[fetch](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fgithub%2Ffetch)，所以也可以理解为一个轻量级的应用框架。

#### Dva 解决的问题

> 经过一段时间的自学或培训，大家应该都能理解 redux 的概念，并认可这种数据流的控制可以让应用更可控，以及让逻辑更清晰。但随之而来通常会有这样的疑问：概念太多，并且 reducer, saga, action 都是分离的（分文件）。

- 文件切换问题。redux 的项目通常要分 reducer, action, saga, component 等等，他们的分目录存放造成的文件切换成本较大。
- 不便于组织业务模型 (或者叫 domain model) 。比如我们写了一个 userlist 之后，要写一个 productlist，需要复制很多文件。
- saga 创建麻烦，每监听一个 action 都需要走 fork -> watcher -> worker 的流程
- entry 创建麻烦。可以看下这个[redux entry](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fant-design%2Fantd-init%2Fblob%2Fmaster%2Fboilerplates%2Fredux%2Fsrc%2Fentries%2Findex.js)的例子，除了 redux store 的创建，中间件的配置，路由的初始化，Provider 的 store 的绑定，saga 的初始化，还要处理 reducer, component, saga 的 HMR 。这就是真实的项目应用 redux 的例子，看起来比较复杂。

#### Dva 的优势

- **易学易用**，仅有 6 个 api，对 redux 用户尤其友好，[配合 umi 使用](https://link.juejin.cn?target=https%3A%2F%2Fumijs.org%2Fguide%2Fwith-dva.html)后更是降低为 0 API
- **elm 概念**，通过 reducers, effects 和 subscriptions 组织 model
- **插件机制**，比如[dva-loading](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdvajs%2Fdva%2Ftree%2Fmaster%2Fpackages%2Fdva-loading)可以自动处理 loading 状态，不用一遍遍地写 showLoading 和 hideLoading
- **支持 HMR**，基于[babel-plugin-dva-hmr](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdvajs%2Fbabel-plugin-dva-hmr)实现 components、routes 和 models 的 HMR

#### Dva 的劣势

- **未来不确定性高。**[dva@3 前年提出计划后，官方几乎不再维护](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdvajs%2Fdva%2Fissues%2F2208)。

- 对于绝大多数不是特别复杂的场景来说，**目前可以被 Hooks 取代**

#### Dva 的适用场景

- 业务场景：组件间通信多，业务复杂，需要引入状态管理的项目
- 技术场景：使用 React Class Component 写的项目

#### Dva 核心概念

- **基于 Redux 理念的数据流向**。 用户的交互或浏览器行为通过 dispatch 发起一个 action，如果是同步行为会直接通过 Reducers 改变 State，如果是异步行为（可以称为副作用）会先触发 Effects 然后流向 Reducers 最终改变 State。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/ErdIJVQkACnvy1W.webp)

- **基于 Redux 的基本概念**。包括：
  - State 数据，通常为一个 JavaScript 对象，操作的时候每次都要当作不可变数据（immutable data）来对待，保证每次都是全新对象，没有引用关系，这样才能保证 State 的独立性，便于测试和追踪变化。
  - Action 行为，一个普通 JavaScript 对象，它是改变 State 的唯一途径。
  - dispatch，一个用于触发 action 改变 State 的函数。
  - Reducer 描述如何改变数据的纯函数，接受两个参数：已有结果和 action 传入的数据，通过运算得到新的 state。
  - Effects（Side Effects） 副作用，常见的表现为异步操作。dva 为了控制副作用的操作，底层引入了[redux-sagas](https://link.juejin.cn?target=http%3A%2F%2Fsuperraytin.github.io%2Fredux-saga-in-chinese)做异步流程控制，由于采用了[generator 的相关概念](https://link.juejin.cn?target=http%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2015%2F04%2Fgenerator.html)，所以将异步转成同步写法，从而将 effects 转为纯函数。
  - Connect 一个函数，绑定 State 到 View
- **其他概念**
  - Subscription，订阅，从**源头**获取数据，然后根据条件 dispatch 需要的 action，概念来源于[elm](https://link.juejin.cn?target=https%3A%2F%2Felm-lang.org%2Fnews%2Ffarewell-to-frp)。数据源可以是当前的时间、服务器的 websocket 连接、keyboard 输入、geolocation 变化、history 路由变化等等。
  - Router，前端路由，dva 实例提供了 router 方法来控制路由，使用的是[react-router](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Freactjs%2Freact-router)。
  - Route Components，跟数据逻辑无关的组件。通常需要 connect Model 的组件都是 Route Components，组织在/routes/目录下，而/components/目录下则是纯组件（Presentational Components，详见[组件设计方法](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdvajs%2Fdva-docs%2Fblob%2Fmaster%2Fv1%2Fzh-cn%2Ftutorial%2F04-%E7%BB%84%E4%BB%B6%E8%AE%BE%E8%AE%A1%E6%96%B9%E6%B3%95.md)）

#### Dva 应用最简结构

##### 不带 Model

```js
import dva from 'dva';
const App = () => <div>Hello dva</div>;
// 创建应用
const app = dva();
// 注册视图
app.router(() => <App />);
// 启动应用
app.start('#root');
```

##### 带 Model

```js
// 创建应用
const app = dva();
app.use(createLoading()) // 使用插件
// 注册 Model
app.model({
  namespace: 'count',
  state: 0,
  reducers: {
    add(state) { return state + 1 },
  },
  effects: {
    *addAfter1Second(action, { call, put }) {
      yield call(delay, 1000);
      yield put({ type: 'add' });
    },
  },
});
// 注册视图
app.router(() => <ConnectedApp />);
// 启动应用
app.start('#root');
```

#### Dva底层原理和部分关键实现

##### 背景介绍

1. 整个 dva 项目使用 lerna 管理的，在每个 package 的 package.json 中找到模块对应的入口文件，然后查看对应源码。
2. dva 是个函数，返回一了个 app 的对象。
3. 目前 dva 的源码核心部分包含两部分，dva 和 dva-core。前者用高阶组件 React-redux 实现了 view 层，后者是用 redux-saga 解决了 model 层。

##### [dva](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdvajs%2Fdva%2Fblob%2Fmaster%2Fpackages%2Fdva%2Fsrc%2Findex.js)

dva 做了三件比较重要的事情：

1. 代理 router 和 start 方法，实例化 app 对象
2. 调用 dva-core 的 start 方法，同时渲染视图
3. 使用 react-redux 完成了 react 到 redux 的连接。

```js
// dva/src/index.js
export default function (opts = {}) {
  // 1. 使用 connect-react-router 和 history 初始化 router 和 history
  // 通过添加 redux 的中间件 react-redux-router，强化了 history 对象的功能
 const history = opts.history || createHashHistory();
  const createOpts = {
    initialReducer: {
      router: connectRouter(history),
    },
    setupMiddlewares(middlewares) {
      return [routerMiddleware(history), ...middlewares];
    },
    setupApp(app) {
      app._history = patchHistory(history);
    },
  };
  // 2. 调用 dva-core 里的 create 方法 ，函数内实例化一个 app 对象。
 const app = create(opts, createOpts);
  const oldAppStart = app.start;
  // 3. 用自定义的 router 和 start 方法代理
 app.router = router;
  app.start = start;
  return app;
  // 3.1 绑定用户传递的 router 到 app._router
 function router(router) {
    invariant(
      isFunction(router),
      `[app.router] router should be function, but got ${typeof router}`,
    );
    app._router = router;
  }
  // 3.2 调用 dva-core 的 start 方法，并渲染视图
 function start(container) {
    // 对 container 做一系列检查，并根据 container 找到对应的DOM节点
    if (!app._store) {
      oldAppStart.call(app);
    }
    const store = app._store;
    // 为HMR暴露_getProvider接口
 // ref: https://github.com/dvajs/dva/issues/469
 app._getProvider = getProvider.bind(null, store, app);
    // 渲染视图
 if (container) {
      render(container, store, app, app._router);
      app._plugin.apply('onHmr')(render.bind(null, container, store, app));
    } else {
      return getProvider(store, this, this._router);
    }
  }
}
function getProvider(store, app, router) {
  const DvaRoot = extraProps => (
    <Provider store={store}>{router({ app, history: app._history, ...extraProps })}</Provider>
  );
  return DvaRoot;
}
function render(container, store, app, router) {
  const ReactDOM = require('react-dom'); // eslint-disable-line
 ReactDOM.render(React.createElement(getProvider(store, app, router)), container);

}
```

我们同时可以发现 app 是通过 create(opts, createOpts)进行初始化的，其中 opts 是暴露给使用者的配置，createOpts 是暴露给开发者的配置，真实的 create 方法在 dva-core 中实现

##### [dva-core](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdvajs%2Fdva%2Fblob%2Fmaster%2Fpackages%2Fdva-core%2Fsrc%2Findex.js)

dva-core 则完成了核心功能：

1. 通过 create 方法完成 app 实例的构造，并暴露 use、model 和 start 三个接口
2. 通过 start 方法完成

- store 的初始化
- models 和 effects 的封装，收集并运行 sagas
- 运行所有的 model.subscriptions
- 暴露 app.model、app.unmodel、app.replaceModel 三个接口

dva-core create

**作用：** 完成 app 实例的构造，并暴露 use、model 和 start 三个接口

```js
// dva-core/src/index.js
const dvaModel = {
  namespace: '@@dva',
  state: 0,
  reducers: {
    UPDATE(state) {
      return state + 1;
    },
  },
};
export function create(hooksAndOpts = {}, createOpts = {}) {
  const { initialReducer, setupApp = noop } = createOpts; // 在dva/index.js中构造了createOpts对象
  const plugin = new Plugin(); // dva-core中的插件机制，每个实例化的dva对象都包含一个plugin对象
  plugin.use(filterHooks(hooksAndOpts)); // 将dva(opts)构造参数opts上与hooks相关的属性转换成一个插件
  const app = {
    _models: [prefixNamespace({ ...dvaModel })],
    _store: null,
    _plugin: plugin,
    use: plugin.use.bind(plugin), // 暴露的use方法，方便编写自定义插件
    model, // 暴露的model方法，用于注册model
    start, // 原本的start方法，在应用渲染到DOM节点时通过oldStart调用
  };
  return app;
}
```

dva-core start

**作用：**

1. 封装models 和 effects ，收集并运行 sagas
2. 完成store 的初始化
3. 运行所有的model.subscriptions
4. 暴露app.model、app.unmodel、app.replaceModel三个接口

```js
function start() {
  const sagaMiddleware = createSagaMiddleware();
  const promiseMiddleware = createPromiseMiddleware(app);
  app._getSaga = getSaga.bind(null);
  const sagas = [];
  const reducers = { ...initialReducer };
  for (const m of app._models) {
    // 把每个 model 合并为一个reducer，key 是 namespace 的值，value 是 reducer 函数
    reducers[m.namespace] = getReducer(m.reducers, m.state, plugin._handleActions);
    if (m.effects) {
      // 收集每个 effects 到 sagas 数组
      sagas.push(app._getSaga(m.effects, m, onError, plugin.get('onEffect'), hooksAndOpts));
    }
  }
  // 初始化 Store
  app._store = createStore({
    reducers: createReducer(),
    initialState: hooksAndOpts.initialState || {},
    plugin,
    createOpts,
    sagaMiddleware,
    promiseMiddleware,
  });
  const store = app._store;
  // Extend store
  store.runSaga = sagaMiddleware.run;
  store.asyncReducers = {};
  // Execute listeners when state is changed
  const listeners = plugin.get('onStateChange');
  for (const listener of listeners) {
    store.subscribe(() => {
      listener(store.getState());
    });
  }
  // Run sagas, 调用 Redux-Saga 的 createSagaMiddleware 创建 saga中间件，调用中间件的 run 方法所有收集起来的异步方法
  // run方法监听每一个副作用action，当action发生的时候，执行对应的 saga
  sagas.forEach(sagaMiddleware.run);
  // Setup app
  setupApp(app);
  // 运行 subscriptions
  const unlisteners = {};
  for (const model of this._models) {
    if (model.subscriptions) {
      unlisteners[model.namespace] = runSubscription(model.subscriptions, model, app, onError);
    }
  }
  // 暴露三个 Model 相关的接口，Setup app.model and app.unmodel
  app.model = injectModel.bind(app, createReducer, onError, unlisteners);
  app.unmodel = unmodel.bind(app, createReducer, reducers, unlisteners);
  app.replaceModel = replaceModel.bind(app, createReducer, reducers, unlisteners, onError);
  /**
   * Create global reducer for redux.
   *
   * @returns {Object}
   */
  function createReducer() {
    return reducerEnhancer(
      combineReducers({
        ...reducers,
        ...extraReducers,
        ...(app._store ? app._store.asyncReducers : {}),
      }),
    );
  }
}
}
```

#### 路由

在前面的 dva.start 方法中我们看到了 createOpts，并了解到在 dva-core 的 start 中的不同时机调用了对应方法。

```js
import * as routerRedux from 'connected-react-router';
const { connectRouter, routerMiddleware } = routerRedux;
const createOpts = {
  initialReducer: {
    router: connectRouter(history),
  },
  setupMiddlewares(middlewares) {
    return [routerMiddleware(history), ...middlewares];
  },
  setupApp(app) {
    app._history = patchHistory(history);
  },
};
```

其中 initialReducer 和 setupMiddlewares 在初始化 store 时调用，然后才调用 setupApp

可以看见针对 router 相关的 reducer 和中间件配置，其中 connectRouter 和 routerMiddleware 均使用了 connected-react-router 这个库，其主要思路是：把路由跳转也当做了一种特殊的 action。

#### Dva 与 React、React-Redux、Redux-Saga 之间的差异

##### 原生 React

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/ezZa3oU6L421trs.webp)按照 React 官方指导意见, 如果多个 Component 之间要发生交互, 那么状态(即: 数据)就维护在这些 Component 的最小公约父节点上, 也即是

以及 本身不维持任何 state, 完全由父节点 传入 props 以决定其展现, 是一个纯函数的存在形式, 即: Pure Component

##### React-Redux

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/Upg4QKf31idrXJ5.webp)与上图相比, 几个明显的改进点:

1. 状态及页面逻辑从 里面抽取出来, 成为独立的 store, 页面逻辑就是 reducer
2. 及都是 Pure Component, 通过 connect 方法可以很方便地给它俩加一层 wrapper 从而建立起与 store 的联系: 可以通过 dispatch 向 store 注入 action, 促使 store 的状态进行变化, 同时又订阅了 store 的状态变化, 一旦状态变化, 被 connect 的组件也随之刷新
3. 使用 dispatch 往 store 发送 action 的这个过程是可以被拦截的, 自然而然地就可以在这里增加各种 Middleware, 实现各种自定义功能, eg: logging

这样一来, 各个部分各司其职, 耦合度更低, 复用度更高, 扩展性更好。

##### Redux-Saga

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/GusO4Wo8RqNdltk.webp)因为我们可以使用 Middleware 拦截 action, 这样一来异步的网络操作也就很方便了, 做成一个 Middleware 就行了, 这里使用 redux-saga 这个类库, 举个栗子:

1. 点击创建 Todo 的按钮, 发起一个 type == addTodo 的 action
2. saga 拦截这个 action, 发起 http 请求, 如果请求成功, 则继续向 reducer 发一个 type == addTodoSucc 的 action, 提示创建成功, 反之则发送 type == addTodoFail 的 action 即可

##### Dva

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/GCQ7J8qT5cjBRlz.webp)有了前面三步的铺垫, Dva 的出现也就水到渠成了, 正如 Dva 官网所言, Dva 是基于 React + Redux + Saga 的最佳实践, 对于提升编码体验有三点贡献：

1. 把 store 及 saga 统一为一个 model 的概念, 写在一个 js 文件里面
2. 增加了一个 Subscriptions, 用于收集其他来源的 action, 比如键盘操作等
3. model 写法很简约, 类似于 DSL（领域特定语言），可以提升编程的沉浸感，进而提升效率

**约定大于配置**

```js
app.model({
  namespace: 'count',
  state: {
    record: 0,
    current: 0,
  },
  reducers: {
    add(state) {
      const newCurrent = state.current + 1;
      return { ...state,
        record: newCurrent > state.record ? newCurrent : state.record,
        current: newCurrent,
      };
    },
    minus(state) {
      return { ...state, current: state.current - 1};
    },
  },
  effects: {
    *add(action, { call, put }) {
      yield call(delay, 1000);
      yield put({ type: 'minus' });
    },
  },
  subscriptions: {
    keyboardWatcher({ dispatch }) {
      key('⌘+up, ctrl+up', () => { dispatch({type:'add'}) });
    },
  },
});
```



### 14.redux-thunk分析

> redux-thunk` 可以利用 `redux` 中间件让 `redux` 支持异步的 `action

```js
// 如果 action 是个函数，就调用这个函数
// 如果 action 不是函数，就传给下一个中间件
// 发现 action 是函数就调用
const thunk = ({ dispatch, getState }) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(dispatch, getState);
  }

  return next(action);
};
export default thunk
```

#### 简单使用

不用redux-thunk之前

```js
// store.js
import { createStore } from 'redux';

export const reducer = (state = {
    count: 0
}, action) => {
    switch(action.type) {
        case 'CHANGE_DATA': {
            return {
                ...state,
                count: action.data
            }
        }
        default: 
            return state;

    }
}
export const store = createStore(reducer);
// App.jsx
class ReduxTest extends React.Component {
    constructor(props) {
        super(props);
        store.subscribe(() => {
            console.log('subscribe')
            this.setState({
                count: store.getState().count
            })
        })
    }
    changeData = () => {
        const { count } = store.getState();
        const action = {
            type: 'CHANGE_DATA',
            data: count + 1
        }
        store.dispatch(action);
    }
    render() {
        return (
            <div>
                <span>{this.state?.count}</span>
                <button onClick={this.changeData}>按钮+1</button>
            </div>
        )
    }
}
export default ReduxTest;
```

对于上述代码，我们dispatch一个action，其中action必须为一个对象。

但是实际开发中，action里的数据往往是一个异步接口获取的数据，这个时候，我们可以

```js
class ReduxTest extends React.Component {
    constructor(props) {
        super(props);
        store.subscribe(() => {
            console.log('subscribe', store.getState());
            this.setState({
                count: store.getState().count
            });
        });
    }
    changeData = () => {
        const { count } = store.getState();
        let res;
        const p = new Promise(resolve => {
            setTimeout(() => {
                res = 111;
                resolve(res);
            }, 1000);
        });
        p.then(r => {
            const action = {
                type: 'CHANGE_DATA',
                data: r
            };
            store.dispatch(action);
        });
    };
    render() {
        return (
            <div>
                <span>{this.state?.count}</span>
                <button onClick={this.changeData}>按钮+1</button>
            </div>
        );
    }
}
export default ReduxTest;
```

但是，上述会把处理的异步的逻辑写在组件里，使代码变得混乱，
因此，假如我dispatch一个函数，在这个函数里去处理异步的逻辑，岂不是使代码变得更简洁？！

```js
const getData = () => {
    let res;
    const p = new Promise(resolve => {
        setTimeout(() => {
            res = 111;
            resolve(res);
        }, 1000);
    });
    p.then(r => {
      const action = {
          type: 'CHANGE_DATA',
          data: r
      };
      store.dispatch(action);
  });
};
class ReduxTest extends React.Component {
    constructor(props) {
        super(props);
        store.subscribe(() => {
            console.log('subscribe', store.getState());
            this.setState({
                count: store.getState().count
            });
        });
    }
    changeData = () => {
        const { count } = store.getState();
        store.dispatch(getData);
    };
    render() {
        return (
            <div>
                <span>{this.state?.count}</span>
                <button onClick={this.changeData}>按钮+1</button>
            </div>
        );
    }
}
export default ReduxTest;
```

这样，就将组件和异步处理逻辑进行了解耦。

其实没有redux-thunk，也可以完成同样的功能，只是将处理异步逻辑的代码写在组件里，为了让代码更简洁、解耦，所以通过redux-thunk可以dispatch一个函数，然后在这个函数里处理异步操作。

#### 源码分析

在使用 Redux 过程，通过 dispatch 方法派发一个 action 对象。当我们使用 redux-thunk 后，可以 dispatch 一个 function。redux-thunk会自动调用这个 function，并且传递 dispatch, getState 方法作为参数。这样一来，我们就能在这个 function 里面处理异步逻辑，处理复杂逻辑，这是原来 Redux 做不到的，因为原来就只能 dispatch 一个简单对象

redux-thunk 的源码比较简洁，实际就11行。前几篇我们说到 redux 的中间件形式，
本质上是对 store.dispatch 方法进行了增强改造，基本是类似这种形式：

```js
const middleware = (store) => next => action => {}
```



先给个缩水版的实现：

```javascript
const thunk = ({ getState, dispatch }) => next => action => {
    if (typeof action === 'function') {
        return action(dispatch, getState)
    }
    return next(action)
}
export default thunk
```

- 原理：即当 action 为 function 的时候，就调用这个 function (传入 dispatch, getState)并返回；如果不是，就直接传给下一个中间件。

完整源码如下：

```javascript
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    // 如果action是一个function，就返回action(dispatch, getState, extraArgument)，否则返回next(action)。
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument)
    }
    // next为之前传入的store.dispatch，即改写前的dispatch
    return next(action)
  }
}

const thunk = createThunkMiddleware()
// 给thunk设置一个变量withExtraArgument，并且将createThunkMiddleware整个函数赋给它
thunk.withExtraArgument = createThunkMiddleware

export default thunk
```

我们发现其实还多了 extraArgument 传入，这个是自定义参数，如下用法：

```javascript
const api = "https://jsonplaceholder.typicode.com/todos/1";
const whatever = 10;

const store = createStore(
  reducer,
  applyMiddleware(thunk.withExtraArgument({ api, whatever })),
);

// later
function fetchData() {
  return (dispatch, getState, { api, whatever }) => {
    // you can use api and something else here
  };
}
```

### 15.redux-saga分析

[深入浅出Redux Saga——原理浅析](https://blog.csdn.net/juse__we/article/details/107598535)

#### Side Effects 副作用

我们经常会提到副作用，就是为了处理副作用我们才会使用Thunk， Saga这些工具，那什么是副作用？

##### 什么是副作用？

> 鲁迅说：副作用是在计算结果的过程中，系统状态的一种变化，或者与外部世界进行的可观察的交互。

简单地说，**只要是跟函数外部环境发生的交互就都属于副作用**。

是不是还是有点困惑？我们举些例子吧，副作用包括但不限于以下情况：

- 发送一个 http 请求
- 更改文件系统
- 往数据库插入记录
- 使用LocalStorage进行本地存储
- 打印/log
- 获取用户输入
- DOM 查询
- 访问系统状态

大概知道什么是副作用之后，我们继续了解两个词：**纯函数 & 非纯函数**

##### 什么是纯函数？

**纯函数：**

函数与外界交互唯一渠道就是——**参数**和**返回值**。也就是说：
函数从**函数外部接受的所有输入信息**都通过**参数**传递到该函数内部；函数**输出到函数外部的所有信息**都通过**返回值**传递到该函数外部。

##### 什么是非纯函数？

非纯函数：

函数通过**参数和返回值以外**的渠道，和外界进行数据交换。
比如，读取/修改全局变量；比如，从local storage读取数据，还将其打印到屏幕；再比如在函数里发起一个http请求获取数据。。

那为什么我们要追求纯函数？那它当然有它的好处了。

- **引用透明性**：纯函数总是能够根据相同的输入返回相同的输出，所以它们就能够保证总是返回同一个结果。
- **可移植性／自文档化**：纯函数内部与环境无关，可以自给自足，更易于观察和理解，一切依赖都从参数中传递进来，所以仅从函数签名我们就得知足够的信息。
- **可缓存性**：由于以上特性，纯函数总能够根据输入做缓存，例如memoize函数，用一个对象来缓存计算结果。
- **可测试性**：不需要伪造环境，只需简单地给函数一个输入，然后断言输出就好了。

##### 让人讨厌的副作用？

说了这么多纯函数的好处，我们费劲心思将让人讨厌的副作用处理掉，那为什么还要写有副作用的代码啊？

但是回过头想想，副作用都是我们程序里的关键，假如没有副作用，一切都变得毫无意义了。

假如一个前端项目不能发起http请求从后端获取信息，

假如一个文件系统或者数据库不能让我们读写数据，

假如不能根据用户的输入从屏幕上输出他们想要的信息

这一切都没有意义了。

所以我们的任务不是消除副作用，而是要把副作用统一管理，避免一些不该出现的/我们并不希望出现的问题，让程序看起来更可控更纯洁～

所以我们才会在项目的状态管理中使用thunk，saga等手段处理副作用:)

#### Why Not Redux Thunk

Redux Thunk也是处理副作用的一个中间件，那为什么不推荐使用Redux Thunk呢？

> 鲁迅说： 因为丑！它不好看！

redux的作者提供了Redux Thunk中间件给我们集中地处理副作用，所以它的优点就是：可以处理副作用。

但是也就仅提供处理副作用这个功能，处理方式相当粗暴简陋（你看看thunk一共就10行不到的代码你就懂了），我说说缺点：

- 内部代码重复且无意义，逻辑复杂（丑）
- Action本应是一个纯碎的JS对象，但是使用Thunk之后Action的形式千奇百态（丑）
- 代码难以测试（因为丑）

举个丑例子

```js
const GET_DATA = 'GET_DATA'
const GET_DATA_SUCCESS = 'GET_DATA_SUCCESS'
const GET_DATA_FAILED = 'GET_DATA_FAILED'
 
const getDataAction = id => (dispatch, getState) => {
  dispatch({
    type: GET_DATA,
    payload: id
  })
  api.getData(id)
    .then(res => {
      dispatch({
        type: GET_DATA_SUCCESS,
        payload: res
      })
    })
    .catch(err => {
      dispatch({
        type: GET_DATA_FAILED,
        payload: err
      })
    })
}
```

综上，这不是我们高级而优雅的前端工程师想要的结果！！

#### Why Redux Saga

那为什么就推荐Saga了呢？

> 鲁迅说： 优雅！高级！一眼看不懂！

我们看一下官方介绍吧。

> redux-saga is a library that aims to make application side effects easier to manage, more efficient to execute, easy to test, and better at handling failures.

从介绍中可以看到Saga有这么几个特点：

- 更容易管理副作用
- 程序更高效执行
- 易于测试
- 易于处理错误

那鲁迅为什么说人家优雅高级啊，高在哪儿啊？

Redux Saga之所以更受我们欢迎，因为它的核心就是巧妙地使用了ES6的特性——Generator，基于Generator实现异步流程的控制管理。

#### ES6 Generator

为了更好地理解Saga的原理，了解Generator的基础知识是必经之路。

```js
function * generator () {
  yield 'hello'
  yield 'world'
}
 
let gen = generator()
 
gen.next() // { value: 'hello', done: false}
gen.next() // { value: 'world', done: false}
gen.next() // { value: undefined, done: true}
```

generator是生成器函数，*：是它的专有标志。

yield是暂停标志，每次程序运行到yield时都会暂停，等待下一次指令的执行；它只能在generator函数里，后面跟着一个表达式。

**return是终止标志。**

gen是由generator生成器函数生成的一个遍历器对象。

gen对象拥有next()方法，调用next方法会得到结构为一个内含value和done属性的对象，value是yield后面表达式的值，done是遍历是否结束的标志位。

只有执行了next才会开始调用generator函数。next传入的参数会当作上一个yield表达式的返回值，所以第一次调用next传入的参数是无效的。

我们通过一个复杂一点点的例子来了解Generator函数

```js
function * generator (x, y) {
  // yield
  // 暂停标志
  // 只能在generator里
  // 后面接着一个表达式
  let a = yield x + y
  // ⚠️a拿到的是next传来的参数，而不是yield后面的表达式！
  // ⚠️因此我们可以通过next函数在外部改变generator内部的行为
  let b = yield x * y
  // return
  // 终止标志
  return a + b
}
 
// gen
// 遍历器对象
let gen = generator(1, 2)
 
gen.next()
// {value: 3, done: false}
gen.next(9)
// {value: 2, done: false}
gen.next(8)
// {value: 17, done: false}
// 只有执行next才会调用generator
// next传入的参数会当作上一个yield表达式的返回值
// 所以第一次调用next传入的参数是无效的
 
```

看懂这段代码最关键的点就是

**yield前面的变量拿到的是next传来的参数，而不是yield后面的表达式！**

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91cGxvYWQtaW1hZ2VzLmppYW5zaHUuaW8vdXBsb2FkX2ltYWdlcy83MTYyNTgyLTUwNjYzZWI5OWY3MjVmMWEucG5nP2ltYWdlTW9ncjIvYXV0by1vcmllbnQvc3RyaXB8aW1hZ2VWaWV3Mi8yL3cvMTEzMC9mb3JtYXQvd2VicA?x-oss-process=image/format,png)

**Generator通过yield和next来传递数据来控制函数的内部流程**

#### Redux Saga

前面铺垫了这么多，终于要开始讲一下Saga了。

Saga是一个中间件，所以我们首先当然要去注册一下它

```js
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import reducer from './reducers'
import mySaga from './sagas'
 
// create the saga middleware
const sagaMiddleware = createSagaMiddleware()
// mount it on the Store
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)
 
// then run the saga
sagaMiddleware.run(mySaga)
 
export default store
```

注册的步骤很简单，调用createSagaMiddleware，用于创建saga中间件；讲saga中间件注入store中，并执行run操作，运行我们写的saga函数。

再来一个简单的使用例子：

```typescript
import { createActions } from 'redux-actions'
import { call, put, takeLatest } from 'redux-saga/effects'
import { fetchDataApi } from '@api/index'
 
export const {
  data: { fetchDataReq, fetchDataSucc, fetchDataFailed }
} = createActions({
  DATA: {
    FETCH_DATA_REQ: null,
    FETCH_DATA_SUCC: rsp => ({ data: rsp }),
    FETCH_DATA_FAILED: null,
  }
})
 
function* fetchDataReqSaga() {
  try {
    const rsp = yield call(fetchDataApi)
    yield put(fetchDataSucc(rsp))
  } catch (e) {
    yield put(fetchDataFailed(e))
  }
}
 
function* watchFetchSaga() {
  yield takeLatest(fetchDataReq, fetchDataReqSaga)
}
 
export default watchFetchSaga
 
```

Redux Thunk同样的小例子，发起一个action触发一个http请求，请求成功时发起success action，请求失败时发起failed action。

在Saga中会使用一种叫做**Effect的指令来完成这些操作**。
call，put，takeLatest等等，都是Effect指令。

通俗地讲，call作用是调用其参数中的函数，pull作用是发起一个action，takelatest作用是监听某个action的触发并执行回调函数。

#### Effects

Effects就是简单的JavaScript对象，我们可以把它视作是发送给saga middleware的一些指令，它仅仅是负责向middleware**描述调用行为的信息**，而接下来的**操作是由middleware来执行**，**middleware执行完毕后将指令的结果回馈给 Generator**。

也就是说**我们只需要通过声明Effects的形式，将副作用的部分都留给middleware来执行。**

这样做的好处：
1: 集中处理异步操作，更流利熟悉地表达复杂的控制流。
2: 保证action是个纯粹的JavaScript对象，风格保持统一。
3: 声明式指令，无需在generator中立即执行，只需通知middleware让其执行；借助generator的next方法，向外部暴露每一个步骤。

接下来看一下一些常用的effect指令

- put 用来命令 middleware 向 Store 发起一个 action。
- take 用来命令 middleware 在 Store 上等待指定的 action。在发起与 pattern 匹配的 action 之前，Generator 将暂停。
- call 用来命令 middleware 以参数 args 调用函数 fn。
- fork 用来命令 middleware 以 **非阻塞调用** 的形式执行 fn。
- race 用来命令 middleware 在多个 Effect 间运行，相当于Promise.race。
- all 用来命令 middleware 并行地运行多个 Effect，并等待它* 们全部完成，相当于Promise.all。

#### Saga辅助函数

Saga除了提供Effects，还会提供一些高阶的辅助函数给我们使用，而这些辅助函数实际上也是基于各个Effects实现的。

- takeEvery（take+fork）
- takeLatest （take+fork+cancel）
- takeLeading（take+call）
- throttle（take+fork+delay）
- debounce（take+fork+delay)
- retry （call+delay）

举个简单的例子，当用户点击按钮触发事件时：

- takeEvery会并发执行（take+fork）；
- takeLastest只执行最后一次（take+fork+cancel）；
- takeLeading只执行第一次（take+call）；
- throttle节流，触发后一段时间不会再次触发（take+fork+delay）；
- debounce防抖，等到一段时间后再触发；
- retry，多次重试触发；

#### Saga原理之Channel（发布订阅模式）

了解完Saga的基本使用，我们开始进一步了解它的原理。先说说Saga中间件里头有一个Channel的东西，它可以理解为一个action监听的池子，每次调用take指令的时候就会将对应action的监听函数放进池子里，当每次调用put指令或者外部发起一个action的时候，Saga就会在池子里匹配对应的监听函数并执行，然后将其销毁。

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91cGxvYWQtaW1hZ2VzLmppYW5zaHUuaW8vdXBsb2FkX2ltYWdlcy83MTYyNTgyLTNmYmQ4MGY2Y2ZhMmUxMjUucG5nP2ltYWdlTW9ncjIvYXV0by1vcmllbnQvc3RyaXB8aW1hZ2VWaWV3Mi8yL3cvNzU0L2Zvcm1hdC93ZWJw?x-oss-process=image/format,png)

channel

以下是简化过的Saga源码channel部分：



```php
function channel () {
  let taker
  function take (cb) {
    taker = cb
  }
  function put (input) {
    if (taker) {
      const tempTaker = taker
      taker = null
      tempTaker(input)
    }
  }
  return {
    put,
    take
  }
}
 
const chan = channel()
```

#### Saga原理之自驱动模式

可能你会有疑惑，为什么Saga中间件会自动按照程序设定的一般地接受指定的Effect指令去执行对应的同步/异步操作呢？

其实这就是Saga基于Generator的一种自驱动模式（这是我自己起的名字）

回过头想想上文提及Generator时归结出的一个结论：

**Generator通过yield和next来传递数据来控制函数的内部流程**

Saga就是利用了这一点，而且不止这样，Saga中间件内部有一个**驱动函数**（effectRunner)，它里面生成一个遍历器对象来不断地**消费**生成器函数(effectProducer)中的effect指令，完成**指定的任务并递归循环下去**。（这时候你可能会想到TJ大神的CO库）

这个驱动函数大概长这样



```php
function task (saga) {
  // 初始化遍历器对象
  const sa = saga()
  function next (args) {
      // 获取到yield后面的表达式——effect指令
      const result = sa.next(args)
      const effect = result.value
      // 执行effect对应的操作——call/put/take...
      runEffect(result.value, next)
  }
  // 执行next函数
  next()
}
```

这样就实现了一个自我驱动的方案，回想一下Saga中间件注册的步骤

> 调用createSagaMiddleware，用于创建saga中间件；讲saga中间件注入store中，并执行run操作，运行我们写的saga函数。

当执行run(saga)的时候其实就是启动了驱动函数（effectRunner)，它开始控制我们自己编写的业务流程Saga函数(effectProducer)，effectRunner通过**next来控制流程和传递数据**（执行结果），effectProducer通过**yield来发布effect指令**，这样就完美演绎了saga整个生命周期！！

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91cGxvYWQtaW1hZ2VzLmppYW5zaHUuaW8vdXBsb2FkX2ltYWdlcy83MTYyNTgyLWU4NDZkMmQ5MmU0ZGVhZGYucG5nP2ltYWdlTW9ncjIvYXV0by1vcmllbnQvc3RyaXB8aW1hZ2VWaWV3Mi8yL3cvODE4L2Zvcm1hdC93ZWJw?x-oss-process=image/format,png)

#### Saga源码

实际上Saga源码中也就这么一回事，主要挑了channel和自驱动函数两块东西来看，在Saga源码中有一个proc函数，其实就是上文提到的自驱动函数，它接收到effect指令之后进行effect类型分发，不同effect对应不同的操作。

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91cGxvYWQtaW1hZ2VzLmppYW5zaHUuaW8vdXBsb2FkX2ltYWdlcy83MTYyNTgyLTFlZjk3OTVkYWYyODMxN2MucG5nP2ltYWdlTW9ncjIvYXV0by1vcmllbnQvc3RyaXB8aW1hZ2VWaWV3Mi8yL3cvMTIwMC9mb3JtYXQvd2VicA?x-oss-process=image/format,png)



#### Saga测试

Saga还有一个优点记得吗？易于测试，由于业务代码都是声明式地调用，而不是真实地进行一些副作用操作，所以在写单测的时候可以通过断言的方式来测试，而不用mock一些繁琐复杂的操作。

### 16.手写redux 中间件

#### 简单实现

```js
function createStore(reducer) {
  let currentState
  let listeners = []

  function getState() {
    return currentState
  }

  function dispatch(action) {
    currentState = reducer(currentState, action)
    listeners.map(listener => {
      listener()
    })
    return action
  }

  function subscribe(cb) {
    listeners.push(cb)
    return () => {}
  }

  dispatch({type: 'ZZZZZZZZZZ'})

  return {
    getState,
    dispatch,
    subscribe
  }
}

// 应用实例如下：
function reducer(state = 0, action) {
  switch (action.type) {
    case 'ADD':
      return state + 1
    case 'MINUS':
      return state - 1
    default:
      return state
  }
}

const store = createStore(reducer)

console.log(store);
store.subscribe(() => {
  console.log('change');
})
console.log(store.getState());
console.log(store.dispatch({type: 'ADD'}));
console.log(store.getState());
```

#### 迷你版

```js
export const createStore = (reducer,enhancer)=>{
	if(enhancer) {
		return enhancer(createStore)(reducer)
	}
	let currentState = {}
	let currentListeners = []

	const getState = ()=>currentState
	const subscribe = (listener)=>{
		currentListeners.push(listener)
	}
	const dispatch = action=>{
		currentState = reducer(currentState, action)
		currentListeners.forEach(v=>v())
		return action
	}
	dispatch({type:'@@INIT'})
	return {getState,subscribe,dispatch}
}

//中间件实现
export applyMiddleWare(...middlewares){
	return createStore=>...args=>{
		const store = createStore(...args)
		let dispatch = store.dispatch

		const midApi = {
			getState:store.getState,
			dispatch:...args=>dispatch(...args)
		}
		const middlewaresChain = middlewares.map(middleware=>middleware(midApi))
		dispatch = compose(...middlewaresChain)(store.dispatch)
		return {
			...store,
			dispatch
		}
	}

// fn1(fn2(fn3())) 把函数嵌套依次调用
export function compose(...funcs){
	if(funcs.length===0){
		return arg=>arg
	}
	if(funs.length===1){
		return funs[0]
	}
	return funcs.reduce((ret,item)=>(...args)=>ret(item(...args)))
}


//bindActionCreator实现

function bindActionCreator(creator,dispatch){
    return ...args=>dispatch(creator(...args))
}
function bindActionCreators(creators,didpatch){
    //let bound = {}
    //Object.keys(creators).forEach(v=>{
   //     let creator = creator[v]
     //   bound[v] = bindActionCreator(creator,dispatch)
    //})
    //return bound

    return Object.keys(creators).reduce((ret,item)=>{
	    ret[item] = bindActionCreator(creators[item],dispatch)
    	return ret
    },{})
}
```

### 16.Redux源码分析

[实现一个Redux（完善版）](https://segmentfault.com/a/1190000022641464)

[带你从头到尾系统地撸一遍Redux源码](https://juejin.cn/post/6965366315833884680)

![image-20220920221954896](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/image-20220920221954896.png)

types 主要存放的是ts 定义的一些类型， utils主要是一些通用方法，没什么涉及关键流程的，所以主要分析 applyMiddleware,combineReducers,compose, createStrore这4个ts 文件

#### CreateStore

```javascript
// 引入 redux
import { createStore } from 'redux'
 
// 创建 store  
const store = createStore(
    reducer,
    initial_state,
    applyMiddleware(middleware1, middleware2, ...)

); 
```

从图中createStore 接受3个参数 

- 第一个参数就是一个reducer 一个纯函数 ，由我们自己定义
- 第二个参数 初始化的数状态
- 第三个参数 其实就是**制定中间件 在源码中就是enhancer 增强store**

从拿到入参到返回出 store 的过程中，到底都发生了什么呢？这里是 createStore 中主体逻辑的源码：

![a79b5992ec074da1bf65a3c30e60d844 (1)](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/a79b5992ec074da1bf65a3c30e60d844%20(1).png)

这段代码主要是做一些类型判断， 和一些写法兼容没什么。继续往下看， 下面是一些初始状态的赋值：

![24198c5fdf4343ccb7aa22e5af0965b2](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/24198c5fdf4343ccb7aa22e5af0965b2.png)

接下来就进入我们经常用的getState函数了。

#### getState

![96a2787b556e4becb108b4fb0810ec8f](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/96a2787b556e4becb108b4fb0810ec8f.png)

 继续往下看

#### subscribe

![dcc54d529c904727ad982a2a185d56d1](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/dcc54d529c904727ad982a2a185d56d1.png)

这里**订阅的时候浅拷贝了一下，卸载的时候也浅拷贝**，用的都是**nextListeners**, 还记得有个**currentListeners**，接着往下看。 

#### dispatch

![64dbac4766484026a7cf805910c63ab8](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/64dbac4766484026a7cf805910c63ab8.png)

dispatch 的时候：又将next重新复制给 current，然后执行每个listenr,看到这里应该明白reducer 中 dispatch 或者做一些subscribe 做一些脏操作，redux 源码中为了防止这种 就是设置 isDispatching 这个 变量来控制。

所以dispacth一个action? Redux 帮我们做了啥事，就很简单2件事

1.  oldState 经过reducer 产生了newState, 更新了store数据中心
2.  触发订阅

整个Redux 的工作流，到这里其实已经结束了， 但是还有一个疑问就是 subscribe 为啥都是nextListeners 然后在dispatch中的又把值重新赋给currentListeners? 

答案就是：**为了保证触发订阅的稳定性**

这句话怎么理解呢我举一个例子：

```scss
// 定义监听函数a
function listenera() {
}
// 订阅 a，并获取 a 的解绑函数
const unSubscribea = store.subscribe(listenera)
// 定义监听函数 b
function listenerb() {
  // 在 b 中解绑 a
  unSubscribea()
}
// 定义监听函数 c
function listenerc() {
}
// 订阅 b
store.subscribe(listenerb)
// 订阅 c
store.subscribe(listenerc)
```

从上文我可以得知当前的currentListeners: 

```js
[listenera, listenerb, listenerc]
```

但是比较特殊的是listenb 其实卸载 listena的，如果我们不浅拷贝一下， 那么触发订阅的时候数组遍历到 i = 2 的时候其实数组是undefined ，这样引发报错，因为我们在 订阅前和卸载订阅都浅拷贝一下，nextListeners数据随便怎么变，只要保证**currentListener 稳定**就好了。 

本次dispacth完之后，下一次dispacth 假设没有新增订阅，数据关系又重新赋值。

```js
listeners =（ currentListeners = nextListeners）
```

这也是为什么Redux 订阅稳定的原因了。 接下来就是分析Redux的中间件模型。

#### Redux中的中间件思想

要想理解redux 的中间件思想， 我们先看下compose这个文件做了什么， 这个文件其实做的事情十分简单。主要是用到函数式编程中的组合概念， 将多个函数调用组合成一个函数调用。

其实主要是reduce 的这个api,简单手写下数组**reduce** 的实现：

![img](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5ac643fb7354740944219d59d3eb63d~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

这东西其实就是个累加器按照某种方式。我们接下来就直接进入compose函数话不多说直接看代码：

```javascript
// 参数是函数数组
export default function compose(...funcs: Function[]) {
	// 处理边界情况
	if (funcs.length === 0) { 
	return <T>(arg: T) => arg  
	}  
 	// 数量为1 就没有组合的必要了 
	if (funcs.length === 1) {  
    return funcs[0]  
}  
	// 主要是下面这一行代码  
	return funcs.reduce((a, b) => (...args: any) => a(b(...args)))
}
```

分析下这行代码，举例子说明： 假设我们有这个3个函数：

```js
funcs = [fa, fb, fc]
```

由于没有出初始值累加器的就是fa经过一次遍历后， **accumulateur 变为下面的样子：**

```js
let  m= （...args） => fa(fb(...args))
```

在经过一次遍历后，此时b = fc 此时accumulateur 变为下面的样子：

```js
（...args） => m(fc(...args))
```

我们将fc(...args） 看做一个整体带入上面m的函数 所以就变成了下面的样子

```js
（...args）=> fa(fb(fc(...args)))
```

到这里就大工告成了，fa, fb, fc 我们可以想象成 redux 的3个中间件， 按照顺序传进去，

当这个函数被调用的时候也会按照 fa, fb, fc 顺序调用。 接下来看compose 是如何和Redux 做结合的。

#### applyMiddleWare 

先把整体结构分析下，函数参数分下：

```javascript
// applyMiddlerware 会使用“...”运算符将入参收敛为一个数组

export default function applyMiddleware(...middlewares) {

  // 它返回的是一个接收 createStore 为入参的函数

  return createStore => (...args) => {

    ......

  }

}
```

createStore 就是 上面我们分析过的 创建数据中心Store ,而 args 主要是有两个， 还是createStore 两个约定入参  **一个是reducer， 一个是 initState**。 

#### enhance-dispatch

接下来就是比较核心的， 改写dispacth, 为什么要改写dispatch, 还是举个例子说明。 dispacth 接受的action 只能是对象，如果不是对象的话会直接报类型错误。如图：

![image-20220920224351438](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/image-20220920224351438.png)

社区比较有名的redux-thunk中间件， dispatch可以接受一个函数，

```js
应用了中间件的dispatch 和 没有用中间的dispatch 肯定是不等的，
dispatch = enhancer(dispacth) 肯定是增强的至于怎么个增强法 继续往下看。
const store = createStore(...args)
let chain = []
const middlewareAPI = {
    getState: store.getState,
    dispatch: (...args) => dispatch(...args)
}
chain = middlewares.map(middleware => middleware(middlewareAPI)) // 绑定 {dispatch和getState}
dispatch = compose(...chain)(store.dispatch) 
```

从代码中可以看到的第一步 其实就是将 getState 和 dispatch 作为中间件中的闭包使用， 有人会这里提问，这里为什么是匿名函数 ? 而不是store.dispatch ? 

举个例子说明，上面的 fa , fb, fc 接下来把他们展开。

```js
function fa(store) {
  return function(next) {
    return function(action) {
      console.log('A middleware1 开始');
      next(action)
      console.log('B middleware1 结束');
    };
  };
}

function fb(store) {
  return function(next) {
    return function(action) {
      console.log('C middleware2 开始');
      next(action)
      console.log('D middleware2 结束');
    };
  };
}

function fc(store) {
  return function(next) {
    return function(action) {
      console.log('E middleware3 开始');
      next(action)
      console.log('F middleware3 结束');
    };
  };
}
```

ok 我们一步一步分析， 看到底做了什么。

```js
chain = middlewares.map(middleware => middleware(middlewareAPI)) 
```

很显然 我们 的 middlewares = [fa, fb, fc],map 之后返回一个新的 chain 这时候的chain 应该是下面 这样子的：

`chain = [ (next)=>(action)=>{...}, (next) => (action) => {...}, (next) => (action) => {...} ]`

**只不过chain中的每一个元素 都有getSate，dispatch 的闭包而已**。 

继续往下走就到了compose 函数  还记得上面compose(fa, fb, fc ) 返回值是什么？ 

**（...args）=> fa(fb(fc(...args)))**

就是这个东西，这里的chain 也是一样的， 所以这里的 dispatch 就变成了增强的dispatch,一起看下

```js
dispatch = fa(fb(fc(store.dispacth)))
```

看到这里有人就问？ 每一个中间件的next 和 原先的store.dispacth 有什么不同 ？ 这和洋葱模型有什么关系？ 

那我就带你一步一步分析,  这里的dispatch 就是指的是当前的 fa(fb(fc(store.dispatch))) , 我们可以直接函数调用来分析， 

fa 的参数 是 **fb(fc(store.dispatch)) , 由于依赖fb, 所以调用fb, 然后发现fb 依赖的参数是 fc(store.dispacth), 紧接着又开始调用fc, ok 到这里终于结束了， 终于没有依赖了。 所以从上面的过程我们可以得到 next 其实是他上个中间件的副作用， 最后一个中间件的next 就是store.dispatch。**

> **副作用： 每个中间件的中的 （action ）=> {...}**

我用流程图表示整个洋葱模型流程：

![image-20220920224733879](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/image-20220920224733879.png)

当我调用dispatch 的时候， 先打印 E, 然后发现 next 是副作用fb, 然后调用副作用fb, 打印c，发现 next 竟然是 副作用fc ,再去调用fc, 打印A， next 这时候就是 store.dispacth, 调用结束， 打印 b, 然后打印D， 最后打印 F 。 这样的一系列操作是不是有点像洋葱模型，对于之前提出的问题？ 

> 1.为什么dispacth 是匿名函数？

> 2.为什么dispacth一个action后， 还是返回action

**问题1**： 为什么dispatch 是是一个匿名函数，因为有的中间件原理的实现，并不会 next(action), 这时候需要肯定是增强的dispacth， redux-thunk 的执行原理， 就是当你传递一个函数， 直接调用这个函数，并把dispatch 的 权限 交给你自己处理。

```javascript
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      // 这个的dispatch 其实是增强的dispatch， 
      // 如果用store.dispatch如果还有其他中间件就丢失了      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}
```

**这里看下源码：**

```js
let dispatch: Dispatch = () => {
	 throw new Error('Dispatching while constructing your middleware is not allowed. ' + 'Other middleware would not be applied to this dispatch.') 
}
const middlewareAPI: MiddlewareAPI = { 
	getState: store.getState, dispatch: (action, ...args) => dispatch(action, ...args) 
}
const chain = middlewares.map(middleware => middleware(middlewareAPI))
// compose 完之后将闭包更新成增强的
dispatchdispatch = compose < typeof dispatch > (...chain) (store.dispatch)
```

**所以Redux 严格 意义上 并不算是洋葱模型， 他的洋葱模型是建立在你的每个中间件，都要next(action); 如果不 next(action) 其实就破坏了洋葱模型。**

**问题2：** dispatch (action) 返回action, 就是为了方便下一个中间件的处理。

### 17.React-Redux源码

[「源码解析」一文吃透react-redux源码（useMemo经典源码级案例）](https://juejin.cn/post/6937491452838559781)

## Hooks

[React 全部 Hooks 使用大全 （包含 React v18 版本 ）](https://juejin.cn/post/7118937685653192735#heading-5)

### 基本用法和注意事项

#### 数据更新驱动

##### useState

useState 可以使函数组件像类组件一样拥有 state，函数组件通过 useState 可以让组件重新渲染，更新视图。

###### **useState 基础介绍：**

```js
const [ ①state , ②dispatch ] = useState(③initData)
```

① state，目的提供给 UI ，作为渲染视图的数据源。

② dispatchAction 改变 state 的函数，可以理解为推动函数组件渲染的渲染函数。

③ initData 有两种情况，第一种情况是非函数，将作为 state 初始化的值。 第二种情况是函数，函数的返回值作为 useState 初始化的值。

###### **useState 基础用法：**

```js
const DemoState = (props) => {
   /* number为此时state读取值 ，setNumber为派发更新的函数 */
   let [number, setNumber] = useState(0) /* 0为初始值 */
   return (<div>
       <span>{ number }</span>
       <button onClick={ ()=> {
         setNumber(number+1)
         console.log(number) /* 这里的number是不能够即使改变的  */
       } } ></button>
   </div>)
}
```

###### **useState 注意事项：**

① **在函数组件一次执行上下文中，state 的值是固定不变的。**

```js
function Index(){
    const [ number, setNumber ] = React.useState(0)
    const handleClick = () => setInterval(()=>{
        // 此时 number 一直都是 0
        setNumber(number + 1 ) 
    },1000)
    return <button onClick={ handleClick } > 点击 { number }</button>
}
```

② 如果两次 dispatchAction **传入相同的 state 值**，那么组件就不会更新。

```js
export default function Index(){
    const [ state  , dispatchState ] = useState({ name:'alien' })
    const  handleClick = ()=>{ // 点击按钮，视图没有更新。
        state.name = 'Alien'
        dispatchState(state) // 直接改变 `state`，在内存中指向的地址相同。
    }
    return <div>
         <span> { state.name }</span>
        <button onClick={ handleClick }  >changeName++</button>
    </div>
}
```

③ 当触发 dispatchAction 在当前执行上下文中获取不到最新的 state, 只有再下一次组件 rerender 中才能获取到。

##### useReducer

useReducer 是 react-hooks 提供的能够在无状态组件中运行的类似redux的功能 api 。

###### **useReducer 基础介绍：**

```js
const [ ①state , ②dispatch ] = useReducer(③reducer)
```

① 更新之后的 state 值。

② 派发更新的 dispatchAction 函数, 本质上和 useState 的 dispatchAction 是一样的。

③ 一个函数 reducer ，我们可以认为它就是一个 redux 中的 reducer , reducer的参数就是常规reducer里面的state和action, 返回改变后的state, 这里有一个需要注意的点就是：**如果返回的 state 和之前的 state ，内存指向相同，那么组件将不会更新。**

###### **useReducer 基础用法：**

```js
const DemoUseReducer = ()=>{
    /* number为更新后的state值,  dispatchNumbner 为当前的派发函数 */
   const [ number , dispatchNumbner ] = useReducer((state,action)=>{
       const { payload , name  } = action
       /* return的值为新的state */
       switch(name){
           case 'add':
               return state + 1
           case 'sub':
               return state - 1 
           case 'reset':
             return payload       
       }
       return state
   },0)
   return <div>
      当前值：{ number }
      { /* 派发更新 */ }
      <button onClick={()=>dispatchNumbner({ name:'add' })} >增加</button>
      <button onClick={()=>dispatchNumbner({ name:'sub' })} >减少</button>
      <button onClick={()=>dispatchNumbner({ name:'reset' ,payload:666 })} >赋值</button>
      { /* 把dispatch 和 state 传递给子组件  */ }
      <MyChildren  dispatch={ dispatchNumbner } State={{ number }} />
   </div>
}
```



#### 执行副作用

纯函数

首先解释纯函数（Pure function）：给一个 function 相同的参数，永远会返回相同的值，并且没有副作用；这个概念拿到 React 中，就是给一个 Pure component 相同的 props, 永远渲染出相同的视图，并且没有其他的副作用；纯组件的好处是，容易监测数据变化、容易测试、提高渲染性能等；
副作用（Side Effect）是指一个 function 做了和本身运算返回值无关的事，比如：修改了全局变量、修改了传入的参数、甚至是 console.log()，所以 ajax 操作，修改 dom 都是算作副作用的；

#####  useEffect

React hooks也提供了 api ，用于弥补函数组件没有生命周期的缺陷。其本质主要是运用了 hooks 里面的 useEffect ， useLayoutEffect，还有 useInsertionEffect。其中最常用的就是 useEffect 。我们首先来看一下 useEffect 的使用。

###### **useEffect 基础介绍：**

```js
useEffect(()=>{
    return destory
},dep)

useEffect(() => {
  // 执行一些副作用
  // ...
  return () => {
    // 清理函数
  }
})
```

useEffect 第一个参数 callback, 返回的 destory ， destory **作为下一次callback执行之前调用，用于清除上一次 callback 产生的副作用**。

有的时候**需要根据 props 的变化来条件执行 effect 函数**，要实现这一点，可以给 useEffect 传递第二个参数，它是 effect 所依赖的值数组：

```js
useEffect(
  () => {
    const subscription = props.source.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  },
  [props.source],
);
```

第二个参数作为依赖项，是一个数组，可以有多个依赖项，依赖项改变，执行上一次callback 返回的 destory ，和执行新的 effect 第一个参数 callback 。

对于 useEffect 执行， React 处理逻辑是采用**异步调用** ，对于每一个 effect 的 callback， React 会向 setTimeout回调函数一样，放入任务队列，等到主线程任务完成，DOM 更新，js 执行完成，视图绘制完毕，才执行。所以 **effect 回调函数不会阻塞浏览器绘制视图**。

###### **useEffect 基础用法：**

```js
/* 模拟数据交互 */
function getUserInfo(a){
    return new Promise((resolve)=>{
        setTimeout(()=>{ 
           resolve({
               name:a,
               age:16,
           }) 
        },500)
    })
}

const Demo = ({ a }) => {
    const [ userMessage , setUserMessage ] :any= useState({})
    const div= useRef()
    const [number, setNumber] = useState(0)
    /* 模拟事件监听处理函数 */
    const handleResize =()=>{}
    /* useEffect使用 ，这里如果不加限制 ，会是函数重复执行，陷入死循环*/
    useEffect(()=>{
       /* 请求数据 */
       getUserInfo(a).then(res=>{
           setUserMessage(res)
       })
       /* 定时器 延时器等 */
       const timer = setInterval(()=>console.log(666),1000)
       /* 操作dom  */
       console.log(div.current) /* div */
       /* 事件监听等 */
       window.addEventListener('resize', handleResize)
         /* 此函数用于清除副作用 */
       return function(){
           clearInterval(timer) 
           window.removeEventListener('resize', handleResize)
       }
    /* 只有当props->a和state->number改变的时候 ,useEffect副作用函数重新执行 ，如果此时数组为空[]，证明函数只有在初始化的时候执行一次相当于componentDidMount */
    },[ a ,number ])
    return (<div ref={div} >
        <span>{ userMessage.name }</span>
        <span>{ userMessage.age }</span>
        <div onClick={ ()=> setNumber(1) } >{ number }</div>
    </div>)
}

```

如上在 useEffect 中做的功能如下：

- ① 请求数据。
- ② 设置定时器,延时器等。
- ③ 操作 dom , 在 React Native 中可以通过 ref 获取元素位置信息等内容。
- ④ 注册事件监听器, 事件绑定，在 React Native 中可以注册 NativeEventEmitter 。
- ⑤ 还可以清除定时器，延时器，解绑事件监听器等。



#####  useLayoutEffect

###### **useLayoutEffect 基础介绍：**

useLayoutEffect 和 useEffect 不同的地方是采用了同步执行，那么和useEffect有什么区别呢？

① 首先 useLayoutEffect 是在 DOM 更新之后，浏览器绘制之前，这样可以方便修改 DOM，获取 DOM 信息，这样浏览器只会绘制一次，如果修改 DOM 布局放在 useEffect ，那 useEffect 执行是在浏览器绘制视图之后，接下来又改 DOM ，就可能会导致浏览器再次回流和重绘。而且由于两次绘制，视图上可能会造成闪现突兀的效果。

② useLayoutEffect callback 中代码执行会阻塞浏览器绘制。

###### **useEffect 基础用法：**

```js
const DemoUseLayoutEffect = () => {
    const target = useRef()
    useLayoutEffect(() => {
        /*我们需要在dom绘制之前，移动dom到制定位置*/
        const { x ,y } = getPositon() /* 获取要移动的 x,y坐标 */
        animate(target.current,{ x,y })
    }, []);
    return (
        <div >
            <span ref={ target } className="animate"></span>
        </div>
    )
}
```

##### useInsertionEffect

###### **useInsertionEffect 基础介绍：**

useInsertionEffect 是在 React v18 新添加的 hooks ，它的用法和 useEffect 和 useLayoutEffect 一样。那么这个 hooks 用于什么呢?

在介绍 useInsertionEffect 用途之前，先看一下 useInsertionEffect 的执行时机。

```js
React.useEffect(()=>{
    console.log('useEffect 执行')
},[])

React.useLayoutEffect(()=>{
    console.log('useLayoutEffect 执行')
},[])

React.useInsertionEffect(()=>{
    console.log('useInsertionEffect 执行')
},[])
```

打印： useInsertionEffect 执行 -> useLayoutEffect 执行 -> useEffect 执行

可以看到 useInsertionEffect 的执行时机要比 useLayoutEffect 提前，useLayoutEffect 执行的时候 DOM 已经更新了，但是在 useInsertionEffect 的执行的时候，DOM 还没有更新。本质上 useInsertionEffect 主要是解决 CSS-in-JS 在渲染中注入样式的性能问题。这个 hooks 主要是应用于这个场景，在其他场景下 React 不期望用这个 hooks 。

###### **useInsertionEffect 模拟使用：**

```js
export default function Index(){

  React.useInsertionEffect(()=>{
     /* 动态创建 style 标签插入到 head 中 */
     const style = document.createElement('style')
     style.innerHTML = `
       .css-in-js{
         color: red;
         font-size: 20px;
       }
     `
     document.head.appendChild(style)
  },[])

  return <div className="css-in-js" > hello , useInsertionEffect </div>
}

```

如上模拟了 useInsertionEffect 的使用

#### 状态获取与传递

##### useContext

###### **useContext 基础介绍**

可以使用 useContext ，来获取父级组件传递过来的 context 值，这个当前值就是最近的父级组件 Provider 设置的 value 值，useContext 参数一般是由 createContext 方式创建的 ,也可以父级上下文 context 传递的 ( 参数为 context )。useContext 可以代替 context.Consumer 来获取 Provider 中保存的 value 值。

```js
const contextValue = useContext(context)
```

useContext 接受一个参数，一般都是 context 对象，返回值为 context 对象内部保存的 value 值。

###### **useContext 基础用法：**

```js
/* 用useContext方式 */
const DemoContext = ()=> {
    const value:any = useContext(Context)
    /* my name is alien */
return <div> my name is { value.name }</div>
}

/* 用Context.Consumer 方式 */
const DemoContext1 = ()=>{
    return <Context.Consumer>
         {/*  my name is alien  */}
        { (value)=> <div> my name is { value.name }</div> }
    </Context.Consumer>
}

export default ()=>{
    return <div>
        <Context.Provider value={{ name:'alien' , age:18 }} >
            <DemoContext />
            <DemoContext1 />
        </Context.Provider>
    </div>
}
```

##### useRef

###### **useRef 基础介绍：**

useRef 可以用来获取元素，缓存状态，接受一个状态 initState 作为初始值，返回一个 ref 对象 cur, cur 上有一个 current 属性就是 ref 对象需要获取的内容。

```js
const cur = React.useRef(initState)
console.log(cur.current)
```

###### **useRef 基础用法：**

**useRef 获取 DOM 元**素，在 React Native 中虽然没有 DOM 元素，但是也能够获取组件的节点信息（ fiber 信息 ）。

```js
const DemoUseRef = ()=>{
    const dom= useRef(null)
    const handerSubmit = ()=>{
        /*  <div >表单组件</div>  dom 节点 */
        console.log(dom.current)
    }
    return <div>
        {/* ref 标记当前dom节点 */}
        <div ref={dom} >表单组件</div>
        <button onClick={()=>handerSubmit()} >提交</button> 
    </div>
}
```

如上通过 useRef 来获取 DOM 节点。

**useRef 保存状态，** 可以利用 useRef 返回的 ref 对象来保存状态，只要当前组件不被销毁，那么状态就会一直存在。

```js
const status = useRef(false)
/* 改变状态 */
const handleChangeStatus = () => {
  status.current = true
}
```

#### 状态派生与保存

##### useMemo

useMemo 可以在函数组件 render 上下文中同步执行一个函数逻辑，这个函数的返回值可以作为一个新的状态缓存起来。那么这个 hooks 的作用就显而易见了：

场景一：在一些场景下，需要在函数组件中进行大量的逻辑计算，那么我们不期望每一次函数组件渲染都执行这些复杂的计算逻辑，所以就需要在 useMemo 的回调函数中执行这些逻辑，然后把得到的产物（计算结果）缓存起来就可以了。

场景二：React 在整个更新流程中，diff 起到了决定性的作用，比如 Context 中的 provider 通过 diff value 来判断是否更新

**useMemo 基础介绍：**

```js
const cacheSomething = useMemo(create,deps)
```

- ① create：第一个参数为一个函数，函数的返回值作为缓存值，如上 demo 中把 Children 对应的 element 对象，缓存起来。
- ② deps： 第二个参数为一个数组，存放当前 useMemo 的依赖项，在函数组件下一次执行的时候，会对比 deps 依赖项里面的状态，是否有改变，如果有改变重新执行 create ，得到新的缓存值。
- ③ acheSomething：返回值，执行 create 的返回值。如果 deps 中有依赖项改变，返回的重新执行 create 产生的值，否则取上一次缓存值。

**useMemo 基础用法：**

派生新状态：

```js
function Scope() {
    const keeper = useKeep()
    const { cacheDispatch, cacheList, hasAliveStatus } = keeper
   
    /* 通过 useMemo 得到派生出来的新状态 contextValue  */
    const contextValue = useMemo(() => {
        return {
            cacheDispatch: cacheDispatch.bind(keeper),
            hasAliveStatus: hasAliveStatus.bind(keeper),
            cacheDestory: (payload) => cacheDispatch.call(keeper, { type: ACTION_DESTORY, payload })
        }
      
    }, [keeper])
    return <KeepaliveContext.Provider value={contextValue}>
    </KeepaliveContext.Provider>
}
```

如上通过 useMemo 得到派生出来的新状态 contextValue ，只有 keeper 变化的时候，才改变 Provider 的 value 。

缓存计算结果：

```js
function Scope(){
    const style = useMemo(()=>{
      let computedStyle = {}
      // 经过大量的计算
      return computedStyle
    },[])
    return <div style={style} ></div>
}
```

缓存组件,减少子组件 rerender 次数：

```js
function Scope ({ children }){
   const renderChild = useMemo(()=>{ children()  },[ children ])
   return <div>{ renderChild } </div>
}
```

##### useCallback

###### **useCallback 基础介绍：**

useMemo 和 useCallback 接收的参数都是一样，都是在其依赖项发生变化后才执行，都是返回缓存的值，区别在于 useMemo 返回的是**函数运行的结果**，useCallback **返回的是函数**，这个回调函数是经过处理后的也就是说父组件传递一个函数给子组件的时候，由于是无状态组件每一次都会重新生成新的 props 函数，这样就使得每一次传递给子组件的函数都发生了变化，这时候就会触发子组件的更新，这些更新是没有必要的，此时我们就可以通过 usecallback 来处理此函数，然后作为 props 传递给子组件。

###### **useCallback 基础用法：**

```js
/* 用react.memo */
const DemoChildren = React.memo((props)=>{
   /* 只有初始化的时候打印了 子组件更新 */
    console.log('子组件更新')
   useEffect(()=>{
       props.getInfo('子组件')
   },[])
   return <div>子组件</div>
})

const DemoUseCallback=({ id })=>{
    const [number, setNumber] = useState(1)
    /* 此时usecallback的第一参数 (sonName)=>{ console.log(sonName) }
     经过处理赋值给 getInfo */
    const getInfo  = useCallback((sonName)=>{
          console.log(sonName)
    },[id])
    return <div>
        {/* 点击按钮触发父组件更新 ，但是子组件没有更新 */}
        <button onClick={ ()=>setNumber(number+1) } >增加</button>
        <DemoChildren getInfo={getInfo} />
    </div>
}
```

### 1.对 React Hook 的理解，它的实现原理是什么

React-Hooks 是 React 团队在 React 组件开发实践中，逐渐认知到的一个改进点，这背后其实涉及对**类组件**和**函数组件**两种组件形式的思考和侧重。

**（1）类组件：** 所谓类组件，就是基于 ES6 Class 这种写法，通过继承 React.Component 得来的 React 组件。以下是一个类组件：

```js
class DemoClass extends React.Component {
  state = {
    text: ""
  };
  componentDidMount() {
    //...
  }
  changeText = (newText) => {
    this.setState({
      text: newText
    });
  };

  render() {
    return (
      <div className="demoClass">
        <p>{this.state.text}</p>
        <button onClick={this.changeText}>修改</button>
      </div>
    );
  }
}
```

可以看出，React 类组件内部预置了相当多的“现成的东西”等着我们去调度/定制，state 和生命周期就是这些“现成东西”中的典型。要想得到这些东西，难度也不大，只需要继承一个 React.Component 即可。

当然，这也是类组件的一个不便，它太繁杂了，对于解决许多问题来说，编写一个类组件实在是一个过于复杂的姿势。复杂的姿势必然带来高昂的理解成本，这也是我们所不想看到的。除此之外，由于开发者编写的逻辑在封装后是和组件粘在一起的，这就使得**类组件内部的逻辑难以实现拆分和复用。**

**（2）函数组件**：函数组件就是以函数的形态存在的 React 组件。早期并没有 React-Hooks，函数组件内部无法定义和维护 state，因此它还有一个别名叫“无状态组件”。以下是一个函数组件：

```jsx
function DemoFunction(props) {
  const { text } = props
  return (
    <div className="demoFunction">
      <p>{`函数组件接收的内容：[${text}]`}</p>
    </div>
  );
}
```

相比于类组件，函数组件肉眼可见的特质自然包括轻量、灵活、易于组织和维护、较低的学习成本等。

通过对比，从形态上可以对两种组件做区分，它们之间的区别如下：

-   类组件需要继承 class，函数组件不需要；
-   类组件可以访问生命周期方法，函数组件不能；
-   类组件中可以获取到实例化后的 this，并基于这个 this 做各种各样的事情，而函数组件不可以；
-   类组件中可以定义并维护 state（状态），而函数组件不可以；

除此之外，还有一些其他的不同。通过上面的区别，我们不能说谁好谁坏，它们各有自己的优势。在 React-Hooks 出现之前，**类组件的能力边界明显强于函数组件。**

实际上，类组件和函数组件之间，是面向对象和函数式编程这两套不同的设计思想之间的差异。而函数组件更加契合 React 框架的设计理念： 

![image-20220701214125777](https://s2.loli.net/2022/07/01/OzjAem7D6UctS4I.png)

 React 组件本身的定位就是函数，一个输入数据、输出 UI 的函数。作为开发者，我们编写的是声明式的代码，而 React 框架的主要工作，就是及时地把声明式的代码转换为命令式的 DOM 操作，把数据层面的描述映射到用户可见的 UI 变化中去。这就意味着从原则上来讲，React 的数据应该总是紧紧地和渲染绑定在一起的，而类组件做不到这一点。**函数组件就真正地将数据和渲染绑定到了一起。函数组件是一个更加匹配其设计理念、也更有利于逻辑拆分与重用的组件表达形式。**

为了能让开发者更好的的去编写函数式组件。于是，React-Hooks 便应运而生。

React-Hooks 是一套能够使函数组件更强大、更灵活的“钩子”。

函数组件比起类组件少了很多东西，比如生命周期、对 state 的管理等。这就给函数组件的使用带来了非常多的局限性，导致我们并不能使用函数这种形式，写出一个真正的全功能的组件。而React-Hooks 的出现，就是为了帮助函数组件补齐这些（相对于类组件来说）缺失的能力。

如果说函数组件是一台轻巧的快艇，那么 React-Hooks 就是一个内容丰富的零部件箱。“重装战舰”所预置的那些设备，这个箱子里基本全都有，同时它还不强制你全都要，而是允许你自由地选择和使用你需要的那些能力，然后将这些能力以 Hook（钩子）的形式“钩”进你的组件里，从而定制出一个最适合你的“专属战舰”。

### 2.为什么 useState 要使用数组而不是对象

useState 的用法：

```jsx
const [count, setCount] = useState(0)
```

可以看到 useState 返回的是一个数组，那么为什么是返回数组而不是返回对象呢？

这里用到了解构赋值，所以先来看一下ES6 的解构赋值：

##### 数组的解构赋值

```jsx
const foo = [1, 2, 3];
const [one, two, three] = foo;
console.log(one);// 1
console.log(two);// 2
console.log(three);// 3
```

##### 对象的解构赋值

```jsx
const user = {
  id: 888,
  name: "xiaoxin"
};
const { id, name } = user;
console.log(id);// 888
console.log(name);// "xiaoxin"
```

看完这两个例子，答案应该就出来了：

-   如果 useState 返回的是数组，那么使用者可以对数组中的元素命名，代码看起来也比较干净
-   如果 useState 返回的是对象，在解构对象的时候必须要和 useState 内部实现返回的对象同名，想要使用多次的话，必须得设置别名才能使用返回值

下面来看看如果 useState 返回对象的情况：

```jsx
// 第一次使用
const { state, setState } = useState(false);
// 第二次使用
const { state: counter, setState: setCounter } = useState(0) 
```

这里可以看到，返回对象的使用方式还是挺麻烦的，更何况实际项目中会使用的更频繁。 **总结：**useState 返回的是 array 而不是 object 的原因就是为了**降低使用的复杂度**，返回数组的话可以直接根据顺序解构，而返回对象的话要想使用多次就需要定义别名了。

### 3.React Hooks 解决了哪些问题？

React Hooks 主要解决了以下问题：

**（1）在组件之间复用状态逻辑很难**

React 没有提供将可复用性行为“附加”到组件的途径（例如，把组件连接到 store）解决此类问题可以使用 render props 和 高阶组件。但是这类方案需要重新组织组件结构，这可能会很麻烦，并且会使代码难以理解。由 providers，consumers，高阶组件，render props 等其他抽象层组成的组件会形成“嵌套地狱”。尽管可以在 DevTools 过滤掉它们，但这说明了一个更深层次的问题：React 需要为共享状态逻辑提供更好的原生途径。

可以使用 Hook 从组件中提取状态逻辑，使得这些逻辑可以单独测试并复用。Hook 使我们在无需修改组件结构的情况下复用状态逻辑。 这使得在组件间或社区内共享 Hook 变得更便捷。

**（2）复杂组件变得难以理解**

在组件中，每个生命周期常常包含一些不相关的逻辑。例如，组件常常在 componentDidMount 和 componentDidUpdate 中获取数据。但是，同一个 componentDidMount 中可能也包含很多其它的逻辑，如设置事件监听，而之后需在 componentWillUnmount 中清除。相互关联且需要对照修改的代码被进行了拆分，而完全不相关的代码却在同一个方法中组合在一起。如此很容易产生 bug，并且导致逻辑不一致。

在多数情况下，不可能将组件拆分为更小的粒度，因为状态逻辑无处不在。这也给测试带来了一定挑战。同时，这也是很多人将 React 与状态管理库结合使用的原因之一。但是，这往往会引入了很多抽象概念，需要你在不同的文件之间来回切换，使得复用变得更加困难。

为了解决这个问题，Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据），而并非强制按照生命周期划分。你还可以使用 reducer 来管理组件的内部状态，使其更加可预测。

**（3）难以理解的 class**

除了代码复用和代码管理会遇到困难外，class 是学习 React 的一大屏障。我们必须去理解 JavaScript 中 this 的工作方式，这与其他语言存在巨大差异。还不能忘记绑定事件处理器。没有稳定的语法提案，这些代码非常冗余。大家可以很好地理解 props，state 和自顶向下的数据流，但对 class 却一筹莫展。即便在有经验的 React 开发者之间，对于函数组件与 class 组件的差异也存在分歧，甚至还要区分两种组件的使用场景。

为了解决这些问题，Hook 使你在非 class 的情况下可以使用更多的 React 特性。 从概念上讲，React 组件一直更像是函数。而 Hook 则拥抱了函数，同时也没有牺牲 React 的精神原则。Hook 提供了问题的解决方案，无需学习复杂的函数式或响应式编程技术

### 4.React Hook 的使用限制有哪些？

React Hooks 的限制主要有两条：

-   不要在循环、条件或嵌套函数中调用 Hook；
-   在 React 的函数组件中调用 Hook。

那为什么会有这样的限制呢？Hooks 的设计初衷是为了改进 React 组件的开发模式。在旧有的开发模式下遇到了三个问题。

-   组件之间难以复用状态逻辑。过去常见的解决方案是高阶组件、render props 及状态管理框架。
-   复杂的组件变得难以理解。生命周期函数与业务逻辑耦合太深，导致关联部分难以拆分。
-   人和机器都很容易混淆类。常见的有 this 的问题，但在 React 团队中还有类难以优化的问题，希望在编译优化层面做出一些改进。

这三个问题在一定程度上阻碍了 React 的后续发展，所以为了解决这三个问题，Hooks **基于函数组件**开始设计。然而第三个问题决定了 Hooks 只支持函数组件。

那为什么不要在循环、条件或嵌套函数中调用 Hook 呢？因为 Hooks 的设计是基于数组实现。在调用时按顺序加入数组中，如果使用循环、条件或嵌套函数很有可能导致数组取值错位，执行错误的 Hook。当然，实质上 React 的源码里不是数组，是链表。

这些限制会在编码上造成一定程度的心智负担，新手可能会写错，为了避免这样的情况，可以引入 ESLint 的 Hooks 检查插件进行预防。

### 5.useEffect 与 useLayoutEffect 的区别

**（1）共同点**

-   **运用效果：** useEffect 与 useLayoutEffect 两者都是用于处理副作用，这些副作用包括改变 DOM、设置订阅、操作定时器等。在函数组件内部操作副作用是不被允许的，所以需要使用这两个函数去处理。
-   **使用方式：** useEffect 与 useLayoutEffect 两者底层的函数签名是完全一致的，都是调用的 mountEffectImpl方法，在使用上也没什么差异，基本可以直接替换。

**（2）不同点**

-   **使用场景：** useEffect 在 React 的渲染过程中是被异步调用的，用于绝大多数场景；而 useLayoutEffect 会在所有的 DOM 变更之后同步调用，主要用于处理 DOM 操作、调整样式、避免页面闪烁等问题。也正因为是同步处理，所以需要避免在 useLayoutEffect 做计算量较大的耗时任务从而造成阻塞。
-   **使用效果：** useEffect是按照顺序执行代码的，改变屏幕像素之后执行（先渲染，后改变DOM），当改变屏幕内容时可能会产生闪烁；useLayoutEffect是改变屏幕像素之前就执行了（会推迟页面显示的事件，先改变DOM后渲染），不会产生闪烁。**useLayoutEffect总是比useEffect先执行。**

在未来的趋势上，两个 API 是会长期共存的，暂时没有删减合并的计划，需要开发者根据场景去自行选择。React 团队的建议非常实用，如果实在分不清，先用 useEffect，一般问题不大；如果页面有异常，再直接替换为 useLayoutEffect 即可。

### 6\.React Hooks在平时开发中需要注意的问题和原因

（1）**不要在循环，条件或嵌套函数中调用Hook，必须始终在 React函数的顶层使用Hook**

这是因为React需要利用调用顺序来正确更新相应的状态，以及调用相应的钩子函数。一旦在循环或条件分支语句中调用Hook，就容易导致调用顺序的不一致性，从而产生难以预料到的后果。

**（2）使用useState时候，使用push，pop，splice等直接更改数组对象的坑**

使用push直接更改数组无法获取到新值，应该采用析构方式，但是在class里面不会有这个问题。代码示例：

```jsx
function Indicatorfilter() {
  let [num,setNums] = useState([0,1,2,3])
  const test = () => {
    // 这里坑是直接采用push去更新num
    // setNums(num)是无法更新num的
    // 必须使用num = [...num ,1]
    num.push(1)
    // num = [...num ,1]
    setNums(num)
  }
return (
    <div className='filter'>
      <div onClick={test}>测试</div>
        <div>
          {num.map((item,index) => (
              <div key={index}>{item}</div>
          ))}
      </div>
    </div>
  )
}

class Indicatorfilter extends React.Component<any,any>{
  constructor(props:any){
      super(props)
      this.state = {
          nums:[1,2,3]
      }
      this.test = this.test.bind(this)
  }

  test(){
      // class采用同样的方式是没有问题的
      this.state.nums.push(1)
      this.setState({
          nums: this.state.nums
      })
  }

  render(){
      let {nums} = this.state
      return(
          <div>
              <div onClick={this.test}>测试</div>
                  <div>
                      {nums.map((item:any,index:number) => (
                          <div key={index}>{item}</div>
                      ))}
                  </div>
          </div>

      )
  }
}
```

（3）**useState设置状态的时候，只有第一次生效，后期需要更新状态，必须通过useEffect**

TableDeail是一个公共组件，在调用它的父组件里面，我们通过set改变columns的值，以为传递给TableDeail 的 columns是最新的值，所以tabColumn每次也是最新的值，但是实际tabColumn是最开始的值，不会随着columns的更新而更新：

```jsx
const TableDeail = ({
    columns,
}:TableData) => {
    const [tabColumn, setTabColumn] = useState(columns) 
}

// 正确的做法是通过useEffect改变这个值
const TableDeail = ({
    columns,
}:TableData) => {
    const [tabColumn, setTabColumn] = useState(columns) 
    useEffect(() =>{setTabColumn(columns)},[columns])
}
```

**（4）善用useCallback**

父组件传递给子组件事件句柄时，如果我们没有任何参数变动可能会选用useMemo。但是每一次父组件渲染子组件即使没变化也会跟着渲染一次。

**（5）不要滥用useContext**

可以使用基于 useContext 封装的状态管理工具。

### 7\.React Hooks 和生命周期的关系？

#### 对应关系

**函数组件** 的本质是函数，没有 state 的概念的，因此**不存在生命周期**一说，仅仅是一个 **render 函数**而已。 但是引入 **Hooks** 之后就变得不同了，它能让组件在不使用 class 的情况下拥有 state，所以就有了生命周期的概念，所谓的生命周期其实就是 `useState`、 `useEffect()` 和 `useLayoutEffect()` 。

即：**Hooks 组件（使用了Hooks的函数组件）有生命周期，而函数组件（未使用Hooks的函数组件）是没有生命周期的**。

下面是具体的 class 与 Hooks 的**生命周期对应关系**：

-   `constructor`：函数组件不需要构造函数，可以通过调用 `useState 来初始化 state`。如果计算的代价比较昂贵，也可以传一个函数给 `useState`。

```jsx
const [num, UpdateNum] = useState(0)
```

-   `getDerivedStateFromProps`：一般情况下，我们不需要使用它，可以在**渲染过程中更新 state**，以达到实现 `getDerivedStateFromProps` 的目的。

```jsx
function ScrollView({row}) {
  let [isScrollingDown, setIsScrollingDown] = useState(false);
  let [prevRow, setPrevRow] = useState(null);
  if (row !== prevRow) {
    // Row 自上次渲染以来发生过改变。更新 isScrollingDown。
    setIsScrollingDown(prevRow !== null && row > prevRow);
    setPrevRow(row);
  }
  return `Scrolling down: ${isScrollingDown}`;
}
```

React 会立即退出第一次渲染并用更新后的 state 重新运行组件以避免耗费太多性能。

-   `shouldComponentUpdate`：可以用 `**React.memo**` 包裹一个组件来对它的 `props` 进行浅比较

```jsx
const Button = React.memo((props) => {  // 具体的组件});
```

注意：`**React.memo 等效于 **``**PureComponent**`，它只浅比较 props。这里也可以使用 `useMemo` 优化每一个节点。

-   `render`：这是函数组件体本身。
-   `componentDidMount`, `componentDidUpdate`： `useLayoutEffect` 与它们两的调用阶段是一样的。但是，我们推荐你**一开始先用 useEffect**，只有当它出问题的时候再尝试使用 `useLayoutEffect`。`useEffect` 可以表达所有这些的组合。

```jsx
// componentDidMount
useEffect(()=>{
  // 需要在 componentDidMount 执行的内容
}, [])
useEffect(() => { 
  // 在 componentDidMount，以及 count 更改时 componentDidUpdate 执行的内容
  document.title = `You clicked ${count} times`; 
  return () => {
    // 需要在 count 更改时 componentDidUpdate（先于 document.title = ... 执行，遵守先清理后更新）
    // 以及 componentWillUnmount 执行的内容       
  } // 当函数中 Cleanup 函数会按照在代码中定义的顺序先后执行，与函数本身的特性无关
}, [count]); // 仅在 count 更改时更新
```

**请记得 React 会等待浏览器完成画面渲染之后才会延迟调用 ，因此会使得额外操作很方便**

-   `componentWillUnmount`：相当于 `useEffect` 里面返回的 `cleanup` 函数

```jsx
// componentDidMount/componentWillUnmount
useEffect(()=>{
  // 需要在 componentDidMount 执行的内容
  return function cleanup() {
    // 需要在 componentWillUnmount 执行的内容      
  }
}, [])
```

-   `componentDidCatch` and `getDerivedStateFromError`：目前**还没有**这些方法的 Hook 等价写法，但很快会加上。

| **class 组件**           | **Hooks 组件**            |
| ------------------------ | ------------------------- |
| constructor              | useState                  |
| getDerivedStateFromProps | useState 里面 update 函数 |
| shouldComponentUpdate    | useMemo                   |
| render                   | 函数本身                  |
| componentDidMount        | useEffect                 |
| componentDidUpdate       | useEffect                 |
| componentWillUnmount     | useEffect 里面返回的函数  |
| componentDidCatch        | 无                        |
| getDerivedStateFromError | 无                        |

#### [**React Hooks 如何模拟生命周期**](https://blog.csdn.net/sinat_17775997/article/details/123838210)



在 React 16.8 之前，函数组件只能是无状态组件，也不能访问 react 生命周期。hook 做为 react 新增特性，可以让我们在不编写 class 的情况下使用 state 以及其他的 react 特性，例如生命周期。接下来我们便举例说明如何使用 hooks 来模拟比较常见的 class 组件生命周期。

##### constructor

class 组件

```js
class Example extends Component {
    constructor() {
        super();
        this.state = {
            count: 0
        }
    }
    render() {
      return null;
  }
}
```

函[数组](https://so.csdn.net/so/search?q=数组&spm=1001.2101.3001.7020)件不需要构造函数,可以通过调用 useState 来初始化 state

```javascript
function Example() {
  const [count, setCount] = useState(0);
  return null;
}
```

##### componentDidMount

class 组件访问 componentDidMount

```js
class Example extends React.Component {
  componentDidMount() {
    console.log('I am mounted!');
  }
  render() {
    return null;
  }
}
```

使用 hooks 模拟 componentDidMount

```javascript
function Example() {
  useEffect(() => console.log('mounted'), []);
  return null;
}
```

useEffect 拥有两个参数，第一个参数作为回调函数会在浏览器布局和绘制完成后调用，因此它不会阻碍浏览器的渲染进程。
第二个参数是一个数组

- 当数组存在并有值时，如果数组中的任何值发生更改，则每次渲染后都会触发回调。
- 当它不存在时，每次渲染后都会触发回调。
- 当它是一个空列表时，回调只会被触发一次，类似于 componentDidMount。

##### shouldComponentUpdate

class 组件访问 shouldComponentUpdate

```javascript
shouldComponentUpdate(nextProps, nextState){
  console.log('shouldComponentUpdate')
  // return true 更新组件
  // return false 则不更新组件
}
```

hooks 模拟 shouldComponentUpdate

```javascript
const MyComponent = React.memo(
    _MyComponent, 
    (prevProps, nextProps) => nextProps.count !== prevProps.count
)
```

React.memo 包裹一个组件来对它的 props 进行浅比较,但这不是一个 hooks，因为它的写法和 hooks 不同,其实React.memo 等效于 PureComponent，但它只比较 props。

##### componentDidUpdate

class 组件访问 componentDidUpdate

```javascript
componentDidMount() {
  console.log('mounted or updated');
}
 
componentDidUpdate() {
  console.log('mounted or updated');
}
```

使用 hooks 模拟 componentDidUpdate

```js
useEffect(() => console.log('mounted or updated'));
```

值得注意的是，这里的回调函数会在每次渲染后调用，因此不仅可以访问 componentDidUpdate，还可以访问componentDidMount，如果只想模拟 componentDidUpdate，我们可以这样来实现。

```javascript
const mounted = useRef();
useEffect(() => {
  if (!mounted.current) {
    mounted.current = true;
  } else {
   console.log('I am didUpdate')
  }
});
```

useRef 在组件中创建“实例变量”。它作为一个标志来指示组件是否处于挂载或更新阶段。当组件更新完成后在会执行 else 里面的内容，以此来单独模拟 componentDidUpdate。

##### componentWillUnmount

class 组件访问 componentWillUnmount

```javascript
componentWillUnmount() {
  console.log('will unmount');
}
```

hooks 模拟 componentWillUnmount

```javascript
useEffect(() => {
  return () => {
    console.log('will unmount');
  }
}, []);
```

当在 useEffect 的回调函数中返回一个函数时，这个函数会在组件卸载前被调用。我们可以在这里面清除定时器或事件监听器。

##### 总结

引入 hooks 的函数组件功能越来越完善，在多数情况下，我们完全可以使用 hook 来替代 class 组件。并且使用函数组件也有以下几点好处。

- 纯函数概念，同样的 props 会得到同样的渲染结果。
- 可以使用函数组合，嵌套，实现功能更加强大的组件。
- 组件不会被实例化，整体渲染性能得到提升。

但是 hooks 模拟的生命周期与class中的生命周期不尽相同，我们在使用时，还是需要思考业务场景下那种方式最适合。

### 8.**React Hook 的设计模式**

Dan 在 React Hooks 的介绍中 曾经说过：“忘记生命周期，以 effects 的方式开始思考”

#### **React.memo vs React.useMemo**

React.memo 是一个高阶组件，它的效果类似于 React.pureComponent。但在 Hooks 的场景下，更推荐使用 React.useMemo，因为它存在这样一个问题。就像如下的代码一样：

```js
function Banner() {
  let appContext = useContext(AppContext);
  let theme = appContext.theme;
  return <Slider theme={theme} />
}
export default React.memo(Banner)
```

这段代码的意义是这样的，通过 useContext 获取全局的主题信息，然后给 Slider 组件换上主题。但是如果给最外层的 Banner 组件加上 React.memo，那么外部更新 appContext 的值的时候，Slider 就会被触发重渲染。

当然，我们可以通过**分拆组件**的方式阻断重渲染，但使用 React.useMemo 可以实现更精细化的控制。就像下面的代码一样，为 Slider 组件套上 React.useMemo，写上 theme 进行控制。

```js
function Banner() {
  let appContext = useContext(AppContext);
  let theme = appContext.theme;
  return React.useMemo(() => {
    return <Slider theme={theme} />;
  }, [theme])
}
export default React.memo(Banner)
```

所有考虑到更宽广的使用场景与可维护性，更推荐使用 React.useMemo。

**（2）常量**

由于函数组件每次渲染时都会重新执行，所以常量应该放置到函数外部去，避免每次都重新创建。而如果定义的常量是一个函数，且需要使用组件内部的变量做计算，那么一定要使用 useCallback 缓存函数。

**（3）useEffect 第二个参数的判断问题**

在设计上它同样是进行浅比较，如果传入的是引用类型，那么很容易会判定不相等，所以尽量不要使用引用类型作为判断条件，很容易出错。

#### 组合hooks

在这个案例中将 User 的所有操作归到一个自定义 Hook 中去操作，最终返回的值有 users、addUsers 及 deleteUser。其中 users 是通过 useState 获取；addUser 是通过 setUsers 添加 user 完成；deleteUser 通过过滤 userId 完成。代码如下所示：

```jsx
function useUsersManagement() {
  const [users, setUsers] = useState([]);
 
  function addUser(user) {
    setUsers([
      ...users,
      user
    ])
  }
 
  function deleteUser(userId) {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex > -1) {
      const newUsers = [...users];
      newUsers.splice(userIndex, 1);
      setUsers(
        newUsers
      );
    }
  }
 
  return {
    users,
    addUser,
    deleteUser
  }
}
```

第二部分是通过 useAddUserModalManagement 这一个自定义 Hook 控制 Modal 的开关。与上面的操作类似。isAddUserModalOpened 表示了当前处于 Modal 开关状态，openAddUserModal 则是打开，closeAddUserModal 则是关闭。如下代码所示：

```jsx
function useAddUserModalManagement() {
  const [isAddUserModalOpened, setAddUserModalVisibility] = useState(false);
 
  function openAddUserModal() {
    setAddUserModalVisibility(true);
  }
 
  function closeAddUserModal() {
    setAddUserModalVisibility(false);
  }
  return {
    isAddUserModalOpened,
    openAddUserModal,
    closeAddUserModal
  }
}
```

最后来看看在代码中运用的情况，引入 useUsersManagement 和 useAddUserModalManagement 两个自定义 Hook，然后在组件 UsersTable 与 AddUserModal 直接使用。UsersTable 直接展示 users 相关信息，通过操作 deleteUser 可以控制删减 User。AddUserModal 通过 isAddUserModalOpened 控制显隐，完成 addUser 操作。代码如下所示：

```js
import React from 'react';
import AddUserModal from './AddUserModal';
import UsersTable from './UsersTable';
import useUsersManagement from "./useUsersManagement";
import useAddUserModalManagement from "./useAddUserModalManagement";
 
const Users = () => {
  const {
    users,
    addUser,
    deleteUser
  } = useUsersManagement();
  const {
    isAddUserModalOpened,
    openAddUserModal,
    closeAddUserModal
  } = useAddUserModalManagement();
 
  return (
    <>
      <button onClick={openAddUserModal}>Add user</button>
      <UsersTable
        users={users}
        onDelete={deleteUser}
      />
      <AddUserModal
        isOpened={isAddUserModalOpened}
        onClose={closeAddUserModal}
        onAddUser={addUser}
      />
    </>
  )
};
 
export default Users;
```

在上面的例子中，我们可以看到组件内部的逻辑已经被自定义 Hook 完全抽出去了。外观模式很接近提到的容器组件的概念，即在组件中通过各个自定义 Hook 去操作业务逻辑。每个自定义 Hook 都是一个独立的子模块，有属于自己的领域模型。基于这样的设计就可以避免 Hook 之间逻辑交叉，提升复用性。

#### 总结

首先用 Hooks 开发需要抛弃生命周期的思考模式，以 effects 的角度重新思考。过去类组件的开发模式中，在 componentDidMount 中放置一个监听事件，还需要考虑在 componentWillUnmount 中取消监听，甚至可能由于部分值变化，还需要在其他生命周期函数中对监听事件做特殊处理。在 Hooks 的设计思路中，可以将这一系列监听与取消监听放置在一个 useEffect 中，useEffect 可以不关心组件的生命周期，只需要关心外部依赖的变化即可，对于开发心智而言是极大的减负。这是 Hooks 的设计根本。

在这样一个认知基础上，我总结了一些在团队内部开发实践的心得，做成了开发规范进行推广。

第一点就是 **React.useMemo 取代 React.memo，因为 React.memo 并不能控制组件内部共享状态的变化，而 React.useMemo 更适合于 Hooks 的场景**。

第二点就是常量，在类组件中，我们很习惯将常量写在类中，但在组件函数中，这意味着每次渲染都会重新声明常量，这是完全无意义的操作。其次就是组件内的函数每次会被重新创建，如果这个函数需要使用函数组件内部的变量，那么可以用 useCallback 包裹下这个函数。

第三点就是 useEffect 的第二个参数容易被错误使用。很多同学习惯在第二个参数放置引用类型的变量，通常的情况下，引用类型的变量很容易被篡改，难以判断开发者的真实意图，所以更推荐使用值类型的变量。当然有个小技巧是 JSON 序列化引用类型的变量，也就是通过 JSON.stringify 将引用类型变量转换为字符串来解决。但不推荐这个操作方式，比较消耗性能

### 9.Hooks中如何获取上一轮的state

我们可以通过ref来保存上一轮获取到的state，代码如下

```js
function Counter() {
  const [count, setCount] = useState(0);

  const prevCountRef = useRef();
  useEffect(() => {
    prevCountRef.current = count;
  });
  const prevCount = prevCountRef.current;

  return <h1>Now: {count}, before: {prevCount}</h1>;
}
```

为了方便复用我们可以把它封装成一个hooks进行使用：

```js
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

> 解决的办法确实是找到了，但是凡事都的问一个为什么。我们需要理解一下为什么这么做就可以实现。

我们知道在react中useEffect中的操作表现的像是**异步**的，就是说每次执行useEffect代码块的时候都会将它放到一个链表中，等到同步的代码执行完成后再统一执行链表中的内容。所以此时useRef中的值还没有被修改，还是保存的上一轮的值，所以能够被访问到

### 10.setState和useState

类组件中的 `setState` 和函数组件中的 `useState` 有什么异同？ 

**相同点：**

-   首先从原理角度出发，setState和 useState 更新视图，底层都调用了 scheduleUpdateOnFiber 方法，而且事件驱动情况下都有批量更新规则。

**不同点**

-   在**不是 pureComponent 组件模式**下， setState 不会浅比较两次 state 的值，**只要调用 setState，在没有其他优化手段的前提下，就会执行更新**。但是 useState 中的 dispatchAction 会**默认比较两次 state 是否相同，然后决定是否更新组件**。

-   **setState 有专门监听 state 变化的回调函数 callback，可以获取最新state；但是在函数组件中，只能通过 useEffect 来执行 state 变化引起的副作用。**

-   setState 在底层处理逻辑上主要是和老 state 进行合并处理，而 useState 更倾向于重新赋值。

-   **setState会将多个调用合并为一个来执行**，也就是说，当执行setState的时候，state中的数据并不会马上更新

-   **同步执行时useState也会对state进行逐个处理，而setState则只会处理最后一次**

**setState和useState是看起来像异步的同步，因为react的合并机制，多次调用不会立即更新，setState是合并state,useState是执行最后一次，延迟执行但本身还在一个事件循环，如果脱离react事件，如原生事件或者setTimeout/promise.then里执行setState和useState，就会得到同步代码。**

只要你进入了 `react` 的调度流程，那就是异步的。只要你没有进入 `react` 的调度流程，那就是同步的。什么东西不会进入 `react` 的调度流程？ `setTimeout` `setInterval` ，直接在 `DOM` 上绑定原生事件等。这些都不会走 `React` 的调度流程，你在这种情况下调用 `setState` ，那这次 `setState` 就是同步的。 否则就是异步的。

而 `setState` 同步执行的情况下， `DOM` 也会被同步更新，也就意味着如果你多次 `setState` ，会导致多次更新，这是毫无意义并且浪费性能的。

**同步更新解决方法**

react的`setState`是不能变成同步的, 不论是在`函数组件`或是`class组件`

```coffeescript
setState({
    name: 'Ruofee'
}, () => {
    // setState回调函数
});
```

此处只是set state之后的一个回调, 实际上是等组件重新render再执行, 因此还是异步的
若是想监听`useState`某个值, 可以使用副作用钩子:

```js
useEffect(() => {
    // 监听name变化
}, [name]);
```

需要知道的是, 初始化时`useEffect`总会调用一次



### 11.useSate异步更新

#### 引入

```javascript
function App() {
  const [n, setN] = useState(0)
  const onClick = ()=>{
    setN(n+1)
    setN(n+1) //  此时发现，n只能+1，而不会+2
    // setN(i=>i+1)
    // setN(i=>i+1)
  }
  return (
    <div className="App">
      <h1>n: {n}</h1>
      <button onClick={onClick}>+2</button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
```

react代码如上图：

- 直觉上当我们点击button，应该会执行两次setN，n变为2。
- **实际上：n变为了1**

#### 简单分析

**Fiber 对象**的上有一个**记录内部 `State` 对象的属性**，以便让我们能在**下次渲染的时候取到上一次的值**，叫做 `memoizedState` 。有了这个属性，我们的 FunctionComponent 就能有和 ClaassComponent 一样使用 `this.setState` 的能力了。

`Fiber.memoizedState` 是一个**单项链表**的结构。首先，我们的每一个 useState 都会在后面生成一个 hook 节点。而它会把当前组件所有 useState 对应的 hook 节点用 `next` 指针串起来，头结点就是 `Fiber.memoizedState`。 我们初始化的目的就是为了构造完成它。

hooks 以链表的形式存储在fiber节点的memoizedState属性上 

![[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-gUZAW6IT-1653354708608)(/Users/jianshuangpeng/Library/Application Support/typora-user-images/image-20220124173020063.png)]](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/1c9519aa1712481ea2f8c0ef03de19e5.png)

分析：

1、在组件第一次渲染的时候，为每个hooks都创建了一个对象, 最终形成了一个链表.

2、在组件更新的过程中，hooks函数执行的顺序是不变的，就可以根据这个链表拿到当前hooks对应的`Hook`对象，函数式组件就是这样拥有了state的能力。

react中虚拟dom----workInProgress树有一个**memoizedState**属性,这个属性是用来存放hooks相关信息的,也就是说state是存在虚拟dom里面的.

hooks信息是一个对象.这个对象里除了本身的值和更新函数外,还需要记录一些其他的信息,比如下一次的useState更新指向的hook信息等.那假如一个函数组件中有多个useState怎么办?hooks采用了数组存放的形式,也就算是在同一个组件中,所有的**hook对象**是存    在一个**数组**中的.如:

```js
 _hook :[
        {value:1,uplate:function1,next:hook1},
        {value:2,uplate:function2,next:hook2}
]
```

useState更新时,会**依次**去执行hook对象数组里面的更新函数,从而修改虚拟dom,然后在完成一次组件更新后，会把当前workInProgress树赋值给current树，current会在commit阶段替换成真实的Dom树

**我们再回头解释一下hooks使用的规则1,为什么hooks只能在顶层调用?**

 diff算法会根据前后的虚拟dom去更新,useState也存在这个现象.也就是说,useState会根据前后的虚拟dom去更新,而hook信息是存在虚拟dom里面的,也就是说,会存在前后两个hook对象数组.而数据的对比更新是按照下标来的.也就是说,假如前后的数组长度不一样,就  会导致更新混乱,即useState的使用必须是明确而且不变的.假如

```js
if(a>0){
  const [state,setState] =useState()
}

const [state1,setState1]=useState()
```

这种结果会出现什么现象?a大于0和小于0的时候hooks数组长度和顺序是不一致的

a>0

```js
 _hook :[
        {value:1,uplate:function1,next:hook1},
        {value:2,uplate:function2,next:hook2}
]
```

a<=0

```js
 _hook :[
        {value:2,uplate:function2,next:hook2}
]
```

也就是说,当我a<=0时,更新state1会拿到value:1的值,因为a<=0时,state1的索引是0,而0对应旧hook数组里的value:1,而不是它原本应该在的value:2.

**总结一下原因就是,hooks信息是存在数组里的,而每次更新都是根据索引更新的,因此,usestate的使用必须是明确的,保证hoos数组的元素数量是一致的.**

#### 为什么n是1，而不是2？

- 我们知道：
    1. useState每次执行会返回一个新的state（简单类型的等值拷贝）
    2. setState会触发UI更新（重新render，执行函数组件）
    3. 由于UI更新是异步任务，所以setState也是一个异步过程

当我们两次`setN(n+1)`时候，实际上形成了两个**闭包**，都保存了对此时n的状态（n=0）的引用。
在setN后：

1. 先分别生成了两个新的n，数值上都等于n+1（即1），但彼此无关。
2. 分别进行了render，而只有最新一次render有效，此次render引用了最后一次setN函数里生成的n。

#### 解决方法

1.利用函数，接收旧值，进行更新

```js
// 利用函数，接收旧值，进行更新
setState( x => x+1 )
```

- 接收的函数 `x=>x+1` 并未保持对n的引用，而是表达了一种 **加1** 操作
- 推荐使用函数代码进行 `setState`

2.通过useEffect

```js
const [state,setState] = useState(123);
useEffect(()=>{
// 这里能拿到最新的state
},[state])
```



### 12.使用useState更新变量后，怎么拿到变量更新后的值

场景： const [count, setCount] = useState(0)；

在setCount() 更新变量的值后，立即调用某个函数query，在函数中需要读取到这个变量的新值；但是此时直接调用的话拿到的是旧值； 

**为什么变量更新后不能立即拿到新值？** 因为setCount 函数用于更新 count值。它接收一个新的 count 值并将组件的一次重新渲染加入队列中，在组件的重新渲染中，useState()返回的第一个值始终是count更新后的新值，所以**如果组件还未重新渲染就直接读取count变量的话，拿到的就是未更新的旧值**；

```typescript
const UseState = () => {
  // 函数组件中没有this
  const [count, setCount] = useState(0)
 
  const add = () => {
    let newCount = count
    console.log('value1', count);  // 0
    setCount( newCount+= 1)
    console.log('value2', count);  // 0
    query() 
  }
 
  const query = () => {
    console.log('query函数中：', count);  // 0
  }
  return (
    <div>
      <p>{count}</p>
      <button onClick={add} >增加</button>
    </div>
  )
}
```

 打印结果：

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/11541613c7b245458f5cf25d7a5153a3.png) 

 解决方法：

1）可以将count的新值通过函数传参的方式传入query函数；

```js
// 改写add和query函数；
 
const add = () => {
    let newCount = count
    console.log('value1', count);
    setCount( newCount+= 1)
    console.log('value2', count);
    query(newCount)   
 }
 const query = (count) => {
    console.log('query函数中：', count);
 }
```

打印结果： 

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/8e58daf8256d48c299e533c692083253.png)

 2）在useEffect中调用query函数，因为**在useEffect中，组件dom已经更新完毕**，可以拿到count的最新值；（缺点：每次count值改变，都会触发useEffect，从而执行query函数；）

```js
  // 组件每次渲染之后执行的操作，执行该操作时dom都已经更新完毕
  useEffect(()=>{
    // 1、可在此处拿到count更新后的值
    console.log('value3', count);
    query()
  }, [count])
 
  const add = () => {
    let newCount = count
    console.log('value1', count);
    setCount( newCount+= 1)
    console.log('value2', count);
  }
 const query = () => { 
   console.log('query函数中：', count);
 }
```

打印结果： 

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/b8c0487eb1ce4e3e8ac74beae8912b9a.png)

 3）通过useRef()定义一个可变的ref变量，通过current属性保存count可变值，从而在count更新后，通过ref的current属性拿到更新后的count值；注意：调用query函数时需要加上setTimeout()进行调用；

```js
// 定义一个可变的countRef对象，该对象的current属性被初始化为传入的参数count;
const countRef = useRef(count)
 
// 在countRef.current属性中保存一个可变值count的盒子；
countRef.current = count
 
const add = () => {
   let newCount = count
   console.log('value1', count);
   setCount( newCount+= 1)
   console.log('value2', count);
   setTimeout(() => query(), 0);
}
 
const query = () => {
   console.log('query函数中：', countRef.current);
}
```

打印结果： 

 ![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/611e36640f634bf88387b36c65276aa8.png)

### 13.useEffect的执行

#### 问题

作为`React`开发者，你能答上如下两个问题么：

1.对于如下函数组件：

```js
function Child() {
  useEffect(() => {
    console.log('child');
  }, [])

  return <p>hello</p>;
}

function Parent() {
  useEffect(() => {
    console.log('parent');
  }, [])

  return <Child/>;
}

function App() {
  useEffect(() => {
    console.log('app');
  }, [])

  return <Parent/>;
}

```

渲染`<App/>`时控制台的打印顺序是？

`child -> parent -> app`

2.如下两个回调函数的调用时机相同么？

不同

```js
// componentDidMount生命周期钩子
class App extends React.Component {
  componentDidMount() {
    console.log('hello');
  }
}

// 依赖为[]的useEffect
useEffect(() => {
  console.log('hello');
}, [])
```

两个问题分别考察的是：

- `useEffect`的执行顺序
- `useEffect`如何介入`React`工作流程

#### useEffect的执行顺序

`React`的源码可以拆分为三块：

- 调度器：调度更新
- 协调器：决定更新的内容
- 渲染器：将更新的内容渲染到视图中

其中，只有`渲染器`会执行渲染视图操作。

对于浏览器环境来说，只有`渲染器`会执行类似`appendChild`、`insertBefore`这样的`DOM`操作。

`协调器`如何决定更新的内容呢？

答案是：他会为需要更新的内容对应的`fiber`（可以理解为`虚拟DOM`）打上标记。

这些被打标记的`fiber`会形成一条链表`effectList`。

`渲染器`会遍历`effectList`，执行标记对应的操作。

- 比如`Placement`标记对应插入`DOM`
- 比如`Update`标记对应更新`DOM`属性

`useEffect`也遵循同样的工作原理：

1. 触发更新时，`FunctionComponent`被执行，执行到`useEffect`时会判断他的第二个参数`deps`是否有变化。
2. 如果`deps`变化，则`useEffect`对应`FunctionComponent`的`fiber`会被打上`Passive`（即：需要执行useEffect）的标记。
3. 在`渲染器`中，遍历`effectList`过程中遍历到该`fiber`时，发现`Passive`标记，则依次执行该`useEffect`的`destroy`（即`useEffect`回调函数的返回值函数）与`create`（即`useEffect`回调函数）。

其中，前两步发生在`协调器`中。

所以，`effectList`构建的顺序就是`useEffect`的执行顺序。

#### effectList

`协调器`的工作流程是使用`遍历`实现的`递归`。所以可以分为`递`与`归`两个阶段。

我们知道，`递`是从根节点向下一直到叶子节点，`归`是从叶子节点一路向上到根节点。

`effectList`的构建发生在`归`阶段。所以，`effectList`的顺序也是从叶子节点一路向上。

`useEffect`对应`fiber`作为`effectList`中的一个节点，他的调用逻辑也遵循`归`的流程。

现在，我们有充足的知识回答第一个问题：

由于`归`阶段是从`Child`到`Parent`到`App`，所以相应`effectList`也是同样的顺序。

所以`useEffect`回调函数执行也是同样的顺序。

#### 渲染

按照流程，`effectList`会在`渲染器`中被处理。

对于`useEffect`来说，遍历`effectList`时，会找到的所有包含`Passive`标记的`fiber`。

依次执行对应`useEffect`的`destroy`。

所有`destroy`执行完后，再依次执行所有`create`。

整个过程是在页面渲染后异步执行的。

回答第二个问题：

如果`useEffect`的`deps`为`[]`，由于`deps`不会改变，对应`fiber`只会在`mount`时被标记`Passive`。

这点是类似`componentDidMount`的。

但是，处理`Passive` `effect`是在渲染完成后异步执行，而`componentDidMount`是在渲染完成后同步执行，所以他们是不同的。

#### 依赖问题

1.当第二个参数是空，**挂载和更新都渲染**。

2.当第二个参数是空数组[]，**挂载进行渲染**。

3.当[数据]  

当依赖是**基础数据类型**时，**挂载和更新渲染**

当依赖是**引用类型,数组和对象**时，会一直渲染 ，因为useEffect是**浅层对比**，**每次比较返回的结果都是false**

4.解决办法：

A={a:1,b:1}

useEffect(()=>{},[A]

1、依赖改为设置对象或者数组中的某个值，如useEffect(()=>{},[A.a]

2、使用usePrevious,利用useRef能保存上一次渲染内容的办法

```typescript
import React, { useState, useRef, useEffect } from 'react'
function usePrevious<T>(state: T, compare?: (prev: T | undefined, next: T) => boolean): T | undefined {
	const ref = useRef < T > ();
	useEffect(() => {
		const needUpdate = typeof compare === 'function' ? compare(ref.current, state) : true;
		if (needUpdate) {
			ref.current = state;
		}
	});

	return ref.current;
}

function A(props) {
	const [obj, setObj] = useState({ a: 1, b: 1 })
	const preObj = usePrevious(obj)
	useEffect(() => {
		if (preObj && preObj.a != obj.a)
			console.log(obj.a)

	}, [obj]);
	return (
		<></>
	)

}
```

### hooks案例

[hooks的典型案例](https://blog.csdn.net/jiaojsun/article/details/105298510)

#### 清除 effect

通常，组件卸载时需要清除 effect 创建的诸如订阅或计时器 ID 等资源。要实现这一点，useEffect 函数需返回一个清除函数。也就是说，要想在组件销毁的时候搞一些事情，需要useEffect 末尾返回一个函数，在这个函数里面可以写具体销毁的内容。

看下面的例子，在当前页面里面，页面的标题是'测试title'，当切换到其他页面时，页面的标题变成‘前端精读’

```js
import React, { useEffect } from 'react';

function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
    return () => {
      console.log('销毁1————————————————');
      document.title = '前端精读';
    };
  }, [title]);
}

export default function CheckboxDemo() {
  useDocumentTitle('测试title');

  return <div />;
}
```

#### 监听页面大小变化，网络是否断开

效果：在组件调用 useWindowSize 时，可以拿到页面大小，并且在浏览器缩放时自动触发组件更新。

```js
import React, { useEffect, useState } from 'react';

function getSize() {
  return {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth,
  };
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState(getSize());

  function handleResize() {
    setWindowSize(getSize());
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, []);
  return windowSize;
}

export default function Demo() {
  const windowSize = useWindowSize();
  return <div>页面宽度{windowSize.innerWidth}</div>;
}

动态注入 css
效果：在页面注入一段 class，并且当组件销毁时，移除这个 class。

const className = useCss({
  color: "red"
});

return <div className={className}>Text.</div>;
```

实现：可以看到，Hooks 方便的地方是在组件销毁时移除副作用，所以我们可以安心的利用 Hooks 做一些副作用。注入 css 自然不必说了，而销毁 css 只要找到注入的那段引用进行销毁即可，具体可以看这个 代码片段。

DOM 副作用修改 / 监听场景有一些现成的库了，从名字上就能看出来用法： document-visibility、 network-status、 online-status、 window-scroll-position、 window-size、 document-title。
组件辅助
Hooks 还可以增强组件能力，比如拿到并监听组件运行时宽高等。

#### 获取组件宽高

效果：通过调用 useComponentSize 拿到某个组件 ref 实例的宽高，并且在宽高变化时，rerender 并拿到最新的宽高。

```js
import React, { useLayoutEffect, useState, useRef } from 'react';

function getSize(el) {
  if (!el) {
    return {};
  }

  return {
    width: el.offsetWidth,
    height: el.offsetHeight,
  };
}

function useComponentSize(ref) {
  const [ComponentSize, setComponentSize] = useState(getSize(ref.current));

  function handleResize() {
    if (ref && ref.current) {
      setComponentSize(getSize(ref.current));
    }
  }

  useLayoutEffect(() => {
    handleResize();

let resizeObserver = new ResizeObserver(() => handleResize());
resizeObserver.observe(ref.current);

return () => {
  resizeObserver.disconnect(ref.current);
  resizeObserver = null;
};

  }, []);
  return ComponentSize;
}

export default function Demo() {
  const ref = useRef(null);
  const componentSize = useComponentSize(ref);
  return (
    <>
      {componentSize.width}

      <textarea ref={ref} />

    </>
  );
}
```

#### 拿到组件 onChange 抛出的值 

效果：通过 useInputValue() 拿到 Input 框当前用户输入的值，而不是手动监听 onChange 再腾一个 otherInputValue 和一个回调函数把这一堆逻辑写在无关的地方。

```js
import React, { useState, useCallback } from 'react';

function useInputValue(initialValue) {
  const [value, setValue] = useState(initialValue);
  const onChange = useCallback(function(e) {
    setValue(e.currentTarget.value);
  }, []);
  return {
    value,
    onChange,
  };
}

export default function Demo() {
  const name = useInputValue('jjsun');
  return (
    <>
      {name.value}
      <input {...name} />
    </>
  );
}

```



### hooks原理

#### function组件和class组件本质的区别

在解释`react-hooks`原理的之前，我们要加深理解一下， **函数组件和类组件到底有什么区别**，废话不多说，我们先看 两个代码片段。

```jsx
class Index extends React.Component<any,any>{
    constructor(props){
        super(props)
        this.state={
            number:0
        }
    }
    handerClick=()=>{
       for(let i = 0 ;i<5;i++){
           setTimeout(()=>{
               this.setState({ number:this.state.number+1 })
               console.log(this.state.number)
           },1000)
       }
    }

    render(){
        return <div>
            <button onClick={ this.handerClick } >num++</button>
        </div>
    }
}
```

打印结果？

再来看看函数组件中：

```jsx
function Index(){
    const [ num ,setNumber ] = React.useState(0)
    const handerClick=()=>{
        for(let i=0; i<5;i++ ){
           setTimeout(() => {
                setNumber(num+1)
                console.log(num)
           }, 1000)
        }
    }
    return <button onClick={ handerClick } >{ num }</button>
}
```

打印结果？

\------------公布答案-------------  

在第一个例子🌰打印结果： 1 2 3 4 5

在第二个例子🌰打印结果： 0 0 0 0 0

这个问题实际很蒙人，我们来一起分析一下,第一个类组件中，由于执行上`setState`没有在`react`正常的函数执行上下文上执行，而是`setTimeout`中执行的，**批量更新**条件被破坏。原理这里我就不讲了,所以可以直接获取到变化后的`state`。

但是在无状态组件中，似乎没有生效。原因很简单，在`class`状态中，通过一个实例化的`class`，去维护组件中的各种状态；但是在`function`组件中，没有一个状态去保存这些信息，每一次函数上下文执行，所有变量，常量都重新声明，执行完毕，再被垃圾机制回收。所以如上，无论`setTimeout`执行多少次，都是在当前函数上下文执行,此时`num = 0`不会变，之后`setNumber`执行，函数组件重新执行之后，`num`才变化。

所以， 对于`class`组件，我们只需要实例化一次，实例中保存了组件的`state`等状态。对于每一次更新只需要调用`render`方法就可以。但是在`function`组件中，每一次更新都是一次新的函数执行,为了保存一些状态,执行一些副作用钩子,`react-hooks`应运而生，去帮助记录组件的状态，处理一些额外的副作用。

#### 一 初识：揭开hooks的面纱

##### 1.引入hooks时候发生了什么

我们从引入 `hooks`开始，以`useState`为例子，当我们从项目中这么写：

```js
import { useState } from 'react'
```

于是乎我们去找`useState`,看看它到底是哪路神仙？

`react/src/ReactHooks.js`

**useState**

```js
export function useState(initialState){
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
```

`useState()` 的执行等于 `dispatcher.useState(initialState)` 这里面引入了一个`dispatcher`，我们看一下`resolveDispatcher`做了些什么？

**resolveDispatcher**

```js
function resolveDispatcher() {
  const dispatcher = ReactCurrentDispatcher.current
  return dispatcher
}
```

**ReactCurrentDispatcher**

`react/src/ReactCurrentDispatcher.js`

```js
const ReactCurrentDispatcher = {
  current: null,
};
```

我们看到**`ReactCurrentDispatcher.current`初始化的时候为`null`**，然后就没任何下文了。我们暂且只能把`ReactCurrentDispatcher`记下来。看看`ReactCurrentDispatcher`什么时候用到的 ？

##### 2.从无状态组件的函数执行说起

想要彻底弄明白`hooks`，就要从其根源开始，上述我们在引入`hooks`的时候，最后以一个`ReactCurrentDispatcher`草草收尾，线索全部断了，所以接下来我们只能从**函数组件执行**开始。

###### renderWithHooks 执行函数

对于`function`组件是什么时候执行的呢？

`react-reconciler/src/ReactFiberBeginWork.js`

`function`组件初始化：

```jsx
renderWithHooks(
    null,                // current Fiber
    workInProgress,      // workInProgress Fiber
    Component,           // 函数组件本身
    props,               // props
    context,             // 上下文
    renderExpirationTime,// 渲染 ExpirationTime
);
```

**对于初始化是没有`current`树的，之后完成一次组件更新后，会把当前`workInProgress`树赋值给`current`树。**

`function`组件更新：

```jsx
renderWithHooks(
    current,
    workInProgress,
    render,
    nextProps,
    context,
    renderExpirationTime,
);
```

我们从上边可以看出来，`renderWithHooks`函数作用是**调用`function`组件函数**的主要函数。我们重点看看`renderWithHooks`做了些什么？

**renderWithHooks** `react-reconciler/src/ReactFiberHooks.js`

```jsx
export function renderWithHooks(
  current,
  workInProgress,
  Component,
  props,
  secondArg,
  nextRenderExpirationTime,
) {
  renderExpirationTime = nextRenderExpirationTime;
  currentlyRenderingFiber = workInProgress;

  workInProgress.memoizedState = null;
  workInProgress.updateQueue = null;
  workInProgress.expirationTime = NoWork;

  ReactCurrentDispatcher.current =
      current === null || current.memoizedState === null
        ? HooksDispatcherOnMount
        : HooksDispatcherOnUpdate;

  let children = Component(props, secondArg);

  if (workInProgress.expirationTime === renderExpirationTime) { 
       // ....这里的逻辑我们先放一放
  }

  ReactCurrentDispatcher.current = ContextOnlyDispatcher;

  renderExpirationTime = NoWork;
  currentlyRenderingFiber = null;

  currentHook = null
  workInProgressHook = null;

  didScheduleRenderPhaseUpdate = false;

  return children;
}
```

**所有的函数组件执行，都是在这里方法中**,首先我们应该明白几个感念，这对于后续我们理解`useState`是很有帮助的。

`current fiber树`: 当**完成一次渲染之后**，会产生一个`current`树,`current`会在`commit`阶段替换成真实的`Dom`树。

`workInProgress fiber树`: 即将**调和渲染**的 `fiber` 树。在一次新的组件更新过程中，会从`current`复制一份作为`workInProgress`,更新完毕后，将当前的`workInProgress`树赋值给`current`树。

`workInProgress.memoizedState`: 在`class`组件中，`memoizedState`存放`state`信息，在`function`组件中，**`memoizedState`在一次调和渲染过程中，以链表的形式存放`hooks`信息。**

`workInProgress.expirationTime`: `react`用不同的`expirationTime`,来确定更新的优先级。

`currentHook` : 可以理解 `current`树上的**指向的当前调度**的 `hooks`节点。

`workInProgressHook` : 可以理解 `workInProgress`树上指向的当前调度的 `hooks`节点。

**`renderWithHooks`函数主要作用:**

首先先**置空**即将调和渲染的`workInProgress`树的`memoizedState`和`updateQueue`，为什么这么做，因为在**接下来的函数组件执行过程**中，要把新的`hooks`信息挂载到这两个属性上，然后在组件`commit`阶段，将`workInProgress`树替换成`current`树，替换真实的`DOM`元素节点。并在`current`树保存`hooks`信息。

然后根据当前函数组件**是否是第一次渲染**，赋予`ReactCurrentDispatcher.current`不同的`hooks`,终于和上面讲到的`ReactCurrentDispatcher`联系到一起。对于第一次渲染组件，那么用的是`HooksDispatcherOnMount` hooks对象。 对于渲染后，需要更新的函数组件，则是`HooksDispatcherOnUpdate`对象，那么两个不同就是通过`current`树上是否`memoizedState`（hook信息）来判断的。如果`current`不存在，证明是第一次渲染函数组件。

接下来，调用`Component(props, secondArg);`执行我们的函数组件，我们的函数组件在这里真正的被执行了，然后，我们写的`hooks`被依次执行，把`hooks`信息依次保存到`workInProgress`树上。

接下来，也很重要，将`ContextOnlyDispatcher`赋值给 `ReactCurrentDispatcher.current`，由于`js`是单线程的，也就是说我们**没有**在函数组件中，调用的`hooks`，都是`ContextOnlyDispatcher`对象上`hooks`,我们看看`ContextOnlyDispatcher`hooks，到底是什么。

```jsx
const ContextOnlyDispatcher = {
    useState:throwInvalidHookError
}
function throwInvalidHookError() {
  invariant(
    false,
    'Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for' +
      ' one of the following reasons:\n' +
      '1. You might have mismatching versions of React and the renderer (such as React DOM)\n' +
      '2. You might be breaking the Rules of Hooks\n' +
      '3. You might have more than one copy of React in the same app\n' +
      'See https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem.',
  );
}
```

原来如此，`react-hooks`就是通过这种**函数组件执行赋值不同**的`hooks`对象方式，判断在`hooks`执行是否在函数组件内部，捕获并抛出异常的。

最后，重新置空一些变量比如`currentHook`，`currentlyRenderingFiber`,`workInProgressHook`等。

##### 3.不同的`hooks`对象

上述讲到在函数**第一次渲染组件**和**更新组件**分别调用不同的`hooks`对象，我们现在就来看看`HooksDispatcherOnMount` 和 `HooksDispatcherOnUpdate`。

**第一次渲染(我这里只展示了常用的`hooks`)：**

```jsx
const HooksDispatcherOnMount = {
  useCallback: mountCallback,
  useEffect: mountEffect,
  useLayoutEffect: mountLayoutEffect,
  useMemo: mountMemo,
  useReducer: mountReducer,
  useRef: mountRef,
  useState: mountState,
};
```

**更新组件：**

```jsx
const HooksDispatcherOnUpdate = {
  useCallback: updateCallback,
  useEffect: updateEffect,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: updateReducer,
  useRef: updateRef,
  useState: updateState
};
```

看来对于第一次渲染组件，和更新组件，`react-hooks`采用了两套`Api`，本文的第二部分和第三部分，将重点两者的联系。

我们用流程图来描述整个过程：

<img src="https://s2.loli.net/2022/08/12/Bg5IemuDhxFCNj1.webp" alt="17AC0A26-745A-4FD8-B91B-7CADB717234C.jpg" style="zoom:150%;" />

#### 二 hooks初始化，我们写的hooks会变成什么样子

本文将重点围绕四个重点`hooks`展开，分别是负责组件更新的`useState`，负责执行副作用`useEffect` ,负责保存数据的`useRef`,负责缓存优化的`useMemo`， 至于`useCallback`,`useReducer`,`useLayoutEffect`原理和那四个重点`hooks`比较相近，就不一一解释了。

我们先写一个组件，并且用到上述四个主要`hooks`：

**请记住如下代码片段，后面讲解将以如下代码段展开**

```jsx
import React , { useEffect , useState , useRef , useMemo  } from 'react'
function Index(){
    const [ number , setNumber ] = useState(0)
    const DivDemo = useMemo(() => <div> hello , i am useMemo </div>,[])
    const curRef  = useRef(null)
    useEffect(()=>{
       console.log(curRef.current)
    },[])
    return <div ref={ curRef } >
        hello,world { number } 
        { DivDemo }
        <button onClick={() => setNumber(number+1) } >number++</button>
     </div>
}
```

接下来我们一起研究一下我们上述写的四个`hooks`最终会变成什么？

##### 1 mountWorkInProgressHook

在**组件初始化**的时候,每一次`hooks`执行，如`useState()`,`useRef()`,都会调用`mountWorkInProgressHook`,`mountWorkInProgressHook`到底做了些什么，让我们一起来分析一下：

`react-reconciler/src/ReactFiberHooks.js -> mountWorkInProgressHook`

```jsx
function mountWorkInProgressHook() {
  const hook: Hook = {
    memoizedState: null,  // useState中 保存 state信息 ｜ useEffect 中 保存着 effect 对象 ｜ useMemo 中 保存的是缓存的值和deps ｜ useRef中保存的是ref 对象
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };
  if (workInProgressHook === null) { // 例子中的第一个`hooks`-> useState(0) 走的就是这样。
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
  } else {
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}
```

`mountWorkInProgressHook`这个函数做的事情很简单，首先**每次执行**一个`hooks`函数，都产生一个`hook`对象，里面保存了当前`hook`信息,然后将每个`hooks`以**链表形式串联**起来，并赋值给`workInProgress`的`memoizedState`。也就证实了上述所说的，**函数组件用`memoizedState`存放`hooks`链表**。

至于`hook`对象中都保留了那些信息？我这里先分别介绍一下 :  

**memoizedState**： `useState`中保存 `state` 信息 ｜ `useEffect` 中 保存着 `effect` 对象 ｜ `useMemo` 中 保存的是缓存的值和 `deps` ｜ `useRef` 中保存的是 `ref` 对象。

**baseQueue** : `usestate`和`useReducer`中 保存**最新的更新队列**。

**baseState** ： `usestate`和`useReducer`中,一次更新中 ，产生的最新`state`值。

**queue** ： 保存待更新队列 `pendingQueue` ，更新函数 `dispatch` 等信息。

**next**: 指向下一个 `hooks`对象。

那么当我们函数组件执行之后，四个`hooks`和`workInProgress`将是如图的关系。

![shunxu.jpg](https://s2.loli.net/2022/08/12/oDUnd9GiwV6k5Q7.webp)

知道每个`hooks`关系之后，我们应该理解了，为什么不能条件语句中，声明`hooks`。

我们用一幅图表示如果**在条件语句中声明会出现什么情况发生**。

如果我们将上述`demo`其中的一个 `useRef` 放入条件语句中，

```jsx
 let curRef  = null
 if(isFisrt){
  curRef = useRef(null)
 }
```

![hoo11.jpg](https://s2.loli.net/2022/08/12/P7Dzl5XmVMUxCAE.webp)

**因为一旦在条件语句中声明`hooks`，在下一次函数组件更新，`hooks`链表结构，将会被破坏，`current`树的`memoizedState`缓存`hooks`信息，和当前`workInProgress`不一致，如果涉及到读取`state`等操作，就会发生异常。**

上述介绍了 **`hooks`通过什么来证明唯一性的，答案 ，通过`hooks`链表顺序**。和为什么不能在条件语句中，声明`hooks`，接下来我们按照四个方向，分别介绍初始化的时候发生了什么？

##### 2 初始化useState -> mountState

###### **mountState**

```jsx
function mountState(
  initialState
){
  const hook = mountWorkInProgressHook();
  if (typeof initialState === 'function') {
    // 如果 useState 第一个参数为函数，执行函数得到state
    initialState = initialState();
  }
  hook.memoizedState = hook.baseState = initialState;
  const queue = (hook.queue = {
    pending: null,  // 带更新的
    dispatch: null, // 负责更新函数
    lastRenderedReducer: basicStateReducer, //用于得到最新的 state ,
    lastRenderedState: initialState, // 最后一次得到的 state
  });

  const dispatch = (queue.dispatch = (dispatchAction.bind( // 负责更新的函数
    null,
    currentlyRenderingFiber,
    queue,
  )))
  return [hook.memoizedState, dispatch];
}
```

`mountState`到底做了些什么，首先会得到**初始化**的`state`，将它赋值给`mountWorkInProgressHook`产生的`hook`对象的 `memoizedState`和`baseState`属性，然后**创建一个`queue`对象**，里面保存了**负责更新**的信息。

这里先说一下，在**无状态组件**中，`useState`和`useReducer`触发**函数更新的方法**都是`dispatchAction`,`useState`，可以看成一个简化版的`useReducer`,至于`dispatchAction`怎么更新`state`，更新组件的，我们接着往下研究`dispatchAction`。

在研究之前 我们**先要弄明白`dispatchAction`是什么?**

```jsx
function dispatchAction<S, A>(
  fiber: Fiber,
  queue: UpdateQueue<S, A>,
  action: A,
)
```

```jsx
const [ number , setNumber ] = useState(0)
```

**`dispatchAction` 就是 `setNumber`** , `dispatchAction` 第一个参数和第二个参数，已经被`bind`给改成`currentlyRenderingFiber`和 `queue`,我们传入的参数是第三个参数`action`

###### dispatchAction 无状态组件更新机制

作为更新的主要函数，我们一下来研究一下，我把 `dispatchAction` 精简，精简，再精简，

```js
function dispatchAction(fiber, queue, action) {

  // 计算 expirationTime 过程略过。
  /* 创建一个update */
  const update= {
    expirationTime,
    suspenseConfig,
    action,
    eagerReducer: null,
    eagerState: null,
    next: null,
  }
  /* 把创建的update */
  const pending = queue.pending;
  if (pending === null) {  // 证明第一次更新
    update.next = update;
  } else { // 不是第一次更新
    update.next = pending.next;
    pending.next = update;
  }
  
  queue.pending = update;
  const alternate = fiber.alternate;
  /* 判断当前是否在渲染阶段 */
  if ( fiber === currentlyRenderingFiber || (alternate !== null && alternate === currentlyRenderingFiber)) {
    didScheduleRenderPhaseUpdate = true;
    update.expirationTime = renderExpirationTime;
    currentlyRenderingFiber.expirationTime = renderExpirationTime;
  } else { /* 当前函数组件对应fiber没有处于调和渲染阶段 ，那么获取最新state , 执行更新 */
    if (fiber.expirationTime === NoWork && (alternate === null || alternate.expirationTime === NoWork)) {
      const lastRenderedReducer = queue.lastRenderedReducer;
      if (lastRenderedReducer !== null) {
        let prevDispatcher;
        try {
          const currentState = queue.lastRenderedState; /* 上一次的state */
          const eagerState = lastRenderedReducer(currentState, action); /**/
          update.eagerReducer = lastRenderedReducer;
          update.eagerState = eagerState;
          if (is(eagerState, currentState)) { 
            return
          }
        } 
      }
    }
    scheduleUpdateOnFiber(fiber, expirationTime);
  }
}
```

无论是类组件调用`setState`,还是函数组件的`dispatchAction` ，都会**产生一个 `update`对象**，里面记录了**此次更新的信息，**然后将此`update`放入**待更新的`pending`队列中**，`dispatchAction`第二步就是判断当前函数组件的`fiber`对象**是否处于渲染阶段**，如果**处于渲染阶段**，那么不需要我们在更新当前函数组件，只需要更新一下当前`update`的`expirationTime`即可。

如果当前`fiber`**没有处于更新阶段**。那么通过调用`lastRenderedReducer`获取最新的`state`,和上一次的`currentState`，进行**浅比较**，如果相等，那么就退出，这就证实了为什么`useState`，两次值相等的时候，组件不渲染的原因了，这个机制和`Component`模式下的`setState`有一定的区别。

如果两次`state`不相等，那么调用`scheduleUpdateOnFiber`调度渲染当前`fiber`，`scheduleUpdateOnFiber`是`react`渲染更新的主要函数。

我们把**初始化`mountState`**和**无状态组件更新机制**讲明白了，接下来看一下其他的**hooks**初始化做了些什么操作？

##### 3 初始化useEffect -> mountEffect

上述讲到了无状态组件中`fiber`对象`memoizedState`保存当前的`hooks`形成的链表。那么`updateQueue`保存了什么信息呢，我们会在接下来探索`useEffect`过程中找到答案。 当我们调用`useEffect`的时候，在组件第一次渲染的时候会调用`mountEffect`方法，这个方法到底做了些什么？

###### mountEffect

```jsx
function mountEffect(
  create,
  deps,
) {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  hook.memoizedState = pushEffect(
    HookHasEffect | hookEffectTag, 
    create, // useEffect 第一次参数，就是副作用函数
    undefined,
    nextDeps, // useEffect 第二次参数，deps
  );
}
```

每个`hooks`初始化都会创建一个`hook`对象，然后将hook的`memoizedState`保存当前`effect hook`信息。

**有两个`memoizedState`大家千万别混淆了，我这里再友情提示一遍**

-   `workInProgress / current` 树上的 `memoizedState` 保存的是当前函数组件每个`hooks`形成的链表。

-   每个`hooks`上的`memoizedState` 保存了当前`hooks`信息，不同种类的`hooks`的`memoizedState`内容不同。上述的方法最后执行了一个`pushEffect`，我们一起看看`pushEffect`做了些什么？

###### pushEffect 创建effect对象，挂载updateQueue

```jsx
function pushEffect(tag, create, destroy, deps) {
  const effect = {
    tag,
    create,
    destroy,
    deps,
    next: null,
  };
  let componentUpdateQueue = currentlyRenderingFiber.updateQueue
  if (componentUpdateQueue === null) { // 如果是第一个 useEffect
    componentUpdateQueue = {  lastEffect: null  }
    currentlyRenderingFiber.updateQueue = componentUpdateQueue
    componentUpdateQueue.lastEffect = effect.next = effect;
  } else {  // 存在多个effect
    const lastEffect = componentUpdateQueue.lastEffect;
    if (lastEffect === null) {
      componentUpdateQueue.lastEffect = effect.next = effect;
    } else {
      const firstEffect = lastEffect.next;
      lastEffect.next = effect;
      effect.next = firstEffect;
      componentUpdateQueue.lastEffect = effect;
    }
  }
  return effect;
}
```

这一段实际很简单，首先创建一个 `effect` ，判断组件如果第一次渲染，那么创建 `componentUpdateQueue` ，就是`workInProgress`的`updateQueue`。然后将`effect`放入`updateQueue`中。

假设我们在一个函数组件中这么写：

```jsx
useEffect(()=>{
    console.log(1)
},[ props.a ])
useEffect(()=>{
    console.log(2)
},[])
useEffect(()=>{
    console.log(3)
},[])
```

最后`workInProgress.updateQueue`会以这样的形式保存：

![7B8889E7-05B3-4BC4-870A-0D4C1CDF6981.jpg](https://s2.loli.net/2022/08/12/ENyeHgbQ5Z6knRJ.webp)

###### 拓展:effectList

`effect list` 可以理解为是一个存储 `effectTag` 副作用列表容器。它是由 `fiber` 节点和指针 `nextEffect` 构成的**单链表结构**，这其中还包括第一个节点 `firstEffect` ，和最后一个节点 `lastEffect`。 `React` 采用**深度优先搜索算法**，在 `render` 阶段遍历 `fiber` 树时，**把每一个有副作用的 `fiber` 筛选出来**，最后**构建生成一个只带副作用的 `effect list` 链表**。 在 `commit` 阶段，`React` 拿到 `effect list` 数据后，通过遍历 `effect list`，并根据每一个 `effect` 节点的 `effectTag` 类型，执行每个`effect`，从而对相应的 `DOM` 树执行更改。

##### 4 初始化useMemo -> mountMemo

不知道大家是否把 `useMemo` 想象的过于复杂了，实际相比其他 `useState` , `useEffect`等，它的逻辑实际简单的很。

```js
function mountMemo(nextCreate,deps){
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}
```

初始化`useMemo`，就是创建一个`hook`，然后执行`useMemo`的第一个参数,得到需要缓存的值，然后将值和`deps`记录下来，赋值给当前`hook`的`memoizedState`。整体上并没有复杂的逻辑。

###### 5 初始化useRef -> mountRef

对于`useRef`初始化处理，似乎更是简单，我们一起来看一下：

```jsx
function mountRef(initialValue) {
  const hook = mountWorkInProgressHook();
  const ref = {current: initialValue};
  hook.memoizedState = ref;
  return ref;
}
```

`mountRef`初始化很简单, 创建一个ref对象， 对象的`current` 属性来保存初始化的值，最后用`memoizedState`保存`ref`，完成整个操作。

###### 6 mounted 阶段 hooks 总结

我们来总结一下初始化阶段,`react-hooks`做的事情，在**一个函数组件第一次渲染执行上下文过程**中，每个`react-hooks`执行，都会产生一个`hook`对象，并形成**链表结构**，绑定在`workInProgress`的`memoizedState`属性上，然后`react-hooks`上的状态，绑定在当前`hooks`对象的`memoizedState`属性上。对于`effect`副作用钩子，会绑定在`workInProgress.updateQueue`上，等到`commit`阶段，`dom`树构建完成，再执行每个 `effect` 副作用钩子。

#### 三 hooks更新阶段

上述介绍了第一次**渲染函数组件**，`react-hooks`初始化都做些什么，接下来，我们分析一下，

对于更新阶段，说明上一次 `workInProgress` 树已经赋值给了 `current` 树。存放`hooks`信息的`memoizedState`，此时已经存在`current`树上，`react`对于`hooks`的处理逻辑和`fiber`树逻辑类似。

对于一次**函数组件更新**，当再次执行`hooks`函数的时候，比如 `useState(0)` ，首先要从`current`的`hooks`中找到与当前`workInProgressHook`，对应的`currentHooks`，然后**复制一份**`currentHooks`给`workInProgressHook`,接下来`hooks`函数执行的时候,把最新的状态更新到`workInProgressHook`，保证`hooks`状态不丢失。

所以**函数组件每次更新，每一次`react-hooks`函数执行，都需要有一个函数去做上面的操作，这个函数就是`updateWorkInProgressHook`**,我们接下来一起看这个`updateWorkInProgressHook`。

##### 1 updateWorkInProgressHook

```jsx
function updateWorkInProgressHook() {
  let nextCurrentHook;
  if (currentHook === null) {  /* 如果 currentHook = null 证明它是第一个hooks */
    const current = currentlyRenderingFiber.alternate;
    if (current !== null) {
      nextCurrentHook = current.memoizedState;
    } else {
      nextCurrentHook = null;
    }
  } else { /* 不是第一个hooks，那么指向下一个 hooks */
    nextCurrentHook = currentHook.next;
  }
  let nextWorkInProgressHook
  if (workInProgressHook === null) {  //第一次执行hooks
    // 这里应该注意一下，当函数组件更新也是调用 renderWithHooks ,memoizedState属性是置空的
    nextWorkInProgressHook = currentlyRenderingFiber.memoizedState;
  } else { 
    nextWorkInProgressHook = workInProgressHook.next;
  }

  if (nextWorkInProgressHook !== null) { 
      /* 这个情况说明 renderWithHooks 执行 过程发生多次函数组件的执行 ，我们暂时先不考虑 */
    workInProgressHook = nextWorkInProgressHook;
    nextWorkInProgressHook = workInProgressHook.next;
    currentHook = nextCurrentHook;
  } else {
    invariant(
      nextCurrentHook !== null,
      'Rendered more hooks than during the previous render.',
    );
    currentHook = nextCurrentHook;
    const newHook = { //创建一个新的hook
      memoizedState: currentHook.memoizedState,
      baseState: currentHook.baseState,
      baseQueue: currentHook.baseQueue,
      queue: currentHook.queue,
      next: null,
    };
    if (workInProgressHook === null) { // 如果是第一个hooks
      currentlyRenderingFiber.memoizedState = workInProgressHook = newHook;
    } else { // 重新更新 hook
      workInProgressHook = workInProgressHook.next = newHook;
    }
  }
  return workInProgressHook;
}
```

这一段的逻辑大致是这样的：

-   首先如果是**第一次执行**`hooks`函数，那么从`current`树上取出`memoizedState` ，也就是旧的`hooks`。
-   然后声明变量`nextWorkInProgressHook`，这里应该值得注意，正常情况下，一次`renderWithHooks`执行，`workInProgress`上的`memoizedState`会被置空，`hooks`函数顺序执行，`nextWorkInProgressHook`应该一直为`null`，那么什么情况下`nextWorkInProgressHook`不为`null`,也就是当一次`renderWithHooks`执行过程中，执行了多次函数组件，也就是在`renderWithHooks`中这段逻辑。

```jsx
  if (workInProgress.expirationTime === renderExpirationTime) { 
       // ....这里的逻辑我们先放一放
  }
```

这里面的逻辑，实际就是判定，如果当前函数组件执行后，当前函数组件的**还是处于渲染优先级，说明函数组件又有了新的更新任务**，那么循坏执行函数组件。这就造成了上述的，`nextWorkInProgressHook`不为 `null` 的情况。

最后复制`current`的`hooks`，把它赋值给`workInProgressHook`,用于更新新的一轮`hooks`状态。

接下来我们看一下四个种类的`hooks`，在一次组件更新中，分别做了那些操作。

##### 2 updateState

useState

```jsx
function updateReducer(
  reducer,
  initialArg,
  init,
){
  const hook = updateWorkInProgressHook();
  const queue = hook.queue;
  queue.lastRenderedReducer = reducer;
  const current = currentHook;
  let baseQueue = current.baseQueue;
  const pendingQueue = queue.pending;
  if (pendingQueue !== null) {
     // 这里省略... 第一步：将 pending  queue 合并到 basequeue
  }
  if (baseQueue !== null) {
    const first = baseQueue.next;
    let newState = current.baseState;
    let newBaseState = null;
    let newBaseQueueFirst = null;
    let newBaseQueueLast = null;
    let update = first;
    do {
      const updateExpirationTime = update.expirationTime;
      if (updateExpirationTime < renderExpirationTime) { //优先级不足
        const clone  = {
          expirationTime: update.expirationTime,
          ...
        };
        if (newBaseQueueLast === null) {
          newBaseQueueFirst = newBaseQueueLast = clone;
          newBaseState = newState;
        } else {
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }
      } else {  //此更新确实具有足够的优先级。
        if (newBaseQueueLast !== null) {
          const clone= {
            expirationTime: Sync, 
             ...
          };
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }
        /* 得到新的 state */
        newState = reducer(newState, action);
      }
      update = update.next;
    } while (update !== null && update !== first);
    if (newBaseQueueLast === null) {
      newBaseState = newState;
    } else {
      newBaseQueueLast.next = newBaseQueueFirst;
    }
    hook.memoizedState = newState;
    hook.baseState = newBaseState;
    hook.baseQueue = newBaseQueueLast;
    queue.lastRenderedState = newState;
  }
  const dispatch = queue.dispatch
  return [hook.memoizedState, dispatch];
}
```

首先将上一次更新的`pending queue` 合并到 `basequeue`，为什么要这么做，比如我们再一次点击事件中这么写，

```jsx
function Index(){
   const [ number ,setNumber ] = useState(0)
   const handerClick = ()=>{
    //    setNumber(1)
    //    setNumber(2)
    //    setNumber(3)
       setNumber(state=>state+1)
       // 获取上次 state = 1 
       setNumber(state=>state+1)
       // 获取上次 state = 2
       setNumber(state=>state+1)
   }
   console.log(number) // 3 
   return <div>
       <div>{ number }</div>
       <button onClick={ ()=> handerClick() } >点击</button>
   </div>
}
```

**点击按钮， 打印 3**

三次`setNumber`产生的`update`会暂且放入`pending queue`，在下一次函数组件执行时候，三次 `update`被合并到 `baseQueue`。结构如下图：

![setState.jpg](https://s2.loli.net/2022/08/12/9xtm18ZSBqcX3ky.webp)

接下来会把当前`useState`或是`useReduer`对应的`hooks`上的`baseState`和`baseQueue`更新到最新的状态。会循环`baseQueue`的`update`，复制一份`update`,更新 `expirationTime`，对于**有足够优先级**的`update`（上述三个`setNumber`产生的`update`都具有足够的优先级），我们要获取最新的`state`状态。，会一次执行`useState`上的每一个`action`。得到最新的`state`。

**更新state**

![sset1.jpg](https://s2.loli.net/2022/08/12/gE2LDf3raUGOlCm.webp)

这里有会有两个疑问🤔️:

-   问题一：这里不是执行最后一个`action`不就可以了嘛? 答案： 原因很简单，上面说了 `useState`逻辑和`useReducer`差不多。如果第一个参数是一个函数，会引用上一次 `update`产生的 `state`, 所以需要**循环调用，每一个`update`的`reducer`**，如果`setNumber(2)`是这种情况，那么只用更新值，如果是`setNumber(state=>state+1)`,那么传入上一次的 `state` 得到最新`state`。

-   问题二：什么情况下会有优先级不足的情况(`updateExpirationTime < renderExpirationTime`)？

答案： 这种情况，一般会发生在，当我们调用`setNumber`时候，调用`scheduleUpdateOnFiber`渲染当前组件时，又产生了一次新的更新，所以把最终执行`reducer`更新`state`任务交给下一次更新。

##### 3 updateEffect

```jsx
function updateEffect(create, deps): void {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  let destroy = undefined;
  if (currentHook !== null) {
    const prevEffect = currentHook.memoizedState;
    destroy = prevEffect.destroy;
    if (nextDeps !== null) {
      const prevDeps = prevEffect.deps;
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        pushEffect(hookEffectTag, create, destroy, nextDeps);
        return;
      }
    }
  }
  currentlyRenderingFiber.effectTag |= fiberEffectTag
  hook.memoizedState = pushEffect(
    HookHasEffect | hookEffectTag,
    create,
    destroy,
    nextDeps,
  );
}
```

`useEffect` 做的事很简单，**判断两次`deps` 相等**，如果**相等说明此次更新不需要执行，则直接调用 `pushEffect`**,这里注意 `effect`的标签，`hookEffectTag`,如果不相等，那么更新 `effect` ,并且赋值给`hook.memoizedState`，这里标签是 `HookHasEffect | hookEffectTag`,然后在`commit`阶段，`react`会通过标签来判断，是否执行当前的 `effect` 函数。

##### 4 updateMemo

```jsx
function updateMemo(
  nextCreate,
  deps,
) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps; // 新的 deps 值
  const prevState = hook.memoizedState; 
  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps = prevState[1]; // 之前保存的 deps 值
      if (areHookInputsEqual(nextDeps, prevDeps)) { //判断两次 deps 值
        return prevState[0];
      }
    }
  }
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}
```

在组件更新过程中，我们执行`useMemo`函数，做的事情实际很简单，就是判断两次 `deps`是否相等，如果不想等，证明依赖项发生改变，那么执行 `useMemo`的第一个函数，得到新的值，然后重新赋值给`hook.memoizedState`,如果相等 证明没有依赖项改变，那么直接获取缓存的值。

不过这里有一点，值得注意，`nextCreate()`执行，如果里面引用了`usestate`等信息，变量会被引用，无法被垃圾回收机制回收，就是闭包原理，那么访问的属性有可能不是最新的值，所以需要把引用的值，添加到依赖项 `dep` 数组中。每一次`dep`改变，重新执行，就不会出现问题了。

**温馨小提示： 有很多同学说 `useMemo`怎么用，到底什么场景用，用了会不会起到反作用，通过对源码原理解析，我可以明确的说，基本上可以放心使用，说白了就是可以定制化缓存，存值取值而已。**

##### 5 updateRef

```jsx
function updateRef(initialValue){
  const hook = updateWorkInProgressHook()
  return hook.memoizedState
}
```

函数组件更新useRef做的事情更简单，就是返回了缓存下来的值，也就是无论函数组件怎么执行，执行多少次，`hook.memoizedState`内存中都指向了一个对象，所以解释了`useEffect`,`useMemo` 中，为什么`useRef`不需要依赖注入，就能访问到最新的改变值。

##### 一次点击事件更新

<img src="https://s2.loli.net/2022/08/12/iZRp1JIADzOsQ5h.webp" alt="91A72028-3A38-4491-9375-0895F420B7CD.jpg" style="zoom:150%;" />



## 虚拟dom

### 1\.对虚拟 DOM 的理解？虚拟 DOM 主要做了什么？虚拟 DOM 本身是什么？

从本质上来说，Virtual Dom是一个JavaScript对象，通过对象的方式来表示DOM结构。将页面的状态抽象为JS对象的形式，配合不同的渲染工具，使跨平台渲染成为可能。通过事务处理机制，将多次DOM修改的结果一次性的更新到页面上，从而有效的减少页面渲染的次数，减少修改DOM的重绘重排次数，提高渲染性能。

虚拟DOM是对DOM的抽象，这个对象是更加轻量级的对DOM的描述。它设计的最初目的，就是更好的跨平台，比如node.js就没有DOM，如果想实现SSR，那么一个方式就是借助虚拟dom，因为虚拟dom本身是js对象。 在代码渲染到页面之前，vue或者react会把代码转换成一个对象（虚拟DOM）。以对象的形式来描述真实dom结构，最终渲染到页面。在每次数据发生变化前，虚拟dom都会缓存一份，变化之时，现在的虚拟dom会与缓存的虚拟dom进行比较。在vue或者react内部封装了diff算法，通过这个算法来进行比较，渲染时修改改变的变化，原先没有发生改变的通过原先的数据进行渲染。

另外现代前端框架的一个基本要求就是无须手动操作DOM，一方面是因为手动操作DOM无法保证程序性能，多人协作的项目中如果review不严格，可能会有开发者写出性能较低的代码，另一方面更重要的是省略手动DOM操作可以大大提高开发效率。

**为什么要用 Virtual DOM：**

**（1）保证性能下限，在不进行手动优化的情况下，提供过得去的性能**

下面对比一下修改DOM时真实DOM操作和Virtual DOM的过程，来看一下它们重排重绘的性能消耗∶

-   真实DOM∶ 生成HTML字符串＋ 重建所有的DOM元素
-   Virtual DOM∶ 生成vNode＋ DOMDiff＋必要的DOM更新

Virtual DOM的更新DOM的准备工作耗费更多的时间，也就是JS层面，相比于更多的DOM操作它的消费是极其便宜的。尤雨溪在社区论坛中说道∶ 框架给你的保证是，你不需要手动优化的情况下，我依然可以给你提供过得去的性能。 

**（2）跨平台** Virtual DOM本质上是JavaScript的对象，它可以很方便的跨平台操作，比如服务端渲染、uniapp等。

### 2\.React diff 算法的原理是什么？

vdom 时间复杂度O(n^3)优化到O(n)

传统的diff算法

两棵树中的节点一一进行对比的复杂度为`O(n^2)，树1上的点1要遍历树2上的所有的点，树1上的点2也要遍历树2的所有点，以此类推，复杂度为O(n^2)`。如果在比较过程中发现树1（也就是旧树）上的一个点A在树2（新树）上没有找到，点A会被删掉，在老diff算法里点A被删后的空位，需要遍历树2上的所有点去找到一个可以填充它，复杂度为O(n)。

**1.只比较同一层级，不跨级比较**

**2.tab不相同，则直接删掉重建，不再深度比较**

**3.tag和key，两者都相同，则认为是同一节点，不再深度比较**

实际上，diff 算法探讨的就是虚拟 DOM 树发生变化后，生成 DOM 树更新补丁的方式。它通过对比新旧两株虚拟 DOM 树的变更差异，将更新补丁作用于真实 DOM，以最小成本完成视图更新。 

![image-20220701214719463](https://s2.loli.net/2022/07/01/RSjBxEzWN27h41e.png)

 具体的流程如下：

-   真实的 DOM 首先会映射为虚拟 DOM；
-   当虚拟 DOM 发生变化后，就会根据差距计算生成 patch，这个 patch 是一个结构化的数据，内容包含了增加、更新、移除等；
-   根据 patch 去更新真实的 DOM，反馈到用户的界面上。

![image-20220701214755433](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs9fF5gvNd26pWCcm.png)

 一个简单的例子：

```jsx
import React from 'react'
export default class ExampleComponent extends React.Component {
  render() {
    if(this.props.isVisible) {
       return <div className="visible">visbile</div>;
    }
     return <div className="hidden">hidden</div>;
  }
}
```

这里，首先假定 ExampleComponent 可见，然后再改变它的状态，让它不可见 。映射为真实的 DOM 操作是这样的，React 会创建一个 div 节点。

```jsx
<div class="visible">visbile</div>
```

当把 visbile 的值变为 false 时，就会替换 class 属性为 hidden，并重写内部的 innerText 为 hidden。**这样一个生成补丁、更新差异的过程统称为 diff 算法。**

diff算法可以总结为三个策略，分别从树、组件及元素三个层面进行复杂度的优化：

#### **策略一：**

**忽略节点跨层级操作场景，提升比对效率。（基于树进行对比）**

这一策略需要进行树比对，即对树进行分层比较。树比对的处理手法是非常“暴力”的，即两棵树只对同一层次的节点进行比较，如果发现节点已经不存在了，则该节点及其子节点会被完全删除掉，不会用于进一步的比较，这就提升了比对效率。

#### **策略二：**

**如果组件的 class 一致，则默认为相似的树结构，否则默认为不同的树结构。（基于组件进行对比）**

在组件比对的过程中：

-   如果组件是同一类型则进行树比对；
-   如果不是则直接放入补丁中。

只要父组件类型不同，就会被重新渲染。这也就是为什么 shouldComponentUpdate、PureComponent 及 React.memo 可以提高性能的原因。

#### **策略三：**

**同一层级的子节点，可以通过标记 key 的方式进行列表对比。（基于节点进行对比）**

元素比对主要发生在同层级中，通过标记节点操作生成补丁。节点操作包含了插入、移动、删除等。其中节点重新排序同时涉及插入、移动、删除三个操作，所以效率消耗最大，此时策略三起到了至关重要的作用。通过标记 key 的方式，React 可以直接移动 DOM 节点，降低内耗。

#### fiber机制下

Fiber 机制下节点与树分别采用 FiberNode 与 FiberTree 进行重构。FiberNode 使用了双链表的结构，可以直接找到兄弟节点与子节点，使得整个更新过程可以随时暂停恢复。FiberTree 则是通过 FiberNode 构成的树。

Fiber 机制下，整个更新过程由 current 与 workInProgress 两株树双缓冲完成。当 workInProgress 更新完成后，通过修改 current 相关指针指向的节点，直接抛弃老树，虽然非常简单粗暴，却非常合理。

### 3\.React key 是干嘛用的 为什么要加？key 主要是解决哪一类问题的

Keys 是 React 用于追踪哪些列表中元素被修改、被添加或者被移除的辅助标识。在开发过程中，我们需要保证某个元素的 key 在其同级元素中具有唯一性。

在 React Diff 算法中 React 会借助元素的 Key 值来判断该元素是新近创建的还是被移动而来的元素，从而减少不必要的元素重渲染此外，React 还需要借助 Key 值来判断元素与本地状态的关联关系。

注意事项：

-   key值一定要和具体的元素—一对应；
-   尽量不要用数组的index去作为key；
-   不要在render的时候用随机数或者其他操作给元素加上不稳定的key，这样造成的性能开销比不加key的情况下更糟糕。

### 4\.虚拟 DOM 的引入与直接操作原生 DOM 相比，哪一个效率更高，为什么

虚拟DOM相对原生的DOM不一定是效率更高，如果只修改一个按钮的文案，那么虚拟 DOM 的操作无论如何都不可能比真实的 DOM 操作更快。在首次渲染大量DOM时，由于多了一层虚拟DOM的计算，虚拟DOM也会比innerHTML插入慢。它能保证性能下限，在真实DOM操作的时候进行针对性的优化时，还是更快的。所以要根据具体的场景进行探讨。

在整个 DOM 操作的演化过程中，其实主要矛盾并不在于性能，而在于开发者写得爽不爽，在于研发体验/研发效率。虚拟 DOM 不是别的，正是前端开发们为了追求更好的研发体验和研发效率而创造出来的高阶产物。虚拟 DOM 并不一定会带来更好的性能，React 官方也从来没有把虚拟 DOM 作为性能层面的卖点对外输出过。**虚拟 DOM 的优越之处在于，它能够在提供更爽、更高效的研发模式（也就是函数式的 UI 编程方式）的同时，仍然保持一个还不错的性能。**

### 5\.React 与 Vue 的 diff 算法有何不同？

diff 算法是指生成更新补丁的方式，主要应用于虚拟 DOM 树变化后，更新真实 DOM。所以 diff 算法一定存在这样一个过程：触发更新 → 生成补丁 → 应用补丁。

React 的 diff 算法，触发更新的时机主要在 state 变化与 hooks 调用之后。此时触发虚拟 DOM 树变更遍历，采用了深度优先遍历算法。但传统的遍历方式，效率较低。为了优化效率，使用了分治的方式。将单一节点比对转化为了 3 种类型节点的比对，分别是树、组件及元素，以此提升效率。

-   树比对：由于网页视图中较少有跨层级节点移动，两株虚拟 DOM 树只对同一层次的节点进行比较。
-   组件比对：如果组件是同一类型，则进行树比对，如果不是，则直接放入到补丁中。
-   元素比对：主要发生在同层级中，通过标记节点操作生成补丁，节点操作对应真实的 DOM 剪裁操作。

以上是经典的 React diff 算法内容。自 React 16 起，引入了 Fiber 架构。为了使整个更新过程可随时暂停恢复，节点与树分别采用了 FiberNode 与 FiberTree 进行重构。fiberNode 使用了双链表的结构，可以直接找到兄弟节点与子节点。整个更新过程由 current 与 workInProgress 两株树双缓冲完成。workInProgress 更新完成后，再通过修改 current 相关指针指向新节点。

Vue 的整体 diff 策略与 React 对齐，虽然缺乏时间切片能力，但这并不意味着 Vue 的性能更差，因为在 Vue 3 初期引入过，后期因为收益不高移除掉了。除了高帧率动画，在 Vue 中其他的场景几乎都可以使用防抖和节流去提高响应性能。

### 6.如何根据 React diff 算法原理优化代码**

根据 diff 算法的设计原则，应尽量避免跨层级节点移动。

通过设置唯一 key 进行优化，尽量减少组件层级深度。因为过深的层级会加深遍历深度，带来性能问题。

设置 shouldComponentUpdate 或者 React.pureComponet 减少 diff 次数。

### 7.总结

diff 算法是指生成更新补丁的方式，主要应用于虚拟 DOM 树变化后，更新真实 DOM。所以 diff 算法一定存在这样一个过程：触发更新 → 生成补丁 → 应用补丁。

React 的 diff 算法，触发更新的时机主要在 state 变化与 hooks 调用之后。此时触发虚拟 DOM 树变更遍历，采用了深度优先遍历算法。但传统的遍历方式，效率较低。为了优化效率，使用了分治的方式。将单一节点比对转化为了 3 种类型节点的比对，分别是树、组件及元素，以此提升效率。

树比对：由于网页视图中较少有跨层级节点移动，两株虚拟 DOM 树只对同一层次的节点进行比较。

组件比对：如果组件是同一类型，则进行树比对，如果不是，则直接放入到补丁中。

元素比对：主要发生在同层级中，通过标记节点操作生成补丁，节点操作对应真实的 DOM 剪裁操作。

以上是经典的 React diff 算法内容。自 React 16 起，引入了 Fiber 架构。为了使整个更新过程可随时暂停恢复，节点与树分别采用了 FiberNode 与 FiberTree 进行重构。fiberNode 使用了双链表的结构，可以直接找到兄弟节点与子节点。

整个更新过程由 current 与 workInProgress 两株树双缓冲完成。workInProgress 更新完成后，再通过修改 current 相关指针指向新节点。

然后拿 Vue 和 Preact 与 React 的 diff 算法进行对比。

Preact 的 Diff 算法相较于 React，整体设计思路相似，但最底层的元素采用了真实 DOM 对比操作，也没有采用 Fiber 设计。Vue 的 Diff 算法整体也与 React 相似，同样未实现 Fiber 设计。

然后进行横向比较，React 拥有完整的 Diff 算法策略，且拥有随时中断更新的时间切片能力，在大批量节点更新的极端情况下，拥有更友好的交互体验。

Preact 可以在一些对性能要求不高，仅需要渲染框架的简单场景下应用。

Vue 的整体 diff 策略与 React 对齐，虽然缺乏时间切片能力，但这并不意味着 Vue 的性能更差，因为在 Vue 3 初期引入过，后期因为收益不高移除掉了。除了高帧率动画，在 Vue 中其他的场景几乎都可以使用防抖和节流去提高响应性能。

## react原理

### 1.为什么React要用JSX？

JSX 是一个 JavaScript 的语法扩展，或者说是一个类似于 XML 的 ECMAScript 语法扩展。它本身没有太多的语法定义，也不期望引入更多的标准。

其实 React 本身并不强制使用 JSX。在没有 JSX 的时候，React 实现一个组件依赖于使用 React.createElement 函数。代码如下：

```jsx
class Hello extends React.Component {
  render() {
    return React.createElement(
        'div',
        null, 
        `Hello ${this.props.toWhat}`
      );
  }
}
ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

而 JSX 更像是一种语法糖，通过类似 XML 的描述方式，描写函数对象。在采用 JSX 之后，这段代码会这样写：

```jsx
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}
ReactDOM.render(
  <Hello toWhat="World" />,
  document.getElementById('root')
);
```

通过对比，可以清晰地发现，代码变得更为简洁，而且代码结构层次更为清晰。

因为 React 需要将组件转化为虚拟 DOM 树，所以在编写代码时，实际上是在手写一棵结构树。而**XML 在树结构的描述上天生具有可读性强的优势。**

但这样可读性强的代码仅仅是给写程序的同学看的，实际上在运行的时候，会使用 Babel 插件将 JSX 语法的代码还原为 React.createElement 的代码。

**总结：** JSX 是一个 JavaScript 的语法扩展，结构类似 XML。JSX 主要用于声明 React 元素，但 React 中并不强制使用 JSX。即使使用了 JSX，也会在构建过程中，通过 Babel 插件编译为 React.createElement。所以 JSX 更像是 React.createElement 的一种语法糖。

React 团队并不想引入 JavaScript 本身以外的开发体系。而是希望通过合理的关注点分离保持组件开发的纯粹性。

### 2.对React和Vue的理解，它们的异同

**相似之处：**

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

### 3.React Fiber

 [这可能是最通俗的 React Fiber(时间分片) 打开方式](https://juejin.cn/post/6844903975112671239)

[浅谈对 React Fiber 的理解](https://juejin.cn/post/6926432527980691470)

#### 基本理论

代操作系统都是**多任务操作系统**. 进程的调度策略如果按照CPU核心数来划分，可以分为**单处理器调度**和**多处理器调度**。本文只关注的是单处理器调度，因为它可以类比JavaScript的运行机制

**为了实现进程的并发，操作系统会按照一定的调度策略，将CPU的执行权分配给多个进程，多个进程都有被执行的机会，让它们交替执行，形成一种“同时在运行”假象, 因为CPU速度太快，人类根本感觉不到。实际上在单核的物理环境下同时只能有一个程序在运行**

进程**调度策略**

**先到先得(First-Come-First-Served, FCFS)**

这是最简单的调度策略, 简单说就是**没有调度**。谁先来谁就先执行，执行完毕后就执行下一个。不过如果中间某些进程因为I/O阻塞了，这些进程会挂起移回就绪队列(说白了就是重新排队).

`FCFS` 上面 `DOS` 的单任务操作系统没有太大的区别。所以非常好理解，因为生活中到处是这样的例子:。

- **FCFS 对`短进程`不利**。 短进程即执行时间非常短的进程，可以用饭堂排队来比喻: *在饭堂排队打饭的时候，最烦那些一个人打包好好几份的人，这些人就像`长进程`一样，霸占着CPU资源，后面排队只打一份的人会觉得很吃亏，打一份的人会觉得他们优先级应该更高，毕竟他们花的时间很短，反正你打包那么多份再等一会也是可以的，何必让后面那么多人等这么久...*
- **FCFS 对`I/O密集`不利**。I/O密集型进程(这里特指同步I/O)在进行I/O操作时，会阻塞休眠，这会导致进程重新被放入就绪队列，等待下一次被宠幸。 可以类比ZF部门办业务: *假设 CPU 一个窗口、I/O 一个窗口。在CPU窗口好不容易排到你了，这时候发现一个不符合条件或者漏办了, 需要去I/O搞一下，Ok 去 I/O窗口排队，I/O执行完了，到CPU窗口又得重新排队。对于这些丢三落四的人很不公平...*

所以 FCFS 这种原始的策略在单处理器进程调度中并不受欢迎

**轮转**

这是一种基于时钟的**抢占策略**，这也是抢占策略中最简单的一种: **公平地给每一个进程一定的执行时间，当时间消耗完毕或阻塞，操作系统就会调度其他进程，将执行权抢占过来**。

> **决策模式**: `抢占策略`相对应的有`非抢占策略`，非抢占策略指的是让进程运行直到结束、阻塞(如I/O或睡眠)、或者主动让出控制权；抢占策略支持中断正在运行的进程，将主动权掌握在操作系统这里，不过通常开销会比较大。

这种调度策略的要点是**确定合适的时间片长度**: 太长了，长进程霸占太久资源，其他进程会得不到响应(等待执行时间过长)，这时候就跟上述的 `FCFS` 没什么区别了;  太短了也不好，因为进程抢占和切换都是需要成本的, 而且成本不低，时间片太短，时间可能都浪费在上下文切换上了，导致进程干不了什么实事。

因此**时间片的长度最好符合大部分进程完成一次典型交互所需的时间**.

轮转策略非常容易理解，只不过确定时间片长度需要伤点脑筋；另外和`FCFS`一样，轮转策略对I/O进程还是不公平。

**2️⃣ 最短进程优先(Shortest Process Next, SPN)**

上面说了`先到先得`策略对`短进程`不公平，`最短进程优先`索性就让'最短'的进程优先执行，也就是说: **按照进程的预估执行时间对进程进行优先级排序，先执行完短进程，后执行长进程。这是一种非抢占策略**。

这样可以让短进程能得到较快的响应。但是怎么获取或者**评估进程执行时间**呢？一是让程序的提供者提供，这不太靠谱；二是由操作系统来收集进程运行数据，并对它们进程统计分析。例如最简单的是计算它们的平均运行时间。不管怎么说都比上面两种策略要复杂一点。

`SPN` 的缺陷是: 如果系统有大量的短进程，那么长进程可能会饥饿得不到响应。

另外因为它不是抢占性策略, 尽管现在短进程可以得到更多的执行机会，但是还是没有解决 `FCFS` 的问题: 一旦长进程得到CPU资源，得等它执行完，导致后面的进程得不到响应。



**3️⃣ 最短剩余时间(Shortest Remaining Time, SRT)**

**SRT 进一步优化了SPN，增加了抢占机制**。在 SPN 的基础上，当一个进程添加到就绪队列时，操作系统会比较*刚添加的新进程*和*当前正在执行的老进程*的‘剩余时间’，如果新进程剩余时间更短，新进程就会抢占老进程。

相比轮转的抢占，SRT 没有中断处理的开销。但是在 SPN 的基础上，操作系统需要记录进程的历史执行时间，这是新增的开销。**另外长进程饥饿问题还是没有解决**。



**4️⃣ 最高响应比优先(HRRN)**

**为了解决长进程饥饿问题，同时提高进程的响应速率**。还有一种`最高响应比优先的`策略，首先了解什么是响应比:

```
响应比 = （等待执行时间 + 进程执行时间） / 进程执行时间
```

**这种策略会选择响应比最高的进程优先执行**：

- 对于短进程来说，因为执行时间很短，分母很小，所以响应比比较高，会被优先执行
- 对于长进程来说，执行时间长，一开始响应比小，但是随着等待时间增长，它的优先级会越来越高，最终可以被执行



**5️⃣ 反馈法**

SPN、SRT、HRRN都需要对进程时间进行评估和统计，实现比较复杂且需要一定开销。而反馈法采取的是**事后反馈**的方式。这种策略下: **每个进程一开始都有相同的优先级，每次被抢占(需要配合其他抢占策略使用，如轮转)，优先级就会降低一级。因此通常它会根据优先级划分多个队列**。

举个例子:

```
队列1
队列2
...
队列N
```

新增的任务会推入`队列1`，`队列1`会按照`轮转策略`以一个时间片为单位进行调度。短进程可以很快得到响应，而对于长进程可能一个时间片处理不完，就会被抢占，放入`队列2`。

`队列2`会在`队列1`任务清空后被执行，有时候低优先级队列可能会等待很久才被执行，所以一般会给予一定的补偿，例如增加执行时间，所以`队列2`的轮转时间片长度是2。

反馈法仍然可能导致长进程饥饿，所以操作系统可以统计长进程的等待时间，当等待时间超过一定的阈值，可以选择提高它们的优先级。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsGhC8L3Fj7cQUHYA.webp)



没有一种调度策略是万能的, 它需要考虑很多因素:

- 响应速率。进程等待被执行的时间
- 公平性。兼顾短进程、长进程、I/O进程

这两者在某些情况下是对立的，提高了响应，可能会减低公平性，导致饥饿。短进程、长进程、I/O进程之间要取得平衡也非常难。

#### Fiber 出现的背景

JavaScript 引擎和页面渲染引擎两个线程是互斥的，当其中一个线程执行时，另一个线程只能挂起等待。

在这样的机制下，如果 JavaScript 线程长时间地占用了主线程，那么渲染层面的更新就不得不长时间地等待，界面长时间不更新，会导致页面响应度变差，用户可能会感觉到卡顿。

而这正是 React 15 的 Stack Reconciler 所面临的问题，即是 JavaScript 对主线程的超时占用问题。Stack Reconciler 是一个同步的递归过程，使用的是 JavaScript 引擎自身的函数调用栈，它会一直执行到栈空为止，所以当 React 在渲染组件时，从开始到渲染完成整个过程是一气呵成的。如果渲染的组件比较庞大，js 执行会占据主线程较长时间，会导致页面响应度变差。

而且所有的任务都是按照先后顺序，没有区分优先级，这样就会导致优先级比较高的任务也无法被优先执行



#### Fiber优点

JavaScript 是[单线程运行](https://juejin.cn/post/6844903553795014663)的，而且在浏览器环境屁事非常多，它要负责页面的JS解析和执行、绘制、事件处理、静态资源加载和处理, 这些任务可以类比上面’进程‘。

> 这里特指Javascript 引擎是单线程运行的。 严格来说，Javascript 引擎和页面渲染引擎在同一个`渲染线程`，GUI 渲染和 Javascript执行 两者是互斥的. 另外异步 I/O 操作底层实际上可能是多线程的在驱动。

**它只是一个'JavaScript'，同时只能做一件事情，这个和 `DOS` 的单任务操作系统一样的，事情只能一件一件的干。要是前面有一个傻叉任务长期霸占CPU，后面什么事情都干不了，浏览器会呈现卡死的状态，这样的用户体验就会非常差**。

**解决这种问题有三个方向**:

- 1️⃣ 优化每个任务，让它有多快就多快。挤压CPU运算量
- 2️⃣ 快速响应用户，让用户觉得够快，不能阻塞用户的交互
- 3️⃣ 尝试 Worker 多线程





在 Reconcilation 期间，React 会霸占着浏览器资源，一则会导致用户触发的事件得不到响应, 二则会导致掉帧，用户可以感知到这些卡顿。

React 的 Reconcilation 是CPU密集型的操作, 它就相当于我们上面说的’长进程‘。所以初衷和进程调度一样，我们要让高优先级的进程或者短进程优先运行，不能让长进程长期霸占资源。

为了给用户制造一种应用很快的'假象'，我们不能让一个程序长期霸占着资源. 你可以将浏览器的渲染、布局、绘制、资源加载(例如HTML解析)、事件响应、脚本执行视作操作系统的'进程'，我们需要通过某些调度策略合理地分配CPU资源，从而提高浏览器的用户响应速率, 同时兼顾任务执行效率



**所以 React 通过Fiber 架构，让自己的Reconcilation 过程变成可被中断。 '适时'地让出CPU执行权，除了可以让浏览器及时地响应用户的交互，还有其他好处**:

与其一次性操作大量 DOM 节点相比, 分批延时对DOM进行操作，可以得到更好的用户体验

给浏览器一点喘息的机会，他会对代码进行编译优化（JIT）及进行热代码优化，或者对reflow进行修正.



#### Fiber 是什么

Fiber 的中文翻译叫纤程，与进程、线程同为程序执行过程，Fiber 就是比线程还要纤细的一个过程。纤程意在对渲染过程实现进行更加精细的控制。

从架构角度来看，Fiber 是对 React 核心算法（即调和过程）的重写。

从编码角度来看，Fiber 是 React 内部所定义的一种数据结构，它是 Fiber 树结构的节点单位，也就是 React 16 新架构下的"虚拟 DOM"。

一个 fiber 就是一个 JavaScript 对象，Fiber 的数据结构如下：

```js
type Fiber = {
  // 用于标记fiber的WorkTag类型，主要表示当前fiber代表的组件类型如FunctionComponent、ClassComponent等
  tag: WorkTag,
  // ReactElement里面的key
  key: null | string,
  // ReactElement.type，调用`createElement`的第一个参数
  elementType: any,
  // The resolved function/class/ associated with this fiber.
  // 表示当前代表的节点类型
  type: any,
  // 表示当前FiberNode对应的element组件实例
  stateNode: any,

  // 指向他在Fiber节点树中的`parent`，用来在处理完这个节点之后向上返回
  return: Fiber | null,
  // 指向自己的第一个子节点
  child: Fiber | null,
  // 指向自己的兄弟结构，兄弟节点的return指向同一个父节点
  sibling: Fiber | null,
  index: number,

  ref: null | (((handle: mixed) => void) & { _stringRef: ?string }) | RefObject,

  // 当前处理过程中的组件props对象
  pendingProps: any,
  // 上一次渲染完成之后的props
  memoizedProps: any,

  // 该Fiber对应的组件产生的Update会存放在这个队列里面
  updateQueue: UpdateQueue<any> | null,

  // 上一次渲染的时候的state
  memoizedState: any,

  // 一个列表，存放这个Fiber依赖的context
  firstContextDependency: ContextDependency<mixed> | null,

  mode: TypeOfMode,

  // Effect
  // 用来记录Side Effect
  effectTag: SideEffectTag,

  // 单链表用来快速查找下一个side effect
  nextEffect: Fiber | null,

  // 子树中第一个side effect
  firstEffect: Fiber | null,
  // 子树中最后一个side effect
  lastEffect: Fiber | null,

  // 代表任务在未来的哪个时间点应该被完成，之后版本改名为 lanes
  expirationTime: ExpirationTime,

  // 快速确定子树中是否有不在等待的变化
  childExpirationTime: ExpirationTime,

  // fiber的版本池，即记录fiber更新过程，便于恢复
  alternate: Fiber | null,
}

```

>在 2020 年 5 月，以 expirationTime 属性为代表的优先级模型被 lanes 取代。

#### Fiber 如何解决问题的

Fiber 把一个渲染任务分解为多个渲染任务，而不是一次性完成，把每一个分割得很细的任务视作一个"执行单元"，React 就会检查现在还剩多少时间，如果没有时间就将控制权让出去，故任务会被分散到多个帧里面，中间可以返回至主进程控制执行其他任务，最终实现更流畅的用户体验。

即是实现了"增量渲染"，实现了可中断与恢复，恢复后也可以复用之前的中间状态，并给不同的任务赋予不同的优先级，其中每个任务更新单元为 React Element 对应的 Fiber 节点。

#### Fiber 实现原理

实现的方式是`requestIdleCallback`这一 API，但 React 团队 polyfill 了这个 API，使其对比原生的浏览器兼容性更好且拓展了特性。

> `window.requestIdleCallback()`方法将在浏览器的空闲时段内调用的函数排队。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间 timeout，则有可能为了在超时前执行函数而打乱执行顺序。

`requestIdleCallback`回调的执行的前提条件是当前浏览器处于空闲状态。

即`requestIdleCallback`的作用是在浏览器一帧的剩余空闲时间内执行优先度相对较低的任务。首先 React 中任务切割为多个步骤，分批完成。**在完成一部分任务之后，将控制权交回给浏览器，让浏览器有时间再进行页面的渲染**。等浏览器忙完之后有剩余时间，再继续之前 React 未完成的任务，是一种合作式调度。

简而言之，由浏览器给我们分配执行时间片，我们要按照约定在这个时间内执行完毕，并将控制权还给浏览器。

React 16 的`Reconciler`基于 Fiber 节点实现，被称为 Fiber Reconciler。

作为静态的数据结构来说，每个 Fiber 节点对应一个 React element，保存了该组件的类型（函数组件/类组件/原生组件等等）、对应的 DOM 节点等信息。

作为动态的工作单元来说，每个 Fiber 节点保存了本次更新中该组件改变的状态、要执行的工作。

每个 Fiber 节点有个对应的 React element，多个 Fiber 节点是如何连接形成树呢？靠如下三个属性：

```javascript
// 指向父级Fiber节点
this.return = null
// 指向子Fiber节点
this.child = null
// 指向右边第一个兄弟Fiber节点
this.sibling = null
```

#### Fiber 架构核心

Fiber 架构可以分为三层：

- Scheduler 调度器 —— 调度任务的优先级，高优任务优先进入 Reconciler
- Reconciler 协调器 —— 负责找出变化的组件
- Renderer 渲染器 —— 负责将变化的组件渲染到页面上

相比 React15，React16 多了**Scheduler（调度器）**，调度器的作用是调度更新的优先级。

在新的架构模式下，工作流如下：

- 每个更新任务都会被赋予一个优先级。
- 当更新任务抵达调度器时，高优先级的更新任务（记为 A）会更快地被调度进 Reconciler 层；
- 此时若有新的更新任务（记为 B）抵达调度器，调度器会检查它的优先级，若发现 B 的优先级高于当前任务 A，那么当前处于 Reconciler 层的 A 任务就会被中断，调度器会将 B 任务推入 Reconciler 层。
- 当 B 任务完成渲染后，新一轮的调度开始，之前被中断的 A 任务将会被重新推入 Reconciler 层，继续它的渲染之旅，即“可恢复”。

**Fiber 架构的核心即是"可中断"、"可恢复"、"优先级"**

#### Scheduler 调度器

这个需要上面提到的`requestIdleCallback`，React 团队实现了功能更完备的 `requestIdleCallback` polyfill，这就是 Scheduler。除了在空闲时触发回调的功能外，Scheduler 还提供了多种调度优先级供任务设置。

#### Reconciler 协调器

在 React 15 中是递归处理虚拟 DOM 的，React 16 则是变成了可以中断的循环过程，每次循环都会调用`shouldYield`判断当前是否有剩余时间。

```javascript
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    // workInProgress表示当前工作进度的树。
    workInProgress = performUnitOfWork(workInProgress)
  }
}
```

React 16 是如何解决中断更新时 DOM 渲染不完全的问题呢？

在 React 16 中，`Reconciler`与`Renderer`不再是交替工作。当`Scheduler`将任务交给`Reconciler`后，`Reconciler`会为变化的虚拟 DOM 打上的标记。

```javascript
export const Placement = /*             */ 0b0000000000010
export const Update = /*                */ 0b0000000000100
export const PlacementAndUpdate = /*    */ 0b0000000000110
export const Deletion = /*              */ 0b0000000001000
```

- `Placement`表示插入操作
- `PlacementAndUpdate`表示替换操作
- `Update`表示更新操作
- `Deletion`表示删除操作

整个`Scheduler`与`Reconciler`的工作都在内存中进行，所以即使反复中断，用户也不会看见更新不完全的 DOM。只有当所有组件都完成`Reconciler`的工作，才会统一交给`Renderer`。

#### Renderer 渲染器

`Renderer`根据`Reconciler`为虚拟 DOM 打的标记，同步执行对应的 DOM 操作。

#### Fiber 架构对生命周期的影响


![d8eb7f64f3f94a9f8038949001284385](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgssdbO71P4LqIu295.png)

1. render 阶段：纯净且没有副作用，可能会被 React 暂停、终止或重新启动。
2. pre-commit 阶段：可以读取 DOM。
3. commit 阶段：可以使用 DOM，运行副作用，安排更新。

其中 pre-commit 和 commit 从大阶段上来看都属于 commit 阶段。



在 render 阶段，React 主要是在内存中做计算，明确 DOM 树的更新点；而 commit 阶段，则负责把 render 阶段生成的更新真正地执行掉。

新老两种架构对 React 生命周期的影响主要在 render 这个阶段，这个影响是通过增加 Scheduler 层和改写 Reconciler 层来实现的。

在 render 阶段，一个庞大的更新任务被分解为了一个个的工作单元，这些工作单元有着不同的优先级，React 可以根据优先级的高低去实现工作单元的打断和恢复。

而这次从 Firber 机制 render 阶段的角度看这三个生命周期，这三个生命周期的共同特点是都处于 render 阶段：

```jsx
componentWillMount
componentWillUpdate
componentWillReceiveProps
```

由于 render 阶段是允许暂停、终止和重启的，这就导致 render 阶段的生命周期都有可能被重复执行，故也是废弃他们的原因之一。



#### Fiber 更新过程

虚拟 DOM 更新过程分为 2 个阶段：

- **render/reconciliation 协调阶段(可中断/异步)**：通过 Diff 算法找出所有节点变更，例如节点新增、删除、属性变更等等, 获得需要更新的节点信息，对应早期版本的 Diff 过程。
- **commit 提交阶段(不可中断/同步)**：将需要更新的节点一次过批量更新，对应早期版本的 patch 过程。

![reactfiber](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsreactfiber.png)

##### 协调阶段

在协调阶段会进行 Diff 计算，会生成一棵 Fiber 树。

该阶段开始于`performSyncWorkOnRoot`或`performConcurrentWorkOnRoot`方法的调用。这取决于本次更新是同步更新还是异步更新。

```javascript
// performSyncWorkOnRoot会调用该方法
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress)
  }
}

// performConcurrentWorkOnRoot会调用该方法
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress)
  }
}
```

它们唯一的区别是是否调用`shouldYield`。如果当前浏览器帧没有剩余时间，`shouldYield`会中止循环，直到浏览器有空闲时间后再继续遍历。

`workInProgress`代表当前已创建的 workInProgress fiber。

`performUnitOfWork`方法将触发对 `beginWork` 的调用，进而实现对新 Fiber 节点的创建。若 `beginWork` 所创建的 Fiber 节点不为空，则 `performUniOfWork` 会用这个新的 Fiber 节点来更新 `workInProgress` 的值，为下一次循环做准备。

通过循环调用 `performUnitOfWork` 来触发 `beginWork`，新的 Fiber 节点就会被不断地创建。当 `workInProgress` 终于为空时，说明没有新的节点可以创建了，也就意味着已经完成对整棵 Fiber 树的构建。

我们知道 Fiber Reconciler 是从 Stack Reconciler 重构而来，通过遍历的方式实现可中断的递归，所以`performUnitOfWork`的工作可以分为两部分："递"和"归"。

**"递阶段"**

首先从 rootFiber 开始向下深度优先遍历。为遍历到的每个 Fiber 节点调用`beginWork`方法。

```javascript
function beginWork(
  current: Fiber | null, // 当前组件对应的Fiber节点在上一次更新时的Fiber节点
  workInProgress: Fiber, // 当前组件对应的Fiber节点
  renderExpirationTime: ExpirationTime // 优先级相关
): Fiber | null {
  // ...省略函数体
}
```

该方法会根据传入的 Fiber 节点创建子 Fiber 节点，并将这两个 Fiber 节点连接起来。

当遍历到叶子节点（即没有子组件的组件）时就会进入"归"阶段。

**"归阶段"**

在"归"阶段会调用`completeWork`处理 Fiber 节点。

> completeWork 将根据 workInProgress 节点的 tag 属性的不同，进入不同的 DOM 节点的创建、处理逻辑。

completeWork 内部有 3 个关键动作：

- 创建 DOM 节点（CreateInstance）
- 将 DOM 节点插入到 DOM 树中（AppendAllChildren）
- 为 DOM 节点设置属性（FinalizeInitialChildren）

当某个 Fiber 节点执行完`completeWork`，如果其存在兄弟 Fiber 节点（即`fiber.sibling !== null`），会进入其兄弟 Fiber 的"递"阶段。

如果不存在兄弟 Fiber，会进入父级 Fiber 的"归"阶段。

"递"和"归"阶段会交错执行直到"归"到 rootFiber。至此，协调阶段的工作就结束了。

##### commit 提交阶段

commit 阶段的主要工作（即 Renderer 的工作流程）分为三部分：

- before mutation 阶段，这个阶段 DOM 节点还没有被渲染到界面上去，过程中会触发 `getSnapshotBeforeUpdate`，也会处理 `useEffect` 钩子相关的调度逻辑。
- mutation 阶段，这个阶段负责 DOM 节点的渲染。在渲染过程中，会遍历 effectList，根据 flags（effectTag）的不同，执行不同的 DOM 操作。
- layout 阶段，这个阶段处理 DOM 渲染完毕之后的收尾逻辑。比如调用 `componentDidMount/componentDidUpdate`，调用 `useLayoutEffect` 钩子函数的回调等。除了这些之外，它还会把 fiberRoot 的 current 指针指向 workInProgress Fiber 树。

### 4.**React性能优化**

React 应用也是前端应用，如果之前你知道一些前端项目普适的性能优化手段，比如资源加载过程中的优化、减少重绘与回流、服务端渲染、启用 CDN 等，那么这些手段对于 React 来说也是同样奏效的。

不过对于 React 项目来说，它有一个区别于传统前端项目的重要特点，就是**以 React 组件的形式来组织逻辑**：组件允许我们将 UI 拆分为独立可复用的代码片段，并对每个片段进行独立构思。因此，除了前面所提到的普适的前端性能优化手段之外，React 还有一些充满了自身特色的性能优化思路，这些思路基本都围绕“组件性能优化”这个中心思想展开

1. **使用 shouldComponentUpdate 规避冗余的更新逻辑**
2. **PureComponent + Immutable.js**
3. **React.memo 与 useMemo**

#### 善用 shouldComponentUpdate

shouldComponentUpdate 是 React 类组件的一个生命周期。关于 shouldComponentUpdate 是什么，我们已经在第 02 讲有过介绍，这里先简单复习一下。

shouldComponentUpdate 的调用形式如下：

```jsx
shouldComponentUpdate(nextProps, nextState)
```

render 方法由于伴随着对虚拟 DOM 的构建和对比，过程可以说相当耗时。而在 React 当中，很多时候我们会不经意间就频繁地调用了 render。为了避免不必要的 render 操作带来的性能开销，React 提供了 shouldComponentUpdate 这个口子。**React 组件会根据 shouldComponentUpdate 的返回值，来决定是否执行该方法之后的生命周期，进而决定是否对组件进行 re-render（重渲染）**。

shouldComponentUpdate 的默认值为 true，也就是说 **“无条件 re-render”**。在实际的开发中，我们往往通过手动往 shouldComponentUpdate 中填充判定逻辑，来实现“有条件的 re-render”。

接下来我们通过一个 Demo，来感受一下 shouldComponentUpdate 到底是如何解决问题的。在这个 Demo 中会涉及 3 个组件：子组件 ChildA、ChildB 及父组件 App 组件。

首先我们来看两个子组件的代码，这里为了尽量简化与数据变更无关的逻辑，ChildA 和 ChildB 都只负责从父组件处读取数据并渲染，它们的编码分别如下所示。

ChildA.js：

```jsx
import React from "react";
export default class ChildA extends React.Component {
  render() {
    console.log("ChildA 的render方法执行了");
    return (
      <div className="childA">
        子组件A的内容：
        {this.props.text}
      </div>
    );
  }
}
```

ChildB.js：

```jsx
import React from "react";
export default class ChildB extends React.Component {
  render() {
    console.log("ChildB 的render方法执行了");
    return (
      <div className="childB">
        子组件B的内容：
        {this.props.text}
      </div>
    );
  }
}
```

在共同的父组件 App.js 中，会将 ChildA 和 ChildB 组合起来，并分别向其中注入数据：

```jsx
import React from "react";
import ChildA from './ChildA'
import ChildB from './ChildB'
class App extends React.Component {
  state = {
    textA: '我是A的文本',
    textB: '我是B的文本'
  }
  changeA = () => {
    this.setState({
      textA: 'A的文本被修改了'
    })
  }
  changeB = () => {
    this.setState({
      textB: 'B的文本被修改了'
    })
  }
  render() {
    return (
    <div className="App">
      <div className="container">
        <button onClick={this.changeA}>点击修改A处的文本</button>
        <button onClick={this.changeB}>点击修改B处的文本</button>
        <ul>
          <li>
            <ChildA text={this.state.textA}/>
          </li>
        <li>
          <ChildB text={this.state.textB}/>
        </li>
        </ul>
      </div>
    </div>
  );
  }
}
export default App;
```

App 组件最终渲染到界面上的效果如下图所示，两个子组件在图中分别被不同颜色的标注圈出：

![Drawing 0.png](https://s0.lgstatic.com/i/image/M00/8B/D3/CgqCHl_ga3-ADPKZAACHTPJhWNw299.png)

通过点击左右两个按钮，我们可以分别对 ChildA 和 ChildB 中的文案进行修改。

由于初次渲染时，两个组件的 render 函数都必然会被触发，因此控制台在挂载完成后的输出内容如下图所示：

![Drawing 1.png](https://s0.lgstatic.com/i/image2/M01/03/AA/CgpVE1_ga4qAdOlsAAAzU_bU8eQ279.png)

接下来我点击左侧的按钮，尝试对 A 处的文本进行修改。我们可以看到界面上只有 A 处的渲染效果发生了改变，如下图箭头处所示：

![Drawing 2.png](https://s0.lgstatic.com/i/image2/M01/03/A9/Cip5yF_ga5KALnO1AABLrDrgDGM452.png)

但是如果我们打开控制台，会发现输出的内容如下图所示：

![Drawing 3.png](https://s0.lgstatic.com/i/image2/M01/03/A9/Cip5yF_ga5qABE7ZAABs-adr_7k107.png)

这样的输出结果告诉我们，在刚刚的点击动作后，不仅 ChildA 的 re-render 被触发了，ChildB 的 re-render 也被触发了。

在 React 中，**只要父组件发生了更新，那么所有的子组件都会被无条件更新**。这就导致了 ChildB 的 props 尽管没有发生任何变化，它本身也没有任何需要被更新的点，却还是会走一遍更新流程。

> 注：同样的情况也适用于组件自身的更新：当组件自身调用了 setState 后，那么不管 setState 前后的状态内容是否真正发生了变化，它都会去走一遍更新流程。

而在刚刚这个更新流程中，shouldComponentUpdate 函数没有被手动定义，因此它将返回“true”这个默认值。“true”则意味着对更新流程不作任何制止，也即所谓的“无条件 re-render”。在这种情况下，我们就可以考虑使用 shouldComponentUpdate 来对更新过程进行管控，避免没有意义的 re-render 发生。

现在我们就可以为 ChildB 加装这样一段 shouldComponentUpdate 逻辑：

```jsx
shouldComponentUpdate(nextProps, nextState) {
  // 判断 text 属性在父组件更新前后有没有发生变化，若没有发生变化，则返回 false
  if(nextProps.text === this.props.text) {
    return false
  }
  // 只有在 text 属性值确实发生变化时，才允许更新进行下去
  return true
}
```

在这段逻辑中，我们对 ChildB 中的可变数据，也就是 this.props.text 这个属性进行了判断。

这样，当父组件 App 组件发生更新、进而试图触发 ChildB 的更新流程时，shouldComponentUpdate 就会充当一个“守门员”的角色：它会检查新下发的 props.text 是否和之前的值一致，如果一致，那么就没有更新的必要，直接返回“false”将整个 ChildB 的更新生命周期中断掉即可。只有当 props.text 确实发生变化时，它才会“准许” re-render 的发生。

在 shouldComponentUpdate 的加持下，当我们再次点击左侧按钮，试图修改 ChildA 的渲染内容时，控制台的输出就会变成下图这样：

![Drawing 4.png](https://s0.lgstatic.com/i/image2/M01/03/AA/CgpVE1_ga6yAVvq5AABmBay34YA804.png)

我们看到，控制台中现在只有 ChildA 的 re-render 提示。ChildB “稳如泰山”，成功躲开了一次多余的渲染。

使用 shouldComponentUpdate 来调停不必要的更新，避免无意义的 re-render 发生，这是 React 组件中最基本的性能优化手段，也是最重要的手段。许多看似高级的玩法，都是基于 shouldComponentUpdate 衍生出来的。我们接下来要讲的 PureComponent，就是这类玩法中的典型。

#### 进阶玩法：PureComponent  + Immutable.js

##### PureComponent：提前帮你安排好更新判定逻辑

shouldComponentUpdate 虽然一定程度上帮我们解决了性能方面的问题，但每次避免 re-render，都要手动实现一次 shouldComponentUpdate，未免太累了。作为一个不喜欢重复劳动的前端开发者来说，在写了不计其数个 shouldComponentUpdate 逻辑之后，难免会怀疑人生，进而发出由衷的感叹——“这玩意儿要是能内置到组件里该多好啊！”。

哪里有需求，哪里就有产品。React 15.3 很明显听到了开发者的声音，它新增了一个叫 [PureComponent](https://zh-hans.reactjs.org/docs/react-api.html#reactpurecomponent) 的类，恰到好处地解决了“程序员写 shouldComponentUpdate 写出腱鞘炎”这个问题。

PureComponent 与 Component 的区别点，就在于它内置了对 shouldComponentUpdate 的实现：PureComponent 将会在 shouldComponentUpdate 中对组件更新前后的 props 和 state 进行**浅比较**，并根据浅比较的结果，决定是否需要继续更新流程。

“浅比较”将针对值类型数据对比其值是否相等，而针对数组、对象等引用类型的数据则对比其引用是否相等。

在我们开篇的 Demo 中，若把 ChildB 的父类从 Component 替换为 PureComponent（修改后的代码如下所示），那么无须手动编写 shouldComponentUpdate，也可以达到同样避免 re-render 的目的。

```jsx
import React from "react";
export default class ChildB extends React.PureComponent {
  render() {
    console.log("ChildB 的render方法执行了");
    return (
      <div className="childB">
        子组件B的内容：
        {this.props.text}
      </div>
    );
  }
}
```

此时再去修改 ChildA 中的文本，我们会发现 ChildB 同样不受影响。点击左侧按钮后，控制台对应的输出内容如下图高亮处所示：

![Drawing 5.png](https://s0.lgstatic.com/i/image2/M01/03/A9/Cip5yF_ga8qADhf9AACUfTqE0ag890.png)

在值类型数据这种场景下，PureComponent 可以说是战无不胜。但是如果数据类型为引用类型，那么这种基于浅比较的判断逻辑就会带来这样两个风险：

1. 若数据内容没变，但是引用变了，那么浅比较仍然会认为“数据发生了变化”，进而触发一次不必要的更新，导致过度渲染；
2. 若数据内容变了，但是引用没变，那么浅比较则会认为“数据没有发生变化”，进而阻断一次更新，导致不渲染。

怎么办呢？Immutable.js 来帮忙！

##### Immutable：“不可变值”让“变化”无处遁形

PureComponent 浅比较带来的问题，本质上是对“变化”的判断不够精准导致的。那有没有一种办法，能够让引用的变化和内容的变化之间，建立一种必然的联系呢？

这就是 Immutable.js 所做的事情。

Immutable 直译过来是“不可变的”，顾名思义，Immutable.js 是对“不可变值”这一思想的贯彻实践。它在 2014 年被 Facebook 团队推出，Facebook 给它的定位是“实现持久性数据结构的库”。**所谓“持久性数据”，指的是这个数据只要被创建出来了，就不能被更改。我们对当前数据的任何修改动作，都会导致一个新的对象的返回**。这就将数据内容的变化和数据的引用严格地关联了起来，使得“变化”无处遁形。

这里我用一个简单的例子，来演示一下 Immutable.js 的效果。请看下面代码：

```
// 引入 immutable 库里的 Map 对象，它用于创建对象
import { Map } from 'immutable'
// 初始化一个对象 baseMap
const baseMap = Map({
  name: '修言',
  career: '前端',
  age: 99
})
// 使用 immutable 暴露的 Api 来修改 baseMap 的内容
const changedMap = baseMap.set({
  age: 100
})
// 我们会发现修改 baseMap 后将会返回一个新的对象，这个对象的引用和 baseMap 是不同的
console.log('baseMap === changedMap', baseMap === changedMap)
```

由此可见，PureComonent 和 Immutable.js 真是一对好基友,在实际的开发中，我们也确实经常左手 PureComonent，右手 Immutable.js，研发质量大大地提升

> 值得注意的是，由于 Immutable.js 存在一定的学习成本，并不是所有场景下都可以作为最优解被团队采纳。因此，一些团队也会基于 PureComonent 和 Immutable.js 去打造将两者结合的公共类，通过改写 setState 来提升研发体验，这也是不错的思路。

#### 函数组件的性能优化：React.memo 和 useMemo

以上咱们讨论的都是类组件的优化思路。那么在函数组件中，有没有什么通用的手段可以阻止“过度 re-render”的发生呢？接下来我们就一起认识一下“函数版”的 shouldComponentUpdate/Purecomponent —— React.memo。

##### React.memo：“函数版”shouldComponentUpdate/PureComponent

React.memo 是 React 导出的一个顶层函数，它本质上是一个高阶组件，负责对函数组件进行包装。基本的调用姿势如下面代码所示：

```jsx
import React from "react";
// 定义一个函数组件
function FunctionDemo(props) {
  return xxx
}
// areEqual 函数是 memo 的第二个入参，我们之前放在 shouldComponentUpdate 里面的逻辑就可以转移至此处
function areEqual(prevProps, nextProps) {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
}
// 使用 React.memo 来包装函数组件
export default React.memo(FunctionDemo, areEqual);
```

**React.memo 会帮我们“记住”函数组件的渲染结果，在组件前后两次 props 对比结果一致的情况下，它会直接复用最近一次渲染的结果**。如果我们的组件在相同的 props 下会渲染相同的结果，那么使用 React.memo 来包装它将是个不错的选择。

从示例中我们可以看出，React.memo 接收两个参数，第一个参数是我们需要渲染的目标组件，第二个参数 areEqual 则用来承接 props 的对比逻辑。**之前我们在 shouldComponentUpdate 里面做的事情，现在就可以放在 areEqual 里来做**。

比如开篇 Demo 中的 ChildB 组件，就完全可以用 Function Component + React.memo 来改造。改造后的 ChildB 代码如下：

```jsx
import React from "react";
// 将 ChildB 改写为 function 组件
function ChildB(props) {
  console.log("ChildB 的render 逻辑执行了");
  return (
    <div className="childB">
      子组件B的内容：
      {props.text}
    </div>
  );
}
// areEqual 用于对比 props 的变化
function areEqual(prevProps, nextProps) {
  if(prevProps.text === nextProps.text) {
    return true
  }
  return false
}
// 使用 React.memo 来包装 ChildB
export default React.memo(ChildB, areEqual);
```

改造后的组件在效果上就等价于 shouldComponentUpdate 加持后的类组件 ChildB。

**这里的 areEqual 函数是一个可选参数，当我们不传入 areEqual 时，React.memo 也可以工作，此时它的作用就类似于 PureComponent——React.memo 会自动为你的组件执行 props 的浅比较逻辑**。

和 shouldComponentUpdate 不同的是，React.memo 只负责对比 props，而不会去感知组件内部状态（state）的变化。

##### useMemo：更加“精细”的 memo

通过上面的分析我们知道，React.memo 可以实现类似于 shouldComponentUpdate 或者 PureComponent 的效果，对组件级别的 re-render 进行管控。但是有时候，我们希望复用的并不是整个组件，而是组件中的某一个或几个部分。这种更加“精细化”的管控，就需要 useMemo 来帮忙了。

**简而言之，React.memo 控制是否需要重渲染一个组件，而 useMemo 控制的则是是否需要重复执行某一段逻辑**。

useMemo 的使用方式如下面代码所示：

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

我们可以把目标逻辑作为第一个参数传入，把逻辑的依赖项数组作为第二个参数传入。这样只有当依赖项数组中的某个依赖发生变化时，useMemo 才会重新执行第一个入参中的目标逻辑。

这里我仍然以开篇的示例为例，现在我尝试向 ChildB 中传入两个属性：text 和 count，它们分别是一段文本和一个数字。当我点击右边的按钮时，只有 count 数字会发生变化。改造后的 App 组件代码如下：

```jsx
class App extends React.Component {
  state = {
    textA: '我是A的文本',
    stateB: {
      text: '我是B的文本',
      count: 10
    }
  }
  changeA = () => {
    this.setState({
      textA: 'A的文本被修改了'
    })
  }
  changeB = () => {
    this.setState({
      stateB: {
        ...this.state.stateB,
        count: 100
      }
    })
  }
  render() {
    return (
    <div className="App">
      <div className="container">
        <button onClick={this.changeA}>点击修改A处的文本</button>
        <button onClick={this.changeB}>点击修改B处的文本</button>
        <ul>
          <li>
            <ChildA text={this.state.textA}/>
          </li>
        <li>
          <ChildB {...this.state.stateB}/>
        </li>
        </ul>
      </div>
    </div>
  );
  }
}
export default App;
```

在 ChildB 中，使用 useMemo 来加持 text 和 count 各自的渲染逻辑。改造后的 ChildB 代码如下所示：

```jsx
import React,{ useMemo } from "react";
export default function ChildB({text, count}) {
  console.log("ChildB 的render 逻辑执行了");
  // text 文本的渲染逻辑
  const renderText = (text)=> {
    console.log('renderText 执行了')
    return <p>
    子组件B的文本内容：
      {text}
  </p>
  }
  // count 数字的渲染逻辑
  const renderCount = (count) => {
    console.log('renderCount 执行了')
    return <p>
      子组件B的数字内容：
        {count}
    </p>
  }
  
  // 使用 useMemo 加持两段渲染逻辑
  const textContent = useMemo(()=>renderText(text),[text])
  const countContent = useMemo(()=>renderCount(count),[count])
  return (
    <div className="childB">
      {textContent}
      {countContent}
    </div>
  );
}
```

渲染 App 组件，我们可以看到初次渲染时，renderText 和 renderCount 都执行了，控制台输出如下图所示：

![Drawing 6.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsCgqCHl_ga_SAeZvVAACbMQxPKsc444.png)

点击右边按钮，对 count 进行修改，修改后的界面会发生如下的变化：

![Drawing 7.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsCgpVE1_ga_yAZ5u-AADTkxhPMO8352.png)

可以看出，由于 count 发生了变化，因此 useMemo 针对 renderCount 的逻辑进行了重计算。而 text 没有发生变化，因此 renderText 的逻辑压根没有执行。

使用 useMemo，我们可以对函数组件的执行逻辑进行更加细粒度的管控（尤其是定向规避掉一些高开销的计算），同时也弥补了 React.memo 无法感知函数内部状态的遗憾，这对我们整体的性能提升是大有裨益的。

### 5.React17特性

> React v17 的发布非比寻常，因为它没有增加任何面向开发者的新特性。但是，**这个版本会使得 React 自身的升级变得更加容易**。
> 值得特别说明的是，React v17 作为后续版本的“基石”，它让不同版本的 React 相互嵌套变得更加容易。
> —— React 官方

React 17 中没有新特性，这是由它的定位决定的。React 17 的定位是**后续 18、19 等更新版本的“基石”**，它是一个“承上启下”的版本，用官方的说法来说，“**React v17 开启了 React 渐进式升级的新篇章”**。

所谓“渐进式升级”，是相对于“一次性升级”来说的。日后我们需要将项目从 React 17 迁移至 18、19 等更新版本时，不需要一口气把整个应用升级到新版本，而是可以部分升级，比如说我们完全可以在 React 18 中安全地引入 React 17 版本的某个组件。而在 React 17 之前，这样做将会伴随着不可用的风险，彼时我们但凡要升级 React 版本，就必须一次性将整个应用迁移至目标版本。

“渐进式升级”意味着更大的选择余地，它将在未来为大量的 React 老版本项目留出喘息的空间，确保开发者们不必为了兼容多版本而徒增烦恼。

没有新特性，不代表没有变化，更不代表没有东西可以学了。事实上，React 17 中仍然有不少值得我们关注的用户侧改变，个人认为最重要的是以下三点：

- 新的 JSX 转换逻辑
- 事件系统重构
- Lane 模型的引入

除此之外，React 17 中还有一些细节层面的变化，比如调整了 useEffect 钩子中清理副作用的时机，强化了组件返回 undefined 的错误校验等

### 6.React单向数据流

单向数据流，指的就是当前组件的 state 以 props 的形式流动时，只能流向组件树中比自己层级更低的组件。 比如在父-子组件这种嵌套关系中，只能由父组件传 props 给子组件，而不能反过来。

 React 数据流管理方案：

- 使用基于 props 的单向数据流串联父子、兄弟组件；
- 使用第三方数据流Redux
- 使用 Context API 维护全局状态
- 利用“发布-订阅”模式驱动 React 数据在任意组件间流动。

#### 组件间通信方式

![image.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsHyk8m7p5xJhfZto.webp)

#### props的几种模式

##### props chidren模式

```jsx
<Container>
    <Children>
</Container>
  
  
function Container(props){
 	return props.children
}  
```

作用：

- 可以根据需要控制 Chidren 是否渲染。
- Container 可以用 React.cloneElement 强化 props (混入新的 props )，或者修改 Chidren 的子元素。

##### render props模式

```jsx
<Container>
   { (ContainerProps)=> <Children {...ContainerProps}  /> }
</Container>


function Container(props) {
   const ContainerProps = {
      name: 'xiaoming',
      mes:'hello'
   }
   return props.children(ContainerProps)
}
复制代码
```

作用：

- 根据需要控制 Chidren 渲染与否。
- 可以将需要传给 Children 的 props 直接通过函数参数的方式传递给执行函数 children 。

##### 混合模式

```jsx
<Container>
    <Children />
    { (ContainerProps)=> <Children {...ContainerProps} name={'haha'}  />  }
</Container>
复制代码
```

这种情况需要先遍历 children ，判断 children 元素类型：

- 针对 element 节点，通过 cloneElement 混入 props ；
- 针对函数，直接传递参数，执行函数。

```jsx
const Children = (props)=> (<div>
    <div>hello, my name is {  props.name } </div>
    <div> { props.mes } </div>
</div>)

function  Container(props) {
    const ContainerProps = {
        name: 'xiaoming',
        mes:'hello'
    }
     return props.children.map(item=>{
        if(React.isValidElement(item)){ // 判断是 react elment  混入 props
            return React.cloneElement(item,{ ...ContainerProps },item.props.children)
        }else if(typeof item === 'function'){
            return item(ContainerProps)
        }else return null
     })
}

const Index = ()=>{
    return <Container>
        <Children />
        { (ContainerProps)=> <Children {...ContainerProps} name={'haha'}  />  }
    </Container>
}
```

#### Redux

在 Redux 的整个工作过程中，数据流是严格单向的。

如果你想对数据进行修改，只有一种途径：派发 action。action 会被 reducer 读取，进而根据 action 内容的不同对数据进行修改、生成新的 state（状态），这个新的 state 会更新到 store 对象里，进而驱动视图层面做出对应的改变。

对于组件来说，任何组件都可以通过约定的方式从 store 读取到全局的状态，任何组件也都可以通过合理地派发 action 来修改全局的状态。Redux 通过提供一个统一的状态容器，使得数据能够自由而有序地在任意组件之间穿梭。

![image.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsAU3YtWJ8fHc4DsT.webp)

1.使用 createStore 来完成 store 对象的创建

```jsx
// 引入 redux
import { createStore } from 'redux'
// 创建 store
const store = createStore(
    reducer,
    initial_state,
    applyMiddleware(middleware1, middleware2, ...)
);
```

2.reducer 的作用是将新的 state 返回给 store

```jsx
const reducer = (state, action) => {
    // 此处是各种样的 state处理逻辑
    return new_state
}
```

3.action 的作用是通知 reducer “让改变发生”

```jsx
const action = {
  type: "ADD_ITEM",
  payload: '<li>text</li>'
}
```

4.派发 action，靠的是 dispatch

```jsx
import { createStore } from 'redux'
// 创建 reducer
const reducer = (state, action) => {
    // 此处是各种样的 state处理逻辑
    return new_state
}
// 基于 reducer 创建 state
const store = createStore(reducer)
// 创建一个 action，这个 action 用 “ADD_ITEM” 来标识 
const action = {
  type: "ADD_ITEM",
  payload: '<li>text</li>'
}

// 订阅
store.subscribe(() => console.log(store.getState()))

// 使用 dispatch 派发 action，action 会进入到 reducer 里触发对应的更新
store.dispatch(action)
```

#### Context

Context 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。

![image.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgslYZIyvcsm3EPxdD.webp)

基本用法：

```javascript
const ThemeContext = React.createContext("light") //
const ThemeProvider = ThemeContext.Provider  //提供者
const ThemeConsumer = ThemeContext.Consumer // 订阅消费者
```

Provider：

```javascript
const ThemeProvider = ThemeContext.Provider  //提供者
import ConsumerComponent form './ConsumerComponent'


function ProviderComponent(){
    const [ theme , setTheme ] = React.useState({ theme: "light" })
    return <div>
        <ThemeProvider value={ theme } > 
           <ConsumerComponent />
        </ThemeProvider>
    </div>
}

export default ProviderComponent
```

provider 作用有两个：

- value 属性传递 context，供给 Consumer 使用。
- value 属性改变，ThemeProvider 会让消费 Provider value 的组件重新渲染。

Consumer：

类组件：

```javascript
// 类组件 - contextType 方式
class ConsumerComponent extends React.Component{
   render(){
       const { theme } = this.context
       return <div style={{ color: theme } }>消费者</div> 
   }
}

ConsumerComponent.contextType = ThemeContext

export default ConsumerComponent
```

函数组件：

（1）使用useContext：

```javascript
export default function ConsumerComponent(){
    const  contextValue = React.useContext(ThemeContext)
    const { theme } = contextValue
    return <div style={{ color: theme } } >消费者</div> 
}
```

（2）使用订阅者：

```javascript
const ThemeConsumer = ThemeContext.Consumer // 订阅消费者

export default const ConsumerComponent = () => {
  return (
    <ThemeConsumer>
       { (contextValue)=> // todo }
    </ThemeConsumer>
	) 
}
```

#### 发布订阅

事件的监听（订阅）和事件的触发（发布）

- on()：负责注册事件的监听器，指定事件触发时的回调函数。
- emit()：负责触发事件，可以通过传参使其在触发的时候携带数据 。

##### 映射

事件和监听函数的对应关系“映射”，处理“映射”我们大部分情况下都是用对象来做的。所以说在全局我们需要设置一个对象，来存储事件和监听函数之间的关系：

```javascript
 constructor() {
   // eventMap 用来存储事件和监听函数之间的关系
   this.eventMap = {};
 }
```

##### 订阅

把事件和对应的监听函数写入到 eventMap 里面去：

```javascript
// type 这里就代表事件的名称
on(type, handler) {
  // hanlder 必须是一个函数，如果不是直接报错
  if(!(handler instanceof Function)) {
    throw new Error("需要传一个函数")
  }
  // 判断 type 事件对应的队列是否存在
  if(!this.eventMap[type]) {
   // 若不存在，新建该队列
    this.eventMap[type] = []
  }
  // 若存在，直接往队列里推入 handler
  this.eventMap[type].push(handler)
}

```

##### 发布

发布操作就是一个“读”操作。

```javascript
// 别忘了我们前面说过触发时是可以携带数据的，params 就是数据的载体
emit(type, params) {
  // 假设该事件是有订阅的（对应的事件队列存在）
  if(this.eventMap[type]) {
    // 将事件队列里的 handler 依次执行出队
    this.eventMap[type].forEach((handler, index)=> {
      // 注意别忘了读取 params
      handler(params)
    })
  }
}

```

##### 关闭

关闭就是一个出队列的操作。

```javascript
off(type, handler) {
  if(this.eventMap[type]) {
    this.eventMap[type].splice(this.eventMap[type].indexOf(handler)>>>0,1)
  }
}

```

##### 测试

完整代码

```javascript
class myEventEmitter {
    constructor() {
        this.eventMap = {};
    }

    on(type, handler) {
        if (!handler instanceof Function) {
            throw new Error("请传一个函数");
        }
        if (!this.eventMap[type]) {
            this.eventMap[type] = []
        }
        this.eventMap[type].push(handler)
    }

    emit(type, params) {
        if (this.eventMap[type]) {
            this.eventMap[type].forEach((handler) => {
                handler(params);
            })
        }
    }

    off(type, handler) {
        if (this.eventMap[type]) {
            // 位运算 负数返回无限大的数，否则返回本身
            this.eventMap[type].splice(this.eventMap[type].indexOf(handler) >>> 0, 1);
        }
    }
}

const myEvent = new myEventEmitter();
// 编写一个简单的 handler
const testHandler = function (params) {
    console.log(`test事件被触发了，testHandler 接收到的入参是${params}`);
};
// 监听 test 事件
myEvent.on("test", testHandler);
// 在触发 test 事件的同时，传入希望 testHandler 感知的参数
myEvent.emit("test", "123");

// myEvent.off("test", testHandler);

console.log(`object`, myEvent.eventMap)

```

![image.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsnFzy1pr5CatVZ3h.webp)

##### 在React中应用

```javascript
// index.jsx
import React, { Component } from 'react'
import A from './A'
import B from './B'
import event from './event.js'

class index extends Component {
    render() {
        React.$myEvent = new event()
        return (
            <div>
                <A></A>
                <B></B>
            </div>
        )
    }
}

export default index


// event.js
class myEventEmitter {
    constructor() {
        this.eventMap = {};
    }

    on(type, handler) {
        if (!handler instanceof Function) {
            throw new Error("请传一个函数");
        }
        if (!this.eventMap[type]) {
            this.eventMap[type] = []
        }
        this.eventMap[type].push(handler)
    }

    emit(type, params) {
        if (this.eventMap[type]) {
            this.eventMap[type].forEach((handler) => {
                handler(params);
            })
        }
    }

    off(type, handler) {
        if (this.eventMap[type]) {
            this.eventMap[type].splice(this.eventMap[type].indexOf(handler) >>> 0, 1);
        }
    }
}
export default myEventEmitter


// A
import React from "react";

class A extends React.Component {
  state = {
    newParams: "",
  };
  handler = (params) => {
    this.setState({
      newParams: params,
    });
  };
  bindHandler = () => {
    React.$myEvent.on("someEvent", this.handler);
  };
  render() {
    return (
      <div>
        <button onClick={this.bindHandler}>点我监听A的动作</button>
        <div>A传入的内容是[{this.state.newParams}]</div>
      </div>
    );
  }
}

export default A;

// B
import React from "react";

class B extends React.Component {
  state = {
    infoToB: "哈哈哈哈我来自A",
  };
  reportToB = () => {
    React.$myEvent.emit("someEvent", this.state.infoToB);
  };
  render() {
    return <button onClick={this.reportToB}>点我把state传递给B</button>;
  }
}

export default B;

```

![image.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsvImzEbAJyiRTwoe.webp)



## Demo实现

### 1.react实现一个全局的 dialog

```jsx
import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './dialog.css';
let defaultState = {
  alertStatus:false,
  alertTip:"提示",
  closeDialog:function(){},
  childs:''
}
class Dialog extends Component{
  state = {
    ...defaultState
  };
  // css动画组件设置为目标组件
  FirstChild = props => {
    const childrenArray = React.Children.toArray(props.children);
    return childrenArray[0] || null;
  }
  //打开弹窗
  open =(options)=>{
    options = options || {};
    options.alertStatus = true;
    var props = options.props || {};
    var childs = this.renderChildren(props,options.childrens) || '';
    console.log(childs);
    this.setState({
      ...defaultState,
      ...options,
      childs
    })
  }
  //关闭弹窗
  close(){
    this.state.closeDialog();
    this.setState({
      ...defaultState
    })
  }
  renderChildren(props,childrens) {
    //遍历所有子组件
    var childs = [];
    childrens = childrens || [];
    var ps = {
        ...props,  //给子组件绑定props
        _close:this.close  //给子组件也绑定一个关闭弹窗的事件    
       };
    childrens.forEach((currentItem,index) => {
        childs.push(React.createElement(
            currentItem,
            {
                ...ps,
                key:index
            }
        ));
    })
    return childs;
  }
  shouldComponentUpdate(nextProps, nextState){
    return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
  }
   
  render(){
    return (
      <ReactCSSTransitionGroup
        component={this.FirstChild}
        transitionName='hide'
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}>
        <div className="dialog-con" style={this.state.alertStatus? {display:'block'}:{display:'none'}}>
            {this.state.childs}
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}
let div = document.createElement('div');
let props = {
   
};
document.body.appendChild(div);
let Box = ReactD
```

子类：

```jsx
//子类jsx
import React, { Component } from 'react';
class Child extends Component {
    constructor(props){
        super(props);
        this.state = {date: new Date()};
  }
  showValue=()=>{
    this.props.showValue && this.props.showValue()
  }
  render() {
    return (
      <div className="Child">
        <div className="content">
           Child
           <button onClick={this.showValue}>调用父的方法</button>
        </div>
      </div>
    );
  }
}
export default Child;
```

css：

```css
.dialog-con{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
}
```

### 2.hooks实现一个倒计时

```jsx
import { useEffect, useState } from 'react';

// 自定义hook
function useCountDown(initN: number) {
  // 定义状态
  const [n, setN] = useState(initN)  
  const changeCount = (n: number) => {
    const timer = setTimeout(() => {
      const current = --n; // n-- 值还是10未变 --n值为9改变
      console.log('current', current)
      setN(current)
    }, 1000);
    return timer;
  }

  // 监听状态变化
  useEffect(() => {
    const timer = changeCount(n);
    console.log('timer :>> ', timer);
    if (n === 0) {
      setN(0);
      clearTimeout(timer);
    }

    return () => {
      clearTimeout(timer);
    }
  }, [n])

  // 返回状态
  return {n};
}
// 封装成组件
function Timer({ n }: { n: number }) {
  const {n: time } = useCountDown(n)

  return <span>{time === 0 ? '开始' : `剩余${time}秒`}</span>
}



export default function Count() {
  return (
    <div className={styles.container}>
      <h2>倒计时</h2>
      <Timer n={10} />
    </div>
  );
}
```



```js
import React ,{useState,useEffect,useRef} from 'react'
import { ReactDOM } from 'react-dom'
export default function App(){
	const [cansend,setCansend]=useState(true)
	const [timer,setTimer] =useState(0)
	const time=useRef(null)

	const send=()=>{
		setTimer(60)
		setCansend(false)
		time.current=setTimeout(() => {
			setTimer((timer)=>timer-1)
		}, 1000);
	}
	useEffect(()=>{
		console.log(timer);
		if(timer==0){
			setCansend(true)
			clearInterval(time.current)
		}
	},[timer])
	return (
		<div>
			<input>  </input>
			<button disabled={!cansend} onClick={send}>{cansend ? '发送验证码' : timer + '秒后重发'}</button>
		</div>
	)
}
ReactDOM.render(<App />, document.getElementById('root'))
```



### 3.hooks实现防抖节流

utils.js

```js
import {useEffect,useCallback,useRef } from 'react'
// 防抖
export function useDebounce(fn, delay, dep = []) {
  const { current } = useRef({ fn, timer: null });
  useEffect(function () {
    current.fn = fn;
  }, [fn]);
  return useCallback(function f(...args) {
    if (current.timer) {
      clearTimeout(current.timer);
    }
    current.timer = setTimeout(() => {
      current.fn.call(this, ...args);
    }, delay);
  }, dep)
}

// 节流
export function useThrottle(fn, delay, dep = []) {
  const { current } = useRef({ fn, timer: null })
  useEffect(
    function () {
      current.fn = fn
    },
    [fn]
  )
  return useCallback(function f(...args) {
    if (!current.timer) {
      current.timer = setTimeout(() => {
        delete current.timer
      }, delay)
      current.fn.call(this, ...args)
    }
  }, dep)
}
```

导入

```js
import { useThrottle,useDebounce } from "../utils";
const handlerSearch = useThrottle(() => {console.log('小太阳')},1000)
const handlerSearch = useDebounce(() => {console.log('小太阳')},1000)
```





```jsx
useThrottle

import { useCallback, useRef } from "react";

export default function useThrottle(fn, delay) {
  const timer = useRef(-1);
  const throttle = useCallback(() => {
    if (timer.current > -1) {
      return;
    }
    timer.current = setTimeout(() => {
      fn();
      timer.current = -1;
      clearTimeout(timer.current);
    }, delay);
  }, [fn, delay]);
  return throttle;
}
useDebounce

import { useEffect, useState } from "react";

export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}
```



