// api.js
// const API_BASE_URL = 'http://127.0.0.1:3000';
// const API_BASE_URL = 'https://musicapi.leanapp.cn';
// const API_BASE_URL = 'https://hgy-cloud-music-api.vercel.app';
const API_BASE_URL = 'https://hgymusicapi.vercel.app';
const request = (url, data) => { 
  let _url = API_BASE_URL  + url;
  return new Promise((resolve, reject) => { 
    wx.request({
      url: _url,
      method: "get",
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(request) {
        resolve(request.data)
        
      },
      fail(error) {
        reject(error)
      }
    })
  });
}

module.exports ={
  gethotsongs:(data) =>{
    return request('/search/hot',data)//热搜接口
  },
  searchSuggest:(data)=>{
    return request('/search/suggest',data)//搜索建议接口
  },
  searchResult:(data)=>{
    return request('/search',data)//搜索结果接口
  },
  getsongsheet:(data)=>{
    return request('/top/playlist',data)//热门歌单接口
  },
  getNewSong:(data)=>{
    return request('/personalized/newsong',data)//最新音乐接口
  },
  getNewSongcn:(data)=>{
    return request('/top/song',data)//最新音乐接口
  },
  getsomesong:(data)=>{
    return request('/playlist/detail',data)//一些音乐接口
  },
  getsongsheetlist:(data)=>{    
    return request('/playlist/detail',data)
  },
  gethotsinger:(data)=>{            
    return request('/top/artists',data)  //热门歌手
  },
  getsingeritem:(data)=>{
    return request('/artists',data)  //歌手单曲
  },
  getNewMv:(data)=>{
    return request('/mv/first',data)//最新MV
  },
  getNewEst:(data)=>{
    return request('/album/newest',data)//最新专辑
  },
  getTopList:(data)=>{
    return request('/toplist',data)//所有排行榜
  },
  checkmusic:(data)=>{
    return request('/check/music',data)//检查是否有版权
  },
 
  getSonger:(data)=>{
    return request('/toplist/artist',data)//歌手排行
  }
}