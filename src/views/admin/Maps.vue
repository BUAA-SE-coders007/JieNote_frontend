<template>
  <div class="flex flex-col h-screen">

    <!-- 主体内容 -->
    <div class="flex-1 overflow-y-auto bg-gray-100">
      <div class="container-fluid px-4 py-4">
        <div class="bg-white rounded-lg shadow p-4">
          <!-- 个性推荐标题 -->
          <div
            v-if="!isSearched"
            class="recommend-title flex items-center mb-4"
          >
            <span class="recommend-icon" aria-label="个性推荐">
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
                v-for="article in paginatedArticles"
                :key="article.id"
                class="literature-simple-item"
              >
                <span class="literature-icon"><svg t="1748777710670" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1020" data-spm-anchor-id="a313x.collections_detail.0.i0.223b3a81QSiUzk" width="200" height="200"><path d="M911.232 536.064a30.784 30.784 0 0 1 14.912 57.6c-24 13.44-86.464 60.16-86.464 113.024 0 76.672 64.832 115.84 80.896 124.352l3.456 1.792a30.784 30.784 0 0 1-12.8 58.624H260.672a177.92 177.92 0 0 1-177.728-177.728 177.92 177.92 0 0 1 177.728-177.728h407.552c-15.616 0.064-28.16 10.944-30.784 25.28l-0.512 5.504c0 16.96 13.76 30.72 30.72 30.72l-0.704-0.128 0.704 0.064c10.368 0 4.928-8.576-16.384-25.792l-6.144-4.928c26.304-20.48 33.856-30.72 22.528-30.72h0.576l243.008 0.064z m-244.288 61.312l-406.272 0.064a116.48 116.48 0 0 0-116.288 116.288 116.48 116.48 0 0 0 116.288 116.288h563.008a187.712 187.712 0 0 1-45.44-123.328c0-44.16 22.08-81.28 47.104-109.184h-157.696l-0.704-0.128z m-63.296 106.368a30.72 30.72 0 1 1 0 61.44H266.24a30.72 30.72 0 0 1 0-61.44h337.344z m160.64-576.64a177.92 177.92 0 0 1 177.664 177.728 177.92 177.92 0 0 1-177.728 177.664H113.664a30.784 30.784 0 0 1-14.976-57.536c24.064-13.504 86.528-60.16 86.528-113.088 0-85.696-80.96-124.544-84.416-126.08a30.784 30.784 0 0 1 12.864-58.624h650.624z m0 61.44h-93.248l-0.832 0.064H201.216c24.448 29.12 45.44 69.696 45.44 123.328 0 44.16-22.016 81.28-47.104 109.184h564.736a116.48 116.48 0 0 0 116.224-116.288 116.48 116.48 0 0 0-116.224-116.288z m-9.984 110.528a30.72 30.72 0 1 1 0 61.44h-337.28a30.72 30.72 0 0 1 0-61.44h337.28z m-84.096-171.904l-5.504 0.448a30.72 30.72 0 0 0 5.504 60.928h0.832l1.6-0.128c6.72-1.408 0.128-9.984-19.776-25.6l-6.4-4.928c27.136-20.48 35.072-30.72 23.744-30.72z" fill="#505766" p-id="1021"></path><path d="M911.232 523.264a43.584 43.584 0 0 1 21.184 81.472c-40.32 22.72-79.936 65.28-79.936 101.952 0 30.784 11.392 56.96 31.168 79.232 13.568 15.168 29.056 26.496 42.688 33.728l3.136 1.6a43.52 43.52 0 0 1-18.24 83.008H260.672a190.72 190.72 0 0 1-190.528-190.528 190.72 190.72 0 0 1 190.528-190.528h406.976l243.584 0.064z m-283.072 25.472l-367.488 0.064a165.12 165.12 0 0 0-164.928 164.928 165.12 165.12 0 0 0 164.928 164.928h650.496a17.92 17.92 0 0 0 17.472-14.08 18.112 18.112 0 0 0-10.368-20.352l-3.712-1.856a182.08 182.08 0 0 1-50.048-39.424 141.44 141.44 0 0 1-37.632-96.256c0-48.768 45.376-97.408 93.056-124.288a17.92 17.92 0 0 0-8.704-33.536l-228.928-0.128-1.536 2.56a92.16 92.16 0 0 1-13.312 13.632l-2.048 1.728c6.4 5.568 10.88 9.984 14.08 13.824l2.624 3.648 0.256 0.512 171.648 0.064-19.136 21.312c-27.904 31.168-43.84 64.896-43.84 100.672 0 44.8 15.488 83.008 42.432 115.072l17.728 21.056H260.672a129.28 129.28 0 0 1-129.088-129.088 129.28 129.28 0 0 1 129.088-129.088h367.616l-0.704-1.408a45.44 45.44 0 0 1-3.008-11.456l-0.384-6.144 0.64-6.656a43.392 43.392 0 0 1 1.792-6.656l1.536-3.584z m170.56 61.504l-131.072-0.128H665.6l-404.992 0.128a103.68 103.68 0 0 0-103.04 94.08l-0.448 9.408a103.68 103.68 0 0 0 103.488 103.488h537.6l-1.216-1.728a196.48 196.48 0 0 1-31.104-93.632l-0.512-15.168c0-34.304 11.904-66.368 32.96-96l0.32-0.448z m-195.072 80.64a43.52 43.52 0 1 1 0 87.04H266.24a43.52 43.52 0 0 1 0-87.04h337.344z m0 25.6H266.304a17.92 17.92 0 0 0 0 35.84h337.28a17.92 17.92 0 0 0 0.064-35.84z m351.104-411.648a190.72 190.72 0 0 1-190.528 190.464H113.664a43.584 43.584 0 0 1-21.248-81.472c40.32-22.72 80-65.28 80-101.952 0-58.304-38.464-96.64-76.992-114.56a43.52 43.52 0 0 1 18.24-82.944h650.624a190.72 190.72 0 0 1 190.464 190.464z m-270.144-164.992l-1.728 2.816a96.96 96.96 0 0 1-13.76 13.632l-1.92 1.536 4.8 4.224c3.2 2.816 5.888 5.376 8.064 7.68l2.816 3.392 1.728 2.56 79.68 0.064a129.28 129.28 0 0 1 129.024 129.088 129.28 129.28 0 0 1-129.024 129.088H170.88l19.072-21.312c27.904-31.168 43.84-64.896 43.84-100.672 0-44.8-15.424-83.008-42.432-115.072l-17.728-21.056h27.52l429.376 0.064-2.048-5.44a43.2 43.2 0 0 1-1.408-6.144l-0.384-5.504-1.344-0.96 1.28-1.088 0.448-5.12a42.688 42.688 0 0 1 3.392-11.648H113.664a17.792 17.792 0 0 0-16.064 10.176l-1.344 3.84a17.92 17.92 0 0 0 9.92 20.16c46.656 21.568 91.84 66.624 91.84 137.728 0 48.768-45.376 97.408-93.056 124.288a17.92 17.92 0 0 0 8.704 33.536h650.56a165.12 165.12 0 0 0 164.928-164.864 165.12 165.12 0 0 0-164.864-164.928h-79.68z m-11.2 61.312l-1.408 0.128H672l-1.728 0.128H226.624l1.216 1.728c17.728 27.584 28.672 58.816 31.104 93.632l0.512 15.168c0 34.304-11.904 66.368-32.896 96l-0.32 0.32 538.048 0.064a103.68 103.68 0 0 0 103.04-94.08l0.384-9.408a103.68 103.68 0 0 0-103.424-103.488l-90.88-0.192z m80.896 85.12a43.52 43.52 0 1 1 0 87.04h-337.28a43.52 43.52 0 0 1 0-87.04h337.28z m0 25.6h-337.28a17.92 17.92 0 0 0 0 35.84h337.28a17.92 17.92 0 0 0 0-35.84z" fill="#505766" p-id="1022" data-spm-anchor-id="a313x.collections_detail.0.i1.223b3a81QSiUzk" class="selected"></path></svg></span>
                <div class="literature-info" @click="handlePreview(article.id)">
                  <span class="literature-title-text" :title="article.title">{{ article.title }}</span>
                  <div v-if="article.author" class="literature-author-text">
                    <el-icon style="font-size:16px;color:#2563eb;margin-right:4px;"><i class="el-icon-user" /></el-icon>
                    <span>{{ article.author }}</span>
                  </div>
                  <div class="literature-intro-text">
                    <span v-if="article.intro">{{ article.intro }}</span>
                    <span v-else-if="article.loadingIntro">正在加载简介...</span>
                    <span v-else>暂无简介</span>
                  </div>
                </div>
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
            <div v-if="!articles.length" class="text-gray-500 text-center py-8">
              {{ isSearched ? '未找到相关文献' : '暂无文献数据' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页功能 -->
    <div class="pagination-bar flex justify-between items-center px-4 py-2 bg-white shadow">
      <!-- 每页显示数量 -->
      <div class="flex items-center">
        <span class="text-gray-600 mr-2">每页显示：</span>
        <select v-model="pageSize" @change="handlePageSizeChange" class="pagination-select">
          <option v-for="size in [5, 10, 15, 20]" :key="size" :value="size">{{ size }}</option>
        </select>
        <span class="text-gray-600 ml-2">条</span>
      </div>

      <!-- 分页导航 -->
      <div class="flex items-center">
        <button
          class="pagination-arrow"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          ←
        </button>
        <button
          v-for="page in visiblePages"
          :key="page"
          :class="['pagination-page', { active: page === currentPage }]"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button
          class="pagination-arrow"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          →
        </button>
        <div class="flex items-center ml-4">
          <span class="text-gray-600 mr-2">跳转到：</span>
          <input
            type="number"
            v-model.number="jumpToPage"
            @keyup.enter="goToPage(jumpToPage)"
            class="pagination-input"
            :max="totalPages"
            :min="1"
          />
          <span class="text-gray-600 ml-2">页</span>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="showFolderDialog"
      title="选择文件夹"
      width="380px"
      :close-on-click-modal="false"
      @close="resetFolderDialog"
      class="folder-dialog-custom"
    >
      <div v-if="foldersLoading" class="folder-loading text-center py-8">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span class="ml-2">加载文件夹中...</span>
      </div>
      <div v-else>
        <div
          v-if="folders.length"
          class="folder-list"
          style="max-height: 320px; overflow-y: auto; padding-right: 4px;"
        >
          <el-button
            v-for="folder in folders"
            :key="folder.folder_id"
            class="folder-btn"
            @click="handleSelectFolder(folder.folder_id)"
            type="primary"
            plain
          >
            <el-icon style="margin-right:8px;color:#2563eb;"><i class="el-icon-folder-opened" /></el-icon>
            {{ folder.folder_name || '未命名文件夹' }}
          </el-button>
        </div>
        <div v-else class="folder-empty text-gray-400 text-center py-8">
          <el-icon style="font-size:32px;color:#cbd5e1;"><i class="el-icon-folder-remove" /></el-icon>
          <div style="margin-top:8px;">暂无文件夹</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref,  watch ,computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import { defineExpose } from 'vue'
import { searchLiterature, getRecommendLiterature, getSelfFolders, copyArticleToFolder, generateArticleIntro } from '@/api/database'
import patternVue from "@/assets/img/logo4.png"

const route = useRoute()
const router = useRouter();
const articles = ref([])
const isLoading = ref(true)
const searchQuery = ref('')

const showFolderDialog = ref(false)
const folders = ref([])
const foldersLoading = ref(false)
const currentArticleId = ref(null)
const isSearched = ref(false) 
const pageSize = ref(10); // 每页显示的文献数量
const currentPage = ref(1); // 当前页码
const jumpToPage = ref(null); // 跳转到的页码

// 计算总页数
const totalPages = computed(() => Math.ceil(articles.value.length / pageSize.value));

// 当前页显示的文献
const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return articles.value.slice(start, end);
});

