const app = getApp();
const imageUrl = app.globalData.imageUrl;
const imageUrlfound = app.globalData.imageUrlfound;
const publicUrl = app.globalData.publicUrl;
const util = require('../../utils/util.js');
Page({
  data: {
    islogin: 1, //用于判断登录组件
    scroll_height: 600,
    open: false,
    // mark 是指原点x轴坐标
    mark: 0,
    // newmark 是指移动的最新点的x轴坐标 
    newmark: 0,
    show: false, //酒馆默认为显示
    community: 0, //社区默认为显示
    istoright: false,
    tophegth: 80,
    bigtophegth: 50,
    thisActive: true,
    nickName: '',
    getohoutai: false,
    avatarUrl: '',
    freezediamond: 0,
    remaindiamond: 0,
    sex: 0,
    hiddenName: false,
    isbannerimg: 0,
    homebannerimg: 'http://qiniu-test.ishzm.com/image/jpg/home_gif.gif',
    totalscore: {
      scores: 0,
      remainscores: 0
    },
    yestodayscore: '',
    totalwineDrill: 0,
    yestodaywineDrill: 0,
  },
  // animationData: {},
  showFlag: function() {
    this.setData({
      maskFlag: false,
      oilchooseFlag: true
    })
  }, 
  //消息框
  goxiaoXiInform() {
    this.setData({
      thisActive: false
    })
    wx.navigateTo({
      url: '/pages/PersonalPub/xiaoXiInform/xiaoXiInform'
    })
  },
  //我的积分跳转
  myjifen() {
    this.setData({
      thisActive: false
    })
    wx.navigateTo({
      url: '/pages/exChange/myJiFen/myJiFen?scores=' + this.data.totalscore.remainscores + "&yesscores=" + this.data.yestodayscore + "&freezetotal=" + this.data.totalscore.freezetotal
    })

  },
  //我的酒钻跳转
  myjiuzuan() {
    this.setData({
      thisActive: false
    })
    wx.navigateTo({
      url: '/pages/exChange/myJiuZuan/myJiuZuan?freezediamond=' + this.data.freezediamond + "&yestodaywineDrill=" + this.data.yestodaywineDrill + "&remaindiamond=" + this.data.remaindiamond
    })

  },
  //积分提现跳转
  integralWithdraw() {
    this.setData({
      thisActive: false
    })
    wx.navigateTo({
      url: '/pages/exChange/integralWithdraw/integralWithdraw?shopuid=' + wx.getStorageSync('userid')
    })

  },
  //   个人中心总购物车
  goshopcar() {
    wx.navigateTo({
      url: '/pages/PersonalPub/ShoppingCar/ShoppingCar'
    })
  },
  //店主社区
  shopkeepersq() {
    this.setData({
      thisActive: false
    })
    wx.switchTab({
      url: "/pages/square/square",
    })

  },
  //修改信息
  selectxx() {
    let name = this.data.nickName
    console.log('aa', this.data.nickName)
    this.setData({
      thisActive: false
    })
    wx.navigateTo({
      url: '/pages/PersonalPub/redactData/redactData?avatarUrl=' + this.data.avatarUrl + "&name=" + name + "&sex=" + this.data.sex
    })

  },
  //  意见反馈跳转
  yiJianFeedback() {
    this.setData({
      thisActive: false
    })
    wx.navigateTo({
      url: '/pages/exChange/yiJianFeedback/yiJianFeedback'
    })
  },
  //  联系客服跳转
  lianXiService() {
    this.setData({
      thisActive: false
    })
    wx.navigateTo({
      url: '/pages/exChange/lianXiService/lianXiService'
    })
  },
  //  交易所跳转
  goexchangeSuo() {
    this.setData({
      thisActive: false
    })
    wx.switchTab({
      url: '/pages/exchangeSuo/exchangeSuo',
    })
  },
  // 点击左上角小图标事件
  tap_ch: function(e) {
    console.log('e', e)
    this.setData({
      open: true,
      hiddenName: true,
    });
    let role = wx.getStorageSync('role')
    this.setData({
      community: role
    })
  },
  // 右侧小图标事件
  zuoji() {
    this.setData({
      hiddenName: false,
      open: false
    })
  },
  //宇宙交易中心
  jiaoyi() {
    // wx.removeStorageSync('phone')
  },
  // //跳转到区块链
  // getoqklian() {
  //   wx.navigateTo({
  //     url: "/pages/quKuaiLian/quKuaiLian",
  //   })
  // },
  // //跳转到区块链浏览器
  getoqkliansee(e) {
    console.log('e', e)
    if (e.currentTarget.dataset.name == '点击登陆') {
      this.setData({
        hiddenName: false,
        open: false
      })
      let popup = this.selectComponent("#popup");
      popup.show(() => {
        // console.log('aa',cb)
        // debugger;
        var patt = /http/
        let thisplayimage = wx.getStorageSync('userInfo').avatarUrl
        if (!patt.test(thisplayimage)) {
          thisplayimage = imageUrl + thisplayimage
        }
          this.getuitreq();
          this.setData({
              hiddenName: true,
               open: true,
              community: wx.getStorageSync('role')
          })
        // this.setData({
        //   'nickName': wx.getStorageSync('userInfo').nickName,
        //   'avatarUrl': thisplayimage,
        //   'sex': wx.getStorageSync('userInfo').gender,
        //   hiddenName: true,
        //   open: true,
        //   community: wx.getStorageSync('role')
        // });
      })
    }
  },
  nonpayment(e) {
    this.setData({
      thisActive: false
    })
    wx.navigateTo({
      url: '/pages/PersonalPub/orderConfirmation/orderConfirmation?index=' + e.currentTarget.dataset.index
    })
  },
  // 我的酒馆
  mytavern() {
    if (wx.getStorageSync('role') > 1) {
      this.setData({
        thisActive: false
      })
      wx.navigateTo({
        url: '/pages/PersonalPub/myChateau/myChateau'
      })
    } else if (wx.getStorageSync('role') == 1) {
      this.setData({
        thisActive: false
      })
      wx.navigateTo({
        url: '/pages/PersonalPub/myChateauXer/myChateauXer'
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您还未成为店主，无法进入我的酒馆。',
        showCancel: false
      });
    }
  },
  //店主社区
  dianzhusequ() {
    if (wx.getStorageSync('phone')) {}
  },
  //个人酒店
  gerenjiu() {
    if (wx.getStorageSync('role') == 2) {
      this.setData({
        thisActive: false
      })
      wx.navigateTo({
        url: '/pages/PersonalPub/myChateau/myChateau'
      })
    } else if (wx.getStorageSync('role') == 1) {
      this.setData({
        thisActive: false
      })
      wx.navigateTo({
        url: '/pages/PersonalPub/myChateauXer/myChateauXer'
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您还未成为店主，无法进入我的酒馆。',
        showCancel: false
      });
    }
  },
  tap_start: function(e) {
    // touchstart事件
    // 把手指触摸屏幕的那一个点的 x 轴坐标赋值给 mark 和 newmark
    this.data.mark = this.data.newmark = e.touches[0].pageX;
  },

  tap_drag: function(e) {
    // touchmove事件
    this.data.newmark = e.touches[0].pageX;

    // 手指从左向右移动
    if (this.data.mark + 10 <= this.data.newmark) {
      this.data.istoright = true;
    }

    // 手指从右向左移动
    if (this.data.mark - 10 > this.data.newmark) {
      this.data.istoright = false;
    }
    this.data.mark = this.data.newmark;
  },

  tap_end: function(e) {
    //debugger;
    console.log('22222', this.data.istoright)
    this.getuitreq()
    let role = wx.getStorageSync('role')
    this.setData({
      community: role
    })
    // touchend事件
    this.data.mark = 0;
    this.data.newmark = 0;
    // debugger;
    // 通过改变 open 的值，让主页加上滑动的样式
    if (this.data.open == true) {

      this.setData({
        hiddenName: false,
        open: false
      });
    } else {
      if (this.data.istoright) {
        this.setData({
          hiddenName: true,
          open: true
        });
      } else {
        this.setData({
          hiddenName: false,
          open: false
        });
      }
    }
  },
  //没有状态是请求
  getuitreq() { 
    util.http.postJson("auth/getUserInfo",{"id":1}, (res) =>{
      if (res.ok) {
        var patt = /http/
        let thisplayimage = wx.getStorageSync('userInfo').avatarUrl
        if (!patt.test(thisplayimage)) {
          thisplayimage = imageUrl + thisplayimage
        }
        var uid = wx.getStorageSync("userid");
        this.setData({
          'nickName': wx.getStorageSync('userInfo').nickName,
          'avatarUrl': thisplayimage,
          freezediamond: res.data.freezediamond||"",
          remaindiamond: res.data.remaindiamond||"",
          totalscore: uid ? res.data.totalscore : {
            remainscores: 0,
            freezetotal: 0,
            scores: 0
          },
          yestodayscore: uid ? res.data.yestodayscore : 0,
          totalwineDrill: res.data.totalwineDrill||"",
          yestodaywineDrill: res.data.yestodaywineDrill||"",
          pushinfo: res.data.infos||""
        });
      } else {
        this.setData({
          'nickName': '点击登录',
          'avatarUrl': '',
          freezediamond: 0,
          remaindiamond: 0,
          yestodayscore: 0,
          totalwineDrill: 0,
          yestodaywineDrill: 0,
          pushinfo: ''
        });
      }
    },function fail(res){
      // debugger;
    });
  },

  onLoad: function(options) {
    //图片动画效果
    // let smalltop = (util.getallheigth().clientHeight) * 0.21
    // let bigtophegth = (util.getallheigth().clientHeight) * 0.38
    // this.setData({
    //   tophegth: smalltop,
    //   bigtophegth: bigtophegth
    // })
    // console.log('aaa', this.data.tophegth)
    // var animation = wx.createAnimation({
    //   duration: 1300,
    //   timingFunction: 'ease'
    // });
    // var bihanimation = wx.createAnimation({
    //   duration: 1300,
    //   timingFunction: 'ease'
    // });
    // var aa = 0
    // let thissmalltop = smalltop / 2
    // let thisbigtophegth = bigtophegth / 2;
    // setInterval(() => {
    //   if (!this.data.thisActive)
    //     return;

    //   if (aa == 0) {
    //     aa = 1
    //     animation.top(thissmalltop + 5).step()
    //     bihanimation.top(thisbigtophegth + 5).step()
    //     this.setData({
    //       ani: animation.export(),
    //       bigani: bihanimation.export()
    //     })
    //   } else {
    //     bihanimation.top(thisbigtophegth).step()
    //     animation.top(thissmalltop).step()
    //     this.setData({
    //       ani: animation.export(),
    //       bigani: bihanimation.export()
    //     })
    //     aa = 0
    //   }
    // }, 1300)
  },

  //加入小二
  joinWaiter: function(e) {
    var _this = this;return;
    util.http.postJson("fn/waiter/select",{
      'args': {},
      'page': 1,
      'pageSize': 10
    }, function(res) {
      if (!res.data) {
        wx.showToast({
          title: '您还不符合申请小二的资格，请到酒市购买产品',
          icon: 'none',
          duration: 2000
        })
        setTimeout(() => {
          _this.setData({
            thisActive: false
          })
          wx.reLaunch({
            url: '/pages/square/square'
          })
        }, 1000)
      } else {
        _this.setData({
          thisActive: false
        })
        wx.navigateTo({
          url: '/pages/Waiter/joinList/joinWaiterList',
        })
      }
    })
  },
  getinfo() {
    if (wx.getStorageSync('userInfo')) {
      //判断头像是否有http
      var patt = /http/
      let thisplayimage = wx.getStorageSync('userInfo').avatarUrl
      if (!patt.test(thisplayimage)) {
        thisplayimage = imageUrl + thisplayimage
      }
      var userinfo = wx.getStorageSync('userInfo'); 
      this.setData({
        'nickName': userinfo.nickName,
        'avatarUrl': thisplayimage,
        'sex': userinfo.gender
      });
      this.getuitreq()
    } else {
      util.authinfo()
    }

    this.setData({
      thisActive: true
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
    console.log(!wx.getStorageSync('userinfo'));
    if (!wx.getStorageSync('userinfo')){
      util.getuserinfo();
    }
    let userinfo = wx.getStorageSync('userinfo');
    this.setData({
      'nickName': userinfo.userInfo.nickName,
      'avatarUrl': userinfo.userInfo.avatarUrl,
      'sex': userinfo.userInfo.gender
    });
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

  //子传父判断是否登录




})