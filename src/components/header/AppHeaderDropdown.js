import React from 'react'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()

  const handleSignOut = () => {
    navigate('/login')
  }

  return (
    <CDropdown variant="nav-item py-1" style={{display: "flex"}}>
      <CDropdownToggle
        placement="bottom-end"
        className="py-0 pe-0 d-flex align-items-center"
        caret={false}
      >
        <CIcon icon={cilUser} className="downn" size="lg" style={{margin: 0}}/>
      </CDropdownToggle>
      <CDropdownMenu>
        <CDropdownItem className="logout-button" onClick={handleSignOut}>
          Sign Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
