## WebComponents的概念

Web Components 是一组技术，旨在使开发者能够创建可重用、独立于框架的自定义组件。它包括以下四个主要技术： Custom Elements（自定义元素）：

1. Custom Elements 允许开发者定义自己的 HTML 元素，例如 。 通过继承 HTMLElement 类，可以定义自定义元素的行为和生命周期方法。 可以在 HTML 中使用这些自定义元素，并通过 JavaScript 进行操作。 Shadow DOM（影子 DOM）：
2. Shadow DOM 提供了一种将元素的样式和行为封装在隔离的 DOM 树中的机制。 可以在自定义元素中使用 Shadow DOM，以避免样式和脚本的全局污染。 影子 DOM 的内容对外部文档是不可见的。
3. HTML Templates（HTML 模板）： HTML 模板是一种在文档中定义的不会被渲染的 HTML 片段。 可以在模板中定义组件的结构，然后通过 JavaScript 克隆和激活模板。 模板的使用使得组件的结构可以在不被渲染的情况下进行定义和操纵。

## Custom Elements

customElementRegistry.define(); 参数说明：

- name：元素的名称。必须以小写字母开头，包含一个连字符，并符合规范中有效名称的定义中列出的一些其他规则。
- constructor：自定义元素的构造函数。
- options：仅对于自定义内置元素，这是一个包含单个属性 extends 的对象，该属性是一个字符串，命名了要扩展的内置元素。

有两种类型的自定义元素：

- 定义内置元素（Customized built-in element）继承自标准的 HTML 元素，例如 HTMLImageElement 或 HTMLParagraphElement。它们的实现定义了标准元素的行为。
- 独立自定义元素（Autonomous custom element）继承自 HTML 元素基类 HTMLElement。你必须从头开始实现它们的行为。

### 定义内置元素：

```html
html
复制代码<button is="hello-button">Click me</button>
js
复制代码// 这个按钮在被点击的时候说 "hello"
class HelloButton extends HTMLButtonElement {
    constructor() {
        super();
        this.addEventListener('click', () => alert("Hello!"));
    }
}

customElements.define('hello-button', HelloButton, {extends: 'button'});
```

自定义元素生命周期回调包括：

- connectedCallback()：每当元素添加到文档中时调用。规范建议开发人员尽可能在此回调中实现自定义元素的设定，而不是在构造函数中实现。
- disconnectedCallback()：每当元素从文档中移除时调用。
- adoptedCallback()：每当元素被移动到新文档中时调用。
- attributeChangedCallback()：在属性更改、添加、移除或替换时调用。

### 创建自定义元素

```html
html
复制代码<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Element Example</title>
</head>
<body>

<my-custom-element></my-custom-element>

<script>
    class MyCustomElement extends HTMLElement {
        constructor() {
            super();
            console.log('Custom element created');
        }

        connectedCallback() {
            console.log('Custom element connected to the document');
            this.render();
        }

        disconnectedCallback() {
            console.log('Custom element disconnected from the document');
        }
        // name 发生变化的属性
        // oldValue 旧值
        // newValue 新值
        attributeChangedCallback(name, oldValue, newValue) {
            console.log(`属性 ${name} 已由 ${oldValue} 变更为 ${newValue}。`);
        }

        render() {
            this.innerHTML = `
                <p>Hello, World!</p>
            `
        }
    }

    customElements.define('my-custom-element', MyCustomElement);
</script>

</body>
</html>
```

### Shadow DOM

Shadow DOM（影子 DOM）是 Web Components 技术的一部分，用于将元素的样式和行为封装在一个隔离的 DOM 树中。这种封装使得元素的样式和脚本不会影响到文档的其他部分，从而避免了全局作用域的污染和样式冲突。

- **影子宿主（Shadow host）**: 影子 DOM 附加到的常规 DOM 节点。
- **影子树（Shadow tree）**: 影子 DOM 内部的 DOM 树。
- **影子边界（Shadow boundary）**: 影子 DOM 终止，常规 DOM 开始的地方。
- **影子根（Shadow root）**: 影子树的根节点。

一个 DOM 元素可以有以下两类 DOM 子树：

1. Light tree（光明树） —— 一个常规 DOM 子树，由 HTML 子元素组成。我们在之前章节看到的所有子树都是「光明的」。
2. Shadow tree（影子树） —— 一个隐藏的 DOM 子树，不在 HTML 中反映，无法被察觉。

创建 Shadow DOM 需要调用宿主上的 attachShadow()，传入 { mode: "open" }，这时页面中的 JavaScript 可以通过影子宿主的 shadowRoot 属性访问影子 DOM 的内部。

```html
html
复制代码<!DOCTYPE html>

<body>
<style>
    /* 文档样式对 #elem 内的 shadow tree 无作用 (1) */
    p {
        color: red;
    }
</style>

<div id="elem"></div>

<script>
    const el = document.querySelector("#elem"); // 宿主

    el.attachShadow({mode: "open"}); // 返回 shadowRoot
    // shadow tree 有自己的样式 (2)
    el.shadowRoot.innerHTML = `
        <style> p { font-weight: bold; } </style>
        <p>Hello, John!</p>
    `;

    // <p> 只对 shadow tree 里面的查询可见 (3)
    alert(document.querySelectorAll("p").length); // 0
    alert(el.shadowRoot.querySelectorAll("p").length); // 1
</script>
</body>
```

### 在影子 DOM 内应用样式

有两种不同的方法来在影子 DOM 树中应用样式：

- 编程式，通过构建一个 CSSStyleSheet 对象并将其附加到影子根。
- 声明式，通过在一个 `<template>` 元素的声明中添加一个 `<style>` 元素。

编程式样式步骤：

1. 创建一个空的 CSSStyleSheet 对象
2. 使用 CSSStyleSheet.replace() 或 CSSStyleSheet.replaceSync() 设置其内容
3. 通过将其赋给 ShadowRoot.adoptedStyleSheets 来添加到影子根

在 CSSStyleSheet 中定义的规则将局限在影子 DOM 树的内部，以及我们将其分配到的任何其它 DOM 树。当你当样式内容较多，或者需要与其他当自定义组件共享样式当时候，你可以考虑使用这种方。

```js
js
复制代码// ... 省略部分代码 el
const sheet = new CSSStyleSheet();
sheet.replaceSync("p { color: red; border: 2px dotted black;}");
el.shadowRoot.adoptedStyleSheets = [sheet];
```

声明式样式步骤：

1. 将一个 `<style>` 元素包含在用于定义 web 组件的 `<template>` 元素中
2. 将 `<template>` 中的内容插入到 shadowRoot

```html
html
复制代码<template id="my-element">
    <style>
        span {
            color: red;
            border: 2px dotted black;
        }
    </style>
    <span>I'm in the shadow DOM</span>
</template>

<script>
    // 省略部分代码 el
    // 克隆模板内容
    const template = document.querySelector("#my-element");
    const clone = document.importNode(template.content, true);
    el.shadowRoot.appendChild(clone)
</script>
```

另外还有使用 css 选择器的方式来设置样式，具体请参考 [css域](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FCSS%2FCSS_scoping)。

## template 与 slot

### template 标签

内建的 `<template>` 元素用来存储 HTML 模板。浏览器将忽略它的内容，仅检查语法的有效性，但是我们可以在 JavaScript 中访问和使用它来创建其他元素。

模板(template)的 content 属性可看作DocumentFragment —— 一种特殊的 DOM 节点。我们可以将其视为普通的DOM节点，除了它有一个特殊属性：将其插入某个位置时，会被插入的则是其子节点。

template 的使用方式上面的案例中已经展示过了，接下来我们要使用 slot （插槽）增加灵活度。

### slot 插槽

- 具名插槽： 在 shadow DOM 中， 定义了一个“插入点”，一个带有 slot="X" 的元素被渲染的地方。然后浏览器执行”组合“：它从 light DOM 中获取元素并且渲染到 shadow DOM 中的对应插槽中。最后，正是我们想要的 —— 一个能被填充数据的通用组件。
- 默认插槽： shadow DOM 中第一个没有名字的  是一个默认插槽。它从 light DOM 中获取没有放置在其他位置的所有节点。
- 插槽后备内容： 如果我们在一个  内部放点什么，它将成为后备内容。如果 light DOM 中没有相应填充物的话浏览器就展示它。

```html
<!doctype html>
<body>
<script>
    customElements.define('user-card', class extends HTMLElement {
        connectedCallback() {
            this.attachShadow({mode: 'open'});
            this.shadowRoot.innerHTML = `
      <div>Name:
        <!-- 具名插槽 -->
        <slot name="username">
            <!-- 插槽后备内容 -->
            Anonymous
        </slot>
      </div>
      <div>Birthday:
        <slot name="birthday"></slot>
      </div>
      <!-- 默认插槽 -->
      <slot></slot>
    `;
        }
    });
</script>

<user-card>
    <div>default slot</div>
    <!-- 注释下面一行的插槽内容，查看插槽的后备内容 -->
    <span slot="username">John Smith</span>
    
    <span slot="birthday">01.01.2001</span>
</user-card>
</body>
```

### 更新插槽

**如果 添加/删除了插槽元素，浏览器将监视插槽并更新渲染。**如果组件想知道插槽的更改，那么可以用 **slotchange** 事件。

