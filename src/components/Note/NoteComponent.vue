<template>
  <div>
    <div v-loading="isLoading">
      <div id="vditor" class="vditor" />
    </div>
  </div>
</template>

<script>
import Vditor from "vditor";
import axios from "axios";

const defaultText = "##  hello world";

export default {
  name: "NoteComponent",
  data() {
    return {
      isLoading: true,
      isMobile: window.innerWidth <= 960,
      vditor: null,
      updating: false,
    };
  },
  created() {
    this.setDefaultText();
  },
  mounted() {
    this.initVditor();
    this.$nextTick(() => {
      this.isLoading = false;
    });
  },
  methods: {
    initVditor() {
      const that = this;
      const options = {
        theme: "dark",
        toolbarConfig: {
          pin: true,
        },
        toolbar: [
          {
            name: "update",
            tip: "更新笔记",
            icon: '<i class="el-icon-upload"></i>',
            click() {
              that.updateNote();
            },
          },
          "emoji",
          "bold",
          "italic",
          "strike",
          "link",
          "|",
          "list",
          "ordered-list",
          "check",
          "outdent",
          "indent",
          "|",
          "quote",
          "line",
          "code",
          "inline-code",
          "insert-before",
          "insert-after",
          "|",
          "record",
          "table",
          "|",
          "undo",
          "redo",
          "|",
          "fullscreen",
          "edit-mode",
          "more",
        ],
        width: this.isMobile ? "100%" : "80%",
        height: 600,
        tab: "\t",
        counter: "999999",
        typewriterMode: false,
        mode: "wysiwyg",
        preview: {
          delay: 100,
          show: !this.isMobile,
        },
        outline: true,
        cache: { enable: false },
        after: () => {
          const savedMdContent =
            localStorage.getItem("vditorvditor") || defaultText;
          that.vditor.setValue(savedMdContent);
        },
      };
      this.vditor = new Vditor("vditor", options);
      this.vditor.focus();
    },
    onloadCallback(oEvent) {
      const currentTarget = oEvent.currentTarget;
      if (currentTarget.status !== 200) {
        return this.$message({
          type: "error",
          message: currentTarget.status + " " + currentTarget.statusText,
        });
      }
      let resp = JSON.parse(currentTarget.response);
      let imgMdStr = "";
      if (resp.code === "invalid_source") {
        return this.$message({
          type: "error",
          message: resp.message,
        });
      }
      if (resp.code === "image_repeated") {
        imgMdStr = `![](${resp.images})`;
      } else if (resp.code === "success" || resp.success) {
        imgMdStr = `![${resp.data.filename}](${resp.data.url})`;
      }
      this.vditor.insertValue(imgMdStr);
    },
    setDefaultText() {
      const savedMdContent = localStorage.getItem("vditorvditor") || "";
      if (!savedMdContent.trim()) {
        localStorage.setItem("vditorvditor", defaultText);
      }
    },
    async updateNote() {
      if (!this.vditor) return;
      this.updating = true;
      try {
        const noteId = this.$route.params.note_id;
        const content = this.vditor.getValue();
        await axios.put(`http://localhost:8000/notes/${noteId}`, {
          content,
        });
        this.$message.success("笔记已更新");
      } catch (e) {
        this.$message.error("更新失败");
      } finally {
        this.updating = false;
      }
    },
  },
};
</script>

<style scoped>
:deep(.vditor),
:deep(.vditor-toolbar),
:deep(.vditor-toolbar__item),
:deep(.vditor-tooltipped),
:deep(.vditor-toolbar__item > svg),
:deep(.vditor-tooltipped > svg) {
  all: unset;
  box-sizing: content-box !important;
  line-height: 1 !important;
}

:deep(.vditor-toolbar) {
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  overflow-x: auto !important;
  background: #f6f8fa !important;
  border-bottom: 1px solid #d1d5da !important;
}

:deep(.vditor-toolbar__item),
:deep(.vditor-tooltipped) {
  min-width: 28px !important;
  min-height: 28px !important;
  white-space: nowrap !important;
}

:deep(.vditor-toolbar__item > svg),
:deep(.vditor-tooltipped > svg) {
  width: 16px !important;
  height: 16px !important;
}
</style>
