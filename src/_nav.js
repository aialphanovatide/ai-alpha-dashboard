import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilChart,
  cilNotes,
  cilPencil,
  cilSitemap,
  cilSpeedometer,
  cilLibrary
} from '@coreui/icons'
import {  CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'News Bots Settings',
    to: '/botsSettings',
    icon: <CIcon icon={cilSitemap} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Charts',
    to: '/chartsPage',
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Analysis',
    to: '/analysis',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Fundamentals',
    to: '/fundamentals',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Top Stories',
    to: '/topStories',
    icon: <CIcon icon={cilLibrary} customClassName="nav-icon" />,
  },
]

export default _nav
