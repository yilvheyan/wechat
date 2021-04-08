const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    expressname: "韵达",
    phone: "62554",
    bianhao: "4300567588290",
    wuliuinfo: [],
    wuLiuInformation: {
      "status": "0",
      "msg": "ok",
      "result": {
        "number": "9896650419889",
        "type": "CHINAPOST",
        "list": [{
            "time": "2019-10-24 22:55:33",
            "status": "[自提柜]已签收，签收人凭取货码签收。感谢使用邮政国内小包及徐泾北城海棠馨苑南区21号楼西南电动车库处2号柜菜鸟智能柜【自提柜】，期待再次为您服务。"
          },
          {
            "time": "2019-10-24 10:15:22",
            "status": "[自提柜]您的快件已存放至徐泾北城海棠馨苑南区21号楼西南电动车库处2号柜菜鸟智能柜【自提柜】，请及时取件。有问题请联系派件员15660649828"
          },
          {
            "time": "2019-10-24 08:19:23",
            "status": "【长宁虹桥徐泾揽投部】安排投递,投递员:刘迪,电话:15821562251"
          },
          {
            "time": "2019-10-23 22:06:30",
            "status": "到达【长宁虹桥徐泾揽投部】"
          },
          {
            "time": "2019-10-23 20:55:42",
            "status": "离开【上海中心局邮件处理中心】，下一站【长宁虹桥徐泾揽投部】（经转）"
          },
          {
            "time": "2019-10-23 18:44:55",
            "status": "到达【上海中心局邮件处理中心】（经转）"
          },
          {
            "time": "2019-10-23 00:04:51",
            "status": "离开【河南省邮件处理中心】，下一站【上海中心局邮件处理中心】（经转）"
          },
          {
            "time": "2019-10-22 20:22:41",
            "status": "到达【河南省邮件处理中心】（经转）"
          },
          {
            "time": "2019-10-22 14:58:31",
            "status": "离开【河南省永城市大宗揽收营业部】，下一站【河南省邮件处理中心】"
          },
          {
            "time": "2019-10-22 13:06:44",
            "status": "【河南省永城市大宗揽收营业部】已收件,揽投员:王淑兰"
          },
          {
            "time": "2019-10-22 11:52:54",
            "status": "您的订单待配货"
          },
          {
            "time": "2019-10-21 13:17:30",
            "status": "您的订单开始处理"
          },
          {
            "time": "2019-10-21 13:09:45",
            "status": "商品已经下单"
          }
        ],
        "deliverystatus": 3,
        "issign": 1,
        "expName": "邮政快递包裹",
        "expSite": "www.chinapost.com.cn ",
        "expPhone": "11183",
        "logo": "http://img3.fegine.com/express/yzpy.jpg",
        "courier": "",
        "courierPhone": "",
        "updateTime": "2019-10-24 22:55:33",
        "takeTime": "3天9小时45分"
      }
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.setData({
    //     height: util.getallheigth().clientHeight
    // })
    if (options.whogeto == 'yushou') {
      // 查询预售物流
      util.http.postJson("fn/user/get/admin",{
        'act': 'Order_presaleLogistics',
        'orderid': options.orderid
      }, function(res) {
        if (res.data.code == 10001) {
          wx.showModal({
            title: '获取物流信息失败！',
            content: '',
          })
          return;
        }
        let data = thisdata.wuLiuInformation
        this.setData({
          wuLiuInformation: data,
          wuliuinfo: data.result.list
        })
        console.log('wuliuinfo'.data.wuliuinfo)
      })
    }
    if (options.whogeto == 'jiushi') {
      // 查询酒市物流
      util.http.postJson("fn/user/get/admin",{
        'act': 'Order_shopLogistics',
        'orderid': options.orderid
      }, function(res) {
        if (res.data.code == 10001) {
          wx.showModal({
            title: '获取物流信息失败！',
            content: '',
          })
          return;
        }
        let data = res.data
        this.setData({
          wuLiuInformation: data,
          wuliuinfo: data.result.list
        })
        console.log('wuliuinfo'.data.wuliuinfo)
      })
    }
    if (options.whogeto == 'jifen') {
      // 查询积分物流
      util.http.postJson("fn/user/get/admin",{
        'act': 'Order_scoresLogistics',
        'orderid': options.orderid
      }, function(res) {
        if (res.data.code == 10001) {
          wx.showModal({
            title: '获取物流信息失败！',
            content: '',
          })
          return;
        }
        let data = thisdata.wuLiuInformation
        this.setData({
          wuLiuInformation: data,
          wuliuinfo: data.result.list
        })
        console.log('wuliuinfo'.data.wuliuinfo)
        


      })
    }

  },



  // 点击复制
  copyText: function(e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function(res) {}
    })

  },




  //拨打电话
  kfphone() {
    wx.makePhoneCall({
      phoneNumber: '400-850-8805' //仅为示例，并非真实的电话号码
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})