//index.js
const API = require('../../API/api');
// const API_BASE_URL = 'https://musicapi.leanapp.cn';
// const API_BASE_URL = 'http://127.0.0.1:3000';
// const API_BASE_URL = 'https://hgy-cloud-music-api.vercel.app';
const API_BASE_URL = 'https://hgymusicapi.vercel.app';
const app = getApp();

let  half;
let quarter;
Page({
  
  data: {
    slideOffset: 0,
    indicatorDots: true,
    indicatorcolor: '#ffffff',
    indicatoractivecolor: '#DC4238',
    autoplay: true,
    interval: 4500,
    duration: 1700,
    circular: true,
    Changeline: true,
    songsheet_index: [], //首页歌单列表前6
    songsheet: [], //歌单全部
    newsong_index: [], //首页最新音乐前6
    newsong: [], //最新音乐全部
    toplist:[], //排行榜
    gobacksheetid:[],
    recommend_MV: [], //推荐MV
    
  },
  onLoad: function() {
    // console.log('envVersion',__wxConfig.envVersion);
    let that = this;
    // 获取歌单
    this.getsongsheet();
    this.getNewSong();
    this.gettoplist0();
    this.gettoplist1();
    this.gettoplist2();
    this.gettoplist3();
    this.getNewMV();
    this.gethotsinger()
    const myloveid = new Array;
    app.globalData.myloveid = myloveid; //定义一个全局“喜欢”数组
    // 设置滑块线的位置
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res.windowWidth)
        // console.log(res.windowWidth / 2 / 2)
        half = res.windowWidth / 2 ;
        quarter = res.windowWidth / 2 / 2;
        that.setData({
          slideOffset: quarter - 14 //onLoad的时候让 quarter - 14 给slideOffset，即一开始就让他在个性推荐的下面，否则onLoad的时候一开始在0的位置
        })
      }
    });
  },
  onShow:function(){
    // 获取自定义tabbar状态
    if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
      wx.request({
        url: API_BASE_URL ,

      })
  },
 // swiper的滑动
// 选择器 class="{{Changeline?'swiper_header_line_before':'swiper_header_line_after'}}" if current为1则什么什么，if 为2 ，则什么什么。
changeline:function(e){
  // console.log(e)
  // console.log(e.detail.current)
  let that = this ;
  let current = e.detail.current; //获取swiper的current值
  if(e.detail.current === 0){
    that.setData({
      slideOffset: quarter - 14
    })
  }
  if(e.detail.current === 1){
    that.setData({
      slideOffset: (quarter - 14) + half
    })
  }
  if(e.detail.current === null){
    that.setData({
      slideOffset: quarter - 14
    })
  }
},
// 点击跳转到搜索页面
go_search: function() {
  wx.navigateTo({
    url: '../search/search',
  });
},

