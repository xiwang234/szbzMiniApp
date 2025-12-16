<template>
  <view class="page-container">
    <!-- 表单卡片 -->
    <view class="form-card">
      <!-- 性别选择 -->
      <view class="form-item gender-section">
        <view class="form-label">
          <text class="fa-solid fa-venus-mars label-icon"></text>
          <text>性别</text>
        </view>
        <view class="gender-tabs">
          <view 
            :class="['gender-tab', 'male', { active: formData.gender === 'male' }]"
            @tap="selectGender('male')"
          >
            <text class="fa-solid fa-mars tab-icon"></text>
            <text>男</text>
          </view>
          <view 
            :class="['gender-tab', 'female', { active: formData.gender === 'female' }]"
            @tap="selectGender('female')"
          >
            <text class="fa-solid fa-venus tab-icon"></text>
            <text>女</text>
          </view>
        </view>
      </view>

      <!-- 出生年份 -->
      <view class="form-item">
        <view class="form-label">
          <text class="fa-solid fa-calendar-days label-icon"></text>
          <text>出生年份</text>
        </view>
        <view class="picker-wrapper" @tap="showYearPicker">
          <text class="picker-value">{{ formData.year }}年</text>
          <text class="fa-solid fa-chevron-down picker-arrow"></text>
        </view>
      </view>

      <!-- 出生月份 -->
      <view class="form-item">
        <view class="form-label">
          <text class="fa-regular fa-calendar label-icon"></text>
          <text>出生月份</text>
        </view>
        <view class="picker-wrapper" @tap="showMonthPicker">
          <text class="picker-value">{{ formData.month }}月</text>
          <text class="fa-solid fa-chevron-down picker-arrow"></text>
        </view>
      </view>

      <!-- 出生日期 -->
      <view class="form-item">
        <view class="form-label">
          <text class="fa-regular fa-calendar-check label-icon"></text>
          <text>出生日期</text>
        </view>
        <view class="picker-wrapper" @tap="showDayPicker">
          <text class="picker-value">{{ formData.day }}日</text>
          <text class="fa-solid fa-chevron-down picker-arrow"></text>
        </view>
      </view>

      <!-- 出生时辰 -->
      <view class="form-item">
        <view class="form-label">
          <text class="fa-regular fa-clock label-icon"></text>
          <text>出生时辰</text>
        </view>
        <view class="picker-wrapper" @tap="showTimePicker">
          <text class="picker-value">{{ formData.timeLabel }}</text>
          <text class="fa-solid fa-chevron-down picker-arrow"></text>
        </view>
      </view>

      <!-- 提交按钮 -->
      <button class="submit-btn btn-primary" @tap="handleSubmit">
        照见本心
      </button>
    </view>

    <!-- 年份选择器 -->
    <picker 
      v-if="showPicker.year"
      :value="yearIndex" 
      :range="yearList" 
      @change="onYearChange"
      @cancel="showPicker.year = false"
    >
      <view></view>
    </picker>

    <!-- 月份选择器 -->
    <picker 
      v-if="showPicker.month"
      :value="monthIndex" 
      :range="monthList" 
      @change="onMonthChange"
      @cancel="showPicker.month = false"
    >
      <view></view>
    </picker>

    <!-- 日期选择器 -->
    <picker 
      v-if="showPicker.day"
      :value="dayIndex" 
      :range="dayList" 
      @change="onDayChange"
      @cancel="showPicker.day = false"
    >
      <view></view>
    </picker>

    <!-- 时辰选择器 -->
    <picker 
      v-if="showPicker.time"
      :value="timeIndex" 
      :range="timeList" 
      range-key="label"
      @change="onTimeChange"
      @cancel="showPicker.time = false"
    >
      <view></view>
    </picker>
  </view>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        gender: 'male',
        year: 2014,
        month: 6,
        day: 15,
        time: '午时',
        timeLabel: '午时 (11:00-12:59)'
      },
      showPicker: {
        year: false,
        month: false,
        day: false,
        time: false
      },
      yearList: [],
      monthList: [],
      dayList: [],
      timeList: [
        { value: '子时', label: '子时 (23:00-00:59)', range: '23:00-00:59' },
        { value: '丑时', label: '丑时 (01:00-02:59)', range: '01:00-02:59' },
        { value: '寅时', label: '寅时 (03:00-04:59)', range: '03:00-04:59' },
        { value: '卯时', label: '卯时 (05:00-06:59)', range: '05:00-06:59' },
        { value: '辰时', label: '辰时 (07:00-08:59)', range: '07:00-08:59' },
        { value: '巳时', label: '巳时 (09:00-10:59)', range: '09:00-10:59' },
        { value: '午时', label: '午时 (11:00-12:59)', range: '11:00-12:59' },
        { value: '未时', label: '未时 (13:00-14:59)', range: '13:00-14:59' },
        { value: '申时', label: '申时 (15:00-16:59)', range: '15:00-16:59' },
        { value: '酉时', label: '酉时 (17:00-18:59)', range: '17:00-18:59' },
        { value: '戌时', label: '戌时 (19:00-20:59)', range: '19:00-20:59' },
        { value: '亥时', label: '亥时 (21:00-22:59)', range: '21:00-22:59' }
      ],
      yearIndex: 64,
      monthIndex: 5,
      dayIndex: 14,
      timeIndex: 6
    }
  },
  onLoad() {
    this.initYearList()
    this.initMonthList()
    this.initDayList()
  },
  methods: {
    // 初始化年份列表 (1950-2099)
    initYearList() {
      for (let i = 1950; i <= 2099; i++) {
        this.yearList.push(i + '年')
      }
    },
    
    // 初始化月份列表
    initMonthList() {
      for (let i = 1; i <= 12; i++) {
        this.monthList.push(i + '月')
      }
    },
    
    // 初始化日期列表 (根据月份动态变化)
    initDayList() {
      this.dayList = []
      const year = this.formData.year
      const month = this.formData.month
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
        this.dayList.push(i + '日')
      }
      
      // 如果当前选择的日期超过了最大天数，则重置为最大天数
      if (this.formData.day > maxDay) {
        this.formData.day = maxDay
        this.dayIndex = maxDay - 1
      }
    },
    
    // 选择性别
    selectGender(gender) {
      this.formData.gender = gender
    },
    
    // 显示年份选择器
    showYearPicker() {
      this.showPicker.year = true
      // 触发picker显示
      this.$nextTick(() => {
        this.showPicker.year = false
        setTimeout(() => {
          this.showPicker.year = true
        }, 50)
      })
    },
    
    // 显示月份选择器
    showMonthPicker() {
      this.showPicker.month = true
      this.$nextTick(() => {
        this.showPicker.month = false
        setTimeout(() => {
          this.showPicker.month = true
        }, 50)
      })
    },
    
    // 显示日期选择器
    showDayPicker() {
      this.showPicker.day = true
      this.$nextTick(() => {
        this.showPicker.day = false
        setTimeout(() => {
          this.showPicker.day = true
        }, 50)
      })
    },
    
    // 显示时辰选择器
    showTimePicker() {
      this.showPicker.time = true
      this.$nextTick(() => {
        this.showPicker.time = false
        setTimeout(() => {
          this.showPicker.time = true
        }, 50)
      })
    },
    
    // 年份变化
    onYearChange(e) {
      this.yearIndex = e.detail.value
      this.formData.year = 1950 + parseInt(e.detail.value)
      this.initDayList() // 重新计算日期列表
      this.showPicker.year = false
    },
    
    // 月份变化
    onMonthChange(e) {
      this.monthIndex = e.detail.value
      this.formData.month = parseInt(e.detail.value) + 1
      this.initDayList() // 重新计算日期列表
      this.showPicker.month = false
    },
    
    // 日期变化
    onDayChange(e) {
      this.dayIndex = e.detail.value
      this.formData.day = parseInt(e.detail.value) + 1
      this.showPicker.day = false
    },
    
    // 时辰变化
    onTimeChange(e) {
      this.timeIndex = e.detail.value
      const selectedTime = this.timeList[e.detail.value]
      this.formData.time = selectedTime.value
      this.formData.timeLabel = selectedTime.label
      this.showPicker.time = false
    },
    
    // 提交表单
    handleSubmit() {
      // 显示加载提示
      uni.showLoading({
        title: '正在测算...',
        mask: true
      })
      
      // 模拟计算延迟
      setTimeout(() => {
        uni.hideLoading()
        
        // 跳转到信息展示页，传递用户输入的数据
        uni.navigateTo({
          url: `/pages/info/info?gender=${this.formData.gender}&year=${this.formData.year}&month=${this.formData.month}&day=${this.formData.day}&time=${this.formData.time}`
        })
      }, 1500)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60rpx 0;
  box-sizing: border-box;
}

