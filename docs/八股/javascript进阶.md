## ECMAScript 6+

### 1.let const var区别

#### 三者区别

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

#### 变量声明特点

##### 不使用var let const

说明：
1.使用var声明变量，在方法内部是局部变量，在方法外部是全局变量
2.没有使用var声明的变量，在方法内部或外部都是全局变量，但如果是在方
法内部声明，在方法外部使用之前需要先调用方法，告知系统声明了全局变量后方可在方法外部使用。

在函数作用域内 加var定义的变量是局部变量,不加var定义的就成了全局变量
在function内部,加var的是局部变量,不加var的则是全局变量；
在function外部,不管有没有使用var声明变量,都是全局变量，在function外部,var关键字一般可以省略,但是为了书写规范和维护方便以及可读性好,不建议省略var关键字

##### var声明

var声明的变量可以不初始化赋值，输出是undefined，不会报错；

var声明的变量可以修改，存在变量提升(大多数语言都有块级作用域，但JS使用var声明变量时，以function划分作用域，大括号“{}”去无法限值var的作用域)；

var声明的变量作用域是全局的或者是函数级的；

var声明的变量在window上；

var定义的变量可以修改，如果不初始化会输出undefined，不会报错；
var 声明的变量在window上，用let或者const去声明变量，这个变量不会被放到window上；
很多语言中都有块级作用域，但JS没有，它使用var声明变量，以function来划分作用域，大括号“{}” 却限定不了var的作用域，因此用var声明的变量具有变量提升的效果；
var 声明的变量作用域是全局的或者是函数级的；
var可以**重复声明**：var语句多次声明一个变量不仅是合法的,而且也不会造成任何错误；如果重复使用的一个声明有一个初始值,那么它担当的不过是一个赋值语句的角色；如果重复使用的一个声明没有一个初始值,那么它不会对原来存在的变量有任何的影响;

##### let声明

需要”javascript 严格模式”：'use strict'；
let 不能重复声明
不会预处理,
不存在变量提升
let声明的变量作用域是在块级域中，函数内部使用let定义后，对函数外部无影响(块级作用域)
可以在声明变量时为变量赋值，默认值为undefined,也可以稍后在脚本中给变量赋值，在生命前无法使用(暂时死区)

##### const声明

const定义的变量不可以修改，而且必须初始化
该变量是个全局变量，或者是模块内的全局变量；可以在全局作用域或者函数内声明常量，但是必须初始化常量
如果一个变量只有在声明时才被赋值一次，永远不会在其它的代码行里被重新赋值，那么应该使用const，但是该变量的初始值有可能在未来会被调整（常变量）
创建一个只读常量，在不同浏览器上表现为不可修改；建议声明后不修改；拥有块级作用域
const 代表一个值的常量索引 ，也就是说，变量名字在内存中的指针不能够改变，但是指向这个变量的值可能 改变
const定义的变量不可修改，一般在require一个模块的时候用或者定义一些全局常量
常量不能和它所在作用域内其它变量或者函数拥有相同名称

##### function声明

function命令用于定义(声明)一个函数:

```js
function sum() {
　　var sum++
　　return sum;
}
```

声明了一个名为 sum的新变量，并为其分配了一个函数定义
{}之间的内容被分配给了 sum函数声明后不会立即执行，需要调用的时候才执行；
对支持ES5和ES6浏览器环境在块作用域内有一定区别，所以应避免在块级作用域内声明函数。

#### es5实现let和const

##### let

在 `es6` 出现以前我们一般使用无限接近闭包的形式或者立即执行函数的形式来定义不会被污染的变量。

```js
(function(){
	var a = 1;
    console.log(a)
})();

console.log(a)
```

##### const 

const 声明一个只读的常量。一旦声明，常量的值就不能改变。

有什么方法是可以限制一个值不能发生改变的呢？

需要用到 `Object.defineProperty `，通过属性描述符来定义

writable：当前对象元素的值是否可修改。

由于 ES5 环境没有 block 的概念，所以是无法百分百实现 const，只能是挂载到某个对象下，要么是全局的 window，要么就是自定义一个 object 来当容器

```js
var __const = function __const(data, value) {
  window.data = value // 把要定义的data挂载到window下，并赋值value
  Object.defineProperty(window, data, { // 利用Object.defineProperty的能力劫持当前对象，并修改其属性描述符
    enumerable: false,
    configurable: false,
    get: function () {
      return value
    },
    set: function (data) {
      if (data !== value) { // 当要对当前属性进行赋值时，则抛出错误！
        throw new TypeError('Assignment to constant variable.')
      } else {
        return value
      }
    }
  })
}
__const('a', 10)
console.log(a)
delete a
console.log(a)
for (let item in window) { // 因为const定义的属性在global下也是不存在的，所以用到了enumerable: false来模拟这一功能
  if (item === 'a') { // 因为不可枚举，所以不执行
    console.log(window[item])
  }
}
a = 20 // 报错
```

还可以使用es5的Object.freeze()

```js
var f = Object.freeze({'name':'admin'});
f.name = 'hello'; // 严格模式下是会报错的
f.name; // 打印出admin ,值没有被改变
```

**const实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址不得改动。**

对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。

但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，const只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了。

因此，将一个对象声明为常量必须非常小心

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

#### 1.箭头函数没有单独的this

对于一般函数：

- 如果该函数是一个构造函数，this 指针指向一个新的对象
- 在严格模式下的函数调用下，this 指向`undefined`
- 如果该函数是一个对象的方法，则它的 this 指针指向这个对象

> 箭头函数不会创建自己的this,它只会从自己的作用域链的上一层继承this

**对象不是作用域**

所以对象内的箭头函数作用域是外部

而正常函数this会指向这个对象

```js
var obj = {
  i: 10,
  b: () => console.log(this.i, this),
  c: function() {
    console.log( this.i, this)
  }
}
obj.b();
// undefined, Window{...}
obj.c();
// 10, Object {...}
```

构造函数的this

```js
function Person(){
  this.age = 0;
  setInterval(() => {
    this.age++; // |this| 正确地指向 p 实例
  }, 1000);
}

var p = new Person();
```



```json
function Person() {
	this.age = 0;
}
Person.prototype.func=()=>{
		console.log(this.age)
}
var p = new Person();
p.func()//undefined
```



#### 2.通过 call 或 apply 调用

> 由于 箭头函数没有自己的this指针，通过 call() 或 apply() 方法调用一个函数时，只能传递参数（不能绑定this），他们的第一个参数会被忽略

#### 3.不绑定arguments

箭头函数无法使用arguments，而普通函数可以使用arguments。如果要使用类似于arguments获取参数，可以使用rest参数代替

#### 4.箭头函数不能作为构造器，和new一起使用会抛出错误

```js
var Foo = () => {};
var foo = new Foo(); // TypeError: Foo is not a constructor
```

#### 5.箭头函数没有prototype属性

```php
var Foo = () => {};
console.log(Foo.prototype); // undefined
```

#### 6.箭头函数不能当做Generator函数,不能使用yield关键字

#### 7.省略写法

当箭头函数的函数体只有一个 `return` 语句时，可以省略 `return` 关键字和方法体的花括号

```js
在一个简写体中，只需要一个表达式，并附加一个隐式的返回值。在块体中，必须使用明确的return语句。

var func = x => x * x;
// 简写函数 省略 return

var func = (x, y) => { return x + y; };
//常规编写 明确的返回值
```

记住用`params => {object:literal}`这种简单的语法返回对象字面量是行不通的。

```js
var func = () => { foo: 1 };
// Calling func() returns undefined!

var func = () => { foo: function() {} };
// SyntaxError: function statement requires a name
```

这是因为花括号（`{}` ）里面的代码被解析为一系列语句（即 `foo` 被认为是一个标签，而非对象字面量的组成部分）。

所以，记得用圆括号把对象字面量包起来：

```js
var func = () => ({foo: 1});
```

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

##### 遍历方法

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

##### 实现Set

```js
function Set(arr = []) {
    let items = {};
    this.size = 0;
    // has方法
    this.has = function (val) {
        return items.hasOwnProperty(val);
    };
    // add方法
    this.add = function (val) {
        // 如果没有存在items里面就可以直接写入
        if (!this.has(val)) {
            items[val] = val;
            this.size++;
            return true;
        }
        return false;
    };
    arr.forEach((val, i) => {
        this.add(val);
    });
    // delete方法
    this.delete = function (val) {
        if (this.has(val)) {
            delete items[val];  // 将items对象上的属性删掉
            this.size--;
            return true;
        }
        return false;
    };
    // clear方法
    this.clear = function () {
        items = {};
        this.size = 0;
    };
    // keys方法
    this.keys = function () {
        return Object.keys(items);
    };
    // values方法
    this.values = function () {
        return Object.values(items);
    }
    // forEach方法
    this.forEach = function (fn, context = this) {
        for (let i = 0; i < this.size; i++) {
            let item = Object.keys(items)[i];
            fn.call(context, item, item, items);
        }
    }
 
    // 并集
    this.union = function (other) {
        let union = new Set();
        let values = this.values();
 
        for (let i = 0; i < values.length; i++) {
            union.add(values[i]);
        }
        values = other.values();    // 将values重新赋值为新的集合
        for (let i = 0; i < values.length; i++) {
            union.add(values[i]);
        }
 
        return union;
    };
    // 交集
    this.intersect = function (other) {
        let intersect = new Set();
        let values = this.values();
        for (let i = 0; i < values.length; i++) {
            if (other.has(values[i])) {
                intersect.add(values[i]);
            }
        }
        return intersect;
    };
    // 差集
    this.difference = function (other) {
        let difference = new Set();
        let values = this.values();
        for (let i = 0; i < values.length; i++) {
            if (!other.has(values[i])) {
                difference.add(values[i]);
            }
        }
        return difference;
    };
    // 子集
    this.subset = function(other) {
        if (this.size > other.size) {
            return false;
        } else {
            let values = this.values();
            for (let i = 0; i < values.length; i++) {
                console.log(values[i])
                console.log(other.values())
                if (!other.has(values[i])) {
                    return false;
                }
            }
            return true;
        }
    };
}
 
module.exports = Set;
```

