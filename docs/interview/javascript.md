# JavaScript面试题

## 数据类型

### 1.数据类型有哪几种

JavaScript共有八种数据类型，分别是 **Undefined、Null、Boolean、Number、String、Object、Symbol、BigInt**。

其中 Symbol 和 BigInt 是ES6 中新增的数据类型：

- Symbol 代表创建后独一无二且不可变的数据类型，它主要是为了解决可能出现的全局变量冲突的问题。
- BigInt 是一种数字类型的数据，它可以表示任意精度格式的整数，使用 BigInt 可以安全地存储和操作大整数，即使这个数已经超出了 Number 能够表示的安全整数范围。

这些数据可以分为原始数据类型和引用数据类型：

- 栈：原始数据类型（Undefined、Null、Boolean、Number、String）
- 堆：引用数据类型（对象、数组和函数）

两种类型的区别在于**存储位置的不同：**

- 原始数据类型直接存储在栈（stack）中的简单数据段，占据空间小、大小固定，属于被频繁使用数据，所以放入栈中存储；
- 引用数据类型存储在堆（heap）中的对象，占据空间大、大小不固定。如果存储在栈中，将会影响程序运行的性能；引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。

堆和栈的概念存在于数据结构和操作系统内存中，在数据结构中：

- 在数据结构中，栈中数据的存取方式为先进后出。
- 堆是一个优先队列，是按优先级来进行排序的，优先级可以按照大小来规定。

在操作系统中，内存被分为栈区和堆区：

- 栈区内存由编译器自动分配释放，存放函数的参数值，局部变量的值等。其操作方式类似于数据结构中的栈。
- 堆区内存一般由开发着分配释放，若开发者不释放，程序结束时可能由垃圾回收机制回收。

#### symbol

##### 创建symbol

ES6新增了`Symbol`作为原始数据类型，和其他原始数据类型，像number、boolean、null、undefined、string，symbol类型没有文字形式。

创建一个symbol，我们要使用全局函数`Symbol()`

```javascript
let s = Symbol('foo');
```

`Symbol()` 函数每次调用会创建一个新的唯一值

```javascript
console.log(Symbol() === Symbol()); // false
```

`Symbol()` 函数接受一个`可选参数`作为描述，这样使Symbol更具有语义性

下面创建两个symbol分别为: `firstName` and `lastName`.

```javascript
let firstName = Symbol('first name');
let lastName = Symbol('last name');
```

当我们使用console.log()去打印symbol的时候会隐式调用symbol的toString()方法

```js
console.log(firstName); // Symbol(first name)
console.log(lastName); // Symbol(last name)
```

由于symbol为原始值，我们**可以使用`typeof`去检查它的类型**，同样ES6拓展了typeof关键字，在遇到symbol类型时会返回symbol

```js
console.log(typeof firstName); 
// symbol
```

由于是原始类型，也不能使用new去创建

```js
let s = new Symbol(); // error
```

##### 共享symbol

要创建一个共享的symbol，要使用`Symbol.for()`函数，而不是`Symbol()`。

`Symbol.for()` 也接受一个可选参数作为描述

```js
let ssn = Symbol.for('ssn');
```

`Symbol.for()` 会首先在全局中查找是否有已经创建的`ssn`的symbol，如果有就会返回已经创建的symbol，如果没有就会创建一个新的symbol。

接下来，我们创建一个相同的symbol，然后看看不是同一个symbol

```javascript
let nz = Symbol.for('ssn');
console.log(ssn === nz); // true
```

因为上面已经创建`ssn`的symbol，所以nz变量的symbol和上面创建的将是同一个。

如果想要获取symbol的键，使用Symbol.keyFor()方法

```javascript
console.log(Symbol.keyFor(nz)); // 'ssn'
```

注意，如果symbol是通过`Symbol()`创建的，使用`Symbol.keyFor()`会返回undefined

```javascript
let systemID = Symbol('sys');
console.log(Symbol.keyFor(systemID)); // undefined
```

##### Symbol应用

######  使用Symbol作唯一值

我们在代码中经常会用字符串或者数字去表示一些状态，也经常会面临缺乏语义性或者重复定义的问题，这时使用Symbol是最好的选择，每次新创建的Symbol都是唯一的，不会产生重复，而且我们可以给Symbol传入相应的描述。

看下面的例子，我们使用Symbol来表达订单的几种状态，而不是字符串和数字

```javascript
let statuses = {
    OPEN: Symbol('已下单'),
    IN_PROGRESS: Symbol('配送中'),
    COMPLETED: Symbol('订单完成'),
    CANCELED: Symbol('订单取消')
};

// 完成订单
task.setStatus(statuses.COMPLETED);
```

###### 使用 symbol 作为对象属性

使用`Symbol`作为属性名称

```javascript
let statuses = {
    OPEN: Symbol('已下单'),
    IN_PROGRESS: Symbol('配送中'),
    COMPLETED: Symbol('订单完成'),
    CANCELED: Symbol('订单取消')
};
let status = Symbol('status');

let task = {
    [status]: statuses.OPEN,
    description: '学习 ES6 Symbol'
};

console.log(task);
```

使用`Object.keys()`获取对象的所有可枚举属性

```javascript
console.log(Object.keys(task));
// ["description"]
```

使用`Object.getOwnPropertyNames()` 获取所有属性，无论是否是可枚举

```javascript
console.log(Object.getOwnPropertyNames(task));
// ["description"]
```

那么要获取对象中的Symbol属性，需要使用ES6新增的`Object.getOwnPropertySymbols()`方法

```javascript
console.log(Object.getOwnPropertySymbols(task));
//[Symbol(status)]
```

##### Symbol.iterator

`Symbol.iterator` 指定函数是否会返回对象的迭代器。

具有 `Symbol.iterator` 属性的对象称为可迭代对象。

在ES6中，Array、Set、Map和string都是可迭代对象。

ES6提供了for...of循环，它可以用在可迭代对象上。

```js
var numbers = [1, 2, 3];
for (let num of numbers) {
    console.log(num);
}
// 1
// 2
// 3
```

JavaScript引擎首先调用`numbers`数组的 `Symbol.iterator` 方法来获取迭代器对象，然后它调用 `iterator.next()` 方法并将迭代器对象的value属性复制到`num`变量中，3次迭代后，对象的`done `属性为`true`，循环推出

我们可以通过`Symbol.iterator`来获取数组的迭代器对象。

```js
var iterator = numbers[Symbol.iterator]();

console.log(iterator.next()); // Object {value: 1, done: false}
console.log(iterator.next()); // Object {value: 2, done: false}
console.log(iterator.next()); // Object {value: 3, done: false}
console.log(iterator.next()); // Object {value: undefined, done: true}
```

默认情况下，一个自己定义的集合是不可以迭代的，但是我们可以用Symbol.iterator使其可迭代

```js
class List {
  constructor() {
    this.elements = [];
  }

  add(element) {
    this.elements.push(element);
    return this;
  }

  *[Symbol.iterator]() {
    for (let element of this.elements) {
      yield element;
    }
  }
}

let chars = new List();
chars.add('A')
     .add('B')
     .add('C');

// 使用Symbol.iterator实现了迭代
for (let c of chars) {
  console.log(c);
}

// A
// B
// C
```



### 2.数据类型检测有哪几种方法

#### (1)typeof

```javascript
console.log(typeof 2);               // number
console.log(typeof true);            // boolean
console.log(typeof 'str');           // string

console.log(typeof function(){});    // function
console.log(typeof []);              // object    
console.log(typeof {});              // object

console.log(typeof undefined);       // undefined
console.log(typeof null);            // object
```

其中**数组、对象、null**都会被判断为object，其他判断都正确。

`typeof null` 的结果是Object。

在 JavaScript 第一个版本中，所有值都存储在 32 位的单元中，每个单元包含一个小的 **类型标签(1-3 bits)** 以及当前要存储值的真实数据。类型标签存储在每个单元的低位中，共有五种数据类型：

如果最低位是 1，则类型标签标志位的长度只有一位；如果最低位是 0，则类型标签标志位的长度占三位，为存储其他四种数据类型提供了额外两个 bit 的长度。

有两种特殊数据类型：

- `undefined`的值是 (-2)^30(一个超出整数范围的数字)；
- `null` 的值是机器码 NULL 指针(null 指针的值全是 0)

那也就是说**null的类型标签也是000，和Object的类型标签一样，所以会被判定为Object**。

#### (2)instanceof

`instanceof`可以正确判断对象的类型，**其内部运行机制是判断在其原型链中能否找到该类型的原型**。

```javascript
console.log(2 instanceof Number);          // false
console.log(true instanceof Boolean);      // false 
console.log('str' instanceof String);      // false 
 
console.log([] instanceof Array);          // true
console.log(function(){} instanceof Function); // true
console.log({} instanceof Object);            // true
```

可以看到，`instanceof`**只能正确判断引用数据类型**，而不能判断基本数据类型。`instanceof` 运算符可以用来测试一个对象在其原型链中是否存在一个构造函数的 `prototype` 属性。

`instanceof` 运算符用于判断构造函数的 `prototype` 属性是否出现在对象的原型链中的任何位置。

```javascript
function myInstanceof(left, right) {
  // 获取对象的原型
  let proto = Object.getPrototypeOf(left)
  // 获取构造函数的 prototype 对象
  let prototype = right.prototype; 
  // 判断构造函数的 prototype 对象是否在对象的原型链上
  while (true) {
    if (!proto) return false;
    if (proto === prototype) return true;
    // 如果没有找到，就继续从其原型上找，Object.getPrototypeOf方法用来获取指定对象的原型
    proto = Object.getPrototypeOf(proto);
  }
}
```

#### (3) constructor

```javascript
console.log((2).constructor === Number); // true
console.log((true).constructor === Boolean); // true
console.log(('str').constructor === String); // true
console.log(([]).constructor === Array); // true
console.log((function() {}).constructor === Function); // true
console.log(({}).constructor === Object); // true
```

`constructor`有两个作用，一是判断数据的类型，二是对象实例通过 `constrcutor` 对象访问它的构造函数。需要注意，如果创建一个对象来改变它的原型，`constructor`就不能用来判断数据类型了：

```javascript
function Fn(){};
 
Fn.prototype = new Array();
 
var f = new Fn();
 
console.log(f.constructor===Fn);    // false
console.log(f.constructor===Array); // true
```

#### (4)Object.prototype.toString.call()

`Object.prototype.toString.call()` 使用 Object 对象的原型方法 toString 来判断数据类型：

```javascript
var a = Object.prototype.toString;
 
console.log(a.call(2));              // [object Number]
console.log(a.call(true));           //[object Boolean]
console.log(a.call('str'));		    //[object String]
console.log(a.call([]));		    //[object Array]
console.log(a.call(function(){}));   //[object Function] 
console.log(a.call({}));		    //[object Object]
console.log(a.call(undefined));		//[object Undefined]
console.log(a.call(null));		    //[object Null]
```

同样是检测对象obj调用toString方法，`obj.toString()`的结果和`Object.prototype.toString.call(obj)`的结果不一样，这是为什么？

这是因为toString是Object的原型方法，而Array、function等**类型作为Object的实例，都重写了toString方法**。**不同的对象类型调用toString方法时，根据原型链的知识，调用的是对应的重写之后的toString方法**（function类型返回内容为函数体的字符串，Array类型返回元素组成的字符串…），而不会去调用Object上原型toString方法（返回对象的具体类型），所以采用obj.toString()不能得到其对象类型，只能将obj转换为字符串类型；因此，在想要得到对象的具体类型时，应该调用Object原型上的toString方法。

### 3.判断数组方法有哪些

- 通过`Object.prototype.toString.call()`做判断

```javascript
Object.prototype.toString.call(obj).slice(8,-1) === 'Array';
```

- 通过原型链做判断

```javascript
obj.__proto__ === Array.prototype;
```

- 通过ES6的`Array.isArray()`做判断

```javascript
Array.isArrray(obj);
```

- 通过`instanceof`做判断

```javascript
obj instanceof Array
```

- 通过`Array.prototype.isPrototypeOf`

```javascript
Array.prototype.isPrototypeOf(obj)
```

### 4.null和undefined区别

首先 Undefined 和 Null 都是基本数据类型，**这两个基本数据类型分别都只有一个值，就是 undefined 和 null。**

undefined 代表的含义是**未定义**，null 代表的含义是**空对象**。一般变量声明了但还没有定义的时候会返回 undefined，null主要用于赋值给一些可能会返回对象的变量，作为初始化。

undefined 在 JavaScript 中不是一个保留字，这意味着可以使用 undefined 来作为一个变量名，但是这样的做法是非常危险的，它会影响对 undefined 值的判断。我们可以通过一些方法获得安全的 undefined 值，比如说 void 0。

当对这两种类型使用 typeof 进行判断时，Null 类型化会返回 “object”，这是一个历史遗留的问题。**当使用双等号对两种类型的值进行比较时会返回 true，使用三个等号时会返回 false。**

### 5.  0.1+0.2!==0.3为什么，怎么解决

在开发过程中遇到类似这样的问题：

```javascript
let n1 = 0.1, n2 = 0.2
console.log(n1 + n2)  // 0.30000000000000004
```

这里得到的不是想要的结果，要想等于0.3，就要把它进行转化：

```javascript
(n1 + n2).toFixed(2) // 注意，toFixed为四舍五入
```

`toFixed(num)` 方法可把 Number 四舍五入为指定小数位数的数字。

计算机是通过二进制的方式存储数据的，所以计算机计算0.1+0.2的时候，实际上是计算的两个数的二进制的和。

在 JavaScript 中只有一种数字类型：Number，它的实现遵循IEEE 754标准，使用**64位固定长度**来表示，也就是标准的double双精度浮点数。在二进制科学表示法中，双精度浮点数的**小数部分最多只能保留52位**，再加上前面的1，其实就是保留53位有效数字，剩余的需要舍去，遵从“0舍1入”的原则

**双精度数是保存**： ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cb225cf71d748a8b2d6a5615e402711~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

- 第一部分（蓝色）：用来存储符号位（sign），用来区分正负数，0表示正数，**占用1位**
- 第二部分（绿色）：用来存储指数（exponent），**占用11位**
- 第三部分（红色）：用来存储小数（fraction），**占用52位**

对于0.1，它的二进制为：

```javascript
0.00011001100110011001100110011001100110011001100110011001 10011...
```

转为科学计数法（科学计数法的结果就是浮点数）：

```javascript
1.1001100110011001100110011001100110011001100110011001*2^-4
```

可以看出0.1的符号位为0，指数位为-4，小数位为：

```javascript
1001100110011001100110011001100110011001100110011001
```

IEEE标准规定了一个偏移量，对于指数部分，每次都加这个偏移量进行保存，这样即使指数是负数，那么加上这个偏移量也就是正数了。由于JavaScript的数字是双精度数，这里就以双精度数为例，它的指数部分为11位，能表示的范围就是0~2047，IEEE固定**双精度数的偏移量为1023**

- 当指数位不全是0也不全是1时(规格化的数值)，IEEE规定，**阶码**计算公式为 e-Bias。 此时e最小值是1，则1-1023= -1022，e最大值是2046，则2046-1023=1023，可以看到，这种情况下取值范围是`-1022~1013`。
- 当指数位全部是0的时候(非规格化的数值)，IEEE规定，阶码的计算公式为1-Bias，即1-1023= -1022。
- 当指数位全部是1的时候(特殊值)，IEEE规定这个浮点数可用来表示3个特殊值，分别是正无穷，负无穷，NaN。 具体的，小数位不为0的时候表示NaN；小数位为0时，当符号位s=0时表示正无穷，s=1时候表示负无穷。

对于上面的0.1的指数位为-4，-4+1023 = 1019 转化为二进制就是：`1111111011`.

所以，0.1表示为：

```javascript
0 1111111011 1001100110011001100110011001100110011001100110011001
```

实现0.1+0.2=0.3,一个直接的解决方法就是设置一个误差范围，通常称为“机器精度”。对JavaScript来说，这个值通常为2-52，在ES6中，提供了`Number.EPSILON`属性，而它的值就是2^-52，只要判断`0.1+0.2-0.3`是否小于`Number.EPSILON`，如果小于，就可以判断为0.1+0.2 ===0.3

```javascript
function numberepsilon(arg1,arg2){                   
  return Math.abs(arg1 - arg2) < Number.EPSILON;        
}        
console.log(numberepsilon(0.1 + 0.2, 0.3)); // true
```



### 6.类型转换规则，字符怎么进行拼接

首先我们要知道，在 `JS` 中类型转换只有三种情况，分别是：

- 转换为布尔值
- 转换为数字
- 转换为字符串

> 首先我们要知道，在 `JS` 中类型转换只有三种情况，分别是：

- 转换为布尔值
- 转换为数字
- 转换为字符串

