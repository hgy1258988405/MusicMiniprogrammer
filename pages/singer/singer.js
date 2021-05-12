const API = require('../../API/api');
const app = getApp();

Page({
  data: {
    songsheet: [], //歌单全部
    singerId:[] ,//歌手id
  },
  onLoad: function (options) {
    // console.log(options)
    app.globalData.singerId = options.id
    wx.showLoading({
      title: '加载中',
    });
    this.getsingeritem();
  },
  getsingeritem: function () {
   const singerId =  app.globalData.singerId
  //  console.log(singerId)
    API.getsingeritem({id:singerId}).then(res => {
      wx.hideLoading()
      if (res.code === 200) {
        // console.log(res)
        app.globalData.singeritem = res.hotSongs  //将获取到的歌手歌曲传给全局
        console.log("歌手",res.hotSongs)
        this.setData({
          songList: res.hotSongs,
          singername:res.artist.name
        })
      }
    })
  },
  handlePlayAudio: function (event) { //event 对象，自带，点击事件后触发，event有type,target，timeStamp，currentTarget属性
    const audioId = event.currentTarget.dataset.id; //获取到event里面的歌曲id赋值给audioId
    app.globalData.audioId = audioId;
    app.globalData.waitForPlaying =  app.globalData.singeritem //点击播放歌手单曲时，将其所以歌传人候补列表 方便下一首
    // console.log(app.globalData.audioId);
    wx.switchTab({                                 //获取到id带着完整url后跳转到play页面
        url: '/pages/play/play',
      })
    
  },

})