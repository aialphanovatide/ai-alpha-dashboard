import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  return (
    <div>
      <AppSidebar />
      <div style={{height: "100%", overflow: "hidden"}} className="wrapper d-flex flex-column">
        <AppHeader />
        <div className="body" style={{maxHeight: "84%", minHeight: "84%"}}>
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
