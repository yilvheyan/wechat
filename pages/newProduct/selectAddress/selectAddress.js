// pages/choaddress/choaddress.js
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choindex: 0,
    choaddresslist: [],
    changeaddress: {
      state: true,
      name: '小米',
      phone: 12345678911,
      address: '上海市上海区',
      xiangaddress: '上海地上海公寓上海号1008111111111111'
    }
  },
  //打钩点击事件
  choosecli(e) {
    var oindex = e.currentTarget.dataset.index
    util.http.postJson("fn/address/ext/useaddress", {
      'id': oindex
    }, (res)=> {
      this.getaddrees();
    })

    
  },
  // 确认按钮
  confirm() {
    var pages = getCurrentPages(); // 当前页面
    var beforePage = pages[pages.length - 2];
    wx.navigateBack({

    });
  },
  //对已有的地址进行编辑
  bianji(e) {
    var oindex = e.currentTarget.dataset.index.id
    console.log(e.currentTarget.dataset.index.id)
    wx.navigateTo({
      url: "/pages/newProduct/changeAddress/changeAddress?id=" + oindex
    })
  },
  //点击新增地址
  szaddress() {
    wx.navigateTo({
      url: '/pages/newProduct/newAddress/newAddress'
    })
  },
  getaddrees(){
    util.http.postJson("fn/address/ext/getaddress", {
    }, (res) => {
      this.setData({
        choaddresslist: res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      height: util.getallheigth().clientHeight
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
    this.getaddrees();
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