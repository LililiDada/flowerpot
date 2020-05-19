var app = getApp()
const promise = require('../../utils/promise.js');
Page({

  data: {
    noSelect: '../../images/uncheck.png',
    hasSelect: '../../images/select.png',
    state: false,
    type: []
  },

  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
    })

    let query = new wx.BaaS.Query()
    // 应用查询对象
    let Device = new wx.BaaS.TableObject('device');
    Device.setQuery(query).find().then(res => {
      console.log(res.data.objects)
      var products = []
      for (var i of res.data.objects) {
        var temp = {
          devicename: i.device_name,
          status: i.current_selection,
          deviceId: i.device_id,
          variety: i.variety,
          startTime: promise.addTime(i.created_at),
          apiKey: i.api_key
        }
        products.push(temp)
      }
      this.setData({
        type: products
      })
    })
    // promise.getrequest('equipment/get').then(res => {
    //   var subject = []
    //   for (var i in res.data) {
    //     var temp = {
    //       id: res.data[i].equipmentId,
    //       devicename: res.data[i].deviceName,
    //       status: false,
    //       deviceId: res.data[i].deviceId,
    //       variety: res.data[i].variety,
    //       startTime: res.data[i].startTime,
    //       equipmentId: res.data[i].equipmentId
    //     }
    //     subject.push(temp)
    //   }
    //   this.setData({
    //     type: subject
    //   })
    wx.hideLoading();
    // })


  },
  addDevice: function() {
    wx.navigateTo({
      url: '../addDevice/addDevice',
    })
  },
  detailDeviceTap: function(e) {
    var detail = e.currentTarget.dataset.item
    console.log(detail)
    var devicename = detail.devicename //设备名
    var variety = detail.variety //品种
    var deviceId = detail.deviceId //设备ID
    var startTime = detail.startTime //添加时间
    var apiKey = detail.apiKey
    console.log(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '../detailDevice/detailDevice?devicename=' + devicename + '&&variety=' + variety + '&&deviceId=' + deviceId + '&&startTime=' + startTime + '&&apiKey=' + apiKey,
    })
  },
  selectTap: function(e) {
    console.log(e)
    var deviceId = e.currentTarget.dataset.deviceid
    var index = e.currentTarget.dataset.selectid; //获取当前点击的下标
    var type = this.data.type; //选项集合
    if (type[index].status) { //如果点击的当前已选中则返回
      console.log('dhc,jzhc')
      return;
      // wx.showModal({
      //   content: '确定更换此设备?',
      //   success(res) {
      //     if (res.confirm) {

      // var options = {
      //   equipmentId: equipmentId
      // }
      // promise.getrequest('equipment/update', options).then(res => {
      //   console.log(res)
      //   wx.showToast({
      //     title: '更换设备成功！',
      //     icon: 'success',
      //     duration: 1500
      //   })
      //   setTimeout(function() {
      //     wx.switchTab({
      //       url: '../me/me'
      //     })
      //   }, 1500)
      // })

      // let Device = new wx.BaaS.TableObject('device')
      // var devIds = wx.getStorageSync('devIds') //获取最新登录设备的ID

      // //将当前的设为最新选择的设备
      // let query = new wx.BaaS.Query()
      // query.compare("device_id", "=", deviceId)
      // let records = Device.getWithoutData(query)
      // records.set('current_selection', true)
      // records.update().then(res => {
      //   if (res.errMsg === "request:ok") {
      //     //将之前缓存的最新设备变成现在选择的
      //     let query1 = new wx.BaaS.Query()
      //     query.compare("device_id", "=", devIds)
      //     let record = Device.getWithoutData(query)
      //     record.set('current_selection', false)
      //     record.update().then(res => {
      //       wx.showToast({
      //         title: '更换设备成功！',
      //         icon: 'success',
      //         duration: 1500
      //       })
      //       setTimeout(function() {
      //         wx.switchTab({
      //           url: '../me/me'
      //         })
      //       }, 1500)
      //     }, err => {

      //     })

      //   }
      // }, err => {

      // })
      // }
      //  else if (res.cancel) {

      //  }
    }
    // })
  // };
  type.forEach(item => {
    item.status = false
  })
  type[index].status = true; //改变当前选中的status值
  this.setData({
    type: type
  });
  wx.showModal({
    content: '确定更换此设备?',
    success(res) {
      if (res.confirm) {
        console.log(deviceId)
        let Device = new wx.BaaS.TableObject('device')
        var devIds = wx.getStorageSync('devIds') //获取最新登录设备的ID

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
              setTimeout(function() {
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
onShow: function() {

}
})