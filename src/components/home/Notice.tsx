import { List, Pagination } from 'antd'
import { useEffect, useState } from 'react'
import axios from 'tools/axios'

interface NoticeModel {
  content: string
  createTime: string
  creator: number
  name: string
  noticeId: number
  title: string
  updateTime: string
}
export default function Notice() {
  // 公告信息
  const [notices, setNotices] = useState<NoticeModel[]>([])

  const [total, setTotal] = useState<number>(0)
  const [reqParam, setReqParam] = useState({
    page: 1,
    pageSize: 5,
  })

  useEffect(() => {
    axios
      .get('/notice/list', {
        params: { page: reqParam.page, pageSize: reqParam.pageSize },
      })
      .then((resp) => {
        const data = resp.data
        setTotal(data.total)
        setNotices(data.records)
      })
  }, [reqParam])

  return (
    <div style={{ position: 'relative', marginBottom: 5 }}>
      <List
        style={{ backgroundColor: '#fff', marginBottom: 5 }}
        header={<h3>公告信息</h3>}
        bordered
        dataSource={notices}
        renderItem={(item: NoticeModel) => (
          <List.Item>
            <p style={{ fontWeight: 'bold' }}>{item.title}</p>
            <p>{item.content}</p>
            <p>{item.createTime}</p>
          </List.Item>
        )}
      />
      <div
        style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination
          style={{ display: 'inline-block' }}
          pageSize={reqParam.pageSize}
          showSizeChanger
          pageSizeOptions={[5, 10, 15, 20]}
          onChange={(page, pageSize) => {
            setReqParam({
              ...reqParam,
              page: page,
              pageSize: pageSize,
            })
          }}
          total={total}
          showQuickJumper
          showTotal={(total) => `总共${total}条公告`}
        />
      </div>
    </div>
  )
}
