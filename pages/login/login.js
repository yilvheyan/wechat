// pages/login/login.js
const app = getApp();
const publicUrl = app.globalData.publicUrl;
const util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: 'login',
        phone: '',
        password: '',
        isShowPassword: true,
        code: '',
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        code: '获取验证码',
        issend:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (!options.type) {
            
            return;
        }
        this.setData({
            type: options.type
        });
        switch (this.data.type) {
            case "registe":
                {
                    wx.setNavigationBarTitle({
                        title: '注册'
                    });

                    util.getOpenid();

                    // 在没有 open-type=getUserInfo 版本的兼容处理
                    if (!this.data.canIUse) {
                        wx.getUserInfo({
                            success: res => {
                                app.globalData.userInfo = res.userInfo;
                            }
                        });
                    }
                    break;
                }
            case "forget":
                {
                    wx.setNavigationBarTitle({
                        title: '重置密码'
                    });
                    break;
                }
            case "login":
            default:
                {
                    wx.setNavigationBarTitle({
                        title: '登录'
                    });
                    break;
                }
        }
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

    },
    // 获取input里面输入的值
    phoneInput: function(e) {
        this.setData({
            phone: e.detail.value
        });

    },
 // 获取密码框里面输入的值
    passwordInput: function(e) {
        this.setData({
            password: e.detail.value
        });
    },
    //
    codeInput: function(e) {
        this.setData({
            code: e.detail.value
        });
    },
    loginClick: function(e) {
        console.log(this.data.password);
        util.http.postJson("fn/user/get/admin",{
            'act': 'account_login',
            'phone': this.data.phone,
            'passwd': this.data.password
        }, function (res) {
            if (res.ok) {
                wx.switchTab({
                    url: '../home/home',
                })
            } else {
                wx.showToast({
                    title: '账号或者密码错误',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },

    forgetClick: function(e) {
        this.setData({
            phone: ''
        });
        wx.navigateTo({
            url: '../login/login?type=forget'
        });
    },

    registeClick: function(e) {
        this.setData({
            phone: ''
        });
        wx.navigateTo({
            url: '../login/login?type=registe'
        })
    },

    sendSms: function(e) {
        if (this.data.issend){
return;
        }
        var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
        if (this.data.phone == '') {
            wx.showToast({
                title: '手机号码不能为空',
                icon: 'none',
                duration: 2000
            })
            return;
        } else if (!myreg.test(this.data.phone)){
            wx.showToast({
                title: '请输入正确的手机号',
                icon: 'none',
                duration: 1000
            })
            return false;
        }else{

            util.http.postJson("fn/user/get/admin",{
                'act': 'account_sendVerifyCode',
                'phone': this.data.phone
            }, function (res) {
                if (res.ok) {
                    wx.showModal({
                        title: '提示',
                        content: '发送验证码成功！',
                        showCancel: false

                    })
                }
            })
        var that = this;
        var time = 60;
        // 发送验证码
        this.setData({
            code: '重新发送60s',
            issend: true
        })
        var Interval = setInterval(function () {
            time--;
            if (time >0) {
                this.setData({
                    disabled: false,
                    isShow:false,
                    code: '重新发送' + time + 's'
                })
            }else{
                clearInterval(Interval);
                this.setData({
                    issend :false,
                    code: '获取验证码',
                })
                
            }
        }, 1000)
        }
    },

    getUserInfo: function(e) {
        console.log(e.detail.userInfo);
        app.globalData.userInfo = e.detail.userInfo;
    },
    // // 密码显示和隐藏切换
    // toggleShowPassword: function (e) {
    //   var isShowPassword = !this.data.isShowPassword;
    //   this.setData({
    //     isShowPassword: isShowPassword
    //   });
    // },
    registeAccount: function(e) {
        let userInfo = app.globalData.userInfo;
        util.http.postJson("fn/user/get/admin",{
            'act': 'account_register',
            'phone': this.data.phone,
            'passwd': this.data.password,
            'code': this.data.code,
        }, function (res) {
            wx.showToast({
                title: '该微信号已绑定手机号',
                icon: 'none',
                duration: 2000
            })
        })
    },

    resetAccount: function(e) {
        util.http.postJson("fn/user/get/admin",{
            'act': 'account_resetpwd',
            'phone': this.data.phone,
            'passwd': this.data.password,
            'code': this.data.code
        }, function (res) {

        }) 
    }
    
})