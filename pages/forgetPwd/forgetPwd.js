// pages/forgetPwd/forgetPwd.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeTime: 0,//验证码倒计时
    account:'',
    pwd:'',
    project: '',
    user_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  accountInput: function (e) {
    this.setData({
      account: e.detail.value
    })
  },

  pwdInput: function (e) {
    this.setData({
      pwd: e.detail.value
    })
  },

  sendCode() {
    var regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (this.data.account!=''){
      if (regEmail.test(this.data.account)) {
        wx.request({
          url: util.url + '/email/password_forget', // 仅为示例，并非真实的接口地址
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: {
            email: this.data.account
          },
          success: res => {
            if (res.data.ret == 0) {
              this.setData({
                codeTime: 60
              })
              let that = this;
              let currentTime = this.data.codeTime
              var auth_timetimer = setInterval(() => {
                currentTime--;
                if (that.data.codeTime == 0) {
                  that.setData({
                    codeTime: 0
                  })
                  clearInterval(auth_timetimer);
                } else {
                  that.setData({
                    codeTime: currentTime
                  })
                }
              }, 1000);
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
        wx.request({
          url: util.url + '/sms/password_forget',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: {
            phone: this.data.account
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
                    codeTime: 0
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
      }
    }else{
      wx.showToast({
        title: '请填写完整',
        icon: 'none',
        duration: 2000
      })
    }
  },

  formSubmit(e) {
    if (e.detail.value.account != '' && e.detail.value.code != '' && e.detail.value.password != '') {
      var regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      if (regEmail.test(e.detail.value.account)) {
        let form = { email: e.detail.value.account, code: e.detail.value.code, password: e.detail.value.password}
        wx.request({
          url: util.url + '/home/password_reset_email',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: util.json2Form(form),
          success: res => {
            if (res.data.ret == 0) {
              wx.showToast({
                title: '修改成功，正在登录',
                icon: 'success',
                duration: 2000
              })
              this.login()
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
        let form = { phone: e.detail.value.account, code: e.detail.value.code, password: e.detail.value.password }
        wx.request({
          url: util.url + '/home/password_reset_sms',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: util.json2Form(form),
          success: res => {
            if (res.data.ret == 0) {
              wx.showToast({
                title: '修改成功，正在登录',
                icon: 'success',
                duration: 2000
              })
              this.login()
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
    } else {
      wx.showToast({
        title: '请填写完整',
        icon: 'none',
        duration: 2000
      })
    }
  },

  login(){
    let form = {account:this.data.account,password:this.data.pwd}
    wx.request({
      url: util.url + '/home/login', // 仅为示例，并非真实的接口地址
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: util.json2Form(form),
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
            success: res1 => {
              this.setData({
                project: res1.data,
                user_id: res.data.data.user_id
              })
            }
          })
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
  },

  department() {
    wx.getStorage({
      key: 'department',
      success: res => {
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