<template>
  <div class="pdf-iframe-viewer">
    <div class="toolbar">
        <div class="left-tools">
        <span class="title">📄 {{ props.fileName }}</span>
        <span class="info">最近修改：{{ displayLastModified }}</span>
      </div>
      <div
        v-if="pdfUrl && write"
        class="save-btn"
        :class="{ disabled: isSaving }"
        @click="handleSave"
      >
        <el-icon><Document /></el-icon>
        {{ isSaving ? `保存中(${countdown})` : '保存' }}
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
import { ref, watch, onMounted, onUnmounted, defineExpose, defineProps, computed } from 'vue';
import { ElMessage } from 'element-plus'
import { Document } from '@element-plus/icons-vue'
import {getToken} from '@/utils/auth.js'

const props = defineProps({
  fileUrl: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    default: 'undefined'
  },
  lastModified: {
    type: String,
    default: ''
  },
  articleId: {
    type: String,
    default: ''
  },
  write:{
    type: Boolean,
    default: true

  }
})

const pdfUrl = ref('')
const pdfIframe = ref(null)
const isSaving = ref(false)
const countdown = ref(10)
const isLoading = ref(true)
let countdownTimer = null
const BASE_URL = 'https://jienote.top/pdfjs/web/viewer.html'

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
  startCountdown()
}

function sendMessageToIframe(data) {
  if (pdfIframe.value && pdfIframe.value.contentWindow) {
    console.log('发送消息到iframe', data)
    pdfIframe.value.contentWindow.postMessage(data, '*')
  } else {
    ElMessage.warning('PDF 渲染未完成，请稍后再试')
  }
}

function handleIframeLoad() {
  isLoading.value = false
}

function startCountdown() {
  isSaving.value = true
  countdown.value = 10
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
      isSaving.value = false
    }
  }, 1000)
}

function onMessage(event) {
  console.log('收到iframe消息', event.data)
  if (event.data.type === 'save-success') {
    ElMessage.success('上传成功')
  } else if (event.data.type === 'save-fail') {
    ElMessage.error('上传失败：' + event.data.error)
  }
}

// 格式化时间
function formatDate(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

// 计算展示的修改时间
const displayLastModified = computed(() => {
  return props.lastModified
    ? props.lastModified
    : formatDate(new Date())
})

onMounted(() => {
  window.addEventListener('message', onMessage)
  // 初始值如果有，主动触发一下
  if (props.fileUrl) {
    pdfUrl.value = `${BASE_URL}?file=${encodeURIComponent(props.fileUrl)}`
    isLoading.value = true
  }
})

onUnmounted(() => {
  window.removeEventListener('message', onMessage)
  clearInterval(countdownTimer)
})

defineExpose({
  pdfUrl,
})

</script>

<style scoped>
.pdf-iframe-viewer {
  max-width: 1200px;
  width: 90%;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  background-color: #f6f8fa;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(140, 149, 159, 0.15);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background-color: #f6f8fa;
  border-bottom: 1px solid #d0d7de;
}

.left-tools {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.left-tools .title {
  font-size: 18px;
  font-weight: 600;
  color: #24292f;
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
  margin-bottom: 4px;
}

.left-tools .info {
  font-size: 13px;
  color: #57606a;
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
  line-height: 1.2;
}

.save-btn {
  padding: 8px 14px;
  background-color: #2da44e;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  user-select: none;
  transition: background-color 0.2s;
}

.save-btn:hover {
  background-color: #218739;
}

.save-btn.disabled {
  background-color: #8c959f;
  cursor: not-allowed;
}

.iframe-loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  font-size: 18px;
  color: #656d76;
}

.pdf-iframe {
  flex: 1;
  width: 100%;
  min-height: 600px;
  border: none;
  display: block;
}
</style>
