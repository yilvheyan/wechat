const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    sindex: 0,
    isdata: 0, //是否有数据
    timer: '',
    message: [{
        id: '0',
        text: "季度排名"
      },
      {
        id: '1',
        text: '上季度奖励名单'
      }
    ],
    numberlist: [], //排名列表
    showYour: false,
    mineshop: '', //店铺排名中的个人信息
    imageUrl: imageUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.ranking(0, 10),
      this.data.timer = setInterval(() => {
        this.ranking(0, 10)
      }, 60000 * 60 * 4)

  },
  //销量排名
  ranking(offset, limit) {
    util.http.postJson("fn/user/get/admin",{
      'act': 'Shop_shopRank',
      'offset': offset,
      'limit': limit
    }, function(res) {
      if (res.ok) {
        console.log('aa', typeof(res.data.mineshop))
        var arr = Object.keys(res.data.mineshop);
        if (arr.length == 0) {
          // console.log('aa', 111111)
          // let headimage = wx.getStorageSync('userInfo').avatarUrl
          var patt = /http/
          let thisplayimage = wx.getStorageSync('userInfo').avatarUrl
          if (!patt.test(thisplayimage)) {
            thisplayimage = imageUrl + thisplayimage
          }
          this.setData({
            showYour: false,
            headimg: thisplayimage,
            wxname: wx.getStorageSync('userInfo').nickName,
          });
        } else {
          var patt = /http/
          let thisplayimage = res.data.mineshop[0].head
          if (!patt.test(thisplayimage)) {
            res.data.mineshop[0].head = imageUrl + thisplayimage
          }
          this.setData({
            showYour: true,
            headimg: res.data.mineshop[0].head,
            wxname: res.data.mineshop[0].name,
            rownum: res.data.mineshop[0].rownum
          });
        }
        if (res.data.shoplist.length == 0) {
          this.setData({
            isdata: 0
          })
          return
        }
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
          //图片暂时不写
          //处理图片
          if (!res.data.shoplist[i].icon && res.data.shoplist[i].icon.length == 0) {
            res.data.shoplist[i].image = imageUrl + res.data.shoplist[i].image
          } else {
            res.data.shoplist[i].image = imageUrl + res.data.shoplist[i].icon
          }

        }
        for (var i = 0; i < res.data.shoplist.length; i++) {
          var patt = /http/
          let thisplayimage = res.data.shoplist[i].head
          if (!patt.test(thisplayimage)) {
            res.data.shoplist[i].head = imageUrl + thisplayimage
          }
        }
        console.log('mineshop'.data.mineshop)
        this.setData({
          numberlist: res.data.shoplist,
          isdata: 1
        });
      } else {
        this.setData({
          isdata: 0
        })
      }
    })
  },

  //上季度奖励
  lastshopRank(offset, limit) {
    util.http.postJson("fn/user/get/admin",{
      'act': 'Shop_lastshopRank',
      'offset': offset,
      'limit': limit
    }, function(res) {
      if (res.ok) {
        var arr = Object.keys(res.data.mineshop);
        if (arr.length == 0) {
          var patt = /http/
          let thisplayimage = wx.getStorageSync('userInfo').avatarUrl
          if (!patt.test(thisplayimage)) {
            thisplayimage = imageUrl + thisplayimage
          }
          this.setData({
            showYour: false,
            headimg: thisplayimage,
            wxname: wx.getStorageSync('userInfo').nickName,
          });
        } else {
          var patt = /http/
          let thisplayimage = res.data.mineshop[0].head
          if (!patt.test(thisplayimage)) {
            res.data.mineshop[0].head = imageUrl + thisplayimage
          }
          this.setData({
            showYour: true,
            headimg: res.data.mineshop[0].head,
            wxname: res.data.mineshop[0].name,
            rownum: res.data.mineshop[0].rownum
          });
        }
        if (res.data.shoplist.length == 0) {
          this.setData({
            isdata: 0
          })
          return
        }
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
          var patt = /http/
          let thisplayimage = res.data.shoplist[i].head
          if (!patt.test(thisplayimage)) {
            res.data.shoplist[i].head = imageUrl + thisplayimage
          }
          //图片暂时不写
          if (!res.data.shoplist[i].icon && res.data.shoplist[i].icon.length == 0) {
            res.data.shoplist[i].image = imageUrl + res.data.shoplist[i].image
          } else {
            res.data.shoplist[i].image = imageUrl + res.data.shoplist[i].icon
          }
        }
        console.log('mineshop'.data.mineshop)
        this.setData({
          numberlist: res.data.shoplist,
          isdata: 1
        });
      } else {
        this.setData({
          isdata: 0
        })
      }
    })
  },


  //跳转到店铺
  getoshop(e) {
    wx.navigateTo({
      url: '/pages/PersonalPub/myStore/myStore?shopuid=' + e.currentTarget.dataset.uid + "&shopname=" + e.currentTarget.dataset.name,
    })
  },





  //季度排名，附上季度奖励切换按钮
  salesrank_ch: function(e) {
    let num = e.target.id;
    console.log(num)
    this.setData({
      sindex: num,
      num: num
    })
    if (num == 0) {
      clearInterval(this.data.timer)
      this.ranking(0, 10)
      this.data.timer = setInterval(() => {
        this.ranking(0, 10)
      }, 60000 * 60 * 4)
    }
    if (num == 1) {
      console.log(1111)
      this.lastshopRank(0, 10)
      this.setData({
        sindex: num,
        num: num,
        isdata: 0
      })
    }
  },
  // 左上角点击跳转到home
  skiphome() {
    wx.switchTab({
      url: '/pages/square/square'
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
    if (this.data.sindex == 0) {
      let length = this.data.numberlist.length
      this.ranking(0, length + 10)
    } else {
      let length = this.data.numberlist.length
      this.lastshopRank(0, length + 10)
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})