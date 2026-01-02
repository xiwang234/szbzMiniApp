// pages/wenji/wenji.js
const crypto = require('../../utils/crypto.js')
const validator = require('../../utils/validator.js')

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
    console.log('[Wenji] ========== 页面加载 onLoad ==========')
    this.initYearList()
    this.checkTokenAndShowModal()
    
    console.log('[Wenji] 数据初始化完成，当前data:', {
      background: this.data.background,
      question: this.data.question,
      year: this.data.year,
      gender: this.data.gender,
      yearListLength: this.data.yearList.length,
      showPrivacyModal: this.data.showPrivacyModal
    })
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
   * 背景输入 - 仅实时过滤字符
   */
  onBackgroundInput(e) {
    let value = e.detail.value
    console.log('[Wenji] 背景输入原始值:', value)
    
    // 只进行字符类型过滤，不替换敏感词
    const filtered = validator.filterInput(value, 'background')
    console.log('[Wenji] 背景输入过滤后:', filtered)
    
    this.setData({ background: filtered })
  },
  
  /**
   * 背景输入失去焦点 - 替换敏感词
   */
  onBackgroundBlur(e) {
    let value = e.detail.value
    console.log('[Wenji] 背景输入失去焦点，原始值:', value)
    
    // 检测并替换敏感词
    const replacement = validator.replaceSensitiveWords(value)
    if (replacement.replaced) {
      console.log('[Wenji] 检测到敏感词，已替换为星号')
      this.setData({ background: replacement.text })
    }
  },
  
  /**
   * 问题输入 - 仅实时过滤字符
   */
  onQuestionInput(e) {
    let value = e.detail.value
    console.log('[Wenji] 问题输入原始值:', value)
    
    // 只进行字符类型过滤，不替换敏感词
    const filtered = validator.filterInput(value, 'question')
    console.log('[Wenji] 问题输入过滤后:', filtered)
    
    this.setData({ question: filtered })
  },
  
  /**
   * 问题输入失去焦点 - 替换敏感词
   */
  onQuestionBlur(e) {
    let value = e.detail.value
    console.log('[Wenji] 问题输入失去焦点，原始值:', value)
    
    // 检测并替换敏感词
    const replacement = validator.replaceSensitiveWords(value)
    if (replacement.replaced) {
      console.log('[Wenji] 检测到敏感词，已替换为星号')
      this.setData({ question: replacement.text })
    }
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
    wx.navigateTo({
      url: '/pages/agreement/privacy'
    })
  },
  
  /**
   * 打开服务协议
   */
  openServiceAgreement() {
    wx.navigateTo({
      url: '/pages/agreement/service'
    })
  },
  
  /**
   * 阻止触摸穿透
   */
  preventTouchMove() {
    return false
  },
  
  /**
   * 拒绝隐私政策
   */
  handleRejectPrivacy() {
    console.log('[Wenji] 用户拒绝隐私政策，退出小程序')
    wx.showModal({
      title: '提示',
      content: '拒绝隐私政策将无法使用本小程序',
      confirmText: '退出',
      cancelText: '重新考虑',
      success: (res) => {
        if (res.confirm) {
          // 用户确认退出
          wx.navigateBack({
            fail: () => {
              // 如果无法返回，提示用户手动关闭
              wx.showToast({
                title: '请手动关闭小程序',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
        // 如果取消，弹框继续显示，不做任何操作
      }
    })
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
        url: 'https://www.xwfxx.top/api/bazi/login',
        // url: 'https://cuspidal-voluptuous-walter.ngrok-free.dev/api/bazi/login',
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
    
    // ========== 第一步：基本验证 ==========
    if (!background || background.trim().length === 0) {
      wx.showToast({
        title: '请输入背景描述',
        icon: 'none',
        duration: 2000
      })
      return
    }
    
    if (!question || question.trim().length === 0) {
      wx.showToast({
        title: '请输入咨询问题',
        icon: 'none',
        duration: 2000
      })
      return
    }
    
    // ========== 第二步：内容安全验证（敏感词自动替换） ==========
    console.log('[Wenji] 开始内容安全验证')
    
    // 验证背景描述
    const backgroundValidation = validator.validateInput(background, 'background')
    if (!backgroundValidation.isValid) {
      console.warn('[Wenji] 背景描述验证失败:', backgroundValidation.message)
      wx.showModal({
        title: '内容不合规',
        content: `背景描述${backgroundValidation.message}，请修改后重试`,
        showCancel: false,
        confirmText: '我知道了'
      })
      return
    }
    
    // 验证咨询问题
    const questionValidation = validator.validateInput(question, 'question')
    if (!questionValidation.isValid) {
      console.warn('[Wenji] 咨询问题验证失败:', questionValidation.message)
      wx.showModal({
        title: '内容不合规',
        content: `咨询问题${questionValidation.message}，请修改后重试`,
        showCancel: false,
        confirmText: '我知道了'
      })
      return
    }
    
    // ========== 第三步：提示用户敏感词已被替换（如果有） ==========
    if (backgroundValidation.replaced || questionValidation.replaced) {
      console.log('[Wenji] 检测到敏感词，已自动替换为星号')
      wx.showToast({
        title: '已自动过滤敏感词',
        icon: 'none',
        duration: 2000
      })
      // 等待提示显示后再继续
      await new Promise(resolve => setTimeout(resolve, 1500))
    }
    
    console.log('[Wenji] 内容安全验证通过')
    console.log('[Wenji] 背景描述:', backgroundValidation.sanitized)
    console.log('[Wenji] 咨询问题:', questionValidation.sanitized)
    console.log('[Wenji] 年份:', year)
    console.log('[Wenji] 性别:', gender)
    
    // ========== 第三步：构造请求参数（使用清理后的内容） ==========
    const requestData = {
      background: backgroundValidation.sanitized.trim(),
      question: questionValidation.sanitized.trim(),
      birthYear: year,
      gender: gender
    }
    
    console.log('[Wenji] 最终请求数据:', requestData)
    
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
        // url: 'https://cuspidal-voluptuous-walter.ngrok-free.dev/api/bazi/wenji',
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
