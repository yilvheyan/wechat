const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const openid = app.globalData.openid;
const util = require('../../utils/util.js');

// // var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
// // var qqmapsdk = new QQMapWX({
// //   key: 'BC7BZ-L2YWS-IWOO2-6HYZX-S4FNE-Q4BMC' // 必填
// //   });
// Page({
//   // data: {},
//   // onLoad: function() {
//   //     var _this = this;
//   //     _this.findXy() //查询用户与商家的距离
//   // },

//   // findXy() { //获取用户的经纬度
//   //     var _this = this
//   //     wx.getLocation({
//   //         type: 'wgs84',
//   //         success(res) {
//   //             // _this.getDistance(res.latitude, res.longitude, 39.924091, 116.403414)
//   //         }
//   //     })
//   // },

//   // Rad: function(d) { //根据经纬度判断距离
//   //     return d * Math.PI / 180.0;
//   // },
//   // getDistance: function(lat1, lng1, lat2, lng2) {
//   //     // lat1用户的纬度
//   //     // lng1用户的经度
//   //     // lat2商家的纬度
//   //     // lng2商家的经度
//   //     var radLat1 = this.Rad(lat1);
//   //     var radLat2 = this.Rad(lat2);
//   //     var a = radLat1 - radLat2;
//   //     var b = this.Rad(lng1) - this.Rad(lng2);
//   //     var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
//   //     s = s * 6378.137;
//   //     s = Math.round(s * 10000) / 10000;
//   //     s = s.toFixed(2) + '公里' //保留两位小数
//   //     console.log('经纬度计算的距离:' + s)
//   //     return s
//   // },
//   // //获取地图位置
//   // lookmapcli(){
//   //     wx.chooseLocation({
//   //         success: function (res) {
//   //             // success
//   //             console.log(res, "location")
//   //             console.log(res.name)         //地区名字
//   //             console.log(res.latitude)     //纬度
//   //             console.log(res.longitude)    //经度
//   //             // this.setData({
//   //             //     roomname: res.name
//   //             // })
//   //         },
//   //         fail: function () {
//   //             // fail
//   //         },
//   //         complete: function () {
//   //             // complete
//   //         }
//   //     })
//   // },
//   //查看地图位置
//   // lookmapclill() {
//   //   util.getAddress();
//   //   let time = setInterval(() => {
//   //     if (wx.getStorageSync('address_component') != '') {
//   //       console.log(wx.getStorageSync('address_component'))
//   //       wx.removeStorageSync('address_component')
//   //       clearInterval(time)
//   //     }
//   //   }, 500)
//   // wx.getLocation({
//   //     type: 'gcj02', //返回可以用于wx.openLocation的经纬度
//   //     success(res) {
//   //         const latitude = res.latitude
//   //         const longitude = res.longitude
//   //       // console.log(latitude)
//   //       // console.log(longitude)
//   //       //   wx.openLocation({
//   //       //       latitude,
//   //       //       longitude,
//   //       //       scale: 18
//   //       //   })
//   //       qqmapsdk.reverseGeocoder({ 
//   //         location: {
//   //           latitude: latitude,
//   //           longitude: longitude
//   //         },
//   //         success: function (res) {
//   //           console.log('11111',res)
//   //         }
//   //       })
//   //     }
//   // })
//   // },


//   //鼠标离开柜子
//   touchendcli(e) {
//     debugger;
//     wx.chooseAddress({
//       success(res) {
//         console.log(res.userName)
//         console.log(res.postalCode)
//         console.log(res.provinceName)
//         console.log(res.cityName)
//         console.log(res.countyName)
//         console.log(res.detailInfo)
//         console.log(res.nationalCode)
//         console.log(res.telNumber)
//       },
//       fail(res){
//         console.log(res);
//       }
//     })


//     // const query = wx.createSelectorQuery()
//     // query.selectAll('.movable').boundingClientRect()
//     // query.selectViewport().scrollOffset()
//     // // console.log('11111111', this.data.shopxiulist)
//     // query.exec((res) => {
//     //   console.log('222222233', res)
//     //   // res[1].scrollTop // 显示区域的竖直滚动位置
//     //   // this.data.shopxiulist[e.currentTarget.dataset.index].top = (res[0][e.currentTarget.dataset.index].top * 2)
//     //   // this.data.shopxiulist[e.currentTarget.dataset.index].left = (res[0][e.currentTarget.dataset.index].left * 2)
//     //   // this.data.shopxiulist[e.currentTarget.dataset.index].width = (res[0][e.currentTarget.dataset.index].width * 2)
//     //   // this.data.shopxiulist[e.currentTarget.dataset.index].height = (res[0][e.currentTarget.dataset.index].height * 2)
//     //   // this.setData({
//     //   //   shopxiulist: this.data.shopxiulist
//     //   // })
//     //   // console.log('zzzz', this.data.shopxiulist)
//     // })

