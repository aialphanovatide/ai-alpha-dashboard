import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilChart,
  cilNotes,
  cilPencil,
  cilSitemap,
  cilSpeedometer,
  cilLibrary,
  cilUser
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Home',
    to: '/home',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Content Creation',
    to: '/contentCreation',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Charts',
    to: '/chartsPage',
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Fundamentals',
    to: '/fundamentals',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Narrative Trading',
    to: '/narrativeTrading',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'News Bots Settings',
    to: '/botsSettings',
    icon: <CIcon icon={cilSitemap} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'News Creator Tool',
    to: '/newsCreatorTool',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'News Search Tool',
    to: '/newsSearchTool',
    icon: <CIcon icon={cilSitemap} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Top Stories',
    to: '/topStories',
    icon: <CIcon icon={cilLibrary} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Users List',
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
]

export default _nav;
