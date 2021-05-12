// play.js
// const API_BASE_URL = 'http://127.0.0.1:3000';
// const API_BASE_URL = 'https://musicapi.leanapp.cn';
// const API_BASE_URL = 'https://hgy-cloud-music-api.vercel.app';
const API_BASE_URL = 'https://hgymusicapi.vercel.app';
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
    console.log(app.globalData.myloveid)
   console.log(app.globalData.audioId) 
    // 获取自定义tabbar状态
    if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }
      if(app.globalData.myloveid.includes(app.globalData.audioId)){   //判断是否已经喜欢
        // console.log(app.globalData.myloveid)
        // console.log(app.globalData.audioId)
        console.log("yeslove")
        let that = this ;
        that.setData({
          nolove:false
        })
      }else{
        console.log("nolove")
        let that = this ;
        that.setData({
          nolove:true
        })
      }
    // console.log(app.globalData.audioId)
    if(this.data.song.id === app.globalData.audioId){   //判断是否是同一首歌
      // console.log(this.data.isPlay)
      if(this.data.isPlay){  // 是同一首歌 再 判断是否在播放 
        this.play()
      }else{
        this.keepstata()
      }
    }else{   //不是
    // console.log(this.data)
     this.play(); 
    }
   },

  // 播放
  play: function (){
    const audioId = app.globalData.audioId;
    console.log(audioId)
    const innerAudioContext = wx.createInnerAudioContext();
    let that = this ;
    that.setData({
      innerAudioContext,
      isPlay: true,
      // nolove:true   
    })
    //获取到歌曲音频，则显示出歌曲的名字，歌手的信息，即获取歌曲详情；如果失败，则播放出错。
    wx.request({
      url: API_BASE_URL + '/song/detail?id=${ids}',
      data: {
        ids: audioId   //必选参数ids
      },
      success: res => {
        // console.log(res.data.songs)
        app.globalData.playingsong = res.data.songs
        console.log('歌曲详情', res);
        console.log('歌曲是否付费', res.data.privileges[0].fee);
        if (res.data.songs.length === 0) {   //判断是否点了歌
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
        }else if(res.data.privileges[0].fee === 1 || res.data.privileges[0].fee === 4){  //判断是否为付费
                let that = this ;
                const bgAudioManage = wx.getBackgroundAudioManager();
                that.setData({
                  song: res.data.songs[0],  //获取到歌曲的详细内容，传给song 
                  isPlay:false
                })
                wx.showModal({
                  content: '该音乐为付费音乐，暂不能播放，请切换音乐*.*',
                  cancelColor: '#DE655C',
                  confirmColor: '#DE655C',
                  showCancel: false,
                  confirmText: '返回',
                })
                  bgAudioManage.stop(); //停止播放
                          
          }else{   //播放
          let that = this ;
          that.setData({
            song: res.data.songs[0],  //获取到歌曲的详细内容，传给song
          })
          // console.log(res)
          //去网易云官网获取歌曲URL
          res.data['url'] = 'https://music.163.com/song/media/outer/url?id='+res.data.songs[0].id+".mp3";
          // console.log(res)
          console.log("ID",res.data.url);
          this.createBgAudio(res);
        }
        }
      }) 
},
// 创建背景音乐播放器
  createBgAudio(res) {
    const bgAudioManage = wx.getBackgroundAudioManager(); //获取全局唯一的背景音频管理器。并把它给实例bgAudioManage
    app.globalData.bgAudioManage = bgAudioManage;         //把实例bgAudioManage(背景音频管理器) 给 全局
    bgAudioManage.title = res.data.songs[0].name;                        //把 音频标题title 给实例
    bgAudioManage.src = res.data.url;                        
      // res.url 在createBgAudio 为 mp3音频  url为空，播放出错
      // console.log("背景音乐播放器",this.data)
    const history_songId = this.data.history_songId
    const historySong = {
      id: app.globalData.songId,
    }
    history_songId.push(historySong)
    bgAudioManage.onPlay(res => {                         // 监听背景音频播放事件
      let that = this ;
      that.setData({
        isPlay: true,
        history_songId
      })
    });
  // 音乐结束
    bgAudioManage.onEnded(() => {        //监听背景音乐自然结束事件，结束后自动播放下一首。自然结束，调用go_lastsong()函数，即歌曲结束自动播放下一首歌
      this.go_nextsong();
    })
    wx.setStorageSync('historyId', history_songId); //把historyId存入缓存
  },
  // 暂停时切换页面保持状态
