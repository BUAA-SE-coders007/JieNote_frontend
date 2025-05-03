<template>
  <div
      class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16"
  >
    <div class="px-6">
      <div class="flex flex-wrap justify-center">
        <div class="w-full px-4 flex justify-center">
          <div class="relative">
            <img
                alt="Profile"
                :src="userData.avatar"
                class="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
            />
          </div>
        </div>
        <div class="w-full px-4 text-center mt-20">
          <div class="flex justify-center py-4 lg:pt-4 pt-8">
            <div class="mr-4 p-3 text-center">
              <span
                  class="text-xl font-bold block uppercase tracking-wide text-blueGray-600"
              >
                {{ userData.articleCount }}
              </span>
              <span class="text-sm text-blueGray-400">文献</span>
            </div>
            <div class="mr-4 p-3 text-center">
              <span
                  class="text-xl font-bold block uppercase tracking-wide text-blueGray-600"
              >
                {{ userData.noteCount }}
              </span>
              <span class="text-sm text-blueGray-400">笔记</span>
            </div>
            <div class="lg:mr-4 p-3 text-center">
              <span
                  class="text-xl font-bold block uppercase tracking-wide text-blueGray-600"
              >
                {{ userData.organizationCount }}
              </span>
              <span class="text-sm text-blueGray-400">组织</span>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-12">
        <h3
            class="text-xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2"
        >
          {{ userData.username }}
        </h3>
        <div
            class="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase"
        >
          <i class="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
          {{ userData.address }}
        </div>
        <div class="mb-2 text-blueGray-600">
          <i class="fas fa-university mr-2 text-lg text-blueGray-400"></i>
          {{ userData.university }}
        </div>
      </div>
      <div class="mt-10 py-10 border-t border-blueGray-200 text-center">
        <div class="flex flex-wrap justify-center">
          <div class="w-full lg:w-9/12 px-4">
            <p class="mb-4 text-lg leading-relaxed text-blueGray-700">
              {{ userData.introduction }}
            </p>
            <a href="javascript:void(0);" class="font-normal text-emerald-500">
              Show more
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userData: {
      type: Object,
      required: true,
      default: () => ({
        articleCount: 0, // 文献数量
        noteCount: 0, // 笔记数量
        organizationCount: 0, // 组织数量
        username: "Jenna Stones",
        address: "Los Angeles, California",
        university: "University of Computer Science",
        introduction: "An artist of considerable range...",
        avatar: require("@/assets/img/team-2-800x800.jpg")
      })
    }
  }
};
</script>