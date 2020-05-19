var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default
const promise = require('../../utils/promise.js');


var RecordStatus = {
  SHOW: 0,
  HIDE: 1,
  HOLD: 2,
  SWIPE: 3,
  RELEASE: 4
}

var RecordDesc = {
  0: '长按开始录音',
  2: '向上滑动取消',
  3: '松开手取消',
}

Page({
  data: {
    chatMsg: [],
    emojiStr: '',
    yourname: '',
    myName: '',
    sendInfo: '',
    userMessage: '',
    inputMessage: '',
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    show: 'emoji_list',
    view: 'scroll_view',
    toView: '',
    emoji: WebIM.Emoji,
    emojiObj: WebIM.EmojiObj,
    msgView: {},
    RecordStatus: RecordStatus,
    RecordDesc: RecordDesc,
    recordStatus: RecordStatus.HIDE,
  },
  onLoad: function (options) {

    var that = this
    console.log(options)
    var myName = wx.getStorageSync('ID')
    var options = JSON.parse(options.username)
    var xu = `${options.your}${myName}`
    var num = wx.getStorageSync(xu).length - 1
    var session = wx.getStorageSync(xu)
    console.log(session)
    if (num > 0) {
      var chatMsg=[]
      console.log(session)
      for (var i in session){
        console.log(session[i])
        chatMsg.push({
          info:session[i].info,
          mid: session[i].mid,
          msg: session[i].msg,
          time: conversionTime(session[i].time),
          username: session[i].username,
          yourname: session[i].yourname,
          style: session[i].style
        })
      }
      setTimeout(function () {
        that.setData({
          toView: wx.getStorageSync(xu)[num].mid
        })
      }, 10)
    }
    console.log(typeof(options.your.toString()))
   this.setData({
     yourname: options.your.toString(),
      myName: myName,
      inputMessage: '',
      chatMsg: chatMsg || []
    })
    console.log(that.data.chatMsg)
    wx.setNavigationBarTitle({
      title: options.name
    })
  },
  onShow: function () {
    var that = this
    this.setData({
      inputMessage: ''
    })
  },
  bindMessage: function (e) {
    this.setData({
      userMessage: e.detail.value
    })
  },
  cleanInput: function () {
    var that = this
    var setUserMessage = {
      sendInfo: that.data.userMessage
    }
    that.setData(setUserMessage)
  },
  //***************** 录音 begin ***************************
  changedTouches: null,
  toggleRecordModal: function (e) {
    this.setData({
      recordStatus: this.data.recordStatus == RecordStatus.HIDE ? RecordStatus.SHOW : RecordStatus.HIDE
    })
  },
  toggleWithoutAction: function (e) {
    console.log('toggleWithoutModal 拦截请求不做处理')
  },
  handleRecordingMove: function (e) {
    console.log(e)
    var touches = e.touches[0]
    var changedTouches = this.changedTouches

    if (!this.changedTouches) {
      return
    }
    // 无效
    // var changedTouches = e.changedTouches[0]
    // console.log(changedTouches.pageY, touches.pageY)

    if (this.data.recordStatus == RecordStatus.SWIPE) {

      if (changedTouches.pageY - touches.pageY < 20) {
        console.log('SWIPE')
        this.setData({
          recordStatus: RecordStatus.HOLD
        })
      }
    }
    if (this.data.recordStatus == RecordStatus.HOLD) {

      if (changedTouches.pageY - touches.pageY > 20) {
        this.setData({
          recordStatus: RecordStatus.SWIPE
        })
      }
    }

  },
  handleRecording: function (e) {
    var self = this
    console.log('handleRecording')
    this.changedTouches = e.touches[0]
    this.setData({
      recordStatus: RecordStatus.HOLD
    })
    wx.startRecord({
      fail: function (err) {
        // 时间太短会失败
        console.log(err)
      },
      success: function (res) {
        console.log('success')
        // 取消录音发放状态 -> 退出不发送
        if (self.data.recordStatus == RecordStatus.RELEASE) {
          console.log('user canceled')
          return
        }
        // console.log(tempFilePath)
        self.uploadRecord(res.tempFilePath)
      },
      complete: function () {
        console.log("complete")
        this.handleRecordingCancel()
      }.bind(this)
    })

    setTimeout(function () {
      //超时 
      self.handleRecordingCancel()
    }, 100000)
  },
  handleRecordingCancel: function () {
    console.log('handleRecordingCancel')
    // 向上滑动状态停止：取消录音发放
    if (this.data.recordStatus == RecordStatus.SWIPE) {
      this.setData({
        recordStatus: RecordStatus.RELEASE
      })
    } else {
      this.setData({
        recordStatus: RecordStatus.HIDE
      })
    }
    wx.stopRecord()
  },
  stopRecord: function (e) {
    let { url, mid } = e.target.dataset
    this.data.msgView[mid] = this.data.msgView[mid] || {}
    this.data.msgView[mid].isPlay = false;
    this.setData({
      msgView: this.data.msgView
    })
    wx.stopVoice()
  },
  playRecord: function (e) {
    console.log(e)
    let { url, mid } = e.target.dataset
    this.data.msgView[mid] = this.data.msgView[mid] || {}
    console.log(this.data.msgView)
    // reset all plays
    for (let v in this.data.msgView) {
      console.log('for')
      this.data.msgView[v] = this.data.msgView && (this.data.msgView[v] || {})
      this.data.msgView[v].isPlay = false
    }

    // is play then stop
    if (this.data.msgView[mid].isPlay) {
      console.log('is')
      this.stopRecord(e)
      return;
    }

    console.log(url, mid)
    this.data.msgView[mid].isPlay = true;
    this.setData({
      msgView: this.data.msgView
    })

    wx.downloadFile({
      url: url,
      success: function (res) {
        wx.playVoice({
          filePath: res.tempFilePath,
          complete: function () {
            this.stopRecord(e)
          }.bind(this)
        })
      }.bind(this),
      fail: function (err) {
      },
      complete: function complete() {
      }
    })
  },
  uploadRecord: function (tempFilePath) {
    var str = WebIM.config.appkey.split('#')
    var that = this
    wx.uploadFile({
      url: 'https://a1.easemob.com/' + str[0] + '/' + str[1] + '/chatfiles',
      filePath: tempFilePath,
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data'
      },
      success: function (res) {
        // return;

        // 发送xmpp消息
        var msg = new WebIM.message('audio', WebIM.conn.getUniqueId())
        var data = res.data
        var dataObj = JSON.parse(data)
        var file = {
          type: 'audio',
          'url': dataObj.uri + '/' + dataObj.entities[0].uuid,
          'filetype': '',
          'filename': tempFilePath
        }
        var option = {
          apiUrl: WebIM.config.apiURL,
          body: file,
          to: that.data.yourname,                  // 接收消息对象
          roomType: false,
          chatType: 'singleChat'
        }
        msg.set(option)
        WebIM.conn.send(msg.body)
        // 本地消息展示
        var time = WebIM.time()
        var msgData = {
          info: {
            to: msg.body.to
          },
          username: that.data.myName,
          yourname: msg.body.to,
          msg: {
            type: msg.type,
            data: msg.body.body.url,
            url: msg.body.body.url,
          },
          style: 'self',
          time: time,
          mid: msg.id
        }
        that.data.chatMsg.push(msgData)
        console.log(that.data.chatMsg)
        // 存储到本地消息
        var myName = wx.getStorageSync('ID')
        wx.setStorage({
          key: that.data.yourname + myName,
          data: that.data.chatMsg,
          success: function () {
            //console.log('success', that.data)
            that.setData({
              chatMsg: that.data.chatMsg
            })
            setTimeout(function (){
              that.setData({
                toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
              })
            }, 10)
          }
        })
      }
    })
  },
  //***************** 录音 end ***************************
  sendMessage: function () {

    if (!this.data.userMessage.trim()) return;//去除字符串的头尾空格


    var that = this
    // //console.log(that.data.userMessage)
    // //console.log(that.data.sendInfo)
    var myName = wx.getStorageSync('ID')
    var id = WebIM.conn.getUniqueId();
    var msg = new WebIM.message('txt', id);
    msg.set({
      msg: that.data.sendInfo,
      to: that.data.yourname,
      roomType: false,
      success: function (id, serverMsgId) {
        //console.log('success')
      }
    });
    // //console.log(msg)
    msg.body.chatType = 'singleChat';
    WebIM.conn.send(msg.body);
    console.log(msg)
    if (msg) {
      var value = WebIM.parseEmoji(msg.value.replace(/\n/mg, ''))
      var time = WebIM.time()
      var msgData = {
        info: {
          to: msg.body.to
        },
        username: that.data.myName,
        yourname: msg.body.to,
        msg: {
          type: msg.type,
          data: value
        },
        style: 'self',
        time: time,
        mid: msg.id
      }
      that.data.chatMsg.push(msgData)
      // console.log(that.data.chatMsg)

      wx.setStorage({
        key: that.data.yourname + myName,
        data: that.data.chatMsg,
        success: function () {
          //console.log('success', that.data)
          that.setData({
            chatMsg: that.data.chatMsg,
            emojiList: [],
            inputMessage: ''
          })
          setTimeout(function () {
            that.setData({
              toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
            })
          }, 100)
        }
      })
      that.setData({
        userMessage: ''
      })
    }
  },
  receiveMsg: function (msg, type) {
    console.log(msg)
    var that = this
    var myName = wx.getStorageSync('ID')
    if (msg.from == that.data.yourname || msg.to == that.data.yourname) {
      //console.log(msg)
      if (type == 'txt') {
        var value = WebIM.parseEmoji(msg.data.replace(/\n/mg, ''))
      } else if (type == 'emoji') {
        var value = msg.data
      }
      //console.log(msg)
      //console.log(value)
      var time = WebIM.time()
      var msgData = {
        info: {
          from: msg.from,
          to: msg.to
        },
        username: '',
        yourname: msg.from,
        msg: {
          type: type,
          data: value,
          url: msg.url
        },
        style: '',
        time: time,
        mid: msg.type + msg.id
      }
      if (msg.from == that.data.yourname) {
        msgData.style = ''
        msgData.username = msg.from
      } else {
        msgData.style = 'self'
        msgData.username = msg.to
      }
      //console.log(msgData, that.data.chatMsg, that.data)
      that.data.chatMsg.push(msgData)
      wx.setStorage({
        key: that.data.yourname + myName,
        data: that.data.chatMsg,
        success: function () {
          //console.log('success', that.data)
          that.setData({
            chatMsg: that.data.chatMsg,
          })
          setTimeout(function () {
            that.setData({
              toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
            })
          }, 100)
        }
      })
    }
  },
  openEmoji: function () {
    this.setData({
      show: 'showEmoji',
      view: 'scroll_view_change'
    })
  },
  sendEmoji: function (event) {
    var that = this
    var emoji = event.target.dataset.emoji

    console.log(emoji);
    var msglen = that.data.userMessage.length - 1
    console.log(that.data.userMessage)
    if (emoji && emoji != '[del]') {
      var str = that.data.userMessage + emoji
    } else if (emoji == '[del]') {
      var start = that.data.userMessage.lastIndexOf('[')
      var end = that.data.userMessage.lastIndexOf(']')
      var len = end - start
      console.log(start, end, len)
      if (end != -1 && end == msglen && len >= 3 && len <= 4) {
        var str = that.data.userMessage.slice(0, start)
      } else {
        var str = that.data.userMessage.slice(0, msglen)
      }
    }
    this.setData({
      userMessage: str,
      inputMessage: str
    })
  },
  sendImage: function () {
    var that = this
    var pages = getCurrentPages()
    pages[1].cancelEmoji()
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: function (res) {
        //console.log(res)
        //console.log(pages)
        if (pages[1]) {
          pages[1].upLoadImage(res, that)
        }
      }
    })
  },
  receiveImage: function (msg, type) {
    var that = this
    var myName = wx.getStorageSync('ID')
    //console.log(msg)
    if (msg) {
      //console.log(msg)
      var time = WebIM.time()
      var msgData = {
        info: {
          from: msg.from,
          to: msg.to
        },
        username: msg.from,
        yourname: msg.from,
        msg: {
          type: 'img',
          data: msg.url
        },
        style: '',
        time: time,
        mid: 'img' + msg.id
      }
      //console.log(msgData)
      that.data.chatMsg.push(msgData)
      //console.log(that.data.chatMsg)
      wx.setStorage({
        key: that.data.yourname + myName,
        data: that.data.chatMsg,
        success: function () {
          //console.log('success', that.data)
          that.setData({
            chatMsg: that.data.chatMsg
          })
          setTimeout(function () {
            that.setData({
              toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
            })
          }, 100)
        }
      })
    }
  },
  openCamera: function () {
    var that = this
    var pages = getCurrentPages()
    pages[pages.length-1].cancelEmoji()
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success: function (res) {
        if (pages[pages.length - 1]) {
          pages[pages.length - 1].upLoadImage(res, that)
        }
      }
    })
  },
  focus: function () {
    console.log(this.data.show)
    console.log(this.data.view)

    this.setData({
      show: 'emoji_list',
      view: 'scroll_view'
    })
  },
  cancelEmoji: function () {
    console.log(this.data.show)
    console.log(this.data.view)
    this.setData({
      show: 'emoji_list',
      view: 'scroll_view'
    })
  },
  scroll: function (e) {
    // //console.log(e)
  },
  lower: function (e) {
    //console.log(e)
  },
  upLoadImage: function (res, that) {
    //console.log(res)
    var tempFilePaths = res.tempFilePaths
    //console.log(tempFilePaths)
    wx.getImageInfo({
      src: res.tempFilePaths[0],
      success: function (res) {
        // console.log(res)
        var allowType = {
          'jpg': true,
          'gif': true,
          'png': true,
          'bmp': true
        };
        var str = WebIM.config.appkey.split('#')
        var width = res.width
        var height = res.height
        var index = res.path.lastIndexOf('.')
        if (index != -1) {
          var filetype = res.path.slice(index + 1)
        }
        if (filetype.toLowerCase() in allowType) {
          wx.uploadFile({
            url: 'https://a1.easemob.com/' + str[0] + '/' + str[1] + '/chatfiles',
            filePath: tempFilePaths[0],
            name: 'file',
            header: {
              'Content-Type': 'multipart/form-data'
            },
            success: function (res) {
              var data = res.data
              var dataObj = JSON.parse(data)
              // console.log(dataObj)
              var id = WebIM.conn.getUniqueId();                   // 生成本地消息id
              var msg = new WebIM.message('img', id);
              var file = {
                type: 'img',
                size: {
                  width: width,
                  height: height
                },
                'url': dataObj.uri + '/' + dataObj.entities[0].uuid,
                'filetype': filetype,
                'filename': tempFilePaths[0]
              }
              //console.log(file)
              var option = {
                apiUrl: WebIM.config.apiURL,
                body: file,
                to: that.data.yourname,                  // 接收消息对象
                roomType: false,
                chatType: 'singleChat'
              }
              msg.set(option)
              WebIM.conn.send(msg.body)
              if (msg) {
                //console.log(msg,msg.body.body.url)
                var time = WebIM.time()
                var msgData = {
                  info: {
                    to: msg.body.to
                  },
                  username: that.data.myName,
                  yourname: msg.body.to,
                  msg: {
                    type: msg.type,
                    data: msg.body.body.url,
                    size: {
                      width: msg.body.body.size.width,
                      height: msg.body.body.size.height,
                    }
                  },
                  style: 'self',
                  time: time,
                  mid: msg.id
                }
                that.data.chatMsg.push(msgData)
                //console.log(that.data.chatMsg)
                var myName = wx.getStorageSync('ID')
                wx.setStorage({
                  key: that.data.yourname + myName,
                  data: that.data.chatMsg,
                  success: function () {
                    //console.log('success', that.data)
                    that.setData({
                      chatMsg: that.data.chatMsg
                    })
                    setTimeout(function () {
                      that.setData({
                        toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
                      })
                    }, 10)
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  previewImage: function (event) {
    var url = event.target.dataset.url
    wx.previewImage({
      urls: [url]  // 需要预览的图片http链接列表
    })
  }
})

















