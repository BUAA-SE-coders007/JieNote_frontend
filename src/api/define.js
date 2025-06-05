import http from '@/utils/http';

/**
 * 定义操作权限
 * @param {Object} data - 权限定义数据
 * @param {number} data.group_id - 组织ID
 * @param {number} data.user_id - 用户ID
 * @param {number} data.item_type - 实体类型 (2:article, 3:note)
 * @param {number} data.item_id - 实体ID
 * @param {number} data.permission - 权限级别 (0:不可见, 1:可查看, 2:可编辑)
 * @returns {Promise} 请求结果
 */
export const definePermission = (data) => {
    return http.post('/group/permissionDefine', data);
};

/**
 * 发起删除申请
 * @param {Object} data - 删除申请数据
 * @param {number} data.group_id - 组织ID
 * @param {number} data.item_type - 实体类型 (1:folder, 2:article, 3:note)
 * @param {number} data.item_id - 实体ID
 * @returns {Promise} 请求结果
 */
export const applyToDelete = (data) => {
    return http.post('/group/applyToDelete', data);
};

/**
 * 获取所有删除申请
 * @param {number} groupId - 组织ID
 * @returns {Promise} 删除申请列表
 */
export const getAllDeleteApplications = (groupId) => {
    return http.get('/group/allDeleteApplications', {
        params: { group_id: groupId }
    });
};

/**
 * 回应删除申请
 * @param {Object} data - 回应数据
 * @param {number} data.item_type - 实体类型 (1:folder, 2:article, 3:note)
 * @param {number} data.item_id - 实体ID
 * @param {boolean} data.agree - 是否同意
 * @returns {Promise} 请求结果
 */
export const replyToDelete = (data) => {
    return http.post('/group/replyToDelete', data);
};

/**
 * 彻底删除实体
 * @param {Object} data - 删除数据
 * @param {number} data.item_type - 实体类型 (1:folder, 2:article, 3:note)
 * @param {number} data.item_id - 实体ID
 * @returns {Promise} 请求结果
 */
export const deleteItemPermanently = (data) => {
    return http.delete('/group/delete', { data });
};

/**
 * 获取实体权限定义
 * @param {Object} params - 查询参数
 * @param {number} params.group_id - 组织ID
 * @param {number} params.item_type - 实体类型 (2:article, 3:note)
 * @param {number} params.item_id - 实体ID
 * @returns {Promise} 权限定义数据
 */
export const getPermissions = (params) => {
    return http.get('/group/getPermissions', { params });
};

/**
 * 检查笔记是否可编辑
 * @param {number} noteId - 笔记ID
 * @returns {Promise} 可编辑状态
 */
export const checkNoteEditable = (noteId) => {
    return http.get('/group/ifEditNote', {
        params: { note_id: noteId }
    });
};

export default {
    definePermission,
    applyToDelete,
    getAllDeleteApplications,
    replyToDelete,
    deleteItemPermanently,
    getPermissions,
    checkNoteEditable
};