import { Form, Input, Radio, Select } from 'antd'

const StudentForm: React.FC = () => {
  return (
    <Form layout="vertical">
      <Form.Item
        name="name"
        label="姓名"
        rules={[
          {
            required: true,
            message: '姓名重复或未输入',
          },
        ]}>
        <Input />
      </Form.Item>
      <Form.Item name="sex" label="性别" rules={[{ required: true }]}>
        <Radio.Group>
          <Radio value={0}>男</Radio>
          <Radio value={1}>女</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="stuNum"
        label="学号"
        rules={[{ required: true, message: '请输入学号' }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="college"
        label="学院"
        rules={[{ required: true, message: '请选择学院' }]}>
        <Select></Select>
      </Form.Item>
      <Form.Item
        name="major"
        label="专业"
        rules={[{ required: true, message: '请选择专业' }]}>
        <Select></Select>
      </Form.Item>
      <Form.Item
        name="class"
        label="班级"
        rules={[{ required: true, message: '请选择班级' }]}>
        <Select></Select>
      </Form.Item>
      <Form.Item
        name="phone"
        label="电话"
        rules={[{ required: true, message: '请输入电话' }]}>
        <Input />
      </Form.Item>
    </Form>
  )
}

export default StudentForm
