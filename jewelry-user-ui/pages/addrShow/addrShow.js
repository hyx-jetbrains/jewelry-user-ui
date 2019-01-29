Page({
  data: {
    total:0,
    CheckAll:true
  },
  onShow:function(e){
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

     var code =wx.getStorageSync('sessions')
     console.log(code)
     //地址列表接口
     var that = this
     var urls='https://zq.muyaonet.com/api/Member/addressList'
     wx.request({
          url :urls,
          method : "POST",
          header: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: {
              'key':code,
              'type':'add',
              
          },
          success: function(reses){
             console.log('地址列表')
              console.log(reses.data.data.addresslist)
              var addrList=reses.data.data.addresslist

              that.setData({
               addrList: addrList
             })
         } 
      })
  },

     // 选择
   selectedCart:function(e){

    console.log('beijingggg')
    console.log(e)
    console.log(this.data.addrList)
    var addrList = this.data.addrList
    var index = e.currentTarget.dataset.index;  //获取当前点击事件的下标索引
    var selected = addrList[index].is_default; //查看是否是默认地址

    //console.log('默认的么？')
    //console.log(selected)
    if(selected=='1'){
       console.log('beijing')
    }else {
      console.log('大连')
       var id = addrList[index].id; //相关地址的id
       //console.log(id)
       var code = wx.getStorageSync('sessions')
       var urls='https://zq.muyaonet.com/api/Member/updateAddressDefault'
         wx.request({
              url :urls,
              method : "POST",
              header: {'Content-Type': 'application/x-www-form-urlencoded'},
              data: {
                  'key':code,
                  'id':id,
                  
              },

              success: function(reses){
                  console.log(reses)
                  
                 /* console.log(reses.data.data.addresslist)
                  var addrList=reses.data.data.addresslist
                  that.setData({
                   addrList: addrList
                 }) */
                  
             } 
          })

          //更新页面数据
          var code =wx.getStorageSync('sessions')
         console.log(code)
         //地址列表接口
         var that = this
         var urls='https://zq.muyaonet.com/api/Member/addressList'
         wx.request({
              url :urls,
              method : "POST",
              header: {'Content-Type': 'application/x-www-form-urlencoded'},
              data: {
                  'key':code,
                  'type':'add',
                  
              },
              success: function(reses){
                  console.log(reses.data.data.addresslist)
                  var addrList=reses.data.data.addresslist

                  that.setData({
                   addrList: addrList
                 })
             } 
          })




    }
   /* console.log(e)
    var selected =true
    var cartItems = this.data.cartItems   //获取购物车列表
    console.log(cartItems)
    var index = e.currentTarget.dataset.index;  //获取当前点击事件的下标索引
    //console.log(index)
    var selected = cartItems[index].selected;    //获取购物车里面的value值
    //console.log(cartItems)
    //取反
    cartItems[index].selected =! selected; */

    /*this.setData({
      cartItems: cartItems
    })*/
   
    
   },




   
  
  
  
   

   

   
   
 
 



})
