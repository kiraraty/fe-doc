# Webpack面试题

### webpack的作用是什么？

webpack是一个模块打包工具

`webpack`的作用其实有以下几点：

- 模块打包。可以将不同模块的文件打包整合在一起，并且保证它们之间的引用正确，执行有序。利用打包我们就可以在开发的时候根据我们自己的业务自由划分文件模块，保证项目结构的清晰和可读性。
- 编译兼容。在前端的“上古时期”，手写一堆浏览器兼容代码一直是令前端工程师头皮发麻的事情，而在今天这个问题被大大的弱化了，通过`webpack`的`Loader`机制，不仅仅可以帮助我们对代码做`polyfill`，还可以编译转换诸如`.less, .vue, .jsx`这类在浏览器无法识别的格式文件，让我们在开发的时候可以使用新特性和新语法做开发，提高开发效率。
- 能力扩展。通过`webpack`的`Plugin`机制，我们在实现模块化打包和编译兼容的基础上，可以进一步实现诸如按需加载，代码压缩等一系列功能，帮助我们进一步提高自动化程度，工程效率以及打包输出的质量。

webpack解决了什么问题？

回答这个问题，可以和还没有 Webpack、没有构建工具时对比一下，就能明显地感觉出来了。这里就来列举一下不使用构建工具时的痛点。

- web 开发时调用后端接口跨域，需要其他工具代理或者其他方式规避。

- 改动代码后要手动刷新浏览器，如果做了缓存还需要清缓存刷新。

- 因为 js 和 css 的兼容性问题，很多新语法学习了却不能使用，无论是开发效率和个人成长都受影响。

- 打包问题。需要使用额外的平台如 jekins 打包，自己编写打包脚本，对各个环节如压缩图片，打包 js、打包 css 都要一一处理

  

### 1.常用的loader和plugin有哪些

根据官网介绍，Webpack 是一个用于现代 JavaScript 应用程序的 静态模块打包工具。当 webpack 处理应用程序时，它会在内部从一个或多个入口点构建一个 依赖图(dependency graph)，然后将你项目中所需的每一个模块组合成一个或多个 bundles，它们均为静态资源，用于展示你的内容。

#### Webpack一些核心概念：

- Entry：入口，指示 Webpack 应该使用哪个模块，来作为构建其内部 依赖图(dependency graph) 的开始。
- Output：输出结果，告诉 Webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件。
- Module：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
- Chunk：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
- Loader：模块代码转换器，让webpack能够去处理除了JS、JSON之外的其他类型的文件，并将它们转换为有效 模块，以供应用程序使用，以及被添加到依赖图中。
- Plugin：扩展插件。在webpack运行的生命周期中会广播出许多事件，plugin可以监听这些事件，在合适的时机通过webpack提供的api改变输出结果。常见的有：打包优化，资源管理，注入环境变量。
- Mode：模式，告知 webpack 使用相应模式的内置优化
- Browser Compatibility：浏览器兼容性，Webpack 支持所有符合 ES5 标准 的浏览器（IE8以上版本）

<img src="https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201840522.webp" alt="img" style="zoom:50%;" />

#### loader特点

- loader 本质上是一个函数，output=loader(input) // input可为工程源文件的字符串，也可是上一个loader转化后的结果；
- 第一个 loader 的传入参数只有一个：资源文件(resource file)的内容；
- loader支持链式调用，webpack打包时是按照数组从后往前的顺序将资源交给loader处理的。
- 支持同步或异步函数。

#### 代码结构

代码结构通常如下：

```javascript
// source：资源输入，对于第一个执行的 loader 为资源文件的内容；后续执行的 loader 则为前一个 loader 的执行结果
// sourceMap: 可选参数，代码的 sourcemap 结构
// data: 可选参数，其它需要在 Loader 链中传递的信息，比如 posthtml/posthtml-loader 就会通过这个参数传递参数的 AST 对象
const loaderUtils = require('loader-utils');

module.exports = function(source, sourceMap?, data?) {
  // 获取到用户给当前 Loader 传入的 options
  const options = loaderUtils.getOptions(this);
  // TODO： 此处为转换source的逻辑
  return source;
};
```

#### 常用的Loader

##### 1. babel-loader

babel-loader基于babel，用于解析JavaScript文件。babel有丰富的预设和插件，babel的配置可以直接写到options里或者单独写道配置文件里。

Babel是一个Javscript编译器，可以将高级语法(主要是ECMAScript 2015+ )编译成浏览器支持的低版本语法，它可以帮助你用最新版本的Javascript写代码，提高开发效率。

webpack通过babel-loader使用Babel。

用法

```shell
# 环境要求:
webpack 4.x || 5.x | babel-loader 8.x | babel 7.x

# 安装依赖包:
npm install -D babel-loader @babel/core @babel/preset-env webpack
```

然后，我们需要建立一个Babel配置文件来指定编译的规则。

Babel配置里的两大核心：插件数组(plugins) 和 预设数组(presets)。

Babel 的预设（preset）可以被看作是一组Babel插件的集合，由一系列插件组成。

常用预设：

- @babel/preset-env       ES2015+ 语法
- @babel/preset-typescript  TypeScript
- @babel/preset-react      React
- @babel/preset-flow       Flow

插件和预设的执行顺序：

- 插件比预设先执行
- 插件执行顺序是插件数组从前向后执行
- 预设执行顺序是预设数组从后向前执行

webpack配置代码：

```javascript
// webpack.config.js
module: {
  rules: [
    {
      test: /\.m?js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', { targets: "defaults" }]
          ],
          plugins: ['@babel/plugin-proposal-class-properties'],
          // 缓存 loader 的执行结果到指定目录，默认为node_modules/.cache/babel-loader，之后的 webpack 构建，将会尝试读取缓存
          cacheDirectory: true,
        }
      }
    }
  ]
}
```

以上options参数也可单独写到配置文件里，许多其他工具都有类似的配置文件：ESLint (.eslintrc)、Prettier (.prettierrc)。

配置文件我们一般只需要配置 presets(预设数组) 和 plugins(插件数组) ，其他一般也用不到，代码示例如下：

```javascript
// babel.config.js
module.exports = (api) => {
    return {
        presets: [
            '@babel/preset-react',
            [
                '@babel/preset-env', {
                    useBuiltIns: 'usage',
                    corejs: '2',
                    targets: {
                        chrome: '58',
                        ie: '10'
                    }
                }
            ]
        ],
        plugins: [
            '@babel/plugin-transform-react-jsx',
            '@babel/plugin-proposal-class-properties'
        ]
    };
};

```

推荐阅读：

- [babel配置文件相关文档](https://link.juejin.cn/?target=https%3A%2F%2Fwww.babeljs.cn%2Fdocs%2Fconfiguration)
- [插件手册](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fjamiebuilds%2Fbabel-handbook%2Fblob%2Fmaster%2Ftranslations%2Fzh-Hans%2Fplugin-handbook.md)

##### 2. ts-loader

为webpack提供的 TypeScript loader，打包编译Typescript

安装依赖：

```bash
npm install ts-loader --save-dev
npm install typescript --dev
```

webpack配置如下：

```json
// webpack.config.json
module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: "./app.ts",
  output: {
    filename: "bundle.js"
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  }
};
```

还需要typescript编译器的配置文件tsconfig.json：

```json
{
  "compilerOptions": {
    // 目标语言的版本
    "target": "esnext",
    // 生成代码的模板标准
    "module": "esnext",
    "moduleResolution": "node",
    // 允许编译器编译JS，JSX文件
    "allowJS": true,
    // 允许在JS文件中报错，通常与allowJS一起使用
    "checkJs": true,
    "noEmit": true,
    // 是否生成source map文件
    "sourceMap": true,
    // 指定jsx模式
    "jsx": "react"
  },
  // 编译需要编译的文件或目录
  "include": [
    "src",
    "test"
  ],
  // 编译器需要排除的文件或文件夹
  "exclude": [
    "node_modules",
    "**/*.spec.ts"
  ]
}
```

##### 3. markdown-loader

markdown编译器和解析器

用法：

只需将 loader 添加到您的配置中，并设置 options。

js代码里引入markdown文件：

```javascript
// file.js

import md from 'markdown-file.md';

console.log(md);
```

webpack配置：

```javascript
// wenpack.config.js
const marked = require('marked');
const renderer = new marked.Renderer();

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.md$/,
        use: [
            {
                loader: 'html-loader'
            },
            {
                loader: 'markdown-loader',
                options: {
                    pedantic: true,
                    renderer
                }
            }
        ]
      }
    ],
  },
};
```

##### 4. raw-loader

可将文件作为字符串导入

```javascript
// app.js
import txt from './file.txt';
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/,
        use: 'raw-loader'
      }
    ]
  }
}
```

##### 5. file-loader

用于处理文件类型资源，如jpg，png等图片。返回值为publicPath为准

```javascript
// file.js
import img from './webpack.png';
console.log(img); // 编译后：https://www.tencent.com/webpack_605dc7bf.png
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '[name]_[hash:8].[ext]',
          publicPath: "https://www.tencent.com",
        },
      },
    ],
  },
};
```

css文件里的图片路径变成如下：

```css
/* index.less */
.tag {
  background-color: red;
  background-image: url(./webpack.png);
}
/* 编译后：*/
background-image: url(https://www.tencent.com/webpack_605dc7bf.png);
```

##### 6. url-loader:

它与file-loader作用相似，也是处理图片的，只不过url-loader可以设置一个根据图片大小进行不同的操作，如果该图片大小大于指定的大小，则将图片进行打包资源，否则将图片转换为base64字符串合并到js文件里。

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
              // 这里单位为(b) 10240 => 10kb
              // 这里如果小于10kb则转换为base64打包进js文件，如果大于10kb则打包到对应目录
              limit: 10240,
            }
          }
        ]
      }
    ]
  }
}

```

##### 7. svg-sprite-loader

会把引用的 svg文件 塞到一个个 symbol 中，合并成一个大的SVG sprite，使用时则通过 SVG 的 <use> 传入图标 id 后渲染出图标。最后将这个大的 svg 放入 body 中。symbol的id如果不特别指定，就是你的文件名。

该loader可以搭配svgo-loader 一起使用，svgo-loader是svg的优化器，它可以删除和修改SVG元素，折叠内容，移动属性等

**用途：可以用来开发统一的图标管理库**

![svg-sprite-loader.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs202208201817093.webp)

**示例代码：**

```javascript
// js文件里用法
import webpack from './webpack/webpack.svg';
const type = 'webpack';
const svg =  `<svg>
    <use xlink:href="#${type}"/>
  </svg>`;
const dom = `<div class="tag">
  ${svg}
  </div>`;
document.getElementById('react-app').innerHTML = dom;
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg)$/,
        use: [
          {
            test: /\.svg$/,
            use: [
                {
                  loader: 'svg-sprite-loader'
                },
                'svgo-loader'
            ]
          },
        ]
      }
    ]
  }
}
```

原理：利用 svg 的 symbol 元素，将每个 icon 包裹在 symbol 中，通过 use 使用该 symbol。

##### 8. style-loader

style-loader是通过注入`style`标签将CSS插入到DOM中

注意：

- 如果因为某些原因你需要将CSS提取为一个文件(即不要将CSS存储在JS模块中)，此时你需要使用插件 mini-css-extract-plugin
- 对于development模式(包括 webpack-dev-server)你可以使用style-loader，因为它是通过`style`标签的方式引入CSS的，加载会更快；
- 不要将 style-loader 和 mini-css-extract-plugin 针对同一个CSS模块一起使用！

##### 9. css-loader

仅处理css的各种加载语法(@import和url()函数等),就像 js 解析 import/require() 一样

##### 10. postcss-loader

PostCSS 是一个允许使用 JS 插件转换样式的工具。 这些插件可以检查（lint）你的 CSS，支持 CSS Variables 和 Mixins， 编译尚未被浏览器广泛支持的先进的 CSS 语法，内联图片，以及其它很多优秀的功能。

PostCSS 在业界被广泛地应用。PostCSS 的 ***\*autoprefixer\**** 插件是最流行的 CSS 处理工具之一。

autoprefixer 添加了浏览器前缀，它使用 Can I Use 上面的数据。

安装

```js
npm install postcss-loader autoprefixer --save-dev
```

代码示例：

```javascript
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDev = process.NODE_ENV === 'development';
module.exports = {
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        exclude: /node_modules/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            }
          },
          {
            loader: 'postcss-loader'
          },
          {
              loader: 'less-loader',
              options: {
                  lessOptions: {
                      javascriptEnabled: true
                  }
              }
          }
        ]
      }
    ]
  }
}
```

然后在项目根目录创建postcss.config.js，并且设置支持哪些浏览器，必须设置支持的浏览器才会自动添加添加浏览器兼容

```javascript
module.exports = {
  plugins: [
    require('precss'),
    require('autoprefixer')({
      'browsers': [
        'defaults',
        'not ie < 11',
        'last 2 versions',
        '> 1%',
        'iOS 7',
        'last 3 iOS versions'
      ]
    })
  ]
}

```

##### 11. less-loader

解析less，转换为css

##### 12. vue-loader

![image-20220828201332087](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsimage-20220828201332087.png)

[学习文章](https://juejin.cn/post/6994468137584295973)

作为 `webpack` 中一个为解析 `.vue` 文件的 `loader`。主要的作用是是将单文件组件(`SFC`) 解析为 `vue runtime`是可识别的组件模块

对 `.vue` 文件转换大致分为三个阶段

第一个阶段：通过 `vue-loader` 将 `.vue` 文件转化为中间产物

`vue-lodaer` 现将读取的源文件，然后通过 `@vue/component-compiler-utils`(compiler-sfc)中的 `parse` 解析器将得到**源文件**的**描述符**。**对每个 `block` 进行处理，生成对应的模块请求**。由 `normalizer` 函数把每个 `block` 拼接到一起，形成一个 `vue` 组件

源文件描述符

![image-20220828202034820](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsimage-20220828202034820.png)

![vue-loader1.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201840750.webp)

第二个阶段：通过 `pitcher-loader`(这个`loader`是通过 `vueloaderplugin`注入到`webpack`中的) 将第一阶段中间产物转化为另一阶段产物

<img src="https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201841133.webp" alt="vue-loader2.png" style="zoom:150%;" />

通过 `pitcher-loader`(这个`loader`是通过 `vueloaderplugin`注入到`webpack`中的) 将第一阶段中间产物转化为另一阶段产物。 就以 `import { render, staticRenderFns } from "./test.vue?vue&type=template&id=13429420&scoped=true&"` 为例，会被转化为 `-!./lib/vue-loader/loaders/templateLoader.js??vue-loader-options!./lib/vue-loader/index.js??vue-loader-options!./test.vue?vue&type=template&id=13429420&scoped=true&`

在 `webpack`生成`compiler`之后，注入 `pitcher-loader`，我们主要这个`loader`的命中规则 `resourceQuery`。我们常用的是使用方式 `test: /\.vue$/`，在 `webpack` 内部会被 `RuleSet` 这个类标准化。所以上述 `request` 会先经由 `pitcher-loader`中的 `pitch`函数处理

这里面主要是要找到当前处理的 `module` 匹配中的 `loaders`，给他们排序，并在其中加入对应 `block` 块的处理 `loader`，比如这里的 `templateLoader`，然后通过 `genRequest` 生成我们最新的`request`， `-!./lib/vue-loader/loaders/templateLoader.js??vue-loader-options!./lib/vue-loader/index.js??vue-loader-options!./test.vue?vue&type=template&id=13429420&scoped=true&`

第三个阶段：第二阶段转化 `request` 请求，通过对应的 `loader` 进行处理

<img src="https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201841161.webp" alt="vue-loader3.png" style="zoom:150%;" />

在得到上述的`request` 之后，`webpack`会先使用`vue-loader`处理，然后再使用`template-loader`来处理，然后得到最后模块

`vue-loader`的第二个出口，通过代码的注释我们知道，当 `vue-loader`在处理 `.vue` 文件中的一个 `block` 请求时，通过 `qs.parse` 序列化快请求参数 `?vue&type=template&id=13429420&scoped=true&`，如果有 `type` 则返回 `selectBlock` 函数的执行结果

`electBlock` 依据传入的 `query.type`，将 `descriptor` 中对应的部分通过 `loaderContext.callback` 传递给下一个`loader`(这里是`template-loader`) 处理

`template-loader` 将 `.vue` 文件中的 `template` 部分通过自定义或者是内置 `compileTemplate` 编译为函数，其实就是 `vue`中 **模块解析** 的过程，这样可以提供 `vue runtime` 时的性能，毕竟模板解析是个耗性能的过程


render函数的执行结果就是 vNode


生成的这个 `render` 函数就是对 `template` 模板解析的结果，`render`函数的执行结果就是其对应的 `vNode`，也就是 `vue patch` 阶段的入口参数。

##### 13. px2rem-loader

利用 px2rem-loader 自动将 px 转成 rem
安装 npm i px2rem-loader -D
配置

```js
modules： {
    rules: [
    {
      test:/\.css$/,
        use:[{
                MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader',
               {
                    loader:'px2rem-loader',
                   options:{
                        remUnit:75, // 根元素字体大小，也就是每 1rem 代表 75px
                       remPrecesion:8 // 精度，px 转 rem 的时候保留 8 位小树
                    }
                }]
           },
    ]
}

```


这里需要注意，px2rem-loader 是在 css-loader 之前的一个 loader，即：先处理好单位，再去走 css-loader


#### Plugin特点

> Webpack 就像一条生产线，要经过一系列处理流程后才能将源文件转换成输出结果。 这条生产线上的每个处理流程的职责都是单一的，多个流程之间有存在依赖关系，只有完成当前处理后才能交给下一个流程去处理。 插件就像是一个插入到生产线中的一个功能，在特定的时机对生产线上的资源做处理。

> Webpack 通过 Tapable 来组织这条复杂的生产线。 Webpack 在运行过程中会广播事件，插件只需要监听它所关心的事件，就能加入到这条生产线中，去改变生产线的运作。 Webpack 的事件流机制保证了插件的有序性，使得整个系统扩展性很好。

与 Loader 用于转换特定类型的文件不同，**插件（Plugin）可以贯穿 Webpack 打包的生命周期，执行不同的任务**

#### 常用Plugin

##### 1. copy-webpack-plugin

将已经存在的单个文件或整个目录复制到构建目录。

```javascript
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: './template/page.html', 
          to: `${__dirname}/output/cp/page.html` 
        },
      ],
    }),
  ],
};
```

##### 2. html-webpack-plugin

基本作用是生成html文件

- 单页应用可以生成一个html入口，多页应用可以配置多个html-webpack-plugin实例来生成多个页面入口
- 为html引入外部资源如script、link，将entry配置的相关入口chunk以及mini-css-extract-plugin抽取的css文件插入到基于该插件设置的template文件生成的html文件里面，具体的方式是link插入到head中，script插入到head或body中。

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    news: [path.resolve(__dirname, '../src/news/index.js')],
    video: path.resolve(__dirname, '../src/video/index.js'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'news page',
      // 生成的文件名称 相对于webpackConfig.output.path路径而言
      filename: 'pages/news.html',
      // 生成filename的文件模板
      template: path.resolve(__dirname, '../template/news/index.html'),
      chunks: ['news']

    }),
    new HtmlWebpackPlugin({
      title: 'video page',
      // 生成的文件名称
      filename: 'pages/video.html',
      // 生成filename的文件模板
      template: path.resolve(__dirname, '../template/video/index.html'),
      chunks: ['video']
    }),
  ]
};

```

##### 3. clean-webpack-plugin

默认情况下，这个插件会删除webpack的output.path中的所有文件，以及每次成功重新构建后所有未使用的资源。

这个插件在生产环境用的频率非常高，因为生产环境经常会通过 hash 生成很多 bundle 文件，如果不进行清理的话每次都会生成新的，导致文件夹非常庞大。

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    plugins: [
        new CleanWebpackPlugin(),
    ]
};
```

##### 4. mini-css-extract-plugin

本插件会将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件。

```javascript
// 建议 mini-css-extract-plugin 与 css-loader 一起使用
// 将 loader 与 plugin 添加到 webpack 配置文件中
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],

      }
    ],
  },
};

```

可以结合上文关于style-loader的介绍一起了解该插件。

##### 5. webpack.HotModuleReplacementPlugin

模块热替换插件，除此之外还被称为 HMR。

该功能会在应用程序运行过程中，替换、添加或删除 模块，而无需重新加载整个页面。主要是通过以下几种方式，来显著加快开发速度:

- 保留在完全重新加载页面期间丢失的应用程序状态。
- 只更新变更内容，以节省宝贵的开发时间。
- 在源代码中 CSS/JS 产生修改时，会立刻在浏览器中进行更新，这几乎相当于在浏览器 devtools 直接更改样式。

启动方式有2种：

- 引入插件webpack.HotModuleReplacementPlugin 并且设置devServer.hot: true
- 命令行加 --hot参数

package.json配置：

```json
{
  "scripts": {
    "start": "NODE_ENV=development webpack serve --progress --mode=development --config=scripts/dev.config.js --hot"
  }
}
```

webpack的配置如下：

```javascript
// scripts/dev.config.js文件
const webpack = require('webpack');
const path = require('path');
const outputPath = path.resolve(__dirname, './output/public');

module.exports = {
  mode: 'development',
  entry: {
    preview: [
      './node_modules/webpack-dev-server/client/index.js?path=http://localhost:9000',
      path.resolve(__dirname, '../src/preview/index.js')
    ],
  },
  output: {
    filename: 'static/js/[name]/index.js',
    // 动态生成的chunk在输出时的文件名称
    chunkFilename: 'static/js/[name]/chunk_[chunkhash].js',
    path: outputPath
  },
  plugins: [
    // 大多数情况下不需要任何配置
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
        // 仅在需要提供静态文件时才进行配置
        contentBase: outputPath,
        // publicPath: '', // 值默认为'/'
        compress: true,
        port: 9000,
        watchContentBase: true,
        hot: true,
        // 在服务器启动后打开浏览器
        open: true,
        // 指定打开浏览器时要浏览的页面
        openPage: ['pages/preview.html'],
        // 将产生的文件写入硬盘。 写入位置为 output.path 配置的目录
        writeToDisk: true,
    }
}
```

注意：HMR 绝对不能被用在生产环境。

##### 6. webpack.DefinePlugin

创建一个在编译时可以配置的全局常量。这会对开发模式和生产模式的构建允许不同的行为非常有用。

因为这个插件直接执行文本替换，给定的值必须包含字符串本身内的实际引号。

通常，有两种方式来达到这个效果，使用'"production"', 或者使用 JSON.stringify('production')

```javascript
// webpack.config.js
const isProd = process.env.NODE_ENV === 'production';
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      PAGE_URL: JSON.stringify(isProd
        ? 'https://www.tencent.com/page'
        : 'http://testsite.tencent.com/page'
      )
    }),
  ]
}

