## 地理信息系统（Geographic Information System 缩写GIS）

### GIS的基础知识篇

- **空间数据**：用于描述地理实体，地理要素，地理现象，地理事件以及地理过程产生，存在和发展的地理位置，区域范围以及空间联系（如：点(point)，线(polyline),面(polygon)等）
- **属性数据**：用于描述地理实体。地理要素，地理现象，地理事件，地理过程的有关属性特征

|       | 人口（人） |
| ----- | ---------- |
| 区域1 | 1000       |

- **空间拓扑关系**：拓扑邻接，拓扑关联，拓扑包含
- **地图投影**：地图投影就是指建立地球表面上的点与投影平面（即地图平面）上点之间的一一对应关系的方法。即建立之间的数学转换公式。它将作为一个不可展平的曲面即地球表面投影到一个平面的基本方法，保证了空间信息在区域上的联系与完整。这个投影过程将产生投影变形，而且不同的投影方法具有不同性质和大小的投影
- **高程系**：由高程基准面起算的地面点的高度称为高程。一般地，一个国家只采用一个平均海水面作为统一的高程基准面，由此高程基准面建立的高程系统称为国家高程系，否则称为地方高程系。1985年前，我国采用“1956年黄海高程系”（以1950～1956年青岛验潮站测定的平均海水面作为高程基准面）。1985年开始启用1985国家高程基准（以1952～1979年青岛验潮站测定的平均海水面作为高程基准面）
- **坐标系**：描述空间位置表达形式
- **坐标系分类**：地理坐标系，投影坐标系
- **地理坐标系**：用经纬度表示，也称大地坐标系
- **投影坐标系**：把球体表面的坐标转成平面坐标需要一定的手段，这个手段称为投影。投影方法也不是唯一的，还是为了一个目的，务求使当地的坐标最准确。所以目前就存在了好多投影方法，比如高斯投影、墨卡托投影等
- **我国常用坐标系**：1954北京坐标系，1980西安坐标系，国家2000坐标系，web84坐标系，火星坐标系
- **北京54坐标系**：原点在前苏联普尔科沃，参考椭球为克拉索夫斯基椭球，主要参数为：a=6378254米，f=1/298.3
- **西安80坐标系**：原点在陕西省泾阳县永乐镇，参考椭球为国际大地测量与地球物理联合会1975年推荐的椭球，主要参数为：a=6378140米，地球重力场二阶球谐系数J2=1/298.3,引力常数与地球质量的GM=3.986005×1014m3/s2，地球自转角速度w=7.292115×10-5rad/s
- **国家2000坐标系**：我国当前最新的国家大地坐标系，英文缩写为CGCS2000。2000国家大地坐标系是全球地心坐标系在我国的具体体现，其原点为包括海洋和大气的整个地球的质量中心。Z轴指向BIH1984.0定义的协议极地方向（BIH国际时间局），X轴指向BIH1984.0定义的零子午面与协议赤道的交点，Y轴按右手坐标系确定
- **web84坐标系**：一种国际上采用的地心坐标系。坐标原点为地球质心，其地心空间直角坐标系的Z轴指向BIH （国际时间服务机构）1984.O定义的协议地球极（CTP)方向，X轴指向BIH 1984.0的零子午面和CTP赤道的交点，Y轴与Z轴、X轴垂直构成右手坐标系，称为1984年世界大地坐标系统
- **GCJ-02坐标体系**：GCJ-02国测局2002年发布的坐标体系，又称“火星坐标”。适用于国内，国内地图供应商基本使用该坐标系对位置进行加密。在中国，很多时候必须使用GCJ-02的坐标体系。比如谷歌，腾讯，高德都在用这个坐标体系。GCJ-02也是国内最广泛使用的坐标体系。火星坐标系统的原理是这样的：国测局开发了一个系统，能将实际的坐标转换成虚拟的坐标。所有在中国销售的数字地图必须使用这个系统进行坐标转换之后方可上市。这是生产环节，这种电子地图被称为火星地图。在使用环节，GPS终端设备必须集成国测局提供的加密算法，把从GPS卫星那里得到的坐标转换成虚拟坐标，然后再去火星地图上查找，这样就在火星坐标系上完成了地图的匹配，一定意义上保护了我们国家的安全
- **BD09坐标系**：BD09经纬度投影属于百度坐标系，它是在标准经纬度的基础上进行GCJ-02加偏之后，再加上百度自身的加偏算法，也就是在标准经纬度的基础之上进行了两次加偏，和火星坐标系的原理相似

![1627982425(1).jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/604d0abe02154ed59a81c9d4663048bb~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

- **地理坐标系转换**：当你获得的经纬度坐标和使用的地理信息系统不一致时，需要进行坐标系转换。如：当前获取的是地理坐标系，单位是经纬度，你当前的系统是投影坐标系，单位是米，这时就需要进行坐标系转换。（转换参数及JS代码会在今后更文中放出）

#### OGC-地图数据服务

- **OGC**：全称是开放地理空间信息联盟(Open Geospatial Consortium),是一个非盈利的国际标准组织，它制定了数据和服务的一系列标准，GIS厂商按照这个标准进行开发可保证空间数据的互操作,致力于提供地理信息行业软件和数据及服务的标准化工作。
- **地图服务**：是一种使地图可以通过Web访问的方法。首先需要制作原始地图，然后发布到服务站点上，用户便可以通过各种Web应用来访问地图相应的地图服务。
- **网络地图服务(WMS**)：Web Map Service（也称为动态地图服务），它是利用具有地理空间位置信息的数据制作地图，其中将地图定义为地理数据的可视化表现，能够根据用户的请求，返回相应的地图，包括PNG、GIF、JPEG等栅格形式，或者SVG或者WEB CGM等矢量形式。WMS支持HTTP协议，所支持的操作是由URL决定的。WMS提供如下操作:
- GetCapabitities：返回服务级元数据，它是对服务信息内容和要求参数的一种描述。
- GetMap：返回一个地图影像，其地理空间参考和大小参数是明确定义了的。
- GetFeatureInfo：返回显示在地图上的某些特殊要素的信息。
- GetLegendGraphic：返回地图的图例信息。
- **网络要素服务（WFS）**（也叫：要素地图服务）支持用户在分布式的环境下通过HTTP对地理要素进行插入，更新，删除，检索和发现服务。该服务根据HTTP客户请求返回要素级的GML(Geography Markup Language、地理标识语言)数据，并提供对要素的增加、修改、删除等事务操作，是对Web地图服务的进一步深入。WFS通过OGC Filter构造查询条件，支持基于空间几何关系的查询，基于属性域的查询，当然还包括基于空间关系和属性域的共同查询。WFS提供如下操作:
- GetCapabitities：返回服务级元数据，它是对服务信息内容和要求参数的一种描述。
- DescribeFeatureType：生成一个Schema用于描述WFS实现所能提供服务的要素类型。Schema描述定义了在输入时WFS实现如何对要素实例进行编码以及输出时如何生成一个要素实例。
- GetFeature：可根据查询要求返回一个符合GML规范的数据文档。
- LockFeature：用户通过Transaction请求时，为了保证要素信息的一致性，即当一个事务访问一个数据项时，其他的事务不能修改这个数据项，对要素数据加要素锁。
- Transaction： 与要素实例的交互操作。该操作不仅能提供要素读取，同时支持要素在线编辑和事务处理。Transaction操作是可选的，服务器根据数据性质选择是否支持该操作。
- **切片地图服务（TMS)**:(tile map Servcie)定义了一些操作，这些操作允许用户按需访问切片地图，访问速度更快，还支持修改坐标系。WMTS可能是OGC首个支持RESTful访问的服务标准。切片地图服务又叫缓存服务区，地图缓存是使地图和图像服务更快运行的一种非常有效的方法。创建地图缓存时，服务器会在若干个不同的比例级别上绘制整个地图并存储地图图像的副本。然后，服务器可在用户请求使用地图时分发这些图像。对于服务器来说，每次请求使用地图时，返回缓存的图像要比绘制地图快得多
- **网络地图瓦片服务(WMTS)**:(OpenGIS Web Map Title Service)提供了一种采用预定义图块方法发布数字地图服务的标准化解决方案。WMTS弥补了WMS不能提供分块地图的不足。WMS针对提供可定制地图的服务，是一个动态数据或用户定制地图（需结合SLD标准）的理想解决办法。WMTS牺牲了提供定制地图的灵活性，代之以通过提供静态数据（基础地图）来增强伸缩性，这些静态数据的范围框和比例尺被限定在各个图块内。这些固定的图块集使得对WMTS服务的实现可以使用一个仅简单返回已有文件的Web服务器即可，同时使得可以利用一些标准的诸如分布式缓存的网络机制实现伸缩性WMTS接口支持的三类资源：
- 一个服务元数据（ServiceMetadata）资源（面向过程架构风格下对GetCapabilities操作的响应）（服务器方必须实现）。 ServiceMetadata资源描述指定服务器实现的能力和包含的信息。在面向过程的架构风格中该操作也支持客户端与服务器间的标准版本协商。
- 图块资源（对面向过程架构风格下GetTile操作的响应）（服务器方必须实现）。图块资源表示一个图层的地图表达结果的一小块。
- 要素信息（FeatureInfo）资源（对面向过程架构风格下GetFeatureInfo操作的响应）（服务器方可选择实现）。该资源提供了图块地图中某一特定像素位置处地物要素的信息，与WMS中GetFeatureInfo操作的行为相似，以文本形式通过提供比如专题属性名称及其取值的方式返回相关信息


作者：Hideonbush
链接：https://juejin.cn/post/6992140182958899237
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

### GIS数据结构

- **地理实体的特征**：属性特征，空间特征，时间特征
- **地理实体数据的类型**：属性数据，几何数据，关系数据

#### GIS中的数据存储格式

- **矢量数据格式**：对于 GIS 来说，点就应该是矢量数据的本质，点生线，线生面……，如此，构成了 GIS 世界中的矢量空间
- **栅格数据格式**：栅格数据结构基于栅格模型的数据结构。是指将空间分割成有规则的网格，称为栅格单元，在各个栅格单元上给出相应的属性值来表示地理实体的一种数据组织形式
- **元数据**：地理数据和信息资源的描述信息。他通过对地理空间数据的内容，质量，条件和其他特征进行描述与说明，以便用户有效的定位，评价，比较，获取和使用地理空间数据（通俗的来讲就是描述空间数据的数据）

#### GIS中的数据存储方式

- **SHP(Shapeflie)** ：一个Shape文件包括三个文件：一个主文件(*.shp)，一个索引文件(*.shx)，和一个dBASE(*.dbf)表
- **CAD**：有一些列的数据格式:dwg文件：*.dwg是AutoCAD的图形文件，是二维或三维图形档案。其与dxf文件是可以互相转化的。dxf文件：*.dxf是Autodesk公司开发的用于AutoCAD与其它软件之间进行CAD数据交换的CAD数据文件格式。DXF是一种开放的矢量数据格式。在 GIS 中使用 CAD 数据，标准的CAD数据会在文件中标注使用的坐标系等信息
- **TIFF**：标签图像文件格式(Tagged Image File Format，简写为TIFF) 是一种主要用来存储包括照片和艺术图在内的图像的文件格式。它最初由 Aldus公司与微软公司一起为PostScript打印开发
- **DEM**：数字高程模型（Digital Elevation Model)，简称DEM，是通过有限的地形高程数据实现对地面地形的数字化模拟（即地形表面形态的数字化表达），它是用一组有序数值阵列形式表示地面高程的一种实体地面模型，是数字地形模型(Digital Terrain Model，简称DTM)的一个分支，其它各种地形特征值均可由此派生
- **GeoJSON**：GeoJSON是一种对各种地理数据结构进行编码的格式。GeoJSON对象可以表示几何、特征或者特征集合。GeoJSON支持下面几何类型：点、线、面、多点、多线、多面和几何集合。GeoJSON里的特征包含一个几何对象和其他属性，特征集合表示一系列特征。一个完整的GeoJSON数据结构总是一个（JSON术语里的）对象。在GeoJSON里，对象由名/值对--也称作成员的集合组成。对每个成员来说，名字总是字符串。成员的值要么是字符串、数字、对象、数组，要么是下面文本常量中的一个："true","false"和"null"。数组是由值是上面所说的元素组成
- **空间数据库**：是地理信息系统在计算机物理存储介质存储的与应用相关的地理空间数据库的总和（与传统数据库最大差别：记录了空间特征及数据），常用的空间数据库有Postgresql（Postgis拓展）、Mysql（Mysqlspatial拓展）、Oracle（Oraclespatial拓展）等

