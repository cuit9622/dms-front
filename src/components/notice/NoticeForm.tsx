import { Form, FormInstance, Input } from 'antd'
interface NoticeFormProps {
  form: FormInstance
  isEdit: boolean
}

const NoticeForm: React.FC<NoticeFormProps> = ({ form, isEdit }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="title"
        label="标题"
        rules={[
          {
            required: true,
            message: '请输入标题！',
          },
        ]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="content"
        label="内容"
        rules={[{ required: true, message: '请输入内容！' }]}>
        <Input />
      </Form.Item>
    </Form>
  )
}

export default NoticeForm
