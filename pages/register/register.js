const promise = require('../../utils/promise.js');
const app = getApp()
Page({
  data: {
    backgroundUrl:'../../images/20.png'
  },
  imageLoad: function (e) {
    var res = wx.getSystemInfoSync();
    this.data.windowHeight = res.windowHeight;
    this.setData({
      imagewidth: res.windowWidth,
      imageheight: res.windowHeight
    })
  },
  onLoad: function (options) {
    
  },
  bindgetUserInfo:function(e){
    var userName = e.detail.userInfo.nickName;
    var avatarUrl = e.detail.userInfo.avatarUrl;
    var that = this;
    promise.getcode().then(res => {
      console.log(res)
      return promise.getcookie('', res, userName, avatarUrl)
    }).then(res => {
      console.log(res)
      var str = res.slice(0, -18);
      wx.setStorageSync('COOKIE', str);
      wx.reLaunch({
        url: '',
      })
    })
  },
  onReady: function () {

  },

 
})