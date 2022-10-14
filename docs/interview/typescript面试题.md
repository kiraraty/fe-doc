# Typescript面试题

## 特点

### 静态类型

静态类型化是一种功能，可以在开发人员编写脚本是检测错误，有了这项功能，就会允许开发人员编写更健壮的代码并对其进行维护，以便使得代码质量更好、更清晰。

函数fun接受两个类型的number的参数，传入非number的参数报错

TypeScript能使用JavaScript 中的所有代码和编码概念

TypeScript 从核心语言方面和类概念的模塑方面对 JavaScript 对象模型进行扩展

JavaScript 代码可以在无需任何修改的情况下与 TypeScript 一同工作，同时可以使用编译器将 TypeScript 代码转换为 JavaScript

TypeScript 通过类型注解提供编译时的静态类型检查

TypeScript 中的数据要求带有明确的类型，JavaScript不要求

TypeScript 为函数提供了缺省参数值

TypeScript 引入了 JavaScript 中没有的“类”概念

TypeScript 中引入了模块的概念，可以把声明、数据、函数和类封装在模块中

类型具体点来说就是指 number、boolean、string 等基础类型和 Object、Function 等复合类型，它们是编程语言提供的对不同内容的抽象：

- **不同类型变量占据的内存大小不同**：boolean 类型的变量会分配 4 个字节的内存，而 number 类型的变量则会分配 8 个字节的内存，给变量声明了不同的类型就代表了会占据不同的内存空间。
- **不同类型变量可做的操作不同**：number 类型可以做加减乘除等运算，boolean 就不可以，复合类型中不同类型的对象可用的方法不同，比如 Date 和 RegExp，变量的类型不同代表可以对该变量做的操作就不同。

我们知道了什么是类型，那自然可以想到类型和所做的操作要匹配才行，这就是为什么要做类型检查。

**如果能保证对某种类型只做该类型允许的操作，这就叫做`类型安全`**。比如你对 boolean 做加减乘除，这就是类型不安全，你对 Date 对象调用 exec 方法，这就是类型不安全。反之，就是类型安全。

类型检查可以在运行时做，也可以运行之前的编译期做。这是两种不同的类型，前者叫做动态类型检查，后者叫做静态类型检查。

两种类型检查各有优缺点。`动态类型检查` 在源码中不保留类型信息，对某个变量赋什么值、做什么操作都是允许的，写代码很灵活。但这也埋下了类型不安全的隐患，比如对 string 做了乘除，对 Date 对象调用了 exec 方法，这些都是运行时才能检查出来的错误。

其中，最常见的错误应该是 “null is not an object”、“undefined is not a function” 之类的了，写代码时没发现类型不匹配，到了运行的时候才发现，就会有很多这种报错。

`静态类型检查`则是在源码中保留类型信息，声明变量要指定类型，对变量做的操作要和类型匹配，会有专门的编译器在编译期间做检查。

静态类型给写代码增加了一些难度，因为你除了要考虑代码要表达的逻辑之外，还要考虑类型逻辑：变量是什么类型的、是不是匹配、要不要做类型转换等。

不过，静态类型也消除了类型不安全的隐患，因为在编译期间就做了类型检查，就不会出现对 string 做了乘除，调用了 Date 的 exec 方法这类问题。

