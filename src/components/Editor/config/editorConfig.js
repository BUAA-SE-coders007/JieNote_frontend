// 工具栏配置
export const toolbarsConfig = [
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

// 页脚配置
export const footersConfig = ['markdownTotal', '=', 'scrollSwitch'];

// 语言配置
export const languageConfig = 'zh-CN';

// 编辑器默认配置
export const defaultEditorProps = {
  autoFocus: false,
  preview: true,
  htmlPreview: true,
  showCodeRowNumber: true,
  language: languageConfig,
  autoSave: false,
  autoSaveInterval: 30000,
};

// 编辑器主题配置
export const themeConfig = {
  // CSS 变量名和默认值
  variables: {
    '--md-bk-color': '#fff',
    '--md-border-color': '#e6e6e6',
    '--md-border-hover-color': '#b3b3b3',
  }
};

// 编辑器插入内容的默认配置
export const insertContentConfig = {
  select: true,
  deviationStart: 0,
  deviationEnd: 0,
};

// 通用的工具函数
export const editorUtils = {
  // 创建插入内容的配置
  createInsertConfig(text, config = {}) {
    return {
      targetValue: text,
      select: config.select ?? insertContentConfig.select,
      deviationStart: config.deviationStart ?? insertContentConfig.deviationStart,
      deviationEnd: config.deviationEnd ?? insertContentConfig.deviationEnd,
    };
  }
};