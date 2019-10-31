// pages/list/list.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice_id:'',
    tableData:[],
    info:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      notice_id: options.notice_id,
    })
    this.getDetail()
  },

  changeDetail(e){
    wx.setStorage({
      key: "detail_id",
      data: e.currentTarget.dataset.id
    })
    wx.reLaunch({
      url: '/pages/index/index'
    })
    
  },

  getDetail(){
    wx.request({
      url: util.url + '/notice/get_notice_by_notice_id', // 仅为示例，并非真实的接口地址
      data: {
        notice_id: this.data.notice_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        if (res.data.ret == 0) {
          this.setData({
            info: res.data.data
          })
          this.fetchData()
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

  fetchData(status) {
    let ceiling = '';
    let floor = '';
    if (status){
      if (status.detail.direction == 'top') {//向上获取
        ceiling = this.data.tableData[0].shoot_date - 86400 * 8;
        floor = this.data.tableData[this.data.tableData.length - 1].shoot_date;
      } else if (status.detail.direction == 'bottom') {//向下获取
        ceiling = this.data.tableData[0].shoot_date;
        floor = this.data.tableData[this.data.tableData.length - 1].shoot_date + 86400 * 8
      } else if (status == '2') {//刷新数据
        ceiling = this.data.tableData[0].shoot_date;
        floor = this.data.tableData[this.data.tableData.length - 1].shoot_date
      }
    }
    wx.request({
      url: util.url + '/notice/get_notice_detail', //获取单日通告总信息
      data: {
        notice_id: this.data.notice_id,
        ceiling_time_stamp: ceiling,
        floor_time_stamp: floor
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        if (res.data.ret == 0) {
          let days = res.data.data.notice_list[0].shoot_date - this.data.info.start_date;
          let firstDay;
          if (days <= 0) {
            firstDay = 1
          } else {
            firstDay = parseInt(days / 86400);
          }
          let arr = [];
          for (let i = 0; i < res.data.data.notice_list.length; i++) {
            if (res.data.data.notice_list[i].status != '3') {
              if (status == '0') {
                if (days != 0) {
                  res.data.data.notice_list[i].dayNum = firstDay--;
                } else {
                  res.data.data.notice_list[i].dayNum = firstDay++;
                }
              } else {
                res.data.data.notice_list[i].dayNum = firstDay++;
              }
            }
            arr.push(res.data.data.notice_list[i]);
          }
          this.setData({
            tableData: arr
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