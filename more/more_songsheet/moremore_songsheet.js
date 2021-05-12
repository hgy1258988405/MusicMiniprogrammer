// 歌手下级路由歌曲列表
// const API_BASE_URL = 'https://musicapi.leanapp.cn';
// const API_BASE_URL = 'http://127.0.0.1:3000';
const API_BASE_URL = 'https://hgymusicapi.vercel.app';
const app = getApp();

Page({

  data: {
    songList: [],
    sheetsongid:[]
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    const sheetId = options.id;
    // console.log(options.id)
    wx.request({
      url: API_BASE_URL + '/playlist/detail?id=${id}',  //歌单地址
      data: {
        id: sheetId
      },
      success: res => {
        let that = this ;
        var waitForPlay = new Array;
        // console.log("歌单列表信息",res);
        that.setData({
          songsheettitle:res.data.playlist.name,
        })
        if(res.data.playlist.trackIds.length <= 30){
        for (let i = 0; i <= res.data.playlist.trackIds.length - 1; i++) { //获取歌单的所有歌曲信息
          wx.request({
            url:API_BASE_URL+ '/song/detail?id=${ids}',
            data:{
              ids:res.data.playlist.trackIds[i].id
            },
            success: res=>{
              let that = this;
              console.log(res)
              const obj = {...res.data.songs[0]}; //将获取到的歌曲信息数组转换成对象
              waitForPlay.push(obj) //将歌曲信息对象放进 waitforplay数组中
              // console.log(waitForPlay)
              app.globalData.songsheetwait = waitForPlay //传给全局数组
            that.setData({
              songList:waitForPlay
            })
          }
          })
        }
      }else {
        for (let i = 0; i <= 29; i++) { //获取歌单的所有歌曲信息
        wx.request({
          url:API_BASE_URL+ '/song/detail?id=${ids}',
          data:{
            ids:res.data.playlist.trackIds[i].id
          },
          success: res=>{
            let that = this;
            console.log(res)
            const obj = {...res.data.songs[0]}; //将获取到的歌曲信息数组转换成对象
            waitForPlay.push(obj) //将歌曲信息对象放进 waitforplay数组中
            // console.log(waitForPlay)
            app.globalData.songsheetwait = waitForPlay //传给全局数组
          that.setData({
            songList:waitForPlay
          })
        }
        })
      }

      }
        wx.hideLoading()
      }
    })
  },
 
  handlePlayAudio: function (event) { //event 对象，自带，点击事件后触发，event有type,target，timeStamp，currentTarget属性
    const audioId = event.currentTarget.dataset.id; //获取到event里面的歌曲id赋值给audioId
    app.globalData.waitForPlaying = app.globalData.songsheetwait   //将歌单列表传入等待
    app.globalData.audioId = audioId;
    wx.switchTab({                                 //获取到id带着完整url后跳转到play页面
        url: '/pages/play/play',
      })
    
  },
})