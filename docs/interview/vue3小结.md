# Vue3小结

经过了漫长的迭代，`Vue`3.0终于在2020-09-18发布了，带了翻天覆地的变化，使用了`Typescript` 进行了大规模的重构，带来了`Composition API RFC`版本，类似`React Hook` 一样的写`Vue`，可以自定义自己的`hooks` ，让使用者更加的灵活，接下来总结一下`vue 3.0` 带来的部分新特性。

1.  `setup()`
2.  `ref()`
3.  `reactive()`、`shallowReactive()`
4.  `isRef()`
5.  `toRefs()`
6.  `readonly()`、`isReadonly()`、`shallowReadonly()`
7.  `computed()`
8.  `watch()`
9.  `LifeCycle` `Hooks`(新的生命周期)
10.  `Template refs`
11.  `globalProperties`
12.  `Suspense`
13.  `Provide/Inject`

## Vue2与Vue3的对比

-   对`TypeScript`支持不友好（所有属性都放在了`this`对象上，难以推倒组件的数据类型）
-   大量的`API`挂载在`Vue`对象的原型上，难以实现`TreeShaking`。
-   架构层面对跨平台`dom`渲染开发支持不友好
-   `CompositionAPI`。受`ReactHook`启发
-   更方便的支持了 `jsx`
-   Vue 3 的 `Template` 支持多个根标签，Vue 2 不支持
-   对虚拟DOM进行了重写、对模板的编译进行了优化操作...

## 一、setup 函数

`setup()` 函数是 `vue3` 中，专门为组件提供的新属性。它为我们使用 `vue3` 的 `Composition API` 新特性提供了统一的入口, `setup` 函数会在 `beforeCreate` 、`created` 之前执行, `vue3`也是取消了这两个钩子，统一用`setup`代替, 该函数相当于一个生命周期函数，`vue`中过去的`data`，`methods`，`watch`等全部都用对应的新增`api`写在`setup()`函数中

```
setup(props, context) {
    // Attribute (非响应式对象，等同于 $attrs)
    context.attrs
    // 插槽 (非响应式对象，等同于 $slots)
    context.slots
    // 触发事件 (方法，等同于 $emit)
    context.emit
    // 暴露公共 property (函数)
    context.expose
    
    return {}
  }

```

-   `props`: 用来接收 `props` 数据, `props` 是响应式的，当传入新的 `props` 时，它将被更新。
-   `context` 用来定义上下文, 上下文对象中包含了一些有用的属性，这些属性在 vue 2.x 中需要通过 `this` 才能访问到, 在 `setup()` 函数中无法访问到 `this`，是个 `undefined`
-   `context` 是一个普通的 `JavaScript` 对象，也就是说，它不是响应式的，这意味着你可以安全地对 `context` 使用 `ES6` 解构。
-   返回值: `return {}`, 返回响应式数据, 模版中需要使用的函数

> 注意： 因为 `props` 是响应式的， 你**不能使用 ES6 解构**，它会消除 prop 的响应性。不过你可以使用如下的方式去处理

```
<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue';
export default defineComponent({
  setup(props, context) {
  
    const { title } = toRefs(props)
    
    console.log(title.value)
    
    return {}
  }
});
</script>

```

如果 `title` 是可选的 prop，则传入的 `props` 中可能没有 `title` 。在这种情况下，`toRefs` 将不会为 `title` 创建一个 ref 。你需要使用 `toRef` 替代它：

```
<script lang="ts">
import { defineComponent, reactive, toRef, toRefs } from 'vue';
export default defineComponent({
  setup(props, context) {
  
    const { title } = toRef(props, 'title')
    
    console.log(title.value)
    
    return {}
  }
});
</script>

```

## 二、reactive、shallowReactive 函数

### 2.1 reactive()

`reactive()` 函数接收一个普通对象，返回一个响应式的数据对象, 相当于 `Vue 2.x` 中的 `Vue.observable()` API，响应式转换是“深层”的——它影响所有嵌套属性。基于proxy来实现，想要使用创建的响应式数据也很简单，创建出来之后，在`setup`中`return`出去，直接在`template`中调用即可

