<template>
  <div>
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
          <hr class="my-4 md:min-w-full"/>

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

      <div
          class="robot-float"
          style="position: absolute; left: 50%; bottom: 32px; transform: translateX(-50%);"
          @click="showRobotDialog = !showRobotDialog"
      >
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
          <!-- 发光背景 -->
          <circle cx="80" cy="60" r="50" fill="url(#glow)" opacity="0.2"/>

          <!-- 机器人头部（高级感立体） -->
          <circle cx="80" cy="60" r="36" fill="url(#metal)" stroke="#2563eb" stroke-width="3"/>

          <!-- 天线 -->
          <line x1="80" y1="24" x2="80" y2="8" stroke="#60a5fa" stroke-width="2"/>
          <circle cx="80" cy="6" r="4" fill="#2563eb"/>

          <!-- 耳朵（更机械风） -->
          <rect x="38" y="50" width="6" height="20" rx="3" fill="#3b82f6" opacity="0.6"/>
          <rect x="116" y="50" width="6" height="20" rx="3" fill="#3b82f6" opacity="0.6"/>

          <!-- 眼罩面板（科技感矩形） -->
          <rect x="58" y="48" width="44" height="24" rx="10" fill="#1e40af"/>
          <circle cx="70" cy="60" r="4" fill="#60a5fa"/>
          <circle cx="90" cy="60" r="4" fill="#60a5fa"/>

          <!-- JAI 标签 -->
          <rect x="50" y="100" width="60" height="30" rx="15" fill="url(#buttonGrad)"/>
          <text x="80" y="120" text-anchor="middle" font-size="16" font-family="Arial, sans-serif" fill="white"
                font-weight="bold">JAI
          </text>

          <!-- 背景光 -->
          <defs>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#60a5fa"/>
              <stop offset="100%" stop-color="#bfdbfe"/>
            </radialGradient>

            <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#f0f3f9"/>
              <stop offset="100%" stop-color="#d1d5db"/>
            </linearGradient>

            <linearGradient id="buttonGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#3b82f6"/>
              <stop offset="100%" stop-color="#2563eb"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </nav>
    <Teleport to="body">
      <div
          v-show="showRobotDialog"
          class="robot-dialog"
          :style="robotDialogStyle"
      >
        <div
            class="robot-dialog-title cursor-move"
            @mousedown="startDrag"
        >
          <i class="el-icon-robot" style="margin-right: 8px; color: #2563eb;"></i>
          <span>智能助手</span>
          <div class="dialog-controls">
            <i
                class="el-icon-minus cursor-pointer"
                style="margin: 0 8px;"
                @click="minimizeDialog"
            ></i>
            <i
                class="el-icon-full-screen cursor-pointer"
                style="margin: 0 8px;"
                @click="toggleMaximize"
            ></i>
            <i
                class="el-icon-close cursor-pointer"
                style="margin-left: 8px;"
                @click="showRobotDialog = false"
            ></i>
          </div>
        </div>

        <div class="robot-dialog-content">
          <div class="robot-dialog-history-area">
            <!-- 渲染历史消息（前 n-1 条） -->
            <div
                v-for="(item, idx) in robotHistory.slice(0,-1)"
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

          <div class="robot-input-area">
            <el-input
                v-model="robotInput"
                placeholder="请输入你的问题"
                @keyup.enter.native="sendRobotMsg"
                :disabled="robotLoading"
            />
            <el-button
                type="primary"
                @click="sendRobotMsg"
                :loading="robotLoading"
                :disabled="!robotInput.trim() || robotLoading"
            >发送
            </el-button>
          </div>
        </div>

        <!-- 调整大小手柄 -->
        <div
            class="resize-handle"
            @mousedown="startResize"
        ></div>
      </div>
    </Teleport>
  </div>
</template>

