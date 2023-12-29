## **Vue2.7**

从Vue3移植来的功能

- [组合式 API](https://cn.vuejs.org/guide/extras/composition-api-faq.html)
- 单文件组件内的 [](https://cn.vuejs.org/api/sfc-script-setup.html)
- 单文件组件内的 [CSS v-bind](https://cn.vuejs.org/api/sfc-css-features.html#v-bind-in-css)

此外，还支持以下 API：

- defineComponent()：具有改进的类型推断（与Vue.extend相比）；
- h()、useSlot()、useAttrs()、useCssModules()；
- set()、del() 和 nextTick() 在 ESM 构建中也作为命名导出提供。

Vue 2.7 还支持在模板表达式中使用 ESNext 语法。使用构建系统时，编译后的模板渲染函数将通过为普通 JavaScript 配置

和vue3对比存在的问题

reactive( {a:1} )  === { a:1 }  并未和vue3一样 ，采用 proxy 对象，只是写法一样。

不支持异步组件初始化



## **Vue3**

defineComponent：vue3.0中提供了一个函数返回传递给它的对象,最重要的是：在TypeScript下，给予了组件 正确的参数类型推断 

setup：组件的启动函数，两个参数: props（父组件传递的数据），content （ 上下文对象）,最后return 定义的数据，方法，钩子函数等，且setup中 没有this，不能访问this

## **Vue3.2**

[新增特性](https://vuejs.org/api/sfc-script-setup.html#typescript-only-features)

- setup+内部的编译器宏defineProps和defineEmits
- 新增style v-bind  以在内使用组件定义的动态值
- 新增 defineCustomElement 方法，可以使用 Vue 组件 API 轻松创建原生自定义元素
- 新的指令v-memo，会记住模板树的一部分，不仅跳过虚拟 DOM 差异，而且完全跳过新 VNode 的创建

setup是Vue3.0后推出的语法糖，并且在Vue3.2版本进行了大更新，像写普通JS一样写vue组件，对于开发者更加友好了；按需引入computed、watch、directive等选项，一个业务逻辑可以集中编写在一起，让代码更加简洁便于浏览。在这个环境下，所有定义的变量，函数，computed等等会数据自动return，页面中可以直接使用，且script 标签中引入的组件自动注册，setup 语法糖中可直接使用 await，不需要写 async ， setup 会自动变成 async setup



新版本defineProps, defineExpose, defineEmit，watch，computed，watchEffect 等都是内置的，无需再import



## **响应性语法糖(****Reactivity Transform****)**

每一个会返回ref的响应式API都有一个与之对应的，以$为前缀的宏函数，包括以下API:



```
ref -> $ref
computed -> $computed
shallowRef -> $shallowRef
customRef -> $customRef
toRef -> $toRef
```



在启用响应性语法糖后，这些宏函数都是默认不需要引入可以直接在全局使用的，但如果你想让它更加明显，也可以显示的使用它们



```
import { $ref } from 'vue/macros' 
let count = $ref(0)
```



要求 vue版本 3.2.25 及以上

**将要废弃**

https://cn.vuejs.org/guide/extras/reactivity-transform.html



## [**Vue Macros**](https://vue-macros.sxzz.moe/zh-CN/)

Vue Macros 是一个库，用于实现尚未被 Vue 正式实现的提案或想法，社区开发中

支持 Vue 2.7 和 Vue 3

unplugin-vue-macros

https://github.com/sxzz/unplugin-vue-macros

## **vue2的<script setup>**

将 <script setup>引入 Vue 2，vue2.7发布后不再更新维护

**unplugin-vue2-script-setup**

https://github.com/antfu/unplugin-vue2-script-setup



## **升级到Vue2.7**

[迁移至vue2.7](https://v2.cn.vuejs.org/v2/guide/migration-vue-2-7.html)

依赖版版本管理



```
vue-loader:^15.10.0
vue-server-render:2.7.14
vue-template-compiler 删除
eslint-plugin:9.0.0
```



## **peerDependencies**

https://blog.csdn.net/astonishqft/article/details/105671253

peerDependencies 在我们进行一些插件开发的时候会经常用到

总结一下有如下特点：

- 插件正确运行的前提是，核心依赖库必须先下载安装，不能脱离核心依赖库而被单独依赖并引用；
- 插件入口api 的设计必须要符合核心依赖库的规范；
- 插件的核心逻辑运行在依赖库的调用中；
- 在项目实践中，同一插件体系下，核心依赖库版本最好是相同的；

npm2时期：npm安装依赖的时候，不会提升子依赖包，代码中无法require顶层之下的依赖包

项目package.json中我们必须直接声明子依赖并安装。

在项目中不用声明就可以直接使用，可以使用peerDependencies

peerDependencies就引入。例如上面PackageA的**package.json**文件如果是下面这样：



```
{
    "peerDependencies": {
        "PackageB": "1.0.0"
    }
}
```



那么，它会告诉npm：如果某个package把我列为依赖的话，那么那个package也必需应该有对PackageB的依赖。

也就是说，如果你npm install PackageA，你将会得到下面的如下的目录结构：



```
MyProject
|- node_modules
   |- PackageA
   |- PackageB
```



> peerDependencies的目的是提示宿主环境去安装满足插件peerDependencies所指定依赖的包，然后在插件import或者require所依赖的包的时候，永远都是引用宿主环境统一安装的npm包，最终解决插件与所依赖包不一致的问题。

基于react的ui组件库**ant-design@3.x**来说，因该ui组件库只是提供一套react组件库，它要求宿主环境需要安装指定的react版本。具体可以看它[package.json](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fant-design%2Fant-design%2Fblob%2Fmaster%2Fpackage.json%23L37)中的配置：



```
  "peerDependencies": {
    "react": ">=16.0.0",
    "react-dom": ">=16.0.0"
  }
```



它要求宿主环境安装react@>=16.0.0和react-dom@>=16.0.0的版本，而在每个antd组件的定义文件顶部：



```
import * as React from 'react';
import * as ReactDOM from 'react-dom';
```



组件中引入的react和react-dom包其实都是宿主环境提供的依赖包



peerDependencies 用于放置当前package中使用的依赖，而且会在引用的项目中会存在的依赖。放在peerDependencies中的依赖不会再当前package中下载，而会使用引用的项目中的依赖。

如果package中放在peerDependencies的依赖，但是项目中不存在依赖，同样会报错。

比如：项目A中存在react，package B是一个基于react的依赖包，package B 就不需要自己安装一份react，因为使用它的项目A必然存在react。



## **npm2和npm3中peerDependencies的区别**

在npm2中，PackageA包中peerDependencies所指定的依赖会随着npm install PackageA一起被强制安装，所以不需要在宿主环境的package.json文件中指定对PackageA中peerDependencies内容的依赖。

但是在npm3中，peerDependencies的表现与npm2不同：

**npm3中不会再要求peerDependencies所指定的依赖包被强制安装，相反npm3会在安装结束后检查本次安装是否正确，如果不正确会给用户打印警告提示。**

就拿上面的例子来说，如果我们npm install PackageA安装PackageA时，你会得到一个警告提示说：



```
PackageB是一个需要的依赖，但是没有被安装。 
```



这时，你需要手动的在MyProject项目的package.json文件指定PackageB的依赖。

另外，在npm3的项目中，可能存在一个问题就是你所依赖的一个package包更新了它peerDependencies的版本，那么你可能也需要在项目的package.json文件中手动更新到正确的版本。否则会出现类似下图所示的警告信息：

![img](https://docs.corp.kuaishou.com/image/api/external/load/out?code=fcADumadrlXBA6s392fe7gVN6:-5083829977540520139fcADumadrlXBA6s392fe7gVN6:1703834853045)



## **组件库基座兼容支持**

## **基座项目**

vue2.6.14

**使用组合式api写法**

 引入@vue/composition-api    2.7版本内置，不需要再引入

https://github.com/vuejs/composition-api

当迁移到 Vue 3 时，只需简单的将 @vue/composition-api 替换成 vue 即可。现有的代码几乎无需进行额外的改动



**使用装饰器写法**  

引入vue-property-decorator  依赖于[vue-class-component](https://github.com/vuejs/vue-class-component),

https://github.com/kaorun343/vue-property-decorator

### **Vue Demi**

https://github.com/vueuse/vue-demi

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229145740862.png)

Vue-demi

相当于一个代理层

在安装阶段会获取vue的版本信息

然后进行switch选择对应哪个版本目录下的文件



```
const { switchVersion, loadModule } = require('./utils')

const Vue = loadModule('vue')

if (!Vue || typeof Vue.version !== 'string') {
  console.warn('[vue-demi] Vue is not found. Please run "npm install vue" to install.')
}
else if (Vue.version.startsWith('2.7.')) {
  switchVersion(2.7)
}
else if (Vue.version.startsWith('2.')) {
  switchVersion(2)
}
else if (Vue.version.startsWith('3.')) {
  switchVersion(3)
}
else {
  console.warn(`[vue-demi] Vue version v${Vue.version} is not suppported.`)
}
```







```
const fs = require('fs')
const path = require('path')

const dir = path.resolve(__dirname, '..', 'lib')

function loadModule(name) {
  try {
    return require(name)
  } catch (e) {
    return undefined
  }
}

function copy(name, version, vue) {
  vue = vue || 'vue'
  //   lib/v2 v2.7 v3 / index.js..
  const src = path.join(dir, `v${version}`, name)
  //  去掉版本名
  const dest = path.join(dir, name)
  //获取对应版本下的index文件
  let content = fs.readFileSync(src, 'utf-8')
  //进行别名的替换  如果在switch的时候更改了
  content = content.replace(/'vue'/g, `'${vue}'`)
  // unlink for pnpm, #92
  try {
    fs.unlinkSync(dest)
  } catch (error) { }
  //写入对应文件
  fs.writeFileSync(dest, content, 'utf-8')
}

//针对vue2的polyfill
function updateVue2API() {
  const ignoreList = ['version', 'default']
  const VCA = loadModule('@vue/composition-api')
  if (!VCA) {
    console.warn('[vue-demi] Composition API plugin is not found. Please run "npm install @vue/composition-api" to install.')
    return
  }

  const exports = Object.keys(VCA).filter(i => !ignoreList.includes(i))

  const esmPath = path.join(dir, 'index.mjs')
  let content = fs.readFileSync(esmPath, 'utf-8')

  content = content.replace(
    /\/\*\*VCA-EXPORTS\*\*\/[\s\S]+\/\*\*VCA-EXPORTS\*\*\//m,
`/**VCA-EXPORTS**/
export { ${exports.join(', ')} } from '@vue/composition-api/dist/vue-composition-api.mjs'
/**VCA-EXPORTS**/`
    )

  fs.writeFileSync(esmPath, content, 'utf-8')
  
}

//将不同版本的vue库文件进行读取
function switchVersion(version, vue) {
  copy('index.cjs', version, vue)
  copy('index.mjs', version, vue)
  copy('index.d.ts', version, vue)

  if (version === 2)
    updateVue2API()
}


module.exports.loadModule = loadModule
module.exports.switchVersion = switchVersion
```





### **针对项目**

**vue3和vue2+****@vue/composition-api的兼容**

当使用vue Api时，从vue-demi里导入，它会自动根据用户使用的环境，而被重定向到vue@3.x或者vue@2.x + @vue/composition-api
https://www.zhihu.com/question/475451857/answer/2377600057

接下来，当你使用vue Api时，请从vue-demi里导入，它会自动根据用户使用的环境，而被重定向到vue@3.x或者vue@2.x + @vue/composition-api。



```
// 告别 import { ref, reactive } from 'vue'
// 采用下面的写法：
import { ref, reactive, defineComponent } from 'vue-demi'
```





**vue3和vue2+vue-class-component的兼容**

vue-facing-decorator 让你在vue3中使用类的方式来写组件

[**https://github.com/facing-dev/vue-facing-decorator**](https://github.com/facing-dev/vue-facing-decorator)

[**https://facing-dev.github.io/vue-facing-decorator/#/zh-cn/readme**](https://facing-dev.github.io/vue-facing-decorator/#/zh-cn/readme)



```
import { Component, Vue } from 'vue-facing-decorator'
@Component
export default class MyComponent extends Vue {

    //这是一个vue响应式属性
    text = 'Example code'

    //这是一个vue组件方法
    method() {
        console.log(this.text)
    }

    //这是一个vue生命周期钩子
    mounted() {
        this.method()
    }
}
```



## **组件修改**

composition api  ->vue-demi  

property-decorator ->vue-facing-decorator

### **absorb-top-bottom**

composition api  

### **error**

401.vue  property-decorator

404.vue  composition-api

### **header-bar**

index.vue  property-decorator

menu.vue  composition-api

### **main**

home.vue  composition-api

### **sidebar**

index.vue  composition-api

menu-unit.vue  composition-api

### **skeleton**

index.vue  property-decorator

## **vue2事件总线的替换**

改用mitt,不再依赖vue，对typescript支持更加友好

在vue3中$on，$off 和 $once 实例方法已被移除，组件实例不再实现事件触发接口，原因在于在短期内EventBus往往是最简单的解决方案，但从长期来看，它维护起来总是令人头疼，于是不再提供官方支持。vue3推荐使用props、emits、provide/inject、vuex、pinia等方案来取缔它，然而在一些小项目中我们仍希望使用EventBus,对于这种情况,vue3推荐使用第三方库来实现例如 [mitt](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdevelopit%2Fmitt) 或 [tiny-emitter](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fscottcorgan%2Ftiny-emitter)。



## **问题分析**

### **思路分析**

开发一套vue2的组件库，项目升级vue3时再同步升级一套vue3的组件库。

一个简单的思路：就想开发一套代码，构建好可以同时支持vue2和vue3。

使用vue-demi，打穿vue2-vue3的壁垒，上面的问题就不复存在了。

开发者 Anthony Fu 的说法，Vue Demi 是一个开发实用程序，它允许用户为 Vue 2 和 Vue 3 编写通用的 Vue 库，不担心用户安装的版本。

vue-demi的原理：主要是利用compositionAPI在写法上和vue3的一致性进行兼容的过渡。

核心：通过postinstall这个钩子，对版本判断从而去更改lib文件下的文件，动态改变用户引用的版本。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229145742047.png)

v2 引入了compositionAPI支持vue3写法

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229145742781.png)

v3 什么都不用做，我们写的就是vue3写法，只不过没有script setup

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229145743620.png)

vue-demi会根据用户使用vue的版本号来判断，vue2时加入@vue/composition-api。

库的写法基本搞定了，但现在组件库并不可以一套代码兼容vue2和vue3

### **案例分析**

项目的功能用sfc的vue文件打包的，写的是template，并不是render函数，关于template的解析，不能使用同一个版本的vue-loader,v2和v3解析出来的不能通用的，因为v3之所以快，是因为对template的比对优化了。

在日常开发中写的vue template，实际上最后是通过sfc-compiler转成render函数输出的，而vue2和vue3的sfc-compiler是互不兼容的。官方已经提供了vue2.6.x，vue2.7和vue3的compiler。

参考vue-demi提供的一些参考库，**会发现没有写vue的sfc文件**，也没有写template，而是直接写js或者ts文件，,通过自己写render函数去渲染出template，然后导出defineComponent({})



```
export default defineComponent({
 name:,
 emits:[],
 props:{},
 data(){},
 watch:{}, 
 created(){},
 mounted(){},
 methods:{},
 render(){},  
})
```



然后进行导入，在install方法内进行注册



```
 const install =(app,option={})=>{
   app.component('name',component)
 }
```



导出组件



```
const VuePlugin = {
  install,
};
export default VuePlugin;
```



然后在demo的main.js中进行导入测试



```
import { createApp } from 'vue-demi';
import VuePlugin from '../src';
import App from './App.vue';
import './style.css';

const app = createApp(App);

app.use(VuePlugin);
app.mount('#app');
```



根据现有基座项目情况，依赖其他组件库，组件较为复杂，改写为自己写render函数渲染template的形式，虽然确实可以实现一套代码，打包一次，兼容vue多个版本，但是效率不高，适合一些从零开发的基础项目，对于需要改写代码较多的已有项目并不合适，同时仍然存在一些vue2,vue3写法的差异（如插槽等）。



vue-loader和sfc-compiler区别和联系

compiler-sfc做了什么？

1.当webpack调用vue-loader后，将.vue读取出来交给`compiler-sfc`解析。

2.调用@vue/compiler-dom的compiler将.vue文件转换成AST(抽象语法树)

对于template的内容此时并没有做处理

对于script和style及自定义顶级标签不做处理，保留为文本格式。

3.对生成的AST转化为SFCDescriptor形式descriptor。(template和script只允许存在一个)

4.对source进行处理map。

5.返回包含descriptor的结果。



vue-loader处理.vue的流程：

当webpack识别到有导入".vue"文件，则将.vue读取到，交给了vue的loader。

1.vue-loader先调用compiler-sfc对文件内容转换为webpack模块化的import形式。

2.这样.vue文件就成了标准的js形式

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229145744329.png)

最后其他的loader对这种 ./App.vue?vue&type=(template|script|style)  形式的import 请求 进行处理

sfc-compiler 负责编译单文件组件中的模板、样式和脚本部分，而 vue-loader 则负责解析单文件组件并将其传递给 webpack loader 进行处理

### **开发思路**

从postinstall着手，也编译三个版本(vue2,vue2.7,vue3)，在宿主系统中通过宿主系统的版本判断要加载哪套组件代码



```
const fse = require('fs-extra');
const path = require('path');
const packageJson = require('../package.json');
const chalk = require('chalk');
const execa = require('execa');
const run = (bin, args, opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts });

try {
	const vue = require('vue');
	let version = '';

	if (String(vue.version).includes('2.7.')) {
		version = '2.7'
	} else if (String(vue.version).startsWith('3.')) {
		version = '3'
	} else {
		version = '2'
	}

	const packageJsonPath = path.join(__dirname, '../package.json');
	const distDir = `lib/v${version}`;
	const exportJson = {
		main: `${distDir}/polaris-base.umd.js`,
		module: `${distDir}/polaris-base.es.js`,
		style: `${distDir}/polaris-base.css`,
	};

	const newPackageJson = Object.assign(packageJson, exportJson);

	console.log(newPackageJson)
	fse.writeJsonSync(packageJsonPath, newPackageJson, { spaces: 4 });

	run('npx', ['vue-demi-switch', version]);
} catch (error) {
	console.warn(chalk.red('======= Error ========'));
	console.log(chalk.yellow(error.message));
	console.warn(chalk.red('======================'));
}
```



## **vue-cli参数指令**

当你运行 vue-cli-service build 时，你可以通过 --target 选项指定不同的构建目标。它允许你将相同的源代码根据不同的用例生成不同的构建。

应用模式是默认的模式。在这个模式中：

- index.html 会带有注入的资源和 resource hint
- 第三方库会被分到一个独立包以便更好的缓存
- 小于 8KiB 的静态资源会被内联在 JavaScript 中
- public 中的静态资源会被复制到输出目录中

你可以通过下面的命令将一个单独的入口构建为一个库：



```
vue-cli-service build --target lib --name myLib [entry]
```





```
File                     Size                     Gzipped

dist/myLib.umd.min.js    13.28 kb                 8.42 kb
dist/myLib.umd.js        20.95 kb                 10.22 kb
dist/myLib.common.js     20.57 kb                 10.09 kb
dist/myLib.css           0.33 kb                  0.23 kb
```



这个入口可以是一个 .js 或一个 .vue 文件。如果没有指定入口，则会使用 src/App.vue。

构建一个库会输出：

- dist/myLib.common.js：一个给打包器用的 CommonJS 包 (不幸的是，webpack 目前还并没有支持 ES modules 输出格式的包)
- dist/myLib.umd.js：一个直接给浏览器或 AMD loader 使用的 UMD 包
- dist/myLib.umd.min.js：压缩后的 UMD 构建版本
- dist/myLib.css：提取出来的 CSS 文件 (可以通过在 vue.config.js 中设置 css: { extract: false } 强制内联)

**UMD**

UMD 代表通用模块定义（Universal Module Definition），是一种思想，兼容commonjs、AMD、CMD。

先判断是否支持Nodejs模块(exports是否存在)，如果存在就使用Nodejs模块。不支持的话，再判断是否支持AMD/CMD(判断define是否存在)，都不行就挂载在window全局对象上



```
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery", "underscore"], factory);
    } else if (typeof exports === "object") {
        module.exports = factory(require("jquery"), require("underscore"));
    } else {
        root.Requester = factory(root.$, root._);
    }
}(this, function ($, _) {
    // this is where I defined my module implementation

    var Requester = { // ... };

    return Requester;
}));
```



- 在前端和后端都适用（“通用”因此得名）
- 与 CJS 或 AMD 不同，UMD 更像是一种配置多个模块系统的模式。[这里](https://github.com/umdjs/umd/)可以找到更多的模式
- 当使用 Rollup/Webpack 之类的打包器时，UMD 通常用作备用模块

修改build目录

打包出来的基座库分为3个版，lib下面 v2 v2.7 v3 里面对应个版本js文件

引入时可根据版本来引入

在打包构建的时候需要依赖example里面对应的vue版本(不能存在多个版本vue)



## **修改装饰器写法**

https://levelup.gitconnected.com/from-vue-class-component-to-composition-api-ef3c3dd5fdda

## **Typescript问题**

**@vue/composition-api**

**本插件要求使用 TypeScript 4.2 或以上版本**

为了让 TypeScript 在 Vue 组件选项中正确地进行类型推导，我们必须使用 defineComponent 来定义组件



http://events.jianshu.io/p/8feb6db56fb5

## **vue-loader的版本问题**

vue2 推荐 vue-loader 15.9.8

vue2.7推荐 vue-loader 15.10.1

vue3推荐 vue-loader 16.0.0

旧版的是通过 vue-template-compiler 对 sfc 进行编译



```
// node_modules\vue-loader\lib\index.js
function loadTemplateCompiler (loaderContext) {try {return require('vue-template-compiler')} catch (e) {if (/version mismatch/.test(e.toString())) {loaderContext.emitError(e)} else {loaderContext.emitError(new Error(`[vue-loader] vue-template-compiler must be installed as a peer dependency, ` +`or a compatible compiler implementation must be passed via options.`))}}
} 
```



Vue2.7 指定的 vue-loader@15.10.0 则是对 vue 版本进行判断，然后通过 vue/compiler-sfc 对 2.7 的 sfc 进行编译



```
// node_modules\vue-loader\lib\compiler.js
exports.resolveCompiler = function (ctx, loaderContext) {if (cached) {return cached}// check 2.7try {const pkg = loadFromContext('vue/package.json', ctx)const [major, minor] = pkg.version.split('.')if (major === '2' && Number(minor) >= 7) {return (cached = {is27: true,compiler: loadFromContext('vue/compiler-sfc', ctx),templateCompiler: undefined})}} catch (e) {}return (cached = {compiler: require('@vue/component-compiler-utils'),templateCompiler: loadTemplateCompiler(ctx, loaderContext)})
} 
```



## **css deep**

https://cn.vuejs.org/api/sfc-css-features.html#scoped-css

在 Vue 2 中：

- 语法/deep/已弃用
- ::v-deep与 Sass 一起使用，>>>不与 Sass 一起使用

在 Vue 3 中：

- ::v-deep .child-class已弃用:deep(.child-class)
- 前缀::v-已弃用，取而代之的是:
- 语法>>>已弃用
- 语法/deep/已弃用
- 有新的:slotted和:global选择器

对于每个版本/语法，<style>该组件的标签必须是scoped

vue3的sfc-compiler/会对/deep/语法进行检验，如果是vue2的写法则会提示：

**[@vue/compiler-sfc]** the >>> and /deep/ combinators have been deprecated. Use :deep() instead.

pluginScoped.ts->rewriteSelector方法



```
selector.each(n => {
        // DEPRECATED ">>>" and "/deep/" combinator
        if (n.type === 'combinator' &&
            (n.value === '>>>' || n.value === '/deep/')) {
            n.value = ' ';
            n.spaces.before = n.spaces.after = '';
            warn(`the >>> and /deep/ combinators have been deprecated. ` +
                `Use :deep() instead.`);
            return false;
        }
        if (n.type === 'pseudo') {
            const { value } = n;
            // deep: inject [id] attribute at the node before the ::v-deep
            // combinator.
            if (value === ':deep' || value === '::v-deep') {
                if (n.nodes.length) {
                    // .foo ::v-deep(.bar) -> .foo[xxxxxxx] .bar
                    // replace the current node with ::v-deep's inner selector
                    let last = n;
                    n.nodes[0].each(ss => {
                        selector.insertAfter(last, ss);
                        last = ss;
                    });
                    // insert a space combinator before if it doesn't already have one
                    const prev = selector.at(selector.index(n) - 1);
                    if (!prev || !isSpaceCombinator(prev)) {
                        selector.insertAfter(n, selectorParser$2.combinator({
                            value: ' '
                        }));
                    }
                    selector.removeChild(n);
                }
                else {
                    // DEPRECATED usage
                    // .foo ::v-deep .bar -> .foo[xxxxxxx] .bar
                    warn(`::v-deep usage as a combinator has ` +
                        `been deprecated. Use :deep(<inner-selector>) instead.`);
                    const prev = selector.at(selector.index(n) - 1);
                    if (prev && isSpaceCombinator(prev)) {
                        selector.removeChild(prev);
                    }
                    selector.removeChild(n);
                }
                return false;
            }
            // slot: use selector inside `::v-slotted` and inject [id + '-s']
            // instead.
            // ::v-slotted(.foo) -> .foo[xxxxxxx-s]
            if (value === ':slotted' || value === '::v-slotted') {
                rewriteSelector(id, n.nodes[0], selectorRoot, true /* slotted */);
                let last = n;
                n.nodes[0].each(ss => {
                    selector.insertAfter(last, ss);
                    last = ss;
                });
                // selector.insertAfter(n, n.nodes[0])
                selector.removeChild(n);
                // since slotted attribute already scopes the selector there's no
                // need for the non-slot attribute.
                shouldInject = false;
                return false;
            }
            // global: replace with inner selector and do not inject [id].
            // ::v-global(.foo) -> .foo
            if (value === ':global' || value === '::v-global') {
                selectorRoot.insertAfter(selector, n.nodes[0]);
                selectorRoot.removeChild(selector);
                return false;
            }
        }
        if (n.type !== 'pseudo' && n.type !== 'combinator') {
            node = n;
        }
    });
```



在vue-cli的css->loaderOptions->less下进行配置



```
css: {
		extract: true,
		loaderOptions: {
			 less: {
				additionalData: (content) => {
					 const regex = /(\/deep\/).(\..+)(\s+,|\s+{)/gm;
					if(/\/deep\//.test(content)){
						content = content.replace(regex, (item, g1, g2, g3) => {
							return `:deep(${g2})${g3}`
						});
						//console.log('---修改之后---', content);
						return content;
					}else{
						return content
					}
				}, 
			
			} 
		}
	},
```



## **生命周期提示报错和prop校验不通过（多次遇到）：**

onMounted is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup().

props expect ......

https://github.com/vuejs/composition-api/issues/967

有人提到使用vue2.6和composition-api出现了如上报错，但实际上是vue:^2.6，更新到了vue:2.7

vue2.7是不需要引入composition-api的，说明重复导入或使用了@vue/composition-api

### **依赖导入问题**

#### **本地开发**

分别在example目录设置三套环境vue2.6 , vue2.7 ,vue3 的案例

在本地开发进行打包时，根据npm script的命令所对应的版本，去读取对应案例下面的打包配置文件，打包配置对external进行了本地设置，对应的需要进行external的依赖包，需要读取对应版本案例里面的node_modules的依赖文件

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229145744931.png)

出现报错的问题主要还是出在vue-demi和composition-api

vue-demi 需要引入vue和composition-api

vue-demi针对vue2 因为是把`@vue/composition-api`的替换为vue-demi所以做了一层转换，

vue-demi 会判断时候对宿主的vue是否安装了composition api ，Vue.use(VueCompositionAPI),

避免导入多次出现错误



```
var Vue = require('vue')
var VueCompositionAPI = require('@vue/composition-api')

function install(_vue) {
  var vueLib = _vue || Vue
  if (vueLib && 'default' in vueLib) {
    vueLib = vueLib.default
  }

  if (vueLib && !vueLib['__composition_api_installed__']) {
    if (VueCompositionAPI && 'default' in VueCompositionAPI)
      vueLib.use(VueCompositionAPI.default)
    else if (VueCompositionAPI)
      vueLib.use(VueCompositionAPI)
  }
}

install(Vue)

Object.keys(VueCompositionAPI).forEach(function(key) {
  exports[key] = VueCompositionAPI[key]
})
```



但是如果简单的进行external配置，不进行指定的话



```
externals: ['vue', '@vue/composition-api', 'vue-demi','@ks/weblogger']
```



vue-demi会从lib目录向上在node_modules进行vue和composition-api的查找，但是本地的基座项目已经全部换成vue-demi了，并没有Vue.use(VueCompositionAPI)，根据vue-demi的逻辑，会导入和使用外层的node_modules下的composition-api,所以基座lib由于使用了vue-demi而使用了外层node_modules中的vue和compostion-api，加上宿主也使用了composition-api，相当于使用了2次。

在vue2.7中，不需要导入和使用composition-api，可以直接使用，如果不对lib进行external的具体指定指定，也会类似出现问题。

#### **生产接入**

umd模块打包出的代码



```
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("vue"), require("vue-demi"));
	else if(typeof define === 'function' && define.amd)
		define(["vue", "vue-demi"], factory);
	else if(typeof exports === 'object')
		exports["polaris-base"] = factory(require("vue"), require("vue-demi"));
	else
		root["polaris-base"] = factory(root["vue"], root["vue-demi"]);
})((typeof self !== 'undefined' ? self : this), function(__WEBPACK_EXTERNAL_MODULE__8bbf__, __WEBPACK_EXTERNAL_MODULE_f281__) {
}
   });
```



简化形式



```
(function webpackUniversalModuleDefinition(){
  //根据不同模块特性，进行external依赖导入
})
(
(),
(){}
);
```



进行简单的配置



```
externals: ['vue', '@vue/composition-api', 'vue-demi','@ks/weblogger']
```



不去指定路径

基座会去查找璇玑的依赖

针对于example案例的话需要设置一下alias指向外层的node_modules中的composition-api依赖

不然也会出现重复加载的报错，导致页面加载失败

### **多版本打包的设置**

#### **多个版本共存**

最简易的方法还是在每次打包构建之前就完成对应版本的依赖切换

设置了switch指令，可以切换不同版本对应的配置



```
if [ $1 == '3' ]
then
    rm -rf node_modules/vue
    cp -R node_modules/vue3 node_modules/vue

	rm -rf node_modules/vue-loader
    cp -R node_modules/vue-loader-vue3 node_modules/vue-loader
	
	rm -rf node_modules/vue-property-decorator
    cp -R node_modules/vue-property-decorator-vue3 node_modules/vue-property-decorator

    rm -rf node_modules/@ks-operation/kop-ui
	cp -R node_modules/@ks-operation/kop-ui-vue3 node_modules/@ks-operation/kop-ui

    npx vue-demi-switch 3
elif [ $1 == '2' ]
then 
    rm -rf node_modules/vue
    cp -R node_modules/vue2 node_modules/vue

	rm -rf node_modules/vue-loader
    cp -R node_modules/vue-loader-vue2 node_modules/vue-loader

	rm -rf node_modules/vue-property-decorator
    cp -R node_modules/vue-property-decorator-vue2 node_modules/vue-property-decorator

	rm -rf node_modules/@ks-operation/kop-ui
	cp -R node_modules/@ks-operation/kop-ui-vue2 node_modules/@ks-operation/kop-ui

    npx vue-demi-switch 2
else
    rm -rf node_modules/vue
    cp -R node_modules/vue2.7 node_modules/vue

	rm -rf node_modules/vue-loader
    cp -R node_modules/vue-loader-vue2.7 node_modules/vue-loader

	rm -rf node_modules/vue-property-decorator
    cp -R node_modules/vue-property-decorator-vue2 node_modules/vue-property-decorator

	rm -rf node_modules/@ks-operation/kop-ui
	cp -R node_modules/@ks-operation/kop-ui-vue2 node_modules/@ks-operation/kop-ui

    npx vue-demi-switch 2.7 
fi
```



进行依赖包的共存，在package.json里面进行区分不同名字和版本

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229145745569.png)

#### **区分打包版本和环境**

是vue2,vue2.7还是vue3.是开发环境还是生产环境



```
//获取指令数据
const argv = process.argv;
const event = process.env.npm_lifecycle_event;  'build:2'  获取数字版本
```



![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229145746267.png)

根据数字版本获取不同版本的打包配置

区分开发和生产

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229145747742.png)

加上参数进行判断，获取不同环境的打包配置



## **vue-demi找不到composition-api**

This dependency was not found:

- @vue/composition-api/dist/vue-composition-api.mjs in ./node_modules/vue-demi/lib/index.mjs

To install it, you can run: npm install --save @vue/composition-api/dist/vue-composition-api.mjs

升级composition-api版本

## **Object(...) is not a function**

vue版本不一致

https://juejin.cn/post/7062910342011043853

## **_vue.use is not a function**

vue-demi 没有进行external

## **Vue2.7项目构建的问题**

v-loading指令报错  



```
[Vue warn]: Failed to resolve directive: loading
```



props类型校验问题：

BaseHeaderBar   authorityUrl

HeaderBarMenu  curKey  topMenus

BaseSidebar  curMenuList  activePath 

KsMenu  defaultActive  collapse  menu.vue

MenuUnit  sideBarData  menu.vue

## **Vue-router的问题**

2022年2月7号以后，vue-router的默认版本为4版本，

vue-router4只能在vue3中使用

vue-router3能在vue2中使用

## **v-loading的问题**

初始版本v2.6.14

vue2可以直接使用Vue.use()的形式使用自定义指令



```
import Vue from 'vue';
import { Loading } from '@ks-operation/kop-ui';
Vue.use(Loading);
```



vue3



```
import { createApp } from 'vue'
import App from './App.vue'
createApp(App).use(Loading）
```



https://cn.vuejs.org/guide/reusability/custom-directives.html

可以直接在defineComponent

directives:{

Loading

}

## **Kop-ui的版本问题**

2.0.0版本

vue2版本可以正常使用  

3.0.0版本

按照之前写法导入部分组件会找不到

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229145748730.png)

https://github.com/vuejs/vue-cli/issues/3784#issuecomment-481697868

需要针对bable自动分析导入组件的插件进行组件名的替换的修改



```
module.exports = {
	presets: [
		'@vue/cli-plugin-babel/preset'
	],
	"plugins": [
		["import",
			{
				"libraryName": "@ks-operation/kop-ui",
				"libraryDirectory": "lib",
				"customName": (name) => {
					return `@ks-operation/kop-ui/lib/ks-${name}`;
					
				},
				"customStyleName": (name) => {
					return `@ks-operation/kop-ui/lib/theme-new-era/${name}.css`;
				}
			}
		]
	]
};
```





Vue3打包后的问题

没有输出polaris-base对象 说明打包对象不成功，或者不支持



```
app.js:534 Uncaught TypeError: Cannot read properties of undefined (reading '$isServer')
    at 34ca (polaris-base.umd.js?047d:24930:1)
    at __nested_webpack_require_2532__ (polaris-base.umd.js?047d:74:1)
    at Object.b282 (polaris-base.umd.js?047d:49208:1)
    at __nested_webpack_require_2532__ (polaris-base.umd.js?047d:74:1)
    at 1d22 (polaris-base.umd.js?047d:3923:1)
    at __nested_webpack_require_2532__ (polaris-base.umd.js?047d:74:1)
    at 5a76 (polaris-base.umd.js?047d:37072:1)
    at __nested_webpack_require_2532__ (polaris-base.umd.js?047d:74:1)
    at element-ui/src/utils/vue-popper (polaris-base.umd.js?047d:50855:1)
    at __nested_webpack_require_1334190__ (polaris-base.umd.js?047d:50452:1)
```





34ca (polaris-base.umd.js?047d:24930:1)

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229145749292.png)

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229145750461.png)