```
<template>
  {{state.name}} // test
<template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue';
export default defineComponent({
  setup(props, context) {
  
    let state = reactive({
      name: 'test'
    });

    return state
  }
});
</script>

```

> 注意： 该 API 返回一个响应式的对象状态。该响应式转换是“深度转换”——它会影响传递对象的所有嵌套 property。

### 2.1 shallowReactive()

创建一个响应式代理，它跟踪其自身属性的响应性`shallowReactive`生成非递归响应数据，只监听第一层数据的变化，但不执行嵌套对象的深层响应式转换 (暴露原始值)。

```

<script lang="ts">
import { shallowReactive } from "vue";
export default defineComponent({
  setup() {
    
    const test = shallowReactive({ num: 1, creator: { name: "撒点了儿" } });
    console.log(test);

    
    test.creator.name = "掘金";

    return {
      test
    };
  },
});
</script>


```

## 三、ref() 函数

`ref()` 函数用来根据给定的值创建一个响应式的数据对象，`ref()` 函数调用的返回值是一个对象，这个对象上只包含一个 `value` 属性, 只在setup函数内部访问`ref`函数需要加`.value`，其用途创建独立的原始值

```
<template>
    <div class="mine">
        {{count}} // 10
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const count = ref<number>(10)
    // 在js 中获取ref 中定义的值, 需要通过value属性
    console.log(count.value);
    return {
       count
    }
   }
});
</script>

```

在 `reactive` 对象中访问 `ref` 创建的响应式数据

```
<template>
    <div class="mine">
        {{count}} -{{t}} // 10 -100
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue';
export default defineComponent({
  setup() {
    const count = ref<number>(10)
    const obj = reactive({
      t: 100,
      count
    })
   
    // 通过reactive 来获取ref 的值时,不需要使用.value属性， ref 将被自动解包
    console.log(obj.count); // 10
    console.log(obj.count === count.value); // true
    
    // count 改变时，更新 `obj.count
    count.value = 12
    console.log(count.value) // 12
    console.log(obj.count) // 12
    
    // 反之，修改obj 的count 值 ，ref 也会更新
   obj.count = 20
   console.log(obj.count) // 20
   console.log(count.value) // 20
    
    return {
       ...toRefs(obj)
    }
   }
});
</script>

```

`reactive` 将解包所有深层的 `refs`，同时维持 ref 的响应性。当将 `ref`分配给 `reactive` property 时，ref 将被自动解包

## 四、isRef() 函数

`isRef()` 用来判断某个值是否为 `ref()` 创建出来的对象

```
<script lang="ts">
import { defineComponent, isRef, ref } from 'vue';
export default defineComponent({
  setup(props, context) {
    const name: string = 'vue'
    const age = ref<number>(18)
    console.log(isRef(age)); // true
    console.log(isRef(name)); // false

    return {
      age,
      name
    }
  }
});
</script>

```

## 五、toRefs() 函数

`toRefs()` 函数可以将 `reactive()` 创建出来的响应式对象，转换为普通的对象，只不过，这个对象上的每个属性节点，都是 `ref()` 类型的响应式数据

```
<template>
  <div class="mine">
    {{name}} // test
    {{age}} // 18
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue';
export default defineComponent({
  setup(props, context) {
    let state = reactive({
      name: 'test'
    });

    const age = ref(18)
    
    return {
      ...toRefs(state),
      age
    }
  }
});
</script>

```

## 六、readonly()、isReadonly()、shallowReadonly()

### 6.1 readonly() 和 isReadonly()

-   `readonly`: 传入`ref`或 `reactive`对象,并返回一个原始对象的只读代理,对象内部任何嵌套的属性也都是只读的、 并且是递归只读。
  
-   `isReadonly`: 检查对象是否是由 `readonly` 创建的只读对象
  

```
<script lang="ts">
import { readonly, reactive } from "vue";
export default defineComponent({
  setup() {
    const test = reactive({ num: 1 });

    const testOnly = readonly(test);

    console.log(test);
    console.log(testOnly);
    
    test.num = 110;
    
    // 此时运行会提示 Set operation on key "num" failed: target is readonly.
    // 而num 依然是原来的值，将无法修改成功
    testOnly.num = 120;
    
    // 使用isReadonly() 检查对象是否是只读对象
    console.log(isReadonly(testOnly)); // true
    console.log(isReadonly(test)); // false
    
    // 需要注意的是： testOnly 值会随着 test 值变化

    return {
      test,
      testOnly,
    };
  },
});
</script>


