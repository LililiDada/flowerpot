var app = getApp()
const promise = require('../../utils/promise.js');
Page({

  data: {
    backgroundUrl:'https://cloud-minapp-29237.cloud.ifanrusercontent.com/1hvgjbzBDiqf9joU.jpg',
    varietyList:['玫瑰','仙人掌','向日葵','吊兰'],
    varietyindex:0,
    variety:'玫瑰',//品种
    deviceId:'',//设备id
    deviceName:'',//设备名称
    apiKep:''
  },

  onLoad: function (options) {

  },

 
  onReady: function () {

  },

  imageLoad:function(e){
    var res = wx.getSystemInfoSync();
    this.data.windowHeight = res.windowHeight;
    this.setData({
      imagewidth: res.windowWidth,
      imageheight: res.windowHeight
    })
  },
  onShow: function () {
    //背景图片在手机预览无法显示，需进行转码
    let base64 = wx.getFileSystemManager().readFileSync(this.data.backgroundUrl, 'base64');
    this.setData({
      backgroundUrl: 'data:image/jpg;base64,' + base64
    });
  },
  //获取设备品种
  getChangeVariety:function(e){
    var index = e.detail.value;
    var that = this;
    var currentvariety = that.data.varietyList[index]
    this.setData({
      varietyindex: index,
      variety: currentvariety,
    })
  },
  //获取设备名字
  getDeviceName:function(e){
    this.setData({
      deviceName: e.detail.value
    })
  },
  //获取设备Id
  getDeviceId:function(e){
    this.setData({
      deviceId: e.detail.value
    })
  },
  //获取设备apiKey
  getDeviceKey:function(e){
    var apikey = escape(e.detail.value)
    this.setData({
      apiKey: e.detail.value
    })
  },
  //添加设备
  addDeviceTap:function(){
    var that = this
    var options={
      variety: that.data.variety,
      device_id: that.data.deviceId,
      device_name: that.data.deviceName,
      api_key: that.data.apiKey,
      current_selection:true
    }


    let Device = new wx.BaaS.TableObject('device')
    let Newdevice = Device.create()
    Newdevice.set(options).save().then(res => {
      // success
      console.log(res)
      var errMsg = res.errMsg
      if(errMsg==="request:ok"){
       var devIds = wx.getStorageSync('devIds')//获取最新登录设备的ID
        try{
          //此处是可能出现例外的语句
          console.log(devIds)
          if (!devIds) {
            //已存在设备
            let query = new wx.BaaS.Query()
            query.compare("device_id", "=", devIds)
            let records = Device.getWithoutData(query)
            records.set('current_selection', false)
            //最新设备更换成刚添加的设备，因此将其他current_selection设为false
            records.update().then(res => {
              console.log(res)
              if (res.errMsg === "request:ok") {
                wx.showToast({
                  title: '添加设备成功!',
                  icon: 'success',
                  duration: 1500
                })
                setTimeout(function () {
                  wx.switchTab({
                    url: '../me/me'
                  })
                }, 1500)
              }
            }, err => {
              // err
            })
          }else{
            //还未添加设备，即第一次添加设备
            wx.showToast({
              title: '添加设备成功!',
              icon: 'success',
              duration: 1500
            })
            setTimeout(function () {
              wx.switchTab({
                url: '../me/me'
              })
            }, 1500)
          }
        }catch(error){
          //此处是负责例外处理的语句
          wx.showToast({
            title: '添加设备失败!',
            icon: 'success',
            duration: 1500
          })
          that.setData({
            deviceId: '',//设备id
            deviceName: '',//设备名称
            apiKep: ''
          })
        }
      }
    }, err => {
      //err 为 HError 对象
    })
  }
})