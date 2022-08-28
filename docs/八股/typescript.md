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

![055d32fce2ee40bda9b0c617b9d4a645](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgsbvZ8lRuNa6cEthm.png)

## 基本类型

![image-20220709112043012](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs8ucorEPmivK49C7.png)

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

