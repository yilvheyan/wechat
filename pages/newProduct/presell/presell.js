// 预售详情页
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: imageUrl,
    minusStatus: 'disabled',
    ispresellmengb: false,
    imgUrls: [],
    isclose_rightco: false,
    information: {

    },
    jindu: 0,
    buynum: 1,
    zuigao: 10,
    presellId: 0,
    prejindu: 0,
    totalnum: 0 //总数量
  },

  /* 点击减号 */
  bindMinus: function() {
    var num = this.data.buynum;
    if (num > 1) {
      num--;
    }
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    this.setData({
      buynum: num,
      // minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function() {
    var num = this.data.buynum;
    num++;
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    this.setData({
      buynum: num,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function(e) {
    var num = e.detail.value;
    this.setData({
      num: num,
      buynum: num,
    });
  },

  //分享功能
  onShareAppMessage: function(res) {
    let _this = this;
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '预售详情',
      desc: '单纯高粱酒江小白',
      path: '/pages/newProduct/presell/presell?id=' + _this.data.presellId, //这是一个路径,
      withShareTicket: true
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // if (!wx.getStorageSync('userInfo')) {
    //   util.jialogin()
    // }
    var _this = this
    console.log(options);
    this.setData({
      presellId: options.id
    });
    util.http.postJson("auth/getwineinfo", { presellId: options.id}, (res)=> {
      //轮播
      if (!res.data) {
        wx.showToast({
          title: '该产品已经卖空',
          icon: 'none',
          duration: 3000,
        })
        wx.reLaunch({
          url: '/pages/newProduct/salell/salell',
        })
        return;
      } 
      console.log(res.data);
      let banner = res.data[0].bannerimage.split('||')
      //判断是否到期
      // var date = new Date(res.data[0].endtime.replace(/-/g, '/'));
      // var time_str = date.getTime();
      // time_str-new Date().getTime()
      // if (new Date().getTime() > time_str) {
      //   this.setData({
      //     isclose_rightco: true
      //   })
      // }
      //进度
      var ojindu = parseInt(((res.data[0].totalnum - res.data[0].stockQuantity) / res.data[0].totalnum) * 100)
      let prejindu = ojindu
      if (prejindu <= 8) {
        prejindu = 8
      }
      // res.data.endtime = util.formatTimeByTs(res.data.endtime);
      // let shengyu = parseInt(res.data.stockQuantity / res.data.sellmin)
      // this.data.zuigao = parseInt(res.data.totalnum / res.data.sellmin)
      // this.data.zuigao = parseInt(this.data.zuigao / 20)
      // if (this.data.zuigao == 0) {
      //   this.data.zuigao = 1
      // }
      // wx.showModal({
      //   title: '',
      //   content: '目前剩余' + shengyu + '份,' + '每份' + res.data.sellmin + '瓶,' + '最高可购买' + this.data.zuigao + '份,请在此处确认数量',
      //   success(res) {
      //     if (res.cancel) {
      //       _this.setData({
      //         ispresellmengb: false
      //       })
      //     } else if (res.confirm) {
      //       _this.setData({
      //         ispresellmengb: false
      //       })
      //     }
      //   }
      // })
      this.setData({
        imgUrls: banner,
        information: res.data[0],
        jindu: ojindu,
        prejindu: prejindu,
        totalnum: res.data[0].totalnum
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

  },
  // 点击参加预售
  presellClick(e) {
    if (this.data.isclose_rightco == true) {
      wx.showModal({
        content: '众筹时间已过。',
      })
      return;
    }
    let num = this.data.buynum;
    if (num > this.data.zuigao) {
      wx.showToast({
        title: '参与数量不能超过' + this.data.zuigao + ',请重新输入',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (num == 0) {
      wx.showToast({
        title: '参与数量不能为' + 0 + ',请重新输入',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let id = this.data.presellId;
    let presellName = this.data.information.title;
    let price = this.data.information.price * this.data.information.sellmin;
    let image = this.data.information.pic;
    // let orderInfoid = this.data.information.orderInfo.id;
    wx.navigateTo({
      url: '/pages/newProduct/orderForm/orderForm?id=' + id + '&presellName=' + presellName + '&num=' + num + '&price=' + price + '&image=' + image
    })
  },

})