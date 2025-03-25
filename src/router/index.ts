import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import AddCategory from "@/pages/category/AddCategory.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/pages/HomePage.vue"),
        meta: {
          title: "首页",
        },
      },
      {
        path: "settings",
        name: "settings",
        component: () => import("@/pages/SettingsPage.vue"),
        meta: {
          title: "设置",
        },
      },
      {
        path: "import-export",
        name: "import-export",
        component: () => import("@/pages/ImportExportPage.vue"),
        meta: {
          title: "导入导出",
        },
      },
    ],
  },
  {
    path: "/category/add",
    name: "AddCategory",
    component: AddCategory,
    meta: {
      requiresAuth: true,
      title: "添加分类",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/pages/NotFoundPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由标题
router.beforeEach((to, from, next) => {
  const title = to.meta.title
    ? `${to.meta.title} - 程序员的小盒子`
    : "程序员的小盒子";
  document.title = title;
  next();
});

export default router;
