// pages/mineSetting/mineSetting.js
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headPortrait: '',
    name: '',
    post:'',
    changeName:false,
    changeJobs:false,
    shows: false,
    getName:'',
    getPost:''
  },

  // 点击遮罩层，显示的遮罩层与面板又隐藏起来 修改手机号
  closeShade: function () {
    this.setData({
      changeName: false,
      changeJobs: false,
      shows: false,
    })
  },

  //实时更新输入框的值
  updateInfo(e) {
    if (e.currentTarget.dataset.key == 'name') {
      this.setData({
        getName: e.detail.value
      })
    } else {
      this.setData({
        getPost: e.detail.value
      })
    }
  },

  updateUserInfo(e){
    wx.getStorage({
      key: 'user_id',
      success: res => {
        let update = {}
        if (e.currentTarget.dataset.key == 'name'){
          update = {
            user_id: res.data,
            name: this.data.getName,
          }
        }else{
          update = {
            user_id: res.data,
            post: this.data.getPost,
          }
        }
        wx.request({
          url: util.url + '/user/update_info', // 仅为示例，并非真实的接口地址
          data: update,
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': '*/*'
          },
          success: res => {
            if (res.data.ret == 0) {
              wx.showToast({
                title: '修改成功',
                icon: 'success'
              })
              this.closeShade()
              this.fetchInfo()
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
  },

  // 修改姓名弹出
  changeName: function () {
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
      changeName: true,
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


  changeJobs: function (e) {
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
      changeJobs: true,
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
        changeName: false,
        changeJobs: false,
        shows: false,
      })
    }, 200)
  },

  fetchInfo(){
    wx.getStorage({
      key: 'user_id',
      success: res => {
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
                name: res.data.data.name
              })
              if (res.data.data.post != '') {
                this.setData({
                  post: res.data.data.post
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchInfo()
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