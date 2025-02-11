`vue-demi` 是一个用来让 Vue 2 和 Vue 3 兼容的库，它通过动态导入和 API 代理，让你能够编写一次代码，同时支持 Vue 2 和 Vue 3。接下来，我们会深入分析它的源码，理解其如何实现这一目标。

### **1. `vue-demi` 项目结构**

`vue-demi` 的源代码主要位于其 GitHub 仓库中的 `index.mjs` 和 `index.cjs` 文件，以及一些配套的辅助文件。它的结构大致如下：

```sh
vue-demi/
├── dist/
│   ├── index.cjs
│   ├── index.mjs
├── scripts/
│   └── postinstall.js
├── package.json
└── README.md
```

### **2. `vue-demi` 的基本功能**

#### **(1) 自动版本检测**

`vue-demi` 通过一些小技巧来自动检测当前项目使用的是 Vue 2 还是 Vue 3。为了做到这一点，`vue-demi` 需要确保它加载到的是正确的 Vue 版本。

例如，`vue-demi` 通过检查 `require.resolve('vue')` 或 `@vue/composition-api` 是否存在，来决定使用 Vue 2 还是 Vue 3：

```js
let vuePath
try {
  vuePath = require.resolve('vue')  // 尝试解析 Vue 3
} catch (e) {
  try {
    vuePath = require.resolve('@vue/composition-api')  // 如果 Vue 3 不存在，尝试 Vue 2 的 Composition API
  } catch (e) {
    console.error('Vue is not installed')  // 如果都没有找到，说明没有安装 Vue
  }
}
```

这段代码确保了 `vue-demi` 会自动根据项目中存在的 Vue 版本加载适当的模块。

#### **(2) API 代理**

`vue-demi` 的核心思想是通过代理 Vue 2 和 Vue 3 的 API，使得开发者无需关心具体的版本，只需要通过 `vue-demi` 提供的统一接口来编写代码。比如：

- `reactive`
- `ref`
- `defineComponent`
- `watchEffect`

`vue-demi` 会根据 Vue 的版本自动代理相应的 API：

```js
// 代理 reactive API
export const reactive = isVue3 ? Vue3Reactive : Vue2Reactive

// 代理 ref API
export const ref = isVue3 ? Vue3Ref : Vue2Ref

// 代理 watchEffect API
export const watchEffect = isVue3 ? Vue3WatchEffect : Vue2WatchEffect
```

这样，无论是 Vue 2 还是 Vue 3，开发者都可以使用相同的接口来创建响应式数据，使用 Composition API。

### **3. `vue-demi` 的版本切换机制**

`vue-demi` 允许你切换 Vue 版本。它通过 `postinstall` 脚本来确保 `vue-demi` 与项目中的 Vue 版本兼容。`postinstall.js` 脚本会在安装过程中执行，自动根据当前项目使用的 Vue 版本来选择正确的 API 实现。

```js
const fs = require('fs')
const path = require('path')

const vuePath = require.resolve('vue')  // 自动检测 Vue 版本

const isVue3 = fs.existsSync(path.resolve(vuePath, 'package.json'))

if (isVue3) {
  // 如果是 Vue 3，创建 Vue 3 版本的软链接
} else {
  // 否则，创建 Vue 2 版本的软链接
}
```

通过这种方式，`vue-demi` 能够保证你总是使用正确的 Vue 版本，同时开发者不需要手动去安装和切换 Vue 版本。

### **4. `vue-demi` 的 `dist/` 文件夹**

`vue-demi` 会通过 `dist/` 文件夹提供已经编译好的代码，其中包含 `index.mjs` 和 `index.cjs` 两个版本。

- **`index.mjs`**: 支持 ES 模块的版本，适用于现代 JavaScript 环境。
- **`index.cjs`**: 支持 CommonJS 模块的版本，适用于 Node.js 等环境。

这两个文件实际上是同一个功能，只是适配了不同的模块规范。

### **5. `vue-demi` 的安装过程和软链接**

`vue-demi` 在安装时，会根据项目使用的 Vue 版本自动创建软链接。通过运行以下命令，它会判断项目的 Vue 版本，并创建软链接：

```bash
npm install vue-demi
```

在安装过程中，`postinstall.js` 脚本会执行，自动进行 Vue 版本检查并创建软链接，确保你的项目能够正常使用 Vue 2 或 Vue 3。

------

### **总结**

`vue-demi` 的核心功能是通过 **动态导入** 和 **API 代理** 来兼容 Vue 2 和 Vue 3，让开发者能够同时支持这两个版本的 Vue。它通过：

1. **自动检测 Vue 版本**：在安装过程中，通过检查 `vue` 或 `@vue/composition-api` 是否存在，判断使用的 Vue 版本。
2. **统一的 API 接口**：通过代理 Vue 2 和 Vue 3 的 API，使得开发者无需关心版本差异，只需要使用相同的 API。
3. **安装时自动切换**：通过 `postinstall` 脚本和软链接的方式，确保项目始终与正确的 Vue 版本兼容。

