

## 基本类型

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

### object

object表示非原始类型，也就是除number，string，boolean，symbol，null或undefined之外的类型

### 类型断言

jsx中as语法断言被允许
typescript允许<>和as

## 接口

TypeScript里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。

我们传入的对象参数实际上会包含很多属性，但是编译器只会检查那些必需的属性是否存在，并且其类型是否匹配

使用接口来描述：必须包含一个`label`属性且类型为`string`

```typescript
interface LabelledValue {
  label: string;
}

function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```

### 可选属性

带有可选属性的接口与普通的接口定义差不多，只是在可选属性名字定义的后面加一个`?`符号

可选属性的好处之一是可以对可能存在的属性进行预定义，好处之二是可以捕获引用了不存在的属性时的错误。

### 只读属性

一些对象属性只能在对象刚刚创建的时候修改其值。 你可以在属性名前用 `readonly`来指定只读属性

```typescript
interface Point {
    readonly x: number;
    readonly y: number;
}
```

TypeScript具有`ReadonlyArray<T>`类型，它与`Array<T>`相似，只是把所有可变方法去掉了，因此可以确保数组创建后再也不能被修改：

```typescript
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error!
```

 `readonly` vs `const`

最简单判断该用`readonly`还是`const`的方法是看要把它做为变量使用还是做为一个属性。 做为变量使用的话用 `const`，若做为属性则使用`readonly`

### 额外的属性检查

如果一个对象字面量存在任何“目标类型”不包含的属性时，你会得到一个错误

例如属性拼写错误导致报错

绕开这些检查非常简单。 最简便的方法是使用类型断言

最佳的方式是能够添加一个字符串索引签名，前提是你能够确定这个对象可能具有某些做为特殊用途使用的额外属性

```typescript
[propName: string]: any;
```

### 函数类型

接口能够描述JavaScript中对象拥有的各种各样的外形。 除了描述带有属性的普通对象外，接口也可以描述函数类型

为了使用接口表示函数类型，我们需要给接口定义一个调用签名。 它就像是一个只有参数列表和返回值类型的函数定义。参数列表里的每个参数都需要名字和类型

```typescript
interface SearchFunc {
  (source: string, subString: string): boolean;
}
```
对于函数类型的类型检查来说，函数的参数名不需要与接口里定义的名字相匹配
```typescript
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
  let result = source.search(subString);
  return result > -1;
}
```

### 可索引的类型

与使用接口描述函数类型差不多，我们也可以描述那些能够“通过索引得到”的类型，比如`a[10]`或`ageMap["daniel"]`。 可索引类型具有一个 *索引签名*，它描述了对象索引的类型，还有相应的索引返回值类型。 让我们看一个例子：

```typescript
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];
```

TypeScript支持两种索引签名：字符串和数字。 可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。 这是因为当使用 `number`来索引时，JavaScript会将它转换成`string`然后再去索引对象。 也就是说用 `100`（一个`number`）去索引等同于使用`"100"`（一个`string`）去索引，因此两者需要保持一致

```typescript
class Animal {
    name: string;
}
class Dog extends Animal {
    breed: string;
}

// 错误：使用数值型的字符串索引，有时会得到完全不同的Animal!
interface NotOkay {
    [x: number]: Animal;
    [x: string]: Dog;
}
```

字符串索引签名能够很好的描述`dictionary`模式，并且它们也会确保所有属性与其返回值类型相匹配。 因为字符串索引声明了 `obj.property`和`obj["property"]`两种形式都可以。 下面的例子里， `name`的类型与字符串索引类型不匹配，所以类型检查器给出一个错误提示：

```typescript
interface NumberDictionary {
  [index: string]: number;
  length: number;    // 可以，length是number类型
  name: string       // 错误，`name`的类型与索引类型返回值的类型不匹配
}
```

可以将索引签名设置为只读，这样就防止了给索引赋值：

````typescript
interface ReadonlyStringArray {
    readonly [index: number]: string;
}
let myArray: ReadonlyStringArray = ["Alice", "Bob"];
myArray[2] = "Mallory"; // error!
````



### 类类型

#### 实现接口

与C#或Java里接口的基本作用一样，TypeScript也能够用它来明确的强制一个类去符合某种契约

```typescript
interface ClockInterface {
    currentTime: Date;
}

class Clock implements ClockInterface {
    currentTime: Date;
    constructor(h: number, m: number) { }
}
```

也可以在接口中描述一个方法，在类里实现它

