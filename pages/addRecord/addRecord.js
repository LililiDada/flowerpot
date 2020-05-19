var app = getApp()
const promise = require('../../utils/promise.js');
var date = new Date();
var month = date.getMonth() + 1;
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
var day = date.getDate();
var moon = date.getMonth() + 1
var deviceName = wx.getStorageSync('deviceName')
Page({
  data: {
    month: month,
    day: day,
    caption: '',
    placeholder:'',
    recordList: [],
    rank:1,
    photoList:[],
    dele:'https://cloud-minapp-29237.cloud.ifanrusercontent.com/1hwHjOFPhsD8Ma4X.png',
    imgLenght:0,
    alterBtn: false,
    addBtn: true
  },
  onLoad: function(option) {
    var that = this;
    console.log(option)
    try{
      var recordList = JSON.parse(option.recordList)
      var photoList = option.photoList
      if (photoList == "undefined"){
        photoList=[]
      }else{
        photoList = JSON.parse(option.photoList);
      }
      that.setData({
        month: option.month,
        day: option.day,
        caption: option.caption,
        recordList: recordList,
        photoList: photoList,
        id: option.id,
        rank: recordList.length+1,
        imgLenght: photoList.length,
        alterBtn: true,
        addBtn:false
      })
    }catch(err){
      var recordList = that.data.recordList;
      var rank = recordList.length + 1
      var placeholder = `${deviceName}的${moon}月${day}日(可更改)`
      that.setData({
        placeholder: placeholder,
        rank: rank,
      })

    }
  
  },
  onReady: function() {

  },
  bindKeyInput: function(e) {
    this.setData({
      caption: e.detail.value
    })
  },
  addRecordTap: function() {
    var that = this;
    wx.navigateTo({
      url: '../editRecord/editRecord',
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          caption: that.data.caption
        })
      }
    })
  },
  complateTap:function(){
    var that = this;
    try{
      var caption = that.data.caption;
      if (caption=='') {
        caption = `${deviceName}的${moon}月${day}日`
      }
      if (that.data.recordList.length==0){
        wx.showModal({
          title: '温馨提示',
          content: '记录内容不能为空',
        })
        return;
      }
      var options
      let Record = new wx.BaaS.TableObject('record');
      let Newrecord = Record.create();
      // if(that.data.photoList.length==0){
      //   options = {
      //     caption: caption,
      //     recordList: that.data.recordList,
      //   }
      // }else{
        options={
          caption: caption,
          recordList: that.data.recordList,
          photoList: that.data.photoList
        }
      // }
      Newrecord.set(options).save().then(res => {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 1000
        })
        wx.navigateBack({})
      }, err => {
        // HError 对象
      })
    }catch(err){
      console.log(err)
    }
    
  },
  getPhotoTap() {
    var that = this;
    var dele = that.data.dele;
    var imgLenght = that.data.imgLenght
    if (imgLenght>3){
      wx.showToast({
        title: '只能上传四张图片',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var photoList = that.data.photoList
        if (res.tempFilePaths.count == 0) {
          return;
        }
        let MyFile = new wx.BaaS.File()
        for (var i of res.tempFilePaths) {
          imgLenght++
          let fileParams = {
            filePath: i
          }
          let metaData = { categoryName: '记录图片' }
          MyFile.upload(fileParams, metaData).then(res => {
            // 上传成功
            let data = res.data.path  // res.data 为 Object 类型
            var image = {
              photo: res.data.path,
              delet: dele,
              id:res.data.file.id
            }
            photoList.push(image)
            that.setData({
              photoList: photoList,
              imgLenght: imgLenght
            }) 
          }, err => {
          })
        }
      }
    })
  },
  deleteImgTap:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var photoList = that.data.photoList;
    var imgLenght = that.data.imgLenght;
    photoList.splice(index, 1); //删除index 中的一个 然后返回数组
    let MyFile = new wx.BaaS.File();
    MyFile.delete(id).then();
    that.setData({
      photoList: photoList,
      imgLenght: imgLenght-1
    })
  },
  alterRecordTap:function(e){
    var that = this;
    var record = e.currentTarget.dataset.record;
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../alterOneRecord/alterOneRecord',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { 
          record: record,
          index: index,
          recordList: that.data.recordList
        })
      }
    })
  },
  //修改数据
  alterTap:function(e){
    var that = this;
    var caption = that.data.caption;
    if (caption == '') {
      wx.showModal({
        title: '温馨提示',
        content: '标题内容不能为空',
      })
      return;
    }
    if (that.data.recordList.length == 0) {
      wx.showModal({
        title: '温馨提示',
        content: '记录内容不能为空',
      })
      return;
    }
    var options = {
      caption: caption,
      recordList: that.data.recordList,
      photoList: that.data.photoList
    }
    let recordID = that.data.id // 数据行 id
    let Product = new wx.BaaS.TableObject('record')
    let product = Product.getWithoutData(recordID)
    product.set(options).update().then(res => {
      if (res.statusCode==200){
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000
        })
        // wx.redirectTo({
        //   url: '../detailRecord/detailRecord?id=' + recordID,
        // })
        var pages = getCurrentPages();
        var Page = pages[pages.length - 1];//当前页
        var prevPage = pages[pages.length - 2];  //上一个页面
        // prevPage.loadData
        var option = {
          id: recordID
        }
        prevPage.onLoad(option)
        wx.navigateBack()
      }
    }, err => {
      // err
    })
  }
})