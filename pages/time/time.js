//time.js
var util = require('../../utils/util.js')

Page({
  data: {
    index: '0',//切换菜单
    detail_id: '',
    goList:'',
    dressList:'',
    project_id:'',
    user_id:'',
    contactList: '',
  },
  //事件处理函数

  // 页面数据加载完成后调用 wx.stopPullDownRefresh()
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
    this.fetchData()
  },

  callPhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.num
    })
  },

  //滑动
  swiperChange(e) {
    if (e.detail.current == undefined) {
      this.setData({
        index: e.currentTarget.dataset.index
      })
    } else {
      this.setData({
        index: e.detail.current
      })
    }
  },
  //获取数据
  fetchData() {
    wx.request({
      url: util.url + '/notice/get_all_departure_by_id',
      data: {
        detail_id: this.data.detail_id,
        project_id: this.data.project_id,
        user_id: this.data.user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res1 => {
        if (res1.data.ret == 0) {
          let arr = res1.data.data
          wx.request({
            url: util.url + '/notice/get_large_unit_departure',
            data: {
              detail_id: this.data.detail_id,
              project_id: this.data.project_id,
              user_id: this.data.user_id
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: res => {
              if (res.data.ret == 0) {
                arr.unshift(res.data.data) 
                this.setData({
                  goList: arr
                })
              }
            }
          })
        }
      }
    })
  

    wx.request({
      url: util.url + '/notice/get_all_actor_dress',
      data: {
        detail_id: this.data.detail_id,
        project_id: this.data.project_id,
        user_id: this.data.user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        if (res.data.ret == 0) {
          this.setData({
            dressList: res.data.data
          })
        }
      }
    })

    wx.request({
      url: util.url + '/notice/get_all_contact', // 仅为示例，并非真实的接口地址
      data: {
        detail_id: this.data.detail_id,
        project_id: this.data.project_id,
        user_id: this.data.user_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        if (res.data.ret == 0) {
          var color = ['#33C58F', '#6C6FC0', '#F1921C', '#FE690D', '#39BEE8', '#F05050'];
          let randomArr = [];
          for (var j = 0; j < res.data.data.length; j++) {
            let random = color[Math.floor(Math.random() * color.length)]
            res.data.data[j].color = random
          }
          this.setData({
            contactList: res.data.data
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function () {
    wx.getStorage({
      key: 'user_id',
      success: id => {
        this.setData({
          user_id: id.data
        })
      }
    })
    wx.getStorage({
      key: 'project',
      success: id => {
        this.setData({
          project_id: id.data
        })
      }
    })
    wx.getStorage({
      key: 'detail_id',
      success: res => {
        this.setData({
          detail_id: res.data
        })
        this.fetchData()
      }
    })
  },
})
