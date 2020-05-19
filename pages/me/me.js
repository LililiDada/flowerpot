const promise = require('../../utils/promise.js');
const app = getApp()

var config = require('../../utils/config')
var proficient_id = config.PROFICIENT_ID

Page({

  data: {
    onlineDevice: true,
    login: false,
    existDevice: false,
    deviceName: '',
    devIds: '',
    duration: ''

  },
  onShow: function() {
    var that = this
    promise.checkWxSession().then(res => {
      if (res) {
        // 实例化查询对象
        let query = new wx.BaaS.Query()
        // 应用查询对象
        let Device = new wx.BaaS.TableObject('device');
        Device.setQuery(query).find().then(res => {
          var deviceList = res.data.objects
        
          if (deviceList==''){
            that.setData({
              onlineDevice: false,
              login: false,
              existDevice: true
            })
          }else{
            for (var device of deviceList) {
              if (device.current_selection){
                var apikey = device.api_key
                var devIds = device.device_id
                var variety = device.variety
                wx.setStorageSync('apikey', apikey)
                wx.setStorageSync('devIds', devIds)
                wx.setStorageSync('variety', variety)
                wx.setStorageSync('deviceName', device.device_name)
                that.setData({
                  deviceName: device.device_name,
                  devIds: device.device_id,
                  duration: promise.duration(device.created_at),
                  onlineDevice: true,
                  login: false,
                  existDevice: false
                })

              }
            }
          }
          // var currentdevice = 
        }, err => {
          // err
        })










    //     promise.getrequest('equipment/getDetail').then(res => {
    //       console.log(res)
    //       if (res.data.errcode == undefined) {
    //         that.setData({
    //           onlineDevice: true,
    //           login: false,
    //           existDevice: false,
    //         })
    //         var apikey = res.data[0].apiKey
    //         var devIds = res.data[0].deviceId
    //         var variety = res.data[0].variety
    //         wx.setStorageSync('apikey', apikey)
    //         wx.setStorageSync('devIds', devIds)
    //         wx.setStorageSync('variety', variety)
    //         that.setData({
    //           deviceName: res.data[0].deviceName,
    //           devIds: res.data[0].deviceId,
    //           duration: res.data[0].days
    //         })
    //       }
    //     })
      }
    })
  },
  onLoad: function(options) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    promise.checkWxSession().then(res => {
      if (res) {
    //     //检验是否只登录，没添加设备
    //     var devIds = wx.getStorageSync('devIds')
    //     if (devIds == '') {
    //       this.setData({
    //         onlineDevice: false,
    //         login: false,
    //         existDevice: true,
    //       })
    //     } else {
    //       that.setData({
    //         onlineDevice: true,
    //         login: false,
    //         existDevice: false,
    //       })
    //       // var apikey = res.data[0].apiKey
    //       // var devIds = res.data[0].deviceId
    //       // var variety = res.data[0].variety
    //       // wx.setStorageSync('apikey', apikey)
    //       // wx.setStorageSync('devIds', devIds)
    //       // wx.setStorageSync('variety', variety)
    //       // that.setData({
    //       //   deviceName: res.data[0].deviceName,
    //       //   devIds: res.data[0].deviceId,
    //       //   duration: res.data[0].days
    //       // })
        // }
      } else {
          this.setData({
            onlineDevice: false,
            login: true,
          })

      }
      wx.hideLoading();
    });
  },

  replaceDevice: function() {
    wx.navigateTo({
      url: '../replaceDevice/replaceDevice'
    })

  },
  addDeviceTap: function() {
    wx.navigateTo({
      url: '../addDevice/addDevice'
    })
  },
  bindgetUserInfo(data){
    var that = this
    var userName = data.detail.userInfo.nickName
    var charImage = data.detail.userInfo.avatarUrl
    wx.setStorageSync('myUsername', userName)
    wx.setStorageSync('avatar', charImage)
    wx.BaaS.auth.loginWithWechat(data).then(user => {
      var id = user.id
      wx.setStorageSync('ID', id);
      // wx.setStorageSync('weather_register',false)判断用户是否进入过专家咨询页面
      that.onShow()
      
      // that.onShow()
    }, err => {

    })
    // promise.getcode().then(res => {
    //   return promise.getcookie('user/login', res, userName, charImage)
    // }).then(res => {
    //   var str = res.slice(0, -18);
    //   wx.setStorageSync('COOKIE', str);
      
    // })

  },
  exchangeTap:function(){
    wx.navigateTo({
      url: '../exchange/exchange',
    })
  },
  //跳转至咨询页面
  consultTap:function(){
    // var id = wx.getStorageSync('ID')
    // console.log(proficient_id,id)
    // if (id === parseInt(proficient_id)){
    //   console.log('hj')
    //   wx.navigateTo({
    //     url: '../chat/chat',
    //   })
    // }else{
    //   console.log('hjxx')
      wx.navigateTo({
        url: '../consult/consult',
      })
    // }
    
  },
  into_posts:function(){
    wx.navigateTo({
      url: '../posts/posts',
    })
  }
})