const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headimg: '',
    waiterlist: '',
    nickName: '',
    ydayScore: 0,
    monthScore: 0,
    score: 0,
    sharing: 0,
    waiterMax: 3,
    currWaiter: 0,
    shopuid: 0,
    shopname: '',
    myshopkeeper: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      headimg: userInfo.avatarUrl
    });
    //店铺数据
    util.http.postJson("fn/user/get/admin",{
      'act': 'Waiter_waiterScores'
    }, function(res) {
      if (res.ok) {
        // console.log(res.data.rate.goodsRate)
        this.setData({
          ydayScore: res.data.yestodayscore,
          monthScore: res.data.monthscore,
          score: res.data.totalscore.scores,
          sharing: res.data.rate.waiter_rate,
          nickName: res.data.name.name,
          shopuid: res.data.name.shopuid
        });
      } else {}
    });


    //小二的店主
    util.http.postJson("fn/user/get/admin",{
      'act': 'Waiter_waiterShopkeeper'
    }, function(res) {
      if (res.ok) {
        for (let i = 0; i < res.data.length; i++) {
          var patt = /http/
          let thisplayimage = res.data[i].heads.head
          if (!patt.test(thisplayimage)) {
            res.data[i].heads.head = imageUrl + thisplayimage
          }
          res.data[i].shops.image = imageUrl + res.data[i].shops.image
          // if (!res.data.shoplist[i].icon && res.data.shoplist[i].icon.length == 0) {
          //   res.data.shoplist[i].image = imageUrl + res.data.shoplist[i].image
          // } else {
          //   res.data.shoplist[i].image = imageUrl + res.data.shoplist[i].icon
          // }
        }
        // console.log
        this.setData({
          myshopkeeper: res.data,
          shopname: res.data[0].shops.name,
          shopuid: res.data[0].shopuid
        })
      } else {}
    });


  },
  // 进入我的店铺
  myshopping() {
    console.log(this.data.shopuid)
    var shopuid = wx.getStorageSync('userid')
    wx.navigateTo({
      url: '/pages/PersonalPub/myStore/myStore?ishare=' + 'aa' + '&shopuid=' + this.data.shopuid + "&shopname=" + this.data.shopname,
    })
  },
  // 我的订单
  myorder() {
    wx.navigateTo({
      url: '/pages/PersonalPub/orderHistory/orderHistory'
    })
  },
  // 解除关系
  cancelrelation(e) {
    console.log('解除关系', e.currentTarget.dataset.shopuid)
    wx.showModal({
      title: '提示',
      content: '您确定要与店主解除关系吗',
      success: function(res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          util.http.postJson("fn/user/get/admin",{
            'act': 'Waiter_dismissShopkeeper',
            'shopuid': e.currentTarget.dataset.shopuid
          }, function(res) {
            if (res.data.code == 10001) {
              wx.showModal({
                content: '确认雇主关系不到三个月，不能解除',
              })
              return;
            }
            wx.reLaunch({
              url: '/pages/home/home'
            })
          });
        }
      }
    })

  },
  // 比例分销
  distribution(e) {
    wx.showToast({
      title: '例：比例若设置为60%,意味着一瓶酒若10积分利润,掌柜得6分,小二得4分',
      icon: 'none',
      duration: 5000
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