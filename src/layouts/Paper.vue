<template>
  <div class="pdf-layout">
    <!-- 顶部导航栏 -->
    <div class="pdf-header">
      <el-button
        type="primary"
        class="back-button"
        @click="$router.push('/database')"
        circle
      >
        <el-icon><Back /></el-icon>
      </el-button>
      <div class="pdf-title">
        <span class="title-text">文献阅读</span>
        <span class="subtitle" v-if="documentTitle">{{ documentTitle }}</span>
      </div>
    </div>

    <!-- PDF 查看区域 -->
    <div class="pdf-container">
      <PdfViewer
        v-if="pdfUrl"
        :fileUrl="pdfUrl"
        :fileName="documentTitle"
        :articleId="articleId"
        :write="false"
      />
      <div v-else class="pdf-loading">
        <el-icon class="loading-icon is-loading"><Loading /></el-icon>
        <span>正在加载 PDF 文件，请稍候...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Back, Loading } from '@element-plus/icons-vue';
import PdfViewer from '@/components/Pdfview/PdfViewer.vue';
import http from '@/utils/http';
import { ElMessage } from 'element-plus';

export default {
  name: "PdfReader",
  components: {
    Back,
    Loading,
    PdfViewer,
  },
  data() {
    return {
      pdfUrl: null,
      documentTitle: "",
    };
  },
  methods: {
    async fetchPdf(articleId) {
      try {
        const response = await http.get("/article/readArticle", {
          params: {
            article_id: articleId,
          },
          responseType: "blob",
        });

        const blob = new Blob([response.data], { type: "application/pdf" });
        this.pdfUrl = URL.createObjectURL(blob);
        this.documentTitle = `文献 ID: ${articleId}`; // 临时设置标题
      } catch (error) {
        console.error("获取 PDF 文件失败：", error);
        ElMessage.error("加载 PDF 文件失败，请检查后端服务！");
      }
    },
  },
  mounted() {
    const articleId = this.$route.query.article_id;
    if (articleId) {
      this.fetchPdf(articleId);
    } else {
      ElMessage.error("请先选择要阅读的文献");
      this.$router.push("/database");
    }
  },
};
</script>

<style scoped lang="scss">
.pdf-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: #f8fafc;
  overflow: hidden;
}

.pdf-header {
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

.pdf-title {
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

.pdf-container {
  flex: 1;
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

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>