// 店主身份认证
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        iDCard: '',
        realname: '',
        orderId: '',
        sptschekde: false,
        region: ['选择位置'],
        nowadree: '默认当前位置',
        ifchoseadress: 2
    },
    idCardInput: function(e) {
        this.setData({
            iDCard: e.detail.value
        });
    },
    realNameInput: function(e) {
        this.setData({
            realname: e.detail.value
        });
    },
    //选择地址
    bindRegionChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        if (e.detail.value[0] == e.detail.value[1]) {
            e.detail.value[0] = ''
        }
        this.setData({
            region: e.detail.value[1],
            ifchoseadress: 1
        })
    },
    //默认当前地址
    nowadresscli() {
        util.getAddress();
        let time = setInterval(() => {
            if (wx.getStorageSync('address_component') != '') {
                console.log(wx.getStorageSync('address_component'))
                this.setData({
                    nowadree: wx.getStorageSync('address_component').city,
                    ifchoseadress: 0
                })
                wx.removeStorageSync('address_component')
                clearInterval(time)
            }
        }, 500)
    },
    //重新选择
    nowadressclireget() {
        this.setData({
            ifchoseadress: 2
        })
    },
    //点击协议
    xieyicli() {

        this.setData({
            sptschekde: !this.data.sptschekde
        });
    },
    //同意
    clause() {

        this.setData({
            sptschekde: true,
            goodsOrderflag: false
        });
    },
    //确认开店
    shopkerticationclick() {
        var idCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份认证
        if (this.data.iDCard == '' || !idCard.test(this.data.iDCard)) {
            wx.showModal({
                title: '请正确填写身份证。'
            })
            return
        }
        if (this.data.realname == '') {
            wx.showModal({
                title: '姓名不能为空。'
            })
            return
        }
        if (this.data.sptschekde == false) {
            wx.showModal({
                title: '请先阅读协议'
            })
            return
        }
        console.log(this.data.orderId)

        let shopAdress = ''
        if (this.data.ifchoseadress == 1) {
            shopAdress = this.data.region
        }
        if (this.data.ifchoseadress == 0) {
            shopAdress = this.data.nowadree
        }
        console.log(shopAdress)


      util.http.postJson("fn/user/ext/openshop",{
            'orderid': this.data.orderId,
            'IDCard': this.data.iDCard,
            'realname': this.data.realname,
            'address': shopAdress
        }, (res)=> {
            if (res.ok) {
                wx.setStorageSync('rolestate', res.data.rolestate)
                wx.showModal({
                    title: '提示',
                    content: '已经申请成功，是否返回预售。',
                    showCancel: true, //是否显示取消按钮
                    cancelText: "否", //默认是“取消”
                    confirmText: "是", //默认是“确定”
                    success: function(res) {
                        if (res.cancel) {
                            //点击取消,默认隐藏弹框
                        } else {
                            //   wx.setStorageSync('rolestate', 1)
                            //点击确定
                            wx.reLaunch({
                                url: "/pages/newProduct/salell/salell"
                            })
                        }
                    }
                })
            } else {
                wx.showModal({
                    title: '申请失败。'
                })
            }
        })
    },
    //点击已阅读并同意店主服务协议 遮罩层隐藏
    show: function() {
        this.setData({
            goodsOrderflag: true

        })
    },
    conceal: function() {
        this.setData({
            goodsOrderflag: false
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log('options:', options);
        this.setData({
            orderId: options.id
        });
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