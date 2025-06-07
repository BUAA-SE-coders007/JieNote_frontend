<template>
  <nav
    class="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6"
  >
    <div
      class="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto"
    >
      <!-- Toggler -->
      <button
        class="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
        type="button"
        @click="toggleCollapseShow('bg-white m-2 py-3 px-6')"
      >
        <i class="fas fa-bars"></i>
      </button>

      <!-- Brand -->
      <router-link
        class="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-base uppercase font-bold p-4 px-0"
        to="/admin"
      >
        JieNote
      </router-link>

      <!-- User (Mobile) -->
      <ul class="md:hidden items-center flex flex-wrap list-none">
        <li class="inline-block relative">
          <notification-dropdown />
        </li>
        <li class="inline-block relative">
          <user-dropdown />
        </li>
      </ul>

      <!-- Collapse -->
      <div
        class="md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded"
        :class="collapseShow"
      >
        <!-- Collapse header (mobile) -->
        <div
          class="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200"
        >
          <div class="flex flex-wrap">
            <div class="w-6/12">
              <router-link
                class="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-base uppercase font-bold p-4 px-0"
                to="/"
              >
                JieNote
              </router-link>
            </div>
            <div class="w-6/12 flex justify-end">
              <button
                type="button"
                class="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                @click="toggleCollapseShow('hidden')"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>

      <div class="mt-6 mb-4 flex justify-center">
        <div
          class="w-full flex items-center rounded px-3 py-2 cursor-pointer transition-all border"
          style="max-width: 400px; background: #f3f4f6; color: #2563eb; border: none;"  
          @click="showSearchDialog = true"
        >
          <span class="font-medium text-base flex items-center" style="color: #2563eb;">
            <!-- 直接用 Unicode 放大镜 -->
            <span style="font-size: 20px; margin-right: 8px;">🔍</span>
            搜索
          </span>
        </div>
      </div>

        <!-- Divider -->
        <hr class="my-4 md:min-w-full" />

        <!-- Navigation -->
        <ul class="md:flex-col md:min-w-full flex flex-col list-none">
          <li class="items-center" v-for="item in navItems" :key="item.to">
            <router-link :to="item.to" v-slot="{ href, navigate }">
              <a
                :href="href"
                @click="navigate"
                class="text-sm uppercase py-3 font-bold block"
                :class="[isItemActive(item) ? 'text-emerald-500 hover:text-emerald-600' : 'text-blueGray-700 hover:text-blueGray-500']"
              >
                <i
                  :class="[item.icon, 'mr-2 text-base', isActive ? 'opacity-75' : 'text-blueGray-300']"
                ></i>
                {{ item.label }}
              </a>
            </router-link>
          </li>
          <li class="items-center">
            <a
              href="#"
              @click.prevent="confirmLogout"
              class="text-sm uppercase py-3 font-bold block text-blueGray-700 hover:text-blueGray-500 cursor-pointer"
            >
              <i class="fas fa-sign-out-alt mr-2 text-base text-blueGray-300"></i>
              退出登录
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- 搜索弹窗 -->
    <el-dialog
      v-model="showSearchDialog"
      title="搜索"
      width="400px"
      :close-on-click-modal="false"
      custom-class="search-dialog"
    >
      <div>
        <el-input
          v-model="searchQuery"
          placeholder="请输入搜索内容"
          class="mb-4"
        >
          <template #prefix>
            <i class="el-icon-search"></i>
            <span class="ml-1 text-gray-500">🔍</span>
          </template>
        </el-input>
        <el-radio-group v-model="selectedOption" class="mb-4">
          <el-radio label="database">文献库中搜索</el-radio>
          <el-radio label="paper-library">文献管理中搜索</el-radio>
        </el-radio-group>
        <el-button
          type="primary"
          :disabled="!selectedOption || !searchQuery.trim()"
          @click="handleSearch"
          style="margin-left: 48px;" 
        >
          搜索
        </el-button>
      </div>
    </el-dialog>
    
    <!-- 机器人 -->
    <div
      class="robot-float"
      style="position: absolute; left: 50%; bottom: 24px; transform: translateX(-50%);"
      @click="showRobotDialog = true"
    >
      <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
        <!-- 阴影 -->
        <ellipse cx="70" cy="128" rx="36" ry="10" fill="#b3c6f7" opacity="0.5"/>
        <!-- 身体（修长） -->
        <rect x="55" y="80" width="30" height="38" rx="12" fill="#e0e0e0" stroke="#2563eb" stroke-width="2"/>
        <!-- 头部 -->
        <ellipse cx="70" cy="54" rx="28" ry="26" fill="#e0e0e0" stroke="#2563eb" stroke-width="2"/>
        <!-- 头顶角 -->
        <polygon points="70,18 76,38 64,38" fill="#2563eb"/>
        <!-- 耳朵 -->
        <ellipse cx="42" cy="54" rx="5" ry="10" fill="#2563eb" opacity="0.7"/>
        <ellipse cx="98" cy="54" rx="5" ry="10" fill="#2563eb" opacity="0.7"/>
        <!-- 大眼睛 -->
        <ellipse cx="58" cy="58" rx="8" ry="12" fill="#fff" stroke="#2563eb" stroke-width="2"/>
        <ellipse cx="82" cy="58" rx="8" ry="12" fill="#fff" stroke="#2563eb" stroke-width="2"/>
        <ellipse cx="58" cy="62" rx="3" ry="5" fill="#60a5fa"/>
        <ellipse cx="82" cy="62" rx="3" ry="5" fill="#60a5fa"/>
        <!-- 奥特曼嘴巴 -->
        <path d="M60 74 Q70 80 80 74" stroke="#2563eb" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- 胸口彩色圆环 -->
        <circle cx="70" cy="100" r="10" fill="#60a5fa" stroke="#2563eb" stroke-width="2"/>
        <!-- J字母 -->
        <text x="70" y="106" text-anchor="middle" font-size="12" font-family="Arial, sans-serif" fill="#fff" font-weight="bold">J</text>
        <!-- 手臂（有力量感） -->
        <rect x="35" y="90" width="12" height="28" rx="6" fill="#2563eb"/>
        <rect x="93" y="90" width="12" height="28" rx="6" fill="#2563eb"/>
        <!-- 腿（修长） -->
        <rect x="62" y="118" width="6" height="18" rx="3" fill="#2563eb"/>
        <rect x="72" y="118" width="6" height="18" rx="3" fill="#2563eb"/>
      </svg>
    </div>

    <el-dialog
      v-model="showRobotDialog"
      title="智能助手"
      width="450px"
      :close-on-click-modal="false"
      :modal="false"
      :destroy-on-close="false"
      style="position: fixed; bottom: 20px; right: 20px; margin: 0; transform: none;"
    >
    <template #title>
    <div class="robot-dialog-title">
      <i class="el-icon-robot" style="margin-right: 8px; color: #2563eb;"></i>
      <span>智能助手</span>
    </div>
  </template>
      <div>
        <div class="robot-dialog-history-area">
          <!-- 渲染历史消息（前 n-1 条） -->
          <div
            v-for="(item, idx) in robotHistory.slice(0, -1)"
            :key="idx"
            class="robot-history-msg"
          >
            <div class="robot-question">你：{{ item.question }}</div>
            <div class="robot-answer" v-html="'回答：' + item.answer"></div>
          </div>
          <!-- 当前正在输出的内容或最后一条历史 -->
          <div v-if="robotLoading || robotOutput || robotHistory.length" class="robot-history-msg">
            <div class="robot-question">
              你：
              <span v-if="robotLoading || robotOutput">
                {{ robotInput || (robotHistory.length ? robotHistory[robotHistory.length - 1].question : '') }}
              </span>
              <span v-else-if="robotHistory.length">
                {{ robotHistory[robotHistory.length - 1].question }}
              </span>
            </div>
            <div class="robot-answer">
              回答：
              <span v-if="robotLoading || robotOutput" v-html="robotOutput"></span>
              <span v-else-if="robotHistory.length" v-html="robotHistory[robotHistory.length - 1].answer"></span>
              <span v-if="robotLoading" class="blink-cursor">|</span>
            </div>
          </div>
        </div>
        <el-input
          v-model="robotInput"
          placeholder="请输入你的问题"
          @keyup.enter.native="sendRobotMsg"
          :disabled="robotLoading"
          style="margin-bottom: 8px;"
        />
        <el-button
          type="primary"
          @click="sendRobotMsg"
          :loading="robotLoading"
          :disabled="!robotInput.trim() || robotLoading"
        >发送</el-button>
      </div>
    </el-dialog>
  </nav>
