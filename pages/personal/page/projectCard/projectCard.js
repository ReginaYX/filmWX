// pages/shooting/shooting.js
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addNewGroupNum: true,
    project:'',
    name:"",
    error:'',
    code:'',
    crew_id:'',
    empty:true
  },

  //事件处理函数

  //加入群组弹窗
  addNewGroup: function (e) {
    this.setData({
      addNewGroupNum: false,
      shows: true,
      crew_id: e.currentTarget.dataset.crew
    })
  },

  update(e){
    if (e.currentTarget.dataset.key == 'name') {
      this.setData({
        name: e.detail.value
      })
    } else {
      this.setData({
        code: e.detail.value
      })
    }
  },

  search(){
    wx.request({
      url: util.url + '/crew/search', // 仅为示例，并非真实的接口地址
      data: {
        q: this.data.name
      },
      success: res => {
        if (res.data.ret == 0) {
          let arr = []
          for (let i = 0; i < res.data.data.length; i++){
            if (res.data.data[i].crew_id){
              res.data.data[i].created_at = util.formatTimeTwo(res.data.data[i].created_at, 'Y/M/D h:m:s')
              arr.push(res.data.data[i])
              this.setData({
                empty: false
              })
            }
            this.setData({
              project: arr
            })
          }
          if (this.data.project == ''){
            this.setData({
              empty: false
            })
          }
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

  join(){
    wx.getStorage({
      key: 'user_id',
      success: res => {
        wx.request({
          url: util.url + '/crew/apply', // 仅为示例，并非真实的接口地址
          data: {
            code: this.data.code,
            crew_id: this.data.crew_id,
            user_id: res.data
          },
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': '*/*'
          },
          success: response => {
            if (response.data.ret == 0) {
              wx.showToast({
                title: '申请成功',
                icon: 'success'
              })
              this.closeGroup()
            } else {
              if (response.data.msg == '已在剧组中'){
                wx.showToast({
                  title: '已在剧组中',
                  icon: 'none'
                })
                this.closeGroup()
              }else{
                this.setData({
                  error: response.data.msg
                })
              }
            }
          }
        })
      }
    })
    
  },

  // 点击遮罩层，显示的遮罩层与面板又隐藏起来
  closeShade: function () {
    this.setData({
      addNewGroupNum: true,
      shows: false,
      code:'',
      error:''
    })
  },

  //关闭加入群组弹窗
  closeGroup: function () {
    this.setData({
      addNewGroupNum: true,
      shows: false,
      code: '',
      error: ''
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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