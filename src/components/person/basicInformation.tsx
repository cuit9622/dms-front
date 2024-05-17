import { Button, Form, Input, Radio, Typography } from 'antd'
import { GlobalContext } from 'app'
import MyUpload from 'components/myUpload'
import { useContext, useEffect, useState } from 'react'
import 'scss/avatarUploader.scss'
import axios from 'tools/axios'

export function BasicInformation(props: any) {
  const role = JSON.parse(
    atob((localStorage.getItem('token') as string).split('.')[1])
  ).selectedRole
  const { user, messageApi } = useContext(GlobalContext)
  const [form] = Form.useForm()
  const [fileName, setFileName] = useState(user.avatar)

  useEffect(() => {
    form.setFieldsValue(user)
  }, [user])
  const onFinish = (values: any) => {
    let requestData = {
      phone: values.phone,
      email: values.email,
      avatar: fileName,
    }
    axios.put('/auth/info', null, { params: requestData }).then(() => {
      messageApi.success('成功修改个人信息')
      //成功修改后延时刷新页面
      setTimeout(() => {
        location.reload()
      }, 800)
    })
  }

  return (
    <Form
      name="basic"
      form={form}
      style={{ maxWidth: 620, width: '100%' }}
      onFinish={onFinish}
      layout="vertical"
      autoComplete="off">
      <div style={{ display: 'flex' }}>
        <div style={{ width: '70%' }}>
          <Form.Item label="姓名" name="realName" rules={[{ message: '' }]}>
            <Input placeholder="" disabled />
          </Form.Item>
          <Form.Item label="性别" name="sex" rules={[{ message: '' }]}>
            <Radio.Group disabled>
              <Radio value="男">男</Radio>
              <Radio value="女">女</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="学院" name="collegeName" rules={[{ message: '' }]}>
            <Input placeholder="" disabled />
          </Form.Item>
          {role === 'student' ? (
            <>
              <Form.Item
                label="专业"
                name="majorName"
                rules={[{ message: '' }]}>
                <Input placeholder="" disabled />
              </Form.Item>
              <Form.Item label="年级" name="grade" rules={[{ message: '' }]}>
                <Input placeholder="" disabled />
              </Form.Item>
              <Form.Item
                label="班级"
                name="classNumber"
                rules={[{ message: '' }]}>
                <Input placeholder="" disabled />
              </Form.Item>
            </>
          ) : null}
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              {
                required: true,
                message: '请输入邮箱',
                pattern: /^\w+@.+$/,
              },
            ]}>
            <Input placeholder="" type="email" />
          </Form.Item>
          <Form.Item
            label="手机号"
            name="phone"
            rules={[
              {
                required: true,
                message: '请输入手机号',
                pattern: /^[1]\d{10}$/,
              },
            ]}>
            <Input placeholder="" maxLength={11} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '30%' }}>
              更新基本信息
            </Button>
          </Form.Item>
        </div>
        <div
          id="avatarUploader"
          style={{ width: 180, height: 180, marginLeft: 50 }}>
          <Typography>头像</Typography>
          <MyUpload
            setName={setFileName}
            fileList={
              user.avatar ? '/api/img/download?name=' + user.avatar : undefined
            }
          />
        </div>
      </div>
    </Form>
  )
}
