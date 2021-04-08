// pages/newaddress/newaddress.js
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    newaddress: {
      name: '',
      phone: '',
      address: '',
      xiangaddress: ''
    },
    region: ['请选择:省', '市', '区'],
  },


  userNameInput(e) {
    this.data.newaddress.name = e.detail.value
  },
  phoneInput(e) {
    this.data.newaddress.phone = e.detail.value
  },
  addressInput(e) {
    this.data.newaddress.address = e.detail.value
  },
  xiangaddressInput(e) {
    this.data.newaddress.xiangaddress = e.detail.value
  },
  //弹窗
  tanchuagn(aaa) {
    wx.showModal({
      title: aaa,
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }

      }

    })
  },

  //新增地址保存
  addaddress(e) {
    // if (!wx.getStorageSync('userInfo')) {
    //   let popup = this.selectComponent("#popup");
    //   popup.show(() => {

    //   })
    //   return;
    // }
    console.log(this.data.newaddress)
    if (this.data.newaddress.name == '') {
      this.tanchuagn('请填写联系人')
    } else if (this.data.newaddress.phone == '') {
      this.tanchuagn('请填写手机号')
    } else if (this.data.region.length == 1) {
      this.tanchuagn('请填写收货地址')
    } else if (this.data.newaddress.xiangaddress == '') {
      this.tanchuagn('请填写详细地址')
    } else {
      var newaddress = ''
      if (this.data.region[0] == this.data.region[1]) {
        newaddress = this.data.region[1] + this.data.region[2] + this.data.newaddress.xiangaddress
      } else {
        newaddress = this.data.region[0] + this.data.region[1] + this.data.region[2] + this.data.newaddress.xiangaddress
      }
      console.log(newaddress)
      //添加地址
      util.http.postJson("fn/address/post",{
        'address': newaddress,
        'province': this.data.region[0],
        'city': this.data.region[1],
        'distinct': this.data.region[2],
        'phone': this.data.newaddress.phone,
        'name': this.data.newaddress.name
      }, (res)=> {
        if (res.ok) {
          var pages = getCurrentPages(); // 当前页面
          var beforePage = pages[pages.length - 2];
          wx.navigateBack({
            success: function() {
              beforePage.onLoad(); // 执行前一个页面的onLoad方法
            }
          });
        } else {
          wx.showModal({
            title: '地址',
            content: '添加地址失败' + res.data,
          })
        }

      })
    }
  },
  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
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