## Vue.js 源码目录设计

Vue.js 的源码都在 src 目录下，其目录结构如下。

```text
src
├── compiler        # 编译相关 
├── core            # 核心代码 
├── platforms       # 不同平台的支持
├── server          # 服务端渲染
├── sfc             # .vue 文件解析
├── shared          # 共享代码
```

### compiler

compiler 目录包含 Vue.js 所有编译相关的代码。它包括把<u>模板解析成 ast 语法树，ast 语法树优化，代码生成</u>等功能。

编译的工作可`以在构建时做（借助 webpack、vue-loader 等辅助插件）；也可以在运行时做，使用包含构建功能的 Vue.js。显然，编译是一项耗性能的工作，所以更推荐前者——离线编译。

### core

core 目录包含了 Vue.js 的核心代码，包括==内置组件、全局 API 封装，Vue 实例化、观察者、虚拟 DOM、工具函数==等等。

这里的代码可谓是 Vue.js 的灵魂，也是我们之后需要重点分析的地方。

### platform

Vue.js 是一个跨平台的 MVVM 框架，它可以跑在 web 上，也可以配合 weex 跑在 native 客户端上。platform 是 Vue.js 的入口，2 个目录代表 2 个主要入口，分别打包成运行在 web 上和 weex 上的 Vue.js。

我们会重点分析 web 入口打包后的 Vue.js，对于 weex 入口打包的 Vue.js，感兴趣的同学可以自行研究。

### server

Vue.js 2.0 支持了服务端渲染，所有服务端渲染相关的逻辑都在这个目录下。注意：这部分代码是跑在服务端的 Node.js，不要和跑在浏览器端的 Vue.js 混为一谈。

服务端渲染主要的工作是把组件渲染为服务器端的 HTML 字符串，将它们直接发送到浏览器，最后将静态标记"混合"为客户端上完全交互的应用程序。

### sfc

通常我们开发 Vue.js 都会借助 webpack 构建， 然后通过 .vue 单文件来编写组件。

这个目录下的代码逻辑会把 .vue 文件内容解析成一个 JavaScript 的对象。

### shared

Vue.js 会定义一些工具方法，这里定义的工具方法都是会被浏览器端的 Vue.js 和服务端的 Vue.js 所共享的。

## Vue.js 源码构建

### 构建脚本

Vue.js 源码是基于 [Rollup](https://github.com/rollup/rollup) 构建的，它的构建相关配置都在 scripts 目录下。

通常一个基于 NPM 托管的项目都会有一个 package.json 文件，它是对项目的描述文件，它的内容实际上是一个标准的 JSON 对象。

我们通常会配置 `script` 字段作为 NPM 的执行脚本，Vue.js 源码构建的脚本如下：

```json
{
  "script": {
    "build": "node scripts/build.js",
    "build:ssr": "npm run build -- web-runtime-cjs,web-server-renderer",
    "build:weex": "npm run build -- weex"
  }
}
 
```

这里总共有 3 条命令，作用都是构建 Vue.js，后面 2 条是在第一条命令的基础上，添加一些环境参数。

当在命令行运行 `npm run build` 的时候，实际上就会执行 `node scripts/build.js`，接下来我们来看看它实际是怎么构建的。

### 构建过程

我们对于构建过程分析是基于源码的，先打开构建的入口 JS 文件，在 `scripts/build.js` 中：

```js
let builds = require('./config').getAllBuilds()

// filter builds via command line arg
if (process.argv[2]) {
  const filters = process.argv[2].split(',')
  builds = builds.filter(b => {
    return filters.some(f => b.output.file.indexOf(f) > -1 || b._name.indexOf(f) > -1)
  })
} else {
  // filter out weex builds by default
  builds = builds.filter(b => {
    return b.output.file.indexOf('weex') === -1
  })
}

build(builds)
```

这段代码逻辑非常简单，先从配置文件读取配置，再通过命令行参数对构建配置做过滤，这样就可以构建出不同用途的 Vue.js 了。接下来我们看一下配置文件，在 `scripts/config.js` 中：

```js
const builds = {
  // Runtime only (CommonJS). Used by bundlers e.g. Webpack & Browserify
  'web-runtime-cjs': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.common.js'),
    format: 'cjs',
    banner
  },
  // Runtime+compiler CommonJS build (CommonJS)
  'web-full-cjs': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.common.js'),
    format: 'cjs',
    alias: { he: './entity-decoder' },
    banner
  },
  // Runtime only (ES Modules). Used by bundlers that support ES Modules,
  // e.g. Rollup & Webpack 2
  'web-runtime-esm': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.esm.js'),
    format: 'es',
    banner
  },
  // Runtime+compiler CommonJS build (ES Modules)
  'web-full-esm': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.esm.js'),
    format: 'es',
    alias: { he: './entity-decoder' },
    banner
  },
  // runtime-only build (Browser)
  'web-runtime-dev': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.js'),
    format: 'umd',
    env: 'development',
    banner
  },
  // runtime-only production build (Browser)
  'web-runtime-prod': {
    entry: resolve('web/entry-runtime.js'),
    dest: resolve('dist/vue.runtime.min.js'),
    format: 'umd',
    env: 'production',
    banner
  },
  // Runtime+compiler development build (Browser)
  'web-full-dev': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.js'),
    format: 'umd',
    env: 'development',
    alias: { he: './entity-decoder' },
    banner
  },
  // Runtime+compiler production build  (Browser)
  'web-full-prod': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.min.js'),
    format: 'umd',
    env: 'production',
    alias: { he: './entity-decoder' },
    banner
  },
  // ...
}
```

这里列举了一些 Vue.js 构建的配置，关于还有一些服务端渲染 webpack 插件以及 weex 的打包配置就不列举了。

对于单个配置，它是遵循 Rollup 的构建规则的。其中 `entry` 属性表示构建的入口 JS 文件地址，`dest` 属性表示构建后的 JS 文件地址。`format` 属性表示构建的格式，`cjs` 表示构建出来的文件遵循 [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1) 规范，`es` 表示构建出来的文件遵循 [ES Module](http://exploringjs.com/es6/ch_modules.html) 规范。 `umd` 表示构建出来的文件遵循 [UMD](https://github.com/umdjs/umd) 规范。

以 `web-runtime-cjs` 配置为例，它的 `entry` 是 `resolve('web/entry-runtime.js')`，先来看一下 `resolve` 函数的定义。

源码目录：`scripts/config.js`

```js
const aliases = require('./alias')
const resolve = p => {
  const base = p.split('/')[0]
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, '../', p)
  }
}
```

这里的 `resolve` 函数实现非常简单，它先把 `resolve` 函数传入的参数 `p` 通过 `/` 做了分割成数组，然后取数组第一个元素设置为 `base`。在我们这个例子中，参数 `p` 是 `web/entry-runtime.js`，那么 `base` 则为 `web`。`base` 并不是实际的路径，它的真实路径借助了别名的配置，我们来看一下别名配置的代码，在 `scripts/alias` 中：

```js
const path = require('path')

module.exports = {
  vue: path.resolve(__dirname, '../src/platforms/web/entry-runtime-with-compiler'),
  compiler: path.resolve(__dirname, '../src/compiler'),
  core: path.resolve(__dirname, '../src/core'),
  shared: path.resolve(__dirname, '../src/shared'),
  web: path.resolve(__dirname, '../src/platforms/web'),
  weex: path.resolve(__dirname, '../src/platforms/weex'),
  server: path.resolve(__dirname, '../src/server'),
  entries: path.resolve(__dirname, '../src/entries'),
  sfc: path.resolve(__dirname, '../src/sfc')
}
```

很显然，这里 `web` 对应的真实的路径是 `path.resolve(__dirname, '../src/platforms/web')`，这个路径就找到了 Vue.js 源码的 web 目录。然后 `resolve` 函数通过 `path.resolve(aliases[base], p.slice(base.length + 1))` 找到了最终路径，它就是 Vue.js 源码 web 目录下的 `entry-runtime.js`。因此，`web-runtime-cjs` 配置对应的入口文件就找到了。

它经过 Rollup 的构建打包后，最终会在 dist 目录下生成 `vue.runtime.common.js`。

### Runtime Only VS Runtime + Compiler

通常我们利用 vue-cli 去初始化我们的 Vue.js 项目的时候会询问我们用 Runtime Only 版本的还是 Runtime + Compiler 版本。下面我们来对比这两个版本。

- Runtime Only

我们在使用 Runtime Only 版本的 Vue.js 的时候，通常需要借助如 webpack 的 vue-loader 工具把 .vue 文件编译成 JavaScript，因为是在编译阶段做的，所以它只包含运行时的 Vue.js 代码，因此代码体积也会更轻量。

- Runtime + Compiler

我们如果没有对代码做预编译，但又使用了 Vue 的 template 属性并传入一个字符串，则需要在客户端编译模板，如下所示：

```js
// 需要编译器的版本
new Vue({
  template: '<div>{{ hi }}</div>'
})

// 这种情况不需要
new Vue({
  render (h) {
    return h('div', this.hi)
  }
})
```

因为在 Vue.js 2.0 中，最终渲染都是通过 `render` 函数，如果写 `template` 属性，则需要编译成 `render` 函数，那么这个编译过程会发生运行时，所以需要带有编译器的版本。

很显然，这个编译过程对性能会有一定损耗，所以通常我们更推荐使用 Runtime-Only 的 Vue.js

## 从入口开始

我们之前提到过 Vue.js 构建过程，在 web 应用下，我们来分析 Runtime + Compiler 构建出来的 Vue.js，它的入口是 `src/platforms/web/entry-runtime-with-compiler.js`：

```js
/* @flow */

import config from 'core/config'
import { warn, cached } from 'core/util/index'
import { mark, measure } from 'core/util/perf'

import Vue from './runtime/index'
import { query } from './util/index'
import { compileToFunctions } from './compiler/index'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'

const idToTemplate = cached(id => {
  const el = query(id)
  return el && el.innerHTML
})

const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      const { render, staticRenderFns } = compileToFunctions(template, {
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)
}

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

Vue.compile = compileToFunctions

export default Vue
```

那么，当我们的代码执行 `import Vue from 'vue'` 的时候，就是从这个入口执行代码来初始化 Vue， 那么 Vue 到底是什么，它是怎么初始化的，我们来一探究竟。

### Vue 的入口

在这个入口 JS 的上方我们可以找到 `Vue` 的来源：`import Vue from './runtime/index'`，我们先来看一下这块儿的实现，它定义在 `src/platforms/web/runtime/index.js` 中：

```js
import Vue from 'core/index'
import config from 'core/config'
import { extend, noop } from 'shared/util'
import { mountComponent } from 'core/instance/lifecycle'
import { devtools, inBrowser, isChrome } from 'core/util/index'

import {
  query,
  mustUseProp,
  isReservedTag,
  isReservedAttr,
  getTagNamespace,
  isUnknownElement
} from 'web/util/index'

import { patch } from './patch'
import platformDirectives from './directives/index'
import platformComponents from './components/index'

// install platform specific utils
Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isReservedAttr = isReservedAttr
Vue.config.getTagNamespace = getTagNamespace
Vue.config.isUnknownElement = isUnknownElement

// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives)
extend(Vue.options.components, platformComponents)

// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop

// public mount method
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}

// ...

export default Vue
```

这里关键的代码是 `import Vue from 'core/index'`，之后的逻辑都是对 Vue 这个对象做一些扩展，可以先不用看，我们来看一下真正初始化 Vue 的地方，在 `src/core/index.js` 中：

```js
import Vue from './instance/index'
import { initGlobalAPI } from './global-api/index'
import { isServerRendering } from 'core/util/env'
import { FunctionalRenderContext } from 'core/vdom/create-functional-component'

initGlobalAPI(Vue)

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
})

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
})

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
})

Vue.version = '__VERSION__'

export default Vue
```

这里有 2 处关键的代码，`import Vue from './instance/index'` 和 `initGlobalAPI(Vue)`，初始化全局 Vue API（我们稍后介绍），我们先来看第一部分，在 `src/core/instance/index.js` 中：

### Vue 的定义

```js
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  //传入options
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
```

在这里，我们终于看到了 Vue 的庐山真面目，它实际上就是一个用 Function 实现的类，我们只能通过 `new Vue` 去实例化它。

有些同学看到这不禁想问，为何 Vue 不用 ES6 的 Class 去实现呢？我们往后看这里有很多 `xxxMixin` 的函数调用，并把 `Vue` 当参数传入，它们的功能都是给 Vue 的 prototype 上扩展一些方法（这里具体的细节会在之后的文章介绍，这里不展开），Vue 按功能把这些扩展分散到多个模块中去实现，而不是在一个模块里实现所有，这种方式是用 Class 难以实现的。这么做的好处是非常方便代码的维护和管理，这种编程技巧也非常值得我们去学习。

### `initGlobalAPI`

Vue.js 在整个初始化过程中，除了给它的原型 prototype 上扩展方法，还会给 `Vue` 这个对象本身扩展全局的静态方法，它的定义在 `src/core/global-api/index.js` 中：

```js
export function initGlobalAPI (Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue

  extend(Vue.options.components, builtInComponents)

  initUse(Vue)
  initMixin(Vue)
  initExtend(Vue)
  initAssetRegisters(Vue)
}
```

这里就是在 **Vue 上扩展的一些全局方法的定义**，Vue 官网中关于全局 API 都可以在这里找到，这里不会介绍细节，会在之后的章节我们具体介绍到某个 API 的时候会详细介绍。有一点要注意的是，**`Vue.util` 暴露的方法最好不要依赖，因为它可能经常会发生变化，是不稳定的**。

### 总结

1.Vue 实际上就是一个用 Function 实现的类，我们只能通过 `new Vue` 去实例化它

2.`xxxMixin` 的函数调用，并把 `Vue` 当参数传入，它们的功能都是给 Vue 的 prototype 上扩展一些方法

Vue 按功能把这些扩展分散到多个模块中去实现，而不是在一个模块里实现所有，这种方式是用 Class 难以实现的。这么做的好处是非常方便代码的维护和管理

3.Vue在整个初始化过程中，除了给它的原型 prototype 上扩展方法，还会给 `Vue` 这个对象本身扩展全局的静态方法，



## 数据驱动

Vue.js 一个**核心思想是数据驱动**。所谓**数据驱动，是指视图是由数据驱动生成的，我们对视图的修改，不会直接操作 DOM，而是通过修改数据**。它相比我们传统的前端开发，如使用 jQuery 等前端库直接修改 DOM，大大简化了代码量。特别是当交互复杂的时候，只关心数据的修改会让代码的逻辑变的非常清晰，因为 DOM 变成了数据的映射，我们所有的逻辑都是对数据的修改，而不用碰触 DOM，这样的代码非常利于维护。

### new Vue 发生了什么

从入口代码开始分析，我们先来分析 `new Vue` 背后发生了哪些事情。我们都知道，`new` 关键字在 Javascript 语言中代表实例化是一个对象，而 `Vue` 实际上是一个类，类在 Javascript 中是用 Function 来实现的，来看一下源码，在`src/core/instance/index.js` 中。

```js
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```

可以看到 **`Vue` 只能通过 new 关键字初始化，然后会调用 `this._init` 方法**， 该方法在 `src/core/instance/init.js` 中定义。

```js
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
   //判断是否存在el属性 存在就进行挂载
  if (vm.$options.el) {
    vm.$mount(vm.$options.el)
  }
}
```

Vue 初始化主要就干了几件事情，**合并配置，初始化生命周期，初始化事件中心，初始化渲染，初始化 data、props、computed、watcher** 等等

Vue 的初始化逻辑写的非常清楚，**把不同的功能逻辑拆成一些单独的函数执行**，让主线逻辑一目了然

由于我们这一章的目标是弄清楚模板和数据如何渲染成最终的 DOM，所以各种初始化逻辑我们先不看。在初始化的最后，**检测到如果有 `el` 属性，则调用 `vm.$mount` 方法挂载 `vm`，挂载的目标就是把模板渲染成最终的 DOM**

### Vue 实例挂载的实现

Vue 中我们是通过 `$mount` 实例方法去挂载 `vm` 的，`$mount` 方法在多个文件中都有定义，如 `src/platform/web/entry-runtime-with-compiler.js`、`src/platform/web/runtime/index.js`、`src/platform/weex/runtime/index.js`。因为 `$mount` 这个方法的实现是和平台、构建方式都相关的。接下来我们重点分析**带** `compiler` 版本的 `$mount` 实现，因为抛开 webpack 的 vue-loader，我们在纯前端浏览器环境分析 Vue 的工作原理，有助于我们对原理理解的深入。

`compiler` 版本的 `$mount` 实现非常有意思，先来看一下 `src/platform/web/entry-runtime-with-compiler.js` 文件中定义：

```js
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      const { render, staticRenderFns } = compileToFunctions(template, {
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)
}
```

这段代码首先缓存了原型上的 `$mount` 方法，再重新定义该方法，我们先来分析这段代码。

首先，它对 `el` 做了限制，Vue 不能挂载在 `body`、`html` 这样的根节点上。 **如果没有定义 `render` 方法，则会把 `el` 或者 `template` 字符串转换成 `render` 方法**。在 Vue 2.0 版本中，**所有 Vue 的组件的渲染最终都需要 `render` 方法，无论我们是用单文件 .vue 方式开发组件，还是写了 `el` 或者 `template` 属性，最终都会转换成 `render` 方法**，那么这个过程是 Vue 的一个“在线编译”的过程，它是调用 `compileToFunctions` 方法实现的，编译过程我们之后会介绍。**最后，调用原先原型上的 `$mount` 方法挂载**。

原先原型上的 `$mount` 方法在 `src/platform/web/runtime/index.js` 中定义，之所以这么设计完全是为了复用，因为它是可以被 `runtime only` 版本的 Vue 直接使用的。

```js
// public mount method
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```

`$mount` 方法支持传入 2 个参数，第一个是 `el`，它表示挂载的元素，可以是字符串，也可以是 DOM 对象，如果是字符串在浏览器环境下会调用 `query` 方法转换成 DOM 对象的。第二个参数是和服务端渲染相关，在浏览器环境下我们不需要传第二个参数。

`$mount` 方法实际上会去调用 `mountComponent` 方法，这个方法定义在 `src/core/instance/lifecycle.js` 文件中：

 ```js
 export function mountComponent (
   vm: Component,
   el: ?Element,
   hydrating?: boolean
 ): Component {
   vm.$el = el
   if (!vm.$options.render) {
     vm.$options.render = createEmptyVNode
     if (process.env.NODE_ENV !== 'production') {
       /* istanbul ignore if */
       if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
         vm.$options.el || el) {
         warn(
           'You are using the runtime-only build of Vue where the template ' +
           'compiler is not available. Either pre-compile the templates into ' +
           'render functions, or use the compiler-included build.',
           vm
         )
       } else {
         warn(
           'Failed to mount component: template or render function not defined.',
           vm
         )
       }
     }
   }
   callHook(vm, 'beforeMount')
 
   let updateComponent
   /* istanbul ignore if */
   if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
     updateComponent = () => {
       const name = vm._name
       const id = vm._uid
       const startTag = `vue-perf-start:${id}`
       const endTag = `vue-perf-end:${id}`
 
       mark(startTag)
       const vnode = vm._render()
       mark(endTag)
       measure(`vue ${name} render`, startTag, endTag)
 
       mark(startTag)
       vm._update(vnode, hydrating)
       mark(endTag)
       measure(`vue ${name} patch`, startTag, endTag)
     }
   } else {
     updateComponent = () => {
       vm._update(vm._render(), hydrating)
     }
   }
 
   // we set this to vm._watcher inside the watcher's constructor
   // since the watcher's initial patch may call $forceUpdate (e.g. inside child
   // component's mounted hook), which relies on vm._watcher being already defined
   new Watcher(vm, updateComponent, noop, {
     before () {
       if (vm._isMounted) {
         callHook(vm, 'beforeUpdate')
       }
     }
   }, true /* isRenderWatcher */)
   hydrating = false
 
   // manually mounted instance, call mounted on self
   // mounted is called for render-created child components in its inserted hook
   if (vm.$vnode == null) {
     vm._isMounted = true
     callHook(vm, 'mounted')
         }
  return vm
}
 ```

从上面的代码可以看到，**`mountComponent` 核心就是先实例化一个渲染`Watcher`，在它的回调函数中会调用 `updateComponent` 方法，在此方法中调用 `vm._render` 方法先生成虚拟 Node，最终调用 `vm._update` 更新 DOM**。

`Watcher` 在这里起到两个作用，一个是初始化的时候会执行回调函数，另一个是当 vm 实例中的监测的数据发生变化的时候执行回调函数，这块儿我们会在之后的章节中介绍。

函数最后判断为根节点的时候设置 `vm._isMounted` 为 `true`， 表示这个实例已经挂载了，同时执行 `mounted` 钩子函数。 这里注意 `vm.$vnode` 表示 Vue 实例的父虚拟 Node，所以它为 `Null` 则表示当前是根 Vue 的实例。

### render

Vue 的 `_render` 方法是实例的一个私有方法，它用来把实例渲染成一个虚拟 Node。它的定义在 `src/core/instance/render.js` 文件中：

```js
Vue.prototype._render = function (): VNode {
  const vm: Component = this
  const { render, _parentVnode } = vm.$options

  // reset _rendered flag on slots for duplicate slot check
  if (process.env.NODE_ENV !== 'production') {
    for (const key in vm.$slots) {
      // $flow-disable-line
      vm.$slots[key]._rendered = false
    }
  }

  if (_parentVnode) {
    vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject
  }

  // set parent vnode. this allows render functions to have access
  // to the data on the placeholder node.
  vm.$vnode = _parentVnode
  // render self
  let vnode
  try {
    vnode = render.call(vm._renderProxy, vm.$createElement)
  } catch (e) {
    handleError(e, vm, `render`)
    // return error render result,
    // or previous vnode to prevent render error causing blank component
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      if (vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
        } catch (e) {
          handleError(e, vm, `renderError`)
          vnode = vm._vnode
        }
      } else {
        vnode = vm._vnode
      }
    } else {
      vnode = vm._vnode
    }
  }
  // return empty vnode in case the render function errored out
  if (!(vnode instanceof VNode)) {
    if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
      warn(
        'Multiple root nodes returned from render function. Render function ' +
        'should return a single root node.',
        vm
      )
    }
    vnode = createEmptyVNode()
  }
  // set parent
  vnode.parent = _parentVnode
  return vnode
}
```

这段代码最关键的是 `render` 方法的调用，我们在平时的开发工作中手写 `render` 方法的场景比较少，而写的比较多的是 `template` 模板，**在之前的 `mounted` 方法的实现中，会把 `template` 编译成 `render` 方法**，但这个编译过程是非常复杂的，我们不打算在这里展开讲，之后会专门花一个章节来分析 Vue 的编译过程。

在 Vue 的官方文档中介绍了 `render` 函数的第一个参数是 `createElement`，那么结合之前的例子：

```html
<div id="app">
  {{ message }}
