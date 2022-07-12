# SVG 入门指南



## SVG 简介

SVG，即可缩放矢量图形(Scalable Vector Graphics)，是一种 XML 应用，可以以一种简洁、可移植的形式表示图形信息。目前，人们对 SVG 越来越感兴趣。大多数现代浏览器都能显示 SVG 图形，并且大多数矢量绘图软件都能导出 SVG 图形。SVG 主要可以概括为以下几点：

-   SVG 指可伸缩矢量图形
-   SVG 用来定义网络的基于矢量的图形
-   SVG 使用 XML 格式定义图形
-   SVG 图像在放大或改变尺寸的情况下其图形质量不会有所损失
-   SVG 是万维网联盟的标准
-   SVG 与诸如 DOM 和 XSL 之类的 W3C 标准是一个整体

#### SVG 的应用

1.  图表视图(echart)、地图视图(WEB-GIS)
2.  形象(AI)的全网应用
3.  UI 产品的设计
4.  SVG 动画

#### SVG 浏览器的兼容情况

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed27765d2c93b~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

#### SVG 与 Canvas 区别

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed278c08595bb~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

## 图形系统

计算机中描述图形信息的两大系统是栅格图形和矢量图形。

#### 栅格图形

在栅格图形系统中，图像被表示为图片元素或者像素的长方形数组如下图片所示。每个像素用其 RGB 颜色值或者颜色表内的索引表示。这一系列也称为 **位图**，通过以某种压缩格式存储。由于大多数现代显示设备也是栅格设备，显示图像时仅需要一个阅读器将位图解压并将它传输到屏幕上。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed27bb9749f54~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

#### 矢量图形

矢量图是基于数学的描述，如下图的多啦A梦，他的头是一条怎么样的贝塞尔曲线，它的参数是什么及用什么颜色来填充贝塞尔曲线，通过这种方式描述图片就是**矢量图形**。

想象一下在一张绘图纸上作图的过程，栅格图形的工作就像是描述哪个方格应该填充什么颜色，而矢量图形的工作则像是描述要绘制从某个点到另一个点的直线或曲线。

## 创建 SVG 图像

#### SVG 文档基本结构

如下所示，是一个 SVG 文档结构：

```
<svg width='140' height='170' xmlns='http://wwww.w3.org/2000/svg'>
  <title>Cat</title>
  <desc>Stick Figure of Cat</desc>
  <!-- 在这里绘制图像 -->
</svg>
```

根元素 `<svg>` 以像素为单位定义了整个图像的 `width` 和 `height`，还通过 `xmlns` 属性定义了 **SVG** 的命名空间。`<title>` 元素的内容可以被阅读器显示在标题栏上或者是作为鼠标指针指向图像时的提示， `<desc>` 元素允许咱们为图像定义完整的描述信息。

#### 基本形状和属性

**基本图形**

`<rect>`、`<circle>`、`<ellipse>`、`<line>`、`<polyline>`、`<polygon>`

**基本属性**

`fill`、`stroke`、`stroke-width`、`transform`

#### 基本形状 --- 圆形

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed27eb8768295~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

咱们可以通过 `<circle>` 元素来绘制猫的脸部。元素属性的中心点 `x` 坐标和 `y` 坐标以为半径。`点(0,0)` 为图像左上角。水平向右移动时 `x` 坐标增大，垂直向下移动时 `y` 坐标增大。为了避免一些误会，API 语义就很明确了，点 `(cx, cy)` 就表示圆心的位置，`r` 表示圆的半径。

绘图的颜色是表现的一部分，表现信息包含在 `style` 属性中，这里的轮廓颜色为黑色，填充颜色为 `none` 以使猫的脸部透明。

```
<svg width='140' heiight='170' xmlns='http://wwww.w3.org/2000/svg'>
  <title>Cat</title>
  <desc>Stick Figure of Cat</desc>
  <!-- 在这里绘制图像 -->
  <circle cx='70' cy='95' r='50' style='stroke:black; fill:none'></circle>
</svg>      
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed286810de3de~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

#### 指定样式的属性

接着在添加两个圆表示两个眼睛。上面的 `stroke` 与 `fill` 是写在 `style` 里面的，但是 **SVG** 也允许咱们使用单独的属性，而不用全部写在 `style` 内，如下所示：

```
<svg width='140' heiight='170' xmlns='http://wwww.w3.org/2000/svg'>
  <title>Cat</title>
  <desc>Stick Figure of Cat</desc>
  <!-- 在这里绘制图像 -->
  <circle cx='70' cy='95' r='50' style='stroke:black; fill:none'></circle>
  <circle cx='55' cy='80' r='5' stroke='black' fill='#3339933'></circle>
  <circle cx='85' cy='80' r='5' stroke='black' fill='#3339933'></circle>