</template>

<script>
import NotificationDropdown from "@/components/Dropdowns/NotificationDropdown.vue";
import UserDropdown from "@/components/Dropdowns/UserDropdown.vue";
import { ElMessageBox } from "element-plus";

export default {
  data() {
    return {
      collapseShow: "hidden",
      showSearchDialog: false,
      showRobotDialog: false, // 新增
      searchQuery: "",
      selectedOption: "",
      navItems: [
        { label: "文献库", to: "/database", icon: "fas fa-map-marked" },
        { label: "文献管理", to: "/paper-library", icon: "fas fa-book" },
        { label: "回收站", to: "/recycle-bin", icon: "fas fa-trash-alt" },
        { label: "组织协作", to: "/collaboration", icon: "fas fa-table" },
        { label: "个人主页", to: "/profile", icon: "fas fa-user-circle" },
        { label: "关于我们", to: "/landing", icon: "fas fa-newspaper" },
        // { label: "组织页面", to: "/organization", icon: "fas fa-newspaper" },
      ],
      robotInput: "",
      robotOutput: "",
      robotLoading: false,
      robotController: null, // 用于中断fetch
      robotHistory: [], // 聊天历史
    };
  },
  methods: {
    toggleCollapseShow(classes) {
      this.collapseShow = classes;
    },
    async confirmLogout() {
      try {
        await ElMessageBox.confirm("确定要退出登录吗？", "提示", {
          confirmButtonText: "确定退出",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "custom-message-box",
          zIndex: 10000,
        });

        // 用户确认后执行退出操作
        this.redirectToLogin();
      } catch (error) {
        // 用户取消操作不做任何处理
      }
    },
    redirectToLogin() {
      // 清除 Token 并跳转到登录页面
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      this.$router.push("/");
    },
    isItemActive(item) {
      const current = this.$route.path;
      // 自定义规则：访问 /admin/settings 时，视为“/profile”激活
      if (current === "/admin/settings" && item.to === "/profile") {
        return true;
      }
      return current === item.to;
    },
    handleSearch() {
      this.$router.push({
        path: `/${this.selectedOption}`,
        query: { search: this.searchQuery },
      });
      this.showSearchDialog = false;
      this.searchQuery = "";
      this.selectedOption = "";
    },
    async sendRobotMsg() {
      if (!this.robotInput.trim()) return;
      const input = this.robotInput;
      this.robotOutput = "";
      this.robotLoading = true;
      if (this.robotController) this.robotController.abort();
      this.robotController = new AbortController();

      try {
        const token = localStorage.getItem("authToken") || "";
        const response = await fetch("http://43.143.228.56:8000/chat/note", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
          body: JSON.stringify({ input }),
          signal: this.robotController.signal,
        });

        if (!response.body) throw new Error("无响应流");
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            const match = line.match(/data:\s*(\{.*\})/);
            if (match) {
              try {
                const obj = JSON.parse(match[1]);
                if (obj.content) {
                  this.robotOutput += obj.content;
                }
              } catch (e) {
                // 忽略错误
              }
            }
          }
        }
        // 聊天历史保存
        this.robotHistory.push({
          question: input,
          answer: this.robotOutput,
        });
      } catch (e) {
        //this.robotOutput += "\n[机器人服务异常]";
      } finally {
        this.robotLoading = false;
        this.robotInput = "";
        this.robotController = null;
      }
    },
  },
  components: {
    NotificationDropdown,
    UserDropdown,
  },
};
</script>

