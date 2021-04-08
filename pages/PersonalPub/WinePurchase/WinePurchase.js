const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    winname:'',
    ishare: 0,
    shopuid: 0,
    imgUrls: {},
    bannerimgUrls: [],
    id: 0,
    buynum: 1,
    shopname: '',
    waiteruid: 0,
    gouwunum: 0 //购物车
  },


  //点击分享
  onShareAppMessage: function(res) {
    let _this = this
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    let waiteruid = 0
    if (wx.getStorageSync('role') == 1) {
      waiteruid = wx.getStorageSync("userid")
    } else {
      waiteruid = 0
    }
    return {
      title:this.data.winname,
      desc: '单纯高粱酒江小白',
      path: '/pages/PersonalPub/WinePurchase/WinePurchase?id=' + this.data.id + '&shopuid=' + this.data.shopuid + '&ishare=' + this.data.ishare + '&shopname=' + this.data.shopname + '&waiteruid=' + waiteruid, //这是一个路径,
      withShareTicket: true
    }

  },
  changewateruid(uid){
    var date = new Date();
    let time = date.getTime() + 259200000;
    let obj={};
    let waiteruid = wx.getStorageSync("waiteruid") ||{};
    if (waiteruid === {} || wx.getStorageSync("waiteruid").waiteruid != uid || wx.getStorageSync("waiteruid").time > time){
      obj.waiteruid = uid;
      obj.time = time;
      wx.setStorageSync("waiteruid", obj);
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!wx.getStorageSync('userInfo')) {
      util.jialogin()
    }
    console.log(options)
    this.data.ishare = options.ishare
    this.data.shopuid = options.shopuid
    this.data.shopname = options.shopname
    this.data.id = options.id
    this.data.waiteruid = options.waiteruid
    if (!options.shopuid){
      this.changewateruid(this.data.waiteruid);
    }
    //显示购物车
    let shopuidsto = wx.getStorageSync(options.shopuid)
    if (shopuidsto == '') {
      this.setData({
        gouwunum: 0
      })
    } else {
      this.setData({
        gouwunum: shopuidsto.length
      })
    }

    util.http.postJson("fn/user/get/admin",{
      'act': 'Shop_goodsDetail',
      id: options.id
    }, function(res) {
      let integral = 0 //获取积分
      let banner = res.data.playimage.split(',')
      for (var i = 0; i < banner.length; i++) {
        banner[i] = imageUrl + banner[i]
      }
      res.data.detailimage = imageUrl + res.data.detailimage
      res.data.playimage = banner[0]
      integral = Math.round(res.data.price)
      res.data.integral = integral
      this.setData({
          winname: res.data.name,
        imgUrls: res.data,
        bannerimgUrls: banner
      })
    })
  },
  //点击立即支付
  payment() {

    this.data.imgUrls.buynum = this.data.buynum
    if (this.data.imgUrls.buynum > this.data.imgUrls.stock) {
      wx.showModal({
        title: '',
        content: '产品数量不足',
      })
      return;
    }
    var thisshowlist = []
    thisshowlist.push(this.data.imgUrls)
    wx.setStorageSync('thisshowlist', thisshowlist)
    wx.navigateTo({
      url: '/pages/PersonalPub/wineOrder/wineOrder?id=' + this.data.id + '&shopuid=' + this.data.shopuid + "&shopname=" + this.data.shopname + '&waiteruid=' + this.data.waiteruid + '&ishare=' + this.data.ishare + "&buynum=" + this.data.buynum,
    })

  },
  //点击添加到购物车
  addshopping() {
    wx.showToast({
      title: '您已加入购物车成功',
      icon: 'none', //如果要纯文本，不要icon，将值设为'none'
      duration: 2000
    })
    this.data.imgUrls.buynum = this.data.buynum
    this.data.imgUrls.shopuid = this.data.shopuid
    var showlist = wx.getStorageSync(this.data.shopuid)
    let judge = 0
    if (showlist == '') {
      var showlist = []
      showlist.push(this.data.imgUrls)
      wx.setStorageSync(this.data.shopuid, showlist)
    } else {
      for (let i = 0; i < showlist.length; i++) { //判断该产品是否已经在购物车中
        if (showlist[i].id == this.data.imgUrls.id) {
          showlist[i].buynum += this.data.imgUrls.buynum
          wx.setStorageSync(this.data.shopuid, showlist)
          judge = 1
        }
      }
      console.log('judge', judge)
      if (judge == 0) {
        showlist.push(this.data.imgUrls)
        wx.setStorageSync(this.data.shopuid, showlist)
      }

    }
    //debugger;
    let shoppingcart = wx.getStorageSync("shoppingcart");
    if (shoppingcart == '') {
      shoppingcart = [];
    }
    let noshop = true,
      nogoods = true; //true表示没有
    for (let i = 0; i < shoppingcart.length; i++) {
      if (shoppingcart[i].shopuid == this.data.shopuid) { //存过该店铺的商品
        noshop = false;
        for (let j = 0; j < shoppingcart[i].list.length; j++) {
          if (shoppingcart[i].list[j].id == this.data.imgUrls.id) { //存有该店铺的该商品
            shoppingcart[i].list[j].buynum += this.data.imgUrls.buynum;
            nogoods = false;
          }
        }
        if (noshop == false && nogoods == true) { //有该店铺，没有该商品
          shoppingcart[i].list = showlist;
        }
      }
    }
    if (noshop == true) { //该店铺没有存过
      let obj = {};
      obj.shopuid = this.data.shopuid;
      obj.shopname = this.data.shopname;
      obj.list = showlist;
      shoppingcart.push(obj);
    }
    wx.setStorageSync("shoppingcart", shoppingcart);


    wx.redirectTo({
      url: '/pages/PersonalPub/myShop/myShop?shopuid=' + this.data.shopuid + '&shopname=' + this.data.shopname + '&waiteruid=' + this.data.waiteruid + '&ishare=' + this.data.ishare,
    })

  },
  /* 点击减号 */
  bindMinus: function() {
    var num = this.data.buynum;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      buynum: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function() {
    console.log(this.data)
    var num = this.data.buynum;
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      buynum: num,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function(e) {
    var num = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      buynum: num
    });
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

  //子传父判断是否登录




})