const API = require('../../API/api');
const app = getApp();

Page({

  data: {
    newsong: [], //最新音乐全部
  },

 
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    this.getNewSong();
  },

  getNewSong: function () {
    API.getNewSong({}).then(res => {
      wx.hideLoading()
      if (res.code === 200) {
        app.globalData.waitForPlaying = res.result
        this.setData({
          newsong: res.result
        })
      }
      console.log(res);
    })
  },

  // 获取到歌曲ID
  handlePlayAudio: function (event) {
    const audioId = event.currentTarget.dataset.id; //获取到event里面的歌曲id赋值给audioId
    app.globalData.audioId = audioId;
    wx.switchTab({                                 //获取到id带着完整url后跳转到play页面
      url: '/pages/play/play',
    })
  }


})