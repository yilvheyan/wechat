// 合伙成功
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
    id: 0,
    num: 1,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',
    "code": "10000",
    "success": "list",
    imgUrls: [],
    information: {

    },
    jindu: 0,
    buynum: 1,
    presellone: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.data.id = options.id
    util.http.get("fn/presale/get/" + options.id, (res) => {

      let bannerarry = res.data.playimage.split(',')
      //时间比较(毫秒计算)
      this.data.knowtime = new Date().getTime()
      let time = new Date(res.data.time).getTime()
      let endtime = new Date(res.data.endtime).getTime()
      let maketime = new Date(res.data.maketime).getTime()
      let sendtime = new Date(res.data.sendtime).getTime()
      let knowtimenum = 0
      if (this.data.knowtime - sendtime > 0) {
        knowtimenum = 4
      } else if (this.data.knowtime - maketime > 0) {
        knowtimenum = 3
      } else if (this.data.knowtime - time > 0) {
        knowtimenum = 2
      } else {
        knowtimenum = 1
      }
      res.data.knowtimenum = knowtimenum
      // debugger;
      res.data.cursellnum = res.data.totalnum - res.data.stockQuantity;
      res.data.endtime = util.formatTimeByTs(res.data.endtime, 'Y.M.D')
      res.data.maketime = util.formatTimeByTs(res.data.maketime, 'Y.M.D')
      res.data.sendtime = util.formatTimeByTs(res.data.sendtime, 'Y.M.D')
      res.data.time = util.formatTimeByTs(res.data.time, 'Y.M.D')
      var ojindu = parseInt(((res.data.totalnum - res.data.stockQuantity) / res.data.totalnum) * 100)
      console.log(res.data);
      this.setData({
        imgUrls: bannerarry,
        information: res.data,
        jindu: ojindu
      })
    })

  },
  //分享功能
  onShareAppMessage: function(res) {
    let _this = this
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '合伙成功',
      desc: '单纯高粱酒江小白',
      path: '/pages/newProduct/presell/presell?id=' + _this.data.id, //这是一个路径,
      withShareTicket: true
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  // onUnload: function() {

  // },

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