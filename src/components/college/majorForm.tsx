import React, { useEffect, useState } from 'react'
import { Form, Input, InputNumber, FormInstance, Select } from 'antd'
import type { SelectProps } from 'antd'
import axios from '../../tools/axios'

interface CollegeFormProps {
  form: FormInstance
  isEdit: boolean
  majorId: String
  collegeOptions: SelectProps['options']
}

// 数据类型
interface Major {
  majorId: string
  collegeId: string
  key: React.Key
  majorName: string
  collegeName: string
  orderNum: number
}

const MajorForm: React.FC<CollegeFormProps> = ({
  form,
  isEdit,
  majorId,
  collegeOptions,
}) => {
  useEffect(() => {
    //编辑还是新增
    if (isEdit) {
      const fetchRoles = async () => {
        const response = await axios.get(`/college/major/getOne/${majorId}`)
        form.setFieldsValue(response.data)
      }
      fetchRoles()
    } else {
      form.resetFields()
    }
  }, [majorId])

  const onChange = (value: string) => {
    console.log(`selected ${value}`)
  }

  return (
    <Form style={{ width: '200px' }} form={form} layout="vertical">
      <Form.Item
        name="majorName"
        label="专业名称"
        rules={[{ required: true, message: '请输入学院名称' }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="collegeId"
        label="所属学院"
        rules={[{ required: true, message: '请选择所属学院' }]}>
        <Select
          placeholder="选择学院"
          optionFilterProp="children"
          onChange={onChange}
          options={collegeOptions}
        />
      </Form.Item>
      <Form.Item
        name="orderNum"
        label="专业序号"
        rules={[{ required: true, message: '请输入学院序号' }]}>
        <InputNumber style={{ width: '200px' }} />
      </Form.Item>
    </Form>
  )
}

export default MajorForm
