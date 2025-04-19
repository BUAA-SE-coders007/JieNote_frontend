<template>
  <div class="flex flex-col h-screen">
    <!-- 顶部导航栏 -->
    <nav class="relative flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-emerald-500">
      <div class="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div class="w-full relative flex justify-between lg:w-auto px-4 lg:static lg:block lg:justify-start">
          <a class="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-no-wrap uppercase text-white" href="#pablo">
            JieNote
          </a>
          <button class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none" type="button">
            <span class="block relative w-6 h-px rounded-sm bg-white"></span>
            <span class="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
            <span class="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
          </button>
        </div>
        <div class="lg:flex flex-grow items-center">
          <ul class="flex flex-col lg:flex-row list-none ml-auto">
            <li class="nav-item">
              <a class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75" href="#pablo">
                <i class="fas fa-search text-lg leading-lg text-white opacity-75"></i><span class="ml-2">搜索</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75" href="#pablo">
                <i class="fas fa-plus text-lg leading-lg text-white opacity-75"></i><span class="ml-2">新建</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                 href="javascript:;"
                 @click="showGraph = true">
                <i class="fas fa-project-diagram text-lg leading-lg text-white opacity-75"></i>
                <span class="ml-2">知识图谱</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75" href="#pablo">
                <i class="fas fa-user text-lg leading-lg text-white opacity-75"></i><span class="ml-2">用户</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- 知识图谱弹窗 -->
    <el-dialog
        v-model="showGraph"
        title="知识图谱"
        width="90%"
        top="5vh"
        custom-class="graph-modal"
        :close-on-click-modal="false"
        :destroy-on-close="false"
    >
      <KnowledgeGraph :treeData="dataSource" />
      <template #footer>
        <span class="dialog-footer">
          <el-button
              type="primary"
              @click="showGraph = false"
              class="modal-close-btn"
              size="medium"
          >
            <i class="fas fa-times-circle mr-2"></i>关闭视图
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 主要内容区域 -->
    <div class="flex-1 overflow-y-auto bg-gray-100">
      <div class="container-fluid px-4 py-4">
        <div class="bg-white rounded-lg shadow p-4">
          <h3 class="section-title">文献管理</h3>
          <div class="controls mb-4">
            <el-button
                type="primary"
                size="small"
                round
                @click="toggleCheckbox"
            >
              {{ showCheckbox ? "隐藏选择框" : "显示选择框" }}
            </el-button>
          </div>
          <el-tree
              class="modern-tree"
              :data="dataSource"
              draggable
              :show-checkbox="showCheckbox"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
          >
            <template #default="{ node, data }">
              <div class="modern-node">
                <span class="node-label">{{ node.label }}</span>
                <div class="node-actions">
                  <el-button
                      type="warning"
                      size="small"
                      round
                      @click.stop="append(data)"
                      class="action-btn edit-btn"
                  >
                    <el-icon><Edit /></el-icon>
                  </el-button>
                  <el-button
                      type="primary"
                      size="small"
                      round
                      @click.stop="append(data)"
                      class="action-btn add-btn"
                  >
                    <el-icon><DocumentAdd /></el-icon>
                  </el-button>
                  <el-button
                      type="danger"
                      size="small"
                      round
                      @click.stop="remove(node, data)"
                      class="action-btn delete-btn"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </template>
          </el-tree>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { Edit, DocumentAdd, Delete } from '@element-plus/icons-vue'
import KnowledgeGraph from '/src/components/Tree/KnowledgeGraph.vue'

export default {
  name: "dashboard-page",
  components: {
    Edit,
    DocumentAdd,
    Delete,
    KnowledgeGraph
  },
  setup() {
    let id = 1000
    const showCheckbox = ref(false)
    const showGraph = ref(false)

    const toggleCheckbox = () => {
      showCheckbox.value = !showCheckbox.value
    }

    const append = (data) => {
      const newChild = {
        id: id++,
        label: `新节点 ${id}`,
        children: []
      }
      if (!data.children) {
        data.children = []
      }
      data.children.push(newChild)
      dataSource.value = [...dataSource.value]
    }

    const remove = (node, data) => {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d) => d.id === data.id)
      children.splice(index, 1)
      dataSource.value = [...dataSource.value]
    }

    const dataSource = ref([
      {
        id: 1,
        label: '计算机科学',
        children: [
          {
            id: 4,
            label: '数据结构与算法分析.pdf',
            children: [
              { id: 9, label: '第一章笔记' },
              { id: 10, label: '第二章笔记' }
            ]
          },
          {
            id: 5,
            label: '计算机网络.pdf',
            children: [
              { id: 11, label: '网络协议笔记' }
            ]
          }
        ]
      },
      {
        id: 2,
        label: '人工智能',
        children: [
          { id: 6, label: '深度学习.pdf' },
          { id: 7, label: '自然语言处理.pdf' }
        ]
      },
      {
        id: 3,
        label: '机器学习',
        children: [
          { id: 8, label: '机器学习实战.pdf' },
          { id: 12, label: '统计学习方法.pdf' }
        ]
      }
    ])

    return {
      showCheckbox,
      showGraph,
      toggleCheckbox,
      append,
      remove,
      dataSource
    }
  }
}
</script>

