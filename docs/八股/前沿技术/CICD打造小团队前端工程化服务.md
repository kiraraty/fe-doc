   

[![](https://p3-passport.byteimg.com/img/user-avatar/6439724dbd916ce15fb785b5525c0065~100x100.awebp)](https://juejin.cn/user/562551276978312)

2020年09月02日 20:11 ·  阅读 6611

![一条龙！CI / CD 、打造小团队前端工程化服务](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec7965cd4f0f431cbf2494b942338f01~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp)  

> 来用 vue / react + webpack + jenkins + verdaccio + yapi + nginx 搭建小前端团队的工程化服务吧

前端工程化大家多多少少都接触过一些

随便抓个小前端一问都知道：

“前端工程化？大家都知道啊，大概就这样”

![小前端工程化](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/538f454d137248e6bb6cf2efe72b7d5e~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

## 为什么要工程化

在我的理解有这几点：

**方便管理**、**专注开发**、**快速迭代等**

我们先说上图右边

组件化：组件化开发

自动化：CI/CD，帮我们持续自动完成构建代码、测试、交付&部署、通知等

API Mock：提供API Mock服务，不需要在代码里面加入多余额外的测试数据

组件化开发需要搭建npm私有库，自动化功能需要我们搭建CI/CD服务，API Mock需要部署API Mock服务，我们把上面需要搭建部署的服务，暂时叫做工程化环境服务吧

## 工程化环境服务的搭建

我们将要搭建的小前端团队工程化环境服务就这样↓：

![progress-all-wechat](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ef368432a454aaf81fad0c2347205e2~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

所有服务都部署在**docker**容器，一开始我们先逐个部署熟悉一下**docker**

最后我们会用**docker-compose**统一编排：快速部署、迁移备份等

| **工具** | **描述** |
| --- | --- |
| **jenkins** | 搭建 CI / CD 服务 |
| **verdaccio** | 搭建npm私有库 |
| **yapi** | 搭建 api mock server |
| **mongo** | 暂时就提供给yapi的 |
| **nginx** | 做基本的代理 |

别慌，docker基础非常简单的哈，会用到的都会讲

我们再来看一下 CI / CD 服务大概的工作

![CI-CD pipeline](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/240404e189ed4286bd941882c20dc3a7~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

CI / CD 流水线在代码push到仓库，接到仓库的webhook后开始执行

当然里面也设计了基础的，快速回滚策略等

## 从0到1开始搭建

从0到1的全面一步步搭建整套服务环境

我们将会学到的东西↓：

![FN-basics](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55ad905893ae4317af90f7558f9818d8~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp) 里面包含整套服务需要的知识点都会讲，减少你大量多余的搜索：

-   git：基本命令操作和分支策略
-   shell: shell 脚本的基础用法
-   centos：centos需要的基础知识点
-   docker：基础使用docker去创建镜像，容器，持久化数据卷等
-   jenkins：jenkins 多分支流水线等基础配置
-   nginx：如何开启gzip和代理等基础知识
-   npm：简单的发布包等
-   mongodb：基础知识点和操作

## 文章详细

教程大概两万字左右，60多张图，为了更方便学习其中部分图片是由多张合成

刚刚在这边上传好，因为在因为字数限制只能分成几篇文章来发，请谅解

1.  [从0到1，打造小团队前端工程化服务（1/3）](https://juejin.cn/post/6870371104335069192 "https://juejin.cn/post/6870371104335069192")
    
2.  [从0到1，打造小团队前端工程化服务（2/3）](https://juejin.cn/post/6870374265268076558 "https://juejin.cn/post/6870374265268076558")
    
3.  [从0到1，打造小团队前端工程化服务（3/3）](https://juejin.cn/post/6870377875653181447 "https://juejin.cn/post/6870377875653181447")
    

**为了更好更方便的学习，我写了一个小手册哈**

## 获取小手册

![docker](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87e19a89e0b043c783507ec324487eed~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

关注公众号：『前端小手册』，回复：小手册

就能获取PDF版本资源的下载

markdown文档我慢点出来哈，配合typora的night主题来看大概这样↓：

![handbook1](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8ae7109036c47d2b240a593dbb6b559~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

![handbook2](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a34b15574ed54151a8ca69ace2a15565~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

![handbook3](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9321df29a239403fa738273870600106~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

掘金这里我也会尽快上！

## 感谢你们的关注

最后是非常非常的希望能得到你们的关注啦~~

你们小小关注就是我们大大的动力啊，我们会给你们持续地推送原创和好文

这个是我们公众号的二维码

![code1](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02d83eeddd974db9a94999c4e44aeec1~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

![](https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/00ba359ecd0075e59ffbc3d810af551d.svg) 145

![](https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/3d482c7a948bac826e155953b2a28a9e.svg) 收藏