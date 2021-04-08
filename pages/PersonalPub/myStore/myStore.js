// myStoremyStore// pages/PersonalPub/myStore/myStore.js
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
const upng = require('../../../utils/UPNG.js')
const pako = require('../../../utils/pako.min.js')
const scene = app.globalData.scene;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pxwidth: 375.0,
    aashopname: '', //店主名字，用于分享和我的小二
    shopuid: 0,
    headerimg: '',
    userid: 0,
    num: 0,
    sindex: 0, //控制皮肤位置
    whogeto: '',
    orderallmoney: 0, //所有总小二的价格
    height: 0,
    popheight: 0,
    fenxiangshow: true, //分享
    ismystoremenb: true, //蒙版
    movableindex: 1000, //盒子边框
    ctx: '',
    showset: {

    },
    xiaoer: 0, //判断是否是小二
    isshow: 0, //0酒店列表， 1其他四個，2什么都没有
    recruit: 0, //招募
    click: false, //是否显示弹窗内容
    option: false, //显示弹窗或关闭弹窗的操作动画,
    clickone: false, //是否显示弹窗内容
    optionone: false, //显示弹窗或关闭弹窗的操作动画,
    waiterList: [],
    shopname: '',
    waiteruid: 0,
    ishare: '', //判断是否是分享进来
    // 修改皮肤的内容
    beijingimg: {},
    // 背景
    recommendpf: [{
        image: 'http://qiniu-test.ishzm.com/jxb/img/backqiang/backqiang01.png',
        name: '背景',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/backqiang/backqiang02.png',
        name: '背景',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/backqiang/backqiang03.png',
        name: '背景',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/backqiang/backqiang04.png',
        name: '背景',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/backqiang/backqiang05.png',
        name: '背景',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/backqiang/backqiang06.png',
        name: '背景',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/backqiang/backqiang07.png',
        name: '背景',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/backqiang/backqiang08.png',
        name: '背景',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/backqiang/backqiang09.png',
        name: '背景',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/backqiang/backqiang10.png',
        name: '背景',
      }
    ],
    // 人物
    guitaiimg: [{
        image: 'http://qiniu-test.ishzm.com/jxb/img/people/man01.png',
        name: 'boy',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/people/man02.png',
        name: 'boy',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/people/man03.png',
        name: 'boy',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/people/man04.png',
        name: 'boy',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/people/man05.png',
        name: 'boy',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/people/man06.png',
        name: 'boy',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/people/man07.png',
        name: 'boy',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/people/man08.png',
        name: 'boy',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/people/man09.png',
        name: 'boy',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/people/man10.png',
        name: 'boy',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/people/woman01.png',
        name: 'girl',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/people/woman02.png',
        name: 'girl',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/people/woman03.png',
        name: 'girl',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/people/woman04.png',
        name: 'girl',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/people/woman05.png',
        name: 'girl',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/people/woman06.png',
        name: 'girl',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/people/woman07.png',
        name: 'girl',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/people/woman08.png',
        name: 'girl',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/people/woman09.png',
        name: 'girl',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/people/woman10.png',
        name: 'girl',
      }
    ],
    // 酒柜
    yijianimg: [{
        image: 'http://qiniu-test.ishzm.com/jxb/img/pub/wine01.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/pub/wine2.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/pub/wine03.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/pub/wine04.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/pub/wine05.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/pub/wine06.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/pub/wine07.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/pub/wine08.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/pub/wine09.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/pub/wine10.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/pub/wine11.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/pub/wine12.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/pub/wine13.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/pub/wine14.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/pub/wine15.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/pub/wine16.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/pub/wine17.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/pub/wine18.png',
        name: '',
      },
    ],
    // 装饰
    wupinimg: [{
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar01.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar02.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar03.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar04.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar05.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar06.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar07.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar08.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar09.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar10.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar11.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar12.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar13.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar14.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar15.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar16.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar17.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar18.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar19.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar20.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar21.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar22.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar23.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar24.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar25.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar26.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar27.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar28.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar29.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar30.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar31.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar32.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar33.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar34.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar35.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar36.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar37.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar38.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar39.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar40.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar41.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar42.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar43.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar44.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar45.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar46.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar47.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar48.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar49.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar50.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar51.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar52.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar53.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar54.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar55.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar56.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar57.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar58.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar59.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar60.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar61.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar62.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar63.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar64.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar65.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar66.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar67.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar68.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar69.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar70.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar71.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar72.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar73.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar74.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar75.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar76.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar77.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar78.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar79.png',
        name: '',
      },
      {
        image: 'http://qiniu-test.ishzm.com/jxb/img/decorate/bar80.png',
        name: '',
      },

    ],
    shopxiulist: [
      // {
      //   image: 'http://qiniu-test.ishzm.com/jxb/img/myStore/mystore_bg.png',
      //   biaozhi:1,
      // }
      // ,
      //   {
      //   img: 'http://qiniu-test.ishzm.com/jxb/img/renovation/gz1.png',
      //   top: 200,
      //   left: 300,
      //   width: 200,
      //   height: 200,
      //   zindex: 1
      // }
    ],
    modification: [{
        id: "0",
        name: "背景"
      },
      {
        id: "1",
        name: "人物"
      },
      {
        id: "3",
        name: "装饰"
      },
      {
        id: "3",
        name: "酒柜"
      },
      {
        id: "3",
        name: "⬆\t⬇"
      },
      {
        id: "3",
        name: "完成"
      }

    ],
    thisshopxiulist: [],
    thisshopxiulistlength: 0,
    aa: 0,
    imgCount: 0

  },
  //大背景图加载图片失败
  onmainImageErrArr: function(e) {
    console.log('0', e)
    this.data.beijingimg.image = 'http://qiniu-test.ishzm.com/jxb/img/myStore/mystore_bg.png'
    this.data.imgCount += 1;
    if (this.data.imgCount == this.data.thisshopxiulistlength) {
      this.getorendering();
    }

  },

  //大背景图加载图片  
  onmainimageadArr(e) {
    console.log('1', e)
    this.data.beijingimg.widthx = e.detail.width;
    this.data.beijingimg.heightx = e.detail.height;
    this.data.imgCount += 1;
    if (this.data.imgCount == this.data.thisshopxiulistlength) {
      this.getorendering();
    }
  },


  //小图片加载图片失败
  onImageErrArr: function(e) {
    console.log('2', e)
    this.data.imgCount += 1;
    if (this.data.imgCount == this.data.thisshopxiulistlength) {
      this.getorendering();
    }
  },

  //小图片加载 
  onimageadArr(e) {
    console.log('3', e)
    var idx = parseInt(e.target.id);
    this.data.shopxiulist[idx].widthx = e.detail.width;
    this.data.shopxiulist[idx].heightx = e.detail.height;
    this.data.imgCount += 1;
    if (this.data.imgCount == this.data.thisshopxiulistlength) {
      this.getorendering();
    }
  },
  //图片渲染
  getorendering() {
    console.log(4)
    this.setData({
      shopxiulist: this.data.shopxiulist,
      beijingimg: this.data.beijingimg
    })
  },
  //更改uid
  changewateruid(uid) {
    var date = new Date();
    let time = date.getTime() + 259200000;
    let obj = {};
    let waiteruid = wx.getStorageSync("waiteruid") || {};
    if (waiteruid === {} || wx.getStorageSync("waiteruid").waiteruid != uid || wx.getStorageSync("waiteruid").time > date.getTime()) {
      obj.waiteruid = uid;
      obj.time = time;
      wx.setStorageSync("waiteruid", obj);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      scwidth: util.getallheigth().clientWidth,
      scheight: wx.getSystemInfoSync().windowHeight,
      height: wx.getSystemInfoSync().windowHeight,
      popheight: util.getallheigth().clientHeight + 200,
    })
    var _this = this;
    wx.getSystemInfo({
      success: function(res) {
        _this.data.pxwidth = res.windowWidth;
      }
    })


    this.data.shopuid = options.shopuid
    this.data.shopname = options.shopname
    this.data.aashopname = options.aashopname
    console.log('myStore options:', options);
    this.data.waiteruid = options.waiteruid
    var scene = wx.getStorageSync('scene')
    this.data.ishare = options.ishare
    if (options.ishare == 'share') { //通过分享进来的
      this.changewateruid(this.data.waiteruid);
      this.data.ishare = options.ishare
      //微信授权
      if (wx.getStorageSync('userInfo')) {
        var shopuidsto = wx.getStorageSync('userid')
        if (shopuidsto != '') { //userid不为空
          if (wx.getStorageSync('role') == 1) { //他是小二
            if (options.shopuid == shopuidsto) { //它的店
              this.setData({
                isshow: 2,
                xiaoer: 1
              })
            }
            if (options.shopuid != shopuidsto) { //不是它的店
              this.setData({
                isshow: 0,
                xiaoer: 0
              })
            }
          }
          if (wx.getStorageSync('role') == 2) { //他是店主
            if (options.shopuid == shopuidsto) { //它的店
              this.setData({
                isshow: 1,
                xiaoer: 1
              })
            }
          }
          if (options.shopuid != shopuidsto) { //不是它的店
            this.setData({
              isshow: 0,
              xiaoer: 0
            })
          }
        }
      } else {
        util.jialogin()
      }
    } else if (options.ishare == 'aa') { //从个人中心   
      if (wx.getStorageSync('role') == 1) { //他是小二
        this.setData({
          xiaoer: 1,
          isshow: 2
        })
      }
      if (wx.getStorageSync('role') == 2) { //他是店主
        this.setData({
          xiaoer: 0,
          isshow: 1
        })
      }
    } else if (options.ishare == 'recruit') { //招聘小二  
      this.setData({
        recruit: 1
      })
    } else if (options.ishare == 'needwaiter') {
      this.setData({
        xiaoer: 0,
        isshow: 0
      })
    } else { //从主页商店列表             
      var shopuidsto = wx.getStorageSync('userid')
      if (wx.getStorageSync('role') == 1) { //他是小二
        if (options.shopuid == shopuidsto) { //他自己的店
          this.setData({
            xiaoer: 1,
            isshow: 2
          })
        }
        if (options.shopuid != shopuidsto) { //不是他自己的店
          this.setData({
            xiaoer: 0,
            isshow: 0
          })
        }
      }
      if (wx.getStorageSync('role') == 2) { //他是店主
        if (options.shopuid == shopuidsto) { //他自己的店
          this.setData({
            xiaoer: 0,
            isshow: 1
          })
        }
        if (options.shopuid != shopuidsto) { //不是他自己的店
          this.setData({
            xiaoer: 0,
            isshow: 0
          })
        }
      }
    }
    //更改标题
    wx.setNavigationBarTitle({
      title: options.shopname + '的酒铺'
    })
    util.http.postJson("fn/user/get/admin",{
      'act': 'Shop_shopSkin',
      'shopuid': options.shopuid
    }, function(res) {
      // if(!res.data){
      //   res.data={decorate:''}
      // }
      // console.log('111111', !res.data.decorate)
      // console.log('111111', res.data.decorate != 0)
      // console.log(!res.data.decorate)
      if (!res.data.decorate) {
        // console.log(111111)
        thisdata.beijingimg.image = 'http://qiniu-test.ishzm.com/jxb/img/backqiang/backqiang03.png'
        thisdata.beijingimg.biaozhi = 1
        thisdata.beijingimg.top = 0
        thisdata.beijingimg.left = 0
        thisdata.beijingimg.position = 'absolute'
        thisdata.beijingimg.name = '背景图'
        thisdata.beijingimg.width = 750
        this.setData({
          beijingimg: thisdata.beijingimg,
          aa: 1
        })
        return
      }
      thisdata.thisshopxiulist = JSON.parse(res.data.decorate)
      thisdata.thisshopxiulistlength = thisdata.thisshopxiulist.length
      // console.log('xxxx'.data.thisshopxiulistlength)
      // console.log('aaaa'.data.thisshopxiulist)
      let imagell = thisdata.thisshopxiulist.splice(0, 1)
      thisdata.beijingimg = imagell[0]
      // console.log('aaaaaa'.data.beijingimg)
      thisdata.shopxiulist = thisdata.thisshopxiulist
      console.log('bbb'.data.shopxiulist)
      this.setData({
        aa: 1,
        shopxiulist: thisdata.shopxiulist,
        beijingimg: thisdata.beijingimg
      })
      // thisgetorendering()
    })
  },















  // 跳转至首页
  switchfirst() {
    wx.switchTab({ //跳转到tabBar页面，并关闭其他所有tabBar页面
      url: "/pages/home/home"
    })

  },
  // 修改皮肤页面top切换
  setonclickList: function(e) {
    let thistop = (util.getallheigth().clientHeight - 504) / 2
    let num = e.currentTarget.dataset.index;
    if (num < 4) {
      console.log(num)
      this.setData({
        sindex: num,
        num: num
      })
    }
    if (num == 4) {
      if (this.data.popheight == thistop) {
        this.donhua((util.getallheigth().clientHeight) / 2)
      } else {
        this.donhua(thistop)
      }
    }
    if (num == 5) {
      this.donhua((util.getallheigth().clientHeight + 200) / 2)
      for (let i = 0; i < this.data.shopxiulist.length; i++) {
        this.data.shopxiulist[i].ishhow = false
      }
      this.setData({
        shopxiulist: this.data.shopxiulist,
        movableindex: 10000,
        ismystoremenb: true,
        fenxiangshow: true,
        xiaoer: 0,
        isshow: 1
      })
      if (this.data.shopxiulist.length == 0 || this.data.shopxiulist[0].biaozhi == undefined) {
        this.data.beijingimg.biaozhi = 1,
          this.data.shopxiulist.unshift(this.data.beijingimg)
      }
      console.log('aaa', this.data.shopxiulist)
      util.http.postJson("fn/user/get/admin",{
        'act': 'Shop_editshopSkin',
        'decorate': JSON.stringify(this.data.shopxiulist),
        'icon': ''
      }, function(res) {

      })
    }
  },

  // // //加载后执行
  // dealCvs: function() {
  //   var _this = this
  //   console.log('all ok:', this.data.shopxiulist);
  //   var ctx = wx.createCanvasContext('canvasOne')
  //   this.data.shopxiulist.forEach(function(img) {
  //     if (img.biaozhi) {
  //       ctx.drawImage(img.image, 0, 0, img.widhtx, img.heightx, 0, 0, (util.getallheigth().clientWidth) / 2, (util.getallheigth().clientHeight) / 2)
  //     } else {
  //       ctx.drawImage(img.img, 0, 0, img.widhtx, img.heightx, img.left / 2, img.top / 2, img.width / 2, ((img.heightx * img.width) / img.heightx))
  //     }
  //     console.log(1111)
  //   });
  //   ctx.draw(false, function() {
  //     wx.canvasToTempFilePath({
  //       canvasId: "canvasOne",
  //       success(res) {
  //         // var imgUrl=res.tempFilePath.replace('http','wxfile') 
  //         var imgUrl = res.tempFilePath
  //         wx.uploadFile({
  //           url: publicUrl, //仅为示例，非真实的接口地址
  //           filePath: imgUrl,
  //           name: 'file',
  //           formData: {
  //             'act': 'found_uploadimg',
  //           },
  //           success(res) {
  //             console.log('resllll', res.data)
  //             util.http.postJson("fn/user/get/admin",{
  //               'act': 'Shop_editshopSkin',
  //               'decorate': JSON.stringify(_this.data.shopxiulist),
  //               'icon': res.data
  //             }, function(res) {

  //             })
  //           },
  //           fail(res) {
  //             console.log('res', res)
  //           }
  //         })
  //       },
  //       fail(err) {
  //         console.log(err)
  //       }
  //     }, _this)
  //   })
  // },

  //背景加载图片  
  onbeijingadArr(e) {
    console.log('1111', e)
    var idx = parseInt(e.target.id);
    this.data.recommendpf[idx].widthx = e.detail.width;
    this.data.recommendpf[idx].heightx = e.detail.height;
  },
  //人物  
  onguitaiadArr(e) {
    console.log('2222', e)
    var idx = parseInt(e.target.id);
    this.data.guitaiimg[idx].widthx = e.detail.width;
    this.data.guitaiimg[idx].heightx = e.detail.height;
  },


  //小物品加载图片  
  onwupinadArr(e) {
    // console.log('1111', e)
    var idx = parseInt(e.target.id);
    this.data.wupinimg[idx].widthx = e.detail.width;
    this.data.wupinimg[idx].heightx = e.detail.height;
  },
  //一键生成
  onyijianadArr(e) {
    var idx = parseInt(e.target.id);
    this.data.yijianimg[idx].widthx = e.detail.width;
    this.data.yijianimg[idx].heightx = e.detail.height;
  },


  //加载图片成功
  // onImageLoadArr: function(e) {
  //   // console.log('1111', e)
  //   var idx = parseInt(e.target.id);
  //   this.data.shopxiulist[idx].widthx = e.detail.width;
  //   this.data.shopxiulist[idx].heightx = e.detail.height;
  //   this.data.shopxiulist[idx].ok = true;
  //   console.log(e)
  //   this.data.imgCount += 1;
  //   if (this.data.imgCount == this.data.shopxiulist.length)
  //     this.dealCvs();
  // },

  //更换背景
  bjchosecli(e) {
    console.log('indexid', e)
    console.log('aa', this.data.recommendpf[e.target.id].widthx)
    console.log('bb', this.data.beijingimg)
    this.data.beijingimg.widthx = this.data.recommendpf[e.target.id].widthx
    this.data.beijingimg.heightx = this.data.recommendpf[e.target.id].heightx
    this.data.beijingimg.image = this.data.recommendpf[e.target.id].image
    this.data.beijingimg.top = 0
    this.data.beijingimg.left = 0
    this.data.beijingimg.position = 'absolute'
    this.data.beijingimg.name = '背景图'
    this.data.beijingimg.width = 750
    // this.data.beijingimg.height = util.getallheigth().clientHeight
    this.setData({
      beijingimg: this.data.beijingimg
    })
  },
  //酒柜
  gzchosecli(e) {
    var _this = this
    // console.log('w', e)
    let guizijson = {
      position: 'absolute',
      image: '',
      name: '小和尚的柜子',
      top: 200,
      left: 300,
      width: 200,
      zindex: 100,
      ishhow: false,
      widthx: 0,
      heightx: 0
    }

    if (this.data.sindex == 1) { //柜台
      guizijson.image = e.currentTarget.dataset.image
      guizijson.widthx = this.data.guitaiimg[e.target.id].widthx
      guizijson.heightx = this.data.guitaiimg[e.target.id].heightx
    }
    if (this.data.sindex == 2) { //小物品(装饰)
      guizijson.image = e.currentTarget.dataset.image
      guizijson.widthx = this.data.wupinimg[e.target.id].widthx
      guizijson.heightx = this.data.wupinimg[e.target.id].heightx
    }
    if (this.data.sindex == 3) { //小物品（酒柜）
      console.log('e', e)
      guizijson.image = e.currentTarget.dataset.image
      guizijson.widthx = this.data.yijianimg[e.target.id].widthx
      guizijson.heightx = this.data.yijianimg[e.target.id].heightx
    }
    for (let i = 0; i < this.data.shopxiulist.length; i++) {
      this.data.shopxiulist[i].zindex = 10
    }
    this.data.shopxiulist.push(guizijson)
    this.setData({
      shopxiulist: this.data.shopxiulist
    })
  },
  //删除柜子
  gzcancel(e) {
    // console.log(1111)
    this.data.shopxiulist.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      shopxiulist: this.data.shopxiulist
    })
  },
  //柜子触碰
  touchstartli(e) {
    for (let i = 0; i < this.data.shopxiulist.length; i++) {
      this.data.shopxiulist[i].ishhow = false
      this.data.shopxiulist[i].zindex = 10
    }
    this.data.shopxiulist[e.currentTarget.dataset.index].ishhow = true;
    this.data.shopxiulist[e.currentTarget.dataset.index].zindex = 100
    console.log('aaa', this.data.shopxiulist)
    this.setData({
      movableindex: e.currentTarget.dataset.index,
      shopxiulist: this.data.shopxiulist
    })
  },
  //鼠标离开柜子
  touchendcli(e) {
    var em = this.data.shopxiulist[e.currentTarget.dataset.index];
    var ds = e.currentTarget.dataset;


    const query = wx.createSelectorQuery()
    query.selectAll('.movable').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec((res) => {
      // res[1].scrollTop // 显示区域的竖直滚动位置
      this.data.shopxiulist[e.currentTarget.dataset.index].top = (res[0][e.currentTarget.dataset.index].top * (750.0 / this.data.pxwidth))
      this.data.shopxiulist[e.currentTarget.dataset.index].left = (res[0][e.currentTarget.dataset.index].left * (750.0 / this.data.pxwidth))
      this.setData({
        shopxiulist: this.data.shopxiulist
      })
    })

  },
  xiaotouchendcli(e) {
    const query = wx.createSelectorQuery()
    query.selectAll('.movable').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec((res) => {
      this.data.shopxiulist[e.currentTarget.dataset.index].width = (parseInt(res[0][e.currentTarget.dataset.index].width) * (750.0 / this.data.pxwidth))
      this.data.shopxiulist[e.currentTarget.dataset.index].height = (parseInt(res[0][e.currentTarget.dataset.index].height) * (750.0 / this.data.pxwidth))
      this.setData({
        shopxiulist: this.data.shopxiulist
      })
    })
  },
  //点击进入设置
  set() {
    wx.navigateTo({
      url: '/pages/PersonalPub/shopSetUp/shopSetUp?shopuid=' + this.data.shopuid + '&shopname=' + '我',
    })
  },
  shopForDetails() {
    wx.navigateTo({
      url: '/pages/PersonalPub/wineDetailPage/wineDetailPage',
    })
  },
  orderhistory() {
    wx.navigateTo({
      url: '/pages/PersonalPub/orderHistory/orderHistory',
    })
  },
  ordercsss() {
    wx.navigateTo({
      url: '/pages/PersonalPub/myShop/myShop',
    })
  },
  //跳转至我的小二
  recruitmentxer() {
    wx.navigateTo({
      url: '/pages/PersonalPub/myXer/myXer?shopuid=' + this.data.shopuid + "&shopname=" + this.data.aashopname,

    })
  },
  //点击分享
  onShareAppMessage: function(res) {
    let whoshare = ''
    let waiteruid = 0
    var _this = this
    if (this.data.shopname == '我') {
      this.data.shopname = wx.getStorageSync('shopname')
    }

    if (this.data.shopuid != wx.getStorageSync('userid')) { //分享别人的店
      if (wx.getStorageSync('role') == 1) {
        waiteruid = wx.getStorageSync("userid")
      } else {
        waiteruid = 0
      }
    }
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: _this.data.shopname + '的酒庄',
      desc: '单纯高粱酒江小白',
      path: '/pages/PersonalPub/myStore/myStore?shopuid=' + _this.data.shopuid + '&ishare=share' + '&shopname=' + _this.data.shopname + '&waiteruid=' + waiteruid, //这是一个路径,
      withShareTicket: true
    }

  },
  //菜单点击
  yesharecli() {

  },
  // 菜单
  bindmenu() {
    wx.navigateTo({
      url: '/pages/PersonalPub/myShop/myShop?shopuid=' + this.data.shopuid + '&shopname=' + this.data.shopname + '&waiteruid=' + this.data.waiteruid + '&ishare=' + this.data.ishare,
    })
  },
  //动画
  donhua(num) {
    let imgAnimation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    });
    imgAnimation.top(num).step();
    this.setData({
      animationData: imgAnimation.export()
    })
    this.data.popheight = num
  },


  // 修改皮肤
  clickPup: function() {
    // console.log('aa', this.data.shopxiulist.length)
    if (this.data.shopxiulist.length != 0) {
      if (!!this.data.shopxiulist[0].biaozhi) {
        let imagell = this.data.shopxiulist.splice(0, 1)
        this.setData({
          shopxiulist: this.data.shopxiulist,
        })
      }
    }

    this.setData({
      ismystoremenb: false,
      fenxiangshow: false,
      xiaoer: 0,
      isshow: 2
    })
    this.donhua((util.getallheigth().clientHeight - 504) / 2)
  },
  // 点击我的小二
  mystoreclickPup: function() {
    util.http.postJson("fn/user/get/admin",{
      'act': 'Waiter_waiterList'
    }, function(res) {
      var orderallmoney = 0
      for (var i = 0; i < res.data.data.length; i++) {
        var patt = /http/
        let thisplayimage = res.data.data[i].heads.head
        if (!patt.test(thisplayimage)) {
          res.data.data[i].heads.head = imageUrl + thisplayimage
        }
        orderallmoney += res.data.data[i].totalmoney
        // res.data.data[i].head = imageUrl + res.data.data[i].head
      }
      this.setData({
        waiterList: res.data.data,
        orderallmoney: orderallmoney
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // let _this = this
    // let thisshopname = ''
    // util.http.postJson("fn/user/get/admin",{
    //     'act': 'Shop_shopDetail',
    //     'uid': this.data.shopuid
    // }, function(res) {
    //     thisdata.shopname = res.data.shop.name
    //     console.log(thisdata.shopname)
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {
    // var date = new Date();
    // let time = date.setDate(date.getDate() + 3);
    
    // console.log('time', time, 'now', date.getTime());
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

  }
})