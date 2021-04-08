// components/reasonPopupe/reasonPopupe.js
const app = getApp();
const util = require('../../utils/util.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    thisid: {
      type: 'String',
      value: ''
    },
    title: {
      type: 'String',
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    popuplist: [{
      name: ''
    }],
    getuserinfoShow: false,
    callback: null,
    whatyuanyin: '',
    mainxinxi: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show(cb) {
      if (cb) {
        this.setData({
          getuserinfoShow: true,
          callback: cb
        });
      } else {
        this.setData({
          getuserinfoShow: true,
          callback: null
        });
      }
      console.log('111111111', this.properties.thisid)
      util.http.postJson("fn/user/get/admin",{
        'act': 'Found_cancelReason',
      }, function(res) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].orderpopupic = false;
        }
        this.setData({
          popuplist: res.data
        })
      })
    },

    //选择举报类型
    selectList(e) {
      // console.log('e', e.currentTarget.dataset.index)
      let popuplist = this.data.popuplist
      if (popuplist[e.currentTarget.dataset.index].orderpopupic == true) {
        popuplist[e.currentTarget.dataset.index].orderpopupic = false
        this.data.whatyuanyin = 1000
      } else {
        for (let i = 0; i < popuplist.length; i++) {
          popuplist[i].orderpopupic = false;
          this.data.whatyuanyin = e.currentTarget.dataset.id
        }
        popuplist[e.currentTarget.dataset.index].orderpopupic = true
      }
      this.setData({
        popuplist: popuplist
      })
    },
    //其他举报内容
    textareainput(e) {
      // console.log(e.detail.value)
      this.data.mainxinxi = e.detail.value
    },
    //举报-提交按钮
    poplupetijiao: function() {
      console.log('aa', this.properties.thisid, this.data.whatyuanyin, this.data.mainxinxi)
      if (this.data.whatyuanyin == '' && this.data.mainxinxi == '') {
        wx.showToast({
          title: '请选择其中一个原因',
          icon: 'none',
          duration: 4000
        })
        return
      }
      //正式举报
      //TODO:举报链接
      util.http.postJson("fn/user/get/admin",{
        'act': 'Found_report',
        "id": this.properties.thisid, //这一信息的id
        'reasonid': this.data.whatyuanyin,
        'context': this.data.mainxinxi

      }, function(res) {
        if (res.ok) {
          if (thisdata.callback != null) {
            thisdata.callback();
          }
          this.setData({
            getuserinfoShow: false,
            callback: null
          });
        }

      })

    },
    //点击灰色部分
    closeshow() {
      this.setData({
        getuserinfoShow: false,
        callback: null
      });
    },
  }

})