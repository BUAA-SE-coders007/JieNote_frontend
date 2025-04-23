<template>
  <div>
    <NoteComponent />
  </div>
</template>

<script>
import NoteComponent from "@/components/Note/NoteComponent.vue";

export default {
  name: "NotePage",
  components: {
    NoteComponent,
  },
};
</script>

<style scoped>
/* 覆盖 Tailwind 对 Vditor 的影响 */
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
  /* padding-left: 0 !important; */
  overflow-x: auto !important;
  background: #f6f8fa !important;
  border-bottom: 1px solid #d1d5da !important;
}

:deep(.vditor-toolbar__item),
:deep(.vditor-tooltipped) {
  min-width: 28px !important;
  min-height: 28px !important;
  /* padding: 0 2px !important; */
  white-space: nowrap !important;
}

:deep(.vditor-toolbar__item > svg),
:deep(.vditor-tooltipped > svg) {
  width: 16px !important;
  height: 16px !important;
}
</style>
