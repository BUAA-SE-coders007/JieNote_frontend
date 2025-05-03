<template>
  <div class="md-editor-container" :class="{ 'hide-toolbar': hideToolbar }">
    <div 
      class="toolbar-trigger-area" 
      @mouseenter="showToolbar = true" 
      @mouseleave="showToolbar = false"
      :class="{ 'inactive': showToolbar }"
    ></div>
    <div 
      class="catalog-trigger-area" 
      @mouseenter="showCatalog = true" 
      @mouseleave="showCatalog = false"
      :class="{ 'inactive': showCatalog }"
    ></div>
    
    <MdEditor
      v-model="content"
      :theme="theme"
      :toolbars="toolbars"
      :preview="'live'"
      :language="language"
      :style="editorStyle"
      @onSave="handleSave"
      @onUploadImg="handleUploadImg"
      @onChange="handleChange"
      @onError="handleError"
      ref="mdEditorRef"
    />
  </div>
</template>

<script>
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { ref, onMounted, watch, computed } from 'vue';
import { updateNote } from '@/api/note';
import { ElMessage } from 'element-plus';

export default {
  name: 'CustomMdEditor',
  components: {
    MdEditor,
  },
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    height: {
      type: Number,
      default: 600,
    },
    autoSave: {
      type: Boolean,
      default: false,
    },
    noteId: {
      type: String,
      default: null,
    },
    autoFocus: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      default: 'light',
    },
    hideToolbar: {
      type: Boolean,
      default: false,
    },
    fullHeight: {
      type: Boolean,
      default: true,
    }
  },
  emits: ['update:modelValue', 'save', 'change', 'error'],
  setup(props, { emit }) {
    const mdEditorRef = ref(null);
    const content = ref(props.modelValue);
    const updating = ref(false);
    const preview = ref(true);
    const showToolbar = ref(false);
    const showCatalog = ref(false);

    // 计算编辑器样式，设置高度
    const editorStyle = computed(() => {
      if (props.fullHeight) {
        return {
          height: 'calc(100vh - 100px)',
        };
      }
      return {
        height: `${props.height}px`,
      };
    });

    // 配置工具栏
    const toolbars = [
      'bold', 'underline', 'italic', 'strikethrough', '-',
      'title', 'quote', 'unorderedList', 'orderedList', 'task', '-',
      'codeRow', 'code', 'link', 'image', 'table', 'mermaid', '-',
      'revoke', 'next', 'save', '=',
      'preview', 'htmlPreview', 'catalog', 'fullscreen'
    ];

    // 设置语言
    const language = 'zh-CN';

    // 监听值变化
    watch(() => props.modelValue, (newValue) => {
      if (newValue !== content.value) {
        content.value = newValue;
      }
    });

    watch(() => content.value, (newValue) => {
      emit('update:modelValue', newValue);
    });

    const handleChange = (value) => {
      emit('change', value);
    };

    const handleError = (err) => {
      console.error(`编辑器错误: ${err.message}`);
      emit('error', err);
    };

    const handleSave = async (content) => {
      if (props.autoSave && props.noteId) {
        await saveNote(content);
      }
      emit('save', content);
    };

    const saveNote = async (content) => {
      if (updating.value) return;
      updating.value = true;

      try {
        const noteId = props.noteId;
        await updateNote(noteId, { content });
        ElMessage.success("笔记已更新");
      } catch (e) {
        ElMessage.error(`更新失败: ${e.message}`);
        console.error("更新失败", e);
      } finally {
        updating.value = false;
      }
    };

    const handleUploadImg = async (files, callback) => {
      try {
        ElMessage.info("图片上传功能尚未实现");
        // 这里后续可以接入专门的图片上传 API
        // 目前简单返回空数组，避免报错
        callback([]);
      } catch (error) {
        ElMessage.error("图片上传失败");
        console.error("图片上传失败", error);
      }
    };

    onMounted(() => {
      if (props.autoFocus && mdEditorRef.value) {
        mdEditorRef.value.focus();
      }
    });

    const insertContent = (text) => {
      if (mdEditorRef.value) {
        mdEditorRef.value.insert(() => {
          return {
            targetValue: text,
            select: true,
            deviationStart: 0,
            deviationEnd: 0,
          };
        });
      }
    };

    const getValue = () => {
      return content.value;
    };

    return {
      content,
      toolbars,
      language,
      preview,
      mdEditorRef,
      updating,
      showToolbar,
      showCatalog,
      editorStyle,
      handleChange,
      handleError,
      handleSave,
      handleUploadImg,
      insertContent,
      getValue,
    };
  },
};
</script>

