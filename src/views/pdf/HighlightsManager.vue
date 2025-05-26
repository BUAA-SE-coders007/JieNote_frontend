<template>
  <div class="highlights-manager">
    <h2 class="title">高亮记录管理</h2>

    <button class="btn" @click="loadHighlights">刷新列表</button>
    <button class="btn danger" @click="clearAllHighlights">清空所有高亮</button>

    <ul v-if="highlights.length" class="highlight-list">
      <li v-for="item in highlights" :key="item.id" class="highlight-item">
        <span>📌 页码: {{ item.page }} ｜ 内容: "{{ item.text }}"</span>
        <div class="actions">
          <button class="btn small" @click="$emit('jumpToPage', item.page)">跳转</button>
          <button class="btn small danger" @click="deleteHighlight(item.id)">删除</button>
        </div>
      </li>
    </ul>

    <p v-else class="empty">暂无高亮记录</p>
  </div>
</template>

<script setup>
/* eslint-disable no-unused-vars */
import { ref, onMounted } from 'vue'
import axios from 'axios'

const highlights = ref([])

const loadHighlights = async () => {
  try {
    const { data } = await axios.get('/api/highlight')
    highlights.value = data
  } catch (error) {
    console.error('加载失败:', error)
  }
}

const deleteHighlight = async (id) => {
  try {
    await axios.delete(`/api/highlight/${id}`)
    highlights.value = highlights.value.filter((h) => h.id !== id)
  } catch (error) {
    console.error('删除失败:', error)
  }
}

const clearAllHighlights = async () => {
  try {
    await axios.delete('/api/highlight')
    highlights.value = []
  } catch (error) {
    console.error('清空失败:', error)
  }
}

onMounted(() => {
  loadHighlights()
})
</script>

<style scoped>
.highlights-manager {
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  margin-top: 20px;
}

.title {
  font-size: 18px;
  margin-bottom: 12px;
}

.highlight-list {
  list-style: none;
  padding: 0;
}

.highlight-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 4px 8px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn.small {
  font-size: 12px;
  padding: 2px 6px;
}

.btn.danger {
  background: #f56c6c;
}

.empty {
  color: #888;
  margin-top: 10px;
}
</style>
