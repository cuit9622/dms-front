import * as ICONS from "@ant-design/icons/";
import lodable from "@loadable/component";
import { BasicInformation } from "components/person/basicInformation";
import { ChangePassword } from "components/person/changePassword";
import Person from "components/person/person";
import { Login } from "pages/login";
import Main from "pages/main";
import { Navigate, createBrowserRouter } from "react-router-dom";

interface MenuItem {
  menu: {
    menuId: number;
    parentId: number;
    title: string;
    code: string;
    name: string;
    menuUrl: string;
    routePath: string;
    componentPath: string;
    type: number;
    icon: string;
    orderNum: number;
  };
  children: MenuItem[] | undefined | null;
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
    return defaultRouter;
  }

  const menuTree = JSON.parse(routerStr);
  const antICONS: any = ICONS;
  const map: any = {};
  function createMenuAndRouter(list: MenuItem[]): any[] {
    const menuArr: any[] = [];
    const routeArr: any[] = [];

    for (const item of list) {
      const menu = item.menu;
      const key = menu.routePath;
      const children = item.children;
      const ICON = antICONS[item.menu.icon];

      map[key] = menu.title;
      if (children && children.length > 0) {
        const [childMenu, childRoute] = createMenuAndRouter(children);
        menuArr.push({
          key: key,
          icon: <ICON />,
          label: menu.title,
          children: childMenu,
        });
        routeArr.push({
          path: key,
          children: childRoute,
        });
      } else {
        console.log(menu.componentPath);

        const Component = lodable(
          () => import(`../components/${menu.componentPath}`)
        );
        menuArr.push({
          key: key,
          icon: <ICON />,
          label: menu.title,
        });
        routeArr.push({
          path: key,
          element: <Component />,
        });
      }
    }
    return [menuArr, routeArr];
  }

  const [menu, router] = createMenuAndRouter(menuTree);

  //无效的路径重定向到第一个页面
  let path;
  if (router[0].children) {
    path = router[0].children[0].path;
  } else {
    path = router[0].path;
  }
  router.push({
    path: "person",
    element: <Person />,
    children: [
      { path: "basicInformation", element: <BasicInformation /> },
      {
        path: "changePassword",
        element: <ChangePassword />,
      },
    ],
  });
  return createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <Main menu={menu} />,
      children: router,
    },
    {
      path: "*",
      element: <Navigate to={path}></Navigate>,
    },
  ]);
};
