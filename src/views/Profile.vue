<template>
  <div class="min-h-screen">
    <!-- 加载状态 -->
    <div
        v-if="isLoading"
        v-loading="true"
        element-loading-text="正在加载用户数据..."
        element-loading-background="rgba(255, 255, 255, 0.9)"
        style="height: 100vh">
    </div>
    <div v-else>
      <!--    <navbar />-->
      <main class="profile-page">
        <section class="relative block h-500-px">
          <div
              class="absolute top-0 w-full h-full bg-center bg-cover"
              style="
            background-image: url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80');
          "
          >
          <span
              id="blackOverlay"
              class="w-full h-full absolute opacity-50 bg-black"
          ></span>
          </div>
          <div
              class="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
              style="transform: translateZ(0);"
          >
            <svg
                class="absolute bottom-0 overflow-hidden"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                version="1.1"
                viewBox="0 0 2560 100"
                x="0"
                y="0"
            >
              <polygon
                  class="text-blueGray-200 fill-current"
                  points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </section>
        <section class="relative py-16 bg-blueGray-200">
          <div
              v-if="isLoading"
              v-loading="true"
              element-loading-text="正在加载用户数据..."
              element-loading-background="rgba(255, 255, 255, 0.9)"
              style="height: 100vh">
          </div>
          <div class="container mx-auto px-4">
            <div
                class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64"
            >
              <div class="px-6">
                <div class="flex flex-wrap justify-center">
                  <div
                      class="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center"
                  >
                    <div class="relative">
                      <img
                          alt="Avatar"
                          :src="user.avatar || team2"
                          class="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                      />
                    </div>
                  </div>
                  <div
                      class="flex w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center justify-end"
                  >
                    <div class="py-6 px-3 mt-32 sm:mt-0">
                    <span
                        @click="goToSettings"
                        class="cursor-pointer text-blueGray-600 text-base hover:text-blueGray-800 transition-colors font-bold"
                    >
                     编辑主页
                   </span>
                    </div>
                    <div class="py-6 px-3 mt-32 sm:mt-0">
                    <span
                        @click="showPasswordDialog = true"
                        class="cursor-pointer text-blueGray-600 text-base hover:text-blueGray-800 transition-colors font-bold"
                    >
                     修改密码
                   </span>
                    </div>
                  </div>
                  <div class="w-full lg:w-4/12 px-4 lg:order-1">
                    <div class="flex justify-center py-4 lg:pt-4 pt-8">
                      <div class="mr-4 p-3 text-center">
                      <span
                          class="text-xl font-bold block uppercase tracking-wide text-blueGray-600"
                      >
                        {{ articleCount }}
                      </span>
                        <span class="text-sm text-blueGray-400">文献</span>
                      </div>
                      <div class="mr-4 p-3 text-center">
                      <span
                          class="text-xl font-bold block uppercase tracking-wide text-blueGray-600"
                      >
                        {{ noteCount }}
                      </span>
                        <span class="text-sm text-blueGray-400">笔记</span>
                      </div>
                      <div class="lg:mr-4 p-3 text-center">
                      <span
                          class="text-xl font-bold block uppercase tracking-wide text-blueGray-600"
                      >
                        {{ organizationCount }}
                      </span>
                        <span class="text-sm text-blueGray-400">组织</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="text-center mt-12">
                  <h3
                      class="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2"
                  >
                    {{ user.username || `user_${user.id}` }}
                  </h3>
                  <div
                      class="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase"
                  >
                    <i
                        class="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"
                    ></i>
                    {{ user.address || '未知' }}
                  </div>
                  <div class="mb-2 text-blueGray-600">
                    <i
                        class="fas fa-university mr-2 text-lg text-blueGray-400"
                    ></i>
                    {{ user.university || '未知' }}
                  </div>
                </div>
                <div class="mt-10 py-10 border-t border-blueGray-200 text-center">
                  <div class="flex flex-wrap justify-center">
                    <div class="w-full lg:w-9/12 px-4">
                      <p class="mb-4 text-lg leading-relaxed text-blueGray-700">
                        {{ user.introduction || '这里什么也没有' }}
                      </p>
                    </div>
                  </div>
                </div>
                <!-- 新增折线图部分 -->
                <div class="mt-10 py-10 border-t border-blueGray-200">
                  <div class="flex flex-wrap">
                    <div class="w-full lg:w-6/12 px-4">
                      <bar-chart
                          :chart-data="literatureData"
                          :gradient-colors="['rgba(76, 175, 80, 0.4)', 'rgba(76, 175, 80, 0)']"
                      />
                    </div>
                    <div class="w-full lg:w-6/12 px-4">
                      <bar-chart
                          :chart-data="notesData"
                          :gradient-colors="['rgba(33, 150, 243, 0.4)', 'rgba(33, 150, 243, 0)']"
                      />
                    </div>
                  </div>
                </div>
                <!-- 折线图部分结束 -->
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer-component />
    </div>
    <!-- 新增密码修改对话框 -->
    <transition name="fade">
      <div v-if="showPasswordDialog" class="modal-overlay">
        <div class="modal-content">
          <!-- 修改此处背景色 -->
          <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
            <div class="rounded-t mb-0 px-6 py-6">
              <div class="text-center mb-0">
                <!-- 调整标题颜色保持对比度 -->
                <h6 class="text-blueGray-700 text-sm font-bold">修改密码</h6>
              </div>
            </div>
            <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
              <form @submit.prevent="handlePasswordSubmit">
                <!-- 保持输入框样式不变 -->
                <div class="relative w-full mb-3">
                  <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    旧密码
                  </label>
                  <input
                      type="password"
                      v-model="passwordForm.oldPassword"
                      class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="请输入旧密码"
                      required
                  />
                </div>

                <div class="relative w-full mb-6">
                  <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    新密码
                  </label>
                  <input
                      type="password"
                      v-model="passwordForm.newPassword"
                      class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="请输入新密码（至少6位）"
                      required
                      minlength="6"
                  />
                </div>

                <!-- 保持按钮样式不变 -->
                <div class="text-center mt-6">
                  <button
                      type="button"
                      @click="showPasswordDialog = false"
                      class="bg-blueGray-600 text-white active:bg-blueGray-400 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-2 mb-1 w-32 ease-linear transition-all duration-150"
                  >
                    取消
                  </button>
                  <button
                      type="submit"
                      :disabled="isSubmitting"
                      class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ml-2 mb-1 w-32 ease-linear transition-all duration-150"
                  >
                    {{ isSubmitting ? '提交中...' : '确认修改' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
// import Navbar from "@/components/Navbars/AuthNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";
import BarChart from "@/components/Cards/BarChart.vue";
import team2 from "@/assets/img/team-2-800x800.jpg";
import axios from "axios";
import { ElMessageBox, ElMessage } from 'element-plus'

export default {
  data() {
    return {
      showPasswordDialog: false,
      isSubmitting: false,
      passwordForm: {
        oldPassword: '',
        newPassword: ''
      },
      isLoading: true, // 新增加载状态
      team2, // 将 team2 定义在 data 中
      user: {
        id: null,
        username: "",
        avatar: "",
        address: "",
        university: "",
        introduction: "",
      },
      articleCount: 0, // 文献数量
      noteCount: 0, // 笔记数量
      organizationCount: 0, // 组织数量
      refreshInterval: null, // 定时器 ID
      literatureData: {
        labels: ["6天前", "5天前", "4天前", "3天前", "2天前", "昨天", "今天"],
        datasets: [
          {
            label: "文献新增数量",
            borderColor: "#4CAF50", // 绿色边框
            backgroundColor: "rgba(76, 175, 80, 0.2)", // 绿色背景
            data: [5, 8, 6, 10, 12, 9, 15], // 假数据
            fill: true,
          },
        ],
      },
      notesData: {
        labels: ["6天前", "5天前", "4天前", "3天前", "2天前", "昨天", "今天"],
        datasets: [
          {
            label: "笔记新增数量",
            borderColor: "#2196F3", // 蓝色边框
            backgroundColor: "rgba(33, 150, 243, 0.2)", // 蓝色背景
            data: [3, 5, 7, 8, 6, 10, 12], // 假数据
            fill: true,
          },
        ],
      },
    };
  },
  components: {
    // Navbar,
    FooterComponent,
    BarChart
  },
  methods: {
    async handlePasswordSubmit() {
      try {
        // 表单验证
        if (!this.passwordForm.oldPassword || !this.passwordForm.newPassword) {
          ElMessage.warning('请填写完整密码信息')
          return
        }
        if (this.passwordForm.newPassword.length < 6) {
          ElMessage.warning('新密码至少需要6位')
          return
        }

        // 二次确认
        await ElMessageBox.confirm('确定要修改密码吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        this.isSubmitting = true

        // 调用修改密码接口
        const token = localStorage.getItem("authToken")
        const response = await axios.post(
            "https://43.143.228.56:8000/user/password",
            {
              old_password: this.passwordForm.oldPassword,
              new_password: this.passwordForm.newPassword
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            }
        )

        console.log(response)

        ElMessage.success('密码修改成功')
        this.showPasswordDialog = false
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error(error.response?.data?.message || '密码修改失败')
        }
      } finally {
        this.isSubmitting = false
      }
    },
    handleClose(done) {
      if (this.passwordForm.oldPassword || this.passwordForm.newPassword) {
        ElMessageBox.confirm('确定要放弃修改吗？', '提示', {
          type: 'warning'
        }).then(() => done())
            .catch(() => {})
      } else {
        done()
      }
    },
    goToSettings() {
      this.$router.push("/admin/settings");
    },


    async fetchData() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("Token 不存在，请先登录！");
          return;
        }

        const response = await axios.get("https://43.143.228.56:8000/notes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        console.log(data)
        this.articleCount = new Set(data.notes.map((note) => note.article_id))
            .size; // 文献数量
        this.noteCount = data.notes.length; // 笔记数量
        this.organizationCount = 5; // 假设组织数量为固定值
        localStorage.setItem("article", this.articleCount);
        localStorage.setItem("note", this.noteCount);
        localStorage.setItem("organization", this.organizationCount);
      } catch (error) {
        console.error("获取数据失败：", error);
      }
    },
    async fetchUser() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("Token 不存在，请先登录！");
          return;
        }

        const response = await axios.get("https://43.143.228.56:8000/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = response.data;
        console.log(userData.avatar)
        this.user = {
          id: userData.id,
          username: userData.username || `user_${userData.id}`,
          avatar: userData.avatar
              ? `https://43.143.228.56:8000${userData.avatar}`
              : team2,
          address: userData.address || "未知",
          university: userData.university || "未知",
          introduction: userData.introduction || "这里什么也没有",
        };
        console.log(this.user)
        localStorage.setItem("user", JSON.stringify(this.user));
      } catch (error) {
        console.error("获取用户信息失败：", error);
      }
    },
    // 使用集中化的token刷新服务
    initTokenRefresh() {
      import('@/utils/tokenRefreshService').then(module => {
        const tokenRefreshService = module.default;
        tokenRefreshService.init();
      });
    },
    // 使用新的token刷新服务，不再需要自己维护刷新定时器
    startTokenRefresh() {
      this.initTokenRefresh();
    },
    redirectToLogin() {
      // 清除 Token 并跳转到登录页面
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      this.$router.push("/auth/login");
    },
  },
  async mounted() {
    try {
      // 先显示 loading
      this.isLoading = true

      // 并行执行所有初始化任务
      await Promise.all([
        this.initTokenRefresh(),
        this.fetchData(),
        this.fetchUser()
      ])

      // 启动定时刷新
      this.startTokenRefresh()

    } catch (error) {
      console.error("初始化失败:", error)
      ElMessage.error("数据加载失败: " + (error.response?.data?.message || error.message))
      this.redirectToLogin()
    } finally {
      // 无论成功失败都关闭 loading
      this.isLoading = false
    }
  },
  // 不再需要手动清除定时器，因为使用了集中管理的tokenRefreshService
  beforeRouteLeave(to, from, next) {
    next();
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.half-size {
  width: 50%;
  height: 50%;
}

.el-loading-spinner {
  top: 40% !important;
}

.el-loading-spinner .path {
  stroke: #4CAF50; /* 修改加载图标颜色 */
}

.el-loading-spinner .el-loading-text {
  color: #4CAF50;
  font-size: 18px;
  margin-top: 12px;
}

/* 自定义对话框样式 */
.custom-dialog {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

/* 背景模糊效果 */
.el-overlay {
  backdrop-filter: blur(3px);
  background-color: rgba(0, 0, 0, 0.3);
}

/* 对话框动画 */
.el-dialog__wrapper {
  transition: all 0.3s ease;
}

.custom-message-box {
  z-index: 10000 !important;
}

.el-overlay {
  z-index: 9999 !important;
}
</style>
