Page({
  data: {
    showCates: false,
    current_cate: 1,
    cates: [
      { key: 1, title: 'Home' },
      { key: 2, title: '生活随笔' },
      { key: 3, title: '数据库' },
      { key: 4, title: '后端开发' },
      { key: 5, title: '前端开发' },
      { key: 6, title: '运维笔记' }
    ],
    showTopLoading: false,
    showBottomLoading: false,
    loadingTime: 500,
    articles: [],
    pageno: 1,
    pagesize: 6
  },

  handleTapCateBar: function(event) {
    var cate = event.currentTarget.dataset.cate;
    if (cate.key == this.data.current_cate) {
      this.setData({
        current_cate: cate.key,
        showCates: false
      });
    } else {
      this.setData({
        current_cate: cate.key,
        showCates: true
      });
    }
  },

  handleArticleTap: function (event) {
    var article = event.currentTarget.dataset.article;
  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    var that = this;
    this.setData({
      showTopLoading: true
    });
    setTimeout(function () {
      that.setData({
        articles: [],
        pageno: 1,
        pagesize: 6
      });
      that.requestAppendArticles(function () {
        that.setData({
          showTopLoading: false
        });
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading();
      });
    }, that.data.loadingTime);
  },

  onReachBottom: function() {
    var that = this;
    var pageno = this.data.pageno + 1;
    this.setData({
      showBottomLoading: true
    });
    setTimeout(function() {
      that.requestAppendArticles(function () {
        that.setData({
          showBottomLoading: false
        });
      });
    }, this.data.loadingTime);
  },

  formatTime: getApp().utils.formatTime,

  requestAppendArticles: function (callback=function(){}) {
    var WxParse = require('../../wxParse/wxParse.js');
    var that = this;
    var app = getApp();
    wx.request({
      url: app.data.apis.article_list,
      data: {
        pageno: that.data.pageno,
        pagesize: that.data.pagesize
      },
      success: function (res) {
        if (res.data.status == 200) {
          var data = res.data.data;
          var len = data.length;
          var start = that.data.articles.length;
          data.map(function (item, index) {
            item.published_at = that.formatTime(item.published_at);
            var idx = start + index;
            WxParse.wxParse('parseSummary' + idx, 'html', item.summary, that, 5);
            if (index === len - 1) {
              WxParse.wxParseTemArray('summaryArray', 'parseSummary', len+start, that)
            }
          });

          var _new = that.data.articles.concat(data);

          that.setData({
            articles: _new
          });
        }
      },
      complete: function() {
        callback();
      }
    });
  },

  onLoad: function() {
    this.requestAppendArticles(function () {});
  }
});
