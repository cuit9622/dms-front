import axios from '../../tools/axios'
import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Radio, message } from 'antd'
import DormRepairForm from './dormRepairForm'

// 数据类型
interface DormRepair {
  key: React.Key
  repairId: number
  username: string
  userId: number
  phone: number
  dormName: string
  repairText: string //报修理由
  status: string //报修状态
  repairTime: Date
}
// 学生报修界面！！！
const PersonalDormRepair: React.FC = () => {
  const [dormRepairs, setDormRepairs] = useState<DormRepair[]>([])
  // 处理是否弹出探窗
  const [isModalVisible, setIsModalVisible] = useState(false)

  const [isEdit, setIsEdit] = useState(false)

  //传给form 用于回显信息
  const [record, setRecords] = useState<DormRepair[]>([])

  //当前编辑的报修信息的repairId
  const [editId, setEditId] = useState(-1)

  const [form] = Form.useForm()

  // 默认的页数
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  })

  useEffect(() => {
    fetchRepairs(pagination.current, pagination.pageSize, '')
  }, [pagination.current, pagination.total, pagination.pageSize])

  // 获取报修信息
  const fetchRepairs = async (
    page: number,
    pageSize: number,
    searchText: string
  ) => {
    try {
      const response = await axios.get('/dormRepair/repair/list', {
        params: { page: page, pageSize: pageSize, dormName: '' },
      })
      const data = response.data
      setDormRepairs(data.records)
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

  const handleDelete = async (repairId: number) => {
    try {
      const response = await axios.delete(`/dormRepair/repair/${repairId}`)
      fetchRepairs(pagination.current, pagination.pageSize, '')
      message.success(response.data)
    } catch (error: any) {
      message.error(error.data.msg)
    }
  }

  //编辑报修
  const handleEdit = async (dorm: DormRepair) => {
    if (dorm.status == '1') {
      message.info('该报修已处理，无法再编辑')
      return
    }
    setIsModalVisible(true)
    setRecords([dorm])
    setIsEdit(true)
    setEditId(dorm.repairId)
  }

  // 处理是新增还是删除报修
  const handleOk = async () => {
    try {
      const values = await form.validateFields()

      // 编辑
      if (isEdit) {
        const resp = await axios.put(`/dormRepair/repair/edit`, {
          ...values,
          repairId: editId,
        })
        message.success(resp.data)
      } else {
        const resp = await axios.post('/dormRepair/repair/add', {
          ...values,
          status: 0,
        }) // 新增
        message.success(resp.data)
      }
      fetchRepairs(pagination.current, pagination.pageSize, '')

      setIsModalVisible(false)
      setIsEdit(false)
      setEditId(editId < 0 ? editId - 1 : -1)
    } catch (error: any) {
      message.error(error.data.msg)
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setEditId(editId < 0 ? editId - 1 : -1)
  }

  const confirmDelete = (repairId: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '你确定要删除这条报修信息吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => handleDelete(repairId),
    })
  }
  const columns: any = [
    {
      title: '宿舍',
      dataIndex: 'dormName',
      width: '15%',
      align: 'center',
    },
    {
      title: '联系人',
      dataIndex: 'username',
      width: '15%',
      align: 'center',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      width: '15%',
      align: 'center',
    },
    {
      title: '维修说明',
      dataIndex: 'repairText',
      width: '15%',
      align: 'center',
    },
    {
      title: '维修状态',
      dataIndex: 'status',
      align: 'center',
      render: (_: any, record: DormRepair) => (
        <span>{record.status == '0' ? '未维修' : '已维修'}</span>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      render: (_: any, record: DormRepair) => (
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
            onClick={() => confirmDelete(record.repairId)}
            style={{ backgroundColor: '#ff4d4f', color: 'white' }}>
            删除
          </Button>
        </span>
      ),
    },
  ]

  return (
    <div>
      <Button
        style={{ margin: '0px 30px 10px 10px' }}
        type="primary"
        onClick={handleAdd}>
        新增报修
      </Button>
      <Table
        columns={columns}
        dataSource={dormRepairs}
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
        title={isEdit ? '编辑报修信息' : '新增报修'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}>
        <DormRepairForm
          form={form}
          isEdit={isEdit}
          repairId={editId}
          record={record}
        />
      </Modal>
    </div>
  )
}

export default PersonalDormRepair
