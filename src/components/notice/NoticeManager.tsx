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
      params: { page, pageSize, title: searchText },
    })
    const data = resp.data

    setNotices(
      data.records.map((item: Notice) => {
        return {
          ...item,
          key: item.noticeId,
        }
      })
    )
    setPagination({ ...pagination, total: data.total })
  }

  // 捕获搜索
  const handleSearch = (value: string) => {
    console.log(value)
    setSearchText(value)
    fetchNotices(1, pagination.pageSize, value)
  }

  const handleTableChange = (pagination: any) => {
    setPagination(pagination)
  }

  // 控制弹窗是否打开
  const [isModalVisible, setIsModalVisible] = useState(false)

  const [isEdit, setIsEdit] = useState(false)

  const [form] = Form.useForm()

  const [editId, setEditId] = useState<number>()

  // 编辑
  const handleEdit = async (notice: Notice) => {
    setIsModalVisible(true)
    setIsEdit(true)
    setEditId(notice.noticeId)
    const response = await axios.get(`/notice/getOne/${notice.noticeId}`)
    form.setFieldsValue(response.data)
  }

  // 捕获取消
  const handleCancel = () => {
    setIsModalVisible(false)
    setIsEdit(false)
    form.resetFields()
  }

  // 捕获提交
  const handleOk = async () => {
    const notice = await form.validateFields()
    if (isEdit) {
      // 编辑
      const resp = await axios.put(`/notice/edit`, {
        ...notice,
        noticeId: editId,
      })
      message.success(resp.data)
    } else {
      // 新增
      const resp = await axios.post('/notice/add', notice)
      message.success(resp.data)
    }

    setIsModalVisible(false)
    setIsEdit(false)
    form.resetFields()
    fetchNotices(pagination.current, pagination.pageSize, searchText)
  }

  // 捕获新增
  const handelAdd = () => {
    setIsModalVisible(true)
    setIsEdit(false)
    form.resetFields()
  }

  // 捕获删除
  const handleDelete = async (noticeId: number) => {
    const resp = await axios.delete(`/notice/delete/${noticeId}`)
    fetchNotices(pagination.current, pagination.pageSize, searchText)
    message.success(resp.data)
    setSelectedRowKeys([])
  }

  // 多选框
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  // 批量删除
  const delBatch = async () => {
    const resp = await axios.delete(`/notice/delete`, {
      data: selectedRowKeys,
    })
    message.success(resp.data)
    setSelectedRowKeys([])
    fetchNotices(pagination.current, pagination.pageSize, searchText)
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
          <Popconfirm
            title="是否删除条公告信息？"
            onConfirm={() => {
              handleDelete(record.noticeId)
            }}>
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
            onSearch={handleSearch}
            allowClear
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
          <Popconfirm title="是否删除所选公告信息？" onConfirm={delBatch}>
            <Button
              danger
              disabled={selectedRowKeys.length === 0}
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
            ...rowSelection,
          }}
          bordered
          dataSource={notices}
          columns={colums}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: [1, 5, 8],
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