```html
<!doctype html>
<body>
<custom-menu id="menu">
    <!-- 在初始化时:slotchange: title 立即触发, 因为来自 light DOM 的 slot="title" 进入了相应的插槽。 -->
    <span slot="title">Candy menu</span>
</custom-menu>

<script>
    customElements.define('custom-menu', class extends HTMLElement {
        connectedCallback() {
            this.attachShadow({mode: 'open'});
            this.shadowRoot.innerHTML = `<div class="menu">
      <slot name="title"></slot>
      <ul><slot name="item"></slot></ul>
    </div>`;

            // shadowRoot 不能有事件，所以使用 first child
            // 如果组件想知道插槽的更改，那么可以用 slotchange 事件
            this.shadowRoot.firstElementChild.addEventListener('slotchange',
                    e => alert("slotchange: " + e.target.name)
            );
        }
    });

    const menu = document.querySelector('custom-menu');

    setTimeout(() => {
        // 1 秒后:slotchange: item 触发, 当一个新的 <li slot="item"> 被添加。
        menu.insertAdjacentHTML('beforeEnd', '<li slot="item">Lollipop</li>')
    }, 1000);

    setTimeout(() => {
        menu.querySelector('[slot="tissssssssssssssssssstle"]').innerHTML = "New menu";
    }, 2000);
</script>
</body>
```

### 插槽APIs

如果 shadow 树有 {mode: 'open'} ，那么我们可以找出哪个元素被放进一个插槽，反之亦然，哪个插槽分配了给这个元素:

- node.assignedSlot: 属性是在使用 Shadow DOM 的情况下，用于获取包含当前节点的 Shadow DOM 插槽（Slot）的属性。在 Shadow DOM 中，插槽是一种机制，用于将子元素分配到 Shadow DOM 中的特定位置。每个插槽都有一个对应的 HTMLSlotElement 对象。 当你有多个插槽时，assignedSlot 属性可以帮助你确定当前节点属于哪个插槽。
- slot.assignedNodes({flatten: true/false}):  返回分配给插槽的 DOM 节点。默认情况下，flatten 选项为 false。如果显式地设置为 true，则它将更深入地查看扁平化 DOM ，如果嵌套了组件，则返回嵌套的插槽，如果未分配节点，则返回备用内容。
- slot.assignedElements({flatten: true/false}): – 返回分配给插槽的 DOM 元素。

```html
<!doctype html>
<body>
<custom-menu id="menu">
    <span slot="title">Candy menu</span>
    <li slot="item">Lollipop</li>
    <li slot="item">Fruit Toast</li>
</custom-menu>

<script>
    customElements.define('custom-menu', class extends HTMLElement {
        items = []

        connectedCallback() {
            // 需要shadow 树有 {mode: 'open'}

            /*
              node.assignedSlot 属性是在使用 Shadow DOM 的情况下，用于获取包含当前节点的 Shadow DOM 插槽（Slot）的属性。
              这个属性返回一个表示节点所属插槽的 HTMLSlotElement 对象。
              在 Shadow DOM 中，插槽是一种机制，用于将子元素分配到 Shadow DOM 中的特定位置。
              每个插槽都有一个对应的 HTMLSlotElement 对象。
              当你有多个插槽时，assignedSlot 属性可以帮助你确定当前节点属于哪个插槽。
            */

            /*
                slot.assignedNodes({flatten: true/false}) – 返回分配给插槽的 DOM 节点。
                默认情况下，flatten 选项为 false。如果显式地设置为 true，则它将更深入地查看扁平化 DOM ，如果嵌套了组件，则返回嵌套的插槽，
                如果未分配节点，则返回备用内容。
            */
            this.attachShadow({mode: 'open'});
            this.shadowRoot.innerHTML = `<div class="menu">
                <slot name="title"></slot>
                <ul><slot name="item"></slot></ul>
            </div>`;

            // 插槽能被添加/删除/代替
            this.shadowRoot.firstElementChild.addEventListener('slotchange', e => {

                let slot = e.target;

                const assignedNodes = slot.assignedNodes();
                assignedNodes.forEach(node => {
                    console.log(node.textContent); // dom 的 文本内容
                    console.log('Assigned to slot:', node.assignedSlot); // HTMLSlotElement 对象
                });

                if (slot.name == 'item') {
                    // slot.assignedElements({flatten: true/false}) – 返回分配给插槽的 DOM 元素
                    this.items = slot.assignedElements().map(elem => elem.textContent);
                    alert("Items: " + this.items);
                }
            });
        }
    });

    const menu = document.getElementById('menu');

    // items 在 1 秒后更新
    setTimeout(() => {
        menu.insertAdjacentHTML('beforeEnd', '<li slot="item">Cup Cake</li>')

    }, 1000);
</script>
</body>
```

`micro-app` 是京东零售推出的一款微前端框架，它基于类 WebComponent 进行渲染，从组件化的思维实现微前端，旨在降低上手难度、提升工作效率。它是目前接入微前端成本最低的框架，并且提供了JS沙箱、样式隔离、元素隔离、预加载、资源地址补全、插件系统、数据通信等一系列完善的功能。

## 组件微前端

微前端的核心在于资源加载与渲染，传统的 iframe 的渲染方式就是一个典型，只要能够实现一种元素隔离的功能并且路由符合要求，子应用理论上不需要修改代码就可以嵌入另外一个页面渲染，`micro-app` 探索不一样的实现思路。

使用`类WebComponent` + `HTML Entry` 的思路。 

![](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/image-20240102164333138-20240102164512794.png)

### HTML Entry

HTML Entry 是指设置 html 作为资源入口，通过加载远程 html，解析其 DOM 结构从而获取 js、css等静态资源来实现微前端的渲染，这也是 qiankun 目前采用的渲染方案。

#### Web Components

Web Components 是一组 Web 平台 API，建立在 Web 标准之上，它允许开发人员创建新的自定义、可重用、被封装的 HTML 标记在网页和 Web 应用程序中使用。 HTML 标记基于 Web Components 标准构建，可跨现代浏览器工作，并可与任何支持 HTML 的 JavaScript 库或框架（Vue、React、Angular... ）一起使用。

Web Components 不是一门单一的技术，而是四门技术的组合，这四门技术分别是：

- HTML Imports（被废弃，被 ES Modules 取而代之）
- Custom Elements
- Shadow DOM
- HTML templates 

![image-20240102164141848](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/image-20240102164141848.png)

它有两个核心组成部分：CustomElement 和 ShadowDom。而`类WebComponent`就是使用 CustomElement 结合 ShadowDom 实现 Web Components 基本一致的功能。这里简单了解一下这两个核心。

#### CustomElement

从名字来看，就知道 `Custom Elements` 是用来创建自定义 HTML 标签。`Cumtom elements` 这个概念对于写过 Vue、React、Angular 的开发者而言应该非常的熟悉，在框架中通过组件的形式，使用自己定义的标签。就拿 Vue 来举例：

```js
// Custom.vue
<template>
  <p>大家好，我是拜小白，我是一个自定义标签。</p>
</template>
js
复制代码<template>
  <div>
    <x-custom></x-custom>
    <p>你好，{{ name }}，我知道你是一个自定义标签!</p>
  </div>
</template>

<script>
import Custom from "./Custom";
module.exports = {
  data: function () {
    return {
      name: "拜小白",
    };
  },
  components: {
    "x-custom": Custom,
  },
};
</script>
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/167fe9e38c5b41e6b980c727b4439faf~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1848&h=536&s=88290&e=png&b=181818)

#### Shadow DOM

Shadow DOM 其实对于大家来说既陌生又熟悉，我相信你一定见过，在某些 HTML 元素下，有一段  #shadow-root  代码块，这里的 #shadow-root 所包含的内容其实就是所谓的 shadow-dom 。 例如：`<video>` 标签

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/713b182e151249f39047430b04b4fffa~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=956&h=308&s=143230&e=png&b=fcfbfb)

> 注意：浏览器默认是看不到 #shadow-root，需要自己将 #shadow-root 设置为可见。

```html
<!DOCTYPE html>
<html>
  <head> 
 		 <meta charset="utf-8"> 
  </head>
  <body>
  
  <video width="320" height="240" controls autoplay>
    <source src="movie.ogg" type="video/ogg">
    <source src="movie.mp4" type="video/mp4">
    <source src="movie.webm" type="video/webm">
    <object data="movie.mp4" width="320" height="240">
      <embed width="320" height="240" src="movie.swf">
    </object>
  </video>
  </body>
