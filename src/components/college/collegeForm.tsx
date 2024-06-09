import React, { useEffect } from 'react'
import { Form, Input, InputNumber, FormInstance } from 'antd'
import axios from '../../tools/axios'

interface CollegeFormProps {
  form: FormInstance
  isEdit: boolean
  collegeId: String
}

// 数据类型
interface College {
  collegeId: string
  key: React.Key
  collegeName: string
  orderNum: number
  createTime: Date
}

const CollegeForm: React.FC<CollegeFormProps> = ({
  form,
  isEdit,
  collegeId,
}) => {
  useEffect(() => {
    if (isEdit) {
      const fetchRoles = async () => {
        const response = await axios.get(`/college/college/getOne/${collegeId}`)
        form.setFieldsValue(response.data)
      }
      fetchRoles()
    } else {
      form.resetFields()
    }
  }, [collegeId])

  return (
    <Form style={{ width: '200px' }} form={form} layout="vertical">
      <Form.Item
        name="collegeName"
        label="学院名称"
        // style={{ width: '200px' }}
        rules={[{ required: true, message: '请输入学院名称' }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="orderNum"
        label="学院序号"
        // style={{ width: '200px' }}
        rules={[{ required: true, message: '请输入学院序号' }]}>
        <InputNumber style={{ width: '200px' }} />
      </Form.Item>
    </Form>
  )
}

export default CollegeForm
