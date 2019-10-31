// pages/mine/mine.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    project_info:'',
    user_info:'',
    user_id:''
  },
  //事件处理函数

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  toGroup(){
    wx.navigateTo({
      url: "/pages/projectCard/projectCard"
    })
  },

  toHistory(){
    wx.navigateTo({
      url: "/pages/history/history"
    })
  },

  toSetting() {
    wx.navigateTo({
      url: "/pages/setting/setting"
    })
  },

  tofeedback() {
    wx.navigateTo({
      url: "/pages/feedback/feedback"
    })
  },

  fetchInfo(){
    wx.request({
      url: util.url + '/user/info', // 仅为示例，并非真实的接口地址
      data: {
        user_id: this.data.user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        if (res.data.ret == 0) {
          res.data.data.shortName = res.data.data.name.substr(0, 1)
          wx.getStorage({
            key: 'project',
            success: res1 => {
              wx.request({
                url: util.url + '/notice/get_name', // 仅为示例，并非真实的接口地址
                data: {
                  user_id: this.data.user_id,
                  project_id: res1.data
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: res2 => {
                  if (res2.data.ret == 0) {
                    this.setData({
                      user_info: res.data.data,
                      project_info: res2.data.data
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
            }
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
    wx.getStorage({
      key: 'user_id',
      success: res => {
        this.setData({
          user_id: res.data
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