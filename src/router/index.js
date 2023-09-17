import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

//需要把路由进行拆分
//常量路由：就是不管用户是什么角色都可以看到的路由：登录、404、首页
export const constantRoutes = [
  //登录
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
    meta: { title: "商城后台管理系统" },
  },
  //404
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },
  //数据可视化
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "首页", icon: "dashboard" },
      },
    ],
  },
  //注册
  {
    path: "/register",
    hidden: true,
    component: () => import("@/views/register/index"),
    meta: { title: "注册" },
  },
];
//异步路由：不同的用户（角色），需要过滤出能看到的权限
export const asyncRoutes = [
  //权限管理
  {
    path: "/acl",
    name: "acl",
    component: Layout,
    meta: {
      title: "权限管理",
      icon: "el-icon-lock",
    },
    children: [
      {
        path: "/acl/user",
        name: "user",
        component: () => import("@/views/acl/user"),
        meta: {
          title: "用户管理",
        },
      },
      {
        path: "/acl/role",
        name: "role",
        component: () => import("@/views/acl/role"),
        meta: {
          title: "角色管理",
        },
      },
      {
        name: "roleAuth",
        path: "role/auth/:id",
        component: () => import("@/views/acl/role/roleAuth"),
        meta: {
          aciveMenu: "/acl/role/list",
          title: "角色授权",
        },
        hidden: true,
      },
      {
        path: "/acl/permission",
        name: "permission",
        component: () => import("@/views/acl/permission"),
        meta: {
          title: "菜单管理",
        },
      },
    ],
  },
  //小功能
  {
    path: "/smallFeature",
    component: Layout,
    name: "smallFeature",
    meta: {
      title: "小功能",
      icon: "el-icon-s-grid",
    },
    children: [
      {
        path: "pswManage",
        name: "pswManage",
        component: () => import("@/views/smallFeature/pswManage"),
        meta: {
          title: "密码管理",
        },
      },
      {
        path: "snake",
        name: "snake",
        component: () => import("@/views/smallFeature/snake"),
        meta: {
          title: "贪吃蛇小游戏",
        },
      },
    ],
  },
  //商品管理
  {
    path: "/product",
    component: Layout,
    name: "product",
    meta: {
      title: "商品管理",
      icon: "el-icon-goods",
    },
    children: [
      {
        path: "trademark",
        name: "trademark",
        component: () => import("@/views/product/tradeMark"),
        meta: {
          title: "品牌管理",
        },
      },
      {
        path: "attr",
        name: "attr",
        component: () => import("@/views/product/Attr"),
        meta: {
          title: "平台属性管理",
        },
      },
      {
        path: "sku",
        name: "sku",
        component: () => import("@/views/product/Sku"),
        meta: {
          title: "Sku管理",
        },
      },
      {
        path: "category",
        name: "category",
        component: () => import("@/views/product/Category"),
        meta: {
          title: "分类管理",
        },
      },
      {
        path: "spu",
        name: "spu",
        component: () => import("@/views/product/Spu"),
        meta: {
          title: "Spu管理",
        },
      },
    ],
  },
];
//任意路由:当路径出现错误 重定向
export const anyRoutes = { path: "*", redirect: "/404", hidden: true };

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
