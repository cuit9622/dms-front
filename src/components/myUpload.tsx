import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Upload, message } from 'antd'
import type { UploadChangeParam } from 'antd/es/upload'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import { useEffect, useState } from 'react'

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('你只能上传JPG/PNG文件!')
  }
  const isLt4M = file.size / 1024 / 1024 < 4
  if (!isLt4M) {
    message.error('图片大小不能超过4M')
  }
  return isJpgOrPng && isLt4M
}
/**
 *
 * @param setName 是一个useState的set方法用于设定名字使用
 * @param fileList 用于回显图片
 * @returns
 */
const MyUpload = ({
  setName,
  fileList,
}: {
  setName: (name: string) => void
  fileList?: string
}) => {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()

  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      setName(info.file.response.data)

      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false)
        setImageUrl(url)
      })
    }
  }

  useEffect(() => {
    if (fileList && !imageUrl) {
      setImageUrl(fileList)
    }
  })

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  )

  return (
    <>
      <Upload
        name="file"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="/api/auth/img/upload"
        headers={{ token: String(localStorage.getItem('token')) }}
        beforeUpload={beforeUpload}
        onChange={handleChange}>
        {imageUrl ? (
          <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
        ) : (
          uploadButton
        )}
      </Upload>
    </>
  )
}

export default MyUpload
