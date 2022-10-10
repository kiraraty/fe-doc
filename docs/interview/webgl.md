# WebGL高性能图形编程

## 第1章-WebGL基础

WebGL 是一组基于 JavaScript 语言的图形规范，浏览器厂商按照这组规范进行实现，为 Web 开发者提供一套`3D图形`相关的 API。那么，这些 API 能够帮助 Web 开发者做些什么呢？

这些 API 能够让 Web 开发者使用 JavaScript 语言直接和显卡（GPU）进行通信。当然 WebGL 的 GPU 部分也有对应的编程语言，简称 `GLSL`。我们用它来编写运行在 GPU 上的着色器程序。着色器程序需要接收 CPU（WebGL 使用 JavaScript） 传递过来的数据，然后对这些数据进行流水线处理，最终显示在屏幕上，进而实现丰富多彩的 3D 应用，比如 3D 图表，网页游戏，3D 地图，WebVR 等

WebGL 只能够绘制`点`、`线段`、`三角形`这三种基本图元，但是我们经常看到 WebGL 程序中含有立方体、球体、圆柱体等规则形体，甚至很多更复杂更逼真的不规则模型，那么 WebGL 是如何绘制它们的呢？其实这些模型本质上是由一个一个的`点`组成，GPU 将这些点用`三角形图元`绘制成一个个的微小平面，这些平面之间互相连接，从而组成各种各样的立体模型

### 构建模型顶点数据

一般情况下，最初的顶点坐标是相对于`模型中心`的，不能直接传递到着色器中，我们需要对`顶点坐标`按照一系列步骤执行`模型转换`，`视图转换`，`投影转换`，转换之后的坐标才是 WebGL 可接受的坐标，即`裁剪空间坐标`。我们把最终的`变换矩阵`和`原始顶点坐标`传递给 `GPU`，GPU 的渲染管线对它们执行流水线作业。

### 渲染管线过程

- 首先进入顶点着色器阶段，利用 GPU 的并行计算优势对顶点逐个进行坐标变换。
- 然后进入图元装配阶段，将顶点按照图元类型组装成图形。
- 接下来来到光栅化阶段，光栅化阶段将图形用不包含颜色信息的像素填充。
- 在之后进入片元着色器阶段，该阶段为像素着色，并最终显示在屏幕上。

### 着色器

 GLSL 是用来编写着色器程序的语言，那么新的问题来了，着色器程序是用来做什么的呢？ 简单地说，着色器程序是在显卡（GPU）上运行的简短程序，代替了 GPU `固定渲染管线`的一部分，使 GPU 渲染过程中的某些部分允许开发者通过`编程`进行控制

着色器程序允许我们通过编程来控制 GPU 的渲染

![image-20221009170519482](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/image-20221009170519482.png)

上图简单演示了 WebGL 对一个红色三角形的渲染过程，绿色部分为开发者可以通过编程控制的部分：

- JavaScript 程序
  处理着色器需要的`顶点坐标`、`法向量`、`颜色`、`纹理`等信息，并负责为`着色器`提供这些数据，上图为了演示方便，只是提供了三角形顶点的位置数据。
- 顶点着色器
  接收 JavaScript 传递过来的`顶点信息`，将顶点绘制到对应坐标。
- 图元装配阶段
  将三个顶点装配成指定`图元类型`，上图采用的是三角形图元。
- 光栅化阶段 将三角形内部区域用空像素进行填充。
- 片元着色器 为三角形内部的像素填充颜色信息，上图为暗红色。

实际上，对顶点信息的变换操作既可以在 `JavaScript` 中进行，也可以在`着色器程序`中进行。通常我们都是在 `JavaScript` 中生成一个包含了所有变换的最终变换矩阵，然后将该矩阵传递给着色器，利用 GPU 并行计算优势对所有顶点执行变换

webgl 里面的基本图元是三角形，所有图形都是有很多个三角形组成的，顶点着色器为这些三角形的`顶点`着色，三角形内部区域的颜色会由 gpu 进行`插值填充`，你可以通过`片元着色器`为三角形区域内的`每一个点`着色，从而替代默认的插值方式。

顶点着色器**这里的顶点代表的是组成物体的每一个点。**

顶点着色器的功能主要是将位置数据经过矩阵变换、计算光照之后生成顶点颜色、变换纹理坐标。并将生成的数据输出到片元着色器。

片元着色器的作用是将**光栅化阶段**生成的每个片元，计算出每个片元的最终元素。

### 1.3.2 片元着色器

片元着色器的作用是将**光栅化阶段**生成的每个片元，计算出每个片元的最终元素。

### WebGL数据类型

