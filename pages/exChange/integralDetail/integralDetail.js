const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    integralDetail: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      height: util.getallheigth().clientHeight
    })
    this.getscoresinfo(0, 200)

  },
  mycorkscrew() {
    wx.navigateTo({
      url: '/pages/exChange/jiuZuanDetail/jiuZuanDetail'
    })
  },

  getscoresinfo(offset, limit) {
    util.http.postJson("fn/user/get/admin",{
      'act': 'Scores_scoresDetail',
      'offset': offset,
      'limit': limit
    }, function(res) {
      if (!res.data) {
        return;
      }
      let num = 0
      for (let i = 0; i < res.data.length; i++) {
        num += parseInt(res.data[i].scores)
      }
      console.log('num', num)
      this.setData({
        integralDetail: res.data
      })

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
    console.log('触底')
    let integralDetailnum = this.data.integralDetail.length
    this.getscoresinfo(0, integralDetailnum + 10)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})