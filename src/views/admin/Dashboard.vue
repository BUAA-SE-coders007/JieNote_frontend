<template>
  <div class="flex flex-col h-screen">
    <!-- 顶部导航栏 -->
    <nav class="relative flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-emerald-500">
      <div class="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div class="w-full relative flex justify-between lg:w-auto px-4 lg:static lg:block lg:justify-start">
          <a class="text-lg font-bold leading-relaxed inline-block mr-4 py-2 whitespace-no-wrap uppercase text-white" href="#pablo">
            文献管理
          </a>
          <button class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none" type="button">
            <span class="block relative w-6 h-px rounded-sm bg-white"></span>
            <span class="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
            <span class="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
          </button>
        </div>
        <div class="lg:flex flex-grow items-center">
          <ul class="flex flex-col lg:flex-row list-none ml-auto">
            <li class="nav-item">
              <a class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                 href="javascript:;"
                 @click="handleExport">
                <i class="fas fa-download text-lg leading-lg text-white opacity-75"></i><span class="ml-2">导出</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                 href="javascript:;"
                 @click="createNewCategory">
                <i class="fas fa-plus text-lg leading-lg text-white opacity-75"></i><span class="ml-2">新建</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                 href="javascript:;"
                 @click="handleShowGraph">
                <i class="fas fa-project-diagram text-lg leading-lg text-white opacity-75"></i>
                <span class="ml-2">知识图谱</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                 href="javascript:;"
                 @click="toggleCheckbox">
                <i class="fas fa-check-square text-lg leading-lg text-white opacity-75"></i>
                <span class="ml-2">{{ showCheckbox ? "取消选择" : "批量选择" }}</span>
              </a>
            </li>
<!--            <li class="nav-item">-->
<!--              <a class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75" href="#pablo" @click="refreshToken">-->
<!--                <i class="fas fa-user text-lg leading-lg text-white opacity-75"></i><span class="ml-2">用户</span>-->
<!--              </a>-->
<!--            </li>-->
          </ul>
        </div>
      </div>
    </nav>

    <!-- 知识图谱弹窗 -->
    <el-dialog
        v-model="showGraph"
        title="知识图谱"
        width="90%"
        top="5vh"
        custom-class="graph-modal"
        :close-on-click-modal="false"
        :destroy-on-close="false"
    >
      <KnowledgeGraph :treeData="graphTreeData" />
      <template #footer>
        <span class="dialog-footer">
          <el-button
              type="primary"
              @click="showGraph = false"
              class="modal-close-btn"
              size="medium"
          >
            <i class="fas fa-times-circle mr-2"></i>关闭视图
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新建分类弹窗 -->
    <el-dialog
        v-model="showNewCategoryDialog"
        title="新建分类"
        width="30%"
        :close-on-click-modal="false"
        custom-class="new-category-modal"
        :destroy-on-close="true"
    >
      <el-form :model="newCategoryForm" label-width="80px">
        <el-form-item label="分类名称">
          <el-input
              v-model="newCategoryForm.name"
              placeholder="请输入分类名称"
              class="category-input"
              :maxlength="20"
              show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
              @click="showNewCategoryDialog = false"
              class="modal-cancel-btn"
          >取消</el-button>
          <el-button
              type="primary"
              @click="confirmNewCategory"
              class="modal-confirm-btn"
          >确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新建笔记弹窗 -->
    <el-dialog
        v-model="showNewNoteDialog"
        title="新建笔记"
        width="30%"
        :close-on-click-modal="false"
        custom-class="new-note-modal"
        :destroy-on-close="true"
    >
      <el-form :model="newNoteForm" label-width="80px">
        <el-form-item label="笔记名称">
          <el-input
              v-model="newNoteForm.name"
              placeholder="请输入笔记名称"
              class="note-input"
              :maxlength="20"
              show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
              @click="showNewNoteDialog = false"
              class="modal-cancel-btn"
          >取消</el-button>
          <el-button
              type="primary"
              @click="confirmNewNote"
              class="modal-confirm-btn"
          >确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- PDF上传弹窗 -->
    <el-dialog
        v-model="showPdfUploadDialog"
        title="上传PDF文件"
        width="40%"
        :close-on-click-modal="false"
        custom-class="pdf-upload-modal"
        :destroy-on-close="true"
    >
      <el-form :model="pdfUploadForm" label-width="80px">
        <el-form-item label="PDF文件">
          <el-upload
              class="pdf-uploader"
              action="#"
              :auto-upload="false"
              :on-change="handlePdfFileChange"
              :limit="1"
              accept=".pdf"
          >
            <template #trigger>
              <el-button type="primary" class="upload-btn">选择文件</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">
                请选择PDF文件，文件名将作为节点名称
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
              @click="showPdfUploadDialog = false"
              class="modal-cancel-btn"
          >取消</el-button>
          <el-button
              type="primary"
              @click="confirmPdfUpload"
              class="modal-confirm-btn"
              :disabled="!pdfUploadForm.file"
          >上传</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 主要内容区域 -->
    <div class="flex-1 overflow-y-auto bg-gray-100">
      <div class="container-fluid px-4 py-4">
        <div class="bg-white rounded-lg shadow p-4">
          <div v-if="isLoading" class="loading-wrapper">
            <div class="loading-content">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span class="loading-text">正在加载知识库结构...</span>
            </div>
          </div>
          <div v-if="!isLoading" class="tree-container">
            <el-tree
                @node-expand="handleNodeExpand"
                @node-collapse="handleNodeCollapse"
                class="modern-tree"
                :data="dataSource"
                :check-strictly="true"
                draggable
                :show-checkbox="showCheckbox"
                node-key="id"
                :default-expanded-keys="[...expandedKeys]"
                :expand-on-click-node="false"
                ref="treeRef"
            >
              <template #default="{ node, data }">
                <div class="modern-node">
                  <span class="node-label">{{ getIconForNode(data) }} {{ data.label }}</span>
                  <div class="tag-container" v-if="data.depth === 1">
                    <el-tooltip
                        v-for="(tag, index) in data.tags.slice(0,3)"
                        :key="index"
                        placement="top"
                        :disabled="!isTruncated(tag.tag_content)"
                        manual
                        v-model="tag.showFullText"
                    >
                      <template #content>
                        <div class="full-tag-content">{{ tag.tag_content }}</div>
                      </template>
                      <el-tag
                          size="small"
                          type="info"
                          class="tag-item"
                          @click="toggleTagTooltip(tag)"
                      >
                        {{ truncateText(tag.tag_content) }}
                      </el-tag>
                    </el-tooltip>
                  </div>
                  <div class="node-actions">
                    <!-- 只在前两级展示添加按钮 -->
                    <el-tooltip content="编辑信息" placement="top" :enterable="false" :duration="50">
                      <el-button
                          type="warning"
                          size="small"
                          round
                          @click.stop="openEditDialog(node, data)"
                          class="action-btn edit-btn"
                      >
                        <el-icon><Edit /></el-icon>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip v-if="node.level <2" content="添加文献" placement="top" :enterable="false" :duration="50">
                      <el-button
                          type="primary"
                          size="small"
                          round
                          @click.stop="append(node, data)"
                          class="action-btn add-btn"
                      >
                        <el-icon><DocumentAdd /></el-icon>
                      </el-button>
                    </el-tooltip>

                    <el-tooltip v-if="node.level === 2" content="添加笔记" placement="top" :enterable="false" :duration="50">
                      <el-button
                          type="primary"
                          size="small"
                          round
                          @click.stop="append(node, data)"
                          class="action-btn add-btn"
                      >
                        <el-icon><DocumentAdd /></el-icon>
                      </el-button>
                    </el-tooltip>

                    <el-tooltip content="删除" placement="top" :enterable="false" :duration="50">
                      <el-button
                          type="danger"
                          size="small"
                          round
                          @click.stop="remove(node, data)"
                          class="action-btn delete-btn"
                      >
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </el-tooltip>
                    <el-tooltip v-if="node.level === 2" content="阅读" placement="top" :enterable="false" :duration="50">
                      <el-button
                          type="success"
                          size="small"
                          round
                          @click.stop="handleRead(node, data)"
                          class="action-btn read-btn"
                      >
                        <el-icon><Management /></el-icon>
                      </el-button>
                    </el-tooltip>
                  </div>
                </div>
              </template>
            </el-tree>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isLoading" class="pagination-container mt-4 flex justify-between items-center">
      <div class="page-size-selector">
        <span class="text-sm text-gray-600 mr-2">每页显示：</span>
        <el-select
            v-model="pageSize"
            @change="handlePageSizeChange"
            size="small"
            style="width: 100px"
        >
          <el-option
              v-for="size in [5, 10, 15, 20]"
              :key="size"
              :label="size"
              :value="size"
          />
        </el-select>
        <span class="text-sm text-gray-600 mr-2"> 文件夹</span>
      </div>

      <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="totalFolders"
          :current-page="currentPage"
          @current-change="handlePageChange"
      />
    </div>
    <el-dialog
        v-model="showEditDialog"
        :title="`编辑 ${currentEditNode?.label}`"
        width="500px"
        :close-on-click-modal="false"
    >
      <el-form label-width="80px">
        <!-- 名称编辑 -->
        <el-form-item label="名称">
          <el-input v-model="currentEditNode.label" />
        </el-form-item>

        <!-- 标签管理（仅depth=1显示） -->
        <el-form-item v-if="currentEditNode?.depth === 1" label="标签管理">
          <div class="tag-manager">
            <div class="tag-list">
              <transition-group name="tag-list">
                <draggable
                    v-model="currentEditNode.tags"
                    item-key="tag_id"
                    handle=".drag-handle"
                    @end="onTagDragEnd"
                >
                  <template #item="{element, index}">
                    <div class="tag-item" :key="element.tag_id || index">
                      <el-icon class="drag-handle"><Rank /></el-icon>
                      <el-tag
                          closable
                          @close="removeTag(index)"
                      >
                        {{ element.tag_content }}
                      </el-tag>
                    </div>
                  </template>
                </draggable>
              </transition-group>
            </div>

            <!-- 添加新标签 -->
            <div class="add-tag">
              <el-input
                  v-model="newTag"
                  placeholder="输入新标签"
                  size="small"
                  style="width: 120px"
                  @keyup.enter="addTag"
              />
              <el-button
                  type="primary"
                  size="small"
                  @click="addTag"
              >
                添加
              </el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, nextTick, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import { Edit, DocumentAdd, Delete,Management,Rank  } from '@element-plus/icons-vue'
