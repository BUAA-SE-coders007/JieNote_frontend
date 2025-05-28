<template>
  <div class="flex flex-col h-screen">
    <!-- 顶部导航栏 -->
    <nav class="relative flex flex-wrap items-center justify-between px-2 py-3 bg-emerald-500">
      <div class="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div class="w-full relative flex justify-between lg:w-auto px-4 lg:static lg:block lg:justify-start">
          <a class="text-lg font-bold leading-relaxed inline-block mr-4 py-2 whitespace-no-wrap uppercase text-white">
            回收站
          </a>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <div class="flex-1 overflow-y-auto bg-gray-100">
      <div class="container-fluid px-4 py-4">
        <div class="bg-white rounded-lg shadow p-4">
          <div v-if="isLoading" class="loading-wrapper">
            <div class="loading-content">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span class="loading-text">正在加载回收站内容...</span>
            </div>
          </div>
          
          <el-table
            v-else
            :data="recycleBinItems"
            style="width: 100%"
            v-loading="isLoading"
          >
            <el-table-column prop="name" label="名称" min-width="200">
              <template #default="{ row }">
                <span class="flex items-center">
                  {{ getItemIcon(row.type) }} {{ row.name }}
                </span>
              </template>
            </el-table-column>
            
            <el-table-column prop="type" label="类型" width="120">
              <template #default="{ row }">
                {{ getItemType(row.type) }}
              </template>
            </el-table-column>
            
            <el-table-column prop="time" label="删除时间" width="180" />
            
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  size="small"
                  @click="handleRecover(row)"
                >
                  恢复
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="handleDelete(row)"
                >
                  彻底删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-container bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
      <div class="flex-1 flex justify-between sm:hidden">
        <el-button
          :disabled="currentPage === 1"
          @click="handlePageChange(currentPage - 1)"
        >
          上一页
        </el-button>
        <el-button
          :disabled="currentPage * pageSize >= total"
          @click="handlePageChange(currentPage + 1)"
        >
          下一页
        </el-button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div class="page-size-selector">
          <span class="text-sm text-gray-700 mr-2">每页显示：</span>
          <el-select
            v-model="pageSize"
            @change="handlePageSizeChange"
            size="small"
            style="width: 100px"
          >
            <el-option
              v-for="size in [10, 20, 30, 50]"
              :key="size"
              :label="size"
              :value="size"
            />
          </el-select>
          <span class="text-sm text-gray-700 ml-2">条</span>
        </div>
        
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { getRecycleBinItems, deleteForever, recover } from '@/api/trash'

export default {
  name: 'RecycleBin',
  components: {
    Loading
  },

  setup() {
    const recycleBinItems = ref([])
    const isLoading = ref(true)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)

    // 加载回收站数据
    const loadRecycleBinItems = async () => {
      isLoading.value = true
      try {
        const response = await getRecycleBinItems({
          page_number: currentPage.value,
          page_size: pageSize.value
        })
        recycleBinItems.value = response.data.items
        total.value = response.data.items.length // 这里可能需要根据实际API返回调整
      } catch (error) {
        ElMessage.error('加载回收站数据失败：' + error.message)
      } finally {
        isLoading.value = false
      }
    }

    // 获取物品类型文本
    const getItemType = (type) => {
      const types = {
        1: '文件夹',
        2: '文献',
        3: '笔记'
      }
      return types[type] || '未知类型'
    }

    // 获取物品图标
    const getItemIcon = (type) => {
      const icons = {
        1: '📁',
        2: '📄',
        3: '📝'
      }
      return icons[type] || '❓'
    }

    // 处理恢复
    const handleRecover = async (row) => {
      try {
        const response = await recover({
          type: row.type,
          id: row.id
        })
        
        // 检查是否需要显示额外提示信息
        if (response.data.folder_name || response.data.article_name) {
          let message = '请先恢复上级'
          if (response.data.folder_name) {
            message += `文件夹"${response.data.folder_name}"`
          }
          if (response.data.article_name) {
            message += `文献"${response.data.article_name}"`
          }
          ElMessage.warning(message)
          return
        }

        ElMessage.success('恢复成功')
        await loadRecycleBinItems()
      } catch (error) {
        ElMessage.error('恢复失败：' + error.message)
      }
    }

    // 处理永久删除
    const handleDelete = (row) => {
      ElMessageBox.confirm(
        `此操作将永久删除"${row.name}"，是否继续？`,
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          try {
            await deleteForever(row.type, row.id)
            ElMessage.success('删除成功')
            await loadRecycleBinItems()
          } catch (error) {
            ElMessage.error('删除失败：' + error.message)
          }
        })
        .catch(() => {
          // 用户取消删除操作
        })
    }

    // 处理页码变化
    const handlePageChange = (page) => {
      currentPage.value = page
      loadRecycleBinItems()
    }

    // 处理每页数量变化
    const handlePageSizeChange = (size) => {
      pageSize.value = size
      currentPage.value = 1
      loadRecycleBinItems()
    }

    onMounted(() => {
      loadRecycleBinItems()
    })

    return {
      recycleBinItems,
      isLoading,
      currentPage,
      pageSize,
      total,
      getItemType,
      getItemIcon,
      handleRecover,
      handleDelete,
      handlePageChange,
      handlePageSizeChange
    }
  }
}
</script>

<style scoped>
.loading-wrapper {
  height: 400px;
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
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.pagination-container {
  position: sticky;
  bottom: 0;
  z-index: 10;
}
</style>