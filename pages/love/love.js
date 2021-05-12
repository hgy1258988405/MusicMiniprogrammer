// 歌手下级路由歌曲列表
const API = require('../../API/api');
// const API_BASE_URL = 'https://musicapi.leanapp.cn';
// const API_BASE_URL = 'http://127.0.0.1:3000';
const API_BASE_URL = 'https://hgymusicapi.vercel.app';
const app = getApp();

Page({
  data: {
    songList: [],
    sheetsongid: []
  },
  onLoad: function () {

  },
  onShow: function () {
    if (!app.globalData.myloveid.length) { //判断有无歌单  
      console.log("无")
      wx.showModal({ //无
        content: '还没有喜欢的音乐哟*.*',
        cancelColor: '#DE655C',
        confirmColor: '#DE655C',
        showCancel: false,
        confirmText: '去添加',
        complete() {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      })
    } else {
      const waitForPlay = app.globalData.mylovesong;
      this.setData({
        songList: waitForPlay
      })
    }
  },
  delete_lovesong: function (event) {
    wx.showModal({
      content: '确定要移除该音乐吗？',
      cancelColor: '#000000',
      confirmColor: '#000000',
      showCancel: true,
      cancelText: "取消",
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          const myloveid = app.globalData.myloveid; //把全局喜欢歌曲的id传入
          const delete_id = event.currentTarget.dataset.id; //删除的id
          const id_index = myloveid.indexOf(delete_id) //获取删除歌的索引
          app.globalData.myloveid.splice(id_index, 1) //删除指定歌曲ID
          // console.log(app.globalData.myloveid) 
          console.log(app.globalData.myloveid)
          app.globalData.myloveid = app.globalData.myloveid
          var lovesongid = app.globalData.myloveid //将全局喜欢数组传给lovesongid
          if (lovesongid !=0 ) { //判断是否还有喜欢的歌的id
            var waitForPlay = new Array;
            for (let i = 0; i <= lovesongid.length - 1; i++) { //循环打印出其id
              wx.request({
                url: API_BASE_URL + '/song/detail?id=${ids}',
                data: {
                  ids: lovesongid[i]
                },
                success: res => {
                  // console.log('歌曲详情', res);
                  waitForPlay.push(res.data.songs[0])
                  app.globalData.mylovesong = waitForPlay
                  console.log(waitForPlay);
                  // this.setData({
                  //   lovesongsheet: waitForPlay
                  // })
                  this.onShow()
                }
              })
            }
          }else{
            this.onShow()
          }
        }
      },
    })


  },
  handlePlayAudio: function (event) { //event 对象，自带，点击事件后触发，event有type,target，timeStamp，currentTarget属性
    const audioId = event.currentTarget.dataset.id; //获取到event里面的歌曲id赋值给audioId
    app.globalData.waitForPlaying = app.globalData.mylovesong
    app.globalData.audioId = audioId;
    // console.log(event)
    wx.switchTab({ //获取到id带着完整url后跳转到play页面
      url: '/pages/play/play',
    })
  },
})