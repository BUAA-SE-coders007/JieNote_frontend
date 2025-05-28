<template>
  <div class="md-editor-container">
    <MdEditor
      v-model="content"
      :theme="theme"
      :toolbars="toolbars"
      :preview="'live'"
      :language="language"
      :dragWidth="dragWidth"
      :catalogLayout="'fixed'"
      :previewTheme="'github'"
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
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { updateNote, getNotes } from '@/api/note';
import { uploadImage } from '@/api/image';
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
    autoSave: {
      type: Boolean,
      default: false,
    },
    autoSaveInterval: {
      type: Number,
      default: 30000, // 默认30秒
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
    dragWidth: {
      type: String,
      default: '50%', // 默认编辑区和预览区等宽
    },
  },
  emits: ['update:modelValue', 'save', 'change', 'error', 'dragWidth'],
  setup(props, { emit }) {
    const mdEditorRef = ref(null);
    const content = ref(props.modelValue);
    const updating = ref(false);
    const preview = ref(true);
    const hasChanges = ref(false); // 标记是否有未保存的更改
    let autoSaveTimer = null;


    // 配置工具栏
    const toolbars = [
      'bold',
      'underline',
      'italic',
      'strikethrough',
      '-',
      'title',
      'quote',
      'unorderedList',
      'orderedList',
      'task',
      '-',
      'codeRow',
      'code',
      'link',
      'image',
      'table',
      'mermaid',
      'katex',
      '-',
      'revoke',
      'next',
      'save',
      '=',
      'preview',
      'previewOnly',
      'catalog',
      'pageFullscreen',
      'fullscreen',
    ];

    const footers = ['markdownTotal', '=', 'scrollSwitch']

    // 设置语言
    const language = 'zh-CN';

    // 监听值变化和noteId变化
    watch(
      () => props.modelValue,
      (newValue) => {
        if (newValue !== content.value) {
          content.value = newValue;
        }
      }
    );

    // 监听noteId变化，以便加载不同的笔记
    watch(
      () => props.noteId,
      async (newNoteId, oldNoteId) => {
        if (newNoteId && newNoteId !== oldNoteId) {
          await fetchNoteContent(newNoteId);
        }
      }
    );

    watch(
      () => content.value,
      (newValue) => {
        emit('update:modelValue', newValue);
      }
    );

    const handleChange = (value) => {
      hasChanges.value = true; // 当内容改变时，标记有未保存的更改
      emit('change', value);
    };

    const handleError = (err) => {
      console.error(`编辑器错误: ${err.message}`);
      emit('error', err);
    };

    const handleSave = async (contentFromEditorEvent) => {
      //手动保存总是尝试保存，并显示通知
      await saveNote(contentFromEditorEvent, true);
      emit('save', contentFromEditorEvent);
    };

    // 添加 showNotification 参数，默认为 false，用于控制是否显示成功消息
    const saveNote = async (currentContent, showNotification = false) => {
      // 确保有 noteId，有改动，并且当前没有正在保存
      if (!props.noteId || !hasChanges.value || updating.value) {
        return;
      }
      updating.value = true;

      try {
        await updateNote(props.noteId, { content: currentContent });
        if (showNotification) {
          ElMessage.success('笔记已保存'); // 手动保存时显示
        }
        hasChanges.value = false; // 保存成功后重置标记
      } catch (e) {
        ElMessage.error(`保存失败: ${e.message}`); // 统一错误信息
        console.error('保存失败', e);
      } finally {
        updating.value = false;
      }
    };

    const handleUploadImg = async (files, callback) => {
      try {
        const uploadPromises = files.map(async file => {
          const response = await uploadImage(file);
          return {
           url: `https://jienote.top${response.image_url}`,  // 拼接完整的访问路径
           alt: '',  // 保持空的alt文本
         };
        });

        const uploadedImages = await Promise.all(uploadPromises);
        callback(uploadedImages);
        ElMessage.success('图片上传成功');
      } catch (error) {
        ElMessage.error('图片上传失败：' + (error.message || '未知错误'));
        console.error('图片上传失败', error);
        callback([]);
      }
    };

    // 获取笔记内容
    const fetchNoteContent = async (noteId) => {
      try {
        const response = await getNotes({ id: noteId });
        if (
          response &&
          response.status === 200 &&
          response.data.notes &&
          response.data.notes.length > 0
        ) {
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

    // 启动自动保存定时器
    const startAutoSave = () => {
      clearAutoSave(); // 先清除已有的定时器
      if (props.autoSave && props.noteId && props.autoSaveInterval > 0) {
        autoSaveTimer = setInterval(() => {
          if (hasChanges.value) {
            // 定时自动保存，不显示通知
            saveNote(content.value, false);
          }
        }, props.autoSaveInterval);
      }
    };

    // 清除自动保存定时器
    const clearAutoSave = () => {
      if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
        autoSaveTimer = null;
      }
    };

    const handleBeforeUnload = (event) => {
      // Renamed back to 'event' as it will be used
      if (props.autoSave && hasChanges.value && props.noteId) {
        // 尝试在页面卸载前保存笔记 (如果当前没有正在进行的保存操作)
        // 注意: 异步操作在 beforeunload 事件中不保证完成
        if (!updating.value) {
          saveNote(content.value, false);
        }

        // 如果有未保存的更改, 总是提示用户，因为异步保存可能未完成
        // 这会显示浏览器原生的 "离开此网站?" 对话框
        event.preventDefault();
        event.returnValue = ''; // Chrome 和一些其他浏览器需要这个来显示提示
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
      startAutoSave(); // 组件挂载时启动自动保存
      window.addEventListener('beforeunload', handleBeforeUnload);
    });

    onBeforeUnmount(() => {
      clearAutoSave(); // 组件卸载前清除定时器
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Vue 组件卸载时的保存逻辑 (例如SPA内部导航)
      if (
        props.autoSave &&
        hasChanges.value &&
        props.noteId &&
        !updating.value
      ) {
        // 退出前自动保存，不显示通知
        saveNote(content.value, false);
      }
    });

    // 监听 autoSave 和 noteId 的变化以重新启动定时器
    watch(
      () => [props.autoSave, props.noteId, props.autoSaveInterval],
      () => {
        startAutoSave();
      }
    );

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
      footers,
      language,
      preview,
      mdEditorRef,
      updating,
      handleChange,
      handleError,
      handleSave,
      handleUploadImg,
      handleDragWidth,
      insertContent,
      getValue,
      fetchNoteContent, // 导出这个方法供外部使用
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
/* :deep(.md-editor-content) {
  display: flex;
  height: 100%;
} */

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

:deep(.md-editor) {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 工具栏样式 */
:deep(.md-editor-toolbar) {
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
