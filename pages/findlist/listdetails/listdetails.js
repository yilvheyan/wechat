// pages/findlist/listdetails/listdetails.js
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const imageUrlfound = app.globalData.imageUrlfound;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bannerimgwidth: 0,
        ldmainboxlist: [{
            // headname: '一缕荷烟',
            // headtime: '2019-08-20 18:30',
            // textwen: '新品上市的果味白酒，口味很赞，有喜欢的朋,新品上市的果味白酒，口味很赞，有喜欢的朋,新品上市的果味白酒，口味很赞，有喜欢的朋',
            // image: [
            //     "http://qiniu-test.ishzm.com/jxb/img/findlist_xq/ldtopbox.png",
            //     "http://qiniu-test.ishzm.com/jxb/img/findlist_xq/ldtopbox.png",
            //     "http://qiniu-test.ishzm.com/jxb/img/findlist_xq/ldtopbox.png",
            //     "http://qiniu-test.ishzm.com/jxb/img/findlist_xq/ldtopbox.png",
            //     "http://qiniu-test.ishzm.com/jxb/img/findlist_xq/ldtopbox.png",
            // ],
            // tuijian: {
            //     image: 'http://qiniu-test.ishzm.com/jxb/img/findlist_xq/ldtopbox.png',
            //     title: '江小白x天猫定制礼盒果味高粱酒蜜桃味苹果',
            //     money: 366.00
            // },
            // textomne: 0,
            // texttwo: 12,
            // textthree: 122

        }]
    },
    //

    skiphome() {
        wx.reLaunch({
            url: '/pages/Discover/Discover'
        })
    },
    //推荐跳转
    colisttjnageto(e) {
        console.log('ee', e.currentTarget.dataset.item)
        let shopuid = e.currentTarget.dataset.item.shopuid
        let waiteruid = e.currentTarget.dataset.item.waiteruid
        let shopname = e.currentTarget.dataset.item.headinfo.nickname
        let id = e.currentTarget.dataset.item.goodsID
        wx.navigateTo({
            url: '/pages/PersonalPub/WinePurchase/WinePurchase?shopuid=' + shopuid + "&waiteruid=" + waiteruid + "&shopname=" + shopname + "&id=" + id,
        })
    },
    //列表详情举报
    libiaojubao(e) {
        console.log('e', e.currentTarget.dataset.infoid)
        wx.navigateTo({
            url: '/pages/findlist/contentxiang/contentxiang?id=' + e.currentTarget.dataset.infoid
        })
    },
    //獲取详情列表
    findcenton(offset, limit) {
        util.http.postJson("fn/user/get/admin",{
            'act': 'Found_foundListsinfo',
            'offset': offset,
            'limit': limit
        }, function(res) {
            //判断是否有推荐商品
            for (let i = 0; i < res.data.foundlist.length; i++) {
                if (res.data.foundlist[i].goods == null) {} else {
                    // res.data.foundlist[i].goods.playimage = imageUrl + res.data.foundlist[i].goods.playimage
                    let bannerimg = res.data.foundlist[i].goods.playimage.split(',')
                    for (let j = 0; j < bannerimg.length; j++) {
                        bannerimg[j] = imageUrl + bannerimg[j]
                    }
                    res.data.foundlist[i].goods.playimage = bannerimg[0]
                }
                if (res.data.foundlist[i].praises_state == null) {
                    res.data.foundlist[i].praises_state = 0
                } else {
                    res.data.foundlist[i].praises_state = 1
                }
            }
            //给图片加路径
            for (let i = 0; i < res.data.foundlist.length; i++) {
                for (let j = 0; j < res.data.foundlist[i].image.length; j++) {
                    res.data.foundlist[i].image[j] = imageUrlfound + res.data.foundlist[i].image[j]
                }

                //头像处理
                var patt = /http/
                let thisplayimage = res.data.foundlist[i].headinfo.head
                if (!patt.test(thisplayimage)) {
                    res.data.foundlist[i].headinfo.head = imageUrl + thisplayimage
                }
            }
            this.setData({
                ldmainboxlist: res.data.foundlist
            })
        })
    },
    //显示图片
    toshowpic(e) {
        var current = e.target.dataset.item;
        var itemfor = e.target.dataset.itemfor;
        wx.previewImage({
            current: current, // 当前显示图片的http链接
            urls: itemfor // 需要预览的图片http链接列表
        })
    },
    //点击头像跳转
    thisgeto(e) {
        if (this.data.whoreleaseuid == this.data.shopuid || this.data.whoreleaseid == this.data.waiteruid) {
            wx.navigateTo({
                url: '/pages/PersonalPub/myStore/myStore?shopuid=' + this.data.shopuid + "&waiteruid=" + this.data.waiteruid + "&shopname=" + this.data.shopname,
            })
        } else {

        }
    },
    //转发
    listzhuanfa(e) {
        let infoid = e.currentTarget.dataset.infoid
        let index = 'ldmainboxlist[' + e.currentTarget.dataset.index + '].share'
        let share = e.currentTarget.dataset.share
        let thitime = setInterval(() => {
            let sharepath = wx.getStorageSync('sharepath')
            if (sharepath == 1) {
                wx.removeStorageSync('sharepath')
                util.http.postJson("fn/user/get/admin",{
                    'act': 'Found_share',
                    'id': infoid
                }, function(res) {
                    if (res.ok) {
                        share += 1;
                        this.setData({
                            [index]: share,
                        })
                        wx.showToast({
                            title: '分享成功' + ((res.data.getshare == 0) ? '' : ('，获得' + res.data.getshare + '积分')) + '!',
                            icon: 'none', //如果要纯文本，不要icon，将值设为'none'
                            duration: 2000
                        })
                    }
                    clearInterval(thitime)
                })
            }
        }, 1000)

    },
    onShareAppMessage: function(res) {
        // let _this=this
        return {
            title: '发布信息',
            desc: '单纯高粱酒江小白',
            path: '/pages/findlist/contentxiang/contentxiang',
            withShareTicket: true
        }

    },
    //点赞
    listdianzan(e) {
        console.log('e', e.currentTarget.dataset.infoid)
        let infoid = e.currentTarget.dataset.infoid
        let index = 'ldmainboxlist[' + e.currentTarget.dataset.index + '].praises_state'
        let praise = 'ldmainboxlist[' + e.currentTarget.dataset.index + '].praise'
        let praisenum = e.currentTarget.dataset.praise
        // console.log('index', index)
        // console.log('praise', praise)
        // console.log('praisenum', praisenum)
        let praises_state = e.currentTarget.dataset.praises_state
        console.log('praises_state', praises_state)
        if (praises_state == 0) {
            praisenum += 1
            console.log('aa', praisenum)
            util.http.postJson("fn/user/get/admin",{
                'act': 'Found_praise',
                'id': infoid
            }, function(res) {
                if (res.data.code = 10000) {
                    this.setData({
                        [index]: 1,
                        [praise]: praisenum
                    })
                    wx.showToast({
                        title: '点赞成功' + ((res.data.scores == 0) ? '' : ('，获得' + res.data.scores + '积分')) + '!',
                        icon: 'none',
                        duration: 2000
                    })
                }
            })
        } else {
            util.http.postJson("fn/user/get/admin",{
                'act': 'Found_unpraise',
                'id': infoid
            }, function(res) {
                if (res.data.code = 10000) {
                    praisenum -= 1
                    this.setData({
                        [index]: 0,
                        [praise]: praisenum
                    })
                }
            })
        }
    },


    //跳转到店铺
    gotoshop(e) {
        wx.navigateTo({
            url: '/pages/PersonalPub/myStore/myStore?shopuid=' + e.currentTarget.dataset.shopuid + '&shopname=' + e.currentTarget.dataset.shopname,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            bannerimgwidth: util.getallheigth().clientWidth * 0.75
        })
        this.findcenton(0, 10)
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
        let ldmainboxlist = this.data.ldmainboxlist + 10
        this.findcenton(0, ldmainboxlist)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})