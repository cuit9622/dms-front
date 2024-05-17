import React, { useContext, useEffect, useState } from 'react'

import { DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import {
  Button,
  Form,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Space,
  Table,
} from 'antd'
import { GlobalContext } from 'app'
import rawAxios from 'axios'
import axios from 'tools/axios'
import { StudentEditor } from './studentEditor'
import { UploadExcel } from './uploadExcel'
interface DataType {
  id: React.Key
  // sid
  key: React.Key
  name: String
  college: String
  major: String
  grade: Number
  class: Number
  role: Number
}

const StudentManagement: React.FC = () => {
  const { messageApi } = useContext(GlobalContext)

  // 弹出表单标识
  const [modalOpen, setModalOpen] = useState(false)

  // 表单
  const [form] = Form.useForm()

  // 搜索框
  const { Search } = Input

  // 加载动态显示
  const [loading, setLoading] = useState(true)

  // 学生信息列表
  const [students, setStudents] = useState<any>([])

  // 学生分页参数管理
  const [params, setParams] = useState<any>({
    page: 1,
    pageSize: 10,
    total: 50,
    pages: 1,
    name: '',
    loader: true,
  })

  // 通过姓名进行搜索
  const onSearch = (value: string) => {
    setLoading(true)
    setParams({
      ...params,
      name: value,
    })
  }

  // 学院信息useState
  const [college, setCollege] = useState<any>([])

  // sid输入框是否弹出学号已经存在的状态
  const [isRepeatSid, setIsRepeatSid] = useState(false)

  // 封装被选中项的key值
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])

  // 专业下拉框可选标志
  const [isShowMajor, setIsShowMajor] = useState(false)

  // 回填信息时封装学院专业id
  const [collegeAndMajorId, setCollegeAndMajorId] = useState({
    collegeId: 0,
    majorId: 0,
  })

  // 编辑时存储数据项的id值
  const [editId, setEditId] = useState(0)

  // 开启文件上传modal
  const [openUpload, setOpenUpload] = useState(false)

  // 表格列名
  const defaultColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: '15%',
    },
    {
      title: '学号',
      dataIndex: 'key',
      width: '15%',
    },
    {
      title: '学院',
      dataIndex: 'college',
      width: '15%',
    },
    {
      title: '专业',
      dataIndex: 'major',
      width: '15%',
    },
    {
      title: '年级',
      dataIndex: 'grade',
      width: '15%',
    },
    {
      title: '班级',
      dataIndex: 'class',
      width: '15%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '10%',
      render: (_: any, record: { key: React.Key; id: number }) => (
        <Space>
          <a
            onClick={() => {
              loadFormValue(record.key)
              setEditId(record.id)
            }}>
            编辑
          </a>
          <Popconfirm
            title="是否该学生信息？"
            onConfirm={() => delStudent(record.id, record.key)}>
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]
  const loadFormValue = async (sid: React.Key) => {
    setModalOpen(true)
    setResetPwd({
      ...resetPwd,
      isDisabled: false,
    })
    getCollege()
    setLoading(true)
    let res = await axios.get(`/student/${sid}`)
    const data = res.data.data
    console.log(data)
    let value = {
      sid: data.username,
      studentName: data.realName,
      sex: data.sex === '男' ? 1 : 0,
      classNumber: data.classNumber,
      grade: data.grade,
      collegeId: data.collegeName,
      majorId: data.majorName,
      phone: data.phone,
      email: data.email,
      isManager: data.isSetManager === 1 ? true : false,
    }
    // 是否开启管理员开关
    setEditorManager(value.isManager)
    form.setFieldsValue(value)
    // 存入学院专业id
    setCollegeAndMajorId({
      collegeId: data.collegeId,
      majorId: data.majorId,
    })
    setLoading(false)
  }

  // 拉取学生列表信息
  useEffect(() => {
    const loadList = async () => {
      setLoading(true)
      const res = await axios.get('/student', {
        params: {
          page: params.page,
          pageSize: params.pageSize,
          name: params.name,
        },
      })
      const data = res.data.data
      setParams({
        ...params,
        pageSize: data.size,
        total: data.total,
        pages: data.pages,
      })
      setStudents(
        data.records.map(
          (item: {
            id: Number
            studentName: String
            sid: Number
            collegeName: String
            majorName: String
            grade: Number
            classNumber: Number
          }) => {
            return {
              id: item.id,
              key: item.sid,
              name: item.studentName,
              college: item.collegeName,
              major: item.majorName,
              grade: item.grade,
              class: item.classNumber,
            }
          }
        )
      )
      setLoading(false)
    }
    loadList()
  }, [params.page, params.pageSize, params.total, params.loader, params.name])

  // 获取学院信息
  const getCollege = async () => {
    let Res = await axios.get('/student/college')
    let Data = Res.data.data
    setCollege(
      Data.map((item: { id: React.Key; collegeName: String }) => {
        return {
          key: item.id,
          name: item.collegeName,
        }
      })
    )
  }

  // 单条删除
  const delStudent = async (userId: any, sid: any) => {
    await axios.delete('/student', {
      data: {
        id: userId,
        sid: sid,
      },
    })
    messageApi.success('删除学生信息成功！')
    setParams({
      ...params,
      total: params.total - 1,
    })
  }

  // 批量删除
  const delBatch = async () => {
    console.log(selectedRowKeys)
    await axios.delete('/students', {
      data: {
        ids: selectedRowKeys,
      },
    })
    messageApi.success('批量删除学生信息成功！')
    setParams({
      ...params,
      total: params.total - selectedRowKeys.length,
    })
    setSelectedRowKeys([])
  }

  // 可选框
  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys)
      console.log(selectedRowKeys)
    },
  }

  // 关闭表单
  const closeForm = () => {
    form.resetFields()
    // 隐藏表单
    setModalOpen(false)
    // 重置学号重复弹出框
    setIsRepeatSid(false)
    // 重置专业下拉框可选
    setIsShowMajor(false)
    // 重置管理员选项
    setEditorManager(false)
    // 重置userId
    setEditId(0)
    // 重置 重置密码选项
    setResetPwd({
      isDisabled: true,
      isReset: false,
    })
    setModalOpen(false)
  }

  // 编辑中的管理员
  const [editorManager, setEditorManager] = useState(false)

  // 编辑中重置密码
  const [resetPwd, setResetPwd] = useState({
    isDisabled: true,
    isReset: false,
  })

  // 导出学生信息
  const excelExport = async () => {
    rawAxios({
      url: 'http://127.0.0.1:8090/api/student/export',
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'student.xlsx')
      document.body.appendChild(link)
      link.click()
    })
    messageApi.success('导出学生信息成功')
  }

  // 进度条
  const [progress, setProgress] = useState(0)
  const [pStatus, setPStatus] = useState(1)
  // 是否显示校验中
  const [isSpin, setIsSpin] = useState(false)
  // 校验信息内容
  const [checkInfo, setCheckInfo] = useState([])

  // 关闭上传Excel
  const closeUpload = () => {
    setOpenUpload(false)
    // 进度条
    setProgress(0)
    // 校验状态
    setPStatus(1)
    // 是否在校验中
    setIsSpin(false)
    // 校验信息内容
    setCheckInfo([])
  }

  return (
    <>
      <Modal
        centered
        open={modalOpen}
        footer={null}
        width={430}
        onCancel={() => {
          closeForm()
        }}>
        <StudentEditor
          form={form}
          setModalOpen={setModalOpen}
          isShowMajor={isShowMajor}
          setIsShowMajor={setIsShowMajor}
          college={college}
          isRepeatSid={isRepeatSid}
          setIsRepeatSid={setIsRepeatSid}
          collegeAndMajorId={collegeAndMajorId}
          editId={editId}
          editorManager={editorManager}
          setEditorManager={setEditorManager}
          resetPwd={resetPwd}
          setResetPwd={setResetPwd}
          closeForm={closeForm}
          params={params}
          setParams={setParams}
        />
      </Modal>
      <Modal
        centered
        open={openUpload}
        footer={null}
        width={850}
        onCancel={closeUpload}>
        <UploadExcel
          progress={progress}
          setProgress={setProgress}
          pStatus={pStatus}
          setPStatus={setPStatus}
          isSpin={isSpin}
          setIsSpin={setIsSpin}
          checkInfo={checkInfo}
          setCheckInfo={setCheckInfo}
        />
      </Modal>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div
            style={{
              width: 500,
              display: 'flex',
            }}>
            {/* 搜索框 */}
            <Search
              disabled={loading}
              placeholder="输入姓名搜索"
              onSearch={onSearch}
              style={{ width: 200 }}
              size="large"
            />
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size={'middle'}
              style={{ marginLeft: 20, backgroundColor: '#3d597f' }}
              onClick={excelExport}>
              导出Excel
            </Button>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              size={'middle'}
              style={{
                marginLeft: 20,
                fontSize: 14,
                backgroundColor: '#479192',
              }}
              onClick={() => setOpenUpload(true)}>
              导入Excel
            </Button>
          </div>
          <div
            style={{
              width: 180,
              display: 'flex',
              justifyContent: 'space-between',
            }}>
            {/* 批量删除 */}
            <Popconfirm
              title="是否删除所选学生信息？"
              onConfirm={delBatch}
              disabled={selectedRowKeys.length === 0}>
              <Button danger disabled={selectedRowKeys.length === 0}>
                批量删除
              </Button>
            </Popconfirm>
            {/* 新增学生 */}
            <Button
              type="primary"
              onClick={() => {
                setModalOpen(true)
                getCollege()
                setResetPwd({
                  ...resetPwd,
                  isReset: true,
                })
              }}>
              新增学生
            </Button>
          </div>
        </div>
        <Table
          // components={}
          rowSelection={{
            preserveSelectedRowKeys: true,
            type: 'checkbox',
            ...rowSelection,
          }}
          bordered
          dataSource={students}
          columns={defaultColumns}
          pagination={false}
          loading={loading}
        />
        {/*  分页 */}

        <Pagination
          style={{ float: 'right' }}
          pageSize={params.pageSize}
          disabled={loading}
          showSizeChanger
          pageSizeOptions={[10, 15, 20]}
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
          showTotal={(total) => `总共${total}条数据`}
        />
      </div>
    </>
  )
}

export default StudentManagement
