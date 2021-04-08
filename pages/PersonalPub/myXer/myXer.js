const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shopuid: 0,
        shopname: '',
        recruitment: [
            // {
            // id: "0",
            // img: "http://qiniu-test.ishzm.com/jxb/img/myStore/path.png",
            // name: '风流淌的云',
            // image: "http://qiniu-test.ishzm.com/jxb/img/myStore/recruitment_img.png",
            // time: "2019.7.28"
            // }
        ]
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) { 
        this.data.shopuid = options.shopuid
        this.data.shopname = options.shopname
        util.http.postJson("fn/user/get/admin",{
            'act': 'Waiter_waiterList'
        }, function(res) {
            var orderallmoney = 0
            for (var i = 0; i < res.data.data.length; i++) {

                orderallmoney += res.data.data[i].totalmoney
                var patt = /http/
                let thisplayimage = res.data.data[i].heads.head
                if (!patt.test(thisplayimage)) {
                    res.data.data[i].heads.head = imageUrl + thisplayimage
                }
                res.data.data[i].time = util.formatTimeByTs(res.data.data[i].time, 'Y/M/D')
            }
            this.setData({
                waiterList: res.data.data
            })
        })

    },
    // 招募小二
    skintmentxer() {
        wx.navigateTo({
            url: '/pages/PersonalPub/recruitmentXer/recruitmentXer?shopuid=' + this.data.shopuid + "&shopname=" + this.data.shopname,

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
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },


})