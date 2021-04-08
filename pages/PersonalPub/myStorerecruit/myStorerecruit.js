// pages/PersonalPub/myStorerecruit/myStorerecruit.js
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showwaiter: false,
    recruit: 1,
    shopuid: 0,
    shopname: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.shopuid = options.shopuid
    this.data.shopname = options.shopname
    this.setData({
      shopuid: options.shopuid,
      shopname: options.shopname
    })
    //微信授权
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        showwaiter: true,
      })
    } else {
      let getuserinoflogin = this.selectComponent("#popup");
      console.log('aa', getuserinoflogin)
      getuserinoflogin.show(() => {
        this.setData({
          showwaiter: true,
        });
      })
    }
  },

  //点击招募小二
  getorder() {
    if (wx.getStorageSync('role') >= 1) {
      wx.showModal({
        content: '您已经是小二或者是店主，不能再申请小二',
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/Waiter/applyWaiter/applyWaiter?shopuid=' + this.data.shopuid + "shopname=" + this.data.shopname + '&share=share',
    })
  },

  // gotoshop() {
  //   if (wx.getStorageSync('role') >= 1) {
  //     let rolenum = wx.getStorageSync('role')
  //     wx.showModal({
  //       content: '您已经是小二或者是店主，不能再申请小二',
  //     })
  //     return;
  //   }
  //   wx.navigateTo({
  //     url: '/pages/Waiter/applyWaiter/applyWaiter?shopuid=' + this.data.shopuid + "shopname=" + this.data.shopname+'&share=share',
  //   })

  //   // util.http.postJson("fn/user/get/admin",{
  //   //   'act': 'Waiter_isWaiter',
  //   //   'shopuid': this.data.shopuid
  //   //   // 'shopuid': 96
  //   // }, function(res) {
  //   //   wx.showModal({
  //   //     title: '',
  //   //     content: 'shopuid' + thisdata.shopuid + res.data.code + thisdata.shopname,
  //   //   })
  //   //   if (res.ok) {
  //   //     wx.navigateTo({
  //   //       url: '/pages/Waiter/applyWaiter/applyWaiter?shopuid=' + thisdata.shopuid + "shopname=" + thisdata.shopname,
  //   //     })
  //   //   } else {
  //   //     wx.showModal({
  //   //       title: '不符合小二申请',
  //   //       content: '申请小二条件必须在该店买过商品',
  //   //       cancelText: '否',
  //   //       confirmText: '是',
  //   //       success(res) {
  //   //         if (res.cancel) {
  //   //           // 用户点击了取消属性的按钮，对应选择了'否'
  //   //           wx.navigateTo({
  //   //             url: '/pages/PersonalPub/myStore/myStore?shopuid=' + thisdata.shopuid + "&shopname=" + thisdata.shopname + "&ishare=needwaiter",
  //   //           })
  //   //         } else if (res.confirm) {
  //   //           // 用户点击了确定属性的按钮，对应选择了'是'
  //   //           wx.navigateTo({
  //   //             url: '/pages/PersonalPub/myStore/myStore?shopuid=' + thisdata.shopuid + "&shopname=" + thisdata.shopname + "&ishare=needwaiter",
  //   //           })
  //   //         }
  //   //       }
  //   //     })
  //   //   }
  //   // })
  // },
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

  }
})