// 代码里面直接使用
console.log(PAGE_URL);
```

##### 7. webpack-bundle-analyzer

可以看到项目各模块的大小，可以按需优化.一个webpack的bundle文件分析工具，将bundle文件以可交互缩放的treemap的形式展示。

```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```

启动服务：

- 生产环境查看：NODE_ENV=production npm run build
- 开发环境查看：NODE_ENV=development npm run start

最终效果：

![analyzer.gif](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201834680.webp)

##### 8. SplitChunksPlugin

代码分割。

```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  optimization: {
    splitChunks: {
      // 分隔符
      // automaticNameDelimiter: '~',
      // all, async, and initial
      chunks: 'all',
      // 它可以继承/覆盖上面 splitChunks 中所有的参数值，除此之外还额外提供了三个配置，分别为：test, priority 和 reuseExistingChunk
      cacheGroups: {
        vendors: {
          // 表示要过滤 modules，默认为所有的 modules，可匹配模块路径或 chunk 名字，当匹配的是 chunk 名字的时候，其里面的所有 modules 都会选中
          test: /[\\/]node_modules\/antd\//,
          // priority：表示抽取权重，数字越大表示优先级越高。因为一个 module 可能会满足多个 cacheGroups 的条件，那么抽取到哪个就由权重最高的说了算；
          // priority: 3,
          // reuseExistingChunk：表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。
          reuseExistingChunk: true,
          name: 'antd'
        }
      }
    }
  },
}
```



### 2.Webpack构建流程

#### 基本过程

1. 初始化参数。获取用户在webpack.config.js文件配置的参数
2. 开始编译。**初始化compiler对象**，**注册**所有的插件plugins，**插件**开始**监听**webpack构建过程的生命周期事件，不同环节会有相应的处理，然后开始执行编译。
3. 确定入口。根据webpack.config.js文件的entry入口，从配置的entry入口，开始解析文件构建AST语法树，找出依赖，递归下去。
4. 编译模块。递归过程中，根据文件类型和loader配置，调用相应的loader对不同的文件做转换处理，在找出该模块依赖的模块，递归本操作，直到项目中依赖的所有模块都经过了本操作的编译处理。
5. 完成编译并输出。递归结束，得到每个文件结果，包含转换后的模块以及他们之前的依赖关系，根据entry以及output等配置生成代码块chunk
6. 打包完成。根据output输出所有的chunk到相应的文件目录



文件的解析与构建是一个比较复杂的过程，在`webpack`源码中主要依赖于`compiler`和`compilation`两个核心对象实现`compiler`对象是一个全局单例，他负责把控整个`webpack`打包的构建流程。 `compilation`对象是每一次构建的上下文对象，它包含了当次构建所需要的所有信息，每次热更新和重新构建，`compiler`都会重新生成一个新的`compilation`对象，负责此次更新的构建过程

而每个模块间的依赖关系，则依赖于`AST`语法树。每个模块文件在通过`Loader`解析完成之后，会通过`acorn`库生成模块代码的`AST`语法树，通过语法树就可以分析这个模块是否还有依赖的模块，进而继续循环执行下一个模块的编译解析。
`Webpack`打包出来的`bundle`文件是一个`IIFE`的执行函数

和`webpack4`相比，`webpack5`打包出来的bundle做了相当的精简。在上面的打包`demo`中，整个立即执行函数里边只有三个变量和一个函数方法，`__webpack_modules__`存放了编译后的各个文件模块的JS内容，`__webpack_module_cache__ `用来做模块缓存，`__webpack_require__`是`Webpack`内部实现的一套依赖引入函数。最后一句则是代码运行的起点，从入口文件开始，启动整个项目。

`__webpack_require__`模块引入函数，我们在模块化开发的时候，通常会使用`ES Module`或者`CommonJS`规范导出/引入依赖模块，`webpack`打包编译的时候，会统一替换成自己的`__webpack_require__`来实现模块的引入和导出，从而实现模块缓存机制，以及抹平不同模块规范之间的一些差异性

![](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201834433.png)

工作流程

1. 初始化参数：从配置文件和Shell语句中读取并合并参数，得出最终的配置对象
2. 用上一步得到的参数初始化Compiler对象
3. 加载所有配置的插件
4. 执行Compiler对象的run方法开始执行编译
5. 根据配置中的entry找出入口文件
6. 从入口文件触发，调用所有配置的Loader对模块进行编译
7. 再找出该模块依赖的模块，再递归这个步骤，知道所有入口依赖的文件都经过了这个步骤的处理，得到入口与模块之间的依赖关系
8. 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的Chunk
9. 再把每个Chunk转换成一个单独的文件加入到输出列表
10. 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统
11. 以上过程中，webpack会在特性的时间点广播出特定的事件，插件在监听到感兴趣的事件后执行特定的逻辑，并且插件可以调用webpack提供的API改变webpack的运行结果。

### 3.Webpack打包后代码的结构

#### 1、打包单一模块

[webpack](https://so.csdn.net/so/search?q=webpack&spm=1001.2101.3001.7020).config.js

```js
module.exports = {
    entry:"./chunk1.js",
    output: {
        path: __dirname + '/dist',
        filename: '[name].js'
    },
};
```

chunk1.js

```js
var chunk1=1;
exports.chunk1=chunk1;
```

打包后，main.js(webpack生成的一些注释已经去掉)

```js
(function(modules) { // webpackBootstrap
 	// The module cache
 	var installedModules = {};
 	// The require function
 	function __webpack_require__(moduleId) {
 		// Check if module is in cache
 		if(installedModules[moduleId])
 			return installedModules[moduleId].exports;
 		// Create a new module (and put it into the cache)
 		var module = installedModules[moduleId] = {
 			exports: {},
 			id: moduleId,
 			loaded: false
 		};
 		// Execute the module function
 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
 		// Flag the module as loaded
 		module.loaded = true;
 		// Return the exports of the module
 		return module.exports;
 	}


 	// expose the modules object (__webpack_modules__)
 	__webpack_require__.m = modules;
 	// expose the module cache
 	__webpack_require__.c = installedModules;
 	// __webpack_public_path__
 	__webpack_require__.p = "";
 	// Load entry module and return exports
 	return __webpack_require__(0);
 })([function(module, exports) {
	var chunk1=1;
	exports.chunk1=chunk1;
}]);
```

这其实就是一个立即执行函数，简化一下就是：

```js
function(modules) { // webpackBootstrap
 	// modules就是一个数组，元素就是一个个函数体，就是我们声明的模块
 	var installedModules = {};
 	// The require function
 	function __webpack_require__(moduleId) {
 		...
 	}
 	// expose the modules object (__webpack_modules__)
 	__webpack_require__.m = modules;
 	// expose the module cache
 	__webpack_require__.c = installedModules;
 	// __webpack_public_path__
 	__webpack_require__.p = "";
 	// Load entry module and return exports
 	return __webpack_require__(0);
 }
```

整个函数里就声明了一个变量installedModules 和函数__webpack_require__，并在函数上添加了一个m,c,p属性，m属性保存的是传入的模块数组，c属性保存的是installedModules变量，P是一个空字符串。最后执行__webpack_require__函数，参数为零，并将其执行结果返回。下面看一下__webpack_require__干了什么：

```js
function __webpack_require__(moduleId) {
		//moduleId就是调用是传入的0
 		// installedModules[0]是undefined,继续往下
 		if(installedModules[moduleId])
 			return installedModules[moduleId].exports;
 		// module就是{exports: {},id: 0,loaded: false}
 		var module = installedModules[moduleId] = {
 			exports: {},
 			id: moduleId,
 			loaded: false
 		};
 		// 下面接着分析这个
 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
 		// 表明模块已经载入
 		module.loaded = true;
 		// 返回module.exports(注意modules[moduleId].call的时候module.exports会被修改)
 		return module.exports;
 	}
```

接着看一下modules[moduleId].call(module.[exports](https://so.csdn.net/so/search?q=exports&spm=1001.2101.3001.7020), module, module.exports, webpack_require)，其实就是

```js
modules[moduleId].call({}, module, module.exports, __webpack_require__)
```

对call不了解当然也可以认为是这样(但是并不是等价，call能确保当模块中使用this的时候，this是指向module.exports的)：

```js
function  a(module, exports) {
	var chunk1=1;
	exports.chunk1=chunk1;
}
a(module, exports,__webpack_require__);
```

传入的module就是{exports: {},id: 0,loaded: false}，exports就是{}，__webpack_require__就是声明的__webpack_require__函数(传入这个函数有什么用呢，第二节将会介绍)；
运行后module.exports就是{chunk1:1}。所以当我们使用chunk1这个模块的时候（比如var chunk1=require(“chunk1”),得到的就是一个对象{chunk1:1}）。如果模块里没有exports.chunk1=chunk1或者module.exports=chunk1得到的就是一个空对象{}

#### 2、使用模块

上面我们已经分析了webpack是怎么打包一个模块的（入口文件就是一个模块），现在我们来看一下使用一个模块，然后使用模块的文件作为入口文件
webpack.config.js

```js
module.exports = {
    entry:"./main.js",
    output: {
        path: __dirname + '/dist',
        filename: '[name].js'
    }
};
```

main.js

```js
var chunk1=require("./chunk1");
console.log(chunk1);
```

打包后

```js
(function (modules) { // webpackBootstrap
	// The module cache
	var installedModules = {};
	// The require function
	function __webpack_require__(moduleId) {
		// Check if module is in cache
		if (installedModules[moduleId])
			return installedModules[moduleId].exports;
		// Create a new module (and put it into the cache)
		var module = installedModules[moduleId] = {
			exports: {},
			id: moduleId,
			loaded: false
		};
		// Execute the module function
		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
		// Flag the module as loaded
		module.loaded = true;
		// Return the exports of the module
		return module.exports;
	}
	// expose the modules object (__webpack_modules__)
	__webpack_require__.m = modules;
	// expose the module cache
	__webpack_require__.c = installedModules;
	// __webpack_public_path__
	__webpack_require__.p = "";
	// Load entry module and return exports
	return __webpack_require__(0);
})([function (module, exports, __webpack_require__) {
	var chunk1=__webpack_require__(1);
	console.log(chunk1);
}, function (module, exports) {
    var chunk1 = 1;
	exports.chunk1 = chunk1;
}]);
```

不一样的地方就是自执行函数的参数由

```js
[function(module, exports) { var chunk1=1; exports.chunk1=chunk1;}]
```

变为

```js
[function (module, exports, __webpack_require__) {
	var chunk1=__webpack_require__(1);
	console.log(chunk1);
}, function (module, exports) {
    var chunk1 = 1;
	exports.chunk1 = chunk1;
}]
```

其实就是多了一个main模块，不过这个模块没有导出项，而且这个模块依赖于chunk1模块。所以当运行__webpack_require__(0)的时候，main模块缓存到installedModules[0]上，modules[0].call(也就是调用main模块)的时候，chunk1被缓存到installedModules[1]上，并且导出对象{chunk1：1}给模块main使用

#### 3、重复使用模块

webpack.config.js

```js
module.exports = {
    entry:"./main.js",
    output: {
        path: __dirname + '/dist',
        filename: '[name].js'
    }
};
```

main.js

```js
var chunk1=require("./chunk1");
var chunk2=require(".chunlk2");
console.log(chunk1);
console.log(chunk2);
```

chunk1.js

```js
var chunk2=require("./chunk2");
var chunk1=1;
exports.chunk1=chunk1;
```

chunk2.js

```js
var chunk2=1;
exports.chunk2=chunk2;
```

打包后

```js
(function (modules) { // webpackBootstrap
	// The module cache
	var installedModules = {};
	// The require function
	function __webpack_require__(moduleId) {
		// Check if module is in cache
		if (installedModules[moduleId])
			return installedModules[moduleId].exports;
		// Create a new module (and put it into the cache)
		var module = installedModules[moduleId] = {
			exports: {},
			id: moduleId,
			loaded: false
		};
		// Execute the module function
		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
		// Flag the module as loaded
		module.loaded = true;
		// Return the exports of the module
		return module.exports;
	}
	// expose the modules object (__webpack_modules__)
	__webpack_require__.m = modules;
	// expose the module cache
	__webpack_require__.c = installedModules;
	// __webpack_public_path__
	__webpack_require__.p = "";
	// Load entry module and return exports
	return __webpack_require__(0);
})([function (module, exports, __webpack_require__) {

	var chunk1 = __webpack_require__(1);
	var chunk2 = __webpack_require__(2);
	console.log(chunk1);
	console.log(chunk2);
}, function (module, exports, __webpack_require__) {

	__webpack_require__(2);
	var chunk1 = 1;
	exports.chunk1 = chunk1;
}, function (module, exports) {

	var chunk2 = 1;
	exports.chunk2 = chunk2;
}]);
```

不难发现，当需要重复使用模块的时候，缓存变量installedModules 就起作用了



### 4.HMR热更新

#### 热更新原理

![image-20220330160910633](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201835657.png)

`HMR`即`Hot Module Replacement`是指当你对代码修改并保存后，`webpack`将会对代码进行重新打包，并将改动的模块发送到浏览器端，浏览器用新的模块替换掉旧的模块，去实现局部更新页面而非整体刷新页面。

![core](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201835072.webp)

如上图所示，右侧`Server`端使用`webpack-dev-server`去启动本地服务，内部实现主要使用了`webpack`、`express`、`websocket`。

- 使用`express`启动本地服务，当浏览器访问资源时对此做响应。

- 服务端和客户端使用`websocket`实现长连接webpack

  监听源文件的变化，即当开发者保存文件时触发webpack的重新编译。

  - 每次编译都会生成`hash值`、`已改动模块的json文件`、`已改动模块代码的js文件`
  - 编译完成后通过`socket`向客户端推送当前编译的`hash戳`

- 客户端的websocket监听到有文件改动推送过来的hash戳，会和上一次对比
  - 一致则走缓存
  - 不一致则通过`ajax`和`jsonp`向服务端获取最新资源

- 使用`内存文件系统`去替换有修改的内容实现局部刷新

#### webpack-dev-middleware

是一个中间件，它可以嵌入到现在的其他的express应用，提供打包功能，并且可以提供产出文件的访问服务

一个express服务

```js
let express = require('express');
let app = express();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackOptions = require('./webpack.config.js');
// compiler就是一个webpack实例，代表整个编译的任务，有个方法叫run，compiler.run()可以启动编译
const compiler = webpack(webpackOptions);
app.use(webpackDevMiddleware(compiler, {}));
app.listen(3003);
```

- 这样，你用node执行上面这个文件，在3003端口起一个服务，将项目根据webpack打包，并且可以访问编译完后的静态资源(内存中的)
- 所以，该中间件的作用就是：
  - 会自动按配置文件的要求打包项目
  - 会提供打包后的文件的访问服务

#### webpack-dev-server

webpack-dev-server实际上相当于启用了一个express的Http服务器+调用webpack-dev-middleware。它的作用主要是用来伺服资源文件。这个Http服务器和client使用了websocket通讯协议，原始文件作出改动后，webpack-dev-server会用webpack实时的编译，再用webpack-dev-middleware将webpack编译后文件会输出到内存中。适合纯前端项目，很难编写后端服务，进行整合。

**webpack-dev-middleware**
webpack-dev-middleware输出的文件存在于内存中。你定义了 webpack.config，webpack 就能据此梳理出entry和output模块的关系脉络，而 webpack-dev-middleware 就在此基础上形成一个文件映射系统，每当应用程序请求一个文件，它匹配到了就把内存中缓存的对应结果以文件的格式返回给你，反之则进入到下一个中间件。

因为是内存型文件系统，所以重建速度非常快，很适合于开发阶段用作静态资源服务器；因为 webpack 可以把任何一种资源都当作是模块来处理，因此能向客户端反馈各种格式的资源，所以可以替代HTTP 服务器。事实上，大多数 webpack 用户用过的 webpack-dev-server 就是一个 express＋webpack-dev-middleware 的实现。二者的区别仅在于 webpack-dev-server 是封装好的，除了 webpack.config 和命令行参数之外，很难去做定制型开发。而 webpack-dev-middleware 是中间件，可以编写自己的后端服务然后把它整合进来，相对而言比较灵活自由。

**webpack-hot-middleware**
是一个结合webpack-dev-middleware使用的middleware，它可以实现浏览器的无刷新更新（hot reload），这也是webpack文档里常说的HMR（Hot Module Replacement）。HMR和热加载的区别是：热加载是刷新整个页面。

### 5.devServe

#### 解决跨域问题

devServer.proxy可以代理开发环境中的url

添了`changeOrigin: true`后才可跨域

从跨域的原理看来，**浏览器就是通过判断请求头中的origin结合请求的url来判断是否跨域的**，那是不是可以更改origin来骗过浏览器？不行的   报错：Refused to set unsafe header "Origin"

**header中的origin是浏览器设置的，无法自行更改它**

设置了`changeOrigin`只是**更改了request请求中的host**，并不是origin

devServer中的proxy就相当于charles进行url的代理，在`sxx()`执行后发送的请求是`http://0.0.0.0:8080/robot/send?XXXXXXXX`，我们是在0.0.0.0:8080下，当然不会限制这样的请求的发送，然后devServer的proxy通过配置将host更改为`oapi.dingtalk.com`，该请求就能正常进行

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201835425.webp)

```js
proxy: {
    '/index':{ // 这个是你要替换的位置
    
    /** 比如你要讲http://localhost:8080/index/xxx 替换成 http://10.20.30.120:8080/sth/xxx
    * 那么就需要将 index 前面的值替换掉, 或者说是替换掉根地址, 
    *你可能发现了index也是需要替换的, 没错, 我会在后续操作中处理.
    */
    
    target: 'http://10.20.30.120:8080'//这个是被替换的目标地址
    
    changeOrigin: true // 默认是false,如果需要代理需要改成true
        
    secure:false //不检查安全问题 可以接受https
        
    pathRewrite:{
        '^/index' : '/' //在这里 http://localhost:8080/index/xxx 已经被替换成 http://10.20.30.120:8080/
    }}
}

// 然后在你发起请求的js文件中的地址需要忽略http://10.20.30.120:8080/

//比如 demo.js
axios.post({
    url:'http://10.20.30.120:8080/sth/xxx'// 需要替换成下面的地址
    url:'/sth/xxx'
}
)
```

proxy 工作原理上市利用 http-proxy-middleware 这个http 代理中间件，实现请求转发给其他的服务器。如下：在开发阶段，本地地址是 `Http://loaclhost:3000` , 该浏览器发送一个前缀带有 /api 标识的向服务器请求数据，但是这个服务器只是将这个请求转发给另一台服务器：

```js
const express = require('express');
const proxy = require('http-proxy-middleware');

const app = express();

app.use('/api', proxy({target: 'http://www.example.org', changeOrigin: true}));
app.listen(3000);

// http://localhost:3000/api/foo/bar -> http://www.example.org/api/foo/bar
```

　　在开发阶段，webpack-dev-server 会自动启动一个本地开发服务器，所以我们的应用在开发阶段是独立运行在 localhost 的一个端口上的，而后端服务器又是运行在另一个地址上

　　所以在开发阶段中，由于浏览器的同源策略，当本地访问的时候就会出现跨域资源请求的问题，通过设置 webpack proxy 实现代理请求后，相当于浏览器和服务器之间添加了一个代理者。当本地发送请求的时候，中间服务器会接受这个情求，并将这个请求转发给目标服务器，目标服务器返回数据后，中间服务器又会将数据返回给浏览器，当中间服务器将数据返回给服务器的时候，它们两者是同源的，并不会存在跨域的问题。

　　服务器和服务器之间是不会存在跨域资源的问题的。



### 6.treeShaking原理

`Tree Shaking`中文含义是摇树，在webpack中指的是打包时把无用的代码摇掉，以优化打包结果。

而`webpack5`已经自带了这个功能了，当打包环境为`production`时，默认开启`tree-shaking`功能。

把`函数、不可能执行的代码、定义未用的变量`通通都剔除了，这在一个项目中，能减少很多的代码量，进而减少打包后的文件体积。

有无`副作用`的判断，可以决定`tree-shaking`的优化程度，举个例子：

- 我现在引入`a.js`但是我不用他的`console`函数，那么在优化阶段我完全可以不打包`a.js`这个文件。
- 我现在引入`b.js`但是我不用他的`console`函数，但是我不可以不打包`b.js`这个文件，因为他有`副作用`，不能不打包。

`sideEffects`可以在`package.json`中设置：

```js
// 所有文件都有副作用，全都不可 tree-shaking
{
 "sideEffects": true
}
// 没有文件有副作用，全都可以 tree-shaking
{
 "sideEffects": false
}
// 只有这些文件有副作用，
// 所有其他文件都可以 tree-shaking，
// 但会保留这些文件
{
 "sideEffects": [
  "./src/file1.js",
  "./src/file2.js"
 ]
}
```

tree-shaking的功能主要是有两点：

- 按需加载，即没有被引用的模块不会被打包进来；
- 把加载后未使用的模块干掉
- 把加载完毕的模块中的未使用的代码干掉

tree-shaking实现原理：

- Tree-shaking = ES6odule（非default） + UglifyJS
- 其中，es6module通过对模块进行静态分析，找到未引入模块和引入但未使用模块； UglifyJS实现对引入模块中未使用的代码进行干掉

在 Webpack 中，启动 Tree Shaking 功能必须同时满足三个条件：

- 使用 ESM 规范编写模块代码
- 配置 `optimization.usedExports` 为 `true`，启动标记功能
- 启动代码优化功能，可以通过如下方式实现：
  - 配置 `mode = production`
  - 配置 `optimization.minimize = true`
  - 提供 `optimization.minimizer` 数组

在 CommonJs、AMD、CMD 等旧版本的 JavaScript 模块化方案中，导入导出行为是高度动态，难以预测的，例如：

```Javascript
if(process.env.NODE_ENV === 'development'){
  require('./bar');
  exports.foo = 'foo';
}
```

而 ESM 方案则从规范层面规避这一行为，它要求所有的导入导出语句只能出现在模块顶层，且导入导出的模块名必须为字符串常量，这意味着下述代码在 ESM 方案下是非法的：

```Javascript
if(process.env.NODE_ENV === 'development'){
  import bar from 'bar';
  export const foo = 'foo';
}
```

所以，ESM 下模块之间的依赖关系是高度确定的，与运行状态无关，编译工具只需要对 ESM 模块做静态分析，就可以从代码字面量中推断出哪些模块值未曾被其它模块使用，这是实现 Tree Shaking 技术的必要条件。

Webpack 中，Tree-shaking 的实现一是先**标记**出模块导出值中哪些没有被用过，二是使用 Terser 删掉这些没被用到的导出语句。标记过程大致可划分为三个步骤：

- Make 阶段，收集模块导出变量并记录到模块依赖关系图 ModuleGraph 变量中
- Seal 阶段，遍历 ModuleGraph 标记模块导出变量有没有被使用
- 生成产物时，若变量没有被其它模块使用则删除对应的导出语句

- `ES6`的模块引入是静态分析的，所以在编译时能正确判断到底加载了哪些模块
- 分析程序流，判断哪些变量未被使用、引用，进而删除此代码

**特点：**

- 在生产模式下它是默认开启的，但是由于经过`babel`编译全部模块被封装成`IIFE`，它存在副作用无法被`tree-shaking`掉
- 可以在`package.json`中配置`sideEffects`来指定哪些文件是有副作用的。它有两种值，一个是布尔类型，如果是`false`则表示所有文件都没有副作用；如果是一个数组的话，数组里的文件路径表示改文件有副作用
- `rollup`和`webpack`中对`tree-shaking`的层度不同，例如对`babel`转译后的`class`，如果`babel`的转译是宽松模式下的话(也就是`loose`为`true`)，`webpack`依旧会认为它有副作用不会`tree-shaking`掉，而`rollup`会。这是因为`rollup`有程序流分析的功能，可以更好的判断代码是否真正会产生副作用

**原理**

- `ES6 Module` 引入进行静态分析，故而编译的时候正确判断到底加载了那些模块
- 静态分析程序流，判断那些模块和变量未被使用或者引用，进而删除对应代码

> 依赖于`import/export`

通过导入所有的包后再进行条件获取

> ES6的import语法完美可以使用tree shaking，因为可以在代码不运行的情况下就能分析出不需要的代码

**CommonJS的动态特性模块意味着tree shaking不适用**。因为它是不可能确定哪些模块实际运行之前是需要的或者是不需要的。在ES6中，进入了完全静态的导入语法：import

### 7.webpack 中，module，chunk 和 bundle 的区别是什么？

