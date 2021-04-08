const app = getApp();
const imageUrl = app.globalData.imageUrl;
const imageUrlfound = app.globalData.imageUrlfound;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headimage: '',
    inputValue: "",
    maskHidden: false,
    name: "",
    touxiang: "",
    code: "欢迎来到我的酒馆做客",
    bannerimgwidth: 0,
    cintentxiang: {},
    image: [],
    praise_state: 0,
    share: 0,
    praise: 0,      
    praises_state: 0,
    infoid: 100, //整条信息的id
    shopuid: 0,
    shopname: '',
    waiteruid: 0,
    title: '举报原因',
    id: 0, //该产品的id,
    whoreleaseuid: 0 //发布者的id

  },
  //详情转发点赞封装
  getusenum() {
    util.http.postJson("fn/user/get/admin",{
      'act': 'Presale_waitPartner',
      'offset': 0,
      'limit': 10
    }, function(res) {

    })
  },

  //跳转到店铺
  gotoshop(e) {
    wx.navigateTo({
      url: '/pages/PersonalPub/myStore/myStore?shopuid=' + e.currentTarget.dataset.shopuid + '&shopname=' + e.currentTarget.dataset.shopname,
    })
  },
  //点击头像跳转
  thisgeto() {
    if (this.data.whoreleaseuid == this.data.shopuid || this.data.whoreleaseid == this.data.waiteruid) {
      wx.navigateTo({
        url: '/pages/PersonalPub/myStore/myStore?shopuid=' + this.data.shopuid + "&waiteruid=" + this.data.waiteruid + "&shopname=" + this.data.shopname,
      })
    } else {

    }
  },

  //显示大图
  previewImage: function(e) {
    var current = e.target.dataset.item;
    console.log('w', current)
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.image // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getUserInfo({
      success: res => {
        console.log(res.userInfo, "huoqudao le ")
        this.setData({
          name: res.userInfo.nickName,
        })
        wx.downloadFile({
          url: res.userInfo.avatarUrl, //仅为示例，并非真实的资源
          success: function(res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              console.log(res, "reererererer")
              this.setData({
                touxiang: res.tempFilePath
              })
            }
          }
        })
      }
    })
    this.setData({
      height: util.getallheigth().clientHeight
    })
    // this.data.infoid = options.id
    // this.setData({ infoid :options.id})
    this.setData({
      bannerimgwidth: util.getallheigth().clientWidth * 0.75,
      infoid: options.id
    })
    console.log('options', this.data.id)
    util.http.postJson("fn/user/get/admin",{
      'act': 'Found_foundinfo',
      'id': options.id
    }, function(res) {
      if (res.data.foundinfo.goods == null) {
        // res.data.foundinfo.time = util.formatTimeByTs(res.data.foundinfo.time, 'Y.M.D h:m')
        //图片显示
        let image = []
        for (let i in res.data.foundinfo.image) {
          res.data.foundinfo.image[i] = imageUrlfound + res.data.foundinfo.image[i]
          image.push(res.data.foundinfo.image[i])
        }
        //头像处理
        var patt = /http/
        res.data.foundinfo.headinfo = res.data.foundinfo.headinfo || {head:''}
        let thisplayimage = res.data.foundinfo.headinfo.head
        if (!patt.test(thisplayimage)) {
          res.data.foundinfo.headinfo.head = imageUrl + thisplayimage
        }
        console.log('aaa', res.data.foundinfo.headinfo.head)
        //点赞处理
        if (res.data.foundinfo.praises_state == null) {
          res.data.foundinfo.praises_state = 0
        } else {
          res.data.foundinfo.praises_state = 1
        }
        this.setData({
          cintentxiang: res.data.foundinfo,
          image: image,
          shopname: res.data.foundinfo.headinfo.nickname,
          shopuid: res.data.foundinfo.shopuid,
          waiteruid: res.data.foundinfo.waiteruid, 
          id: res.data.foundinfo.goodsID,
          share: res.data.foundinfo.share,
          praise: res.data.foundinfo.praise,
          praises_state: res.data.foundinfo.praises_state,
          whoreleaseuid: res.data.foundinfo.uid,
          headimage: res.data.foundinfo.headinfo.head
        })
      } else {

        let bannerimg = res.data.foundinfo.goods.playimage.split(',')
        for (let j = 0; j < bannerimg.length; j++) {
          bannerimg[j] = imageUrl + bannerimg[j]
        }
        res.data.foundinfo.goods.playimage = bannerimg[0]
        res.data.foundinfo.time = util.formatTimeByTs(res.data.foundinfo.time, 'Y.M.D h:m')
        let image = []
        for (let i in res.data.foundinfo.image) {
          res.data.foundinfo.image[i] = imageUrlfound + res.data.foundinfo.image[i]
          image.push(res.data.foundinfo.image[i])
        }
        //头像处理
        var patt = /http/
        res.data.foundinfo.headinfo = res.data.foundinfo.headinfo || { head: '' }
        let thisplayimage = res.data.foundinfo.headinfo.head
        if (!patt.test(thisplayimage)) {
          res.data.foundinfo.headinfo.head = imageUrl + thisplayimage
        }
        // console.log('image', image)
        this.setData({
          cintentxiang: res.data.foundinfo,
          image: image,
          shopname: res.data.foundinfo.headinfo.nickname,
          shopuid: res.data.foundinfo.shopuid,
          waiteruid: res.data.foundinfo.waiteruid, //waiterid  ？
          id: res.data.foundinfo.goodsID,
          share: res.data.foundinfo.share,
          praise: res.data.foundinfo.praise,
          praise_state: res.data.foundinfo.praise_state
        })
      }
    })

  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function() {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle('red')
    context.fillRect(10, 10, 150, 75)
    context.draw()
    var path = "/img/myhavepub.png";
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    context.drawImage(path, 40, 16, 300, 75);
    var path1 = thisdata.headimage;
    if (!path1) {
      path1 = 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIaNvbLJmibTUYck4p4MTR9qlk4vQrC0nCIIjeO6esRCKBjlxJGiaXMNh7gQD4ox6oYlYNPO3EUy3yg/132'
    }
    console.log(path1, "path1")
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    var path2 = "/img/myhavepub.png";
    var pathnon = "/img/haibao_back.png";
    var path3 = "/img/youhuaduini.png";
    var path4 = "/img/squal.png";
    // var path5 = "/img/pubinage.png";
    var path6 = "/img/erweima.png";
    context.drawImage(pathnon, -50, -30, 600, 800);
    //不知道是什么原因，手机环境能正常显示
    // context.save(); // 保存当前context的状态
    var name = thisdata.cintentxiang.headinfo.nickname;
    //绘制名字
    context.setFontSize(24);
    context.setFillStyle('#333333');
    context.setTextAlign('center');
    context.fillText(name, 185, 340);
    context.stroke();
    //标语
    context.setFontSize(14);
    context.setFillStyle('#333333');
    context.setTextAlign('center');
    context.fillText("我有孤独和烈酒，是否愿意跟我走", 185, 370);
    context.stroke();
    //标语
    context.setFontSize(32);
    context.setFillStyle('#FFFFFF');
    context.setTextAlign('center');
    context.fillText("常来我的酒馆坐一坐", 185, 430);
    context.stroke();
    //绘制图片
    context.drawImage(path2, 40, 16, 300, 75);
    context.drawImage(path3, 40, 116, 300, 75);
    // context.drawImage(path5, 0, 156, 565, 775);
    context.drawImage(path6, 258, 518, 100, 100);
    //绘制左下角文字背景图
    context.drawImage(path4, 25, 520, 184, 82);
    context.setFontSize(12);
    context.stroke();
    context.setFontSize(12);
    context.stroke();
    context.setFontSize(12);
    context.stroke();
    //绘制头像
    context.arc(186, 246, 50, 0, 2 * Math.PI) //画出圆
    context.strokeStyle = "#ffe200";
    context.clip(); //裁剪上面的圆形
    context.drawImage(path1, 136, 196, 100, 100); // 在刚刚裁剪的园上画图
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function() {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function(res) {
          var tempFilePath = res.tempFilePath;
          this.setData({
            imagePath: tempFilePath,
            canvasHidden: true
          });
        },
        fail: function(res) {
          console.log(res);
        }
      });
    }, 200);
  },
  // 遮罩层隐藏。
  show: function() {
    this.setData({
      goodsOrderflag: true
    })
  },
  conceal: function() {
    this.setData({
      goodsOrderflag: false
    })
  },
  //推荐跳转
  tjnageto(e) {
    let thshopname=e.currentTarget.dataset.shopname 
    wx.navigateTo({
      url: '/pages/PersonalPub/WinePurchase/WinePurchase?shopuid=' + this.data.shopuid + "&waiteruid=" + this.data.waiteruid + "&shopname=" + thshopname + "&id=" + this.data.id,
    })
  },
  //举报
  jubao() {
    let reasonPopupe = this.selectComponent("#reasonPopupe");
    reasonPopupe.show(() => {});
  },
  //转发(分享)
  xqzhuanfa() {
    var _this = this
    console.log('aaaa', this.data.infoid)
    let thitime = setInterval(() => {

      let sharepath = wx.getStorageSync('sharepath')
      if (sharepath == 1) {
        wx.removeStorageSync('sharepath')
        util.http.postJson("fn/user/get/admin",{
          'act': 'Found_share',
          'id': this.data.infoid
        }, function(res) {
          if (res.ok) {
            wx.showToast({
              title: '分享成功' + ((res.data.getshare == 0) ? '' : ('，获得' + res.data.getshare + '积分')) + '!',
              icon: 'none',
              duration: 1000
            })
            _this.setData({
              share: _this.data.share + 1
            })
          }
          clearInterval(thitime)
        })
      }
    }, 1000)
  },
  onShareAppMessage: function(res) {
    return {
      title: _this.data.shopname + '的酒庄',
      desc: '单纯高粱酒江小白',
      path: '/pages/PersonalPub/myStore/myStore',
      withShareTicket: true
    }
  },
  //点赞
  xqdianzan() {
    if (this.data.praises_state == 0) {
      util.http.postJson("fn/user/get/admin",{
        'act': 'Found_praise',
        'id': this.data.infoid
      }, function(res) {
        if (res.ok) {
        //   debugger;
          wx.showToast({
            title: '点赞成功' + ((res.data.scores == 0) ? '' : ('，获得' + res.data.scores + '积分')) + '!',
            // title:'asfasdfasdfasdfasdasf',
            icon: 'none',
            duration: 2000
          })
          if (res.data.praises == null) {
            res.data.praises = 0
          } else {
            res.data.praises = 1
          }
          this.setData({
            praise: res.data.found.praise,
            praises_state: res.data.praises
          })
        }
      })
    } else {
      util.http.postJson("fn/user/get/admin",{
        'act': 'Found_unpraise',
        'id': this.data.infoid
      }, function(res) {
        if (res.data.praises == null) {
          res.data.praises = 0
        } else {
          res.data.praises = 1
        }
        this.setData({
          praise: res.data.found.praise,
          praises_state: res.data.praises
        })
      })
    }

  },

  //点击保存到相册
  baocun: function() {
    var _that = this
    wx.saveImageToPhotosAlbum({
      filePath: _thisdata.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定');
              util.http.postJson("fn/user/get/admin",{
                'act': 'Found_share',
                'id': _thisdata.infoid
              }, function (res) {
                if (res.ok) {
                  wx.showToast({
                    title: '分享成功' + ((res.data.getshare == 0) ? '' : ('，获得' + res.data.getshare + '积分')) + '!',
                    icon: 'none',
                    duration: 1000
                  })                  
                }
                
                })
              _this.setData({
                maskHidden: false
              })
            }
          },
          fail: function(res) {
            console.log(11111)
          }
        })
      }
    })
  },
  //点击生成
  formSubmit: function(e) {
    var that = this;
    this.setData({
      maskHidden: false
    });
    wx.showToast({
      title: '生成中...',
      icon: 'loading',
      duration: 1000
    });
    setTimeout(function() {
      wx.hideToast()
      thiscreateNewImg();
      this.setData({
        maskHidden: true
      });
    }, 1000)
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
    var that = this;
    wx.getUserInfo({
      success: res => {
        console.log(res.userInfo, "huoqudao le ")
        this.setData({
          name: res.userInfo.nickName,
        })
        wx.downloadFile({
          url: res.userInfo.avatarUrl, //仅为示例，并非真实的资源
          success: function(res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              console.log(res, "reererererer")
              this.setData({
                touxiang: res.tempFilePath
              })
            }
          }
        })
      }
    })
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
    return {
      title: "欢迎来到我的酒庄",
      success: function(res) {
        console.log(res, "转发成功")
      },
      fail: function(res) {
        console.log(res, "转发失败")
      }
    }
  }
})