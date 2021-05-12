// index.js
Component({
  data: {
    isShow_index:true,
    isShow_playing:false,
    isShow_me:false,
    selected: 0, //首页
    color: "#8D8D8D",
    // selectedColor: "#C62F2F",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/images/music.png",
      selectedIconPath: "/images/selected-music.png",
      // text: "乐库"
    }, {
      pagePath: "/pages/play/play",
      iconPath: "/images/playing.png",
      selectedIconPath: "/images/selected-playing.png",
      // text: "播放页面"
    }, {
      pagePath: "/pages/me/me",
      iconPath: "/images/me.png",
      selectedIconPath: "/images/selected-me.png",
      // text: "我的"
    }
  ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      console.log(url)
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }}
})