</svg>
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed28862ce8167~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

#### 图形对象分组

接着使用两个 `<line>` 元素在猫的右脸上添加胡须，先看下线的示意图：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed289d6d4a4f5~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

这很好理解，就不多说了。 这里我们需要把胡须作为一个部件，并包装在分组元素 `<g>` (后面会讲)里面，然后给下 `id` ，如下所示：

```
<svg width='140' heiight='170' xmlns='http://wwww.w3.org/2000/svg'>
  <title>Cat</title>
  <desc>Stick Figure of Cat</desc>
  <!-- 在这里绘制图像 -->
  <circle cx='70' cy='95' r='50' style='stroke:black; fill:none'></circle>
  <circle cx='55' cy='80' r='5' stroke='black' fill='#3339933'></circle>
  <circle cx='85' cy='80' r='5' stroke='black' fill='#3339933'></circle>
  <g id='whiskers'>
    <line x1='75' y1='95' x2='135' y2='85' style='stroke:black'></line>
    <line x1='75' y1='95' x2='135' y2='105' style='stroke:black'></line>
  </g>
</svg>
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed28b7dba6f69~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

#### 图形对象分组

接着使用 `<use>` 复用胡须分组并将它变换(transfrom) 为左侧胡须，如下图所示，首先在 `scale` 变换中对 `x` 坐标乘以 `-1`，翻转坐标系统。这意味原始坐标系统中的点`(75, 95)` 现在位于 `(-75, 95)`。接着通过 `translate` 向左平移调整对应的位置。

```
<svg width='140' heiight='170' xmlns='http://wwww.w3.org/2000/svg'>
  <title>Cat</title>
  <desc>Stick Figure of Cat</desc>
  <!-- 在这里绘制图像 -->
  <circle cx='70' cy='95' r='50' style='stroke:black; fill:none'></circle>
  <circle cx='55' cy='80' r='5' stroke='black' fill='#3339933'></circle>
  <circle cx='85' cy='80' r='5' stroke='black' fill='#3339933'></circle>
  <g id='whiskers'>
    <line x1='75' y1='95' x2='135' y2='85' style='stroke:black'></line>
    <line x1='75' y1='95' x2='135' y2='105' style='stroke:black'></line>
  </g>
  <use xlink:href="#whiskers" transform='scale(-1 1) translate(-140 0)' ></use>
</svg>
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed28cfcc50cba~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

#### 其他基本图形

如下图所示，咱们使用 `<polyline>` 元素构建嘴和耳朵，它接受一对 `x` 和 `y` 坐标为 `points` 属性的值。你可以使用空格或者逗号分隔这些数值。

