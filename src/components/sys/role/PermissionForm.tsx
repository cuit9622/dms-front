import React, { useEffect } from "react";
import { Modal, Form, Checkbox, Tree } from "antd";

const PermissionForm: React.FC<{
  visible: boolean;
  role: any;
  permissions: any[];
  onCancel: () => void;
  onSave: (permissions: any) => void;
}> = ({ visible, role, permissions, onCancel, onSave }) => {
  const [form] = Form.useForm();

  const formatPermissions = (permissions: any) => {
    return permissions.map((perm: any) => ({
      title: perm.title,
      key: perm.code,
      children: perm.children ? formatPermissions(perm.children) : [],
    }));
  };

  // 确保每次打开都是最新的数据
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ permissions: role?.permissions || [] });
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
            />
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PermissionForm;
