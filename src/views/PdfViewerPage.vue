<template>
  <div class="pdf-iframe-viewer">
    <!-- 文件上传组件 -->
    <input type="file" @change="handleFileUpload" accept=".pdf" class="upload-btn" />
    
    <!-- PDF预览IFrame -->
    <iframe
      v-if="pdfUrl"
      :src="pdfUrl"
      frameborder="0"
      class="pdf-iframe"
      title="PDF Viewer"
    ></iframe>
    
    <!-- 错误提示 -->
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, defineExpose } from 'vue';

// 响应式状态
const pdfUrl = ref('');
const errorMessage = ref('');

// 文件上传处理
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file || !file.type.includes('pdf')) {
    errorMessage.value = '请选择有效的PDF文件';
    return;
  }

  try {
    // 创建临时URL供IFrame加载
    const fileUrl = URL.createObjectURL(file);
    pdfUrl.value = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(fileUrl)}`;
    
    // 清理旧URL
    onUnmounted(() => URL.revokeObjectURL(fileUrl));
  } catch (error) {
    errorMessage.value = '文件加载失败，请重试';
    console.error(error);
  }
}
defineExpose({
  handleFileUpload,
  pdfUrl,
});
</script>

<style scoped>
.pdf-iframe-viewer {
  max-width: 100%;
  margin: 20px auto;
  padding: 20px;
}

.upload-btn {
  display: block;
  padding: 8px 16px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.pdf-iframe {
  width: 100%;
  min-height: 600px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>