- 一般不用bool,bvec,ivec
- 常用就float,sampler2D,samplerCube,mat3,mat4 ![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9634bb00e7cf4c6a9b365ce326de9ead~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### 修饰符(WebGL1.0)

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/008a415cedc447d89cfd4a6f598cdcae~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### 修饰符(WebGL2.0)

- in vec3 normal;
- out vec3 vNormal;
- layout (location = 0) in vec3 position;
- layout (location = 1) in vec3 normal;
- layout(location = 0) out vec4 gColor;
- layout(location = 1) out vec4 gNormal;

### 顶点着色器 预定义变量

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f03afa3e15df4be4bd64e6d7e02018a7~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### 片段着色器 预定义变量

![在这里插入图片描述](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/779bf440a1b24ac39145e491a6f9004c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### 输入的变量

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/47adf0b656a741d799453b8f55d1da1e~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp) ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a5b97800d0b4aff9c559c735e7105de~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### Example

WebGL1.0

```glsl
attribute vec4 a_position;  //js一般输入的是 n组数组  每一数组大小跟声明有关
uniform vec4 u_offset;      //js一般输入的是 一组数组 这个数组大小跟声明有关 uniform这个可以在片元着色器写
uniform float u_kernel[9];  //js一般输入的是 一组数组 这个数组大小跟声明有关
varying vec4 v_positionWithOffset; //只是用来传值 不用在js里输入
//uniform 不一定要输入 都会有默认值
attribute vec2 a_TexCoord;//顶点纹理坐标
varying vec2 v_TexCoord; 

void main() {
  gl_Position = a_position + u_offset + u_kernel[0];
  v_positionWithOffset = a_position + u_offset;
  v_TexCoord = a_TexCoord; //uv坐标
}
复制代码
precision mediump float;
varying vec4 v_positionWithOffset;  //要想使用的话 必须要有相同的声明

struct SomeStruct { //自定义结构
  bool active;
  vec2 someVec2;
};
uniform SomeStruct u_someThing;


uniform sampler2D u_Sampler;  //贴图颜色来的
varying vec2 v_TexCoord;  //片元顶点坐标
void main() {
  vec4 color = v_positionWithOffset * 0.5 + 0.5
  gl_FragColor = texture2D(u_Sampler,v_TexCoord); //texture2D会返回四个通道
}

```

WebGL2.0

```glsl
#version 300 es
in vec4 a_position;
in vec2 a_TexCoord;//纹理坐标
out vec2 v_TexCoord;//插值后纹理坐标

void main() {
   gl_Position = a_position;
   v_TexCoord = a_TexCoord; //一般不做处理
}
复制代码
#version 300 es
precision highp float;
int vec2 vTexcoord; //varing 已经被替代了
out vec4 outColor;  // you can pick any name
uniform sampler2D uTexture;
void main() {
   outColor = doMathToMakeAColor;
   gl_FragColor = texture2D(uTexture,v_TexCoord);
}
```

## 第2章-初识WebGL

### 01-手动绘制一个WebGL图形

![image-20190325140143588](https://s2.loli.net/2022/07/09/GEw51QogVDPzSvn.png)

实现的步骤：

1. 添加一个画布元素
2. 获取到画布元素的基于webgl上下文环境对象
3. 使用对象中的API实现图形绘制

### 02-使用着色器绘制一个 WebGL图形 

![image-20190325144201606](https://s2.loli.net/2022/07/09/Adz5Nt4ne1rZkoQ.png)



- WebGL 中的坐标系统：

![01-坐标](https://s2.loli.net/2022/07/09/rEwa62hCgyfTPdU.jpg)

![02-坐标](https://s2.loli.net/2022/07/09/X1chHqJNa2iS5VC.jpg)

- 着色器的介绍：

​       **着色器是**使用 OpenGL ES Shading Language 语言编写的程序，负责记录像素点的**位置**和**颜色**，并由**顶点着色器和片段着色器**组成，通过用GLSL 编写这些着色器，并将代码文本传递给WebGL执行时编译，另外，顶点着色器和片段着色器的集合我们通常称之为**着色器程序**。

​       **顶点着色器**的功能是将输入顶点从原始坐标系转换到WebGL使用的缩放空间坐标系，每个轴的坐标范围从-1.0到1.0，顶点着色器对顶点坐标进行必要的转换后，保存在名称为gl_Position的特殊变量中备用。

​      **片段着色器**在顶点着色器处理完图形的顶点后，会被要绘制的每个图形的每个像素点调用一次，它的功能是确定像素的颜色值，并保存在名称为gl_FragColor的特殊变量中，该颜色值将最终绘制到图形像素的对应位置中。   

## 第3章-绘制三角形

### 01-多点绘制的方法

![image-20190326133332093](https://s2.loli.net/2022/07/09/BiCwSGvWmz6Q9g7.png)

- 什么attribute 变量

  它是一种存储限定符，表示定义一个attribute的全局变量，这种变量的数据将由外部向顶点着色器内传输，并保存**顶点**相关的数据，只有顶点着色器才能使用它。

- 使用attribute 变量

  1. 在顶点着色器中，声明一个 attribute 变量。

  2. 将 attribute 变量赋值给 gl_Position 变量。

  3. 向 attribute 变量传输数据。

- 使用缓存区关联attribute变量

  1. 创建缓存区对象
  2. 绑定缓存区对象
  3. 将数据写入对象
  4. 将缓存区对象分配给attribute变量
  5. 开启attribute变量

### 02-绘制三角形的方法

-  实现代码




## 第4章-WebGL动画

### 01-图形的移动

![image-20190318160443253](https://s2.loli.net/2022/07/09/B6WZjvbkwJ9LfG5.png)

- 平移原理

​       为了平移一个三角形，只需要对它的每个顶点进行移动，即每个顶点加上一个分量，得到一个新的坐标：

`       X1=X+TX``Y1=Y+TY``Z1=Z+TZ`

​     只需要着色器中为顶点坐标的每个分量加上一个常量就可以实现，当然这这修改在顶点着色器上。

- uniform类型变量

  用于保存和传输一致的数据，既可用于顶点，也可用于片断。

### 02-图形的旋转

![image-20190326165438537](https://s2.loli.net/2022/07/09/NWOY2HkoT9jcg6s.png)



旋转原理

为了描述一个图形的旋转过程，必须指明以下内容：

1. 旋转轴(围绕X和Y轴旋转)

2. 旋转的方向(顺时针和逆时针)，负值是为顺时针，正值时为逆时针

3. 旋转的角度(图形经过的角度)

   ![image-20190319154151430](https://s2.loli.net/2022/07/09/FWszZQXADjTxKLk.png)

![image-20190327174612322](https://s2.loli.net/2022/07/09/ag2tspG5wCRxir1.png)



### 03-图形的缩放

![image-20190318160344389](https://s2.loli.net/2022/07/09/yfrpiCXHw3gtRn8.png)

- 缩放的原理

​       通过改变原有图形中的矩阵值，实现图形的拉大和缩下效果，因此，只需要修改原有图形的矩阵值即可。

![image-20190319154240988](https://s2.loli.net/2022/07/09/aGSmhEVOwLsT2I6.png)

- 动画实现

  需求：制作一个按旋转三角形的动画

  **屏幕刷新频率**

     图像在屏幕上更新的速度，也即屏幕上的图像每秒钟出现的次数，一般是60Hz的屏幕每16.7ms刷新一次。

  **动画原理**

    图像被刷新时，引起以连贯的、平滑的方式进行过渡变化。

  **核心方法**

  ```javascript
  requestAnimationFrame(callback)
  //执行一个动画,并在下次绘制前调用callback回调函数更新该动画
  ```

## 第5章-WebGL颜色

### 01-操作步骤介绍

![image-20190318162409517](https://s2.loli.net/2022/07/09/KHVsdWTgfx6ZemP.png)

- 颜色添加步骤

  1. 在顶点着色器中定义一个接收外部传入颜色值的属性变量a_Color和用于传输获取到的颜色值变量v_Color
  2. 在片段着色器中定义一个同一类型和名称的v_Color变量接收传顶点传入的值。
  3. 重新传入到顶点坐标和颜色值的类型化数组
  4. 将数组值传入缓存中并取出，赋值给顶点的两个变量
  5. 接收缓存值并绘制图形和颜色



- vertexAttribPointer 方法

- |   参数    | 说明                                                         |
  | :-------: | ------------------------------------------------------------ |
  | 第1个参数 | 指定待分配attribute变量的存储位置                            |
  | 第2个参数 | 指定缓存区中每个顶点的分量个数（1~4）                        |
  | 第3个参数 | 类型有，无符号字节，短整数，无符号短整数，整型，无符号整型，浮点型 |
  | 第4个参数 | 表示是否将非浮点型的数据归到[0,1][-1,1]区间                  |
  | 第5个参数 | 相邻两个顶点的字节数。默认为0                                |
  | 第6个参数 | 表示缓存区对象的偏移量（以字节为单位），attribute 变量从缓冲区中的何处开始存储 |

- 案例实现

  1. 添加画布元素，并获取webGL对象，保存在变量中。
  2. 定义着色器内容，并进行附件编译。
  3. 使用缓存对象向顶点传入多个坐标数据。
  4. 根据坐标数据绘制图像。

### 02-着色器编译与图像绘制

- 代码实现


## 第6章-回顾总结

回顾

1.如何使用画布绘制一个应webgl技术的图形

   colorColor

2.有坐标点的图形

​    一个坐标点

   着色器(顶点、片段)

   坐标体系

 3.绘制多个顶点的三角形

 4.平移，uniform

​    旋转，数学函数计算角度获取坐标值

​    缩放

5.各个顶点的绘制颜色

   步骤 

   varying 

   理解和掌握WebGL工作原理的重要基础

总结：

可绘制简单webgl图形，

动画、三维透视方法

借助一些比较简单快速上手的框架，three.js