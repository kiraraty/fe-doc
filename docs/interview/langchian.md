**LangChain构建知识库实践**

# **1.LLMs介绍**

## 1.1基础介绍

- 语言模型

语言模型是这样一个模型：**对于任意的词序列，它能够计算出这个序列是一句话的概率（**依据上下文环境，得出目前语料库中，概率靠前的话**）**

换句话说，语言模型就是由计算机来实现类似于人的语言交流、对话、叙述能力，它集中体现在模型能够依赖上下文进行正确的文字输出。把上述这些预测某句话空缺内容交给计算机建模来完成，就实现了语言模型的训练

语言模型在**自然语言处理( Natural Language Processing, NLP)**中占有重要的地位，它可以用于提升语音识别和机器翻译的性能。

语言模型的发展先后经历了文法规则语言模型、统计语言模型、**神经网络语言模型**等阶段。**GPT也可以看作是一种神经网络语言模型**

- **GPT (Generative Pre-trained Transformer）**

GPT是由OpenAI训练的一种基于深度学习技术的自然语言处理模型，该模型是基于Transformer结构的生成式预训练模型。

- **Transformer**

Transformer是一种通用的神经网络结构，它可以用于各种序列到序列的任务，如机器翻译、文本摘要、图像生成等。**GPT也可以看作是一种神经网络语言模型，它使用了Transformer作为其神经网络结构**

- **大模型**

大型语言模型指的是具有数十亿参数（B+）的预训练语言模型（例如：GPT-3, Bloom, LLaMA)。这种模型可以用于各种自然语言处理任务，如文本生成、机器翻译和自然语言理解等。

大型语言模型的这些参数是在大量文本数据上训练的。现有的大型语言模型主要采用 Transformer 模型架构，并且在很大程度上扩展了模型大小、预训练数据和总计算量。他们可以更好地理解自然语言，并根据给定的上下文（例如 prompt）生成高质量的文本。其中某些能力（例如上下文学习）是不可预测的，只有当模型大小超过某个水平时才能观察到。

## 1.2ChatGPT介绍

### **1.2.1ChatGPT的发展**

ChatGPT是一种基于深度学习的自然语言生成模型，是当前自然语言处理领域最具代表性的技术之一。其核心技术包括预训练、Transformer网络和自回归模型。

**预训练**

预训练是ChatGPT的核心技术之一。预训练是指在大规模语料库上对模型进行训练，使其能够自动学习语言的规律和规则。在预训练过程中，ChatGPT使用了海量的无标签文本数据，比如维基百科和新闻文章等。通过这些数据的训练，ChatGPT可以学习到自然语言的语法、句法和语义等信息，从而能够生成自然流畅的语言表达。

**Transformer网络**

Transformer网络是ChatGPT的另一个核心技术。Transformer网络是一种基于自注意力机制的神经网络，能够有效地处理长文本序列，并且能够捕捉到序列中的上下文信息。相较于传统的循环神经网络（RNN）和卷积神经网络（CNN），Transformer网络具有更好的并行性和更高的计算效率，能够处理更长的序列，使得ChatGPT能够生成更长、更复杂的文本内容。

**自回归模型**

自回归模型是ChatGPT的核心生成模型。自回归模型是指在生成文本时，模型会根据前面已经生成的文本内容来预测下一个单词或符号。ChatGPT使用了基于循环神经网络的自回归模型，每次生成一个单词或符号时，模型会根据上下文信息和历史生成结果进行预测。通过不断迭代生成，ChatGPT可以生成连贯自然的文本内容。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out.png)

GPT 系列进化时间线

#### **(1)InstructGPT**

​     作为GPT-3.5的“前辈”InstructGPT从GPT-3训练而来，GPT-3的文本生成能力虽然很强，但是也无法完全按照人类喜欢的方式去说话，也是会产生一些敏感的、不真实的、不合适的文本。OpenAI 提出了一个概念“Alignment”，意思是模型输出与人类真实意图对齐，符合人类偏好。为了让模型输出与用户意图更加 “align”(符合)，所以进行了InstructGPT的训练，同时提出了三大目标：helpful、honest、harmless

在新模型的训练当中，OpenAI 重度使用了人类作为“教师”的身份，对模型训练进行反馈和指导。从人类反馈中进行强化学习的过程，称为reinforcement learning from human feedback，简称 RLHF。这个也是使ChatGPT变得特殊的秘密武器

人类的监督即为，每一次GPT的反馈都会交由数据标记员评估，他们对不同 GPT模型版本生成的结果进行打分并优化参数，最后训练得到的即为InstructGPT

RLHF的训练过程可以分解为三个核心步骤：

| 训练方法                                                     | 简单解释                                                     | 模型                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| SFT监督微调人类示范 davinci-instruct-beta1                   | 人工给prompts写答案，并用这个数据来微调gpt3，这个叫sft       | [davinci-instruct-beta1](https://platform.openai.com/docs/model-index-for-researchers#footnote-1) |
| **FeedME**对人工编写的演示和模型样本进行监督微调，这些模型样本被人工标注者在总体质量得分上评分为 7/7 | 使用模型输出prompt的多个结果，然后人工对结果进行标注，训练一个reward模型，模型输出一个分数，对生成的答案进行打分 | text-davinci-001, text-davinci-002, text-curie-001, text-babbage-001 |
| **PPO**使用人类比较训练的奖励模型进行强化学习                | 进一步微调sft，使得sft的结果是reward模型中打分较高的那个答案 | text-davinci-003                                             |

#### **(2)GPT-3.5**

GPT 3.5是一个模型合集，里面有3个模型，都是基于code-davinci-002指令微调而来，包括ChatGPT、text-davinci-002，和text-davinci-003。

1. code-davinci-002是一个基本模型，非常适合纯粹的代码完成任务
2. text-davinci-002是一个基于InstructGPT模型code-davinci-002
3. text-davinci-003是一个改进text-davinci-002
4. gpt-3.5-turbo是对 的改进text-davinci-003，针对聊天进行了优化

text-davinci-003和ChatGPT都源于GPT-3.5。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229142153664.png)

当你对这两个模型提问时，它们都会给出整理好的回答，不过ChatGPT版更详细通俗，text-davinci-003版则更简洁且更靠谱。

OpenAI在其API服务正式推出称为text-davinci-003的GPT-3模型型号，官方提到，text-davinci-003是目前功能最强大的GPT-3模型，除了能够完成其他模型可以完成的任务之外，还能够提供更高的结果品质和文本输出长度，也能更好地遵循指令，此外，text-davinci-003添加在文本段落中插入完成功能。

Text-davinci-003模型的文本插入完成功能，除了运用前缀提示之外，还增加使用后缀提示，可用于编写长文本、段落过渡和遵循大纲等任务中，除了文本，text-davinci-003也适用于程序代码完成，可用于补完函数或是文件。

### **1.2.2Chatgpt的核心技术**

#### **(1)文字转换**

token 是任何 NLP 神经网络 模型接收用户输入的最小粒度。 token 本身就是一些字符的组合，如英文单词cat、中文词汇模型、英文词缀tion、中文汉字快等，都可以看作是一个 token。

将用户输入的文本转换为 token 序列的过程就叫做 Tokenizer。它包含两部分，一部分是从文字转换为 token（设置在进入 ChatGPT 之前），另一部分是将 token 转换为文字，也就是逆转换（设置在 ChatGPT 模型输出之后）。

Tokenizer 目前最流行的实现方法是 字符对编码 [**BPE**](https://wmathor.com/index.php/archives/1517/)**（Byte Pair Encoding）** 算法，它也是 ChatGPT 采用的算法。BPE 算法是根据一份 token 词表（Vocabulary），将输入的文本拆解成若干个 token。其中，每一个 token 都存在于词表。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229142153755.png)

**Tokenizer 的官方在线工具：**[**https://platform.openai.com/tokenizer**](https://platform.openai.com/tokenizer)

#### **(2)Embedding**

**ChatGPT 的输入文字转换为 token 之后，还需要将 token 再转换为张量，这个过程叫做词嵌入（ Embedding），同时 embedding 也指被转换后得到的张量本身。**

  ChatGPT 的输入文字转换为 token 之后，还需要将 token 再转换为张量，这个过程叫做词嵌入（ Embedding），同时 embedding 也指被转换后得到的张量本身。

在神经网络中，张量 （ Tensor ） 是指多维数组，它可以存储和处理大量的数据，是神经网络中最基本的数据结构。张量一般都以浮点数（小数的一种计算机表示形式）作为元素进行填充。

ChatGPT 从功能上看，是一个语言模型，但从结构上看，它是一个多层的、复杂的神经网络模型，每一层的神经网络都在进行浮点数张量（Tensor）的数字计算，而 ChatGPT 的输入是文字符号，token 也是文字符号。因此，token 需要先转换为 浮点 数字，再进入模型中进行计算。将用户输入的 token 转换为浮点数张量的过程，就叫做词嵌入（Embedding） 。当模型将结果计算完，也要将最终的浮点数转换为具体的 token，作为输出。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229142153841.png)

#### **(3)注意力机制和Transformer**

所有的 GPT 模型都利用了 transformer 架构，这意味着它们都会有一个编码器来处理输入序列，有一个解码器来生成输出序列。编码器和解码器都有一个多头的自注意力机制，这种机制可以让模型对序列的不同位置进行加权处理，从而推断含义与上下文。

注意力机制的本质是从大量信息中剔除杂质、无关信息，保留感兴趣的信息。注意力机制在 NLP 领域的应用主要是 自注意力Self-Attention 形式，它是神经网络具备充分拟合能力的灵魂。

可以这样理解，Transformer 是构成 ChatGPT 这座房子的砖块和钢筋，而自注意力机制则是构成 Transformer 的核心要素。Transformer 组件的核心结构就是 Self-Attention，组件的堆叠构成了 ChatGPT 的语言模型。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229142154180.png)

# **2.LangChain介绍**

## 2.1LangChain是什么

LangChain创建于2022年10月，是围绕LLMs（大语言模型）建立的一个框架，LLMs使用机器学习算法和海量数据来分析和理解自然语言，GPT3.5、GPT4是LLMs最先进的代表，国内百度的文心一言、阿里的通义千问也属于LLMs。LangChain自身并不开发LLMs，它的核心理念是为各种LLMs实现通用的接口，把LLMs相关的组件“链接”在一起，简化LLMs应用的开发难度，方便开发者快速地开发复杂的LLMs应用。LangChain目前有两个语言的实现：python和nodejs。

在检索增强生成（RAG）中，LLM作为执行的一部分从外部数据集检索上下文文档。如果我们想询问有关特定文档的问题（例如，PDF，视频等），这将很有用。检索增强生成的流程如下图所示：

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229142154249.png)

## 2.2LangChain的核心组件

一个LangChain应用是通过很多个组件实现的，LangChain主要支持6种组件：

- Model I/O：模型，LangChain提供了与任何语言模型交互的构建块，交互的输入输出主要包括：Prompts、Language models、Output parsers三部分。
- Retrieval：召回，通过检索增强生成（RAG）的方式，检索外部数据
- Memory：记忆，用来结构化文档，以便和模型交互
- Chains：链，一系列对各种组件的调用
- Agents：代理，决定模型采取哪些行动，执行并且观察流程，直到完成为止
- Callbacks: 回调，一个回调系统，允许连接到 LLM 申请的各个阶段

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229142155098.png)

### **2.2.1模型(**Models I/O)

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229142155246.png)

LangChain提供了与任何语言模型交互的构建块，交互的输入输出主要包括：Prompts、Language models、Output parsers三部分。

- Prompts：模板化、动态选择和管理模型输入
- Language models：通过通用接口调用语言模型
- Output parsers：从模型输出中提取信息

#### **(1)** **Prompts**

LangChain 提供了多个类和函数，使构建和使用提示词变得容易。Prompts模块主要包含了模板化、动态选择和管理模型输入两部分。

**提示模版**

类似于ES6模板字符串，可以在字符串中插入变量或表达式，接收来自最终用户的一组参数并生成提示。



```
// An example prompt with multiple input variables
const multipleInputPrompt = new PromptTemplate({
  inputVariables: ["adjective", "content"],
  template: "Tell me a {adjective} joke about {content}.",
});
const formattedMultipleInputPrompt = await multipleInputPrompt.format({
  adjective: "funny",
  content: "chickens",
});

console.log(formattedMultipleInputPrompt);
// "Tell me a funny joke about chickens."
```



**模版组合**

同时可以通过 PipelinePrompt将多个PromptTemplate提示模版进行组合，组合的优点是可以很方便的进行复用。



