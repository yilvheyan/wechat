// pages/shopSetUp/shopSetUp.js
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shopname: '',
        shopuid: 0,
        headerimg: '',
        userid: 0,
        num: 0,
        sindex: 0,
        showset: {

        },
        num: 0,
        // 修改皮肤的内容
        recommendpf: [{},
            {},
            {},
            {},
            {},
            {}

        ],
        modification: [{
                id: "0",
                name: "推荐"
            },
            {
                id: "1",
                name: "经典"
            },
            {
                id: "2",
                name: "复古"
            },
            {
                id: "3",
                name: "现代"
            },

        ],

        showlist: [

        ],
        click: false, //是否显示弹窗内容
        option: false, //显示弹窗或关闭弹窗的操作动画

    },

    // 用户点击显示弹窗
    clickPup: function() {
        let _that = this;
        if (!_thisdata.click) {
            _this.setData({
                click: true,
            })
        }

        if (_thisdata.option) {
            _this.setData({
                option: false,
            })

            // 关闭显示弹窗动画的内容，不设置的话会出现：点击任何地方都会出现弹窗，就不是指定位置点击出现弹窗了
            setTimeout(() => {
                _this.setData({
                    click: false,
                })
            }, 100)


        } else {
            _this.setData({
                option: true
            })
        }
    },
    // 修改皮肤页面top切换
    setonclickList: function(e) {
        // console.log(e)
        let num = e.target.id;
        console.log(num)
        this.setData({
            sindex: num,
            num: num
        })
    },





    //点击商品删除
    showdelet(e) {
        let _this = this
        console.log(e.currentTarget.dataset.id)
        wx.showModal({
            title: '删除商品',
            content: '您将删除该商品，是否确定',
            cancelText: '否',
            confirmText: '是',
            success(res) {
                if (res.cancel) {
                    return
                } else {
                    var id = parseInt(e.currentTarget.dataset.id)
                    util.http.postJson("fn/user/get/admin",{
                        'act': 'Shop_goodsLowerShelf',
                        'id': id
                    }, function(res) {
                        _this.getshuju();
                    })
                }
            }
        })
    },
    //   保存
    preservation() {
        wx.navigateBack({
            url: '/pages/PersonalPub/myStore/myStore?shopuid=' + this.data.shopuid + '&shopname=' + "我"
        })
    },

    //
    modification() {
        wx.navigateTo({
            url: '/pages/PersonalPub/changeInformation/changeInformation?shopuid' + this.data.shopuid + '&shopname=' + "我",
        })
    },
    // 修改皮肤
    actionSheetTap() {

    },

    //获取数据
    getshuju() {
        var userid = wx.getStorageSync('userid')
        console.log(userid)
        util.http.postJson("fn/user/get/admin",{
            'act': 'Shop_shopDetail',
            'uid': userid
        }, function(res) {
            for (let i = 0; i < res.data.goods.length; i++) {
                // res.data.goods[i].playimage = imageUrl + res.data.goods[i].playimage
                let banner = res.data.goods[i].playimage.split(',')
                for (var k = 0; k < banner.length; k++) {
                    banner[k] = imageUrl + banner[k]
                }
                res.data.goods[i].playimage = banner[0]

            }
            var patt = /http/
            let thisplayimage = res.data.account.head
            if (!patt.test(thisplayimage)) {
                res.data.account.head = imageUrl + thisplayimage
            }

            res.data.shop.background = imageUrl + res.data.shop.background
            this.setData({
                showlist: res.data.goods,
                showset: res.data.shop,
                headerimg: res.data.account.head
            });
        })
    },

    //添加按钮
    addWine() {
        wx.navigateTo({
            url: '/pages/PersonalPub/AddTheWine/AddTheWine?shopuid=' + this.data.shopuid + '&shopname=' + "我",
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.data.shopname = options.shopname
        this.data.shopuid = options.shopuid
        // this.getshuju();
        // this.data.userid = wx.getStorageSync('userid')

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
        this.getshuju();
        this.data.userid = wx.getStorageSync('userid')
        console.log("aaa", this.data.shopname)
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