</div>
```

相当于我们编写如下 `render` 函数：

```js
render: function (createElement) {
  return createElement('div', {
     attrs: {
        id: 'app'
      },
  }, this.message)
}
```

再回到 `_render` 函数中的 `render` 方法的调用：

```js
vnode = render.call(vm._renderProxy, vm.$createElement)
```

可以看到，`render` 函数中的 `createElement` 方法就是 `vm.$createElement` 方法：

```js
export function initRender (vm: Component) {
  // ...
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
}
```

实际上，`vm.$createElement` 方法定义是在执行 `initRender` 方法的时候，可以看到除了 `vm.$createElement` 方法，还有一个 `vm._c` 方法，它是被模板编译成的 `render` 函数使用，而 `vm.$createElement` 是用户手写 `render` 方法使用的， 这俩个方法支持的参数相同，并且内部都调用了 `createElement` 方法

`vm._render` 最终是通过执行 `createElement` 方法并返回的是 `vnode`，它是一个虚拟 Node。Vue 2.0 相比 Vue 1.0 最大的升级就是利用了 Virtual DOM。

Virtual DOM 这个概念相信大部分人都不会陌生，它产生的前提是浏览器中的 DOM 是很“昂贵"的，为了更直观的感受，我们可以简单的把一个简单的 div 元素的属性都打印出来，如图所示：

![img](https://ustbhuangyi.github.io/vue-analysis/assets/dom.png)

可以看到，真正的 DOM 元素是非常庞大的，因为浏览器的标准就把 DOM 设计的非常复杂。当我们频繁的去做 DOM 更新，会产生一定的性能问题。

而 Virtual DOM 就是用一个原生的 JS 对象去描述一个 DOM 节点，所以它比创建一个 DOM 的代价要小很多。在 Vue.js 中，Virtual DOM 是用 `VNode` 这么一个 Class 去描述，它是定义在 `src/core/vdom/vnode.js` 中的。

```js
export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  fnScopeId: ?string; // functional scope id support

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}
```

可以看到 Vue.js 中的 Virtual DOM 的定义还是略微复杂一些的，因为它这里包含了很多 Vue.js 的特性。这里千万不要被这些茫茫多的属性吓到，实际上 Vue.js 中 Virtual DOM 是借鉴了一个开源库 [snabbdom](https://github.com/snabbdom/snabbdom) 的实现，然后加入了一些 Vue.js 特色的东西。

其实 VNode 是对真实 DOM 的一种抽象描述，它的核心定义无非就几个关键属性，标签名、数据、子节点、键值等，其它属性都是用来扩展 VNode 的灵活性以及实现一些特殊 feature 的。由于 VNode 只是用来映射到真实 DOM 的渲染，不需要包含操作 DOM 的方法，因此它是非常轻量和简单的。

Virtual DOM 除了它的数据结构的定义，映射到真实的 DOM 实际上要经历 VNode 的 create、diff、patch 等过程。在 Vue.js 中，VNode 的 create 是通过之前提到的 `createElement` 方法创建的

### createElement

Vue.js 利用 createElement 方法创建 VNode，它定义在 `src/core/vdom/create-element.js` 中：

```js
// wrapper function for providing a more flexible interface
// without getting yelled at by flow
export function createElement (
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
  return _createElement(context, tag, data, children, normalizationType)
}
```

`createElement` 方法实际上是对 `_createElement` 方法的封装，它允许传入的参数更加灵活，在处理这些参数后，调用真正创建 VNode 的函数 `_createElement`：

```js
export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  if (isDef(data) && isDef((data: any).__ob__)) {
    process.env.NODE_ENV !== 'production' && warn(
      `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
      'Always create fresh vnode data objects in each render!',
      context)
    return createEmptyVNode()
  }

```

```js
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (process.env.NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    if (!__WEEX__ || !('@binding' in data.key)) {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      )
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {}
    data.scopedSlots = { default: children[0] }
    children.length = 0
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children)
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children)
  }
  let vnode, ns
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children)
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) applyNS(vnode, ns)
    if (isDef(data)) registerDeepBindings(data)
    return vnode
  } else {
    return createEmptyVNode()
  }
}
```

`_createElement` 方法有 5 个参数，`context` 表示 VNode 的上下文环境，它是 `Component` 类型；`tag` 表示标签，它可以是一个字符串，也可以是一个 `Component`；`data` 表示 VNode 的数据，它是一个 `VNodeData` 类型，可以在 `flow/vnode.js` 中找到它的定义，这里先不展开说；`children` 表示当前 VNode 的子节点，它是任意类型的，它接下来需要被规范为标准的 VNode 数组；`normalizationType` 表示子节点规范的类型，类型不同规范的方法也就不一样，它主要是参考 `render` 函数是编译生成的还是用户手写的。

`createElement` 函数的流程略微有点多，我们接下来主要分析 2 个重点的流程 —— `children` 的规范化以及 VNode 的创建。

### children 的规范化

由于 Virtual DOM 实际上是一个树状结构，每一个 VNode 可能会有若干个子节点，这些子节点应该也是 VNode 的类型。`_createElement` 接收的第 4 个参数 children 是任意类型的，因此我们需要把它们规范成 VNode 类型。

这里根据 `normalizationType` 的不同，调用了 `normalizeChildren(children)` 和 `simpleNormalizeChildren(children)` 方法，它们的定义都在 `src/core/vdom/helpers/normalzie-children.js` 中：

```js
// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
export function simpleNormalizeChildren (children: any) {
  for (let i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
export function normalizeChildren (children: any): ?Array<VNode> {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}
```

`simpleNormalizeChildren` 方法调用场景是 `render` 函数是编译生成的。理论上编译生成的 `children` 都已经是 VNode 类型的，但这里有一个例外，就是 `functional component` 函数式组件返回的是一个数组而不是一个根节点，所以会通过 `Array.prototype.concat` 方法把整个 `children` 数组打平，让它的深度只有一层。

`normalizeChildren` 方法的调用场景有 2 种，一个场景是 `render` 函数是用户手写的，当 `children` 只有一个节点的时候，Vue.js 从接口层面允许用户把 `children` 写成基础类型用来创建单个简单的文本节点，这种情况会调用 `createTextVNode` 创建一个文本节点的 VNode；另一个场景是当编译 `slot`、`v-for` 的时候会产生嵌套数组的情况，会调用 `normalizeArrayChildren` 方法，接下来看一下它的实现：

```js
function normalizeArrayChildren (children: any, nestedIndex?: string): Array<VNode> {
  const res = []
  let i, c, lastIndex, last
  for (i = 0; i < children.length; i++) {
    c = children[i]
    if (isUndef(c) || typeof c === 'boolean') continue
    lastIndex = res.length - 1
    last = res[lastIndex]
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, `${nestedIndex || ''}_${i}`)
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]: any).text)
          c.shift()
        }
        res.push.apply(res, c)
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c)
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c))
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text)
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = `__vlist${nestedIndex}_${i}__`
        }
        res.push(c)
      }
    }
  }
  return res
}
```

`normalizeArrayChildren` 接收 2 个参数，`children` 表示要规范的子节点，`nestedIndex` 表示嵌套的索引，因为单个 `child` 可能是一个数组类型。 `normalizeArrayChildren` 主要的逻辑就是遍历 `children`，获得单个节点 `c`，然后对 `c` 的类型判断，如果是一个数组类型，则递归调用 `normalizeArrayChildren`; 如果是基础类型，则通过 `createTextVNode` 方法转换成 VNode 类型；否则就已经是 VNode 类型了，如果 `children` 是一个列表并且列表还存在嵌套的情况，则根据 `nestedIndex` 去更新它的 key。这里需要注意一点，在遍历的过程中，对这 3 种情况都做了如下处理：如果存在两个连续的 `text` 节点，会把它们合并成一个 `text` 节点。

经过对 `children` 的规范化，`children` 变成了一个类型为 VNode 的 Array。

### VNode 的创建

回到 `createElement` 函数，规范化 `children` 后，接下来会去创建一个 VNode 的实例：

```js
let vnode, ns
if (typeof tag === 'string') {
  let Ctor
  ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
  if (config.isReservedTag(tag)) {
    // platform built-in elements
    vnode = new VNode(
      config.parsePlatformTagName(tag), data, children,
      undefined, undefined, context
    )
  } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
    // component
    vnode = createComponent(Ctor, data, context, children, tag)
  } else {
    // unknown or unlisted namespaced elements
    // check at runtime because it may get assigned a namespace when its
    // parent normalizes children
    vnode = new VNode(
      tag, data, children,
      undefined, undefined, context
    )
  }
} else {
  // direct component options / constructor
  vnode = createComponent(tag, data, context, children)
}
```

这里先对 `tag` 做判断，如果是 `string` 类型，则接着判断如果是内置的一些节点，则直接创建一个普通 VNode，如果是为已注册的组件名，则通过 `createComponent` 创建一个组件类型的 VNode，否则创建一个未知的标签的 VNode。 如果是 `tag` 一个 `Component` 类型，则直接调用 `createComponent` 创建一个组件类型的 VNode 节点。对于 `createComponent` 创建组件类型的 VNode 的过程，我们之后会去介绍，本质上它还是返回了一个 VNode。



每个 VNode 有 `children`，`children` 每个元素也是一个 VNode，这样就形成了一个 VNode Tree，它很好的描述了我们的 DOM Tree。

回到 `mountComponent` 函数的过程，我们已经知道 `vm._render` 是如何创建了一个 VNode，接下来就是要把这个 VNode 渲染成一个真实的 DOM 并渲染出来，这个过程是通过 `vm._update` 完成的

### update

Vue 的 `_update` 是实例的一个私有方法，它被调用的时机有 2 个，一个是首次渲染，一个是数据更新的时候；由于我们这一章节只分析首次渲染部分，数据更新部分会在之后分析响应式原理的时候涉及。`_update` 方法的作用是把 VNode 渲染成真实的 DOM，它的定义在 `src/core/instance/lifecycle.js` 中：

```js
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this
  const prevEl = vm.$el
  const prevVnode = vm._vnode
  const prevActiveInstance = activeInstance
  activeInstance = vm
  vm._vnode = vnode
  // Vue.prototype.__patch__ is injected in entry points
  // based on the rendering backend used.
  if (!prevVnode) {
    // initial render
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
  } else {
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
  activeInstance = prevActiveInstance
  // update __vue__ reference
  if (prevEl) {
    prevEl.__vue__ = null
  }
  if (vm.$el) {
    vm.$el.__vue__ = vm
  }
  // if parent is an HOC, update its $el as well
  if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
    vm.$parent.$el = vm.$el
  }
  // updated hook is called by the scheduler to ensure that children are
  // updated in a parent's updated hook.
}
```

`_update` 的核心就是调用 `vm.__patch__` 方法，这个方法实际上在不同的平台，比如 web 和 weex 上的定义是不一样的，因此在 web 平台中它的定义在 `src/platforms/web/runtime/index.js` 中：

```js
Vue.prototype.__patch__ = inBrowser ? patch : noop
```

可以看到，甚至在 web 平台上，是否是服务端渲染也会对这个方法产生影响。因为在服务端渲染中，没有真实的浏览器 DOM 环境，所以不需要把 VNode 最终转换成 DOM，因此是一个空函数，而在浏览器端渲染中，它指向了 `patch` 方法，它的定义在 `src/platforms/web/runtime/patch.js`中：

```js
import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'web/runtime/modules/index'

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules)

export const patch: Function = createPatchFunction({ nodeOps, modules })
```

该方法的定义是调用 `createPatchFunction` 方法的返回值，这里传入了一个对象，包含 `nodeOps` 参数和 `modules` 参数。其中，`nodeOps` 封装了一系列 DOM 操作的方法，`modules` 定义了一些模块的钩子函数的实现，我们这里先不详细介绍，来看一下 `createPatchFunction` 的实现，它定义在 `src/core/vdom/patch.js` 中：

```js
const hooks = ['create', 'activate', 'update', 'remove', 'destroy']

export function createPatchFunction (backend) {
  let i, j
  const cbs = {}

  const { modules, nodeOps } = backend

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = []
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]])
      }
    }
  }

  // ...

  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
      return
    }

    let isInitialPatch = false
    const insertedVnodeQueue = []

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true
      createElm(vnode, insertedVnodeQueue)
    } else {
      const isRealElement = isDef(oldVnode.nodeType)
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR)
            hydrating = true
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true)
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              )
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode)
        }

        // replacing existing element
        const oldElm = oldVnode.elm
        const parentElm = nodeOps.parentNode(oldElm)

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        )

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          let ancestor = vnode.parent
          const patchable = isPatchable(vnode)
          while (ancestor) {
            for (let i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor)
            }
            ancestor.elm = vnode.elm
            if (patchable) {
              for (let i = 0; i < cbs.create.length; ++i) {
                cbs.create[i](emptyNode, ancestor)
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              const insert = ancestor.data.hook.insert
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (let i = 1; i < insert.fns.length; i++) {
                  insert.fns[i]()
                }
              }
            } else {
              registerRef(ancestor)
            }
            ancestor = ancestor.parent
          }
        }

        // destroy old node
        if (isDef(parentElm)) {
          removeVnodes(parentElm, [oldVnode], 0, 0)
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode)
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
    return vnode.elm
  }
}
```

`createPatchFunction` 内部定义了一系列的辅助方法，最终返回了一个 `patch` 方法，这个方法就赋值给了 `vm._update` 函数里调用的 `vm.__patch__`。

在介绍 `patch` 的方法实现之前，我们可以思考一下为何 Vue.js 源码绕了这么一大圈，把相关代码分散到各个目录。因为前面介绍过，`patch` 是平台相关的，在 Web 和 Weex 环境，它们把虚拟 DOM 映射到 “平台 DOM” 的方法是不同的，并且对 “DOM” 包括的属性模块创建和更新也不尽相同。因此每个平台都有各自的 `nodeOps` 和 `modules`，它们的代码需要托管在 `src/platforms` 这个大目录下。

而不同平台的 `patch` 的主要逻辑部分是相同的，所以这部分公共的部分托管在 `core` 这个大目录下。差异化部分只需要通过参数来区别，这里用到了一个函数柯里化的技巧，通过 `createPatchFunction` 把差异化参数提前固化，这样不用每次调用 `patch` 的时候都传递 `nodeOps` 和 `modules` 了，这种编程技巧也非常值得学习。

在这里，`nodeOps` 表示对 “平台 DOM” 的一些操作方法，`modules` 表示平台的一些模块，它们会在整个 `patch` 过程的不同阶段执行相应的钩子函数。这些代码的具体实现会在之后的章节介绍。

回到 `patch` 方法本身，它接收 4个参数，`oldVnode` 表示旧的 VNode 节点，它也可以不存在或者是一个 DOM 对象；`vnode` 表示执行 `_render` 后返回的 VNode 的节点；`hydrating` 表示是否是服务端渲染；`removeOnly` 是给 `transition-group` 用的，之后会介绍。

`patch` 的逻辑看上去相对复杂，因为它有着非常多的分支逻辑，为了方便理解，我们并不会在这里介绍所有的逻辑，仅会针对我们之前的例子分析它的执行逻辑。之后我们对其它场景做源码分析的时候会再次回顾 `patch` 方法。

先来回顾我们的例子：

```js
var app = new Vue({
  el: '#app',
  render: function (createElement) {
    return createElement('div', {
      attrs: {
        id: 'app'
      },
    }, this.message)
  },
  data: {
    message: 'Hello Vue!'
  }
})
```

然后我们在 `vm._update` 的方法里是这么调用 `patch` 方法的：

```js
// initial render
vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
```

结合我们的例子，我们的场景是首次渲染，所以在执行 `patch` 函数的时候，传入的 `vm.$el` 对应的是例子中 id 为 `app` 的 DOM 对象，这个也就是我们在 index.html 模板中写的 `<div id="app">`， `vm.$el` 的赋值是在之前 `mountComponent` 函数做的，`vnode` 对应的是调用 `render` 函数的返回值，`hydrating` 在非服务端渲染情况下为 false，`removeOnly` 为 false。

确定了这些入参后，我们回到 `patch` 函数的执行过程，看几个关键步骤。

```js
const isRealElement = isDef(oldVnode.nodeType)
if (!isRealElement && sameVnode(oldVnode, vnode)) {
  // patch existing root node
  patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
} else {
  if (isRealElement) {
    // mounting to a real element
    // check if this is server-rendered content and if we can perform
    // a successful hydration.
    if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
      oldVnode.removeAttribute(SSR_ATTR)
      hydrating = true
    }
    if (isTrue(hydrating)) {
      if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
        invokeInsertHook(vnode, insertedVnodeQueue, true)
        return oldVnode
      } else if (process.env.NODE_ENV !== 'production') {
        warn(
          'The client-side rendered virtual DOM tree is not matching ' +
          'server-rendered content. This is likely caused by incorrect ' +
          'HTML markup, for example nesting block-level elements inside ' +
          '<p>, or missing <tbody>. Bailing hydration and performing ' +
          'full client-side render.'
        )
      }
    }      
    // either not server-rendered, or hydration failed.
    // create an empty node and replace it
    oldVnode = emptyNodeAt(oldVnode)
  }

  // replacing existing element
  const oldElm = oldVnode.elm
  const parentElm = nodeOps.parentNode(oldElm)

  // create new node
  createElm(
    vnode,
    insertedVnodeQueue,
    // extremely rare edge case: do not insert if old element is in a
    // leaving transition. Only happens when combining transition +
    // keep-alive + HOCs. (#4590)
    oldElm._leaveCb ? null : parentElm,
    nodeOps.nextSibling(oldElm)
  )
}
```

由于我们传入的 `oldVnode` 实际上是一个 DOM container，所以 `isRealElement` 为 true，接下来又通过 `emptyNodeAt` 方法把 `oldVnode` 转换成 `VNode` 对象，然后再调用 `createElm` 方法，这个方法在这里非常重要，来看一下它的实现：

```js
function createElm (
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {
  if (isDef(vnode.elm) && isDef(ownerArray)) {
    // This vnode was used in a previous render!
    // now it's used as a new node, overwriting its elm would cause
    // potential patch errors down the road when it's used as an insertion
    // reference node. Instead, we clone the node on-demand before creating
    // associated DOM element for it.
    vnode = ownerArray[index] = cloneVNode(vnode)
  }

  vnode.isRootInsert = !nested // for transition enter check
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }

  const data = vnode.data
  const children = vnode.children
  const tag = vnode.tag
  if (isDef(tag)) {
    if (process.env.NODE_ENV !== 'production') {
      if (data && data.pre) {
        creatingElmInVPre++
      }
      if (isUnknownElement(vnode, creatingElmInVPre)) {
        warn(
          'Unknown custom element: <' + tag + '> - did you ' +
          'register the component correctly? For recursive components, ' +
          'make sure to provide the "name" option.',
          vnode.context
        )
      }
    }

    vnode.elm = vnode.ns
      ? nodeOps.createElementNS(vnode.ns, tag)
      : nodeOps.createElement(tag, vnode)
    setScope(vnode)

    /* istanbul ignore if */
    if (__WEEX__) {
      // ...
    } else {
      createChildren(vnode, children, insertedVnodeQueue)
      if (isDef(data)) {
        invokeCreateHooks(vnode, insertedVnodeQueue)
      }
      insert(parentElm, vnode.elm, refElm)
    }

    if (process.env.NODE_ENV !== 'production' && data && data.pre) {
      creatingElmInVPre--
    }
  } else if (isTrue(vnode.isComment)) {
    vnode.elm = nodeOps.createComment(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  } else {
    vnode.elm = nodeOps.createTextNode(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  }
}
```

`createElm` 的作用是通过虚拟节点创建真实的 DOM 并插入到它的父节点中。 我们来看一下它的一些关键逻辑，`createComponent` 方法目的是尝试创建子组件，这个逻辑在之后组件的章节会详细介绍，在当前这个 case 下它的返回值为 false；接下来判断 `vnode` 是否包含 tag，如果包含，先简单对 tag 的合法性在非生产环境下做校验，看是否是一个合法标签；然后再去调用平台 DOM 的操作去创建一个占位符元素。

```js
vnode.elm = vnode.ns
  ? nodeOps.createElementNS(vnode.ns, tag)
  : nodeOps.createElement(tag, vnode)
```

接下来调用 `createChildren` 方法去创建子元素：

```js
createChildren(vnode, children, insertedVnodeQueue)

function createChildren (vnode, children, insertedVnodeQueue) {
  if (Array.isArray(children)) {
    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(children)
    }
    for (let i = 0; i < children.length; ++i) {
      createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
    }
  } else if (isPrimitive(vnode.text)) {
    nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
  }
}
```

`createChildren` 的逻辑很简单，实际上是遍历子虚拟节点，递归调用 `createElm`，这是一种常用的深度优先的遍历算法，这里要注意的一点是在遍历过程中会把 `vnode.elm` 作为父容器的 DOM 节点占位符传入。

接着再调用 `invokeCreateHooks` 方法执行所有的 create 的钩子并把 `vnode` push 到 `insertedVnodeQueue` 中。

```js
 if (isDef(data)) {
  invokeCreateHooks(vnode, insertedVnodeQueue)
}

function invokeCreateHooks (vnode, insertedVnodeQueue) {
  for (let i = 0; i < cbs.create.length; ++i) {
    cbs.create[i](emptyNode, vnode)
  }
  i = vnode.data.hook // Reuse variable
  if (isDef(i)) {
    if (isDef(i.create)) i.create(emptyNode, vnode)
    if (isDef(i.insert)) insertedVnodeQueue.push(vnode)
  }
}
```

最后调用 `insert` 方法把 `DOM` 插入到父节点中，因为是递归调用，子元素会优先调用 `insert`，所以整个 `vnode` 树节点的插入顺序是先子后父。来看一下 `insert` 方法，它的定义在 `src/core/vdom/patch.js` 上。

```js
insert(parentElm, vnode.elm, refElm)

function insert (parent, elm, ref) {
  if (isDef(parent)) {
    if (isDef(ref)) {
      if (ref.parentNode === parent) {
        nodeOps.insertBefore(parent, elm, ref)
      }
    } else {
      nodeOps.appendChild(parent, elm)
    }
  }
}
```

`insert` 逻辑很简单，调用一些 `nodeOps` 把子节点插入到父节点中，这些辅助方法定义在 `src/platforms/web/runtime/node-ops.js` 中：

```js
export function insertBefore (parentNode: Node, newNode: Node, referenceNode: Node) {
  parentNode.insertBefore(newNode, referenceNode)
}

export function appendChild (node: Node, child: Node) {
  node.appendChild(child)
}
```

其实就是调用原生 DOM 的 API 进行 DOM 操作，看到这里，很多同学恍然大悟，原来 Vue 是这样动态创建的 DOM。

在 `createElm` 过程中，如果 `vnode` 节点不包含 `tag`，则它有可能是一个注释或者纯文本节点，可以直接插入到父元素中。在我们这个例子中，最内层就是一个文本 `vnode`，它的 `text` 值取的就是之前的 `this.message` 的值 `Hello Vue!`。

再回到 `patch` 方法，首次渲染我们调用了 `createElm` 方法，这里传入的 `parentElm` 是 `oldVnode.elm` 的父元素，在我们的例子是 id 为 `#app` div 的父元素，也就是 Body；实际上整个过程就是递归创建了一个完整的 DOM 树并插入到 Body 上。

最后，我们根据之前递归 `createElm` 生成的 `vnode` 插入顺序队列，执行相关的 `insert` 钩子函数，这部分内容我们之后会详细介绍。

### 总结

**Vue 实例挂载的实现**

1.Vue` 只能通过 new 关键字初始化，然后会调用 `this._init` 方法，Vue 初始化主要就干了几件事情，**合并配置，初始化生命周期，初始化事件中心，初始化渲染，初始化 data、props、computed、watcher**

2.在初始化的最后， 检测到如果有 `el` 属性，则调用 `vm.$mount` 方法挂载 `vm`，挂载的目标就是把模板渲染成最终的 DOM

3.通过 `$mount` 实例方法去挂载 `vm`，分析**带** `compiler` 版本的 `$mount` 实现，抛开 webpack 的 vue-loader

4.首先会缓存原型上的 `$mount` 方法，再重新定义该方法。

首先，它对 `el` 做了限制，Vue 不能挂载在 `body`、`html` 这样的根节点上。 **如果没有定义 `render` 方法，则会把 `el` 或者 `template` 字符串转换成 `render` 方法**。

在 Vue 2.0 版本中，**所有 Vue 的组件的渲染最终都需要 `render` 方法，无论我们是用单文件 .vue 方式开发组件，还是写了 `el` 或者 `template` 属性，最终都会转换成 `render` 方法**，那么这个过程是 Vue 的一个“在线编译”的过程，它是调用 `compileToFunctions` 方法实现的。**最后，调用原先原型上的 `$mount` 方法挂载**。

`$mount` 方法支持传入 2 个参数，第一个是 `el`，它表示挂载的元素，可以是字符串，也可以是 DOM 对象，如果是字符串在浏览器环境下会调用 `query` 方法转换成 DOM 对象的。第二个参数是和服务端渲染相关，在浏览器环境下我们不需要传第二个参数。`$mount` 方法实际上会去调用 `mountComponent` 方法

5.`mountComponent` 核心就是先**实例化一个**渲染`Watcher`，在它的回调函数中会调用 `updateComponent` 方法，在此方法中调用 `vm._render` 方法先生成虚拟 Node，最终调用 `vm._update` 更新 DOM。

`Watcher` 在这里起到两个作用，一个是初始化的时候会执行回调函数，另一个是当 vm 实例中的监测的数据发生变化的时候执行回调函数，

函数最后判断为根节点的时候设置 `vm._isMounted` 为 `true`， 表示这个实例已经挂载了，同时执行 `mounted` 钩子函数。 这里注意 `vm.$vnode` 表示 Vue 实例的父虚拟 Node，所以它为 `Null` 则表示当前是根 Vue 的实例

**render**

1.Vue 的 `_render` 方法是实例的一个私有方法，它用来把**实例渲染成一个虚拟 Node**

我们在平时的开发工作中手写 `render` 方法的场景比较少，而写的比较多的是 `template` 模板，在之前的 `mounted` 方法的实现中，会把 `template` 编译成 `render` 方法

2.`render` 函数的第一个参数是 `createElement` `_render` 函数中的 `render` 方法的调用：

`vnode = render.call(vm._renderProxy, vm.$createElement)`

`render` 函数中的 `createElement` 方法就是 `vm.$createElement` 方法

实际上，`vm.$createElement` 方法定义是在执行 `initRender` 方法的时候，可以看到除了 `vm.$createElement` 方法，还有一个 `vm._c` 方法，它是被`模板编译`成的 `render` 函数使用，而 `vm.$createElement` 是用户手写 `render` 方法使用的， 这俩个方法支持的参数相同，并且内部都调用了 `createElement` 方法

3.vm._render` 最终是通过执行 `createElement` 方法并返回的是 `vnode

**Virtual DOM**

Virtual DOM 就是用一个原生的 JS 对象去描述一个 DOM 节点，所以它比创建一个 DOM 的代价要小很多

在 Vue.js 中，Virtual DOM 是用 `VNode` 一个 Class 去描述

它的核心定义无非就几个关键属性，标签名、数据、子节点、键值等，其它属性都是用来扩展 VNode 的灵活性以及实现一些特殊 feature 的。由于 VNode 只是用来映射到真实 DOM 的渲染，不需要包含操作 DOM 的方法

**createElement**

1.利用 createElement 方法创建 VNode，`createElement` 方法实际上是对 `_createElement` 方法的封装，它允许传入的参数更加灵活，在处理这些参数后，调用真正创建 VNode 的函数 `_createElement

2.`_createElement` 方法有 5 个参数，

`context` 表示 VNode 的上下文环境，它是 `Component` 类型；

`tag` 表示标签，它可以是一个字符串，也可以是一个 `Component`；

`data` 表示 VNode 的数据，它是一个 `VNodeData` 类型，可以在 `flow/vnode.js` 中找到它的定义；

`children` 表示当前 VNode 的子节点，它是任意类型的，它接下来需要被规范为标准的 VNode 数组；

`normalizationType` 表示子节点规范的类型，类型不同规范的方法也就不一样，它主要是参考 `render` 函数是编译生成的还是用户手写的。

**children 的规范化**

1.Virtual DOM 实际上是一个树状结构，每一个 VNode 可能会有若干个子节点，这些子节点应该也是 VNode 的类型

2.`_createElement` 接收的第 4 个参数 children 是任意类型的，需要把它们规范成 VNode 类型

3.根据 `normalizationType` 的不同，调用了 `normalizeChildren(children)` 和 `simpleNormalizeChildren(children)` 方法

4.`simpleNormalizeChildren` 方法调用场景是 `render` 函数是编译生成的。理论上编译生成的 `children` 都已经是 VNode 类型的，但这里有一个例外，就是 `functional component` 函数式组件返回的是一个数组而不是一个根节点，所以会通过 `Array.prototype.concat` 方法把整个 `children` 数组打平，让它的深度只有一层

5.`normalizeChildren` 方法的调用场景有 2 种，一个场景是 `render` 函数是用户手写的，当 `children` 只有一个节点的时候，Vue.js 从接口层面允许用户把 `children` 写成基础类型用来创建单个简单的文本节点，这种情况会调用 `createTextVNode` 创建一个文本节点的 VNode；另一个场景是当编译 `slot`、`v-for` 的时候会产生嵌套数组的情况，会调用 `normalizeArrayChildren` 方法

6.`normalizeArrayChildren` 接收 2 个参数，`children` 表示要规范的子节点，`nestedIndex` 表示嵌套的索引，因为单个 `child` 可能是一个数组类型。 `normalizeArrayChildren` 主要的逻辑就是遍历 `children`，获得单个节点 `c`，然后对 `c` 的类型判断，如果是一个数组类型，则递归调用 `normalizeArrayChildren`; 如果是基础类型，则通过 `createTextVNode` 方法转换成 VNode 类型；否则就已经是 VNode 类型了，如果 `children` 是一个列表并且列表还存在嵌套的情况，则根据 `nestedIndex` 去更新它的 key。这里需要注意一点，在遍历的过程中，对这 3 种情况都做了如下处理：如果存在两个连续的 `text` 节点，会把它们合并成一个 `text` 节点。

经过对 `children` 的规范化，`children` 变成了一个类型为 VNode 的 Array

**VNode 的创建**

1.在`createElement` 函数，规范化 `children` 后，接下来会去创建一个 VNode 的实例

2.先对 `tag` 做判断，如果是 `string` 类型，则接着判断如果是内置的一些节点，则直接创建一个普通 VNode，如果是为已注册的组件名，则通过 `createComponent` 创建一个组件类型的 VNode，否则创建一个未知的标签的 VNode。 如果是 `tag` 一个 `Component` 类型，则直接调用 `createComponent` 创建一个组件类型的 VNode 节点。对于 `createComponent` 创建组件类型的 VNode 的过程，本质上它还是返回了一个 VNode

 `createElement` 创建 VNode 的过程，每个 VNode 有 `children`，`children` 每个元素也是一个 VNode，这样就形成了一个 VNode Tree，它很好的描述了我们的 DOM Tree

`mountComponent` 函数的过程，我们已经知道 `vm._render` 是如何创建了一个 VNode，接下来就是要把这个 VNode 渲染成一个真实的 DOM 并渲染出来，这个过程是通过 `vm._update` 完成的

**update**

1.Vue 的 `_update` 是实例的一个私有方法，它被调用的时机有 2 个，一个是首次渲染，一个是数据更新的时候

分析首次渲染部分，数据更新部分会在之后分析响应式原理的时候涉及

2.`_update` 的核心就是调用 `vm.__patch__` 方法，这个方法实际上在不同的平台，比如 web 和 weex 上的定义是不一样的，是否是服务端渲染也会对这个方法产生影响，没有真实的浏览器 DOM 环境，所以不需要把 VNode 最终转换成 DOM，因此是一个空函数，而在浏览器端渲染中，它指向了 `patch` 方法

3.调用 `createPatchFunction` 方法的返回值，这里传入了一个对象，包含 `nodeOps` 参数和 `modules` 参数

`nodeOps` 封装了一系列 DOM 操作的方法，`modules` 定义了一些模块的钩子函数的实现

4.`createPatchFunction` 内部定义了一系列的辅助方法，最终返回了一个 `patch` 方法，这个方法就赋值给了 `vm._update` 函数里调用的 `vm.__patch__`

5.Vue.js 把相关代码分散到各个目录,`patch` 是平台相关的，在 Web 和 Weex 环境，它们把虚拟 DOM 映射到 “平台 DOM” 的方法是不同的，并且对 “DOM” 包括的属性模块创建和更新也不尽相同。因此每个平台都有各自的 `nodeOps` 和 `modules

不同平台的 `patch` 的主要逻辑部分是相同的，所以这部分公共的部分托管在 `core` 这个大目录下。差异化部分只需要通过参数来区别，这里用到了一个函数柯里化的技巧，通过 `createPatchFunction` 把差异化参数提前固化，这样不用每次调用 `patch` 的时候都传递 `nodeOps` 和 `modules` 了

**更新例子**

1.在 `vm._update` 的方法里是这么调用 `patch` 方法  `vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)`

2.场景是首次渲染，所以在执行 `patch` 函数的时候，传入的 `vm.$el` 对应的是例子中 id 为 `app` 的 DOM 对象

在 index.html 模板中写的 `<div id="app">`， `vm.$el` 的赋值是在之前 `mountComponent` 函数做的，**`vnode` 对应的是调用 `render` 函数的返回值**，`hydrating` 在非服务端渲染情况下为 false，`removeOnly` 为 false

3.`patch` 函数的执行过程,  传入的 `oldVnode` 实际上是一个 DOM container，所以 `isRealElement` 为 true，接下来又通过 `emptyNodeAt` 方法把 `oldVnode` 转换成 `VNode` 对象，然后再调用 `createElm` 方法

4.`createElm` 的作用是通过虚拟节点创建真实的 DOM 并插入到它的父节点中,`createComponent` 方法目的是尝试创建子组件,在当前这个 case 下它的返回值为 false；接下来判断 `vnode` 是否包含 tag，如果包含，先简单对 tag 的合法性在非生产环境下做校验，看是否是一个合法标签；然后再去调用平台 DOM 的操作去创建一个占位符元素

5.调用 `createChildren` 方法去创建子元素,`createChildren` 的逻辑很简单，实际上是遍历子虚拟节点，递归调用 `createElm`，这是一种常用的深度优先的遍历算法，这里要注意的一点是在遍历过程中会把 `vnode.elm` 作为父容器的 DOM 节点占位符传入。

6.接着再调用 `invokeCreateHooks` 方法执行所有的 create 的钩子并把 `vnode` push 到 `insertedVnodeQueue` 中

7.最后调用 `insert` 方法把 `DOM` 插入到父节点中，因为是递归调用，子元素会优先调用 `insert`，所以整个 `vnode` 树节点的插入顺序是先子后父,`insert` 逻辑很简单，调用一些 `nodeOps` 把子节点插入到父节点中

其实就是调用原生 DOM 的 API 进行 DOM 操作

在 `createElm` 过程中，如果 `vnode` 节点不包含 `tag`，则它有可能是一个注释或者纯文本节点，可以直接插入到父元素中。在我们这个例子中，最内层就是一个文本 `vnode`，它的 `text` 值取的就是之前的 `this.message` 的值 `Hello Vue!`。

再回到 `patch` 方法，首次渲染我们调用了 `createElm` 方法，这里传入的 `parentElm` 是 `oldVnode.elm` 的父元素，在我们的例子是 id 为 `#app` div 的父元素，也就是 Body；实际上整个过程就是递归创建了一个完整的 DOM 树并插入到 Body 上。

最后，我们根据之前递归 `createElm` 生成的 `vnode` 插入顺序队列，执行相关的 `insert` 钩子函数



那么至此我们从主线上把模板和数据如何渲染成最终的 DOM 的过程分析完毕了，我们可以通过下图更直观地看到从初始化 Vue 到最终渲染的整个过程。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/new-vue.png)

