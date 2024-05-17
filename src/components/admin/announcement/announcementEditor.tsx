import { Button, Form, Input, InputNumber, Spin } from 'antd'
import { GlobalContext } from 'app'
import { useContext, useEffect, useRef, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axios from 'tools/axios'

interface data {
  id: number
  title: string
  content: string
  level: number | null
}

export function AnnouncementEditor(props: {
  noticeId: React.Key
  setModalOpen: React.Dispatch<any>
}) {
  const width = 800
  const { messageApi } = useContext(GlobalContext)
  const quillRef = useRef<any>()
  const [isLoading, setLoading] = useState(true)
  const [form] = Form.useForm()

  useEffect(() => {
    setLoading(true)
    ;(async () => {
      form.setFieldsValue(await announcementLoader(props.noticeId as string))
      setLoading(false)
    })()
  }, [props])

  const onFinish = async (values: any) => {
    if (props.noticeId == 0) {
      await axios.post('/auth/notice', {
        ...values,
      })
    } else {
      await axios.put('/auth/notice', {
        ...values,
        id: props.noticeId,
      })
    }
    messageApi.success('成功')
    props.setModalOpen(false)
  }
  return isLoading ? (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Spin />
    </div>
  ) : (
    <Form
      form={form}
      labelCol={{ span: 2 }}
      wrapperCol={{ span: 13 }}
      onFinish={onFinish}>
      <Form.Item
        label="标题"
        name="title"
        rules={[{ required: true, message: '请输入文章标题' }]}>
        <Input placeholder="请输入文章标题" style={{ width: width }} />
      </Form.Item>
      <Form.Item
        label="内容"
        name="content"
        rules={[{ required: true, message: '请输入文章内容' }]}>
        <ReactQuill
          theme="snow"
          ref={quillRef}
          style={{
            height: 300,
            width: width,
            marginBottom: 50,
          }}
        />
      </Form.Item>
      <Form.Item
        name="level"
        label="等级"
        rules={[{ required: true, message: '请输入等级' }]}>
        <InputNumber min={1} max={100} />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 2 }}>
        <Button type="primary" htmlType="submit" style={{ width: 72 }}>
          提交
        </Button>
      </Form.Item>
    </Form>
  )
}

//获取待编辑的公告内容
async function announcementLoader(noticeId: string): Promise<data> {
  if (Number.parseInt(noticeId) == 0) {
    return { id: 0, title: '', content: '', level: null }
  }
  const response = await axios.get('/notice/' + noticeId)
  return response.data.data
}
