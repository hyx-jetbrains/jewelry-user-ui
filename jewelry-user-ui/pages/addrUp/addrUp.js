var address = require('../../utils/citys.js')
//var addr = require('../../utils/citys.js')
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
     var that =this
    //地址id
    var addrId= options.id
    var code = wx.getStorageSync('sessions')
    wx.request({
        url: 'https://zq.muyaonet.com/api/Member/updateMemberAddress', 
        data: {
            key:code,
            id: addrId
        },
        method:'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function(res) {
          console.log(res.data.data.updateMemberAddress)
        }
    })

  



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
   

    //查找北京省级数组中的北京的id. 默认是北京地区
    var id = address.provinces[0].id  //北京这个省的id
    console.log(id)
    console.log(address.provinces)
    console.log(address.citys[id])
    console.log(address.areas[address.citys[id][0].id])
    //默认是北京
   this.setData({

      provinces: address.provinces,
      //北京的辖市区
      citys: address.citys[id],
      //北京的地区
      areas: address.areas[address.citys[id][0].id],
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
    that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + ',' + that.data.citys[value[1]].name + ',' + that.data.areas[value[2]].name
      /*console.log('testsss')
      console.log(areaInfo)  //选择好的省市区的文字
      console.log('tehggafga') */
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
     console.log('tesggg')
    console.log(e) //每次滑动一次 单选的时候显示的值 索引值

    var value = e.detail.value
    console.log('beijkinfdsafdsafdsa')
    console.log(value)
    console.log('fdsafdsafdsafdsafdsafdsa')
    var provinces = this.data.provinces //获取 省的数组
    console.log('beijinggggggg')
    console.log(provinces)
    console.log('daliannnnnnn')
    //h获取市的数组
    var citys = this.data.citys 
    console.log('这是获取市级的数组么？怎么是北京的？')
    console.log(citys)
    //获取地区的数组
    var areas = this.data.areas 
    console.log('这是获取地区的数组么？怎么是北京的？')
    console.log(areas)
    console.log(this.data.value[0])
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]

    if (this.data.value[0] != provinceNum) {

      var id = provinces[provinceNum].id // 省的id
      console.log('相关省的id？？根据这个id查找相关的市区')
      console.log(id)
      console.log('这是相关的地区级的id')
      console.log(address.areas[address.citys[id][0].id])
      this.setData({
        value: [provinceNum, 0, 0],
        //城市
        citys: address.citys[id],
         //地区
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id
      console.log('这是什么市区的id？')
      console.log(id)
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
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
    if (values.userName=="") {
        wx.showToast({
          title: '收件人不能为空',
          icon :'none',
          duration: 2000
        })
     }
     if (values.tel=="") {
        wx.showToast({
          title: '手机号不能为空',
          icon :'none',
          duration: 2000
        })
     }
     if (values.addrDetails==""||values.addrDetail=="") {
        wx.showToast({
          title: '收件地址不能为空',
          icon :'none',
          duration: 2000
        })
     }
    
    //添加地址
    //console.log(e)
    /*var values = e.detail.value
    console.log(values)
    console.log(values.userName) */
    var userName = values.userName
    var tel= values.tel
    var addrDetail= values.addrDetail
    var zipCode= values.zipCode
    var pro = values.provincesss[0]
    var city = values.provincesss[1]
    var district = values.provincesss[2]
    console.log()
    var code = wx.getStorageSync('sessions')
    console.log(code)

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
          console.log(res)
        }
    })

  },

cancel:function(){
       wx.navigateBack({
          url: 'pages/addrShow/addrShow'
        })
    } 

});