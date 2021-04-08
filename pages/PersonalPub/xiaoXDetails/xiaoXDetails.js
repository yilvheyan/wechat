const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        xiaoXiInform: {},
        isinfos: 1,
        infoid: 0

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.data.infoid = options.id;
        this.setData({
            height: util.getallheigth().clientHeight
        })
        //消息通知
        util.http.postJson("fn/user/get/admin",{
            'act': 'Personal_infos',
        }, function(res) {
            if (res.data == undefined) {
                this.setData({
                    isinfos: 0
                })
                return
            }
            for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].id == thisdata.infoid) {
                    res.data[i].content = res.data[i].content.split('\n');
                    this.setData({
                        xiaoXiInform: res.data[i],
                        isinfos: 1
                    })
                }
            }
        })
        this.readed(this.data.infoid);
    },

    readed(id) { //have readed
        util.http.postJson("fn/user/get/admin",{
            'act': 'Personal_readinfos',
            'id': id
        }, function(res) {

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