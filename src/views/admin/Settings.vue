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
            ? `http://43.143.228.56:8000${user.avatar}`
            : require("@/assets/img/team-2-800x800.jpg")
      };
      console.log(this.userData);
    },
    handleUpdateUser(updatedData) {
      this.userData = { ...this.userData, ...updatedData };
    }
  }
};
</script>