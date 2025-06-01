import http from '@/utils/http';

/**
 * 笔记相关 API
/**
 * 创建笔记
 * @param {Object} data - 笔记数据
 * @param {number} data.article_id - 文献 ID
 * @param {string} data.content - 笔记内容
 * @param {string} data.title - 笔记标题
 * @returns {Promise<any>} 创建结果
 */
export const createNote = (data) => {
    return http.post('/group/newNote', data);
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
    params.note_id = noteId;
    if (data.content !== undefined) params.note_content = data.content;
    if (data.title !== undefined) params.note_title = data.title;
    console.log(params);

    return http.post(`/group/changeNote`, params);
};

/**
 * 删除笔记
 * @param {number|string} noteId - 笔记 ID
 * @returns {Promise<any>} 删除结果
 */
export const deleteNote = (noteId) => {
    return http.delete(`/notes/${noteId}`);
};

/**
 * 获取笔记编辑权限
 * @param {number|string} noteId - 笔记 ID
 * @returns {Promise<any>} 编辑权限结果
 */
export const getEditPermission = (noteId) => {
    return http.get('/group/ifEditNote', { params: { note_id: noteId } });
};

export default {
  createNote,
  updateNote,
  deleteNote,
  getEditPermission,
};

