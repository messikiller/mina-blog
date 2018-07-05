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
    articles: []
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
    console.log('/pages/view/view?id=' + article.id);
    wx.navigateTo({
      url: '/pages/view/view?id=' + article.id
    })
  },

  formatTime: getApp().utils.formatTime,

  onLoad: function() {
    var WxParse = require('../../wxParse/wxParse.js');

    var that = this;
    getApp().requestArticleList(function(result) {
      var data = result.data;
      var len = data.length;
      data.map(function(item, index) {
        item.published_at = that.formatTime(item.published_at);
        WxParse.wxParse('parseSummary' + index, 'html', item.summary, that, 5);
        if (index === len - 1) {
          WxParse.wxParseTemArray('summaryArray', 'parseSummary', len, that)
        }
      });

      that.setData({
        articles: data
      });
    });
  }
});
