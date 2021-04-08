// pages/findlist/findcontent/findcontent.js
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        iscolorgray: false,
        showImagell: {},
        showImage: {
            url: '',
            height: '',
            width: ''
        },
        t_length: 0,
        imgMaxWidth: '',
        imgMaxHeight: '',
        showBtn: true,
        x: 0,
        y: 0,
        scale: 1,
        moveViewWidth: '',
        moveViewHeight: '',
        lastImage: '',
        context: '',
        findcontens: {
            title: '',
            main: '',
        },
        image: [
            "http://qiniu-test.ishzm.com/jxb/img/findlist_xq/addimg.png",
        ],
        searchmainlist: {},
        istestdata: false,
        id: 0,
        shopuid: 0,
        waiteruid: 0,
        playimage: '',
        name: '',
        subname: '',
        showBtn: true,
        price: '',
        thisimage: [],
        thisimg: 0,
        addjiupinshow: false,
        tempBZ: "",
        thoesindex: 100

    },
    //添加酒品
    addjiupincli() {
        wx.navigateTo({
            url: '/pages/findlist/searchwine/searchwine',
        })
    },
    //标题
    inputtitle(e) {
        // console.log(e.detail.value)
        this.data.findcontens.title = e.detail.value
    },
    // 内容
    textareainput(e) {
        var that = this;
        // var str= res.data.content.split('&hc').join('\n');
        this.setData({
            tempBZ: e.detail.value.length,
        })
        console.log(e.detail.value)

        this.data.findcontens.main = e.detail.value.length;
        this.setData({
            t_length: e.detail.value.length
        })
    },
    //选择图片
    chosepic(e) {
        // console.log('e', e.currentTarget.dataset.img)
        // console.log('e', e.currentTarget.dataset.index)
        let index = e.currentTarget.dataset.index
        if (e.currentTarget.dataset.img == "http://qiniu-test.ishzm.com/jxb/img/findlist_xq/addimg.png") {
            if (this.data.image.length == 10) {
                wx.showToast({
                    title: '最多为9张图片',
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
                    const tempFilePath = res.tempFilePaths[0]
                    image.pop()
                    image.push(tempFilePath)
                    image.push("http://qiniu-test.ishzm.com/jxb/img/findlist_xq/addimg.png")
                    _this.setData({
                        image: image
                    })
                    console.log('image1', _this.data.image)
                }
            })
        } else {
            this.data.thoesindex = index
            let image = this.data.image
            let _this = this
            wx.chooseImage({
                count: 9,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success(res) {
                    const tempFilePath = res.tempFilePaths[0]
                    //   _this.data.showImage.url = tempFilePath
                    //   _this.data.showImagell.url = res.tempFilePath
                    image.splice(_this.data.thoesindex, 1, tempFilePath)
                    _this.setData({
                        image: image
                    })
                    console.log('image2', _this.data.image)
                }

            })
        }
    },


    //判断弹窗
    showtab(title) {
        wx.showToast({
            title: title,
            icon: 'none',
            duration: 4000
        })
    },


    //确认发布
    surfabucli() {
        // console.log(this.data.image) 
        if (this.data.image[(this.data.image.length - 1)] == "http://qiniu-test.ishzm.com/jxb/img/findlist_xq/addimg.png") {
            this.data.image.pop()
        }
        if (this.data.findcontens.title == '') {
            this.showtab('标题不能为空')
            return;
        }
        if (this.data.findcontens.main == '') {
            this.showtab('内容不能为空')
            return;
        }
        if (this.data.image.length == 0) {
            this.showtab('图片不能为空')
            return;
        }
        for (let i = 0; i < this.data.image.length; i++) {
            var _this = this
            wx.uploadFile({
                url: publicUrl, //仅为示例，非真实的接口地址
                filePath: this.data.image[i],
                name: 'file',
                formData: {
                    'act': 'found_uploadimg',
                },
                success(res) {
                    console.log('resllll', res.data)
                    _this.data.thisimage.push(res.data)
                    console.log('aa', _this.data.thisimage.length)
                    if (_this.data.thisimage.length == _this.data.image.length) {
                        _this.data.thisimg = 1
                    }
                },
                fail(res) {
                    console.log('res', res)
                }
            })
        }
        let thistimenum = 0
        let thitime = setInterval(() => {
            console.log(this.data.thisimg)
            // this.data.iscolorgray=true;
            this.setData({
                iscolorgray: true
            })
            //   console.log('this.data.thisimage', this.data.thisimage)
            console.log('this.data.id', this.data.id)
            if (this.data.thisimg == 1) {
                this.data.thisimg = 0
                util.http.postJson("fn/user/get/admin",{
                    'act': 'Found_issueContent',
                    'title': this.data.findcontens.title,
                    'content': this.data.findcontens.main,
                    'roles': wx.getStorageSync('role'),
                    'image': this.data.thisimage,
                    'goods': this.data.id
                }, function(res) {
                    _this.data.thisimage = []
                    wx.showToast({
                        title: '已提交后台审核',
                        icon: '',
                        duration: 2000
                    })
                    setTimeout(() => {
                        wx.reLaunch({
                            url: '/pages/Discover/Discover'
                        })
                    }, 2000)
                    clearInterval(thitime)
                })
            }
            thistimenum++
            if (thistimenum == 15) {
                wx.showToast({
                    title: '发布失败',
                    icon: 'none',
                    duration: 3000
                })
                _this.setData({
                    thisimage: [],
                    thisimg: 0,
                    iscolorgray: false,
                })
                clearInterval(thitime)
            }
        }, 1000)







    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // console.log(wx.getStorageSync('role'))
        if (wx.getStorageSync('role') >= 1) {
            this.setData({
                addjiupinshow: true
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
        const pages = getCurrentPages()
        const currPage = pages[pages.length - 1] // 当前页
        this.data.shopuid = currPage.data.shopuid
        this.data.waiteruid = currPage.data.waiteruid
        this.data.id = currPage.data.id
        console.log(currPage.data.playimage)
        if (currPage.data.istestdata == true) {
            this.data.istestdata = currPage.data.istestdata

            this.setData({
                waiteruid: currPage.data.waiteruid,
                playimage: currPage.data.playimage,
                name: currPage.data.name,
                subname: currPage.data.subname,
                price: currPage.data.price,
            })
        }
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