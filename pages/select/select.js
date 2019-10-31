// pages/select/select.js
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: '',
    index: '',
    project: '',
    project_id: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    login: false,
    user_id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      var pos = scene.indexOf('=');
      var result = scene.substring(pos + 1, scene.length);
      this.setData({
        project_id: result
      })
      wx.setStorage({
        key: 'project',
        data: result
      })
      wx.getStorage({
        key: 'user_id',
        success: res => {
          this.setData({
            login: true,
            user_id: res.data
          })
          wx.request({
            url: util.url + '/project/list', // 仅为示例，并非真实的接口地址
            data: {
              user_id: res.data
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: data => {
              if (data.data.ret == 0) {
                for (let i = 0; i < data.data.data.length; i++) {
                  if (data.data.data[i].project_id == result){
                    wx.switchTab({
                      url: '/pages/index/index'
                    })
                  }
              }
              }
            }
          })
        },
      })
      this.fetchInfo()
    }


    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onGotUserInfo(e) {
    if (this.data.index != '') {
      wx.login({
        success: res => {
          wx.request({
            url: util.url + '/home/xcx_login', // 仅为示例，并非真实的接口地址
            data: {
              code: res.code,
              encrypted_data: e.detail.encryptedData,
              iv: e.detail.iv
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: data => {
              if (data.data.ret == 0) {
                wx.setStorage({
                  key: 'user_id',
                  data: data.data.data.user_id
                })
                this.setData({
                  user_id: data.data.data.user_id
                })
                // if (data.data.data.phone != undefined && data.data.data.phone != '') {
                //   this.setData({
                //     login: true
                //   })
                //   this.formSubmit()
                // } else {
                  wx.setStorage({
                    key: 'department',
                    data: this.data.array[this.data.index].department_id
                  })
                  wx.redirectTo({
                    url: '/pages/login/login',
                  })
                // }
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
    } else {
      wx.showToast({
        title: '请填写完整',
        icon: 'none',
        duration: 2000
      })
    }
  },

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  formSubmit() {
    if (this.data.index != '') {
      let form1 = { user_id: this.data.user_id, project_id: this.data.project_id, department_id: this.data.array[this.data.index].department_id }
      wx.request({
        url: util.url + '/auth/update_member', // 仅为示例，并非真实的接口地址
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: util.json2Form(form1),
        success: data => {
          if (data.data.ret == 0) {
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
    } else {
      wx.showToast({
        title: '请填写完整',
        icon: 'none',
        duration: 2000
      })
    }
  },

  fetchInfo(){
    wx.request({
      url: util.url + '/project/info', // 仅为示例，并非真实的接口地址
      data: {
        project_id: this.data.project_id
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
            project_id: this.data.project_id
          })
        }
      }
    })
    wx.request({
      url: util.url + '/auth/get_department', // 仅为示例，并非真实的接口地址
      data: {
        project_id: this.data.project_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: data1 => {
        if (data1.data.ret == 1) {
          wx.showToast({
            title: data1.data.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          this.setData({
            array: data1.data.data
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