<style scoped lang="scss">
.section-title {
  color: #444;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e6e6e6;
}

.modern-tree {
  --el-tree-node-hover-bg-color: rgba(70, 160, 255, 0.08);
  --el-tree-text-color: #444;
  --el-tree-expand-icon-color: #888;

  :deep(.el-tree-node) {
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(.el-tree-node__content) {
    color: #555;
    height: 50px;
    border-radius: 12px;
    transition: all 0.3s ease;
    padding: 0 16px;

    &:hover {
      background-color: rgba(70, 160, 255, 0.1);
      color: var(--el-color-primary);

      .node-actions {
        opacity: 1;
        transform: translateX(0);
      }
    }
  }

  :deep(.el-tree-node.is-current > .el-tree-node__content) {
    background-color: rgba(70, 160, 255, 0.15);
    box-shadow: inset 0 0 0 2px var(--el-color-primary);
  }
}

.modern-node {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;

  .node-label {
    color: #333;
    font-weight: 600;
    padding-left: 8px;
  }

  .node-actions {
    display: flex;
    gap: 10px;
    opacity: 0;
    transform: translateX(12px);
    transition: all 0.3s ease;
  }
}

.action-btn {
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  width: 36px;
  height: 36px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  outline: none;
  box-shadow: none;

  &:focus {
    outline: none;
    box-shadow: none;
  }

  &.edit-btn {
    background-color: rgba(200, 181, 88, 0.1);
    border-color: transparent;

    &:hover {
      background-color: var(--el-color-warning);
      color: white;
    }
  }

  &.add-btn {
    background-color: rgba(70, 160, 255, 0.1);
    border-color: transparent;

    &:hover {
      background-color: var(--el-color-primary);
      color: white;
    }
  }

  &.delete-btn {
    background-color: rgba(245, 108, 108, 0.1);
    border-color: transparent;

    &:hover {
      background-color: var(--el-color-danger);
      color: white;
    }
  }
}

:deep(.graph-modal) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(16, 185, 129, 0.15);
  border: 1px solid #05966940;

  .el-dialog__header {
    background: #059669;
    margin-right: 0;
    padding: 14px 24px;
    border-bottom: 1px solid #047857;

    .el-dialog__title {
      color: white;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .el-dialog__headerbtn {
      top: 14px;
      right: 20px;

      .el-dialog__close {
        color: rgba(255, 255, 255, 0.9);
        font-size: 20px;

        &:hover {
          color: white;
          transform: scale(1.1);
        }
      }
    }
  }

  .el-dialog__body {
    padding: 0;
    height: 70vh;
    min-height: 500px;
    background: #f8fafc;
  }

  .el-dialog__footer {
    border-top: 1px solid #e2e8f0;
    padding: 12px 24px;
    background: #f8fafc;

    .modal-close-btn {
      padding: 8px 20px;
      border-radius: 8px;
      background: #059669;
      border-color: #059669;
      color: white;
      transition: all 0.2s ease;

      i {
        margin-right: 6px;
      }

      &:hover {
        background: #047857;
        border-color: #047857;
        transform: translateY(-1px);
        box-shadow: 0 2px 6px rgba(4, 120, 87, 0.3);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

:deep(.el-checkbox__inner) {
  border-radius: 8px;
  width: 18px;
  height: 18px;

  &::after {
    left: 6px;
    top: 3px;
  }
}

@media (max-width: 768px) {
  :deep(.graph-modal) {
    width: 95% !important;
    top: 2vh !important;

    .el-dialog__body {
      height: 80vh;
      min-height: auto;
    }

    .modal-close-btn {
      width: 100%;
    }
  }
}
</style>