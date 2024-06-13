import { Form, FormInstance, Input, Radio, Select } from 'antd'
import { useEffect } from 'react'
import axios from '../../tools/axios'
interface StudentFormProps {
  form: FormInstance
  isEdit: boolean
  collegeInfo: any
  setCollegeInfo: any
  majorInfo: any
  setMajorInfo: any
  classNumbers: any
  setClassNumbers: any
}

const StudentForm: React.FC<StudentFormProps> = ({
  form,
  isEdit,
  collegeInfo,
  setCollegeInfo,
  majorInfo,
  setMajorInfo,
  classNumbers,
  setClassNumbers,
}) => {
  useEffect(() => {
    handleColleges()
  }, [])

  // 获取所有学院
  const handleColleges = async () => {
    const resp = await axios.get('/college/college/getAll')
    setCollegeInfo({ ...collegeInfo, colleges: resp.data })
  }

  // 获取所有专业
  const handleMajors = async () => {
    form.setFieldValue('classNumber', '')
    form.setFieldValue('major', '')
    const resp = await axios.get(
      `/college/major/getAll/${form.getFieldValue('college')}`
    )

    setMajorInfo({ ...majorInfo, majors: resp.data })
    setCollegeInfo({ ...collegeInfo, isCollegeSelected: true })
  }

  // 获取所有班级
  const handleClass = async () => {
    form.setFieldValue('classNumber', '')
    const resp = await axios.get(
      `/college/class/getAll/${form.getFieldValue('major')}`
    )

    setClassNumbers(resp.data)
    setMajorInfo({ ...majorInfo, isMajorSelected: true })
  }

  // 检查学号是否已存在
  const checkStuNum = async (rule: any, value: string) => {
    if (value && !isEdit) {
      try {
        const response = await axios.get(`/student/check/${value}`)
        if (!response.data) {
          throw new Error('学号已存在')
        }
      } catch (error) {
        return Promise.reject(new Error(''))
      }
    }

    return Promise.resolve()
  }

  return (
    <Form form={form} layout="vertical">
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
        rules={[
          {
            required: true,
            message: '学号已存在或未输入',
            validator: checkStuNum,
          },
        ]}>
        <Input disabled={isEdit} />
      </Form.Item>
      <Form.Item
        name="college"
        label="学院"
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
        name="major"
        label="专业"
        rules={[{ required: true, message: '请选择专业' }]}>
        <Select
          onSelect={handleClass}
          disabled={!collegeInfo.isCollegeSelected}
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
        name="classNumber"
        label="班级"
        rules={[{ required: true, message: '请选择班级' }]}>
        <Select
          disabled={!majorInfo.isMajorSelected}
          showSearch
          placeholder="搜索班级关键字"
          optionFilterProp="children"
          filterOption={(input, option) =>
            ((option?.label ?? '') as any).includes(input)
          }
          options={classNumbers.map(
            (item: { classId: number; className: String }) => {
              return {
                value: item.classId,
                label: item.className,
              }
            }
          )}></Select>
      </Form.Item>
      <Form.Item
        name="tel"
        label="电话"
        rules={[{ required: true, message: '请输入电话' }]}>
        <Input />
      </Form.Item>
    </Form>
  )
}

export default StudentForm
