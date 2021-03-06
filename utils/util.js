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
            // ???????????????????????????
            let clientHeight = res.windowHeight;
            // ???????????????????????????
            let clientWidth = res.windowWidth;
            // // ????????????
            let ratio = 750 / clientWidth;
            // // ????????????(??????rpx)
            let height = clientHeight * ratio;
            // ????????????
            viewheigth.clientHeight = clientHeight * 2,
                viewheigth.clientWidth = clientWidth * 2
        }
    });
    // console.log('viewheigth', viewheigth)
    return viewheigth
}


//????????????????????????
const getuserinfo=()=>{
  wx.getUserInfo({
    success: function(res) {
      console.log('res',res);
      // var userInfo = res.userInfo
      // var nickName = userInfo.nickName
      // var avatarUrl = userInfo.avatarUrl
      // var gender = userInfo.gender //?????? 0????????????1?????????2??????
      // var province = userInfo.province
      // var city = userInfo.city
      // var country = userInfo.country
      wx.setStorageSync('userinfo', res);
    }
  })
}

//????????????
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
                console.log('???????????????' + res.errMsg);
            }
        }
    });
}

//??????????????????
var QQMapWX = require('./qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
    key: 'GHIBZ-WKBWI-YJ6G5-5Z2G4-U4KU7-SFBV4' // ??????
});
const getAddress = () => {
    wx.getLocation({
        type: 'gcj02', //??????????????????wx.openLocation????????????
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
 * data???object??????
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
      title: '?????????',
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
          title: '????????????',
          content: '??????????????????????????????',
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
      title: '?????????',
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
          title: '????????????',
          content: '??????????????????????????????',
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
        title: '??????',
        content: content,
        showCancel: false,
        success(res) {
            if (res.confirm) {
                wx.reLaunch({ // ??????????????????
                    url: '/pages/home/home?action=login'
                });
            }
        }
    });
}
//???????????????
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
//????????????
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
                wx.reLaunch({ // ??????????????????
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
    //   wx.reLaunch({ // ??????????????????
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

/*???????????????url*/
const getCurrentPageUrl = () => {
    var pages = getCurrentPages(); //?????????????????????
    var currentPage = pages[pages.length - 1]; //???????????????????????????
    var url = currentPage.route; //????????????url
    return url
}



const orderstate = (state) => {
    let v = null;
    switch (state) {
        case 0:
            v = '?????????';
            break;
        case 1:
            v = '????????????';
            break;
        case 2:
            v = '????????????';
            break;
        case 3:
            v = '?????????';
            break;
        case 4:
            v = '????????????';
            break;
        case 5:
            v = '??????';
            break;
        case 6:
            v = '????????????';
            break;
        case 7:
            v = '?????????';
            break;
        case 8:
            v = '????????????';
            break;
        case 9:
            v = '????????????';
            break;
        default:
            v = "???";
    }
    return v
}

const scoresstate = (state) => {
    let v = null;
    switch (state) {
        case 0:
            v = '?????????';
            break;
        case 1:
            v = '????????????';
            break;
        case 2:
            v = '?????????';
            break;
        case 3:
            v = '????????????';
            break;
        case 4:
            v = '???????????????';
            break;
        case 5:
            v = '????????????';
            break;
        case 6:
            v = '??????';
            break;
        case 7:
            v = '?????????';
            break;
        case 8:
            v = '?????????';
            break;
        default:
            v = "???";
    }
    return v
}

const shopstate = (state) => {
    let v = null;
    switch (state) {
        case 0:
            v = '?????????';
            break;
        case 1:
            v = '????????????';
            break;
        case 2:
            v = '?????????';
            break;
        case 3:
            v = '????????????';
            break;
        case 4:
            v = '???????????????';
            break;
        case 5:
            v = '????????????';
            break;
        case 6:
            v = '??????';
            break;
        case 7:
            v = '?????????';
            break;
        case 8:
            v = '?????????';
            break;
        case 8:
            v = '????????????';
            break;
        default:
            v = "???";
    }
    return v
}





module.exports = {
    formatTime: formatTime, //????????????????????????
    formatTimeByTs: formatTimeByTs, //????????????????????????
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