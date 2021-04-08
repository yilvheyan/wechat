// pages/PersonalPub/orderHistory/orderHistory.js
const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

    data: {
        allmoney: 0,
        orderRecordlist: [],
        thisdate: '2019-01-01',
        grade_name: '全部',
        grades: [],
        thistodate: '2019-01-01',
        show: 0,
        toshow: 0,
        mySelectlist: [{}, {}, {}],
        selectPerson: false, //显示得内容
        selectArea: false, //箭头按钮旋转
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        //获取当前时间
        let nowdate = new Date()
        var year = nowdate.getFullYear();
        var month = nowdate.getMonth() + 1;
        var strDate = nowdate.getDate();
        month = util.formatNumber(month);
        strDate = util.formatNumber(strDate);
        let thisdate = year + month + strDate
        this.data.thisdate = thisdate
        this.data.thistodate = thisdate
        let nowdata = year + '-' + month + '-' + strDate
        this.setData({
            nowdata: nowdata,
            date: nowdata,
            todate: nowdata,
            toshow: 1,
            show: 1
        })
        console.log('data', this.data.thisdate, this.data.thistodate)
        //查询历史订单
        if (wx.getStorageSync('role') == 2) {
            //我的小二
            util.http.postJson("fn/user/get/admin",{
                'act': 'Waiter_waiterList'
            }, function(res) {
                let mywaiter = []
                for (let i = 0; i < res.data.data.length; i++) {
                    mywaiter.push(res.data.data[i].name)
                }
                mywaiter.push('全部')
                // console.log(mywaiter)
                this.setData({
                    grades: mywaiter
                });
            });
            // 渲染订单           
            if (options.goto == 'waiter') {
                this.letnamequery(thisdate, thisdate, options.waitername)
                this.setData({
                    grade_name: options.waitername
                });
            } else {
                this.letnamequery(thisdate, thisdate, '全部')
            }
        }
        if (wx.getStorageSync('role') == 1) {
            util.http.postJson("fn/user/get/admin",{
                'act': 'Shop_otherOrderRecord',
                'beginDate': thisdate,
                'endDate': thisdate
            }, function(res) {
                let allarry = []
                for (let i in res.data) {
                    let obj = {};
                    obj.list = [];
                    let total = 0;

                    if (res.data[i] != '') {
                        for (let j in res.data[i]) {
                            total += Number(res.data[i][j].money);
                        }
                        console.log("obj:", obj)
                    }
                    obj.list = res.data[i];
                    obj.title = i + '订单';
                    obj.total = total;

                    allarry.push(obj);

                }
                console.log('allarry:', allarry);
                this.setData({
                    orderRecordlist: allarry,
                })
            })
        }

    },
    //点击下拉图标显示
    clickPerson: function(e) {
        console.log("e", e)
        var index = e.currentTarget.dataset.index;
        let orderRecordlist = this.data.orderRecordlist;
        if (!orderRecordlist[index].selectPerson) {
            orderRecordlist[index].selectPerson = true;
            orderRecordlist[index].selectArea = true
        } else {
            orderRecordlist[index].selectPerson = false;
            orderRecordlist[index].selectArea = false
        }
        this.setData({
            orderRecordlist: orderRecordlist
        })
    },
    //点击切换
    mySelect: function(e) {
        this.setData({
            selectPerson: true,
            selectArea: false,
        })
    },
    //按名字查询
    letnamequery(thisdate, thistodate, name) {
        console.log('data', thisdate, thistodate)
        util.http.postJson("fn/user/get/admin",{
            'act': 'Shop_orderRecord',
            'beginDate': thisdate,
            'endDate': thistodate
        }, function(res) {
            if (res.data.code == 10001 || !res.data) {
                wx.showToast({
                    title: '当前没有数据',
                    icon: 'none'
                })
                return
            }
            let allarry = []
            for (let i in res.data) {
                let obj = {};
                obj.list = [];
                let total = 0;
                if (res.data[i] != '') {
                    for (let j in res.data[i]) {
                        if (name == '全部') {
                            if (res.data[i][j].waiteruid == 0) {
                                res.data[i][j].waitername = ''
                            }
                            obj.list.push(res.data[i][j]);
                            total += Number(res.data[i][j].money);
                        } else {
                            if (res.data[i][j].name == name) {
                                obj.list.push(res.data[i][j]);
                                total += Number(res.data[i][j].money);
                            }
                        }
                    }
                    console.log("obj:", obj)
                }
                obj.title = i + '订单';
                obj.total = total;
                allarry.push(obj);
                console.log("obj", obj)
            }
            console.log('allarry:', allarry);
            this.setData({
                orderRecordlist: allarry,
            })
        })
        this.setData({
            grade_name: name,
            select: false
        })
    },

    bindDateChange: function(e) {
        console.log('1', e.detail.value)
        this.setData({
            date: e.detail.value,
            thisdate: e.detail.value,
            show: 1
        })
    },
    bindDateChangeto: function(e) {
        if (this.data.show == 0) {
            wx.showModal({
                title: '请先选择开始时间',
                content: '',
            })
            return;
        }
        this.data.thistodate = e.detail.value
        var datell = new Date(this.data.date).getTime(); //起始时间戳
        var todatell = new Date(this.data.thistodate).getTime(); //结束时间戳
        console.log('aa', todatell)
        console.log('bb', datell)
        console.log(todatell - datell)
        if ((todatell - datell) < 0) {
            wx.showModal({
                title: '请选择大于起始时间',
                content: '',
            })
            return;
        }
        this.setData({
            todate: e.detail.value,
            toshow: 1
        })

        //将两个'-'删除
        let thisdate = this.data.thisdate.replace('-', '')
        thisdate = thisdate.replace('-', '')
        let thistodate = this.data.thistodate.replace('-', '')
        thistodate = thistodate.replace('-', '')
        if (wx.getStorageSync('role') == 2) {
            this.letnamequery(thisdate, thistodate, this.data.grade_name)
        }
        if (wx.getStorageSync('role') == 1) {
            util.http.postJson("fn/user/get/admin",{
                'act': 'Shop_otherOrderRecord',
                'beginDate': thisdate,
                'endDate': thistodate
            }, function(res) {
                let allarry = []
                for (let i in res.data) {
                    let obj = {};
                    obj.list = [];
                    let total = 0;
                    if (res.data[i] != '') {
                        for (let j in res.data[i]) {
                            total += Number(res.data[i][j].money);
                        }
                        console.log("obj:", obj)
                    }
                    obj.list = res.data[i];
                    obj.title = i + '订单';
                    obj.total = total;
                    allarry.push(obj);
                }
                console.log('allarry:', allarry);
                this.setData({
                    orderRecordlist: allarry,
                })
            })
        }


    },

    // *  点击下拉框 */
    bindShowMsg() {
        this.setData({
            select: !this.data.select
        })
    },
    /**

    * 已选下拉框 */
    mySelect(e) {
        console.log(e)
        let oneorderarry = []
        let thisdate = this.data.thisdate.replace('-', '')
        thisdate = thisdate.replace('-', '')
        let thistodate = this.data.thistodate.replace('-', '')
        thistodate = thistodate.replace('-', '')
        var name = e.currentTarget.dataset.name
        this.data.grade_name = e.currentTarget.dataset.name
        this.letnamequery(thisdate, thistodate, this.data.grade_name)
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