我们这里只是分析了最简单和最基础的场景，在实际项目中，我们是把页面拆成很多组件的，Vue 另一个核心思想就是组件化



##  组件化

Vue.js 另一个核心思想是组件化。所谓组件化，就是把页面拆分成多个组件 (component)，每个组件依赖的 CSS、JavaScript、模板、图片等资源放在一起开发和维护。组件是资源独立的，组件在系统内部可复用，组件和组件之间可以嵌套。

Vue.js 另一个核心思想是组件化。所谓组件化，就是把页面拆分成多个组件 (component)，每个组件依赖的 CSS、JavaScript、模板、图片等资源放在一起开发和维护。组件是资源独立的，组件在系统内部可复用，组件和组件之间可以嵌套。

我们在用 Vue.js 开发实际项目的时候，就是像搭积木一样，编写一堆组件拼装生成页面。在 Vue.js 的官网中，也是花了大篇幅来介绍什么是组件，如何编写组件以及组件拥有的属性和特性。

那么在这一章节，我们将从源码的角度来分析 Vue 的组件内部是如何工作的，只有了解了内部的工作原理，才能让我们使用它的时候更加得心应手。

接下来我们会用 Vue-cli 初始化的代码为例，来分析一下 Vue 组件初始化的一个过程。

```js
import Vue from 'vue'
import App from './App.vue'

var app = new Vue({
  el: '#app',
  // 这里的 h 是 createElement 方法
  render: h => h(App)
})
```



###  createComponent

上一章我们在分析 `createElement` 的实现的时候，它最终会调用 `_createElement` 方法，其中==有一段逻辑是对参数 `tag` 的判断==，如果是一个普通的 html 标签，如果是一个普通的 div，则会实例化一个普通 VNode 节点，否则通过 `createComponent` 方法创建一个组件 VNode。

```js
if (typeof tag === 'string') {
  let Ctor
  ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
  if (config.isReservedTag(tag)) {
    // platform built-in elements
    vnode = new VNode(
      config.parsePlatformTagName(tag), data, children,
      undefined, undefined, context
    )
  } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
    // component
    vnode = createComponent(Ctor, data, context, children, tag)
  } else {
    // unknown or unlisted namespaced elements
    // check at runtime because it may get assigned a namespace when its
    // parent normalizes children
    vnode = new VNode(
      tag, data, children,
      undefined, undefined, context
    )
  }
} else {
  // direct component options / constructor
  vnode = createComponent(tag, data, context, children)
}
```

在这里的是一个 App 对象，它本质上是一个 `Component` 类型，那么它会走到上述代码的 else 逻辑，==直接通过 `createComponent` 方法来创建 `vnode`==。所以接下来我们来看一下 `createComponent` 方法的实现，它定义在 `src/core/vdom/create-component.js` 文件中：

```js
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  if (isUndef(Ctor)) {
    return
  }

  const baseCtor = context.$options._base

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(`Invalid Component definition: ${String(Ctor)}`, context)
    }
    return
  }

  // async component
  let asyncFactory
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context)
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {}

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor)

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data)
  }

  // extract props
  const propsData = extractPropsFromVNodeData(data, Ctor, tag)

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  const listeners = data.on
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    const slot = data.slot
    data = {}
    if (slot) {
      data.slot = slot
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data)

  // return a placeholder vnode
  const name = Ctor.options.name || tag
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )

  // Weex specific: invoke recycle-list optimized @render function for
  // extracting cell-slot template.
  // https://github.com/Hanks10100/weex-native-directive/tree/master/component
  /* istanbul ignore if */
  if (__WEEX__ && isRecyclableComponent(vnode)) {
    return renderRecyclableComponentTemplate(vnode)
  }

  return vnode
}
```

可以看到，`createComponent` 的逻辑也会有一些复杂，但是分析源码比较推荐的是只分析核心流程，分支流程可以之后针对性的看，所以这里针对**组件渲染**这个 case 主要就 3 个关键步骤：

**构造子类构造函数**，**安装组件钩子函数**和**实例化 `vnode`**。

#### 构造子类构造函数

```js
const baseCtor = context.$options._base

// plain options object: turn it into a constructor
if (isObject(Ctor)) {
  Ctor = baseCtor.extend(Ctor)
}
```

我们在**编写一个组件的时候，通常都是创建一个普通对象**，还是以我们的 App.vue 为例，代码如下：

```js
import HelloWorld from './components/HelloWorld'

export default {
  name: 'app',
  components: {
    HelloWorld
  }
}
```

这里 export 的是一个对象，所以 `createComponent` 里的代码逻辑会执行到 `baseCtor.extend(Ctor)`，在这里 `baseCtor` 实际上就是 Vue，这个的定义是在**最开始初始化 Vue 的阶段**，在 `src/core/global-api/index.js` 中的 `initGlobalAPI` 函数有这么一段逻辑：

```js
// this is used to identify the "base" constructor to extend all plain-object
// components with in Weex's multi-instance scenarios.
Vue.options._base = Vue
```

细心的同学会发现，这里定义的是 `Vue.options`，而我们的 `createComponent` 取的是 `context.$options`，实际上在 `src/core/instance/init.js` 里 Vue 原型上的 `_init` 函数中有这么一段逻辑：

```js
vm.$options = mergeOptions(
  resolveConstructorOptions(vm.constructor),
  options || {},
  vm
)
```

这样就把 Vue 上的一些 `option` 扩展到了 `vm.$options` 上，所以我们也就能通过==vm.$options._base拿到 Vue 这个构造函数了==。`mergeOptions` 现在只需要理解它的功能是把 Vue 构造函数的 `options` 和用户传入的 `options` 做一层合并，到 `vm.$options` 上。

在了解了 `baseCtor` 指向了 Vue 之后，我们来看一下 `Vue.extend` 函数的定义，在 `src/core/global-api/extend.js` 中。

```js
/**
 * Class inheritance
 */
Vue.extend = function (extendOptions: Object): Function {
  extendOptions = extendOptions || {}
  const Super = this
  const SuperId = Super.cid
  const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
  if (cachedCtors[SuperId]) {
    return cachedCtors[SuperId]
  }

  const name = extendOptions.name || Super.options.name
  if (process.env.NODE_ENV !== 'production' && name) {
    validateComponentName(name)
  }

  const Sub = function VueComponent (options) {
    this._init(options)
  }
  Sub.prototype = Object.create(Super.prototype)
  Sub.prototype.constructor = Sub
  Sub.cid = cid++
  Sub.options = mergeOptions(
    Super.options,
    extendOptions
  )
  Sub['super'] = Super

  // For props and computed properties, we define the proxy getters on
  // the Vue instances at extension time, on the extended prototype. This
  // avoids Object.defineProperty calls for each instance created.
  if (Sub.options.props) {
    initProps(Sub)
  }
  if (Sub.options.computed) {
    initComputed(Sub)
  }

  // allow further extension/mixin/plugin usage
  Sub.extend = Super.extend
  Sub.mixin = Super.mixin
  Sub.use = Super.use

  // create asset registers, so extended classes
  // can have their private assets too.
  ASSET_TYPES.forEach(function (type) {
    Sub[type] = Super[type]
  })
  // enable recursive self-lookup
  if (name) {
    Sub.options.components[name] = Sub
  }

  // keep a reference to the super options at extension time.
  // later at instantiation we can check if Super's options have
  // been updated.
  Sub.superOptions = Super.options
  Sub.extendOptions = extendOptions
  Sub.sealedOptions = extend({}, Sub.options)

  // cache constructor
  cachedCtors[SuperId] = Sub
  return Sub
}
```

`Vue.extend` 的作用就是构造一个 `Vue` 的子类，它使用==一种非常经典的原型继承的方式把一个纯对象转换一个继承于 `Vue` 的构造器 `Sub` 并返回==，然后对 `Sub` 这个对象本身扩展了一些属性，如扩展 `options`、添加全局 API 等；并且对配置中的 `props` 和 `computed` 做了初始化工作；最后对于这个 `Sub` 构造函数做了缓存，避免多次执行 `Vue.extend` 的时候对同一个子组件重复构造。

这样当我们去实例化 `Sub` 的时候，就会执行 `this._init` 逻辑再次走到了 `Vue` 实例的初始化逻辑，实例化子组件的逻辑在之后的章节会介绍。

```js
const Sub = function VueComponent (options) {
  this._init(options)
}
```

#### 安装组件钩子函数

```js
// install component management hooks onto the placeholder node
installComponentHooks(data)
```

我们之前提到 Vue.js 使用的 Virtual DOM 参考的是开源库 [snabbdom](https://github.com/snabbdom/snabbdom)，它的一个特点是在 ==VNode 的 patch 流程中对外暴露了各种时机的钩子函数，方便我们做一些额外的事情==，Vue.js 也是充分利用这一点，在初始化一个 Component 类型的 VNode 的过程中实现了几个钩子函数：

```js
const componentVNodeHooks = {
  init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode)
    } else {
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      )
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  },

  prepatch (oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
    const options = vnode.componentOptions
    const child = vnode.componentInstance = oldVnode.componentInstance
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    )
  },

  insert (vnode: MountedComponentVNode) {
    const { context, componentInstance } = vnode
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true
      callHook(componentInstance, 'mounted')
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance)
      } else {
        activateChildComponent(componentInstance, true /* direct */)
      }
    }
  },

  destroy (vnode: MountedComponentVNode) {
    const { componentInstance } = vnode
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy()
      } else {
        deactivateChildComponent(componentInstance, true /* direct */)
      }
    }
  }
}

const hooksToMerge = Object.keys(componentVNodeHooks)

function installComponentHooks (data: VNodeData) {
  const hooks = data.hook || (data.hook = {})
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i]
    const existing = hooks[key]
    const toMerge = componentVNodeHooks[key]
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge
    }
  }
}

function mergeHook (f1: any, f2: any): Function {
  const merged = (a, b) => {
    // flow complains about extra args which is why we use any
    f1(a, b)
    f2(a, b)
  }
  merged._merged = true
  return merged
}
```

整个 `installComponentHooks` 的过程就是把 `componentVNodeHooks` 的钩子函数合并到 `data.hook` 中，在 VNode 执行 `patch` 的过程中执行相关的钩子函数，具体的执行我们稍后在介绍 `patch` 过程中会详细介绍。这里要注意的是合并策略，在合并过程中，如果某个时机的钩子已经存在 `data.hook` 中，那么通过执行 `mergeHook` 函数做合并，这个逻辑很简单，就是在最终执行的时候，依次执行这两个钩子函数即可。

#### 实例化 VNode

```js
const name = Ctor.options.name || tag
const vnode = new VNode(
  `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
  data, undefined, undefined, undefined, context,
  { Ctor, propsData, listeners, tag, children },
  asyncFactory
)
return vnode
```

最后一步非常简单，通过 `new VNode` 实例化一个 `vnode` 并返回。需要注意的是和普通元素节点的 `vnode` 不同，组件的 `vnode` 是没有 `children` 的，这点很关键，在之后的 `patch` 过程中我们会再提。



`createComponent` 的实现，了解到它在渲染一个组件的时候的 ==3 个关键逻辑：构造子类构造函数，安装组件钩子函数和实例化 `vnode`。`createComponent` 后返回的是组件 `vnode`，它也一样走到 `vm._update` 方法，进而执行了 `patch` 函数==

### patch

当我们==通过 `createComponent` 创建了组件 VNode，接下来会走到 `vm._update`，执行 `vm.__patch__` 去把 VNode 转换成真正的 DOM 节点==。这个过程我们在前一章已经分析过了，但是针对一个普通的 VNode 节点，接下来我们来看看**组件的 VNode 会有哪些不一样的地方**。

patch 的过程会调用 `createElm` 创建元素节点，回顾一下 `createElm` 的实现，它的定义在 `src/core/vdom/patch.js` 中：

```js
function createElm (
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {
  // ...
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }
  // ...
}
```

#### createComponent

我们删掉多余的代码，只保留关键的逻辑，这里会判断 `createComponent(vnode, insertedVnodeQueue, parentElm, refElm)` 的返回值，如果为 `true` 则直接结束，那么接下来看一下 `createComponent` 方法的实现：

```js
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data
  if (isDef(i)) {
    const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      i(vnode, false /* hydrating */)
    }
    // after calling the init hook, if the vnode is a child component
    // it should've created a child instance and mounted it. the child
    // component also has set the placeholder vnode's elm.
    // in that case we can just return the element and be done.
    if (isDef(vnode.componentInstance)) {
      initComponent(vnode, insertedVnodeQueue)
      insert(parentElm, vnode.elm, refElm)
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
      }
      return true
    }
  }
}
```

`createComponent` 函数中，首先对 `vnode.data` 做了一些判断：

```js
let i = vnode.data
if (isDef(i)) {
  // ...
  if (isDef(i = i.hook) && isDef(i = i.init)) {
    i(vnode, false /* hydrating */)
    // ...
  }
  // ..
}
```

如果 `vnode` 是一个组件 VNode，那么条件会满足，并且得到 `i` 就是 `init` 钩子函数，回顾上节我们在创建组件 VNode 的时候合并钩子函数中就包含 `init` 钩子函数，定义在 `src/core/vdom/create-component.js` 中：

```js
init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
  if (
    vnode.componentInstance &&
    !vnode.componentInstance._isDestroyed &&
    vnode.data.keepAlive
  ) {
    // kept-alive components, treat as a patch
    const mountedNode: any = vnode // work around flow
    componentVNodeHooks.prepatch(mountedNode, mountedNode)
  } else {
    const child = vnode.componentInstance = createComponentInstanceForVnode(
      vnode,
      activeInstance
    )
    child.$mount(hydrating ? vnode.elm : undefined, hydrating)
  }
},
```

`init` 钩子函数执行也很简单，我们先不考虑 `keepAlive` 的情况，它是通过 `createComponentInstanceForVnode` 创建一个 Vue 的实例，然后调用 `$mount` 方法挂载子组件， 先来看一下 `createComponentInstanceForVnode` 的实现：

```js
export function createComponentInstanceForVnode (
  vnode: any, // we know it's MountedComponentVNode but flow doesn't
  parent: any, // activeInstance in lifecycle state
): Component {
  const options: InternalComponentOptions = {
    _isComponent: true,
    _parentVnode: vnode,
    parent
  }
  // check inline-template render functions
  const inlineTemplate = vnode.data.inlineTemplate
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render
    options.staticRenderFns = inlineTemplate.staticRenderFns
  }
  return new vnode.componentOptions.Ctor(options)
}
```

`createComponentInstanceForVnode` 函数构造的一个内部组件的参数，然后执行 `new vnode.componentOptions.Ctor(options)`。这里的 `vnode.componentOptions.Ctor` 对应的就是子组件的构造函数，我们上一节分析了它实际上是继承于 Vue 的一个构造器 `Sub`，相当于 `new Sub(options)` 这里有几个关键参数要注意几个点，`_isComponent` 为 `true` 表示它是一个组件，`parent` 表示当前激活的组件实例（注意，这里比较有意思的是如何拿到组件实例，后面会介绍。

所以子组件的实例化实际上就是在这个时机执行的，并且它会执行实例的 `_init` 方法，这个过程有一些和之前不同的地方需要挑出来说，代码在 `src/core/instance/init.js` 中：

```js
Vue.prototype._init = function (options?: Object) {
  const vm: Component = this
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
  // ...
  if (vm.$options.el) {
    vm.$mount(vm.$options.el)
  } 
}
```

这里首先是合并 `options` 的过程有变化，`_isComponent` 为 true，所以走到了 `initInternalComponent` 过程，这个函数的实现也简单看一下：

```js
export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}
```

这个过程我们**重点记住以下几个点即可**：`opts.parent = options.parent`、`opts._parentVnode = parentVnode`，它们是把之前我们通过 `createComponentInstanceForVnode` 函数传入的几个参数合并到内部的选项 `$options` 里了。

再来看一下 `_init` 函数最后执行的代码：

```js
if (vm.$options.el) {
   vm.$mount(vm.$options.el)
}
```

由于组件初始化的时候是不传 el 的，因此组件是自己接管了 `$mount` 的过程，这个过程的主要流程在上一章介绍过了，回到组件 `init` 的过程，`componentVNodeHooks` 的 `init` 钩子函数，在完成实例化的 `_init` 后，接着会执行 `child.$mount(hydrating ? vnode.elm : undefined, hydrating)` 。这里 `hydrating` 为 true 一般是服务端渲染的情况，我们只考虑客户端渲染，所以这里 `$mount` 相当于执行 `child.$mount(undefined, false)`，它最终会调用 `mountComponent` 方法，进而执行 `vm._render()` 方法：

```js
Vue.prototype._render = function (): VNode {
  const vm: Component = this
  const { render, _parentVnode } = vm.$options

  
  // set parent vnode. this allows render functions to have access
  // to the data on the placeholder node.
  vm.$vnode = _parentVnode
  // render self
  let vnode
  try {
    vnode = render.call(vm._renderProxy, vm.$createElement)
  } catch (e) {
    // ...
  }
  // set parent
  vnode.parent = _parentVnode
  return vnode
}
```

我们只保留关键部分的代码，这里的 `_parentVnode` 就是当前组件的父 VNode，而 `render` 函数生成的 `vnode` 当前组件的渲染 `vnode`，`vnode` 的 `parent` 指向了 `_parentVnode`，也就是 `vm.$vnode`，它们是一种父子的关系。

我们知道在执行完 `vm._render` 生成 VNode 后，接下来就要执行 `vm._update` 去渲染 VNode 了。来看一下组件渲染的过程中有哪些需要注意的，`vm._update` 的定义在 `src/core/instance/lifecycle.js` 中：

```js
export let activeInstance: any = null
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this
  const prevEl = vm.$el
  const prevVnode = vm._vnode
  const prevActiveInstance = activeInstance
  activeInstance = vm
  vm._vnode = vnode
  // Vue.prototype.__patch__ is injected in entry points
  // based on the rendering backend used.
  if (!prevVnode) {
    // initial render
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
  } else {
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
  activeInstance = prevActiveInstance
  // update __vue__ reference
  if (prevEl) {
    prevEl.__vue__ = null
  }
  if (vm.$el) {
    vm.$el.__vue__ = vm
  }
  // if parent is an HOC, update its $el as well
  if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
    vm.$parent.$el = vm.$el
  }
  // updated hook is called by the scheduler to ensure that children are
  // updated in a parent's updated hook.
}
```

`_update` 过程中有几个关键的代码，首先 `vm._vnode = vnode` 的逻辑，这个 `vnode` 是通过 `vm._render()` 返回的组件渲染 VNode，`vm._vnode` 和 `vm.$vnode` 的关系就是一种父子关系，用代码表达就是 `vm._vnode.parent === vm.$vnode`。还有一段比较有意思的代码：

```js
export let activeInstance: any = null
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    // ...
    const prevActiveInstance = activeInstance
    activeInstance = vm
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    activeInstance = prevActiveInstance
    // ...
}
```

这个 `activeInstance` 作用就是保持当前上下文的 Vue 实例，它是在 `lifecycle` 模块的全局变量，定义是 `export let activeInstance: any = null`，并且在之前我们调用 `createComponentInstanceForVnode` 方法的时候从 `lifecycle` 模块获取，并且作为参数传入的。因为实际上 JavaScript 是一个单线程，Vue 整个初始化是一个深度遍历的过程，在实例化子组件的过程中，它需要知道当前上下文的 Vue 实例是什么，并把它作为子组件的父 Vue 实例。之前我们提到过对子组件的实例化过程先会调用 `initInternalComponent(vm, options)` 合并 `options`，把 `parent` 存储在 `vm.$options` 中，在 `$mount` 之前会调用 `initLifecycle(vm)` 方法：

```js
export function initLifecycle (vm: Component) {
  const options = vm.$options

  // locate first non-abstract parent
  let parent = options.parent
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }

  vm.$parent = parent
  // ...
}
```

可以看到 `vm.$parent` 就是用来保留当前 `vm` 的父实例，并且通过 `parent.$children.push(vm)` 来把当前的 `vm` 存储到父实例的 `$children` 中。

在 `vm._update` 的过程中，把当前的 `vm` 赋值给 `activeInstance`，同时通过 `const prevActiveInstance = activeInstance` 用 `prevActiveInstance` 保留上一次的 `activeInstance`。实际上，`prevActiveInstance` 和当前的 `vm` 是一个父子关系，当一个 `vm` 实例完成它的所有子树的 patch 或者 update 过程后，`activeInstance` 会回到它的父实例，这样就完美地保证了 `createComponentInstanceForVnode` 整个深度遍历过程中，我们在实例化子组件的时候能传入当前子组件的父 Vue 实例，并在 `_init` 的过程中，通过 `vm.$parent` 把这个父子关系保留。

那么回到 `_update`，最后就是调用 `__patch__` 渲染 VNode 了。

```js
vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
 
function patch (oldVnode, vnode, hydrating, removeOnly) {
  // ...
  let isInitialPatch = false
  const insertedVnodeQueue = []

  if (isUndef(oldVnode)) {
    // empty mount (likely as component), create new root element
    isInitialPatch = true
    createElm(vnode, insertedVnodeQueue)
  } else {
    // ...
  }
  // ...
}
```

这里又回到了本节开始的过程，之前分析过负责渲染成 DOM 的函数是 `createElm`，注意这里我们只传了 2 个参数，所以对应的 `parentElm` 是 `undefined`。我们再来看看它的定义：

```js
function createElm (
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {
  // ...
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }

  const data = vnode.data
  const children = vnode.children
  const tag = vnode.tag
  if (isDef(tag)) {
    // ...

    vnode.elm = vnode.ns
      ? nodeOps.createElementNS(vnode.ns, tag)
      : nodeOps.createElement(tag, vnode)
    setScope(vnode)

    /* istanbul ignore if */
    if (__WEEX__) {
      // ...
    } else {
      createChildren(vnode, children, insertedVnodeQueue)
      if (isDef(data)) {
        invokeCreateHooks(vnode, insertedVnodeQueue)
      }
      insert(parentElm, vnode.elm, refElm)
    }
    
    // ...
  } else if (isTrue(vnode.isComment)) {
    vnode.elm = nodeOps.createComment(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  } else {
    vnode.elm = nodeOps.createTextNode(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  }
}
```

注意，这里我们传入的 `vnode` 是组件渲染的 `vnode`，也就是我们之前说的 `vm._vnode`，如果组件的根节点是个普通元素，那么 `vm._vnode` 也是普通的 `vnode`，这里 `createComponent(vnode, insertedVnodeQueue, parentElm, refElm)` 的返回值是 false。接下来的过程就和我们上一章一样了，先创建一个父节点占位符，然后再遍历所有子 VNode 递归调用 `createElm`，在遍历的过程中，如果遇到子 VNode 是一个组件的 VNode，则重复本节开始的过程，这样通过一个递归的方式就可以完整地构建了整个组件树。

由于我们这个时候传入的 `parentElm` 是空，所以对组件的插入，在 `createComponent` 有这么一段逻辑：

```js
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data
  if (isDef(i)) {
    // ....
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      i(vnode, false /* hydrating */)
    }
    // ...
    if (isDef(vnode.componentInstance)) {
      initComponent(vnode, insertedVnodeQueue)
      insert(parentElm, vnode.elm, refElm)
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
      }
      return true
    }
  }
}
```

在完成组件的整个 `patch` 过程后，最后执行 `insert(parentElm, vnode.elm, refElm)` 完成组件的 DOM 插入，如果组件 `patch` 过程中又创建了子组件，那么DOM 的插入顺序是先子后父

### 合并配置

通过之前章节的源码分析我们知道，`new Vue` 的过程通常有 2 种场景，一种是外部我们的代码主动调用 `new Vue(options)` 的方式实例化一个 Vue 对象；另一种是我们上一节分析的组件过程中内部通过 `new Vue(options)` 实例化子组件。

无论哪种场景，都会**执行实例**的 `_init(options)` 方法，它首先会执行一个 `merge options` 的逻辑，相关的代码在 `src/core/instance/init.js` 中：

```js
Vue.prototype._init = function (options?: Object) {
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
  // ...
}
```

可以看到不同场景对于 `options` 的合并逻辑是不一样的，并且传入的 `options` 值也有非常大的不同，接下来我会分开介绍 2 种场景的 options 合并过程。

为了更直观，我们可以举个简单的示例：

```js
import Vue from 'vue'

