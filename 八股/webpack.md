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

![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fca3177d53eb4f98b60612cd544dfe45~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

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

***\*用法\****：

```shell
# 环境要求:
webpack 4.x || 5.x | babel-loader 8.x | babel 7.x

# 安装依赖包:
npm install -D babel-loader @babel/core @babel/preset-env webpack
复制代码
```

然后，我们需要建立一个Babel配置文件来指定编译的规则。

Babel配置里的两大核心：插件数组(plugins) 和 预设数组(presets)。

Babel 的预设（preset）可以被看作是一组Babel插件的集合，由一系列插件组成。

***\*常用预设：\****

- @babel/preset-env       ES2015+ 语法
- @babel/preset-typescript  TypeScript
- @babel/preset-react      React
- @babel/preset-flow       Flow

***\*插件和预设的执行顺序：\****

- 插件比预设先执行
- 插件执行顺序是插件数组从前向后执行
- 预设执行顺序是预设数组从后向前执行

***\*webpack配置代码：\****

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

复制代码
```

***\*推荐阅读：\****

- [babel配置文件相关文档](https://link.juejin.cn/?target=https%3A%2F%2Fwww.babeljs.cn%2Fdocs%2Fconfiguration)
- [插件手册](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fjamiebuilds%2Fbabel-handbook%2Fblob%2Fmaster%2Ftranslations%2Fzh-Hans%2Fplugin-handbook.md)

##### 2. ts-loader

为webpack提供的 TypeScript loader，打包编译Typescript

***\*安装依赖：\****

```
npm install ts-loader --save-dev
npm install typescript --dev
```

***\*webpack配置如下：\****

```javascript
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

还需要typescript编译器的配置文件***\*tsconfig.json\****：

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

***\*用法：\****

只需将 loader 添加到您的配置中，并设置 options。

***\*js代码里引入markdown文件：\****

```javascript
// file.js

import md from 'markdown-file.md';

console.log(md);
```

***\*webpack配置：\****

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

该loader可以搭配***\*svgo-loader\**** 一起使用，svgo-loader是svg的优化器，它可以删除和修改SVG元素，折叠内容，移动属性等

**用途：可以用来开发统一的图标管理库**

![svg-sprite-loader.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1c69247ea5647f9b6339de53b2d1b3c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

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

复制代码
```

原理：利用 svg 的 symbol 元素，将每个 icon 包裹在 symbol 中，通过 use 使用该 symbol。

##### 8. style-loader

通过注入<style>标签将CSS插入到DOM中

***\*注意：\****

- 如果因为某些原因你需要将CSS提取为一个文件(即不要将CSS存储在JS模块中)，此时你需要使用插件 ***\*mini-css-extract-plugin\****(后面的Pugin部分会介绍)；
- 对于development模式(包括 webpack-dev-server)你可以使用style-loader，因为它是通过<style></style>标签的方式引入CSS的，加载会更快；
- 不要将 style-loader 和 mini-css-extract-plugin 针对同一个CSS模块一起使用！

##### 9. css-loader

仅处理css的各种加载语法(@import和url()函数等),就像 js 解析 import/require() 一样

##### 10. postcss-loader

PostCSS 是一个允许使用 JS 插件转换样式的工具。 这些插件可以检查（lint）你的 CSS，支持 CSS Variables 和 Mixins， 编译尚未被浏览器广泛支持的先进的 CSS 语法，内联图片，以及其它很多优秀的功能。

PostCSS 在业界被广泛地应用。PostCSS 的 ***\*autoprefixer\**** 插件是最流行的 CSS 处理工具之一。

autoprefixer 添加了浏览器前缀，它使用 Can I Use 上面的数据。

***\*安装\****

```js
npm install postcss-loader autoprefixer --save-dev
```

***\*代码示例：\****

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

***\*启动方式有2种：\****

- 引入插件webpack.HotModuleReplacementPlugin 并且设置devServer.hot: true
- 命令行加 --hot参数

***\*package.json配置：\****

```json
{
  "scripts": {
    "start": "NODE_ENV=development webpack serve --progress --mode=development --config=scripts/dev.config.js --hot"
  }
}
```

***\*webpack的配置如下：\****

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

***\*注意：HMR 绝对不能被用在生产环境。\****

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

***\*启动服务：\****

- 生产环境查看：NODE_ENV=production npm run build
- 开发环境查看：NODE_ENV=development npm run start

***\*最终效果：\****

![analyzer.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e29152944c584e4b986482da03937dd5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

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



### 3.Webpack打包的结构

### 4.热更新原理

![image-20220330160910633](https://s2.loli.net/2022/03/30/XJh4lPRMTBOE6Zz.png)

`HMR`即`Hot Module Replacement`是指当你对代码修改并保存后，`webpack`将会对代码进行重新打包，并将改动的模块发送到浏览器端，浏览器用新的模块替换掉旧的模块，去实现局部更新页面而非整体刷新页面。

![core](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/9/2/16cf203824359397~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

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

### 5.devServe配置

解决跨域问题

devServer.proxy可以代理开发环境中的url

添了`changeOrigin: true`后才可跨域

从跨域的原理看来，浏览器就是通过判断请求头中的origin结合请求的url来判断是否跨域的，那是不是可以更改origin来骗过浏览器？不行的   报错：Refused to set unsafe header "Origin"

header中的origin是浏览器设置的，无法自行更改它

设置了`changeOrigin`只是更改了request请求中的host，并不是origin

devServer中的proxy就相当于charles进行url的代理，在`sxx()`执行后发送的请求是`http://0.0.0.0:8080/robot/send?XXXXXXXX`，我们是在0.0.0.0:8080下，当然不会限制这样的请求的发送，然后devServer的proxy通过配置将host更改为`oapi.dingtalk.com`，该请求就能正常进行

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/17/172218f8ef3f7e3d~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)



### 6.性能优化  treeShaking原理

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
复制代码
```

而 ESM 方案则从规范层面规避这一行为，它要求所有的导入导出语句只能出现在模块顶层，且导入导出的模块名必须为字符串常量，这意味着下述代码在 ESM 方案下是非法的：

```Javascript
if(process.env.NODE_ENV === 'development'){
  import bar from 'bar';
  export const foo = 'foo';
}
复制代码
```

所以，ESM 下模块之间的依赖关系是高度确定的，与运行状态无关，编译工具只需要对 ESM 模块做静态分析，就可以从代码字面量中推断出哪些模块值未曾被其它模块使用，这是实现 Tree Shaking 技术的必要条件。

Webpack 中，Tree-shaking 的实现一是先**标记**出模块导出值中哪些没有被用过，二是使用 Terser 删掉这些没被用到的导出语句。标记过程大致可划分为三个步骤：

- Make 阶段，收集模块导出变量并记录到模块依赖关系图 ModuleGraph 变量中
- Seal 阶段，遍历 ModuleGraph 标记模块导出变量有没有被使用
- 生成产物时，若变量没有被其它模块使用则删除对应的导出语句

### 7.webpack 中，module，chunk 和 bundle 的区别是什么？

![image-20200518210532171](https://image-1255652541.cos.ap-shanghai.myqcloud.com/uPic/image-20200518210532171.png)

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

### 10.手写plugin

`webpack`基于发布订阅模式，在运行的生命周期中会广播出许多事件，插件通过监听这些事件，就可以在特定的阶段执行自己的插件任务，从而实现自己想要的功能

`compiler`和`compilation`是`Webpack`两个非常核心的对象，其中`compiler`暴露了和 `Webpack`整个生命周期相关的钩子（[compiler-hooks](https://link.juejin.cn?target=https%3A%2F%2Fwebpack.js.org%2Fapi%2Fcompiler-hooks%2F)），而`compilation`则暴露了与模块和依赖有关的粒度更小的事件钩子（[Compilation Hooks](https://link.juejin.cn?target=https%3A%2F%2Fwebpack.js.org%2Fapi%2Fcompilation-hooks%2F)）。

`Plugin`的开发和开发`Loader`一样，需要遵循一些开发上的规范和原则：

- 插件必须是一个函数或者是一个包含 `apply` 方法的对象，这样才能访问`compiler`实例；
- 传给每个插件的 `compiler` 和 `compilation` 对象都是同一个引用，若在一个插件中修改了它们身上的属性，会影响后面的插件;
- 异步的事件需要在插件处理完任务时调用回调函数通知 `Webpack` 进入下一个流程，不然会卡住;

### 11.Babel原理

大多数JavaScript Parser遵循 `estree` 规范，Babel 最初基于 `acorn` 项目(轻量级现代 JavaScript 解析器) Babel大概分为三大部分：

- 解析：将代码转换成 AST
  - 词法分析：将代码(字符串)分割为token流，即语法单元成的数组
  - 语法分析：分析token流(上面生成的数组)并生成 AST
- 转换：访问 AST 的节点进行变换操作生产新的 AST
  - [Taro](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FNervJS%2Ftaro%2Fblob%2Fmaster%2Fpackages%2Ftaro-transformer-wx%2Fsrc%2Findex.ts%23L15)就是利用 babel 完成的小程序语法转换
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

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e3fecbe47be9400ea4cf206d71a34f9c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

而Vite 不同的是 执行vite serve 时，内部直接启动了web Server, 并不会先编译所有的代码文件。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6dce39d902264a5a8aba4936b48c65ec~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

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

```
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

```
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

#### webpack缺点一。缓慢的服务器启动

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

