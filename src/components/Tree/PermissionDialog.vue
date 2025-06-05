<template>
  <el-dialog
      v-model="visibleInternal"
      title=""
      width="420px"
      @close="handleClose"
      :close-on-click-modal="false"
      class="modern-permission-dialog"
  >
    <div class="dialog-title">
      <span class="title-main">权限设置</span>
    </div>
    <div class="divider"></div>
    <div class="dialog-tip">
      您希望这些文件对成员的权限是？
    </div>
    <!-- 滚动容器包裹表单 -->
    <div class="modern-form-container">
      <el-form :model="localPermissions" class="modern-form">
        <el-form-item
            v-for="user in userList"
            :key="user.id"
            :label="user.name"
            label-width="72px"
            class="modern-form-item"
        >
          <el-select
              v-model="localPermissions[user.id]"
              placeholder="选择权限"
              style="width: 140px"
              :teleported="false"
              class="modern-select"
          >
            <el-option label="不可见" :value="0" />
            <el-option label="可查看" :value="1" />
            <el-option label="可编辑" :value="2" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="handleClose" class="modern-cancel">取消</el-button>
      <el-button type="primary" @click="handleSave" class="modern-save">保存</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { ElMessage } from 'element-plus'
import {
  getPermissions,
  definePermission
} from '@/api/define' // 假设权限API已封装在group.js中

export default {
  name: 'PermissionSettingDialog',
  props: {
    visible: Boolean,
    groupId: Number,
    itemId: Number,
    itemType: Number,
  },
  emits: ['update:visible', 'saved'],
  data() {
    return {
      visibleInternal: false,
      userList: [],          // 用户列表（从API获取）
      localPermissions: {},  // 当前权限设置
      initialPermissions: {},// 初始权限状态（用于比较变化）
      loading: false,        // 加载状态
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.visibleInternal = val
        if (val) {
          this.fetchPermissions()
        }
      },
    },
  },
  methods: {
    // 获取权限数据
    async fetchPermissions() {
      console.log(this.groupId)
      console.log(this.itemType)
      console.log(this.itemId)
      this.loading = true
      try {
        // 调用封装好的获取权限接口
        const response = await getPermissions({
          group_id: this.groupId,
          item_type: this.itemType,
          item_id: this.itemId
        })

        console.log(response)

        // 处理API返回的数据
        const { unaccessible = [], read_only = [], writeable = [] } = response.data

        // 合并所有用户并去重
        const allUsers = [...unaccessible, ...read_only, ...writeable]
        const uniqueUsers = []
        const seen = new Set()

        allUsers.forEach(user => {
          if (!seen.has(user.user_id)) {
            seen.add(user.user_id)
            uniqueUsers.push({
              id: user.user_id,
              name: user.user_name,
            })
          }
        })

        this.userList = uniqueUsers
        console.log(this.userList)

        // 构建权限映射
        const permissionsMap = {}
        unaccessible.forEach(user => permissionsMap[user.user_id] = 0)
        read_only.forEach(user => permissionsMap[user.user_id] = 1)
        writeable.forEach(user => permissionsMap[user.user_id] = 2)

        // 初始化权限设置
        this.localPermissions = {}
        this.userList.forEach(user => {
          this.localPermissions[user.id] = permissionsMap[user.id] ?? 1 // 默认权限为可查看
        })

        // 保存初始状态用于比较变化
        this.initialPermissions = { ...this.localPermissions }

      } catch (error) {
        ElMessage.error('获取权限数据失败')
        console.error('获取权限失败:', error)
      } finally {
        this.loading = false
      }
    },

    handleClose() {
      this.$emit('update:visible', false)
    },

    async handleSave() {
      if (this.loading) return

      const changed = []

      // 找出变化的权限
      for (const user of this.userList) {
        const userId = user.id
        const newPerm = this.localPermissions[userId]
        const oldPerm = this.initialPermissions[userId] ?? 1

        if (newPerm !== oldPerm) {
          changed.push({
            group_id: this.groupId,
            user_id: userId,
            item_type: this.itemType,
            item_id: this.itemId,
            permission: newPerm,
          })
        }
      }

      if (changed.length === 0) {
        ElMessage.info('没有权限变化')
        return
      }

      try {
        // 批量更新权限
        console.log(changed)
        await Promise.all(changed.map(item => definePermission(item)))
        ElMessage.success('权限设置已保存')
        this.$emit('saved')
        this.handleClose()
      } catch (error) {
        ElMessage.error('保存权限失败')
        console.error('保存权限失败:', error)
      }
    },
  },
}
</script>