</html>
```

当实际在浏览器进行查看时，你就会发现，Dom 结构并非代码看到的这么简单。 ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c68fa9c9288e418091b2c2a2ae33b274~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1078&h=282&s=93944&e=png&b=fffcfc) 这些操作的关键在于，Shadow DOM，它可以将一个隐藏的、独立的 DOM 附加到一个元素上。Shadow DOM 允许将隐藏的 DOM 树附加到常规的 DOM 树中——它以 shadow root 节点为起始根节点，在这个根节点的下方，可以是任意元素，和普通的 DOM 元素一样。

ShadowDom 用于创建阴影 DOM，阴影 DOM 具有天然的样式隔离和元素隔离属性。理论上是实现微前端最优的方案。但是 ShadowDom 的兼容性非常不好，一些前端框架在 ShadowDom 环境下无法正常运行，尤其是 react 框架。

由于 ShadowDom 存在的问题，所以 `micro-app` 采用自定义的样式隔离和元素隔离实现 ShadowDom 类似的功能，然后将微前端应用封装在一个 CustomElement 中，从而模拟实现了一个 类 WebComponent组件，它的使用方式和兼容性与 WebComponent 一致，同时也避开了ShadowDom 的问题。

并且由于自定义 ShadowDom 的隔离特性，`Micro App` 不需要像 single-spa 和 qiankun 一样要求子应用修改渲染逻辑并暴露出方法，也不需要修改 webpack 配置。

## MicroApp 的核心功能在 CustomElement 基础上进行构建

`micro-app` 的 CustomElement 用于创建自定义标签，并提供了元素的渲染、卸载、属性修改等钩子函数，通过钩子函数获知微应用的渲染时机，并将自定义标签作为容器，微应用的所有元素和样式作用域都无法逃离容器边界，从而形成一个封闭的环境。 

![](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/image-20240102164333138.png)

`micro-app` 通过 CustomElement 的生命周期函数 `connectedCallback` 监听元素被渲染。

> Web Components 有属于自己的生命周期钩子函数，当我们定义一个元素时，它会在元素的不同阶段触发它们。
>
> - connectedCallback：当 custom element  首次被插入文档 DOM 时，被调用。
> - disconnectedCallback：当 custom element 从文档 DOM 中删除时，被调用。
> - adoptedCallback：当 custom element 被移动到新的文档时，被调用。
> - attributeChangedCallback: 当 custom element 增加、删除、修改自身属性时，被调用。

在`micro-app`中，当加载子应用的 html 时，将 html 转换为 dom 结构，这样可以拿到 js 和 css 资源。拦截所有动态创建的 script、link 等标签，提取标签内容。将加载的 js 经过插件系统处理后放入沙箱中运行，对 css 资源进行样式隔离，最后将格式化后的元素放入 `micro-app`中，最终将`micro-app`元素渲染为一个微前端的子应用。在渲染的过程中，会执行开发者绑定的生命周期函数，用于进一步操作。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7938c3f8f19948378acf0502dc0df217~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1437&h=867&s=185649&e=png&b=fffefe)

## MicroApp 的元素隔离

MicroApp 模拟实现了 ShadowDom 的功能，拦截了底层原型链上元素的方法，保证子应用只能对自己内部的元素进行操作，每个子应用都有自己的元素作用域。 ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04cf1484bb2c43d9bcfeea0fd76f9fa4~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1537&h=600&s=120265&e=png&b=c5d7ee) 在生成的的节点中，`micro-app` 就是通过 CustomElement 实现的自定义节点，在这个自定义节点下还包含了两部分`micro-app-head` 和 `micro-app-body`，分别对应 html 中的 head 和 body 元素。 ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/409f8d593f964a568c28354ef208a7c6~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1079&h=880&s=398056&e=png&b=ffffff) head 中包含了动态创建 link、script，body 包含了原 body 元素中的内容。这样做的好处是可以防止子应用的元素泄漏到全局，在进行元素查询、删除等操作时，只需要在micro-app内部进行处理，是实现元素隔离的重要基础。 ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca31e98da5bc4c61903c2b6e8b3b2407~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2593&h=1742&s=196873&e=png&b=ffffff) 可以将 micro-app 理解为一个内嵌的 html 页面，它的结构和功能都和 html 页面类似。













### 小结

`micro-app` 将所有功能都封装到一个类 WebComponent 组件中，从而实现在基座应用中嵌入一行代码即可渲染一个微前端应用。`micro-app`并没有沿袭 single-spa 的思路，而是借鉴了 WebComponent 的思想，通过 CustomElement 结合自定义的 ShadowDom，将微前端封装成一个类 WebComponent 组件，从而实现微前端的组件化渲染。并且由于自定义 ShadowDom 的隔离特性，micro-app 不需要像 single-spa 和 qiankun 一样要求子应用修改渲染逻辑并暴露出方法，也不需要修改 webpack 配置，是目前市面上接入微前端成本最低的方案。

### 参考

- [gitee.com/helibin/mic…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2Fhelibin%2Fmicro-app)
- [mp.weixin.qq.com/s/BvjjCs8qa…](https://link.juejin.cn?target=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FBvjjCs8qaxrl00R-Sr7tSg)
- [www.codebox.com.cn/?id=27903](https://link.juejin.cn?target=http%3A%2F%2Fwww.codebox.com.cn%2F%3Fid%3D27903)
- [zhuanlan.zhihu.com/p/519416291](https://link.juejin.cn?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F519416291)
- [zeroing.jd.com/micro-app/d…](https://link.juejin.cn?target=https%3A%2F%2Fzeroing.jd.com%2Fmicro-app%2Fdemo%2Freact17)

## Lit

Lit 是一个轻量级的 Web 组件库，它的设计目标是提供高性能、小巧灵活的组件构建方案。以下是 Lit 框架的一些主要特性：

1. **轻量级：** Lit 是一个轻量级的框架，其核心库的体积相对较小。这使得它在加载和运行时能够更加迅速，适合于对性能和资源消耗有要求的应用。
2. **模板语法：** Lit 使用模板字符串作为组件的模板语法。模板字符串是一种原生 JavaScript 的语法，提供了更直观和灵活的模板定义方式。Lit 支持 HTML 标签内的表达式和条件渲染，使得模板更加动态和强大。
3. **反应性：** Lit 提供了一种简单而强大的反应性系统，通过使用 `ReactiveMixin` 或 `@property` 装饰器，可以实现组件属性的响应式更新。这意味着当属性值发生变化时，相关的 DOM 部分会自动更新，无需手动操作 DOM。
4. **直接使用标准 DOM：** Lit 直接使用浏览器标准的 DOM API，不依赖虚拟 DOM。这有助于减小库的体积，并在运行时更高效地处理 DOM 更新。
5. **无框架组件：** Lit 提供了一种不依赖框架的组件编写方式，可以方便地嵌入到现有的项目中。同时，Lit 也可以与一些框架集成，如 React、Angular 等。
6. **Web 组件标准：** Lit 遵循 Web 组件标准，可以与其他遵循相同标准的库和框架协同工作。Lit 组件可以被其他支持 Web 组件的环境和框架直接使用。
7. **模块化：** Lit 支持模块化开发，可以使用 ES 模块的语法进行组件的导入和导出。这有助于组件的组织和复用。
8. **支持 TypeScript：** Lit 提供了 TypeScript 的类型定义，可以在 TypeScript 项目中进行开发，并享受类型检查的好处。

Web-Component` 里面的几个槽点

1. 响应式仅有回调，无法自动映射到UI上
2. 没有 state 内部状态，自己维护的状态无法直接监听变化
3. 没有模版语法（可以用 slot 和 template）

明确一点，在学习 `Lit` 的过程中，可以认为没有 state 这个概念（实际上有，理解为私有的 reactive properties），只有名为 `reactive properties` 的成员属性。可以简单的理解成又是 state，又是 props。

那么现在问题转变成了

1. 如何响应reactive properties的变化，并应用到UI上
2. 如何解决模版语法

Lit 用了两个个核心库来解决这个问题，分别是 `lit-element` 和 `lit-html`

### Lit-html

`lit-html` 是 `Lit` 的核心逻辑，可以理解为 `Literal Html` ，他异于JSX创造了另外一种高性能的字符流HTML模版引擎。 Lit选择了直接继承Polymer的LitHTML项目，并将整体框架重命名为 Lit 我们知道 `jsx` 是需要编译的它的底层最终还是 `createElement` ....。而 `lit-html` 就不一样了，它是基于 `tagged template` 的，使得它不用编译就可以在浏览器上运行，并且和 `HTML Template` 结合想怎么玩怎么玩，扩展能力更强。下面我们展开来看。

```
lit-html` 提供了两个核心方法 `render` 和 `html
```

#### lit-html.html

```javascript
html`<p>${content}</p>`
```

这个是es6的原生语法 - [带标签的模板字符串](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FTemplate_literals%23%E5%B8%A6%E6%A0%87%E7%AD%BE%E7%9A%84%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2) （tagged template），并不是什么magic，html 这个函数会接受到如下的参数

```javascript
type taggedFunc = (strings: string[], ...values: any[]) => any;
// 上边的那个段代码接收到的参数就是
// ['<p>', '</p'>], content
```

经过 `lit-html` 的修饰上面这段代码最终会构造一个 `Template Result` 对象，形如

```typescript
declare class TemplateResult {
    readonly strings: TemplateStringsArray;
    readonly values: readonly unknown[];
    readonly type: string; // html or svg
    readonly processor: TemplateProcessor;
    constructor(strings: TemplateStringsArray, values: readonly unknown[], type: string, processor: TemplateProcessor);
    
    getHTML(): string;
    getTemplateElement(): HTMLTemplateElement;
}

const templateResult = {
    strings: ['<p>', '</p>'],
    value: [content]
    type: 'html'
}
```

这里需要注意一下 `getHTML` 和 `getTemplateElement` 方法，这两个方法可以将strings转化成为一个 `<template>` 标记，也就是上面提到的 template