let childComp = {
  template: '<div>{{msg}}</div>',
  created() {
    console.log('child created')
  },
  mounted() {
    console.log('child mounted')
  },
  data() {
    return {
      msg: 'Hello Vue'
    }
  }
}

Vue.mixin({
  created() {
    console.log('parent created')
  }
})

let app = new Vue({
  el: '#app',
  render: h => h(childComp)
})
```

#### 外部调用场景

当执行 `new Vue` 的时候，在执行 `this._init(options)` 的时候，就会执行如下逻辑去合并 `options`：

```js
vm.$options = mergeOptions(
  resolveConstructorOptions(vm.constructor),
  options || {},
  vm
)
```

这里通过调用 `mergeOptions` 方法来合并，它实际上就是把 `resolveConstructorOptions(vm.constructor)` 的返回值和 `options` 做合并，`resolveConstructorOptions` 的实现先不考虑，在我们这个场景下，它还是简单返回 `vm.constructor.options`，相当于 `Vue.options`，那么这个值又是什么呢，其实在 `initGlobalAPI(Vue)` 的时候定义了这个值，代码在 `src/core/global-api/index.js` 中：

```js
export function initGlobalAPI (Vue: GlobalAPI) {
  // ...
  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue

  extend(Vue.options.components, builtInComponents)
  // ...
}
```

首先通过 `Vue.options = Object.create(null)` 创建一个空对象，然后遍历 `ASSET_TYPES`，`ASSET_TYPES` 的定义在 `src/shared/constants.js` 中：

```js
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]
```

所以上面遍历 `ASSET_TYPES` 后的代码相当于：

```js
Vue.options.components = {}
Vue.options.directives = {}
Vue.options.filters = {}
```

接着执行了 `Vue.options._base = Vue`，它的作用在我们上节实例化子组件的时候介绍了。

最后通过 `extend(Vue.options.components, builtInComponents)` 把一些内置组件扩展到 `Vue.options.components` 上，Vue 的内置组件目前有 `<keep-alive>`、`<transition>` 和 `<transition-group>` 组件，这也就是为什么我们在其它组件中使用 `<keep-alive>` 组件不需要注册的原因，这块儿后续我们介绍 `<keep-alive>` 组件的时候会详细讲。

那么回到 `mergeOptions` 这个函数，它的定义在 `src/core/util/options.js` 中：

```js
/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
export function mergeOptions (
  parent: Object,
  child: Object,
  vm?: Component
): Object {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child)
  }

  if (typeof child === 'function') {
    child = child.options
  }

  normalizeProps(child, vm)
  normalizeInject(child, vm)
  normalizeDirectives(child)
  const extendsFrom = child.extends
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm)
  }
  if (child.mixins) {
    for (let i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm)
    }
  }
  const options = {}
  let key
  for (key in parent) {
    mergeField(key)
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }
  function mergeField (key) {
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}
```

`mergeOptions` 主要功能就是把 `parent` 和 `child` 这两个对象根据一些合并策略，合并成一个新对象并返回。比较核心的几步，先递归把 `extends` 和 `mixins` 合并到 `parent` 上，然后遍历 `parent`，调用 `mergeField`，然后再遍历 `child`，如果 `key` 不在 `parent` 的自身属性上，则调用 `mergeField`。

这里有意思的是 `mergeField` 函数，它对不同的 `key` 有着不同的合并策略。举例来说，对于生命周期函数，它的合并策略是这样的：

```js
function mergeHook (
  parentVal: ?Array<Function>,
  childVal: ?Function | ?Array<Function>
): ?Array<Function> {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})
```

这其中的 `LIFECYCLE_HOOKS` 的定义在 `src/shared/constants.js` 中：

```js
export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
]
```

这里定义了 Vue.js 所有的钩子函数名称，所以对于钩子函数，他们的合并策略都是 `mergeHook` 函数。这个函数的实现也非常有意思，用了一个多层 3 元运算符，逻辑就是如果不存在 `childVal` ，就返回 `parentVal`；否则再判断是否存在 `parentVal`，如果存在就把 `childVal` 添加到 `parentVal` 后返回新数组；否则返回 `childVal` 的数组。所以回到 `mergeOptions` 函数，一旦 `parent` 和 `child` 都定义了相同的钩子函数，那么它们会把 2 个钩子函数合并成一个数组。

关于其它属性的合并策略的定义都可以在 `src/core/util/options.js` 文件中看到，这里不一一介绍了，感兴趣的同学可以自己看。

通过执行 `mergeField` 函数，把合并后的结果保存到 `options` 对象中，最终返回它。

因此，在我们当前这个 case 下，执行完如下合并后：

```js
vm.$options = mergeOptions(
  resolveConstructorOptions(vm.constructor),
  options || {},
  vm
)
```

`vm.$options` 的值差不多是如下这样：

```js
vm.$options = {
  components: { },
  created: [
    function created() {
      console.log('parent created')
    }
  ],
  directives: { },
  filters: { },
  _base: function Vue(options) {
    // ...
  },
  el: "#app",
  render: function (h) {
    //...
  }
}
```

#### 组件场景

由于组件的构造函数是通过 `Vue.extend` 继承自 `Vue` 的，先回顾一下这个过程，代码定义在 `src/core/global-api/extend.js` 中。

```js
/**
 * Class inheritance
 */
Vue.extend = function (extendOptions: Object): Function {
  // ...
  Sub.options = mergeOptions(
    Super.options,
    extendOptions
  )

  // ...
  // keep a reference to the super options at extension time.
  // later at instantiation we can check if Super's options have
  // been updated.
  Sub.superOptions = Super.options
  Sub.extendOptions = extendOptions
  Sub.sealedOptions = extend({}, Sub.options)

  // ...
  return Sub
}
```

我们只保留关键逻辑，这里的 `extendOptions` 对应的就是前面定义的组件对象，它会和 `Vue.options` 合并到 `Sub.opitons` 中。

接下来我们再回忆一下子组件的初始化过程，代码定义在 `src/core/vdom/create-component.js` 中：

```js
export function createComponentInstanceForVnode (
  vnode: any, // we know it's MountedComponentVNode but flow doesn't
  parent: any, // activeInstance in lifecycle state
): Component {
  const options: InternalComponentOptions = {
    _isComponent: true,
    _parentVnode: vnode,
    parent
  }
  // ...
  return new vnode.componentOptions.Ctor(options)
}
```

这里的 `vnode.componentOptions.Ctor` 就是指向 `Vue.extend` 的返回值 `Sub`， 所以 执行 `new vnode.componentOptions.Ctor(options)` 接着执行 `this._init(options)`，因为 `options._isComponent` 为 true，那么合并 `options` 的过程走到了 `initInternalComponent(vm, options)` 逻辑。先来看一下它的代码实现，在 `src/core/instance/init.js` 中：

```js
export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}
```

`initInternalComponent` 方法首先执行 `const opts = vm.$options = Object.create(vm.constructor.options)`，这里的 `vm.constructor` 就是子组件的构造函数 `Sub`，相当于 `vm.$options = Object.create(Sub.options)`。

接着又把实例化子组件传入的子组件父 VNode 实例 `parentVnode`、子组件的父 Vue 实例 `parent` 保存到 `vm.$options` 中，另外还保留了 `parentVnode` 配置中的如 `propsData` 等其它的属性。

这么看来，`initInternalComponent` 只是做了简单一层对象赋值，并不涉及到递归、合并策略等复杂逻辑。

因此，在我们当前这个 case 下，执行完如下合并后：

```js
initInternalComponent(vm, options)
```

`vm.$options` 的值差不多是如下这样：

```js
vm.$options = {
  parent: Vue /*父Vue实例*/,
  propsData: undefined,
  _componentTag: undefined,
  _parentVnode: VNode /*父VNode实例*/,
  _renderChildren:undefined,
  __proto__: {
    components: { },
    directives: { },
    filters: { },
    _base: function Vue(options) {
        //...
    },
    _Ctor: {},
    created: [
      function created() {
        console.log('parent created')
      }, function created() {
        console.log('child created')
      }
    ],
    mounted: [
      function mounted() {
        console.log('child mounted')
      }
    ],
    data() {
       return {
         msg: 'Hello Vue'
       }
    },
    template: '<div>{{msg}}</div>'
  }
}
```

Vue 初始化阶段对于 `options` 的合并过程就介绍完了，我们需要知道对于 `options` 的合并有 2 种方式，子组件初始化过程通过 `initInternalComponent` 方式要比外部初始化 Vue 通过 `mergeOptions` 的过程要快，合并完的结果保留在 `vm.$options` 中。

纵观一些库、框架的设计几乎都是类似的，自身定义了一些默认配置，同时又可以在初始化阶段传入一些定义配置，然后去 merge 默认配置，来达到定制化不同需求的目的。只不过在 Vue 的场景下，会对 merge 的过程做一些精细化控制，虽然我们在开发自己的 JSSDK 的时候并没有 Vue 这么复杂，但这个设计思想是值得我们借鉴的。

### 生命周期

每个 Vue 实例在被创建之前都要经过一系列的初始化过程。例如需要设置数据监听、编译模板、挂载实例到 DOM、在数据变化时更新 DOM 等。同时在这个过程中也会运行一些叫做生命周期钩子的函数，给予用户机会在一些特定的场景下添加他们自己的代码。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/lifecycle.png)

在我们实际项目开发过程中，会非常频繁地和 Vue 组件的生命周期打交道，接下来我们就从源码的角度来看一下这些生命周期的钩子函数是如何被执行的。

源码中最终执行生命周期的函数都是调用 `callHook` 方法，它的定义在 `src/core/instance/lifecycle` 中：

```js
export function callHook (vm: Component, hook: string) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget()
  const handlers = vm.$options[hook]
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm)
      } catch (e) {
        handleError(e, vm, `${hook} hook`)
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook)
  }
  popTarget()
}
```

`callHook` 函数的逻辑很简单，根据传入的字符串 `hook`，去拿到 `vm.$options[hook]` 对应的回调函数数组，然后遍历执行，执行的时候把 `vm` 作为函数执行的上下文。

在上一节中，我们详细地介绍了 Vue.js 合并 `options` 的过程，各个阶段的生命周期的函数也被合并到 `vm.$options` 里，并且是一个数组。因此 `callhook` 函数的功能就是调用某个生命周期钩子注册的所有回调函数。

了解了生命周期的执行方式后，接下来我们会具体介绍每一个生命周期函数它的调用时机。

#### beforeCreate & created

`beforeCreate` 和 `created` 函数都是在实例化 `Vue` 的阶段，在 `_init` 方法中执行的，它的定义在 `src/core/instance/init.js` 中：

```js
Vue.prototype._init = function (options?: Object) {
  // ...
  initLifecycle(vm)
  initEvents(vm)
  initRender(vm)
  callHook(vm, 'beforeCreate')
  initInjections(vm) // resolve injections before data/props
  initState(vm)
  initProvide(vm) // resolve provide after data/props
  callHook(vm, 'created')
  // ...
}
```

可以看到 `beforeCreate` 和 `created` 的钩子调用是在 `initState` 的前后，`initState` 的作用是初始化 `props`、`data`、`methods`、`watch`、`computed` 等属性，之后我们会详细分析。那么显然 `beforeCreate` 的钩子函数中就不能获取到 `props`、`data` 中定义的值，也不能调用 `methods` 中定义的函数。

在这俩个钩子函数执行的时候，并没有渲染 DOM，所以我们也不能够访问 DOM，一般来说，如果组件在加载的时候需要和后端有交互，放在这俩个钩子函数执行都可以，如果是需要访问 `props`、`data` 等数据的话，就需要使用 `created` 钩子函数。之后我们会介绍 vue-router 和 vuex 的时候会发现它们都混合了 `beforeCreate` 钩子函数。

#### beforeMount & mounted

顾名思义，`beforeMount` 钩子函数发生在 `mount`，也就是 DOM 挂载之前，它的调用时机是在 `mountComponent` 函数中，定义在 `src/core/instance/lifecycle.js` 中：

```js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  // ...
  callHook(vm, 'beforeMount')

  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```

在执行 `vm._render()` 函数渲染 VNode 之前，执行了 `beforeMount` 钩子函数，在执行完 `vm._update()` 把 VNode patch 到真实 DOM 后，执行 `mounted` 钩子。注意，这里对 `mounted` 钩子函数执行有一个判断逻辑，`vm.$vnode` 如果为 `null`，则表明这不是一次组件的初始化过程，而是我们通过外部 `new Vue` 初始化过程。那么对于组件，它的 `mounted` 时机在哪儿呢？

之前我们提到过，组件的 VNode patch 到 DOM 后，会执行 `invokeInsertHook` 函数，把 `insertedVnodeQueue` 里保存的钩子函数依次执行一遍，它的定义在 `src/core/vdom/patch.js` 中：

```js
function invokeInsertHook (vnode, queue, initial) {
  // delay insert hooks for component root nodes, invoke them after the
  // element is really inserted
  if (isTrue(initial) && isDef(vnode.parent)) {
    vnode.parent.data.pendingInsert = queue
  } else {
    for (let i = 0; i < queue.length; ++i) {
      queue[i].data.hook.insert(queue[i])
    }
  }
}
```

该函数会执行 `insert` 这个钩子函数，对于组件而言，`insert` 钩子函数的定义在 `src/core/vdom/create-component.js` 中的 `componentVNodeHooks` 中：

```js
const componentVNodeHooks = {
  // ...
  insert (vnode: MountedComponentVNode) {
    const { context, componentInstance } = vnode
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true
      callHook(componentInstance, 'mounted')
    }
    // ...
  },
}
```

我们可以看到，每个子组件都是在这个钩子函数中执行 `mounted` 钩子函数，并且我们之前分析过，`insertedVnodeQueue` 的添加顺序是先子后父，所以对于同步渲染的子组件而言，`mounted` 钩子函数的执行顺序也是先子后父。

#### beforeUpdate & updated

顾名思义，`beforeUpdate` 和 `updated` 的钩子函数执行时机都应该是在数据更新的时候，到目前为止，我们还没有分析 Vue 的数据双向绑定、更新相关，下一章我会详细介绍这个过程。

`beforeUpdate` 的执行时机是在渲染 Watcher 的 `before` 函数中，我们刚才提到过：

```js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  // ...

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  // ...
}
```

注意这里有个判断，也就是在组件已经 `mounted` 之后，才会去调用这个钩子函数。

`update` 的执行时机是在`flushSchedulerQueue` 函数调用的时候，它的定义在 `src/core/observer/scheduler.js` 中：

```js
function flushSchedulerQueue () {
  // ...
  // 获取到 updatedQueue
  callUpdatedHooks(updatedQueue)
}

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

`flushSchedulerQueue` 函数我们之后会详细介绍，可以先大概了解一下，`updatedQueue` 是更新了的 `wathcer` 数组，那么在 `callUpdatedHooks` 函数中，它对这些数组做遍历，只有满足当前 `watcher` 为 `vm._watcher` 以及组件已经 `mounted` 这两个条件，才会执行 `updated` 钩子函数。

我们之前提过，在组件 mount 的过程中，会实例化一个渲染的 `Watcher` 去监听 `vm` 上的数据变化重新渲染，这段逻辑发生在 `mountComponent` 函数执行的时候：

```js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  // ...
  // 这里是简写
  let updateComponent = () => {
      vm._update(vm._render(), hydrating)
  }
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  // ...
}
```

那么在实例化 `Watcher` 的过程中，在它的构造函数里会判断 `isRenderWatcher`，接着把当前 `watcher` 的实例赋值给 `vm._watcher`，定义在 `src/core/observer/watcher.js` 中：

```js
export default class Watcher {
  // ...
  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)
    // ...
  }
}
```

同时，还把当前 `wathcer` 实例 push 到 `vm._watchers` 中，`vm._watcher` 是专门用来监听 `vm` 上数据变化然后重新渲染的，所以它是一个渲染相关的 `watcher`，因此在 `callUpdatedHooks` 函数中，只有 `vm._watcher` 的回调执行完毕后，才会执行 `updated` 钩子函数。

#### beforeDestroy & destroyed

顾名思义，`beforeDestroy` 和 `destroyed` 钩子函数的执行时机在组件销毁的阶段，组件的销毁过程之后会详细介绍，最终会调用 `$destroy` 方法，它的定义在 `src/core/instance/lifecycle.js` 中：

```js
Vue.prototype.$destroy = function () {
    const vm: Component = this
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy')
    vm._isBeingDestroyed = true
    // remove self from parent
    const parent = vm.$parent
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm)
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown()
    }
    let i = vm._watchers.length
    while (i--) {
      vm._watchers[i].teardown()
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--
    }
    // call the last hook...
    vm._isDestroyed = true
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null)
    // fire destroyed hook
    callHook(vm, 'destroyed')
    // turn off all instance listeners.
    vm.$off()
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null
    }
  }
```

`beforeDestroy` 钩子函数的执行时机是在 `$destroy` 函数执行最开始的地方，接着执行了一系列的销毁动作，包括从 `parent` 的 `$children` 中删掉自身，删除 `watcher`，当前渲染的 VNode 执行销毁钩子函数等，执行完毕后再调用 `destroy` 钩子函数。

在 `$destroy` 的执行过程中，它又会执行 `vm.__patch__(vm._vnode, null)` 触发它子组件的销毁钩子函数，这样一层层的递归调用，所以 `destroy` 钩子函数执行顺序是先子后父，和 `mounted` 过程一样。

#### activated & deactivated

`activated` 和 `deactivated` 钩子函数是专门为 `keep-alive` 组件定制的钩子，我们会在介绍 `keep-alive` 组件的时候详细介绍，这里先留个悬念。

#### 总结

这一节主要介绍了 Vue 生命周期中各个钩子函数的执行时机以及顺序，通过分析，我们知道了如在 `created` 钩子函数中可以访问到数据，在 `mounted` 钩子函数中可以访问到 DOM，在 `destroy` 钩子函数中可以做一些定时器销毁工作，了解它们有利于我们在合适的生命周期去做不同的事情

### 组件注册

在 Vue.js 中，除了它内置的组件如 `keep-alive`、`component`、`transition`、`transition-group` 等，其它用户自定义组件在使用前必须注册。很多同学在开发过程中可能会遇到如下报错信息：

```text
'Unknown custom element: <xxx> - did you register the component correctly?
 For recursive components, make sure to provide the "name" option.'
```

一般报这个错的原因都是我们使用了未注册的组件。Vue.js 提供了 2 种组件的注册方式，全局注册和局部注册。接下来我们从源码分析的角度来分析这两种注册方式。

#### 全局注册

要注册一个全局组件，可以使用 `Vue.component(tagName, options)`。例如：

```js
Vue.component('my-component', {
  // 选项
})
```

那么，`Vue.component` 函数是在什么时候定义的呢，它的定义过程发生在最开始初始化 Vue 的全局函数的时候，代码在 `src/core/global-api/assets.js` 中：

```js
import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
```

函数首先遍历 `ASSET_TYPES`，得到 `type` 后挂载到 Vue 上 。`ASSET_TYPES` 的定义在 `src/shared/constants.js` 中：

```js
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]
```

所以实际上 Vue 是初始化了 3 个全局函数，并且如果 `type` 是 `component` 且 `definition` 是一个对象的话，通过 `this.opitons._base.extend`， 相当于 `Vue.extend` 把这个对象转换成一个继承于 Vue 的构造函数，最后通过 `this.options[type + 's'][id] = definition` 把它挂载到 `Vue.options.components` 上。

由于我们每个组件的创建都是通过 `Vue.extend` 继承而来，我们之前分析过在继承的过程中有这么一段逻辑：

```js
Sub.options = mergeOptions(
  Super.options,
  extendOptions
)
```

也就是说它会把 `Vue.options` 合并到 `Sub.options`，也就是组件的 `options` 上， 然后在组件的实例化阶段，会执行 `merge options` 逻辑，把 `Sub.options.components` 合并到 `vm.$options.components` 上。

然后在创建 `vnode` 的过程中，会执行 `_createElement` 方法，我们再来回顾一下这部分的逻辑，它的定义在 `src/core/vdom/create-element.js` 中：

```js
export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  // ...
  let vnode, ns
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children)
  }
  // ...
}
```

这里有一个判断逻辑 `isDef(Ctor = resolveAsset(context.$options, 'components', tag))`，先来看一下 `resolveAsset` 的定义，在 `src/core/utils/options.js` 中：

```js
/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
export function resolveAsset (
  options: Object,
  type: string,
  id: string,
  warnMissing?: boolean
): any {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  const assets = options[type]
  // check local registration variations first
  if (hasOwn(assets, id)) return assets[id]
  const camelizedId = camelize(id)
  if (hasOwn(assets, camelizedId)) return assets[camelizedId]
  const PascalCaseId = capitalize(camelizedId)
  if (hasOwn(assets, PascalCaseId)) return assets[PascalCaseId]
  // fallback to prototype chain
  const res = assets[id] || assets[camelizedId] || assets[PascalCaseId]
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    )
  }
  return res
}
```

这段逻辑很简单，先通过 `const assets = options[type]` 拿到 `assets`，然后再尝试拿 `assets[id]`，这里有个顺序，先直接使用 `id` 拿，如果不存在，则把 `id` 变成驼峰的形式再拿，如果仍然不存在则在驼峰的基础上把首字母再变成大写的形式再拿，如果仍然拿不到则报错。这样说明了我们在使用 `Vue.component(id, definition)` 全局注册组件的时候，id 可以是连字符、驼峰或首字母大写的形式。

那么回到我们的调用 `resolveAsset(context.$options, 'components', tag)`，即拿 `vm.$options.components[tag]`，这样我们就可以在 `resolveAsset` 的时候拿到这个组件的构造函数，并作为 `createComponent` 的钩子的参数。

#### 局部注册

Vue.js 也同样支持局部注册，我们可以在一个组件内部使用 `components` 选项做组件的局部注册，例如：

```js
import HelloWorld from './components/HelloWorld'

export default {
  components: {
    HelloWorld
  }
}
```

其实理解了全局注册的过程，局部注册是非常简单的。在组件的 Vue 的实例化阶段有一个合并 `option` 的逻辑，之前我们也分析过，所以就把 `components` 合并到 `vm.$options.components` 上，这样我们就可以在 `resolveAsset` 的时候拿到这个组件的构造函数，并作为 `createComponent` 的钩子的参数。

注意，局部注册和全局注册不同的是，只有该类型的组件才可以访问局部注册的子组件，而全局注册是扩展到 `Vue.options` 下，所以在所有组件创建的过程中，都会从全局的 `Vue.options.components` 扩展到当前组件的 `vm.$options.components` 下，这就是全局注册的组件能被任意使用的原因。

### 异步组件

在我们平时的开发工作中，为了减少首屏代码体积，往往会把一些非首屏的组件设计成异步组件，按需加载。Vue 也原生支持了异步组件的能力，如下：

```js
Vue.component('async-example', function (resolve, reject) {
   // 这个特殊的 require 语法告诉 webpack
   // 自动将编译后的代码分割成不同的块，
   // 这些块将通过 Ajax 请求自动下载。
   require(['./my-async-component'], resolve)
})
```

示例中可以看到，Vue 注册的组件不再是一个对象，而是一个工厂函数，函数有两个参数 `resolve` 和 `reject`，函数内部用 `setTimout` 模拟了异步，实际使用可能是通过动态请求异步组件的 JS 地址，最终通过执行 `resolve` 方法，它的参数就是我们的异步组件对象。

在了解了异步组件如何注册后，我们从源码的角度来分析一下它的实现。

上一节我们分析了组件的注册逻辑，由于组件的定义并不是一个普通对象，所以不会执行 `Vue.extend` 的逻辑把它变成一个组件的构造函数，但是它仍然可以执行到 `createComponent` 函数，我们再来对这个函数做回顾，它的定义在 `src/core/vdom/create-component/js` 中：

```js
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  if (isUndef(Ctor)) {
    return
  }

  const baseCtor = context.$options._base

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }
  
  // ...

  // async component
  let asyncFactory
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context)
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }
}
```

我们省略了不必要的逻辑，只保留关键逻辑，由于我们这个时候传入的 `Ctor` 是一个函数，那么它也并不会执行 `Vue.extend` 逻辑，因此它的 `cid` 是 `undefiend`，进入了异步组件创建的逻辑。这里首先执行了 `Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context)` 方法，它的定义在 `src/core/vdom/helpers/resolve-async-component.js` 中：

```js
export function resolveAsyncComponent (
  factory: Function,
  baseCtor: Class<Component>,
  context: Component
): Class<Component> | void {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context)
  } else {
    const contexts = factory.contexts = [context]
    let sync = true

    const forceRender = () => {
      for (let i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate()
      }
    }

    const resolve = once((res: Object | Class<Component>) => {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor)
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender()
      }
    })

    const reject = once(reason => {
      process.env.NODE_ENV !== 'production' && warn(
        `Failed to resolve async component: ${String(factory)}` +
        (reason ? `\nReason: ${reason}` : '')
      )
      if (isDef(factory.errorComp)) {
        factory.error = true
        forceRender()
      }
    })

    const res = factory(resolve, reject)

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject)
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject)

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor)
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor)
          if (res.delay === 0) {
            factory.loading = true
          } else {
            setTimeout(() => {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true
                forceRender()
              }
            }, res.delay || 200)
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(() => {
            if (isUndef(factory.resolved)) {
              reject(
                process.env.NODE_ENV !== 'production'
                  ? `timeout (${res.timeout}ms)`
                  : null
              )
            }
          }, res.timeout)
        }
      }
    }

    sync = false
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}
```

`resolveAsyncComponent` 函数的逻辑略复杂，因为它实际上处理了 3 种异步组件的创建方式，除了刚才示例的组件注册方式，还支持 2 种，一种是支持 `Promise` 创建组件的方式，如下：

```js
Vue.component(
  'async-webpack-example',
  // 该 `import` 函数返回一个 `Promise` 对象。
  () => import('./my-async-component')
)
```

