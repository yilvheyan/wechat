const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../utils/util.js');
//机型判断
wx.getSystemInfo({
  success: function(res) {
    //model中包含着设备信息
    console.log(res.model)
    var model = res.model
    if (model.search('iPhone X') != -1) {
      app.globalData.isIpx = true;
    } else {
      app.globalData.isIpx = false;
    }
  }
})
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: imageUrl,
    page:0,
    size:10,
    btuBottom: "",
    hidden: true,       
    loadingData: false,
    sindex: 0, //推荐0，附近1的切换  默认排名
    imgUrls: [],
    nowadree: '', //当前所在城市
    getnowadree: '', //获取当前位置
    num: 0,
    huantuijian: 0,
    huanfujin: 0,
    message: [{
        id: '0',
        text: "推荐"
      },

      {
        id: '1',
        text: '附近'
      }
    ],
    chateau: [
      
    ]
  },
  //轮播点击事件
  // squarecl(e) {
  //   console.log('e', e);
  //   this.onepageget(e.currentTarget.dataset.id);
  //   this.threepageget(e.currentTarget.dataset.id);
  //   this.twopageget(e.currentTarget.dataset.id);
  // },
  onLoad: function(options) {
        
  },
 //获取店铺
  getshop(page,size){
    util.http.postJson("auth/getshop", {
      page:page,
      pageSize:size
    }, (res) => {
      if (res.data&&res.data.length >0) {
        for (var i = 0; i < res.data.shoplist.length; i++) {          
          let num = 0
          for (let j = 0; j < res.data.shoplist[i].orders.length; j++) {
            num += res.data.shoplist[i].orders[j].nums
          }
          res.data.shoplist[i].num = num
          //处理图片
          if (!res.data.shoplist[i].icon && res.data.shoplist[i].icon.length == 0) {
            res.data.shoplist[i].image = imageUrl + res.data.shoplist[i].image
          } else {
            res.data.shoplist[i].image = imageUrl + res.data.shoplist[i].icon
          }
        }
      };
      this.setData({
        chateau: res.data.shoplist
      })
    })
  },
  //获取banner
  getbanner(){   
    util.http.postJson("auth/getbanner", {
      
    },  (res)=> {    
      if(res.data){
        this.setData({
          imgUrls: res.data
        })     
      }      
    })
  },
  //推荐，附近切换按钮
  onclickList: function(e) {
    let num = e.target.id;
    this.setData({
      chateau: []
    });
    if (num == 1) {
      this.fujin(0, 10, this.data.getnowadree)
    }
    if (num == 0) {
      this.tuijian(0, 10)
    }
    this.setData({
      sindex: num,
      num: num
    })
  },
  //排名点击
  choicecli() {
    wx.navigateTo({
      url: '/pages/newProduct/salesRank/salesRank',
    })
  },
  //换一批(没用)
  inabatchcli() {
    if (this.data.sindex == 0) {
      this.tuijian(this.data.huantuijian, 10)
      this.data.huantuijian += 10
    } else {
      this.fujin(this.data.huanfujin, 10, this.data.nowadree)
      this.data.huanfujin += 10
    }
  },

  //附近
  fujin(offset, limit, address) {
    console.log('fujin', offset, limit, address)
    if (address == '') {
      util.getAddress();
      let time = setInterval(() => {
        if (wx.getStorageSync('address_component') != '') {
          this.setData({
            nowadree: wx.getStorageSync('address_component').city,
          })
          console.log(this.data.nowadree)
          console.log(offset, limit)
          if (this.data.nowadree != '') {
            wx.removeStorageSync('address_component')
            clearInterval(time)
            util.http.postJson("fn/user/get/admin",{
              'act': 'Shop_nearShop',
              'offset': offset,
              'limit': limit,
              'address': this.data.nowadree
              // 'address': '上海市'
            }, function(res) {
              if (res.ok) {
                // console.log('111', res.data.shoplist)
                // console.log(!res.data.shoplist)
                if (!res.data.shoplist) {
                  return;
                }


                for (var i = 0; i < res.data.shoplist.length; i++) {
                  //处理图片
                  if (!res.data.shoplist[i].icon && res.data.shoplist[i].icon.length == 0) {
                    res.data.shoplist[i].image = imageUrl + res.data.shoplist[i].image
                  } else {
                    res.data.shoplist[i].image = imageUrl + res.data.shoplist[i].icon
                  }
                  //头像处理
                  var patt = /http/
                  let thisplayimage = res.data.shoplist[i].heads.head
                  if (!patt.test(thisplayimage)) {
                    res.data.shoplist[i].heads.head = imageUrl + thisplayimage
                  }

                  let num = 0
                  for (let j = 0; j < res.data.shoplist[i].orders.length; j++) {
                    num += res.data.shoplist[i].orders[j].nums
                  }
                  res.data.shoplist[i].num = num
                }
                console.log('aaaa', res.data.shoplist)

                if (res.data.shoplist.length < 10)
                  thisdata.huanfujin = 0;
                this.setData({
                  chateau: res.data.shoplist,
                })
              } else {
                this.setData({
                  chateau: []
                })
              }

            })
          }

        }
      }, 500)
    } else {
      util.http.postJson("fn/user/get/admin",{
        'act': 'Shop_nearShop',
        'offset': offset,
        'limit': limit,
        'address': address
      }, function(res) {
        if (res.ok) {
          console.log(res.data.shoplist)
          if (!res.data.shoplist) {
            return;
          }
          for (var i = 0; i < res.data.shoplist.length; i++) {
            //处理图片
            if (!res.data.shoplist[i].icon && res.data.shoplist[i].icon.length == 0) {
              res.data.shoplist[i].image = imageUrl + res.data.shoplist[i].image
            } else {
              res.data.shoplist[i].image = imageUrl + res.data.shoplist[i].icon
            }
          }
          for (var i = 0; i < res.data.shoplist.length; i++) {
            //头像处理
            var patt = /http/
            let thisplayimage = res.data.shoplist[i].heads.head
            if (!patt.test(thisplayimage)) {
              res.data.shoplist[i].heads.head = imageUrl + thisplayimage
            }
            let num = 0
            for (let j = 0; j < res.data.shoplist[i].orders.length; j++) {
              num += res.data.shoplist[i].orders[j].nums
            }
            res.data.shoplist[i].num = num
            // res.data.shoplist[i].image = imageUrl + res.data.shoplist[i].image
          }
          console.log('aaaall', res.data.shoplist)
          if (res.data.shoplist.length < 10)
            thisdata.huanfujin = 0;
          this.setData({
            chateau: res.data.shoplist,
          })
        } else {
          this.setData({
            chateau: []
          })
        }

      })
    }
  },



  //推荐
  tuijian(offset, limit) {
    console.log(offset, limit)
    util.http.postJson("fn/user/get/admin",{
      'act': 'Shop_shopRecommended',
      'offset': offset,
      'limit': limit
    }, function(res) {
      console.log(res.data.shoplist)
      for (var i = 0; i < res.data.shoplist.length; i++) {
        if (!res.data.shoplist[i].icon && res.data.shoplist[i].icon.length == 0) {
          res.data.shoplist[i].image = imageUrl + res.data.shoplist[i].image
        } else {
          res.data.shoplist[i].image = imageUrl + res.data.shoplist[i].icon
        }
      }
      for (var i = 0; i < res.data.shoplist.length; i++) {
        //头像处理
        var patt = /http/
        let thisplayimage = res.data.shoplist[i].heads.head
        if (!patt.test(thisplayimage)) {
          res.data.shoplist[i].heads.head = imageUrl + thisplayimage
        }
        let num = 0
        for (let j = 0; j < res.data.shoplist[i].orders.length; j++) {
          num += res.data.shoplist[i].orders[j].nums
        }
        res.data.shoplist[i].num = num
      }
      if (res.data.shoplist.length < 10)
        thisdata.huantuijian = 0;
      this.setData({
        chateau: res.data.shoplist,
      })
    })
  },
  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function() {
    console.info('onReachBottom');
    var hidden = this.data.hidden,
      loadingData = this.data.loadingData,
      that = this;
    if (hidden) {
      this.setData({
        hidden: false
      });
      console.info(this.data.hidden);
    }
    if (loadingData) {
      return;
    }
    this.setData({
      loadingData: true
    });
    // 加载数据,模拟耗时操作  

    wx.showLoading({
      title: '数据加载中...',
    });

    setTimeout(function() {
      thisloadData(true, () => {
        this.setData({
          hidden: true,
          loadingData: false
        });
        wx.hideLoading();
      });
      console.info('上拉数据加载完成.');
    }, 1000);

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
      height: util.getallheigth().clientHeight
    })
    let isPhone = app.globalData.isIpx;
    if (isPhone) {
      this.setData({
        btuBottom: "68rpx",
      })
    }
    this.getbanner();
    this.getshop(1, 10);
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
    //wx.stopPullDownRefresh()  //停止下拉刷新
    //wx.startPullDownRefresh() //开始下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let length = this.data.chateau.length
    if (this.data.sindex == 0) {
      this.tuijian(0, length + 10)
    }
    console.log('11111', this.data.nowadree)
    if (this.data.sindex == 1) {
      this.fujin(0, length + 10, this.data.nowadree)
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
  // 新品预售专区
  presellClick(e) {
    wx.navigateTo({
      url: '/pages/newProduct/salell/salell'
    })
    // var phone = wx.getStorageSync('phone')
    // if (wx.getStorageSync('phone')) {

    // } else {

    //     login.show(function() {
    //         wx.navigateTo({
    //             url: '/pages/newProduct/salell/salell'
    //         })
    //     });
    // }
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