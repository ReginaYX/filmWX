// pages/projectCard.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id:'',
    list:'',
    length:'',
    i:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  changeProject(e){
    let index = this.data.list.findIndex(d => d.project_id == e.currentTarget.dataset.id);
    if (this.data.list[index].start_date == undefined){
      wx.showToast({
        title: '暂未创建通告单',
        icon: 'none',
        duration: 2000
      })
    }else{
      wx.setStorage({
        key: 'project',
        data: e.currentTarget.dataset.id
      })
      wx.removeStorage({
        key: 'detail_id'
      })
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  },

  fetchData(){
    wx.request({
      url: util.url + '/notice/get_project_list', //获取单日通告拍摄地
      data: {
        user_id: this.data.user_id
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        if (res.data.ret == 0) {
          wx.getStorage({
            key: 'project',
            success: data => {
              for (let i = 0; i < res.data.data.length; i++) {
                if (res.data.data[i].project_id == data.data) {
                  this.setData({
                    i:i
                  })
                }
              }
            }
          })
          this.setData({
            list: res.data.data,
            length: res.data.data.length
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
        this.fetchData()
      },
      fail: res => {
        wx.redirectTo({
          url: "/pages/logs/logs"
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
    wx.stopPullDownRefresh()
    this.fetchData()
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