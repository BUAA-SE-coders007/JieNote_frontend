<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 导航栏保持不变 -->
    <el-header class="main-header">
      <el-row type="flex" justify="space-between" align="middle" class="header-content">
        <!-- 左侧组织信息 -->
        <el-col :span="16" class="left-info" style="padding-left: 0">
          <div class="organization-info">
            <el-image
                class="organization-logo"
                :src="logoUrl"
                fit="contain"
                style="width: 40px; height: 40px; margin-right: 12px"> <!-- 替换原Tailwind尺寸 -->
            </el-image>
            <div class="organization-meta">
              <h1 class="organization-name">{{ organizationName }}
                <el-icon
                    class="cursor-pointer ml-2 hover:text-blue-500 transition-colors"
                    @click="openOrgEditDialog"
                >
                  <Edit />
                </el-icon>
              </h1>
              <div class="organization-details">
                <el-text class="description" truncated>{{ organizationDescription }}</el-text>
                <div class="meta-items">
                  <el-text class="meta-item">
                    <el-icon><Calendar /></el-icon>
                    {{ creationDate }}
                  </el-text>
                  <el-text class="meta-item">
                    <el-icon><User /></el-icon>
                    {{ memberCount }} 位成员
                  </el-text>
                </div>
              </div>
            </div>
          </div>
        </el-col>

        <!-- 右侧操作区 -->
        <el-col :span="8" class="right-actions" style="padding-right: 0">
          <div class="action-group">
            <el-badge
                v-if="showMessageBox"
                :value="unreadCount"
                :max="99"
                class="message-badge"
                :hidden="unreadCount === 0"
            >
              <el-button
                  type="success"
                  size="small"
                  class="message-button"
                  @click="handleMessageClick"
              >
                <el-icon class="message-icon" style="margin-right: 4px"><Message /></el-icon>
                消息盒子
              </el-button>
            </el-badge>
            <el-button
                v-if="showInviteButton"
                type="primary"
                size="small"
                class="invite-button"
                @click="showInviteDialog = true"
                style="margin-right: 12px">
              <el-icon style="margin-right: 4px"><CirclePlus /></el-icon> <!-- 替换原mr-1 -->
              邀请成员
            </el-button>

            <el-dropdown class="user-profile">
              <div class="profile-content">
                <el-text class="username">欢迎，{{ userName }}</el-text>
                <el-avatar
                    :size="36"
                    :src="userAvatar"
                    style="margin-left: 8px"> <!-- 替换原ml-2 -->
                </el-avatar>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人主页</el-dropdown-item>
                  <el-dropdown-item divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
    </el-header>

    <!-- 主内容区 -->
    <div class="flex max-w-screen-xl px-4 mx-auto mt-4 gap-4">
      <!-- 左侧树结构 -->
      <div class="flex-1 p-4 overflow-auto">
        <simple-tree :user-role="currentUserRole"/>
      </div>

      <!-- 修改后的成员列表侧边栏 -->
      <div
          class="w-96 h-[calc(100vh-140px)] bg-white rounded-xl shadow-lg dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
        <div class="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white text-center">👥 组织成员</h2>
        </div>

        <!-- 成员列表 -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <div
              v-for="member in sortedMembers"
              :key="member.id"
              @contextmenu.prevent="openContextMenu($event, member)"
              class="group flex items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200 cursor-pointer transform hover:scale-[1.02] shadow-sm hover:shadow-md border border-transparent hover:border-blue-100 dark:hover:border-gray-600"
          >
            <!-- 头像添加装饰 -->
            <div class="relative">
              <img
                  :src="member.avatar"
                  class="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-offset-2 transition-all duration-300"
                  :class="{
              'ring-red-400': member.role === '组长',
              'ring-blue-400': member.role === '管理员',
              'ring-gray-300': member.role === '组员'
               }"
                  :alt="member.name"
              >
            </div>

            <!-- 成员信息 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <div class="flex items-baseline gap-1.5">
                  <p class="member-name">
                    {{ truncateName(member.name) }}
                  </p>
                  <span class="text-[0.9em] leading-none translate-y-[1px]"
                        :class="{
                        'text-amber-400/90': member.role === '组长',
                        'text-sky-500/90': member.role === '管理员',
                        'text-gray-400': member.role === '组员'
                        }">
                        <template v-if="member.role === '组长'">👑</template>
                        <template v-else-if="member.role === '管理员'">🛡️</template>
                        <template v-else>👤</template>
                  </span>
                </div>
                <span class="role-badge font-medium px-2 py-1 rounded-full tracking-tight"
                      :data-role="member.role">
                    {{ member.role }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex flex-col space-y-2">
            <el-button
                v-if="currentUserRole === '组长'"
                type="danger"
                class="w-full el-button no-focus"
                @click="confirmDisband"
            >
              <span class="text-sm">解散组织</span>
            </el-button>

            <el-button
                v-if="currentUserRole !== '组长'"
                type="danger"
                class="w-full el-button no-focus"
                @click="confirmLeave"
            >
              <span class="text-sm">退出组织</span>
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div
        v-if="showContextMenu && selectedMember.role !== '组长'"
        class="fixed z-50 min-w-[160px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
        :style="{
      top: menuPosition.y + 'px',
      left: menuPosition.x + 'px'
    }"
        @click.stop
    >
      <div class="p-1 space-y-1">
        <template v-if="currentUserRole === '组长'">
          <div
              v-if="selectedMember.role === '组员'"
              class="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
              @click="setAsAdmin"
          >
            设为管理员
          </div>
          <div
              v-if="selectedMember.role === '管理员'"
              class="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
              @click="setOFFAdmin"
          >
            移除管理员
          </div>
        </template>
        <div
            v-if="currentUserRole !== '组员'"
            class="px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md cursor-pointer"
            @click="removeMember"
        >
          移除成员
        </div>
      </div>
    </div>
    <el-dialog
        v-model="showInviteDialog"
        title="组织邀请码"
        width="500px"
        :close-on-click-modal="false"
        custom-class="dark:bg-gray-800"
        :append-to-body="true"
    >
      <div class="space-y-4">
        <!-- 邀请码展示区域 -->
        <div class="relative group">
          <div class="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <span class="font-mono text-gray-800 dark:text-gray-200">{{ inviteCode }}</span>
            <el-tooltip effect="dark" content="复制邀请码" placement="top">
              <el-button
                  type="success"
                  size="small"
                  class="!px-2 !py-1 hover:!bg-green-500/90"
                  @click="copyCode"
              >
                <el-icon class="text-base">
                  <DocumentCopy/>
                </el-icon>
              </el-button>
            </el-tooltip>
          </div>
          <!-- 复制反馈提示 -->
          <transition name="el-fade-in">
            <div
                v-if="copyFeedback"
                class="absolute -bottom-6 left-0 text-xs"
                :class="{
            'text-green-500': copyFeedback.type === 'success',
            'text-red-500': copyFeedback.type === 'error'
          }"
            >
              {{ copyFeedback.message }}
            </div>
          </transition>
        </div>

        <p class="text-sm text-gray-500 dark:text-gray-400">
          ✨ 将此邀请码发送给需要加入组织的成员，他们可以通过此码加入组织
        </p>
      </div>
    </el-dialog>
    <el-dialog
        v-model="showMessageDialog"
        title="待处理操作"
        width="680px"
        custom-class="message-dialog dark:bg-gray-800"
    >
      <div class="message-list space-y-3">
        <div
            v-for="message in messages"
            :key="message.id"
            class="message-item group relative p-4 bg-white dark:bg-gray-700 rounded-lg transition-all duration-300"
        >
          <div class="flex items-center justify-between">
            <div class="message-content">
              <div class="flex items-baseline gap-2">
              <span class="user-name font-medium text-gray-800 dark:text-gray-200">
                {{ message.user }}
              </span>
                <span class="action-type text-sm text-blue-500">
                {{ message.action }}了
              </span>
                <span class="file-name text-gray-600 dark:text-gray-300 font-mono text-sm">
                {{ message.fileName }}
              </span>
              </div>
              <div class="timestamp text-xs text-gray-400 mt-1">
                {{ message.time }}
              </div>
            </div>
            <div class="message-actions flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <el-button
                  size="small"
                  type="success"
                  class="!px-3 !h-8 shadow-sm"
                  @click="handleApprove(message.id)"
              >✓ 同意</el-button>
              <el-button
                  size="small"
                  type="danger"
                  class="!px-3 !h-8 shadow-sm"
                  @click="handleReject(message.id)"
              >✕ 拒绝</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
        v-if="showEditButton"
        v-model="showOrgEditDialog"
        title="编辑组织信息"
        width="500px"
        custom-class="dark:bg-gray-800"
    >
      <div class="space-y-4">
        <!-- 组织头像上传 -->
        <div class="flex items-center gap-4">
          <el-avatar :size="80" :src="tempOrgInfo.logo" />
          <div>
            <input
                type="file"
                ref="fileInput"
                accept="image/*"
                @change="handleOrgAvatarUpload"
                class="hidden"
            >
            <el-button
                type="primary"
                size="small"
                @click="$refs.fileInput.click()"
            >
              更换头像
            </el-button>
            <p class="text-gray-500 text-xs mt-1">建议尺寸 200x200，支持JPG/PNG格式</p>
          </div>
        </div>

        <!-- 组织名称 -->
        <div>
          <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">组织名称</label>
          <input
              type="text"
              v-model="tempOrgInfo.name"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="请输入组织名称"
          />
        </div>

        <!-- 组织描述 -->
        <div>
          <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">组织描述</label>
          <textarea
              id="introduction"
              v-model="tempOrgInfo.description"
              class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              rows="3"
              placeholder="请输入组织描述"
              maxlength="100"
          ></textarea>
          <div :class="counterClass" class="text-right text-sm mt-1">
            {{ tempOrgInfo.description.length }}/100
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end gap-2 mt-6">
          <el-button @click="showOrgEditDialog = false">取消</el-button>
          <el-button type="primary" @click="saveOrgInfo">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SimpleTree from '@/components/Tree/SimpleTree.vue'
