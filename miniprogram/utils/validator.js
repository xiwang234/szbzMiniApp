/**
 * 输入验证工具
 * 用于敏感词过滤和安全性检查
 */

// 敏感词列表（示例，实际应从服务端获取或定期更新）
const SENSITIVE_WORDS = [
  // 政治敏感词
  '习近平', '江泽民', '胡锦涛', '温家宝', '李克强', '毛泽东', '邓小平',
  '共产党', '法轮功', '天安门', '六四', '台独', '藏独', '疆独', '港独',
  '民运', '民主化', '反共', '政变', '暴动', '游行示威',
  
  // 违法犯罪类
  '毒品', '海洛因', '冰毒', '摇头丸', '大麻', '可卡因', '吸毒', '贩毒',
  '枪支', '手枪', '步枪', '炸药', 'TNT', '爆炸', '自制炸弹',
  '色情', '黄色', '成人电影', '援交', '卖淫', '嫖娼', 
  '赌博', '赌场', '博彩', '六合彩', '时时彩',
  '诈骗', '传销', '洗钱', '地下钱庄', '高利贷',
  
  // 暴力恐怖类
  '恐怖分子', '恐怖袭击', '爆炸袭击', '自杀式', 'ISIS', '基地组织',
  '杀人', '谋杀', '暗杀', '绑架', '劫持',
  
  // 邪教类
  '邪教', '全能神', '观音法门', '灵灵教',
  
  // 其他不适当内容
  '自杀', '自残', '跳楼', '割腕', '服毒',
  '侮辱', '歧视', '仇恨', '诽谤', '造谣'
]

