// 登录注册修改密码组件
const app = getApp();
const publicUrl = app.globalData.publicUrl;
const util = require('../../utils/util.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  /**
   * 组件的初始数据
   */
  data: {
    canlogin: false,
    isShow: false,
    type: 'login',
    phone: '',
    password: '',
    isShowPassword: 'password',
    eyeImg: 'http://qiniu-test.ishzm.com/jxb/img/login/eyes.png',
    code: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    codeMsg: '获取验证码',
    issend: false,
    callback: null,
    avatarUrl: '',
    sptschekde: false,
    phoneval: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show: function(cb) {

      if (cb) {

        this.setData({
          isShow: true,
          // phoneval: wx.getStorageSync('userInfo'),
          callback: cb

        });
      } else {
        this.setData({
          isShow: true,
          callback: null
        });
      }
    },
    // 获取input里面输入的值
    phoneInput: function(e) {
      this.setData({
        phone: e.detail.value,
        phoneval: e.detail.value
      });

      // console.log('ccc', this.data.phoneval)
    },
    // 获取密码框里面输入的值
    passwordInput: function(e) {
      this.setData({
        password: e.detail.value
      });
      // console.log('aaa', this.data.phone)
      if (this.data.phone != '') {
        // console.log(111)
        this.setData({
          canlogin: true
        })
      }
    },

    codeInput: function(e) {
      this.setData({
        code: e.detail.value
      });
    },
    //登录
    loginClick: function(e) {
      util.http.postJson("fn/user/get/admin",{
        'act': 'account_login',
        'phone': this.data.phone,
        'passwd': this.data.password
      }, function(res) {
        if (res.ok) {
          wx.removeStorageSync('role');
          wx.setStorageSync('role', res.data.role)
          wx.setStorageSync('userid', res.data.id)
          wx.setStorageSync('rolestate', res.data.rolestate)
          wx.setStorageSync('accountinfo', res.data)
          let userInfo={}
          userInfo.nickName = res.data.nickname
          userInfo.gender = res.data.sex
          userInfo.avatarUrl = res.data.head
          wx.setStorageSync('userInfo', userInfo)
          wx.setStorageSync('phone', res.data.phone)
          wx.setStorageSync('password'.data.password)

          thistriggerEvent('showTab', 1);
          if (thisdata.callback != null) {
            thisdata.callback();
          }
          this.setData({
            isShow: false,
            callback: null
          });
        } else {
          wx.showToast({
            title: '未注册或账号密码错误。',
            icon: 'none',
            duration: 2000
          })
        }
      })
    },

    forgetClick: function(e) {
      this.setData({
        phone: '',
        password: '',
        type: 'forget'
      });
    },

    userAgreementClick: function(e) {
      this.setData({
        phone: '',
        password: '',
        type: 'userAgreement'
      });
    },

    registeClick: function(e) {
      let userinfo = wx.getStorageSync('userInfo')

      util.getOpenid();
      this.setData({
        phone: '',
        password: '',
        type: 'registe',
        avatarUrl: userinfo.avatarUrl
      });
    },
    //
    sendSms: function(e) {
      if (this.data.issend) {
        wx.showToast({
          title: '请稍后再试。',
          icon: 'none',
          duration: 1000
        })
        return;
      }
      var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$$/;
      // console.log('aaaa', this.data.phoneval)
      if (this.data.phoneval == '') {
        wx.showToast({
          title: '手机号码不能为空。',
          icon: 'none',
          duration: 2000
        })
        return;
      } else if (!myreg.test(this.data.phoneval)) {
        wx.showToast({
          title: '请输入正确的手机号。',
          icon: 'none',
          duration: 1000
        })
        return false;
      } else {
        util.http.postJson("fn/user/get/admin",{
          'act': 'account_sendVerifyCode',
          'phone': this.data.phoneval
        }, function(res) {
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
          codeMsg: '重新发送60s',
          issend: true
        })
        var Interval = setInterval(function() {
          time--;
          if (time > 0) {
            this.setData({
              codeMsg: '重新发送' + time + 's'
            });
          } else {
            clearInterval(Interval);
            this.setData({
              codeMsg: '获取验证码',
              issend: false
            });

          }
        }, 1000);
      }
    },

    getUserInfo: function(e) {
      console.log(e.detail.userInfo);
      app.globalData.userInfo = e.detail.userInfo;
    },
    // 密码显示和隐藏切换
    showPasswd: function(e) {
      this.setData({
        isShowPassword: this.data.isShowPassword == 'password' ? 'text' : 'password',
        eyeImg: this.data.isShowPassword == 'password' ? 'http://qiniu-test.ishzm.com/jxb/img/login/eyes_two.png' : 'http://qiniu-test.ishzm.com/jxb/img/login/eyes.png'
      });
    },
    //注册
    registeAccount: function(e) {
      var _this=this
      if (!this.data.phoneval && !this.data.password && !this.data.code) {
        wx.showModal({
          title: '提示',
          content: '请填写正确的注册信息。',
          showCancel: false
        })
        return;
      }
      if (this.data.sptschekde == false) {
        wx.showToast({
          title: '请先同意阅读协议',
          icon: 'none',
          duration: 2000
        })
        return
      }
      util.http.postJson("fn/user/get/admin",{
        'act': 'account_register',
        'phone': this.data.phoneval,
        'passwd': this.data.password,
        'code': this.data.code,
        'nickname': wx.getStorageSync('userInfo').nickName,
        'head': wx.getStorageSync('userInfo').avatarUrl,
        'sex': wx.getStorageSync('userInfo').gender
      }, function(res) {
        wx.setStorageSync('phone'.data.phoneval)
        wx.setStorageSync('password'.data.password)
        if (res.ok) {
          util.http.postJson("fn/user/get/admin",{
            'act': 'account_login',
            'phone': wx.getStorageSync('phone'),
            'passwd': wx.getStorageSync('password'),
          }, function(ress) {
            wx.removeStorageSync('role');
            wx.setStorageSync('role', res.data.role)
            wx.setStorageSync('userid', res.data.id)
            wx.setStorageSync('rolestate', res.data.rolestate)
            wx.setStorageSync('accountinfo', res.data)
            wx.setStorageSync('phone', res.data.phone)
            wx.setStorageSync('password'.data.password)
            if (_this.data.callback != null) {
              _this.data.callback();
            }
            _this.setData({
              isShow: false,
              callback: null
            });
          })
          
        }
      });
    },
    //点击协议
    xieyicli() {
      this.setData({
        sptschekde: !this.data.sptschekde
      });
    },
    //修改密码
    resetAccount: function(e) {
      util.http.postJson("fn/user/get/admin",{
        'act': 'account_resetpwd',
        'phone': this.data.phone,
        'passwd': this.data.password,
        'code': this.data.code
      }, function(res) {
        wx.setStorageSync('password'.data.password)
        if (thisdata.callback != null) {
          thisdata.callback();
        }
        this.setData({
          isShow: true,
          type: 'login',
          callback: null
        });
      })
    },
    // 隐藏页面
    close: function(e) {
      this.setData({
        isShow: false,
        type: 'login'
      });
    },
    closeToRegiste: function(e) {
      this.setData({
        type: 'registe'
      });
    }
  }
})