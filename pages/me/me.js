// pages/me/me.js
const app = getApp();
// const API_BASE_URL = 'https://musicapi.leanapp.cn';
// const API_BASE_URL = 'http://127.0.0.1:3000';
const API_BASE_URL = 'https://hgymusicapi.vercel.app';
Page({
  /* 页面的初始数 */
  data: {

  },
  onLoad: function (options) {
    
  },

  onShow: function () {
    // 获取自定义tabbar状态
    if (typeof this.getTabBar === 'function' &&
    this.getTabBar()) {
    this.getTabBar().setData({
      selected: 2,
    })
    this.getmylovesong() //显示喜欢的歌
  }
  },
  login:function(){
    wx.getUserProfile({
      desc:"获取头像",
      success:res => { 
        console.log(res)
        
      this.setData({
        userinfo:res.userInfo,
        islogin:true,
  
      })
    },
    fail:res=>{
        wx.showModal({
          content: '服务器出了点小差*.*',
          cancelColor: '#DE655C',
          confirmColor: '#DE655C',
          showCancel: false,
          confirmText: '返回',
        })
      }
    })
  },
  // 获取显示我喜欢的歌
  getmylovesong:function(){
    var lovesongid = app.globalData.myloveid   //将全局喜欢歌曲的id数组传给lovesongid
    console.log(app.globalData.myloveid)
    if(lovesongid.length ){  //判断是否有喜欢的歌  有则把喜欢的歌的ID给lovesongid 用以获取歌曲信息
      var waitForPlay = new Array;
    for (let i = 0; i <= lovesongid.length - 1; i++) { //循环打印出其id
      wx.request({
        url:API_BASE_URL+ '/song/detail?id=${ids}',
        data:{
          ids:lovesongid[i]
        },
      success: res => {
        console.log('歌曲详情', res);
        waitForPlay.push(res.data.songs[0]) 
        app.globalData.mylovesong = waitForPlay  //传给全局喜欢歌单 再点击播放喜欢的歌时 将播放列表更新为喜欢的歌
        console.log(waitForPlay);
        this.setData({
          lovesongsheet:waitForPlay 
        })
      }
    })
  }
}else{    //没有歌
  const nolovesong = new Array;  
  const name = {name:"还没有喜欢的音乐哟~"};
  nolovesong.push(name)
  this.setData({
    lovesongsheet:nolovesong
  })

}
},
go_mylove:function(){  //管理我喜欢的音乐
  wx.navigateTo({
    url: '/pages/love/love',
  })
},

  handlePlayAudio: function (event) { //event 对象，自带，点击事件后触发，event有type,target，timeStamp，currentTarget属性
    const audioId = event.currentTarget.dataset.id; //获取到event里面的歌曲id赋值给audioId
    app.globalData.waitForPlaying = app.globalData.mylovesong 
    app.globalData.audioId = audioId;
    // console.log(event)
    wx.switchTab({                                 //获取到id带着完整url后跳转到play页面
        url: '/pages/play/play',
      })
  },
})