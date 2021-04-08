const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '', //头像
    changepic: 0,
    nickName: '', //名字
    sex: 0,
    whochange: '',
    getname: '',
    getnum: 0, //判断是用户名还是手机
    phone: '13162779619',
    code: '',
    istimenum: 0,
    isredactData_btnba: false,
    timenum: 60,
    timer: ''
  },
  changename(e) {
    // console.log('aa', e.detail.value)
    this.data.getname = e.detail.value
    this.data.phone = e.detail.value
  },
  code(e) {
    // console.log('aa', e.detail.value)
    this.data.code = e.detail.value
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this

    if (!wx.getStorageSync('phone')) {
      this.setData({
        phone: '点击可获取手机号'
      })
    } else {
      this.setData({
        phone: wx.getStorageSync('phone')
      })
    }
    this.setData({
      height: util.getallheigth().clientHeight
    })
    console.log('options', options)
    this.setData({
      avatarUrl: options.avatarUrl,
      nickName: options.name,
      sex: options.sex,
    })
  },
  //头像更改
  clickImg() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: ((res) => {
        const tempFilePath = res.tempFilePaths[0]
        this.setData({
          avatarUrl: res.tempFilePaths[0],
          changepic: 1,
          isredactData_btnba: true
        })
      })
    })
  },
  // 遮罩层显示
  show: function(e) {
    if (e.currentTarget.dataset.getnum == 1) {
      if (e.currentTarget.dataset.name == '点击登录') {
        let popup = this.selectComponent("#popup");        
        popup.show(() => {
          var patt = /http/
          let thisplayimage = wx.getStorageSync('userInfo').avatarUrl
          if (!patt.test(thisplayimage)) {
            thisplayimage = imageUrl + thisplayimage
          }
          // debugger;
          console.log('111', wx.getStorageSync('userInfo'))
          this.setData({
            'nickName': wx.getStorageSync('userInfo').nickName,
            'avatarUrl': thisplayimage,
            'sex': wx.getStorageSync('userInfo').gender
          });
          if (wx.getStorageSync('phone')) {
            this.setData({
              phone: wx.getStorageSync('phone')
            })
          }
        })
      } else {
        this.setData({
          whochange: '请输入用户昵称',
          getnum: e.currentTarget.dataset.getnum,
          redactDataname: true
        })
      }
    }

    if (e.currentTarget.dataset.getnum == 2) {
      if (e.currentTarget.dataset.name == '点击可获取手机号') {
        let phonepopup = this.selectComponent("#phonepopup");       
        console.log('phonepopup', phonepopup, phonepopup.data);
        let aa=1;
        phonepopup.thaa(aa);
        console.log('phonepopup2', phonepopup, phonepopup.data);
        phonepopup.show(() => {
          this.setData({
            phone: wx.getStorageSync('phone')
          })
        })
      } else {
        this.setData({
          whochange: '请输入新的手机号',
          getnum: e.currentTarget.dataset.getnum,
          redactDataname: true
        })
        this.data.phone = ''
      }
    }
  },
  // 遮罩层隐藏
  conceal: function(e) {
    //e.currentTarget.dataset.index :1确定 0:取消
    if (e.currentTarget.dataset.index == 1 && this.data.getnum == 1) { //昵称
      if (this.data.getname == '') {
        wx.showToast({
          title: '用户名不能为空',
          icon: 'none',
          duration: 2000
        })
        return
      }
      this.setData({
        nickName: this.data.getname,
        redactDataname: false,
        isredactData_btnba: true
      })
    } else if (e.currentTarget.dataset.index == 1 && this.data.getnum == 2) { //手机号
      if (this.data.code == '') {
        wx.showToast({
          title: '验证码不能为空',
          icon: 'none',
          duration: 2000
        })
        return
      }
      this.changephone(this.data.phone, this.data.code)

    } else {
      clearInterval(this.data.timer)
      this.setData({
        istimenum: 0,
        redactDataname: false,
        isredactData_btnba: true
      })
    }
  },

  //获取验证码
  getphoneyan() {
    console.log('daga', this.data.phone)
    if (this.data.phone == "" || this.data.phone.length != 11) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    util.http.postJson("fn/user/get/admin",{
      'act': 'account_sendVerifyCode',
      'phone': this.data.phone
    }, function(res) {
      if (res.ok) {
        thisdata.timenum = 60
        this.setData({
          istimenum: 1
        })
        wx.showModal({
          title: '提示',
          content: '发送验证码成功！',
          showCancel: false
        })
        thisdata.timer = setInterval(() => {
          thisdata.timenum -= 1
          this.setData({
            timenum: thisdata.timenum
          })
          if (thisdata.timenum <= 0) {
            clearInterval(thisdata.timer)
            this.setData({
              istimenum: 0
            })
          }
        }, 1000)
      }
    })
  },
  //更改手机号
  changephone(phone, code) {
    console.log('Account_resetphone', phone, code)
    util.http.postJson("fn/user/get/admin",{
      'act': 'Account_resetphone',
      'phone': phone,
      'code': code
    }, function(res) {
      if (res.ok) {
        clearInterval(thisdata.timer)
        wx.setStorageSync('phone'.data.phone)
        this.setData({
          phone: res.data,
          redactDataname: false,
          istimenum: 0
        })
        wx.showToast({
          title: '更改成功',
          duration: 2000
        })
        wx.switchTab({
          url: '/pages/home/home',
        })
      } else {
        wx.showModal({
          content: '更改失败，请重新更改。',
        })
      }
    })
  },
  //编辑资料

  bianji(head, nickname, sex) {
    console.log('编辑资料', head, nickname, sex)
    if (this.data.changepic == 1) {
      wx.uploadFile({
        url: publicUrl, //仅为示例，非真实的接口地址
        filePath: head,
        name: 'file',
        formData: {
          'act': 'found_uploadimg',
        },
        success(res) {
          console.log('resllll', res.data)
          let resdata = "/" + res.data
          util.http.postJson("fn/user/get/admin",{
            'act': 'Shop_editdata',
            'head': resdata,
            'nickname': nickname,
            'sex': sex
          }, function(res) {
            if (res.ok) {
              let userInfo = {}
              userInfo.nickName = res.data.nickname
              userInfo.avatarUrl = res.data.head
              userInfo.gender = sex
              wx.setStorageSync('userInfo', userInfo)
              wx.showToast({
                title: '更改成功',
                duration: 2000
              })
              wx.switchTab({
                url: '/pages/home/home',
              })
            } else {
              wx.showToast({
                title: '更改失败',
                icon: 'none',
                duration: 2000
              })
            }

          })
        },
        fail(res) {
          console.log('res', res)
        }
      })
    } else {
      util.http.postJson("fn/user/get/admin",{
        'act': 'Shop_editdata',
        'head': head,
        'nickname': nickname,
        'sex': sex
      }, function(res) {
        if (res.ok) {
          let userInfo = {}
          userInfo.nickName = res.data.nickname
          userInfo.avatarUrl = res.data.head
          userInfo.gender = sex
          wx.setStorageSync('userInfo', userInfo)
          wx.showToast({
            title: '更改成功',
            duration: 2000
          })
          wx.switchTab({
            url: '/pages/home/home',
          })
        } else {
          wx.showToast({
            title: '更改失败',
            icon: 'none',
            duration: 2000
          })
        }

      })
    }

  },
  //点击确定
  yeschange() {
    console.log('确定', this.data.avatarUrl, this.data.nickName, this.data.sex)
    this.bianji(this.data.avatarUrl, this.data.nickName, this.data.sex)
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