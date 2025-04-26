<template>
  <div>
    <CustomMdEditor
      v-model="noteContent"
      :noteId="$route.params.note_id"
      :autoSave="true"
      :autoFocus="true"
      :height="600"
      :hideToolbar="true"
      @save="updateNote"
    />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import CustomMdEditor from "@/components/Editor/MdEditor.vue";
import defaultText from "@/components/Editor/config/defaultText";

export default {
  components: {
    CustomMdEditor
  },
  setup() {
    const noteContent = ref("");
    const isMobile = ref(false);
    
    const fetchNote = async (noteId) => {
      try {
        const response = await axios.get(`http://localhost:8000/notes/${noteId}`);
        noteContent.value = response.data.content;
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };

    const updateNote = async (content) => {
      try {
        const noteId = this.$route.params.note_id;
        await axios.put(`http://localhost:8000/notes/${noteId}`, {
          content,
        });
        this.$message.success("笔记已更新");
      } catch (e) {
        this.$message.error("更新失败");
        console.error(e);
      }
    };

    onMounted(() => {
      // 检测是否为移动设备
      isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      
      // 获取路由参数中的笔记ID
      const noteId = window.location.pathname.split("/").pop();
      if (noteId) {
        fetchNote(noteId);
      } else {
        // 如果没有笔记ID，则使用默认文本
        noteContent.value = defaultText;
      }
      
      // 设置默认文本
      if (!noteContent.value.trim()) {
        noteContent.value = defaultText;
      }
    });

    return {
      noteContent,
      isMobile,
      updateNote
    };
  },
};
</script>

<style scoped>
/* 添加页面样式 */
</style>
