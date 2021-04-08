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
    imgUrls: {},
    bannerimgUrls: [],
    id: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.data.id = options.id
    this.data.shopuid = options.shopuid
    util.http.postJson("fn/user/get/admin",{
      'act': 'Shop_goodsDetail',
      id: options.id
    }, function(res) {
      // var bannerarry = []
      let banner = res.data.playimage.split(',')
      for (var i = 0; i < banner.length; i++) {
        banner[i] = imageUrl + banner[i]
      }
      res.data.detailimage = imageUrl + res.data.detailimage
      this.setData({
        imgUrls: res.data,
        bannerimgUrls: banner
      })
    })
  },

  //添加到酒架按钮
  wineDatailPageslect() {
    util.http.postJson("fn/user/get/admin",{
      'act': 'Shop_goodsUpperShelf',
      'id': this.data.id
    }, function(res) {
      if (res.ok) {
          wx.navigateBack({
            delta: 2,
        //   url: '/pages/PersonalPub/shopSetUp/shopSetUp?shopuid=' + thisdata.shopuid
        })
        return;
      }
      if (res.data.code == 10001) {
        if (res.data.fail == 'goodsUpperShelf_join_fail') {
          wx.showToast({
            title: '当前酒未达到100%',
            icon: 'none',
            duration: 2000
          })
          return;
        }
      }
      if (res.data.code == 10001) {
        if (res.data.fail == 'goodsUpperShelf_not_join') {
          wx.showToast({
            title: '该商品已存在店铺中',
            icon: 'none',
            duration: 2000
          })
          return;
        }
        
      }


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