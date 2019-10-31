// pages/setting/setting.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id:'',
    info:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  checkPhone() {
    wx.navigateTo({
      url: "/pages/checkmp/checkmp?phone="+this.data.info.phone
    })
  },

  bingingPhone(){
    wx.navigateTo({
      url: "/pages/binding/binding"
    })
  },

  revisePwd(){
    wx.navigateTo({
      url: "/pages/updatePwd/updatePwd"
    })
  },

  fetchData(){
    wx.request({
      url: util.url + '/user/info',
      data: {
        user_id: this.data.user_id
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        if (res.data.ret == 0) {
          this.setData({
            info: res.data.data,
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.user_id != '') {
      this.fetchData()
    }else{
      wx.getStorage({
        key: 'user_id',
        success: res => {
          this.setData({
            user_id: res.data
          })
          this.fetchData()
        },
        fail: res => {
          wx.navigateTo({
            url: "/pages/login/login"
          })
        }
      })
    }
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
    wx.stopPullDownRefresh();
    this.fetchInfo()
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