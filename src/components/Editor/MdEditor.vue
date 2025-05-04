<template>
  <div class="md-editor-container">
    <MdEditor
      v-model="content"
      :theme="theme"
      :toolbars="toolbars"
      :preview="'live'"
      :language="language"
      :style="editorStyle"
      :dragWidth="dragWidth"
      @onSave="handleSave"
      @onUploadImg="handleUploadImg"
      @onChange="handleChange"
      @onError="handleError"
      @onDragWidth="handleDragWidth"
      ref="mdEditorRef"
    />
  </div>
</template>

<script>
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { ref, onMounted, watch, computed } from 'vue';
import { updateNote, getNotes } from '@/api/note';
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
    fullHeight: {
      type: Boolean,
      default: true,
    },
    dragWidth: {
      type: String,
      default: '50%', // 默认编辑区和预览区等宽
    }
  },
  emits: ['update:modelValue', 'save', 'change', 'error', 'dragWidth'],
  setup(props, { emit }) {
    const mdEditorRef = ref(null);
    const content = ref(props.modelValue);
    const updating = ref(false);
    const preview = ref(true);

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

    // 监听值变化和noteId变化
    watch(() => props.modelValue, (newValue) => {
      if (newValue !== content.value) {
        content.value = newValue;
      }
    });
    
    // 监听noteId变化，以便加载不同的笔记
    watch(() => props.noteId, async (newNoteId, oldNoteId) => {
      if (newNoteId && newNoteId !== oldNoteId) {
        await fetchNoteContent(newNoteId);
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

    // 获取笔记内容
    const fetchNoteContent = async (noteId) => {
      try {
        const response = await getNotes({ id: noteId });
        if (response && response.status === 200 && response.data.notes && response.data.notes.length > 0) {
          content.value = response.data.notes[0].content || '';
          emit('update:modelValue', content.value);
          return content.value;
        }
        return null;
      } catch (error) {
        console.error('获取笔记内容失败:', error);
        ElMessage.error('获取笔记内容失败');
        return null;
      }
    };

    onMounted(async () => {
      // 如果有noteId，则获取笔记内容
      if (props.noteId) {
        await fetchNoteContent(props.noteId);
      }
      
      // 自动聚焦
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

    // 处理拖拽宽度变化
    const handleDragWidth = (width) => {
      emit('dragWidth', width);
    };

    return {
      content,
      toolbars,
      language,
      preview,
      mdEditorRef,
      updating,
      editorStyle,
      handleChange,
      handleError,
      handleSave,
      handleUploadImg,
      handleDragWidth,
      insertContent,
      getValue,
      fetchNoteContent // 导出这个方法供外部使用
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

/* 设置编辑区和预览区可以调整大小 */
:deep(.md-editor-content) {
  display: flex;
  height: 100%;
}

:deep(.md-editor-content .md-editor-input-wrapper),
:deep(.md-editor-content .md-editor-preview-wrapper) {
  height: 100%;
}

/* 添加调整大小的手柄样式 */
:deep(.md-editor-input-wrapper .input-box .drag-handle) {
  background-color: var(--md-border-color);
  transition: all 0.3s ease;
}

:deep(.md-editor-input-wrapper .input-box .drag-handle:hover) {
  background-color: var(--md-border-hover-color);
}

/* 设置编辑器填满容器 */
:deep(.md-editor) {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 工具栏样式 */
:deep(.md-editor-toolbar) {
  height: 46px;
  z-index: 10;
  background-color: var(--md-bk-color, #fff);
}

:deep(.md-editor-toolbar__item),
:deep(.md-editor-toolbar__item > svg) {
  min-width: 28px !important;
  min-height: 28px !important;
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

</style>
