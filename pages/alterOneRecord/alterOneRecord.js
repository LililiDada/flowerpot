Page({

  data: {
    record:''
  },

  onLoad: function (options) {
    var that = this;
    try{
      const eventChannel = this.getOpenerEventChannel()
      // eventChannel.emit('acceptDataFromOpenedPage', { data: 'test' });
      // eventChannel.emit('someEvent', { data: 'test' });
      // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
      eventChannel.on('acceptDataFromOpenerPage', function (data) {
        that.setData({
          record: data.record,
          index: data.index,
          recordList: data.recordList
        })
      })
    }catch(err){

    }
    
  },
  clearTap:function(e){
    var that = this;
    var pages = getCurrentPages(); // 当前页面
    var beforePage = pages[pages.length - 2]; // 前一个页面
    var recordList = that.data.recordList;
    var index = that.data.index;
    recordList.splice(index, 1);
    var rank = recordList.length + 1
    wx.navigateBack({
      success: function () {
        beforePage.setData({
          recordList: recordList,
          rank: rank
        });
      }
    });
  },
  getRecordTap: function (e) {
    this.setData({
      record: e.detail.value
    })
  },
  completeTap: function () {
    var that = this;
    var pages = getCurrentPages(); // 当前页面
    var beforePage = pages[pages.length - 2]; // 前一个页面
    var recordList = that.data.recordList;
    var index = that.data.index;
    var records = 'recordList[' + index + '].record';
    wx.navigateBack({
      success: function () {
        beforePage.setData({
          [records]: that.data.record
        });
      }
    });

  }
})