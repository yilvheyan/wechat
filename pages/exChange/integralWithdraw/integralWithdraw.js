const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopuid: 0,
    infoid: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.shopuid = options.shopuid;
    // 我的收益
    util.http.postJson("fn/user/get/admin",{
      'act': 'Scores_gains',
    }, function(res) {
      if (res.ok) {
        this.setData({
          thismonth: res.data.thismonth,
          totalmonth: res.data.totalmonth
        });
      } else {

      }
    });
    //积分兑换商品列表
    util.http.postJson("fn/user/get/admin",{
      'act': 'Scores_lists'
    }, function(res) {
      if (res.ok) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].detailimage = imageUrl + res.data[i].detailimage
          let bannerimg = res.data[i].playimage.split(',')
          for (let j = 0; j < bannerimg.length; j++) {
            bannerimg[j] = imageUrl + bannerimg[j]
          }
          res.data[i].bannerimg = bannerimg
        }
        this.setData({
          myshopkeeper: res.data,
        })

      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  //   兑换记录
  Withdraw() {
    wx.navigateTo({
      url: '/pages/exChange/mySpiritRoom/mySpiritRoom'
    })
  },
  // 前往积分商城
  myWithdraw() {
    wx.navigateTo({
      url: '/pages/exChange/integralShop/integralShop?shopuid=' + this.data.shopuid
    })
  },
  // 酒品的详情
  gowithdrawDetails(e) {
    wx.navigateTo({
      url: '/pages/exChange/withdrawDetails/withdrawDetails?infoid=' + e.currentTarget.dataset.infoid
    })
  },
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
  onShareAppMessage: function() {}

})