```typescript
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date);
}

class Clock implements ClockInterface {
    currentTime: Date;
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(h: number, m: number) { }
}
```

#### 类静态部分与实例部分

类是具有两个类型的：静态部分的类型和实例的类型

用构造器签名去定义一个接口并试图定义一个类去实现这个接口时会得到一个错误

```typescript
interface ClockConstructor {
    new (hour: number, minute: number);
}

class Clock implements ClockConstructor {
    currentTime: Date;
    constructor(h: number, m: number) { }
}
```

这里因为当一个类实现了一个接口时，只对其实例部分进行类型检查。 constructor存在于类的静态部分，所以不在检查的范围内。

我们应该直接操作类的静态部分。 看下面的例子，我们定义了两个接口， `ClockConstructor`为构造函数所用和`ClockInterface`为实例方法所用。 为了方便我们定义一个构造函数 `createClock`，它用传入的类型创建实例。

```typescript
interface ClockConstructor {
    new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
    tick();
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
    return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("beep beep");
    }
}
class AnalogClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("tick tock");
    }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);
```

`createClock`的第一个参数是`ClockConstructor`类型，在`createClock(AnalogClock, 7, 32)`里，会检查`AnalogClock`是否符合构造函数签名

### 继承接口

和类一样，接口也可以相互继承。 这让我们能够从一个接口里复制成员到另一个接口里，可以更灵活地将接口分割到可重用的模块里。

```typescript
interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
```

一个接口可以继承多个接口，创建出多个接口的合成接口。

```typescript
interface Shape {
    color: string;
}

interface PenStroke {
    penWidth: number;
}

interface Square extends Shape, PenStroke {
    sideLength: number;
}

let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```

### 混合类型

一个对象可以同时做为函数和对象使用，并带有额外的属性

```typescript
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = <Counter>function (start: number) { };
    counter.interval = 123;
    counter.reset = function () { };
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

### 接口继承类

当接口继承了一个类类型时，它会继承类的成员但不包括其实现

接口同样会继承到类的private和protected成员。 这意味着当你创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其子类所实现（implement）

```typescript
class Control {
    private state: any;
}

interface SelectableControl extends Control {
    select(): void;
}

class Button extends Control implements SelectableControl {
    select() { }
}

class TextBox extends Control {
    select() { }
}

// 错误：“Image”类型缺少“state”属性。
class Image implements SelectableControl {
    select() { }
}

class Location {

}
```

`SelectableControl`包含了`Control`的所有成员，包括私有成员`state`。 因为 `state`是私有成员，所以只能够是`Control`的子类们才能实现`SelectableControl`接口。 因为只有 `Control`的子类才能够拥有一个声明于`Control`的私有成员`state`，这对私有成员的兼容性是必需的。

在`Control`类内部，是允许通过`SelectableControl`的实例来访问私有成员`state`的。 实际上， `SelectableControl`接口和拥有`select`方法的`Control`类是一样的。 `Button`和`TextBox`类是`SelectableControl`的子类（因为它们都继承自`Control`并有`select`方法），但`Image`和`Location`类并不是这样的

## 类

```typescript
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");
```

我们声明一个 `Greeter`类。这个类有3个成员：一个叫做 `greeting`的属性，一个构造函数和一个 `greet`方法。

你会注意到，我们在引用任何一个类成员的时候都用了 `this`。 它表示我们访问的是类的成员

### 继承

```typescript
class Animal {
    name: string;
    constructor(theName: string) { this.name = theName; }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Snake extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 5) {
        console.log("Slithering...");
        super.move(distanceInMeters);
    }
}

class Horse extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 45) {
        console.log("Galloping...");
        super.move(distanceInMeters);
    }
}

let sam = new Snake("Sammy the Python");
let tom: Animal = new Horse("Tommy the Palomino");

