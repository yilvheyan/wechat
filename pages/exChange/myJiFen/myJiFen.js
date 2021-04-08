const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    integral: '122',
    totalscore: 0,
    mygains: 0,
    freezetotal: 0,
    integral: [{
      img: "http://qiniu-test.ishzm.com/jxb/img/profilephoto.png",
      name: "周杰伦白酒",
      time: "2019.05.05",
      state: "进行中",
      jznumber: "100",
      dataexchange: "1.63"
    }]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    options.scores = Number(options.scores).toFixed(2)
    this.setData({
      mygains: options.yesscores,
      totalscore: options.scores,
      freezetotal: options.freezetotal
    })
    util.http.postJson("fn/user/get/admin",{
      'act': 'Scores_myscores',
    }, function(res) {
      if (res.ok) {
        //kol头像
        for (let i = 0; i < res.data.mylog.length; i++) {
          res.data.mylog[i].kolinfo.headpic = imageUrl + res.data.mylog[i].kolinfo.headpic
        }
        //status:判断记录状态    1进行中2完成3取消(终止)
        this.setData({
          integral: res.data.mylog,
          // freezeintegral: res.data.freezescores[0]
        });
      }
    });
  },
  //   积分体现
  integralWithdraw() {
    wx.navigateTo({
      url: '/pages/exChange/integralWithdraw/integralWithdraw'
    })
  },
  // 酒钻交易
  jiuzuandeal() {
    console.log("111")
    wx.switchTab({
      url: '/pages/exchangeSuo/exchangeSuo',
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  integral() {
    wx.navigateTo({
      url: '/pages/exChange/integralDetail/integralDetail'
    })
  },
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