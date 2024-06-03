// src/components/UserForm.tsx
import React from "react";
import { Form, Input, Radio, FormInstance } from "antd";

interface UserFormProps {
  form: FormInstance;
}

const UserForm: React.FC<UserFormProps> = ({ form }) => (
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
    <Form.Item name="resetPassword" label="是否重置密码" rules={[{ required: true, message: '请选择是否重置密码' }]}>
      <Radio.Group>
        <Radio value={true}>是</Radio>
        <Radio value={false}>否</Radio>
      </Radio.Group>
    </Form.Item>
  </Form>
);

export default UserForm;
