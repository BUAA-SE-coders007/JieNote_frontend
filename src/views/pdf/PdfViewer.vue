<template>
  <div class="pdf-wrapper">
    <div class="toolbar">
      <button @click="zoomOut" :disabled="scale <= 0.5">缩小 (-)</button>
      <span>缩放: {{ (scale * 100).toFixed(0) }}%</span>
      <button @click="zoomIn" :disabled="scale >= 3">放大 (+)</button>
      <button @click="resetZoom">重置 (100%)</button>
    </div>
    <div ref="pdfContainer" class="pdf-container"/>
    <div class="controls">
      <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
      <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
      <button @click="clearHighlightsForPage">清除本页高亮</button>
      <button @click="clearAllHighlights">清除所有高亮</button>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref, onMounted, onBeforeUnmount, defineExpose } from 'vue';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { shallowRef } from 'vue';

// pdf.js worker路径配置
GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const pdfContainer = shallowRef(null);
const pdfUrl = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';

const pdfInstance = shallowRef(null);
const currentPage = ref(1);
const totalPages = ref(0);
const highlights = ref([]); // 所有高亮记录（来自后端）
const scale = ref(1.0); // 缩放比例
const MIN_SCALE = 0.5;
const MAX_SCALE = 3.0;
const SCALE_STEP = 0.25;

// 加载 PDF 文档
const loadPdf = async () => {
  try {
    const loadingTask = getDocument(pdfUrl);
    pdfInstance.value = await loadingTask.promise;
    totalPages.value = pdfInstance.value.numPages;
    await renderPage(currentPage.value);
    await loadHighlightsFromServer(); // 加载后端高亮数据
    console.log('PDF加载成功，当前页:', currentPage.value);
  } catch (error) {
    console.error('加载 PDF 失败:', error);
  }
};

// 渲染页面及文本层
const renderPage = async (pageNum) => {
  if (!pdfInstance.value || !pdfContainer.value) return;
  pdfContainer.value.innerHTML = ''; // 清空容器

  const page = await pdfInstance.value.getPage(pageNum);
  const viewport = page.getViewport({ scale: scale.value });

  // 创建Canvas层
  const canvas = document.createElement('canvas');
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '1'; // Canvas层z-index为1
  pdfContainer.value.appendChild(canvas);

  const context = canvas.getContext('2d');
  await page.render({ canvasContext: context, viewport }).promise;

  // 创建文本层
  const textLayerDiv = document.createElement('div');
  textLayerDiv.className = 'textLayer';
  textLayerDiv.style.position = 'absolute';
  textLayerDiv.style.top = '0';
  textLayerDiv.style.left = '0';
  textLayerDiv.style.height = `${viewport.height}px`;
  textLayerDiv.style.width = `${viewport.width}px`;
  textLayerDiv.style.zIndex = '2'; // 文本层z-index为2，高于Canvas层
  textLayerDiv.style.pointerEvents = 'auto'; // 允许文本层接收鼠标事件
  textLayerDiv.style.overflow = 'hidden'; // 防止文本溢出
  // 半透明背景，仅用于调试，实际使用时可注释掉
  textLayerDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; 
  pdfContainer.value.appendChild(textLayerDiv);

  // 添加文本内容
  const textContent = await page.getTextContent();
  textContent.items.forEach((item) => {
    const span = document.createElement('span');
    span.textContent = item.str;
    const tx = pdfjsTransformToDOM(item.transform, viewport.height);
    span.style.position = 'absolute';
    span.style.left = `${tx.x}px`;
    span.style.top = `${tx.y}px`;
    span.style.fontSize = `${tx.fontHeight}px`;
    span.style.transform = `scaleX(${tx.scaleX})`;
    span.style.transformOrigin = 'left top';
    span.style.webkitTextStrokeWidth = '0.5px'; // 增加文本轮廓，使其更明显
    span.style.webkitTextStrokeColor = 'rgba(0, 0, 0, 0.1)'; // 文本轮廓颜色
    span.classList.add('pdf-text-item');
    textLayerDiv.appendChild(span);
  });

  console.log(`页面 ${pageNum} 渲染完成，文本项数量:`, textLayerDiv.children.length);
  restoreHighlightsForPage(pageNum);
};

// PDF坐标系到DOM坐标系转换（简单版本）
function pdfjsTransformToDOM(transform, viewportHeight) {
  const [a, b, c, d, e, f] = transform;
  const x = e;
  const y = viewportHeight - f;
  const fontHeight = Math.sqrt(c * c + d * d);
  const scaleX = a / fontHeight;
  return { x, y, fontHeight, scaleX };
}

// 翻页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    renderPage(currentPage.value);
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
    renderPage(currentPage.value);
  }
};

// 缩放控制
const zoomIn = () => {
  if (scale.value < MAX_SCALE) {
    scale.value += SCALE_STEP;
    renderPage(currentPage.value);
  }
};

const zoomOut = () => {
  if (scale.value > MIN_SCALE) {
    scale.value -= SCALE_STEP;
    renderPage(currentPage.value);
  }
};

const resetZoom = () => {
  scale.value = 1.0;
  renderPage(currentPage.value);
};

// 滚轮缩放
const handleWheel = (e) => {
  e.preventDefault();
  if (e.ctrlKey || e.metaKey) {
    let newScale = scale.value;
    if (e.deltaY < 0) {
      newScale += SCALE_STEP;
    } else {
      newScale -= SCALE_STEP;
    }
    newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
    if (newScale !== scale.value) {
      scale.value = newScale;
      renderPage(currentPage.value);
    }
  }
};