这种方式极大地简化了开发者在 Vue 2 和 Vue 3 之间切换时的复杂性，使得 **Vue 组件库和插件开发者**能够更容易地支持多版本 Vue。

## 方案

背景：2023年年底 Vue 2 将不再继续支持，如果需要继续支持需要购买服务。这其实会存在很多未知的风险，比如浏览器的兼容问题；for instance == 曾经 Chrome 浏览器升级的时候，将 transform 的一个属性默认值改成了 ‘auto’，而在 Vue.js 基础组件中该值默认值均为 0，这个类型的改变导致了 Vue.js 组件中 transform 所有属性的失效。当时 Vue 就通过与 Chrome 进行协商，最终解决了这个问题。！！！但是，以后 Vue 2 将会停止支持，也就意味着这种风险并不会在第一时间高优去解决，因此这是一个风险。**所以建议升级 Vue 3，至少到 2.7。**

该议题可能存在的场景分为三种

1. 项目融合者：公司内部基于体验要求，需要 Vue2 和 Vue3 同时存在于一个页面中。(微前端，非本次议题)
2. 内部组件资产维护者：需要在 Vue2 和 Vue3 的项目都支持，且能力必须一致。
3. 老项目应用开发者，需要用到一个第三方组件，且该组件只有 Vue3 版本。

- #### **【内部组件维护者】当前的组件库同时支持 Vue 2 和 Vue 3 两个版本可以怎么去做？前提版本 >= 2.7**

目前主要存在两种管理的模式，monorepo + 软链接 && 单仓库 + alias 别名。demo案例：

https://github.com/JessicaSachs/petite

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229150736376.png)

https://github.com/sodatea/feday-2023-demo

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229150737446.png)

两者共同的优势在于不论是支持 v2 还是 v3，都只需要开发一套组件即可～

前者将 Vue2 lib 部分通过 Vue-bridge 软链接到 Vue3 lib 部分，从而实现只开发Vue3部分代码也可以使用 build:v2 打包形成 Vue2 部分的产物，这种方法的优势在于 Vue-bridge 为开发者提供了很好的依赖管理支持，同时项目结构非常清晰，易于开发者理解，build 也是分开来完成的；通过 vue-demi 在业务侧即可切换版本，指向对应版本的依赖。

为什么用 vue-bridge？它保证了我们的 lib-vue2  部分指向的依赖是自己的 vue2 node_modules，而不是默认的 lib-vue3 下依赖，同时它提供了lint、runtime、vite-plugin 确保开发者能写出互相兼容的代码，给之前的不兼容都上了约束，详细可以看看下面这篇文档链接。



```
// 部分使用 vueBridge 的 lib-vue2 部分 vite 配置,lib-vue3 同理
export default defineConfig({
  plugins: pluginsConfig([
    vue(),
    vueJsx(),
    // @ts-expect-error Vue Bridge doesn't have a name value.
    vueBridge({
      vueVersion: '2',
      localizeDeps: true,
      useSwc: true,
      swcOptions: {
        env: {
          mode: 'usage',
        },
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: false,
          },
          loose: true,
        },
      },
    }),
  ]),
  resolve: {
    alias: {
      '@vue-bridge/runtime': '@vue-bridge/runtime/vue2',
    },
  },
  // xxx
})
```



https://vue-bridge-docs.netlify.app/topics/introduction-why-vue-bridge.html#introducing-the-vue-bridge-suite

后者则是使用了单仓库与alias别名的方式，在业务侧引用 postinstall 脚本将会取到对应的产物进行引入，不过显而易见的 build 脚本也会变得很长，需要同时处理 Vue2 和 Vue3 的组件产物。

- #### **【老项目应用开发者】未来的规划**

*首先需要一些前置条件，项目升级为 Vue 2.7，移除一些过时的插件；其次遵守开发约定，**在 Vue 2 项目中使用 Vue 3 组件需要在项目中新建一个 Vue3 文件夹，Vue 3 组件都会放入这个文件夹，并且需要命名为 xxx.ce.vue，同时在 Vue 2 老项目中添加 Vue.config.ignoredElements* *。最终该文件夹中的组件将会通过 vite 的配置转换为 custom elements，然后直接在 Vue 2 项目中去使用。*

![image-20231229150801596](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/image-20231229150801596.png)

## vue-demi解析

### 核心概念

`vue-demi` 是一个用于在 Vue 2 中使用 Vue 3 Composition API 的库。Vue 3 的 Composition API 提供了更灵活和强大的组合式 API，但它是为 Vue 3 设计的。`vue-demi` 的目的是使开发者可以在 Vue 2 项目中使用类似 Vue 3 的 Composition API。

