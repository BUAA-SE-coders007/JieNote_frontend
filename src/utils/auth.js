/**
 * Token 管理工具
 */

// Token 存储键名
const TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * 设置认证 Token
 * @param {string} token - 认证 token
 */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * 获取认证 Token
 * @returns {string|null} 认证 token
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * 删除认证 Token
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * 设置刷新 Token
 * @param {string} token - 刷新 token
 */
export const setRefreshToken = (token) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

/**
 * 获取刷新 Token
 * @returns {string|null} 刷新 token
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * 删除刷新 Token
 */
export const removeRefreshToken = () => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * 清除所有认证信息
 */
export const clearAuth = () => {
  removeToken();
  removeRefreshToken();
};

/**
 * 判断是否已登录
 * @returns {boolean} 是否已登录
 */
export const isAuthenticated = () => {
  return !!getToken();
};
