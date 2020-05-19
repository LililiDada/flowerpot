var app = getApp()
const promise = require('../../utils/promise.js');
Page({

  data: {
    backgroundUrl: 'https://cloud-minapp-29237.cloud.ifanrusercontent.com/1hvgjbzBDiqf9joU.jpg',
    varietyList: ['玫瑰', '仙人掌', '向日葵', '吊兰'],
    varietyindex: 0,
    variety: '玫瑰',//品种
    deviceId: '',//设备id
    deviceName: '',//设备名称
    apiKey: '',
    startTime:''
  },

  onLoad: function (options) {
    console.log(options)
    var that = this 
    var varietyList = this.data.varietyList
    for (var index in varietyList){
      if (varietyList[index]==options.variety){
        that.setData({
          varietyindex:index
        })
      }
    }
    this.setData({
      variety: options.variety,
      apiKey: options.apiKey,
      deviceName: options.deviceName,
      startTime: options.startTime,
      deviceId: options.deviceId
    })
  },


  onReady: function () {

  },

  imageLoad: function (e) {
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
  getChangeVariety: function (e) {
    var index = e.detail.value;
    var that = this;
    var currentvariety = that.data.varietyList[index]
    this.setData({
      varietyindex: index,
      variety: currentvariety,
    })
  },
  //获取设备名字
  getDeviceName: function (e) {
    this.setData({
      deviceName: e.detail.value
    })
  },
  //获取设备Id
  getDeviceId: function (e) {
    this.setData({
      deviceId: e.detail.value
    })
  },
  //获取设备apiKey
  getDeviceKey: function (e) {
    this.setData({
      apiKey: e.detail.value
    })
  },
  //修改设备创建时间
  getDeviceData:function(e){
    this.setData({
      startTime: e.detail.value
    })
  },
  //修改设备
  changeDeviceTap: function () {
    var that = this
    var data = that.data
    var options = {
      variety: that.data.variety,
      device_id: that.data.deviceId,
      device_name: that.data.deviceName,
      api_key: that.data.apiKey,
      created_at: that.data.startTime
    }
    try {
      let Device = new wx.BaaS.TableObject('device')
      let query = new wx.BaaS.Query()
      var device_id = that.data.deviceId
      query.compare("device_id", "=", device_id)
      let records = Device.getWithoutData(query)
      records.set(options)
      records.update().then(res => {
        console.log(res)
        if (res.statusCode === 200) {
          wx.showToast({
            title: '修改设备成功!',
            icon: 'success',
            duration: 1500
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../detailDevice/detailDevice?devicename=' + data.deviceName + '&&variety=' + data.variety + '&&deviceId=' + data.deviceId + '&&startTime=' + data.startTime + '&&apiKey=' + data.apiKey,
            })
          }, 1500)
        }
      }, err => {
        // err
      })

    } catch (error) {
      //此处是负责例外处理的语句
      wx.showToast({
        title: '修改设备失败!',
        icon: 'success',
        duration: 1500
      })
     
    }
  }
})