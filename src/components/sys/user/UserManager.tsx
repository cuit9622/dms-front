import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Radio, message } from "antd";
import axios from "../../../tools/axios";
import UserForm from "./UserForm";

interface User {
  userId: number;
  nickName: string;
  phone: string;
  sex: string;
  role: string;
  username: string;
}

const UserManager: React.FC = () => {
  const tsex = ["男", "女"];

  const [users, setUsers] = useState<User[]>([]);
  // 处理是否弹出探窗
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  // 默认的页数
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  useEffect(() => {
    fetchUsers(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  // 获取用户信息
  const fetchUsers = async (page: number, pageSize: number) => {
    try {
      const response = await axios.get("/sys-service/user/list", {
        params: { page: page, pageSize: pageSize },
      });
      const data = response.data;
      setUsers(data.records);
      setPagination({ ...pagination, total: data.total });
    } catch (error) {
      message.error("获取用户失败");
    }
  };

  // 处理表格改变的函数
  const handleTableChange = (pagination: any) => {
    // fetchUsers(pagination.current, pagination.pageSize);
    setPagination(pagination);
  };

  const handleAdd = () => {
    setIsModalVisible(true);
    setIsEdit(false);
    form.resetFields();
  };

  const handleEdit = async (user: User) => {
    try {
      const response = await axios.get(`/sys-service/role/list/${user.userId}`);
      const userWithRole = { ...user, roleId: response.data.roleId };
      setIsModalVisible(true);
      setIsEdit(true);
      setCurrentUser(userWithRole);
      form.setFieldsValue({ ...userWithRole, resetPassword: false });
    } catch (error) {
      message.error("获取用户角色信息失败");
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      await axios.delete(`/sys-service/user/list/${userId}`);
      fetchUsers(pagination.current, pagination.pageSize);
      message.success("用户删除成功");
    } catch (error) {
      message.error("删除用户失败");
    }
  };

  // 处理是新增还是删除用户
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // 编辑
      if (isEdit && currentUser) {
        await axios.put(`/sys-service/user/edit/${currentUser.userId}`, values);
        message.success("修改成功");
      } else {
        await axios.post("/sys-service/user/add", values);
        message.success("添加成功");
      }
      fetchUsers(pagination.current, pagination.pageSize);
      setIsModalVisible(false);
    } catch (error) {
      message.error("操作失败");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    { title: "用户名", dataIndex: "username", key: "username" },
    { title: "姓名", dataIndex: "nickName", key: "nickName" },
    { title: "电话", dataIndex: "phone", key: "phone" },
    { title: "性别", dataIndex: "sex", key: "sex",render: (value)=><>{tsex[value]}</> },

    {
      title: "操作",
      key: "actions",
      render: (_: any, record: User) => (
        <span>
          <Button onClick={() => handleEdit(record)}>编辑</Button>
          <Button danger onClick={() => handleDelete(record.userId)}>
            删除
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd}>
        新增用户
      </Button>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="userId"
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
        onChange={handleTableChange}
      />
      <Modal
        title={isEdit ? "编辑用户" : "新增用户"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <UserForm form={form} isEdit={isEdit} />
      </Modal>
    </div>
  );
};

export default UserManager;
