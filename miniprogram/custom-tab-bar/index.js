Component({
  data: {
    selected: 0
  },
  
  methods: {
    switchTab(e) {
      const index = e.currentTarget.dataset.index
      const path = e.currentTarget.dataset.path
      
      // 先更新状态
      this.setData({
        selected: index
      })
      
      // 再进行跳转
      wx.switchTab({
        url: path,
        success: () => {
          // 跳转成功后，确保状态正确
          this.setData({
            selected: index
          })
        }
      })
    }
  }
})