// 获取热门歌单
getsongsheet: function() {
  let that = this ;
  API.getsongsheet({
    order: 'hot'
  }).then(res => {
    // wx.hideLoading()
    // 成功回调
    // 全等于 数据类型一样
    if (res.code === 200) {
      that.setData({
        // songsheet: res.playlists,
        songsheet_index: res.playlists.slice(0, 6)
      })
    }
  })
},
// 获取最新音乐
getNewSong: function() {
  let that = this ;
  API.getNewSongcn({type:7}).then(
    res => {
    if (res.code === 200) {
      console.log(res)
      // app.globalData.waitNewsong = res.result
      app.globalData.waitNewsong = res.data  //获取到的值传给全局 
      
      that.setData({
        // newsong: res.result,
        newsong_index: res.data.slice(0, 6),
        
      })
    }

  })
},
// 获取热门歌手
gethotsinger:function(){
  API.gethotsinger().then(res => {
    if (res.code === 200) {
      console.log("热门歌手",res)
      let that = this;
      that.setData({
        hotsinger_index: res.artists.slice(0, 6),
        
      })
    }
  })
},
// 获取主页MV
getNewMV: function() {
  let that = this ;
  API.getNewMv({}).then(res => {
    if (res.code === 200) {
      console.log(res)
      that.setData({
        recommend_MV: res.data
      })
    }
  })
},
// 去更多最新音乐
go_newsong:function(){
  wx.navigateTo({
    url: '../../more/more_newsong/more_newsong',
  })
},
// 去更多歌单
go_songsheet:function(){
  wx.navigateTo({
    url: '../../more/more_songsheet/more_songsheet',
  })
},
// 去歌单内容
handleSheet: function (event) { //event 对象，自带，点击事件后触发，event有type,target，timeStamp，currentTarget属性
  console.log(event)
  const sheetId = event.currentTarget.dataset.id; //获取到event里面的歌曲id赋值给audioId
  app.globalData.gobacksheetid = sheetId;
  wx.navigateTo({                                 //获取到id带着完整url后跳转到play页面
    url: `../../more/more_songsheet/moremore_songsheet?id=${sheetId}`,
  })
  
},
// 获取主页4个排行榜内容
gettoplist0:function(){
  // API.getsongsheetlist({id:19723756}).then(res => {
  //    console.log("歌单详情",res)
  //   if(res.code ===200){
  //     let that = this ;
  //     that.setData({
  //       toplist0:res.playlist,
  //       toplist0song:res.playlist.tracks
  //     })
  //   }
  // })
wx.request({
  url: API_BASE_URL + '/playlist/detail',
  data:{
    id:19723756
  },
success: res =>{
  let that = this ;
  console.log("歌单详情",res)
  app.globalData.toplistwait1 = res.data.playlist
  that.setData({
    toplist0:res.data.playlist,
    toplist0song:res.data.playlist.tracks
  })
  }
})
},
gettoplist1:function(){
  wx.request({
    url: API_BASE_URL + '/playlist/detail',
    data:{
      id:3779629
    },
  success: res =>{
    let that = this ;
    // console.log("歌单详情",res)
    app.globalData.toplistwait2 = res.data.playlist
    that.setData({
      toplist1:res.data.playlist,
      toplist1song:res.data.playlist.tracks
    })
    }
  })
},
gettoplist2:function(){
  wx.request({
    url: API_BASE_URL + '/playlist/detail',
    data:{
      id:2884035
    },
  success: res =>{
    app.globalData.toplistwait3 = res.data.playlist
    this.setData({
      toplist2:res.data.playlist,
      toplist2song:res.data.playlist.tracks
    })
    }
  })
},
gettoplist3:function(){
  wx.request({
    url: API_BASE_URL + '/playlist/detail',
    data:{
      id:3778678
    },
  success: res =>{
    app.globalData.toplistwait4 = res.data.playlist
    this.setData({
      toplist3:res.data.playlist,
      toplist3song:res.data.playlist.tracks
    })
    }
  })
},
// 去更多榜单
go_moretoplist: function () {
  wx.navigateTo({
    url: '../../more/toplist/moretoplist',
  })
 },
 // 去榜单详情
 go_toplist0:function(){
  const toplistid =  19723756;
  app.globalData.toplistwait = app.globalData.toplistwait1   //传入全局
   wx.navigateTo({
     url: `/more/toplist/toplist?id=${toplistid}`
   })
 },
 go_toplist1:function(){
  const toplistid =  3779629;
  app.globalData.toplistwait = app.globalData.toplistwait2
   wx.navigateTo({
     url: `/more/toplist/toplist?id=${toplistid}`
   })
 },
 go_toplist2:function(){
  const toplistid =  2884035;
  app.globalData.toplistwait = app.globalData.toplistwait3
   wx.navigateTo({
     url: `/more/toplist/toplist?id=${toplistid}`
   })
 },
 go_toplist3:function(){
  const toplistid =  3778678;
  app.globalData.toplistwait = app.globalData.toplistwait4 
   wx.navigateTo({
     url: `/more/toplist/toplist?id=${toplistid}`
   })
 },
//  去更多歌手
go_moresinger:function(){
  wx.navigateTo({
    url: `/more/more_singer/more_singer`
  })
},

handlePlayAudio: function (event) { //event 对象，自带，点击事件后触发，event有type,target，timeStamp，currentTarget属性
  const audioId = event.currentTarget.dataset.id; //获取到event里面的歌曲id赋值给audioId
  console.log(event)
  app.globalData.audioId = audioId;
  app.globalData.waitForPlaying = app.globalData.waitNewsong 
  // console.log(event)
  // console.log(app.globalData.audioId);
  wx.switchTab({                                 //获取到id带着完整url后跳转到play页面
      url: '/pages/play/play',
    })
  // console.log(event);
  // console.log(audioId);
},
// 点击播放MV
handlePlayMv:function(event){
  const mvId = event.currentTarget.dataset.id;
  wx.navigateTo({                                 //获取到id带着完整url后跳转到play_mv页面
    url: `/pages/play_mv/play_mv?id=${mvId}`
  })
},
handlesinger:function(event){
  const singerId = event.currentTarget.dataset.id;
  console.log(singerId)
  wx.navigateTo({                                 //获取到id带着完整url后跳转到singer页面
    url: `/pages/singer/singer?id=${singerId}`
  })
},
})
