const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    whogeto: '',
    selectAllStatus: false, // 全选状态，默认全选
    winordjudge: 0, //判断商品是否从购物车来， 是：100， 否：0
    packagepostage: '包邮', //运费包邮.
    allmoney: 0,
    infojson: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.data.id = options.id
    this.data.whogeto = options.whogeto
    console.log('options', options)
    //获取
    if (options.whogeto == 'yushou') {
      this.yushoufengzhuang({
        'act': 'Presale_orderinfo',
        "orderid": options.id
      })
      console.log('options11111111', )
    } else {
      this.jiushufeng({
        'act': 'Shop_orderinfo',
        "orderid": options.id
      })
    }
  },
  //酒市详情封装
  jiushufeng(json) {
    let data = []
    var _this = this
    util.http.postJson("fn/user/get/admin",json, function(res) {
      for (let i = 0; i < res.data.length; i++) {
        for (let j = 0; j < res.data[i].order.length; j++) {
          let bannerimg = res.data[i].order[j].goodsinfo.playimage.split(',')
          for (let k = 0; k < bannerimg.length; k++) {
            bannerimg[k] = imageUrl + bannerimg[k]
          }
          res.data[i].order[j].goodsinfo.playimage = bannerimg[0]
        }
      }
      for (let i = 0; i < res.data.length; i++) {
        let allmoney = 0;
        for (let j = 0; j < res.data[i].order.length; j++) {
          allmoney += (res.data[i].order[j].goodsinfo.price * res.data[i].order[j].num)
        }
        console.log('1111', allmoney)
        res.data[i].allmoney = allmoney
        console.log('2222', res.data[i].allmoney)
      }
      let nowallmoney = res.data[0].money - thisdata.newpeople;
      res.data[0].time = util.formatTimeByTs(res.data[0].time, 'Y.M.Dh:m:s');
      
      res.data[0].paytime = util.formatTimeByTs(res.data[0].paytime, 'Y.M.Dh:m:s');
      if (json.act == 'Shop_orderinfo') { //代发货酒市
        var patt = /http/
        let thisplayimage = res.data[0].shophead.head
        if (!patt.test(thisplayimage)) {
          res.data[0].shophead.head = imageUrl + thisplayimage
        }
        res.data[0].vstate = util.shopstate(res.data[0].state);
        this.setData({
          peopleinfohead: res.data[0].shophead.head,
          peopleinfoname: res.data[0].shopname.name,
          shopmessage: res.data[0].order,
          allmoney: res.data[0].allmoney,
          nowallmoney: nowallmoney,
          sn: res.data[0].sn,
          xiadantime: res.data[0].time,
          infojson: res.data[0]
        })
      }
    })
  },

  //预售封装
  yushoufengzhuang(json) {
    util.http.postJson("fn/user/get/admin",json, function(res) {
      //给图片加路径
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].goodsinfo.playimage = imageUrl + res.data[i].goodsinfo.pic

        var patt = /http/
        let thisplayimage = res.data[i].kolinfo.headpic
        if (!patt.test(thisplayimage)) {
          res.data[i].kolinfo.headpic = imageUrl + thisplayimage
        }
      }
      //算价格和总价
      let allmoney = 0;
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].num = res.data[i].buynum
        allmoney += (res.data[i].goodsinfo.price * res.data[i].buynum)
      }
      res.data[0].allmoney = allmoney
      console.log(res.data[0].allmoney)
      res.data[0].time = util.formatTimeByTs(res.data[0].time, 'Y.M.Dh:m:s');
      res.data[0].vstate = util.orderstate(res.data[0].state);
      this.setData({
        peopleinfohead: res.data[0].kolinfo.headpic,
        peopleinfoname: res.data[0].kolinfo.name,
        shopmessage: res.data,
        allmoney: res.data[0].allmoney,
        sn: res.data[0].sn,
        xiadantime: res.data[0].time,
        infojson: res.data[0]
      })
      // }
    })
  },
  // 退款
  refund() {
    // console.log(this.data.shopmessage[0].state, this.data.whogeto)

    if (this.data.whogeto == 'yushou' && this.data.shopmessage[0].goodsinfo.state == 1) {
      wx.showToast({
        title: '该商品已制作，不能退货',
        icon: 'none',
        duration: 3000
      })
    } else {
      wx.navigateTo({
        url: '/pages/PersonalPub/refund/refund?orderid=' + this.data.id + '&whogeto=' + this.data.whogeto + '&tuimoney=' + this.data.allmoney
      })
    }

  },
  // 左上返回按钮
  skiphome() {
    wx.navigateBack({
      url: '/pages/PersonalPub/orderConfirmation/orderConfirmation'
    })
  },

  // 用户点击显示弹窗
  clickPup: function() {
    util.http.postJson("fn/user/get/admin",{
      'act': 'Shop_cancelReason',
    }, function(res) {
      this.setData({
        popuplist: res.data
      })
    })



    let _that = this;
    if (!_thisdata.click) {
      _this.setData({
        click: true,
      })
    }
    if (_thisdata.option) {
      _this.setData({
        option: false,
      })
      setTimeout(() => {
        _this.setData({
          click: false,
        })
      }, 100)
    } else {
      _this.setData({
        option: true
      })
    }
  },
  // 姓名电话售后地址
  placeanorder: function() {
    wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "/pages/newProduct/selectAddress/selectAddress"
    })
  },

  // 点击复制
  copyText: function(e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function(res) {}
    })

  },


  //确认收货
  createOrder: function(e) {

  },
  onShow: function() {
    //商品地址
    util.http.postJson("fn/user/get/admin",{
      'act': 'Address_allList',
    }, function(res) {
      // var otihuoaddress = {}
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */

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