### WebGis

#### 什么是WebGis

- **WebGIS（网络地理信息系统**）：是指工作在Web网上的GIS,是传统的GIS在网络上的延伸和发展，具有传统GIS的特点，可以实现空间数据的检索、查询、制图输出、编辑等GIS基本功能，同时也是Internet 上地理信息发布、共享和交流协作的基础（通俗的来讲就是web+gis）

#### 1 坐标系

坐标系分为地理坐标系和投影坐标系，他们的定义如下：  
**地理坐标系**（Geographic Coordinate System）：  
    是使用三维球面来定义地球表面位置，以实现通过经纬度对地球表面点位引用的坐标系。包括角度测量单位、本初子午线和参考椭球体三部分。

**投影坐标系**（Projection Coordinate System）：  
    是使用基于X,Y值的坐标系统来描述地球上某个点所处的位置。它由地理坐标系和投影方法两个要素所决定。

##### 1.1 地理坐标系

###### 旋转椭球体

    地球表面是崎岖不平的，人们为了精确表示地球表面的位置，引入了**旋转椭球体**的概念。即用一个规则的旋转椭球体去逼近真实的地球表面。一个旋转椭球体的参数主要有以下三个:长半轴、短半轴、扁率。定义了这三个参数，也就唯一确定了一个旋转椭球体。  

