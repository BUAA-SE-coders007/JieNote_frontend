import http from '@/utils/http';

/**
 * 回收站相关 API
 */

/**
 * 获取回收站列表
 * @param {Object} params - 查询参数
 * @param {number} [params.page_number] - 页号
 * @param {number} [params.page_size] - 每页大小
 * @returns {Promise<any>} 回收站物品列表数据
 */
export const getRecycleBinItems = (params = {}) => {
  return http.get('/article/itemsInRecycleBin', { params });
};

/**
 * 永久删除回收站中的物品
 * @param {number} type - 物品类型 (1: folder, 2: article, 3: note)
 * @param {number} id - 物品 ID
 * @returns {Promise<any>} 删除结果
 */
export const deleteForever = (type, id) => {
  return http.delete('/article/deleteForever', { params: { type, id } });
};

/**
 * 从回收站恢复物品
 * @param {Object} data - 恢复参数
 * @param {number} data.type - 物品类型 (1: folder, 2: article, 3: note)
 * @param {number} data.id - 物品 ID
 * @returns {Promise<any>} 恢复结果，包含可能需要提示用户的信息
 */
export const recover = (data) => {
  return http.post('/article/recover', data);
};

export default {
  getRecycleBinItems,
  deleteForever,
  recover,
};