import React, { useEffect, useState } from "react";
import { Form, Input, Radio, FormInstance, Select } from "antd";
import axios from "../../../tools/axios";
interface User {
  userId: string;
  nickName: string;
  phone: string;
  sex: string;
  role: string;
  username: string;
}
interface UserFormProps {
  form: FormInstance;
  isEdit: boolean;
  user: User | null;
}

interface Role {
  roleId: string;
  roleName: string;
}

const UserForm: React.FC<UserFormProps> = ({ form, isEdit, user }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [originUsername, setOriginUsername] = useState<string>("");
  useEffect(() => {
    // 获取所有角色信息
    setOriginUsername(form.getFieldValue("username"));
    const fetchRoles = async () => {
      try {
        setOriginUsername(form.getFieldValue("username"));
        const response = await axios.get("/sys-service/role/list");

        setRoles(response.data);
      } catch (error) {
        console.error("获取角色信息失败", error);
      }
    };
    fetchRoles();
  }, [originUsername]);

  // 检查用户是否存在
  const checkUsername = async (rule: any, value: string) => {
    if (value && value !== user?.username) {
      try {
        const response = await axios.get(
          `/sys-service/user/${value}/${isEdit}`
        );

        if (!response.data) {
          throw new Error("用户名已存在");
        }
      } catch (error) {
        return Promise.reject(new Error(error.message));
      }
    }

    return Promise.resolve();
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: "用户名重复或未输入",
            validator: checkUsername,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="nickName"
        label="姓名"
        rules={[{ required: true, message: "请输入姓名" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="sex" label="性别" rules={[{ required: true }]}>
        <Radio.Group>
          <Radio value={0}>男</Radio>
          <Radio value={1}>女</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[{ required: true, message: "请选择角色" }]}
      >
        <Select>
          {roles.map((role) => (
            <Select.Option key={role.roleId} value={role.roleId}>
              {role.roleName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="phone"
        label="电话"
        rules={[{ required: true, message: "请输入电话" }]}
      >
        <Input />
      </Form.Item>
      {isEdit && (
        <Form.Item
          name="resetPassword"
          label="是否重置密码"
          rules={[{ required: true, message: "请选择是否重置密码" }]}
        >
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </Form.Item>
      )}
    </Form>
  );
};

export default UserForm;