```

我们知道`const`定义的变量也是不能改的，那`readonly`和`const`有什么区别？

-   `const`是赋值保护，使用`const`定义的变量，该变量不能重新赋值。但如果`const`赋值的是对象，那么对象里面的东西是可以改的。原因是`const`定义的变量不能改说的是，对象对应的那个地址不能改变
-   而`readonly`是属性保护，不能给属性重新赋值

### 6.2 shallowReadonly()

`shallowReadonly` 作用只处理对象最外层属性的响应式（浅响应式）的只读，但不执行嵌套对象的深度只读转换 (暴露原始值)

```

<script lang="ts">
import { readonly, reactive } from "vue";
export default defineComponent({
 setup() {
   
   const test = shallowReadonly({ num: 1, creator: { name: "撒点了儿" } });
   console.log(test);

   // 依然会提示： Set operation on key "num" failed: target is readonly.
   // 而num 依然是原来的值，将无法修改成功
   test.num = 3;
   // 但是对于深层次的属性，依然可以修改
   test.creator.name = "掘金";

   return {
     test
   };
 },
});
</script>


```

## 七、computed()

该函数用来创造计算属性，和过去一样，它返回的值是一个ref对象。 里面可以传方法，或者一个对象，对象中包含`set()`、`get()`方法

### 7.1 创建只读的计算属性

```
import { computed, defineComponent, ref } from 'vue';
export default defineComponent({
  setup(props, context) {
    const age = ref(18)

    // 根据 age 的值，创建一个响应式的计算属性 readOnlyAge,它会根据依赖的 ref 自动计算并返回一个新的 ref
    const readOnlyAge = computed(() => age.value++) // 19

    return {
      age,
      readOnlyAge
    }
  }
});
</script>

```

### 7.2 通过`set()`、`get()`方法创建一个可读可写的计算属性

```
<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
export default defineComponent({
  setup(props, context) {
    const age = ref<number>(18)

    const computedAge = computed({
      get: () => age.value + 1,
      set: value => age.value + value
    })
    // 为计算属性赋值的操作，会触发 set 函数, 触发 set 函数后，age 的值会被更新
    age.value = 100
    return {
      age,
      computedAge
    }
  }
});
</script>

```

## 八、 watch() 函数

`watch` 函数用来侦听特定的数据源，并在回调函数中执行副作用。默认情况是懒执行的，也就是说仅在侦听的源数据变更时才执行回调。

### 8.1 监听用reactive声明的数据源

```
<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch } from 'vue';
interface Person {
  name: string,
  age: number
}
export default defineComponent({
  setup(props, context) {
    const state = reactive<Person>({ name: 'vue', age: 10 })

    watch(
      () => state.age,
      (age, preAge) => {
        console.log(age); // 100
        console.log(preAge); // 10
      }
    )
    // 修改age 时会触发watch 的回调, 打印变更前后的值
    state.age = 100
    return {
      ...toRefs(state)
    }
  }
});
</script>

```

### 8.2 监听用ref声明的数据源

```
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
interface Person {
  name: string,
  age: number
}
export default defineComponent({
  setup(props, context) {
    const age = ref<number>(10);

    watch(age, () => console.log(age.value)); // 100
    
    // 修改age 时会触发watch 的回调, 打印变更后的值
    age.value = 100
    return {
      age
    }
  }
});
</script>

```

### 8.3 同时监听多个值

```
<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch } from 'vue';
interface Person {
  name: string,
  age: number
}
export default defineComponent({
  setup(props, context) {
    const state = reactive<Person>({ name: 'vue', age: 10 })

    watch(
      [() => state.age, () => state.name],
      ([newName, newAge], [oldName, oldAge]) => {
        console.log(newName);
        console.log(newAge);

        console.log(oldName);
        console.log(oldAge);
      }
    )
    // 修改age 时会触发watch 的回调, 打印变更前后的值, 此时需要注意, 更改其中一个值, 都会执行watch的回调
    state.age = 100
    state.name = 'vue3'
    return {
      ...toRefs(state)
    }
  }
});
</script>