另一种是高级异步组件，如下：

```js
const AsyncComp = () => ({
  // 需要加载的组件。应当是一个 Promise
  component: import('./MyComp.vue'),
  // 加载中应当渲染的组件
  loading: LoadingComp,
  // 出错时渲染的组件
  error: ErrorComp,
  // 渲染加载中组件前的等待时间。默认：200ms。
  delay: 200,
  // 最长等待时间。超出此时间则渲染错误组件。默认：Infinity
  timeout: 3000
})
Vue.component('async-example', AsyncComp)
```

那么解下来，我们就根据这 3 种异步组件的情况，来分别去分析 `resolveAsyncComponent` 的逻辑。

#### 普通函数异步组件

针对普通函数的情况，前面几个 if 判断可以忽略，它们是为高级组件所用，对于 `factory.contexts` 的判断，是考虑到多个地方同时初始化一个异步组件，那么它的实际加载应该只有一次。接着进入实际加载逻辑，定义了 `forceRender`、`resolve` 和 `reject` 函数，注意 `resolve` 和 `reject` 函数用 `once` 函数做了一层包装，它的定义在 `src/shared/util.js` 中：

```js
/**
 * Ensure a function is called only once.
 */
export function once (fn: Function): Function {
  let called = false
  return function () {
    if (!called) {
      called = true
      fn.apply(this, arguments)
    }
  }
}
```

`once` 逻辑非常简单，传入一个函数，并返回一个新函数，它非常巧妙地利用闭包和一个标志位保证了它包装的函数只会执行一次，也就是确保 `resolve` 和 `reject` 函数只执行一次。

接下来执行 `const res = factory(resolve, reject)` 逻辑，这块儿就是执行我们组件的工厂函数，同时把 `resolve` 和 `reject` 函数作为参数传入，组件的工厂函数通常会先发送请求去加载我们的异步组件的 JS 文件，拿到组件定义的对象 `res` 后，执行 `resolve(res)` 逻辑，它会先执行 `factory.resolved = ensureCtor(res, baseCtor)`：

```js
function ensureCtor (comp: any, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}
```

这个函数目的是为了保证能找到异步组件 JS 定义的组件对象，并且如果它是一个普通对象，则调用 `Vue.extend` 把它转换成一个组件的构造函数。

`resolve` 逻辑最后判断了 `sync`，显然我们这个场景下 `sync` 为 false，那么就会执行 `forceRender` 函数，它会遍历 `factory.contexts`，拿到每一个调用异步组件的实例 `vm`, 执行 `vm.$forceUpdate()` 方法，它的定义在 `src/core/instance/lifecycle.js` 中：

```js
Vue.prototype.$forceUpdate = function () {
  const vm: Component = this
  if (vm._watcher) {
    vm._watcher.update()
  }
}
```

`$forceUpdate` 的逻辑非常简单，就是调用渲染 `watcher` 的 `update` 方法，让渲染 `watcher` 对应的回调函数执行，也就是触发了组件的重新渲染。之所以这么做是因为 Vue 通常是数据驱动视图重新渲染，但是在整个异步组件加载过程中是没有数据发生变化的，所以通过执行 `$forceUpdate` 可以强制组件重新渲染一次。

#### `Promise` 异步组件

```js
Vue.component(
  'async-webpack-example',
  // 该 `import` 函数返回一个 `Promise` 对象。
  () => import('./my-async-component')
)
```

webpack 2+ 支持了异步加载的语法糖：`() => import('./my-async-component')`，当执行完 `res = factory(resolve, reject)`，返回的值就是 `import('./my-async-component')` 的返回值，它是一个 `Promise` 对象。接着进入 if 条件，又判断了 `typeof res.then === 'function')`，条件满足，执行：

```js
if (isUndef(factory.resolved)) {
  res.then(resolve, reject)
}
```

当组件异步加载成功后，执行 `resolve`，加载失败则执行 `reject`，这样就非常巧妙地实现了配合 webpack 2+ 的异步加载组件的方式（`Promise`）加载异步组件。

#### 高级异步组件

由于异步加载组件需要动态加载 JS，有一定网络延时，而且有加载失败的情况，所以通常我们在开发异步组件相关逻辑的时候需要设计 loading 组件和 error 组件，并在适当的时机渲染它们。Vue.js 2.3+ 支持了一种高级异步组件的方式，它通过一个简单的对象配置，帮你搞定 loading 组件和 error 组件的渲染时机，你完全不用关心细节，非常方便。接下来我们就从源码的角度来分析高级异步组件是怎么实现的。

```js
const AsyncComp = () => ({
  // 需要加载的组件。应当是一个 Promise
  component: import('./MyComp.vue'),
  // 加载中应当渲染的组件
  loading: LoadingComp,
  // 出错时渲染的组件
  error: ErrorComp,
  // 渲染加载中组件前的等待时间。默认：200ms。
  delay: 200,
  // 最长等待时间。超出此时间则渲染错误组件。默认：Infinity
  timeout: 3000
})
Vue.component('async-example', AsyncComp)
```

高级异步组件的初始化逻辑和普通异步组件一样，也是执行 `resolveAsyncComponent`，当执行完 `res = factory(resolve, reject)`，返回值就是定义的组件对象，显然满足 `else if (isDef(res.component) && typeof res.component.then === 'function')` 的逻辑，接着执行 `res.component.then(resolve, reject)`，当异步组件加载成功后，执行 `resolve`，失败执行 `reject`。

因为异步组件加载是一个异步过程，它接着又同步执行了如下逻辑：

```js
if (isDef(res.error)) {
  factory.errorComp = ensureCtor(res.error, baseCtor)
}

if (isDef(res.loading)) {
  factory.loadingComp = ensureCtor(res.loading, baseCtor)
  if (res.delay === 0) {
    factory.loading = true
  } else {
    setTimeout(() => {
      if (isUndef(factory.resolved) && isUndef(factory.error)) {
        factory.loading = true
        forceRender()
      }
    }, res.delay || 200)
  }
}

if (isDef(res.timeout)) {
  setTimeout(() => {
    if (isUndef(factory.resolved)) {
      reject(
        process.env.NODE_ENV !== 'production'
          ? `timeout (${res.timeout}ms)`
          : null
      )
    }
  }, res.timeout)
}
```

先判断 `res.error` 是否定义了 error 组件，如果有的话则赋值给 `factory.errorComp`。 接着判断 `res.loading` 是否定义了 loading 组件，如果有的话则赋值给 `factory.loadingComp`，如果设置了 `res.delay` 且为 0，则设置 `factory.loading = true`，否则延时 `delay` 的时间执行：

```js
if (isUndef(factory.resolved) && isUndef(factory.error)) {
    factory.loading = true
    forceRender()
}
```

最后判断 `res.timeout`，如果配置了该项，则在 `res.timout` 时间后，如果组件没有成功加载，执行 `reject`。

在 `resolveAsyncComponent` 的最后有一段逻辑：

```js
sync = false
return factory.loading
  ? factory.loadingComp
  : factory.resolved
```

如果 `delay` 配置为 0，则这次直接渲染 loading 组件，否则则延时 `delay` 执行 `forceRender`，那么又会再一次执行到 `resolveAsyncComponent`。

那么这时候我们有几种情况，按逻辑的执行顺序，对不同的情况做判断。

##### 异步组件加载失败

当异步组件加载失败，会执行 `reject` 函数：

```js
const reject = once(reason => {
  process.env.NODE_ENV !== 'production' && warn(
    `Failed to resolve async component: ${String(factory)}` +
    (reason ? `\nReason: ${reason}` : '')
  )
  if (isDef(factory.errorComp)) {
    factory.error = true
    forceRender()
  }
})
```

这个时候会把 `factory.error` 设置为 `true`，同时执行 `forceRender()` 再次执行到 `resolveAsyncComponent`：

```js
if (isTrue(factory.error) && isDef(factory.errorComp)) {
  return factory.errorComp
}
```

那么这个时候就返回 `factory.errorComp`，直接渲染 error 组件。

##### 异步组件加载成功

当异步组件加载成功，会执行 `resolve` 函数：

```js
const resolve = once((res: Object | Class<Component>) => {
  factory.resolved = ensureCtor(res, baseCtor)
  if (!sync) {
    forceRender()
  }
})
```

首先把加载结果缓存到 `factory.resolved` 中，这个时候因为 `sync` 已经为 false，则执行 `forceRender()` 再次执行到 `resolveAsyncComponent`：

```js
if (isDef(factory.resolved)) {
  return factory.resolved
}
```

那么这个时候直接返回 `factory.resolved`，渲染成功加载的组件。

##### 异步组件加载中

如果异步组件加载中并未返回，这时候会走到这个逻辑：

```js
if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
  return factory.loadingComp
}
```

那么则会返回 `factory.loadingComp`，渲染 loading 组件。

##### 异步组件加载超时

如果超时，则走到了 `reject` 逻辑，之后逻辑和加载失败一样，渲染 error 组件。

#### 异步组件 patch

回到 `createComponent` 的逻辑：

```js
Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context)
if (Ctor === undefined) {
  return createAsyncPlaceholder(
    asyncFactory,
    data,
    context,
    children,
    tag
  )
}
```

如果是第一次执行 `resolveAsyncComponent`，除非使用高级异步组件 `0 delay` 去创建了一个 loading 组件，否则返回是 `undefiend`，接着通过 `createAsyncPlaceholder` 创建一个注释节点作为占位符。它的定义在 `src/core/vdom/helpers/resolve-async-components.js` 中：

```js
export function createAsyncPlaceholder (
  factory: Function,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag: ?string
): VNode {
  const node = createEmptyVNode()
  node.asyncFactory = factory
  node.asyncMeta = { data, context, children, tag }
  return node
}
```

实际上就是就是创建了一个占位的注释 VNode，同时把 `asyncFactory` 和 `asyncMeta` 赋值给当前 `vnode`。

当执行 `forceRender` 的时候，会触发组件的重新渲染，那么会再一次执行 `resolveAsyncComponent`，这时候就会根据不同的情况，可能返回 loading、error 或成功加载的异步组件，返回值不为 `undefined`，因此就走正常的组件 `render`、`patch` 过程，与组件第一次渲染流程不一样，这个时候是存在新旧 `vnode` 的，下一章我会分析组件更新的 `patch` 过程。

#### 总结

通过以上代码分析，我们对 Vue 的异步组件的实现有了深入的了解，知道了 3 种异步组件的实现方式，并且看到高级异步组件的实现是非常巧妙的，它实现了 loading、resolve、reject、timeout 4 种状态。异步组件实现的本质是 2 次渲染，除了 0 delay 的高级异步组件第一次直接渲染成 loading 组件外，其它都是第一次渲染生成一个注释节点，当异步获取组件成功后，再通过 `forceRender` 强制重新渲染，这样就能正确渲染出我们异步加载的组件了。



## 深入响应式原理

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/reactive.png)

### 响应式对象

#### initState

在 Vue 的初始化阶段，`_init` 方法执行的时候，会执行 initState(vm)

```js
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```

`initState` 方法主要是对 `props`、`methods`、`data`、`computed` 和 `wathcer` 等属性做了初始化操作。

##### initProps

`props` 的初始化主要过程，就是遍历定义的 `props` 配置。

遍历的过程主要做两件事情：

一个是调用 `defineReactive` 方法把每个 `prop` 对应的值变成响应式，可以通过 `vm._props.xxx` 访问到定义 `props` 中对应的属性

另一个是通过 `proxy` 把 `vm._props.xxx` 的访问代理到 `vm.xxx` 上

##### initData

`data` 的初始化主要过程也是做两件事

一个是对定义 `data` 函数返回对象的遍历，通过 `proxy` 把每一个值 `vm._data.xxx` 都代理到 `vm.xxx` 上

另一个是调用 `observe` 方法观测整个 `data` 的变化，把 `data` 也变成响应式，可以通过 `vm._data.xxx` 访问到定义 `data` 返回函数中对应的属性

#### proxy

代理的作用是把 `props` 和 `data` 上的属性代理到 `vm` 实例

```js
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

`proxy` 方法的实现很简单，通过 `Object.defineProperty` 把 `target[sourceKey][key]` 的读写变成了对 `target[key]`  的读写

所以对于 `props` 而言，对 `vm._props.xxx` 的读写变成了 `vm.xxx` 的读写，而对于 `vm._props.xxx` 我们可以访问到定义在 `props` 中的属性，所以我们就可以通过 `vm.xxx` 访问到定义在 `props` 中的 `xxx` 属性了

对于 `data` 而言，对 `vm._data.xxxx` 的读写变成了对 `vm.xxxx` 的读写，而对于 `vm._data.xxxx` 我们可以访问到定义在 `data` 函数返回对象中的属性，所以我们就可以通过 `vm.xxxx` 访问到定义在 `data` 函数返回对象中的 `xxxx` 属性了

#### observe

`observe` 的功能就是用来监测数据的变化

首先实例化 `Dep` 对象，接着通过执行 `def` 函数把自身实例添加到数据对象 `value` 的 `__ob__` 属性上

def` 函数是一个非常简单的`Object.defineProperty` 的封装，这就是为什么我在开发中输出 `data` 上对象类型的数据，会发现该对象多了一个 ``__ob__`` 的属性

```js
export function def (obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
```

 `Observer` 的构造函数，接下来会对 `value` 做判断，对于数组会调用 `observeArray` 方法，否则对纯对象调用 `walk` 方法。可以看到 `observeArray` 是遍历数组再次调用 `observe` 方法，而 `walk` 方法是遍历对象的 key 调用 `defineReactive` 方法

```js
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number;
  
  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) {  //需要判断数组类型
      const augment = hasProto
        ? protoAugment
        : copyAugment
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
	//不是数组就采用递归
  walk (obj: Object) {  
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }
	
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
```

#### defineReactive

`defineReactive` 的功能就是定义一个响应式对象，给对象动态添加 getter 和 setter

`defineReactive` 函数最开始初始化 `Dep` 对象的实例，接着拿到 `obj` 的属性描述符，然后对子对象递归调用 `observe` 方法，这样就保证了无论 `obj` 的结构多复杂，它的所有子属性也能变成响应式的对象，这样我们访问或修改 `obj` 中一个嵌套较深的属性，也能触发 getter 和 setter。最后利用 `Object.defineProperty` 去给 `obj` 的属性 `key` 添加 getter 和 setter

```js
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}
```

#### 总结

1.initState过程中initProps initData  一方面是为了转化为响应式

另一方面是为了进行代理 `vm._props.xxx` 的访问代理到 `vm.xxx` 上

`vm._data.xxx` 访问到定义 `data` 返回函数中对应的属性

2.实例化 `Dep` 对象，接着通过执行 `def` 函数把自身实例添加到数据对象 `value` 的 `__ob__` 属性上    def` 函数是一个非常简单的`Object.defineProperty` 的封装

3.`defineReactive` 函数最开始初始化 `Dep` 对象的实例

getter 会返回value   会执行dep.depend()  

 setter 会设置newvalue   会执行 dep.notify()

### 依赖收集

#### getter

`const dep = new Dep()` 实例化一个 `Dep` 的实例，另一个是在 `get` 函数中通过 `dep.depend` 做**依赖收集**

```js
Object.defineProperty(obj,key,{
    enumerable:true,
    configurable:true,
    get:function reactiveGetter(){
        const value=getter?getter.call(obj):val
        if(Dep.target){
            dep.depend()
            if(childOb){
                childOb.dep.depend()
                if(Array.isArray(value)){
                    dpendArray(value)
                }
            }
        }
    }
})
```

#### Dep

`Dep` 是整个 getter 依赖收集的核心

`Dep` 是一个 Class，它定义了一些属性和方法，这里需要特别注意的是它有一个静态属性 `target`，这是一个全局唯一 `Watcher`，这是一个非常巧妙的设计，因为在**同一时间**只能有一个全局的 `Watcher` 被计算，另外它的自身属性 `subs` 也是 `Watcher` 的数组。

`Dep` 实际上就是对 `Watcher` 的一种管理，`Dep`  脱离 `Watcher` 单独存在是没有意义的

```js
import type Watcher from './watcher'
import { remove } from '../util/index'

let uid = 0


export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}
//重置为空
Dep.target = null
const targetStack = []

