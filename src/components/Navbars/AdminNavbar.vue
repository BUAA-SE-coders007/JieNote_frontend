<template>
  <!-- Navbar -->
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex-1 flex items-center">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-xl font-bold text-gray-800">JieNote</h1>
          </div>
          
          <!-- Search Bar -->
          <div class="flex-1 max-w-2xl ml-8">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                v-model="searchQuery"
                @input="handleSearch"
                placeholder="搜索文献、笔记..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <!-- Right side buttons -->
        <div class="flex items-center">
          <button
            @click="showNewItemModal = true"
            class="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <i class="fas fa-plus mr-2"></i>
            新建
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "AdminNavbar",
  data() {
    return {
      searchQuery: "",
      showNewItemModal: false,
    };
  },
  methods: {
    handleSearch() {
      // 触发搜索事件，将搜索关键词传递给父组件
      this.$emit('search', this.searchQuery);
    },
  },
};
</script>
