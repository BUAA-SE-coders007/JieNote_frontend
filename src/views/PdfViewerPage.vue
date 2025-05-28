<template>
  <div class="app">
    <h1 class="title">PDF reader example Page</h1>

    <PdfViewer ref="pdfViewerRef"
    fileUrl="https://arxiv.org/pdf/2309.06180" 
    articleId = "123456"
    />

    
  </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref } from 'vue'
import PdfViewer from '@/components/Pdfview/PdfViewer.vue'


const pdfViewerRef = ref(null)


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
