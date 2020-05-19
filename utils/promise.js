const app = getApp()
import regeneratorRuntime from 'runtime.js'

const checkWxSession = function () {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        resolve(true) //session_key未过期，并且生命周期一直有效
      },
      fail(err) {
        resolve(false)  //session_key已经失效，需要重新执行登录流程
      }
    })
  })
}

const getcode = function () {
  return new Promise((resolve, reject) => {
    wx.login({
      success: function (e) {
        wx.clearStorage('COOKIE');
        app.globalData.js_code = e.code
        resolve(e.code);
      },
      fail: function (e) {
        reject(e);
      }
    })
  })
}


/**首次登录的时候请求cookie,并储存用户信息 */
const getcookie = function (url, code, userName, avatarUrl) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.baseUrl}${url}`,
      method: 'post',
      data: {
        'js_code': code,
        'grant_type': "authorization_code",
        'userName': userName,
        'charImage': avatarUrl,
      },
      header: {
        'content-Type': 'application/json',
      },
      success(request) {
        console.log(request)
        wx.clearStorage('COOKIE');
        var str = request.header['Set-Cookie'];
        resolve(str);
      },
      fail(error) {
        reject('网络出错' + error.data)
      }
    })
  })
}

//根据服务器返回的数据判断cookie是否失效，若失效则重新登录
const getrequest = function (url, options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.baseUrl}${url}`,
      method: 'GET',
      header: {
        'content-Type': 'application/json',
        'cookie': wx.getStorageSync('COOKIE'),
      },
      data: options,
      success: function (res) {
        resolve(res)
      },
      fail: function (err) {
        reject('网络出错' + err.data)
      }
    })
  })
}

//获取硬件信息或发送命令
const getHardware = function (url, options, pattern){
  return new Promise((resolve, reject)=>{
    wx.request({
      url: `${app.globalData.hardwareUrl}${url}`,
      data: options,
      header: {
        'content-Type': 'application/json',
        'api-key': app.globalData.apikey
      },
      method: pattern,
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        resolve(res)
      },
      fail: function(res) {
        reject('网络出错' + err.data)
      },
    })
  })
}

//检验设备是否在线
const deviceExist = function(){
  return new Promise((resolve, reject)=>{
    wx.request({
      url: 'http://api.heclouds.com/devices/status',
      header: {
        'content-Type': 'application/json',
        'api-key': app.globalData.apikey,
      },
      data: {
        'devIds': wx.getStorageSync('devIds')
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res)
        var online = res.data.data.devices[0].online
        resolve(online)
      },
      fail: function (res) { 
        reject('网络出错'+res)
      },
    })
  })
}

//计算养花天数
function duration(unixtime){
  // var createTime = new Date(parseInt(unixtime) * 1000)//创建时间
  // var create_year = createTime.getFullYear()
  // var month = createTime.getMonth() + 1
  // var day = createTime.getDate()
  
  var nowTime = new Date();                   //当前时间
  // var now_year = nowTime.getFullYear()
  // var now_month = nowTime.getMonth() + 1;
  // var now_day = nowTime.getDate();

  // var now_time = nowTime.getTime()

  var days = nowTime.getTime() - unixtime * 1000;
  var time = parseInt(days / (1000 * 60 * 60 * 24));
  return time+1
}

//得到添加时间
function addTime(time){

  var time = new Date(parseInt(time) * 1000)//创建时间
  var create_year = time.getFullYear()
  var month = time.getMonth() + 1
  var day = time.getDate()

  var addtime = `${create_year}/${month}/${day}`
  return addtime
}

function conversionTime(time) {
  var time = new Date(parseInt(time) * 1000)//获取传来的日期详细数值
  var year = time.getFullYear()
  var month = time.getMonth() + 1
  var day = time.getDate()
  var hour = time.getHours();
  var minute = time.getMinutes()
  var second = time.getSeconds()
  
  //获取当前时间
  var nowTime = new Date();
  var years = nowTime.getFullYear(); //获取年份
  var months = nowTime.getMonth() + 1; //获取月份 ，这里需要需要月份的范围为0~11，因此获取月份的时候需要+1才是当前月份值
  var days = nowTime.getDate(); //获取日 
  var hours = nowTime.getHours(); //小时  //Calendar.HOUR是12小时制
  var minutes = nowTime.getMinutes(); //分            
  var seconds = nowTime.getSeconds(); //秒 
  var WeekOfYears = nowTime.getDay(); //一周的第几天，英语国家星期从星期日开始计算

  //比较是不是今天
  if (year == years && month == months && day == days) {
    //如果是今天，验证是不是同一个小时
    if (hour == hours) {
      //验证是不是同一分钟
      if (minute == minutes || (minutes - minute) == 1) {
        //是同一分钟，返回刚刚
        return "刚刚";
      } else {
        return (minutes - minute) + "分钟前";
      }
    } else {
      //验证时区
      if (hour <= 6) { //7点之前
        return "凌晨 " + hour + ":" + minute;
      }
      if (hour > 6 && hour <= 8) { //7-9点
        return "早上 " + hour + ":" + minute;
      }
      if (hour > 8 && hour <= 11) { //9-12点
        return "上午 " + hour + ":" + minute;
      }
      if (hour > 11 && hour <= 12) { //12点
        return "中午 " + hour + ":" + minute;
      }
      if (hour > 12 && hour <= 17) { //14-18点
        return "下午 " + hour + ":" + minute;
      }
      if (hour > 17 && hour <= 19) { //19-20点
        return "傍晚 " + hour + ":" + minute;
      }
      if (hour > 19) { //20以后
        return "晚上 " + hour + ":" + minute;
      }
    }
    //比较是不是昨天
  } else if (year == years && month == months && (days - day) == 1) {
    return "昨天";
    //比较是不是今年
  } else if (year == years) {
    return month + "月" + day + "日";
  } else {
    return year + "/" + month + "/" + day;
  }
  return " ";
}



module.exports = {
  checkWxSession,
  getcode,
  getcookie,
  getrequest,
  getHardware,
  deviceExist,
  duration,
  addTime,
  conversionTime
}