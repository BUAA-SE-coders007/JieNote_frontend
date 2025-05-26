<template>
  <div class="flex flex-col h-screen">
    <!-- 顶部导航栏 -->
    <nav class="relative flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-emerald-500">
      <div class="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div class="w-full relative flex justify-between lg:w-auto px-4 lg:static lg:block lg:justify-start">
          <a class="text-lg font-bold leading-relaxed inline-block mr-4 py-2 whitespace-no-wrap uppercase text-white" href="#pablo">
            组织协作
          </a>
        </div>
        <div class="lg:flex flex-grow items-center">
          <ul class="flex flex-col lg:flex-row list-none ml-auto">
            <li class="nav-item">
              <a class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                 href="javascript:;"
                 @click="showCreateOrgDialog = true">
                <i class="fas fa-plus text-lg leading-lg text-white opacity-75"></i>
                <span class="ml-2">新建组织</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                 href="javascript:;">
                <i class="fas fa-user text-lg leading-lg text-white opacity-75"></i>
                <span class="ml-2">用户</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="flex-1 overflow-y-auto bg-gray-100">
      <div class="container-fluid px-4 py-4">
        <div class="flex">
          <!-- 侧边栏 -->
          <aside class="w-[400px] flex-shrink-0 flex-grow-0 bg-white rounded-lg shadow mr-4">
            <div class="p-4">
              <div class="org-sidebar-header">
                <span class="text-lg font-bold text-gray-800">我的组织 - 组织管理</span>
              </div>
              <div class="org-sidebar-list">
                <div v-if="filteredJoinedOrgs.length === 0 && filteredCreatedOrgs.length === 0" class="text-gray-500 text-center py-4">暂无组织</div>
                <div v-else>
                  <div v-if="filteredJoinedOrgs.length > 0" class="mt-4">
                    <div class="text-sm font-medium text-gray-600 mb-2">加入的组织</div>
                    <ul>
                      <li v-for="org in filteredJoinedOrgs" :key="org.id" @click="selectOrg(org)" 
                          :class="['flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50', 
                                  selectedOrg && selectedOrg.id === org.id ? 'bg-emerald-50' : '']">
                        <img :src="getAvatarUrl(org.avatar)" class="w-10 h-10 rounded-full mr-3" />
                        <div class="min-w-[200px]">
                          <div class="font-medium text-gray-900">{{ org.name }}</div>
                          <div class="text-sm text-gray-500">成员数：{{ org.members }}</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div v-if="filteredCreatedOrgs.length > 0" class="mt-4">
                    <div class="text-sm font-medium text-gray-600 mb-2">我创建的组织</div>
                    <ul>
                      <li v-for="org in filteredCreatedOrgs" :key="org.id" @click="selectOrg(org)"
                          :class="['flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50',
                                  selectedOrg && selectedOrg.id === org.id ? 'bg-emerald-50' : '']">
                        <img :src="getAvatarUrl(org.avatar)" class="w-10 h-10 rounded-full mr-3" />
                        <div class="min-w-[200px]">
                          <div class="font-medium text-gray-900">{{ org.name }}</div>
                          <div class="text-sm text-gray-500">成员数：{{ org.members }}</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <!-- 主内容区 -->
          <main class="flex-1 bg-white rounded-lg shadow p-4">
            <div v-if="selectedOrg">
              <div class="flex items-start mb-8">
                <img :src="getAvatarUrl(selectedOrg.avatar)" class="w-24 h-24 rounded-full mr-8 border-4 border-emerald-100" style="width: 100px;margin-right: 20px;height: 100px;" />
                <div class="flex-1 pt-2">
                  <h2 class="text-2xl font-bold text-gray-900 mb-3">{{ selectedOrg.name }}</h2>
                  <p class="text-gray-600 mb-3 text-base">{{ selectedOrg.intro || '这个组织还没有简介。' }}</p>
                  <div class="flex items-center space-x-6">
                    <span class="text-gray-500">
                      <i class="fas fa-users mr-2"></i>
                      成员数：{{ selectedOrg.members }}
                    </span>
                    <span class="text-gray-500">
                      <i class="fas fa-user-tag mr-2"></i>
                      身份：{{ selectedOrg.role === 'leader' ? '创建者' : selectedOrg.role === 'admin' ? '管理员' : '成员' }}
                    </span>
                  </div>
                </div>
              </div>

              <el-tabs v-model="orgTab" class="org-tabs">
                <el-tab-pane label="概览" name="overview">
                  <div class="mt-4">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">成员列表</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div v-for="member in selectedOrg.membersList" :key="member.id" 
                           class="flex items-center p-3 bg-gray-50 rounded-lg">
                        <img :src="getAvatarUrl(member.avatar)" class="w-10 h-10 rounded-full mr-3" />
                        <span class="font-medium text-gray-900">{{ member.name }}</span>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="日志" name="logs">
                  <div class="mt-4">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">活动日志</h3>
                    <ul class="space-y-2">
                      <li v-for="log in mockLogs" :key="log.id" 
                          class="p-3 bg-gray-50 rounded-lg text-gray-600">
                        {{ log.time }} - {{ log.content }}
                      </li>
                    </ul>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
            <div v-else class="text-center text-gray-500 py-8">
              请选择左侧组织查看详情
            </div>
          </main>
        </div>
      </div>
    </div>

    <!-- 新建组织弹窗 -->
    <el-dialog v-model="showCreateOrgDialog" title="新建组织" width="400px">
      <el-form :model="newOrgForm" label-width="80px">
        <el-form-item label="组织头像">
          <el-upload
            class="avatar-uploader"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleAvatarChange"
            accept="image/jpeg,image/png">
            <img v-if="newOrgForm.avatar" :src="newOrgForm.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="组织名称">
          <el-input v-model="newOrgForm.name" maxlength="20" show-word-limit placeholder="请输入组织名称" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="newOrgForm.intro" type="textarea" maxlength="100" show-word-limit placeholder="请输入简介" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateOrgDialog = false">取消</el-button>
        <el-button type="primary" @click="createOrg">创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import * as tables from '@/api/tables';