![055d32fce2ee40bda9b0c617b9d4a645](https://s2.loli.net/2022/07/09/bvZ8lRuNa6cEthm.png)

### 优势

TS是JS的**超集(**TypeScript 是一种给 JavaScript 添加特性的语言扩展。**)**，JS有的Ts都有，Ts是微软开发的开源编程语言，遵循Es6、Es5规范，设计目标是开发大型应用，可以在任何浏览器、计算机、操作系统上运行。本质上向JS中添加了可选的静态类型和基于类的面向对象编程。

JS变量是没有类型的，即age=18，age可以是任何类型的，可以继续给age赋值为age=”aaa”
Ts有明确的类型(即：变量名:number(数值类型))  eg：let age: number = 18

**TS优势**

1、类型化思维方式，使开发更严谨，提前发现错误，减少改Bug时间

2、类型系统提高了代码可读性，维护和重构代码更加容易

3、补充了接口、枚举等开发大型应用时JS缺失的功能

JS的类型系统存在"先天缺陷"，绝大部分错误都是类型错误(Uncaught TypeError)

## 基本类型

![image-20220709112043012](https://s2.loli.net/2022/07/09/8ucorEPmivK49C7.png)

### 布尔值

let isDone:boolean =false;

### 数字

ts里面的数字都是浮点数，浮点数的类型是number
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;

### 字符串

string表示文本数据类型
let name:string="noob";
支持模板字符串
`${}`
支持字符串直接拼接

### 数组

直接定义
let list:number[]=[1,2,3];
数组泛型
let list:Array<number>=[1,2,3];

### 元组

允许表示一个已知元素数量和类型的数组，各元素类型不必一样
let x:[string,number];

### 枚举

enum Color{Red,Green,Blue}
let c:Color=Color.Green;

### Any

不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查

### void

表示没有任何类型,只能为它赋予undefined和null

### never

永不存在的值的类型
never类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型； 变量也可能是 never类型，当它们被永不为真的类型保护所约束时

### unknown

可以把任何值赋值给 unknown ，但是不能调用属性和方法，

如果需要调用属性和方法，那么你可能需要类型断言

```ts
let value:unknown;
value = 'hello';
(value as string).length
```

使用类型保护

```ts
let value:unknown;
value = 'hello';
if (typeof value === 'string') {
  value.length
}
```

联合类型中的 unknown定义

如果联合类型中有unknown，那么最终得到的都是unknown类型

### object

object表示非原始类型，也就是除number，string，boolean，symbol，null或undefined之外的类型

### 类型断言

jsx中as语法断言被允许
typescript允许<>和as

## 断言

### 类型断言

有时候你会遇到这样的情况，你会比 TypeScript 更了解某个值的详细信息。通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。

通过类型断言这种方式可以告诉编译器，“相信我，我知道自己在干什么”。类型断言好比其他语言里的类型转换，但是不进行特殊的数据检查和解构。它没有运行时的影响，只是在编译阶段起作用。

类型断言有两种形式：

#### 1.“尖括号” 语法

```typescript
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;

```

#### 2.as 语法

```typescript
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;

```

### 非空断言

在上下文中当类型检查器无法断定类型时，一个新的后缀表达式操作符 `!` 可以用于断言操作对象是非 null 和非 undefined 类型。**具体而言，x! 将从 x 值域中排除 null 和 undefined 。**

那么非空断言操作符到底有什么用呢？下面我们先来看一下非空断言操作符的一些使用场景。

#### 1.忽略 undefined 和 null 类型

```typescript
function myFunc(maybeString: string | undefined | null) {
  // Type 'string | null | undefined' is not assignable to type 'string'.
  // Type 'undefined' is not assignable to type 'string'. 
  const onlyString: string = maybeString; // Error
  const ignoreUndefinedAndNull: string = maybeString!; // Ok
}
```

#### 2.调用函数时忽略 undefined 类型

```typescript
type NumGenerator = () => number;

function myFunc(numGenerator: NumGenerator | undefined) {
  // Object is possibly 'undefined'.(2532)
  // Cannot invoke an object which is possibly 'undefined'.(2722)
  const num1 = numGenerator(); // Error
  const num2 = numGenerator!(); //OK
}
```

因为 `!` 非空断言操作符会从编译生成的 JavaScript 代码中移除，所以在实际使用的过程中，要特别注意。比如下面这个例子：

```typescript
const a: number | undefined = undefined;
const b: number = a!;
console.log(b); 
```

以上 TS 代码会编译生成以下 ES5 代码：

```javascript
"use strict";
const a = undefined;
const b = a;
console.log(b);
```

虽然在 TS 代码中，我们使用了非空断言，使得 `const b: number = a!;` 语句可以通过 TypeScript 类型检查器的检查。但在生成的 ES5 代码中，`!` 非空断言操作符被移除了，所以在浏览器中执行以上代码，在控制台会输出 `undefined`。

### 确定赋值断言

在 TypeScript 2.7 版本中引入了确定赋值断言，即允许在实例属性和变量声明后面放置一个 `!` 号，从而告诉 TypeScript 该属性会被明确地赋值。为了更好地理解它的作用，我们来看个具体的例子：

```typescript
let x: number;
initialize();
// Variable 'x' is used before being assigned.(2454)
console.log(2 * x); // Error

function initialize() {
  x = 10;
}
```

很明显该异常信息是说变量 x 在赋值前被使用了，要解决该问题，我们可以使用确定赋值断言：

```typescript
let x!: number;
initialize();
console.log(2 * x); // Ok

function initialize() {
  x = 10;
}
```

通过 `let x!: number;` 确定赋值断言，TypeScript 编译器就会知道该属性会被明确地赋值。



## 接口

当一个对象类型被多次使用时，有如下两种方式来来**描述对象**的类型，以达到复用的目的：

1. 类型别名，type
2. 接口，interface

语法：

```typescript
interface 接口名  {属性1: 类型1, 属性2: 类型2}
// 这里用 interface 关键字来声明接口
interface IGoodItem  {
	// 接口名称(比如，此处的 IPerson)，可以是任意合法的变量名称，推荐以 `I` 开头
   name: string, price: number, func: ()=>string
}

// 声明接口后，直接使用接口名称作为变量的类型
const good1: IGoodItem = {
   name: '手表',
   price: 200,
   func: function() {
       return '看时间'
   }
}
const good2: IGoodItem = {
    name: '手机',
    price: 2000,
    func: function() {
        return '打电话'
    }
}
```



### interface和type的区别

#### 相同点

##### 都可以描述一个对象或者函数

###### interface

```
interface User {
  name: string
  age: number
}

interface SetUser {
  (name: string, age: number): void;
}
```

###### type

```
type User = {
  name: string
  age: number
};

type SetUser = (name: string, age: number)=> void;
```

##### 都允许拓展（extends）

interface 和 type 都可以拓展，并且两者并不是相互独立的，也就是说 interface 可以 extends type, type 也可以 extends interface 。 **虽然效果差不多，但是两者语法不同**。

###### interface extends interface

```
interface Name { 
  name: string; 
}
interface User extends Name { 
  age: number; 
}
```

###### type extends type

```
type Name = { 
  name: string; 
}
type User = Name & { age: number  };
```

###### interface extends type

```
type Name = { 
  name: string; 
}
interface User extends Name { 
  age: number; 
}
```

###### type extends interface

```js
interface Name { 
  name: string; 
}
type User = Name & { 
  age: number; 
}

```

#### 不同点

###### type 可以而 interface 不行

- type 可以声明基本类型别名，联合类型，元组等类型

```
// 基本类型别名
type Name = string

// 联合类型
interface Dog {
    wong();
}
interface Cat {
    miao();
}

type Pet = Dog | Cat

// 具体定义数组每个位置的类型
type PetList = [Dog, Pet]

```

- type 语句中还可以使用 typeof 获取实例的 类型进行赋值

```
// 当你想获取一个变量的类型时，使用 typeof
let div = document.createElement('div');
type B = typeof div
```

- 其他骚操作

```
type StringOrNumber = string | number;  
type Text = string | { text: string };  
type NameLookup = Dictionary<string, Person>;  
type Callback<T> = (data: T) => void;  
type Pair<T> = [T, T];  
type Coordinates = Pair<number>;  
type Tree<T> = T | { left: Tree<T>, right: Tree<T> };
```

###### interface 可以而 type 不行

interface 能够声明合并

```
interface User {
  name: string
  age: number
}

interface User {
  sex: string
}

/*
User 接口为 {
  name: string
  age: number
  sex: string 
}
*/
```



## 泛型

可以使用`泛型`来创建可重用的组件，一个组件可以支持多种类型的数据。 这样用户就可以以自己的数据类型来使用组件

使用泛型的例子：identity函数。 这个函数会返回任何传入它的值。 你可以把这个函数当成是 `echo`命令。

不用泛型的话，这个函数可能是下面这样：

```ts
function identity(arg: number): number {
    return arg;
}
```

或者，我们使用`any`类型来定义函数：

```ts
function identity(arg: any): any {
    return arg;
}
```

使用`any`类型会导致这个函数可以接收任何类型的`arg`参数，这样就丢失了一些信息：传入的类型与返回的类型应该是相同的。如果我们传入一个数字，我们只知道任何类型的值都有可能被返回。

因此，我们需要一种方法使返回值的类型与传入参数的类型是相同的。 这里，我们使用了 *类型变量*，它是一种特殊的变量，只用于表示类型而不是值。

```ts
function identity<T>(arg: T): T {
    return arg;
}
```

可以用两种方法使用。 第一种是，传入所有的参数，包含类型参数：

```ts
let output = identity<string>("myString");  // type of output will be 'string'
```

这里我们明确的指定了`T`是`string`类型，并做为一个参数传给函数，使用了`<>`括起来而不是`()`。

第二种方法更普遍。利用了*类型推论* -- 即编译器会根据传入的参数自动地帮助我们确定T的类型：

```ts
let output = identity("myString");  // type of output will be 'string'
```

注意我们没必要使用尖括号（`<>`）来明确地传入类型；编译器可以查看`myString`的值，然后把`T`设置为它的类型。 类型推论帮助我们保持代码精简和高可读性。如果编译器不能够自动地推断出类型的话，只能像上面那样明确的传入T的类型，在一些复杂的情况下，这是可能出现的

如果我们想同时打印出`arg`的长度。 我们很可能会这样做：

```ts
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
```

如果这么做，编译器会报错说我们使用了`arg`的`.length`属性，但是没有地方指明`arg`具有这个属性。 记住，这些类型变量代表的是任意类型，所以使用这个函数的人可能传入的是个数字，而数字是没有 `.length`属性的。

现在假设我们想操作`T`类型的数组而不直接是`T`。由于我们操作的是数组，所以`.length`属性是应该存在的。 我们可以像创建其它数组一样创建这个数组：

```ts
function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```

你可以这样理解`loggingIdentity`的类型：泛型函数`loggingIdentity`，接收类型参数`T`和参数`arg`，它是个元素类型是`T`的数组，并返回元素类型是`T`的数组。 如果我们传入数字数组，将返回一个数字数组，因为此时 `T`的的类型为`number`。 这可以让我们把泛型变量T当做类型的一部分使用，而不是整个类型，增加了灵活性

```ts
function loggingIdentity<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```

泛型接口

```ts
interface GenericIdentityFn {
    <T>(arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn = identity;
```

一个相似的例子，我们可能想把泛型参数当作整个接口的一个参数。 这样我们就能清楚的知道使用的具体是哪个泛型类型（比如： `Dictionary<string>而不只是Dictionary`）。 这样接口里的其它成员也能知道这个参数的类型了。

```ts
interface GenericIdentityFn<T> {
    (arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

泛型类看上去与泛型接口差不多。 泛型类使用（ `<>`）括起泛型类型，跟在类名后面

```ts
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

### 泛型约束

有时候想操作某类型的一组值，并且我们知道这组值具有什么样的属性。 在 `loggingIdentity`例子中，我们想访问`arg`的`length`属性，但是编译器并不能证明每种类型都有`length`属性，所以就报错了。

```ts
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
```

相比于操作any所有类型，我们想要限制函数去处理任意带有`.length`属性的所有类型。 只要传入的类型有这个属性，我们就允许，就是说至少包含这一属性。 为此，我们需要列出对于T的约束要求。

为此，我们定义一个接口来描述约束条件。 创建一个包含 `.length`属性的接口，使用这个接口和`extends`关键字来实现约束：

```ts
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}
```

这个泛型函数被定义了约束，因此它不再是适用于任意类型

需要传入符合约束类型的值，必须包含必须的属性

#### 在泛型约束中使用类型参数

你可以声明一个类型参数，且它被另一个类型参数所约束。 比如，现在我们想要用属性名从对象里获取这个属性。 并且我们想要确保这个属性存在于对象 `obj`上，因此我们需要在这两个类型之间使用约束。

```ts
function getProperty(obj: T, key: K) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // okay
getProperty(x, "m"); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.
```

#### 在泛型里使用类类型

在TypeScript使用泛型创建工厂函数时，需要引用构造函数的类类型。比如，

```ts
function create<T>(c: {new(): T; }): T {
    return new c();
}
```

一个更高级的例子，使用原型属性推断并约束构造函数与类实例的关系。

```ts
class BeeKeeper {
    hasMask: boolean;
}

class ZooKeeper {
    nametag: string;
}

class Animal {
    numLegs: number;
}

class Bee extends Animal {
    keeper: BeeKeeper;
}

class Lion extends Animal {
    keeper: ZooKeeper;
}

function createInstance<A extends Animal>(c: new () => A): A {
    return new c();
}

createInstance(Lion).keeper.nametag;  // typechecks!
createInstance(Bee).keeper.hasMask;   // typechecks!
```

## 泛型工具

为了方便开发者 TypeScript 内置了一些常用的工具类型，比如 Partial、Required、Readonly、Record 和 ReturnType 等。出于篇幅考虑，这里我们只简单介绍 Partial 工具类型。不过在具体介绍之前，我们得先介绍一些相关的基础知识，方便读者自行学习其它的工具类型。

### 1.typeof

在 TypeScript 中，`typeof` 操作符可以用来获取一个变量声明或对象的类型。

```typescript
interface Person {
  name: string;
  age: number;
}

const sem: Person = { name: 'semlinker', age: 33 };
type Sem= typeof sem; // -> Person

function toArray(x: number): Array<number> {
  return [x];
}

type Func = typeof toArray; // -> (x: number) => number[]
```

### 2.keyof

`keyof` 操作符是在 TypeScript 2.1 版本引入的，该操作符可以用于获取某种类型的所有键，其返回类型是联合类型。

```typescript
interface Person {
  name: string;
  age: number;
}

type K1 = keyof Person; // "name" | "age"
type K2 = keyof Person[]; // "length" | "toString" | "pop" | "push" | "concat" | "join" 
type K3 = keyof { [x: string]: Person };  // string | number
```

在 TypeScript 中支持两种索引签名，数字索引和字符串索引：

```typescript
interface StringArray {
  // 字符串索引 -> keyof StringArray => string | number
  [index: string]: string; 
}

interface StringArray1 {
  // 数字索引 -> keyof StringArray1 => number
  [index: number]: string;
}
```

为了同时支持两种索引类型，就得要求数字索引的返回值必须是字符串索引返回值的子类。**其中的原因就是当使用数值索引时，JavaScript 在执行索引操作时，会先把数值索引先转换为字符串索引**。所以 `keyof { [x: string]: Person }` 的结果会返回 `string | number`。

### 3.in

`in` 用来遍历枚举类型：

```typescript
type Keys = "a" | "b" | "c"

type Obj =  {
  [p in Keys]: any
} // -> { a: any, b: any, c: any }
```

### 4.infer

在条件类型语句中，可以用 `infer` 声明一个类型变量并且对它进行使用。

```typescript
type ReturnType<T> = T extends (
  ...args: any[]
) => infer R ? R : any;
```

以上代码中 `infer R` 就是声明一个变量来承载传入函数签名的返回值类型，简单说就是用它取到函数返回值的类型方便之后使用。

### 5.extends

有时候我们定义的泛型不想过于灵活或者说想继承某些类等，可以通过 extends 关键字添加泛型约束。

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

现在这个泛型函数被定义了约束，因此它不再是适用于任意类型：

```typescript
loggingIdentity(3);  // Error, number doesn't have a .length property
```

这时我们需要传入符合约束类型的值，必须包含必须的属性：

```typescript
loggingIdentity({length: 10, value: 3});
```

### 6.Partial

`Partial<T>` 的作用就是将某个类型里的属性全部变为可选项 `?`。

**定义：**

```typescript
/**
 * node_modules/typescript/lib/lib.es5.d.ts
 * Make all properties in T optional
 */
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

在以上代码中，首先通过 `keyof T` 拿到 `T` 的所有属性名，然后使用 `in` 进行遍历，将值赋给 `P`，最后通过 `T[P]` 取得相应的属性值。中间的 `?` 号，用于将所有属性变为可选。

**示例：**

```typescript
interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}

const todo1 = {
  title: "Learn TS",
  description: "Learn TypeScript",
};

const todo2 = updateTodo(todo1, {
  description: "Learn TypeScript Enum",
});
```

在上面的 `updateTodo` 方法中，我们利用 `Partial<T>` 工具类型，定义 `fieldsToUpdate` 的类型为 `Partial<Todo>`，即：

```typescript
{
   title?: string | undefined;
   description?: string | undefined;
}
```

## 条件类型

### 条件类型基础

条件类型的语法类似于我们平时常用的三元表达式，它的基本语法如下（伪代码）：

```typescript
ValueA === ValueB ? Result1 : Result2;
TypeA extends TypeB ? Result1 : Result2;
```

但需要注意的是，条件类型中使用 extends 判断类型的兼容性，而非判断类型的全等性。这是因为在类型层面中，对于能够进行赋值操作的两个变量，我们**并不需要它们的类型完全相等，只需要具有兼容性**，而两个完全相同的类型，其 extends 自然也是成立的。

条件类型绝大部分场景下会和泛型一起使用，我们知道，泛型参数的实际类型会在实际调用时才被填充（类型别名中显式传入，或者函数中隐式提取），而条件类型在这一基础上，可以基于填充后的泛型参数做进一步的类型操作，比如这个例子：

```typescript
type LiteralType<T> = T extends string ? "string" : "other";

type Res1 = LiteralType<"linbudu">; // "string"
type Res2 = LiteralType<599>; // "other"
```

同三元表达式可以嵌套一样，条件类型中也常见多层嵌套，如：

```typescript
export type LiteralType<T> = T extends string
	? "string"
	: T extends number
	? "number"
	: T extends boolean
	? "boolean"
	: T extends null
	? "null"
	: T extends undefined
	? "undefined"
	: never;

type Res1 = LiteralType<"linbudu">; // "string"
type Res2 = LiteralType<599>; // "number"
type Res3 = LiteralType<true>; // "boolean"
```

而在函数中，条件类型与泛型的搭配同样很常见。考考你，以下这个函数，我们应该如何标注它的返回值类型？

```typescript
function universalAdd<T extends number | bigint | string>(x: T, y: T) {
    return x + (y as any);
}
```

当我们调用这个函数时，由于两个参数都引用了泛型参数 T ，因此泛型会被填充为一个**联合类型**：

```typescript
universalAdd(599, 1); // T 填充为 599 | 1
universalAdd("linbudu", "599"); // T 填充为 linbudu | 599
```

那么此时的返回值类型就需要从这个字面量联合类型中推导回其原本的基础类型。在类型层级一节中，我们知道**同一基础类型的字面量联合类型，其可以被认为是此基础类型的子类型**，即 `599 | 1` 是 number 的子类型。

我们可以使用**嵌套的条件类型来进行字面量类型到基础类型地提取**：

```typescript
function universalAdd<T extends number | bigint | string>(
	x: T,
	y: T
): LiteralToPrimitive<T> {
	return x + (y as any);
}

export type LiteralToPrimitive<T> = T extends number
	? number
	: T extends bigint
	? bigint
	: T extends string
	? string
	: never;

universalAdd("linbudu", "599"); // string
universalAdd(599, 1); // number
universalAdd(10n, 10n); // bigint
```

条件类型还可以用来对更复杂的类型进行比较，比如函数类型：

```typescript
type Func = (...args: any[]) => any;

type FunctionConditionType<T extends Func> = T extends (
  ...args: any[]
) => string
  ? 'A string return func!'
  : 'A non-string return func!';

//  "A string return func!"
type StringResult = FunctionConditionType<() => string>;
// 'A non-string return func!';
type NonStringResult1 = FunctionConditionType<() => boolean>;
// 'A non-string return func!';
type NonStringResult2 = FunctionConditionType<() => number>;
```

在这里，我们的条件类型用于判断两个函数类型是否具有兼容性，而条件中并不限制参数类型，仅比较二者的返回值类型。

与此同时，存在泛型约束和条件类型两个 extends 可能会让你感到疑惑，但它们产生作用的时机完全不同，泛型约束要求你传入符合结构的类型参数，相当于**参数校验**。而条件类型使用类型参数进行条件判断（就像 if else），相当于**实际内部逻辑**。

我们上面讲到的这些条件类型，本质上就是在泛型基于调用填充类型信息的基础上，新增了**基于类型信息的条件判断**。看起来很不错，但你可能也发现了一个无法满足的场景：提取传入的类型信息。

### infer 关键字

在上面的例子中，假如我们不再比较填充的**函数类型**是否是 `(...args: any[]) => string` 的子类型，而是要拿到其返回值类型呢？或者说，**我们希望拿到填充的类型信息的一部分，而不是只是用它来做条件**呢？

TypeScript 中支持通过 infer 关键字来**在条件类型中提取类型的某一部分信息**，比如上面我们要提取函数返回值类型的话，可以这么放：

```typescript
type FunctionReturnType<T extends Func> = T extends (
  ...args: any[]
) => infer R
  ? R
  : never;
```

看起来是新朋友，其实还是老伙计。上面的代码其实表达了，当传入的类型参数满足 `T extends (...args: any[] ) => infer R` 这样一个结构（不用管 `infer R`，当它是 any 就行），返回 `infer R `位置的值，即 R。否则，返回 never。

`infer`是 `inference` 的缩写，意为推断，如 `infer R` 中 `R` 就表示 **待推断的类型**。 `infer` **只能在条件类型中使用**，因为我们实际上仍然需要**类型结构是一致的**，比如上例中类型信息需要是一个函数类型结构，我们才能提取出它的返回值类型。如果连函数类型都不是，那我只会给你一个 never 。



表示在 `extends` 条件语句中待推断的类型变量

```r
type ParamType<T> = T extends (param: infer P) => any ? P : T;
```

在这个条件语句 `T extends (param: infer P) => any ? P : T` 中，`infer P` 表示待推断的函数参数。

整句表示为：如果 `T` 能赋值给 `(param: infer P) => any`，则结果是 `(param: infer P) => any` 类型中的参数 `P`，否则返回为 `T`



例子一

解读: 如果泛型变量`T`是 `() => infer R`的`子集`，那么返回 通过infer获取到的函数返回值，否则返回boolean类型

```typescript

type Func<T> = T extends () => infer R ? R : boolean;

let func1: Func<number>; // => boolean
let func2: Func<''>; // => boolean
let func3: Func<() => Promise<number>>; // => Promise<number>
```

例子二

```typescript
// 同上，但当a、b为不同类型的时候，返回不同类型的联合类型
type Obj<T> = T extends {a: infer VType, b: infer VType} ? VType : number;

let obj1: Obj<string>; // => number
let obj2: Obj<true>; // => number
let obj3: Obj<{a: number, b: number}>; // => number
let obj4: Obj<{a: number, b: () => void}>; // => number | () => void
```

**需要注意的是infer声明的这个变量只能在true分支中使用**

这里的**类型结构**当然并不局限于函数类型结构，还可以是数组：

```typescript
type Swap<T extends any[]> = T extends [infer A, infer B] ? [B, A] : T;

type SwapResult1 = Swap<[1, 2]>; // 符合元组结构，首尾元素替换[2, 1]
type SwapResult2 = Swap<[1, 2, 3]>; // 不符合结构，没有发生替换，仍是 [1, 2, 3]
```

由于我们声明的结构是一个仅有两个元素的元组，因此三个元素的元组就被认为是不符合类型结构了。但我们可以使用 rest 操作符来处理任意长度的情况：

```typescript
// 提取首尾两个
type ExtractStartAndEnd<T extends any[]> = T extends [
  infer Start,
  ...any[],
  infer End
]
  ? [Start, End]
  : T;

// 调换首尾两个
type SwapStartAndEnd<T extends any[]> = T extends [
  infer Start,
  ...infer Left,
  infer End
]
  ? [End, ...Left, Start]
  : T;

// 调换开头两个
type SwapFirstTwo<T extends any[]> = T extends [
  infer Start1,
  infer Start2,
  ...infer Left
]
  ? [Start2, Start1, ...Left]
  : T;
```

是的，infer 甚至可以和 rest 操作符一样同时提取一组不定长的类型，而 `...any[]` 的用法是否也让你直呼神奇？上面的输入输出仍然都是数组，而实际上我们完全可以进行结构层面的转换。比如从数组到联合类型：

```typescript
type ArrayItemType<T> = T extends Array<infer ElementType> ? ElementType : never;

type ArrayItemTypeResult1 = ArrayItemType<[]>; // never
type ArrayItemTypeResult2 = ArrayItemType<string[]>; // string
type ArrayItemTypeResult3 = ArrayItemType<[string, number]>; // string | number
```

原理即是这里的 `[string, number]` 实际上等价于 `(string | number)[]`。

除了数组，infer 结构也可以是接口：

```typescript
// 提取对象的属性类型
type PropType<T, K extends keyof T> = T extends { [Key in K]: infer R }
  ? R
  : never;

type PropTypeResult1 = PropType<{ name: string }, 'name'>; // string
type PropTypeResult2 = PropType<{ name: string; age: number }, 'name' | 'age'>; // string | number

// 反转键名与键值
type ReverseKeyValue<T extends Record<string, unknown>> = T extends Record<infer K, infer V> ? Record<V & string, K> : never

type ReverseKeyValueResult1 = ReverseKeyValue<{ "key": "value" }>; // { "value": "key" }
```

在这里，为了体现 infer 作为类型工具的属性，我们结合了索引类型与映射类型，以及使用 `& string` 来确保属性名为 string 类型的小技巧。

为什么需要这个小技巧，如果不使用又会有什么问题呢？

```typescript
// 类型“V”不满足约束“string | number | symbol”。
type ReverseKeyValue<T extends Record<string, unknown>> = T extends Record<
  infer K,
  infer V
>
  ? Record<V, K>
  : never;
```

这是因为泛型参数 V 的来源是从 unknown 这个类型推导出来的，它将被作为新的类型的索引签名类型，而索引签名类型只允许 `string | number | symbol` 。还记得映射类型的判断条件吗？需要同时满足其两端的类型，我们使用 `V & string` 这一形式，就确保了最终符合条件的类型参数 V 一定会满足 string 这个类型，因此可以被视为合法的索引签名类型。

infer 结构还可以是 Promise 结构！

```typescript
type PromiseValue<T> = T extends Promise<infer V> ? V : T;

type PromiseValueResult1 = PromiseValue<Promise<number>>; // number
type PromiseValueResult2 = PromiseValue<number>; // number，但并没有发生提取
```

就像条件类型可以嵌套一样，infer 关键字也经常被使用在嵌套的场景中，包括对类型结构深层信息地提取，以及对提取到类型信息的筛选等。比如上面的 PromiseValue，如果传入了一个嵌套的 Promise 类型就失效了：

```typescript
type PromiseValueResult3 = PromiseValue<Promise<Promise<boolean>>>; // Promise<boolean>，只提取了一层
```

这种时候我们就需要进行嵌套地提取了：

```typescript
type PromiseValue<T> = T extends Promise<infer V>
  ? V extends Promise<infer N>
    ? N
    : V
  : T;
```

当然，在这时应该使用递归来处理任意嵌套深度：

```typescript
type PromiseValue<T> = T extends Promise<infer V> ? PromiseValue<V> : T;
```

条件类型在泛型的基础上支持了基于类型信息的动态条件判断，但无法直接消费填充类型信息，而 infer 关键字则为它补上了这一部分的能力，让我们可以进行更多奇妙的类型操作。TypeScript 内置的工具类型中还有一些基于 infer 关键字的应用，我们会在内置工具类型讲解一章中了解它们的具体实现。而我们上面了解的 rest infer（`...any[]`），结合其他类型工具、递归 infer 等，都是日常比较常用的操作，这些例子应当能让你再一次意识到“类型编程”的真谛。

### 分布式条件类型

分布式条件类型听起来真的很高级，但这里和分布式和分布式服务并不是一回事。**分布式条件类型（\*Distributive Conditional Type\*），也称条件类型的分布式特性**，只不过是条件类型在满足一定情况下会执行的逻辑而已。我们来看一个例子：

```typescript
type Condition<T> = T extends 1 | 2 | 3 ? T : never;

// 1 | 2 | 3
type Res1 = Condition<1 | 2 | 3 | 4 | 5>;

// never
type Res2 = 1 | 2 | 3 | 4 | 5 extends 1 | 2 | 3 ? 1 | 2 | 3 | 4 | 5 : never;
```

这个例子可能让你感觉充满了疑惑，某些地方似乎和我们学习的知识并不一样？先不说这两个理论上应该执行结果一致的类型别名，为什么在 Res1 中诡异地返回了一个联合类型？

仔细观察这两个类型别名的差异你会发现，唯一的差异就是在 Res1 中，进行判断的联合类型被作为泛型参数传入给另一个独立的类型别名，而 Res2 中直接对这两者进行判断。

记住第一个差异：**是否通过泛型参数传入**。我们再看一个例子：

```typescript
type Naked<T> = T extends boolean ? "Y" : "N";
type Wrapped<T> = [T] extends [boolean] ? "Y" : "N";

// "N" | "Y"
type Res3 = Naked<number | boolean>;

// "N"
type Res4 = Wrapped<number | boolean>;
```

现在我们都是通过泛型参数传入了，但诡异的事情又发生了，为什么第一个还是个联合类型？第二个倒是好理解一些，元组的成员有可能是数字类型，显然不兼容于 `[boolean]`。再仔细观察这两个例子你会发现，它们唯一的差异是条件类型中的**泛型参数是否被数组包裹**了。

同时，你会发现在 Res3 的判断中，其联合类型的两个分支，恰好对应于分别使用 number 和 boolean 去作为条件类型判断时的结果。

把上面的线索理一下，其实我们就大致得到了条件类型分布式起作用的条件。首先，你的类型参数需要是一个条件类型 。其次，类型参数需要通过泛型参数的方式传入，而不能直接在外部进行判断（如 Res2 中）。最后，条件类型中的泛型参数不能被包裹。

而条件类型分布式特性会产生的效果也很明显了，即将这个联合类型拆开来，每个分支分别进行一次条件类型判断，再将最后的结果合并起来（如 Naked 中）。如果再严谨一些，其实我们就得到了官方的解释：

**对于属于裸类型参数的检查类型，条件类型会在实例化时期自动分发到联合类型上。**（***Conditional types in which the checked type is a naked type parameter are called distributive conditional types. Distributive conditional types are automatically distributed over union types during instantiation.***）

这里的自动分发，我们可以这么理解：

```typescript
type Naked<T> = T extends boolean ? "Y" : "N";

// (number extends boolean ? "Y" : "N") | (boolean extends boolean ? "Y" : "N")
// "N" | "Y"
type Res3 = Naked<number | boolean>;
```

写成伪代码其实就是这样的：

```typescript
const Res3 = [];

for(const input of [number, boolean]){
  if(input extends boolean){
    Res3.push("Y");
  } else {
    Res.push("N");
  }
}
```

而这里的裸类型参数，其实指的就是泛型参数是否完全裸露，我们上面使用数组包裹泛型参数只是其中一种方式，比如还可以这么做：

```typescript
export type NoDistribute<T> = T & {};

type Wrapped<T> = NoDistribute<T> extends [boolean] ? "Y" : "N";
```

需要注意的是，我们并不是只会通过裸露泛型参数，来确保分布式特性能够发生。在某些情况下，我们也会需要包裹泛型参数来禁用掉分布式特性。最常见的场景也许还是联合类型的判断，即我们不希望进行联合类型成员的分布判断，而是希望直接判断这两个联合类型的兼容性判断，就像在最初的 Res2 中那样：

```typescript
type CompareUnion<T, U> = [T] extends [U] ? true : false;

type CompareRes1 = CompareUnion<1 | 2, 1 | 2 | 3>; // true
type CompareRes2 = CompareUnion<1 | 2, 1>; // false
```

通过将参数与条件都包裹起来的方式，我们对联合类型的比较就变成了数组成员类型的比较，在此时就会严格遵守类型层级一文中联合类型的类型判断了（子集为其子类型）。

另外一种情况则是，当我们想判断一个类型是否为 never 时，也可以通过类似的手段：

```typescript
type IsNever<T> = [T] extends [never] ? true : false;

type IsNeverRes1 = IsNever<never>; // true
type IsNeverRes2 = IsNever<"linbudu">; // false
```

这里的原因其实并不是因为分布式条件类型。我们此前在类型层级中了解过，当条件类型的判断参数为 any，会直接返回条件类型两个结果的联合类型。而在这里其实类似，当通过泛型传入的参数为 never，则会直接返回 never。

需要注意的是这里的 never 与 any 的情况并不完全相同，any 在直接**作为判断参数时**、**作为泛型参数时**都会产生这一效果：

```typescript
// 直接使用，返回联合类型
type Tmp1 = any extends string ? 1 : 2;  // 1 | 2

type Tmp2<T> = T extends string ? 1 : 2;
// 通过泛型参数传入，同样返回联合类型
type Tmp2Res = Tmp2<any>; // 1 | 2

// 如果判断条件是 any，那么仍然会进行判断
type Special1 = any extends any ? 1 : 2; // 1
type Special2<T> = T extends any ? 1 : 2;
type Special2Res = Special2<any>; // 1
```

而 never 仅在作为泛型参数时才会产生：

```typescript
// 直接使用，仍然会进行判断
type Tmp3 = never extends string ? 1 : 2; // 1

type Tmp4<T> = T extends string ? 1 : 2;
// 通过泛型参数传入，会跳过判断
type Tmp4Res = Tmp4<never>; // never

// 如果判断条件是 never，还是仅在作为泛型参数时才跳过判断
type Special3 = never extends never ? 1 : 2; // 1
type Special4<T> = T extends never ? 1 : 2;
type Special4Res = Special4<never>; // never
```

这里的 any、never 两种情况都不会实际地执行条件类型，而在这里我们通过包裹的方式让它不再是一个孤零零的 never，也就能够去执行判断了。

之所以分布式条件类型要这么设计，我个人理解主要是为了处理联合类型这种情况。就像我们到现在为止的伪代码都一直使用数组来表达联合类型一样，在类型世界中联合类型就像是一个集合一样。通过使用分布式条件类型，我们能轻易地进行集合之间的运算，比如交集：

```typescript
type Intersection<A, B> = A extends B ? A : never;

type IntersectionRes = Intersection<1 | 2 | 3, 2 | 3 | 4>; // 2 | 3
```

进一步的，当联合类型的组成是一个对象的属性名（`keyof IObject`），此时对这样的两个类型集合进行处理，得到属性名的交集，那我们就可以在此基础上获得两个对象类型结构的交集。除此以外，还有许多相对复杂的场景可以降维到类型集合，即联合类型的层面，然后我们就可以愉快地使用分布式条件类型进行各种处理了。关于类型层面的集合运算、对象结构集合运算，我们都会在小册的后续章节有详细的讲解。

## 装饰器

[代码缺乏装饰？使用ts装饰器来装饰你的代码](https://juejin.cn/post/7053887981928579103)

装饰器是一种特殊类型的声明，它能够被附加到`类声明`、`方法`、`属性`或者`参数`上，

- 语法：装饰器使用 `@expression` 这种形式，`expression`求值后必须为一个函数，它会在运行时被调用，被装饰的声明信息做为参数传入
- 若要启用实验性的装饰器特性，必须`tsconfig.json`里启用`experimentalDecorators`编译器选项
- 常见的装饰器有: `类装饰器`、`属性装饰器`、`方法装饰器`、`参数装饰器`
- 装饰器的写法: 分为`普通装饰器(无法传参）`和`装饰器工厂(可以传参)`

解装饰器的几个特点。**具体如下：**

- 装饰器本身就是一个**函数**；
- 装饰器接收的参数是**构造函数**；
- 装饰器通过 `@` 符号来进行使用。

装饰器执行的时候，是**从下到上**，从**右到左**的顺序。

### 装饰器的写法

#### 普通装饰器

```ts
interface Person {
  name: string
  age: string
}
function enhancer(target: any) {
  target.prototype.name = '金色小芝麻'
  target.prototype.age = '18'
}
@enhancer // 普通装饰器
class Person {
  constructor() { }
}
```

#### 装饰器工厂

```ts
interface Person {
    name: string
    age: number
}
// 利用函数柯里化解决传参问题， 向装饰器传入一些参数，也可以叫 参数注解
function enhancer(name: string) {
    return function enhancer(target: any) {
      // 这个 name 就是装饰器的元数据，外界传递进来的参数
      target.prototype.name = name
      target.prototype.age = 18
    }
}
@enhancer('小芝麻') // 在使用装饰器的时候, 为其指定元数据
class Person {
    constructor() {}
}
```

### 装饰器的分类

#### 类装饰器

> 类装饰器在类声明之前声明（紧靠着类声明），用来`监视`、`修改`或者`替换`类定义

- 类装饰器不能用在声明文件中( `.d.ts`)，也不能用在任何外部上下文中（比如`declare`的类）。
- 类装饰器表达式会在运行时当作函数被调用，类的构造函数作为其唯一的参数。
- 如果类装饰器返回一个值，它会使用提供的构造函数来替换类的声明。

```typescript
interface Person {
  name: string
  age: string
}
function enhancer(target: any) {
  target.xx = 'Person' ; // 给类增加属性
  target.prototype.name = '金色小芝麻'
  target.prototype.age = '18'
}
@enhancer // 名字随便起
class Person {
  constructor() { }
}
let p = new Person()
console.log(Person.name); // Person
console.log(p.age) // 18
```

#### 属性装饰器

- 属性装饰器用来装饰属性
- 属性装饰器表达式会在运行时当做函数被调用，传入下列两个参数
    - 第一个参数： 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
    - 第二个参数： 是属性的名称

```ts
function enhancer(target: any, propertyKey: string) {
  console.log(target); // Person {}
  console.log("key " + propertyKey); // key name
};
class Person {
  @enhancer
  name: string;
  constructor() {
    this.name = '金色小芝麻';
  }
}
const user = new Person();
user.name = '你好啊！'
console.log(user.name) // 你好啊！
```

#### 方法装饰器

- 方法装饰器用来装饰方法
    - 第一个参数： 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
    - 第二个参数： 是方法的名称
    - 第三个参数： 是方法的描述 修饰方法

```typescript
function enhancer(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  // target 如果装饰的是个普通属性的话，那么这个 target 指向类的原型 Person.prototype
 
  console.log(target); // Person { getName: [Function] }
  console.log("key " + propertyKey); // key getName
  console.log("desc " + JSON.stringify(descriptor)); // {"writable":true,"enumerable":true,"configurable":true}
};
class Person {
  name: string;
  constructor() {
    this.name = '金色小芝麻';
  }
  @enhancer
  getName() {
    return 'getName';
  }
}
const user = new Person();
user.getName = function () {
  return '金色小芝麻'
}
console.log(user.getName()); // '金色小芝麻'
```

修饰静态方法

```ts
// 声明装饰器修饰静态方法
function enhancer(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  // target 装饰的是一个类的属性static，那么这个 target 指向类的定义
  
  console.log(target); // [Function: Person] { getAge: [Function] }
  console.log("key " + propertyKey); // key getAge
  console.log("desc " + JSON.stringify(descriptor)); // {"writable":true,"enumerable":true,"configurable":true}
};
class Person {
  age: number = 18;
  constructor() {}
  @enhancer
  static getAge() {
    return 'static getAge';
  }
}
const user = new Person();
Person.getAge = function () {
  return '你好啊！'
}
console.log(Person.getAge()) // 你好啊！
```

#### 参数装饰器

- 参数装饰器用来装饰参数
    - 第一个参数： 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
    - 第二个参数： 成员的名字
    - 第三个参数： 参数在函数参数列表中的索引

```ts
function enhancer(target: any, propertyKey: string, parameterIndex: number) {
  console.log(target); // Person { getName: [Function] }
  console.log("key " + propertyKey); // key getName
  console.log("index " + parameterIndex); // index 0
};
class Person {
  name: string;
  constructor() {
    this.name = '你好啊！';
  }
  getName(@enhancer name: string){
    return name
  }
}
const user = new Person();
user.name = '金色小芝麻'
console.log(user.name) // '金色小芝麻'
```

####  装饰器执行顺序

- 属性方法先执行，谁先写 先执行谁
- 方法的时候， 先参数在方法，而且一定会在一起
- 最后是类
- 如果同类型，先执行离类近的

### 几种类的装饰器

#### 执行顺序

```js
// 第一个装饰器
function testDecorator(constructor: any) {
  console.log('decorator');
}

// 第二个装饰器
function testDecorator1(constructor: any) {
  console.log('decorator1');
}

// 装饰器执行的时候，是从下到上，从右到左的顺序
@testDecorator
@testDecorator1
class Test {}

const test = new Test(); // decorator1 decorator
复制代码
```

装饰器执行的时候，是**从下到上**，从**右到左**的顺序。

#### 参数判断

我们如何让**类装饰器**接收一个参数呢？**来看一段代码：**

```js
// 外面再包一层函数
function testDecorator(flag: boolean) {
  // 工厂模式
  if (flag) {
    return function (constructor: any) {
      constructor.prototype.getName = () => {
        console.log('Monday');
      };
    };
  } else {
    return function (constructor: any) {};
  }
}

@testDecorator(true)
class Test {}

const test = new Test();
(test as any).getName(); // Monday
复制代码
```

通过上面这段代码我们可以了解到，我们通过对类装饰器的外部再包上一层函数，这其实有点像柯里化的形式，之后**通过外部的这个函数进行传参**，也就是上面代码中的 `flag` 。最终类装饰器**返回一个函数作为结果**，顺利地进行传参。

#### 装饰器标准写法

上面的两个装饰器属于两个比较简单和不太规范的装饰器。下面我们来展现一种比较标准的写法：

```js
function testDecorator() {
  return function <T extends new (...args: any[]) => any>(constructor: T) {
    return class extends constructor {
      name = 'Tuesday';
      getName() {
        return this.name;
      }
    };
  };
}

const Test = testDecorator()(
  class {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
  }
);

const test = new Test('Monday');
console.log(test.getName()); // Tuesday
```

在上面的代码中， `(...args: any[]) => any` 是一个**函数**，返回值是一个**对象**的类型。这个函数会接收很多参数，函数把这些参数合并到一起，变成一个数组，也就是 `...args` 。那 `<T extends new (...args: any[]) => any>` 是什么意思呢？意思是， `T` 可以通过 `new (...args: any[]) => any` 这种类型的构造函数，给**实例化**出来。所以 `T` 现在可以理解为是一个类或者是 `constructor` 这样的一个构造函数。

最终，我们通过 `testDecorator()()` 这样的方式，让 `test` 实例可以访问到 `getName()` 方法，并打印出 `Tuesday`



## 类型守卫

**类型保护是可执行运行时检查的一种表达式，用于确保该类型在一定的范围内。** 换句话说，类型保护可以保证一个字符串是一个字符串，尽管它的值也可以是一个数值。类型保护与特性检测并不是完全不同，其主要思想是尝试检测属性、方法或原型，以确定如何处理值。目前主要有四种的方式来实现类型保护：

### in 关键字

```typescript
interface Admin {
  name: string;
  privileges: string[];
}

interface Employee {
  name: string;
  startDate: Date;
}

type UnknownEmployee = Employee | Admin;

function printEmployeeInformation(emp: UnknownEmployee) {
  console.log("Name: " + emp.name);
  if ("privileges" in emp) {
    console.log("Privileges: " + emp.privileges);
  }
  if ("startDate" in emp) {
    console.log("Start Date: " + emp.startDate);
  }
}
```

### typeof 关键字

```typescript
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
      return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
      return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}
```

`typeof` 类型保护只支持两种形式：`typeof v === "typename"` 和 `typeof v !== typename`，`"typename"` 必须是 `"number"`， `"string"`， `"boolean"` 或 `"symbol"`。 但是 TypeScript 并不会阻止你与其它字符串比较，语言不会把那些表达式识别为类型保护。

### instanceof 关键字

```typescript
interface Padder {
  getPaddingString(): string;
}

class SpaceRepeatingPadder implements Padder {
  constructor(private numSpaces: number) {}
  getPaddingString() {
    return Array(this.numSpaces + 1).join(" ");
  }
}

class StringPadder implements Padder {
  constructor(private value: string) {}
  getPaddingString() {
    return this.value;
  }
}

let padder: Padder = new SpaceRepeatingPadder(6);

if (padder instanceof SpaceRepeatingPadder) {
  // padder的类型收窄为 'SpaceRepeatingPadder'
}
```

### 自定义类型保护的类型谓词

```typescript
function isNumber(x: any): x is number {
  return typeof x === "number";
}

function isString(x: any): x is string {
  return typeof x === "string";
}
```

## 内置工具类

内置的工具类型按照类型操作的不同，其实也可以大致划分为这么几类：

- 对属性的修饰，包括对象属性和数组元素的可选/必选、只读/可写。我们将这一类统称为**属性修饰工具类型**。
- 对既有类型的裁剪、拼接、转换等，比如使用对一个对象类型裁剪得到一个新的对象类型，将联合类型结构转换到交叉类型结构。我们将这一类统称为**结构工具类型**。
- 对集合（即联合类型）的处理，即交集、并集、差集、补集。我们将这一类统称为**集合工具类型**。
- 基于 infer 的模式匹配，即对一个既有类型特定位置类型的提取，比如提取函数类型签名中的返回值类型。我们将其统称为**模式匹配工具类型**。
- 模板字符串专属的工具类型，比如神奇地将一个对象类型中的所有属性名转换为大驼峰的形式。这一类当然就统称为**模板字符串工具类型**了。

### 属性修饰工具类型（Partial Required Readonly）

这一部分的工具类型主要使用**属性修饰**、**映射类型**与**索引类型**相关（索引类型签名、索引类型访问、索引类型查询均有使用，因此这里直接用索引类型指代）。

在内置工具类型中，访问性修饰工具类型包括以下三位：

```typescript
type Partial<T> = {
    [P in keyof T]?: T[P];
};

type Required<T> = {
    [P in keyof T]-?: T[P];
};

type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
```

其中，Partial 与 Required 可以认为是一对工具类型，它们的功能是相反的，而在实现上，它们的唯一差异是在索引类型签名处的可选修饰符，Partial 是 `?`，即标记属性为可选，而 Required 则是 `-?`，相当于在原本属性上如果有 `?` 这个标记，则移除它。

如果你觉得不好记，其实 Partial 也可以使用 `+?` 来显式的表示添加可选标记：

```typescript
type Partial<T> = {
    [P in keyof T]+?: T[P];
};
```

需要注意的是，可选标记不等于修改此属性类型为 `原类型 | undefined` ，如以下的接口结构：

```typescript
interface Foo {
  optional: string | undefined;
  required: string;
}
```

如果你声明一个对象去实现这个接口，它仍然会要求你提供 optional 属性：

```typescript
interface Foo {
  optional: string | undefined;
  required: string;
}

// 类型 "{ required: string; }" 中缺少属性 "optional"，但类型 "Foo" 中需要该属性。
const foo1: Foo = {
  required: '1',
};

const foo2: Foo = {
  required: '1',
  optional: undefined
};
```

这是因为对于结构声明来说，一个属性是否必须提供仅取决于其是否携带可选标记。即使你使用 never 也无法标记这个属性为可选：

```typescript
interface Foo {
  optional: never;
  required: string;
}

const foo: Foo = {
  required: '1',
  // 不能将类型“string”分配给类型“never”。
  optional: '',
};
```

反而你会惊喜地发现你没法为这个属性声明值了，毕竟除本身以外没有类型可以赋值给 never 类型。

而类似 `+?`，Readonly 中也可以使用 `+readonly`：

```typescript
type Readonly<T> = {
    +readonly [P in keyof T]: T[P];
};
```

虽然 TypeScript 中并没有提供它的另一半，但参考 Required 其实我们很容易想到这么实现一个工具类型 Mutable，来将属性中的 readonly 修饰移除：

```typescript
type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};
```

### 结构工具类型

这一部分的工具类型主要使用**条件类型**以及**映射类型**、**索引类型**。

结构工具类型其实又可以分为两类，**结构声明**和**结构处理**。

#### 结构声明

**结构声明**工具类型即快速声明一个结构，比如内置类型中的 Record：

```typescript
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```

其中，`K extends keyof any` 即为键的类型，这里使用 `extends keyof any` 标明，传入的 K 可以是单个类型，也可以是联合类型，而 T 即为属性的类型。

```typescript
// 键名均为字符串，键值类型未知
type Record1 = Record<string, unknown>;
// 键名均为字符串，键值类型任意
type Record2 = Record<string, any>;
// 键名为字符串或数字，键值类型任意
type Record3 = Record<string | number, any>;
```

其中，`Record<string, unknown>` 和 `Record<string, any>` 是日常使用较多的形式，通常我们使用这两者来代替 object 。

在一些工具类库源码中其实还存在类似的结构声明工具类型，如：

```typescript
type Dictionary<T> = {
  [index: string]: T;
};

