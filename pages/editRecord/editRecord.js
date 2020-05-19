// pages/editRecord/editRecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record:''
  },
  onLoad: function (options) {
    
  },

  getRecordTap:function(e){
    this.setData({
      record: e.detail.value
    })
  },
  clearTap:function(){
    this.setData({
      record:''
    })
  },
  // getPhotoTap:function(){
  //   wx.chooseImage({
  //     count: 3,
  //     sizeType: ['original', 'compressed'],
  //     sourceType: ['album', 'camera'],
  //     success(res) {
  //       // tempFilePath可以作为img标签的src属性显示图片
  //       // const tempFilePaths =   `${res.tempFilePaths[0]};${res.tempFilePaths[1]} `
  //       // var photoList={};
  //       // for (var i of res.tempFilePaths){
  //       //   photoList.push(i)
  //       // }
  //       var photoList = that.data.photoList
  //       if (res.tempFilePaths.count == 0) {
  //         return;
  //       }
  //       let MyFile = new wx.BaaS.File()
  //       for (var i of res.tempFilePaths){
  //         console.log(i)
  //         let fileParams = {
  //           filePath: i
  //         }
  //         let metaData = { categoryID: '5d4c205b86ea091875439b0a' }
  //         MyFile.upload(fileParams, metaData).then(res => {
  //           // 上传成功
  //           let data = res.data.path  // res.data 为 Object 类型
  //           var image = {
  //             photo: res.data.path 
  //           }
  //           photoList.push(photo)
  //         }, err => {
  //         })
  //       }
  //     }
  //   })
  // },
  completeTap:function(){
    var that = this;
    var pages = getCurrentPages(); // 当前页面
    var beforePage = pages[pages.length - 2]; // 前一个页面
    var recordList = beforePage.data.recordList;
    var records = {
      record : that.data.record,
      alter: 'https://cloud-minapp-29237.cloud.ifanrusercontent.com/1hwJGqa3dZC2dQmL.png'
    };
    recordList.push(records);
    var rank = recordList.length + 1
    wx.navigateBack({
      success: function () {
        beforePage.setData({
          recordList: recordList,
          rank: rank
        }); 
      }
    });

  }
})