// 可见的页码（最多显示 4 个页码）
const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

// 改变每页显示数量
function handlePageSizeChange() {
  currentPage.value = 1; // 重置到第一页
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;

  // 自动加载当前页文献简介
  for (const article of paginatedArticles.value) {
    if (!article.intro) {
      fetchArticleIntro(article);
    }
  }
}
watch(
  () => route.query.search,
  async (val) => {
    if (val && val.trim()) {
      searchQuery.value = val
      console.log(val)
      await handleSearch()
    } else {
      searchQuery.value = ''
      await fetchLiteratureList()
      isSearched.value = false
    }
  },
  { immediate: true }
)

function handleBackToRecommend() {
  isSearched.value = false
  searchQuery.value = ''
  fetchLiteratureList()
}

function handlePreview(articleId) {
  router.push(`/paper?article_id=${articleId}`); // 跳转到 PDF 阅读页面
}

async function fetchArticleIntro(article) {
  if (article.loadingIntro) return; // 防止重复加载
  article.loadingIntro = true; // 标记为加载中
  try {
    const response = await generateArticleIntro({ article_id: article.id });
    article.intro = response.data.articleDB.intro || '暂无简介'; // 设置简介
    console.log('文献简介:', article.intro);
  } catch (error) {
    console.error('获取文献简介失败:', error);
    article.intro = '暂无简介';
  } finally {
    article.loadingIntro = false; // 加载完成
  }
}