<style scoped>
:deep(.el-dialog.modern-permission-dialog) {
  border-radius: 13px;
  box-shadow: 0 4px 24px 0 rgba(49, 72, 123, 0.13);
  background: #fbfcfd;
  padding-top: 0 !important;
  min-width: 340px;
}

.dialog-title {
  padding: 20px 0 2px 0;
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
  margin: 0 auto 12px auto;
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

.modern-form-container {
  max-height: 306px;
  /* 移除 overflow-y: auto */
  margin-bottom: 0;
  border-radius: 9px;
  position: relative; /* 添加定位上下文 */
}

/* 添加自定义下拉菜单样式 */
:deep(.modern-select .el-select-dropdown) {
  z-index: 9999 !important; /* 确保下拉菜单在最上层 */
}

/* 自定义滚动条美化（webkit浏览器） */
.modern-form-container::-webkit-scrollbar {
  width: 6px;
}

.modern-form-container::-webkit-scrollbar-thumb {
  background: #e1e8f0;
  border-radius: 6px;
}

.modern-form-container::-webkit-scrollbar-track {
  background: #f7f9fa;
  border-radius: 6px;
}

.modern-form {
  margin-top: 0;
}

:deep(.modern-form-item .el-form-item__label) {
  color: #3b4255;
  font-weight: 500;
  font-size: 14px;
  padding-right: 4px;
}

:deep(.modern-form-item .el-form-item__content) {
  display: flex;
  align-items: center;
}

:deep(.modern-select .el-input__inner) {
  border-radius: 7px;
  border: 1px solid #e5eaf2;
  background: #f7f8fa;
  font-size: 13px;
  min-height: 30px;
  height: 30px;
  padding: 3px 10px;
  transition: border-color 0.2s;
}

:deep(.modern-select .el-input__inner:focus) {
  border-color: #5e90ff;
  background: #edf5ff;
}

:deep(.modern-select .el-input__wrapper) {
  border-radius: 7px !important;
  box-shadow: none !important;
  min-height: 30px;
}

:deep(.modern-select .el-select-dropdown) {
  border-radius: 7px !important;
  font-size: 13px;
}

:deep(.modern-select .el-select-dropdown__item) {
  font-size: 13px;
  min-height: 32px;
  line-height: 32px;
}

:deep(.modern-select .el-select-dropdown__item.selected) {
  background: #e9f3ff !important;
  color: #2563eb !important;
}

:deep(.modern-select .el-select-dropdown__item:hover) {
  background: #eff6ff !important;
  color: #4f8fff !important;
}

:deep(.modern-form-item) {
  margin-bottom: 9px !important;
}

:deep(.el-dialog__footer) {
  padding: 14px 24px 18px;
  text-align: right;
}

.modern-cancel {
  border-radius: 7px !important;
  background: #e6e8eb !important;
  color: #364250 !important;
  border: none !important;
  font-size: 13px;
  padding: 5px 16px;
  margin-right: 8px;
  transition: background 0.2s;
  min-width: 60px;
}

.modern-cancel:hover {
  background: #dadce0 !important;
}

.modern-save {
  border-radius: 7px !important;
  background: linear-gradient(90deg, #5e90ff 0%, #357aff 100%) !important;
  color: #fff !important;
  font-weight: 500;
  border: none !important;
  font-size: 13px;
  padding: 5px 20px;
  min-width: 60px;
  box-shadow: 0 1.5px 6px 0 rgba(80, 136, 255, 0.08);
  transition: background 0.2s;
}

.modern-save:hover {
  background: linear-gradient(90deg, #357aff 0%, #5e90ff 100%) !important;
}
</style>