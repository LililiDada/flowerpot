const app = getApp()
const promise = require('../../utils/promise.js');
const weather=require('../../utils/amap-wx.js');

var date = new Date(); //定义日期对象
const year = date.getFullYear()
const month = date.getMonth() + 1
const day = date.getDate()
var weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]; // 定义数组对象，给每个数组项赋值
var mynum = date.getDay(); //返回值存储在变量mynum中
var week = weekday[mynum]
var today = year + '.' + month + '.' + day



Page({
  data: {
    week: week,
    date: today,
    tipUrl: '../../images/cue.png',
    open: false,
    state: false,
    first_click: false,
    status: false,
    firstclick: false,
    tip: false,
    light_status: '无',
    airquality: '无',
    shidu: 0,
    tuhumi: 0,
    guangzhao: 0,
    wendu: 0,
    water: 'OFF',
    automatic: 'OFF',
    waterState: false,
    automaticState: false,
    temperature:0,
    time:''
  },
  //设备离线提示
  onlineTap: function() {
    wx.showModal({
      title: '温馨提示',
      content: "‘未登录’或‘设备不在线’",
    })
  },

  //展开水磊状态提示
  tipTap: function() {
    var that = this
    console.log(this.data.open)
    var list_state = this.data.state,
      first_state = this.data.first_click;
    if (!first_state) {
      this.setData({
        first_click: true
      });
    }
    if (list_state) {
      this.setData({
        state: false
      });
    } else {
      this.setData({
        state: true
      });
    }
  },
  //展开手动模式提示
  tipTaptwo: function() {
    var that = this
    var list_state = this.data.status,
      first_state = this.data.firstclick;
    if (!first_state) {
      this.setData({
        firstclick: true
      });
    }
    if (list_state) {
      this.setData({
        status: false
      });
    } else {
      this.setData({
        status: true
      });
    }
  },

  getData: function() {
    var that = this
    var options = {
      'devIds': wx.getStorageSync('devIds')
    }
    promise.getHardware('devices/datapoints', options, 'get').then(res => {
      // console.log(res.data.data.devices[0].datastreams)
      var datastreams = res.data.data.devices[0].datastreams
      for (var i in datastreams) {
        if (datastreams[i].id == "light_status") {
          that.setData({
            light_status: datastreams[i].value
          })
        }
        if (datastreams[i].id == 'airquality') {
          that.setData({
            airquality: datastreams[i].value
          })
        }
        //水磊状态
        if (datastreams[i].id == 'water') {
          if (datastreams[i].value == '关') {
            that.setData({
              water: 'OFF',
              waterState: false
            })
          } else {
            that.setData({
              water: 'ON',
              waterState: true
            })
          }

        }
        //手动模式
        if (datastreams[i].id == 'state') {
          if (datastreams[i].value == 0) {
            that.setData({
              automatic: 'OFF',
              automaticstate: false
            })
          } else {
            that.setData({
              automatic: 'ON',
              automaticstate: true
            })
          }

        }
        if (datastreams[i].id == 'shidu') {
          that.setData({
            shidu: datastreams[i].value
          })
        }
        if (datastreams[i].id == 'tuhumi') {
          that.setData({
            tuhumi: datastreams[i].value
          })
        }
        if (datastreams[i].id == 'guangzhao') {
          that.setData({
            guangzhao: datastreams[i].value
          })
        }
        if (datastreams[i].id == 'wendu') {
          that.setData({
            wendu: datastreams[i].value
          })
        }
      }
    })
  },

  cue: function() {
    var that = this
    that.setData({
      tip: true
    })
    setInterval(function() {
      that.setData({
        tipUrl: '../../images/tip.png'
      })
    }, 1000)
    setInterval(function() {
      that.setData({
        tipUrl: '../../images/cue.png'
      })
    }, 2000)
  },

  onLoad: function() {
    var that=this
    var myAmapFun = new weather.AMapWX({ key: '93c87212d5b983585d5580bf576d5679' });
    myAmapFun.getWeather({
      success: function (data) {
        //成功回调
        console.log(data.temperature.data)
        that.setData({
          temperature: data.temperature.data
        })
      },
      fail: function (info) {
        //失败回调
        console.log(info)
      }
    })
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
   
    var devIds = wx.getStorageSync('devIds');
    var that = this
    promise.checkWxSession().then(res => {
      if (res) {
        if (devIds != undefined || devIds != '') {
          promise.deviceExist().then(res => {
            if (res) {
              that.setData({
                tip: false
              })
              this.getData()
            } else {
              this.cue()
            }

          })

        } else {
          this.cue()
        }
      } else {
        this.cue()
      }
      wx.hideLoading();
    })
   
  },

  requireData:function(){
   
  },
  waterStateTap: function() {
    var devIds = wx.getStorageSync('devIds')
    var that = this
    if (devIds == undefined || devIds == '') {
      wx.showModal({
        title: '温馨提示',
        content: '设备不在线或用户未登录',
        showCancel: false
      })
    } else {
      var url = 'cmds?device_id=' + wx.getStorageSync('devIds')
      promise.deviceExist().then(res => {
        if (res) {
          if (that.data.water == 'ON') {
            var options = {
              'cmd_uuid': '{{wat}}0',
            }
            promise.getHardware(url, options, 'post').then(res => {
              wx.showToast({
                title: '关闭成功',
                icon: 'success'
              })
              that.setData({
                water: 'OFF',
                waterState: false
              })
            })
          } else {
            var options = {
              'cmd_uuid': '{{wat}}1',
            }
            promise.getHardware(url, options, 'post').then(res => {
              wx.showToast({
                title: '成功打开',
                icon: 'success'
              })
              that.setData({
                water: 'ON',
                waterState: true
              })
            })
          }
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '设备不在线或用户未登录',
            showCancel: false
          })
        }
      })
    }
  },
  automaticStateTap: function() {
    var devIds = wx.getStorageSync('devIds')
    var that = this
    if (devIds == undefined || devIds == '') {
      wx.showModal({
        title: '温馨提示',
        content: '设备不在线或用户未登录',
        showCancel: false
      })
    } else {
      var url = 'cmds?device_id=' + wx.getStorageSync('devIds')
      promise.deviceExist().then(res => {
        if (res) {
          if (that.data.water == 'ON') {
            var options = {
              'cmd_uuid': '{{state}}0',
            }
            promise.getHardware(url, options, 'post').then(res => {
              console.log(res)
              wx.showToast({
                title: '关闭成功',
                icon: 'success'
              })
              that.setData({
                automatic: 'OFF',
                automaticState: false
              })
            })
          } else {
            var options = {
              'cmd_uuid': '{{state}}1',
            }
            promise.getHardware(url, options, 'post').then(res => {
              wx.showToast({
                title: '成功打开',
                icon: 'success'
              })
              that.setData({
                automatic: 'ON',
                automaticState: true
              })
            })
          }
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '设备不在线或用户未登录',
            showCancel: false
          })
        }
      })
    }
  }

})