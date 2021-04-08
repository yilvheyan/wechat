const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    infoid: 0,
    bannerimgUrls: [],
    // title: '江小白果味白酒100ml*12瓶粮食酒高粱酒小平就语录表达',
    // name: '苹果味高粱酒23度168ml装',
    detailimage: 'http://qiniu-test.ishzm.com/jxb/img/exChange/jifen_big.png'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.data.infoid = options.infoid
    util.http.postJson("fn/user/get/admin",{
      'act': 'Scores_goodsDetail',
      id: options.infoid
    }, function(res) {
      let bannerimg = res.data.playimage.split(',')
      for (let i = 0; i < bannerimg.length; i++) {
        bannerimg[i] = imageUrl + bannerimg[i]
      }
      res.data.detailimage = imageUrl + res.data.detailimage
      this.setData({
        imgUrls: res.data,
        bannerimgUrls: bannerimg
      })
    })
  },
  // 立即兑换
  withdfoot(e) {
    let presellName = this.data.imgUrls.name;
    wx.navigateTo({
      url: '/pages/exChange/GoodsOrder/GoodsOrder?infoid=' + this.data.infoid + '&presellName=' + presellName
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
  //子传父判断是否登录
})