<template>
  <div>
  <div
      v-if="isLoading"
      v-loading="true"
      element-loading-text="加载组织页面中..."
      element-loading-background="rgba(255, 255, 255, 1)"
      style="height: 100vh; width: 100vw; position: fixed; top: 0; left: 0; z-index: 9999;"
  ></div>
    <div v-show="!isLoading" class="min-h-screen bg-gray-50 dark:bg-gray-900">
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
                style="width: 100px; height: 100px; border-radius: 50%;"> <!-- 替换原Tailwind尺寸 -->
            </el-image>
            <div class="organization-meta">
              <h1 class="organization-name">{{ organizationName }}
                <el-icon
                    v-if="showEditButton"
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
        <simple-tree :user-role="currentUserRole" :group_id="group_id"/>
      </div>

      <!-- 修改后的成员列表侧边栏 -->
      <div
          class="w-96 h-[calc(100vh-140px)] bg-white rounded-xl shadow-lg dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
        <div class="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-center items-center">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">👥 组织成员</h2>
            <el-tooltip v-if="showMessageBox" effect="dark" content="右键点击成员可管理成员状态" placement="top">
              <el-icon class="ml-1 cursor-help text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100">
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </div>
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
        title="邀请组织成员"
        width="500px"
        :close-on-click-modal="false"
        custom-class="dark:bg-gray-800"
        :append-to-body="true"
        @closed="resetInviteForm"
    >
      <div class="space-y-6">
        <!-- 新增邮箱输入区域 -->
        <div class="email-input-area">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            成员邮箱
          </label>
          <div class="flex gap-2">
            <el-input
                v-model="inviteEmail"
                placeholder="请输入成员邮箱"
                class="flex-1"
                @keyup.enter="generateInviteCode"
            />
            <el-button
                type="primary"
                :disabled="!inviteEmail"
                @click="generateInviteCode"
            >
              生成邀请码
            </el-button>
          </div>
          <p v-if="emailError" class="text-red-500 text-xs mt-1">{{ emailError }}</p>
        </div>

        <!-- 邀请码展示区域 -->
        <div v-if="inviteCode" class="invite-code-area">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            专属邀请码
          </label>
          <div class="relative group">
            <div class="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div class="flex-1 min-w-0 overflow-x-auto whitespace-nowrap scroll-container mr-2">
                <span class="font-mono text-gray-800 dark:text-gray-200">{{ inviteCode }}</span>
              </div>
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
        </div>

        <p class="text-sm text-gray-500 dark:text-gray-400">
          ✨ 将此邀请码发送给需要加入组织的成员，他们可以通过此码加入组织
        </p>
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
          注意：每个邀请码只24小时内有效，且与邮箱绑定
        </p>
      </div>
    </el-dialog>
      <el-dialog
          v-model="showMessageDialog"
          title="待处理的删除申请"
          width="680px"
          custom-class="message-dialog dark:bg-gray-800"
      >
        <div class="message-list space-y-3">
          <div
              v-for="message in messages"
              :key="message.id"
              class="message-item group relative p-4 bg-white dark:bg-gray-700 rounded-lg transition-all duration-300"
          >
            <div class="flex items-center">
              <!-- 申请者头像 -->
              <el-avatar :size="40" :src="message.avatar" class="mr-3" />

              <div class="flex-1 min-w-0">
                <div class="flex items-baseline gap-2 flex-wrap">
                <span class="user-name font-medium text-gray-800 dark:text-gray-200 truncate">
                  {{ message.user }}
                </span>
                  <span class="action-type text-sm text-blue-500 whitespace-nowrap">
                  申请删除
                </span>
                  <span class="item-type text-sm text-gray-600 dark:text-gray-300 capitalize">
                  {{ message.itemTypeText }}
                </span>
                </div>

                <!-- 显示具体项目名称 -->
                <div class="item-name text-gray-800 dark:text-gray-200 font-medium truncate mt-1">
                  {{ message.itemName }}
                </div>

                <!-- 显示完整路径 -->
                <div class="item-path text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                  路径: {{ message.itemPath }}
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="message-actions flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                <el-button
                    size="small"
                    type="success"
                    class="!px-3 !h-8 shadow-sm"
                    @click="handleApprove(message)"
                >✓ 同意</el-button>
                <el-button
                    size="small"
                    type="danger"
                    class="!px-3 !h-8 shadow-sm"
                    @click="handleReject(message)"
                >✕ 拒绝</el-button>
              </div>
            </div>
          </div>

          <div v-if="messages.length === 0" class="text-center py-8 text-gray-500">
            暂无待处理的删除申请
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
  </div>
