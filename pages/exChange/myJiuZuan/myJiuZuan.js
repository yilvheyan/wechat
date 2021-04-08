const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        grade: '',
        jiuzuanbili: 1,
        mycorkscrew: [{ //积分兑换酒钻记录
            img: "http://qiniu-test.ishzm.com/jxb/img/profilephoto.png",
            name: "周杰伦白酒",
            time: "2019.05.05",
            state: "进行中",
            jznumber: "100",
            price: "1.63"
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 请求个人中心酒钻
        this.setData({
            grade: options.remaindiamond,
            mygains: options.yestodaywineDrill,
            freezetotal: options.freezediamond
        })
        util.http.postJson("fn/user/get/admin",{
            'act': 'Diamond_mydiamond',
        }, function(res) {
            if (res.ok) {
                //kol头像
                for (let i = 0; i < res.data.mylog.length; i++) {
                    res.data.mylog[i].kolinfo.headpic = imageUrl + res.data.mylog[i].kolinfo.headpic
                }
                this.setData({
                    mycorkscrew: res.data.mylog,
                    // freezemycorkscrew: res.data.freezediamond[0]
                });
            }
        });
    },
    //酒钻明细
    mycorkscrew() {
        wx.navigateTo({
            url: '/pages/exChange/jiuZuanDetail/jiuZuanDetail'
        })
    },
    // 酒钻交易
    jiuzuandeal() {
        console.log("111")
        wx.switchTab({
            url: '/pages/exchangeSuo/exchangeSuo',
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