```
import { PromptTemplate, PipelinePromptTemplate } from "langchain/prompts";

const fullPrompt = PromptTemplate.fromTemplate(`{introduction}

{example}

{start}`);

const introductionPrompt = PromptTemplate.fromTemplate(
  `You are impersonating {person}.`
);

const examplePrompt =
  PromptTemplate.fromTemplate(`Here's an example of an interaction:
Q: {example_q}
A: {example_a}`);

const startPrompt = PromptTemplate.fromTemplate(`Now, do this for real!
Q: {input}
A:`);

const composedPrompt = new PipelinePromptTemplate({
  pipelinePrompts: [
    {
      name: "introduction",
      prompt: introductionPrompt,
    },
    {
      name: "example",
      prompt: examplePrompt,
    },
    {
      name: "start",
      prompt: startPrompt,
    },
  ],
  finalPrompt: fullPrompt,
});

const formattedPrompt = await composedPrompt.format({
  person: "Elon Musk",
  example_q: `What's your favorite car?`,
  example_a: "Telsa",
  input: `What's your favorite social media site?`,
});

console.log(formattedPrompt);

/*
  You are impersonating Elon Musk.

  Here's an example of an interaction:
  Q: What's your favorite car?
  A: Telsa

  Now, do this for real!
  Q: What's your favorite social media site?
  A:
*/
```



模版选择

为了大模型能够给出相对精准的输出内容，通常会在prompt中提供一些示例描述，如果包含大量示例会浪费token数量，甚至可能会超过最大token限制。为此，LangChain提供了**示例选择器**，可以从用户提供的大量示例中，选择最合适的部分作为最终的prompt。通常有2种方式：按长度选择和按相似度选择。

按长度选择：对于较长的输入，它将选择较少的示例；而对于较短的输入，它将选择更多的示例。



```
// 定义长度选择器
const exampleSelector = await LengthBasedExampleSelector.fromExamples(
    [
      { input: "happy", output: "sad" },
      { input: "tall", output: "short" },
      { input: "energetic", output: "lethargic" },
      { input: "sunny", output: "gloomy" },
      { input: "windy", output: "calm" },
    ],
    {
      examplePrompt,
      maxLength: 25,
    }
);
...
// 最终会根据用户的输入长度，来选择合适的示例

// 用户输入较少，选择所有示例
console.log(await dynamicPrompt.format({ adjective: "big" })); 
/*
   Give the antonym of every input

   Input: happy
   Output: sad

   Input: tall
   Output: short

   Input: energetic
   Output: lethargic

   Input: sunny
   Output: gloomy

   Input: windy
   Output: calm

   Input: big
   Output:
   */
// 用户输入较多，选择其中一个示例
const longString =
    "big and huge and massive and large and gigantic and tall and much much much much much bigger than everything else";
console.log(await dynamicPrompt.format({ adjective: longString }));
/*
   Give the antonym of every input

   Input: happy
   Output: sad

   Input: big and huge and massive and large and gigantic and tall and much much much much much bigger than everything else
   Output:
   */
```



按相似度选择：查找与输入具有最大余弦相似度的嵌入示例



```
...
// 定义相似度选择器
const exampleSelector = await SemanticSimilarityExampleSelector.fromExamples(
  [
    { input: "happy", output: "sad" },
    { input: "tall", output: "short" },
    { input: "energetic", output: "lethargic" },
    { input: "sunny", output: "gloomy" },
    { input: "windy", output: "calm" },
  ],
  new OpenAIEmbeddings(),
  HNSWLib,
  { k: 1 }
);
...
// 跟天气类相关的示例
console.log(await dynamicPrompt.format({ adjective: "rainy" }));
/*
  Give the antonym of every input

  Input: sunny
  Output: gloomy

  Input: rainy
  Output:
*/
// 跟尺寸相关的示例
console.log(await dynamicPrompt.format({ adjective: "large" }));
/*
  Give the antonym of every input

  Input: tall
  Output: short

  Input: large
  Output:
*/
```



#### **(2)Language models**

LangChain支持多种常见的Language models，并提供了两种类型的模型的接口和集成：

- LLM：采用文本字符串作为输入并返回文本字符串的模型
- Chat models：由语言模型支持的模型，但将聊天消息列表作为输入并返回聊天消息

**LLM模式**

例如使用OpenAI,进行文本输入，然后文本输出。



```
import { OpenAI } from "langchain/llms/openai";
// 实例化一个模型
const model = new OpenAI({ 
    // OpenAI内置参数
    openAIApiKey: "YOUR_KEY_HERE",
    modelName: "text-davinci-002", //gpt-4、gpt-3.5-turbo
    maxTokens: 25, 
    temperature: 1, //发散度
    // LangChain自定义参数
    maxRetries: 10, //发生错误后重试次数
    maxConcurrency: 5, //最大并发请求次数
    cache: true //开启缓存
});
// 使用模型
const res = await model.predict("Tell me a joke");
```



同时支持取消请求，处理api错误，设置请求速度限制，设置超时，流式传输，订阅事件等

**Chat models模式**

Chat models: 由语言模型支持，输入为聊天消息列表，输出为聊天消息的模型

chat models是基于LLM模式的更加高级的模式。他的输入和输出是格式化的chat messages

目前看来langchain支持的chat models有ChatAnthropic,ChatVertexAI,JinaChat,ChatOpenAI和PromptLayerChatOpenAI这几种

langchain把chat消息分成了这几种：AIMessage, HumanMessage, SystemMessage 和 ChatMessage。HumanMessage就是用户输入的消息，AIMessage是大语言模型的消息，SystemMessage是系统的消息。ChatMessage是一种可以自定义类型的消息。



```
const response = await chat.call([
  new SystemMessage(
    "You are a helpful assistant that translates English to French."
  ),
  new HumanMessage("Translate: I love programming."),
]);
console.log(response);
// AIMessage { text: "J'aime programmer." }
```



chat models是LLM的高阶表现形式。如果我们需要进行对话模型的话，就可以考虑使用这个

#### **(3)Output parsers**

语言模型可以输出文本或富文本信息，但很多时候，我们可能想要获得结构化信息，比如常见的JSON结构可以和应用程序更好的结合



```
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "langchain/schema/runnable";

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  answer: "answer to the user's question",
  source: "source used to answer the user's question, should be a website.",
});

const chain = RunnableSequence.from([
  PromptTemplate.fromTemplate(
    "Answer the users question as best as possible.\n{format_instructions}\n{question}"
  ),
  new OpenAI({ temperature: 0 }),
  parser,
]);

console.log(parser.getFormatInstructions());
```



### **2.2.2 检索(****Retrieval)**

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229142155604.png)

一些LLM应用通常需要特定的用户数据，这些数据不属于模型训练集的一部分。可以通过检索增强生成（RAG）的方式，检索外部数据，然后在执行生成步骤时将其传递给 LLM 。LangChain 提供了 RAG 应用程序的所有构建模块

#### **(1)Document loaders**

文档的核心相当简单。它由一段文本和可选的元数据组成。文本片段是我们与语言模型交互的内容，而可选的元数据对于跟踪有关文档的元数据（例如源）很有用。

返回的文档对象类型如下：



```
interface Document {
  pageContent: string;
  metadata: Record<string, any>;
}
```



Document loaders可以从各种数据源加载文档。LangChain 提供了许多不同的文档加载器以及与对应的第三方集成工具

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229142155820.png)

#### **(2)Document transformers**

加载文档后，通常会想要对其进行转换以更好地适合您的应用程序。最简单的例子是，希望将长文档分割成更小的块，以适合模型的上下文窗口。LangChain 有许多内置的文档转换器，可以轻松地拆分、组合、过滤和以其他方式操作文档。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229142156061.png)

当想要处理长文本时，有必要将该文本分割成块，但这里存在很多潜在的复杂性。

理想情况下，您希望将语义相关的文本片段保留在一起。“语义相关”的含义可能取决于文本的类型

文本分割器的工作原理如下：

1. 将文本分成小的、具有语义意义的块（通常是句子）。
2. 开始将这些小块组合成一个更大的块，直到达到一定的大小（通过某些函数测量）。
3. 一旦达到该大小，请将该块设为自己的文本片段，然后开始创建具有一些重叠的新文本块（以保持块之间的上下文）。



```
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const text = `Hi.\n\nI'm Harrison.\n\nHow? Are? You?\nOkay then f f f f.
This is a weird text to write, but gotta test the splittingggg some how.\n\n
Bye!\n\n-H.`;
const splitter = new RecursiveCharacterTextSplitter({
  separators: ["\n\n", "\n", " ", ""], //默认分隔符
  chunkSize: 1000, //文档块的最大大小（以字符数计）
  chunkOverlap: 200, //文档块之间应该有多少重叠
});

const output = await splitter.createDocuments([text]);
```



![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229142156158.png)

#### **(3)Text embedding models**

文本嵌入模型（Text embedding models）是用于创建文本数据的数值表示的模型。它可以将文本转换为向量表示，从而在向量空间中进行语义搜索和查找相似文本。LangChain嵌入模型提供了标准接口，可以与多个Language models提供商进行集成。

通常要结合文档（Document）和向量存储（Vector stores）一起配合使用

例如直接使用OpenAIEmbeddings 可以获取查询文字或文档的嵌入



```
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
const embeddings = new OpenAIEmbeddings({
  maxRetries: 10,
  maxConcurrency: 5,
  timeout: 1000, 
});
const res = await embeddings.embedQuery("Hello world");
const documentRes = await embeddings.embedDocuments(["Hello world", "Bye bye"]);
```



#### **(4)Vector stores**

存储和搜索非结构化数据的最常见方法之一是嵌入它并存储生成的嵌入向量，然后在查询时嵌入非结构化查询并检索与嵌入查询“最相似”的嵌入向量。矢量存储负责存储嵌入数据并为您执行矢量搜索。

最简单存储少量文档数据方式为直接存储到内存中



```
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";

const vectorStore = await MemoryVectorStore.fromTexts(
  ["Hello world", "Bye bye", "hello nice world"],
  [{ id: 2 }, { id: 1 }, { id: 3 }],
  new OpenAIEmbeddings()
);


const resultOne = await vectorStore.similaritySearch("hello world", 1);
console.log(resultOne);
/*
  [
    Document {
      pageContent: "Hello world",
      metadata: { id: 2 }
    }
  ]
*/
// 或者读取本地文档
const loader = new TextLoader("src/document_loaders/example_data/example.txt");
const docs = await loader.load();

const vectorStoreFile = await MemoryVectorStore.fromDocuments(
  docs,
  new OpenAIEmbeddings()
);

const resultOneFile = await vectorStoreFile.similaritySearch("hello world", 1);

console.log(resultOneFile);
```



LangChain中提供了非常多的向量存储方案和建议：https://js.langchain.com/docs/modules/data_connection/vectorstores/

https://js.langchain.com/docs/integrations/vectorstores

#### **(5)Retrievers**

检索器（Retriever）是一个接口：根据非结构化查询返回文档。它比Vector Store更通用，创建Vector Store后，将其用作检索器的方法非常简单，例如使用本地向量存储 HNSWLib 



```
const model = new ChatOpenAI({});
const text = fs.readFileSync("docs.txt", "utf8");
const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
const docs = await textSplitter.createDocuments([text]);
const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

const vectorStoreRetriever = vectorStore.asRetriever();
```



Langchain支持易于上手的基本方法 - 即简单语义搜索。同时还在此基础上添加了一系列算法以提高性能，提供了很多类型的检索器，比如：

- 上下文压缩检索器（ContextualCompression）：用给定查询的上下文来压缩它们，以便只返回相关信息，而不是立即按原样返回检索到的文档，同时还可以减少token数量。
- 多查询检索器（MultiQueryRetriever）：从不同角度为给定的用户输入查询生成多个查询。

- 多向量检索器（MultiVector Retriever）：每个文档存储多个向量，可以通过多个向量进行查询。

- 父文档检索器（Parent Document Retriever）：在检索过程中，它首先获取小块，然后查找这些块的父 ID，并返回那些较大的文档。
- 自查询（Self-Querying）：一种能够查询自身的检索器。不仅可以对文档内容进行语义相似性比较，还可以从用户对存储文档的元数据的查询中提取过滤。
- 时间加权检索器（Time-weighted vector store retriever）：结合使用语义相似性和时间衰减。

- 相似度分数阈值（Similarity Score Threshold）：在无法确定最相似的前K个搜索结果的K的值时，可以根据最小相似度百分比返回所有可能得结果。

### **2.2.3 记忆(****Memory)**

默认情况下，链和代理是无状态的，这意味着它们独立处理每个传入查询（就像底层 LLM 和聊天模型本身一样）。在某些应用程序中，例如聊天机器人，必须记住以前的短期和长期交互。Memory类正是这样做的。

LangChain提供两种形式的内存组件。首先，LangChain 提供了帮助实用程序来管理和操作以前的聊天消息。它们被设计为模块化且有用的，无论它们如何使用。其次，LangChain提供了将这些实用程序整合到链中的简单方法。

ChatMessageHistory:此类允许您使用不同的存储解决方案（例如 Redis）来保留持久的聊天消息历史记录。



```
import { ChatMessageHistory } from "langchain/memory";

