const app = getApp()
const breed = require('../data/data.js');
const promise = require('../../utils/promise.js');
Page({
  data: {
    state: '',
    yuzhi: null,
    tuhumi_Min: null, //土壤湿度
    tuhumi_Max: null,
    temp_Min: null, //空气温度
    temp_Max: null,
    humi_Min: null, //空气湿度
    humi_max: null,
    // auto_para: {
    //   yuzhi: 78,
    //   tuhumi_Min: 20,
    //   tuhumi_Max: 49,
    //   temp_Min: 12,
    //   temp_Max: 45,
    //   humi_Min: 27,
    //   humi_max: 66
    // },
    range: ['玫瑰', '仙人掌', '向日葵', '吊兰'],
    setrange: breed.breed.meigui,
    auto_para: {
      yuzhi: 0,
      tuhumi_Min: 0,
      tuhumi_Max: 0,
      temp_Min: 0,
      temp_Max: 0,
      humi_Min: 0,
      humi_max: 0
    }
  },


  onLoad: function(options) {
    var devIds = wx.getStorageSync('devIds')
    var that = this
    if (devIds == undefined || devIds == '') {

    } else {
      var url = 'devices/' + wx.getStorageSync('devIds') + '/datastreams/'
      var options = {
        datastream_ids: 'state,yuzhi,tuHumi_Min,tuHumi_Max,Temp_Min,Temp_Max,Humi_Min,Humi_Max'
      }
      promise.deviceExist().then(res => {
        if (res) {
          return promise.getHardware(url, options, 'get')
        }

      }).then(res => {
        if (res) {
          var state = res.data.data[0].current_value
          if (state) {
            that.setData({
              state: state,
              ['auto_para.yuzhi']: res.data.data[1].current_value,
              ['auto_para.tuhumi_Min']: res.data.data[2].current_value,
              ['auto_para.tuhumi_Max']: res.data.data[3].current_value,
              ['auto_para.temp_Min']: res.data.data[4].current_value,
              ['auto_para.temp_Max']: res.data.data[5].current_value,
              ['auto_para.humi_Min']: res.data.data[6].current_value,
              ['auto_para.humi_max']: res.data.data[7].current_value
            })
          }
        }
      })
    }
  },
  autoSetTap: function() {
    var devIds = wx.getStorageSync('devIds')
    var that = this
    if (devIds == undefined || devIds == '') {
      wx.showModal({
        content: '请先添加设备！',
      })
    } else {
      promise.deviceExist().then(res => {
        if (res) {
          // if (that.data.state != '') {
            wx.showModal({
              title: '设置参数',
              content: '是否确定自动设置参数？',
              success(res) {
                if (res.confirm) {
                  var variety = wx.getStorageSync('variety')
                  // var breed = breed.breed_two
                  var url = 'cmds?device_id=' + wx.getStorageSync('devIds')

                  console.log(breed.breed_two)
                  for (var i = 0; i < breed.breed_two.length; i++) {
                    if (breed.breed_two[i].name == variety) {
                      var options1 = {
                        'cmd_uuid': '{{Humi_Min}}' + breed.breed_two[i].humi_Min,
                      }
                      var options2 = {
                        'cmd_uuid': '{{Humi_Max}}' + breed.breed_two[i].humi_max,
                      }
                      var options3 = {
                        'cmd_uuid': '{{Temp_Min}}' + breed.breed_two[i].temp_Min,
                      }
                      var options4 = {
                        'cmd_uuid': '{{Temp_Max}}' + breed.breed_two[i].temp_Max,
                      }
                      var options5 = {
                        'cmd_uuid': '{{tuhumi_Min}}' + breed.breed_two[i].tuhumi_Min,
                      }
                      var options6 = {
                        'cmd_uuid': '{{tuhumi_Max}}' + breed.breed_two[i].tuhumi_Max,
                      }
                      var options7 = {
                        'cmd_uuid': '{{yuzhi}}' + breed.breed_two[i].yuzhi,
                      }
                      promise.getHardware(url, options1, 'post').then(res => {
                        console.log(res)
                      })
                      promise.getHardware(url, options2, 'post').then(res => {
                        console.log(res)
                      })
                      promise.getHardware(url, options3, 'post').then(res => {
                        console.log(res)
                      })
                      promise.getHardware(url, options4, 'post').then(res => {
                        console.log(res)
                      })
                      promise.getHardware(url, options5, 'post').then(res => {
                        console.log(res)
                      })
                      promise.getHardware(url, options6, 'post').then(res => {
                        console.log(res)
                      })
                      promise.getHardware(url, options7, 'post').then(res => {
                        console.log(res)
                      })
                      that.setData({
                        ['auto_para.yuzhi']: breed.breed_two[i].yuzhi,
                        ['auto_para.tuhumi_Min']: breed.breed_two[i].tuhumi_Min,
                        ['auto_para.tuhumi_Max']: breed.breed_two[i].tuhumi_Max,
                        ['auto_para.temp_Min']: breed.breed_two[i].temp_Min,
                        ['auto_para.temp_Max']: breed.breed_two[i].temp_Max,
                        ['auto_para.humi_Min']: breed.breed_two[i].humi_Min,
                        ['auto_para.humi_max']: breed.breed_two[i].humi_max
                      })
                    }
                  }

                } else if (res.cancel) {
 
                }
              }
            })
          // }
          // else{
          //   wx.showModal({
          //     content: '',
          //   })
          // }

        } else {
          wx.showModal({
            content: '设备未在线',
          })
        }

      })
    }
  },
  changeBreedTap: function(e) {
    var that = this
    var value = e.detail.value
    if (value == 0) {
      that.setData({
        setrange: breed.breed.meigui
      })
    } else if (value == 1) {
      that.setData({
        setrange: breed.breed.xianrenzhang
      })
    } else if (value == 2) {
      that.setData({
        setrange: breed.breed.xiangrikui
      })
    } else {
      that.setData({
        setrange: breed.breed.diaolan
      })
    }
  },
  getYuzhi: function(e) {
    this.setData({
      yuzhi: e.detail.value
    })
  },
  getTuhumiMin: function(e) {
    this.setData({
      tuhumi_Min: e.detail.value
    })
  },
  getTuhumiMax: function(e) {
    this.setData({
      tuhumi_Max: e.detail.value
    })
  },
  getWenduMin: function(e) {
    this.setData({
      wendu_Min: e.detail.value
    })
  },
  getWenduMax: function(e) {
    this.setData({
      wendu_Max: e.detail.value
    })
  },
  getShiduMin: function(e) {
    this.setData({
      shidu_Min: e.detail.value
    })
  },
  getShiduMax: function(e) {
    this.setData({
      shidu_Max: e.detail.value
    })
  },
  setYuzhi: function(e) {
    var devIds = wx.getStorageSync('devIds')
    var that = this
    if (devIds == undefined || devIds == '') {
      wx.showModal({
        content: '请先添加设备！',
      })
    } else {
      var value = that.data.yuzhi
      var url = 'cmds?device_id=' + wx.getStorageSync('devIds')
      var options = {
        'cmd_uuid': '{{yuzhi}}' + value,
      }
      if (!isNaN(value) && value !== null) {
        promise.getHardware(url, options, 'post').then(res => {
          console.log(res)
          if (res.data.errno == 10) {
            wx.showModal({
              content: '温馨提示:设备不在线',
            })
          } else {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 1000
            })
          }
        })
      } else {
        wx.showModal({
          content: '请输入正确格式!',
        })
      }
    }
  },
  setTuhumi: function(e) {
    var devIds = wx.getStorageSync('devIds')
    var that = this
    if (devIds == undefined || devIds == '') {
      wx.showModal({
        content: '请先添加设备！',
      })
    } else {
      var value_Min = that.data.tuhumi_Min
      var value_max = that.data.tuhumi_Max
      var url = 'cmds?device_id=' + wx.getStorageSync('devIds')
      var options = {
        'cmd_uuid': '{{tuhumi_Min}}' + value_Min,
        // 'cmd_uuid': ['{{ tuhumi_Min }}' + value_Min, '{{ tuhumi_Max }}' + value_max]
      }
      var options2 = {
        'cmd_uuid': '{{tuhumi_Max}}' + value_max,
      }
      if (!isNaN(value_Min) && value_Min !== null && !isNaN(value_max)) {
        promise.getHardware(url, options, 'post').then(res => {
          console.log(res)
          if (res.data.errno == 10) {
            wx.showModal({
              content: '温馨提示:设备不在线',
            })
          } else {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 1000
            })
          }
        })
        promise.getHardware(url, options2, 'post').then(res => {
          console.log(res)
          if (res.data.errno == 10) {
            wx.showModal({
              content: '温馨提示:设备不在线',
            })
          } else {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 1000
            })
          }
        })
      } else {
        wx.showModal({
          content: '请输入正确格式!',
        })
      }
    }
  },
  setWendu: function(e) {
    var devIds = wx.getStorageSync('devIds')
    var that = this
    if (devIds == undefined || devIds == '') {
      wx.showModal({
        content: '请先添加设备！',
      })
    } else {
      var value_Min = that.data.temp_Min
      var value_max = that.data.temp_Max
      var url = 'cmds?device_id=' + wx.getStorageSync('devIds')
      var options = {
        'cmd_uuid': '{{Temp_Min}}' + value_Min,
      }
      var options2 = {
        'cmd_uuid': '{{Temp_Max}}' + value_Max,
      }
      if (!isNaN(value_Min) && value_Min !== null && !isNaN(value_Max) && value_Max !== null) {
        promise.getHardware(url, options2, 'post')
        promise.getHardware(url, options, 'post').then(res => {
          console.log(res)
          if (res.data.errno == 10) {
            wx.showModal({
              content: '温馨提示:设备不在线',
            })
          } else {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 1000
            })
          }
        })
      } else {
        wx.showModal({
          content: '请输入正确格式!',
        })
      }
    }
  },
  setShidu: function(e) {
    var devIds = wx.getStorageSync('devIds')
    var that = this
    if (devIds == undefined || devIds == '') {
      wx.showModal({
        content: '请先添加设备！',
      })
    } else {
      var value_Min = that.data.humi_Min
      var value_max = that.data.humi_Max
      var url = 'cmds?device_id=' + wx.getStorageSync('devIds')
      var options1 = {
        'cmd_uuid': '{{Humi_Min}}' + value_Min,
        // 'cmd_uuid': '{{Humi_Max}}' + value_Max,
      }
      var options2 = {
        'cmd_uuid': '{{Humi_Max}}' + value_Max,
      }
      if (!isNaN(value_Min) && value_Min !== null && !isNaN(value_Max) && value_Max !== null) {
        promise.getHardware(url, options1, 'post').then(res => {
          console.log(res)
          if (res.data.errno == 10) {
            wx.showModal({
              content: '温馨提示:设备不在线',
            })
          } else {
            return promise.getHardware(url, options2, 'post')
          }
        }).then(res => {
          if (res.data.errno == 10) {
            wx.showModal({
              content: '温馨提示:设备不在线',
            })
          } else {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 1000
            })
            that.setData({
              humi_Min: '',
              humi_Max: ''
            })
          }
        })
      } else {
        wx.showModal({
          content: '请输入正确格式!',
        })
      }
    }
  }
})