export function pushTarget (_target: ?Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

export function popTarget () {
  Dep.target = targetStack.pop()
}
```

#### Watcher

Watcher` 是一个 Class，在它的构造函数中，定义了一些和 `Dep` 相关的属性：

```js
this.deps = []
this.newDeps = []
this.depIds = new Set()
this.newDepIds = new Set()
```

其中，`this.deps` 和 `this.newDeps` 表示 `Watcher` 实例持有的 `Dep` 实例的数组；而 `this.depIds` 和 `this.newDepIds` 分别代表 `this.deps` 和 `this.newDeps` 的 `id` Set

```js
let uid = 0

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
export default class Watcher {
  vm: Component;
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;
  computed: boolean;
  sync: boolean;
  dirty: boolean;
  active: boolean;
  dep: Dep;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: SimpleSet;
  newDepIds: SimpleSet;
  before: ?Function;
  getter: Function;
  value: any;

  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)
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
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.computed // for computed watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = function () {}
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    if (this.computed) {
      this.value = undefined
      this.dep = new Dep()
    } else {
      this.value = this.get()
    }
  }

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  get () {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }

  /**
   * Add a dependency to this directive.
   */
  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  /**
   * Clean up for dependency collection.
   */
  cleanupDeps () {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }
  // ...
}
```



#### 过程分析

之前我们介绍当对数据对象的访问会触发他们的 getter 方法，那么这些对象什么时候被访问呢？Vue 的 mount 过程是通过 `mountComponent` 函数，其中有一段比较重要的逻辑，大致如下：

```js
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
new Watcher(vm, updateComponent, noop, {
  before () {
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate')
    }
  }
}, true /* isRenderWatcher */)
```

当我们去实例化一个渲染 `watcher` 的时候，首先进入 `watcher` 的构造函数逻辑，然后会执行它的 `this.get()` 方法，进入 `get` 函数，首先会执行：

```js
pushTarget(this)
```

`pushTarget` 的定义在 `src/core/observer/dep.js` 中：

```js
export function pushTarget (_target: Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}
```

实际上**就是把 `Dep.target` 赋值为当前的渲染 `watcher` 并压栈**（为了恢复用）。接着又执行了：

```js
value = this.getter.call(vm, vm)
```

`this.getter` 对应就是 `updateComponent` 函数，这实际上就是在执行：

```js
vm._update(vm._render(), hydrating)
```

它会先执行 `vm._render()` 方法，因为之前分析过这个方法会生成 渲染 VNode，并且在这个过程中会对 `vm` 上的数据访问，这个时候就触发了数据对象的 getter。

那么每个对象值的 getter 都持有一个 `dep`，在触发 getter 的时候会调用 `dep.depend()` 方法，也就会执行 `Dep.target.addDep(this)`。

刚才我们提到这个时候 `Dep.target` 已经被赋值为渲染 `watcher`，那么就执行到 `addDep` 方法：

```js
addDep (dep: Dep) {
  const id = dep.id
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id)
    this.newDeps.push(dep)
    if (!this.depIds.has(id)) {
      dep.addSub(this)
    }
  }
}
```

这时候会做一些逻辑判断（保证同一数据不会被添加多次）后执行 `dep.addSub(this)`，那么就会执行 `this.subs.push(sub)`，也就是说把当前的 `watcher` 订阅到这个数据持有的 `dep` 的 `subs` 中，这个目的是为后续数据变化时候能通知到哪些 `subs` 做准备。

所以在 `vm._render()` 过程中，会触发所有数据的 getter，这样实际上已经完成了一个依赖收集的过程。那么到这里就结束了么，其实并没有，在完成依赖收集后，还有几个逻辑要执行，首先是：

```js
if (this.deep) {
  traverse(value)
}
```

这个是要递归去访问 `value`，触发它所有子项的 `getter`，这个之后会详细讲。接下来执行：

```js
popTarget()
```

`popTarget` 的定义在 `src/core/observer/dep.js` 中：

```js
Dep.target = targetStack.pop()
```

实际上就是把 `Dep.target` 恢复成上一个状态，因为当前 vm 的数据依赖收集已经完成，那么对应的渲染`Dep.target` 也需要改变。最后执行：

```js
this.cleanupDeps()
```

其实很多人都分析过并了解到 Vue 有依赖收集的过程，但我几乎没有看到有人分析依赖清空的过程，其实这是大部分同学会忽视的一点，也是 Vue 考虑特别细的一点。

```js
cleanupDeps () {
  let i = this.deps.length
  while (i--) {
    const dep = this.deps[i]
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this)
    }
  }
  let tmp = this.depIds
  this.depIds = this.newDepIds
  this.newDepIds = tmp
  this.newDepIds.clear()
  tmp = this.deps
  this.deps = this.newDeps
  this.newDeps = tmp
  this.newDeps.length = 0
}
```

考虑到 Vue 是数据驱动的，所以每次数据变化都会重新 render，那么 `vm._render()` 方法又会再次执行，并再次触发数据的 getters，所以 `Watcher` 在构造函数中会初始化 2 个 `Dep` 实例数组，`newDeps` 表示**新添加**的 `Dep` 实例数组，而 `deps` 表示**上一次添加**的 `Dep` 实例数组。

在执行 `cleanupDeps` 函数的时候，会首先遍历 `deps`，移除对 `dep.subs` 数组中 `Wathcer` 的订阅，然后把 `newDepIds` 和 `depIds` 交换，`newDeps` 和 `deps` 交换，并把 `newDepIds` 和 `newDeps` 清空。

那么为什么需要做 `deps` 订阅的移除呢，在添加 `deps` 的订阅过程，已经能通过 `id` 去重避免重复订阅了。

考虑到一种场景，我们的模板会根据 `v-if` 去渲染不同子模板 a 和 b，当我们满足某种条件的时候渲染 a 的时候，会访问到 a 中的数据，这时候我们对 a 使用的数据添加了 getter，做了依赖收集，那么当我们去修改 a 的数据的时候，理应通知到这些订阅者。那么如果我们一旦改变了条件渲染了 b 模板，又会对 b 使用的数据添加了 getter，如果我们没有依赖移除的过程，那么这时候我去修改 a 模板的数据，会通知 a 数据的订阅的回调，这显然是有浪费的。

因此 **Vue 设计了在每次添加完新的订阅，会移除掉旧的订阅，这样就保证了在我们刚才的场景中，如果渲染 b 模板的时候去修改 a 模板的数据，a 数据订阅回调已经被移除了，所以不会有任何浪费，真的是非常赞叹 Vue 对一些细节上的处理**。

#### 总结

1.Vue 的 mount 过程中通过 `mountComponent` 函数 进行`new Watcher()`

2.先执行构造函数 然后执行this.get()  

3.进入get()  首先会执行`pushTarget(this)`

4.在pushTarget中会 把`Dep.target` 赋值为当前的渲染 `watcher` 并压栈

5.然后执行了 `value = this.getter.call(vm, vm)`，`this.getter` 对应就是 `updateComponent` 函数 实际上是在执行 `vm._update(vm._render(), hydrating)`  

6.会先执行 `vm._render()` 方法  生成 渲染 VNode，并且在这个**过程中会对 `vm` 上的数据访问**，这个时候就**触发了数据对象的 getter**

7.每个对象值的 getter 都持有一个 `dep`，在触发 getter 的时候会调用 `dep.depend()` 方法，也就会执行 `Dep.target.addDep(this)`  第四步 的时候 `Dep.target` 已经被赋值为 `watcher` **所以能执行Watcher的方法addDep**   而这个this是Dep， addDep内会执行dep的addSub

```js

Dep内部 
 addSub (sub: Watcher) {
    this.subs.push(sub)  
  }
  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)   Dep.target是watcher
                                this传的是watcher  
    }
  }


Watcher内部
 addDep (dep: Dep) {   
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }
```

8.addSub内执行 `this.subs.push(sub)`，也就是说把当前的 `watcher` 订阅到这个数据持有的 `dep` 的 `subs` 中，这个目的是为后续数据变化时候能通知到哪些 `subs` 做准备   **实际上就是 执行在watcher内执行了dep的addsub方法把自己（Watcher给加了进去）**     

9.在 `vm._render()` 过程中，会触发所有数据的 getter，这样实际上已经完成了一个依赖收集的过程   然后进行收尾工作

10.递归去访问 `value`，触发它所有子项的 `getter`

`if (this.deep) {   traverse(value)    }`

11.然后执行Dep内部的`popTarget()`  把 `Dep.target` 恢复成上一个状态

因为当前 vm 的数据依赖收集已经完成，那么对应的渲染`Dep.target` 也需要改变

12.最后执行Watcher的cleanupDeps()方法  依赖清空

13.考虑到 Vue 是数据驱动的，所以每次数据变化都会重新 render，那么 `vm._render()` 方法又会再次执行，并再次触发数据的 getters，所以 `Watcher` 在构造函数中会初始化 2 个 `Dep` 实例数组，`newDeps` 表示**新添加**的 `Dep` 实例数组，而 `deps` 表示**上一次添加**的 `Dep` 实例数组

在执行 `cleanupDeps` 函数的时候，会首先遍历 `deps`，移除对 `dep.subs` 数组中 `Wathcer` 的订阅，然后把 `newDepIds` 和 `depIds` 交换，`newDeps` 和 `deps` 交换，并把 `newDepIds` 和 `newDeps` 清空。

### 派发更新

收集的目的就是为了当我们修改数据的时候，可以对相关的依赖派发更新

#### setter

```js
set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
```

setter 的逻辑有 2 个关键的点，

一个是 `childOb = !shallow && observe(newVal)`，如果 `shallow` 为 false 的情况，会对新设置的值变成一个响应式对象；

另一个是 `dep.notify()`，通知所有的订阅者

#### 过程分析

在组件中对响应的数据做了修改，就会触发 setter 的逻辑，最后调用 `dep.notify()` 方法， 它是 `Dep` 的一个实例方法

```js
class Dep {
  // ...
  notify () {
  // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}
```

遍历所有的 `subs`，也就是 `Watcher` 的实例数组，然后调用每一个 `watcher` 的 `update` 方法

```js
class Watcher {
  // ...
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
} 
```

对于 `Watcher` 的不同状态，会执行不同的逻辑

在一般组件数据更新的场景，会走到最后一个 `queueWatcher(this)` 的逻辑

在scheduler中

```js
const queue: Array<Watcher> = []
let has: { [key: number]: ?true } = {}
let waiting = false
let flushing = false
/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}
```

这里引入了一个队列的概念，这也是 Vue 在做派发更新的时候的一个优化的点，它并不会**每次数据改变**都触发 `watcher` 的回调，而是把这些 `watcher` 先添加到一个队列里，然后在 `nextTick` 后执行 `flushSchedulerQueue`

首先用 `has` 对象保证同一个 `Watcher` 只添加一次；接着对 `flushing` 的判断；最后通过 `waiting` 保证对 `nextTick(flushSchedulerQueue)` 的调用逻辑只有一次，可以理解它是在下一个 tick，也就是异步的去执行 `flushSchedulerQueue`

`flushSchedulerQueue` 的实现

```js
let flushing = false
let index = 0
/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true
  let watcher, id

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort((a, b) => a.id - b.id)

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    if (watcher.before) {
      watcher.before()
    }
    id = watcher.id
    has[id] = null
    watcher.run()
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? `in watcher with expression "${watcher.expression}"`
              : `in a component render function.`
          ),
          watcher.vm
        )
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  const activatedQueue = activatedChildren.slice()
  const updatedQueue = queue.slice()

  resetSchedulerState()

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue)
  callUpdatedHooks(updatedQueue)

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush')
  }
}
```

- 队列排序

`queue.sort((a, b) => a.id - b.id)` 对队列做了**从小到大的排序**，这么做主要有以下要确保以下几点：

1.组件的更新**由父到子**；因为父组件的创建过程是先于子的，所以 `watcher` 的创建也是先父后子，执行顺序也应该保持先父后子。

2.用户的自定义 `watcher` 要优先于渲染 `watcher` 执行；因为用户自定义 `watcher` 是在渲染 `watcher` 之前创建的。

3.如果一个组件在父组件的 `watcher` 执行期间被销毁，那么它对应的 `watcher` 执行都可以被跳过，所以父组件的 `watcher` 应该先执行。

- 队列遍历

在对 `queue` 排序后，接着就是要对它做遍历，拿到对应的 `watcher`，执行 `watcher.run()`。这里需要注意一个细节，在遍历的时候每次都会对 `queue.length` 求值，因为在 `watcher.run()` 的时候，很可能用户会再次添加新的 `watcher`，这样会再次执行到 `queueWatcher`，如下：

```js
export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // ...
  }
}
```

可以看到，这时候 `flushing` 为 true，就会执行到 else 的逻辑，然后就会**从后往前找**，找到第一个待插入 `watcher` 的 id 比当前队列中 `watcher` 的 id **大的位置**。把 `watcher` 按照 `id`的插入到队列中，因此 `queue` 的长度发生了变化。

- 状态恢复

这个过程就是执行 `resetSchedulerState` 函数，它的定义在 `src/core/observer/scheduler.js` 中。

```js
const queue: Array<Watcher> = []
let has: { [key: number]: ?true } = {}
let circular: { [key: number]: number } = {}
let waiting = false
let flushing = false
let index = 0
/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0
  has = {}
  if (process.env.NODE_ENV !== 'production') {
    circular = {}
  }
  waiting = flushing = false
}
```

逻辑非常简单，就是把这些**控制流程状态的一些变量恢复到初始值**，把 `watcher` 队列清空

`watcher.run()` 的逻辑

```js
class Watcher {
  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  run () {
    if (this.active) {
      this.getAndInvoke(this.cb)
    }
  }

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
}
```

`run` 函数实际上就是执行 `this.getAndInvoke` 方法，并传入 `watcher` 的回调函数。`getAndInvoke` 函数逻辑也很简单，先通过 `this.get()` 得到它当前的值，然后做判断，如果满足新旧值不等、新值是对象类型、`deep` 模式任何一个条件，则执行 `watcher` 的回调，注意回调函数执行的时候会把第一个和第二个参数传入新值 `value` 和旧值 `oldValue`，这就是当我们添加自定义 `watcher` 的时候能在回调函数的参数中拿到新旧值的原因。

那么对于渲染 `watcher` 而言，它在执行 `this.get()` 方法求值的时候，会执行 `getter` 方法：

```js
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
```

所以这就是当我们去修改组件相关的响应式数据的时候，会触发组件重新渲染的原因，接着就会重新执行 `patch` 的过程，但它和首次渲染有所不同

#### 总结

1.修改数据，触发 setter 的逻辑，调用 `dep.notify()` 方法

2.dep.notify() 遍历所有的 `subs`，也就是 `Watcher` 的实例数组，然后调用每一个 `watcher` 的 `update` 方法

3.update()方法   对于 `Watcher` 的不同状态，会执行不同的逻辑

组件更新  会走到最后一个 `queueWatcher(this)` 的逻辑

4.Vue 在做派发更新的时候，并不会每次数据改变都触发 `watcher` 的回调，而是把这些 `watcher` 先添加到一个队列里，然后在 `nextTick` 后执行 `flushSchedulerQueue`

5.`flushSchedulerQueue` 的实现   

**队列排序**`queue.sort((a, b) => a.id - b.id)` 对队列做了从小到大的排序

**队列遍历** 在对 `queue` 排序后，接着就是要对它做遍历，拿到对应的 `watcher`，执行 `watcher.run()`  在遍历的时候每次都会对 `queue.length` 求值

**状态恢复** 执行 `resetSchedulerState` 函数  把控制流程状态的一些变量恢复到初始值，把 `watcher` 队列清空

6.watcher.run() 实际上就是执行 `this.getAndInvoke` 方法，并**传入 `watcher` 的回调函数**

`getAndInvoke` 函数   先通过 `this.get()` 得到它当前的值，然后做判断，如果满足新旧值不等、新值是对象类型、`deep` 模式任何一个条件，则执行 `watcher` 的回调，注意回调函数执行的时候会把第一个和第二个参数传入新值 `value` 和旧值 `oldValue`，这就是当我们添加自定义 `watcher` 的时候能在回调函数的参数中拿到新旧值的原因

```js
getAndInvoke (cb: Function) {
    const value = this.get()
    if (
      value !== this.value ||
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
```

7.对于渲染 `watcher` 而言，它在执行 `this.get()` 方法求值的时候，会执行 `getter` 方法：

`updateComponent = () => {   vm._update(vm._render(), hydrating)    }`

当我们去修改组件相关的响应式数据的时候，会触发组件重新渲染

### nextTick

#### JS 运行机制

JS 执行是单线程的，它是基于事件循环的。事件循环大致分为以下几个步骤：

（1）所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。

（2）主线程之外，还存在一个"任务队列"（task queue）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。

（3）一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行

（4）主线程不断重复上面的第三步

主线程的执行过程就是一个 tick，而所有的异步结果都是通过 “任务队列” 来调度。 消息队列中存放的是一个个的任务（task）。 规范中规定 task 分为两大类，分别是 macro task 和 micro task，并且每个 macro task 结束后，都要处理所有的 micro task

```js
for (macroTask of macroTaskQueue) {
    // 1. Handle current MACRO-TASK
    handleMacroTask();
      
    // 2. Handle all MICRO-TASK
    for (microTask of microTaskQueue) {
        handleMicroTask(microTask);
    }
}
```

在浏览器环境中，常见的 macro task 有 setTimeout、MessageChannel、postMessage、setImmediate；常见的 micro task 有 MutationObsever 和 Promise.then

#### Vue的实现

next-tick.js

```js
import { noop } from 'shared/util'
import { handleError } from './error'
import { isIOS, isNative } from './env'

const callbacks = []
let pending = false

function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

let microTimerFunc
let macroTimerFunc
let useMacroTask = false


if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  const channel = new MessageChannel()
  const port = channel.port2
  channel.port1.onmessage = flushCallbacks
  macroTimerFunc = () => {
    port.postMessage(1)
  }
} else {
  /* istanbul ignore next */
  macroTimerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  microTimerFunc = () => {
    p.then(flushCallbacks)

    if (isIOS) setTimeout(noop)
  }
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc
}


export function withMacroTask (fn: Function): Function {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true
    const res = fn.apply(null, arguments)
    useMacroTask = false
    return res
  })
}

export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    if (useMacroTask) {
      macroTimerFunc()
    } else {
      microTimerFunc()
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```

申明了 `microTimerFunc` 和 `macroTimerFunc` 2 个变量，它们分别对应的是 micro task 的函数和 macro task 的函数

对于 macro task 的实现，优先检测是否支持原生 `setImmediate`，这是一个高版本 IE 和 Edge 才支持的特性，不支持的话再去检测是否支持原生的 `MessageChannel`，如果也不支持的话就会降级为 `setTimeout 0`

对于 micro task 的实现，则检测浏览器是否原生支持 Promise，不支持的话直接指向 macro task 的实现  新版本废弃了mutationOberserver

对外暴露了 2 个函数，先来看 `nextTick`，在派发更新时`nextTick(flushSchedulerQueue)` 所用到的函数。  

它的逻辑也很简单，把传入的回调函数 `cb` 压入 `callbacks` 数组，最后一次性地根据 `useMacroTask` 条件执行 `macroTimerFunc` 或者是 `microTimerFunc`，

而它们都会在下一个 tick 执行 `flushCallbacks`，`flushCallbacks` 的逻辑非常简单，对 `callbacks` 遍历，然后执行相应的回调函数。

这里使用 `callbacks` 而不是直接在 `nextTick` 中执行回调函数的原因是保证在同一个 tick 内多次执行 `nextTick`，不会开启多个异步任务，而把这些异步任务都压成一个同步任务，在下一个 tick 执行完毕

`withMacroTask`函数的作用是给回调函数做一层包装,当事件触发时,如果因为回调中修改了数据而触发更新`DOM`的操作,那么该更新操作会被推送到宏任务( `macrotask` )的任务队列中

`nextTick` 函数最后还有一段逻辑：

```js
 if (!cb && typeof Promise !== 'undefined') {
  return new Promise(resolve => {
    _resolve = resolve
  })
}
```

当 `nextTick` 不传 `cb` 参数的时候，提供一个 Promise 化的调用，比如：

```js
nextTick().then(() => {})
```

当 `_resolve` 函数执行，就会跳到 `then` 的逻辑中

` 还对外暴露了 `withMacroTask` 函数，它是对函数做一层包装，确保函数执行过程中对数据任意的修改，触发变化执行 `nextTick` 的时候强制走 `macroTimerFunc`。比如对于一些 DOM 交互事件，如 `v-on` 绑定的事件回调函数的处理，会强制走 macro task

#### 总结

1.结合setter 分析，了解到数据的变化到 DOM 的重新渲染是一个异步过程，发生在下一个 tick

`microTimerFunc` 和 `macroTimerFunc` 2 个变量，它们分别对应的是 micro task 的函数和 macro task 的函数  函数会传入flushCallbacks

2.macro task 会分别检测 setImmediate  MessageChannel 都不支持则 setTimeout 0

micro task  会检测是否原生支持 Promise，不支持的话直接指向 macro task 的实现

3.在派发更新时候 传入的回调函数 `cb` 压入 `callbacks` 数组，最后一次性地根据 `useMacroTask` 条件执行  都会在下一个 tick 执行 `flushCallbacks`，对 `callbacks` 遍历，然后执行相应的回调函数

4.使用 `callbacks`保证在同一个 tick 内多次执行 `nextTick`，不会开启多个异步任务，而把这些异步任务都压成一个同步任务   

5.nexttick使用场景  比如从服务端接口去获取数据的时候，数据做了修改，如果我们的某些方法去依赖了数据修改后的 DOM 变化，我们就必须在 `nextTick` 后执行

```js
getData(res).then(()=>{
  this.xxx = res.data
  this.$nextTick(() => {
    // 这里我们可以获取变化后的 DOM
  })
})
```

Vue.js 提供了 2 种调用 `nextTick` 的方式，一种是全局 API `Vue.nextTick`，一种是实例上的方法 `vm.$nextTick`，无论我们使用哪一种，最后都是调用 `next-tick.js` 中实现的 `nextTick` 方法

### 检测变化的注意事项

#### 对象添加属性

对于使用 `Object.defineProperty` 实现响应式的对象，当我们去给这个对象添加一个新的属性的时候，是不能够触发它的 setter 的，比如：

```js
var vm = new Vue({
  data:{
    a:1
  }
})
// vm.b 是非响应的
vm.b = 2
```

添加新属性的场景我们在平时开发中会经常遇到，那么 Vue 为了解决这个问题，定义了一个全局 API `Vue.set` 方法

在`src/core/global-api/index.js`中 初始化`Vue.set = set`

在 `src/core/observer/index.js` 中   定义set方法

```js
export function set (target: Array<any> | Object, key: any, val: any): any {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  if (!ob) {
    target[key] = val
    return val
  }
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}
```

`set` 方法接收 3个参数，`target` 可能是数组或者是普通对象，`key` 代表的是数组的下标或者是对象的键值，`val` 代表添加的值

首先判断如果 `target` 是数组且 `key` 是一个合法的下标，则之前通过 `splice` 去添加进数组然后返回，这里的 `splice` 其实已经不仅仅是原生数组的 `splice` 了

然后判断 `key` 已经存在于 `target` 中，则直接赋值返回，因为这样的变化是可以观测到了

再获取到 `target.__ob__` 并赋值给 `ob`，它是在 `Observer` 的构造函数执行的时候初始化的，表示 `Observer` 的一个实例，如果它不存在，则说明 `target` 不是一个响应式的对象，则直接赋值并返回

最后通过 `defineReactive(ob.value, key, val)` 把新添加的属性变成响应式对象，然后再通过 `ob.dep.notify()` 手动的触发依赖通知

在 getter 过程中判断了 `childOb`，并调用了 `childOb.dep.depend()` 收集了依赖，这就是为什么执行 `Vue.set` 的时候通过 `ob.dep.notify()` 能够通知到 `watcher`，从而让添加新的属性到对象也可以检测到变化。这里如果 `value` 是个数组，那么就通过 `dependArray` 把数组每个元素也去做依赖收集

```js
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // ...
  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    // ...
  })
}
```

#### 数组

接着说一下数组的情况，Vue 也是不能检测到以下变动的数组：

1.当你利用索引直接设置一个项时，例如：`vm.items[indexOfItem] = newValue`

2.当你修改数组的长度时，例如：`vm.items.length = newLength`

对于第一种情况，可以使用：`Vue.set(example1.items, indexOfItem, newValue)`；而对于第二种情况，可以使用 `vm.items.splice(newLength)`。

对于 `Vue.set` 的实现，当 `target` 是数组的时候，也是通过 `target.splice(key, 1, val)` 来添加的，能让添加的对象变成响应式的呢。

在通过 `observe` 方法去观察对象的时候会实例化 `Observer`，在它的构造函数中是专门对数组做了处理，它的定义在 `src/core/observer/index.js` 中。

```js
export class Observer {
  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      const augment = hasProto
        ? protoAugment
        : copyAugment
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {
      // ...
    }
  }
}
```

这里我们只需要关注 `value` 是 Array 的情况，首先获取 `augment`，这里的 `hasProto` 实际上就是判断对象中是否存在 `__proto__`，如果存在则 `augment` 指向 `protoAugment`， 否则指向 `copyAugment`，来看一下这两个函数的定义：

```js
/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src: Object, keys: any) {
  /* eslint-disable no-proto */
  target.__proto__ = src
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}
```

`protoAugment` 方法是直接把 `target.__proto__` 原型直接修改为 `src`，而 `copyAugment` 方法是遍历 keys，通过 `def`，也就是 `Object.defineProperty` 去定义它自身的属性值。

对于大部分现代浏览器都会走到 `protoAugment`，那么它实际上就把 `value` 的原型指向了 `arrayMethods`，`arrayMethods` 的定义在 `src/core/observer/array.js` 中：

```js
import { def } from '../util/index'

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})
```

可以看到，通过以Array.prototype为原型来构造，使得`arrayMethods` 首先继承了 `Array`，

然后对数组中所有能改变数组自身的方法，如 `push、pop` 等这些方法进行重写。重写后的方法会先执行它们本身原有的逻辑，并对能增加数组长度的 3 个方法 `push、unshift、splice` 方法做了判断，获取到插入的值，

然后把新添加的值变成一个响应式对象，并且再调用 `ob.dep.notify()` 手动触发依赖通知，这就很好地解释了之前的示例中调用 `vm.items.splice(newLength)` 方法可以检测到变化

#### 总结

**对象添加属性**

1.给对象添加一个新的属性，需要使用Vue.set(target,key,value)  

2.如果 `target` 是**数组**且 `key` 是一个合法的下标，则之前通过 `splice` 去添加进数组然后返回

3.接着又判断 `key` 已经存在于 `target` 中，则直接赋值返回，因为这样的变化是可以观测到了

4.再获取到 `target.__ob__` 并赋值给 `ob`，之前分析过它是在 `Observer` 的构造函数执行的时候初始化的，表示 `Observer` 的一个实例，如果它不存在，则说明 `target` 不是一个响应式的对象，则直接赋值并返回

5.最后通过 `defineReactive(ob.value, key, val)` 把新添加的属性变成响应式对象，然后再通过 `ob.dep.notify()` 手动的触发依赖通知

**数组**

1.根据索引更改数组和长度修改， `Observer`在它的构造函数中是专门对数组做了处理

2.`value` 是 Array 的情况，首先获取 `augment`，这里的 `hasProto` 实际上就是判断对象中是否存在 `__proto__`，如果存在则 `augment` 指向 `protoAugment`， 实现`target.__proto__ = src`  否则指向 `copyAugment` 遍历 keys，通过 `def`，也就是 `Object.defineProperty` 去定义它自身的属性值  

3.对于大部分现代浏览器都会走到 `protoAugment`，那么它实际上就把 `value` 的原型指向了 `arrayMethods`

```js
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
```

4.`arrayMethods` 通过以Array.prototype为**原型来构造**，使得`arrayMethods` 首先继承了 `Array`，然后对数组中所有**能改变数组自身**的方法，如 `push、pop` 等这些方法进行重写

```js
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})
```

5.对能增加数组长度的 3 个方法 `push、unshift、splice` 方法做了判断，获取到插入的值，然后把新添加的值变成一个**响应式对象** 再调用 `ob.dep.notify()` 手动触发依赖通知

调用 `vm.items.splice(newLength)` 方法可以检测到变化

### 计算属性 VS 侦听属性

#### computed

计算属性的初始化是发生在 Vue 实例初始化阶段的 `initState` 函数中，执行了 `if (opts.computed) initComputed(vm, opts.computed)` `initComputed` 的定义在 `src/core/instance/state.js` 中：

```js
const computedWatcherOptions = { computed: true }
function initComputed (vm: Component, computed: Object) {
  // $flow-disable-line
  const watchers = vm._computedWatchers = Object.create(null)
  // computed properties are just getters during SSR
  const isSSR = isServerRendering()

  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        `Getter is missing for computed property "${key}".`,
        vm
      )
    }

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
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      }
    }
  }
}
```

函数首先创建 `vm._computedWatchers` 为一个空对象，

接着对 `computed` **对象做遍历**，拿到计算属性的每一个 `userDef`，然后尝试获取这个 `userDef` 对应的 `getter` 函数，拿不到则在开发环境下报警告。

接下来为每一个 `getter` 创建一个 `watcher`，这个 `watcher` 和渲染 `watcher` 有一点很大的不同，它是一个 `computed watcher`，因为 设置了`const computedWatcherOptions = { computed: true }`。`computed watcher` 和普通 `watcher` 存在差别。

最后对判断如果 `key` 不是 `vm` 的属性，则调用 `defineComputed(vm, key, userDef)`，否则判断计算属性对于的 `key` 是否已经被 `data` 或者 `prop` 所占用，如果是的话则在开发环境报相应的警告。

`defineComputed` 的实现

```js
export function defineComputed (
  target: any,
  key: string,
  userDef: Object | Function
) {
  const shouldCache = !isServerRendering()
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : userDef
    sharedPropertyDefinition.set = noop
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop
  }
  if (process.env.NODE_ENV !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        `Computed property "${key}" was assigned to but it has no setter.`,
        this
      )
    }
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

利用 `Object.defineProperty` 给计算属性对应的 `key` 值添加 getter 和 setter

setter 通常是计算属性是一个对象，并且拥有 `set` 方法的时候才有，否则是一个空函数

平时的开发场景中，计算属性有 setter 的情况比较少

 getter 部分，缓存的配置也先忽略，最终 getter 对应的是 `createComputedGetter(key)` 的返回值

```js
function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      watcher.depend()
      return watcher.evaluate()
    }
  }
}
```

`createComputedGetter` 返回一个函数 `computedGetter`，它就是计算属性对应的 getter

#### computed watcher实现过程

```js
var vm = new Vue({
  data: {
    firstName: 'Foo',
    lastName: 'Bar'
  },
  computed: {
    fullName: function () {
      return this.firstName + ' ' + this.lastName
    }
  }
})
```

当初始化这个 `computed watcher` 实例的时候，构造函数部分逻辑稍有不同：

```js
constructor (
  vm: Component,
  expOrFn: string | Function,
  cb: Function,
  options?: ?Object,
  isRenderWatcher?: boolean
) {
  // ...
  if (this.computed) {
    this.value = undefined
    this.dep = new Dep()
  } else {
    this.value = this.get()
  }
}  
```

可以发现 `computed watcher` 会并不会立刻求值，但是同时持有一个 `dep` 实例。

然后当我们的 `render` 函数执行访问到 `this.fullName` 的时候，就触发了计算属性的 `getter`，它会拿到计算属性对应的 `watcher`，然后执行 `watcher.depend()`，来看一下它的定义：

```js
/**
  * Depend on this watcher. Only for computed property watchers.
  */
depend () {
  if (this.dep && Dep.target) {
    this.dep.depend()
  }
}
```

注意，这时候的 `Dep.target` 是渲染 `watcher`，所以 `this.dep.depend()` 相当于渲染 `watcher` 订阅了这个 `computed watcher` 的变化。

然后再执行 `watcher.evaluate()` 去求值，来看一下它的定义：

```js
/**
  * Evaluate and return the value of the watcher.
  * This only gets called for computed property watchers.
  */
evaluate () {
  if (this.dirty) {
    this.value = this.get()
    this.dirty = false
  }
  return this.value
}
```

`evaluate` 的逻辑非常简单，判断 `this.dirty`，如果为 `true` 则通过 `this.get()` 求值，然后把 `this.dirty` 设置为 false。在求值过程中，会执行 `value = this.getter.call(vm, vm)`，这实际上就是执行了计算属性定义的 `getter` 函数，在我们这个例子就是执行了 `return this.firstName + ' ' + this.lastName`。

这里需要特别注意的是，由于 `this.firstName` 和 `this.lastName` 都是响应式对象，这里会触发它们的 getter，根据我们之前的分析，它们会把自身持有的 `dep` 添加到当前正在计算的 `watcher` 中，这个时候 `Dep.target` 就是这个 `computed watcher`。

最后通过 `return this.value` 拿到计算属性对应的值。我们知道了计算属性的求值过程，那么接下来看一下它依赖的数据变化后的逻辑。

一旦我们对计算属性依赖的数据做修改，则会触发 setter 过程，通知所有订阅它变化的 `watcher` 更新，执行 `watcher.update()` 方法：

```js
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
```

那么对于计算属性这样的 `computed watcher`，它实际上是有 2 种模式，lazy 和 active。如果 `this.dep.subs.length === 0` 成立，则说明没有人去订阅这个 `computed watcher` 的变化，仅仅把 `this.dirty = true`，只有当下次再访问这个计算属性的时候才会重新求值。在我们的场景下，渲染 `watcher` 订阅了这个 `computed watcher` 的变化，那么它会执行：

```js
this.getAndInvoke(() => {
  this.dep.notify()
})

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

`getAndInvoke` 函数会重新计算，然后对比新旧值，如果变化了则执行回调函数，那么这里这个回调函数是 `this.dep.notify()`，在我们这个场景下就是触发了渲染 `watcher` 重新渲染。

通过以上的分析，我们知道计算属性本质上就是一个 `computed watcher`，也了解了它的创建过程和被访问触发 getter 以及依赖更新的过程，其实这是最新的计算属性的实现，之所以这么设计是因为 Vue 想确保不仅仅是计算属性依赖的值发生变化，而是当计算属性最终计算的值发生变化才会触发渲染 `watcher` 重新渲染，本质上是一种优化。

#### watch

**侦听属性**的初始化也是发生在 Vue 的实例初始化阶段的 `initState` 函数中，在 `computed` 初始化之后，执行了：

```js
if (opts.watch && opts.watch !== nativeWatch) {
  initWatch(vm, opts.watch)
}
```

来看一下 `initWatch` 的实现，它的定义在 `src/core/instance/state.js` 中：

```js
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

这里就是对 `watch` 对象做遍历，拿到每一个 `handler`，因为 Vue 是支持 `watch` 的同一个 `key` 对应**多个** `handler`，所以如果 `handler` 是一个**数组**，则**遍历这个数组**，调用 `createWatcher` 方法，否则**直接调用** `createWatcher`：

```js
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

这里的逻辑也很简单，首先对 `hanlder` 的类型做判断，拿到它最终的回调函数，最后调用 `vm.$watch(keyOrFn, handler, options)` 函数，`$watch` 是 Vue 原型上的方法，它是在执行 `stateMixin` 的时候定义的：

```js
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
```

也就是说，侦听属性 `watch` 最终会调用 `$watch` 方法，

这个方法首先**判断** `cb` 如果是一个对象，则调用 `createWatcher` 方法，这是因为 `$watch` 方法是用户**可以直接调用**的，它可以传递一个对象，也可以传递函数。

接着执行 `const watcher = new Watcher(vm, expOrFn, cb, options)` 实例化了一个 `watcher`，这里需要注意一点这是一个 `user watcher`，因为 `options.user = true`。

通过实例化 `watcher` 的方式，一旦我们 `watch` 的数据发送变化，它最终会执行 `watcher` 的 `run` 方法，执行回调函数 `cb`，并且如果我们设置了 `immediate` 为 true，则直接会执行回调函数 `cb`。

最后返回了一个 `unwatchFn` 方法，它会调用 `teardown` 方法去**移除**这个 `watcher`。

所以本质上侦听属性也是基于 `Watcher` 实现的，它是一个 `user watcher`。其实 `Watcher` 支持了不同的类型，

#### Watcher options

`Watcher` 的构造函数对 `options` 做的了处理，代码如下：

```js
if (options) {
  this.deep = !!options.deep
  this.user = !!options.user
  this.computed = !!options.computed
  this.sync = !!options.sync
  // ...
} else {
  this.deep = this.user = this.computed = this.sync = false
}
```

所以 `watcher` 总共有 4 种类型，我们来一一分析它们，看看不同的类型执行的逻辑有哪些差别。

##### deep watcher

通常，如果我们想对一下对象做**深度观测**的时候，需要设置这个属性为 true，考虑到这种情况：

```js
var vm = new Vue({
  data() {
    a: {
      b: 1
    }
  },
  watch: {
    a: {
      handler(newVal) {
        console.log(newVal)
      }
    }
  }
})
vm.a.b = 2
```

这个时候是不会 log 任何数据的，因为我们是 watch 了 `a` 对象，只触发了 `a` 的 getter，并没有触发 `a.b` 的 **getter**，所以并没有订阅它的变化，导致我们对 `vm.a.b = 2` 赋值的时候，虽然触发了 setter，但没有可通知的对象，所以也并不会触发 watch 的回调函数了。

而我们只需要对代码做稍稍修改，就可以观测到这个变化了

```js
watch: {
  a: {
    deep: true,
    handler(newVal) {
      console.log(newVal)
    }
  }
}
```

这样就创建了一个 `deep watcher` 了，在 `watcher` 执行 `get` 求值的过程中有一段逻辑：

```js
get() {
  let value = this.getter.call(vm, vm)
  // ...
  if (this.deep) {
    traverse(value)
  }
}
```

在对 watch 的表达式或者函数求值后，会调用 `traverse` 函数，它的定义在 `src/core/observer/traverse.js` 中：

```js
import { _Set as Set, isObject } from '../util/index'
import type { SimpleSet } from '../util/index'
import VNode from '../vdom/vnode'

