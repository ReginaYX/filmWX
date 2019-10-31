// pages/feedback/feedback.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:'',
    contact:''
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

  formReset(){
    this.setData({
      info: '',
      contact: ''
    })
  },

  formSubmit(e){
    if (e.detail.value.contact!=''){
      wx.request({
        url: util.url + '/feedback/commit',
        method: 'POST',
        data: util.json2Form(e.detail.value),
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          if (res.data.ret == 0) {
            wx.navigateBack()
            wx.showToast({
              title: '感谢您的反馈',
              icon: 'success',
              duration: 2000
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
    }else{
      wx.showToast({
        title: '请填写完整',
        icon: 'none',
        duration: 2000
      })
    }
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
  onShareAppMessage: function () {

  }
})