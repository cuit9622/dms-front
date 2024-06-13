import axios from '../../tools/axios'
import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Radio, message } from 'antd'
import ClassForm from './classForm'

// 数据类型
interface Class {
  key: React.Key
  majorId: number
  collegeId: number
  classId: number
  majorName: string
  collegeName: string
  className: string
  classYear: string
  orderNum: number
}

const Class: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([])
  const [record, setRecords] = useState<Class[]>([])
  // 处理是否弹出探窗
  const [isModalVisible, setIsModalVisible] = useState(false)

  const [isEdit, setIsEdit] = useState(false)

  const [editId, setEditId] = useState(-1)

  const [form] = Form.useForm()

  // 默认的页数
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  })
  const [searchText, setSearchText] = useState<string>('')

  useEffect(() => {
    fetchColleges(pagination.current, pagination.pageSize, searchText)
  }, [pagination.current, pagination.total, pagination.pageSize])

  // 获取专业信息
  const fetchColleges = async (
    page: number,
    pageSize: number,
    searchText: string
  ) => {
    try {
      const response = await axios.get('/college/class/list', {
        params: { page: page, pageSize: pageSize, className: searchText },
      })
      const data = response.data
      console.log(data.records)

      setClasses(data.records)

      setPagination({
        ...pagination,
        total: data.total,
        // pages:
        //   data.total % pageSize == 0
        //     ? data.total / pageSize
        //     : (data.total % pageSize) + 1,
      })
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

  const handleDelete = async (classId: number) => {
    try {
      const response = await axios.delete(`/college/class/${classId}`)
      fetchColleges(pagination.current, pagination.pageSize, searchText)
      message.success(response.data)
    } catch (error: any) {
      message.error(error.data.msg)
    }
  }

  const handleEdit = async (record: Class) => {
    setIsModalVisible(true)
    setRecords([record])
    setIsEdit(true)
    setEditId(record.classId)
  }

  // 处理是新增还是删除学院
  const handleOk = async () => {
    try {
      const values = await form.validateFields()

      // 编辑
      if (isEdit) {
        const resp = await axios.put(`/college/class/edit`, {
          ...values,
          majorId: values.majorName,
          classId: editId,
        })
        message.success(resp.data)
      } else {
        const resp = await axios.post('/college/class/add', {
          ...values,
          majorId: values.majorName,
        }) // 新增
        message.success(resp.data)
      }
      fetchColleges(pagination.current, pagination.pageSize, searchText)
      setIsModalVisible(false)
      setIsEdit(false)
      setEditId(-1)
    } catch (error: any) {
      message.error(error.data.msg)
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setEditId(editId == -1 ? -2 : -1)
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
    fetchColleges(1, pagination.pageSize, value)
  }

  const confirmDelete = (classId: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '你确定要删除这个班级吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => handleDelete(classId),
    })
  }
  const columns = [
    {
      title: '班级名称',
      dataIndex: 'className',
      width: '15%',
    },
    {
      title: '专业名称',
      dataIndex: 'majorName',
      width: '20%',
    },
    {
      title: '所属学院',
      dataIndex: 'collegeName',
      width: '20%',
    },
    {
      title: '招生时间',
      dataIndex: 'classYear',
      width: '15%',
    },
    {
      title: '序号',
      dataIndex: 'orderNum',
      width: '15%',
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: Class) => (
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
            onClick={() => confirmDelete(record.classId)}
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
        placeholder="输入专业名称进行搜索"
        onSearch={handleSearch}
        style={{ width: 220 }}
        allowClear
      />
      <Button
        style={{ margin: '0px 30px 10px 10px' }}
        type="primary"
        onClick={handleAdd}>
        新增专业
      </Button>
      <Table
        columns={columns}
        dataSource={classes}
        rowKey="classId"
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
        title={isEdit ? '编辑专业' : '新增专业'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}>
        <ClassForm
          form={form}
          isEdit={isEdit}
          classId={editId}
          record={record}
        />
      </Modal>
    </div>
  )
}

export default Class
