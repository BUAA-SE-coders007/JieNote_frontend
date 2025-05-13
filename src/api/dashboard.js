import http from '@/utils/http';

/**
 * Dashboard 相关 API
 */

/**
 * 获取个人所有文件夹
 * @param {Object} params - 查询参数
 * @param {number} [params.page_number] - 页码，从1开始
 * @param {number} [params.page_size] - 每页大小
 * @returns {Promise<any>} 文件夹列表数据
 */
export const getSelfFolders = (params = {}) => {
  return http.get('/article/getSelfFolders', { params });
};

/**
 * 为个人新建文件夹
 * @param {Object} data - 文件夹数据
 * @param {string} data.folder_name - 文件夹名称，不可为空串
 * @returns {Promise<any>} 创建结果
 */
export const selfCreateFolder = (data) => {
  return http.post('/article/selfCreateFolder', data);
};

/**
 * 向个人文件夹上传文献
 * @param {number} folderId - 文件夹 ID
 * @param {FormData} formData - 文件数据
 * @returns {Promise<any>} 上传结果
 */
export const uploadToSelfFolder = (folderId, formData) => {
  return http.post(
    `/article/uploadToSelfFolder?folder_id=${folderId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};

/**
 * 将个人文献移到回收站
 * @param {number} articleId - 文献 ID
 * @returns {Promise<any>} 删除结果
 */
export const selfArticleToRecycleBin = (articleId) => {
  return http.delete(
    `/article/selfArticleToRecycleBin?article_id=${articleId}`
  );
};

/**
 * 将个人文件夹移到回收站
 * @param {number} folderId - 文件夹 ID
 * @returns {Promise<any>} 删除结果
 */
export const selfFolderToRecycleBin = (folderId) => {
  return http.delete(`/article/selfFolderToRecycleBin?folder_id=${folderId}`);
};

/**
 * 修改个人文件夹名字
 * @param {Object} data - 文件夹数据
 * @param {number} data.folder_id - 文件夹 ID
 * @param {string} data.folder_name - 新的文件夹名称
 * @returns {Promise<any>} 更新结果
 */
export const changeFolderName = (data) => {
  return http.post('/article/changeFolderName', data);
};

/**
 * 修改个人文献名字
 * @param {Object} data - 文献数据
 * @param {number} data.article_id - 文献 ID
 * @param {string} data.article_name - 新的文献名称
 * @returns {Promise<any>} 更新结果
 */
export const changeArticleName = (data) => {
  return http.post('/article/changeArticleName', data);
};

/**
 * 给个人文献打一个Tag
 * @param {Object} data - 标签数据
 * @param {number} data.article_id - 文献 ID
 * @param {string} data.content - 标签内容
 * @returns {Promise<any>} 创建结果
 */
export const createTag = (data) => {
  return http.post('/article/createTag', data);
};

/**
 * 删除个人文献Tag
 * @param {number} tagId - 标签 ID
 * @returns {Promise<any>} 删除结果
 */
export const deleteTag = (tagId) => {
  return http.delete(`/article/deleteTag?tag_id=${tagId}`);
};

/**
 * 指定个人文献所有Tag及顺序
 * @param {Object} data - 标签数据
 * @param {number} data.article_id - 文献 ID
 * @param {string[]} data.tag_contents - 标签内容数组
 * @returns {Promise<any>} 更新结果
 */
export const allTagsOrder = (data) => {
  return http.post('/article/allTagsOrder', data);
};

/**
 * 获取文献的所有Tag
 * @param {number} articleId - 文献 ID
 * @returns {Promise<any>} 标签列表数据
 */
export const getArticleTags = (articleId) => {
  return http.get(`/article/getArticleTags?article_id=${articleId}`);
};

/**
 * 获取文件夹下的所有文献
 * @param {Object} params - 查询参数
 * @param {number} params.folder_id - 文件夹 ID
 * @param {number} [params.page_number] - 页码
 * @param {number} [params.page_size] - 每页大小
 * @returns {Promise<any>} 文献列表数据
 */
export const getArticlesInFolder = (params) => {
  return http.get('/article/getArticlesInFolder', { params });
};

/**
 * 阅读某篇文献
 * @param {number} articleId - 文献 ID
 * @returns {Promise<Blob>} PDF 文件 Blob
 */
export const readArticle = (articleId) => {
  return http.get(`/article/readArticle?article_id=${articleId}`, {
    responseType: 'blob', // Important for file download
  });
};

/**
 * 获取个人文件树
 * @param {Object} params - 查询参数
 * @param {number} [params.page_number] - 页码
 * @param {number} [params.page_size] - 每页大小
 * @returns {Promise<any>} 文件树数据
 */
export const getSelfTree = (params = {}) => {
  return http.get('/article/selfTree', { params });
};

export default {
  getSelfFolders,
  selfCreateFolder,
  uploadToSelfFolder,
  selfArticleToRecycleBin,
  selfFolderToRecycleBin,
  changeFolderName,
  changeArticleName,
  createTag,
  deleteTag,
  allTagsOrder,
  getArticleTags,
  getArticlesInFolder,
  readArticle,
  getSelfTree,
};
