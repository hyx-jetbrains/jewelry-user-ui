//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    navbar: ['全部订单', '待付款', '待发货','待收货'],
    currentTab: 0,
  },
  
  onLoad: function (options) {
     var that = this
    //适配高度
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res.windowHeight)
        that.setData({
          clientHeight: res.windowHeight*0.9
        });
      }
    });
     //判断订单状态的id
     var id = options.id;
     console.log(id)
     //用户登录用户的session
     var res = wx.getStorageSync('sessions')
     //console.log('这似乎什么东东')
     //console.log(res)
     var that =this
     switch (id) {
       case '0':
         console.log('全部订单')
         //console.log('这似乎什么东东')
         wx.request({
            url: 'https://zq.muyaonet.com/api/Member/orderList',
            method:'POST',
            data: {
               page: 1 ,
               key:res,
               status:'all'
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              //console.log(res)
              var orderList=res.data.data.statusNum

              //console.log(orderList)
              for(var i=0;i<orderList.length;i++){
                   orderList[i]['times']=that.timestampToTime(orderList[i]['create_time'])
              }
              console.log('beijing')
              console.log(orderList)
              that.setData({
                orderList:orderList
              })

            }
         })

         break;
       case '1':
         console.log('待付款订单')
         var that =this
         wx.request({
            url: 'https://zq.muyaonet.com/api/Member/orderList',
            method:'POST',
            data: {
               page: 1 ,
               key:res,
               status:'0'
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              //console.log(res)
              var orderList=res.data.data.statusNum

              //console.log(orderList)
              for(var i=0;i<orderList.length;i++){
                   orderList[i]['times']=that.timestampToTime(orderList[i]['create_time'])
              }
              //console.log('testssss')
              //console.log(orderList)
              that.setData({
                orderList:orderList,
                navbar:that.data.navbar,
                currentTab:1
              })

            }
         })


         break;
       case '2':
         console.log('待发货')

          var that =this
         wx.request({
            url: 'https://zq.muyaonet.com/api/Member/orderList',
            method:'POST',
            data: {
               page: 1 ,
               key:res,
               status:'1'
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              //console.log(res)
              var orderList=res.data.data.statusNum

              //console.log(orderList)
              for(var i=0;i<orderList.length;i++){
                   orderList[i]['times']=that.timestampToTime(orderList[i]['create_time'])
              }
              //console.log('testssss')
              //console.log(orderList)
              that.setData({
                orderList:orderList,
                navbar:that.data.navbar,
                currentTab:2
              })

            }
        })
         break;
         case '3':
         //console.log('待收货')
              
        var that =this
         wx.request({
            url: 'https://zq.muyaonet.com/api/Member/orderList',
            method:'POST',
            data: {
               page: 1 ,
               key:res,
               status:'2'
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              //console.log(res)
              var orderList=res.data.data.statusNum

              //console.log(orderList)
              for(var i=0;i<orderList.length;i++){
                   orderList[i]['times']=that.timestampToTime(orderList[i]['create_time'])
              }
             // console.log('testssss')
              //console.log(orderList)
              that.setData({
                orderList:orderList,
                navbar:that.data.navbar,
                currentTab:3
              })

            }
        })
           
         break;
     }

  },

  //时间戳转换成 2018-09-09 格式
  timestampToTime:function(timestamp) {
        var date = new Date(timestamp * 1000)
        var dates= date.getFullYear() + '-'+(date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()
        return dates
        /*Y = date.getFullYear() + '-';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        D = date.getDate() + ' ';
       // h = date.getHours() + ':';
        //m = date.getMinutes() + ':';
        //s = date.getSeconds();
       // return Y+M+D+h+m+s;
        return Y+M+D; */
    },



   /*列表的几个点击事件*/
  
   navbarTap: function(e){ 
    /*做判断*/
    var that =this
    var res = wx.getStorageSync('sessions')
    console.log(e.currentTarget.dataset.idx) /*索引值*/
    if (e.currentTarget.dataset.idx==0) {
       wx.request({
            url: 'https://zq.muyaonet.com/api/Member/orderList',
            method:'POST',
            data: {
               page: 1 ,
               key:res,
               status:'all'
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              //console.log(res)
              var orderList=res.data.data.statusNum

              //console.log(orderList)
              for(var i=0;i<orderList.length;i++){
                   orderList[i]['times']=that.timestampToTime(orderList[i]['create_time'])
              }
              //console.log(orderList)
              that.setData({
                orderList:orderList
              })

            }
         })
    }else if (e.currentTarget.dataset.idx==1) {
       /*宝石*/
       wx.request({
            url: 'https://zq.muyaonet.com/api/Member/orderList',
            method:'POST',
            data: {
               page: 1 ,
               key:res,
               status:'0'
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              //console.log(res)
              var orderList=res.data.data.statusNum

              //console.log(orderList)
              for(var i=0;i<orderList.length;i++){
                   orderList[i]['times']=that.timestampToTime(orderList[i]['create_time'])
              }
              //console.log('testssss')
              //console.log(orderList)
              that.setData({
                orderList:orderList,
                navbar:that.data.navbar,
                currentTab:1
              })

            
            }

         })
    }else if (e.currentTarget.dataset.idx==2){
       var that =this
         wx.request({
            url: 'https://zq.muyaonet.com/api/Member/orderList',
            method:'POST',
            data: {
               page: 1 ,
               key:res,
               status:'1'
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              //console.log(res)
              var orderList=res.data.data.statusNum

              //console.log(orderList)
              for(var i=0;i<orderList.length;i++){
                   orderList[i]['times']=that.timestampToTime(orderList[i]['create_time'])
              }
              //console.log('testssss')
              //console.log(orderList)
              that.setData({
                orderList:orderList,
                navbar:that.data.navbar,
                currentTab:2
              })

            }
        })
      
      console.log('zhuanshi')
    }else if (e.currentTarget.dataset.idx==3){
      var that =this
         wx.request({
            url: 'https://zq.muyaonet.com/api/Member/orderList',
            method:'POST',
            data: {
               page: 1 ,
               key:res,
               status:'2'
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              //console.log(res)
              var orderList=res.data.data.statusNum

              //console.log(orderList)
              for(var i=0;i<orderList.length;i++){
                   orderList[i]['times']=that.timestampToTime(orderList[i]['create_time'])
              }
              //console.log('testssss')
              //console.log(orderList)
              that.setData({
                orderList:orderList,
                navbar:that.data.navbar,
                currentTab:3
              })

            }
        })
        console.log('feicui')
    }
    this.setData({
      currentTab: e.currentTarget.dataset.idx  
    })  
  },
  


 
})
