<template>
  <div class="main-container">

    <!-- 图谱区 -->
    <div class="diagram-card">
      <div class="toolbar">
        <select v-model="selectedLayout" @change="changeLayout" class="layout-select">
          <option value="horizontal">横向布局 ></option>
          <option value="vertical">纵向布局 ></option>
        </select>
        <button class="export-btn" @click="exportFullDiagramAsImage">
          <span class="btn-icon">📷</span>
          <span class="btn-text">导出高清图像</span>
        </button>
      </div>
      <div ref="diagramContainer" class="diagram-area"></div>
    </div>
  </div>
</template>


<script>
import { ref, onMounted, watch } from 'vue'
import * as go from 'gojs'

const DEBUG = true

const getNodeVisuals = (type) => {
  switch (type) {
    case 'folder': return { icon: '📁', fill: '#e0f2fe' }
    case 'pdf': return { icon: '📘', fill: '#f1f5f9' }
    case 'note': return { icon: '📝', fill: '#fef9c3' }
    default: return { icon: '', fill: '#f8fafc' }
  }
}

const guessType = (label) => {
  if (!label) return 'folder'
  if (label.includes('.pdf')) return 'pdf'
  if (label.includes('笔记') || label.includes('章')) return 'note'
  return 'folder'
}

const dataConverter = {
  convert(treeData) {
    const nodes = []
    const links = []
    const idSet = new Set()

    const traverse = (node, parentKey = null) => {
      if (DEBUG) {
        if (!node.id) console.error('节点缺少 id:', node)
        if (idSet.has(node.id)) console.error('重复 id:', node.id)
      }
      idSet.add(node.id)

      const label = node.label || `Node ${node.id}`
      const type = node.type || guessType(label)
      const { icon, fill } = getNodeVisuals(type)

      nodes.push({
        key: node.id,
        text: label,
        type,
        icon,
        fill,
        stroke: '#cbd5e1',
        font: node.children?.length ? 'bold 14px Inter' : '14px Inter'
      })

      if (parentKey !== null) links.push({ from: parentKey, to: node.id })

      if (Array.isArray(node.children)) {
        node.children.forEach(child => traverse(child, node.id))
      }
    }

    try {
      if (Array.isArray(treeData)) {
        treeData.forEach(root => traverse(root))
      } else {
        console.error('数据格式错误: treeData 必须是数组')
      }
    } catch (e) {
      console.error('数据转换异常:', e)
    }

    return { nodes, links }
  }
}

