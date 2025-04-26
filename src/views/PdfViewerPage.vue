<template>
    <div class="bg-gray-100 min-h-screen">
      <index-navbar />
      <section class="header relative pt-16 items-center flex h-auto max-h-860-px">
        <div class="container mx-auto items-center flex flex-wrap">
          <div class="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
            <div class="pt-16 sm:pt-0">
              <h2 class="font-semibold text-4xl text-blueGray-600">
                PDF 文件查看
              </h2>
              <p class="mt-4 text-lg leading-relaxed text-blueGray-500">
                上传 PDF 文件并在页面中查看内容。
              </p>
            </div>
          </div>
        </div>
      </section>
  
      <section class="mt-12 md:mt-8 pb-40 relative">
        <div class="container mx-auto">
          <div class="flex">
            <!-- 左半部分：PDF 渲染 -->
            <div class="w-1/2 px-4 pdf-preview">
              <h3 class="text-xl font-semibold text-blueGray-600 mb-4">
                PDF 文件
              </h3>
              <div class="border rounded shadow p-4 bg-white h-full">
              <input
                type="file"
                accept="application/pdf"
                @change="handleFileUpload"
                class="mb-4"
            />
            <div v-if="pdfUrl" class="pdf-container">
                <iframe
                :src="pdfUrl"
                 class="w-full h-full border rounded"
                 frameborder="0"
                ></iframe>
            </div>
            <div v-else class="text-gray-500">
                请上传 PDF 文件以进行查看。
            </div>
            </div>
        </div>
        <!-- 右半部分留空 -->
        <div class="w-1/2"></div>
        </div>
     </div>
     </section>
  
      <footer-component />
    </div>
  </template>
  
  <script>
  import IndexNavbar from "@/components/Navbars/IndexNavbar.vue";
  import FooterComponent from "@/components/Footers/Footer.vue";
  
  export default {
    data() {
      return {
        pdfUrl: null, // PDF 文件的 URL
      };
    },
    components: {
      IndexNavbar,
      FooterComponent,
    },
    methods: {
      handleFileUpload(event) {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
          this.pdfUrl = URL.createObjectURL(file); // 将文件转换为 URL
        } else {
          alert("请上传 PDF 文件！");
        }
      },
    },
  };
  </script>
  
  <style>
  .pdf-container {
    height: 100%; /* 占据父容器的全部高度 */
    width: 100%; /* 占据父容器的全部宽度 */
    overflow: auto;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
  }
  
  .pdf-preview {
    height: calc(100vh - 100px); /* 减去顶部导航栏的高度 */
  }
  </style>