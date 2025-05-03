<template>
  <div class="container mx-auto px-4 h-full">
    <div class="flex flex-col content-center items-center justify-center h-full">
      <div class="w-full text-center z-10 mb-[-2rem]">
        <h1 class="text-5xl font-extrabold text-white animate-glow">
          JieNote
        </h1>
      </div>
      <div class="w-full lg:w-4/12 px-4">
        <div
          class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0"
        >
          <div class="rounded-t mb-0 px-6 py-6">
            <div class="text-center mb-0">
              <h6 class="text-blueGray-500 text-sm font-bold">
                登录
              </h6>
            </div>
          </div>
          <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form @submit.prevent="handleLogin">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  for="email"
                >
                  邮箱
                </label>
                <input
                  type="email"
                  id="email"
                  v-model="email"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="请输入邮箱"
                  required
                />
              </div>

              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  for="password"
                >
                  密码
                </label>
                <input
                  type="password"
                  id="password"
                  v-model="password"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="请输入密码"
                  required
                />
              </div>

              <div class="text-center mt-6">
                <button
                  type="submit"
                  class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                >
                  登录
                </button>
              </div>
            </form>
          </div>
        </div>
        <div class="flex flex-wrap mt-6 relative">
          <div class="w-1/2"></div> <!-- 移除忘记密码内容 -->
          <div class="w-1/2 text-right">
            <router-link to="/auth/register" class="text-blueGray-200">
              <small>没有账户？点击注册</small>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ElMessage } from 'element-plus'

export default {
  data() {
    return {
      email: "",
      password: "",
      refreshInterval: null, // 定时器 ID
    };
  },
  methods: {
    async handleLogin() {
      if (!this.email || !this.password) {
        ElMessage.warning("请填写所有字段！");
        return;
      }
      try {
        // 调用登录接口
        const response = await axios.post("http://43.143.228.56:8000/public/login", {
          email: this.email,
          password: this.password,
        });

        if (response.status === 200) {
          ElMessage.success("登录成功！");
          const { access_token, refresh_token } = response.data;

          // 存储 Token 到 localStorage
          localStorage.setItem("authToken", access_token);
          localStorage.setItem("refreshToken", refresh_token);

          // 设置定时刷新 Token
          this.startTokenRefresh();

          console.log(localStorage.getItem("refreshToken"))

          // 跳转到主页
          this.$router.push("/admin");
        }
      } catch (error) {
        ElMessage.error("登录失败，请检查邮箱或密码！");
        console.error(error);
      }
    },
    async refreshToken() {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          console.error("Refresh Token 不存在，请重新登录！");
          this.redirectToLogin();
          return;
        }

        // 调用刷新 Token 的接口
        const response = await axios.post(
          "http://43.143.228.56:8000/public/refresh",
          { refresh_token: refreshToken } // 传入 refresh_token
        );

        if (response.status === 200) {
          const {access_token} = response.data;

          console.log("Token 已刷新:", access_token);

          // 更新 localStorage 中的 Token
          localStorage.setItem("authToken", access_token);
        }
      } catch (error) {
        console.error("刷新 Token 失败，请重新登录！");
        this.redirectToLogin();
      }
    },
    startTokenRefresh() {
      // 每 5 分钟刷新一次 Token
      this.refreshInterval = setInterval(() => {
        this.refreshToken();
      }, 4 * 60 * 1000);
    },
    redirectToLogin() {
      // 清除 Token 并跳转到登录页面
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      this.$router.push("/auth/login");
    },
  },
  beforeDestroy() {
    // 清除定时器
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
@keyframes glow {
  0% {
    color: #ffffff;
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4);
  }
  50% {
    color: #e5e7eb;
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4);
  }
  100% {
    color: #ffffff;
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4);
  }
}

.animate-glow {
  animation: glow 3s ease-in-out infinite;
  font-family: 'Dancing Script', cursive; /* 更艺术的手写字体 */
}
</style>
