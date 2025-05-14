<template>
  <div class="org-page">
    <!-- 顶部导航栏 -->
    <nav class="org-navbar">
      <div class="org-navbar-title">组织协作</div>
      <div class="org-navbar-actions">
        <notification-dropdown @click.native="showMessageDialog = true" />
        <user-dropdown />
      </div>
    </nav>
    <div class="org-main">
      <!-- 侧边栏 -->
      <aside class="org-sidebar">
        <div class="org-sidebar-header">
          <span class="org-sidebar-title">我的组织</span>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="showCreateOrgDialog = true">新建</el-button>
        </div>
        <el-input placeholder="筛选组织" size="small" v-model="orgFilter" class="org-sidebar-filter" />
        <div class="org-sidebar-list">
          <div v-if="filteredJoinedOrgs.length === 0 && filteredCreatedOrgs.length === 0" class="org-empty">暂无组织</div>
          <div v-else>
            <div v-if="filteredJoinedOrgs.length > 0" class="org-sidebar-group">
              <div class="org-sidebar-group-title">加入的组织</div>
              <ul>
                <li v-for="org in filteredJoinedOrgs" :key="org.id" @click="selectOrg(org)" :class="['org-sidebar-item', selectedOrg && selectedOrg.id === org.id ? 'active' : '']">
                  <img :src="org.avatar" class="org-avatar" />
                  <div class="org-info">
                    <div class="org-name">{{ org.name }}</div>
                    <div v-if="org.members" class="org-role">成员数：{{ org.members }}</div>
                  </div>
                </li>
              </ul>
            </div>
            <div v-if="filteredCreatedOrgs.length > 0" class="org-sidebar-group">
              <div class="org-sidebar-group-title">我创建的组织</div>
              <ul>
                <li v-for="org in filteredCreatedOrgs" :key="org.id" @click="selectOrg(org)" :class="['org-sidebar-item', selectedOrg && selectedOrg.id === org.id ? 'active-created' : '']">
                  <img :src="org.avatar" class="org-avatar" />
                  <div class="org-info">
                    <div class="org-name">{{ org.name }}</div>
                    <div class="org-role">成员数：{{ org.members }}</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </aside>
      <!-- 主内容区 -->
      <main class="org-content">
        <div v-if="selectedOrg">
          <div class="org-detail-card">
            <div class="org-detail-header">
              <img :src="selectedOrg.avatar" class="org-detail-avatar" />
              <div class="org-detail-meta">
                <div class="org-detail-title">{{ selectedOrg.name }}</div>
                <div class="org-detail-desc">{{ selectedOrg.intro || '这个组织还没有简介。' }}</div>
                <div class="org-detail-role">{{ selectedOrg.role ? '身份：' + selectedOrg.role : '成员数：' + selectedOrg.members }}</div>
                <div class="org-detail-actions">
                  <el-button v-if="isCreatedOrg" type="primary" size="small" icon="el-icon-setting">组织管理</el-button>
                  <el-button v-else type="danger" size="small" icon="el-icon-close">退出组织</el-button>
                </div>
              </div>
            </div>
            <el-tabs v-model="orgTab" class="org-tabs">
              <el-tab-pane label="概览" name="overview">
                <div class="org-section">
                  <div class="org-section-title">成员列表</div>
                  <div class="org-members-list">
                    <div v-for="member in selectedOrg.membersList" :key="member.id" class="org-member-card">
                      <img :src="member.avatar" class="org-member-avatar" />
                      <span class="org-member-name">{{ member.name }}</span>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="仓库" name="repos">
                <div class="org-section">
                  <div class="org-section-title">组织仓库（模拟）</div>
                  <div class="org-repos-list">
                    <div v-for="repo in mockRepos" :key="repo.id" class="org-repo-card">
                      <div class="org-repo-name">{{ repo.name }}</div>
                      <div class="org-repo-desc">{{ repo.desc }}</div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="日志" name="logs">
                <div class="org-section">
                  <div class="org-section-title">活动日志（模拟）</div>
                  <ul class="org-log-list">
                    <li v-for="log in mockLogs" :key="log.id" class="org-log-item">{{ log.time }} - {{ log.content }}</li>
                  </ul>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div v-else class="org-empty-main">请选择左侧组织查看详情</div>
      </main>
    </div>
    <!-- 新建组织弹窗 -->
    <el-dialog v-model="showCreateOrgDialog" title="新建组织" width="400px">
      <el-form :model="newOrgForm" label-width="80px">
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
    <el-dialog v-model="showMessageDialog" title="消息通知" width="600px">
      <div v-if="messages.length === 0" class="org-empty">暂无新消息</div>
      <div v-else class="org-message-list">
        <div v-for="msg in messages" :key="msg.id" class="org-message-item">
          <img :src="msg.userAvatar" class="org-message-avatar" alt="user avatar" />
          <div class="org-message-info">
            <div class="org-message-user">{{ msg.username }} 请求加入 <span class="org-message-org">{{ msg.orgName }}</span></div>
            <div class="org-message-time">{{ msg.time }}</div>
          </div>
          <el-button type="success" size="mini" class="ml-2">同意</el-button>
          <el-button type="danger" size="mini" class="ml-2">拒绝</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import NotificationDropdown from '@/components/Dropdowns/NotificationDropdown.vue';
