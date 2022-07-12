# 图形化开发



## Threejs

### 为什么？

**webGL太难用，太复杂！**

**但是现代浏览器都支持 WebGL**

> 这样我们就不必使用 **Flash**、**Java** 等插件就能在浏览器中创建三维图形。



**Three.js 的出现完美地解决了这个矛盾。**

> 它提供一个很简单的关于 **WebGL** 特性的 **JavaScript API**，使得用户不需要详细地学习 **WebGL**，就能轻松创作出好看的三维图形样例。

> WebGL原生的api是一种非常低级的接口，而且还需要一些数学和图形学的相关技术。对于没有相关基础的人来说，入门真的很难，Three.js将入门的门槛降低了整整的一大截，对WebGL进行封装，简化我们创建三维动画场景的过程。只要你有一定的JavaScript的基础，有一定的前端经验，我坚信，用不了多长时间，三维制作会变得很简单。

**学习Three.js入门3D开发不但门槛低，而且学习曲线不会太陡，即使以后转向WebGL原生开发，也能通过Three.js学习到很多有用的知识。** 并且在webGL封装的各种库来讲，threejs现在是独领风骚。

**现在最火的微信小游戏跳一跳也是在Three.js的基础上开发出来的。**

所以，你如果要学3D，Three.js是我们必须要学的WebGL框架。



### 基本介绍

**Threejs 该项目的目的是使用默认的WebGL渲染器创建一个易于使用，轻量级的3D库。该库还在示例中提供了Canvas 2D，SVG和CSS3D渲染器。**

https://github.com/mrdoob/three.js



#### 特点

Three.js作为WebGL框架中的佼佼者，由于它的易用性和扩展性，使得它能够满足大部分的开发需求。

1. **Three.js掩盖了3D渲染的细节**：Three.js将WebGL原生API的细节抽象化，将3D场景拆解为网格、材质和光源(即它内置了图形编程常用的一些对象种类)。
2. **面向对象**：开发者可以使用上层的JavaScript对象，而不是仅仅调用JavaScript函数。
3. **功能非常丰富**：Three.js除了封装了WebGL原始API之外，Three.js还包含了许多实用的内置对象，可以方便地应用于游戏开发、动画制作、幻灯片制作、髙分辨率模型和一些特殊的视觉效果制作。
4. **速度很快**：Three.js采用了3D图形最佳实践来保证在不失可用性的前提下，保持极高的性能。
   支持交互：WebGL本身并不提供拾取（picking)功能（即是否知道鼠标正处于某个物体上）。而Three.js则固化了拾取支持，这就使得你可以轻松为你的应用添加交互功能。
5. **包含数学库**：Three.js拥有一个强大易用的数学库，你可以在其中进行矩阵、投影和矢量运算。
6. **内置文件格式支持**：你可以使用流行的3D建模软件导出文本格式的文件，然后使用Three.js加载；也可以使用Three.js自己的JSON格式或二进制格式。
7. **扩展性很强**：为Three.js添加新的特性或进行自定义优化是很容易的事情。如果你需要某个特殊的数据结构，那么只需要封装到Three.js即可。



#### 缺点

1. 官网文档非常粗糙，对于新手极度不友好。
2. 国内的相关资源匮乏。
3. Three.js所有的资料都是以英文格式存在，对国内的朋友来说又提高了门槛。
4. Three.js不是游戏引擎，一些游戏相关的功能没有封装在里面，如果需要相关的功能需要进行二次开发。



#### 与Babylon.js对比

Babylon.JS是最好的JavaScript3D游戏引擎，它能创建专业级三维游戏。主要以游戏开发和易用性为主。与Three.js之间的对比： 
1. Three.js比较全面，而Babylon.js专注于游戏方面。 
2. Babylon.js提供了对碰撞检测、场景重力、面向游戏的照相机，Three.js本身不自带，需要依靠引入插件实现。 
3. 对于WebGL的封装，双方做的各有千秋，Three.js浅一些，好处是易于扩展，易于向更底层学习；Babylon.js深一些，好处是易用扩展难度大一些。 
4. Three.js的发展是依靠社区推动，出来的比较早，发展比较成熟，Babylon.js是由微软公司在2013推出，文档和社区都比较健全，国内还不怎么火。



#### PC兼容性

基本上所有的**现代**浏览器都支持 **Three.js**。

- **Firefox**：**4.0** 版本后开始支持
- **Chrome**：**9.0** 版本后开始支持
- **Safari**：**5.1** 版本后开始支持
- **Opera**：**12.00** 版本后开始支持
- **IE**：**IE11** 起才开始支持（唯一一个很长时间都不支持 **WebGL** 的浏览器）



#### 移动端兼容性

- **Android**：**Android** 原生的浏览器是不支持 **WebGL** 的。如果想在 **Android** 上运行 **WebGL**，需要安装最新的移动版本的 **Chrome**、**Firefox** 或者 **Opera**。
- **iOS**：从 **iOS8** 起就开始支持
- **Windows mobile**：从 **8.1** 版本后开始支持



#### 在线编辑器

https://threejs.org/editor/

可以通过可视化的方式导出并生成代码，也可以导入的代码在线演示。



### Hello World

前面说了这么多，准备了这么多，最后，放上我们的第一个案例吧。由此来打开学习Three.js 的大门：

```js
<!DOCTYPE html>
<html>
<head>
    <meta charset=utf-8>
    <title>我的第一个Three.js案例</title>
    <style>
        body {
            margin: 0;
        }

        canvas {
            width: 100%;
            height: 100%;
            display: block;
        }
    </style>
</head>
<body onload="init()">
<script src="https://cdn.bootcss.com/three.js/92/three.js"></script>
<script>
    //声明一些全局变量
    var renderer, camera, scene, geometry, material, mesh;

    //初始化渲染器
    function initRenderer() {
        renderer = new THREE.WebGLRenderer(); //实例化渲染器
        renderer.setSize(window.innerWidth, window.innerHeight); //设置宽和高
        document.body.appendChild(renderer.domElement); //添加到dom
    }

    //初始化场景
    function initScene() {
        scene = new THREE.Scene(); //实例化场景
    }

    //初始化相机
    function initCamera() {
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200); //实例化相机
        camera.position.set(0, 0, 15);
    }

    //创建模型
    function initMesh() {
        geometry = new THREE.BoxGeometry( 2, 2, 2 ); //创建几何体
        material = new THREE.MeshNormalMaterial(); //创建材质

        mesh = new THREE.Mesh( geometry, material ); //创建网格
        scene.add( mesh ); //将网格添加到场景
    }

    //运行动画
    function animate() {
        requestAnimationFrame(animate); //循环调用函数

        mesh.rotation.x += 0.01; //每帧网格模型的沿x轴旋转0.01弧度
        mesh.rotation.y += 0.02; //每帧网格模型的沿y轴旋转0.02弧度

        renderer.render( scene, camera ); //渲染界面
    }

    //初始化函数，页面加载完成是调用
    function init() {
        initRenderer();
        initScene();
        initCamera();
        initMesh();

        animate();
    }
</script>
</body>
</html>

```

#### 分析

```
<body onload="init()">
```

> ready和onload的区别： ready加载完js和css就执行，onload必须加载完图片之后。

```js
//初始化函数，页面加载完成是调用
function init() {
  initRenderer();
  initScene();
  initCamera();
  initMesh();
  animate();
}
```

使用`Three.js`显示创建的内容，我们必须需要的三大件是：`渲染器，相机和场景`。相机获取到场景内显示的内容，然后再通过渲染器渲染到画布上面。

