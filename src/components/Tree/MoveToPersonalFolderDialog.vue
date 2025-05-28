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

    <div class="folder-list-container">
      <div
          v-for="folder in mockFolderList"
          :key="folder.id"
          class="folder-item"
          :class="{ selected: selectedFolderId === folder.id }"
          @click="selectedFolderId = folder.id"
      >
        📁 {{ folder.name }}
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose" class="modern-cancel">取消</el-button>
      <el-button
          type="primary"
          :disabled="!selectedFolderId"
          @click="handleConfirm"
          class="modern-save"
      >
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { ElMessage } from 'element-plus'

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
      mockFolderList: [
        {id: 1, name: '我的研究'},
        {id: 2, name: '课程资料'},
        {id: 3, name: '阅读清单'},
        {id: 4, name: '待分类'},
      ],
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.visibleInternal = val
        if (val) {
          this.selectedFolderId = null
        }
      },
    },
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleConfirm() {
      const targetFolder = this.mockFolderList.find(f => f.id === this.selectedFolderId)
      ElMessage.success(`模拟转移成功：文件 ID ${this.itemId} → ${targetFolder.name}`)
      this.$emit('moved', {itemId: this.itemId, folder: targetFolder})
      this.handleClose()
    },
  },
}
</script>

<style scoped>
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
</style>
