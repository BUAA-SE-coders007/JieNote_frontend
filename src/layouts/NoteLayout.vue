<template>
  <div>
    <el-button
      type="primary"
      style="position: absolute; top: 16px; left: 16px; z-index: 10"
      @click="$router.push('/admin/dashboard')"
      circle
    >
      <el-icon><Back /></el-icon>
    </el-button>
    <el-row style="height: 100vh">
      <!-- 左边 PDF 区 -->
      <el-col :span="16" style="height: 100vh; border-right: 1px solid #e5e7eb">
        <!-- PDF Viewer -->
        <div class="pdf-container h-full">
          <iframe
            v-if="pdfUrl"
            :src="pdfUrl"
            class="w-full h-full border-none"
            frameborder="0"
          ></iframe>
          <div v-else class="flex items-center justify-center h-full text-gray-500">
            正在加载 PDF 文件，请稍候...
          </div>
        </div>
      </el-col>
      <!-- 右边笔记区 -->
      <el-col :span="8" style="height: 100vh; position: relative">
        <MdEditor class="h-full" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Back } from '@element-plus/icons-vue'
import axios from "axios";
import MdEditor from '@/components/Editor/MdEditor.vue';

export default {
  name: "NoteLayout",
  components: { 
    Back,
    MdEditor: MdEditor 
  },
  data() {
    return {
      pdfUrl: null
    }
  },
  methods: {
    async fetchPdf(articleId) {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("Token 不存在，请先登录！");
          return;
        }

        const response = await axios.get("http://43.143.228.56:8000/article/readArticle", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            article_id: articleId,
          },
          responseType: "blob",
        });

        const blob = new Blob([response.data], { type: "application/pdf" });
        this.pdfUrl = URL.createObjectURL(blob);
      } catch (error) {
        console.error("获取 PDF 文件失败：", error);
        this.$message.error("加载 PDF 文件失败，请检查后端服务！");
      }
    }
  },
  mounted() {
    const articleId = this.$route.query.article_id;
    console.log("Current route:", this.$route);
    if (articleId) {
      this.fetchPdf(articleId);
    } else {
      this.$message.error("请先选择要阅读的文献");
      this.$router.push("/admin/dashboard");
    }
  }
};
</script>

<style scoped>
.pdf-container {
  background: #f5f5f5;
  overflow: hidden;
}

/* Ensure iframes take up full height */
iframe {
  min-height: 100vh;
}
</style>