测试

```js
const Set = require('./Set.js');
let set = new Set([2, 1, 3]);
console.log(set.keys());    // [ '1', '2', '3' ]
console.log(set.values());  // [ 1, 2, 3 ]
console.log(set.size);      // 3
set.delete(1);
console.log(set.values());  // [ 2, 3 ]
set.clear();
console.log(set.size);      // 0
 
// 并集
let a = [1, 2, 3];
let b = new Set([4, 3, 2]);
let union = new Set(a).union(b).values();
console.log(union);     // [ 1, 2, 3, 4 ]
 
// 交集
let c = new Set([4, 3, 2]);
let intersect = new Set([1,2,3]).intersect(c).values();
console.log(intersect); // [ 2, 3 ]
 
// 差集
let d = new Set([4, 3, 2]);
let difference = new Set([1,2,3]).difference(d).values();
// [1,2,3]和[4,3,2]的差集是1
console.log(difference);    // [ 1 ]
```



#### Map

`Map` 中存储的是 `key-value` 形式的键值对, 其中的 `key` 和 `value` 可以是任何类型的, 即对象也可以作为 `key`。 `Map` 的出现，就是让各种类型的值都可以当作键。`Map` 提供的是 “值-值”的对应。

##### Map 和 Object 的区别

1. `Object` 对象有原型， 也就是说他有默认的 `key` 值在对象上面， 除非我们使用 `Object.create(null)`创建一个没有原型的对象；
2. 在 `Object` 对象中， 只能把 `String` 和 `Symbol` 作为 `key` 值， 但是在 `Map` 中，`key` 值可以是任何基本类型(`String`, `Number`, `Boolean`, `undefined`, `NaN`….)，或者对象(`Map`, `Set`, `Object`, `Function` , `Symbol` , `null`….);
3. 通过 `Map` 中的 `size` 属性， 可以很方便地获取到 `Map` 长度， 要获取 `Object` 的长度， 你只能手动计算

##### Map 的属性

- size: 返回集合所包含元素的数量

```js
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

#### Map的应用

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

#### 对象属性原理

[JavaScript 对象属性底层原理](https://www.cnblogs.com/full-stack-engineer/p/9684072.html)

##### V8中的快速属性

对象大多数时候表现为Dictionary：以字符串为key，任意object为值。但是...往下看

命名属性:
如：{a：'foo'，b：'bar'}

- 存储结构可以是数组也可以是HashMap
- 具有额外的辅助信息(存储在描述符数组中)

数组索引属性(元素):
如：数组['foo'，'bar']有两个数组索引属性：0，值为'foo'; 1，值为'bar'。

- 存储结构通常为简单的数组结构。但某些情况下也会切换到Hash结构以节省内存。
- 可以使用键来推断它们在属性数组中的位置

数组索引属性和命名属性存储在两个单独的数据结构中：
![img](https://img2018.cnblogs.com/blog/1323548/201810/1323548-20181008213159705-1582981936.png)

##### 隐藏类和描述符数组

每个JS对象都有一个隐藏类与之关联。
隐藏类存储有对象结构信息(属性数和对对象原型的引用)，以及从属性名称到属性的索引映射。
隐藏类是动态创建的，并随着对象的变化而动态更新。

![img](https://img2018.cnblogs.com/blog/1323548/201810/1323548-20181008213358174-1745867885.png)

在V8中，位于堆内存并由GC管理的所有JS对象的第一个字段都指向隐藏类。
隐藏类存储中包含属性的数量，和一个指向描述符数组的指针。
在这个描述符数组中包含有命名属性的信息，例如命名属性的名称和存储属性值的位置。

注意：具有相同结构的JS对象(相同顺序和相同命名的属性)，他们的隐藏类会指向同一个，以此达到复用的目的。对于不同结构的JS对象将使用不同的HiddenClass。

![img](https://img2018.cnblogs.com/blog/1323548/201810/1323548-20181008213432920-1744479906.png)

每次添加新属性时，都会更改对象的HiddenClass。V8维护了一个把HiddenClasses链接在一起的转换树。按相同属性添加顺序将得到一样的隐藏类。

![img](https://img2018.cnblogs.com/blog/1323548/201810/1323548-20181008213443677-734810983.png)

如果我们创建一个添加了不同属性的新对象('d')，则会创建一个单独的隐藏类分支。

![img](https://img2018.cnblogs.com/blog/1323548/201810/1323548-20181008213500737-1862795575.png)

结论：
具有相同结构的对象（相同属性的相同顺序）具有相同的HiddenClass
默认情况下，每个添加的新命名属性都会导致创建一个新的HiddenClass。
添加数组索引属性不会创建新的HiddenClasses。

##### 三种不同的命名属性

1. 内嵌属性与普通属性：
   - V8支持对象内属性，存储在对象本身，可以直接访问，速度最快。
   - 内嵌属性的数量由对象的初始大小预先确定。
   - 如果添加的属性多于对象中的空间，则它们将存储在隐藏类链上，由隐藏类指向的一个属性数组。

![img](https://img2018.cnblogs.com/blog/1323548/201810/1323548-20181008213527716-1095824521.png)

1. (普通属性中的)快属性与慢属性：
   - 直接存储在属性数组(如上图中的Properties结构)中的属性为'快属性'。可通过属性数组中的索引访问，若要从属性名称获取属性数组中的实际位置，必须查看HiddenClass上的描述符数组才能知道(如上)。
   - 慢属性使用HashMap作为属性存储，所有属性元信息不再存储在HiddenClass上的描述符数组中，而是直接存储在属性Hash中(没有缓存，所以叫慢属性)。

![img](https://img2018.cnblogs.com/blog/1323548/201810/1323548-20181008213538976-839127613.png)

注意：过多的添加或删除属性，会从快属性模式切换为慢属性模式。

结论：
三种不同的命名属性类型：in-object，fast和slow(dictionary)。
内嵌属性直接存储在对象本身上，并提供最快的访问。
快速属性存在于属性存储中，所有元信息都存储在HiddenClass上的描述符数组中。
慢属性存在于自包含的属性字典中，不再通过HiddenClass共享元信息。
慢属性提供有效的属性删除和添加，但访问速度比其他两种类型慢。

##### 数组索引属性

1. 连续和有缺口的数组索引属性：
   如果删除索引元素，或者例如没有定义它，则会在连续存储中出现漏洞。一个简单的例子是[1，，3]，其中第二个项是一个缺口。

```JavaScript
const o = ["a", "b", "c"];
console.log(o[1]);          // Prints "b".

delete o[1];                // Introduces a hole in the elements store.
console.log(o[1]);          // Prints "undefined"; property 1 does not exist.
o.\_\_proto\_\_ = {1: "B"};     // Define property 1 on the prototype.

console.log(o[0]);          // Prints "a".
console.log(o[1]);          // Prints "B".
console.log(o[2]);          // Prints "c".
console.log(o[3]);          // Prints undefined
```

![img](https://img2018.cnblogs.com/blog/1323548/201810/1323548-20181008213601775-320663666.png)

当有缺口的时候会在该位置打上the_hole标记表示不存在的属性，可以大大提高数组操作效率。

1. 快速数组索引属性或Hash数组索引属性：
   快速数组索引属性是简单的VM内部数组，其中属性索引映射到数组索引属性存储中的索引。但是，该结构对于较大的数组但占用元素较少的情况相当浪费内存，这种情况会使用HashMap来节省内存，但代价是访问速度稍慢。

```JavaScript
const sparseArray = [];
sparseArray [9999] ='foo'; //创建一个包含字典元素的数组。
```

注意：只要使用自定义描述符定义索引属性，V8就会转向慢数组索引属性：

```JavaScript
const array = [];
Object.defineProperty(array, 0, {value: "fixed", configurable: false});
console.log(array[0]);      // Prints "fixed".
array[0] = "other value";   // Cannot override index 0.
console.log(array[0]);      // Still prints "fixed".
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

