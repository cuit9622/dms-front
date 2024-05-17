export interface AnnoucementModel {
  page: number
  pageSize: number
  title: string
  level: string
  createTime: string
  total: number
  pages?: number
}

export interface NoticeModel {
  content: string
  createTime: string
  creator: string
  id: number
  level: number
  name: string
  title: string
  updateTime: string
}
