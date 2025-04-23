<template>
  <div>
    <sidebar />
    <div class="relative md:ml-64 bg-blueGray-100 min-h-screen">
      <router-view />
    </div>
  </div>
</template>
<script>
import Sidebar from "@/components/Sidebar/Sidebar.vue";

export default {
  name: "admin-layout",
  components: {
    Sidebar,
  },
};
</script>
