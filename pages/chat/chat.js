var config = require('../../utils/config')
var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default
var proficient_id = config.PROFICIENT_ID


function conversionTime(time) {
  //拆分传来的日期，获取详细数值
  var year = 0; //年份
  var month = 0; //月份 
  var day = 0; //日 
  var hour = 0; //小时 
  var minute = 0; //分            
  var second = 0; //秒 
  var str = time.split(" ")
  var str1 = str[0].split("-");
  year = str1[0];
  month = str1[1];
  day = str1[2];
  var str2 = str[1].split(":");
  hour = str2[0];
  minute = str2[1];
  second = str2[2];

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

Page({

 
  data: {
    menber:[]
  },

  onLoad: function (options) {
  
    var id = wx.getStorageSync('ID')
    if (!id) {
      wx.showToast({
        title: '请先授权登录',
        duration: 1500,
        icon: 'none',
        success: function () {
          setTimeout(function () {
            wx.navigateBack({})
          }, 1500)
        }
      })
      return;
    }
    // var weather_register = wx.getStorageSync('weather_register')
    var myName = wx.getStorageSync('myUsername')
    var avatar = wx.getStorageSync('avatar')
    let MyTableObject = new wx.BaaS.TableObject('consult')
    let query = new wx.BaaS.Query()
    query.compare('im_id', '=', id)
    MyTableObject.setQuery(query).find().then(res => {
      console.log(res.data.objects)
      if (res.data.objects == '') {
        let product = MyTableObject.create();
        product.set('im_id', id);
        product.set('name', myName);
        product.set('avatar', avatar);
        product.save().then(res => {
          if (res.statusCode === 201) {
            var options = {
              apiUrl: WebIM.config.apiURL,
              username: id,
              password: id,
              nickname: myName,
              success: function () {
                var option = {
                  apiUrl: WebIM.config.apiURL,
                  user: id,
                  pwd: id,
                  grant_type: 'password',
                  appKey: WebIM.config.appkey //应用key
                }
                WebIM.conn.open(option)
              },
              error: function () {

              },
              appKey: WebIM.config.appkey,
            }
            WebIM.utils.registerUser(options)
          }
        }, err => {

        })
      } else {
        var option = {
          apiUrl: WebIM.config.apiURL,
          user: id,
          pwd: id,
          grant_type: 'password',
          appKey: WebIM.config.appkey //应用key
        }
        WebIM.conn.open(option)
      }
    });
    // let query = new wx.BaaS.Query()
    let Product = new wx.BaaS.TableObject('consult')
 
    Product.find().then(res => {
      var object = res.data.objects;
      console.log(object)
      var member=[]
      for(var i=0;i<object.length;i++){
        member.push({
          avatar:object[i].avatar,
          id:object[i].im_id,
          name:object[i].name,
          isTouchMove: false//默认全部隐藏
        })
      }

      console.log(member)

      var myImId = wx.getStorageSync('ID')
      var array = []
      for (var i = 0; i < member.length; i++) {
        if (wx.getStorageSync(member[i].id + proficient_id) != '' && wx.getStorageSync(member[i].id + proficient_id)) {
          var session = wx.getStorageSync(member[i].id + proficient_id)[wx.getStorageSync(member[i].id + proficient_id).length - 1]
          console.log(session)
          array.push({
            avatar: member[i].avatar,
            id: member[i].id,
            name: member[i].name,
            isTouchMove: false,//默认全部隐藏,
            word:session.msg.data[0].data,
            time:conversionTime(session.time)
          })
        }
      }
      this.setData({
        member: array
      })
    }, err => {
      // err
    })
  },

  //手指触摸动作开始，记录起点X坐标
  touchstart: function (e) {
    //开始触摸时，重置所有删除
    this.data.member.forEach(function (v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      member: this.data.member
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
          X: touchMoveX,
          Y: touchMoveY
        });
    that.data.member.forEach(function (v, i) {
      v.isTouchMove = false;
      //滑动超过30度角return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false;
        else //左滑
          v.isTouchMove = true
      }

      //更新数据
      that.setData({
        member: that.data.member
      })
    })
  },

  // 计算滑动角度
  angle: function (start, end) {
    var _X = end.X - start.X;
    var _Y = end.Y - start.Y;

  },

  //删除事件
  del: function (e) {
    var index = e.currentTarget.dataset.index;
    var im_id = e.currentTarget.dataset.id;
    console.log(e);
    var that = this;
    wx.showModal({
      title: '删除该聊天记录',
      confirmText: '删除',
      success: function (res) {
        if (res.confirm) {
          // wx.removeStorageSync(proficient_id + im_id)
          wx.removeStorage({
            key: proficient_id + im_id,
            success: function () {
              that.data.member.splice(index, 1)
              that.setData({
                member: that.data.member
              })
            }
          })
        }
      },
      fail: function (error) {
        //console.log(error)
      }
    })
  },
  into_chatRoom: function (event) {
    var that = this
    //console.log(event)
    var nameList = {
      name: event.currentTarget.dataset.name,
      myName: proficient_id,
      your: event.currentTarget.dataset.id
    }
    wx.navigateTo({
      url: '../revert/revert?username=' + JSON.stringify(nameList)
    })
  },

 
})