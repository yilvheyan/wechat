// pages/PersonalPub/changeInformation/changeInformation.js
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid: 0,
    heqaderimg: '',
    userininfor: {}
  },
  shopname(e) {
    this.data.userininfor.name = e.detail.value
  },
  shopsimple(e) {
    this.data.userininfor.desc = e.detail.value
  },





  //数据保存
  preservation() {
    util.http.postJson("fn/user/get/admin",{
      'act': 'Shop_editShopinfo',
      'uid': this.data.userid,
      'name': this.data.userininfor.name,
      'desc': this.data.userininfor.desc
    }, function(res) {
      if (res.ok) {
        wx.setStorageSync('shopname'.data.userininfor.name)
        wx.redirectTo({
          url: '/pages/PersonalPub/shopSetUp/shopSetUp'
        })
      }

    })
  },







  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var userid = wx.getStorageSync('userid')
    this.data.userid = userid
    util.http.postJson("fn/user/get/admin",{
      'act': 'Shop_shopDetail',
      'uid': userid
    }, function(res) {
      res.data.shop.image = imageUrl + res.data.shop.image
      // res.data.account.head = imageUrl + res.data.account.head
      var patt = /http/
      let thisplayimage = res.data.account.head
      if (!patt.test(thisplayimage)) {
        res.data.account.head = imageUrl + thisplayimage
      }
      this.setData({
        userininfor: res.data.shop,
        heqaderimg: res.data.account.head
      });
    })
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

  }
})