- `ES6`的模块引入是静态分析的，所以在编译时能正确判断到底加载了哪些模块
- 分析程序流，判断哪些变量未被使用、引用，进而删除此代码

![image-20200518210532171](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201835066.png)

看这个图就很明白了：

1. 对于一份同逻辑的代码，当我们手写下一个一个的文件，它们无论是 ESM 还是 commonJS 或是 AMD，他们都是 **module** ；
2. 当我们写的 module 源文件传到 webpack 进行打包时，webpack 会根据文件引用关系生成 **chunk** 文件，webpack 会对这个 chunk 文件进行一些操作；
3. webpack 处理好 chunk 文件后，最后会输出 **bundle** 文件，这个 bundle 文件包含了经过加载和编译的最终源文件，所以它可以直接在浏览器中运行。

一般来说一个 chunk 对应一个 bundle，比如上图中的 `utils.js -> chunks 1 -> utils.bundle.js`；但也有例外，比如说上图中，我就用 `MiniCssExtractPlugin` 从 chunks 0 中抽离出了 `index.bundle.css` 文件

`module`，`chunk` 和 `bundle` 其实就是同一份逻辑代码在不同转换场景下的取了三个名字：

我们直接写出来的是 module，webpack 处理时是 chunk，最后生成浏览器可以直接运行的 bundle。

### 8.sourceMap

sourceMap`是一项将编译、打包、压缩后的代码映射回源代码的技术，由于打包压缩后的代码并没有阅读性可言，一旦在开发中报错或者遇到问题，直接在混淆代码中`debug`问题会带来非常糟糕的体验，`sourceMap`可以帮助我们快速定位到源代码的位置，提高我们的开发效率。`sourceMap`其实并不是`Webpack`特有的功能，而是`Webpack`支持`sourceMap`，像`JQuery`也支持`souceMap

有一份映射的文件，来标记混淆代码里对应的源码的位置，通常这份映射文件以`.map`结尾，里边的数据结构大概长这样

```js
{
  "version" : 3,                          // Source Map版本
  "file": "out.js",                       // 输出文件（可选）
  "sourceRoot": "",                       // 源文件根目录（可选）
  "sources": ["foo.js", "bar.js"],        // 源文件列表
  "sourcesContent": [null, null],         // 源内容列表（可选，和源文件列表顺序一致）
  "names": ["src", "maps", "are", "fun"], // mappings使用的符号名称列表
  "mappings": "A,AAAB;;ABCDE;"            // 带有编码映射数据的字符串
}
```

其中`mappings`数据有如下规则：

- 生成文件中的一行的每个组用“;”分隔；
- 每一段用“,”分隔；
- 每个段由1、4或5个可变长度字段组成；

在我们的压缩代码的最末端加上这句注释，即可让sourceMap生效：

```js
//# sourceURL=/path/to/file.js.map
```

有了这段注释后，浏览器就会通过`sourceURL`去获取这份映射文件，通过解释器解析后，实现源码和混淆代码之间的映射。因此sourceMap其实也是一项需要浏览器支持的技术。

如果我们仔细查看webpack打包出来的bundle文件，就可以发现在默认的`development`开发模式下，每个`_webpack_modules__`文件模块的代码最末端，都会加上`//# sourceURL=webpack://file-path?`，从而实现对sourceMap的支持。



### 9.手写loader

#### 1.loader 接受的参数

-   `content` 源文件的内容
-   `map` SourceMap 数据
-   `meta` 数据，可以是任何内容

`this.callback`方法则更灵活，因为它允许传递多个参数，而不仅仅是content

**传递map，让source-map不中断**

**传递meta，让下一个loader接收到其他参数**

在配资文件中

```js
// webpack.config.js
module.exports = {
  // ...other config
  module: {
    rules: [
      {
        test: /^your-regExp$/,
        use: [
          {
             loader: 'loader-name-A',
          }, 
          {
             loader: 'loader-name-B',
          }
        ]
      },
    ]
  }
}
```

通过配置可以看出，针对每个文件类型，`loader`是支持以数组的形式配置多个的，因此当`Webpack`在转换该文件类型的时候，会按顺序链式调用每一个`loader`，前一个`loader`返回的内容会作为下一个`loader`的入参。因此`loader`的开发需要遵循一些规范，比如返回值必须是标准的`JS`代码字符串，以保证下一个`loader`能够正常工作，同时在开发上需要严格遵循“单一职责”，只关心`loader`的输出以及对应的输出

`loader`函数中的`this`上下文由`webpack`提供，可以通过`this`对象提供的相关属性，获取当前`loader`需要的各种信息数据，事实上，这个`this`指向了一个叫`loaderContext`的`loader-runner`特有对象

#### 2.loader的类型

##### 2.1 loader分类

> loader一般分为四类：

-   **post(后置)**
-   **inline(内联)**
-   **normal(正常)**
-   **pre(前置)**

##### 2.2四类loader如何区分，如何配置？

> 除了inline-loader在业务代码内配置，也就是使用的时候配置。其余均在webpack配置文件中配置。

-   **require内的是inline-loader**
-   **webpack中通过enforce来配置是normal(可以不写，默认值)还是post还是pre**

```js
//定在require方法里的 inline Loader
let filecontent = require(`!!inline1-loader!inline2-loader!${filePath}`); //inline-loader是这么写的！！！
//不同的loader并不决定loader的类型属性，而是你在使用 的使用了什么样的enforce
let rules = [
    {
        test: /\.js$/,
        use: ['normal1-loader', 'normal2-loader']//普通的loader
    },
    {
        test: /\.js$/,
        enforce: 'post',
        use: ['post1-loader', 'post2-loader']//post的loader 后置
    },
    {
        test: /\.js$/,
        enforce: 'pre',
        use: ['pre1-loader', 'pre2-loader']//pre的loader 前置 
    },
]
```

-   内联loader前面的符号

| 符号 | 变量                 | 含义                                                         |
| ---- | -------------------- | ------------------------------------------------------------ |
| `-!` | noPreAutoLoaders     | 不要前置和普通 loader， 这个require的文件不会走前置和普通的loader |
| `!`  | noAutoLoaders        | 不要普通 loader， 这个require的文件不会走普通的loader        |
| `!!` | noPrePostAutoLoaders | 不要前后置和普通 loader,只要内联 loader， 这个require的文件只会走内联的loader |

> **loader有特定的执行顺序，且是在所以loader开始执行前，先把loader的顺序整理好，然后一个个开始执行的。**



#### 3\. loader的执行顺序

在webpack开始正式编译的时候，会找到入口文件，然后调用loader对文件进行处理，处理的时候会按照**一定顺序**对loader进行组合，然后一个个执行loader。执行完后会返回处理完的代码，是Buffer或String类型。然后webpack才开始真正的ast语法树解析。

- 一般来说loader.pitch是从左往右，normal是从右往左。具体是这样的：

  > 首先loader能够分成四类：post-loader(后置loader)、inline-loader(内联loader)、normal-loader(普通的loader)和pre-loader(前置loader)
  >
  > 另外，一个loader由两部分组成，一个是普通的函数，一个数这个函数的pitch方法。那么我们姑且认为一个完整的laoder由loader-pitch方法和loader-normal方法组成。那么结合上面所说的四类来将，loader的执行顺序是这样的：
  >
  > 首先执行loader-pitch方法，先是post-loader的pitch，然后inline-loader的pitch，然后是normal-loader的pitch，然后是pre-loader的pitch，pitch走完，开始走loader-normal方法，先走pre-loader的方法，再走normal-loader的方法，再走inline-loader的方法，再走post-loader的方法。
  >
  > 如果是同类loader，比如都是normal-loader，有loader1，loader2，loader3，那么就是先走loader1的pitch，再走loader2的pitch，再走loader3的pitch，然后走loader3的normal函数，再走loader2的normal函数，最后走loader1的normal函数。这里最后走的loader的normal函数的顺序，其实就是我们常说的laoder的执行顺序，从右往左。但其实是要分pitch和normal两种的。
  >
  > 当然，pitch方法如果有返回值，那么将忽略后面所有的loader以及本身这个loader对应的normal函数，然后相反顺序一次走前面的loader的normal函数

- **loader有特定的执行顺序，且是在所以loader开始执行前，先把loader的顺序整理好，然后一个个开始执行的。所以本节2.2中的三个符号，可以过滤掉指定的loader。**

- loader的执行顺序是洋葱模型吗？

  > 不是，洋葱模型是嵌套关系，而loader执行顺序是并列关系。

#### 4\. 常用loader的实现

##### 1\. babel-loader

> babel-loader的主要原理`(面试点)`就是：调动@babel/core这个包下面的transform方法，将源码通过presets预设来进行转换，然后生成新的代码、map和ast语法树传给下一个loader。这里的presets，比如@babel/preset-env这个预设其实就是各类插件的集合，基本上一个插件转换一个语法，比如箭头函数转换，有箭头函数转换的插件，这些插件集合就组成了预设。

```js
const babel = require('@babel/core');
const path = require('path')

function loader(inputSource, map, ast){ // 上一个loader的源码。映射，和抽象语法树
  const options = {
    presets: ["@babel/preset-env"], // 转换靠预设。预设是插件的集合
    sourceMaps: true, // 如果这个参数不传，默认值为false，不会生成sourceMap
    filename: path.basename(this.resourcePath) // 生成的文件名

  }
  // 返回有三个值，code转换后的es5代码，map转换后的代码到转换前的戴梦得映射，ast是转换后的抽象语法树
  let transRes = babel.transform(inputSource, options);

  // loader的返回值可以是一个值，也可以是多个值
  // return inputSource; // 返回一个值,用return
  return this.callback(null, transRes.code, transRes.map, transRes.ast); // 返回多个值, 必须调用this.callback(err, 后面的参数是传递给下一个loader的参数)。这个callback是loader-runner提供的一个方法，内置的。这个this默认是loader-runner内部的context，默认是空对象，但是在loader-runner执行的过程中会天机爱很多方法和属性，包括这个callback方法。
}

module.exports = loader;
```

##### 2\. file-loader的实现

> file-loader的原理`(面试点)`就是通过laoder的参数拿到文件的内容，然后解析出file-loader配置中的名字，解析名字其实就是替换\[hash\]、\[ext\]等，然后向输出目录里输出一个文件，这个文件的内容就是loader的参数，名字就是刚刚说的解析出的名字。但是，实际上，并不是在loader里输出文件的，loader只是向webpack的complication的assets中，添加的文件id和内容，最终还是webpack将文件写进硬盘的。

```js
const { getOptions, interpolateName } = require("loader-utils");

/*
  content是上一个loader传给当前loader的内容，或者源文件内容,默认是字符串类型
  如果你希望得到Buffer，不希望转成字符串，那么就给loader.row置为true。即loader.row若为默认值false则content是字符串，为true就是Buffer

*/
function loader(content){
  let options = getOptions(this) || {}; // 拿到参数
  // 下面的参数 this是loaderContext， filename是文件名生成模板，即webpack配置中的[hash].[ext] content是文件内容
  let url = interpolateName(this, options.filename || "[hash].[ext]", {content}); // 转换名字
  // 向输出目录里输出一个文件
  // this.emitFile是loaderRunner提供的
  this.emitFile(url, content);// 向输出目录里输出一个文件,其实本质就是webpack中的complication.assets[filename]=content,然后webpack会将assets写到目标目录下。所以不是loader去生成文件的。
  return `module.exports = ${JSON.stringify(url)}`; // 这里的loader肯定要返回一个JS模块代码,即导出一个值，这个值将会成为次模块的导出结果
}

loader.raw = true; // loader的参数content会是buffer类型

module.exports = loader;
```

##### 3.url-loader的实现

> `(面试点)`url-loader是file-loader的升级版，内部包含了file-loader。url-loader配置的时候回配置一个limit，这个配置的值代表小于limit的值的时候，转成base64，大于的时候还是文件，比如说原本是图片，那大于limit就还是图片。
>
> 所以，url-loader主要就是先判断大小(内容的buffer的lenth)是否大于limit，大于就走file-loader，否则就用`toStrng('base64')`转成base64。

```js
const { getOptions, interpolateName } = require("loader-utils");
const mime = require('mime');

/*
  content是上一个loader传给当前loader的内容，或者源文件内容,默认是字符串类型
  如果你希望得到Buffer，不希望转成字符串，那么就给loader.row置为true。即loader.row若为默认值false则content是字符串，为true就是Buffer

*/
function loader(content){
  // console.log(content)
  let options = getOptions(this) || {}; // 拿到参数
  let { limit, fallback } = options;
  if (limit) {
    limit = parseInt(limit, 10);
  }
  const mimeType = mime.getType(this.resourcePath);
  if (!limit || content.length < limit) {
    let base64 = `data:${mimeType};base64,${content.toString('base64')}`;
    return  `module.exports = ${JSON.stringify(base64)}`;
  } else {
    // 这里不能用require('file-loader')，因为如果这样写的话，会去node_modules中找，而不是我们自己的file-loader了。源码是可以的，因为源码总file-loader就是装在node_modules中
    return require(fallback).call(this, content);
  }
}

loader.raw = true; // loader的参数content会是buffer类型

module.exports = loader;
```

##### 4\. 样式处理的loader——style-loader、css-loader和less-loader

一般我们处理像是的loader配置为：

```js
{
test:/\.less$/,
    loaders: [
        'style-loader',
        'css-loader',
        'less-loader',
    ]
}
```

###### 1.less-loader的实现

> less-loader的原理`(面试点)`：主要是借助less模块的render方法，将less语法进行转换成css语法，然后返回或者额调用this.callback()传递给下一个loader。但是由于less-loader原本设计的时候，是想让less-loader可以作为最后一个loader使用的，所谓的最后一个loader，也就是说最后的返回值是一个js模块，也就是说module.exports = xxx这种，所以less-loader在返回结果的时候，将转换后的内容，外面套了一层module.exports = 转换后的内容。
>
> 那么这里变成了module.exports导出后，给到css-loader，css-loader只是处理了import、url等语法，将内容给到了style-loader，style-loader也就要跟着改变，因为style-loader的作用是创建一个style脚本，将css内容包裹在style标签中去，然后把style插入到document.head中。那么这里的关键就是拿到样式内容，这个内容刚才说了，被module.exports包裹了，那怎么拿到？直接require就可以了，因为module.exports本来就是js模块的导出格式，所以直接require就可以了。
>
> 实际上，在真正的style-loader、css-loader和less-loader的执行过程是这样的`(面试点)`：
>
> 先执行loader的pitch函数，pitch函数是从左往右的，从上到下的，也就是先执行style-loader的pitch，这个函数主要是创建一个script脚本，这个脚本主要是创建一个style标签，style标签的innerHTML就是css样式，然后将style标签插入document.head中，然后将这个script脚本返回。注意，这边是有返回值的。pitch-loader一旦有返回值，那么后面的css-loader和less-loader都将不会直接，也不会执行当前loader的normal-loader，既然都不会执行了，那么style标签的css内容哪里来呢？其实，他在创建style标签后，它又require了css-loader和less-loader这两个内联loader，是走了内联loader才获取到的。内联loader从右往左，从下往上，也就是先执行less-loader，然后执行css-loader，最后将内容返给stylel-loader，这样才得到了css内容，赋值给style标签的innerHTML，然后插入到document.head中，这样才完成了整个样式的loader处理。
>
> 

```js
let less = require('less')

function loader(inputSource){
  // let css;
  // less.render(inputSource, { filename: this.resource }, (err, output) => {
  //   css = output.css;
  // })
  // return css; // 虽然上面css赋值在回调中，但是本身render是同步的，所以可以在这里return。但是假如render是异步，那么就不能够这么写了，异步怎么写，看下面:

  let callback = this.async(); // 这种写法就是即便render是异步，也可以在loader中返回callback的参数值。this.async()这个方法是loader-runner提供的，乳沟调用了async方法，可以把loader的执行变成异步
  less.render(inputSource, { filename: this.resource }, (err, output) => {
    // less-loader本来可以写成callback(err, output.css)，但是作者为了能够使得less-loader放在最后一个，也就是返回的应该是一段JS脚本，所以就写成了下面的写法
    callback(err, `module.exports = ${JSON.stringify(output.css)}`) // 这个callback的是this.async()，而this.async()里面的实现就是调用context.callback，而这里的this就是context，所以你不写let callback = this.async()，在回调中直接用this.callback(null, 内容)是一样的
  })
}

module.exports = loader;
```

###### 2.css-loader的作用

> 其实less-loader已经转成css了，但是有些语法比如import、url还尚未处理，所以这个css-loader就是用来处理import、url等语法的，功能比较单一。

###### 3.style-loader的实现

> 见less-loader的笔记`(面试点)`

```js
const { Console } = require("console");
const loaderUtils = require('loader-utils');

function loader(){

}

/*
  参数：
  remainingRequest 剩下的请求
  previousRequest 前面的请求
  data 数据

*/

loader.pitch = (remainingRequest, previousRequest, data) => {
  console.log('remainingRequest', remainingRequest);
  console.log('previousRequest', previousRequest)
  console.log('data', data, loaderUtils.stringifyRequest(this, '!!' + remainingRequest));
  let script = `
    let style = document.createElement('style');
    style.innerHTML = require(${loaderUtils.stringifyRequest(this, '!!' + remainingRequest)}); // 依赖的值为!!C:/Users/yuhua7/Desktop/webpack/4.webpack-loader/loaders/less-loader.js!C:/Users/yuhua7/Desktop/webpack/4.webpack-loader/src/style.less
    document.head.appendChild(style);
    module.exports = '';
  `;
  // 这个返回的js脚本给了webpack了
  // webpack会把这个js脚本转成AST抽象语法树,分析脚本中的依赖，也就是上面的require，加载依赖，依赖(require的参数)为!!C:/Users/yuhua7/Desktop/webpack/4.webpack-loader/loaders/less-loader.js!C:/Users/yuhua7/Desktop/webpack/4.webpack-loader/src/style.less，那么这个参数有两个感叹号!!，这代表只走行内，也就是说其实只需要一个内联loader去处理，所以会去走内联loader处理文件。
  return script;
}

module.exports = loader;
```

css-loader的功能很纯粹，就是处理import和url的

最后一个loader需要返回的是js模块，也就是`module.exports = JSON.stringify(内容)`

#### 5.loader.pitch的重要参数`(面试点)`

loader.pitch方法中有三个参数，分别是`remainingRequest`、`previousRequest`和`data`

-   `remainingRequest`:剩余的请求
-   `previousRequest`:前面的请求
-   `data`:数据

下面解释下三个参数：

假设当前已经走到laoder3.pitch了，那么

-   `remainingRequest`剩余的请求就是当前loader后面(不含当前)的loader和file的路径用感叹号’!'拼接，类型是字符串。
-   `previousRequest`前面的请求就是当前loder之前(不含当前)的loader的路径用感叹号’!'拼接，类型是字符串。
-   `data`数据其实是一个空对象{},给loader内部存放数据使用的。

-   上面除了`remainingRequest`、`previousRequest`和`request`，其实还有一个`currentRequest`，这个`currentRequest`其实就是loader3

### 10.手写plugin

`webpack`基于发布订阅模式，在运行的生命周期中会广播出许多事件，插件通过监听这些事件，就可以在特定的阶段执行自己的插件任务，从而实现自己想要的功能

`compiler`和`compilation`是`Webpack`两个非常核心的对象，其中`compiler`暴露了和 `Webpack`整个生命周期相关的钩子（[compiler-hooks](https://link.juejin.cn?target=https%3A%2F%2Fwebpack.js.org%2Fapi%2Fcompiler-hooks%2F)），而`compilation`则暴露了与模块和依赖有关的粒度更小的事件钩子（[Compilation Hooks](https://link.juejin.cn?target=https%3A%2F%2Fwebpack.js.org%2Fapi%2Fcompilation-hooks%2F)）。

`Plugin`的开发和开发`Loader`一样，需要遵循一些开发上的规范和原则：

- 插件必须是一个函数或者是一个包含 `apply` 方法的对象，这样才能访问`compiler`实例；
- 传给每个插件的 `compiler` 和 `compilation` 对象都是同一个引用，若在一个插件中修改了它们身上的属性，会影响后面的插件;
- 异步的事件需要在插件处理完任务时调用回调函数通知 `Webpack` 进入下一个流程，不然会卡住;

怎么开发的

-   一般来说，插件是一个类
-   类上有一个apply方法，一般我们插件的逻辑就写在这个apply方法内。因为apply方法在安装插件时，会被webpack compiler调用，并且将compiler传给apply方法，也就是参数参数是compiler。
-   由于webpack的事件流是由tapable前后贯穿的，所以webpack在内部提供了很多钩子，我们在apply方法中去注册特定钩子的事件，那么webpack就会在特定的时机来调用这些钩子对应的事件函数。
    -   比如：资源编译结束我需要将文件压缩存档，那么在apply方法中就可以写compiler.hooks.done.tap(‘XXXPlugin’, 压缩存档的回调函数)，这个代码的意思就是我在done的这个时机去注册一个事件，tap方法就是注册事件，事件名是第一个参数’xxxPlugin’，事件执行的内容就是压缩存档的回调函数。其实这个done源码中对应的就是tapable的AsyncSeriesHook异步串行钩子，相当于在这个钩子上tap了一个事件。那么等webpack编译完成的时候，就会触发tapable的callAsync函数，这个函数的意思就是异步触发之前done的时候注册的钩子。那么也就是在编译完成的时候回执行压缩存档的回调函数。这就完成了一个插件开发了。
    -   其实，tapable就是一个订阅发布，tap的时候注册一些事件，放到队列中，然后call的时候去一个个触发，只不过tapable在触发的时候根据不同的钩子类型改变了触发的顺序，比如SyncBailHook注册的钩子，触发的时候，一旦有返回值，就不继续执行下个事件函数了。当然源码中也不是直接循环调用这些事件函数的，而是new了一个Function，通过对每个队列构造一个函数，去执行的。
-   另外，插件有两个重要的对象，一个是compiler，另一个是compilation：
    -   compiler，这个webpack编译过程就一个compiler，代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。
    -   compilation：每次资源构建都会有一个compilation，所以它代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。
-   最后，钩子的使用的话就很简单，在webpack配置文件中，new一个插件这个类，然后传一些配置参数进去就可以了。webpack会自动去调apply方法的。

例如实现 文件打包

```js
const Jz = require('jszip');
const { RawSource } = require("webpack-sources");
class JsZip{
  constructor(options){
    this.options = options; // filename是压缩完成后的压缩包的名字，不带后缀
  }
  apply(compiler){
    compiler.hooks.emit.tapAsync('JsPlugin', (compilation, callback) => {
      console.log(compilation.assets)
      var zip = new Jz();
      for (let filename in compilation.assets) {
        let source = compilation.assets[filename].source();
        zip.file(filename, source);
      }
      zip.generateAsync({type:"nodebuffer"})
      .then((content) => {
          compilation.assets[this.options.filename + '.zip'] = new RawSource(content);
          callback();
      });
    })
  }
}

module.exports = JsZip;

```



### 11.Babel使用和原理

#### Babel的用途

##### 转译 esnext、typescript、flow 等到目标环境支持的 js

这个是最常用的功能，用来把代码中的 esnext 的新的语法、typescript 和 flow 的语法转成基于目标环境支持的语法的实现。并且还可以把目标环境不支持的 api 进行 polyfill。

babel7 支持了 preset-env，可以指定 targets 来进行按需转换，转换更加的精准，产物更小。

##### 一些特定用途的代码转换

babel 是一个转译器，暴露了很多 api，用这些 api 可以完成代码到 AST 的解析、转换、以及目标代码的生成。

开发者可以用它来来完成一些特定用途的转换，比如函数插桩（函数中自动插入一些代码，例如埋点代码）、自动国际化等。这些都是后面的实战案例。

现在比较流行的小程序转译工具 taro，就是基于 babel 的 api 来实现的。

##### 代码的静态分析

对代码进行 parse 之后，能够进行转换，是因为通过 AST 的结构能够理解代码。理解了代码之后，除了进行转换然后生成目标代码之外，也同样可以用于分析代码的信息，进行一些检查。

- linter 工具就是分析 AST 的结构，对代码规范进行检查。
- api 文档自动生成工具，可以提取源码中的注释，然后生成文档。
- type checker 会根据从 AST 中提取的或者推导的类型信息，对 AST 进行类型是否一致的检查，从而减少运行时因类型导致的错误。
- 压缩混淆工具，这个也是分析代码结构，进行删除死代码、变量名混淆、常量折叠等各种编译优化，生成体积更小、性能更优的代码。
- js 解释器，除了对 AST 进行各种信息的提取和检查以外，我们还可以直接解释执行 AST。

#### 常见`plugin`和`Preset`

**`Preset`就是一些`Plugin`组成的合集**,你可以将`Preset`理解称为就是一些的`Plugin`整合称为的一个包

##### `babel-preset-env`

`@babel/preset-env`是一个智能预设，它可以将我们的高版本`JavaScript`代码进行转译根据内置的规则转译成为低版本的`javascript`代码。

`preset-env`内部集成了绝大多数`plugin`（`State > 3`）的转译插件，它会根据对应的参数进行代码转译。

**额外注意的是`babel-preset-env`仅仅针对语法阶段的转译，比如转译箭头函数，`const/let`语法。针对一些`Api`或者`ES 6`内置模块的`polyfill`，`preset-env`是无法进行转译的**

##### `babel-preset-react`

通常我们在使用`React`中的`jsx`时，相信大家都明白实质上`jsx`最终会被编译称为`React.createElement()`方法。

`babel-preset-react`这个预设起到的就是将`jsx`进行转译的作用。

##### `babel-preset-typescript`

对于`TypeScript`代码，我们有两种方式去编译`TypeScript`代码成为`JavaScript`代码。

1.  使用`tsc`命令，结合`cli`命令行参数方式或者`tsconfig`配置文件进行编译`ts`代码。
2.  使用`babel`，通过`babel-preset-typescript`代码进行编译`ts`代码。



#### Babel的相关配置

关于`WebPack`中我们日常使用的`babel`相关配置主要涉及以下三个相关插件:

-   `babel-loader`
-   `babel-core`
-   `babel-preset-env`

**`webpack`中`loader`的本质就是一个函数，接受我们的源代码作为入参同时返回新的内容**


babel-loader`的本质就是一个函数，我们匹配到对应的`jsx?/tsx?`的文件交给`babel-loader


```js
function babelLoader (sourceCode,options) {
  // ..
  return targetCode
}
```

关于`options`，`babel-loader`支持直接通过`loader`的参数形式注入，同时也在`loader`函数内部通过读取`.babelrc/babel.config.js/`babel.config.json``等文件注入配置



**`babel-loader`仅仅是识别匹配文件和接受对应参数的函数，那么`babel`在编译代码过程中核心的库就是`@babel/core`这个库**



`babel-core`是`babel`最核心的一个编译库，他可以将我们的代码进行**词法分析--语法分析--语义分析**过程从而生成`AST`抽象语法树，从而对于“这棵树”的操作之后再通过编译称为新的代码

>`babel-core`其实相当于`@babel/parse`和`@babel/generator`这两个包的合体，接触过`js`编译的同学可能有了解`esprima`和`escodegen`这两个库，你可以将`babel-core`的作用理解称为这两个库的合体。

`babel-preset-env`在这里充当的就是这个作用：**告诉`babel`我需要以为什么样的规则进行代码转移**

#### Babel的编译流程

babel 是 source to source 的转换，整体编译流程分为三步：

- parse：通过 parser 把源码转成抽象语法树（AST）
- transform：遍历 AST，调用各种 transform 插件对 AST 进行增删改
- generate：把转换后的 AST 打印成目标代码，并生成 sourcemap

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201835440.webp)

