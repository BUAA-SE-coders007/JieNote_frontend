import http from '@/utils/http';

/**
 * Dashboard 相关 API
 */

/**
 * 为组织新建文件夹
 * @param {Object} data - 文件夹数据
 * @param {string} data.folder_name - 文件夹名称，不可为空串
 * @param {number} data.group_id - 组织ID
 * @returns {Promise<any>} 创建结果
 */
export const selfCreateFolder = (data) => {
    return http.post('/group/newFolder', data);
};

/**
 * 向组织文件夹上传文献
 * @param {number} folderId - 文件夹 ID
 * @param {FormData} formData - 文件数据
 * @returns {Promise<any>} 上传结果
 */
export const uploadToSelfFolder = (folderId, formData) => {
    return http.post(
        `/group/newArticle?folder_id=${folderId}`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
};

/**
 * 将文献转存到个人文件夹
 * @param {Object} params - 查询参数
 * @param {string} params.folder_id - 目标文件夹ID
 * @param {string} params.article_id - 文献ID
 * @param {boolean} params.is_group - 是否为群组文献（这里固定为true）
 * @returns {Promise<any>} 操作结果
 */
export const copyToPersonalFolder = (params) => {
    return http.put('/database/copy', null, { params })
}

/**
 * 将组织文献移到回收站
 * @param {number} articleId - 文献 ID
 * @returns {Promise<any>} 删除结果
 */
export const selfArticleToRecycleBin = (articleId) => {
    return http.delete(
        `/article/selfArticleToRecycleBin?article_id=${articleId}`
    );
};

/**
 * 将组织文件夹移到回收站
 * @param {number} folderId - 文件夹 ID
 * @returns {Promise<any>} 删除结果
 */
export const selfFolderToRecycleBin = (folderId) => {
    return http.delete(`/article/selfFolderToRecycleBin?folder_id=${folderId}`);
};

/**
 * 修改组织文件夹名字
 * @param {Object} data - 文件夹数据
 * @param {number} data.folder_id - 文件夹 ID
 * @param {string} data.folder_name - 新的文件夹名称
 * @returns {Promise<any>} 更新结果
 */
export const changeFolderName = (data) => {
    return http.post('/group/changeFolderName', data);
};

/**
 * 修改组织文献名字
 * @param {Object} data - 文献数据
 * @param {number} data.article_id - 文献 ID
 * @param {string} data.article_name - 新的文献名称
 * @returns {Promise<any>} 更新结果
 */
export const changeArticleName = (data) => {
    return http.post('/group/changeArticleName', data);
};


/**
 * 指定组织文献所有Tag及顺序
 * @param {Object} data - 标签数据
 * @param {number} data.article_id - 文献 ID
 * @param {string[]} data.tag_contents - 标签内容数组
 * @returns {Promise<any>} 更新结果
 */
export const allTagsOrder = (data) => {
    return http.post('/group/articleTags', data);
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
 * 获取组织文件树
 * @param {Object} params - 查询参数
 * @param {number} [params.page_number] - 页码
 * @param {number} params.group_id - 组织ID
 * @param {number} [params.page_size] - 每页大小
 * @returns {Promise<any>} 文件树数据
 */
export const getSelfTree = (params = {}) => {
    return http.get('/group/fileTree', { params });
};

export default {
    selfCreateFolder,
    uploadToSelfFolder,
    selfArticleToRecycleBin,
    selfFolderToRecycleBin,
    changeFolderName,
    changeArticleName,
    allTagsOrder,
    getArticleTags,
    getArticlesInFolder,
    readArticle,
    getSelfTree,
    copyToPersonalFolder
};
