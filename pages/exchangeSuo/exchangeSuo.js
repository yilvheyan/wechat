// pages/exchangeSuo/exchangeSuo.js
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const openid = app.globalData.openid;
const util = require('../../utils/util.js');
import * as echarts from '../../ec-canvas/echarts';


var numberList = [];
var dataList = [];
var Chart = null
let chartLine;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: [],
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    mouths: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    days: [],
    year: 0,
    mouth: 0,
    nowDate: '',
    tobuy: 0,
    thisgre: 0,
    kolinfo: {
      kolname: '',
      fenhong: 0,
      jiuzuanshu: 0,
      ecmyjiuz: 0,
      price: 0,
      kolid: 0
    },
    chengjiaoid: 0,
    dateshow: 0,
    myscores: 0,
    etwidth: 1412,
    etleft: 0,
    ettime: '',
    thistouches: 0, //鼠标触碰曲线图
    thiskolnum: 0,
    fenhong: '2588',
    jiuzuanshu: '12000',
    sindex: 0, //
    num: 0, // 
    totalDaynum: 0,
    message: [{
        id: '0',
        text: "成交历史"
      },

      {
        id: '1',
        text: '我的交易'
      }
    ],
    kollist: [],
    shishijiapoyi: [],
    getmygua: [], //我的挂单
    isgetmygua: false,
    myexchangeSuo: [],
    etextlist: ['小时', '日线'],
    etextindex: 0,
    ecLine: {
      lazyLoad: true
    }

  },
  // 酒钻买卖
  exchangeSuobtn(e) {
    wx.navigateTo({
      url: '/pages/JiaoYiplate/JiuZuandeal/JiuZuandeal?index=' + this.data.thiskolnum + '&myscorse=' + this.data.myscores,
    })
  },

  init_echarts: function() {
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      this.setOption(Chart);
      return Chart;
    });
  },
  setOption: function(Chart) {
    Chart.clear();
    Chart.setOption(this.getOption()); //获取新数据
  },

  getOption: function() {
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '当前汇率走势',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#283b56'
          }
        },
        formatter: function(value, index, bb) {
          return parseFloat(value[0].value).toFixed(2);
        }
      },
      legend: {
        data: ['最新成交价', '预购队列']
      },
      dataZoom: {
        show: false,
        start: 0,
        end: 100
      },
      xAxis: {
        type: 'category',
        data: dataList
      },
      yAxis: {
        type: 'value',
        data: dataList,
      },
      series: [{
        name: '汇率走势',
        data: numberList,
        type: 'line',
      }]
    }
    return option;
  },
  move() {
    console.log(1111)
  },
  //选择时间
  chosedaymouth() {
    if (this.data.etextindex == 0) {
      this.setData({
        dateshow: 1
      })
    } else {
      this.setData({
        dateshow: 2
      })
    }

  },
  name() {
    console.log(1111);
  },

  //曲线数据获取
  getData(kolid, starttime, stoptime, etextindex) {
    console.log('kolid', kolid, starttime, stoptime, etextindex)
    let format = ''
    let butnum = 0
    if (etextindex == 0) {
      format = '%Y-%m-%d %H:00:00'
      butnum = 25
    } else {
      format = '%Y-%m-%d 00:00:00'
      butnum = this.data.totalDaynum
    }
    util.http.postJson("fn/user/get/admin",{
      'act': "Diamond_rate",
      'kol_id': kolid,
      'starttime': starttime,
      'stoptime': stoptime,
      'format': format
    }, function(res) {
      if (res.ok) {
        let price = []
        let qtime = []
        let thisetnum = res.data
        // console.log('xx', thisetnum)
        if (!res.data) {
          for (let i = 0; i < butnum; i++) {
            price.push(0);
            qtime.push(i);
          }
          numberList = price
          dataList = qtime
          thisinit_echarts();
          return;
        }
        if (butnum == 25) {
          for (let i = 1; i < butnum; i++) {
            let biaozhi = 0
            for (let j = 0; j < thisetnum.length; j++) {
              if (i == parseInt(thisetnum[j].qtime.slice(11, 14))) {
                price.push(res.data[j].price)
                qtime.push(res.data[j].qtime.slice(11, 14))
                biaozhi = 1
              }
            }
            if (biaozhi == 0) {
              price.push(0)
              qtime.push(i)
            }
          }
        } else {
          for (let i = 1; i < butnum; i++) {
            let biaozhi = 0
            for (let j = 0; j < thisetnum.length; j++) {
              if (i == parseInt(thisetnum[j].qtime.slice(8, 11))) {
                price.push(res.data[j].price)
                qtime.push(res.data[j].qtime.slice(8, 11))
                biaozhi = 1
              }
            }
            if (biaozhi == 0) {
              price.push(0)
              qtime.push(i)
            }
          }
        }

        numberList = price
        dataList = qtime
        thisinit_echarts();
      }
      if (res.data.code == 10001) {
        console.log(1111111)
        wx.showToast({
          title: '当天没有数据',
          icon: 'none',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    for (let i = 0; i < 25; i++) {
      numberList.push(0);
      dataList.push(i);
    }
    // 请求酒钻交易
    this.getkolinfo(0)
    this.echartsComponnet = this.selectComponent('#mychart');
    // this.init_echarts();
    this.dateData();
    var myDate = new Date(); //获取系统当前时间
    var nowDate = util.formatNumber(myDate.getDate())
    var nowMouth = util.formatNumber(myDate.getMonth() + 1)
    var nowYear = myDate.getFullYear();
    this.setData({
      etdata: nowDate,
      etmouth: nowMouth,
      etyear: nowYear,
      nowDate: nowDate
    })
  },
  //选择kol
  choekol(e) {
    this.data.thiskolnum = e.currentTarget.dataset.index
    console.log('e.currentTarget.dataset.index', e.currentTarget.dataset.index)
    this.getkolinfo(e.currentTarget.dataset.index)
    this.setData({
      goodsexchangeSuoflag: false
    })
  },

  getkolinfo(numindex) {
    util.http.postJson("fn/user/get/admin",{
      'act': 'Diamond_diamond',
    }, function(res) {
      if (!res.data) {
        return
      }
      if (res.data.realcount.length == 0) {
        return
      }
      console.log('aaa', res.data.realcount[0].headpic)
      //kol头像
      for (let i = 0; i < res.data.realcount.length; i++) {
        res.data.realcount[i].headpic = imageUrl + res.data.realcount[i].headpic
      }
      thisdata.myscores = res.data.myscores.remainscores
      thisdata.kolinfo.jiuzuanshu = res.data.realcount[numindex].count_diamond
      thisdata.kolinfo.kolname = res.data.realcount[numindex].name
      thisdata.kolinfo.headpic = res.data.realcount[numindex].headpic
      thisdata.kolinfo.kolid = res.data.realcount[numindex].id
      thisdata.kolinfo.price = res.data.realcount[numindex].price
      if (res.data.realcount[numindex].mycount.length == 0) {
        thisdata.kolinfo.ecmyjiuz = 0
      } else {
        thisdata.kolinfo.ecmyjiuz = res.data.realcount[numindex].mycount[0].count
      }
      thisgetcommitlog(thisdata.kolinfo.kolid, 0, 10)
      //执行该kol当天的数据
      var day1 = new Date()
      let starttime = day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate() + ' ' + '00:00:00'
      let stoptime = day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate() + ' ' + '24:00:00'
      thisgetData(thisdata.kolinfo.kolid, starttime, stoptime, 0)
      thisinit_echarts();

      this.setData({
        kolinfo: thisdata.kolinfo,
        kollist: res.data.realcount,
        kollistimg: res.data.realcount[0].headpic,
        etextindex: 0,
        sindex: 0,
        num: 0,
      });
    });
  },
  // 曲线图
  etextcli(e) {
    console.log(e.currentTarget.dataset.index)
    this.setData({
      etextindex: e.currentTarget.dataset.index
    })
    // debugger;
    var day1 = new Date()
    var that = this
    if (e.currentTarget.dataset.index == 0) {
      let starttime = day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate() + ' ' + '00:00:00'
      let stoptime = day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate() + ' ' + '24:00:00'
      thisgetData(this.data.kolinfo.kolid, starttime, stoptime, 0)
    } else {
      // this.echartsComponnet = this.selectComponent('#mychart');
      // var totalDay = this.mGetDate(day1.getFullYear(), day1.getMonth() + 1)
      // let starttime = day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-00" + " " + '00:00:00'
      // let stoptime = day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + totalDay + " " + '00:00:00'
      // thisgetData(this.data.kolinfo.kolid, starttime, stoptime, 1)
      // thisinit_echarts();
    }
    // this.setData({
    //   etextindex: e.currentTarget.dataset.index
    // })
  },
  //   就钻交易信息
  // 开始 -结束
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  // 实时交易情况、成交切换 
  exchangeSuo_ch: function(e) {
    let sindex = e.target.id;
    this.setData({
      sindex: sindex,
      num: sindex,
      numone: 0
    })
    if (sindex == 1) { //我的成交
      this.getmycommitlog(this.data.kolinfo.kolid)
    } else if (sindex == 0) { //所有交易
      this.getcommitlog(this.data.kolinfo.kolid, 0, 10)
    }
  },
  //我的成交
  getmycommitlog(kolid) {
    console.log('kolid', kolid)
    util.http.postJson("fn/user/get/admin",{
      'act': 'Diamond_commitlog',
      'kol_id': kolid,
      'user_id': wx.getStorageSync('userid'),
    }, function(res) {
      console.log('aa', res.data.mypending.length != 0)
      if (!res.data.mydeal || res.data.mydeal.length == 0) {
        this.setData({
          myexchangeSuo: []
        })

      }
      if (!res.data.mypending || res.data.mypending.length == 0) {
        this.setData({
          forsell: 0,
          tobuy: 0
        })
      }
      if (!!res.data.mypending && res.data.mypending.length != 0) {
        this.setData({
          buytime: res.data.mypending[0].buytime,
          buycount: res.data.mypending[0].buycount,
          buyprice: res.data.mypending[0].buyprice,
          tobuy: res.data.mypending[0].tobuy,
          selltime: res.data.mypending[0].selltime,
          sellcount: res.data.mypending[0].sellcount,
          sellprice: res.data.mypending[0].sellprice,
          forsell: res.data.mypending[0].forsell,
          chengjiaoid: res.data.mypending[0].id
        })
      }
      if (!!res.data.mydeal && res.data.mydeal.length != 0) {
        let mypen = []
        let dealarray = [];
        for (let i = 0; i < res.data.mydeal.length; i++) {
          let deal = {}
          deal.cont = res.data.mydeal[i].count
          deal.price = res.data.mydeal[i].price
          deal.time = res.data.mydeal[i].time
          deal.id = res.data.mydeal[i].id
          deal.status = res.data.mydeal[i].status
          deal.type = res.data.mydeal[i].type
          deal.status = res.data.mydeal[i].status
          deal.isdeal = 1
          dealarray.push(deal)
        }
        mypen = mypen.concat(dealarray)
        console.log('mypen', mypen)
        this.setData({
          myexchangeSuo: mypen
        })
      }
    });
  },
  //所有交易获取
  getcommitlog(kolid, offset, limit) {
    console.log(kolid, offset, limit)
    util.http.postJson("fn/user/get/admin",{
      'act': 'Diamond_realtimetrading',
      'kol_id': kolid,
      'offset': offset,
      'limit': limit,
    }, function(res) {
      if (!res.data) {
        this.setData({
          shishijiapoyi: []
        })
        return;
      }
      this.setData({
        shishijiapoyi: res.data
      })
    });
  },
  // 点击日期事件
  selDate(e) {
    // 年
    var year = e.currentTarget.dataset.year
    // 月
    var mouth = util.formatNumber(e.currentTarget.dataset.mouth)
    // 天
    var day = util.formatNumber(e.currentTarget.dataset.day)
    if (day == "00") {
      return
    }
    console.log(year, mouth, day)
    let starttime = year + "-" + mouth + "-" + day + " " + '00:00:00'
    let stoptime = year + "-" + mouth + "-" + day + " " + '24:00:00'


    var thisdate = new Date(starttime).getTime()
    if (new Date().getTime() < thisdate) {
      let nowdata = new Date().getDate()
      wx.showModal({
        content: '请选择小于' + nowdata + '号的时间',
      })
      return;
    }
    console.log(starttime)
    this.setData({
      etdata: day,
      etmouth: mouth,
      etyear: year,
      dateshow: 0
    })
    // console.log('aaa', this.data.kolinfo.kolid)
    this.getData(this.data.kolinfo.kolid, starttime, stoptime, this.data.etextindex)
  },
  //点击空白处
  cleardateshow() {
    this.setData({
      dateshow: 0
    })
  },
  //点击获取月份
  selmouth(e) {
    var year = e.currentTarget.dataset.year
    var mouth = util.formatNumber(e.currentTarget.dataset.mouth)

    console.log('data', year, mouth)
    var totalDay = this.mGetDate(year, mouth)
    let starttime = year + "-" + mouth + "-00" + " " + '00:00:00'
    let stoptime = year + "-" + mouth + "-" + totalDay + " " + '00:00:00'
    let moutime = year + "-" + mouth + "-01" + " " + '00:00:00'

    var thismouth = new Date(moutime).getTime()
    console.log('aa', starttime, thismouth, new Date().getTime())
    if (new Date().getTime() < thismouth) {
      let nowdata = new Date().getMonth() + 1

      wx.showModal({
        content: '请选择小于' + nowdata + '月份的时间',
      })
      return;
    }
    this.setData({
      etdata: 0,
      etmouth: mouth,
      etyear: year,
      dateshow: 0,
      totalDaynum: totalDay + 1
    })
    this.getData(this.data.kolinfo.kolid, starttime, stoptime, this.data.etextindex)
  },
  //获取某月的天数
  mGetDate(year, month) {
    var d = new Date(year, month, 0);
    return d.getDate();
  },

  //增加年份
  plusyear() {
    this.setData({
      thisgre: 100
    })
    this.data.year++
      this.setData({
        year: this.data.year
      })
  },
  //减少年份
  minusyear() {
    this.setData({
      thisgre: 100
    })
    this.data.year--
      this.setData({
        year: this.data.year
      })
  },
  //用户点击减少月份
  minusMouth: function() {
    var mouth;
    var year;
    mouth = this.data.mouth
    year = this.data.year
    mouth--
    if (mouth < 1) {
      mouth = 12
      year--
    }
    this.setData({
      thisgre: 100
    })
    this.updateDays(year, mouth)
  },
  //用户点击增加月份
  plusMouth: function() {
    var mouth;
    var year;
    mouth = this.data.mouth
    year = this.data.year
    mouth++
    if (mouth > 12) {
      mouth = 1
      year++
    }
    this.setData({
      thisgre: 100
    })
    this.updateDays(year, mouth)
  },
  //
  dateData: function() {
    var date = new Date();
    var days = [];
    var year = date.getFullYear();
    var mouth = date.getMonth() + 1;
    this.updateDays(year, mouth)

  },
  updateDays: function(year, mouth) {
    var days = [];
    var dateDay, dateWeek;
    // 根据日期获取每个月有多少天
    var getDateDay = function(year, mouth) {
      return new Date(year, mouth, 0).getDate();
    }
    //根据日期获取这天是周几
    var getDateWeek = function(year, mouth) {

      return new Date(year, mouth - 1, 1).getDay();
    }
    dateDay = getDateDay(year, mouth)
    dateWeek = getDateWeek(year, mouth)


    //向数组中添加天
    let biaozhi = false
    for (let index = 1; index <= dateDay; index++) {
      days.push(index)
      if (biaozhi == false) {
        let nowdata = new Date().getTime()
        let thistime = new Date(year, mouth - 1, index).getTime()
        console.log('time', nowdata, thistime)
        if (thistime > nowdata) {
          console.log('index', index, thistime, nowdata)
          this.setData({
            thisgre: index
          })
          biaozhi = true
        }
      }

    }
    //向数组中添加，一号之前应该空出的空格
    for (let index = 1; index <= dateWeek; index++) {
      days.unshift(0)
    }
    this.setData({
      days: days,
      year: year,
      mouth: mouth,
    })
  },




  //撤销委托
  revocation(e) {
    var _this = this
    let id = e.currentTarget.dataset.id
    console.log('aaa', e)
    if (e.currentTarget.dataset.tobuy == 1) {
      wx.showModal({
        title: '撤销委托确认',
        content: '您确认撤销该笔交易订单吗？',
        success(res) {
          if (res.confirm) {
            util.http.postJson("fn/user/get/admin",{
              'act': 'Diamond_stopbuy',
              'id': _this.data.chengjiaoid
            }, function(res) {
              // console.log('1111', _this.data.kolinfo.kolid)
              if (res.ok) {
                _this.getmycommitlog(_this.data.kolinfo.kolid)
              } else {
                wx.showModal({
                  title: '委托失败',
                })
              }
            })
          } else {
            console.log('2')
          }
        }
      })
    } else {
      wx.showModal({
        title: '撤销委托确认',
        content: '您确认撤销该笔交易订单吗？',
        success(res) {
          if (res.confirm) {
            util.http.postJson("fn/user/get/admin",{
              'act': 'Diamond_stopsell',
              'id': _this.data.chengjiaoid
            }, function(res) {
              if (res.ok) {
                _this.getmycommitlog(_this.data.kolinfo.kolid)
              } else {
                wx.showModal({
                  title: '委托失败',
                })
              }
            })
          } else {
            console.log('2')
          }
        }
      })
    }
  },
  // 显示所有kol
  show: function() {
    this.setData({
      goodsexchangeSuoflag: true
    })

  },
  // 遮罩层隐藏
  conceal: function() {
    this.setData({
      goodsexchangeSuoflag: false
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
    for (let i = 0; i < 25; i++) {
      numberList.push(0);
      dataList.push(i);
    }
    // 请求酒钻交易
    this.getkolinfo(0)
    this.echartsComponnet = this.selectComponent('#mychart');
    // this.init_echarts();
    this.dateData();
    var myDate = new Date(); //获取系统当前时间
    var nowDate = util.formatNumber(myDate.getDate())
    var nowMouth = util.formatNumber(myDate.getMonth() + 1)
    var nowYear = myDate.getFullYear();
    this.setData({
      etdata: nowDate,
      etmouth: nowMouth,
      etyear: nowYear,
      nowDate: nowDate
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
    if (this.data.sindex == 0) { //所有交易
      let length = this.data.shishijiapoyi.length + 10
      this.getcommitlog(this.data.kolinfo.kolid, 0, length)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})