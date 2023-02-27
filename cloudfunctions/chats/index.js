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
}

