import * as ICONS from '@ant-design/icons/';
import lodable from "@loadable/component";
import { Login } from "pages/login";
import Main from "pages/main";
import { Navigate, createBrowserRouter } from "react-router-dom";

interface MenuItem {
    menu: {
        menuId: number
        parentId: number
        title: string
        code: string
        name: string
        menuUrl: string
        routePath: string
        componentPath: string
        type: number
        icon: string
        orderNum: number
    }
    children: MenuItem[] | undefined | null
}
export const defaultRouter = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "*",
        element: <Navigate to="/login"></Navigate>,
    },
]);

export const generateRouter = (routerStr: string | null) => {
    if (routerStr == null) {
        return defaultRouter
    }

    const menuTree = JSON.parse(routerStr)
    const antICONS: any = ICONS
    function createRouter(list: MenuItem[]) {
        let router: any[] = [];
        if (list && list.length > 0) {
            list.map((item: any) => {
                const children = item.children;
                item = item.menu;
                const Component = lodable(() => {
                    return import(item.componentPath);
                });
                if (children && children.length > 0) {
                    router.push({
                        path: item.routePath,
                        children: createRouter(children),
                    });
                } else {
                    router.push({
                        path: item.routePath,
                        element: <Component />,
                    });
                }
            });
        }

        return router
    }
    const createMenu = (menuList: MenuItem[]): any[] => {
        let arr: any[] = [];
        if (menuList && menuList.length > 0) {
            menuList.map((item: any) => {
                const menu = item.menu;
                if (!item.icon) {
                    console.log(item)
                }
                const ICON = antICONS[item.menu.icon]
                if (item.children && item.children.length > 0) {
                    arr.push({
                        key: menu.menuId,
                        icon: <ICON />,
                        label: menu.title,
                        children: createMenu(item.children),
                    });
                } else {
                    arr.push({
                        key: menu.menuId,
                        icon: <ICON />,
                        label: menu.title,
                    });
                }
            });
        }
        return arr
    };
    const router = createRouter(menuTree)

    //无效的路径重定向到第一个页面
    let path
    if (router[0].children) {
        path = router[0].children[0].path
    } else {
        path = router[0].path
    }
    return createBrowserRouter([
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/",
            element: <Main menu={createMenu(menuTree)} />,
            children: router,
        },
        {
            path: "*",
            element: <Navigate to={path}></Navigate>,
        },
    ]);
}