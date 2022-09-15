   

[![](https://p3-passport.byteimg.com/img/user-avatar/a792f784efbff7df088b0d6b572c3645~100x100.awebp)](https://juejin.cn/user/3491704662669469)

2020年10月09日 17:35 ·  阅读 5071

![前端音视频之WebRTC初探](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ec7f209c9124c5a9c2a5a454931642d~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp)  

**「观感度：🌟🌟🌟🌟🌟」**

**「口味：干锅虾球」**

**「烹饪时间：10min」**

> 本文已收录在前端食堂同名仓库Github [github.com/Geekhyt](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FGeekhyt%2Ffront-end-canteen "https://github.com/Geekhyt/front-end-canteen")，欢迎光临食堂，如果觉得酒菜还算可口，赏个 Star 对食堂老板来说是莫大的鼓励。

在上个系列专栏[前端音视频的那些名词](https://juejin.cn/post/6861941219938418702 "https://juejin.cn/post/6861941219938418702")中，我们对比特率、帧率、分辨率、容器格式以及编码格式有所了解，如果还没看过的同学请点击上方链接自行跳转。

今天，我们来一起学习一下 WebRTC，相信你已经对这个前端音视频网红儿有所耳闻了。

## WebRTC Web Real-Time Communication 网页即时通信

WebRTC 于 2011 年 6 月 1 日开源，并在 Google、Mozilla、Opera 等大佬们的支持下被纳入 W3C 推荐标准，它给浏览器和移动应用提供了即时通信的能力。

## WebRTC 优势及应用场景

### 优势

-   跨平台(Web、Windows、MacOS、Linux、iOS、Android)
-   实时传输
-   音视频引擎
-   免费、免插件、免安装
-   主流浏览器支持
-   强大的打洞能力

### 应用场景

在线教育、在线医疗、音视频会议、即时通讯工具、直播、共享远程桌面、P2P网络加速、游戏(狼人杀、线上KTV)等。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/76661f58a5b445978a7a38fe0c4a12ad~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

（有喜欢玩狼人杀的同学吗？有时间可以一起来一局，给我一轮听发言的时间，给你裸点狼坑，一个坑容错。）

## WebRTC 整体架构

拉回来，我们看一看 WebRTC 的整体架构，我用不同的颜色标识出了各层级所代表的含义。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8e377fb10a54b7fb9e94c6545402762~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

-   Web 应用
-   Web API
-   WebRTC C++ API
-   Session Management 信令管理
-   Transport 传输层
-   Voice Engine 音频引擎
-   Video Engine 视频处理引擎

我们再来看下核心的模块：

### Voice Engine 音频引擎

VoIP 软件开发商 Global IP Solutions 提供的 GIPS 引擎可以说是世界上最好的语音引擎，谷歌大佬一举将其收购并开源，也就是 WebRTC 中的 音频引擎。

-   iSAC：WebRTC 音频引擎的默认编解码器，针对 VoIP 和音频流的宽带和超宽带音频编解码器。
-   iLBC：VoIP 音频流的窄带语音编解码器。
-   NetEQ For Voice：针对音频软件实现的语音信号处理元件。NetEQ 算法是自适应抖动控制算法以及语音包丢失隐藏算法，能够有效的处理网络抖动和语音包丢失时对语音质量产生的影响。
-   Acoustic Echo Canceler：AEC，回声消除器。
-   Noise Reduction：NR，噪声抑制。

### Video Engine 视频处理引擎

VPx 系列视频编解码器是 Google 大佬收购 ON2 公司后开源的。

-   VP8：视频图像编解码器，WebRTC 视频引擎默认的编解码器。
-   Video Jitter Buffer：视频抖动缓冲器模块。
-   Image Enhancements：图像质量增强模块。

## WebRTC 通信原理

### 媒体协商

媒体协商也就是让双方可以找到共同支持的媒体能力，比如双方都支持的编解码器，这样才能实现彼此之间的音视频通信。

#### SDP Session Description Protocal

媒体协商所交换的数据就是 SDP，说是协议，其实 SDP 并不是一个真正的协议，它就是一种描述各端“能力”的数据格式。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/49616ae9f0414a5c9b5fe20418b6bce0~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

上图所示就是 SDP 的一部分，详细内容请参考：[SDP: Session Description Protocol](https://link.juejin.cn/?target=https%3A%2F%2Ftools.ietf.org%2Fhtml%2Frfc4566 "https://tools.ietf.org/html/rfc4566")

或者参考卡神的这篇文章：[WebRTC：会话描述协议SDP](https://link.juejin.cn/?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F75492311 "https://zhuanlan.zhihu.com/p/75492311")

### 网络协商

#### ICE Interactive Connectivity Establishment 互动式连接建立

想要建立连接，我们要需要拿到双方 IP 和端口的信息，在当下复杂的网络环境下，ICE 统一了各种 NAT 穿越技术(STUN、TURN)，可以让客户端成功地穿透远程用户与网络之间可能存在的各类防火墙。

#### STUN、TURN

STUN：简单 UDP 穿透 NAT，可以使位于 NAT(或多重 NAT) 后的客户端找出自己的公网 IP 地址，以及查出自己位于哪种类型的 NAT 及 NAT 所绑定的 Internet 端口。

我们知道，NAT 主要有以下四个种类：

-   完全锥型 NAT
-   IP 限制锥型
-   端口限制锥型
-   对称型

前三种都可以使用 STUN 穿透，而面对第四种类型，也是大型公司网络中经常采用的对称型 NAT ，这时的路由器只会接受之前连线过的节点所建立的连线。

那么想要处理这种网络情况，我们就需要使用 TURN (中继穿透 NAT) 技术。

TURN 是 STUN 的一个扩展，其主要添加了中继功能。在 STUN 服务器的基础上，再添加几台 TURN 服务器，如果 STUN 分配公网 IP 失败，则可以通过 TURN 服务器请求公网 IP 地址作为中继地址，将媒体数据通过 TURN 服务器进行中转。

#### 信令服务器 Signal Server

拿到了双方的媒体信息(SDP)和网络信息(Candidate)后，我们还需要一台信令服务器作为中间商来转发交换它们。

信令服务器还可以实现一些 IM 功能，比如房间管理，用户进入、退出等。

## 小结

本文我们了解了 WebRTC 优势及应用场景、WebRTC 的整体架构及主要模块构成以及 WebRTC 的通信原理。这些基础知识和概念是需要我们牢记的，大家要记牢～

## 参考

-   《从 0 打造音视频直播系统》 李超
-   《WebRTC 音视频开发 React+Flutter+Go 实战》 亢少军
-   [webrtc.github.io/webrtc-org/…](https://link.juejin.cn/?target=https%3A%2F%2Fwebrtc.github.io%2Fwebrtc-org%2Farchitecture%2F "https://webrtc.github.io/webrtc-org/architecture/")
-   [developer.mozilla.org/zh-CN/docs/…](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWebRTC_API "https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API")
-   [www.w3.org/TR/webrtc/](https://link.juejin.cn/?target=https%3A%2F%2Fwww.w3.org%2FTR%2Fwebrtc%2F "https://www.w3.org/TR/webrtc/")

## ❤️爱心三连击

1.如果你觉得食堂酒菜还合胃口，就点个赞支持下吧，你的**「赞」**是我最大的动力。

2.关注公众号前端食堂，**「吃好每一顿饭！」**

3.点赞、评论、转发 === 催更！

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23ba2ae6a7144a4f8b2a1f36f0d34582~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

![](https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/00ba359ecd0075e59ffbc3d810af551d.svg) 62

![](https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/3d482c7a948bac826e155953b2a28a9e.svg) 收藏