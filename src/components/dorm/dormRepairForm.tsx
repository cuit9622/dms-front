import React, { useEffect } from 'react'
import { Form, Input, InputNumber, FormInstance } from 'antd'
import axios from '../../tools/axios'

interface CollegeFormProps {
  form: FormInstance
  isEdit: boolean
  repairId: number
  record: DormRepair[]
}

// 数据类型
interface DormRepair {
  key: React.Key
  repairId: number
  username: string
  userId: number
  phone: number
  dormName: string
  repairText: string //报修理由
  status: string //报修状态
  repairTime: Date
}

const DormRepairForm: React.FC<CollegeFormProps> = ({
  form,
  isEdit,
  repairId,
  record,
}) => {
  useEffect(() => {
    if (isEdit) {
      // const fetchRoles = async () => {
      //   const response = await axios.get(`/college/college/getOne/${repairId}`)
      //   form.setFieldsValue(response.data)
      // }
      // fetchRoles()
      form.setFieldsValue(record[0])
    } else {
      form.resetFields()
    }
  }, [repairId])

  return (
    <Form
      style={{
        width: '200px',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      form={form}
      layout="vertical">
      <Form.Item
        name="dormName"
        label="宿舍"
        rules={[{ required: true, message: '请输入宿舍' }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="username"
        label="联系人"
        rules={[{ required: true, message: '请输入联系人' }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="phone"
        label="联系电话"
        rules={[
          {
            required: true,
            message: '请输入正确电话',
            pattern: /^1[3-9]\d{9}$/,
          },
        ]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="repairText"
        label="报修信息"
        rules={[{ required: true, message: '请输入报修信息' }]}>
        <Input />
      </Form.Item>
    </Form>
  )
}

export default DormRepairForm