```javascript
const template = (title, content, className) => html`
  <h1 class="${className}">${title}</h1>
  <div>${content}</div>
`;
<template>
    <h1 class$lit$=\"{{lit-7227407027270176}}\"><!--{{lit-7227407027270176}}--></h1>
    <div><!--{{lit-7227407027270176}}--></div>
</template>
```

简单的解释一下，这个过程就是逐个处理strings中的数据，根据不同的情况

- Attribute
- Node
- Comment

拼接成一个完整的字符串，然后innerHTML插入到创建好的template标记中。 Q：如何区分代码中真正的comment？

#### lit-html.render

现在我们有了通过标签模版得到的 `TemplateResult` （一个纯值对象），接下来需要调用 `render` 方法去渲染模版到页面上，先看API `render(templateResult, container, options?)` `render` 接收一个 `templateResult实例` 和 container 渲染容器来完成一次渲染，这里分为首次渲染和更新渲染。

##### 首次渲染

先创建一个 `NodePart` 对象（继承自Part，可以理解为节点的构造器controller，这个是核心实现，暂时不展开，后面来看），然后调用 `NodePart` 实例的 `appendInto` 方法，在渲染容器中加入两个 `comment` ，同时记录了两个 `comment` 的引用。后续 `NodePart` 会把 `DOM` 渲染到这两个 `comment` 中间

```html
<div id="container"><!---><!---></div>
<!-- 他是使用comment作为占位符的。 -->
```

然后会调用 `part.commit` 方法，将内容渲染到容器中 commit分为了几种情况

- directive
- primitive（原始类型）
- templateResult
- node
- Iterable
- 清空

根据前面的逻辑，第一次一定会直接走进 `templateResult` 的分支，这里的逻辑可以简单这么描述， 通过 `Factory` ，使用 `TemplateResult` 中的模版部分 strings 创建一个 `Template` 对象（中间产物）， `Factory` 这里做了一层缓存，如果使用 `TemplateResult` 的模版（strings）有现成的模版的话，直接使用现成的模版，如果没有，则重新创建。 在后续调用 render方法时，相同的模版（strings 值与第一次调用时是完全一致）是重用第一次的Template的，可以理解为编译时期就确定的一个常量值，而变化的只有 value 数组

```typescript
export declare class Template {
    readonly parts: TemplatePart[];
    readonly element: HTMLTemplateElement;
}
export type TemplatePart = {
  readonly type: 'node'; index: number;
} | {
  readonly type: 'attribute';
  index: number;
  readonly name: string;
  readonly strings: ReadonlyArray<string>;
};
```

1. 先用TemplateResult的模版（string）找有没有现成的模版，如果有，直接复用
2. 如果没有，则检查keyString的模版中有没有 模版.join markerKey的引用（markKey means lit-7227407027270176）
3. 如果还是没有，则创建一个Template实例，并且将Template 使用模版 和 keyString缓存起来

缓存流程不展开讲解，如果有兴趣自己看一下

`Template` 对象中分为 parts 和 element，element就是TemplateResult转化出来的 `<template>` ，parts部分，是在遍历`<template>`（dom walker）的时候生成的。处理流程简化理解

- 如果是Node节点
  - 判断是否有attribute，且属性名有特殊标记，有的话，移除template上的属性，并往part push一个 `{type: 'attribute', index, name, strings: statics}` 的结构，index是当前的walker下标，name是属性名，strings是这个属性的插值前后字符
- 如果是Comment节点
  - 如果comment的内容等同于marker -（这里可以和真正的comment区分开），然后往part中推入一个node节点 `{type: 'node', index}`
    - 如果是第一个节点或者前面一个节点已经是一个part的标记了，会先在当前节点前添加一个空的comment节点，

```htmlbars
<template>
    <h1 class$lit$=\"{{lit-7227407027270176}}\"><!--{{lit-7227407027270176}}--></h1>
    <div><!--{{lit-7227407027270176}}--></div>
</template>
```

处理完成后

```javascript
{
    element: template
    parts: [
        {type: "attribute", index: 1, name: "class", strings: ["", ""]},
        {type: "node", index: 3},
        {type: "node", index: 7},
    ]
}
// templatee也会会简化成如下结构
<template>
  <h1><!----><!----></h1>
  <div><!----><!----></div>
</template>
```

可以理解 `Template` 是一个已经成型的 `DOM` 模版，他拥有完整的 `DOM` 和需要插值的位置定位，但他还没渲染到 `DOM` 上

接下来检查当前的 `Template` 是否已经创建了 `TemplateInstance` 实例，如果没有，实例化一个 `TemplateInstance`

```typescript
class TemplateInstance {
    private readonly __parts;
    readonly processor: TemplateProcessor;
    readonly options: RenderOptions;
    readonly template: Template;
    constructor(template: Template, processor: TemplateProcessor, options: RenderOptions);
    update(values: readonly unknown[]): void;
    _clone(): DocumentFragment;
}
```

TemplateInstance 会通过`<template>`创建 `fragment` ; 然后遍历 `parts` ，根据 `TemplatePart` 字面量的类型，分别创建 NodePart 和 AttributePart 实例。

最终调用 `TemplateInstance` 实例的 `update` 方法，这个方法会逐个调用 `Part` 实例的 `setValue` （真实的值）和 `commit` （渲染方法）方法，至此，循环回了render的最开始的方法调用，剩下的就是递归调用，直到找到原始的值类型的那一层，渲染到Fragment上。

- `__commitText` ：直接修改文本节点的文本
- `__commitNode` ：清空父亲节点中的startNode到endNode（最开始提到的那两个comment占位），然后把node添加进去。

当递归回到最顶层后， `commitNode` 拿到的就是完整的 `fragment` ，塞到容器中就可以了。

###### 核心流程

至此，第一次的渲染完成，大致流程如下

![image-7-1624330788460.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b6574d17e714607bf9bfea7ea6e4f35~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

可能听起来有些绕，我们可以暂时忽略 `Template` ，它是一个中间状态

`TemplateResult` 是类似 `JSX` 的一种更轻量的对于模版的字面量描述，是一个模型 `TemplateInstance` 可以理解成一个小的 `MVC` 框架的嵌套

- DOM（fragment） 是应用的外层框架，是不变的 View 部分
- `TemplateResult` 中的成员 `value` 是 Model
- Controller（Part）中连接了 View 和 Model。提供了更新数据的方法（setValue）和渲染到视图的方法（Commit）

##### 更新渲染

可以类比SQL执行过程中的库缓存，如果SQL结构一致就复用已有的模型 逐层比较检查所有的缓存是否命中（对比类型 和 模版 - strings结构）

1. 如果命中的话就使用已有模版，找到 `TemplateInstance` 的 `Part` ，把 `templateResult` 的 `value` 更新给 `Part`
2. 如果没有命中的话，就走第一次渲染的流程

#### 效率

- `带标签的模版字符串` 执行相比 `JSX` 会更加高效。 `JSX` 的每次 render 都需要完整的构造一个虚拟DOM，而 `lit-html` ，则只是重新构建一个十分轻量的 TemplateResult 对象，变化的只有 value 集合。
- 从 TemplateResult 到 < template> 的过程，是直接从 TemplateResult 构造 html ，然后使用 template.innerHTML 完成解析的。这个过程完全使用浏览器自己的语法解析器来完成的。由于使用了 template 技术，这个DOM是一个Fragement，并不是真实DOM的一部分，内存占用小
- 实际渲染的DOM生成，是从 template.importNode 来完成DOM的复制。而不是像React一样逐个Dom节点的创建。对于较大的DOM，效率十分可观
- 在增量更新的过程中，Lit 和 React 相类似，都是按照相同层次的节点重用的方式，React通过 `diff(VDOM, DOM)` 来实现增量更新，而LitHtml并没有使用diff算法，而是基于相同模板的渲染，只需要对动态部分进行更新即可。没有diff算法会更加的轻

> 有关注过尤大状态的同学应该在Vue 3 发布的时候，可能会看到过一个东西横空出世，vue-lit，vue-lit就是基于lit-html模版引擎和@vue/reactivity的数据绑定做的一款面向未来的玩具。 Lit 自身也提供了一个数据绑定，数据响应式的包来支撑整个框架

### Lit-element

OK，模版语法有了，剩下的就是如何把状态变化响应式的应用到模版里了。

#### 如何使用

这部分实际上不复杂，有过Vue开发经历的同学一定都清楚Vue是如何将数据和视图绑定起来。 `Lit-element` 也是如此 在Lit中，你需要这样声明一个组件

```scala
@customElement('simple-greeting')
export class SimpleGreeting extends LitElement { /* ..*/ }
```

customElement 实际上是 customElement.defined 的语法糖，而 `LitElement` 是 `Lit` 提供的一个基类，其中就处理了数据的响应式处理（实际上 `LitElement` 还继承了 `UpdateElement` ，由 `UpdateElement` 做响应式的处理）。

#### Reactivity Property

我们先看看，Lit的文档中要求怎么定义 `reactivity property`

```scala
class MyElement extends LitElement {
  @property()
  name: string;
}
```

我们会会发现，如果需要响应式属性的话，需要使用 property 这个装饰器来装饰属性，property 这个装饰器的逻辑为，调用所在类的静态方法 `createProperty` 往类的静态成员 `_classProperties` 中注册这个属性，同时，给这个属性添加 getter 和 setter，到这里，类准备工作就做好了。

- getter：直接取
- setter：更新后触发更新

每次在组件内部修改 `reactive property` 的时候，属性更新完成后会重新调用 `lit-html` 的 render 方法渲染到UI上。

这个和 state 的概念十分的相似，那么 `lit-element` 又是如何处理外部传输属性（props）的变化呢？ 这里我们需要应用到前面提到的 `Web-Component` 的生命周期`get observedAttributes` 和 `attributeChangedCallback` 。每次当传递给 component 的属性发生变化的时候，这两个周期就会触发，只需要查询是否在 `_classProperties` 中，并主动更新 `reactive property` 即可。 除此之外，property 装饰器还可以接受一个 options 配置一些属性来进行适配

1. attribute - 定义这个成员变量是否和元素属性绑定
2. converter - 定义转化逻辑，从元素属性（都是string）到真实属性
3. hasChanged - 判断属性是否发生变化
4. type - 在没有定义converter时使用，转化元素类型
5. state - 如果定义了state的话，象征这个成员变量是一个内部状态，是私有的，新版的 `Lit` 提供了一个单独的装饰器@state 来替代这个属性

`Lit` 剩下的诸如装饰器，事件绑定之类的就不再展开细说了，有兴趣的同学可以去阅读下源码，整体上比 React 易读性高的多（Doge）。至此，一个完整的可用的面向未来的前端框架就完成了。

## Lit的认识

### **1.介绍**

#### **背景（为什么要用lit）**

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20240102170600353.png)

