import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'

import { AppHeaderDropdown } from './header/index'
import ServerStatus from './ServerStatus'
import DrawerComponent from 'src/views/generalSettings/components/Drawer'
import NotificationsList from './NotificationsList'

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
    <CHeader position="sticky" className="p-0" ref={headerRef} style={{height: "9%", zIndex: 0}}>
      <CContainer className="border-bottom px-4" style={{height: "100%"}} fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" style={{margin: 0}} />
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink
              to="/home"
              component={NavLink}
              style={{ cursor: 'pointer', fontWeight: "bold", fontSize: 22 }} // Establece el estilo del cursor a "pointer"
            >
              AI Alpha
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav>
          <CButton onClick={toggleDrawer(true)}>
            <CIcon icon={cilBell} />
          </CButton>
          <CDropdown variant="nav-item" placement="bottom-end" >
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" style={{margin: 0}} />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" style={{margin: 0}}/>
              ) : (
                <CIcon icon={cilSun} size="lg" style={{margin: 0}}/>
              )}
            </CDropdownToggle>
            <CDropdownMenu style={{padding: 0}}>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                component="button"
                type="button"
                onClick={() => setColorMode('light')}
                style={{borderTopLeftRadius: "0.375rem", borderTopRightRadius: "0.375rem"}}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" style={{margin: 0}}/> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                component="button"
                type="button"
                onClick={() => setColorMode('dark')}
                style={{borderBottomLeftRadius: "0.375rem", borderBottomRightRadius: "0.375rem"}}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" style={{margin: 0}}/> Dark
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <ServerStatus isFullWidth/>
      <DrawerComponent
          toggleDrawer={toggleDrawer}
          open={open}
          anchor={'right'}
          className="draweer"
        >
         <NotificationsList />
        </DrawerComponent>
    </CHeader>
  )
}

export default AppHeader
