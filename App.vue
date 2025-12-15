<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
/* 全局样式 */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

page {
  background: linear-gradient(180deg, #FFF5F5 0%, #FFE8E8 100%);
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

/* 通用容器 */
.container {
  padding: 20rpx;
  box-sizing: border-box;
}

/* 通用按钮样式 */
.btn-primary {
  background: linear-gradient(135deg, #E63946 0%, #C8102E 100%);
  color: white;
  border: none;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: 600;
  box-shadow: 0 8rpx 20rpx rgba(230, 57, 70, 0.3);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 4rpx 12rpx rgba(230, 57, 70, 0.4);
  }
}

/* 通用卡片样式 */
.card {
  background: white;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(200, 16, 46, 0.08);
}

/* 通用标题样式 */
.title {
  color: #C8102E;
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 20rpx;
}

/* 通用文本样式 */
.text-primary {
  color: #C8102E;
}

.text-secondary {
  color: #666666;
}

.text-muted {
  color: #999999;
}
</style>
