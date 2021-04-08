const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopname: '',
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let nickName = wx.getStorageSync('userInfo').nickName;
    let shopuid = wx.getStorageSync('userid')
    let shopname = this.data.shopname
    let needwaiter = 'needwaiter'
    console.log(nickName)
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: nickName + '邀请你成为他的小二',
      desc: '单纯高粱酒江小白',
      //TODO:页面条状到单独的个人招聘页面
      path: '/pages/PersonalPub/myStorerecruit/myStorerecruit?shopuid=' + shopuid + '&shopname=' + shopname + "&ishare=needwaiter",
      withShareTicket: true
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.shopname=options.shopname;
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


})