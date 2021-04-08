const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
var num = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idx: 0,
    viewBg: 'rgba(204,204,204,1);',
    selectAllStatus: false, // 全选状态，默认全选
    packagepostage: '包邮', //运费包邮.
    timer: '', //定时器名字
    time: "", //结算时间
    gettime: '',
    popuplist: [],
    countDownNum: '500', //倒计时初始值,
    qgdjs_jo: {
      min: "00",
      sec: "00"
    },
    indexid: 0, //取消原因id
    orderid: 0,
    peopleinfohead: '',
    peopleinfoname: '',
    whogeto: '',
    tihuoaddress: {},
    tihuoaddressnum: 0,
    id: 0,
    // 取消订单
    parameter: []
  },
  toggleBtn: function(e) {
    var that = this;
    var index = e.currentTarget.id
    this.setData({
      idx: index
    })
    console.log(thisdata.idx)

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.data.id = options.id
    this.data.whogeto = options.whogeto
    if (options.whogeto == 'yushouneedpay') {
      this.yushoufengzhuang({
        'act': 'Presale_orderinfo',
        "orderid": options.id
      })
    } else {
      this.jiushufeng({
        'act': 'Shop_orderinfo',
        "orderid": options.id
      })
    }
  },
  // 取消订单点击事件
  parameterTap: function(e) {
    var that = this
    var this_checked = e.currentTarget.dataset.id //获取当前点击的下标
    var parameterList = this.data.parameter //获取Json数组
    for (var i = 0; i < parameterList.length; i++) {
      if (parameterList[i].id == this_checked) {
        parameterList[i].checked = true; //当前点击的位置为true即选中
      } else {
        parameterList[i].checked = false; //其他的位置为false
      }
    }
    this.setData({
      parameter: parameterList
    })
  },
  popupimg(e) {
    this.setData({
      orderpopupimg: true,
      open: true,
      orderpopupic: parseFloat
    })
  },
  // 复制

  copyText: function(e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function(res) {}
    })
  },



  //预售封装
  yushoufengzhuang(json) {
    util.http.postJson("fn/user/get/admin",json, function(res) {
      //给图片加路径
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].goodsinfo.playimage = imageUrl + res.data[i].goodsinfo.pic
        res.data[i].kolinfo.headpic = imageUrl + res.data[i].kolinfo.headpic
      }
      //算价格和总价
      let allmoney = 0;
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].num = res.data[i].buynum
        allmoney += (res.data[i].goodsinfo.price * res.data[i].buynum)
      }
      res.data[0].allmoney = allmoney
      console.log(res.data[0].allmoney)
      //时间格式转化成时间戳
      // res.data[0].maxtime = util.formatTimeByTs(res.data[0].maxtime, 'Y.M.Dh:m:s')
      //  var date = new Date(res.data[0].maxtime);
      var date = new Date(res.data[0].maxtime.replace(/-/g, '/'));
      var time_str = date.getTime();
      //   console.log('aaa', time_str)
      // console.log('aaa', new Date(res.data[0].time))
      thiscountDown(time_str)
      // res.data[0].maxtime = util.formatTimeByTs(res.data[0].maxtime, 'Y.M.Dh:m:s');
      this.setData({
        peopleinfohead: res.data[0].kolinfo.headpic,
        peopleinfoname: res.data[0].kolinfo.name,
        shopmessage: res.data,
        allmoney: res.data[0].allmoney,
        sn: res.data[0].sn,
        xiadantime: res.data[0].maxtime
      })
      // }
    })
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
          //   console.log('aaa', bannerimg)
          // res.data[i].order[j].goodsinfo.playimage = imageUrl + res.data[i].order[j].goodsinfo.playimage
        }
      }
      for (let i = 0; i < res.data.length; i++) {
        let allmoney = 0;
        for (let j = 0; j < res.data[i].order.length; j++) {
          allmoney += (res.data[i].order[j].goodsinfo.price * res.data[i].order[j].num)
        }
        res.data[i].allmoney += allmoney
      }
      res.data[0].time = util.formatTimeByTs(res.data[0].time, 'Y.M.Dh:m:s');
      let nowallmoney = res.data[0].money - thisdata.newpeople
      //时间格式转化成时间戳
      var date = new Date(res.data[0].maxtime);
      var time_str = date.getTime();
      //   console.log('aaa', time_str)
      thiscountDown(time_str)
      if (json.act == 'Shop_orderinfo') { //代发货酒市
        this.setData({
          peopleinfohead: imageUrl + res.data[0].shophead.head,
          peopleinfoname: res.data[0].shopname.name,
          shopmessage: res.data[0].order,
          allmoney: res.data[0].money,
          nowallmoney: nowallmoney,
          sn: res.data[0].sn,
          xiadantime: res.data[0].time
        })
      }
    })
  },

  //确认支付
  havePaid() {
    // console.log(!this.data.tihuoaddress)

    if (this.data.whogeto == 'yushouneedpay') {
      this.needpay('Wxpay_index', 'Presale_createPrepayid')
    } else {
      if (this.data.tihuoaddressnum == 0) {
        wx.showModal({
          title: '地址',
          content: '请先填写地址',
        })
        return
      }
      this.needpay('Wxpayshop_index', 'Shop_createPrepayid')
    }

  },

  needpay(act, actone) {
    util.http.postJson("fn/user/get/admin",{ //支付
      'act': act,
      'orderid': this.data.id,
      'openid': wx.getStorageSync('openid')
    }, function(res) {
      var resp = JSON.parse(res.data)
      wx.requestPayment({
        'timeStamp': resp.timeStamp,
        'nonceStr': resp.nonceStr,
        'package': resp.package,
        'signType': 'MD5',
        'paySign': resp.paySign,
        'success': function(res) {
          clearInterval(thisdata.timer);
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 3000
          });
          console.log('success');
          util.http.postJson("fn/user/get/admin",{
            'act': actone,
            'orderid': thisdata.id
          }, function(ress) {
            wx.reLaunch({
              url: '/pages/PersonalPub/paymentOk/paymentOk'
            })
          })
        },
        'fail': function(res) {
          wx.showToast({
            title: '支付失败',
            icon: 'none',
            duration: 1000
          });
        },
      });
    })
  },



  // 左上返回
  skipnew() {
    wx.navigateBack({
      url: '/pages/PersonalPub/orderConfirmation/orderConfirmation'
    })
  },
  // 实现倒计时
  countDown(gettime) {
    let that = this;
    this.data.timer = setInterval(() => {
      var lefttime = parseInt((gettime - (new Date().getTime())) / 1000)
      // console.log('1', gettime)
      // console.log('1', (new Date()).getTime())   //获取到的时间是毫秒
      //   console.log('1.5', lefttime)
      let m = parseInt(lefttime / 60)
      let s = lefttime % 60
      //   console.log('aaa', m, s)
      if (lefttime <= 0) {
        this.setData({
          qgdjs_jo: {
            min: "00",
            sec: "00"
          }
        })
        clearInterval(this.data.timer);
        return
      }
      m < 10 ? m = "0" + m : m;
      s < 10 ? s = "0" + s : s;
      this.setData({
        qgdjs_jo: {
          min: m,
          sec: s
        }
      })
    }, 1000)
  },
  // 取消订单
  selectList(e) {
    console.log(e)
    var that = this;
    // 获取选中的radio索引
    var id = e.currentTarget.dataset.id;
    this.data.yinsuid = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index;
    this.data.indexid = id
    console.log('index', index)
    console.log('id', id)
    // 获取到商品列表数据
    var shopmessage = this.data.popuplist;
    for (let i = 0; i < shopmessage.length; i++) {
      shopmessage[i].orderpopupic = false
    }
    shopmessage[index].orderpopupic = true
    // shopmessage[index].orderpopupic = !shopmessage[index].orderpopupic;      

    // 更改提交按钮的颜色
    num++;
    var result = num / 2;
    if (num % 2 == 0) {
      this.setData({
        viewBg: 'linear-gradient(179deg,rgba(91,163,238,1) 0%, rgba(116,202,251,1)100%)' //
      })
    } else {
      this.setData({
        viewBg: 'linear-gradient(179deg,rgba(116,202,251,1) 0%,rgba(91,163,238,1) 100%)'
      })
    }
    this.setData({
      popuplist: shopmessage
    })

  },
  // 提交提交按钮
  orderpresent(e) {
    //判断下标是否选中
    console.log('1111111', this.data.viewBg)
    if (this.data.viewBg == 'rgba(204,204,204,1);') {

      wx.showToast({
        title: '请先选中原因',
        icon: 'none',
        duration: 2000,
      })
      return;
    } else {
      if (this.data.whogeto == 'yushouneedpay') {
        util.http.postJson("fn/user/get/admin",{
          'act': 'Order_cancelOrder',
          'orderid': this.data.id,
        }, function(res) {
          wx.reLaunch({
            url: '/pages/PersonalPub/orderConfirmation/orderConfirmation',
          })
        })
      } else {
        // 取消订单
        console.log('aaaa', this.data.id)
        util.http.postJson("fn/user/get/admin",{
          'act': 'Order_cancelshopOrder',
          'orderid': this.data.id,
        }, function(res) {
          wx.reLaunch({
            url: '/pages/PersonalPub/orderConfirmation/orderConfirmation',
          })
        })
      }
    }
  },
  // 用户点击显示弹窗
  clickPup: function() {
    // 取消原因列表
    util.http.postJson("fn/user/get/admin",{
      'act': 'Shop_cancelReason',
    }, function(res) {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].orderpopupic = false
        thisdata.viewBg = 'rgba(204,204,204,1);'
      }
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

      // 关闭显示弹窗动画的内容，不设置的话会出现：点击任何地方都会出现弹窗，就不是指定位置点击出现弹窗了
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
  //   < !--姓名电话售后地址 -->
  placeanorder: function() {
    wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "/pages/newProduct/selectAddress/selectAddress"
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
    //商品地址
    util.http.postJson("fn/user/get/admin",{
      'act': 'Address_allList',
    }, function(res) {
      if (!res.data) {
        this.setData({
          tihuoaddressnum: 0
        })
        return;
      }
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].state == 1) {
          thisdata.addrid = res.data[i].id
          this.setData({
            tihuoaddressnum: 1,
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