<script>
import {ElMessageBox} from "element-plus";
import {sendRobotMessage} from "@/api/database"; // 引入 sendRobotMessage 函数
export default {
  data() {
    return {
      collapseShow: "hidden",
      showSearchDialog: false,
      showRobotDialog: false, // 新增
      searchQuery: "",
      selectedOption: "",
      navItems: [
        {label: "文献库", to: "/database", icon: "fas fa-map-marked"},
        {label: "文献管理", to: "/paper-library", icon: "fas fa-book"},
        {label: "回收站", to: "/recycle-bin", icon: "fas fa-trash-alt"},
        {label: "组织协作", to: "/collaboration", icon: "fas fa-table"},
        {label: "个人主页", to: "/profile", icon: "fas fa-user-circle"},
        {label: "关于我们", to: "/landing", icon: "fas fa-newspaper"},
        // { label: "组织页面", to: "/organization", icon: "fas fa-newspaper" },
      ],
      robotInput: "",
      robotOutput: "",
      robotLoading: false,
      robotController: null, // 用于中断fetch
      robotHistory: [], // 聊天历史
      robotDialogState: {
        x: window.innerWidth - 470, // 初始位置：右侧
        y: window.innerHeight - 420, // 初始位置：底部
        width: 450,
        height: 400,
        isDragging: false,
        isResizing: false,
        startX: 0,
        startY: 0,
        startWidth: 0,
        startHeight: 0,
        isMaximized: false,
        isMinimized: false,
        preMinimizedState: null // 保存最小化前的状态
      }
    };
  },
  computed: {
    // 机器人对话框样式
    robotDialogStyle() {
      if (this.robotDialogState.isMaximized) {
        return {
          left: '0',
          top: '0',
          width: '100%',
          height: '100%',
          zIndex: 19999
        };
      } else if (this.robotDialogState.isMinimized) {
        return {
          left: `${this.robotDialogState.x}px`,
          top: `${this.robotDialogState.y}px`,
          width: '300px',
          height: '40px',
          zIndex: 19999
        };
      } else {
        return {
          left: `${this.robotDialogState.x}px`,
          top: `${this.robotDialogState.y}px`,
          width: `${this.robotDialogState.width}px`,
          height: `${this.robotDialogState.height}px`,
          zIndex: 19999
        };
      }
    }
  },
  watch: {
    showRobotDialog(newVal) {
      if (newVal) {
        // 从本地存储加载保存的位置和大小
        this.loadDialogState();

        // 添加事件监听器
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);

        // 添加键盘监听器
        document.addEventListener('keydown', this.handleKeyDown);
      } else {
        // 保存对话框状态到本地存储
        this.saveDialogState();

        // 移除事件监听器
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
        document.removeEventListener('keydown', this.handleKeyDown);
      }
    }
  },
  mounted() {
    // 确保窗口在页面调整大小时保持在可视区域内
    window.addEventListener('resize', this.ensureDialogInViewport);
  },
  beforeUnmount() {
    // 清理事件监听器
    window.removeEventListener('resize', this.ensureDialogInViewport);
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('keydown', this.handleKeyDown);
  },
  methods: {
    startDrag(e) {
      if (this.robotDialogState.isMaximized || this.robotDialogState.isMinimized) return;

      this.robotDialogState.isDragging = true;
      this.robotDialogState.startX = e.clientX - this.robotDialogState.x;
      this.robotDialogState.startY = e.clientY - this.robotDialogState.y;
      e.preventDefault();
    },

    // 开始调整大小
    startResize(e) {
      if (this.robotDialogState.isMaximized || this.robotDialogState.isMinimized) return;

      this.robotDialogState.isResizing = true;
      this.robotDialogState.startX = e.clientX;
      this.robotDialogState.startY = e.clientY;
      this.robotDialogState.startWidth = this.robotDialogState.width;
      this.robotDialogState.startHeight = this.robotDialogState.height;
      e.preventDefault();
    },

    // 处理鼠标移动
    handleMouseMove(e) {
      if (this.robotDialogState.isDragging) {
        // 计算新位置
        let newX = e.clientX - this.robotDialogState.startX;
        let newY = e.clientY - this.robotDialogState.startY;

        // 边界检查 - 确保窗口不会移出可视区域
        const minX = 0;
        const minY = 0;
        const maxX = window.innerWidth - this.robotDialogState.width;
        const maxY = window.innerHeight - this.robotDialogState.height;

        newX = Math.max(minX, Math.min(newX, maxX));
        newY = Math.max(minY, Math.min(newY, maxY));

        // 更新位置
        this.robotDialogState.x = newX;
        this.robotDialogState.y = newY;
      } else if (this.robotDialogState.isResizing) {
        // 计算新大小
        const deltaX = e.clientX - this.robotDialogState.startX;
        const deltaY = e.clientY - this.robotDialogState.startY;

        // 最小尺寸限制
        const minWidth = 300;
        const minHeight = 200;

        // 更新大小
        this.robotDialogState.width = Math.max(minWidth, this.robotDialogState.startWidth + deltaX);
        this.robotDialogState.height = Math.max(minHeight, this.robotDialogState.startHeight + deltaY);
      }
    },

    // 处理鼠标释放
    handleMouseUp() {
      this.robotDialogState.isDragging = false;
      this.robotDialogState.isResizing = false;
    },

    // 处理按键事件 (ESC键关闭窗口)
    handleKeyDown(e) {
      if (e.key === 'Escape') {
        this.showRobotDialog = false;
      }
    },

    // 最小化窗口
    minimizeDialog() {
      if (!this.robotDialogState.isMinimized) {
        // 保存当前状态
        this.robotDialogState.preMinimizedState = {
          x: this.robotDialogState.x,
          y: this.robotDialogState.y,
          width: this.robotDialogState.width,
          height: this.robotDialogState.height,
          isMaximized: this.robotDialogState.isMaximized
        };

        // 设置最小化状态
        this.robotDialogState.isMinimized = true;
        this.robotDialogState.isMaximized = false;
      } else {
        // 恢复最小化前的状态
        if (this.robotDialogState.preMinimizedState) {
          this.robotDialogState.x = this.robotDialogState.preMinimizedState.x;
          this.robotDialogState.y = this.robotDialogState.preMinimizedState.y;
          this.robotDialogState.width = this.robotDialogState.preMinimizedState.width;
          this.robotDialogState.height = this.robotDialogState.preMinimizedState.height;
          this.robotDialogState.isMaximized = this.robotDialogState.preMinimizedState.isMaximized;
        }
        this.robotDialogState.isMinimized = false;
      }
    },

    // 切换最大化
    toggleMaximize() {
      this.robotDialogState.isMaximized = !this.robotDialogState.isMaximized;
      this.robotDialogState.isMinimized = false;
    },

    // 保存对话框状态到本地存储
    saveDialogState() {
      // 在保存前确保不是最小化或最大化状态
      const saveState = {
        x: this.robotDialogState.x,
        y: this.robotDialogState.y,
        width: this.robotDialogState.width,
        height: this.robotDialogState.height,
        isMaximized: false, // 保存时重置最大化状态
        isMinimized: false   // 保存时重置最小化状态
      };

      localStorage.setItem('robotDialogState', JSON.stringify(saveState));
    },

    // 从本地存储加载对话框状态
    loadDialogState() {
      const savedState = localStorage.getItem('robotDialogState');
      if (savedState) {
        try {
          const state = JSON.parse(savedState);
          this.robotDialogState.x = state.x;
          this.robotDialogState.y = state.y;
          this.robotDialogState.width = state.width;
          this.robotDialogState.height = state.height;

          // 确保窗口在可视区域内
          this.ensureDialogInViewport();
        } catch (e) {
          console.error('Error loading dialog state:', e);
          this.setDefaultPosition();
        }
      } else {
        this.setDefaultPosition();
      }
    },

    // 设置默认位置
    setDefaultPosition() {
      this.robotDialogState.x = window.innerWidth - this.robotDialogState.width - 20;
      this.robotDialogState.y = window.innerHeight - this.robotDialogState.height - 20;
    },

    // 确保对话框在可视区域内
    ensureDialogInViewport() {
      if (this.robotDialogState.isMaximized || this.robotDialogState.isMinimized) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // 检查X坐标
      if (this.robotDialogState.x < 0) {
        this.robotDialogState.x = 20;
      } else if (this.robotDialogState.x + this.robotDialogState.width > viewportWidth) {
        this.robotDialogState.x = viewportWidth - this.robotDialogState.width - 20;
      }

      // 检查Y坐标
      if (this.robotDialogState.y < 0) {
        this.robotDialogState.y = 20;
      } else if (this.robotDialogState.y + this.robotDialogState.height > viewportHeight) {
        this.robotDialogState.y = viewportHeight - this.robotDialogState.height - 20;
      }

      // 检查尺寸
      const minWidth = 300;
      const minHeight = 200;
      if (this.robotDialogState.width < minWidth) {
        this.robotDialogState.width = minWidth;
      }
      if (this.robotDialogState.height < minHeight) {
        this.robotDialogState.height = minHeight;
      }
    },
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
        query: {search: this.searchQuery},
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
        const response = await sendRobotMessage({
          input,
          signal: this.robotController.signal, // 传递 AbortSignal
        });

        console.log(response);
        if (!response.body) throw new Error("无响应流");
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const {done, value} = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, {stream: true});
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
  }
};
</script>

