const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kolinfo: {
      kolname: '',
      price: ''
    },

    kollist: [],
    buyprise: 0, //买入价
    buynum: 0,
    sellprise: 0, //出售价格
    sellnum: 0,
    buynumval: '',
    allsellprise: 0,
    sellvalue: '',
    myscorse: 200, //可用积分
    usejiuznum: 0, //可买酒砖数量
    jiuznum: 0, //酒钻数量
    buyinfo: { //信息
      kolid: 0,
      id: 0
    },
    sindex: 0, //
    num: 0, // 酒钻买入、酒钻卖出
    bazaarnumber: [],
    message: [{
        id: '0',
        text: "酒钻买入"
      },

      {
        id: '1',
        text: '酒钻卖出'
      }
    ],
    jiuZuandealview: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 请求酒钻交易
    this.setData({
      myscorse: (parseInt(options.myscorse * 100) / 100).toFixed(2)
      // myscorse: parseFloat(options.myscorse) 
    })
    this.getkolinfo(options.index)
  },
  // kol列表
  choekol(e) {
    console.log('e.currentTarget.dataset.index', e.currentTarget.dataset.index)
    this.getkolinfo(e.currentTarget.dataset.index)
    this.setData({
      goodsexchangeSuoflag: false
    })
  },
  // 获取kol信息
  getkolinfo(numindex) {
    util.http.postJson("fn/user/get/admin",{
      'act': 'Diamond_diamond',
    }, function(res) {
      //kol头像
      if (!res.data) {
        return;
      }
      for (let i = 0; i < res.data.realcount.length; i++) {
        res.data.realcount[i].headpic = imageUrl + res.data.realcount[i].headpic
      }

      thisdata.kolinfo.headpic = res.data.realcount[numindex].headpic
      thisdata.kolinfo.kolname = res.data.realcount[numindex].name
      thisdata.kolinfo.price = res.data.realcount[numindex].price
      thisdata.buyinfo.kolid = res.data.realcount[numindex].id
      // thisdata.jiuznum=res.data
      if (res.data.realcount[numindex].mycount.length != 0) {
        thisdata.buyinfo.id = res.data.realcount[numindex].mycount[0].id
        thisdata.jiuznum = res.data.realcount[numindex].mycount[0].count
      } else {
        thisdata.buyinfo.id = 0
        thisdata.jiuznum = 0
      }
      res.data.myscores.remainscores = res.data.myscores.remainscores.toFixed(2);
      thisgetmarketsell()
      this.setData({
        kolinfo: thisdata.kolinfo,
        kollist: res.data.realcount,
        jiuznum: thisdata.jiuznum,
        myscorse: res.data.myscores.remainscores
      });
    });
  },
  //市场挂单---------买入
  getmarketbuy() {
    util.http.postJson("fn/user/get/admin",{
      'act': 'Diamond_marketbuy',
      'kol_id': this.data.buyinfo.kolid
    }, function(res) {
      let bazaarnumber = res.data.markets
      let aa = parseInt(res.data.totalmarkets)
      for (let i = 0; i < bazaarnumber.length; i++) {
        bazaarnumber[i].allbuycount = aa
        aa -= bazaarnumber[i].buycount
      }
      // console.log('aaa', bazaarnumber[0].allbuycount)
      this.setData({
        bazaarnumber: bazaarnumber
      })

    })
  },


  //市场挂单---------卖出
  getmarketsell() {
    console.log('kolid', this.data.kolid)
    util.http.postJson("fn/user/get/admin",{
      'act': 'Diamond_marketsell',
      'kol_id': this.data.buyinfo.kolid
    }, function(res) {
      if (!res.data) {
        return;
      }
      let bazaarnumber = res.data.markets
      let aa = parseInt(res.data.totalmarkets)
      for (let i = 0; i < bazaarnumber.length; i++) {
        bazaarnumber[i].allsellcount = aa
        aa -= bazaarnumber[i].sellcount
      }
      console.log('aaa', bazaarnumber)
      this.setData({
        bazaarnumber: bazaarnumber
      })
    })
  },






  //买入时出价
  buyprise(e) {
    this.data.buyprise = e.detail.value
    let v1 = e.detail.value;
    if (v1<=0){
      this.toshow("价格问题", '不能输入小于0！')
      v1='';
      return;
    }
    if (v1.toString().split(".")[1]) {
      if (v1.toString().split(".")[1].length > 2) {
        this.data.buyprise = parseFloat(v1).toFixed(2);
      }
    }
    this.setData({
      inputbuyprise: this.data.buyprise,
      usejiuznum: Math.floor(this.data.myscorse / this.data.buyprise)
    })

  },
  //买入时的数量
  buynum(e) {
    if (this.data.buyprise == 0) {
      this.toshow('出售价格', '请先输入您的售价')
      this.setData({
        buynumval: ''
      })
      return
    }
    let v1 = e.detail.value;
    if (v1 == 0) {
      v1='';
      this.toshow("价格问题", '不能输入为0！')
      return;
    }
    if (v1.toString().split(".")[1]) {
      this.toshow('酒钻个数', '就钻数量不能有小数！')
      let val = parseInt(v1);
      this.setData({
        buynumval: val
      })
    }
    if (this.data.usejiuznum != 0) {
      if (this.data.usejiuznum < e.detail.value) {
        this.toshow('酒钻超出', '当前积分不足，请重新输入')
        this.setData({
          buynumval: ''
        })
        return
      }
    }
    this.data.buynum = v1
  },
  //卖出时出价
  sellprise(e) {
    let v1 = e.detail.value;
    if (v1 <= 0) {
      this.toshow("价格问题", '不能输入小于0！')
      v1='';
    }
    if (v1.toString().split(".")[1]) {
      if (v1.toString().split(".")[1].length > 2) {
        v1 = parseFloat(v1).toFixed(2);
      }
    }
    this.setData({
      sellprise: v1,
      intsellprise: v1,
      allsellprise: e.detail.value * this.data.sellnum
    })
  },
  //卖出时的数量
  sellnum(e) {
    if (e.detail.value > this.data.jiuznum) {
      this.toshow('酒钻超出', '该数量已超出持有数量,请重新输入')
      this.setData({
        sellvalue: '',
        allsellprise: 0
      })
      return
    }
    let v1 = e.detail.value;
    if (v1 == 0) {
      v1='';
      this.toshow("价格问题", '不能输入为0！')
      return;
    }
    if (v1.toString().split(".")[1]) {
      this.toshow('酒钻个数', '酒钻数量不能有小数！')
      let val = parseInt(v1);
      this.setData({
        sellvalue: val
      })
    }

    this.data.sellnum = e.detail.value
    this.setData({
      sellnum: e.detail.value,
      allsellprise: e.detail.value * this.data.sellprise
    })
  },

  //弹窗
  toshow(title, content) {
    wx.showModal({
      title: title,
      content: content,
    })
  },

  // 确认挂单
  jiuZuanResult() {
    //买入时
    if (wx.getStorageSync('openid') == 'abcdef') {
      let popup = this.selectComponent("#popup");
      popup.show(() => {

      })
      return;
    }
    if (!wx.getStorageSync('phone')) {
      let phonepopup = this.selectComponent("#phonepopup");
      phonepopup.show(() => {

      })
      return;
    }
    if (this.data.sindex == 0) {
      if (this.data.buyprise == 0) {
        this.toshow('出价', '请填入您的出售价格')
        return
      }
      if (this.data.buynum == 0) {
        this.toshow('酒钻数量', '请填入您所需要的酒钻数量')
        return
      }
      if (this.data.buyinfo.id == 0) { //没有在他预售那里买过
        // console.log('aaaa')
        this.buyjiuzuan({
          'act': 'Diamond_buy',
          'kol_id': this.data.buyinfo.kolid,
          'user_id': wx.getStorageSync('userid'),
          'buycount': this.data.buynum,
          'buyprice': this.data.buyprise
        })
      }
      if (this.data.buyinfo.id != 0) { //有在他预售那里买过
        // console.log('bbbb')
        this.buyjiuzuan({
          'act': 'Diamond_buy',
          'kol_id': this.data.buyinfo.kolid,
          'user_id': wx.getStorageSync('userid'),
          'buycount': this.data.buynum,
          'buyprice': this.data.buyprise,
          'id': this.data.buyinfo.id
        })
      }
    }
    //卖出时
    if (this.data.sindex == 1) {
      if (this.data.sellprise == 0) {
        this.toshow('出价', '请填入您的出售价格')
        return
      }
      if (this.data.sellnum == 0) {
        this.toshow('酒钻数量', '请填入您所需要的酒钻数量')
        return
      }
      if (this.data.buyinfo.id == 0) { //没有在他预售那里买过
        // console.log('aaaa')
        this.buyjiuzuan({
          'act': 'Diamond_sell',
          'kol_id': this.data.buyinfo.kolid,
          'user_id': wx.getStorageSync('userid'),
          'sellcount': this.data.sellnum,
          'sellprice': this.data.sellprise
        })
      }
      if (this.data.buyinfo.id != 0) { //有在他预售那里买过
        // console.log('bbbb')
        this.buyjiuzuan({
          'act': 'Diamond_sell',
          'kol_id': this.data.buyinfo.kolid,
          'user_id': wx.getStorageSync('userid'),
          'sellcount': this.data.sellnum,
          'sellprice': this.data.sellprise,
          'id': this.data.buyinfo.id
        })
      }
    }
  },
  // 酒钻买入
  buyjiuzuan(json) {
    util.http.postJson("fn/user/get/admin",json, function(res) {
      if (res.ok) {
        wx.navigateTo({
          url: '/pages/JiaoYiplate/jiuZuanResult/jiuZuanResult',
        })
      }
    });
  },
  // 遮罩层显示
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
  // 实时交易情况、成交切换 
  jiuZuandeal_ch: function(e) {
    let sindex = e.target.id;
    this.setData({
      sindex: sindex,
      num: sindex,
      numone: 0
    })
    if (sindex == 0) {
      this.getmarketsell()
    } else {
      this.getmarketbuy()
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})