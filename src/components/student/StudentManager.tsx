import {
  CopyOutlined,
  SettingOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons'
import { MenuProps, Popconfirm, Space, Table } from 'antd'
import Search from 'antd/es/input/Search'
import Button from 'antd/lib/button/button'
import Menu from 'antd/lib/menu/menu'
import { useEffect, useState } from 'react'
import axios from '../../tools/axios'

const StudentManager: React.FC = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  })
  const [students, setStudents] = useState([])
  const [searchText, setSearchText] = useState<string>('')

  useEffect(() => {
    fetchStudents(pagination.current, pagination.pageSize, searchText)
  }, [pagination.current, pagination.pageSize, pagination.total])
  // 获取学生列表
  const fetchStudents = async (
    page: number,
    pageSize: number,
    searchText: string
  ) => {
    const resp = await axios.get('/student/students', {
      params: { page, pageSize, name: searchText },
    })
    const data = resp.data

    setStudents(data.records)
    setPagination({ ...pagination, total: data.total })
  }

  const handleTableChange = (pagination: any) => {
    setPagination(pagination)
  }

  const colums: any = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: '10%',
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: '5%',
      align: 'center',
    },
    {
      title: '班级',
      dataIndex: 'classNumber',
      width: '10%',
      align: 'center',
    },
    {
      title: '学号',
      dataIndex: 'stuNum',
      width: '14%',
      align: 'center',
    },
    {
      title: '学院',
      dataIndex: 'college',
      width: '14%',
      align: 'center',
    },
    {
      title: '专业',
      dataIndex: 'major',
      width: '14%',
      align: 'center',
    },
    {
      title: '电话',
      dataIndex: 'tel',
      width: '14%',
      align: 'center',
    },
    {
      align: 'center',
      title: '操作',
      dataIndex: 'operation',
      width: '20%',
      render: (_: any, record: { key: React.Key; id: number }) => (
        <Space>
          <a onClick={() => {}}>编辑</a>
          <Popconfirm title="是否删除该学生信息？" onConfirm={() => {}}>
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]
  const items: MenuProps['items'] = [
    {
      key: 'sub4',
      label: 'Excel操作',
      icon: <SettingOutlined />,
      children: [
        {
          key: '1',
          label: (
            <Button icon={<VerticalAlignTopOutlined />}>1 导出Excel</Button>
          ),
        },
        {
          key: '2',
          label: (
            <Button icon={<VerticalAlignBottomOutlined />}>2 导入Excel</Button>
          ),
        },
        {
          key: '3',
          label: <Button icon={<CopyOutlined />}>3 生成模板</Button>,
        },
      ],
    },
  ]
  return (
    <div>
      <div>
        <div>
          <Search
            placeholder="输入姓名搜索"
            style={{ width: 200 }}
            size="middle"
          />

          <Button
            type="primary"
            style={{
              marginLeft: 10,
            }}>
            新增学生
          </Button>
          <Popconfirm title="是否删除所选学生信息？">
            <Button
              danger
              disabled={false}
              style={{
                marginLeft: 10,
              }}>
              批量删除
            </Button>
          </Popconfirm>
          <Menu
            style={{
              width: 200,
              float: 'right',
              marginRight: 620,
              position: 'relative',
              bottom: 10,
            }}
            mode="vertical"
            items={items}
          />
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
          dataSource={students}
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
      </div>
    </div>
  )
}

export default StudentManager
