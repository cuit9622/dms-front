import {
  GithubOutlined,
  LockOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Avatar, Button, Form, Input, Layout, Modal, Typography } from 'antd'
import { Footer } from 'antd/es/layout/layout'
import { GlobalContext } from 'app'
import CFTurnstile from 'components/common/CFTurnstile'
import { passwordRule } from 'components/person/changePassword'
import React, { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'tools/axios'

const { Header, Content, Sider } = Layout
const { Title, Text } = Typography

export function Login(props: any) {
  const marginX = 20
  const { messageApi, setRouter, setUser } = useContext(GlobalContext)
  const [modalOpen, setModalOpen] = useState(false)
  const characterButtons = useRef<React.ReactNode[]>([])
  const navigate = useNavigate()

  function CharacterButton(props: {
    role: string
    router: any
    Icon: React.FC<{ style?: React.CSSProperties }>
    name: string
  }) {
    return (
      <Button
        style={{
          width: 120,
          height: 120,
          marginLeft: 10,
          marginRight: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onClick={() => {
          axios
            .post('/auth/roleToken', null, {
              params: {
                role: props.role,
              },
            })
            .then((response) => {
              const data = response.data
              localStorage.setItem('token', data.data)
              axios.get('/auth/token').then((resp) => {
                if (resp.data.data.grade) {
                  resp.data.data.grade = resp.data.data.grade + '级'
                }
                if (resp.data.data.classNumber) {
                  resp.data.data.classNumber = resp.data.data.classNumber + '班'
                }
                setUser(resp.data.data)
                setRouter(props.router)
              })
            })
        }}>
        <props.Icon style={{ fontSize: 90 }} />
        <div>{props.name}</div>
      </Button>
    )
  }

  const onFinish = (values: any) => {
    axios.post('/login', values).then((response) => {
      const data = response.data
      messageApi.success('成功登录')
      localStorage.setItem('token', data.data.token)
    })
  }
  function openGithub() {
    window.open('https://github.com/EngineerProject1/olms-front')
  }

  return (
    <Layout style={{ width: '100%', height: '100%', background: '#F0F2F5' }}>
      <Modal
        title="请选择要登录的角色"
        centered
        open={modalOpen}
        footer={null}
        closable={false}>
        <div
          style={{
            height: 180,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {characterButtons.current}
        </div>
      </Modal>
      <Content
        style={{
          margin: 0,
          position: 'relative',
          width: '100%',
          height: '100%',
          overflowX: 'hidden',
          overflowY: 'auto',
          backgroundColor: '#F0F2F5',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <div
          style={{
            width: 280,
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}>
          <div
            style={{
              width: '100%',
              marginBottom: 45,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <div
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                marginRight: 13,
                marginBottom: 40,
              }}
              onClick={() => {
                navigate('/')
              }}>
              <Avatar src={'/logo.svg'} />
              <Title level={2} style={{ marginBottom: 3, marginLeft: 8 }}>
                OLMS
              </Title>
            </div>
            <Form
              name="basic"
              style={{ width: 300 }}
              onFinish={onFinish}
              layout="vertical"
              autoComplete="off">
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入学号/教职工号' }]}>
                <Input placeholder="学号/教职工号" prefix={<UserOutlined />} />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  passwordRule,
                ]}>
                <Input.Password placeholder="密码" prefix={<LockOutlined />} />
              </Form.Item>
              <Form.Item
                name="token"
                rules={[{ required: true, message: '未通过人机验证' }]}>
                <CFTurnstile />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: '100%' }}>
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Content>
      <Footer
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F0F2F5',
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <Text
            type="secondary"
            style={{ marginLeft: marginX, marginRight: marginX }}>
            cuit9622
          </Text>
          <GithubOutlined
            style={{
              color: 'rgba(0,0,0,0.45)',
              marginLeft: marginX,
              marginRight: marginX,
            }}
            onClick={openGithub}
          />
          <Text
            type="secondary"
            style={{ marginLeft: marginX, marginRight: marginX }}>
            OLMS
          </Text>
        </div>
        <Text type="secondary">Copyright ©2023 Produced by cuit9622</Text>
      </Footer>
    </Layout>
  )
}