type NumericDictionary<T> = {
  [index: number]: T;
};
```

Dictionary （字典）结构只需要一个作为属性类型的泛型参数即可。

#### 结构处理

而对于**结构处理工具**类型，在 TypeScript 中主要是 Pick、Omit 两位选手：

```typescript
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

首先来看 Pick，它接受两个泛型参数，T 即是我们会进行结构处理的原类型（一般是对象类型），而 K 则被约束为 T 类型的键名联合类型。由于泛型约束是立即填充推导的，即你为第一个泛型参数传入 Foo 类型以后，K 的约束条件会立刻被填充，因此在你输入 K 时会获得代码提示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a4d98dda5fe424ba805f04793f4dd29~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

```typescript
interface Foo {
  name: string;
  age: number;
  job: JobUnionType;
}

type PickedFoo = Pick<Foo, "name" | "age">
```

然后 Pick 会将传入的联合类型作为需要保留的属性，使用这一联合类型配合映射类型，即上面的例子等价于：

```typescript
type Pick<T> = {
    [P in "name" | "age"]: T[P];
};
```

联合类型的成员会被依次映射，并通过索引类型访问来获取到它们原本的类型。

而对于 Omit 类型，看名字其实能 get 到它就是 Pick 的反向实现：**Pick 是保留这些传入的键**，比如从一个庞大的结构中选择少数字段保留，需要的是这些少数字段，而 **Omit 则是移除这些传入的键**，也就是从一个庞大的结构中剔除少数字段，需要的是剩余的多数部分。