keepstata(){
  if (app.globalData.audioId === undefined) {
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
    let that = this ;
  that.setData({
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
    let that = this ;
    that.setData({
      isPlay: !isPlay 
    })
    // console.log(this.data.isPlay)
  },

  // 返回上一级歌单按钮
  go_back:function(){
    // const sheetId = app.globalData.gobacksheetid; //获取到event里面的歌曲id赋值给audioId
    wx.navigateTo({                                 //获取到id带着完整url后跳转到play页面
      url: `../../more/gobacksongsheet/gabacksongsheet`,
    })
  },
  
// 上一首
go_lastsong:function(){
  if(app.globalData.waitForPlaying.length === 0 ){    //如果没有全局待播放列表
    wx.request({                        //获取热歌榜
      url: API_BASE_URL + '/playlist/detail',
      data:{
        id:3778678
      },
      success:res=>{
       app.globalData.waitForPlaying = res.data.playlist.tracks
       app.globalData.audioId = res.data.playlist.tracks[0].id
       this.onShow()//传进play()方法中
      }
    })
    }else{var lastsongId = new Array;
  for(let i=0;  i <= app.globalData.waitForPlaying.length-1; i++){
   lastsongId.push(app.globalData.waitForPlaying[i].id)   //将等待播放的歌曲ID全部放入新数组中
  }
  var playingsong_index = lastsongId.indexOf(app.globalData.audioId);   //获取正在播放的歌曲的索引
  let lastsong_index = playingsong_index - 1 ; //索引-1
console.log(lastsong_index)
  if(lastsong_index === -1 ){    //判断是否是歌单的第一首歌
    lastsong_index = app.globalData.waitForPlaying.length-1; 
  }else{
    lastsong_index = lastsong_index
  } 
  app.globalData.audioId = app.globalData.waitForPlaying[lastsong_index].id  //获取下一首的歌曲id 并传人全局
  this.onShow()//传进play()方法中
}
},
//下一首
  go_nextsong:function(){ 
    if(app.globalData.waitForPlaying.length === 0 ){    //如果没有全局待播放列表
      wx.request({                        //获取热歌榜
        url: API_BASE_URL + '/playlist/detail',
        data:{
          id:3778678
        },
        success:res=>{
         app.globalData.waitForPlaying = res.data.playlist.tracks
         app.globalData.audioId = res.data.playlist.tracks[0].id
         this.onShow()//传进play()方法中
        }
      })
    }else{
    var nextsongId = new Array;
    for(let i=0;  i <= app.globalData.waitForPlaying.length-1; i++){
      nextsongId.push(app.globalData.waitForPlaying[i].id)   //将等待播放的歌曲ID全部放入新数组中
    }
    var playingsong_index = nextsongId.indexOf(app.globalData.audioId);   //获取正在播放的歌曲的索引
    var nextsong_index = playingsong_index + 1 ; //索引+1
   console.log(nextsong_index)
    if(nextsong_index === app.globalData.waitForPlaying.length ){    //判断是否是歌单的最后一首歌
      nextsong_index = 0; 
    }else{
      nextsong_index = nextsong_index
    } 
    app.globalData.audioId = app.globalData.waitForPlaying[nextsong_index].id  //获取下一首的歌曲id 并传人全局
    this.onShow()//传进play()方法中
  }
  },
  // 取消喜欢
  cancellove:function(){
    app.globalData.myloveid.pop(app.globalData.audioId)
    console.log(app.globalData.myloveid)
    let that = this ;
    that.setData({
      nolove:true
    })
  },
  // 加入喜欢
  inlove:function(){
    // console.log(app.globalData.mylove)
    app.globalData.myloveid.push(app.globalData.audioId)
    console.log(app.globalData.myloveid)
    let that = this ;
    that.setData({
      nolove:false
    })
  },
  
})