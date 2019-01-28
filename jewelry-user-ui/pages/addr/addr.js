var addr = require('../../utils/citys.js')
var animation
Page({
   data: {
    menuType: 0,
    begin: null,
    status: 1,
    end: null,
    isVisible: false,
    animationData: {},
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    province: '',
    city: '',
    area: ''
  },

  /**
   * 生命周期函数--监听页面加载  
   */
  onLoad: function (options) {
    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    // 默认联动显示北京
    //设置省市区的请求值
    //请求找到北京地区
    var that =this
    var code =wx.getStorageSync('sessions')
     //自定义的 获取省的列表
    //自定义的 获取北京的辖区列表
    wx.request({
        url :'https://zq.muyaonet.com/api/Member/getCity',
        method : "POST",
        header: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: {
            'key':code,
            'province_id':1
        },
        success: function(reses){
            //console.log('获取世纪的辖区')
            //console.log(reses.data.data.getCity)
            //获取省的列表
            var citys = reses.data.data.getCity
            
            that.setData({
              citys: citys
            })
        } 
    })

    //获取北京的县级列表
     wx.request({
        url :'https://zq.muyaonet.com/api/Member/getDistrict',
        method : "POST",
        header: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: {
            'key':code,
            'city_id':1
        },
        success: function(reses){
            //console.log('获取世纪的辖区')
            //console.log(reses.data.data.getDistrict)
            //获取省的列表
            var district = reses.data.data.getDistrict
            that.setData({
              areas: district
            })
        } 
    })
    

    var provinces= addr.provinces
    //console.log(provinces)
    that.setData({
          provinces: provinces
    })

    
  },
  
  // 点击所在地区弹出选择框
  selectDistrict: function (e) {
    var that = this
    
    if (that.data.addressMenuIsShow) {
      return
    }
    //调取执行动画
    that.startAddressAnimation(true)
  },
  // 执行动画
  startAddressAnimation: function (isShow) {
    //console.log(isShow) true
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    //动画的值
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    var that = this
    //确定选择的城市和值
    var city = that.data.city
    var value = that.data.value
    //console.log(city)
    //console.log(value)
    that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].province_name + ',' + that.data.citys[value[1]].city_name + ',' + that.data.areas[value[2]].district_name
      //保存省市县的id值
     //console.log(that.data.provinces[value[0]])
     //console.log(that.data.citys[value[1]])
     //console.log(that.data.areas[value[2]].district_id)
      //获取到的省的id 保存到缓存中
      wx.setStorageSync('provinces_id',that.data.provinces[value[0]].province_id)
      //获取到的市的id。保存到缓存中
      wx.setStorageSync('city_id',that.data.citys[value[1]].city_id)
      //获取到的区县的id。保存到缓存中
      wx.setStorageSync('district_id',that.data.areas[value[2]].district_id)
    that.setData({
      //选择后的最终的结果
      areaInfo: areaInfo,
    })
  },

  //隐藏的时候调用
  hideCitySelected: function (e) {
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {

    var value = e.detail.value
   
    //获取 省列表的数组
    var provinces = this.data.provinces 
    
    //h获取市的数组
    var citys = this.data.citys 
    //获取地区的数组
    var areas = this.data.areas 
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]

    if (this.data.value[0] != provinceNum) {
      //选中的相关省的id值
      var province_id = provinces[provinceNum].province_id // 省的id
      //查找相关的城市的数组的列表
      //自定义的 获取北京的辖区列表
      var code =wx.getStorageSync('sessions')
      var that =this
    wx.request({
        url :'https://zq.muyaonet.com/api/Member/getCity',
        method : "POST",
        header: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: {
            'key':code,
            'province_id':province_id
        },
        success: function(reses){
            //获取市的列表
            var citys = reses.data.data.getCity
            that.setData({
              citys: citys
            })
            wx.setStorageSync('citys',citys)
            //console.log(wx.getStorageSync('citys'))
        } 
    })
    
     //console.log(wx.getStorageSync('citys'))
     //获取相关的城市的数组值
     var cityValue= wx.getStorageSync('citys')[value[1]]
     //console.log(cityValue)
     //获取区级的数组列表
     wx.request({
        url :'https://zq.muyaonet.com/api/Member/getDistrict',
        method : "POST",
        header: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: {
            'key':code,
            'city_id':cityValue['city_id']
        },
        success: function(reses){
            
            //console.log(reses.data.data.getDistrict)
            //获取省的列表
            var district = reses.data.data.getDistrict
            
            that.setData({
              areas: district
            })
        } 
    })
    
      this.setData({
        //索引值
        value: [provinceNum, 0, 0],
        //相关城市数组列表
        //citys: address.citys[id],
         //相关地区数组的列表
        //areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum]['city_id']
      //console.log('这是什么市区的id？')
      //console.log(id)
      //根据城市的id 获取相关的区县
      var code =wx.getStorageSync('sessions')
      var that =this
      wx.request({
        url :'https://zq.muyaonet.com/api/Member/getDistrict',
        method : "POST",
        header: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: {
            'key':code,
            'city_id':id
        },
        success: function(reses){          
            //console.log(reses.data.data.getDistrict)
            //获取省的列表
            var district = reses.data.data.getDistrict
            //console.log('这个不对么？')
            //console.log(district)
            that.setData({
              areas: district
            })
        } 
    })
      this.setData({
        value: [provinceNum, cityNum, 0],
        //areas: address.areas[citys[cityNum].id],
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
    //console.log(this.data)
  },
  //form表单提交数据
  formSubmit:function(e){
    var values = e.detail.value
    //console.log(values)
    if (values.userName=="" || values.userName=="姓名" ) {
        wx.showToast({
          title: '收件人不能为空',
          icon :'none',
          duration: 2000
        })
        return false
     }
     if (values.tel=="" || values.tel=="11位手机号码") {
        wx.showToast({
          title: '手机号不能为空',
          icon :'none',
          duration: 2000
        })
        return false

     }
     if (values.addrDetail==""||values.addrDetail=="详细地址") {
        wx.showToast({
          title: '收件地址不能为空',
          icon :'none',
          duration: 2000
        })
        return false
     }else{
    var userName = values.userName
    var tel= values.tel
    var addrDetail= values.addrDetail
    var zipCode= values.zipCode
    var pro = wx.getStorageSync('provinces_id')
    var city = wx.getStorageSync('city_id')
    var district = wx.getStorageSync('district_id')
    var code = wx.getStorageSync('sessions')
    //console.log(code)
    wx.request({
        url: 'https://zq.muyaonet.com/api/Member/addressInsert', 
        data: {
            key:code,
           type: 'add' ,
           consigner: userName, //收件人
           mobile:  tel,
           phone:  ''  ,//电话
           province:pro,
           city:city ,
           district:district ,
           address: addrDetail ,
           zip_code: zipCode,
        },
        method:'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function(res) {
             wx.navigateBack({
              url: 'pages/addrShow/addrShow'
            })
        }
    })

  }

  },

cancel:function(){
       wx.navigateBack({
          url: 'pages/addrShow/addrShow'
        })
    } 

});