`vue-demi` 的实现原理主要基于两个核心概念：

1. **适配层：** `vue-demi` 提供了一层适配层，通过这一层来模拟 Vue 3 的 Composition API。这使得开发者可以在 Vue 2 中使用类似的语法和功能，而无需迁移到 Vue 3。
2. **TypeScript 类型处理：** `vue-demi` 使用 TypeScript 来处理类型。它定义了一些类型和接口，以适配 Vue 3 Composition API 的类型系统，从而在 Vue 2 中使用时能够获得类型检查和提示。

具体而言，`vue-demi` 的实现原理涉及以下关键点：

- **模拟 ref 和 reactive：** 在 Vue 3 中，`ref` 和 `reactive` 是 Composition API 的核心概念，用于创建响应式的数据。`vue-demi` 通过模拟这些概念，在 Vue 2 中提供类似的 API。
- **`onUnmounted` 和生命周期函数：** Vue 3 引入了 `onUnmounted` 等新的生命周期函数，而 Vue 2 中没有这些函数。`vue-demi` 提供了对应的适配实现，以便在 Vue 2 中使用。
- **类型适配：** 通过 TypeScript 类型处理，`vue-demi` 能够提供在 Vue 2 中使用 Vue 3 Composition API 时的类型检查和智能提示。这是通过定义一些 TypeScript 的类型和接口，以适配 Vue 3 的类型系统。

通过这些适配和类型处理，`vue-demi` 使得在 Vue 2 中使用 Composition API 变得更加方便和舒适。它为开发者提供了平滑迁移到 Vue 3 的途径，同时能够在当前项目中享受到 Composition API 带来的好处。





`vue-demi` 的源码相对较为庞大，这里提供一个简单的源码解析，帮助理解它是如何实现在 Vue 2 中使用 Vue 3 Composition API 的。

以下是 `vue-demi` 的核心部分，主要包括对 `ref`、`reactive`、生命周期函数等的适配：

```
typescriptCopy code
// vue-demi/index.d.ts

import Vue from 'vue';

// 适配 Vue 3 的 ref 和 reactive
type Ref<T = any> = Vue['$refs'] & { value: T };
function ref<T = any>(raw: T): Ref<T>;
function ref<T = any>(): Ref<T | undefined>;

type UnwrapRef<T> = T extends Ref<infer V> ? V : T;
function isRef(target: any): target is Ref;

type ComputedRef<T = any> = Vue['$computed'] & { value: T };
function computed<T>(getter: () => T): ComputedRef<T>;

// 适配 Vue 3 的 onUnmounted 和生命周期函数
function onUnmounted(fn: () => void): void;

// 其他适配...

export {
  Ref,
  ref,
  UnwrapRef,
  isRef,
  ComputedRef,
  computed,
  onUnmounted,
  // 其他导出...
};
```

这段代码定义了 `vue-demi` 中用于适配的一些类型和函数。关键点包括：

1. **`ref` 和 `computed` 的适配：** 提供了与 Vue 3 中相似的 `ref` 和 `computed` 函数，以便在 Vue 2 中创建响应式数据和计算属性。
2. **`onUnmounted` 函数的适配：** 提供了在 Vue 2 中模拟 Vue 3 的 `onUnmounted` 函数，用于在组件销毁时执行一些清理工作。

这只是 `vue-demi` 中的一部分适配代码，实际源码中还包括了更多的适配逻辑，以确保在 Vue 2 中能够兼容 Vue 3 的 Composition API。

总体而言，`vue-demi` 的源码主要通过 TypeScript 类型处理和适配层的方式，在 Vue 2 中提供了一套兼容 Vue 3 Composition API 的接口和函数。这使得开发者可以在 Vue 2 中使用类似 Vue 3 的语法和功能，为平滑迁移提供了便利。如果你对其中的细节有兴趣，建议直接查看 `vue-demi` 的完整源码。

### vue-demi的案例

 ![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229151109937.png)









 上图是简单描述了组件在页面的作用方式及层级，我们可以看到一个页面可以由基础组件+业务组件+区块构成。对于一个复杂的前端系统，想要组件能够被频繁使用，且能满足大部分业务场景，就需要设计一个好的架构，对页面中的内容进行合理拆分。

**常规思路：**

开发一套vue2的组件库，项目升级vue3时再同步升级一套vue3的组件库。

优点：**前期开发快，**项目中要么是vue2要么是vue3**，所见即所得，没有兼容的心智负担**

缺点：**重构成本高**，且需要维护两套代码，**维护成本高。（一个需求搞两次，一个bug修两遍，工作量加倍，属实顶不住）**



**懒癌思路：**就想开发一套代码，构建好可以同时支持vue2和vue3**。**

**可行吗？可行！**使用vue-demi，打穿vue2-vue3的壁垒，上面的问题就不复存在了。 

