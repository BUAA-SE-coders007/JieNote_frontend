import http from '@/utils/http';

/**
 * Profile 相关 API
 */

/**
 * 获取用户信息
 * @returns {Promise<any>} 用户数据
 */
export const getUserProfile = () => {
  return http.get('/user/get');
};

/**
 * 更改密码
 * @param {Object} data - 密码数据
 * @param {string} data.old_password - 旧密码
 * @param {string} data.new_password - 新密码
 * @returns {Promise<any>} 更新结果
 */
export const changePassword = (data) => {
  return http.post('/user/password', data);
};

/**
 * 获取个人文献统计信息
 * @returns {Promise<any>} 文献统计数据
 */
export const getSelfArticleStatistic = () => {
  return http.get('/article/selfArticleStatistic');
};

/**
 * 获取当前用户笔记统计数目
 * @returns {Promise<any>} 笔记统计数据
 */
export const getNoteCount = () => {
  return http.get('/notes/count');
};

/**
 * 获取当前用户笔记统计数目（近七天）
 * @returns {Promise<any>} 近七天笔记统计数据
 */
export const getRecentNoteCount = () => {
  return http.get('/notes/count/recent');
};

export default {
  getUserProfile,
  changePassword,
  getSelfArticleStatistic,
  getNoteCount,
  getRecentNoteCount,
};
