<template>
  <div>
    <!--    <index-navbar />-->
    <section
        class="header relative pt-16 items-center flex h-screen max-h-860-px"
    >
      <div class="container mx-auto items-center flex flex-wrap">
        <div class="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
          <div class="pt-32 sm:pt-0">
            <h2 class="font-semibold text-4xl text-blueGray-600">
              JieNote
            </h2>
            <p class="mt-4 text-lg leading-relaxed text-blueGray-500">
              本项目旨在开发一个 web 端轻量级在线文献学习网站，将为用户提供文献分类管理、组织协作、笔记记录、知识库等功能，成为用户读文献记笔记的一站式解决方案。
            </p>
            <div class="mt-12">
              <router-link
                  to="/auth/Login"
                  class="get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-emerald-500 active:bg-emerald-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
              >
                Get started
              </router-link>
              <a
                  href="https://www.cnblogs.com/coders007/p/18804756"
                  target="_blank"
                  class="github-star ml-1 text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-blueGray-700 active:bg-blueGray-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
              >
                Blog Star
              </a>
            </div>
          </div>
        </div>
      </div>

      <img
          class="absolute top-0 b-auto right-0 pt-16 sm:w-6/12 -mt-48 sm:mt-0 w-10/12 max-h-860-px"
          :src="patternVue"
          alt="..."
      />

    </section>

    <!-- 修改后的图表区块 -->
    <section class="pt-24 pb-16">
      <div class="container mx-auto">
        <!-- 标题区块 -->
        <div class="mb-12 text-center">
          <h3 class="inline-block text-3xl font-bold text-emerald-700 relative pb-3">
            知识成长可视化
            <span class="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-full"></span>
          </h3>
          <p class="text-lg text-blueGray-600 mt-4">
            实时追踪您近7日的学术足迹，以下是平台的7日足迹
          </p>
        </div>

        <!-- 无框图表容器 -->
        <div class="relative h-[420px]">
          <bar-chart
              :chart-data="tableData"
              :gradient-colors="['rgba(16, 185, 129, 0.18)', 'rgba(16, 185, 129, 0.03)']"
              class="rounded-xl"
          />
        </div>
      </div>
    </section>



    <section class="mt-48 md:mt-40 pb-40 relative bg-blueGray-100">
      <div
          class="-mt-20 top-0 bottom-auto left-0 right-0 w-full absolute h-20"
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
              class="text-blueGray-100 fill-current"
              points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>
      <div class="container mx-auto">
        <div class="flex flex-wrap items-center">
          <div
              class="w-10/12 md:w-6/12 lg:w-4/12 px-12 md:px-4 mr-auto ml-auto -mt-32"
          >
            <div
                class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg bg-emerald-500"
            >
              <img
                  alt="..."
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80"
                  class="w-full align-middle rounded-t-lg"
              />
              <blockquote class="relative p-8 mb-4">
                <svg
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 583 95"
                    class="absolute left-0 w-full block h-95-px -top-94-px"
                >
                  <polygon
                      points="-30,95 583,95 583,65"
                      class="text-emerald-500 fill-current"
                  ></polygon>
                </svg>
                <h4 class="text-xl font-bold text-white">
                  让文献管理更轻松
                </h4>
                <p class="text-md font-light mt-2 text-white">
                  四大核心功能，帮助您更好地进行文献学习，记录自己的学习足迹，并与他人共享自己的知识信息！
                </p>
              </blockquote>
            </div>
          </div>

          <div class="w-full md:w-6/12 px-4">
            <div class="flex flex-wrap">
              <div class="w-full md:w-6/12 px-4">
                <div class="relative flex flex-col mt-4">
                  <div class="px-4 py-5 flex-auto">
                    <div
                        class="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-white"
                    >
                      <i class="fas fa-sitemap"></i>
                    </div>
                    <h6 class="text-xl mb-1 font-semibold">
                      组织协作
                    </h6>
                    <p class="mb-4 text-blueGray-500">
                      创建并管理小组，分享自己阅读的文献，共享知识信息。
                    </p>
                  </div>
                </div>
                <div class="relative flex flex-col min-w-0">
                  <div class="px-4 py-5 flex-auto">
                    <div
                        class="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-white"
                    >
                      <i class="fas fa-drafting-compass"></i>
                    </div>
                    <h6 class="text-xl mb-1 font-semibold">
                      Markdown笔记
                    </h6>
                    <p class="mb-4 text-blueGray-500">
                      适配功能丰富的markdown编辑器，支持latex公式，支持您时刻记录下自己的思考。
                    </p>
                  </div>
                </div>
              </div>
              <div class="w-full md:w-6/12 px-4">
                <div class="relative flex flex-col min-w-0 mt-4">
                  <div class="px-4 py-5 flex-auto">
                    <div
                        class="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-white"
                    >
                      <i class="fas fa-newspaper"></i>
                    </div>
                    <h6 class="text-xl mb-1 font-semibold">知识库</h6>
                    <p class="mb-4 text-blueGray-500">
                      平台自主构建知识库，帮助您更快找到自己的文献材料。
                    </p>
                  </div>
                </div>
                <div class="relative flex flex-col min-w-0">
                  <div class="px-4 py-5 flex-auto">
                    <div
                        class="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-white"
                    >
                      <i class="fas fa-file-alt"></i>
                    </div>
                    <h6 class="text-xl mb-1 font-semibold">
                      文献管理
                    </h6>
                    <p class="mb-4 text-blueGray-500">
                      文件系统架构，帮助您更好地分类管理文献与笔记，支持知识图谱，将您的知识足迹可视化。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="justify-center text-center flex flex-wrap mt-24">
        <div class="w-full md:w-6/12 px-12 md:px-4">
          <h2 class="font-semibold text-4xl">项目功能展示</h2>
          <p class="text-lg leading-relaxed mt-4 mb-4 text-blueGray-500">
            JieNote 提供一站式文献学习解决方案，集文献管理、智能批注、协作共享于一体。通过多维分类标签系统和可视化知识图谱，助您轻松构建个人知识体系；内置强大的Markdown编辑器支持LaTeX公式，让学术笔记专业美观；团队协作功能实现文献与笔记的实时共享，促进科研思想的碰撞；智能知识库自动解析文献内容，为您推荐关联资料，让知识发现更高效。
          </p>
        </div>
      </div>
    </section>

    <section class="block relative z-1 bg-blueGray-600">
      <div class="container mx-auto">
        <div class="justify-center flex flex-wrap">
          <div class="w-full lg:w-12/12 px-4 -mt-24">
            <div class="flex flex-wrap">
              <div class="w-full lg:w-4/12 px-4">
                <h5 class="text-xl font-semibold pb-4 text-center">
                  文献管理
                </h5>
                <div
                    class="hover:-mt-4 relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg ease-linear transition-all duration-150"
                >
                  <img
                      alt="..."
                      class="align-middle border-none max-w-full h-auto rounded-lg"
                      :src="login"
                  />
                </div>
              </div>

              <div class="w-full lg:w-4/12 px-4">
                <h5 class="text-xl font-semibold pb-4 text-center">
                  组织协作
                </h5>
                <div
                    class="hover:-mt-4 relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg ease-linear transition-all duration-150"
                >
                  <img
                      alt="..."
                      class="align-middle border-none max-w-full h-auto rounded-lg"
                      :src="profile"
                  />
                </div>
              </div>

              <div class="w-full lg:w-4/12 px-4">
                <h5 class="text-xl font-semibold pb-4 text-center">
                  文献阅读
                </h5>
                <div
                    class="hover:-mt-4 relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg ease-linear transition-all duration-150"
                >
                  <img
                      alt="..."
                      class="align-middle border-none max-w-full h-auto rounded-lg"
                      :src="landing"
                  />
                </div>
              </div>

              <div class="w-full lg:w-4/12 px-4">
                <h5 class="text-xl font-semibold pb-4 text-center">
                  知识库
                </h5>
                <div
                    class="hover:-mt-4 relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg ease-linear transition-all duration-150"
                >
                  <img
                      alt="..."
                      class="align-middle border-none max-w-full h-auto rounded-lg"
                      :src="login"
                  />
                </div>
              </div>

              <div class="w-full lg:w-4/12 px-4">
                <h5 class="text-xl font-semibold pb-4 text-center">
                  Markdown笔记
                </h5>
                <div
                    class="hover:-mt-4 relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg ease-linear transition-all duration-150"
                >
                  <img
                      alt="..."
                      class="align-middle border-none max-w-full h-auto rounded-lg"
                      :src="landing"
                  />
                </div>
              </div>

              <div class="w-full lg:w-4/12 px-4">
                <h5 class="text-xl font-semibold pb-4 text-center">
                  个人主页
                </h5>
                <div
                    class="hover:-mt-4 relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg ease-linear transition-all duration-150"
                >
                  <img
                      alt="..."
                      class="align-middle border-none max-w-full h-auto rounded-lg"
                      :src="profile"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-blueGray-600 overflow-hidden">
      <div class="container mx-auto pb-64">
        <div class="flex flex-wrap justify-center">
          <div class="w-full md:w-5/12 px-12 md:px-4 ml-auto mr-auto md:mt-64">
            <div
                class="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white"
            >
              <i class="fas fa-code-branch text-xl"></i>
            </div>
            <h3 class="text-3xl mb-2 font-semibold leading-normal text-white">
              开源软件
            </h3>
            <p
                class="text-lg font-light leading-relaxed mt-4 mb-4 text-blueGray-400"
            >
              作为完全开放的开源项目，JieNote秉承学术共享精神构建，核心代码已在
              <a
                  href="https://github.com/BUAA-SE-coders007"
                  class="text-blueGray-200 hover:text-emerald-400 font-medium transition-colors duration-150"
                  target="_blank"
                  rel="noopener"
              >
                GitHub
              </a>
              开放。我们诚挚邀请开发者共同完善这个学术工具，也欢迎研究人员基于此构建个性化文献管理系统，让知识管理技术在实践中持续进化。
            </p>
            <p
                class="text-lg font-light leading-relaxed mt-0 mb-4 text-blueGray-400"
            >
              如果喜欢，请给我们一个免费的Star!
            </p>
            <a
                href="https://github.com/BUAA-SE-coders007"
                target="_blank"
                class="github-star mt-4 inline-block text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-blueGray-700 active:bg-blueGray-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
            >
              Github Star
            </a>
          </div>

          <div class="w-full md:w-4/12 px-4 mr-auto ml-auto mt-32 relative">
            <i
                class="fab fa-github text-blueGray-700 text-55 absolute -top-150-px -right-100 left-auto opacity-80"
            ></i>
          </div>
        </div>
      </div>
    </section>

    <section class="pb-16 bg-blueGray-200 relative pt-32">
      <div
          class="-mt-20 top-0 bottom-auto left-0 right-0 w-full absolute h-20"
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

      <div class="container mx-auto">
        <div
            class="flex flex-wrap justify-center bg-white shadow-xl rounded-lg -mt-64 py-16 px-12 relative z-10"
        >
          <div class="w-full text-center lg:w-8/12">
            <p class="text-4xl text-center">
              <span role="img" aria-label="love">
                😍
              </span>
            </p>
            <h3 class="font-semibold text-3xl">
              想拥有属于自己的文献管理系统吗？
            </h3>
            <p class="text-blueGray-500 text-lg leading-relaxed mt-4 mb-4">
              JieNote已为您准备好开箱即用的解决方案！点击下方按钮访问GitHub仓库，立即获取完整开源代码。无论是构建个人知识库，还是为研究团队打造协作平台，从这里开启您的知识管理新体验。
            </p>
            <div class="sm:block flex flex-col mt-10">
              <a
                  href="https://github.com/BUAA-SE-coders007"
                  target="_blank"
                  class="github-star sm:ml-1 text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-blueGray-700 active:bg-blueGray-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
              >
                <i class="fab fa-github text-lg mr-1"></i>
                <span>开始访问</span>
              </a>
            </div>
            <div class="text-center mt-16"></div>
          </div>
        </div>
      </div>
    </section>
    <footer-component />
  </div>
