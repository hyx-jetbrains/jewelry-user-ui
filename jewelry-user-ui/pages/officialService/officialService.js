Page({
  
   onLoad:function(){
      var urlDetails="https://zq.muyaonet.com/api/index/getTel"
      var that =this

     wx.request({
            url :urlDetails,
            method : "POST",
            header: {'content-type': 'application/x-www-form-urlencoded'},
            success: function(reses){
            
                var connect= reses.data.data.niu_index_response
              
                that.setData({
                   connect:connect
                })
                 
                
            } 
        });
   },
   //打电话
   tel:function(e){
    var tel = e.currentTarget.id
   	 wx.makePhoneCall({
       phoneNumber: tel
     })
   }
}) 
