
import Home from "../views/home/index.vue";

export const routes = [
    {
        path: "*",
        component: () => import('../views/error/err404.vue'),
        hidden: true
    },
    {
        path: "/401",
        component: () => import('../views/error/err401.vue'),
        name: "401",
        hidden: true
    },
    {
        path: "/500",
        component: () => import('../views/error/err500.vue'),
        name: "500",
        hidden: true
    },
    {
        path: "/",
        component: Home,
        redirect: "/readme/main",
        name: "首页",
        hidden: true
    },
    {
        path: "/readme",
        component: Home,
        icon: "icon-kongzhitai",
        name: "控制台",
        noDropdown: true,
        children: [
            {
                path: "main",
                component: () => import('../views/home/main')
            }
        ]
    },
    {
        path: "/login",
        component: () => import('../views/login.vue'),
        meta: {
            title: ''
        }
    },
]

export const authRoutes = [
    {
        path: "/admin",
        component: Home,
        icon: "icon-gonggongquanxian",
        name: "权限管理",
        meta: {
            authRule: ["/auth"]
        },
        children: [
            {
                path: "index",
                component: () => import('../views/admin/authAdmin.vue'),
                name: "管理员管理",
                icon: "",
                meta: {
                    authRule: ["/admin/list"]
                },
            },
            {
                path: "rule",
                component: () => import('../views/admin/adminPermissionRule.vue'),
                name: "权限规则",
                icon: "",
                meta: {
                    authRule: ["/admin/permissionRule/list"]
                },
            }
        ]
    },
    {
        path: "/system",
        component: Home,
        icon: "icon-xitongguanli",
        name: "系统管理",
        meta: {
            authRule: ["/system"]
        },
        children: [
            {
                path: "engine",
                component: () => import('../views/system/engine.vue'),
                name: "引擎配置",
                icon: "",
                meta: {
                    authRule: ["/admin/engine/list"]
                },
            },
            {
                path: "app",
                component: () => import('../views/system/app.vue'),
                name: "应用列表",
                icon: "",
                meta: {
                    authRule: ["/admin/app/list"]
                },
            },
        ]
    },
    {
        path: "/address",
        component: Home,
        icon: "icon-chanpin",
        name: "地址管理",
        meta: {
            authRule: ["/address"]
        },
        children: [
            {
                path: "address",
                component: () => import('../views/address/address.vue'),
                name: "归集列表",
                icon: "",
                meta: {
                    authRule: ["/admin/address/list"]
                },
            },
        ]
    },
]