const app = getApp();
const imageUrl = app.globalData.imageUrl;
const imageUrlfound = app.globalData.imageUrlfound;
const publicUrl = app.globalData.publicUrl;
const util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sindex: 0,
    imgUrls: [],
    num: 0,
    chateau: [],
    currentSwiper: 0,
    noticeList: [{
        content0: "点赞可以获得更多得积分",
      },
      {
        content1: "转发可以获得更多得积分",
      }
    ],
    message: [{
        id: '0',
        text: "推荐"
      },

      {
        id: '1',
        text: '排名'
      }
    ],
  },
  //去完成
  wcnageto() {
    wx.navigateTo({
      url: '/pages/findlist/listdetails/listdetails',
    })
  },

  //轮播点击事件
  squarecl(e) {
    console.log('e', e);
    this.onepageget(e.currentTarget.dataset.id);
    this.threepageget(e.currentTarget.dataset.id);
    this.twopageget(e.currentTarget.dataset.id);
  },


  //待合伙
  onepageget(thid) {
    util.http.postJson("fn/user/get/admin",{
      'act': 'Presale_waitPartner',
      'offset': 0,
      'limit': 100
    }, function(res) {
      if (!res.data) {
        return
      }
      for (let i = 0; i < res.data.length; i++) {

        if (res.data[i].id == thid) {
          wx.navigateTo({
            url: '/pages/newProduct/presell/presell?id=' + thid
          })
        }
      }

    })
  },

  //合作成功
  twopageget(thid) {
    util.http.postJson("fn/user/get/admin",{
      'act': 'Presale_successList',
      'offset': 0,
      'limit': 100
    }, function(res) {
      if (!res.data) {
        return;
      }
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].id == thid) {
          wx.navigateTo({
            url: '/pages/newProduct/presellSucceed/presellSucceed?id=' + thid
          })
        }
      }

    })

  },
  //我参与的
  threepageget(thid) {
    let isexist = false;
    util.http.postJson("fn/user/get/admin",{
      'act': 'Presale_mineJoinlist'
    }, function(res) {
      if (!res.data) {
        isexist = false;
      } else {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].id == thid) {
            wx.navigateTo({
              url: '/pages/newProduct/presellJoin/presellJoin?id=' + thid + "&orderid=" + res.data[i].orderid
            })
          }
        }
      }
    });
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let isPhone = app.globalData.isIpx;
    if (isPhone) {
      this.setData({
        btuBottom: "68rpx",
      })
    }
    console.log(options)
    this.tuijian(0, 10)
  },

  //推荐，附近切换按钮
  onclickList: function(e) {
    let num = e.target.id;
    if (num == 0) {
      this.tuijian(0, 10)
    }
    if (num == 1) {
      this.paiming(0, 10)
    }
    this.setData({
      sindex: num,
      num: num
    })
  },
  //排名跳转
  nageto(e) {
    wx.navigateTo({
      url: '/pages/findlist/contentxiang/contentxiang?id=' + e.currentTarget.dataset.id,
    })
  },

  //添加跳转
  addnageto() {
    wx.navigateTo({
      url: '/pages/findlist/findcontent/findcontent',
    })
  },

  //推荐
  tuijian(offset, limit) {
    // console.log(offset, limit)
    util.http.postJson("fn/user/get/admin",{
      'act': 'Found_foundRecommended',
      'offset': offset,
      'limit': limit
    }, function(res) {
      if (!res.data) {
        return;
      }

      //banner图片处理
      for (var i = 0; i < res.data.images.length; i++) {
        res.data.images[i].image = imageUrl + res.data.images[i].image
      }
      //shoplist图片处理
      for (var i = 0; i < res.data.shoplist.length; i++) {
        //判断头像是否有http
        var patt = /http/
        res.data.shoplist[i].headinfo = res.data.shoplist[i].headinfo || {};
        if (!patt.test(res.data.shoplist[i].headinfo.head)) {
          res.data.shoplist[i].headinfo.head = imageUrl + res.data.shoplist[i].headinfo.head
        }
        res.data.shoplist[i].coverImage = imageUrlfound + res.data.shoplist[i].image[0]
        if (res.data.shoplist[i].praises_state == null) {
          res.data.shoplist[i].praises_state = 0
        } else {
          res.data.shoplist[i].praises_state = 1
        }
      }
      this.setData({
        chateau: res.data.shoplist,
        imgUrls: res.data.images,
      })
    })
  },
  //排名
  paiming(offset, limit) {
    console.log(offset, limit)
    util.http.postJson("fn/user/get/admin",{
      'act': 'Found_foundRank',
      'offset': offset,
      'limit': limit
    }, function(res) {
      if (!res.data) {
        return;
      }
      //点赞
      for (var i = 0; i < res.data.shoplist.length; i++) {
        var patt = /http/
        if (!patt.test(res.data.shoplist[i].headinfo.head)) {
          res.data.shoplist[i].headinfo.head = imageUrl + res.data.shoplist[i].headinfo.head
        }
        res.data.shoplist[i].coverImage = imageUrl + res.data.shoplist[i].image[0]
        if (res.data.shoplist[i].praises_state == null) {
          res.data.shoplist[i].praises_state = 0
        } else {
          res.data.shoplist[i].praises_state = 1
        }
      }
      //排名图片
      let len = res.data.shoplist.length;
      for (let i = 0; i < len; i++) {
        if (i == 0) {
          res.data.shoplist[i].img = "http://qiniu-test.ishzm.com/jxb/img/salesRank/salesrank_numberone.png";
        } else if (i == 1) {
          res.data.shoplist[i].img = "http://qiniu-test.ishzm.com/jxb/img/salesRank/salesrank_numbertwo.png";
        } else if (i == 2) {
          res.data.shoplist[i].img = "http://qiniu-test.ishzm.com/jxb/img/salesRank/salesrank_numberthree.png";
        } else {
          res.data.shoplist[i].img = '';
        }
      }
      // console.log(res.data.shoplist)
      this.setData({
        chateau: res.data.shoplist,
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
    this.setData({
      sindex: 0,
      num: 0
    })
    this.tuijian(0, 10)

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
    console.log(111111)
    if (this.data.sindex == 0) {
      let chateaulength = this.data.chateau.length + 10
      this.tuijian(0, chateaulength);
    } else {
      let chateaulength = this.data.chateau.length + 10
      this.paiming(0, chateaulength);
    }
  },

  //子传父判断是否登录
  showTab: function(e) {
    console.log(e.detail);
    if (e.detail == 1) {
      wx.navigateTo({
        url: '/pages/newProduct/salell/salell'
      })
    }
  },
  // 左上角点击跳转
  skiphome() {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  //推荐下的商品列表
  myhose(e) {
    wx.navigateTo({
      url: '/pages/PersonalPub/myStore/myStore?shopuid=' + e.currentTarget.dataset.uid + "&shopname=" + e.currentTarget.dataset.name,
    })
  },

  onShareAppMessage: function() {

  }
})