</template>

<script>
import SimpleTree from '@/components/Tree/SimpleTree.vue'
import {ElMessageBox, ElMessage} from 'element-plus'
import {CirclePlus, DocumentCopy, Calendar, User, Edit, Message, QuestionFilled} from '@element-plus/icons-vue'
import {
  genGroupInviteCode,
  getGroupBasicInfo, getGroupPeopleInfo, getMyGroupLevel,
  leaveGroup,
  modifyAdminList,
  modifyGroupBasicInfo,
  removeGroupMember,
    dibandMyGroup
} from "@/api/someOrganization";
import {getUserProfile} from "@/api/profile";
import team2 from "@/assets/img/team-2-800x800.jpg";
import {
  getAllDeleteApplications,
  replyToDelete
} from "@/api/define";

export default {
  components: {
    SimpleTree,
    CirclePlus,
    DocumentCopy,
    Calendar,
    User,
    Edit,
    Message,
    QuestionFilled
  },
  created() {
    this.initData()
  },
  computed: {
    showMessageBox() {
      return ['组长', '管理员'].includes(this.currentUserRole)
    },
    unreadCount() {
      return this.messages.length;
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
      return ['组长', '管理员'].includes(this.currentUserRole)
    },
    sortedMembers() {
      const order = {'组长': 1, '管理员': 2, '组员': 3};
      return [...this.members].sort((a, b) => order[a.role] - order[b.role]);
    }
  },
  data() {
    return {
      isLoading: true, // 添加加载状态
      inviteEmail: '',
      emailError: '',
      group_id: localStorage.getItem('current_group_id') || 21,
      showMessageDialog: false,
      messages: [
        // {
        //   id: 1,
        //   user: '张三',
        //   action: '修改',
        //   fileName: '项目计划书.pdf',
        //   status: 'pending'
        // },
        // {
        //   id: 2,
        //   user: '李四',
        //   action: '上传',
        //   fileName: '设计稿.jpg',
        //   status: 'pending'
        // }
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
      inviteCode: '', // 实际应从接口获取
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
    async fetchUser() {
      try {
        const response = await getUserProfile();
        const userData = response.data;
        console.log(userData.avatar)
        this.userName = userData.username || `user_${userData.id}`
        this.userAvatar = (() => {
          if (!userData.avatar) {
            return team2;
          }
          if (userData.avatar.startsWith('http://') || userData.avatar.startsWith('https://')) {
            return userData.avatar; // 已经是完整 URL，直接使用
          }
          // 否则，拼接 IP 地址
          const path = userData.avatar.startsWith('/') ? userData.avatar.substring(1) : userData.avatar;
          return `https://jienote.top/${path}`;
        })()
        console.log('fetchUser name:', this.userName);
        console.log('fetchUser name:', this.userAvatar);
      } catch (error) {
        console.error("获取用户信息失败：", error);
      }
    },

    async fetchGroupInfo() {
      try {
        const res = await getGroupBasicInfo({
          group_id: this.group_id // 字符串转整数
        });
        console.log(res)
        this.organizationName = res.data.name;
        this.organizationDescription = res.data.desc;
        this.logoUrl = `https://jienote.top/${res.data.avatar}`;
      } catch (error) {
        console.error('获取组织信息失败:', error);
        ElMessage.error(`获取组织信息失败: ${error.response?.data?.message || error.message}`);
      }
    },

    async fetchDeleteApplications() {
      try {
        const response = await getAllDeleteApplications(this.group_id);
        const applications = response.data.applications || [];

        // 转换数据格式以适应前端显示
        this.messages = applications.map(app => {
          // 根据item_type确定项目类型和名称
          let itemTypeText, itemName, itemPath;
          switch (app.item_type) {
            case 1:
              itemTypeText = '文件夹';
              itemName = app.folder.split('/').pop() || '未命名文件夹';
              itemPath = app.folder;
              break;
            case 2:
              itemTypeText = '文章';
              itemName = app.article || '未命名文章';
              itemPath = app.folder ? `${app.folder}/${itemName}` : itemName;
              break;
            case 3:
              itemTypeText = '笔记';
              itemName = app.note || '未命名笔记';
              itemPath = app.folder ? `${app.folder}/${itemName}` : itemName;
              break;
            default:
              itemTypeText = '未知类型';
              itemName = '未知项目';
              itemPath = '';
          }

          return {
            id: `${app.item_type}_${app.item_id}`, // 使用组合ID确保唯一性
            user: app.applier_name,
            avatar: app.applier_avatar ? `https://jienote.top/${app.applier_avatar}` : team2,
            item_type: app.item_type,
            item_id: app.item_id,
            itemTypeText,
            itemName,
            itemPath
          };
        });
      } catch (error) {
        console.error('获取删除申请失败:', error);
        ElMessage.error('获取删除申请失败');
      }
    },

    async handleMessageClick() {
      this.showMessageDialog = true;
      await this.fetchDeleteApplications(); // 打开对话框时获取数据

      // 在下一个事件循环移除焦点
      this.$nextTick(() => {
        this.$refs.messageButtonRef?.$el?.blur();
        document.activeElement?.blur();
      });
    },
    async handleApprove(message) {
      try {
        await replyToDelete({
          item_type: message.item_type,
          item_id: message.item_id,
          agree: true
        });

        // 从列表中移除已处理的消息
        this.messages = this.messages.filter(m => m.id !== message.id);
        ElMessage.success('已同意删除');
      } catch (error) {
        console.error('处理同意操作失败:', error);
        ElMessage.error('处理操作失败');
      }
    },

    // 拒绝删除申请
    async handleReject(message) {
      try {
        await replyToDelete({
          item_type: message.item_type,
          item_id: message.item_id,
          agree: false
        });

        // 从列表中移除已处理的消息
        this.messages = this.messages.filter(m => m.id !== message.id);
        ElMessage.warning('已拒绝删除');
      } catch (error) {
        console.error('处理拒绝操作失败:', error);
        ElMessage.error('处理操作失败');
      }
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
        const params = {
          group_id: this.group_id,
          group_name: this.tempOrgInfo.name,
          group_desc: this.tempOrgInfo.description
        };

        const avatarFile = this.$refs.fileInput.files[0] || null;

        const response = await modifyGroupBasicInfo(params, avatarFile);
        const res = response.data;

        // 直接更新本地数据，不需要重新加载整个页面
        this.organizationName = res.name || this.tempOrgInfo.name;
        this.organizationDescription = res.desc || this.tempOrgInfo.description;

        this.showOrgEditDialog = false;
        ElMessage.success('组织信息已更新');

        // 如果有新头像，重新获取组织信息
        if (avatarFile) {
          this.isLoading = true;
          try {
            await this.fetchGroupInfo();
          } catch (error) {
            console.error('获取组织信息失败:', error);
          } finally {
            this.isLoading = false;
          }
        }

        // 移除这行：this.isLoading = true;
        // 移除这行：await this.initData()
      } catch (error) {
        console.error('更新失败:', error);
        ElMessage.error(`保存失败: ${error.response?.data?.message || '请稍后重试'}`);
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
        ElMessage.success('设置管理员成功')
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
        ElMessage.success('取消管理员成功')
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
        ElMessage.success('移除成员成功')
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
    async generateInviteCode() {
      // 邮箱格式验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.inviteEmail)) {
        this.emailError = '请输入有效的邮箱地址';
        return;
      }
      this.emailError = '';

      try {
        // 调用API生成邀请码
        const response = await genGroupInviteCode({
          group_id: this.group_id,
          user_email: this.inviteEmail
        });

        // 更新邀请码
        console.log(response)
        this.inviteCode = response.data.inviteCode;
        console.log(this.inviteCode)
        ElMessage.success('邀请码已生成');
      } catch (error) {
        ElMessage.error('生成邀请码失败: ' + (error.message || '请稍后再试'));
        console.error('生成邀请码错误:', error);
      }
    },

    // 复制邀请码（修改原copyCode方法）
    async copyCode() {
      if (!this.inviteCode) {
        ElMessage.warning('请先生成邀请码');
        return;
      }
      try {
        await navigator.clipboard.writeText(this.inviteCode);
        // 使用 Element UI 的提示组件
        ElMessage({
          type: 'success',
          message: '复制成功！邀请码已存入剪贴板',
          duration: 3000,
          customClass: 'dark:!bg-gray-700 dark:!text-gray-200'
        });
      } catch (err) {
        ElMessage({
          type: 'error',
          message: '复制失败，请手动选择文本复制',
          duration: 3000,
          customClass: 'dark:!bg-gray-700 dark:!text-gray-200'
        });
      }
    },

    resetInviteForm() {
      this.inviteEmail = '';
      this.emailError = '';
      this.inviteCode = '';
      this.copyFeedback = null;
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
        await dibandMyGroup({
          group_id: this.group_id,
        })
        this.members = []
        ElMessage.success('解散组织成功')
        this.$router.push('/collaboration')
      } catch (error) {
        ElMessage.error('解散组织失败')
      }
    },

    async leaveGroup() {
      try {
        await leaveGroup({group_id: this.group_id})
        // 跳转到组织选择页或其他处理
        ElMessage.success('退出组织成功')
        this.$router.push('/collaboration')
      } catch (error) {
        ElMessage.error('退出组织失败')
      }
    },
    async fetchMembers() {
      try {
        const response = await getGroupPeopleInfo({group_id: this.group_id})
        console.log(response)
        let res = response.data

        // 合并所有成员并分配角色
        const mergedMembers = [
          // 处理组长（单个对象）
          ...(res.leader ? [{
            id: res.leader.id,
            name: res.leader.name,
            avatar: `https://jienote.top/${res.leader.avatar}`,
            role: '组长'
          }] : []),

          // 处理管理员（数组）
          ...(res.admins || []).map(admin => ({
            id: admin.id,
            name: admin.name,
            avatar: `https://jienote.top/${admin.avatar}`,
            role: '管理员'
          })),

          // 处理普通成员（数组）
          ...(res.members || []).map(member => ({
            id: member.id,
            name: member.name,
            avatar: `https://jienote.top/${member.avatar}`,
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
        console.log(res)
        this.currentUserRole = this.mapRole(res.data.level)
      } catch (error) {
        ElMessage.error('获取权限失败')
      }
    },

    mapRole(level) {
      return {
        3: '组员',
        2: '管理员',
        1: '组长'
      }[level] || '组长'
    },

    async initData() {
      try {
        this.isLoading = true; // 开始加载
        await this.fetchUser();
        await this.fetchGroupInfo();
        await this.fetchMembers();
        await this.fetchUserRole();
        await this.fetchDeleteApplications();
        console.log('未读消息数:', this.unreadCount);
      } catch (error) {
        console.error('初始化数据失败:', error);
        ElMessage.error('加载组织数据失败');
      } finally {
        this.isLoading = false; // 无论成功失败都结束加载
      }
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
  height: 120px;
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
  gap: 20px;
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

.scroll-container {
  scrollbar-width: thin;
  scrollbar-color: #c5c5c5 #f0f0f0;
}

.scroll-container::-webkit-scrollbar {
  height: 6px;
}

.scroll-container::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 3px;
}

.scroll-container::-webkit-scrollbar-thumb {
  background-color: #c5c5c5;
  border-radius: 3px;
}

.dark .scroll-container::-webkit-scrollbar-track {
  background: #374151;
}

.dark .scroll-container::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}
</style>