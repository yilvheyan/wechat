// fornat eg. 'Y.M.D' 'Y.M.D h:m:s' 'Y.M.D h:m'
const formatTime = (date, format = 'Y.M.D') => {
    if (!date.getDate())
        return '';
    let fa = format.split('');
    let len = fa.length;
    let chars = [],
        a1 = [],
        a2 = [];
    let b1 = '.',
        b2 = ':';
    for (let i = 0; i < len; i++) {
        switch (fa[i]) {
            case 'Y':
                a1.push(date.getFullYear());
                break;
            case 'M':
                a1.push(date.getMonth() + 1);
                break;
            case 'D':
                a1.push(date.getDate());
                break;
            case 'h':
                a2.push(date.getHours());
                break;
            case 'm':
                a2.push(date.getMinutes());
                break;
            case 's':
                a2.push(date.getSeconds());
                break;
            default:
                if (chars.indexOf(fa[i]) == -1 && fa[i] != ' ') {
                    chars.push(fa[i]);
                }
        }
    }

    if (chars.length >= 2) {
        b1 = chars[0];
        b2 = chars[1];
    } else if (chars.length == 1) {
        b1 = chars[0];
    }

    let res = '';
    if (a1.length > 1) {
        res += a1.map(formatNumber).join(b1);
    } else if (a1.length == 1) {
        res += a1.map(formatNumber);
    }
    if (a2.length > 1) {
        res += ' ' + a2.map(formatNumber).join(b2);
    } else if (a2.length == 1) {
        res += a2.map(formatNumber);
    }
    return res;
}

const formatTimeByTs = (timestamp, format = 'Y.M.D') => {
    //return new Date(timestamp).toString();
    if (typeof(timestamp) == 'string' && timestamp.indexOf(':') >= 0)
        return formatTime(new Date(timestamp.replace(/-/g, '/').replace(/\./g, '/')), format);
    else
        return formatTime(new Date(timestamp * 1000), format);
}

const formatNumber = n => {
    n = n.toString();
    return n[1] ? n : '0' + n;
}
const getallheigth = () => {
    let viewheigth = {}
    wx.getSystemInfo({
        success(res) {
            // console.log(res)
            // 获取可使用窗口宽度
            let clientHeight = res.windowHeight;
            // 获取可使用窗口高度
            let clientWidth = res.windowWidth;
            // // 算出比例
            let ratio = 750 / clientWidth;
            // // 算出高度(单位rpx)
            let height = clientHeight * ratio;
            // 设置高度
            viewheigth.clientHeight = clientHeight * 2,
                viewheigth.clientWidth = clientWidth * 2
        }
    });
    // console.log('viewheigth', viewheigth)
    return viewheigth
}


//获取微信基本信息
const getuserinfo=()=>{
  wx.getUserInfo({
    success: function(res) {
      console.log('res',res);
      // var userInfo = res.userInfo
      // var nickName = userInfo.nickName
      // var avatarUrl = userInfo.avatarUrl
      // var gender = userInfo.gender //性别 0：未知、1：男、2：女
      // var province = userInfo.province
      // var city = userInfo.city
      // var country = userInfo.country
      wx.setStorageSync('userinfo', res);
    }
  })
}

//微信登录
const getOpenid = (call) => {
    wx.login({
        success(res) {
            if (res.code) {
                console.log('res: ', res);
                wx.setStorageSync('js_code', res.code);
                wx.request({
                    url: getApp().globalData.publicUrl,
                    data: {
                        'act': 'account_querywxopenid',
                        'js_code': res.code
                        // 'js_code': '001liLm51gsE9S1ywSo512KOm51liLm6'
                    },
                    method: 'POST',
                    success: function(res) {
                        // success
                        console.log(res);
                        if (res.data.openid != undefined) {
                            getApp().globalData.openid = res.data.openid;
                            wx.setStorageSync('openid', res.data.openid);
                        }
                       if (call)
                            call();
                    }
                })
            } else {
                console.log('登录失败！' + res.errMsg);
            }
        }
    });
}

//获取当前地址
var QQMapWX = require('./qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
    key: 'GHIBZ-WKBWI-YJ6G5-5Z2G4-U4KU7-SFBV4' // 必填
});
const getAddress = () => {
    wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success(res) {
            const latitude = res.latitude
            const longitude = res.longitude
            // console.log('address')
            qqmapsdk.reverseGeocoder({
                location: {
                    latitude: latitude,
                    longitude: longitude
                },
                success: function(res) {
                    wx.setStorageSync('address_component', res.result.address_component)
                }
            })
        },
        fail(res) {
            console.log(res)
        }
    })
}


/* 
 * data为object参数
 * eg.
 * {
 *     'act': 'Presale_waitPartner',
 *     'offset': 0,
 *     'limit': 0
 * }
 */
const http={
  postJson: (url, data, cb = null, failcb=null) => {
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: getApp().globalData.publicUrl + url,
      data: data,
      method: 'POST',
      success: (res) => {
        res = res.data;
        console.log(url, res,res.ok,res.code);
       
        wx.hideLoading();
        if (res.code==10000 && cb)
          cb(res);
        else if (!res.ok && typeof failcb == 'function') { 
          failcb(res);
        }

    },
      fail: (res) => {
        res = res.data;
        console.log(url, res);
        // fail
        wx.hideLoading();
        wx.showModal({
          title: '网络错误',
          content: '网络出错，请刷新重试',
          showCancel: false
        });
        if (typeof failcb == 'function')
          failcb(res);     
      },
      complete: (res) => {
        // complete
      }
    })

  }, 

  get: (url, cb = null, failcb = null) => {
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: getApp().globalData.publicUrl + url, 
      method: 'GET',
      success: (res) => {
        res=res.data;
        console.log(url,res);
        wx.hideLoading();
        if (res.code == 10000 && cb)
          cb(res);
        else if (!res.ok && typeof failcb == 'function') { 
          failcb(res);
        }
      },
      fail: (res) => {
        res = res.data;
        // fail
        console.log(url, res);
        wx.hideLoading();
        wx.showModal({
          title: '网络错误',
          content: '网络出错，请刷新重试',
          showCancel: false
        });  
        if (typeof failcb == 'function')
          failcb(res);
      },
      complete: (res) => {
        // complete
      }
    })

  }
};
 