sam.move();
tom.move(34);
```

使用 `extends`关键字创建了 `Animal`的两个子类： `Horse`和 `Snake`

派生类包含了一个构造函数，它 *必须*调用 `super()`，它会执行基类的构造函数。 而且，在构造函数里访问 `this`的属性之前，我们 *一定*要调用 `super()`

`Snake`类和 `Horse`类都创建了 `move`方法，它们重写了从 `Animal`继承来的 `move`方法，使得 `move`方法根据不同的类而具有不同的功能。 注意，即使 `tom`被声明为 `Animal`类型，但因为它的值是 `Horse`，调用 `tom.move(34)`时，它会调用 `Horse`里重写的方法

### 修饰符

默认为 `public`

在TypeScript里，成员都默认为 `public`

**private**

当成员被标记成 `private`时，它就不能在声明它的类的外部访问

 如果其中一个类型里包含一个 `private`成员，那么只有当另外一个类型中也存在这样一个 `private`成员， 并且它们都是来自同一处声明时，我们才认为这两个类型是兼容的。 对于 `protected`成员也使用这个规则

**protected**

`protected`修饰符与 `private`修饰符的行为很相似，但有一点不同， `protected`成员在派生类中仍然可以访问

构造函数也可以被标记成 `protected`。 这意味着这个类不能在包含它的类外被实例化，但是能被继承

使用 `readonly`关键字将属性设置为只读的。 只读属性必须在声明时或构造函数里被初始化

**存取器**

通过getters/setters来截取对对象成员的访问

### 静态属性

 我们也可以创建类的静态成员，这些属性存在于类本身上面而不是类的实例上。 在这个例子里，我们使用 `static`定义 `origin`，因为它是所有网格都会用到的属性。 每个实例想要访问这个属性的时候，都要在 `origin`前面加上类名。 如同在实例属性上使用 `this.`前缀来访问属性一样，这里我们使用 `Grid.`来访问静态属性。

```typescript
class Grid {
    static origin = {x: 0, y: 0};
    calculateDistanceFromOrigin(point: {x: number; y: number;}) {
        let xDist = (point.x - Grid.origin.x);
        let yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }
    constructor (public scale: number) { }
}

let grid1 = new Grid(1.0);  // 1x scale
let grid2 = new Grid(5.0);  // 5x scale

console.log(grid1.calculateDistanceFromOrigin({x: 10, y: 10}));
console.log(grid2.calculateDistanceFromOrigin({x: 10, y: 10}));
```

### 抽象类

抽象类做为其它派生类的基类使用。 它们一般不会直接被实例化。 不同于接口，抽象类可以包含成员的实现细节。 `abstract`关键字是用于定义抽象类和在抽象类内部定义抽象方法

```typescript
abstract class Animal {
    abstract makeSound(): void;
    move(): void {
        console.log('roaming the earch...');
    }
}
```

抽象类中的抽象方法不包含具体实现并且必须在派生类中实现。 抽象方法的语法与接口方法相似。 两者都是定义方法签名但不包含方法体。 然而，抽象方法必须包含 `abstract`关键字并且可以包含访问修饰符

```typescript
abstract class Department {

    constructor(public name: string) {
    }

    printName(): void {
        console.log('Department name: ' + this.name);
    }

    abstract printMeeting(): void; // 必须在派生类中实现
}

class AccountingDepartment extends Department {

    constructor() {
        super('Accounting and Auditing'); // 在派生类的构造函数中必须调用 super()
    }

    printMeeting(): void {
        console.log('The Accounting Department meets each Monday at 10am.');
    }

    generateReports(): void {
        console.log('Generating accounting reports...');
    }
}

let department: Department; // 允许创建一个对抽象类型的引用
department = new Department(); // 错误: 不能创建一个抽象类的实例
department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
department.printName();
department.printMeeting();
department.generateReports(); // 错误: 方法在声明的抽象类中不存在
```

## 函数

### 为函数定义类型

让我们为上面那个函数添加类型：

```ts
function add(x: number, y: number): number {
    return x + y;
}

let myAdd = function(x: number, y: number): number { return x + y; };
```

我们可以给每个参数添加类型之后再为函数本身添加返回值类型。 TypeScript能够根据返回语句自动推断出返回值类型，因此我们通常省略它。

### 可选参数和默认参数

TypeScript里的每个函数参数都是必须的。 这不是指不能传递 `null`或`undefined`作为参数，而是说编译器检查用户是否为每个参数都传入了值。 编译器还会假设只有这些参数会被传递进函数。 简短地说，传递给一个函数的参数个数必须与函数期望的参数个数一致。

```ts
function buildName(firstName: string, lastName: string) {
    return firstName + " " + lastName;
}

let result1 = buildName("Bob");                  // error, too few parameters
let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams");         // ah, just right
```

JavaScript里，每个参数都是可选的，可传可不传。 没传参的时候，它的值就是undefined。 在TypeScript里我们可以在参数名旁使用 `?`实现可选参数的功能。 比如，我们想让last name是可选的：

```ts
function buildName(firstName: string, lastName?: string) {
    if (lastName)
        return firstName + " " + lastName;
    else
        return firstName;
}

