<template>
  <div class="bg-gray-100 min-h-screen">
    <index-navbar />
    <section class="mt-12 md:mt-8 pb-40 relative">
      <div class="container mx-auto">
        <div class="flex">
          <!-- 左半部分：PDF 渲染 -->
          <div class="w-1/2 pdf-preview">
            <div class="outer-border p-2 rounded-lg">
              <div class="pdf-container relative">
                <div v-if="pdfUrl" class="pdf-content relative">
                  <!-- PDF 显示 -->
                  <iframe
                    :src="pdfUrl"
                    class="w-full h-full border rounded"
                    frameborder="0"
                  ></iframe>
                </div>
                <div v-else class="text-gray-500 text-center mt-4">
                  正在加载 PDF 文件，请稍候...
                </div>
              </div>
            </div>
          </div>
          <!-- 右半部分留空 -->
          <div class="w-1/2"></div>
        </div>
      </div>
    </section>
    <footer-component />
  </div>
</template>

<script>
import IndexNavbar from "@/components/Navbars/IndexNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";
import axios from "axios";

export default {
  data() {
    return {
      pdfUrl: null, // PDF 文件的 URL
    };
  },
  components: {
    IndexNavbar,
    FooterComponent,
  },
  methods: {
    async fetchPdf(articleId) {
      try {
        // 使用 tokenRefreshService 确保 token 有效
        import('@/utils/tokenRefreshService').then(module => {
          const tokenRefreshService = module.default;
          tokenRefreshService.init();
        });
        
        const token = localStorage.getItem("authToken"); // 从本地存储获取 Token
        if (!token) {
          console.error("Token 不存在，请先登录！");
          this.$router.push('/auth/login');
          return;
        }

        // 向后端发送请求获取 PDF 文件
        const response = await axios.get("https://43.143.228.56:8000/article/readArticle", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            article_id: articleId,
          },
          responseType: "blob", // 确保接收的是二进制数据
        });

        // 将返回的 PDF 文件流转换为 URL
        const blob = new Blob([response.data], { type: "application/pdf" });
        this.pdfUrl = URL.createObjectURL(blob);
      } catch (error) {
        console.error("获取 PDF 文件失败：", error);
        alert("加载 PDF 文件失败，请检查后端服务！");
      }
    },
  },
  mounted() {
    // 从路由的 query 中获取 article_id 参数
    const articleId = this.$route.query.article_id;
    if (articleId) {
      this.fetchPdf(articleId);
    } else {
      this.$message.error("未提供 article_id 参数！");
      this.$router.push('/admin/dashboard');
    }
  },
};
</script>

<style>
.pdf-container {
  height: calc(100vh - 100px); /* 占据视口高度减去顶部导航栏 */
  width: 100%; /* 占据父容器的全部宽度 */
  overflow: auto; /* 允许滚动查看 PDF */
  border: 1px solid #e2e8f0; /* 内层边框 */
  border-radius: 8px; /* 圆角边框 */
}

.outer-border {
  border: 2px solid #cbd5e0; /* 外层边框 */
  border-radius: 12px; /* 外层圆角边框 */
  background-color: #ffffff; /* 外层背景色 */
}

.pdf-preview {
  height: 100%; /* 占据父容器的全部高度 */
  width: 100%; /* 占据左半部分的宽度 */
  padding: 0; /* 去掉内边距 */
}
</style>
