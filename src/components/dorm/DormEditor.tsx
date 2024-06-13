import { Form, Input, InputNumber, Modal } from 'antd'
import { GlobalContext } from 'app'
import { DormModel } from 'model/DormModel'
import { useContext, useEffect } from 'react'
import axios from 'tools/axios'

export function DormEditor(props: {
  dorm: DormModel
  modalOpen: boolean
  setModalOpen: React.Dispatch<boolean>
}) {
  const { messageApi } = useContext(GlobalContext)
  const [form] = Form.useForm()

  useEffect(() => {
    if (props.modalOpen == false) return
    form.setFieldsValue(props.dorm)
  }, [props.modalOpen])

  //清空表单
  const resetForm = () => {
    form.resetFields()
    props.setModalOpen(false)
  }
  //表单提交
  const onFinish = async (values: any) => {
    const requestBody: DormModel = props.dorm
    requestBody.name = values.name
    requestBody.size = values.size
    await axios.put('/dorm/dorm', requestBody)
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
            name="name"
            label="寝室名称"
            rules={[{ required: true, message: '请输入寝室楼名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="size"
            label="寝室容量"
            rules={[{ required: true, message: '请输入寝室容量' }]}>
            <InputNumber min={1} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
