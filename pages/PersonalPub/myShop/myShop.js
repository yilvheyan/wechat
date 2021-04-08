// pages/myShop/myShop.js
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
        // list: [],               // 购物车列表
        // hasList: false,          // 列表是否有数据
        // 默认展示数据
        hasList: true,
        // 商品列表数据
        // 金额
        totalPrice: 0, // 总价，初始为0
        // 全选状态
        selectAllStatus: false, // 全选状态，默认全选
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            height: util.getallheigth().clientHeight
        })
        console.log('options:', options)
        this.data.ishare = options.ishare
        this.data.shopuid = options.shopuid
        this.data.shopname = options.shopname
        this.data.waiteruid = options.waiteruid
        // var userid = wx.getStorageSync('userid')
        // console.log(userid)
        // wx.showModal({
        //   content: 'data' + this.data.shopuid + this.data.shopname + this.data.waiteruid + this.data.ishare,
        // })
        util.http.postJson("fn/user/get/admin",{
            'act': 'Shop_shopDetail',
            'uid': options.shopuid
        }, function(res) {
            for (let i = 0; i < res.data.goods.length; i++) {
                // res.data.goods[i].playimage = imageUrl + res.data.goods[i].playimage
                let bannerimg = res.data.goods[i].playimage.split(',')
                for (let j = 0; j < bannerimg.length; j++) {
                    bannerimg[j] = imageUrl + bannerimg[j]
                }
                res.data.goods[i].playimage = bannerimg[0]
            }

            //判断头像是否有http
            var patt = /http/
            let thisplayimage = res.data.account.head
            if (!patt.test(res.data.account.head)) {
                res.data.account.head = imageUrl + thisplayimage
            }

            res.data.shop.background = imageUrl + res.data.shop.background
            this.setData({
                shopForDetailslist: res.data.goods,
                userinformation: res.data.shop,
                headerimg: res.data.account.head
            });
        })


        //购物车数据查询
        var showlist = wx.getStorageSync(this.data.shopuid)
        console.log('showlist', showlist)
        this.setData({
            shopmessage: showlist,
            mycatnum: showlist.length
        });
        //更改标题
        wx.setNavigationBarTitle({
            title: options.shopname + '的酒铺'
        })
    },
    //刷新
    // refresh(){

    //     this.setData({
    //         shopmessage: showlist
    //     });
    // },
    //保存数据到storage
    preservationstorage() {
        wx.setStorageSync(this.data.shopuid, this.data.shopmessage);
        let arry=wx.getStorageSync("shoppingcart");
        for(let i=0;i<arry.length;i++){
          if (arry[i].shopuid == this.data.shopuid){
            arry[i].list = this.data.shopmessage;
          }
        }
      wx.setStorageSync("shoppingcart", arry);
    },
    //支付跳转确认订单
    myshoppayment(e) {
        console.log(e)
        wx.navigateTo({
            url: '/pages/PersonalPub/wineOrder/wineOrder?thispage=' + 100 + '&shopuid=' + this.data.shopuid + '&waiteruid=' + this.data.waiteruid + '&ishare=' + this.data.ishare,
        })
    },
    // 用户点击显示弹窗
    clickPup: function() {
        let _that = this;
        if (!_thisdata.click) {
            _this.setData({
                click: true,
            })
        }

        if (_thisdata.option) {
            _this.setData({
                option: false,
            })

            // 关闭显示弹窗动画的内容，不设置的话会出现：点击任何地方都会出现弹窗，就不是指定位置点击出现弹窗了
            setTimeout(() => {
                _this.setData({
                    click: false,
                })
            }, 100)


        } else {
            _this.setData({
                option: true
            })
        }
        var showlist = wx.getStorageSync(this.data.shopuid)
        // for (let i = 0; i < showlist.length; i++) {
        //   let bannerimg = showlist[i].playimage.split(',')
        //   for (let j = 0; j < bannerimg.length; j++) {
        //     bannerimg[j] = imageUrl + bannerimg[j]
        //   }
        //   showlist[i].playimage = bannerimg[0]
        // }
        console.log("showlist",showlist)
        this.setData({
            shopmessage: showlist,
            mycatnum: showlist.length
        });


    },
    //点击商品按钮
    shopForDetails(e) {
        wx.navigateTo({
            url: '/pages/PersonalPub/WinePurchase/WinePurchase?id=' + e.currentTarget.dataset.id + '&shopuid=' + this.data.shopuid + '&shopname=' + this.data.shopname + '&waiteruid=' + this.data.waiteruid + '&ishare=' + this.data.ishare,
        })
    },

    /**
     * 当前商品选中事件
     */
    selectList(e) {
        var that = this;
        // 获取选中的radio索引
        var index = e.currentTarget.dataset.index;
        // 获取到商品列表数据
        var shopmessage = thisdata.shopmessage;
        // 默认全选
        thisdata.selectAllStatus = true;
        // 循环数组数据，判断----选中/未选中[selected]
        shopmessage[index].selected = !shopmessage[index].selected;
        // 如果数组数据全部为selected[true],全选
        for (var i = shopmessage.length - 1; i >= 0; i--) {
            if (!shopmessage[i].selected) {
                console.log(shopmessage[i].selected)
                thisdata.selectAllStatus = false;
                break;
            }
        }
        // 重新渲染数据
        this.setData({
            shopmessage: shopmessage,
            selectAllStatus: thisdata.selectAllStatus
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
        const index = e.currentTarget.dataset.index;
        console.log(index)
        // 获取商品列表数据
        let shopmessage = this.data.shopmessage;
        wx.showModal({
            title: '提示',
            content: '确认删除吗',
            success: function(res) {
                if (res.confirm) {
                    // 删除索引从1
                    shopmessage.splice(index, 1);
                    // 页面渲染数据
                    thispreservationstorage()
                    this.setData({
                        shopmessage: shopmessage
                    });
                    // 如果数据为空
                    if (!shopmessage.length) {
                        this.setData({
                            hasList: false,
                            totalPrice: 0
                        });
                    } else {
                        // 调用金额渲染数据
                        thiscount_price();
                    }
                } else {
                    console.log(res);
                }
            },
            fail: function(res) {
                console.log(res);
            }
        })
    },



    /**
     * 购物车全选事件
     */
    selectAll(e) {
        // 全选ICON默认选中
        let selectAllStatus = this.data.selectAllStatus;
        // true  -----   false
        selectAllStatus = !selectAllStatus;
        // 获取商品数据
        let shopmessage = this.data.shopmessage;
        // 循环遍历判断列表中的数据是否选中
        for (let i = 0; i < shopmessage.length; i++) {
            shopmessage[i].selected = selectAllStatus;
        }
        // 页面重新渲染
        this.setData({
            selectAllStatus: selectAllStatus,
            shopmessage: shopmessage
        });
        // 计算金额方法
        this.count_price();
    },

    /**
     * 绑定加数量事件
     */
    btn_add(e) {
        // 获取点击的索引
        const index = e.currentTarget.dataset.index;
        console.log(index)
        // 获取商品数据
        let shopmessage = this.data.shopmessage;
        // 获取商品数量
        let buynum = shopmessage[index].buynum;
        console.log("shopmessage[index].buynum", shopmessage[index].buynum);
        // 点击递增
        buynum = buynum + 1;
        shopmessage[index].buynum = buynum;
        // 重新渲染 ---显示新的数量
        this.preservationstorage()
        this.setData({
            shopmessage: shopmessage
        });
        // 计算金额方法
        this.count_price();
    },
    /**
     * 绑定减数量事件
     */
    btn_minus(e) {
        //   // 获取点击的索引
        const index = e.currentTarget.dataset.index;
        // const obj = e.currentTarget.dataset.obj;
        console.log(index);
        // 获取商品数据
        let shopmessage = this.data.shopmessage;
        // 获取商品数量
        let buynum = shopmessage[index].buynum;
        // 判断num小于等于1  return; 点击无效
        if (buynum <= 1) {
            return false;
        }
        // else  num大于1  点击减按钮  数量--
        buynum = buynum - 1;
        shopmessage[index].buynum = buynum;
        // 渲染页面
        this.preservationstorage()
        this.setData({
            shopmessage: shopmessage
        });
        // 调用计算金额方法
        this.count_price();
    },
    // 提交订单
    btn_submit_order: function() {
        var that = this;
        let selection = [] //已选中
        let noselection = [] //非选中
        let shopmessage = thisdata.shopmessage
        console.log(thisdata.totalPrice);
        if (thisdata.totalPrice == 0) {
            wx.showToast({
                title: '请选择商品',
                icon: 'none',
            })
        } else {
            // console.log("selectAllStatus" ,this.data.selectAllStatus )
            if (this.data.selectAllStatus == true) {
                wx.setStorageSync(this.data.shopuid + 'true', shopmessage)
            } else if (this.data.selectAllStatus == false) {

                for (var i = shopmessage.length - 1; i >= 0; i--) {
                    console.log('selected', shopmessage[i].selected)
                    if (!shopmessage[i].selected) { //非选中

                        noselection.push(shopmessage[i])
                    } else {
                        selection.push(shopmessage[i]) //已选中
                    }
                }
                wx.setStorageSync(this.data.shopuid + 'true', selection)
                wx.setStorageSync(this.data.shopuid + 'false', noselection)
            }
            wx.navigateTo({
                url: '/pages/PersonalPub/wineOrder/wineOrder?thispage=' + 100 + '&shopuid=' + this.data.shopuid + '&waiteruid=' + this.data.waiteruid + '&ishare=' + this.data.ishare,
            })
        }

    },
    /**
     * 计算总价
     */
    count_price() {
        // 获取商品列表数据
        let shopmessage = this.data.shopmessage;
        // 声明一个变量接收数组列表price
        let total = 0;
        // 循环列表得到每个数据
        for (let i = 0; i < shopmessage.length; i++) {
            // 判断选中计算价格
            if (shopmessage[i].selected) {
                // 所有价格加起来 count_money
                total += shopmessage[i].buynum * shopmessage[i].price;
            }
        }
        // 最后赋值到data中渲染到页面
        this.setData({
            shopmessage: shopmessage,
            totalPrice: total.toFixed(2)
        });
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

        // 价格方法
        this.count_price();
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