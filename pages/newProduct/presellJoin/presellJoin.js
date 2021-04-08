// 我参与的预售详情
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
    presaleOrder: {},
    sptschekdeti: "",
  },
  //提货
  prjtihuo(e) {
    this.setData({ 
      sptschekdeti: e.currentTarget.dataset.item
    });
  },
  //分享功能
  onShareAppMessage: function(res) {
    let presaleid = this.data.presaleOrder.presale.id;
    if (res.from === 'button') {

    }
    return {
      title: '我参与的',
      desc: '单纯高粱酒江小白',
      path: '/pages/newProduct/presell/presell?id=' + presaleid, //这是一个路径,
      withShareTicket: true
    }

  },
  //确定按钮
  pjshull() {
    //箱*每箱个数*每个价格
    debugger;
    let allmoney = this.data.presaleOrder.buynum * this.data.presaleOrder.presale.sellmin * this.data.presaleOrder.presale.price
    if (this.data.sptschekdeti == '我要提货') { //选择提货
      if (this.data.presaleOrder.editnum == 0) { //操作的次数
        wx.navigateTo({
          url: '/pages/newProduct/pickGoods/pickGoods?id=' + this.data.presaleOrder.presale.id + "&orderid=" + this.data.presaleOrder.id
        })
      } else if (this.data.presaleOrder.editnum == 1) {
        wx.showModal({
          content: '仅能更改一次，是否确定更改',
          showCancel: true,
          cancelText: "否",
          cancelColor: 'skyblue',
          confirmText: "是",
          confirmColor: 'skyblue',
          success: (res) => {
            if (res.cancel) {
              //点击取消,默认隐藏弹框
            } else {
              //点击确定
              if (this.data.presaleOrder.presale.state < 3) {
                wx.navigateTo({
                  url: '/pages/newProduct/pickGoods/pickGoods?id=' + this.data.presaleOrder.presale.id + "&orderid=" + this.data.presaleOrder.id
                })
              } else {
                wx.showModal({
                  content: '已经发货，不允许再次更改',
                })
              }
            }
          }
        })
      } else if (this.data.presaleOrder.editnum == 2) {
        wx.showModal({
          content: '您已没有更改权利',
        })
      }
    } else if (this.data.sptschekdeti == '我要退款') { //选择退款
      if (this.data.presaleOrder.presale.state == 0) {
        wx.navigateTo({
          url: '/pages/newProduct/refund/refund?id=' + this.data.presaleOrder.presale.id + "&orderid=" + this.data.presaleOrder.id + '&tuimoney=' + allmoney + '&whogeto=yushou'
        })
      }
      if (this.data.presaleOrder.presale.state == 1) {
        wx.showModal({
          content: '产品已制作，无法退款',
        })
      }
    }
    if (this.data.sptschekde == false && this.data.sptschekdeti == false) {
      this.setData({
        useqita: 0
      })
    }

  },
  //关掉操作
  doncaozuo() {
    this.setData({
      showusehuo: 0
    })
  },
  //众筹失败退款
  refund() {
    let allprise = this.data.information.price * this.data.information.sellmin;
    let orderState = this.data.state;
    if (orderState == 1 || orderState == 2 || orderState == 7) {
      wx.navigateTo({
        url: '/pages/newProduct/refund/refund?whogeto=yushou&orderid=' + this.data.information.orderInfo.id + "&tuimoney=" + allprise
      })
    } else if (orderState == 0) {
      wx.showModal({
        content: '该产品，您尚未付款！',
      })
    } else if (orderState == 3) {
      wx.showModal({
        content: '退款核算中!',
      })
    } else if (orderState == 4) {
      wx.showModal({
        content: '已退款!',
      })
    } else {
      wx.showModal({
        content: '已失效!',
      })
    }
  },
  //底行跳转
  prejoincli(e) {
    if (e.currentTarget.dataset.item == '其他操作') {
      if (this.data.shozhuang == '已选售卖' || this.data.shozhuang == '只是买入') {
        this.data.cuozuolist =
          this.setData({
            cuozuolist: ['我要提货', '我要退款'],
            showusehuo: 1
          })
      }
      if (this.data.shozhuang == '已选提货') {
        this.setData({
          cuozuolist: ['我要退款'],
          showusehuo: 1
        })
      }
    }
    if (e.currentTarget.dataset.item == '我要售卖') {
      if (wx.getStorageSync('role') == 1) {
        wx.showModal({
          title: '小二不能开店',
          content: '您现在已经是小二，不能开店',
        })
        return;
      }
      if (this.data.presaleOrder.editnum == 0) {
        this.oppenshop();

      } else if (this.data.presaleOrder.editnum == 1) {
        if (this.data.presaleOrder.presale.state == 3) {
          wx.showModal({
            content: '已经发货，不允许再次更改',
          })
          return;
        }
        wx.showModal({
          content: '您仅有一次更改的权利，是否使用。',
          showCancel: true,
          cancelText: "否",
          cancelColor: 'skyblue',
          confirmText: "是",
          confirmColor: 'skyblue',
          success: (res) => {
            if (res.cancel) {
              //点击取消,默认隐藏弹框
            } else {
              this.oppenshop();
            }
          }
        })
      }
      if (this.data.presaleOrder.editnum == 2) {
        wx.showModal({
          content: '您已没有更改权利',
        })
      }
    }
    if (e.currentTarget.dataset.item == '继续付款') {
      this.peyfor(this.data.presaleOrder.id)
    }
  },

  oppenshop() {
    if (wx.getStorageSync('role') == 2 || (wx.getStorageSync('rolestate') == 1 && wx.getStorageSync('role') != 2)) { //已开过店
      let accountinfo = wx.getStorageSync('accountinfo')
      util.http.postJson("fn/user/get/admin", {
        'act': 'Shop_applyOpenShop',
        'orderid': this.data.presaleOrder.id
      }, function(res) {
        if (res.ok) {
          wx.showModal({
            content: '产品已推送到您的店铺，请前往查看',
            showCancel: true,
            cancelText: "否",
            cancelColor: 'skyblue',
            confirmText: "是",
            confirmColor: 'skyblue',
            success: (res) => {
              if (res.cancel) {
                //点击取消,默认隐藏弹框
              } else {
                wx.reLaunch({
                  url: '/pages/newProduct/salell/salell'
                })
              }
            }
          })
        } else {
          wx.showModal({
            content: '操作失败',
            showCancel: true, //是否显示取消按钮
          })
        }

      })
    } else if (wx.getStorageSync('rolestate') == 0) { //未开过店
      wx.navigateTo({
        url: '/pages/newProduct/shopkerTication/shopkerTication?id=' + this.data.presaleOrder.id
      })
    }
  },
  //支付
  peyfor(orderInfoid) {
    var _this = this
    util.getOpenid();
    util.http.postJson("fn/user/get/admin", { //支付
      'act': 'Wxpay_index',
      'orderid': orderInfoid,
      'openid': wx.getStorageSync('openid')
    }, (res) => {
      var resp = JSON.parse(res.data)
      wx.requestPayment({
        'timeStamp': resp.timeStamp,
        'nonceStr': resp.nonceStr,
        'package': resp.package,
        'signType': 'MD5',
        'paySign': resp.paySign,
        'success': function(res) {
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 3000
          });
          let pid = _this.data.presaleOrder.presale.id;
          util.http.postJson("fn/user/get/admin", {
            'act': 'Presale_createPrepayid',
            'orderid': orderInfoid
          }, function(ress) {
            wx.reLaunch({
              url: '/pages/newProduct/paymentSuccess/paymentSuccess?id=' + orderInfoid + "&price=" + _this.data.price + "&presellId=" + pid + "&presellnum=" + _this.data.orderInfobuynum
            })
          })
        },
        'fail': function(res) {
          wx.showToast({
            title: '支付失败',
            icon: 'none',
            duration: 3000
          });
        },
        'complete': function(res) {
          console.log('complete 2');
        }
      });
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    util.http.get("fn/Presale_order/get/" + options.id, (res) => {
      res.data.allmoney = res.data.buynum * res.data.presale.price;
      let bannerarry = res.data.presale.playimage.split(',')

      //时间比较(毫秒计算)
      let knowtime = new Date().getTime()
      let time = new Date(res.data.presale.time).getTime()
      let endtime = new Date(res.data.presale.endtime).getTime() //结束
      let maketime = new Date(res.data.presale.maketime).getTime() //制作
      let sendtime = new Date(res.data.presale.sendtime).getTime() //发货
      if (knowtime - endtime > 0) {
        res.data.knowtimenum = 5
      } else if (knowtime - sendtime > 0) {
        res.data.knowtimenum = 4
      } else if (knowtime - maketime > 0) {
        res.data.knowtimenum = 3
      } else if (knowtime - time > 0) {
        res.data.knowtimenum = 2
      } else {
        res.data.knowtimenum = 1
      }
      //进度条及优化
      var ojindu = parseInt(((res.data.presale.totalnum - res.data.presale.stockQuantity) / res.data.presale.totalnum) * 100)
      var alltotalnum = ojindu
      if (alltotalnum <= 12) {
        alltotalnum = 12
      }
      if (alltotalnum >= 88) {
        alltotalnum = 88
      }

      //判断按钮
      let buttonarry = []
      let nowbuttonstatus = 0
      let oshozhuang = ''
      if (res.data.presale.state == 3) { //众筹失败
        nowbuttonstatus = 10
      } else {
        if (res.data.state == 0) {
          buttonarry = ['继续付款']
          nowbuttonstatus = 1
        }
        if (res.data.state == 1) {
          if (res.data.optionstate == 0) {
            buttonarry = ['其他操作', '我要售卖']
            oshozhuang = '只是买入'
            nowbuttonstatus = 1
          }
          if (res.data.optionstate == 1) {
            buttonarry = ['其他操作']
            oshozhuang = '已选售卖'
            nowbuttonstatus = 2
          }
          if (res.data.optionstate == 2) {
            buttonarry = ['其他操作', '我要售卖']
            oshozhuang = '已选提货'
            nowbuttonstatus = 2
          }
        }
        if (res.data.state == 2) {
          buttonarry = ['退款中']
          nowbuttonstatus = 3
        }
        if (res.data.state == 3) {
          buttonarry = ['退款中']
          nowbuttonstatus = 3
        }
        if (res.data.state == 4) {
          buttonarry = ['已退款']
          nowbuttonstatus = 3
        }
        if (res.data.state == 5) {
          buttonarry = ['已失效']
          nowbuttonstatus = 3
        }
        if (res.data.state == 6) {
          buttonarry = ['已失效']
          nowbuttonstatus = 3
        }
        if (res.data.state == 7) {
          buttonarry = ['待收货']
          nowbuttonstatus = 3
        }

      }
      this.setData({
        imgUrls: bannerarry,
        presaleOrder: res.data,
        jindu: ojindu,
        shozhuang: oshozhuang,
        totalnum: alltotalnum,
        chobuttonlist: buttonarry,
        buttonstatus: nowbuttonstatus,
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
})