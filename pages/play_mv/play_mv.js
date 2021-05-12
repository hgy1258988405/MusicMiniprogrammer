// play_mv.js
// const API_BASE_URL = 'https://musicapi.leanapp.cn';
// const API_BASE_URL = 'http://127.0.0.1:3000';
const API_BASE_URL = 'https://hgymusicapi.vercel.app';
const app = getApp();
Page({
  data: {
    mv: [],
    autoplay: false,
    loop: false,
    showfullscreenbtn: true,
    showcenterplaybtn: true,
    enableprogressgesture: true,
    showmutebtn: true,
    objectfit: 'contain',
  },
  onLoad: function (options) {
    const bgAudioManage = wx.getBackgroundAudioManager();
    bgAudioManage.stop()  //停止播放音乐
    const mvid = options.id; // onLoad()后获取到歌曲视频之类的id
    wx.request({
      url: API_BASE_URL + '/mv/detail',
      data: {
        mvid: mvid    
      },
      success: res => {
        console.log(res.data.data.brs['480'])
        console.log('MVurl:', res)
        if (res.data.data.brs === null) {  
          wx.showModal({
            content: '服务器开了点小差~~',
            cancelColor: '#DE655C',
            confirmColor: '#DE655C',
            showCancel: false,
            confirmText: '返回',
            complete() {
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          })
        } else {
        
          this.setData({
            mv: res.data.data
          })
        }
      }
    })
  },
})