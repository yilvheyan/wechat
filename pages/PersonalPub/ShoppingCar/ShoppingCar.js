const app = getApp();
const imageUrl = app.globalData.imageUrl;
const publicUrl = app.globalData.publicUrl;
const util = require('../../../utils/util.js')
var numbers = 1;
var bool = true;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tihuoaddress: {},
        addrid: 0,
        ishare: 0,
        shopuid: 0,
        buynum: 0, //购物车数量
        headerimg: '',
        userinformation: {},
        shopForDetailslist: [],
        imageUrl: app.globalData.imageUrl,
        show_edit: "block",
        edit_name: "编辑",
        edit_show: "none",
        shopname: '',
        waiteruid: 0,
        hasList: true,
        shoplist: [],
        totalPrice: 0, // 总价，初始为0
        selectAllStatus: false,
        thisind: 0,
        goods: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            height: util.getallheigth().clientHeight
        })
        let shoppingcartsto = wx.getStorageSync("shoppingcart");
        if (shoppingcartsto == '') {
            this.setData({
                hasList: false
            })
        } else {
            this.setData({
                hasList: true
            })
        }
        this.setData({
            shoplist: shoppingcartsto
        })

    },

    placeanorder: function() {
        wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
            url: "/pages/newProduct/selectAddress/selectAddress"
        })
    },

    preservationstorage(obj) {
        wx.setStorageSync("shoppingcart", this.data.shoplist);
        wx.setStorageSync(obj.shopuid, obj.list);
    },
    //查询当前选择情况
    findall(ind) {
        let cartselect = true;
        this.data.shoplist[ind].selectshop = true;
        for (let i = 0; i < this.data.shoplist[ind].list.length; i++) {
            //debugger;
            if (!this.data.shoplist[ind].list[i].selected) {
                this.data.shoplist[ind].selectshop = false;
                break;
            }
        }
        for (let i = 0; i < this.data.shoplist.length; i++) {
            if (!this.data.shoplist[i].selectshop) {
                cartselect = false;
                break;
            }
        }
        this.setData({
            selectAllStatus: cartselect,
        })
    },
    /**
     * 当前商品选中事件
     */
    selectList(e) {
        var that = this;
        var ind = e.currentTarget.dataset.ind;
        var index = e.currentTarget.dataset.index;
        thisdata.shoplist[ind].list[index].selected = !thisdata.shoplist[ind].list[index].selected
        this.findall(ind);
        this.setData({
            shoplist: thisdata.shoplist,
        })
        // 调用计算金额方法
        thiscount_price();
    },
    // 编辑
    btn_edit: function() {
        var that = this;
        if (bool) {
            this.setData({
                edit_show: "block",
                edit_name: "取消",
                show_edit: "none"
            })
            bool = false;
        } else {
            this.setData({
                edit_show: "none",
                edit_name: "编辑",
                show_edit: "block"
            })
            bool = true;
        }
    },
    // 删除
    deletes: function(e) {
        var that = this;
        // 获取索引
        const ind = e.currentTarget.dataset.ind;
        const index = e.currentTarget.dataset.index;
        console.log(index)
        // 获取商品列表数据
        let shoplist = this.data.shoplist;
        wx.showModal({
            title: '提示',
            content: '确认删除吗',
            success: function(res) {
                if (res.confirm) {
                    // 删除索引从1
                    shoplist[ind].list.splice(index, 1);
                    // 如果数据为空
                    if (shoplist[ind].list.length == 0) {
                        wx.removeStorageSync(shoplist[ind].shopuid); //删除对应店铺的购物车信息
                        shoplist.splice(ind, 1);
                        if (!shoplist) {
                            this.setData({
                                hasList: false,
                                totalPrice: 0
                            });
                        }
                    } else {
                        wx.setStorageSync(shoplist[ind].shopuid, shoplist[ind].list); //重新存
                        // 调用金额渲染数据
                        thiscount_price();
                    }
                    if (shoplist.length != 0) { //总购物车从新存
                        wx.setStorageSync("shoppingcart", shoplist);
                    } else {
                        wx.removeStorageSync("shoppingcart")
                    }
                    this.setData({
                        shoplist: shoplist
                    });
                }
            },
            fail: function(res) {
                console.log(res);
            }
        })
    },
    //全选或者全不选
    choseall(istrue) {
        for (let j = 0; j < this.data.shoplist.length; j++) {
            this.data.shoplist[j].selectshop = istrue
            for (let i = 0; i < this.data.shoplist[j].list.length; i++) {
                this.data.shoplist[j].list[i].selected = istrue
            }
        }
        this.setData({
            shoplist: this.data.shoplist
        })
    },
    selectAll() {
        this.data.selectAllStatus = !this.data.selectAllStatus;
        if (this.data.selectAllStatus) {
            this.choseall(true);
        } else {
            this.choseall(false);
        }
        this.setData({
            selectAllStatus: this.data.selectAllStatus
        })
        this.count_price();
    },
    //局部全选
    choseshop(istrue, ind) {
        this.data.shoplist[ind].selectshop = istrue
        for (let i = 0; i < this.data.shoplist[ind].list.length; i++) {
            this.data.shoplist[ind].list[i].selected = istrue
        }
        this.setData({
            shoplist: this.data.shoplist
        })
    },
    selectshop(e) {
        var ind = e.currentTarget.dataset.ind;
        this.data.shoplist[ind].selectshop = !this.data.shoplist[ind].selectshop;
        if (this.data.shoplist[ind].selectshop) {
            this.choseshop(true, ind);
        } else {
            this.choseshop(false, ind);
        }
        this.setData({
            shoplist: this.data.shoplist
        })
        this.count_price();
    },


    /**
     * 绑定加数量事件
     */
    btn_add(e) {
        console.log('e', e);
        var ind = e.currentTarget.dataset.ind;
        const index = e.currentTarget.dataset.index;
        let praise = 'shoplist[' + e.currentTarget.dataset.ind + '].list[' + e.currentTarget.dataset.index + '].buynum'
        let buynum = this.data.shoplist[e.currentTarget.dataset.ind].list[e.currentTarget.dataset.index].buynum
        buynum = buynum + 1;
        this.setData({
            [praise]: buynum
        });
        this.preservationstorage(this.data.shoplist[ind]);
        this.count_price();
    },
    /**
     * 绑定减数量事件
     */
    btn_minus(e) {
        var ind = e.currentTarget.dataset.ind;
        // 获取点击的索引
        const index = e.currentTarget.dataset.index;
        let praise = 'shoplist[' + e.currentTarget.dataset.ind + '].list[' + e.currentTarget.dataset.index + '].buynum'
        let buynum = this.data.shoplist[e.currentTarget.dataset.ind].list[e.currentTarget.dataset.index].buynum
        // 点击递增
        buynum = buynum - 1;
        // 判断num小于等于1  return; 点击无效
        if (buynum < 1) {
            return false;
        }
        this.setData({
            [praise]: buynum
        });
        this.preservationstorage(this.data.shoplist[ind]);
        this.count_price();
    },
    // 提交订单
    btn_submit_order: function() {
        let thdata = new Date();
        let _this = this;
        let waiteruid = 0;
        let waiteruidsto = wx.getStorageSync("waiteruid") || {};
        if (wx.getStorageSync("waiteruid").time > thdata.getTime()) {
            waiteruid = wx.getStorageSync("waiteruid").waiteruid;
        } else {
            wx.removeStorageSync("waiteruid");
        }
        for (let i = 0; i < this.data.goods.length; i++) {
            this.data.goods[i].waiteruid = waiteruid;
        }
        console.log("goods", this.data.goods);
        util.http.postJson("fn/user/get/admin",{
            'act': 'Shop_createorderbatch',
            'batch': this.data.goods,
            'addrid': this.data.addrid
        }, function(res) {
            if (res.data.code == 10001) {
                if (res.data.fail == 'goods_stock_not_enough') {
                    wx.showModal({
                        content: '产品数量不足。',
                    })
                }
                if (res.data.fail == 'goods_not_exists') {
                    wx.showModal({
                        content: '产品已不存在。',
                    })
                }
                return;
            }
            if (res.ok) {
                _this.cleargoods();
                let batch = res.data.batch
                console.log('aaa', res.data.batch);
                util.getOpenid();
                util.http.postJson("fn/user/get/admin",{ //支付
                    'act': 'Wxpayshop_indexbatch',
                    'batch': batch,
                    'openid': wx.getStorageSync('openid')
                }, function(ress) {
                    var resp = JSON.parse(res.data)
                    wx.requestPayment({
                        'timeStamp': resp.timeStamp,
                        'nonceStr': resp.nonceStr,
                        'package': resp.package,
                        'signType': 'MD5',
                        'paySign': resp.paySign,
                        'success': function(res) {
                            util.http.postJson("fn/user/get/admin",{
                                'act': 'Shop_createPrepayidbatch',
                                'batch': batch
                            }, function(resas) {

                                if (res.ok) {


                                    if (_this.data.ishare == 'needwaiter') {
                                        wx.reLaunch({
                                            url: '/pages/Waiter/applyWaiter/applyWaiter?shopuid=' + _this.data.shopuid + "&shopname=" + _this.data.shopname,
                                        })
                                        return;
                                    } else {
                                        setTimeout(function() {
                                            wx.reLaunch({
                                                url: '/pages/PersonalPub/paymentOk/paymentOk',
                                            })

                                        }, 500);
                                    }
                                } else {
                                    wx.showModal({
                                        content: '创建预支付失败',
                                    })
                                }
                            })
                        },
                        'fail': function(res) {
                            wx.showToast({
                                title: '支付失败',
                                icon: 'none',
                                duration: 1000
                            });
                            setTimeout(function() {
                                wx.redirectTo({
                                    url: '/pages/PersonalPub/orderConfirmation/orderConfirmation?index=0'
                                })
                            }, 1000);
                        }
                    });
                })
            }
        });

    },
    /**
     * 计算总价
     */
    count_price() {
        let shoplist = this.data.shoplist;
        let total = 0;
        let goodslist = [];
        for (let j = 0; j < this.data.shoplist.length; j++) {
            let json = {};
            let arry = [];
            for (let i = 0; i < shoplist[j].list.length; i++) {
                if (shoplist[j].list[i].selected) {
                    let obj = {};
                    obj.id = shoplist[j].list[i].id;
                    obj.num = shoplist[j].list[i].buynum;
                    arry.push(obj);
                    total += shoplist[j].list[i].buynum * shoplist[j].list[i].price;
                }
            }
            if (arry.length > 0) {
                json.shopuid = this.data.shoplist[j].shopuid;
                json.goods = arry;
                goodslist.push(json);
            }
        }
        this.setData({
            goods: goodslist,
            totalPrice: total.toFixed(2)
        });
    },

    //清除以提交订单
    cleargoods() {
        //debugger;
        this.data.goods.forEach(gd => {
            wx.setStorageSync(gd.shopuid, wx.getStorageSync(gd.shopuid).filter(p => gd.goods.map(gp => gp.id).indexOf(p.id) == -1));
            if (wx.getStorageSync(gd.shopuid).length == 0) {
                wx.removeStorageSync(gd.shopuid);
            }
        });
        wx.setStorageSync('shoppingcart',
            wx.getStorageSync('shoppingcart')
            .filter(sp => wx.getStorageSync(sp.shopuid).length > 0)
            .map(sp => ({
                shopuid: sp.shopuid,
                shopname: sp.shopname,
                selectshop: false,
                list: wx.getStorageSync(sp.shopuid)
            }))
        );
        this.setData({
            shoplist: wx.getStorageSync('shoppingcart')
        })
    },

    /* 输入框事件 */
    myshopbindManual: function(e) {
        var buynum = e.detail.value;
        // 将数值与状态写回  
        this.setData({
            num: num
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        wx.showToast({
            title: '加载中',
            icon: "loading",
            duration: 1000
        })
        var _this = this
        //商品地址
        util.http.postJson("fn/user/get/admin",{
            'act': 'Address_allList',
        }, function(res) {
            if (!res.data) {
                return;
            }
            for (var i = 0; i < res.data.length; i++) {
                if (res.data[i].state == 1) {
                    thisdata.addrid = res.data[i].id
                    this.setData({
                        tihuoaddress: res.data[i]
                    })
                }
            }
        })
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