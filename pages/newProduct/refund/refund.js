// pages/tuikuan/tuikuan.js
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    presaleid:0,
    orderid: 0,
    tuimoney: 0,
    whogeto: '',
    refundinformation: {
      tuimoneyman: '',
      tuimoneynum: '',
      tuimoneyka: ''
    }
  },




  tuimoneyman(e) {
    this.data.refundinformation.tuimoneyman = e.detail.value
  },
  tuimoneynum(e) {
    this.data.refundinformation.tuimoneynum = e.detail.value
  },
  tuimoneyka(e) {
    this.data.refundinformation.tuimoneyka = e.detail.value
  },






  //确认退款
  tuikuan() {
    if (this.data.refundinformation.tuimoneyman == '') {
      wx.showToast({
        title: '请填写收款人',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.refundinformation.tuimoneynum == '') {
      wx.showToast({
        title: '请填写收款账号',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.refundinformation.tuimoneyka == '') {
      wx.showToast({
        title: '请填写开户行',
        icon: 'none',
        duration: 2000
      })
    } else {
      console.log('aa', this.data.whogeto)
      if (this.data.whogeto == 'yushou') {
        this.yestuikuan(1)
      } else {
        this.yestuikuan(2)
      }
    }
  },
  yestuikuan(type) {
    util.http.postJson("fn/presale_order/ext/changeStatr", {
        "presaleid": this.data.presaleid,
        'orderid': this.data.orderid,
        state:2
    }, (rest) => {
      if (rest.ok) {
        util.http.postJson("fn/bank/post", {
          'name': this.data.refundinformation.tuimoneyman,
          'idcard': this.data.refundinformation.tuimoneynum,
          'bank': this.data.refundinformation.tuimoneyka,
          'orderid': this.data.orderid,
          'money': this.data.tuimoney,
          "type": type
        }, (res) => {
          if (res.ok) {
            wx.showToast({
              title: '已提交给后台审核',
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '退款失败！',
              icon: 'none',
              duration: 2000
            })

          }
        })
      } else {
        wx.showToast({
          title: '退款失败！',
          icon: 'none',
          duration: 2000
        })
      }
    }) 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      whogeto: options.whogeto,
      tuimoney: options.tuimoney,
      orderid: options.orderid,
      presaleid:options.id
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