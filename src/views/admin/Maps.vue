<template>
  <div class="flex flex-col h-screen">

    <!-- 搜索框 -->
    <div class="search-bar-bg flex justify-center py-6 px-4">
      <div class="flex items-center">
        <el-input
          v-model="searchQuery"
          placeholder="搜索你想了解的论文"
          class="search-input-large"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button type="primary" size="large" @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
          <el-button
            class="back-arrow-btn"
            size="large"
            @click="handleBackToRecommend"
            v-if="isSearched"
            style="margin-left: 16px;"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M15 19l-7-7 7-7" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </el-button>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="flex-1 overflow-y-auto bg-gray-100">
      <div class="container-fluid px-4 py-4">
        <div class="bg-white rounded-lg shadow p-4">
          <!-- 个性推荐标题 -->
          <!-- 个性推荐标题：仅在没有搜索内容时显示 -->
          <div
            v-if="!isSearched"
            class="recommend-title flex items-center mb-4"
          >
            <span class="recommend-icon" aria-label="个性推荐">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z"
                  fill="#fbbf24"/>
              </svg>
            </span>
            <span class="recommend-text ml-2">个性推荐</span>
          </div>
          <div v-if="isLoading" class="loading-wrapper">
            <div class="loading-content">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span class="loading-text">正在加载文献列表...</span>
            </div>
          </div>
          <div v-else>
            <ul class="literature-simple-list">
              <li
                v-for="article in articles"
                :key="article.id"
                class="literature-simple-item"
              >
                <span class="literature-icon">📖</span>
                <span class="literature-title-text" :title="article.title">{{ article.title }}</span>
                <!-- 右侧图表按钮 -->
                <span
                  class="literature-action-icon"
                  @click="openFolderDialog(article.id)"
                  title="移动到文件夹"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="7" width="20" height="13" rx="2" fill="#e0e7ef" stroke="#10b981" stroke-width="1.5"/>
                    <path d="M2 7V5a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v2" stroke="#10b981" stroke-width="1.5"/>
                  </svg>
                </span>
              </li>
            </ul>
            <div v-if="!articles.length" class="text-gray-500 text-center py-8">暂无文献数据</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件夹选择弹窗 -->
    <el-dialog
      v-model="showFolderDialog"
      title="选择文件夹"
      width="350px"
      :close-on-click-modal="false"
      @close="resetFolderDialog"
    >
      <div v-if="foldersLoading" class="text-center py-6">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span class="ml-2">加载文件夹中...</span>
      </div>
      <div v-else>
        <div v-if="folders.length">
          <el-button
            v-for="folder in folders"
            :key="folder.folder_id"
            class="folder-btn"
            @click="handleSelectFolder(folder.folder_id)"
            type="primary"
            plain
          >
            {{ folder.folder_name || '未命名文件夹' }}
          </el-button>
        </div>
        <div v-else class="text-gray-500 text-center py-4">暂无文件夹</div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { defineExpose } from 'vue'
import { searchLiterature, getLiteratureList, getSelfFolders, copyArticleToFolder } from '@/api/database'

const articles = ref([])
const isLoading = ref(true)
const searchQuery = ref('')

const showFolderDialog = ref(false)
const folders = ref([])
const foldersLoading = ref(false)
const currentArticleId = ref(null)
const isSearched = ref(false) 

function handleBackToRecommend() {
  isSearched.value = false
  searchQuery.value = ''
  fetchLiteratureList()
}

async function handleSearch() {
  isSearched.value = true
  if (!searchQuery.value.trim()) {
    ElMessage.warning('请输入搜索内容')
    return
  }
  isLoading.value = true
  try {
    const response = await searchLiterature({ query: searchQuery.value })
    const data = response.data || {}
    articles.value = Array.isArray(data.articles) ? data.articles : []
  } catch (e) {
    ElMessage.error('搜索失败')
    articles.value = []
    folders.value = [] 
  } finally {
    isLoading.value = false
  }
}

async function fetchLiteratureList() {
  isLoading.value = true
  try {
    const response = await getLiteratureList()
    const data = response.data || {}
    articles.value = data.articles || []
  } catch (e) {
    ElMessage.error('文献列表加载失败')
  } finally {
    isLoading.value = false
  }
}

