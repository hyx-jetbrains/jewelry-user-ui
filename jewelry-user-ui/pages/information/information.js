Page({
  data: {
    articleTitle: []
  },

  onLoad: function () {
     var that =this
      //文章列表
     var urls="https://zq.muyaonet.com/api/Articlecenter"
      wx.request({
          url :urls,
          method : "POST",
          header: {'content-type': 'application/x-www-form-urlencoded'},
          data: {
          },
          success: function(reses){
              //console.log(reses.data.data.article_list)
              //获取的文章列表的返回值
              var articleList = reses.data.data.article_list;
              //var date = new Date(timestamp * 1000);
              for (var i = 0; i <articleList.length ; i++) {
                   //获取的添加时间的时间戳
                   var times= articleList[i].create_time
                  articleList[i]['timess'] =that.timestampToTime(times)
              }
            
             that.setData({articleTitle:articleList});
          }  
      })


    that.setData({
      articleTitle:this.data.articleTitle
    })
  },
  //时间戳转换成 2018-09-09 格式
  timestampToTime:function(timestamp) {
        var date = new Date(timestamp * 1000)
        var dates= date.getFullYear() + '-'+(date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'+date.getDate()
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


   //屏幕向上滑事件
   onReachBottom: function() {
       console.log('bneijking')
   },
  
  imgHeight:function(e){
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    var imgh=e.detail.height;//图片高度
    var imgw=e.detail.width;//图片宽度
    var swiperH=winWid*imgh/imgw + "rpx"//等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    this.setData({
      Height:swiperH//设置高度
    })
  },


    //页面转发
    onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '珠宝日记',
      path: '/pages/information/information',
      success: function(res) {
        // 转发成功
        //console.log(res)
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
   




})