开发一个组件，怎么能一次开发，多处使用，可能就需要通过写最通用最基础的原生语法去实现。

**实现一个头像组件**

```
// 引入Lit的API
import { LitElement, html, css } from "lit";
// 创建 Avatar 组件
class Avatar extends LitElement {
  // 声明响应式的变量
  static properties = {
    url: {},
  };
  constructor() {
    super();
    this.url = "https://i.ibb.co/8M5HTys/default-Avatar.png";
  }
  // 定义模版并渲染
  render() {
    return html`<img class="avatar" src="${this.url}" alt="旋转的小头像" />`;
  }
}
// 为组件添加样式
Avatar.styles = css`
  .avatar {
    width: 5rem;
    height: 5rem;
    margin-right: 2rem;
    border-radius: 50%;
  }
  .avatar:hover {
    animation: 2s cubic-bezier(0.34, 0, 0.84, 1) 10 alternate both rotate;
  }
  @keyframes rotate {
    0%,
    20% {
      transform: rotate(0turn);
    }

    80%,
    100% {
      transform: rotate(6turn);
    }
  }
`;
// 将 Avatar 组件注册为一个自定义 html 元素
// 自定义HTML元素的命名规范：必须包括一个连字符（-）
customElements.define("lit-avatar", Avatar);
// 导出组件
export default Avatar;
```

引入到React

```
import React, { Component } from "react";
// 引入Avatar组件，注册 lit-avatar 自定义元素
import "./LitComponents/Avatar";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <!-- <lit-avatar />是Avatar组件中自定义的html元素 -->
        <lit-avatar url="./avatar.png" />
        <h3>我是旋转的Lit组件</h3>
      </div>
    );
  }
}

export default App;
```

引入到Vue

```
<template>
  <div class="App">
    <!-- <lit-avatar />是Avatar组件中自定义的html元素 -->
    <lit-avatar url="./avatar.png" />
    <h3>我是旋转的Lit组件</h3>
  </div>
</template>

<script>
// 引入Avatar组件，注册 lit-avatar 自定义元素
import "./LitComponents/Avatar/index";

export default {
  name: "App",
  components: {},
};
</script>

<style></style>
```

引入到angular

angular在使用自定义元素的时候需要在module中添加配置

schemas: [CUSTOM_ELEMENTS_SCHEMA]

```
import { Component } from '@angular/core';
// 引入Avatar组件，注册 lit-avatar 自定义元素
import './LitComponents/Avatar';

@Component({
  selector: 'app-root',
  template: `  
    <div class="App">
      <!-- <lit-avatar />是Avatar组件中自定义的html元素 -->
      <lit-avatar url="./avatar.png"></lit-avatar>
      <h3>我是旋转的Lit组件</h3>
    </div>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ng-app';
}
```



#### **特点：**

##### **优点：**

1. 轻量级：Lit 框架的核心库非常小巧，仅有几KB的大小。这使得它在加载和执行时非常高效，可以快速渲染和更新页面。
2. 性能优异。不使用VDOM 的一些弊端，而是利用Web平台的原生能力web-component，自定义元素和Shadow DOM。这使得Lit 框架在处理大规模数据和复杂组件时依然能够保持出色的性能表现
3. 框架无关。web-component 是 HTML 的原生能力，也就代表着 web-component 可以在任何使用 HTML 的地方使用。
4. Lit 框架内置了响应式数据绑定机制，可以轻松地实现数据和视图之间的自动更新。当数据发生变化时，相关的视图部分会自动更新，无需手动操作。鼓励组件化开发。

##### **缺点：**

1. 生态系统相对较小：与一些成熟的框架相比，如React、Angular、Vue，Lit 框架的生态系统相对较小。这意味着在寻找特定功能或解决方案时，可能需要花费更多的时间和精力。
2. 学习资源相对较少：相对于一些更流行的框架，Lit 框架的学习资源可能相对较少。这可能会导致在学习和解决问题时的困难，尤其是对于初学者来说。
3. 编写复杂组件可能更困难：对于较为简单的组件，Lit 框架提供了简洁的写法。然而，对于较为复杂的组件，Lit 框架可能需要编写更多的模板代码来处理动态内容和逻辑。这可能会导致代码变得复杂，增加维护的难度。
4. 缺乏一些高级语法特性：尤其是和Vue相比，会发现Vue的内置语法糖真方便，简洁优雅，Lit 框架在语法特性方面相对较少，不支持JSX语法。
5. web-component存在浏览器兼容性问题

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20240102170600603.png)

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20240102170600641.png)

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20240102170600683.png)

### **2.lit-component的一些基本概念**

#### **web-component(HTML原生能力)**

通过custom element自定义元素，通过shadow DOM隔离样式和行为动作，从而实现我们自己的自定义组件。原生的web-component可以实现组件通信，也有它自己的生命周期的概念，可以实现一份代码多个框架使用。

但是它现阶段也存在一些[劣势](https://juejin.cn/post/7096265630466670606#heading-18)：

- 更加偏向于 UI 层面，与现在数据驱动不太符，和现在的组件库能力上相比功能会比较弱，使用场景相对单一。
- 兼容性还有待提升：这里不仅仅指的是浏览器的兼容性，还有框架的兼容性，在框架中使用偶尔会发现意外的“惊喜”，并且写法会比较复杂。
- 如果不借助框架开发的话，写法会返璞归真，HTML CSS JS 会糅合在一个文件，html CSS 都是字符串的形式 ，没有高亮，格式也需要自己调整，对于开发人员来说还是难受的。
- 单元测试使用繁琐：单元测试是组件库核心的一项，但是在 WebComponents 中使用单元测试十分复杂。

[官方文档](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)、[基于web-component封装自己的UI组件](https://juejin.cn/post/7096265630466670606#heading-18)

lit是基于web-component前端框架，lit中最核心的组成是基类（litElement）,从官网提供的这张图中，我们可以看到，它继承自原生的HTMLElement类，同时提供了响应式状态，生命周期，以及一些控制器、混入等高级用法，提供了一些现代框架的能力。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20240102170600717.png)

#### **组件的定义（以TS为例）：**

```
@customElement('simple-greeting')
export class SimpleGreeting extends LitElement { /* ... */ }
```



装饰器@customElement是调用customElements.define 的简写，它向浏览器注册自定义元素类并将其与元素名称关联，当我们定义好Lit组件时，就是在自定义HTML元素，可以像使用任何内置元素一样使用新元素。

#### **组件渲染****：**

通过在定义组件时编写render方法，来定义组件需要呈现的内容

```
import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';

@customElement('my-element')
class MyElement extends LitElement {

  render(){
    return html`<p>Hello from my template.</p>`;
  }
}
```

官网的模板渲染说明：

1. Lit 组件在添加到页面上的 DOM 时最初会呈现其模板。初始渲染后，对组件的响应式属性的任何更改都会触发更新周期，重新渲染组件。
2. Lit 批量更新以最大限度地提高性能和效率。一次设置多个属性仅触发一次更新，并在微任务计时异步执行。
3. 在更新期间，仅重新渲染 DOM 中发生更改的部分。尽管 Lit 模板看起来像字符串插值，但 Lit 会解析并创建一次静态 HTML，然后仅更新表达式中更改的值，从而使更新非常高效。

#### **响应式属性（类似于Vue的props，data）****：**

官网对其的定义：响应式属性是在更改时可以触发响应式更新周期、重新呈现组件、并且可以选择读取或写入属性的属性。

写法：

```
class MyElement extends LitElement {
  @property()
  name: string;
}
```

**Public properties and internal state（公共属性和内部状态）**

```
@state()
private _counter = 0;
```

区别：推荐property用来响应外部的输入，而state是组件内部使用，在TS中，通常用protected 或 private来修饰。（对于state，官网是这样描述的，Lit also supports *internal reactive state*. Internal reactive state refers to reactive properties that *aren't* part of the component's API. These properties don't have a corresponding attribute）。

**使用@property带有类字段声明的装饰器来声明反应式属性，****传递选项对象来配置属性的功能**

```
class MyElement extends LitElement {
  @property({type: String})
  mode: string;

