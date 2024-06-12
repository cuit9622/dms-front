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

const cityData = {
  Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
  Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
}
const [college, setCollege] = useState<any>([])
const [major, setMajor] = useState<any>([])
const [isChangeCollege, setIsChangeCollege] = useState(false)
const [gradeAndClass, setGradeAndClass] = useState<
  {
    grade: number
    classNumber: number[]
  }[]
>([])
type CityName = keyof typeof cityData

const provinceData: CityName[] = ['Zhejiang', 'Jiangsu']

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

  const [cities, setCities] = useState(cityData[provinceData[0] as CityName])
  const [secondCity, setSecondCity] = useState(
    cityData[provinceData[0]][0] as CityName
  )

  const handleProvinceChange = (value: CityName) => {
    setCities(cityData[value])
    setSecondCity(cityData[value][0] as CityName)
  }

  const onSecondCityChange = (value: CityName) => {
    setSecondCity(value)
  }

  const onChange = (value: string) => {
    console.log(`selected ${value}`)
  }

  const getMajor = async (id: Number) => {
    // 每次选择完学院后，清空专业
    form.setFieldValue('majorId', '')
    const mRes = await axios.get(`/student/major/${id}`)
    let mData = mRes.data.data

    setMajor(
      mData.map((item: { id: React.Key; majorName: String }) => {
        return {
          key: item.id,
          name: item.majorName,
        }
      })
    )
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
        name="orderNum"
        label="专业序号"
        rules={[{ required: true, message: '请输入学院序号' }]}>
        <InputNumber style={{ width: '200px' }} />
      </Form.Item>
    </Form>
  )
}

export default MajorForm
