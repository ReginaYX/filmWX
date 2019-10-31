// pages/login/login.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: '',
    password: '',
    project:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  formReset(e) {
    this.setData({
      account: ''
    })
  },


  accountInput(e){
    this.setData({
      account: e.detail.value,
    })
  },

  goToRegister: function () {
    wx.navigateTo({
      url: '/pages/register/register',
    })
  },

  goToForget: function () {
    wx.navigateTo({
      url: '/pages/forgetPwd/forgetPwd',
    })
  },

  formSubmit(e) {
    if (e.detail.value.account != '' && e.detail.value.password != ''){
      wx.request({
        url: util.url + '/home/login', // 仅为示例，并非真实的接口地址
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: util.json2Form(e.detail.value),
        success: res => {
          if (res.data.ret == 0) {
            wx.setStorage({
              key: 'user_id',
              data: res.data.data.user_id
            })
            wx.request({
              url: util.url + '/auth/user/info',
              data: {
                user_id: res.data.data.user_id
              },
              header: {
                'content-type': 'application/json' 
              }
            })
            wx.getStorage({
              key: 'project',
              success:res1=> {
                this.setData({
                  project: res1.data,
                  user_id: res.data.data.user_id
                })
                this.department()
              },
              fail:res=>{
                wx.switchTab({
                  url: '/pages/index/index'
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
    } else {
      wx.showToast({
        title: '请填写完整',
        icon: 'none',
        duration: 2000
      })
    }
  },

  department(){
    wx.getStorage({
      key: 'department',
      success:res=> {
        let form1 = { user_id: this.data.user_id, project_id: this.data.project, department_id: res.data }
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