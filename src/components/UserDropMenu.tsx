import { Avatar, Button, Dropdown, MenuProps, Space } from 'antd'
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb'
import { GlobalContext } from 'app'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'tools/axios'

const UserDropMenu = (props: {
  setMenuconfig: React.Dispatch<
    React.SetStateAction<{
      selectKeys: string[]
      breadCrumbItems: ItemType[]
    }>
  >
}) => {
  const { messageApi, user } = useContext(GlobalContext)
  const navigate = useNavigate()

  const personalCenter = () => {
    props.setMenuconfig({
      selectKeys: [],
      breadCrumbItems: [],
    })
    navigate('/person/basicInformation')
  }

  const logout = () => {
    axios.get('/auth/logout').then((resp) => {
      if (resp.data.code === 200) {
        localStorage.removeItem('token')
        messageApi.success('成功退出登录')
        setTimeout(() => {
          location.href = '/login'
        }, 800)
      }
    })
  }
  const items: MenuProps['items'] = [
    {
      label: '个人中心',
      key: '1',
      onClick: personalCenter,
    },
    {
      label: '退出登录',
      key: '2',
      onClick: logout,
    },
  ]

  return (
    <Space wrap>
      <Dropdown menu={{ items }} arrow={{ pointAtCenter: true }}>
        <Space>
          <Space>
            <Avatar
              src={
                user.avatar != ''
                  ? `/api/img/download?name=${user.avatar}`
                  : '/avatar.png'
              }
              size="large"
            />
          </Space>
          <Button
            style={{
              backgroundColor: '#001529',
              border: 'none',
              outline: 'none',
            }}>
            <Space style={{ fontSize: '18px', color: 'white' }}>
              {user.realName}
            </Space>
          </Button>
        </Space>
      </Dropdown>
    </Space>
  )
}

export default UserDropMenu
