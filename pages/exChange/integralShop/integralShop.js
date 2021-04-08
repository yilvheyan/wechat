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
    currentIndex: 0,
    classify: [
      // {
      //     id: '1',
      //     name: "KOL酒品"
      // }
    ],
    wines: [
      // {
      //     name: "江小白单纯高粱酒40度表达瓶",
      //     price: '249.00',
      //     subname: "100ml*6箱装",
      //     detailimage: 'http://qiniu-test.ishzm.com/jxb/img/chateau/pic_one.png',
      //     id: 5
      // }
    ],
    imageUrl: getApp().globalData.imageUrl
  },

  //zuo边点击事件
  integralShop: function(e) {
    console.log('e', e)
    let cid = e.target.dataset.id;
    let cindex = e.currentTarget.dataset.index;
    util.http.postJson("fn/user/get/admin",{
      'act': 'Scores_categoryList',
      'id': cid,
      'offset': 0,
      'limit': 20
    }, function(res) {
      if (res.data == undefined) {
        this.setData({
          wines: [],
          currentIndex: cindex
        });
        return;
      }
      for (let i = 0; i < res.data.length; i++) {
        let bannerimg = res.data[i].playimage.split(',')
        for (let j = 0; j < bannerimg.length; j++) {
          bannerimg[j] = imageUrl + bannerimg[j]
        }
        res.data[i].bannerimg = bannerimg
      }
      this.setData({
        wines: res.data,
        currentIndex: cindex
      });
    });
  },
  //添加商品
  addshow(e) {
    wx.navigateTo({
      url: '/pages/exChange/withdrawDetails/withdrawDetails?infoid=' + e.currentTarget.dataset.id + '&shopuid=' + this.data.shopuid
    })
    console.log(e.currentTarget.dataset.id)

  },

  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.shopuid = options.shopuid
    // 获取分类
    util.http.postJson("fn/user/get/admin",{
      'act': 'Scores_category'
    }, function(res) {
      let id = res.data[0].id
      this.setData({
        classify: res.data
      });
      thisgetcategoryList(id, 0, 20)
    });
    // 商品分类详细列表
    this.getcategoryList(0, 20)
  },

  getcategoryList(id, offset, limit) {
    util.http.postJson("fn/user/get/admin",{
      'act': 'Scores_categoryList',
      'id': id,
      'offset': offset,
      'limit': limit
    }, function(res) {
      if (res.data == undefined) {
        this.setData({
          wines: [],
          currentIndex: 0
        });
        return;
      }
      for (let i = 0; i < res.data.length; i++) {
        let bannerimg = res.data[i].playimage.split(',')
        for (let j = 0; j < bannerimg.length; j++) {
          bannerimg[j] = imageUrl + bannerimg[j]
        }
        res.data[i].bannerimg = bannerimg
      }
      console.log('aaaa', res.data)
      this.setData({
        wines: res.data,
        currentIndex: 0
      });
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

  }
})