  @property({attribute: false})
  data = {};
}
```



配置项说明：https://lit.dev/docs/components/properties/#internal-reactive-state

#### **样式：**

向组件中添加样式：

```
import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';

@customElement('my-element')
export class MyElement extends LitElement {
  static styles = css`
    p {
      color: green;
    }
  `;
  protected render() {
    return html`<p>I am green!</p>`;
  }
}

// styles也可以写成数组形式
static styles = [ css`...`, css`...`];

// 同时styles也支持表达式写法，但变量必须加上css标记，以确保安全
const mainColor = css`red`;
static styles = css`
  div { color: ${mainColor} }
`;
// 或者写成这样，用unsafeCSS包裹表达式
const mainColor = 'red';
static styles = css`
  div { color: ${unsafeCSS(mainColor)} }
`;
```

#### **组件生命周期：**

标准自定义元素生命周期

- constructor() 创建元素时调用
- connectedCallback() 组件添加到dom时调用（在此后启动响应式周期）
- disconnectedCallback() 当从文档的 DOM 中删除组件时调用（暂停响应式周期）
- attributeChangedCallback() 当元素的observedAttributes发生更改时调用
- adoptedCallback() 当元素被移动到新的dom时调用

响应式更周期：

更新前：

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20240102170600778.png)

更新：

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20240102170600811.png)

更新后：

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20240102170600848.png)

当响应式属性发生变化或者调用requestUpdate()方法时，触发响应式更新周期

requestUpdate()

```js
connectedCallback() {
  super.connectedCallback();
  this._timerInterval = setInterval(() => this.requestUpdate(), 1000);
}

disconnectedCallback() {
  super.disconnectedCallback();
  clearInterval(this._timerInterval);
}
```

shouldUpdate() 默认返回true

```js
shouldUpdate(changedProperties: Map<string, any>) {
  // Only update element if prop1 changed.
  return changedProperties.has('prop1'); 
}
```

willUpdate()  在此阶段计算一些需要在此次更新期间需要用到的值

```js
willUpdate(changedProperties: PropertyValues<this>) {
  // only need to check changed properties for an expensive computation.
  if (changedProperties.has('firstName') || changedProperties.has('lastName')) {
    this.sha = computeSHA(`${this.firstName} ${this.lastName}`);
  }
}

render() {
  return html`SHA: ${this.sha}`;
}
```

update() 调用以更新组件DOM，通常不需要我们手动调用此方法

render() 渲染组件DOM

firstUpdated() 组件第一次更新时调用，只会在组件创建时被调用一次。

```js
firstUpdated() {
  this.renderRoot.getElementById('my-text-area').focus();
}
```

updated() 在此阶段dom已经更新，可以做一些dom的操作

```js
updated(changedProperties: Map<string, any>) {
  if (changedProperties.has('collapsed')) {
    this._measureDOM();
  }
}
// 执行动画的代码可能需要测量元素DOM
```

#### **shadow DOM：**

shadow的好处：

1. DOM隔离。像document.querySelector这样的DOM API不会影响lit组件的内部元素。
2. 样式隔离

**如何获取shadow DOM中的node节点**

```js
firstUpdated() {
  this.staticNode = this.renderRoot.querySelector('#static-node');
}

get _closeButton() {
  return this.renderRoot.querySelector('#close-button');
}
```



同时lit提供了一组API来更方便的获取内部元素@query()、@queryAll()、@queryAsync

@query()

```js
import {LitElement, html} from 'lit';
import {query} from 'lit/decorators/query.js';

class MyElement extends LitElement {
  @query('#first') // 第一个参数是要选取的元素，第二个参数传一个布尔值，来确定是否只取一次并缓存
  _first;

  render() {
    return html`
      <div id="first"></div>
      <div id="second"></div>
    `;
  }
}
```



@queryAll()

```js
import {LitElement, html} from 'lit';
import {queryAll} from 'lit/decorators/queryAll.js';

class MyElement extends LitElement {
  @queryAll('div')
  _divs;

  render() {
    return html`
      <div id="first"></div>
      <div id="second"></div>
    `;
  }
}
```



@queryAsync则并不是返回一个节点，而是一个promise

**插槽（类似于vue）：**

```js
// 组件
import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';

@customElement('my-element')
export class MyElement extends LitElement {
  protected render() {
    return html`
      <p>
        <slot></slot>
      </p>
    `;
  }
}
// html
<script type="module" src="./my-element.js"></script>

<my-element>
  <p>Render me in a slot</p>
</my-element>

<hr>

<my-element>
  <p>Render me in a slot</p>
  <p>Me too</p>
  <p>Me three</p>
</my-element>
```



**具名插槽：**

```js
// 组件
import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';

@customElement('my-element')
export class MyElement extends LitElement {
  protected render() {
    return html`
      <p>
        <slot name="one"></slot>
        <slot name="two"></slot>
      </p>
    `;
  }
}
// html
<script type="module" src="./my-element.js"></script>

<my-element>
  <p slot="two">Include me in slot "two".</p>
</my-element>

<hr>

<my-element>
  <p slot="one">Include me in slot "one".</p>
  <p slot="nope">This one will not render at all.</p>
  <p>No default slot, so this one won't render either.</p>
</my-element>
```



**如何获取插槽中的元素：**

slot.assignedNodes或者slot.assignedElements获取插槽内的节点，slotchange事件来响应插槽内的内容发生改变。

```js
get _slottedChildren() {
  const slot = this.shadowRoot.querySelector('slot');
  return slot.assignedElements({flatten: true});
}
```





```
handleSlotchange(e) {
  const childNodes = e.target.assignedNodes({flatten: true});
  // ... do something with childNodes ...
  this.allText = childNodes.map((node) => {
    return node.textContent ? node.textContent : ''
  }).join('');
}

render() {
  return html`<slot @slotchange=${this.handleSlotchange}></slot>`;
}
```



也可以用lit提供的API：@queryAssignedElements and @queryAssignedNodes



```
@queryAssignedElements({slot: 'list', selector: '.item'})
_listItems!: Array<HTMLElement>;

@queryAssignedNodes({slot: 'header', flatten: true})
_headerNodes!: Array<Node>;
```



#### **事件****：**

使用@符号来定义事件

```
import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('my-element')
export class MyElement extends LitElement {
  @property({type: Number}) count = 0;
  protected render() {
    return html`
      <p><button @click="${this._increment}">Click Me!</button></p>
      <p>Click count: ${this.count}</p>
    `;
  }
  private _increment(e: Event) {
    this.count++;
  }
}
```



为事件定义配置项（如once，capture等）：



```
import {LitElement, html} from 'lit';
import {eventOptions} from 'lit/decorators.js';
//...
@eventOptions({passive: true})
private _handleTouchStart(e) { console.log(e.type) }
```



或者是



```
render() {
  return html`<button @click=${{handleEvent: () => this.onClick(), once: true}}>click</button>`
}
```



也可以在构造器中为组件本事绑定事件



```
import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
@customElement('my-element')
class MyElement extends LitElement {
  @property() hostName = '';
  @property() shadowName = '';
  constructor() {
    super();
    this.addEventListener('click',
      (e: Event) => this.hostName = (e.target as Element).localName);
  }
  protected createRenderRoot() {
    const root = super.createRenderRoot();
    root.addEventListener('click',
      (e: Event) => this.shadowName = (e.target as Element).localName);
    return root;
  }
  protected render() {
    return html`
      <p><button>Click Me!</button></p>
      <p>Component target: ${this.hostName}</p>
      <p>Shadow target: ${this.shadowName}</p>
    `;
  }
}
```



对于想要在其他组件上绑定事件的情况，需要在生命周期connectedCallback()中绑定，并在disconnectedCallback()中销毁，防止出现内存的泄漏。



```
// 监听window的resize事件
connectedCallback() {
  super.connectedCallback();
  window.addEventListener('resize', this._handleResize);
}
disconnectedCallback() {
  window.removeEventListener('resize', this._handleResize);
  super.disconnectedCallback();
}
```



也可以为组件添加自定义事件



```
// index.html
<script type="module" src="./my-listener.js"></script>
<script type="module" src="./my-dispatcher.js"></script>

<my-listener>
  <my-dispatcher></my-dispatcher>
</my-listener>

// my-listener.ts
import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
@customElement('my-listener')
class MyListener extends LitElement {
  @property() name = '';
  protected render() {
    return html`
      <p @mylogin=${this._loginListener}><slot></slot></p>
      <p>Login: ${this.name}</p>`;
  }
  private _loginListener(e: CustomEvent) {
    this.name = e.detail.name;
  }
}

// my-dispatcher.ts
import {LitElement, html} from 'lit';
import {customElement, query} from 'lit/decorators.js';

