<template>
  <div class="app">
          <div class="save-button-container">
        <el-button
          type="success"
          class="header-save-btn"
          @click="handleSaveNote"
          :loading="isSaving"
          size="small"
          round
        >
          <template #icon>
            <el-icon><EditPen /></el-icon>
          </template>
          <template v-if="!isSaving">
            <span class="save-text">保存批注</span>
          </template>
          <template v-else>
            <el-icon class="loading-icon"><Loading /></el-icon>
            <span class="save-text">保存中…</span>
          </template>
        </el-button>
      </div>
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
let isSaving = ref(false)

function handleSaveNote() {
  console.log('handleSaveNote');
  if (isSaving.value) return;
      
      try {
        isSaving.value = true;
        if (pdfViewerRef.value) {
          pdfViewerRef.value.handleSave();
        }

    } catch (error) {
        console.error("[Note] 保存笔记失败：", error);
    } finally {
        isSaving.value = false;
    }
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