import KnowledgeGraph from '/src/components/Tree/KnowledgeGraph.vue'
import JSZip from 'jszip'
import draggable from 'vuedraggable'
import {ElMessage, ElMessageBox} from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import axios from "axios";
import { onUnmounted } from 'vue'

export default {
  name: "dashboard-page",
  components: {
    Edit,
    DocumentAdd,
    Delete,
    KnowledgeGraph,
    Management,
    Loading,
    draggable,
    Rank
  },


  setup() {
    const router = useRouter()

    const showNewNoteDialog = ref(false)
    const newNoteForm = ref({
      name: '',
      parentNode: null,
      parentData: null
    })

    const defaultExpandedKeys = ref([])

    const currentPage = ref(1)
    const pageSize = ref(5)
    const totalFolders = ref(10)

    const setInitialExpandedKeys = () => {
      // 获取一级分类的ID
      const firstLevelIds = dataSource.value.map(item => item.id)
      console.log('this is expand-id')

      // 同步到 expandedKeys，用于 icon 判断
      expandedKeys.value = new Set(firstLevelIds)
      console.log(expandedKeys)
    }
    const expandedKeys = ref(new Set())
    let id = 0
    const isLoading = ref(true)
    const showCheckbox = ref(false)
    const showGraph = ref(false)
    const treeRef = ref(null)
    const showNewCategoryDialog = ref(false)
    const newCategoryForm = ref({
      name: ''
    })
    const showSearchInput = ref(false)
    const searchQuery = ref('')
    const graphTreeData = ref([]) // 新增图谱数据

    // PDF上传相关
    const showPdfUploadDialog = ref(false)
    const pdfUploadForm = ref({
      file: null,
      parentNode: null,
      parentData: null
    })


    const showEditDialog = ref(false)
    const currentEditNode = ref(null)
    const newTag = ref('')

    // 打开编辑弹窗
    const openEditDialog = (node, data) => {
      currentEditNode.value = {
        ...data,
        tags: [...(data.tags || [])] // 深度拷贝标签数组
      }
      showEditDialog.value = true
    }

    // 添加标签
    const addTag = async () => {
      if (newTag.value.trim()) {
        currentEditNode.value.tags.push({
          tag_id: Date.now(), // 临时ID
          tag_content: newTag.value.trim()
        })
        //向后端发送请求
        const tagdata =  {
          article_id: currentEditNode.value.true_id,
          content: newTag.value.trim()
        }
        const res = await fetch(`http://43.143.228.56:8000/article/createTag`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify(tagdata)
        })

        if (res.ok) {
          ElMessage.success('标签添加成功')
        } else {
          ElMessage.error('标签添加失败')
        }
        newTag.value = ''
      }
    }

    // 删除标签
    const removeTag = async (index) => {
      //向后端发送请求
      const res = await fetch(`http://43.143.228.56:8000/article/deleteTag?tag_id=${currentEditNode.value.tags[index].tag_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
      })
      if (res.ok) {
        currentEditNode.value.tags.splice(index, 1)
        ElMessage.success('标签删除成功')
      } else {
        ElMessage.error('标签删除失败')
      }
    }

    // 标签拖拽结束
    const onTagDragEnd = async () => {
      //向后端发送请求
      const tagdata =  {
        article_id: currentEditNode.value.true_id,
        tag_contents: currentEditNode.value.tags.map(tag => tag.tag_content)
      }
      console.log(tagdata.tag_contents)
      const res = await fetch(`http://43.143.228.56:8000/article/allTagsOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(tagdata)
      })
      if (res.ok) {
        ElMessage.success('标签顺序已更新')
      } else {
        ElMessage.error('标签顺序更新失败')
      }
    }

    // 保存修改
    const saveEdit = async () => {
      try {

        if (currentEditNode.value.depth === 0) {
          // 更新节点名称
          const nodeData = {
            folder_id: currentEditNode.value.true_id,
            folder_name: currentEditNode.value.label
          }
          console.log('this is zheli')
          console.log(nodeData)
          const res = await fetch(`http://43.143.228.56:8000/article/changeFolderName`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(nodeData)
          })
          console.log(res)
          if (res.ok) {
            ElMessage.success('节点名称更新成功')
          } else {
            ElMessage.error('节点名称更新失败')
          }
        } else if (currentEditNode.value.depth === 1) {
          // 更新节点名称
          const nodeData = {
            article_id: currentEditNode.value.true_id,
            article_name: currentEditNode.value.label
          }
          const res = await fetch(`http://43.143.228.56:8000/article/changeArticleName`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(nodeData)
          })
          if (res.ok) {
            ElMessage.success('节点名称更新成功')
          } else {
            ElMessage.error('节点名称更新失败')
          }
          //await updateTags(currentEditNode.value.tags)
        } else if (currentEditNode.value.depth === 2) {
          // 更新节点名称
          let noteName = currentEditNode.value.label
          if (!noteName.endsWith('.md')) {
            noteName += '.md'
          }
          const res = await fetch(`http://43.143.228.56:8000/notes/${currentEditNode.value.true_id}?title=${noteName}`, {
            method: 'PUT',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
          })
          console.log(res)
          if (res.ok) {
            ElMessage.success('节点名称更新成功')
          } else {
            ElMessage.error('节点名称更新失败')
          }
        }

        // // 根据节点类型调用不同API
        // const apiUrl = currentEditNode.value.depth === 0
        //     ? '/api/updateFolder'
        //     : '/api/updateArticle'

        // // 更新标签
        // if (currentEditNode.value.depth === 1) {
        //   await updateTags(currentEditNode.value.true_id, currentEditNode.value.tags)
        // }

        // // 调用保存接口
        // await fetch(apiUrl, {
        //   method: 'PUT',
        //   body: JSON.stringify(nodeData)
        // })

        // 刷新数据，这个等会要保留
        await findAllfolders()
        ElMessage.success('保存成功')
        showEditDialog.value = false
      } catch (error) {
        ElMessage.error('保存失败: ' + error.message)
      }
    }

    const handleRead = (node, data) => {
      // 检查是否是文献节点
      console.log("handleRead, node.level:", node.level)
      if (node.level === 2 && data.depth === 1) {  // PDF nodes: level 2 in tree, depth 1 in data
        router.push(`/admin/notelayout?article_id=${data.true_id}`);
      } else {
        ElMessage.warning('只能阅读文献');
      }
    }

    // // 更新标签到后端
    // const updateTags = async () => {
    //   // const res = await fetch(`http://43.143.228.56:8000/article/allTagsOrder`, {
    //   //   method: 'POST',
    //   //   headers: {
    //   //     'Content-Type': 'application/json',
    //   //     'Authorization': 'Bearer ' + localStorage.getItem('token')
    //   //   },
    //   //   body: JSON.stringify(tags.map(t => t.tag_content))
    //   // })
    //   // if (res.ok) {
    //   //   ElMessage.success('标签更新成功')
    //   // } else {
    //   //   ElMessage.error('标签更新失败')
    //   // }
    //
    //   //向后端发送请求
    //   const tagdata =  {
    //     article_id: currentEditNode.value.true_id,
    //     tag_contents: currentEditNode.value.tags.map(tag => tag.tag_content)
    //   }
    //   console.log(tagdata.tag_contents)
    //   const res = await fetch(`http://43.143.228.56:8000/article/allTagsOrder`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': 'Bearer ' + localStorage.getItem('token')
    //     },
    //     body: JSON.stringify(tagdata)
    //   })
    //   if (res.ok) {
    //     //ElMessage.success('标签顺序已更新')
    //   } else {
    //     //ElMessage.error('标签顺序更新失败')
    //   }
    // }

    const toggleCheckbox = () => {
      showCheckbox.value = !showCheckbox.value
    }

    const buildGraphTree = (source, selectedIds) => {
      const selectedSet = new Set(selectedIds)

      const recursiveFilter = (node) => {
        let hasSelectedChild = false
        const children = []

        if (node.children) {
          node.children.forEach(child => {
            const filteredChild = recursiveFilter(child)
            if (filteredChild) {
              children.push(filteredChild)
              hasSelectedChild = true
            }
          })
        }

        if (selectedSet.has(node.id) || hasSelectedChild) {
          return {
            id: node.id,
            label: node.label,
            depth:node.depth,
            children: children.length ? children : undefined
          }
        }
        return null
      }

      return source
          .map(node => recursiveFilter(node))
          .filter(Boolean)
    }

    onMounted(async () => {
      try {
        await refreshToken() // ⚡️ 立刻执行第一次刷新
        // 启动定时刷新（后续每5分钟一次）
        startTokenRefresh()
        await findAllfolders()
        // 数据加载完成后设置默认展开
        setInitialExpandedKeys()
        //refreshToken() // 立即执行一次
        //setInterval(refreshToken, 4 * 60 * 1000) // 每4分钟执行一次
      } catch (error) {
        ElMessage.error('数据加载失败: ' + error.message)
      } finally {
        isLoading.value = false
      }
    })

    const truncateText = (text) => {
      return text.length > 10 ? text.slice(0, 10) + '...' : text
    }

    const isTruncated = (text) => {
      return text.length > 10
    }

    const toggleTagTooltip = (tag) => {
      if (isTruncated(tag.tag_content)) {
        tag.showFullText = !tag.showFullText
      }
    }




    const getIconForNode = (node) => {
      // 获取节点深度
      const depth = node.depth

      // 调试信息
      console.log(`Node: ${node.label}, ID: ${node.id}, Depth: ${node.depth}, Has children: ${node.children && node.children.length > 0}, Is expanded: ${expandedKeys.value.has(node.id)}`)

      // 根据节点深度和状态返回对应图标
      if (depth === 0) {
        // 一级分类
        if (expandedKeys.value.has(node.id)) {
          return '📂' // 展开的文件夹
        } else if (node.children && node.children.length > 0) {
          return '🗂️' // 有子节点但未展开的文件夹
        } else {
          return '📁' // 空文件夹
        }
      } else if (depth === 1) {
        // 二级 PDF
        if (node.children && node.children.length > 0) {
          return '📚' // 有笔记的 PDF
        } else {
          return '📖' // 无笔记的 PDF
        }
      } else if (depth === 2) {
        // 三级笔记
        return '📝' // 笔记
      } else {
        // 未知深度，根据节点类型返回默认图标
        if (node.children && node.children.length > 0) {
          return '📄' // 有子节点的文档
        } else {
          return '📄' // 普通文档
        }
      }
    }

    const handleNodeExpand = (data) => {
      expandedKeys.value.add(data.id)
    }
    const handleNodeCollapse = (data) => {
      expandedKeys.value.delete(data.id)
    }

    const handlePageChange = async (newPage) => {
      currentPage.value = newPage
      isLoading.value = true
      try {
        await findAllfolders()
        // 数据加载完成后设置默认展开
        setInitialExpandedKeys()
        console.log('this is first')
        console.log(expandedKeys)
      } catch (error) {
        ElMessage.error('数据加载失败: ' + error.message)
      } finally {
        isLoading.value = false
      }
    }

