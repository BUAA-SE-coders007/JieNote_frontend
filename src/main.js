import { createApp } from "vue";
import { createWebHistory, createRouter } from "vue-router";

import NoteLayout from '@/layouts/NoteLayout.vue';
// styles

import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/assets/styles/tailwind.css";

// mouting point for the whole app

import App from "@/App.vue";

// layouts
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import Admin from "@/layouts/Admin.vue";
import Auth from '@/layouts/Auth.vue';

// views for Admin layout

import Dashboard from "@/views/admin/Dashboard.vue";
import Settings from "@/views/admin/Settings.vue";
import Tables from "@/views/admin/Tables.vue";
import Maps from "@/views/admin/Maps.vue";
import Note from "@/views/admin/Note";

// views for Auth layout

import Login from "@/views/auth/Login.vue";
import Register from "@/views/auth/Register.vue";

// views without layouts

import Landing from "@/views/Landing.vue";
import Profile from "@/views/Profile.vue";
import Index from "@/views/Index.vue";
import ProjectIntro from "@/views/ProjectIntro.vue";
// routes

const routes = [
  {
    path: "/project-intro",
    name: "ProjectIntro",
    component: ProjectIntro,
  },
  {
    path: "/admin",
    redirect: "/admin/dashboard",
    component: Admin,
    children: [
      {
        path: "/admin/note",
        component: Note,
      },
      {
        path: "/admin/dashboard",
        component: Dashboard,
      },
      {
        path: "/admin/settings",
        component: Settings,
      },
      {
        path: "/admin/tables",
        component: Tables,
      },
      {
        path: "/admin/maps",
        component: Maps,
      },
      {
        path: "/landing",
        component: Landing,
      },
      {
        path: "/profile",
        component: Profile,
      },
    ],
  },
  {
    path: "/auth",
    redirect: "/auth/login",
    component: Auth,
    children: [
      {
        path: "/auth/login",
        component: Login,
      },
      {
        path: "/auth/register",
        component: Register,
      },
    ],
  },
  {
    path: "/admin/notelayout",
    component: NoteLayout,
  },
  {
    path: "/",
    component: Index,
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 引入 Token 刷新服务
import tokenRefreshService from '@/utils/tokenRefreshService';

// 设置路由拦截来检查身份验证
router.beforeEach((to, from, next) => {
  // 如果不是访问登录或注册页面，并且有 token，则初始化刷新服务
  const publicPages = ['/auth/login', '/auth/register', '/', '/project-intro'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('authToken');

  if (authRequired && loggedIn) {
    // 确保 token 刷新服务已初始化
    tokenRefreshService.init();
  }
  
  next();
});

app.use(router).mount("#app");

// 如果用户已登录，初始化 Token 刷新服务
if (localStorage.getItem('authToken')) {
  tokenRefreshService.init();
}
