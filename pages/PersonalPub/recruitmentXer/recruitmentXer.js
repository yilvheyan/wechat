// pages/PersonalPub/recruitmentXer/recruitmentXer.js
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopname: '',
    recruitment: [
      // {
      // id: "0",
      // img: "http://qiniu-test.ishzm.com/jxb/img/myStore/path.png",
      // name: '风流淌的云',
      // image: "http://qiniu-test.ishzm.com/jxb/img/myStore/recruitment_img.png",
      // time: "2019.7.28"
      // }
    ]
  },

  //确认招募
  recruit(e) {
    console.log(e.currentTarget.dataset.waiteruid)
    var waiteruid = e.currentTarget.dataset.waiteruid
    var _this = this
    wx.showModal({
      title: '招募确认',
      content: '确定招募他成为您店铺的小二吗？',
      success: function(res) {
        console.log('res', res)
        console.log('waiteruid', waiteruid)
        if (res.cancel) { //点击取消
          return;
        } else if (res.confirm) {
          util.http.postJson("fn/user/get/admin",{
            'act': 'Waiter_recruitWaiter',
            'waiteruid': waiteruid
          }, function(res) {
            if (res.data.code == 10001) {
              if (res.data.fail == 'waiter_num_morethan_3') {
                wx.showToast({
                  title: '招募失败，招募已上限',
                  icon: 'none'
                })
                return;
              } else {
                wx.showToast({
                  title: '招募失败，该用户身份已占用',
                  icon: 'none'
                })
                return;
              }
            }
            wx.showToast({
              title: '招募成功',
            })
            _this.showwaiter()
            wx.redirectTo({
              url: '/pages/PersonalPub/myChateau/myChateau'
            })

          })
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.shopname = options.shopname
    this.showwaiter()
  },
  resharewt() {
    wx.redirectTo({
      url: "/pages/PersonalPub/toshareWaiter/toshareWaiter?shopname=" + this.data.shopname
    })
  },

  showwaiter() {
    util.http.postJson("fn/user/get/admin",{
      'act': 'Waiter_applyWaiterList'
    }, function(res) {

      if (res.ok && res.data != undefined) {
        for (let i = 0; i < res.data.length; i++) {
          var patt = /http/
          let thisplayimage = res.data[i].heads.head
          if (!patt.test(thisplayimage)) {
            res.data[i].heads.head = imageUrl + thisplayimage
          }

          res.data[i].time = util.formatTimeByTs(res.data[i].time, 'Y.M.D');
        }
        this.setData({
          recruitment: res.data
        });
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