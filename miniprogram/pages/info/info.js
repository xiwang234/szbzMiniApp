// pages/info/info.js
const crypto = require('../../utils/crypto.js')

Page({
  data: {
    // 用户输入的信息
    userInfo: {
      gender: '',
      year: '',
      month: '',
      day: '',
      hour: ''
    },
    
    // 分析数据
    analysisData: null,
    
    // 选中的套餐
    selectedPlan: 'year',
    
    // 加载状态
    loading: true,
    error: ''
  },

  onLoad(options) {
    console.log('[Info] ========== 进入信息页 ==========')
    console.log('[Info] 接收到的参数:', options)
    
    // 接收首页传递的参数
    if (options) {
      const userInfo = {
        gender: options.gender || 'male',
        year: parseInt(options.year) || 2014,
        month: parseInt(options.month) || 6,
        day: parseInt(options.day) || 15,
        hour: parseInt(options.hour) || 11
      }
      
      this.setData({ userInfo })
      
      console.log('[Info] 用户信息已设置:', userInfo)
    }
    
    // 加载分析数据
    this.loadAnalysisData()
  },

  /**
   * 加载分析数据 - 调用后端API（在header中携带token）
   */
  loadAnalysisData() {
    this.setData({ loading: true, error: '' })
    
    const { gender, year, month, day, hour } = this.data.userInfo
    
    // 获取本地token
    const token = wx.getStorageSync('token')
    if (!token) {
      console.error('[Info] token未找到，无法调用接口')
      this.setData({
        error: '登录信息缺失，请返回首页重新登录',
        loading: false
      })
      return
    }
    
    console.log('[Info] ========== 开始调用后端接口 ==========')
    console.log('[Info] 使用token:', token)
    
    // 构造请求参数
    const requestData = {
      gender: gender,
      year: year,
      month: month,
      day: day,
      hour: hour
    }
    
    // 生成时间戳
    const timestamp = Date.now()
    
    // 生成签名
    const sign = crypto.generateSignature(requestData, timestamp)
    
    console.log('[Info] 请求参数:', requestData)
    console.log('[Info] 时间戳:', timestamp)
    console.log('[Info] 签名:', sign)
    
    // 调用后端接口
    wx.request({
      url: 'https://www.xwfxx.top/api/bazi/analyze',
      // url: 'https://cuspidal-voluptuous-walter.ngrok-free.dev/api/bazi/analyze',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'X-Timestamp': timestamp.toString(),
        'X-Sign': sign,
        'Authorization': 'Bearer ' + token  // ✅ 在header中携带token
      },
      data: requestData,
      success: (res) => {
        console.log('[Info] 接口返回:', res)
        
        if (res.statusCode === 200 && res.data.code === 200) {
          // 解析返回的数据
          const aiAnalysis = res.data.data.aiAnalysis
          const baziResult = res.data.data.baziResult
          
          console.log('[Info] 八字结果:', baziResult)
          console.log('[Info] AI分析:', aiAnalysis)
          
          // 格式化AI分析结果为展示文本
          const content = this.formatAnalysisContent(baziResult, aiAnalysis)
          
          this.setData({
            analysisData: { content },
            loading: false
          })
          
          console.log('[Info] 数据加载成功')
        } else {
          console.error('[Info] 接口返回错误:', res.data)
          this.setData({
            error: res.data.message || '分析失败，请重试',
            loading: false
          })
        }
      },
      fail: (err) => {
        console.error('[Info] 接口调用失败:', err)
        this.setData({
          error: '网络请求失败，请检查后端服务是否启动',
          loading: false
        })
      }
    })
    
    console.log('[Info] ========== 接口请求已发送 ==========')
  },
  
  /**
   * 格式化AI分析内容
   */
  formatAnalysisContent(baziResult, aiAnalysis) {
    const { gender, year, month, day, hour } = this.data.userInfo
    const genderText = gender === 'male' ? '男' : '女'
    
    let content = `【基本信息】\n`
    content += `性别：${genderText}\n`
    content += `出生时间：${year}年${month}月${day}日 ${hour}时\n\n`
  
    
    // 添加AI分析内容
    if (typeof aiAnalysis === 'string') {
      content += `【分析结果】\n${aiAnalysis}`
    } else if (typeof aiAnalysis === 'object') {
      // 如果是JSON对象，尝试解析结构化内容
      content += ``
      if (aiAnalysis.summary) {
        content += `${aiAnalysis.summary}\n\n`
      }
      if (aiAnalysis.details) {
        content += `${JSON.stringify(aiAnalysis.details, null, 2)}`
      }
    }
    
    return content
  },

  /**
   * 重新加载
   */
  retryLoad() {
    this.loadAnalysisData()
  },

  /**
   * 选择套餐
   */
  selectPlan(e) {
    const plan = e.currentTarget.dataset.plan
    this.setData({ selectedPlan: plan })
  },

  /**
   * 处理支付
   */
  handlePayment() {
    const planInfo = {
      year: { name: '一年套餐', price: 99 },
      'three-year': { name: '三年套餐', price: 199 }
    }
    
    const selected = planInfo[this.data.selectedPlan]
    
    // 显示确认对话框
    wx.showModal({
      title: '确认支付',
      content: `您选择了${selected.name}，金额：¥${selected.price}元`,
      confirmText: '确认支付',
      cancelText: '再看看',
      success: (res) => {
        if (res.confirm) {
          // 跳转到支付页面
          wx.navigateTo({
            url: `/pages/payment/payment?plan=${this.data.selectedPlan}&price=${selected.price}&name=${selected.name}`
          })
        }
      }
    })
  }
})