```
<svg width='140' heiight='170' xmlns='http://wwww.w3.org/2000/svg'>
  <title>Cat</title>
  <desc>Stick Figure of Cat</desc>
  <!-- 在这里绘制图像 -->
  <circle cx='70' cy='95' r='50' style='stroke:black; fill:none'></circle>
  <circle cx='55' cy='80' r='5' stroke='black' fill='#3339933'></circle>
  <circle cx='85' cy='80' r='5' stroke='black' fill='#3339933'></circle>
  <g id='whiskers'>
    <line x1='75' y1='95' x2='135' y2='85' style='stroke:black'></line>
    <line x1='75' y1='95' x2='135' y2='105' style='stroke:black'></line>
  </g>
  <use xlink:href="#whiskers" transform='scale(-1 1) translate(-140 0)' ></use>
  <!-- 耳朵 -->
  <polyline points='108 62,90 10, 70 45, 50, 10, 32, 62'
    style='stroke:black; fill:none' />
  <!-- 嘴 -->
  <polyline points='35 110,45 120, 95 120, 105, 110'
    style='stroke:black; fill:none'/>
</svg>
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed28e769acd01~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

#### 路径

所有的基本形状都是通用的 `<path>` 元素的快捷写法。接着使用 `<path>` 元素为猫添加鼻子。如下所示的代码，翻译过来就是 "移动到坐标`(75, 90)`。绘制一条到坐标`(65,90)` 的直线。然后以 `x` 半径为 `5`、`y` 半径为 `10` 绘制一个椭圆，最后回到坐标 `(75, 90)` 处"

```
<svg width='140' heiight='170' xmlns='http://wwww.w3.org/2000/svg'>
  <title>Cat</title>
  <desc>Stick Figure of Cat</desc>
  <!-- 在这里绘制图像 -->
  <circle cx='70' cy='95' r='50' style='stroke:black; fill:none'></circle>
  <circle cx='55' cy='80' r='5' stroke='black' fill='#3339933'></circle>
  <circle cx='85' cy='80' r='5' stroke='black' fill='#3339933'></circle>
  <g id='whiskers'>
    <line x1='75' y1='95' x2='135' y2='85' style='stroke:black'></line>
    <line x1='75' y1='95' x2='135' y2='105' style='stroke:black'></line>
  </g>
  <use xlink:href="#whiskers" transform='scale(-1 1) translate(-140 0)' ></use>
  <!-- 耳朵 -->
  <polyline points='108 62,90 10, 70 45, 50, 10, 32, 62'
    style='stroke:black; fill:none' />
  <!-- 嘴 -->
  <polyline points='35 110,45 120, 95 120, 105, 110'
    style='stroke:black; fill:none'/>
  <!-- 鼻子 -->
  <path d='M 75 90 L 65 90 A 5 10 0 0 0 75 90'
    style='stroke:black; fill:#ffcccc'
  />
</svg>
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed28ff8730118~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

#### 路径

由于这只是一个简单的图形，用户可能看不出这是一只猫，所以咱们可以使用 元素添加一些文本注释。在 元素中，x 和 y 属性用于指定文本的位置，如下所示：

```
<svg width='140' height='170' 
  xmlns='http://wwww.w3.org/2000/svg'
  xmlns:xlink='http://wwww.w3.org/1999/xlink'>
  <title>Cat</title>
  <desc>Stick Figure of Cat</desc>
  <!-- 在这里绘制图像 -->
  <circle cx='70' cy='95' r='50' style='stroke:black; fill:none'></circle>
  <circle cx='55' cy='80' r='5' stroke='black' fill='#3339933'></circle>
  <circle cx='85' cy='80' r='5' stroke='black' fill='#3339933'></circle>
  <g id='whiskers'>
    <line x1='75' y1='95' x2='135' y2='85' style='stroke:black'></line>
    <line x1='75' y1='95' x2='135' y2='105' style='stroke:black'></line>
  </g>
  <use xlink:href="#whiskers" transform='scale(-1 1) translate(-140 0)' ></use>
  <!-- 耳朵 -->
  <polyline points='108 62,90 10, 70 45, 50, 10, 32, 62'
    style='stroke:black; fill:none' />
  <!-- 嘴 -->
  <polyline points='35 110,45 120, 95 120, 105, 110'
    style='stroke:black; fill:none'/>
  <!-- 鼻子 -->
  <path d='M 75 90 L 65 90 A 5 10 0 0 0 75 90'
    style='stroke:black; fill:#ffcccc'
  />
  <text x="60" y="165" style='font-family:sans-serif;font-size: 14pt;
    stroke:none; fill: black;
  '>Cat</text>
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed291a099f5db~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

如果看不懂代码，没关系，后面几章节会深入这些基本及属性。

## 在网页中使用 SVG

SVG 是一种图件格式，因此可以使用与其他图像类型相同的方式包含在 HTML 页面中。具体可以采用两种方法：将图像包含在 `<img>` 元素内（当图像是页面的基本组成部分时，推荐这种方式）；或者将图像作为另一个元素的 CSS 样式属性插入(当图像主要用来装饰时，推荐这种方式)。

#### 在  元素内包含 SVG

在 `<img>` 元素内包含 SVG 图像非常简单，只需设置 `src` 指向 SVG 文件位置即可。如下:

```
<img src='cat.svg' alt=''/>
```

#### 在 CSS 中包含 SVG

可以使用 background-image 属性来显示 SVG，如果没有固有尺寸， SVG 会被缩放为元素高度和宽度的 100%，如下所示：

```
div.background-cat {
  background-image: url('cat.svg');
  background-size: 100% 100%;
}
```

#### 使用 object 标签引入 SVG （不推荐）

`<object>` 元素的 `type` 属性表示要嵌入的文件类型。这个属性应该是一个有效的网络媒体类型(通常被称为 MIME 类型)。对于 `SVG`，使用 `type='image/svg+xml'`。如下所示：

```
<object data='cat.svg' type='image/svg+xml' 
  width='100' height='100'/>