```

### 8.4 stop 停止监听

在 `setup()` 函数内创建的 `watch` 监视，会在当前组件被销毁的时候自动停止。如果想要明确地停止某个监视，可以调用 `watch()` 函数的返回值即可，语法如下：

```
<script lang="ts">
import { set } from 'lodash';
import { computed, defineComponent, reactive, toRefs, watch } from 'vue';
interface Person {
  name: string,
  age: number
}
export default defineComponent({
  setup(props, context) {
    const state = reactive<Person>({ name: 'vue', age: 10 })

    const stop =  watch(
      [() => state.age, () => state.name],
      ([newName, newAge], [oldName, oldAge]) => {
        console.log(newName);
        console.log(newAge);

        console.log(oldName);
        console.log(oldAge);
      }
    )
    // 修改age 时会触发watch 的回调, 打印变更前后的值, 此时需要注意, 更改其中一个值, 都会执行watch的回调
    state.age = 100
    state.name = 'vue3'

    setTimeout(()=> { 
      stop()
      // 此时修改时, 不会触发watch 回调
      state.age = 1000
      state.name = 'vue3-'
    }, 1000) // 1秒之后讲取消watch的监听
    
    return {
      ...toRefs(state)
    }
  }
});
</script>

```

## 九、LifeCycle Hooks(新的生命后期)

新版的生命周期函数，可以按需导入到组件中，且只能在 `setup()` 函数中使用, 但是也可以在`setup` 外定义, 在 `setup` 中使用

```
<script lang="ts">
import { set } from 'lodash';
import { defineComponent, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onErrorCaptured, onMounted, onUnmounted, onUpdated } from 'vue';
export default defineComponent({
  setup(props, context) {
    onBeforeMount(()=> {
      console.log('beformounted!')
    })
    onMounted(() => {
      console.log('mounted!')
    })

    onBeforeUpdate(()=> {
      console.log('beforupdated!')
    })
    onUpdated(() => {
      console.log('updated!')
    })

    onBeforeUnmount(()=> {
      console.log('beforunmounted!')
    })
    onUnmounted(() => {
      console.log('unmounted!')
    })

    onErrorCaptured(()=> {
      console.log('errorCaptured!')
    })

    return {}
  }
});
</script>

```

## 十、Template refs

通过`refs` 来回去真实`dom`元素, 这个和`react` 的用法一样,为了获得对模板内元素或组件实例的引用，我们可以像往常一样在`setup()`中声明一个`ref`并返回它

1.  还是跟往常一样，在`html` 中写入 `ref` 的名称
2.  在`steup` 中定义一个 `ref`
3.  `steup` 中返回 `ref`的实例
4.  `onMounted` 中可以得到 `ref`的`RefImpl`的对象, 通过`.value` 获取真实`dom`

```
<template>
  <!--第一步：还是跟往常一样，在 html 中写入 ref 的名称-->
  <div class="mine" ref="elmRefs">
    <span>1111</span>
  </div>
</template>

<script lang="ts">
import { set } from 'lodash';
import { defineComponent, onMounted, ref } from 'vue';
export default defineComponent({
  setup(props, context) {
    // 获取真实dom
    const elmRefs = ref<null | HTMLElement>(null);
    onMounted (() => {
      console.log(elmRefs.value); // 得到一个 RefImpl 的对象, 通过 .value 访问到数据
    })

    return {
      elmRefs
    }
  }
});
</script>

```

## 十一、vue 的全局配置

通过`vue` 实例上`config`来配置,包含`Vue`应用程序全局配置的对象。您可以在挂载应用程序之前修改下面列出的属性:

```
const app = Vue.createApp({})

app.config = {...}

```

为组件渲染功能和观察程序期间的未捕获错误分配处理程序。错误和应用程序实例将调用处理程序

```
app.config.errorHandler = (err, vm, info) => {}

