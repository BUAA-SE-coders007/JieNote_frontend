import http from '@/utils/http'

/**
 * 文献相关 API
 */

/**
 * 搜索文献
 * @param {Object} params - 查询参数
 * @param {string} params.query - 搜索关键词（必需）
 * @returns {Promise<any>} 搜索结果
 */
export const searchLiterature = (params = {}) => {
  return http.get('/database/search', { params });
};

/**
 * 获取文献列表
 * @param {Object} params - 查询参数（可选）
 * @returns {Promise<any>} 文献列表
 */
export const getLiteratureList = (params = {}) => {
  return http.get('/database/get', { params });
};

/**
 * 获取用户自己的文件夹列表
 * @returns {Promise<any>} 文件夹列表
 */
export const getSelfFolders = () => {
  return http.get('/article/getSelfFolders');
};

/**
 * 文献转存到文件夹
 * @param {Object} params
 * @param {number|string} params.folder_id - 文件夹ID
 * @param {number|string} params.article_id - 文献ID
 * @returns {Promise<any>} 操作结果
 */
export const copyArticleToFolder = (params = {}) => {
  return http.put('/database/copy', null, { params });
};

/**
 * 获取个性推荐文献
 * @param {Object} params
 * @param {string|number} params.size - 推荐数量
 * @returns {Promise<any>} 推荐文献列表
 */
export const getRecommendLiterature = (params = {}) => {
  return http.get('/database/recommend', { params });
};

/**
 * 生成文献简介
 * @param {Object} params - 查询参数
 * @param {string} params.article_id - 文献ID（必需）
 * @returns {Promise<any>} 文献简介
 */
export const generateArticleIntro = (params = {}) => {
  return http.get('/chat/intro', { params });
};

export default {
  searchLiterature,
  getLiteratureList,
  getSelfFolders,
  copyArticleToFolder,
  getRecommendLiterature,
  generateArticleIntro
};