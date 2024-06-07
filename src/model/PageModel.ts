interface PageRequest {
  page: number
  pageSize: number
}
interface PageResult<T> {
  total: number
  records: T[]
}
