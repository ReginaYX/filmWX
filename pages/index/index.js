//index.js
//获取应用实例
var util= require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    video: util.url +'/files/notice_introduce_2.mp4',
    fullScreen:false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    weather: {},
    time: util.formatTime(new Date()),//当前日期
    noticeDate:'',//通告单日期
    dates: util.formatTime(new Date()),
    user_id:'',
    info: '',//通告单内容
    location:'无', //拍摄地
    locationInfo:'',//拍摄地信息
    notice_id:'',
    whatDay:'', //拍摄第几天
    detail_id: '',
    changeDate:false,
    show:false,
    crew_id:'',
    color: [],
    project_id:''
  },
  //事件处理函数

  // 页面数据加载完成后调用 wx.stopPullDownRefresh()
  onPullDownRefresh() {
    wx.stopPullDownRefresh()
    this.fetchData()
  },

  // 进入全屏
  openVideo(){
    this.setData({
      fullScreen: true
    })
    wx.createVideoContext('myvideo').requestFullScreen({ direction: 90 });
    console.log(wx.createVideoContext('myvideo'))
  },

  /**关闭视屏 */
  closeVideo() {
    //执行退出全屏方法
    var videoContext = wx.createVideoContext('myvideo', this);
    videoContext.exitFullScreen();
  },
  /**视屏进入、退出全屏 */
  fullScreen(e) {
    var isFull = e.detail.fullScreen;
    //视屏全屏时显示加载video，非全屏时，不显示加载video
    this.setData({
      fullScreen: isFull
    })
  },

  // 点击遮罩层，显示的遮罩层与面板又隐藏起来 收回日历
  closeShade: function () {
    this.setData({
      changeDate: false,
      shows: false,
    })
  },

  // 切换日期
  dateChange(e) {
    let d 
    if (e.currentTarget.dataset.type=='before'){
      d = this.data.dates - 86400
    }else{
      d = this.data.dates + 86400
    }
    if (this.data.info.end_date < d){
      return
    }
    wx.request({
      url: util.url + '/notice/get_detail_id', // 仅为示例，并非真实的接口地址
      data: {
        notice_id: this.data.notice_id,
        stamp: d
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        if (res.data.ret == 0) {
          this.setData({
            detail_id: res.data.data
          })
          wx.setStorage({
            key: "detail_id",
            data: res.data.data
          })
        }else{
          this.setData({
            detail_id: ''
          })
        }
        this.setData({
          noticeDate: util.dateLater(util.formatTime(d * 1000)),
          dates: d
        })
        this.fetchData()
      }
    })
  },

  goList(){
    wx.navigateTo({
      url: '/pages/list/list?notice_id=' + this.data.notice_id
    })
  },

  session(e){
    wx.navigateTo({
      url: '/pages/shooting/shooting?id=' + e.currentTarget.dataset.id + '&location=' + e.currentTarget.dataset.location
    })
  },
  
  fetchData(){
    if (this.data.detail_id!=''){
      wx.request({
        url: util.url + '/notice/summary_detail_info', //获取单日通告总信息
        data: {
          detail_id: this.data.detail_id
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          if (res.data.ret == 0) {
            if (res.data.data.weather) {
              if (res.data.data.weather.day.match('雨')) {
                res.data.data.weather.rainfall = true
                res.data.data.weather.img = '../../images/weatherRain.png'
                res.data.data.weather.bg = '../../images/weatherRainBg.png'
              } else if (res.data.data.weather.day.match('多云')) {
                res.data.data.weather.img = '../../images/weatherCloudy.png'
                res.data.data.weather.bg = '../../images/weatherCloudyBg.png'
              } else if (res.data.data.weather.day.match('雪')) {
                res.data.data.weather.img = '../../images/weatherSnow.png'
                res.data.data.weather.bg = '../../images/weatherSnowBg.png'
              } else if (res.data.data.weather.day.match('雷阵雨')) {
                res.data.data.weather.img = '../../images/weatherThunder.png'
                res.data.data.weather.bg = '../../images/weatherThunderBg.png'
              } else {
                res.data.data.weather.img = '../../images/weatherSun.png'
                res.data.data.weather.bg = '../../images/weatherSunBg.png'
              }
              res.data.data.weather.temperature = res.data.data.weather.temp_min + '-' + res.data.data.weather.temp_max
              this.setData({
                weather: res.data.data.weather
              })
            } else {
              let obj = { 'img': '../../images/weatherSun.png', 'bg': '../../images/weatherSunBg.png' }
              this.setData({
                weather: obj
              })
            }
            this.setData({
              whatDay: res.data.data.days,
              noticeDate: util.dateLater(util.formatTime(res.data.data.shoot_date * 1000)),
              dates: res.data.data.shoot_date
            })
          } else {
            let times = this.data.time + ' 00:00:00'
            let d = new Date(times)
            this.setData({
              dates: d.getTime() / 1000,
              noticeDate: util.dateLater(util.formatTime(d.getTime())),
            })
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
      // 获取通告单场景信息
      wx.request({
        url: util.url + '/notice/get_shoot_session_info', //获取单日通告拍摄地
        data: {
          detail_id: this.data.detail_id,
          project_id: this.data.project_id,
          user_id: this.data.user_id
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          if (res.data.ret == 0) {
            var color = ['#33C58F', '#6C6FC0', '#F1921C', '#FE690D', '#39BEE8', '#F05050'];
            let randomArr = [];
            for (var j = 0; j < res.data.data.length; j++) {
              for (var i = 0; i < res.data.data[j].play_session_list.length; i++) {
                let random = color[Math.floor(Math.random() * color.length)]
                res.data.data[j].play_session_list[i].color = random
              }
            }
            this.setData({
              locationInfo: res.data.data,
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
    }else{
      let obj = { 'img': '../../images/weatherSun.png', 'bg': '../../images/weatherSunBg.png' }
      if (this.data.info != null){
        let num = (this.data.dates - this.data.info.start_date) / 86400
        let dayInfo = this.data.info
        this.setData({
          weather: obj,
          whatDay: dayInfo.day,
          locationInfo: '',
          dates: dayInfo.end_date,
          noticeDate: util.dateLater(util.formatTime(dayInfo.end_date * 1000))
        })
      }else{
        let times = this.data.time + ' 00:00:00'
        let d = new Date(times)
        this.setData({
          weather: obj,
          whatDay: '',
          locationInfo: '',
          dates: '',
          noticeDate: util.dateLater(util.formatTime(d.getTime()))
        })
      }
    } 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    if (options.detail){
      wx.setStorage({
        key: "detail_id",
        data: options.detail
      })
      wx.setStorage({
        key: "project",
        data: options.project
      })
    }
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
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
    
    wx.getStorage({
      key: 'detail_id',
      success: res => {
        this.setData({
          detail_id: res.data
        })
        this.fetchData()
      },
      fail: data => {
        let times = this.data.time + ' 00:00:00'
        let d = new Date(times)
        wx.request({
          url: util.url + '/notice/get_detail_id', // 仅为示例，并非真实的接口地址
          data: {
            notice_id: this.data.notice_id,
            stamp: d.getTime() / 1000
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: res => {
            if (res.data.ret == 0) {
              this.setData({
                detail_id: res.data.data
              })
              wx.setStorage({
                key: "detail_id",
                data: res.data.data
              })
            }else{
              this.setData({
                detail_id: ''
              })
            }
            this.setData({
              dates: d.getTime() / 1000
            })
            this.fetchData()
          }
        })
      }
    })
  },

// 转发设置
  onShareAppMessage (option) {
    return {
      title: '《' + this.data.info.notice_name + '》的通告单',
      path: '/pages/index/index?detail=' + this.data.detail_id + '&project=' + this.data.project_id,
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    }
  },

  onShow() {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.setData({
      date: util.getDates(7, this.data.time)[0]
    });
    // 检测是否有user_id,没有跳回登录页
    wx.getStorage({
      key: 'user_id',
      success: id => {
        this.setData({
          user_id: id.data
        })
        wx.getStorage({
          key: 'project',
          success: res => {
            wx.request({
              url: util.url + '/project/info', // 仅为示例，并非真实的接口地址
              data: {
                project_id: res.data
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
                    project_id: res.data,
                    notice_id: data.data.data.notice_id
                  })
                  this.getDetail()
                }
              }
            })
          },
          fail: data => {
            wx.request({
              url: util.url + '/notice/get_project_list', // 仅为示例，并非真实的接口地址
              data: {
                user_id: this.data.user_id
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: res1 => {
                if (res1.data.ret == 0) {
                  if (this.data.notice_id == '') {
                    for (let i = 0; i < res1.data.data.length; i++) {
                      if (res1.data.data[i].start_date != undefined) {
                        wx.setStorage({
                          key: 'project',
                          data: res1.data.data[i].project_id
                        })
                        wx.request({
                          url: util.url + '/project/info', // 仅为示例，并非真实的接口地址
                          data: {
                            project_id: res1.data.data[i].project_id
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
                                project_id: res1.data.data[i].project_id,
                                notice_id: data.data.data.notice_id
                              })
                              this.getDetail()
                            }
                          }
                        })
                        break
                      }
                    }
                  }
                } else {
                  wx.showToast({
                    title: res1.data.msg,
                    icon: 'none',
                    duration: 2000
                  })
                }
              }
            })
          }
        })
      },
      fail: res => {
        wx.redirectTo({
          url: "/pages/login/login"
        })
      }
    })
  },
})
