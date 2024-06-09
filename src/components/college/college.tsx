import axios from '../../tools/axios'
import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Radio, message } from 'antd'
import CollegeForm from './collegeForm'

// 数据类型
interface College {
  collegeId: string
  key: React.Key
  collegeName: string
  orderNum: number
  createTime: Date
}

const College: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([])
  // 处理是否弹出探窗
  const [isModalVisible, setIsModalVisible] = useState(false)

  const [isEdit, setIsEdit] = useState(false)

  const [editId, setEditId] = useState('-1')

  const [form] = Form.useForm()
  // 默认的页数
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  })
  const [searchText, setSearchText] = useState<string>('')
  useEffect(() => {
    fetchColleges(pagination.current, pagination.pageSize, searchText)
  }, [pagination.current, pagination.total, pagination.pageSize])

  // 获取学院信息
  const fetchColleges = async (
    page: number,
    pageSize: number,
    searchText: string
  ) => {
    try {
      const response = await axios.get('/college/college/list', {
        params: { page: page, pageSize: pageSize, collegeName: searchText },
      })
      const data = response.data

      setColleges(data.records)

      setPagination({ ...pagination, total: data.total })
    } catch (error: any) {
      message.error(error.data.msg)
    }
  }

  // 处理分页改变的函数
  const handleTableChange = (arg: any) => {
    setPagination(arg)
  }

  const handleAdd = () => {
    setIsModalVisible(true)
    setIsEdit(false)
  }

  const handleDelete = async (collegeId: string) => {
    try {
      const response = await axios.delete(`/college/college/${collegeId}`)
      fetchColleges(pagination.current, pagination.pageSize, searchText)
      message.success(response.data)
    } catch (error: any) {
      message.error(error.data.msg)
    }
  }

  const handleEdit = async (college: College) => {
    setIsModalVisible(true)
    setIsEdit(true)
    setEditId(college.collegeId)
  }

  // 处理是新增还是删除学院
  const handleOk = async () => {
    try {
      const values = await form.validateFields()

      // 编辑
      if (isEdit) {
        const resp = await axios.put(`/college/college/edit`, {
          ...values,
          collegeId: editId,
        })
        message.success(resp.data)
      } else {
        const resp = await axios.post('/college/college/add', values) // 新增
        message.success(resp.data)
      }
      fetchColleges(pagination.current, pagination.pageSize, searchText)
      setIsModalVisible(false)
      setIsEdit(false)
      setEditId('-1')
    } catch (error: any) {
      message.error(error.data.msg)
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setEditId('-1')
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
    fetchColleges(1, pagination.pageSize, value)
  }

  const confirmDelete = (collegeId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '你确定要删除这个学院吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => handleDelete(collegeId),
    })
  }
  const columns = [
    {
      title: '学院名称',
      dataIndex: 'collegeName',
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: College) => (
        <span>
          <Button
            onClick={() => handleEdit(record)}
            style={{
              marginRight: 8,
              backgroundColor: '#1890ff',
              color: 'white',
            }}>
            编辑
          </Button>
          <Button
            danger
            onClick={() => confirmDelete(record.collegeId)}
            style={{ backgroundColor: '#ff4d4f', color: 'white' }}>
            删除
          </Button>
        </span>
      ),
    },
  ]

  return (
    <div>
      <Input.Search
        placeholder="输入学院名称进行搜索"
        onSearch={handleSearch}
        style={{ width: 220 }}
        allowClear
      />
      <Button
        style={{ float: 'right', margin: '0px 30px 10px 0px' }}
        type="primary"
        onClick={handleAdd}>
        新增学院
      </Button>
      <Table
        columns={columns}
        dataSource={colleges}
        rowKey="collegeId"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true, // 显示每页大小选择器
          pageSizeOptions: [5, 10, 15, 20],
          showQuickJumper: true, // 显示快速跳转
        }}
        onChange={handleTableChange}
      />
      <Modal
        title={isEdit ? '编辑学院' : '新增学院'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}>
        <CollegeForm form={form} isEdit={isEdit} collegeId={editId} />
      </Modal>
    </div>
  )
}

export default College
