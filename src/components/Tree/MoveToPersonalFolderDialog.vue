<template>
  <el-dialog
      v-model="visibleInternal"
      title=""
      width="420px"
      @close="handleClose"
      :close-on-click-modal="false"
      class="modern-move-dialog"
  >
    <div class="dialog-title">
      <span class="title-main">转移到个人文件</span>
    </div>
    <div class="divider"></div>
    <div class="dialog-tip">请选择一个目标文件夹</div>

    <!-- 文件夹加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <span>加载文件夹中...</span>
    </div>

    <!-- 文件夹列表 -->
    <div v-else-if="folderList.length > 0" class="folder-list-container">
      <div
          v-for="folder in folderList"
          :key="folder.folder_id"
          class="folder-item"
          :class="{ selected: selectedFolderId === folder.folder_id }"
          @click="selectedFolderId = folder.folder_id"
      >
        📁 {{ folder.folder_name || '默认文件夹' }}
      </div>
    </div>

    <!-- 空状态提示 -->
    <div v-else class="empty-folder">
      <el-empty description="暂无文件夹" :image-size="60" />
    </div>

    <template #footer>
      <el-button @click="handleClose" class="modern-cancel">取消</el-button>
      <el-button
          type="primary"
          :disabled="!selectedFolderId || loading"
          @click="handleConfirm"
          class="modern-save"
          :loading="transferring"
      >
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { ElMessage } from 'element-plus'
import { getSelfFolders } from '@/api/dashboard'
import { copyToPersonalFolder } from '@/api/group_tree'

export default {
  name: 'MoveToPersonalFolderDialog',
  props: {
    visible: Boolean,
    itemId: Number,
  },
  emits: ['update:visible', 'moved'],
  data() {
    return {
      visibleInternal: false,
      selectedFolderId: null,
      folderList: [],
      loading: false,
      transferring: false
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.visibleInternal = val
        if (val) {
          this.selectedFolderId = null
          this.fetchFolders()
        }
      },
    },
  },
  methods: {
    // 获取个人文件夹列表
    async fetchFolders() {
      this.loading = true
      try {
        const response = await getSelfFolders()
        this.folderList = response.data.result || []

        // 默认选中第一个文件夹（如果有）
        if (this.folderList.length > 0) {
          this.selectedFolderId = this.folderList[0].folder_id
        }
      } catch (error) {
        console.error('获取文件夹列表失败:', error)
        ElMessage.error('获取文件夹列表失败，请重试')
      } finally {
        this.loading = false
      }
    },

    handleClose() {
      this.$emit('update:visible', false)
    },

    // 确认转移文献
    async handleConfirm() {
      if (!this.selectedFolderId || !this.itemId) return

      this.transferring = true
      try {
        const params = {
          folder_id: String(this.selectedFolderId),
          article_id: String(this.itemId),
          is_group: true
        }

        await copyToPersonalFolder(params)

        const targetFolder = this.folderList.find(f => f.folder_id === this.selectedFolderId)
        ElMessage.success(`文献已成功转移到 ${targetFolder.folder_name || '默认文件夹'}`)
        this.$emit('moved', { itemId: this.itemId, folder: targetFolder })
        this.handleClose()
      } catch (error) {
        console.error('转移文献失败:', error)
        ElMessage.error(error.response?.data?.message || '转移文献失败，请重试')
      } finally {
        this.transferring = false
      }
    },
  },
}
</script>

<style scoped>
/* 原有样式保持不变 */
:deep(.el-dialog.modern-move-dialog) {
  border-radius: 13px;
  box-shadow: 0 4px 24px 0 rgba(49, 72, 123, 0.13);
  background: #fbfcfd;
  padding-top: 0 !important;
}

.dialog-title {
  padding: 20px 0 2px;
  text-align: center;
}

.title-main {
  font-size: 18px;
  font-weight: 600;
  color: #2c3440;
  letter-spacing: 0.5px;
}

.divider {
  width: 32px;
  margin: 0 auto 12px;
  border-bottom: 1.5px solid #77a7ff;
  border-radius: 2px;
  opacity: 0.13;
}

.dialog-tip {
  color: #6e7687;
  font-size: 13px;
  margin-bottom: 10px;
  text-align: center;
}

.folder-list-container {
  max-height: 280px;
  overflow-y: auto;
  padding: 0 10px;
  margin-bottom: 10px;
}

.folder-item {
  background: #f6f8fb;
  border: 1px solid #e5eaf2;
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  font-size: 14px;
  color: #2c3e50;
}

.folder-item:hover {
  background: #eef3fc;
  border-color: #5e90ff;
}

.folder-item.selected {
  background: #e5efff;
  border-color: #357aff;
  color: #2563eb;
}

:deep(.el-dialog__footer) {
  padding: 14px 24px 18px;
  text-align: right;
}

.modern-cancel,
.modern-save {
  border-radius: 7px !important;
  font-size: 13px;
  min-width: 60px;
  padding: 5px 16px;
}

.modern-cancel {
  background: #e6e8eb !important;
  color: #364250 !important;
  border: none !important;
}

.modern-cancel:hover {
  background: #dadce0 !important;
}

.modern-save {
  background: linear-gradient(90deg, #5e90ff 0%, #357aff 100%) !important;
  color: #fff !important;
  font-weight: 500;
  border: none !important;
  box-shadow: 0 1.5px 6px 0 rgba(80, 136, 255, 0.08);
}

.modern-save:hover {
  background: linear-gradient(90deg, #357aff 0%, #5e90ff 100%) !important;
}

/* 新增样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #6e7687;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #357aff;
  border-radius: 50%;
  margin-bottom: 12px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-folder {
  padding: 20px 0;
}
</style>