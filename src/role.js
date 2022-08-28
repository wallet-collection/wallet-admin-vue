import router from "./router/index";
import store from "./store/index";
import i18n from "./locale";
import {ROUTER_WHITELIST} from "./config";
import {getToken} from "./utils/userAuth";
import {Message} from "element-ui";
import {routes, authRoutes} from "./router/routes";

router.beforeEach(async (to, from, next) => {
    if (to.meta.title) {
        document.title = i18n.t(to.meta.title);
    }

    if (to.path === "/login") {
        if (getToken()) {
            next({ path: "/" });
            return
        }
        next()
        return
    }

    if (!getToken()) {
        next({
            path: "/login"
        })
    }

    let authRules = store.getters.authRules
    if (!authRules || authRules.length === 0) {
        try {
            authRules = await store.dispatch("getAuthRule")
        }catch (e) {
            await store.dispatch("logout")
            next({
                path: "/login"
            })
            return
        }
        let accessedRouters = filterAsyncRouter(authRoutes, authRules);
        // 生成可访问的路由表
        router.addRoutes(accessedRouters); // 动态添加可访问路由表
        // 设置左边导航栏
        store.dispatch("setRouters", routes.concat(accessedRouters))
            .then(() => {
            });
        next({...to}); // hack方法 确保addRoutes已完成
    }

    if (ROUTER_WHITELIST.includes(to.path)) {
        next()
        return;
    }

    // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
    if (hasRole(authRules, to.meta.authRule)) {
        next(); //
        return;
    }

    Message.error("权限验证失败，请联系管理员~");
    next({
        path: "/401",
        query: {noGoBack: true}
    });

    next();
})

function hasRole(authRules, permissionAuthRules) {
    if (!authRules || authRules.length <= 0) {
        return false;
    }
    if (authRules.indexOf("admin") >= 0) return true; // admin权限 直接通过
    if (!permissionAuthRules) return true;
    return authRules.some(role => permissionAuthRules.indexOf(role) >= 0);
}

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param authRules
 * @param route
 */
function hasRouterRole(authRules, route) {
    if (
        authRules.indexOf("admin") >= 0 ||
        !route.meta ||
        !route.meta.authRule
    ) {
        return true;
    }
    return authRules.some(
        authRule => route.meta.authRule.indexOf(authRule) >= 0
    );
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param authRules
 */
function filterAsyncRouter(asyncRouterMap, authRules) {
    return asyncRouterMap.filter(route => {
        if (hasRouterRole(authRules, route)) {
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children, authRules);
            }
            return true;
        }
        return false;
    });
}