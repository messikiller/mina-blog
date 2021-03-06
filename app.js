//app.js
var utils = require('./utils/util.js');
const Towxml = require('/towxml/main');
App({
  onLaunch: function () {
    wx.showLoading({
      title: 'Loading...'
    });
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },


  towxml: new Towxml(),

  onShow: function() {
    wx.hideLoading();
  },
  globalData: {
    userInfo: null
  },
  data: {
    apis: {
      category_list: 'https://api.messikiller.net/category/list',
      article_list: 'https://api.messikiller.net/article/list',
      article_view: 'https://api.messikiller.net/article/view'
    },
    status: {
      ok: 200
    }
  },
  utils: utils,
  handleShareApp: function(param={}) {
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var url = currentPage.route;

    var obj = Object.assign({
      title: 'Messikiller\'s Blog',
      path: url
    }, param);

    return {
      title: obj.title,
      path: obj.url
    };
  },
  showLoading: function() {
    wx.showLoading({
      title: 'Loading...'
    });
  },
  hideLoading: function() {
    wx.hideLoading();
  }
})