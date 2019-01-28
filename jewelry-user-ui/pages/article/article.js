Page({
  data: { 
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
            })

          }  
        })
   },



 onLoad:function(option){
 	//文章的id
    var article_id = option.id
    var that =this
    wx.request({
	  url: 'https://zq.muyaonet.com/api/Articlecenter/articleContent',
	  method : "POST",
	  data: {
	     article_id: article_id,  
	  },
	  header: {
	      'content-type': 'application/x-www-form-urlencoded' // 默认值   
	  },
	  success: function(res) {
	     //console.log(res.data.data.article_content)
        var artilcle = res.data.data.article_content
        //console.log(res.data.data.article_content.content)
        var contnet =res.data.data.article_content.content
       // console.log('这个是详情的东西么?')
       // console.log(contnet)
        var contents=  contnet.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ')
        //console.log(artilcle.title)
       // console.log(contents)
        var contentss =contents.replace(/\<span style='/gi, "<span style='line-height:40px; ")
        //console.log(contentss)
        wx.setNavigationBarTitle({  
	      title: artilcle.title,
	    })
        wx.setStorageSync('id',res.data.data.article_content.article_id)
        wx.setStorageSync('title',res.data.data.article_content.title)
        console.log(contentss)
        that.setData({
          contents:contentss,
          articleContent:res.data.data.article_content,
        });
	  }
	})
  wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
 },
 
 convertHtmlToText: function (inputText) {
    var returnText = "" + inputText;
    returnText = returnText.replace(/<\/div>/ig, '\r\n');
    returnText = returnText.replace(/<\/li>/ig, '\r\n');
    returnText = returnText.replace(/<li>/ig, '  *  ');
    returnText = returnText.replace(/<\/ul>/ig, '\r\n');
    //-- remove BR tags and replace them with line break
    returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r\n");

    //-- remove P and A tags but preserve what's inside of them
    returnText=returnText.replace(/<p.*?>/gi, "\r\n");
    returnText=returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

    //-- remove all inside SCRIPT and STYLE tags
    returnText=returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
    returnText=returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
    //-- remove all else
    returnText=returnText.replace(/<(?:.|\s)*?>/g, "");

    //-- get rid of more than 2 multiple line breaks:
    returnText=returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");

    //-- get rid of more than 2 spaces:
    returnText = returnText.replace(/ +(?= )/g,'');

    //-- get rid of html-encoded characters:
    returnText=returnText.replace(/ /gi," ");
    returnText=returnText.replace(/&/gi,"&");
    returnText=returnText.replace(/"/gi,'"');
    returnText=returnText.replace(/</gi,'<');
    returnText=returnText.replace(/>/gi,'>');

   return returnText;
},



 //页面转发
  onShareAppMessage: function (res) {
    //console.log(res)
     var id= wx.getStorageSync('id')
     var title= wx.getStorageSync('title')
    return {
      title: title,
      path: '/pages/article/article?id='+id,
      success: function(res) {
        
      },
      
    }
  }
  
})
