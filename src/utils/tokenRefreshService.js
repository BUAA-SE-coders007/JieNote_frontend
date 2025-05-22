/**
 * Token刷新服务
 * 
 * 该服务集中处理Token的自动刷新逻辑，避免在多个组件中重复实现刷新逻辑。
 * 主要功能：
 * 1. 初始化自动刷新Token的定时器
 * 2. 在Token即将过期前主动刷新
 * 3. 处理刷新失败的情况，并重定向到登录页面
 */

import { refreshToken as refreshTokenAPI } from '@/api/user';
import { setToken, getToken, getRefreshToken, clearAuth } from '@/utils/auth';
// 由于路由定义在main.js中，我们不能直接导入router
// 而需要在redirectToLogin中使用window.location.href重定向
import { jwtDecode } from 'jwt-decode';

class TokenRefreshService {
  constructor() {
    this.refreshTimeoutId = null;
    this.tokenExpiryTime = null;
    this.refreshMargin = 60 * 1000; // 在过期前1分钟刷新Token
  }

  /**
   * 初始化Token刷新服务
   * 在应用启动时调用此方法设置自动刷新
   */
  init() {
    // 检查本地是否有Token
    const token = getToken();
    if (token) {
      this.scheduleRefresh(token);
    }
  }

  /**
   * 根据Token计算过期时间并安排刷新
   * @param {string} token JWT Token
   */
  scheduleRefresh(token) {
    try {
      // 清除可能存在的之前的定时器
      if (this.refreshTimeoutId) {
        clearTimeout(this.refreshTimeoutId);
      }

      // 解析JWT Token获取过期时间
      const decoded = jwtDecode(token);
      if (!decoded.exp) {
        console.warn('Token没有过期时间信息');
        return;
      }

      // 计算Token过期时间（毫秒）
      this.tokenExpiryTime = decoded.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiry = this.tokenExpiryTime - currentTime;

      // 计算何时刷新Token（过期前refreshMargin毫秒）
      const refreshTime = timeUntilExpiry - this.refreshMargin;

      if (refreshTime <= 0) {
        // Token已过期或即将过期，立即刷新
        console.log('Token即将过期，立即刷新');
        this.refreshToken();
      } else {
        // 设置定时器在适当的时间刷新Token
        console.log(`Token将在 ${new Date(this.tokenExpiryTime)} 过期，将在 ${refreshTime / 1000} 秒后刷新`);
        this.refreshTimeoutId = setTimeout(() => this.refreshToken(), refreshTime);
      }
    } catch (error) {
      console.error('解析Token时出错:', error);
    }
  }

  /**
   * 执行Token刷新操作
   */
  async refreshToken() {
    try {
      const refreshTokenValue = getRefreshToken();
      console.log("准备刷新Token");
      
      if (!refreshTokenValue) {
        console.error("Refresh Token不存在，请重新登录");
        this.redirectToLogin();
        return;
      }

      // 调用API刷新Token
      const response = await refreshTokenAPI(refreshTokenValue);

      if (response.status === 200) {
        const { access_token } = response.data;
        // 更新本地存储的Token
        setToken(access_token);
        console.log("Token已刷新");
        
        // 重新安排下一次刷新
        this.scheduleRefresh(access_token);
      } else {
        throw new Error("刷新Token失败");
      }
    } catch (error) {
      console.error("刷新Token失败:", error);
      this.redirectToLogin();
    }
  }

  /**
   * 重定向到登录页面
   */
  redirectToLogin() {
    // 清理认证信息
    clearAuth();
    // 使用window.location进行重定向到登录页
    const currentPath = window.location.pathname;
    if (currentPath !== '/auth/login') {
      window.location.href = '/auth/login';
    }
  }
}

// 创建单例实例
const tokenRefreshService = new TokenRefreshService();

export default tokenRefreshService;
