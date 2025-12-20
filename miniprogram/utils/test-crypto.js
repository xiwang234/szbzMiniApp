/**
 * 签名算法测试脚本
 * 用于验证小程序端签名算法与后端是否一致
 * 
 * 使用方法:
 * 1. 在微信开发者工具控制台中引入此文件
 * 2. 运行测试用例
 * 3. 对比生成的签名与后端是否一致
 */

const crypto = require('./crypto.js')

// 测试用例1: 基本参数
function testCase1() {
  console.log('========== 测试用例1: 基本参数 ==========')
  
  const params = {
    openId: 'test_openid_123456',
    gender: 'male',
    year: 2014,
    month: 6,
    day: 15,
    hour: 11
  }
  
  const timestamp = 1702800000000
  const sign = crypto.generateSignature(params, timestamp)
  
  console.log('参数:', params)
  console.log('时间戳:', timestamp)
  console.log('生成签名:', sign)
  console.log('')
  
  return sign
}

// 测试用例2: 女性参数
function testCase2() {
  console.log('========== 测试用例2: 女性参数 ==========')
  
  const params = {
    openId: 'wxuser_987654',
    gender: 'female',
    year: 1990,
    month: 12,
    day: 25,
    hour: 8
  }
  
  const timestamp = 1702900000000
  const sign = crypto.generateSignature(params, timestamp)
  
  console.log('参数:', params)
  console.log('时间戳:', timestamp)
  console.log('生成签名:', sign)
  console.log('')
  
  return sign
}

// 测试用例3: 边界值
function testCase3() {
  console.log('========== 测试用例3: 边界值 ==========')
  
  const params = {
    openId: 'boundary_test',
    gender: 'male',
    year: 1950,
    month: 1,
    day: 1,
    hour: 0
  }
  
  const timestamp = Date.now()
  const sign = crypto.generateSignature(params, timestamp)
  
  console.log('参数:', params)
  console.log('时间戳:', timestamp)
  console.log('生成签名:', sign)
  console.log('')
  
  return sign
}

// 对比测试: 与后端期望签名对比
function compareWithBackend() {
  console.log('========== 后端签名对比测试 ==========')
  console.log('请在后端运行以下Java代码生成期望签名:')
  console.log('')
  console.log('```java')
  console.log('Map<String, Object> params = new HashMap<>();')
  console.log('params.put("openId", "test_openid_123456");')
  console.log('params.put("gender", "male");')
  console.log('params.put("year", 2014);')
  console.log('params.put("month", 6);')
  console.log('params.put("day", 15);')
  console.log('params.put("hour", 11);')
  console.log('')
  console.log('long timestamp = 1702800000000L;')
  console.log('String sign = signatureUtil.generateSignature(params, timestamp);')
  console.log('System.out.println("后端签名: " + sign);')
  console.log('```')
  console.log('')
  
  const frontendSign = testCase1()
  console.log('前端签名:', frontendSign)
  console.log('')
  console.log('请对比前后端签名是否一致!')
}

// 运行所有测试
function runAllTests() {
  console.log('开始运行签名算法测试...\n')
  
  testCase1()
  testCase2()
  testCase3()
  compareWithBackend()
  
  console.log('所有测试完成!')
}

// 导出测试函数
module.exports = {
  testCase1,
  testCase2,
  testCase3,
  compareWithBackend,
  runAllTests
}

// 如果直接运行此文件,执行所有测试
if (typeof module !== 'undefined' && module.exports) {
  // Node.js 环境
  // runAllTests()
}
