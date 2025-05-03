import http from '@/utils/http';

/**
 * 用户相关 API
 */

/**
 * 用户登录
 * @param {Object} data - 登录参数
 * @param {string} data.email - 用户邮箱
 * @param {string} data.password - 用户密码
 * @returns {Promise<any>} 登录结果
 */
export const login = (data) => {
  return http.post('/public/login', data);
};

/**
 * 刷新 token
 * @param {string} refreshToken - 刷新令牌
 * @returns {Promise<any>} 刷新结果
 */
export const refreshToken = (refreshToken) => {
  return http.post('/public/refresh', { refresh_token: refreshToken });
};

/**
 * 用户注册
 * @param {Object} data - 注册参数
 * @param {string} data.username - 用户名
 * @param {string} data.email - 用户邮箱
 * @param {string} data.password - 用户密码
 * @returns {Promise<any>} 注册结果
 */
export const register = (data) => {
  return http.post('/public/register', data);
};

/**
 * 获取用户信息
 * @returns {Promise<any>} 用户信息
 */
export const getUserInfo = () => {
  return http.get('/user');
};

/**
 * 更新用户信息
 * @param {Object} data - 更新数据
 * @param {string} [data.username] - 用户名
 * @param {File} [data.avatar] - 头像文件
 * @param {string} [data.address] - 地址
 * @param {string} [data.university] - 大学
 * @param {string} [data.introduction] - 个人介绍
 * @returns {Promise<any>} 更新结果
 */
export const updateUserInfo = (data) => {
  // 如果传入的是普通对象而非 FormData，则需要创建 FormData
  if (!(data instanceof FormData)) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    data = formData;
  }
  
  return http.put('/user', data);
};

/**
 * 修改密码
 * @param {Object} data - 密码数据
 * @param {string} data.old_password - 旧密码
 * @param {string} data.new_password - 新密码
 * @returns {Promise<any>} 修改结果
 */
export const changePassword = (data) => {
  return http.post('/user/password', data);
};

export default {
  login,
  refreshToken,
  register,
  getUserInfo,
  updateUserInfo,
  changePassword
};