@customElement('my-dispatcher')
class MyDispatcher extends LitElement {
  @query('input', true) _input!: HTMLInputElement;
  protected render() {
    return html`
      <p>Name: <input></p>
      <p><button @click=${this._dispatchLogin}>Login</button></p>
    `;
  }
  private _dispatchLogin() {
    const name = this._input.value.trim();
    if (name) {
      const options = {
        detail: {name},
        bubbles: true,
        composed: true
      };
      this.dispatchEvent(new CustomEvent('mylogin', options));
    }
  }
}
```



### **3.模板**：

虽然lit的模板语法可能看起来你只是在做字符串插值。但是，对于有标签的模板字面，浏览器会将一个字符串数组（模板的静态部分）和一个表达式数组（动态部分）传递给标签函数。浏览器使用这个数组来建立一个有效的模板表示，因此它可以只重新渲染模板中已经改变的部分。

#### **表达式**

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20240102170600912.png)

[更详细的表达式说明](https://lit.dev/docs/templates/expressions/)

#### **条件渲染：**

方法一：条件表达式



```
@customElement('my-element')
export class MyElement extends LitElement {
    @property({ type: Boolean })
    hasAuth = false

    render() {
        return html`
            <div
                class="polaris_dark_theme"
            >
                ${this.hasAuth ? html`
                    <main-page></main-page>
                ` : html`
                    <div class="empty">
                    </div>
                `}
            </div>
        `
    }
}
```



方法二：if语句

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20240102170600964.png)



```
render() {
  let message;
  if (this.userName) {
    message = html`Welcome ${this.userName}`;
  } else {
    message = html`Please log in <button>Login</button>`;
  }
  return html`<p class="message">${message}</p>`;
}
```



同时，为了提高性能，lit也提供了缓存指令，用来缓存DOM



```
render() {
  return html`${cache(this.userName ?
    html`Welcome ${this.userName}`:
    html`Please log in <button>Login</button>`)
  }`;
}
```



某种条件下，不渲染任何内容



```
// 对于子节点，使用 ？？ ➕ nothing、或者null、undefined、‘’的形式
render() {
  return html`<user-name>${this.userName ?? nothing}</user-name>`;
}
// 对于属性， 使用｜｜ ➕ nothing的形式
html`<button aria-label="${this.ariaLabel || nothing}"></button>`
```



#### **列表渲染**：

**map**



```
@property() colors = ['red', 'green', 'blue'];

render() {
  return html`
    <ul>
      ${this.colors.map((color) =>
        html`<li style="color: ${color}">${color}</li>`
      )}
    </ul>
  `;
}
```



**repeat指令（可以更加高效的更新）**



```
import {repeat} from 'lit/directives/repeat.js';
/* playground-fold */

