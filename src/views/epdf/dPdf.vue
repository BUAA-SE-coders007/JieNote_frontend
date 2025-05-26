<template>
  <div class="pdf-container">
    <div class="pdf-annotation-layer" ref="annotationLayer"></div>
    <div class="pdf-viewer" ref="pdfViewer"></div>
    
    <!-- 批注工具栏 -->
    <div class="annotation-toolbar">
      <button @click="addHighlight">高亮</button>
      <button @click="addNote">添加批注</button>
      <button @click="saveAnnotations">保存批注</button>
      <button @click="clearAnnotations">清除批注</button>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref, onMounted, nextTick, watch, defineProps } from 'vue';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

// 引入PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 
 new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();


const props = defineProps({
  pdfUrl: {
    type: String,
    required: true
  }
});

const pdfViewer = ref(null);
const annotationLayer = ref(null);
const pdfDoc = ref(null);
const pageViews = ref([]);
const annotations = ref([]); // 存储所有批注
const isHighlightMode = ref(false);
const isNoteMode = ref(false);

// 加载PDF文件
const loadPDF = async (url) => {
  try {
    // 加载PDF文档
    const loadingTask = pdfjsLib.getDocument(url);
    pdfDoc.value = await loadingTask.promise;
    
    // 渲染PDF的每一页
    for (let i = 1; i <= pdfDoc.value.numPages; i++) {
      await renderPage(i);
    }
    
    // 加载已保存的批注
    loadSavedAnnotations();
  } catch (error) {
    console.error('加载PDF失败:', error);
  }
};

// 渲染PDF页面
const renderPage = async (pageNum) => {
  const page = await pdfDoc.value.getPage(pageNum);
  
  // 设置视口
  const viewport = page.getViewport({ scale: 1.0 });
  
  // 创建页面容器
  const div = document.createElement('div');
  div.className = 'page';
  div.style.width = `${viewport.width}px`;
  div.style.height = `${viewport.height}px`;
  div.dataset.pageNumber = pageNum;
  pdfViewer.value.appendChild(div);
  
  // 创建渲染上下文
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  div.appendChild(canvas);
  
  // 渲染页面
  const renderContext = {
    canvasContext: context,
    viewport: viewport
  };
  await page.render(renderContext).promise;
  
  // 创建文本层
  const textLayerDiv = document.createElement('div');
  textLayerDiv.className = 'textLayer';
  div.appendChild(textLayerDiv);
  
  // 渲染文本层
  const textContent = await page.getTextContent();
  const textLayerBuilder = new pdfjsLib.render.TextLayerBuilder({
    textLayerDiv: textLayerDiv,
    pageIndex: pageNum - 1,
    viewport: viewport
  });
  textLayerBuilder.setTextContent(textContent);
  textLayerBuilder.render();
  
  // 存储页面信息
  pageViews.value.push({
    pageNum,
    div,
    viewport
  });
  
  // 设置页面的点击和选择事件
  setupPageEvents(div, pageNum);
};

// 设置页面事件监听
const setupPageEvents = (pageDiv, pageNum) => {
  // 监听文本选择事件，用于高亮
  pageDiv.addEventListener('mouseup', (e) => {
    if (isHighlightMode.value) {
      const selection = window.getSelection();
      if (selection.toString().length > 0) {
        createHighlightFromSelection(selection, pageNum);
        isHighlightMode.value = false;
      }
    }
  });
  
  // 监听点击事件，用于添加批注
  pageDiv.addEventListener('click', (e) => {
    if (isNoteMode.value) {
      createNote(e, pageNum);
      isNoteMode.value = false;
    }
  });
};