![](https://upload-images.jianshu.io/upload_images/14162570-301c10acf2f7c752.png?imageMogr2/auto-orient/strip|imageView2/2/w/277/format/webp)

旋转椭球体

###### 大地基准面

    定义了椭球体的形状后，还需要确定椭球体的位置。椭球体表面与真实地球表面存在差异，并且在世界的不同地区，这种差异也不尽相同。因此椭球体的定位直接决定了地理坐标与真实位置的误差。椭球体定位就是需要确定**大地基准面**，从而确定椭球体与地球的相对位置。有以下两类大地基准面：

-   地心基准面：由卫星数据得到，使用地球的质心作为原点，如如CGCS2000、WGS84。
-   区域基准面：特定区域内与地球表面吻合，旋转椭球体表面上的点与地球表面上的特定位置相匹配，但椭球的中心不与地球质心重合而是接近地球质心。例如Beijing54、Xian80。

    确定了旋转椭球体的**形状**和**位置**，那么地理坐标系的基础就确定了。接下来需要定义地球上任意一点的地理坐标表示方法。

###### 地理坐标

    地理坐标，就是用经纬度表示地面点位的球面坐标。在大地测量学中，对于地理坐标系统中的经纬度有三种提法：天文经纬度、大地经纬度和地心经纬度。其中使用较多的是大地经纬度，其使用大地坐标（L,B,h）表示地面点在椭球面上的位置三个要素，他们的定义如下：

-   大地经度L：参考椭球面上某点的大地子午面与本初子午面间的二面角
-   大地纬度B：为参考椭球面上某点的法线与赤道平面的夹角，北纬为正，南纬为负
-   大地高h：从观测点沿椭球法线方向到椭球面的距离

图示：

  

![](https://upload-images.jianshu.io/upload_images/14162570-a1c32272129f95e9.jpg)

大地坐标.jpg

    这样就完成了地理坐标系的定义，地球上任意一点都能获得经纬度坐标了。

##### 1.2 投影坐标系

    在椭球面上表示的地球上物体的坐标，会给实际使用带来一些麻烦。更多的时候我们希望将地物展现在平面上，这时就需要引入投影坐标系的概念。

###### 地图投影

    在地球椭球面和平面之间建立点与点之间函数关系的数学方法，称为**地图投影**。  
    地图投影的一般公式为：x = F(λ，φ), y = G(λ，φ)  
    确定了投影方法后，也就确定了函数F和G，只要知道地面点的经纬度（λ，φ），便可以在投影平面上找到相对应的平面位置（x，y）。

投影方法有以下几类：

-   按变形性质分类：
    -   等角投影：角度变形为零（Mercator）
    -   等积投影：面积变形为零（Albers）
    -   任意投影：长度、角度和面积都存在变形
-   按投影面类型划分：
    -   圆柱投影：投影面为圆柱
    -   圆锥投影：投影面为圆锥
    -   方位投影：投影面为平面
-   按投影面与地球位置关系划分为：
    -   正轴投影：投影面中心轴与地轴相互重合
    -   斜轴投影：投影面中心轴与地轴斜向相交
    -   横轴投影：投影面中心轴与地轴相互垂直
    -   相切投影：投影面与椭球体相切
    -   相割投影：投影面与椭球体相割

![](https://upload-images.jianshu.io/upload_images/14162570-000789ed2afcd7a2.jpg)

投影

###### 常用的投影方法

-   [UTM投影](https://baike.baidu.com/item/UTM%E6%8A%95%E5%BD%B1)  
    
    **UTM投影全称为"通用横轴墨卡托投影"，是一种"等角横轴割圆柱投影"，椭圆柱割地球于南纬80度、北纬84度两条等高圈，投影后两条相割的经线上没有变形，而中央经线上长度比0.9996。**
    
-   [高斯—克吕格投影](https://baike.baidu.com/item/%E9%AB%98%E6%96%AF-%E5%85%8B%E5%90%95%E6%A0%BC%E6%8A%95%E5%BD%B1)（Gauss-Kruger）  
    **高斯-克吕格投影，是一种“横轴等角切圆柱投影”，中央经线没有变形，不在中央经线上的点，长度比均大于1。且离开中央经线越远，长度变形越大。**

    以上两种方法都要进行分带投影。即按一定的间隔选取经线作为投影的中央经线，中央经线两侧一定范围内的地区按所选中央经线进行投影。这样做的目的是减小投影变形，方便在工程中使用。

-   [墨卡托投影](https://baike.baidu.com/item/%E5%A2%A8%E5%8D%A1%E6%89%98%E6%8A%95%E5%BD%B1)（Mercator Projection）  
    **墨卡托投影，是一种“正轴等角圆柱投影”，假想一个与地轴方向一致的圆柱切或割于地球，按等角条件，将经纬网投影到圆柱面上，将圆柱面展为平面后，即得本投影。该投影具有等角航线被表示成直线的特性，故广泛用于编制航海图和航空图等。其缺点是在两极的变形严重。**

**_具体的投影方法请点击小标题查看。_**

    选择一个地理坐标系，以及一个地图投影方法，就唯一确定了一个投影坐标系，从而可以使用平面坐标表示地球上物体的位置了。

##### 1.3 WebGIS中常用的坐标系

    在Web地图领域，使用最为广泛的坐标系统就是**WGS84 Web Mercator**。谷歌地图、Virtual Earth、Bing Maps、百度地图、Mapabc、ArcGIS Online等都是采用这种坐标系。作为一个投影坐标系，需要两个基本的要素，一个是地理坐标系，还有一个是投影方法。我们分别来看：

###### WGS84 Web Mercator的地理坐标系

    从名字可以看出，WGS84 Web Mercator坐标系采用的地理坐标系是WGS84坐标系，它属于地心坐标系，坐标系的原点位于地球质心，其基本参数如下：

> GCS\_WGS\_1984  
> WKID: 4326 Authority: EPSG  
> Angular Unit: Degree (0.0174532925199433)  
> Prime Meridian: Greenwich (0.0)  
> Datum: D\_WGS\_1984  
> Spheroid: WGS\_1984  
> Semimajor Axis: 6378137.0  
> Semiminor Axis: 6356752.314245179  
> Inverse Flattening: 298.257223563

###### WGS84 Web Mercator的投影方法

    从名字上可以看出，WGS84 Web Mercator坐标系的投影方法和Mercator（墨卡托）投影有关，但是这个投影方法和不是标准的墨卡托投影。他们之间的区别在于，WGS84 Web Mercator在投影时将地球椭球当做圆球看待，这会导致本来是等角投影的墨卡托投影变得不再等角了，而是近似等角，也就是出现角度变形。

主要原因是墨卡托投影保留了方向。无论您在世界的哪个地方使用此投影，方向都是真实的。

从用户的角度来看，知道北方在上升是非常有用的。尽管某些区域会变形，但它在整个过程中都相当均匀地变形。此外，不保留形状或局部角度（非保角）。

当远离赤道时，失真会增加。与墨卡托投影类似，区域向两极延伸。这意味着不应使用此投影来显示两极。由于明显的变形，Web 墨卡托投影也不适合任何空间分析或面积计算。

###### WGS84 Web Mercator的坐标范围

    以赤道为标准纬线，以本初子午线为中央经线，分别得到X轴和Y轴。两者的交点设为原点，规定纬度向北为正，向南为负；经度向东为正，向西为负。

-   X轴：由于赤道半径为6378137米，则赤道周长为2πR = 2\*20037508.3427892，因此X的取值范围是：\[-20037508.3427892,20037508.3427892\]。
-   Y轴：由墨卡托投影的公式可知，当纬度φ接近两极，即90°时，y值趋向于无穷。因此规定Y的取值范围与X一致，也为\[-20037508.3427892,20037508.3427892\]，也就是形成了一个正方形。

对应于经纬度的范围就是：

-   经度： \[-180, 180\]
-   纬度： \[-85.051128779，85.051128779\]

##### 1.4 EPSG

    讨论坐标系不得不提到EPSG，EPSG的英文全称是European Petroleum Survey Group，中文名称为欧洲石油调查组织。这个组织成立于1986年，2005年并入IOGP(International Association of Oil & Gas Producers)，中文名称为国际油气生产者协会。EPSG对几乎所有常用的坐标系统都进行了编号，统一了坐标系的表示，于是我们经常会看到使用EPSG编号来指代某一坐标系。

以下是几个常用坐标系的EPSG编号和单位：

| 坐标系名           | EPSG编号               | 单位 |
| ------------------ | ---------------------- | ---- |
| WGS 84             | EPSG:4326              | 度   |
| WGS84 Web Mercator | EPSG:3857, EPSG:900913 | 米   |

    至于为何WGS84 Web Mercator有两个编号，这里面还是有一段故事的，可以去[这里](https://blog.csdn.net/kikitaMoon/article/details/46124935)查看。

    查询全部的EPSG编号和详细信息请访问[EPSG官网](https://epsg.io/)。

#### 2 瓦片地图

    互联网地图服务，常常通过采用构建瓦片地图的方式，加快用户的访问，减少数据传输量。具体而言，瓦片地图就是对投影后的地图在不同尺度（层）下进行切片，每个尺度得到的地图切片数量不同、表示范围不同、详细程度不同，但是图片的尺寸相同（一般为256\*256），最终构成一个“瓦片金字塔“”。根据用户所浏览的区域范围，自动确定所要返回的切片层级，在满足用户查询需求的同时，保证了地图传输的效率。

  

![](https://upload-images.jianshu.io/upload_images/14162570-58d5a43f3625cb5b.jpg)

瓦片金字塔.jpg

##### 2.1 瓦片地图的编号

    在投影坐标系的选择上，目前主流的地图服务提供商基本都选择的是WGS84 Web Mercator坐标系。但是在如何对投影后的地图进行切片并编号时，不同厂商之间存在较大的差异。

###### 谷歌地图，OpenStreetMap，WMTS

    以地图左上角为原点，X轴向右，Y轴向下，从0开始分别进行编号。Z的取值范围为\[0, 18\]，在第z级别，x,y方向的瓦片个数均为：2z个，即x,y取值范围是\[0 , 2z\-1\]。

    WMTS较为特殊，WMTS中的TileMatrix对应于z，TileRow对应于y，TileCol对应于x。编号方式和谷歌与OSM相同。

###### TMS

    以地图左下角为原点，X轴向右，Y轴向上，从0开始分别进行编号。Z的编码规则与谷歌地图相同。

z=1时，这两种瓦片的编号如下图所示。

  

![](https://upload-images.jianshu.io/upload_images/14162570-32994f5118e73bdb.jpg)

谷歌和TMS地图切片 (z=1)

###### Bing地图

    微软Bing地图Z的编码规则与谷歌相同，同一层级的瓦片不用XY两个维度表示，而只用一个整数表示，该整数服从四叉树编码规则（QuadTree）。

![](https://upload-images.jianshu.io/upload_images/14162570-f51f603039f5c50c.jpg)

Bing地图切片

###### 百度地图

    百度地图的瓦片定义的方式比较独特，原点的位置在经纬度都为0的地方，X向左为正，向右为负；Y向上为正，向下为负。切分的方式不像上述3种方法在每一级进行二等分，而是通过定义每一级的**地图分辨率**，确定每一级应该划分的行列数。地图分辨率的表达式为：218-z，其含义是每个像素所对应的实际长度。由此，可得每一级应该划分的行列数为：2πR/(256\*218-z)，其中R为地球的半径，单位是米。  

![](https://upload-images.jianshu.io/upload_images/14162570-0f0829ab374faf6e.png)

百度地图切片

##### 2.2 瓦片编号与经纬度、投影坐标的转换

参考：[https://blog.csdn.net/lxxlxx888/article/details/51897838

## WebGIS 与前端

这块内容分为两部分，第一部分介绍一下电子地图的渲染流程，期间按照瓦片的两种类型（静态/动态）分别讲一下涉及的前端技术；第二部分以当前主流的矢量地图为引，简单介绍一下 WebGL 的一些基础知识。关于 WebGL 的知识不会很深入，目的是让大家的对 WebGL 以及图形编程有大概的认知，后续前端组会制定一套数据可视化技术的系列课程，到时再深入到各项技术的细节知识。

### 地图渲染流程

先讲一点预备知识，电子地图涉及几种坐标系，每种坐标的计量单位如下：

经纬度是球面坐标，我们日常使用经纬度单位的是角度（deg），在进行投影计算时需要换算为弧度（rad）；

墨卡托投影得到的二维坐标单位是米（m）；

电子屏幕坐标的单位是像素（px）。

前端拿到的地图数据中绝大多数是墨卡托坐标，很小一部分是经纬度坐标。墨卡托或经纬度坐标需要先被换算成屏幕坐标，最后被CSS拼接或WebGL渲染。

这里的屏幕坐标准确的说应该是画布（canvas）坐标，前端常规认知的屏幕坐标是CSS坐标，在栅格地图中CSS坐标与canvas坐标是相等的，在矢量地图中根据屏幕的DPR值，CSS坐标与canvas坐标成倍数关系。

web地图的渲染流程大致如下：

![](https://upload-images.jianshu.io/upload_images/27422681-8b20ab9a2fcad104.png?imageMogr2/auto-orient/strip|imageView2/2/w/635/format/webp)

地图在进入渲染流程之前有一些必要的前置条件：

地图level，可以从缓存中读取或者使用默认值；

地图的中心点坐标，可以通过浏览器的地理定位API获取，也可以从缓存中读取，如果都取不到，就必须有一个默认值；

浏览器画布的尺寸，如果是高清屏还需要DPR值。

以上几个条件的目的是为了计算地图当前的视野范围（bounds），进而计算出当前视野包含的瓦片编号列表。

### 栅格地图

前半部分介绍了瓦片切图，准确地说应该是「瓦片切割」，早期web地图使用的瓦片是一张张静态的png图片，前端开发者使用CSS position按照瓦片编号拼接成一张完整的二维地图。对前端来说，瓦片就等同于是图片，所以“瓦片切图”这个叫法一直被延续下来。

但地图数据本身是一个个坐标值并不是图片，之所以将瓦片保存为图片格式是因为早期的浏览器没有能够绘制海量数据的图形技术，也就是大家熟知的 WebGL。在这个前提下，地图厂商会在服务端搭建一套瓦片切图预处理的流程，简单理解就是先用 OpenGL 将地图数据可视化，然后按照既定的规则把每个 level的地图切割成一张张 256 \* 256 的图片托管到静态文件服务器，最后前端开发者取图片拼接。以图片拼接而成的web地图叫做「_栅格地图_」。

![](https://upload-images.jianshu.io/upload_images/27422681-7fa1f117e213a28f.png?imageMogr2/auto-orient/strip|imageView2/2/w/547/format/webp)

注意上图里的切图服务中包含「瓦片-data」和「瓦片-png」，两者的内容一般是不同的。瓦片data的功能一方面是为了瓦片图片切割，另一方面是提供给其他支持矢量图形技术的平台使用，比如 app。

栅格地图的优点是：

前端的计算量非常小，性能相对高一点，对用户体验很友好；

浏览器兼容性很好，由于技术原始，所以很多老旧浏览器都能够兼容，比如搜狗的PC地图即便是现在也能在 IE5 里无bug运行（这可能是唯一值得吹一下的优点了~囧）。

基于以上两个优点，目前仍然有很多地图的JavaScript SDK使用栅格瓦片或者栅格混合矢量数据（一般是底图用栅格瓦片，建筑物和poi用矢量数据）的形式。不过栅格地图也有很明显的缺点：

相对于数据，图片的体积更大，储存成本相对更高一些；

位图是非矢量的，缩放会失真，视觉体验不佳；

基于上一条，每个瓦片图片都不能被相邻level共享，否则会严重失真，这进一步加大了图片数量和储存成本；

无法3D化。

### 矢量地图

随着大部分主流浏览器对 WebGL实现了支持，很多地图厂商都陆续开始研发并上线了矢量地图。矢量地图同样需要预处理的切图服务，但是预处理的产出并不是图片格式的瓦片，而是与app一样的瓦片data，换句话说，矢量web地图可以与app地图使用同一份数据，这意味着**所有平台的地图数据可以统一维护和迭代**。

“可以”的意思是可行但不一定，分业务场景。比如导航是app地图独有的功能，导航场景使用的地图数据称为“市街图-street map”，这些数据是web地图用不到的。

![](https://upload-images.jianshu.io/upload_images/27422681-d94723deaf7a2347.png?imageMogr2/auto-orient/strip|imageView2/2/w/483/format/webp)

矢量地图说白了就是把原本OpenGL干的活交给了WebGL干，说起来简单做起来难，**WebGL 是非常底层的图形编程技术**，几乎没有任何上层封装，接近纯粹的计算机图形学。相关的研发人才非常稀缺，图形编程本身就是一个相对小众的垂直领域，WebGL 图形编程则更加小众，虽然同属于前端技术领域，但 WebGL 研发人员的招聘和培养难度比常规web前端研发人员要难很多，所以有能力开发 WebGL 矢量地图的厂商要么是有足够的人才储备想为产品锦上添花，比如高德和百度的WebGL地图第一个产品是自家的PC地图；要么是有充分的客户需求兑现商业价值，比如腾讯的WebGL地图第一个产品是B端的 JavaScript SDK（2020年初上线），截止到今天PC地图也没有接入WebGL。否则单纯靠爱发电很难落地，比如搜狗地图的WebGL引擎开发到80%的时候被叫停，之后再也没有捡起来过。

### 矢量地图与WebGL

WebGL 图形编程与常规web网站是完全不同的一套知识体系，虽然都使用JavaScript语言，但细节技术点完全不同，比如 WebGL 中被大量使用的 buffer、TypedArray、Protobuf等知识点在常规web网站中几乎不会被涉及，另外还有一套类似C++的shader语言-GLSL。这些细节知识点会在后续的文章中讲解，今天就简单科普一下WebGL的渲染管线以及WebGL矢量地图中常用的几种算法。

#### WebGL渲染管线

WebGL 是 canvas的一种渲染上下文（context），canvas有两种context：2D和WebGL。二者没有任何关系，相同点是都需要借助canvas输出图像。目前大部分浏览器都支持 WebGL1.0，对 WebGL 2.0 的兼容很不理想，下文的讨论都是针对 1.0 版本。

下面这段代码是创建WebGL 上下文的API以及几个常用配置项：

constcanvas = createElement('canvas');constgl: WebGLRenderingContext = canvas.getContext("webgl",{// 是否开启自动抗锯齿，建议关闭，浏览器兼容性差开了也没用，就算有用性能也很差(因为浏览器用的抗锯齿算法是效果很好同时性能很差的一种)，大多是自己写代码实现antialias:false,// 是否开启透明通道，一般建议关闭，性能损耗严重，自己写代码根据透明值计算出混合色值更高效。如果开启的话，对研发人员的技术能力有更高要求alpha:false,// 是否开启 stencil(模板) 缓冲区支持，数据量大的应用建议开启，配合stencil test能够减少无效渲染stencil:true,// 是否开启 depth(深度) 缓存区支持，简易的webgl地图基本用不到depth test，一般是关闭的。像mapbox这类复杂的webgl地图引擎是开启的depth:false});

WebGL 中有几个核心概念：

shader - 着色器，分为两种：

vertex shader - 顶点着色器，用于确定图元顶点的坐标；

fragment shader - 片段着色器，用于处理光栅化之后的点阵像素信息，包括色值、透明度等等。

除了以上两种shader以外，OpenGL 还支持 geometry shader-几何着色器，不过也不常用。WebGL不支持几何着色器，

program（没有准确翻译），用于绑定（attach）两种着色器。

基于上面的几个核心概念，WebGL 执行渲染的API调用流程是：_分别创建两种shader -> 创建一个program -> 将program与两个shader绑定 -> 链接（link）program ->激活（use）program -> 传参给shader -> 传值&渲染_。如下：

// 1.1-创建vertex shader instanceconstvShader:WebGLShader = gl.createShader(gl.VERTEX\_SHADER);// 1.2-指定vertex shader源-vShadersStr，字符串格式gl.shaderSource(vShader, vShadersStr);// 1.3-编译vertex shadergl.compileShader(vShader);// 2.1-创建fragmentshader instanceconstfShader:WebGLShader = gl.createShader(gl.FRAGMENT\_SHADER);// 2.2-指定fragmentshader源-fShadersStr，字符串格式gl.shaderSource(fShader,fShadersStr);// 2.3-编译fragmentshadergl.compileShader(fShader);// 3-创建programconstprogram: WebGLProgram = gl.createProgram();// 4-绑定program与两个shadergl.attachShader(program, vShader);gl.attachShader(program, fShader);// 5-链接programgl.linkProgram(program);// 6-激活programgl.useProgram(program);// 7-传值&渲染相关API下文再讲

接下来就是传值和执行渲染，这部分需要了解WebGL shader中的三种变量类型：

_attribute_变量是由JavaScript API 传给顶点着色器的数据，术语为_vertexBufferObject-VBO_，顾名思义是一种二进制的buffer，在JavaScript中的表达是类型数组-_TypedArray_。根据精度的不同需求最常用的有Float32Array和Uint8Array。attitude主要是包含顶点坐标，但是并没有严格的限制，可以传递任何其他用途的数据，比如色值-color，前提是数据精度相同；

uniform变量也是由JavaScript API传递给着色器，不过可以**同时被顶点和片段着色器访问**，通常用于传递所有顶点共用的数据，比如MVP矩阵（下文介绍）、画布分辨率、色值等等。uniform不是常量，着色器中有常量的定义规范-defined，语法类似C++如下：

define PI 3.1415926538

varying变量不是由JavaScript API传入着色器，而是在顶点着色器中根据其他数据（attribute/uniform/defined）计算出来，然后传递给片段着色器中**同名**varying变量。目的有两种：

减少GPU的计算压力。因为顶点着色器只会计算指定图元的顶点数量，而片段着色器需要在图元覆盖的所有像素点都计算一次；

片段着色器无法访问attribute数据，varying变量可以传递一些与attribute相关的数据。

结合上文的几种变量类型，WebGL的渲染流程大致如下图所示（条纹框表示GPU内部流程，开发者无法干预）：

![](https://upload-images.jianshu.io/upload_images/27422681-cca5498b2172f1af.png?imageMogr2/auto-orient/strip|imageView2/2/w/627/format/webp)

在CPU侧（也就是JavaScript侧）计算出必要的数据，包括VBO和uniform，然后传递给着色器；

顶点着色器计算出制定图元的顶点坐标和必要的varying变量；

接下来是开发者不可控的GPU内部逻辑，包括图元装配和光栅化：

图元装配：根据JavaScript调用的绘图API所指定的图元类型（点/线段/三角形）和顶点坐标组装成对应的几何图形；

光栅化：将装配好的几何图形转化为二维图像，图像中的每个点都对应一个物理像素点，叫做片元或片段（fragment）；

片段着色器在图元覆盖的像素点依次计算出色值结果；

接下来是测试混合（Test&Blending）阶段，之后会生成帧缓存FBO，这部分也是开发者不可控的；

最后电子屏幕取帧缓存数据进行展示。

![](https://upload-images.jianshu.io/upload_images/27422681-75abc2e23f674efd.png?imageMogr2/auto-orient/strip|imageView2/2/w/533/format/webp)

MVP矩阵

简单聊一下上文提到的 MVP 矩阵，细节的技术实现方案后续的分享中再说。

MVP 矩阵是仿射变换过程中三种变换矩阵的统称：

M代表Model，Model矩阵即模型矩阵，可以简单理解为图形本身的变换矩阵，经过Model矩阵变换后得到顶点在世界空间中的坐标值；

V代表View，View矩阵即观察矩阵，作用是将世界空间的顶点坐标映射到可以简单理解为摄像机（即观察者，camera是一个抽象对象）为中心的观察空间中；

P代表Projection，Projection矩阵即投影矩阵，图形编程中两种投影方式：正向投影和透视投影。Projection矩阵的作用是将观察空间的三维坐标映射到二维的裁剪空间中，可以理解成将三维的图形投影到二维的画布上。

顶点的原始坐标需要依次经过Model矩阵、View矩阵和Projection矩阵变换（左乘）之后才能够得到它在裁剪空间中的最终坐标值。如下代码所示：

precision mediump float;

attribute vec2 a\_position;

uniform vec2 u\_resolution;

uniform mat4 u\_mMatrix;

uniform mat4 u\_vMatrix;

uniform mat4 u\_projMatrix;

void main() {

    position = (u\_vMatrix\*u\_mMatrix\*vec4(a\_position,0,1)).xy;

    gl\_Position = u\_projMatrix\*vec4((position / u\_resolution \* 2.0 - 1.0)\*vec2(1,-1), 0, 1);

}

上面代码中的u\_resolution是画布的尺寸，Model和View矩阵的数值一般是与画布的坐标使用相同的计量单位（px），Projection矩阵一般是归一化的矩阵。

三种矩阵在数学上没有区别只是计算逻辑上的三种抽象，都是4\*4矩阵，都可以包含位移、缩放、斜切等形变信息。一般Projection矩阵是单独的，Model和View矩阵可以分开也可以在CPU侧计算之后得到一个Model&View矩阵再传入顶点着色器。

### WebGIS常用算法

最后这部分介绍两种 WebGIS 领域常用的算法，准确地说应该是 WebGIS 绘图领域，一种是多边形三角剖分算法，一种是R-Tree算法。这两种算法与 WebGIS本身并没有太大关系，属于计算机图形学通用的算法。

#### **三角剖分算法**

计算机图形学中只有三种基本图元：点、线段、三角形。点和线段的适用面很窄，极少被使用，

绘图过程中绝大部分的图形底层都是一个个三角形组成的，如下图所示：

![](https://upload-images.jianshu.io/upload_images/27422681-91bbe0b2c484d019.png)

![](https://upload-images.jianshu.io/upload_images/27422681-822936cf1e624a46.png)

喜欢玩3D游戏的人可能知道，建模对游戏的视觉效果影响很大，除了模型本身的设计风格以外，建模的精细度也很重要，而衡量精细度的核心指标之一便是**三角形的数量**。虽然数量不是唯一指标，但细致的3D模型的三角形数量一定非常庞大，一般数量越多，模型的边缘越平滑，视觉效果越好。反面例子比如下图展示学动画三年系列，人物（姑且算是个人吧）模型边缘有非常明显的棱角，过渡非常不顺滑。

![](https://upload-images.jianshu.io/upload_images/27422681-a68bd7451ddd6171.png)

回到 WebGIS 领域，我们看到的电子地图是由一个个不规则的多边形（Polygon）和线（Line）组成，三角剖分算法的作用就是把这些多边形分割成一个个三角形，然后才能够被 WebGL 绘制出来。

其实线也是多边形，因为 WebGL 1.0 不支持宽于1像素的线，所以宽线必须以多边形的形式绘制。

![](https://upload-images.jianshu.io/upload_images/27422681-971939e2c11c41a7.png)

三角剖分算法有两种类型，一种是多边形三角剖分，一种是点集三角剖分，后者在图形编程领域不常用，我们只需要关注多边形三角剖分。

三角剖分是典型的动态规划算法，对于多边形三角剖分最简单的场景就是三个点，也就是三角形，这种根本不需要分割。再复杂一点就是矩形，前端小伙伴们可以想像一下我们常用的 CSS盒子，html布局就是一个个矩形拼起来的，对于一个矩形来说需要2个三角形组成。然后依次再递增多边形的顶点个数，比如6个：

![](https://upload-images.jianshu.io/upload_images/27422681-4e66b086251df309.png)

这时候需要4个三角形。

很细节的算法实现就不讲了，其实我也没搞太懂哈哈。对于前端工程师来说，从零实现这套算法的代价太大，更别提还要很细化地调优，我们直接使用经过大量实践验证的开源算法和工具就可以了。WebGL图形编程常用的三角剖分工具是[Libtess](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fbrendankenny%2Flibtess.js%3FfileGuid%3DZzkLVr2JW2fPrm3Q)，这套算法也是OpenGL编程常用的，非常高效。

#### **R-Tree算法**

R-Tree是一种树状数据结构，在 GIS领域主要用于空间数据的储存。在绘图方面，R-Tree较多地被用于图形冲突检测。

栅格地图的POI点坐标是在瓦片预处理过程中被计算好的，哪个显示哪个不显示都被预定义好了，前端拿到数据之后按照既定的坐标渲染出来即可。而矢量地图则不然，前文提到，矢量地图实际上就是让WebGL干了OpenGL的活，不单是绘图，绘图过程中的任何事情都变成了前端的事情，**POI冲突检测**就是其中一项。

先看下面这张图：

![](https://upload-images.jianshu.io/upload_images/27422681-156970b5e8db875d.png)

图中有两个POI点：微电子与纳电子学系（下文简称POI点A）和超导量子信息处理实验室（下文简称POI点B），每个点都有图标和文本两部分，点A和点B的文本都位于图标的下方。

POI有一个「_权重-rank_」的属性，绘图时要保障权重高的优先渲染，如果画布空间有限则要合理地调整低权重POI的布局甚至不渲染。仍然以上图为例，假设点A的权重高于点B：

先渲染点A，图标必须渲染出来；

（伪）随机选一个方位放置文本，图中选的是图标下方；

渲染点B，点B的图标与点A的图标和文本都不冲突，正常渲染；

渲染点B的文本，可选四个方位-上下左右（复杂情况下可选八个方位），使用R-Tree描述文本的矩形盒子，检测发现上左右都会与点A的文本发生位置冲突，只有下方可行。

以上便是使用R-Tree进行位置冲突检测的简易流程。除了POI位置检测以外，绘图中R-Tree另一个使用场景是道路名称的位置标注算法，如下图中的「双清路」「荷清路」文本：

![](https://upload-images.jianshu.io/upload_images/27422681-05d3cb080b4c1bbb.png)

R-Tree冲突检测的开源工具推荐[rbush](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fmourner%2Frbush%3FfileGuid%3DZzkLVr2JW2fPrm3Q)。

POI的位置布局（POI Placement）算法也是单独的一项研究课题，有大量论文，大家有兴趣可以自行查阅相关资料。

其实R-Tree不仅仅适用于图形编程，在常规前端领域也有可借鉴的场景。比如下图展示的一个报表看板：

![](https://upload-images.jianshu.io/upload_images/27422681-4dfd40c63b3de879.png)

图中的布局乱了，报表之间存在遮挡情况，如果这种情形需要前端实现一个自动布局，也就是图中的「一键美化」功能，你可能考虑怎么办？

这时候就可以尝试用R-Tree解决，每个报表的容器都是一个个矩形盒子，使用rbush可以检测出所有矩形的冲突情况，然后再尝试自动调整布局直到rbush检测不冲突为止。R-Tree提供了一种解决思路和搭配的工具，在此基础之上可以进一步完善细化的布局调整逻辑。

## 地图定位偏移以及坐标系转换

众所周知**地球是一个不规则椭圆体**，GPS中的坐标系定义由`基准面`和`地图投影`两组参数确定，而基准面的定义则由特定椭球体及其对应的转换参数确定。

基准面是利用特定椭球体对特定地区地球表面的逼近，因此每个国家或地区均有各自的基准面。

基准面是在椭球体基础上建立的，椭球体可以对应多个基准面，而基准面只能对应一个椭球体。

意思就是无论是谷歌地图、搜搜地图还是高德地图、百度地图区别只是针对不同的大地地理坐标系标准制作的经纬度，不存在准不准的问题，大家都是准的只是参照物或者说是标准不一样。

谷歌地图采用的是**WGS84地理坐标系`（中国范围除外）`**，谷歌中国地图和搜搜中国地图采用的**是GCJ02地理坐标系**，**百度采用的是BD09坐标系**，而设备一般包含GPS芯片或者北斗芯片获取的经纬度为**WGS84地理坐标系**。

这样就存在不同坐标系的坐标之间转换的问题了，高德地图和百度地图的开发者开放平台中都提供了坐标转换的API。

### 有哪些不同的地图坐标系？

在使用地图组件开发过程中，我们一般能接触到以下三种类型的地图坐标系：

#### **1.原始坐标系（WGS－84）**

WGS－84原始坐标系，一般用国际GPS纪录仪记录下来的经纬度，通过GPS定位拿到的原始经纬度，Google和高德地图定位的的经纬度（国外）都是基于WGS－84坐标系的；但是在国内是不允许直接用WGS84坐标系标注的，必须经过加密后才能使用；据说是为了保密。

GPS坐标形式如图，度分秒形式的经纬度：

![](https://upload-images.jianshu.io/upload_images/6943526-8e58b3c3345b66b0.png?imageMogr2/auto-orient/strip|imageView2/2/w/357/format/webp)

![](https://upload-images.jianshu.io/upload_images/6943526-9b4f769cd583fbdf.png?imageMogr2/auto-orient/strip|imageView2/2/w/410/format/webp)

#### **2.火星坐标系（GCJ－02）**

GCJ－02坐标系，又名“火星坐标系”，是我国国测局独创的坐标体系，由WGS－84加密而成，在国内，必须至少使用GCJ－02坐标系，或者使用在GCJ－02加密后再进行加密的坐标系，如百度坐标系。高德和Google在国内都是使用GCJ－02坐标系，**GCJ-02也是国内最广泛使用的坐标体系**。

#### **3.百度坐标系（bd-09）**

百度坐标系是在GCJ－02坐标系的基础上再次加密偏移后形成的坐标系，只适用于百度地图。(目前百度API提供了从其它坐标系转换为百度坐标系的API，但却没有从百度坐标系转为其他坐标系的API)

### 为什么会发生偏移？

**1.坐标系不兼容**

由于坐标系之间不兼容，如在百度地图上定位的经纬度拿到高德地图上直接描点就肯定会发生偏移；只考虑国内的情况，高德地图和Google地图是可以不经过转换也能够准确显示的（在国内用的都是GCJ－02坐标系）；下面是收录了网上的WGS－84，GCJ－02，百度坐标系(bd-09)之间的相互转换的方法，经测试，是转换后相对准确可用的：

**2.国内外网速不同**

在国内定位的经纬度，然后在国外网络下显示也会发生偏移（谷歌和高德会依据网络的情况选择使用WGS－84坐标还是GCJ－02坐标，百度地图则一直使用bd-02坐标系）

**3.定位方式**

在iOS定位的经纬度是通过GPS获取的，在android则可以通过网络或GPS获取经纬度。通过地图SDK定位获取的经纬度，地图SDK会自动选择加密的方式（如Google地图会根据国内国外选择不同的坐标系）然后再将点显示在地图上，这个时候是没有偏移的；如果直接将经纬度在地图上显示，可能就会因为地域或网络的问题导致使用的坐标系不同，进而发生来偏移。

### 有哪几种坐标？

首先明白，所有坐标体系的原点，都是非洲。

![](https://upload-images.jianshu.io/upload_images/6943526-8c752bfa8f52cebd.png?imageMogr2/auto-orient/strip|imageView2/2/w/554/format/webp)

**1.经纬度**

这个是球面坐标，对于北京来说，就是`(116.38817139.935961)`这样的坐标。比如腾讯、高德、百度都是这样的经纬度坐标。谷歌是经纬度顺序写反的经纬度坐标。

如果是度分秒坐标，需要进行转换，才能得到这样的经纬度坐标。详见坐标转换。

**2.墨卡托坐标**

平面坐标，相当于是直线距离，数字一般都比较大，像这样的。

`(215362.0002133333599526.00034912192)`

墨卡托坐标，主要用于程序的后台计算。直线距离嘛，加加减减几乎计算方便。搜狗地图API就是直接使用的墨卡托坐标。

### 不同地图坐标怎么转换？

在各种web端平台，或者高德、腾讯、百度上取到的坐标，都不是GPS坐标，都是GCJ-02坐标，或者自己的偏移坐标系。

比如，你在**谷歌地图API，高德地图API，腾讯地图API**上取到的，都是GCJ-02坐标，他们三家都是通用的，也适用于大部分地图API产品，以及他们的地图产品。

例外，**百度API上取到的，是BD-09坐标**，只适用于百度地图相关产品。

例外，搜狗API上取到的，是搜狗坐标，只适用于搜狗地图相关产品。

例外，谷歌地球，googleearth上取到的，是GPS坐标，而且是度分秒形式的经纬度坐标。在国内不允许使用。必须转换为GCJ-02坐标。

#### 一.经验转换

根据经验得到的：

（1）百度地图的差别是（0.01185，-0.00328）

如果百度地图的经纬度是（x,y）实际的应该是（x,y）+（-0.01185，-0.00328）=（x-0.01185，y-0.00328）

```
 /**
     * @param $gg_lon 百度经度
     * @param $gg_lat 百度纬度
     * @return mixed
     *
     * GCJ-02(火星，高德) 坐标转换成 BD-09(百度) 坐标
     */
    public function bd_encrypt($gg_lon, $gg_lat)

    {

        $x_pi = 3.14159265358979324 * 3000.0 / 180.0;

        $x = $gg_lon;

        $y = $gg_lat;

        $z = sqrt($x * $x + $y * $y) - 0.00002 * sin($y * $x_pi);

        $theta = atan2($y, $x) - 0.000003 * cos($x * $x_pi);

        $data['bd_lon'] = $z * cos($theta) + 0.0065;

        $data['bd_lat'] = $z * sin($theta) + 0.006;

        return $data;

    }
```

（2）google Map的差别是（0.0143，-0.014）

如果用getscreen截图，如果要截的范围为（x,y），输入getscreen的为（x-0.0143,y+0.014）.

```
 /**
     * @param $bd_lon 百度经度
     * @param $bd_lat 百度纬度
     * @return mixed
     *
     * BD-09(百度) 坐标转换成  GCJ-02(火星，高德) 坐标
     */
    public function bd_decrypt($bd_lon, $bd_lat)
    {

        $x_pi = 3.14159265358979324 * 3000.0 / 180.0;

        $x = $bd_lon - 0.0065;

        $y = $bd_lat - 0.006;

        $z = sqrt($x * $x + $y * $y) - 0.00002 * sin($y * $x_pi);

        $theta = atan2($y, $x) - 0.000003 * cos($x * $x_pi);

        $data['gg_lon'] = $z * cos($theta);

        $data['gg_lat'] = $z * sin($theta);

        return $data;

    }
```

#### 二.度分秒坐标转换为经纬度

比如，在GPS记录仪，或者googleearth上采集到的是39°31'20.51，那么应该这样换算，31分就是31/60度，20.51秒就是20.51/3600度，结果就是39+ 31/60 + 20.51/3600 度。

#### 三.GPS转换为GCJ-02坐标

谷歌，高德，腾讯的地图API官网上，都不直接提供这样的坐标转换。如果要得到GCJ-02坐标，最好在他们的地图上直接取点，或者通过地址解析得到。（这个工具我后续会贴出来的。我就爱干这样的事情，哈哈。）

不过，在网上搜到了这样的接口，该接口的type=1就是GPS转到GCJ-02的墨卡托坐标。请大家对接口保密，哈哈。详见：

`http://map.sogou.com/api/documentation/javascript/api2.5/interface_translate.html#late_intro`

#### 四.GCJ-02与BD-09之间互转

国测局GCJ-02坐标体系（谷歌、高德、腾讯），与百度坐标BD-09体系的转换

转换算法如下：

```
#include   
const double x_pi = 3.14159265358979324 * 3000.0 / 180.0;  
void bd_encrypt(double gg_lat, double gg_lon, double &bd_lat, double &bd_lon)  
{  

    double x = gg_lon, y = gg_lat;  
    double z = sqrt(x * x + y * y) + 0.00002 * sin(y * x_pi);  
    double theta = atan2(y, x) + 0.000003 * cos(x * x_pi);  
    bd_lon = z * cos(theta) + 0.0065;  
    bd_lat = z * sin(theta) + 0.006;  
}  


void bd_decrypt(double bd_lat, double bd_lon, double &gg_lat, double &gg_lon)  
{  

    double x = bd_lon - 0.0065, y = bd_lat - 0.006;  
    double z = sqrt(x * x + y * y) - 0.00002 * sin(y * x_pi);  
    double theta = atan2(y, x) - 0.000003 * cos(x * x_pi);  
    gg_lon = z * cos(theta);  
    gg_lat = z * sin(theta);  
}  

```

不过也有更简单的算法，线性算法（lat和lng是经纬度，球面坐标）：

To\_B是转到百度，To\_G是转到GCJ-02。

```
var TO_BLNG =function(lng){return lng+0.0065;};

var TO_BLAT =function(lat){return lat+0.0060;};

var TO_GLNG =function(lng){return lng-0.0065;};

var TO_GLAT =function(lat){return lat-0.0060;};
```

#### 五.经纬纬度转成墨卡托

在WebGIS的开发中经常用到的地图投影为Web墨卡托和WGS84，Google地图，bingmaps，百度地图，mapabc，mapbar，以及ArcGISonline上的大部分地图为Web墨卡托地图，ArcGIS online上最开始发布的地图投影为WGS84。  
在开发过程中很多时候会遇到不同坐标系之间互转的问题，特别是底图使用Web墨卡托，定位（GPS，wifi等）信号坐标为WGS84坐标的时候，那么通用解决方案就是写一个坐标参考系的转换库，类似于proj4，但一般情况下很少用到那么多的参考系之间的互转，并且在客户端实现或者调用proj4都是一件很困难或者麻烦的事情，大多数情况下我们实现Web墨卡托坐标与WGS84坐标互转就可以了。

下面是使用objective－c实现的Web墨卡托坐标与WGS84坐标互转程序，当然也可以使用其他语言来实现，使用起来比较简单和方便。

```
//经纬度转墨卡托
-(CGPoint )lonLat2Mercator:(CGPoint ) lonLat
{
  CGPoint  mercator;
   double x =lonLat.x *20037508.34/180;
   double y =log(tan((90+lonLat.y)*M_PI/360))/(M_PI/180);
   y = y*20037508.34/180;
   mercator.x =x;
   mercator.y =y;
   returnmercator ;
}
//墨卡托转经纬度
-(CGPoint )Mercator2lonLat:(CGPoint ) mercator
{
   CGPointlonLat;
   double x =mercator.x/20037508.34*180;
   double y =mercator.y/20037508.34*180;
   y=180/M_PI*(2*atan(exp(y*M_PI/180))-M_PI/2);
   lonLat.x =x;
   lonLat.y =y;
   returnlonLat;
}
```

#### 坐标转换之后为什么会出现偏移？

如果您的坐标在转换之后，还有偏移，那么考虑以下几个方面:

**A.原始坐标系弄错**

比如以为自己是GPS坐标，但其实已经是GCJ-02坐标。  
解决方案：请确保采集到的数据是哪个坐标体系，需要转换到哪个坐标系，再进行坐标转换。

**B.原始坐标准确度不够**  
解决方案：如果您是GPS坐标，请确保采集GPS数据时，搜到至少4颗以上的卫星。并且GPS数据准不准，还取决于周围建筑物的高度，越高越不准，因为有遮挡。  
如果本来就是GCJ-02坐标，在不同地图放大级别的时候，看到的地方可能不一样。比如你在地图级别4（国家）取到的坐标，放大到地图12级（街道）时，坐标就偏了。请确保在地图最大放大级别时，拾取坐标。

**C.度分秒的概念混淆**  
比如，在googleearth上采集到的是39°31'20.51，那么应该这样换算，31分就是31/60度，20.51秒就是20.51/3600度，结果就是39+ 31/60 + 20.51/3600 度。

**D.经纬度顺序写反了**  
有些公司（比如高德，百度，腾讯）是先经度，再纬度，即Point(lng lat)。但谷歌坐标的顺序恰好相反，是(latlng)。

说到地图，大家一定很熟悉，平时应该都使用过百度地图、高德地图、腾讯地图等，如果涉及到地图相关的开发需求，也有很多选择，比如前面的几个地图都会提供一套`js API`，此外也有一些开源地图框架可以使用，比如`OpenLayers`、`Leaflet`等。

那么大家有没有想过这些地图是怎么渲染出来的呢，为什么根据一个经纬度就能显示对应的地图呢，不知道没关系，本文会带各位从零实现一个简单的地图引擎，来帮助大家了解`GIS`基础知识及`Web`地图的实现原理。

### WGS84、WebMercator、GCJ02和BD09坐标系简介与转换

**WGS84（GPS）**：

- 地心坐标系，空间直角坐标系，原点与地球质心重合，为GPS采用的坐标系，也是目前广泛使用的GPS全球卫星定位系统使用的坐标系。

- 通过GPS可以直接获取WGS84下的坐标(B，L，H)，B为纬度，L为经度，H为大地高即到WGS84椭球面的高度；

- 我国地图采用的是北京1954或西安1980坐标系下的高斯投影坐标(x,y)，也有采用北京1954或西安1980坐标系下的经纬度坐标(B,L)，高程一般为海拔高度；

- 世界大地坐标系是美国国防部制图局（Defence Mapping Agency， DMA）为统一世界大地坐标系统，实现全球测量标准的一致性，定义用于制图、大地、导航的坐标基准。

- 它包括标准地球坐标框架、用于处理原始观测数据的标准椭球参考面（即基准和参考椭球）和定义标准海平面的重力等势面（大地水准面）。

- GPS的测量结果与北京54或西安80坐标相差几十米到一百多米，随区域各异；

-  WGS 1984 的具体定义参数

    GCS_WGS_1984
    WKID: 4326 Authority: EPSG

    Angular Unit: Degree (0.0174532925199433)
    Prime Meridian: Greenwich (0.0)
    Datum: D_WGS_1984
    Spheroid: WGS_1984
    Semimajor Axis: 6378137.0
    Semiminor Axis: 6356752.314245179
    Inverse Flattening: 298.257223563

**WebMercator**：投影坐标系统，其基准面是 WGS1984

- Web Mercator 坐标系使用的投影方法不是严格意义的墨卡托投影，而是一个被 EPSG（European Petroleum Survey Group）称为伪墨卡托的投影方法，这个伪墨卡托投影方法的大名是 Popular Visualization Pseudo Mercator，PVPM。
- 该坐标系统是 Google Map 最先使用的，或者更确切地说，是Google 最先发明的。
- 谷歌地图（WGS_1984_Pseudo_mercator）、Virtual Earth、Bing Maps、百度地图、Mapabc、ArcGIS Online等采用Web Mercator或Spherical Mercator坐标系，天地图采用CGCS2000国家大地坐标系；
- 在投影过程中，将表示地球的参考椭球体近似的作为正球体处理（正球体半径 R = 椭球体半长轴 a）。这也是为什么在 ArcGIS 中我们经常看到这个坐标系叫 WGS 1984 Web Mercator (Auxiliary Sphere)。Auxiliary Sphere 就是在告知你，这个坐标在投影过程中，将椭球体近似为正球体做投影变换，虽然基准面是WGS 1984 椭球面。**（Web Mercator与常规墨卡托投影的主要区别就是把地球模拟为球体而非椭球体）**
- 尽管这个坐标系由于精度问题一度不被GIS专业人士接受，但最终 EPSG 还是给了 WKID:3857。

**GCJ02**：又称火星坐标系，是由中国国家测绘局制定的地理坐标系统，是由WGS84加密后得到的坐标系。

**BD09（百度GCJ02）**：百度坐标系，在GCJ02坐标系基础上再次加密。其中bd09ll表示百度经纬度坐标，bd09mc表示百度墨卡托米制坐标。

**百度坐标转WebMercator**

```js
  BMapToWebMercatorTransform:function (lng,lat) {
          console.log("百度地图坐标是（"+lng+","+lat+")");
          //百度转GCJ-02
          var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
          var x = lng - 0.0065;
          var y = lat - 0.006;
          var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
          var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
          var gg_lng = z * Math.cos(theta);
          var gg_lat = z * Math.sin(theta);
          //GCJ02转web墨卡托84
          var earthRad = 6378137.0;
          lng = gg_lng * Math.PI / 180 * earthRad;
          var a = gg_lat * Math.PI / 180;
          lat = earthRad / 2 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
          console.log("WebMercator坐标是（"+lng+","+lat+")");
        },
```

***\*WebMercator转\**百度坐标**

```js
WebMercatorToBMapTransform:function (lng,lat) {
          console.log("WebMercator坐标是（"+lng+","+lat+")");
          //Web墨卡托转GCJ02
          lng = lng / 20037508.34 * 180;
          var mmy = lat / 20037508.34 * 180;
          lat = 180 / Math.PI * (2 * Math.atan(Math.exp(mmy * Math.PI / 180)) - Math.PI / 2);
          //GCJ02转百度
          var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
          var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
          var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
          lng = z * Math.cos(theta) + 0.0065;
          lat = z * Math.sin(theta) + 0.006;
          console.log("百度地图坐标是（"+lng+","+lat+")");
        }
```

84转web墨卡托

```js
function WGS84ToWebMercator(wx,wy){
    var x = wx *20037508.34/180;
    var y = Math.log(Math.tan((90+wy)*Math.PI/360))/(Math.PI/180);
    y = y * 20037508.34/180;
    return {x:x,y:y};
}
```

web墨卡托转84

```js
function WebMercatorToWGS84(cx,cy){
    var x = cx/20037508.34*180;
    var y = cy/20037508.34*180;
    y = 180/Math.PI*(2*Math.atan(Math.exp(y*Math.PI/180))-Math.PI/2);
    return {x:x,y:y};
}
```

## openLayer

> OpenLayers使在任何网页中放置动态地图变得很容易。它可以显示地图瓷砖，矢量数据和标记加载从任何来源。OpenLayers的开发是为了进一步利用各种地理信息。它是完全免费的开源JavaScript gis库。

- 瓦片图层 从OSM、Bing、MapBox、Stamen和任何其他你能找到的XYZ源中拉瓷砖。还支持OGC映射服务和非瓦片层。
- 矢量图层 从GeoJSON、TopoJSON、KML、GML、Mapbox矢量图块和其他格式渲染矢量数据
- 尖端、快速、可移动 利用画布2D、WebGL和HTML5的所有最新功能。移动支持开箱即用。只使用所需的组件构建轻量级自定义配置文件。
- 易于扩展 使用直接的CSS样式您的地图控件。连接到不同级别的API中，或者使用第三方库来定制和扩展功能。

### openLayer介绍

#### OL整体结构图

![image-20220911100756927](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/image-20220911100756927.png)

### Hello World GIS

> 注意此示例功能基于vue进行创建,需提前引入依赖:"ol": "^6.5.0",

1. 创建容器对象填充map

```xml
<template>
    <div id="map" style="width: 700px;height: 700px">
    </div>
</template>
```

1. 引入openlayer相关依赖(css,js)

```javascript
import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import {fromLonLat} from 'ol/proj.js';
```

1. 使用api创建对象

```css
const map = new Map({
               target: 'map',
               layers: [
                       new TileLayer({
                             //使用osm数据源
                             source: new OSM()
                        })
                    ],
                    view: new View({
                        center: fromLonLat([106.57, 29.588]),
                        zoom: 10
                    })
});
```

### **Hello World**

新建目录，然后`npm init -y`初始化一下，修改`package.json`。

```json
{
  "name": "openlayers",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "webpack-dev-server --open"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "ol": "^5.3.3"
  },
  "devDependencies": {
    "html-webpack-plugin": "^3.2.0",
    "webpack": "^4.39.1",
    "webpack-cli": "^3.3.6",
    "webpack-dev-server": "^3.7.2"
  }
}
```

新建`webpack.config.js`文件，以下几乎是最小化的配置了

```js
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.js"
  },
  devtool: "inline-source-map",
  devServer: {
    //静态资源放这个目录下，不然会找不到
    contentBase: "./dist",
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./dist/index.html"
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  }
};
```

入口的`html.js`文件

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Hello Openlayers</title>
    <link rel="stylesheet" href="./ol.css" />
    <style>
      html,
      body {
        margin: 0;
        height: 100%;
      }
      #map {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
  </body>
</html>
```

入口的`index.js`文件

```js
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: fromLonLat([121.47, 31.23]),
    zoom: 15
  })
});
```

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/v2-f8a08834cd400b145ab39bb66a728934_r.jpg)

不需要几行代码就搭建出了一个地图，这里加载的是OpenStreetMap，没有版权、费用的困扰。

### **基础概念**

OpenLayers里有几个重要的概念，理清它们后有助于我们开发。

#### **Map**

Map就是地图，它是一个抽象的概念。Map上可以关联多个Layer或者一个View。它的定义在`ol/Map`下。

#### **Layer**

Layer表示一个图层。OpenLayers的名字里就带有Layer，表示最终它的展现效果是通过一层层的Layer来显示出来的，比如你可以在底部显示基础的地图，然后在地图的上方显示一些标记、线路、提示等效果。

它的定义在`ol/layer`下，有如下四种基础的Layer，前两种属于栅格，后两种属于矢量。

- `ol/layer/Tile` - 渲染瓦片图片，就是那种将整个地图分解为一张张图片最后拼起来的
- `ol/layer/Image` - 渲染图像
- `ol/layer/Vector` - 渲染矢量数据
- `ol/layer/VectorTile` - 渲染矢量瓦片

#### **Source**

Source就是地图的来源，在OpenLayers里可以支持多种地图源，比如OpenStreetMap 、Bing、XYZ或者矢量的KML等。

Source是跟Layer关联的。它的定义在`ol/source`下。

#### **View**

View用来表示一组属性，比如中心点，缩放大小以及映射等。它的定义在`ol/View`下。

#### **控件**

在`ol/control`下已经定义了一些内置的控件，如果不满意，部分也是可以定制的。

大致有如下一些内置控件

- 全屏
- 鼠标经纬度
- 旋转
- 缩放
- 小地图(类似于打游戏时的那种小地图)

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/v2-8a5de5bdbc2f11b771a1b7a4872841c9_r.jpg)

#### **交互**

交互事件定义在`ol/interaction`下，大致有如下一些交互事件

- DragRotate
- DoubleClickZoom
- DragPan
- PinchRotate
- PinchZoom
- KeyboardPan
- KeyboardZoom
- MouseWheelZoom
- DragZoom

下图是测距和测面积的交互实例

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/Imgs/v2-c1b6b29dca7fd3a0389fe46f87e74811_r.jpg)



### openLayer api 介绍

#### Map

> 地图核心对象,其中包含图层、数据源、视图、控制条，事件等相关进行配置

#### View

> 管理地图视图的视觉参数，如分辨率或旋转。

#### Layers

> 图层是从数据源获取数据的轻量级容器。

#### Controls

> 用来控制地图的，就是设置地图的缩放(zoom)，全屏(fullscreen)、地图全局视图（鹰眼图）( overviewmap)等控件

#### Interactions

> 主要是用来配置地图交互的，且交互功能包含很多，如地图双击放大，鼠标滚轮缩放，矢量要素点选，地图上绘制图形等等。只要是涉及到与地图的交互，就会涉及到 intercation 类。

#### Sources and formats

> Sources：地图图层数据来源，比如切片数据、矢量数据、图片数据等数据源 Formats：对地图图层数据格式进行转换

#### Projections

> 实现坐标系转换，可以转换为指定的坐标系坐标，可以坐标系间坐标互相转换，转换Extent为指定坐标系。

#### Observable objects

> 

#### Other components

> 其中使用的最多的是overlay类，主要是地图覆盖物的意思，一般与popup连用来实现弹出效果



## 从零打造一个Web地图引擎

### 选个经纬度

首先我们去高德地图上选个经纬度，作为我们后期的地图中心点，打开[高德坐标拾取](https://link.juejin.cn/?target=https%3A%2F%2Flbs.amap.com%2Ftools%2Fpicker "https://lbs.amap.com/tools/picker")工具，随便选择一个点：

![image-20220104161043710.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/241915e1b4454cec967c01eec9536626~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

笔者选择了杭州的雷峰塔，经纬度为：`[120.148732,30.231006]`。

### 瓦片url分析

地图瓦片我们使用高德的在线瓦片，地址如下：

```
https://webrd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8
```

目前各大地图厂商的瓦片服务遵循的规则是有不同的：

> 谷歌XYZ规范：谷歌地图、OpenStreetMap、高德地图、geoq、天地图，坐标原点在左上角
>
> TMS规范：腾讯地图，坐标原点在左下角
>
> WMTS规范：原点在左上角，瓦片不是正方形，而是矩形，这个应该是官方标准
>
> 百度地图比较特立独行，投影、分辨率、坐标系都跟其他厂商不一样，原点在经纬度都为0的位置，也就是中间，向右为X正方向，向上为Y正方向

谷歌和`TMS`的瓦片行列号区别如下：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cba011ccc26459fae002e4e554cea15~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

虽然规范不同，但原理基本是一致的，都是把地球投影成一个巨大的正方形世界平面图，然后按照四叉树进行分层切割，比如第一层，只有一张瓦片，显示整个世界的信息，所以基本只能看到洲和海的名称和边界线，第二层，切割成四张瓦片，显示信息稍微多了一点，以此类推，就像一个金字塔一样，底层分辨率最高，显示的细节最多，瓦片数也最多，顶层分辨率最低，显示的信息很少，瓦片数量相对也最少：

![image-20220105134723330.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf82643211c148efbc4a8009f8f61158~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

每一层的瓦片数量计算公式：

```
Math.pow(Math.pow(2, n), 2)// 行*列：2^n * 2^n
```

十八层就需要`68719476736`张瓦片，所以一套地图瓦片整体数量是非常庞大的。

瓦片切好以后，通过行列号和缩放层级来保存，所以可以看到瓦片地址中有三个变量：`x`、`y`、`z`

```
x：行号
y：列号
z：分辨率，一般为0-18
```

通过这三个变量就可以定位到一张瓦片，比如下面这个地址，行号为`109280`，列号为`53979`，缩放层级为`17`：

```
https://webrd01.is.autonavi.com/appmaptile?x=109280&y=53979&z=17&lang=zh_cn&size=1&scale=1&style=8
```

对应的瓦片为：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46b5ff5847ad4e05b701e31daf6a5546~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

### 坐标系简介

高德地图使用的是`GCJ-02坐标系`，也称火星坐标系，由中国国家测绘局在02年发布，是在GPS坐标（`WGS-84`坐标系）基础上经加密后而来，也就是增加了非线性的偏移，让你摸不准真实位置，为了国家安全，国内地图服务商都需要使用`GCJ-02坐标系`。

`WGS-84`坐标系是国际通用的标准，`EPSG`编号为`EPSG:4326`，通常GPS设备获取到的原始经纬度和国外的地图厂商使用的都是`WGS-84`坐标系。

这两种坐标系都是地理坐标系，球面坐标，单位为`度`，这种坐标方便在地球上定位，但是不方便展示和进行面积距离计算，我们印象中的地图都是平面的，所以就有了另外一种平面坐标系，平面坐标系是通过投影的方式从地理坐标系中转换过来，所以也称为投影坐标系，通常单位为`米`，投影坐标系根据投影方式的不同存在多种，在`Web`开发的场景里通常使用的是`Web墨卡托投影`，编号为`EPSG:3857`，它基于`墨卡托投影`，把`WGS-84`坐标系投影成正方形，这是通过舍弃了南北`85.051129纬度`以上的地区实现的，因为它是正方形，所以一个大的正方形可以很方便的被分割为更小的正方形。

### 经纬度定位行列号

上一节里我们简单介绍了一下坐标系，按照`Web`地图的标准，我们的地图引擎也选择支持`EPSG:3857`投影，但是我们通过高德工具获取到的是火星坐标系的经纬度坐标，所以第一步要把经纬度坐标转换为`Web墨卡托`投影坐标，这里为了简单，先直接把火星坐标当做`WGS-84`坐标，后面再来看这个问题。

转换方法网上一搜就有：

```
// 角度转弧度
const angleToRad = (angle) => {
    return angle * (Math.PI / 180)
}

// 弧度转角度
const radToAngle = (rad) => {
    return rad * (180 / Math.PI)
}

// 地球半径
const EARTH_RAD = 6378137

// 4326转3857
const lngLat2Mercator = (lng, lat) => {
    // 经度先转弧度，然后因为 弧度 = 弧长 / 半径 ，得到弧长为 弧长 = 弧度 * 半径 
    let x = angleToRad(lng) * EARTH_RAD; 
    // 纬度先转弧度
    let rad = angleToRad(lat)
    // 下面我就看不懂了，各位随意。。。
    let sin = Math.sin(rad)
    let y = EARTH_RAD / 2 * Math.log((1 + sin) / (1 - sin))
    return [x, y]
}

// 3857转4326
const mercatorTolnglat = (x, y) => {
    let lng = radToAngle(x) / EARTH_RAD
    let lat = radToAngle((2 * Math.atan(Math.exp(y / EARTH_RAD)) - (Math.PI / 2)))
    return [lng, lat]
}
```

`3857`坐标有了，它的单位是`米`，那么怎么转换成瓦片的行列号呢，这就涉及到`分辨率`的概念了，即地图上一像素代表实际多少米，分辨率如果能从地图厂商的文档里获取是最好的，如果找不到，也可以简单计算一下（如果使用计算出来的也不行，那就只能求助搜索引擎了），我们知道地球半径是`6378137`米，`3857`坐标系把地球当做正圆球体来处理，所以可以算出地球周长，投影是贴着地球赤道的：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08c3b179e8594829bc3682c0f5d1ae1f~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

所以投影成正方形的世界平面图后的边长代表的就是地球的周长，前面我们也知道了每一层级的瓦片数量的计算方式，而一张瓦片的大小一般是`256*256`像素，所以用地球周长除以展开后的世界平面图的边长就知道了地图上每像素代表实际多少米：

```
// 地球周长
const EARTH_PERIMETER = 2 * Math.PI * EARTH_RAD
// 瓦片像素
const TILE_SIZE = 256

// 获取某一层级下的分辨率
const getResolution = (n) => {
    const tileNums = Math.pow(2, n)
    const tileTotalPx = tileNums * TILE_SIZE
    return EARTH_PERIMETER / tileTotalPx
}
```

地球周长算出来是`40075016.68557849`，可以看到`OpenLayers`就是这么计算的：

![image-20220105143333164.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ceb3a5b09d644ff0a03188ecff1a5eca~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

`3857`坐标的单位是`米`，那么把坐标除以分辨率就可以得到对应的像素坐标，再除以`256`，就可以得到瓦片的行列号：

![image-20220105185741054.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4b4032c30114b9ea9fe0a9bba2122f8~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

函数如下：

```
// 根据3857坐标及缩放层级计算瓦片行列号
const getTileRowAndCol = (x, y, z) => {
    let resolution = getResolution(z)
    let row = Math.floor(x / resolution / TILE_SIZE)
    let col = Math.floor(y / resolution / TILE_SIZE)
    return [row, col]
}
```

接下来我们把层级固定为`17`，那么分辨率`resolution`就是`1.194328566955879`，雷峰塔的经纬度转成`3857`的坐标为：`[13374895.665697495, 3533278.205310311]`，使用上面的函数计算出来行列号为：`[43744, 11556]`，我们把这几个数据代入瓦片的地址里进行访问：

```
https://webrd01.is.autonavi.com/appmaptile?x=43744&y=11556&z=17&lang=zh_cn&size=1&scale=1&style=8
```

![image-20220105150159713.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/125aec7dce294fbc98c4d2c4f96ef7cf~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

一片空白，这是为啥呢，其实是因为原点不一样，`4326`和`3857`坐标系的原点在赤道和本初子午线相交点，非洲边上的海里，而瓦片的原点在左上角：

![image-20220119172036436.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3431c302f67c49c2af620f83ac1c4032~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

再来看下图会更容易理解：

![image-20220106095034453.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/36cc5f47d58343949d011b6ca541d8a6~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

`3857`坐标系的原点相当于在世界平面图的中间，向右为`x`轴正方向，向上为`y`轴正方向，而瓦片地图的原点在左上角，所以我们需要根据图上【绿色虚线】的距离计算出【橙色实线】的距离，这也很简单，水平坐标就是水平绿色虚线的长度加上世界平面图的一半，垂直坐标就是世界平面图的一半减去垂直绿色虚线的长度，世界平面图的一半也就是地球周长的一半，修改`getTileRowAndCol`函数：

```
const getTileRowAndCol = (x, y, z) => {
  x += EARTH_PERIMETER / 2     // ++
  y = EARTH_PERIMETER / 2 - y  // ++
  let resolution = getResolution(z)
  let row = Math.floor(x / resolution / TILE_SIZE)
  let col = Math.floor(y / resolution / TILE_SIZE)
  return [row, col]
}
```

这次计算出来的瓦片行列号为`[109280, 53979]`，代入瓦片地址：

```
https://webrd01.is.autonavi.com/appmaptile?x=109280&y=53979&z=17&lang=zh_cn&size=1&scale=1&style=8
```

结果如下：

![image-20220106095801592.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb031151883146458f775f00a29b99b5~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

可以看到雷峰塔出来了。

### 瓦片显示位置计算

我们现在能根据一个经纬度找到对应的瓦片，但是这还不够，我们的目标是要能在浏览器上显示出来，这就需要解决两个问题，一个是加载多少块瓦片，二是计算每一块瓦片的显示位置。

渲染瓦片我们使用`canvas`画布，模板如下：

```
<template>
  <div class="map" ref="map">
    <canvas ref="canvas"></canvas>
  </div>
</template>
```

地图画布容器`map`的大小我们很容易获取：

```
// 容器大小
let { width, height } = this.$refs.map.getBoundingClientRect()
this.width = width
this.height = height
// 设置画布大小
let canvas = this.$refs.canvas
canvas.width = width
canvas.height = height
// 获取绘图上下文
this.ctx = canvas.getContext('2d')
```

地图中心点我们设在画布中间，另外中心点的经纬度`center`和缩放层级`zoom`因为都是我们自己设定的，所以也是已知的，那么我们可以计算出中心坐标对应的瓦片：

```
// 中心点对应的瓦片
let centerTile = getTileRowAndCol(
    ...lngLat2Mercator(...this.center),// 4326转3857
    this.zoom// 缩放层级
)
```

缩放层级还是设为`17`，中心点还是使用雷峰塔的经纬度，那么对应的瓦片行列号前面我们已经计算过了，为`[109280, 53979]`。

中心坐标对应的瓦片行列号知道了，那么该瓦片左上角在世界平面图中的像素位置我们也就知道了：

```
// 中心瓦片左上角对应的像素坐标
let centerTilePos = [centerTile[0] * TILE_SIZE, centerTile[1] * TILE_SIZE]
```

计算出来为`[27975680, 13818624]`。这个坐标怎么转换到屏幕上呢，请看下图：

![image-20220106143543672.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e115185348d443d99a081a3bd65140a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

中心经纬度的瓦片我们计算出来了，瓦片左上角的像素坐标也知道了，然后我们再计算出中心经纬度本身对应的像素坐标，那么和瓦片左上角的差值就可以计算出来，最后我们把画布的原点移动到画布中间（画布默认原点为左上角，x轴正方向向右，y轴正方向向下），也就是把中心经纬度作为坐标原点，那么中心瓦片的显示位置就是这个差值。

补充一下将经纬度转换成像素的方法：

```
// 计算4326经纬度对应的像素坐标
const getPxFromLngLat = (lng, lat, z) => {
  let [_x, _y] = lngLat2Mercator(lng, lat)// 4326转3857
  // 转成世界平面图的坐标
  _x += EARTH_PERIMETER / 2
  _y = EARTH_PERIMETER / 2 - _y
  let resolution = resolutions[z]// 该层级的分辨率
  // 米/分辨率得到像素
  let x = Math.floor(_x / resolution)
  let y = Math.floor(_y / resolution)
  return [x, y]
}
```

计算中心经纬度对应的像素坐标：

```
// 中心点对应的像素坐标
let centerPos = getPxFromLngLat(...this.center, this.zoom)
```

计算差值：

```
// 中心像素坐标距中心瓦片左上角的差值
let offset = [
    centerPos[0] - centerTilePos[0],
    centerPos[1] - centerTilePos[1]
]
```

最后通过`canvas`来把中心瓦片渲染出来：

```
// 移动画布原点到画布中间
this.ctx.translate(this.width / 2, this.height / 2)
// 加载瓦片图片
let img = new Image()
// 拼接瓦片地址
img.src = getTileUrl(...centerTile, this.zoom)
img.onload = () => {
    // 渲染到canvas
    this.ctx.drawImage(img, -offset[0], -offset[1])
}
```

这里先来看看`getTileUrl`方法的实现：

```
// 拼接瓦片地址
const getTileUrl = (x, y, z) => {
  let domainIndexList = [1, 2, 3, 4]
  let domainIndex =
    domainIndexList[Math.floor(Math.random() * domainIndexList.length)]
  return `https://webrd0${domainIndex}.is.autonavi.com/appmaptile?x=${x}&y=${y}&z=${z}&lang=zh_cn&size=1&scale=1&style=8`
}
```

这里随机了四个子域：`webrd01`、`webrd02`、`webrd03`、`webrd04`，这是因为浏览器对于同一域名同时请求的资源是有数量限制的，而当地图层级变大后需要加载的瓦片数量会比较多，那么均匀分散到各个子域下去请求可以更快的渲染出所有瓦片，减少排队等待时间，基本所有地图厂商的瓦片服务地址都支持多个子域。

为了方便看到中心点的位置，我们再额外渲染两条中心辅助线，效果如下：

![image-20220106150430636.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/feea95376f604dd8874acabc7c4a1b01~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

可以看到中心点确实是雷峰塔，当然这只是渲染了中心瓦片，我们要的是瓦片铺满整个画布，对于其他瓦片我们都可以根据中心瓦片计算出来，比如中心瓦片左边的一块，它的计算如下：

```
// 瓦片行列号，行号减1，列号不变
let leftTile = [centerTile[0] - 1, centerTile[1]]
// 瓦片显示坐标，x轴减去一个瓦片的大小，y轴不变
let leftTilePos = [
    offset[0] - TILE_SIZE * 1,
    offset[1]
]
```

所以我们只要计算出中心瓦片四个方向各需要几块瓦片，然后用一个双重循环即可计算出画布需要的所有瓦片，计算需要的瓦片数量很简单，请看下图：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c015e197c69498babe2cd034beadf6a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

画布宽高的一半减去中心瓦片占据的空间即可得到该方向剩余的空间，然后除以瓦片的尺寸就知道需要几块瓦片了：

```
// 计算瓦片数量
let rowMinNum = Math.ceil((this.width / 2 - offset[0]) / TILE_SIZE)// 左
let colMinNum = Math.ceil((this.height / 2 - offset[1]) / TILE_SIZE)// 上
let rowMaxNum = Math.ceil((this.width / 2 - (TILE_SIZE - offset[0])) / TILE_SIZE)// 右
let colMaxNum = Math.ceil((this.height / 2 - (TILE_SIZE - offset[1])) / TILE_SIZE)// 下
```

我们把中心瓦片作为原点，坐标为`[0, 0]`，来个双重循环扫描一遍即可渲染出所有瓦片：

```
// 从上到下，从左到右，加载瓦片
for (let i = -rowMinNum; i <= rowMaxNum; i++) {
    for (let j = -colMinNum; j <= colMaxNum; j++) {
        // 加载瓦片图片
        let img = new Image()
        img.src = getTileUrl(
            centerTile[0] + i,// 行号
            centerTile[1] + j,// 列号
            this.zoom
        )
        img.onload = () => {
            // 渲染到canvas
            this.ctx.drawImage(
                img, 
                i * TILE_SIZE - offset[0], 
                j * TILE_SIZE - offset[1]
            )
        }
    }
}
```

效果如下：

![image-20220106183134954.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f54767d0d184c8291b761fef2fac83b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

很完美。

### 拖动

拖动可以这么考虑，前面已经实现了渲染指定经纬度的瓦片，当我们按住进行拖动时，可以知道鼠标滑动的距离，然后把该距离，也就是像素转换成经纬度的数值，最后我们再更新当前中心点的经纬度，并清空画布，调用之前的方法重新渲染，不停重绘造成是在移动的视觉假象。

监听鼠标相关事件：

```
<canvas ref="canvas" @mousedown="onMousedown"></canvas>
```

```
export default {
    data(){
        return {
            isMousedown: false
        }
    },
    mounted() {
        window.addEventListener("mousemove", this.onMousemove);
        window.addEventListener("mouseup", this.onMouseup);
    },
    methods: {
        // 鼠标按下
        onMousedown(e) {
            if (e.which === 1) {
                this.isMousedown = true;
            }
        },

        // 鼠标移动
        onMousemove(e) {
            if (!this.isMousedown) {
                return;
            }
            // ...
        },

        // 鼠标松开
        onMouseup() {
            this.isMousedown = false;
        }
    }
}
```

在`onMousemove`方法里计算拖动后的中心经纬度及重新渲染画布：

```
// 计算本次拖动的距离对应的经纬度数据
let mx = e.movementX * resolutions[this.zoom];
let my = e.movementY * resolutions[this.zoom];
// 把当前中心点经纬度转成3857坐标
let [x, y] = lngLat2Mercator(...this.center);
// 更新拖动后的中心点经纬度
center = mercatorToLngLat(x - mx, my + y);
```

`movementX`和`movementY`属性能获取本次和上一次鼠标事件中的移动值，兼容性不是很好，不过自己计算该值也很简单，详细请移步[MDN](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FMouseEvent%2FmovementX "https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/movementX")。乘以当前分辨率把`像素`换算成`米`，然后把当前中心点经纬度也转成`3857`的`米`坐标，偏移本次移动的距离，最后再转回`4326`的经纬度坐标作为更新后的中心点即可。

为什么`x`是减，`y`是加呢，很简单，我们鼠标向右和向下移动时距离是正的，相应的地图会向右或向下移动，`4326`坐标系向右和向上为正方向，那么地图向右移动时，中心点显然是相对来说是向左移了，因为向右为正方向，所以中心点经度方向就是减少了，所以是减去移动的距离，而地图向下移动，中心点相对来说是向上移了，因为向上为正方向，所以中心点纬度方向就是增加了，所以加上移动的距离。

更新完中心经纬度，然后清空画布重新绘制：

```
// 清空画布
this.clear();
// 重新绘制，renderTiles方法就是上一节的代码逻辑封装
this.renderTiles();
```

效果如下：

![whbm.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ca1acb1ec2348f9bf1b6aaf4c58735c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

可以看到已经凌乱了，这是为啥呢，其实是因为图片加载是一个异步的过程，我们鼠标移动过程中，会不断的计算出要加载的瓦片进行加载，但是可能上一批瓦片还没加载完成，鼠标已经移动到新的位置了，又计算出一批新的瓦片进行加载，此时上一批瓦片可能加载完成并渲染出来了，但是这些瓦片有些可能已经被移除画布，不需要显示，有些可能还在画布内，但是使用的还是之前的位置，渲染出来也是不对的，同时新的一批瓦片可能也加载完成并渲染出来，自然导致了最终显示的错乱。

知道原因就简单了，首先我们加个缓存对象，因为在拖动过程中，很多瓦片只是位置变了，不需要重新加载，同一个瓦片加载一次，后续只更新它的位置即可；另外再设置一个对象来记录当前画布上应该显示的瓦片，防止不应该出现的瓦片渲染出来：

```
{
    // 缓存瓦片
    tileCache: {},
    // 记录当前画布上需要的瓦片
    currentTileCache: {}
}
```

因为需要记录瓦片的位置、加载状态等信息，我们创建一个瓦片类：

```
// 瓦片类
class Tile {
  constructor(opt = {}) {
    // 画布上下文
    this.ctx = ctx
    // 瓦片行列号
    this.row = row
    this.col = col
    // 瓦片层级
    this.zoom = zoom
    // 显示位置
    this.x = x
    this.y = y
    // 一个函数，判断某块瓦片是否应该渲染
    this.shouldRender = shouldRender
    // 瓦片url
    this.url = ''
    // 缓存key
    this.cacheKey = this.row + '_' + this.col + '_' + this.zoom
    // 图片
    this.img = null
    // 图片是否加载完成
    this.loaded = false

    this.createUrl()
    this.load()
  }
    
  // 生成url
  createUrl() {
    this.url = getTileUrl(this.row, this.col, this.zoom)
  }

  // 加载图片
  load() {
    this.img = new Image()
    this.img.src = this.url
    this.img.onload = () => {
      this.loaded = true
      this.render()
    }
  }

  // 将图片渲染到canvas上
  render() {
    if (!this.loaded || !this.shouldRender(this.cacheKey)) {
      return
    }
    this.ctx.drawImage(this.img, this.x, this.y)
  }
    
  // 更新位置
  updatePos(x, y) {
    this.x = x
    this.y = y
    return this
  }
}
```

然后修改之前的双重循环渲染瓦片的逻辑：

```
this.currentTileCache = {}// 清空缓存对象
for (let i = -rowMinNum; i <= rowMaxNum; i++) {
    for (let j = -colMinNum; j <= colMaxNum; j++) {
        // 当前瓦片的行列号
        let row = centerTile[0] + i
        let col = centerTile[1] + j
        // 当前瓦片的显示位置
        let x = i * TILE_SIZE - offset[0]
        let y = j * TILE_SIZE - offset[1]
        // 缓存key
        let cacheKey = row + '_' + col + '_' + this.zoom
        // 记录画布当前需要的瓦片
        this.currentTileCache[cacheKey] = true
        // 该瓦片已加载过
        if (this.tileCache[cacheKey]) {
            // 更新到当前位置
            this.tileCache[cacheKey].updatePos(x, y).render()
        } else {
            // 未加载过
            this.tileCache[cacheKey] = new Tile({
                ctx: this.ctx,
                row,
                col,
                zoom: this.zoom,
                x,
                y,
                // 判断瓦片是否在当前画布缓存对象上，是的话则代表需要渲染
                shouldRender: (key) => {
                    return this.currentTileCache[key]
                },
            })
        }
    }
}
```

效果如下：

![whbm.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/47545910fab64c17a393ded3b1b36e28~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

可以看到，拖动已经正常了，当然，上述实现还是很粗糙的，需要优化的地方很多，比如：

1.一般会先排个序，优先加载中心瓦片

2.缓存的瓦片越来越多肯定也会影响性能，所以还需要一些清除策略

这些问题有兴趣的可以自行思考。

### 缩放

拖动是实时更新中心点经纬度，那么缩放自然更新缩放层级就行了：

```
export default {
    data() {
        return {
            // 缩放层级范围
            minZoom: 3,
            maxZoom: 18,
            // 防抖定时器
            zoomTimer: null
        }
    },
    mounted() {
        window.addEventListener('wheel', this.onMousewheel)
    },
    methods: {
        // 鼠标滚动
        onMousewheel(e) {
            if (e.deltaY > 0) {
                // 层级变小
                if (this.zoom > this.minZoom) this.zoom--
            } else {
                // 层级变大
                if (this.zoom < this.maxZoom) this.zoom++
            }
            // 加个防抖，防止快速滚动加载中间过程的瓦片
            this.zoomTimer = setTimeout(() => {
                this.clear()
                this.renderTiles()
            }, 300)
        }
    }
}
```

效果如下：

![whbm.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88596e9c348b4477958f42a43cd8494a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

功能是有了，不过效果很一般，因为我们平常使用的地图缩放都是有一个放大或缩小的过渡动画，而这个是直接空白然后重新渲染，不仔细看都不知道是放大还是缩小。

所以我们不妨加个过渡效果，当我们鼠标滚动后，先将画布放大或缩小，动画结束后再根据最终的缩放值来渲染需要的瓦片。

画布默认缩放值为`1`，放大则在此基础上乘以`2`倍，缩小则除以`2`，然后动画到目标值，动画期间设置画布的缩放值及清空画布，重新绘制画布上的已有瓦片，达到放大或缩小的视觉效果，动画结束后再调用`renderTiles`重新渲染最终缩放值需要的瓦片。

```
// 动画使用popmotion库，https://popmotion.io/
import { animate } from 'popmotion'

export default {
    data() {
        return {
            lastZoom: 0,
            scale: 1,
            scaleTmp: 1,
            playback: null,
        }
    },
    methods: {
        // 鼠标滚动
        onMousewheel(e) {
            if (e.deltaY > 0) {
                // 层级变小
                if (this.zoom > this.minZoom) this.zoom--
            } else {
                // 层级变大
                if (this.zoom < this.maxZoom) this.zoom++
            }
            // 层级未发生改变
            if (this.lastZoom === this.zoom) {
                return
            }
            this.lastZoom = this.zoom
            // 更新缩放比例，也就是目标缩放值
            this.scale *= e.deltaY > 0 ? 0.5 : 2
            // 停止上一次动画
            if (this.playback) {
                this.playback.stop()
            }
            // 开启动画
            this.playback = animate({
                from: this.scaleTmp,// 当前缩放值
                to: this.scale,// 目标缩放值
                onUpdate: (latest) => {
                    // 实时更新当前缩放值
                    this.scaleTmp = latest
                    // 保存画布之前状态，原因有二：
                    // 1.scale方法是会在之前的状态上叠加的，比如初始是1，第一次执行scale(2,2)，第二次执行scale(3,3)，最终缩放值不是3，而是6，所以每次缩放完就恢复状态，那么就相当于每次都是从初始值1开始缩放，效果就对了
                    // 2.保证缩放效果只对重新渲染已有瓦片生效，不会对最后的renderTiles()造成影响
                    this.ctx.save()
                    this.clear()
                    this.ctx.scale(latest, latest)
                    // 刷新当前画布上的瓦片
                    Object.keys(this.currentTileCache).forEach((tile) => {
                        this.tileCache[tile].render()
                    })
                    // 恢复到画布之前状态
                    this.ctx.restore()
                },
                onComplete: () => {
                    // 动画完成后将缩放值重置为1
                    this.scale = 1
                    this.scaleTmp = 1
                    // 根据最终缩放值重新计算需要的瓦片并渲染
                    this.renderTiles()
                },
            })
        }
    }
}
```

效果如下：

![2022-01-13-16-23-27.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c804e8573fb42a7af5ebb11195d1823~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

虽然效果还是一般，不过至少能看出来是在放大还是缩小。

### 坐标系转换

前面还遗留了一个小问题，即我们把高德工具上选出的经纬度直接当做`4326`经纬度，前面也讲过，它们之间是存在偏移的，比如手机`GPS`获取到的经纬度一般都是`84`坐标，直接在高德地图显示，会发现和你实际位置不一样，所以就需要进行一个转换，有一些工具可以帮你做些事情，比如[Gcoord](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fhujiulong%2Fgcoord "https://github.com/hujiulong/gcoord")、[coordtransform](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fwandergis%2Fcoordtransform "https://github.com/wandergis/coordtransform")等。

### 总结

上述效果看着比较一般，其实只要在上面的基础上稍微加一点瓦片的淡出动画，效果就会好很多，目前一般都是使用`canvas`来渲染`2D`地图，如果自己实现动画不太方便，也有一些强大的`canvas`库可以选择，笔者最后使用[Konva.js](https://link.juejin.cn/?target=https%3A%2F%2Fkonvajs.org%2F "https://konvajs.org/")库重做了一版，加入了瓦片淡出动画，最终效果如下：

![whbm.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/725ab970c4ea411db86822bb74c797dc~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

另外只要搞清楚各个地图的瓦片规则，就能稍加修改支持更多的地图瓦片：

![whbm.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c66f520fca824bc1aa12fc572b71e479~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

具体实现限于篇幅不再展开，有兴趣的可以阅读本文源码。

本文详细的介绍了一个简单的`web`地图开发过程，上述实现原理仅是笔者的个人思路，不代表`openlayers`等框架的原理，因为笔者也是`GIS`的初学者，所以难免会有问题，或更好的实现，欢迎指出。

在线`demo`：[wanglin2.github.io/web\_map\_dem…](https://link.juejin.cn/?target=https%3A%2F%2Fwanglin2.github.io%2Fweb_map_demo%2F "https://wanglin2.github.io/web_map_demo/")

