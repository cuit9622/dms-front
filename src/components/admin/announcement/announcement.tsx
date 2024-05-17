import {
  Button,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Space,
  Table,
} from 'antd'
import { GlobalContext } from 'app'
import { AnnoucementModel } from 'model/AnnouncementModel'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'tools/axios'
import { AnnouncementEditor } from './announcementEditor'
interface DataType {
  key: React.Key
  title: String
  name: String
  level: Number
  createTime: String
}
// 搜索框
const { Search, TextArea } = Input
const Announcement: React.FC = () => {
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>(
    'checkbox'
  )
  const [modalOpen, setModalOpen] = useState(false)
  const [noticeID, setNoticeID] = useState<React.Key>('')
  // 加载动态显示
  const [loading, setLoading] = useState(true)
  // 公告信息列表
  const [list, setList] = useState<any>([])
  // 公告分页参数管理
  const [params, setParams] = useState<AnnoucementModel>({
    page: 1,
    pageSize: 10,
    total: 1,
    title: '',
    level: '',
    createTime: '',
  })
  const { messageApi } = useContext(GlobalContext)

  // 拉取公告列表信息
  useEffect(() => {
    if (modalOpen == true) {
      return
    }
    const loadList = async () => {
      const res = await axios.get('/notice', { params })
      const data = res.data.data
      setParams({
        ...params,
        pageSize: data.size,
        total: data.total,
        pages: data.pages,
      })
      setList(
        data.records.map(
          (item: {
            id: React.Key
            title: String
            name: String
            level: Number
            createTime: String
          }) => {
            return {
              key: item.id,
              title: item.title,
              name: item.name,
              level: item.level,
              createTime: item.createTime,
            }
          }
        )
      )
      setLoading(false)
    }
    loadList()
  }, [
    params.total,
    params.page,
    params.pageSize,
    params.title,
    params.createTime,
    params.level,
    modalOpen,
  ])
  const editAnnouncement = (id: React.Key) => {
    setNoticeID(id)
    setModalOpen(true)
  }
  // 单条删除
  const delAnnouncement = async (id: React.Key) => {
    await axios.delete(`/auth/notice/${id}`)
    messageApi.success('成功删除')
    // 通过修改params刷新列表
    setParams({
      ...params,
      total: params.total - 1,
    })
  }
  // 批量删除
  const delBatch = async () => {
    await axios.delete('/auth/notice', {
      data: {
        ids: selectedRowKeys,
      },
    })
    messageApi.success('成功删除')
    setParams({
      ...params,
      total: params.total - selectedRowKeys.length,
    })
    setSelectedRowKeys([])
  }

  // 设置排序条件
  const onChange = ({
    pagination,
    filter,
    sorter,
  }: {
    pagination: any
    filter: any
    sorter: any
  }) => {
    setLoading(true)
    const field = sorter.field
    const order = sorter.order ? sorter.order.replace('end', '') : ''
    if (field === 'level') {
      setParams({ ...params, level: order, createTime: '' })
    } else {
      setParams({ ...params, createTime: order, level: '' })
    }
  }

  // 编辑
  const defaultColumns = [
    {
      title: '标题',
      dataIndex: 'title',
      width: '20%',
    },
    {
      title: '发布人',
      dataIndex: 'name',
      width: '20%',
    },
    {
      title: '排序等级',
      dataIndex: 'level',
      width: '20%',
      sorter: true,
      filterDropdownOpen: true,
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      width: '20%',
      sorter: true,
      filterDropdownOpen: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '20%',
      render: (_: any, record: { key: React.Key }) => (
        <Space>
          <a
            onClick={() => {
              editAnnouncement(record.key)
            }}>
            编辑
          </a>
          <Popconfirm
            title="是否该公告信息？"
            onConfirm={() => {
              delAnnouncement(record.key)
            }}>
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // 封装被选中项的key值
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])

  // 可选框
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  return (
    <>
      <div>
        <Modal
          centered
          open={modalOpen}
          footer={null}
          width={1000}
          onCancel={() => {
            setModalOpen(false)
          }}>
          <AnnouncementEditor noticeId={noticeID} setModalOpen={setModalOpen} />
        </Modal>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* 搜索框 */}
          <Search
            disabled={loading}
            placeholder="标题"
            onSearch={(e) => {
              setLoading(true)
              setParams({ ...params, title: e })
            }}
            style={{ width: 200 }}
            size="large"
          />
          <div
            style={{
              width: 180,
              display: 'flex',
              justifyContent: 'space-between',
            }}>
            {/* 批量删除 */}
            <Popconfirm
              title="是否删除所选公告信息？"
              onConfirm={delBatch}
              disabled={selectedRowKeys.length === 0}>
              <Button danger disabled={selectedRowKeys.length === 0}>
                删除选中
              </Button>
            </Popconfirm>
            {/* 新增公告 */}
            <Button
              type="primary"
              onClick={() => {
                setNoticeID(0)
                setModalOpen(true)
              }}>
              新增公告
            </Button>
          </div>
        </div>
        <Table
          rowSelection={{
            preserveSelectedRowKeys: true,
            type: selectionType,
            ...rowSelection,
          }}
          bordered
          dataSource={list}
          onChange={(pagination, filter, sorter) => {
            onChange({ pagination, filter, sorter })
          }}
          columns={defaultColumns}
          pagination={false}
          loading={loading}
        />
        {/*  分页 */}

        <Pagination
          disabled={loading}
          style={{ float: 'right' }}
          pageSize={params.pageSize}
          showSizeChanger
          pageSizeOptions={[5, 10, 15, 20]}
          onChange={(page, pageSize) => {
            setLoading(true)
            setParams({
              ...params,
              page: page,
              pageSize: pageSize,
            })
          }}
          total={params.total}
          showQuickJumper
          showTotal={(total) => `总共${params.total}条数据`}
        />
      </div>
    </>
  )
}

export default Announcement
