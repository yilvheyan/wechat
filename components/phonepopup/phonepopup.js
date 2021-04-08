// components/popup/popup.js
const app = getApp();
const util = require('../../utils/util.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    getuserinfoShow: false,
    callback: null,
    aa:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    thaa(fun)  {
      this.setData({
        aa:fun
      });
    },
    show: function(cb) {
      if (cb) {
        this.setData({
          getuserinfoShow: true,
          callback: cb,
          aa:0
        });
      } else {
        this.setData({
          getuserinfoShow: true,
          callback: null
        });
      }
    },
    getPhoneNumber(e) {
      var _this = this
      console.log(e.detail.errMsg)
      console.log(e.detail.iv)
      console.log('encryptedData', e.detail.encryptedData)
      let encryptedData = e.detail.encryptedData

      let vi = e.detail.iv
      wx.login({
        success(res) {
          if (res.code) {
            console.log(res.code);
            let codell = res.code
            wx.request({
              url: getApp().globalData.publicUrl,
              data: {
                'act': 'Account_getphone',
                'encryptedData': encryptedData,
                'iv': vi,
                'code': codell
              },
              method: 'POST',
              success: function(res) {
                if (!res.data.phoneNumber) {

                } else {
                  console.log(res);
                  wx.setStorageSync('phone', res.data.phoneNumber);
                  wx.request({
                    url: getApp().globalData.publicUrl,
                    data: {
                      'act': 'Account_whogetphone',
                      'phone': res.data.phoneNumber,
                      'openid': wx.getStorageSync('openid')
                    },
                    method: 'POST',
                    success: function(res) {

                    }
                  })
                  if (_this.data.callback != null) {
                    _this.data.callback();
                  }
                  _this.setData({
                    getuserinfoShow: false,
                    callback: null
                  })
                }
              }
            })
          } else {
            console.log('获取手机号失败!' + res.errMsg);
          }
        }
      });
    },
    noshow() {
      this.setData({
        getuserinfoShow: false,
        callback: null
      })
    },














    // getUserInfo: function(e) { //授权
    //   if (e.detail.errMsg == 'getUserInfo:ok') {
    //     console.log(e)
    //     app.globalData.userInfo = e.detail.userInfo;
    //     wx.setStorageSync('userInfo', e.detail.userInfo)
    //     util.getOpenid()
    //     if (this.data.callback != null) {
    //       this.data.callback();
    //     }
    //     this.setData({
    //       getuserinfoShow: false,
    //       callback: null
    //     })
    //   }
    // },
  }
})