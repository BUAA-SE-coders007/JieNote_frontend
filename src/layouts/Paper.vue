<template>
  <div class="pdf-layout">
    <PdfViewer
      v-if="fileUrl"
      :fileUrl="fileUrl"
      :articleId="articleId"
      :write="false"
      :fileName="fileName"
    />
    <div v-else class="loading">
      <el-icon class="loading-icon is-loading"><Loading /></el-icon>
      <span>正在加载 PDF 文件，请稍候...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { defineExpose } from 'vue'
import PdfViewer from '@/components/Pdfview/PdfViewer.vue';
import http from '@/utils/http';

const route = useRoute();
const articleId = ref(route.query.articleId || null);
const fileName = ref(`文献 ID: ${articleId.value}`);
const fileUrl = ref('');

onMounted(async () => {
  try {
    const response = await http.get(`database/get`, { params: { id: articleId.value } });
    console.log('获取文献 ID:', articleId.value);
    console.log('获取文献数据成功:', response.data);
    fileUrl.value = `https://jienote.top${response.data.articles[0].file_path}`; // 拼接完整的 fileUrl
    console.log('获取文献文件路径成功:', fileUrl.value);
  } catch (error) {
    console.error('获取文献文件路径失败:', error);
  }
});
defineExpose({
  PdfViewer,
  articleId,
  fileName
})

</script>

<style scoped>
.pdf-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8fafc;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.loading-icon {
  font-size: 32px;
  margin-bottom: 10px;
  animation: rotating 2s linear infinite;
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