import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { CRow, CCol, CCard, CCardBody } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import config from '../../config'

const WidgetsDropdown = (props) => {
  const [botStatuses, setBotStatuses] = useState([])
  const [allBotsInactive, setAllBotsInactive] = useState(true)

  useEffect(() => {
    const getBotStatus = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get_bot_status`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "X-Api-Key": config.X_API_KEY,
          },
        })

        const data = await response.json()
        if (data && data.success && data.bot_statuses) {
          const botStatusesArray = Object.keys(data.bot_statuses).map((category) => ({
            category,
            isActive: data.bot_statuses[category],
          }))

          setBotStatuses(botStatusesArray)
        } else {
          console.error('La respuesta del servidor no contiene la estructura esperada:', data)
        }
      } catch (error) {
        console.error('Error al realizar la solicitud:', error)
      }
    }

    getBotStatus()
  }, [])

  useEffect(() => {
    if (Array.isArray(botStatuses) && botStatuses.length > 0) {
      const areAllBotsInactive = botStatuses.every((bot) => !bot.isActive)
      console.log('allBotsInactive:', areAllBotsInactive)
      setAllBotsInactive(areAllBotsInactive)
    }
  }, [botStatuses])

  return (
    <CRow className={props.className} xs={{ gutter: 2 }}>
      <CCol sm={6} xl={4} xxl={3}>
        <CCard color={allBotsInactive ? 'danger' : 'success'}>
          <CCardBody>
            <h4 className="card-title mb-0">
              {allBotsInactive ? 'All Bots are OFF' : 'All Bots are ON'}
            </h4>
            <div className="small text-body-secondary">January - July 2023</div>
            <CIcon width={36} name={allBotsInactive ? 'cil-x' : 'cil-check'} />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown
