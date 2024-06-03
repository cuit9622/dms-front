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

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  // 默认的页数
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchUsers(pagination.current, pagination.pageSize);
  }, []);

  // 获取用户信息
  const fetchUsers = async (page: number, pageSize: number) => {
    try {
      const response = await axios.get("/sys-service/users", {
        params: { page, pageSize },
      });
      const data = response.data;
      
      setUsers(data.records);
      setPagination({ ...pagination, total: data.total });
    } catch (error) {
      message.error("获取用户失败");
    }
  };

  const handleTableChange = (pagination: any) => {
    fetchUsers(pagination.current, pagination.pageSize);
    setPagination(pagination);
  };

  const handleAdd = () => {
    setIsModalVisible(true);
    setIsEdit(false);
    form.resetFields();
  };

  const handleEdit = (user: User) => {
    setIsModalVisible(true);
    setIsEdit(true);
    setCurrentUser(user);
    form.setFieldsValue(user);
  };

  const handleDelete = async (userId: number) => {
    try {
      await axios.delete(`/sys-service/users/${userId}`);
      fetchUsers(pagination.current, pagination.pageSize);
      message.success("用户删除成功");
    } catch (error) {
      message.error("删除用户失败");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEdit && currentUser) {
        await axios.put(`/sys-service/users/${currentUser.userId}`, values);
      } else {
        await axios.post("/sys-service/users", values);
      }
      fetchUsers(pagination.current, pagination.pageSize);
      setIsModalVisible(false);
      message.success("用户保存成功");
    } catch (error) {
      message.error("保存用户失败");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    { title: "用户名", dataIndex: "username", key: "username" },
    { title: "姓名", dataIndex: "nickName", key: "nickName" },
    { title: "电话", dataIndex: "phone", key: "phone" },

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
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
      />
      <Modal
        title={isEdit ? "编辑用户" : "新增用户"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <UserForm form={form} />
      </Modal>
    </div>
  );
};

export default UserManagement;
