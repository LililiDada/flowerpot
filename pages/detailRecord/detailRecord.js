

Page({

  data: {

  },

  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
   var id = options.id
    let Product = new wx.BaaS.TableObject('record')
    Product.get(id).then(res => {
      console.log(res)
      var time = new Date(parseInt(res.data.created_at) * 1000)//创建时间
      var month = time.getMonth() + 1
      var day = time.getDate()
      switch (month) {
        case 1:
          month = '一';
          break;
        case 2:
          month = '二';
          break;
        case 3:
          month = '三';
          break;
        case 4:
          month = '四';
          break;
        case 5:
          month = '五';
          break;
        case 6:
          month = '六';
          break;
        case 7:
          month = '七';
          break;
        case 8:
          month = '八';
          break;
        case 9:
          month = '九';
          break;
        case 10:
          month = '十';
          break;
        case 11:
          month = '十一';
          break;
        case 12:
          month = '十二';
          break;
      }
      that.setData({
        day: day,
        month: month,
        caption: res.data.caption,
        recordList: res.data.recordList,
        photoList: res.data.photoList,
        id: id
        // rank: res.data.recordList.length+1,
        // imgLenght: res.data.photoList.length
      })
      wx.hideLoading();
    }, err => {
      // err
    })
  },
  alterRecordTap:function(){
    var that = this;
    console.log(that.data.month)
    wx.navigateTo({
      url: '../addRecord/addRecord?month=' + that.data.month + '&&day=' + that.data.day + '&&caption=' + that.data.caption + '&&recordList=' + JSON.stringify(that.data.recordList) + '&&photoList=' + JSON.stringify(that.data.photoList) + '&&id=' + that.data.id,
    })
  }
 
})