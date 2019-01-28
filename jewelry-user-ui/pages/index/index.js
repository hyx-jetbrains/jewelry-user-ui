//获取应用实例
const app = getApp()
Page({
  data: {
    indicatorDots:true,
    autoplay:true,
    interval:4000,
    duration:500,
    imgUrls:[],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    children:[],
    currentTab: 0,
    mode:'widthFix',
    images:{}
  },

imgHeight:function(e){
  var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
  var imgh=e.detail.height;//图片高度
  var imgw=e.detail.width;//图片宽度
  var swiperH=winWid*imgh/imgw + "px"//等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
  this.setData({
    Height:swiperH//设置高度
  })
},


   imageLoad: function(e) {
        var that =this
        var imageSize = {}; 
        var originalWidth = e.detail.width;//图片原始宽  
        var originalHeight = e.detail.height;//图片原始高  
        var originalScale = originalHeight/originalWidth;//图片高宽比  
        //console.log('originalWidth: ' + originalWidth)  
        //console.log('originalHeight: ' + originalHeight)
        //获取屏幕宽高  
        wx.getSystemInfo({  
          success: function (res) {  
            var windowWidth = res.windowWidth;
            console.log(windowWidth)
            console.log('屏幕宽度')  
            var windowHeight = res.windowHeight;  
            var windowscale = windowHeight/windowWidth;//屏幕高宽比  
            //console.log('windowWidth: ' + windowWidth)  
            //console.log('windowHeight: ' + windowHeight)  
            if(originalScale < windowscale){//图片高宽比小于屏幕高宽比  
              //图片缩放后的宽为屏幕宽  
               imageSize.imageWidth = windowWidth;  
               imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;  
            }else{//图片高宽比大于屏幕高宽比  
              //图片缩放后的高为屏幕高  
               imageSize.imageHeight = windowHeight; 
               imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;  
            } 
            
            //console.log('缩放后的宽: ' + imageSize.imageWidth)  
            //console.log('缩放后的高: ' + imageSize.imageHeight)
            that.setData({
              imagewidth: imageSize.imageWidth, 
              imageheight: imageSize.imageHeight
              //imageheight: originalHeight
            })

          }  
        })
   },


  onLoad: function (options) {
    
    var that = this
    //首页的banner 接口 滚动大图的
    var urls="https://zq.muyaonet.com/api/index/getBanner"  //banner接口地址       
      wx.request({
          url :urls,
          method : "POST",
          header: {'content-type': 'application/x-www-form-urlencoded'},
          success: function(reses){
            var adv_list = reses.data.data.niu_index_response.adv_list
            //console.log('测试滚动图')
            //console.log(adv_list)
            //console.log(adv_list[0].adv_title)
            if (adv_list[0].adv_url=='#') {
             //console.log('北京欢迎你')
              that.setData({
                 imgUrls:''
             })
            }else {
              //console.log('获取banner接口')
              //console.log(adv_list)
              that.setData({
                 imgUrls:adv_list
             })
            }
            
          } 
      });    
    //适配高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight*0.8
        });
      }
    });
    //一级分类列表的名字
    var urls="https://zq.muyaonet.com/api/goods/goodsCategoryFirstList"       
      wx.request({
          url :urls,
          method : "POST",
          header: {'content-type': 'application/x-www-form-urlencoded'},
          success: function(reses){
              var goodsList = reses.data.data.niu_index_response              
              that.setData({
                 goodsList:goodsList
              })
            //详情商品列表
           var urlsJing = 'https://zq.muyaonet.com/api/goods/getGoodsByBest'
           wx.request({
                  url :urlsJing,
                  method : "POST",
                  header: {'content-type': 'application/x-www-form-urlencoded'},
                  data: {},
                  success: function(reses){
                      //console.log(reses)
                      var goodsListess = reses.data.data.niu_index_response
                      console.log(goodsListess)
                      var arr =new Array()
                      for(var i=0;i<goodsListess.length;i++){
                           if(goodsListess[i].category_banner_id !==''){
                                  arr[i] = goodsListess[i]
                            }
                      } 
                      that.setData({
                         goodsListess:arr
                      })

                  } 
              });

                  } 
              });
  },

  //页面转发
    onShareAppMessage: function (res) {
    if (res.from === 'button') {
    }
    return {
      title: 'Jewelry world',
      path: '/pages/index/index',
      success: function(res) {
        // 转发成功
        //console.log(res)
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },

   /*列表的几个点击事件*/
   navbarTap: function(e){ 
    if (e.currentTarget.dataset.idx==0) {
      var that =this
       var urlsJing = 'https://zq.muyaonet.com/api/goods/getGoodsByBest'
           wx.request({
                  url :urlsJing,
                  method : "POST",
                  header: {'content-type': 'application/x-www-form-urlencoded'},
                  data: {},
                  success: function(reses){
                      //console.log(reses)
                      var goodsListess = reses.data.data.niu_index_response
                      //console.log(goodsListess)
                      var arr =new Array()
                      for(var i=0;i<goodsListess.length;i++){
                           if(goodsListess[i].category_banner_id !==''){
                                  arr[i] = goodsListess[i]
                            }
                      } 
                      that.setData({
                         goodsListess:arr
                      })

                  } 
              })


    }else if (e.currentTarget.dataset.idx==1) {
      var id =e.currentTarget.dataset.variable /*列表的id值*/
    //console.log(id)
    //获取二级列表的名字和id
    var urls="https://zq.muyaonet.com/api/goods/goodsCategorySecondList?category_id="+id
    var that =this
    wx.request({ 
          url : urls,
          success: function(reses){  
             var goodsList= reses.data.data.niu_index_response
             console.log('二级商品')
             console.log(goodsList)
             that.setData({
                 goodsLists:goodsList
             })    
          } 
      }); 

      var urlss="https://zq.muyaonet.com/api/goods/goodsHomeList"
         var id =e.currentTarget.dataset.variable 
         console.log('查看id是多少')
         console.log(id)
        wx.request({ 
              url : urlss,
              method : "POST",
              header: {'content-type': 'application/x-www-form-urlencoded'},
              data:{
                category_id:id,
              },
              success: function(reses){
               var goodsList= reses.data.data.niu_index_response
               var arr=new Array()
               for(var i=0;i<goodsList.length;i++){
                     if(goodsList[i].category_banner_id !==''){
                            arr[i] = goodsList[i]
                      }
               }
              
               if (arr.category_banner_title==undefined) {
                //console.log('这是空值')
               }
               console.log(arr)
                that.setData({
                     goodsListess:arr
                 })    
              } 
          }); 
    }else if (e.currentTarget.dataset.idx==2){
      var id =e.currentTarget.dataset.variable /*列表的id值*/
    //console.log(id)
    //获取二级列表的名字和id
   var urls="https://zq.muyaonet.com/api/goods/goodsCategorySecondList?category_id="+id
    var that =this
    wx.request({ 
          url : urls,
          success: function(reses){  
             var goodsList= reses.data.data.niu_index_response
            // console.log(goodsList)
             that.setData({
                 goodsLists:goodsList
             })    
          } 
      }); 

      var urlss="https://zq.muyaonet.com/api/goods/goodsHomeList"
         var id =e.currentTarget.dataset.variable 
        wx.request({ 
              url : urlss,
              method : "POST",
              header: {'content-type': 'application/x-www-form-urlencoded'},
              data:{
                category_id:id,
              },
              success: function(reses){
               var goodsList= reses.data.data.niu_index_response         
                var arr=new Array()
               for(var i=0;i<goodsList.length;i++){
                     if(goodsList[i].category_banner_id !==''){
                            arr[i] = goodsList[i]
                      }
               }

                that.setData({
                     goodsListess:arr
                 })    
              } 
          }); 
    }else if (e.currentTarget.dataset.idx==3){
       var id =e.currentTarget.dataset.variable /*列表的id值*/
    //获取二级列表的名字和id
   var urls="https://zq.muyaonet.com/api/goods/goodsCategorySecondList?category_id="+id
    var that =this
    wx.request({ 
          url : urls,
          success: function(reses){  
             var goodsList= reses.data.data.niu_index_response
            // console.log(goodsList)
             that.setData({
                 goodsLists:goodsList
             })    
          } 
      }); 

      var urlss="https://zq.muyaonet.com/api/goods/goodsHomeList"
         var id =e.currentTarget.dataset.variable 
        wx.request({ 
              url : urlss,
              method : "POST",
              header: {'content-type': 'application/x-www-form-urlencoded'},
              data:{
                category_id:id,
              },
              success: function(reses){
               var goodsList= reses.data.data.niu_index_response
               var arr=new Array()
               for(var i=0;i<goodsList.length;i++){
                     if(goodsList[i].category_banner_id !==''){
                            arr[i] = goodsList[i]
                      }
               }
                that.setData({
                     goodsListess:arr
                 })    
              } 
          }); 
    }else if (e.currentTarget.dataset.idx==4) {
      var id =e.currentTarget.dataset.variable /*列表的id值*/
    //获取二级列表的名字和id
   var urls="https://zq.muyaonet.com/api/goods/goodsCategorySecondList?category_id="+id
    var that =this
    wx.request({ 
          url : urls,
          success: function(reses){  
             var goodsList= reses.data.data.niu_index_response
            // console.log(goodsList)
             that.setData({
                 goodsLists:goodsList
             })    
          } 
      }); 
      var urlss="https://zq.muyaonet.com/api/goods/goodsHomeList"
         var id =e.currentTarget.dataset.variable 
        wx.request({ 
              url : urlss,
              method : "POST",
              header: {'content-type': 'application/x-www-form-urlencoded'},
              data:{
                category_id:id,
              },
              success: function(reses){
               var goodsList= reses.data.data.niu_index_response
               var arr=new Array()
               for(var i=0;i<goodsList.length;i++){
                     if(goodsList[i].category_banner_id !==''){
                            arr[i] = goodsList[i]
                      }
               }
                that.setData({
                     goodsListess:arr
                 })    
              } 
          }); 
    } 
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })

  }
 
})
