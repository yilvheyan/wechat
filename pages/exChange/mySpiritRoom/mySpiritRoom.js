const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        totalPrice: 0, // 总价，初始为0
        // 全选状态
        selectAllStatus: false, // 全选状态，默认全选
        mySpiritRoom: [], //虚拟
        mywinelibrary: [], //实物
        idarry: [],
        getgood: 2
    },

    // 酒市操作记录
    operatingData() {
        wx.navigateTo({
            url: '/pages/exChange/operatingData/operatingData'
        })
    },
    //换钱
    mySpiritRoomgomoney() {
        let idarry = [] //订单id
        for (let i = 0; i < this.data.mySpiritRoom.length; i++) {
            if (this.data.mySpiritRoom[i].istrue == true) {
                this.data.idarry.push(this.data.mySpiritRoom[i].id)
            }
        }
        if (this.data.totalPrice == 0) {
            wx.showToast({
                title: '请选择商品',
                icon: 'none',
            })
        } else {
            wx.setStorageSync('idarry', this.data.idarry)

            this.data.idarry = []
            wx.navigateTo({
                url: '/pages/exChange/changeMoney/changeMoney?allnomey=' + this.data.totalPrice
            })
        }

    },
    // 提货
    mySpiritRoomDetails() {
        let inofid = []
        let constnum = 0
        for (let i = 0; i < this.data.mywinelibrary.length; i++) {
            if (this.data.mywinelibrary[i].istrue == true) {
                console.log("this.data.mywinelibrary[i]", this.data.mywinelibrary[i])
                constnum++;
                inofid.push(this.data.mywinelibrary[i].id)
                this.data.mywinelibrary[i].istrue = false
            }
        }

        wx.setStorageSync('inofid', inofid)
        this.setData({
            totalPrice: 0
        })
        console.log('inofid', inofid)
        wx.navigateTo({
            url: '/pages/exChange/takeGoods/takeGoods?allnomey?infoid=' + this.data.totalPrice + this.data.inofid
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 兑换记录--我的酒库请求

    },
    isclick(vir, istrue) {
        let v = false
        if (vir == 1) { //改变虚拟的是否被点击
            for (let i = 0; i < this.data.mySpiritRoom.length; i++) {
                this.data.mySpiritRoom[i].istrue = istrue;
            }
            this.setData({
                mySpiritRoom: this.data.mySpiritRoom
            })
        }
        if (vir == 0) { //查询实物的是否被点击
            for (let i = 0; i < this.data.mywinelibrary.length; i++) {
                this.data.mywinelibrary[i].istrue = istrue;
            }
            this.setData({
                mywinelibrary: this.data.mywinelibrary
            })
        }
    },

    choselist(arry, index) {
        let allchose = true;
        let obj = {};
        if (arry[index].istrue == false) {
            arry[index].istrue = true
        } else {
            arry[index].istrue = false
        }
        for (let i = 0; i < arry.length; i++) {
            if (arry[i].istrue == false) {
                allchose = false;
                break;
            }
        }
        obj.arry = arry;
        obj.allchose = allchose;
        return obj;
    },

    chosetype() {
        let type = 2;
        for (let i = 0; i < this.data.mySpiritRoom.length; i++) {
            if (this.data.mySpiritRoom[i].istrue) {
                type = 1;
                break;
            }
        }
        for (let i = 0; i < this.data.mywinelibrary.length; i++) {
            if (this.data.mywinelibrary[i].istrue) {
                type = 0;
                break;
            }
        }
        this.setData({
            getgood: type
        })
    },



    // 当前选中事件
    selectList(e) {
        var that = this;
        let obj = {};
        console.log("e", e);
        var index = e.currentTarget.dataset.index;
        var virtual = e.currentTarget.dataset.virtual; //虚拟为1 实物为0
        //debugger;
        if (!virtual) { //实物
            this.isclick(1, false);
            obj = this.choselist(this.data.mywinelibrary, index)
            this.setData({
                mywinelibrary: obj.arry,
                selectAllStatus: obj.allchose,
            })
            this.count_price(this.data.mywinelibrary);
        } else {
            this.isclick(0, false);
            obj = this.choselist(this.data.mySpiritRoom, index);
            this.setData({
                mySpiritRoom: obj.arry,
                selectAllStatus: obj.allchose,
            })
            this.count_price(this.data.mySpiritRoom);
        }

        this.chosetype();
    },
    /**
     * 购物车全选事件
     */
    selectAll(e) {
        let sign = 1;
        this.data.selectAllStatus = !this.data.selectAllStatus;
        for (let i = 0; i < this.data.mywinelibrary.length; i++) {
            if (this.data.mywinelibrary[i].istrue) {
                sign = 0;
                break;
            }
        }
        if (sign == 1) {
            if (this.data.selectAllStatus) {
                this.isclick(1, true);
                this.count_price(this.data.mySpiritRoom);
            } else {
                this.isclick(1, false);
            }
        } else {
            if (this.data.selectAllStatus) {
                this.isclick(0, true);
                this.count_price(this.data.mywinelibrary);
            } else {
                this.isclick(0, false);
            }
        }
        this.setData({
            selectAllStatus: this.data.selectAllStatus,
        })
        this.chosetype();
    },
    /**
     * 计算总价
     */
    count_price(arry) {
        let total = 0;
        for (let i = 0; i < arry.length; i++) {
            if (arry[i].istrue) {
                total += arry[i].num * arry[i].goodsinfo.price;
            }
        }
        this.setData({
            totalPrice: total.toFixed(2)
        });
    },
    // 我的酒库返回
    skiphome() {
        wx.navigateBack({ //返回上一页面或多级页面
            delta: 3,
            url: '/pages/exChange/integralWithdraw/integralWithdraw'
        })
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



        util.http.postJson("fn/user/get/admin",{
            'act': 'Scores_myWinelibrary',
        }, function(res) {
            if (res.ok) {
                if (res.data == undefined) {
                    return;
                }
                // for(let a=0;a<res.data.length;i++){}
                for (let i = 0; i < res.data.length; i++) {
                    let bannerimg = res.data[i].goodsinfo.playimage.split(',')
                    for (let j = 0; j < bannerimg.length; j++) {
                        bannerimg[j] = imageUrl + bannerimg[j]
                    }
                    res.data[i].bannerimg = bannerimg
                    // res.data[i].goodsinfo.playimage = imageUrl + res.data[i].goodsinfo.playimage
                    res.data[i].istrue = false
                }
                let mySpiritRoomarry = [],
                    mywinelibraryarry = [];
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].goodsinfo.virtual == 1) {
                        mySpiritRoomarry.push(res.data[i]);
                    } else {
                        mywinelibraryarry.push(res.data[i]);
                    }
                }
                this.setData({
                    mywinelibrary: mywinelibraryarry, //
                    mySpiritRoom: mySpiritRoomarry,
                    getgood: 2
                })
            } else {
                return;
            }
        });
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