let result1 = buildName("Bob");  // works correctly now
let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams");  // ah, just right
```

可选参数必须跟在必须参数后面。 如果上例我们想让first name是可选的，那么就必须调整它们的位置，把first name放在后面。

在TypeScript里，我们也可以为参数提供一个默认值当用户没有传递这个参数或传递的值是`undefined`时。 它们叫做有默认初始化值的参数。 让我们修改上例，把last name的默认值设置为`"Smith"`。

```ts
function buildName(firstName: string, lastName = "Smith") {
    return firstName + " " + lastName;
}

let result1 = buildName("Bob");                  // works correctly now, returns "Bob Smith"
let result2 = buildName("Bob", undefined);       // still works, also returns "Bob Smith"
let result3 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result4 = buildName("Bob", "Adams");         // ah, just right
```

在所有必须参数后面的带默认初始化的参数都是可选的，与可选参数一样，在调用函数的时候可以省略。 也就是说可选参数与末尾的默认参数共享参数类型。

```ts
function buildName(firstName: string, lastName?: string) {
    // ...
}
```

和

```ts
function buildName(firstName: string, lastName = "Smith") {
    // ...
}
```

### 剩余参数

必要参数，默认参数和可选参数有个共同点：它们表示某一个参数。 有时，你想同时操作多个参数，或者你并不知道会有多少参数传递进来。 在JavaScript里，你可以使用 `arguments`来访问所有传入的参数。

在TypeScript里，你可以把所有参数收集到一个变量里：

```ts
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
```

剩余参数会被当做个数不限的可选参数。 可以一个都没有，同样也可以有任意个。 编译器创建参数数组，名字是你在省略号（ `...`）后面给定的名字，你可以在函数体内使用这个数组。

```ts
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

let buildNameFun: (fname: string, ...rest: string[]) => string = buildName;
```

### 重载

为了让编译器能够选择正确的检查类型，它与JavaScript里的处理流程相似。 它查找重载列表，尝试使用第一个重载定义。 如果匹配的话就使用这个。 因此，在定义重载的时候，一定要把最精确的定义放在最前面。

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

## 枚举

使用枚举我们可以定义一些带名字的常量。 使用枚举可以清晰地表达意图或创建一组有区别的用例。 TypeScript支持数字的和基于字符串的枚举。

### 数字枚举

```ts
enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}
```

### 字符串枚举

 在一个字符串枚举里，每个成员都必须用字符串字面量，或另外一个字符串枚举成员进行初始化。

```ts
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
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

## 装饰器

若要启用实验性的装饰器特性，你必须在命令行或`tsconfig.json`里启用`experimentalDecorators`编译器选项

### 装饰器概念

它是一种特殊类型的声明，它能够被附加到类声明，方法，属性或参数上，可以修改类的行为。 通俗的**讲装饰器就是一个函数/方法**，可以注入到**类、方法、属性参数**上来扩展类、属性、方法、参数的功能。 常见的装饰器有：

-   类装饰器
-   属性装饰器
-   方法装饰器
-   参数装饰器

装饰器的写法：普通装饰器(无法传参)、装饰器工厂(可传参)

#### 类装饰器

类装饰器在类声明之前被声明〈紧靠着类声明)。类装饰器应用于类构造函数，可以用来监视，修改或替换类定义。传入一个参数

##### 普通装饰器：不能传参

```typescript
/**
 * 装饰器
 * target属性就是使用装饰器的那个类
*/
function logClass(target: any) {
  target.prototype.apiUrl = 'http://www.baidu.com'
  target.prototype.hello = () => {
    console.log("hello world")
  }
}

@logClass
class HttpClient {
  constructor() { }
}

const http: any = new HttpClient()

console.log(http.apiUrl) // http://www.baidu.com
http.hello() //hello world
```

##### 装饰器工厂：可以传参

```typescript
/**
 * 装饰器工厂
 * params就是我们要传递的参数
 * target就是要使用装饰器的那个类
 */
function logClass(params: string) {
  return function (target: any) {
    target.prototype.hello = () => {
      console.log(params)
    }
  }
}

@logClass('hello world')
class HttpClient {
  constructor() { }
}

const http: any = new HttpClient()
http.hello()  //打印hello world
```

##### 重载构造函数

类装饰器表达式会在运行时当作函数被调用，类的构造函数作为其唯一的参数。如果类装饰器返回一个值，它会使用提供的构造函数来替换类的声明

