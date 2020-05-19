var postsData = require('../data/posts-data.js');
const promise = require('../../utils/promise.js');

Page({
  data: {
    postList: [],
    currentset: 0
  },
  onLoad: function() {
    try {
      const res = wx.getSystemInfoSync()
      console.log(res.windowHeight)
      this.setData({
        windowHeight: res.windowHeight
      })
    } catch (e) {
      // Do something when catch error
    }
    var currentset = this.data.currentset
    this.requestPosts(currentset)
  },
  onPostTap: function(event) {
    console.log(event)
    var item = event.currentTarget.dataset.item;
    wx.navigateTo({
      url: 'post-detail/post-detail?item=' + JSON.stringify(item) + '&&index=' + event.currentTarget.dataset.index
    })
  },

  requestPosts(currentset) {
    console.log('加载完毕')
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var postList = that.data.postList
    var Posts = new wx.BaaS.TableObject('ports');
    // var User = new wx.BaaS.User()
    var query = new wx.BaaS.Query();
    Posts.limit(4).offset(currentset).orderBy('-created_at').expand('created_by').find().then(res => {
      var next = res.data.meta.next;
      var data = res.data.objects;
      if (data != '') {
       for(var i of data){
         postList.push({
           id:i.id,
           date: promise.conversionTime(i.created_at),
           title:i.title,
           imgSrc:i.imgSrc,
           avatar: i.created_by.avatar,
           content:   `${i.content.substring(0, 65)}.....`,
           reading: i.comments,
           collection: i.collection,
           author: i.created_by.nickname,
           detail:i.content,
           postId:i.id
         })
       }
        console.log(postList)
       that.setData({
         postList:postList
       })
        wx.hideLoading()
      }
      if (!next) { //文章已加载完毕
        wx.showToast({
          title: '文章已加载完毕',
          icon: 'none'
        })
          
      }
    })
  },

  onSwiperTap: function(event) {
    var item = event.currentTarget.dataset.item;
    wx.navigateTo({
      url: 'post-detail/post-detail?item=' + JSON.stringify(item)
    })
  },

  getMorePosts: function() {
    var currentset = this.data.currentset+4;
    this.requestPosts(currentset);
    this.setData({
      currentset: currentset
    })
  }

})