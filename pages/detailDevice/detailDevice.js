var app = getApp()
const promise = require('../../utils/promise.js');
Page({
  data: {
    devicename:'',
    variety:'',
    deviceId:'',
    startTime:'',
    apiKey:'',
    ifcurrent:true,
  },

  onLoad: function (options) {
    var that = this 
    console.log(options)
    var devIds = wx.getStorageSync('devIds')//获取最新登录设备的ID
    if (devIds===options.deviceId){
      that.setData({
        ifcurrent: false,
      })
    }
    this.setData({
      devicename: options.devicename,
      variety: options.variety,
      deviceId: options.deviceId,
      startTime: options.startTime,
      apiKey: options.apiKey
    })

  },
  deleteTap:function(e){
    var that = this 
    wx.showModal({
      title: '删除设备',
      content: '是否确定删除',
      showCancel: true,
      success: function(res) {
        if (res.confirm) {
          // var options={
          //   equipmentId: that.data.equipmentId
          // }
          // promise.getrequest('equipment/delete',options).then(res=>{
          //   if(res.data.errcode==1000&&errmsg==true){
          //     wx.navigateBack({
          //       delta:2
          //     })
          //   }
          // })
          let Device = new wx.BaaS.TableObject('device')

          let query = new wx.BaaS.Query()
          var deviceId = that.data.deviceId
          query.compare("device_id", "=", deviceId)

          Device.delete(query).then(res => {
            if (res.statusCode===200){
              wx.showToast({
                title: '删除设备成功！',
                icon: 'success',
                duration: 1500
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta:2
                })
              }, 1500)
            }
          }, err => {
            console.log(err)
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  changeTap:function(e){
    var that = this;
    wx.showModal({
      content: '确定更换此设备?',
      success(res) {
        if (res.confirm) {
          var deviceId = that.data.deviceId
          let Device = new wx.BaaS.TableObject('device')
          var devIds = wx.getStorageSync('devIds')//获取最新登录设备的ID

          //将当前的设为最新选择的设备
          let query = new wx.BaaS.Query()
          query.compare("device_id", "=", deviceId)
          let records = Device.getWithoutData(query)
          records.set('current_selection', true)
          records.update().then(res => {
            if (res.errMsg === "request:ok") {
              //将之前缓存的最新设备变成现在选择的
              let query1 = new wx.BaaS.Query()
              query1.compare("device_id", "=", devIds)
              let record = Device.getWithoutData(query1)
              record.set('current_selection', false)
              record.update().then(res => {
                console.log(res)
                wx.showToast({
                  title: '更换设备成功！',
                  icon: 'success',
                  duration: 1500
                })
                setTimeout(function () {
                  wx.switchTab({
                    url: '../me/me'
                  })
                }, 1500)
              }, err => {

              })

            }
          }, err => {

          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  alterTap:function(e){
    var data = this.data
    wx.redirectTo({
      url: '../alterDevice/alterDevice?deviceName=' + data.devicename + '&&variety=' + data.variety + '&&deviceId=' + data.deviceId + '&&startTime=' + data.startTime + '&&apiKey=' + data.apiKey,
    })
  }
})