```typescript
function logClass(target: any) {
  return class extends target {
    apiUrl: string = '修改后的apiUrl'
    getData() {
      console.log('修改:', this.apiUrl)
    }
  }
}

@logClass
class HttpClient {
  public apiUrl: string | undefined
  constructor() {
    this.apiUrl = '没修改前的apiUrl'
  }

  getData() {
    console.log(this.apiUrl)
  }
}

const http = new HttpClient()
http.getData() //修改: 修改后的apiUrl
```

#### 属性装饰器

属性装饰器表达式会在运行时当作函数被调用，传入下列2个参数:

-   装饰的实例。对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
-   装饰的属性名

```ts
/**
 * 属性装饰器
 * params就是装饰器传入的参数
 * target就是装饰的实例
 * attr就是装饰的属性
 */
function logProperty(params: any) {
  return function (target: any, attr: string) {
    //通过这样的方式就可以通过装饰器来修改属性值
    target[attr] = params
  }
}

class HttpClient {
  @logProperty('属性装饰器赋值')
  public apiUrl: string | undefined
  constructor() {
  }

  getData() {
    console.log(this.apiUrl)
  }
}

const http = new HttpClient()
http.getData() // 属性装饰器赋值
```

#### 方法装饰器

它会被应用到方法的属性描述符上，可以用来监视，修改或者替换方法定义。方法装饰会在运行时传入下列个参数:

-   装饰的实例。对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
-   成员的名字
-   成员的属性描述符

```typescript
/**
 * params 传递给装饰器的值
 * target 装饰器的实例
 * methodName 方法名称
 * descriptor 描述
 */
function get(params: any) {
  console.log(params) // http://www.baidu.com
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    console.log(target)
    console.log(methodName)
    console.log(descriptor)
    //修改前保存原始传入的方法
    let originalMethod = descriptor.value

    //重写传入的方法
    descriptor.value = function (...args: any[]) {
      //执行原来的方法
      originalMethod.apply(this, args)

      args = args.map(val => +val)

      console.log(args)
    }
  }
}

class HttpClient {
  constructor() {
  }

  @get('http://www.baidu.com')
  getApi() {
  }
}

const http: any = new HttpClient()

http.getApi('123', '456', '789')  //打印[123, 456, 789]
```

#### 方法参数装饰器

运行时会被当做函数被调用，可以使用参数装饰器为类的原型增加一些元素数据，传入3个参数：

-   装饰的实例。对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
-   方法名
-   参数在函数参数列表中的索引

```typescript
function logParams(param: any) {
  return function (target: any, methodName: string, paramIndex: number) {
    console.log(target)     // httpClient实例
    console.log(methodName) // getApi
    console.log(paramIndex) // 0
  }
}

class HttpClient {
  constructor() {
  }
  getApi(@logParams('id') id: number) {
    console.log(id)
  }
}

const http = new HttpClient()

http.getApi(123456)
```

#### 装饰器的执行顺序

这里先放结论，具体的代码请往下看：

-   属性 > 方法 > 方法参数 > 类
-   如果有多个同样的装饰器，它会先执行后面的(从下到上，方法参数装饰器执行顺序是从右到左)

```typescript
// 先进行一些装饰器的定义
function logClass1(target: any) {
  console.log('logClass1')
}

function logClass2(target: any) {
  console.log('logClass2')
}

function logAttribute1(param?: any) {
  return function (target: any, attrName: string) {
    console.log('attribute1')
  }
}

function logAttribute2(param?: any) {
  return function (target: any, attrName: string) {
    console.log('attribute2')
  }
}

function logMethod1(param?: any) {
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    console.log('logMethod1')
  }
}

function logMethod2(param?: any) {
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    console.log('logMethod2')
  }
}

function logParam1(param?: any) {
  return function (target: any, methodName: string, index: number) {
    console.log('logParam1')
  }
}

function logParam2(param?: any) {
  return function (target: any, methodName: string, index: number) {
    console.log('logParam2')
  }
}

@logClass1
@logClass2
class HttpClient {
  @logAttribute1()
  api1: string | undefined
  @logAttribute2()
  api2: string | undefined

  constructor() {
  }

  @logMethod1()
  get1() {
  }

  @logMethod2()
  get2() { }

  get3(@logParam1() param1: string, @logParam2() param2: string) { }
}
```

上述代码最终的打印结果如下，可以验证了我们一开始得出的执行顺序的结论

```ts
attribute1
attribute2
logMethod1
logMethod2
logParam2
logParam1
logClass2
logClass1
```
