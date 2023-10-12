// pages/settings/settings.js
const app = getApp();
Page({
  data: {
    keyValue: '', // 用于存储用户输入的密钥
  },

  onShow: function(e){
    this.setData({userInfo:app.globalData.userInfo, host:app.globalData.host})
    let that = this;
    wx.getStorage({
      key:'apiKey',
      success(res){
        console.log(res);
        that.setData({keyValue:res.data});
      },
      fail(res){
        console.log(res);
      }
    })
  },

  // 处理输入框输入事件
  inputKey: function (e) {
    this.setData({
      keyValue: e.detail.value,
    });
  },

  // 处理保存设置按钮点击事件
  saveSettings: function () {
    // 在这里处理保存密钥的逻辑，可以将密钥存储到本地或发送到服务器
    const key = this.data.keyValue;
    wx.setStorage({key: 'apiKey', data: key})
    // 返回上一页（聊天界面），这里假设设置页面是从聊天界面跳转过来的
    wx.navigateBack();
  },
});
