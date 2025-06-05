<template>
  <div class="md-preview-container">
    <MdPreview
      v-model="content"
      v-bind="$props"
      :theme="currentTheme"
      @onError="handleError"
      ref="mdPreviewRef"
    />
  </div>
</template>

<script setup>
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { ref, computed, watch, defineProps, defineEmits, defineExpose } from 'vue';
import { ElMessage } from 'element-plus';
import {
  languageConfig,
  themeConfig
} from './config/editorConfig';

// 定义props
const props = defineProps({
  ...MdPreview.props, // 继承所有原始props
  modelValue: {
    type: String,
    default: '',
  },
  theme: {
    type: String,
    default: 'light',
  },
  showCodeRowNumber: {
    type: Boolean,
    default: true,
  },
  language: {
    type: String,
    default: languageConfig,
  },
});

// 定义emit
const emit = defineEmits(['update:modelValue', 'error']);

const mdPreviewRef = ref(null);
const content = ref(props.modelValue);

// 主题相关配置
const currentTheme = computed(() => ({
  ...themeConfig,
  name: props.theme,
}));

// 监听值变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== content.value) {
      content.value = newValue;
    }
  }
);

watch(
  () => content.value,
  (newValue) => {
    emit('update:modelValue', newValue);
  }
);

const handleError = (err) => {
  console.error(`预览器错误: ${err.message}`);
  ElMessage.error(`预览出错: ${err.message}`);
  emit('error', err);
};

// 公开方法
const getValue = () => {
  return content.value;
};

// 导出方法和变量供模板和外部使用
defineExpose({
  content,
  currentTheme,
  mdPreviewRef,
  handleError,
  getValue,
});
</script>

<style scoped>
.md-preview-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

:deep(.md-editor-preview) {
  height: 100%;
}

:deep(.md-editor-preview ol li) {
  list-style-type: decimal !important;
}

:deep(.md-editor-preview ul li) {
  list-style-type: disc !important;
}

:deep(.md-editor-preview ul li ul li) {
  list-style-type: circle !important;
}

:deep(.md-editor-preview img) {
  max-width: 100%;
  cursor: pointer;
}

:deep(.md-editor-preview pre code) {
  display: block;
  overflow-x: auto;
  padding: 1em;
}

/* 适配深色主题 */
:deep([data-theme='dark']) {
  --md-bk-color: #1e1e1e;
  --md-border-color: #2d2d2d;
  --md-border-hover-color: #3d3d3d;
}
</style>