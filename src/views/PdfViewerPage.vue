<template>
  <div class="app">
    <h1 class="title">PDF reader example Page</h1>

    <PdfViewer ref="pdfViewerRef"
    fileUrl="https://jienote.top//lhcos-data/a3b0228b-8b03-43be-9d55-26162c3ec9c6.pdf" 
    articleId = "285"
    write = false
    fileName="test.pdf"
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
