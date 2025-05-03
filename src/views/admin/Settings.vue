<template>
  <div class="flex flex-wrap items-stretch">
    <div class="w-full lg:w-8/12 px-4 mt-8">
      <CardSettings
          :user-data="userData"
          @update-user="handleUpdateUser"
          class="h-full"
      />
    </div>
    <div class="w-full lg:w-4/12 px-4 mt-8">
      <CardProfile :user-data="userData"  />
    </div>
  </div>
</template>

<script>
import CardSettings from "@/components/Cards/CardSettings.vue";
import CardProfile from "@/components/Cards/CardProfile.vue";
import axios from "axios";
// import axios from "axios";

export default {
  components: {
    CardSettings,
    CardProfile,
  },
  data() {
    return {
      userData: {
        username: "",
        address: "",
        university: "",
        introduction: "",
        avatar: "",
      }
    };
  },
  async created() {
    await this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      const article = localStorage.getItem("article")
      const note = localStorage.getItem("note")
      const organization = localStorage.getItem("organization")
      const user = JSON.parse(localStorage.getItem("user"));
      this.userData = {
        articleCount: article, // 文献数量
        noteCount: note, // 笔记数量
        organizationCount: organization, // 组织数量
        username:user.username,
        address: user.address,
        university: user.university,
        introduction: user.introduction,
        avatar: user.avatar
            ? `${user.avatar}`
            : require("@/assets/img/team-2-800x800.jpg")
      };
      console.log(this.userData);
    },
    handleUpdateUser(updatedData) {
      this.userData = { ...this.userData, ...updatedData };
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
      }, 4.5 * 60 * 1000);
    },
    redirectToLogin() {
      // 清除 Token 并跳转到登录页面
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      this.$router.push("/auth/login");
    },
  },
  beforeDestroy() {
    // 确保彻底清除定时器
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null; // 添加这行重置指针
      console.log('定时器已销毁'); // 添加调试日志
    }
  },
// 新增路由离开守卫（如果是 Vue Router 项目）
  beforeRouteLeave(to, from, next) {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
      console.log('路由离开时清除定时器');
    }
    next();
  },
  async mounted() {
    await this.refreshToken();
    this.startTokenRefresh();
  },
};
</script>