export default {
  props: {
    treeData: {}
  },

  setup(props) {
    const diagramContainer = ref(null)
    const selectedNode = ref(null)
    const selectedLayout = ref('horizontal')
    let diagram = null

    const updateNodeType = (node, type) => {
      const { icon, fill } = getNodeVisuals(type)
      diagram.model.startTransaction('update type')
      diagram.model.setDataProperty(node.data, 'type', type)
      diagram.model.setDataProperty(node.data, 'icon', icon)
      diagram.model.setDataProperty(node.data, 'fill', fill)
      diagram.model.commitTransaction('update type')
    }

    const renameNode = (node) => {
      const newText = prompt('请输入新的名称', node.data.text)
      if (newText && newText.trim()) {
        const newType = guessType(newText)
        const { icon, fill } = getNodeVisuals(newType)
        diagram.model.startTransaction('rename')
        diagram.model.setDataProperty(node.data, 'text', newText)
        diagram.model.setDataProperty(node.data, 'type', newType)
        diagram.model.setDataProperty(node.data, 'icon', icon)
        diagram.model.setDataProperty(node.data, 'fill', fill)
        diagram.model.commitTransaction('rename')
      }
    }

    const exportFullDiagramAsImage = () => {
      const img = diagram.makeImageData({
        background: '#ffffff',
        scale: 2
      })
      const link = document.createElement('a')
      link.href = img
      link.download = '知识图谱.png'
      link.click()
    }
    //
    // const exportSingleNodeAsImage = (node) => {
    //   const img = diagram.makeImageData({
    //     background: '#ffffff',
    //     scale: 2,
    //     parts: new go.List().add(node)
    //   })
    //   const link = document.createElement('a')
    //   link.href = img
    //   link.download = `${node.data.text}.png`
    //   link.click()
    // }

    const getLayout = () => {
      const $ = go.GraphObject.make
      switch (selectedLayout.value) {
        case 'horizontal':
          return $(go.TreeLayout, { angle: 0, layerSpacing: 40 })
        case 'vertical':
          return $(go.TreeLayout, { angle: 90, layerSpacing: 40 })
        default:
          return $(go.TreeLayout, { angle: 0, layerSpacing: 40 })
      }
    }

    const initDiagram = () => {
      if (!diagramContainer.value) return

      const $ = go.GraphObject.make
      diagram = $(go.Diagram, diagramContainer.value, {
        initialAutoScale: go.Diagram.Uniform,
        layout: getLayout(),
        'undoManager.isEnabled': false
      })

      diagram.nodeTemplate = $(
          go.Node,
          'Auto',
          $(go.Shape, 'RoundedRectangle',
              new go.Binding('fill', 'fill'),
              new go.Binding('stroke', 'stroke'),
              { strokeWidth: 1.5, parameter1: 8 }
          ),
          $(
              go.TextBlock,
              { margin: 10, wrap: go.TextBlock.WrapFit, textAlign: 'center' },
              new go.Binding('text', '', d => `${d.icon || ''} ${d.text}`),
              new go.Binding('font', 'font'),
              { stroke: '#1e293b' }
          )
      )

      diagram.linkTemplate = $(
          go.Link,
          { curve: go.Link.Bezier, corner: 5 },
          $(go.Shape, { stroke: '#cbd5e1', strokeWidth: 2 }),
          $(go.Shape, { toArrow: 'OpenTriangle', stroke: '#cbd5e1' })
      )

      diagram.nodeTemplate.contextMenu = $(
          'ContextMenu',
          $('ContextMenuButton', $(go.TextBlock, '🗑️ 删除节点'), {
            click: (e, obj) => diagram.model.removeNodeData(obj.part.adornedPart.data)
          }),
          $('ContextMenuButton', $(go.TextBlock, '✏️ 重命名节点'), {
            click: (e, obj) => renameNode(obj.part.adornedPart)
          }),
          $('ContextMenuButton', $(go.TextBlock, '📁 设为文件夹'), {
            click: (e, obj) => updateNodeType(obj.part.adornedPart, 'folder')
          }),
          $('ContextMenuButton', $(go.TextBlock, '📘 设为PDF'), {
            click: (e, obj) => updateNodeType(obj.part.adornedPart, 'pdf')
          }),
          $('ContextMenuButton', $(go.TextBlock, '📝 设为笔记'), {
            click: (e, obj) => updateNodeType(obj.part.adornedPart, 'note')
          })
      )

      diagram.addDiagramListener('ObjectSingleClicked', (e) => {
        const part = e.subject.part
        if (part instanceof go.Node) {
          selectedNode.value = part.data
        }
      })
    }

    const updateDiagram = () => {
      if (!diagram) return
      const modelData = dataConverter.convert(props.treeData)

      if (modelData.nodes.length === 0) {
        diagram.model = new go.GraphLinksModel([{ key: 'no-data', text: '暂无数据' }], [])
        return
      }

      diagram.model = new go.GraphLinksModel(modelData.nodes, modelData.links)

      setTimeout(() => {
        diagram.layout = getLayout()
        diagram.initialContentAlignment = go.Spot.Center
        diagram.autoScale = go.Diagram.Uniform
        diagram.requestUpdate()
      }, 50)
    }

    const changeLayout = () => {
      if (diagram) {
        diagram.startTransaction('layout')
        diagram.layout = getLayout()
        diagram.commitTransaction('layout')
      }
    }

    onMounted(() => {
      initDiagram()
      updateDiagram()
      window.addEventListener('resize', () => diagram.requestUpdate())
    })

    watch(() => props.treeData, updateDiagram, { deep: true })

    return {
      diagramContainer,
      exportFullDiagramAsImage,
      selectedNode,
      selectedLayout,
      changeLayout
    }
  }
}
</script>

<style scoped>
.main-container {
  display: flex;
  gap: 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f0f4ff 100%);
  min-height: 100vh;
  padding: 40px 5%;
  box-sizing: border-box;
}

.diagram-card {
  flex: 1;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 12px 32px rgba(163, 174, 184, 0.15);
  overflow: hidden;
  transition: transform 0.2s ease;
}

.diagram-card:hover {
  transform: translateY(-2px);
}

.toolbar {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 18px 28px;
  background: linear-gradient(90deg, #f9fafe 0%, #f6f9ff 100%);
  border-bottom: 1px solid #f1f5ff;
}

.layout-select {
  padding: 8px 24px;
  border: 1px solid #e3e8ff;
  border-radius: 12px;
  background: #ffffff;
  font-size: 14px;
  color: #4a5568;
  transition: all 0.2s;
  appearance: none;
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  cursor: pointer;
}

.layout-select:focus {
  outline: none;
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.2);
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 20px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.15);
}

.export-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.btn-icon {
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
}

.btn-text {
  letter-spacing: 0.3px;
}

.diagram-area {
  height: 70vh;
  min-height: 600px;
  background: #fbfdff;
  position: relative;
  transition: background-color 0.3s ease;
}

@media (max-width: 768px) {
  .main-container {
    padding: 24px 16px;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
  }

  .layout-select,
  .export-btn {
    width: 100%;
    justify-content: center;
  }

  .diagram-area {
    height: 60vh;
    min-height: 480px;
  }
}

@media (max-width: 480px) {
  .export-btn span:last-child {
    display: none;
  }

  .export-btn .btn-icon {
    margin-right: 0;
  }
}
</style>