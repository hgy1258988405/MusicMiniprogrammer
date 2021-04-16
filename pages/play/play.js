// play.js
// const API_BASE_URL = 'http://127.0.0.1:3000';
const API_BASE_URL = 'https://musicapi.leanapp.cn';
const API = require('../../API/api');
// 以 src 赋予 Audio 即可播放'
const app = getApp();

Page({

  data: {
    isPlay: '',
    song:[],
    innerAudioContext: {},
    show:true,
    showLyric:true,
    songid:[],
    history_songId:[]
  },
  // onLond,第一次进入则获取到index.js传来的歌曲id --> id传给wx.request的URL，获取到歌曲详情 --> 
  onLoad: function () { 
 
  },
  onShow: function () { 
    // 获取自定义tabbar状态
    if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }
    // console.log(app.globalData.audioId)
    
    if(this.data.song.id === app.globalData.audioId){   //判断是否是同一首歌
      // console.log(this.data.isPlay)
      if(this.data.isPlay){  //判断是否在播放
        const audioid = app.globalData.audioId; // onShow()后获取到歌曲视频之类的id
        this.play(audioid)
      }else{
        this.keepstata()
      }
    }else{
    const audioid = app.globalData.audioId; // onShow()后获取到歌曲视频之类的id
    // console.log(this.data)
     this.play(audioid); 
    }
   },
  play: function (audioid){
    const audioId = audioid;
    app.globalData.songId = audioId;  //让每一个要播放的歌曲ID给全局变量的songId
    const innerAudioContext = wx.createInnerAudioContext();
    this.setData({
      innerAudioContext,
      isPlay: true   
    })
    //获取到歌曲音频，则显示出歌曲的名字，歌手的信息，即获取歌曲详情；如果失败，则播放出错。
    wx.request({
      url: API_BASE_URL + '/song/detail?id=${ids}',
      data: {
        ids: audioId   //必选参数ids
      },
      success: res => {
        // console.log(res.data.data.songs)
        console.log('歌曲详情', res);
        if (res.data.songs.length === 0) {
          // console.log('无法获取到资源')
          wx.showModal({
            content: '请先点首歌吧*.*',
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
            song: res.data.songs[0],  //获取到歌曲的详细内容，传给song
          })
          // console.log(res)
          //去网易云官网获取歌曲URL
          res.data['url'] = 'http://music.163.com/song/media/outer/url?id='+res.data.songs[0].id+".mp3";
          // console.log(res)
          console.log("ID",res.data.url);
          this.createBgAudio(res);
        }
      },
    })
  },

  createBgAudio(res) {
    const bgAudioManage = wx.getBackgroundAudioManager(); //获取全局唯一的背景音频管理器。并把它给实例bgAudioManage
    app.globalData.bgAudioManage = bgAudioManage;         //把实例bgAudioManage(背景音频管理器) 给 全局
    bgAudioManage.title = res.data.songs[0].name;                        //把 音频标题title 给实例
    bgAudioManage.src = res.data.url;                        
      // res.url 在createBgAudio 为 mp3音频  url为空，播放出错
      console.log("bg",this.data)
    const history_songId = this.data.history_songId
    const historySong = {
      id: app.globalData.songId,
    }
    history_songId.push(historySong)
    bgAudioManage.onPlay(res => {                         // 监听背景音频播放事件
      this.setData({
        isPlay: true,
        history_songId
      })
    });
    
    bgAudioManage.onEnded(() => {                  //监听背景音乐自然结束事件，结束后自动播放下一首。自然结束，调用go_lastSong()函数，即歌曲结束自动播放下一首歌
      this.go_lastSong();

    })
    wx.setStorageSync('historyId', history_songId); //把historyId存入缓存
  },
  // 暂停时切换页面保持状态
keepstata(){
  if (app.globalData.audioId === undefined) {
    // console.log('无法获取到资源')
    wx.showModal({
      content: '请先点首歌吧*.*',
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
    isPlay:false,
  })}
},
// 播放和暂停
  handleToggleBGAudio() {
    // const innerAudioContext = app.globalData.innerAudioContext;
    const bgAudioManage = app.globalData.bgAudioManage;
    const {isPlay} = this.data;
    // console.log(this.data)
    // console.log("pl",isPlay)
    if (isPlay) {   
      bgAudioManage.pause();
    } else {
      bgAudioManage.play();
    }
    this.setData({
      isPlay: !isPlay 
    })
    // console.log(this.data.isPlay)
  },

  // 点击切换歌词和封面
  showLyric(){
    const {showLyric} = this.data;
    this.setData({
      showLyric: !showLyric
    })
  },

  go_index:function(){
    // console.log(1)
    // wx.reLaunch({
    //   url:'../pages/index/index'
    // })
    wx.navigateBack({
      delta: 1
    })
  },
// 上一首
  go_lastSong:function(){ 
    if (!app.globalData.waitForPlaying.length){   //判断有无歌单 为后继下一首做准备
      API.getsomesong({id:19723756}).then(res => {
        // wx.hideLoading()
        if (res.code === 200) {
          console.log("res",res)
        app.globalData.waitForPlaying = res.playlist.trackIds
        const lastSongId = app.globalData.waitForPlaying;
        const audioid = lastSongId[Math.floor(Math.random() * lastSongId.length)]; //随机选取lastSongId数组的一个元素
        app.globalData.audioId= audioid.id; //把歌曲信息传入全局 
        this.play(audioid.id)//传进play()方法中
      }
      })
    }else{
    const lastSongId = app.globalData.waitForPlaying;
    const  audioid = lastSongId[Math.floor(Math.random() * lastSongId.length)]; //随机选取lastSongId数组的一个元素
     app.globalData.audioId= audioid.id; //把歌曲信息传入全局 
     this.play( audioid.id)//传进play()方法中
    }
    // wx.getStorageSync({
    //   key: 'songid',
    //   success: function (res) {
    //     console.log(res.data)
    //   }
    // })
  }
  
})