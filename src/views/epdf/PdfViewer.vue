<template>
  <div class="pdf-container" ref="containerRef">
    <div
      v-for="(page, index) in pages"
      :key="index"
      class="pdf-page"
      :style="{ transform: `scale(${scale})` }"
    >
      <canvas :ref="el => setCanvasRef(el, index)" />
      <div class="textLayer" :ref="el => setTextLayerRef(el, index)" />
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref, onMounted, onBeforeUnmount,nextTick } from 'vue';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { TextLayer } from 'pdfjs-dist';
import { shallowRef } from 'vue';

// 设置 PDF.js 的 worker 路径
GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const pdfUrl = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';

const containerRef = shallowRef(null);
const pages = shallowRef([]);
const canvasRefs = shallowRef([]);
const textLayerRefs = shallowRef([]);
const scale = shallowRef(1.0);

const setCanvasRef = (el, index) => {
  if (el) canvasRefs.value[index] = el;
};

const setTextLayerRef = (el, index) => {
  if (el) textLayerRefs.value[index] = el;
};

const renderPage = async (page, index) => {
  const viewport = page.getViewport({ scale: scale.value });
  const canvas = canvasRefs.value[index];
  const context = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  // 渲染 PDF 页面到 canvas
  await page.render({ canvasContext: context, viewport }).promise;

  // 获取文本内容并渲染文本图层
  const textContent = await page.getTextContent();
  const textLayerDiv = textLayerRefs.value[index];
  const textLayer = new TextLayer({
    textContentSource: textContent,
    container: textLayerDiv,
    viewport,
  });
  await textLayer.render();
};

onMounted(async () => {
  const loadingTask = getDocument(pdfUrl);
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  // 初始化页面数组
  pages.value = Array.from({ length: numPages }, (_, i) => i + 1);

  // 等待 DOM 更新后渲染每一页
  await nextTick();
  for (let i = 0; i < numPages; i++) {
    const page = await pdf.getPage(i + 1);
    await renderPage(page, i);
  }
});
</script>

<style scoped>
.pdf-container {
  width: 100%;
  overflow: auto;
  background-color: #f0f0f0;
  padding: 16px;
}

.pdf-page {
  position: relative;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.textLayer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}
</style>
