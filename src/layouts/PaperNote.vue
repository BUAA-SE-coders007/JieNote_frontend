<template>
  <div class="jienote-layout">
    <!-- 顶部导航栏 -->
    <div class="jienote-header">
      <el-button
          type="primary"
          class="back-button"
          @click="$router.push('/paper-library')"
          circle
      >
        <el-icon><Back /></el-icon>
      </el-button>
      <div class="jienote-title">
        <span class="title-text">JieNote 文献笔记</span>
        <span class="subtitle" v-if="documentTitle">{{ documentTitle }}</span>
      </div>
      <!-- 笔记选择器 -->
      <div class="header-note-selector">
        <el-select
          v-model="noteId"
          placeholder="选择笔记"
          class="header-note-select"
          @change="handleNoteChange"
        >
          <el-option
            v-for="note in notesList"
            :key="note.id"
            :label="note.title || `笔记ID: ${note.id}`"
            :value="note.id"
          />
        </el-select>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="jienote-content">
      <!-- 使用 splitpanes 组件 -->
      <splitpanes class="default-theme" :horizontal="false" @resized="onPaneResized">
        <pane :size="pdfPaneSize" min-size="20">
          <!-- PDF 查看区域 -->
          <div class="pdf-container">
            <PdfViewer
              v-if="pdfUrl"
              :fileUrl="pdfUrl"
              :fileName="documentTitle"
              :articleId="articleId"
              :write="true"
            />
            <div v-else class="pdf-loading">
              <el-icon class="loading-icon is-loading"><Loading /></el-icon>
              <span>正在加载 PDF 文件，请稍候...</span>
            </div>
          </div>
        </pane>
        <pane :size="notePaneSize" min-size="20">
          <!-- 笔记编辑区域 -->
          <div class="note-container">
            <!-- 笔记编辑器 -->
            <template v-if="editorPropsReady">
              <JieNoteEditor
                class="md-editor"
                v-model="editorContent"
                :note-id="noteId"
                :is_group="is_group"
                :autoSave="true"
                :autoSaveInterval="30000"
                :fullHeight="true"
                :theme="'light'"
                :showCodeRowNumber="true"
                :preview="true"
                :previewTheme="'default'"
                :codeTheme="'atom'"
                :scrollAuto="true"
              />
            </template>
            <div v-else class="editor-loading-placeholder">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span>正在准备笔记编辑器...</span>
            </div>
            />
          </div>
        </pane>
      </splitpanes>
    </div>
  </div>
</template>

<script>
import { Back, Loading } from '@element-plus/icons-vue';
// import http from '@/utils/http'; // No longer directly used here
import { getArticleUrl } from '@/api/article'; // Import the new API function
import JieNoteEditor from '@/components/Editor/JieNoteEditor.vue';
import { getNotes } from '@/api/note'; // 导入笔记相关 API
import NoteAPI from '@/api/note_unified'; // 笔记统一 API
import { Splitpanes, Pane } from 'splitpanes';
import PdfViewer from '@/components/Pdfview/PdfViewer.vue';
import 'splitpanes/dist/splitpanes.css';
import { ElMessage } from 'element-plus';


