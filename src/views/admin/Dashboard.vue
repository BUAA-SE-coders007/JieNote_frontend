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
                 @click="togglePreview">
                <i class="fas fa-eye text-lg leading-lg text-white opacity-75"></i>
                <span class="ml-2">{{ previewEnabled ? '关闭预览' : '开启预览' }}</span>
              </a>
            </li>
            <li class="nav-item relative group">
              <div class="flex items-center transition-all duration-300">
                <a class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                   href="javascript:;"
                   @click="toggleSearch">
                  <i class="fas fa-search text-lg leading-lg text-white opacity-75"></i>
                  <span class="ml-2">搜索</span>
                </a>
                <transition name="search-expand">
                  <div v-if="showSearch" class="flex items-center bg-white rounded-full ml-2 overflow-hidden px-2 py-1">
                  <el-input
                        v-model="searchQuery"
                        placeholder="输入关键词..."
                        class="search-input"
                        size="small"
                        @keyup.enter="performSearch"
                    />
                    <el-select
                        v-model="searchType"
                        class="advanced-search"
                        size="small"
                        placeholder="高级检索"
                        style="width: 120px"
                    >
                      <el-option
                          v-for="option in searchOptions"
                          :key="option.value"
                          :label="option.label"
                          :value="option.value"
                      />
                    </el-select>
                  </div>
                </transition>
              </div>
            </li>
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
      <div class="graph-selector">
        <div v-if="availableArticles.length === 0" class="no-articles-hint">
          未找到文献，请确保选择了文献节点（depth=1）
        </div>
        <el-select
            v-model="selectedArticleId"
            placeholder="请选择文献生成知识图谱"
            class="article-select"
            clearable
            :teleported="false"
        >
          <el-option
              v-for="article in availableArticles"
              :key="article.true_id"
              :label="article.label"
              :value="article.true_id"
          />
        </el-select>
        <el-button
            type="primary"
            @click="generateArticleGraph"
            :disabled="!selectedArticleId"
            class="generate-btn"
        >
          <span>生成知识图谱</span>
        </el-button>
      </div>
      <div v-if="generatingGraph && !graphDone" class="generating-hint">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>正在生成知识图谱，请稍候...</span>
      </div>
      <div class="graph-controls">
        <el-button-group v-show="graphDone">
          <el-button @click="zoomOut" size="small" title="缩小">
            <el-icon><ZoomOut /></el-icon>
          </el-button>
          <el-button @click="resetZoom" size="small" title="重置">
            <el-icon><FullScreen /></el-icon>
          </el-button>
          <el-button @click="zoomIn" size="small" title="放大">
            <el-icon><ZoomIn /></el-icon>
          </el-button>
        </el-button-group>
      </div>
      <!-- 显示mermaid代码 -->
      <div v-show="graphDone" ref="mermaidContainer" class="mermaid-graph"></div>
      <KnowledgeGraph v-if="!generatingGraph && !graphDone" :treeData="graphTreeData" />
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
                <div class="modern-node" @dblclick.stop="handleNodeDblClick(data)">
                  <!-- 预览 popover -->
                  <el-popover
                    v-if="previewEnabled && data.depth === 2"
                    placement="right-start"
                    :width="400"
                    trigger="hover"
                    :hide-after="400"
                    :show-arrow="true"
                    :offset="12"
                    :show-after="300"
                    transition="el-fade-in-linear"
                    popper-class="preview-popover"
                    @show="handlePreviewShow(data)"
                    @before-enter="handlePreviewBeforeEnter(data)"
                  >
                    <template #default>
                      <div class="preview-content">
                        <JieNotePreview
                          v-if="currentPreviewNote && currentPreviewNote.id === data.id"
                          :modelValue="currentPreviewNote.content"
                          theme="light"
                        />
                        <div v-else class="preview-loading">
                          <el-icon class="is-loading"><Loading /></el-icon>
                          <span>加载中...</span>
                        </div>
                      </div>
                    </template>
                    <template #reference>
                      <span class="node-label">{{ getIconForNode(data) }} {{ data.label }}</span>
                    </template>
                  </el-popover>
                  <span v-else class="node-label">{{ getIconForNode(data) }} {{ data.label }}</span>
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
    <!-- 添加一个隐藏的预览组件容器，用于缓存预览内容 -->
    <div v-show="false" ref="previewContainer">
      <JieNotePreview
        v-if="currentPreviewNote"
        ref="preview"
        :modelValue="currentPreviewNote.content"
        theme="light"
      />
    </div>

    <!-- 编辑弹窗 -->
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
import { ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Edit, DocumentAdd, Delete, Management, Rank } from '@element-plus/icons-vue'
import KnowledgeGraph from '/src/components/Tree/KnowledgeGraph.vue'
import JieNotePreview from '@/components/Editor/JieNotePreview.vue'
import JSZip from 'jszip'
import draggable from 'vuedraggable'
import { ElMessage, ElMessageBox } from 'element-plus'
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
  allTagsOrder,
  getArticleTags,
  readArticle
} from '@/api/dashboard';
import { createNote, updateNote, deleteNote as apiDeleteNote,getNotes } from '@/api/note';
import { generateKnowledgeGraph } from '@/api/dashboard';
import mermaid from 'mermaid';

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
    Rank,
    JieNotePreview
  },


  setup() {
    // 预览相关的状态和变量
    const previewEnabled = ref(false)
    const currentPreviewNote = ref(null)
    const previewCache = ref(new Map()) // 用于缓存预览内容
    const previewLoadingDelay = ref(null) // 用于延迟加载动画
    
    // 处理预览显示
    // 预览加载前的处理
    const handlePreviewBeforeEnter = (data) => {
      // 清除之前的延迟加载定时器
      if (previewLoadingDelay.value) {
        clearTimeout(previewLoadingDelay.value);
      }
      // 如果没有缓存，显示加载状态
      if (!previewCache.value.has(data.id)) {
        currentPreviewNote.value = null;
      }
    }

    // 处理预览显示
    const handlePreviewShow = async (data) => {
      // 如果缓存中已有内容，直接使用缓存
      if (previewCache.value.has(data.id)) {
        currentPreviewNote.value = previewCache.value.get(data.id);
        return;
      }

      // 设置延迟加载动画
      previewLoadingDelay.value = setTimeout(async () => {
        try {
        const response = await getNotes({ id: data.true_id });
        if (response.data && response.data.notes && response.data.notes.length > 0) {
          const note = {
            id: data.id,
            content: response.data.notes[0].content || ''
          };
          // 更新缓存
          previewCache.value.set(data.id, note);
          currentPreviewNote.value = note;
        } else {
          ElMessage.warning('笔记内容为空');
        }
      } catch (error) {
        console.error('预览加载失败:', error);
        ElMessage.error('预览加载失败：' + (error.message || '请稍后重试'));
      } finally {
        // 清除延迟加载定时器
        clearTimeout(previewLoadingDelay.value);
        previewLoadingDelay.value = null;
      }
    }, 300); // 300ms后开始加载，避免频繁触发
  }
    const router = useRouter()

    const showNewNoteDialog = ref(false)
    const newNoteForm = ref({
      name: '',
      parentNode: null,
      parentData: null
    })

    const mermaidContainer = ref(null); // 添加Mermaid容器引用

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
          // Assuming the backend returns the created tag with its ID
          // If not, the temporary ID logic might need adjustment or removal if not strictly necessary for UI
          currentEditNode.value.tags.push({
            tag_id: Date.now(), // Use returned ID if available
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
          const tagData = {
            article_id: currentEditNode.value.true_id,
            tag_contents: currentEditNode.value.tags.map(tag => tag.tag_content)
          };
          await allTagsOrder(tagData);
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

    const initMermaid = () => {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose', // 允许更灵活的语法
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true
        }
      });
    };

    onMounted(async () => {
      initMermaid();
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

    // 处理双击事件
    const handleNodeDblClick = async (data) => {
      // 直接处理跳转逻辑
      if (data.depth === 1) { // 文献节点
        router.push(`/paper-note?article_id=${data.true_id}`);
      } else if (data.depth === 2) { // 笔记节点
        router.push(`/note/${data.true_id}`);
      }
    }

    // 处理普通点击事件
    const handleNodeClick = (data) => {
      // 只处理文件夹的展开/收起
      if (data.depth === 0) {
        if (expandedKeys.value.has(data.id)) {
          handleNodeCollapse(data)
        } else {
          handleNodeExpand(data)
        }
      }
    }

    const togglePreview = () => {
      previewEnabled.value = !previewEnabled.value;
      // 切换预览时清除缓存
      if (!previewEnabled.value) {
        previewCache.value.clear();
        currentPreviewNote.value = null;
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

    const selectedArticleId = ref(null);
    const mermaidGraph = ref('');
    const generatingGraph = ref(false);
    const graphDone = ref(false);
    const availableArticles = ref([]);

    // 生成单篇文献知识图谱的方法
    const MAX_RETRIES = 2;
    let retryCount = 0;
    const scale = ref(1);
    const maxScale = ref(3);
    const minScale = ref(0.5);
    const scaleStep = ref(0.1);

// 添加缩放函数
    const zoomIn = () => {
      if (scale.value < maxScale.value) {
        scale.value = Math.min(maxScale.value, scale.value + scaleStep.value);
        applyZoom();
      }
    };

    const zoomOut = () => {
      if (scale.value > minScale.value) {
        scale.value = Math.max(minScale.value, scale.value - scaleStep.value);
        applyZoom();
      }
    };

    const resetZoom = () => {
      scale.value = 1;
      applyZoom();
    };

    const applyZoom = () => {
      nextTick(() => {
        const svgElement = mermaidContainer.value?.querySelector('svg');
        if (svgElement) {
          svgElement.style.transform = `scale(${scale.value})`;
          svgElement.style.transformOrigin = 'top left';
        }
      });
    };

    const fixMermaidSyntax = (code) => {
      // 1. 修复子图名称：用双引号包裹所有子图名称
      code = code.replace(/subgraph\s+([^\n]+)/g, (match, p1) => {
        // 如果名称已经包含引号，则不再添加
        if (p1.startsWith('"') && p1.endsWith('"')) {
          return `subgraph ${p1}`;
        }
        return `subgraph "${p1}"`;
      });

      // 2. 确保所有节点标签都使用双引号
      code = code.replace(/\[([^\]]+)\]/g, '["$1"]');

      // 3. 转义双引号内的特殊字符
      code = code.replace(/\["([^"]+)"/g, (match, p1) => {
        const escaped = p1.replace(/"/g, '\\"');
        return `["${escaped}"`;
      });

      // 4. 添加必要的换行符
      code = code.replace(/([;}\]])[\s]*([A-Za-z#])/g, '$1\n$2');

      return code;
    };

    const generateArticleGraph = async () => {
      if (!selectedArticleId.value) return;

      try {
        generatingGraph.value = true;
        console.log("正在为文献生成知识图谱:", selectedArticleId.value);

        const response = await generateKnowledgeGraph(selectedArticleId.value);
        retryCount = 0;
        console.log(response.data.mermaid_code)

        if (response.data && response.data.mermaid_code) {
          const fixedCode = fixMermaidSyntax(response.data.mermaid_code);
          console.log("修复后的Mermaid代码:", fixedCode);
          // 等待DOM更新
          await nextTick();

          // 清空容器
          if (mermaidContainer.value) {
            mermaidContainer.value.innerHTML = '';
          }

          // 渲染Mermaid图表
          const { svg } = await mermaid.render('mermaid-graph', fixedCode);

          // 创建临时容器插入 SVG
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = svg;

          // 获取 SVG 元素
          const svgElement = tempDiv.querySelector('svg');

          if (svgElement) {
            // 插入到真实 DOM
            console.log(svgElement);
            mermaidContainer.value.appendChild(svgElement);

            // 等待 DOM 更新完成
            await nextTick();

            // 现在可以安全设置完成状态
            graphDone.value = true;
            ElMessage.success("生成图谱成功");
          } else {
            console.error('Mermaid 返回的 SVG 无效:', svg);
            throw new Error('Mermaid 渲染失败：未生成 SVG 元素');
          }

        } else {
          throw new Error("返回的知识图谱数据为空");
        }
      } catch (error) {
        console.error('生成知识图谱失败:', error);

        // 如果是500错误且未达到最大重试次数
        if (error.response?.status === 500 && retryCount < MAX_RETRIES) {
          retryCount++;
          console.log(`尝试重试 (${retryCount}/${MAX_RETRIES})...`);

          // 延迟后重试
          await new Promise(resolve => setTimeout(resolve, 2000));
          return generateArticleGraph();
        }

        // 处理其他错误
        let errorMessage = '生成知识图谱失败';

        if (error.response) {
          switch (error.response.status) {
            case 404:
              errorMessage = '该文献下没有笔记，无法生成知识图谱';
              break;
            case 500:
              errorMessage = 'AI请求繁忙，请稍后再试';
              break;
            case 429:
              errorMessage = '请求过于频繁，请稍后再试';
              break;
            default:
              errorMessage = `请求失败: ${error.response.status} ${error.response.statusText}`;
          }
        } else if (error.request) {
          errorMessage = '服务器无响应，请检查网络连接';
        } else {
          errorMessage = error.message || '未知错误';
        }

        ElMessage.error(errorMessage);
      } finally {
        ElMessage.success("生成图谱成功");
        graphDone.value = true;
        generatingGraph.value = false;
        // 调试代码
        setTimeout(() => {
          if (mermaidContainer.value) {
            console.log('容器尺寸:',
                mermaidContainer.value.offsetWidth,
                'x',
                mermaidContainer.value.offsetHeight
            );

            const svg = mermaidContainer.value.querySelector('svg');
            if (svg) {
              console.log('SVG 尺寸:',
                  svg.clientWidth,
                  'x',
                  svg.clientHeight,
                  '\nViewBox:', svg.getAttribute('viewBox')
              );
            } else {
              console.warn('容器内没有 SVG 元素');
            }
          }
        }, 100);
      }
    };


    const handleShowGraph = () => {
      // 重置状态
      selectedArticleId.value = null;
      mermaidGraph.value = '';
      availableArticles.value = []; // 清空旧数据

      // 收集所有depth=1的文献节点（修复后的方法）
      const collectArticles = (nodes) => {
        for (const node of nodes) {
          // 如果是文献节点（depth=1）直接添加
          if (node.depth === 1) {
            availableArticles.value.push({
              true_id: node.true_id,
              label: node.label
            });
          }

          // 递归处理子节点
          if (node.children && node.children.length > 0) {
            collectArticles(node.children);
          }
        }
      };

      console.log("可用文献列表:", availableArticles.value);
      if (!showCheckbox.value) {
        showCheckbox.value = true;
        ElMessage.info('请选择要生成知识图谱的文件');
        return;
      }

      const rawCheckedNodes = treeRef.value.getCheckedNodes(false, true);
      const checkedKeys = treeRef.value.getCheckedKeys(false);
      const checkedNodes = filterCheckedTreeNodes(rawCheckedNodes, checkedKeys);

      if (checkedNodes.length === 0) {
        ElMessage.warning('请至少选择一个文件');
        return;
      }

      // 收集文献节点
      collectArticles(checkedNodes);

      nextTick(() => {
        graphTreeData.value = buildGraphTree(dataSource.value, checkedKeys);
        showGraph.value = true;
        showCheckbox.value = false;
        treeRef.value.setCheckedKeys([]);
      });
    };

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

    const showSearch = ref(false)
    const searchQuery = ref('')
    const searchType = ref('all')
    const searchOptions = ref([
      { value: 'all', label: '全部内容' },
      { value: 'title', label: '标题' },
      { value: 'note', label: '笔记内容' },
      { value: 'tag', label: '标签' }
    ])

    const toggleSearch = () => {
      showSearch.value = !showSearch.value
      if (!showSearch.value) {
        searchQuery.value = ''
        searchType.value = 'all'
      }
    }

    const performSearch = () => {
      // 实现搜索逻辑
      console.log('执行搜索:', {
        query: searchQuery.value,
        type: searchType.value
      })
    }



    return {
      previewEnabled,
      currentPreviewNote,
      togglePreview,
      handlePreviewShow,
      handlePreviewBeforeEnter,
      handleCheck,
      findAllfolders,
      showCheckbox,
      showGraph,
      showNewCategoryDialog,
      newCategoryForm,
      showNewNoteDialog,
      newNoteForm,
      handleNodeClick,
      handleNodeDblClick,
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
      redirectToLogin,
      showSearch,
      searchType,
      searchOptions,
      toggleSearch,
      performSearch,
      selectedArticleId,
      mermaidGraph,
      generatingGraph,
      availableArticles,
      generateArticleGraph,
      mermaidContainer,
      graphDone,
      zoomOut,
      zoomIn,
      resetZoom
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
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
  }

  &.hovering {
    background-color: rgba(70, 160, 255, 0.05);
  }

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

.search-expand-enter-active,
.search-expand-leave-active {
  transition: all 0.3s ease;
  max-width: 500px;
}

.search-expand-enter-from,
.search-expand-leave-to {
  opacity: 0;
  max-width: 0;
  transform: translateX(-10px);
}

.search-input {
  :deep(.el-input__wrapper) {
    border: none !important;
    border-radius: 9999px !important;
    box-shadow: none !important;
    padding: 0 12px !important;
    background-color: #f9fafb;
    transition: background-color 0.2s ease;

    // 新增：移除所有焦点状态样式
    &.is-focus,
    &:focus,
    &:focus-visible,
    &:active {
      box-shadow: none !important;
      outline: none !important;
      border-color: #e5e7eb !important;
    }
  }

  :deep(.el-input__inner) {
    box-shadow: none !important;
  }
}

.advanced-search {
  margin-left: 4px;

  // 新增：完全覆盖select组件状态
  :deep(.el-select) {
    .el-input__wrapper {
      border: none !important;
      border-radius: 9999px !important;
      box-shadow: none !important;
      padding: 0 10px !important;
      background-color: #f9fafb;
      border-left: 1px solid #e5e7eb !important;
      transition: background-color 0.2s ease;

      // 覆盖所有可能的焦点状态
      &.is-focus,
      &:focus,
      &:focus-within,
      &:focus-visible {
        box-shadow: none !important;
        outline: none !important;
        border-color: #e5e7eb !important;
      }
    }

    // 下拉箭头颜色调整
    .el-select__caret {
      color: #6b7280;
    }

    // 下拉菜单样式调整
    .el-select-dropdown {
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

      // 选项hover状态
      .el-select-dropdown__item:hover {
        background-color: #f3f4f6;
      }

      // 选中状态
      .el-select-dropdown__item.selected {
        color: #059669;
        background-color: #f0fdf4;
      }
    }
  }
}

@media (max-width: 768px) {
  .search-expand-enter-active,
  .search-expand-leave-active {
    max-width: 280px;
  }

  .search-input {
    width: 150px;
  }

  .advanced-search {
    :deep(.el-select) {
      width: 100px;

      .el-input__wrapper {
        padding: 0 8px !important;
      }
    }
  }
}

.graph-selector {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;

  .article-select {
    flex: 1;
  }

  .generate-btn {
    flex-shrink: 0;
  }
}


.generating-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 400px;
  color: #606266;
  font-size: 16px;

  .is-loading {
    animation: rotating 2s linear infinite;
    font-size: 24px;
  }
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.mermaid-graph {
  display: block;
  width: 100%;
  height: 60vh; /* 使用视口高度单位 */
  min-height: 400px;
  background-color: white;
  border: 1px solid #eee;
  overflow: auto; /* 添加滚动条 */
  position: relative;

  svg {
    display: block;
    width: 100%;
    height: auto;
    min-height: 300px;
    font-family: 'Microsoft YaHei', sans-serif;
    background-color: white;
    transition: transform 0.3s ease; /* 添加平滑过渡效果 */
  }
}

.graph-controls {
  position: absolute;
  top: 10px;
  right: 40px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.8);
  padding: 5px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}



.preview-popover {
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  backdrop-filter: blur(8px);
  transition: opacity 0.3s, transform 0.3s;
  
  .el-popover__content {
    padding: 0;
    overflow: hidden;
  }
  
  .preview-content {
    max-height: 600px;
    height: 100%;
    padding: 16px;
    overflow-y: auto;
    
    // 自定义滚动条样式
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: #d1d5db;
      border-radius: 3px;
      
      &:hover {
        background-color: #9ca3af;
      }
    }
    
    &::-webkit-scrollbar-track {
      background-color: #f3f4f6;
      border-radius: 3px;
    }
  }
  
  .preview-loading {
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 12px;
    padding: 24px;
    color: #6b7280;
    
    .is-loading {
      font-size: 24px;
      animation: rotating 2s linear infinite;
      color: #059669;
    }
    
    span {
      font-size: 14px;
    }
  }
  
  // 添加进入和离开动画
  &.el-popover.el-popper {
    &[data-popper-placement^='top'] {
      transform-origin: bottom;
    }
    &[data-popper-placement^='bottom'] {
      transform-origin: top;
    }
    &[data-popper-placement^='left'] {
      transform-origin: right;
    }
    &[data-popper-placement^='right'] {
      transform-origin: left;
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .preview-popover {
    max-width: 300px;
    
    .preview-content {
      max-height: 400px;
      padding: 12px;
    }
    
    .preview-loading {
      min-height: 150px;
      padding: 16px;
    }
  }
}
</style>
