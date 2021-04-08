// pages/exChange/yiJianFeedback/yiJianFeedback.js

const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    thisimg: 0,
    content: '',
    image: [
      "http://qiniu-test.ishzm.com/jxb/img/findlist_xq/addimg.png",
    ],
    thisimage: [],
    thisimg: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  //选择图片
  chosepic(e) {
    // console.log('e', e.currentTarget.dataset.img)
    // console.log('e', e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index
    if (e.currentTarget.dataset.img == "http://qiniu-test.ishzm.com/jxb/img/findlist_xq/addimg.png") {
      if (this.data.image.length == 4) {
        wx.showToast({
          title: '最多为3张图片',
          icon: 'none',
          duration: 2000

        })
        return;
      }
      let image = this.data.image
      let _this = this
      wx.chooseImage({
        count: 9,
        sizeType: ['original'],
        sourceType: ['album', 'camera'],
        success(res) {
          image.pop()
          image = image.concat(res.tempFilePaths)
          image.push("http://qiniu-test.ishzm.com/jxb/img/findlist_xq/addimg.png")
          console.log('image', image)
          _this.setData({
            image: image
          })
        }
      })
    }
  },
  textareainput(e) {
    this.data.content = e.detail.value
  },

  //提交反馈
  tijiaofankui() {
    console.log(!this.data.content)
    if (!this.data.content) {
      wx.showModal({
        title: '无信息',
        content: '请填写您的意见',
      })
      return;
    }

    this.data.image.pop()
    if (this.data.image.length != 0) {
      let thisimg = 0;
      let imagelength = this.data.image.length
      let imagearry = []
      for (let i = 0; i < this.data.image.length; i++) {
        var _this = this
        wx.uploadFile({
          url: publicUrl, //仅为示例，非真实的接口地址
          filePath: _this.data.image[i],
          name: 'file',
          formData: {
            'act': 'found_uploadimg',
          },
          success(res) {
            imagearry.push(res.data)
            if (imagelength == imagearry.length) {
              thisimg = 1
            }
          },
          fail(res) {
            console.log('res', res)
          }
        })
      }
      let thitime = setInterval(() => {
        console.log(thisimg)
        if (thisimg == 1) {
          thisimg = 0
          util.http.postJson("fn/user/get/admin",{
            'act': 'Personal_advice',
            'content': this.data.content,
            'image': imagearry,
          }, function(res) {
            if (res.data.code = 10000) {
              wx.showToast({
                title: '提交成功',
                icon: '',
                duration: 2000,
              })
              clearInterval(thitime)
              setTimeout(function() {
                wx.switchTab({
                  url: "/pages/home/home"
                })
              }, 2000);
            } else {
              wx.showToast({
                title: '提交失败',
                icon: 'none',
                duration: 2000,
              })
              clearInterval(thitime)
            }
          })
        }
      }, 1000)
    } else {
      util.http.postJson("fn/user/get/admin",{
        'act': 'Personal_advice',
        'content': this.data.content,
        'image': [],
      }, function(res) {
        if (res.data.code = 10000) {
          wx.showToast({
            title: '提交成功',
            icon: '',
            duration: 2000,
          })
          setTimeout(function() {
            wx.switchTab({
              url: "/pages/home/home"
            })
          }, 2000);
        } else {
          wx.showToast({
            title: '提交失败',
            icon: 'none',
            duration: 2000,
          })
        }
      })
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

  }
})