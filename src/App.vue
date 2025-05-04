<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>


<script>
export default {
  mounted() {
    document.title = "JieNote"
  }
}
</script>


<style>
/* App.vue 或全局 CSS 文件中加入 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>