export default {
  name: "PaperNote",
  components: {
    Back,
    Loading,
    JieNoteEditor,
    Splitpanes,
    Pane,
    PdfViewer,
  },
  data() {
    return {
      pdfUrl: null,
      documentTitle: "",
      editorContent: "",
      noteId: null, // 新增 noteId
      articleId: null, // 存储 articleId
      pdfPaneSize: 35, // PDF面板尺寸
      notePaneSize: 65, // 笔记面板尺寸
      notesList: [], // 存储文献下的所有笔记
      is_group: false, // 新增：标识是否为群组笔记
      editorPropsReady: false, // 新增：编辑器属性就绪状态
    }
  },
  methods: {
    // 页面初始化方法
    async initializePage(articleId, specificNoteId = null) {
      this.articleId = articleId;
      
      try {
        // 并行获取所需数据
        const [pdfResponse, notesResponse] = await Promise.all([
          getArticleUrl(articleId),
          getNotes({ article_id: articleId }),
          this.fetchDocumentTitle(articleId),
        ]);

        // 处理 PDF URL
        if (pdfResponse?.data?.article_url) {
          this.pdfUrl = pdfResponse.data.article_url;
        } else {
          console.error("PDF URL not found in response:", pdfResponse);
          ElMessage.error("获取 PDF 链接失败！");
          this.pdfUrl = null;
        }

        // 更新笔记列表
        this.notesList = notesResponse?.data?.notes || [];
        
        // 确定要加载的笔记ID
        let targetNoteId = null;
        
        if (this.notesList.length > 0) {
          if (specificNoteId && this.notesList.some(note => note.id === specificNoteId)) {
            targetNoteId = specificNoteId;
          } else {
            targetNoteId = this.notesList[0].id;
          }
        } else {
          // 创建新笔记
          const createResponse = await NoteAPI.createNote({
            article_id: articleId,
            content: "",
            title: `笔记 ${new Date().toLocaleString()}`,
            isGroup: this.is_group
          });
          
          if (createResponse?.data?.note_id) {
            const newNote = {
              id: createResponse.data.note_id,
              title: `笔记 ${new Date().toLocaleString()}`,
              content: ""
            };
            this.notesList.push(newNote);
            targetNoteId = newNote.id;
            ElMessage.success("已为您创建新笔记，可以开始记录了。");
          } else {
            throw new Error("创建笔记失败");
          }
        }

        // 设置笔记ID
        if (targetNoteId) {
          this.noteId = targetNoteId;
        }
      } catch (error) {
        console.error("页面初始化失败：", error);
        ElMessage.error("页面加载失败，请检查网络连接！");
      }
    },

    // 处理笔记切换
    async handleNoteChange(newNoteId) {
      try {
        await this.$router.replace({
          query: {
            ...this.$route.query,
            note_id: newNoteId
          }
        });
      } catch (error) {
        console.error("切换笔记失败：", error);
        ElMessage.error("切换笔记失败！");
      }
    },

    async fetchDocumentTitle(articleId) {
      try {
        // 实际项目中应调用API获取文献真实标题
        this.documentTitle = `文献ID: ${articleId}`; // 保持临时方案
      } catch (error) {
        console.error("获取文献信息失败：", error);
        this.documentTitle = `文献ID: ${articleId}`; // 出错时回退
      }
    },

    // 从localStorage加载面板尺寸
    loadPaneSizes() {
      const savedSizes = localStorage.getItem('paperNotePaneSizes');
      if (savedSizes) {
        return JSON.parse(savedSizes);
      }
      return null;
    },

    // 保存面板尺寸到localStorage
    savePaneSizes() {
      localStorage.setItem('paperNotePaneSizes', JSON.stringify({
        pdfPaneSize: this.pdfPaneSize,
        notePaneSize: this.notePaneSize
      }));
    },

    // 处理面板尺寸变化事件
    onPaneResized(event) {
      const panes = event.panes;
      this.pdfPaneSize = panes[0].size;
      this.notePaneSize = panes[1].size;
      this.savePaneSizes();
    },

  },
  async mounted() {
    // 初始化面板尺寸
    const savedSizes = this.loadPaneSizes();
    if (savedSizes) {
      this.pdfPaneSize = savedSizes.pdfPaneSize;
      this.notePaneSize = savedSizes.notePaneSize;
    }

    // 从路由参数获取必要信息
    const currentArticleId = this.$route.query.article_id;
    const specificNoteId = this.$route.query.note_id;
    this.is_group = this.$route.query.is_group === 'true';

    if (currentArticleId) {
      try {
        await this.initializePage(currentArticleId, specificNoteId);
        // 只有当页面初始化完成后，才设置编辑器属性就绪状态
        this.editorPropsReady = true;
      } catch (error) {
        console.error("PaperNote mounted: initializePage failed", error);
        ElMessage.error("页面加载失败，请检查网络连接！");
      }
    } else {
      ElMessage.error("请先选择要阅读的文献");
      this.$router.push(this.is_group ? "/organization" : "/paper-library");
    }
  }
};
</script>

<style scoped lang="scss">
/* 编辑器加载占位符样式 */
.editor-loading-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #f8f9fa;
  color: #606266;
  font-size: 14px;

  .el-icon {
    font-size: 24px;
    margin-bottom: 8px;
  }
}

/* 笔记选择器样式 */
.header-note-selector {
  margin-left: auto;
  padding: 0 1rem;
}

.header-note-select {
  width: 200px;
}

/* 自定义 el-select 在标题栏中的样式 */
:deep(.header-note-select .el-input__wrapper) {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

:deep(.header-note-select .el-input__wrapper:hover) {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

:deep(.header-note-select .el-input__inner) {
  color: white;
}

:deep(.header-note-select .el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.7);
}

:deep(.header-note-select .el-select__caret) {
  color: white;
}

/* 主布局样式 */
.jienote-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: #f8fafc;
  overflow: hidden;
}

/* 顶部导航栏样式 */
.jienote-header {
  display: flex;
  align-items: center;
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: white;
  height: 60px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.back-button {
  margin-right: 1rem;
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
}

.jienote-title {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .title-text {
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .subtitle {
    font-size: 0.875rem;
    opacity: 0.85;
    margin-top: 0.25rem;
  }
}

/* 内容区域样式 */
.jienote-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

/* PDF 容器样式 */
.pdf-container {
  height: calc(100vh - 70px);
  background-color: #f0f2f5;
  position: relative;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  margin: 0.25rem;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.pdf-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;

  .loading-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    animation: rotating 2s linear infinite;
  }
}

/* 笔记编辑区样式 */
.note-container {
  height: calc(100vh - 60px);
}

.md-editor {
  height: 100%;
}

/* 自定义 Splitpanes 样式 */
:deep(.splitpanes) {
  height: calc(100vh - 60px) !important;
}

:deep(.splitpanes__splitter) {
  position: relative;
  background-color: #e2e8f0 !important;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 60px;
    background-color: rgba(5, 150, 105, 0.4);
    border-radius: 3px;
    transition: all 0.3s ease;
  }

  &:hover::before {
    background-color: rgba(5, 150, 105, 0.8);
    box-shadow: 0 0 8px rgba(5, 150, 105, 0.3);
  }
}

/* 动画效果 */
@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .jienote-header {
    padding: 0.5rem 1rem;
    height: 50px;
  }

  .jienote-title .title-text {
    font-size: 1rem;
  }

  .pdf-container {
    height: calc(100vh - 80px);
  }
  .note-container {
    height: calc(100vh - 50px);
  }

  :deep(.splitpanes) {
    height: calc(100vh - 50px) !important;
  }

  :deep(.splitpanes__pane) {
    height: 100% !important; /* 强制填充可用高度 */
  }
}
</style>
