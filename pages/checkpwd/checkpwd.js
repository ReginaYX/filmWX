// pages/checkpwd/checkpwd.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: options.phone,
    })
  },

  formSubmit(e) {
    if (e.detail.value.password != '') {
      let form = e.detail.value
      form.phone = this.data.phone
      wx.request({
        url: util.url + '/account/verify_current_phone', // 仅为示例，并非真实的接口地址
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: util.json2Form(form),
        success: res => {
          if (res.data.ret == 0) {
            wx.navigateTo({
              url: "/pages/binding/binding"
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
    } else {
      wx.showToast({
        title: '请填写完整',
        icon: 'none',
        duration: 2000
      })
    }
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
  onShareAppMessage: function () {

  }
})