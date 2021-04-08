// pages/changeaddress/changeaddress.js
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    changeaddress: {
      name: '',
      phone: '',
      address: '',
      xiangaddress: ''
    },
    oid: 0,
    region: ['请选择:省', '市', '区'],

  },
  userNameInput(e) {
    this.data.changeaddress.name = e.detail.value
  },
  phoneInput(e) {
    this.data.changeaddress.phone = e.detail.value
  },
  addressInput(e) {
    this.data.changeaddress.address = e.detail.value
  },
  xiangaddressInput(e) {
    this.data.changeaddress.xiangaddress = e.detail.value
  },
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

  // 更改保存
  changeadcli(e) {
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$$/; //判断手机号
    // console.log(cnPattern.test("度度")); 
    console.log(this.data.changeaddress.xiangaddress)
    // console.log(this.data.changeaddress)
    if (this.data.changeaddress.name == '') {
      this.tanchuagn('请正确填写联系人')

    } else if (this.data.changeaddress.phone == '' || !myreg.test(this.data.changeaddress.phone)) {
      this.tanchuagn('请正确填写手机号')
    } else if (this.data.region.length == 1) {
      this.tanchuagn('请填写收货地址')
    } else if (this.data.changeaddress.xiangaddress == undefined) {
      this.tanchuagn('请填写详细地址')
    } else {
      var newaddress = ''
      if (this.data.region[0] == this.data.region[1]) {
        newaddress = this.data.region[1] + this.data.region[2] + this.data.changeaddress.xiangaddress
      } else {
        newaddress = this.data.region[0] + this.data.region[1] + this.data.region[2] + this.data.changeaddress.xiangaddress
      }
      //   console.log(this.data.oid)
      // console.log('aaaa', newaddress)
      //更改地址
      util.http.postJson("fn/user/get/admin",{
        'act': 'Address_edit',
        'id': this.data.oid,
        'address': newaddress,
        'province': this.data.region[0],
        'city': this.data.region[1],
        'distinct': this.data.region[2],
        'phone': this.data.changeaddress.phone,
        'name': this.data.changeaddress.name
      }, function(res) {
        var pages = getCurrentPages(); // 当前页面
        var beforePage = pages[pages.length - 2];
        wx.navigateBack({
          success: function() {
            beforePage.onLoad(); // 执行前一个页面的onLoad方法
          }
        });
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
    console.log(options)
    this.data.oid = options.id
    util.http.postJson("fn/user/get/admin",{
      'act': 'Address_allList'
    }, function(res) {
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].id == options.id) {
          this.setData({
            changeaddress: res.data[i]
          })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})