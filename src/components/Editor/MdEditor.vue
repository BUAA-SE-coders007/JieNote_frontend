<template>
  <div class="md-editor-container" :class="{ 'hide-toolbar': hideToolbar }">
    <div class="toolbar-hover-area" @mouseenter="showToolbar = true" @mouseleave="showToolbar = false">
      <MdEditor
        v-model="content"
        :theme="theme"
        :toolbars="toolbars"
        :preview="'live'"
        :language="language"
        @onSave="handleSave"
        @onUploadImg="handleUploadImg"
        @onChange="handleChange"
        @onError="handleError"
        ref="mdEditorRef"
      />
    </div>
  </div>
</template>

<script>
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

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
    }
  },
  emits: ['update:modelValue', 'save', 'change', 'error'],
  setup(props, { emit }) {
    const mdEditorRef = ref(null);
    const content = ref(props.modelValue);
    const updating = ref(false);
    const preview = ref(true);
    const showToolbar = ref(false);

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
        await axios.put(`http://localhost:8000/notes/${noteId}`, {
          content,
        });
        console.log("笔记已更新");
      } catch (e) {
        console.error("更新失败", e);
      } finally {
        updating.value = false;
      }
    };

    const handleUploadImg = async (files, callback) => {
      try {
        const res = await Promise.all(
          files.map((file) => {
            return new Promise((resolve, reject) => {
              const formData = new FormData();
              formData.append('file', file);
              
              // 这里应该使用你自己的上传API
              axios.post('http://localhost:8000/upload', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              })
              .then((response) => {
                resolve(response);
              })
              .catch((error) => {
                reject(error);
              });
            });
          })
        );
        
        // 回调函数返回上传后的URL列表
        callback(res.map((item) => item.data.url));
      } catch (error) {
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
  margin: 0 auto;
  position: relative;
}

/* 添加悬停感应区域 */
.toolbar-hover-area {
  position: relative;
  width: 100%;
}

/* 设置编辑区和预览区比例为5:3 */
:deep(.md-editor-content) {
  display: flex;
}

:deep(.md-editor-content .md-editor-input-wrapper) {
  flex: 5;
}

:deep(.md-editor-content .md-editor-preview-wrapper) {
  flex: 3;
}

/* 改进工具栏隐藏/显示机制，防止内容区域移动 */
:deep(.md-editor) {
  position: relative;
}

:deep(.md-editor-toolbar) {
  transition: opacity 0.3s ease, transform 0.3s ease;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  background-color: var(--md-bk-color, #fff);
}

.hide-toolbar :deep(.md-editor-toolbar) {
  opacity: 0;
  visibility: hidden;
  transform: translateY(-100%);
  pointer-events: none;
}

.hide-toolbar .toolbar-hover-area:hover :deep(.md-editor-toolbar),
.hide-toolbar :deep(.md-editor-toolbar:hover) {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  pointer-events: auto;
}

/* 确保内容区域不会移动 */
:deep(.md-editor-content) {
  padding-top: 0 !important; /* 重要：覆盖原来可能的内边距 */
  margin-top: 46px; /* 给工具栏预留空间，这个高度根据实际工具栏高度调整 */
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
