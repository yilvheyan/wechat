// pages/exChange/jiuZuanDetail/jiuZuanDetail.js
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: wx.getSystemInfoSync().windowWidth,
    jiuzuanDetail: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      height: util.getallheigth().clientHeight
    })
    this.getdetail(0, 10)

  },
  // 酒钻明细请求
  getdetail(offset, limit) {
    util.http.postJson("fn/user/get/admin",{
      'act': 'Diamond_detail',
      'offset': offset,
      'limit': limit
    }, function(res) {
      if (!res.data) {
        return;
      }
      if (res.ok) {
        this.setData({
          jiuzuanDetail: res.data
        });
      }
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
    let jiuzuanDetailnum = this.data.jiuzuanDetail.length
    this.getdetail(0, jiuzuanDetailnum + 10)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})