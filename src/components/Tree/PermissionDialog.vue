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
            v-for="user in finalUserList"
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
import axios from 'axios'
import { ElMessage } from 'element-plus'

export default {
  name: 'PermissionSettingDialog',
  props: {
    visible: Boolean,
    groupId: Number,
    itemId: Number,
    itemType: Number,
    userList: Array,
    existingPermissions: Object,
  },
  emits: ['update:visible', 'saved'],
  data() {
    return {
      visibleInternal: false,
      localPermissions: {},
      mockUsers: [
        { id: 101, name: '张三' },
        { id: 102, name: '李四' },
        { id: 103, name: '王五' },
        { id: 104, name: '张三' },
        { id: 105, name: '李四' },
        { id: 106, name: '王五' },
        { id: 107, name: '张三' },
        { id: 108, name: '李四' },
        { id: 109, name: '王五' },
        { id: 110, name: '张三' },
        { id: 111, name: '李四' },
        { id: 112, name: '王五' },
      ],
      mockPermissions: {
        101: 1,
        102: 2,
        103: 0,
        104: 1,
        105: 2,
        106: 0,
        107: 1,
        108: 2,
        109: 0,
        110: 1,
        111: 2,
        112: 0,
      },
    }
  },
  computed: {
    finalUserList() {
      return this.userList?.length ? this.userList : this.mockUsers
    },
    finalPermissions() {
      return this.existingPermissions && Object.keys(this.existingPermissions).length
          ? this.existingPermissions
          : this.mockPermissions
    },
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.visibleInternal = val
        if (val) {
          this.initializePermissions()
        }
      },
    },
  },
  methods: {
    initializePermissions() {
      this.localPermissions = {}
      for (const user of this.finalUserList) {
        this.localPermissions[user.id] = this.finalPermissions[user.id] ?? 1
      }
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    async handleSave() {
      const changed = []
      for (const user of this.finalUserList) {
        const newPerm = this.localPermissions[user.id]
        const oldPerm = this.finalPermissions[user.id] ?? 1
        if (newPerm !== oldPerm) {
          changed.push({
            group_id: this.groupId,
            user_id: user.id,
            item_type: this.itemType,
            item_id: this.itemId,
            permission: newPerm,
          })
        }
      }

      if (!changed.length) {
        ElMessage.info('没有权限变化')
        return
      }

      try {
        await Promise.all(
            changed.map((item) =>
                axios.post(
                    'http://127.0.0.1:4523/m1/6178223-5870624-default/group/permissionDefine',
                    item,
                    {
                      headers: {
                        Authorization: 'Bearer your_token_here', // 请替换
                      },
                    }
                )
            )
        )
        ElMessage.success('权限设置已保存')
        this.$emit('saved')
        this.handleClose()
      } catch (e) {
        ElMessage.error('保存失败')
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

/* 新增滚动容器，最多展示6个人高度，超出滚动 */
.modern-form-container {
  max-height: 306px; /* 6项*51px左右，适配紧凑样式 */
  overflow-y: auto;
  margin-bottom: 0;
  /* 保留圆角，防止溢出时显示丑陋 */
  border-radius: 9px;
  /* 可选：让滚动条更美观 */
  scrollbar-width: thin;
  scrollbar-color: #b6c4d8 #f1f3f7;
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