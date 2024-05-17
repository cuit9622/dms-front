import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import {
  Breadcrumb,
  Button,
  Layout,
  Menu,
  MenuProps,
  Typography,
  theme,
} from 'antd'
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb'
import UserDropMenu from 'components/UserDropMenu'
import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const { Header, Sider } = Layout
const { Title, Text } = Typography
const headerColor = '#ffffff'

//收缩侧边栏
function MenuTrigger(props: {
  collapsed: boolean
  toggleCollapsed: React.MouseEventHandler<HTMLAnchorElement> &
  React.MouseEventHandler<HTMLButtonElement>
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: headerColor,
        display: 'flex',
        alignItems: 'center',
        boxShadow: 'inset 0px 1px 0px #F0F0F0',
      }}>
      <Button
        type="text"
        style={{ marginLeft: 16 }}
        onClick={props.toggleCollapsed}>
        {props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
    </div>
  )
}

export default function Main(props: { menu: MenuProps['items'] }) {
  const [collapsed, setCollapsed] = useState(false)
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [menuConfig, setMenuConfig] = useState<{
    selectKeys: string[]
    breadCrumbItems: ItemType[]
  }>({
    selectKeys: [],
    breadCrumbItems: [],
  })
  const navigate = useNavigate()

  useEffect(() => {
    const urlSegement = location.pathname.split('/').filter((value) => value)
    let defaultSelectKeys: string[] = []
    let defaultOpenkeys: string[] = []
    let breadCrumbItems = [{ title: <HomeOutlined /> }]
    let item: string
    let i = 0
    let menu = props.menu!!
    item = urlSegement[i]
    try {
      defaultSelectKeys = [urlSegement[urlSegement.length - 1]]
      while (item != undefined) {
        item = urlSegement[i]
        const result: any = menu.find((value) => value!!.key == item)
        defaultOpenkeys.push(item)
        breadCrumbItems.push({ title: result.label })
        i++
        item = urlSegement[i]
        menu = result.children
      }
      defaultOpenkeys.pop() //最后一项是菜单的选择项，因此一定不是需要打开的项
    } catch (error) {
      //如果要渲染的页面不在侧边栏中，则将侧边栏与面包屑置为空
      defaultOpenkeys = []
      breadCrumbItems = []
      defaultSelectKeys = []
    }
    setOpenKeys(defaultOpenkeys)
    setMenuConfig({
      selectKeys: defaultSelectKeys,
      breadCrumbItems: breadCrumbItems,
    })
  }, [])

  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }
  //当点开菜单后调用此方法
  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    setOpenKeys([keys[keys.length - 1]])
  }
  const onSelect = (info: { keyPath: string[] }) => {
    let result = ''
    for (let item of info.keyPath.reverse()) {
      result += `/${item}`
    }
    navigate(result)
    //导航完成后重新设置面包屑与侧边栏
    const urlSegement = location.pathname.split('/').filter((value) => value)
    let breadCrumbItems = [{ title: <HomeOutlined /> }]
    let item: string
    let i = 0
    let menu = props.menu!!
    item = urlSegement[i]
    while (item != undefined) {
      item = urlSegement[i]
      const result: any = menu.find((value) => value!!.key == item)
      breadCrumbItems.push({ title: result.label })
      i++
      item = urlSegement[i]
      menu = result.children
    }
    setMenuConfig({
      selectKeys: [urlSegement[urlSegement.length - 1]],
      breadCrumbItems: breadCrumbItems,
    })
  }

  return (
    <Layout style={{ width: '100%', height: '100%' }}>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingInline: 0,
        }}>
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 28 }}>
          <img
            src="/logo.svg"
            style={{ width: 35, height: 35, marginRight: 8 }}
          />
          <Title level={2} style={{ marginBottom: 0, color: headerColor }}>
            DMS
          </Title>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 80 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>
            <UserDropMenu setMenuconfig={setMenuConfig} />
          </div>
        </div>
      </Header>
      <Layout>
        <Sider
          trigger={React.createElement(MenuTrigger, {
            collapsed,
            toggleCollapsed,
          })}
          collapsible
          collapsed={collapsed}
          width={200}
          style={{
            background: colorBgContainer,
            overflowY: 'auto',
            userSelect: 'none',
          }}>
          <Menu
            mode="inline"
            selectedKeys={menuConfig.selectKeys}
            style={{ height: '100%', borderRight: 0 }}
            items={props.menu}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            onSelect={onSelect}
          />
        </Sider>
        <Layout
          style={{
            padding: '0 24px 24px',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}>
          <Breadcrumb
            style={{ margin: '16px 0' }}
            items={menuConfig.breadCrumbItems}
          />
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
    </Layout>
  )
}