function resetFolderDialog() {
  folders.value = []
  foldersLoading.value = false
  currentArticleId.value = null
}

async function openFolderDialog(articleId) {
  showFolderDialog.value = true
  foldersLoading.value = true
  currentArticleId.value = articleId
  try {
    const response = await getSelfFolders()
    const data = response.data || {}
    folders.value = data.result || []
  } catch (e) {
    ElMessage.error('文件夹加载失败')
    showFolderDialog.value = false
  } finally {
    foldersLoading.value = false
  }
}

async function handleSelectFolder(folderId) {
  showFolderDialog.value = false
  try {
    await copyArticleToFolder({
      folder_id: folderId,
      article_id: currentArticleId.value
    })
    ElMessage.success('文献已移动到指定文件夹')
  } catch (e) {
    ElMessage.error('移动失败')
  }
}

onMounted(fetchLiteratureList)
defineExpose({
  handleBackToRecommend,
  handleSearch,
  resetFolderDialog,
  openFolderDialog,
  handleSelectFolder
})
</script>

<style scoped lang="scss">
.section-title {
  color: #444;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e6e6e6;
}
.loading-wrapper {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.is-loading {
  animation: rotating 2s linear infinite;
  font-size: 32px;
}
.loading-text {
  color: #666;
  font-size: 14px;
}
@keyframes rotating {
  from { transform: rotate(0deg);}
  to { transform: rotate(360deg);}
}
.literature-simple-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.literature-simple-item {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border-radius: 8px;
  padding: 14px 18px;
  margin-bottom: 12px;
  font-size: 17px;
  font-weight: 500;
  color: #222;
  box-shadow: 0 1px 4px rgba(16, 185, 129, 0.06);
  transition: box-shadow 0.2s, background 0.2s;
  cursor: pointer;
  &:hover {
    background: #e0f2fe;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.13);
    color: #059669;
  }
}
.literature-icon {
  width: 22px;
  height: 22px;
  margin-right: 14px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.literature-title-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60vw;
  display: inline-block;
}
.literature-action-icon {
  margin-left: auto;
  margin-right: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
  &:hover {
    background: #d1fae5;
  }
}
::v-deep(.el-dialog__body) {
  padding: 10px 0 !important; // 统一 dialog body 的 padding
}

.folder-btn {
  margin: 0 !important;
  margin-bottom: 10px !important;
  width: 100% !important;
  text-align: left !important;
  justify-content: flex-start !important;
  display: flex !important;
  align-items: center !important;
}

.search-bar-bg {
  background: #2d223a !important; // 暗紫色
  margin-bottom: 0;
  border-radius: 0 !important;     // 去掉圆角
  box-shadow: none !important;
  /* 可选：让高度更明显一点 */
  min-height: 100px;
  display: flex;
  align-items: center;
}

.search-input-large {
  width: 700px;
  font-size: 26px;
  .el-input__inner {
    height: 64px;
    font-size: 26px;
    padding-left: 28px;
    background: #2d223a !important;
    color: #fff !important;
    border: none;
    border-radius: 0 !important; // 输入框无圆角
  }
  .el-input-group__append {
    .el-button {
      height: 64px;
      font-size: 24px;
      padding: 0 38px;
      background: #4b256a !important;
      color: #fff !important;
      border: none;
      border-radius: 0 !important; // 按钮无圆角
    }
    .el-button:hover {
      background: #6d3bb6 !important;
      color: #fff !important;
    }
  }
}
.recommend-title {
  font-size: 22px;
  font-weight: 700;
  color: #f59e42;
  letter-spacing: 2px;
  align-items: center;
  user-select: none;
}
.recommend-icon {
  display: flex;
  align-items: center;
}
.recommend-text {
  font-size: 22px;
  font-weight: 700;
  color: #f59e42;
}

.back-arrow-btn {
  height: 64px !important;
  width: 64px !important;
  min-width: 64px !important;
  background: #4b256a !important;
  color: #fff !important;
  border: none !important;
  border-radius: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 !important;
  margin-left: 16px;
  transition: background 0.2s;
}
.back-arrow-btn:hover {
  background: #6d3bb6 !important;
}
</style>