//   },


//   //授权
//   // login: function() {
//   //     // console.log(openid)
//   //     let jiekou = util.getOpenid()
//   // console.log(openid)
//   // var that = this;
//   // wx.login({
//   //     success: function (log) {
//   //         console.log(log.code);
//   //         this.setData({
//   //             code: log.code
//   //         });
//   //         wx.request({
//   //             url: 'http://192.168.101.130/jiangxiaobai_php/public/querywxopenid',
//   //             data: { code: log.code },
//   //             success: function (data) {
//   //                 console.log(data);
//   //                 this.setData({
//   //                     openid: data.data.openid,
//   //                     session_key: data.data.session_key
//   //                 });
//   //             }
//   //         })
//   //     }
//   // })
//   // }

//   // data: {　　//初始化为空
//   //     source: ''
//   // },
//   // /**
//   //  * 上传图片
//   //  */
//   // uploadimg: function () {
//   //     var that = this;
//   //     wx.chooseImage({ //从本地相册选择图片或使用相机拍照
//   //         count: 1, // 默认9
//   //         sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
//   //         sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
//   //         success: function (res) {
//   //             //console.log(res)
//   //             //前台显示
//   //             this.setData({
//   //                 source: res.tempFilePaths
//   //             })
//   //             // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
//   //             var tempFilePaths = res.tempFilePaths
//   //             wx.uploadFile({
//   //                 url: 'http://www.website.com/home/api/uploadimg',
//   //                 filePath: tempFilePaths[0],
//   //                 name: 'file',
//   //                 success: function (res) {
//   //                     //打印
//   //                     console.log(res.data)
//   //                 }
//   //             })

//   //         }
//   //     })
//   // },


//   //    图片截取部分

//   // data: {
//   //   showImagell: {},
//   //   showImage: {
//   //     url: '',
//   //     height: '',
//   //     width: ''
//   //   },
//   //   imgMaxWidth: '',
//   //   imgMaxHeight: '',
//   //   showBtn: true,
//   //   x: 0,
//   //   y: 0,
//   //   scale: 1,
//   //   moveViewWidth: '',
//   //   moveViewHeight: '',
//   //   lastImage: '',
//   //   context: ''
//   // },

//   // /**
//   //  * 图片加载获取图片参数
//   //  */
//   // onImageLoad: function(e) {
//   //   let height = parseInt((e.detail.height * 750) / 580)
//   //   if (height < e.detail.width) {
//   //     this.data.showImage.height = 290
//   //     let wi = e.detail.height / 290
//   //     this.data.showImage.width = e.detail.width / wi
//   //   } else {
//   //     this.data.showImage.width = (util.getallheigth().clientWidth) / 2;
//   //     let wi = e.detail.width / this.data.showImage.width
//   //     this.data.showImage.height = e.detail.height / wi
//   //   }
//   //   this.setData({
//   //     showImage: this.data.showImage
//   //   })
//   //   this.data.context = wx.createCanvasContext('canvasOne');
//   //   this.data.context.drawImage(this.data.showImage.url, 200, 208, (util.getallheigth().clientWidth), 290, 0, 0, (util.getallheigth().clientWidth) / 2, 145)
//   //   this.data.context.draw()
//   // },

//   // // aaa(){
//   // //   wx.requestPayment({
//   // //     timeStamp: '',
//   // //     nonceStr: '',
//   // //     package: '',
//   // //     signType: 'MD5',
//   // //     paySign: '',
//   // //     success(res) { },
//   // //     fail(res) { }
//   // //   })
//   // // },
//   // /**
//   //  * 生命周期函数--监听页面加载
//   //  */
//   // onLoad: function(options) {
//   //   if (wx.chooseAddress) {
//   //     wx.chooseAddress({
//   //       success: function (res) {
//   //         console.log(res.userName)
//   //         console.log(res.postalCode)
//   //         console.log(res.provinceName)
//   //         console.log(res.cityName)
//   //         console.log(res.countyName)
//   //         console.log(res.detailInfo)
//   //         console.log(res.nationalCode)
//   //         console.log(res.telNumber)
//   //       },
//   //       fail: function (err) {
//   //         console.log(JSON.stringify(err))
//   //       }
//   //     })
//   //   } else {
//   //     console.log('当前微信版本不支持chooseAddress');
//   //   }
//   // },