```

#### 在网页中直接使用 SVG 标签

直接引用 svg 定即可，如下所示：

```
<svg width='140' heiight='170' xmlns='http://wwww.w3.org/2000/svg'>
  <title>Cat</title>
  <desc>Stick Figure of Cat</desc>
  <!-- 在这里绘制图像 -->
  <circle cx='70' cy='95' r='50' style='stroke:black; fill:none'></circle>
</svg>    
```

## SVG 的视窗，视野和全局（世界）

**视窗**

SVG的属性`width`、`height`来控制视窗的大小，也称为`SVG`容器

**世界**

SVG里面的代码，就是对SVG世界的定义

**视野**

世界是无穷大的，视野是观察世界的一个矩形区域。如下图所示

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed294c0a9ce99~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

世界不可变，而视野是可以改变的。在SVG中，提供了`viewBox`和`preserveAspectRatio`属性来控制视野。

## 线段

SVG 可以使用 元素画出一条直线，使用只需要指定线段的起(x1, y1)止(x2, y2)点。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed29657c76845~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

```
<svg width='140' height='170' xmlns='http://wwww.w3.org/2000/svg'>
  <line x1='0' y1='0' x2='100' y2='100' style='stroke:black'/>
</svg>
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed297600c0c86~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

## 笔画的特性

线段可以看作画面上画出来的笔画。笔画的尺寸、颜色和风格都会影响线段的表现。这些特性都可以在 `style` 属性指定。

#### stroke-width

`stroke-width` 是设置线段的粗细，如下所示：

```
<svg width='140' height='170' xmlns='http://wwww.w3.org/2000/svg'>
  <line x1='0' y1='0' x2='100' y2='100' style='stroke-width:10;stroke:black'/>
</svg>
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed298ed67cb37~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

#### 笔画的颜色和透明度

可以通过以下几种方式指定笔画颜色：

-   基本颜色关键字： aqua、black、blue、fuchsia、gray、green 等
-   由 6 位十六进制指定的颜色，形式为 `#rrggbb`，其中 `rr` 表示红色, `gg` 表示绿色, `bb` 表示蓝色，它们的范围都是 `00--ff`
-   由 3 位十六进制指定的颜色，形式为 `#rgb`，其中 `r` 表示红色，`g` 表示绿色, `b` 表示蓝色，它们的范围都是 `0-f` 。
-   通过 `rgb()` 形式指定的 `rgb` 颜色值，每个值的取值范围都是整数 `0-255` 或者百分比 `0 - 100%`
-   currentColor 关键字，表示当前元素应用的 CSS 属性 color 的值。color 是用来给 HTML 的文本设置颜色的，会被子元素继承，但对 SVG 没有直接效果。

线段都是实线，咱们也可以使用 `stroke-opacity` 来控制线的透明度，取值范围和 CSS 一样 `0.0-1.0`,来几个例子演示一下：

来几个例子演示一下：

```
<svg width='140' height='170' xmlns='http://wwww.w3.org/2000/svg'>
  <!-- 红色 -->
  <line x1='10' y1='10' x2='50' y2='10' style='stroke-width:5;stroke:red'/>
  <!-- 谈绿色 -->
  <line x1='10' y1='20' x2='50' y2='20' style='stroke-width:5;stroke:#9f9f;stroke-opacity: 0.2' />
  <!-- 橘色 -->
  <line x1='10' y1='40' x2='50' y2='40' style='stroke-width:5;stroke:rgb(255,128,64);stroke-opacity: 0.5' />
  <!-- 深紫色 -->
  <line x1='10' y1='50' x2='50' y2='50' style='stroke-width:5;stroke:rgb(60%,20%,60%);stroke-opacity: 0.8' />
</svg>
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed29b2aaa1260~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

> 如果不指定笔画颜色的话，将看不到任何线，因为 stroke 属性的默认值是 none

#### stroke-dasharray 属性

有时咱们需要点线和虚线，刚需要使用 stroke-dasharray 属性，它的值由一列数字构成，代表线的长度和空隙的长度，数字之间用逗号或空格隔开。数字的个数应该为偶数，但如果是奇数，则 SVG 会重复几次，让总数为偶数。

```
<svg width='200' height='200' xmlns='http://wwww.w3.org/2000/svg'>
  <!-- 9个像素的虚线，5个像素的空隙 -->
  <line x1='10' y1='10' x2='100' y2='10'
    style='stroke-dasharray:9, 5; stroke: black; stroke-width:2'
  />
  <!-- 5个像素的虚线，3个像素的空隙 ,9个像素的虚线，2个像素的空隙 -->
  <line x1='10' y1='30' x2='100' y2='30'
    style='stroke-dasharray:9, 5, 9, 2; stroke: black; stroke-width:2' />
  <!-- 复制奇数个数 -->
  <line x1='10' y1='50' x2='100' y2='50'
    style='stroke-dasharray:9, 3, 5; stroke: black; stroke-width:2' />
