// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')
const rp = require("request-promise");

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: 'your api key'
  
});


/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
  const openai = new OpenAIApi(configuration);
  const { question } = event
  console.log('question', question)
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: question,
    temperature: 0,
    max_tokens: 500,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    // stop: ["\n"],
  }, {
    timeout: 50000,
  });
  return {
    data: completion.data.choices[0].text
  }

  // const accessToken =
  //       'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJ3ZWkzLmd1b0BseS5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZ2VvaXBfY291bnRyeSI6IlVTIn0sImh0dHBzOi8vYXBpLm9wZW5haS5jb20vYXV0aCI6eyJ1c2VyX2lkIjoidXNlci1odzBXSjBnVVBLTmFOdU56VFZIaW1pRlUifSwiaXNzIjoiaHR0cHM6Ly9hdXRoMC5vcGVuYWkuY29tLyIsInN1YiI6ImF1dGgwfDYzZWQ4ZWZmM2I1MzI2MmE5Y2IyODA4MSIsImF1ZCI6WyJodHRwczovL2FwaS5vcGVuYWkuY29tL3YxIiwiaHR0cHM6Ly9vcGVuYWkub3BlbmFpLmF1dGgwYXBwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2NzY1MTM3MzEsImV4cCI6MTY3NzcyMzMzMSwiYXpwIjoiVGRKSWNiZTE2V29USHROOTVueXl3aDVFNHlPbzZJdEciLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIG1vZGVsLnJlYWQgbW9kZWwucmVxdWVzdCBvcmdhbml6YXRpb24ucmVhZCBvZmZsaW5lX2FjY2VzcyJ9.Zi9ZNR0kFfdRdz4Bu7whSz_lau_GfUJfQMCpZe4Up3e2588z7ThgHY_GRj3R58vSRcSpionJ9FRVj8Nx8S9ExKkKgvZJj5FxTFB0ApKESZ3gOBwZk0XwwGt2zdnE3XVcbVvUtIeRZgzOUvLiEBGLEKc01_n3gCRud2sS-m7uaqd07Lmrwz73enIudRMWuZf70Dq-uVk31xE-RcbcUOnakxqfOuOA6dr3LM0if2auQrWe1uC7w1MhkVb-yFjh03NOQ26h-WIqDzQby2hmjru8m4hrpIrJYhiEDXDbEwIPI-qSRnRpDRjiYWEl919R3KJsg8rra3rRaqtqsUB86ZzdZg'
  // const header = {
  //   'Content-Type': 'application/json',
  //   Authorization: `Bearer ${accessToken}`
  // }
  // const data = {
  //   action: 'next',
  //   messages: [
  //     {
  //       id: v4(),
  //       role: 'user',
  //       content: {
  //         content_type: 'text',
  //         parts: [question]
  //       }
  //     }
  //   ],
  //   model: 'text-davinci-002-render-sha',
  //   parent_message_id: v4()
  // }
  // let res = await rp({
  //   url:
  //     "https://chat.duti.tech/api/conversation",
  //   method: "POST",
  //   json: true,
  //   headers: header,
  //   body: data
  // });
  // res = JSON.parse(res)
  // return decodeURIComponent(res.data.parts[0])
}