##### 为什么 babel 的编译流程会分 parse、transform、generate 这 3 步呢？

源码是一串按照语法格式来组织的字符串，人能够认识，但是计算机并不认识，想让计算机认识就要转成一种数据结构，通过不同的对象来保存不同的数据，并且按照依赖关系组织起来，这种数据结构就是抽象语法树（abstract syntax tree）。之所以叫“抽象”语法树是因为数据结构中省略掉了一些无具体意义的分隔符比如 `;` `{` `}` 等。

有了 AST，计算机就能理解源码字符串的意思，而理解是能够转换的前提，所以编译的第一步需要把源码 parse 成 AST。

转成 AST 之后就可以通过修改 AST 的方式来修改代码，这一步会遍历 AST 并进行各种增删改，这一步也是 babel 最核心的部分。

经过转换以后的 AST 就是符合要求的代码，就可以再转回字符串，转回字符串的过程中把之前删掉的一些分隔符再加回来。

简单总结一下就是：**为了让计算机理解代码需要先对源码字符串进行 parse，生成 AST，把对代码的修改转为对 AST 的增删改，转换完 AST 之后再打印成目标代码字符串**

##### 这三步都做了什么？

###### parse

parse 阶段的目的是把源码字符串转换成机器能够理解的 AST，这个过程分为词法分析、语法分析。

比如 `let name = 'guang';` 这样一段源码，我们要先把它分成一个个不能细分的单词（token），也就是 `let`, `name`, `=`, `'guang'`，这个过程是词法分析，按照单词的构成规则来拆分字符串成单词。

之后要把 token 进行递归的组装，生成 AST，这个过程是语法分析，按照不同的语法结构，来把一组单词组合成对象，比如声明语句、赋值表达式等都有对应的 AST 节点。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201835693.webp)

###### transform

transform 阶段是对 parse 生成的 AST 的处理，会进行 AST 的遍历，遍历的过程中处理到不同的 AST 节点会调用注册的相应的 visitor 函数，visitor 函数里可以对 AST 节点进行增删改，返回新的 AST（可以指定是否继续遍历新生成的 AST）。这样遍历完一遍 AST 之后就完成了对代码的修改。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201842643.webp)

###### generate

generate 阶段会把 AST 打印成目标代码字符串，并且会生成 sourcemap。不同的 AST 对应的不同结构的字符串。比如 `IfStatement` 就可以打印成 `if(test) {}` 格式的代码。这样从 AST 根节点进行递归的字符串拼接，就可以生成目标代码的字符串。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201842150.webp)

sourcemap 记录了源码到目标代码的转换关系，通过它我们可以找到目标代码中每一个节点对应的源码位置，用于调试的时候把编译后的代码映射回源码，或者线上报错的时候把报错位置映射到源码。



#### `Babel`相关`polyfill`内容

关于`polyfill`，我们先来解释下何谓`polyfill`。

首先我们来理清楚这三个概念:

-   最新`ES`语法，比如：箭头函数，`let/const`。
-   最新`ES Api`，比如`Promise`
-   最新`ES`实例/静态方法，比如`String.prototype.include`

`babel-prest-env`仅仅只会转化最新的`es`语法，并不会转化对应的`Api`和实例方法,比如说`ES 6`中的`Array.from`静态方法。`babel`是不会转译这个方法的，如果想在低版本浏览器中识别并且运行`Array.from`方法达到我们的预期就需要额外引入`polyfill`进行在`Array`上添加实现这个方法

**语法层面的转化`preset-env`完全可以胜任。但是一些内置方法模块，仅仅通过`preset-env`的语法转化是无法进行识别转化的，所以就需要一系列类似”垫片“的工具进行补充实现这部分内容的低版本代码实现。这就是所谓的`polyfill`的作用**

针对于`polyfill`方法的内容，`babel`中涉及两个方面来解决：

-   `@babel/polyfill`
-   `@babel/runtime`
-   `@babel/plugin-transform-runtime`

##### `@babel/polyfill`