</svg>
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed29dd79e7831~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

## 矩形

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed29f2e8b317f~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

矩形是最简单基本形状，只需要其左上角 `x` 和 `y` 坐标以及它的宽度(`width`)和高度(`height`)，如果想要指定圆角，可以指定 `rx`(x方向的圆角半径)，该最大值是矩形宽度的一半，同理，`ry`(y 方向的圆角半径)，该最大值是矩形高度的一半。如果只指定了 `rx` 和 `ry` 中的一个值，则认为它们相等，矩形内部还可以使用 `fill` 属性来填充颜色，默认为黑色，用 stroke 来绘制边框，默认透明。来几个例子看看。

```
<svg width='300' height='500' xmlns='http://wwww.w3.org/2000/svg'>
  <!-- 内部填充为黑色，不绘制边框 -->
  <rect x='10' y='10' width='30' height='50'/>
  <!-- 内部填充为蓝色，绘制较粗，半透明红色边框-->
  <rect x='50' y='10' width='30' height='50'
    style='fill: #0000ff;stroke: red;stroke-width: 7; stroke-opacity: .5'/>
  <!-- rx 和 ry 相等，逐渐增大-->
  <rect x='10' y='70' rx='2' ry='2' width='20' height='40' 
    style='stroke:black; fill:none'/>ry5'
  <!-- rx 和 ry 相等，逐渐增大-->
  <rect x='50' y='70' rx='5'  width='20' height='40' 
    style='stroke:black; fill:none' />
  <!-- rx 和 ry 不相等 -->
  <rect x='10' y='130' rx='10' ry='5' width='20' height='40' style='stroke:black; fill:none' />
  <rect x='50' y='130' rx='10' ry='5' width='10' height='40' style='stroke:black; fill:none' />
</svg>
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed2a09f32d6e0~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

## 圆和椭圆

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed2a2d8a6dc87~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed2a428829678~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

画一个圆，需要使用 `<circle>` 元素，并指定圆心的 `x` 和 `y` 坐标(`cx/cy`) 以及半径(`r`)。和矩形一样，不指定 fill 和 stroke 时，圆会使用黑色填充并且没有轮廓线。

```
<svg width='300' height='500' xmlns='http://wwww.w3.org/2000/svg'>
  <circle cx='30' cy='30' r='20' style='stroke:black; fill:none'/>
  <circle cx='80' cy='30' r='20' style='stroke-width:5;stroke:black; fill:none' />

  <ellipse cx='30' cy='80' rx='10' ry='20'
    style='stroke:black; fill:none'
  />
  <ellipse cx='80' cy='80' rx='20' ry='10'
    style='stroke:black; fill:none'
  />
</svg>
```

对于椭圆来说，除了指定圆心和坐标外，还需要同时指定 `x` 方向的半径和 `y` 方向的半径，属性分为是 `rx` 和 `ry`。对于圆和椭圆来说，如果省略 `cx` 或者 `cy` ，则默认为 `0`，如果半径为 `0`，则不会显示图形，如果半径为负数，则会报错。来几个例子看看：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed2a592869caf~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

## 多边形

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed2a6ec3d3c50~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

咱们可以使用 `<polygon>` 元素绘制多边形，使用 `points` 属性指定一系列的 `x/y` 坐标对，并用逗号或者空格分隔**坐标个数必须是偶数**。指定坐标不需要在最后指定返回起始坐标， `<polygon>` 元素会自动回到起始坐标。来几个例子看看：

```
<svg width='200' height='200' xmlns='http://wwww.w3.org/2000/svg'>
  <!--平等四边形-->
  <polygon points='15,10 55,10 45,20 5,20'
    style='fill:red; stroke: black;'
  />
  <!--五角星-->
  <polygon points='35,37.5 37.9,46.1 46.9,46.1 39.7,51.5
    42.3,60.1 35,55 27.7,60.1 30.3,51.5 23.1,46.1 32.1,46.1'
    style='fill: #ccffcc; stroke: green;'
    />
  <!--不规则图形-->
  <polygon points='60 60, 65,72 80 60, 90,90 72,85 50,95'
    style="fill: yellow; fill-opacity:.5; stroke:black"
  />