import { Plus } from '@element-plus/icons-vue'

export default {
  name: 'OrganizationPage',
  components: {
    Plus
  },
  data() {
    return {
      searchText: '',
      showCreateOrgDialog: false,
      newOrgForm: { 
        name: '', 
        intro: '', 
        avatar: '',
        avatarFile: null
      },
      uploadUrl: 'http://43.143.228.56:8000/user/upload',
      uploadHeaders: {
        'Authorization': localStorage.getItem('token') || ''
      },
      selectedOrg: null,
      orgTab: 'overview',
      joinedOrgs: [],
      createdOrgs: [],
      messages: [
        { id: 201, username: 'Alice', userAvatar: 'https://randomuser.me/api/portraits/women/1.jpg', orgName: 'MyAwesomeOrg', time: '2分钟前' },
        { id: 202, username: 'Bob', userAvatar: 'https://randomuser.me/api/portraits/men/2.jpg', orgName: 'OpenSourceDream', time: '5分钟前' },
      ],
      mockLogs: [
        { id: 1, time: '2024-06-01', content: 'Alice 加入了组织' },
        { id: 2, time: '2024-06-02', content: 'Bob 被提升为管理员' },
      ]
    }
  },
  computed: {
    filteredJoinedOrgs() {
      return this.joinedOrgs;
    },
    filteredCreatedOrgs() {
      return this.createdOrgs;
    },
    isCreatedOrg() {
      return this.createdOrgs.some(org => org.id === (this.selectedOrg && this.selectedOrg.id));
    }
  },
  methods: {
    async selectOrg(org) {
      this.selectedOrg = org;
      this.orgTab = 'overview';
    },

    getAvatarUrl(avatar) {
      return `https://jienote.top/${avatar}`;
      //console.log(avatar)
      //return 'http://43.143.228.56:8000/images/default.png';
      //return avatar;
    },

    handleAvatarChange(file) {
      if (file) {
        this.newOrgForm.avatarFile = file.raw;
        this.newOrgForm.avatar = URL.createObjectURL(file.raw);
      }
    },

    async createOrg() {
      if (!this.newOrgForm.name) return;
      
      const formData = new FormData();
      formData.append('group_name', this.newOrgForm.name);
      formData.append('group_desc', this.newOrgForm.intro);
      if (this.newOrgForm.avatarFile) {
        formData.append('group_avatar', this.newOrgForm.avatarFile);
      }

      try {
        const res = await tables.createOrg(formData);
        this.createdOrgs.push({
          id: res.group_id,
          name: this.newOrgForm.name,
          avatar: this.newOrgForm.avatar || 'http://43.143.228.56:8000/images/default.png',
          members: 1,
          intro: this.newOrgForm.intro,
          membersList: [],
          role: 'leader'
        });
        this.showCreateOrgDialog = false;
        this.newOrgForm = { name: '', intro: '', avatar: '', avatarFile: null };
      } catch (error) {
        this.$message.error('创建组织失败');
        console.error('Failed to create organization:', error);
      }
    },

    processOrgData(data) {
      this.createdOrgs = data.leader.map(org => ({
        id: org.group_id,
        name: org.group_name,
        avatar: org.group_avatar,
        intro: org.group_desc,
        members: 0,
        membersList: [],
        role: 'leader'
      }));

      const adminOrgs = data.admin.map(org => ({
        id: org.group_id,
        name: org.group_name,
        avatar: org.group_avatar,
        intro: org.group_desc,
        members: 0,
        membersList: [],
        role: 'admin'
      }));

      const memberOrgs = data.member.map(org => ({
        id: org.group_id,
        name: org.group_name,
        avatar: org.group_avatar,
        intro: org.group_desc,
        members: 0,
        membersList: [],
        role: 'member'
      }));

      this.joinedOrgs = [...adminOrgs, ...memberOrgs];
    }
  },
  async mounted() {
    try {
      const response = await tables.getAllOrgs();
      console.log(response)
      if (response.status !== 200) {
        this.$message({
          message: response.message,
          type: 'error',
          duration: 3000
        })
        console.error('Failed to fetch organizations:', response.message);
        return;
      }
      console.log(response.data);
      console.log('获取所有组织成功')
      this.processOrgData(response.data);

      // 获取所有组织的成员信息
      const allOrgs = [...this.createdOrgs, ...this.joinedOrgs];
      for (const org of allOrgs) {
        try {
          const memberResponse = await tables.getOrgMembers(org.id);
          if (memberResponse.status === 200) {
            org.membersList = [
              memberResponse.data.leader,
              ...memberResponse.data.admins,
              ...memberResponse.data.members
            ];
            org.members = org.membersList.length;
          }
        } catch (error) {
          console.error(`Failed to fetch members for org ${org.id}:`, error);
        }
      }
      
      if (!this.selectedOrg) {
        if (this.joinedOrgs.length > 0) {
          this.selectOrg(this.joinedOrgs[0]);
        } else if (this.createdOrgs.length > 0) {
          this.selectOrg(this.createdOrgs[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
    }
  }
}
</script>

<style scoped>
:root {
  --org-bg: #f6f8fa;
  --org-card-bg: #fff;
  --org-border: #e1e4e8;
  --org-radius: 8px;
  --org-shadow: 0 1.5px 6px 0 rgba(27,31,35,0.04);
  --org-primary: #2da44e;
  --org-primary-hover: #218838;
  --org-text-main: #24292f;
  --org-text-sub: #57606a;
  --org-sidebar-width: 300px;
  --org-sidebar-bg: #e3f2fd;
  --org-content-bg: #ffffff;
  --org-sidebar-border: #9ca3af;
  --org-navbar-bg: #e8eaf6;
}
.org-page {
  min-height: 100vh;
  background: var(--org-bg);
  display: flex;
  flex-direction: column;
}
.org-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 64px;
  background: var(--org-navbar-bg) !important;
  border-bottom: 1px solid var(--org-border);
  box-shadow: var(--org-shadow);
  z-index: 10;
}
.org-navbar-title {
  font-size: 2rem;
  font-weight: bold;
  color: var(--org-primary);
  letter-spacing: 2px;
}
.org-navbar-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}
.org-main {
  display: flex;
  flex: 1;
  min-height: 0;
  background: var(--org-bg);
}
.org-sidebar {
  width: var(--org-sidebar-width);
  background: var(--org-sidebar-bg) !important;
  border-right: 3px solid var(--org-sidebar-border);
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  height: 100%;
}
.org-sidebar-header {
  padding: 0 24px 12px 24px;
}
.org-sidebar-title {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--org-text-main);
  margin-bottom: 10px;
  line-height: 1.2;
}
.org-sidebar-list {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 16px;
}
.org-sidebar-group {
  margin-bottom: 16px;
}
.org-sidebar-group-title {
  font-size: 0.9rem;
  color: var(--org-text-sub);
  margin: 8px 24px 4px 24px;
}
.org-sidebar-item {
  display: flex;
  align-items: center;
  padding: 10px 24px;
  border-radius: var(--org-radius);
  cursor: pointer;
  transition: background 0.2s;
  margin: 2px 12px;
}
.org-sidebar-item.active {
  background: #e6f1fa;
}
.org-sidebar-item.active-created {
  background: #eafbe7;
}
.org-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid var(--org-border);
  margin-right: 12px;
}
.org-info {
  flex: 1;
}
.org-name {
  font-weight: 500;
  color: var(--org-text-main);
}
.org-role {
  font-size: 0.85rem;
  color: var(--org-text-sub);
}
.org-content {
  flex: 1;
  padding: 32px 40px 32px 40px;
  overflow-y: auto;
  background: var(--org-content-bg) !important;
  min-width: 0;
  height: 100%;
}
.org-detail-card {
  background: var(--org-card-bg);
  border-radius: var(--org-radius);
  box-shadow: var(--org-shadow);
  padding: 32px;
  margin-bottom: 32px;
}
.org-detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}
.org-detail-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #b6e3b6;
  margin-right: 32px;
}
.org-detail-meta {
  flex: 1;
}
.org-detail-title {
  font-size: 1.7rem;
  font-weight: bold;
  color: var(--org-text-main);
}
.org-detail-desc {
  color: var(--org-text-sub);
  margin: 8px 0 8px 0;
}
.org-detail-role {
  font-size: 0.95rem;
  color: var(--org-text-sub);
}
.org-detail-actions {
  margin-top: 12px;
}
.org-tabs {
  margin-top: 16px;
}
.org-section {
  margin-bottom: 24px;
}
.org-section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--org-text-main);
  margin-bottom: 12px;
}
.org-members-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.org-member-card {
  display: flex;
  align-items: center;
  background: #f6f8fa;
  border-radius: var(--org-radius);
  box-shadow: 0 1px 3px 0 rgba(27,31,35,0.03);
  padding: 8px 16px;
}
.org-member-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}
.org-member-name {
  font-size: 1rem;
  color: var(--org-text-main);
}
.org-repos-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.org-repo-card {
  background: #f6f8fa;
  border-radius: var(--org-radius);
  box-shadow: 0 1px 3px 0 rgba(27,31,35,0.03);
  padding: 12px 20px;
  min-width: 220px;
}
.org-repo-name {
  font-weight: 500;
  color: var(--org-text-main);
}
.org-repo-desc {
  font-size: 0.95rem;
  color: var(--org-text-sub);
}
.org-log-list {
  padding-left: 16px;
}
.org-log-item {
  color: var(--org-text-sub);
  margin-bottom: 6px;
}
.org-empty {
  color: #b1b5bb;
  text-align: center;
  padding: 32px 0;
  font-size: 1.1rem;
}
.org-empty-main {
  color: #b1b5bb;
  text-align: center;
  font-size: 1.3rem;
  margin: 80px 0;
}
@media (max-width: 900px) {
  .org-main {
    flex-direction: column;
  }
  .org-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--org-border);
    padding-bottom: 0;
  }
  .org-content {
    padding: 16px 8px;
  }
}
::-webkit-scrollbar { width: 8px; background: #f1f5f9; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.org-message-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.org-message-item {
  display: flex;
  align-items: center;
  background: #f6f8fa;
  border-radius: var(--org-radius);
  box-shadow: 0 1px 3px 0 rgba(27,31,35,0.03);
  padding: 10px 18px;
  min-width: 520px;
  max-width: 100%;
}
.org-message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 12px;
}
.org-message-info {
  flex: 1;
}
.org-message-user {
  font-size: 1rem;
  color: var(--org-text-main);
}
.org-message-org {
  color: var(--org-primary);
  font-weight: 500;
}
.org-message-time {
  font-size: 0.85rem;
  color: var(--org-text-sub);
}
.org-navbar-create-btn {
  background: #eaecef;
  border: none;
  color: #2186eb !important;
  font-size: 26px !important;
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  outline: none;
  box-shadow: none;
  padding: 0;
  font-weight: bold;
}
.org-navbar-create-btn:hover {
  background: #d0e6fa;
  color: #0969da !important;
  box-shadow: 0 2px 8px 0 rgba(33,134,235,0.13);
}
.avatar-uploader {
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}
</style>