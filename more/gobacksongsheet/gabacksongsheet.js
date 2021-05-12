// 歌手下级路由歌曲列表
const API = require('../../API/api');
// const API_BASE_URL = 'https://musicapi.leanapp.cn';
// const API_BASE_URL = 'http://127.0.0.1:3000';
const API_BASE_URL = 'https://hgymusicapi.vercel.app';
const app = getApp();

Page({
  data: {
    songList: [],
    sheetsongid:[]
  },
  onLoad: function () {
    if (!app.globalData.waitForPlaying.length){   //判断有无歌单 
      API.getNewSong({}).then(res => {
        if (res.code === 200) {
          console.log("res",res)
        app.globalData.waitForPlaying = res.result;
        const waitForPlay = app.globalData.waitForPlaying;
        this.setData({
          songList:waitForPlay
        })
        }})
      }else{
    console.log(app.globalData.waitForPlaying)
    const waitForPlay = app.globalData.waitForPlaying;
    this.setData({
      songList:waitForPlay
    })
  }
  },
 
  handlePlayAudio: function (event) { //event 对象，自带，点击事件后触发，event有type,target，timeStamp，currentTarget属性
    const audioId = event.currentTarget.dataset.id; //获取到event里面的歌曲id赋值给audioId
    app.globalData.audioId = audioId;
    // console.log(app.globalData.audioId);
    wx.switchTab({                                 //获取到id带着完整url后跳转到play页面
        url: '/pages/play/play',
      })
    
  },
})