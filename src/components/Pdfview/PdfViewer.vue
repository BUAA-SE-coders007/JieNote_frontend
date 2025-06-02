
<template>
  <div class="pdf-iframe-viewer">
    <div class="toolbar">
      <div class="left-tools">
        <div class="file-header">
          <span class="file-icon">📄</span>
          <span class="file-name">{{ props.fileName }}</span>
        </div>
      </div>

      <div class="time-info">
        <div class="time-item" v-if = "props.lastModified">
          <el-icon class="icon"><Calendar /></el-icon>
          <span >最近修改：{{ displayLastModified }}</span>
        </div>
        <div class="time-item">
          <el-icon class="icon"><Clock /></el-icon>
          <span>当前时间：{{ currentTime }}</span>
        </div>
      </div>

      <div class="action-buttons">
        <div
          v-if="pdfUrl && write"
          class="save-btn"
          :class="{ 'is-loading': isSaving }"
          @click="handleSave"
        >
          <el-icon class="icon"><Document /></el-icon>
          <span v-show="!isSaving">保存</span>
          <span v-show="isSaving">
            保存中 <span class="spinner">.</span><span class="spinner">.</span><span class="spinner">.</span>
          </span>
        </div>
      </div>
    </div>

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
let countdownTimer = null
const BASE_URL = 'https://jienote.top/pdfjs/web/viewer.html'

// 新增当前时间响应式变量
const currentTime = ref('');

// 时间格式化函数
function formatDate(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0] + ' ' + d.toTimeString().split(' ')[0];
}

// 实时更新当前时间（每秒更新）
onMounted(() => {
  currentTime.value = formatDate(new Date());
  const timer = setInterval(() => {
    currentTime.value = formatDate(new Date());
  }, 1000);
  
  // 其他初始化逻辑
  window.addEventListener('message', onMessage)
  if (props.fileUrl) {
    pdfUrl.value = `${BASE_URL}?file=${encodeURIComponent(props.fileUrl)}`
    isLoading.value = true
  }
  
  onUnmounted(() => {
    clearInterval(timer);
    window.removeEventListener('message', onMessage)
    clearInterval(countdownTimer)
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
  
  // 10秒后自动取消加载状态
  countdownTimer = setTimeout(() => {
    isSaving.value = false;
  }, 10000);
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
const displayLastModified = computed(() => {
  return props.lastModified
    ? formatDate(props.lastModified)
    : formatDate(new Date())
})

defineExpose({
  pdfUrl,
})
</script>

<style scoped>
.pdf-iframe-viewer {
  max-width: 1440px;
  margin: 32px auto;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(17, 24, 39, 0.1);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
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
}

.time-info {
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 0.875rem;
  color: #6b7280;
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
  min-height: 400px;
  font-size: 1.125rem;
  color: #6b7280;
  background-color: #f9fafb;
}

.pdf-iframe {
  width: 100%;
  min-height: 700px;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
}
</style>    