import UserDropdown from '@/components/Dropdowns/UserDropdown.vue';

export default {
  name: 'OrganizationPage',
  components: { NotificationDropdown, UserDropdown },
  data() {
    return {
      searchText: '',
      orgFilter: '',
      showCreateOrgDialog: false,
      newOrgForm: { name: '', intro: '' },
      selectedOrg: null,
      orgTab: 'overview',
      joinedOrgs: [
        { id: 1, name: 'AndroidDevTeam-2024', avatar: 'https://avatars.githubusercontent.com/u/12345678?v=4', role: '成员', intro: '专注于Android开发的技术团队', membersList: [
          { id: 1, name: 'Alice', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', role: '成员' },
          { id: 2, name: 'Bob', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', role: '成员' },
        ] },
        { id: 2, name: 'BUAA-SE-coders007', avatar: 'https://avatars.githubusercontent.com/u/87654321?v=4', role: '管理员', intro: '北航软件工程协作组', membersList: [
          { id: 3, name: 'Charlie', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', role: '管理员' },
          { id: 4, name: 'Diana', avatar: 'https://randomuser.me/api/portraits/women/4.jpg', role: '成员' },
        ] },
        { id: 3, name: 'DB-web-project', avatar: 'https://avatars.githubusercontent.com/u/11223344?v=4', role: '成员', intro: '数据库Web项目组', membersList: [
          { id: 5, name: 'Eve', avatar: 'https://randomuser.me/api/portraits/women/5.jpg', role: '成员' },
        ] },
      ],
      createdOrgs: [
        { id: 101, name: 'MyAwesomeOrg', avatar: 'https://avatars.githubusercontent.com/u/99887766?v=4', members: 12, intro: '我的第一个组织', membersList: [
          { id: 6, name: 'You', avatar: 'https://randomuser.me/api/portraits/men/6.jpg', role: '成员' },
          { id: 7, name: 'Frank', avatar: 'https://randomuser.me/api/portraits/men/7.jpg', role: '成员' },
        ] },
        { id: 102, name: 'OpenSourceDream', avatar: 'https://avatars.githubusercontent.com/u/88776655?v=4', members: 7, intro: '开源梦想家', membersList: [
          { id: 8, name: 'Grace', avatar: 'https://randomuser.me/api/portraits/women/8.jpg', role: '成员' },
        ] },
      ],
      messages: [
        { id: 201, username: 'Alice', userAvatar: 'https://randomuser.me/api/portraits/women/1.jpg', orgName: 'MyAwesomeOrg', time: '2分钟前' },
        { id: 202, username: 'Bob', userAvatar: 'https://randomuser.me/api/portraits/men/2.jpg', orgName: 'OpenSourceDream', time: '5分钟前' },
      ],
      mockRepos: [
        { id: 1, name: 'org-website', desc: '组织官网项目' },
        { id: 2, name: 'org-docs', desc: '组织文档仓库' },
      ],
      mockLogs: [
        { id: 1, time: '2024-06-01', content: 'Alice 加入了组织' },
        { id: 2, time: '2024-06-02', content: 'Bob 被提升为管理员' },
      ],
      showMessageDialog: false
    }
  },
  computed: {
    filteredJoinedOrgs() {
      if (!this.orgFilter) return this.joinedOrgs;
      return this.joinedOrgs.filter(org => org.name.includes(this.orgFilter));
    },
    filteredCreatedOrgs() {
      if (!this.orgFilter) return this.createdOrgs;
      return this.createdOrgs.filter(org => org.name.includes(this.orgFilter));
    },
    isCreatedOrg() {
      return this.createdOrgs.some(org => org.id === (this.selectedOrg && this.selectedOrg.id));
    }
  },
  methods: {
    selectOrg(org) {
      this.selectedOrg = org;
      this.orgTab = 'overview';
    },
    createOrg() {
      if (!this.newOrgForm.name) return;
      const newOrg = {
        id: Date.now(),
        name: this.newOrgForm.name,
        avatar: 'https://avatars.githubusercontent.com/u/99887766?v=4',
        members: 1,
        intro: this.newOrgForm.intro,
        membersList: [
          { id: 999, name: 'You', avatar: 'https://randomuser.me/api/portraits/men/6.jpg', role: '成员' }
        ]
      };
      this.createdOrgs.push(newOrg);
      this.showCreateOrgDialog = false;
      this.newOrgForm = { name: '', intro: '' };
    }
  },
  mounted() {
    // 页面加载时自动选中第一个组织
    if (!this.selectedOrg) {
      if (this.joinedOrgs.length > 0) {
        this.selectOrg(this.joinedOrgs[0]);
      } else if (this.createdOrgs.length > 0) {
        this.selectOrg(this.createdOrgs[0]);
      }
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
  background: var(--org-card-bg);
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
  gap: 24px;
}
.org-main {
  display: flex;
  flex: 1;
  min-height: 0;
}
.org-sidebar {
  width: var(--org-sidebar-width);
  background: var(--org-card-bg);
  border-right: 1px solid var(--org-border);
  display: flex;
  flex-direction: column;
  padding-top: 16px;
}
.org-sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px 8px 24px;
}
.org-sidebar-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--org-text-main);
}
.org-sidebar-filter {
  margin: 0 24px 8px 24px;
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
  background: var(--org-bg);
  min-width: 0;
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
</style>