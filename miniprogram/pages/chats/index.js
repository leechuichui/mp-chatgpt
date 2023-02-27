//index.js
const app = getApp();


Page({
    data: {
        ques: '',
        res: [],
        version: 1
    },

    onLoad: function() {
       const chateq = wx.getStorageSync('chateq')
       this.setData({
        res: chateq || []
       })
    },
    v4 () {
        var s = [];
      
        var hexDigits = "0123456789abcdef";
      
        for (var i = 0; i < 36; i++) {
      
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      
        }
      
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      
        s[8] = s[13] = s[18] = s[23] = "-";
      
        
      
        var uuid = s.join("");
      
        return uuid
      
    },
    resetReq() {
        wx.setStorageSync('chateq', [])
        this.setData({
            res: []
        })
    },
    changeVersion() {
        this.resetReq()
        let version = this.data.version === 1 ? 2 : 1
        this.setData({
            version
        })
    },
    async sendReq() {
        let resTemp = this.data.res;
        if(this.data.ques !== (resTemp.length && resTemp[resTemp.length - 1].text)) {
            resTemp.push({type: 'req', text: this.data.ques})
            this.setData({
                res: resTemp
            });
        }
        wx.showLoading({
          title: '思考中...',
        })
        const reqs = resTemp.map(item => item.text);
        let question = reqs.join('\\n') + (reqs.length === 1 ? '' : '\\n')
        try {
            const callFunc = this.data.version === 1 ? this.getChats1 : this.getChats2
            const res = await callFunc(question);
            const answner = res.result.data;
            if(answner) {
                resTemp.push({type: 'res', text: answner})
                this.setData({
                    res: resTemp,
                    ques: ''
                });
                wx.setStorageSync('chateq', resTemp)
            }
            wx.hideLoading()
        } catch (error) {
            console.log(error)
            wx.showToast({
                icon: 'none',
                title: '系统繁忙'
            })
        }
    },
    async getChats2(question) {
        const res = await wx.cloud.callFunction({
            name: 'chats',
            data: {
                question
            }
        })
        return res
    },
    async getChats1(question) {
        const res = await wx.cloud.callFunction({
            name: 'chats2',
            data: {
                question
            }
        })
        return res
        const accessToken =
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJ3ZWkzLmd1b0BseS5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZ2VvaXBfY291bnRyeSI6IlVTIn0sImh0dHBzOi8vYXBpLm9wZW5haS5jb20vYXV0aCI6eyJ1c2VyX2lkIjoidXNlci1odzBXSjBnVVBLTmFOdU56VFZIaW1pRlUifSwiaXNzIjoiaHR0cHM6Ly9hdXRoMC5vcGVuYWkuY29tLyIsInN1YiI6ImF1dGgwfDYzZWQ4ZWZmM2I1MzI2MmE5Y2IyODA4MSIsImF1ZCI6WyJodHRwczovL2FwaS5vcGVuYWkuY29tL3YxIiwiaHR0cHM6Ly9vcGVuYWkub3BlbmFpLmF1dGgwYXBwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2NzY1MTM3MzEsImV4cCI6MTY3NzcyMzMzMSwiYXpwIjoiVGRKSWNiZTE2V29USHROOTVueXl3aDVFNHlPbzZJdEciLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIG1vZGVsLnJlYWQgbW9kZWwucmVxdWVzdCBvcmdhbml6YXRpb24ucmVhZCBvZmZsaW5lX2FjY2VzcyJ9.Zi9ZNR0kFfdRdz4Bu7whSz_lau_GfUJfQMCpZe4Up3e2588z7ThgHY_GRj3R58vSRcSpionJ9FRVj8Nx8S9ExKkKgvZJj5FxTFB0ApKESZ3gOBwZk0XwwGt2zdnE3XVcbVvUtIeRZgzOUvLiEBGLEKc01_n3gCRud2sS-m7uaqd07Lmrwz73enIudRMWuZf70Dq-uVk31xE-RcbcUOnakxqfOuOA6dr3LM0if2auQrWe1uC7w1MhkVb-yFjh03NOQ26h-WIqDzQby2hmjru8m4hrpIrJYhiEDXDbEwIPI-qSRnRpDRjiYWEl919R3KJsg8rra3rRaqtqsUB86ZzdZg'
        const header = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
        const data = {
            action: 'next',
            messages: [
            {
                id: this.v4(),
                role: 'user',
                content: {
                content_type: 'text',
                parts: [question]
                }
            }
            ],
            model: 'text-davinci-002-render-sha',
            parent_message_id: this.v4()
        }
        
        return new Promise((resolve, reject) => {
            wx.request({
                url: "https://chat.duti.tech/api/conversation",
                data,
                method: 'post',
                timeout: 60000,
                header: header,
                success(res) {
                    const tempArr = res.data.split('"parts": ["')
                    const resText = tempArr[tempArr.length - 1].split('"]}, "')[0]
                    // console.log(encodeURIComponent(resText))
                    // const t = decodeURIComponent(encodeURIComponent(resText))
                    // console.log(typeof resText)
                    // debugger
                    let text = unescape(resText.replace(/\\u/g, '%u'))
                    console.log(text)
                    resolve({
                        result: {
                            data: text.replace(/\\n\\n/g, '<br/>')
                        }
                    })
                }
            })
        })
    },
    onShareAppMessage() {

    }
});