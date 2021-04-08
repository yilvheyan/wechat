const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idarry: [],
    takeGoods: [],
    addrid: 0,
    allmoney: 0,
    istakeGoods_botton: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.allmoney = options.allnomey
    let inofid = wx.getStorageSync('inofid') //信息的id
    console.log('bb', inofid)
    wx.removeStorageSync('inofid')
    util.http.postJson("fn/user/get/admin",{
      'act': 'Scores_myWinelibrary',
    }, function(res) {
      if (res.ok) {
        for (let i = 0; i < res.data.length; i++) {
          let bannerimg = res.data[i].goodsinfo.playimage.split(',')
          for (let j = 0; j < bannerimg.length; j++) {
            bannerimg[j] = imageUrl + bannerimg[j]
          }
          res.data[i].bannerimg = bannerimg
          for (let j = 0; j < inofid.length; j++) {
            if (res.data[i].id == inofid[j]) {
              thisdata.takeGoods.push(res.data[i])
              thisdata.idarry.push(res.data[i].id) //订单的id
            }
          }
        }
        this.setData({
          takeGoods: thisdata.takeGoods,
        })
      }
    });
  },
  // 姓名电话售后地址
  placeanorder: function() {
    wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "/pages/newProduct/selectAddress/selectAddress"
    })
  },
  // 确认提货
  gotihuo() {
    console.log('xxxx', this.data.idarry)
    console.log('xxxxss', this.data.addrid)

    // console.log('Shop_createorder', this.data.addrid)
    let _this = this
    if (this.data.addrid == 0) {
      wx.showModal({
        content: '您还没有选择地址，请您先选择地址',
        showCancel: true, //是否显示取消按钮
      })
    } else {
      this.setData({
        istakeGoods_botton: true
      })
      util.http.postJson("fn/user/get/admin",{
        'act': 'Scores_deliveryGoods',
        'order': this.data.idarry,
        'addressid': this.data.addrid
      }, function(res) { 

        if (res.data.code = 10000) {
          wx.showToast({
            title: '提货成功',
            icon: '',
            duration: 2000,
          })
          setTimeout(function() {
            wx.switchTab({
              url: "/pages/home/home"
            })
          }, 2000);
        } else {
          wx.showToast({
            title: '提货失败！',
            icon: 'none',
            duration: 3000
          })
        }
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
    //商品地址
    util.http.postJson("fn/user/get/admin",{
      'act': 'Address_allList',
    }, function(res) {
      if (!res.data) {
        return;
      }
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].state == 1) {
          thisdata.addrid = res.data[i].id
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