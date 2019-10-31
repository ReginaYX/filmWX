// pages/checkmp/checkmp.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id: '',
    codeTime: 0,//验证码倒计时
    phone: '',
    code: '',
    again: false,//重新发送
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: options.phone,
    })
  },

  sendCode() {
    wx.request({
      url: util.url + '/sms/verify_current_phone', // 仅为示例，并非真实的接口地址
      data: {
        phone: this.data.phone
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: data => {
        if (data.data.ret == 1) {
          wx.showToast({
            title: data.data.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          this.setData({
            codeTime: 60
          })
          let that = this;
          let currentTime = this.data.codeTime
          var auth_timetimer = setInterval(() => {
            currentTime--;
            if (that.data.codeTime == 0) {
              that.setData({
                codeTime: 0,
                again: true
              })
              clearInterval(auth_timetimer);
            } else {
              that.setData({
                codeTime: currentTime
              })
            }
          }, 1000);
        }
      }
    })
  },

  formSubmit(e) {
    if (e.detail.value.phone != '' && e.detail.value.code != '') {
      wx.request({
        url: util.url + '/account/verify_current_phone', // 仅为示例，并非真实的接口地址
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: util.json2Form(e.detail.value),
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


  checkPwd(){
    wx.navigateTo({
      url: "/pages/checkpwd/checkpwd?phone="+this.data.phone
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