![img](https://poetries1.gitee.io/img-repo/2020/07/1.png)

**转Boolean**

> 在条件判断时，除了 `undefined`，`null`， `false`， `NaN`， `''`， `0`， `-0`，其他所有值都转为 `true`，包括所有对象

**对象转原始类型**

> 对象在转换类型的时候，会调用内置的 `[[ToPrimitive]]` 函数，对于该函数来说，算法逻辑一般来说如下

- 如果已经是原始类型了，那就不需要转换了
- 调用 `x.valueOf()`，如果转换为基础类型，就返回转换的值
- 调用 `x.toString()`，如果转换为基础类型，就返回转换的值
- 如果都没有返回原始类型，就会报错

> 当然你也可以重写 `Symbol.toPrimitive`，该方法在转原始类型时调用优先级最高。

```js
let a = {
  valueOf() {
    return 0
  },
  toString() {
    return '1'
  },
  [Symbol.toPrimitive]() {
    return 2
  }
}
1 + a // => 3
```

**四则运算符**

> 它有以下几个特点：

- 运算中其中一方为字符串，那么就会把另一方也转换为字符串
- 如果一方不是字符串或者数字，那么会将它转换为数字或者字符串

```js
1 + '1' // '11'
true + true // 2
4 + [1,2,3] // "41,2,3"
```

- 对于第一行代码来说，触发特点一，所以将数字 `1` 转换为字符串，得到结果 `'11'`
- 对于第二行代码来说，触发特点二，所以将 `true` 转为数字 `1`
- 对于第三行代码来说，触发特点二，所以将数组通过 `toString`转为字符串 `1,2,3`，得到结果 `41,2,3`
- 那么对于除了加法的运算符来说，只要其中一方是数字，那么另一方就会被转为数字

```js
4 * '3' // 12
4 * [] // 0
4 * [1, 2] // NaN
```

**比较运算符**

- 如果是对象，就通过 `toPrimitive` 转换对象
- 如果是字符串，就通过 `unicode` 字符索引来比较

```js
let a = {
  valueOf() {
    return 0
  },
  toString() {
    return '1'
  }
}
a > -1 // true
```

> 在以上代码中，因为 `a` 是对象，所以会通过 `valueOf` 转换为原始类型再比较值

------

## Js基础

### 1.内置对象有哪些

JS中对象分为3类：

- 自定义对象：属于ECMAScript
- 内置对象：属于ECMAScript，`Math`、`Date`、`Array`、`String`。
- 浏览器对象：JS独有的，JS API学习

#### Math对象

Math不是构造函数，不需要new来调用，直接使用里面的属性和方法。

#### Math常用内置属性和方法

| 属性/方法             | 描述                                                         |
| --------------------- | ------------------------------------------------------------ |
| Math.PI               | 圆周率                                                       |
| Math.floor()          | 向下取整                                                     |
| Math.ceil()           | 向上取整                                                     |
| Math.round()          | 四舍五入，其他数字都是四舍五入，只有5是往大了取 -1.1→-1 -1.5→-1 |
| Math.abs()            | 绝对值                                                       |
| Math.max()/Math.min() | 求最大和最小值                                               |
| Math.random()         | 返回一个随机小数[0,1)                                        |

#### 日期对象

Date()对象是一个构造函数，必须使用new来调用创建我们的日期对象，即为需要**实例化**后才能使用。

- 如果没有输入任何参数，则Date的构造器会依据系统设置的当前时间来创建一个Date对象。

#### 日期格式化

| 方法名        | 说明                   |
| ------------- | ---------------------- |
| getFullyear() | 获取当年               |
| getMonth()    | 获取当月 0~11 要+1     |
| getDate()     | 获取当前日期           |
| getDay()      | 获取星期几 周日0~周六6 |
| getHours()    | 获取当前小时           |
| getMinutes()  | 获取当前分钟           |
| getSeconds    | 获取当前秒钟           |

#### 字符串对象

> **字符串里面的值不可变**，虽然看上去可以**改变内容**，但其实是**地址变了**，内存中新开辟了一个内存空间。

```JavaScript
var str = 'abc';
str = 'hello';
//当重新给 str 赋值的时候，常量'abc'不会被修改，依然在内存中。
//由于字符串不可变，在大量拼接字符串的时候会有效率问题：
var str = '';
for(var i = 0; i < 100000 ;i++){
    str += i;
}
console.log(str);//这个结果需要花费大量时间来显示，因为需要不断开辟新的空间
//所以不要大量地对字符串重新赋值或者拼接字符串
```

**常用方法**

字符串所有方法，都不会修改字符串本身，操作完成会返回一个新的字符串。

| 方法名                               | 说明                                               |
| ------------------------------------ | -------------------------------------------------- |
| indexOf('要查找的字符',[开始的位置]) | 返回指定内容在元字符串中的位置，如果找不到就返回-1 |
| lastIndexOf()                        | 从后往前找，只找第一个匹配的                       |

| 方法名            | 说明                                                |
| ----------------- | --------------------------------------------------- |
| charAt(index)     | 返回指定位置的字符                                  |
| charCodeAt(index) | 获取指定位置处的ASCll码                             |
| str[index]        | 获取指定位置处的字符 HTML5, IE8+支持 和charAt()等效 |

| 方法名                                 | 说明               |
| -------------------------------------- | ------------------ |
| replace('被替换的字符','替换为的字符') | 只会替换第一个字符 |
| split('分隔符')                        | 字符转换为数组     |

#### 正则对象

 [`RegExp 参考`](https://www.w3school.com.cn/jsref/jsref_obj_regexp.asp)

RegExp 对象表示正则表达式，它是对字符串执行模式匹配的强大工具

直接量语法

```
/pattern/attributes
```

 创建 RegExp 对象的语法：

```
new RegExp(pattern, attributes)
```

**参数 *pattern*** 是一个字符串，指定了正则表达式的模式或其他正则表达式。

参数 *attributes* 是一个可选的字符串，包含属性 "g"、"i" 和 "m"，分别用于指定全局匹配、区分大小写的匹配和多行匹配。ECMAScript 标准化之前，不支持 m 属性。如果 *pattern* 是正则表达式，而不是字符串，则必须省略该参数

**返回值**一个新的 RegExp 对象，具有指定的模式和标志。如果参数 *pattern* 是正则表达式而不是字符串，那么 RegExp() 构造函数将用与指定的 RegExp 相同的模式和标志创建一个新的 RegExp 对象。

如果不用 new 运算符，而将 RegExp() 作为函数调用，那么它的行为与用 new 运算符调用时一样，只是当 *pattern* 是正则表达式时，它只返回 *pattern*，而不再创建一个新的 RegExp 对象

##### RegExp 对象方法

| 方法                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [compile](https://www.w3school.com.cn/jsref/jsref_regexp_compile.asp) | 编译正则表达式。                                             |
| [exec](https://www.w3school.com.cn/jsref/jsref_exec_regexp.asp) | 检索字符串中指定的值。返回找到的值，并确定其位置。 ans=reg.exec(str)   ans[0]为匹配的全部字符串   ans[1]...ans[n]为分组捕获的字符 |
| [test](https://www.w3school.com.cn/jsref/jsref_test_regexp.asp) | 检索字符串中指定的值。返回 true 或 false。     reg.test(str) |



##### 支持正则表达式的 String 对象的方法

| 方法                                                         | 描述                             |
| :----------------------------------------------------------- | :------------------------------- |
| [search](https://www.w3school.com.cn/jsref/jsref_search.asp) | 检索与正则表达式相匹配的值。     |
| [match](https://www.w3school.com.cn/jsref/jsref_match.asp)   | 找到一个或多个正则表达式的匹配。 |
| [replace](https://www.w3school.com.cn/jsref/jsref_replace.asp) | 替换与正则表达式匹配的子串。     |
| [split](https://www.w3school.com.cn/jsref/jsref_split.asp)   | 把字符串分割为字符串数组。       |

#### 基本包装类型（基本类型的包装对象）

> 三个简单的数据类型：String、Number、Boolean。**基本包装类型**就是把简单的数据类型包装成复杂数据类型，这样基本数据类型就有了属性和方法。

实际使用中，调用方法，**不需要使用**`new Number/String/Boolean`，使用基础类型的时候，js 会自动帮我们包装成对应的对象：

### 2.怎么判断对象属于哪个类

### 3.for in和for of有什么区别

它们两者都可以用于遍历，不过`for in`遍历的是数组的索引（`index`），而`for of`遍历的是数组元素值（`value`）

#### for in

`for in`更适合遍历对象，当然也可以遍历数组,但是存在一些问题

`index`索引为字符串型数字，不能直接进行几何运算

```js
var arr = [1,2,3]
    
for (let index in arr) {
  let res = index + 1
  console.log(res)
}
//01 11 21
```

使用`for in`会遍历数组所有的可枚举属性，包括原型，如果不想遍历原型方法和属性的话，可以在循环内部判断一下，使用`hasOwnProperty()`方法可以判断某属性是不是该对象的实例属性

`hasOwnProperty()` 方法会返回一个布尔值，指示对象自身属性中是否具有指定的属性（也就是，是否有指定的键）。

#### for of

`for of`遍历的是数组元素值，而且`for of`遍历的只是数组内的元素，不包括原型属性和索引

`for of`适用遍历数/数组对象/字符串/`map`/`set`等拥有迭代器对象（`iterator`）的集合，但是不能遍历对象，因为没有迭代器对象，但如果想遍历对象的属性，你可以用`for in`循环（这也是它的本职工作）或用内建的`Object.keys()`方法

```javascript
var myObject={
　　a:1,
　　b:2,
　　c:3
}
for (var key of Object.keys(myObject)) {
  console.log(key + ": " + myObject[key]);
}
//a:1 b:2 c:3
```

#### 总结

**for in遍历的是数组的索引（即键名），而for of遍历的是数组元素值**

**for in总是得到对象的key或数组、字符串的下标**

**for of总是得到对象的value或数组、字符串的值**

### 4.怎么确定嵌套对象深度



### 5.什么是DOM和BOM  各有什么对象和方法

#### DOM

DOM, (**D**ocument **O**bject **M**odel, 文档对象模型)是文档内容（HTML或XML）在编程语言上的抽象模型，它建模了文档的内容和结构，并提供给编程语言一套完整的操纵文档的API

**站在浏览器方面的看法**：**DOM是根据文档建模出来的一个树形模型，即是DOM树**

DOM的分层节点一般被称作是DOM树，树中的所有节点都可以通过脚本语言例如JS进行访问，所有HTMlL元素节点都可以被创建、添加或者删除。

在DOM分层节点中，页面就是用分层节点图表示的。

- 整个文档是一个文档节点，就想是树的根一样。
- 每个HTML元素都是元素节点。
- HTML元素内的文本就是文本节点。
- 每个HTML属性时属性节点。

当咱们访问一个web页面时，浏览器会解析每个HTML元素，创建了HTML文档的虚拟结构，并将其保存在内存中。接着，HTML页面被转换成树状结构，每个HTML元素成为一个叶子节点，连接到父分支

结构的顶部有一个`document`，也称为根元素，它包含另一个元素：`html`, 每个`HTML`元素都来自`Element`

#### document 和 window 之间的区别

简单来说，`document`是`window`的一个对象属性。`window` 对象表示浏览器中打开的窗口。如果文档包含框架（`frame` 或 `iframe` 标签），浏览器会为 HTML 文档创建一个 `window` 对象，并为每个框架创建一个额外的 `window` 对象。所有的全局函数和对象都属于 `window` 对象的属性和方法。

`window` 指窗体。`document`指页面。`document`是`window`的一个子对象。

用户不能改变 `document.location`(因为这是当前显示文档的位置)。但是,可以改变`window.location` (用其它文档取代当前文档)`window.location`本身也是一个对象,而`document.location`不是对象。

**document**接口有许多实用方法，比如`querySelector()`，它是用于查找给定页面内**HTML**元素的方法：

```js
document.querySelector('h1');
```

`window`表示当前的浏览器，下面代码与上面等价：

```js
window.document.querySelector('h1');
```

当然，更常见的是用第一种方式。

**window是一个全局对象**，可以从浏览器中运行的任何JS代码直接访问。 `window`暴露了很多属性和方法，如：

```js
window.alert('Hello world'); // Shows an alert
window.setTimeout(callback, 3000); // Delay execution
window.fetch(someUrl); // make XHR requests
window.open(); // Opens a new tab
window.location; // Browser location
window.history; // Browser history
window.navigator; // The actual user agent
window.document; // The current page
```

因为这些属性和方法也是全局的，所以也可以这样访问它们

```js
alert('Hello world'); // Shows an alert
setTimeout(callback, 3000); // Delay execution
fetch(someUrl); // make XHR requests
open(); // Opens a new tab
location; // Browser location
history; // Browser history
navigator; // The actual user agent
document;// The current page
```

#### DOM 常用方法

#### 获取节点

```js
// 通过id号来获取元素，返回一个元素对象
document.getElementById(idName) 
      
// 通过name属性获取id号，返回元素对象数组 
document.getElementsByName(name)  
   
// 通过class来获取元素，返回元素对象数组
document.getElementsByClassName(className)   

// 通过标签名获取元素，返回元素对象数组
document.getElementsByTagName(tagName)       
```

#### 获取/设置元素的属性值：

```js
// 括号传入属性名，返回对应属性的属性值
element.getAttribute(attributeName)

// 传入属性名及设置的值
element.setAttribute(attributeName,attributeValue)
```

#### 创建节点Node

```js
// 创建一个html元素，这里以创建h3元素为例
document.createElement("h3")

// 创建一个文本节点；
document.createTextNode(String);

// 创建一个属性节点，这里以创建class属性为例
document.createAttribute("class");
```

#### 增添节点

```js
// 往element内部最后面添加一个节点，参数是节点类型
element.appendChild(Node);

// 在element内部的中在existingNode前面插入newNode
elelment.insertBefore(newNode,existingNode); 
```

#### 删除节点

```js
//删除当前节点下指定的子节点，删除成功返回该被删除的节点，否则返回null
element.removeChild(Node)
```

#### DOM 操作

DOM中的每个HTML元素也是一个节点，可以像这样查找节点：

```js
document.querySelector('h1').nodeType;
```

上面会返回`1`，它是`Element`类型的节点的标识符，还可以检查节点名称：

```js
document.querySelector('h1').nodeName;
```

上面的示例返回大写的节点名。但是需要理解的最重要的概念是，咱们主要使用DOM中的两种类型的节点：

- 元素节点
- 文本节点

创建元素节点，可以通过 `createElement`方法：

```js
var heading = document.createElement('h1');
```

创建文本节点，可能通过 `createTextNode` 方法：

```js
var text = document.createTextNode('Hello world');
```

接着将两个节点组合在一起，然后添加到 `body` 上：

```js
var heading = document.createElement('h1');
var text = document.createTextNoe('Hello world');
heading.appendChild(text);
document.body.appendChild(heading)
```



#### BOM

浏览器对象模型（BOM，Browser Object Model），是使用 JavaScript 开发 Web 应用程序的核心。

是实现 Web 开发与浏览器之间互相操作的基础。

BOM主要包含五个基础对象：

```js
1. window：表示浏览器实例
2. location：加载文档的信息和常用导航功能实例
3. navigator：客户端标识和信息的对象实例
4. screen：客户端显示器信息
5. history：当前窗口建立以来的导航历史记录
```

#### window 对象

BOM 的核心对象，有两个身份：ES中的全局作用域和浏览器窗口的JavaScript接口。

##### global 全局作用域

在全局作用于下，所有使用 `var` 声明的变量和函数都会成为 `window` 对象的属性和方法。并且浏览器API 和 多数构造函数 都会以 `window` 对象的属性。不同浏览器 `window` 对象的属性可能不同。

##### 窗口关系

`window` 对象的 `top` 属性始终指向最外层的窗口，及浏览器窗口本身。

`window` 对象的 `parent` 属性始终指向当前窗口的父窗口，如果当前窗口就是最外层窗口，则top` 等于 `parent

`window` 对象的 `self` 属性始终指向自身。

##### 窗口属性

包含窗口位置、大小、像素比等。

```javascript
window.screenLeft // 窗口相对于屏幕左侧的距离, number (单位 px)
window.screenTop  // 窗口相对于屏幕顶部的距离, number (单位 px)

window.moveTo(x, y) // 移动到 (x, y) 坐标对应的新位置
window.moveBy(x, y) // 相对当前位置在两个方向上分别移动 x/y 个像素的距离
```

浏览器窗口大小不好确认，但是可以用 `document.documentElement.clientWidth` 和 `document.documentElement.clientHeight` 来确认可视窗口的大小。

> 移动浏览器中  `document.documentElement.clientWidth` 和 `document.documentElement.clientHeight` 返回的通常是实际渲染的页面的大小，而可视窗口可能只能显示一部分内容。

调整窗口大小可以使用 `resizeTo()` 和 `resizeBy()` 两个方法。

```javascript
// 缩放到 100×100
window.resizeTo(100, 100);
// 缩放到 200×150
window.resizeBy(100, 50);
// 缩放到 300×300
window.resizeTo(300, 300);
```

##### 视口位置

浏览器窗口尺寸通常无法满足完整显示整个页面，为此用户可以通过滚动在有限的视口中查看文档。

度量文档相对于视口滚动距离的属性有两对，返回相等的值：`window.pageXoffset/window.scrollX` 和 `window.pageYoffset/window.scrollY`。

可以使用 `scroll()` 、`scrollTo()` 和 `scrollBy()` 方法滚动页面。

```javascript
// 相对于当前视口向下滚动 100 像素
window.scrollBy(0, 100);
// 相对于当前视口向右滚动 40 像素
window.scrollBy(40, 0);
// 滚动到页面左上角
window.scrollTo(0, 0);
```

这几个方法也都接收一个 `ScrollToOptions` 字典，除了提供偏移值，还可以通过 `behavior` 属性告诉浏览器是否平滑滚动。

```javascript
// 正常滚动
window.scrollTo({
    left: 100,
    top: 100,
    behavior: 'auto'
});
// 平滑滚动
window.scrollTo({
    left: 100,
    top: 100,
    behavior: 'smooth'
});
```

##### 导航与跳转

`window.open()` 方法可以用于导航到指定 URL，也可以用于打开新浏览器窗口。这个方法接收 4个参数：要加载的 URL、目标窗口、特性字符串和表示新窗口在浏览器历史记录中是否替代当前加载页面的布尔值。

#####  定时器

`setTimeout()` 超时任务：等待一段时间之后再执行内部的代码，会返回一个超时ID

`setInterval()` 定时任务：每隔一段时间执行一次内部的代码，会返回一个定时ID

`clearTimeout()` 清除指定/所有超时任务。

`clearInterval()` 清除指定/所有定时任务。

``setTimeout()` 和 `setInterval()` 都接收两个参数：要执行的代码（函数）和等待 / 间隔时间（毫秒）。

> 所有超时任务都会在全局作用域中的一个匿名函数中执行，因此函数中所有的 this 指向都是 `window`(严格模式下是 `undefined`) 。如果定义 `setTimeout` 的时候传入的是一个**箭头函数**，则会保留原来的 this 指向。

`setTimeout` 可以不记录超时ID，因为它会在满足条件（执行定义时传入的函数时）自动停止，再次定义时会重新定义一个超时任务。

```javascript
let num = 0;
let max = 10;
let incrementNumber = function() {
    num++;
    // 如果还没有达到最大值，再设置一个超时任务
    if (num < max) {
    	setTimeout(incrementNumber, 500);
    } else {
    	alert("Done");
    }
}
setTimeout(incrementNumber, 500);
```

`setInterval()` 会在被销毁之前一直按照定义的间隔时间一直执行，而不会在意定义时传入的函数的执行状态。

> 如果 `setInterval()` 定义时传入的函数时一个异步请求 `Promise`，则异步请求后的回调函数执行顺序可能不会按照预想顺序执行。所以这种情况推荐使用超时任务 `setTimeout()` 而非 `setInterval()`。

####  history 对象

浏览器导航历史记录及相关操作的对象。

##### 导航

`history` 对象提供了三个方法和一个属性来查看和操作历史记录（当前窗口）。

```javascript
// 跳转到最近的 xxx 页面
history.go("xxx");
ry.back();

// 前进一页
history.forward()
```

`go()` 方法会接收一个**字符串**或者**整数**参数，传入整数时，正整数表示前进多少页，负整数表示后退多少页；传入字符串时，会匹配含有该字符串的最近的一条历史记录对应的网址，如果没有找到则不会发生变化。

`history` 提供一个 `length` 属性，可以用来查看当前窗口的历史记录数量。

##### 历史状态管理

1. `hashchange` 事件：页面 URL 的散列变化时被触发
2. `history.pushState()` 方法：接收 3 个参数：一个 state 对象、一个新状态的标题和一个（可选的）相对 URL
3. `popstate` 事件（在 `window` 对象上）：后退时触发
4. `history.state` 属性：当前的历史记录状态
5. `history.replaceState()` 方法：接收与 `pushState()` 一样的前两个参数来更新状态



####  location 对象

`location` 是最有用的 BOM 对象之一，提供了当前窗口中加载文档的信息，以及通常的导航功能。

> 它既是 `window` 的属性，也是 `document` 的属性。即 `window.location` 和 `document.location` 指向同一个对象。

| 属性                  | 值                                                           | 说明                                     |
| --------------------- | ------------------------------------------------------------ | ---------------------------------------- |
| `location.hash`       | "#contents"                                                  | URL 散列值（井号后跟零或多个字符）可为空 |
| `location.host`       | "[www.wrox.com:80](https://link.juejin.cn?target=http%3A%2F%2Fwww.wrox.com%3A80)" | 服务器名及端口号                         |
| `location.hostname`   | "[www.wrox.com](https://link.juejin.cn?target=http%3A%2F%2Fwww.wrox.com)" | 服务器名                                 |
| `location.href`       | "[www.wrox.com:80/WileyCDA/?q…](https://link.juejin.cn?target=http%3A%2F%2Fwww.wrox.com%3A80%2FWileyCDA%2F%3Fq%3Djavascript%23contents)" | 完整 URL 字符串                          |
| `location.pathname`   | "/WileyCDA/"                                                 | URL 中的路径和（或）文件名               |
| `location.port`       | "80"                                                         | 请求端口号                               |
| `location.protocol`   | "http:"                                                      | 页面使用的协议                           |
| `location.search`     | "?q=javascript"                                              | 查询字符串，以问号开头                   |
| `location.username`   | "foouser"                                                    | 域名前指定的用户名                       |
| `location.password`   | "barpassword"                                                | 域名前指定的密码                         |
| `location.haoriginsh` | "[www.wrox.com](https://link.juejin.cn?target=http%3A%2F%2Fwww.wrox.com)" | 源地址，只读                             |

修改浏览器地址可以通过四种方式来修改：

1. `location.assign()`
2. `location.replace()`
3. `location.href = newLocation`
4. `window.location = newLocation`

其中 `location.href` 和 `window.location` 都会在内部显式调用 `location.assign()` 方法，并且向浏览器历史记录中增加一条记录。点击浏览器 "后退" 按钮可以回到上页。

而 `location.replace()` 可以直接修改地址重载页面，而不会向历史记录中插入数据，也无法返回上页。

另外 `location` 还提供了一个 `reload()` 方法，用来重载当前页面

#### navigator 对象

客服端标识浏览器的标准，主要用来记录和检测浏览器与设备的主要信息，也可以让脚本注册和查询自己的一些活动（插件）。

| 属性            | 说明                                        |
| :-------------- | :------------------------------------------ |
| `appCodeName`   | 返回浏览器的代码名                          |
| `appName`       | 返回浏览器的名称                            |
| `appVersion`    | 返回浏览器的平台和版本信息                  |
| `cookieEnabled` | 返回指明浏览器中是否启用 cookie 的布尔值    |
| `platform`      | 返回运行浏览器的操作系统平台                |
| `userAgent`     | 返回由客户机发送服务器的user-agent 头部的值 |

#### screen 对象

单纯的保存客服端能力的对象。包含以下属性：

| 属性          | 说明                                       |
| ------------- | ------------------------------------------ |
| `availHeight` | 屏幕像素高度减去系统组件高度，只读         |
| `availLeft`   | 没有被系统组件占用的屏幕的最左侧像素，只读 |
| availTop      | 没有被系统组件占用的屏幕的最顶端像素，只读 |
| availWidth    | 屏幕像素宽度减去系统组件宽度，只读         |
| colorDepth    | 表示屏幕颜色的位数，只读                   |
| height        | 屏幕像素高度                               |
| left          | 当前屏幕左边的像素距离                     |
| pixelDepth    | 屏幕的位深，只读                           |
| top           | 当前屏幕顶端的像素距离                     |
| width         | 屏幕像素宽度                               |
| orientation   | 返回 Screen Orientation API 中屏幕的朝向   |



### 6.什么是事件捕获 委托(代理) 冒泡

![image.png](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/13/172ac58c0d58cc61~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

元素事件响应在DOM树中是从顶层的Window开始“流向”目标元素，然后又从目标元素“流向”顶层的Window

通常，我们将这种事件流向分为三个阶段：**捕获阶段，目标阶段，冒泡阶段**。

捕获阶段是指事件响应从最外层的Window开始，逐级向内层前进，直到具体事件目标元素。在捕获阶段，不会处理响应元素注册的冒泡事件。

目标阶段指触发事件的最底层的元素，如上图中的。

冒泡阶段与捕获阶段相反，事件的响应是从最底层开始一层一层往外传递到最外层的Window。

DOM事件流的三个阶段是**先捕获阶段，然后是目标阶段，最后才是冒泡阶段**。

**事件代理就是利用事件冒泡或事件捕获的机制把一系列的内层元素事件绑定到外层元素**

通过事件代理，我们可以将多个事件监听器减少为一个，这样就减少代码的重复编写了



实际操作中，我们可以通过 element.addEventListener() 设置一个元素的事件模型为冒泡事件或者捕获事件。
先来看一下 addEventListener 函数的语法：

```js
element.addEventListener(type, listener, useCapture)
```

- type
  监听事件类型的字符串
- listener
  事件监听回调函数，即事件触发后要处理的函数
- useCapture
  默认值false，表示事件冒泡；设为true时，表示事件捕获

事件冒泡由内到外，事件捕获由外到内

我们将上述的代码a,b,c三个元素都注册捕获和冒泡事件，并以元素c作为触发事件的主体，即事件流中的目标阶段。

```js
<div id="a" style="width: 100%; height: 300px;background-color: antiquewhite;">
	a
	<div id="b" style="width: 100%; height: 200px;background-color: burlywood;">
		b
		<div id="c" style="width: 100%; height: 100px;background-color: cornflowerblue;">
			c
		</div>
	</div>
</div>
<script>
	var a = document.getElementById('a')
	var b = document.getElementById('b')
	var c = document.getElementById('c')
	a.addEventListener('click', () => {console.log("冒泡a")})
	b.addEventListener('click', () => {console.log('冒泡b')})
	c.addEventListener('click', () => {console.log("冒泡c")})
	a.addEventListener('click', () => {console.log("捕获a")}, true)
	b.addEventListener('click', () => {console.log('捕获b')}, true)
	c.addEventListener('click', () => {console.log("捕获c")}, true)
</script>
捕获a
捕获b
捕获c
冒泡c
冒泡b
冒泡a
```

a,b,c三个元素都是先注册冒泡事件再注册捕获事件，从执行结果可以看到，a,b,c两个元素的事件响应都是先捕获后冒泡的


对于非目标元素，如果我们要先执行冒泡事件再执行捕获事件，我们可以在注册监听器时通过暂缓执行捕获事件，等冒泡事件执行完之后，在执行捕获事件。

对于上述的列表元素，我们希望将用户点击了哪个item打印出来

```js
<ul id="item-list"> 
    <li>item1</li>
    <li>item2</li>
    <li>item3</li> 
    <li>item4</li>
</ul>       
var items = document.getElementById('item-list');
//事件捕获实现事件代理
items.addEventListener('click', (e) => {console.log('捕获：click ',e.target.innerHTML)}, true);
//事件冒泡实现事件代理
items.addEventListener('click', (e) => {console.log('冒泡：click ',e.target.innerHTML)}, false);

```

#### 总结

**DOM事件流有3个阶段：捕获阶段，目标阶段，冒泡阶段；三个阶段的顺序为：捕获阶段——目标阶段——冒泡阶段；**

**对于非目标阶段的元素，事件响应执行顺序遵循先捕获后冒泡的原则；通过暂缓执行捕获事件，可以达到先冒泡后捕获的效果；**

**对于目标元素，事件响应执行顺序根据的事件的执行顺序执行；**

**事件捕获是从顶层的Window逐层向内执行，事件冒泡则相反；**

**事件委托（事件代理）是根据事件冒泡或事件捕获的机制来实现的。**

Window对象是直接面向用户的，那么用户触发一个事件，如点击事件，肯定是用window对象开始的，所以自然就是先捕获后冒泡

### 7.数组怎么创建？有哪些方法？ 怎么遍历？

#### 1.数组特点

ECMAScript数组跟其他语言的数组一样，都是一组有序的数据，但跟其他语言不同的是，数组中每个槽位可以存储任意类型的数据。除此之外，ECMAScript数组的长度也是动态的，会随着数据的增删而改变。

数组是被等分为许多小块的连续内存段，每个小块都和一个整数关联，可以通过这个整数快速访问对应的小块。除此之外，数组拥有一个length属性，该属性表示的并不是数组元素的数量，而是指数组元素的最高序号加1

#### 2. 数组创建

数组的创建方式有以下两种。

##### （1）字面量

最常用的创建数组的方式就是**数组字面量，**数组元素的类型可以是任意的，如下：

```javascript
let colors = ["red", [1, 2, 3], true];  
```

##### （2）构造函数

使用构造函数创建数组的形式如下：

```javascript
let array = new Array(10);   // [undefined × 10]    new可省略
```

##### （3）ES6 构造器

鉴于数组的常用性，ES6 专门扩展了数组构造器 Array ，新增了 2 个方法：Array.of和Array.from。Array.of 用得比较少，Array.from 具有很强的灵活性。

###### **1）Array.of**

Array.of 用于**将参数依次转化为数组项**，然后返回这个新数组。它基本上与 Array 构造器功能一致，唯一的区别就在单个数字参数的处理上。

比如，在下面的代码中，可以看到：当参数为2个时，返回的结果是一致的；当参数是一个时，Array.of 会把参数变成数组里的一项，而构造器则会生成长度和第一个参数相同的空数组：

Array.of 用于**将参数依次转化为数组项**，然后返回这个新数组。它基本上与 Array 构造器功能一致，唯一的区别就在单个数字参数的处理上。

比如，在下面的代码中，可以看到：当参数为2个时，返回的结果是一致的；当参数是一个时，Array.of 会把参数变成数组里的一项，而构造器则会生成长度和第一个参数相同的空数组：

```javascript
Array.of(8.0); // [8]
Array(8.0); // [empty × 8]

Array.of(8.0, 5); // [8, 5]
Array(8.0, 5); // [8, 5]

Array.of('8'); // ["8"]
Array('8'); // ["8"]
```

###### **2）Array.from**

Array.from 的设计初衷是快速基于其他对象创建新数组，准确来说就是**从一个类似数组的可迭代对象中创建一个新的数组实例**。其实，只要一个对象有迭代器，Array.from 就能把它变成一个数组（注意：该方法会返回一个的数组，不会改变原对象）。

从语法上看，Array.from 有 3 个参数：

- 类似数组的对象，必选；
- 加工函数，新生成的数组会经过该函数的加工再返回；
- this 作用域，表示加工函数执行时 this 的值。

这三个参数里面第一个参数是必选的，后两个参数都是可选的：

```javascript
var obj = {0: 'a', 1: 'b', 2:'c', length: 3};

Array.from(obj, function(value, index){
  console.log(value, index, this, arguments.length);
  return value.repeat(3);   //必须指定返回值，否则返回 undefined
}, obj);
```

结果如图：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/49720500532943c1816b0459131bd3ce~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

以上结果表明，通过 Array.from 这个方法可以自定义加工函数的处理方式，从而返回想要得到的值；如果不确定返回值，则会返回 undefined，最终生成的是一个包含若干个 undefined 元素的空数组。

实际上，如果这里不指定 this，加工函数就可以是一个箭头函数。上述代码可以简写为以下形式。

```javascript
Array.from(obj, (value) => value.repeat(3));
//  控制台打印 (3) ["aaa", "bbb", "ccc"]
```

除了上述 obj 对象以外，拥有迭代器的对象还包括 String、Set、Map 等，`Array.from` 都可以进行处理：

```javascript
// String
Array.from('abc');                             // ["a", "b", "c"]
// Set
Array.from(new Set(['abc', 'def']));           // ["abc", "def"]
// Map
Array.from(new Map([[1, 'ab'], [2, 'de']]));   // [[1, 'ab'], [2, 'de']]
```

#### 3.数组索引

在数组中，我们可以通过使用数组的索引来获取数组的值：

```javascript
let colors = new Array("red", "blue", "green");  
console.log(array[1])  // blue
```

如果指定的索引值小于数组的元素数，就会返回存储在相应位置的元素，也可以通过这种方式来设置一个数组元素的值。如果设置的索引值大于数组的长度，那么就会将数组长度扩充至该索引值加一。

数组长度length的独特之处在于，他不是只读的。通过length属性，可以在数组末尾增加删除元素：

```javascript
let colors = new Array("red", "blue", "green");  
colors.length = 2
console.log(colors[2])  // undefined

colors.length = 4
console.log(colors[3])  // undefined
```

数组长度始终比数组最后一个值的索引大1，这是因为索引值都是从0开始的

#### 4.数组方法

改变原数组的方法：fill()、pop()、push()、shift()、splice()、unshift()、reverse()、sort()；

不改变原数组的方法：concat()、every()、filter()、find()、findIndex()、forEach()、indexOf()、join()、lastIndexOf()、map()、reduce()、reduceRight()、slice()、some。

##### 1.复制和填充方法

###### （1）fill()

使用fill()方法可以向一个已有数组中插入全部或部分相同的值，开始索引用于指定开始填充的位置，它是可选的。如果不提供结束索引，则一直填充到数组末尾。如果是负值，则将从负值加上数组的长度而得到的值开始。该方法的语法如下：

```javascript
array.fill(value, start, end)
```

其参数如下：

- value：必需。填充的值；
- start：可选。开始填充位置；
- end：可选。停止填充位置 (默认为 *array*.length)。

###### （2）copyWithin()

copyWithin()方法会按照指定范围来浅复制数组中的部分内容，然后将它插入到指定索引开始的位置，开始与结束索引的计算方法和fill方法一样。该方法的语法如下：

```javascript
array.copyWithin(target, start, end)
```

其参数如下：

- target：必需。复制到指定目标索引位置；
- start：可选。元素复制的起始位置；
- end：可选。停止复制的索引位置 (默认为 *array*.length)。如果为负值，表示倒数。

##### 2. 转化方法

###### （1）toString()

toString()方法返回的是由数组中每个值的等效字符串拼接而成的一**个逗号分隔的字符串**，也就是说，对数组的每个值都会调用toString()方法，以得到最终的字符串：

```javascript
let colors = ["red", "blue", "green"];  
console.log(colors.toString())  // red,blue,green
```

###### （2）valueOf()

valueOf()方法返回的是数组本身，如下面代码：

```javascript
let colors = ["red", "blue", "green"];  
console.log(colors.valueOf())  // ["red", "blue", "green"]
```

###### （3）toLocaleString()

toLocaleString()方法可能会返回和toString()方法相同的结果，但也不一定。在调用toLocaleString()方法时会得到一个逗号分隔的数组值的字符串，它与toString()方法的区别是，为了得到最终的字符串，会调用每个值的toLocaleString()方法，而不是toString()方法，看下面的例子：

```javascript
let array= [{name:'zz'}, 123, "abc", new Date()];
let str = array.toLocaleString();
console.log(str); // [object Object],123,abc,2016/1/5 下午1:06:23
//可以进行千分位格式转换
let num=12345678;
console.log(num.toLocaleString()); // 12,345,678
```

需要注意，如果数组中的某一项是null或者undefined，则在调用上述三个方法后，返回的结果中会以空字符串来表示。

###### 4）join()

join() 方法用于把数组中的所有元素放入一个字符串。元素是通过指定的分隔符进行分隔的。其使用语法如下：

```javascript
arrayObject.join(separator)
```

其中参数separator是可选的，用来指定要使用的分隔符。如果省略该参数，则使用逗号作为分隔符。

该方法返回一个字符串。该字符串是通过把 arrayObject 的每个元素转换为字符串，然后把这些字符串连接起来，在两个元素之间插入 separator 字符串而生成的。

使用示例如下：

```javascript
let array = ["one", "two", "three","four", "five"];
console.log(array.join());      // one,two,three,four,five
console.log(array.join("-"));   // one-two-three-four-five
```

##### 3. 栈方法

###### （1）push()

push()方法可以接收任意数量的参数，并将它们添加了数组末尾，并返回数组新的长度。**该方法会改变原数组。** 其语法形式如下：

```javascript
arrayObject.push(newelement1,newelement2,....,newelementX)
```

使用示例如下：

```javascript
let array = ["football", "basketball",  "badminton"];
let i = array.push("golfball");
console.log(array); // ["football", "basketball", "badminton", "golfball"]
console.log(i);     // 4
```

###### （2）pop()

pop() 方法用于删除并返回数组的最后一个元素。它没有参数。**该方法会改变原数组。** 其语法形式如下：

```javascript
arrayObject.pop()
```

使用示例如下：

```javascript
let array = ["cat", "dog", "cow", "chicken", "mouse"];
let item = array.pop();
console.log(array); // ["cat", "dog", "cow", "chicken"]
console.log(item);  // mouse
```

##### 4. 队列方法

###### （1）shift()

shift()方法会删除数组的第一项，并返回它，然后数组长度减一，**该方法会改变原数组。** 语法形式如下：

```javascript
arrayObject.shift()
```

使用示例如下：

```javascript
let array = [1,2,3,4,5];
let item = array.shift();
console.log(array); // [2,3,4,5]
console.log(item);  // 1
```

注意：如果数组是空的，那么 shift() 方法将不进行任何操作，返回 undefined 值。

###### （2）unshift()

unshift()方法可向数组的开头添加一个或更多元素，并返回新的长度。**该方法会改变原数组。** 其语法形式如下：

```javascript
arrayObject.unshift(newelement1,newelement2,....,newelementX)
```

使用示例如下：

```javascript
let array = ["red", "green", "blue"];
let length = array.unshift("yellow");
console.log(array);  // ["yellow", "red", "green", "blue"]
console.log(length); // 4
```

#### 5. 排序方法

###### （1）sort()

sort()方法是我们常用给的数组排序方法，该方法会在原数组上进行排序，会改变原数组，其使用语法如下：

```javascript
arrayObject.sort(sortby)
```

其中参数sortby是可选参数，用来规定排序顺序，它是一个比较函数，用来判断哪个值应该排在前面。默认情况下，sort()方法会按照升序重新排列数组元素。为此，sort()方法会在每一个元素上调用String转型函数，然后比较字符串来决定顺序，即使数组的元素都是数值，也会将数组元素先转化为字符串在进行比较、排序。这就造成了排序不准确的情况，如下代码：

```javascript
let array = [5, 4, 3, 2, 1];
let array2 = array.sort();
console.log(array2)  // [1, 2, 3, 4, 5]

let array = [0, 1, 5, 10, 15];
let array2 = array.sort();
console.log(array2)  //  [0, 1, 10, 15, 5]
复制代码
```

可以看到，上面第二段代码就出现了问题，虽然5是小于10的，但是字符串10在5的前面，所以10还是会排在5前面，因此可知，在很多情况下，不添加参数是不行的。

对于sort()方法的参数，它是一个比较函数，它接收两个参数，如果第一个参数应该排在第二个参数前面，就返回-1；如果两个参数相等，就返回0；如果第一个参数应该排在第二个参数后面，就返回1。一个比较函数的形式可以如下：

```javascript
function compare(value1, value2) {
	if(value1 < value2){
  	return -1
  } else if(value1 > value2){
  	return 1
  } else{
  	return 0
  }
}

let array = [0, 1, 5, 10, 15];
let array2 = array.sort(compare);
console.log(array2)  // [0, 1, 5, 10, 15]
```

使用箭头函数来定义：

```javascript
let array = [0, 1, 5, 10, 15];

let array2 = array.sort((a, b) => a - b);  // 正序排序
console.log(array2)  // [0, 1, 5, 10, 15]

let array3 = array.sort((a, b) => b - a);  // 倒序排序
console.log(array3)  // [15, 10, 5, 1, 0]
```

###### （2）reverse()

reverse() 方法用于颠倒数组中元素的顺序。该方法会改变原来的数组，而不会创建新的数组。其使用语法如下：

```javascript
arrayObject.reverse()
```

使用示例如下：

```javascript
let array = [1,2,3,4,5];
let array2 = array.reverse();
console.log(array);   // [5,4,3,2,1]
console.log(array2 === array);   // true
```

#### 6. 操作方法

对于数组，还有很多操作方法，下面我们就来看看常用的concat()、slice()、splice()方法。

##### （1）concat()

concat() 方法用于连接两个或多个数组。该方法不会改变现有的数组，而仅仅会返回被连接数组的一个副本。其适用语法如下：

```javascript
arrayObject.concat(arrayX,arrayX,......,arrayX)
```

其中参数arrayX是必需的。该参数可以是具体的值，也可以是数组对象。可以是任意多个。

使用示例如下：

```javascript
let array = [1, 2, 3];
let array2 = array.concat(4, [5, 6], [7, 8, 9]);
console.log(array2); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
console.log(array);  // [1, 2, 3], 可见原数组并未被修改
```

该方法还可以用于数组扁平化

##### （2）slice()

slice() 方法可从已有的数组中返回选定的元素。返回一个新的数组，包含从 start 到 end （不包括该元素）的数组元素。方法并不会修改数组，而是返回一个子数组。其使用语法如下：

```javascript
arrayObject.slice(start,end)
```

其参数如下：

- **start**：必需。规定从何处开始选取。如果是负数，那么它规定从数组尾部开始算起的位置。也就是说，-1 指最后一个元素，-2 指倒数第二个元素，以此类推；
- **end**：可选。规定从何处结束选取。该参数是数组片断结束处的数组下标。如果没有指定该参数，那么切分的数组包含从 start 到数组结束的所有元素。如果这个参数是负数，那么它规定的是从数组尾部开始算起的元素。

使用示例如下：

```javascript
let array = ["one", "two", "three", "four", "five"];
console.log(array.slice(0));    // ["one", "two", "three","four", "five"]
console.log(array.slice(2,3)); // ["three"]
复制代码
```

##### （3）splice()

splice()方法可能是数组中的最强大的方法之一了，使用它的形式有很多种，它会向/从数组中添加/删除项目，然后返回被删除的项目。该方法会改变原始数组。其使用语法如下：

```javascript
arrayObject.splice(index, howmany, item1,.....,itemX)
```

其参数如下：

- index：必需。整数，规定添加/删除项目的位置，使用负数可从数组结尾处规定位置。
- howmany：必需。要删除的项目数量。如果设置为 0，则不会删除项目。
- item1, ..., itemX：可选。向数组添加的新项目。

从上面参数可知，splice主要有三种使用形式：

- **删除：** 需要给splice()传递两个参数，即要删除的第一个元素的位置和要删除的元素的数量；
- **插入：** 需要给splice()传递至少三个参数，即开始位置、0（要删除的元素数量）、要插入的元素。
- **替换：** splice()方法可以在删除元素的同事在指定位置插入新的元素。同样需要传入至少三个参数，即开始位置、要删除的元素数量、要插入的元素。要插入的元素数量是任意的，不一定和删除的元素数量相等。

使用示例如下：

```javascript
let array = ["one", "two", "three","four", "five"];
console.log(array.splice(1, 2));           // 删除：["two", "three"]

let array = ["one", "two", "three","four", "five"];
console.log(array.splice(2, 0, 996));      // 插入：[]

let array = ["one", "two", "three","four", "five"];
console.log(array.splice(2, 1, 996));      // 替换：["three"]
```

#### 7. 归并方法

ECMAScript为数组提供了两个归并方法：reduce()和reduceRight()。下面就分别来看看这两个方法。

###### （1）reduce()

reduce() 方法对数组中的每个元素执行一个reducer函数(升序执行)，将其结果汇总为单个返回值。其使用语法如下：

```javascript
arr.reduce(callback,[initialValue])
```

reduce 为数组中的每一个元素依次执行回调函数，不包括数组中被删除或从未被赋值的元素，接受四个参数：初始值（或者上一次回调函数的返回值），当前元素值，当前索引，调用 reduce 的数组。 (1) `callback` （执行数组中每个值的函数，包含四个参数）

- previousValue （上一次调用回调返回的值，或者是提供的初始值（initialValue））
- currentValue （数组中当前被处理的元素）
- index （当前元素在数组中的索引）
- array （调用 reduce 的数组）

`initialValue` （作为第一次调用 callback 的第一个参数。）

```javascript
let arr = [1, 2, 3, 4]
let sum = arr.reduce((prev, cur, index, arr) => {
    console.log(prev, cur, index);
    return prev + cur;
})
console.log(arr, sum);  
```

输出结果如下：

```javascript
1 2 1
3 3 2
6 4 3
[1, 2, 3, 4] 10
```

再来加一个初始值看看：

```javascript
let arr = [1, 2, 3, 4]
let sum = arr.reduce((prev, cur, index, arr) => {
    console.log(prev, cur, index);
    return prev + cur;
}, 5)
console.log(arr, sum);  
```

输出结果如下：

```javascript
5 1 0
6 2 1
8 3 2
11 4 3
[1, 2, 3, 4] 15
```

通过上面例子，可以得出结论：**如果没有提供initialValue，reduce 会从索引1的地方开始执行 callback 方法，跳过第一个索引。如果提供initialValue，从索引0开始。**

注意，该方法如果添加初始值，就会改变原数组，将这个初始值放在数组的最后一位。

###### 使用 reduce 求和

arr = [1,2,3,4,5,6,7,8,9,10]，求和

```javascript
let arr = [1,2,3,4,5,6,7,8,9,10]
arr.reduce((prev, cur) => { return prev + cur }, 0)
```

arr = [1,2,3,[[4,5],6],7,8,9]，求和

```javascript
let arr = [1,2,3,4,5,6,7,8,9,10]
arr.flat(Infinity).reduce((prev, cur) => { return prev + cur }, 0)
```

arr = [{a:1, b:3}, {a:2, b:3, c:4}, {a:3}]，求和

```javascript
let arr = [{a:9, b:3, c:4}, {a:1, b:3}, {a:3}] 

arr.reduce((prev, cur) => {
    return prev + cur["a"];
}, 0)
```



###### （2）reduceRight()

该方法和的上面的`reduce()`用法几乎一致，只是该方法是对数组进行倒序查找的。而`reduce()`方法是正序执行的。

```javascript
let arr = [1, 2, 3, 4]
let sum = arr.reduceRight((prev, cur, index, arr) => {
    console.log(prev, cur, index);
    return prev + cur;
}, 5)
console.log(arr, sum);
```

输出结果如下：

```javascript
5 4 3
9 3 2
12 2 1
14 1 0
[1, 2, 3, 4] 15
```

#### 8. 搜索和位置方法

ECMAScript提供了两类搜索数组的方法：按照严格相等搜索和按照断言函数搜索。

###### （1）严格相等

ECMAScript通过了3个严格相等的搜索方法：indexOf()、lastIndexOf()、includes()。这些方法都接收两个参数：**要查找的元素和可选的其实搜索位置**。lastIndexOf()方法**会从数组结尾元素开始向前搜索**，其他两个方法则**会从数组开始元素向后进行搜索**。indexOf()和lastIndexOf()返回的是查找元素在**数组中的索引值**，如果没有找到，则**返回-1**。includes()方法会**返回布尔值**，表示是否**找到至少一个**与指定元素匹配的项。在比较第一个参数和数组的每一项时，会使用全等（===）比较，也就是说**两项必须严格相等**。

使用示例如下：

```javascript
let arr = [1, 2, 3, 4, 5];
console.log(arr.indexOf(2))      // 1
console.log(arr.lastIndexOf(3))  // 2
console.log(arr.includes(4))     // true
```

###### （2）断言函数

ECMAScript也允许按照定义的断言函数搜索数组，每个索引都会调用这个函数，断言函数的返回值决定了相应索引的元素是否被认为匹配。使用断言函数的方法有两个，分别是find()和findIndex()方法。这两个方法对于空数组，函数是不会执行的。并且没有改变数组的原始值。他们的都有三个参数：元素、索引、元素所属的数组对象，其中元素是数组中当前搜索的元素，索引是当前元素的索引，而数组是当前正在搜索的数组。

这两个方法都从数组的开始进行搜索，find()返回的是第一个匹配的元素，如果没有符合条件的元素返回 undefined；findIndex()返回的是第一个匹配的元素的索引，如果没有符合条件的元素返回 -1。

使用示例如下：

```javascript
let arr = [1, 2, 3, 4, 5]
arr.find(item => item > 2)      // 结果： 3
arr.findIndex(item => item > 2) // 结果： 2
```

#### 9. 迭代器方法

在ES6中，Array的原型上暴露了3个用于检索数组内容的方法：**keys()、values()、entries()**。keys()方法返回数组索引的迭代器，values()方法返回数组元素的迭代器，entries()方法返回索引值对的迭代器。

使用示例如下（因为这些方法**返回的都是迭代器**，所以可以将他们的内容通过**Array.from直接转化为数组实例**）：

```javascript
let array = ["one", "two", "three", "four", "five"];
console.log(Array.from(array.keys()))     // [0, 1, 2, 3, 4]
console.log(Array.from(array.values()))   // ["one", "two", "three", "four", "five"]
console.log(Array.from(array.entries()))  // [[0, "one"], [1, "two"], [2, "three"], [3, "four"], [4, "five"]]
```

#### 10. 迭代方法

ECMAScript为数组定义了5个迭代方法，分别是every()、filter()、forEach()、map()、some()。这些方法**都不会改变原数组**。这五个方法都**接收两个参数**：以每一项为参数运行的函数和可选的作为函数运行上下文的作用域对象（影响函数中的this值）。传给每个方法的函数接收三个参数，分别是当前元素、当前元素的索引值、当前元素所属的数对象。

##### （1）forEach()

`forEach` 方法用于**调用数组的每个元素**，并将**元素传递给回调函数**。该方法没有返回值，使用示例如下：

```javascript
let arr = [1,2,3,4,5]
arr.forEach((item, index, arr) => {
  console.log(index+":"+item)
})
```

该方法还可以有**第二个参数**，用来**绑定回调函数内部this变量**（回调函数不能是箭头函数，因为箭头函数没有this）：

```javascript
let arr = [1,2,3,4,5]
let arr1 = [9,8,7,6,5]
arr.forEach(function(item, index, arr){
  console.log(this[index])  //  9 8 7 6 5
}, arr1)
```

##### （2）map()

`map()` 方法会返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值。该方法按照原始数组元素顺序依次处理元素。该方法不会对空数组进行检测，它会返回一个新数组，**不会改变原始数组**。使用示例如下：

```javascript
let arr = [1, 2, 3];
 
arr.map(item => {
    return item+1;
})
// 结果： [2, 3, 4]
```

第二个参数用来绑定参数函数内部的this变量：

```javascript
var arr = ['a', 'b', 'c'];
 
[1, 2].map(function (e) {
    return this[e];
}, arr)
 // 结果： ['b', 'c']
```

该方法可以进行链式调用：

```javascript
let arr = [1, 2, 3];
 
arr.map(item => item+1).map(item => item+1)
 // 结果： [3, 4, 5]
```

**forEach和map区别如下：**

- forEach()方法：会针对**每一个元素执行提供的函数**，对数据的操作会改变原数组，该方法**没有返回值**；
- map()方法：不会改变原数组的值，**返回一个新数组**，**新数组中的值为原数组调用函数处理之后的值**；

##### （3）filter()

`filter()`方法用于**过滤数组**，满足条件的元素会被返回。它的参数是**一个回调函数**，所有数组元素依次执行该函数，**返回结果为true的元素**会被返回。该方法会**返回一个新的数组，不会改变原数组**。

```javascript
let arr = [1, 2, 3, 4, 5]
arr.filter(item => item > 2) 
// 结果：[3, 4, 5]
```

可以使用`filter()`方法来移除数组中的undefined、null、NAN等值

```javascript
let arr = [1, undefined, 2, null, 3, false, '', 4, 0]
arr.filter(Boolean)
// 结果：[1, 2, 3, 4]
```

##### （4）every()

该方法会对数组中的**每一项进行遍历**，**只有所有元素都符合条件时**，才返回true，否则就返回false。

```javascript
let arr = [1, 2, 3, 4, 5]
arr.every(item => item > 0) 
// 结果： true
```

##### （5）some()

该方法会对数组中的每一项进行遍历，只要有一个元素符合条件，就返回true，否则就返回false。

```javascript
let arr = [1, 2, 3, 4, 5]
arr.some(item => item > 4) 
// 结果： true
```



#### 11.其他方法

除了上述方法，遍历数组的方法还有for...in和for...of。下面就来简单看一下。

##### （1）for…in

`for…in` 主要用于对数组或者对象的属性进行循环操作。循环中的代码每执行一次，就会对对象的属性进行一次操作。其使用语法如下：

```javascript
for (var item in object) {
  执行的代码块
}
```

其中两个参数：

- item：必须。指定的变量可以是数组元素，也可以是对象的属性。
- object：必须。指定迭代的的对象。

使用示例如下：

```javascript
const arr = [1, 2, 3]; 
 
for (var i in arr) { 
    console.log('键名：', i); 
    console.log('键值：', arr[i]); 
}
```

输出结果如下：

```javascript
键名： 0
键值： 1
键名： 1
键值： 2
键名： 2
键值： 3
```

需要注意，该方法**不仅会遍历当前的对象所有的可枚举属性，还会遍历其原型链上的属性。** 除此之外，该方法遍历数组时候，遍历出来的是数组的索引值，遍历对象的时候，遍历出来的是键值名。

##### （2）for...of

`for...of` 语句创建一个循环来迭代可迭代的对象。在 ES6 中引入的 `for...of` 循环，以替代 `for...in` 和 `forEach()` ，并支持新的迭代协议。`for...of` 允许遍历 Arrays（数组）, Strings（字符串）, Maps（映射）, Sets（集合）等可迭代的数据结构等。

语法：

```javascript
for (var item of iterable) {
    执行的代码块
}
```

其中两个参数：

- item：每个迭代的属性值被分配给该变量。
- iterable：一个具有可枚举属性并且可以迭代的对象。

该方法允许获取对象的键值：

```javascript
var arr = ['a', 'b', 'c', 'd'];
for (let a in arr) {
  console.log(a); // 0 1 2 3
}
for (let a of arr) {
  console.log(a); // a b c d
}
```

该方法只会遍历当前对象的属性，不会遍历其原型链上的属性。

**注意：**

- for...of适用遍历 **数组/ 类数组/字符串/map/set** 等拥有迭代器对象的集合；
- 它可以正确响应break、continue和return语句；
- for...of循环不支持遍历普通对象，因为没有迭代器对象。如果想要遍历一个对象的属性，可以用`for-in`循环。

**总结，for…of 和for…in的区别如下：**

- for…of 遍历获取的是对象的**键值**，for…in 获取的是对象的**键名**；
- for… in 会遍历对象的整个原型链，性能非常差不推荐使用，而 for … of 只遍历当前对象不会遍历原型链；
- 对于数组的遍历，for…in 会返回数组中所有可枚举的属性(包括原型链上可枚举的属性)，for…of 只返回数组的下标对应的属性值；

##### （3）flat()

在ES2019中，flat()方法用于创建并返回一个新数组，这个新数组包含与它调用flat()的数组相同的元素，只不过其中任何本身也是数组的元素会被打平填充到返回的数组中：

```javascript
[1, [2, 3]].flat()   // [1, 2, 3]
[1, [2, [3, 4]]].flat()   // [1, 2, [3, 4]]
```

在不传参数时，flat()默认只会打平一级嵌套，如果想要打平更多的层级，就需要传给flat()一个数值参数，这个参数表示要打平的层级数：

```javascript
[1, [2, [3, 4]]].flat(2)   // [1, 2, 3, 4]
```

### 8.字符串方法



![js字符串方法](https://s2.loli.net/2022/05/23/DESIaFZQtyH3viU.jpg)

#### 1. 获取字符串长度

JavaScript中的字符串有一个length属性，该属性可以用来获取字符串的长度：

```javascript
const str = 'hello';
str.length   // 输出结果：5
```

#### 2. 获取字符串指定位置的值

charAt()和charCodeAt()方法都可以通过索引来获取指定位置的值：

-   charAt() 方法获取到的是指定位置的字符；
-   charCodeAt()方法获取的是指定位置字符的Unicode值。

##### （1）charAt()

charAt() 方法可以返回指定位置的字符。其语法如下：

```javascript
string.charAt(index)
```

index表示字符在字符串中的索引值：

```javascript
const str = 'hello';
str.charAt(1)  // 输出结果：e 
```

我们知道，字符串也可以通过索引值来直接获取对应字符，那它和charAt()有什么区别呢？来看例子：

```javascript
const str = 'hello';
str.charAt(1)  // 输出结果：e 
str[1]         // 输出结果：e 
str.charAt(5)  // 输出结果：'' 
str[5]         // 输出结果：undefined
```

可以看到，当index的取值不在str的长度范围内时，str[index]会返回undefined，而charAt(index)会返回空字符串；除此之外，str[index]不兼容ie6-ie8，charAt(index)可以兼容。

##### （2）charCodeAt()

ASCII 编码    0->48     A->65    a->97

`charCodeAt()`：该方法会返回指定索引位置字符的 Unicode 值 ，返回值是 0 - 65535 之间的整数，表示给定索引处的 UTF-16 代码单元，如果指定位置没有字符，将返回 **NaN**：

```javascript
let str = "abcdefg";
console.log(str.charCodeAt(1)); // "b" --> 98
```

通过这个方法，可以获取字符串中指定Unicode编码值范围的字符。比如，数字0～9的Unicode编码范围是: 48～57，可以通过这个方法来筛选字符串中的数字，当然如果你更熟悉正则表达式，会更方便

#### 3. 检索字符串是否包含特定序列

这5个方法都可以用来检索一个字符串中是否包含特定的序列。其中前两个方法得到的指定元素的索引值，并且只会返回第一次匹配到的值的位置。后三个方法返回的是布尔值，表示是否匹配到指定的值。

**注意：这5个方法都对大小写敏感！**

##### （1）indexOf()

`indexOf()`：查找某个字符，**有则返回第一次匹配到的位置**，否则返回-1，其语法如下：

```javascript
string.indexOf(searchvalue,fromindex)
```

该方法有两个参数：

-   searchvalue：必需，规定需检索的字符串值；
-   fromindex：可选的整数参数，规定在字符串中开始检索的位置。它的合法取值是 0 到 string.length - 1。如省略该，则从字符串的首字符开始检索。

```javascript
let str = "abcdefgabc";
console.log(str.indexOf("a"));   // 输出结果：0
console.log(str.indexOf("z"));   // 输出结果：-1
console.log(str.indexOf("c", 4)) // 输出结果：9
```

##### （2）lastIndexOf()

`lastIndexOf()`：查找某个字符，有则返回最后一次匹配到的位置，否则返回-1

```javascript
let str = "abcabc";
console.log(str.lastIndexOf("a"));  // 输出结果：3
console.log(str.lastIndexOf("z"));  // 输出结果：-1
```

该方法和indexOf()类似，只是查找的顺序不一样，indexOf()是正序查找，lastIndexOf()是逆序查找。

##### （3）includes()

`includes()`：该方法用于判断字符串是否包含指定的子字符串。如果找到匹配的字符串则返回 true，否则返回 false。该方法的语法如下：

```javascript
string.includes(searchvalue, start)
```

该方法有两个参数：

-   searchvalue：必需，要查找的字符串；
-   start：可选，设置从那个位置开始查找，默认为 0。

```javascript
let str = 'Hello world!';

str.includes('o')  // 输出结果：true
str.includes('z')  // 输出结果：false
str.includes('e', 2)  // 输出结果：false
```

##### （4）startsWith()

`startsWith()`：该方法用于检测字符串**是否以指定的子字符串开始**。如果是以指定的子字符串开头返回 true，否则 false。其语法和上面的includes()方法一样。

```javascript
let str = 'Hello world!';

str.startsWith('Hello') // 输出结果：true
str.startsWith('Helle') // 输出结果：false
str.startsWith('wo', 6) // 输出结果：true
```

##### （5）endsWith()

`endsWith()`：该方法用来判断当前字符串**是否是以指定的子字符串结尾**。如果传入的子字符串在搜索字符串的末尾则返回 true，否则将返回 false。其语法如下：

```javascript
string.endsWith(searchvalue, length)
```

该方法有两个参数：

-   searchvalue：必需，要搜索的子字符串；
-   length： 设置字符串的长度，默认值为原始字符串长度 string.length。

```javascript
let str = 'Hello world!';

str.endsWith('!')       // 输出结果：true
str.endsWith('llo')     // 输出结果：false
str.endsWith('llo', 5)  // 输出结果：true
```

可以看到，当第二个参数设置为5时，就会从字符串的前5个字符中进行检索，所以会返回true

#### 4. 连接多个字符串

concat() 方法用于连接两个或多个字符串。该方法不会改变原有字符串，会返回连接两个或多个字符串的新字符串。其语法如下：

```javascript
string.concat(string1, string2, ..., stringX)
```

其中参数 string1, string2, ..., stringX 是必须的，他们将被连接为一个字符串的一个或多个字符串对象。

```javascript
let str = "abc";
console.log(str.concat("efg"));          //输出结果："abcefg"
console.log(str.concat("efg","hijk")); //输出结果："abcefghijk"
```

虽然concat()方法是专门用来拼接字符串的，但是在开发中使用最多的还是加**操作符+**，因为其更加简单。

#### 5. 字符串分割成数组

split() 方法用于把一个字符串分割成字符串数组。该方法不会改变原始字符串。其语法如下：

```javascript
string.split(separator,limit)
```

该方法有两个参数：

-   separator：必需。字符串或正则表达式，从该参数指定的地方分割 string。
-   limit：可选。该参数可指定返回的数组的最大长度。如果设置了该参数，返回的子串不会多于这个参数指定的数组。如果没有设置该参数，整个字符串都会被分割，不考虑它的长度。

```javascript
let str = "abcdef";
str.split("c");    // 输出结果：["ab", "def"]
str.split("", 4)   // 输出结果：['a', 'b', 'c', 'd'] 
```

如果把空字符串用作 separator，那么字符串中的每个字符之间都会被分割。

```javascript
str.split("");     // 输出结果：["a", "b", "c", "d", "e", "f"]
```

其实在将字符串分割成数组时，可以同时拆分多个分割符，使用正则表达式即可实现：

```javascript
const list = "apples,bananas;cherries"
const fruits = list.split(/[,;]/)
console.log(fruits);  // 输出结果：["apples", "bananas", "cherries"]
```

#### 6. 截取字符串

substr()、substring()和 slice() 方法都可以用来截取字符串。

##### （1） slice()

slice() 方法用于提取字符串的某个部分，并以新的字符串返回被提取的部分。其语法如下：

```javascript
string.slice(start,end)
```

该方法有两个参数：

-   start：必须。 要截取的片断的起始下标，第一个字符位置为 0。如果为负数，则从尾部开始截取。
-   end：可选。 要截取的片段结尾的下标。若未指定此参数，则要提取的子串包括 start 到原字符串结尾的字符串。如果该参数是负数，那么它规定的是从字符串的尾部开始算起的位置。

上面说了，如果start是负数，则该参数规定的是从字符串的尾部开始算起的位置。也就是说，-1 指字符串的最后一个字符，-2 指倒数第二个字符，以此类推：

```javascript
let str = "abcdefg";
str.slice(1,6);   // 输出结果："bcdef" 
str.slice(1);     // 输出结果："bcdefg" 
str.slice();      // 输出结果："abcdefg" 
str.slice(-2);    // 输出结果："fg"
str.slice(6, 1);  // 输出结果：""
```

注意，该方法返回的子串**包括开始处的字符**，但**不包括结束处的字符**。

##### （2） substr()

substr() 方法用于在字符串中抽取从开始下标开始的指定数目的字符。其语法如下：

```javascript
string.substr(start,length)
```

该方法有两个参数：

-   start 必需。要抽取的子串的起始下标。必须是数值。如果是负数，那么该参数声明从字符串的尾部开始算起的位置。也就是说，-1 指字符串中最后一个字符，-2 指倒数第二个字符，以此类推。
-   length：可选。子串中的字符数。必须是数值。如果省略了该参数，那么返回从 stringObject 的开始位置到结尾的字串。

```javascript
let str = "abcdefg";
str.substr(1,6); // 输出结果："bcdefg" 
str.substr(1);   // 输出结果："bcdefg" 相当于截取[1,str.length-1]
str.substr();    // 输出结果："abcdefg" 相当于截取[0,str.length-1]
str.substr(-1);  // 输出结果："g"
```

##### （3） substring()

substring() 方法用于提取字符串中介于两个指定下标之间的字符。其语法如下：

```javascript
string.substring(from, to)
```

该方法有两个参数：

-   from：必需。一个非负的整数，规定要提取的子串的第一个字符在 string 中的位置。
-   to：可选。一个非负的整数，比要提取的子串的最后一个字符在 string 中的位置多 1。如果省略该参数，那么返回的子串会一直到字符串的结尾。

**注意：** 如果参数 from 和 to 相等，那么该方法返回的就是一个空串（即长度为 0 的字符串）。如果 from 比 to 大，那么该方法在提取子串之前会先交换这两个参数。并且该方法不接受负的参数，如果参数是个负数，就会返回这个字符串。

```javascript
let str = "abcdefg";
str.substring(1,6); // 输出结果："bcdef" [1,6)
str.substring(1);   // 输出结果："bcdefg" [1,str.length-1]
str.substring();    // 输出结果："abcdefg" [0,str.length-1]
str.substring(6,1); // 输出结果 "bcdef" [1,6)
str.substring(-1);  // 输出结果："abcdefg"
```

注意，该方法返回的子串**包括开始处的字符**，但**不包括结束处的字符**。

#### 7. 字符串大小写转换

toLowerCase() 和 toUpperCase()方法可以用于字符串的大小写转换。

##### （1）toLowerCase()

`toLowerCase()`：该方法用于把字符串转换为小写。

```javascript
let str = "adABDndj";
str.toLowerCase(); // 输出结果："adabdndj"
```

##### （2）toUpperCase()

`toUpperCase()`：该方法用于把字符串转换为大写。

```javascript
let str = "adABDndj";
str.toUpperCase(); // 输出结果："ADABDNDJ"
```

我们可以用这个方法来将字符串中第一个字母变成大写：

```javascript
let word = 'apple'
word = word[0].toUpperCase() + word.substr(1)
console.log(word) // 输出结果："Apple"
```

#### 8. 字符串模式匹配

replace()、match()和search()方法可以用来匹配或者替换字符。

##### （1）replace()

`replace()`：该方法用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。其语法如下：

```javascript
string.replace(searchvalue, newvalue)
```

该方法有两个参数：

-   searchvalue：必需。规定子字符串或要替换的模式的 RegExp 对象。如果该值是一个字符串，则将它作为要检索的直接量文本模式，而不是首先被转换为 RegExp 对象。
-   newvalue：必需。一个字符串值。规定了替换文本或生成替换文本的函数。

```javascript
let str = "abcdef";
str.replace("c", "z") // 输出结果：abzdef
```

执行一个全局替换, 忽略大小写:

```javascript
let str="Mr Blue has a blue house and a blue car";
str.replace(/blue/gi, "red");    // 输出结果：'Mr red has a red house and a red car'
```

**注意：** 如果 regexp 具有全局标志 g，那么 replace() 方法将替换所有匹配的子串。否则，它只替换第一个匹配子串。

##### （2）match()

`match()`：该方法用于在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。该方法类似 indexOf() 和 lastIndexOf()，但是它返回指定的值，而不是字符串的位置。其语法如下：

```javascript
string.match(regexp)
```

该方法的参数 regexp 是必需的，规定要匹配的模式的 RegExp 对象。如果该参数不是 RegExp 对象，则需要首先把它传递给 RegExp 构造函数，将其转换为 RegExp 对象。

**注意：** 该方法返回存放匹配结果的数组。该数组的内容依赖于 regexp 是否具有全局标志 g。

```javascript
let str = "abcdef";
console.log(str.match("c")) // ["c", index: 2, input: "abcdef", groups: undefined]
复制代码
```

##### （3）search()

`search()`方法用于检索字符串中指定的子字符串，或检索与正则表达式相匹配的子字符串。其语法如下：

```javascript
string.search(searchvalue)
```

该方法的参数 regex 可以是需要在 string 中检索的子串，也可以是需要检索的 RegExp 对象。

**注意：** 要执行忽略大小写的检索，请追加标志 i。该方法不执行全局匹配，它将忽略标志 g，也就是只会返回第一次匹配成功的结果。如果没有找到任何匹配的子串，则返回 -1。

**返回值：** 返回 str 中第一个与 regexp 相匹配的子串的起始位置。

```javascript
let str = "abcdef";
str.search(/bcd/)   // 输出结果：1
```

#### 9. 移除字符串收尾空白符

trim()、trimStart()和trimEnd()这三个方法可以用于移除字符串首尾的头尾空白符，空白符包括：空格、制表符 tab、换行符等其他空白符等。

##### （1）trim()

trim() 方法用于移除字符串首尾空白符，该方法不会改变原始字符串：

```javascript
let str = "  abcdef  "
str.trim()    // 输出结果："abcdef"
```

注意，该方法不适用于null、undefined、Number类型。

##### （2）trimStart()

trimStart() 方法的的行为与`trim()`一致，不过会返回一个**从原始字符串的开头删除了空白的新字符串**，不会修改原始字符串：

```javascript
const s = '  abc  ';

s.trimStart()   // "abc  "
```

##### （3）trimEnd()

trimEnd() 方法的的行为与`trim()`一致，不过会返回一个**从原始字符串的结尾删除了空白的新字符串**，不会修改原始字符串：

```javascript
const s = '  abc  ';

s.trimEnd()   // "  abc"
```

#### 10. 获取字符串本身

valueOf()和toString()方法都会返回字符串本身的值，感觉用处不大。

##### （1）valueOf()

`valueOf()`：返回某个字符串对象的原始值，该方法通常由 JavaScript 自动进行调用，而不是显式地处于代码中。

```javascript
let str = "abcdef"
console.log(str.valueOf()) // "abcdef"
```

##### （2）toString()

`toString()`：返回字符串对象本身

```javascript
let str = "abcdef"
console.log(str.toString()) // "abcdef"
```

#### 11. 重复一个字符串

repeat() 方法返回一个新字符串，表示将原字符串重复n次：

```javascript
'x'.repeat(3)     // 输出结果："xxx"
'hello'.repeat(2) // 输出结果："hellohello"
'na'.repeat(0)    // 输出结果：""
```

如果参数是小数，会向下取整：

```javascript
'na'.repeat(2.9) // 输出结果："nana"
```

如果参数是负数或者Infinity，会报错：

```javascript
'na'.repeat(Infinity)   // RangeError
'na'.repeat(-1)         // RangeError
```

如果参数是 0 到-1 之间的小数，则等同于 0，这是因为会先进行取整运算。0 到-1 之间的小数，取整以后等于-0，repeat视同为 0。

```javascript
'na'.repeat(-0.9)   // 输出结果：""
```

如果参数是NaN，就等同于 0：

```javascript
'na'.repeat(NaN)    // 输出结果：""
```

如果repeat的参数是字符串，则会先转换成数字。

```javascript
'na'.repeat('na')   // 输出结果：""
'na'.repeat('3')    // 输出结果："nanana"
```

#### 12. 补齐字符串长度

padStart()和padEnd()方法用于补齐字符串的长度。如果某个字符串不够指定长度，会在头部或尾部补全。

##### （1）padStart()

`padStart()`用于头部补全。该方法有两个参数，其中第一个参数是一个数字，表示字符串补齐之后的长度；第二个参数是用来补全的字符串。

如果原字符串的长度，等于或大于指定的最小长度，则返回原字符串：

```javascript
'x'.padStart(1, 'ab') // 'x'

```

如果用来补全的字符串与原字符串，两者的长度之和超过了指定的最小长度，则会截去超出位数的补全字符串：

```javascript
'x'.padStart(5, 'ab') // 'ababx'
'x'.padStart(4, 'ab') // 'abax'

```

如果省略第二个参数，默认使用空格补全长度：

```javascript
'x'.padStart(4) // '   x'

```

padStart()的常见用途是为数值补全指定位数，笔者最近做的一个需求就是将返回的页数补齐为三位，比如第1页就显示为001，就可以使用该方法来操作：

```javascript
"1".padStart(3, '0')   // 输出结果： '001'
"15".padStart(3, '0')  // 输出结果： '015'

```

##### （2）padEnd()

`padEnd()`用于尾部补全。该方法也是接收两个参数，第一个参数是字符串补全生效的最大长度，第二个参数是用来补全的字符串：

```javascript
'x'.padEnd(5, 'ab') // 'xabab'
'x'.padEnd(4, 'ab') // 'xaba'
```

#### 13. 字符串转为数字

parseInt()和parseFloat()方法都用于将字符串转为数字。

##### （1）parseInt()

parseInt() 方法用于可解析一个字符串，并返回一个整数。其语法如下：

```javascript
parseInt(string, radix)

```

该方法有两个参数：

-   string：必需。要被解析的字符串。
-   radix：可选。表示要解析的数字的基数。该值介于 2 ~ 36 之间。



当参数 radix 的值为 0，或没有设置该参数时，parseInt() 会根据 string 来判断数字的基数。

```javascript
parseInt("10");			  // 输出结果：10
parseInt("17",8);		  // 输出结果：15 (8+7)
parseInt("010");		  // 输出结果：10 或 8

```

当参数 radix 的值以 “0x” 或 “0X” 开头，将以 16 为基数：

```javascript
parseInt("0x10")      // 输出结果：16

```

如果该参数小于 2 或者大于 36，则 parseInt() 将返回 NaN：

```javascript
parseInt("50", 1)      // 输出结果：NaN
parseInt("50", 40)     // 输出结果：NaN

```

只有字符串中的第一个数字会被返回，当遇到第一个不是数字的字符为止:

```javascript
parseInt("40 4years")   // 输出结果：40

```

如果字符串的第一个字符不能被转换为数字，就会返回 NaN：

```javascript
parseInt("new100")     // 输出结果：NaN

```

字符串开头和结尾的空格是允许的：

```javascript
parseInt("  60  ")    // 输出结果： 60

```

##### （2）parseFloat()

parseFloat() 方法可解析一个字符串，并返回一个浮点数。该方法指定字符串中的首个字符是否是数字。如果是，则对字符串进行解析，直到到达数字的末端为止，然后以数字返回该数字，而不是作为字符串。其语法如下：

```javascript
parseFloat(string)

```

parseFloat 将它的字符串参数解析成为浮点数并返回。如果在解析过程中遇到了正负号（+ 或 -）、数字 (0-9)、小数点，或者科学记数法中的指数（e 或 E）以外的字符，则它会忽略该字符以及之后的所有字符，返回当前已经解析到的浮点数。同时参数字符串首位的空白符会被忽略。

```javascript
parseFloat("10.00")      // 输出结果：10.00
parseFloat("10.01")      // 输出结果：10.01
parseFloat("-10.01")     // 输出结果：-10.01
parseFloat("40.5 years") // 输出结果：40.5

```

如果参数字符串的第一个字符不能被解析成为数字，则 parseFloat 返回 NaN。

```javascript
parseFloat("new40.5")    // 输出结果：NaN
```

#### 14.编码生成字符

fromCharCode() 可接受一个指定的 Unicode 值，然后返回一个字符串

ASCII 编码    0->48     A->65    a->97

生成字符返回

`str=String.fromCharCode(64 + parseInt(m))`

**生成生成A~Z字母**

```js
getEN () {
      const arr = []
      for (let i = 65; i < 91; i++) {
        arr.push(String.fromCharCode(i))
      }
      return arr
}
```



### 9.类数组是什么，怎么转数组 ，arguments的应用

JavaScript 中一直存在一种类数组的对象，它们不能直接调用数组的方法，但是又和数组比较类似

主要有以下情况中的对象是类数组：

- 函数里面的参数对象 arguments；
- 用 getElementsByTagName/ClassName/Name 获得的 HTMLCollection；
- 用 querySelector 获得的 NodeList

#### 1. 类数组概述

##### （1）arguments

在日常开发中经常会遇到各种类数组对象，最常见的就是在函数中使用的 arguments，它的对象只定义在函数体中，包括了函数的参数和其他属性。先来看下 arguments 的使用方法：

```javascript
function foo(name, age, sex) {
    console.log(arguments);
    console.log(typeof arguments);
    console.log(Object.prototype.toString.call(arguments));
}
foo('jack', '18', 'male');
```

打印结果如下： ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e544ade128794a88a6583be9c2ff75b8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp) 可以看到，typeof 这个 arguments 返回的是 object，通过 Object.prototype.toString.call 返回的结果是 [object arguments]，而不是 [object array]，说明 arguments 和数组还是有区别的。

length 属性就是函数参数的长度。另外 arguments 还有一个 callee 属性，下面看看这个 callee 是干什么的：

```javascript
function foo(name, age, sex) {
    console.log(arguments.callee);
}

foo('jack', '18', 'male');
```

打印结果如下：

```javascript
ƒ foo(name, age, sex) {
    console.log(arguments.callee);
}
```

可以看出，输出的就是函数自身，如果在函数内部直接执行调用 callee，那它就会不停地执行当前函数，直到执行到内存溢出。

##### （2）HTMLCollection

HTMLCollection 简单来说是 HTML DOM 对象的一个接口，这个接口包含了获取到的 DOM 元素集合，返回的类型是类数组对象，如果用 typeof 来判断的话，它返回的是 object。它是及时更新的，当文档中的 DOM 变化时，它也会随之变化。

下面来 HTMLCollection 最后返回的是什么，在一个**有 form 表单**的页面中，在控制台中执行下述代码：

```javascript
var elem1, elem2;
// document.forms 是一个 HTMLCollection
elem1 = document.forms[0];
elem2 = document.forms.item(0);
console.log(elem1);
console.log(elem2);
console.log(typeof elem1);
console.log(Object.prototype.toString.call(elem1));
```

打印结果如下： ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f594359e4b8423bb5b09e3e7d4ba09f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

可以看到，这里打印出来了页面第一个 form 表单元素，同时也打印出来了判断类型的结果，说明打印的判断的类型和 arguments 返回的也比较类似，typeof 返回的都是 object，和上面的类似。

注意：HTML DOM 中的 HTMLCollection 是即时更新的，当其所包含的文档结构发生改变时，它会自动更新。

##### （3）NodeList

NodeList 对象是节点的集合，通常是由 querySlector 返回的。NodeList 不是一个数组，也是一种类数组。虽然 NodeList 不是一个数组，但是可以使用 for...of 来迭代。在一些情况下，NodeList 是一个实时集合，也就是说，如果文档中的节点树发生变化，NodeList 也会随之变化。

```javascript
var list = document.querySelectorAll('input[type=checkbox]');
for (var checkbox of list) {
  checkbox.checked = true;
}
console.log(list);
console.log(typeof list);
console.log(Object.prototype.toString.call(list));
```

打印结果如下： ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87ad9d211da14d56a2156c96b5df73ed~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

#### 2. 类数组应用场景

##### （1）遍历参数操作

在函数内部可以直接获取 arguments 这个类数组的值，那么也可以对于参数进行一些操作，比如下面这段代码可以将函数的参数默认进行求和操作：

```javascript
function add() {
    var sum =0,
        len = arguments.length;
    for(var i = 0; i < len; i++){
        sum += arguments[i];
    }
    return sum;
}
add()                            // 0
add(1)                           // 1
add(1，2)                        // 3
add(1,2,3,4);                    // 10
```

结合上面这段代码，在函数内部可以将参数直接进行累加操作，以达到预期的效果，参数多少也可以不受限制，根据长度直接计算，返回出最后函数的参数的累加结果，其他操作也类似。

##### （2）定义连接字符串函数

可以通过 arguments 这个例子定义一个函数来连接字符串。这个函数唯一正式声明了的参数是一个字符串，该参数指定一个字符作为衔接点来连接字符串。该函数定义如下：

```javascript
function myConcat(separa) {
  var args = Array.prototype.slice.call(arguments, 1);
  return args.join(separa);
}
myConcat(", ", "red", "orange", "blue");
// "red, orange, blue"
myConcat("; ", "elephant", "lion", "snake");
// "elephant; lion; snake"
myConcat(". ", "one", "two", "three", "four", "five");
// "one. two. three. four. five"
```

这段代码说明可以传递任意数量的参数到该函数，并使用每个参数作为列表中的项创建列表进行拼接。从这个例子中也可以看出，可以在日常编码中采用这样的代码抽象方式，把需要解决的这一类问题，都抽象成通用的方法，来提升代码的可复用性。

##### （3）传递参数

可以借助apply 或 call 与 arguments 相结合，将参数从一个函数传递到另一个函数：

```javascript
1. // 使用 apply 将 foo 的参数传递给 bar
2. function foo() {
3.     bar.apply(this, arguments);
4. }
5. function bar(a, b, c) {
6. console.log(a, b, c);
7. }
8. foo(1, 2, 3)   //1 2 3
```

上述代码中，通过在 foo 函数内部调用 apply 方法，用 foo 函数的参数传递给 bar 函数，这样就实现了借用参数的妙用。

#### 3. 类数组转为数组

#### （1）借用数组方法

类数组因为不是真正的数组，所以没有数组类型上自带的那些方法，所以就需要利用下面这几个方法去借用数组的方法。比如借用数组的 push 方法，代码如下：

```javascript
var arrayLike = { 
  0: 'java',
  1: 'script',
  length: 2
} 
Array.prototype.push.call(arrayLike, 'jack', 'lily'); 
console.log(typeof arrayLike); // 'object'
console.log(arrayLike);
// {0: "java", 1: "script", 2: "jack", 3: "lily", length: 4}
```

可以看到，arrayLike 其实是一个对象，模拟数组的一个类数组，从数据类型上说它是一个对象，新增了一个 length 的属性。还可以看出，用 typeof 来判断输出的是 object，它自身是不会有数组的 push 方法的，这里用 call 的方法来借用 Array 原型链上的 push 方法，可以实现一个类数组的 push 方法，给 arrayLike 添加新的元素。

从打印结果可以看出，数组的 push 方法满足了我们想要实现添加元素的诉求。再来看下 arguments 如何转换成数组：

```javascript
function sum(a, b) {
  let args = Array.prototype.slice.call(arguments);
 // let args = [].slice.call(arguments); // 这样写也是一样效果
  console.log(args.reduce((sum, cur) => sum + cur));
}
sum(1, 2);  // 3
function sum(a, b) {
  let args = Array.prototype.concat.apply([], arguments);
  console.log(args.reduce((sum, cur) => sum + cur));
}
sum(1, 2);  // 3
```

可以看到，借用 Array 原型链上的各种方法，来实现 sum 函数的参数相加的效果。一开始都是将 arguments 通过借用数组的方法转换为真正的数组，最后都又通过数组的 reduce 方法实现了参数转化的真数组 args 的相加，最后返回预期的结果。

#### （2）借用ES6方法

还可以采用 ES6 新增的 Array.from 方法以及展开运算符的方法来将类数组转化为数组。那么还是围绕上面这个 sum 函数来进行改变，看下用 Array.from 和展开运算符是怎么实现转换数组的：

```javascript
function sum(a, b) {
  let args = Array.from(arguments);
  console.log(args.reduce((sum, cur) => sum + cur));
}
sum(1, 2);    // 3
function sum(a, b) {
  let args = [...arguments];
  console.log(args.reduce((sum, cur) => sum + cur));
}
sum(1, 2);    // 3
function sum(...args) {
  console.log(args.reduce((sum, cur) => sum + cur));
}
sum(1, 2);    // 3
```

可以看到，Array.from 和 ES6 的展开运算符，都可以把 arguments 这个类数组转换成数组 args，从而实现调用 reduce 方法对参数进行累加操作。其中第二种和第三种都是用 ES6 的展开运算符，虽然写法不一样，但是基本都可以满足多个参数实现累加的效果。



### 10.ajax axios fetch各有什么特点

**1.jQuery ajax**

```js
$.ajax({
   type: 'POST',
   url: url,
   data: data,
   dataType: dataType,
   success: function () {},
   error: function () {}
});
```

传统 Ajax 指的是 XMLHttpRequest（XHR）， 最早出现的发送后端请求技术，隶属于原始js中，核心使用XMLHttpRequest对象，多个请求之间如果有先后关系的话，就会出现**回调地狱**。
 JQuery ajax 是对原生XHR的封装，除此以外还增添了对**JSONP**的支持。经过多年的更新维护，真的已经是非常的方便了，优点无需多言；如果是硬要举出几个缺点，那可能只有：
 1.本身是针对MVC的编程,不符合现在前端**MVVM**的浪潮
 2.基于原生的XHR开发，XHR本身的架构不清晰。
 3.JQuery整个项目太大，单纯使用ajax却要引入整个JQuery非常的不合理（采取个性化打包的方案又不能享受CDN服务）
 4.不符合关注分离（Separation of Concerns）的原则
 5.配置和调用方式非常混乱，而且基于事件的异步模型不友好。
MVVM(Model-View-ViewModel), 源自于经典的 Model–View–Controller（MVC）模式。MVVM 的出现促进了 GUI 前端开发与后端业务逻辑的分离，极大地提高了前端开发效率。MVVM 的核心是 ViewModel 层，它就像是一个中转站（value converter），负责转换 Model 中的数据对象来让数据变得更容易管理和使用，该层向上与视图层进行双向数据绑定，向下与 Model 层通过接口请求进行数据交互，起呈上启下作用。View 层展现的不是 Model 层的数据，而是 ViewModel 的数据，由 ViewModel 负责与 Model 层交互，这就完全解耦了 View 层和 Model 层，这个解耦是至关重要的，它是前后端分离方案实施的最重要一环。
 如下图所示：

![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d975c0670d24c29a23d75d70ccc8206~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

**2.axios**

```js
axios({
    method: 'post',
    url: '/user/12345',
    data: {
        firstName: 'Fred',
        lastName: 'Flintstone'
    }
})
.then(function (response) {
    console.log(response);
})
.catch(function (error) {
    console.log(error);
});
```

Vue2.0之后，尤雨溪推荐大家用axios替换JQuery ajax，想必让axios进入了很多人的目光中。
 axios 是一个基于Promise 用于浏览器和 nodejs 的 HTTP 客户端，本质上也是对原生XHR的封装，只不过它是Promise的实现版本，符合最新的ES规范，它本身具有以下特征：
 1.从浏览器中创建 XMLHttpRequest
 2.支持 Promise API
 3.客户端支持防止CSRF
 4.**提供了一些并发请求的接口**（重要，方便了很多的操作）
 5.从 node.js 创建 http 请求
 6.拦截请求和响应
 7.转换请求和响应数据
 8.取消请求
 9.自动转换JSON数据
防止CSRF:就是让你的每个请求都带一个从cookie中拿到的key, 根据浏览器同源策略，假冒的网站是拿不到你cookie中得key的，这样，后台就可以轻松辨别出这个请求是否是用户在假冒网站上的误导输入，从而采取正确的策略。
 **3.fetch**

```js
try {
  let response = await fetch(url);
  let data = response.json();
  console.log(data);
} catch(e) {
  console.log("Oops, error", e);
}
```

fetch号称是AJAX的替代品，是在ES6出现的，使用了ES6中的promise对象。Fetch是基于promise设计的。Fetch的代码结构比起ajax简单多了，参数有点像jQuery ajax。但是，一定记住**fetch不是ajax的进一步封装，而是原生js，没有使用XMLHttpRequest对象**。
 fetch的优点：
 1.符合关注分离，没有将输入、输出和用事件来跟踪的状态混杂在一个对象里
 2.更好更方便的写法
 坦白说，上面的理由对我来说完全没有什么说服力，因为不管是Jquery还是Axios都已经帮我们把xhr封装的足够好，使用起来也足够方便，为什么我们还要花费大力气去学习fetch？
 我认为fetch的优势主要优势就是：

1.  语法简洁，更加语义化
2.  基于标准 Promise 实现，支持 async/await
3.  同构方便，使用 [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch)
4.更加底层，提供的API丰富（request, response）
5.脱离了XHR，是ES规范里新的实现方式

最近在使用fetch的时候，也遇到了不少的问题：
 fetch是一个低层次的API，你可以把它考虑成原生的XHR，所以使用起来并不是那么舒服，需要进行封装。
 例如：

1）fetch只对网络请求报错，对400，500都当做成功的请求，服务器返回 400，500 错误码时并不会 reject，只有网络错误这些导致请求不能完成时，fetch 才会被 reject。
2）fetch默认不会带cookie，需要添加配置项： fetch(url, {credentials: 'include'})
3）fetch不支持abort，不支持超时控制，使用setTimeout及Promise.reject的实现的超时控制并不能阻止请求过程继续在后台运行，造成了流量的浪费
4）fetch没有办法原生监测请求的进度，而XHR可以

**总结：axios既提供了并发的封装，也没有fetch的各种问题，而且体积也较小，当之无愧现在最应该选用的请求的方式。**

### 11.new一个箭头函数会发生什么

#### 1.面向对象中的new关键字

如上所述new操作实质上是定义一个具有构造函数内置对象的实例。其运行过程如下：
1.创建一个javascript空对象 {};
2.将要实例化对象的原形链指向该对象原形。
3.绑定该对象为this的指向
4.返回该对象。

“面向对象编程”（Object Oriented Programming，缩写为OOP）是目前主流的编程范式。

- 创建类实例 - 对象
- 创建实例的时候执行构造函数

```js
class Person {
    constructor(name) {
        console.log('constructor')
        this.name = name
    }

    say() {
        console.log('My name is ',this.name)
    }
}
const b = new Person("b");
```

 Javascript语言中的变化

- 构造函数的写法的变化
- 通过原型定义属性和方法
- 上下文this的引入

```js
function Person(name) {
  console.log("constructor");
  
  this.name = name;
}
Person.prototype.say = function () {
  console.log("My name is", this.name);
};
```

 new的作用分析

```js
// TODO: 构造函数被执行
function Person(name) {
  console.log("constructor");
  // TODO: 将构造函数的this指向新对象
  this.name = name;
}

// TODO: 将新建对象的__proto__属性设置为构造函数的prototype
Person.prototype.say = function () {
  console.log("My name is", this.name);
};

// TODO: 创建新对象
const b = new Person("b");
b.say();
```

### 

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7888aa4371ef44ba900cbd1224752545~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

```js
function myNew(fn, ...args) {
  // 创建一个空对象
  const obj = {};
  // 将该对象的 __proto__ 属性链接到构造函数原型对象
  obj.__proto__ = fn.prototype;
  // 将该对象作为 this 上下文调用构造函数并接收返回值
  const res = fn.apply(obj, args);
  // 如果返回值存在并且是引用数据类型，返回构造函数返回值，否则返回创建的对象
  return typeof res === "object" ? res : obj;
}
const c = myNew(Person, "b");
c.say();
```

#### 2.箭头函数和new

箭头函数不可以使用new实例化的，这是因为因为箭头函数没有prototype也没有自己的this指向并且不可以使用arguments

##### 1.箭头函数没有单独的this

> 箭头函数不会创建自己的this,它只会从自己的作用域链的上一层继承this

##### 2.通过 call 或 apply 调用

> 由于 箭头函数没有自己的this指针，通过 call() 或 apply() 方法调用一个函数时，只能传递参数（不能绑定this），他们的第一个参数会被忽略

##### 3.不绑定arguments

箭头函数无法使用arguments，而普通函数可以使用arguments。如果要使用类似于arguments获取参数，可以使用rest参数代替

##### 4.箭头函数不能作为构造器，和new一起使用会抛出错误

```js
var Foo = () => {};
var foo = new Foo(); // TypeError: Foo is not a constructor
```

##### 5.箭头函数没有prototype属性

```php
var Foo = () => {};
console.log(Foo.prototype); // undefined
```

##### 6.箭头函数不能当做Generator函数,不能使用yield关键字

### 12.js延迟加载

JS延迟加载：也就是**等页面加载完成之后再加载 JavaScript 文件。**  

js的延迟加载有助与提高页面的加载速度。

一般有以下几种方式：

- defer 属性
- async属性
- 动态创建DOM方式
- 使用jquery的getScript方法
- 使用settimeout延迟方法
- 让js最后加载。

#### 1、defer属性

用途：表明脚本在执行时不会影响页面的构造。也就是说，**脚本会被延迟到整个页面都解析完毕之后再执行。**

HTML 4.01 为`<script>`标签定义了`defer`属性。标签定义了defer属性元素中设置defer属性。

在`<script>` 元素中设置 `defer` 属性，等于**告诉浏览器立即下载**，但**延迟执行**。

```html
<!DOCTYPE html>
<html>
<head>
    <script src="test1.js" defer="defer"></script>
    <script src="test2.js" defer="defer"></script>
</head>
<body>
<!-- 这里放内容 -->
</body>
</html>  
```

`HTML5`规范要求脚本按照它们出现的先后顺序执行。在现实当中，**延迟脚本并不一定会按照顺序执行。**

`defer`属性**只适用于外部脚本文件**。支持 HTML5 的实现会忽略嵌入脚本设置的 `defer`属性。

#### 2. async 属性

目的：**不让页面等待脚本下载和执行**，从而**异步加载页面其他内容**。

HTML5 为 `<script>`标签定义了 `async`属性。与`defer`属性类似，都用于改变处理脚本的行为。同样，**只适用于外部脚本文件**。

异步脚本**一定会在页面 load 事件前执行**。
 **不能保证脚本会按顺序执行。**

```html
<!DOCTYPE html>
<html>
<head>
    <script src="test1.js" async></script>
    <script src="test2.js" async></script>
</head>
<body>
<!-- 这里放内容 -->
</body>
</html>  
```

> 注意：async和defer一样，都不会阻塞其他资源下载，所以不会影响页面的加载。
>  缺点：**不能控制加载的顺序**

#### 3、动态创建DOM方式

将创建DOM的script脚本放置在标签前， 接近页面底部

```js
<script type="text/javascript">  
   (function(){     var scriptEle = document.createElement("script");
     scriptEle.type = "text/javasctipt";
     scriptEle.async = true;
     scriptEle.src = "http://cdn.bootcss.com/jquery/3.0.0-beta1/jquery.min.js";
     var x = document.getElementsByTagName("head")[0];
     x.insertBefore(scriptEle, x.firstChild);
 })();</script>  
```

#### 4、使用jQuery的getScript

```js
$.getScript("outer.js",function(){//回调函数，成功获取文件后执行的函数  
      console.log("脚本加载完成")  
});
```

#### 5、使用setTimeout延迟方法

延迟加载js代码，给网页加载留出更多时间

```js
<script type="text/javascript">  
   function testLoad() {  
       console.log("11");
        //.....这里可以写向后端的请求
   }  
   (function(){
        setTimeote(function(){            testLoad();
        }, 1000); //延迟一秒加载    })()
</script>  
```

#### 6.让JS最后加载

把js外部引入的文件的标签放到页面底部，来让js最后引入，从而加快页面加载速度

### 13.setTimeout()与setInterval()

#### setTimeout()细节

消息队列是用来存储宏任务的，并且主线程会按照顺序取出队列里的任务依次执行，所以为了保证setTimeout能够在规定的时间内执行，setTimeout创建的任务不会被添加到消息队列里，与此同时，浏览器还维护了另外一个队列叫做**延迟消息队列**，该队列就是用来存放延迟任务，setTimeout创建的任务会被存放于此，同时它会被记住创建时间，延迟执行时间

```js
setTimeout(function showName() { console.log('showName') }, 1000)
setTimeout(function showName() { console.log('showName1') }, 1000) 
console.log('martincai')
```

1.从消息队列中取出宏任务进行执行(首次任务直接执行)

2.执行setTimeout，此时会创建一个延迟任务，延迟任务的回调函数是showName，发起时间是当前的时间，延迟时间是第二个参数1000ms，然后该延迟任务会被推入到延迟任务队列

3.执行console.log('martincai')代码

4.从延迟队列里去筛选所有已过期任务(当前时间 >= 发起时间 + 延迟时间)，然后依次执行

1. setTimeout会受到消息队列里的宏任务的执行时间影响，上面我们可以看到延迟消息队列的任务会在消息队列的弹出的当前任务执行完之后再执行，所以当前任务的执行时间会阻碍到setTimeout的延迟任务的执行时间

```javascript
  function showName() {
    setTimeout(function show() {
      console.log('show')
    }, 0)
    for (let i = 0; i <= 5000; i++) {}
  }
  showName()
```

这里去执行一遍可以发现setTimeout并不是在0ms左右执行，中间会有明显的延迟，因为setTimeout在执行的时候首先会将任务放入到延迟消息队列里，等到showName执行完之后，才会去延迟队列里去查找已过期的任务，这里setTimeout任务会被showName耽误

2.setTimeout嵌套下会有4ms的延迟

Chrome会把嵌套5层以上的setTimeout后当作阻塞方法，在第6次调用setTimeout的时候会自动将延时器更改为至少4ms的延迟时间

3.未激活的页面的setTimeout更改为至少1000ms

当前tab页面不在active状态的时候，setTimeout的延迟至少会被更改1000ms，这样做是为了减少性能消耗和电量消耗

4.延迟时间有最大值

目前Chrome、Firefox等主流浏览器都是用32bit去存储延时时间，所以最大值是2的31次方 - 1

```javascript
  setTimeout(() => {
    console.log(1)
  }, 2 ** 31)
```

以上代码会立即执行



#### setInterval使用存在的问题

在 setInterval 被推入任务队列时，如果在它前面有很多任务或者某个任务等待时间较长比如网络请求等，那么这个定时器的执行时间和我们预定它执行的时间可能并不一致

考虑极端情况，假如定时器里面的代码需要进行大量的计算(耗费时间较长)，或者是 DOM 操作。这样一来，花的时间就比较长，有可能前一次代码还没有执行完，后一次代码就被添加到队列了。也**会到时定时器变得不准确，甚至出现同一时间执行两次的情况**。

最常见的出现的就是，当我们需要使用 ajax 轮询服务器是否有新数据时，必定会有一些人会使用 setInterval，然而无论网络状况如何，它都会去一遍又一遍的发送请求，最后的间隔时间可能和原定的时间有很大的出入

>定时器指定的时间间隔，表示的是**何时将定时器的代码添加到消息队列**，而**不是何时执行代码**。所以真正何时执行代码的时间是不能保证的，取决于何时被主线程的事件循环取到，并执行。

```
setInterval(function, N)
//即：每隔N秒把function事件推到消息队列中
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/788a403e21284339b4bf7fff34c1a392~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?) 上图可见，setInterval 每隔 100ms 往队列中添加一个事件；100ms 后，添加 T1 定时器代码至队列中，主线程中还有任务在执行，所以等待，some event 执行结束后执行 T1 定时器代码；又过了 100ms，T2 定时器被添加到队列中，主线程还在执行 T1 代码，所以等待；又过了 100ms，理论上又要往队列里推一个定时器代码，**但由于此时 T2 还在队列中，所以 T3 不会被添加（T3 被跳过）** ，结果就是此时被跳过；这里我们可以看到，T1 定时器执行结束后马上执行了 T2 代码，所以并没有达到定时器的效果。

综上所述，setInterval 有两个缺点：

- 使用 setInterval 时，某些间隔会被跳过；
- 可能多个定时器会连续执行；

可以这么理解：**每个 setTimeout 产生的任务会直接 push 到任务队列中；而 setInterval 在每次把任务 push 到任务队列前，都要进行一下判断(看上次的任务是否仍在队列中，如果有则不添加，没有则添加)。**

因而我们一般用 setTimeout 模拟 setInterval，来规避掉上面的缺点。

### 14.Object方法

Object常用方法总结：

#### 1.Object.assign(target,source1,source2,...)

该方法主要用于对象的合并，将源对象source的所有可枚举属性合并到目标对象target上,此方法只拷贝源对象的自身属性，不拷贝继承的属性。
Object.assign方法实行的是浅拷贝，而不是深拷贝。也就是说，如果源对象某个属性的值是对象，那么目标对象拷贝得到的是这个对象的引用。同名属性会替换。
Object.assign只能进行值的复制，如果要复制的值是一个取值函数，那么将求值后再复制。
Object.assign可以用来处理数组，但是会把数组视为对象。

```js
const target = { x : 0,y : 1};
const source = { x : 1,z : 2 ,fn : {number : 1}};
console.log(Object.assign(target, source));
// target  {x : 1, y : 1, z : 2, fn : {number : 1}}    // 同名属性会被覆盖
target.fn.number = 2;
console.log(source)// source  {x : 1, z : 2, fn : {number : 2}}   // 拷贝为对象引用

function Person(){
  this.name = 1
};
Person.prototype.country = 'china';
var student = new Person();
student.age = 29 ;
const young = {name : 'zhang'};
Object.assign(young,student);
// young {name : 'zhang', age : 29}               // 只能拷贝自身的属性，不能拷贝prototype

Object.assign([1, 2, 3], [4, 5])                      // 把数组当作对象来处理
// [4, 5, 3]
```



#### 2.Object.create(prototype,[propertiesObject])

使用指定的原型对象及其属性去创建一个新的对象

```js
var parent = { x : 1,y : 1}
var child = Object.create(parent,{
  z : {                           // z会成为创建对象的属性
    writable:true,
    configurable:true,
    value: "newAdd"
  }
});
console.log(child) //{z:"newAdd"}
console.log(child.x) //1
```



#### 3.Object.defineProperties(obj,props)

直接在一个对象上定义新的属性或修改现有属性，并返回该对象。

```js
var obj = {};
Object.defineProperties(obj, {
  'property1': {
    value: true,
    writable: true
  },
  'property2': {
    value: 'Hello',
    writable: false
  }
});
console.log(obj)   // {property1: true, property2: "Hello"}
```



#### 4.Object.defineProperty(obj,prop,descriptor)

在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。

```js
Object.defineProperty(Object, 'is', {
  value: function(x, y) {
           if (x === y) {
          // 针对+0 不等于 -0的情况
              return x !== 0 || 1 / x === 1 / y;
          }
          // 针对NaN的情况
          return x !== x && y !== y;
  },
  configurable: true,
  enumerable: false,
  writable: true
});
```



// 注意不能同时设置(writable，value) 和 get，set方法，否则浏览器会报错 ： Invalid property descriptor. Cannot both specify accessors and a value or writable attribute

#### 5.Object.keys(obj)

返回一个由一个给定对象的自身可枚举属性组成的数组，数组中属性名的排列顺序和使用 for...in 循环遍历该对象时返回的顺序一致 （两者的主要区别是 一个 for-in 循环还会枚举其原型链上的属性）。

```js
var arr = ["a", "b", "c"];
console.log(Object.keys(arr));
// ['0', '1', '2']

/* Object 对象 */
var obj = { foo: "bar", baz: 42 },
keys = Object.keys(obj);
console.log(keys);
// ["foo","baz"]
```



#### 6.Object.values()

方法返回一个给定对象自己的所有可枚举属性值的数组，值的顺序与使用for...in循环的顺序相同 ( 区别在于 for-in 循环枚举原型链中的属性 )。
Object.values会过滤属性名为 Symbol 值的属性。

```js
var an_obj = { 100: 'a', 2: 'b', 7: 'c' };
console.log(Object.values(an_obj)); // ['b', 'c', 'a']

var obj = { 0: 'a', 1: 'b', 2: 'c' };
console.log(Object.values(obj)); // ['a', 'b', 'c']
```



#### 7.Object.entries()

返回一个给定对象自身可枚举属性的键值对数组，其排列与使用 for...in 循环遍历该对象时返回的顺序一致（区别在于 for-in 循环也枚举原型链中的属性）。

```js
const obj = { foo: 'bar', baz: 42 };
console.log(Object.entries(obj)); // [ ['foo', 'bar'], ['baz', 42] ]

const simuArray = { 0: 'a', 1: 'b', 2: 'c' };
console.log(Object.entries(simuArray)); // [ ['0', 'a'], ['1', 'b'], ['2', 'c'] ]
```

#### 8.hasOwnProperty()

判断对象自身属性中是否具有指定的属性。
`obj.hasOwnProperty('name')`

#### 9.Object.getOwnPropertyNames()

返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组。

```js
var obj = { 0: "a", 1: "b", 2: "c"};
Object.getOwnPropertyNames(obj).forEach(function(val) {
  console.log(val);
});

var obj = {
  x : 1,
  y : 2
}
Object.defineProperty(obj,'z',{
  enumerable : false
})
console.log(Object.getOwnPropertyNames(obj))  // ["x", "y", "z"] 包含不可枚举属性 。
console.log(Object.keys(obj))                 // ["x", "y"]      只包含可枚举属性 。
```



#### 10.isPrototypeOf()

判断一个对象是否存在于另一个对象的原型链上。

#### 11.Object.setPrototypeOf(obj,prototype)

设置对象的原型对象

#### 12.Object.is()

判断两个值是否相同。
如果下列任何一项成立，则两个值相同：

  两个值都是 undefined
  两个值都是 null
  两个值都是 true 或者都是 false
  两个值是由相同个数的字符按照相同的顺序组成的字符串
  两个值指向同一个对象
  两个值都是数字并且
  都是正零 +0
  都是负零 -0
  都是 NaN
  都是除零和 NaN 外的其它同一个数字

```js
Object.is('foo', 'foo');     // true
Object.is(window, window);   // true

Object.is('foo', 'bar');     // false
Object.is([], []);           // false

var test = { a: 1 };
Object.is(test, test);       // true

Object.is(null, null);       // true

// 特例
Object.is(0, -0);            // false
Object.is(-0, -0);           // true
Object.is(NaN, 0/0);         // true
```

#### 13.Object.freeze()

冻结一个对象，冻结指的是不能向这个对象添加新的属性，不能修改其已有属性的值，不能删除已有属性，以及不能修改该对象已有属性的可枚举性、可配置性、可写性。也就是说，这个对象永远是不可变的。该方法返回被冻结的对象。

```js
var obj = {
  prop: function() {},
  foo: 'bar'
};

// 新的属性会被添加, 已存在的属性可能
// 会被修改或移除
obj.foo = 'baz';
obj.lumpy = 'woof';
delete obj.prop;

// 作为参数传递的对象与返回的对象都被冻结
// 所以不必保存返回的对象（因为两个对象全等）
var o = Object.freeze(obj);

o === obj; // true
Object.isFrozen(obj); // === true

// 现在任何改变都会失效
obj.foo = 'quux'; // 静默地不做任何事
// 静默地不添加此属性
obj.quaxxor = 'the friendly duck';
console.log(obj)
```

#### 14.Object.isFrozen()

判断一个对象是否被冻结 .

#### 15.Object.preventExtensions()

对象不能再添加新的属性。可修改，删除现有属性，不能添加新属性。

```js
var obj = {
  name :'lilei',
  age : 30 ,
  sex : 'male'
}

obj = Object.preventExtensions(obj);
console.log(obj);    // {name: "lilei", age: 30, sex: "male"}
obj.name = 'haha';
console.log(obj)     // {name: "haha", age: 30, sex: "male"}
delete obj.sex ;
console.log(obj);    // {name: "haha", age: 30}
obj.address  = 'china';
console.log(obj)     // {name: "haha", age: 30}
```

### 15.Event 对象

我们对元素进行点击操作时候，会产生一个 `Event` 的对象

```javascript
<button id="demo">event</button>
<script>
  let demo = document.getElementById('demo');
  demo.addEventListener('click', function(event) {
    console.log(event)
  })
</script>

```

#### clientX / clientY

`clientX` 和 `clientY` 都是只读属性，提供发生事件时的客户端区域的水平坐标和垂直坐标。不管页面是否滚动，客户端区域的左上角的 `clientX` 和 `clientY` 都是 `0`。

注意：以**可视区域（客户端）**的左上角位置为原点

![clientX_clientY.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1db75466c024ce78b0c0421fbee55df~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

#### offsetX / offsetY

`offsetX` 和 `offsetY` 都是只读属性，规定了事件对象与目标节点的内填充边在 `X` 或 `Y` 轴上的偏移量。

注意：以**目标元素**的（含 `padding` ）**左上角**位置为原点

![offsetX_offsetY.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/932b998707cb4997b11a4cd0dd9900ff~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

#### screenX / screenY

`screenX` 和 `screenY` 都是只读属性，提供事件鼠标在全局（屏幕）中的水平和垂直距离。

注意：以**屏幕**的左上角位置为原点

点击的元素位置相对电脑屏幕的左上角为坐标原点计算。得到的数值感觉不是很准，了解一下就好...

#### layerX / layerY

`layerX` 和 `layerY` 都是只读属性。

若目标元素自身有定位属性的话，就目标元素（包含 `padding` ）的左上角作为原点计算。 若目标元素自身没有定位属性的话，往上找有定位属性的父元素的左上角为原点计算距离。 若父元素都没有定位属性的话，那么就以 `body` 元素的左上角为原点计算。

#### pageX / pageY

`pageX` 和 `pageY` 都是只读属性，表示相对于整个文档的水平或者垂直坐标。这两个属性是基于文档边缘，考虑任何页面的水平或者垂直方向上的滚动。

注意：以**文档**的左上角位置为原点

![pageX_pageY.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/156f748920964a5faae7a8625b178658~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

------

#### client部分

**clientHeight**:内容可视区域的高度，也就是说页面浏览器中可以看到内容的这个区域的高度(不含边框，也不包含滚动条等边线，会随窗口的显示大小改变)

**clientLeft,clientTop**: 这两个返回的是元素周围边框的厚度（border）,如果不指定一个边框或者不定位该元素,他的值就是0.

#### offset部分

`计算时都包括此对象的border，padding`

offsetLeft：获取对象左侧与定位父级之间的距离

offsetTop：获取对象上侧与定位父级之间的距离

`PS：获取对象到父级的距离取决于最近的定位父级position`

offsetWidth：获取元素自身的宽度（包含边框）

offsetHeight：获取元素自身的高度（包含边框）





clientX：当事件被触发时鼠标指针相对于窗口左边界的水平坐标,`参照点为浏览器内容区域的左上角，该参照点会随之滚动条的移动而移动`。

offsetX：当事件被触发时鼠标指针相对于所触发的标签元素的左内边框的水平坐标。

screenX:鼠标位置相对于用户屏幕水平偏移量，而screenY也就是垂直方向的，`此时的参照点也就是原点是屏幕的左上角`。

pageX：`参照点是页面本身的body原点`，而不是浏览器内容区域左上角，`它计算的值不会随着滚动条而变动`，它在计算时其实是以body左上角原点（即页面本身的左上角，而不是浏览器可见区域的左上角）为参考点计算的，这个相当于已经把滚动条滚过的高或宽计算在内了，所以无论滚动条是否滚动，他都是一样的距离值。

所以基本可以得出结论：

**pageX > clientX, pageY > clientY**

**pageX = clientX + ScrollLeft(滚动条滚过的水平距离)**

**pageY = clientY + ScrollTop(滚动条滚过的垂直距离)**

#### scroll部分

scrollLeft：设置或获取当前左滚的距离，即左卷的距离；

scrollTop：设置或获取当前上滚的距离，即上卷的距离；

scrollHeight：获取对象可滚动的总高度；

scrollWidth：获取对象可滚动的总宽度；

`scrollHeight = content + padding；（即border之内的内容）`

### 16. Node 和 Element

[ELement](https://juejin.cn/post/7032218037746925581#heading-7)

```js
<div id="parent">
    This is parent content.
    <div id="child1">This is child1.</div>
    <div id="child2">This is child2.</div>
</div>
```

`document.getElementById()` 方法应该是我们最常使用的接口之一，那么它的返回值到底是 Node 还是 Element？

我们使用以下代码验证一下：

```js
let parentEle = document.getElementById('parent');
parentEle instanceof Node
// true
parentEle instanceof Element
// true
parentEle instanceof HTMLElement
// true
```

可以看到，`document.getElementById()` 获取到的结果既是 Node 也是 Element

![各层级关系](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/114633e51bb24e5586d14e0079aed4a9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

**Element 继承于 Node**。

从而也可以得出一个结论：**Element 一定是 Node，但 Node 不一定是 Element**。

所以：**Element 可以使用 Node 的所有方法**

`Element.children` 获取到的只是父元素点下的所有 div，而 `Element.childNodes` 获取到的却是父节点下的所有节点（包含文本内容、元素）

-   单个的 HTML 标签算是一个单独的 Node；
-   针对非 HTML标签（比如文本、空格等），从一个 HTML 标签开始，到碰到的第一个 HTML 标签为止，如果中间有内容（文本、空格等），那这部分内容算是一个 Node。注意：这里的 HTML 标签不分起始和结束
-   比如，`<div> 1 2 3 <span> 4 5 6 </span> 7 8 9 </div>`，针对这段代码来说：
    -   div 是一个 Node；
    -   span 是一个 Node；
    -   “ 1 2 3 ”、“ 4 5 6 ”和 “ 7 8 9 ”全都是单独的 Node



## 模块化

### 1.什么是模块化？

将 JS 分割成不同职责的 JS，解耦功能，来用于解决全局变量污染、 变量冲突、代码冗余、依赖关系难以维护等问题的一种 JS 管理思想，这就是模块化的过程。

模块化就是将变量和函数 放入不同的文件中 

模块的作用域是私有的 内部定义的代码只能在当前文件中使用 外部使用那么需要将此模块暴露出去

模块化的好处:减少全局变量 避免变量名和函数命名冲突,提高代码的复用性和维护性

### 2.简述模块化的发展历程?

模块化的发展主要从最初的无模块化，发展到闭包式的 IIFE 立即执行解决模块化，到后来的 CommonJS、 AMD、CMD，直到 ES6 模块化规范的出现

### 3.CommonJS和ES6模块有什么区别?

#### CommonJS

node使用的是commonjs 在使用模块的时候是运行时同步加载的 拷贝模块中的对象 

模块可以多次加载，但只会在第一次加载 之后会被缓存 引入的是缓存中的值

引入使用：require("path")

1.如果是第三方模块 只需要填入模块名

2.自己定义的模块 需要使用相对路径或者绝对路径

导出模块使用：exports.xxx 或 module.exports.xxx 或 module.exports=xxx 或 this.xxx

！！不管是使用 exports 还是 this ，都需要用点语法的形式导出，因为 他们两个是module.exports的指针 重新赋值将会切断关联

本质上还是module.exports进行导出

一般情况下 node内部会进行 module.exports=exports的操作

如果使用了module.exports， 会使用优先使用module.exports, exports的修改无效  相当于不使用exports

#### Es6 模块

默认导出  export default 变量或者函数或者对象

默认引入 import name from "相对或绝对路径" 

导出的名字和引入的名字可以不一致

按需导出 export 需要声明 变量用const var let 函数用function

按需引入 import {变量名或函数名} form "路径"  

全部引入 使用 import * as 自定义name "路径"

会将默认导出和按需导出 全部引入



CommonJS 是 NodeJs 的一种模块同步加载规范，一个文件即是一个模块，使用时直接 require(),即可，但是不适用于客户端，因为加载模块的时候有可能出现‘假死’状况，必须等模块请求成功，加载完毕才可以执行调用的模块。但是在服务期不存在这种状况。

AMD (Asynchronous Module Definition):异步模块加载机制。requireJS 就是 AMD 规范，使用时，先定义所有依赖，然后在加载完成后的回调函数中执行，属于依赖前置，使用：define()来定义模块，require([module], callback)来使用模块。 AMD 同时也保留 CommonJS 中的 require、exprots、module，可以不把依赖罗列在 dependencies 数组中，而是在代码中用 require 来引入。

```js
// AMD规范
require(['modA'], function(modA) {
  modA.start();
});

// AMD使用require加载模块
define(function() {
  console.log('main2.js执行');
  require(['a'], function(a) {
    a.hello();
  });

  $('#b').click(function() {
    require(['b'], function(b) {
      b.hello();
    });
  });
});
```

缺点：属于依赖前置，需要加载所有的依赖， 不可以像 CommonJS 在用的时候再 require，异步加载后再执行。

CMD(Common Module Definition):定义模块时无需罗列依赖数组，在 factory 函数中需传入形参 require,exports,module，然后它会调用 factory 函数的 toString 方法，对函数的内容进行正则匹配，通过匹配到的 require 语句来分析依赖，这样就真正实现了 CommonJS 风格的代码。是 seajs 推崇的规范，是依赖就近原则。

```js
// CMD规范
// a.js
define(function(require, exports, module) {
  console.log('a.js执行');
  return {
    hello: function() {
      console.log('hello, a.js');
    }
  };
});

// b.js
define(function(require, exports, module) {
  console.log('b.js执行');
  return {
    hello: function() {
      console.log('hello, b.js');
    }
  };
});

// main.js
define(function(require, exports, module) {
  var modA = require('a');
  modA.start();

  var modA = require('b');
  modB.start();
});
```

ES6 模块化是通过 export 命令显式的指定输出的代码，输入也是用静态命令的形式。属于编译时加载。比 CommonJS 效率高，可以按需加载指定的方法。适合服务端与浏览器端。

```js
// a.js
export var a = 'a';
export var b = function() {
  console.log(b);
};
export var c = 'c';

// main.js
import { a, b } from 'a.js';

console.log(a);
console.log(b);
```

区别：

`CommonJS `模块同步加载并执行模块文件，ES6 模块提前加载并执行模块文件，ES6 模块在预处理阶段分析模块依赖，在执行阶段执行模块，两个阶段都采用深度优先遍历

AMD 和 CMD 同样都是异步加载模块，两者加载的机制不同，前者为依赖前置、后者为依赖就近。

CommonJS 为同步加载模块，NodeJS 内部的模块管理规范，不适合浏览器端。

ES6 模块化编译时加载，通过 export,import 静态输出输入代码，效率高，同时适用于服务端与浏览器端。

#### `Commonjs` 的特性如下：

-   CommonJS 模块由 JS 运行时实现。
-   CommonJs 是单个值导出，本质上导出的就是 exports 属性。
-   CommonJS 是可以动态加载的，对每一个加载都存在缓存，可以有效的解决循环引用问题。
-   CommonJS 模块同步加载并执行模块文件。

#### es module 总结

`Es module` 的特性如下：

-   ES6 Module 静态的，不能放在块级作用域内，代码发生在编译时。
-   ES6 Module 的值是动态绑定的，可以通过导出方法修改，可以直接访问修改结果。
-   ES6 Module 可以导出多个属性和方法，可以单个导入导出，混合导入导出。
-   ES6 模块提前加载并执行模块文件，
-   ES6 Module 导入模块在严格模式下。
-   ES6 Module 的特性可以很容易实现 Tree Shaking 和 Code Splitting。

### 4.export 是什么?

export 是 ES6 中用于向外暴露数据或方法的一个命令。 通常使用 export 关键字来输出一个变量，该变量可以是数据也可以是方法。 而后，使用 import 来引入，并使用它。

```js
// a.js
export var a = 'hello';
export function sayHello(name) {
  console.log('Hello,' + name);
}

// main.js
import { a, sayHello } from './a.js';
console.log(a);
console.log(sayHello('LiMing'));
```



### 5.module.exports、export 与 export defalut 有什么区别？

都是用于向外部暴露数据的命令。 **export defalut 与 export 是 ES6 Module** 中对外暴露数据的。 export defalut 是向外部默认暴露数据，使用时 import 引入时需要为该模块指定一个任意名称，import 后不可以使用{}； export 是单个暴露数据或方法，利用 import{}来引入，并且{}内名称与 export 一一对应，{}也可以使用 as 为某个数据或方法指定新的名称； **module.exports 是 CommonJS** 的一个 exports 变量，提供对外的接口。

```js
// export defalut示例
// a.js
var a='Hello World！';
export defalut=a;
// main.js
import A from 'a.js';
console.log(A);

// export 示例
// b.js
export var b='b';
export function sayHello(name){
  console.log(name+'Hello World！');
}
// main.js
import {b,sayHello} from 'b.js'
sayHello('LiMing');
console.log(b);

// module.exports示例
// c.js
var  c='123';
function getValue(){
  return c;
}
function updateValue(value){
  c=value;
}
module.exports={
  getValue,
  updateValue
}
// main.js
import handleEvent from 'c.js';
handleEvent.getValue();
handleEvent.updateValue('456');

```

### 6.require 和 import 的区别

require用于读取并执行js文件， 并返回该模块的exports对象， 若无指定模块， 会报错。 Node使用CommonJS模块规范， CommonJS规范加载模块是**同步**的， 只有加载完成， 才能执行后续操作。

import用于引入外部模块， 其他脚本等的函数， 对象或者基本类型。 import属于ES6的命令， 它和require不一样， 它会生成外部模块的引用而不是加载模块， 等到真正使用到该模块的时候才会去加载模块中的值。

1. 导入`require` 导出 `exports/module.exports` 是 `CommonJS` 的标准，通常适用范围如 `Node.js`
2. `import/export` 是 `ES6` 的标准，通常适用范围如 `React`
3. `require` 是**赋值过程**并且是**运行时才执行**，也就是*同步加载*
4. `require` 可以理解为一个全局方法，因为它是一个方法所以意味着可以在任何地方执行。
5. `import` 是**解构过程**并且是**编译时执行**，理解为*异步加载*
6. `import` 会提升到整个模块的头部，具有置顶性，但是建议写在文件的顶部。

> `commonjs` 输出的，是一个值的拷贝，而`es6`输出的是值的引用；

> `commonjs` 是运行时加载，`es6`是编译时输出接口；




### 7.require原理

#### 查找规则

导入格式如下：require(X)

情况一：X是一个Node核心模块，比如path、http  直接返回核心模块，并且停止查找

情况二：X是以 ./ 或 ../ 或 /（根目录）开头的 n 第一步：将X当做一个文件在对应的目录下查找； 

1.如果有后缀名，按照后缀名的格式查找对应的文件 

2.如果没有后缀名，会按照如下顺序： 

1> 直接查找文件X 

2> 查找X.js文件  

3> 查找X.json文件 

4> 查找X.node文件 

第二步：没有找到对应的文件，将X作为一个目录 查找目录下面的index文

1> 查找X/index.js文件 

2> 查找X/index.json文件 

3> 查找X/index.node文件  如果没有找到，那么报错：not found

#### 模块的加载过程

结论一：模块在被第一次引入时，模块中的js代码会被运行一次 

 结论二：模块被多次引入时，会缓存，最终只加载（运行）一次 

为什么只会加载运行一次呢？ 这是因为每个模块对象module都有一个属性：loaded。 为false表示还没有加载，为true表示已经加载； 

结论三：如果有循环引入，那么加载顺序是什么？ 如果出现模块的引用关系，那么加载顺序是什么呢？ 这个其实是一种数据结构：图结构；  图结构在遍历的过程中，有深度优先搜索（DFS, depth first search）和广度优先搜索（BFS, breadth first search）； Node采用的是深度优先算法.

### 8.ES Module的解析过程

 ES Module的解析过程可以划分为三个阶段： 

阶段一：构建（Construction），根据地址查找js文件，并且下载，将其解析成模块记录（Module Record）； 

阶段二：实例化（Instantiation），对模块记录进行实例化，并且分配内存空间，解析模块的导入和导出语句，把模块指向 对应的内存地址。 

阶段三：运行（Evaluation），运行代码，计算值，并且将值填充到内存地址中

------

## ECMAScript 6+

### 1.let const var区别

**（1）块级作用域：** 块作用域由 `{ }`包括，let和const具有块级作用域，var不存在块级作用域。块级作用域解决了ES5中的两个问题：

- 内层变量可能覆盖外层变量
- 用来计数的循环变量泄露为全局变量

**（2）变量提升：** var存在变量提升，let和const不存在变量提升，即在变量只能在声明之后使用，否在会报错。

**（3）给全局添加属性：** 浏览器的全局对象是window，Node的全局对象是global。var声明的变量为全局变量，并且会将该变量添加为全局对象的属性，但是let和const不会。

**（4）重复声明：** var声明变量时，可以重复声明变量，后声明的同名变量会覆盖之前声明的遍历。const和let不允许重复声明变量。

**（5）暂时性死区：** 在使用let、const命令声明变量之前，该变量都是不可用的。这在语法上，称为**暂时性死区**。使用var声明的变量不存在暂时性死区。

**（6）初始值设置：** 在变量声明时，var 和 let 可以不用设置初始值。而const声明变量必须设置初始值。

**（7）指针指向：** let和const都是ES6新增的用于创建变量的语法。 let创建的变量是可以更改指针指向（可以重新赋值）。但const声明的变量是不允许改变指针的指向。

| **区别**           | **var** | **let** | **const** |
| ------------------ | ------- | ------- | --------- |
| 是否有块级作用域   | ×       | ✔️       | ✔️         |
| 是否存在变量提升   | ✔️       | ×       | ×         |
| 是否添加全局属性   | ✔️       | ×       | ×         |
| 能否重复声明变量   | ✔️       | ×       | ×         |
| 是否存在暂时性死区 | ×       | ✔️       | ✔️         |
| 是否必须设置初始值 | ×       | ×       | ✔️         |
| 能否改变指针指向   | ✔️       | ✔️       | ×         |



### 2.作用域和作用域链

#### 作用域

**概念**：作用域是在程序运行时代码中的某些特定部分中变量、函数和对象的**可访问性**。

从使用方面来**解释**，作用域就是变量的使用范围，也就是在代码的哪些部分可以访问这个变量，哪些部分无法访问到这个变量，换句话说就是这个变量在程序的哪些区域可见。

```js
function Fun() {
    var inVariable = "内部变量";
}
Fun();
console.log(inVariable);  // Uncaught ReferenceError: inVariable is not defined
//inVariable是在Fun函数内部被定义的，属于局部变量，在外部无法访问，于是会报错
```

从存储上来**解释**的话，作用域**本质**上是一个**对象，** 作用域中的变量可以理解为是该对象的成员

**总结**：作用域就是代码的执行环境，全局作用域就是全局执行环境，局部作用域就是函数的执行环境，它们都是栈内存

#### **作用域分类**

作用域又分为**全局作用域**和**局部作用域**。在ES6之前，局部作用域只包含了函数作用域，ES6的到来为我们提供了 **‘块级作用域’**（由一对花括号包裹），可以通过新增命令let和const来实现；而对于全局作用域这里有一个小细节需要注意一下：

>   -   在 Web 浏览器中，全局作用域被认为是 **`window`** 对象，因此所有全局变量和函数都是作为 **`window`** 对象的属性和方法创建的。
>   -   在 Node环境中，全局作用域是 **`global`** 对象。

全局作用域很好理解，现在我们再来解释一下局部作用域吧，先来看看**函数作用域**，所谓函数作用域，顾名思义就是由函数定义产生出来的作用域

```js
function fun1(){
    var variable = 'abc'
}
function fun2(){
    var variable = 'cba'
}
fun1();
fun2();
//这里有两个函数，他们分别都有一个同名变量variable，在严格模式下，程序不会报错，
//这是因为这两个同名变量位于不同的函数内，也就是位于不同的作用域中，所以他们不会产生冲突。
```

最外层函数 和在最外层函数外面定义的变量拥有全局作用域
```js
var outVariable = "我是最外层变量"; //最外层变量
function outFun() { //最外层函数
    var inVariable = "内层变量";
    function innerFun() { //内层函数
        console.log(inVariable);
    }
    innerFun();
}
console.log(outVariable); //我是最外层变量
outFun(); //内层变量
console.log(inVariable); //inVariable is not defined
innerFun(); //innerFun is not defined

```

-   所有末定义直接赋值的变量自动声明为拥有全局作用域

```js
function outFun2() {
    variable = "未定义直接赋值的变量";
    var inVariable2 = "内层变量2";
}
outFun2();//要先执行这个函数，否则根本不知道里面是啥
console.log(variable); //未定义直接赋值的变量
console.log(inVariable2); //inVariable2 is not defined
```

-   所有window对象的属性拥有全局作用域

一般情况下，window对象的内置属性都拥有全局作用域，例如window.name、window.location、window.top等等。



let 声明的语法与 var 的语法一致。基本上可以用 let 来代替 var 进行变量声明，但会将变量的作用域限制在当前代码块中 **（注意：块级作用域并不影响var声明的变量）。** 但是使用let时有几点需要**注意**：

>   -   **声明变量不会提升到代码块顶部，即不存在变量提升**
>   -   **禁止重复声明同一变量**
>   -   **for循环语句中（）内部，即圆括号之内会建立一个隐藏的作用域，该作用域不属于for后边的{}中，并且只有for后边的{}产生的块作用域能够访问这个隐藏的作用域，这就使循环中** **绑定块作用域有了妙用**

ES5和ES6版本的代码，ES5：

```js
if(true) {
    var a = 1
}
for(var i = 0; i < 10; i++) {
    ...
}
console.log(a) // 1
console.log(i) // 9

```

ES6：

```js
for (let i = 0; i < 10; i++) {
            console.log(i);//0,1,2,3,4,5,6,7,8,9
 }
console.log(i);// Uncaught ReferenceError: i is not defined
```



```js
if (true) {
     let i = 9;
}
console.log(i);// Uncaught ReferenceError: i is not defined
```

#### 作用域链(scope chain)

**概念**：多个作用域对象连续引用形成的链式结构。

**使用**方面**解释**：当在Javascript中使用一个变量的时候，首先Javascript引擎会尝试在当前作用域下去寻找该变量，如果没找到，再到它的上层作用域寻找，以此类推直到找到该变量或是已经到了全局作用域，如果在全局作用域里仍然找不到该变量，它就会直接报错。

**存储**方面**解释**：作用域链在JS内部中是以数组的形式存储的，数组的第一个索引对应的是函数本身的执行期上下文，也就是当前执行的代码所在环境的变量对象，下一个索引对应的空间存储的是该对象的外部执行环境，依次类推，一直到全局执行环境

```js
var a = 100
function fun() {
    var b = 200
    console.log(a) //100
// fun函数局部作用域中没有变量a，于是从它的上一级，也就是全局作用域中找，
//在全局中a被赋值为100，于是输出100
    console.log(b)//200 fun函数局部作用域中有变量b，并且它被赋值为了200，输出200
}
fun()
```

```js
var a = 10
function fun() {
   console.log(a)
}
function show(f) {
   var a = 20
   (function() {
      f()   //10，而不是20; 函数的作用域是在函数定义的时候就被决定了，与函数在哪里被调用无关
   })()
}
show(fun)
```

由于变量的查找是沿着作用域链来实现的，所以也称作用域链为**变量查找的机制**。是不是很好理解，这里再来补充一点作用域的作用

>   1.  作用域最为重要的一点是安全。**变量只能在特定的区域内才能被访问，外部环境不能访问内部环境的任何变量和函数，即可以向上搜索，但不可以向下搜索，** 有了作用域我们就可以避免在程序其它位置意外对某个变量做出修改导致程序发生事故。
>   2.  作用域能够减轻命名的压力。我们可以在不同的作用域内定义相同的变量名，并且这些变量名不会产生冲突。

 **作用域中取值,这里强调的是“创建”，而不是“调用”**，切记切记——其实这就是所谓的"静态作用域"



```js
var a = 10
function fn() {
  var b = 20
  function bar() {
    console.log(a + b) //30
  }
  return bar
}
var x = fn(),
  //b = 200
x() //bar()
```

fn()返回的是bar函数，赋值给x。执行x()，即执行bar函数代码。取b的值时，直接在fn作用域取出。取a的值时，试图在fn作用域取，但是取不到，只能转向创建fn的那个作用域中去查找，结果找到了,所以最后的结果是30

```js
var a = 10
function fn() {
  var b = 20
  function bar() {
    console.log(a + b) //30
  }
  bar()
}
fn()
```



#### 变量提升和暂时性死区

在当前上下文代码自上而下执行之前，会把所有带var/function关键字的进行提前的声明或者定义

1. 带var是只声明
2. 带function是声明+定义(赋值)都完成了

typeof 检测一个未被声明的变量不会报错，结果是`undefined`

1.var声明的变量在词法分析阶段(执行上下文创建阶段)就会完成创建和初始化(undefined)，因此在代码执行阶段，就可以在声明前使用
2.let声明的变量在词法分析阶段(执行上下文创建阶段)会完成创建但不会初始化，如果在其定义之前使用，就是使用了未被初始化的变量，会报怎么样的错误我上面也已经贴出来了并进行了翻译。



### 3.箭头函数特性

- ES6处理默认参数，默认参数可以是函数或变量
- 箭头函数没有arguments，其值取决于外层非箭头函数的值，(外层无就会报错)。
- this不同, 取决于外层非箭头函数的this的值，也不能改变this指向
- 没有原型prototype属性
- 箭头函数不能new 操作

### 4.模板语法和字符串处理

ES6 提出了“模板语法”的概念。在 ES6 以前，拼接字符串是很麻烦的事情：

```javascript
var name = 'css'   
var career = 'coder' 
var hobby = ['coding', 'writing']
var finalString = 'my name is ' + name + ', I work as a ' + career + ', I love ' + hobby[0] + ' and ' + hobby[1]
```

仅仅几个变量，写了这么多加号，还要时刻小心里面的空格和标点符号有没有跟错地方。但是有了模板字符串，拼接难度直线下降：

```javascript
var name = 'css'   
var career = 'coder' 
var hobby = ['coding', 'writing']
var finalString = `my name is ${name}, I work as a ${career} I love ${hobby[0]} and ${hobby[1]}`
```

字符串不仅更容易拼了，也更易读了，代码整体的质量都变高了。这就是模板字符串的第一个优势——允许用${}的方式嵌入变量。但这还不是问题的关键，模板字符串的关键优势有两个：

- 在模板字符串中，空格、缩进、换行都会被保留
- 模板字符串完全支持“运算”式的表达式，可以在${}里完成一些计算

基于第一点，可以在模板字符串里无障碍地直接写 html 代码：

```javascript
let list = `
	<ul>
		<li>列表项1</li>
		<li>列表项2</li>
	</ul>
`;
console.log(message); // 正确输出，不存在报错
```

基于第二点，可以把一些简单的计算和调用丢进 ${} 来做：

```javascript
function add(a, b) {
  const finalString = `${a} + ${b} = ${a+b}`
  console.log(finalString)
}
add(1, 2) // 输出 '1 + 2 = 3'
```

除了模板语法外， ES6中还新增了一系列的字符串方法用于提升开发效率：

（1）**存在性判定**：在过去，当判断一个字符/字符串是否在某字符串中时，只能用 indexOf > -1 来做。现在 ES6 提供了三个方法：includes、startsWith、endsWith，它们都会返回一个布尔值来告诉你是否存在。

- **includes**：判断字符串与子串的包含关系：

```javascript
const son = 'haha' 
const father = 'xixi haha hehe'
father.includes(son) // true
```

- **startsWith**：判断字符串是否以某个/某串字符开头：

```javascript
const father = 'xixi haha hehe'
father.startsWith('haha') // false
father.startsWith('xixi') // true
```

- **endsWith**：判断字符串是否以某个/某串字符结尾：

```javascript
const father = 'xixi haha hehe'
  father.endsWith('hehe') // true
```

（2）**自动重复**：可以使用 repeat 方法来使同一个字符串输出多次（被连续复制多次）：

```javascript
const sourceCode = 'repeat for 3 times;'
const repeated = sourceCode.repeat(3) 
console.log(repeated) // repeat for 3 times;repeat for 3 times;repeat for 3 times;
```

### 5.解构赋值的应用场景

#### 1、数组解构赋值

模式匹配：只要等号两边的模式(结构和格式)相同，左边的变量就会被赋予对应的值

`let [a,b,c] = [1,2,3];`

`let [foo, [[bar], baz]] = [1, [[2], 3]]`

省略解构赋值

```js
let [,,a,,b] = [1,2,3,4,5];
console.log(a,b);//3,5

let [ , , third] = ["foo", "bar", "baz"];
third // "baz"

let [x, , y] = [1, 2, 3];
x // 1
y // 3

let [head, ...tail] = [1, 2, 3, 4];
head // 1
tail // [2, 3, 4]
```

#### 2、对象的解构赋值

对象的属性没有次序，变量必须与属性同名，才能取到正确的值

解构赋值

```js
let { bar, foo } = { foo: 'aaa', bar: 'bbb' };
foo // "aaa"
bar // "bbb"
```

解构赋值的别名

如果使用别名，则不允许再使用原有的解构出来的属性名,对象的解构赋值的内部机制，是先找到同名属性，然后再赋给对应的变量。真正被赋值的是后者，而不是前者

```js

let p = { foo: 'aaa', bar: 'bbb' }
let { foo: baz } = p;
console.log(baz,foo) // 'aaa', error: foo is not defined
```

foo是匹配的模式，baz才是变量。真正被赋值的是变量baz，而不是模式foo

些情况下，我们解构出来的值并不存在，解构出来的值为undefined，所以需要设定一个默认值

```js
let obj = {
		name:"123"
};
let {name,age = 18} = obj;
console.log(name,age);//"123",18
```

解构赋值的嵌套赋值

```js
let obj = {
  p: ['Hello', { y: 'World' }]
};
let {p, p: [x, { y }] } = obj;
console.log(p,x,y) // ["Hello", {…}], "Hello", "World"
```

#### 3、字符串解构赋值

字符串也可以解构赋值。这是因为此时，字符串被转换成了一个类似数组的对象

```js
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"
```

类似数组的对象都有一个length属性，因此还可以对这个属性解构赋值。

```javascript
let { length: len } = 'hello'
console.log(len) //5
```



#### 4、**布尔值和数值的解构赋值**

布尔值和数值的解构，会先转为对象，然后对其包装对象的解构，取的是包装对象的属性。

```js

let {toString: s} = 123;
s === Number.prototype.toString // true

let {toString: s} = true;
s === Boolean.prototype.toString // true
```

#### 5、函数参数的解构赋值

```js
function move({x = 0, y = 0} = {}) {
  return x+y;
}

move({x: 3, y: 8}); // 11
move({x: 3}); // 3
move({}); // 0
move(); // 0
```

1. 解构成对象，只要等号右边的值不是对象或数组，就先将其转为对象。由于undefined和null无法转为对象，所以对它们进行解构赋值，都会报错。
2. 解构成数组，等号右边必须为可迭代对象。

#### 6、解构赋值使用场景

##### 浅拷贝

```js
let colors = [ "red", "green", "blue" ];
let [ ...allColors ] = colors;
console.log(allColors);  // "[red,green,blue]"
```

##### 交换变量

```js
let x = 1;
let y = 2;
[x, y] = [y, x];
```

##### *遍历Map结构*

```js
var map = new Map();
map.set('first', 'hello');
map.set('second', 'world');

for (let [key, value] of map) {
    console.log(key + " is " + value);
}

// 获取键名
for (let [key] of map) {
  // ...
}

// 获取键值
for (let [,value] of map) {
  // ...
}
```

##### 函数参数

解构赋值可以方便地将一组参数与变量名对应起来

```js
// 参数是一组有次序的值
function f([x, y, z]) { ... }
f([1, 2, 3]);
```

##### 提取JSON数据

```js
let jsonData = {
  id: 42,
  status: "OK",
  data: [867, 5309]
};

let { id, status, data: number } = jsonData;

console.log(id, status, number) // 42 "OK"  [867, 5309];
```

##### 输入模块的指定方法

```js
const { SourceMapConsumer, SourceNode } = require("source-map");
```

### 6.剩余参数和扩展运算符使用场景

> 在ES6中。 三个点(...) 有2个含义。分别表示 扩展运算符 和 剩余运算符。

#### 扩展运算

##### 数组展开

```js
 function  test(a,b,c){
     console.log(a);
     console.log(b);
     console.log(c);
 }

 var arr = [1, 2, 3];
 test(...arr);
 // 打印结果
 // 1
 // 2
 // 3
```

##### 将一个数组插入到另一个数据中

```js
 var arr1 = [1, 2, 3];
 var arr2 = [...arr1, 4, 5, 6];
 console.log(arr2);
 // 打印结果
 // [1, 2, 3, 4, 5, 6]
```

##### 字符串转数据

```js
 var str='test';
 var arr3= [...str];
 console.log(arr3);
 // 打印结果
 //  ["t", "e", "s", "t"]
```

#### 剩余运算符

##### 当函数参数个数不确定时，用 rest运算符

```js
function rest1(...arr) {
    for (let item of arr) {
        console.log(item);
    }
}
rest1(1, 2, 3);
// 打印结果
// 1
// 2
// 3
```

##### 当函数参数个数不确定时的第二种情况

```js
function rest2(item, ...arr) {
    console.log(item);
    console.log(arr);
}
rest2(1, 2, 3, 4, 5);
// 打印结果
// 1
// [2, 3, 4, 5]
```

##### 解构使用

```js
var [a,...temp]=[1, 2, 3, 4];
console.log(a);
console.log(temp);
// 打印结果
// 1
// [2, 3, 4]
```

### 7.proxy和reflect

#### Proxy

- `Proxy` 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（`meta programming`），即对编程语言进行编程。可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。

1. 将 `Proxy` 对象，设置到`object.proxy`属性，从而可以在`object`对象上调用。

```js
const object = { proxy: new Proxy(target, handler) };
```

1. 使用`Proxy`对象

```js
const proxy = new Proxy({}, {
  get: function(target, propKey) {
    return 'detanx';
  }
});

obj.name // 'detanx'
```

`Proxy` 支持的拦截操作一览，一共 `13` 种

1. `get(target, propKey, receiver)`：拦截对象属性的读取，比如`proxy.foo`和`proxy['foo']`。
2. `set(target, propKey, value, receiver)`：拦截对象属性的设置，比如`proxy.foo = v`或`proxy['foo'] = v`，返回一个布尔值。
3. `has(target, propKey)`：拦截`propKey in proxy`的操作，返回一个布尔值。
4. `deleteProperty(target, propKey)`：拦截`delete proxy[propKey]`的操作，返回一个布尔值。
5. `ownKeys(target)`：拦截`Object.getOwnPropertyNames(proxy)`、`Object.getOwnPropertySymbols(proxy)`、`Object.keys(proxy)`、`for...in`循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而`Object.keys()`的返回结果仅包括目标对象自身的可遍历属性。
6. `getOwnPropertyDescriptor(target, propKey)`：拦截`Object.getOwnPropertyDescriptor(proxy, propKey)`，返回属性的描述对象。
7. `defineProperty(target, propKey, propDesc)`：拦截`Object.defineProperty(proxy, propKey, propDesc）`、`Object.defineProperties(proxy, propDescs)`，返回一个布尔值。
8. `preventExtensions(target)`：拦截`Object.preventExtensions(proxy)`，返回一个布尔值。
9. `getPrototypeOf(target)`：拦截`Object.getPrototypeOf(proxy)`，返回一个对象。
10. `isExtensible(target)`：拦截`Object.isExtensible(proxy)`，返回一个布尔值。
11. `setPrototypeOf(target, proto)`：拦截`Object.setPrototypeOf(proxy, proto)`，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
12. `apply(target, object, args)`：拦截 `Proxy` 实例作为函数调用的操作，比如`proxy(...args)`、`proxy.call(object, ...args)`、`proxy.apply(...)`。
13. `construct(target, args)`：拦截 `Proxy` 实例作为构造函数调用的操作，比如`new proxy(...args)`。

##### get()

- 拦截某个属性的读取操作，可以接受三个参数，依次为目标对象、属性名和 `Proxy` 实例本身（**严格地说，是操作行为所针对的对象**），其中最后一个参数可选。

```js
const proxy = new Proxy({}, {
  get(target, propertyKey [, receiver]) {
    return target[propertyKey];
  }
});
```

- 如果一个属性不可配置（`configurable`）且不可写（`writable`），则 `Proxy`不能修改该属性，否则通过 `Proxy` 对象访问该属性会报错。

```js
const target = Object.defineProperties({}, {
  foo: {
    value: 123,
    writable: false,
    configurable: false
  },
});

const handler = {
  get(target, propKey) {
    return 'abc';
  }
};

const proxy = new Proxy(target, handler);

proxy.foo
// TypeError: Invariant check failed
```

##### set()

- `set`方法用来拦截某个属性的赋值操作，可以接受四个参数，依次为目标对象、属性名、属性值和 `Proxy` 实例本身，其中最后一个参数可选。

```js
let prxyo = new Proxy({}, {
  set(target, propertyKey, value [, receiver]) {
    return target[propertyKey];
  }
});
```

- **如果目标对象自身的某个属性，不可配置（`configurable`）且不可写（`writable`），那么`set`方法将不起作用。**

```js
const obj = {};
Object.defineProperty(obj, 'foo', {
  value: 'bar',
  writable: false,
});

const handler = {
  set: function(obj, prop, value, receiver) {
    obj[prop] = 'baz';
  }
};

const proxy = new Proxy(obj, handler);
proxy.foo = 'baz';
proxy.foo // "bar"
```

#### vue3 使用 Proxy 替换 defineProperty

-  `Object.defineProperty`
  1. `Object.defineProperty`**无法监控到数组下标的变化**，导致直接通过数组的下标给数组设置值，不能实时响应。经过vue内部处理后可以使用以下几种方法来监听数组`push()`、`pop()`、`shift()`、`unshift()`、`splice()`、`sort()`、`reverse()`，由于只针对了以上八种方法进行了`hack`处理,所以其他数组的属性也是检测不到的，还是具有一定的局限性。
  2. `Object.defineProperty`**只能劫持对象的属性**,因此我们需要对每个对象的**每个属性进行遍历**。
- Proxy

  1. 可以劫持整个对象，并返回一个新对象。
  2. 有 `13` 种劫持操作。

#### Reflect

1. 将`Object`对象的一些明显属于语言内部的方法（比如`Object.defineProperty`），放到`Reflect`对象上。
2. 修改某些`Object`方法的返回结果，让其变得更合理。比如，`Object.defineProperty(obj, name, desc)`在无法定义属性时，会抛出一个错误，而`Reflect.defineProperty(obj, name, desc)`则会返回`false`。

```js
// 老写法
try {
  Object.defineProperty(target, property, attributes);
  // success
} catch (e) {
  // failure
}

// 新写法
if (Reflect.defineProperty(target, property, attributes)) {
  // success
} else {
  // failure
}
```

3.让`Object`操作都变成函数行为。某些`Object`操作是命令式，比如`name in obj`和`delete obj[name]`，而`Reflect.has(obj, name)`和`Reflect.deleteProperty(obj, name)`让它们变成了函数行为。

```
// 老写法
'assign' in Object // true

// 新写法
Reflect.has(Object, 'assign') // true
```

4.`Reflect`对象的方法与`Proxy`对象的方法一一对应，只要是`Proxy`对象的方法，就能在`Reflect`对象上找到对应的方法。**每一个`Proxy`对象的拦截操作（`get、delete、has、...`），内部都调用对应的`Reflect`方法。**

### 8.Set Map数组有什么特性和区别

#### Set

`Set` 本身是一个构造函数，用来生成 `Set` 数据结构。`Set` 函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。`Set` 对象允许你存储任何类型的值，无论是原始值或者是对象引用。它类似于数组，但是成员的值都是唯一的，没有重复的值。

```js
const s = new Set()
[2, 3, 5, 4, 5, 2, 2].forEach((x) => s.add(x))
for (let i of s) {
  console.log(i)
}
// 2 3 5 4
```

##### Set 中的特殊值:

`Set` 对象存储的值总是唯一的，所以需要判断两个值是否恒等。有几个特殊值需要特殊对待：

- +0 与 -0 在存储判断唯一性的时候是恒等的，所以不重复
- `undefined` 与 `undefined` 是恒等的，所以不重复
- `NaN` 与 `NaN` 是不恒等的，但是在 `Set` 中认为 `NaN` 与 `NaN` 相等，所有只能存在一个，不重复。

##### Set 的属性：

- `size`：返回集合所包含元素的数量

```js
const items = new Set([1, 2, 3, 4, 5, 5, 5, 5])
items.size // 5
```

##### Set 实例对象的方法

- `add(value)`：添加某个值，返回 `Set` 结构本身(可以链式调用)。
- `delete(value)`：删除某个值，删除成功返回 `true`，否则返回 `false`。
- `has(value)`：返回一个布尔值，表示该值是否为 `Set` 的成员。
- `clear()`：清除所有成员，没有返回值。

```js
s.add(1).add(2).add(2)
// 注意2被加入了两次

s.size // 2

s.has(1) // true
s.has(2) // true
s.has(3) // false

s.delete(2)
s.has(2) // false
```

#### 遍历方法

- `keys()`：返回键名的遍历器。
- `values()`：返回键值的遍历器。
- `entries()`：返回键值对的遍历器。
- `forEach()`：使用回调函数遍历每个成员。

**由于 `Set` 结构没有键名，只有键值**（或者说键名和键值是同一个值），所以 `keys` 方法和 `values` 方法的行为完全一致。

```js
let set = new Set(['red', 'green', 'blue'])

for (let item of set.keys()) {
  console.log(item)
}
// red
// green
// blue

for (let item of set.values()) {
  console.log(item)
}
// red
// green
// blue

for (let item of set.entries()) {
  console.log(item)
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
```

#### Set 的应用

1、`Array.from` 方法可以将 `Set` 结构转为数组。

```js
const items = new Set([1, 2, 3, 4, 5])
const array = Array.from(items)
```

2、数组去重

```js
// 去除数组的重复成员
[...new Set(array)]

Array.from(new Set(array))
```

3、数组的 `map` 和 `filter` 方法也可以间接用于 `Set`

```js
let set = new Set([1, 2, 3])
set = new Set([...set].map((x) => x * 2))
// 返回Set结构：{2, 4, 6}

let set = new Set([1, 2, 3, 4, 5])
set = new Set([...set].filter((x) => x % 2 == 0))
// 返回Set结构：{2, 4}
```

4、实现并集 `(Union)`、交集 `(Intersect)` 和差集

```js
let a = new Set([1, 2, 3])
let b = new Set([4, 3, 2])

// 并集
let union = new Set([...a, ...b])
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter((x) => b.has(x)))
// set {2, 3}

// 差集
let difference = new Set([...a].filter((x) => !b.has(x)))
// Set {1}
```

#### Map

`Map` 中存储的是 `key-value` 形式的键值对, 其中的 `key` 和 `value` 可以是任何类型的, 即对象也可以作为 `key`。 `Map` 的出现，就是让各种类型的值都可以当作键。`Map` 提供的是 “值-值”的对应。

##### Map 和 Object 的区别

1. `Object` 对象有原型， 也就是说他有默认的 `key` 值在对象上面， 除非我们使用 `Object.create(null)`创建一个没有原型的对象；
2. 在 `Object` 对象中， 只能把 `String` 和 `Symbol` 作为 `key` 值， 但是在 `Map` 中，`key` 值可以是任何基本类型(`String`, `Number`, `Boolean`, `undefined`, `NaN`….)，或者对象(`Map`, `Set`, `Object`, `Function` , `Symbol` , `null`….);
3. 通过 `Map` 中的 `size` 属性， 可以很方便地获取到 `Map` 长度， 要获取 `Object` 的长度， 你只能手动计算

##### Map 的属性

- size: 返回集合所包含元素的数量

```
const map = new Map()
map.set('foo', ture)
map.set('bar', false)
map.size // 2
```

##### Map 对象的方法

- `set(key, val)`: 向 `Map` 中添加新元素
- `get(key)`: 通过键值查找特定的数值并返回
- `has(key)`: 判断 `Map` 对象中是否有 `Key` 所对应的值，有返回 `true`，否则返回 `false`
- `delete(key)`: 通过键值从 `Map` 中移除对应的数据
- `clear()`: 将这个 `Map` 中的所有元素删除

```js
const m = new Map()
const o = { p: 'Hello World' }

m.set(o, 'content')
m.get(o) // "content"

m.has(o) // true
m.delete(o) // true
m.has(o) // false
```

##### 遍历方法

- `keys()`：返回键名的遍历器
- `values()`：返回键值的遍历器
- `entries()`：返回键值对的遍历器
- `forEach()`：使用回调函数遍历每个成员

```js
const map = new Map([
  ['a', 1],
  ['b', 2],
])

for (let key of map.keys()) {
  console.log(key)
}
// "a"
// "b"

for (let value of map.values()) {
  console.log(value)
}
// 1
// 2

for (let item of map.entries()) {
  console.log(item)
}
// ["a", 1]
// ["b", 2]

// 或者
for (let [key, value] of map.entries()) {
  console.log(key, value)
}
// "a" 1
// "b" 2

// for...of...遍历map等同于使用map.entries()

for (let [key, value] of map) {
  console.log(key, value)
}
// "a" 1
// "b" 2
```

##### 数据类型转化

Map 转为数组

```js
let map = new Map()
let arr = [...map]
```

数组转为 Map

```js
Map: map = new Map(arr)
```

Map 转为对象

```js
let obj = {}
for (let [k, v] of map) {
  obj[k] = v
}
```

对象转为 Map

```js
for( let k of Object.keys(obj)）{
  map.set(k,obj[k])
}
```

##### Map的应用

通过 Map 来改造，将我们需要显示的 label 和 value 存到我们的 Map 后渲染到页面，这样减少了大量的html代码

```js
<template>
  <div id="app">
    <div class="info-item" v-for="[label, value] in infoMap" :key="value">
      <span>{{label}}</span>
      <span>{{value}}</span>
    </div>
  </div>
</template>
data: () => ({
  info: {},
  infoMap: {}
}),
mounted () {
  this.info = {
    name: 'jack',
    sex: '男',
    age: '28',
    phone: '13888888888',
    address: '广东省广州市',
    duty: '总经理'
  }
  const mapKeys = ['姓名', '性别', '年龄', '电话', '家庭地址', '身份']
  const result = new Map()
  let i = 0
  for (const key in this.info) {
    result.set(mapKeys[i], this.info[key])
    i++
  }
  this.infoMap = result
}
```



### 9.weakMap和weakSet特点，什么是弱引用

#### weakSet

`WeakSet` 结构与 `Set` 类似，也是不重复的值的集合。

- 成员都是数组和类似数组的对象，若调用 `add()` 方法时传入了非数组和类似数组的对象的参数，就会抛出错误。

```js
const b = [1, 2, [1, 2]]
new WeakSet(b) // Uncaught TypeError: Invalid value used in weak set
```

- 成员都是弱引用，可以被垃圾回收机制回收，可以用来保存 DOM 节点，不容易造成内存泄漏。
- `WeakSet` 不可迭代，因此不能被用在 `for-of` 等循环中。
- `WeakSet` 没有 `size` 属性。

#### WeakMap

`WeakMap` 结构与 `Map` 结构类似，也是用于生成键值对的集合。

- 只接受对象作为键名（`null` 除外），不接受其他类型的值作为键名
- 键名是弱引用，键值可以是任意的，键名所指向的对象可以被垃圾回收，此时键名是无效的
- 不能遍历，方法有 `get`、`set`、`has`、`delete`

#### 弱引用

**WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中**

- **弱引用**：垃圾回收机制有一套自己的回收算法，我们都知道一个函数执行完成后该函数在**调用栈中创建的执行上下文**会被销毁，这里说的销毁，其实指的就是执行上下文中环境变量、词法变量中的数据存储所占据的内存空间被垃圾回收机制所回收，那么`垃圾回收机制不考虑 WeakSet 对该对象的引用`是不是就意味着垃圾回收机制不会回收 WeakSet 对象里面的数据所占据的内存呢？不！不是的！代码是最好的解释

```js
let obj={name:'kirara'}
let ws=new WeakSet()
ws.add(obj)
obj=null
console.log(ws)  //WeakSet{}
```

用 ws 中存放一个对象，然后再将该对象置为null，（一个变量被置为null，就意味着这个变量的内存可以被回收了）只要 WeakSet 结构中的对象不再需要被引用，那么 WeakSet 就直接为空了，就意味着WeakSet中的数据所占据的内存被释放了

````js
let obj={name:'kirara'}
let s=new Set()
s.add(obj)
obj=null
console.log(s) 
//value.name='kirara'
````

WeakSet中 - `垃圾回收机制会自动回收该对象所占用的内存`

应用场景： **储存 DOM 节点，而不用担心这些节点从文档移除时，会引发内存泄漏**![carbon (3).png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6af8486dae5641cb9670a9ecd553529d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)

假设我们需要给记录页面上的禁用标签，那么一个Set对象存放就可以了，这样写功能上没有问题，但如果写成这样，当点击事件发生后，button 的dom被移除，那么整份js中 disabledElements 这个对象因为是强引用，其中的值依然存在于内存中的，那么内存泄漏就造成了，于是我们可以换成 WeakSet 来存放

![carbon (4).png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c554e77ddb2d439fa5949c676d9ed441~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp?)
效果是一样的，这里当 button 被移除，disabledElements 中的内容会因为是弱引用而直接变成空，也就是disabledElements被垃圾回收掉了其中的内存，避免了一个小小的内存泄漏的产生

### 10.迭代器和生成器

迭代器是一种特殊的对象，它具有一些专门为迭代过程设计的专有接口，所有的迭代器对象都有一个next()方法，每次调用都返回一个结果对象。

结果对象有两个属性：一个是value，表示下一个将要返回的值；另一个是done，它是一个布尔值，当没有更多可返回的数据时返回true。

迭代器还会保存一个内部指针，用来指向当前集合中值的位置，每一次调用next()方法，都会返回下一个可用的值。 

如果在最后一个值返回后在调用next()方法，那么返回对象中属性done的值为true，属性value则包含迭代器最终返回的值，这个返回值不是数据集的一部分，它与函数的返回值类似，是函数调用过程中最后一次给调用者传递信息的方法，如果没有相关数据则返回undefined。

生成器是一种返回迭代器的函数，通过function关键字后的星号（*）来表示，函数中会用到新的关键字yield。星号可以紧挨着function关键字，也可以在中间添加一个空格，比如这样：

```js
function *createIterator() {  
yield 1;  yield 2;  yield 3;
}let iterator = createIterator();  
// 生成器的调用方式与普通函数一样，只不过返回的是一个迭代器console.log(iterator.next().value);  
// console.log(iterator.next().value);  
// console.log(iterator.next().value);  // 3

```

使用yield关键字可以返回任何值或表达式，所以可以通过生成器函数批量地给迭代器添加元素。例如，可以在循环中使用yield关键字

```js
function *createIterator(items) {  
    for (let i = 0; i < items.length; i++) 
    {    
    yield items[i];  
    }}
    let iterator = createIterator([1,2,3]);  
           // 生成器的调用方式与普通函数一样，只不过返回的是一个迭代器console.log(iterator.next());  
           // {value: 1, done: false}console.log(iterator.next());  
           // {value: 2, done: false}console.log(iterator.next());  
           // {value: 3, done: false}console.log(iterator.next());  
           // {value: undefined, done: true}// 之后所有的调用都会返回相同的内容
           console.log(iterator.next());  
           // {value: undefined, done: true}
```

可迭代对象具有Symbol.iterator属性，是一种与迭代器密切相关的对象。Symbol.iterator通过指定的函数可以返回一个作用于附属对象的迭代器。在ECMAScript6中，所有的集合对象（数组，Set集合和Map集合）和字符串都是可迭代对象，这些对象中都有默认的迭代器。ECMAScript中新加入的特性for-of循环需要用到可迭代对象的这些功能。




------

## 原型

### 1.原型链

![JavaScript原型关系图](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/11/4/166dee0c1854fab5~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

在JavaScript中是使用**构造函数来新建一个对象**的，每一个**构造函数的内部都有一个 prototype 属性**，它的**属性值是一个对象**，这个对象包含了可以由该构造函数的**所有实例共享的属性和方法**。

当使用构造函数新建一个对象后，在这个**新建对象的内部将包含一个指针**，这个**指针指向构造函数的 prototype 属性对应的值,即原型对象**，在 ES5 中这个**指针被称为对象的原型**。一般来说不应该能够获取到这个值的，但是现在浏览器中都实现了 __proto__ 属性来访问这个属性，但是最好不要使用这个属性，因为它不是规范中规定的。ES5 中新增了一个 Object.getPrototypeOf() 方法，可以通过这个方法来获取对象的原型。

当访问一个对象的属性时，如果这个对象内部不存在这个属性，那么它就会去它的原型对象里找这个属性，这个原型对象又会有自己的原型，于是就这样一直找下去，也就是原型链的概念。原型链的尽头一般来说都是 Object.prototype ，这就是新建的对象为什么能够使用 toString() 等方法的原因

 JavaScript 对象是通过引用来传递的，创建的每个新对象实体中并没有一份属于自己的原型副本。当修改原型时，与之相关的对象也会继承这一改变

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c68fcad75ea54d62a9404aa02cafc65c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)



```js
function Person() {}
// 说明：name,age,job这些本不应该放在原型上，只是为了说明属性查找机制
Person.prototype.name = "Nicholas"; 
Person.prototype.age = 29; 
Person.prototype.job = "Software Engineer"; 
Person.prototype.sayName = function() { 
 console.log(this.name); 
};
let person1 = new Person()
let person2 = new Person()

// 声明之后，构造函数就有了一个与之关联的原型对象
console.log(Object.prototype.toString.call(Person.prototype)) // [object Object]
console.log(Person.prototype) // {constructor: ƒ}

// 构造函数有一个 prototype 属性引用其原型对象，而这个原型对象也有一个constructor 属性，引用这个构造函数
// 换句话说，两者循环引用
console.log(Person.prototype.constructor === Person); // true

// 构造函数、原型对象和实例是 3 个完全不同的对象
console.log(person1 !== Person); // true 
console.log(person1 !== Person.prototype); // true 
console.log(Person.prototype !== Person); // true

// 实例通过__proto__链接到原型对象，它实际上指向隐藏特性[[Prototype]] 
// 构造函数通过 prototype 属性链接到原型对象，实例与构造函数没有直接联系，与原型对象有直接联系，后面将会画图再次说明这个问题
console.log(person1.__proto__ === Person.prototype); // true 
conosle.log(person1.__proto__.constructor === Person); // true

// 同一个构造函数创建的两个实例，共享同一个原型对象 
console.log(person1.__proto__ === person2.__proto__); // true

// Object.getPrototypeOf()，返回参数的内部特性[[Prototype]]的值 ，用于获取原型对象，兼容性更好
console.log(Object.getPrototypeOf(person1) == Person.prototype); // true

```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/300750faa54e4872bfdd1a30850ee993~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

### 2.原型修改、重写

```javascript
function Person(name) {
    this.name = name
}
// 修改原型
Person.prototype.getName = function() {}
var p = new Person('hello')
console.log(p.__proto__ === Person.prototype) // true
console.log(p.__proto__ === p.constructor.prototype) // true
// 重写原型
Person.prototype = {
    getName: function() {}
}
var p = new Person('hello')
console.log(p.__proto__ === Person.prototype)        // true
console.log(p.__proto__ === p.constructor.prototype) // false
```



以看到修改原型的时候p的构造函数不是指向Person了，因为直接给Person的原型对象直接用对象赋值时，它的构造函数指向的了根构造函数Object，所以这时候`p.constructor === Object` ，而不是`p.constructor === Person`。要想成立，就要用constructor指回来：

```javascript
Person.prototype = {
    getName: function() {}
}
var p = new Person('hello')
p.constructor = Person
console.log(p.__proto__ === Person.prototype)        // true
console.log(p.__proto__ === p.constructor.prototype) // true
```

### 3.原型链指向

```js
p.__proto__  // Person.prototype
Person.prototype.__proto__  // Object.prototype
p.__proto__.__proto__ //Object.prototype
p.__proto__.constructor.prototype.__proto__ // Object.prototype
Person.prototype.constructor.prototype.__proto__ // Object.prototype
p1.__proto__.constructor // Person
Person.prototype.constructor  // Person
```

### 4.原型链终点

由于`Object`是构造函数，原型链终点是`Object.prototype.__proto__`，而`Object.prototype.__proto__=== null // true`，所以，原型链的终点是`null`。原型链上的所有原型都是对象，所有的对象最终都是由`Object`构造的，而`Object.prototype`的下一级是`Object.prototype.__proto__`

### 5.获得对象原型链上的属性

使用`hasOwnProperty()`方法来判断属性是否属于原型链的属性：

```javascript
function iterate(obj){
   var res=[];
   for(var key in obj){
        if(obj.hasOwnProperty(key))
           res.push(key+': '+obj[key]);
   }
   return res;
} 
```

------

## 对象创建和对象继承

### 1.继承对象方法

[ES6的Class](https://juejin.cn/post/7000891889465425957#heading-13)

#### 类的基础

ES6 的`class`可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的`class`写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已

```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
```

上面代码定义了一个“类”，可以看到里面有一个`constructor()`方法，这就是构造方法，而`this`关键字则代表实例对象。这种新的 Class 写法，本质上与本章开头的 ES5 的构造函数`Point`是一致的。

`Point`类除了构造方法，还定义了一个`toString()`方法。注意，定义`toString()`方法的时候，前面不需要加上`function`这个关键字，直接把函数定义放进去了就可以了。另外，方法与方法之间不需要逗号分隔，加了会报错。

ES6 的类，完全可以看作构造函数的另一种写法。

```javascript
class Point {
  // ...
}

typeof Point // "function"
Point === Point.prototype.constructor // true
```

上面代码表明，类的数据类型就是函数，类本身就指向构造函数。

使用的时候，也是直接对类使用`new`命令，跟构造函数的用法完全一致。

```js
class Bar {
  doStuff() {
    console.log('stuff');
  }
}

const b = new Bar();
b.doStuff() // "stuff"
```

构造函数的`prototype`属性，在 ES6 的“类”上面继续存在。事实上，类的所有方法都定义在类的`prototype`属性上面。

```js
class Point {
  constructor() {
    // ...
  }

  toString() {
    // ...
  }

  toValue() {
    // ...
  }
}

// 等同于

Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
};
```

上面代码中，`constructor()`、`toString()`、`toValue()`这三个方法，其实都是定义在`Point.prototype`上面。

因此，在类的实例上面调用方法，其实就是调用原型上的方法。

```js
class B {}
const b = new B();

b.constructor === B.prototype.constructor // true
```

上面代码中，`b`是`B`类的实例，它的`constructor()`方法就是`B`类原型的`constructor()`方法。

由于类的方法都定义在`prototype`对象上面，所以类的新方法可以添加在`prototype`对象上面。`Object.assign()`方法可以很方便地一次向类添加多个方法。

```js
class Point {
  constructor(){
    // ...
  }
}

Object.assign(Point.prototype, {
  toString(){},
  toValue(){}
});
```

`prototype`对象的`constructor()`属性，直接指向“类”的本身，这与 ES5 的行为是一致的。

```javascript
Point.prototype.constructor === Point // true
```

另外，类的内部所有定义的方法，都是不可枚举的（non-enumerable）。

```js
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype)
// []
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]
```

上面代码中，`toString()`方法是`Point`类内部定义的方法，它是不可枚举的。这一点与 ES5 的行为不一致。

```
var Point = function (x, y) {
  // ...
};

Point.prototype.toString = function () {
  // ...
};

Object.keys(Point.prototype)
// ["toString"]
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]
```

上面代码采用 ES5 的写法，`toString()`方法就是可枚举的。

#### constructor 方法

`constructor()`方法是类的默认方法，通过`new`命令生成对象实例时，自动调用该方法。一个类必须有`constructor()`方法，如果没有显式定义，一个空的`constructor()`方法会被默认添加。

```javascript
class Point {
}

// 等同于
class Point {
  constructor() {}
}
```

上面代码中，定义了一个空的类`Point`，JavaScript 引擎会自动为它添加一个空的`constructor()`方法。

`constructor()`方法默认返回实例对象（即`this`），完全可以指定返回另外一个对象。

```javascript
class Foo {
  constructor() {
    return Object.create(null);
  }
}

new Foo() instanceof Foo
// false
```

上面代码中，`constructor()`函数返回一个全新的对象，结果导致实例对象不是`Foo`类的实例。

类必须使用`new`调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用`new`也可以执行。

```javascript
class Foo {
  constructor() {
    return Object.create(null);
  }
}

Foo()
// TypeError: Class constructor Foo cannot be invoked without 'new'
```







毫无疑问的，class机制还是在prototype的基础之上进行封装的
——contructor 执行构造函数相关赋值
——使用 Object.defineProperty()方法 将方法添加的构造函数的原型上或构造函数上
——使用 Object.create() 和 Object.setPrototypeOf 实现类之间的继承 子类原型__proto__指向父类原型 子类构造函数__proto__指向父类构造函数
——通过变更子类的this 作用域实现super()



#### 一、原型链继承

> 将父类的实例作为子类的原型

```javascript
function Parent() {
   this.isShow = true
   this.info = {
       name: "yhd",
       age: 18,
   };
}
Parent.prototype.getInfo = function() {
   console.log(this.info);
   console.log(this.isShow); // true
}

function Child() {};
Child.prototype = new Parent();

let Child1 = new Child();
Child1.info.gender = "男";
Child1.getInfo();  // {name: "yhd", age: 18, gender: "男"}

let child2 = new Child();
child2.getInfo();  // {name: "yhd", age: 18, gender: "男"}
child2.isShow = false

console.log(child2.isShow); // false
```

**优点：**

> 1、父类方法可以复用

**缺点：**

> 1. 父类的所有`引用属性`（info）会被所有子类共享，更改一个子类的引用属性，其他子类也会受影响
> 2. 子类型实例不能给父类型构造函数传参

#### 二、构造函数继承

> 在子类构造函数中调用父类构造函数，可以在子类构造函数中使用`call()`和`apply()`方法

```javascript
function Parent() {
  this.info = {
    name: "yhd",
    age: 19,
  }
}

function Child() {
    Parent.call(this)
}

let child1 = new Child();
child1.info.gender = "男";
console.log(child1.info); // {name: "yhd", age: 19, gender: "男"};

let child2 = new Child();
console.log(child2.info); // {name: "yhd", age: 19}
```

 通过使用`call()`或`apply()`方法，`Parent`构造函数在为`Child`的实例创建的新对象的上下文执行了，就相当于新的`Child`实例对象上运行了`Parent()`函数中的所有初始化代码，结果就是每个实例都有自己的`info`属性。

 **1、传递参数**

 相比于原型链继承，盗用构造函数的一个优点在于可以在子类构造函数中像父类构造函数传递参数。

```javascript
function Parent(name) {
    this.info = { name: name };
}
function Child(name) {
    //继承自Parent，并传参
    Parent.call(this, name);
    
     //实例属性
    this.age = 18
}

let child1 = new Child("yhd");
console.log(child1.info.name); // "yhd"
console.log(child1.age); // 18

let child2 = new Child("wxb");
console.log(child2.info.name); // "wxb"
console.log(child2.age); // 18

```

 在上面例子中，`Parent`构造函数接收一个`name`参数，并将他赋值给一个属性，在`Child`构造函数中调用`Parent`构造函数时传入这个参数， 实际上会在`Child`实例上定义`name`属性。为确保`Parent`构造函数不会覆盖`Child`定义的属性，可以在调用父类构造函数之后再给子类实例添加额外的属性

**优点:**

> 1. 可以在子类构造函数中向父类传参数
> 2. 父类的引用属性不会被共享

**缺点：**

> 1. 子类不能访问父类原型上定义的方法（即不能访问Parent.prototype上定义的方法），因此所有方法属性都写在构造函数中，每次创建实例都会初始化

------

#### 三、组合继承

> 组合继承综合了`原型链继承`和`构造函数继承`，将两者的优点结合了起来，
>
> 基本的思路就是使用原型链继承原型上的属性和方法，而通过构造函数继承实例属性，这样既可以把方法定义在原型上以实现重用，又可以让每个实例都有自己的属性

```javascript
function Parent(name) {
   this.name = name
   this.colors = ["red", "blue", "yellow"]
}
Parent.prototype.sayName = function () {
   console.log(this.name);
}

function Child(name, age) {
   // 继承父类属性
   Parent.call(this, name)
   this.age = age;
}
// 继承父类方法
Child.prototype = new Parent();

Child.prototype.sayAge = function () {
   console.log(this.age);
}

let child1 = new Child("yhd", 19);
child1.colors.push("pink");
console.log(child1.colors); // ["red", "blue", "yellow", "pink"]
child1.sayAge(); // 19
child1.sayName(); // "yhd"

let child2 = new Child("wxb", 30);
console.log(child2.colors);  // ["red", "blue", "yellow"]
child2.sayAge(); // 30
child2.sayName(); // "wxb"

```

 上面例子中，`Parent构造函数`定义了`name，colors`两个属性，接着又在他的原型上添加了个`sayName()`方法。`Child构造函数`内部调用了`Parent构造函数`，同时传入了`name`参数，同时`Child.prototype`也被赋值为`Parent实例`，然后又在他的原型上添加了个`sayAge()`方法。这样就可以创建 `child1，child2两个实例`，让这两个实例都有自己的属性，包括`colors`，同时还共享了父类的`sayName`方法

 **优点：**

> 1. 父类的方法可以复用
> 2. 可以在Child构造函数中向Parent构造函数中传参
> 3. 父类构造函数中的引用属性不会被共享

------

#### 四、原型式继承

> 对参数对象的一种浅复制

```javascript
function objectCopy(obj) {
  function Fun() { };
  Fun.prototype = obj;
  return new Fun()
}

let person = {
  name: "yhd",
  age: 18,
  friends: ["jack", "tom", "rose"],
  sayName:function() {
    console.log(this.name);
  }
}

let person1 = objectCopy(person);
person1.name = "wxb";
person1.friends.push("lily");
person1.sayName(); // wxb

let person2 = objectCopy(person);
person2.name = "gsr";
person2.friends.push("kobe");
person2.sayName(); // "gsr"

console.log(person.friends); // ["jack", "tom", "rose", "lily", "kobe"]

```

**优点：**

> 1. 父类方法可复用

**缺点：**

> 1. 父类的引用会被所有子类所共享
> 2. 子类实例不能向父类传参

> ES5的Object.create()方法在只有第一个参数时，与这里的objectCopy()方法效果相同

------

#### 五、寄生式继承

> 使用原型式继承对一个目标对象进行浅复制，增强这个浅复制的能力

```javascript
function objectCopy(obj) {
  function Fun() { };
  Fun.prototype = obj;
  return new Fun();
}

function createAnother(original) {
  let clone = objectCopy(original);
  clone.getName = function () {
    console.log(this.name);
  };
  return clone;
}

let person = {
     name: "yhd",
     friends: ["rose", "tom", "jack"]
}

let person1 = createAnother(person);
person1.friends.push("lily");
console.log(person1.friends);
person1.getName(); // yhd

let person2 = createAnother(person);
console.log(person2.friends); // ["rose", "tom", "jack", "lily"]
```

------

#### 六、寄生式组合继承

```js
function objectCopy(obj) {
  function Fun() { };
  Fun.prototype = obj;
  return new Fun();
}

function inheritPrototype(child, parent) {
  let prototype = objectCopy(parent.prototype); // 创建对象
  prototype.constructor = child; // 增强对象
  Child.prototype = prototype; // 赋值对象
}

function Parent(name) {
  this.name = name;
  this.friends = ["rose", "lily", "tom"]
}

Parent.prototype.sayName = function () {
  console.log(this.name);
}

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

inheritPrototype(Child, Parent);
Child.prototype.sayAge = function () {
  console.log(this.age);
}

let child1 = new Child("yhd", 23);
child1.sayAge(); // 23
child1.sayName(); // yhd
child1.friends.push("jack");
console.log(child1.friends); // ["rose", "lily", "tom", "jack"]

let child2 = new Child("yl", 22)
child2.sayAge(); // 22
child2.sayName(); // yl
console.log(child2.friends); // ["rose", "lily", "tom"]
```

**优点：**

> 1. 只调用一次父类构造函数
> 2. Child可以向Parent传参
> 3. 父类方法可以复用
> 4. 父类的引用属性不会被共享

> 寄生式组合继承可以算是引用类型继承的最佳模式

### 2.创建对象方法

首先解释几个概念：

> 1. 对象 下面例子中所有的Person函数
> 2. 实例/对象实例 通过`new Person()` or `Person()`返回的对象，如`var person1 = new Person()`中的person1
> 3. 原型对象`Person.prototype`

#### 工厂模式

```js
function Person() {
  var o = new Object();
  o.name = 'hanmeimei';
  o.say = function() {
    alert(this.name);
  }
  return o;
}

var person1 = Person();
```

**优点：**完成了返回一个对象的要求。

**缺点：**

1. 无法通过constructor识别对象，以为都是来自Object，无法得知来自Person
2. 每次通过Person创建对象的时候，所有的say方法都是一样的，但是却存储了多次，浪费资源。

#### 构造函数模式

```js
function Person() {
  this.name = 'hanmeimei';
  this.say = function() {
    alert(this.name)
  }
}

var person1 = new Person();
```

**优点：**

1. 通过constructor或者instanceof可以识别对象实例的类别
2. 可以通过new 关键字来创建对象实例，更像OO语言中创建对象实例

**缺点：**

1. 多个实例的say方法都是实现一样的效果，但是却存储了很多次（两个对象实例的say方法是不同的，因为存放的地址不同）

**注意：**

1. 构造函数模式隐试的在最后返回`return this` 所以在缺少new的情况下，会将属性和方法添加给全局对象，浏览器端就会添加给window对象。
2. 也可以根据`return this` 的特性调用call或者apply指定this。这一点在后面的继承有很大帮助。

#### 原型模式

```js
function Person() {}
Person.prototype.name = 'hanmeimei';
Person.prototype.say = function() {
  alert(this.name);
}
Person.prototype.friends = ['lilei'];

var person1 = new Person();
```

**优点：**

1. say方法是共享的了，所有的实例的say方法都指向同一个。

2. 可以动态的添加原型对象的方法和属性，并直接反映在对象实例上。

   ```js
   var person1 = new Person()
   Person.prototype.showFriends = function() {
     console.log(this.friends)
   }
   person1.showFriends()  //['lilei']
   ```

**缺点：**

1. 出现引用的情况下会出现问题具体见下面代码：

   ```
   var person1 = new Person();
   var person2 = new Person();
   person1.friends.push('xiaoming');
   console.log(person2.friends)  //['lilei', 'xiaoming']
   ```

   因为js对引用类型的赋值都是将地址存储在变量中，所以person1和person2的friends属性指向的是同一块存储区域。

2. 第一次调用say方法或者name属性的时候会搜索两次，第一次是在实例上寻找say方法，没有找到就去原型对象(Person.prototype)上找say方法，找到后就会在实力上添加这些方法or属性。

3. 所有的方法都是共享的，没有办法创建实例自己的属性和方法，也没有办法像构造函数那样传递参数。

**注意：**

1. 优点②中存在一个问题就是直接通过对象字面量给`Person.prototype`进行赋值的时候会导致`constructor`改变，所以需要手动设置，其次就是通过对象字面量给`Person.prototype`进行赋值，会无法作用在之前创建的对象实例上

   ```js
   var person1 = new Person()
   Person.prototype = {
   	name: 'hanmeimei2',
     	setName: function(name){
         this.name = name
     	}
   }
   
   person1.setName()   //Uncaught TypeError: person1.set is not a function(…)
   ```

   这是因为对象实例和对象原型直接是通过一个指针链接的，这个指针是一个内部属性[[Prototype]]，可以通过`__proto__`访问。我们通过对象字面量修改了Person.prototype指向的地址，然而对象实例的`__proto__`，并没有跟着一起更新，所以这就导致，实例还访问着原来的`Person.prototype`，所以建议不要通过这种方式去改变`Person.prototype`属性

#### 构造函数和原型组合模式

```js
function Person(name) {
  this.name = name
  this.friends = ['lilei']
}
Person.prototype.say = function() {
  console.log(this.name)
}

var person1 = new Person('hanmeimei')
person1.say() //hanmeimei
```

**优点：**

1. 解决了原型模式对于引用对象的缺点
2. 解决了原型模式没有办法传递参数的缺点
3. 解决了构造函数模式不能共享方法的缺点

**缺点：**

1. 和原型模式中注意①一样

#### 动态原型模式

```js
function Person(name) {
  this.name = name
  if(typeof this.say != 'function') {
    Person.prototype.say = function(
    alert(this.name)
  }
}
```

**优点：**

1. 可以在初次调用构造函数的时候就完成原型对象的修改
2. 修改能体现在所有的实例中

**缺点：**红宝书都说这个方案完美了。。。。

**注意：**

1. 只用检查一个在执行后应该存在的方法或者属性就行了
2. 不能用对象字面量修改原型对象

#### 寄生构造函数模式

```js
function Person(name) {
  var o = new Object()
  o.name = name
  o.say = function() {
    alert(this.name)
  }
  return o
}

var peron1 = new Person('hanmeimei')
```

**优点：**

1. 和工厂模式基本一样，除了多了个new操作符

**缺点：**

1. 和工厂模式一样，不能区分实例的类别

#### 稳妥构造模式

```js
function Person(name) {
  var o = new Object()
  o.say = function() {
    alert(name)
  }
}

var person1 = new Person('hanmeimei');
person1.name  // undefined
person1.say() //hanmeimei
```

**优点：**

1. 安全，那么好像成为了私有变量，只能通过say方法去访问

**缺点：**

1. 不能区分实例的类别

------

## 异步编程

### 1.什么是回调地狱，promise的出现解决了什么问题

Promise 是异步编程的一种解决方案： 从语法上讲，promise是一个对象，从它可以获取异步操作的消息；从本意上讲，它是承诺，承诺它过一段时间会给你一个结果。 promise有三种状态：**pending(等待态)，fulfiled(成功态)，rejected(失败态)**；状态一旦改变，就不会再变。创造promise实例后，它会立即执行。

一个异步请求套着一个异步请求，一个异步请求依赖于另一个的执行结果，使用回调的方式相互嵌套

缺点

- 嵌套函数存在耦合性，一旦有所改动，就会牵一发而动全身
- 嵌套函数一多，就很难处理错误

当然，回调函数还存在着别的几个缺点，比如不能使用 `try catch` 捕获错误，不能直接 `return`。

从表面上看，Promise只是能够简化层层回调的写法，而实质上Promise的精髓是“状态”，用维护状态、传递状态的方式来使得回调函数能够及时调用，它比传递callback 函数要简单、灵活的多

通过Promise这种方式很好的解决了回调地狱问题，使得异步过程同步化，让代码的整体逻辑与大脑的思维逻辑一致，减少出错率。

### 2.promise的方法

-   Promise.resolve(value)

>   类方法，该方法返回一个以 value 值解析后的 Promise 对象 1、如果这个值是个 thenable（即带有 then 方法），返回的 Promise 对象会“跟随”这个 thenable 的对象，采用它的最终状态（指 resolved/rejected/pending/settled）
>   2、如果传入的 value 本身就是 Promise 对象，则该对象作为 Promise.resolve 方法的返回值返回。
>   3、其他情况以该值为成功状态返回一个 Promise 对象。

-   Promise.reject

>   类方法，且与 resolve 唯一的不同是，返回的 promise 对象的状态为 rejected。

-   Promise.prototype.then

>   实例方法，为 Promise 注册回调函数，函数形式：fn(vlaue){}，value 是上一个任务的返回结果，then 中的函数一定要 return 一个结果或者一个新的 Promise 对象，才可以让之后的then 回调接收。
>
>   console.log(Promise.resolve().then())
>
>   then内部默认  return Promise.resolve(undefined)；

-   Promise.prototype.catch

>   实例方法，捕获异常，函数形式：fn(err){}, err 是 catch 注册 之前的回调抛出的异常信息。

-    Promise.prototype.finally()

>实例方法  在promise结束时，无论结果是fulfilled或者是rejected，都会执行指定的回调函数。这为在`Promise`是否成功完成后都需要执行的代码提供了一种方式。
>
>这避免了同样的语句需要在`then()`和`catch()`中各写一次的情况

-   Promise.race

>   类方法，多个 Promise 任务同时执行，返回最先执行结束的 Promise 任务的结果，不管这个 Promise 结果是成功还是失败。 。

-   Promise.all

>   类方法，多个 Promise 任务同时执行。
>   如果全部成功执行，则以数组的方式返回所有 Promise 任务的执行结果。 如果有一个 Promise 任务 rejected，则只返回 rejected 任务的结果。

-   Promise.allSettled

>类方法  
>
>返回一个在所有给定的promise都已经`fulfilled`或`rejected`后的promise，并带有一个对象数组，每个对象表示对应的promise结果。
>
>当您有多个彼此不依赖的异步任务成功完成时，或者您总是想知道每个`promise`的结果时，通常使用它

-   Promise.any

>类方法，Promise.any()接收一个Promise可迭代对象，只要其中的一个 `promise` 成功，就返回那个已经成功的 `promise` 。如果可迭代对象中没有一个 `promise` 成功（即所有的 `promises` 都失败/拒绝），就返回一个失败的 promise

### 3.async和await解决了什么问题，优势在哪，底层原理是什么

`async` 函数是 `Generator` 函数的语法糖。使用 关键字 `async` 来表示，在函数内部使用 `await` 来表示异步。相较于 `Generator`，`async` 函数的改进在于下面四点：

- **内置执行器**。`Generator` 函数的执行必须依靠执行器，而 `async` 函数自带执行器，调用方式跟普通函数的调用一样
- **更好的语义**。`async` 和 `await` 相较于 `*` 和 `yield` 更加语义化
- **更广的适用性**。`co` 模块约定，`yield` 命令后面只能是 Thunk 函数或 Promise对象。而 `async` 函数的 `await` 命令后面则可以是 Promise 或者 原始类型的值（Number，string，boolean，但这时等同于同步操作）
- **返回值是 Promise**。`async` 函数返回值是 Promise 对象，比 Generator 函数返回的 Iterator 对象方便，可以直接使用 `then()` 方法进行调用

`await`意思是async wait(异步等待)。这个关键字只能在使用`async`定义的函数里面使用。任何`async`函数都会默认返回`promise`，并且这个`promise`解析的值都将会是这个函数的返回值，而`async`函数必须等到内部所有的 `await` 命令的 `Promise` 对象执行完，才会发生状态改变。

必须等所有`await` 函数执行完毕后，才会告诉`promise`我成功了还是失败了，执行`then`或者`catch`

>  **很多人以为`await`会一直等待之后的表达式执行完之后才会继续执行后面的代码，实际上`await`是一个让出线程的标志。`await`后面的函数会先执行一遍(比如await Fn()的Fn ,并非是下一行代码)，然后就会跳出整个`async`函数来执行后面js栈的代码。等本轮事件循环执行完了之后又会跳回到`async`函数中等待await后面表达式的返回值，如果返回值为非`promise`则继续执行`async`函数后面的代码，否则将返回的`promise`放入`Promise`队列（Promise的Job Queue）**

#### async 做了什么

带 async 关键字的函数，它使得函数的返回值必是promise对象
如果 async 关键字函数返回的不是promise，会自动用Promise.resolve() 包装
如果 async 关键字函数显式的返回 promise，以你返回的promise为准

```js
async function fn1(){
    return 123
}

function fn2(){
    return 123
}

console.log(fn1())   // Promise {<resolved>: 123}
console.log(fn2())   // 123
```

  用Promise.resolve() 包装

````js
async function fn1(){
    return 123   //不返回 则是undefined
}
let  promise=fn1()
promise.then(res=>{
  console.log(res)
})
//123
````



```js
async function fn1(){
    throw new Error("error6666")
}
let  promise=fn1()
promise.catch(err=>{
  console.log("999",err)
})
//999 Error: error6666
```



以返回的promise为准

```js
async function fn1(){
    return new Promise((resolve,reject)=>{
      resolve(123)
    })
}
let  promise=fn1()
promise.then(res=>{
  console.log(res)
})
//123
```



#### await 等的是右侧 [表达式] 的结果

```js
async function async1() {
    await async2()
    console.log( 'async1 end' )
}
async function async2() {
    console.log( 'async2' )
}
async1()
console.log( 'script start' )

 async2
 script start
 async1 end
```

也就是遇到await后，阻塞的是await当前行之后的代码

let  b=await async2()  b拿到的是async2的返回的promise的resolve的值

await需要等待结果  然后跳出函数  执行外面的代码  然后 resolve之后再去执行await后面的代码

-   当await 接收的值非Promise 对象时，它会将返回值包装成Promise.then(返回值)将值和恢复执行的消息一起添加到消息队列中；
-   如果是Promise对象，**先添加到消息队列，等待可用值**；等有可用值后**再把恢复执行的消息添加到消息队列**；有两个添加到消息队列的操作。

#### await等到之后，做了什么事情

右侧表达式的结果，就是await要等的东西  等待的就是async的返回值
等到之后，对await来说，分2种情况

- 不是promise对象
- 是 promise 对象

如果不是promise，await会阻塞后面的代码，先执行async外面的同步代码，同步代码执行完，再回到async内部，把这个非promise的东西，作为 await表达式的结果

如果它等到的是一个 promise 对象，await 也会暂停async后面的代码，先执行async外面的同步代码，等着 Promise 对象 fulfilled，然后把 resolve 的参数作为 await 表达式的运算结果

```javascript
    async function async1() {
        console.log( 'async1 start' )
        await async2()
        console.log( 'async1 end' )
    }
    
    async function async2() {
        console.log( 'async2' )
    }
    
    console.log( 'script start' )
    
    setTimeout( function () {
        console.log( 'setTimeout' )
    }, 0 )
    
    async1();
    
    new Promise( function ( resolve ) {
        console.log( 'promise1' )
        resolve();
    } ).then( function () {
        console.log( 'promise2' )
    } )
    
    console.log( 'script end' )

```

执行顺序：

同步代码 **console.log( ‘script start’ )**
将 setTimeout 放入宏任务队列
执行 async1() 函数 **console.log( ‘async1 start’ )**
分析下 await async2()
先得到 await 右侧表达式的结果. 执行 async2() ，打印同步代码

 **console.log( ‘async2’ )**，并且 return Promise.resolve(undefined)；
await 后，中断async函数，先执行async外的同步代码
被阻塞后，执行async之外的代码
执行 new Promise()， **console.log( ‘promise1’ )**
promise.then()，发现这个是微任务，所以暂时不打印，只是推入当前宏任务的微任务队列中。
打印同步代码 **console.log( ‘script end’ )**
执行完同步代码后，执行 await Promise.resolve(undefined) 了，类似于Promise.resolve(undefined) .then((undefined) => { })
微任务队列，先进先出原则：

任务1， console.log( ‘promise2’ )
任务2 ，Promise.resolve(undefined)，语句结束后，后面的代码不再被阻塞，所以打印 console.log( ‘async1 end’ )
宏任务队列，console.log(‘setTimeout’)





### 4.async/await 用法，如何捕获异常

JavaScript 中的 thunk 函数（译为转换程序）简单来说就是把带有回调函数的多参数函数转换成只接收回调函数的单参数版本



每次执行 generator 函数thunk 函数的真正作用是统一多参数函数的调用方式，在 next 调用时把控制权交还给 generator，使 generator 函数可以使用递归方式自启动流程

自己写启动器比较麻烦。 [co函数库](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ftj%2Fco) 是一个 generator 函数的自启动执行器，使用条件是 generator 函数的 yield 命令后面，只能是 thunk 函数或 Promise 对象，co 函数执行完返回一个 Promise 对象vv一句话，async、await 是 co 库的官方实现。也可以看作自带启动器的 generator 函数的语法糖。不同的是，async、await 只支持 Promise 和原始类型的值，不支持 thunk 函数。

`async` 函数返回的是一个`Promise`对象，如果函数中有返回值。则通过`Promise.resole()`封装成`Promise`对象，当然我们就可以使用`then()`就可以取出这个值。`async`只能配套和`await`使用，单独使用就会报错。

```js
async function foo(){
  let bar = await test()
}
```

`await` 后面接受一个`Promise` 对象。当`Promise`对象状态变化的时候，得到返回值。`async`函数完全可以看作多个异步操作，封装成的一个`Promise`对象，而`await`就是内部`then`命令的语法糖，用同步的书写方式实现异步代码。

如果`await`后面的异步操作出错，那么等同于async函数返回的 `Promise` 对象被`reject`。

防止出错的方法就是我们将其放在`try/catch`代码块中。并且能够捕获异常。

```js
async function fn(){
    try{
        let a = await Promise.reject('error')
    }catch(error){
        console.log(error)
    }
}
```

实现

```js
function asyncToGenerator(generatorFunc) {
  // 返回的是一个新的函数
  return function() {
  
    // 先调用generator函数 生成迭代器
    // 对应 var gen = testG()
    const gen = generatorFunc.apply(this, arguments)

    // 返回一个promise 因为外部是用.then的方式 或者await的方式去使用这个函数的返回值的
    // var test = asyncToGenerator(testG)
    // test().then(res => console.log(res))
    return new Promise((resolve, reject) => {
    
      // 内部定义一个step函数 用来一步一步的跨过yield的阻碍
      // key有next和throw两种取值，分别对应了gen的next和throw方法
      // arg参数则是用来把promise resolve出来的值交给下一个yield
      function step(key, arg) {
        let generatorResult
        
        // 这个方法需要包裹在try catch中
        // 如果报错了 就把promise给reject掉 外部通过.catch可以获取到错误
        try {
          generatorResult = gen[key](arg)
        } catch (error) {
          return reject(error)
        }

        // gen.next() 得到的结果是一个 { value, done } 的结构
        const { value, done } = generatorResult

        if (done) {
          // 如果已经完成了 就直接resolve这个promise
          // 这个done是在最后一次调用next后才会为true
          // 以本文的例子来说 此时的结果是 { done: true, value: 'success' }
          // 这个value也就是generator函数最后的返回值
          return resolve(value)
        } else {
          // 除了最后结束的时候外，每次调用gen.next()
          // 其实是返回 { value: Promise, done: false } 的结构，
          // 这里要注意的是Promise.resolve可以接受一个promise为参数
          // 并且这个promise参数被resolve的时候，这个then才会被调用
          return Promise.resolve(
            // 这个value对应的是yield后面的promise
            value
          ).then(
            // value这个promise被resove的时候，就会执行next
            // 并且只要done不是true的时候 就会递归的往下解开promise
            // 对应gen.next().value.then(value => {
            //    gen.next(value).value.then(value2 => {
            //       gen.next() 
            //
            //      // 此时done为true了 整个promise被resolve了 
            //      // 最外部的test().then(res => console.log(res))的then就开始执行了
            //    })
            // })
            function onResolve(val) {
              step("next", val)
            },
            // 如果promise被reject了 就再次进入step函数
            // 不同的是，这次的try catch中调用的是gen.throw(err)
            // 那么自然就被catch到 然后把promise给reject掉啦
            function onReject(err) {
              step("throw", err)
            },
          )
        }
      }
      step("next")
    })
  }
}
```



### 5.promisify实现

在实际的项目需求中,经常会遇到函数需要链式调用的情况

而在ES6之前,基本采用的是callback回调的形式,

在ES6提供了原生Promise 对象后,可以自己构造一个Promise对象来实现需求

```js

function promisify(fn) {
    console.log(fn,"fn"); // 保存的是原始函数(add)
    return function (...args) {
        console.log(...args,"...args"); // 2 6 保存的是调用时的参数
        返回promise对象
        return new Promise(function (resolve, reject) {
            // 将callback放到参数末尾,并执行callback函数
            args.push(function (err, ...arg) {
                console.log(...args,"12"); // 2 6 callback,
                if (err) {
                    reject(err);
                    return;
                }
                resolve(...arg);
            });

            fn.apply(null, args);
        });
    }
}

// 示例
let add = (a,b, callback) => {
    let result = a+b;
    if(typeof result === 'number') {
        callback(null,result)
    }else {
        callback("请输入正确数字")
    }
}

const addCall = promisify(add);
addCall(2,6).then((res) => {
    console.log(res);
})
```

保存原始函数,将callback函数添加到参数末尾进行执行,将结果通过promise对象返回

```js

function promisify(original) {
    function fn(...args) {
        return new Promise((resolve, reject) => {
            args.push((err, ...values) => {
                if (err) {
                    return reject(err);
                }
                resolve(values);
            });
            Reflect.apply(original, this, args);
        });
    }
    return fn;
}
```

```js

let add = (a,b, callback) => {
    let result = a+b;
    if(typeof result === 'number') {
        callback(null,result)
    }else {
        callback("请输入正确数字")
    }
}

const addCall = promisify(add);
async function load() {
    try{
        const res = await addCall(2,6)
        console.log(res);
    }catch(err){
        console.log(err);
    }
}
load()
```

### 6.异步和同步的理解

#### 单线程

单线程指的是，`JavaScript` 只在一个线程上运行。也就是说，`JavaScript` 同时只能执行一个任务，其他任务都必须在后面排队等待。

`JavaScript` 之所以采用单线程，而不是多线程，跟历史有关系。`JavaScript` 从诞生起就是单线程，原因是不想让浏览器变得太复杂，因为多线程需要共享资源、且有可能修改彼此的运行结果，对于一种网页脚本语言来说，这就太复杂了。

**单线程的好处**：

- 实现起来比较简单
- 执行环境相对单纯

**单线程的坏处**：

- 坏处是只要有一个任务耗时很长，后面的任务都必须排队等着，会拖延整个程序的执行

如果排队是因为计算量大，`CPU` 忙不过来，倒也算了，但是很多时候 `CPU` 是闲着的，因为 `IO` 操作（输入输出）很慢（比如 `Ajax` 操作从网络读取数据），不得不等着结果出来，再往下执行。`JavaScript` 语言的设计者意识到，这时 `CPU` 完全可以不管 `IO` 操作，挂起处于等待中的任务，先运行排在后面的任务。等到 `IO` 操作返回了结果，再回过头，把挂起的任务继续执行下去。这种机制就是 `JavaScript` 内部采用的 **“事件循环”机制**（`Event Loop`）。

单线程虽然对 `JavaScript` 构成了很大的限制，但也因此使它具备了其他语言不具备的优势。如果用得好，`JavaScript` 程序是不会出现堵塞的，这就是为什么 `Node` 可以用很少的资源，应付大流量访问的原因。

为了利用多核 `CPU` 的计算能力，`HTML5` 提出 `Web Worker` 标准，允许 `JavaScript` 脚本创建多个线程，但是子线程完全受主线程控制，且不得操作 `DOM`。所以，这个新标准并没有改变 `JavaScript` 单线程的本质。

#### 同步

同步行为对应内存中顺序执行的处理器指令。每条指令都会严格按照它们出现的顺序来执行，而每条指令执行后也能立即获得存储在系统本地（如寄存器或系统内存）的信息。这样的执行流程容易分析程序在执行到代码任意位置时的状态（比如变量的值）。

同步操作的例子可以是执行一次简单的数学计算：

```javascript
let xhs = 3

xhs = xhs + 4
```

在程序执行的每一步，都可以推断出程序的状态。这是因为后面的指令总是在前面的指令完成后才会执行。等到最后一条指定执行完毕，存储在 `xhs` 的值就立即可以使用。

首先，操作系统会在栈内存上分配一个存储浮点数值的空间，然后针对这个值做一次数学计算，再把计算结果写回之前分配的内存中。所有这些指令都是在单个线程中按顺序执行的。在低级指令的层面，有充足的工具可以确定系统状态。

#### 异步

异步行为类似于系统中断，即当前进程外部的实体可以触发代码执行。异步操作经常是必要的，因为强制进程等待一个长时间的操作通常是不可行的（同步操作则必须要等）。如果代码要访问一些高延迟的资源，比如向远程服务器发送请求并等待响应，那么就会出现长时间的等待。

异步操作的例子可以是在定时回调中执行一次简单的数学计算：

```javascript
let xhs = 3

setTimeout(() => (xhs = xhs + 4), 1000)
```

这段程序最终与同步代码执行的任务一样，都是把两个数加在一起，但这一次执行线程不知道 `xhs` 值何时会改变，因为这取决于回调何时从消息队列出列并执行。

异步代码不容易推断。虽然这个例子对应的低级代码最终跟前面的例子没什么区别，但第二个指令块（加操作及赋值操作）是由系统计时器触发的，这会生成一个入队执行的中断。到底什么时候会触发这个中断，这对 `JavaScript` 运行时来说是一个黑盒，因此实际上无法预知（尽管可以保证这发生在当前线程的同步代码执行之后，否则回调都没有机会出列被执行）。无论如何，在排定回调以后基本没办法知道系统状态何时变化。

为了让后续代码能够使用 `xhs` ，异步执行的函数需要在更新 `xhs` 的值以后通知其他代码。如果程序不需要这个值，那么就只管继续执行，不必等待这个结果了。

#### 任务队列和事件循环

JavaScript 运行时，除了一个正在运行的主线程，引擎还提供一个任务队列（`task queue`），里面是各种需要当前程序处理的异步任务。（实际上，根据异步任务的类型，存在多个任务队列。为了方便理解，这里假设只存在一个队列。）

首先，主线程会去执行所有的同步任务。等到同步任务全部执行完，就会去看任务队列里面的异步任务。如果满足条件，那么异步任务就重新进入主线程开始执行，这时它就变成同步任务了。等到执行完，下一个异步任务再进入主线程开始执行。一旦任务队列清空，程序就结束执行。

异步任务的写法通常是回调函数。一旦异步任务重新进入主线程，就会执行对应的回调函数。如果一个异步任务没有回调函数，就不会进入任务队列，也就是说，不会重新进入主线程，因为没有用回调函数指定下一步的操作。

`JavaScript` 引擎怎么知道异步任务有没有结果，能不能进入主线程呢？答案就是引擎在不停地检查，一遍又一遍，只要同步任务执行完了，引擎就会去检查那些挂起来的异步任务，是不是可以进入主线程了。这种循环检查的机制，就叫做事件循环（`Event Loop`）。

### 7.并发和并行的理解

- 并发是宏观概念，我分别有任务 A 和任务 B，在一段时间内通过任务间的切换完成了这两个任务，这种情况就可以称之为并发。
- 并行是微观概念，假设 CPU 中存在两个核心，那么我就可以同时完成任务 A、B。同时完成多个任务的情况就可以称之为并行。

多核CPU可以同时执行多个进程。
扩展了说，单核CPU就可以“同时”执行多个进程。

并发
当有多个线程在操作时,如果系统只有一个CPU,则它根本不可能真正同时进行一个以上的线程，它只能把CPU运行时间划分成若干个时间段,再将时间 段分配给各个线程执行，在一个时间段的线程代码运行时，其它线程处于挂起状。.这种方式我们称之为并发(Concurrent)。

并行
当系统有一个以上CPU时,则线程的操作有可能非并发。当一个CPU执行一个线程时，另一个CPU可以执行另一个线程，两个线程互不抢占CPU资源，可以同时进行，这种方式我们称之为并行(Parallel)。

区别
并发和并行是即相似又有区别的两个概念，并行是指两个或者多个事件在同一时刻发生；而并发是指两个或多个事件在同一时间间隔内发生。在多道程序环境下，并发性是指在一段时间内宏观上有多个程序在同时运行，但在单处理机系统中，每一时刻却仅能有一道程序执行，故微观上这些程序只能是分时地交替执行。倘若在计算机系统中有多个处理机，则这些可以并发执行的程序便可被分配到多个处理机上，实现并行执行，即利用每个处理机来处理一个可并发执行的程序，这样，多个程序便可以同时执行。所以微观上说，多核CPU可以同时执行多个进程，进程数与CPU核数相当。但宏观上说，由于CPU会分时间片执行多个进程，所以实际执行进程个数会远多于CPU核数。

### 8.setTimeOut setInterval有什么区别

异步编程当然少不了定时器了，常见的定时器函数有 `setTimeout`、`setInterval`、`requestAnimationFrame`。最常用的是`setTimeout`，很多人认为 `setTimeout` 是延时多久，那就应该是多久后执行。

其实这个观点是错误的，因为 JS 是单线程执行的，如果前面的代码影响了性能，就会导致 `setTimeout` 不会按期执行。当然了，可以通过代码去修正 `setTimeout`，从而使定时器相对准确：

`setInterval`，其实这个函数作用和 `setTimeout` 基本一致，只是该函数是每隔一段时间执行一次回调函数。

通常来说不建议使用 `setInterval`。第一，它和 `setTimeout` 一样，不能保证在预期的时间执行任务。第二，它存在执行累积的问题

有循环定时器的需求，其实完全可以通过 `requestAnimationFrame` 来实现

------

## 执行上下文和闭包

### 1.执行上下文有哪些

当 `JS` 引擎解析到可执行代码片段（通常是函数调用阶段）的时候，就会先做一些执行前的准备工作，这个 **“准备工作”**，就叫做 **"执行上下文(execution context 简称 `EC`)"** 或者也可以叫做**执行环境**。

> **执行上下文** 为我们的可执行代码块提供了执行前的必要准备工作，例如变量对象的定义、作用域链的扩展、提供调用者的对象引用等信息。

`javascript` 中有三种执行上下文类型，分别是：

- **全局执行上下文**——这是默认或者说是最基础的执行上下文，一个程序中只会存在一个全局上下文，它在整个 `javascript` 脚本的生命周期内都会存在于执行堆栈的最底部不会被栈弹出销毁。全局上下文会生成一个全局对象（以浏览器环境为例，这个全局对象是 `window`），并且将 `this` 值绑定到这个全局对象上。
- **函数执行上下文**——每当一个函数被调用时，都会创建一个新的函数执行上下文（不管这个函数是不是被重复调用的）
- **Eval 函数执行上下文**—— 执行在 `eval` 函数内部的代码也会有它属于自己的执行上下文.。

#### ES3 执行上下文的内容

执行上下文是一个抽象的概念，我们可以将它理解为一个 `object` ，一个执行上下文里包括以下内容：

1. 变量对象
2. 活动对象
3. 作用域链
4. 调用者信息

##### 变量对象（`variable object` 简称 `VO`）

每个执行环境文都有一个表示变量的对象——**变量对象**，全局执行环境的变量对象始终存在，而函数这样局部环境的变量，只会在函数执行的过程中存在，在函数被调用时且在具体的函数代码运行之前，JS 引擎会用当前函数的**参数列表**（`arguments`）初始化一个 “变量对象” 并将当前执行上下文与之关联 ，函数代码块中声明的 **变量** 和 **函数** 将作为属性添加到这个变量对象上。

有一点需要注意，只有函数声明（function declaration）会被加入到变量对象中，而函数表达式（function expression）会被忽略。

全局执行上下文和函数执行上下文中的变量对象还略有不同，它们之间的差别简单来说：

1. **全局上下文中的变量对象就是全局对象**，以浏览器环境来说，就是 `window` 对象。
2. **函数执行上下文中的变量对象内部定义的属性**，是不能被直接访问的，只有当函数被调用时，变量对象（`VO`）被激活为活动对象（`AO`）时，我们才能访问到其中的属性和方法。

#### 活动对象（`activation object` 简称 `AO`）

函数进入执行阶段时，原本不能访问的变量对象被激活成为一个活动对象，自此，我们可以访问到其中的各种属性。

> 其实变量对象和活动对象是一个东西，只不过处于不同的状态和阶段而已。

#### 作用域链（`scope chain`）

**作用域** 规定了如何查找变量，也就是确定当前执行代码对变量的访问权限。当查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从父级（词法层面上的父级）执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。这样由多个执行上下文的变量对象构成的链表就叫做 **作用域链**。

函数的作用域在函数创建时就已经确定了。当函数创建时，会有一个名为 `[[scope]]` 的内部属性保存所有父变量对象到其中。当函数执行时，会创建一个执行环境，然后通过复制函数的 `[[scope]]` 属性中的对象构建起执行环境的作用域链，然后，变量对象 `VO` 被激活生成 `AO` 并添加到作用域链的前端，完整作用域链创建完成：`Scope = [AO].concat([[Scope]])`

#### ES3 执行上下文的生命周期

执行上下文的生命周期有三个阶段，分别是：

- 创建阶段
- 执行阶段
- 销毁阶段

##### 创建阶段

函数执行上下文的创建阶段，发生在函数调用时且在执行函数体内的具体代码之前，在创建阶段，JS 引擎会做如下操作：

- 用当前函数的**参数列表**（`arguments`）初始化一个 “变量对象” 并将当前执行上下文与之关联 ，函数代码块中声明的 **变量** 和 **函数** 将作为属性添加到这个变量对象上。**在这一阶段，会进行变量和函数的初始化声明，变量统一定义为 `undefined` 需要等到赋值时才会有确值，而函数则会直接定义**。

  > 有没有发现这段加粗的描述非常熟悉？没错，这个操作就是 **变量声明提升**（变量和函数声明都会提升，但是函数提升更靠前）。

- 构建作用域链（前面已经说过构建细节）

- 确定 `this` 的值

#### 执行阶段

执行阶段中，JS 代码开始逐条执行，在这个阶段，JS 引擎开始对定义的变量赋值、开始顺着作用域链访问变量、如果内部有函数调用就创建一个新的执行上下文压入执行栈并把控制权交出……

#### 销毁阶段

一般来讲当函数执行完成后，当前执行上下文（局部环境）会被弹出执行上下文栈并且销毁，控制权被重新交给执行栈上一层的执行上下文。

> 注意这只是一般情况，闭包的情况又有所不同。

闭包的定义：**有权访问另一个函数内部变量的函数**。简单说来，如果一个函数被作为另一个函数的返回值，并在外部被引用，那么这个函数就被称为闭包。

```js
function funcFactory () {
    var a = 1;
    return function () {
        alert(a);
    }
}
// 闭包
var sayA = funcFactory();
sayA();
```

当闭包的父包裹函数执行完成后，父函数本身执行环境的作用域链会被销毁，但是由于闭包的作用域链仍然在引用父函数的变量对象，导致了父函数的变量对象会一直驻存于内存，无法销毁，除非闭包的引用被销毁，闭包不再引用父函数的变量对象，这块内存才能被释放掉。过度使用闭包会造成 **内存泄露** 的问题，这块等到闭包章节再做详细分析。

#### ES3 执行上下文总结

对于 `ES3` 中的执行上下文，我们可以用下面这个列表来概括程序执行的整个过程：

1. 函数被调用
2. 在执行具体的函数代码之前，创建了执行上下文
3. 进入执行上下文的创建阶段：

   1. 初始化作用域链

   2. 创建 `arguments object` 检查上下文中的参数，初始化名称和值并创建引用副本

   3. 扫描上下文找到所有函数声明：

      1. 对于每个找到的函数，用它们的原生函数名，在变量对象中创建一个属性，该属性里存放的是一个指向实际内存地址的指针
      2. 如果函数名称已经存在了，属性的引用指针将会被覆盖

   4. 扫描上下文找到所有var 的变量声明：

      1. 对于每个找到的变量声明，用它们的原生变量名，在变量对象中创建一个属性，并且使用 `undefined` 来初始化
      2. 如果变量名作为属性在变量对象中已存在，则不做任何处理并接着扫描

   5. 确定 `this` 值
4. 进入执行上下文的执行阶段：

   1. 在上下文中运行/解释函数代码，并在代码逐行执行时分配变量值。

#### ES5 中的执行上下文

`ES5` 规范又对 `ES3` 中执行上下文的部分概念做了调整，最主要的调整，就是去除了 `ES3` 中变量对象和活动对象，以 **词法环境组件（** **`LexicalEnvironment component`）** 和 **变量环境组件（** **`VariableEnvironment component`）** 替代。所以 `ES5` 的执行上下文概念上表示大概如下：

```js
ExecutionContext = {
  ThisBinding = <this value>,
  LexicalEnvironment = { ... },
  VariableEnvironment = { ... },
}
```

对于 `ES5` 中的执行上下文，我们可以用下面这个列表来概括程序执行的整个过程：

1. 程序启动，全局上下文被创建

   1. 创建全局上下文的

       

      词法环境

      1. 创建 **对象环境记录器** ，它用来定义出现在 **全局上下文** 中的变量和函数的关系（负责处理 `let` 和 `const` 定义的变量）
      2. 创建 **外部环境引用**，值为 **`null`**

   2. 创建全局上下文的

       

      变量环境

      1. 创建 **对象环境记录器**，它持有 **变量声明语句** 在执行上下文中创建的绑定关系（负责处理 `var` 定义的变量，初始值为 `undefined` 造成声明提升）
      2. 创建 **外部环境引用**，值为 **`null`**

   3. 确定 `this` 值为全局对象（以浏览器为例，就是 `window` ）

2. 函数被调用，函数上下文被创建

   1. 创建函数上下文的

       

      词法环境

      1. 创建 **声明式环境记录器** ，存储变量、函数和参数，它包含了一个传递给函数的 **`arguments`** 对象（此对象存储索引和参数的映射）和传递给函数的参数的 **length**。（负责处理 `let` 和 `const` 定义的变量）
      2. 创建 **外部环境引用**，值为全局对象，或者为父级词法环境（作用域）

   2. 创建函数上下文的

       

      变量环境

      1. 创建 **声明式环境记录器** ，存储变量、函数和参数，它包含了一个传递给函数的 **`arguments`** 对象（此对象存储索引和参数的映射）和传递给函数的参数的 **length**。（负责处理 `var` 定义的变量，初始值为 `undefined` 造成声明提升）
      2. 创建 **外部环境引用**，值为全局对象，或者为父级词法环境（作用域）

   3. 确定 `this` 值

3. 进入函数执行上下文的执行阶段：

   1. 在上下文中运行/解释函数代码，并在代码逐行执行时分配变量值。

> 关于 ES5 中执行上下文的变更，个人感觉就是变了个概念，本质和 ES3 差别并不大。至于变更的目的，应该是为了 ES6 中的 let 和 const 服务的。

### 2.什么是闭包

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f116c4a9b8e64bbc9706249813a9b743~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

闭包是一个函数在创建时允许该自身函数访问并操作该自身函数以外的变量时所创建的作用域。

**1.「函数」和「函数内部能访问到的变量」的总和，就是一个闭包**

**2.函数和对其词法环境的引用捆绑在一起，这样的组合就是闭包**

内部函数总是可以访问其所在的外部函数中声明的变量和参数，即使在其外部函数被返回（寿命终结）了之后

本质就是上级作用域内变量的生命周期，因为被下级作用域内引用，而没有被释放。就导致上级作用域内的变量，等到下级作用域执行完以后才正常得到释放

### 3.闭包的应用场景

- 闭包的好处：
  - 变量长期驻扎在内存中
  - 避免污染全局变量
  - 私有成员的存在
- 闭包的坏处：
  - 增大内存的使用量
  - 容易造成内存泄漏

#### 闭包经典使用场景

如果创建全局变量的话，它很容易就会被污染，同名变量，或者被一些函数修改等。为了避免它被篡改，又想让它长时间保存，让他变得形似一个全局变量，可以随时去用，我们就会在这个时候，使用闭包

- 1. `return` 回一个函数

```js
var n = 10
function fn(){
    var n =20
    function f() {
       n++;
       console.log(n)
     }
    return f
}

var x = fn()
x() // 21
复制代码
```

> 这里的 return `f`, `f()`就是一个闭包，存在上级作用域的引用。

- 1. 函数作为参数

```js
var a = '林一一'
function foo(){
    var a = 'foo'
    function fo(){
        console.log(a)
    }
    return fo
}

function f(p){
    var a = 'f'
    p()
}
f(foo())
/* 输出
*   foo
/ 
```

> 使用 return `fo` 返回回来，`fo()` 就是闭包，`f(foo())` 执行的参数就是函数 `fo`，因为 `fo() 中的 a` 的上级作用域就是函数`foo()`，所以输出就是`foo`

- 1. IIFE（自执行函数）

```js
var n = '林一一';
(function p(){
    console.log(n)
})()
/* 输出
*   林一一
/ 
```

> 同样也是产生了闭包`p()`，存在 `window`下的引用 `n`。

- 1. 循环赋值

```js
for(var i = 0; i<10; i++){
  (function(j){
       setTimeout(function(){
        console.log(j)
    }, 1000) 
  })(i)
}
```

> 因为存在闭包的原因上面能依次输出1~10，闭包形成了10个互不干扰的私有作用域。将外层的自执行函数去掉后就不存在外部作用域的引用了，输出的结果就是连续的 10。为什么会连续输出10，因为 JS 是单线程的遇到异步的代码不会先执行(会入栈)，等到同步的代码执行完 `i++` 到 10时，异步代码才开始执行此时的 `i=10` 输出的都是 10。

- 1. 使用回调函数就是在使用闭包

```js
window.name = '林一一'
setTimeout(function timeHandler(){
  console.log(window.name);
}, 100)
```

- 1. 节流防抖

```js
// 节流
function throttle(fn, timeout) {
    let timer = null
    return function (...arg) {
        if(timer) return
        timer = setTimeout(() => {
            fn.apply(this, arg)
            timer = null
        }, timeout)
    }
}

// 防抖
function debounce(fn, timeout){
    let timer = null
    return function(...arg){
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, arg)
        }, timeout)
    }
}
```

- 1. 柯里化实现

```js
function curry(fn, len = fn.length) {
    return _curry(fn, len)
}

function _curry(fn, len, ...arg) {
    return function (...params) {
        let _arg = [...arg, ...params]
        if (_arg.length >= len) {
            return fn.apply(this, _arg)
        } else {
            return _curry.call(this, fn, len, ..._arg)
        }
    }
}

let fn = curry(function (a, b, c, d, e) {
    console.log(a + b + c + d + e)
})

fn(1, 2, 3, 4, 5)  // 15
fn(1, 2)(3, 4, 5)
fn(1, 2)(3)(4)(5)
fn(1)(2)(3)(4)(5)
```

### 4.闭包内存泄露问题

- 内存泄漏定义：应用程序不再需要占用的时候，由于某些原因，内存没有被操作系统或可用内存池回收。

- 内存泄漏的例子：

  - 意外的全局变量

    - 在函数内未声明的变量就赋值，这样会在全局对象创建一个新的变量。

      ```js
      function bar() {
          say = 'hehe';
      }
      
      即==
      function bar() {
          window.say ='hehe';
      }
      ```

    - 或者是使用this创建了全局的变量

      ```js
      function foo() {
          this.name = 'hehe';
      }
      foo();
      ```

  - 被遗忘的计时器或回调函数

    - 使用计时器setInterval()未清除，在老版本的IE6是无法处理循环引用的，会造成内存泄漏。

  - 脱离DOM的引用的

怎么解决

- 手动释放

  - 代码实现

    ```js
    var arr = [1, 2, 3];
    arr = null;
    ```

- 使用弱引用（weakset和weakmap）

  - 优点：WeakMap里面对element的引用就是弱引用，不会被计入垃圾回收机制的。也就是说一旦消除对该节点的引用，它的占用内存就会被垃圾回收机制释放。WeakMap保存的这个键值对，也会自动消失。

  - 代码实现

    ```js
    const vm = new WeakMap();
    const element = document.getElementById('example');
    vm.set(element, 'something');
    vm.get(element);
    ```

------

## this

### 1.call apply bind区别

它们的作用一模一样，区别仅在于传入参数的形式的不同。

- apply 接受两个参数，第一个参数指定了函数体内 this 对象的指向，第二个参数为一个带下标的集合，这个集合可以为数组，也可以为类数组，apply 方法把这个集合中的元素作为参数传递给被调用的函数。
- call 传入的参数数量不固定，跟 apply 相同的是，第一个参数也是代表函数体内的 this 指向，从第二个参数开始往后，每个参数被依次传入函数。



#### 使用 apply

```js
    var a = {
        name : "Cherry",

        func1: function () {
            console.log(this.name)
        },

        func2: function () {
            setTimeout(  function () {
                this.func1()
            }.apply(a),100);
        }

    };

    a.func2()            // Cherry
```

#### 使用 call

```js
    var a = {
        name : "Cherry",

        func1: function () {
            console.log(this.name)
        },

        func2: function () {
            setTimeout(  function () {
                this.func1()
            }.call(a),100);
        }

    };

    a.func2()            // Cherry
```

#### 使用 bind

```js
    var a = {
        name : "Cherry",

        func1: function () {
            console.log(this.name)
        },

        func2: function () {
            setTimeout(  function () {
                this.func1()
            }.bind(a)(),100);
        }

    };

    a.func2()            // Cherry
```

刚刚我们已经介绍了 apply、call、bind 都是可以改变 this 的指向的，但是这三个函数稍有不同。

在 [MDN](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FFunction%2Fapply) 中定义 apply 如下；

> apply() 方法调用一个函数, 其具有一个指定的this值，以及作为一个数组（或类似数组的对象）提供的参数

语法：

> fun.apply(thisArg, [argsArray])

- thisArg：在 fun 函数运行时指定的 this 值。需要注意的是，指定的 this 值并不一定是该函数执行时真正的 this 值，如果这个函数处于非严格模式下，则指定为 null 或 undefined 时会自动指向全局对象（浏览器中就是window对象），同时值为原始值（数字，字符串，布尔值）的 this 会指向该原始值的自动包装对象。
- argsArray：一个数组或者类数组对象，其中的数组元素将作为单独的参数传给 fun 函数。如果该参数的值为null 或 undefined，则表示不需要传入任何参数。从ECMAScript 5 开始可以使用类数组对象。浏览器兼容性请参阅本文底部内容。

apply 和 call 的区别

其实 apply 和 call 基本类似，他们的区别只是传入的参数不同。

call 的语法为：

```
fun.call(thisArg[, arg1[, arg2[, ...]]])复制代码
```

所以 apply 和 call 的区别是 call 方法接受的是若干个参数列表，而 apply 接收的是一个包含多个参数的数组。

```js
    var a ={
        name : "Cherry",
        fn : function (a,b) {
            console.log( a + b)
        }
    }

    var b = a.fn;
    b.apply(a,[1,2])     // 3
```

```js
    var a ={
        name : "Cherry",
        fn : function (a,b) {
            console.log( a + b)
        }
    }

    var b = a.fn;
    b.call(a,1,2)       // 3
```

```js
    var a ={
        name : "Cherry",
        fn : function (a,b) {
            console.log( a + b)
        }
    }

    var b = a.fn;
    b.bind(a,1,2)
```

我们会发现并没有输出，这是为什么呢，我们来看一下 [MDN](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FFunction%2Fbind) 上的文档说明：

> bind()方法创建一个新的函数, 当被调用时，将其this关键字设置为提供的值，在调用新函数时，在任何提供之前提供一个给定的参数序列。

所以我们可以看出，bind 是创建一个新的函数，我们必须要手动去调用：

```js
    var a ={
        name : "Cherry",
        fn : function (a,b) {
            console.log( a + b)
        }
    }

    var b = a.fn;
    b.bind(a,1,2)()           // 3
```

### 2.this解决了什么问题

this 是执行上下文中的一个属性，它指向最后一次调用这个方法的对象。在实际开发中，this 的指向可以通过四种调用模式来判断。

- 第一种是**函数调用模式**，当一个函数不是一个对象的属性时，直接作为函数来调用时，this 指向全局对象。
- 第二种是**方法调用模式**，如果一个函数作为一个对象的方法来调用时，this 指向这个对象。
- 第三种是**构造器调用模式**，如果一个函数用 new 调用时，函数执行前会新创建一个对象，this 指向这个新创建的对象。
- 第四种是 **apply 、 call 和 bind 调用模式**，这三个方法都可以显示的指定调用函数的 this 指向。其中 apply 方法接收两个参数：一个是 this 绑定的对象，一个是参数数组。call 方法接收的参数，第一个是 this 绑定的对象，后面的其余参数是传入函数执行的参数。也就是说，在使用 call() 方法时，传递给函数的参数必须逐个列举出来。bind 方法通过传入一个对象，返回一个 this 绑定了传入对象的新函数。这个函数的 this 指向除了使用 new 时会被改变，其他情况下都不会改变。

这四种方式，使用构造器调用模式的优先级最高，然后是 apply、call 和 bind 调用模式，然后是方法调用模式，然后是函数调用模式。

### 3.this指向绑定规则

1. 默认绑定
2. 隐式绑定
3. 硬绑定
4. new绑定

#### 默认绑定

默认绑定，在不能应用其它绑定规则时使用的默认规则，通常是独立函数调用。

```js
function sayHi(){
    console.log('Hello,', this.name);
}
var name = 'YvetteLau';
sayHi();
```

在调用Hi()时，应用了默认绑定，this指向全局对象（非严格模式下），严格模式下，this指向undefined，undefined上没有this对象，会抛出错误。

上面的代码，如果在浏览器环境中运行，那么结果就是 Hello,YvetteLau

但是如果在node环境中运行，结果就是 Hello,undefined.这是因为node中name并不是挂在全局对象上的。

#### 隐式绑定

函数的调用是在某个对象上触发的，即调用位置上存在上下文对象。典型的形式为 XXX.fun().我们来看一段代码：

```js
function sayHi(){
    console.log('Hello,', this.name);
}
var person = {
    name: 'YvetteLau',
    sayHi: sayHi
}
var name = 'Wiliam';
person.sayHi();
```

打印的结果是 Hello,YvetteLau.

sayHi函数声明在外部，严格来说并不属于person，但是在调用sayHi时,调用位置会使用person的上下文来引用函数，隐式绑定会把函数调用中的this(即此例sayHi函数中的this)绑定到这个上下文对象（即此例中的person）

需要注意的是：对象属性链中只有最后一层会影响到调用位置。

```js
function sayHi(){
    console.log('Hello,', this.name);
}
var person2 = {
    name: 'Christina',
    sayHi: sayHi
}
var person1 = {
    name: 'YvetteLau',
    friend: person2
}
person1.friend.sayHi();
```

结果是：Hello, Christina.

因为只有最后一层会确定this指向的是什么，不管有多少层，在判断this的时候，我们只关注最后一层，即此处的friend。

隐式绑定有一个大陷阱，绑定很容易丢失(或者说容易给我们造成误导，我们以为this指向的是什么，但是实际上并非如此).

```js
function sayHi(){
    console.log('Hello,', this.name);
}
var person = {
    name: 'YvetteLau',
    sayHi: sayHi
}
var name = 'Wiliam';
var Hi = person.sayHi;
Hi();
```

结果是: Hello,Wiliam.

这是为什么呢，Hi直接指向了sayHi的引用，在调用的时候，跟person没有半毛钱的关系，针对此类问题，我建议大家只需牢牢记住这个格式:XXX.fn();fn()前如果什么都没有，那么肯定不是隐式绑定。

除了上面这种丢失之外，隐式绑定的丢失是发生在回调函数中(事件回调也是其中一种)，我们来看下面一个例子:

```js
function sayHi(){
    console.log('Hello,', this.name);
}
var person1 = {
    name: 'YvetteLau',
    sayHi: function(){
        setTimeout(function(){
            console.log('Hello,',this.name);
        })
    }
}
var person2 = {
    name: 'Christina',
    sayHi: sayHi
}
var name='Wiliam';
person1.sayHi();
setTimeout(person2.sayHi,100);
setTimeout(function(){
    person2.sayHi();
},200);
```

结果为:

```js
Hello, Wiliam
Hello, Wiliam
Hello, Christina
```

- 第一条输出很容易理解，setTimeout的回调函数中，this使用的是默认绑定，非严格模式下，执行的是全局对象

- 第二条输出是不是有点迷惑了？说好XXX.fun()的时候，fun中的this指向的是XXX呢，为什么这次却不是这样了！Why?

  其实这里我们可以这样理解: setTimeout(fn,delay){ fn(); },相当于是将person2.sayHi赋值给了一个变量，最后执行了变量，这个时候，sayHi中的this显然和person2就没有关系了。

- 第三条虽然也是在setTimeout的回调中，但是我们可以看出，这是执行的是person2.sayHi()使用的是隐式绑定，因此这是this指向的是person2，跟当前的作用域没有任何关系。

#### 显式绑定

显式绑定比较好理解，就是通过call,apply,bind的方式，显式的指定this所指向的对象。

call,apply和bind的第一个参数，就是对应函数的this所指向的对象。call和apply的作用一样，只是传参方式不同。call和apply都会执行对应的函数，而bind方法不会。

```js
function sayHi(){
    console.log('Hello,', this.name);
}
var person = {
    name: 'YvetteLau',
    sayHi: sayHi
}
var name = 'Wiliam';
var Hi = person.sayHi;
Hi.call(person); //Hi.apply(person)
```

输出的结果为: Hello, YvetteLau. 因为使用硬绑定明确将this绑定在了person上。

那么，使用了硬绑定，是不是意味着不会出现隐式绑定所遇到的绑定丢失呢？显然不是这样的，不信，继续往下看。

```js
function sayHi(){
    console.log('Hello,', this.name);
}
var person = {
    name: 'YvetteLau',
    sayHi: sayHi
}
var name = 'Wiliam';
var Hi = function(fn) {
    fn();
}
Hi.call(person, person.sayHi); 
```

输出的结果是 Hello, Wiliam. 原因很简单，Hi.call(person, person.sayHi)的确是将this绑定到Hi中的this了。但是在执行fn的时候，相当于直接调用了sayHi方法(记住: person.sayHi已经被赋值给fn了，隐式绑定也丢了)，没有指定this的值，对应的是默认绑定。

现在，我们希望绑定不会丢失，要怎么做？很简单，调用fn的时候，也给它硬绑定。

```js
function sayHi(){
    console.log('Hello,', this.name);
}
var person = {
    name: 'YvetteLau',
    sayHi: sayHi
}
var name = 'Wiliam';
var Hi = function(fn) {
    fn.call(this);
}
Hi.call(person, person.sayHi);
```

此时，输出的结果为: Hello, YvetteLau，因为person被绑定到Hi函数中的this上，fn又将这个对象绑定给了sayHi的函数。这时，sayHi中的this指向的就是person对象。

至此，革命已经快胜利了，我们来看最后一种绑定规则: new 绑定。

#### new 绑定

javaScript和Ｃ＋＋不一样，并没有类，在javaScript中，构造函数只是使用new操作符时被调用的函数，这些函数和普通的函数并没有什么不同，它不属于某个类，也不可能实例化出一个类。任何一个函数都可以使用new来调用，因此其实并不存在构造函数，而只有对于函数的“构造调用”。

> 使用new来调用函数，会自动执行下面的操作：

1. 创建一个空对象，构造函数中的this指向这个空对象
2. 这个新对象被执行 [[原型]] 连接
3. 执行构造函数方法，属性和方法被添加到this引用的对象中
4. 如果构造函数中没有返回其它对象，那么返回this，即创建的这个的新对象，否则，返回构造函数中返回的对象。

```js
function _new() {
    let target = {}; //创建的新对象
    //第一个参数是构造函数
    let [constructor, ...args] = [...arguments];
    //执行[[原型]]连接;target 是 constructor 的实例
    target.__proto__ = constructor.prototype;
    //执行构造函数，将属性或方法添加到创建的空对象上
    let result = constructor.apply(target, args);
    if (result && (typeof (result) == "object" || typeof (result) == "function")) {
        //如果构造函数执行的结构返回的是一个对象，那么返回这个对象
        return result;
    }
    //如果构造函数返回的不是一个对象，返回创建的新对象
    return target;
}
```

因此，我们使用new来调用函数的时候，就会新对象绑定到这个函数的this上。

```js
function sayHi(name){
    this.name = name;
	
}
var Hi = new sayHi('Yevtte');
console.log('Hello,', Hi.name);
```

输出结果为 Hello, Yevtte, 原因是因为在var Hi = new sayHi('Yevtte');这一步，会将sayHi中的this绑定到Hi对象上。

#### 绑定优先级

我们知道了this有四种绑定规则，但是如果同时应用了多种规则，怎么办？

显然，我们需要了解哪一种绑定方式的优先级更高，这四种绑定的优先级为:

new绑定 > 显式绑定 > 隐式绑定 > 默认绑定

#### 绑定例外

凡事都有例外，this的规则也是这样。

如果我们将null或者是undefined作为this的绑定对象传入call、apply或者是bind,这些值在调用时会被忽略，实际应用的是默认绑定规则。

```js
var foo = {
    name: 'Selina'
}
var name = 'Chirs';
function bar() {
    console.log(this.name);
}
bar.call(null); //Chirs 
```

输出的结果是 Chirs，因为这时实际应用的是默认绑定规则。

#### 箭头函数

箭头函数是ES6中新增的，它和普通函数有一些区别，箭头函数没有自己的this，它的this继承于外层代码库中的this。箭头函数在使用时，需要注意以下几点:

（1）函数体内的this对象，继承的是外层代码块的this。

（2）不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。

（3）不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。

（4）不可以使用yield命令，因此箭头函数不能用作 Generator 函数。

（5）箭头函数没有自己的this，所以不能用call()、apply()、bind()这些方法去改变this的指向.

OK，我们来看看箭头函数的this是什么？

```js
var obj = {
    hi: function(){
        console.log(this);
        return ()=>{
            console.log(this);
        }
    },
    sayHi: function(){
        return function() {
            console.log(this);
            return ()=>{
                console.log(this);
            }
        }
    },
    say: ()=>{
        console.log(this);
    }
}
let hi = obj.hi();  //输出obj对象
hi();               //输出obj对象
let sayHi = obj.sayHi();
let fun1 = sayHi(); //输出window
fun1();             //输出window
obj.say();          //输出window
```

那么这是为什么呢？如果大家说箭头函数中的this是定义时所在的对象，这样的结果显示不是大家预期的，按照这个定义，say中的this应该是obj才对。

我们来分析一下上面的执行结果：

1. obj.hi(); 对应了this的隐式绑定规则，this绑定在obj上，所以输出obj，很好理解。
2. hi(); 这一步执行的就是箭头函数，箭头函数继承上一个代码库的this，刚刚我们得出上一层的this是obj，显然这里的this就是obj.
3. 执行sayHi();这一步也很好理解，我们前面说过这种隐式绑定丢失的情况，这个时候this执行的是默认绑定，this指向的是全局对象window.
4. fun1(); 这一步执行的是箭头函数，如果按照之前的理解，this指向的是箭头函数定义时所在的对象，那么这儿显然是说不通。OK，按照箭头函数的this是继承于外层代码库的this就很好理解了。外层代码库我们刚刚分析了，this指向的是window，因此这儿的输出结果是window.
5. obj.say(); 执行的是箭头函数，当前的代码块obj中是不存在this的，只能往上找，就找到了全局的this，指向的是window.

#### 箭头函数的this是静态的？

依旧是前面的代码。我们来看看箭头函数中的this真的是静态的吗？

```js
var obj = {
    hi: function(){
        console.log(this);
        return ()=>{
            console.log(this);
        }
    },
    sayHi: function(){
        return function() {
            console.log(this);
            return ()=>{
                console.log(this);
            }
        }
    },
    say: ()=>{
        console.log(this);
    }
}
let sayHi = obj.sayHi();
let fun1 = sayHi(); //输出window
fun1();             //输出window

let fun2 = sayHi.bind(obj)();//输出obj
fun2();                      //输出obj
```

可以看出，fun1和fun2对应的是同样的箭头函数，但是this的输出结果是不一样的。

牢牢记住一点: 箭头函数没有自己的this，箭头函数中的this继承于外层代码中的this.

------

## 垃圾回收和内存泄露

### 1.垃圾回收机制

- 定义：

  - 找到内存空间中的垃圾。
  - 回收垃圾，让程序员能再次利用这部分的空间。

- 常用的垃圾回收算法

  - 引用计数法

    - 定义：跟踪记录每个值被引用的次数。

    - 优点:

      - 可即刻回收：当被引用数值为0，对象马上会把自己作为空闲空间连到空闲链表上。也就是说，在变成垃圾的时候就立刻被回收。
      - 因为是即使回收，那么程序不会暂停去单独使用很长一段时间的GC，那么最大暂停时间很短。
      - 不用去遍历堆里面的所有活动对象和非活动对象。

    - 缺点：

      - 计数器需要占很大的位置：因为不能预估被引用的上限，打个比方，可能出现32位即2的32次方个对象同时引用一个对象，那么计时器就需要32位。
      - 最大的劣势是无法解决循环引用无法回收的问题，这就是IE之前出现的问题。

    - 代码示例

      ```js
      var a = new Object();
      var b = a;
      a = null;
      b = null;
      ```

  - 标记清除法（在V8引擎使用最多的）

    - 定义：
      - 标记阶段：把所有活动对象做上标记
      - 清除阶段：把没有标记（也就是说非活动对象）销毁
    - 优点：
      - 实现简单，打标记用一位二进制就可以表示
      - 解决了循环引用的问题
    - 缺点：
      - 造成碎片化（有点类似磁盘的碎片化）
      - 再分配时遍历次数多，如果一直没有找到合适的内存块大小，那么会遍历空闲链表（保存堆中所有空闲地址空间的地址形成的链表）一直遍历到尾端。

  - 复制算法

    - 将一块内存空间分为两部分，分别为From空间和To空间。在这两个空间中，必定有一个空间是使用的，另一个空间是空闲的。新分配的对象会被放入From空间中，当From空间被占满的时，新生代GC就会启动了。算法就检查From空间中存活的对象复制到To空间中，如果有失活的对象就会销毁，当赋值完成后将From，空间和To空间互换，这样GC就结束了。

垃圾回收的方式

浏览器通常使用的垃圾回收方法有两种：标记清除，引用计数。 **1）标记清除**

- 标记清除是浏览器常见的垃圾回收方式，当变量进入执行环境时，就标记这个变量“进入环境”，被标记为“进入环境”的变量是不能被回收的，因为他们正在被使用。当变量离开环境时，就会被标记为“离开环境”，被标记为“离开环境”的变量会被内存释放。
- 垃圾收集器在运行的时候会给存储在内存中的所有变量都加上标记。然后，它会去掉环境中的变量以及被环境中的变量引用的标记。而在此之后再被加上标记的变量将被视为准备删除的变量，原因是环境中的变量已经无法访问到这些变量了。最后。垃圾收集器完成内存清除工作，销毁那些带标记的值，并回收他们所占用的内存空间。

**2）引用计数**

- 另外一种垃圾回收机制就是引用计数，这个用的相对较少。引用计数就是跟踪记录每个值被引用的次数。当声明了一个变量并将一个引用类型赋值给该变量时，则这个值的引用次数就是1。相反，如果包含对这个值引用的变量又取得了另外一个值，则这个值的引用次数就减1。当这个引用次数变为0时，说明这个变量已经没有价值，因此，在在机回收期下次再运行时，这个变量所占有的内存空间就会被释放出来。
- 这种方法会引起**循环引用**的问题：例如：` obj1`和`obj2`通过属性进行相互引用，两个对象的引用次数都是2。当使用循环计数时，由于函数执行完后，两个对象都离开作用域，函数执行结束，`obj1`和`obj2`还将会继续存在，因此它们的引用次数永远不会是0，就会引起循环引用。

```javascript
function fun() {
    let obj1 = {};
    let obj2 = {};
    obj1.a = obj2; // obj1 引用 obj2
    obj2.a = obj1; // obj2 引用 obj1
}
```

这种情况下，就要手动释放变量占用的内存：

```javascript
obj1.a =  null
 obj2.a =  null
```

- 减少JavaScript中垃圾回收

  - 对象优化

    - 最大限度复用对象，不用尽可能设置为null，尽快被垃圾回收掉。

      ```js
      var obj = {};
      for(var i = 0; i < 10; i++) { 
        // var obj = {}; // 这样每次都会创建一个对象
        obj.age = 19;
        obj.name = 'hehe';
        console.log(obj);
      }
      ```

  - 数组Array优化

    - 将[]赋值给一个数组对象，是清空数组的捷径，但是这样又创建一个新的空对象，并且将原来的数组对象变成了一片小内存垃圾。

      ```js
      var arr = [1, 2, 3];
      arr = [];
      ```

    - 将数组长度赋值为0，也能达到清空数组的目的，并且同时能实现数组重用，减少内存垃圾的产生。

      ```js
      var arr = [1, 2, 3];
      arr.length = 0;
      ```

  - 方法function优化

    - 例如在游戏的主循环中，setTimout或requestAnimationFrame来调用一个成员方法是很常见的。每次调用都返回一个新的方法对象，这就导致了大量的方法对象垃圾。为了解决这个方法，可以将作为返回值的方法保存起来。

      ```js
      function say() {
        console.log('hehe');
      }
      setTimeout((function(self) {
        return function() {
          self.say();
        }
      })(this), 16)
      
      
      // 优化
      this.sayFunc = (function(self) {
        return function() {
          self.say();
        }
      })(this);
      setTimout(this.sayFunc, 16)
      ```

虽然浏览器可以进行垃圾自动回收，但是当代码比较复杂时，垃圾回收所带来的代价比较大，所以应该尽量减少垃圾回收。

- **对数组进行优化：** 在清空一个数组时，最简单的方法就是给其赋值为[ ]，但是与此同时会创建一个新的空对象，可以将数组的长度设置为0，以此来达到清空数组的目的。
- **对**`object`**进行优化：** 对象尽量复用，对于不再使用的对象，就将其设置为null，尽快被回收。
- **对函数进行优化：** 在循环中的函数表达式，如果可以复用，尽量放在函数的外面。

### 2.内存泄露原因

以下四种情况会造成内存的泄漏：

- **意外的全局变量：** 由于使用未声明的变量，而意外的创建了一个全局变量，而使这个变量一直留在内存中无法被回收。
- **被遗忘的计时器或回调函数：** 设置了 setInterval 定时器，而忘记取消它，如果循环函数有对外部变量的引用的话，那么这个变量会被一直留在内存中，而无法被回收。
- **脱离 DOM 的引用：** 获取一个 DOM 元素的引用，而后面这个元素被删除，由于一直保留了对这个元素的引用，所以它也无法被回收。
- **闭包：** 不合理的使用闭包，从而导致某些变量一直被留在内存当中。