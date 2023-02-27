# chatgpt 小程序demo

![RUNOOB 图标](demo.png)

## 使用前须知

目前微信机器人，各种 ChatGPT 第三方服务，都是使用 gpt3 API，而官网 chat.openai.com 上的 ChatGPT 则是 gpt3.5。第三方使用低版本的接口来对 OpenAI 发起请求，返回聊天数据，所以会感觉对话质量不如直接使用 ChatGPT 官网。

- 该项目使用小程序+云开发开发
- 需要apikey，需要首先注册openapi账号
- 同时支持官网api和gpt3 api

## 消息过长被中断

聊天的内容如果过长，ChatGPT 经常会将消息截断，这时你可以通过发送：继续，来让 ChatGPT 继续发送剩余内容。

## api说明

### chats1

用的官方api，需要api key,答案质量不如chats2

### chats2

用的代理，调用官网gpt3.5接口，需要accessToken，accessToken获取地址
https://chat.openai.com/api/auth/session