</svg>
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed2a85562f74c~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

从上面很容易看出多边形都很容易填充，因为多边形的各边都没有交叉，很容易区分出多边形的内部区域和外部区域。但是，当多边形彼此交叉的时候，要区分哪些区域是图形内部并不容易。如下如融合所示，中间的区域是算内部还是外部呢？

```
<svg width='200' height='200' xmlns='http://wwww.w3.org/2000/svg'>
  <polygon points='48,16 16,96 96,48 0,48 80,96'
    style='fill:none; stroke: black;'
  />
</svg>
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed2a97f8c2b9f~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

SVG有两种判断某个点是否在多边形中的规则。分别对应`fill-true`属性的`nonezero`（默认值）和`evenodd`。其效果图分别如下：

```
<body style='padding: 100px 0 0 200px'>

<svg width='200' height='200' xmlns='http://wwww.w3.org/2000/svg'>
  <polygon points='48,16 16,96 96,48 0,48 80,96'
    style='fill-rule: nonzero; fill:yellow; stroke: black;'
  />

  <polygon points='148,16 116,96 196,48 100,48 180,96'
    style='fill-rule: evenodd; fill:red; stroke: black;' />
</svg>
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed2ab2c3089a6~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

## 折线

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed2accb6ed782~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

`<polyline>` 元素与 有相同的属性，不同之处在于图形并不封闭，直接来个事例看看：

```
<svg width='200' height='200' xmlns='http://wwww.w3.org/2000/svg'>
  <polyline points="5,20 20,20 25,10 35,30 45,10
    55,30 65,10 74,30 80,20 95,20"
    style="stroke:black; stroke-width:3; fill:none"
  />
</svg>
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed2ae1f24c245~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

## 总结

#### 形状元素

线段：`<line x1=" " y1=" " x2=" " y2=" " style=" "/>`

矩形：`<rect x=" "  y=" "  width=" "  height=" "  style=" "/>`

圆角矩形：`<rect x=" "  y=" "  rx=" "  ry=" "  style=" "/>`

圆形：`<circle cx=" "  cy=" "  r=" " style=" "/>`

椭圆形：`<ellipse cx=" "  cy=" "  rx=" "  ry=" "  style=" " />`

多边形：`<polygon points="      "  style=" "/>`

折线：`<polyline points="    "  style=" "/> //注意需把fill设成none`

SVG有两种判断某个点是否在多边形中的规则。分别对应`fill-true`属性的`nonezero`（默认值）和`evenodd`。其效果图分别如下：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed2af92e02a81~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

#### 笔画特性：

| 属性 | 值 |
| --- | --- |
| stoke | 笔画颜色，默认为none |
| stroke-opacity | 笔画透明度，默认为1.0（完全不透明），值范围：0.0~1.0 |
| stroke-dasharray | 用一系列数字指定虚线和间隙的长度，如：stroke-dasharray:5,10,5,20 |
| stroke-linecap | 线头尾的形状：butt（默认）、round、square |
| stroke-linejoin | 图形的棱角或一系列连线的形状：miter（尖的，默认值）、round（圆的）、bevel（平的） |
| stroke-miterlimit | 相交处显示宽度与线宽的最大比例，默认为4 |

#### 填充颜色

| 属性 | 值 |
| --- | --- |
| fill | 指定填充颜色，默认值为 black |
| fill-opacity | 从 0.0 到 1.0 的数字， 0.0 表示完全透明, 1.0(默认值) 表示完全不透明 |
| fill-rule | 属性值为 nonzero (默认值) 或 evenodd。 |

## 在 SVG 中使用样式

在 SVG 的使用样式中 CSS 很相似，主要有 4 种，分别如下：

-   内联样式
-   内部样式表
-   外部样式表
-   表现属性

**内联样式**

用法跟 css 一样，如下所示：

```
<line style="fill:yellow;stroke:blue;stroke-width=4" x1="10" y1="10" x2="100" y2="100"/>* 
```