//   // },
//   // /**
//   //  * 截图完成将指定canvas区域生成图片
//   //  */
//   // jieDone: function() {
//   //   var that = this
//   //   wx.canvasToTempFilePath({
//   //     x: 0,
//   //     y: 0,
//   //     width: (util.getallheigth().clientWidth) / 4,
//   //     height: 145,
//   //     destWidth: (util.getallheigth().clientWidth) / 4,
//   //     destHeight: 145,
//   //     canvasId: 'canvasOne',
//   //     success: function(res) {
//   //       console.log('1111', res, util.getallheigth().clientWidth)
//   //       thisdata.showImagell.url = res.tempFilePath
//   //       thisdata.showImagell.height = 290
//   //       thisdata.showImagell.width = (util.getallheigth().clientWidth)
//   //       this.setData({
//   //         showImagell: thisdata.showImagell,
//   //         showBtn: true
//   //       })
//   //       console.log('11111'.data.showImage)
//   //     },
//   //     fail(res) {
//   //       wx.hideLoading()
//   //       wx.showModal({
//   //         title: '截取失败',
//   //         content: res.errMsg
//   //       })
//   //       console.log("fail res:")
//   //       console.log(res)
//   //     }
//   //   })
//   // },
//   // //取消
//   // cancelImg: function() {
//   //   this.setData({
//   //     showBtn: true
//   //   })
//   // },
//   // //图片上传
//   // selectTap() {
//   //   var that = this
//   //   wx.chooseImage({
//   //     count: 1, // 默认9
//   //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
//   //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
//   //     success(res) {
//   //       const tempFilePath = res.tempFilePaths[0]
//   //       thisdata.showImage.url = tempFilePath
//   //       this.setData({
//   //         showImage: thisdata.showImage
//   //       })
//   //       this.setData({
//   //         showBtn: false
//   //       })
//   //     }
//   //   })
//   // },
//   // onChange: function(e) {
//   //   console.log('')
//   //   console.log(e.detail.x)
//   //   console.log(e.detail.y)
//   //   this.data.x = 200 - (e.detail.x * 2)
//   //   this.data.y = 200 - (e.detail.y * 2)
//   //   this.data.context.drawImage(this.data.showImage.url, this.data.x, this.data.y, (util.getallheigth().clientWidth), 290, 0, 0, (util.getallheigth().clientWidth) / 2, 145)
//   //   this.data.context.draw()
//   // },
//   // onScale: function(e) {
//   //   console.log('e.detail.scale', e.detail.scale)
//   //   this.setData({
//   //     scale: e.detail.scale
//   //   })
//   // }

//   data: {
//     //  url:'http://qiniu-test.ishzm.com/jxb/img/findlist_xq/addimg.png',
//     url: 'http://qiniu-test.ishzm.com/jxb/img/myStore/mystore_bg.png',
//     url2: '',
//     imgarr: null,
//     imgCount: 0,
//   },
//   onLoad: function() {
//     var arr = wx.getStorageSync('shopxiulist')
//     console.log(arr)
//     this.data.imgarr = arr;
//     this.setData({
//       imgarr: arr
//     })
//     this.data.ctx = wx.createCanvasContext('canvasOne')
//   },
//   // dealCvs: function() {
//   //   console.log('all ok:', this.data.imgCount);
//   //   var ctx = this.data.ctx;
//   //   this.data.imgarr.forEach(function(img) {
//   //     if (img.biaozhi) {
//   //       ctx.drawImage(img.img, 0, 0, img.widhtx, img.heightx, 0, 0, 550, 1000)
//   //     } else {
//   //       ctx.drawImage(img.img, 0, 0, img.widhtx, img.heightx, img.left / 2, img.top / 2, img.width / 2, img.height / 2)
//   //     }

//   //   });
//   //   ctx.draw()
//   //   var cvs = this.data.ctx._context.canvas;

//   //   var src = cvs.toDataURL("image/png")
//   // },
//   //加载图片失败
//   // onImageErrArr: function(e) {
//   //   this.data.imgCount += 1;
//   //   if (this.data.imgCount == this.data.imgarr.length)
//   //     this.dealCvs();
//   // },
//   //加载图片成功
//   // onImageLoadArr: function(e) {
//   //   var idx = parseInt(e.target.id);
//   //   this.data.imgarr[idx].widthx = e.detail.width;
//   //   this.data.imgarr[idx].heightx = e.detail.height;
//   //   this.data.imgarr[idx].ok = true;
//   //   console.log(e)
//   //   this.data.imgCount += 1;
//   //   if (this.data.imgCount == this.data.imgarr.length)
//   //     this.dealCvs();
//   // },
// })


Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaList: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  //通过微信添加地址
  wxAddress: function () {
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        var address = {
          "name": res.userName,
          "phone": res.telNumber,
          "province": res.provinceName,
          "city": res.cityName,
          "county": res.countyName,
          "detailInfo": res.detailInfo,
        };
        //获取到的地址存到data里的areaList中
        that.setData({
          areaList: that.data.areaList.push(address)
        });
      },
      fail: () => {
        this.openConfirm()   // 如果获取地址权限失败，弹出确认弹窗，让用户选择是否要打开设置，手动去开权限
      }
    })
  },
})