// 从选中文本创建高亮
const createHighlightFromSelection = (selection, pageNum) => {
  const range = selection.getRangeAt(0);
  
  // 获取选中文本的边界矩形
  const rects = range.getClientRects();
  const pageRect = pageViews.value.find(p => p.pageNum === pageNum).div.getBoundingClientRect();
  
  const highlightRects = [];
  for (let i = 0; i < rects.length; i++) {
    const rect = rects[i];
    // 计算相对于页面的位置
    const highlightRect = {
      left: rect.left - pageRect.left,
      top: rect.top - pageRect.top,
      width: rect.width,
      height: rect.height
    };
    
    highlightRects.push(highlightRect);
    
    // 创建高亮元素
    const highlightSpan = document.createElement('div');
    highlightSpan.className = 'highlight';
    highlightSpan.style.position = 'absolute';
    highlightSpan.style.left = `${highlightRect.left}px`;
    highlightSpan.style.top = `${highlightRect.top}px`;
    highlightSpan.style.width = `${highlightRect.width}px`;
    highlightSpan.style.height = `${highlightRect.height}px`;
    highlightSpan.style.backgroundColor = 'rgba(255, 255, 0, 0.5)';
    highlightSpan.style.pointerEvents = 'none'; // 允许点击穿透到文本层
    highlightSpan.dataset.id = `highlight-${annotations.value.length}`;
    annotationLayer.value.appendChild(highlightSpan);
  }
  
  // 创建批注对象并保存
  const annotation = {
    id: `highlight-${annotations.value.length}`,
    type: 'highlight',
    pageNum,
    text: selection.toString(),
    rects: highlightRects,
    color: 'rgba(255, 255, 0, 0.5)'
  };
  
  annotations.value.push(annotation);
  selection.removeAllRanges();
};

// 创建文本批注
const createNote = (event, pageNum) => {
  const noteText = prompt('请输入批注内容:');
  if (!noteText) return;
  
  // 获取页面相对于视口的位置
  const pageDiv = pageViews.value.find(p => p.pageNum === pageNum).div;
  const pageRect = pageDiv.getBoundingClientRect();
  
  // 计算批注相对于页面的位置
  const noteX = event.clientX - pageRect.left;
  const noteY = event.clientY - pageRect.top;
  
  // 创建批注元素
  const noteId = `note-${annotations.value.length}`;
  const noteDiv = document.createElement('div');
  noteDiv.className = 'annotation-note';
  noteDiv.style.position = 'absolute';
  noteDiv.style.left = `${noteX}px`;
  noteDiv.style.top = `${noteY}px`;
  noteDiv.style.backgroundColor = 'rgba(255, 255, 200, 0.8)';
  noteDiv.style.border = '1px solid #ccc';
  noteDiv.style.padding = '5px';
  noteDiv.style.maxWidth = '200px';
  noteDiv.style.zIndex = '100';
  noteDiv.dataset.id = noteId;
  noteDiv.innerHTML = `
    <div class="note-header">
      <div class="note-marker" style="width: 16px; height: 16px; background-color: yellow; border-radius: 50%; border: 1px solid #aaa; display: inline-block; margin-right: 5px;"></div>
      <span class="note-title">批注</span>
      <button class="note-delete" style="float: right; background: none; border: none; cursor: pointer;">×</button>
    </div>
    <div class="note-content">${noteText}</div>
  `;
  
  // 添加删除功能
  noteDiv.querySelector('.note-delete').addEventListener('click', (e) => {
    e.stopPropagation();
    deleteAnnotation(noteId);
  });
  
  annotationLayer.value.appendChild(noteDiv);
  
  // 创建批注对象并保存
  const annotation = {
    id: noteId,
    type: 'note',
    pageNum,
    x: noteX,
    y: noteY,
    text: noteText
  };
  
  annotations.value.push(annotation);
};

// 删除批注
const deleteAnnotation = (id) => {
  annotations.value = annotations.value.filter(anno => anno.id !== id);
  renderAnnotations();
};

