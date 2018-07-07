// pages/view/view.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    title: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var WxParse = require('../../wxParse/wxParse.js');
    var id = options.id;
    var that = this;
    var app = getApp();

    wx.request({
      url: app.data.apis.article_view,
      data: {
        id: id
      },
      success: function(res) {
        if (res.data.status == app.data.status.ok) {
          var article = res.data.data;
          console.log(article);
          WxParse.wxParse('parseContent', 'html', article.content, that, 5);
          that.setData({
            id: article.id,
            title: article.title
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return getApp().handleShareApp();
  }
})