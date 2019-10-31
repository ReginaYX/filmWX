// pages/notice/notice.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    project_id: '',
    user_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  img(){
    wx.previewImage({
      current: this.data.url, // 当前显示图片的http链接
      urls: [this.data.url] // 需要预览的图片http链接列表
    })
  },

  fetchInfo() {
    wx.getStorage({
      key: 'detail_id',
      success: data => {
        wx.downloadFile({
          url: util.url + '/notice/get_pdf_image?detail_id=' + data.data + '&project_id=' + this.data.project_id + '&user_id=' + this.data.user_id,
          success: (res) => {
            var Path = res.tempFilePath
            this.setData({
              url: Path
            })
            wx.hideLoading()
          }
        })
      }
    }) 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getStorage({
      key: 'user_id',
      success: id => {
        this.setData({
          user_id: id.data
        })
        wx.getStorage({
          key: 'project',
          success: res => {
            this.setData({
              project_id: res.data
            })
            this.fetchInfo()
          }
        })
      }
    })
    wx.showLoading({
      title: '加载中',
    })
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
  onShareAppMessage: function () {

  }
})