通过[babelPolyfill](https://link.juejin.cn?target=https%3A%2F%2Fbabeljs.io%2Fdocs%2Fen%2Fbabel-polyfill)通过往全局对象上添加属性以及直接修改内置对象的`Prototype`上添加方法实现`polyfill`。

比如说我们需要支持`String.prototype.include`，在引入`babelPolyfill`这个包之后，它会在全局`String`的原型对象上添加`include`方法从而支持我们的`Js Api`

我们说到这种方式本质上是往全局对象/内置对象上挂载属性，所以这种方式难免会造成全局污染

在`babel-preset-env`中存在一个`useBuiltIns`参数，这个参数决定了如何在`preset-env`中使用`@babel/polyfill`。

```json
{
    "presets": [
        ["@babel/preset-env", {
            "useBuiltIns": false
        }]
    ]
}
```

-   `useBuiltIns`--`"usage"`| `"entry"`| `false`

###### `false`

当我们使用`preset-env`传入`useBuiltIns`参数时候，默认为`false`。它表示仅仅会转化最新的`ES`语法，并不会转化任何`Api`和方法

###### `entry`

当传入`entry`时，需要我们在项目入口文件中手动引入一次`core-js`，它会根据我们配置的浏览器兼容性列表(`browserList`)然后**全量**引入不兼容的`polyfill`

>在我们使用`useBuiltIns:entry/usage`时，需要额外指定`core-js`这个参数。默认为使用`core-js 2.0`，所谓的`core-js`就是我们上文讲到的“垫片”的实现。它会实现一系列内置方法或者`Promise`等`Api`

###### `usage`

上边我们说到配置为`entry`时，`perset-env`会基于我们的浏览器兼容列表进行全量引入`polyfill`。所谓的全量引入比如说我们代码中仅仅使用了`Array.from`这个方法。但是`polyfill`并不仅仅会引入`Array.from`，同时也会引入`Promise`、`Array.prototype.include`等其他并未使用到的方法。这就会造成包中引入的体积太大了。

此时就引入出了我们的`useBuintIns:usage`配置。

当我们配置`useBuintIns:usage`时，会根据配置的浏览器兼容，以及代码中 **使用到的`Api` 进行引入`polyfill`按需添加。**

当使用`usage`时，我们不需要额外在项目入口中引入`polyfill`了，它会根据我们项目中使用到的进行按需引入。

#### `@babel/runtime`

上边我们讲到`@babel/polyfill`是存在污染全局变量的副作用，在实现`polyfill`时`Babel`还提供了另外一种方式去让我们实现这功能，那就是`@babel/runtime`。

简单来讲，`@babel/runtime`更像是一种**按需加载的解决方案**，比如哪里需要使用到`Promise`，`@babel/runtime`就会在他的文件顶部添加`import promise from 'babel-runtime/core-js/promise'`。

同时上边我们讲到对于`preset-env`的`useBuintIns`配置项，我们的`polyfill`是`preset-env`帮我们智能引入。

而`babel-runtime`则会将引入方式由智能完全交由我们自己，我们需要什么自己引入什么。

它的用法很简单，只要我们去安装`npm install --save @babel/runtime`后，在需要使用对应的`polyfill`的地方去单独引入就可以了

```js
// a.js 中需要使用Promise 我们需要手动引入对应的运行时polyfill
import Promise from 'babel-runtime/core-js/promise'

const promsies = new Promise()
```

`babel/runtime`你可以理解称为就是一个运行时“哪里需要引哪里”的工具库。

>   针对`babel/runtime`绝大多数情况下我们都会配合`@babel/plugin-transfrom-runtime`进行使用达到智能化`runtime`的`polyfill`引入

#### `@babel/plugin-transform-runtime`

##### `babel-runtime`存在的问题

`babel-runtime`在我们手动引入一些`polyfill`的时候，它会给我们的代码中注入一些类似`_extend()， classCallCheck()`之类的工具函数，这些工具函数的代码会包含在编译后的每个文件中，比如：

```js
class Circle {}
// babel-runtime 编译Class需要借助_classCallCheck这个工具函数
function _classCallCheck(instance, Constructor) { //... } 
var Circle = function Circle() { _classCallCheck(this, Circle); };
```

如果我们项目中存在多个文件使用了`class`，那么无疑在每个文件中注入这样一段冗余重复的工具函数将是一种灾难。

所以针对上述提到的两个问题:

-   `babel-runtime`无法做到智能化分析，需要我们手动引入。
-   `babel-runtime`编译过程中会重复生成冗余代码。

我们就要引入我们的主角`@babel/plugin-transform-runtime`。

##### `@babel/plugin-transform-runtime`作用

`@babel/plugin-transform-runtime`插件的作用恰恰就是为了解决上述我们提到的`run-time`存在的问题而提出的插件。

-   `babel-runtime`无法做到智能化分析，需要我们手动引入。

`@babel/plugin-transform-runtime`插件会智能化的分析我们的项目中所使用到需要转译的`js`代码，从而实现模块化从`babel-runtime`中引入所需的`polyfill`实现。

-   `babel-runtime`编译过程中会重复生成冗余代码。

`@babel/plugin-transform-runtime`插件提供了一个`helpers`参数。具体你可以在[这里查阅它的所有配置参数](https://link.juejin.cn?target=https%3A%2F%2Fbabeljs.io%2Fdocs%2Fen%2Fbabel-plugin-transform-runtime%23helpers)。

这个`helpers`参数开启后可以将上边提到编译阶段重复的工具函数，比如`classCallCheck, extends`等代码转化称为`require`语句。此时，这些工具函数就不会重复的出现在使用中的模块中了。比如这样：

```js
// @babel/plugin-transform-runtime会将工具函数转化为require语句进行引入
// 而非runtime那样直接将工具模块代码注入到模块中
var _classCallCheck = require("@babel/runtime/helpers/classCallCheck"); 
var Circle = function Circle() { _classCallCheck(this, Circle); };
```

```js
{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": false,
        "helpers": true,
        "regenerator": true,
        "version": "7.0.0-beta.0"
      }
    ]
  ]
}

```

在`babel`中实现`polyfill`主要有两种方式：

-   一种是通过`@babel/polyfill`配合`preset-env`去使用，这种方式可能会存在污染全局作用域。
-   一种是通过`@babel/runtime`配合`@babel/plugin-transform-runtime`去使用，这种方式并不会污染作用域。
-   全局引入会污染全局作用域，但是相对于局部引入来说。它会增加很多额外的引入语句，增加包体积

在开发类库时遵守不污染全局为首先使用`@babel/plugin-transform-runtime`而在业务开发中使用`@babel/polyfill`

babel-runtime 是为了减少重复代码而生的。 babel生成的代码，可能会用到一些_extend()， classCallCheck() 之类的工具函数，默认情况下，这些工具函数的代码会包含在编译后的文件中。如果存在多个文件，那每个文件都有可能含有一份重复的代码。

babel-runtime插件能够将这些工具函数的代码转换成require语句，指向为对babel-runtime的引用，如 require('babel-runtime/helpers/classCallCheck'). 这样， classCallCheck的代码就不需要在每个文件中都存在了。

大多数JavaScript Parser遵循 `estree` 规范，Babel 最初基于 `acorn` 项目(轻量级现代 JavaScript 解析器) Babel大概分为三大部分：

- 解析：将代码转换成 AST
  - 词法分析：将代码(字符串)分割为token流，即语法单元成的数组
  - 语法分析：分析token流(上面生成的数组)并生成 AST
- 转换：访问 AST 的节点进行变换操作生产新的 AST
  - Taro就是利用 babel 完成的小程序语法转换
- 生成：以新的 AST 为基础生成代码

### 12.vite和webpack

如果应用过于复杂，使用Webpack 的开发过程会出现以下问题

1.  Webpack Dev Server 冷启动时间会比较长
2.  Webpack HMR 热更新的反应速度比较慢

vite的特点

1.  轻量
2.  按需打包
3.  HMR (热渲染依赖）

webpack dev server 在启动时需要先build一遍，而这个过程需要消耗很多时间

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201843513.webp)

而Vite 不同的是 执行vite serve 时，内部直接启动了web Server, 并不会先编译所有的代码文件。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201843092.webp)

但是webpack 这类工具的做法是将所有模块提前编译、打包进bundle里，换句话说，不管模块是否会被执行，都要被编译和打包到bundle里。随着项目越来越大，打包后的bundle也越来越大，打包的速度自然会越来越慢。

#### webpack打包过程

1.识别入口文件

2.通过逐层识别模块依赖。（Commonjs、amd或者es6的import，webpack都会对其进行分析。来获取代码的依赖）

3.webpack做的就是分析代码。转换代码，编译代码，输出代码

4.最终形成打包后的代码

#### webpack打包原理

1.先逐级递归识别依赖，构建依赖图谱

2.将代码转化成AST抽象语法树

3.在AST阶段中去处理代码

4.把AST抽象语法树变成浏览器可以识别的代码， 然后输出

重点:这里需要递归识别依赖，构建依赖图谱。图谱对象就是类似下面这种

```js
{ './app.js':
   { dependencies: { './test1.js': './test1.js' },
     code:
      '"use strict";\n\nvar _test = _interopRequireDefault(require("./test1.js"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }\n\nconsole.log(test
1);' },
  './test1.js':
   { dependencies: { './test2.js': './test2.js' },
     code:
      '"use strict";\n\nvar _test = _interopRequireDefault(require("./test2.js"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }\n\nconsole.log('th
is is test1.js ', _test["default"]);' },
  './test2.js':
   { dependencies: {},
     code:
      '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports["default"] = void 0;\n\nfunction test2() {\n  console.log('this is test2 ');\n}\n\nvar _default = tes
t2;\nexports["default"] = _default;' } }
```

#### vite原理

当声明一个 script 标签类型为 module 时

如：

```js
浏览器就会像服务器发起一个GET

http://localhost:3000/src/main.js请求main.js文件：
 
// /src/main.js:
import { createApp } from 'vue'
import App from './App.vue'
createApp(App).mount('#app')
浏览器请求到了main.js文件，检测到内部含有import引入的包，又会对其内部的 import 引用发起 HTTP 请求获取模块的内容文件

如：GET http://localhost:3000/@modules/vue.js

如：GET http://localhost:3000/src/App.vue
```

Vite 的主要功能就是通过劫持浏览器的这些请求，并在后端进行相应的处理将项目中使用的文件通过简单的分解与整合，然后再返回给浏览器,Vite整个过程中没有对文件进行打包编译，所以其运行速度比原始的webpack开发编译速度快出许多！

#### webpack缺点1.缓慢的服务器启动

当冷启动开发服务器时，基于打包器的方式是在提供服务前去急切地抓取和构建你的整个应用。

#### vite改进

Vite 通过在一开始将应用中的模块区分为 依赖 和 源码 两类，改进了开发服务器启动时间。依赖 大多为纯 JavaScript 并在开发时不会变动。一些较大的依赖（例如有上百个模块的组件库）处理的代价也很高。依赖也通常会以某些方式（例如 ESM 或者 CommonJS）被拆分到大量小模块中。Vite 将会使用 esbuild 预构建依赖。Esbuild 使用 Go 编写，并且比以 JavaScript 编写的打包器预构建依赖快 10-100 倍。

源码 通常包含一些并非直接是 JavaScript 的文件，需要转换（例如 JSX，CSS 或者 Vue/Svelte 组件），时常会被编辑。同时，并不是所有的源码都需要同时被加载。（例如基于路由拆分的代码模块）。Vite 以 原生 ESM 方式服务源码。这实际上是让浏览器接管了打包程序的部分工作：Vite 只需要在浏览器请求源码时进行转换并按需提供源码。根据情景动态导入的代码，即只在当前屏幕上实际使用时才会被处理。

#### webpack缺点2.使用的是node.js去实现

#### vite改进

Vite 将会使用 esbuild 预构建依赖。Esbuild 使用 Go 编写，并且比以 Node.js 编写的打包器预构建依赖快 10-100 倍。

#### webpack致命缺点3.热更新效率低下

当基于打包器启动时，编辑文件后将重新构建文件本身。显然我们不应该重新构建整个包，因为这样更新速度会随着应用体积增长而直线下降。
一些打包器的开发服务器将构建内容存入内存，这样它们只需要在文件更改时使模块图的一部分失活[1]，但它也仍需要整个重新构建并重载页面。这样代价很高，并且重新加载页面会消除应用的当前状态，所以打包器支持了动态模块热重载（HMR）：允许一个模块 “热替换” 它自己，而对页面其余部分没有影响。这大大改进了开发体验 - 然而，在实践中我们发现，即使是 HMR 更新速度也会随着应用规模的增长而显著下降。

#### vite改进

在 Vite 中，HMR 是在原生 ESM 上执行的。当编辑一个文件时，Vite 只需要精确地使已编辑的模块与其最近的 HMR 边界之间的链失效（大多数时候只需要模块本身），使 HMR 更新始终快速，无论应用的大小。Vite 同时利用 HTTP 头来加速整个页面的重新加载（再次让浏览器为我们做更多事情）：源码模块的请求会根据 304 Not Modified 进行协商缓存，而依赖模块请求则会通过 Cache-Control: max-age=31536000,immutable 进行强缓存，因此一旦被缓存它们将不需要再次请求。

#### vite缺点1

1.生态，生态，生态不如webpack，wepback牛逼之处在于loader和plugin非常丰富,不过我认为生态只是时间问题，现在的vite,更像是当时刚出来的M1芯片Mac，我当时非常看好M1的Mac，毫不犹豫买了，现在也没什么问题

#### vite缺点2

1.prod环境的构建，目前用的Rollup，原因在于esbuild对于css和代码分割不是很友好

#### vite缺点3

1.还没有被大规模使用,很多问题或者诉求没有真正暴露出来，vite真正崛起那一天，是跟vue3有关系的,当vue3广泛开始使用在生产环境的时候，vite也就大概率意味着被大家慢慢开始接受了

#### Vite快速原因

Vite这么快，是利用了ES Modules嘛？这只是其中的一部分。

Vite在冷启动的时候，将代码分为依赖和源码两部分，源码部分通常会使用ESModules或者CommonJS拆分到大量小模块中，而对于依赖部分，Vite使用Esbuild对依赖进行预构建。 而Esbuild有以下优势。

1.  语言优势，Esbuild使用Go语言开发，相对于JavaScript，Go语言是一种编译型语言，在编译阶段就已经将源码转译为机器码。

![image.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201843138.webp) 2. 多线程，Rollup和webpack都没有使用多线程的能力，而Esbuild在算法上进行了大量的优化，充分的利用了多CPU的优势。

以上这些原因，导致Esbuild构建模块的速度比webpack快到10-100倍。

其次，对于源码部分，Vite省略了webpack遍历打包的时间，这部分工作让浏览器来执行，基本没有打包的时间，Vite只是在浏览器发送对模块的请求时，拦截请求，对源码进行转换后提供给浏览器，实现了源码的动态导入。

以我们上面的读技术文章的例子来看，我们不关心webpack，Rollup和Parcel相关链接的内容是什么，这些内容不影响我们阅读当前的文章，只有当我们需要使用到相关链接内容的时候，我们才去点击链接查看对应的内容。

<img src="https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201843429.webp" alt="image.png" style="zoom:150%;" />

这两方面加起来，让Vite的冷启动快到不可思议。

而在热更新方面，基于已经启动的服务，我们不应该对所有的改动都完全重构打包项目，我们只需要对失活的模块进行热重载，而不影响页面的其他部分，但webpack依然会随着项目规模的扩大而变得更慢，因为webpack包含了完整的打包项目，对失活模块的替换和查找都会因为体积的增大而更加耗时。

相比之下，Vite的热更新也是在原生的ESM上进行的，热更新的范围只在当前模块上，无论项目的规模多大，也只会加载当前使用到的模块，编辑一般也是在当前加载的模块上进行，控制住了体积，热更新的速度自然不受影响。

我们已经从冷启动，热更新，使用的语言方面，解释了Vite为什么会这么快，但是Vite也存在一些短板。

1.  Vite的生态与webpack相差甚远，webpack的loader和plugin已经非常丰富，而Vite在这方面还缺少积累。
2.  Vite开发环境很快，但生产环境还达不到如此惊艳的程度，Vite生产环境使用Rollup进行构建的，还是需要打包的，虽然在研发环境下，Vite因为不需要打包，快得惊人，但相应的也增加了网络请求的次数，而在生产环境使用ESM效率仍然低下，综合考虑，在生产环境依然需要进行打包，而Esbuild对css的处理和代码分割并不友好，最终选择了Rollup。
3.  Vite作为新出来的构建工具，还没有经历过大量的项目考验，“实战经验”不够成熟，可能会存在没有发现的问题。

>   当我们开始构建越来越大型的应用时，需要处理的 JavaScript 代码量也呈指数级增长。包含数千个模块的大型项目相当普遍。我们开始遇到性能瓶颈 —— 使用 JavaScript 开发的工具通常需要很长时间（甚至是几分钟！）才能启动开发服务器，即使使用 HMR，文件修改后的效果也需要几秒钟才能在浏览器中反映出来。如此循环往复，迟钝的反馈会极大地影响开发者的开发效率和幸福感。
>
>   Vite 旨在利用生态系统中的新进展解决上述问题：浏览器开始原生支持 ES 模块，且越来越多 JavaScript 工具使用编译型语言编写。

### 13.如何进行css的抽离

![在这里插入图片描述](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201843447.png)

**直接引用样式文件，没有使用任何相关插件时，会出现`css in js`的情况，即打包到了一块**

**css代码进行分割和压缩**

-   `mini-css-extract-plugin`：分割
-   `optimize-css-assets-webpack-plugin`： 压缩

plugins:

```js
// 抽离 css 文件
        new MiniCssExtractPlugin({
            filename: 'css/main.[contentHash:8].css'
        })
```

style-loader的作用是将css挂载到页面上，而MiniCssExtractPlugin.loader是为了将css从页面上抽取出来作为文件。
注意loader的调用顺序： 从下往上，从右往左
注意tree shaking配置需要忽略掉.css文件，否则有可能打包不到样式文件
“sideEffects”: [
“*.css”
],

```js
 // 抽离 css
            {
                test: /\.css$/,
                loader: [
                    MiniCssExtractPlugin.loader,  // 注意，这里不再用 style-loader
                    'css-loader',
                    'postcss-loader'
                ]
            },
            // 抽离 less --> css
            {
                test: /\.less$/,
                loader: [
                    MiniCssExtractPlugin.loader,  // 注意，这里不再用 style-loader
                    'css-loader',
                    'less-loader',
                    'postcss-loader'
                ]
            }
```

`optimize-css-assets-webpack-plugin`可以对css进行压缩

```js
optimization: {
		// css样式的代码合并
		minimizer: [new OptimizeCSSAssetsPlugin({})],
		usedExports: true, // tree shaking
		splitChunks: {
	      chunks: 'all'
	    }
	},
```

### 14.如何实现多入口

设置path.js文件  

```js
const path = require('path')

const srcPath = path.join(__dirname, '..', 'src')
const distPath = path.join(__dirname, '..', 'dist')

module.exports = {
    srcPath,
    distPath
}
```



设置多个entry

```javascript
entry: {
        index: path.join(srcPath, 'index.js'),
        other: path.join(srcPath, 'other.js')
    },
```



```js

        // 多入口 - 生成 index.html
        new HtmlWebpackPlugin({
            template: path.join(srcPath, 'index.html'),
            filename: 'index.html',
            // chunks 表示该页面要引用哪些 chunk （即上面的 index 和 other），默认全部引用
            chunks: ['index']  // 只引用 index.js
        }),
        // 多入口 - 生成 other.html
        new HtmlWebpackPlugin({
            template: path.join(srcPath, 'other.html'),
            filename: 'other.html',
            chunks: ['other']  // 只引用 other.js
        })
```

chunks 表示该页面要引用哪些 chunk （即上面的 index 和 other），默认全部引用

​     `chunks: ['index', 'vendor', 'common']`     要考虑代码分割

每个页面css抽离也可以

到了多页程序，因为存在多个入口文件以及对应的多个页面，每个页面都有自己的 `css`样式，所以需要为每个页面各自配置

```js
plugins: [
	new ExtractTextPlugin('index/[name].[contenthash].css'),
	new ExtractTextPlugin('other/[name].[contenthash].css')
]
```

### 15.加速打包速度

#### happyPack 开启多进程打包

```js
// happyPack 开启多进程打包
        new HappyPack({
            // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
            id: 'babel',
            // 如何处理 .js 文件，用法和 Loader 配置中一样
            loaders: ['babel-loader?cacheDirectory']
        }),
```

#### 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码

```javascript
// 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
        new ParallelUglifyPlugin({
            // 传递给 UglifyJS 的参数
            // （还是使用 UglifyJS 压缩，只不过帮助开启了多进程）
            uglifyJS: {
                output: {
                    beautify: false, // 最紧凑的输出
                    comments: false, // 删除所有的注释
                },
                compress: {
                    // 删除所有的 `console` 语句，可以兼容ie浏览器
                    drop_console: true,
                    // 内嵌定义了但是只用到一次的变量
                    collapse_vars: true,
                    // 提取出出现多次但是没有定义成变量去引用的静态值
                    reduce_vars: true,
                }
            }
        })
```

#### `IgnorePlugin`避免引入无用模块

以时间处理库`moment`的使用为例进行学习和理解

默认会引入所有语言的js代码，代码会过大，只引入中文

在插件中使用`webpack.IgnorePlugin`匹配到`moment`下的`locale`语言包，进行忽略处理，即不引入所有的`locale`下的语言包。

在需要使用到具体的语言时，在代码中引入具体的语言包即可

#### noParse的使用

一般使用`.min.js`结尾的文件，都是已经经过模块化处理的，那么这个时候就没必要在进行loder或者webpack分析了，noParer的字面意思也是不再解析。

##### ignorePlugin和noParse的对比

-   `IgnorePlugin` 直接就将符合匹配条件的模块，不再进行引入，代码中没有。
-   `noParse` 该引入还是会引入，只是不参与loader或webpack的解析及打包

##### 使用DllPlugin

![在这里插入图片描述](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201843616.png)

就是通过将引入的模块，打到一个dll文件下，生成模块包和整体包产物文件的对应关系，再次打包时，如果能在映射关系中找到该模块，便直接使用产物中的包，不在进行模块分割打包，以此来提高Webpack的打包速度。

开发环境使用webpack-dev-server，不会生成dist目录，而是会把产物放到内存之中

#### **优化打包构建速度 - 开发体验和效率**

#### **优化babel-loader**

在babel-loader后加一个?cacheDirectory，开启babel-loader的缓存。这样如果es6代码没有改，就不会再重新编译

还有就是通过include确定babel编译范围，通常为src。（排除node_modules）

#### **IgnorePlugin**

这个plugin作用是避免引入无用模块。比如我们通常会使用moment.js，但默认会引入所有语言的js代码，代码过大。可能只需要引入中文和英文的模块，这个插件就可以帮助。

那么就可以在业务代码中手动引入中文和英文的语言包，然后再webpack配置中写入

```js
new webpack.IgnorePlugin(/\.\/locale/, /moment/),
```

忽略掉moment里的locale语言包，这样就能减少无用的模块引入。

#### **noParse**

避免重复打包。社区中常有的min.js通常都是已经打包了的，因此没必要再次打包，在module.noParse中配置不需要打包的文件即可。只是react.min.js不能这么搞，这个没有采用模块化，还是需要打包的。

和Ignore的区别是，Ignore直接不引入，代码中没有。但noParse会引入，但不打包。都能够提升构建速度，Ignore还能够优化线上的性能。

#### **happyPack多进程打包**

因为js是单线程的，所以webpack实际上也是进行的单线程打包。所以如果我们能够开启多进程进行打包，那么就能够大幅提高构建速度，happyPack就能够做到这个

注：这是个plugin

比如要将babel的解析放在新进程中，那么module.rule中对js的解析需要改成：

```js
            {
                test: /\.js$/,
                // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
                use: ['happypack/loader?id=babel'],
                include: srcPath,
                // exclude: /node_modules/
            },
```

然后需要在plugin中配置babel的happyPack实例：

```js
        new HappyPack({
            // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
            id: 'babel',
            // 如何处理 .js 文件，用法和 Loader 配置中一样
            loaders: ['babel-loader?cacheDirectory']
        }),
```

#### **ParallelUglifyPlugin多进程压缩JS**

webpack本身内置了uglify压缩JS，但压缩JS本身是比较高成本的，这里也可以进行多进程开启。
直接在Plugin中实例化就行。根据配置要求进行配置。

当然，关于开启多进程是否需要，并不是一定需要的。

如果项目较大，打包较慢，开启多进程能够提高速度；但开启多进程本身就需要成本和时间，小项目没必要配置，反而会造成打包时间增加。

#### **热更新HotModuleReplacementPlugin**

自动刷新是速度比较慢，且状态会丢失。
热更新的话，则不会刷新，状态不丢失，且新代码能够立刻生效。

主要引入HotModuleReplacementPlugin即可。
首先entry需要修改：

```js
entry: {
    // index: path.join(srcPath, 'index.js'),
    index: [
        'webpack-dev-server/client?http://localhost:8080/',
        'webpack/hot/dev-server',
        path.join(srcPath, 'index.js')
    ],
    other: path.join(srcPath, 'other.js')
},
```

Plugin中实例化即可，并在devServer中设置hot为true即可。

最后，JS代码需要还需要判断一下是否是热更新，注册监听范围

```js
if (module.hot) {
    module.hot.accept(['./math'), () => {});
}
```

所以热更新有成本，需要手动注册。

实际使用中没有遇见需要这样的，通常只用了css的逻辑（默认支持热更新）。

#### **DllPlugin动态链接库插件**

前端框架通常会使用vue、React，体积大，构建慢。但是比较稳定，开发情况下不会经常升级版本。

因此，这种内容同一个版本只需要构建一次就可以了，没必要每次都重新构建。

webpack已经内置了DllPlugin,主要包含两个插件：

DllPlugin：打包出dll文件，先进行一遍预打包，生成dll文件

DllReferencePlugin：在开发环境使用dll文件。

一般需要单独定义一个dll.config.js

```js
output: {
    path: path.join(__dirname, '../build'), // 放在项目的/build目录下面
    filename: '[name].dll.js', // 打包文件的名字
    library: '[name]_library' // 可选 暴露出的全局变量名
    // vendor.dll.js中暴露出的全局变量名。
    // 主要是给DllPlugin中的name使用，
    // 故这里需要和webpack.DllPlugin中的`name: '[name]_library',`保持一致。
},

plugin

    new webpack.DllPlugin({
      path: path.join(__dirname, '../build', '[name]_manifest.json'), // 生成上文说到清单文件，放在当前build文件下面，这个看你自己想放哪里了。
      name: '[name]_library',
      context: __dirname,
    }),
```

然后定义dll的命令，进行dll打包

最后输出了dll和manifest文件。dll文件就是所有打包的文件内容，而manifest的作用就是索引，负责引导实际对于dll里模块的引用。

实际应用的话，就是需要在dev的html中去进行script进行引用。这里就可以用dllReferencePlugin插件去引用manifest文件，用AddAssetHtmlPlugin引用dll文件即可

### 16.如何优化产出代码

[webpack性能优化](https://zhuanlan.zhihu.com/p/403182979)

核心：让代码体积更小、合理分包，不重复加载、速度更快，内存使用更少

#### **小图片用base64的编码**

使用url-loader，对小于xkb的图片做base64格式进行产出，没有必要再做一次网络请求

#### **bundle需要加hash**

根据文件内容算hash值，客户端可以实现缓存管理使用。js代码如果没有变化，那么即便再次上线也能复用没变的bundle块

#### **懒加载**

import() 使用时，webpack会自动进行单独打包，生成0.js这样的打包文件。

#### **提取公共代码**

一些通用代码和第三方应该被抽离。在optimization里的splitChunks进行设置

#### **IngorePlugin**

减少打包代码内容

#### **使用cdn加速**

使用cdn加速，修改output里的publicPath，能够修改所有静态文件url的前缀
当然需要在部署上线脚本里加上上传到cdn的操作

图片则在图片的url-loader里加上publicPath就行

#### **使用production**

在mode中使用production，会自动开启代码压缩，减少代码体积

Vue\React等成熟的库会自动删掉调试代码比如开发环境的warning

其次production还会开启Tree Shaking：可以移除 JavaScript 上下文中的未引用代码，删掉用不着的代码，能够有效减少 JS 代码文件的大小。

假设我们不使用 production mode，而是用 development mode，那么我们需要在配置文件中新增：

```js
module.exports = {
  mode: 'development',
  //...
  optimization: { 
    useExports: true, // 模块内未使用的部分不进行导出
  },
}
```

必须用ES6 module才能让tree shaking生效，commonjs不行

仅仅因为 Webpack 看不到一段正在使用的代码，并不意味着它可以安全地进行 tree-shaking。有些模块导入，只要被引入，就会对应用程序产生重要的影响。一个很好的例子就是全局样式表，或者设置全局配置的JavaScript 文件。
Webpack 认为这样的文件有“副作用”。具有副作用的文件不应该做 tree-shaking，因为这将破坏整个应用程序。Webpack 的设计者清楚地认识到不知道哪些文件有副作用的情况下打包代码的风险，因此默认地将所有代码视为有副作用。这可以保护你免于删除必要的文件，但这意味着 Webpack 的默认行为实际上是不进行 tree-shaking。
幸运的是，我们可以配置我们的项目，告诉 Webpack 它是没有副作用的，可以进行 tree-shaking。

package.json 有一个特殊的属性 sideEffects，就是为此而存在的。它有三个可能的值：
true 是默认值，如果不指定其他值的话。这意味着所有的文件都有副作用，也就是没有一个文件可以 tree-shaking。
false 告诉 Webpack 没有文件有副作用，所有文件都可以 tree-shaking。
第三个值 […] 是文件路径数组。它告诉 webpack，除了数组中包含的文件外，你的任何文件都没有副作用。因此，除了指定的文件之外，其他文件都可以安全地进行 tree-shaking。

#### **使用Scope Hosting**

当存在多个文件时，实际上在webpack中会打包成多个函数。但文件越多，函数越多，函数越多占用内存越多（作用域）。
是否可以把打包后的函数进行合并？这就是Scope Hosting的作用：代码体积更小、创建函数作用域更少、代码可读性更少

引用ModuleConcatenationPlugin插件并使用，代价是必须要用ES6模块化组织代码才能用这个效果，所以针对NPM中的第三方模块优先采用 jsnext:main 中指向ES6模块化语法的文件

配置resolve：

```js
resolve: {
    mainFields: ['jsnext:main', 'browser', 'main']
}
```

#### 对js压缩

压缩js用`terser-webpack-plugin`插件，可以优化和压缩JS资源

插件配置：

```js
module.exports = {
    ...
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin(),
        ],
    },
}
```

为什么不使用uglifyjs-webpack-plugin？

不在使用uglifyjs-webpack-plugin，因为前者支持ES6，后者不支持，所以现在都使用前者

### 17.代码分割

拆分原则是：

-   业务代码和第三方库分离打包，实现代码分割；
-   业务代码中的公共业务模块提取打包到一个模块；
-   第三方库最好也不要全部打包到一个文件中，因为第三方库加起来通常会很大，我会把一些特别大的库分别独立打包，剩下的加起来如果还很大，就把它按照一定大小切割成若干模块

optimization.splitChunks

-   `cacheGroups`是`splitChunks`配置的核心，对代码的拆分规则全在`cacheGroups`缓存组里配置。缓存组的每一个属性都是一个配置规则，我这里给他的`default`属性进行了配置，属性名可以不叫default可以自己定

-   name：提取出来的公共模块将会以这个来命名，可以不配置，如果不配置，就会生成默认的文件名，大致格式是`index～a.js`这样的。

-   chunks：指定哪些类型的chunk参与拆分，值可以是string可以是函数。如果是string，可以是这个三个值之一：`all`, `async`, `initial`，`all` 代表所有模块，`async`代表只管异步加载的, `initial`代表初始化时就能获取的模块。如果是函数，则可以根据chunk参数的name等属性进行更细致的筛选。
-   `splitChunks`是自带默认配置的，而缓存组默认会继承这些配置，其中有个`minChunks`属性：
    -   它控制的是每个模块什么时候被抽离出去：当模块被不同entry引用的次数大于等于这个配置值时，才会被抽离出去。
    -   它的默认值是1。也就是任何模块都会被抽离出去（入口模块其实也会被webpack引入一次）

我希望公共模块`common.js`中，业务代码和第三方模块jquery能够剥离开来。

我们需要再添加一个拆分规则。

```js
//webpack.config.js

optimization: {
    splitChunks: {
    	minSize: 30,  //提取出的chunk的最小大小
        cacheGroups: {
            default: {
                name: 'common',
                chunks: 'initial',
                minChunks: 2,  //模块被引用2次以上的才抽离
                priority: -20
            },
            vendors: {  //拆分第三方库（通过npm|yarn安装的库）
            	test: /[\\/]node_modules[\\/]/,
                name: 'vendor',
                chunks: 'initial',
                priority: -10
            }
        }
    }
}
```

我给cacheGroups添加了一个vendors属性（属性名可以自己取，只要不跟缓存组下其他定义过的属性同名就行，否则后面的拆分规则会把前面的配置覆盖掉）



### 18.webpack对CommonJS的实现

因为低版本的浏览器对于模块化是不支持的，所以在前端工程化的今天，我们需要通过一些工具来帮助我们转换我们的模块化代码，借此来运行在低版本的浏览器上（目前谷歌等一些高版本的浏览器已经支持了`es6Module`）。我们来看下`webpack`是如何实现`CommonJS`规范的。

首先，我们先执行如下命令，新起一个`webpack-demo`的项目。

```bash
mkdir webpack-demo && cd webpack-demo
npm init -y
npm install webpack webpack-cli --save-dev

```

然后在项目里创建一个`src`文件夹，里面新建一个`index.js`和`module1.js`两个文件：

**index.js：**

```js
const module1 = require("./module1");

const num = module1.status + 12;

module.exports = {
  num,
};
```

**module1.js：**

```js
const status = 0;

module.exports = {
  status,
};
```

然后我们再配置`webpack`，新创建一个`webpack.config.js`文件在根目录：

**webpack.config.js**

```lua
var path = require("path");

module.exports = {
  entry: path.join(__dirname, "./src/index.js"),
  output: {
    path: path.join(__dirname, "dist"),
    filename: "index.js",
  },
  mode: "development",
};
```

这里要注意配置`mode: "development"`，因为我们需要查看打包后的具体的内容，不然`webpack`会帮我们压缩代码。

到目前为止一切准备就绪，我们在根目录执行`webpack`命令：

![image.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201844678.webp)

可以看到生成了一个`dist`文件夹，里面有一个`index.js`的文件，让我们来看看它究竟是什么。因为打包后的代码粗略的看上去，非常的凌乱，所以我这里把大部分注释先给去掉。我们将代码分为三部分来看：

![image.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201844432.webp)

#### 第一部分

```js
/***********************************第一部分*************************************/
var __webpack_modules__ = {
    "./src/index.js": ( module, __unused_webpack_exports, __webpack_require__) => {
      eval(
        'const module1 = __webpack_require__(/*! ./module1 */ "./src/module1.js");\r\n\r\nconst num = module1.status + 12;\r\n\r\nmodule.exports = {\r\n  num,\r\n};\r\n\n\n//# sourceURL=webpack://webpack-demo/./src/index.js?'
      );
    },
    "./src/module1.js": (module) => {
      eval(
        "const status = 0;\r\n\r\nmodule.exports = {\r\n  status,\r\n};\r\n\n\n//# sourceURL=webpack://webpack-demo/./src/module1.js?"
      );
    },
  };
```

首先，我们可以看到它是一个`自执行函数`，能看到有一个`__webpack_modules__`的对象，他就是我们写的所有的模块（上面的`index.js`和`module1.js`）的一个集合。这个对象的键名是`引用路径`，值则是一个函数，这个函数有三个入参`module`、`__unused_webpack_exports`、`__webpack_require__`，函数体里面则是一个`eval`函数执行了我们写的代码。其实我们的js文件，被`webpack`加工打包了一层函数上去：

![image.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201844994.webp)

`webpack`会把我们写的所有的**js文件打包成一个函数**，这样我们的js文件就是在一个**函数作用域下面的，不会污染全局环境**。再在打包之后，赋值给一个`__webpack_modules__`对象，把所有的模块引入。

#### 第二部分

```java
  /***********************************第二部分*************************************/
  // 缓存对象
  var __webpack_module_cache__ = {};

  // 导出函数 - 如果缓存对象中已经缓存过，则返回缓存对象中的模块。否则执行模块代码，存入缓存再返回
  function __webpack_require__(moduleId) {
    // 检查在缓存中是否存在该模块的缓存，如果有则直接返回
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    // 创造一个新的module（并且存入缓存对象中）
    var module = (__webpack_module_cache__[moduleId] = {
      exports: {},
    });

    // 如果没有缓存则执行模块代码
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    // 返回模块
    return module.exports;
  }
复制代码
```

首先是一个`__webpack_module_cache__`，它是一个缓存对象，具体是干啥的下面再说，让我们继续往下看。

接下来就是一个`__webpack_require__`函数，这个就是上面的三个入参之一的`require`函数。它的具体作用就是：**先检查缓存对象`__webpack_module_cache__`中是否存在被require的模块，如果存在就直接使用缓存，如果不存在则调用一遍第一部分的`__webpack_modules__`集合中的此模块，并存入一份到缓存中，最后返回被require的模块的导出。** 而前两个参数则是缓存对象的引用地址，我们在模块最后的`module.exports`会赋值到该对象上，从而被缓存对象给记录下来。

我们现在知道了：我们写的所有的模块，**如果被`require`给调用过，就会被复制一份存入缓存，之后一直会调用缓存中的该模块**。值得注意的是，如果我们的模块没有被引用过，`webpack`则不会把这个模块给引入到`__webpack_modules__`这个集合中。

#### 第三部分

```js
/***********************************第三部分*************************************/
var __webpack_exports__ = __webpack_require__("./src/index.js");
```

最后的语句就是执行一遍`require`函数，调用我们在配置文件中配置的入口文件，从而执行整个代码逻辑。

`webpack`对于`CommonJS`的实现是基于函数作用域的，它把我们写的模块代码（js文件）给包了一层函数，通过自己的`__webpack_require__`方法来实现`CommonJS`的require。在模块被引用时，会把该模块的`module.exports`放入一个缓存对象中，下次再引用这个模块就直接从缓存中读取。而它一开始加载入口函数，在一开始就会把所有被用到的模块放入缓存中，这也正是`webpack`编译、打包时间慢的原因。因为`webpack`选择了一开始就把所有的模块进行加载，如果项目过大，加载的模块越多，时间也就越长。

`CommonJS`的实现我们已经知道了，他的`require`是在此模块加载完成后才会执行下面的语句，除非已经做过了缓存。所以它的导入是同步的，在浏览器环境里并不合适，所以一种异步加载的模块化规范来了

### 19.webpack对ES6Module的实现

现在谷歌高版本的浏览器已经支持了此模块化方案，可以通过`script`标签加上`type="module"`来实现，但是还是有很多的浏览器不支持`ES6`的模块化方案，所以我们还是需要借助`webpack`等工具来实现。`webpack`支持多种模块化方案，可以把ES6的模块化代码转换成低版本浏览器兼容的模块化代码

#### 具体实现

这边我们改变一下上面例子中的两个文件，把他们改成`ES6Module`的写法

**index.js：**

```js
import module1 from "./module1";

module1.add(1, 2);
```

**module1.js：**

```javascript
function add(a, b) {
  return a + b;
}

export default {
  add,
};
```

然后我们再执行`webpack`命令对其进行打包操作，可以看到`dist`又重新生成了一个`index.js`文件。我们会发现，跟`CommonJS`打包生成的`index.js`的组成部分来看，除了一二三部分，它额外多了一部分：

```javascript
/* webpack/runtime/define property getters */
// 这是一个核心函数，给导出对象module.exports扩展属性用
(() => {
	// define getter functions for harmony exports
	__webpack_require__.d = (exports, definition) => {
		for(var key in definition) {
			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
			}
		}
	};
})();

/* webpack/runtime/hasOwnProperty shorthand */
// 此函数用于判断对象中是否存在某个属性
(() => {
	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
})();

/* webpack/runtime/make namespace object */
// 此函数用于向es6模块的导出对象module.exports标记一个 __esModule 属性
(() => {
	// define __esModule on exports
	__webpack_require__.r = (exports) => {
		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
		}
		Object.defineProperty(exports, '__esModule', { value: true });
	};
})();
```

我们看多出来的部分，了解一下它的用法：

1. `__webpack_require__.d`：这是一个核心函数，给导出对象`module.exports`扩展属性用，说白了就是给导出对象赋值用的。
2. `__webpack_require__.o`：此函数用于判断对象中是否存在某个属性。
3. `__webpack_require__.r`：此函数用于向es6模块的导出对象module.exports标记一个`__esModule`属性。

让我们结合打包后的代码来看下，我们看下编译前后的`index.js`：

![image.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201844920.webp)

再看看编译前后的`module1.js`：

![image.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201845808.webp)

#### 总结

这样我们就能很清楚的知道了，这一追加部分的作用了。而`webpack`对于`ES6Module`模块化的转换也是跟`CommonJS`差不多的。但是，在对于值的导出的部分，`ES6Module`跟`CommonJS`还是有所区别的。

在值的导出的部分，`CommonJS`使用的是赋值操作，也就是拷贝了导出对象的引用地址：

![image.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201845525.webp)

这样做会产生的影响是，其模块内部改变这个值，是影响不到导出结果的。**因为导出的是这个值的拷贝，两个值不是同一个！**

而`ES6Module`的导出，我们来看一个更为直观的栗子：

![image.png](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201845728.webp)

`ES6Module`的导出，并不是直接赋值，而是导出一个函数，这个**函数引用的是模块内部值，这样就导致了模块内部改变其中一个值，导出模块的值也会发生改变，因为两个值都是同一个！**

### 20.webpack如何编译commonjs和esModule

___

#### 1.commonjs加载commonjs

> 引入是commonjs，导出是commonjs

-   引入文件

```js
let title = require("./title");
console.log(title.name);
console.log(title.age);
```

-   导出文件

```js
exports.name = "title_name";
exports.age = "title_age";
```

-   webpack编译结果及分析

```js
(() => {
  // 定义一个modules对象，key为moduleId，也就是文件相对于项目根目录的相对路径，value为一个函数，函数参数至少有一个module，函数体就是moduleId对应的文件的内容
  var modules = {
    "./src/title.js": (module) => {
      module.exports = "title";
    },
  };
  // 定义一个缓存
  var cache = {};
  // webpack自己实现一个require方法
  // 为什么webpack需要自己实现一个require方法，而不是用node内置的require？
    // 是因为node下的require是node环境使用的，如果我们webpack打包的结果需要去浏览器使用的话，就不能用node的require，所以需要自己写一个。
  function require(moduleId) {
    var cachedModule = cache[moduleId]; // 首先从缓存中读取key为moduleId的缓存，如果还有引用统一moduleId的文件的，那么就会是缓存存在，就直接将缓存返回了。如果不存在，继续往下走。所以可以看出，同一个路径的文件，多次引用，其实第二次开始都是返回缓存。
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    // 如果缓存不存在，那就将对象赋值给缓存，同时赋值给新定义的module。
      // 这里的对象有一个属性为exports，值为空对象
      // 这里的module是需要传入到引用文件的执行函数中的。
    var module = (cache[moduleId] = {
      exports: {},
    });
    // 执行moduleId(引用文件)对应的函数，也就是去执行引用文件。这时，传入之前定义好的module，module.exports和require本身，因为引用文件中有可能还有require引用
    modules[moduleId](module, module.exports, require); // 引用文件的内容最终应该有module.exports导出
    return module.exports; // 返回导出的内容
  }
  var exports = {};
  (() => { // 这就是入口文件的内容
    let title = require("./src/title.js");
    console.log(title);
  })();
})();

```

#### 2.commonjs加载esModule

> 引入是commonjs，导出是esModule

-   引入文件

```js
let title = require("./title");
console.log(title);
console.log(title.age);
```

-   导出文件

```js
export default "title_name";
export const age = "title_age";
```

-   webpack编译结果及分析

```js
(() => {
  var modules = {
    "./src/title.js": (__unused_webpack_module, exports, require) => {
      "use strict";
      require.renderEsModule(exports); // 作用就是使得exports.__esModule = true。 模块里出现了export或import的话，exports就会有一个__esModule属性，我们在运行的时候，可以通过__esModule来反推这是不是一个EsModule
      require.defineProperties(exports, { // 将default和age属性，挂在到exports上去
        default: () => __WEBPACK_DEFAULT_EXPORT__,
        age: () => age,
      });
      const __WEBPACK_DEFAULT_EXPORT__ = "title_name";
      const age = "title_age";
    },
  };
  var cache = {};
  function require(moduleId) {
    var cachedModule = cache[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = (cache[moduleId] = {
      exports: {},
    });
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  /*--------------以下是新增的三个函数--------------*/
  require.defineProperties = (exports, definition) => {
    for (var key in definition) {
      if (require.o(definition, key) && !require.o(exports, key)) {
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: definition[key],
        });
      }
    }
  };
  require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
  require.renderEsModule = (exports) => {
    if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    }
    Object.defineProperty(exports, "__esModule", { value: true }); // 模块里出现了export或import的话，exports就会有一个__esModule属性，我们在运行的时候，可以通过__esModule来反推这是不是一个EsModule。只有esModule才有__esModule属性
  };
  /*--------------以上是新增的三个函数--------------*/
  var exports = {};
  (() => {
    let title = require("./src/title.js");
    console.log(title);
  })();
})();
```

#### 问题

1. webpack如何判断是esModule？

   > webpack会把源码转成AST语法树，然后遍历语法树，找关键字import/exports，找到就是esModule

2. commonjs加载esModule，是怎么兼容的？

   > 1.  如果碰到模块中有export或import，则认定为是ESModule，这时候，会给exports对象加一个\_\_esModule为true的键值对。
   >
   > 2.  然后再将引用模块中的export的属性挂在到exports对象上去
   >
   > 3.  这个exports就是module.exports。这样就将esModule转成了commonjs

#### 3.esModule加载esModule

> 导入是esModule，导出是esModule

-   导入文件

```js
import name, { age } from "./title";
console.log(name);
console.log(age);
```

-   导出文件

```js
export default name = "title_name";
export const age = "title_age";
```

-   webpack编译结果及分析

```js
(() => {
  var modules = {
    "./src/title.js": (module) => { // 引用的文件是commonjs，所以不需要做任何处理
      module.exports = {
        name: "title_name",
        age: "title_age",
      };
    },
  };
  var cache = {};
  function require(moduleId) {
    var cachedModule = cache[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = (cache[moduleId] = {
      exports: {},
    });
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  require.n = (module) => { // 最大的差别就在这里
    // 判断module是否是一个esModule
    var getter =
      module && module.__esModule ? 
        // 如果导入是一个es6 module的话，那么默认导出就会挂在导出对象exports.default上
        () => module["default"] : // 如果是esModule，则返回这个函数，函数返回module["default"]
        // 如果导入的是commonjs的话，那就取对象本身，exports对象就是默认导出对象
        () => module;// 如果
    require.defineProperties(getter, { a: getter }); // 相当于给getter添加了属性a，属性a的get是getter，即getter.a值是getter本身
    return getter;
  };
  require.defineProperties = (exports, definition) => {
    for (var key in definition) {
      if (require.o(definition, key) && !require.o(exports, key)) {
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: definition[key],
        });
      }
    }
  };
  require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
  require.renderEsModule = (exports) => {
    if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
  };
  var exports = {};
  (() => {
    // esModule加载commonjs的关键在于，default如何取
    require.renderEsModule(exports); //  exports.__esModule = true, esModule加载esModule 与 esModule加载commonjs，一样
    var _title_0__ = require("./src/title.js"); // 虽然是esModule的import去引入模块，但是还是会转成require引入
    var _title_0___default = /*#__PURE__*/ require.n(_title_0__);
    console.log(_title_0___default());
    console.log(_title_0__.age);
  })();
})();
```

#### 总结

**esmodule和commonjs相关转换的规律**:

> 1.  最终都是转成commonjs
>
> 2.  commonjs => 打包后不变
>
> 3.  esModule => 打包后，首先会在exports上挂在一个\_\_esModule属性，值为true，代表这是esModule，然后将默认导出挂在exports.default上，其他属性挂在都exports上

### 21.webpack异步加载原理

`import()`对于webpack来说，是一个天然的分割点，也就是说，webpack碰到import()会对import()进行解析。怎么解析的，过程主要是：

1. 首先，webpack遇到import方法时，会将其当成一个代码分割点，也就是说碰到import方法了，那么就去解析import方法。

2. 然后，import引用的文件，webpack会将其编译成一个jsonp，也就是一个自执行函数，然后函数内部是引用的文件的内容，因为到时候是通过jsonp的方法去加载的。

3. 具体就是，import引用文件，会先调用require.ensure方法(打包的结果来看叫require.e)，这个方法主要是构造一个promise，会将resolve，reject和promise放到一个数组中，将promise放到一个队列中。

4. 然后，调用require.load(打包结果来看叫require.l)方法，这个方法主要是创建一个jsonp，也就是创建一个script标签，标签的url就是文件加载地址，然后塞到document.head中，一塞进去，就会加载该文件了。

5. 加载完，就去执行这段jsonp，主要就是把moduleId和module内容存到modules数组中，然后再去走webpack内置的require。

6. webpack内置的require，主要是先判断缓存，这个moduleId是否缓存过了，如果缓存过了，就直接返回。如果没有缓存，再继续往下走，也就是加载module内容，然后最终内容会挂在都module,exports上，返回module.exports就返回了引用文件的最终执行结果。
  

- 入口文件

```js
import(/* webpackChunkName: "title"*/'./title').then(result => {
  console.log(result);
})
```

- 依赖文件

```js
module.exports = "title"
```

- webpack编译结果及分析（缩减过后）

```js
var modules = {}
var cache = {}

function require(moduleId) {
  var cachedModule = cache[moduleId];
  if (cachedModule) {
    return cachedModule.exports; // 最终返回的都是module.exports
  }
  var module= cache[moduleId] = {
    exports: {}
  }
  modules[moduleId](module, module.exports, require);
  return module.exports;
}
// 定义查找代码块的方法
require.find = {};
// 通过JSONP一部加载指定的代码块
require.ensure = (chunkId) => {
  let promises = [];
  require.find.jsonp(chunkId, promises); // 在jsonp中会创建一个promise，并且添加到promises数组中
  return Promise.all(promises);
}
require.publicPath = ''; // 资源文件的访问路径，默认是空字符串，值从webpack.config.js的output的publicPath中去找
require.unionFileName = (chunkId) => { // 统一文件名
  return "" + chunkId + ".js"; // title.js
}
require.load = (url) => {
  let script = document.createElement('script');
  script.src = url;
  document.head.appendChild(script); //一旦append之后，浏览器会立刻请求脚本
}
// 已经安装或者加载好的或者加载中的chunk
var installedChunks = {
  "main": 0, // key为“main”表示主入口文件，0表示ok，也就是已经加载就绪
  // "title": [resolve, reject, promise]
}
require.find.jsonp = (chunkId, promises) => {
  var installedChunkData;
  let promise = new Promise((resolve, reject) => {
    installedChunkData = installedChunks[chunkId] = [resolve, reject];
    /*
      这个相当于installedChunks值变成了
      {
        "main": 0,
        "title": [resolve, reject, promise]
      }
    */
  })
  installedChunkData[2] = promise;
  promises.push(promise);
  var url = require.publicPath + require.unionFileName(chunkId); //title.js
  require.load(url); // 常见script，然后塞入document.head，然后会自动加载该文件
}
var webpackJsonpCallback = ([chunkIds, moreModules]) => {
  var resolves = [];
  for (let i = 0; i < chunkIds.length; i++) {
    let chunkId = chunkIds[i];
    resolves.push(installedChunks[chunkId][0]);//把chunk对应的promise的resolve方法添加到resolves数组里去
    installedChunks[chunkId][0] = 0; // 表示已经添加完成
  }
  for (let moduleId in moreModules) {
    modules[moduleId] = moreModules[moduleId];
  }
  while(resolves.length){
    resolves.shift()(); // 让promise的resolve执行，让promise成功
  }
}
// 由于打包好了依赖文件title.js是被
var chunkLoadingGlobal = self["webpackChunk_1_webpack_bundle"] = self["webpackChunk_1_webpack_bundle"] || [];
// 重写数组的push方法
chunkLoadingGlobal.push = webpackJsonpCallback;
require.ensure("title") // 先加载代码块,这里的参数"title"就是魔法字符串中的webpackChunkName的值title
  .then(require.bind(require, "./src/title.js")) // require模块
  .then(result => { // 获取结果
    console.log(result);
  })
```

### 22.webpack打包性能优化

#### 1.优化大纲

> weibapck性能优化主要可以考虑以下几方面

1.  缩小查找范围，加快查找速度
    1.  extensions
    2.  alias
    3.  modules
    4.  mainFields
    5.  mainFiles
    6.  resolve
    7.  resolveLoader
2.  noParse 不解析第三方库的第三方依赖
3.  DefinePlugin 创建编译时可以配置的全局变量，减少变量查找范围
4.  IgnorePlugin webpack 忽略某些模块，不把他们打包进去
5.  净化css，抽离css
6.  thread-loader代替happypack，多进程处理
7.  cdn
8.  tree Shaking
9.  代码分割
10.  按需加载、提取公共代码
11.  scope Hosting 作用域提升
12.  利用缓存
     1.  babel-loader开启缓存
     2.  使用cache-loader

> 性能分析工具

1.  speed-measure-webpack-plugin 测试每个核心步骤耗费的事件
2.  webpack-bundle-analyzer 代码分析工具，生成代码体积等分析报告

#### 2.具体操作

#### 1.缩小查找范围，加快查找速度

##### 1.1 extensions

> 有了这个extensions后，在`require`和`import`的时候不需要加文件扩展名，会一次添加扩展名进行匹配

```js
resolve: {
  extensions: [".js",".jsx",".json",".css"]
},
```

##### 1.2 alias

> 配置别名可以加快webpack查找模块的速度
>
> 不需要从`node_modules`文件夹中按模块的查找规则查找

```js
const bootstrap = path.resolve(__dirname,'node_modules/_bootstrap@3.3.7@bootstrap/dist/css/bootstrap.css');
resolve: {
    alias:{
        "bootstrap":bootstrap
    }
},
```

##### 1.3 modules

> `modules` 字段指定第三方模块的查找目录

```js
// 默认是查找node_modules，但是会类似Nodejs一样的路径进行搜索,一层一层网上找node_modules
resolve: {
modules: ['node_modules'],// 先当当前目录下的node_modules，找不到找上层目录的node_moudles，直到全局的node_modules
}
// 如果确定依赖模块在项目根目录下的node_modules中，那么可以写绝对路径确定查找范围
resolve: {
modules: [path.resolve(__dirname, 'node_modules')], // 确定查找目录就是项目下的node_modules，找不到不会往上层找
}    
```

##### 1.4 mainFilds和mainFiles

```js
resolve: {
  // 配置 target === "web" 或者 target === "webworker" 时 mainFields 默认值是：
  mainFields: ['browser', 'module', 'main'],
  // target 的值为其他时，mainFields 默认值为：
  mainFields: ["module", "main"],
}
```

-   这里的mainFileds代表了一个包解析入口文件应该看的字段，按照上面代码的顺序查找

```js
resolve: {
  mainFiles: ['index'], // 你可以添加其他默认使用的文件名
},
```

-   这里的mainFiles代表入口文件，如果mainFileds对应的字段没有，那么就看mainFiles对应的入口文件，如果mainFiles也没有，那么就是index

###### 问：解析一个包或模块，如何找到入口文件`面试点`

1.  先找到包/模块下对应的`package.json`中的`main`字段，如果存在此字段，直接找到了，就直接返回。
2.  如果没有这个字段，就找对应mainFiles，默认就是index.js

##### 1.5 resolveLoader

> 用于配置解析loader时的resolve，默认配置:

```js
module.exports = {
  resolveLoader: {
    modules: [ 'node_modules' ],
    extensions: [ '.js', '.json' ],
    mainFields: [ 'loader', 'main' ]
  }
};
```

> resolve与resolveLoader对象的key是一样的，后者是专门用于查找loader的

#### 2.noParse 忽略对指定第三方模块的第三方依赖的解析

> 比如：

```js
import jq from 'jquery'
```

> 当解析jq的时候，会去解析jq这个库是否有依赖其他的包

> 但是，如果配置了`noParse`，那么就不需要再去解析jquery中的依赖库了，这样能够增加打包速率。

```js
module:{
    noParse:/jquery/,//不去解析jquery中的依赖库
    rules: [
        ...
    ]
}
```

#### 3.DefinePlugin 定义全局变量

> 创建一些在编译时可以配置的全局变量，在编译的时候会直接替换掉，不需要再去查找

```js
let webpack = require('webpack');
new webpack.DefinePlugin({
    PRODUCTION: JSON.stringify(true),
    VERSION: "1",
    EXPRESSION: "1+2",
    COPYRIGHT: {
        AUTHOR: JSON.stringify("yh")
    }
})

console.log(PRODUCTION);
console.log(VERSION);
console.log(EXPRESSION);
console.log(COPYRIGHT);
```

-   如果配置的值是字符串，那么整个字符串会被当成代码片段来执行，其结果作为最终变量的值
-   如果配置的值不是字符串，也不是一个对象字面量，那么该值会被转为一个字符串，如 true，最后的结果是 ‘true’
-   如果配置的是一个对象字面量，那么该对象的所有 key 会以同样的方式去定义
-   JSON.stringify(true) 的结果是 ‘true’

#### 4.IgnorePlugin 忽略某些模块，不把他们打包进去

> 忽略第三方包的指定目录，让这些指定目录不要被打包进去。比如moment包，我只用中文的，那么可以用这个插件指定只打包中文的目录，其他语言就不需要打包了。加快了打包速度，减少了打包体积。

[18、webpack优化(3)——IgnorePlugin\_俞华的博客-CSDN博客\_ignoreplugin](https://blog.csdn.net/qq_17175013/article/details/86845624)

#### 5.purgecss-webpack-plugin净化css，mini-css-extract-plugin压缩并抽离css

> purgecss-webpack-plugin净化css，mini-css-extract-plugin压缩并抽离css，两者需要配合使用

-   使用：

```js
const path = require("path");
+const glob = require("glob");
+const PurgecssPlugin = require("purgecss-webpack-plugin");
+const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PATHS = {
  src: path.join(__dirname, 'src')
}
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.js/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        ],
      },
+      {
+        test: /\.css$/,
+        include: path.resolve(__dirname, "src"),
+        exclude: /node_modules/,
+        use: [
+          {
+            loader: MiniCssExtractPlugin.loader,
+          },
+          "css-loader",
+        ],
+      },
    ],
  },
  plugins: [
+    new MiniCssExtractPlugin({
+      filename: "[name].css",
+    }),
+    new PurgecssPlugin({
+      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
+    })
  ],
};
```

#### 6.thread-loader代替happypack，多进程处理

> 把这个 loader 放置在其他 loader 之前， 放置在这个 loader 之后的 loader 就会在一个单独的 worker 池(worker pool)中运行

```js
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.js/,
        include: path.resolve(__dirname, "src"),
        use: [
+          {
+            loader:'thread-loader',
+            options:{
+              workers:3
+            }
+          },
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
    ],
  }
};
```

#### 7.CDN 内容分发网络

> CDN 又叫内容分发网络，通过把资源部署到世界各地，用户在访问时按照就近原则从离用户最近的服务器获取资源，从而加速资源的获取速度。

##### 问：怎么使用CDN提高性能，加快访问速度？`面试题`

-   首先，我们一般将入口html文件不缓存，放在自己的服务器上，关闭自己服务器的缓存，静态资源的url变成指向CDN服务器的地址
    -   这样做，是因为cdn服务一般会给资源开启很长时间，例如用户从cdn上获取了index.html后，即使之后发布操作把index.html覆盖了，但是用户在很长一段时间内，依旧使用的是之前运行的版本，这会导致新发布不能立即生效，所以我们将index.html不开启缓存放在自己服务器上
-   然后，很对静态的js、css、图片等文件需要开启缓存，上传到CDN上去，并且给每个文件名带上由文件内容算出的hash值
    -   开启缓存和上传到CDN是为了能够读取更快，加上hash是因为文件会随着内容而变化，只要文件内容变化，那么对应的url就会变化，那么就会重新下载，无论缓存时间有多长。这样能保证文件一更新，读取的就是最新的文件，文件不更新，读取的就是缓存。
-   启用CDN后，所有的相对路径都改成指向CDN服务器的绝对路径。通过webpack的publicPath可以设置。

```js
{
        output: {
        path: path.resolve(__dirname, 'dist'),
+       filename: '[name]_[hash:8].js',
+       publicPath: 'http://img.aiqiyi.cn'
    },
}
```

- 另外，会把不同的静态资源分散到不同的CDN服务上去，因为同一时候，针对同一域名的资源 并行请求是优先的。

- 但是，多个域名会增加域名解析时间，所以可以在HTML的HEAD标签中加入`link`标签去与解析域名，以降低域名解析带来的延迟。

  - `link`标签一般会有一个`rel`属性，值为`dns-prefetch`，代表dns预拉取，拉取的地址是`href`属性的值，比如：

    ```js
    <link rel="dns-prefetch" href="http://img.aiqiyi.cn">
    ```

#### 8.TreeShaking 只打包用到的API

> tree shaking就是只把用到的方法打入bundle,没用到的方法会`uglify`阶段擦除掉

- **原理是利用es6模块的特点,只能作为模块顶层语句出现,import的模块名只能是字符串常量，所以只能用在esModule中**（`面试点`）

  - 没有导入的API都不会被打包

  - 代码不会被执行，不可到达的不会被打包

    ```js
    import a from 'a'if(false){console.log(a) // 不会达到，所以a不会打包进来}
    ```

  - 代码执行的结果不被用到，不会被打包

  - 代码中只赋值，不使用的变量，不会被打包

#### 9.代码分割

##### 9.1 按入口点分割

> 多入口项目，入口chunks之间包含了重复的模块，那么这些重复的模块会被引入到各个bundle中，所以提取出重复的模块作为单独的bundle，能够提升减少打包体积，提升打包效率

##### 9.2动态导入(懒加载，按需加载)

> 使用`import()`函数配合`魔法注释`，代表按需加载，`魔法注释`一样的会打成一个包

```js
import(/* webpackChunkName: "title" */ "./components/Title")
```

##### 9.3预先加载preload和预先拉取prefetch

###### 9.3.1 预先加载preLoad

-   [preload-webpack-plugin](https://github.com/vuejs/preload-webpack-plugin) 能够将资源加载通过preload的方式加载，也就是预先加载
    -   举例如下：
        -   现在需要preload的地方，添加魔法注释"/\* webpackPreload: true\*/"(图1-1)
        -   然后webpack配置插件(图1-2)
        -   然后会发现，原先按需加载的权重应该是Low，但是现在变成了Hight(图1-3)
        -   从html发现，还没点击按钮，已经插入了link标签，也就是资源已经被预先加载了(图1-4)

![](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201847694.png)

 (图1-1)

![](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201847260.png)

 (图1-2)

![](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201848667.png)

(图1-3)

![](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201848412.png)

(图1-4)

-   上面的html可以看出，link标签不止可以引出css，还可以引入script，只要写一个as=“script”，应该还可以引入其他类型。另外，上面的rel="preload"表示预加载

###### 9.3.2预先拉取prefetch

-   prefetch 跟 preload 不同，它的作用是告诉浏览器未来可能会使用到的某个资源，浏览器就会在闲时去加载对应的资源，若能预测到用户的行为，比如懒加载，点击到其它页面等则相当于提前预加载了需要的资源

```js
<link rel="prefetch" href="utils.js" as="script">
button.addEventListener('click', () => {
  import(
    `./utils.js`
    /* webpackPrefetch: true */
    /* webpackChunkName: "utils" */
  ).then(result => {
    result.default.log('hello');
  })
});
```

###### 9.3.3 preload 与 prefetch 的区别

-   preload告诉浏览器我马上要用到这个资源，请提高加载优先级为high，预先加载

-   prefetch告诉浏览器我未来可能会用到这个资源，请浏览器优先级设为lowest，在浏览器空闲的时候加载

    -   preload不要轻易用，因为会阻塞主要模块的加载，所以慎用。只有最关键最急需的资源才用。

##### 9.4 提取公共代码

- 问：以下模块依赖图，由page1、page2、page3三个入口，实线代表依赖，比如page1依赖了module1，虚线代表动态导入，比如page1动态导入asyncModule1.js。请问：利用你觉得最佳的优化方案，会产出哪些文件?

  - 思路：

    1. 提取第三方模块 jquery

       > 会提取出一个endorspage1page2~page3.chunk.js

    2. 提取公共模块 module1 module2 module3

       > 会提取出page1page2.chunk.js、page1page2~page3.chunk.js

    3. 提取动态加载的模块(import())，动态模块也按照1 2 3步骤提取

       > 会提取出asyncModule1.chunk.js，然后还会提取出动态加载的模块的第三方依赖vendors~asyncModule.chunk.js，然后去提供公共模块，因为这里没有，所以么有产出

    4. 提取出入口文件

       > 会提取出page1.js、page2.js、page3.js

- 问：module3在哪个产出文件中？

  -   答：在page3.js中。因为如果一个模块被两个或两个以上引用，那么会单独打包出一个bundle，如果只有被一个引用，那么就会打包到引用方的包中。

![](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201848772.png)

- 分包是什么意思？

  > 分包就是提取多个入口之间的公共模块，一般用于mpa多页应用
  >
  > 那么单页应用如何分包？通过懒加载import实现分包

- 代码分割的配置应该怎么配？

  > 应该在webpack配置文件的optimization属性的splitChunks属性中配置

```js
module.exports = {
   optimization: {
     splitChunks: {
         chunks: "all", //代码分割应用于哪些情况，默认作用于异步chunk，值为all（同步+异步）/initial（同步import a from './a'）/async（异步import()）
         minSize: 0, //分割出去的代码块最小的尺寸多大，代码块的最小尺寸，小于这个尺寸的就没必要分割出来，太小了，默认值是30kb,0就是不限制
         minChunks: 2, //被多少模块共享,在分割之前模块的被引用次数
         maxAsyncRequests: 3, //限制异步模块内部的并行最大请求数的，说白了你可以理解为是每个import()它里面的最大并行请求数量
         maxInitialRequests: 5, //限制入口的拆分数量
         name: false, //打包后的名称，默认是chunk的名字通过分隔符（默认是～）分隔开，如vendor~，值可以是false、string或function，不能是true
         automaticNameDelimiter: "~", //分隔符，默认webpack将会使用入口名和代码块的名称生成命名,比如 'vendors~main.js'
         cacheGroups: {// 将多个chunk的缓存合并成一个组
           //设置缓存组用来抽取满足不同规则的chunk,下面以生成common为例
           vendors: {
             chunks: "all",
             test: /node_modules/, //条件,如果这个模块request路径（绝对路径）里面包含node_modules，那么就属于第三方模块
             priority: -10, ///优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中,为了能够让自定义缓存组有更高的优先级(默认0),默认缓存组的priority属性为负值.
           },
           default: {
             chunks: "all",
             minSize: 0, //最小提取字节数
             minChunks: 2, //最少被几个chunk引用
             priority: -20,
             reuseExistingChunk: false
           }
           // 有些模块，比如jquery，按照上面的配置，它会同时属于vendors和default两个缓存组，那么到底属于哪个缓存组呢，根据配置中的priority值大小来确定。
         },
         runtimeChunk:true // 运行时代码块单独打包成一个文件
   },
}
```

-   上面的缓存组中，为什么priority要配置成负数？

    -   答：因为webpack有默认缓存组，默认缓存组优先级为0。
        -   如果你想要优先级比默认的要高，用正数
        -   比默认的要低，就用负数。(负数的话，就是不覆盖默认配置)
-   多页应用html怎么配置？

    -   根据下图配置，但是需要配置chunks，代表page1.html引用对应自己的chunks。

#### 10.scope Hosting 作用域提升

> Scope Hosting作用于提升，可以让 Webpack 打包出来的代码体积更小、运行速度更快。这是webpack3退出的功能。

- 为什么Scope Hosting能够减少代码体积、加快运行速度?

  > 答：举个例子说明下：
  >
  > 如果文件a导出了字符串a，index.js引入了a，并且console.log(字符串a)，那么如果没有开启`scope hosting`，打包出来的结果是：
  >
  > 在modules数组中，有一个对象元素，key为a模块路径，value为一个函数，函数内部包含了a模块的内容；然后还有一个index.js模块，根据引用关系去找到modules中的a模块，然后加载进来。相当于打包后，a模块的内容都被打包进去了。
  >
  > 但其实，我只是在index.js中使用了一下a模块的导出结果，也就是字符串a，那么我只要把index.js中用到a的地方替换成字符串’a’就可以了，没必要把整个a模块都打包进来。`scope hosting`就是用来做到这一点的。

```js
// a.js
export default 'a';
// index.js
import a from './a.js';
console.log(a);
// 不开启scope hosting打包出来的结果
"./src/index.js":
(function(module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
var a = ('a');
console.log(a);
})
// 开启scope hosting打包出来的结果
(() => {"use strict";console.log("a")})
```

#### 11.利用缓存

> webpack利用缓存来优化一般有2种思路：

-   babel-loader开启缓存
-   使用cache-loader

##### 11.1  babel-loader

-   **Babel在转义js文件过程中消耗性能较高（语法树解析啥的），将babel-loader执行的结果缓存起来，当重新打包构建时会尝试读取缓存，从而提高打包构建速度、降低消耗**

```js
 {
    test: /\.js$/,
    exclude: /node_modules/,
    use: [{
      loader: "babel-loader",
      options: {
        cacheDirectory: true
      }
    }]
  },
```

##### 11.2  cache-loader

-   在一些性能开销较大的 loader 之前添加此 loader,以将结果缓存到磁盘里
-   存和读取这些缓存文件会有一些时间开销,所以请只对性能开销较大的 loader 使用此 loader

```js
const loaders = ['babel-loader'];
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'cache-loader',
          ...loaders
        ],
        include: path.resolve('src')
      }
    ]
  }
}
```

#### 12.oneOf

> 一般来说，一个类型的文件只对应一个rule，但是webpack编译的时候，会对每个rules中的所有规则都遍历一遍，匹配test规则的整理出来，然后去执行laoder。
>
> 但是，如果用了oneOf，只要匹配test，匹配到一个，那么后面的loader就不再处理了。
>
> 也正是一个只匹配一个，所以oneOf中不能两个配置处理同一种类型的文件。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        //优先执行
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          fix: true
        }
      },
      {
        // 以下 loader 只会匹配一个
        oneOf: [
          ...,
          {test: /js/, ...}, // 匹配到一个，后面就不会再去匹配了
          {test: /css/, ...}
        ]
      }
    ]
  }
}
```

#### 13.性能分析工具

##### 1\.speed-measure-webpack-plugin 测试每个核心步骤耗费的时间

-   使用：在module.exports导出的内容外包一层wrap函数即可。

```js
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const smw = new SpeedMeasureWebpackPlugin();
module.exports =smw.wrap({
});
```

-   结果：可以看到每个步骤、每个loader、plugin等消耗的时间

![](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201849168.png)

##### 2.webpack-bundle-analyzer

> webpack-bundle-analyzer是一个webpack的插件，需要配合webpack和webpack-cli一起使用。这个插件的功能是生成代码分析报告，帮助提升代码质量和网站性能

![](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201849571.png)

![](https://s2.loli.net/2022/07/28/7XOjSzcsCxD45Zu.png)

上面这个插件的用法改了

##### 耗时分析

```js
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');const smw = new SpeedMeasureWebpackPlugin();module.exports =smw.wrap({    ...});
```

-   可以看到每个步骤、每个loader、plugin等消耗的时间

![](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/202208201849748.png)

##### webpack打包文件分析工具webpack-bundle-analyzer

> webpack-bundle-analyzer是一个webpack的插件，需要配合webpack和webpack-cli一起使用。这个插件的功能是生成代码分析报告，帮助提升代码质量和网站性能

```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports={
  plugins: [
    new BundleAnalyzerPlugin()  // 使用默认配置
    // 默认配置的具体配置项
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    //   analyzerHost: '127.0.0.1',
    //   analyzerPort: '8888',
    //   reportFilename: 'report.html',
    //   defaultSizes: 'parsed',
    //   openAnalyzer: true,
    //   generateStatsFile: false,
    //   statsFilename: 'stats.json',
    //   statsOptions: null,
    //   excludeAssets: null,
    //   logLevel: info
    // })
  ]
}
// 配置脚本
{
 "scripts": {
    "generateAnalyzFile": "webpack --profile --json > stats.json", // 生成分析文件
    "analyz": "webpack-bundle-analyzer --port 8888 ./dist/stats.json" // 启动展示打包报告的http服务器
  }
}
```

### 23.tapable

tapable 是一个类似于 Node.js 中的 EventEmitter的库，但更专注于自定义事件的触发和处理
webpack本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是Tapable。Tapable其实就是一个用于事件发布订阅执行的插件架构。webpack 通过 tapable 将实现与流程解耦，所有具体实现通过插件的形式存在。
tapable核心原理：发布订阅模式。

#### 1.tapable的使用

> tapable在webpack中被广泛应用，先来看看tapable是怎么使用的吧~

```js
let { SyncHook }  = require("tapable");
let syncHook = new SyncHook();

