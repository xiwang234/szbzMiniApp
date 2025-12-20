/**
 * 微信小程序登录授权管理模块
 * 
 * 功能：
 * 1. 管理微信登录状态
 * 2. 缓存登录凭证（code）
 * 3. 自动检测登录状态有效性
 * 4. 提供登录、登出、状态检查等方法
 * 
 * @author 资深小程序架构师
 * @date 2025-12-17
 */

const AUTH_CONFIG = {
  // 缓存key
  CODE_CACHE_KEY: 'wx_login_code',
  CODE_TIMESTAMP_KEY: 'wx_login_code_timestamp',
  LOGIN_STATE_KEY: 'wx_login_state',
  
  // code有效期（微信官方：5分钟）
  // 为了安全，我们设置4分钟后重新获取
  CODE_EXPIRE_TIME: 4 * 60 * 1000,
  
  // 登录状态有效期（24小时）
  LOGIN_STATE_EXPIRE_TIME: 24 * 60 * 60 * 1000
}

/**
 * 登录管理类
 */
class AuthManager {
  constructor() {
    this.isLoggingIn = false // 防止并发登录
  }

  /**
   * 检查登录状态是否有效
   * @returns {boolean} true-已登录且有效，false-未登录或已过期
   */
  checkLoginState() {
    try {
      const loginState = wx.getStorageSync(AUTH_CONFIG.LOGIN_STATE_KEY)
      
      if (!loginState || !loginState.timestamp) {
        console.log('[Auth] 未找到登录状态')
        return false
      }

      const now = Date.now()
      const elapsed = now - loginState.timestamp

      if (elapsed > AUTH_CONFIG.LOGIN_STATE_EXPIRE_TIME) {
        console.log('[Auth] 登录状态已过期')
        this.clearLoginState()
        return false
      }

      console.log('[Auth] 登录状态有效，剩余时间:', 
        Math.floor((AUTH_CONFIG.LOGIN_STATE_EXPIRE_TIME - elapsed) / 1000 / 60), '分钟')
      return true
    } catch (error) {
      console.error('[Auth] 检查登录状态失败:', error)
      return false
    }
  }

  /**
   * 检查缓存的code是否有效
   * @returns {Object|null} {code, timestamp} 或 null
   */
  checkCachedCode() {
    try {
      const code = wx.getStorageSync(AUTH_CONFIG.CODE_CACHE_KEY)
      const timestamp = wx.getStorageSync(AUTH_CONFIG.CODE_TIMESTAMP_KEY)

      if (!code || !timestamp) {
        console.log('[Auth] 未找到缓存的code')
        return null
      }

      const now = Date.now()
      const elapsed = now - timestamp

      if (elapsed > AUTH_CONFIG.CODE_EXPIRE_TIME) {
        console.log('[Auth] 缓存的code已过期')
        this.clearCodeCache()
        return null
      }

      console.log('[Auth] 缓存的code有效，剩余时间:', 
        Math.floor((AUTH_CONFIG.CODE_EXPIRE_TIME - elapsed) / 1000), '秒')
      
      return { code, timestamp }
    } catch (error) {
      console.error('[Auth] 检查缓存code失败:', error)
      return null
    }
  }

  /**
   * 获取微信登录code
   * @param {boolean} forceRefresh 是否强制刷新（忽略缓存）
   * @returns {Promise<string>} 返回登录code
   */
  getLoginCode(forceRefresh = false) {
    return new Promise((resolve, reject) => {
      // 防止并发登录
      if (this.isLoggingIn) {
        console.log('[Auth] 正在登录中，请勿重复调用')
        reject(new Error('正在登录中'))
        return
      }

      // 检查缓存的code是否有效
      if (!forceRefresh) {
        const cachedCode = this.checkCachedCode()
        if (cachedCode) {
          console.log('[Auth] 使用缓存的code:', cachedCode.code)
          resolve(cachedCode.code)
          return
        }
      }

      // 调用微信登录接口获取新的code
      this.isLoggingIn = true
      console.log('[Auth] 开始调用wx.login获取新的code')

      wx.login({
        success: (res) => {
          this.isLoggingIn = false

          if (res.code) {
            console.log('[Auth] 获取code成功:', res.code)
            
            // 缓存code和时间戳
            this.saveCodeCache(res.code)
            
            resolve(res.code)
          } else {
            console.error('[Auth] 获取code失败，无code返回')
            reject(new Error('获取code失败'))
          }
        },
        fail: (error) => {
          this.isLoggingIn = false
          console.error('[Auth] wx.login调用失败:', error)
          reject(error)
        }
      })
    })
  }

