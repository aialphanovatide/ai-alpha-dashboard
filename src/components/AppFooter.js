import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4" style={{height: "6%"}}>
      <div>
        <span className="ms-1">&copy; 2024 Novatide Limited.</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