<style>
.robot-float {
  animation: robot-float-breath 3.5s ease-in-out infinite;
  cursor: pointer;
  z-index: 100;
  transition: transform 0.3s ease;
  filter: drop-shadow(0 8px 20px rgba(59, 130, 246, 0.4));
}

.robot-float:hover {
  transform: translateX(-50%) scale(1.08);
  filter: drop-shadow(0 12px 30px rgba(59, 130, 246, 0.6));
}

@keyframes robot-float-breath {
  0%, 100% {
    transform: translateX(-50%) translateY(0px);
  }
  50% {
    transform: translateX(-50%) translateY(-8px);
  }
}

/* 机器人对话框 */
.robot-dialog {
  position: fixed;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #e4e7ed;
}

.robot-dialog-title {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: bold;
  color: #2563eb;
  background: #f0f5ff;
  user-select: none;
  border-bottom: 1px solid #e4e7ed;
}

.robot-dialog-minimized .robot-dialog-title {
  border-bottom: none;
}

.dialog-controls {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.dialog-controls i {
  font-size: 16px;
  transition: all 0.3s;
  padding: 4px;
  border-radius: 4px;
}

.dialog-controls i:hover {
  background: #dbeafe;
}

.robot-dialog-content {
  display: flex;
  flex-direction: column;
  height: calc(100% - 40px); /* 减去标题栏高度 */
  background: #f8fafc;
  overflow: hidden;
}

.robot-dialog-history-area {
  background: white;
  border-radius: 10px;
  padding: 12px;
  margin: 16px;
  flex: 1; /* 占据剩余空间 */
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 16px; /* 消息间距 */
}

.robot-input-area {
  display: flex;
  gap: 8px;
  padding: 0 16px 16px;
}

.robot-input-area .el-input {
  flex: 1;
}

.robot-input-area .el-button {
  flex-shrink: 0;
}

/* 调整大小手柄 */
.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 16px;
  height: 16px;
  background: #2563eb;
  cursor: nwse-resize;
  z-index: 10;
  border-top-left-radius: 4px;
  opacity: 0.5;
  transition: opacity 0.3s;
}

.resize-handle:hover {
  opacity: 1;
}

/* 历史消息样式 */
.robot-history-msg {
  display: flex;
  flex-direction: column;
}

.robot-question {
  align-self: flex-end;
  background: linear-gradient(90deg, #60a5fa 0%, #2563eb 100%);
  color: white;
  padding: 12px 16px;
  border-radius: 18px;
  max-width: 90%;
  margin-bottom: 4px;
  word-break: break-word;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.robot-answer {
  align-self: flex-start;
  background: white;
  color: #1e293b;
  padding: 12px 16px;
  border-radius: 18px;
  max-width: 90%;
  margin-top: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  word-break: break-word;
  border: 1px solid #e2e8f0;
}

/* 光标闪烁效果 */
.blink-cursor {
  animation: blink 1s infinite;
  opacity: 1;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

/* 当拖拽时添加半透明效果 */
.robot-dialog-dragging {
  opacity: 0.9;
}
</style>