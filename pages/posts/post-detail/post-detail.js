// pages/posts/post-detail/post-detail.js
var postsData = require('../../data/posts-data.js');
var app = getApp(); //获取app.js文件中的全局变量
const promise = require('../../../utils/promise.js');

Page({
  data: {
    collected: true,
    parent_id: 0, //回复评论的ID
    reply_name: '',  //回复评论的用户名
    commentID: '',
    port_id: 0,
    count: 0,
    limit: 5,
    focus: false,
    check: true,
    name: '',
    contentInp: "",
    replyInp: "",
    content:'',
    commentList:[],
    replyList:[]
  },

  // 接收posts.js传递过来的postId
  onLoad: function(option) {
    var that = this;
    var postData = JSON.parse(option.item)
    console.log(postData)
    this.setData({
      postData: postData,
      postId: postData.postId,
      index: option.index,
      collection:postData.collection,
      port_id: postData.id
    });
    console.log(typeof(that.data.port_id))
    //用户id
    let userID = wx.getStorageSync('ID')
    let Product = new wx.BaaS.TableObject('collection_port')
    let query = new wx.BaaS.Query()
    query.compare('created_by', '=', userID)
    query.compare('port_id', '=', postData.postId)
    Product.setQuery(query).find().then(res => {
      if (res.data.meta.total_count > 0) {
        that.setData({
          collected: false
        })
      }
    }, err => {
      // err
    })

    console.log(postData.postId)
    let Comment = new wx.BaaS.TableObject('comment')
    let query2 = new wx.BaaS.Query()
    query2.compare('port_id', '=', postData.postId)
    Comment.setQuery(query2).expand('created_by').find().then(res => {
      console.log(res)
      var objects = res.data.objects;
      for(var i of objects){
        var commentList = that.data.commentList;
        var replyList = that.data.replyList;
        if (!i.reply){ //评论
          commentList.push({
            avatar: i.created_by.avatar,
            name: i.created_by.nickname,
            id: i.id,
            time: promise.conversionTime(i.created_at),
            content: i.content
          }) 
        }else{ //评论中的评论，评论中的回复
          replyList.push({
            parent_id: i.parent_id,
            time: promise.conversionTime(i.created_at),
            name: i.created_by.nickname,
            avatar: i.created_by.avatar,
            reply_name: i.reply_name,
            parent_id: i.parent_id,
            id: i.id,
            content:i.content,
          })
        }
        this.setData({
          commentList: commentList,
          replyList: replyList
        })
      }
    }, err => {
      // err
    })
  },

  onCollectionTap: function(event) {
    var that = this;
    //修改上一个页面该文章的收藏数值
    var pages = getCurrentPages();
    var prePage = pages[pages.length - 2];
    var index =that.data.index;
    var postList = prePage.data.postList;
    var collections = 'postList[' + index + '].collection';
    console.log(collections)

    var collection = this.data.collection

    var postId = this.data.postId
    var postCollected = this.data.collected; //具体当前文章是否被收藏的状态
    let Product = new wx.BaaS.TableObject('collection_port')
    if (postCollected) {
    
      let product = Product.create()
      product.set('port_id', postId)
      product.save().then(res => {
        console.log(res)
        let Ports = new wx.BaaS.TableObject('ports')
        let product = Ports.getWithoutData(postId)
        product.set('collection', collection + 1)
        product.update().then(res => {
          console.log(res)
        }, err => {
          // err
        })
      }, err => {
        // HError 对象
      })
      that.setData({
        collection: parseInt(collection) + 1
      })
      prePage.setData({
        [collections]: parseInt(collection) + 1
      })
    } else {
      let userID = wx.getStorageSync('ID')
      let query = new wx.BaaS.Query()
      query.compare('port_id', '=', postId)
      query.compare('created_by', '=', userID)
      Product.delete(query).then(res => {
        console.log(res)
        let Ports = new wx.BaaS.TableObject('ports')
        let product = Ports.getWithoutData(postId)
        product.set('collection', collection - 1)
        product.update().then(res => {
          console.log(res)
        }, err => {
          // err
        })
      }, err => {
        console.log(err)
      })
      that.setData({
        collection: parseInt(collection) - 1
      })
      prePage.setData({
        [collections]: parseInt(collection) - 1
      })
    }
    postCollected = !postCollected; //取反，收藏变成未收藏，未收藏变成收藏 
    this.setData({
      collected: postCollected,
    })
    this.showToast(postCollected);
  },

  showToast: function(postCollected) {
    //显示消息提示框
    wx.showToast({
      title: !postCollected ? "收藏成功" : "取消收藏",
      duration: 200, //提示的持续时间
      icon: "success" //提示时的图标，还有加载的“loading”属性值,其作用不大
    })
  },

  onShareTap: function(event) {
    //显示操作菜单

    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function(res) {
        // res.cancel 用户是否点击了取消按钮
        // res.tapIndex 点击的数组元素（itemList）的序号的内容，从0开始
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '用户是否取消' + res.cancel + '我还不会分享功能，什么时候我学会了就可以用这个功能了',
        })
      }
    })
    //根据不同的点击情况来确定到微信还是朋友圈还是QQ
  },

  //评论输入框
  contentInp(e) {
    this.setData({
      contentInp: e.detail.value,
      content: e.detail.value
    })
  },
  //答复输入框
  replyInp(e) {
    this.setData({
      replyInp: e.detail.value,
      content: e.detail.value
    })
  },

  addWant() {
    if (this.data.contentInp.length > 100) {
      wx.showToast({
        title: '请将字数控制在100字以内哦',
        content: 'none',
        duration: 1000,
        mask: true,
      })
    } else {
      if (this.data.check == true) {
        this.addComment()
      } else {
        this.addReply()
      }
    }
  },

  //发表评论
  addComment() {
    var that = this
    let params = {
      port_id: that.data.port_id, //所属文章ID
      content: that.data.contentInp
    }
    let Comment = new wx.BaaS.TableObject('comment')
    let MyRecord = Comment.create()
    MyRecord.set(params).save().then(res => {
      if (res.statusCode == 201) {
        console.log(res)
        //将评论返回的数据添加到评论列表
        var commentList = that.data.commentList
        commentList.push({
          avatar:wx.getStorageSync('avatar'),
          name: wx.getStorageSync('myUsername'),
          id:res.data.id,
          time: promise.conversionTime(res.data.created_at),
          content: res.data.content,
          id: res.data.id,
        })
        this.setData({
          contentInp: "",
          commentList:commentList
        })
        wx.showToast({
          title: '评论成功',
          icon: "none",
          duration: 1000,
          mask: true,
        })
      } else {
        wx.showModal({
          title: '温馨提示',
          content: '请登录后再评论',
        })
      }

    }, err => {
      //err 为 HError 对象
    })

  },

  //点击评论获取要回复的人的id
  getCommentUserID(e) {
    let data = e.currentTarget.dataset;
    this.setData({
      parent_id: data.commentid,
      name: data.name,
      reply_name:'',
      focus: true,
      check: false
    })
  },

  getReplyUserID: function (e) {
    let data = e.currentTarget.dataset;
    this.setData({
      parent_id: data.commentid,
      reply_name: data.name,
      focus: true,
      check: false
    })
  },

  //回复
  addReply() {
    var that = this
    let params = {
      port_id: that.data.port_id, //所属文章ID
      content: that.data.replyInp,//回复的内容
      reply: true,
      parent_id: that.data.parent_id,//回复的评论id
      reply_name: that.data.reply_name
    }
    let Comment = new wx.BaaS.TableObject('comment')
    let MyRecord = Comment.create()
    MyRecord.set(params).save().then(res => {
      if (res.statusCode == 201) {
        console.log(res)
        //将评论返回的数据添加到评论列表
        var replyList = that.data.replyList;
        replyList.push({
          parent_id: res.data.parent_id,
          time: promise.conversionTime(res.data.created_at),
          name: wx.getStorageSync('myUsername'),
          avatar: wx.getStorageSync('avatar'),
          reply_name:res.data.reply_name,
          parent_id: res.data.parent_id,
          content:res.data.content,
        })
        that.setData({
          replyInp: "",
          replyList:replyList
        })
        wx.showToast({
          title: '评论成功',
          icon: "none",
          duration: 1000,
          mask: true,
        })
      } else {
        wx.showModal({
          title: '温馨提示',
          content: '请登录后再评论',
        })
      }

    }, err => {
      //err 为 HError 对象
    })
  },
  //触摸事件切换到回复楼主
  touchstar: function () {
    this.setData({
      check: true,
      focus: false,
      contentInp: "",
      replyInp: "",
    })
  },

})