```

可以在应用程序内的任何组件实例中访问的全局属性，组件的属性将具有优先权。这可以代替`Vue` 2.xVue.prototype扩展：

```
const app = Vue.createApp({})

app.config.globalProperties.$http = 'xxxxxxxxs'

```

可以在组件用通过 `getCurrentInstance()` 来获取全局`globalProperties` 中配置的信息,`getCurrentInstance` 方法获取当前组件的实例，然后通过 `ctx` 属性获得当前上下文，这样我们就能在`setup`中使用`router`和`vuex`, 通过这个属性我们就可以操作变量、全局属性、组件属性等等

```
setup( ) {
  const { ctx } = getCurrentInstance();
  ctx.$http   
}

```

## 十二、Suspense 组件

在开始介绍 `Vue` 的 `Suspense` 组件之前，我们有必要先了解一下 `React` 的 `Suspense` 组件，因为他们的功能类似。

`React.lazy` 接受一个函数，这个函数需要动态调用 `import()`。它必须返回一个 `Promise`，该 `Promise` 需要 `resolve` 一个 `default export` 的 `React` 组件。

```
import React, { Suspense } from 'react';
 
 
const myComponent = React.lazy(() => import('./Component'));
 
 
function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <myComponent />
      </Suspense>
    </div>
  );
}

```

`Vue3` 也新增了 `React.lazy` 类似功能的 `defineAsyncComponent` 函数，处理动态引入（的组件）。`defineAsyncComponent`可以接受返回承诺的工厂函数。当您从服务器检索到组件定义时，应该调用`Promise`的解析回调。您还可以调用`reject(reason)`来指示负载已经失败

```
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/AsyncComponent.vue')
)

app.component('async-component', AsyncComp)

```

Vue3 也新增了 Suspense 组件:

```
<template>
  <Suspense>
    <template #default>
      <my-component />
    </template>
    <template #fallback>
      Loading ...
    </template>
  </Suspense>
</template>

<script lang='ts'>
 import { defineComponent, defineAsyncComponent } from "vue";
 const MyComponent = defineAsyncComponent(() => import('./Component'));

export default defineComponent({
   components: {
     MyComponent
   },
   setup() {
     return {}
   }
})
 
 
</script>

```

## 十三、Provide/Inject

通常，当我们需要从父组件向子组件传递数据时，我们使用 `props`。想象一下这样的结构：有一些深度嵌套的组件，而深层的子组件只需要父组件的部分内容。在这种情况下，如果仍然将 `prop` 沿着组件链逐级传递下去，可能会很麻烦。

对于这种情况，我们可以使用一对 `provide` 和 `inject`。无论组件层次结构有多深，父组件都可以作为其所有子组件的依赖提供者。这个特性有两个部分：父组件有一个 `provide` 选项来提供数据，子组件有一个 `inject` 选项来开始使用这些数据。

具体使用如下：

### 13.1 基础使用

```
// 父组件
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  provide: {
    provideData: { name: "撒点了儿" },
  }
});
</script>

// 子组件
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    {{ provideData }}
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: String,
  },
  inject: ["provideData"],
});
</script>



```

### 13.2 setup()中使用

在 `setup()` 中使用, 则需要从 vue 显式导入`provide`、`inject`方法。导入以后，我们就可以调用它来定义暴露给我们的组件方式。

`provide` 函数允许你通过两个参数定义属性：

-   `name`：参数名称
-   `value`：属性的值

```

<script lang="ts">
import { provide } from "vue";
import HelloWorldVue from "./components/HelloWorld.vue";
export default defineComponent({
  name: "App",
  components: {
    HelloWorld: HelloWorldVue,
  },
  setup() {
    provide("provideData", {
      name: "撒点了儿",
    });
  },
});
</script>

<script lang="ts">
import { provide, inject } from "vue";
export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: String,
  },
  setup() {
    const provideData = inject("provideData");
    
    console.log(provideData); //  { name: "撒点了儿"  }

    return {
      provideData,
    };
  },
});
</script>


