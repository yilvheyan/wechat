// pages/PersonalPub/orderConfirmation/orderConfirmation.js
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const imageUrlone = app.globalData.imageUrlone;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    orderid: 0,
    scroll_height: 0,
    num: 0, // 待付款、待发货、待收货、售后的样式
    sindex: 0, //控制四个按钮
    numone: 0, //： 预售 酒市 积分切换的样式
    sindexone: 0, //酒市积分按钮
    // 全选状态
    totalPrice: 0,
    selectAllStatus: false,
    message: [{
        id: '0',
        text: "待付款"
      },

      {
        id: '1',
        text: '待发货'
      },
      {
        id: '2',
        text: "待收货"
      },
      {
        id: '3',
        text: '售后'
      }
    ],
    orderlistone: [{
        id: '0',
        text: "预售"
      },

      {
        id: '1',
        text: '酒市'
      }
    ],
    orderlist: [{
        id: '0',
        text: "预售"
      },

      {
        id: '1',
        text: '酒市'
      },
      {
        id: '2',
        text: "积分"
      }
    ],
    iskong: 0,
    orderobligation: [],
    sendgoodspresellwine: [], //代发货预售下的循环
    sendgoodspresell: [], //代发货预售
    sendgoodslist: [],
    sendgoodspresellwinejifen: [], //代发货积分
    suyhougoodspresellwine: [], //待收货-预售
    getgoodspresellwine: [], //待收货-酒市
    sendgoodspresellwineshoujifen: [], //待收货-积分
    orderpresellone: [], //代付款 预售
    orderWinelist: [],
    orderWineone: [], //代付款 酒市
    shouhoujiugoodspresellwine: [], //售后酒市
    getdgoodspresellwine: [], //售后 预售
    shouhouo_jifen: [], //售后积分
    dfkallmoney: 0, //代发货，待收货总价格
    thisdfkallmoney: 0, //代付款总价
    yushouallmoney: 0 //代发货预售总价钱
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
    this.setData({
      scroll_height: windowHeight,
      num: options.index,
      sindex: options.index
    })
    if (options.index == 0) {
      this.yushoufengzhuang('Order_presaleObligation');
    } else if (options.index == 1) {
      this.yushoufengzhuang('Order_presaleSend');
    } else if (options.index == 2) {
      this.yushoufengzhuang('Order_presaleReceive');
    } else if (options.index == 3) {
      this.yushoufengzhuang('Order_presaleAftersales');
    }

  },

  // 左上角点击跳转
  orderskiphome() {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  // 待付款
  // TODO:跳转问题
  orderDetails() {
    wx.reLaunch({
      url: '/pages/PersonalPub/paymentOk/paymentOk'
    })
  },
  //确认支付
  squorderDetails() {
    wx.reLaunch({
      url: '/pages/PersonalPub/paymentOk/paymentOk'
    })
  },
  //确认收货
  confirmreceipt() {
    wx.showModal({
      //   title: '收货提示',
      content: '您是否确认收货',
      success: function(res) {
        if (res.confirm) {
          wx.showToast({
            title: '收货成功',
            icon: '',
            duration: 2000,
          })
        } else {
          console.log('点击取消确认收货')
        }

      }
    })
  },
  //订单-售后预售-重新下单
  tryagainxd(e) {
    if (e.currentTarget.dataset.number <= 0) {
      wx.showModal({
        content: '该商品已售完',
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/newProduct/presell/presell?id=' + e.currentTarget.dataset.id
    })
  },
  //订单-售后预售-删除订单
  delectdd(e) {
    var _this = this
    let orderid = e.currentTarget.dataset.orderid;
    console.log(e.currentTarget.dataset.orderid)
    wx.showModal({
      title: '删除订单',
      content: '确认要删除该订单吗？',
      success: function(res) {
        if (res.confirm) {
          console.log('点击确认回调')
          util.http.postJson("fn/user/get/admin",{
            'act': 'Order_deleteOrder',
            'orderid': orderid,
          }, function(res) {
            console.log('data', _this.data.numone)
            if (_this.data.numone == 0) {
              _this.yushoufengzhuang('Order_presaleAftersales')
            } else if (tha_thist.data.numone == 1) {
              _this.jiushufeng('Order_shopAftersales')
            } else if (_this.data.numone == 2) {
              _this.jifenfengzhuang('Order_scoresAftersales')
            }
          })
        } else {

        }

      }

    })
  },
  //售后酒市-再买一单
  seeyoualgin(e) {
    console.log(e.currentTarget.dataset.item)
    wx.redirectTo({
      url: '/pages/PersonalPub/myStore/myStore?shopuid=' + e.currentTarget.dataset.item.shopname.uid + "&shopname=" + e.currentTarget.dataset.item.shopname.name + '&waiteruid=undefined' + '&ishare=undefined',
    })
  },
  // 查看物流
  checklogistics(e) {
    // console.log(e)
    wx.navigateTo({
      url: '/pages/PersonalPub/wuLiuInformation/wuLiuInformation?orderid=' + e.currentTarget.dataset.orderid + "&whogeto=" + e.currentTarget.dataset.whogeto
    })
  },
  //顶部四个状态切换按钮
  order_ch: function(e) {
    this.data.iskong = 0
    let sindex = e.target.id;
    console.log(sindex)
    if (sindex == 0) { //待付款，预售
      this.yushoufengzhuang('Order_presaleObligation');
      this.setData({
        sindex: sindex,
        sindexone: 0
      })
    }
    if (sindex == 1) { //代发货，预售

      this.yushoufengzhuang('Order_presaleSend');
      this.setData({
        sindex: sindex,
        sindexone: 0
      })
    }

    if (sindex == 2) { //代收货，预售
      // console.log(1111)
      this.yushoufengzhuang('Order_presaleReceive')
      this.setData({
        sindex: sindex,
        sindexone: 0
      })
    }
    if (sindex == 3) { //售后，预售
      this.yushoufengzhuang('Order_presaleAftersales')
      this.setData({
        sindex: sindex,
        sindexone: 0
      })
    }
    this.setData({
      iskong: 0,
      sindex: sindex,
      num: sindex,
      numone: 0
    })
  },
  // 预售酒市积分切换
  order_list(e) {
    let numone = e.currentTarget.dataset.index;
    console.log(this.data.sindex)
    console.log('e', e.currentTarget.dataset.index)
    // console.log("顶部四个", this.data.sindex, "下面切换", numone);
    if (this.data.sindex == 0 && numone == 0) { //代付款，预售
      this.yushoufengzhuang('Order_presaleObligation');
      console.log("预售0.0")
    }
    if (this.data.sindex == 0 && numone == 1) { //代付款，酒市
      // this.liquor();
      this.jiushufeng('Order_shopObligation')
      console.log("酒市0.1")
    }
    if (this.data.sindex == 1 && numone == 0) { //代发货，预售
      this.yushoufengzhuang('Order_presaleSend');
      console.log("预售1.0")
    }
    if (this.data.sindex == 1 && numone == 1) { //代发货，酒市 
      this.jiushufeng('Order_shopSend')
      console.log("预售1.1")
    }
    if (this.data.sindex == 1 && numone == 2) { //代发货，积分
      this.jifenfengzhuang('Order_scoresSend')
    }
    if (this.data.sindex == 2 && numone == 0) { //待收货，预售
      this.yushoufengzhuang('Order_presaleReceive')
    }
    if (this.data.sindex == 2 && numone == 1) { //待收货，酒市
      this.jiushufeng('Order_shopReceive')
    }
    if (this.data.sindex == 2 && numone == 2) { //待收货，积分
      this.jifenfengzhuang('Order_scoresReceive')
    }
    if (this.data.sindex == 3 && numone == 0) { //售后，预售
      this.yushoufengzhuang('Order_presaleAftersales')
    }
    if (this.data.sindex == 3 && numone == 1) { //售后，酒市
      this.jiushufeng('Order_shopAftersales')
    }
    if (this.data.sindex == 3 && numone == 2) { //售后，积分
      this.jifenfengzhuang('Order_scoresAftersales')
    }

    this.setData({
      iskong: 0,
      sindexone: numone,
      numone: numone
    })
  },
  //预售跳转到待付款
  yushounvgetoneedpay(e) {
    console.log('e', e.currentTarget.dataset.id),
      wx.navigateTo({
        url: '/pages/PersonalPub/orderDetails/orderDetails?id=' + e.currentTarget.dataset.id + '&whogeto=yushouneedpay',
      })
  },
  //酒市跳转到待付款
  getojsneedpay(e) {
    console.log('e', e.currentTarget.dataset.id),
      wx.navigateTo({
        url: '/pages/PersonalPub/orderDetails/orderDetails?id=' + e.currentTarget.dataset.id + '&whogeto=jiushineedpay',
      })
  },

  //酒市跳转跳转详情
  nvgeto(e) {
    console.log('e', e.currentTarget.dataset.id),
      wx.navigateTo({
        url: '/pages/PersonalPub/havePaid/havePaid?id=' + e.currentTarget.dataset.id + '&whogeto=jiushu',
      })
  },
  //预售跳转
  yushounvgeto(e) {
    console.log('e', e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/PersonalPub/havePaid/havePaid?id=' + e.currentTarget.dataset.id + '&whogeto=yushou',
    })
  },
  //积分封装
  jifenfengzhuang(sctparameter) {
    util.http.postJson("fn/user/get/admin",{
      'act': sctparameter,
    }, function(res) {
      if (res.data == undefined) {
        this.setData({
          iskong: 1
        })
        return;
      }
      for (let i = 0; i < res.data.length; i++) {
        let bannerimg = res.data[i].goodsinfo.playimage.split(',')
        for (let j = 0; j < bannerimg.length; j++) {
          bannerimg[j] = imageUrl + bannerimg[j]
        }
        res.data[i].goodsinfo.playimage = bannerimg[0]

        // res.data[i].goodsinfo.playimage = imageUrlone + res.data[i].goodsinfo.playimage
        res.data[i].goodsinfo.pic = '/img/exchangeSuo/exchangeSuo_topbck.png'
      }
      if (sctparameter == 'Order_scoresSend') { //代发货 积分
        this.setData({
          sendgoodspresellwinejifen: res.data
        })
      }
      if (sctparameter == 'Order_scoresReceive') { //代收货 积分
        this.setData({
          sendgoodspresellwineshoujifen: res.data
        })
      }
      if (sctparameter == 'Order_scoresAftersales') { //售后 积分
        this.setData({
          shouhouo_jifen: res.data
        })
      }
    })
  },


  //预售封装
  yushoufengzhuang(sctparameter) {
    util.http.postJson("fn/user/get/admin",{
      'act': sctparameter,
    }, function(res) {
      // console.log('111', res.data)
      if (res.data == undefined) {
        this.setData({
          iskong: 1
        })
        return;
      }
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].goodsinfo.pic = imageUrl + res.data[i].goodsinfo.pic
        var patt = /http/
        res.data[i].kolname = res.data[i].kolname || {};
        let thisplayimage = res.data[i].kolname.headpic
        if (!patt.test(thisplayimage)) {
          res.data[i].kolname.headpic = imageUrl + thisplayimage
        }
        // res.data[i].kolname.headpic = imageUrl + res.data[i].kolname.headpic
      }
      if (sctparameter == 'Order_presaleObligation') { //代付款 预售
        let allmoney = 0
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].goodsinfo.jindu = ((1 - res.data[i].goodsinfo.stockQuantity / res.data[i].goodsinfo.totalnum).toFixed(2)) * 100
          allmoney += (res.data[i].goodsinfo.price * res.data[i].buynum)
        }
        this.setData({
          orderpresellone: res.data,
          dfkallmoney: 0
        })
      }
      if (sctparameter == 'Order_presaleSend') { //代发货 预售
        this.setData({
          sendgoodspresell: res.data
        })
      }
      if (sctparameter == 'Order_presaleReceive') { //代收货 预售
        this.setData({
          suyhougoodspresellwine: res.data
        })
      }
      if (sctparameter == 'Order_presaleAftersales') { //售后 预售
        this.setData({
          getdgoodspresellwine: res.data
        })
      }

    })
  },
  //酒市封装
  jiushufeng(sctparameter) {
    console.log("酒市封装", sctparameter);
    let data = []
    var _this = this
    util.http.postJson("fn/user/get/admin",{
      'act': sctparameter,
    }, function(res) {
      if (res.data == undefined) {
        this.setData({
          iskong: 1
        })
        return
      }
      for (let i = 0; i < res.data.length; i++) {
        //判断头像
        var patt = /http/
        res.data[i].shophead = res.data[i].shophead || {};
        let thisplayimage = res.data[i].shophead.head
        if (!patt.test(thisplayimage)) {
          res.data[i].shophead.head = imageUrl + thisplayimage
        }

        for (let j = 0; j < res.data[i].order.length; j++) {
          res.data[i].order[j].goodsinfo = res.data[i].order[j].goodsinfo || {
            playimage: ""
          };
          let bannerimg = res.data[i].order[j].goodsinfo.playimage.split(',')
          for (let k = 0; k < bannerimg.length; k++) {
            bannerimg[k] = imageUrl + bannerimg[k]
          }
          res.data[i].order[j].goodsinfo.playimage = bannerimg[0]
        }
      }
      for (let i = 0; i < res.data.length; i++) {
        let allmoney = 0;
        let allnum = 0;
        for (let j = 0; j < res.data[i].order.length; j++) {
          allnum += res.data[i].order[j].num
          allmoney += (res.data[i].order[j].goodsinfo.price * res.data[i].order[j].num)
        }
        res.data[i].allnum = allnum
        res.data[i].allmoney = allmoney
      }
      if (sctparameter == 'Order_shopObligation') { //代付款酒市(店主)
        this.setData({
          orderWineone: res.data
        })
      }

      if (sctparameter == 'Order_shopSend') { //代发货酒市
        this.setData({
          sendgoodspresellwine: res.data
        })
      }
      if (sctparameter == 'Order_shopReceive') { //待收货 酒市

        this.setData({
          getgoodspresellwine: res.data
        })
      }
      if (sctparameter == 'Order_shopAftersales') { //售后 酒市

        this.setData({
          shouhoujiugoodspresellwine: res.data
        })
      }
    })
  },
  /**
   * 当前预售商品选中事件
   */
  selectListone(e) {
    var that = this;
    // 获取选中的radio索引
    var index = e.currentTarget.dataset.index;
    // 获取到商品列表数据
    var orderpresellone = thisdata.orderpresellone;
    // 默认全选
    thisdata.selectAllStatus = true;
    // 循环数组数据，判断----选中/未选中[selected]
    orderpresellone[index].selected = !orderpresellone[index].selected;
    console.log('orderpresellone[index].selected', orderpresellone[index].selected)
    // 如果数组数据全部为selected[true],全选
    for (var i = orderpresellone.length - 1; i >= 0; i--) {
      if (!orderpresellone[i].selected) {
        thisdata.selectAllStatus = false;
        break;
      }
    }
    // 重新渲染数据
    this.setData({
      orderpresellone: orderpresellone,
      selectAllStatus: thisdata.selectAllStatus
    })
    if (this.data.numone == 0) {
      this.count_price();
    }
    if (this.data.numone == 1) {
      this.jiucount_price();
    }
  },
  /**
   * 预售全选事件
   */
  selectAllone(e) {
    // 全选ICON默认选中
    let selectAllStatus = this.data.selectAllStatus;
    // true  -----   false
    selectAllStatus = !selectAllStatus;
    console.log('selectAllStatus', selectAllStatus)
    // 获取商品数据
    let orderpresellone = this.data.orderpresellone;
    // 循环遍历判断列表中的数据是否选中
    for (let i = 0; i < orderpresellone.length; i++) {
      orderpresellone[i].selected = selectAllStatus;
    }
    // 页面重新渲染
    this.setData({
      selectAllStatus: selectAllStatus,
      orderpresellone: orderpresellone
    });
    // 计算金额方法
    if (this.data.numone == 0) {
      this.count_price();
    }
    if (this.data.numone == 1) {
      this.jiucount_price();
    }

  },
  /**
   * 当前酒市商品选中事件
   */
  selectList(e) {
    var that = this;
    // 获取选中的radio索引
    var index = e.currentTarget.dataset.index;
    // 获取到商品列表数据
    var orderWineone = thisdata.orderWineone;
    // 默认全选
    thisdata.selectAllStatus = true;
    // 循环数组数据，判断----选中/未选中[selected]
    orderWineone[index].selected = !orderWineone[index].selected;
    // 如果数组数据全部为selected[true],全选
    for (var i = orderWineone.length - 1; i >= 0; i--) {
      if (!orderWineone[i].selected) {
        thisdata.selectAllStatus = false;
        break;
      }
    }
    // 重新渲染数据
    this.setData({
      orderWineone: orderWineone,
      selectAllStatus: thisdata.selectAllStatus
    })
    if (this.data.numone == 0) {
      this.count_price();
    }
    if (this.data.numone == 1) {
      this.jiucount_price();
    }
  },
  // 当前酒市商品每一个view选中事件
  selectListmol(e) {
    var that = this;
    // 获取选中的radio索引
    var index = e.currentTarget.dataset.index;
    // 获取到商品列表数据
    var orderWineone = thisdata.orderWineone;
    // 默认全选
    thisdata.selectAllStatus = true;
    // 循环数组数据，判断----选中/未选中[selected]
    orderWineone[index].selected = !orderWineone[index].selected;
    // 如果数组数据全部为selected[true],全选
    for (var i = orderWineone.length - 1; i >= 0; i--) {
      if (!orderWineone[i].selected) {
        thisdata.selectAllStatus = false;
        break;
      }
    }
    // 重新渲染数据
    this.setData({
      orderWineone: orderWineone,
      selectAllStatus: thisdata.selectAllStatus
    })

    if (this.data.numone == 0) {
      this.count_price();
    }
    if (this.data.numone == 1) {
      this.jiucount_price();
    }
  },
  /**
   * 待付款酒市全选事件
   */
  selectAll(e) {
    // 全选ICON默认选中
    let selectAllStatus = this.data.selectAllStatus;
    // true  -----   false
    selectAllStatus = !selectAllStatus;
    console.log('selectAllStatus', selectAllStatus)
    // 获取商品数据
    let orderWineone = this.data.orderWineone;
    // 循环遍历判断列表中的数据是否选中
    for (let i = 0; i < orderWineone.length; i++) {
      orderWineone[i].selected = selectAllStatus;
    }
    // 页面重新渲染
    this.setData({
      selectAllStatus: selectAllStatus,
      orderWineone: orderWineone
    });
    // 计算金额方法
    if (this.data.numone == 0) {
      this.count_price();
    }
    if (this.data.numone == 1) {
      this.jiucount_price();
    }

  },



  //预售总价
  count_price() {
    // 获取商品列表数据
    let orderpresellone = this.data.orderpresellone;
    // 声明一个变量接收数组列表price
    let total = 0;
    // 循环列表得到每个数据
    for (let i = 0; i < orderpresellone.length; i++) {
      // 判断选中计算价格
      if (orderpresellone[i].selected) {
        // 所有价格加起来 count_money
        total += orderpresellone[i].buynum * orderpresellone[i].goodsinfo.price;
      }
    }
    // 最后赋值到data中渲染到页面
    console.log('预售总价', total)
    this.setData({
      orderpresellone: orderpresellone,
      dfkallmoney: total.toFixed(2)
    });
  },

  //酒市总价计算
  jiucount_price() {
    // 获取商品列表数据
    let orderWineone = this.data.orderWineone;
    // 声明一个变量接收数组列表price
    let total = 0;
    // 循环列表得到每个数据
    console.log('orderWineone', orderWineone)
    for (let i = 0; i < orderWineone.length; i++) {
      // 判断选中计算价格
      if (orderWineone[i].selected) {
        for (let j = 0; j < orderWineone[i].order.length; j++) {
          total += orderWineone[i].order[j].num * orderWineone[i].order[j].goodsinfo.price;
          // console.log(orderWineone[0].order[j].buynum)
        }
        // 所有价格加起来 count_money

      }
    }
    this.setData({
      orderWineone: orderWineone,
      thisdfkallmoney: total.toFixed(2)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})