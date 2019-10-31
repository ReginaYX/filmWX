// pages/invite/invite.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    project_id:'',
    code:[],
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

  imageShare(){
    wx.previewImage({ urls:this.data.code})
  },

  fetchInfo() {
    wx.request({
      url: util.url + '/auth/get_qr_code', // 仅为示例，并非真实的接口地址
      data: {
        project_id: this.data.project_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        if (res.data.ret == 0) {
          this.setData({
            code: [util.url + '/files/' + res.data.data]
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getStorage({
      key: 'project',
      success: id => {
        this.setData({
          project_id: id.data
        })
        this.fetchInfo()
      }
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