const seenObjects = new Set()

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
export function traverse (val: any) {
  _traverse(val, seenObjects)
  seenObjects.clear()
}

function _traverse (val: any, seen: SimpleSet) {
  let i, keys
  const isA = Array.isArray(val)
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  if (isA) {
    i = val.length
    while (i--) _traverse(val[i], seen)
  } else {
    keys = Object.keys(val)
    i = keys.length
    while (i--) _traverse(val[keys[i]], seen)
  }
}
```

`traverse` 的逻辑也很简单，它实际上就是对一个对象做**深层递归遍历**，因为**遍历过程中就是对一个子对象的访问，会触发它们的 getter 过程**，这样就可以收集到依赖，也就是订阅它们变化的 `watcher`，这个函数实现还有一个小的优化，遍历过程中会把子响应式对象通过它们的 `dep id` 记录到 `seenObjects`，避免以后重复访问。

那么在执行了 `traverse` 后，我们再对 watch 的对象内部任何一个值做修改，也会调用 `watcher` 的**回调函数**了。

对 `deep watcher` 的理解非常重要，今后工作中如果大家观测了一个复杂对象，并且会改变对象内部深层某个值的时候也希望触发回调，一定要设置 `deep` 为 true，但是因为设置了 `deep` 后会执行 `traverse` 函数，会有一定的性能开销，所以一定要根据应用场景权衡是否要开启这个配置。

##### user watcher

通过 `vm.$watch` 创建的 `watcher` 是一个 `user watcher`，其实它的功能很简单，在对 `watcher` 求值以及在**执行回调函数**的时候，会处理一下错误，如下：

```js
get() {
  if (this.user) {
    handleError(e, vm, `getter for watcher "${this.expression}"`)
  } else {
    throw e
  }
},
getAndInvoke() {
  // ...
  if (this.user) {
    try {
      this.cb.call(this.vm, value, oldValue)
    } catch (e) {
      handleError(e, this.vm, `callback for watcher "${this.expression}"`)
    }
  } else {
    this.cb.call(this.vm, value, oldValue)
  }
}
```

`handleError` 在 Vue 中是一个错误捕获并且暴露给用户的一个利器。

##### computed watcher

`computed watcher` 几乎就是为计算属性量身定制的

##### sync watcher

在我们之前对 `setter` 的分析过程知道，当响应式数据发送变化后，触发了 `watcher.update()`，只是把这个 `watcher` 推送到一个队列中，在 `nextTick` 后才会真正执行 `watcher` 的回调函数。而一旦我们设置了 `sync`，就可以在当前 `Tick` 中同步执行 `watcher` 的回调函数。

```js
update () {
  if (this.computed) {
    // ...
  } else if (this.sync) {
    this.run()
  } else {
    queueWatcher(this)
  }
}
```

只有当我们需要 watch 的值的变化到执行 `watcher` 的回调函数是一个同步过程的时候才会去设置该属性为 true

#### 总结

计算属性本质上是 `computed watcher`，而侦听属性本质上是 `user watcher`

计算属性适合用在模板渲染中，某个值是依赖了其它的响应式对象甚至是计算属性计算而来；而侦听属性适用于观测某个值的变化去完成一段复杂的业务逻辑

`computed`

1.计算属性的初始化是发生在 Vue 实例初始化阶段的 `initState` 函数  执行了 `if (opts.computed) initComputed(vm, opts.computed)`

2.先创建 `vm._computedWatchers` 为一个空对象，接着对 `computed` 对象做遍历，拿到计算属性的每一个 `userDef`，然后尝试获取这个 `userDef` 对应的 `getter` 函数为每一个 3.`getter` 创建一个 `watcher`  它是一个 `computed watcher`，因为进行了设置 `const computedWatcherOptions = { computed: true }`

4.最后对判断如果 `key` 不是 `vm` 的属性，则调用 `defineComputed(vm, key, userDef)`  否则判断计算属性对于的 `key` 是否已经被 `data` 或者 `prop` 所占用

5.defineComputed 实际上就是利用 `Object.defineProperty` 给计算属性对应的 `key` 值添加 getter 和 setter，setter 通常是计算属性是一个对象，并且拥有 `set` 方法的时候才有，否则是一个空函数

6.getter 部分，缓存的配置也先忽略，最终 getter 对应的是 `createComputedGetter(key)` 返回的一个函数 `computedGetter`，它就是计算属性对应的 getter

`computed watcher`

1.初始化这个 `computed watcher` 实例 `computed watcher` 会并不会立刻求值，但是同时持有一个 `dep` 实例。

2.当 `render` 函数执行访问到 属性的时候，就触发了计算属性的 `getter`，它会拿到计算属性对应的 `watcher`，然后执行 `watcher.depend()`

3.`Dep.target` 是渲染 `watcher`，所以 `this.dep.depend()` 相当于渲染 `watcher` 订阅了这个 `computed watcher` 的变化

4.然后再执行 `watcher.evaluate()` 去求值，`evaluate` 的逻辑非常简单，判断 `this.dirty`，如果为 `true` 则通过 `this.get()` 求值，然后把 `this.dirty` 设置为 false

5.在求值过程中，会执行 `value = this.getter.call(vm, vm)`，这实际上就是执行了计算属性定义的 `getter` 函数    得到了computed()函数的返回值

6.由于 `this.xxx`是响应式对象，这里会触发它们的 getter它们会把自身持有的 `dep` 添加到当前正在计算的 `watcher` 中，这个时候 `Dep.target` 就是这个 `computed watcher`  最后通过 `return this.value` 拿到计算属性对应的值

7.一旦我们对计算属性依赖的数据做修改，则会触发 setter 过程，通知所有订阅它变化的 `watcher` 更新，执行 `watcher.update()` 方法

8.update()方法中有2 种模式，lazy 和 active。

this.dep.subs.length === 0  说明没有人去订阅这个 `computed watcher` 的变化

就把 `this.dirty = true`，只有当下次再访问这个计算属性的时候才会重新求值

否则执行 `this.getAndInvoke(() => { this.dep.notify()  })`

9.**`getAndInvoke` 函数会重新计算，然后对比新旧值，如果变化了则执行回调函数，那么这里这个回调函数是 `this.dep.notify()`，在我们这个场景下就是触发了渲染 `watcher` 重新渲染**

 **Vue 想确保不仅仅是计算属性依赖的值发生变化，而是当计算属性最终计算的值发生变化才会触发渲染 `watcher` 重新渲染，本质上是一种优化**

**watch**

1.侦听属性*的初始化也是发生在 Vue 的实例初始化阶段的 `initState` 函数中，在 `computed` 初始化之后，执行了initWatch(vm, opts.watch)

2.`initWatch` 的实现，这里就是对 `watch` 对象做遍历，拿到每一个 `handler`，因为 Vue 是支持 `watch` 的同一个 `key` 对应**多个** `handler`，所以如果 `handler` 是一个**数组**，则**遍历这个数组**，调用 `createWatcher` 方法，否则**直接调用** `createWatcher`

3.createWatcher的逻辑也很简单，首先对 `hanlder` 的类型做判断，拿到它最终的回调函数，最后调用 `vm.$watch(keyOrFn, handler, options)` 函数，

4.`$watch` 是 Vue 原型上的方法，它是在执行 `stateMixin` 的时候定义的,侦听属性 `watch` 最终会调用 `$watch` 方法

5.`$watch`方法首先**判断** `cb` 如果是一个对象，则调用 `createWatcher` 方法，这是因为 `$watch` 方法是用户**可以直接调用**的，它可以传递一个对象，也可以传递函数。

6.接着执行 `const watcher = new Watcher(vm, expOrFn, cb, options)` 实例化了一个 `watcher`，这里需要注意一点这是一个 `user watcher`，因为 `options.user = true`。

7.通过实例化 `watcher` 的方式，一旦我们 `watch` 的数据发送变化，它最终会执行 `watcher` 的 `run` 方法，执行回调函数 `cb`，并且如果我们设置了 `immediate` 为 true，则直接会执行回调函数 `cb`。

8.最后返回了一个 `unwatchFn` 方法，它会调用 `teardown` 方法去**移除**这个 `watcher`。

所以本质上侦听属性也是基于 `Watcher` 实现的，它是一个 `user watcher`。其实 `Watcher` 支持了不同的类型，

### 组件更新

#### 更新判断

当数据发生变化的时候，会触发渲染 `watcher` 的回调函数，进而执行组件的更新过程

```js
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
new Watcher(vm, updateComponent, noop, {
  before () {
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate')
    }
  }
}, true /* isRenderWatcher */)
```

组件的更新还是调用了 `vm._update` 方法  在 `src/core/instance/lifecycle.js` 中：

```js
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this
  // ...
  const prevVnode = vm._vnode
  if (!prevVnode) {
     // initial render
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
  } else {
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
  // ...
}
```

组件更新的过程，会执行 `vm.$el = vm.__patch__(prevVnode, vnode)`，它仍然会调用 `patch` 函数，在 `src/core/vdom/patch.js` 中定义：

```js
return function patch (oldVnode, vnode, hydrating, removeOnly) {
  if (isUndef(vnode)) {
    if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
    return
  }

  let isInitialPatch = false
  const insertedVnodeQueue = []

  if (isUndef(oldVnode)) {
    // empty mount (likely as component), create new root element
    isInitialPatch = true
    createElm(vnode, insertedVnodeQueue)
  } else {
    const isRealElement = isDef(oldVnode.nodeType)
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      // patch existing root node
      patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
    } else {
      if (isRealElement) {
         // ...
      }

      // replacing existing element
      const oldElm = oldVnode.elm
      const parentElm = nodeOps.parentNode(oldElm)

      // create new node
      createElm(
        vnode,
        insertedVnodeQueue,
        // extremely rare edge case: do not insert if old element is in a
        // leaving transition. Only happens when combining transition +
        // keep-alive + HOCs. (#4590)
        oldElm._leaveCb ? null : parentElm,
        nodeOps.nextSibling(oldElm)
      )

      // update parent placeholder node element, recursively
      if (isDef(vnode.parent)) {
        let ancestor = vnode.parent
        const patchable = isPatchable(vnode)
        while (ancestor) {
          for (let i = 0; i < cbs.destroy.length; ++i) {
            cbs.destroy[i](ancestor)
          }
          ancestor.elm = vnode.elm
          if (patchable) {
            for (let i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, ancestor)
            }
            // #6513
            // invoke insert hooks that may have been merged by create hooks.
            // e.g. for directives that uses the "inserted" hook.
            const insert = ancestor.data.hook.insert
            if (insert.merged) {
              // start at index 1 to avoid re-invoking component mounted hook
              for (let i = 1; i < insert.fns.length; i++) {
                insert.fns[i]()
              }
            }
          } else {
            registerRef(ancestor)
          }
          ancestor = ancestor.parent
        }
      }

      // destroy old node
      if (isDef(parentElm)) {
        removeVnodes(parentElm, [oldVnode], 0, 0)
      } else if (isDef(oldVnode.tag)) {
        invokeDestroyHook(oldVnode)
      }
    }
  }

  invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
  return vnode.elm
}
```

这里执行 `patch` 的逻辑和首次渲染是不一样的，因为 `oldVnode` 不为空，并且它和 `vnode` 都是 VNode 类型，接下来会通过 `sameVNode(oldVnode, vnode)` 判断它们是否是相同的 VNode 来决定走不同的更新逻辑：

```js
function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}
```

`sameVnode` 的逻辑非常简单，如果两个 `vnode` 的 `key` 不相等，则是不同的；否则继续判断对于同步组件，则判断 `isComment`、`data`、`input` 类型等是否相同，对于异步组件，则判断 `asyncFactory` 是否相同。

所以根据新旧 `vnode` 是否为 `sameVnode`，会走到不同的更新逻辑，我们先来说一下不同的情况。

#### 新旧节点不同

如果新旧 `vnode` 不同，那么更新的逻辑非常简单，它本质上是要替换已存在的节点，大致分为 3 步

- 创建新节点

```js
const oldElm = oldVnode.elm
const parentElm = nodeOps.parentNode(oldElm)
// create new node
createElm(
  vnode,
  insertedVnodeQueue,
  // extremely rare edge case: do not insert if old element is in a
  // leaving transition. Only happens when combining  transition +
  // keep-alive + HOCs. (#4590)
  oldElm._leaveCb ? null : parentElm,
  nodeOps.nextSibling(oldElm)
)
```

以当前旧节点为参考节点，创建新的节点，并插入到 DOM 中，`createElm` 的逻辑我们之前分析过。

- 更新父的占位符节点

```js
// update parent placeholder node element, recursively
if (isDef(vnode.parent)) {
  let ancestor = vnode.parent
  const patchable = isPatchable(vnode)
  while (ancestor) {
    for (let i = 0; i < cbs.destroy.length; ++i) {
      cbs.destroy[i](ancestor)
    }
    ancestor.elm = vnode.elm
    if (patchable) {
      for (let i = 0; i < cbs.create.length; ++i) {
        cbs.create[i](emptyNode, ancestor)
      }
      // #6513
      // invoke insert hooks that may have been merged by create hooks.
      // e.g. for directives that uses the "inserted" hook.
      const insert = ancestor.data.hook.insert
      if (insert.merged) {
        // start at index 1 to avoid re-invoking component mounted hook
        for (let i = 1; i < insert.fns.length; i++) {
          insert.fns[i]()
        }
      }
    } else {
      registerRef(ancestor)
    }
    ancestor = ancestor.parent
  }
}
```

我们只关注主要逻辑即可，找到当前 `vnode` 的父的占位符节点，先执行各个 `module` 的 `destroy` 的钩子函数，如果当前**占位符**是一个可挂载的节点，则执行 `module` 的 `create` 钩子函数。

- 删除旧节点

```js
// destroy old node
if (isDef(parentElm)) {
  removeVnodes(parentElm, [oldVnode], 0, 0)
} else if (isDef(oldVnode.tag)) {
  invokeDestroyHook(oldVnode)
}
```

把 `oldVnode` 从当前 DOM 树中删除，如果父节点存在，则执行 `removeVnodes` 方法：

```js
function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx]
    if (isDef(ch)) {
      if (isDef(ch.tag)) {
        removeAndInvokeRemoveHook(ch)
        invokeDestroyHook(ch)
      } else { // Text node
        removeNode(ch.elm)
      }
    }
  }
}

function removeAndInvokeRemoveHook (vnode, rm) {
  if (isDef(rm) || isDef(vnode.data)) {
    let i
    const listeners = cbs.remove.length + 1
    if (isDef(rm)) {
      // we have a recursively passed down rm callback
      // increase the listeners count
      rm.listeners += listeners
    } else {
      // directly removing
      rm = createRmCb(vnode.elm, listeners)
    }
    // recursively invoke hooks on child component root node
    if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
      removeAndInvokeRemoveHook(i, rm)
    }
    for (i = 0; i < cbs.remove.length; ++i) {
      cbs.remove[i](vnode, rm)
    }
    if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
      i(vnode, rm)
    } else {
      rm()
    }
  } else {
    removeNode(vnode.elm)
  }
}

function invokeDestroyHook (vnode) {
  let i, j
  const data = vnode.data
  if (isDef(data)) {
    if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode)
    for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode)
  }
  if (isDef(i = vnode.children)) {
    for (j = 0; j < vnode.children.length; ++j) {
      invokeDestroyHook(vnode.children[j])
    }
  }
}
```

删除节点逻辑很简单，就是遍历待删除的 `vnodes` 做删除，

其中 `removeAndInvokeRemoveHook` 的作用是从 DOM 中**移除节点**并**执行 `module` 的 `remove` 钩子函数**，

并对它的**子节点****递归调用** `removeAndInvokeRemoveHook` 函数；

`invokeDestroyHook` 是执行 `module` 的 `destory` 钩子函数以及 `vnode` 的 `destory` 钩子函数，并对它的子 `vnode` 递归调用 `invokeDestroyHook` 函数；`removeNode` 就是调用平台的 DOM API 去把真正的 DOM 节点移除。

在之前介绍组件生命周期的时候提到 `beforeDestroy & destroyed` 这两个生命周期钩子函数，它们就是在执行 `invokeDestroyHook` 过程中，执行了 `vnode` 的 `destory` 钩子函数，它的定义在 `src/core/vdom/create-component.js` 中：

```js
const componentVNodeHooks = {
  destroy (vnode: MountedComponentVNode) {
    const { componentInstance } = vnode
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy()
      } else {
        deactivateChildComponent(componentInstance, true /* direct */)
      }
    }
  }
}
```

当组件并不是 `keepAlive` 的时候，会执行 `componentInstance.$destroy()` 方法，然后就会执行 `beforeDestroy & destroyed` 两个钩子函数。



#### 新旧节点相同

对于新旧节点不同的情况，这种创建新节点 -> 更新占位符节点 -> 删除旧节点的逻辑是很容易理解的。还有一种组件 `vnode` 的更新情况是**新旧节点相同**，它会调用 `patchVNode` 方法，它的定义在 `src/core/vdom/patch.js` 中：

```js
function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
  if (oldVnode === vnode) {
    return
  }

  const elm = vnode.elm = oldVnode.elm

  if (isTrue(oldVnode.isAsyncPlaceholder)) {
    if (isDef(vnode.asyncFactory.resolved)) {
      hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
    } else {
      vnode.isAsyncPlaceholder = true
    }
    return
  }

  // reuse element for static trees.
  // note we only do this if the vnode is cloned -
  // if the new node is not cloned it means the render functions have been
  // reset by the hot-reload-api and we need to do a proper re-render.
  if (isTrue(vnode.isStatic) &&
    isTrue(oldVnode.isStatic) &&
    vnode.key === oldVnode.key &&
    (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
  ) {
    vnode.componentInstance = oldVnode.componentInstance
    return
  }

  let i
  const data = vnode.data
  if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
    i(oldVnode, vnode)
  }

  const oldCh = oldVnode.children
  const ch = vnode.children
  if (isDef(data) && isPatchable(vnode)) {
    for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
    if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
  }
  if (isUndef(vnode.text)) {
    if (isDef(oldCh) && isDef(ch)) {
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
    } else if (isDef(ch)) {
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    } else if (isDef(oldCh)) {
      removeVnodes(elm, oldCh, 0, oldCh.length - 1)
    } else if (isDef(oldVnode.text)) {
      nodeOps.setTextContent(elm, '')
    }
  } else if (oldVnode.text !== vnode.text) {
    nodeOps.setTextContent(elm, vnode.text)
  }
  if (isDef(data)) {
    if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
  }
}
```

`patchVnode` 的作用就是把新的 `vnode` `patch` 到旧的 `vnode` 上，这里我们只关注关键的核心逻辑，我把它拆成四步骤：

- 执行 `prepatch` 钩子函数

```js
let i
const data = vnode.data
if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
  i(oldVnode, vnode)
}
```

当更新的 `vnode` 是一个组件 `vnode` 的时候，会执行 `prepatch` 的方法，它的定义在 `src/core/vdom/create-component.js` 中：

```js
const componentVNodeHooks = {
  prepatch (oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
    const options = vnode.componentOptions
    const child = vnode.componentInstance = oldVnode.componentInstance
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    )
  }
}
```

`prepatch` 方法就是拿到新的 `vnode` 的组件配置以及组件实例，去执行 `updateChildComponent` 方法，它的定义在 `src/core/instance/lifecycle.js` 中：

```js
export function updateChildComponent (
  vm: Component,
  propsData: ?Object,
  listeners: ?Object,
  parentVnode: MountedComponentVNode,
  renderChildren: ?Array<VNode>
) {
  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = true
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  const hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  )

  vm.$options._parentVnode = parentVnode
  vm.$vnode = parentVnode // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode
  }
  vm.$options._renderChildren = renderChildren

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject
  vm.$listeners = listeners || emptyObject

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false)
    const props = vm._props
    const propKeys = vm.$options._propKeys || []
    for (let i = 0; i < propKeys.length; i++) {
      const key = propKeys[i]
      const propOptions: any = vm.$options.props // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm)
    }
    toggleObserving(true)
    // keep a copy of raw propsData
    vm.$options.propsData = propsData
  }

  // update listeners
  listeners = listeners || emptyObject
  const oldListeners = vm.$options._parentListeners
  vm.$options._parentListeners = listeners
  updateComponentListeners(vm, listeners, oldListeners)

  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context)
    vm.$forceUpdate()
  }

  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = false
  }
}
```

`updateChildComponent` 的逻辑也非常简单，由于更新了 `vnode`，那么 `vnode` 对应的实例 `vm` 的一系列属性也会发生变化，包括占位符 `vm.$vnode` 的更新、`slot` 的更新，`listeners` 的更新，`props` 的更新等等。

- 执行 `update` 钩子函数

```js
if (isDef(data) && isPatchable(vnode)) {
  for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
  if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
}
```

回到 `patchVNode` 函数，在执行完新的 `vnode` 的 `prepatch` 钩子函数，会执行所有 `module` 的 `update` 钩子函数以及用户自定义 `update` 钩子函数，对于 `module` 的钩子函数，之

- 完成 `patch` 过程

```js
const oldCh = oldVnode.children
const ch = vnode.children
if (isDef(data) && isPatchable(vnode)) {
  for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
  if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
}
if (isUndef(vnode.text)) {
  if (isDef(oldCh) && isDef(ch)) {
    if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
  } else if (isDef(ch)) {
    if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
    addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
  } else if (isDef(oldCh)) {
    removeVnodes(elm, oldCh, 0, oldCh.length - 1)
  } else if (isDef(oldVnode.text)) {
    nodeOps.setTextContent(elm, '')
  }
} else if (oldVnode.text !== vnode.text) {
  nodeOps.setTextContent(elm, vnode.text)
}
```

如果 `vnode` 是个文本节点且新旧文本不相同，则直接替换文本内容。如果不是文本节点，则判断它们的子节点，并分了几种情况处理：

1.`oldCh` 与 `ch` 都存在且不相同时，使用 `updateChildren` 函数来更新子节点，这个后面重点讲。

2.如果只有 `ch` 存在，表示旧节点不需要了。如果旧的节点是文本节点则先将节点的文本清除，然后通过 `addVnodes` 将 `ch` 批量插入到新节点 `elm` 下。

3.如果只有 `oldCh` 存在，表示更新的是空节点，则需要将旧的节点通过 `removeVnodes` 全部清除。

4.当只有旧节点是文本节点的时候，则清除其节点文本内容。

- 执行 `postpatch` 钩子函数

```js
if (isDef(data)) {
  if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
}
```

再执行完 `patch` 过程后，会执行 `postpatch` 钩子函数，它是组件自定义的钩子函数，有则执行。

那么在整个 `pathVnode` 过程中，最复杂的就是 `updateChildren` 方法了

#### updateChildren

```js
function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newEndIdx = newCh.length - 1
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]
  let oldKeyToIdx, idxInOld, vnodeToMove, refElm

  // removeOnly is a special flag used only by <transition-group>
  // to ensure removed elements stay in correct relative positions
  // during leaving transitions
  const canMove = !removeOnly

  if (process.env.NODE_ENV !== 'production') {
    checkDuplicateKeys(newCh)
  }

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isUndef(oldStartVnode)) {
      oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
    } else if (isUndef(oldEndVnode)) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
      canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
      canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
      idxInOld = isDef(newStartVnode.key)
        ? oldKeyToIdx[newStartVnode.key]
        : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
      if (isUndef(idxInOld)) { // New element
        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
      } else {
        vnodeToMove = oldCh[idxInOld]
        if (sameVnode(vnodeToMove, newStartVnode)) {
          patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue)
          oldCh[idxInOld] = undefined
          canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
        } else {
          // same key but different element. treat as new element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        }
      }
      newStartVnode = newCh[++newStartIdx]
    }
  }
  if (oldStartIdx > oldEndIdx) {
    refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
    addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
  } else if (newStartIdx > newEndIdx) {
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
  }
}
```

`updateChildren` 的逻辑比较复杂，直接读源码比较晦涩，我们可以通过一个具体的示例来分析它。

```js
<template>
  <div id="app">
    <div>
      <ul>
        <li v-for="item in items" :key="item.id">{{ item.val }}</li>
      </ul>
    </div>
    <button @click="change">change</button>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        items: [
          {id: 0, val: 'A'},
          {id: 1, val: 'B'},
          {id: 2, val: 'C'},
          {id: 3, val: 'D'}
        ]
      }
    },
    methods: {
      change() {
        this.items.reverse().push({id: 4, val: 'E'})
      }
    }
  }
