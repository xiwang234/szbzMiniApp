// pages/index/index.js
Page({
  data: {
    gender: 'male',
    year: 2014,
    month: 6,
    day: 15,
    time: '午时',
    timeLabel: '午时 (11:00-12:59)',
    
    yearList: [],
    monthList: [],
    dayList: [],
    timeList: [
      { value: '子时', label: '子时 (23:00-00:59)' },
      { value: '丑时', label: '丑时 (01:00-02:59)' },
      { value: '寅时', label: '寅时 (03:00-04:59)' },
      { value: '卯时', label: '卯时 (05:00-06:59)' },
      { value: '辰时', label: '辰时 (07:00-08:59)' },
      { value: '巳时', label: '巳时 (09:00-10:59)' },
      { value: '午时', label: '午时 (11:00-12:59)' },
      { value: '未时', label: '未时 (13:00-14:59)' },
      { value: '申时', label: '申时 (15:00-16:59)' },
      { value: '酉时', label: '酉时 (17:00-18:59)' },
      { value: '戌时', label: '戌时 (19:00-20:59)' },
      { value: '亥时', label: '亥时 (21:00-22:59)' }
    ],
    
    yearIndex: 64,
    monthIndex: 5,
    dayIndex: 14,
    timeIndex: 6,
    
    // 隐私政策弹框控制
    showPrivacyModal: false,
    // token状态
    token: ''
  },

  onLoad() {
    this.initYearList()
    this.initMonthList()
    this.initDayList()
    
    // 检查token，没有则显示隐私政策弹框
    this.checkTokenAndShowModal()
  },
  
  onShow() {
    // 每次显示页面时检查token
    this.checkTokenAndShowModal()
    
    // 更新自定义 tabBar 状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },
  
  /**
   * 检查token并显示弹框
   */
  checkTokenAndShowModal() {
    const token = wx.getStorageSync('token')
    console.log('[Index] 检查本地token:', token || '未设置')
    
    this.setData({ token: token || '' })
    
    // 如果没有token，显示隐私政策弹框
    if (!token) {
      console.log('[Index] token未设置，显示隐私政策弹框')
      this.setData({ showPrivacyModal: true })
    }
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
    console.log('[Index] 用户拒绝隐私政策，关闭弹框')
    this.setData({ showPrivacyModal: false })
  },
  
  /**
   * 同意隐私政策
   */
  async handleAgreePrivacy() {
    console.log('[Index] ========== 用户同意隐私政策 ==========')
    
    try {
      // 显示加载提示
      wx.showLoading({
        title: '登录中...',
        mask: true
      })
      
      // 步骤1: 调用wx.login获取code
      console.log('[Index] 步骤1: 调用wx.login获取code')
      const loginRes = await this.wxLogin()
      const code = loginRes.code
      console.log('[Index] 获取到code:', code)
      
      // 步骤2: 调用后端登录接口
      console.log('[Index] 步骤2: 调用后端/api/bazi/login接口')
      const loginResult = await this.callLoginApi(code)
      console.log('[Index] 后端返回:', loginResult)
      
      if (loginResult.code === 200 && loginResult.data && loginResult.data.token) {
        // 步骤3: 保存token到本地
        const token = loginResult.data.token
        wx.setStorageSync('token', token)
        console.log('[Index] 步骤3: token已保存到本地:', token)
        
        // 更新页面状态
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
        
        console.log('[Index] ========== 登录流程完成 ==========')
      } else {
        throw new Error(loginResult.message || '登录失败')
      }
      
    } catch (error) {
      wx.hideLoading()
      console.error('[Index] 登录失败:', error)
      
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

  // 初始化年份列表 (1950-2099)
  initYearList() {
    const yearList = []
    for (let i = 1950; i <= 2099; i++) {
      yearList.push(i + '年')
    }
    this.setData({ yearList })
  },

  // 初始化月份列表
  initMonthList() {
    const monthList = []
    for (let i = 1; i <= 12; i++) {
      monthList.push(i + '月')
    }
    this.setData({ monthList })
  },

  // 初始化日期列表 (根据月份动态变化)
  initDayList() {
    const dayList = []
    const year = this.data.year
    const month = this.data.month
    let maxDay = 31

    // 根据月份确定最大天数
    if (month === 2) {
      // 判断闰年
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        maxDay = 29
      } else {
        maxDay = 28
      }
    } else if ([4, 6, 9, 11].includes(month)) {
      maxDay = 30
    }

    for (let i = 1; i <= maxDay; i++) {
      dayList.push(i + '日')
    }

    // 如果当前选择的日期超过了最大天数，则重置为最大天数
    let day = this.data.day
    let dayIndex = this.data.dayIndex
    if (day > maxDay) {
      day = maxDay
      dayIndex = maxDay - 1
    }

    this.setData({ 
      dayList,
      day,
      dayIndex
    })
  },

  // 选择性别
  selectGender(e) {
    const gender = e.currentTarget.dataset.gender
    this.setData({ gender })
  },

  // 年份变化
  onYearChange(e) {
    const yearIndex = parseInt(e.detail.value)
    const year = 1950 + yearIndex
    this.setData({
      yearIndex,
      year
    }, () => {
      this.initDayList() // 重新计算日期列表
    })
  },

  // 月份变化
  onMonthChange(e) {
    const monthIndex = parseInt(e.detail.value)
    const month = monthIndex + 1
    this.setData({
      monthIndex,
      month
    }, () => {
      this.initDayList() // 重新计算日期列表
    })
  },

  // 日期变化
  onDayChange(e) {
    const dayIndex = parseInt(e.detail.value)
    const day = dayIndex + 1
    this.setData({
      dayIndex,
      day
    })
  },

  // 时辰变化
  onTimeChange(e) {
    const timeIndex = parseInt(e.detail.value)
    const selectedTime = this.data.timeList[timeIndex]
    this.setData({
      timeIndex,
      time: selectedTime.value,
      timeLabel: selectedTime.label
    })
  },


  /**
   * 提交表单 - 需要token才能提交
   */
  async handleSubmit() {
    console.log('[Index] ========== 点击提交按钮 ==========')
    
    // 检查是否有token
    const token = wx.getStorageSync('token')
    if (!token) {
      console.log('[Index] token未设置，显示隐私政策弹框')
      this.setData({ showPrivacyModal: true })
      return
    }
    
    console.log('[Index] token已验证:', token)
    
    const { gender, year, month, day, time } = this.data
    
    try {
      // 转换时辰为小时数
      const hour = this.convertTimeToHour(time)
      console.log('[Index] 时辰转换: ' + time + ' → ' + hour + '时')
      
      // 跳转到信息展示页，传递用户数据
      console.log('[Index] 准备跳转到info页面')
      console.log('[Index] 传递参数: gender=' + gender + 
                  ', year=' + year + ', month=' + month + ', day=' + day + ', hour=' + hour)
      
      wx.navigateTo({
        url: `/pages/info/info?gender=${gender}&year=${year}&month=${month}&day=${day}&hour=${hour}`,
        success: () => {
          console.log('[Index] 页面跳转成功')
        },
        fail: (error) => {
          console.error('[Index] 页面跳转失败:', error)
          wx.showToast({
            title: '跳转失败',
            icon: 'none'
          })
        }
      })
      
      console.log('[Index] ========== 提交流程完成 ==========')
      
    } catch (error) {
      console.error('[Index] 提交失败:', error)
      
      wx.showModal({
        title: '提示',
        content: '操作失败，请重试',
        showCancel: false
      })
    }
  },

  // 将时辰转换为小时数(取时辰区间的起始小时)
  convertTimeToHour(time) {
    const timeMap = {
      '子时': 23,
      '丑时': 1,
      '寅时': 3,
      '卯时': 5,
      '辰时': 7,
      '巳时': 9,
      '午时': 11,
      '未时': 13,
      '申时': 15,
      '酉时': 17,
      '戌时': 19,
      '亥时': 21
    }
    return timeMap[time] || 11
  }
})
