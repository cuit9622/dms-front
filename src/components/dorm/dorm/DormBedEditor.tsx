import { Form, Input, Modal } from 'antd'
import { GlobalContext } from 'app'
import { DormBedModel } from 'model/DormModel'
import { useContext, useEffect } from 'react'
import axios from 'tools/axios'

export function DormBedEditor(props: {
  bed: DormBedModel
  modalOpen: boolean
  setModalOpen: React.Dispatch<boolean>
}) {
  const { messageApi } = useContext(GlobalContext)
  const [form] = Form.useForm()

  useEffect(() => {
    if (props.modalOpen == false) return
    form.setFieldsValue(props.bed)
  }, [props.modalOpen])

  //清空表单
  const resetForm = () => {
    form.resetFields()
    props.setModalOpen(false)
  }
  //表单提交
  const onFinish = async (values: any) => {
    const requestBody: DormBedModel = props.bed
    requestBody.studentNo = values.studentNo
    await axios.put('/dorm/dormBed', requestBody)
    messageApi.success('成功修改寝室')
    props.setModalOpen(false)
    resetForm()
  }

  return (
    <Modal
      centered
      open={props.modalOpen}
      title="寝室管理"
      width={500}
      okText="确定"
      onCancel={() => {
        resetForm()
      }}
      onOk={() => {
        form.submit()
      }}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Form
          name="basic"
          form={form}
          style={{ width: '80%' }}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off">
          <Form.Item
            name="studentNo"
            label="学生学号"
            rules={[
              { required: true, message: '请输入学生学号', pattern: /\d*/ },
            ]}>
            <Input />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