<style>
/* 机器人浮动动画 */
.robot-float {
  animation: robot-updown 2.2s infinite ease-in-out;
  cursor: pointer;
  z-index: 100;
  filter: drop-shadow(0 4px 16px #2563eb22);
}

@keyframes robot-updown {
  0% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-22px); }
  100% { transform: translateX(-50%) translateY(0); }
}


.robot-dialog-history-area {
  background: #f8fafc; /* 背景颜色 */
  border-radius: 10px; /* 圆角 */
  padding: 10px; /* 内边距 */
  margin-bottom: 14px; /* 外边距 */
  max-height: 500px; /* 最大高度 */
  overflow-y: auto; /* 超出内容滚动 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 阴影 */
}

.robot-question {
  align-self: flex-end; /* 右对齐整个块 */
  background: linear-gradient(90deg, #60a5fa 0%, #2563eb 100%); /* 渐变背景 */
  color: #fff; /* 字体颜色 */
  padding: 4px 8px; /* 内边距，紧贴文字 */
  border-radius: 12px; /* 圆角 */
  display: inline-block; /* 背景紧贴文字 */
  font-weight: 500; /* 字体加粗 */
  font-size: 15px; /* 字体大小 */
  margin-bottom: 4px; /* 间距 */
  word-break: break-word; /* 自动换行 */
  text-align: right; /* 文字右对齐 */
}

.robot-answer {
  align-self: flex-start; /* 左对齐 */
  background: #fff; /* 背景颜色 */
  color: #2563eb; /* 字体颜色 */
  padding: 4px 8px; /* 内边距，紧贴文字 */
  border-radius: 12px; /* 圆角 */
  display: inline-block; /* 背景紧贴文字 */
  font-size: 15px; /* 字体大小 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 阴影 */
  word-break: break-word; /* 自动换行 */
  margin-top: 8px; /* 与上一条内容的间距，确保换行 */
}

.robot-dialog-title {
  display: flex;
  align-items: center;
  font-size: 18px; /* 字体大小 */
  font-weight: bold; /* 字体加粗 */
  color: #2563eb; /* 字体颜色 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); /* 添加文字阴影 */
}
</style>