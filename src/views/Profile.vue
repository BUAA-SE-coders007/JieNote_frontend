<template>
  <div>
    <navbar />
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
                  class="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center"
                >
                  <div class="py-6 px-3 mt-32 sm:mt-0">
                    <button
                      @click="showSettings = true"
                      class="text-blueGray-800 text-xl font-bold hover:underline"
                    >
                      设置
                    </button>
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
      <!-- 动态加载 CardSettings -->
      <transition name="fade">
        <div v-if="showSettings" class="modal-overlay">
          <div class="modal-content half-size">
            <card-settings @close="showSettings = false" />
          </div>
        </div>
      </transition>
    </main>
    <footer-component />
  </div>
</template>

<script>
import Navbar from "@/components/Navbars/AuthNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";
import BarChart from "@/components/Cards/BarChart.vue";
import CardSettings from "@/components/Cards/CardSettings.vue";
import team2 from "@/assets/img/team-2-800x800.jpg";
import axios from "axios";

export default {
  data() {
    return {
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
      showSettings: false, // 控制 CardSettings 显示
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
    Navbar,
    FooterComponent,
    BarChart,
    CardSettings,
  },
  methods: {
    async fetchData() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("Token 不存在，请先登录！");
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/notes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        this.articleCount = new Set(data.notes.map((note) => note.article_id))
          .size; // 文献数量
        this.noteCount = data.notes.length; // 笔记数量
        this.organizationCount = 5; // 假设组织数量为固定值
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

        const response = await axios.get("http://localhost:8000/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = response.data;
        this.user = {
          id: userData.id,
          username: userData.username || `user_${userData.id}`,
          avatar: userData.avatar
            ? `http://localhost:8000${userData.avatar.substring(4)}`
            : team2,
          address: userData.address || "未知",
          university: userData.university || "未知",
          introduction: userData.introduction || "这里什么也没有",
        };
      } catch (error) {
        console.error("获取用户信息失败：", error);
      }
    },
  },
  mounted() {
    this.fetchData();
    this.fetchUser();
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
  width: 80%;
  max-width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.half-size {
  width: 50%;
  height: 50%;
}
</style>