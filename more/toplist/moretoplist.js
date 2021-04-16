const API = require('../../API/api');
const app = getApp();


Page({
  
  data: {
    songsheetID:[],
    
  },

 
  onLoad: function (options) {
    // wx.showLoading({
    //   title: '加载中',
    // });
    this.getTopList();
  },
  getTopList: function () {
  API.getTopList({}).then(res => {
    if (res.code === 200) {
      console.log(res)
      this.setData({
        toplists:res.list
      })
    }
  })
},
handleSheet:function(event){
  // console.log(event.currentTarget.dataset)
  const toplistid = event.currentTarget.dataset.id ;
  wx.navigateTo({
    url: `/more/toplist/toplist?id=${toplistid}`
  })
}
})
