import http from '@/utils/http'

/**
 * 统一的笔记 API 类
 * 处理个人笔记和组织笔记的所有操作
 */
class NoteAPI {
  /**
   * 创建笔记
   * @param {Object} params 笔记参数
   * @param {number} params.article_id 所属文献ID 
   * @param {string} params.content 笔记内容
   * @param {string} params.title 笔记标题
   * @param {boolean} [params.isGroup] 是否是组织笔记
   * @returns {Promise} 返回创建结果
   */
  static async createNote(params) {
    const { isGroup, ...noteData } = params
    if (isGroup) {
      return http.post('/group/newNote', noteData)
    } else {
      return http.post('/notes/create', noteData)
    }
  }

  /**
   * 更新笔记
   * @param {Object} params 更新参数
   * @param {number|string} params.note_id 笔记ID
   * @param {string} [params.content] 笔记内容(可选)
   * @param {string} [params.title] 笔记标题(可选)
   * @param {boolean} [params.isGroup] 是否是组织笔记
   * @returns {Promise} 返回更新结果
   */
  static async updateNote(params) {
    const { isGroup, note_id, content, title } = params
    if (isGroup) {
      return http.post('/group/changeNote', {
        note_id,
        note_title: title,
        note_content: content
      })
    } else {
      return http.put(`/notes/${note_id}`, null, {
        params: {
          content,
          title
        }
      })
    }
  }

  /**
   * 删除笔记
   * @param {Object} params 删除参数
   * @param {number|string} params.note_id 笔记ID
   * @param {boolean} [params.isGroup] 是否是组织笔记
   * @returns {Promise} 返回删除结果
   */
  static async deleteNote(params) {
    const { note_id } = params
    // 目前两种笔记都使用相同的删除接口，如果将来接口分开，可以通过 isGroup 判断
    return http.delete(`/notes/${note_id}`)
  }

  /**
   * 获取笔记列表
   * @param {Object} params 查询参数
   * @param {number} [params.id] 指定笔记ID(可选)
   * @param {number} [params.article_id] 指定文献ID(可选)
   * @param {number} [params.page] 页码(可选)
   * @param {number} [params.page_size] 每页数量(可选)
   * @param {string} [params.query] 搜索关键词(可选)
   * @param {boolean} [params.isGroup] 是否获取组织笔记
   * @returns {Promise} 返回笔记列表数据
   */
  static async getNotes(params) {
    const { ...queryParams } = params
    // 目前个人笔记和组织笔记使用相同的获取接口，如果将来接口分开，可以通过 isGroup 判断
    return http.get('/notes/get', { params: queryParams })
  }

  /**
   * 获取笔记标题列表
   * @param {Object} params 查询参数
   * @param {number} [params.id] 指定笔记ID(可选)
   * @param {number} [params.article_id] 指定文献ID(可选)
   * @param {number} [params.page] 页码(可选)
   * @param {number} [params.page_size] 每页数量(可选)
   * @param {boolean} [params.isGroup] 是否获取组织笔记
   * @returns {Promise} 返回笔记标题列表
   */
  static async getNoteTitles(params) {
    const { ...queryParams } = params
    // 目前个人笔记和组织笔记使用相同的获取接口，如果将来接口分开，可以通过 isGroup 判断
    return http.get('/notes/title', { params: queryParams })
  }

  /**
   * 检查组织笔记编辑权限
   * @param {number|string} noteId 笔记ID
   * @returns {Promise<boolean>} 是否有编辑权限
   */
  static async checkGroupNoteEditPermission(noteId) {
    const response = await http.get('/group/ifEditNote', {
      params: { note_id: noteId }
    })
    return response.editable
  }
}

export default NoteAPI