根据创建者 Anthony Fu 的说法，**Vue Demi 是一个开发实用程序，它允许用户为 Vue 2 和 Vue 3 编写通用的 Vue 库，而无需担心用户安装的版本**。

**既然如此，我们先看下vue-demi的原理：**主要是利用compositionAPI在写法上和vue3的一致性进行兼容的过渡。

**核心：通过postinstall这个钩子，对版本判断从而去更改lib文件下的文件，动态改变用户引用的版本。**

总结一句，就是vue-demi会根据用户使用vue的版本号来判断，vue2时加入@vue/composition-api。

那好了，我们的写法搞定了，现在组件库可以一套代码兼容vue2和vue3了吗？

还是不行，我们的核心功能是用sfc的vue文件打包的，写的是template，并不是render函数，关于template的解析，v2和v3解析出来的不能通用的，因为v3之所以快，是因为对temlate的比对优化了，具体咋优化的大家可以查看vue3的源码。这种场景肯定不能只打包一次就同时支持vue2和vue3调用。

**那我们可以参考vue-demi，从postinstall着手，也编译两个版本，在宿主系统中通过宿主系统的版本判断要加载哪套组件代码，不就ok了吗？**

没错，目前就是这么干的。

此时就可以一套代码，使用vue2和vue3编译两次，达到支持vue2和vue3的目的。

我们来看下优缺点：

**优点：一套代码，易于维护，开发成本低，同时支持vue2、vue3**

**缺点：**写代码的时候，仍然有些写法是vue2和vue3有差异的，并不能完全抹平，但是情况很少。需要编译两次，

例如：组件上绑定v-model，vue3子组件的属性为 `modelValue`， vue2为 'value';



```
import { isVue2, isVue3 } from 'vue-demi' 
if (isVue2) { 
  // Vue 2 only 
} else { 
  // Vue 3 only 
}
```





**问题：如果不用SFC，改用render的写法，能只build一次吗 ？**

**答：可以。**

**我们的组件render-demo.ts如下**



```
import { defineComponent, h, ref } from 'vue-demi'

export default defineComponent({
  name: 'RenderDemo',
  props: {},
  setup() {
    const count = ref(0)
    return () => h('div', {
        on:{  // vue2 h函数底层为 createElement
            click(){
                console.log('update')
                count.value++
            }

        },
        onClick() {  // vue3  h函数
            console.log('update')
            count.value++
            }
        }, [
            h('div', `count: ${count.value}`),
            h('div', 'RenderDemo')
        ])
  }
})
```



**通过编译后产物是一样的：即可认为不论在vue2还是vue3环境打包只build一次即可同时支持。但是有vue2和vue3写法上的区别（参照官方文档：**[**v3**](https://cn.vuejs.org/guide/extras/render-function.html#creating-vnodes)**、**[**v2**](https://v2.cn.vuejs.org/v2/guide/render-function.html)**），需要手动处理。PS:这样享受不到vue3模板编译静态提升的优化了。**

**问题：vue3支持optionApi吗？**

**答：支持。**

**问题：那能不能都用optionApi写，只build一次？**

**答：不能，因为vue2和vue3编译SFC的依赖插件不同，底层代码有差异。**

到目前为止，我们的整个“实时可交互式文档”已经搭建完了，是不是意味着可以交付给其他同学进行真正的组件开发了呢？假设你是另一个开发同学，我跟你说：“你只要在这里，这里和这里新建这些文件，然后在这里和这里修改一下配置就可以新建一个组件了！”你会不会很想打人？我们先看看需要哪些步骤...

### **1、快速开发一个基础组件需要哪些文件？**

首先需要的是组件文件，有了组件文件还需要文档文件，至少需要四个。

- 创建四个文件如下：

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229151341725.png)![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229151342420.png)

创建了文件还不够，还需要对一些文件进行修改。

- 为文档创建路由

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229151344030.png)

- 组件库引入组件，注册组件，暴露组件

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229151345144.png)

好麻烦，组件还没开发，竟然先要改这么多地方，每次都这样搞一遍人都麻了，这种枯燥乏味的事情还是交给程序干吧。。。

### **2、如何通过命令行快速创建模板文件？**

- **首先就是需要解决文件创建**

这个简单，我们创建一套模板文件，对应上述四个必须的基础文件



```
|-- component-template
  |-- comp   // 组件文件
  |   |-- component-template.vue // 组件代码
  |   |-- index.ts  // 暴露组件
  |-- doc   // 文档文件
    |-- component-template.md   // 组件文档
    |-- demo // 文档中的示例文件
    |-- demo-1.vue 
```



**名称怎么改呢？不能都叫demoComponent吧**

文件名在copy时替换即可，文件中的内容通过mastache语法进行模板替换即可。

代码如下：



