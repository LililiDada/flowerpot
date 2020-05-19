var app = getApp()
const promise = require('../../utils/promise.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    currentset:0
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
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var list = that.data.list
    var currentset = that.data.currentset
    var Record = new wx.BaaS.TableObject('record');
    var query = new wx.BaaS.Query();
    Record.setQuery(query).limit(6).offset(currentset).orderBy('-created_at').find().then(res => {
      console.log(res)
      for (var i of res.data.objects) {
        var caption = i.caption
        if (caption.length>6){
          caption = caption.substring(0, 6)+'...'
        }
        var temp={
          id: i.id,
          time: promise.addTime(i.created_at),
          caption: caption
        }
        list.push(temp);
      }
      that.setData({
        list: list
      })
      wx.hideLoading()
    })
  },
  //跳转到添加页面
  skipTap:function(){
    wx.navigateTo({
      url: '../addRecord/addRecord',
    })
  },
  //加载更多记录事件
  getMoreDecord:function(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var list = that.data.list;
    var currentset = that.data.currentset + 6;
    var Record = new wx.BaaS.TableObject('record');
    var query = new wx.BaaS.Query();
    Record.setQuery(query).limit(6).offset(currentset).orderBy('-created_at').find().then(res => {
      if (res.data.meta.next==null){
        wx.hideLoading()
        wx.showToast({
          title: '数据已加载完毕',
          duration: 2000
        })
      }
      if (res.data.meta.total_count == list.length){
        wx.hideLoading()
        wx.showToast({
          title: '数据已加载完毕',
          duration: 2000
        })
        return;
      }
      for (var i of res.data.objects) {
        var caption = i.caption
        if (caption.length > 6) {
          caption = caption.substring(0, 6) + '...'
        }
        var temp = {
          id: i.id,
          time: promise.addTime(i.created_at),
          caption: caption
        }
        list.push(temp);
      }
      that.setData({
        list: list
      })
    })
    wx.hideLoading()
  },
  //删除该条记录
  deletRecordTap:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index
    var list = that.data.list;
    wx.showModal({
      title: '温馨提示',
      content: '是否删除该记录',
      success(res) {
        if (res.confirm) {
          // 删除 tableName 为 'product' 的数据表中 recordID 为 59897882ff650c0477f00485 的数据项
          let tableName = 'record'
          let recordID = id
          let Product = new wx.BaaS.TableObject(tableName)
          Product.delete(recordID).then(res => {
            wx.showToast({
              title: '删除成功',
              icon:'success'
            })
            list.splice(index, 1);
            that.setData({
              list: list
            })
          }, err => {
            // err
          })
        } else if (res.cancel) {
          
        }
      }
    })
  },
  //跳转到详情页面
  detailRecordTap:function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detailRecord/detailRecord?id='+id,
      
    })
  }
})