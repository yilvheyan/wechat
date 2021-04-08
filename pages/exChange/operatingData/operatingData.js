const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    operatingData: [
      // {
      //       image: 'http://qiniu-test.ishzm.com/jxb/img/exChange/operatingData_img.png',
      //       title: '江小白x天猫定制礼盒果味高粱酒蜜桃味苹果味23度168ml*8白酒',
      //       price: '187',
      //       txstate: '正在处理中',
      //       buynum: '4',
      //       orderreference: '11266658569',
      //       data: "2019-06-20"
      //   }
    ],
    withdrawdeposit: [
      //   {
      //     image: 'http://qiniu-test.ishzm.com/jxb/img/exChange/operatingData_img.png',
      //     title: '江小白x天猫定制礼盒果味高粱酒蜜桃味苹果味23度168ml*8白酒',
      //     price: '187',
      //     buynum: '4',
      //     txstate: '正在处理中',
      //     orderreference: '11266658569',
      //     data: "2019-06-20"
      // }, 
    ]
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      height: util.getallheigth().clientHeight
    })
    // 酒钻操作记录
    util.http.postJson("fn/user/get/admin",{
      'act': 'Scores_optionOrder',
    }, function(res) {
      if (res.ok) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].goodsinfo.detailimage = imageUrl + res.data[i].goodsinfo.detailimage
          res.data[i].goodsinfo.playimage = imageUrl + res.data[i].goodsinfo.playimage
          res.data[i].stateStr = thisstateType(res.data[i].state);
        }
        this.setData({
          operatingData: res.data,
          buynum: 1
        })
      }
    });
  },
  //  返回酒库
  mySpiritRoom() {
    var pages = getCurrentPages(); // 当前页面
    var beforePage = pages[pages.length - 2];
    wx.navigateBack({
      success: function() {
        beforePage.onLoad(); // 执行前一个页面的onLoad方法
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  stateType(state){
    var v='';
    switch(state){
      case 0: v = '未付款'; break;
      case 1: v = '付款成功'; break;
      case 2: v = '已发货'; break;
      case 3: v = '订单完成'; break;
      case 4: v = '退款申请中'; break;
      case 5: v = '退款完成'; break;
      case 6: v = '失效'; break;
      case 7: v = '待发货'; break;
      case 8: v = '待收货'; break;
      case 8: v = '删除订单'; break;
      default: v = 's';
    }
  return v;
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