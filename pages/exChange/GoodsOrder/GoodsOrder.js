const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    minusStatus: '',
    presellId: 0,
    totalnum: 0, //总数量
    infoid: 0,
    allmoney: 0,
    information: {},
    shopmessage: [{
      img: 'http://qiniu-test.ishzm.com/jxb/img/exChange/xuangqing_goumai.png',
      title: '江小白果味白酒100ml*12瓶粮食酒高粱酒小平就语录表达',
      integral: "400",
      buynum: 1
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.infoid = options.infoid
    console.log(this.data.infoid)
    util.http.postJson("fn/user/get/admin",{
      'act': 'Scores_goodsDetail',
      'id': options.infoid
    }, function(res) {
      let bannerimg = res.data.playimage.split(',')
      for (let i = 0; i < bannerimg.length; i++) {
        bannerimg[i] = imageUrl + bannerimg[i]
      }
      res.data.playimage = imageUrl + res.data.playimage
      res.data.bannerimg = bannerimg[0]
      res.data.buynum = 1
      let allmoney = res.data.price * res.data.buynum
      let shopmessage = []
      shopmessage.push(res.data)
      this.setData({
        shopmessage: shopmessage,
        allmoney: allmoney
      })
    })
  },
  // 前去兑换更多商品
  integralShop() {
    wx.redirectTo({
      url: '/pages/exChange/integralShop/integralShop'
    })
  },
  //输入数量
  numberinput(e) {
    this.data.shopmessage[0].buynum = e.detail.value
    let allmoney = this.data.shopmessage[0].price * this.data.shopmessage[0].buynum
    this.setData({
      allmoney: allmoney
    })
  },

  // 去酒库换钱
  gotomySpiritRoom() {
    wx.navigateTo({
      url: '/pages/exChange/mySpiritRoom/mySpiritRoom'

    })
  },
  // 回首页
  gotohome() {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  goodsOrder() {
    wx.showToast({

      title: '带蒙层的弹窗',

      duration: 2000,

      mask: true //是否有透明蒙层，默认为false 

      //如果有透明蒙层，弹窗的期间不能点击文档内容 
    })
  },
  // 遮罩层显示
  show: function() {
    let buynum = this.data.shopmessage[0].buynum
    console.log('id', this.data.infoid)
    console.log('buynum', buynum)
    if (wx.getStorageSync('openid') == 'abcdef') {
      let popup = this.selectComponent("#popup");
      popup.show(() => {

      })
      return;
    }
    if (!wx.getStorageSync('phone')) {
      let phonepopup = this.selectComponent("#phonepopup");
      phonepopup.show(() => {

      })
      return;
    }
    util.http.postJson("fn/user/get/admin",{
      'act': 'Scores_createorder',
      'id': this.data.infoid,
      'buynum': buynum
    }, function(res) {
      if (res.data.code == 10001) {
        if (res.data.fail == 'scoresNotEnough') {
          wx.showModal({
            content: '积分不够。',
          })
        } else if (res.data.fail == 'goods_stock_not_enough') {
          wx.showModal({
            content: '商品库存不足。',
          })
        } else {
          wx.showModal({
            content: '其他原因。',
          })
        }
        return;
      }
      if (res.ok) {
        util.http.postJson("fn/user/get/admin",{
          'act': 'Scores_createPrepayid',
          'orderid': res.data.scoresOrderID
        }, function(ress) {
          if (res.ok) {
            this.setData({
              goodsOrderflag: true
            })
          }
        })
      }
    })
  },
  // 遮罩层隐藏
  conceal: function() {
    this.setData({
      goodsOrderflag: false
    })
  },
  /* 点击减号 */
  bindMinus: function() {
    this.data.shopmessage[0].buynum -= 1
    if (this.data.shopmessage[0].buynum <= 0) {
      this.data.shopmessage[0].buynum = 1
    }
    let allmoney = this.data.shopmessage[0].price * this.data.shopmessage[0].buynum
    this.setData({
      allmoney: allmoney,
      shopmessage: this.data.shopmessage
    })



    //   var num = this.data.shopmessage[0].buynum;
    // // 如果大于1时，才可以减  
    // if (num > 1) {
    //   num--;
    // }
    // // 只有大于一件的时候，才能normal状态，否则disable状态  
    // var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // // 将数值与状态写回  
    // this.setData({
    //   buynum: num,
    // });
  },
  /* 点击加号 */
  bindPlus: function() {
    this.data.shopmessage[0].buynum += 1
    let allmoney = this.data.shopmessage[0].price * this.data.shopmessage[0].buynum
    this.setData({
      allmoney: allmoney,
      shopmessage: this.data.shopmessage
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