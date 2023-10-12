// index.js
// 获取应用实例
const app = getApp();
const INPUTING = 1;
const ANSWERING = 2;
// chat.js
Page({
  data: {
    hint: '',
    showHint: false,
    greeting: '',
    apiKey: '',
    messages: [],
    inputMessage: '',
    state: INPUTING
  },
  // 添加处理发送消息的逻辑
  sendMessage: function (e) {
    console.log(e)
    var inputMessage = this.data.inputMessage;
    var messages = this.data.messages;
    messages.push({ content: inputMessage, type: 'right'})
    this.setData({messages:messages, inputMessage: ''})
    if(this.data.times <= 0 && !this.data.apiKey){
      this.setData({showHint:true});
      return;
    }
    messages.push({ content: '', type: 'left'})
    this.setData({messages:messages, state:ANSWERING})
    // 响应处理
    let that = this;
    var socketTask = wx.connectSocket({
      url: app.globalData.ws_host + '/ws/chat/',
      success(res){
        console.log("连接成功");
      }
    })
    socketTask.onOpen(function(e){
      var data = {
        message: inputMessage,
        openid: app.globalData.userInfo.openid,
        history: that.data.messages,
        api_key: that.data.apiKey
      }
      socketTask.send({
        data: JSON.stringify(data)
      });
    })
    socketTask.onMessage(function(e){
      console.log(e);
      var res = JSON.parse(e.data);
      if(res.finish){
        that.setData({state:INPUTING})
        if(!that.data.apiKey && !res.error){
          var times = that.data.times;
          that.setData({times:times - 1});
        }
      }
      var sub = that.data.messages.length - 1;
      var msg = that.data.messages[sub].content + res.message;
      var key = 'messages[' + sub + '].content';
      that.setData({[key]: msg});
    })
    socketTask.onError(function(e){
      console.log(e);
    })
    socketTask.onClose(function(e){
      console.log(e);
    })
  },

  onShow: function(e){
    let that = this;
    wx.getStorage({
      key:'apiKey',
      success(res){
        console.log(res);
        that.setData({apiKey:res.data, showHint:false});
      }
    })
  },

  onLoad: function(e){
    let that = this;
    wx.showLoading({title: '初始化...', mask:true})
    var s = setInterval(function(){
      if(app.globalData.userInfo){
        // 受邀
        if (e.id){
          console.log(e.id);
          wx.request({
            url: app.globalData.host + '/join?id=' + e.id + '&openid=' + app.globalData.userInfo.openid,
            success(res){
              console.log(res);
            },
            fail(res){
              console.log(res);
            }
          });
        }
        wx.hideLoading();
        that.setData({times:app.globalData.userInfo.times})
        clearInterval(s);
      }
    }, 100)
    // 获取配置

    wx.request({
      url: app.globalData.host + '/get_config/',
      success(res){
        console.log(res);
        that.setData({greeting:res.data.greeting, hint:res.data.hint})
      },
      fail(res){
        console.log(res);
      }
    })
  },

  // 打开设置页面的点击事件处理函数
  openSettings: function () {
    wx.navigateTo({
      url: '/pages/settings/settings?id=5',
    });
  },

  onShareAppMessage(){
    return {
      title: '写作神器',
      path: '/pages/index/index?id=' + app.globalData.userInfo.openid
    }
  },

  clearMessages: function () {
    this.setData({
      messages: [],
      state: INPUTING,
      hint: false
    });
  },

  copyMessage: function (e) {
    const messageText = e.currentTarget.dataset.content;
    wx.setClipboardData({
      data: messageText,
      success: function () {
        wx.showToast({
          title: '复制成功',
        });
      },
    });
  },
});
