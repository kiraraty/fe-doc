

## Web Components
Web 组件是一种标准化的 Web 开发技术，它提供了一种创建可重用组件的方式，可以在不同的框架和项目中共享使用。然而，就像任何技术一样，Web 组件也有其优点和缺点。
### 优点：
1. **独立性：** Web 组件是独立的、自包含的组件，它们不依赖于特定的框架或库。这使得它们可以在各种项目和技术栈中被使用，提高了组件的可移植性和重用性。
2. **封装性：** Web 组件允许将 HTML、CSS 和 JavaScript 封装在一个独立的组件中。这种封装性有助于隐藏实现细节，提高组件的隔离性，防止全局作用域的污染。
3. **复用性：** 由于独立性和封装性，Web 组件具有高度的复用性。可以在不同项目中轻松地使用相同的组件，从而减少代码冗余。
4. **框架无关：** Web 组件不依赖于特定的前端框架，因此可以与任何框架结合使用。这使得团队可以在不同的框架中共同使用相同的组件。
5. **标准化：** Web 组件遵循 Web 标准，并且是由 W3C 组织推动的。这意味着它们是一种官方认可的 Web 开发标准，未来会更好地融入浏览器和开发工具。

### 缺点：
1. **兼容性：** 尽管现代浏览器对 Web 组件的支持越来越好，但在某些旧版本的浏览器中可能存在兼容性问题。为了确保在各种环境中可靠运行，可能需要使用 polyfill 或其他额外的工具。
2. **学习曲线：** 对于初学者来说，学习和理解 Web 组件的概念可能需要一些时间。特别是对于那些对 Web 开发标准不太熟悉的开发者，需要适应新的概念和技术。
3. **复杂性：** 尽管 Web 组件的封装性是一项优点，但有时也可能导致组件内部的复杂性增加。组件的封装和隔离可能使得组件内部状态和逻辑相对难以访问和调试。
4. **生态系统：** 目前 Web 组件的生态系统相对较小，相比之下，一些流行的前端框架（如 React、Vue）有更庞大的生态系统，提供了更多的工具和社区支持。
5. **样式封装：** 尽管 Web 组件支持封装样式，但在某些情况下，样式的封装性可能会导致一些挑战，特别是对于一些全局样式的处理。

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