const history = new ChatMessageHistory();

await history.addUserMessage("Hi!");

await history.addAIChatMessage("What's up?");

const messages = await history.getMessages();

console.log(messages);

/*
  [
    HumanMessage {
      content: 'Hi!',
    },
    AIMessage {
      content: "What's up?",
    }
  ]
*/
```



当然也可以建立自己的内存通过BaseMemory接口方法实现



```
export type InputValues = Record<string, any>;

export type OutputValues = Record<string, any>;

interface BaseMemory {
  loadMemoryVariables(values: InputValues): Promise<MemoryVariables>;

  saveContext(
    inputValues: InputValues,
    outputValues: OutputValues
  ): Promise<void>;
}
```



有一个比较实用的Memory方法ConversationSummaryMemory，这种类型的记忆会随着时间的推移创建对话的摘要。这对于随着时间的推移压缩对话中的信息非常有用。对话摘要内存对发生的对话进行总结，并将当前摘要存储在内存中。然后可以使用该内存将迄今为止的对话摘要注入提示/链中。



```
import { OpenAI } from "langchain/llms/openai";
import { ConversationSummaryMemory } from "langchain/memory";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";

export const run = async () => {
  const memory = new ConversationSummaryMemory({
    memoryKey: "chat_history",
    llm: new OpenAI({ modelName: "gpt-3.5-turbo", temperature: 0 }),
  });

  const model = new OpenAI({ temperature: 0.9 });
  const prompt =
    PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

  Current conversation:
  {chat_history}
  Human: {input}
  AI:`);
  const chain = new LLMChain({ llm: model, prompt, memory });

  const res1 = await chain.call({ input: "Hi! I'm Jim." });
  console.log({ res1, memory: await memory.loadMemoryVariables({}) });
  /*
  {
    res1: {
      text: " Hi Jim, I'm AI! It's nice to meet you. I'm an AI programmed to provide information about the environment around me. Do you have any specific questions about the area that I can answer for you?"
    },
    memory: {
      chat_history: 'Jim introduces himself to the AI and the AI responds, introducing itself as a program designed to provide information about the environment. The AI offers to answer any specific questions Jim may have about the area.'
    }
  }
  */

  const res2 = await chain.call({ input: "What's my name?" });
  console.log({ res2, memory: await memory.loadMemoryVariables({}) });
  /*
  {
    res2: { text: ' You told me your name is Jim.' },
    memory: {
      chat_history: 'Jim introduces himself to the AI and the AI responds, introducing itself as a program designed to provide information about the environment. The AI offers to answer any specific questions Jim may have about the area. Jim asks the AI what his name is, and the AI responds that Jim had previously told it his name.'
    }
  }
  */
};
```



### **2.2.4 链条(Chains)**

单独使用 LLM 对于简单的应用程序来说很好，但更复杂的应用程序需要链接 LLM - 彼此链接或与其他组件链接。链允许我们将多个组件组合在一起以创建一个单一的、连贯的应用程序。例如，我们可以创建一个链，它接受用户输入，使用 PromptTemplate 对其进行格式化，然后将格式化的响应传递给 LLM。通过链可以进行灵活的配置，可以通过将多个链组合在一起，或者将链与其他组件组合来构建更复杂的链。

比如我需要进行顺序进行多个任务，当前链的结果需要前面链条的输出。可以使用顺序链来执行此操作。顺序链允许您连接多个链并将它们组成执行某些特定场景的管道。顺序链有两种类型：

- 单序列链(SimpleSequentialChain)：顺序链的最简单形式，其中每个步骤都有一个单一的输入/输出，并且一个步骤的输出是下一步的输入。
- 序列链(SequentialChain)：更通用的顺序链形式，允许多个输入/输出。

以SimpleSequentialChain为例，第一步，给定标题，生成戏剧概要。第二步，根据生成的剧情简介，生成对该剧的评论。



```
import { SimpleSequentialChain, LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

// This is an LLMChain to write a synopsis given a title of a play.
const llm = new OpenAI({ temperature: 0 });
const template = `You are a playwright. Given the title of play, it is your job to write a synopsis for that title.
 
  Title: {title}
  Playwright: This is a synopsis for the above play:`;
const promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["title"],
});
const synopsisChain = new LLMChain({ llm, prompt: promptTemplate });

// This is an LLMChain to write a review of a play given a synopsis.
const reviewLLM = new OpenAI({ temperature: 0 });
const reviewTemplate = `You are a play critic from the New York Times. Given the synopsis of play, it is your job to write a review for that play.
 
  Play Synopsis:
  {synopsis}
  Review from a New York Times play critic of the above play:`;
const reviewPromptTemplate = new PromptTemplate({
  template: reviewTemplate,
  inputVariables: ["synopsis"],
});
const reviewChain = new LLMChain({
  llm: reviewLLM,
  prompt: reviewPromptTemplate,
});

const overallChain = new SimpleSequentialChain({
  chains: [synopsisChain, reviewChain],
  verbose: true,
});
const review = await overallChain.run("Tragedy at sunset on the beach");
console.log(review);
/*
    variable review contains the generated play review based on the input title and synopsis generated in the first step:

    "Tragedy at Sunset on the Beach is a powerful and moving story of love, loss, and redemption. The play follows the story of two young lovers, Jack and Jill, whose plans for a future together are tragically cut short when Jack is killed in a car accident. The play follows Jill as she struggles to cope with her grief and eventually finds solace in the arms of another man. 
    The play is beautifully written and the performances are outstanding. The actors bring the characters to life with their heartfelt performances, and the audience is taken on an emotional journey as Jill is forced to confront her grief and make a difficult decision between her past and her future. The play culminates in a powerful climax that will leave the audience in tears. 
    Overall, Tragedy at Sunset on the Beach is a powerful and moving story that will stay with you long after the curtain falls. It is a must-see for anyone looking for an emotionally charged and thought-provoking experience."
*/
```



还有一个比较实用的案例，迭代执行文档

MapReduce 文档链首先将 LLM 链单独应用于每个文档（Map 步骤），将链输出视为新文档。然后，它将所有新文档传递到单独的组合文档链以获得单个输出（Reduce 步骤）。它可以选择首先压缩或折叠映射的文档，以确保它们适合组合文档链（这通常会将它们传递给大模型）。如有必要，该压缩步骤会递归执行。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229142156547.png)



```
import { BaseCallbackConfig } from "langchain/callbacks";
import {
  collapseDocs,
  splitListOfDocs,
} from "langchain/chains/combine_documents/reduce";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { Document } from "langchain/document";
import { PromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import { formatDocument } from "langchain/schema/prompt_template";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "langchain/schema/runnable";

// Initialize the OpenAI model
const model = new ChatOpenAI({});

// Define prompt templates for document formatting, summarizing, collapsing, and combining
const documentPrompt = PromptTemplate.fromTemplate("{pageContent}");
const summarizePrompt = PromptTemplate.fromTemplate(
  "Summarize this content:\n\n{context}"
);
const collapsePrompt = PromptTemplate.fromTemplate(
  "Collapse this content:\n\n{context}"
);
const combinePrompt = PromptTemplate.fromTemplate(
  "Combine these summaries:\n\n{context}"
);

// Wrap the `formatDocument` util so it can format a list of documents
const formatDocs = async (documents: Document[]): Promise<string> => {
  const formattedDocs = await Promise.all(
    documents.map((doc) => formatDocument(doc, documentPrompt))
  );
  return formattedDocs.join("\n\n");
};

// Define a function to get the number of tokens in a list of documents
const getNumTokens = async (documents: Document[]): Promise<number> =>
  model.getNumTokens(await formatDocs(documents));

// Initialize the output parser
const outputParser = new StringOutputParser();

// Define the map chain to format, summarize, and parse the document
const mapChain = RunnableSequence.from([
  { context: async (i: Document) => formatDocument(i, documentPrompt) },
  summarizePrompt,
  model,
  outputParser,
]);

// Define the collapse chain to format, collapse, and parse a list of documents
const collapseChain = RunnableSequence.from([
  { context: async (documents: Document[]) => formatDocs(documents) },
  collapsePrompt,
  model,
  outputParser,
]);

// Define a function to collapse a list of documents until the total number of tokens is within the limit
const collapse = async (
  documents: Document[],
  options?: {
    config?: BaseCallbackConfig;
  },
  tokenMax = 4000
) => {
  const editableConfig = options?.config;
  let docs = documents;
  let collapseCount = 1;
  while ((await getNumTokens(docs)) > tokenMax) {
    if (editableConfig) {
      editableConfig.runName = `Collapse ${collapseCount}`;
    }
    const splitDocs = splitListOfDocs(docs, getNumTokens, tokenMax);
    docs = await Promise.all(
      splitDocs.map((doc) => collapseDocs(doc, collapseChain.invoke))
    );
    collapseCount += 1;
  }
  return docs;
};

// Define the reduce chain to format, combine, and parse a list of documents
const reduceChain = RunnableSequence.from([
  { context: formatDocs },
  combinePrompt,
  model,
  outputParser,
]).withConfig({ runName: "Reduce" });

// Define the final map-reduce chain
const mapReduceChain = RunnableSequence.from([
  RunnableSequence.from([
    { doc: new RunnablePassthrough(), content: mapChain },
    (input) =>
      new Document({
        pageContent: input.content,
        metadata: input.doc.metadata,
      }),
  ])
    .withConfig({ runName: "Summarize (return doc)" })
    .map(),
  collapse,
  reduceChain,
]).withConfig({ runName: "Map reduce" });

// Define the text to be processed
const text = `Nuclear power in space is the use of nuclear power in outer space, typically either small fission systems or radioactive decay for electricity or heat. Another use is for scientific observation, as in a Mössbauer spectrometer. The most common type is a radioisotope thermoelectric generator, which has been used on many space probes and on crewed lunar missions. Small fission reactors for Earth observation satellites, such as the TOPAZ nuclear reactor, have also been flown.[1] A radioisotope heater unit is powered by radioactive decay and can keep components from becoming too cold to function, potentially over a span of decades.[2]

The United States tested the SNAP-10A nuclear reactor in space for 43 days in 1965,[3] with the next test of a nuclear reactor power system intended for space use occurring on 13 September 2012 with the Demonstration Using Flattop Fission (DUFF) test of the Kilopower reactor.[4]

After a ground-based test of the experimental 1965 Romashka reactor, which used uranium and direct thermoelectric conversion to electricity,[5] the USSR sent about 40 nuclear-electric satellites into space, mostly powered by the BES-5 reactor. The more powerful TOPAZ-II reactor produced 10 kilowatts of electricity.[3]

Examples of concepts that use nuclear power for space propulsion systems include the nuclear electric rocket (nuclear powered ion thruster(s)), the radioisotope rocket, and radioisotope electric propulsion (REP).[6] One of the more explored concepts is the nuclear thermal rocket, which was ground tested in the NERVA program. Nuclear pulse propulsion was the subject of Project Orion.[7]

Regulation and hazard prevention[edit]
After the ban of nuclear weapons in space by the Outer Space Treaty in 1967, nuclear power has been discussed at least since 1972 as a sensitive issue by states.[8] Particularly its potential hazards to Earth's environment and thus also humans has prompted states to adopt in the U.N. General Assembly the Principles Relevant to the Use of Nuclear Power Sources in Outer Space (1992), particularly introducing safety principles for launches and to manage their traffic.[8]

Benefits

Both the Viking 1 and Viking 2 landers used RTGs for power on the surface of Mars. (Viking launch vehicle pictured)
While solar power is much more commonly used, nuclear power can offer advantages in some areas. Solar cells, although efficient, can only supply energy to spacecraft in orbits where the solar flux is sufficiently high, such as low Earth orbit and interplanetary destinations close enough to the Sun. Unlike solar cells, nuclear power systems function independently of sunlight, which is necessary for deep space exploration. Nuclear-based systems can have less mass than solar cells of equivalent power, allowing more compact spacecraft that are easier to orient and direct in space. In the case of crewed spaceflight, nuclear power concepts that can power both life support and propulsion systems may reduce both cost and flight time.[9]

Selected applications and/or technologies for space include:

