//app.js
import './vendor/weapp-cookie/index';

App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  onShow: function(options) {
    console.log(options)
    if (options.shareTicket) {
      this.globalData.scene = options.scene
      wx.setStorageSync('scene', options.scene)
    }
    if (options.path == 'pages/findlist/contentxiang/contentxiang' || options.path == 'pages/findlist/listdetails/listdetails') {
      wx.setStorageSync('sharepath', 1)
    }
    // this.globalData.scene = options
    // wx.getShareInfo({
    //     shareTicket: options.shareTicket,
    //     success(res) {
    //         console.log(res.errMsg)
    //         console.log(res.encryptedData)
    //         console.log(res.iv)
    //     }
    //     // complete(res) {
    //     //     console.log(res)
    //     // }
    // })

  },
  globalData: {
    scene: 0,
    userInfo: null,
    openid: '',
    imageUrl: 'https://jiangxiaobai.test.ishzm.com/public',
    publicUrl: 'http://127.0.0.1:8088/xapi/',
    imageUrlfound: 'http://127.0.0.1:8088/xapi/',
    // imageUrl: 'https://jiangxiaobai.test.ishzm.com/public',
    // imageUrlfound: 'https://jiangxiaobai.test.ishzm.com/public',
    // publicUrl: 'https://jiangxiaobai.test.ishzm.com/'
  }
})