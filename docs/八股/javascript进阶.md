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
-  Proxy

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