element-ui/src/utils/vue-popper (polaris-base.umd.js?047d:50855:1)

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229145751038.png)

__nested_webpack_require_1334190__ (polaris-base.umd.js?047d:50452:1)

ks-tooltip

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229145751817.png)

说明主要问题还是kop-ui组件库版本不兼容的问题

kop-ui进行一个升级

## **Vue2.7 props类型校验的问题**

reactive(), ref(), 和shallowReactive()将直接转换原始对象而不是创建代理。这意味着：



```
// true in 2.7, false in 3.x
reactive(foo) === foo
```



readonly() 确实创建了一个单独的对象，但它不会跟踪新添加的属性并且不适用于数组。

ref会包装成一个对象 这就会导致部分props校验不通过



Vue3打包导入后

可以正常输出对象,说明打包和导入成功

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229145752469.png)

但是存在问题

app.js:479 Uncaught TypeError: Cannot read properties of null (reading 'isCE')

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229145753382.png)

造成这个的原因是有两个不同的vue版本， 就可能下载的其他的第三方和当前的vue版本不相同， 就有两个vue的副本，在引入的时候， npm去尝试引入的地址不对

https://blog.csdn.net/z1832729975/article/details/129521186

把example的vue引用指向改一下



存在问题

[renderTrigger] trigger expects single rooted node

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229145754048.png)

https://blog.csdn.net/Lyrelion/article/details/107378641



![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229145754698.png)

tooltip的问题



## **undefined (reading '$isServer')**

Uncaught TypeError: Cannot read properties of undefined (reading '$isServer')

vue版本不一致



依赖导入问题
