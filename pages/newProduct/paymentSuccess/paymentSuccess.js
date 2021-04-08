// pages/pay_success/pay_success.js
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    presellId: '',
    price: 0,
    orderId: "",
    img: '',
    orderid: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options:', options);
    this.data.presellId = options.presellId
    this.data.orderId
    util.http.postJson("fn/user/get/admin",{
      'act': 'Presale_details',
      'id': options.presellId,
      'orderid':options.id
    }, function(res) {
      if (res.ok) {
        thisdata.orderid = res.data.orderInfo.id
        this.setData({
          img: imageUrl + res.data.pic 
        })
      }
    })
    this.setData({
      presellId: options.presellId,
      price: options.price,
      presellnum: options.presellnum
    });
  },
  //提货
  tihuo(e) {
    wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: '/pages/newProduct/pickGoods/pickGoods?id=' + this.data.presellId + '&orderid='+ this.data.orderid
    })
  },
  yushou() {
    wx.reLaunch({
      url: '/pages/newProduct/salell/salell',
    })
  },
  //售卖
  shoumai(e) {
    if (wx.getStorageSync('role') == 1) {
      wx.showModal({
        title: '',
        content: '您已经是小二，不能开店',
      })
      return;
    }
    console.log(this.data.orderid)
    if (wx.getStorageSync('role') == 2 || (wx.getStorageSync('rolestate') == 1 && wx.getStorageSync('role') != 2)) { //已开过店
      console.log('Shop_applyOpenShop', this.data.orderid)
      //证明是否开过店
      util.http.postJson("fn/user/get/admin",{
        'act': 'Shop_applyOpenShop',
        'orderid': this.data.orderid
      }, function(res) {
        if (res.ok) {
          wx.showModal({
            content: '产品已推送到您的店铺，请前往查看',
            showCancel: true, //是否显示取消按钮
            cancelText: "否", //默认是“取消”
            cancelColor: 'skyblue', //取消文字的颜色
            confirmText: "是", //默认是“确定”
            confirmColor: 'skyblue', //确定文字的颜色
            success: (res) => {
              if (res.cancel) {
                //点击取消,默认隐藏弹框
              } else {
                wx.reLaunch({
                  url: '/pages/newProduct/salell/salell'
                })
              }
            }
          })
        } else {
          wx.showModal({
            content: '操作失败',
            showCancel: true, //是否显示取消按钮
          })
        }

      })
    } else if (wx.getStorageSync('rolestate') == 0) { //未开过店
      wx.navigateTo({
        url: '/pages/newProduct/shopkerTication/shopkerTication?id=' + this.data.orderid
      })
    }
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