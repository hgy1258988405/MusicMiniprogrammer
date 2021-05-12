
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
    // 将加载好的排行榜传入
     app.globalData.waitForPlaying = app.globalData.toplistwait.tracks;
     var waitForPlay = app.globalData.waitForPlaying;
     console.log(waitForPlay)
     this.setData({
       songsheettitle:app.globalData.toplistwait.name,
       songList:waitForPlay,
       })
      },
    // wx.showLoading({
    //   title: '加载中',
    // });
    // const sheetId = options.id;
    // console.log(options.id)
  //   wx.request({
  //     url: API_BASE_URL + '/playlist/detail?id=${id}',  //歌单地址
  //     method: "get",
  //     header: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     data: {
  //       id: sheetId
  //     },
  //     success: res => {
  //       let that = this;
  //       var waitForPlay = new Array;
  //       console.log("歌单列表信息",res.data.playlist);
  //       app.globalData.waitForPlaying = res.data.playlist.tracks
  //       waitForPlay = app.globalData.waitForPlaying
  //       console.log("top",waitForPlay)
  //       that.setData({
  //         songsheettitle:res.data.playlist.name,
  //         songList:waitForPlay,
  //       })
       
  //       wx.hideLoading()
  //       // console.log(res.data.playlist.trackIds);
  //       // console.log(res.data.playlist.tracks);
  //     }
  //   })
  // },
 
  handlePlayAudio: function (event) { //event 对象，自带，点击事件后触发，event有type,target，timeStamp，currentTarget属性
    const audioId = event.currentTarget.dataset.id; //获取到event里面的歌曲id赋值给audioId
    app.globalData.audioId = audioId;
    // console.log(app.globalData.audioId);
    wx.switchTab({                                 //获取到id带着完整url后跳转到play页面
        url: '/pages/play/play',
      })
    
  },
})