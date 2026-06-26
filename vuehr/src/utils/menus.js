import {getRequest} from "./api";

// Vite 用 import.meta.glob 预扫描所有视图组件，替代 webpack 的 require([...], resolve)。
// 返回的是 { '../views/emp/EmpBasic.vue': () => import(...) } 形式的懒加载映射。
const viewModules = import.meta.glob('../views/**/*.vue');

// 根据组件名前缀解析出它在 views 下的相对路径（与原 require 分支逻辑等价）。
const resolveComponent = (component) => {
    let path;
    if (component.startsWith("Home")) {
        path = `../views/${component}.vue`;
    } else if (component.startsWith("Emp")) {
        path = `../views/emp/${component}.vue`;
    } else if (component.startsWith("Per")) {
        path = `../views/per/${component}.vue`;
    } else if (component.startsWith("Sal")) {
        path = `../views/sal/${component}.vue`;
    } else if (component.startsWith("Sta")) {
        path = `../views/sta/${component}.vue`;
    } else if (component.startsWith("Sys")) {
        path = `../views/sys/${component}.vue`;
    }
    return viewModules[path];
}

export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return;
    }
    getRequest("/system/config/menu").then(data => {
        if (data) {
            let fmtRoutes = formatRoutes(data);
            router.addRoutes(fmtRoutes);
            store.commit('initRoutes', fmtRoutes);
        }
    })
}
export const formatRoutes = (routes) => {
    let fmRoutes = [];
    routes.forEach(router => {
        let {
            path,
            component,
            name,
            meta,
            iconCls,
            children
        } = router;
        if (children && children instanceof Array) {
            children = formatRoutes(children);
        }
        let fmRouter = {
            path: path,
            name: name,
            iconCls: iconCls,
            meta: meta,
            children: children,
            // Vue2 异步组件：工厂函数返回 Promise（Vite 懒加载）。
            component: resolveComponent(component)
        }
        fmRoutes.push(fmRouter);
    })
    return fmRoutes;
}