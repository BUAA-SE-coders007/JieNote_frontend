# JieNote_frontend
2025春季软件工程团队项目JieNote前端仓库

---

## 🛠️ Setup

本项目基于 [Vue 3](https://vuejs.org/)、[Tailwind CSS](https://tailwindcss.com/)、[Element Plus](https://element-plus.org/zh-CN/) 和其他多种流行组件库开发，以下为前端项目的安装与运行步骤。

### ✅ 环境要求

请确保你的开发环境中已安装以下工具：

* [Node.js](https://nodejs.org/) >= 14.x
* [npm](https://www.npmjs.com/) >= 6.x
* 推荐使用 [VSCode](https://code.visualstudio.com/) 作为编辑器，并安装 Vue.js 插件支持

### 📦 安装依赖

```bash
npm install
```

> 如果遇到依赖或缓存问题，可使用以下命令清理后重新安装：

```bash
npm run install:clean
```

此命令将清空 `node_modules` 和 `package-lock.json`，并重新安装依赖、构建 Tailwind 样式并启动开发服务器。

### 🚀 启动开发服务器

```bash
npm run serve
```

> 如果需要启动带有 mock 数据的调试模式，可使用：

```bash
npm run serve:mock
```

项目将默认在 `http://localhost:8080/` 启动。

### 🏗️ 构建生产环境版本

```bash
npm run build
```

> 构建过程将使用 `cross-env` 设置环境变量并运行 Tailwind 构建脚本与 `gulp` 插件处理版权信息。

### 💨 构建 Tailwind 样式文件

```bash
npm run build:tailwind
```

此命令会将 `src/assets/styles/index.css` 编译为最终样式输出 `src/assets/styles/tailwind.css`。

### 🔍 代码检查

```bash
npm run lint
```

使用 ESLint 对 Vue 文件进行语法检查，配置位于 `.eslintrc.js` 中。

---


## 📁 项目结构说明

本项目采用模块化结构进行组织，主要目录说明如下：

```
├── /src
│   ├── /api           // 接口请求封装模块
│   ├── /assets        // 静态资源（如图片、图标等）
│   ├── /components    // 可复用 Vue 组件
│   ├── /utils         // 工具函数封装（如 token 鉴权）
│   └── /views         // 主页面视图组件（路由页面）
```

* `views`：页面视图目录，包含项目的主要功能页面（对应路由）
* `assets`：存放图片资源等静态文件
* `api`：统一封装后端接口调用逻辑，便于维护与管理
* `components`：项目中共用的 Vue UI 组件
* `utils`：实用工具函数，例如用户登录 token 存取、鉴权处理等

---

## 📚 项目来源

本项目基于 Creative Tim 提供的开源 UI 套件 [Vue Notus](https://www.creative-tim.com/learning-lab/tailwind/vue/overview/notus) 进行二次开发与功能扩展。

* Vue Notus 是一个使用 **Vue.js** 和 **Tailwind CSS** 构建的免费 UI 工具包，适合快速构建美观的前端界面。
* 原始模板主页：
  👉 [https://demos.creative-tim.com/vue-notus/](https://demos.creative-tim.com/vue-notus/)

我们在原模板基础上，扩展了组件功能、引入权限校验、Markdown 编辑、PDF 展示、知识图谱等模块，实现更完整的文献管理功能。

---