// 危险脚本模式（SQL注入、XSS攻击等）
const DANGEROUS_PATTERNS = [
  // SQL注入
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)/gi,
  /('|('')|;|--|\/\*|\*\/|xp_)/gi,
  
  // XSS攻击
  /<script[^>]*>.*?<\/script>/gi,
  /<iframe[^>]*>.*?<\/iframe>/gi,
  /<object[^>]*>.*?<\/object>/gi,
  /<embed[^>]*>/gi,
  /<applet[^>]*>.*?<\/applet>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi, // onclick, onload等事件
  
  // HTML注入
  /<[^>]*>/g, // 简单的HTML标签检测
  
  // 其他危险字符
  /[\x00-\x08\x0B\x0C\x0E-\x1F]/g, // 控制字符
  /eval\s*\(/gi,
  /expression\s*\(/gi
]

// 特殊字符白名单（允许的标点符号）
const ALLOWED_PUNCTUATION = '，。、；：""\'\'！？（）【】《》…—·～'

/**
 * 检查是否包含敏感词
 * @param {string} text 待检查的文本
 * @returns {object} { isValid: boolean, words: array, message: string }
 */
function checkSensitiveWords(text) {
  if (!text || typeof text !== 'string') {
    return { isValid: true, words: [], message: '' }
  }
  
  const foundWords = []
  const lowerText = text.toLowerCase()
  
  for (let word of SENSITIVE_WORDS) {
    if (lowerText.includes(word.toLowerCase())) {
      foundWords.push(word)
    }
  }
  
  if (foundWords.length > 0) {
    return {
      isValid: false,
      words: foundWords,
      message: `内容包含敏感词，请修改后重试`
    }
  }
  
  return { isValid: true, words: [], message: '' }
}

/**
 * 替换敏感词为星号
 * @param {string} text 待处理的文本
 * @returns {object} { text: string, replaced: boolean, count: number }
 */
function replaceSensitiveWords(text) {
  if (!text || typeof text !== 'string') {
    return { text: '', replaced: false, count: 0 }
  }
  
  let result = text
  let replacedCount = 0
  
  // 遍历敏感词库，替换为等长的星号
  for (let word of SENSITIVE_WORDS) {
    // 转义特殊字符，创建正则表达式
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(escapedWord, 'gi')
    
    // 检查是否包含该敏感词
    if (result.toLowerCase().includes(word.toLowerCase())) {
      // 替换为等长的星号
      const stars = '*'.repeat(word.length)
      result = result.replace(regex, stars)
      replacedCount++
    }
  }
  
  return {
    text: result,
    replaced: replacedCount > 0,
    count: replacedCount
  }
}

/**
 * 检查是否包含危险脚本
 * @param {string} text 待检查的文本
 * @returns {object} { isValid: boolean, patterns: array, message: string }
 */
function checkDangerousScript(text) {
  if (!text || typeof text !== 'string') {
    return { isValid: true, patterns: [], message: '' }
  }
  
  const foundPatterns = []
  
  for (let i = 0; i < DANGEROUS_PATTERNS.length; i++) {
    const pattern = DANGEROUS_PATTERNS[i]
    if (pattern.test(text)) {
      foundPatterns.push(i)
    }
  }
  
  if (foundPatterns.length > 0) {
    return {
      isValid: false,
      patterns: foundPatterns,
      message: '输入内容包含非法字符，请检查后重试'
    }
  }
  
  return { isValid: true, patterns: [], message: '' }
}

/**
 * 清理文本，移除危险字符但保留合法内容
 * @param {string} text 原始文本
 * @returns {string} 清理后的文本
 */
function sanitizeText(text) {
  if (!text || typeof text !== 'string') {
    return ''
  }
  
  let cleaned = text
  
  // 移除HTML标签
  cleaned = cleaned.replace(/<[^>]*>/g, '')
  
  // 移除脚本相关内容
  cleaned = cleaned.replace(/javascript:/gi, '')
  cleaned = cleaned.replace(/on\w+\s*=/gi, '')
  
  // 移除SQL注入相关
  cleaned = cleaned.replace(/['"`;]/g, '')
  
  // 移除控制字符
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
  
  // 移除多余空白
  cleaned = cleaned.replace(/\s+/g, ' ').trim()
  
  return cleaned
}

/**
 * 验证文本是否只包含允许的字符（中英文、数字、标点）
 * @param {string} text 待验证的文本
 * @param {string} type 验证类型：'background' | 'question'
 * @returns {object} { isValid: boolean, message: string }
 */
function validateCharacters(text, type = 'background') {
  if (!text || typeof text !== 'string') {
    return { isValid: false, message: '输入不能为空' }
  }
  
  // 根据类型设置不同的验证规则
  let allowedPattern
  if (type === 'background') {
    // 背景描述：允许中英文、数字、常用标点、空格
    allowedPattern = new RegExp(`^[\u4e00-\u9fa5a-zA-Z0-9${ALLOWED_PUNCTUATION}\\s]+$`)
  } else if (type === 'question') {
    // 问题：允许中英文、数字、问号
    allowedPattern = /^[\u4e00-\u9fa5a-zA-Z0-9？?]+$/
  }
  
  if (!allowedPattern.test(text)) {
    return {
      isValid: false,
      message: '输入包含不支持的特殊字符'
    }
  }
  
  return { isValid: true, message: '' }
}

/**
 * 综合验证函数（新版：自动替换敏感词）
 * @param {string} text 待验证的文本
 * @param {string} type 验证类型：'background' | 'question'
 * @returns {object} { isValid: boolean, message: string, sanitized: string, replaced: boolean }
 */
function validateInput(text, type = 'background') {
  // 1. 基本验证
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return {
      isValid: false,
      message: '输入不能为空',
      sanitized: '',
      replaced: false
    }
  }
  
  // 2. 长度验证
  const maxLength = type === 'background' ? 200 : 30
  if (text.length > maxLength) {
    return {
      isValid: false,
      message: `内容超过${maxLength}字限制`,
      sanitized: text,
      replaced: false
    }
  }
  
  // 3. 检查并替换敏感词（不再阻止提交，而是自动替换）
  const sensitiveReplacement = replaceSensitiveWords(text)
  let processedText = sensitiveReplacement.text
  
  // 4. 检查危险脚本（这个必须拦截）
  const scriptCheck = checkDangerousScript(processedText)
  if (!scriptCheck.isValid) {
    return {
      isValid: false,
      message: scriptCheck.message,
      sanitized: processedText,
      replaced: sensitiveReplacement.replaced
    }
  }
  
  // 5. 验证字符类型
  const charCheck = validateCharacters(processedText, type)
  if (!charCheck.isValid) {
    return {
      isValid: false,
      message: charCheck.message,
      sanitized: processedText,
      replaced: sensitiveReplacement.replaced
    }
  }
  
  // 6. 清理文本（防御性编程）
  const sanitized = sanitizeText(processedText)
  
  // 7. 检查清理后是否还有内容
  if (sanitized.trim().length === 0) {
    return {
      isValid: false,
      message: '输入内容无效',
      sanitized: sanitized,
      replaced: sensitiveReplacement.replaced
    }
  }
  
  return {
    isValid: true,
    message: sensitiveReplacement.replaced ? `已自动过滤${sensitiveReplacement.count}个敏感词` : '验证通过',
    sanitized: sanitized,
    replaced: sensitiveReplacement.replaced
  }
}

/**
 * 实时过滤输入（用于输入时的即时处理）
 * @param {string} text 输入的文本
 * @param {string} type 输入类型
 * @returns {string} 过滤后的文本
 */
function filterInput(text, type = 'background') {
  if (!text) return ''
  
  let filtered = text
  
  if (type === 'background') {
    // 背景描述：只保留中英文、数字、常用标点、空格
    filtered = text.replace(new RegExp(`[^\u4e00-\u9fa5a-zA-Z0-9${ALLOWED_PUNCTUATION}\\s]`, 'g'), '')
  } else if (type === 'question') {
    // 问题：只保留中英文、数字、问号
    filtered = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9？?]/g, '')
  }
  
  return filtered
}

module.exports = {
  checkSensitiveWords,
  replaceSensitiveWords,
  checkDangerousScript,
  sanitizeText,
  validateCharacters,
  validateInput,
  filterInput
}
