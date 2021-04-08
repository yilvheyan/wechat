const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        iscolorgray: false,
        peopleinfo: {
            name: '',
            idcard: '',
            bank: ""
        },
        idarry: [],
        allmoney: 0
    },
    tanchuagn(title) {
        wx.showToast({
            title: title,
            icon: 'none',
            duration: 2000
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log('options', options)
        this.data.peopleinfo.money = options.allnomey
        this.data.idarry = wx.getStorageSync('idarry')
        this.setData({
            allmoney: options.allnomey
        })
    },
    userNameInput(e) {
        this.data.peopleinfo.name = e.detail.value
        this.setData({
            iscolorgray: false
        })
    },
    phoneInput(e) {
        this.data.peopleinfo.idcard = e.detail.value
        this.setData({
            iscolorgray: false
        })
    },
    addressInput(e) {
        this.data.peopleinfo.bank = e.detail.value
        this.setData({
            iscolorgray: false
        })
    },
    tijiaofankui() {
        console.log("name", this.data.peopleinfo.name)
        if (this.data.peopleinfo.name == '') {
            this.tanchuagn('请填写联系人')
            return;
        } else if (this.data.peopleinfo.idcard == '' || this.data.peopleinfo.idcard.length != 19 && this.data.peopleinfo.idcard.length != 17 && this.data.peopleinfo.idcard.length != 16) {
            this.tanchuagn('请填写正确的银行卡号')
            return;
        } else if (this.data.peopleinfo.bank == '') {
            this.tanchuagn('请填写开户行')
            return;
        } else {
            util.http.postJson("fn/user/get/admin",{
                'act': 'Scores_withdrawal',
                'name': this.data.peopleinfo.name,
                'idcard': this.data.peopleinfo.idcard,
                'bank': this.data.peopleinfo.bank,
                'money': this.data.peopleinfo.money,
                'order': this.data.idarry
            }, function(res) {
                this.setData({
                    iscolorgray: true
                })
                if (res.ok) {
                    wx.showToast({
                        title: '已提交，请耐心等待审核',
                        icon: 'none',
                        duration: 2000
                    }) 
                    setTimeout(function() {
                        wx.reLaunch({
                            url: '/pages/home/home'
                        })
                    }, 2000);
                }else{
                  wx.showToast({
                    title: '提现失败！',
                    icon: 'none',
                    duration: 2000
                  })
                }
            })
        }
    }
})