但它的实现看起来有些奇怪：

```typescript
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

首先我们发现，Omit 是基于 Pick 实现的，这也是 TypeScript 中成对工具类型的另一种实现方式。上面的 Partial 与 Required 使用类似的结构，**在关键位置使用一个相反操作来实现反向**，而这里的 Omit 类型则是基于 Pick 类型实现，也就是**反向工具类型基于正向工具类型实现**。

首先接受的泛型参数类似，也是一个类型与联合类型（要剔除的属性），但是在将这个联合类型传入给 Pick 时多了一个 Exclude，这一工具类型属于工具类型，我们可以暂时理解为 `Exclude<A, B>` 的结果就是联合类型 A 中不存在于 B 中的部分：

```typescript
type Tmp1 = Exclude<1, 2>; // 1
type Tmp2 = Exclude<1 | 2, 2>; // 1
type Tmp3 = Exclude<1 | 2 | 3, 2 | 3>; // 1
type Tmp4 = Exclude<1 | 2 | 3, 2 | 4>; // 1 | 3
```

因此，在这里 `Exclude<keyof T, K>` 其实就是 T 的键名联合类型中剔除了 K 的部分，将其作为 Pick 的键名，就实现了剔除一部分类型的效果。

### 集合工具类型

这一部分的工具类型主要使用条件类型、条件类型分布式特性。

在开始集合类型前，我们不妨先聊一聊数学中的集合概念。对于两个集合来说，通常存在**交集、并集、差集、补集**这么几种情况，用图表示是这样的：

![img](https://s2.loli.net/2022/07/29/7WVlOzdxZGQ6Xhy.webp)

我们搭配上图来依次解释这些概念。

- **并集**，两个集合的合并，合并时重复的元素只会保留一份（这也是联合类型的表现行为）。
- **交集**，两个集合的相交部分，即同时存在于这两个集合内的元素组成的集合。
- **差集**，对于 A、B 两个集合来说，A 相对于 B 的差集即为 **A 中独有而 B 中不存在的元素** 的组成的集合，或者说 **A 中剔除了 B 中也存在的元素以后剩下的部分**。
- **补集**，补集是差集的特殊情况，此时**集合 B 为集合 A 的子集**，在这种情况下 **A 相对于 B 的补集** + **B** = **完整的集合 A**。

内置工具类型中提供了交集与差集的实现：

```typescript
type Extract<T, U> = T extends U ? T : never;

