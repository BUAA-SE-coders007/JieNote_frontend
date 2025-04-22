<template>
  <div class="flex flex-col h-screen">
    <!-- 顶部导航栏 -->
    <nav class="relative flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-emerald-500">
      <div class="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div class="w-full relative flex justify-between lg:w-auto px-4 lg:static lg:block lg:justify-start">
          <a class="text-lg font-bold leading-relaxed inline-block mr-4 py-2 whitespace-no-wrap uppercase text-white" href="#pablo">
            文献管理
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
              <a class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                 href="javascript:;"
                 @click="handleExport">
                <i class="fas fa-download text-lg leading-lg text-white opacity-75"></i><span class="ml-2">导出</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                 href="javascript:;"
                 @click="createNewCategory">
                <i class="fas fa-plus text-lg leading-lg text-white opacity-75"></i><span class="ml-2">新建</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                 href="javascript:;"
                 @click="handleShowGraph">
                <i class="fas fa-project-diagram text-lg leading-lg text-white opacity-75"></i>
                <span class="ml-2">知识图谱</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                 href="javascript:;"
                 @click="toggleCheckbox">
                <i class="fas fa-check-square text-lg leading-lg text-white opacity-75"></i>
                <span class="ml-2">{{ showCheckbox ? "隐藏选择框" : "显示选择框" }}</span>
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
      <KnowledgeGraph :treeData="graphTreeData" />
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

    <!-- 新建分类弹窗 -->
    <el-dialog
        v-model="showNewCategoryDialog"
        title="新建分类"
        width="30%"
        :close-on-click-modal="false"
        custom-class="new-category-modal"
        :destroy-on-close="true"
    >
      <el-form :model="newCategoryForm" label-width="80px">
        <el-form-item label="分类名称">
          <el-input
              v-model="newCategoryForm.name"
              placeholder="请输入分类名称"
              class="category-input"
              :maxlength="20"
              show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
              @click="showNewCategoryDialog = false"
              class="modal-cancel-btn"
          >取消</el-button>
          <el-button
              type="primary"
              @click="confirmNewCategory"
              class="modal-confirm-btn"
          >确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 搜索输入框 -->
    <div v-if="showSearchInput" class="search-container">
      <el-input
          v-model="searchQuery"
          placeholder="搜索分类..."
          class="search-input"
          @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
        <template #append>
          <el-button @click="clearSearch">
            <el-icon><Close /></el-icon>
          </el-button>
        </template>
      </el-input>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex-1 overflow-y-auto bg-gray-100">
      <div class="container-fluid px-4 py-4">
        <div class="bg-white rounded-lg shadow p-4">
          <el-tree
              class="modern-tree"
              :data="dataSource"
              :check-strictly="true"
              draggable
              :show-checkbox="showCheckbox"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
              ref="treeRef"
          >
            <template #default="{ node, data }">
              <div class="modern-node">
                <span class="node-label">{{ getIconForNode(data) }} {{ data.label }}</span>
                <div class="node-actions">
                  <!-- 只在前两级展示添加按钮 -->
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
                      v-if="node.level < 3"
                      type="primary"
                      size="small"
                      round
                      @click.stop="append(data)"
                      class="action-btn add-btn"
                  >
                    <el-icon><DocumentAdd /></el-icon>
                  </el-button>
                  <!-- 所有节点都可删除 -->
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
import { ref,nextTick} from 'vue'
import { Edit, DocumentAdd, Delete } from '@element-plus/icons-vue'
import KnowledgeGraph from '/src/components/Tree/KnowledgeGraph.vue'
import JSZip from 'jszip'
import { ElMessage } from 'element-plus'

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
    const treeRef = ref(null)
    const showNewCategoryDialog = ref(false)
    const newCategoryForm = ref({
      name: ''
    })
    const showSearchInput = ref(false)
    const searchQuery = ref('')
    const graphTreeData = ref([]) // 新增图谱数据

    const toggleCheckbox = () => {
      showCheckbox.value = !showCheckbox.value
    }

    const buildGraphTree = (source, selectedIds) => {
      const selectedSet = new Set(selectedIds)

      const recursiveFilter = (node) => {
        let hasSelectedChild = false
        const children = []

        if (node.children) {
          node.children.forEach(child => {
            const filteredChild = recursiveFilter(child)
            if (filteredChild) {
              children.push(filteredChild)
              hasSelectedChild = true
            }
          })
        }

        if (selectedSet.has(node.id) || hasSelectedChild) {
          return {
            id: node.id,
            label: node.label,
            children: children.length ? children : undefined
          }
        }
        return null
      }

      return source
          .map(node => recursiveFilter(node))
          .filter(Boolean)
    }


    const getIconForNode = (node) => {
      const depth = getNodeDepth(node, dataSource.value) // 获取节点深度

      if (depth === 0) {
        return '📁' // 一级：文件夹
      } else if (depth === 1) {
        return node.children && node.children.length > 0 ? '📚' : '📖' // 二级：PDF（有子节点是📚，没有是📖）
      }
      return '📝' // 三级：笔记
    }

    // 递归查找节点的深度（通过 node.id）
    const getNodeDepth = (node, tree, depth = 0) => {
      for (const item of tree) {
        if (item.id === node.id) {
          return depth // 找到节点，返回深度
        }
        if (item.children && item.children.length > 0) {
          const childDepth = getNodeDepth(node, item.children, depth + 1)
          if (childDepth >= 0) {
            return childDepth // 如果在子节点中找到，返回深度
          }
        }
      }
      return -1 // 如果没有找到返回-1
    }




    const filterCheckedTreeNodes = (nodes, checkedKeys) => {
      const keySet = new Set(checkedKeys)

      const deepFilter = (node) => {
        if (!keySet.has(node.id)) return null

        const filtered = { ...node }
        if (filtered.children) {
          filtered.children = filtered.children
              .map(child => deepFilter(child))
              .filter(Boolean)
        }
        return filtered
      }

      return nodes
          .map(node => deepFilter(node))
          .filter(Boolean)
    }




    const handleShowGraph = () => {
      if (!showCheckbox.value) {
        showCheckbox.value = true
        ElMessage({
          message: '请选择要生成知识图谱的文件',
          type: 'info'
        })
      } else {
        const rawCheckedNodes = treeRef.value.getCheckedNodes(false, true)
        const checkedKeys = treeRef.value.getCheckedKeys(false)
        const checkedNodes = filterCheckedTreeNodes(rawCheckedNodes, checkedKeys)
        console.log(checkedNodes)
        if (checkedNodes.length === 0) {
          ElMessage({
            message: '请至少选择一个文件',
            type: 'warning'
          })
          return
        }
        nextTick(() => {
          graphTreeData.value = buildGraphTree(dataSource.value, checkedKeys)
          console.log(graphTreeData)
          showGraph.value = true
          showCheckbox.value = false
          treeRef.value.setCheckedKeys([])
        })
      }
    }

    const handleExport = () => {
      if (!showCheckbox.value) {
        showCheckbox.value = true
        ElMessage({
          message: '请选择要导出的文件',
          type: 'info'
        })
      } else {
        const rawCheckedNodes = treeRef.value.getCheckedNodes(false, true)
        const checkedKeys = treeRef.value.getCheckedKeys(false)
        const checkedNodes = filterCheckedTreeNodes(rawCheckedNodes, checkedKeys)
        console.log(checkedNodes)
        console.log(checkedKeys)
        if (checkedNodes.length === 0) {
          ElMessage({
            message: '请至少选择一个文件',
            type: 'warning'
          })
          return
        }
        exportSelectedFiles(checkedKeys).then(() => {
          // 导出成功后，关闭选择框并清空选择
          showCheckbox.value = false
          treeRef.value.setCheckedKeys([])
        })
      }
    }

    const exportSelectedFiles = async (selectedKeys) => {
      try {
        const selectedSet = new Set(selectedKeys.map(id => String(id)))
        const zip = new JSZip()

        // 递归构造选中结构，保留路径
        const buildSelectedTree = (nodes, path = []) => {
          const result = []

          for (const node of nodes) {
            const newPath = [...path, node.label]
            const isSelected = selectedSet.has(String(node.id))

            let children = []
            if (node.children) {
              children = buildSelectedTree(node.children, newPath)
            }

            if (isSelected || children.length > 0) {
              result.push({
                ...node,
                path: newPath,
                children
              })
            }
          }

          return result
        }

        const selectedTree = buildSelectedTree(dataSource.value)

        // 添加选中文件到 zip：只在第一级创建文件夹，所有文件直接放进去
        const addFilesToZip = (nodes, zipRoot) => {
          nodes.forEach(level1Node => {
            const folder = zipRoot.folder(level1Node.label)

            // 第二层为 PDF
            level1Node.children?.forEach(level2Node => {
              if (selectedSet.has(String(level2Node.id))) {
                const fileName = level2Node.label.endsWith('.pdf') ? level2Node.label : `${level2Node.label}.pdf`
                folder.file(fileName, 'PDF文件内容')
              }

              // 第三层为 Markdown
              level2Node.children?.forEach(level3Node => {
                if (selectedSet.has(String(level3Node.id))) {
                  const baseName = level3Node.label.replace(/\.md$/, '')
                  const referenceName = level2Node.label.replace(/\.(pdf|md)$/, '')
                  const finalName = `${baseName}-${referenceName}.md`
                  folder.file(finalName, '# Markdown文件内容')
                }
              })
            })
          })
        }

        addFilesToZip(selectedTree, zip)

        const content = await zip.generateAsync({ type: 'blob' })
        const url = URL.createObjectURL(content)
        const link = document.createElement('a')
        link.href = url
        link.download = '文献导出.zip'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        ElMessage.success('导出成功')
      } catch (error) {
        ElMessage.error('导出失败：' + error.message)
      }
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
      console.log(dataSource.value)
    }

    const remove = (node, data) => {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d) => d.id === data.id)
      children.splice(index, 1)
      dataSource.value = [...dataSource.value]
    }

    const createNewCategory = () => {
      showNewCategoryDialog.value = true
      newCategoryForm.value.name = ''
    }

    const confirmNewCategory = () => {
      if (!newCategoryForm.value.name.trim()) {
        ElMessage({
          message: '请输入分类名称',
          type: 'warning'
        })
        return
      }

      const newCategory = {
        id: id++,
        label: newCategoryForm.value.name,
        children: []
      }
      dataSource.value.push(newCategory)
      dataSource.value = [...dataSource.value]
      showNewCategoryDialog.value = false
      ElMessage({
        message: '新建分类成功',
        type: 'success'
      })
    }

    const handleSearch = () => {
      // 搜索逻辑已经在 computed 中实现
    }

    const clearSearch = () => {
      searchQuery.value = ''
      showSearchInput.value = false
    }

    const dataSource = ref([
      {
        id: 1,
        label: '计算机科学',
        date:'2天前',
        children: [
          {
            id: 4,
            label: '数据结构与算法分析.pdf',
            date: '1天前',
            children: [
              { id: 9, label: '第一章笔记',date: '1天前' },
              { id: 10, label: '第二章笔记',date: '1天前' }
            ]
          },
          {
            id: 5,
            label: '计算机网络.pdf',
            date: '1天前',
            children: [
              { id: 11, label: '网络协议笔记',date: '1天前' }
            ]
          }
        ]
      },
      {
        id: 2,
        label: '人工智能',
        date: '1天前',
        children: [
          { id: 6, label: '深度学习.pdf',date: '1天前' },
          { id: 7, label: '自然语言处理.pdf',date: '1天前' }
        ]
      },
      {
        id: 3,
        label: '机器学习',
        date: '1天前',
        children: [
          { id: 8, label: '机器学习实战.pdf',date: '1天前' },
          { id: 12, label: '统计学习方法.pdf',date: '1天前' }
        ]
      }
    ])




    return {
      showCheckbox,
      showGraph,
      showNewCategoryDialog,
      newCategoryForm,
      toggleCheckbox,
      append,
      remove,
      dataSource,
      treeRef,
      handleShowGraph,
      handleExport,
      createNewCategory,
      confirmNewCategory,
      showSearchInput,
      searchQuery,
      graphTreeData,
      handleSearch,
      clearSearch,
      getIconForNode
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
    background-color: rgba(200, 181, 88, 0.63);
    border-color: transparent;

    &:hover {
      background-color: var(--el-color-warning);
      color: white;
    }
  }

  &.add-btn {
    background-color: rgba(70, 160, 255, 0.44);
    border-color: transparent;

    &:hover {
      background-color: var(--el-color-primary);
      color: white;
    }
  }

  &.delete-btn {
    background-color: rgba(245, 108, 108, 0.54);
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

:deep(.new-category-modal) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(5, 150, 105, 0.2);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);

  .el-dialog__header {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    margin-right: 0;
    padding: 16px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .el-dialog__title {
      color: white;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .el-dialog__headerbtn {
      top: 16px;
      right: 20px;

      .el-dialog__close {
        color: rgba(255, 255, 255, 0.9);
        font-size: 20px;
        transition: all 0.3s ease;

        &:hover {
          color: white;
          transform: scale(1.1) rotate(90deg);
        }
      }
    }
  }

  .el-dialog__body {
    padding: 24px;
    background: rgba(255, 255, 255, 0.95);

    .el-form-item {
      margin-bottom: 24px;

      .el-form-item__label {
        font-weight: 500;
        color: #374151;
        padding-bottom: 8px;
      }

      .el-form-item__content {
        .el-input__wrapper {
          border-radius: 12px;
          padding: 8px 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #e5e7eb;

          &:hover {
            border-color: #059669;
            box-shadow: 0 4px 6px rgba(5, 150, 105, 0.1);
          }

          &.is-focus {
            border-color: #059669;
            box-shadow: 0 4px 6px rgba(5, 150, 105, 0.15);
          }
        }

        .el-input__inner {
          font-size: 15px;
          color: #1f2937;
          &::placeholder {
            color: #9ca3af;
          }
        }
      }
    }
  }

  .el-dialog__footer {
    border-top: 1px solid rgba(229, 231, 235, 0.5);
    padding: 16px 24px;
    background: rgba(255, 255, 255, 0.95);
  }

  .modal-cancel-btn {
    padding: 10px 24px;
    border-radius: 12px;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    color: #4b5563;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      background: #e5e7eb;
      border-color: #d1d5db;
      color: #374151;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .modal-confirm-btn {
    padding: 10px 24px;
    border-radius: 12px;
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    border: none;
    color: white;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);

    &:hover {
      background: linear-gradient(135deg, #047857 0%, #065f46 100%);
      transform: translateY(-1px);
      box-shadow: 0 6px 8px rgba(5, 150, 105, 0.3);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);
    }
  }
}