  /**
   * 执行完整的登录流程
   * @param {boolean} silent 是否静默登录（不显示提示）
   * @returns {Promise<string>} 返回登录code
   */
  async login(silent = false) {
    try {
      console.log('[Auth] ========== 开始登录流程 ==========')
      
      // 检查登录状态
      const isLoggedIn = this.checkLoginState()
      
      if (isLoggedIn) {
        console.log('[Auth] 用户已登录，检查code缓存')
        
        // 已登录，尝试使用缓存的code
        const cachedCode = this.checkCachedCode()
        if (cachedCode) {
          console.log('[Auth] 使用缓存的code，无需重新登录')
          return cachedCode.code
        }
        
        // code已过期，重新获取
        console.log('[Auth] code已过期，重新获取')
      } else {
        console.log('[Auth] 用户未登录或登录已过期')
      }

      // 显示加载提示
      if (!silent) {
        wx.showLoading({
          title: '登录中...',
          mask: true
        })
      }

      // 获取登录code
      const code = await this.getLoginCode(false)
      
      // 标记为已登录状态
      this.saveLoginState()

      // 隐藏加载提示
      if (!silent) {
        wx.hideLoading()
      }

      console.log('[Auth] ========== 登录流程完成 ==========')
      return code

    } catch (error) {
      wx.hideLoading()
      console.error('[Auth] 登录流程失败:', error)
      
      if (!silent) {
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        })
      }
      
      throw error
    }
  }

  /**
   * 保存code到缓存
   * @param {string} code 登录code
   */
  saveCodeCache(code) {
    try {
      const timestamp = Date.now()
      wx.setStorageSync(AUTH_CONFIG.CODE_CACHE_KEY, code)
      wx.setStorageSync(AUTH_CONFIG.CODE_TIMESTAMP_KEY, timestamp)
      console.log('[Auth] code已缓存，有效期4分钟')
    } catch (error) {
      console.error('[Auth] 保存code缓存失败:', error)
    }
  }

  /**
   * 保存登录状态
   */
  saveLoginState() {
    try {
      const loginState = {
        timestamp: Date.now(),
        isLoggedIn: true
      }
      wx.setStorageSync(AUTH_CONFIG.LOGIN_STATE_KEY, loginState)
      console.log('[Auth] 登录状态已保存')
    } catch (error) {
      console.error('[Auth] 保存登录状态失败:', error)
    }
  }

  /**
   * 清除code缓存
   */
  clearCodeCache() {
    try {
      wx.removeStorageSync(AUTH_CONFIG.CODE_CACHE_KEY)
      wx.removeStorageSync(AUTH_CONFIG.CODE_TIMESTAMP_KEY)
      console.log('[Auth] code缓存已清除')
    } catch (error) {
      console.error('[Auth] 清除code缓存失败:', error)
    }
  }

  /**
   * 清除登录状态
   */
  clearLoginState() {
    try {
      wx.removeStorageSync(AUTH_CONFIG.LOGIN_STATE_KEY)
      console.log('[Auth] 登录状态已清除')
    } catch (error) {
      console.error('[Auth] 清除登录状态失败:', error)
    }
  }

  /**
   * 登出（清除所有登录相关缓存）
   */
  logout() {
    console.log('[Auth] ========== 执行登出操作 ==========')
    this.clearCodeCache()
    this.clearLoginState()
    
    wx.showToast({
      title: '已退出登录',
      icon: 'success'
    })
  }

  /**
   * 获取登录状态信息（调试用）
   * @returns {Object} 登录状态详情
   */
  getLoginInfo() {
    const loginState = wx.getStorageSync(AUTH_CONFIG.LOGIN_STATE_KEY)
    const code = wx.getStorageSync(AUTH_CONFIG.CODE_CACHE_KEY)
    const codeTimestamp = wx.getStorageSync(AUTH_CONFIG.CODE_TIMESTAMP_KEY)

    return {
      isLoggedIn: this.checkLoginState(),
      loginState,
      code,
      codeTimestamp,
      codeValid: this.checkCachedCode() !== null
    }
  }
}

// 创建单例实例
const authManager = new AuthManager()

// 导出单例和类
module.exports = {
  authManager,
  AuthManager,
  AUTH_CONFIG
}