Radioisotope thermoelectric generator
Radioisotope heater unit
Radioisotope piezoelectric generator
Radioisotope rocket
Nuclear thermal rocket
Nuclear pulse propulsion
Nuclear electric rocket`;

// Split the text into documents and process them with the map-reduce chain
const docs = text.split("\n\n").map(
  (pageContent) =>
    new Document({
      pageContent,
      metadata: {
        source: "https://en.wikipedia.org/wiki/Nuclear_power_in_space",
      },
    })
);
const result = await mapReduceChain.invoke(docs);

// Print the result
console.log(result);
/**
 * View the full sequence on LangSmith
 * @link https://smith.langchain.com/public/f1c3b4ca-0861-4802-b1a0-10dcf70e7a89/r
 */
```



### **2.2.5 代理(Agents)**

有些应用并不是一开始就确定调用哪些模型，而是依赖于用户输入，代理就提供了一套工具，根据用户的输入来决定调用这些工具种的哪一个。LangChain提供了下面的组件：

- 工具

- - 用来方便模型和其他资源交互

- 代理

- - 围绕模型的包装器，接收用户输入，决定模型的行为

- [工具集](https://js.langchain.com/docs/integrations/toolkits)

- - 解决特定问题的工具集合，如json工具集，OpenAI工具集，SQL工具集，向量存储工具集

- 代理执行器

- - 代理和一组工具，调用代理

 某些应用程序需要根据用户输入对 LLM 和其他工具进行灵活的调用链。代理接口为此类应用程序提供了灵活性。代理可以访问一套工具，并根据用户输入确定使用哪些工具。代理可以使用多种工具，并使用一个工具的输出作为下一个工具的输入。

代理主要有两种类型：

- 动作代理：在每个时间步，使用所有先前动作的输出来决定下一个动作
- 计划并执行代理：预先决定完整的操作顺序，然后执行所有操作而不更新计划

ChatGPT对实时信息处理不够好，可以使用额外的工具函数帮助处理ChatGPT的返回结果



```
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";

const tools = [new Calculator(), new SerpAPI()];
const chat = new ChatOpenAI({ modelName: "gpt-4", temperature: 0 });

const executor = await initializeAgentExecutorWithOptions(tools, chat, {
  agentType: "openai-functions",
  verbose: true,
});

const result = await executor.invoke({
  input: "What is the weather in New York?",
});
console.log(result);

/*
  The current weather in New York is 72°F with a wind speed of 1 mph coming from the SSW. The humidity is at 89% and the UV index is 0 out of 11. The cloud cover is 79% and there has been no rain.
*/
```



通过详细的处理输出可以发现，通过询问实时天气，ChatGPT并不能回答好，调用SerpAPI获取谷歌搜索结果，然后再提供给ChatGPT

OpenAI 的最新gpt-3.5-turbo-1106模型gpt-4-1106-preview已经过微调，可以检测何时应调用函数并响应应传递给函数的输入。在 API 调用中，您可以描述函数并让模型智能地选择输出包含调用这些函数的参数的 JSON 对象。OpenAI 函数 API 的目标是比通用文本完成或聊天 API 更可靠地返回有效且有用的函数调用。

同时也可以检测何时应调用一个或多个工具来收集足够的信息来回答初始查询，并使用应传递给这些工具的输入进行响应。

### **2.2.6 回调(Callbacks)**

LangChain 提供了一个回调系统，允许您连接到 LLM 申请的各个阶段。这对于日志记录、监控、流传输和其他任务非常有用。

callbacks您可以使用整个 API 中可用的参数来订阅这些事件

详细模式开启后，可以将所有Chain和LLM事件记录到控制台



```
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";

const chain = new LLMChain({
  llm: new OpenAI({ temperature: 0 }),
  prompt: PromptTemplate.fromTemplate("Hello, world!"),
  verbose: true,
});
```



使用call获取流式传输的文字段



```
import { OpenAI } from "langchain/llms/openai";

// To enable streaming, we pass in `streaming: true` to the LLM constructor.
// Additionally, we pass in a handler for the `handleLLMNewToken` event.
const model = new OpenAI({
  maxTokens: 25,
  streaming: true,
});

const response = await model.call("Tell me a joke.", {
  callbacks: [
    {
      handleLLMNewToken(token: string) {
        console.log({ token });
      },
    },
  ],
});
console.log(response);
```



# **3.****LangChain的实践**

## **3.1使用chatgpt接口**

LangChain内部已经实现了关于chatgpt接口的调用,使用非常方便



```
import { OpenAI } from "langchain/llms/openai";

const llm = new OpenAI({
  openAIApiKey: "YOUR_KEY_HERE",
  temperature: 0.9,
});
const result = await llm.predict("What would be a good company name for a company that makes colorful socks?");
// "Feetful of Fun"
```



## **3.2文档读取和切割**

### **3.2.1 文档读取分析**



```
interface Document {
  pageContent: string;
  metadata: Record<string, any>;
}
Document {
      pageContent: 'Review of The Bee Movie\n' +
        'By Roger Ebert\n' +
        'This is the greatest movie ever made. 4 out of 5 stars.',
      metadata: {
        movie_title: 'The Bee Movie',
        critic: 'Roger Ebert',
        tone: 'positive',
        rating: 4
      }
    },
```



langchain支持多种文档读取包括markdown,txt,pdf,csv,json等，支持手动创建文档

例如，读取目录下所有文档进行，生成文档数据



```
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "langchain/document_loaders/fs/csv";

const loader = new DirectoryLoader(
  "src/document_loaders/example_data/example",
  {
    ".json": (path) => new JSONLoader(path, "/texts"),
    ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
    ".txt": (path) => new TextLoader(path),
    ".csv": (path) => new CSVLoader(path, "text"),
  }
);
const docs = await loader.load();
console.log({ docs });
```



### **3.2.2文档切割器分析**

#### **(1)CharacterTextSplitter**



```
import { Document } from "langchain/document";
import { CharacterTextSplitter } from "langchain/text_splitter";

const text = "hello world, how about you? thanks, I am fine.  the machine learning class. So what I wanna do today is just spend a little time going over the logistics of the class, and then we'll start to talk a bit about machine learning";
const splitter = new CharacterTextSplitter({
  separator: " ",
  chunkSize: 20,
  chunkOverlap: 4,
});
const output = await splitter.createDocuments([text]);
```



分割后，得到的结果如下左图所示，每一段chunk尽量和chunk_size贴近，每个chunk之间也有overlap。RecursiveCharacterTextSplitter 将按不同的字符递归地分割(按照这个优先级["\n\n", "\n", " ", ""])，这样就能尽量把所有和语义相关的内容尽可能长时间地保留在同一位置.在项目中也推荐使用RecursiveCharacterTextSplitter来进行分割。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229142156870.png)![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229142156944.png)

如果将splitter设置为空格，那么拆分后的List长度大部分等于15，可以看到会按空格拆分，且每个chunk的大小尽量和chunk_size的值贴近。

#### **(2)CodeTextSplitter**

CodeTextSplitter 允许拆分代码和标记并支持多种语言。

LangChain 支持各种不同的标记和特定于编程语言的文本分割器，以根据特定于语言的语法分割文本。这会产生语义上更独立的块，对向量存储或其他检索器更有用。支持 JavaScript、Python、Solidity 和 Rust 等流行语言，以及 Latex、HTML 和 Markdown。



```
import {
  SupportedTextSplitterLanguages,
  RecursiveCharacterTextSplitter,
} from "langchain/text_splitter";

console.log(SupportedTextSplitterLanguages); // Array of supported languages

/*
  [
    'cpp',      'go',
    'java',     'js',
    'php',      'proto',
    'python',   'rst',
    'ruby',     'rust',
    'scala',    'swift',
    'markdown', 'latex',
    'html'
  ]
*/

const jsCode = `function helloWorld() {
  console.log("Hello, World!");
}
// Call the function
helloWorld();`;

const splitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
  chunkSize: 32,
  chunkOverlap: 0,
});
const jsOutput = await splitter.createDocuments([jsCode]);

console.log(jsOutput);

/*
  [
    Document {
      pageContent: 'function helloWorld() {',
      metadata: { loc: [Object] }
    },
    Document {
      pageContent: 'console.log("Hello, World!");',
      metadata: { loc: [Object] }
    },
    Document {
      pageContent: '}\n// Call the function',
      metadata: { loc: [Object] }
    },
    Document {
      pageContent: 'helloWorld();',
      metadata: { loc: [Object] }
    }
  ]
*/
```



#### **(3)TokenTextSplitter**

基于Token对文本进行切割，下面的代码调用TokenTextSplitter对一段文本进行分割，也就是按照token的数量大小来对文本进行分割。为什么会有按token来切割文本的方式呢？因为，很多LLM的上下文窗口长度限制是按照Token来计数的。因此，以LLM的视角，按照Token对文本进行分隔，通常可以得到更好的结果。



```
import { Document } from "langchain/document";
import { TokenTextSplitter } from "langchain/text_splitter";

const text = "hello world, how about you? thanks, I am fine.  the machine learning class. So what I wanna do today is just spend a little time going over the logistics of the class, and then we'll start to talk a bit about machine learning";

const splitter = new TokenTextSplitter({
  encodingName: "gpt2",
  chunkSize: 20,
  chunkOverlap: 5,
});

const output = await splitter.createDocuments([text]);
```



切割后是4部分，每一部分是按照token数量=20的范围来对文本进行切分的

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229142157031.png)

#### **(4)RecursiveCharacterTextSplitter**

接下来再试试基于MarkdownHeader的分割方式，分块的目的是把具有上下文的文本放在一起，我们可以通过使用指定分隔符来进行分隔，但有些类型的文档（例如 Markdown）本身就具有可用于分割的结构（如标题）。Markdown标题文本分割器会根据标题或子标题来分割一个Markdown文档，并将标题作为元数据添加到每个块中。



```
const text = `
---
sidebar_position: 1
---
# Document transformers

Once you've loaded documents, you'll often want to transform them to better suit your application. The simplest example
is you may want to split a long document into smaller chunks that can fit into your model's context window. LangChain
has a number of built-in document transformers that make it easy to split, combine, filter, and otherwise manipulate documents.

## Text splitters

When you want to deal with long pieces of text, it is necessary to split up that text into chunks.
As simple as this sounds, there is a lot of potential complexity here. Ideally, you want to keep the semantically related pieces of text together. What "semantically related" means could depend on the type of text.
This notebook showcases several ways to do that.

At a high level, text splitters work as following:

1. Split the text up into small, semantically meaningful chunks (often sentences).
2. Start combining these small chunks into a larger chunk until you reach a certain size (as measured by some function).
3. Once you reach that size, make that chunk its own piece of text and then start creating a new chunk of text with some overlap (to keep context between chunks).

That means there are two different axes along which you can customize your text splitter:

1. How the text is split
2. How the chunk size is measured

## Get started with text splitters

import GetStarted from "@snippets/modules/data_connection/document_transformers/get_started.mdx"

<GetStarted/>
`;
```





```
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
  chunkSize: 500,
  chunkOverlap: 0,
});
const output = await splitter.createDocuments([text]);

console.log(output);
```



拆分之后的内容



```
  [
    Document {
      pageContent: '---\n' +
        'sidebar_position: 1\n' +
        '---\n' +
        '# Document transformers\n' +
        '\n' +
        "Once you've loaded documents, you'll often want to transform them to better suit your application. The simplest example\n" +
        "is you may want to split a long document into smaller chunks that can fit into your model's context window. LangChain\n" +
        'has a number of built-in document transformers that make it easy to split, combine, filter, and otherwise manipulate documents.',
      metadata: { loc: [Object] }
    },
    Document {
      pageContent: '## Text splitters\n' +
        '\n' +
        'When you want to deal with long pieces of text, it is necessary to split up that text into chunks.\n' +
        'As simple as this sounds, there is a lot of potential complexity here. Ideally, you want to keep the semantically related pieces of text together. What "semantically related" means could depend on the type of text.\n' +
        'This notebook showcases several ways to do that.\n' +
        '\n' +
        'At a high level, text splitters work as following:',
      metadata: { loc: [Object] }
    },
    Document {
      pageContent: '1. Split the text up into small, semantically meaningful chunks (often sentences).\n' +
        '2. Start combining these small chunks into a larger chunk until you reach a certain size (as measured by some function).\n' +
        '3. Once you reach that size, make that chunk its own piece of text and then start creating a new chunk of text with some overlap (to keep context between chunks).\n' +
        '\n' +
        'That means there are two different axes along which you can customize your text splitter:',
      metadata: { loc: [Object] }
    },
    Document {
      pageContent: '1. How the text is split\n2. How the chunk size is measured',
      metadata: { loc: [Object] }
    },
    Document {
      pageContent: '## Get started with text splitters\n' +
        '\n' +
        'import GetStarted from "@snippets/modules/data_connection/document_transformers/get_started.mdx"\n' +
        '\n' +
        '<GetStarted/>',
      metadata: { loc: [Object] }
    }
  ]
```