// 选中文字高亮
const highlightSelection = () => {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) return;
  if (!pdfContainer.value) return;
  if (selection.type !== 'Range') return;

  const range = selection.getRangeAt(0);
  const rects = range.getClientRects();

  const items = pdfContainer.value.querySelectorAll('.pdf-text-item');
  const highlightedItems = [];
  
  // 找出所有被选中的文本项
  items.forEach((el) => {
    const elRect = el.getBoundingClientRect();
    for (const selRect of rects) {
      const overlap =
        elRect.left < selRect.right &&
        elRect.right > selRect.left &&
        elRect.top < selRect.bottom &&
        elRect.bottom > selRect.top;
      if (overlap) {
        highlightedItems.push(el);
        break;
      }
    }
  });

  // 如果有选中的文本项，创建高亮
  if (highlightedItems.length > 0) {
    const highlightId = uuidv4();
    const text = highlightedItems.map(el => el.textContent).join('');
    
    highlightedItems.forEach((el) => {
      el.classList.add('highlighted');
      el.dataset.highlightId = highlightId;
    });
    
    const record = {
      id: highlightId,
      page: currentPage.value,
      text: text,
      items: highlightedItems.map(el => ({
        text: el.textContent,
        left: parseFloat(el.style.left),
        top: parseFloat(el.style.top),
        fontSize: parseFloat(el.style.fontSize)
      }))
    };
    
    highlights.value.push(record);
    saveHighlightToServer(record);
    console.log('创建高亮:', record);
  }
  
  selection.removeAllRanges();
};

// 保存高亮记录到后端
const saveHighlightToServer = async (record) => {
  try {
    // TODO: 替换成你的后端接口地址
    await axios.post('/api/highlight', record);
    console.log('保存成功:', record);
  } catch (error) {
    console.error('保存失败:', error);
  }
};

// 从后端加载所有高亮记录
const loadHighlightsFromServer = async () => {
  try {
    // TODO: 替换成你的后端接口地址
    const { data } = await axios.get('/api/highlight');
    highlights.value = data;
    console.log('加载高亮记录:', highlights.value.length);
    renderPage(currentPage.value);
  } catch (error) {
    console.error('拉取高亮失败:', error);
  }
};

// 恢复本页高亮
const restoreHighlightsForPage = (pageNum) => {
  const pageHighlights = highlights.value.filter((h) => h.page === pageNum);
  if (!pdfContainer.value || pageHighlights.length === 0) return;
  
  const items = pdfContainer.value.querySelectorAll('.pdf-text-item');
  
  pageHighlights.forEach((highlight) => {
    highlight.items.forEach((itemData) => {
      items.forEach((el) => {
        if (
          el.textContent === itemData.text &&
          Math.abs(parseFloat(el.style.left) - itemData.left) < 2 &&
          Math.abs(parseFloat(el.style.top) - itemData.top) < 2 &&
          Math.abs(parseFloat(el.style.fontSize) - itemData.fontSize) < 1
        ) {
          el.classList.add('highlighted');
          el.dataset.highlightId = highlight.id;
        }
      });
    });
  });
  
  console.log(`恢复页面 ${pageNum} 高亮，数量:`, pageHighlights.length);
};

// 清除本页高亮（仅 UI，不删除后端）
const clearHighlightsForPage = () => {
  if (!pdfContainer.value) return;
  const items = pdfContainer.value.querySelectorAll('.pdf-text-item.highlighted');
  items.forEach((el) => {
    el.classList.remove('highlighted');
    delete el.dataset.highlightId;
  });
  console.log(`清除页面 ${currentPage.value} 高亮`);
};

// 清除所有高亮（本地+后端）
const clearAllHighlights = async () => {
  try {
    // TODO: 替换成你的后端接口地址
    await axios.delete('/api/highlight');
    highlights.value = [];
    renderPage(currentPage.value);
    console.log('清除所有高亮');
  } catch (error) {
    console.error('清除所有高亮失败:', error);
  }
};

const goToPage = (pageNum) => {
  if (pageNum >= 1 && pageNum <= totalPages.value) {
    currentPage.value = pageNum;
    renderPage(pageNum);
  }
};

defineExpose({ goToPage });

onMounted(() => {
  loadPdf();
  document.addEventListener('mouseup', highlightSelection);
  pdfContainer.value.addEventListener('wheel', handleWheel, { passive: false });
});

onBeforeUnmount(() => {
  document.removeEventListener('mouseup', highlightSelection);
  pdfContainer.value.removeEventListener('wheel', handleWheel);
});
</script>

<style scoped>
.pdf-wrapper {
  max-width: 1000px;
  margin: auto;
  user-select: text;
  position: relative;
}

.toolbar {
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
  gap: 8px;
  user-select: none;
}

.pdf-container {
  position: relative;
  border: 1px solid #ccc;
  min-height: 600px;
  overflow: auto;
  cursor: default;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.textLayer {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  user-select: text;
  color: black;
}

.pdf-text-item {
  cursor: text;
  white-space: pre;
  color: black;
  user-select: text;
  /* 仅用于调试，实际使用时可注释掉 */
  /* outline: 1px solid rgba(0, 0, 255, 0.1); */
}

.pdf-text-item.highlighted {
  background-color: rgba(255, 255, 0, 0.5);
  color: black;
  z-index: 3;
  position: relative;
}

.controls {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  gap: 8px;
  user-select: none;
}

button {
  padding: 6px 12px;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>