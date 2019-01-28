//获取应用实例
const app = getApp()

Page({
   
   onLoad:function(){
    var that =this
    var placeOrder = wx.getStorageSync("placeOrder")
    //console.log('这个对不对呀？');
    //console.log(placeOrder)
    var address =placeOrder.address
    var goodsList = placeOrder.list
    //console.log('商品列表么？？')
    //console.log(goodsList)
    var nums=0
    for(var i=0;i<goodsList.length;i++){
      nums += goodsList[i]['price']*goodsList[i]['num']
    }
    //console.log(nums)
    var sku_id= new Array();
    
    for(var i=0;i<goodsList.length;i++){
          sku_id[i]=new Array(i);
          for(var j=0;j<sku_id.length;j++){ 
              sku_id[i][1]=goodsList[i]['num'];
              sku_id[i][0]=goodsList[i]['sku_id'];
          }
     }
    wx.setStorageSync("sku_id", sku_id)
    //console.log('test')
    //console.log(sku_id)
    //console.log('testtest')
    //console.log(typeof this.getString(sku_id))
    that.setData({
       addr : address,
       goodsList:goodsList,
       nums:nums
    })
   },
   
   onShow:function(){
      // console.log('北京天安他们')
       //获取购物车的id
      var cart_ids= wx.getStorageSync("cart_ids")
       var code = wx.getStorageSync('sessions')
       var that =this
       //请求确定订单的商品列表
       wx.request({
          url :"https://zq.muyaonet.com/api/Order/paymentOrder",
          method : "POST",
          header: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: {
              'key':code,
              'cart_id':cart_ids,
              'tag':'cart'
          },

          success: function(reses){
            // console.log(reses.data.data.paymentOrder)
              var  placeOrder= reses.data.data.paymentOrder.address
              //console.log('fafafagagaga')
              //console.log(placeOrder)
              that.setData({
                   addr:placeOrder
              })
              //wx.setStorageSync("placeOrder", placeOrder)
              //var a= wx.getStorageSync("placeOrder")
              
         } 
      }) 



  },

  getString:function ( objarr ){
　　var typeNO = objarr.length;
  　 //var tree = "[";
  var tree =''
 　　for (var i = 0 ;i < typeNO ; i++){
   　　//　tree += "[";
   　　　//tree +="'"+ objarr[i][0]+"',";
   　　//　tree +="'"+ objarr[i][0]+":"+objarr[i][1]+"'";
   　　　tree += objarr[i][0]+":"+objarr[i][1];
   　　//　tree +="'"+ objarr[i][1]+"'";
  　　　 //tree += "]";
  　　　 // tree += ",";
  　　　 if(i<typeNO-1){
    　　 　　tree+=",";
 　　　  }
  　 }
  　 //tree+="]";
  　 return tree;
},


   
  //点击微信支付的事件
 pay:function(){
 	//console.log('立即购买么么么么哒')
    //获取相关的数据
      //商品列表
      //var goods_sku_list ='8:6' 
      var goodsList= wx.getStorageSync('sku_id')
   
     var goods_sku_list =this.getString(goodsList)
        //console.log('有什么问题么？')
      //console.log(goods_sku_list)
     // var goods_sku_list ='12:2,11:5'
      //留言
      var leavemessage =""
      //优惠券    
      var use_coupon =0
      //积分
      var integral =0
      //使用余额
      var account_balance =0
      //支付方式
      var pay_type =0
      //发票
      var buyer_invoice =''
      //自提点
      var pick_up_id =0
      //物流公司
      var shipping_company_id =1
      var key = wx.getStorageSync('sessions')
        //console.log(key)
      var urls="https://zq.muyaonet.com/api/order/orderCreate"
      wx.request({
          url :urls,
          method : "POST",
          header: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: {
		        goods_sku_list:goods_sku_list,
            leavemessage:leavemessage,   // 留言
		        use_coupon:0,            // 优惠券
		        integral:0,              // 积分
		        account_balance:0,       // 使用余额
		        pay_type:0,            // 支付方式 0微信支付
		        buyer_invoice:0,          // 发票
		        pick_up_id:0,            // 自提点
		        shipping_company_id:1,   // 物流公司
		        key: key

          },
          success: function(reses){
              //console.log(reses.data.data.niu_index_response)
              var pays =reses.data.data.niu_index_response
               //console.log(pays)
               //console.log('gasgasgdasg这个可以有')
              var nonceStr = pays.nonceStr
               //console.log(nonceStr)
              var packages =  pays.package
              //console.log(packages)
              var paySign = pays.paySign
              //console.log(paySign)
              var signType = pays.signType
              //console.log(signType)
              var timeStamp = pays.timeStamp
              //console.log(timeStamp)
          
              wx.requestPayment({

                  'timeStamp': timeStamp,
                  'nonceStr': nonceStr,
                  'package': packages,
                  'signType': signType,
                  'paySign': paySign,
                  success:function(res){
                       //console.log('成功')
                       //console.log(res)
                      wx.navigateTo({
                          url: '/pages/order/order?id=2'
                       })
                  },
                  fail:function(res){
                       // console.log('失败')
                       //console.log(res)
                       wx.navigateTo({
                          url: '/pages/order/order?id=1'
                       })
                  },
                  complete:function(res){
                       // console.log('完成')
                       //console.log(res)
                  }
              })

                  
          } 
      })



 }


 
})