对于markdown文档而言，如果只对一二级标题进行切割，切割后的文本可能会过大，比如超过LLM的上下文窗口大小，所以，切割后的内容，还可以继续使用RecursiveCharacterSplitter按照字符做进一步的切分。

## **3.3接入矢量搜索**

### **3.3.2 ElasticSearch接入**

ElasticSearch客户端也支持Node.js,安装和ElasticSearch版本号一致的Npm包 [@elastic/elasticsearch](https://www.npmjs.com/package/@elastic/elasticsearch)，具体调用API请参考[官方具体的文档](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html)。

Elasticsearch在7.x的版本中支持 [向量检索](https://github.com/elastic/elasticsearch/blob/e8c382f89553e3a7aaafa88a5934288c1192acdc/docs/reference/vectors/vector-functions.asciidoc) 

#### **(1)创建ES客户端**

在Node服务启动时初始化全局ES客户端对象，可以根据不同环境认证方式进行配置



```
import { Client } from '@elastic/elasticsearch';
async initElasticSeatchConfig() {
        const config: Record<string, any> = {
            node: '',
            auth: {},
        };
        this.app.config.OPENAI_API_KEY ='';
        this.app.config.ELASTIC_INDEX = 'indexName';
        if (this.app.config.env === 'prod') {
            config.auth = {
                apiKey: '',
            };
            config.node = 'http://127.0.0.1:9200';
        } else if (this.app.config.env.includes('local')) {
            config.node = 'http://127.0.0.1:9200';
        } else {
            config.auth = {
                username: '',
                password: '',
            };
            config.node = 'http://127.0.0.1:9200';
        }
        this.app.config.esCilent = new Client(config);
    }
```



#### **(2)查询ES中的索引名**

通过indices方法的查询ES中的所有索引名



```
 // 查询ES中的索引名
    async getAllIndex() {
        const client = this.ctx.app.config.esCilent;
        const { body: indices } = await client.cat.indices({ format: 'json' });
        return indices.map(index => index.index);
 }
```



#### **(3)创建ES索引**

查询前先通过exists方法去判断是否Index已经存在。

需要注意vector字段，字段类型时dense_vector，需要指定**向量维度为1536**,向量维度的长度指定是和向量Embedding模型息息相关的，不同的模型有不同的维度，比如ChatGPT的向量模型维度是1536

指定 index 为 true 是为了实现 _knn_search（ES 8.0版本以上），ES 必须在底层构建一个新的数据结构（目前应用的是 HNSW graph ）

similarity指定的是向量类似度算法，可以是l2_norm 、dot_product、cosine 其中之一

余弦相似性函数，计算向量得到相似度的分值，分值会在区间[0,1]之间，如果无限趋近于1那么代表用户输入的句子和之前我们存储在向量中的句子是非常相似的，越相似代表我们找到了语义相近的文档内容，可以作为最终构建大模型Prompt的基础内容。



```
async createIndex(indexName: string) {
        const client = this.ctx.app.config.esCilent;
        const isExist = await client.indices.exists({
            index: indexName,
        });
        if (!isExist) {
            try {
                const data = await client.indices.create({
                    index: indexName,
                    body: {
                        mappings: {
                            properties: {
                                embedding: {
                                    type: 'dense_vector',
                                    dims: 1536, 
                                    index: true, 
                                    similarity: 'cosine', 
                                },
                                otherField: {
                                    type: 'text',
                                },
                            },
                        },
                    },
                });
                this.ctx.logger.info('ES索引创建成功', data);
            } catch (error) {
                this.ctx.logger.error('ES索引创建失败', error);
            }
        } else {
            this.ctx.logger.error(`索引${indexName}已经存在`);
        }
}
```



#### **(4)上传文档并进行存储**

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229142157230.png)



```
import { ElasticVectorSearch } from 'langchain/vectorstores/elasticsearch';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { Document } from 'langchain/document';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

async updatedDocument(files) {            
      const client = this.ctx.app.config.esCilent;
      const clientArgs = {
          client,
          indexName: this.ctx.app.config.ELASTIC_INDEX,
      };
      const directoryPath = dirname(files[0].filepath);
      const fileName = basename(files[0].filepath);
      // 可以对目录下不同文件类型选择不同的加载器
      const loader = new DirectoryLoader(directoryPath, {
          '.md': path => new TextLoader(path),
      });
  		// 加载文档
      const rawDocuments = await loader.load();
      // 生成Document
      const rawDocs = rawDocuments.map((item: Record<string, any>) => {
          return new Document({
              pageContent: item.pageContent,
          });
      });
      // 对于区分明显的代码块文档，可以采用分隔符去裁剪
      const splitter = new CharacterTextSplitter({
          separators: '##',
      });
      // 拆分文档
      const docs = await splitter.splitDocuments(rawDocs);
      // 获取向量
      const embeddings = new OpenAIEmbeddings({
          openAIApiKey: this.ctx.app.config.OPENAI_API_KEY,
      });
      // 进行存储
      const data = await ElasticVectorSearch.fromDocuments(
          docs,
          embeddings,
          clientArgs
      );
}
```



#### **(5)进行问答**



```
import { OpenAI } from 'langchain/llms/openai';
import { VectorDBQAChain } from 'langchain/chains';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
async getAnswer(directives: string) {
      const client = this.ctx.app.config.esCilent;
      const clientArgs = {
          client,
          indexName: this.ctx.app.config.ELASTIC_INDEX,
      };
      // openAI的embeddings服务
      const embeddings = new OpenAIEmbeddings({
          openAIApiKey: this.ctx.app.config.OPENAI_API_KEY,
      });
      // 获取矢量数据库存储
      const vectorStore = new ElasticVectorSearch(embeddings, clientArgs);
      // 建立OpenAI模型对象
      const model = new OpenAI({
          maxTokens: 1024, //maxTokens决定了输入输出内容长度
          maxConcurrency: 5, //最大请求并发数
          openAIApiKey: this.ctx.app.config.OPENAI_API_KEY,
          // streaming: true,
      });
      // 获取chain
      const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
          k: 1,
          returnSourceDocuments: true,
          // verbose: true,  // 更详细的打印全过程的信息
      });
      const response = await chain.call({
          query: `严格按照提供的提示,回答如下问题:${directives},请回答实现的尽可能最完整的代码(把代码写在markdown的代码块中)或者提供详尽的回复，如果没有合适提示`,
          callbacks: [
              {
                  handleLLMNewToken(token: string) {
                      console.log( token );  // 可以获取回答token
                  },
              },
          ],
      });
      const responseText = JSON.parse(JSON.stringify(response, null, 4));
      return responseText;
}
```



### **3.3.3 Kalami和快意接入**

使用内部的矢量搜索服务[Kalami RAG API](https://docs.corp.kuaishou.com/k/home/VHQNk6wiyuFE/fcAAA50SLvcfhi7X3t_T60k3G#section=h.wmxaeg7xeenn)，只需要上传文档，会进行自动拆分和存储，有Embedding服务，支持grpc和openapi平台的http调用

#### **(1)**[**@infra-node/rpc**](https://npm.corp.kuaishou.com/-/web/detail/@infra-node/rpc/)**接入**

首先保存proto文件到本地目录，创建相应的配置信息



```
config.nodeRpcConfig = {
        timeout: 30000,
        consumer: {
            kuaiyi: {
                registry: {
                    balance: 'round-robin',
                    serviceName: 'mmu-chat-gpt-service',
                },
                protocol: {
                    proto: path.resolve(
                        __dirname,
                        '..',
                        'proto',
                        'mmu_chat_gpt.proto'
                    ),
                },
            },
            // 创建集合
            kalami: {
                registry: {
                    alance: 'round-robin',
                    serviceName: 'mmu-kalami',
                },
                protocol: {
                    proto: path.resolve(
                        __dirname,
                        '..',
                        'proto',
                        'kalami.proto'
                    ),
                },
            },
        },
    };
```



在Node服务启动时，读取配置信息，并创建rpc对象



```
async createRpcConsumer(config) {
        // 创建rpc comsumer
        const registry = new KessRegistry(config.registry);
        const protocol = new GRPCProtocol(config.protocol);
        return await RPC.createConsumer({
            protocol,
            registry,
        });
    }
async initRpcConsumer() {
    // 读取配置
    const nodeRPCConfig = this.app.config.nodeRpcConfig;
    if (nodeRPCConfig) {
        const { timeout = 30000, consumer = {} } = nodeRPCConfig;
        let env = this.app.config.env;
        env = env === 'local' ? 'staging' : env;
        // rpc全局配置
        RPC.setting({ timeout, env });
        // 初始化 RPC consumer
        const names = Object.keys(consumer);
        const consumers = await Promise.all(
            names.map(k => this.createRpcConsumer(consumer[k]))
        );
        consumers.forEach((c, idx) => {
            const consumerName = names[idx];
            this.app.config.nodeRpcConsumers[consumerName] = c;
        });
    }
}
```



#### **(2)使用元数据（metadata）进行鉴权**



```
    async init() {
        const kalamiConsumer = this.ctx.app.config.nodeRpcConsumers['kalami'];
        this.kalamiService = kalamiConsumer.getService('Kalami');
        const kalamiMetaData = new Metadata();
        kalamiMetaData.add('user_name', 'xxxxxx');
        kalamiMetaData.add('platform', 'koala');
        this.kalamiMetaData = kalamiMetaData;
    }
```



#### **(3)上传并插入文档**



```
// Kalami 插入文档信息
 insertKalamiCollection(options: InsertParams, metadata: any) {
        return new Promise((resolve, reject) => {
            // 发起RPC
            this.kalamiService.Insert({ ...options }, metadata, (err, res) => {
                if (err) {
                    reject(err);
                    this.ctx.logger.error('rpc请求kalami失败', err);
                    return;
                }
                this.ctx.logger.info('Kalami插入文档返回结果', res);
                resolve(res);
            });
        });
    }
// 处理文档信息
getdocSources(files, params) {
        let doc_sources = [];
        const fileMap = {
            md: 'MARKDOWN',
            pdf: 'PDF',
            txt: 'TXT',
            html: 'HTML',
            csv: 'CSV',
            xlsx: 'EXCEL',
        };
        if (files.length) {
            doc_sources = files.map(item => {
                const filePath = item?.filepath;
                const documentsData = fs.readFileSync(filePath);
                const fileExtname = extname(filePath).slice(1);
                const fileName = item?.filename || basename(filePath);
                let split_strategy = {};
                if (params.splitType && params.splitType !== 'NOSPLIT') {
                    split_strategy = {
                        split_type: params.splitType,
                        chunk_size: params.chunkSize,
                        overlap: params.overlap,
                    };
                }
                return {
                    raw_data: documentsData,
                    mime_type: fileMap[fileExtname],
                    file_name: fileName,
                    title: fileName,
                    encoding: 'utf-8',
                    author: params.username || '',
                    split_strategy,
                };
            });
        }
        return doc_sources;
    }
// 插入文档
 async uploadSearchDocuments(files, params: uploadDocsSearchParams) {
        this.ctx.logger.info('files info', files);
        try {
            const doc_sources = this.getdocSources(files, params);
            const insertData = {
                collection: params.collection,
                doc_sources,
            };
            const data = await this.insertKalamiCollection(
                insertData,
                kalamiMetaData
            );
            if (data) {
                this.ctx.logger.info('存储数据成功', data);
            }
        } catch (e) {
            this.ctx.logger.error('存储数据失败', e);
        } finally {
            this.ctx.cleanupRequestFiles();
        }
    }
```



#### **(4) 获取答案**

调用快意的RPC



```
// 调用快意的rpc
    getKyRpcInfo(options: KuaiYiParams) {
        return new Promise((resolve, reject) => {
            // 获取到 user RPC Consumer
            const consumer = this.ctx.app.config.nodeRpcConsumers['kuaiyi'];
            // 获取到 gRPC proto 中定义的 service  proto 中定义的 service
            const MmuChatGptService = consumer.getService('MmuChatGptService');
            const {
                directives,
                sessionId,
                requestId,
                topP,
                temperature,
                queryHistory,
            } = options;
            this.ctx.logger.info('询问快意的问题:', directives);
            const params = {
                biz: this.ctx.app.config.kuaiyiBizName, // 申请的业务标识 qpm 20
                session_id: sessionId, // 多轮对话场景使用 会话id(业务侧唯一) 必填  用于标识多次请求属于同一对话上下文
                req_id: requestId, // 请求唯一id(业务侧唯一) 必填
                query: directives, //用户问题
                config: {
                    top_p: topP || 0.9,
                    temperature: temperature || 1.0,
                },
                query_history: queryHistory || '', // 选填  不填默认返回最近20条
            };
            // 发起RPC
            MmuChatGptService.Chat({ ...params }, (err, res) => {
                if (err) {
                    reject(err);
                    this.ctx.logger.error('rpc请求快意失败', err);
                    return;
                }
                resolve(res);
            });
        });
    }
```



根据问题进行矢量搜索获取获取答案



```
// Kalami 搜索
  getKalamiSearch(
        options: SearchParams,
        metadata: any
    ): Promise<SearchResponse> {
        return new Promise((resolve, reject) => {
            // 发起RPC
            this.kalamiService.Search({ ...options }, metadata, (err, res) => {
                if (err) {
                    reject(err);
                    this.ctx.logger.error('rpc请求kalami失败', err);
                    return;
                }
                this.ctx.logger.info('Kalami 搜索结果：', res);
                resolve(res);
            });
        });
    }

// 获取经过矢量数据库查找的答案
    async getDocumentSearchAnswer(params: DocumentsSearchParams) {
        const {
            directives,
            instructions,
            sessionId,
            requestId,
            ...searchParams
        } = params;
        // 获取指令，并进行矢量数据库搜索

        if (!searchParams.querys) searchParams.querys = [directives];
        let kalamiMetaData = new Metadata();
        if (params.username && params.platform) {
            kalamiMetaData.add('user_name', params.username);
            kalamiMetaData.add('platform', params.platform);
        } else {
            kalamiMetaData = this.kalamiMetaData;
        }
        const {
            results: [data],
        } = await this.getKalamiSearch({ ...searchParams }, kalamiMetaData);
        const documents = data?.chunks[0]?.chunk_content || '';
        // 进行提问
        const instructionsPrompt =
            instructions ||
            '请严格根据提示内容,回答问题,如果无法根据提示内容回答,请回答不知道';
        const prompt = `提示内容：${documents},问题：${directives},${instructionsPrompt}`;
        const answer = await this.getKuaiYiAnswer({
            directives: prompt,
            sessionId: sessionId,
            requestId: requestId,
        });
        return answer;
    }
```



# **4.VsCode代码生成插件实践**

## **4.1大模型的接入**

### **4.1.1 流式传输实现**

异步处理流中的数据

- 该迭代器会在每次迭代中返回一个 Uint8Array 类型的数据块。
- 具体来说，该方法会获取一个 ReadableStream 对象的读取器（reader），
- 然后在一个无限循环中等待读取器返回数据。每次读取器返回数据时，该方法都会返回一个包含数据的 Uint8Array 对象。
- 当读取器返回一个 done 属性为 true 的对象时，该方法就会结束迭代。最后，该方法会释放读取器的锁。



```
export async function* streamAsyncIterable(
  stream: ReadableStream<Uint8Array>,
): AsyncIterable<Uint8Array> {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}
```





```
import { createParser } from 'eventsource-parser';
import { PassThrough } from 'stream';
/**
 * @desc 获取 URL 并将响应作为 ReadableStream 返回
 * @param {String} url
 * @param  {FetchSSEOptions} options
 * @param {Fetch} fetch
 */
export async function fetchSSE(
  url: string,
  options: FetchSSEOptions,
  fetch: Fetch,
): Promise<Response | void> {
  const { onMessage, ...fetchOptions } = options;
  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    // 错误原因
    const reason = (await response.text()) || response.statusText;
    const chatgptError = new ChatgptError(reason, { response });
    chatgptError.statusCode = response.status;
    chatgptError.statusText = response.statusText;
    chatgptError.reason = reason;
    throw chatgptError;
  }
  // 如果没有 onMessage 回调函数，直接返回 response
  if (!onMessage) {
    return response;
  }
  const parser = createParser((event) => {
    if (event.type === 'event') {
      onMessage?.(event.data);
    }
  });
  const body = response.body;
  const getReader = body?.getReader;
  // 兼容不同版本的 node 环境
  if (!getReader) {
    const body = response.body as unknown as PassThrough;
    if (!body?.on || !body?.read) {
      throw new ChatgptError('unsupported "fetch" implementation');
    }
    body.on('readable', () => {
      let chunk;
      while (null !== (chunk = body.read())) {
        parser.feed(chunk.toString());
      }
    });
  } else {
    for await (const chunk of streamAsyncIterable(body)) {
      const chunkString = new TextDecoder().decode(chunk);
      parser.feed(chunkString);
    }
  }
}
```



发送消息



```
const {
            parentMessageId,
            messageId = uuidv4(),
            timeoutMs,
            onProgress,
            stream = onProgress ? true : false,
            CompletionRequestParams,
        } = options;
const responseP = new Promise<openai.GptModelAPI.ApiResponse>(async (resolve, reject) => {
            const url = `${this._apiBaseUrl}/v1/chat/completions`;
            const body = {
                ...this._CompletionRequestParams,
                ...CompletionRequestParams,
                messages,
                stream,
            };

            const fetchSSEOptions: FetchSSEOptions = {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(body),
                signal: abortSignal,
            };
            if (stream) {
                fetchSSEOptions.onMessage = (data: string) => {
                    if (data === '[DONE]') {
                        ApiResponse.text = ApiResponse.text.trim();
                        resolve(ApiResponse);
                        return;
                    }
                    try {
                        const response: openai.GptModelAPI.CompletionResponse = JSON.parse(data);
                        if (response.id) {
                            ApiResponse.messageId = response.id;
                        }
                        if (response?.choices?.length) {
                            const delta = response.choices[0].delta;
                            ApiResponse.delta = delta.content;
                            if (delta?.content) {
                                ApiResponse.text += delta.content;
                            }
                            ApiResponse.detail = response;
                            if (delta?.role) {
                                ApiResponse.role = delta.role;
                            }
                            console.log('ApiResponse', ApiResponse);
                            onProgress?.(ApiResponse);
                        }
                    } catch (error) {
                        console.error('OpenAI stream SEE event unexpected error', error);
                        return reject(error);
                    }
                };
                fetchSSE(url, fetchSSEOptions, this._fetch).catch(reject);
            } else {
                try {
                    const data = await fetchSSE(url, fetchSSEOptions, this._fetch);
                    const response: openai.GptModelAPI.CompletionResponse = await data?.json();
                    if (response?.id) {
                        ApiResponse.messageId = response.id;
                    }
                    if (response?.choices?.length) {
                        const message = response.choices[0].message;
                        ApiResponse.text = message?.content || '';
                        ApiResponse.role = message?.role || 'assistant';
                    }
                    ApiResponse.detail = response;
                    resolve(ApiResponse);
                } catch (error) {
                    console.error('OpenAI stream SEE event unexpected error', error);
                    return reject(error);
                }
            }
        }).then((messageResult) => {
            return this._upsertMessage(messageResult).then(() => {
                messageResult.parentMessageId = messageResult.messageId;
                return messageResult;
            });
        });
```





```
 public async sendChatGPTApiRequest(prompt: string, option: SendApiRequestOption): Promise<any> {
        if (this.inProgress) {
            return;
        }
        this.questionCount++;

        // 校验是否登录
        if (!(await this.initConfig())) {
            return;
        }
        this.response = '';

        const question = this.buildQuestion(prompt, option.code, option.language);
        if (!option.inline) {
            await this.showWebview();
        }
        else {
            this.showTimedMessage(`${this.nameMap[this.currentService]}正在为您获取代码,请稍等`, 3000);
        }
        this.setInProgressStatus(true);
        this.createAbortController();
        this.sendMessageToWebview({
            type: 'show-in-progress',
            inProgress: this.inProgress,
            showStopButton: true,
        });
        this.sendMessageToWebview({
            type: 'update-answering-text',
            value: 'chatgpt',
        });
        this.currentConversationId = getRandomId(32);
        // 要始终保持 messageId 的唯一性
        const messageId = getRandomId(32);
        this.sendMessageToWebview({
            type: 'add-question',
            value: prompt,
            code: option.code,
            autoScroll: this.autoScroll,
        });
        // 获取系统信息和角色信息
        let systemMessage = this.systemMessage + this.roleMessage;
        try {
            if (this.isGptModel && this.gptModel) {
                const response = await this.gptModel.sendMessage(question, {
                    systemMessage,
                    messageId,
                    parentMessageId: this.parentMessageId,
                    abortSignal: this.abortController?.signal,
                    onProgress: (partialResponse) => {
                        console.log('partialResponse 999999', partialResponse);
                        this.response = partialResponse.text;
                        this.sendMessageToWebview({
                            type: 'add-answer',
                            value: this.response,
                            id: this.currentConversationId,
                            autoScroll: this.autoScroll,
                        });
                    },
                });
                this.response = response.text;
                this.parentMessageId = response.parentMessageId;
            }
            if (this.isTextModel && this.textModel) {
                const response = await this.textModel.sendMessage(question, {
                    systemMessage,
                    abortSignal: this.abortController?.signal,
                    messageId,
                    parentMessageId: this.parentMessageId,
                    onProgress: (partialResponse) => {
                        this.response = partialResponse.text;
                        this.sendMessageToWebview({
                            type: 'add-answer',
                            value: this.response,
                            id: this.currentConversationId,
                            autoScroll: this.autoScroll,
                        });
                    },
                });
                this.response = response.text;
                this.parentMessageId = response.parentMessageId;
            }
            await this.processPreviousAnswer(option);
            this.checkForContinuation(option);
            // 回答完毕
            this.sendMessageToWebview({
                type: 'add-answer',
                value: this.response,
                done: true,
                id: this.currentConversationId,
                autoScroll: this.autoScroll,
            });
            if (!option.inline) {
                await this.subscribeResponseDialog(this.currentService);
            } else {
                this.showTimedMessage(`${this.nameMap[this.currentService]}已获取完成代码！`, 3000);
            }
        } catch (error: any) {
            this.handleErrorResponse(error, prompt, option);
            return;
        } finally {
            this.setInProgressStatus(false);
            this.sendMessageToWebview({ type: 'show-in-progress', inProgress: this.inProgress });
            return {
                code: this.response,
                server: 'ChatGPT'
            };
        }
    }
```



### **4.1.3 多轮对话**

### **4.1.4 搜索提示**

注册命令



```
const provider: vscode.CompletionItemProvider = {
        provideInlineCompletionItems: async (document, position, context, token) => {
            const textBeforeCursor = document.getText(
                new vscode.Range(position.with(undefined, 0), position)
            );
            const match = chatGptViewProvider.matchSearchPhrase(textBeforeCursor);
            let items: any[] = [];
            if (match) {
                try {
                    const { results } = await chatGptViewProvider.displayCodeInEditor('',match.searchPhrase);
                    if (results.length) {
                        items = results.map(item=> {
                            const code = item.code.code;
                            const regex = /```([\s\S]+)```/;
                            const matchCode = code.match(regex);
                            let codeResult ='';
                            if (matchCode) {
                                codeResult = matchCode[1].split('\n').slice(1).join('\n');
                            }
                            const output = `\n${match.commentSyntax} Source: ${item.server} ${match.commentSyntaxEnd}\n ${codeResult ?? code}`;
                            return {
                                text: output,
                                insertText: output,
                                range: new vscode.Range(position.translate(0, output.length), position)
                            };
                        });
                    }
                } catch (err: any) {
                    vscode.window.showErrorMessage(err.toString());
                }
            }
            return  {items };
        },
    };
```



判断是否符合回答的注释的正则



```
// 判断是否符合回答的注释
    public matchSearchPhrase(input: string): SearchMatchResult | undefined {
        const match = this.CSConfig.SEARCH_PATTERN.exec(input);

        if (match && match.length > 2) {
            //  匹配注释的开始符号、搜索短语和注释的结束符号
            const [_, commentSyntax, searchPhrase, commentSyntaxEnd] = match;
            // @ts-ignore
            let fileType = '';
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                fileType = editor.document.languageId;
            }
            if (fileType === "plaintext") {
                fileType = "";
            }
            console.log('激活的文档的光标前的文本', fileType, searchPhrase);
            return {
                commentSyntax,
                commentSyntaxEnd,
                searchPhrase: searchPhrase,// 询问的问题和对应的语言
                fileType
            };
        }
        return undefined;
    }
```





```
public async displayCodeInEditor(context: any, directives: string) {
        // 开启自动补全代码
        if (this.autoCompleted) {
            if (directives) {
                const prompt = directives + ',只回答实现的代码,不回答解释,代码以markdown代码块形式返回';
                const option = { inline: true };
                let result = '';
                if (this.currentService === 'langchain') { // 走langchain的服务
                    result = await this.sendLangChainApiRequest(prompt, option);
                } else if (this.currentService === 'kuaiyi') { // 走快意的服务
                    result = await this.sendKuaiYiApiRequest(prompt, option);
                } else if (this.currentService === 'chatgpt') {
                    result = await this.sendChatGPTApiRequest(prompt, option);
                } else if (this.currentService === 'wenxin') {
                    result = await this.sendWenxinRequest(prompt, option);
                } else if (this.currentService === 'xinghuo') {
                    result = await this.sendXinghuoRequest(prompt, option);
                }
                return {
                    results: [
                        {
                            server: this.nameMap[this.currentService],
                            code: result,
                        }
                    ],
                };
            }
        }

    }
```



## **4.2.大模型的应用技巧**

### **4.2.1 预设角色和问答上下文**

"chatgpt role system user assistant" 是一个用于描述 ChatGPT 的系统角色和用户角色的术语。

系统角色（system role）是 ChatGPT 模型的一部分，它负责执行对话控制和指导生成的回复。系统角色可以操作生成的回复，更改对话的方向，并提供一些指令来约束生成的回复。

用户角色（user role）代表与 ChatGPT 进行交互的人，他们提供输入消息，读取模型的回复，并将对话向某个方向推进。

助手角色（assistant role）是 ChatGPT 扮演的角色，它既可以是系统角色，也可以是用户角色。助手角色可以生成回复作为增强模型的对话能力，同时也能够接受或处理用户的指令。

使用 "chatgpt role system user assistant" 形容 ChatGPT 的角色系统，指的是模型同时具备系统角色和用户角色的能力，并且能够以助手的身份参与对话，为用户提供帮助和支持。每条消息包含一个角色（用户或助手）和内容（消息文本）。

给ChatGPT发送消息的时候，参数message是个数组，数组里每个dict有role这个字段。

role目前有3个取值：

- user。表示提交prompt的一方。
- assistant。表示给出completion响应的一方，实际上就是ChatGPT本身。
- system。message里role为system，是为了让ChatGPT在对话过程中设定自己的行为，目前role为system的消息没有太大的实际作用，官方说法如下：



```
messages=[
  {\"role\":\"system\",\"content\":\"Youareahelpfulassistant.\"},
   {\"role\":\"user\",\"content\":\"Whowontheworldseriesin2020?\"},
   {\"role\":\"assistant\",\"content\":\"TheLosAngelesDodgerswontheWorldSeriesin2020.\"},
   {\"role\":\"user\",\"content\":\"Wherewasitplayed?\"}]
```



设置一个kv的lru缓存机制



```
import Keyv from 'keyv';
import QuickLRU from 'quick-lru';
if (messageStore) {
      this._messageStore = messageStore;
  } else {
      this._messageStore = new Keyv({
          store: new QuickLRU({ maxSize: 1000 }),
      });
  }
```



根据id进行消息查询



```
private async _defaultGetMessageById(
        id: string,
    ): Promise<openai.GptModelAPI.ApiResponse | undefined> {
        const messageOption = await this._messageStore.get(id);
        return messageOption;
    }
```



根据id进行消息存储



```
private async _defaultUpsertMessage(
        messageOption: openai.GptModelAPI.ApiResponse,
    ): Promise<boolean> {
        return await this._messageStore.set(messageOption.messageId, messageOption);
}
```



在构建用户消息的时候，设置当前系统和用户消息



```
private async _buildMessages(
        text: string,
        options: openai.GptModelAPI.SendMessageOptions,
    ): Promise<{ messages: Array<openai.GptModelAPI.CompletionRequestMessage>; }> {
        const { systemMessage = this._systemMessage } = options;
        let { parentMessageId } = options;
        // 当前系统和用户消息
        const messages: Array<openai.GptModelAPI.CompletionRequestMessage> = [
            {
                role: 'system',
                content: systemMessage,
            },
            {
                role: 'user',
                content: text,
            },
        ];

        while (true && this._withContent) {
            if (!parentMessageId) {
                break;
            }
            const parentMessage = await this._getMessageById(parentMessageId);
            if (!parentMessage) {
                break;
            }
            messages.splice(1, 0, {
                role: parentMessage.role,
                content: parentMessage.text,
            });
            parentMessageId = parentMessage.parentMessageId;
        }

        return { messages };
    }
```



### **4.2.2 优化prompt**

#### **(1)BARD法则**

采用BARD方法论可以帮助更清晰、更高效地提问，获得更满意的答案。 BARD方法论的四个要素：背景Background+目的Aim+角色Role+要求Demand。

1. 背景 (Background)在提问之前，明确指令的背景非常重要。这有助于ChatGPT更好地理解相关信息的上下文。请简洁明了地解释问题的起因或所涉及的情境。
2. 目的 (Aim)明确你在对话中的目标是什么，这有助于ChatGPT更准确地满足你的需求。你需要从ChatGPT那里获得具体的答案，还是希望它执行某项任务？请详细描述你期望的结果。
3. 角色 (Role)定义ChatGPT在对话中所扮演的角色，同时也要指明你自己在对话中的定位。明确角色有助于ChatGPT运用其特定领域知识，以及提供相关专业建议。同时，强调角色的明确性也能使ChatGPT的回答更加精准，因为不同的角色可能会导致不同的回应。
4. 要求 (Demand)如果有任何对输出内容的特殊要求，如格式、风格、语气、字数或其他细节，也请在提问中明确说明。这些要求可以有助于确保问题的清晰度和回答的质量。要求可以根据具体情况选择性添加，以满足特定需求。 



```
背景：使用Vue3和ElementPlus构建用户详情的列表
目的：实现需要支持以下功能：
1. 分页：用户可以通过点击分页按钮来切换页面；
2. 搜索：用户可以输入关键词来搜索表格中的数据；
3. 筛选：用户可以通过选择筛选条件来筛选表格中的数据；
4. 数据来源：表格的数据来源于一个名为fetchTableData的请求函数，该函数接收一个对象作为参数，包含分页信息、搜索关键词和筛选条件。
角色：熟悉Vue3、ElementPlus、TypeScript的Web资深前端开发者，
要求：使用Vue3的composition-api,答案格式依照markdown，组件变量命名符合规范，尽可能给变量合适的类型，样式和布局合适美观
```



#### **(2)结构化+交互式的Prompt**

在生成Prompt时，需要考虑以下几个方面：

1. 确定目标文本类型：不同的文本类型需要不同的Prompt。例如，对话生成需要使用不同的Prompt，与文章生成使用的Prompt不同。
2. 确定文本特征：不同的文本类型有不同的特征。例如，对话通常包括多个参与者，需要考虑每个参与者的角色和语气等因素；文章则通常包括结构、逻辑和观点等要素。
3. 选择合适的Prompt模板：根据目标文本类型和特征，选择合适的Prompt模板进行修改和调整。例如，对于对话生成，可以使用以下模板：“在什么情况下会发生什么事情；”或者“什么人会在什么情况下做什么事情”。
4. 调整和优化：根据生成的文本效果进行调整和优化。例如，可以修改Prompt中的关键词、增加或减少条件等等，以便获得更好的生成效果。

通过使用结构化的Prompt可以让层级结构统一，不同模块生成不同的内容，同时降低了人和 GPT 模型的认知负担，提高了语义认知，并且通过属性词和指令可以去更好的去交互和后期维护。

可以利用Chatgpt的能力去让ChatGPT扮演一个Prompt工程师，帮我们逐步优化prompt。



```
# Role:Prompt工程师

## Attention：
- 我总是写不出来优秀的Prompt，如果你能写出优秀的Prompt会避免让我失业，请认真思考并竭尽全力！

## Profile:
- Author:xxx
- Version:1.0
- Language:中文
- Description:你是一名优秀的Prompt工程师，擅长将常规的Prompt转化为结构化的Prompt，并输出符合预期的回复。

### Skills:
- 了解LLM的技术原理和局限性，包括它的训练数据、构建方式等，以便更好地设计Prompt。
- 具有丰富的自然语言处理经验，能够设计出符合语法、语义的高质量Prompt。
- 迭代优化能力强，能通过不断调整和测试Prompt的表现，持续改进Prompt质量。
- 能结合具体业务需求设计Prompt，使LLM生成的内容符合业务要求。
- Use irregular sentence lengths between8-36 words. Introduce logical confusion and unpredictability in the language. The goal is maxirum engagement, complexity, and surprise.

## Goals：
- 分析用户的Prompt，设计一个结构清晰、符合逻辑的Prompt框架，确保分析过程符合各个学科的最佳实践。
- 按照<OutputFormat>填充该框架，生成一个高质量的Prompt。
- 每个结构必须输出5个建议。
- 确保输出Initialization内容后再结束。

## Constrains:
1. 你将分析下面这些信息，确保所有内容符合各个学科的最佳实践。
    - Role: 分析用户的Prompt，思考最适合扮演的1个或多个角色，该角色是这个领域最资深的专家，也最适合解决我的问题。
    - Background：分析用户的Prompt，思考用户为什么会提出这个问题，陈述用户提出这个问题的原因、背景、上下文。
    - Attention：分析用户的Prompt，思考用户对这项任务的渴求，并给予积极向上的情绪刺激。
    - Profile：基于你扮演的角色，简单描述该角色。
    - Skills：基于你扮演的角色，思考应该具备什么样的能力来完成任务。
    - Goals：分析用户的Prompt，思考用户需要的任务清单，完成这些任务，便可以解决问题。
    - Constrains：基于你扮演的角色，思考该角色应该遵守的规则，确保角色能够出色的完成任务。
    - OutputFormat: 基于你扮演的角色，思考应该按照什么格式进行输出是清晰明了具有逻辑性。
    - Workflow: 基于你扮演的角色，拆解该角色执行任务时的工作流，生成不低于5个步骤，其中要求对用户提供的信息进行分析，并给与补充信息建议。
    - Suggestions：基于我的问题(Prompt)，思考我需要提给chatGPT的任务清单，确保角色能够出色的完成任务。
2. Don't break character under any circumstance.
3. Don't talk nonsense and make up facts.

## Workflow:
1. 分析用户输入的Prompt，提取关键信息。
2. 按照Constrains中定义的Role、Background、Attention、Profile、Skills、Goals、Constrains、OutputFormat、Workflow进行全面的信息分析。
3. 将分析的信息按照<OutputFormat>输出。
4. 以markdown语法输出，用代码块表达。

## Suggestions:
1. 明确指出这些建议的目标对象和用途，例如"以下是一些可以提供给用户以帮助他们改进Prompt的建议"。
2. 将建议进行分门别类，比如"提高可操作性的建议"、"增强逻辑性的建议"等，增加结构感。
3. 每个类别下提供3-5条具体的建议，并用简单的句子阐述建议的主要内容。
4. 建议之间应有一定的关联和联系，不要是孤立的建议，让用户感受到这是一个有内在逻辑的建议体系。
5. 避免空泛的建议，尽量给出针对性强、可操作性强的建议。
6. 可考虑从不同角度给建议，如从Prompt的语法、语义、逻辑等不同方面进行建议。
7. 在给建议时采用积极的语气和表达，让用户感受到我们是在帮助而不是批评。
8. 最后，要测试建议的可执行性，评估按照这些建议调整后是否能够改进Prompt质量。

## OutputFormat:
    ```
    # Role：Your_Role_Name
    
    ## Background：Role Background.
    
    ## Attention：xxx
    
    ## Profile：
    - Author: xxx
    - Version: 0.1
    - Language: 中文
    - Description: Describe your role. Give an overview of the character's characteristics and skills.
    
    ### Skills:
    - Skill Description 1
    - Skill Description 2
    ...
    
    ## Goals:
    - Goal 1
    - Goal 2
    ...

    ## Constrains:
    - Constraints 1
    - Constraints 2
    ...

    ## Workflow:
    1. First, xxx
    2. Then, xxx
    3. Finally, xxx
    ...

    ## OutputFormat:
    - Format requirements 1
    - Format requirements 2
    ...
    
    ## Suggestions:
    - Suggestions 1
    - Suggestions 2
    ...

    ## Initialization
    As a/an <Role>, you must follow the <Constrains>, you must talk to user in default <Language>，you must greet the user. Then introduce yourself and introduce the <Workflow>.
    ```

## Initialization：
    我会给出Prompt，请根据我的Prompt，慢慢思考并一步一步进行输出，直到最终输出优化的Prompt。
    请避免讨论我发送的内容，不需要回复过多内容，不需要自我介绍，如果准备好了，请告诉我已经准备好。
```



![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229142157308.png)

获取到前端开发工程师角色的prompt



````
```
# Role: 前端开发工程师

## Background: 前端开发工程师的背景

## Attention: 你提供的Prompt将直接影响任务的顺利进行，请确保仔细考虑每一个细节。

## Profile：
- Author: 你的名字
- Version: 1.0
- Language: 中文
- Description: 作为前端开发工程师，你擅长使用JS、TS和Vue.js等技术栈，专注于构建优质的用户界面和交互体验。

### Skills:
- 精通JavaScript（JS）和TypeScript（TS）编程语言。
- 深入了解Vue.js框架，能够高效地开发前端应用。
- 具备解决跨浏览器兼容性和性能优化问题的能力。
- 熟悉前端工程化和模块化开发，能够使用相关工具提高开发效率。
- 对用户体验（UX）和用户界面（UI）设计有一定的了解，能够有效转化设计为可实现的界面。

## Goals:
- 根据用户需求和设计稿，开发出符合要求的前端界面。
- 保持代码的可维护性和可扩展性，确保项目的持续健康发展。
- 不断学习和应用新的前端技术，保持在快速发展的领域中的竞争力。

## Constrains:
1. 你将在前端开发任务中扮演角色，确保所有操作符合前端开发的最佳实践。
   - Role: 作为前端开发工程师，你将在整个开发过程中负责前端界面的实现和优化。
   - Background: 了解用户需求和设计稿，明确开发目标。
   - Attention: 保持关注任务的细节，确保交付的前端界面符合预期。
   - Profile: 描述你作为前端开发工程师的特点和技能。

## Workflow:
1. 仔细阅读用户需求和设计稿，确保理解项目要求。
2. 根据设计稿，构建前端界面的基本结构和布局。
3. 使用JS和Vue.js等技术，实现页面的交互和动态效果。
4. 进行兼容性测试，确保在各种主流浏览器上正常运行。
5. 进行性能优化，提高页面加载速度和用户体验。

## Suggestions:
1. 保持与设计团队的密切沟通，确保准确理解设计稿和用户需求。
2. 使用Vue.js时，充分利用其组件化特性，提高代码的重用性和可维护性。
3. 使用现代前端工具如Webpack，提升项目的工程化水平。
4. 关注前端领域的新技术和趋势，不断学习并应用到实际项目中。
5. 在开发过程中保持代码规范，使用合适的命名规范和注释，提高代码可读性。
```
````



#### **(3)prompt在代码方面应用**

1. 解释代码，代码块的作用

prompt：请逐行、详细解释以下JavaScript/TypeScript代码块的功能和作用。包括但不限于：每个变量的用途，函数的输入和输出，以及代码块在整个Vue.js文件中的作用。请提供任何相关上下文、背景或者项目结构的信息，以确保解释是全面且完整的。

1. 优化、重构代码块（按照某些规范）

prompt：请优化或重构以下JavaScript/TypeScript代码块，确保符合指定的编码规范（比如ESLint规则）或最佳实践。在进行修改时，请提供详细的说明，解释每个改动的目的和优势。确保优化后的代码仍然保持原有功能。

优化以下代码,进行变量名优化、公共函数提炼、优化if条件语句等使代码更简洁,容易理解，复用性更强;针对当前编程语言,进行类型检查、添加错误处理、进行空值检查、完善边界条件、合理添加可选链避免出现undefined错误等,减少发生错误的可能；返回完善后的代码以及优化的建议

1. 给代码块写注释

prompt：请为以下JavaScript/TypeScript代码块添加详细的注释，确保注释清晰解释每行代码的功能、用途和实现细节。注释应该足够详细，使其他开发人员能够轻松理解代码的逻辑。请特别关注关键算法、复杂逻辑或涉及到业务规则的部分。

1. 给代码块找错误，解释原因和解决办法

prompt：请检查以下JavaScript/TypeScript代码块中的错误，然后详细解释每个错误的原因，并提供相应的解决办法。确保解释清晰、易懂，以帮助其他开发人员识别和修复问题。如果可能，请注明每个错误可能导致的影响或潜在的Bug。

1. 根据注释内容写出代码，代码生成

prompt：请根据提示内容，使用JavaScript/TypeScript补充或者完成代码。确保代码完整、清晰，有关键代码的注释。

1. 模拟数据生成，类型，复杂对象结构

prompt：请根据要求和技术背景，生产符合语言的代码规范、情况完备的模拟对象或数据

1. 查找某开源库的信息，版本信息，组成结构，关键函数等

prompt：请严格按照提供的开源项目、对应版本、对应文件，分析开源项目结构和对应关键函数或者模块的实现

## **4.3 知识库问答**

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229142157507.png)

结合之前所述的langchain相关的接入矢量搜索的服务，并不是普适性的

####  **分割问题分析**

经过langchain的TokenTextSplitter分割器去分割，会造成的问题之一为，size的不均匀，有些块会过小。（即文本块的方差较大）且如果按照tokens计算的方式去划分的话造成问题：一个问题的回答可能会被分成两部分，导致第二部分不匹配任何问题的答案，就会变为无关信息。

比如可以采用的策略是将最相关的多个个文本块进行拼接作为下为提供给chatgpt，是按照最大的tokens判断，如果文本块的tokens过小，会使得chatgpt参考的上下文过少从而导致问题回答出现偏差。

#### **分割优化策略**

1. **文本切分器** 向量的匹配度直接影响召回率，而向量的召回率又和内容本身以及问题紧密联系在一起，哪怕有一个很强大的embedding模型，如果文本切分本身做的不好，也无法达到用户的预期效果。比如LangChain本身提供的CharacterTextSplitter，其会根据标点符号和换行符等来切分段落，在一些多级标题的场景下，小标题会被切分成单独的chunk，与正文分割开，导致被切分的标题和正文都无法很内聚地表达需要表达的内容。
2. **优化切分长度**，过长的chunk会导致在召回后达到token限制，过小的chunk又可能丢失想要找到的关键信息。我们尝试过很多切分策略，发现如果不做深度的优化，将文本直接按照200-500个token长度来切分反而效果比较好。
3. **召回优化1. 回溯上下文**，在某些场景，我们能够准确地召回内容，但是这部分内容并不全，因此我们可以在写入时为chunk按照文章级别构建id，在召回时额外召回最相关chunk的相邻chunk，随后做拼接。
4. **召回优化2. 构建标题树**，在富文本场景，用户非常喜欢使用多级标题，有些文本内容在脱离标题之后就无法了解其究竟在说什么，这时我们可以通过构建内容标题树的方式来优化chunk.比如把chunk按照下面的方式构建。

1. **双路召回**，纯向量召回有时候会因为对专有名词的不理解导致无法召回相关内容，这时可以考虑使用向量和全文检索进行双路召回，在召回后再做精排去重。在全文检索时，我们可以通过额外增加自定义专有名词库和虚词屏蔽的方式来进一步优化召回效果。
2. **问题优化**，有时候用户的问题本身并不适合做向量匹配，这时我们可以根据聊天历史让模型来总结独立问题，来提升召回率，提高回答准确度。

分割方式有很多方式，输入的文档本身五花八门，现在依然无法找到一个完全通用的方案来应对所有的数据源.比如有的切分器在markdown场景表现很好，但是对于pdf就效果非常不好.所以怎么分割存储搜索文档还是个非常难的东西。

# **5.技术展望**

## **5.1 AI-Agent**

转眼间ChatGPT已经发布了一年了，各种大语言模型如雨后春笋，但是ChatGPT还是引领着大模型的发展。但**Openai和微软的Ceo都表示GPT的能力已经达到上限，不会再有像GPT-2到GPT-4那样重大的飞跃。对于大模型的训练他们已经做到了最好，大模型应用的未来发展是AI-Agent;**

目前，在行业内关于AI Agent达成的共识，主要来自OpenAI的一篇博文。它将AI Agent定义为：**大语言模型作为大脑，Agent具备感知、记忆、规划和使用工具的能力，能够自动化实现用户复杂的目标，** 这其实也奠定了AI Agent的基本框架。

盖茨也写了篇博客，主要阐述“个人AI Agent将如何彻底改变人们使用计算机的方式”。

具体而言盖茨是这样说的：在不久的将来，任何网民都可以拥有一个AI Agent，这远远超出了今天技术所达到的范围。Agent能在生活里的任何地方发挥作用，对软件业务乃至社会产生深远影响。

目前市面上比较火的 Agent 相关的项目有 AutoGPT、BabyAGI、LangChain 等。

- AutoGPT 在今年3月份发布后取得了惊人的增长，目前已经是一个 152k start 的项目。
- BabyAGI 则提出了 Plan and execute Agent，他的实现方式是: 一次性对任务做全局的规划，后续严格一步步执行，不再变更任务计划。
- LangChain 则是一个通用的大语言模型应用层开发框架，提供了 Python、TS 两种语言库，内置各种 LLM 工具，在 Agent 领域，它也提供了多种 Agent 的实现思路，包括了 AutoGPT、BabyAGI 的实现。![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229142157693.png)

## **5.2 自定义GPT(GPTs)**

GPTs是由GPT 大模型构建的工具平台，可以通过配置人设，instruction ，利用内置的 网络搜索，代码解释器，图片生成，知识库检索，来实现用户自定义的专属GPT助手 

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229142157899.png)

