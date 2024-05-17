import { Alert, Button, Form, Input, Radio, Select, Switch } from 'antd'
import { GlobalContext } from 'app'
import { useContext, useState } from 'react'
import axios from 'tools/axios'

export function StudentEditor(props: {
  // 传过来的参数
  form: any
  setModalOpen: React.Dispatch<any>
  isShowMajor: any
  setIsShowMajor: any
  college: any
  isRepeatSid: any
  setIsRepeatSid: any
  collegeAndMajorId: any
  editId: any
  editorManager: any
  setEditorManager: any
  resetPwd: any
  setResetPwd: any
  closeForm: any
  params: any
  setParams: any
}) {
  const {
    form,
    setModalOpen,
    isShowMajor,
    setIsShowMajor,
    college,
    isRepeatSid,
    setIsRepeatSid,
    collegeAndMajorId,
    editId,
    editorManager,
    setEditorManager,
    resetPwd,
    setResetPwd,
    closeForm,
    params,
    setParams,
  } = props

  const { messageApi } = useContext(GlobalContext)

  // 编辑时是否改变学院标志
  const [isChangeCollege, setIsChangeCollege] = useState(false)

  // 专业信息
  const [major, setMajor] = useState<any>([])

  // 提交表单信息
  const onFinish = async (values: any) => {
    let isManager = form.getFieldValue('isManager')
    let sex = form.getFieldValue('sex')
    let res = await axios.get(`/student/${values.sid}`)
    let flag = res.data.data
    let data = {
      ...values,
      username: values.sid,
      realName: values.studentName,
      sex: (sex === undefined || sex === 1 ? 1 : 0) === 1 ? '男' : '女',
      isSetManager:
        (isManager === undefined || isManager === false ? false : true) === true
          ? 1
          : 0,
      isResetPwd: resetPwd.isReset === true ? 1 : 0,
    }
    console.log(data)
    // 增添学生信息
    if (flag === null) {
      await axios.post('/student', data)
      setParams({
        ...params,
        total: params.total + 1,
      })
      messageApi.success('添加学生信息成功！')
    }
    // 修改学生信息
    else {
      // 如果没有修改学院专业信息，则将学院专业对应id赋值
      if (isChangeCollege === false) {
        await axios.put('/student', {
          ...data,
          collegeId: collegeAndMajorId.collegeId,
          majorId: collegeAndMajorId.majorId,
          id: editId,
        })
      } else {
        await axios.put('/student', {
          ...data,
          id: editId,
        })
      }
      messageApi.success('修改学生信息成功！')
    }
    // 关闭表单
    closeForm()
    setParams({
      ...params,
      loader: !params.loader,
    })
    setIsChangeCollege(false)
  }

  // 表单提交失败
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  // 校验学号
  const checkSid = async () => {
    let sid = form.getFieldValue('sid')
    let res = await axios.get(`/student/${sid}`)
    console.log(res)
    if (res.data.msg === '未查询到该学生') {
      setIsRepeatSid(false)
    } else setIsRepeatSid(true)
  }

  // 获取专业信息
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
    setIsShowMajor(true)
  }

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      form={form}
      disabled={false}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      style={{
        width: 400,
        background: 'white',
        marginTop: 15,
        padding: '1em',
      }}>
      <Form.Item>{editId === 0 ? '新增' : '编辑'}学生</Form.Item>

      <Form.Item
        name="sid"
        label="学号"
        validateTrigger="onChange"
        extra={
          isRepeatSid === true ? (
            <Alert
              style={{ padding: 3 }}
              message="该学号已存在！"
              type="error"
              showIcon
            />
          ) : (
            ''
          )
        }
        rules={[
          {
            required: true,
            pattern: /^\d{7}$/,
            message: '学号为7位数字',
          },
        ]}>
        <Input
          placeholder="请输入学号"
          // 当失去焦点校验学号是否重复
          onBlur={checkSid}
        />
      </Form.Item>

      <Form.Item
        name="studentName"
        label="姓名"
        rules={[
          {
            required: true,
            pattern: /^[\u4e00-\u9fa5\w]{1,20}$/,
            message: '姓名长度不得超过20个字符',
          },
        ]}>
        <Input placeholder="请输入姓名" />
      </Form.Item>

      <Form.Item name="sex" label="性别">
        {/* <Radio.Group onChange={setSexValue} value={sex} defaultValue={sex}> */}
        <Radio.Group defaultValue={1}>
          <Radio value={1}>男</Radio>
          <Radio value={0}>女</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="classNumber"
        label="班级"
        rules={[
          {
            required: true,
            pattern: /^\d{1}$/,
            message: '请输入班级对应数字',
          },
        ]}>
        <Input placeholder="请输入班级对应数字" />
      </Form.Item>

      <Form.Item
        name="grade"
        label="年级"
        rules={[
          {
            required: true,
            pattern: /^\d{4}$/,
            message: '请输入年级对应数字',
          },
        ]}>
        <Input placeholder="请输入年级对应数字" />
      </Form.Item>

      <Form.Item
        name="collegeId"
        label="学院"
        rules={[
          {
            required: true,
          },
        ]}>
        <Select
          onChange={() => {
            setMajor([])
            setIsChangeCollege(true)
          }}
          onSelect={getMajor}
          showSearch
          style={{ width: 217 }}
          placeholder="点击搜索学院关键字"
          optionFilterProp="children"
          filterOption={(input, option) =>
            ((option?.label ?? '') as any).includes(input)
          }
          options={college.map((item: { key: React.Key; name: String }) => {
            return {
              value: item.key,
              label: item.name,
            }
          })}
        />
      </Form.Item>
      <Form.Item
        name="majorId"
        label="专业"
        rules={[
          {
            required: true,
          },
        ]}>
        <Select
          disabled={!isShowMajor}
          // defaultValue
          showSearch
          style={{ width: 217 }}
          placeholder="点击搜索专业关键字"
          optionFilterProp="children"
          filterOption={(input, option) =>
            ((option?.label ?? '') as any).includes(input)
          }
          options={major.map((item: { key: React.Key; name: String }) => {
            return {
              value: item.key,
              label: item.name,
            }
          })}
        />
      </Form.Item>
      <Form.Item
        name="phone"
        label="电话"
        rules={[
          {
            pattern: /^\d{11}$/,
            message: '请输入正确的电话号码格式',
          },
        ]}>
        <Input placeholder="请输入电话" />
      </Form.Item>
      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          {
            pattern:
              /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
            message: '请输入正确的邮箱格式',
          },
        ]}>
        <Input placeholder="请输入邮箱" />
      </Form.Item>
      <Form.Item name="isManager" label="管理员">
        <Switch
          // disabled={true}
          checked={editorManager}
          onChange={() => setEditorManager(!editorManager)}
        />
      </Form.Item>
      <Form.Item name="isResetPwd" label="重置密码">
        <Switch
          disabled={resetPwd.isDisabled}
          checked={resetPwd.isReset}
          onChange={() =>
            setResetPwd({
              ...resetPwd,
              isReset: !resetPwd.isReset,
            })
          }
        />
      </Form.Item>
      <Form.Item>
        <div
          style={{
            width: 180,
            display: 'flex',
            justifyContent: 'space-between',
          }}>
          <Button
            disabled={isRepeatSid}
            onClick={() => setIsShowMajor(false)}
            htmlType="submit"
            type="primary"
            style={{ marginLeft: 310, marginBottom: 10 }}>
            提交
          </Button>
        </div>
      </Form.Item>
    </Form>
  )
}
