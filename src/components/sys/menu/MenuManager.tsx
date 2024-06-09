import React, { useEffect, useState } from "react";
import { Table, Button, Modal, message, Tag } from "antd";
import axios from "../../../tools/axios";
import * as ICONS from "@ant-design/icons/";
import MenuModal from "./MenuModal";
import { defaultMethod } from "react-router-dom/dist/dom";

interface MenuItem {
  menuId: number;
  icon: string;
  title: string;
  code: string;
  name: string;
  menuUrl: string;
  routePath: string;
  componentPath: string;
  type: number;
}

const MenuManagement: React.FC = () => {
  // 菜单类型
  const menuType = ["目录", "菜单", "按钮"];
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const antICONS: any = ICONS;
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentMenu, setCurrentMenu] = useState<MenuItem | null>(null);

  const formatPermissions = (menus: any) => {
    return menus.map((menu: any) => ({
      menuId: menu.menu.menuId,
      icon: menu.menu.icon || "",
      title: menu.menu.title || "",
      code: menu.menu.code || "",
      name: menu.menu.name || "",
      menuUrl: menu.menu.menuUrl || "",
      routePath: menu.menu.routePath || "",
      componentPath: menu.menu.componentPath || "",
      type: menu.menu.type,
      orderNum: menu.menu.orderNum,
      children: menu.children ? formatPermissions(menu.children) : "",
    }));
  };

  const fetchMenuData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/sys-service/menu/list");
      setMenuData(formatPermissions(response.data));
    } catch (error) {
      message.error("Failed to fetch menu data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMenuData();
    console.log(menuData);
  }, []);

  const handleAddClick = () => {
    setCurrentMenu(null);
    setIsModalVisible(true);
  };

  const handleEditClick = (menu: MenuItem) => {
    setCurrentMenu(menu);
    setIsModalVisible(true);
  };

  const handleDeleteClick = async (menuId: number) => {
    try {
      await axios.delete(`/sys-service/menu/${menuId}`);
      message.success("Menu deleted successfully");
      fetchMenuData();
    } catch (error) {
      message.error("Failed to delete menu");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleModalOk = async (values: MenuItem) => {
    try {
      if (currentMenu) {
        await axios.put(`/sys-service/menu/${currentMenu.menuId}`, values);
        message.success("Menu updated successfully");
      } else {
        await axios.post("/sys-service/menu", values);
        message.success("Menu added successfully");
      }
      setIsModalVisible(false);
      fetchMenuData();
    } catch (error) {
      message.error("Failed to save menu");
    }
  };

  const columns = [
    {
      title: "菜单名称",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "菜单图标",
      dataIndex: "icon",
      key: "icon",
      render: (text: string) => {
        if (text === "") {
          return <></>;
        }
        const Icon = antICONS[text];
        return <Icon />;
      },
    },
    {
      title: "菜单类型",
      dataIndex: "type",
      key: "type",
      render: (type: number) => {
        const color = ["geekblue", "green", "volcano"];
        return (
          <Tag color={color[type]} key={menuType[type]}>
            {menuType[type]}
          </Tag>
        );
      },
    },
    {
      title: "菜单路径",
      dataIndex: "menuUrl",
      key: "menuUrl",
    },
    {
      title: "路由地址",
      dataIndex: "routePath",
      key: "routePath",
    },
    {
      title: "组件路径",
      dataIndex: "componentPath",
      key: "componentPath",
    },
    {
      title: "排序字段",
      dataIndex: "orderNum",
      key: "orderNum",
    },
    {
      title: "操作",
      key: "action",
      render: (text: string, record: MenuItem) => (
        <span>
          <Button
            type="link"
            onClick={() => handleEditClick(record)}
            style={{
              marginRight: 8,
              backgroundColor: "#1890ff",
              color: "white",
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteClick(record.menuId)}
            style={{ backgroundColor: "#ff4d4f", color: "white" }}
          >
            删除
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAddClick}>
        新增
      </Button>
      <Table
        defaultExpandAllRows={true}
        columns={columns}
        dataSource={menuData}
        loading={loading}
        rowKey={(record) => record.menuId}
        style={{ marginTop: 20 }}
      />
      <MenuModal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
        menuData={menuData}
        currentMenu={currentMenu}
      />
    </div>
  );
};

export default MenuManagement;
