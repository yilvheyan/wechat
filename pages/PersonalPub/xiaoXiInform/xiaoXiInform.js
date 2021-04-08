const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        xiaoXiInform: [],
        isinfos: 1,
        infoid: 0,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            height: util.getallheigth().clientHeight
        })

        this.getinfo();
    },
    //消息通知详情
    goparticulars(e) {
        wx.redirectTo({
            url: '/pages/PersonalPub/xiaoXDetails/xiaoXDetails?id=' + e.currentTarget.dataset.infoid
        })
    },
    //删除消息
    deleteinfinfo(e) {
        let id = e.currentTarget.dataset.infoid
        var _this = this
        wx.showModal({
            title: '删除信息',
            content: '确定删除该信息',
            success: (res) => {
                if (res.confirm) {
                    util.http.postJson("fn/user/get/admin",{
                        'act': 'Personal_deleteinfos',
                        'id': id
                    }, function(res) {
                        _this.getinfo();
                    }, _this)
                } else { //这里是点击了取消以后
                    console.log('用户点击取消')
                }
            }
        })
    },
    //消息通知
    getinfo() {
        util.http.postJson("fn/user/get/admin",{
            'act': 'Personal_infos',
        }, function(res) {
            if (res.data == undefined) {
                this.setData({
                    xiaoXiInform: [],
                    isinfos: 0
                })
                return
            }
            this.setData({
                xiaoXiInform: res.data,
                isinfos: 1
            })
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