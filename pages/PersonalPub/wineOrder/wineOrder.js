const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    iscreateOrder: false,
    ishare: 0,
    shopuid: 0,
    allmoney: 0,
    tihuoaddress: {},
    shopmessage: [{
      id: '0',
      img: 'http://qiniu-test.ishzm.com/jxb/img/myStore/wineorder_shoptwo.png',
      money: ' ￥398',
      name: '江小白\t生肖纪年版\t猪年如意套装10度\t680ml*2礼盒装\t送亲朋好友'
    }],
    addrid: 0,
    num: 0,
    imageUrl: imageUrl,
    waiteruid: 0,
    winordjudge: 0, //判断商品是否从购物车来， 是：100， 否：0
    packagepostage: '包邮' //运费包邮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      height: util.getallheigth().clientHeight
    })
    this.data.ishare = options.ishare
    this.data.shopuid = options.shopuid
    console.log('options', options)
    if (options.waiteruid == undefined || options.waiteruid == 0) {
      options.waiteruid = 0
    }
    this.setData({
      waiteruid: options.waiteruid
    })
    if (options.thispage == 100) { //从购物车进来
      this.data.winordjudge = 100
      var showlist = wx.getStorageSync(this.data.shopuid + 'true')
      if (showlist == '') {
        showlist = wx.getStorageSync(this.data.shopuid)
      }
      var nowmoney = 0;
      for (var i = 0; i < showlist.length; i++) {
        var jsallmoney = showlist[i].price * showlist[i].buynum

        nowmoney += jsallmoney
      }
      this.setData({
        shopmessage: showlist,
        allmoney: nowmoney
      });
      console.log('shopmessage', this.data.shopmessage)
    }
    if (options.thispage != 100) { //从商品一路走来
      this.data.num = options.buynum
      //商品信息
      var thisshowlist = wx.getStorageSync('thisshowlist')
      var jsallmoney = thisshowlist[0].price * thisshowlist[0].buynum
      nowmoney += jsallmoney
      this.setData({
        shopmessage: thisshowlist,
        allmoney: jsallmoney
      });
    }
  },
  placeanorder: function() {
    wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "/pages/newProduct/selectAddress/selectAddress"
    })
  },
  //确认支付
  createOrder: function(e) {
    if (wx.getStorageSync('openid') == 'abcdef') {  //判断登陆
      let popup = this.selectComponent("#popup");
      popup.show(() => {

      })
      return;
    }
    if (!wx.getStorageSync('phone')) {      //判断手机登陆
      let phonepopup = this.selectComponent("#phonepopup");
      phonepopup.show(() => {

      })
      return;
    }
    let _this = this
    if (this.data.addrid == 0) {    //判断地址
      wx.showModal({
        content: '您还没有选择地址，请您先选择地址',
        showCancel: true, //是否显示取消按钮
      })
      return;
    } else {
      var userid = wx.getStorageSync('userid')
      let glist = []
      for (let i = 0; i < this.data.shopmessage.length; i++) {
        let glistone = {}
        glistone.id = this.data.shopmessage[i].id
        glistone.num = this.data.shopmessage[i].buynum
        glist.push(glistone)
      }

      let shoppingcart = wx.getStorageSync('shoppingcart'); //从总购物车删除一个店铺的所有商品
      let shupuidstro = 0;
      for (let thk = 0; thk < shoppingcart.length; thk++) {
        if (shoppingcart[thk].shopuid == _this.data.shopuid) {
          shupuidstro = thk;

        }
      }


      if (_this.data.winordjudge == 100) { //店铺购物车部分商品
        wx.removeStorageSync(_this.data.shopuid)
        wx.removeStorageSync(_this.data.shopuid + 'true')
        let shopuidfalsesto = wx.getStorageSync(_this.data.shopuid + 'false')
        console.log(!!shopuidfalsesto)
        if (shopuidfalsesto) { //如果剩余的不为空
          wx.setStorageSync(_this.data.shopuid, shopuidfalsesto)
          wx.removeStorageSync(_this.data.shopuid + 'false')
          shoppingcart[shupuidstro].list = shopuidfalsesto;
        } else {
          wx.removeStorageSync(_this.data.shopuid);
          shoppingcart.splice(shupuidstro, 1);
        }

      } else {
        wx.removeStorageSync('thisshowlist');
      }
      if (shoppingcart.length != 0) {
        wx.setStorageSync("shoppingcart", shoppingcart);
      }
      this.setData({
        iscreateOrder: true
      })
      // let glist = [{
      //     'id': 22,
      //     'num': 1
      // }];
      let thdata = new Date();
      if (wx.getStorageSync("waiteruid")) {     //判断是否存在小二
        // console.log(111, wx.getStorageSync("waiteruid"), this.data.waiteruid, thdata.getTime())
        if (wx.getStorageSync("waiteruid").time > (thdata.getTime())) {
          this.data.waiteruid = wx.getStorageSync("waiteruid").waiteruid;
        } else {
          wx.removeStorageSync("waiteruid");
        }
      }
      // console.log(222, wx.getStorageSync("waiteruid"), this.data.waiteruid)
      // console.log('msg', this.data.waiteruid, this.data.shopuid);

      util.http.postJson("fn/user/get/admin",{
        'act': 'Shop_createorder',
        'goods': glist,
        'waiteruid': this.data.waiteruid,
        'shopuid': this.data.shopuid, // uid
        'addrid': this.data.addrid
      }, function(res) {
        console.log('code', res.data);
        if (res.data.code == 10001) {
          if (res.data.fail == 'goods_stock_not_enough') {
            wx.showModal({
              content: '产品数量不足。',
            })
          }
          if (res.data.fail == 'goods_not_exists') {
            wx.showModal({
              content: '产品已不存在。',
            })
          }
          if (res.data.fail == 'shop_not_exists') {
            wx.showModal({
              content: '店铺不存在！',
            })
          }
          return;
        }
        // wx.removeStorageSync(thisdata.shopuid)
        if (res.ok) {
          let presaleOrderID = res.data.presaleOrderID
          console.log('aaa', res.data.presaleOrderID)
          util.getOpenid();
          util.http.postJson("fn/user/get/admin",{ //支付
            'act': 'Wxpayshop_index',
            'orderid': res.data.presaleOrderID,
            'openid': wx.getStorageSync('openid')
          }, function(ress) {
            var resp = JSON.parse(res.data)
            wx.requestPayment({
              'timeStamp': resp.timeStamp,
              'nonceStr': resp.nonceStr,
              'package': resp.package,
              'signType': 'MD5',
              'paySign': resp.paySign,
              'success': function(res) {
                util.http.postJson("fn/user/get/admin",{
                  'act': 'Shop_createPrepayid',
                  'orderid': presaleOrderID
                }, function(resas) {
                  let resss = res.data.code
                  if (res.ok) {
                    if (_this.data.ishare == 'needwaiter') {
                      wx.reLaunch({
                        url: '/pages/Waiter/applyWaiter/applyWaiter?shopuid=' + _this.data.shopuid + "&shopname=" + _this.data.shopname,
                      })
                      return;
                    } else {
                      setTimeout(function() {
                        wx.reLaunch({
                          url: '/pages/PersonalPub/paymentOk/paymentOk',
                        })

                      }, 500);
                    }
                  } else {
                    wx.showModal({
                      content: '创建预支付失败',
                    })
                  }
                })
              },
              'fail': function(res) {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                  duration: 2000
                });
                setTimeout(function() {
                  wx.redirectTo({
                    url: '/pages/PersonalPub/orderConfirmation/orderConfirmation?index=0'
                  })
                }, 2000);
              }
            });
          })
        }
      });
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
    var _this = this
    //商品地址
    if (wx.getStorageSync('openid') == 'abcdef') {
      return;
    }
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