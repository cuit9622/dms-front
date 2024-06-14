import { LoadingOutlined, ToolTwoTone, UploadOutlined } from '@ant-design/icons'
import { Button, List, Progress, Spin, Typography, Upload, message } from 'antd'
import { useState } from 'react'
import axios from '../../tools/axios'

export function UploadExcel(props: {
  progress: any
  setProgress: any
  pStatus: any
  setPStatus: any
  isSpin: any
  setIsSpin: any
  checkInfo: any
  setCheckInfo: any
}) {
  const {
    progress,
    setProgress,
    pStatus,
    setPStatus,
    isSpin,
    setIsSpin,
    checkInfo,
    setCheckInfo,
  } = props

  // 加载图标
  const loadingIcon = (
    <LoadingOutlined
      style={{ fontSize: 15, marginBottom: 5, marginLeft: 2 }}
      spin
    />
  )

  const [listLoading, setListLoading] = useState(false)

  const excelImport = async (file: any) => {
    // 列表加载
    setListLoading(true)
    // 进度条
    setProgress(0)
    // 校验状态
    setPStatus(1)
    // 校验信息内容
    setCheckInfo([])
    // 设置为校验中
    setIsSpin(true)
    file = file.file
    //转化为formData格式
    let formData = new FormData()
    formData.append('file', file)
    let res = await axios.post('/student/import', formData)
    console.log(res.data.length)
    let pass = res.data.length

    // 如果校验错误
    if (pass !== 0) {
      // 显示错误进度条
      setProgress(100)
      setPStatus(0)
      // 停止校验
      setIsSpin(false)
      setListLoading(false)
      // 不成功则将错误信息显示出来
      setCheckInfo(res.data)
      message.error('导入Excel失败')
    }

    // 如果校验通过
    else {
      setListLoading(false)
      // 显示通过进度条
      setProgress(100)
      // 停止校验
      setIsSpin(false)
      message.success('导入Excel成功')
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <ToolTwoTone />
        {isSpin === true ? '校验中' : '校验'}
        <Spin indicator={loadingIcon} spinning={isSpin} />
        <Progress
          percent={progress}
          status={pStatus === 1 ? 'active' : 'exception'}
        />
      </div>

      <List
        style={{
          height: 500,
          overflow: 'auto',
          marginBottom: 30,
          textAlign: 'center',
        }}
        loading={listLoading}
        header={<div>校验信息</div>}
        bordered
        dataSource={checkInfo}
        renderItem={(item: any) => (
          <List.Item>
            <Typography.Text mark>[ERROR]</Typography.Text> {item}
          </List.Item>
        )}
      />
      <Upload showUploadList={false} customRequest={excelImport} accept=".xlsx">
        <Button
          type="primary"
          size={'middle'}
          icon={<UploadOutlined />}
          style={{ marginLeft: 650 }}>
          上传文件
        </Button>
      </Upload>
    </div>
  )
}
