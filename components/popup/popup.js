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
    callback: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show: function(cb) {
      if (cb) {
        this.setData({
          getuserinfoShow: true,
          callback: cb
        });
      } else {
        this.setData({
          getuserinfoShow: true,
          callback: null
        });
      }
    },
    getUserInfo: function(e) { //授权
      var _this = this
      console.log('e',e);
      // if (e.detail.errMsg == 'getUserInfo:ok') {
      //   util.getOpenid(function() {
      //     util.http.postJson("fn/user/get/admin",{
      //       'act': 'account_register',
      //       'nickname': e.detail.userInfo.nickName,
      //       'head': e.detail.userInfo.avatarUrl,
      //       sex: e.detail.userInfo.gender,
      //       openid: wx.getStorageSync('openid')
      //     }, function(res) {
      //       wx.removeStorageSync('role');
      //       wx.setStorageSync('role', res.data.role)
      //       wx.setStorageSync('userid', res.data.id)
      //       wx.setStorageSync('rolestate', res.data.rolestate)
      //       wx.setStorageSync('accountinfo', res.data)

      //       if (res.data.phone) {
      //         wx.setStorageSync('phone', res.data.phone)
      //       }
      //       // debugger;
      //       let userInfo = {}
      //       userInfo.nickName = res.data.nickname
      //       userInfo.avatarUrl = res.data.head
      //       userInfo.gender = res.data.sex
      //       wx.setStorageSync('userInfo', userInfo)
      //       app.globalData.userInfo = userInfo;
      //       if (_this.data.callback != null) {
      //         _this.data.callback();
      //       }
      //       _this.setData({
      //         getuserinfoShow: false,
      //         callback: null
      //       })


      //     });
      //   })

      // }
    },
    noshow() {
      this.setData({
        getuserinfoShow: false,
        callback: null
      })
    },
  }
})