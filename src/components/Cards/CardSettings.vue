<template>
  <div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0"
  >
    <div class="rounded-t bg-white mb-0 px-6 py-6">
      <div class="text-center flex justify-between">
        <h6 class="text-blueGray-700 text-xl font-bold">设置个人信息</h6>
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
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      form: {
        username: "",
        address: "",
        university: "",
        introduction: "",
      },
      avatar: null, // 用于存储上传的头像文件
    };
  },
  methods: {
    handleFileUpload(event) {
      this.avatar = event.target.files[0]; // 获取上传的文件
    },
    async submitSettings() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("Token 不存在，请先登录！");
          return;
        }

        const formData = new FormData();

        // 动态添加字段
        if (this.form.username) formData.append("username", this.form.username);
        if (this.form.address) formData.append("address", this.form.address);
        if (this.form.university)
          formData.append("university", this.form.university);
        if (this.form.introduction)
          formData.append("introduction", this.form.introduction);
        if (this.avatar) formData.append("avatar", this.avatar);

        // 发送 PUT 请求
        const response = await axios.put("http://localhost:8000/user", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("设置更新成功：", response.data);
        this.$emit("close"); // 关闭设置页面
      } catch (error) {
        console.error("更新设置失败：", error);
      }
    },
  },
};
</script>