**内部样式表**

用法也跟 css 的类名一样，如下所示：

```
.linestyle{
stroke:red;
stroke-width:2;
}
// 那么在使用标签时，指定此样式即可：
<line class="linestyle" x1="10" y1="10" x2="100" y2="100"/>
```

**外部样式表**

跟 CSS 用法一样，把样式写在另外文件中，然后导入使用。

**表现属性**

咱们可能通过 style 属性修改样式，当然 style 里面的属性值，可以单独写，这种也叫表现属性：

```
<circle cx='10' cy='10' r='5'
  fill='red' stroke='black' stroke-width='2'/>    
```

## 分组与引用对象

虽然可以将所有的绘图看成是由一系列几乎一样的形状和线条组成的，但通常咱们还是认为大多数非抽象的艺术作品是由一系列命名对象组成的，而这些对象由形状和线条组合而成。SVG 提供了一些元素，允许咱们对元素进行这样的分组，从而使文档更加结构化以及更易理解。

#### `<g>` 元素

1）`<g>`元素会将所有子元素作为一个组合，通常还有一个唯一的id作为名称; 2）每个组合还可以拥有自己的`<title>`和`<desc>`来供基于文本的xml应用程序识别或者为视障用户提供更好的可访问性; 3）阅读器会读取`<title>`和`<desc>`元素的内容。鼠标悬停或者轻触组合内的图形时，会显示`<title>`元素内容的提示框。 4）`<g>`元素可以组合元素并可以提供一些注释，组合还可以比较嵌套;

在起始 标签中指定的所有样式会应用于组合内的所有子元素，如下面示例所示，咱们可以不用复制每个元素上的 `style='fill:none; stroke:black;'`

```
 <svg width='240' height='240' xmlns='http://wwww.w3.org/2000/svg'>
  <title>欢乐一家人</title>
  <desc>一家人在一起就是简单幸福的了</desc>

  <g id='house' style='fill:none; stroke:black'>
    <desc>房子</desc>
    <rect x='6' y='50' width='60' height='60'/>
    <polyline points='6 50, 36 9, 66 50' />
    <polyline points='36 110, 36 80, 50 80， 50 110' />
  </g>

  <g id='man' style='fill:none; stroke:green'>
    <desc>男人</desc>
    <circle cx='85' cy='56' r='10'/>
    <line x1='85' y1='66' x2='85' y2='80'/>
    <polyline points='76 104, 85 80, 94 104'/>
    <polyline points='76 70, 85 76, 94 70'/>
  </g>

  <g id='woman' style='fill:none; stroke:red'>
    <desc>女人</desc>
    <circle cx='110' cy='56' r='10'/>
    <polyline points='110 66, 110 80, 100 90, 120 90, 110 80'/>
    <line x1='104' y1='104' x2='108' y2='90'/>
    <line x1='112' y1='90' x2='116' y2='104'/>
    <polyline points='101 70, 110 76, 119 80'/>
  </g>
 </svg>
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed2b33671e7e8~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

#### `<use>` 元素

1）复杂的图形中经常会出现重复元素，svg 使用`<use>`元素为定义在`<g>`元素内的组合或者任意独立图形元素提供了类似复杂黏贴的能力; 2）定义了一组`<g>`图形对象后，使用`<use>`标签再次显示它们。要指定想要的重用的组合就给`xlink:href`属性指定`URI`即可，同时还要指定`x`和`y`的位置以表示组合应该移动到的位置。 3）`<use>`元素并不限制只使用在同一个文件内的对象，还可以指定任意有效的文件或者URI.

因此为了创建另一个上面的房子和一组小人，只要把下面的代码入 `<svg>` 元素里面即可。

```
<use xlink:href='#house' x='70' y='100'/>
<use xlink:href='#woman' x='-80' y='100'/>
<use xlink:href='#man' x='-30' y='100'/>  
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed2b49f513e02~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

#### `<defs>`元素

上面例子有几个缺点：

-   复用 `man` 和 `woman` 组合时，需要知道原始图像中这些图形的位置，并以此位置作为利用的基础，而不是使用诸如 `0` 这样的简单数字
  
-   房子的填充和笔画颜色由原始图形建立，并且不能通过 元素覆盖，这说明咱们不能构造一行彩色的房子。
  
-   文档中会画出所有的三个元素 woman,man 和 house,并不能将它们单独 '存储' 下来，然后只绘制一排房子或者只绘制一组人。
  

