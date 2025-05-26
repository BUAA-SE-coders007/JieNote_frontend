<template>
  <div class="app">
    <h1 class="title">PDF 高亮注释系统</h1>

    <PdfViewer ref="pdfViewerRef" />

    <HighlightsManager @jumpToPage="jumpToPage" />
  </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref } from 'vue'
import PdfViewer from './pdf/PdfViewer.vue'
import HighlightsManager from './pdf/HighlightsManager.vue'

const pdfViewerRef = ref(null)

// 接收 HighlightsManager 的跳转事件，转调 PdfViewer 的 goToPage
const jumpToPage = (page) => {
  pdfViewerRef.value.goToPage(page)
}
</script>

<style scoped>
.app {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}
</style>
