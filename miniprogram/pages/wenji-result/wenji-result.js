// pages/wenji-result/wenji-result.js
Page({
  data: {
    resultData: null,
    loading: true,
    currentTipIndex: 0,
    loadingTips: [
      '与智者对话中...',
      '皇上，奴才马上就到位...',
      '别急别急，正在赶来的路上...',
      '让我想想，嗯...快了快了...',
      '稍等片刻，马上为您揭晓...',
      '正在努力加载中，请稍候...',
      '您先喝口茶，我这就来...',
      '系统正在拼命思考中...',
      '好戏即将上演，请稍安勿躁...',
      '答案正在赶来，请您稍等...'
    ]
  },
  
  // 定时器引用
  tipTimer: null,

  onLoad(options) {
    console.log('[WenjiResult] ========== 进入结果页 ==========')
    console.log('[WenjiResult] 接收参数:', options)
    
    // 开启等待提示轮换
    this.startTipRotation()
    
    // 检查是否有旧方式传递的数据（兼容）
    if (options.data) {
      try {
        const data = JSON.parse(decodeURIComponent(options.data))
        console.log('[WenjiResult] 解析数据成功（旧方式）:', data)
        
        // 停止轮换，显示结果
        this.stopTipRotation()
        this.setData({
          resultData: data,
          loading: false
        })
        return
      } catch (error) {
        console.error('[WenjiResult] 数据解析失败:', error)
      }
    }
    
    // 新方式：从全局数据获取参数并调用接口
    const app = getApp()
    const params = app.globalData?.wenjiRequestParams
    
    if (params) {
      console.log('[WenjiResult] 从全局数据获取参数，开始调用接口')
      this.callWenjiApi(params)
    } else {
      this.stopTipRotation()
      wx.showModal({
        title: '提示',
        content: '未找到请求参数',
        showCancel: false,
        success: () => {
          wx.navigateBack()
        }
      })
    }
  },
  
  onUnload() {
    // 页面卸载时清除定时器
    this.stopTipRotation()
  },
  
  /**
   * 调用问吉接口
   */
  async callWenjiApi(params) {
    const { requestData, token, timestamp, sign } = params
    
    try {
      console.log('[WenjiResult] 开始调用接口')
      console.log('[WenjiResult] 请求参数:', requestData)
      
      const result = await new Promise((resolve, reject) => {
        wx.request({
          url: 'https://cuspidal-voluptuous-walter.ngrok-free.dev/api/bazi/wenji',
          method: 'POST',
          header: {
            'content-type': 'application/json',
            'X-Timestamp': timestamp.toString(),
            'X-Sign': sign,
            'Authorization': 'Bearer ' + token
          },
          data: requestData,
          success: (res) => {
            console.log('[WenjiResult] 接口响应状态码:', res.statusCode)
            console.log('[WenjiResult] 接口响应数据:', res.data)
            if (res.statusCode === 200) {
              resolve(res.data)
            } else {
              reject(new Error('接口返回错误: ' + res.statusCode))
            }
          },
          fail: (err) => {
            console.error('[WenjiResult] 接口请求失败:', err)
            reject(err)
          }
        })
      })
      
      if (result.code === 200) {
        console.log('[WenjiResult] 接口调用成功')
        console.log('[WenjiResult] 返回数据:', result.data)
        
        // 停止轮换，显示结果
        this.stopTipRotation()
        this.setData({
          resultData: result.data,
          loading: false
        })
      } else {
        this.stopTipRotation()
        wx.showModal({
          title: '提示',
          content: result.message || '分析失败，请重试',
          showCancel: false,
          success: () => {
            wx.navigateBack()
          }
        })
      }
    } catch (error) {
      console.error('[WenjiResult] 接口调用失败:', error)
      this.stopTipRotation()
      wx.showModal({
        title: '提示',
        content: '网络请求失败，请检查网络连接',
        showCancel: false,
        success: () => {
          wx.navigateBack()
        }
      })
    }
  },
  
  /**
   * 开始轮换等待提示
   */
  startTipRotation() {
    // 随机选择一个初始提示
    const randomIndex = Math.floor(Math.random() * this.data.loadingTips.length)
    this.setData({
      currentTipIndex: randomIndex
    })
    
    // 每3秒切换一次提示
    this.tipTimer = setInterval(() => {
      let newIndex
      
      // 避免连续两次显示同一条提示
      do {
        newIndex = Math.floor(Math.random() * this.data.loadingTips.length)
      } while (newIndex === this.data.currentTipIndex)
      
      this.setData({
        currentTipIndex: newIndex
      })
      
      console.log('[WenjiResult] 切换提示:', this.data.loadingTips[newIndex])
    }, 3000)
  },
  
  /**
   * 停止轮换等待提示
   */
  stopTipRotation() {
    if (this.tipTimer) {
      clearInterval(this.tipTimer)
      this.tipTimer = null
    }
  },

  /**
   * 返回
   */
  goBack() {
    wx.navigateBack()
  }
})
