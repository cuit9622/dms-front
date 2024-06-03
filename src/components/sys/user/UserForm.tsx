import React, { useEffect, useState } from "react";
import { Form, Input, Radio, FormInstance, Select } from "antd";
import axios from "../../../tools/axios";

interface UserFormProps {
  form: FormInstance;
}

interface Role {
  roleId: number;
  roleName: string;
}

const UserForm: React.FC<UserFormProps> = ({ form }) => {
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    // 获取所有角色信息
    const fetchRoles = async () => {
      try {
        const response = await axios.get("/sys-service/role/list");
        setRoles(response.data);
      } catch (error) {
        console.error("获取角色信息失败", error);
      }
    };

    fetchRoles();
  }, []);

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="nickName"
        label="姓名"
        rules={[{ required: true, message: "请输入姓名" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone"
        label="电话"
        rules={[{ required: true, message: "请输入电话" }]}
      >
        <Input />
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
        name="username"
        label="账户名"
        rules={[{ required: true, message: "请输入账户名" }]}
      >
        <Input />
      </Form.Item>
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
    </Form>
  );
};

export default UserForm;
