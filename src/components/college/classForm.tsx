import React, { useEffect, useState } from 'react'
import { Form, Input, InputNumber, FormInstance, Select } from 'antd'
import axios from '../../tools/axios'

interface CollegeFormProps {
  form: FormInstance
  isEdit: boolean
  classId: number
  record: Class[]
}

// 数据类型
interface Class {
  majorId: number
  collegeId: number
  classId: number
  key: React.Key
  majorName: string
  collegeName: string
  className: string
  classYear: string
  orderNum: number
}

const ClassForm: React.FC<CollegeFormProps> = ({
  form,
  isEdit,
  classId,
  record,
}) => {
  const [collegeInfo, setCollegeInfo] = useState({
    colleges: [],
    isSelected: false,
  })
  const [majorInfo, setMajorInfo] = useState({
    majors: [],
    isSelected: false,
  })
  useEffect(() => {
    handleColleges()
  }, [])
  useEffect(() => {
    setCollegeInfo({ ...collegeInfo, isSelected: false })
    //编辑还是新增
    if (isEdit) {
      form.setFieldsValue(record[0])
      setCollegeInfo({ ...collegeInfo, isSelected: true })
    } else {
      form.resetFields()
    }
  }, [classId])

  const onChange = (value: string) => {
    console.log(`selected ${value}`)
  }

  // 获取所有学院
  const handleColleges = async () => {
    const resp = await axios.get('/college/college/getAll')
    setCollegeInfo({ ...collegeInfo, colleges: resp.data })
  }

  // 获取所有专业
  const handleMajors = async () => {
    form.setFieldValue('majorId', '')
    const resp = await axios.get(
      `/college/major/getAll/${form.getFieldValue('collegeId')}`
    )

    setMajorInfo({ ...majorInfo, majors: resp.data })
    setCollegeInfo({ ...collegeInfo, isSelected: true })
  }

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="className"
        label="班级名称"
        rules={[{ required: true, message: '请输入班级名称' }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="collegeId"
        label="学院名称"
        rules={[{ required: true, message: '请选择学院' }]}>
        <Select
          onSelect={handleMajors}
          showSearch
          placeholder="搜索学院关键字"
          optionFilterProp="children"
          filterOption={(input, option) =>
            ((option?.label ?? '') as any).includes(input)
          }
          options={collegeInfo.colleges.map(
            (item: { collegeId: number; collegeName: String }) => {
              return {
                value: item.collegeId,
                label: item.collegeName,
              }
            }
          )}></Select>
      </Form.Item>
      <Form.Item
        name="majorName"
        label="专业名称"
        rules={[{ required: true, message: '请选择专业' }]}>
        <Select
          disabled={!collegeInfo.isSelected}
          showSearch
          placeholder="搜索专业关键字"
          optionFilterProp="children"
          filterOption={(input, option) =>
            ((option?.label ?? '') as any).includes(input)
          }
          options={majorInfo.majors.map(
            (item: { majorId: number; majorName: String }) => {
              return {
                value: item.majorId,
                label: item.majorName,
              }
            }
          )}></Select>
      </Form.Item>
      <Form.Item
        name="orderNum"
        label="班级序号"
        rules={[{ required: true, message: '请输入学院序号' }]}>
        <InputNumber style={{ width: '200px' }} />
      </Form.Item>
    </Form>
  )
}

export default ClassForm
