<template>
  <div>
    <a
      class="text-blueGray-500 block py-1 px-3"
      ref="btnDropdownRef"
      v-on:click="$emit('click')"
    >
      <i class="fas fa-bell"></i>
    </a>
  </div>
</template>
<script>
export default {
};
</script>
