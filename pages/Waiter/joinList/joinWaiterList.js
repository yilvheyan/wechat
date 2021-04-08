// pages/Waiter/joinList/joinWaiterList.js
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chateau: [],
    shopList: [],
    showDialog: false,
    shopuid: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      height: util.getallheigth().clientHeight
    })
    util.http.postJson("fn/user/get/admin",{
      'act': 'Waiter_shopList',
      'offset': 0,
      'limit': 10
    }, function(res) {
      console.log('aa', res.data.length != 0)
      if (res.data && res.data.length != 0) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].background = imageUrl + res.data[i].background
          res.data[i].image = imageUrl + res.data[i].image
          if(res.data[i].icon){
            res.data[i].icon = imageUrl + res.data[i].icon;
          }
          res.data[i].opentime = util.formatTimeByTs(res.data[i].opentime, 'Y.M.D')
          this.setData({
            shopList: res.data
          });
        }
      }
    });
  },
  userAgreementClick: function(e) {
    this.setData({
      phone: '',
      password: '',
      type: 'userAgreement'
    });
  },
  toggleDialog() {
    this.setData({
      showDialog: true
    });

  },
  ontoggleDialog() {
    this.setData({
      showDialog: false
    });

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

  loadMore: function(e) {

  },

  applyWaiter: function(e) {
    // console.log(e.currentTarget.dataset.shopuid)

    wx.navigateTo({
      url: '/pages/Waiter/applyWaiter/applyWaiter?shopuid=' + e.currentTarget.dataset.shopuid + '&share=""'
    })
  },
  // 取消申请
  norequest: function(e) {
    let norequest = e.currentTarget.isapply;
    wx.showModal({
      content: '确认要取消该店小二的申请吗',
      success: function(res) {
        if (res.confirm) {
          console.log('已经取消申请')
          norequest == 1
        } else {
          console.log('未取消申请')
        }
      }
    })
  },
})