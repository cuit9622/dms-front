import { Button, Form, Input } from 'antd'
import { GlobalContext } from 'app'
import { useContext } from 'react'
import 'scss/avatarUploader.scss'
import axios from 'tools/axios'

//密码的正则表达式
export const passwordRule = {
  pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d.]{6,16}$/,
  message: '密码必须为6~16位且只包含字母数字和小数点,至少有一位字母和数字',
}

export function ChangePassword() {
  const { messageApi } = useContext(GlobalContext)
  const [form] = Form.useForm()

  const onFinish = async (values: any) => {
    let requestData = {
      oldPassword: values.oldPassword,
      newPassword: values.password,
    }
    await axios.put('/auth/password', requestData)
    messageApi.success('用户密码修改成功')
    axios.get('/auth/token')
  }

  return (
    <Form
      name="basic"
      form={form}
      style={{ maxWidth: 400, width: '100%' }}
      onFinish={onFinish}
      layout="vertical"
      autoComplete="off">
      <Form.Item
        label="旧密码"
        name="oldPassword"
        rules={[{ required: true, message: '请输入旧密码' }, passwordRule]}>
        <Input placeholder="" type="password" />
      </Form.Item>
      <Form.Item
        label="新密码"
        name="password"
        rules={[{ required: true, message: '请输入新密码' }, passwordRule]}>
        <Input.Password placeholder="" />
      </Form.Item>
      <Form.Item
        label="确认新密码"
        name="confirmPassword"
        rules={[
          { required: true, message: '' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('两次输入的密码不一致'))
            },
          }),
          passwordRule,
        ]}>
        <Input.Password placeholder="" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '25%' }}>
          修改密码
        </Button>
      </Form.Item>
    </Form>
  )
}
