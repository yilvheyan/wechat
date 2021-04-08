const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')



Page({

    /**
     * 页面的初始数据
     */
    data: {
        lianXiService: false,
        contact: [],
        question: '',
        answer: ''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        util.http.postJson("fn/user/get/admin",{
            'act': 'Personal_contact',
        }, function(res) {
            this.setData({
                contact: res.data
            })
        })
    },
    // 遮罩层显示
    show: function(e) {
        //获取下标
        var idx = e.currentTarget.dataset.index;
        util.http.postJson("fn/user/get/admin",{
            'act': 'Personal_contact',
        }, function(res) {
            this.setData({
                question: res.data[idx].question,
                answer: res.data[idx].answer
            })
        })
        this.setData({
            lianXiService: true
        })
    },
    // 遮罩层隐藏
    conceal: function() {
        this.setData({
            lianXiService: false
        })
    },
    //客服电话
    servicephone() {
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