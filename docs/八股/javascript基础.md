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
> 缺点：**不能控制加载的顺序**

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