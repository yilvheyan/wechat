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
    currentIndex: 1,
    classify: [],
    wines: [],
    id: 0,
    imageUrl: getApp().globalData.imageUrl
  },
  //获取左边数据
  getShop_category() {
    util.http.postJson("fn/user/get/admin",{
      'act': 'Shop_category'
    }, function(res) {
      this.setData({
        classify: res.data
      });
    });
  },



  //获取右边数据
  getShop_categoryList(id, offset, limit) {
    console.log('11', id, offset, limit)
    util.http.postJson("fn/user/get/admin",{
      'act': 'Shop_categoryList',
      'id': id,
      'offset': offset,
      'limit': limit
    }, function(res) {
      if (!res.data) {
        this.setData({
          wines: [],
          currentIndex: id
        });
        return;
      }
      console.log(!res.data)
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].subname == null) {
          res.data[i].subname = '暂无介绍'
        }
        // let banner = res.data[i].playimage.split(',')
        // for (var k = 0; k < banner.length; k++) {
        //   banner[k] = imageUrl + banner[k]
        // }
        let bannerimg = res.data[i].playimage.split(',')
        for (let j = 0; j < bannerimg.length; j++) {
          bannerimg[j] = imageUrl + bannerimg[j]
        }
        res.data[i].playimage = bannerimg[0]
        console.log('aaa', bannerimg)
      }
      this.setData({
        wines: res.data,
        currentIndex: id
      });
    });
  },



  //添加商品
  addshow(e) {
    wx.navigateTo({
      url: '/pages/PersonalPub/wineDetailPage/wineDetailPage?id=' + e.currentTarget.dataset.id + '&shopuid=' + this.data.shopuid + "&shopname=" + '我'
    })
    console.log(e.currentTarget.dataset.id)


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.shopuid = options.shopuid
    // 获取分类
    this.getShop_category()
    this.getShop_categoryList(1, 0, 10)
  },
  //右边点击事件
  clickList: function(e) {
    let id = e.target.id;
    this.data.id = e.target.id;
    this.getShop_categoryList(id, 0, 10)
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