syncHook.tap("name1", (...args) => { // 监听，类似events的on
  console.log('name1', ...args)
})
syncHook.tap("name2", (...args) => {
  console.log("name2", ...args);
})
syncHook.tap("name2", (...args) => {
  console.log("name22", ...args);
})

syncHook.call("name2", 'a', 'b'); // 触发
/*
结果为
name1
    name2
    name22
*/
```

-   可见tapable这个库，监听用`tap`，触发用`call`，且上面无论是箭头还是触发的第一个参数，也就是name，是没有任何意义的

#### 2.手写tapable

```js
module.exports = class SyncHook {
  constructor(){
    this.events = []
  }
  tap(eventName, callback){
    this.events.push(callback);
  }
  call(eventName, ...args){
    this.events.forEach(fn => fn(...args))
  }
}
```

#### 3.优化tapable

优化tapable，使得其能指定触发某一个事件

```js
module.exports = class SyncHook {
  constructor(){
    this.events = {}
  }
  tap(eventName, callback){
    if (this.events[eventName]) {
      this.events[eventName].push(callback)
    } else {
      this.events[eventName] = [callback];
    }
  }
  call(eventName, ...args){
    if (eventName && this.events[eventName]) {
      this.events[eventName].forEach(fn => fn());
    } else if (!eventName) {
      Object.keys(this.events).forEach(e => {
        this.events[e].forEach(fn => fn(...args))
      })
    }
  }
}
```

#### 4.关于tapable的钩子函数

```js
const {
 SyncHook,
 SyncBailHook,
 SyncWaterfallHook,
 SyncLoopHook,
 AsyncParallelHook,
 AsyncParallelBailHook,
 AsyncSeriesHook,
 AsyncSeriesBailHook,
 AsyncSeriesWaterfallHook
} = require('tapable');
```

##### SyncHook

这是同步钩子，能够同步执行注册的监听函数

```js
let {SyncHook} = require('tapable');

