import {
  BarsOutlined,
  CheckCircleOutlined,
  DashboardOutlined,
  HighlightOutlined,
  SaveOutlined,
  SolutionOutlined,
  TableOutlined,
  ToolOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { MenuProps } from 'antd'
import { ItemType } from 'antd/es/menu/hooks/useItems'
import React from 'react'

type MenuItem = [
  string,
  React.FunctionComponent<any>,
  string,
  [string, String][]?
]
//管理员菜单
const adminMenuItems: MenuItem[] = [
  ['announcement', DashboardOutlined, '公告管理'],
  ['laboratory', BarsOutlined, '实验室管理'],
  [
    'appointment',
    CheckCircleOutlined,
    '预约管理',
    [
      ['auditAppointment', '审核预约'],
      ['appointmentRecord', '预约记录'],
    ],
  ],
  ['device', HighlightOutlined, '设备管理'],
  [
    'user',
    UserOutlined,
    '用户管理',
    [
      ['studentUser', '学生管理'],
      ['teacherUser', '教师管理'],
    ],
  ],
]
//老师菜单
const teacherMenuItems: MenuItem[] = [
  [
    'appointment',
    CheckCircleOutlined,
    '预约管理',
    [
      ['appointmentInfo', '预约信息'],
      ['labAppointment', '预约实验室'],
    ],
  ],
  [
    'device',
    ToolOutlined,
    '设备',
    [
      ['deviceBorrow', '设备借用'],
      ['deviceReturn', '设备归还'],
    ],
  ],
  ['attendance', SolutionOutlined, '考勤管理'],
]
//学生菜单
const studentMenuItems: MenuItem[] = [
  ['labAppointment', SaveOutlined, '预约实验室'],
  ['checkRecord', TableOutlined, '查看考勤记录'],
  [
    'device',
    ToolOutlined,
    '设备',
    [
      ['deviceBorrow', '设备借用'],
      ['deviceReturn', '设备归还'],
    ],
  ],
]
//将菜单转换为Ant格式
function MenuItemsToMenuProps(menuItems: MenuItem[]): MenuProps['items'] {
  let result: MenuProps['items'] = []
  for (let menuItem of menuItems) {
    let item: any = {
      key: menuItem[0],
      icon: React.createElement(menuItem[1]),
      label: menuItem[2],
    }
    if (menuItem[3] != undefined) {
      item.children = menuItem[3].map((data) => {
        return {
          key: data[0],
          label: data[1],
        }
      })
    }
    result.push(item as ItemType)
  }
  return result
}

export const adminMenu: MenuProps['items'] =
  MenuItemsToMenuProps(adminMenuItems)

export const teacherMenu: MenuProps['items'] =
  MenuItemsToMenuProps(teacherMenuItems)

export const studentMenu: MenuProps['items'] =
  MenuItemsToMenuProps(studentMenuItems)
