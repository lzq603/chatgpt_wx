// app.js
App({
  onLaunch() {
    // 登录
    let that = this;
    wx.login({
      success: res => {
        console.log(res);
        wx.request({
          url: that.globalData.host + '/login/?code=' + res.code + '&appid=' + that.globalData.appid + '&appsecret=' + that.globalData.appsecret,
          success(res){
            console.log(res);
            wx.setStorage({key: 'times', data:res.data.data.times})
            that.globalData.userInfo = res.data.data;
          },
          fail(res){
            console.log(res);
            // wx.showToast({title: '初始化失败', icon: 'error'})
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    // host: 'http://82.157.22.44:8000/chat',
    // ws_host: 'ws://82.157.22.44:8000/chat',
    host: 'https://chatwx.crazystone.work/chat',
    ws_host: 'wss://chatwx.crazystone.work/chat',
    appid: 'wx56b7c4105309a84f',
    appsecret: 'b339a20b55090910ab79615121f6952f'
  }
})