@customElement('my-element')
class MyElement extends LitElement {

private sort = 1;

@property() employees = [
  {id: 0, givenName: 'Fred', familyName: 'Flintstone'},
  {id: 1, givenName: 'George', familyName: 'Jetson'},
  {id: 2, givenName: 'Barney', familyName: 'Rubble'},
  {id: 3, givenName: 'Cosmo', familyName: 'Spacely'}
];
/* playground-fold-end */

render() {
  return html`
    <ul>
      ${repeat(this.employees, (employee) => employee.id, (employee, index) => html`
        <li>${index}: ${employee.familyName}, ${employee.givenName}</li>
      `)}
    </ul>
    <button @click=${this.toggleSort}>Toggle sort</button>
  `;
}
```



**什么情况下使用重复指令**

- 如果更新DOM节点比移动它们更昂贵，则使用重复指令
- 如果DOM节点的状态不受模板表达式的控制，可以使用重复指令
- 除此之外的情况都可以使用map



```
html`${this.users.map((user) =>
  html`
    <div><input type="checkbox"> ${user.name}</div>
  `)
}`
```



复选框有一个选中或未选中的状态，但它不是由模板表达式控制的。如果你在用户选中一个或多个复选框后重新排序，Lit会更新与复选框相关的名称，但不会更新复选框的状态。

**更多内建指令：**

**repeat、cache、ref、when、choose**



```
when<T, F>(
  condition: boolean,
  trueCase: () => T,
  falseCase?: () => F
)

class MyElement extends LitElement {
  render() {
    return html`
      ${when(this.user, () => html`User: ${this.user.username}`, () => html`Sign In...`)}
    `;
  }
}
```





```
choose<T, V>(
  value: T,
  cases: Array<[T, () => V]>,
  defaultCase?: () => V
)

class MyElement extends LitElement {
  render() {
    return html`
      ${choose(this.section, [
        ['home', () => html`<h1>Home</h1>`],
        ['about', () => html`<h1>About</h1>`]
      ],
      () => html`<h1>Error</h1>`)}
    `;
  }
}
```





```
map<T>(
  items: Iterable<T> | undefined,
  f: (value: T, index: number) => unknown
)

class MyElement extends LitElement {
  render() {
    return html`
      <ul>
        ${map(items, (i) => html`<li>${i}</li>`)}
      </ul>
    `;
  }
}
```



#### **组合：**

**组件之间的组合：**

**推崇单向数据流：**

父向子通过属性，子向父通过方法

### **4、使用：**

1. 安装及使用

```
npm create vite@latest my-app --template lit
```

1. 安装依赖
2. 项目结构

引入的方式与vue不同,它在head里面最后一行，引用了src里面的my-element.ts，body中则有对应的元素：my-element。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20240102170601011.png)

可以看到页面的dom结构中，是有一个实实在在的my-element标签。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20240102170601160.png)

使用感受：

1. 页面的HTML、CSS、JS混杂在一起，感觉写起来很难受，特别是写HTML和CSS的时候
2. 生态不完善，“不能用less,sass”
3. 内置功能没有Vue强大

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20240102170601211.png)

### **5.生态相关：**

路由：

社区提供：https://www.npmjs.com/package/lit-element-router

共享状态管理：

​	社区提供：https://www.npmjs.com/package/lit-element-state

UI组件库：

1. carbon-web-components： [文档](https://web-components.carbondesignsystem.com/?path=/story/introduction-form-participation--page) ，[github](https://github.com/carbon-design-system/issue-tracking/issues/121)
2. ui5-webcomponents：[文档](https://sap.github.io/ui5-webcomponents/playground/components)，[github](https://github.com/SAP/ui5-webcomponents) （star1.3K）
3. kor： [文档](https://kor-ui.com/introduction/welcome)，[github](https://github.com/kor-ui/kor)

VSCODE插件：

​	语法高亮（lit-html）

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20240102170601266.png)

SSR:

​	支持ssr，官方提供了对应的工具包:

https://www.npmjs.com/package/@lit-labs/ssr

测试工具:

​	lit是标准的js工具库，可以使用任何js测试工具

​		https://lit.dev/docs/tools/testing/

​	

### **6.参考链接：**

https://blog.csdn.net/weixin_41897680/article/details/125144720

https://juejin.cn/post/6976557762377416718

https://juejin.cn/post/7104995344865296391#heading-28

https://juejin.cn/post/7025170006279192583

https://lit.dev/docs/

## lit重构视频组件

### **以Vue的视角写lit**

一个Vue单文件组件可以分为template、script、style三个部分

[基于web-component的前端框架lit](https://docs.corp.kuaishou.com/d/home/fcACYH2WOUY__4xJzxT7ZJRRS)

#### **lit中的样式定义和模板书写**

```
// 定义样式
// 新建style.ts,并在style.ts文件中
import { css } from 'lit'
export default css`
	.cideo-time {
	}
`
// 定义模板
// 在index.ts中引入使用
import styles from './css/time.style'
import { LitElement, html, type CSSResultGroup } from 'lit'
export class VideoTime extends LitElement {
    static styles: CSSResultGroup = styles;
  	// ...
  	render() {
        return html`
            <div class="video-time">
            </div>
        `
    }
}
```

**另外，如果我们想在当前组件中引入其他lit组件，可以直接通过import语句导入，直接在模板中使用**

```
// 组件定义文件
import { LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
@customElement('video-volume')
export class VideoVolume extends LitElement {
  // ...
}
declare global {
    interface HTMLElementTagNameMap {
        'video-volume': VideoVolume
    }
}

// 当前文件
import './controls/volume'
// 模板中直接使用，标签名与组件定义时传入的字符串相同
<video-volume
   class="control-item"
   .volume="${this.original.volume}"
   @volume-change="${this.onVolumeChangeHandler}"
></video-volume>
```

#### **script标签的书写**

在lit中，我们直接在定义的类中书写脚本

```
import { LitElement, html, type CSSResultGroup, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'
export class VideoVolume extends LitElement {
    static styles: CSSResultGroup = styles;
    barRef = createRef<HTMLDivElement>()
    @property({ type: Number })
    volume = 0.5
    
    protected barClientTop: number = 0
    protected barHeight: number = 0
    protected startPosition: number = 0
    
}
```

#### **props、data、computed(Vue)与@property、@state(lit)：**

@property和@state装饰器是lit中用来定义响应式属性的，他们的区别是：

- @state 装饰器用于声明组件的内部状态，可以自动触发重新渲染，只会重新渲染与状态变量相关的部分。

- @property 装饰器用于声明组件的公共属性，可以从外部传递给组件，属性值变化时会触发重新渲染。

@property可以用来接收prop传递的数据，类似于vue中的props，@state更适合用来实现类似于vue中data的效果。

对于vue中的计算属性，我们在lit中可以通过如下方式来实现

```
// 相当于vue的计算属性
@property({type: String})
    get computedZIndex() {
        // 控制条的zIndex默认值为1000，当进度条process在上边时，应该比process 10001高1002
        if (this.controlStyle.reverse === false) {
            return '1002';
        }
        return '';
    }
// 相当于vue的data
@state()
played = false
// 相当于vue的props
@property({type: String})
lyrics = ''
```

**@state的工作原理和@property相同，只是没有与property相关联的attribute。**

[**DOM property 和 attribute 的区别详解**](https://blog.csdn.net/rudy_zhou/article/details/104058741)

在lit框架中，@property装饰器用来定义从外部接受的props，使用方法如下：

```
@property({ type: Boolean })
barShow = false
// @peoperty装饰器主要用来将props转化为内部响应式属性，由于HTML的属性
// 只能传递字符串，所以我们需要为其指定类型，便于lit对属性进行正确的转换
// 装饰器的配置有如下可选择项
{
  attribute // 默认为true，也可以指定和他对应的某个具体的HTML属性
  type // 内置的类型有String，Number， Boolean, Object, Array，lit为这些类型
  		 // 定义好了对应的转化器，将HTML attribute 转换为 lit组件的响应式属性
  hasChaned // 用来定制检测响应式属性是否变化
  converter // 用来定制将HTML attribute 转换为 lit组件的响应式属性的转化器
}
```

[参考文档：](https://lit.dev/docs/components/properties/)

#### **watch(Vue)**

可以在lit中的hasChange()生命周期中书写相关watch的逻辑，这个函数有一个参数，changeProperties，里面会对变化前的数据进行保存，变化后的值可以通过this.property拿到。

```
updated(changedProperties: Map<string, any>) {
        if(changedProperties.has('src') && changedProperties.get('src') !== undefined) {
            this.clicks = 0;
            this.playtimes = 0;
            window.requestAnimationFrame(() => {
                this.initVideo()
            })
        }
        if(changedProperties.has('control') && changedProperties.get('control') !== undefined) {
            if (this.control === CONTROL_SHOW_STICKY) {
                clearTimeout(this.toolTimer);
                this.isToolShow = true;
            } else {
                this.isToolShow = false;
            }
        }
    }
```

#### **created(Vue)**

对于一些数据的初始化工作，我们可以在constructor()这个生命周期中去进行，另外像一些window对象监听事件的定义，也可以在这里定义。**在这时组件并没有挂载到页面，涉及dom的操作不能在这进行。**

```
constructor() {
        // 可以进行数据的初始化，lit不会安排新一轮更新
        super()
        this.clicks = 0;
        this.delay = 300;
        if (!this.isSecPlayer && this.config.miniplayer) {
            window.addEventListener('resize', this.onResize);
        }
    }
```

#### **mounted(Vue)**

对dom进行操作的函数，可以放在这里执行，相当于mounted。如果在这里修改了响应式属性，会触发一轮新的更新。

```
firstUpdated() {
     this.initVideo() // 对dom进行操作的函数，可以放在这里执行，相当于mounted
}
```

#### **beforeDestory(Vue)**

在这里主要做一些清除定时器，销毁绑定事件的操作。

```
disconnectedCallback(): void {
        window.removeEventListener('resize', this.onResize);
}
```

#### **Vue中的$ref的实现**

lit为我们提供了内置指令

```
// 引入内置指令
import {ref, createRef} from 'lit/directives/ref.js';
// 定义
videoRef = createRef<HTMLVideoElement>();
// 模板中引用
<video slot="video"
    ${ref(this.videoRef)}
</video>
```

#### **vue中$emit的实现**

lit中我们需要用原生的方法实现自定义事件，可以通过定义一个函数来实现。

```
// 函数定义
export function getEvent(name: string, detail?: Record<string, any>, cancelable=false, composed=true) {
    return new CustomEvent(name, {
        detail: detail || {},
        bubbles: true, // 事件会冒泡到父组件
        cancelable: cancelable, // 是否可以取消
        composed: composed, // 是否可以穿透shadow DOM
    })
}
// 使用
this.dispatchEvent(getEvent('full-screen-change', { isFullscreen: this.isFullscreen }));
```

#### **vue中$nextTick()的实现**

```
window.requestAnimationFrame(() => {
    this.initVideo()
})
```



### **写的时候遇到的问题**

#### **怎么样实现类似vue里面的watch功能**

#### **怎么监听对象内部属性变化，更新页面**

对于修改对象的属性值这种情况，lit的响应式是检测不到的，如果需要在修改完属性后触发UI更新，需要手动执行this.requestUpdate()函数

```
onVolumeChange(volume: number) {
        const video = this.videoRef.value!
        video.volume = this.original.volume = volume;
        this.requestUpdate()
}
```



#### **具名插槽slot内的默认内容不会被替换，而是依然在最底部展示**

可以通过配置属性来控制默认内容是否展示

```
// lit组件内部的定义
// 通过配置来控制插槽内的内容是否展示
<slot name="bar-right">
    ${this.config.playbackRate ? html`
    <video-playback-rate
    	class="control-item"
    	.rateConfig="${this.rateConfig}"
    	.playbackRate="${this.original.playbackRate}"
    	@rate-change="${this.onPlaybackRateChangeHandler}"
		>
   	</video-playback-rate>
    ` : nothing}
<slot>
// vue中使用，使用原生slot写法
 		<admin-video-player
        autoplay
        :initVolume="0"
        :lyrics="cc"
        :src="src"
        :width="width"
        :height="height"
        :config="config"
        :controlStyle="JSON.stringify(controlStyle)"
        @full-screen-change="ee"
        @play="play"
    >
        <div slot="bar-right"></div>
    </admin-video-player>
```



#### **组件接收的props如果是复杂类型，如对象类型，在跨框架衔接过程中可能会出现问题。**

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20240102171228697.png)

由于lit打包后的组件是原生的HTML组件，因此它只能接受字符串类型的props，所以我们在写的时候要么用JSON.stringify()对对象进行包裹，**要么使用Vue的.prop修饰符**.

对于复杂数据的传递，QuarkC是这样做的：

组件内部暴露一个 setData 方法。

```
// 组件内
import { QuarkElement, customElement } from "quarkc"

@customElement({tag: "my-picker"})
class MyPicker extends QuarkElement {
  data = []

  setData(data) {
    this.data = data
  }

  render() {
    return (
      /***/
    )
  }
}
// 组件外使用时，通过 ref 拿到组件的实例，然后调用暴露的 setData 方法即可完成复杂数据类型的传递。
// React 示例：
() => {
  const pickerRef = useRef(null)

  useEffect(() => {

    pickerRef.current.setData([])

  }, [])

  return <my-picker ref={pickerRef} />
}
```



#### **组件如何在其他地方使用**

**先看一下原来的vue组件支持哪些功能**

**传递props**

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20240102171455808.png)

**支持组件slot**

**组件支持的方法**

**组件传出的事件**

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20240102171228996-20240102171555423.png)

**1.引入使用**

lit组件在其他地方引入的时候，只需要导入即可

**2.prop传递**

```
// 模板中使用		
		<admin-video-player
        autoplay
        :initVolume="0"
        :lyrics="cc"
        :src="src"
        :width="width"
        :height="height"
        :config.prop="config"
        :controlStyle.prop="controlStyle"
        @full-screen-change="ee"
        @play="play"
    > 
    </admin-video-player>
// script标签中引入
import '../dist/main'
```

// config传递的是一个对象，当我们在vue2中使用时，需要加.prop修饰符来告诉Vue将他作为dom.property来传递，vue3中则不需要加修饰符。

vue2: https://v2.cn.vuejs.org/v2/api/?#v-bind

vue3: https://cn.vuejs.org/api/built-in-directives.html#v-bind

**对外暴露的事件**

```
        play(e) {
            console.log(e);
        },
```



![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20240102171229097.png)

这里和vue不同的是，由于lit编写的组件相当于原生的HTML元素，所以要对外传递的数据只能通过event对象传递。因此我将需要传递的数据放在了event.detail中。

**组件slot**



```
// slot的写法应当使用原生写法
    <admin-video-player
        ...
        :config.prop="config"
        ...
    >
        <div slot="bar-right">
            ...
            // 定义了左侧播放按钮的样式
        </div>
    </admin-video-player>
    ... 
    data: {
        config: {
            play: false // 将原有的播放按钮关闭
        }
    }
```

lit框架在处理插槽内的内容与vue有所不同，当我们给插槽内设置了默认内容，同时我们又向里面传递了内容的时候，默认内容不会被替换，而是同时存在，所以需要传递一个属性来控制默认内容的显示与隐藏。

**对外暴漏的方法**

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20240102171229142.png)

通过public关键词，将类方法暴漏，在组件外可以获取组件实例，通过（实例.方法）的方式调用

**最后：**

**Vue与WebComponent：**[**https://cn.vuejs.org/guide/extras/web-components.html**](https://cn.vuejs.org/guide/extras/web-components.html)

参考链接：

[lit官网](https://lit.dev/)

[你想要了解的Shadow DOM都在这里 - 掘金](https://juejin.cn/post/6979489951108825095#heading-2)

