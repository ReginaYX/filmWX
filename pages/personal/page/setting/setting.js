// pages/setting/setting.js
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shows:false,
    chooseSize: false,
    changePwd:false,
    animationData: {},
    pwd: '',
    pwdNew:'',
    confirmPWD: '',
    error: '',
    emptyIcon1: false,
    emptyIcon2: false,
    headPortrait: '',
    name: '',
    wchat:'',
    email:'',
    phone:'',
    codeTime: 0,//验证码倒计时
    tip: false,//提示信息
    again: false,//重新发送
    user_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'user_id',
      success: res => {
        this.setData({
          user_id: res.data
        })
        wx.request({
          url: util.url + '/user/info', // 仅为示例，并非真实的接口地址
          data: {
            user_id: res.data
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: res => {
            if (res.data.ret == 0) {
              this.setData({
                headPortrait: res.data.data.profile_picture,
                name: res.data.data.name,
              })
              if (res.data.data.email){
                this.setData({
                  email: res.data.data.email,
                })
              }
            } else {
              this.setData({
                error: res.data.msg,
              })
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
  },

  updateFormData(e){
    if (e.currentTarget.dataset.key == 'phone') {
      this.setData({
        phone: e.detail.value,
        error: '',
      })
    } else if (e.currentTarget.dataset.key == 'code'){
      this.setData({
        code: e.detail.value
      })
    } else if (e.currentTarget.dataset.key == 'pwd') {
      this.setData({
        pwd: e.detail.value
      })
    } else if (e.currentTarget.dataset.key == 'pwdNew') {
      this.setData({
        pwdNew: e.detail.value
      })
    } else if (e.currentTarget.dataset.key == 'confirmPWD') {
      this.setData({
        confirmPWD: e.detail.value
      })
    }
  },

  empty() {
    this.setData({
      phone: '',
      codeTime: 0,
      tip: false,
      emptyIcon: false
    })
  },

  sendCode() {
    if (this.data.phone.match(/^[1][3,4,5,7,8][0-9]{9}$/)) {
      wx.request({
        url: util.url + '/account/check_exist', // 仅为示例，并非真实的接口地址
        data: {
          account: this.data.phone
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: data => {
          if (data.data.ret == 1) {
            this.setData({
              error: data.data.msg,
              tip: false,
            })
          }else{
            wx.request({
              url: util.url + '/sms/bind_phone', //仅为示例，并非真实的接口地址
              data: {
                phone: this.data.phone,
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: (res) => {
                this.setData({
                  codeTime: 60,
                  tip: true,
                  again: false,
                  error: '',
                  emptyIcon: true
                })
                let that = this;
                let currentTime = this.data.codeTime
                var auth_timetimer = setInterval(() => {
                  currentTime--;
                  if (that.data.codeTime == 0) {
                    that.setData({
                      codeTime: 0,
                      tip: false,
                      again: true
                    })
                    clearInterval(auth_timetimer);
                  } else {
                    that.setData({
                      codeTime: currentTime
                    })
                  }
                  if (that.data.codeTime <= 0) {
                    that.setData({
                      codeTime: 0,
                      tip: false,
                      again: true
                    })
                    clearInterval(auth_timetimer);
                  }
                }, 1000);
              }
            })
          }
        }
      })
    } else {
      this.setData({
        error: '请填写正确手机号',
        tip: ''
      })
    }
    
  },

  binding(){
    wx.request({
      url: util.url +'/account/bind_phone', //仅为示例，并非真实的接口地址
      data: {
        phone: this.data.phone,
        code: this.data.code,
        user_id: this.data.user_id,
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': '*/*'
      },
      success: (res)=> {
        if(res.data.ret == '0'){
          wx.showToast({
            title: '修改成功',
            icon: 'success'
          })
          this.closeShade()
        }
      }
    })
  },

  toMineSetting:()=>{
    wx.navigateTo({
      url: "/pages/personal/page/mineSetting/mineSetting"
    })
  },

  // 点击遮罩层，显示的遮罩层与面板又隐藏起来 修改手机号
  closeShade: function () {
    this.setData({
      chooseSize: false,
      changePwd: false,
      shows: false,
      pwd: '',
      pwdNew: '',
      confirmPWD: '',
      phone: '',
      error: '',
      code: '',
      codeTime: 0,
    })
  },


  // 修改密码弹出
  GoToSettingPwd: function () {
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 500,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(200).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      changePwd: true,
      shows: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },


  chooseSezi: function (e) {
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 500,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(200).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      chooseSize: true,
      shows:true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },

  // 底部弹窗动画
  hideModal: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false,
        changePwd:false,
        shows: false,
        pwd: '',
        pwdNew: '',
        confirmPWD: '',
        phone: '',
        error: '',
        code: '',
        codeTime: 0,
      })
    }, 200)
  },

  finish: function () {
    if (this.data.confirmPWD == this.data.pwdNew && this.data.pwdNew != '' && this.data.pwd != '') {
      wx.request({
        url: util.url + '/account/password_update', //仅为示例，并非真实的接口地址
        data: {
          password_old: this.data.pwd,
          password_new: this.data.pwdNew,
          user_id: this.data.user_id,
        },
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Accept': '*/*'
        },
        success: (res) => {
          if (res.data.ret == '0') {
            wx.showToast({
              title: '修改成功',
              icon: 'success'
            })
            this.closeShade()
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    } else if (this.data.confirmPWD != this.data.pwdNew) {
      this.setData({
        error: '两次密码不一致，请重新输入'
      })
    } else {
      this.setData({
        error: '请填写完整'
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