<style scoped>
.md-editor-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* 增大触发区域 */
.toolbar-trigger-area {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 25px; /* 从15px增加到25px */
  z-index: 20; /* 提高z-index确保可以触发 */
  cursor: pointer;
  /* 当触发区域处于活动状态时改变指针样式，表示它现在只是显示而不可交互 */
  pointer-events: auto;
  transition: opacity 0.3s ease;
}

.catalog-trigger-area {
  position: absolute;
  top: 46px; /* 工具栏高度后 */
  right: 0;
  width: 30px;
  bottom: 0;
  z-index: 20; /* 提高z-index确保可以触发 */
  cursor: pointer;
  pointer-events: auto;
  transition: opacity 0.3s ease;
}

/* 当工具栏或目录显示时，使触发区域不再捕获鼠标事件 */
.toolbar-trigger-area.inactive,
.catalog-trigger-area.inactive {
  pointer-events: none;
  opacity: 0;
}

/* 设置编辑区和预览区比例为5:3 */
:deep(.md-editor-content) {
  display: flex;
  height: 100%;
  margin-top: 46px !important; /* 为工具栏预留空间 */
}

:deep(.md-editor-content .md-editor-input-wrapper) {
  flex: 5;
  height: 100%;
}

:deep(.md-editor-content .md-editor-preview-wrapper) {
  flex: 3;
  height: 100%;
}

/* 设置编辑器填满容器 */
:deep(.md-editor) {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 重新设置工具栏的样式 */
:deep(.md-editor-toolbar) {
  transition: opacity 0.3s ease, transform 0.3s ease;
  position: absolute !important; /* 改回绝对定位 */
  top: 0;
  left: 0;
  right: 0;
  height: 46px;
  z-index: 10;
  background-color: var(--md-bk-color, #fff);
}

/* 工具栏在悬停触发区域时显示 */
.hide-toolbar :deep(.md-editor-toolbar) {
  opacity: 0;
  visibility: hidden;
  transform: translateY(-100%);
  pointer-events: none;
}

.hide-toolbar:hover .toolbar-trigger-area:not(.inactive) ~ :deep(.md-editor) .md-editor-toolbar,
.hide-toolbar .toolbar-trigger-area:hover ~ :deep(.md-editor) .md-editor-toolbar,
.hide-toolbar :deep(.md-editor-toolbar:hover) {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  pointer-events: auto;
  /* 确保工具栏在显示时的z-index高于触发区域 */
  z-index: 30;
}

/* 目录悬停显示 */
:deep(.md-editor-catalog) {
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: 0;
  visibility: hidden;
  transform: translateX(100%);
}

:deep(.md-editor-catalog):hover,
.catalog-trigger-area:not(.inactive):hover ~ :deep(.md-editor) .md-editor-catalog {
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
  /* 确保目录在显示时的z-index高于触发区域 */
  z-index: 30;
}

/* 触发区域的视觉指示 */
.toolbar-trigger-area:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.catalog-trigger-area:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* 修复列表样式 */
:deep(.md-editor-preview) ol li {
  list-style-type: decimal !important;
}

:deep(.md-editor-preview) ul li {
  list-style-type: disc !important;
}

:deep(.md-editor-preview) ul li ul li {
  list-style-type: circle !important;
}

:deep(.md-editor-toolbar__item),
:deep(.md-editor-toolbar__item > svg) {
  min-width: 28px !important;
  min-height: 28px !important;
}
</style>
