import { ConfigProvider, message } from 'antd'
import { MessageInstance } from 'antd/es/message/interface'
import zhCN from 'antd/locale/zh_CN'
import { User } from 'model/User'
import React, { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { generateRouter } from 'router/router'
import axios from 'tools/axios'

export const GlobalContext = React.createContext<{
  messageApi: MessageInstance
  user: User
  setRouter: React.Dispatch<React.SetStateAction<any>>
  setUser: React.Dispatch<React.SetStateAction<User>>
}>(null as any)

export default function App(props: any) {
  //通过token中的信息设置对应路由
  const targetRouter = generateRouter(localStorage.getItem('router'))

  const [messageApi, contextHolder] = message.useMessage()
  const [router, setRouter] = useState(targetRouter)
  const [user, setUser] = useState<User>({
    id: 0,
    username: '',
    realName: '',
    sex: '',
    phone: '',
    email: '',
    avatar: '',
    createTime: new Date(),
    updateTime: new Date(),
  })

  useEffect(() => {
    axios.interceptors.response.use(
      (response) => {
        const data: { code: number; msg: string; data: any } = response.data
        if (data.code != 0) {
          switch (data.code) {
            case 401: //token异常时将路由设置为默认路由
              //只显示一次token异常
              messageApi.error(data.msg)
              localStorage.removeItem('token')
              localStorage.removeItem('router')
              window.location.pathname = '/'
              break
            default:
              messageApi.error(data.msg)
              break
          }
          return Promise.reject(response)
        }
        response.data = data.data
        return response
      },
      (error) => {
        let msg = error.message
        const data: { code: number; msg: string; data: any } =
          error.response.data
        if (data) msg = data.msg
        messageApi.error(msg)
        return Promise.reject(error)
      }
    )

    //Token登录
    if (localStorage.getItem('token') != null) {
      axios.get('/auth/token').then((resp) => {
        const data = resp.data
        if (data.grade) {
          data.grade = data.grade + '级'
        }
        if (data.classNumber) {
          data.classNumber = data.classNumber + '班'
        }
        setUser(data)
      })
    }

    return () => {
      axios.interceptors.response.clear()
    }
  }, [])

  return (
    <GlobalContext.Provider
      value={{
        setRouter: setRouter,
        messageApi: messageApi,
        user: user,
        setUser: setUser,
      }}>
      <ConfigProvider locale={zhCN}>
        {contextHolder}
        <RouterProvider router={router} />
      </ConfigProvider>
    </GlobalContext.Provider>
  )
}
