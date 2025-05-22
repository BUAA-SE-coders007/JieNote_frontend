<template>
  <div>
    <navbar />
    <main>
      <div
        class="relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen-75"
      >
        <div
          class="absolute top-0 w-full h-full bg-center bg-cover"
          :style="{ backgroundImage: 'url(' + logo + ')' }"
        >
          <span
            id="blackOverlay"
            class="w-full h-full absolute opacity-75 bg-black"
          ></span>
        </div>
        <div class="container relative mx-auto">
          <div class="items-center flex flex-wrap">
            <div class="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
              <div class="pr-12">
                <h1 class="text-white font-semibold text-5xl">
                  Coders007团队主页
                </h1>
                <p class="mt-4 text-lg text-blueGray-200">
                  这里是2025春季敏捷软件工程课程Coders007团队主页，感谢支持JieNote项目！
                </p>
              </div>
            </div>
          </div>
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
      </div>

      <section class="pb-20 bg-blueGray-200 -mt-24">
        <div class="container mx-auto px-4">
          <div class="flex flex-wrap">
            <div class="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
              <div
                class="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg"
              >
                <div class="px-4 py-5 flex-auto">
                  <div
                    class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400"
                  >
                    <i class="fas fa-award"></i>
                  </div>
                  <h6 class="text-xl font-semibold">JieNote项目介绍</h6>
                  <p class="mt-2 mb-4 text-blueGray-500">
                    JieNote是一款集成文献管理与笔记管理的在线学习网站，后续功能还在不断更新中......
                  </p>
                </div>
              </div>
            </div>

            <div class="w-full md:w-4/12 px-4 text-center">
              <div
                class="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg"
              >
                <div class="px-4 py-5 flex-auto">
                  <div
                    class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-lightBlue-400"
                  >
                    <i class="fas fa-retweet"></i>
                  </div>
                  <h6 class="text-xl font-semibold">开源精神</h6>
                  <p class="mt-2 mb-4 text-blueGray-500">
                    JieNote项目的源代码开源在
                    <a
                      href="https://github.com/BUAA-SE-coders007"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-500 underline hover:text-blue-700"
                    >GitHub平台</a>，支持二次开发
                  </p>
                </div>
              </div>
            </div>

            <div class="pt-6 w-full md:w-4/12 px-4 text-center">
              <div
                class="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg"
              >
                <div class="px-4 py-5 flex-auto">
                  <div
                    class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-emerald-400"
                  >
                    <i class="fas fa-fingerprint"></i>
                  </div>
                  <h6 class="text-xl font-semibold">专业团队</h6>
                  <p class="mt-2 mb-4 text-blueGray-500">
                    八人开发团队，具有扎实的编程基础和良好的团队协作能力，深谙敏捷软工之道
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="relative py-20">
        <div
          class="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20 h-20"
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
              class="text-white fill-current"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>
      </section>

      <section class="pt-20 pb-48">
        <div class="container mx-auto px-4">
          <div class="flex flex-wrap justify-center text-center mb-24">
            <div class="w-full lg:w-6/12 px-4">
              <h2 class="text-4xl font-semibold">团队成员介绍</h2>
              <p class="text-lg leading-relaxed m-4 text-blueGray-500">
                软件工程没有银弹
              </p>
            </div>
          </div>
          <div class="flex flex-wrap">
            <div class="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
              <div class="px-6">
                <img
                  alt="..."
                  :src="dqr"
                  class="shadow-lg rounded-full mx-auto max-w-120-px"
                />
                <div class="pt-6 text-center">
                  <h5 class="text-xl font-bold">杜启嵘</h5>
                  <p
                    class="mt-1 text-sm text-blueGray-400 uppercase font-semibold"
                  >
                    项目经理/运维
                  </p>
                  <div class="mt-6">
                    <a
                      href="https://github.com/coder0xe"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="bg-lightBlue-400 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1 inline-flex items-center justify-center"
                      title="查看GitHub"
                    >
                      <i class="fab fa-github"></i>
                    </a>
                  </div>
                    <p class="mt-2 text-blueGray-500 text-sm border-l-4 border-lightBlue-400 pl-3 italic flex items-center">
                      <span>
                        <i class="fas fa-quote-left mr-1 text-lightBlue-400"></i>
                        不会web开发的运维躺平人
                        <i class="fas fa-quote-right ml-1 text-lightBlue-400"></i>
                      </span>
                    </p>
                </div>
              </div>
            </div>
            <div class="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
              <div class="px-6">
                <img
                  alt="..."
                  :src="gyr"
                  class="shadow-lg rounded-full mx-auto max-w-120-px"
                />
                <div class="pt-6 text-center">
                  <h5 class="text-xl font-bold">高悠然</h5>
                  <p
                    class="mt-1 text-sm text-blueGray-400 uppercase font-semibold"
                  >
                    前端开发
                  </p>
                  <div class="mt-6">
                    <a
                      href="https://github.com/gaoxiaomo"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="bg-lightBlue-400 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1 inline-flex items-center justify-center"
                      title="查看GitHub"
                    >
                      <i class="fab fa-github"></i>
                    </a>
                  </div>
                    <p class="mt-2 text-blueGray-500 text-sm border-l-4 border-lightBlue-400 pl-3 italic flex items-center">
                      <span>
                        <i class="fas fa-quote-left mr-1 text-lightBlue-400"></i>
                        这个人很懒，什么都没有留下
                        <i class="fas fa-quote-right ml-1 text-lightBlue-400"></i>
                      </span>
                    </p>
                </div>
              </div>
            </div>
            <div class="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
              <div class="px-6">
                <img
                  alt="..."
                  :src="lgq"
                  class="shadow-lg rounded-full mx-auto max-w-120-px"
                />
                <div class="pt-6 text-center">
                  <h5 class="text-xl font-bold">李国庆</h5>
                  <p
                    class="mt-1 text-sm text-blueGray-400 uppercase font-semibold"
                  >
                    后端开发
                  </p>
                  <div class="mt-6">
                    <a
                      href="https://github.com/Fantasylee21"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="bg-lightBlue-400 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1 inline-flex items-center justify-center"
                      title="查看GitHub"
                    >
                      <i class="fab fa-github"></i>
                    </a>
                  </div>
                    <p class="mt-2 text-blueGray-500 text-sm border-l-4 border-lightBlue-400 pl-3 italic flex items-center">
                      <span>
                        <i class="fas fa-quote-left mr-1 text-lightBlue-400"></i>
                        软工没有通天路，我是sl你记住
                        <i class="fas fa-quote-right ml-1 text-lightBlue-400"></i>
                      </span>
                    </p>
                </div>
              </div>
            </div>
            <div class="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
              <div class="px-6">
                <img
                  alt="..."
                  :src="ykq"
                  class="shadow-lg rounded-full mx-auto max-w-120-px"
                />
                <div class="pt-6 text-center">
                  <h5 class="text-xl font-bold">杨可清</h5>
                  <p
                    class="mt-1 text-sm text-blueGray-400 uppercase font-semibold"
                  >
                    测试
                  </p>
                  <div class="mt-6">
                    <a
                      href="https://github.com/thestormtree"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="bg-lightBlue-400 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1 inline-flex items-center justify-center"
                      title="查看GitHub"
                    >
                      <i class="fab fa-github"></i>
                    </a>
                  </div>
                    <p class="mt-2 text-blueGray-500 text-sm border-l-4 border-lightBlue-400 pl-3 italic flex items-center">
                      <span>
                        <i class="fas fa-quote-left mr-1 text-lightBlue-400"></i>
                        如果遇到了bug和困难，微笑着面对它，等待并心怀希望——这只猴子正在写《莎士比亚全集》，等它编写正确的程序需要的时间需要很久
                        <i class="fas fa-quote-right ml-1 text-lightBlue-400"></i>
                      </span>
                    </p>
                </div>
              </div>
            </div>

            <div class="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
              <div class="px-6">
                <img
                  alt="..."
                  :src="st"
                  class="shadow-lg rounded-full mx-auto max-w-120-px"
                />
                <div class="pt-6 text-center">
                  <h5 class="text-xl font-bold">石通</h5>
                  <p
                    class="mt-1 text-sm text-blueGray-400 uppercase font-semibold"
                  >
                    前端开发
                  </p>
                  <div class="mt-6">
                    <a
                      href="https://github.com/dongfengwuyishi"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="bg-lightBlue-400 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1 inline-flex items-center justify-center"
                      title="查看GitHub"
                    >
                      <i class="fab fa-github"></i>
                    </a>
                  </div>
                    <p class="mt-2 text-blueGray-500 text-sm border-l-4 border-lightBlue-400 pl-3 italic flex items-center">
                      <span>
                        <i class="fas fa-quote-left mr-1 text-lightBlue-400"></i>
                        累了就休息一会儿~
                        <i class="fas fa-quote-right ml-1 text-lightBlue-400"></i>
                      </span>
                    </p>
                </div>
              </div>
            </div>

            <div class="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
              <div class="px-6">
                <img
                  alt="..."
                  :src="hxr"
                  class="shadow-lg rounded-full mx-auto max-w-120-px"
                />
                <div class="pt-6 text-center">
                  <h5 class="text-xl font-bold">韩昕睿</h5>
                  <p
                    class="mt-1 text-sm text-blueGray-400 uppercase font-semibold"
                  >
                    后端开发
                  </p>
                  <div class="mt-6">
                    <a
                      href="https://github.com/Xian-Yu0"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="bg-lightBlue-400 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1 inline-flex items-center justify-center"
                      title="查看GitHub"
                    >
                      <i class="fab fa-github"></i>
                    </a>
                  </div>
                    <p class="mt-2 text-blueGray-500 text-sm border-l-4 border-lightBlue-400 pl-3 italic flex items-center">
                      <span>
                        <i class="fas fa-quote-left mr-1 text-lightBlue-400"></i>
                        负者歌于途
                        <i class="fas fa-quote-right ml-1 text-lightBlue-400"></i>
                      </span>
                    </p>
                </div>
              </div>
            </div>

            
            <div class="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
              <div class="px-6">
                <img
                  alt="..."
                  :src="zzw"
                  class="shadow-lg rounded-full mx-auto max-w-120-px"
                />
                <div class="pt-6 text-center">
                  <h5 class="text-xl font-bold">赵泽文</h5>
                  <p
                    class="mt-1 text-sm text-blueGray-400 uppercase font-semibold"
                  >
                    前端开发
                  </p>
                  <div class="mt-6">
                    <a
                      href="https://github.com/Zevan770"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="bg-lightBlue-400 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1 inline-flex items-center justify-center"
                      title="查看GitHub"
                    >
                      <i class="fab fa-github"></i>
                    </a>
                  </div>
                    <p class="mt-2 text-blueGray-500 text-sm border-l-4 border-lightBlue-400 pl-3 italic flex items-center">
                      <span>
                        <i class="fas fa-quote-left mr-1 text-lightBlue-400"></i>
                        神秘的第八个人——770
                        <i class="fas fa-quote-right ml-1 text-lightBlue-400"></i>
                      </span>
                    </p>
                </div>
              </div>
            </div>

                        <div class="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
              <div class="px-6">
                <img
                  alt="..."
                  :src="tpx"
                  class="shadow-lg rounded-full mx-auto max-w-120-px"
                />
                <div class="pt-6 text-center">
                  <h5 class="text-xl font-bold">田培瑄</h5>
                  <p
                    class="mt-1 text-sm text-blueGray-400 uppercase font-semibold"
                  >
                    前端开发
                  </p>
                  <div class="mt-6">
                    <a
                      href="https://github.com/tpxuan"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="bg-lightBlue-400 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1 inline-flex items-center justify-center"
                      title="查看GitHub"
                    >
                      <i class="fab fa-github"></i>
                    </a>
                  </div>
                    <p class="mt-2 text-blueGray-500 text-sm border-l-4 border-lightBlue-400 pl-3 italic flex items-center">
                      <span>
                        <i class="fas fa-quote-left mr-1 text-lightBlue-400"></i>
                        我是一个软件工程师，专门用代码解决不存在的问题，顺便把简单的问题复杂化，最后再用一个注释‘// TODO: 以后修复’来掩盖一切。
                        <i class="fas fa-quote-right ml-1 text-lightBlue-400"></i>
                      </span>
                    </p>
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

import dqr from "@/assets/img/dqr.jpg";
import gyr from "@/assets/img/gyr.jpg";
import lgq from "@/assets/img/lgq.jpg";
import ykq from "@/assets/img/ykq.jpg";
import st from "@/assets/img/st.jpg";
import zzw from "@/assets/img/zzw.jpg";
import tpx from "@/assets/img/tpx.jpg";
import hxr from "@/assets/img/hxr.jpg"

import logo from "@/assets/img/logo4.png";
export default {
  data() {
    return {
      dqr,      
      logo,
      gyr,
      lgq,
      ykq,
      st,
      zzw,
      tpx,
      hxr,
    };
  },
  components: {
    Navbar,
    FooterComponent,
  },
};
</script>