/* 表单卡片 */
.form-card {
  margin: 0 30rpx;
  background: white;
  border-radius: 32rpx;
  padding: 50rpx 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(200, 16, 46, 0.12);
  width: 690rpx;
  max-width: 100%;
}

/* 表单项 */
.form-item {
  margin-bottom: 40rpx;
}

.form-label {
  display: flex;
  align-items: center;
  font-size: 30rpx;
  color: #333;
  font-weight: 600;
  margin-bottom: 20rpx;
}

.label-icon {
  color: #C8102E;
  margin-right: 12rpx;
  font-size: 32rpx;
}

/* 性别选择 */
.gender-section {
  margin-bottom: 50rpx;
}

.gender-tabs {
  display: flex;
  gap: 20rpx;
}

.gender-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120rpx;
  background: #FFF5F5;
  border: 3rpx solid #FFE8E8;
  border-radius: 20rpx;
  font-size: 32rpx;
  color: #999;
  transition: all 0.3s ease;
}

.gender-tab.active.male {
  background: linear-gradient(135deg, #4A90E2 0%, #2E5C8A 100%);
  border-color: #4A90E2;
  color: white;
  box-shadow: 0 6rpx 20rpx rgba(74, 144, 226, 0.3);
  transform: scale(1.02);
}

.gender-tab.active.female {
  background: linear-gradient(135deg, #FF6B9D 0%, #E91E63 100%);
  border-color: #FF6B9D;
  color: white;
  box-shadow: 0 6rpx 20rpx rgba(255, 107, 157, 0.3);
  transform: scale(1.02);
}

.tab-icon {
  font-size: 48rpx;
  margin-bottom: 10rpx;
}

/* 选择器包装 */
.picker-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 30rpx;
  background: #FFF5F5;
  border: 2rpx solid #FFE8E8;
  border-radius: 16rpx;
  transition: all 0.3s ease;
}

.picker-wrapper:active {
  border-color: #C8102E;
  background: #FFE8E8;
}

.picker-value {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
}

.picker-arrow {
  font-size: 28rpx;
  color: #C8102E;
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  height: 96rpx;
  margin-top: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  font-weight: 600;
}

.btn-icon {
  margin-right: 12rpx;
  font-size: 32rpx;
}

/* 底部装饰 */
.footer-decoration {
  text-align: center;
  margin-top: 60rpx;
  padding: 0 40rpx;
}

.decoration-text {
  font-size: 24rpx;
  color: #E63946;
  opacity: 0.6;
}
</style>