// 保存所有批注
const saveAnnotations = () => {
  try {
    const fileName = props.pdfUrl.split('/').pop().replace(/\.[^/.]+$/, '') + '_annotations.json';
    const dataStr = JSON.stringify(annotations.value, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // 创建下载链接
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(dataBlob);
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    alert('批注已保存！');
  } catch (error) {
    console.error('保存批注失败:', error);
    alert('保存批注失败！');
  }
};

// 加载已保存的批注
const loadSavedAnnotations = () => {
  try {
    // 尝试从localStorage加载
    const savedKey = `annotations_${props.pdfUrl}`;
    const savedAnnotations = localStorage.getItem(savedKey);
    
    if (savedAnnotations) {
      annotations.value = JSON.parse(savedAnnotations);
      renderAnnotations();
    }
  } catch (error) {
    console.error('加载批注失败:', error);
  }
};

// 渲染所有批注
const renderAnnotations = () => {
  // 清除现有批注层
  annotationLayer.value.innerHTML = '';
  
  // 重新渲染所有批注
  annotations.value.forEach(annotation => {
    if (annotation.type === 'highlight') {
      // 渲染高亮
      annotation.rects.forEach(rect => {
        const highlightSpan = document.createElement('div');
        highlightSpan.className = 'highlight';
        highlightSpan.style.position = 'absolute';
        highlightSpan.style.left = `${rect.left}px`;
        highlightSpan.style.top = `${rect.top}px`;
        highlightSpan.style.width = `${rect.width}px`;
        highlightSpan.style.height = `${rect.height}px`;
        highlightSpan.style.backgroundColor = annotation.color || 'rgba(255, 255, 0, 0.5)';
        highlightSpan.style.pointerEvents = 'none';
        highlightSpan.dataset.id = annotation.id;
        annotationLayer.value.appendChild(highlightSpan);
      });
    } else if (annotation.type === 'note') {
      // 渲染批注
      const noteDiv = document.createElement('div');
      noteDiv.className = 'annotation-note';
      noteDiv.style.position = 'absolute';
      noteDiv.style.left = `${annotation.x}px`;
      noteDiv.style.top = `${annotation.y}px`;
      noteDiv.style.backgroundColor = 'rgba(255, 255, 200, 0.8)';
      noteDiv.style.border = '1px solid #ccc';
      noteDiv.style.padding = '5px';
      noteDiv.style.maxWidth = '200px';
      noteDiv.style.zIndex = '100';
      noteDiv.dataset.id = annotation.id;
      noteDiv.innerHTML = `
        <div class="note-header">
          <div class="note-marker" style="width: 16px; height: 16px; background-color: yellow; border-radius: 50%; border: 1px solid #aaa; display: inline-block; margin-right: 5px;"></div>
          <span class="note-title">批注</span>
          <button class="note-delete" style="float: right; background: none; border: none; cursor: pointer;">×</button>
        </div>
        <div class="note-content">${annotation.text}</div>
      `;
      
      // 添加删除功能
      noteDiv.querySelector('.note-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteAnnotation(annotation.id);
      });
      
      annotationLayer.value.appendChild(noteDiv);
    }
  });
};

// 添加高亮功能
const addHighlight = () => {
  isHighlightMode.value = true;
  isNoteMode.value = false;
  alert('高亮模式已激活，请选择文本');
};

// 添加批注功能
const addNote = () => {
  isNoteMode.value = true;
  isHighlightMode.value = false;
  alert('批注模式已激活，请点击PDF添加批注');
};

// 清除所有批注
const clearAnnotations = () => {
  if (confirm('确定要清除所有批注吗？此操作不可撤销。')) {
    annotations.value = [];
    renderAnnotations();
  }
};

onMounted(() => {
  // 加载PDF
  loadPDF(props.pdfUrl);
  
  // 设置批注层样式
  annotationLayer.value.style.position = 'absolute';
  annotationLayer.value.style.top = '0';
  annotationLayer.value.style.left = '0';
  annotationLayer.value.style.width = '100%';
  annotationLayer.value.style.height = '100%';
  annotationLayer.value.style.pointerEvents = 'auto'; // 允许交互
});

// 监听annotations变化，更新localStorage
watch(annotations, (newValue) => {
  try {
    const savedKey = `annotations_${props.pdfUrl}`;
    localStorage.setItem(savedKey, JSON.stringify(newValue));
  } catch (error) {
    console.error('保存批注到localStorage失败:', error);
  }
});
</script>

<style scoped>
.pdf-container {
  position: relative;
  width: 100%;
  height: 800px;
  overflow: auto;
}

.pdf-viewer {
  position: relative;
  padding: 20px;
}

.page {
  margin-bottom: 20px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  background-color: white;
  position: relative;
}

.textLayer {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  color: transparent;
  font-family: sans-serif;
  overflow: hidden;
  opacity: 0.9;
  line-height: 1.0;
}

.textLayer > span {
  color: transparent;
  position: absolute;
  white-space: pre;
  cursor: text;
  transform-origin: 0% 0%;
}

.annotation-toolbar {
  position: fixed;
  top: 10px;
  right: 10px;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  z-index: 200;
  display: flex;
  gap: 10px;
}

.annotation-toolbar button {
  padding: 5px 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
}

.annotation-toolbar button:hover {
  background-color: #e0e0e0;
}

.highlight {
  transition: all 0.2s ease;
  border-radius: 2px;
}

.highlight:hover {
  opacity: 0.7;
}

.annotation-note {
  transition: all 0.2s ease;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.annotation-note:hover {
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}

.note-header {
  margin-bottom: 5px;
  padding-bottom: 2px;
  border-bottom: 1px solid #eee;
}

.note-title {
  font-weight: bold;
  font-size: 14px;
}

.note-content {
  font-size: 14px;
  line-height: 1.4;
}
</style>    