应用场景： **储存 DOM 节点，而不用担心这些节点从文档移除时，会引发内存泄漏**![carbon (3).png](https://s2.loli.net/2022/08/01/QJLEd7IFb3Vglsw.webp)

假设我们需要给记录页面上的禁用标签，那么一个Set对象存放就可以了，这样写功能上没有问题，但如果写成这样，当点击事件发生后，button 的dom被移除，那么整份js中 disabledElements 这个对象因为是强引用，其中的值依然存在于内存中的，那么内存泄漏就造成了，于是我们可以换成 WeakSet 来存放

![carbon (4).png](https://s2.loli.net/2022/08/01/8YfqR5cL4ABlDiW.webp)
效果是一样的，这里当 button 被移除，disabledElements 中的内容会因为是弱引用而直接变成空，也就是disabledElements被垃圾回收掉了其中的内存，避免了一个小小的内存泄漏的产生

### 10.迭代器和生成器

#### 迭代器

迭代器是一种特殊的对象，它具有一些专门为迭代过程设计的专有接口，所有的迭代器对象都有一个next()方法，每次调用都返回一个结果对象。

结果对象有两个属性：一个是value，表示下一个将要返回的值；另一个是done，它是一个布尔值，当没有更多可返回的数据时返回true。

迭代器还会保存一个内部指针，用来指向当前集合中值的位置，每一次调用next()方法，都会返回下一个可用的值。 

如果在最后一个值返回后在调用next()方法，那么返回对象中属性done的值为true，属性value则包含迭代器最终返回的值，这个返回值不是数据集的一部分，它与函数的返回值类似，是函数调用过程中最后一次给调用者传递信息的方法，如果没有相关数据则返回undefined。

`Generator`是一个生成器函数，调用这个函数它并不会立马执行这个函数，而是生成一个遍历器(或者迭代器)对象（Iterator），必须调用这个遍历器对象的`next`方法才会执行，而且它并不是一次性全部执行完，如果执行过程中遇到了`yield`关键字函数会暂停，等调用下一个`next`方法才会恢复执行。

- 定义：为各种不同的数据结构提供统一的访问机制
- 原理：创建一个指针指向首个成员，按照次序使用`next()`指向下一个成员，直接到结束位置(数据结构只要部署`Iterator接口`就可完成遍历操作)
- 作用
  - 为各种数据结构提供一个统一的简便的访问接口
  - 使得数据结构成员能够按某种次序排列
  - ES6创造了新的遍历命令`for-of`，`Iterator接口`主要供`for-of`消费
- 形式：`for-of`(自动去寻找Iterator接口)
- 数据结构
  - 集合：`Array`、`Object`、`Set`、`Map`
  - 原生具备接口的数据结构：`String`、`Array`、`Set`、`Map`、`TypedArray`、`Arguments`、`NodeList`
- 部署：默认部署在`Symbol.iterator`(具备此属性被认为`可遍历的iterable`)
- 遍历器对象
  - **next()**：下一步操作，返回`{ done, value }`(必须部署)
  - **return()**：`for-of`提前退出调用，返回`{ done: true }`
  - **throw()**：不使用，配合`Generator函数`使用

> ForOf循环

- 定义：调用`Iterator接口`产生遍历器对象(`for-of`内部调用数据结构的`Symbol.iterator()`)

- 遍历字符串：`for-in`获取`索引`，`for-of`获取`值`(可识别32位UTF-16字符)

- 遍历数组：`for-in`获取`索引`，`for-of`获取`值`

- 遍历对象：`for-in`获取`键`，`for-of`需自行部署

- 遍历Set：`for-of`获取`值` => `for (const v of set)`

- 遍历Map：`for-of`获取`键值对` =>  `for (const [k, v] of map)`

- 遍历类数组：`包含length的对象`、`Arguments对象`、`NodeList对象`(无`Iterator接口的类数组`可用`Array.from()`转换)

- 计算生成数据结构：

  Array、Set、Map

  - **keys()**：返回遍历器对象，遍历所有的键
  - **values()**：返回遍历器对象，遍历所有的值
  - **entries()**：返回遍历器对象，遍历所有的键值对

- 与for-in区别

  - 有着同`for-in`一样的简洁语法，但没有`for-in`那些缺点、
  - 不同于`forEach()`，它可与`break`、`continue`和`return`配合使用
  - 提供遍历所有数据结构的统一操作接口

> 应用场景

- 改写具有`Iterator接口`的数据结构的`Symbol.iterator`
- 解构赋值：对Set进行结构
- 扩展运算符：将部署`Iterator接口`的数据结构转为数组
- yield*：`yield*`后跟一个可遍历的数据结构，会调用其遍历器接口
- 接受数组作为参数的函数：`for-of`、`Array.from()`、`new Set()`、`new WeakSet()`、`new Map()`、`new WeakMap()`、`Promise.all()`、`Promise.race()`

#### 生成器

定义：封装多个内部状态的异步编程解决方案

形式：调用`Generator函数`(该函数不执行)返回指向内部状态的指针对象(不是运行结果)

声明：`function* Func() {}`

方法

- **next()**：使指针移向下一个状态，返回`{ done, value }`(入参会被当作上一个`yield命令表达式`的返回值)
- **return()**：返回指定值且终结遍历`Generator函数`，返回`{ done: true, value: 入参 }`
- **throw()**：在`Generator函数`体外抛出错误，在`Generator函数`体内捕获错误，返回自定义的`new Errow()`

yield命令：声明内部状态的值(`return`声明结束返回的值)

- 遇到`yield命令`就暂停执行后面的操作，并将其后表达式的值作为返回对象的`value`
- 下次调用`next()`时，再继续往下执行直到遇到下一个`yield命令`
- 没有再遇到`yield命令`就一直运行到`Generator函数`结束，直到遇到`return语句`为止并将其后表达式的值作为返回对象的`value`
- `Generator函数`没有`return语句`则返回对象的`value`为`undefined`

yield*命令：在一个`Generator函数`里执行另一个`Generator函数`(后随具有`Iterator接口`的数据结构)

遍历：通过`for-of`自动调用`next()`

> 方法异同

- 相同点：`next()`、`throw()`、`return()`本质上是同一件事，作用都是让函数恢复执行且使用不同的语句替换`yield命令`
- 不同点
  - **next()**：将`yield命令`替换成一个`值`
  - **return()**：将`yield命令`替换成一个`return语句`
  - **throw()**：将`yield命令`替换成一个`throw语句`

> 应用场景

- 异步操作同步化表达
- 控制流管理
- 为对象部署Iterator接口：把`Generator函数`赋值给对象的`Symbol.iterator`，从而使该对象具有`Iterator接口`
- 作为具有Iterator接口的数据结构

> 重点难点

- 每次调用`next()`，指针就从`函数头部`或`上次停下的位置`开始执行，直到遇到下一个`yield命令`或`return语句`为止
- 函数内部可不用`yield命令`，但会变成单纯的`暂缓执行函数`(还是需要`next()`触发)
- `yield命令`是暂停执行的标记，`next()`是恢复执行的操作
- `yield命令`用在另一个表达式中必须放在`圆括号`里
- `yield命令`用作函数参数或放在赋值表达式的右边，可不加`圆括号`
- `yield命令`本身没有返回值，可认为是返回`undefined`
- `yield命令表达式`为惰性求值，等`next()`执行到此才求值
- 函数调用后生成遍历器对象，此对象的`Symbol.iterator`是此对象本身
- 在函数运行的不同阶段，通过`next()`从外部向内部注入不同的值，从而调整函数行为
- 首个`next()`用来启动遍历器对象，后续才可传递参数
- 想首次调用`next()`时就能输入值，可在函数外面再包一层
- 一旦`next()`返回对象的`done`为`true`，`for-of`遍历会中止且不包含该返回对象
- 函数内部部署`try-finally`且正在执行`try`，那么`return()`会导致立刻进入`finally`，执行完`finally`以后整个函数才会结束
- 函数内部没有部署`try-catch`，`throw()`抛错将被外部`try-catch`捕获
- `throw()`抛错要被内部捕获，前提是必须`至少执行过一次next()`
- `throw()`被捕获以后，会附带执行下一条`yield命令`
- 函数还未开始执行，这时`throw()`抛错只可能抛出在函数外部



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

### 11.class

- 定义：对一类具有共同特征的事物的抽象(构造函数语法糖)

- 原理：类本身指向构造函数，所有方法定义在`prototype`上，可看作构造函数的另一种写法(`Class === Class.prototype.constructor`)

- 方法和关键字

  - **constructor()**：构造函数，`new命令`生成实例时自动调用
  - **extends**：继承父类
  - **super**：新建父类的`this`
  - **static**：定义静态属性方法
  - **get**：取值函数，拦截属性的取值行为
  - **set**：存值函数，拦截属性的存值行为

- 属性

  - **__proto__**：`构造函数的继承`(总是指向`父类`)
  - **__proto__.__proto__**：子类的原型的原型，即父类的原型(总是指向父类的`__proto__`)
  - **prototype.__proto__**：`属性方法的继承`(总是指向父类的`prototype`)

- 静态属性：定义类完成后赋值属性，该属性`不会被实例继承`，只能通过类来调用

- 静态方法：使用`static`定义方法，该方法`不会被实例继承`，只能通过类来调用(方法中的`this`指向类，而不是实例)

- 继承

  - 实质

    - ES5实质：先创造子类实例的`this`，再将父类的属性方法添加到`this`上(`Parent.apply(this)`)
    - ES6实质：先将父类实例的属性方法加到`this`上(调用`super()`)，再用子类构造函数修改`this`

  - super

    - 作为函数调用：只能在构造函数中调用`super()`，内部`this`指向继承的`当前子类`(`super()`调用后才可在构造函数中使用`this`)
    - 作为对象调用：在`普通方法`中指向`父类的原型对象`，在`静态方法`中指向`父类`

  - 显示定义：使用`constructor() { super(); }`定义继承父类，没有书写则`显示定义`

  - 子类继承父类：子类使用父类的属性方法时，必须在构造函数中调用super()，否则得不到父类的this

    - 父类静态属性方法可被子类继承
    - 子类继承父类后，可从`super`上调用父类静态属性方法
  
- 实例：类相当于实例的原型

  ，所有在类中定义的属性方法都会被实例继承
  
  - 显式指定属性方法：使用`this`指定到自身上(使用`Class.hasOwnProperty()`可检测到)
  - 隐式指定属性方法：直接声明定义在对象原型上(使用`Class.__proto__.hasOwnProperty()`可检测到)
  
- 表达式

  - 类表达式：`const Class = class {}`
  - name属性：返回紧跟`class`后的类名
  - 属性表达式：`[prop]`
  - Generator方法：`* mothod() {}`
  - Async方法：`async mothod() {}`

- this指向：解构实例属性或方法时会报错

  - 绑定this：`this.mothod = this.mothod.bind(this)`
  - 箭头函数：`this.mothod = () => this.mothod()`

- 属性定义位置

  - 定义在构造函数中并使用`this`指向
  - 定义在`类最顶层`

- **new.target**：确定构造函数是如何调用

> 原生构造函数

- **String()**
- **Number()**
- **Boolean()**
- **Array()**
- **Object()**
- **Function()**
- **Date()**
- **RegExp()**
- **Error()**

> 重点难点

- 在实例上调用方法，实质是调用原型上的方法
- `Object.assign()`可方便地一次向类添加多个方法(`Object.assign(Class.prototype, { ... })`)
- 类内部所有定义的方法是不可枚举的(`non-enumerable`)
- 构造函数默认返回实例对象(`this`)，可指定返回另一个对象
- 取值函数和存值函数设置在属性的`Descriptor对象`上
- 类不存在变量提升
- 利用`new.target === Class`写出不能独立使用必须继承后才能使用的类
- 子类继承父类后，`this`指向子类实例，通过`super`对某个属性赋值，赋值的属性会变成子类实例的属性
- 使用`super`时，必须显式指定是作为函数还是作为对象使用
- `extends`不仅可继承类还可继承原生的构造函数

> 私有属性方法

```js
const name = Symbol("name");
const print = Symbol("print");
class Person {
    constructor(age) {
        this[name] = "Bruce";
        this.age = age;
    }
    [print]() {
        console.log(`${this[name]} is ${this.age} years old`);
    }
}
```

> 继承混合类

```js
function CopyProperties(target, source) {
    for (const key of Reflect.ownKeys(source)) {
        if (key !== "constructor" && key !== "prototype" && key !== "name") {
            const desc = Object.getOwnPropertyDescriptor(source, key);
            Object.defineProperty(target, key, desc);
        }
    }
}
function MixClass(...mixins) {
    class Mix {
        constructor() {
            for (const mixin of mixins) {
                CopyProperties(this, new mixin());
            }
        }
    }
    for (const mixin of mixins) {
        CopyProperties(Mix, mixin);
        CopyProperties(Mix.prototype, mixin.prototype);
    }
    return Mix;
}
class Student extends MixClass(Person, Kid) {}
```

### 12.JS Object的实现

[从Chrome源码看JS Object的实现](https://zhuanlan.zhihu.com/p/26169639)

[HashMap 原理解析](https://juejin.cn/post/7100421697341227038)

[hash表的实现原理](https://blog.csdn.net/weixin_44799198/article/details/119937110)

[哈希表原理](https://www.cnblogs.com/funtrin/p/16060350.html)

[hash为什么这么快？](https://blog.csdn.net/weixin_52875557/article/details/123275627)

## 原型和原型链

### 1.原型链

![JavaScript原型关系图](https://s2.loli.net/2022/08/01/M8dl1FyLQ2C3IVs.webp)

在JavaScript中是使用**构造函数来新建一个对象**的，每一个**构造函数的内部都有一个 prototype 属性**，它的**属性值是一个对象**，这个对象包含了可以由该构造函数的**所有实例共享的属性和方法**。

当使用构造函数新建一个对象后，在这个**新建对象的内部将包含一个指针**，这个**指针指向构造函数的 prototype 属性对应的值,即原型对象**，在 ES5 中这个**指针被称为对象的原型**。一般来说不应该能够获取到这个值的，但是现在浏览器中都实现了 __proto__ 属性来访问这个属性，但是最好不要使用这个属性，因为它不是规范中规定的。ES5 中新增了一个 Object.getPrototypeOf() 方法，可以通过这个方法来获取对象的原型。

当访问一个对象的属性时，如果这个对象内部不存在这个属性，那么它就会去它的原型对象里找这个属性，这个原型对象又会有自己的原型，于是就这样一直找下去，也就是原型链的概念。原型链的尽头一般来说都是 Object.prototype ，这就是新建的对象为什么能够使用 toString() 等方法的原因

 JavaScript 对象是通过引用来传递的，创建的每个新对象实体中并没有一份属于自己的原型副本。当修改原型时，与之相关的对象也会继承这一改变

![img](https://s2.loli.net/2022/08/01/816JWYUuZwvQRNg.webp)




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

![img](https://s2.loli.net/2022/08/01/42fIjaGbqQepoMX.webp)

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

### 5.Object和Function的关系



原型链的底层实现顺序结论

首先：js中先创建的是Object.prototype这个原型对象。  
然后：在这个原型对象的基础之上创建了Function.prototype这个原型对象。  
其次：通过这个原型对象创建出来Function这个函数。   
最后: 又通过Function这个函数创建出来之后，Object（）这个对象。

**1.一切对象都最终继承自Object对象，Object对象直接继承自根源对象null**

（1）一切对象的原型链最终都是`.... → Object.prototype → null`。例如定义一个num变量`var num = 1`，则num的原型链为`x → Number.prototype → Object.prototype → null`; 定义一个函数对象fn`function fn() {}`，则fn的原型链为`fn → Function.prototype → Object.prototype → null`;等等...

（2）一切对象都包含有Object的原型方法，Object的原型方法包括了toString、valueOf、hasOwnProperty等等，在js中不管是普通对象，还是函数对象都拥有这些方法，下面列出了几个例子，大家可以自行去举例验证：

![img](https://s2.loli.net/2022/08/01/LkeJqQlbUjutIYO.webp)

**2.一切函数对象（包括Object对象)都直接继承自Function对象**

![img](https://s2.loli.net/2022/08/01/pzy8XMrA7hC5LJU.webp)

![img](https://s2.loli.net/2022/08/01/6YVKRew8MzcjlDO.webp)

函数对象包括了Function、Object、Array、String、Number，还有正则对象RegExp、Date对象等等，它们在js中的构造源码都是`function xxx() {[native code]);`，Function其实不仅让我们用于构造函数，它也充当了函数对象的构造器，甚至它也是自己的构造器。

从原型链可以佐证：

![img](https://s2.loli.net/2022/08/01/dIk5nPxt9sqf8TR.webp)

js中`对象.__proto__ === 构造器.prototype`，由此可以见得它们之间的关系。

（1）一切对象都继承自Object对象是因为一切对象的原型链最终都是`.... → Object.prototype → null`，包括Function对象，只是Function的原型链稍微绕了一点，Function的原型链为`Function → Function.prototype → Object.prototype → null`，它与其它对象的特别之处就在于它的构造器为自己，即直接继承了自己，最终继承于Object，上面的原型链可以在浏览器验证：

![img](https://s2.loli.net/2022/08/01/7qaeE3zM8lhLDn1.webp)

（2）Object继承自Function，Object的原型链为`Object → Function.prototype → Object.prototype → null`，原型链又绕回来了，并且跟第一点没有冲突。可以说Object和Function是互相继承的关系

**3.Object对象直接继承自Function对象**

![img](https://s2.loli.net/2022/08/01/c5ULDPpIuRCMaWQ.webp)

**4.Function对象直接继承自己，最终继承自Object对象**

![img](https://s2.loli.net/2022/08/01/cCGfONArV8pynT6.webp)

**普通对象直接继承了Object.prototype，而函数对象在中间还继承了Function.prototype**

除了Object的原型对象（Object.prototype）的`__proto__`指向null 其他内置函数对象的原型对象和自定义构造函数的`__proto__`都指向Object.prototype 因为原型对象本身是普通对象

```js
Object.__proto__              === Function.prototype

Object.prototype.__proto__    === null

Function.__proto__            === Function.prototype 

Function.prototype.__proto__  === Object.prototype

```

### 6.获得对象原型链上的属性

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

### 2.promise的方法和注意的问题

#### 方法

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

#### 注意的问题

- `Promise`的状态一经改变就不能再改变。
- `.then`和`.catch`都会返回一个新的`Promise`。
- `catch`不管被连接到哪里，都能捕获上层未捕捉过的错误。
- 在`Promise`中，返回任意一个非 `promise` 的值都会被包裹成 `promise` 对象，例如`return 2`会被包装为`return Promise.resolve(2)`。
- `Promise` 的 `.then` 或者 `.catch` 可以被调用多次, 但如果`Promise`内部的状态一经改变，并且有了一个值，那么后续每次调用`.then`或者`.catch`的时候都会直接拿到该值。
- `.then` 或者 `.catch` 中 `return` 一个 `error` 对象并不会抛出错误，所以不会被后续的 `.catch` 捕获。返回任意一个非 `promise` 的值都会被包裹成 `promise` 对象

抛出错误可以选择

```js
return Promise.reject(new Error('error!!!'));
// or
throw new Error('error!!!')
```

- `.then` 或 `.catch` 返回的值不能是 promise 本身，否则会造成死循环。
- `.then` 或者 `.catch` 的参数期望是函数，传入非函数则会**发生值透传**。
- `.then`方法是能接收两个参数的，第一个是处理成功的函数，第二个是处理失败的函数，再某些时候你可以认为`catch`是`.then`第二个参数的简便写法。
- `.finally`方法也是返回一个`Promise`，他在`Promise`结束的时候，无论结果为`resolved`还是`rejected`，都会执行里面的回调函数。

### 3.async和await解决了什么问题，优势在哪，底层原理是什么

`async` 函数是 `Generator` 函数的语法糖。使用 关键字 `async` 来表示，在函数内部使用 `await` 来表示异步。相较于 `Generator`，`async` 函数的改进在于下面四点：

- **内置执行器**。`Generator` 函数的执行必须依靠执行器，而 `async` 函数自带执行器，调用方式跟普通函数的调用一样
- **更好的语义**。`async` 和 `await` 相较于 `*` 和 `yield` 更加语义化
- **更广的适用性**。`co` 模块约定，`yield` 命令后面只能是 Thunk 函数或 Promise对象。而 `async` 函数的 `await` 命令后面则可以是 Promise 或者 原始类型的值（Number，string，boolean，但这时等同于同步操作）
- **返回值是 Promise**。`async` 函数返回值是 Promise 对象，比 Generator 函数返回的 Iterator 对象方便，可以直接使用 `then()` 方法进行调用

**async 函数，就是 Generator 函数的语法糖。**

它有以下几个特点：

- 建立在 promise 之上。所以，不能把它和回调函数搭配使用。但它会声明一个异步函数，并隐式地返回一个Promise。因此可以直接return变量，无需使用 Promise.resolve 进行转换。
- 和 promise 一样，是非阻塞的。但不用写 then 及其回调函数，这减少代码行数，也避免了代码嵌套。而且，所有异步调用，可以写在同一个代码块中，无需定义多余的中间变量。
- 它的最大价值在于，可以使异步代码，在形式上，更接近于同步代码。
- 它总是与 await 一起使用的。并且，await 只能在 async 函数体内。
- await 是个运算符，用于组成表达式，它会阻塞后面

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

```js
(async ()=>{
	console.log(1);
	setTimeout(()=>{
	console.log(2);	
	})
	await new Promise((resolve,reject)=>{
		console.log(3);
		resolve()
	}).then(()=>{
		console.log(4);
	})
	console.log(5);
})()
//1 3 4 5 2
```

这个 4在5之前就很好得说明了 await会阻塞后面的代码

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



### 4.async/await 原理和捕获异常

JavaScript 中的 thunk 函数（译为转换程序）是把带有回调函数的多参数函数转换成只接收回调函数的单参数版本

`Generator`是一个生成器函数，调用这个函数它并不会立马执行这个函数，而是生成一个遍历器(或者迭代器)对象（Iterator），必须调用这个遍历器对象的`next`方法才会执行，而且它并不是一次性全部执行完，如果执行过程中遇到了`yield`关键字函数会暂停，等调用下一个`next`方法才会恢复执行。

每次执行 generator 函数thunk 函数的真正作用是统一多参数函数的调用方式，在 next 调用时把控制权交还给 generator，使 generator 函数可以使用递归方式自启动流程，也就是能够跳出再回来的函数，就是生成器函数，生成器有两个特性：1. `yield` 跳出执行 2. `next` 继续执行

*自动执行器，如果一个Generator函数没有执行完，则递归调用*需要启动器让生成器函数执行，如果自己写启动器比较麻烦，可以利用co函数， [co函数库](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ftj%2Fco) 是一个 generator 函数的自启动执行器，使用条件是 generator 函数的 yield 命令后面，只能是 thunk 函数或 Promise 对象，co 函数执行完返回一个 Promise 对象vv一句话，async、await 是 co 库的官方实现。也可以看作自带启动器的 generator 函数的语法糖。不同的是，async、await 只支持 Promise 和原始类型的值，不支持 thunk 函数。

`async` 函数返回的是一个`Promise`对象，如果函数中有返回值。则通过`Promise.resole()`封装成`Promise`对象，当然我们就可以使用`then()`就可以取出这个值。`async`只能配套和`await`使用，单独使用就会报错。

```js
async function foo(){
  let bar = await test()
}
```

`await` 后面接受一个`Promise` 对象。当`Promise`对象状态变化的时候，得到返回值。`async`函数完全可以看作多个异步操作，封装成的一个`Promise`对象，而`await`就是内部`then`命令的语法糖，用同步的书写方式实现异步代码。

```js
// 返回一个生成器驱动函数
function generatorToAsync(genFn) {
  // 驱动函数的主体
  return function () {
    const gen = genFn.apply(this, arguments); // gen有可能传参
    // async会返回一个Promise
    return new Promise((resolve, reject) => {
      // 构建递归函数
      function go(key, arg) {
        // 执行生成器
        let res;
        try {
          res = gen[key](arg);
        } catch (error) {
          // 生成器执行出错了
          return reject(error);
        }
        const { value, done } = res;
        // 执行完，退出(边界条件)
        if (done) return resolve(value);
        // 未执行完，继续递归
        // Promise.resolve(value)用于实现await解析后面Promise的值
        return Promise.resolve(value).then(
          (val) => go('next', val),
          // await后面Promise执行出错了
          (err) => go('throw', err)
        );
      }
      go('next');
    });
  };
}

const asyncFn = generatorToAsync(gen);
asyncFn().then((res) => console.log(res));
```

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

1. 返回的是一个新的函数 先调用generator函数 生成迭代器 对应 var gen = testG()
2. 返回一个promise 因为外部是用.then的方式 或者await的方式去使用这个函数的返回值的
3. 内部定义一个step函数 用来一步一步的跨过yield的阻碍,key有next和throw两种取值，分别对应了gen的next和throw方法
4. arg参数则是用来把promise resolve出来的值交给下一个yield
5. 在try catch中 如果报错了 就把promise给reject掉 外部通过.catch可以获取到错误
6. gen.next() 得到的结果是一个 { value, done } 的结构
7. 如果已经完成了 就直接resolve这个promise 这个done是在最后一次调用next后才会为true
8. 除了最后结束的时候外，每次调用gen.next(), 其实是返回 { value: Promise, done: false } 的结构

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

### 9.promise错误捕获

#### try catch

`try catch` 只能捕获当前上下文中的错误，也就是只能捕获同步任务的情况，如下场景：

```js
try {
    throw "程序执行遇到了一些错误";
} catch(e) {
    console.log(e)
}
// 控制台会输出：程序执行遇到了一些错误
```

这很好，错误被捕获了，我们可以在程序中进程错误的处理；

但是对于异步的任务，trycatch就显得无能为力，不能正确捕获错误：

```js
try {
    setTimeout(() => {
      throw "程序执行遇到了一些错误"  
    })
} catch(e) {
    console.log(e);
}
// 控制台输出：Uncaught 程序执行遇到了一些错误；
```

又或者这样：

```js
try {
    Promise.reject('程序执行遇到了一些错误');
} catch(e) {
    console.log(e);
}
// 控制台输出：Uncaught (in promise) 程序执行遇到了一些错误
```

上面的代码都无法正常捕获到错误，因为：**trycatch永远捕获的是同步的错误**

> 什么是同步的错误？

当在一个事件循环内，同一个任务队列中出现的错误，对于这个任务所在的上下文而言，就是同步错误。

**setTimeout**和**Promise**被称为任务源，来自不同的任务源注册的回调函数会被放入不同的任务队列中。

> - setTimeout中的任务会被放入宏任务
> - Promise中的任务会被放入微任务
>   - 拓展：setTimeout是宿主浏览器发起的任务，一般会被放入宏任务
>   - 而Promise是由JS引擎发起的任务，会被放入微任务

------

第一次事件循环中，JS引擎会把整个script代码当成一个宏任务执行，执行完成之后，再检测本次循环中是否存在微任务，存在的话就依次从微任务的任务队列中读取执行完所有的微任务，再读取宏任务的任务队列中的任务执行，再执行所有的微任务，如此循环。

> JS的执行顺序就是每次事件循环中的宏任务-微任务的不断切换。

再看**setTimeout**中抛出的错误，这个错误已经不在**trycatch**所在的事件循环中了，所以这是一个异步错误，无法被**trycatch**捕获到。

同理，Promise.reject()此处虽然是同步执行的，但是此处reject的内容却在另一个微任务循环中，对于**trycatch**来讲也不是同步的，所以这两个错误都无法被捕获。



#### promise.reject

要理解Promise.reject首先要了解它的返回值，Promise.reject返回的是一个Promise对象，请注意：`是Promise对象`。

Promise对象在任何时候都是一个合法的对象，它不是错误也不是异常，所以在任何实现，直接对Promise.reject或者一个返回Promise对象的调用直接**try catch**是没有意义的，一个正常的对象永远不可能触发catch捕获。

```js
function getData() {
    Promise.reject('遇到了一些错误');
};
function click() {
    try {
        getData();
    } catch(e) {
        console.log(e);
    }
}
click(); // 我们模拟业务场景中的click事件
// 控制台输出: Uncaught (in promise) 遇到了一些错误
```

Promise已经通过reject抛出了错误，为什么**try catch**捕获不到呢？

首先，需要知道，对于一个函数的错误是否可以被捕获到，可以尝试将函数调用的返回值替换到函数调用出，看看是否为一个错误

上面getDate()调用会被替换为`undefined`；

对于一个没有明确return的函数调用，其返回值永远是`undefined`的，所以代码如下:

```js
function click() {
    try {
        undefined;
    } catch(e) {
        console.log(e);
    }
}
```

这个代码会正常执行，不会走到catch中

可能会有另一种思路，就是将**Promise.reject**返回出去，那么代码就变成：

```js
function getData() {
  return Promise.reject('遇到了一些错误');
};
function click() {
    try {
        getData();
    } catch(e) {
        console.log(e);
    }
}
click();
```

Promise.reject返回的是一个Promise对象，它是对象，不是错误。所以在**try catch**中完成getData()调用后这里会出现一个Promise对象，这个对象是一个再正常不过的对象，不会被catch捕获，所以这个**try catch**依然是无效的。

于是，又出现一种思路：再调用处使用Promise的catch方法进行捕获，于是代码变成：

```js
function getData() {
  return Promise.reject('遇到了一些错误');
};
function click() {
    try {
        getData().catch(console.log);
    } catch(e) {
        console.log(e);
    }
}
click();
```

这是可行的，reject的错误可以被捕获，但这不是**try catch**的功劳，而是Promise的内部消化，所以这里的**try catch**依然没有意义。

#### 解决Promise异常捕获

Promise异常是最常见的异步异常，其内部的错误基本都是被包装成了Promise对象后进行传递，所以解决Promise异步捕获整体思路有两个：

- 使用Promise的catch方法内部消化；
- 使用async和await将异步错误转同步错误再由try catch捕获

> Promise.catch

对于Promise.reject中抛出的错误，或者Promise构造器中抛出的错误，亦或者then中出现的错误，无论是运行时还是通过throw主动抛出的，原则上都可以被catch捕获。

如下：

```js
function getData() {
    Promise.reject('这里发生了错误').catch(console.log);
}
function click() {
    getData();
}
click();
```

亦或者在调用处捕获，但这需要被调用的函数能返回Promise对象;

```js
function getData() {
    return Promise.reject('程序发生了一些错误');
}

function click() {
    getData().catch(console.log);
}
click();

```

上面两个方案都可行，事实上建议在业务逻辑允许的情况下，将Promise都返回出去，以便能向上传递，同时配合**unhandledrejection**进行兜底

> async await 异步转同步

使用async和await可以将一个异步函数调用在语义上变成同步执行的效果，这样我们就可以使用try catch去统一处理。

例如：

```js
function getData() {
    return Promise.reject('程序发生错误');
}
async function click() {
    try {
        await getData();
    } catch(e) {
        console.log(e);
    }
}
click();
```

需要注意的是，如果getData方法没有写return, 那么就无法将Promise对象向上传递，那么调用出的await等到的就是一个展开的undefined, 依旧不能进行错误处理。

> 注意事项

一个函数如果内部处理了Promise异步对象，那么原则上其处理结果应该也是一个Promise对象，对于需要进行错误捕获的场景，Promise对象应该始终通过return向上传递

> 兜底方案

一般情况下，同步错误如果没有进行捕获，那么这个错误所在的事件循环将终止，所以在开发阶段没有捕获的错误，使用一种方法进行兜底是很有必要的。

对于同步错误，可以定义`window.onerror`进行兜底处理，或者使用`window.addEventListener('error', errHandler)`来定义兜底函数。

对于Promise异常，则可以同步使用`window.onunhandledrejection`或者`window.addEventListener('unhandledrejection', errHandler)`来定义兜底函数。



#### then方法中的第二个参数和Promise.catch方法的区别

> Promise中的then的第二个参数和catch有什么区别？

- reject是用来抛出错误的，属于Promise的方法
- catch是用来处理异常的，属于Promise实例的方法

- 区别

  主要区别就是，如果在then的第一个函数中抛出了异常，后面的catch能捕获到，但是then的第二个参数却捕获不到

  then的第二个参数和catch捕获信息的时候会遵循就近原则，如果是promise内部报错，reject抛出错误后，then的第二个参数和catch方法都存在的情况下，只有then的第二个参数能捕获到，如果then的第二个参数不存在，则catch方法会被捕获到。

```js
new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve(1);
    }, 1000)
}).then(res => {
    console.log(res);
    return new Promise((resolve,reject) => {
        reject('第一个then方法报错了');
    })
}).then(res => {
    console.log(res);
    return new Promise((resolve,reject) => {
		reject('第二个then方法报错了');
    })
}).catch(err => {
    console.log(err);
})
//1
//第一个then方法报错了
```



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

![img](https://s2.loli.net/2022/08/01/h49rw7IofLbVBjU.webp)

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

注意这种  是在某处进行调用运行  类似于setTimeout的回调  上面是一种引用  这个是一种执行  

```js
var length = 10;
function fn() {
  console.log('this',this)//window
  console.log(this.length)//10
}
var obj = {
  length: 5,
  methods: function () {
    fn();
  }
};
obj.methods();
```

在obj调用methods方法后，而后调用fn，其中的this具体是值window对象，所以答案为10 ；js中的函数,跟声明的位置有关,跟在哪里调用无关。fn本来就是全局作用域,跟在哪里调用无关



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

### 2.详解垃圾回收机制

[「硬核JS」你真的了解垃圾回收机制吗](https://juejin.cn/post/6981588276356317214?share_token=24c00927-0e17-4475-9608-42b779869683)

`GC` 即 `Garbage Collection` ，程序工作过程中会产生很多 `垃圾`，这些垃圾是程序不用的内存或者是之前用过了，以后不会再用的内存空间，而 `GC` 就是负责回收垃圾的，因为他工作在引擎内部，所以对于我们前端来说，`GC` 过程是相对比较无感的，这一套引擎执行而对我们又相对无感的操作也就是常说的 `垃圾回收机制` 了

当然也不是所有语言都有 `GC`，一般的高级语言里面会自带 `GC`，比如 `Java、Python、JavaScript` 等，也有无 `GC` 的语言，比如 `C、C++` 等，那这种就需要我们程序员手动管理内存了，相对比较麻烦

#### 垃圾产生&为何回收

我们知道写代码时创建一个基本类型、对象、函数……都是需要占用内存的，但是我们并不关注这些，因为这是引擎为我们分配的，我们不需要显式手动的去分配内存

但是，你有没有想过，当我们不再需要某个东西时会发生什么？JavaScript 引擎又是如何发现并清理它的呢？

我们举个简单的例子

```js
let test = {
  name: "isboyjc"
};
test = [1,2,3,4,5]
```

如上所示，我们假设它是一个完整的程序代码

我们知道 `JavaScript` 的引用数据类型是保存在堆内存中的，然后在栈内存中保存一个对堆内存中实际对象的引用，所以，`JavaScript` 中对引用数据类型的操作都是操作对象的引用而不是实际的对象。可以简单理解为，栈内存中保存了一个地址，这个地址和堆内存中的实际值是相关的

那上面代码首先我们声明了一个变量 `test`，它引用了对象 `{name: 'isboyjc'}`，接着我们把这个变量重新赋值了一个数组对象，也就变成了该变量引用了一个数组，那么之前的对象引用关系就没有了，如下图

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a428ca00cb164eeab16e8cbbb603e7d7~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

没有了引用关系，也就是无用的对象，这个时候假如任由它搁置，一个两个还好，多了的话内存也会受不了，所以就需要被清理（回收）

用官方一点的话说，程序的运行需要内存，只要程序提出要求，操作系统或者运行时就必须提供内存，那么对于持续运行的服务进程，必须要及时释放内存，否则，内存占用越来越高，轻则影响系统性能，重则就会导致进程崩溃

#### 垃圾回收策略

在 JavaScript 内存管理中有一个概念叫做 `可达性`，就是那些以某种方式可访问或者说可用的值，它们被保证存储在内存中，反之不可访问则需回收

至于如何回收，其实就是怎样发现这些不可达的对象（垃圾）它并给予清理的问题， `JavaScript` 垃圾回收机制的原理说白了也就是定期找出那些不再用到的内存（变量），然后释放其内存

你可能还会好奇为什么不是实时的找出无用内存并释放呢？其实很简单，实时开销太大了

我们都可以 Get 到这之中的重点，那就是怎样找出所谓的垃圾？

这个流程就涉及到了一些算法策略，有很多种方式，我们简单介绍两个最常见的

- 标记清除算法
- 引用计数算法

#### 标记清除算法

**策略**

标记清除（Mark-Sweep），目前在 `JavaScript引擎` 里这种算法是最常用的，到目前为止的大多数浏览器的 `JavaScript引擎` 都在采用标记清除算法，只是各大浏览器厂商还对此算法进行了优化加工，且不同浏览器的 `JavaScript引擎` 在运行垃圾回收的频率上有所差异

就像它的名字一样，此算法分为 `标记` 和 `清除` 两个阶段，标记阶段即为所有活动对象做上标记，清除阶段则把没有标记（也就是非活动对象）销毁

你可能会疑惑怎么给变量加标记？其实有很多种办法，比如当变量进入执行环境时，反转某一位（通过一个二进制字符来表示标记），又或者可以维护进入环境变量和离开环境变量这样两个列表，可以自由的把变量从一个列表转移到另一个列表，当前还有很多其他办法。其实，怎样标记对我们来说并不重要，重要的是其策略

引擎在执行 GC（使用标记清除算法）时，需要从出发点去遍历内存中所有的对象去打标记，而这个出发点有很多，我们称之为一组 `根` 对象，而所谓的根对象，其实在浏览器环境中包括又不止于 `全局Window对象`、`文档DOM树` 等

整个标记清除算法大致过程就像下面这样

- 垃圾收集器在运行时会给内存中的所有变量都加上一个标记，假设内存中所有对象都是垃圾，全标记为0
- 然后从各个根对象开始遍历，把不是垃圾的节点改成1
- 清理所有标记为0的垃圾，销毁并回收它们所占用的内存空间
- 最后，把所有内存中对象标记修改为0，等待下一轮垃圾回收

**优点**

标记清除算法的优点只有一个，那就是实现比较简单，打标记也无非打与不打两种情况，这使得一位二进制位（0和1）就可以为其标记，非常简单

**缺点**

标记清除算法有一个很大的缺点，就是在清除之后，剩余的对象内存位置是不变的，也会导致空闲内存空间是不连续的，出现了 `内存碎片`（如下图），并且由于剩余空闲内存不是一整块，它是由不同大小内存组成的内存列表，这就牵扯出了内存分配的问题

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12247ac3d8f249a5ab85b9b40ba1147b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

假设我们新建对象分配内存时需要大小为 `size`，由于空闲内存是间断的、不连续的，则需要对空闲内存列表进行一次单向遍历找出大于等于 `size` 的块才能为其分配（如下图）

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb5107f04a3249ce8d37ec7cc5fd9668~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

那如何找到合适的块呢？我们可以采取下面三种分配策略

- `First-fit`，找到大于等于 `size` 的块立即返回
- `Best-fit`，遍历整个空闲列表，返回大于等于 `size` 的最小分块
- `Worst-fit`，遍历整个空闲列表，找到最大的分块，然后切成两部分，一部分 `size` 大小，并将该部分返回

这三种策略里面 `Worst-fit` 的空间利用率看起来是最合理，但实际上切分之后会造成更多的小块，形成内存碎片，所以不推荐使用，对于 `First-fit` 和 `Best-fit` 来说，考虑到分配的速度和效率 `First-fit` 是更为明智的选择

综上所述，标记清除算法或者说策略就有两个很明显的缺点

- **内存碎片化**，空闲内存块是不连续的，容易出现很多空闲内存块，还可能会出现分配所需内存过大的对象时找不到合适的块
- **分配速度慢**，因为即便是使用 `First-fit` 策略，其操作仍是一个 `O(n)` 的操作，最坏情况是每次都要遍历到最后，同时因为碎片化，大对象的分配效率会更慢

**PS：标记清除算法的缺点补充**

归根结底，标记清除算法的缺点在于清除之后剩余的对象位置不变而导致的空闲内存不连续，所以只要解决这一点，两个缺点都可以完美解决了

而 **标记整理（Mark-Compact）算法** 就可以有效地解决，它的标记阶段和标记清除算法没有什么不同，只是标记结束后，标记整理算法会将活着的对象（即不需要清理的对象）向内存的一端移动，最后清理掉边界的内存（如下图）

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c04b0a5a40084e0ba4550500c57f2270~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

#### 引用计数算法

**策略**

引用计数（Reference Counting），这其实是早先的一种垃圾回收算法，它把 `对象是否不再需要` 简化定义为 `对象有没有其他对象引用到它`，如果没有引用指向该对象（零引用），对象将被垃圾回收机制回收，目前很少使用这种算法了，因为它的问题很多，不过我们还是需要了解一下

它的策略是跟踪记录每个变量值被使用的次数

- 当声明了一个变量并且将一个引用类型赋值给该变量的时候这个值的引用次数就为 1
- 如果同一个值又被赋给另一个变量，那么引用数加 1
- 如果该变量的值被其他的值覆盖了，则引用次数减 1
- 当这个值的引用次数变为 0 的时候，说明没有变量在使用，这个值没法被访问了，回收空间，垃圾回收器会在运行的时候清理掉引用次数为 0 的值占用的内存

如下例

```js
let a = new Object() 	// 此对象的引用计数为 1（a引用）
let b = a 		// 此对象的引用计数是 2（a,b引用）
a = null  		// 此对象的引用计数为 1（b引用）
b = null 	 	// 此对象的引用计数为 0（无引用）
...			// GC 回收此对象
复制代码
```

这种方式是不是很简单？确实很简单，不过在引用计数这种算法出现没多久，就遇到了一个很严重的问题——循环引用，即对象 A 有一个指针指向对象 B，而对象 B 也引用了对象 A ，如下面这个例子

```js
function test(){
  let A = new Object()
  let B = new Object()
  
  A.b = B
  B.a = A
}
复制代码
```

如上所示，对象 A 和 B 通过各自的属性相互引用着，按照上文的引用计数策略，它们的引用数量都是 2，但是，在函数 `test` 执行完成之后，对象 A 和 B 是要被清理的，但使用引用计数则不会被清理，因为它们的引用数量不会变成 0，假如此函数在程序中被多次调用，那么就会造成大量的内存不会被释放

我们再用标记清除的角度看一下，当函数结束后，两个对象都不在作用域中，A 和 B 都会被当作非活动对象来清除掉，相比之下，引用计数则不会释放，也就会造成大量无用内存占用，这也是后来放弃引用计数，使用标记清除的原因之一

> 在 IE8 以及更早版本的 IE 中，`BOM` 和 `DOM` 对象并非是原生 `JavaScript` 对象，它是由 `C++` 实现的 `组件对象模型对象（COM，Component Object Model）`，而 `COM` 对象使用 引用计数算法来实现垃圾回收，所以即使浏览器使用的是标记清除算法，只要涉及到 `COM` 对象的循环引用，就还是无法被回收掉，就比如两个互相引用的 `DOM` 对象等等，而想要解决循环引用，需要将引用地址置为 `null` 来切断变量与之前引用值的关系，如下
>
> ```js
> // COM对象
> let ele = document.getElementById("xxx")
> let obj = new Object()
> 
> // 造成循环引用
> obj.ele = ele
> ele.obj = obj
> 
> // 切断引用关系
> obj.ele = null
> ele.obj = null
> 复制代码
> ```
>
> 不过在 IE9 及以后的 `BOM` 与 `DOM` 对象都改成了 `JavaScript` 对象，也就避免了上面的问题
>
> 此处参考 JavaScript高级程序设计 第四版 4.3.2 小节

**优点**

引用计数算法的优点我们对比标记清除来看就会清晰很多，首先引用计数在引用值为 0 时，也就是在变成垃圾的那一刻就会被回收，所以它可以立即回收垃圾

而标记清除算法需要每隔一段时间进行一次，那在应用程序（JS脚本）运行过程中线程就必须要暂停去执行一段时间的 `GC`，另外，标记清除算法需要遍历堆里的活动以及非活动对象来清除，而引用计数则只需要在引用时计数就可以了

**缺点**

引用计数的缺点想必大家也都很明朗了，首先它需要一个计数器，而此计数器需要占很大的位置，因为我们也不知道被引用数量的上限，还有就是无法解决循环引用无法回收的问题，这也是最严重的

#### V8对GC的优化

我们在上面也说过，现在大多数浏览器都是基于标记清除算法，V8 亦是，当然 V8 肯定也对其进行了一些优化加工处理，那接下来我们主要就来看 V8 中对垃圾回收机制的优化

##### 分代式垃圾回收

试想一下，我们上面所说的垃圾清理算法在每次垃圾回收时都要检查内存中所有的对象，这样的话对于一些大、老、存活时间长的对象来说同新、小、存活时间短的对象一个频率的检查很不好，因为前者需要时间长并且不需要频繁进行清理，后者恰好相反，怎么优化这点呢？？？分代式就来了

###### 新老生代

V8 的垃圾回收策略主要基于分代式垃圾回收机制，V8 中将堆内存分为新生代和老生代两区域，采用不同的垃圾回收器也就是不同的策略管理垃圾回收

新生代的对象为存活时间较短的对象，简单来说就是新产生的对象，通常只支持 `1～8M` 的容量，而老生代的对象为存活事件较长或常驻内存的对象，简单来说就是经历过新生代垃圾回收后还存活下来的对象，容量通常比较大

V8 整个堆内存的大小就等于新生代加上老生代的内存（如下图）

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/abae5b06648a40d2aaa453b5d8a83939~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

对于新老两块内存区域的垃圾回收，V8 采用了两个垃圾回收器来管控，我们暂且将管理新生代的垃圾回收器叫做新生代垃圾回收器，同样的，我们称管理老生代的垃圾回收器叫做老生代垃圾回收器好了

###### 新生代垃圾回收

新生代对象是通过一个名为 `Scavenge` 的算法进行垃圾回收，在 `Scavenge算法` 的具体实现中，主要采用了一种复制式的方法即 `Cheney算法` ，我们细细道来

`Cheney算法` 中将堆内存一分为二，一个是处于使用状态的空间我们暂且称之为 `使用区`，一个是处于闲置状态的空间我们称之为 `空闲区`，如下图所示

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa2d5ad1d89b4b7b919f20e4a5f8973a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

新加入的对象都会存放到使用区，当使用区快被写满时，就需要执行一次垃圾清理操作

当开始进行垃圾回收时，新生代垃圾回收器会对使用区中的活动对象做标记，标记完成之后将使用区的活动对象复制进空闲区并进行排序，随后进入垃圾清理阶段，即将非活动对象占用的空间清理掉。最后进行角色互换，把原来的使用区变成空闲区，把原来的空闲区变成使用区

当一个对象经过多次复制后依然存活，它将会被认为是生命周期较长的对象，随后会被移动到老生代中，采用老生代的垃圾回收策略进行管理

另外还有一种情况，如果复制一个对象到空闲区时，空闲区空间占用超过了 25%，那么这个对象会被直接晋升到老生代空间中，设置为 25% 的比例的原因是，当完成 `Scavenge` 回收后，空闲区将翻转成使用区，继续进行对象内存的分配，若占比过大，将会影响后续内存分配

###### 老生代垃圾回收

相比于新生代，老生代的垃圾回收就比较容易理解了，上面我们说过，对于大多数占用空间大、存活时间长的对象会被分配到老生代里，因为老生代中的对象通常比较大，如果再如新生代一般分区然后复制来复制去就会非常耗时，从而导致回收执行效率不高，所以老生代垃圾回收器来管理其垃圾回收执行，它的整个流程就采用的就是上文所说的标记清除算法了

首先是标记阶段，从一组根元素开始，递归遍历这组根元素，遍历过程中能到达的元素称为活动对象，没有到达的元素就可以判断为非活动对象

清除阶段老生代垃圾回收器会直接将非活动对象，也就是数据清理掉

前面我们也提过，标记清除算法在清除后会产生大量不连续的内存碎片，过多的碎片会导致大对象无法分配到足够的连续内存，而 V8 中就采用了我们上文中说的标记整理算法来解决这一问题来优化空间

###### 为什么需要分代式？

正如小标题，为什么需要分代式？这个机制有什么优点又解决了什么问题呢？

其实，它并不能说是解决了什么问题，可以说是一个优化点吧

分代式机制把一些新、小、存活时间短的对象作为新生代，采用一小块内存频率较高的快速清理，而一些大、老、存活时间长的对象作为老生代，使其很少接受检查，新老生代的回收机制及频率是不同的，可以说此机制的出现很大程度提高了垃圾回收机制的效率

#### 并行回收(Parallel)

在介绍并行之前，我们先要了解一个概念 `全停顿（Stop-The-World）`，我们都知道 `JavaScript` 是一门单线程的语言，它是运行在主线程上的，那在进行垃圾回收时就会阻塞 `JavaScript` 脚本的执行，需等待垃圾回收完毕后再恢复脚本执行，我们把这种行为叫做 `全停顿`

比如一次 `GC` 需要 `60ms` ，那我们的应用逻辑就得暂停 `60ms` ，假如一次 `GC` 的时间过长，对用户来说就可能造成页面卡顿等问题

既然存在执行一次 `GC` 比较耗时的情况，考虑到一个人盖房子难，那两个人、十个人...呢？切换到程序这边，那我们可不可以引入多个辅助线程来同时处理，这样是不是就会加速垃圾回收的执行速度呢？因此 V8 团队引入了并行回收机制

所谓并行，也就是同时的意思，它指的是垃圾回收器在主线程上执行的过程中，开启多个辅助线程，同时执行同样的回收工作

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0eef6c0d3bd49659a564fe698d17f43~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

简单来说，使用并行回收，假如本来是主线程一个人干活，它一个人需要 3 秒，现在叫上了 2 个辅助线程和主线程一块干活，那三个人一块干一个人干 1 秒就完事了，但是由于多人协同办公，所以需要加上一部分多人协同（同步开销）的时间我们算 0.5 秒好了，也就是说，采用并行策略后，本来要 3 秒的活现在 1.5 秒就可以干完了

不过虽然 1.5 秒就可以干完了，时间也大大缩小了，但是这 1.5 秒内，主线程还是需要让出来的，也正是因为主线程还是需要让出来，这个过程内存是静态的，不需要考虑内存中对象的引用关系改变，只需要考虑协同，实现起来也很简单

新生代对象空间就采用并行策略，在执行垃圾回收的过程中，会启动了多个线程来负责新生代中的垃圾清理操作，这些线程同时将对象空间中的数据移动到空闲区域，这个过程中由于数据地址会发生改变，所以还需要同步更新引用这些对象的指针，此即并行回收

#### 增量标记与懒性清理

我们上面所说的并行策略虽然可以增加垃圾回收的效率，对于新生代垃圾回收器能够有很好的优化，但是其实它还是一种全停顿式的垃圾回收方式，对于老生代来说，它的内部存放的都是一些比较大的对象，对于这些大的对象 `GC` 时哪怕我们使用并行策略依然可能会消耗大量时间

所以为了减少全停顿的时间，在 2011 年，V8 对老生代的标记进行了优化，从全停顿标记切换到增量标记

##### 什么是增量

增量就是将一次 `GC` 标记的过程，分成了很多小步，每执行完一小步就让应用逻辑执行一会儿，这样交替多次后完成一轮 `GC` 标记（如下图）

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e16d93c2c8414d3ab7eac55c852c678a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

试想一下，将一次完整的 `GC` 标记分次执行，那在每一小次 `GC` 标记执行完之后如何暂停下来去执行任务程序，而后又怎么恢复呢？那假如我们在一次完整的 `GC` 标记分块暂停后，执行任务程序时内存中标记好的对象引用关系被修改了又怎么办呢？

可以看出增量的实现要比并行复杂一点，V8 对这两个问题对应的解决方案分别是三色标记法与写屏障

##### 三色标记法(暂停与恢复)

我们知道老生代是采用标记清理算法，而上文的标记清理中我们说过，也就是在没有采用增量算法之前，单纯使用黑色和白色来标记数据就可以了，其标记流程即在执行一次完整的 `GC` 标记前，垃圾回收器会将所有的数据置为白色，然后垃圾回收器在会从一组跟对象出发，将所有能访问到的数据标记为黑色，遍历结束之后，标记为黑色的数据对象就是活动对象，剩余的白色数据对象也就是待清理的垃圾对象

如果采用非黑即白的标记策略，那在垃圾回收器执行了一段增量回收后，暂停后启用主线程去执行了应用程序中的一段 `JavaScript` 代码，随后当垃圾回收器再次被启动，这时候内存中黑白色都有，我们无法得知下一步走到哪里了

为了解决这个问题，V8 团队采用了一种特殊方式： `三色标记法`

三色标记法即使用每个对象的两个标记位和一个标记工作表来实现标记，两个标记位编码三种颜色：白、灰、黑

- 白色指的是未被标记的对象
- 灰色指自身被标记，成员变量（该对象的引用对象）未被标记
- 黑色指自身和成员变量皆被标记

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b012d88c1f064eaebd0df60a9aadb85e~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

如上图所示，我们用最简单的表达方式来解释这一过程，最初所有的对象都是白色，意味着回收器没有标记它们，从一组根对象开始，先将这组根对象标记为灰色并推入到标记工作表中，当回收器从标记工作表中弹出对象并访问它的引用对象时，将其自身由灰色转变成黑色，并将自身的下一个引用对象转为灰色

就这样一直往下走，直到没有可标记灰色的对象时，也就是无可达（无引用到）的对象了，那么剩下的所有白色对象都是无法到达的，即等待回收（如上图中的 `C、E` 将要等待回收）

采用三色标记法后我们在恢复执行时就好办多了，可以直接通过当前内存中有没有灰色节点来判断整个标记是否完成，如没有灰色节点，直接进入清理阶段，如还有灰色标记，恢复时直接从灰色的节点开始继续执行就可以

三色标记法的 mark 操作可以渐进执行的而不需每次都扫描整个内存空间，可以很好的配合增量回收进行暂停恢复的一些操作，从而减少 `全停顿` 的时间

##### 写屏障(增量中修改引用)

一次完整的 `GC` 标记分块暂停后，执行任务程序时内存中标记好的对象引用关系被修改了，增量中修改引用，可能不太好理解，我们举个例子（如图）

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bada1914eff449b48b5a14e53c107ff3~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

假如我们有 `A、B、C` 三个对象依次引用，在第一次增量分段中全部标记为黑色（活动对象），而后暂停开始执行应用程序也就是 JavaScript 脚本，在脚本中我们将对象 `B` 的指向由对象 `C` 改为了对象 `D` ，接着恢复执行下一次增量分段

这时其实对象 `C` 已经无引用关系了，但是目前它是黑色（代表活动对象）此一整轮 `GC` 是不会清理 `C` 的，不过我们可以不考虑这个，因为就算此轮不清理等下一轮 `GC` 也会清理，这对我们程序运行并没有太大影响

我们再看新的对象 `D` 是初始的白色，按照我们上面所说，已经没有灰色对象了，也就是全部标记完毕接下来要进行清理了，新修改的白色对象 `D` 将在次轮 `GC` 的清理阶段被回收，还有引用关系就被回收，后面我们程序里可能还会用到对象 `D` 呢，这肯定是不对的

为了解决这个问题，V8 增量回收使用 `写屏障 (Write-barrier)` 机制，即一旦有黑色对象引用白色对象，该机制会强制将引用的白色对象改为灰色，从而保证下一次增量 `GC` 标记阶段可以正确标记，这个机制也被称作 `强三色不变性`

那在我们上图的例子中，将对象 `B` 的指向由对象 `C` 改为对象 `D` 后，白色对象 `D` 会被强制改为灰色

##### 懒性清理

增量标记其实只是对活动对象和非活动对象进行标记，对于真正的清理释放内存 V8 采用的是惰性清理(Lazy Sweeping)

增量标记完成后，惰性清理就开始了。当增量标记完成后，假如当前的可用内存足以让我们快速的执行代码，其实我们是没必要立即清理内存的，可以将清理过程稍微延迟一下，让 `JavaScript` 脚本代码先执行，也无需一次性清理完所有非活动对象内存，可以按需逐一进行清理直到所有的非活动对象内存都清理完毕，后面再接着执行增量标记

##### 增量标记与惰性清理的优缺？

增量标记与惰性清理的出现，使得主线程的停顿时间大大减少了，让用户与浏览器交互的过程变得更加流畅。但是由于每个小的增量标记之间执行了 `JavaScript` 代码，堆中的对象指针可能发生了变化，需要使用写屏障技术来记录这些引用关系的变化，所以增量标记缺点也很明显：

首先是并没有减少主线程的总暂停的时间，甚至会略微增加，其次由于写屏障机制的成本，增量标记可能会降低应用程序的吞吐量（吞吐量是啥总不用说了吧）

#### 并发回收(Concurrent)

前面我们说并行回收依然会阻塞主线程，增量标记同样有增加了总暂停时间、降低应用程序吞吐量两个缺点，那么怎么才能在不阻塞主线程的情况下执行垃圾回收并且与增量相比更高效呢？

这就要说到并发回收了，它指的是主线程在执行 `JavaScript` 的过程中，辅助线程能够在后台完成执行垃圾回收的操作，辅助线程在执行垃圾回收的时候，主线程也可以自由执行而不会被挂起（如下图）

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0bae064a3a8e481b8829c9c7aef73a06~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

辅助线程在执行垃圾回收的时候，主线程也可以自由执行而不会被挂起，这是并发的优点，但同样也是并发回收实现的难点，因为它需要考虑主线程在执行 `JavaScript `时，堆中的对象引用关系随时都有可能发生变化，这时辅助线程之前做的一些标记或者正在进行的标记就会要有所改变，所以它需要额外实现一些读写锁机制来控制这一点，这里我们不再细说

#### 再说V8中GC优化

V8 的垃圾回收策略主要基于分代式垃圾回收机制，这我们说过，关于新生代垃圾回收器，我们说使用并行回收可以很好的增加垃圾回收的效率，那老生代垃圾回收器用的哪个策略呢？我上面说了并行回收、增量标记与惰性清理、并发回收这几种回收方式来提高效率、优化体验，看着一个比一个好，那老生代垃圾回收器到底用的哪个策略？难道是并发？？内心独白：” 好像。。貌似。。并发回收效率最高 “

其实，这三种方式各有优缺点，所以在老生代垃圾回收器中这几种策略都是融合使用的

老生代主要使用并发标记，主线程在开始执行 `JavaScript` 时，辅助线程也同时执行标记操作（标记操作全都由辅助线程完成）

标记完成之后，再执行并行清理操作（主线程在执行清理操作时，多个辅助线程也同时执行清理操作）

同时，清理的任务会采用增量的方式分批在各个 `JavaScript` 任务之间执行

### 3.内存泄露原因

以下四种情况会造成内存的泄漏：

- **意外的全局变量：** 由于使用未声明的变量，而意外的创建了一个全局变量，而使这个变量一直留在内存中无法被回收。
- **被遗忘的计时器或回调函数：** 设置了 setInterval 定时器，而忘记取消它，如果循环函数有对外部变量的引用的话，那么这个变量会被一直留在内存中，而无法被回收。
- **脱离 DOM 的引用：** 获取一个 DOM 元素的引用，而后面这个元素被删除，由于一直保留了对这个元素的引用，所以它也无法被回收。
- **闭包：** 不合理的使用闭包，从而导致某些变量一直被留在内存当中。