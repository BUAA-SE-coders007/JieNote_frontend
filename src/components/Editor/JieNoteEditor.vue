<template>
  <div class="md-editor-container">
    <div v-if="showYellowIndicator" class="readonly-indicator">
      仅预览模式（无编辑权限）
    </div>
    <MdEditor
      v-model="content"
      v-bind="$props"
      :toolbars="toolbars"
      :inputBoxWidth="inputBoxWidth"
      :catalogLayout="'flat'"
      :readOnly="effectiveReadOnly"
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
  computed,
} from 'vue';
import NoteAPI from '@/api/note_unified';
import GroupNoteAPI from '@/api/group_note';
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
    type: [String, Number],
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
  readonly: {
    type: Boolean,
    default: false,
  },
});

// 定义emit
const emit = defineEmits(['update:modelValue', 'save', 'change', 'error']);

const mdEditorRef = ref(null);
const content = ref(props.modelValue || '');  // 确保初始值不为null
const updating = ref(false);
const preview = ref(true);
const groupPermissionReadOnly = ref(false); // 从API获取的群组笔记权限状态

// 计算最终的只读状态和黄色指示器显示
const effectiveReadOnly = computed(() => {
  return props.readonly || (props.is_group && groupPermissionReadOnly.value);
});

const showYellowIndicator = computed(() => {
  // 当是群组笔记，且群组权限导致只读，并且外部没有强制readonly时，显示指示器
  return props.is_group && groupPermissionReadOnly.value && !props.readonly;
});

// 监听只读状态变化
watch(effectiveReadOnly, (newValue) => {
  console.log(`只读状态变化: ${newValue}`);
  mdEditorRef.value?.togglePreviewOnly(newValue);
  if (!newValue) {
    // 退出只读模式时恢复用户保存的编辑器宽度
    inputBoxWidth.value = loadInputBoxWidth();
  }
});
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
    const newContent = newValue || '';  // 先转换为字符串
    if (newContent !== content.value) {  // 然后再比较
      content.value = newContent;
      emit('update:modelValue', newContent);  // 确保同步更新
    }
  },
  { immediate: true }  // 确保首次加载时也执行
);

// 监听content变化
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
  console.log('获取笔记内容:', noteId);
  
  const setEmptyContent = () => {
    const emptyContent = '';
    content.value = emptyContent;
    emit('update:modelValue', emptyContent);
    return emptyContent;
  };

  // 如果没有noteId，直接重置为空字符串
  if (!noteId) {
    return setEmptyContent();
  }

  try {
    const response = await NoteAPI.getNotes({
      id: noteId,
      isGroup: props.is_group,
    });

    if (response?.data?.notes?.[0]) {
      const noteContent = response.data.notes[0].content || '';
      content.value = noteContent;
      emit('update:modelValue', noteContent);
      return noteContent;
    }
    // 笔记不存在时设置为空字符串
    return setEmptyContent();
  } catch (error) {
    console.error('获取笔记内容失败:', error);
    ElMessage.error('获取笔记内容失败');
    return setEmptyContent();
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

// 统一的笔记初始化/更新函数
const initializeOrUpdateNoteState = async () => {
  console.log('初始化/更新笔记状态:', { noteId: props.noteId, is_group: props.is_group });

  // 初始化content
  content.value = props.modelValue || '';
  emit('update:modelValue', content.value);

  // 如果有noteId，获取笔记内容和权限
  if (props.noteId) {
    await fetchNoteContent(props.noteId);
    await checkGroupEditPermission();
  } else {
    console.log('未提供 noteId，使用默认空内容');
  }

  // 处理自动聚焦
  if (props.autoFocus && mdEditorRef.value) {
    mdEditorRef.value.focus();
  }

  // 启动自动保存
  startAutoSave();
};

const handleBeforeUnload = (event) => {
  if (props.autoSave && hasChanges.value && props.noteId) {
    if (!updating.value) {
      saveNote(content.value, false);
    }
    event.preventDefault();
    event.returnValue = '';
  }
};

onMounted(() => {
  // 初始化编辑器宽度
  inputBoxWidth.value = loadInputBoxWidth();
  
  // 第一次初始化笔记状态
  initializeOrUpdateNoteState();
  
  // 添加页面卸载事件监听
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

// 监听笔记id和群组状态变化
// 监听 noteId 和 is_group 的变化，但不立即执行
watch(
  () => [props.noteId, props.is_group],
  async ([newNoteId, newIsGroup], [oldNoteId, oldIsGroup]) => {
    if (newNoteId !== oldNoteId || newIsGroup !== oldIsGroup) {
      await initializeOrUpdateNoteState();
    }
  },
  { immediate: false } // 添加 immediate: false，确保只在后续的 props 变化时执行
);

// 监听自动保存相关的属性变化
watch(
  () => [props.autoSave, props.autoSaveInterval],
  () => {
    startAutoSave();
  }
);

// 检查群组笔记编辑权限
const checkGroupEditPermission = async () => {
  // 如果不是群组笔记，直接设置为false并返回
  if (!props.is_group) {
    groupPermissionReadOnly.value = false;
    console.log('非群组笔记，无需检查权限');
    return;
  }
  
  try {
    const response = await GroupNoteAPI.getEditPermission(props.noteId);
    groupPermissionReadOnly.value = !response.data.editable;
    console.log('群组笔记编辑权限:', !response.data.editable);
  } catch (error) {
    console.error('获取群组笔记权限失败:', error);
    ElMessage.error('获取群组笔记权限失败，可能无法编辑');
    groupPermissionReadOnly.value = true; // 出错时默认设置为只读
  }
};

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
  showYellowIndicator,
});
</script>

<style scoped>
.readonly-indicator {
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
  color: #d46b08;
  padding: 4px 12px;
  border-radius: 4px;
  z-index: 50;
  font-size: 13px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

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
