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
    timeIndex: 6
  },

  onLoad() {
    this.initYearList()
    this.initMonthList()
    this.initDayList()
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

  // 提交表单
  handleSubmit() {
    const { gender, year, month, day, time } = this.data
    
    // 直接跳转到信息展示页，传递用户输入的数据
    wx.navigateTo({
      url: `/pages/info/info?gender=${gender}&year=${year}&month=${month}&day=${day}&time=${time}`
    })
  }
})
