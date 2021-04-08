// pages/myChateau/myChateau.js
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        headimg: '',
        waiterlist: [],
        nickName: '',
        ydayScore: 0,
        monthScore: 0,
        score: 0,
        sharing: 0,
        focus: false,
        waiterMax: 3,
        currWaiter: 0,
        issharing: 1, //修改当前比例
        surpluslist: 0, //剩余的空位
        inputvalues: '',
        time: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let userInfo = wx.getStorageSync('userInfo');
        var patt = /http/
        let thisplayimage = userInfo.avatarUrl
        if (!patt.test(thisplayimage)) {
            userInfo.avatarUrl = imageUrl + thisplayimage
        }
        this.setData({
            headimg: userInfo.avatarUrl
        });
        this.getshopinfo();

        //小二列表
        this.waiterlistcli()
    },

    getshopinfo() {
        //店铺数据
        util.http.postJson("fn/user/get/admin",{
            'act': 'Shop_shopScores',
        }, function(res) {
            if (res.ok) {
                res.data.goods.rate_time = util.formatTimeByTs(res.data.goods.rate_time, 'Y.M.Dh:m:s');
                var aa = res.data.goods.rate_time;
                console.log("aa", aa);
                var date = new Date(res.data.goods.rate_time.replace(/\./g, '/'));
                console.log("date", date);
                var time_str = date.getTime();
                console.log("设置比例时间", time_str);

                var nowtime = new Date().getTime();
                console.log("当前时间", nowtime);
                var listtime = time_str + 3 * 30 * 24 * 60 * 60 * 1000
                console.log(nowtime - listtime);
                if (!date || nowtime > listtime) {
                    this.setData({
                        issharing: 1
                    })
                } else {
                    this.setData({
                        issharing: 2
                    })
                }
                this.setData({
                    ydayScore: res.data.yestodayscore,
                    monthScore: res.data.monthscore,
                    score: res.data.totalscore.scores,
                    sharing: res.data.goods.waiter_rate,
                    nickName: res.data.goods.name
                });
            } else {}
        });

    },




    countDown(gettime) {
        let that = this;
        this.data.timer = setInterval(() => {
            var lefttime = parseInt((gettime - (new Date().getTime())) / 1000)
            console.log('1', gettime)
            console.log('1', (new Date()).getTime()) //获取到的时间是毫秒
            console.log('1.5', lefttime)
            let m = parseInt(lefttime / 60)
            let s = lefttime % 60
            console.log('aaa', m, s)
            if (lefttime <= 0) {
                this.setData({
                    qgdjs_jo: {
                        min: "00",
                        sec: "00"
                    }
                })
                clearInterval(this.data.timer);
                return
            }
            m < 10 ? m = "0" + m : m;
            s < 10 ? s = "0" + s : s;
            this.setData({
                qgdjs_jo: {
                    min: m,
                    sec: s
                }
            })
        }, 1000)
    },
    //更改比例
    changebi() {
        this.setData({
            issharing: 0
        })
    },
    shopbiliInput(e) {
        this.data.sharing = e.detail.value
        var v1 = e.detail.value;
        var v2 = parseFloat(v1).toFixed(2)
        this.setData({
            inputvalues: v2
        })
    },
    //跳转到订单历史
    toorder(e) {
        wx.navigateTo({
            url: '/pages/PersonalPub/orderHistory/orderHistory?waiteruid=' + e.currentTarget.dataset.waiteruid + '&goto=waiter' + '&waitername=' + e.currentTarget.dataset.waitername,
        })
    },
    //跳转我的订单
    myorder() {
        wx.navigateTo({
            url: '/pages/PersonalPub/orderHistory/orderHistory'
        })
    },
    //点击比例分享显示弹窗
    showtishi() {
        let lirun = 100 - parseInt(this.data.sharing)
        let share = parseInt(this.data.sharing)
        wx.showToast({
            title: '比例设置' + share + '%,意味着一瓶酒100积分的利润，掌柜拿' + lirun + '分，小二得' + share + '分',
            icon: 'none',
            duration: 5000
        })
    },
    //确认比例
    surechange() {
        if (this.data.sharing == '' || parseInt(this.data.sharing) == 0) {
            wx.showToast({
                title: '比例不能为空',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        if (parseInt(this.data.sharing) <= 49 || parseInt(this.data.sharing) >= 91) {
            wx.showToast({
                title: '输入有误，小二利润比例限定为50%-90%之间',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        util.http.postJson("fn/user/get/admin",{
            'act': 'Shop_editRate',
            'rate': this.data.sharing
        }, function(res) {
            if (res.ok) {
                this.setData({
                    sharing: thisdata.sharing,
                    issharing: 1
                })
            }

            thisgetshopinfo();
        });
    },
    //小二列表
    waiterlistcli() {
        util.http.postJson("fn/user/get/admin",{
            'act': 'Waiter_waiterList'
        }, function(res) {
            for (let i = 0; i < res.data.data.length; i++) {
                console.log('1111', res.data.data[i].heads.head)
                var patt = /http/
                let thisplayimage = res.data.data[i].heads.head
                if (!patt.test(thisplayimage)) {
                    res.data.data[i].heads.head = imageUrl + thisplayimage
                }
                // res.data.data[i].heads.head = imageUrl + res.data.data[i].heads.head
                // res.data[i].heads.head = imageUrl + res.data[i].heads.head
            }
            this.setData({
                waiterlist: res.data.data,
                waiterMax: res.data.max,
                currWaiter: res.data.data.length,
                waiterMax: res.data.max,
                surpluslist: res.data.max - res.data.data.length
            });
        });
    },
    // 跳转至招募小儿
    numbertwo() {
        wx.navigateTo({
            url: '/pages/PersonalPub/recruitmentXer/recruitmentXer?shopuid=' + wx.getStorageSync("userid") + '&shopname=' + this.data.nickName
        })
    },
    myshopping() {
        var shopuid = wx.getStorageSync('userid')
        wx.navigateTo({
            url: '/pages/PersonalPub/myStore/myStore?ishare=' + 'aa' + '&shopuid=' + shopuid + "&shopname=" + '我' + '&aashopname=' + this.data.nickName,
        })
    },
    //删除小二
    deletewaiter(e) {
        // console.log(this.data.waiterlist[e.currentTarget.dataset.index]);
        let uname = this.data.waiterlist[e.currentTarget.dataset.index].heads.nickname;
        let _this = this;
        wx.showModal({
            title: '提示',
            content: '是否解除与小二“' + uname + '”的关系。',
            success: function(res) {
                if (res.cancel) {
                    //点击取消,默认隐藏弹框
                } else {
                    //点击确定
                    util.http.postJson("fn/user/get/admin",{
                        'act': 'Waiter_dismissWaiter',
                        'waiteruid': _this.data.waiterlist[e.currentTarget.dataset.index].waiteruid
                    }, function(res) {
                        if (res.data.code == 10001) {
                            console.log("sorry")
                            wx.showToast({
                                title: '抱歉，时长未满三个月，暂且无法解除与小二之间的雇佣关系',
                                icon: 'none', //如果要纯文本，不要icon，将值设为'none'
                                duration: 3000
                            })
                            return;
                        }
                        thiswaiterlistcli();
                    }, _this);
                }
            }
        })
        console.log(e.currentTarget.dataset.index);
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        console.log(this.data.focus)
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