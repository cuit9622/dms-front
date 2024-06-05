import React, { useState, useEffect } from "react";
import { Button, Table, Modal, message, Input } from "antd";
import axios from "../../../tools/axios";
import RoleForm from "./RoleForm";
import PermissionForm from "./PermissionForm";

const RoleManager: React.FC = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  // 控制编辑或新增的窗口
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 控制分配权限的窗口
  const [isPermissionModalVisible, setIsPermissionModalVisible] =
    useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const [searchText, setSearchText] = useState<string>("");

  // 默认的页数
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  useEffect(() => {
    fetchRoles(pagination.current, pagination.pageSize, searchText);
    fetchPermissions();
  }, [editingRole]);

  const fetchRoles = async (
    page: number,
    pageSize: number,
    searchText: string
  ) => {
    const resp = await axios.get("/sys-service/role/list", {
      params: { page, pageSize, roleName: searchText },
    });
    const data = resp.data;

    setRoles(data.records);
    setPagination({ ...pagination, total: data.total });
  };

  const fetchPermissions = async () => {
    const response = await axios.get("/sys-service/permissions");
    setPermissions(response.data);
  };

  const showAddModal = () => {
    setEditingRole(null);
    setIsModalVisible(true);
  };

  const showEditModal = (role: any) => {
    setEditingRole(role);
    setIsModalVisible(true);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchRoles(1, pagination.pageSize, value);
  };

  const handleDelete = (roleId: any) => {
    Modal.confirm({
      title: "确认删除",
      content: "你确定要删除这个角色吗？",
      onOk: async () => {
        const resp = await axios.delete(`/sys-service/role/${roleId}`);
        fetchRoles(pagination.current, pagination.pageSize, searchText);
        message.success(resp.data);
      },
    });
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const handleAddOrUpdate = () => {
    async (role: any) => {
      if (editingRole) {
        const resp = await axios.put(`/sys-service/role/${role.roleId}`, role);
        message.success(resp.data);
      } else {
        const resp = await axios.post("/sys-service/roles", role);
        message.success(resp.data);
      }
      fetchRoles(pagination.current, pagination.pageSize, searchText);
      setIsModalVisible(false);
    };
  };

  const columns = [
    {
      title: "角色名称",
      dataIndex: "roleName",
      key: "roleName",
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
    },
    {
      title: "操作",
      key: "action",
      render: (text: any, record: any) => (
        <>
          <Button
            type="link"
            onClick={() => showEditModal(record)}
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
            onClick={() => {
              setEditingRole(record);
              setIsPermissionModalVisible(true);
            }}
            style={{
              marginRight: 8,
              backgroundColor: "#1890ff",
              color: "white",
            }}
          >
            分配权限
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.roleId)}
            style={{ backgroundColor: "#ff4d4f", color: "white" }}
          >
            删除
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={showAddModal}>
        新增
      </Button>
      <Input.Search
        placeholder="输入名称进行搜索"
        onSearch={handleSearch}
        style={{ width: 200 }}
        allowClear
      />
      <Table
        columns={columns}
        dataSource={roles}
        rowKey="roleId"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true, // 显示每页大小选择器
          pageSizeOptions: [5, 10, 15, 20],
          showQuickJumper: true, // 显示快速跳转
          onChange: handleTableChange,
          onShowSizeChange: handleTableChange,
        }}
      />

      <RoleForm
        visible={isModalVisible}
        role={editingRole}
        onCancel={() => setIsModalVisible(false)}
        onSave={handleAddOrUpdate}
      />

      <PermissionForm
        visible={isPermissionModalVisible}
        role={editingRole}
        permissions={permissions}
        onCancel={() => setIsPermissionModalVisible(false)}
        onSave={(permissions) => {
          console.log("分配的权限: ", permissions);
          setIsPermissionModalVisible(false);
          message.success("权限分配成功");
        }}
      />
    </div>
  );
};

export default RoleManager;
