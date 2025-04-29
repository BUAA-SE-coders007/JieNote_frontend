<template>
  <div class="note-page flex flex-col h-screen">
    <!-- 顶部导航栏 -->
    <nav class="relative flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-emerald-500">
      <div class="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div class="w-full relative flex justify-between lg:w-auto px-4 lg:static lg:block lg:justify-start">
          <a class="text-lg font-bold leading-relaxed inline-block mr-4 py-2 whitespace-no-wrap uppercase text-white" href="javascript:;">
            笔记编辑
          </a>
        </div>
        <div class="lg:flex flex-grow items-center">
          <ul class="flex flex-col lg:flex-row list-none ml-auto">
            <li class="nav-item">
              <a class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                 href="javascript:;"
                 @click="handleSave">
                <i class="fas fa-save text-lg leading-lg text-white opacity-75"></i>
                <span class="ml-2">保存</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                 href="javascript:;"
                 @click="handleBack">
                <i class="fas fa-arrow-left text-lg leading-lg text-white opacity-75"></i>
                <span class="ml-2">返回</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <!-- 编辑器主体 -->
    <div class="note-container flex-1">
      <CustomMdEditor
        v-model="noteContent"
        :noteId="$route.params.note_id"
        :autoSave="true"
        :autoFocus="true"
        :fullHeight="true"
        :hideToolbar="true"
        @save="updateNote"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from "vue";
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
    const { proxy } = getCurrentInstance();

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
        const noteId = proxy.$route.params.note_id;
        await axios.put(`http://localhost:8000/notes/${noteId}`, {
          content,
        });
        proxy.$message.success("笔记已更新");
      } catch (e) {
        proxy.$message.error("更新失败");
        console.error(e);
      }
    };

    const handleSave = () => {
      updateNote(noteContent.value);
    };

    const handleBack = () => {
      proxy.$router.back();
    };

    onMounted(() => {
      isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      const noteId = window.location.pathname.split("/").pop();
      if (noteId) {
        fetchNote(noteId);
      } else {
        noteContent.value = defaultText;
      }
      if (!noteContent.value.trim()) {
        noteContent.value = defaultText;
      }
    });

    return {
      noteContent,
      isMobile,
      updateNote,
      handleSave,
      handleBack
    };
  },
};
</script>

<style scoped>
.note-container {
  width: 100%;
  height: calc(100vh - 60px); /* 减去顶部导航栏的高度 */
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