@media (max-width: 768px) {
  :deep(.new-category-modal) {
    width: 90% !important;
    margin: 0 auto;

    .el-dialog__body {
      padding: 20px;
    }

    .el-dialog__footer {
      padding: 16px 20px;
    }

    .modal-cancel-btn,
    .modal-confirm-btn {
      padding: 8px 20px;
      font-size: 14px;
    }
  }
}

:deep(.el-input__wrapper),
:deep(.el-input__inner),
:deep(.el-dialog__headerbtn),
:deep(.el-dialog__close) {
  &:focus,
  &:focus-visible {
    outline: none !important;
    box-shadow: none !important;
    -webkit-box-shadow: none !important;
  }
}

:deep(.el-input__wrapper) {
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
  border: 1px solid #dcdfe6 !important;

  &:hover, &.is-focus {
    border-color: #059669 !important;
  }
}

.search-container {
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  .search-input {
    max-width: 400px;
    margin: 0 auto;

    :deep(.el-input__wrapper) {
      border-radius: 12px;
      padding: 8px 16px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #e5e7eb;

      &:hover {
        border-color: #059669;
        box-shadow: 0 4px 6px rgba(5, 150, 105, 0.1);
      }

      &.is-focus {
        border-color: #059669;
        box-shadow: 0 4px 6px rgba(5, 150, 105, 0.15);
      }
    }

    :deep(.el-input-group__append) {
      padding: 0;
      border: none;
      background: transparent;

      .el-button {
        padding: 8px;
        border: none;
        background: transparent;
        color: #6b7280;

        &:hover {
          color: #059669;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .search-container {
    padding: 12px;

    .search-input {
      max-width: 100%;
    }
  }
}
</style>