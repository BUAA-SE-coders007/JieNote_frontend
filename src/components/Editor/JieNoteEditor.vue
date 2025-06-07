<template>
  <div class="md-editor-container">
    <MdEditor
      v-model="content"
      v-bind="$props"
      :toolbars="toolbars"
      :inputBoxWidth="inputBoxWidth"
      :catalogLayout="'flat'"
      @onSave="handleSave"
      @onUploadImg="handleUploadImg"
      @onChange="handleChange"
      @onError="handleError"
      @oninputBoxWidthChange="handleInputBoxWidthChange"
      ref="mdEditorRef"
    />
  </div>
</template>

<script setup>
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  defineProps,
  defineEmits,
  defineExpose,
} from 'vue';
import NoteAPI from '@/api/note_unified';
import { uploadImage } from '@/api/image';
import { ElMessage } from 'element-plus';
import {
  toolbarsConfig,
  footersConfig,
  languageConfig,
  defaultEditorProps,
  editorUtils,
} from './config/editorConfig';

// 定义props
const props = defineProps({
  ...MdEditor.props, // 继承所有原始props
  // 自定义props
  ...defaultEditorProps,
  noteId: {
    type: String,
    default: null,
  },
  modelValue: {
    type: String,
    default: '',
  },
  is_group: {
    type: Boolean,
    default: false,
  },
});

// 定义emit
const emit = defineEmits(['update:modelValue', 'save', 'change', 'error']);

const mdEditorRef = ref(null);
const content = ref(props.modelValue);
const updating = ref(false);
const preview = ref(true);
const hasChanges = ref(false); // 标记是否有未保存的更改
let autoSaveTimer = null;

// 使用配置的工具栏
const toolbars = toolbarsConfig;
const footers = footersConfig;
const language = languageConfig;
const inputBoxWidth = ref('50%'); // 编辑器宽度

// 从localStorage加载编辑器宽度
const loadInputBoxWidth = () => {
  const savedWidth = localStorage.getItem('mdEditorWidth');
  return savedWidth ? `${savedWidth}%` : '50%';
};

// 保存编辑器宽度到localStorage
const saveInputBoxWidth = (width) => {
  // 移除百分号并保存数值
  const numericWidth = parseInt(width);
  localStorage.setItem('mdEditorWidth', numericWidth.toString());
};

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
    await NoteAPI.updateNote({
      note_id: props.noteId,
      content: currentContent,
      isGroup: props.is_group,
    });

    if (showNotification) {
      ElMessage.success('笔记已保存');
    }
    hasChanges.value = false;
  } catch (e) {
    ElMessage.error(`保存失败: ${e.message}`);
    console.error('保存失败', e);
  } finally {
    updating.value = false;
  }
};

const handleUploadImg = async (files, callback) => {
  try {
    const uploadPromises = files.map(async (file) => {
      const response = await uploadImage(file);
      return {
        url: `https://jienote.top${response.image_url}`, // 拼接完整的访问路径
        alt: '', // 保持空的alt文本
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
    const response = await NoteAPI.getNotes({
      id: noteId,
      isGroup: props.is_group,
    });

    if (response?.data?.notes?.[0]) {
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
  // 初始化编辑器宽度
  inputBoxWidth.value = loadInputBoxWidth();

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
  if (props.autoSave && hasChanges.value && props.noteId && !updating.value) {
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

const insertContent = (text, config = {}) => {
  if (mdEditorRef.value) {
    mdEditorRef.value.insert(() => {
      return editorUtils.createInsertConfig(text, config);
    });
  }
};

const getValue = () => {
  return content.value;
};

// 处理编辑器宽度变化
const handleInputBoxWidthChange = (width) => {
  // ElMessage.info(`编辑器宽度已更改为: ${width}`);
  inputBoxWidth.value = width;
  saveInputBoxWidth(width);
};

// 导出方法和变量供模板和外部使用
defineExpose({
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
  handleInputBoxWidthChange,
  insertContent,
  getValue,
  fetchNoteContent,
});
</script>

<style scoped>
.md-editor-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

:deep(.md-editor-content .md-editor-input-wrapper),
:deep(.md-editor-content .md-editor-preview-wrapper) {
  height: 100%;
}

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

:deep(.md-editor-toolbar) {
  z-index: 10;
  background-color: var(--md-bk-color, #fff);
}

:deep(.md-editor-toolbar__item),
:deep(.md-editor-toolbar__item > svg) {
  min-width: 28px !important;
  min-height: 28px !important;
}

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
