// pages/wenji/wenji.js
const crypto = require('../../utils/crypto.js')

Page({
  data: {
    // 表单数据
    background: '',
    question: '',
    year: 1990,
    gender: 'male',
    
    // 年份列表
    yearList: [],
    yearIndex: 50, // 默认1990年 (1940 + 50 = 1990)
    
    // 隐私政策弹框控制
    showPrivacyModal: false,
    token: ''
  },

  onLoad() {
    this.initYearList()
    this.checkTokenAndShowModal()
  },
  
  onShow() {
    this.checkTokenAndShowModal()
    
    // 更新自定义 tabBar 状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  },
  
  /**
   * 检查token并显示弹框
   */
  checkTokenAndShowModal() {
    const token = wx.getStorageSync('token')
    console.log('[Wenji] 检查本地token:', token || '未设置')
    
    this.setData({ token: token || '' })
    
    if (!token) {
      console.log('[Wenji] token未设置，显示隐私政策弹框')
      this.setData({ showPrivacyModal: true })
    }
  },
  
  /**
   * 初始化年份列表 (1940-2099)
   */
  initYearList() {
    const yearList = []
    for (let i = 1940; i <= 2099; i++) {
      yearList.push(i + '年')
    }
    this.setData({ yearList })
  },
  
  /**
   * 背景输入
   */
  onBackgroundInput(e) {
    let value = e.detail.value
    // 移除特殊字符，只保留中英文、数字、常用标点
    value = value.replace(/[^\u4e00-\u9fa5a-zA-Z0-9，。、；：""''！（）\s]/g, '')
    this.setData({ background: value })
  },
  
  /**
   * 问题输入
   */
  onQuestionInput(e) {
    let value = e.detail.value
    // 只允许中英文、数字和问号
    value = value.replace(/[^\u4e00-\u9fa5a-zA-Z0-9？?]/g, '')
    this.setData({ question: value })
  },
  
  /**
   * 年份变化
   */
  onYearChange(e) {
    const yearIndex = parseInt(e.detail.value)
    const year = 1940 + yearIndex
    this.setData({
      yearIndex,
      year
    })
  },
  
  /**
   * 选择性别
   */
  selectGender(e) {
    const gender = e.currentTarget.dataset.gender
    this.setData({ gender })
  },
  
  /**
   * 打开隐私政策
   */
  openPrivacyPolicy() {
    wx.showModal({
      title: '光照吉途小程序隐私政策',
      content: '这里是隐私政策的详细内容...',
      showCancel: false,
      confirmText: '我知道了'
    })
  },
  
  /**
   * 打开服务协议
   */
  openServiceAgreement() {
    wx.showModal({
      title: '光照吉途小程序服务协议',
      content: '这里是服务协议的详细内容...',
      showCancel: false,
      confirmText: '我知道了'
    })
  },
  
  /**
   * 拒绝隐私政策
   */
  handleRejectPrivacy() {
    console.log('[Wenji] 用户拒绝隐私政策，关闭弹框')
    this.setData({ showPrivacyModal: false })
  },
  
  /**
   * 同意隐私政策
   */
  async handleAgreePrivacy() {
    console.log('[Wenji] ========== 用户同意隐私政策 ==========')
    
    try {
      wx.showLoading({
        title: '登录中...',
        mask: true
      })
      
      // 调用wx.login获取code
      console.log('[Wenji] 步骤1: 调用wx.login获取code')
      const loginRes = await this.wxLogin()
      const code = loginRes.code
      console.log('[Wenji] 获取到code:', code)
      
      // 调用后端登录接口
      console.log('[Wenji] 步骤2: 调用后端/api/bazi/login接口')
      const loginResult = await this.callLoginApi(code)
      console.log('[Wenji] 后端返回:', loginResult)
      
      if (loginResult.code === 200 && loginResult.data && loginResult.data.token) {
        const token = loginResult.data.token
        wx.setStorageSync('token', token)
        console.log('[Wenji] 步骤3: token已保存到本地:', token)
        
        this.setData({
          showPrivacyModal: false,
          token: token
        })
        
        wx.hideLoading()
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1500
        })
        
        console.log('[Wenji] ========== 登录流程完成 ==========')
      } else {
        throw new Error(loginResult.message || '登录失败')
      }
      
    } catch (error) {
      wx.hideLoading()
      console.error('[Wenji] 登录失败:', error)
      
      wx.showModal({
        title: '登录失败',
        content: error.message || '请稍后重试',
        showCancel: false
      })
    }
  },
  
  /**
   * 封装wx.login为Promise
   */
  wxLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: resolve,
        fail: reject
      })
    })
  },
  
  /**
   * 调用后端登录接口
   */
  callLoginApi(code) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://www.xwfxx.topapi/bazi/login',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: { code: code },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data)
          } else {
            reject(new Error('接口返回错误: ' + res.statusCode))
          }
        },
        fail: reject
      })
    })
  },
  
  /**
   * 提交表单
   */
  async handleSubmit() {
    console.log('[Wenji] ========== 点击提交按钮 ==========')
    
    // 检查token
    const token = wx.getStorageSync('token')
    if (!token) {
      console.log('[Wenji] token未设置，显示隐私政策弹框')
      this.setData({ showPrivacyModal: true })
      return
    }
    
    const { background, question, year, gender } = this.data
    
    // 验证必填项
    if (!background || background.trim().length === 0) {
      wx.showToast({
        title: '请输入背景描述',
        icon: 'none'
      })
      return
    }
    
    if (!question || question.trim().length === 0) {
      wx.showToast({
        title: '请输入咨询问题',
        icon: 'none'
      })
      return
    }
    
    console.log('[Wenji] 表单验证通过')
    console.log('[Wenji] 背景:', background)
    console.log('[Wenji] 问题:', question)
    console.log('[Wenji] 年份:', year)
    console.log('[Wenji] 性别:', gender)
    
    // 构造请求参数
    const requestData = {
      background: background.trim(),
      question: question.trim(),
      birthYear: year,
      gender: gender
    }
    
    // 生成时间戳和签名
    const timestamp = Date.now()
    const sign = crypto.generateSignature(requestData, timestamp)
    
    // 将参数存储到全局，供结果页使用
    getApp().globalData = getApp().globalData || {}
    getApp().globalData.wenjiRequestParams = {
      requestData,
      token,
      timestamp,
      sign
    }
    
    console.log('[Wenji] 跳转到结果页，参数已存储')
    
    // 立即跳转到结果页（让结果页显示等待动画并调用接口）
    wx.navigateTo({
      url: '/pages/wenji-result/wenji-result'
    })
  },
  
  /**
   * 调用问吉接口
   */
  callWenjiApi(data, token, timestamp, sign) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://www.xwfxx.top/api/bazi/wenji',
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'X-Timestamp': timestamp.toString(),
          'X-Sign': sign,
          'Authorization': 'Bearer ' + token
        },
        data: data,
        success: (res) => {
          console.log('[Wenji] 接口响应状态码:', res.statusCode)
          console.log('[Wenji] 接口响应数据:', res.data)
          if (res.statusCode === 200) {
            resolve(res.data)
          } else {
            reject(new Error('接口返回错误: ' + res.statusCode))
          }
        },
        fail: (err) => {
          console.error('[Wenji] 接口请求失败:', err)
          reject(err)
        }
      })
    })
  }
})