```
// 替换文件内容
function replaceInfo(filePath, componentName, componentDesc) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return err;
        }
        let str = data.toString();
        str = str.replace(/{{component-name}}/g, componentName).replace(/{{component-desc}}/g, componentDesc);
        fs.writeFile(filePath, str, function (err) {
            if (err) {return err;}
        });
    });
}
// 替换文件名
async function modifyInfo({ filesPath, componentName, componentDesc}) {
    filesPath.forEach(async ({ target }) => {
        walk(target, function (path, fileName) {
            const oldPath = path + '/' + fileName;
            const newPath = path + '/' + fileName.replace('component-template', componentName);
            renameFile(oldPath, newPath);
            replaceInfo(newPath, componentName, componentDesc);
        });
    });
}
```



- 自动修改上述的路由和组件引入以及暴露的文件

这里我们虽然也可以直接修改文件，注入代码，但是试想一下，如果日后组件越来越多，这个时候路由和入口文件很可能这样，密密麻麻，还很乱，看着就头疼。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229151346506.png)![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229151347603.png)

所以我们不能用这么蠢的方式。。。

**需要简单修改一下**

- 对于组件引入和暴露可以这样

收拢到entry.ts中进行引入暴露

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229151348463.png)

index.ts只需要对entry暴露出去的模块对象遍历注册即可，单个导出也更简洁了



```
// 引入公共样式
import './styles/base.less';

// 引入组件
import * as components from './entry';
import { installArgument } from './utils/install';
// 全局注册组件
const install = function (_vue: installArgument) {
    Object.values(components).forEach(comp => {
        if (!comp || !comp.name) {
            return;
        }
        comp.install(_vue);
    });
};

const plugin = {
    install,
};

// 单个导出
export * from './entry';

// 整体导出
export default plugin;
```



- 文档路由同理，也收拢到一个入口文件，进行遍历



```
import components from '../../../components';

.....

compRouteConfig = [
        {
            text: '业务组件',
            collapsible: true,
            items: [
                ...Object.keys(components).map(comName => {
                    return { text: components[comName].zhName, link: `/guide/${components[comName].name}/${components[comName].name}` };
                }),
                // { text: 'demo', link: `/guide/demo/demo.md` }
            ],
        },
    ];
```



components.json中



```
{
    "demo-component": {
        "name": "demo-component",
        "zhName": "示例组件",
        "desc": "默认：这是一个新组件",
        "url": "./src/components/demo-component/index.ts"
    }
}
```



#### **总结一下:**

1、创建四个文件，替换其中关键信息

2、修改entry，components.json，添加新建的组件信息

需要的关键信息只有三个，组件名，组件描述，组件中文名，所以我们创建时要输入如下即可：

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229151349312.png)

**想实现命令行提问并收集输入的答案需要用到一个库** **inquirer**

代码很简单



```
inquirer.prompt([
        {
            type: 'input',
            name: 'componentName',
            message: 'Component name (kebab-case):',
            default: 'demo-component',
        },
        {
            type: 'input',
            name: 'componentZhName',
            message: '请输入你要新建的组件名（中文）:',
            default: '示例组件',
        },
        {
            type: 'input',
            message: '请输入组件的功能描述：',
            name: 'componentDesc',
            default: '默认：这是一个新组件'
        }
    ]);
```



通过node运行后，会提出三个我们设计好的问题，保存在一个对象中我们导出使用即可。然后拿着这些信息按照上面的流程替换模板内容，拷贝文件到对应目录就可以快速开发了。





SFC template of vue-demi project, can dev & test & build 编写基于 vue-demi 单文件组件模板库

https://github.com/ChuHoMan/vue-demi-component-template

- 为 Vue2.6/2.7/3 提供库模式的开发环境
- 为 Vue2/3 提供库模式的测试/构建环境
- 提供 Vue2.7/3 库模式的 dts 解决方案（Vue 2.6 仅部分支持）
- 在发布时用于适配 package.json 的脚本

写这个包的主要目的是为了使用`vue-demi`来写`vue2`和`vue3`的公用组件。简单说一下自己的开发感受吧。不没有想象中的那么顺利（可能是自己没有理解到位）； 使用`vue-demi` 里面目前来说只能`vue2`和`vue3`选择一种来进行测试，如果你想在同一个项目中对`vue2`和`vue3`来切换测试，我没有做到，会有些问题。比如： 我曾在项目中建立了一个`examplev2`和`examplev3`来进行项目测试，`vue3`正常启动，`vue2`就会启动不了。我使用的是yarn workspace来进行搭建的。所以全局只能有一个`vue`,`vue2`我就重命名了，重命名后的结果就是`vue-template-complier` 里面不能识别我的`vue2`. 所以自己就只能单独搭建项目来进行测试

https://github.com/cll123456/test-demi





### charts

https://github.com/victorgarciaesgi/vue-chart-3



