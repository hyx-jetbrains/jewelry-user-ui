//app.js
App({
  onLaunch: function () {
    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var urls="https://zq.muyaonet.com/index.php?s=/api/index/getUserCode"  //登录的url
        wx.request({
                      url :urls,
                      method : "POST",
                      //header: {'content-type': 'application/x-www-form-urlencoded'},
                      header: {'Content-Type': 'application/x-www-form-urlencoded'},
                      data: {
                          'code':res.code,
                      },
                      success: function(reses){
                          //console.log(reses)
                          //返回值是session标签，需要保存到缓存中
                          var session_key =reses.data.data.thirdSession.thirdSession
                          //console.log(session_key)
                           //判断用户登录状态，如果是1 说明用户已经绑定过了
                           var userStatus= reses.data.data.thirdSession.status
                           //保存taoken 到缓存中
                          wx.setStorageSync('userStatus', userStatus)
                          //保存taoken 到缓存中
                          wx.setStorageSync('sessions', session_key)
                          //读取缓存中的数据（sessions）
                          //console.log('fdsafdsafdsafdsafdsafdas')
                          var res = wx.getStorageSync('sessions')
                          //console.log(res) 
                      } 
                  })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})




