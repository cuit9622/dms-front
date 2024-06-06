import React, { useEffect, useState } from "react";
import { Modal, Form, Checkbox, Tree } from "antd";
import axios from "../../../tools/axios";

const PermissionForm: React.FC<{
  visible: boolean;
  role: any;
  permissions: any[];
  onCancel: () => void;
  onSave: (permissions: any) => void;
}> = ({ visible, role, permissions, onCancel, onSave }) => {
  const [form] = Form.useForm();
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  
  const formatPermissions = (permissions: any) => {
    return permissions.map((perm: any) => ({
      title: perm.menu.title,
      key: perm.menu.menuId,
      children: perm.children ? formatPermissions(perm.children) : [],
    }));
  };

  const fetchRolePermissions = async (roleId: any) => {
    const response = await axios.get(`/sys-service/menu/list/${roleId}`);
    console.log(response);  
    setCheckedKeys(response.data);
  };

  // 确保每次打开都是最新的数据
  useEffect(() => {   
    if (visible) {
      fetchRolePermissions(role.roleId)
    }
  }, [visible, role]);
  return (
    <Modal
      title={`为 ${role?.roleName || "角色"} 分配权限`}
      visible={visible}
      onOk={() => {
        form.validateFields().then((values) => {
          onSave(values.permissions);
          form.resetFields();
        });
      }}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ permissions: role?.permissions }}
      >
        <Form.Item name="permissions">
          <Checkbox.Group>
            <Tree
              checkable
              treeData={formatPermissions(permissions)}
              defaultExpandAll
              checkedKeys={checkedKeys}
              selectedKeys={selectedKeys}
            />
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PermissionForm;