```
/* eslint-disable vue/multi-word-component-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  defineComponent,
  shallowRef,
  toRefs,
  watch,
  computed,
  inject,
  onMounted,
  onBeforeUnmount,
  h,
  nextTick,
  watchEffect,
  getCurrentInstance,
  Vue2,
  type PropType,
  type InjectionKey
} from "vue-demi";
import { init as initChart } from "echarts/core";
import type {
  EChartsType,
  EventTarget,
  Option,
  Theme,
  ThemeInjection,
  InitOptions,
  InitOptionsInjection,
  UpdateOptions,
  UpdateOptionsInjection,
  Emits
} from "./types";
import {
  usePublicAPI,
  useAutoresize,
  autoresizeProps,
  useLoading,
  loadingProps
} from "./composables";
import { omitOn, unwrapInjected } from "./utils";
import { register, TAG_NAME, type EChartsElement } from "./wc";
import "./style.css";

const wcRegistered = register();

if (Vue2) {
  Vue2.config.ignoredElements.push(TAG_NAME);
}

export const THEME_KEY = "ecTheme" as unknown as InjectionKey<ThemeInjection>;
export const INIT_OPTIONS_KEY =
  "ecInitOptions" as unknown as InjectionKey<InitOptionsInjection>;
export const UPDATE_OPTIONS_KEY =
  "ecUpdateOptions" as unknown as InjectionKey<UpdateOptionsInjection>;
export { LOADING_OPTIONS_KEY } from "./composables";

export default defineComponent({
  name: "echarts",
  props: {
    option: Object as PropType<Option>,
    theme: {
      type: [Object, String] as PropType<Theme>
    },
    initOptions: Object as PropType<InitOptions>,
    updateOptions: Object as PropType<UpdateOptions>,
    group: String,
    manualUpdate: Boolean,
    ...autoresizeProps,
    ...loadingProps
  },
  emits: {} as unknown as Emits,
  inheritAttrs: false,
  setup(props, { attrs }) {
    const root = shallowRef<EChartsElement>();
    const chart = shallowRef<EChartsType>();
    const manualOption = shallowRef<Option>();
    const defaultTheme = inject(THEME_KEY, null);
    const defaultInitOptions = inject(INIT_OPTIONS_KEY, null);
    const defaultUpdateOptions = inject(UPDATE_OPTIONS_KEY, null);

    const { autoresize, manualUpdate, loading, loadingOptions } = toRefs(props);

    const realOption = computed(
      () => manualOption.value || props.option || null
    );
    const realTheme = computed(
      () => props.theme || unwrapInjected(defaultTheme, {})
    );
    const realInitOptions = computed(
      () => props.initOptions || unwrapInjected(defaultInitOptions, {})
    );
    const realUpdateOptions = computed(
      () => props.updateOptions || unwrapInjected(defaultUpdateOptions, {})
    );
    const nonEventAttrs = computed(() => omitOn(attrs));

    // @ts-expect-error listeners for Vue 2 compatibility
    const listeners = getCurrentInstance().proxy.$listeners;

    function init(option?: Option) {
      if (!root.value) {
        return;
      }

      const instance = (chart.value = initChart(
        root.value,
        realTheme.value,
        realInitOptions.value
      ));

      if (props.group) {
        instance.group = props.group;
      }

      let realListeners = listeners;
      if (!realListeners) {
        realListeners = {};

        Object.keys(attrs)
          .filter(key => key.indexOf("on") === 0 && key.length > 2)
          .forEach(key => {
            // onClick    -> c + lick
            // onZr:click -> z + r:click
            let event = key.charAt(2).toLowerCase() + key.slice(3);

            // clickOnce    -> ~click
            // zr:clickOnce -> ~zr:click
            if (event.substring(event.length - 4) === "Once") {
              event = `~${event.substring(0, event.length - 4)}`;
            }

            realListeners[event] = attrs[key];
          });
      }

      Object.keys(realListeners).forEach(key => {
        let handler = realListeners[key];

        if (!handler) {
          return;
        }

        let event = key.toLowerCase();
        if (event.charAt(0) === "~") {
          event = event.substring(1);
          handler.__once__ = true;
        }

        let target: EventTarget = instance;
        if (event.indexOf("zr:") === 0) {
          target = instance.getZr();
          event = event.substring(3);
        }

        if (handler.__once__) {
          delete handler.__once__;

          const raw = handler;

          handler = (...args: any[]) => {
            raw(...args);
            target.off(event, handler);
          };
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore EChartsType["on"] is not compatible with ZRenderType["on"]
        // but it's okay here
        target.on(event, handler);
      });

      function resize() {
        if (instance && !instance.isDisposed()) {
          instance.resize();
        }
      }

      function commit() {
        const opt = option || realOption.value;
        if (opt) {
          instance.setOption(opt, realUpdateOptions.value);
        }
      }

      if (autoresize.value) {
        // Try to make chart fit to container in case container size
        // is changed synchronously or in already queued microtasks
        nextTick(() => {
          resize();
          commit();
        });
      } else {
        commit();
      }
    }

    function setOption(option: Option, updateOptions?: UpdateOptions) {
      if (props.manualUpdate) {
        manualOption.value = option;
      }

      if (!chart.value) {
        init(option);
      } else {
        chart.value.setOption(option, updateOptions || {});
      }
    }

    function cleanup() {
      if (chart.value) {
        chart.value.dispose();
        chart.value = undefined;
      }
    }

    let unwatchOption: (() => void) | null = null;
    watch(
      manualUpdate,
      manualUpdate => {
        if (typeof unwatchOption === "function") {
          unwatchOption();
          unwatchOption = null;
        }

        if (!manualUpdate) {
          unwatchOption = watch(
            () => props.option,
            (option, oldOption) => {
              if (!option) {
                return;
              }
              if (!chart.value) {
                init();
              } else {
                chart.value.setOption(option, {
                  // mutating `option` will lead to `notMerge: false` and
                  // replacing it with new reference will lead to `notMerge: true`
                  notMerge: option !== oldOption,
                  ...realUpdateOptions.value
                });
              }
            },
            { deep: true }
          );
        }
      },
      {
        immediate: true
      }
    );

    watch(
      [realTheme, realInitOptions],
      () => {
        cleanup();
        init();
      },
      {
        deep: true
      }
    );

    watchEffect(() => {
      if (props.group && chart.value) {
        chart.value.group = props.group;
      }
    });

    const publicApi = usePublicAPI(chart);

    useLoading(chart, loading, loadingOptions);

    useAutoresize(chart, autoresize, root);

    onMounted(() => {
      init();
    });

    onBeforeUnmount(() => {
      if (wcRegistered && root.value) {
        // For registered web component, we can leverage the
        // `disconnectedCallback` to dispose the chart instance
        // so that we can delay the cleanup after exsiting leaving
        // transition.
        root.value.__dispose = cleanup;
      } else {
        cleanup();
      }
    });

    return {
      chart,
      root,
      setOption,
      nonEventAttrs,
      ...publicApi
    };
  },
  render() {
    // Vue 3 and Vue 2 have different vnode props format:
    // See https://v3-migration.vuejs.org/breaking-changes/render-function-api.html#vnode-props-format
    const attrs = (
      Vue2 ? { attrs: this.nonEventAttrs } : { ...this.nonEventAttrs }
    ) as any;
    attrs.ref = "root";
    attrs.class = attrs.class ? ["echarts"].concat(attrs.class) : "echarts";
    return h(TAG_NAME, attrs);
  }
});

```

