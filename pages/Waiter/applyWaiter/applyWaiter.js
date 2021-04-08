// pages/Waiter/applyWaiter/applyWaiter.js
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopuid: 0,
    applywaitername: '',
    applywaiterphone: '',
    applywaitercats: '',
    share: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('applyWaiter options:', options);
    this.data.shopuid = options.shopuid
    this.data.share = options.share
  },

  waiert_nameInput(e) {
    this.data.applywaitername = e.detail.value

  },
  waiert_phoneInput(e) {
    this.data.applywaiterphone = e.detail.value
    // if (this.data.applywaiterphone.length == 0) {
    //     wx.showToast({ title: '请输入手机号！', icon: 'none', duration: 1500 })
    // }
    // if (this.data.applywaiterphone.length != 11) {
    //     wx.showToast({ title: '手机号长度有误！', icon: 'none', duration: 1500 })
    // }
    // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    // if (!this.data.applywaiterphone.test(this.data.applywaiterphone)) {
    //     wx.showToast({ title: '手机号有误！', icon: 'none', duration: 1500 })
    // }
  },
  waiert_catInput(e) {
    this.data.applywaitercats = e.detail.value
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  applyWaiter: function(e) {
    if (wx.getStorageSync('userid') == 0) {
      let popup = this.selectComponent("#popup");
      popup.show(() => {

      })
      return;
    }
    if (wx.getStorageSync('role') > 0) {
      wx.showModal({
        title: '不符合条件！',
        content: '您已经是小二或者店主！'
      })
      return;
    }

    let username = e.detail.value.username;
    let mobile = e.detail.value.mobile;
    let wechatId = e.detail.value.wechatId;
    if (username == '' || mobile == '' || wechatId == '') {
      wx.showModal({
        title: '提示',
        content: '申请信息填写有误，请核对信息。'
      })
      return;
    }
     console.log(username);
    this.data.share=this.data.share||"";
    util.http.postJson("fn/user/get/admin",{
      'act': 'Waiter_applyWaiter',
      'shopuid': this.data.shopuid,
      'name': username,
      'mobile': mobile,
      'wechatID': wechatId,
      "share": this.data.share
    }, function(res) {
      if (res.data.code == 10001) {
        wx.showModal({
          content: '申请失败！',
        })
      }
      if (res.ok) {
        wx.showModal({
          title: '申请成功',
          content: '您已申请成功，是否返回首页？',
          showCancel: true, //是否显示取消按钮
          cancelText: "否", //默认是“取消”
          confirmText: "是", //默认是“确定”
          success: function(res) {
            if (res.cancel) {
              //点击取消,默认隐藏弹框
              var pages = getCurrentPages(); // 当前页面
              var beforePage = pages[pages.length - 2];
              wx.navigateBack({
                success: function() {
                  beforePage.onLoad(); // 执行前一个页面的onLoad方法
                }
              });
            } else {
              //点击确定
              wx.switchTab({
                url: '/pages/home/home',
              })
            }
          }
        })

      } else {

      }
    });
  }
})