type Exclude<T, U> = T extends U ? never : T;
```

这里的具体实现其实就是条件类型的分布式特性，即当 T、U 都是联合类型（视为一个集合）时，T 的成员会依次被拿出来进行 `extends U ? T1 : T2 `的计算，然后将最终的结果再合并成联合类型。

比如对于交集 Extract ，其运行逻辑是这样的：

```typescript
type AExtractB = Extract<1 | 2 | 3, 1 | 2 | 4>; // 1 | 2

type _AExtractB =
  | (1 extends 1 | 2 | 4 ? 1 : never) // 1
  | (2 extends 1 | 2 | 4 ? 2 : never) // 2
  | (3 extends 1 | 2 | 4 ? 3 : never); // never
```

而差集 Exclude 也是类似，但需要注意的是，差集存在相对的概念，即 A 相对于 B 的差集与 B 相对于 A 的差集并不一定相同，而交集则一定相同。

为了便于理解，我们也将差集展开：

```typescript
type SetA = 1 | 2 | 3 | 5;

type SetB = 0 | 1 | 2 | 4;

type AExcludeB = Exclude<SetA, SetB>; // 3 | 5
type BExcludeA = Exclude<SetB, SetA>; // 0 | 4

type _AExcludeB =
  | (1 extends 0 | 1 | 2 | 4 ? never : 1) // never
  | (2 extends 0 | 1 | 2 | 4 ? never : 2) // never
  | (3 extends 0 | 1 | 2 | 4 ? never : 3) // 3
  | (5 extends 0 | 1 | 2 | 4 ? never : 5); // 5

type _BExcludeA =
  | (0 extends 1 | 2 | 3 | 5 ? never : 0) // 0
  | (1 extends 1 | 2 | 3 | 5 ? never : 1) // never
  | (2 extends 1 | 2 | 3 | 5 ? never : 2) // never
  | (4 extends 1 | 2 | 3 | 5 ? never : 4); // 4
```

除了差集和交集，我们也可以很容易实现并集与补集，为了更好地建立印象，这里我们使用集合相关的命名：

```typescript
// 并集
export type Concurrence<A, B> = A | B;

// 交集
export type Intersection<A, B> = A extends B ? A : never;

// 差集
export type Difference<A, B> = A extends B ? never : A;

// 补集
export type Complement<A, B extends A> = Difference<A, B>;
```

补集基于差集实现，我们只需要约束**集合 B 为集合 A 的子集**即可。

内置工具类型中还有一个场景比较明确的集合工具类型：

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type _NonNullable<T> = Difference<T, null | undefined>
```

很明显，它的本质就是集合 T 相对于 `null | undefined` 的差集，因此我们可以用之前的差集来进行实现。

在基于分布式条件类型的工具类型中，其实也存在着正反工具类型，但**并不都是简单地替换条件类型结果的两端**，如交集与补集就只是简单调换了结果，但二者作用却**完全不同**。

联合类型中会自动合并相同的元素，因此我们可以默认这里指的类型集合全部都是类似 Set 那样的结构，不存在重复元素。



### 模式匹配工具类型

这一部分的工具类型主要使用**条件类型**与 **infer 关键字**。

在条件类型一节中我们已经差不多了解了 infer 关键字的使用，而更严格地说 infer 其实代表了一种 **模式匹配（pattern matching）** 的思路，如正则表达式、Glob 中等都体现了这一概念。

首先是对函数类型签名的模式匹配：

```typescript
type FunctionType = (...args: any) => any;

type Parameters<T extends FunctionType> = T extends (...args: infer P) => any ? P : never;

type ReturnType<T extends FunctionType> = T extends (...args: any) => infer R ? R : any;
```

根据 infer 的位置不同，我们就能够获取到不同位置的类型，在函数这里则是参数类型与返回值类型。

我们还可以更进一步，比如只匹配第一个参数类型：

```typescript
type FirstParameter<T extends FunctionType> = T extends (
  arg: infer P,
  ...args: any
) => any
  ? P
  : never;

type FuncFoo = (arg: number) => void;
type FuncBar = (...args: string[]) => void;

type FooFirstParameter = FirstParameter<FuncFoo>; // number

type BarFirstParameter = FirstParameter<FuncBar>; // string
```

除了对函数类型进行模式匹配，内置工具类型中还有一组对 Class 进行模式匹配的工具类型：

```typescript
type ClassType = abstract new (...args: any) => any;

type ConstructorParameters<T extends ClassType> = T extends abstract new (
  ...args: infer P
) => any
  ? P
  : never;

type InstanceType<T extends ClassType> = T extends abstract new (
  ...args: any
) => infer R
  ? R
  : any;
```

Class 的通用类型签名可能看起来比较奇怪，但实际上它就是声明了可实例化（new）与可抽象（abstract）罢了。我们也可以使用接口来进行声明：

```typescript
export interface ClassType<TInstanceType = any> {
    new (...args: any[]): TInstanceType;
}
```

对 Class 的模式匹配思路类似于函数，或者说这是一个通用的思路，即基于放置位置的匹配。放在参数部分，那就是构造函数的参数类型，放在返回值部分，那当然就是 Class 的实例类型了。

## 高级类型

### 交叉类型（Intersection Types）

交叉类型是将多个类型合并为一个类型。 这让我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性。 例如， `Person & Serializable & Loggable`同时是 `Person` *和* `Serializable` *和* `Loggable`。 就是说这个类型的对象同时拥有了这三种类型的成员

```ts
function extend<T, U>(first: T, second: U): T & U {
    let result = <T & U>{};
    for (let id in first) {
        (<any>result)[id] = (<any>first)[id];
    }
    for (let id in second) {
        if (!result.hasOwnProperty(id)) {
            (<any>result)[id] = (<any>second)[id];
        }
    }
    return result;
}

class Person {
    constructor(public name: string) { }
}
interface Loggable {
    log(): void;
}
class ConsoleLogger implements Loggable {
    log() {
        // ...
    }
}
var jim = extend(new Person("Jim"), new ConsoleLogger());
var n = jim.name;
jim.log();
```

### 联合类型（Union Types）

联合类型与交叉类型很有关联，但是使用上却完全不同。 偶尔你会遇到这种情况，一个代码库希望传入 `number`或 `string`类型的参数。 例如下面的函数：

```ts
function padLeft(value: string, padding: any) {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
    throw new Error(`Expected string or number, got '${padding}'.`);
}

padLeft("Hello world", 4); // returns "    Hello world"
```

`padLeft`存在一个问题， `padding`参数的类型指定成了 `any`。 这就是说我们可以传入一个既不是 `number`也不是 `string`类型的参数，但是TypeScript却不报错

代替 `any`， 我们可以使用 *联合类型*做为 `padding`的参数：

```ts
function padLeft(value: string, padding: string | number) {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
    throw new Error(`Expected string or number, got '${padding}'.`);
}
```

联合类型表示一个值可以是几种类型之一。 我们用竖线（ `|`）分隔每个类型，所以 `number | string | boolean`表示一个值可以是 `number`， `string`，或 `boolean`

### 类型保护与区分类型（Type Guards and Differentiating Types）

联合类型适合于那些值可以为不同类型的情况。 但当我们想确切地了解是否为 `Fish`时怎么办？ JavaScript里常用来区分2个可能值的方法是检查成员是否存在。 如之前提及的，我们只能访问联合类型中共同拥有的成员。

```ts
let pet = getSmallPet();

// 每一个成员访问都会报错
if (pet.swim) {
    pet.swim();
}
else if (pet.fly) {
    pet.fly();
}
```

为了让这段代码工作，我们要使用类型断言：

```ts
let pet = getSmallPet();

if ((<Fish>pet).swim) {
    (<Fish>pet).swim();
}
else {
    (<Bird>pet).fly();
}
```

