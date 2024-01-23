import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilChart,
  cilApple,
  cilCursor,
  cil3d,
  cilDrop,
  cilNotes,
  cilPencil,
  cilSitemap,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Bots Settings',
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
]

export default _nav
