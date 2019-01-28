const app = getApp()
Page({
  data: {
    navbar: ['默认', '销售量', '新品','价格'],
    navbars:[
       {
        'id':1,
        'name':'默认'
       },{
        'id':2,
        'name':'销售量'
       },{
        'id':3,
        'name':'新品'
       },{
        'id':4,
        'name':'价格'
       }
    ],
    currentTab: 0,
  },
  

  onLoad: function (options) {
     //console.log(options.category_id)
     //console.log(options.content)
     if (options.category_id !='' && typeof(options.content) == 'undefined') {
          var that = this
          var urls = 'https://zq.muyaonet.com/api/goods/goodsList'
          wx.request({ 
                url : urls,
                method : "POST",
                header: {'content-type': 'application/x-www-form-urlencoded'},
                data:{
                  category_id:options.category_id
                },
                success: function(reses){
                
                   var goodsList = reses.data.data.niu_index_response.data
                   console.log('北京sss')
                   console.log(goodsList)
                  that.setData({
                       goodsList:goodsList
                   })  
                } 
          }); 
     }else if (options.content !='' && typeof(options.category_id) == 'undefined' ) {
        //获取搜索关键词
        var searchContent = options.content
        wx.setStorageSync('search',searchContent)
        var that = this
        var urls = 'https://zq.muyaonet.com/api/goods/goodsSearchList'
        wx.request({ 
              url : urls,
              method : "POST",
              header: {'content-type': 'application/x-www-form-urlencoded'},
              data:{
                sear_name:searchContent
              },
              success: function(reses){  
                 var goodsList = reses.data.data.niu_index_response.data
                
                 that.setData({
                     goodsList:goodsList
                 })    
              } 
        })
    }
    

    
    //适配高度
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res.windowHeight)
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });

     that.setData({
            navbars:that.data.navbars
        })
    },
    

  //页面转发
    onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
     // console.log(res.target)
    }
    return {
      title: '搜索页面',
      path: '/pages/information/information',
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
    /*做判断*/
    var indexs =e.currentTarget.dataset.idx   /*索引值*/
    var id =e.currentTarget.dataset.variable /*列表的id值*/
    var that =this
     
    if (e.currentTarget.dataset.idx==1) {
        //console.log('销量')
        var searchContent = wx.getStorageSync('search')
        var that = this
        var urls = 'https://zq.muyaonet.com/api/goods/goodsSearchList'
        wx.request({ 
              url : urls,
              method : "POST",
              header: {'content-type': 'application/x-www-form-urlencoded'},
              data:{
                //搜索的内容
                sear_name:searchContent,
                sear_type:1,    //固定值1就行
                order:'ng.sales',
                sort:'desc',
                //页数
                page:1
              },
              success: function(reses){  
                 var goodsList = reses.data.data.niu_index_response.data
                 that.setData({
                     goodsList:goodsList
                 })    
              } 
        }); 

    }else if (e.currentTarget.dataset.idx==2) {
       //console.log('新品')
       var searchContent = wx.getStorageSync('search')
        var that = this
        var urls = 'https://zq.muyaonet.com/api/goods/goodsSearchList'
        wx.request({ 
              url : urls,
              method : "POST",
              header: {'content-type': 'application/x-www-form-urlencoded'},
              data:{
                //搜索的内容
                sear_name:searchContent,
                sear_type:1,    //固定值1就行
                order:'ng.is_new',
                //sort:'desc',
                //页数
                page:1
              },
              success: function(reses){  
                 var goodsList = reses.data.data.niu_index_response.data
                 that.setData({
                     goodsList:goodsList
                 })    
              } 
        }); 
       
    }else if (e.currentTarget.dataset.idx==3) {
       
        var searchContent = wx.getStorageSync('search')
        var that = this
        var urls = 'https://zq.muyaonet.com/api/goods/goodsSearchList'
        wx.request({ 
              url : urls,
              method : "POST",
              header: {'content-type': 'application/x-www-form-urlencoded'},
              data:{
                //搜索的内容
                sear_name:searchContent,
                sear_type:1,    //固定值1就行
                order:'ng.promotion_price',
                sort:'desc',
                //页数
                page:1
              },

              success: function(reses){  
                 
                 var goodsList = reses.data.data.niu_index_response.data
                 that.setData({
                     goodsList:goodsList
                 })    
              } 
        }); 
    }

    that.setData({  
      currentTab: e.currentTarget.dataset.idx
    })

  },
 
bindSearch:function(e){  
     //用户搜索填写的的内容
     var searchContent= e.detail.value
     wx.setStorageSync('search',searchContent)
      var that = this
      var urls = 'https://zq.muyaonet.com/api/goods/goodsSearchList'
      wx.request({ 
            url : urls,
            method : "POST",
            header: {'content-type': 'application/x-www-form-urlencoded'},
            data:{
              sear_name:searchContent
            },
            success: function(reses){  
               var goodsList = reses.data.data.niu_index_response.data
               that.setData({
                   goodsList:goodsList
               })    
            } 
      }); 
     
  },

})