class Lesson {
	constructor(){
		this.hooks = {
			arch: new SyncHook(['name'])
		}
	}
	tap(){//注册监听函数
		this.hooks.arch.tap('node',function(name){
			console.log('node',name)
		})
		this.hooks.arch.tap('react',function(name){
			console.log('react',name)
		})
	}
	start(){
		this.hooks.arch.call('yuhua');
	}
}

let l = new Lesson();
l.tap();//注册两个监听函数(时间)
l.start();//启动钩子

```

##### SyncHook原理实现

```js
class SyncHook {//钩子是同步的
	constructor(args){//args => ['name']
		this.tasks = [];
	}
	call(...args){
		this.tasks.forEach((task) => task(...args))
	}
	tap(name,task){
		this.tasks.push(task);
	}
}

let hook = new SyncHook(['name']);
hook.tap('react',function(name){
	console.log('react',name)
})
hook.tap('node',function(name){
	console.log('node',name)
})
hook.call('yuhua');

```

##### SyncBailHook

> SyncBailHook同步熔断保险钩子,即return一个非undefined的值，则不再继续执行后面的[监听](https://so.csdn.net/so/search?q=监听&spm=1001.2101.3001.7020)函数

```js
let {SyncBailHook} = require('tapable');//SyncBailHook同步熔断保险钩子,即return一个非undefined的值，则不再继续执行后面的监听函数

class Lesson{
	constructor(){
		this.hooks = {
			arch: new SyncBailHook(['name'])
		}
	}
	tap(){
		this.hooks.arch.tap('node',function(name){
			console.log('node',name)
			// return undefined;
			return '想停止学习'//当返回的内容为非undefined的时候，会停止往下执行监听函数
		})
		this.hooks.arch.tap('react',function(name){
			console.log('react',name)
		})
	}
	start(){
		this.hooks.arch.call('yuhua');
	}
}

let l = new Lesson();
l.tap();
l.start();
```

##### SyncBailHook原理实现

```js
class SyncBailHook {//钩子是同步的
	constructor(args){//args => ['name']
		this.tasks = [];
	}
	call(...args){
		let ret;//ret代表当前函数的返回值
		let index = 0;//index表示当前是第几个函数
		do{
			ret = this.tasks[index](...args);
			index++;
		}while(ret === undefined && this.tasks.length > index);
	}
	tap(name,task){
		this.tasks.push(task);
	}
}

let hook = new SyncBailHook(['name']);
hook.tap('react',function(name){
	console.log('react',name)
	return '停止向下执行'
})
hook.tap('node',function(name){
	console.log('node',name)
})
hook.call('yuhua');

```

##### SyncWaterfallHook

> SyncWaterfallHook,同步瀑布钩子，上一个[监听](https://so.csdn.net/so/search?q=监听&spm=1001.2101.3001.7020)函数的返回值会传递给下一个监听函数

```js
let {SyncWaterfallHook} = require('tapable');//SyncWaterfallHook,同步瀑布钩子，上一个监听函数的返回值会传递给下一个监听函数

class Lesson{
	constructor(){
		this.hooks = {
			arch: new SyncWaterfallHook(['name'])
		}
	}
	tap(){
		this.hooks.arch.tap('node',function(name){
			console.log('node',name)
			return 'node学的还不错'
		})
		this.hooks.arch.tap('react',function(data){
			console.log('react',data)
		})
	}
	start(){
		this.hooks.arch.call('yuhua');
	}
}

let l = new Lesson();
l.tap();
l.start();
```

##### SyncWaterfallHook原理实现

```js
class SyncWaterfallHook {//钩子是同步的
	constructor(args){//args => ['name']
		this.tasks = [];
	}
	call(...args){
		let [first,...others] = this.tasks;
		let ret = first(...args);
		others.reduce((a,b) => {
			return b(a);
		},ret)
	}
	tap(name,task){
		this.tasks.push(task);
	}
}

let hook = new SyncWaterfallHook(['name']);
hook.tap('react',function(name){
	console.log('react',name)
	return 'react ok'
})
hook.tap('node',function(data){
	console.log('node',data)
	return 'node ok'
})
hook.tap('webpack',function(data){
	console.log('node',data)
})
hook.call('yuhua');
```

##### SyncLoopHook

> SyncLoopHook,同步遇到某个不返回undefined的[监听](https://so.csdn.net/so/search?q=监听&spm=1001.2101.3001.7020)函数，就重复执行

```js
let {SyncLoopHook} = require('tapable');//SyncLoopHook,同步遇到某个不返回undefined的监听函数，就重复执行

class Lesson{
	constructor(){
		this.index = 0;
		this.hooks = {
			arch: new SyncLoopHook(['name'])
		}
	}
	tap(){
		this.hooks.arch.tap('node',(name) => {
			console.log('node',name)
			return ++this.index === 3? undefined : '继续学';
		})
		this.hooks.arch.tap('react',(data) => {
			console.log('react',data)
		})
	}
	start(){
		this.hooks.arch.call('yuhua');
	}
}

let l = new Lesson();
l.tap();
l.start();
```

##### SyncLoopHook原理实现

```js
class SyncLoopHook {//钩子是同步的
	constructor(args){//args => ['name']
		this.tasks = [];
	}
	call(...args){
		this.tasks.forEach((task) => {
			let ret;
			do{
				ret = task(...args);
			}while(ret !== undefined);
		})
	}
	tap(name,task){
		this.tasks.push(task);
	}
}

let hook = new SyncLoopHook(['name']);
let total = 0;
hook.tap('react',function(name){
	console.log('react',name)
	return ++total === 3? undefined :'继续学';
})
hook.tap('node',function(name){
	console.log('node',name)
})
hook.tap('webpack',function(name){
	console.log('node',name)
})
hook.call('yuhua');
```



### 24.webpack中文件hash

#### 1\. 文件指纹

> 文件指纹指的是打包后输出的文件名和后缀

文件指纹可以由以下占位符组成：

| 占位符名称  | 含义                                                   |
| ----------- | ------------------------------------------------------ |
| ext         | 资源后缀名                                             |
| name        | 文件名称                                               |
| path        | 文件的相对路径                                         |
| folder      | 文件所在的文件夹                                       |
| hash        | 每次webpack构建时生成一个唯一的hash值                  |
| chunkhash   | 根据chunk生成hash值，来源于同一个chunk，则hash值就一样 |
| contenthash | 根据内容生成hash值，文件内容相同hash值就相同           |

#### 2\. hash、chunkhash和contenthash的区别

##### **hash**：一整个项目，一次打包，只有一个hash值

###### **chunkhash**：

- **什么是chunk**？

  -   从入口entry出发，到它的依赖，以及依赖的依赖，依赖的依赖的依赖，等等，一直下去，所打包构成的代码块(模块的集合)叫做一个chunk，也就是说，入口文件和它的依赖的模块构成的一个代码块，被称为一个chunk。
  -   所以，**一个入口对应一个chunk，多个入口，就会产生多个chunk**
  -   所以，单入口文件，打包后chunkhash和hash值是不同的，但是效果是一样的

- 什么是chunkhash？

  -   每个chunk打包后，会产生的哈希，叫做chunkhash

- 举例：

  -   错误示例：

  ```js
  // webpack.config.js
  module.exports = {
      entry: {
          entry1: './src/entry1.js',
          entry2: './src/entry2.js',
      },
      output: {
          path: path.resolve(__dirname, 'dist'),
          filename: 'bundle.[hash:8].js' // 这样是错误的，因为hash，整个项目只有一个，但是我们这边入口有两个，打包生成的文件肯定也是两个，这两个肯定是不一样的，所以如果用hash的话，两个文件名就一样的，这是不对的，所以，可以换成'bundle.[chunkhash:8].js'
        },
  }
  ```

  -   正确示例:

  ```js
  // webpack.config.js
  module.exports = {
      entry: {
          entry1: './src/entry1.js',
          entry2: './src/entry2.js',
      },
      output: {
          path: path.resolve(__dirname, 'dist'),
          filename: 'bundle.[chunkhash:8].js'
        },
  }
  ```

#### **contenthash:**

- **什么是contenthash**

  - 这个[哈希](https://so.csdn.net/so/search?q=%E5%93%88%E5%B8%8C&spm=1001.2101.3001.7020)只跟内容有关系，内容不变，哈希值不变。

    ```js
    // a文件
    require('./b')
    console.log(1)
    
    // b文件
    console.log(2)
    console.log(3)
    
    // 那么其实内容就是下面三句代码，contenthash是对下面的内容进行哈希提取
    console.log(2)
    console.log(3)
    console.log(1)
    ----------------------------------------------------------------------
    // 那么其实，跟以下是一样的：
    // a文件
    require('./b')
    console.log(3)
    console.log(1)
    // b文件
    console.log(2)
    // 那么这时候内容也是下面三句代码。contenthash也是对下面三句代码进行哈希提取
    console.log(2)
    console.log(3)
    console.log(1)
    ```


#### 3\. 各类哈希是如何生成的？

##### hash是如何生成的，这里指得是对某个文件生成一个hash？

```js
let crypto = require('crypto');
let content = fs.readFileSync('a.jpg'); // 读取文件
let hash = crypto.createHash('md5').update(content).digest('hex').slice(0, 10); // 生成10位hash
```

##### webpack中的hash是如何生成的？

```js
let crypto = require('crypto');

// 伪代码
let entry = {
    entry1: 'entry1', // 值'entry1'代表entry1这个文件，伪代码
    entry2: 'entry2', // 值'entry2'代表entry2这个文件，伪代码
}

let entry1 = ’require("./depModule1")'; // 代表entry1中引入了depModule1，伪代码
let entry2 = ’require("./depModule2")'; // 代表entry2中引入了depModule2，伪代码

let depModule1 = 'depModule1'; // 代表depModule1的内容是depModule1
let depModule2 = 'depModule2'; // 代表depModule2的内容是depModule2

let hash = crypto.createHash('md5')
.update(entry1)
.update(entry2)
.update(depModule1)
.update(depModule2)
.digest('hex');
// 这就说明，webpack的hash是对每个依赖模块进行update得到的，只要任意依赖的模块由改变，那么hash值就会改变

```

##### chunkhash是如何生成的？

```js
let crypto = require('crypto');

// 伪代码
let entry = {
    entry1: 'entry1', // 值'entry1'代表entry1这个文件，伪代码
    entry2: 'entry2', // 值'entry2'代表entry2这个文件，伪代码
}

let entry1 = ’require("./depModule1")'; // 代表entry1中引入了depModule1，伪代码
let entry2 = ’require("./depModule2")'; // 代表entry2中引入了depModule2，伪代码

let depModule1 = 'depModule1'; // 代表depModule1的内容是depModule1
let depModule2 = 'depModule2'; // 代表depModule2的内容是depModule2

let chunkhash_of_entry1 = crypto.createHash('md5')
                            .update(entry1)
                            .update(depModule1)
                            .digest('hex');
