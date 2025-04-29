<template>
  <div class="bg-blue-100 min-h-screen"> <!-- 将背景色改为统一的浅蓝色 -->
    <index-navbar />
    <section class="header relative pt-16 items-center flex h-auto max-h-860-px">
      <div class="container mx-auto items-center flex flex-wrap">
        <div class="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
          <div class="pt-16 sm:pt-0">
            <h2 class="font-semibold text-4xl text-blueGray-600">
              项目介绍
            </h2>
            <p class="mt-4 text-lg leading-relaxed text-blueGray-500">
              本页面展示了我们网站的使用情况，包括近7天内新增的文献和笔记数量。
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-12 md:mt-8 pb-40 relative">
      <div class="container mx-auto">
        <div class="flex flex-wrap">
          <div class="w-full md:w-6/12 px-4">
            <h3 class="text-xl font-semibold text-blueGray-600 mb-4">
              文献新增数量
            </h3>
            <bar-chart
              :chart-data="literatureData"
              :gradient-colors="['rgba(76, 175, 80, 0.4)', 'rgba(76, 175, 80, 0)']"
            />
          </div>
          <div class="w-full md:w-6/12 px-4">
            <h3 class="text-xl font-semibold text-blueGray-600 mb-4">
              笔记新增数量
            </h3>
            <bar-chart
              :chart-data="notesData"
              :gradient-colors="['rgba(33, 150, 243, 0.4)', 'rgba(33, 150, 243, 0)']"
            />
          </div>
        </div>
      </div>
    </section>

    <footer-component />
  </div>
</template>

<script>
import IndexNavbar from "@/components/Navbars/IndexNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";
import BarChart from "@/components/Cards/BarChart.vue";

export default {
  data() {
    return {
      literatureData: {
        labels: ["6天前", "5天前", "4天前", "3天前", "2天前", "昨天", "今天"],
        datasets: [
          {
            label: "文献新增数量",
            borderColor: "#4CAF50", // 绿色边框
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
            data: [3, 5, 7, 8, 6, 10, 12], // 假数据
            fill: true,
          },
        ],
      },
    };
  },
  components: {
    IndexNavbar,
    FooterComponent,
    BarChart,
  },
};
</script>