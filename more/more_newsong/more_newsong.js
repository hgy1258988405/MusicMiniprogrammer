const API = require('../../API/api');
const app = getApp();

Page({

  data: {
    newsong: [], //最新音乐全部
  },

 
  onLoad: function (options) {
   
    this.getNewSong();
  },

  getNewSong: function () {
        this.setData({
          newsong: app.globalData.waitNewsong 
        })
     
      console.log(app.globalData.waitNewsong);
  
  },

  // 获取到歌曲ID
  handlePlayAudio: function (event) {
    const audioId = event.currentTarget.dataset.id; //获取到event里面的歌曲id赋值给audioId
    app.globalData.audioId = audioId;
    app.globalData.waitForPlaying = app.globalData.waitNewsong 
    wx.switchTab({                                 //获取到id带着完整url后跳转到play页面
      url: '/pages/play/play',
    })
  }


})