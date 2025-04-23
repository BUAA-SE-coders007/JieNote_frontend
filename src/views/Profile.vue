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
                      alt="..."
                      :src="team2"
                      class="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                    />
                  </div>
                </div>
                <div
                  class="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center"
                >
                  <div class="py-6 px-3 mt-32 sm:mt-0">
                    <router-link to="/admin/settings" class="text-blueGray-800 text-xl font-bold hover:underline">
                      设置
                    </router-link>
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
                  姜娜·斯通斯
                </h3>
                <div
                  class="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase"
                >
                  <i
                    class="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"
                  ></i>
                  洛杉矶，加利福尼亚
                </div>
                <div class="mb-2 text-blueGray-600 mt-10">
                  <i
                    class="fas fa-briefcase mr-2 text-lg text-blueGray-400"
                  ></i>
                  解决方案经理 - 创意团队官员
                </div>
                <div class="mb-2 text-blueGray-600">
                  <i
                    class="fas fa-university mr-2 text-lg text-blueGray-400"
                  ></i>
                  计算机科学大学
                </div>
              </div>
              <div class="mt-10 py-10 border-t border-blueGray-200 text-center">
                <div class="flex flex-wrap justify-center">
                  <div class="w-full lg:w-9/12 px-4">
                    <p class="mb-4 text-lg leading-relaxed text-blueGray-700">
                      一位具有相当范围的艺术家，姜娜是墨尔本出生、布鲁克林居住的尼克·墨菲的名字，
                      他自己创作、表演和录制所有音乐，赋予其温暖、亲密的感觉和坚实的律动结构。
                    </p>
                    <a
                      href="javascript:void(0)"
                      class="font-normal text-emerald-500"
                    >
                      显示更多
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer-component />
  </div>
</template>

<script>
import Navbar from "@/components/Navbars/AuthNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";
import team2 from "@/assets/img/team-2-800x800.jpg";
import axios from "axios";

export default {
  data() {
    return {
      team2,
      articleCount: 0, // 文献数量
      noteCount: 0, // 笔记数量
      organizationCount: 0, // 组织数量
    };
  },
  components: {
    Navbar,
    FooterComponent,
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
    goToSetting() {
      // 使用 $router.push 跳转到设置页面
      this.$router.push("/admin/settings");
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>