// 处理每页数量变化
    const handlePageSizeChange = async (newSize) => {
      pageSize.value = newSize
      currentPage.value = 1 // 重置到第一页
      isLoading.value = true
      try {
        await findAllfolders()
        // 数据加载完成后设置默认展开
        setInitialExpandedKeys()
      } catch (error) {
        ElMessage.error('数据加载失败: ' + error.message)
      } finally {
        isLoading.value = false
      }
    }




    const filterCheckedTreeNodes = (nodes, checkedKeys) => {
      const keySet = new Set(checkedKeys)

      const deepFilter = (node) => {
        if (!keySet.has(node.id)) return null

        const filtered = { ...node }
        if (filtered.children) {
          filtered.children = filtered.children
              .map(child => deepFilter(child))
              .filter(Boolean)
        }
        return filtered
      }

      return nodes
          .map(node => deepFilter(node))
          .filter(Boolean)
    }




    const handleShowGraph = () => {
      if (!showCheckbox.value) {
        showCheckbox.value = true
        ElMessage({
          message: '请选择要生成知识图谱的文件',
          type: 'info'
        })
      } else {
        const rawCheckedNodes = treeRef.value.getCheckedNodes(false, true)
        const checkedKeys = treeRef.value.getCheckedKeys(false)
        const checkedNodes = filterCheckedTreeNodes(rawCheckedNodes, checkedKeys)
        console.log(checkedNodes)
        if (checkedNodes.length === 0) {
          ElMessage({
            message: '请至少选择一个文件',
            type: 'warning'
          })
          return
        }
        nextTick(() => {
          graphTreeData.value = buildGraphTree(dataSource.value, checkedKeys)
          console.log(graphTreeData)
          showGraph.value = true
          showCheckbox.value = false
          treeRef.value.setCheckedKeys([])
        })
      }
    }

    const handleExport = () => {
      if (!showCheckbox.value) {
        showCheckbox.value = true
        ElMessage({
          message: '请选择要导出的文件',
          type: 'info'
        })
      } else {
        const rawCheckedNodes = treeRef.value.getCheckedNodes(false, true)
        const checkedKeys = treeRef.value.getCheckedKeys(false)
        const checkedNodes = filterCheckedTreeNodes(rawCheckedNodes, checkedKeys)
        console.log(checkedNodes)
        console.log(checkedKeys)
        if (checkedNodes.length === 0) {
          ElMessage({
            message: '请至少选择一个文件',
            type: 'warning'
          })
          return
        }
        exportSelectedFiles(checkedKeys).then(() => {
          // 导出成功后，关闭选择框并清空选择
          showCheckbox.value = false
          treeRef.value.setCheckedKeys([])
        })
      }
    }

    const exportSelectedFiles = async (selectedKeys) => {
      try {
        const selectedSet = new Set(selectedKeys.map(id => String(id)))
        const zip = new JSZip()

        // 递归构造选中结构，保留路径
        const buildSelectedTree = (nodes, path = []) => {
          const result = []

          for (const node of nodes) {
            const newPath = [...path, node.label]
            const isSelected = selectedSet.has(String(node.id))

            let children = []
            if (node.children) {
              children = buildSelectedTree(node.children, newPath)
            }

            if (isSelected || children.length > 0) {
              result.push({
                ...node,
                path: newPath,
                children
              })
            }
          }

          return result
        }

        const selectedTree = buildSelectedTree(dataSource.value)

        // 添加选中文件到 zip：只在第一级创建文件夹，所有文件直接放进去
        const addFilesToZip = async (nodes, zipRoot) => {
          // 收集所有需要处理的文件
          const filePromises = []

          nodes.forEach(level1Node => {
            const folder = zipRoot.folder(level1Node.label)

            // 第二层为 PDF
            level1Node.children?.forEach(level2Node => {
              if (selectedSet.has(String(level2Node.id))) {
                const fileName = level2Node.label.endsWith('.pdf') ? level2Node.label : `${level2Node.label}.pdf`
                // 将每个文件处理包装成 Promise
                filePromises.push(
                    (async () => {
                      try {
                        const res = await fetch(`http://43.143.228.56:8000/article/readArticle?article_id=${level2Node.true_id}`, {
                          headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                          }
                        });

                        if (res.ok) {
                          const blob = await res.blob();
                          folder.file(fileName, blob);
                          ElMessage({
                            message: `成功获取文件: ${fileName}`,
                            type: 'success'
                          });
                        } else {
                          console.error(`获取文件失败: ${fileName}`, res.status);
                          ElMessage({
                            message: `获取文件失败: ${fileName}`,
                            type: 'error'
                          });
                        }
                      } catch (error) {
                        console.error(`获取文件出错: ${fileName}`, error);
                        ElMessage({
                          message: `获取文件出错: ${fileName}`,
                          type: 'error'
                        });
                      }
                    })()
                );
              }

              // 第三层为 Markdown
              level2Node.children?.forEach(level3Node => {
                if (selectedSet.has(String(level3Node.id))) {
                  const baseName = level3Node.label.replace(/\.md$/, '')
                  const referenceName = level2Node.label.replace(/\.(pdf|md)$/, '')
                  const finalName = `${baseName}-${referenceName}.md`
                  folder.file(finalName, level3Node.content)
                }
              })
            })
          })

          // 等待所有文件处理完成
          await Promise.all(filePromises)
        }

        // 等待所有文件添加完成
        await addFilesToZip(selectedTree, zip)

        const content = await zip.generateAsync({ type: 'blob' })
        const url = URL.createObjectURL(content)
        const link = document.createElement('a')
        link.href = url
        link.download = '文献导出.zip'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        ElMessage.success('导出成功')
      } catch (error) {
        ElMessage.error('导出失败：' + error.message)
      }
    }



    const append = (node, data) => {
      if (node.parent.parent === null) {
        // 如果是一级分类，显示PDF上传弹窗
        pdfUploadForm.value = {
          file: null,
          parentNode: node,
          parentData: data
        }
        expandedKeys.value.add(data.id)
        showPdfUploadDialog.value = true
        return
      }

      if (node.level === 2) {
        // 如果是二级分类，显示新建笔记弹窗
        newNoteForm.value = {
          name: '',
          parentNode: node,
          parentData: data
        }
        expandedKeys.value.add(data.id)
        showNewNoteDialog.value = true
        return
      }

      // 如果不是一级分类，则按照原来的逻辑添加新节点
      const newChild = {
        id: id++,
        label: `新节点 ${id}`,
        depth: 2,
        children: []
      }
      if (!data.children) {
        data.children = []
      }
      data.children.push(newChild)
      expandedKeys.value.add(data.id)
      dataSource.value = [...dataSource.value]
    }


    const remove = async (node, data) => {
      // 显示确认弹窗
      await ElMessageBox.confirm(
          `确定要删除 "${data.label}" 吗？此操作不可恢复。`,
          '删除确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )

      // 用户点击确定后执行删除操作
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d) => d.id === data.id)
      children.splice(index, 1)
      dataSource.value = [...dataSource.value]


      // 判断节点类型
      if (parent.parent === null) {
        // 如果父节点的父节点是null，说明当前节点是一级分类
        const res = await fetch(`http://43.143.228.56:8000/article/selfFolderToRecycleBin?folder_id=${node.data.true_id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })
        if (!res.ok) {
          ElMessage({
            message: '删除文件夹失败',
            type: 'error'
          })
        } else {
          ElMessage({
            message: '删除成功',
            type: 'success'
          })
        }
        console.log(res);
      } else if (node.level === 2) {
        // 二级分类
        const res = await fetch(`http://43.143.228.56:8000/article/selfArticleToRecycleBin?article_id=${node.data.true_id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })
        if (!res.ok) {
          ElMessage({
            message: '删除文件失败',
            type: 'error'
          })
        } else {
          ElMessage({
            message: '删除成功',
            type: 'success'
          })
        }
        console.log(res);
      } else {
        //三级分类
        const res = await fetch(`http://43.143.228.56:8000/notes/${node.data.true_id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })

        console.log('this is res')
        console.log(res)
        if (!res.ok) {
          ElMessage({
            message: '删除文件失败',
            type: 'error'
          })
        } else {
          console.log('lklklk')
          ElMessage({
            message: '删除成功',
            type: 'success'
          })
        }
        console.log(res);

      }
    }

    const createNewCategory = () => {
      showNewCategoryDialog.value = true
      newCategoryForm.value.name = ''
    }

    const confirmNewCategory = async() => {
      if (!newCategoryForm.value.name.trim()) {
        ElMessage({
          message: '请输入分类名称',
          type: 'warning'
        })
        return
      }

      const newCategory = {
        id: id++,
        label: newCategoryForm.value.name,
        depth: 0,
        children: []
      }
      dataSource.value.push(newCategory)
      dataSource.value = [...dataSource.value]
      //新建文件夹的信息传回后端
      const newFolderData = {
        folder_name: newCategoryForm.value.name,
      }

      const res = await fetch("http://43.143.228.56:8000/article/selfCreateFolder", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(newFolderData)
      })
      console.log('新建文件夹信息')
      console.log(res);
      const data = await res.json();
      console.log(data);
      console.log(res.json());
      if (!res.ok) {
        ElMessage({
          message: '新建分类失败',
          type: 'error'
        })
      }
      showNewCategoryDialog.value = false
      ElMessage({
        message: '新建分类成功',
        type: 'success'
      })
    }

    const confirmNewNote = async () => {
      if (!newNoteForm.value.name.trim()) {
        ElMessage({
          message: '请输入笔记名称',
          type: 'warning'
        })
        return
      }

      try {
        // 确保笔记名称以.md结尾
        let noteName = newNoteForm.value.name.trim()
        if (!noteName.endsWith('.md')) {
          noteName += '.md'
        }

        // 创建新节点
        const newChild = {
          id: id++,
          label: noteName,
          depth:2,
          children: []
        }

        // 添加到父节点
        if (!newNoteForm.value.parentData.children) {
          newNoteForm.value.parentData.children = []
        }
        newNoteForm.value.parentData.children.push(newChild)
        dataSource.value = [...dataSource.value]



        // 创建笔记的信息传回后端
        const newNoteData = {
          title: noteName,
          article_id: newNoteForm.value.parentData.true_id,
          content: "<p> 12 <p>",
        }
        const res = await fetch("http://43.143.228.56:8000/notes", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify(newNoteData)
        })
        console.log('笔记信息')
        console.log(newNoteData)
        console.log('新建笔记信息')
        console.log(res);
        const data = await res.json();
        console.log(data);
        console.log(res.json());
        // 关闭弹窗
        showNewNoteDialog.value = false

        ElMessage({
          message: '笔记创建成功',
          type: 'success'
        })
      } catch (error) {
        console.error('创建笔记失败:', error)
        ElMessage({
          message: '创建笔记失败: ' + error.message,
          type: 'error'
        })
      }
    }

    const handleSearch = () => {
      // 搜索逻辑已经在 computed 中实现
    }

    const clearSearch = () => {
      searchQuery.value = ''
      showSearchInput.value = false
    }

    const dataSource = ref([])


    const fetchTags = async (articleId) => {
      try {
        const res = await fetch(`http://43.143.228.56:8000/article/getArticleTags?article_id=${articleId}`,{
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });
        const data = await res.json();
        return data.result || [];
      } catch (error) {
        console.error('获取标签失败:', error);
        return [];
      }
    };

    //这个是新写的

    const findAllfolders = async () => {
      try {
        id = 0
        console.log(localStorage.getItem('token'))
        console.log('拿一级目录');
        const url = new URL('http://43.143.228.56:8000/article/getSelfFolders', window.location.origin);
        url.searchParams.append('page_number', currentPage.value);
        url.searchParams.append('page_size', pageSize.value);
        const res = await fetch(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });
        const data = await res.json();
        console.log('this is folder-data')
        console.log(data)
        totalFolders.value = data.total_num
        console.log(totalFolders)

        const transformedData = [];
        // 使用Promise.all并行处理一级目录
        await Promise.all(data.result.map(async folder => {
          const firstLevel = {
            id: id++,
            true_id:folder.folder_id,
            label: folder.folder_name,
            depth: 0,
            children: []
          };

          // 获取二级目录
          const secondRes = await fetch(`http://43.143.228.56:8000/article/getArticlesInFolder?folder_id=${folder.folder_id}`, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          });
          const secondData = await secondRes.json();
          console.log('this is second-data')
          console.log(secondData.result)

          // 并行处理二级目录
          firstLevel.children = await Promise.all(secondData.result.map(async article => {
            const secondLevel = {
              id: id++,
              true_id:article.article_id,
              label: article.article_name,
              tags: await fetchTags(article.article_id),
              depth: 1,
              children: []
            };

            // 获取三级目录
            const thirdRes = await fetch(`http://43.143.228.56:8000/notes?article_id=${article.article_id}`, {
              type: 'GET',
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }
            });
            const thirdData = await thirdRes.json();
            console.log('this is third-data')
            console.log(thirdData)
            console.log(thirdData.notes)

            if (thirdData.notes?.length) {
              secondLevel.children = thirdData.notes.map(item => ({
                id: id++,
                true_id:item.id,
                label: item.title,
                depth: 2,
                content: item.content
              }));
            }
            return secondLevel;
          }));

          transformedData.push(firstLevel);
        }));

        dataSource.value = transformedData;
        console.log('数据转换完成:', transformedData);
      } catch (error) {
        console.error('数据加载失败:', error);
        throw error; // 抛出错误供外层捕获
      }
    };


    // 处理PDF文件选择
    const handlePdfFileChange = (file) => {
      pdfUploadForm.value.file = file.raw
    }

    // 确认PDF上传
    const confirmPdfUpload = async () => {
      if (!pdfUploadForm.value.file) {
        ElMessage({
          message: '请选择PDF文件',
          type: 'warning'
        })
        return
      }

      try {
        // 获取文件名（不包含扩展名）作为节点名称
        const fileName = pdfUploadForm.value.file.name.replace('.pdf', '')

        // 创建FormData对象用于上传文件
        const formData = new FormData()
        formData.append('article', pdfUploadForm.value.file)

        console.log('this is pdfUploadForm.value.parentNode')
        console.log(pdfUploadForm.value.parentNode)

        // 发送文件到后端
        const res = await fetch(`http://43.143.228.56:8000/article/uploadToSelfFolder?folder_id=${pdfUploadForm.value.parentNode.data.true_id}`, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: formData
        })

        if (!res.ok) {
          throw new Error('上传失败')
        }

        // 创建新节点
        const newChild = {
          id: pdfUploadForm.value.parentNode.id || id++,
          label: `${fileName}.pdf`,
          depth: 1,
          tags:[],
          children: []
        }

        // 添加到父节点
        if (!pdfUploadForm.value.parentData.children) {
          pdfUploadForm.value.parentData.children = []
        }
        pdfUploadForm.value.parentData.children.push(newChild)
        dataSource.value = [...dataSource.value]

        // 关闭弹窗
        showPdfUploadDialog.value = false

        ElMessage({
          message: 'PDF上传成功',
          type: 'success'
        })
      } catch (error) {
        console.error('上传PDF失败:', error)
        ElMessage({
          message: '上传PDF失败: ' + error.message,
          type: 'error'
        })
      }
    }



    const refreshToken = async () => {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        console.log("123e4e23424e2")
        console.log(typeof refreshToken)
        if (!refreshToken) {
          console.error("Refresh Token 不存在，请重新登录！");
          redirectToLogin();
          return;
        }

        // 调用刷新 Token 的接口
        const response = await axios.post(
            "http://43.143.228.56:8000/public/refresh",
            { refresh_token: refreshToken } // 传入 refresh_token
        );

        console.log(response)

        if (response.status === 200) {
          const {access_token} = response.data;

          console.log("Token 已刷新:", access_token);
          console.log(response.data);

          // 更新 localStorage 中的 Token
          localStorage.setItem("token", access_token);
        }
      } catch (error) {
        console.error("刷新 Token 失败，请重新刷新！");
      }
    }

    let refreshInterval = null;
    const startTokenRefresh = () => {
      if (refreshInterval) clearInterval(refreshInterval); // 清除旧定时器
      refreshInterval = setInterval(refreshToken, 5 * 60 * 1000);
    };

    onUnmounted(() => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        console.log('定时器已清除');
      }
    });


