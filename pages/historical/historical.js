const promise = require('../../utils/promise.js');
import * as echarts from '../../ec-canvas/echarts';
const app = getApp();

function dayOption(chart, datalist, dataStream, company) {
  const option = {
    color: ['#30bf6f'],
    grid: {
      x: 40,
      y: 35,
      width: 290,
      height: 160,
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      position: ['40%', '30%']
    },
    xAxis: {
      name: '时间',
      type: 'category',
      boundaryGap: false,
      data: ['0.00', '3.00', '6.00', '9.00', '12.00', '15.00', '18.00', '21:00', '24:00'],
      axisTick: {
        inside: true,
        length: 3,
        axisPointer: {
          type: 'line',
        }
      },
      axisLabel: {
        interval: 0,
        rotate: 10
      }

    },
    yAxis: {
      name: company,
      nameLocation: 'end',
      nameGap: 12,
      x: 'center',
      type: 'value',
      min: 0,
      max: 100,
      splitNumber: 10,
      splitLine: {
        show: false
      }
    },
    series: [{
      name: dataStream,
      type: 'line',
      smooth: true,
      symbol: 'emptyCircle',
      data: datalist,
      itemStyle: {
        opacity: 1
      }
    }]
  };
  chart.setOption(option)
};

function monthOption(chart, datalist, dataStream, company) {
  const option = {
    color: ['#30bf6f'],
    grid: {
      x: 40,
      y: 35,
      width: 290,
      height: 160,
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      position: ['40%', '30%']
    },
    xAxis: {
      name: '时间',
      type: 'category',
      boundaryGap: false,
      data: ['1日', '5日', '10日', '15日', '20日', '25日', '30日'],
      axisTick: {
        inside: true,
        length: 3,
        axisPointer: {
          type: 'line',
        }
      },
      length: 3,
      axisPointer: {
        type: 'line',
      },
    },
    yAxis: {
      name: company,
      nameLocation: 'end',
      nameGap: 12,
      x: 'center',
      type: 'value',
      min: 0,
      max: 100,
      splitNumber: 10,
      splitLine: {
        show: false
      }
    },
    series: [{
      name: dataStream,
      type: 'line',
      smooth: true,
      data: datalist,
      symbol: 'emptyCircle',
      itemStyle: {
        normal: {
          label: {
            show: true
          }
        }
      },
      showAllSymbol: true
    }]
  };
  chart.setOption(option)
}

