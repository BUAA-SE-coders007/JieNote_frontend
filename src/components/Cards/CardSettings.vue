<template>
  <div>
    <div
      class="relative flex flex-col min-w-12 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0"
    >
      <div class="rounded-t bg-white mb-0 px-6 py-6">
        <div class="text-center flex justify-between">
          <h6 class="text-blueGray-700 text-xl font-bold">设置个人信息</h6>
          <button
            @click="showChangePassword = true"
            class="text-blueGray-800 text-sm font-bold hover:underline"
          >
            修改密码
          </button>
        </div>
      </div>
      <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form @submit.prevent="submitSettings">
          <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            用户信息
          </h6>
          <div class="flex flex-wrap">
            <div class="w-full lg:w-6/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="username"
                >
                  用户名
                </label>
                <input
                  id="username"
                  type="text"
                  v-model="form.username"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="请输入用户名"
                />
              </div>
            </div>
          </div>

          <hr class="mt-6 border-b-1 border-blueGray-300" />

          <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            联系信息
          </h6>
          <div class="flex flex-wrap">
            <div class="w-full lg:w-12/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="address"
                >
                  地址
                </label>
                <input
                  id="address"
                  type="text"
                  v-model="form.address"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="请输入地址"
                />
              </div>
            </div>
            <div class="w-full lg:w-12/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="university"
                >
                  大学
                </label>
                <input
                  id="university"
                  type="text"
                  v-model="form.university"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="请输入大学"
                />
              </div>
            </div>
          </div>

          <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            关于我
          </h6>
          <div class="flex flex-wrap">
            <div class="w-full lg:w-12/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="introduction"
                >
                  个人介绍
                </label>
                <textarea
                  id="introduction"
                  v-model="form.introduction"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  rows="4"
                  placeholder="请输入个人介绍"
                ></textarea>
              </div>
            </div>
          </div>

          <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            上传头像
          </h6>
          <div class="flex flex-wrap">
            <div class="w-full lg:w-12/12 px-4">
              <div class="relative w-full mb-3">
                <input
                  type="file"
                  @change="handleFileUpload"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>
            </div>
          </div>

          <!-- 确认按钮 -->
          <div class="flex justify-end mt-6">
            <button
              type="submit"
              class="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
            >
              <strong style="color: black;">确认</strong>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 修改密码窗口 -->
    <transition name="fade">
      <div v-if="showChangePassword" class="modal-overlay">
        <div class="modal-content">
          <h3 class="text-xl font-bold mb-4">修改密码</h3>
          <form @submit.prevent="changePassword">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">
                旧密码
              </label>
              <input
                type="password"
                v-model="passwordForm.oldPassword"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="请输入旧密码"
              />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2">
                新密码
              </label>
              <input
                type="password"
                v-model="passwordForm.newPassword"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="请输入新密码"
              />
            </div>
            <div class="flex justify-end">
              <button
                type="submit"
                class="bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                确认
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    userData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: { ...this.userData },
      avatar: null,
      showChangePassword: false, // 控制修改密码窗口显示
      passwordForm: {
        oldPassword: "",
        newPassword: "",
      },
    };
  },
  watch: {
    userData: {
      handler(newVal) {
        this.form = { ...newVal };
      },
      deep: true
    }
  },
  methods: {
    handleFileUpload(event) {
      this.avatar = event.target.files[0]; // 获取上传的文件
    },
    async submitSettings() {
      try {
        const token = localStorage.getItem("authToken");
        const formData = new FormData();
        // 明确按后端要求的字段名提交
        formData.append("username", this.form.username || ""); // 处理空值
        formData.append("address", this.form.address || "");
        formData.append("university", this.form.university || "");
        formData.append("introduction", this.form.introduction || "");

        // 处理文件上传
        if (this.avatar) {
          formData.append("avatar", this.avatar); // 确保字段名与后端一致
        }

        console.log(formData);

        // 发送 PUT 请求
        const response = await axios.put("http://43.143.228.56:8000/user", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("设置更新成功：", response.data);
        this.$emit("update-user", {
          ...this.form,
          avatar: response.data.avatar
              ? `http://43.143.228.56:8000${response.data.avatar}`
              : this.userData.avatar
        });
      } catch (error) {
        console.error("更新设置失败：", error);
      }
    },
    async changePassword() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("Token 不存在，请先登录！");
          return;
        }

        const response = await axios.post(
          "http://localhost:8000/user/password",
          {
            old_password: this.passwordForm.oldPassword,
            new_password: this.passwordForm.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json", // 确保请求体是 JSON 格式
            },
          }
        );

        console.log("密码修改成功：", response.data);
        this.showChangePassword = false; // 关闭修改密码窗口
      } catch (error) {
        console.error("修改密码失败：", error);
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
        console.error("刷新 Token 失败，请重试！");
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
  async mounted() {
    await this.refreshToken();
    this.startTokenRefresh();
  },
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
  width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
