// pages/info/info.js
Page({
  data: {
    // 用户输入的信息
    userInfo: {
      gender: '',
      year: '',
      month: '',
      day: '',
      time: ''
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
    // 接收首页传递的参数
    if (options) {
      this.setData({
        userInfo: {
          gender: options.gender || 'male',
          year: options.year || '2014',
          month: options.month || '6',
          day: options.day || '15',
          time: options.time || '午时'
        }
      })
    }
    
    // 加载分析数据
    this.loadAnalysisData()
  },

  /**
   * 加载分析数据（模拟接口调用）
   */
  loadAnalysisData() {
    this.setData({ loading: true, error: '' })
    
    // 模拟网络请求延迟
    setTimeout(() => {
      // 模拟后端返回的数据
      const mockData = this.generateMockData()
      
      this.setData({
        analysisData: mockData,
        loading: false
      })
    }, 1500)
    
    // 真实项目中应该调用后端接口：
    /*
    wx.request({
      url: 'https://your-api.com/analysis',
      method: 'POST',
      data: this.data.userInfo,
      success: (res) => {
        this.setData({
          analysisData: res.data,
          loading: false
        })
      },
      fail: (err) => {
        this.setData({
          error: '加载失败，请重试',
          loading: false
        })
      }
    })
    */
  },

  /**
   * 生成模拟数据
   */
  generateMockData() {
    const { gender, year, month, day, time } = this.data.userInfo
    
    // 生成长文本内容
    const content = `【基本信息】
性别：${gender === 'male' ? '男' : '女'}
出生时间：${year}年${month}月${day}日 ${time}

【生辰八字】
您的生辰八字为：甲午年 庚午月 戊申日 壬午时

【命理分析】
八字中日主戊土生于午月，正值火旺土燥之时。年柱甲午，木火相生，天干透甲木为正官，地支藏丙火丁火，食神伤官并见。月柱庚午，金火相克，庚金为伤官，但午火克制庚金，伤官受制。日柱戊申，戊土坐申金，申金为食神，为泄秀之地。时柱壬午，水火既济，壬水为正财，午火为印绶。

【五行分析】
五行属性：木1 火4 土2 金2 水1
命局五行火旺，需要水来调候，金来泄秀。八字喜金水，忌木火。土为中性。

【性格特征】
您为人忠厚老实，做事稳重踏实，有责任心。具有很强的包容心和同情心，乐于助人。思维灵活，善于变通，但有时容易优柔寡断。重视传统，尊重长辈，孝顺父母。在工作中认真负责，一丝不苟，深得领导和同事的信任。

【事业运势】
事业方面，您适合从事稳定性较强的工作，如公务员、教师、会计、金融等行业。工作中踏实肯干，能够得到上级的赏识和提拔。中年以后事业运势逐渐提升，有望担任领导职务。建议把握机会，稳扎稳打，切忌急功近利。

【财运分析】
财运方面，正财运较旺，工资收入稳定。但偏财运一般，不宜进行高风险投资。建议理性理财，稳健投资，积少成多。中年以后财运逐渐好转，有望积累一定的财富。需要注意的是，不要轻信他人，谨防上当受骗。

【感情婚姻】
感情运势较为平稳，${gender === 'male' ? '男命' : '女命'}重情重义，对待感情认真负责。早年感情发展较慢，需要耐心等待缘分。中年以后感情运势转好，有望遇到合适的伴侣。婚后夫妻感情和睦，家庭幸福美满。建议多沟通交流，相互理解包容。

【健康状况】
健康方面需要注意脾胃和心血管系统。由于八字火旺，容易出现上火、口腔溃疡等症状。建议饮食清淡，多吃蔬菜水果，少吃辛辣刺激性食物。适当运动，保持良好的作息习惯。定期体检，预防疾病。

【开运建议】
1. 吉祥方位：西方、北方
2. 吉祥颜色：白色、黑色、金色
3. 幸运数字：4、9、1、6
4. 适宜职业：金融、会计、教育、公务员
5. 佩戴饰品：金银首饰、水晶玉石

【总体评价】
整体来看，您的命局中正印、正官、正财俱全，属于正格命局，为人正直，品行端正。虽然早年运势平平，但中年以后渐入佳境，晚年运势更佳。建议踏实做事，诚信待人，积善行德，定能福寿安康，事业有成。

以上分析仅供参考，详细内容请解锁完整报告查看。`;
    
    return {
      content: content
    }
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