![image-20190714190138267](https://s2.loli.net/2022/07/02/TzZ4RaeXDnihBwS.png)

#### 创建渲染器

```js
function initRenderer() {
    renderer = new THREE.WebGLRenderer(); //实例化渲染器
    renderer.setSize(window.innerWidth, window.innerHeight); //设置宽和高
    document.body.appendChild(renderer.domElement); //添加到dom
}
```

>  第一行，我们实例化了一个THREE.WebGLRenderer，这是一个基于WebGL渲染的渲染器，当然，Three.js向下兼容，还有CanvasRenderer，CSS2DRenderer，CSS3DRenderer和SVGRenderer，这四个渲染器分别基于canvas2D,CSS2D，CSS3D和SVG渲染的渲染器。由于，作为3D渲染，WebGL渲染的效果最好，并且支持的功能更多，我们以后的课程也只会用到THREE.WebGLRenderer，需要使用其他渲染器时，会重点提示。

> 第二行，调用了一个设置函数`setSize`方法，这个是设置我们需要显示的窗口大小。案例我们是基于浏览器全屏显示，所以设置了浏览器窗口的宽和高。

> 第三行，`renderer.domElement`是在实例化渲染器时生成的一个`canvas`画布，渲染器渲染界面生成的内容，都将在这个画布上显示。所以，我们将这个画布添加到了dom当中，来显示渲染的内容。

#### 创建相机

```js
//初始化相机
function initCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200); //实例化相机
    camera.position.set(0, 0, 15);
}
```

`Three.js`里面有几个不同的相机，我们这里使用到的是`THREE.PerspectiveCamera`，这个相机的效果是模拟人眼看到的效果，就是具有透视的效果，近大远小。

> 第一行，我们实例化了一个透视相机，需要四个值分别是视野，宽高比，近裁面和远裁面。我们分别介绍一下这四个值：
>
> - 视野：当前相机视野的宽度，值越大，渲染出来的内容也会更多。
> - 宽高比：默认是按照画布的显示的宽高比例来设置，如果比例设置的不对，会发现渲染出来的画面有拉伸或者压缩的感觉。
> - 近裁面和远裁面：这个是设置相机可以看到的场景内容的范围，如果场景内的内容位置不在这两个值内的话，将不会被显示到渲染的画面中。

> 第二行，我们设置了相机的位置。

![image-20190714000818622](https://s2.loli.net/2022/07/02/4BL1iGORPoTVI7A.png)

> WebGL坐标系统作为3D坐标，在原来的2D坐标xy轴上面又多了一个z轴，大家注意z轴的方向，是坐标轴朝向我们的方向是正轴，我们眼看去的方向是是z轴的负方向。
> camera.position.set函数是设置当前相机的位置，函数传的三个值分别是x轴坐标，y轴坐标和z轴坐标。我们只是将相机的放到了z正轴坐标轴距离坐标原点的15的位置。相机默认的朝向是朝向0点坐标的，我们也可以设置相机的朝向，这将在后面相机介绍是，专门介绍相机的相关。

#### 创建场景

```js
//初始化场景
function initScene() {
	scene = new THREE.Scene(); //实例化场景
}
```

场景只是作为一个容器，我们将需要显示的内容都放到场景对象当中。如果我们需要将一个模型放入到场景当中，则可以使用`scene.add`方法，如：

```js
scene.add(mesh); //添加一个网格（模型）到场景
```



#### 创建第一个模型

渲染器，场景和相机都全了，是不是就能显示东西了？不能！因为场景内没有内容，即使渲染出来也是一片漆黑，所以我们需要往场景里面添加内容。接下来，我们将查看`initMesh`方法，看看如何创建一个最简单的模型：

```js
//创建模型
function initMesh() {
    geometry = new THREE.BoxGeometry( 2, 2, 2 ); //创建几何体
    material = new THREE.MeshNormalMaterial(); //创建材质

    mesh = new THREE.Mesh( geometry, material ); //创建网格
    scene.add( mesh ); //将网格添加到场景
}
```

> 第一行代码里，我们实例化了一个`THREE.BoxGeometry`立方体的几何体对象，实例化的三个传值分别代表着立方体的长度，宽度和高度。我们全部设置的相同的值，将渲染出一个标准的正立方体。

> 第二行里面，我们实例化了一个THREE.MeshNormalMaterial材质，这种材质的特点是，它会根据面的朝向不同，显示不同的颜色。

> 第三行，通过`THREE.Mesh`方法实例化创建了一个网格对象，`THREE.Mesh`实例化需要传两个值，分别是几何体对象和材质对象，才可以实例化成功。

> 第四行，添加

#### 动画

```js
function animate() {
    requestAnimationFrame(animate); //循环调用函数
	...
}

```

在循环调用的函数中，每一帧我们都让页面重新渲染相机拍摄下来的内容：

````js
renderer.render( scene, camera ); //渲染界面
````

> 渲染的`render`方法需要两个值，第一个值是场景对象，第二个值是相机对象。这意味着，你可以有多个相机和多个场景，可以通过渲染不同的场景和相机让画布上显示不同的画面。

但是，如果现在一直渲染的话，我们发现就一个立方体在那，也没有动，我们需要做的是让立方体动起来：

```
mesh.rotation.x += 0.01; //每帧网格模型的沿x轴旋转0.01弧度
mesh.rotation.y += 0.02; //每帧网格模型的沿y轴旋转0.02弧度
```

> 每一个实例化的网格对象都有一个`rotation`的值，通过设置这个值可以让立方体旋转起来。在每一帧里，我们让立方体沿x轴方向旋转0.01弧度，沿y轴旋转0.02弧度（1π弧度等于180度角度）。



#### 性能监测插件

在`Three.js`里面，遇到的最多的问题就是性能问题，所以我们需要时刻检测当前的`Three.js`的性能。现在`Three.js`常使用的一款插件叫`stats`。接下来我们看看如何将`stats`插件在`Three.js`的项目中使用：

核心指标：

- FPS: 画面每秒传输帧数。

##### 引入

```
<script src="http://www.wjceo.com/lib/js/libs/stats.min.js"></script>
```

我们需要实例化一个`stats`对象，然后把对象内生成的`dom`添加到页面当中。

```js
stats = new Stats();
document.body.appendChild(stats.dom);
```

最后一步，我们需要在`requestAnimationFrame`的回调里面进行更新每次渲染的时间：

```js
function animate() {
    requestAnimationFrame(animate); //循环调用函数
    stats.update(); //更新性能插件
		renderer.render( scene, camera ); //渲染界面
}
```





### 基本元素

#### scene场景

##### 介绍

场景是我们每个`Three.js`项目里面放置内容的容器，我们也可以拥有多个场景进行切换展示，你可以在场景内放置你的**模型**，**灯光**和**照相机**。还可以通过调整场景的位置，让场景内的所有内容都一起跟着调整位置。

##### THREE.Object3D
为了方便操作，Three.js将每个能够直接添加到场景内的对象都继承至一个基类-THREE.Object3D，以后我们将继承至这个基类的对象称为3d对象，判断一个对象是否是继承至THREE.Object3D，我们可以这么判断：

```js
obj instanceof THREE.Object3D
//继承至返回 true 否则返回false
```

![image-20190717191601592](https://s2.loli.net/2022/07/02/nYg4ISfUqzyW6Rx.png)



##### 向场景内添加一个`3d`对象：

```js
scene.add(mesh); //将网格添加到场景
```


这个方法不光能够在场景内使用，而且也可以将一个`3d`对象添加到另一个`3d`对象里面：

```js
parent.add(child);
```

##### 获取一个3d对象

```js
object3D.name = "firstObj";
scene.add(object3D);

scene.getObjectByName("firstObj"); //返回第一个匹配的3d对象
```

##### 删除一个3d对象

如果我们想隐藏一个`3d`对象，而不让它显示，可以通过设置它的`visible`的值：

```js
mesh.visible = false; //设置为false，模型将不会被渲染到场景内
```

如果一个模型不再被使用到，需要彻底删除掉，我们可以使用`remove`方法进行删除：

```js
scene.remove(mesh); //将一个模型从场景中删除
```

##### 修改位置(3种方式)

单独设置

```
mesh.position.x = 3; //将模型的位置调整到x正轴距离原点为3的位置。
mesh.position.y += 5; //将模型的y轴位置以当前的位置向上移动5个单位。
mesh.position.z -= 6;
```

一次性设置所有

```
mesh.position.set(3, 5, -6);  //直接将模型的位置设置在x轴为3，y轴为5，z轴为-6的位置
```

`Three.js`的模型的位置属性是一个`THREE.Vector3`（三维向量）的对象（后期教程会讲解相关对象），我们可以直接重新赋值一个新的对象：

```js
mesh.position = new THREE.Vector3(3, 5, -6); //上面的设置位置也可以通过这样设置。
```

##### 修改大小

单独设置

```
mesh.scale.x = 2; //模型沿x轴放大一倍
mesh.scale.y = 0.5; //模型沿y轴缩小一倍
mesh.scale.z = 1; //模型沿z轴保持不变
```

第二种是使用set方法:

```js
mesh.scale.set(2, 2, 2); //每个方向等比放大一倍
```

第三种方式，由于`scale`属性也是一个三维向量，我们可以通过赋值的方式重新修改：

```js
mesh.scale = new THREE.Vector3(2, 2, 2); //每个方向都放大一倍
```

##### 修改模型的转向

第一种方式是单独设置每个轴的旋转：

```js
mesh.rotation.x = Math.PI; //模型沿x旋转180度
mesh.rotation.y = Math.PI * 2; //模型沿y轴旋转360度，跟没旋转一样的效果。。。
mesh.rotation.z = - Math.PI / 2; //模型沿z轴逆时针旋转90du
```

第二种方式就是使用`set`方法重新赋值：

```js
mesh.rotation.set(Math.PI, 0, - Math.PI / 2); //旋转效果和第一种显示的效果相同
```

第三种方式，模型的`rotation`属性其实是一个欧拉角对象（`THREE.Euler`）欧拉角后面会讲解到，我们可以通过重新赋值一个欧拉角对象来实现旋转调整：

```js
mesh.rotation = new THREE.Euler(Math.PI, 0, - Math.PI / 2, "YZX"); 
```



#### 调式方法

有些时候，我们需要调整模型的位置或者大小什么的需要每次都去场景内进行调试，现在我推荐一种常用的插件`dat.GUI`，接下来，我们将一起看看如何使用这一款插件：

https://github.com/dataarts/dat.gui

##### 功能

- 参数调整
- 自动匹配参数类型 (滑块， checkbox, 编辑 等)
- 可以自定义函数

##### 使用

1.引入

```
<script src="https://cdn.bootcss.com/dat-gui/0.7.1/dat.gui.min.js"></script>
```

2.建一个对象，在里面设置我们需要修改的一些数据：

```
controls = {
    positionX:0,
    positionY:0,
    positionZ:0
};
```

3.实例化`dat.GUI`对象，将需要修改的配置添加对象中，并监听变化回调：

```js
gui = new dat.GUI();
gui.add(controls, "positionX", -1, 1).onChange(updatePosition);
gui.add(controls, "positionY", -1, 1).onChange(updatePosition);
gui.add(controls, "positionZ", -1, 1).onChange(updatePosition);

function updatePosition() {
    mesh.position.set(controls.positionX, controls.positionY, controls.positionZ);
}
```

这样，只要我们每次都修改对象里面的值以后，都会触发`updatePosition`回调，来更新模型的位置。



#### Geometry几何体

一个模型是由几何体`Geometry`和材质`material`组成。`Three.js`内置了很多的几何体种类，如：立方体、三棱锥、球、八面体、十二面体、二十面体等等，这一节我们将介绍一下这些类型几何体的模型创建和几何体的通用方法。

##### Geometry和BufferGeometry

当前`Three.js`内置了这两种几何体类型Geometry和BufferGeometry，**这两个几何体类型都是用于存储模型的顶点位置、面的索引、法向量、颜色、uv纹理以及一些自定义的属性。**

**它们两个的区别是**：

- Geometry
  - 使用了Three.js提供的THREE.Vector3或者THREE.Color这样的对象来存储数据
  - 易与阅读和编辑
  - 性能弱一些
  - 适合动画场景
- BufferGeometry
  - 存储数据原始
  - 不易阅读和编辑
  - **性能好**
  - 适合存储一些放入场景内不需要再额外操作的模型

##### 互转

两种几何体类型可以互转，所以，不要害怕现在使用的是那种。



BufferGeometry`转换成`Geometry

```js
//实例化一个Geometry对象
var geo = new THREE.Geometry(); 
//调用对象的fromBufferGeometry方法，并将需要转换的bufferGeometry传入
geo.fromBufferGeometry(bufferGeometry);
//geo为转换转换成的Geometry
```

Geometry`转换成`BufferGeometry

```js
//实例化一个BufferGeometry对象
var bufferGeo = new THREE.BufferGeometry(); 
//调用对象的fromGeometry方法，并将需要转换的geometry传入
bufferGeo.fromGeometry(geometry);
//bufferGeo为geometry转换成的BufferGeometry
```



##### 立方体

在`WebGL`里面，所有的模型都是通过三角形面组成。

###### 创建

```js
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
```

###### 构造函数

```js
BoxGeometry(width : 浮点类型, height : 浮点类型, depth : 浮点类型, widthSegments : 整数类型, heightSegments : 整数类型, depthSegments : 整数类型)
```

width — 沿x轴的宽度，默认值为1
height — 沿y轴的高度，默认值为1
depth — 沿z轴的深度，默认值为1
widthSegments — 可选，沿着边的宽度的分割面的数量。默认值为1
heightSegments — 可选，沿着边的高度的分割面的数量。默认值为1
depthSegments — 可选，沿着边的深度的分割面的数量。缺省值是1

**widthSegments，heightSegments，depthSegments这三个参数有点类似切西瓜，分别朝3个方向将几何体切成一块一块。**

###### 在线示意：

https://threejs.org/docs/scenes/geometry-browser.html#BoxGeometry

> 比如我们要将西瓜切成小块，必须朝三个方向切才行。

![image-20190717173516260](https://s2.loli.net/2022/07/02/A8QOJunch2b1MTm.png)

##### 圆形

**圆形是由多个三角形分段构成**，这些三角形分段围绕一个中心点延伸并且延伸到给定半径以外。

###### 创建

```js
var geometry = new THREE.CircleGeometry( 5, 32 );
var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
var circle = new THREE.Mesh( geometry, material );
scene.add( circle );
```

###### 构造函数

```
CircleGeometry(radius : 浮点类型, segments : 整数类型, thetaStart : 浮点类型, thetaLength : 浮点类型)
```

radius — 圆的半径，默认值为1
segments — 段数（三角形），最小值为3，默认值为8
thetaStart — 第一段的起始角度，默认值为0
thetaLength — 圆形扇形的中心角，通常称为theta。默认值是2 * Pi，画出一个整圆

###### 在线示意

https://threejs.org/docs/scenes/geometry-browser.html#CircleGeometry

##### 圆锥

###### 创建

```js
var geometry = new THREE.ConeGeometry( 5, 20, 32 );
var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var cone = new THREE.Mesh( geometry, material );
scene.add( cone );
```

###### 构造函数

```js
ConeGeometry(radius : 浮点类型, height : 浮点类型, radialSegments : 整数类型, heightSegments : 整数类型, openEnded : 布尔类型, thetaStart : 浮点类型, thetaLength : 浮点类型)
```
radius — 底部圆锥的半径，默认值为1。
height — 圆锥体的高度，默认值为1。
radialSegments — 圆锥周围的分段面数，默认值为8。
heightSegments — 沿圆锥体高度的面的行数，默认值为1。
openEnded — 圆锥体底部是是隐藏还是显示，默认值为false，显示。
thetaStart — 第一段的起始角度，默认值是0（Three.js的0度位置）。
thetaLength — 圆形扇形的中心角，通常称为theta。默认值是2 * Pi，画出一个整圆

###### 在线示意

https://threejs.org/docs/scenes/geometry-browser.html#ConeGeometry

##### 圆柱

###### 创建

```js
var geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var cylinder = new THREE.Mesh( geometry, material );
scene.add( cylinder );
```

###### 构造函数

```
CylinderGeometry(radiusTop : 浮点类型, radiusBottom : 浮点类型, height : 浮点类型, radialSegments : 整数类型, heightSegments : 整数类型, openEnded : 布尔类型, thetaStart : 浮点类型, thetaLength : 浮点类型)
```

radiusTop — 顶部圆柱体的半径。默认值为1.
radiusBottom — 底部圆柱体的半径。默认值为1.
height — 圆柱体的高度。默认值为1.
radialSegments — 圆柱周围的分段面数。默认值为8
heightSegments — 沿圆柱体高度的面的行数。默认值为1.
openEnded — 圆柱体的两端是否显示，默认值是false，显示。
thetaStart — 第一段的起始角度，默认值是0（Three.js的0度位置）。
thetaLength — 圆形扇形的中心角，通常称为theta。默认值是2 * Pi，画出一个整圆

###### 在线示意

https://threejs.org/docs/scenes/geometry-browser.html#CylinderGeometry

##### 球

###### 创建

```js
var geometry = new THREE.SphereGeometry( 5, 32, 32 );
var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );
```

###### 构造函数

```
SphereGeometry(radius : 浮点类型, widthSegments : 整数类型, heightSegments : 整数类型, phiStart : 浮点类型, phiLength : 浮点类型, thetaStart : 浮点类型, thetaLength : 浮点类型)
```

radius — 球体半径。默认值是1
widthSegments — 水平线段的数量。最小值是3，默认值是8
heightSegments — 垂直段的数量。最小值是2，默认值是6
phiStart — 指定水平渲染起始角度。默认值为0
phiLength — 指定水平渲染角度大小。默认值是Math.PI * 2
thetaStart — 指定垂直渲染起始角度。默认值为0
thetaLength — 指定垂直渲染角度大小。默认是Math.PI

###### 在线示意

https://threejs.org/docs/scenes/geometry-browser.html#SphereGeometry

##### 平面

###### 创建

```js
var geometry = new THREE.PlaneGeometry( 5, 20, 32 );
var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
var plane = new THREE.Mesh( geometry, material );
scene.add( plane );
```

###### 构造函数

```js
PlaneGeometry(width : 浮点类型, height : 浮点类型, widthSegments : 整数类型, heightSegments : 整数类型)
```

width — 沿X轴的宽度。默认值为1
height — 沿着Y轴的高度。默认值为1
widthSegments — 宽度的分段数，可选。默认值为1
heightSegments — 高度的分段数，可选。默认值为1

###### 在线示意

https://threejs.org/docs/scenes/geometry-browser.html#PlaneGeometry

##### 圆环

###### 创建

```js
var geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
var torus = new THREE.Mesh( geometry, material );
scene.add( torus );
```

###### 构造函数

```
TorusGeometry(radius : 浮点类型, tube : 浮点类型, radialSegments : 整数类型, tubularSegments : 整数类型, arc : 浮点类型)
```
radius - 圆环的半径，从圆环的中心到管的中心。默认值为1
tube — 管的半径。默认值是0.4
radialSegments — 横向分段数，默认值是8
tubularSegments — 纵向分段数，默认值是6
arc — 绘制的弧度。默认值是Math.PI * 2，绘制整个圆环

###### 在线示意

https://threejs.org/docs/scenes/geometry-browser.html#TorusGeometry

官网演示： https://threejs.org/docs/#api/en/geometries/TubeGeometry

以上是`Three.js`内置的一些基础的几何体，`Three.js`还内置了一些其他的几何体模型（如字体几何体、拉伸几何体、车床几何体等）。



#### 材质

这一节我们讲解一下模型的表现，也就是我们看到的模型的外观——材质。
**简单的说就是物体看起来是什么质地**。材质可以看成是材料和质感的结合。在渲染程式中，它是表面各可视属性的结合，这些可视属性是指表面的色彩、纹理、光滑度、透明度、反射率、折射率、发光度等。Three.js给我们封装好了大部分的材质效果。

##### MeshBasicMaterial

这种材质是一种简单的材质，不会受到光的影响，直接看到的效果就是整个物体的颜色都是一样，没有立体的感觉。

1.初始化color

```js
var material = new THREE.MeshBasicMaterial({color:0x00ffff});
var geometry = new THREE.BoxGeometry(1, 1, 1);

var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```

2.set修改color

```js
var material = new THREE.MeshBasicMaterial({color:0x00ffff}); //设置初始的颜色为浅蓝色
material.color.set(0xff00ff); //将颜色修改为紫色
```

3.我们也可以直接赋值一个新的`THREE.Color`对象

```
var material = new THREE.MeshBasicMaterial({color:0x00ffff}); //设置初始的颜色为浅蓝色
material.color = new THREE.Color(0xff00ff); //将颜色修改为紫色
```

##### MeshNormalMaterial

这种材质会根据面的方向不同自动改变颜色，也是我们之前一直在用的材质。

此材质不受灯光影响。

```js
geometry = new THREE.BoxGeometry( 2, 2, 2 ); //创建几何体
material = new THREE.MeshNormalMaterial(); //创建材质

mesh = new THREE.Mesh( geometry, material ); //创建网格
scene.add( mesh ); //将网格添加到场景

```

##### LineBasicMaterial线条材质

要绘制线段，我们需要确定两个点，就是起点和终点，案例中我们使用了四个顶点创建了三条线。然后`Geometry`对象使用这组顶点配置几何体，实例化线的材质，最后使用`THREE.Line`生成线。

```js
//添加直线
var pointsArr = [
    new THREE.Vector3( -10, 0, -5 ),
    new THREE.Vector3( -5, 15, 5 ),
    new THREE.Vector3( 20, 15, -5 ),
    new THREE.Vector3( 10, 0, 5 )
];

var lineGeometry = new THREE.Geometry(); //实例化几何体
lineGeometry.setFromPoints(pointsArr); //使用当前点的属性配置几何体

var lineMaterial = new THREE.LineBasicMaterial({color:0x00ff00}); //材质

line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);

```

**添加光**

由于`MeshBasicMaterial`不会受光的影响，即使有光也不会影响它的效果，前面我们也没有添加光。但是后面介绍的材质会受到光源的影响，在介绍之前，我们需要添加一个光源，来影响材质的显示效果。

```js
//创建灯光
function initLight() {
    var light = new THREE.DirectionalLight(0xffffff); //添加了一个白色的平行光
    light.position.set(20, 50, 50); //设置光的方向
    scene.add(light); //添加到场景

    //添加一个全局环境光
    scene.add(new THREE.AmbientLight(0x222222));
}
```

##### MeshLambertMaterial 兰伯特材质

这种材质会对光有反应，但是不会出现高光，可以模拟一些粗糙的材质的物体，比如木头或者石头。实现案例：

```js
geometry = new THREE.BoxGeometry( 2, 2, 2 ); //创建几何体
material = new THREE.MeshLambertMaterial({color:0x00ffff}); //创建材质

mesh = new THREE.Mesh( geometry, material ); //创建网格
scene.add( mesh ); //将网格添加到场景
```

##### MeshPhongMaterial 高光材质

这种材质具有高光效果，可以模拟一些光滑的物体的材质效果，比如油漆面，瓷瓦等光滑物体。实现案例：

```js
geometry = new THREE.BoxGeometry( 2, 2, 2 ); //创建几何体
material = new THREE.MeshPhongMaterial({color:0x00ffff}); //创建材质

mesh = new THREE.Mesh( geometry, material ); //创建网格
scene.add( mesh ); //将网格添加到场景

```



#### 光照

通过之前的内容，我们已经了解一个模型的创建整个过程。接下来，我们将学习如果实现在场景中添加光效和阴影效果。首先我们先介绍一下光照的创建：

##### 创建光照

在上一节，因为案例需求，我们创建过一次光照效果，所有的光照效果也都是通过这种方式创建出来。

```js
var light = new THREE.DirectionalLight(0xffffff); //添加了一个白色的平行光
```

并且还在场景中添加了一个全局光照：

```js
scene.add(new THREE.AmbientLight(0x222222));
```

不同种类的光照，通过实例化，可以接受两个传值，分别是光照颜色和光照强度。

```js
var light = new THREE.DirectionalLight(0xffffff, 1.0); //添加了一个白色的平行光
```

第二个值光照强度默认值是`1.0`，我们可以根据项目需求调整光照强度。

我们也可以动态修改光的颜色和光照强度：

```js
var light = new THREE.DirectionalLight(0xffffff); //添加了一个白色的平行光

light.color.set(0x000000); //将光照的颜色修改为黑色
light.intensity = 2.0; // 光照的强度改为默认的两倍
```

##### AmbientLight 环境全局光

环境光会照亮场景中所有的物体，在计算物体的颜色的时候，都会叠加上环境光的颜色。

```js
var light = new THREE.AmbientLight( 0x404040 ); // 创建一个灰色的环境光
scene.add( light );
```

由于环境光作用于所有的物体，所有的材质，所以环境光是没有方向的，也无法产生阴影效果。

##### DirectionalLight平行光

平行光是以特定的方向发射的光。它产生的光都是平行的状态，主要用于模拟太阳光线。
创建平行光也接受两个值，颜色和光线强度：

```js
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 ); //创建一个颜色为纯白色并且强度为默认的一半的平行光
scene.add( directionalLight );
```

平行光除了可以动态修改光的颜色和强度外，还可以通过设置它的位置和目标位置来确定平行光的照射方向（两点确定一条直线的概念）：

```js
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 ); 
directionalLight.color.set(0x000000);  //将光照颜色修改为黑色
directionalLight.intensity = 1.0; //将光照强度修改为默认

directionalLight.position.set(10, 10, 10); //设置平行光的位置
directionalLight.target.set(0, 0, 0); //设置当前的平行光的朝向位置
scene.add( directionalLight );
```

##### 添加阴影效果

平行光是可以产生投影效果的，下面我们来设置一下平行光如何产生阴影效果：
首先，需要设置渲染器可以渲染阴影效果：

```js
renderer.shadowMap.enabled = true; // 渲染器
```

实例化灯光时，需要设置灯光渲染阴影：

```js
directionalLight = new THREE.DirectionalLight("#ffffff");
directionalLight.castShadow = true; // 设置平行光投射投影

scene.add(directionalLight);
```

最后，我们还需要设置模型哪些需要可以产生阴影和哪些模型可以接收阴影：

```js
sphere.castShadow = true; //开启阴影
scene.add(sphere);

cube.castShadow = true; //开启阴影
scene.add(cube);

plane.receiveShadow = true; //可以接收阴影
scene.add(plane);
```

上面我们设置了球体和立方体可以产生阴影，底部的平面可以接收球和立方体产生的阴影，便可以产生下面的图片效果：

![image-20190718141005720](https://s2.loli.net/2022/07/02/5dRXD3tIFEeGcOw.png)

由于设置阴影是一项十分耗性能的工作，所以我们需要尽量设置合适的阴影渲染范围和密度。平行光阴影的实现原理是通过正交相机OrthographicCamera（将在下一节讲解相机）来通过检测当前模型，也就是directionalLight.shadow.camera就是一个正交相机，只要在这个正交相机可视范围内的可以投影的物体才可以被设置投影。并且我们可以通过设置一些相机的属性属性来实现产生阴影的范围：

```js
directionalLight.shadow.camera.near = 20; //产生阴影的最近距离
directionalLight.shadow.camera.far = 100; //产生阴影的最远距离
directionalLight.shadow.camera.left = -50; //产生阴影距离位置的最左边位置
directionalLight.shadow.camera.right = 50; //最右边
directionalLight.shadow.camera.top = 50; //最上边
directionalLight.shadow.camera.bottom = -50; //最下面

//这两个值决定生成阴影密度 默认512
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.mapSize.width = 1024;
```

##### PointLight 点光源

点光源就是从一个点的位置向四面八方发射出去光，一个简单的例子就是一个裸露的灯泡。
实现一个最普通的点光源很简单：

```js
var pointLight = new THREE.PointLight(0xff0000); //创建一个白色的点光源
pointLight.position.set( 50, 50, 50 );
scene.add( pointLight );
```

点光源支持四个参数配置，除了前两个颜色和光的强度外，另外两个是照射范围和衰减度：

```js
var pointLight = new THREE.PointLight(0xff0000, 1, 100, 2); //创建一个白色的点光源
pointLight.position.set( 50, 50, 50 );
scene.add( pointLight );
```

第三个参数照射范围，如果物体距离点光源超过这个距离，将不会受到点光源的影响，默认是所有的物体会受到点光源的影响。如果设置了参数，将按照第四个参数，衰减度的值来慢慢减少影响，默认是1，如果需要模拟现实中的效果，这个参数可以设置为2。

这些属性也可以通过动态修改：

```js
pointLight.color.set(0x000000); //修改光照颜色
pointLight.intensity = 0.5; //修改光的强度
pointLight.distance = 50; //修改光的照射范围
pointLight.decay = 1.0; //修改衰减度
```

**实现点光源阴影效果和实现平行光的阴影效果的设置基本一样**，而且由于点光源是散射，阴影效果会终止在点光源的影响范围内。我们可以仿照平行光的阴影实现过程进行实现，只是将平行光修改为了点光源：

```js
pointLight = new THREE.PointLight("#ffffff");
pointLight.position.set(40, 60, 10);

//告诉平行光需要开启阴影投射
pointLight.castShadow = true;

scene.add(pointLight);
```

##### SpotLight 聚光灯光源

聚光灯光源的效果也是从一个点发出光线，然后沿着一个一个圆锥体进行照射，可以模仿手电筒，带有灯罩的灯泡等效果。
实现聚光灯的案例最简单是直接设置一个颜色即可，默认照射原点位置的光照：

```js
var spotLight = new THREE.SpotLight( 0xffffff ); //创建一个白色光照
spotLight.position.set( 100, 1000, 100 );
scene.add( spotLight );
```

聚光灯光源和点光源一样，也可以设置光的强度和照射范围

```js
spotLight = new THREE.SpotLight( 0xffffff, 2.0, 100); //设置光照强度是默认的两倍,照射范围为100
```

聚光灯由于是沿圆锥体照射，我们可以设置聚光灯的这个椎体的角度来影响：

```js
spotLight = new THREE.SpotLight( 0xffffff, 2.0, 100, Math.PI/4); //设置光的照射圆锥范围为90度
```

因为聚光灯只能照射一定的区域的物体，所以会出现光亮和无法照射地方的交接，我们可以通过配置第五个值来设置交接渐变的过渡效果：

```
spotLight = new THREE.SpotLight( 0xffffff, 2.0, 100, Math.PI/4, 0.5); //设置交界过渡幅度为0.5，默认是0，没有过渡，最大值为1
```

我们也可以通过设置第六个值来设置聚光灯的衰减度，和点光源一样：

```
spotLight = new THREE.SpotLight( 0xffffff, 2.0, 100, Math.PI/4, 0.5, 2.0); // 设置衰减度为物理效果的值2.0

```

同样道理，我们也可以动态修改相关配置项：

```js
spotLight.color.set(0x000000); //修改光照颜色
spotLight.intensity = 0.5; //修改光的强度
spotLight.distance = 50; //修改光的照射范围
spotLight.angle = Math.PI/3; //修改光的照射弧度
spotLight.penumbra = 1.0; //修改交界过渡
spotLight.decay = 1.0; //修改衰减度
```

我们也可以修改聚光灯的`target`来修改光的照射方向：

```js
spotLight.target.set(0, 1, 1); //修改照射方向
```

##### 实现聚光灯阴影

实现聚光灯阴影和实现平行光和点光源的设置一样，聚光灯的设置也是将可以生成阴影设置打开，并将聚光灯添加到场景中即可：

```js
spotLight= new THREE.SpotLight("#ffffff");
spotLight.position.set(40, 60, 10);
//告诉平行光需要开启阴影投射
spotLight.castShadow = true;
scene.add(spotLight);
```

##### HemisphereLight室外光源

最后我们说一下室外光源，这个光源主要是为了模拟在户外的环境光效果，比如在蓝天绿地的户外，模型下面会显示出来绿色的环境光，而上方则会受到蓝天的影响而颜色偏蓝。
实例化室外光源支持三个参数：天空的颜色，地面的颜色，和光的强度。

```js
//添加户外光源
var hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(hemisphereLight);
```

同样的道理，我们也可以通过配置属性实时修改：

```js
hemisphereLight.color.set(0xffffff); //将天空颜色修改为白色
hemisphereLight.groundColor.set(0x000000); //将地面颜色修改为黑色
```

我们也可以修改`position`配置项来修改渲染的方向：

```js
hemisphereLight.position.set(0, -1, 0); //默认从上往下渲染，也就是天空在上方，当前修改为了，天空颜色从下往上渲染
```



#### Camera相机

相机是`Three.js`抽象出来的一个对象，使用此对象，我们可以定义显示的内容，并且可以通过移动相机位置来显示不同的内容。 下面讲解一下`Three.js`中的相机的通用属性和常用的相机对象。

我们常用的相机正交相机(`OrthographicCamera`)和透视相机(`PerspectiveCamera`)两种相机，用于来捕获场景内显示的物体模型。它们有一些通用的属性和方法：

由于相机都是继承至THREE.Object3D对象的，所以像设置位置的position属性、rotation旋转和scale缩放属性，可以直接对相机对象设置。我们甚至还可以使用add()方法，给相机对象添加子类，移动相机它的子类也会跟随着一块移动，我们可以使用这个特性制作一些比如HUD类型的显示界面。

##### target 焦点属性和lookAt()方法

这两个方法的效果一定，都是调整相机的朝向，可以设置一个`THREE.Vector3`(三维向量)点的位置：

```js
camera.target = new THREE.Vector3(0, 0, 0);
camera.lookAt(new THREE.Vector3(0, 0, 0));
```

上面两个都是朝向了原点，我们也可以将相机的朝向改为模型网格的`position`，如果物体的位置发生了变化，相机的焦点方向也会跟随变动：

```js
var mesh = new THREE.Mesh(geometry, material);
camera.target = mesh.position;  // 小技巧
//或者
camera.lookAt(mesh.position);
```

##### OrthographicCamera 正交相机

使用正交相机`OrthographicCamera`渲染出来的场景，所有的物体和模型都按照它固有的尺寸和精度显示，一般使用在工业要求精度或者2D平面中，因为它能完整的显示物体应有的尺寸。

![image-20190718175457610](https://s2.loli.net/2022/07/02/Nd1P6FigXUhW24J.png)

上面的图片可以清晰的显示出正交相机显示的范围，它显示的内容是一个立方体结构，通过图片我们发现，只要确定`top`，`left`，`right`，`bottom`，`near`和`far`六个值，我们就能确定当前相机捕获场景的区域，在这个区域外面的内容不会被渲染，所以，我们创建相机的方法就是：

```js
new THREE.OrthographicCamera( left, right, top, bottom, near, far );
```

下面我们创建了一个显示场景中相机位置前方长宽高都为4的盒子内的物体的正交相机：

```js
var orthographicCamera = new THREE.OrthographicCamera(-2, 2, 2, -2, 0, 4);
scene.add(orthographicCamera); //一般不需要将相机放置到场景当中，如果需要添加子元素等一些特殊操作，还是需要add到场景内
```

正常情况相机显示的内容需要和窗口显示的内容同样的比例才能够显示没有被拉伸变形的效果：

```js
var frustumSize = 1000; //设置显示相机前方1000高的内容
var aspect = window.innerWidth / window.innerHeight; //计算场景的宽高比
var orthographicCamera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 2000 ); //根据比例计算出left，top，right，bottom的值
```

我们也可以动态的修改正交相机的一些属性，注意修改完以后需要调用相机`updateProjectionMatrix()`方法来更新相机显存里面的内容：

```js
var frustumSize = 1000; //设置显示相机前方1000高的内容
var aspect = window.innerWidth / window.innerHeight; //计算场景的宽高比
var orthographicCamera = new THREE.OrthographicCamera(); //实例化一个空的正交相机
orthographicCamera.left = frustumSize * aspect / - 2; //设置left的值
orthographicCamera.right = frustumSize * aspect / 2; //设置right的值
orthographicCamera.top = frustumSize / 2; //设置top的值
orthographicCamera.bottom = frustumSize / - 2; //设置bottom的值
orthographicCamera.near = 1; //设置near的值
orthographicCamera.far = 2000; //设置far的值

//注意，最后一定要调用updateProjectionMatrix()方法更新
orthographicCamera.updateProjectionMatrix();
```

由于浏览器的窗口是可以随意修改，我们有时候需要监听浏览器窗口的变化，然后获取到最新的宽高比，再重新设置相关属性：

```js
var aspect = window.innerWidth / window.innerHeight; //重新获取场景的宽高比

//重新设置left right top bottom 四个值
orthographicCamera.left = frustumSize * aspect / - 2; //设置left的值
orthographicCamera.right = frustumSize * aspect / 2; //设置right的值
orthographicCamera.top = frustumSize / 2; //设置top的值
orthographicCamera.bottom = frustumSize / - 2; //设置bottom的值

//最后，记得一定要更新数据
orthographicCamera.updateProjectionMatrix();

//显示区域尺寸变了，我们也需要修改渲染器的比例
renderer.setSize(window.innerWidth, window.innerHeight);
```

##### PerspectiveCamera 透视相机

透视相机是最常用的也是模拟人眼的视角的一种相机，它所渲染生成的页面是一种近大远小的效果。

![image-20190718175812754](https://s2.loli.net/2022/07/02/O8kuSZJch23TBzD.png)

上面的图片就是一个透视相机的生成原理，我们先看看渲染的范围是如何生成的：

- 首先，我们需要确定一个fov值，这个值是用来确定相机前方的垂直视角，角度越大，我们能够查看的内容就越多。
- 然后，我们又确定了一个渲染的宽高比，这个宽高比最好设置成页面显示区域的宽高比，这样我们查看生成画面才不会出现拉伸变形的效果，这时，我们可以确定了前面生成内容的范围是一个四棱锥的区域。
- 最后，我们需要确定的就是相机渲染范围的最小值near和最大值far，注意，这两个值都是距离相机的距离，确定完数值后，相机会显示的范围就是一个近小远大的四棱柱的范围，我们能够看到的内容都是在这个范围内的。
- 通过上面的原理，我们需要通过设置fov垂直角度，aspect视角宽高比例和near最近渲染距离far最远渲染距离，就能够确定当前透视相机的渲染范围。

 下面，是一个透视相机的创建：

```js
var perspectiveCamera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 );
scene.add( perspectiveCamera );
```

我们设置了前方的视角为45度，宽度和高度设置成显示窗口的宽度除以高度的比例即可，显示距离为1到1000距离以内的物体。

透视相机的属性创建完成后我们也可以根据个人需求随意修改，但是注意，相机的属性修改完成后，以后要调用`updateProjectionMatrix()`方法来更新：

```js
var perspectiveCamera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 );
scene.add( perspectiveCamera );

//下面为修改当前相机属性
perspectiveCamera.fov = 75; //修改相机的fov
perspectiveCamera.aspect = window.innerWidth/window.innerHeight; //修改相机的宽高比
perspectiveCamera.near = 100; //修改near
perspectiveCamera.far = 500; //修改far

//最后更新
perspectiveCamera.updateProjectionMatrix();

```

如果当前场景浏览器的显示窗口变动了，比如修改了浏览器的宽高后，我们需要设置场景自动更新，下面是一个常用的案例：

```js
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight; //重新设置宽高比
    camera.updateProjectionMatrix(); //更新相机
    renderer.setSize(window.innerWidth, window.innerHeight); //更新渲染页面大小
}
window.onresize = onWindowResize;
```

##### 相机插件

下载地址： https://github.com/mrdoob/three.js/blob/master/examples/js/controls/OrbitControls.js

使用方法：

选择摄像机，并实例化

```js
function initControl() {
    control = new THREE.OrbitControls(camera, renderer.domElement);
}
```

执行init方法

```js
function init() {  // 3d三要素
    initRenderer();   // 渲染
    initScene();  // 场景
    initCamera();  // 相机

    initMesh();  // 物体

    initControl();
    animate();  // 旋转,动画
}
```

在每一帧执行update

```js
function animate() {
    requestAnimationFrame(animate); //循环调用函数

    mesh.rotation.x += 0.01; //每帧网格模型的沿x轴旋转0.01弧度  半圈是180度
    mesh.rotation.y += 0.02; //每帧网格模型的沿y轴旋转0.02弧度
    stats.update();
    control.update();
    renderer.render(scene, camera); //渲染界面
}
```





#### Points 粒子

这一节，我们将学习到`Sprite`精灵和`Points`粒子两项东西，这两种对象共同点就是我们通过相机查看它们时，始终看到的是它们的正面，它们总朝向相机。通过它们的这种特性，我们可以实现广告牌的效果，或实现更多的比如雨雪、烟雾等更加绚丽的特效。

##### Sprite 精灵

精灵由于一直正对着相机的特性，一般使用在模型的提示信息当中。通过THREE.Sprite创建生成，由于THREE.Sprite和THREE.Mesh都属于THREE.Object3D的子类，所以，我们操作模型网格的相关属性和方法大部分对于精灵都适用。和精灵一起使用的还有一个THREE.SpriteMaterial对象，它是专门配合精灵的材质。注意：**精灵没有阴影效果。**

1. 普通精灵

```js
var spriteMaterialNormal = new THREE.SpriteMaterial({color: 0x00ffff});
var spriteNormal = new THREE.Sprite(spriteMaterialNormal);
spriteNormal.position.set(-30, 10, 0); //设置位置
spriteNormal.scale.set(5, 5, 1); //设置scale进行大小设置
scene.add(spriteNormal);
```

2. 图片导入的方式

```js
var spriteMap = new THREE.TextureLoader().load(drawCanvas({text: "球", width: 64, height: 64}).toDataURL());  // 转为base64
var spriteMaterial = new THREE.SpriteMaterial({map: spriteMap, color: 0xffffff});
var sprite = new THREE.Sprite(spriteMaterial);
sprite.position.set(0, 10, 0); //设置位置
sprite.scale.set(5, 5, 1); //设置scale进行大小设置
scene.add(sprite);
```

3. canvas导入的方式

```js
var canvas = drawCanvas({text: "立方体", width: 256, height: 64});
var spriteMapCube = new THREE.Texture(canvas);
spriteMapCube.wrapS = THREE.RepeatWrapping;
spriteMapCube.wrapT = THREE.RepeatWrapping;
spriteMapCube.needsUpdate = true;

var spriteCube = new THREE.Sprite(new THREE.SpriteMaterial({map: spriteMapCube, color: 0xffffff}));
spriteCube.position.set(30, 10, -5); //设置位置
spriteCube.scale.set(20, 5, 1); //设置scale进行大小设置
spriteCube.center.set(0.5, 0); //设置位置点处于精灵的最下方中间位置
scene.add(spriteCube);
```

##### points 粒子

**粒子和精灵的效果是一样的，它们之间的区别就是如果当前场景内的精灵过多的话，就会出现性能问题**。粒子的作用就是为解决很多精灵而出现的，我们可以使用粒子去模型数量很多的效果，比如下雨，下雪等，数量很多的时候就适合使用粒子来创建，相应的，提高性能的损失就是失去了对单个精灵的操作，所有的粒子的效果都是一样。总的来说，粒子就是提高性能减少的一些自由度，而精灵就是为了自由度而损失了一些性能。

**粒子THREE.Points和精灵THREE.Sprite还有网格THREE.Mesh都属于THREE.Object3D的一个扩展**，但是粒子有一些特殊的情况就是THREE.Points是它们粒子个体的父元素，它的位置设置也是基于THREE.Points位置而定位，而修改THREE.Points的scale属性只会修改掉粒子个体的位置。下面先查看一下一个粒子的创建，创建一个粒子，需要一个含有顶点的几何体，和粒子纹理THREE.PointsMaterial创建：

```js
//球体
var sphereGeometry = new THREE.SphereGeometry(5, 24, 16); // 球
var sphereMaterial = new THREE.PointsMaterial({color: 0xff00ff});
var sphere = new THREE.Points(sphereGeometry, sphereMaterial);
scene.add(sphere);
```

> 粒子会吸附在几何体的表面

上面是一个通过球体几何体创建的一个最简单的粒子特效。
几何体使用任何几何体都可以，甚至自己生成的几何体都可以，比如创建星空的案例：

```js
var starsGeometry = new THREE.Geometry();
//生成一万个点的位置
for (var i = 0; i < 10000; i++) {
    var star = new THREE.Vector3();
    //THREE.Math.randFloatSpread 在区间内随机浮动* - 范围 / 2 *到* 范围 / 2 *内随机取值。
    star.x = THREE.Math.randFloatSpread(2000);
    star.y = THREE.Math.randFloatSpread(2000);
    star.z = THREE.Math.randFloatSpread(2000);
    starsGeometry.vertices.push(star);
}
var starsMaterial = new THREE.PointsMaterial({color: 0x888888});
var starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);
```

###### THREE.PointsMaterial 粒子的纹理

如果我们需要设置粒子的样式，还是需要通过设置`THREE.PointsMaterial`属性实现：

```js
var pointsMaterial = new THREE.PointsMaterial({color: 0xff00ff}); //设置了粒子纹理的颜色
```

我们还可以通过`PointsMaterial`的`size`属性设置粒子的大小：

```js
var pointsMaterial = new THREE.PointsMaterial({color: 0xff00ff, size:4}); //粒子的尺寸改为原来的四倍
//或者直接设置属性
pointsMaterial.size = 4;
```

我们也可以给粒子设置纹理：

```js
var pointsMaterial = new THREE.PointsMaterial({color: 0xff00ff, map:texture}); //添加纹理
```

默认粒子是不受光照的影响的，我们可以设置`lights`属性为`true`，让粒子受光照影响：

```js
var pointsMaterial = new THREE.PointsMaterial({color: 0xff00ff, lights:true}); 
//或者
pointsMaterial.lights = true; //开启受光照影响
```

我们也可以设置粒子不受到距离的影响产生近大远小的效果：

```js
var pointsMaterial = new THREE.PointsMaterial({color: 0xff00ff, sizeAttenuation: false}); 
//或者
pointsMaterial.sizeAttenuation = false; //关闭粒子的显示效果受距离影响
```



### 导入模型

官方推荐我们使用的`3D`模型的格式为`glTF`，由于`glTF`专注于传输，因此它的传输和解析的速度都很快。`glTF`模型功能包括：网格，材质，纹理，蒙皮，骨骼，变形动画，骨骼动画，灯光以及相机。

模型制作工具：

- 3dmax
- SketchUp

#### json格式

一般用于官方的editor导出

这里的JSON格式指的是Three.js可以将其转换为场景的3D对象的JSON格式模型。这种格式内部一般必有的四项为：

- metadata 当前模型的相关信息以及生成的工具信息 
- geometries 存储当前模型所使用的几何体的数组
- materials 存储当前模型所使用的材质的数组
- object 当前模型的结构以及标示所应用到的材质和几何体标示
  所有的模型网格，几何体和材质都有一个固定的uuid标识符，JSON格式中都是通过uuid作为引用。

所有的模型网格，几何体和材质都有一个固定的`uuid`标识符，`JSON`格式中都是通过`uuid`作为引用。

#### 3d对象转成JSON

所有的`THREE.Object3D`对象都可以转成`JSON`字符串保存成为文件，我们不能直接将对象转成`JSON`是因为`JSON`是无法保存函数的，所以，`Three.js`给我们提供了一个`toJSON()`的方法来让我们转换为可存储的`JSON`格式。

```js
var obj = scene.toJSON(); //将整个场景的内容转换成为json对象
var obj = group.toJSON(); //将一个模型组转成json对象
var obj = mesh.toJSON(); //将一个模型网格转成json对象
var JSONStr = JSON.stringify(obj); //将json对象转换成json字符串
```

#### 使用ObjectLoader加载JSON模型

既然我们能够导入，肯定就可以导入。这里我们将使用到`Three.js`内置的对象`THREE.ObjectLoader`来加载模型：
直接加载`Three.js`生成的`JSON`对象：

```js
var obj = scene.toJSON(); //将整个场景的内容转换成为json对象

let loader = new THREE.ObjectLoader(); //实例化ObjectLoader对象
let scene = loader.parse(obj); //将json对象再转换成3D对象
```

加载外部的`JSON`文件：

```js
let loader = new THREE.ObjectLoader(); //实例化ObjectLoader对象

//加载模型，并在回调中将生成的模型对象添加到场景中
loader.load("../js/models/json/file.json", function (group) {
    scene.add(group);
});
```

#### glTF格式文件导入

`glTF`格式的3D格式文件是官方推荐的使用的格式，这种格式的文件我们可以在`sketchfab`官网下载，这是一个国外比较知名的模型网站。

loader地址：

https://github.com/mrdoob/three.js/blob/master/examples/js/loaders/GLTFLoader.js

下载地址：

https://sketchfab.com/3d-models?date=week&features=downloadable&sort_by=-likeCount

1. 首先，将`GLTFLoader`加载器插件引入到页面，插件在官方包的地址`/examples/js/loaders/`，一些文件的导入插件都在这一个文件夹内，大家有兴趣可以研究一下：

   ```js
   <script src="../js/loaders/GLTFLoader.js"></script>
   ```

2. 然后创建一个加载器：

   ```js
   var loader = new THREE.GLTFLoader();
   ```

3. 使用加载器去加载模型，并调节一下模型大小在场景内展示：

   ```js
   loader.load('../js/models/gltf/scene.gltf', function (gltf) {
       gltf.scene.scale.set(.1,.1,.1);
       scene.add(gltf.scene);
   });
   ```

> 只要碰到loader，一定要使用dev server

### 动画

动画一般可以定义两种：一种是变形动画，另一种是骨骼动画。

#### 变形动画

变形动画的实现就是通过修改当前模型的顶点位置来实现动画。就比如，一个动画需要变动十次才可以实现，那么我们就需要为当前模型的每一个顶点定义每一次所在的位置，`Three.js`通过每一次修改实现最后的一个动画的整个流程。

1. 定义模型

   ```js
   var cubeGeometry = new THREE.BoxGeometry(4, 4, 4); // 正方体
   var cubeMaterial = new THREE.MeshLambertMaterial({morphTargets: true, color: 0x00ffff}); // 材质
   
   // 创建两个影响立方体的变形目标， 动画完成的终极状态
   var cubeTarget1 = new THREE.BoxGeometry(2, 10, 2);   // 瘦高
   var cubeTarget2 = new THREE.BoxGeometry(8, 2, 8); // 矮胖
   
   // 将两个geometry的顶点放入到立方体的morphTargets里面
   cubeGeometry.morphTargets[0] = {name: 'target1', vertices: cubeTarget1.vertices}; // 设定需要变化的终极目标
   cubeGeometry.morphTargets[1] = {name: 'target2', vertices: cubeTarget2.vertices};
   cubeGeometry.computeMorphNormals(); // 告诉threejs我要进行变形动画
   
   cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
   cube.position.set(0, 10, 0);
   
   // 将立方体添加到顶点当中
   scene.add(cube);
   ```

2. 调试器绑定update

   ```js
   //声明一个保存需求修改的相关数据的对象
   gui = {
     influence1:0.01,
     influence2:0.01,
     update : function () {
       cube.morphTargetInfluences[0] = gui.influence1;  // 原生属性， 代表权重，值越大越接近变化目标
       cube.morphTargetInfluences[1] = gui.influence2;
     }
   };
   
   var datGui = new dat.GUI();
   //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
   datGui.add(gui, 'influence1', 0, 1).onChange(gui.update);
   datGui.add(gui, 'influence2', 0, 1).onChange(gui.update);
   ```
   
   ![image-20190725232943778](https://s2.loli.net/2022/07/02/egA2I8macw57jLG.png)

#### 骨骼动画
骨骼动画是需要生成一个与模型相关的骨架，骨架中的骨骼也会存在对应关系，模型的每一个需要动画的顶点需要设置影响它的骨骼以及骨骼影响顶点的程度。骨骼动画和变形动画相比会比较复杂一些，但是它又有更多的灵活性。我们可以想象一下人体的骨骼，如果使用变形动画，需要把所有的每一次的变动都存一个顶点数组，而骨骼动画，只需要设置骨骼的相关信息，就可以实现更多的动画。

1. 首先， 我们创建了一个圆柱几何体，然后通过圆柱的几何体每一个顶点的y轴坐标来设置需要绑定的骨骼的下标和影响的程度：

   ```js
   //遍历几何体所有的顶点
   for (var i = 0; i < geometry.vertices.length; i++) {
   
       //根据顶点的位置计算出骨骼影响下标和权重
   
       var vertex = geometry.vertices[i];
       var y = (vertex.y + sizing.halfHeight);
   
       var skinIndex = Math.floor(y / sizing.segmentHeight);
       var skinWeight = (y % sizing.segmentHeight) / sizing.segmentHeight;
   
       geometry.skinIndices.push(new THREE.Vector4(skinIndex, skinIndex + 1, 0, 0));
       geometry.skinWeights.push(new THREE.Vector4(1 - skinWeight, skinWeight, 0, 0));
   
   }
   
   ```

   > 几何体的`skinIndices`属性和`skinWeights`属性就是来设置相关的绑定下标和权重（骨骼影响程度）。
   >
   > 
   >
   > Vector4 不代表任何意义,仅仅是4个float , 你需要根据你的需求 赋予这个Vetor4的含义
   > 比如 XYZ 代表坐标 ,W 代表比例, 这样 你可以用 Vector3 pos = new Vector3(X/W,Y/W,Z/W) 来控制坐标的比例
   > 你也可用W 代表透明度, XYZ来控制RPG
   > 或者也可以用W 来进行bool 判断

2. 相应的，我们需要设置一组相关的骨骼，骨骼具有嵌套关系，这样才能实现一个骨架，由于圆柱体比较简单，我们就创建一条骨骼垂直嵌套的骨骼：

   ```js
   bones = [];
   
   var prevBone = new THREE.Bone();
   bones.push(prevBone);
   prevBone.position.y = -sizing.halfHeight;
   
   for (var i = 0; i < sizing.segmentCount; i++) {
   
       var bone = new THREE.Bone();
       bone.position.y = sizing.segmentHeight;
       bones.push(bone); //添加到骨骼数组
       prevBone.add(bone); //上一个骨骼定义为父级
       prevBone = bone;
   
   }
   
   ```

3. 创建纹理时，我们还需要设置当前纹理需要受到骨骼的影响，将材质的`skinning`属性设置为`true`：

   ```js
   var lineMaterial = new THREE.MeshBasicMaterial({
       skinning: true,
       wireframe: true
   });
   ```

4. 最后，我们需要创建骨骼材质，并将模型绑定骨骼：

   ```js
   mesh = new THREE.SkinnedMesh(geometry, [material, lineMaterial]);
   var skeleton = new THREE.Skeleton(bones); //创建骨架
   mesh.add(bones[0]); //将骨骼添加到模型里面
   mesh.bind(skeleton); //模型绑定骨架
   ```
   
   

#### 两种动画的区别

**变形动画**主要用于精度要求高的动画，比如人物的面部表情。优点是动画表达会很到位，缺点就是扩展性不强，只能执行设置好的相关动画。

**骨骼动画**主要用于那种精度要求低，而且需要丰富多样的动画，就比如人物的走动，攻击防御等动画，我们可以通过一套骨骼，修改相应骨骼的位置的信息直接实现相应的效果。确定是没有变形动画的精度高，但是可以实现多种多样的效果。

**总结**：我们可以根据项目的需求来设置不同的动画，就比如一个人物模型，说话我们使用变形动画去实现，而肢体动作使用骨骼动画去实现。

#### 导入动画

https://sketchfab.com/3d-models?date=week&features=downloadable&sort_by=-likeCount

在Three.js的动画系统中，你可以为模型的各种属性设置动画：骨骼动画，变形动画，材质的相关属性（颜色，透明度， 是否可见）。动画属性可以设置淡入淡出效果以及各种扭曲特效。也可以单独的改变一个对象或者多个对象上的动画的影响程度和动画时间。
为了实现这些，Three.js动画系统在2015年修改为了一个类似于Unity和虚幻引擎4的架构。接下来我们了解一下这套动画系统的主要组件以及它们时如何协同工作。

1. 在模型加载成功以后，我们首先将模型创建出来，并将材质的`morphTargets`设置为ture，可以使用变形动画：

   ```js
   mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
       vertexColors: THREE.FaceColors,
       morphTargets: true
   }));
   mesh.castShadow = true;
   mesh.scale.set(0.1, 0.1, 0.1);
   scene.add(mesh);
   
   ```

   

2. 然后我们创建了一个针对于该模型的混合器：

   ```js
   mixer = new THREE.AnimationMixer(mesh);
   
   ```

   

3. 接着使用变形目标数据创建一个动画片段：

   ```js
   var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('gallop', geometry.morphTargets, 30);
   
   ```

   

4. 使用混合器和动画片段创建一个动画播放器来播放：

   ```js
   var action = mixer.clipAction(clip); //创建动画播放器
   action.setDuration(1); //设置当前动画一秒为一个周期
   action.play(); //设置当前动画播放
   
   ```

   

5. 最后，我们还需要在重新绘制循环中更新混合器，进行动作更新：

   ```js
   function render() {
   
       control.update();
   
       var time = clock.getDelta();
   	//由于模型导入是异步的，所以我们再模型没有加载完之前是获取不到混合器的
       if (mixer) {
           mixer.update(time);
       }
   
       renderer.render(scene, camera);
   }
   
   ```



#### 补间动画

补间(动画)（来自 in-between）是一个概念，允许你以平滑的方式更改对象的属性。你只需告诉它哪些属性要更改，当补间结束运行时它们应该具有哪些最终值，以及这需要多长时间，补间引擎将负责计算从起始点到结束点的值。
在Three.js中，我们也有一些修改模型的位置，旋转和缩放的需求，我们无法直接在webgl中使用css3动画，所以，Tween给我们提供了一个很好的解决方案。

**我们先实现一个`Three.js`应用`Tween`的案例：**

1. 首先，创建一个`position`对象，里面存储当前立方体的位置数据：

   ```js
   var position = {x:-40, y:0, z:-30};
   ```

   

2. 然后，通过当前的对象创建一个补间`Tween`：

   ```js
   tween = new TWEEN.Tween(position);
   ```

   

3. 设置每一个属性的目标位置，并告诉`Tween`在2000毫秒内移动到目标位置：

   ```js
   tween.to({x:40, y:30, z:30}, 2000);
   ```

   

4. 我们设置`Tween`对象的每次更新的回调，在每次数据更新以后，将立方体的位置更新掉：

   ```js
   tween.onUpdate(function (pos) {
       cube.position.set(pos.x, pos.y, pos.z);
   });
   ```

   

5. `Tween`对象不会直接执行，需要我们去调用`start()`方法激活：

   ```js
   tween.start();
   ```

   

6. 想要完成整个过程，我们还需要在每帧里面调用`TWEEN.update`，来触发`Tween`对象更新位置：

   ```js
   function render() {
   
       //更新Tween
       TWEEN.update();
   
       control.update();
   
       renderer.render(scene, camera);
   }
   ```

### 性能优化建议

#### 尽量共用几何体和材质

如果你需要创建三百个简单的相同颜色的立方体模型：

```js
for (let i = 0; i < 300; i++) {
	let geometry = new THREE.BoxGeometry(10, 10, 10);
    let material = new THREE.MeshLambertMaterial({color: 0x00ffff});
    let mesh = new THREE.Mesh(geometry, material);
    //随机位置
    mesh.position.set(THREE.Math.randFloatSpread(200), THREE.Math.randFloatSpread(200), THREE.Math.randFloatSpread(200));
    group.add(mesh);
}

```

我们尽量共用相同的几何体和材质：

```js
let geometry = new THREE.BoxGeometry(10, 10, 10);
let material = new THREE.MeshLambertMaterial({color: 0x00ffff});
for (let i = 0; i < 300; i++) {
    let mesh = new THREE.Mesh(geometry, material);
    //随机位置
    mesh.position.set(THREE.Math.randFloatSpread(200), THREE.Math.randFloatSpread(200), THREE.Math.randFloatSpread(200));
    group.add(mesh);
}

```



#### 删除模型时，将材质和几何体从内存中清除

使用`remove()`将模型从场景内删除掉，大家会发现内存基本上没有怎么降低。因为几何体和材质还保存在内存当中，我们需要手动调用`dispose()`方法将其从内存中删除。

```js
//删除group
function deleteGroup(name) {
    let group = scene.getObjectByName(name);
    if (!group) return;
    //删除掉所有的模型组内的mesh
    group.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
            item.geometry.dispose(); //删除几何体
            item.material.dispose(); //删除材质
        }
    });

    scene.remove(group);
}

```



#### 使用merge方法合并不需要单独操作的模型

这个方法新版本整合在了几何体上面，主要应用场景为大量几何体相同材质的模型。我们可以通过将多个几何体拼接成一个单个整体的几何体来节约性能，缺点就是将缺少对单个模型的控制。
如果在不选中combined的时候，选择redraw20000个模型的话，一般只有十几帧的帧率。但是如果选中combined，会发现渲染的帧率能够达到满帧（60帧），性能巨大提升。

merge使用方法：

```js
//合并模型，则使用merge方法合并
var geometry = new THREE.Geometry();
//merge方法将两个几何体对象或者Object3D里面的几何体对象合并,(使用对象的变换)将几何体的顶点,面,UV分别合并.
//THREE.GeometryUtils: .merge() has been moved to Geometry. Use geometry.merge( geometry2, matrix, materialIndexOffset ) instead. 如果新版本用老版本的会报这个错
for(var i=0; i<20000; i++){
    var cube = addCube(); //创建了一个随机位置的几何体模型
    cube.updateMatrix(); //手动更新模型的矩阵
    geometry.merge(cube.geometry, cube.matrix); //将几何体合并
}

scene.add(new THREE.Mesh(geometry, cubeMaterial));

```



#### 在循环渲染中避免使用更新

这里的更新指的是当前的几何体、材质、纹理等发生了修改，需要`Three.js`重新更新显存的数据，具体包括：

```js
geometry.verticesNeedUpdate = true; //顶点发生了修改
geometry.elementsNeedUpdate = true; //面发生了修改
geometry.morphTargetsNeedUpdate = true; //变形目标发生了修改
geometry.uvsNeedUpdate = true; //uv映射发生了修改
geometry.normalsNeedUpdate = true; //法向发生了修改
geometry.colorsNeedUpdate = true; //顶点颜色发生的修改

material.needsUpdate = true

texture.needsUpdate = true;

```

如果它们发生更新，则将其设置为`true`，`Three.js`会通过判断，将数据重新传输到显存当中，并将配置项重新修改为`false`。这是一个很耗运行效率的过程，所以我们尽量只在需要的时候修改，不要放到`render()`方法当中循环设置。

#### 只在需要的时候渲染

如果在没有操作的时候，让循环一直渲染属于浪费资源，接下来我来带给大家一个只在需要时渲染的方法。

```js
var renderEnabled;
function animate() {

    if (renderEnabled) {
        renderer.render(scene, camera);
    }

    requestAnimationFrame(animate);
}

animate();

```

66

### 王者荣耀demo制作

![image-20190725192207759](https://s2.loli.net/2022/07/02/ZfFAa6SYQgdjyLt.png)

#### 1. 场景搭建

```js
scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);
scene.fog = new THREE.Fog(0xa0a0a0, 1000, 11000);
```

我们创建了场景，并设置了场景一个灰色的背景色。还设置了场景的雾化效果，这个雾的效果主要是针对于场景的相机的距离实现的，三个值分别是雾的颜色、雾的开始距离、完全雾化距离相机的位置。

#### 2. 创建相机

我们创建了一个与地面呈45度角并朝向原点的相机：

```js
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 20000);
camera.position.set(0, 800, -800);
camera.lookAt(new THREE.Vector3());
```

#### 3. 创建灯光

我们创建了两个灯光：照射全局的环境光和可以产生阴影的平衡光。

```js
scene.add(new THREE.AmbientLight(0x444444));

light = new THREE.DirectionalLight(0xaaaaaa);
light.position.set(0, 200, 100);
light.lookAt(new THREE.Vector3());

light.castShadow = true;
light.shadow.camera.top = 180;
light.shadow.camera.bottom = -180;
light.shadow.camera.left = -180;
light.shadow.camera.right = 180;

//告诉平行光需要开启阴影投射
light.castShadow = true;

scene.add(light);
```

#### 4. 创建草地

我们使用平面几何体创建了一个贴有草皮贴图的材质的模型：

```js
var groundTexture = new THREE.TextureLoader().load('../images/grasslight-big.jpg');
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(25, 25);
groundTexture.anisotropy = 16;
var groundMaterial = new THREE.MeshLambertMaterial({map: groundTexture});
var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 20000), groundMaterial);
mesh.rotation.x = -Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);
```

到这里，场景、灯光、相机、舞台都已经备齐。接下来我们将请出我们主角`naruto`登场。

#### 5. 添加人物模型

接下来主人公登场，首先我们将模型导入到场景内，注意，案例中的模型比较大，加载和处理需要一定的时间，请小伙伴们耐心等待即可：

```js
var loader = new THREE.FBXLoader();
        loader.load("../js/models/fbx/Naruto.fbx", function (mesh) {
        scene.add(mesh);
});
```

我们不单单只是将模型添加到场景，还对模型的阴影和位置做了一下调整：

```js
//设置模型的每个部位都可以投影
mesh.traverse(function (child) {
    if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
    }
});
```

调整模型的位置，站立在草地上面

```js
mesh.position.y += 110;
```

设置灯光一直照射模型：

```js
//设置光线焦点模型
light.target = mesh;
```

#### 6. 添加动画

这个模型里面含有27个骨骼动画，我们可以通过设置不同的动画，来实现一整套的动作来实现相应的比如攻击效果，移动效果等。接下来我们通过模型的数据生成一下所需的动画：

```js
actions = []; //所有的动画数组

for (var i = 0; i < mesh.animations.length; i++) {
    createAction(i);
}

function createAction(i) {
    actions[i] = mixer.clipAction(mesh.animations[i]);
    gui["action" + i] = function () {
        for (var j = 0; j < actions.length; j++) {
            if (j === i) {
                actions[j].play();
            }
            else {
                actions[j].stop();
            }
        }
    };
}

//添加暂停所有动画的按键
gui.stop = function () {
    for (var i = 0; i < actions.length; i++) {
        actions[i].stop();
    }
};
```

模型加载成功后，我们需要让模型执行一个普通的站立效果：

```js
//第24个动作是鸣人站立的动作
gui["action" + 24]();
```

#### 7. 添加操作

在案例中，我们主要添加了两种操作：模型位置移动操作和攻击效果。
操作按钮为了方便，直接使用的`dom`标签模拟出来的。
模型位置移动操作中，我们需要模型的位置的变动和模型的朝向以及修改站立动画和奔跑动画的切换。
攻击效果则是实现攻击并且根据点击速度实现一整套的攻击动作切换。

**实现位移**

在实现位置移动效果中，我们为按钮绑定了三个事件：鼠标按下，鼠标移动，鼠标抬起。
在鼠标按下时，我们获取到了当前操作圆盘的中心点的位置，让模型进入跑步动画，绑定了鼠标的移动和抬起事件。重要的是更新模型的移动方向和移动速度。

```js
dop.$(control).on("down", function (event) {
    event.preventDefault();

    //获取当前的按钮中心点
    center.x = window.innerWidth - parseFloat(dop.getFinalStyle(control, "right")) - parseFloat(dop.getFinalStyle(control, "width")) / 2;
    center.y = window.innerHeight - parseFloat(dop.getFinalStyle(control, "bottom")) - parseFloat(dop.getFinalStyle(control, "height")) / 2;

    getRadian(event);

    //鼠标按下切换跑步动作
    state.skills === 0 && gui["action" + 3]();

    //给document绑定拖拽和鼠标抬起事件
    doc.on("move", move);
    doc.on("up", up);
});

```

上面的`dop`类是一个兼容多端的事件库。
在鼠标移动回调事件中，我们更新模型的移动方向和移动速度。

```js
function move(event) {
    getRadian(event);
}
```

最后在鼠标抬起事件中，我们解绑事件，将按键复原，并停止掉模型的移动状态，将模型动画恢复到站立状态。

```js
function up() {
    doc.remove("move", move);
    doc.remove("up", up);

    //按钮复原
    bar.style.marginTop = 0;
    barWrap.style.transform = `translate(-50%, -50%) rotate(0deg)`;
    bar.style.transform = `translate(-50%, -50%) rotate(0deg)`;

    //设置移动距离为零
    characterMove(new THREE.Vector2(), 0);

    //鼠标抬起切换站立状态
    state.skills === 0 && gui["action" + 24]();
}
```

三个事件绑定完成后，我们需要将在回调中获得的值求出当前的偏转方向和移动速度：
首先我们获取一下当前鼠标的位置：

```js
if (media === "pc") {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
}
else {
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
}

```

根据位置求出距离操作圆盘中心的位置，并保证最大值也不会超出圆盘的半径：

```js
let distance = center.distanceTo(mouse);
distance >= parseFloat(dop.getFinalStyle(control, "width")) / 2 && (distance = parseFloat(dop.getFinalStyle(control, "width")) / 2);
```

计算出来当前位置和中心的夹角，并修改dom的位置：

```js
//计算两点之间的夹角
mouse.x = mouse.x - center.x;
mouse.y = mouse.y - center.y;

//修改操作杆的css样式
bar.style.marginTop = `-${distance}px`;
bar.style.transform = `translate(-50%, -50%) rotate(-${(mouse.angle() / Math.PI * 180 + 90) % 360}deg)`;
barWrap.style.transform = `translate(-50%, -50%) rotate(${(mouse.angle() / Math.PI * 180 + 90) % 360}deg)`;

```

函数的最后，则调用的`characterMove`方法，将按钮数据转换成为模型实际需要移动的距离。

```js
//修改当前的移动方向和移动速度
characterMove(mouse.normalize(), distance / (parseFloat(dop.getFinalStyle(control, "width")) / 2));
```

接下来我们查看一下characterMove方法，在这个方法中，我们计算出了模型每一帧需要移动的距离。这里有一个问题，我们所谓的操作杆向前让模型移动前方，其实是相机朝向的前方。所以我们需要先求出相机的前方矢量，再通过相机的前方矢量为基础，计算出来模型实际方向。
我们首先声明了两个变量，一个是旋转矩阵，另一个是移动矢量：

```js
let direction = new THREE.Matrix4(); //当前移动的旋转矩阵
let move = new THREE.Vector3(); //当前位置移动的距离
```

在`characterMove`函数内，我们根据相机的四元数获得了旋转矩阵：

```js
//重置矩阵
direction.identity();

//通过相机的四元数获取到相机的旋转矩阵
let quaternion = camera.quaternion;
direction.makeRotationFromQuaternion(quaternion);
```

然后通过旋转矩阵和当前的操作杆的方向通过相乘计算出来实际模型移动的方向：

```js
//获取到操作杆的移动方向
move.x = vector.x;
move.y = 0;
move.z = vector.y;

//通过相机方向和操作杆获得最终角色的移动方向
move.applyMatrix4(direction);
move.normalize();

```

最后，通过比例和方向得出当前模型每一帧移动的距离，因为我们不需要修改模型y轴，所以实际上也只是修改两个轴的位置：

```js
move.x = move.x * ratio * 10;
move.z = move.z * ratio * 10;
```

我们获取到了模型的每一帧移动的距离，还需要在帧循环中调用：

```js
//如果模型添加成功，则每帧都移动角色位置
if (naruto) {
    //获取当前位置
    position.x += move.x;
    position.z += move.z;

    //修改模型位置
    naruto.position.x = position.x;
    naruto.position.z = position.z;

    //修改平衡光的位置
    light.position.x = position.x;
    light.position.z = position.z + 100;

    //修改相机位置
    camera.position.x = position.x;
    camera.position.z = position.z - 800;
}

```

当前的模型，灯光，和相机都会跟随移动，实现了，我们上面动图中的模型移动的效果

**实现攻击效果**

在实现攻击效果时，我没有只是简单的实现一个普通的攻击，而是直接实现一套连招。
这一套连招是通过五个动作组成，在执行一个攻击动画时如果再次点击了攻击按钮，执行完这个攻击动画将不会切换到站立动画，而是直接切换到连招的下一个攻击动画中。
只要连续点按攻击按钮，模型将完成一整套的动作。实现这个效果，我们只是使用了一个简单的定时器即可实现，接下来我们通过代码了解一下实现过程。

在实现动画前，先设置一个连招的数组，将需要的动作添加到数组当中。我这里添加了五个手部攻击的效果：

```js
let attackList = [12, 13, 14, 15, 16]; //连招的循序
let attackCombo = false; //是否连招，接下一个攻击
```

我们还设置了`attackCombo`设置当前是否可以连招的变量，这个变量`state.skills`值不为0时，将变为true。定时器每一次更新的时候，将判断`attackCombo`是否为true，在为true的状态下，将执行连招的下一个动作。否则，将停止连招。

```js
//attackIndex 等于0，当前不处于攻击状态  不等于，当前处于攻击状态
if(state.skills === 0){
    state.skills++;
    gui["action" + attackList[state.skills-1]]();
    attackInterval = setInterval(function () {
        if(attackCombo){
            //如果设置了连招，上一个攻击动作完成后，进行下一个攻击动作
            state.skills++;
            //如果整套攻击动作已经执行完成，则清除定时器
            if(state.skills-1 >= attackList.length){
                closeAttack();
                return;
            }

            //进行下一个动作
            gui["action" + attackList[state.skills-1]]();

            attackCombo = false;
        }
        else{
            closeAttack();
        }
    }, naruto.animations[attackList[state.skills-1]].duration*1000);
}
else{
    attackCombo = true;
}

```

在关闭掉攻击动画的函数内，我们首先将`state.skills`设置为0，然后恢复到移动或者站立动画，最后清除掉定时器：

```js
//关闭攻击状态
function closeAttack() {
    state.skills = 0;
    //根据状态设置是移动状态还是站立状态
    state.move ? gui["action" + 3]() :gui["action" + 24](); //回到站立状态
    clearInterval(attackInterval);
}
```



## D3.js

### 为什么学习D3

**D3.js和threejs的应用场景完全不一样**。threejs主要应用与基于webGL的3D场景，而D3.js确主要应用与2D场景。

它们一起形成了一种互补关系。

简而言之D3JS就是一个数据可视化的库。

那什么是数据可视化呢？

> 给出一组数据 [10，80，40,100,30,20,50]

![image-20190801162422591](https://s2.loli.net/2022/07/02/lEQI5jviK1zZH9J.png)

#### 类似的库 eharts

ECharts，一个使用 JavaScript 实现的开源可视化库，可以流畅的运行在 PC 和移动设备上，兼容当前绝大部分浏览器，ECharts 提供了常规的[折线图](https://www.echartsjs.com/option.html#series-line)、[柱状图](https://www.echartsjs.com/option.html#series-line)、[散点图](https://www.echartsjs.com/option.html#series-scatter)、[饼图](https://www.echartsjs.com/option.html#series-pie) 等等。

#### 和eharts的区别

eharts是封装好的各种的图表可以直接拿来使用，类似于图表模具，直接拿来使用即可。

D3.js就像画笔一样，一切都由你自由发挥。

### 基本介绍

**D3.js**（**Data-Driven Documents**）是一个使用动态图形进行[数据可视化](https://zh.wikipedia.org/wiki/資料視覺化)的[JavaScript程序库](https://zh.wikipedia.org/wiki/JavaScript函式庫)。与[W3C](https://zh.wikipedia.org/wiki/W3C)标准兼容，并且利用广泛实现的[SVG](https://zh.wikipedia.org/wiki/SVG)、JavaScript和[CSS](https://zh.wikipedia.org/wiki/CSS)标准，改良自早期的[Protovis](https://zh.wikipedia.org/w/index.php?title=Protovis&action=edit&redlink=1)程序库。与其他的程序库相比，D3对**视图结果有很大的可控性**。D3是2011年面世的，同年的8月发布了2.0.0版。到2018年4月，D3已被更新到了5.5.0版[[1\]](https://zh.wikipedia.org/wiki/D3.js#cite_note-d3_Releases-1)。

#### 	发展历史

在D3.js开发之前已经有出现过许多尝试做数据可视化的包，例如[Prefuse](https://zh.wikipedia.org/w/index.php?title=Prefuse&action=edit&redlink=1)，Flare和Protovis程序库，他们都可以视为D3.js的前身。然而Prefuse和Flare皆有缺点，皆不能只透过浏览器完成渲染，皆须要透过额外插件来完成。

例如2005年发布的Prefuse是一个数据可视化程序库，但是它需要透过网页的[Java](https://zh.wikipedia.org/wiki/Java)插件才能于[浏览器](https://zh.wikipedia.org/wiki/瀏覽器)中呈现；而Flare是2007年发布的另一个数据可视化工具包，由于其是使用[ActionScript](https://zh.wikipedia.org/wiki/ActionScript)编程语言开发，因此也需要额外插件，即[Flash](https://zh.wikipedia.org/wiki/Adobe_Flash_Player)插件才能完成渲染。

2009年，[史丹佛大学](https://zh.wikipedia.org/wiki/史丹佛大學)的史丹佛可视化团队（Stanford Visualization Group）的杰佛瑞·赫尔、[迈克·保斯托](https://zh.wikipedia.org/w/index.php?title=邁克·保斯托&action=edit&redlink=1)和瓦迪姆·欧格菲兹齐利用开发Prefuse和Flare的经验开始用Javscript开发了可从给定数据产生SVG图形的Protovis程序库。而Protovis程序库在业界和学界皆有一定的知名度[[3\]](https://zh.wikipedia.org/wiki/D3.js#cite_note-3)。

2011年，史丹佛可视化团队停止开发Protovis，并开始开发新的数据可视化程序库，借由之前开发Protovis的经验，开发出了D3.js程序库，在注重于Web标准的同时提供了更丰富的平台也有了更好的性能[[4\]](https://zh.wikipedia.org/wiki/D3.js#cite_note-Bostock,_Ogievetsky_&_Heer_2011-4)。

#### 技术原理

D3.js透过预先创建好迁入于网页中的[JavaScript](https://zh.wikipedia.org/wiki/JavaScript)函数来选择网页元素、创建[SVG](https://zh.wikipedia.org/wiki/SVG)元素、调整[CSS](https://zh.wikipedia.org/wiki/CSS)来呈现数据，并且也可以设置动画、动态改变对象状态或加入工具提示来完成用户交互功能。使用简单的D3.js函数就能够将大型的数据数据结构与SVG对象进行绑定，并且能生成[格式化文本](https://zh.wikipedia.org/wiki/格式化文本)和各种图表。



### 基本使用

#### hello world

先尝试用 D3 写第一个 HelloWorld 程序。学编程入门的第一个程序都是在屏幕上输出 HelloWorld，本课稍微有些不同，不是单纯的输出。

在 HTML 中输出 HelloWorld 是怎样的呢，先看下面的代码。

```html
<html> 
  <head> 
        <meta charset="utf-8"> 
        <title>HelloWorld</title> 
  </head> 
    <body> 
        <p>Hello World 1</p>
        <p>Hello World 2</p>
    </body> 
</html>
```

##### 用 JavaScript 来更改 HelloWorld

对于上面输出的内容，如果想用 JavaScript 来更改这两行文字，怎么办呢？我们会添加代码变为：

```html
<html> 
  <head> 
        <meta charset="utf-8"> 
        <title>HelloWorld</title> 
  </head> 
    <body> 
    <p>Hello World 1</p>
    <p>Hello World 2</p>
        <script>
        var paragraphs = document.getElementsByTagName("p");
        for (var i = 0; i < paragraphs.length; i++) {
          var paragraph = paragraphs.item(i);
          paragraph.innerHTML = "I like dog.";
        }          
        </script> 
    </body> 
</html>
```

##### 用 D3 来更改 HelloWorld

如果使用 D3.js 来修改这两行呢？只需添加一行代码即可。注意不要忘了引用 D3.js 源文件。

**引入**： 

```
<script src="https://d3js.org/d3.v5.js"></script>
```

```html
<html> 
  <head> 
        <meta charset="utf-8"> 
        <title>HelloWorld</title> 
  </head> 
    <body> 
        <p>Hello World 1</p>
        <p>Hello World 2</p>
        <script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script> 
        <script>  
        d3.select("body").selectAll("p").text("www.ourd3js.com");      
        </script> 
    </body> 
</html>
```

接下来改变字体的颜色和大小，稍微修改上述代码：

```js
//选择<body>中所有的<p>，其文本内容为 www.ourd3js.com，选择集保存在变量 p 中
var p = d3.select("body")
          .selectAll("p")
          .text("www.ourd3js.com");

//修改段落的颜色和字体大小
p.style("color","red")
 .style("font-size","72px");
```

#### 选择元素

在 D3 中，用于选择元素的函数有两个：

- d3.select()：是选择所有指定元素的第一个
- d3.selectAll()：是选择指定元素的全部

这两个函数返回的结果称为选择集。

例如，选择集的常见用法如下。

```js
var body = d3.select("body"); //选择文档中的body元素
var p1 = body.select("p");      //选择body中的第一个p元素
var p = body.selectAll("p");    //选择body中的所有p元素
var svg = body.select("svg");   //选择body中的svg元素
var rects = svg.selectAll("rect");  //选择svg中所有的svg元素
```

#### 绑定数据

选择集和绑定数据通常是一起使用的。

D3 有一个很独特的功能：能将数据绑定到 DOM 上，也就是绑定到文档上。这么说可能不好理解，例如网页中有段落元素 p 和一个整数 5，于是可以将整数 5 与 p 绑定到一起。绑定之后，当需要依靠这个数据才操作元素的时候，会很方便。

D3 中是通过以下两个函数来绑定数据的：

- datum()：绑定一个数据到选择集上
- data()：绑定一个数组到选择集上，数组的各项值分别与选择集的各元素绑定

相对而言，data() 比较常用。

假设现在有三个段落元素如下。

```
<p>Apple</p>
<p>Pear</p>
<p>Banana</p>
```

**datum()**

假设有一字符串 China，要将此字符串分别与三个段落元素绑定，代码如下：

```js
var str = "China";

var body = d3.select("body");
var p = body.selectAll("p");

p.datum(str);

p.text(function(d, i){
    return "第 "+ i + " 个元素绑定的数据是 " + d;
});
```

绑定数据后，使用此数据来修改三个段落元素的内容，其结果如下：

```
第 0 个元素绑定的数据是 China

第 1 个元素绑定的数据是 China

第 2 个元素绑定的数据是 China
```

在上面的代码中，用到了一个无名函数 **function(d, i)**。当选择集需要使用被绑定的数据时，常需要这么使用。其包含两个参数，其中：

- d 代表数据，也就是与某元素绑定的数据。
- i 代表索引，代表数据的索引号，从 0 开始。

例如，上述例子中：第 0 个元素 apple 绑定的数据是 China。

**data()**

有一个数组，接下来要分别将数组的各元素绑定到三个段落元素上。

```js
var dataset = ["I like dog","I like cat","I like snake"];
```

绑定之后，其对应关系的要求为：

- Apple 与 I like dog 绑定
- Pear 与 I like cat 绑定
- Banana 与 I like snake 绑定

调用 data() 绑定数据，并替换三个段落元素的字符串为被绑定的字符串，代码如下：

```js
var body = d3.select("body");
var p = body.selectAll("p");

p.data(dataset)
  .text(function(d, i){
      return d;
});
```

这段代码也用到了一个无名函数 function(d, i)，其对应的情况如下：

- 当 i == 0 时， d 为 I like dog。
- 当 i == 1 时， d 为 I like cat。
- 当 i == 2 时， d 为 I like snake。

此时，三个段落元素与数组 dataset 的三个字符串是一一对应的，因此，在函数 function(d, i) 直接 return d 即可。

结果自然是三个段落的文字分别变成了数组的三个字符串。

```
I like dog

I like cat

I like snake
```

#### 选择、插入、删除元素

已经讲解了 select 和 selectAll，以及选择集的概念。本节具体讲解这两个函数的用法。

假设在 body 中有三个段落元素：

```
<p>Apple</p>
<p>Pear</p>
<p>Banana</p>
```

现在，要分别完成以下四种选择元素的任务。

##### 选择第一个 p 元素

```
t("p");
p1.style("color","red");
```

##### 选择三个 p 元素

```javascript
var p = body.selectAll("p");
p.style("color","red");
```

##### 选择第二个 p 元素

有不少方法，一种比较简单的是给第二个元素添加一个 id 号。

Pear

然后，使用 select 选择元素，注意参数中 id 名称前要加 # 号。

```
var p2 = body.select("#myid");
p2.style("color","red");
```

##### 选择后两个 p 元素

给后两个元素添加 class，

```
<p class="myclass">Pear</p>
<p class="myclass">Banana</p>
```

由于需要选择多个元素，要用 selectAll。注意参数，class 名称前要加一个点。

```javascript
var p = body.selectAll(".myclass");
p.style("color","red");
```

#### 插入元素

插入元素涉及的函数有两个：

- append()：在选择集末尾插入元素
- insert()：在选择集前面插入元素

假设有三个段落元素，与上文相同。

**append()**

```
body.append("p")
    .text("append p element");
```

在 body 的末尾添加一个 p 元素，结果为：

```
Apple
Pear
Banana
append p element
```

**insert()**

在 body 中 id 为 myid 的元素前添加一个段落元素。

```
body.insert("p","#myid")
  .text("insert p element");
```

已经指定了 Pear 段落的 id 为 myid，因此结果如下。

```
Apple
insert p element
Pear
Banana
```

#### 删除元素

删除一个元素时，对于选择的元素，使用 remove 即可，例如：

```
var p = body.select("#myid");
p.remove();
```



### SVG 基本使用

SVG 意为可缩放矢量图形（Scalable Vector Graphics）。

SVG 使用 XML 格式定义图像。

#### 什么是svg

- SVG 指可伸缩矢量图形 (Scalable Vector Graphics)
- SVG 用来定义用于网络的基于矢量的图形
- SVG 使用 XML 格式定义图形
- **SVG 图像在放大或改变尺寸的情况下其图形质量不会有所损失**
- SVG 是万维网联盟的标准
- **SVG 与诸如 DOM 和 XSL 之类的 W3C 标准是一个整体**

#### hello-world

```html
<html>
<body>
 
<h1>My first SVG</h1>
 
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <circle cx="100" cy="50" r="40" stroke="black"
  stroke-width="2" fill="red" />
</svg>
 
</body>
</html>
```

#### 简单的 SVG 实例

一个简单的SVG图形例子：

这里是SVG文件（SVG文件的保存与SVG扩展）：

```svg
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" 
"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">

<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <circle cx="100" cy="50" r="40" stroke="black"
  stroke-width="2" fill="red" />
</svg>
```

**第一行**包含了 XML 声明。请注意 standalone 属性！该属性规定此 SVG 文件是否是"独立的"，或含有对外部文件的引用。

standalone="no" 意味着 SVG 文档会引用一个外部文件 - 在这里，是 DTD 文件。

**第二和第三行**引用了这个外部的 SVG DTD。该 DTD 位于 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"。该 DTD 位于 W3C，含有所有允许的 SVG 元素。

SVG 代码以 `<svg> `元素开始，包括开启标签` <svg> `和关闭标签 `</svg> `。这是根元素。width 和 height 属性可设置此 SVG 文档的宽度和高度。version 属性可定义所使用的 SVG 版本，xmlns 属性可定义 SVG 命名空间。

SVG 的` <circle>` 用来创建一个圆。cx 和 cy 属性定义圆中心的 x 和 y 坐标。如果忽略这两个属性，那么圆点会被设置为 (0, 0)。r 属性定义圆的半径。

stroke 和 stroke-width 属性控制如何显示形状的轮廓。我们把圆的轮廓设置为 2px 宽，黑边框。

fill 属性设置形状内的颜色。我们把填充颜色设置为红色。

关闭标签的作用是关闭 SVG 元素和文档本身。

#### SVG 在 HTML 页面

SVG 文件可通过以下标签嵌入 HTML 文档：<embed>、<object> 或者 <iframe>。

SVG的代码可以直接嵌入到HTML页面中，或您可以直接链接到SVG文件。

##### 使用 `<embed>` 标签

```
<embed src="circle1.svg" type="image/svg+xml" />
```

##### 直接在HTML嵌入SVG代码

在Firefox、Internet Explorer9、谷歌Chrome和Safari中，你可以直接在HTML嵌入SVG代码。

```html
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
   <circle cx="100" cy="50" r="40" stroke="black" stroke-width="2" fill="red" />
</svg>
```

#### SVG图形

SVG有一些预定义的形状元素，可被开发者使用和操作：

- 矩形 <rect>
- 圆形 <circle>
- 椭圆 <ellipse>
- 线 <line>
- 折线 <polyline>
- 多边形 <polygon>
- 路径 <path>



##### 矩形

EX1:

<rect> 标签可用来创建矩形，以及矩形的变种：

```html
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <rect width="300" height="100"
  style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)"/>
</svg>
```

- rect 元素的 width 和 height 属性可定义矩形的高度和宽度
- style 属性用来定义 CSS 属性
- CSS 的 fill 属性定义矩形的填充颜色（rgb 值、颜色名或者十六进制值）
- CSS 的 stroke-width 属性定义矩形边框的宽度
- CSS 的 stroke 属性定义矩形边框的颜色

EX2:

让我们看看另一个例子，它包含一些新的属性：

```html
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <rect x="50" y="20" width="150" height="150"
  style="fill:blue;stroke:pink;stroke-width:5;fill-opacity:0.1;
  stroke-opacity:0.9"/>
</svg>
```

- x 属性定义矩形的左侧位置（例如，x="0" 定义矩形到浏览器窗口左侧的距离是 0px）
- y 属性定义矩形的顶端位置（例如，y="0" 定义矩形到浏览器窗口顶端的距离是 0px）
- CSS 的 fill-opacity 属性定义填充颜色透明度（合法的范围是：0 - 1）
- CSS 的 stroke-opacity 属性定义轮廓颜色的透明度（合法的范围是：0 - 1）



##### 圆形

<circle> 标签可用来创建一个圆：

```html
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <circle cx="100" cy="50" r="40" stroke="black"
  stroke-width="2" fill="red"/>
</svg>
```

- cx和cy属性定义圆点的x和y坐标。如果省略cx和cy，圆的中心会被设置为(0, 0)
- r属性定义圆的半径



##### 椭圆

<ellipse> 元素是用来创建一个椭圆：

椭圆与圆很相似。不同之处在于椭圆有不同的x和y半径，而圆的x和y半径是相同的：

````html
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <ellipse cx="300" cy="80" rx="100" ry="50"
  style="fill:yellow;stroke:purple;stroke-width:2"/>
</svg>
````

##### 直线

<line> 元素是用来创建一个直线：

```html
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <line x1="0" y1="0" x2="200" y2="200"
  style="stroke:rgb(255,0,0);stroke-width:2"/>
</svg>
```

- x1 属性在 x 轴定义线条的开始
- y1 属性在 y 轴定义线条的开始
- x2 属性在 x 轴定义线条的结束
- y2 属性在 y 轴定义线条的结束

##### 多边形

<polygon> 标签用来创建含有不少于三个边的图形。

polygon来自希腊。 "Poly" 意味 "many" ， "gon" 意味 "angle".

```html
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <polygon points="200,10 250,190 160,210"
  style="fill:lime;stroke:purple;stroke-width:1"/>
</svg>
```

下面的示例创建一个四边的多边形：

```html
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <polygon points="220,10 300,210 170,250 123,234"
  style="fill:lime;stroke:purple;stroke-width:1"/>
</svg>
```

##### 曲线

<polyline> 元素是用于创建任何只有直线的形状：

```html
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <polyline points="20,20 40,25 60,40 80,120 120,140 200,180"
  style="fill:none;stroke:black;stroke-width:3" />
</svg>
```

只有直线的另一个例子：

```html
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <polyline points="0,40 40,40 40,80 80,80 80,120 120,120 120,160" style="fill:white;stroke:red;stroke-width:4" />
</svg>
```

##### 路径

<path> 元素用于定义一个路径。

下面的命令可用于路径数据：

- M = moveto
- L = lineto
- H = horizontal lineto
- V = vertical lineto
- C = curveto
- S = smooth curveto
- Q = quadratic Bézier curve
- T = smooth quadratic Bézier curveto
- A = elliptical Arc
- Z = closepath

例子定义了一条路径，它开始于位置150 0，到达位置75 200，然后从那里开始到225 200，最后在150 0关闭路径。

```html
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
    <path d="M150 0 L75 200 L225 200 Z" />
</svg>
```

##### 文本

<text> 元素用于定义文本。

EX:1

```
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <text x="0" y="15" fill="red">I love SVG</text>
</svg>
```

##### Svg与Canvas的区别？

1. 绘制的图片格式不同

```
Canvas 的工具getContext 绘制出来的图形或传入的图片都依赖分辨率，能够以 .png 和 .jpg格式保存存储图像，可以说是位图

SVG 可以在H5中直接绘制，但绘制的是矢量图

由于位图依赖分辨率，矢量图不依赖分辨率，所以Canvas和SVG的图片格式的不同实际上是他们绘制出来的图片的格式不同造成的。
```

2. Canvas不支持事件处理器，SVG支持事件处理器

```
Canvas 绘制的图像 都在Canvas这个画布里面，是Canvas的一部分，不能用js获取已经绘制好的图形元素。
```

3. 适用范围不同

```
Canvas是逐像素进行渲染的，一旦图形绘制完成，就不会继续被浏览器关注。而SVG是通过DOM操作来显示的。

所以Canvas的文本渲染能力弱，而SVG最适合带有大型渲染区域的应用程序，比如地图。

而Canvas 最适合有许多对象要被频繁重绘的图形密集型游戏。

而SVG由于DOM操作 在复杂度高的游戏应用中 会减慢渲染速度。所以不适合在游戏应用。
```



### 实践

#### 做一个简单的柱状图

![image-20190802172953054](https://s2.loli.net/2022/07/02/5WMfGmcuzILs67J.png)

##### 画布

前几章的处理对象都是 HTML 的文字，没有涉及图形的制作。

要绘图，首要需要的是一块绘图的“**画布**”。

HTML 5 提供两种强有力的“画布”：**SVG** 和 **Canvas**。

##### 添加画布

D3 虽然没有明文规定一定要在 SVG 中绘图，但是 D3 提供了众多的 SVG 图形的生成器，它们都是只支持 SVG 的。因此，建议使用 SVG 画布。

使用 D3 在 body 元素中添加 svg 的代码如下。

```js
var width = 300;  //画布的宽度
var height = 300;   //画布的高度

var svg = d3.select("body")     //选择文档中的body元素
    .append("svg")          //添加一个svg元素
    .attr("width", width)       //设定宽度
    .attr("height", height);    //设定高度
```

有了画布，接下来就可以在画布上作图了。

##### 绘制矩形

本文绘制一个横向的柱形图。只绘制矩形，不绘制文字和坐标轴。

在 SVG 中，矩形的元素标签是 rect。例如：

```html
<svg>
  <rect></rect>
  <rect></rect>
</svg>
```

上面的 rect 里没有矩形的属性。矩形的属性，常用的有四个：

- x：矩形左上角的 x 坐标
- y：矩形左上角的 y 坐标
- width：矩形的宽度
- height：矩形的高度

要注意，在 SVG 中，x 轴的正方向是水平向右，y 轴的正方向是垂直向下的。

现在给出一组数据，要对此进行可视化。数据如下：

```js
var dataset = [ 250 , 210 , 170 , 130 , 90 ];  //数据（表示矩形的宽度）
```

为简单起见，我们直接用数值的大小来表示矩形的像素宽度（后面会说到这不是一种好方法）。然后，添加以下代码。

```js
var rectHeight = 25;   //每个矩形所占的像素高度(包括空白)

svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x",20)
    .attr("y",function(d,i){
         return i * rectHeight;
    })
    .attr("width",function(d){
         return d;
    })
    .attr("height",rectHeight-2)
    .attr("fill","steelblue");
```

这段代码添加了与 dataset 数组的长度相同数量的矩形，所使用的语句是：

```js
svg.selectAll("rect")   //选择svg内所有的矩形
    .data(dataset)  //绑定数组
    .enter()        //指定选择集的enter部分
    .append("rect") //添加足够数量的矩形元素
```

这段代码以后会常常出现在 D3 的代码中，请务必牢记。目前不深入讨论它的作用机制是怎样的，只需要读者牢记，当：

**有数据，而没有足够图形元素的时候，使用此方法可以添加足够的元素。**

添加了元素之后，就需要分别给各元素的属性赋值。在这里用到了 function(d, i)，前面已经讲过，d 代表与当前元素绑定的数据，i 代表索引号。给属性赋值的时候，是需要用到被绑定的数据，以及索引号的。

最后一行的：

```javascript
.attr("fill","steelblue");
```



##### 比例尺的使用

比例尺是 D3 中很重要的一个概念，上一章里曾经提到过直接用数值的大小来代表像素不是一种好方法，本章正是要解决此问题。

**为什么需要比例尺**

上一章制作了一个柱形图，当时有一个数组：

```js
var dataset = [ 250 , 210 , 170 , 130 , 90 ];
```

绘图时，直接使用 250 给矩形的宽度赋值，即矩形的宽度就是 250 个像素。

此方式非常具有局限性，如果数值过大或过小，例如：

```javascript
var dataset_1 = [ 2.5 , 2.1 , 1.7 , 1.3 , 0.9 ];
var dataset_2 = [ 2500, 2100, 1700, 1300, 900 ];
```

对以上两个数组，绝不可能用 2.5 个像素来代表矩形的宽度，那样根本看不见；也不可能用 2500 个像素来代表矩形的宽度，因为画布没有那么长。

于是，我们需要一种计算关系，能够：

**将某一区域的值映射到另一区域，其大小关系不变。**

这就是比例尺（Scale）。

**有哪些比例尺**

比例尺，很像数学中的函数。例如，对于一个一元二次函数，有 x 和 y 两个未知数，当 x 的值确定时，y 的值也就确定了。

在数学中，x 的范围被称为**定义域**，y 的范围被称为**值域**。

D3 中的比例尺，也有定义域和值域，分别被称为 domain 和 range。开发者需要指定 domain 和 range 的范围，如此即可得到一个计算关系。

D3 提供了多种比例尺，下面介绍最常用的两种。



###### 线性比例尺

线性比例尺，能将一个连续的区间，映射到另一区间。要解决柱形图宽度的问题，就需要线性比例尺。

假设有以下数组：

```js
var dataset = [1.2, 2.3, 0.9, 1.5, 3.3];
```

现有要求如下：

**将 dataset 中最小的值，映射成 0；将最大的值，映射成 300。**

代码如下：

```js
var min = d3.min(dataset);
var max = d3.max(dataset);

var linear = d3.scaleLinear()
        .domain([min, max])
        .range([0, 300]);

linear(0.9);    //返回 0
linear(2.3);    //返回 175
linear(3.3);    //返回 300
```

其中，**d3.scale.linear()** 返回一个线性比例尺。domain() 和 range() 分别设定比例尺的定义域和值域。在这里还用到了两个函数，它们经常与比例尺一起出现：

- d3.max()
- d3.min()

这两个函数能够求数组的最大值和最小值，是 D3 提供的。按照以上代码，

比例尺的定义域 domain 为：[0.9, 3.3]

比例尺的值域 range 为：[0, 300]

因此，当输入 0.9 时，返回 0；当输入 3.3 时，返回 300。当输入 2.3 时呢？返回 175，这是按照线性函数的规则计算的。

有一点请大家记住：

d3.scale.linear() 的返回值，是可以当做**函数**来使用的。因此，才有这样的用法：linear(0.9)。



###### 序数比例尺

有时候，定义域和值域不一定是连续的。例如，有两个数组：

```js
var index = [0, 1, 2, 3, 4];
var color = ["red", "blue", "green", "yellow", "black"];
```

我们希望 0 对应颜色 red，1 对应 blue，依次类推。

但是，这些值都是离散的，线性比例尺不适合，需要用到序数比例尺。

```js
var ordinal = d3.scaleOrdinal()
        .domain(index)
        .range(color);

ordinal(0); //返回 red
ordinal(2); //返回 green
ordinal(4); //返回 black
```

###### 给柱形图添加比例尺

修改一下数组，再定义一个线性比例尺。

```js
var dataset = [ 2.5 , 2.1 , 1.7 , 1.3 , 0.9 ];

var linear = d3.scale.linear()
        .domain([0, d3.max(dataset)])
        .range([0, 250]);

```

其后，按照上一章的方法添加矩形，在给矩形设置宽度的时候，应用比例尺。

```js
var rectHeight = 25;   //每个矩形所占的像素高度(包括空白)

svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x",20)
    .attr("y",function(d,i){
         return i * rectHeight;
    })
    .attr("width",function(d){
         return linear(d);   //在这里用比例尺
    })
    .attr("height",rectHeight-2)
    .attr("fill","steelblue");
```

如此一来，所有的数值，都按照同一个线性比例尺的关系来计算宽度，因此数值之间的大小关系不变。



##### 坐标轴

坐标轴，是可视化图表中经常出现的一种图形，由一些列线段和刻度组成。坐标轴在 SVG 中是没有现成的图形元素的，需要用其他的元素组合构成。D3 提供了坐标轴的组件，如此在 SVG 画布中绘制坐标轴变得像添加一个普通元素一样简单。

![image-20190802180149326](https://s2.loli.net/2022/07/02/2r31CwbkMEQpRo7.png)

在 SVG 画布的预定义元素里，有六种基本图形：

- 矩形
- 圆形
- 椭圆
- 线段
- 折线
- 多边形

另外，还有一种比较特殊，也是功能最强的元素：

- 路径

画布中的所有图形，都是由以上七种元素组成。

显然，这里面没有**坐标轴** 这种元素。如果有的话，我们可以采用类似以下的方式定义：

```html
<axis x1="" x2="" ...></axis>
```

很可惜，没有这种元素。但是，这种设计是合理的：不可能为每一种图形都配备一个单独的元素，那样 SVG 就会过于庞大。

因此，我们需要用其他元素来组合成坐标轴，最终使其变为类似以下的形式：

```html
<g>
<!-- 第一个刻度 -->
<g>
<line></line>   <!-- 第一个刻度的直线 -->
<text></text>   <!-- 第一个刻度的文字 -->
</g>
<!-- 第二个刻度 -->
<g>
<line></line>   <!-- 第二个刻度的直线 -->
<text></text>   <!-- 第二个刻度的文字 -->
</g> 
...
<!-- 坐标轴的轴线 -->
<path></path>
</g>
```

分组元素 ，是 SVG 画布中的元素，意思是 group。此元素是将其他元素进行组合的容器，在这里是用于将坐标轴的其他元素分组存放。

如果需要手动添加这些元素就太麻烦了，为此，D3 提供了一个组件：d3.svg.axis()。它为我们完成了以上工作。



###### 定义坐标轴

上一章提到了比例尺的概念，要生成坐标轴，需要用到比例尺，它们二者经常是一起使用的。下面，在上一章的数据和比例尺的基础上，添加一个坐标轴的组件。

```js
var dataset = [1, 2, 3, 4, 5];  // 数据源  x

// 比例尺  让图表更加的直观， 合理

var min = d3.min(dataset);
var max = d3.max(dataset);

// console.log(max)

// scaleLinear可以定义比例尺  domain range
var linear = d3.scaleLinear().domain([0, max]).range([0, 300]);

// 添加坐标轴
var xAxis = d3.axisBottom(linear);
```



###### 在svg中添加坐标轴

定义了坐标轴之后，只需要在 SVG 中添加一个分组元素 ，再将坐标轴的其他元素添加到这个 里即可。代码如下：

```js
svg.append("g")
   .attr("transform","translate(20,130)")
   .call(axis);
```



#### 让你的坐标轴动起来demo

```html
<!DOCTYPE html>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
        #update {
            position: absolute;
            top: 10px;
            left: 10px;
        }
    </style>
</head>

<body>
    <button id="update">更新</button>
    <script src="https://d3js.org/d3.v5.js"></script>
    <script>

        // 1. 添加画布
        var width = 960;
        var height = 500;

        var svg = d3.select('body').append('svg').attr('width', width).attr('height', height)

        // 完成 静态的  坐标轴
        // 线性比例尺
        var scale = d3.scaleLinear().domain([0, 100]).range([100, 860]);

        var axis = d3.axisBottom(scale);

        
        var g = svg.append('g').attr('id', 'g').call(axis);

        // 绑定事件
        d3.select('#update').on('click', function() {
            // 更新数据
            scale.domain([0, Math.random() * 100]);
            // g.call(axis);
            // transition d3提供默认的动画
            d3.select('#g').transition().call(axis)
        })

    </script>
</body>

</html>

```