let chunkhash_of_entry2 = crypto.createHash('md5')
                            .update(entry2)
                            .update(depModule2)
                            .digest('hex');

// 这就说明，webpack的chunkhash是对每个入口自己的依赖模块进行update得到的，每个入口对应一个chunkhash，入口文件和依赖有所改变，那么这个入口对应的chunkhash就会改变
```

##### contenthash是如何生成的？

```js
let crypto = require('crypto');

// 伪代码
let entry = {
    entry1: 'entry1', // 值'entry1'代表entry1这个文件，伪代码
    entry2: 'entry2', // 值'entry2'代表entry2这个文件，伪代码
}

let entry1 = ’require("./depModule1")'; // 代表entry1中引入了depModule1，伪代码
let entry2 = ’require("./depModule2")'; // 代表entry2中引入了depModule2，伪代码

let depModule1 = 'depModule1'; // 代表depModule1的内容是depModule1
let depModule2 = 'depModule2'; // 代表depModule2的内容是depModule2

let entry1File = entry1 + depModule1;
let contenthash_of_entry1 = crypto.createHash('md5')
                            .update(entry1File)
                            .digest('hex');
```

#### 4\. 各类哈希的区别，或，各类哈希如何选择？

> **hash、chunkhash、contenthash，首先生成效率越来越低，成本越来越高，影响范围越来越小，精度越来越细。**
>
> **hash是一整个项目，一次打包，只有一个hash值，是项目级的**
>
> **chunhash是从入口entry出发，到它的依赖，以及依赖的依赖，依赖的依赖的依赖，等等，一直下去，所打包构成的代码块(模块的集合)叫做一个chunk，也就是说，入口文件和它的依赖的模块构成的一个代码块，被称为一个chunk。**
>
> **contenthash是哈希只跟内容有关系，内容不变，哈希值不变。与chunkhash的区别可以举上面contenthash的例子，同时可以说明contenthash跟内容有关，但是chunkhash会考虑很多因素，比如模块路径、模块名称、模块大小、模块id等等。**

#### 5\. 各类哈希的应用

- 题目一：以下能否打包成功，如果不能，是什么原因？

  - 答案：

    > 不能，因为这是多入口文件打包，会生成多个文件，但是由于hash是根据项目生成的，一个项目对应一个hash，所以会导致生成的文件同名，webpack不允许这么做，所以不能打包成功。

  ```js
  module.exports = {
      entry: {
          main: './src/index.js',
          vendor: ['lodash']
      },
      output: {
          path: path.resolve(__dirname, 'dist'),
          filename: '[hash].js'
      }
  }
  ```

- 题目二：以下能否打包成功，如果不能，是什么原因？

  - 答案：

    > 能，因为虽然是多入口文件打包，会生成多个文件，并且即便hash一样，由于filename是根据name和hash共同决定的，name是entry的key，key不同，所以生成的文件不同，所以可以打包成功。

  ```js
  module.exports = {
      entry: {
          main: './src/index.js',
          vendor: ['lodash']
      },
      output: {
          path: path.resolve(__dirname, 'dist'),
          filename: '[name].[hash].js'
      }
  }
  ```

- 题目三：上面的打包方式是否存在缺点，如果存在，则应该怎么优化？

  - 答案：

    > 存在缺陷。
    >
    > 首先，为什么我们需要使用哈希，主要是为了使用缓存，哈希不变，采取缓存的文件，哈希变了，采取新的文件，这样能够大大提高请求效率。
    >
    > 但是由于上面的配置是多入口文件打包，文件名使用hash的话，会导致其中一个入口文件有变化，项目的hash值就会变化，这样就使得没有变化的入口的hash也变了。那么没有变化的文件就无法读取缓存了。
    >
    > 所以，在这里使用hash是不合适的，可以采取chunkhash，chunkhash是根据入口文件和入口文件的依赖生成的，如果main发生变化，那么main对应的chunkhash会变化，而vendor不变的话，vendor对应的chunkhash是不变的，这样对于不变的文件依旧可以读取缓存。

- 题目四：已知在`./src/index.js`中`import './a.css'`，那么请问下面的打包方式是否存在缺点，如果存在，则应该怎么优化？

  - 答案：

    > 存在缺陷。
    >
    > 首先，output中的chunkhash是没有问题的，问题在于plugin的css的chunkhash。
    >
    > 这里css应该使用contenthash。原因如下：
    >
    > 由于已知入口文件main引入了a.css，那么插件MiniCssExtractPlugin会将css从入口文件main中抽离出来打包成单独的css文件，由于是从入口文件main中抽离出来的，所以main的chunkhash和css的chunkhash是一样的，因为chunkhash是根入口文件和入口文件的依赖相关。
    >
    > 这就存在了一个问题：当我main中的js代码发生了变化，那么这个chunkhash就变了，这样css的哈希也就跟着变了，但事实上，css并没有做修改，所以不需要变化哈希值。
    >
    > 所以，这里的css的哈希就可以使用contenthash，根据css的内容来变化，内容变了哈希就变，内容不变哈希就不变。

  ```js
  module.exports = {
      entry: {
          main: './src/index.js', // 这里有引入a.css
          vendor: ['lodash']
      },
      output: {
          path: path.resolve(__dirname, 'dist'),
          filename: '[name].[chunkhash].js'
      },
      plugin: [
          new MiniCssExtractPlugin({
  filename:'css/[chunkhash].css'
  }),
      ]
  }
  ```

#### 6. 其他问题：

- 问题一：一个入口文件就只能生成一个文件吗？

  - 答案：

    > 不是的，
    >
    > main可以生成两个文件，比如main.js和main.css，css是用插件从main.js中抽离出来的

- 问题二：生成hash的时候，对同一个内容，多次update，结果一样吗？

  - 答案：

    > 不一样。
    >
    > **.update(a).update(b)相当于.update(a+b)**

  ```js
  let hash1 = crypto.createHash('md5').update(content).digest('hex')
  let hash2 = crypto.createHash('md5').update(content).update(content).digest('hex')
  
  console.log(hash1 !== hash2) // true
  
  let hashA = crypto.createHash('md5').update('123').digest('hex')
  let hashB = crypto.createHash('md5').update('1').update('2').update('3').digest('hex')
  
  console.log(hashA === hashB) // true
  ```

### 25.webpack如何挂在全局变量

#### 1\.直接引入

```js
import _ from 'lodash'
console.log(_.join(['a', 'b', 'c'], '@'));
```

#### 2.插件引入

-   利用`webpack.ProvidePlugin`插件，如下例：
    -   这个插件会先`require`这个第三方库`lodash`，然后赋值给`_`，即：`let _= require('lodash')`。
    -   然后自动向每个模块内注入`_`变量
    -   这是注入在模块内的，所以全局变量window上是拿不到`_`的

> 所以这样配置后：就**不需要再去require或import这个库了**

```js
plugins: [
    new webpack.ProvidePlugin({
        _:'lodash'
    })
]
```

#### 3.`expose-loader`

-   上面的`webpack.ProvodePlugin`无法将第三方依赖放到全局对象上，而这个`expose-loader`可以做到，在调试的时候比较有用
-   注意点：
    -   将`expose-loader`添加到所有`loader`之前
    -   会向全局变量`window`上挂在`globalName`，也就是`window._`，如果`window`下已经有这个属性了，那么`override`为`true`就表示覆盖
    -   必须要在使用的地方require或import了之后，才会挂在到全局变量上

```js
// index.js
import _ from 'lodash' // 这里必须要引入，才会将_挂在到window上
console.log(_)
console.log(_.join(['a', 'b', 'c'], '@'))



// webpack.config.js
module: {
    rules: [
        {
            test: require.resolve('lodash'), // 获取lodash的绝对路径
            loader: 'expose-loader',
            options: { // 会向全局变量window上挂在globalName，也就是window._，如果window下已经有这个属性了，那么override为true就表示覆盖
                exposes: {
                    globalName: '_',
                    override: true
                }
            }
        }
    ]
}
```

#### 4\.`externals`

- 使用该属性，需要配合`script`引用第三方库的脚本，如下：

  ```js
  // html中
  <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js"></script>
  // webpack.config.js中
  externals: {
      jquery: '$',
  },
  // js代码中
  import $ from 'jquery'
  console.log($)
  ```

- 这里需要注意几点：

  -   externals代表的是外部依赖，需要用`script`去加载外部的依赖
  -   这种外部依赖是不会被webpack打包的
  -   external中的’ ′ 和 j s 代 码 中 的 ′ '和js代码中的' ′和js代码中的′'不能随便取，得是jquery内置的
  -   如此配置之后，window上能够取到’$’

- `externals`详解有一片文章，推荐阅读：[webpack externals详解](https://www.tangshuang.net/3343.html)

#### 5.`html-webpack-externals-plugin`

> 上述externals配置，需要三步骤，其实比较麻烦，那么可以使用`html-webpack-externals-plugin`插件一步到位，在[webpack](https://so.csdn.net/so/search?q=webpack&spm=1001.2101.3001.7020)配置中配置即可

- 使用

  ```js
  // webpack的配置：
  new HtmlWebpackExternalsPlugin({
    externals: [
      {
        module: 'jquery',
        entry: 'dist/jquery.min.js',
        global: 'jQuery',
      },
    ],
  })
  ```

  -   以上的entry可以先cdn地址，也可以写文件目录地址
  -   global就是挂在到window上的变量名称



### 简单实现webpack

`webpack.config.js`配置文件

```js
const path = require('path');
const RunPlugin = require('./myPlugins/run-plugin');
const DonePlugin = require('./myPlugins/done-plugin');
const EmitPlugin = require('./myPlugins/emmit-plugin');
module.exports = {
  mode: 'production',
  devtool: false,
  context: process.cwd(), // 上下文，如果想改变根目录，可以改这边。默认值就是当前命令执行的时候所在的目录（不是webpack.config.js的目录，是执行时的目录）
  entry: {
    entry1: './src/entry1.js',
    entry2: './src/entry2.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          path.resolve(__dirname, 'loaders', 'logger1-loader.js'),
          path.resolve(__dirname, 'loaders', 'logger2-loader.js')
        ]
      }
    ]
  },
  plugins: [
    new RunPlugin(),
    new DonePlugin(),
    new EmitPlugin()
  ]
}

```

然后开始手写webpack

- 创建`webpack.run.js`文件，该文件主要用于手动跑webpack
  - webpack一般会返回一个`compiler`，这个`compiler`有一个run方法，调用该方法可以启动编译

```js
const webpack = require('./myWebpack/myWebpack');
const webpackOptions = require('./webpack.config');
// compiler代表整个编译过程
const compiler = webpack(webpackOptions);
// 调用run方法，可以启动编译

compiler.run((err, stats) => {
  console.log(err)
  console.log(stats.toJson())
})
```

- 然后编写我们自己的webpack，也就是上面代码中引入的myWebpack
  - 这里主要做：
    - 参数合并
    - 加载插件
    - 执行compiler的run方法
    - 将compiler返回

```js
const Compiler = require('./Compiler');

function webpack(options){
  // 1. 初始化文件，从配置文件和Shell语句中读取并合并参数，得出最终的配置对象
  // console.log(process.argv); // 获取命令参数，参数与webpack.config.js同名的时候，参数会覆盖配置文件，也就是说参数的优先级更高
  let shellOptions = process.argv.slice(2).reduce((shellConfig, item) => {
    let [key, value] = item.split('=')
    shellConfig[key.slice(2)] = value;
    return shellConfig;
  }, {})
  let finalConfig = {...options, ...shellOptions};
  // console.log(finalConfig)
  // 2. 用上一步得到的参数初始化Compiler对象
  let compiler = new Compiler(finalConfig);
  // 3. 加载所有配置的插件
  let { plugins } = finalConfig;
  for (let plugin of plugins) {
    plugin.apply(compiler); 
    // 注册所有插件的事件，是通过tapable的tap来注册的，然后就是等待着合适的时机去触发事件，也就是调用tapable的call函数
    // 由于触发的时机是固定的，所以不同时机触发的插件，在注册的时候谁先谁后都无所谓，那么webpack的plugins中写的谁先谁后其实都无所谓。但是如果多个插件是统一时机触发的，那么就是谁先注册谁就先触发。
  }
  // 4. 执行compiler对象的run方法开始编译，调用run在外面，具体的run方法在Compiler类中

  // 最后，需要将compiler对象返回
  return compiler;
}
module.exports = webpack;

```

- 然后去实现`Compiler`类，该类主要是`run`和`compiler`方法

```js
let { SyncHook } = require('tapable');
let Complication = require('./complication');
let fs = require('fs');

class Complier{
  constructor(options){
    this.options = options;
    this.hooks = {// 类似run的钩子有四五十个，下面几个是比较典型的
      run: new SyncHook(), // 开始启动编译
      emit: new SyncHook(['assets']), // 会在将要写入文件的时候触发
      done: new SyncHook(), // 会在完成编译的时候触发 全部完成
    }
  }
  run(callback){ // 开始编译
    // 4. 执行compiler对象的run方法开始编译
    /* 下面都是编译过程 */
    // 首先是触发run钩子
    this.hooks.run.call();
    // 5. 根据配置中的entry找到入口文件
    // 开启编译
    this.compile(callback);
    // 监听入口文件的变化, 如果文件变化了，重新再开始编译
    Object.values(this.options.entry).forEach(entry => { // 考虑到多入口
      fs.watchFile(entry, () => this.compile(callback));
    })
    // 最后是触发done钩子
    this.hooks.done.call();
    /* 上面都是编译过程 */
    callback(null, {
      toJson(){
        return {
          files: [], // 产出哪些文件
          assets: [], // 生成哪些资源
          chunk: [], // 生成哪些代码块
          module: [], // 模块信息
          entries: [] // 入口信息
        }
      }
    })
  }
  compile(callback){
    let complication = new Complication(this.options, this.hooks);
    complication.make(callback);
  }
}

module.exports = Complier;
```

执行`compier`的时候，会调用`Complication`类

```js
const path = require('path');
const fs = require('fs');
const types = require('babel-types');
const parser = require('@babel/parser'); // 编译
const traverse = require("@babel/traverse").default; // 转换
const generator = require('@babel/generator').default; // 生成 新源码
const baseDir = toUnitPath(process.cwd()); // process.cwd()表示当前文件所在绝对路径，toUnitPath(路径)将路径分隔符统一转成正斜杠/

class Complication{ // 一次编译会有一个complication,会存放所有入口
  constructor(options, hooks){
    this.options = options;
    this.hooks = hooks;
    // 下面这些 webpack4中都是数组  但是webpack5中都换成了set，优化了下，防止重复的资源编译,当然数组也可以做到防止重复资源编译
    this.entries = []; // 存放所有的入口
    this.modules = []; // 存放所有的模块
    this.chunks = []; // 存放所有的代码块
    this.assets = {}; // 对象，key为文件名，value为文件编译后的源码，存放所有的产出的资源, this.assets就是文件输出列表
    this.files = []; // 存放所有的产出的文件
  }
  make(callback){
    // 5. 根据配置中的entry找出入口文件
    let entry = {};
    if (typeof this.options.entry === 'string') {
      entry.main = this.options.entry;
    } else {
      entry = this.options.entry;
    }
    // entry = {entry1: "./src/entry1.js", entry2: './src/entry2.js'}
    for (let entryName in entry) {
      // 获取入口文件的绝对路径，这里的this.options.context默认是process.cwd()，这个默认值在这边没做处理
      let entryFilePath = toUnitPath(path.join(this.options.context, entry[entryName]))
      // 6.从入口文件出发，调用所有配置的Loader对模块进行编译,返回一个入口模块
      let entryModule = this.buildModule(entryName, entryFilePath);
      // // 把入口module也放到this.modules中去
      // this.modules.push(entryModule);
      // 8.根据入口和模块之间的依赖关系，组装成一个个包含多个模块的Chunk
      let chunk = {
        name: entryName,
        entryModule,
        modules: this.modules.filter(item => item.name === entryName)
      };
      this.entries.push(chunk); // 代码块会放到entries和chunks中
      this.chunks.push(chunk); // 代码块会放到entries和chunks中
      // 9.再把每个Chunk转换成一个单独的文件加入到输出列表
      this.chunks.forEach(chunk => {
        let filename = this.options.output.filename.replace('[name]', chunk.name);
        // 这个this.assets就是文件输出列表, key为文件名，value为chunk的源码
        this.assets[filename] = getSource(chunk); // assets中key为文件名，value为chunk的源码
      })
      // 10.在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统
      this.files = Object.keys(this.assets);
      this.hooks.emit.call(this.assets)
      for(let fileName in this.assets){
        let filePath = path.join(this.options.output.path, fileName);
        fs.writeFileSync(filePath, this.assets[fileName], 'utf8');
      }
      // 最后调用callback，返回一个对象，对象内有toJSON方法
      callback(null, {
        toJson: () => {
          return {
            entries: this.entries,
            chunks: this.chunks,
            modules: this.modules,
            files: this.files,
            assets: this.assets
          }
        }
      });

    }

  }
  buildModule(name, modulePath){ // 参数第一个是代码块的名称，第二个是模块的绝对路径
    // 6.从入口文件出发，调用所有配置的Loader对模块进行编译,返回一个入口模块
    // 6.1 读取模块文件内容
    let sourceCode = fs.readFileSync(modulePath, 'utf-8');
    let rules = this.options.module.rules;
    let loaders = []; // 寻找匹配的loader
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].test.test(modulePath)) { // 如果当前文件路径能够匹配上loader的正则的，那么就调用这个loader去处理
        loaders = [...loaders, ...rules[i].use]
      }
    }
    // 用loader进行转换，从右往左，从下往上,在这里就是数组从右往左
    for (let i = loaders.length - 1; i>= 0; i--) {
      let loader = loaders[i];
      sourceCode = require(loader)(sourceCode)
    }
    // 7. 再找出该模块依赖的模块，再递归这个步骤，知道所有入口依赖的文件都经过了这个步骤的处理，得到入口与模块之间的依赖关系
    let moduleId = './' + path.posix.relative(baseDir, modulePath); // 当前模块的id
    let module = {
      id: moduleId, // 模块id，也就是相对于项目根目录的相对路径
      dependencies: [], // 模块依赖
      name // 模块名称
    }
    let ast = parser.parse(sourceCode, {sourceType: 'module'}); // 生成语法树
    traverse(ast, {
      // CallExpression这个节点代表方法调用
      CallExpression: ({ node }) => {
        if (node.callee.name === 'require') {
          let moduleName = node.arguments[0].value; // 获取require函数的参数 './title',也就是模块的相对路径
          let dirname = path.posix.dirname(modulePath); // 获取模块的所在目录(title文件的父文件夹) path.posix相当于把路径都转成/，不论是什么系统，都是正斜杠,如果不用posix的话，linux是正斜杠，windows是反斜杠
          let depModulePath = path.posix.join(dirname, moduleName); // 模块的绝对路径,但是可能没有后缀，
          let extensions = this.options.resolve.extensions; // 如果options中没有配置resolve，需要做判断，这边就暂时不写了
          depModulePath = tryExtensions(depModulePath, extensions); // 生成依赖的模块绝对路径，已经包含了扩展名了
          // 找到引用的模块的id,引用的模块的id的特点是：相对于根目录的路径
          let depModuleId = './' + path.posix.relative(baseDir, depModulePath);
          node.arguments = [types.stringLiteral(depModulePath)]; // 这个就是参数这个节点要变，因为原来是require('./title'),现在要变成require('./src/title.js'),这个types.stringLiteral就是用来修改参数的
          let alreadyImportedModuleIds = this.modules.map(item => item.id); // 遍历出已有的modules的moduleId
          // 把依赖模块的绝对路径放到依赖数组里面
          // if (!alreadyImportedModuleIds.includes(dependency.depModuleId)) { // 如果不存在，才放进this.modules数组，这样防止已经编译过的模块重复放到this.modules中
            module.dependencies.push({depModuleId, depModulePath});
          // }
          
        }
      }
    })
    let { code } = generator(ast);
    console.log(code, toUnitPath(this.options.context));
    module._source = code.replace(toUnitPath(this.options.context), '.');// 模块源代码指向语法树转换后的新生村的源代码
    // 7. 再找出该模块依赖的模块，再递归这个步骤，知道所有入口依赖的文件都经过了这个步骤的处理，得到入口与模块之间的依赖关系 这时候需要开始递归了
    module.dependencies.forEach(dependency => {
      let depModule = this.modules.find(item => item.id === dependency.depModuleId);
      // 判断模块是否已经被编译过了，如果编译过了直接push，如果没有编译过，那么就先编译，编译完了再push
      if (depModule) {
        this.modules.push({...depModule, name}); // 重新改下名字
      } else {
        let dependencyModule = this.buildModule(name, dependency.depModulePath); // 这个name为啥是一样的？？？？？？
        this.modules.push(dependencyModule);
      }
    })

    return module;
  }
}

function tryExtensions(modulePath, extensions){
  extensions.unshift('');// 为什么要加一个空串，因为有可能用户写的路径是带后缀的，所以路径跟空串结合就是路径，如果不加空串，用户如果路径带了后缀，那判断就是title.js.js title.js.jsx title.js.json
  for(let i = 0; i < extensions.length; i++){
    let filePath = modulePath + extensions[i];
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  throw new Error('Module not found')
}
function toUnitPath(modulePath){
  return modulePath.replace(/\\/g, '/');
}
function getSource(chunk){
  return `
  (() => {
      var modules = ({
          ${chunk.modules.map(module => `
                  "${module.id}":(module,exports,require)=>{
                      ${module._source}
                  }
              `).join(',')
          }
      });
      var cache = {};
      function require(moduleId) {
        var cachedModule = cache[moduleId];
        if (cachedModule !== undefined) {
          return cachedModule.exports;
        }
        var module = cache[moduleId] = {
          exports: {}
        };
        modules[moduleId](module, module.exports, require);
        return module.exports;
      }
      var exports = {};
      (() => {
       ${chunk.entryModule._source}
      })();
    })()
      ;
  `
}
module.exports = Complication;

```

webpack编译过程中有两个最重要的对象

1. Compiler 生产产品的工厂，代表整个编译过程
2. Compilation 代表一个生产过程，代表依次编译

```js
const fs = require("fs");
const path = require("path");
// 代表具体的一次编译，代表一次生产过程
class Complication{
    build(){
        console.log('编译一次')
    }
}
// 代表整个编译
class Compiler{
    run(){
        this.compile(); // 开始编译
        fs.watchFile(path.resolve(__dirname, './test.js'), () => {
            this.compile(); // 监听文件变化，一旦变化，我就开始编译
        })
    }
    compile(){
        let complication = new Complication();
        complication.build();
    }
}

const compiler = new Compiler()
compiler.run()

```

webpack插件，主要是调用apply方法，apply方法是webpack会去调用的。

apply方法参数为compiler。

实现最简单的一个emit-plugin

```js
class EmitPlugin{
  apply(compiler){
    compiler.hooks.emit.tap('emit', (assets) => {
      assets['assets.md'] = Object.keys(assets).join('\n');
      console.log('这是发射文件之前触发')
    })
  }
}

module.exports = EmitPlugin;
```

- path.join('a', 'b', 'c')在windows结果是a\b\c，在linux中是a/b/c

- path.posix.join('a', 'b', 'c')不管在哪个操作系统下，返回的都是a/b/c(都是linux的结果, 一般我们都希望用这个)

- path.win32.join('a', 'b', 'c')不管在哪个操作系统下，返回的都是a\b\c(都是windows的结果)

- process.cwd()表示当前文件所在绝对路径，路径分隔符是反斜杠\，一般来说我们需要手动转成linux下的正斜杠/，可以用正则replace替换


​	`slash`这个库，可以自动将反斜杠转成正斜杠
