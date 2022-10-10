大家最近是不是经常听到 pnpm，我也一样。今天研究了一下它的机制，确实厉害，对 yarn 和 npm 可以说是降维打击。

那具体好在哪里呢？ 我们一起来看一下。

我们按照包管理工具的发展历史，从 npm2 开始讲起：

## npm2

用 node 版本管理工具把 node 版本降到 4，那 npm 版本就是 2.x 了。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4eef39cebc949859ff12c8d51e747e0~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

然后找个目录，执行下 npm init -y，快速创建个 package.json。

然后执行 npm install express，那么 express 包和它的依赖都会被下载下来：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8ad0f0e13d1404c93089bde5ae08112~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

展开 express，它也有 node\_modules：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ada5f744720c4cb7b4d846ee2d1bf81b~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

再展开几层，每个依赖都有自己的 node\_modules：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ff1d1c0cab14b65b905fe1e74db59a1~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

也就是说 npm2 的 node\_modules 是嵌套的。

这很正常呀？有什么不对么？

这样其实是有问题的，多个包之间难免会有公共的依赖，这样嵌套的话，同样的依赖会复制很多次，会占据比较大的磁盘空间。

这个还不是最大的问题，致命问题是 windows 的文件路径最长是 260 多个字符，这样嵌套是会超过 windows 路径的长度限制的。

当时 npm 还没解决，社区就出来新的解决方案了，就是 yarn：

## yarn

yarn 是怎么解决依赖重复很多次，嵌套路径过长的问题的呢？

铺平。所有的依赖不再一层层嵌套了，而是全部在同一层，这样也就没有依赖重复多次的问题了，也就没有路径过长的问题了。

我们把 node\_modules 删了，用 yarn 再重新安装下，执行 yarn add express：

这时候 node\_modules 就是这样了：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71906633d465460183c3eb880391bf2e~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

全部铺平在了一层，展开下面的包大部分是没有二层 node\_modules 的：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52e6392c33f04f7a949c07fa7d65d358~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

当然也有的包还是有 node\_modules 的，比如这样：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd0a3971237445aea60f4de1c13250a7~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

为什么还有嵌套呢？

因为一个包是可能有多个版本的，提升只能提升一个，所以后面再遇到相同包的不同版本，依然还是用嵌套的方式。

npm 后来升级到 3 之后，也是采用这种铺平的方案了，和 yarn 很类似：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79f93e2855514117bb73de52284d86fa~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

当然，yarn 还实现了 yarn.lock 来锁定依赖版本的功能，不过这个 npm 也实现了。

yarn 和 npm 都采用了铺平的方案，这种方案就没有问题了么？

并不是，扁平化的方案也有相应的问题。

最主要的一个问题是幽灵依赖，也就是你明明没有声明在 dependencies 里的依赖，但在代码里却可以 require 进来。

这个也很容易理解，因为都铺平了嘛，那依赖的依赖也是可以找到的。

但是这样是有隐患的，因为没有显式依赖，万一有一天别的包不依赖这个包了，那你的代码也就不能跑了，因为你依赖这个包，但是现在不会被安装了。

这就是幽灵依赖的问题。

而且还有一个问题，就是上面提到的依赖包有多个版本的时候，只会提升一个，那其余版本的包不还是复制了很多次么，依然有浪费磁盘空间的问题。

那社区有没有解决这俩问题的思路呢？

当然有，这不是 pnpm 就出来了嘛。

那 pnpm 是怎么解决这俩问题的呢？

## pnpm

回想下 npm3 和 yarn 为什么要做 node\_modules 扁平化？不就是因为同样的依赖会复制多次，并且路径过长在 windows 下有问题么？

那如果不复制呢，比如通过 link。

首先介绍下 link，也就是软硬连接，这是操作系统提供的机制，硬连接就是同一个文件的不同引用，而软链接是新建一个文件，文件内容指向另一个路径。当然，这俩链接使用起来是差不多的。

如果不复制文件，只在全局仓库保存一份 npm 包的内容，其余的地方都 link 过去呢？

这样不会有复制多次的磁盘空间浪费，而且也不会有路径过长的问题。因为路径过长的限制本质上是不能有太深的目录层级，现在都是各个位置的目录的 link，并不是同一个目录，所以也不会有长度限制。

没错，pnpm 就是通过这种思路来实现的。

再把 node\_modules 删掉，然后用 pnpm 重新装一遍，执行 pnpm install。

你会发现它打印了这样一句话：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b2d51d9a17743a4bafc42f1bbfd310c~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

包是从全局 store 硬连接到虚拟 store 的，这里的虚拟 store 就是 node\_modules/.pnpm。

我们打开 node\_modules 看一下：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b4dc807ca6e4ae7a955c8dd6385cb46~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

确实不是扁平化的了，依赖了 express，那 node\_modules 下就只有 express，没有幽灵依赖。

展开 .pnpm 看一下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/65a69589bd534fdd97bdbeb6e3e1024c~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

所有的依赖都在这里铺平了，都是从全局 store 硬连接过来的，然后包和包之间的依赖关系是通过软链接组织的。

比如 .pnpm 下的 expresss，这些都是软链接，

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c50d8dc8a2a4466ba9e5eccd5c15614e~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

也就是说，所有的依赖都是从全局 store 硬连接到了 node\_modules/.pnpm 下，然后之间通过软链接来相互依赖。

官方给了一张原理图，配合着看一下就明白了：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/326a2090786e4d16b2d6fce25e876680~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

这就是 pnpm 的实现原理。

那么回过头来看一下，pnpm 为什么优秀呢？

首先，最大的优点是节省磁盘空间呀，一个包全局只保存一份，剩下的都是软硬连接，这得节省多少磁盘空间呀。

其次就是快，因为通过链接的方式而不是复制，自然会快。

这也是它所标榜的优点：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ba8815b36b3498ea4a3c2248d192bd6~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

相比 npm2 的优点就是不会进行同样依赖的多次复制。

相比 yarn 和 npm3+ 呢，那就是没有幽灵依赖，也不会有没有被提升的依赖依然复制多份的问题。

这就已经足够优秀了，对 yarn 和 npm 可以说是降维打击。

## 总结

pnpm 最近经常会听到，可以说是爆火。本文我们梳理了下它爆火的原因：

npm2 是通过嵌套的方式管理 node\_modules 的，会有同样的依赖复制多次的问题。

npm3+ 和 yarn 是通过铺平的扁平化的方式来管理 node\_modules，解决了嵌套方式的部分问题，但是引入了幽灵依赖的问题，并且同名的包只会提升一个版本的，其余的版本依然会复制多次。

pnpm 则是用了另一种方式，不再是复制了，而是都从全局 store 硬连接到 node\_modules/.pnpm，然后之间通过软链接来组织依赖关系。

这样不但节省磁盘空间，也没有幽灵依赖问题，安装速度还快，从机制上来说完胜 npm 和 yarn。

pnpm 就是凭借这个对 npm 和 yarn 降维打击的。