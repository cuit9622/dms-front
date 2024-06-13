import { Button, Pagination, Popconfirm, Space, Table, Tag } from 'antd'
import { GlobalContext } from 'app'
import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'tools/axios'
import { DormBuildingEditor } from './DormBuildingEditor'

export interface DormBuilding {
  key?: string
  id: number
  name: string
  sex?: number
  floor?: number
}

const DormBuildingMgr: React.FC = () => {
  const dormBuilding = useRef<DormBuilding>({
    id: 0,
    name: '',
  })
  const [modalOpen, setModalOpen] = useState(false)

  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<DormBuilding[]>([])
  const [total, setTotal] = useState<number>(0)
  const [page, setPage] = useState<PageRequest>({
    page: 1,
    pageSize: 10,
  })
  const { messageApi } = useContext(GlobalContext)

  useEffect(() => {
    if (modalOpen == true) {
      return
    }
    loadList()
  }, [total, page.page, page.pageSize, modalOpen])

  const loadList = async () => {
    const res = await axios.get('/dorm/dormBuilding', { params: page })
    const data: PageResult<DormBuilding> = res.data
    setTotal(data.total)
    setList(
      data.records.map((item: DormBuilding) => {
        item.key = item.id.toString()
        return item
      })
    )
    setLoading(false)
  }

  const edit = (item: DormBuilding) => {
    dormBuilding.current = item
    setModalOpen(true)
  }
  // 单条删除
  const del = async (id: number) => {
    await axios.delete(`/dorm/dormBuilding/${id}`)
    messageApi.success('成功删除')
    if (list.length == 1) {
      setPage((old) => {
        return { ...old, page: old.page - 1 }
      })
    }
    setTotal((total) => total - 1)
  }

  const defaultColumns = [
    {
      title: '楼栋名称',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'sex',
      render: (sex: number) => (
        <span>
          {
            <Tag color={sex == 0 ? 'magenta' : 'blue'}>
              {sex == 0 ? '女' : '男'}
            </Tag>
          }
        </span>
      ),
    },
    {
      title: '楼层',
      dataIndex: 'floor',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: any) => (
        <Space>
          <a
            onClick={() => {
              edit(record)
            }}>
            编辑
          </a>
          <Popconfirm
            title="是否删除该寝室楼？"
            onConfirm={() => {
              del(record.id)
            }}>
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <div>
        <DormBuildingEditor
          dormBuilding={dormBuilding.current}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}>
            <Button
              type="primary"
              onClick={() => {
                dormBuilding.current = {
                  id: 0,
                  name: '',
                  sex: undefined,
                  floor: undefined,
                }
                setModalOpen(true)
              }}>
              新增寝室楼
            </Button>
          </div>
        </div>
        <Table
          bordered
          dataSource={list}
          onChange={(pagination, filter, sorter) => {}}
          columns={defaultColumns}
          pagination={false}
          loading={loading}
        />
        {/*  分页 */}

        <Pagination
          disabled={loading}
          style={{ float: 'right' }}
          pageSize={page.pageSize}
          showSizeChanger
          pageSizeOptions={[5, 10, 15, 20]}
          onChange={(page, pageSize) => {
            setLoading(true)
            setPage({
              page: page,
              pageSize: pageSize,
            })
          }}
          total={total}
          showQuickJumper
          showTotal={(total) => `总共${total}条数据`}
        />
      </div>
    </>
  )
}

export default DormBuildingMgr