`<defs>` 元素可以解决这些问题

1）SVG规范推荐我们将所有想要复用的对象放置在元素内，这样SVG阅读器进入流式环境中就能更轻松地处理数据。 2）由于组合在`<defs>`元素内，它们不会立刻绘制到屏幕上，而是作为"模板"供其他地方使用。

```
<svg width='240' height='240' viewBox='0 0 240 240' xmlns='http://wwww.w3.org/2000/svg'>
  <title>欢乐一家人</title>
  <desc>一家人在一起就是简单幸福的了</desc>
  
  <defs>
    <g id='house' style='stroke:black'>
      <desc>房子</desc>
      <rect x='0' y='41' width='60' height='60' />
      <polyline points='0 41, 30 0, 60 41' />
      <polyline points='30 110, 30 71, 44 71， 44 101' />
    </g>
    
    <g id='man' style='fill:none; stroke:green'>
      <desc>男人</desc>
      <circle cx='10' cy='10' r='10' />
      <line x1='10' y1='20' x2='10' y2='44' />
      <polyline points='1 58, 10 44, 19 58' />
      <polyline points='1 24, 10 30, 19 24' />
    </g>
    
    <g id='woman' style='fill:none; stroke:red'>
      <desc>女人</desc>
      <circle cx='10' cy='10' r='10' />
      <polyline points='10 20, 10 34, 0 44, 20 44, 10 34' />
      <line x1='4' y1='58' x2='8' y2='44' />
      <line x1='12' y1='44' x2='16' y2='58' />
      <polyline points='1 24, 10 30, 19 24' />
    </g>

    <g id='couple'>
      <desc>夫妻</desc>
      <use xlink:href='#man' x='0' y='0'/>
      <use xlink:href='#woman' x='25' y='0'/>
    </g>
  </defs>
  <use xlink:href='#house' x='0' y='0' style='fill:#cfc'/>
  <use xlink:href='#couple' x='70' y='40'/>

  <use xlink:href='#house' x='120' y='0' style='fill:#99f' />
  <use xlink:href='#couple' x='190' y='40' />
</svg>
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed2b6b859c890~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

#### `<symbol>`元素

`<symbol>`作为模板，同`<defs>`一样，内部的所有元素都不会展现在画布上，因此咱们无需把它放在 规范内。然而，咱们还是习惯将它放到 `<defs>` 中，因为 symbol 也是咱们定义的供后续使用的元素。

```
<svg width='240' height='240' viewBox='0 0 240 240' xmlns='http://wwww.w3.org/2000/svg'>
  <defs>
    <symbol id="circle" viewBox="0 0 100 100" preserveAspectRatio="xMinYMin meet">
      <circle cx="50" cy="50" r="50"></circle>
    </symbol>
    <symbol id="triangle" viewBox="0 0 100 100" preserveAspectRatio="xMaxYMax slice">
      <polygon points="0 0, 100 0, 50 100"></polygon>
    </symbol>
  </defs>
  <g stroke="grey" fill="none">
    <rect x="0" y="0" width="50" height="100"></rect>
    <rect x="100" y="0" width="50" height="100"></rect>
  </g>
  <use xlink:href="#circle" width="50" height="100" fill="red"></use>
  <use xlink:href="#triangle" width="50" height="100" fill="red" x="100"></use>
</svg>
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed2b7fd80ee80~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

## image 元素

`<image>`顾名思义里面放图片的，至于说是矢量图(vector)还是位图(raster)，都成，用起来也方便：

```
<svg width='310' height='310' viewBox='0 0 310 310' xmlns='http://wwww.w3.org/2000/svg'>
  <ellipse cx='154' cy='154' rx='150' ry='120' style='fill: #999'/>
  <ellipse cx='152' cy='152' rx='150' ry='120' style='fill: #999' />

  <image xlink:href='3.jpg' x='72' y='92'
    width='160' height='120'
  />
</svg>
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/10/16eed2b97c5689d2~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

**代码部署后可能存在的BUG没法实时知道，事后为了解决这些BUG，花了大量的时间进行log 调试，这边顺便给大家推荐一个好用的BUG监控工具 [Fundebug](https://link.juejin.cn/?target=https%3A%2F%2Fwww.fundebug.com%2F%3Futm_source%3Dxiaozhi "https://www.fundebug.com/?utm_source=xiaozhi")。**



