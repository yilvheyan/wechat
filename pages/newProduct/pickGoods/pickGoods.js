//  提货js
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')

var status = true; //status默认为不显示状态 true代表先不展示
Page({

  data: {
    imageUrl: imageUrl,
    status: status,
    presale_order:{},　　　　　　　　　　　 
    tihuoaddress: {},
    tihuomainthing: {}
  },
  //确定提货
  toastShow: function(event) {
    if (this.data.tihuoaddress.id == undefined) {
      wx.showModal({
        title: '地址不能为空',
      })
      return;
    }
    this.data.presale_order.optionstate=2;
    this.data.presale_order.address = this.data.tihuoaddress.address;
    this.data.presale_order.phone = this.data.tihuoaddress.phone;
    this.data.presale_order.city = this.data.tihuoaddress.city;
    this.data.presale_order.province = this.data.tihuoaddress.province;
    this.data.presale_order.contact = this.data.tihuoaddress.name;
    this.data.presale_order.district = this.data.tihuoaddress.district;

    util.http.postJson("fn/Presale_order/post", this.data.presale_order, (res)=> {
      wx.reLaunch({
        url: "/pages/newProduct/salell/salell"
      })
    })
    status = false
    this.setData({
      status: status
    })　　　　 
  },
  toastHide: function(event) {
    status = true
    this.setData({
      status: status
    })
  },
  xiugaidizhi: function() {
    wx.navigateTo({ 
      url: "/pages/newProduct/selectAddress/selectAddress"
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      height: util.getallheigth().clientHeight
    })
    console.log(options.id)
    util.http.get("fn/Presale_order/get/" + options.id,(res)=> {
      this.data.presale_order=res.data;
      if(!res.data){
        return;
      }
      var num = parseInt(res.data.buynum) / parseInt(res.data.presale.sellmin)
      res.data.totalprice = parseInt(res.data.presale.price) * num
      this.setData({
        tihuomainthing: res.data
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
    util.http.postJson("fn/address/ext/getaddress", {
    }, (res)=> {
      if (!res.data) {
        return;
      }
      var otihuoaddress = {}
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].state == 1) {
          this.setData({
            tihuoaddress: res.data[i]
          })
        }
      }
    })
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