</script>
```

当我们点击 `change` 按钮去改变数据，最终会执行到 `updateChildren` 去更新 `li` 部分的列表数据，我们通过图的方式来描述一下它的更新过程：

第一步： ![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/update-children-1.png)

第二步： ![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/update-children-2.png)

第三步： ![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/update-children-3.png)

第四步： ![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/update-children-4.png)

第五步： ![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/update-children-5.png)

第六步： ![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/update-children-6.png)

#### 总结

**组件更新逻辑判断**

1.当数据发生变化的时候，会触发渲染 `watcher` 的回调函数，进而执行组件的更新过程，组件的更新还是通过updateComponent 调用了 `vm._update` 方法

2.组件更新的过程，会执行 `vm.$el = vm.__patch__(prevVnode, vnode)`，它仍然会调用 `patch` 函数

3.`patch` 的逻辑和首次渲染是不一样的，因为 `oldVnode` 不为空，并且它和 `vnode` 都是 VNode 类型

4.然后会通过 `sameVNode(oldVnode, vnode)` 判断它们是否是相同的 VNode 来决定走不同的更新逻辑

如果两个 `vnode` 的 `key` 不相等，则是不同的；否则继续判断对于同步组件，则判断 `isComment`、`data`、`input` 类型等是否相同，对于异步组件，则判断 `asyncFactory` 是否相同

根据新旧 `vnode` 是否为 `sameVnode`，会走到不同的更新逻辑

**新旧节点不同**

如果新旧 `vnode` 不同，那么更新的逻辑非常简单，它本质上是要替换已存在的节点，大致分为 3 步

1.**创建新节点**  通过createElm() 以当前旧节点为参考节点，创建新的节点，并插入到 DOM 中  

2.**更新父的占位符节点**  找到当前 `vnode` 的父的占位符节点，先执行各个 `module` 的 `destroy` 的钩子函数，如果当前占位符是一个可挂载的节点，则执行 `module` 的 `create` 钩子函数

3.**删除旧节点**  把 `oldVnode` 从当前 DOM 树中删除，如果父节点存在，则执行 `removeVnodes` 方法

`removeAndInvokeRemoveHook` 的作用是从 DOM 中移除节点并执行 `module` 的 `remove` 钩子函数，并对它的子节点递归调用 `removeAndInvokeRemoveHook` 函数

`invokeDestroyHook` 是执行 `module` 的 `destory` 钩子函数以及 `vnode` 的 `destory` 钩子函数，并对它的子 `vnode` 递归调用 `invokeDestroyHook` 函数

`removeNode` 就是调用平台的 DOM API 去把真正的 DOM 节点移除

4.`beforeDestroy & destroyed` 这两个生命周期钩子函数  就是在执行 `invokeDestroyHook` 过程中，执行了 `vnode` 的 `destory` 钩子函数  当组件并不是 `keepAlive` 的时候，会执行 `componentInstance.$destroy()` 方法，然后就会执行 `beforeDestroy & destroyed` 两个钩子函数

**新旧节点相同**

组件 `vnode` 的更新情况是新旧节点相同，它会调用 `patchVNode` 方法 , `patchVnode` 的作用就是把新的 `vnode` `patch` 到旧的 `vnode` 上，拆成四步骤：

1.**执行 `prepatch` 钩子函数** 

当更新的 `vnode` 是一个组件 `vnode` 的时候，会执行 `prepatch` 的方法

`prepatch` 方法就是拿到新的 `vnode` 的组件配置以及组件实例，去执行 `updateChildComponent` 方法

`updateChildComponent` 的逻辑也非常简单，由于更新了 `vnode`，那么 `vnode` 对应的实例 `vm` 的一系列属性也会发生变化，包括占位符 `vm.$vnode` 的更新、`slot` 的更新，`listeners` 的更新，`props` 的更新等

2.**执行 `update` 钩子函数**

回到 `patchVNode` 函数，在执行完新的 `vnode` 的 `prepatch` 钩子函数，会执行所有 `module` 的 `update` 钩子函数以及用户自定义 `update` 钩子函数，对于 `module` 的钩子函数

3.**完成 `patch` 过程**

如果 `vnode` 是个文本节点且新旧文本不相同，则直接替换文本内容。如果不是文本节点，则判断它们的子节点

(1)`oldCh` 与 `ch` 都存在且不相同时，使用 `updateChildren` 函数来更新子节点，。

(2)如果只有 `ch` 存在，表示旧节点不需要了。如果旧的节点是文本节点则先将节点的文本清除，然后通过 `addVnodes` 将 `ch` 批量插入到新节点 `elm` 下。

(3)如果只有 `oldCh` 存在，表示更新的是空节点，则需要将旧的节点通过 `removeVnodes` 全部清除。

(4)当只有旧节点是文本节点的时候，则清除其节点文本内容

4.执行 `postpatch` 钩子函数

在执行完 `patch` 过程后，会执行 `postpatch` 钩子函数，它是组件自定义的钩子函数，有则执行。

那么在整个 `pathVnode` 过程中，最复杂的就是 `updateChildren` 方法。

**updateChildren**

diff算法主要是对相同节点的子节点进行的比较和更新，也就是相同级别节点的比较算法。dom对比更新，本着尽量减少dom的销毁和重建，所以diff算法尽量先移动，后增删

定义变量

```js
let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newEndIdx = newCh.length - 1
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]
```

进行循环  索引遍历节点

首先会判断是否为空  isUndef(oldStartVnode)   isUndef(oldEndVnode）

```js
export function isUndef (v: any): boolean %checks {
  return v === undefined || v === null
}
```

sameVnode(oldStartVnode, newStartVnode)

sameVnode(oldEndVnode, newEndVnode)

sameVnode(oldStartVnode, newEndVnode)

sameVnode(oldEndVnode, newStartVnode)

如果上述四种情况都不存在，则用新VNode当前的newStartVnode去旧VNode里找（尽量不新建dom，找到了就移动，找不到再新建）

如果找到了，则调用patchVnode去比较详细内容，并且移动这个节点到newStartIdx位置，

如果没找到，则创建新节点并插入

```js
 while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx){
     if (isUndef(oldStartVnode)) {
      oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
    } else if (isUndef(oldEndVnode)) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
      canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
      canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
      idxInOld = isDef(newStartVnode.key)
        ? oldKeyToIdx[newStartVnode.key]
        : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
      if (isUndef(idxInOld)) { // New element
        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
      } else {
        vnodeToMove = oldCh[idxInOld]
        if (sameVnode(vnodeToMove, newStartVnode)) {
          patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue)
          oldCh[idxInOld] = undefined
          canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
        } else {
          // same key but different element. treat as new element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        }
      }
      newStartVnode = newCh[++newStartIdx]
    }
 }
```

循环结束  遍历完成（走出while循环时说明肯定有新/旧节点被遍历完了）：

**结束判断1：**当结束时 oldStartIdx > oldEndIdx ，说明旧节点遍历完了，**新节点没遍历完**，则说明新节点比老节点多，把newStartIdx >到newEndIdx直接的节点**插入**到老节点后面

**结束判断2：**当结束时 newStartIdx > newEndIdx ，说明新节点遍历完了，**旧节点没遍历完**，则说明老节点比新节点多，把的oldStartIdx到oldEndIdx之间的节点**删除**

```js
if (oldStartIdx > oldEndIdx) {
    refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
    addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
  } else if (newStartIdx > newEndIdx) {
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
  }
```

### Props

#### 规范化

在初始化 `props` 之前，首先会对 `props` 做一次 `normalize`，它发生在 `mergeOptions` 的时候，在 `src/core/util/options.js` 中：

```js
export function mergeOptions (
  parent: Object,
  child: Object,
  vm?: Component
): Object {
  // ...
  normalizeProps(child, vm)
  // ...
}

function normalizeProps (options: Object, vm: ?Component) {
  const props = options.props
  if (!props) return
  const res = {}
  let i, val, name
  if (Array.isArray(props)) {
    i = props.length
    while (i--) {
      val = props[i]
      if (typeof val === 'string') {
        name = camelize(val)
        res[name] = { type: null }
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.')
      }
    }
  } else if (isPlainObject(props)) {
    for (const key in props) {
      val = props[key]
      name = camelize(key)
      res[name] = isPlainObject(val)
        ? val
        : { type: val }
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `Invalid value for option "props": expected an Array or an Object, ` +
      `but got ${toRawType(props)}.`,
      vm
    )
  }
  options.props = res
}
```

合并配置它主要就是处理我们定义组件的对象 `option`，然后挂载到组件的实例 `this.$options` 中。

重点看 `normalizeProps` 的实现，其实这个函数的主要目的就是把我们编写的 `props` 转成对象格式，因为实际上 `props` 除了对象格式，还允许写成数组格式。

当 `props` 是一个数组，每一个数组元素 `prop` 只能是一个 `string`，表示 `prop` 的 `key`，转成驼峰格式，`prop` 的类型为空。

当 `props` 是一个对象，对于 `props` 中每个 `prop` 的 `key`，我们会转驼峰格式，而它的 `value`，如果不是一个对象，我们就把它规范成一个对象。

如果 `props` 既不是数组也不是对象，就抛出一个警告。

举个例子：

```js
export default {
  props: ['name', 'nick-name']
}
```

经过 `normalizeProps` 后，会被规范成：

```js
options.props = {
  name: { type: null },
  nickName: { type: null }
}
export default {
  props: {
    name: String,
    nickName: {
      type: Boolean
    }
  }
}
```

经过 `normalizeProps` 后，会被规范成：

```js
options.props = {
  name: { type: String },
  nickName: { type: Boolean }
}
```

由于对象形式的 `props` 可以指定每个 `prop` 的类型和定义其它的一些属性，推荐用对象形式定义 `props`。

#### 初始化

`Props` 的初始化主要发生在 `new Vue` 中的 `initState` 阶段，在 `src/core/instance/state.js` 中：

```js
export function initState (vm: Component) {
  // ....
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  // ...
}


function initProps (vm: Component, propsOptions: Object) {
  const propsData = vm.$options.propsData || {}
  const props = vm._props = {}
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  const keys = vm.$options._propKeys = []
  const isRoot = !vm.$parent
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false)
  }
  for (const key in propsOptions) {
    keys.push(key)
    const value = validateProp(key, propsOptions, propsData, vm)
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      const hyphenatedKey = hyphenate(key)
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
          vm
        )
      }
      defineReactive(props, key, value, () => {
        if (!isRoot && !isUpdatingChildComponent) {
          warn(
            `Avoid mutating a prop directly since the value will be ` +
            `overwritten whenever the parent component re-renders. ` +
            `Instead, use a data or computed property based on the prop's ` +
            `value. Prop being mutated: "${key}"`,
            vm
          )
        }
      })
    } else {
      defineReactive(props, key, value)
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, `_props`, key)
    }
  }
  toggleObserving(true)
}
```

`initProps` 主要做 3 件事情：校验、响应式和代理。

#### 校验

校验的逻辑很简单，遍历 `propsOptions`，执行 `validateProp(key, propsOptions, propsData, vm)` 方法。这里的 `propsOptions` 就是我们定义的 `props` 在规范后生成的 `options.props` 对象，`propsData` 是从父组件传递的 `prop` 数据。所谓校验的目的就是检查一下我们传递的数据是否满足 `prop`的定义规范。再来看一下 `validateProp` 方法，它定义在 `src/core/util/props.js` 中：

```js
export function validateProp (
  key: string,
  propOptions: Object,
  propsData: Object,
  vm?: Component
): any {
  const prop = propOptions[key]
  const absent = !hasOwn(propsData, key)
  let value = propsData[key]
  // boolean casting
  const booleanIndex = getTypeIndex(Boolean, prop.type)
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      const stringIndex = getTypeIndex(String, prop.type)
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key)
    // since the default value is a fresh copy,
    // make sure to observe it.
    const prevShouldObserve = shouldObserve
    toggleObserving(true)
    observe(value)
    toggleObserving(prevShouldObserve)
  }
  if (
    process.env.NODE_ENV !== 'production' &&
    // skip validation for weex recycle-list child component props
    !(__WEEX__ && isObject(value) && ('@binding' in value))
  ) {
    assertProp(prop, key, value, vm, absent)
  }
  return value
}
```

`validateProp` 主要就做 3 件事情：处理 `Boolean` 类型的数据，处理默认数据，`prop` 断言，并最终返回 `prop` 的值。

先来看 `Boolean` 类型数据的处理逻辑：

```js
const prop = propOptions[key]
const absent = !hasOwn(propsData, key)
let value = propsData[key]
// boolean casting
const booleanIndex = getTypeIndex(Boolean, prop.type)
if (booleanIndex > -1) {
  if (absent && !hasOwn(prop, 'default')) {
    value = false
  } else if (value === '' || value === hyphenate(key)) {
    // only cast empty string / same name to boolean if
    // boolean has higher priority
    const stringIndex = getTypeIndex(String, prop.type)
    if (stringIndex < 0 || booleanIndex < stringIndex) {
      value = true
    }
  }
}
```

先通过 `const booleanIndex = getTypeIndex(Boolean, prop.type)` 来判断 `prop` 的定义是否是 `Boolean` 类型的。

```js
function getType (fn) {
  const match = fn && fn.toString().match(/^\s*function (\w+)/)
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes): number {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (let i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}
```

`getTypeIndex` 函数就是找到 `type` 和 `expectedTypes` 匹配的索引并返回。

`prop` 类型定义的时候可以是**某个原生构造函数，也可以是原生构造函数的数组**，比如：

```js
export default {
  props: {
    name: String,
    value: [String, Boolean]
  }
}
```

如果 `expectedTypes` 是单个构造函数，就执行 `isSameType` 去判断是否是同一个类型；

如果是数组，那么就遍历这个数组，找到第一个同类型的，返回它的索引。

回到 `validateProp` 函数，通过 `const booleanIndex = getTypeIndex(Boolean, prop.type)` 得到 `booleanIndex`

如果 `prop.type` 是一个 `Boolean` 类型，则通过 `absent && !hasOwn(prop, 'default')` 来判断如果父组件没有传递这个 `prop` 数据并且没有设置 `default` 的情况，则 `value` 为 false。

接着判断`value === '' || value === hyphenate(key)` 的情况，如果满足则先通过 `const stringIndex = getTypeIndex(String, prop.type)` 获取匹配 `String` 类型的索引，

然后判断 `stringIndex < 0 || booleanIndex < stringIndex` 的值来决定 `value` 的值是否为 `true`。这块逻辑稍微有点绕，我们举 2 个例子来说明：

例如你定义一个组件 `Student`:

```js
export default {
  name: String,
  nickName: [Boolean, String]
}
```

然后在父组件中引入这个组件：

```vue
<template>
  <div>
    <student name="Kate" nick-name></student>
  </div>
</template>
```

或者是：

```vue
<template>
  <div>
    <student name="Kate" nick-name="nick-name"></student>
  </div>
</template>
```

第一种情况没有写属性的值，满足 `value === ''`，第二种满足 `value === hyphenate(key)` 的情况，

另外 `nickName` 这个 `prop` 的类型是 `Boolean` 或者是 `String`，并且满足 `booleanIndex < stringIndex`，所以对 `nickName` 这个 `prop` 的 `value` 为 `true`。

接下来看一下默认数据处理逻辑：

```js
// check default value
if (value === undefined) {
  value = getPropDefaultValue(vm, prop, key)
  // since the default value is a fresh copy,
  // make sure to observe it.
  const prevShouldObserve = shouldObserve
  toggleObserving(true)
  observe(value)
  toggleObserving(prevShouldObserve)
}
```

当 `value` 的值为 `undefined` 的时候，说明父组件根本就没有传这个 `prop`，那么我们就需要通过 `getPropDefaultValue(vm, prop, key)` 获取这个 `prop` 的默认值。

我们这里只关注 `getPropDefaultValue` 的实现，`toggleObserving` 和 `observe` 的作用我们之后会说。

```js
function getPropDefaultValue (vm: ?Component, prop: PropOptions, key: string): any {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  const def = prop.default
  // warn against non-factory defaults for Object & Array
  if (process.env.NODE_ENV !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    )
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}
```

检测如果 `prop` 没有定义 `default` 属性，那么返回 `undefined`，**通过这块逻辑我们知道除了 `Boolean` 类型的数据，其余没有设置 `default` 属性的 `prop` 默认值都是 `undefined`**。

接着是开发环境下对 `prop` 的默认值是否为对象或者数组类型的判断，如果是的话会报警告，

因为对象和数组类型的 `prop`，他们的默认值必须要返回一个工厂函数。

接下来的判断是如果上一次组件渲染父组件传递的 `prop` 的值是 `undefined`，则直接返回 上一次的默认值 `vm._props[key]`，这样可以避免触发不必要的 `watcher` 的更新。

最后就是判断 `def` 如果是工厂函数且 `prop` 的类型不是 `Function` 的时候，返回工厂函数的返回值，否则直接返回 `def`。

至此，我们讲完了 `validateProp` 函数的 `Boolean` 类型数据的处理逻辑和默认数据处理逻辑，最后来看一下 `prop` 断言逻辑。

```js
if (
process.env.NODE_ENV !== 'production' &&
// skip validation for weex recycle-list child component props
!(__WEEX__ && isObject(value) && ('@binding' in value))
) {
  assertProp(prop, key, value, vm, absent)
}
```

在开发环境且非 `weex` 的某种环境下，执行 `assertProp` 做属性断言。

```js
function assertProp (
  prop: PropOptions,
  name: string,
  value: any,
  vm: ?Component,
  absent: boolean
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    )
    return
  }
  if (value == null && !prop.required) {
    return
  }
  let type = prop.type
  let valid = !type || type === true
  const expectedTypes = []
  if (type) {
    if (!Array.isArray(type)) {
      type = [type]
    }
    for (let i = 0; i < type.length && !valid; i++) {
      const assertedType = assertType(value, type[i])
      expectedTypes.push(assertedType.expectedType || '')
      valid = assertedType.valid
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    )
    return
  }
  const validator = prop.validator
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      )
    }
  }
}
```

`assertProp` 函数的目的是断言这个 `prop` 是否合法。

首先判断如果 `prop` 定义了 `required` 属性但父组件没有传递这个 `prop` 数据的话会报一个警告。

接着判断如果 `value` 为空且 `prop` 没有定义 `required` 属性则直接返回。

然后再去对 `prop` 的类型做校验，先是拿到 `prop` 中定义的类型 `type`，并尝试把它转成一个类型数组，然后依次遍历这个数组，执行 `assertType(value, type[i])` 去获取断言的结果，直到遍历完成或者是 `valid` 为 `true` 的时候跳出循环。

```js
const simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/
function assertType (value: any, type: Function): {
  valid: boolean;
  expectedType: string;
} {
  let valid
  const expectedType = getType(type)
  if (simpleCheckRE.test(expectedType)) {
    const t = typeof value
    valid = t === expectedType.toLowerCase()
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value)
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value)
  } else {
    valid = value instanceof type
  }
  return {
    valid,
    expectedType
  }
}
```

`assertType` 的逻辑很简单，先通过 `getType(type)` 获取 `prop` 期望的类型 `expectedType`，然后再去根据几种不同的情况对比 `prop` 的值 `value` 是否和 `expectedType` 匹配，最后返回匹配的结果。

如果循环结束后 `valid` 仍然为 `false`，那么说明 `prop` 的值 `value` 与 `prop` 定义的类型都不匹配，那么就会输出一段通过 `getInvalidTypeMessage(name, value, expectedTypes)` 生成的警告信息，就不细说了。

最后判断当 `prop` 自己定义了 `validator` 自定义校验器，则执行 `validator` 校验器方法，如果校验不通过则输出警告信息。

#### 响应式

回到 `initProps` 方法，当我们通过 `const value = validateProp(key, propsOptions, propsData, vm)` 对 `prop` 做验证并且获取到 `prop` 的值后，接下来需要通过 `defineReactive` 把 `prop` 变成响应式。

`defineReactive` 我们之前已经介绍过，这里要注意的是，在开发环境中我们会校验 `prop` 的 `key` 是否是 `HTML` 的保留属性，并且在 `defineReactive` 的时候会添加一个自定义 `setter`，当我们直接对 `prop` 赋值的时候会输出警告：

```js
if (process.env.NODE_ENV !== 'production') {
  const hyphenatedKey = hyphenate(key)
  if (isReservedAttribute(hyphenatedKey) ||
      config.isReservedAttr(hyphenatedKey)) {
    warn(
      `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
      vm
    )
  }
  defineReactive(props, key, value, () => {
    if (!isRoot && !isUpdatingChildComponent) {
      warn(
        `Avoid mutating a prop directly since the value will be ` +
        `overwritten whenever the parent component re-renders. ` +
        `Instead, use a data or computed property based on the prop's ` +
        `value. Prop being mutated: "${key}"`,
        vm
      )
    }
  })
} 
```

关于 `prop` 的响应式有一点不同的是当 `vm` 是非根实例的时候，会先执行 `toggleObserving(false)`，它的目的是为了响应式的优化，我们先跳过，之后会详细说明。

#### 代理

在经过响应式处理后，我们会把 `prop` 的值添加到 `vm._props` 中，比如 key 为 `name` 的 `prop`，它的值保存在 `vm._props.name` 中，但是**我们在组件中可以通过 `this.name` 访问到这个 `prop`，这就是代理做的事情**。

```js
// static props are already proxied on the component's prototype
// during Vue.extend(). We only need to proxy props defined at
// instantiation here.
if (!(key in vm)) {
  proxy(vm, `_props`, key)
}
```

通过 `proxy` 函数实现了上述需求。

```js
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

当访问 `this.name` 的时候就相当于访问 `this._props.name`。

其实对于非根实例的子组件而言，`prop` 的代理发生在 `Vue.extend` 阶段，在 `src/core/global-api/extend.js` 中：

```js
Vue.extend = function (extendOptions: Object): Function {
  // ...
  const Sub = function VueComponent (options) {
    this._init(options)
  }
  // ...

  // For props and computed properties, we define the proxy getters on
  // the Vue instances at extension time, on the extended prototype. This
  // avoids Object.defineProperty calls for each instance created.
  if (Sub.options.props) {
    initProps(Sub)
  }
  if (Sub.options.computed) {
    initComputed(Sub)
  }

  // ...
  return Sub
}

function initProps (Comp) {
  const props = Comp.options.props
  for (const key in props) {
    proxy(Comp.prototype, `_props`, key)
  }
}
```

这么做的好处是不用为每个组件实例都做一层 `proxy`，是一种优化手段。

#### Props 更新

我们知道，当**父组件传递给子组件的 `props` 值变化，子组件对应的值也会改变**，**同时会触发子组件的重新渲染**。那么接下来我们就从源码角度来分析这两个过程。

##### 子组件 props 更新

首先，`prop` 数据的**值变化在父组件**，我们知道在父组件的 `render` 过程中会访问到这个 `prop` 数据，**所以当 `prop` 数据变化一定会触发父组件的重新渲染，那么重新渲染是如何更新子组件对应的 `prop` 的值呢**？

在**父组件重新渲染的最后，会执行 `patch` 过程，进而执行 `patchVnode` 函数，`patchVnode` 通常是一个递归过程，当它遇到组件 `vnode` 的时候，会执行组件更新过程的 `prepatch` 钩子函数**，在 `src/core/vdom/patch.js` 中：

```js
function patchVnode (
  oldVnode,
  vnode,
  insertedVnodeQueue,
  ownerArray,
  index,
  removeOnly
) {
  // ...

  let i
  const data = vnode.data
  if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
    i(oldVnode, vnode)
  }
  // ...
}
```

`prepatch` 函数定义在 `src/core/vdom/create-component.js` 中：

```js
prepatch (oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
  const options = vnode.componentOptions
  const child = vnode.componentInstance = oldVnode.componentInstance
  updateChildComponent(
    child,
    options.propsData, // updated props
    options.listeners, // updated listeners
    vnode, // new parent vnode
    options.children // new children
  )
}
```

内部会调用 `updateChildComponent` 方法来**更新** `props`，注意第二个参数就是父组件的 `propData`，那么为什么 `vnode.componentOptions.propsData` 就是**父组件传递给子组件**的 `prop` 数据呢（这个也同样解释了第一次渲染的 `propsData` 来源）？原来**在组件的 `render` 过程中，对于组件节点会通过 `createComponent` 方法来创建组件 `vnode`：**

```js
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  // ...

  // extract props
  const propsData = extractPropsFromVNodeData(data, Ctor, tag)

  // ...
  
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )

  // ...
  
  return vnode
}
```

**在创建组件 `vnode` 的过程中，首先从 `data` 中提取出 `propData`，然后在 `new VNode` 的时候，作为第七个参数 `VNodeComponentOptions` 中的一个属性传入，所以我们可以通过 `vnode.componentOptions.propsData` 拿到 `prop` 数据。**

接着看 `updateChildComponent` 函数，它的定义在 `src/core/instance/lifecycle.js` 中：

```js
export function updateChildComponent (
  vm: Component,
  propsData: ?Object,
  listeners: ?Object,
  parentVnode: MountedComponentVNode,
  renderChildren: ?Array<VNode>
) {
  // ...

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false)
    const props = vm._props
    const propKeys = vm.$options._propKeys || []
    for (let i = 0; i < propKeys.length; i++) {
      const key = propKeys[i]
      const propOptions: any = vm.$options.props // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm)
    }
    toggleObserving(true)
    // keep a copy of raw propsData
    vm.$options.propsData = propsData
  }

  // ...
}
```

我们重点来看**更新 `props` 的相关逻辑**，这里的 `propsData` 是父组件传递的 `props` 数据，`vm` 是子组件的实例。`vm._props` 指向的就是**子组件的 `props` 值**，`propKeys` 就是在之前 `initProps` 过程中，缓存的子组件中定义的所有 `prop` 的 `key`。主要**逻辑就是遍历 `propKeys`**，然后执行 `props[key] = validateProp(key, propOptions, propsData, vm)` **重新验证和计算新的 `prop` 数据**，**更新 `vm._props`，也就是子组件的 `props`，这个就是子组件 `props` 的更新过程**。

##### 子组件重新渲染

其实子组件的重新渲染有 2 种情况，一个是 **`prop` 值被修改**，另一个是**对象类型的 `prop` 内部属性的变化**。

先来看一下 `prop` 值被修改的情况，当执行 `props[key] = validateProp(key, propOptions, propsData, vm)` **更新子组件 `prop` 的时候，会触发 `prop` 的 `setter` 过程，只要在渲染子组件的时候访问过这个 `prop` 值，那么根据响应式原理，就会触发子组件的重新渲染**。

再来看一下**当对象类型的 `prop` 的内部属性发生变化的时候，这个时候其实并没有触发子组件 `prop` 的更新**。但是在**子组件的渲染过程**中，**访问过这个对象 `prop`**，所以这个**对象 `prop` 在触发 `getter` 的时候会把子组件的 `render watcher` 收集到依赖中**，然后当我们在**父组件更新这个对象 `prop` 的某个属性的时候，会触发 `setter` 过程，也就会通知子组件 `render watcher` 的 `update`，进而触发子组件的重新渲染**。

以上就是当父组件 `props` 更新，触发子组件重新渲染的 2 种情况。

#### toggleObserving

最后我们在来聊一下 `toggleObserving`，它的定义在 `src/core/observer/index.js` 中：

```js
export let shouldObserve: boolean = true

export function toggleObserving (value: boolean) {
  shouldObserve = value
}
```

它在当前模块中定义了 `shouldObserve` 变量，用来控制在 `observe` 的过程中是否需要把当前值变成一个 `Observer` 对象。

**那么为什么在 `props` 的初始化和更新过程中，多次执行 `toggleObserving(false)` 呢，接下来我们就来分析这几种情况**。

在 `initProps` 的过程中：

```js
const isRoot = !vm.$parent
// root instance props should be converted
if (!isRoot) {
  toggleObserving(false)
}
for (const key in propsOptions) {
  // ...
  const value = validateProp(key, propsOptions, propsData, vm)
  defineReactive(props, key, value)
  // ...
}
toggleObserving(true)
```

对于**非根实例的情况**，我们会执行 `toggleObserving(false)`，**然后对于每一个 `prop` 值，去执行 `defineReactive(props, key, value)` 去把它变成响应式**。

回顾一下 `defineReactive` 的定义：

```js
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // ...
  
  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      // ...
    },
    set: function reactiveSetter (newVal) {
      // ...
    }
  })
}
```

通常对于值 `val` 会执行 `observe` 函数，然后遇到 `val` 是对象或者数组的情况会递归执行 `defineReactive` 把它们的子属性都变成响应式的，但是由于 `shouldObserve` 的值变成了 `false`，这个递归过程被省略了。为什么会这样呢？

因为正如我们前面分析的，对于对象的 `prop` 值，子组件的 `prop` 值始终指向父组件的 `prop` 值，只要父组件的 `prop` 值变化，就会触发子组件的重新渲染，所以这个 `observe` 过程是可以省略的。

最后再执行 `toggleObserving(true)` 恢复 `shouldObserve` 为 `true`。

在 `validateProp` 的过程中：

```js
// check default value
if (value === undefined) {
  value = getPropDefaultValue(vm, prop, key)
  // since the default value is a fresh copy,
  // make sure to observe it.
  const prevShouldObserve = shouldObserve
  toggleObserving(true)
  observe(value)
  toggleObserving(prevShouldObserve)
}
```

这种是父组件没有传递 `prop` 值对默认值的处理逻辑，因为这个值是一个拷贝，所以我们需要 `toggleObserving(true)`，然后执行 `observe(value)` 把值变成响应式。

在 `updateChildComponent` 过程中：

```js
// update props
if (propsData && vm.$options.props) {
  toggleObserving(false)
  const props = vm._props
  const propKeys = vm.$options._propKeys || []
  for (let i = 0; i < propKeys.length; i++) {
    const key = propKeys[i]
    const propOptions: any = vm.$options.props // wtf flow?
    props[key] = validateProp(key, propOptions, propsData, vm)
  }
  toggleObserving(true)
  // keep a copy of raw propsData
  vm.$options.propsData = propsData
}
```

其实和 `initProps` 的逻辑一样，不需要对引用类型 `props` 递归做响应式处理，所以也需要 `toggleObserving(false)`。
