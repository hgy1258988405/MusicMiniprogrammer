//index.js
const API = require('../../API/api');
const API_BASE_URL = 'http://musicapi.leanapp.cn';
const app = getApp();
const change = require('../../utils/util');
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
    programrecommend: [], //推荐节目
    recommend_create: [], //电台：创作|翻唱
    more_recommend_create:[],
    recommend_3D: [], //电台：3D|电子
    more_recommend_3D:[],
    recommend_feeling: [], //情感调频
    more_recommend_feeling:[],
    recommend_musicstory: [], //音乐故事
    more_recommend_musicstory:[],
    recommend_2D: [], //二次元
    more_recommend_2D:[],
    recommend_audiobook: [], //有声书
    more_recommend_audiobook:[],
    recommend_radioplay: [], //广播剧
    more_recommend_radioplay:[],
    recommend_reading: [], //美文读物
    more_recommend_reading:[],
    recommend_crosstalk: [], //相声曲艺
    more_recommend_crosstalk:[],
    recommend_history: [], //人文历史
    more_recommend_history:[],
    recommend_talkshow: [], //脱口秀
    more_recommend_talkshow:[],
    recommend_movies: [], //娱乐影视
    more_recommend_movies:[],
    recommend_foreignlanguage: [], //外语世界
    more_recommend_foreignlanguage:[],
    recommend_skills: [], //知识技能
    more_recommend_skills:[],
    recommend_baby: [], //亲子宝贝
    more_recommend_baby:[],
    recommend_education: [], //校园教育
    more_recommend_education:[],
    recommend_finance: [], //商业财经
    more_recommend_finance:[],
    recommend_science: [], //科技科学
    more_recommend_science:[],
    recommend_tourism: [], //路途|城市
    more_recommend_tourism:[],
    recommend_MV: [], //推荐MV
    newest: [], //最新专辑
  },
  onLoad: function() {
    let that = this;
    // 获取歌单
    this.getsongsheet();
    this.getNewSong();
    this.gettoplist0();
    this.gettoplist1();
    this.gettoplist2();
    this.gettoplist3();
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
  },
 // swiper的滑动
// 选择器 class="{{Changeline?'swiper_header_line_before':'swiper_header_line_after'}}" if current为1则什么什么，if 为2 ，则什么什么。
changeline:function(e){
  // console.log(e)
  // console.log(e.detail.current)
  let current = e.detail.current; //获取swiper的current值
  if(e.detail.current === 0){
    this.setData({
      slideOffset: quarter - 14
    })
  }
  if(e.detail.current === 1){
    this.setData({
      slideOffset: (quarter - 14) + half
    })
  }
  if(e.detail.current === null){
    this.setData({
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
  API.getsongsheet({
    order: 'hot'
  }).then(res => {
    // wx.hideLoading()
    // 成功回调
    // 全等于 数据类型一样
    if (res.code === 200) {
      this.setData({
        // songsheet: res.playlists,
        songsheet_index: res.playlists.slice(0, 6)
      })
    }
  })
},
// 获取最新音乐
getNewSong: function() {
  API.getNewSong({}).then(res => {
    if (res.code === 200) {
      this.setData({
        // newsong: res.result,
        newsong_index: res.result.slice(0, 6),
        
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
  
  const sheetId = event.currentTarget.dataset.id; //获取到event里面的歌曲id赋值给audioId
  wx.navigateTo({                                 //获取到id带着完整url后跳转到play页面
    url: `../../more/more_songsheet/moremore_songsheet?id=${sheetId}`,
  })
  
},
// 获取主页4个排行榜内容
gettoplist0:function(){
wx.request({
  url: API_BASE_URL + '/playlist/detail',
  data:{
    id:19723756
  },
success: res =>{
  console.log("歌单详情",res)
  this.setData({
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
    // console.log("歌单详情",res)
    this.setData({
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
   wx.navigateTo({
     url: `/more/toplist/toplist?id=${toplistid}`
   })
 },
 go_toplist1:function(){
  const toplistid =  3779629;
   wx.navigateTo({
     url: `/more/toplist/toplist?id=${toplistid}`
   })
 },
 go_toplist2:function(){
  const toplistid =  2884035;
   wx.navigateTo({
     url: `/more/toplist/toplist?id=${toplistid}`
   })
 },
 go_toplist3:function(){
  const toplistid =  3778678;
   wx.navigateTo({
     url: `/more/toplist/toplist?id=${toplistid}`
   })
 },

getRecommendMV: function() {
  API.getRecommendMV({}).then(res => {
    if (res.code === 200) {
      this.setData({
        recommend_MV: res.result.slice(0, 4)
      })
    }
  })
},
handlePlayAudio: function (event) { //event 对象，自带，点击事件后触发，event有type,target，timeStamp，currentTarget属性
  const audioId = event.currentTarget.dataset.id; //获取到event里面的歌曲id赋值给audioId
  app.globalData.audioId = audioId;
  // console.log(event)
  // console.log(app.globalData.audioId);
  wx.switchTab({                                 //获取到id带着完整url后跳转到play页面
      url: '/pages/play/play',
    })
  // console.log(event);
  // console.log(audioId);
},
})
