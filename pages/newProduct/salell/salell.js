// pages/salell/salell.js
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: imageUrl,
    ngindex: 0, //导航index
    btuBottom: "",
    saletoplist: ['待合伙', '合作成功', '我参与的'],
    salemestlist: [ ]    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let isPhone = app.globalData.isIpx;
    if (isPhone) {
      this.setData({
        btuBottom: "68rpx",
      })
    }
    //待合伙
    this.onepageget(1, 10)

  },

  // 导航栏事件处理
  saletoplisttap(e) {
    var oid = e.currentTarget.dataset.index;
    if (oid == 0) {
      this.onepageget(1, 10);
    }
    if (oid == 1) {
      this.twopageget(1, 10);
    }
    if (oid == 2) {
      this.threepageget();
    }
    this.setData({
      ngindex: oid
    })
  },
  //内容跳转
  saleboxbtap(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/newProduct/presell/presell?id=' + id
    })
  },
  //合伙点击内用跳转
  hehuocli(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/newProduct/presellSucceed/presellSucceed?id=' + id
    })
  },
  //我参与的
  mycanyucli(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/newProduct/presellJoin/presellJoin?id=' + id + "&orderid=" + e.currentTarget.dataset.orderid
    })
  },


  //页面返回上级
  backpage() {
    wx.reLaunch({
      url: "/pages/square/square"
    })
  },

  // 下拉刷新
  loadMore() {
    console.log("触底事件");
    if (this.data.ngindex == 0) {
      let len = this.data.salemestlist.length + 10;
      this.onepageget(0, len)
    }
    if (this.data.ngindex == 1) {
      let len = this.data.salemestlist.length + 10;
      this.twopageget(0, len)
    }

  },
  //待合伙
  onepageget(offset, limit) {
    util.http.postJson("auth/getwineinfo", {
      'page': offset,
      'pageSize': limit,
      type: 'partnership',
      arge: {
        // uid:wx.getStorageSync("userid")
        uid: 360
      }
    }, (res) => {
      if (!res.data) {
        return;
      }
      for (var i = 0; i < res.data.length; i++) {
        let cursellnum = parseInt(((res.data[i].allnum - res.data[i].nownum) / res.data[i].allnum) * 100)
        res.data[i].cursellnum = cursellnum
        //进度条
        var percentage = cursellnum
        if (percentage <= 12) {
          percentage = 12
        }
        res.data[i].percentage = percentage
      }
      this.setData({
        salemestlist: res.data
      })
    })
  },


  //合作成功
  twopageget(offset, limit) {
    util.http.postJson("fn/presale/select", {
      'offset': offset,
      'limit': limit,
      type: 'success'
    }, (res)=> {
      if (!res.data) {
        return;
      }
      for (var i = 0; i < res.data.length; i++) {
        //时间比较(毫秒计算)
        let knowtime = new Date().getTime()
        let time = new Date(res.data[i].time).getTime()
        let endtime = new Date(res.data[i].endtime).getTime()
        let maketime = new Date(res.data[i].maketime).getTime()
        let sendtime = new Date(res.data[i].sendtime).getTime()
        let knowtimenum = 0
        if (knowtime - endtime > 0) {
          knowtimenum = 5
        } else if (knowtime - sendtime > 0) {
          knowtimenum = 4
        } else if (knowtime - maketime > 0) {
          knowtimenum = 3
        } else if (knowtime - time > 0) {
          knowtimenum = 2
        } else {
          knowtimenum = 1
        }
        res.data[i].knowtimenum = knowtimenum
        //时间转化
        res.data[i].endtime = util.formatTimeByTs(res.data[i].endtime, 'Y.M.D')
        res.data[i].maketime = util.formatTimeByTs(res.data[i].maketime, 'Y.M.D')
        res.data[i].sendtime = util.formatTimeByTs(res.data[i].sendtime, 'Y.M.D')
        res.data[i].time = util.formatTimeByTs(res.data[i].time, 'Y.M.D')
      }
      this.setData({
        salemestlist: res.data,
      })
    })
  },
  //我参与的
  threepageget() {
    util.http.postJson("fn/presale_order/select", {
    }, (res)=> {
      if (!res.data) {
        return;
      }
      for (var i = 0; i < res.data.length; i++) {
        //时间比较(毫秒计算)
        this.data.knowtime = new Date().getTime()
        let time = new Date(res.data[i].presale.time).getTime()
        let endtime = new Date(res.data[i].presale.endtime).getTime()
        let maketime = new Date(res.data[i].presale.maketime).getTime()
        let sendtime = new Date(res.data[i].presale.sendtime).getTime()

        let knowtimenum = 0
        if (this.data.knowtime - endtime > 0) {
          knowtimenum = 5
        } else if (this.data.knowtime - sendtime > 0) {
          knowtimenum = 4
        } else if (this.data.knowtime - maketime > 0) {
          knowtimenum = 3
        } else if (this.data.knowtime - time > 0) {
          knowtimenum = 2
        } else {
          knowtimenum = 1
        }
        res.data[i].knowtimenum = knowtimenum
        const cursellnum = parseInt(((res.data[i].presale.totalnum - res.data[i].presale.stockQuantity) / res.data[i].presale.totalnum) * 100)
        res.data[i].cursellnum = cursellnum;
        var cypercentage = cursellnum
        if (cypercentage <= 12) {
          cypercentage = 12
        }
        res.data[i].cypercentage = cypercentage
        //状态
        let pathimg
        if (res.data[i].presale.state == 3) { //众筹失败
          pathimg = 'http://qiniu-test.ishzm.com/jxb/img/zc_ defeated .png';
        } else {
          if (res.data[i].state == 1 && res.data[i].optionstate == 0) { //未操作
            pathimg = 'http://qiniu-test.ishzm.com/jxb/img/yushou/finish.png'
          }
          if (res.data[i].state == 1 && res.data[i].optionstate == 1) { //开店
            pathimg = 'http://qiniu-test.ishzm.com/jxb/img/saleimg.png'
          }
          if (res.data[i].state == 1 && res.data[i].optionstate == 2) { //提货
            pathimg = 'http://qiniu-test.ishzm.com/jxb/img/yushou/gethuoimg.png'
          }
          //4:退款中，5退款完成 ,没有2，3 
          if (res.data[i].state == 2 || res.data[i].state == 3) { //退款
            pathimg = 'http://qiniu-test.ishzm.com/jxb/img/tuikuanzhong.png'
          }
          if (res.data[i].state == 4) {
            pathimg = 'http://qiniu-test.ishzm.com/jxb/img/yushou/tuikuanimg.png'
          }
          if (res.data[i].state == 5) {
            pathimg = 'http://qiniu-test.ishzm.com/jxb/img/yushou/failsimg.png'
          }
          if (res.data[i].state == 6) {
            pathimg = 'http://qiniu-test.ishzm.com/jxb/img/yushou/failsimg.png'
          }
        }
        res.data[i].pathimg = pathimg;
      }
      this.setData({
        salemestlist: res.data
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
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})