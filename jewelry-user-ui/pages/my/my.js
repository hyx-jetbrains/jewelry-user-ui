var app = getApp()
Page({
  data: {
    userInfo: {},
    motto: 'Hello World',
     hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    avatarUrl: "",
    nickname: "点击登录",
    isLogin: false,
    orderItems: [
      {
        typeId: 0,
        name: '全部订单',
        url: 'bill',
        imageurl: '../../images/icon/allorder.png',
      },
      {
        typeId: 1,
        name: '待付款',
        url: 'bill',
        imageurl: '../../images/icon/waitermoney.png',
      },
      {
        typeId: 2,
        name: '待发货',
        url: 'bill',
        imageurl: '../../images/icon/plane.png'
      },
       {
        typeId: 3,
        name: '待收货',
        url: 'bill',
        imageurl: '../../images/icon/waiteorder.png'
      }
    ],
  },
  
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  bindGetUserInfo(e) {
    console.log(e)
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.globalData.userInfo = e.detail.userInfo
      wx.getStorage({
        key: 'openId',
        success: function (res) {
          wx.request({
            url: 'http://192.168.0.100:8888/wx-auth/xcx-userdetail',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: "POST",
            data: {
              openid: res.data,
              nickname: e.detail.userInfo.nickName,
              headicon: e.detail.userInfo.avatarUrl,
              gender: e.detail.userInfo.gender
            }
          })
        },
      })
      this.setData(
        {
          avatarUrl: e.detail.userInfo.avatarUrl,
          nickname: e.detail.userInfo.nickName,
          isLogin: true
        }
      )
    }
  }
})