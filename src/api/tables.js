import http from '@/utils/http';

/**
 * Tables 相关 API
 */


/**
 * 创建组织
 * @param {Object} data - 组织数据
 * @param {string} data.group_name - 组织名称
 * @param {string} data.group_desc - 组织描述
 * @param {string} data.group_avatar - 组织头像
 * @returns {Promise<any>} 组织数据
 */
export const createOrg = (data) => {
  const formData = new FormData();
  if (data instanceof FormData) {
    // 如果传入的是 FormData，获取文件
    const file = data.get('group_avatar');
    if (file) {
      formData.append('group_avatar', file);
    }
  }

  return http.post(
    `/group/create?group_name=${encodeURIComponent(data.get('group_name'))}&group_desc=${encodeURIComponent(data.get('group_desc'))}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
};


/**
 * 获取自己的所有组织
 * @returns {Promise<any>} 组织列表
 */
export const getAllOrgs = () => {
  return http.get('/group/allGroups');
}


/**
 * 获取组织成员信息
 * @param {string} group_id - 组织 ID
 * @returns {Promise<any>} 组织成员信息
 */
export const getOrgMembers = (group_id) => {
  return http.get('/group/getPeopleInfo?group_id=' + group_id);
}

/**
 * 获取组织日志
 * @param {string} group_id - 组织 ID
 * @returns {Promise<any>} 组织日志
 */
export const getOrgLogs = (group_id) => {
  return http.get('/group/logs?group_id=' + group_id);
}



/**
 * 用邀请码加入组织
 * @param {string} inviteCode - 邀请码
 * @returns {Promise<any>} 组织信息
 */
export const joinOrgByInviteCode = (inviteCode) => {
    return http.post(
        '/group/enterGroup',
        { inviteCode: inviteCode },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
}




export default {
    createOrg,
    getAllOrgs,
    getOrgMembers,
    getOrgLogs,
    joinOrgByInviteCode,
};
