// pages/quKuaiLian/quKuaiLian.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      id:'',
      url:'https://qkl.jxb.zifore.com/weixin/index.html?code=aaaaaa'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) { 
        console.log("options", options);
        options=options||{};
        var id = decodeURIComponent(options.q);
        var code=id.split('/codez/')[1]||"aaaaaa";
        this.setData({
          id: id,
          code:code,
          url:'https://qkl.jxb.zifore.com/weixin/index.html?code='+code
        })
    },
    

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})