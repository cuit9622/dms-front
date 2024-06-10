import { Form, Modal, Popconfirm, Space, Table, message } from 'antd'
import Search from 'antd/es/input/Search'
import Button from 'antd/lib/button/button'
import { Notice } from 'model/Notice'
import { useEffect, useState } from 'react'
import axios from '../../tools/axios'
import NoticeForm from './NoticeForm'

const NoticeManager: React.FC = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  })
  const [notices, setNotices] = useState([])
  const [searchText, setSearchText] = useState<string>('')

  useEffect(() => {
    fetchNotices(pagination.current, pagination.pageSize, searchText)
  }, [pagination.current, pagination.pageSize, pagination.total])
  // 获取公告列表
  const fetchNotices = async (
    page: number,
    pageSize: number,
    searchText: string
  ) => {
    const resp = await axios.get('/notice/list', {
      params: { page, pageSize, name: searchText },
    })
    const data = resp.data

    setNotices(data.records)
    setPagination({ ...pagination, total: data.total })
  }

  const handleTableChange = (pagination: any) => {
    setPagination(pagination)
  }

  // 控制弹窗是否打开
  const [isModalVisible, setIsModalVisible] = useState(false)

  const [isEdit, setIsEdit] = useState(false)

  const [form] = Form.useForm()

  const handleEdit = (notice: Notice) => {
    setIsModalVisible(true)
    setIsEdit(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setIsEdit(false)
    form.resetFields()
  }

  const handleOk = async () => {
    const values = await form.validateFields()
    console.log(values)
    const resp = await axios.post('/notice/add', values)
    message.success(resp.data)
    fetchNotices(pagination.current, pagination.pageSize, searchText)
    setIsModalVisible(false)
    setIsEdit(false)
  }

  const handelAdd = () => {
    setIsModalVisible(true)
    setIsEdit(false)
    form.resetFields()
  }

  const colums: any = [
    {
      title: '标题',
      dataIndex: 'title',
      width: '15%',
      align: 'center',
    },
    {
      title: '内容',
      dataIndex: 'content',
      width: '25%',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '15%',
      align: 'center',
    },
    {
      title: '发布者',
      dataIndex: 'name',
      width: '10%',
      align: 'center',
    },
    {
      align: 'center',
      title: '操作',
      dataIndex: 'operation',
      width: '15%',
      render: (_: any, record: Notice) => (
        <Space>
          <a
            onClick={() => {
              handleEdit(record)
            }}>
            编辑
          </a>
          <Popconfirm title="是否删除条公告信息？" onConfirm={() => {}}>
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div>
        <div>
          <Search
            placeholder="输入标题搜索"
            style={{ width: 200 }}
            size="middle"
          />

          <Button
            type="primary"
            onClick={handelAdd}
            style={{
              marginLeft: 10,
            }}>
            新增公告
          </Button>
          <Popconfirm title="是否删除所选公告信息？">
            <Button
              danger
              disabled={false}
              style={{
                marginLeft: 10,
              }}>
              批量删除
            </Button>
          </Popconfirm>
        </div>
      </div>
      <div>
        <Table
          // components={}
          rowSelection={{
            columnWidth: '5%',
            preserveSelectedRowKeys: true,
            type: 'checkbox',
          }}
          bordered
          dataSource={notices}
          columns={colums}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: [1, 5],
            showQuickJumper: true,
            showTotal: (total: number) => '总共' + total + '条数据',
          }}
          onChange={handleTableChange}
        />
        <Modal
          title={isEdit ? '编辑公告' : '新增公告'}
          onCancel={handleCancel}
          open={isModalVisible}
          onOk={handleOk}>
          <NoticeForm form={form} isEdit={isEdit} />
        </Modal>
      </div>
    </div>
  )
}

export default NoticeManager