Page({


  data: {
    dpr: wx.getSystemInfoSync().windowWidth / 750,
    timer: '',
    daymonth: ['本日', '本月'],
    currentTap: 0,
    dayList: {
      shidu: '', //空气湿度 [74,73,73,73,74,77,70]
      tuhumi: '', //土壤湿度[40,43,42,41,45,42,40]
      guangzhao: '', //光照强度[10,11,35,49,50,44,15]
      wendu: '' //空气温度[24,24,21,27,29,26,25]
    },
    monthList: {
      shidu: '', //空气湿度  [73,72,73,69,75]
      tuhumi: '', //土壤湿度[44,45,41,47,48]
      guangzhao: '', //光照强度[46,38,30,35,44]
      wendu: ''//空气温度[22,26,29,31,29] 
    },
    datastream_day: [{
      value: '空气湿度',
      id: 'shidu',
      checked: true,
      ec: {
        lazyLoad: true
      },
      chart: 'mychart-one',
      maximum: {
        name: '空气湿度',
        max: 0,
        maxTime: '0:00',
        min: 0,
        minTime: '0:00',
        unit: '%'
      }
    }, {
      value: '土壤湿度',
      id: 'tuhumi',
      checked: false,
      ec: {
        lazyLoad: true
      },
      chart: 'mychart-two',
      maximum: {
        name: '土壤湿度',
        max: 0,
        maxTime: '0:00',
        min: 0,
        minTime: '0:00',
        unit: '%'
      }
    }, {
      value: '光照强度',
      id: 'guangzhao',
      checked: false,
      ec: {
        lazyLoad: true
      },
      chart: 'mychart-three',
      maximum: {
        name: '光照强度',
        max: 0,
        maxTime: '0:00',
        min: 0,
        minTime: '0:00',
        unit: 'lx'
      }
    }, {
      value: '空气温度',
      id: 'wendu',
      checked: false,
      ec: {
        lazyLoad: true
      },
      chart: 'mychart-four',
      maximum: {
        name: '空气温度',
        max: 0,
        maxTime: '0:00',
        min: 0,
        minTime: '0:00',
        unit: '°C'
      }
    }],
    datastream_month: [{
      value: '空气湿度',
      id: 'shidu',
      checked: true,
      ec: {
        lazyLoad: true
      },
      chart: 'mychart-five',
      maximum: {
        name: '空气湿度',
        max:0,
        maxTime: '0日',
        min: 0,
        minTime: '0日',
        unit: '%'
      },
    }, {
      value: '土壤湿度',
      id: 'tuhumi',
      checked: false,
      ec: {
        lazyLoad: true
      },
      chart: 'mychart-six',
      maximum: {
        name: '土壤湿度',
        max: 0,
        maxTime: '0日',
        min: 0,
        minTime: '0日',
        unit: '%'
      }
    }, {
      value: '光照强度',
      id: 'guangzhao',
      checked: false,
      ec: {
        lazyLoad: true
      },
      chart: 'mychart-seven',
      maximum: {
        name: '光照强度',
        max: 0,
        maxTime: '0日',
        min: 0,
        minTime: '0日',
        unit: 'lx'
      }
    }, {
      value: '空气温度',
      id: 'wendu',
      checked: false,
      ec: {
        lazyLoad: true
      },
      chart: 'mychart-eight',
      maximum: {
        name: '空气温度',
        max: 0,
        maxTime: '0日',
        min: 0,
        minTime: '0日',
        unit: '°C'
      }
    }],
    tip: false,
  },
  onlineTap: function() {
    wx.showModal({
      title: '温馨提示',
      content: "‘未登录’或‘设备不在线’",
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
  onLoad: function(options) {
    this.oneComponnent = this.selectComponent('#mychart-one');
    this.twoComponnent = this.selectComponent('#mychart-two');
    this.threeComponnent = this.selectComponent('#mychart-three');
    this.fourComponnent = this.selectComponent('#mychart-four');
    this.fiveComponnent = this.selectComponent('#mychart-five');
    this.sixComponnent = this.selectComponent('#mychart-six');
    this.sevenComponnent = this.selectComponent('#mychart-seven');
    this.eightComponnent = this.selectComponent('#mychart-eight');
    this.init_one('', '空气湿度', '单位：%')
    this.init_two('', '土壤湿度', '单位：%')
    this.init_three('', '光照强度', '单位：lx')
    this.init_four('', '空气温度', '单位：°C')
    this.init_five('', '空气湿度', '单位：%')
    this.init_six('', '土壤湿度', '单位：%')
    this.init_seven('', '光照强度', '单位：lx')
    this.init_eight('', '空气温度', '单位：°C')
    var devIds = wx.getStorageSync('devIds')
    var that = this
    promise.checkWxSession().then(res => {
      if (res) {
        if (devIds != undefined || devIds != '') {
          this.getDayOption();
          this.getMoneyOption();
          promise.deviceExist().then(res => {
            if (!res) {
              that.cue()
            }
          })
        } else {
          that.cue()
        }
      } else {
        that.cue()
      }
    })

  },
  navBarTap: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.setData({
      currentTap: index
    })
  },
  streamDayTap: function(e) {
    console.log(e.currentTarget.dataset.id)
    var index = e.currentTarget.dataset.index;
    var datastream = this.data.datastream_day
    datastream.forEach(item => {
      item.checked = false
    })
    datastream[index].checked = true; //改变当前选中的status值
    this.setData({
      datastream_day: datastream
    })
  },
  streamMonthTap: function(e) {
    console.log(e.currentTarget.dataset.id)
    var index = e.currentTarget.dataset.index;
    var datastream = this.data.datastream_month
    datastream.forEach(item => {
      item.checked = false
    })
    datastream[index].checked = true; //改变当前选中的status值
    this.setData({
      datastream_month: datastream
    })
  },
  init_one: function(datalist, dataStream, company) { //本日，空气湿度
    this.oneComponnent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      dayOption(chart, datalist, dataStream, company)
      this.chart = chart;
      return chart;
    });
  },
  init_two: function(datalist, dataStream, company) { //本日，土壤湿度
    this.twoComponnent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      dayOption(chart, datalist, dataStream, company)
      this.chart = chart;
      return chart;
    });
  },
  init_three: function(datalist, dataStream, company) { //本日，光照强度
    this.threeComponnent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      dayOption(chart, datalist, dataStream, company)
      this.chart = chart;
      return chart;
    });
  },
  init_four: function(datalist, dataStream, company) { //本日，空气温度
    this.fourComponnent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      dayOption(chart, datalist, dataStream, company)
      this.chart = chart;
      return chart;
    });
  },
  init_five: function(datalist, dataStream, company) { //本月，空气湿度
    this.fiveComponnent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      monthOption(chart, datalist, dataStream, company)
      this.chart = chart;
      return chart;
    });
  },
  init_six: function(datalist, dataStream, company) { //本月，土壤湿度
    this.sixComponnent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      monthOption(chart, datalist, dataStream, company)
      this.chart = chart;
      return chart;
    });
  },
  init_seven: function(datalist, dataStream, company) { //本月，光照强度
    this.sevenComponnent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      monthOption(chart, datalist, dataStream, company)
      this.chart = chart;
      return chart;
    });
  },
  init_eight: function(datalist, dataStream, company) { //本月，空气温度
    this.eightComponnent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      monthOption(chart, datalist, dataStream, company)
      this.chart = chart;
      return chart;
    });
  },
  getDayOption: function() {
    var devIds = wx.getStorageSync('devIds')
    var that = this;
    if (devIds == undefined || devIds == '') {
      var shiduList = that.data.dayList.shidu
      var tuhumiList = that.data.dayList.tuhumi
      var guangzhaoList = that.data.dayList.guangzhao
      var wenduList = that.data.dayList.wendu

      that.init_one(shiduList, '空气湿度', '单位：%')
      that.init_two(tuhumiList, '土壤湿度', '单位：%')
      that.init_three(guangzhaoList, '光照强度', '单位：lx')
      that.init_four(wenduList, '空气温度', '单位：°C')
    } else {
    var url = 'devices/' + wx.getStorageSync('devIds') + '/datastreams';
    var options = {
      datastream_ids: 'shidu,tuhumi,guangzhao,wendu'
    }
    promise.deviceExist().then(res => {
      if (!res) {
        return promise.getHardware(url, options, 'get')
      } else {
        //获取已存在的数据流数据
        var shiduList = that.data.dayList.shidu
        var tuhumiList = that.data.dayList.tuhumi
        var guangzhaoList = that.data.dayList.guangzhao
        var wenduList = that.data.dayList.wendu
        //添加新数据流
        var zero = 0
        shiduList.push(zero)
        tuhumiList.push(zero)
        guangzhaoList.push(zero)
        wenduList.push(zero)
        that.setData({
          ['dayList.shidu']: shiduList,
          ['dayList.tuhumi']: tuhumiList,
          ['dayList.guangzhao']: guangzhaoList,
          ['dayList.wendu']: wenduList
        })
        that.init_one(shiduList, '空气湿度', '单位：%')
        that.init_two(tuhumiList, '土壤湿度', '单位：%')
        that.init_three(guangzhaoList, '光照强度', '单位：lx')
        that.init_four(wenduList, '空气温度', '单位：°C')
      }
    }).then(res => {
      console.log(res)
      var time = res.data.data[0].update_at
      var dataTime = time.substring(11, 13) + ':00'
      var shidu = res.data.data[0].current_value
      var tuhumi = res.data.data[1].current_value
      var guangzhao = res.data.data[2].current_value
      var wendu = res.data.data[3].current_value
      //获取已存在的数据流数据
      var shiduList = that.data.dayList.shidu
      var tuhumiList = that.data.dayList.tuhumi
      var guangzhaoList = that.data.dayList.guangzhao
      var wenduList = that.data.dayList.wendu
      //添加新数据流
      shiduList.push(shidu)
      tuhumiList.push(tuhumi)
      guangzhaoList.push(guangzhao)
      wenduList.push(wendu)
      console.log(wenduList)
      that.setData({
        ['dayList.shidu']: shiduList,
        ['dayList.tuhumi']: tuhumiList,
        ['dayList.guangzhao']: guangzhaoList,
        ['dayList.wendu']: wenduList
      })
      that.init_one(shiduList, '空气湿度', '单位：%')
      that.init_two(tuhumiList, '土壤湿度', '单位：%')
      that.init_three(guangzhaoList, '光照强度', '单位：lx')
      that.init_four(wenduList, '空气温度', '单位：°C')
      var datastream_day = that.data.datastream_day
      //空气湿度最值
      if (shidu > datastream_day[0].maximum.max) {
        that.setData({
          ['datastream_day[0].maximum.max']: shidu,
          ['datastream_day[0].maximum.maxTime']: dataTime
        })
      } else if (shidu < datastream_day[0].maximum.min) {
        that.setData({
          ['datastream_day[0].maximum.min']: shidu,
          ['datastream_day[0].maximum.minTime']: dataTime
        })
      }
      //土壤湿度最值
      if (tuhumi > datastream_day[1].maximum.max) {
        that.setData({
          ['datastream_day[1].maximum.max']: tuhumi,
          ['datastream_day[1].maximum.maxTime']: dataTime
        })
      } else if (tuhumi < datastream_day[1].maximum.min) {
        that.setData({
          ['datastream_day[1].maximum.min']: tuhumi,
          ['datastream_day[1].maximum.minTime']: dataTime
        })
      }
      //光照强度最值
      if (guangzhao > datastream_day[2].maximum.max) {
        that.setData({
          ['datastream_day[2].maximum.max']: guangzhao,
          ['datastream_day[2].maximum.maxTime']: dataTime
        })
      } else if (guangzhao < datastream_day[2].maximum.min) {
        that.setData({
          ['datastream_day[2].maximum.min']: guangzhao,
          ['datastream_day[2].maximum.minTime']: dataTime
        })
      }
      //空气温度最值
      if (wendu > datastream_day[3].maximum.max) {
        that.setData({
          ['datastream_day[3].maximum.max']: wendu,
          ['datastream_day[3].maximum.maxTime']: dataTime
        })
      } else if (wendu < datastream_day[3].maximum.min) {
        that.setData({
          ['datastream_day[3].maximum.min']: wendu,
          ['datastream_day[3].maximum.minTime']: dataTime
        })
      }
      console.log(datastream_day[0].maximum.max)

    })
    }
  },
  //本月
  getMoneyOption: function() {
    var devIds = wx.getStorageSync('devIds')
    var that = this;
    if (devIds == undefined || devIds == '') {
      var shiduList = that.data.monthList.shidu
      var tuhumiList = that.data.monthList.tuhumi
      var guangzhaoList = that.data.monthList.guangzhao
      var wenduList = that.data.monthList.wendu
      
      that.init_five(shiduList, '空气湿度', '单位：%')
      that.init_six(tuhumiList, '土壤湿度', '单位：%')
      that.init_seven(guangzhaoList, '光照强度', '单位：lx')
      that.init_eight(wenduList, '空气温度', '单位：°C')
    }else{
      var url = 'devices/' + wx.getStorageSync('devIds') + '/datapoints';
      var options = {
        'datastream_id': 'shidu,tuhumi,guangzhao,wendu',
        'limit': '100'
      }
      promise.deviceExist().then(res => {
        if (!res) {
          return promise.getHardware(url, options, 'get')
        } else {
          //获取已存在的数据流数据
          var shiduList = that.data.monthList.shidu
          var tuhumiList = that.data.monthList.tuhumi
          var guangzhaoList = that.data.monthList.guangzhao
          var wenduList = that.data.monthList.wendu
          //添加新数据流
          var zero = 0
          shiduList.push(zero)
          tuhumiList.push(zero)
          guangzhaoList.push(zero)
          wenduList.push(zero)
          that.setData({
            ['monthList.shidu']: shiduList,
            ['monthList.tuhumi']: tuhumiList,
            ['monthList.guangzhao']: guangzhaoList,
            ['monthList.wendu']: wenduList
          })
          that.init_five(shiduList, '空气湿度', '单位：%')
          that.init_six(tuhumiList, '土壤湿度', '单位：%')
          that.init_seven(guangzhaoList, '光照强度', '单位：lx')
          that.init_eight(wenduList, '空气温度', '单位：°C')
        }
      }).then(res => {
        console.log(res)
        var time = res.data.data.datastreams[0].datapoints[0].at
        var dataTime = time.substring(5, 7) + '日'
        var shidu, tuhumi, guangzhao, wendu
        var streams = res.data.data.datastreams
        console.log(streams)
        for (var i in streams) {
          if (streams[i].id == 'shidu') {
            var value = 0
            for (var j in streams[i].datapoints) {
              value += streams[i].datapoints[j].value
            }
            shidu = value / 100
          }
          if (streams[i].id == 'tuhumi') {
            var value = 0
            for (var j in streams[i].datapoints) {
              value += streams[i].datapoints[j].value
            }
            tuhumi = value / 100
          }
          if (streams[i].id == 'guangzhao') {
            var value = 0
            for (var j in streams[i].datapoints) {
              value += streams[i].datapoints[j].value
            }
            guangzhao = value / 100
          }
          if (streams[i].id == 'wendu') {
            var value = 0
            for (var j in streams[i].datapoints) {
              value += streams[i].datapoints[j].value
            }
            wendu = value / 100
          }
        }
        console.log(wendu)
        //获取已存在的数据流数据
        var shiduList = that.data.monthList.shidu
        var tuhumiList = that.data.monthList.tuhumi
        var guangzhaoList = that.data.monthList.guangzhao
        var wenduList = that.data.monthList.wendu
        //添加新数据流
        shiduList.push(shidu)
        tuhumiList.push(tuhumi)
        guangzhaoList.push(guangzhao)
        wenduList.push(wendu)
        console.log(wenduList)
        that.setData({
          ['monthList.shidu']: shiduList,
          ['monthList.tuhumi']: tuhumiList,
          ['monthList.guangzhao']: guangzhaoList,
          ['monthList.wendu']: wenduList
        })
        that.init_five(shiduList, '空气湿度', '单位：%')
        that.init_six(tuhumiList, '土壤湿度', '单位：%')
        that.init_seven(guangzhaoList, '光照强度', '单位：lx')
        that.init_eight(wenduList, '空气温度', '单位：°C')
        var datastream_month = that.data.datastream_month
        //空气湿度最值
        if (shidu > datastream_month[0].maximum.max) {
          that.setData({
            ['datastream_month[0].maximum.max']: shidu,
            ['datastream_month[0].maximum.maxTime']: dataTime
          })
        } else if (shidu < datastream_month[0].maximum.min) {
          that.setData({
            ['datastream_month[0].maximum.min']: shidu,
            ['datastream_month[0].maximum.minTime']: dataTime
          })
        }
        //土壤湿度最值
        if (tuhumi > datastream_month[1].maximum.max) {
          that.setData({
            ['datastream_month[1].maximum.max']: tuhumi,
            ['datastream_month[1].maximum.maxTime']: dataTime
          })
        } else if (tuhumi < datastream_month[1].maximum.min) {
          that.setData({
            ['datastream_month[1].maximum.min']: tuhumi,
            ['datastream_month[1].maximum.minTime']: dataTime
          })
        }
        //光照强度最值
        if (guangzhao > datastream_month[2].maximum.max) {
          that.setData({
            ['datastream_month[2].maximum.max']: guangzhao,
            ['datastream_month[2].maximum.maxTime']: dataTime
          })
        } else if (guangzhao < datastream_month[2].maximum.min) {
          that.setData({
            ['datastream_month[2].maximum.min']: guangzhao,
            ['datastream_month[2].maximum.minTime']: dataTime
          })
        }
        //空气温度最值
        if (wendu > datastream_month[3].maximum.max) {
          that.setData({
            ['datastream_month[3].maximum.max']: wendu,
            ['datastream_month[3].maximum.maxTime']: dataTime
          })
        } else if (wendu < datastream_month[3].maximum.min) {
          that.setData({
            ['datastream_month[3].maximum.min']: wendu,
            ['datastream_month[3].maximum.minTime']: dataTime
          })
        }

      })
    }
  }
})