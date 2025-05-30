import http from '@/utils/http';

/**
 * 组织管理相关 API
 */

/**
 * 生成组织邀请码
 * @param {Object} params - 查询参数
 * @param {string} params.user_email - 用户邮箱
 * @param {number} params.group_id - 组织ID
 * @returns {Promise<any>} 包含邀请码的响应
 */
export const genGroupInviteCode = (params) => {
    return http.get('/group/genInviteCode', { params });
};

/**
 * 修改组织基本信息
 * @param {FormData} data - 表单数据
 * @param {number} data.group_id - 组织ID
 * @param {string} [data.group_name] - 组织名称（可选）
 * @param {string} [data.group_desc] - 组织描述（可选）
 * @param {File} [data.group_avatar] - 组织头像文件（可选）
 * @returns {Promise<any>} 操作结果
 */
export const modifyGroupBasicInfo = (params, file) => {
    const formData = new FormData();
    if (file) formData.append('group_avatar', file);

    return http.post('/group/modifyBasicInfo', formData, {
        params: {
            group_id: params.group_id,
            group_name: params.group_name,
            group_desc: params.group_desc
        },
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

/**
 * 管理管理员列表
 * @param {Object} data - 请求体数据
 * @param {number} data.group_id - 组织ID
 * @param {number} data.user_id - 用户ID
 * @param {boolean} data.add_admin - 是否添加管理员
 * @returns {Promise<any>} 操作结果
 */
export const modifyAdminList = (data) => {
    return http.post('/group/modifyAdminList', data);
};

/**
 * 踢出组织成员
 * @param {Object} data - 请求体数据
 * @param {number} data.group_id - 组织ID
 * @param {number} data.user_id - 用户ID
 * @returns {Promise<any>} 操作结果
 */
export const removeGroupMember = (data) => {
    return http.post('/group/removeMember', data);
};

/**
 * 退出组织
 * @param {Object} data - 请求体数据
 * @param {number} data.group_id - 组织ID
 * @returns {Promise<any>} 操作结果
 */
export const leaveGroup = (data) => {
    return http.post('/group/leaveGroup', data);
};

/**
 * 解散组织
 * @param {Object} params - 请求体数据
 * @param {number} params.group_id - 组织ID
 * @returns {Promise<any>} 操作结果
 */
export const dibandMyGroup = (params) => {
    return http.delete('/group/disband', {params});
};

/**
 * 获取组织基本信息
 * @param {Object} params - 查询参数
 * @param {String} params.group_id - 组织ID
 * @returns {Promise<any>} 组织基本信息
 */
export const getGroupBasicInfo = (params) => {
    return http.get('/group/getBasicInfo', { params });
};

/**
 * 获取组织人员信息
 * @param {Object} params - 查询参数
 * @param {number} params.group_id - 组织ID
 * @returns {Promise<any>} 人员结构数据
 */
export const getGroupPeopleInfo = (params) => {
    return http.get('/group/getPeopleInfo', { params });
};

/**
 * 获取用户组织等级
 * @param {Object} [params] - 可选查询参数
 * @param {number} [params.group_id] - 组织ID
 * @returns {Promise<any>} 用户等级数据
 */
export const getMyGroupLevel = (params = {}) => {
    return http.get('/group/getMyLevel', { params });
};

/**
 * 获取用户所有组织
 * @returns {Promise<any>} 组织分类列表
 */
export const getAllGroups = () => {
    return http.get('/group/allGroups');
};

/**
 * 组织文献管理相关 API
 */

/**
 * 新建文件夹
 * @param {Object} data - 请求体数据
 * @param {number} data.group_id - 组织ID
 * @param {string} data.folder_name - 文件夹名称
 * @returns {Promise<any>} 操作结果
 */
export const createGroupFolder = (data) => {
    return http.post('/group/newFolder', data);
};

/**
 * 上传组织文献
 * @param {Object} config - 上传配置
 * @param {number} config.group_id - 组织ID
 * @param {number} [config.folder_id] - 文件夹ID（可选）
 * @param {File} file - 文献文件
 * @returns {Promise<any>} 上传结果
 */
export const uploadGroupArticle = ({ group_id, folder_id }, file) => {
    const formData = new FormData();
    formData.append('article', file);

    return http.post('/group/newArticle', formData, {
        params: { group_id, folder_id },
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

/**
 * 设置文献标签顺序
 * @param {Object} data - 请求体数据
 * @param {number} data.article_id - 文献ID
 * @param {string[]} data.tag_contents - 标签内容数组
 * @returns {Promise<any>} 操作结果
 */
export const setArticleTagsOrder = (data) => {
    return http.post('/group/articleTags', data);
};

/**
 * 上传组织笔记
 * @param {Object} data - 请求体数据
 * @param {number} data.article_id - 文献ID
 * @param {string} data.title - 笔记标题
 * @param {string} data.content - 笔记内容
 * @returns {Promise<any>} 操作结果
 */
export const createGroupNote = (data) => {
    return http.post('/group/newNote', data);
};

/**
 * 获取组织文件树
 * @param {Object} params - 查询参数
 * @param {number} params.group_id - 组织ID
 * @param {number} [params.page_number] - 页码
 * @param {number} [params.page_size] - 每页大小
 * @returns {Promise<any>} 文件树结构
 */
export const getGroupFileTree = (params) => {
    return http.get('/group/fileTree', { params });
};

export default {
    genGroupInviteCode,
    modifyGroupBasicInfo,
    modifyAdminList,
    removeGroupMember,
    leaveGroup,
    getGroupBasicInfo,
    getGroupPeopleInfo,
    getMyGroupLevel,
    getAllGroups,
    createGroupFolder,
    uploadGroupArticle,
    setArticleTagsOrder,
    createGroupNote,
    getGroupFileTree
};