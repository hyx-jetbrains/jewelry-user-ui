Page({
  data: {
    cartItems:[],
    total:0,
    CheckAll:true,
    //goodsShopping:[]
  },
  //查看购物车的数据
  onShow:function(){
      //var urls="https://zq.muyaonet.com/api/Goods/getShoppingCart" //购物车
      var code = wx.getStorageSync('sessions')
      //console.log(code)
      var that=this;
      wx.request({
          url :"https://zq.muyaonet.com/api/Goods/getShoppingCart?key="+code,
          success: function(reses){
              var cartItems = reses.data.data.getShoppingCart
              //console.log(cartItems)
              for(var i=0;i<cartItems.length;i++){
                   cartItems[i]['selected']=true
              }
               //console.log(cartItems)
              wx.setStorageSync("cartItems", cartItems)
             // console.log(wx.getStorageSync("cartItems"))
               var sum = 0
               for (var i = 0; i < cartItems.length; i++) {
                 if (cartItems[i].selected) {
                   sum += cartItems[i].num * cartItems[i].price
                 }
               }
               that.setData({
                   total: sum,
                  cartItems: cartItems
              })     
         } 
      })


  },
  
  //选择
   select:function(e){
    var CheckAll = this.data.CheckAll;
    CheckAll = !CheckAll
    var cartItems = this.data.cartItems
   
    for(var i=0;i<cartItems.length;i++){
      cartItems[i].selected = CheckAll
    }

    this.setData({
      cartItems: cartItems,
      CheckAll: CheckAll
    })
    this.getsumTotal()
   },
   
    // 选择
   selectedCart:function(e){
    //console.log(e)
    var cartItems = this.data.cartItems   //获取购物车列表
    //console.log(cartItems)
    var index = e.currentTarget.dataset.index;  //获取当前点击事件的下标索引
    //console.log(index)
    var selected = cartItems[index].selected;    //获取购物车里面的value值
    //console.log(cartItems)
    //取反
    cartItems[index].selected =! selected;
    this.setData({
      cartItems: cartItems
    })
    this.getsumTotal(); 
    //console.log('BEIJING')
    //console.log(this.data.cartItems)
    wx.setStorageSync("cartItems", cartItems)
    //console.log(wx.getStorageSync("cartItems", cartItems))
   },

   //删除
   cartdel:function(e){
    var that =this
    wx.showModal({
     title: '提示',
     content: '确定要删除吗？',
     success: function (sm) {
    //console.log(sm)
    if (sm.confirm) {
          //购物车的id
     var id = e.currentTarget.dataset.index
     //console.log(id)
     var code = wx.getStorageSync('sessions')
     wx.request({
          url :"https://zq.muyaonet.com/api/Goods/deleteShoppingCartById",
          method : "POST",
          header: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: {
              'key':code,
              'cart_id_array':id,
              
          },
          success: function(reses){
              wx.request({
                url :"https://zq.muyaonet.com/api/Goods/getShoppingCart?key="+code,
                success: function(reses){
                    var cartItems = reses.data.data.getShoppingCart
                    //console.log(cartItems)
                    wx.setStorageSync("cartItems", cartItems)
                    that.setData({
                        cartItems: cartItems
                    })   
               } 
            })



              
         } 
      }) 

    }else {
      console.log('取消删除')
    }

 }
      })

   },
  
   //提交订单
   go:function(e){
     var code = wx.getStorageSync('sessions')
      console.log('数组的个数')
      var cartItems= wx.getStorageSync("cartItems")
      console.log(cartItems)
      var cart_id= new Array();
      for(var i=0;i<cartItems.length;i++){
         if (cartItems[i].selected) {
         
            cart_id[i]=cartItems[i]['cart_id']

         }
      }
      //console.log('做错了？')
      //console.log(cart_id)
      
     // console.log(this.bouncer(cart_id))

      var cart_id= this.bouncer(cart_id)
      var cart_ids=cart_id.join(',')
      wx.setStorageSync("cart_ids", cart_ids)
      var that=this;
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
              var  placeOrder= reses.data.data.paymentOrder
             // console.log('测试地址来的')
              //console.log(placeOrder)
             if (placeOrder.address==null) {
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
                        // console.log('用户点击取消')
                       }
                   }
                })

               /* wx.showToast({
                      title: '收货地址不能为空',
                      icon :'none',
                      duration: 2000
                 })
                 return false */


             }else {
                 wx.setStorageSync("placeOrder", placeOrder)
                 wx.navigateTo({
                    url: '/pages/pendingPaymentOrder/pendingPaymentOrder'
                 })
             }
             

         } 
      }) 

       
   },

  bouncer: function(arr) {
  // Don't show a false ID to this bouncer.
  return arr.filter(function(val){
    return !(!val || val === "");
  });
},


   //合计
   getsumTotal: function () {
     var sum = 0
     for (var i = 0; i < this.data.cartItems.length; i++) {
       if (this.data.cartItems[i].selected) {
         sum += this.data.cartItems[i].num * this.data.cartItems[i].price
       }
     }
     //更新数据
     this.setData({
       total: sum
     })
   }



})
