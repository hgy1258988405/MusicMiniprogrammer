// 歌手下级路由歌曲列表
const API_BASE_URL = 'https://musicapi.leanapp.cn';

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
        var waitForPlay = new Array;
        // console.log("歌单列表信息",res);
        for (let i = 0; i <= res.data.playlist.trackIds.length - 1; i++) { //循环打印出其id
          wx.request({
            url:API_BASE_URL+ '/song/detail?id=${ids}',
            data:{
              ids:res.data.playlist.trackIds[i].id
            },
            success: res=>{
              const obj = {...res.data.songs[0]}; //将获取到的歌曲信息数组转换成对象
              // console.log(obj)
              waitForPlay.push(obj) //将歌曲信息对象放进 waitforplay数组中
              app.globalData.waitForPlaying = waitForPlay //传给全局数组
              // console.log("wait",app.globalData.waitForPlaying)
             
            this.setData({
              songList:waitForPlay
            })
          }
          })
          
        }
        wx.hideLoading()
        // console.log(res.data.playlist.trackIds);
        // console.log(res.data.playlist.tracks);
      }
    })
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