#### 用户自定义的类型保护

这里可以注意到我们不得不多次使用类型断言。 假若我们一旦检查过类型，就能在之后的每个分支里清楚地知道 `pet`的类型的话就好了。

TypeScript里的 *类型保护*机制让它成为了现实。 类型保护就是一些表达式，它们会在运行时检查以确保在某个作用域里的类型。 要定义一个类型保护，我们只要简单地定义一个函数，它的返回值是一个 *类型谓词*：

```ts
function isFish(pet: Fish | Bird): pet is Fish {
    return (<Fish>pet).swim !== undefined;
}
```

在这个例子里， `pet is Fish`就是类型谓词。 谓词为 `parameterName is Type`这种形式， `parameterName`必须是来自于当前函数签名里的一个参数名。

每当使用一些变量调用 `isFish`时，TypeScript会将变量缩减为那个具体的类型，只要这个类型与变量的原始类型是兼容的。

```ts
// 'swim' 和 'fly' 调用都没有问题了

if (isFish(pet)) {
    pet.swim();
}
else {
    pet.fly();
}
```

注意TypeScript不仅知道在 `if`分支里 `pet`是 `Fish`类型； 它还清楚在 `else`分支里，一定 *不是* `Fish`类型，一定是 `Bird`类型。

这些`typeof`类型保护*只有两种形式能被识别： `typeof v === "typename"`和 `typeof v !== "typename"`， `"typename"`必须是 `"number"`， `"string"`， `"boolean"`或 `"symbol"`

`instanceof`的右侧要求是一个构造函数，TypeScript将细化为：

1. 此构造函数的 `prototype`属性的类型，如果它的类型不为 `any`的话
2. 构造签名所返回的类型的联合

当你声明一个变量时，它不会自动地包含 `null`或 `undefined`。 你可以使用联合类型明确的包含它们：

```ts
let s = "foo";
s = null; // 错误, 'null'不能赋值给'string'
let sn: string | null = "bar";
sn = null; // 可以

sn = undefined; // error, 'undefined'不能赋值给'string | null'
```

TypeScript会把 `null`和 `undefined`区别对待。 `string | null`， `string | undefined`和 `string | undefined | null`是不同的类型

类型别名会给一个类型起个新名字。 类型别名有时和接口很像，但是可以作用于原始值，联合类型，元组以及其它任何你需要手写的类型。

```ts
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n;
    }
    else {
        return n();
    }
}
```

起别名不会新建一个类型 - 它创建了一个新 *名字*来引用那个类型。 给原始类型起别名通常没什么用，尽管可以做为文档的一种形式使用。

同接口一样，类型别名也可以是泛型 - 我们可以添加类型参数并且在别名声明的右侧传入：

```ts
type Container<T> = { value: T };
```

我们也可以使用类型别名来在属性里引用自己：

```ts
type Tree<T> = {
    value: T;
    left: Tree<T>;
    right: Tree<T>;
}
```

#### 索引类型（Index types）

使用索引类型，编译器就能够检查使用了动态属性名的代码。 例如，一个常见的JavaScript模式是从对象中选取属性的子集。

```ts
function pluck(o, names) {
    return names.map(n => o[n]);
}
```

通过 **索引类型查询**和 **索引访问**操作符：

```ts
function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
  return names.map(n => o[n]);
}

interface Person {
    name: string;
    age: number;
}
let person: Person = {
    name: 'Jarid',
    age: 35
};
let strings: string[] = pluck(person, ['name']); // ok, string[]
```

编译器会检查 `name`是否真的是 `Person`的一个属性。 本例还引入了几个新的类型操作符。 首先是 `keyof T`， **索引类型查询操作符**。 对于任何类型 `T`， `keyof T`的结果为 `T`上已知的公共属性名的联合。 例如：

```ts
let personProps: keyof Person; // 'name' | 'age'
```

`keyof Person`是完全可以与 `'name' | 'age'`互相替换的。 不同的是如果你添加了其它的属性到 `Person`，例如 `address: string`，那么 `keyof Person`会自动变为 `'name' | 'age' | 'address'`。 你可以在像 `pluck`函数这类上下文里使用 `keyof`，因为在使用之前你并不清楚可能出现的属性名。 但编译器会检查你是否传入了正确的属性名给 `pluck`：

```ts
pluck(person, ['age', 'unknown']); // error, 'unknown' is not in 'name' | 'age'
```

第二个操作符是 `T[K]`， **索引访问操作符**。 在这里，类型语法反映了表达式语法。 这意味着 `person['name']`具有类型 `Person['name']` — 在我们的例子里则为 `string`类型。 然而，就像索引类型查询一样，你可以在普通的上下文里使用 `T[K]`，这正是它的强大所在。 你只要确保类型变量 `K extends keyof T`就可以了。 例如下面 `getProperty`函数的例子：

```ts
function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
    return o[name]; // o[name] is of type T[K]
}
```

`getProperty`里的 `o: T`和 `name: K`，意味着 `o[name]: T[K]`。 当你返回 `T[K]`的结果，编译器会实例化键的真实类型，因此 `getProperty`的返回值类型会随着你需要的属性改变。

```ts
let name: string = getProperty(person, 'name');
let age: number = getProperty(person, 'age');
let unknown = getProperty(person, 'unknown'); // error, 'unknown' is not in 'name' | 'age'
```

 索引类型和字符串索引签名

`keyof`和 `T[K]`与字符串索引签名进行交互。 如果你有一个带有字符串索引签名的类型，那么 `keyof T`会是 `string`。 并且 `T[string]`为索引签名的类型：

```ts
interface Map<T> {
    [key: string]: T;
}
let keys: keyof Map<number>; // string
let value: Map<number>['foo']; // number
```

### 映射类型

一个常见的任务是将一个已知的类型每个属性都变为可选的：

```ts
interface PersonPartial {
    name?: string;
    age?: number;
}
```

或者我们想要一个只读版本：

```ts
interface PersonReadonly {
    readonly name: string;
    readonly age: number;
}
```

这在JavaScript里经常出现，TypeScript提供了从旧类型中创建新类型的一种方式 — **映射类型**。 在映射类型里，新类型以相同的形式去转换旧类型里每个属性。 例如，你可以令每个属性成为 `readonly`类型或可选的。 下面是一些例子：

```ts
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
}
type Partial<T> = {
    [P in keyof T]?: T[P];
}
```

像下面这样使用：

```ts
type PersonPartial = Partial<Person>;
type ReadonlyPerson = Readonly<Person>;
```

下面来看看最简单的映射类型和它的组成部分：

```ts
type Keys = 'option1' | 'option2';
type Flags = { [K in Keys]: boolean };
```

它的语法与索引签名的语法类型，内部使用了 `for .. in`。 具有三个部分：

1. 类型变量 `K`，它会依次绑定到每个属性。
2. 字符串字面量联合的 `Keys`，它包含了要迭代的属性名的集合。
3. 属性的结果类型。

在个简单的例子里， `Keys`是硬编码的的属性名列表并且属性类型永远是 `boolean`，因此这个映射类型等同于：

```ts
type Flags = {
    option1: boolean;
    option2: boolean;
}
```

在真正的应用里，可能不同于上面的 `Readonly`或 `Partial`。 它们会基于一些已存在的类型，且按照一定的方式转换字段。 这就是 `keyof`和索引访问类型要做的事情：

```ts
type NullablePerson = { [P in keyof Person]: Person[P] | null }
type PartialPerson = { [P in keyof Person]?: Person[P] }
```

但它更有用的地方是可以有一些通用版本。

```ts
type Nullable<T> = { [P in keyof T]: T[P] | null }
type Partial<T> = { [P in keyof T]?: T[P] }
```

在这些例子里，属性列表是 `keyof T`且结果类型是 `T[P]`的变体。 这是使用通用映射类型的一个好模版。 因为这类转换是 同态的，映射只作用于 `T`的属性而没有其它的。 编译器知道在添加任何新属性之前可以拷贝所有存在的属性修饰符。 例如，假设 `Person.name`是只读的，那么 `Partial<Person>.name`也将是只读的且为可选的。

下面是另一个例子， `T[P]`被包装在 `Proxy<T>`类里：

```ts
type Proxy<T> = {
    get(): T;
    set(value: T): void;
}
type Proxify<T> = {
    [P in keyof T]: Proxy<T[P]>;
}
function proxify<T>(o: T): Proxify<T> {
   // ... wrap proxies ...
}
let proxyProps = proxify(props);
```

注意 `Readonly<T>`和 `Partial<T>`用处不小，因此它们与 `Pick`和 `Record`一同被包含进了TypeScript的标准库里：

```ts
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
}
type Record<K extends string, T> = {
    [P in K]: T;
}
```

`Readonly`， `Partial`和 `Pick`是同态的，但 `Record`不是。 因为 `Record`并不需要输入类型来拷贝属性，所以它不属于同态：

```ts
type ThreeStringProps = Record<'prop1' | 'prop2' | 'prop3', string>
```

非同态类型本质上会创建新的属性，因此它们不会从它处拷贝属性修饰符。

#### 由映射类型进行推断

现在你了解了如何包装一个类型的属性，那么接下来就是如何拆包。 其实这也非常容易：

```ts
function unproxify<T>(t: Proxify<T>): T {
    let result = {} as T;
    for (const k in t) {
        result[k] = t[k].get();
    }
    return result;
}

let originalProps = unproxify(proxyProps);
```

注意这个拆包推断只适用于同态的映射类型。 如果映射类型不是同态的，那么需要给拆包函数一个明确的类型参数。

#### 预定义的有条件类型

TypeScript 2.8在`lib.d.ts`里增加了一些预定义的有条件类型：

- `Exclude<T, U>` -- 从`T`中剔除可以赋值给`U`的类型。
- `Extract<T, U>` -- 提取`T`中可以赋值给`U`的类型。
- `NonNullable<T>` -- 从`T`中剔除`null`和`undefined`。
- `ReturnType<T>` -- 获取函数返回值类型。
- `InstanceType<T>` -- 获取构造函数类型的实例类型。

#### 示例

```ts
type T00 = Exclude<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"
type T01 = Extract<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "a" | "c"

type T02 = Exclude<string | number | (() => void), Function>;  // string | number
type T03 = Extract<string | number | (() => void), Function>;  // () => void

type T04 = NonNullable<string | number | undefined>;  // string | number
type T05 = NonNullable<(() => string) | string[] | null | undefined>;  // (() => string) | string[]

function f1(s: string) {
    return { a: 1, b: s };
}

class C {
    x = 0;
    y = 0;
}

type T10 = ReturnType<() => string>;  // string
type T11 = ReturnType<(s: string) => void>;  // void
type T12 = ReturnType<(<T>() => T)>;  // {}
type T13 = ReturnType<(<T extends U, U extends number[]>() => T)>;  // number[]
type T14 = ReturnType<typeof f1>;  // { a: number, b: string }
type T15 = ReturnType<any>;  // any
type T16 = ReturnType<never>;  // any
type T17 = ReturnType<string>;  // Error
type T18 = ReturnType<Function>;  // Error

type T20 = InstanceType<typeof C>;  // C
type T21 = InstanceType<any>;  // any
type T22 = InstanceType<never>;  // any
type T23 = InstanceType<string>;  // Error
type T24 = InstanceType<Function>;  // Error
```

> 注意：`Exclude`类型是[建议的](https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-307871458)`Diff`类型的一种实现。我们使用`Exclude`这个名字是为了避免破坏已经定义了`Diff`的代码，并且我们感觉这个名字能更好地表达类型的语义。我们没有增加`Omit<T, K>`类型，因为它可以很容易的用`Pick<T, Exclude<keyof T, K>>`来表示。

## 高级类型总结

### Record

以 typeof 格式快速创建一个类型，此类型包含一组指定的属性且都是必填。

```typescript
type Coord = Record<'x' | 'y', number>;

// 等同于
type Coord = {
	x: number;
	y: number;
}
```

具体的复杂业务场景中，一般会接口 `Pick` 、`Partial` 等组合使用，从而过滤和重组出新的类型定义。

### Partial

将类型定义的所有属性都修改为可选。

```typescript
type Coord = Partial<Record<'x' | 'y', number>>;

// 等同于
type Coord = {
	x?: number;
	y?: number;
}
```

### Readonly

不管是从字面意思，还是定义上都很好理解：将所有属性定义为自读。

```typescript
type Coord = Readonly<Record<'x' | 'y', number>>;

// 等同于
type Coord = {
    readonly x: number;
    readonly y: number;
}

// 如果进行了修改，则会报错：
const c: Coord = { x: 1, y: 1 };
c.x = 2; // Error: Cannot assign to 'x' because it is a read-only property.

```

### Pick

从类型定义的属性中，选取指定一组属性，返回一个新的类型定义。

```typescript
type Coord = Record<'x' | 'y', number>;
type CoordX = Pick<Coord, 'x'>;

// 等用于
type CoordX = {
	x: number;
}
```

### Required< T >

```ts
/**
 * Make all properties in T required
 */
type Required<T> = {
    [P in keyof T]-?: T[P];
};

```