// 跳转登录页（通用实现）
    const redirectToLogin = () => {
      // 清理认证信息
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      router.push("/auth/login");
    };


    return {
      refreshToken,
      findAllfolders,
      showCheckbox,
      showGraph,
      showNewCategoryDialog,
      newCategoryForm,
      showNewNoteDialog,
      newNoteForm,
      toggleCheckbox,
      append,
      remove,
      dataSource,
      treeRef,
      handleShowGraph,
      handleExport,
      createNewCategory,
      confirmNewCategory,
      confirmNewNote,
      showSearchInput,
      searchQuery,
      graphTreeData,
      handleSearch,
      clearSearch,
      getIconForNode,
      handleNodeExpand,
      handleNodeCollapse,
      defaultExpandedKeys,
      expandedKeys,
      // PDF上传相关
      showPdfUploadDialog,
      pdfUploadForm,
      handlePdfFileChange,
      confirmPdfUpload,
      isLoading,
      currentPage,
      pageSize,
      totalFolders,
      handlePageSizeChange,
      handlePageChange,
      truncateText,
      toggleTagTooltip,
      isTruncated,
      showEditDialog,
      currentEditNode,
      newTag,
      openEditDialog,
      addTag,
      removeTag,
      onTagDragEnd,
      saveEdit,
      handleRead,
    }
  }
}
</script>