const goToLogin = content => {
    wx.showModal({
        title: '提示',
        content: content,
        showCancel: false,
        success(res) {
            if (res.confirm) {
                wx.reLaunch({ // 关闭全部页面
                    url: '/pages/home/home?action=login'
                });
            }
        }
    });
}
//假数据登录
const authinfo = () => { 
    http.get("auth/none", function(res) {
        if (res.ok) {
            console.log("11", res.data);
            wx.setStorageSync('role', res.data.role)
            wx.setStorageSync('userid', res.data.id)
            wx.setStorageSync('openid', res.data.openid)
            wx.setStorageSync('rolestate', res.data.rolestate)
            wx.setStorageSync('accountinfo', res.data)
            let userInfo = {};
            userInfo.nickName = res.data.nickname ;
          userInfo.avatarUrl = res.data.head ||"none";
          userInfo.gender = res.data.sex ||"none";
            wx.setStorageSync('userInfo', userInfo)
        }
    }, function fail(res){
    
    });
}
//自动登录
const autoLogin = () => {
    let lastUrl = getCurrentPageUrl();
    if (wx.getStorageSync('userInfo')) {
        req({
            'act': 'account_register',
            openid: wx.getStorageSync('openid')
        }, function(res, that) {
            if (res.ok) {
                wx.removeStorageSync('role');
                wx.setStorageSync('role', res.data.role)
                wx.setStorageSync('userid', res.data.id)
                wx.setStorageSync('rolestate', res.data.rolestate)
                wx.setStorageSync('accountinfo', res.data)
            } else {
                wx.reLaunch({ // 关闭全部页面
                    url: '/pages/home/home?url=' + lastUrl
                });
            }

        });
    } else {
        wx.reLaunch({
            url: '/pages/home/home'
        });
    }





    // if (wx.getStorageSync('phone') && wx.getStorageSync('password')) {

    // req({
    //   'act': 'account_login',
    //   'phone': wx.getStorageSync('phone'),
    //   'passwd': wx.getStorageSync('password')
    // }, function(res, that) {
    //   if (res.ok) {
    //     // wx.removeStorageSync('role');
    //     wx.setStorageSync('role', res.data.role);
    //   } 
    // else {
    //   wx.reLaunch({ // 关闭全部页面
    //     url: '/pages/home/home?action=login&url=' + lastUrl
    //   });
    // }
    // });
    // } else {
    // wx.reLaunch({
    //   url: '/pages/home/home?action=login'
    // });
    // }
}

/*获取当前页url*/
const getCurrentPageUrl = () => {
    var pages = getCurrentPages(); //获取加载的页面
    var currentPage = pages[pages.length - 1]; //获取当前页面的对象
    var url = currentPage.route; //当前页面url
    return url
}



const orderstate = (state) => {
    let v = null;
    switch (state) {
        case 0:
            v = '未付款';
            break;
        case 1:
            v = '付款成功';
            break;
        case 2:
            v = '退款申请';
            break;
        case 3:
            v = '退款中';
            break;
        case 4:
            v = '退款完成';
            break;
        case 5:
            v = '失效';
            break;
        case 6:
            v = '付款失败';
            break;
        case 7:
            v = '待收货';
            break;
        case 8:
            v = '删除订单';
            break;
        case 9:
            v = '订单完成';
            break;
        default:
            v = "空";
    }
    return v
}

const scoresstate = (state) => {
    let v = null;
    switch (state) {
        case 0:
            v = '未付款';
            break;
        case 1:
            v = '付款成功';
            break;
        case 2:
            v = '已发货';
            break;
        case 3:
            v = '订单完成';
            break;
        case 4:
            v = '退款申请中';
            break;
        case 5:
            v = '退款完成';
            break;
        case 6:
            v = '失效';
            break;
        case 7:
            v = '待发货';
            break;
        case 8:
            v = '待收货';
            break;
        default:
            v = "空";
    }
    return v
}

const shopstate = (state) => {
    let v = null;
    switch (state) {
        case 0:
            v = '未付款';
            break;
        case 1:
            v = '付款成功';
            break;
        case 2:
            v = '已发货';
            break;
        case 3:
            v = '订单完成';
            break;
        case 4:
            v = '退款申请中';
            break;
        case 5:
            v = '退款完成';
            break;
        case 6:
            v = '失效';
            break;
        case 7:
            v = '待发货';
            break;
        case 8:
            v = '待收货';
            break;
        case 8:
            v = '删除订单';
            break;
        default:
            v = "空";
    }
    return v
}





module.exports = {
    formatTime: formatTime, //将时间改为时间戳
    formatTimeByTs: formatTimeByTs, //将时间戳改为时间
    getOpenid: getOpenid,
    http:http,
    orderstate: orderstate,
    shopstate: shopstate,
    scoresstate: scoresstate,
    authinfo: authinfo,
    getallheigth: getallheigth,
    getAddress: getAddress,
    getCurrentPageUrl: getCurrentPageUrl,
    formatNumber: formatNumber,
    getuserinfo: getuserinfo
}