这是一个 Vue 组件，主要用于在 Vue 2 中使用 ECharts 图表库，并提供了对应的 Vue 3 Composition API 风格的接口。以下是对代码的简要解释：

1. **导入模块：** 导入了 Vue 相关的模块，以及一些用于 ECharts 的相关模块。

```
javascriptCopy code
import {
  defineComponent,
  shallowRef,
  toRefs,
  watch,
  computed,
  inject,
  onMounted,
  onBeforeUnmount,
  h,
  nextTick,
  watchEffect,
  getCurrentInstance,
  Vue2,
  type PropType,
  type InjectionKey
} from "vue-demi";
import { init as initChart } from "echarts/core";
import type {
  EChartsType,
  EventTarget,
  Option,
  Theme,
  ThemeInjection,
  InitOptions,
  InitOptionsInjection,
  UpdateOptions,
  UpdateOptionsInjection,
  Emits
} from "./types";
import {
  usePublicAPI,
  useAutoresize,
  autoresizeProps,
  useLoading,
  loadingProps
} from "./composables";
import { omitOn, unwrapInjected } from "./utils";
import { register, TAG_NAME, type EChartsElement } from "./wc";
import "./style.css";
```

1. **注册 Web Component（仅在 Vue 2 中使用）：** 如果在 Vue 2 中使用，会将当前组件注册为 Web Component。

```
javascriptCopy code
const wcRegistered = register();

if (Vue2) {
  Vue2.config.ignoredElements.push(TAG_NAME);
}
```

1. **定义一些注入的关键字（InjectionKey）：** 用于从祖先组件中注入默认的主题、初始化选项和更新选项。

```
javascriptCopy code
export const THEME_KEY = "ecTheme" as unknown as InjectionKey<ThemeInjection>;
export const INIT_OPTIONS_KEY =
  "ecInitOptions" as unknown as InjectionKey<InitOptionsInjection>;
export const UPDATE_OPTIONS_KEY =
  "ecUpdateOptions" as unknown as InjectionKey<UpdateOptionsInjection>;
export { LOADING_OPTIONS_KEY } from "./composables";
```