```

### 13.3 传递响应数据

为了增加 `provide` 值和 `inject` 值之间的响应性，我们可以在 `provide` 值时使用 `ref` 或 `reactive`。

```

<script lang="ts">
import { provide, reactive, ref } from "vue";
import HelloWorldVue from "./components/HelloWorld.vue";
export default defineComponent({
  name: "App",
  components: {
    HelloWorld: HelloWorldVue,
  },
  setup() {
    const age = ref(18);

    provide("provideData", {
      age,
      data: reactive({ name: "撒点了儿" }),
    });
  },
});
</script>


<script lang="ts">
import { inject } from "vue";
export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: String,
  },
  setup() {
    const provideData = inject("provideData");

    console.log(provideData);

    return {
      provideData,
    };
  },
});
</script>



```

> 如果要确保通过 provide 传递的数据不会被 inject 的组件更改，我们建议对提供者的 property 使用 readonly。

## 十四、vue 3.x 完整组件模版结构

一个完成的`vue 3.x` 完整组件模版结构包含了:组件名称、 `props`、`components`、`setup(hooks、computed、watch、methods 等)`

```js
<template>
  <div class="mine" ref="elmRefs">
    <span>{{name}}</span>
    <br>
    <span>{{count}}</span>
    <div>
      <button @click="handleClick">测试按钮</button>
    </div>

    <ul>
      <li v-for="item in list" :key="item.id">{{item.name}}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onMounted, PropType, reactive, ref, toRefs } from 'vue';

interface IState {
  count: number
  name: string
  list: Array<object>
}

export default defineComponent({
  name: 'demo',
  // 父组件传子组件参数
  props: {
    name: {
      type: String as PropType<null | ''>,
      default: 'vue3.x'
    },
    list: {
      type: Array as PropType<object[]>,
      default: () => []
    }
  },
  components: {
    /// TODO 组件注册
  },
  emits: ["emits-name"], // 为了提示作用
  setup (props, context) {
    console.log(props.name)
    console.log(props.list)
    
    
    const state = reactive<IState>({
      name: 'vue 3.0 组件',
      count: 0,
      list: [
        {
          name: 'vue',
          id: 1
        },
        {
          name: 'vuex',
          id: 2
        }
      ]
    })

    const a = computed(() => state.name)

    onMounted(() => {

    })

    function handleClick () {
      state.count ++
      // 调用父组件的方法
      context.emit('emits-name', state.count)
    }
  
    return {
      ...toRefs(state),
      handleClick
    }
  }
});
</script>

```

## vue 3 的生态

-   [官网](https://link.juejin.cn/?target=https%3A%2F%2Fv3.vuejs.org%2F "https://v3.vuejs.org/")
-   [源码](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fvue-next "https://github.com/vuejs/vue-next")
-   [vite构建器](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fvitejs%2Fvite "https://github.com/vitejs/vite")
-   [脚手架:](https://link.juejin.cn/?target=https%3A%2F%2Fcli.vuejs.org%2F "https://cli.vuejs.org/")[cli.vuejs.org/](https://link.juejin.cn/?target=https%3A%2F%2Fcli.vuejs.org%2F "https://cli.vuejs.org/")
-   [vue-router-next](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fvue-router-next "https://github.com/vuejs/vue-router-next")
-   [vuex4.0](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fvuejs%2Fvuex%2Ftree%2F4.0 "https://github.com/vuejs/vuex/tree/4.0")

UI 组件库

-   [vant2.x](https://link.juejin.cn/?target=https%3A%2F%2Fvant-contrib.gitee.io%2Fvant%2Fnext%2F%23%2Fzh-CN%2F "https://vant-contrib.gitee.io/vant/next/#/zh-CN/")
  
-   [Ant Design of Vue 2.x](https://link.juejin.cn/?target=https%3A%2F%2F2x.antdv.com%2Fdocs%2Fvue%2Fintroduce-cn%2F "https://2x.antdv.com/docs/vue/introduce-cn/")
  
-   [element-plus](https://link.juejin.cn/?target=https%3A%2F%2Felement-plus.org%2F%23%2Fzh-CN "https://element-plus.org/#/zh-CN")