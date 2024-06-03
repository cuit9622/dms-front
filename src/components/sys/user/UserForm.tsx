// src/components/UserForm.tsx
import React from "react";
import { Form, Input, Radio, FormInstance } from "antd";

interface UserFormProps {
  form: FormInstance;
}

const UserForm: React.FC<UserFormProps> = ({ form }) => (
  <Form form={form} layout="vertical">
    <Form.Item
      name="name"
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
    <Form.Item name="email" label="邮箱">
      <Input />
    </Form.Item>
    <Form.Item
      name="gender"
      label="性别"
      rules={[{ required: true, message: "请选择性别" }]}
    >
      <Radio.Group>
        <Radio value="男">男</Radio>
        <Radio value="女">女</Radio>
      </Radio.Group>
    </Form.Item>
    <Form.Item
      name="role"
      label="角色"
      rules={[{ required: true, message: "请输入角色" }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name="username"
      label="账户名"
      rules={[{ required: true, message: "请输入账户名" }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name="password"
      label="密码"
      rules={[{ required: true, message: "请输入密码" }]}
    >
      <Input.Password />
    </Form.Item>
  </Form>
);

export default UserForm;