与 `Partial<T>` 程序类型的作用相反，将类型属性都变成必填。

```ts
type Coord = Required<{ x: number, y?:number }>;

// 等同于
type Coord = {
	x: number;
	y: number;
}

```

主要是因为 `-?` 映射条件的装饰符的能力，去掉了所有可选参数状态，更多的装饰符说明可以之前分享的 [TypeScript 的映射类型 Mapped types (e.g. { [P in K\]: T[P] })](https://juejin.cn/post/6844904066481389575)

### Exclude<T, U>

```ts
/**
 * Exclude from T those types that are assignable to U
 */
type Exclude<T, U> = T extends U ? never : T;

```

排除一个 **联合类型** 中指定的子类型：

```ts
type T0 = Exclude<'a' | 'b' | 'c', 'b'> // 'a' | 'c'
type T1 = Exclude<string | number | boolean, boolean> // string | number
```

主要是基于 extends 条件类型的[解析推迟的特性](https://juejin.cn/post/6844904066485583885#heading-4)，返回了匹配之外的所有 候选类型，配合 [never 类型](https://juejin.cn/post/6844904067152494599) 的空值特性，实现了这一高级类型。

### Extract<T, U>

```ts
/**
 * Extract from T those types that are assignable to U
 */
type Extract<T, U> = T extends U ? T : never;

```

与 `Exclude<T, U>` 完全相反的功能，用于提取指定的 **联合类型**，如果不存在提取类型，则返回never。可以用在判断一个复杂的 联合类型 中是否包含指定子类型：

```ts
type T0 = Extract<'a' | 'b' | 'c', 'a'> // 'a'
type T1 = Extract<string | number | boolean, boolean> // boolean
```

### Omit<T, K extends keyof any>

```ts
/**
 * Construct a type with the properties of T except for those in type K.
 */
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

```

排除**接口**中指定的属性：

```ts
interface I1 {
	a: number;
	b: string;
	c: boolean;
}

type AC = Omit<I1, 'b'>;     // { a:number; c:boolean } 
type C = Omit<I1, 'a' |'b'>  // { c: boolean }
```

这个在高级类型的使用频率也比较高。

### NonNullable< T >

```ts
/**
 * Exclude null and undefined from T
 */
type NonNullable<T> = T extends null | undefined ? never : T;

```

过滤掉 联合类型 中的 `null` 和 `undefined` 类型：

```ts
type T1 = NonNullable<string | null | undefined>; // string

```

额外说明下，因为 `null` 和 `undefined` 类型的特殊性，他们可以赋值给任何类型，这往往会带来意料之外的错误。当你开启 `--strictNullChecks` 设置后，TS 就会严格检查，只有被声明 null 后才能被赋值：

```ts
// 关闭 --strictNullChecks
let s: string = "foo";
s = null; // 正常

// 开启 --strictNullChecks
s = null; // Error: Type 'null' is not assignable to type 'string'. 

```

### Parameters<T extends (...args: any) => any>

```ts
/**
 * Obtain the parameters of a function type in a tuple
 */
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

```

获取函数的全部参数类型，以 **元组类型** 返回：

```ts
type F1 = (a: string, b: number) => void;

type F1ParamTypes = Parameters(F1);  // [string, number]

```

如果你想了解原理，可以看之前分享的 [TypeScript 条件类型的 infer 类型推断能力](https://juejin.cn/post/6844904067420913678) 。

### ConstructorParameters<T extends new (...args: any) => any>

```ts
/**
 * Obtain the parameters of a constructor function type in a tuple
 */
type ConstructorParameters<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : never;

```

同上面的类型很相似，只是这里获取的是 **构造函数** 的全部参数。关于构造函数声明，以及如何使用此 高级类型 的方式：

```ts
interface IEntity {
    count?: () => number
}

interface IEntityConstructor {
    new (a: boolean, b: string): IEntity;
}

class Entity implements IEntity {
    constructor(a: boolean, b: string) { }
}

type EntityConstructorParamType = ConstructorParameters<IEntityConstructor>; // [boolean, string]

```

这里的 `IEntityConstructor` 接口用来干什么的呢，当基于 创建实例函数 时就派上了用场：

```ts
function createEntity(ctor: IEntityConstructor, ...arg: EntityConstructorParamType): IEntity {
    return new ctor(...arg);
}

const entity = createEntity(Entity, true, 'a');

```

### ReturnType<T extends (...args: any) => any>

```ts
/**
 * Obtain the return type of a function type
 */
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

```

接收函数声明，返回函数的返回值类型，如果多个类型则以 联合类型 方式返回：

```ts
type F1 = () => Date;

type F1ReturnType = ReturnType<F1>; // Date

```

### InstanceType<T extends new (...args: any) => any>

```ts
/**
 * Obtain the return type of a constructor function type
 */
type InstanceType<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : any;

```

获取 构造函数 的返回类型，如果是多个就以 联合类型 的方式返回，我们借用上面的定义：

```ts
type EntityType = InstanceType<IEntityConstructor>; // IEntity

```

### ThisParameterType< T >

```ts
/**
 * Extracts the type of the 'this' parameter of a function type, or 'unknown' if the function type has no 'this' parameter.
 */
type ThisParameterType<T> = T extends (this: infer U, ...args: any[]) => any ? U : unknown;

```

获取函数中 `this` 的数据类型，如果没有则返回 `unknown` 类型：

```ts
interface Foo {
    x: number
};

function fn(this: Foo) {}

type Test = ThisParameterType<typeof fn>; // Foo

```

因为可以在 TS 声明函数的 `this` ，此方法用于获取此声明，具体的使用：

```ts
fn.bind({ x: 1 });   // 正常

fn.bind({ x: '1' }); // Error: ...Type 'string' is not assignable to type 'number'...

```

### OmitThisParameter< T >

```ts
/**
 * Removes the 'this' parameter from a function type.
 */
type OmitThisParameter<T> = unknown extends ThisParameterType<T> ? T : T extends (...args: infer A) => infer R ? (...args: A) => R : T;

```

移除函数中的 `this` 数据类型：

```ts
interface Foo {
    x: number
};

type Fn = (this: Foo) => void

type NonReturnFn = OmitThisParameter<Fn>; // () => void

```

声明此类的函数类型效果如下：

```ts
function f(this: void) {} // 此声明在函数内不可使用 this
```



## 类型体操

[type-challenge](https://github.com/type-challenges/type-challenges)

[你以为学会TypeScript了？先看看这16道题能做对多少先！](https://juejin.cn/post/7110232056826691591)

### 1.实现一个`pick`

#### 题目

不使用内置的`Pick<T, K>`泛型, 通过从 T 中选择属性 K 来构造类型

例如

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = MyPick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};
```

#### 答案

```typescript
type MyPick<T, Ks extends keyof T> = {
  [K in Ks]: T[K];
};
```

#### 分析

从`T`中选择属性`K`, 那么`K`一定要是`T`的键.  
所以需要对泛型参数进行约束, 即限制`Ks extends keyof T` => `Ks`(Keys) 一定要是 `T` 的 key 的子集.

之后, 我们返回一个类型, 这个类型的 Key 来自于`K`, `K`是怎么来的呢,  
我们遍历给定的 Keys(`[K in Ks]`), 将得到的 Ks 这个 union 类型的每一项记作 `K`.  
对于每个`K`, 在我们返回的对象上追加一条属性, 该属性的名称为`K`, 值的类型为`T[K]`
(从原始对象上得到这个 Key(`K`)对应的类型, 此操作与在 JS 对象上根据键获得值类型, 只不过是根据键获得值的**类型**)

最后得到的这个类型即为从原类型上挑选出需要的 keys 的类型了

#### 伪代码：

```typescript
function MyPick(T, Ks) { // Ks 是联合类型, 可看作js中的 Set 来遍历
  if(Ks is not subset of (keyof T)) throw new Error() // Ks extends keyof T

  const returnType = {};
  for (let K of Ks) { // [K in Ks]
    typeOf(returnType[K]) = typeOf(T[K]); //[K in Ks]: T[K];
  }

  return returnType
}
```



### 2.实现一个`Readonly`

实现内置的`Readonly<T>`泛型.  
构造一个类型，并将 T 的所有属性设置为只读，这意味着无法重新对所构造类型的属性进行赋值

#### 题目

例如

```ts
interface Todo {
  title: string;
  description: string;
}

const todo: MyReadonly<Todo> = {
  title: "Hey",
  description: "foobar",
};

todo.title = "Hello"; // Error: cannot reassign a readonly property
todo.description = "barFoo"; // Error: cannot reassign a readonly property
```

#### 答案

```ts
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};
```

#### 分析

遍历`T`的每一个 key, 对每一个`K`添加
[`readonly`描述符](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#readonly-and-const)
, 而`K`对应的值的类型即为对象上原本的类型`T[K]`

#### 伪代码:

```typescript
function MyReadonly(T) {
  const returnType = {};

  // 获得 T 上所有的 key
  for (let K in T) {
    returnType[K] = readonly(T[K]);
  }

  return returnType;
}
```

### 3.实现一个`Tuple to Object`

#### 题目

给定数组，转换为对象类型，键/值必须在给定数组中

例如

```ts
const tuple = ["tesla", "model 3", "model X"] as const;

const result: TupleToObject<typeof tuple> = {
  tesla: "tesla",
  "model 3": "model 3",
  "model X": "model X",
};
```

#### 答案

```ts
type TupleToObject<T extends readonly (number | string | symbol)[]> = {
  [V in T[number]]: V;
};
```

#### 分析

`TupleToObject`接受一个泛型参数 `T`, 首先这个`T`要是一个数组, 那么我们可以先写下以下代码

```ts
type TupleToObject<T extends any[]> = {
  /* TODO */
};
```

其次依题意, 这个数组是被`as const`修饰过的, 其作用在于将一个变量的类型限制为他的**值**, 且让他不可变, 例如

```ts
let a = "foo"; // type of a is *string*
let b = "bar" as const; // type of a is *"bar"*

let arr = ["foo", "bar"]; // type of arr is ["string", "string"]
// type of arrAsConst is ["foo", "bar"]
let arrAsConst = ["foo", "bar"] as const;
```

关于`as const`, 详见[杀手级的 TypeScript 功能：const 断言](https://juejin.cn/post/6844903848939634696).
总之, 兼容这种类型, 必须修改代码为以下:

```ts
// `readonly` 与 `as const` 对应
type TupleToObject<T extends readonly any[]> = {
  /* TODO */
};
```

再次, 该数组中的 value 最后会变成一个对象的属性, 而我们知道对象的属性只能接受`string | number | symbol`
几种形式, 进一步约束泛型参数为

```ts
// 注意三种类型首字母均小写, 是 symbol 而不是 Symbol
// 二者区别详见 https://stackoverflow.com/questions/14727044/what-is-the-difference-between-types-string-and-string
type TupleToObject<T extends readonly (number | string | symbol)[]> = {
  /* TODO */
};
```

最后, 我们依次取出传入数组的每一项的值的**类型**, 我们知道对数组取值是使用下标进行访问得到的, 而下标
都是`number`类型. 在 TS 类型编程中, 我们可以使用`T[number]`的写法来获得所有值的**类型**, 完整代码如下

```ts
type TupleToObject<T extends readonly (number | string | symbol)[]> = {
  [V in T[number]]: V;
};
```

#### 伪代码

```typescript
function TupleToObject(T) {
  if(!(T extends Array<(number | string | symbol)>)) throw new Error()
  if(T is not readonly) throw new Error()

  const returnType = {};
  T.forEach((value)=>{
    /*
     * 此处不是直接用 value 当作对象的键和值, 我们是在进行类型编程, 操作的都是类型
     * \`\`\`ts
     * var value = "foo"   // 此处"foo"是一个JS字符串
     * typeOf(value)       // 得到的结果是 "foo", 此处 "foo" 是TS类型
     * \`\`\`
     */
    returnType[typeOf(value)] = typeOf(value);
  })

  return returnType;
}
```

### 4.第一个元素`First<T>`

实现一个通用`First<T>`，它接受一个数组`T`并返回它的第一个元素的类型。

例如：

```ts
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type head1 = First<arr1> // expected to be 'a'
type head2 = First<arr2> // expected to be 3

```

题目来源：[tsch.js.org/14/zh-CN](https://link.juejin.cn?target=https%3A%2F%2Ftsch.js.org%2F14%2Fzh-CN)

#### 解答

##### 解法一

```ts
type First<T extends any[]> = T['length'] extends 0 ? never : T[0];
type First<T extends any[]> = T extends [] ? never : T[0]

```

判断数组长度，如果长度不是0，则代表0位有值，可以取0位。

##### 解法二

```ts
type First<T extends any[]> = T[0] extends T[number] ? T[0] : never;

```

通过`T[number]`代表数组单个项的值，推断`T[0] extends T[number]`。
 如果属于，则代表长度大于0，有值。

##### 解法三

```ts
type First<T extends any[]> = T extends [infer F] ? F : never

```

通过`infer`指代数组第一个项，如果`T extends [infer F]`推断是`true`，则得到第一个项type为`F`。

##### 解法四

```ts
type First<T> = T extends [infer P, ...infer Rest] ? P : never

```

使用扩展运算符，配合`infer`，可以得到第一个项的type。

### 5、获取元组长度

创建一个通用的`Length`，接受一个`readonly`的数组，返回这个数组的长度。

例如：

```ts
type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']

type teslaLength = Length<tesla> // expected 4
type spaceXLength = Length<spaceX> // expected 5

```

题目来源：[tsch.js.org/18/zh-CN](https://link.juejin.cn?target=https%3A%2F%2Ftsch.js.org%2F18%2Fzh-CN)

#### 解答

```ts
type Length<T extends readonly any[]> = T['length'];

```

数组的长度，用`T['length']`可以推导出来。
 这里加`readonly`的原因是，如果数组是用`const`声明，则必须是`readonly`。

### 6、实现 Exclude

实现内置的Exclude <T, U>类型，但不能直接使用它本身。

> 从联合类型T中排除U的类型成员，来构造一个新的类型。

题目来源：[tsch.js.org/43/zh-CN](https://link.juejin.cn?target=https%3A%2F%2Ftsch.js.org%2F43%2Fzh-CN)

#### 解答

```ts
type MyExclude<T, U> = T extends U ? never : T;

```

使用`extends`条件推断，如果为`false`，则是独立存在于T的集合。

### 7、Awaited

假如我们有一个 Promise 对象，这个 Promise 对象会返回一个类型。在 TS 中，我们用 `Promise<T>` 中的 T 来描述这个 Promise 返回的类型。请你实现一个类型，可以获取这个类型。

比如：`Promise<ExampleType>`，请你返回 ExampleType 类型。

题目来源：[tsch.js.org/189/zh-CN](https://link.juejin.cn?target=https%3A%2F%2Ftsch.js.org%2F189%2Fzh-CN)

#### 解答

```ts
type MyAwaited<T extends Promise<any>> = T extends Promise<infer U> ?  U extends Promise<any> 
                                          ? MyAwaited<U> 
                                          : U 
                                        : never;

```

先用条件推断，泛型`T`是否是Promise返回，并用`infer U`指代返回值。
 `U`有两种情况：

- 普通返回值类型
- Promise类型

如果`U`是`Promise`类型，则需要递归检查。对应的代码是：

```ts
 U extends Promise<any> ? MyAwaited<U> : U 

```

如果是普通返回值类型，则直接返回`U`。

#### 为什么要加`extends Promise<any>`?

`MyAwaited<T extends Promise<any>>`的含义，是为了避免用户传入**非Promise function**。
 如果用户违反规则，TypeScript会按报错处理。

#### 8、IF

实现一个 `IF` 类型，它接收一个条件类型 `C` ，一个判断为真时的返回类型 `T` ，以及一个判断为假时的返回类型 `F`。 `C` 只能是 `true` 或者 `false`， `T` 和 `F` 可以是任意类型。

举例:

```ts
type A = If<true, 'a', 'b'>  // expected to be 'a'
type B = If<false, 'a', 'b'> // expected to be 'b'
```

题目来源：[tsch.js.org/268/zh-CN](https://link.juejin.cn?target=https%3A%2F%2Ftsch.js.org%2F268%2Fzh-CN)

#### 解答

```ts
type If<C extends boolean, T, F> = C extends false ? F : T;
```

题意要求，`C`必须是boolean类型，所以对非boolean类型的传值，应该按报错处理。
 使用`C extends boolean`进行限制。

使用`extends`进行条件推断，即可根据判断决定返回的值。

### 9、Concat

在类型系统里实现 JavaScript 内置的 `Array.concat` 方法，这个类型接受两个参数，返回的新数组类型应该按照输入参数从左到右的顺序合并为一个新的数组。

举例，

```ts
type Result = Concat<[1], [2]> // expected to be [1, 2]
```

题目来源：[tsch.js.org/533/zh-CN](https://link.juejin.cn?target=https%3A%2F%2Ftsch.js.org%2F533%2Fzh-CN)

#### 解答

```ts
type Concat<T extends any[], U extends any[] > = [...T, ...U];
```

先用`extends any[]`限制泛型`T`和`U`是数组类型。
 接着，就可以使用扩展运算符进行扩展数组。

### 10、Includes

在类型系统里实现 JavaScript 的 `Array.includes` 方法，这个类型接受两个参数，返回的类型要么是 `true` 要么是 `false`。

举例来说，

```ts
type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // expected to be `false`
```

题目来源：[tsch.js.org/898/zh-CN](https://link.juejin.cn?target=https%3A%2F%2Ftsch.js.org%2F898%2Fzh-CN)

#### 解答

```ts
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;

type Includes<T extends readonly any[], U> = T extends [infer K, ...infer R] ? 
                                                Equal<U, K> extends true ? 
                                                  true
                                                  :
                                                  Includes<R, U>
                                                : false

```

解题的重点有两个：

- 判断两个类型相等，需要实现`Equal`
- 逐个拆解类型数组T，将单个项取出来比较

#### Equal

`<T>() => T extends X ? 1 : 2` 和 `(<T>() => T extends Y ? 1 : 2)`： 取出比较参数的类型。
 如果`X`,`Y`不相等，则第1个表达式取到的数字，和第2个表达式取到的数字不一样。
 原因是T只能是一种类型。（1只脚不能同时踏入两条河流的哲学问题：））

#### 逐个取出数组中的值

`T extends [infer K, ...infer R]`用于提取数组中的值，并使用`Equal<U, K>`进行比较。
 如果不相等，则用`Includes<R, U>`递归处理。

### 11、Push

在类型系统里实现通用的 `Array.push` 。

举例如下，

```typescript
type Result = Push<[1, 2], '3'> // [1, 2, '3']
```

题目来源：[tsch.js.org/3057/zh-CN](https://link.juejin.cn?target=https%3A%2F%2Ftsch.js.org%2F3057%2Fzh-CN)

#### 解答

```ts
type Push<T extends any[], U> = [...T, U];
```

使用`extends any []`限制泛型`T`为数组类型，
 然后，使用扩展运算符展开`T`,进行合并。

### 12、Pop

实现一个通用`Pop<T>`，它接受一个数组`T`并返回一个没有最后一个元素的数组。

例如

```ts
type arr1 = ['a', 'b', 'c', 'd']
type arr2 = [3, 2, 1]

type re1 = Pop<arr1> // expected to be ['a', 'b', 'c']
type re2 = Pop<arr2> // expected to be [3, 2]
```

题目来源：[tsch.js.org/16/zh-CN](https://link.juejin.cn?target=https%3A%2F%2Ftsch.js.org%2F16%2Fzh-CN)

#### 解答

```ts
type Pop<T extends any[]> = T extends [...infer K, infer U] ? K : never;
```

使用`infer`进行指代，配合解构，即可解开此题。

### 13、Unshift

实现类型版本的 `Array.unshift`。

举例，

```typescript
type Result = Unshift<[1, 2], 0> // [0, 1, 2,]
```

题目来源：[tsch.js.org/3060/zh-CN](https://link.juejin.cn?target=https%3A%2F%2Ftsch.js.org%2F3060%2Fzh-CN)

#### 解答

```ts
type Unshift<T extends any[], U> = [U, ...T]; 
```

使用`extends any []`限制泛型`T`为数组类型，
 然后，使用扩展运算符展开`T`,进行合并。

### 14、实现内置的 `Parameters<T>` 类型

实现内置的 `Parameters<T>` 类型，而不是直接使用它，可参考[TypeScript官方文档](https://link.juejin.cn?target=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2Futility-types.html%23parameterstype)。

题目来源：[tsch.js.org/3312/zh-CN](https://link.juejin.cn?target=https%3A%2F%2Ftsch.js.org%2F3312%2Fzh-CN)

#### 解答

```ts
type MyParameters<T extends (...args: any[]) => any> = T extends (...args: infer U) => any ? U : never;
```

使用`infer U`指代参数列表，就可以正确推导出类型。

### 15、获取函数返回类型

不使用 `ReturnType` 实现 TypeScript 的 `ReturnType<T>` 泛型。

例如：

```ts
const fn = (v: boolean) => {
  if (v)
    return 1
  else
    return 2
}
type a = MyReturnType<typeof fn> // 应推导出 "1 | 2"
```

题目来源：[tsch.js.org/2/zh-CN](https://link.juejin.cn?target=https%3A%2F%2Ftsch.js.org%2F2%2Fzh-CN)

#### 解答

```ts
type MyReturnType<T> = T extends (...args: any[]) => infer U ? U : never; 
```

使用`infer U`指代返回值类型即可。

### 16、计算字符串的长度

计算字符串的长度，类似于 `String#length` 。

题目来源：[tsch.js.org/298/zh-CN](https://link.juejin.cn?target=https%3A%2F%2Ftsch.js.org%2F298%2Fzh-CN)

#### 解答

```ts
type LengthOfString<S extends string, T extends any[] = []> = S extends `${infer L}${infer R}` ? 
                                                                LengthOfString<R, [...T, L]> 
                                                                :                                                               T['length'];
```

解题的关键点有两个：

- 增加参数`T`，默认是空数组，用于存放读取的字符，方便使用数组的`length`属性，得到长度
- 使用递归，逐个拆解字符串

```ts
S extends `${infer L}${infer R}`
```

对字符串进行拆解

如果当前的字符串已拆解完，则读取存放数组`T`的长度。
 如果没有拆解完，则递归调用`LengthOfString<R, [...T, L]> `，并将取出的字符，放入`T`中。

## 项目使用

### (.d.ts)文件

[一文读懂TS的(.d.ts)文件](https://www.jianshu.com/p/cd875a4a6c15)

- 在使用TS的时候，最大的一个好处就是可以给JS各种类型约束，使得JS能够完成静态代码分析，推断代码中存在的类型错误或者进行类型提示
- TS完成类型推断，需要事先知道变量的类型，如果我们都是用TS书写代码，并且给变量都指定了明确的类型，这时TS可以很好的完成类型推断工作
- 但是有时，我们不免会引入外部的 JS库，这时TS就对引入的JS文件里变量的具体类型不明确了，为了告诉TS变量的类型，因此就有了.d.ts (d即declare)，ts的声明文件。

TS身为 JS的超集，那么如何让这些第三方库也可以进行类型推导呢，自然需要考虑到如何让 JS 库也能定义静态类型

#### 什么是“.d.ts” 文件

基于 Typescript 开发的时候，很麻烦的一个问题就是类型定义。导致在编译的时候，经常会看到一连串的找不到类型的提示。“d.ts”文件用于为 TypeScript 提供有关用 JavaScript 编写的 API 的类型信息。简单讲，就是你可以在 ts 中调用的 js 的声明文件。TS的核心在于静态类型，我们在编写 TS 的时候会定义很多的类型，但是主流的库都是 JS编写的，并不支持类型系统。这个时候你不能用TS重写主流的库，这个时候我们只需要编写仅包含类型注释的 d.ts 文件，然后从您的 TS 代码中，可以在仍然使用纯 JS 库的同时，获得静态类型检查的 TS 优势。在此期间，解决的方式经过了许多的变化，从 DefinitelyTyped 到 typings。最后是 @types。在 Typescript 2.0 之后，推荐使用 @types 方式。

#### @types

在 Typescript 2.0 之后，TypeScript 将会默认的查看 ./node_modules/@types 文件夹，自动从这里来获取模块的类型定义，当然了，你需要独立安装这个类型定义。

默认情况下，所有的 @types 包都会在编译时应用，任意层的 node_modules/@types 都会被使用，进一步说，在 `./node_modules/@types/` , `../node_modules/@types/`, `../../node_modules/@types/` 都被应用。如果你的类型定义不在这个文件夹中，可以使用 typesRoot 来配置，只有在 typeRoots 中的包才会被包含，配置如下：

```json
 {
    "compilerOptions": {
        "typeRoots" : ["./typings"]
    }
 }
```

现在，只有在 ./typings 中的才会应用，而 ./node_modules/@types 中的则不会。 如果配置了 types，则只有列出的包才会包含。

```json
 {
    "compilerOptions": {
        "types" : ["node", "lodash", "express"]
    }
 }
```

这样将只会包含 `./node_modules/@types/node`, `./node_modules/@types/lodash` 和 `./node_modules/@types/express`，其它的则不会被包含进来。如果配置为`"types": []`则不会包含任何包。

#### *.d.ts和@types关系

`@types`是`npm`的一个分支，用来存放`*.d.ts`文件，如果对应的`npm`包存放在`@types`中，要使用必须下载！如果是自己本地的`*.d.ts`申明文件，则和@types没有任何关系！

#### shims-vue.d.ts

shims-vue.d.ts是为了typescript做的适配定义文件，因为.vue文件不是一个常规的文件类型，TypeScript是不能理解vue文件是干嘛的，加这一段是是告诉 TypeScript，vue文件是这种类型的。没有这个文件，会发现 import 导入的所有.vue类型的文件都会报错。

