import axios from 'axios';
import { ElMessage } from 'element-plus';
import { getToken, getRefreshToken, setToken, clearAuth } from './auth';

// API 基础 URL
const BASE_URL = 'https://43.143.228.56:8000';

/**
 * 创建 axios 实例
 */
const http = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 刷新 token 状态
let isRefreshing = false;
// 等待刷新 token 的请求队列
let requestsQueue = [];

/**
 * 刷新 token
 * @returns {Promise<string>} 新的 token
 */
const refreshTokenFn = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('刷新 Token 不存在');
    }
    
    const { data } = await axios.post(`${BASE_URL}/public/refresh`, {
      refresh_token: refreshToken
    });
    
    const { access_token } = data;
    setToken(access_token);
    return access_token;
  } catch (error) {
    clearAuth();
    // 使用窗口重定向替代 router.push
    window.location.href = '/auth/login';
    throw new Error('刷新 Token 失败，请重新登录');
  }
};

/**
 * 请求拦截器
 */
http.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
http.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (!error.response) {
      ElMessage.error('网络错误，请检查网络连接');
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // 如果是 401 未授权错误，且不是刷新 token 请求，则尝试刷新 token
    if (error.response.status === 401 && !originalRequest._retry) {
      // 标记请求已尝试刷新 token
      originalRequest._retry = true;

      // 如果当前没有正在刷新的 token，则开始刷新
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newToken = await refreshTokenFn();
          
          // 更新队列中所有请求的 token
          requestsQueue.forEach(({ config, resolve }) => {
            config.headers['Authorization'] = `Bearer ${newToken}`;
            resolve(http(config));
          });
          
          // 清空队列
          requestsQueue = [];
          
          // 更新当前请求的 token 并重试
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return http(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // 如果已经在刷新，则将请求加入队列
        return new Promise((resolve) => {
          requestsQueue.push({
            config: originalRequest,
            resolve
          });
        });
      }
    }

    // 处理其他错误
    const errorMsg = error.response.data?.message || '请求发生错误';
    ElMessage.error(errorMsg);
    return Promise.reject(error);
  }
);

export default http;
