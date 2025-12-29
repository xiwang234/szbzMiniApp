// pages/wenji-result/wenji-result.js
Page({
  data: {
    resultData: null,
    loading: false,
    error: ''
  },

  onLoad(options) {
    console.log('[WenjiResult] ========== 进入结果页 ==========')
    console.log('[WenjiResult] 接收参数:', options)
    
    if (options.data) {
      try {
        const data = JSON.parse(decodeURIComponent(options.data))
        console.log('[WenjiResult] 解析数据成功:', data)
        
        this.setData({
          resultData: data,
          loading: false
        })
      } catch (error) {
        console.error('[WenjiResult] 数据解析失败:', error)
        this.setData({
          error: '数据加载失败',
          loading: false
        })
      }
    } else {
      this.setData({
        error: '未找到结果数据',
        loading: false
      })
    }
  },

  /**
   * 重新加载
   */
  retryLoad() {
    wx.navigateBack()
  },

  /**
   * 返回
   */
  goBack() {
    wx.navigateBack()
  }
})
