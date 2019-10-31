// pages/complete/complete.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: '',
    index: '',
    sex:1,
    project:'',
    project_id:'',
    user_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  radioChange: function (e) {
    this.setData({
      sex: e.detail.value
    })
  },

  formSubmit(e) {
    if (e.detail.value.name != '') {
      wx.getStorage({
        key: 'user_id',
        success: res1 => {
          this.setData({
            user_id: res1.data
          })
          let form = { user_id: res1.data, name: e.detail.value.name, sex: this.data.sex}
          wx.request({
            url: util.url + '/user/update_info', // 仅为示例，并非真实的接口地址
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data: util.json2Form(form),
            success: res => {
              if (res.data.ret == 0) {
                this.department()
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
        title: '请填写完整',
        icon: 'none',
        duration: 2000
      })
    }
  },

  department() {
    wx.getStorage({
      key: 'department',
      success: res => {
        let form1 = { user_id: this.data.user_id, project_id: this.data.project_id, department_id: res.data }
        wx.request({
          url: util.url + '/auth/update_member', // 仅为示例，并非真实的接口地址
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: util.json2Form(form1),
          success: data => {
            if (data.data.ret == 0) {
              wx.removeStorage({
                key: 'department'
              })
              wx.switchTab({
                url: '/pages/index/index'
              })
            } else {
              wx.showToast({
                title: data.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
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
      key: 'project',
      success: res1 => {
        wx.request({
          url: util.url + '/project/info', // 仅为示例，并非真实的接口地址
          data: {
            project_id: res1.data
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
                project: data.data.data.name,
                project_id: res1.data
              })
            }
          }
        })
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