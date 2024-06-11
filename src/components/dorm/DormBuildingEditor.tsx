import { Form, Input, InputNumber, Modal, Radio } from 'antd'
import { GlobalContext } from 'app'
import { useContext, useEffect } from 'react'
import axios from 'tools/axios'
import { DormBuilding } from './DormBuildingMgr'

export function DormBuildingEditor(props: {
  dormBuilding: DormBuilding
  modalOpen: boolean
  setModalOpen: React.Dispatch<boolean>
}) {
  const { messageApi } = useContext(GlobalContext)
  const [form] = Form.useForm()

  useEffect(() => {
    if (props.modalOpen == false) return
    form.setFieldsValue(props.dormBuilding)
  }, [props.modalOpen])

  //清空表单
  const resetForm = () => {
    form.resetFields()
    props.setModalOpen(false)
  }
  //表单提交
  const onFinish = async (values: any) => {
    const requestBody: DormBuilding = props.dormBuilding
    requestBody.name = values.name
    requestBody.sex = values.sex
    requestBody.floor = values.floor
    await axios.put('/dorm/dormBuilding', requestBody)
    messageApi.success('成功修改寝室楼')
    props.setModalOpen(false)
    resetForm()
  }

  return (
    <Modal
      centered
      open={props.modalOpen}
      title="寝室楼管理"
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
            label="寝室楼名称"
            rules={[{ required: true, message: '请输入寝室楼名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="sex"
            label="寝室楼类型"
            rules={[{ required: true, message: '请选择寝室楼类型' }]}>
            <Radio.Group>
              <Radio value={1}>男生寝室</Radio>
              <Radio value={0}>女生寝室</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="floor"
            label="寝室楼层"
            rules={[{ required: true, message: '请输入寝室楼层' }]}>
            <InputNumber min={1} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}
