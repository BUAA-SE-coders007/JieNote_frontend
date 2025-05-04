<template>
  <div class="flex flex-col h-screen w-full bg-blueGray-50 overflow-hidden">
    <!-- 顶部导航栏 -->
    <div class="flex items-center px-6 py-2 bg-emerald-600 text-white h-[60px] shadow-md z-10">
      <el-button
        type="success"
        class="mr-4 bg-emerald-700 border-0 transition-all duration-300 hover:bg-emerald-800 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
        @click="$router.push('/admin/dashboard')"
        circle
      >
        <el-icon><Back /></el-icon>
      </el-button>
      <div class="flex flex-col justify-center">
        <span class="text-xl font-semibold tracking-wide text-shadow">JieNote 文献笔记</span>
        <span v-if="documentTitle" class="text-sm opacity-85 mt-1">{{ documentTitle }}</span>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="flex-1 overflow-hidden relative">
      <!-- 使用 splitpanes 组件 -->
      <splitpanes class="default-theme" :horizontal="false">
        <pane :size="55" min-size="20">
          <!-- PDF 查看区域 -->
          <div class="h-[calc(100vh-60px)] bg-white relative border border-blueGray-200 rounded-md m-2 overflow-hidden shadow-inner">
            <iframe
              v-if="pdfUrl"
              :src="pdfUrl"
              class="w-full h-full border-none"
              frameborder="0"
            ></iframe>
            <div v-else class="flex flex-col items-center justify-center h-full text-gray-500">
              <el-icon class="text-5xl mb-4 animate-spin text-emerald-600"><Loading /></el-icon>
              <span>正在加载 PDF 文件，请稍候...</span>
            </div>
          </div>
        </pane>
        <pane min-size="20">
          <!-- 笔记编辑区域 -->
          <div :size="45" class="h-[calc(100vh-60px)]">
            <MdEditor class="h-full" v-model="editorContent" />
          </div>
        </pane>
      </splitpanes>
    </div>
  </div>
</template>

<script>
import { Back, Loading } from '@element-plus/icons-vue';
import http from '@/utils/http';
import MdEditor from '@/components/Editor/MdEditor.vue';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import { ElMessage } from 'element-plus';

export default {
  name: "NoteLayout",
  components: {
    Back,
    Loading,
    MdEditor,
    Splitpanes,
    Pane
  },
  data() {
    return {
      pdfUrl: null,
      documentTitle: "",
      editorContent: ""
    }
  },
  methods: {
    async fetchPdf(articleId) {
      try {
        const token = localStorage.getItem("authToken");
        console.log(token)
        const response = await http.get("/article/readArticle", {
          params: {
            article_id: articleId,
          },
          responseType: "blob",
        });

        // 获取文档标题
        await this.fetchDocumentTitle(articleId);

        const blob = new Blob([response.data], { type: "application/pdf" });
        this.pdfUrl = URL.createObjectURL(blob);
      } catch (error) {
        console.error("获取 PDF 文件失败：", error);
        ElMessage.error("加载 PDF 文件失败，请检查后端服务！");
      }
    },

    async fetchDocumentTitle(articleId) {
      try {
        // 此处可以添加获取文献标题的API调用
        // 暂时使用文献ID作为标题
        this.documentTitle = `文献ID: ${articleId}`;
      } catch (error) {
        console.error("获取文献信息失败：", error);
      }
    }
  },
  mounted() {
    const articleId = this.$route.query.article_id;
    console.log("Current route:", this.$route);
    if (articleId) {
      this.fetchPdf(articleId);
    } else {
      ElMessage.error("请先选择要阅读的文献");
      this.$router.push("/admin/dashboard");
    }
  }
};
</script>

<style scoped lang="scss">
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
  margin: 0.5rem;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}


.pdf-viewer {
  width: 100%;
  height: 100%; /* 改为 100% 填充父容器 */
  min-height: 500px; /* 添加最小高度保障 */
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
.splitpanes.default-theme .splitpanes__splitter {
  position: relative;
  background-color: #e2e8f0; /* blueGray-200 */
}

.splitpanes.default-theme .splitpanes__splitter::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 60px;
  background-color: rgba(16, 185, 129, 0.4); /* emerald-500 with opacity */
  border-radius: 3px;
  transition: all 0.3s ease;
}

.splitpanes.default-theme .splitpanes__splitter:hover::before {
  background-color: rgba(16, 185, 129, 0.8); /* emerald-500 with higher opacity */
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.3);
}

/* 添加文字阴影效果 */
.text-shadow {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 动画效果 */
.animate-spin {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .h-\[calc\(100vh-60px\)\] {
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
