// pages/tuikuan/tuikuan.js
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    whogeto: '',
    shopuid: 0,
    reasonid: 0,
    allmoney: 0,
    tihuoaddress: {},
    addrid: 0,
    num: 0,
    open: false,
    orderpopupimg: false,
    orderpopupic: true,
    clock: '',
    imageUrl: imageUrl,
    peopleinfohead: '',
    peopleinfoname: '',
    id: 0,
    orderid: 0,
    yinsuid: 100, //退款因素id
    popuplist: [], //退款原因列表
    image: [
      "http://qiniu-test.ishzm.com/jxb/img/findlist_xq/addimg.png",
    ],
    reason: '请选择退款原因',
    waiteruid: 0,
    winordjudge: 0, //判断商品是否从购物车来， 是：100， 否：0
    packagepostage: '包邮' //运费包邮
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.id = options.orderid
    this.data.orderid = options.orderid
    this.data.whogeto = options.whogeto
    console.log('options', options)
    //获取
    if (options.whogeto == 'yushou') {
      this.yushoufengzhuang({
        'act': 'Presale_orderinfo',
        "orderid": options.orderid
      })
    } else {
      this.jiushufeng({
        'act': 'Shop_orderinfo',
        "orderid": options.orderid
      })
    }

  },


  refundclickPup: function() {
    util.http.postJson("fn/user/get/admin",{
      'act': 'Shop_cancelReason',
    }, function(res) {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].orderpopupic = false
      }
      this.setData({
        popuplist: res.data
      })
    })

    let _that = this;
    if (!_thisdata.click) {
      _this.setData({
        click: true,
      })
    }
    if (_thisdata.option) {
      _this.setData({
        option: false,
      })
      // 关闭显示弹窗动画的内容，不设置的话会出现：点击任何地方都会出现弹窗，就不是指定位置点击出现弹窗了
      setTimeout(() => {
        _this.setData({
          click: false,
        })
      }, 100)
    } else {
      _this.setData({
        option: true
      })
    }
  },
  // 左上返回
  skiphome() {
    var pages = getCurrentPages(); // 当前页面
    var beforePage = pages[pages.length - 2];
    wx.navigateBack({
      success: function() {
        beforePage.onLoad(); // 执行前一个页面的onLoad方法
      }
    });
  },

  //酒市详情封装
  jiushufeng(json) {
    let data = []
    var _this = this
    util.http.postJson("fn/user/get/admin",json, function(res) {
      for (let i = 0; i < res.data.length; i++) {
        for (let j = 0; j < res.data[i].order.length; j++) {
          let bannerimg = res.data[i].order[j].goodsinfo.playimage.split(',')
          for (let k = 0; k < bannerimg.length; k++) {
            bannerimg[k] = imageUrl + bannerimg[k]
          }
          res.data[i].order[j].goodsinfo.playimage = bannerimg[0]
          // res.data[i].order[j].goodsinfo.playimage = imageUrl + res.data[i].order[j].goodsinfo.playimage
        }
      }
      for (let i = 0; i < res.data.length; i++) {
        let allmoney = 0;
        for (let j = 0; j < res.data[i].order.length; j++) {
          allmoney += (res.data[i].order[j].goodsinfo.price * res.data[i].order[j].num)
        }
        res.data[i].allmoney += allmoney
      }
      console.log(res.data[0].allmoney)
      let nowallmoney = res.data[0].money - thisdata.newpeople
      if (json.act == 'Shop_orderinfo') { //代发货酒市
        var patt = /http/
        let thisplayimage = res.data[0].shophead.head
        if (!patt.test(thisplayimage)) {
          res.data[0].shophead.head = imageUrl + thisplayimage
        }
        this.setData({
          peopleinfohead: res.data[0].shophead.head,
          peopleinfoname: res.data[0].shopname.name,
          shopmessage: res.data[0].order,
          allmoney: res.data[0].money,
          nowallmoney: nowallmoney,
          orderid: res.data[0].id
        })
      }
    })
  },

  //预售详情封装
  yushoufengzhuang(json) {
    let data = []
    var _this = this
    util.http.postJson("fn/user/get/admin",json, function(res) {
      //给图片加路径
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].goodsinfo.playimage = imageUrl + res.data[i].goodsinfo.pic
        res.data[i].kolinfo.headpic = imageUrl + res.data[i].kolinfo.headpic
      }
      //算价格和总价
      let allmoney = 0;
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].num = res.data[i].buynum
        allmoney += (res.data[i].goodsinfo.price * res.data[i].buynum)
      }
      res.data[0].allmoney = allmoney
      console.log(res.data[0].allmoney)
      res.data[0].time = util.formatTimeByTs(res.data[0].time, 'Y.M.Dh:m:s');
      this.setData({
        peopleinfohead: res.data[0].kolinfo.headpic,
        peopleinfoname: res.data[0].kolinfo.name,
        shopmessage: res.data,
        allmoney: res.data[0].allmoney,
        sn: res.data[0].sn,
        xiadantime: res.data[0].time
      })
    })
  },
  //选择退款原因
  selectList(e) {
    console.log(e)
    var that = this;
    // 获取选中的radio索引
    var id = e.currentTarget.dataset.id;
    // this.data.reasonid = e.currentTarget.dataset.id
    let item = e.currentTarget.dataset.item;
    this.data.yinsuid = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index;
    console.log('index', index)
    console.log('id', id)
    // 获取到商品列表数据
    var shopmessage = this.data.popuplist;
    for (let i = 0; i < shopmessage.length; i++) {
      shopmessage[i].orderpopupic = false
    }
    shopmessage[index].orderpopupic = true
    this.setData({
      popuplist: shopmessage,
      reason: item
    })
    let _that = this;
    if (!_thisdata.click) {
      _this.setData({
        click: true,
      })
    }
    if (_thisdata.option) {
      _this.setData({
        option: false,
      })
      // 关闭显示弹窗动画的内容，不设置的话会出现：点击任何地方都会出现弹窗，就不是指定位置点击出现弹窗了
      setTimeout(() => {
        _this.setData({
          click: false,
        })
      }, 100)
    } else {
      _this.setData({
        option: true
      })
    }
    // shopmessage[index].orderpopupic = !shopmessage[index].orderpopupic;      
    //获取选中原因
  },

  //提交
  tuimney() {
    if (this.data.whogeto == 'yushou') {
      this.tuimneyll('Presale_chooseReason')
    } else {
      this.tuimneyll('Shop_chooseReason')
    }
  },
  //提交
  tuimneyll(act) {
    console.log('aa', this.data.shopmessage[0].id, this.data.orderid)
    var _this = this
    if (this.data.yinsuid == 100) {
      wx.showToast({
        title: '请先选择退款原因',
        icon: 'none',
      })
      return;
    }
    this.data.image.pop()
    if (this.data.image.length != 0) {
      let thisimg = 0;
      let imagelength = this.data.image.length
      let imagearry = []
      for (let i = 0; i < this.data.image.length; i++) {
        var _this = this
        wx.uploadFile({
          url: publicUrl, //仅为示例，非真实的接口地址
          filePath: _this.data.image[i],
          name: 'file',
          formData: {
            'act': 'found_uploadimg',
          },
          success(res) {
            imagearry.push(res.data)
            if (imagelength == imagearry.length) {
              thisimg = 1
            }
          },
          fail(res) {
            console.log('res', res)
          }
        })
      }
      let thitime = setInterval(() => {
        console.log(thisimg)
        this.setData({
          iscolorgray: true
        })
        // console.log('this.data.id', this.data.id)
        if (thisimg == 1) {
          thisimg = 0
          console.log('aa', this.data.id, imagearry, this.data.yinsuid)
          util.http.postJson("fn/user/get/admin",{
            'act': act,
            'orderid': this.data.id,
            'image': imagearry,
            'id': this.data.yinsuid
          }, function(res) {
            if (res.ok) {
              if (_this.data.whogeto == 'yushou') {
                wx.navigateTo({
                  url: '/pages/newProduct/refund/refund?orderid=' + _this.data.shopmessage[0].id + '&tuimoney=' + _this.data.shopmessage[0].allmoney + '&whogeto=yushou'
                })
              }
              if (_this.data.whogeto == 'jiushu') {
                console.log(_this.data.shopmessage[0])
                wx.navigateTo({
                  url: '/pages/newProduct/refund/refund?orderid=' + _this.data.orderid + '&tuimoney=' + _this.data.allmoney + '&whogeto=jiushi'
                })
              }
              clearInterval(thitime)
            } else {
              wx.showModal({
                title: '提交失败',
              })
              return;
            }
            clearInterval(thitime)
          })
        }
      }, 1000)
    } else {
      util.http.postJson("fn/user/get/admin",{
        'act': act,
        'orderid': this.data.id,
        'image': [],
        'id': this.data.yinsuid
      }, function(res) {
        if (res.ok) {
          if (_this.data.whogeto == 'yushou') {
            wx.navigateTo({
              url: '/pages/newProduct/refund/refund?orderid=' + _this.data.shopmessage[0].id + '&tuimoney=' + _this.data.shopmessage[0].allmoney + '&whogeto=yushou'
            })
          }
          if (_this.data.whogeto == 'jiushu') {
            console.log(_this.data.shopmessage[0])
            wx.navigateTo({
              url: '/pages/newProduct/refund/refund?orderid=' + _this.data.orderid + '&tuimoney=' + _this.data.allmoney + '&whogeto=jiushi'
            })
          }
        } else {
          wx.showModal({
            title: '提交失败',
          })
          return;
        }
      })
    }
  },
  //   上传凭证选择图片
  chosepic(e) {
    // console.log('e', e.currentTarget.dataset.img)
    // console.log('e', e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index
    if (e.currentTarget.dataset.img == "http://qiniu-test.ishzm.com/jxb/img/findlist_xq/addimg.png") {
      if (this.data.image.length == 4) {
        wx.showToast({
          title: '最多为3张图片',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      let image = this.data.image
      let _this = this
      wx.chooseImage({
        count: 9,
        sizeType: ['original'],
        sourceType: ['album', 'camera'],
        success(res) {
          image.pop()
          image = image.concat(res.tempFilePaths)
          image.push("http://qiniu-test.ishzm.com/jxb/img/findlist_xq/addimg.png")
          console.log('image', image)
          _this.setData({
            image: image
          })
        }
      })
    }
  }
})