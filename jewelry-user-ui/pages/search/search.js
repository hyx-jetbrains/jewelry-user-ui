Page({
  data: {
  
  },
  bindSearch:function(e){
     //console.log(e)
     var search= e.detail.value
    // wx.setStorageSync('search', search)
      wx.redirectTo({
       url:'../goodslist/goodslist?content='+search
     })
  },
  cancel:function(){
  	wx.navigateBack({
  		url:'pages/index/index'
  	})
  }
  
})
