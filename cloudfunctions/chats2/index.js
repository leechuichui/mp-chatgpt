// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')
const rp = require("request-promise");

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const { v4 } = require('uuid');

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
  const { question } = event

  const accessToken =
        'your access Token'
  const header = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`
  }
  const data = {
    action: 'next',
    messages: [
      {
        id: v4(),
        role: 'user',
        content: {
          content_type: 'text',
          parts: [question]
        }
      }
    ],
    model: 'text-davinci-002-render-sha',
    parent_message_id: v4()
  }
  let res = await rp({
    url:
      "https://chat.duti.tech/api/conversation",
    method: "POST",
    json: true,
    headers: header,
    body: data
  });
  
  const tempArr = res.split('"parts": ["')
  const resText = tempArr[tempArr.length - 1].split('"]}, "')[0]
  let text = unescape(resText.replace(/\\u/g, '%u'))
  text = text.replace(/\\n\\n/g, '<br/>')
  text = text.replace(/\\n/g, '<br/>')
  return {
    data: text
  }
  // res = JSON.parse(res)
  // return decodeURIComponent(res.data.parts[0])
}

