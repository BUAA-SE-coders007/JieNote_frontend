<template>
  <div class="container mx-auto px-4 h-full">
    <div class="flex content-center items-center justify-center h-full">
      <div class="w-full lg:w-4/12 px-4">
        <div
          class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0"
        >
          <div class="rounded-t mb-0 px-6 py-6">
            <div class="text-center mb-3">
              <h6 class="text-blueGray-500 text-sm font-bold">
                创建账户
              </h6>
            </div>
          </div>
          <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form @submit.prevent="handleRegister">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  for="username"
                >
                  用户名
                </label>
                <input
                  type="text"
                  id="username"
                  v-model="username"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="请输入用户名"
                  required
                />
              </div>

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

              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  for="verificationCode"
                >
                  验证码
                </label>
                <div class="flex items-center">
                  <input
                    type="text"
                    id="verificationCode"
                    v-model="verificationCode"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="请输入验证码"
                    required
                  />
                  <button
                    type="button"
                    @click="sendVerificationCode"
                    :disabled="isSendingCode"
                    class="ml-2 bg-blueGray-800 text-white text-sm font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                  >
                    {{ isSendingCode ? `${countdown}s后可重发` : "发送验证码" }}
                  </button>
                </div>
                <small class="text-blueGray-500">验证码有效期为5分钟</small>
              </div>

              <div class="text-center mt-6">
                <button
                  type="submit"
                  class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                >
                  注册
                </button>
              </div>
            </form>
          </div>
        </div>
        <div class="flex flex-wrap mt-6 relative">
          <div class="w-full text-center">
            <router-link to="/auth/login" class="text-blueGray-200">
              <small>已有账户？点击登录</small>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      verificationCode: "",
      isSendingCode: false, // 是否正在发送验证码
      countdown: 0, // 倒计时
    };
  },
  methods: {
    async sendVerificationCode() {
      if (!this.email) {
        alert("请先输入邮箱地址！");
        return;
      }
      if (this.isSendingCode) {
        alert("请稍后再试！");
        return;
      }
      try {
        // 调用发送验证码的接口
        await axios.post("http://127.0.0.1:4523/m2/6178223-5870624-default/283173112", { email: this.email });//http://localhost:8000/public/send_code
        alert(`验证码已发送至邮箱：${this.email}`);
        this.startCountdown(); // 开始倒计时
      } catch (error) {
        alert("发送验证码失败，请重试！");
        console.error(error);
      }
    },
    startCountdown() {
      this.isSendingCode = true;
      this.countdown = 300; // 5分钟倒计时
      const interval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          this.isSendingCode = false;
          clearInterval(interval);
        }
      }, 1000);
    },
    async handleRegister() {
      if (!this.username || !this.email || !this.password || !this.verificationCode) {
        alert("请填写所有字段！");
        return;
      }
      try {
        // 调用注册接口
        const response = await axios.post("http://127.0.0.1:4523/m2/6178223-5870624-default/283134772", { //http://localhost:8000/public/register
          email: this.email,
          username: this.username,
          password: this.password,
          code: this.verificationCode,
        });
        alert("注册成功！");
        console.log(response.data);
        this.$router.push("/auth/login"); // 跳转到登录页面
      } catch (error) {
        alert("注册失败，请重试！");
        console.error(error);
      }
    },
  },
};
</script>