1. **主组件定义：** 使用 `defineComponent` 定义了一个名为 "echarts" 的 Vue 组件。

```
javascriptCopy code
export default defineComponent({
  name: "echarts",
  props: {
    // 省略部分 props 定义
  },
  emits: {} as unknown as Emits,
  inheritAttrs: false,
  setup(props, { attrs }) {
    // 组件的主要逻辑
  },
  render() {
    // 渲染函数
  }
});
```

1. **setup 函数：** 这是 Vue 3 Composition API 的入口函数，用于设置组件的状态和行为。

```
javascriptCopy code
setup(props, { attrs }) {
  // 省略部分逻辑，包括响应式状态、计算属性、事件处理等
  return {
    // 返回组件的公共 API
  };
},
```

1. **render 函数：** 用于渲染组件的 VNode。

```
javascriptCopy code
render() {
  const attrs = (
    Vue2 ? { attrs: this.nonEventAttrs } : { ...this.nonEventAttrs }
  ) as any;
  attrs.ref = "root";
  attrs.class = attrs.class ? ["echarts"].concat(attrs.class) : "echarts";
  return h(TAG_NAME, attrs);
}
```

这里的代码涉及到了很多 Vue 3 Composition API 的概念，包括 `setup` 函数、响应式 API（`shallowRef`、`toRefs`、`computed` 等）、生命周期钩子（`onMounted`、`onBeforeUnmount` 等）、Vue 2 兼容性等。整体来说，这个组件是一个封装了 ECharts 的 Vue 组件，提供了一些便捷的 API 和组合式函数，以及对 Web Component 的支持。

```
let registered: boolean | null = null;

export const TAG_NAME = "x-vue-echarts";

export interface EChartsElement extends HTMLElement {
  __dispose: (() => void) | null;
}

export function register(): boolean {
  if (registered != null) {
    return registered;
  }

  if (
    typeof HTMLElement === "undefined" ||
    typeof customElements === "undefined"
  ) {
    return (registered = false);
  }

  try {
    // Class definitions cannot be transpiled to ES5
    // so we are doing a little trick here to ensure
    // we are using native classes. As we use this as
    // a progressive enhancement, it will be fine even
    // if the browser doesn't support native classes.
    const reg = new Function(
      "tag",
      `class EChartsElement extends HTMLElement {
  __dispose = null;

  disconnectedCallback() {
    if (this.__dispose) {
      this.__dispose();
      this.__dispose = null;
    }
  }
}

if (customElements.get(tag) == null) {
  customElements.define(tag, EChartsElement);
}
`
    );
    reg(TAG_NAME);
  } catch (e) {
    return (registered = false);
  }

  return (registered = true);
}

```

这段代码是用于注册一个自定义的 Web Component，其目的是为了在支持 Web Component 的环境中，将 ECharts 包装成一个自定义元素。以下是对代码的分析：

1. **`registered` 变量：** 该变量用于记录是否已经注册过自定义元素。初始值为 `null`，表示尚未确定是否注册。

```
javascriptCopy code
let registered: boolean | null = null;
```

1. **`TAG_NAME` 常量：** 定义了自定义元素的标签名，这里为 "x-vue-echarts"。

```
javascriptCopy code
export const TAG_NAME = "x-vue-echarts";
```

1. **`EChartsElement` 接口：** 定义了一个接口，用于描述 ECharts 元素的类型。这个元素应该继承自 `HTMLElement`，并包含一个可能为空的 `__dispose` 属性，用于在元素断开连接时执行清理操作。

```
javascriptCopy code
export interface EChartsElement extends HTMLElement {
  __dispose: (() => void) | null;
}
```

1. **`register` 函数：** 该函数用于注册自定义元素。它通过判断当前环境是否支持 `HTMLElement` 和 `customElements`，以及通过尝试创建一个动态的类来注册自定义元素。

```
javascriptCopy code
export function register(): boolean {
  if (registered != null) {
    return registered;
  }

  if (
    typeof HTMLElement === "undefined" ||
    typeof customElements === "undefined"
  ) {
    return (registered = false);
  }

  try {
    // 创建一个动态类，并通过 customElements.define 注册自定义元素
    const reg = new Function(
      "tag",
      `class EChartsElement extends HTMLElement {
  __dispose = null;

  disconnectedCallback() {
    if (this.__dispose) {
      this.__dispose();
      this.__dispose = null;
    }
  }
}

if (customElements.get(tag) == null) {
  customElements.define(tag, EChartsElement);
}
`
    );
    reg(TAG_NAME);
  } catch (e) {
    return (registered = false);
  }

  return (registered = true);
}
```

总体来说，这段代码的作用是注册一个自定义元素，用于包装 ECharts 实例。通过这样的封装，可以在支持 Web Component 的环境中使用类似 `<x-vue-echarts>` 的标签，将 ECharts 集成到 Web Component 生态系统中。
