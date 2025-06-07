import http from '@/utils/http';

/**
 * 笔记相关 API
 */

/**
 * 获取笔记列表
 * @param {Object} params - 查询参数
 * @param {number} [params.id] - 笔记 ID
 * @param {number} [params.page] - 页码
 * @param {number} [params.page_size] - 每页大小
 * @param {number} [params.article_id] - 文献 ID
 * @param {number} [params.query] - 查询
 * @returns {Promise<any>} 笔记列表数据
 */
export const getNotes = (params = {}) => {
  return http.get('/notes/get', { params });
};

/**
 * 获取笔记标题列表
 * @param {Object} params - 查询参数
 * @param {number} [params.id] - 笔记 ID
 * @param {number} [params.page] - 页码
 * @param {number} [params.page_size] - 每页大小
 * @param {number} [params.article_id] - 文献 ID
 * @returns {Promise<any>} 笔记标题列表数据
 */
export const getNoteTitles = (params = {}) => {
  return http.get('/notes/title', { params });
};

/**
 * 创建笔记
 * @param {Object} data - 笔记数据
 * @param {number} data.article_id - 文献 ID
 * @param {string} data.content - 笔记内容
 * @param {string} data.title - 笔记标题
 * @returns {Promise<any>} 创建结果
 */
export const createNote = (data) => {
  return http.post('/notes/create', data);
};

/**
 * 更新笔记
 * @param {number|string} noteId - 笔记 ID
 * @param {Object} data - 更新数据
 * @param {string} [data.content] - 笔记内容
 * @param {string} [data.title] - 笔记标题
 * @returns {Promise<any>} 更新结果
 */
export const updateNote = (noteId, data) => {
  // 构建查询参数
  const params = {};
  if (data.content !== undefined) params.content = data.content;
  if (data.title !== undefined) params.title = data.title;
  
  return http.post(`/notes/${noteId}`, params);
};

/**
 * 删除笔记
 * @param {number|string} noteId - 笔记 ID
 * @returns {Promise<any>} 删除结果
 */
export const deleteNote = (noteId) => {
  return http.delete(`/notes/${noteId}`);
};

export default {
  getNotes,
  getNoteTitles,
  createNote,
  updateNote,
  deleteNote
};
