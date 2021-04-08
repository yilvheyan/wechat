// pages/findlist/searchwine/searchwine.js
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchmainlist: [],
    serarchname: ''

  },
  //添加酒品
  getjiupin(e) {
    console.log('item', e.currentTarget.dataset.item)
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2] // 上一页
    let waiteruid = 1
    if (e.currentTarget.dataset.shopuid == wx.getStorageSync('userid')) {
      waiteruid = 0
    } else {
      waiteruid = wx.getStorageSync('userid')
    }
    // 调用上一个页面的setData 方法，将数据存储
    console.log(e.currentTarget.dataset.playimage)
    prevPage.setData({
      istestdata: true,
      id: e.currentTarget.dataset.item.id,
      playimage: e.currentTarget.dataset.item.playimage,
      name: e.currentTarget.dataset.item.name,
      subname: e.currentTarget.dataset.item.subname,
      price: e.currentTarget.dataset.item.price,
      shopuid: e.currentTarget.dataset.shopuid,
      waiteruid: waiteruid
    })
    // 返回上一页
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      height: util.getallheigth().clientHeight
    })
    this.souchshop()
  },

  // bindinput(e) {
  //   this.data.serarchname = e.detail.value
  //   // console.log(this.data.serarchname)
  // },

  // bindconfirm(e) {
  //   let sname = e.detail.value
  //   this.souchshop()
  // },

  //搜索,显示商品
  souchshop() {
    util.http.postJson("fn/user/get/admin",{
      'act': 'Found_goodsLists',
    }, function(res) {
      for (let i = 0; i < res.data.length; i++) {
        let playimagebanner = res.data[i].playimage.split(',')
        for (let j = 0; j < playimagebanner.length; j++) {
          playimagebanner[j] = imageUrl + playimagebanner[j]
        }
        res.data[i].playimage = playimagebanner[0]
        res.data[i].detailimage = imageUrl + res.data[i].detailimage
        res.data[i].shopuid = res.data[i].uid
      }
      this.setData({
        searchmainlist: res.data
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
    let searchmainlistnum = this.data.searchmainlist.length + 10;
    this.souchshop(0, searchmainlistnum, sname)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})