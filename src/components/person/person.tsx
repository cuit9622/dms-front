import { Layout, Menu, theme } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { Outlet, useNavigate } from 'react-router-dom'

export default function Person(props: any) {
  const urlSegement = location.pathname.split('/').filter((value) => value)
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const navigate = useNavigate()
  const onSelect = (info: { keyPath: string[] }) => {
    navigate(info.keyPath[0])
  }
  return (
    <Layout>
      <Sider>
        <Menu
          defaultSelectedKeys={[urlSegement[urlSegement.length - 1]]}
          mode="inline"
          style={{ height: '100%', borderRight: 0 }}
          items={[
            { key: 'basicInformation', label: '基本信息' },
            { key: 'changePassword', label: '修改密码' },
          ]}
          onSelect={onSelect}
        />
      </Sider>
      <Layout>
        <div
          style={{
            padding: '24px 24px 0px 24px',
            margin: 0,
            background: colorBgContainer,
          }}>
          <Outlet />
        </div>
      </Layout>
    </Layout>
  )
}
