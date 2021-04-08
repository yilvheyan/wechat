// 确认订单
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js');
var status = true; //status默认为不显示状态 true代表先不展示
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: imageUrl,
    status: status,
    presellId: '',
    presellName: '',
    orderfimage: '',
    price: 0,
    ispointer: false,
    buynum: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      height: util.getallheigth().clientHeight
    })
    console.log(options);
    this.setData({
      presellId: options.id,
      price: options.price,
      buynum: options.num,
      presellName: options.presellName,
      orderfimage: options.image
    });
  },
  // 确认购买，创建订单
  mycanyucli(e) {
    // if (wx.getStorageSync('openid') == 'abcdef') {
    //   let popup = this.selectComponent("#popup");
    //   popup.show(() => {

    //   })
    //   return;
    // }
    // if (!wx.getStorageSync('phone')) {
    //   let phonepopup = this.selectComponent("#phonepopup");
    //   phonepopup.show(() => {

    //   })
    //   return;
    // }


    console.log('订单id', this.data.presellId, this.data.buynum);
    this.setData({
      ispointer: true
    })
    var _this = this
    util.http.postJson("fn/Presale_order/post",{ //创建订单
      'presaleid': this.data.presellId,
      'buynum': this.data.buynum
    }, (res)=> {
      // if (res.data.code == 10001) {
      //   if (res.data.fail == 'PreSale_order_has_exists') {
      //     wx.showToast({
      //       icon: 'none',
      //       title: '产品数量不足',
      //       //   content: '点击确认',
      //     })
      //     return;
      //   } else if (res.data.fail == 'PreSale_order_has_exists') {
      //     wx.showModal({
      //       title: '你已经参与过预售',
      //     })
      //     return;
      //   } else {
      //     wx.showModal({
      //       title: '订单失败' + res.data.fail,
      //     })
      //     return;
      //   }
      // }
      if (res.ok) {
        let presaleOrderID = res.data.id
        // util.getOpenid();
        // util.http.postJson("fn/user/get/admin",{ //支付
        //   'act': 'Wxpay_index',
        //   'orderid': res.data.presaleOrderID,
        //   'openid': wx.getStorageSync('openid')
        // }, function(ress) {
        //   var resp = JSON.parse(res.data)
        //   wx.requestPayment({
        //     'timeStamp': resp.timeStamp,
        //     'nonceStr': resp.nonceStr,
        //     'package': resp.package,
        //     'signType': 'MD5',
        //     'paySign': resp.paySign,
        //     'success': function(res) {
        //       wx.showToast({
        //         title: '支付成功',
        //         icon: 'success',
        //         duration: 3000
        //       });
        //       let pid = _this.data.presellId;
        //       util.http.postJson("fn/user/get/admin",{
        //         'orderid':presaleOrderID
        //       }, function(resas) {
        //         wx.reLaunch({
        //           url: '/pages/newProduct/paymentSuccess/paymentSuccess?id=' + presaleOrderID + "&price=" + _this.data.price + "&presellId=" + pid + "&presellnum=" + _this.data.buynum
        //         })
        //       })
        //     },
        //     'fail': function(res) {
        //       wx.showToast({
        //         title: '支付失败',
        //         icon: 'none',
        //         duration: 1000
        //       });
        //       setTimeout(() => {
        //         wx.reLaunch({
        //           url: '/pages/PersonalPub/orderConfirmation/orderConfirmation',
        //         })
        //       }, 1000)

        //     },
        //     'complete': function(res) {
        //       console.log('complete 2');
        //     }
        //   });
        // })


        res.data.state=1;
        util.http.postJson("fn/Presale_order/post",res.data, function (resas) {
          wx.reLaunch({
            url: '/pages/newProduct/paymentSuccess/paymentSuccess?id=' + presaleOrderID + "&price=" + _this.data.price + "&presellId=" + _this.data.presellId + "&presellnum=" + _this.data.buynum
          })
        })  



      }
    })
    status = false
    this.setData({
      status: status
    })

  },
  // 提交订单按钮
  submitorder: function(event) {
    wx.requestPayment({
      'timeStamp': '',
      'nonceStr': '',
      'package': '',
      'signType': 'MD5',
      'paySign': '',
      'success': function(res) {},
      'fail': function(res) {},
      'complete': function(res) {}
    })

    status = true
    this.setData({
      status: status
    })

    // if (!this.status()) {
    //     wx.showModal({
    //         title: '提示',
    //         content: '请勿重复点击确认支付',
    //         showCancel: false,
    //         success: function (res) {
    //             if (res.confirm) {
    //                 console.log('用户点击确定')
    //             }
    //         }
    //     })
    //     return false
    // }

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

  }
})