import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, TreeSelect } from 'antd';

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

interface MenuModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: MenuItem) => void;
  menuData: MenuItem[];
  currentMenu: MenuItem | null;
}

const { Option } = Select;

const MenuModal: React.FC<MenuModalProps> = ({ visible, onCancel, onOk, menuData, currentMenu }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (currentMenu) {
      form.setFieldsValue(currentMenu);
    } else {
      form.resetFields();
    }
  }, [currentMenu, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
    } catch (error) {
      console.error('Failed to validate form:', error);
    }
  };

  return (
    <Modal
      title={currentMenu ? '编辑菜单' : '新增菜单'}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="type"
          label="菜单类型"
          rules={[{ required: true, message: '请选择菜单类型' }]}
        >
          <Select>
            <Option value={0}>目录</Option>
            <Option value={1}>菜单</Option>
            <Option value={2}>按钮</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="parentId"
          label="上级菜单"
          rules={[{ required: true, message: '请选择上级菜单' }]}
        >
          <TreeSelect
            treeData={menuData.filter((item) => item.type !== 2)}
            placeholder="请选择上级菜单"
            treeDefaultExpandAll
            fieldNames={{ label: 'title', value: 'menuId', children: 'children' }}
          />
        </Form.Item>
        <Form.Item
          name="title"
          label="菜单名称"
          rules={[{ required: true, message: '请输入菜单名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="name"
          label="路由名称"
          rules={[{ required: true, message: '请输入路由名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="componentPath" label="组件路径">
          <Input />
        </Form.Item>
        <Form.Item name="routePath" label="路由地址">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MenuModal;