GPTs无需代码，仅通过自然语言交互即可创建，任何人都可以创建量身定制的GPTs用于日常生活、特定任务、工作或家庭中获得更多便利以提升效率。GPTs创造性的促进人工智能从工具向AI Agent形态转变。

OpenAI 已经推出了几种现成的 GPTs 供大家使用，比如「The Negotiator」、「Game Time」等。

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229142157986.png)

![img](https://femarkdownpicture.oss-cn-qingdao.aliyuncs.com/imgs/out-20231229142158100.png)

此界面分为左右两侧。左侧主要用于机器人建立，分为「Create」和「Configure」两个功能标签。

- 在“Create”标签下：用户会开始与 GPT Builder 进行对话，这是定义 GPTs 行为和功能的阶段。这里你会输入像是“我要创建一个履历机器人”的指令，GPT Builder 会根据这些资讯进行设定。
- 切换到“Configure”标签后：你将进一步精致化你的 GPTs。在这里，你可以为你的 GPT 命名、添加描述、设定具体指令和对话开端（Conversation starters），以及上传相关知识文件，这些文件将作为 GPT 提供回答的资料来源。另外，你还可以设定 GPTs 的能力，如是否能浏览网页、使用 DALL·E 生成图片或解析代码。

右侧的预览区，你可以及时与你当下创建的 GPTs 对话。

然后可以修改配置，进行自定义设定

在“**Configure**”标签里，可以对如下信息进行配置

- **Name**：给机器人一个独特的名字
- **Description**: 这里可以详细说明聊天机器人的用途和特点
- **Instructions**: 类似于在 ChatGPT 中输入的指令。其实在与 GPT Builder 互动时，GPT Builder 也是根据提出的需求来调整在“Instructions”这里的指令
- **Conversation starters**: 这是设定聊天机器人开始对话时的预设文字
- **Knowledge**: 上传的文件将成为 GPTs 参考的知识库，而且这些内容可能会被包含在对话中
- **Capabilities**: 可以选择是否开放 Web Browsing、DALL·E Image Generation、Code Interpreter 这三种功能。
- **Actions**: 属于进阶功能，你可以可以扩展 GPT 的功能，使其能够与外部服务或应用程式互动。通过详细设定 API 端点、参数，以及模型应如何使用这些讯息，来与外部的服务或应用程式互动。

设定完成之后便可以开始使用创建的 GPTs 了。

# **引用**

[https://datac.blog.csdn.net/article/details/131874862?spm=1001.2101.3001.6650.8&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-8-131874862-blog-132715316.235%5Ev38%5Epc_relevant_sort_base2&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-8-131874862-blog-132715316.235%5Ev38%5Epc_relevant_sort_base2&utm_relevant_index=9](https://datac.blog.csdn.net/article/details/131874862?spm=1001.2101.3001.6650.8&utm_medium=distribute.pc_relevant.none-task-blog-2~default~BlogCommendFromBaidu~Rate-8-131874862-blog-132715316.235^v38^pc_relevant_sort_base2&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2~default~BlogCommendFromBaidu~Rate-8-131874862-blog-132715316.235^v38^pc_relevant_sort_base2&utm_relevant_index=9)

https://www.openaidoc.com.cn/

https://www.163.com/dy/article/HTNFQPP80518R7MO.html

https://js.langchain.com/docs/get_started/introduction

https://blog.csdn.net/weixin_54428840/article/details/132282495