</template>
<script>
import axios from "axios"; // 引入 axios
// import IndexNavbar from "@/components/Navbars/IndexNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";

import patternVue from "@/assets/img/logo4.png";
import componentBtn from "@/assets/img/component-btn.png";
import componentProfileCard from "@/assets/img/component-profile-card.png";
import componentInfoCard from "@/assets/img/component-info-card.png";
import componentInfo2 from "@/assets/img/component-info-2.png";
import componentMenu from "@/assets/img/component-menu.png";
import componentBtnPink from "@/assets/img/component-btn-pink.png";
import documentation from "@/assets/img/documentation.png";
import login from "@/assets/img/login.jpg";
import profile from "@/assets/img/profile.jpg";
import landing from "@/assets/img/landing.jpg";
import BarChart from "@/components/Cards/BarChart.vue";
export default {
  data() {
    return {
      patternVue,
      componentBtn,
      componentProfileCard,
      componentInfoCard,
      componentInfo2,
      componentMenu,
      componentBtnPink,
      documentation,
      login,
      profile,
      landing,
      tableData: {
        labels: ["6天前", "5天前", "4天前", "3天前", "2天前", "昨天", "今天"],
        datasets: [{
          label: "文献数量",
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          data: [],
          tension: 0.3
        },
        {
          label: "笔记数量",
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          data: [],
          tension: 0.3
        }
        ]
      }
    };
  },
  components: {
    // IndexNavbar,
    FooterComponent,
    BarChart
  },
  mounted() {
    // 获取文献数量数据
    axios
      .get("https://jienote.top/public/articleStatistic")
      .then((response) => {
        const articles = response.data.articles;
        const articleData = this.formatData(articles);
        this.tableData.datasets[0].data = articleData;
      })
      .catch((error) => {
        console.error("获取文献数据失败:", error);
      });

    // 获取笔记数量数据
    axios
      .get("https://jienote.top/public/recent")
      .then((response) => {
        const notes = response.data.notes;
        const noteData = this.formatData(notes);
        this.tableData.datasets[1].data = noteData;
      })
      .catch((error) => {
        console.error("获取笔记数据失败:", error);
      });
  },
  methods: {
    // 格式化数据，填充缺失日期
    formatData(data) {
      const result = Array(7).fill(0); // 初始化7天的数据为0
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (6 - i)); // 计算每一天的日期
        const dateString = date.toISOString().split("T")[0]; // 格式化为 YYYY-MM-DD
        const item = data.find((d) => d.date === dateString);
        if (item) {
          result[i] = item.count;
        }
      }
      return result;
    },
  },
};
</script>
