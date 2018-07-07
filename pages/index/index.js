Page({
  data: {
    touchLastX: 0,
    touchLastY: 0,
    touchCuttentGesture: 0,
    showCates: false,
    current_cate: 0,
    pcates: [],
    showTabLoading: false,
    showTopLoading: false,
    showBottomLoading: false,
    loadingTime: 500,
    articles: [],
    pageno: 1,
    pagesize: 6,
    cate_pid: 0
  },

  formatTime: getApp().utils.formatTime,

  handleTapCateBar: function(event) {
    var cate = event.currentTarget.dataset.cate;
    this.changeCurrentCate(cate.id);
  },

  changeCurrentCate: function(cate_id) {
    this.setData({
      current_cate: cate_id,
      articles: [],
      pageno: 1,
      pagesize: 6,
      cate_pid: cate_id,
      showTabLoading: true
    });
    var that = this;
    setTimeout(function () {
      that.requestAppendArticles(function () {
        that.setData({
          showTabLoading: false
        });
      });
    }, this.data.loadingTime);
  },

  handleArticleTap: function (event) {
    var article = event.currentTarget.dataset.article;
    wx.navigateTo({
      url: '/pages/view/view?id=' + article.id
    })
  },

  handleArticlesTouchMove: function(event) {
    var currentX = event.touches[0].pageX
    var currentY = event.touches[0].pageY
    var tx = currentX - this.data.touchLastX
    var ty = currentY - this.data.touchLastY

    var size = 10;
    var currentGesture = this.data.touchCuttentGesture;
    
    if (Math.abs(tx) > Math.abs(ty) && Math.abs(tx) >= size) {
      if (tx < 0) {
        //left touch
        currentGesture = 1;
      } else if (tx > 0) {
        //right touch
        currentGesture = 2;
      }
    }

    this.setData({
      touchCuttentGesture: currentGesture,
      touchLastX: currentX,
      touchLastY: currentY
    });
  },

  handleArticlesTouchStart: function (event) {
    this.setData({
      touchLastX: event.touches[0].pageX,
      touchLastY: event.touches[0].pageY
    });
  },

  handleArticlesTouchEnd: function (event) {
    var currentGesture = this.data.touchCuttentGesture;
    var current_cate = this.data.current_cate;
    var cates = this.data.pcates;

    var previous = 0;
    var next = 0;
    var len = cates.length;
    cates.forEach(function(cate, index) {
      if (cate.id == current_cate) {
        next = index == (len - 1) ? 0 : (index + 1);
        previous = index == 0 ? (len - 1) : (index - 1);
      }
    });

    var next_cate = cates[next].id;
    var previous_cate = cates[previous].id;
    console.log(currentGesture);
    if (currentGesture == 1) {
      // touch move left
      this.changeCurrentCate(next_cate);

    } else if (currentGesture == 2) {
      // touch move right
      this.changeCurrentCate(previous_cate);
    }

    this.setData({
      currentGesture: 0
    });
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
    this.setData({
      pageno: that.data.pageno + 1,
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

  requestFreshPcates: function (param = {}, callback = function() {}) {
    var that = this;
    var app = getApp();
    wx.request({
      url: app.data.apis.category_list,
      data: {},
      success: function(res) {
        var pcates = [{
          id: 0,
          title: 'Home'
        }];
        if (res.data.status == app.data.status.ok) {
          var data = pcates.concat(res.data.data);
          that.setData({
            pcates: data
          });
        }
      }
    });
  },

  requestAppendArticles: function (callback=function(){}) {
    var WxParse = require('../../wxParse/wxParse.js');
    var that = this;
    var app = getApp();

    var param = {
      pageno: that.data.pageno,
      pagesize: that.data.pagesize
    };

    if (that.data.cate_pid > 0) {
      param.cate_pid = that.data.cate_pid;
    }

    wx.request({
      url: app.data.apis.article_list,
      data: param,
      success: function (res) {
        if (res.data.status == app.data.status.ok) {
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
    this.requestAppendArticles();
    this.requestFreshPcates();
  },

  onShareAppMessage: function (res) {
    return getApp().handleShareApp();
  }
});