import {ElMessageBox, ElMessage} from 'element-plus'
import {CirclePlus, DocumentCopy, Calendar, User, Edit, Message} from '@element-plus/icons-vue'
import {
  genGroupInviteCode,
  getGroupBasicInfo, getGroupPeopleInfo, getMyGroupLevel,
  leaveGroup,
  modifyAdminList,
  modifyGroupBasicInfo,
  removeGroupMember
} from "@/api/someOrganization";

export default {
  components: {
    SimpleTree,
    CirclePlus,
    DocumentCopy,
    Calendar,
    User,
    Edit,
    Message
  },
  created() {
    this.initData()
  },
  computed: {
    showMessageBox() {
      return ['组长', '管理员'].includes(this.currentUserRole)
    },
    unreadCount() {
      return this.messages.filter(m => m.status === 'pending').length
    },
    counterClass() {
      const count = this.tempOrgInfo.description.length;
      return {
        'text-green-500': count < 90,
        'text-yellow-500': count >= 90 && count < 100,
        'text-red-500': count >= 100
      };
    },
    showInviteButton() {
      return ['组长', '管理员'].includes(this.currentUserRole)
    },
    showEditButton() {
      return ['组长'].includes(this.currentUserRole)
    },
    sortedMembers() {
      const order = {'组长': 1, '管理员': 2, '组员': 3};
      return [...this.members].sort((a, b) => order[a.role] - order[b.role]);
    }
  },
  data() {
    return {
      group_id: localStorage.getItem('current_group_id') || 0,
      showMessageDialog: false,
      messages: [
        {
          id: 1,
          user: '张三',
          action: '修改',
          fileName: '项目计划书.pdf',
          status: 'pending'
        },
        {
          id: 2,
          user: '李四',
          action: '上传',
          fileName: '设计稿.jpg',
          status: 'pending'
        }
      ],
      showOrgEditDialog: false,
      tempOrgInfo: {
        logo: '',
        name: '',
        description: ''
      },
      userName: '筱陌、清风',
      userAvatar: 'https://flowbite.com/docs/images/logo.svg',
      logoUrl: 'https://flowbite.com/docs/images/logo.svg',
      organizationName: 'JieNote',
      creationDate: '2025-05-20 创建',
      memberCount: 5,
      organizationDescription: '致力于打造高效协作的技术团队',
      showInviteDialog: false,
      inviteCode: 'ORG-5X2A-9BCC', // 实际应从接口获取
      copyFeedback: null,
      currentUserRole: '组长', // 默认为组长
      showContextMenu: false,
      menuPosition: {x: 0, y: 0},
      selectedMember: null,
      members: [
        // 数据保持不变
        {
          id: 1,
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          name: '张三',
          role: '组长'
        },
        {
          id: 2,
          avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
          name: '李四',
          role: '管理员'
        },
        {
          id: 3,
          avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
          name: 'youshouldkonw',
          role: '组员'
        },
        {
          id: 4,
          avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
          name: '赵六',
          role: '组员'
        },
        {
          id: 5,
          avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
          name: '陈七',
          role: '管理员'
        }
      ]
    }
  },
  methods: {
    async fetchGroupInfo() {
      try {
        const res = await getGroupBasicInfo({group_id: this.group_id})
        this.organizationName = res.name
        this.organizationDescription = res.desc
        this.logoUrl = res.avatar
      } catch (error) {
        ElMessage.error('获取组织信息失败')
      }
    },

    handleMessageClick() {
      this.showMessageDialog = true
      // 在下一个事件循环移除焦点
      this.$nextTick(() => {
        this.$refs.messageButtonRef?.$el?.blur()
        document.activeElement?.blur()
      })
    },
    handleApprove(id) {
      this.messages = this.messages.filter(m => m.id !== id)
      ElMessage.success('已同意该操作')
    },
    handleReject(id) {
      this.messages = this.messages.filter(m => m.id !== id)
      ElMessage.warning('已拒绝该操作')
    },
    openOrgEditDialog() {
      this.tempOrgInfo = {
        logo: this.logoUrl,
        name: this.organizationName,
        description: this.organizationDescription
      }
      this.showOrgEditDialog = true
    },

    async handleOrgAvatarUpload(event) {
      const file = event.target.files[0]
      if (file) {
        // 这里可以添加图片压缩或裁剪逻辑（参考CardSettings.vue）
        const reader = new FileReader()
        reader.onload = (e) => {
          this.tempOrgInfo.logo = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },

    async saveOrgInfo() {
      try {
        const formData = new FormData()
        formData.append('group_id', this.group_id)
        formData.append('group_name', this.tempOrgInfo.name)
        formData.append('group_desc', this.tempOrgInfo.description)

        if (this.$refs.fileInput.files[0]) {
          formData.append('group_avatar', this.$refs.fileInput.files[0])
        }

        await modifyGroupBasicInfo(formData)
        this.organizationName = this.tempOrgInfo.name
        this.organizationDescription = this.tempOrgInfo.description
        this.showOrgEditDialog = false
        ElMessage.success('组织信息已更新')
      } catch (error) {
        ElMessage.error('保存失败，请稍后重试')
      }
    },
    openContextMenu(event, member) {
      if (this.currentUserRole === '组员') return

      this.selectedMember = member
      this.menuPosition = {
        x: event.clientX,
        y: event.clientY
      }
      this.showContextMenu = true

      // 添加全局点击监听
      document.addEventListener('click', this.closeContextMenu)
    },
    closeContextMenu() {
      this.showContextMenu = false
      document.removeEventListener('click', this.closeContextMenu)
    },
    async setAsAdmin() {
      try {
        await modifyAdminList({
          group_id: this.group_id,
          user_id: this.selectedMember.id,
          add_admin: true
        })
        this.members = this.members.map(m =>
            m.id === this.selectedMember.id ? {...m, role: '管理员'} : m
        )
        this.closeContextMenu()
      } catch (error) {
        ElMessage.error('设置管理员失败')
      }
    },
    async setOFFAdmin() {
      try {
        await modifyAdminList({
          group_id: this.group_id,
          user_id: this.selectedMember.id,
          add_admin: false
        })
        this.members = this.members.map(m =>
            m.id === this.selectedMember.id ? {...m, role: '组员'} : m
        )
        this.closeContextMenu()
      } catch (error) {
        ElMessage.error('取消管理员失败')
      }
    },
    async removeMember() {
      try {
        await removeGroupMember({
          group_id: this.group_id,
          user_id: this.selectedMember.id
        })
        this.members = this.members.filter(m => m.id !== this.selectedMember.id)
        this.closeContextMenu()
      } catch (error) {
        ElMessage.error('移除成员失败')
      }
    },
    truncateName(name) {
      const maxLength = 6;
      return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
    },
    confirmDisband() {
      // 获取当前按钮元素
      const triggerBtn = this.$el.querySelector('.disband-btn')

      ElMessageBox.confirm(
          '确定要解散组织吗？此操作将永久删除所有数据！',
          '解散确认',
          {
            confirmButtonText: '确认解散',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
            customClass: 'dark:bg-gray-800'
          }
      )
          .then(() => {
            this.disbandGroup()
          })
          .catch(() => {
          })
          .finally(() => {
            // 强制移除焦点状态
            this.$nextTick(() => {
              triggerBtn?.blur()
              document.activeElement?.blur()
            })
          })
    },
    // openMessage() {
    //   this.showMessageDialog = true
    //   const triggerBtn = this.$el.querySelector('.disband-btn')
    //       .finally(() => {
    //         // 强制移除焦点状态
    //         this.$nextTick(() => {
    //           triggerBtn?.blur()
    //           document.activeElement?.blur()
    //         })
    //       })
    // },
    async copyCode(event) {
      try {// 添加event参数
        const target = event.currentTarget  // 获取按钮元素
        const res = await genGroupInviteCode({
          group_id: this.group_id,
          user_email: localStorage.getItem('user_email')
        })
        this.inviteCode = res.inviteCode

        navigator.clipboard.writeText(this.inviteCode)
            .then(() => {
              ElMessage({
                type: 'success',
                message: '复制成功！邀请码已存入剪贴板',
                duration: 3000,
                customClass: 'dark:!bg-gray-700 dark:!text-gray-200'
              })
            })
            .catch(() => {
              ElMessage({
                type: 'error',
                message: '复制失败，请手动选择文本复制',
                duration: 3000,
                customClass: 'dark:!bg-gray-700 dark:!text-gray-200'
              })
            })
            .finally(() => {
              target.blur()  // 强制移除焦点
              this.$refs.copyBtnRef?.blur()  // 双重保障
            })
      } catch (error) {
        ElMessage.error('获取邀请码失败')
      }
    },

    confirmLeave() {
      const triggerBtn = this.$el.querySelector('.leave-btn')

      ElMessageBox.confirm(
          '确定要退出当前组织吗？',
          '退出确认',
          {
            confirmButtonText: '确认退出',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
            customClass: 'dark:bg-gray-800'
          }
      )
          .then(() => {
            this.leaveGroup()
          })
          .catch(() => {
          })
          .finally(() => {
            this.$nextTick(() => {
              triggerBtn?.blur()
              document.activeElement?.blur()
            })
          })
    },


    async disbandGroup() {
      try {
        // 假设解散接口为removeGroupMember特殊调用
        await removeGroupMember({
          group_id: this.group_id,
          user_id: 'all' // 根据实际API调整
        })
        this.members = []
        // this.$router.push('/groups')
      } catch (error) {
        ElMessage.error('解散组织失败')
      }
    },

    async leaveGroup() {
      try {
        await leaveGroup({group_id: this.group_id})
        // 跳转到组织选择页或其他处理
        // this.$router.push('/groups')
      } catch (error) {
        ElMessage.error('退出组织失败')
      }
    },
    async fetchMembers() {
      try {
        const res = await getGroupPeopleInfo({group_id: this.group_id})

        // 合并所有成员并分配角色
        const mergedMembers = [
          // 处理组长（单个对象）
          ...(res.leader ? [{
            id: res.leader.id,
            name: res.leader.name,
            avatar: res.leader.avatar,
            role: '组长'
          }] : []),

          // 处理管理员（数组）
          ...(res.admins || []).map(admin => ({
            id: admin.id,
            name: admin.name,
            avatar: admin.avatar,
            role: '管理员'
          })),

          // 处理普通成员（数组）
          ...(res.members || []).map(member => ({
            id: member.id,
            name: member.name,
            avatar: member.avatar,
            role: '组员'
          }))
        ]

        // 去重处理（防止数据异常时重复）
        const uniqueMembers = mergedMembers.reduce((acc, current) => {
          if (!acc.find(item => item.id === current.id)) {
            acc.push(current)
          }
          return acc
        }, [])

        this.members = uniqueMembers
        this.memberCount = uniqueMembers.length // 更新成员总数

      } catch (error) {
        console.error('获取成员列表失败:', error)
        ElMessage.error('获取成员信息失败，请稍后重试')
      }
    },

    async fetchUserRole() {
      try {
        const res = await getMyGroupLevel({group_id: this.group_id})
        this.currentUserRole = this.mapRole(res.role_level)
      } catch (error) {
        ElMessage.error('获取权限失败')
      }
    },

    mapRole(level) {
      return {
        3: '组长',
        2: '管理员',
        1: '组员'
      }[level] || '组员'
    },

    async initData() {
      await this.fetchGroupInfo()
      await this.fetchMembers()
      await this.fetchUserRole()
    },

  }
}
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,500&family=Poppins:wght@500&display=swap');

.member-name {
  /* 字体设置 */
  font-family: 'Poppins', monospace;

  /* 尺寸系统 */
  max-width: 6.2ch; /* 留出省略号空间 */
  font-size: 12px !important; /* 基准尺寸 */
  font-weight: 500 !important;
  letter-spacing: 0.03em !important;
  line-height: 1.4 !important;
  text-overflow: ellipsis;
  white-space: nowrap;


  /* 文字效果 */
  text-shadow: 0.5px 0.5px 0.5px rgba(0, 0, 0, 0.05),
  1px 1px 1px rgba(0, 0, 0, 0.03);

  width: 6ch; /* 强制6字符宽度 */

  /* 完全移除Tailwind影响 */
  all: initial; /* 关键属性：重置继承样式 */
  display: block; /* 重置后需要重新定义显示方式 */
  unicode-bidi: isolate;
}


.role-badge {
  font-size: 0.65rem; /* 约10px */
  color: #6b7280; /* 中性灰色 */
  background-color: rgba(243, 244, 246, 0.6) !important;
}

/* 暗黑模式适配 */
.dark .member-name {
  color: #f3f4f6 !important;
}

.dark .role-badge {
  color: #9ca3af !important;
  background-color: rgba(31, 41, 55, 0.3) !important;
}

.role-badge[data-role="组长"] {
  background-color: rgba(255, 228, 230, 0.9) !important; /* 浅珊瑚色 */
  color: #ff5b71 !important;
}

.role-badge[data-role="管理员"] {
  background-color: rgba(228, 240, 255, 0.9) !important; /* 浅天蓝色 */
  color: #5b8cff !important;
}

.role-badge[data-role="组员"] {
  background-color: rgba(242, 242, 242, 0.9) !important; /* 浅灰色 */
  color: #7a7a7a !important;
}

@media (min-width: 1024px) {
  .member-name {
    font-size: 0.95rem !important; /* 15.2px */
    letter-spacing: 0.025em !important;
  }
}

@media (max-width: 640px) {
  .member-name {
    font-size: 0.875rem !important; /* 14px */
    letter-spacing: 0.02em !important;
  }
}

.fixed {
  position: fixed;
}

.min-w-\[160px\] {
  min-width: 160px;
}

.z-50 {
  z-index: 50;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

.dark .shadow-xl {
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.25), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.hover\:bg-gray-100:hover {
  background-color: #f3f4f6;
}

.dark .hover\:bg-gray-700:hover {
  background-color: #374151;
}

.cursor-pointer {
  cursor: pointer;
}

.text-red-600 {
  color: #dc2626;
}


.dark .hover\:bg-red-900\/20:hover {
  background-color: rgba(127, 29, 29, 0.2);
}

/* 移除所有元素的默认outline */
*:focus {
  outline: none !important;
  box-shadow: none !important;
}

/* 邀请码显示区域样式 */
.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  letter-spacing: 0.05em;
}

.el-message {
  z-index: 99999 !important; /* 必须足够高 */
}


@media (max-width: 1024px) {
  .nav-info-area {
    display: none;
  }
}

.main-header {
  height: 20%;
  border-bottom: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  padding: 0 !important;
  overflow: hidden; /* 隐藏溢出内容 */
}

.header-content {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  padding: 0 !important; /* 移除原有padding */
  margin-left: -12px !important;
  margin-right: -12px !important;
}

.organization-info {
  font-size: 18px !important; /* 原16px */
  font-weight: 700 !important;
  display: flex;
  align-items: center;
  height: 100%;
  gap: 12px;
  min-width: 0; /* 添加最小宽度约束 */
}

.organization-logo {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.organization-meta {
  flex: 1;
  min-width: 0; /* 允许内容收缩 */
  overflow: hidden; /* 防止内容溢出 */
}

.organization-name {
  margin: 0;
  font-size: 30px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.organization-details {
  margin-top: 4px;
}

.description {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta-items {
  display: flex;
  gap: 16px;
  margin-top: 4px;
}


.right-actions {
  display: flex;
  justify-content: flex-end;
  padding-right: 0 !important;
  /* 移除 margin-right: -100px */
}


/* 调整左侧信息容器间距 */
.left-info {
  padding-left: 0 !important;
}

.left-info,
.right-actions {
  padding: 0 12px !important; /* 统一列间距 */
}

.action-group {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.invite-button {
  padding: 7px 14px;
  border-radius: 6px;
  white-space: nowrap;
  margin-right: 12px; /* 增加按钮右侧间距 */
}

.user-profile {
  max-width: 180px;
  min-width: 0;
}

.profile-content {
  display: flex;
  align-items: center;
  padding: 4px;
  gap: 8px;
}

.username {
  font-size: 15px;
  color: var(--el-text-color-regular);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .header-content {
    padding: 0px;
  }

  .organization-info {
    gap: 8px;
  }

  .meta-items {
    gap: 12px;
  }

  .invite-button {
    padding: 6px 12px;
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .organization-name {
    font-size: 14px;
  }

  .description {
    display: none;
  }

  .meta-items {
    flex-direction: column;
    gap: 2px;
    margin-top: 2px;
  }
}

.organization-name .el-icon {
  font-size: 0.8em;
  vertical-align: middle;
  transition: color 0.2s ease;
}

.message-badge {
  @apply mr-3 inline-flex items-center justify-center;
  /* 改为行内弹性布局 */
  position: relative; /* 确保定位上下文 */
}

.message-badge .el-badge__content {
  /* 定位微调 */
  top: -4px !important;
  right: -6px !important;
  transform: translate(30%, -30%);

  /* 尺寸优化 */
  height: 18px;
  min-width: 18px;
  padding: 0 4px;

  /* 文字样式 */
  font-size: 11px;
  font-weight: 500;
  line-height: 16px;

  /* 视觉简化 */
  background: #ff4d4f;
  border: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  /* 交互优化 */
  pointer-events: none;
  z-index: 10;
}


.message-button {
  @apply !p-2 !rounded-lg transition-all;
  border: 1px solid var(--el-border-color);
}

.message-icon {
  @apply text-xl text-gray-600 dark:text-gray-300 transition-transform;
}

.message-button:hover {
  @apply bg-gray-100 dark:bg-gray-600;
  transform: scale(1.05);
}

/* 消息弹窗样式 */
.message-dialog {
  .el-dialog__body {
    @apply pt-4 pb-6;
  }
}

.message-item {
  border: 1px solid var(--el-border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    border-color: var(--el-color-primary);
  }
}
</style>