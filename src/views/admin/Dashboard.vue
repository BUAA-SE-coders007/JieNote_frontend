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
      <el-form :model="newCategoryForm" label-width="80px" @submit.native.prevent>
        <el-form-item label="分类名称">
          <el-input
              v-model="newCategoryForm.name"
              placeholder="请输入分类名称"
              class="category-input"
              :maxlength="20"
              show-word-limit
              @keyup.enter="confirmNewCategory"
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
              v-btnAntiShake="confirmNewCategory"
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
      <el-form :model="newNoteForm" label-width="80px" @submit.native.prevent>
        <el-form-item label="笔记名称">
          <el-input
              v-model="newNoteForm.name"
              placeholder="请输入笔记名称"
              class="note-input"
              :maxlength="20"
              show-word-limit
              @keyup.enter="confirmNewNote"
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
              v-btnAntiShake="confirmNewNote"
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
      <el-form :model="pdfUploadForm" label-width="80px" @submit.native.prevent>
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
                请选择PDF文件
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
              v-btnAntiShake="confirmPdfUpload"
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
                @check="handleCheck"
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
                <div class="modern-node" @dblclick.stop="handleNodeClick(data)">
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
                    <el-tooltip content="属性" placement="top" :enterable="false" :duration="50">
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
                    <el-tooltip v-if="node.level > 1" content="阅读" placement="top" :enterable="false" :duration="50">
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
        :title="`编辑`"
        width="500px"
        :close-on-click-modal="false"
    >
      <el-form label-width="80px" @submit.native.prevent>
        <!-- 名称编辑 -->
        <el-form-item label="名称">
          <el-input :maxlength="[0,2].includes(currentEditNode?.depth) ? 20 : 150"
                    :show-word-limit="[0,1,2].includes(currentEditNode?.depth)"
                    v-model="currentEditNode.label" />
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

              <!-- 新增提示文字 -->
              <div v-if="currentEditNode.tags.length > 0" class="priority-hint">
                （优先展示前三个标签）
              </div>
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
                  v-btnAntiShake="addTag"
              >
                添加
              </el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" v-btnAntiShake="saveEdit">保存</el-button>
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
import { clearAuth } from '@/utils/auth';
import { onUnmounted } from 'vue'
import {
  getSelfTree,
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
  readArticle
} from '@/api/dashboard';
import { createNote, updateNote, deleteNote as apiDeleteNote } from '@/api/note'; // Added getNotes, getNoteTitles

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

    const refreshData = async () => {
      // isLoading.value = true;
      try {
        // 先获取当前总数量
        // const preTotal = totalFolders.value;

        // 获取最新数据
        await findAllfolders();

        // 计算删除后是否需要调整页码
        const currentTotal = totalFolders.value;
        const maxPage = Math.ceil(currentTotal / pageSize.value);

        // 如果总数量减少且当前页超过最大页数
        if (currentPage.value > maxPage && maxPage > 0) {
          currentPage.value = maxPage;
          await findAllfolders();
        }

        // 保持当前页展开状态
        setInitialExpandedKeys();
      } catch (error) {
        ElMessage.error('刷新数据失败: ' + error.message);
      } finally {
        isLoading.value = false;
      }
    };

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
        try {
          const tagData = {
            article_id: currentEditNode.value.true_id,
            content: newTag.value.trim()
          };
          const response = await createTag(tagData);
          // Assuming the backend returns the created tag with its ID
          // If not, the temporary ID logic might need adjustment or removal if not strictly necessary for UI
          currentEditNode.value.tags.push({
            tag_id: response.data?.tag_id || Date.now(), // Use returned ID if available
            tag_content: newTag.value.trim()
          });
          newTag.value = '';
          ElMessage.success('标签添加成功');
        } catch (error) {
          ElMessage.error('标签添加失败: ' + error.message);
        }
      }
    }

    // 删除标签
    const removeTag = async (index) => {
      try {
        await deleteTag(currentEditNode.value.tags[index].tag_id);
        currentEditNode.value.tags.splice(index, 1);
        ElMessage.success('标签删除成功');
      } catch (error) {
        ElMessage.error('标签删除失败: ' + error.message);
      }
    }

    // 标签拖拽结束
    const onTagDragEnd = async () => {
      try {
        const tagData = {
          article_id: currentEditNode.value.true_id,
          tag_contents: currentEditNode.value.tags.map(tag => tag.tag_content)
        };
        await allTagsOrder(tagData);
        ElMessage.success('标签顺序已更新');
      } catch (error) {
        ElMessage.error('标签顺序更新失败: ' + error.message);
      }
    }

    // 保存修改
    const saveEdit = async () => {
      try {
        if (currentEditNode.value.depth === 0) {
          const nodeData = {
            folder_id: currentEditNode.value.true_id,
            folder_name: currentEditNode.value.label
          };
          await changeFolderName(nodeData);
        } else if (currentEditNode.value.depth === 1) {
          const nodeData = {
            article_id: currentEditNode.value.true_id,
            article_name: currentEditNode.value.label
          };
          await changeArticleName(nodeData);
          // 标签顺序已在 onTagDragEnd 中处理，如果需要单独保存标签内容（非顺序），则需额外逻辑
        } else if (currentEditNode.value.depth === 2) {
          let noteName = currentEditNode.value.label;
          if (!noteName.endsWith('.md')) {
            noteName += '.md';
          }
          // updateNote API expects (noteId, { title, content, article_id })
          // Here we only update the title. If content/article_id can also be changed via this dialog,
          // they should be included. Assuming only title for now.
          await updateNote(currentEditNode.value.true_id, { title: noteName });
        }

        await findAllfolders(); // Refresh data
        ElMessage.success('保存成功');
        showEditDialog.value = false;
      } catch (error) {
        ElMessage.error('保存失败: ' + error.message);
      }
    }

    const handleRead = (node, data) => {
      // 检查是否是文献节点或笔记节点
      console.log("handleRead, node.level:", node.level, "depth:", data.depth)
      if (node.level === 2 && data.depth === 1) {  // PDF nodes: level 2 in tree, depth 1 in data
        router.push(`/paper-note?article_id=${data.true_id}`);
      } else if (node.level === 3 && data.depth === 2) {  // 笔记节点：level 3 in tree, depth 2 in data
        router.push(`/note/${data.true_id}`);
      } else {
        ElMessage.warning('只能阅读文献或笔记');
      }
    }

    // // 更新标签到后端
    // const updateTags = async () => {
    //   // const res = await fetch(`https://jienote.top/article/allTagsOrder`, {
    //   //   method: 'POST',
    //   //   headers: {
    //   //     'Content-Type': 'application/json',
    //   //     'Authorization': 'Bearer ' + localStorage.getItem('authToken')
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
    //   const res = await fetch(`https://jienote.top/article/allTagsOrder`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': 'Bearer ' + localStorage.getItem('authToken')
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
        await findAllfolders()
        // 数据加载完成后设置默认展开
        setInitialExpandedKeys()
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

    const handleNodeClick = (data) => {
      // 根据节点类型决定操作
      if (data.depth === 1) { // 文献节点
        router.push(`/paper-note?article_id=${data.true_id}`);
      } else if (data.depth === 2) { // 笔记节点
        router.push(`/note/${data.true_id}`);
      } else {
        // 其他类型节点保持原有点击逻辑（展开/折叠）
        if (expandedKeys.value.has(data.id)) {
          handleNodeCollapse(data)
        } else {
          handleNodeExpand(data)
        }
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

    const handleCheck = (checkedNode, { checkedKeys }) => {
      if (checkedNode.depth === 0) {
        const isChecked = checkedKeys.includes(checkedNode.id)
        toggleChildCheck(checkedNode, isChecked)
      }
    }

// 递归设置子节点勾选状态
    const toggleChildCheck = (node, checked) => {
      if (!node.children || node.children.length === 0) return

      node.children.forEach(child => {
        treeRef.value.setChecked(child, checked, false) // false 表示不自动联动孙子节点
        toggleChildCheck(child, checked) // 手动递归
      })
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

        if (checkedNodes.length === 0) {
          ElMessage({
            message: '请至少选择一个文件',
            type: 'warning'
          })
          return
        }

        // 新增确认弹窗
        ElMessageBox.confirm(
            `确定要导出选中的 ${checkedNodes.length} 个文件吗？`,
            '导出确认',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }
        ).then(() => {
          exportSelectedFiles(checkedKeys).then(() => {
            showCheckbox.value = false
            treeRef.value.setCheckedKeys([])
          })
        }).catch(() => {
          // 取消操作
          console.log("取消导出")
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
                        // Use the API function readArticle
                        // readArticle is configured in http.js to return blob data directly for this endpoint
                        const response = await readArticle(level2Node.true_id);
                        // Ensure we have a proper Blob object
                        const blob = new Blob([response.data], { type: 'application/pdf' });
                        folder.file(fileName, blob);
                        ElMessage.success(`成功获取文件: ${fileName}`);
                      } catch (error) {
                        console.error(`获取文件 ${fileName} 出错:`, error);
                        ElMessage.error(`获取文件 ${fileName} 失败: ${error.message || '未知错误'}`);
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
      try {
        if (parent.parent === null) { // 一级分类 (Folder)
          await selfFolderToRecycleBin(node.data.true_id);
        } else if (node.level === 2) { // 二级分类 (Article)
          await selfArticleToRecycleBin(node.data.true_id);
        } else { // 三级分类 (Note)
          await apiDeleteNote(node.data.true_id);
        }

        // 统一处理删除成功后的逻辑
        // const currentItems = dataSource.value.length;
        // 如果删除的是最后一项且不是第一页 (这个逻辑可能需要调整，因为dataSource是整个树，不是当前页的项目)
        // 考虑在refreshData中处理页码调整
        // if (currentItems === 0 && currentPage.value > 1) { // If last item on a page > 1
        //   currentPage.value -= 1;
        // }
        await refreshData(); // Refresh data which also handles pagination
        ElMessage.success('删除成功');

      } catch (error) {
        let itemType = '项目';
        if (parent.parent === null) itemType = '文件夹';
        else if (node.level === 2) itemType = '文献';
        else if (node.level === 3) itemType = '笔记';
        ElMessage.error(`删除${itemType}失败: ` + error.message);
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

      try {
        const folderName = newCategoryForm.value.name.trim();
        const newFolderData = {
          folder_name: folderName,
        };

        // API call using the imported function
        await selfCreateFolder(newFolderData);
        // Backend is expected to return success or throw an error handled by http.js or here.
        // The response might contain data like { folder_id: ... }, but it's not explicitly used here
        // as refreshData() will fetch the updated tree.

        await refreshData(); // Refresh data to get the latest tree structure including the new folder
        ElMessage.success('新建分类成功');
        showNewCategoryDialog.value = false;
      } catch (error) {
        console.error('新建分类失败:', error);
        ElMessage.error('新建分类失败: ' + (error.message || '请稍后再试'));
      }
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



        const newNoteData = {
          title: noteName,
          article_id: newNoteForm.value.parentData.true_id,
          content: "", // Default content for a new note
        };
        const response = await createNote(newNoteData); // API call
        // Assuming response.data contains { note_id: ... } or similar for the new note's ID

        // Create new node for the tree
        const newChild = {
          id: id++, // Keep local ID generation for tree rendering
          label: noteName,
          depth: 2,
          true_id: response.data.note_id, // Use ID from backend
          children: []
        };

        // Add to parent node in the local tree
        if (!newNoteForm.value.parentData.children) {
          newNoteForm.value.parentData.children = [];
        }
        newNoteForm.value.parentData.children.push(newChild);
        dataSource.value = [...dataSource.value]; // Trigger reactivity

        ElMessage.success('笔记创建成功');
        showNewNoteDialog.value = false;
      } catch (error) {
        console.error('创建笔记失败:', error);
        ElMessage.error('创建笔记失败: ' + error.message);
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
        const { data } = await getArticleTags(articleId);
        return data.result || [];
      } catch (error) {
        console.error('获取标签失败:', error);
        return [];
      }
    };

    //这个是新写的

    // const findAllfolders = async () => {
    //   try {
    //     id = 0
    //     console.log(localStorage.getItem('authToken'))
    //     console.log('拿一级目录');
    //     const url = new URL('https://jienote.top/article/getSelfFolders', window.location.origin);
    //     url.searchParams.append('page_number', currentPage.value);
    //     url.searchParams.append('page_size', pageSize.value);
    //     const res = await fetch(url, {
    //       headers: {
    //         'Authorization': 'Bearer ' + localStorage.getItem('authToken')
    //       }
    //     });
    //     const data = await res.json();
    //     console.log('this is folder-data')
    //     console.log(data)
    //     totalFolders.value = data.total_num
    //     console.log(totalFolders)
    //
    //     const transformedData = [];
    //     // 使用Promise.all并行处理一级目录
    //     await Promise.all(data.result.map(async folder => {
    //       const firstLevel = {
    //         id: id++,
    //         true_id:folder.folder_id,
    //         label: folder.folder_name,
    //         depth: 0,
    //         children: []
    //       };
    //
    //       // 获取二级目录
    //       const secondRes = await fetch(`https://jienote.top/article/getArticlesInFolder?folder_id=${folder.folder_id}`, {
    //         headers: {
    //           'Authorization': 'Bearer ' + localStorage.getItem('authToken')
    //         }
    //       });
    //       const secondData = await secondRes.json();
    //       console.log('this is second-data')
    //       console.log(secondData.result)
    //
    //       // 并行处理二级目录
    //       firstLevel.children = await Promise.all(secondData.result.map(async article => {
    //         const secondLevel = {
    //           id: id++,
    //           true_id:article.article_id,
    //           label: article.article_name,
    //           tags: await fetchTags(article.article_id),
    //           depth: 1,
    //           children: []
    //         };
    //
    //         // 获取三级目录
    //         const thirdRes = await fetch(`https://jienote.top/notes?article_id=${article.article_id}`, {
    //           type: 'GET',
    //           headers: {
    //             'Authorization': 'Bearer ' + localStorage.getItem('authToken')
    //           }
    //         });
    //         const thirdData = await thirdRes.json();
    //         console.log('this is third-data')
    //         console.log(thirdData)
    //         console.log(thirdData.notes)
    //
    //         if (thirdData.notes?.length) {
    //           secondLevel.children = thirdData.notes.map(item => ({
    //             id: id++,
    //             true_id:item.id,
    //             label: item.title,
    //             depth: 2,
    //             content: item.content
    //           }));
    //         }
    //         return secondLevel;
    //       }));
    //
    //       transformedData.push(firstLevel);
    //     }));
    //
    //     dataSource.value = transformedData;
    //     console.log('数据转换完成:', transformedData);
    //   } catch (error) {
    //     console.error('数据加载失败:', error);
    //     throw error; // 抛出错误供外层捕获
    //   }
    // };

    const findAllfolders = async () => {
      try {
        id = 0; // 自增ID生成器
        console.log('开始加载完整文件树');

        const response = await getSelfTree({
          page_number: currentPage.value,
          page_size: pageSize.value
        });

        const data = response.data;
        console.log('完整文件树原始数据:', data);

        // 转换数据结构
        const transformedData = data.folders.map(folder => {
          // 一级节点：文件夹
          const folderNode = {
            id: id++,
            true_id: folder.folder_id,
            label: folder.folder_name,
            depth: 0,
            children: []
          };

          // 处理二级节点：文章（并行处理标签）
          folderNode.children = folder.articles.map(article => {
            // 二级节点：文章
            const articleNode = {
              id: id++,
              true_id: article.article_id,
              label: article.article_name,
              tags: [], // 先初始化，异步填充
              depth: 1,
              children: []
            };

            // 异步获取标签并确保视图更新
            fetchTags(article.article_id).then(tags => {
              // 使用数组解构重新赋值，确保 Vue 能够检测到变化
              articleNode.tags = [...tags];
              // 强制更新整个数据源以触发视图重新渲染
              dataSource.value = [...dataSource.value];
            });

            // 处理三级节点：笔记
            articleNode.children = article.notes.map(note => ({
              id: id++,
              true_id: note.note_id,
              label: note.note_title,
              depth: 2,
              content: note.content || '' // 根据实际接口字段调整
            }));

            return articleNode;
          });

          return folderNode;
        });

        // 更新响应式数据
        dataSource.value = transformedData;
        totalFolders.value = data.total_folder_num;
        console.log('转换后的树形数据:', transformedData);

      } catch (error) {
        console.error('文件树加载失败:', error);
        ElMessage.error('数据加载失败，请检查网络或权限');
        throw error;
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

        // API call to upload file
        const response = await uploadToSelfFolder(pdfUploadForm.value.parentNode.data.true_id, formData);
        // Assuming response.data contains { article_id: ... }
        const responseData = response.data;


        // Create new node for the tree
        const newChild = {
          id: pdfUploadForm.value.parentNode.id || id++, // Keep local ID generation
          label: `${fileName}.pdf`, // Backend might return the actual name, adjust if needed
          depth: 1,
          true_id: responseData.article_id, // Use ID from backend
          tags: [], // New PDFs won't have tags initially
          children: []
        };

        // Add to parent node in the local tree
        if (!pdfUploadForm.value.parentData.children) {
          pdfUploadForm.value.parentData.children = [];
        }
        pdfUploadForm.value.parentData.children.push(newChild);
        dataSource.value = [...dataSource.value]; // Trigger reactivity

        ElMessage.success('PDF上传成功');
        showPdfUploadDialog.value = false;
      } catch (error) {
        console.error('上传PDF失败:', error);
        ElMessage.error('上传PDF失败: ' + error.message);
      }
    }

    onUnmounted(() => {
    });

    // 跳转登录页（通用实现）
    const redirectToLogin = () => {
      // 清理认证信息
      clearAuth();
      router.push("/auth/login");
    };


    return {
      handleCheck,
      findAllfolders,
      showCheckbox,
      showGraph,
      showNewCategoryDialog,
      newCategoryForm,
      showNewNoteDialog,
      newNoteForm,
      handleNodeClick,
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
      redirectToLogin
    }
  }
}
</script>

<style scoped lang="scss">
.modern-node {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 95%;


  .node-actions {
    flex-shrink: 0; /* 防止按钮被压缩 */
    margin-left: auto; /* 按钮靠右 */
  }
}

.modern-node {
  cursor: pointer;
  transition: background-color 0.2s;

  .node-actions {
    /* 防止点击操作按钮时触发节点点击 */
    pointer-events: auto;
  }

  .tag-container {
    /* 标签区域不触发节点点击 */
    pointer-events: none;
  }
}

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
    white-space: nowrap; /* 不换行 */
    overflow: hidden; /* 超出隐藏 */
    text-overflow: ellipsis; /* 用省略号表示超出部分 */
    max-width: calc(100% - 50%); /* 根据布局调整最大宽度，避免挤占标签和按钮 */
    flex-shrink: 1; /* 可以缩小以适应布局 */
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
