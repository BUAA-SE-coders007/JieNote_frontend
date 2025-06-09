
<template>
  <div class="pdf-iframe-viewer">
    <!-- loading骨架 -->
    <div v-if="isLoading" class="iframe-loading">📄 PDF 加载中...</div>

    <!-- PDF预览IFrame -->
    <iframe
      v-show="pdfUrl && !isLoading"
      :src="pdfUrl"
      frameborder="0"
      ref="pdfIframe"
      class="pdf-iframe"
      title="PDF Viewer"
      @load="handleIframeLoad"
    ></iframe>
  </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref, watch, onMounted, onUnmounted, computed, defineProps, defineExpose } from 'vue';
import { ElMessage, ElIcon } from 'element-plus';
import { Document, Calendar, Clock } from '@element-plus/icons-vue';
import { getToken } from '@/utils/auth.js';

const props = defineProps({
  fileUrl: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    default: ''
  },
  lastModified: {
    type: String,
    default: ''
  },
  articleId: {
    type: String,
    default: ''
  },
  write: {
    type: Boolean,
    default: true
  }
})

const pdfUrl = ref('')
const pdfIframe = ref(null)
const isSaving = ref(false)
const isLoading = ref(true)
const BASE_URL = 'https://jienote.top/pdfjs/web/viewer.html'



// 新增屏幕宽度检测
const isMobile = ref(window.innerWidth < 600);



// 窗口大小变化事件处理
const handleResize = () => {
  isMobile.value = window.innerWidth < 600;
};

// 实时更新当前时间（每秒更新）
onMounted(() => {
  
  
  // 初始化窗口大小监听
  window.addEventListener('resize', handleResize);
  
  // 其他初始化逻辑
  window.addEventListener('message', onMessage)
  if (props.fileUrl) {
    pdfUrl.value = `${BASE_URL}?file=${encodeURIComponent(props.fileUrl)}`
    isLoading.value = true
  }
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('message', onMessage)
  })
});

// 监听 fileUrl 变化
watch(() => props.fileUrl, (newVal) => {
  if (newVal) {
    pdfUrl.value = `${BASE_URL}?file=${encodeURIComponent(newVal)}`
    console.log('更新 pdfUrl:', pdfUrl.value)
    isLoading.value = true
  }
})

function handleSave() {
  if (isSaving.value) return

  const token = getToken()
  sendMessageToIframe({ type: 'save', token: token, articleId: props.articleId })
  isSaving.value = true;
  
  
}

function sendMessageToIframe(data) {
  if (pdfIframe.value && pdfIframe.value.contentWindow) {
    pdfIframe.value.contentWindow.postMessage(data, '*')
    console.log('发送消息给iframe', data)
  } else {
    ElMessage.warning('PDF 渲染未完成，请稍后再试')
  }
}

function handleIframeLoad() {
  isLoading.value = false
}

function onMessage(event) {
  // if (event.origin !== 'https://jienote.top') return
  console.log('收到iframe消息', event.data)
  if (event.data.type === 'save-success') {
    ElMessage.success('上传成功')
    isSaving.value = false;
  } else if (event.data.type === 'save-fail') {
    ElMessage.error('上传失败：' + event.data.error)
    isSaving.value = false;
  }
}

// 计算展示的修改时间

defineExpose({
  pdfUrl,
  handleSave,
})
</script>

<style scoped>
.pdf-iframe-viewer {
  width: 100%;
  height: 100%;
  margin: 0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(17, 24, 39, 0.1);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.left-tools {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-header {
  display: flex;
  align-items: center;
  gap: 4px;
}

.file-icon {
  font-size: 1.25rem;
  color: #1f2937;
}

.file-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  
  /* 在移动视图下调整字体大小 */
  @media (max-width: 600px) {
    font-size: 1rem;
  }
}

.time-info {
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 0.875rem;
  color: #6b7280;
  
  /* 在移动视图下隐藏 */
  @media (max-width: 600px) {
    display: none;
  }
}

.time-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.time-item .icon {
  font-size: 1rem;
  color: #9ca3af;
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.save-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  color: #3b82f6;
  
  /* 在移动视图下增加宽度 */
  @media (max-width: 600px) {
    padding: 8px 24px;
  }
}

.save-btn:hover {
  background-color: #e9f2ff;
  border-color: #bfdbfe;
}

.save-btn.is-loading {
  cursor: progress;
  opacity: 0.7;
}

.save-btn .spinner {
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.iframe-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 1.125rem;
  color: #6b7280;
  background-color: #f9fafb;
}

.pdf-iframe {
  width: 100%;
  height: 100%;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
}
</style>
