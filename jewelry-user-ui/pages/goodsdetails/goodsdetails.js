Page({
  data: {
     // input默认是1  
    num: 1,
    currentTab: 0,
    autoplay:true,
    interval:4000,
    duration:500,
    infos:[
      {'id':1,
        'infonames':'商品介绍'
      },{'id':2,
        'infonames':'正品保障'
      },{'id':3,
        'infonames':'购买须知'
      }
  ],
},

  onLoad:function(option){
    //页面加载的时候，默认商品选择的数量是:1
    wx.setStorageSync('nums', 1)
    wx.setStorageSync('goodsIds', option.id)
    //vm.goodsId = option.id
    var that=this 
      //适配高度
    wx.getSystemInfo({
      success: function (res) {
        //console.log('客户端高度')
        //console.log(res.windowHeight)
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
    //console.log('infos详情')
    //console.log(that.data.infos)
    that.setData({
                 infos:that.data.infos
             });
      //商品的参数（id）
      //console.log(option)
      var id = option.id
      //console.log(id)
      //console.log('商品的id')
      var urls="https://zq.muyaonet.com/api/index/getgoodsinfo" //商品详情
      wx.request({
          url :urls,
          method : "POST",
          header: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: {
              'id':id,
          },
          success: function(reses){
              //console.log(reses)
             //console.log('北京商品详情')
              console.log(reses.data.data.niu_index_response.goods_detail)
              var goodsDetail = reses.data.data.niu_index_response.goods_detail
              wx.setStorageSync('goodsDetail', goodsDetail)
              that.setData({
                goodsDetail:goodsDetail,
               // desc:contentss
              })
               
               
          } 
      })
  },

  
  //图片大小的设置
  imageLoad: function(e) {
        var that =this
        var imageSize = {}; 
        var originalWidth = e.detail.width;//图片原始宽  
        var originalHeight = e.detail.height;//图片原始高  
        var originalScale = originalHeight/originalWidth;//图片高宽比  
        //获取屏幕宽高  
        wx.getSystemInfo({  
          success: function (res) {  
            var windowWidth = res.windowWidth;  
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
            
            that.setData({
              imagewidth: imageSize.imageWidth, 
              imageheight: imageSize.imageHeight  
            })

          }  
        })
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


  //页面转发
    onShareAppMessage: function (res) {
      console.log(wx.getStorageSync('goodsIds'))
      var goodsId = wx.getStorageSync('goodsIds')

      console.log('/pages/goodsdetails/goodsdetails?id='+goodsId)
    
    return {
      title: '单品详情',
      path: '/pages/goodsdetails/goodsdetails?id='+goodsId,
    }
  },


  //预览图片
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imgUrls // 需要预览的图片http链接列表  
    })
  },
  
  /*跳转到购物车页面*/
  toCar() {
    wx.switchTab({
      url: '/pages/shoppingCart/shoppingCart'
    })
  },
  
  /**点击选择花色按钮、显示页面 购物车 */
  addCar: function (data) {
    var that = this;
    var animation = wx.createAnimation({//动画
      duration: 500,//动画持续时间
      timingFunction: 'linear',//动画的效果 动画从头到尾的速度是相同的
    })
    animation.translateY(0).step()//在Y轴偏移tx，单位px

    this.animation = animation
    that.setData({
      showModalStatus: true,//显示遮罩       
      animationData: animation.export()
    })
    that.setData({//把选中值，放入判断值中
      isHidden: 1,
      addCars:2,
    })
  },

  /*直接购买，弹出窗口*/
  immeBuy:function(){
      var that = this;
    var animation = wx.createAnimation({//动画
      duration: 500,//动画持续时间
      timingFunction: 'linear',//动画的效果 动画从头到尾的速度是相同的
    })
    animation.translateY(0).step()//在Y轴偏移tx，单位px

    this.animation = animation
    that.setData({
      showModalStatus: true,//显示遮罩       
      animationData: animation.export()
    })
    that.setData({//把选中值，放入判断值中
      isHidden: 1,
      addCars:3,
    })
  },


  /**隐藏选择花色区块 */
  hideModal: function (data) {
    var that = this;
    that.setData({//把选中值，放入判断值中
      showModalStatus: false,//显示遮罩       
      isHidden: 0,
    })

  },
 /*加减数量值*/
  /* 点击减号 */  
    bindMinus: function() {  
        var num = this.data.num;  
        // 如果大于1时，才可以减  
        if (num > 1) {  
            num --;  
        }  
        // 只有大于一件的时候，才能normal状态，否则disable状态  
        var minusStatus = num <= 1 ? 'disabled' : 'normal';  
        // 将数值与状态写回 
        //console.log(num)
        //缓存用户选择的商品的数量
        wx.setStorageSync('nums', num)
        this.setData({  
            num: num,  
            minusStatus: minusStatus  
        });  
    },  
    /* 点击加号 */  
    bindPlus: function() {  
        var num = this.data.num;  
        // 不作过多考虑自增1  
        num ++;  
        // 只有大于一件的时候，才能normal状态，否则disable状态  
        var minusStatus = num < 1 ? 'disabled' : 'normal';  
        // 将数值与状态写回  
        //console.log(num)
        //缓存用户选择的商品的数量
        wx.setStorageSync('nums', num)
        this.setData({  
            num: num,  
            minusStatus: minusStatus  
        });  
    },



   /*选好了的判断*/
   btn:function(e){
     //console.log(e)
     var id = e.target.id
    // console.log(id)
     //选择的商品的数量
     var goods_count = wx.getStorageSync('nums')
     //商品详情
     var goodsDetail= wx.getStorageSync('goodsDetail')
     //console.log(value)
     //添加到购物车
     if (id==2) {
        //获取用户的个人信息
         wx.getUserInfo({
           success: function (res) {
              //获取用户的信息及昵称
              console.log('获取用户的昵称')
              console.log(res)
              //获取用户的信息及昵称
               console.log(res.userInfo.nickName)
               var nickName=res.userInfo.nickName
               //用户的昵称上传到服务器
               var code = wx.getStorageSync('sessions')
               wx.request({
                  url :'https://zq.muyaonet.com/api/order/getNickName',
                  method : "POST",
                  header: {'Content-Type': 'application/x-www-form-urlencoded'},
                  data: {
                      'nickName':nickName,
                      'key':code,
                      
                 },
                  success: function(reses){
                      console.log(reses)
                  }

                })
                






           },
           fail:function(res){
              console.log('获取个人信息失败')
              console.log(res)
           wx.showModal({
                  title: '操作提示',
                  content: '你点击了拒绝授权，将无法进行下一步操作，请先同意授权',
                  success: function(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                       wx.openSetting({
                          success: function success(res) {
                               console.log(res)
                              if (res.authSetting['scope.userInfo'] === false) {
                                     //checkSettingStatu(cb);
                                     console.log('禁止获取个人信息')
                                     console.log(res)
                              } else {
                                    //  serinfor();
                                    console.log('允许获取个人信息了')
                                      wx.getUserInfo({
                                        success: function(res) {
                                          //获取的昵称保存到缓存中
                                          console.log(res.userInfo)
                                        }
                                      })
                              }
                          }
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                        }
              })


           }
       })


       //添加到购物车
       //var cart_detail ="'"+"{"+"goods_id":goodsDetail.goods_id,"count":goods_count,"goods_name":goodsDetail.goods_name,"sku_id":goodsDetail.sku_list[0].sku_id,"sku_name":goodsDetail.sku_list[0].sku_name,"price":goodsDetail.price,"picture_id":goodsDetail.picture,,"cost_price":goodsDetail.cost_price+"}"+"'"
       var cart_detail ='{"goods_id":"'+goodsDetail.goods_id+'","count":"'+goods_count+'","goods_name":"'+goodsDetail.goods_name+'","sku_id":"'+goodsDetail.sku_list[0].sku_id+'","sku_name":"'+goodsDetail.sku_list[0].sku_name+'","price":"'+goodsDetail.price+'","picture_id":"'+goodsDetail.picture+'","cost_price":"'+goodsDetail.cost_price+'"}';
       //console.log(cart_detail)
       var code = wx.getStorageSync('sessions')
       //console.log(code)
       wx.request({
          url :'https://zq.muyaonet.com/api/Goods/addcart',
          method : "POST",
          //header: {'content-type': 'application/x-www-form-urlencoded'},
          header: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: {
              'cart_detail':cart_detail,
              'key':code
         },
          success: function(reses){
             //console.log(reses)
              if (reses.data.message=="success") {
                  wx.switchTab({
                      url: '/pages/shoppingCart/shoppingCart'
                   })
              }    
               
          } 
      })
 
 
     }else if(id==3){
         console.log('立即购买啦啦啦啦啦')
        //选择的商品的数量
       console.log(goods_count)
       //商品详情
        wx.getUserInfo({
           success: function (res) {
              //获取用户的信息及昵称
               console.log(res.userInfo.nickName)
               var nickName=res.userInfo.nickName
               //用户的昵称上传到服务器
               var code = wx.getStorageSync('sessions')
               wx.request({
                  url :'https://zq.muyaonet.com/api/order/getNickName',
                  method : "POST",
                  header: {'Content-Type': 'application/x-www-form-urlencoded'},
                  data: {
                      'nickName':nickName,
                      'key':code,
                      
                 },
                  success: function(reses){
                      console.log(reses)
                  }
                })



           },
           fail:function(res){
              console.log('获取个人信息失败')
              console.log(res)
              wx.showModal({
                  title: '操作提示',
                  content: '你点击了拒绝授权，将无法进行下一步操作，请先同意授权',
                  success: function(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                       wx.openSetting({
                          success: function success(res) {
                               console.log(res)
                              if (res.authSetting['scope.userInfo'] === false) {
                                     //checkSettingStatu(cb);
                                     console.log('禁止获取个人信息')
                                     console.log(res)
                              } else {
                                    
                                    console.log('允许获取个人信息了')
                                      wx.getUserInfo({
                                        success: function(res) {
                                          //获取的昵称保存到缓存中
                                          console.log(res.userInfo.userInfo)
                                            var nickName=res.userInfo.nickName
                                           //用户的昵称上传到服务器
                                           var code = wx.getStorageSync('sessions')
                                           wx.request({
                                              url :'https://zq.muyaonet.com/api/order/getNickName',
                                              method : "POST",
                                              header: {'Content-Type': 'application/x-www-form-urlencoded'},
                                              data: {
                                                  'nickName':nickName,
                                                  'key':code,
                                                  
                                             },
                                              success: function(reses){

                                              }
                                            })


                                        }
                                      })
                              }
                          }
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
              })


           }
       })
       // console.log(goodsDetail)
       //console.log(goodsDetail.sku_list[0].sku_id)
       var code = wx.getStorageSync('sessions')
       wx.request({
          url :'https://zq.muyaonet.com/api/Order/paymentOrder',
          method : "POST",
          header: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: {
              'tag':'buy_now',
              'key':code,
              'sku_id':goodsDetail.sku_list[0].sku_id,
              'num':goods_count,
              'goods_type':goodsDetail.goods_type
         },
          success: function(reses){
              //console.log('成功了么嘎嘎嘎')
              //console.log(reses.data.data.paymentOrder)
             var placeOrder= reses.data.data.paymentOrder
            // console.log(placeOrder.address.mobile)
             var addr = placeOrder.address
             if (addr==null) {
                wx.showModal({ 
                   title: '提示',
                   content: '请添加收货地址',
                   success: function(res) {
                       if (res.confirm) {
                         //console.log('用户点击确定')
                         wx.navigateTo({
                          url: '/pages/addr/addr'
                         })
                       } else if (res.cancel) {
                         console.log('用户点击取消')
                       }
                   }
                })
             }else{
                 wx.setStorageSync("placeOrder", placeOrder)
                      wx.navigateTo({
                          url: '/pages/pendingPaymentOrder/pendingPaymentOrder'
                       })
             }

           
               
          } 
      })
     }
   },

   /*商品详情切换*/
   //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }


})