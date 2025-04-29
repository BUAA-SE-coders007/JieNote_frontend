<template>
  <div
    class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
  >
    <div class="p-4 flex-auto">
      <div class="relative h-350-px">
        <canvas ref="lineChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from "chart.js";

export default {
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    gradientColors: {
      type: Array,
      required: true, // 接收渐变颜色数组
    },
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      const ctx = this.$refs.lineChart.getContext("2d");

      // 创建渐变背景色
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, this.gradientColors[0]); // 渐变起始颜色
      gradient.addColorStop(1, this.gradientColors[1]); // 渐变结束颜色

      // 更新数据的背景色为渐变色
      const updatedData = JSON.parse(JSON.stringify(this.chartData)); // 深拷贝数据
      updatedData.datasets.forEach((dataset) => {
        dataset.backgroundColor = gradient; // 设置折线与横坐标之间区域的颜色
        dataset.borderColor = dataset.borderColor || "#4CAF50"; // 设置折线颜色
        dataset.borderWidth = 2; // 设置折线宽度
        dataset.pointBackgroundColor = dataset.pointBackgroundColor || "#4CAF50"; // 设置点的颜色
        dataset.pointBorderColor = "#fff"; // 设置点的边框颜色
        dataset.pointHoverBackgroundColor = "#fff"; // 设置点悬停时的背景色
        dataset.pointHoverBorderColor = dataset.borderColor || "#4CAF50"; // 设置点悬停时的边框颜色
      });

      new Chart(ctx, {
        type: "line", // 折线图
        data: updatedData,
        options: {
          maintainAspectRatio: false,
          responsive: true,
          tooltips: {
            mode: "index",
            intersect: false,
            backgroundColor: "rgba(0, 0, 0, 0.7)", // 半透明提示框背景
            titleFontColor: "#fff", // 提示框标题字体颜色
            bodyFontColor: "#fff", // 提示框内容字体颜色
            borderColor: "#4CAF50", // 提示框边框颜色
            borderWidth: 1, // 提示框边框宽度
          },
          hover: {
            mode: "nearest",
            intersect: true,
          },
          legend: {
            labels: {
              fontColor: "rgba(0,0,0,.6)",
              fontSize: 12,
            },
            align: "end",
            position: "bottom",
          },
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: "日期",
                  fontColor: "rgba(0,0,0,.6)",
                },
                gridLines: {
                  borderDash: [2],
                  borderDashOffset: [2],
                  color: "rgba(33, 37, 41, 0.2)",
                  zeroLineColor: "rgba(33, 37, 41, 0.2)",
                },
              },
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: "新增数量",
                  fontColor: "rgba(0,0,0,.6)",
                },
                gridLines: {
                  borderDash: [2],
                  borderDashOffset: [2],
                  color: "rgba(33, 37, 41, 0.2)",
                  zeroLineColor: "rgba(33, 37, 41, 0.2)",
                },
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    },
  },
};
</script>

<style scoped>
canvas {
  max-height: 400px;
}
</style>