<style scoped lang="scss">
.section-title {
  color: #444;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e6e6e6;
}

.modern-tree {
  --el-tree-node-hover-bg-color: rgba(70, 160, 255, 0.08);
  --el-tree-text-color: #444;
  --el-tree-expand-icon-color: #888;

  :deep(.el-tree-node) {
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(.el-tree-node__content) {
    color: #555;
    height: 50px;
    border-radius: 12px;
    transition: all 0.3s ease;
    padding: 0 16px;

    &:hover {
      background-color: rgba(70, 160, 255, 0.1);
      color: var(--el-color-primary);

      .node-actions {
        opacity: 1;
        transform: translateX(0);
      }
    }
  }

  :deep(.el-tree-node.is-current > .el-tree-node__content) {
    background-color: rgba(70, 160, 255, 0.15);
    box-shadow: inset 0 0 0 2px var(--el-color-primary);
  }
}

.modern-node {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;

  .node-label {
    color: #333;
    font-weight: 600;
    padding-left: 8px;
  }

  .node-actions {
    display: flex;
    gap: 10px;
    opacity: 0;
    transform: translateX(12px);
    transition: all 0.3s ease;
  }
}

.action-btn {
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  width: 36px;
  height: 36px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  outline: none;
  box-shadow: none;

  &:focus {
    outline: none;
    box-shadow: none;
  }

  &.edit-btn {
    background-color: rgba(200, 181, 88, 0.63);
    border-color: transparent;

    &:hover {
      background-color: var(--el-color-warning);
      color: white;
    }
  }

  &.add-btn {
    background-color: rgba(70, 160, 255, 0.44);
    border-color: transparent;

    &:hover {
      background-color: var(--el-color-primary);
      color: white;
    }
  }

  &.delete-btn {
    background-color: rgba(245, 108, 108, 0.54);
    border-color: transparent;

    &:hover {
      background-color: var(--el-color-danger);
      color: white;
    }
  }

  &.read-btn {
    background-color: rgba(189, 232, 125, 0.62);
    border-color: transparent;

    &:hover {
      background-color: rgb(148.6, 212.3, 117.1);
      color: white;
    }
  }
}

:deep(.graph-modal) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(16, 185, 129, 0.15);
  border: 1px solid #05966940;

  .el-dialog__header {
    background: #059669;
    margin-right: 0;
    padding: 14px 24px;
    border-bottom: 1px solid #047857;

    .el-dialog__title {
      color: white;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .el-dialog__headerbtn {
      top: 14px;
      right: 20px;

      .el-dialog__close {
        color: rgba(255, 255, 255, 0.9);
        font-size: 20px;

        &:hover {
          color: white;
          transform: scale(1.1);
        }
      }
    }
  }

  .el-dialog__body {
    padding: 0;
    height: 70vh;
    min-height: 500px;
    background: #f8fafc;
  }

  .el-dialog__footer {
    border-top: 1px solid #e2e8f0;
    padding: 12px 24px;
    background: #f8fafc;

    .modal-close-btn {
      padding: 8px 20px;
      border-radius: 8px;
      background: #059669;
      border-color: #059669;
      color: white;
      transition: all 0.2s ease;

      i {
        margin-right: 6px;
      }

      &:hover {
        background: #047857;
        border-color: #047857;
        transform: translateY(-1px);
        box-shadow: 0 2px 6px rgba(4, 120, 87, 0.3);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

:deep(.el-checkbox__inner) {
  border-radius: 8px;
  width: 18px;
  height: 18px;

  &::after {
    left: 6px;
    top: 3px;
  }
}

@media (max-width: 768px) {
  :deep(.graph-modal) {
    width: 95% !important;
    top: 2vh !important;

    .el-dialog__body {
      height: 80vh;
      min-height: auto;
    }

    .modal-close-btn {
      width: 100%;
    }
  }
}

:deep(.new-category-modal) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(5, 150, 105, 0.2);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);

  .el-dialog__header {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    margin-right: 0;
    padding: 16px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .el-dialog__title {
      color: white;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .el-dialog__headerbtn {
      top: 16px;
      right: 20px;

      .el-dialog__close {
        color: rgba(255, 255, 255, 0.9);
        font-size: 20px;
        transition: all 0.3s ease;

        &:hover {
          color: white;
          transform: scale(1.1) rotate(90deg);
        }
      }
    }
  }

  .el-dialog__body {
    padding: 24px;
    background: rgba(255, 255, 255, 0.95);

    .el-form-item {
      margin-bottom: 24px;

      .el-form-item__label {
        font-weight: 500;
        color: #374151;
        padding-bottom: 8px;
      }

      .el-form-item__content {
        .el-input__wrapper {
          border-radius: 12px;
          padding: 8px 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #e5e7eb;

          &:hover {
            border-color: #059669;
            box-shadow: 0 4px 6px rgba(5, 150, 105, 0.1);
          }

          &.is-focus {
            border-color: #059669;
            box-shadow: 0 4px 6px rgba(5, 150, 105, 0.15);
          }
        }

        .el-input__inner {
          font-size: 15px;
          color: #1f2937;

          &::placeholder {
            color: #9ca3af;
          }
        }
      }
    }
  }

  .el-dialog__footer {
    border-top: 1px solid rgba(229, 231, 235, 0.5);
    padding: 16px 24px;
    background: rgba(255, 255, 255, 0.95);
  }

  .modal-cancel-btn {
    padding: 10px 24px;
    border-radius: 12px;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    color: #4b5563;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      background: #e5e7eb;
      border-color: #d1d5db;
      color: #374151;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .modal-confirm-btn {
    padding: 10px 24px;
    border-radius: 12px;
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    border: none;
    color: white;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);

    &:hover {
      background: linear-gradient(135deg, #047857 0%, #065f46 100%);
      transform: translateY(-1px);
      box-shadow: 0 6px 8px rgba(5, 150, 105, 0.3);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);
    }
  }
}

@media (max-width: 768px) {
  :deep(.new-category-modal) {
    width: 90% !important;
    margin: 0 auto;

    .el-dialog__body {
      padding: 20px;
    }

    .el-dialog__footer {
      padding: 16px 20px;
    }

    .modal-cancel-btn,
    .modal-confirm-btn {
      padding: 8px 20px;
      font-size: 14px;
    }
  }
}

:deep(.el-input__wrapper),
:deep(.el-input__inner),
:deep(.el-dialog__headerbtn),
:deep(.el-dialog__close) {
  &:focus,
  &:focus-visible {
    outline: none !important;
    box-shadow: none !important;
    -webkit-box-shadow: none !important;
  }
}

:deep(.el-input__wrapper) {
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
  border: 1px solid #dcdfe6 !important;

  &:hover, &.is-focus {
    border-color: #059669 !important;
  }
}

.search-container {
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  .search-input {
    max-width: 400px;
    margin: 0 auto;

    :deep(.el-input__wrapper) {
      border-radius: 12px;
      padding: 8px 16px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #e5e7eb;

      &:hover {
        border-color: #059669;
        box-shadow: 0 4px 6px rgba(5, 150, 105, 0.1);
      }

      &.is-focus {
        border-color: #059669;
        box-shadow: 0 4px 6px rgba(5, 150, 105, 0.15);
      }
    }

    :deep(.el-input-group__append) {
      padding: 0;
      border: none;
      background: transparent;

      .el-button {
        padding: 8px;
        border: none;
        background: transparent;
        color: #6b7280;

        &:hover {
          color: #059669;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .search-container {
    padding: 12px;

    .search-input {
      max-width: 100%;
    }
  }
}

:deep(.pdf-upload-modal) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(5, 150, 105, 0.2);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);

  .el-dialog__header {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    margin-right: 0;
    padding: 16px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .el-dialog__title {
      color: white;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
  }

  .el-dialog__body {
    padding: 24px;
    background: rgba(255, 255, 255, 0.95);
  }

  .pdf-uploader {
    width: 100%;

    .upload-btn {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      border: none;
      color: white;
      padding: 10px 20px;
      border-radius: 8px;
      transition: all 0.3s ease;

      &:hover {
        background: linear-gradient(135deg, #047857 0%, #065f46 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);
      }
    }

    .el-upload__tip {
      color: #6b7280;
      font-size: 14px;
      margin-top: 8px;
    }
  }
}

.loading-wrapper {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.is-loading {
  animation: rotating 2s linear infinite;
  font-size: 32px;
}

.loading-text {
  color: #666;
  font-size: 14px;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.pagination-container {
  padding: 16px;
  background: white;
  border-top: 1px solid #e5e7eb;

  :deep(.el-pagination) {
    padding: 0;

    .btn-prev,
    .btn-next,
    .number {
      min-width: 32px;
      height: 32px;
      line-height: 32px;
      border-radius: 8px;
      margin: 0 4px;
    }

    .active {
      background: #059669 !important;
      color: white;
    }
  }
}

.modern-node {
  display: flex;
  align-items: center;
  gap: 8px; /* 增加元素间距 */

  .tag-container {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    flex-grow: 1;
    max-width: 45%;
    margin-right: auto; /* 将标签推到操作按钮左侧 */
  }

  .tag-item {
    height: 24px;
    line-height: 22px;
    font-size: 12px;
    padding: 0 6px;
    border-radius: 4px;
    background: #f0f2f5;
    border-color: #e4e7ed;
    color: #606266;
  }

}

/* 调整响应式布局 */
@media (max-width: 768px) {
  .modern-node {
    flex-wrap: wrap;

    .tag-container {
      order: 1;
      width: 100%;
      max-width: none;
      margin: 4px 0;
    }

    .node-actions {
      order: 2;
    }
  }
}

.tag-manager {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
}

.tag-list {
  min-height: 60px;
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 10px;
}

.tag-item {
  display: flex;
  align-items: center;
  margin: 4px 0;
  padding: 4px;
  transition: all 0.3s;

  .drag-handle {
    margin-right: 8px;
    cursor: move;
    color: #909399;

    &:hover {
      color: #409eff;
    }
  }

  &:hover {
    background: #f5f7fa;
  }
}

.add-tag {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.tag-list-enter-active,
.tag-list-leave-active {
  transition: all 0.3s;
}

.tag-list-enter-from,
.tag-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

</style>