async function handleSearch() {
  isSearched.value = true
  isLoading.value = true
  console.log(searchQuery.value)
  try {
    const response = await searchLiterature({ query: searchQuery.value })
    const data = response.data || {}
    articles.value = Array.isArray(data.articles) ? data.articles : []
    console.log(articles.value.map(article => article.id))
  } catch (e) {
    ElMessage.error('搜索失败')
    articles.value = []
    folders.value = []
  } finally {
    isLoading.value = false
  }
}


async function fetchLiteratureList() {
  isLoading.value = true;
  try {
    const response = await getRecommendLiterature({size: 10});
    const data = response.data || {};
    articles.value = (data.articles || []).map(article => ({
      ...article,
      intro: article.intro || null, // 初始化简介字段
      loadingIntro: false, // 初始化加载状态
    }));

    // 自动加载当前页文献简介
    for (const article of paginatedArticles.value) {
      if (!article.intro) {
        fetchArticleIntro(article);
      }
    }
  } catch (e) {
    ElMessage.error('文献列表加载失败');
  } finally {
    isLoading.value = false;
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

defineExpose({
  handleBackToRecommend,
  handleSearch,
  resetFolderDialog,
  openFolderDialog,
  handleSelectFolder,
  patternVue,
  paginatedArticles,
  visiblePages,
  handlePageSizeChange,
  goToPage,
  jumpToPage,
  fetchArticleIntro,
  handlePreview,
})
</script>

<style scoped lang="scss">
.search-bar-top-placeholder {
  width: 100%;
  height: 72px; // 与 margin-top: 48px 对应，可调整
  background: linear-gradient(90deg, #1e40af 0%, #2563eb 100%) !important; // 从左到右由深变浅
}
.search-bar-bg {
  background: linear-gradient(90deg, #1e40af 0%, #2563eb 100%) !important; // 从左到右由深变浅
  margin-bottom: 0;
  border-radius: 0 !important;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.15);
  min-height: 100px;
  display: flex;
  align-items: center;
  margin-top: 0; // 新增：下移搜索框
}

.loading-wrapper {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%);
  border-radius: 12px;
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
  flex-direction: row; // 新增：纵向排列
  align-items: flex-start; // 新增：左对齐
  background: #ffffff;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 16px;
  font-size: 17px;
  font-weight: 500;
  color: #1f2937;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  border: 1px solid rgba(37, 99, 235, 0.1);

  &:hover {
    background: linear-gradient(to right, #f0f9ff, #e0f2fe);
    border-color: rgba(37, 99, 235, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(37, 99, 235, 0.12);
  }

  // 新增：让右侧按钮靠右
  .literature-action-icon {
    align-self: flex-end;
    margin-top: -28px; // 让按钮与标题同一行
  }
}
.literature-icon {
  font-size: 40px; // 调大即可，如40px
  width: 40px;
  height: 40px;
  margin-right: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.literature-title-text {
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
  font-family: 'Arial', sans-serif;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.literature-author-text {
  font-size: 16px;
  font-style: italic;
  color: #2563eb;
  font-family: 'Georgia', serif;
  margin-top: 4px;
}

.literature-intro-text {
  font-size: 14px;
  line-height: 1.6;
  color: #4b5563;
  font-family: 'Courier New', monospace;
  margin-top: 8px;
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
  margin: 8px 0 !important;
  padding: 12px 16px !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
  background: #f0f9ff !important;
  border: 1px solid rgba(37, 99, 235, 0.2) !important;
  
  &:hover {
    background: #e0f2fe !important;
    transform: translateX(4px);
  }
}

.search-input-large {
  width: 700px;
  font-size: 26px;
  .el-input__inner {
    height: 64px;
    font-size: 26px;
    padding-left: 28px;
    background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%) !important; // 渐变蓝色
    color: #fff !important;
    border-radius: 12px !important; // 稍微圆角
    box-shadow: 0 4px 18px 0 rgba(37,99,235,0.12); // 阴影
    transition: box-shadow 0.2s, background 0.2s;
    outline: none !important;
    border: none !important;
  }
  .el-input__inner:focus {
    outline: transparent !important;
    border: transparent !important;
    background: linear-gradient(90deg, #3b82f6 0%, #1e40af 100%) !important;
    border-color: transparent !important;
  }
  .el-input-group__append {
    .el-button {
      height: 64px;
      font-size: 24px;
      padding: 0 38px;
      background: linear-gradient(90deg, #1e40af 0%, #2563eb 100%) !important;
      color: #fff !important;
      border: none;
      border-radius: 0 12px 12px 0 !important; // 右侧圆角
      box-shadow: 0 2px 8px 0 rgba(30,64,175,0.10);
      transition: background 0.2s, box-shadow 0.2s;
    }
    .el-button:hover {
      background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%) !important;
      color: #fff !important;
      box-shadow: 0 4px 16px 0 rgba(37,99,235,0.18);
    }
  }
}
.recommend-title {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 8px 16px;
  margin-bottom: 24px;
  background: linear-gradient(to right, #f0f9ff, #ffffff);
}
.recommend-icon {
  display: flex;
  align-items: center;
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

// 美化滚动条
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 4px;
  
  &:hover {
    background: #64748b;
  }
}

.folder-dialog-custom ::v-deep(.el-dialog__header) {
  background: linear-gradient(90deg, #2563eb 0%, #60a5fa 100%);
  color: #fff;
  border-radius: 12px 12px 0 0;
  padding: 18px 24px 12px 24px;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 1px;
}
.folder-dialog-custom ::v-deep(.el-dialog__body) {
  background: #f8fafc;
  border-radius: 0 0 12px 12px;
  padding: 24px 18px 18px 18px !important;
}
.folder-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: stretch;
  max-height: 320px;
  overflow-y: auto;
  overflow-x: hidden; /* 禁止横向滚动条 */
  padding-right: 4px;
}
.folder-btn {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  font-size: 17px !important;
  font-weight: 500 !important;
  padding: 14px 20px !important;
  border-radius: 10px !important;
  background: linear-gradient(90deg, #e0f2fe 0%, #f0f9ff 100%) !important;
  color: #2563eb !important;
  border: 1.5px solid #bae6fd !important;
  box-shadow: 0 2px 8px 0 #60a5fa22;
  transition: all 0.2s;
  margin: 0 !important;
  margin-bottom: 0 !important;
}
.folder-btn:hover {
  background: linear-gradient(90deg, #dbeafe 0%, #bae6fd 100%) !important;
  color: #1e40af !important;
  border-color: #60a5fa !important;
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 4px 16px 0 #2563eb22;
}
.folder-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #2563eb;
  font-size: 16px;
}
.folder-empty {
  color: #94a3b8;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.85;
}

.folder-pagination-bar {
  font-size: 16px;
  select {
    font-size: 16px;
    border: 1.5px solid #60a5fa;
    border-radius: 6px;
    background: linear-gradient(90deg, #e0f2fe 0%, #f0f9ff 100%);
    color: #2563eb;
    outline: none;
    margin: 0 6px;
    transition: border 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 8px 0 #60a5fa22;
    &:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 2px #bae6fd66;
    }
  }
  button {
    font-size: 16px;
  }
  span {
    font-size: 16px;
  }
}

.pagination-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
  padding: 12px 16px;
}

.pagination-select {
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #ffffff;
  color: #374151;
}

.pagination-arrow,
.pagination-page {
  padding: 6px 12px;
  margin: 0 4px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #ffffff;
  color: #374151;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.pagination-arrow:disabled,
.pagination-page.active {
  background: #2563eb;
  color: #ffffff;
  cursor: default;
}

.pagination-input {
  width: 50px;
  padding: 4px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  text-align: center;
}

.literature-info {
  cursor: pointer; /* 鼠标样式为手型，表示可点击 */
  transition: background 0.2s;
}

.literature-info:hover {
  background: #f0f9ff; /* 鼠标悬停时背景颜色变化 */
}

.literature-action-icon {
  margin-left: auto;
  cursor: pointer; /* 鼠标样式为手型，表示可点击 */
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.literature-action-icon:hover {
  background: #d1fae5; /* 鼠标悬停时背景颜色变化 */
}
</style>