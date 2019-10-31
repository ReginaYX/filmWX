// pages/shooting/shooting.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    session_id:'',
    sessions:'',
    info:'',
    detail_id:'',
    notice_id:'',
    open:true,
    height:'',
    location:''
  },

  // 折叠
  fold(){
   
    this.setData({
      open: !this.data.open
    })
  },

  // 页面数据加载完成后调用 wx.stopPullDownRefresh()
  getSceneInfo() {
    wx.request({
      url: util.url + '/notice/get_session_info', // 仅为示例，并非真实的接口地址
      data: {
        session_id: this.data.session_id,
        shoot_location_id: this.data.location
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: data => {
        if (data.data.data != '' && data.data.ret == '0') {
          this.setData({
            info: data.data.data
          })
          let query = wx.createSelectorQuery();
          query.select('.otherInfoBox').boundingClientRect(rect => {
            this.setData({
              height: 'height:'+rect.height+'px'
            })
          }).exec();
        }else{
          wx.showToast({
            title: data.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      session_id: options.id,
      location: options.location
    })
    this.getSceneInfo()
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
  onPullDownRefresh () {
    wx.stopPullDownRefresh()
    this.getSceneInfo()
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