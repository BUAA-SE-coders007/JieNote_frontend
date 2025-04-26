<template>
  <div>
    <el-button
      type="primary"
      style="position: absolute; top: 16px; left: 16px; z-index: 10"
      @click="$router.push('/admin/dashboard')"
      circle
    >
      <el-icon><Back /></el-icon>
    </el-button>
    <el-row style="height: 100vh">
      <!-- 左边 PDF 区 -->
      <el-col :span="12" style="height: 100vh; border-right: 1px solid #e5e7eb">
        <!-- PDF 区内容留空 -->
      </el-col>
      <!-- 右边笔记区 -->
      <el-col :span="12" style="height: 100vh; position: relative">
        <router-view />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Back } from '@element-plus/icons-vue'
export default {
  name: "NoteLayout",
  components: { Back }
};
</script>

<style scoped>
/* 可根据需要自定义样式 */
</style>
