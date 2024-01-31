import React, { useEffect, useState } from 'react'
import classNames from 'classnames'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
  cilMoodBad,
  cilMoodVeryGood,
} from '@coreui/icons'

const Dashboard = () => {
  const [botStatuses, setBotStatuses] = useState([])
  const [lastChartUpdate, setLastChartUpdate] = useState(null)
  const [allBotsInactive, setAllBotsInactive] = useState(true)

  useEffect(() => {
    const getBotStatus = async () => {
      try {
        const response = await fetch('https://star-oyster-known.ngrok-free.app/get_bot_status', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
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

    const getLastChartUpdate = async () => {
      try {
        const response = await fetch(
          'https://star-oyster-known.ngrok-free.app/get_last_chart_update',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        const data = await response.json()
        if (data && data.success && data.last_update) {
          const { coin_bot_name, formatted_date } = data.last_update
          setLastChartUpdate({ coin_bot_name: coin_bot_name.toUpperCase(), formatted_date })
        } else {
          console.error('La respuesta del servidor no contiene la estructura esperada:', data)
        }
      } catch (error) {
        console.error('Error al realizar la solicitud:', error)
      }
    }

    getBotStatus()
    getLastChartUpdate()
  }, [])

  useEffect(() => {
    if (Array.isArray(botStatuses) && botStatuses.length > 0) {
      const areAllBotsInactive = botStatuses.every((bot) => !bot.isActive)
      console.log('allBotsInactive:', areAllBotsInactive)
      setAllBotsInactive(areAllBotsInactive)
    }
  }, [botStatuses])
  return (
    <>
      <h1 id="traffic" className="mb-2">
        General Status:
      </h1>
      <br></br>
      <CCard
        className={classNames('mb-4', {
          'bg-danger': allBotsInactive,
          'bg-success': !allBotsInactive,
        })}
      >
        <CCardBody>
          <CRow>
            <CCol sm={10}>
              <h4 id="traffic" className="mb-2">
                {allBotsInactive ? (
                  <div className="bot-status-light red"></div>
                ) : (
                  <div className="bot-status-light green"></div>
                )}
                {allBotsInactive ? (
                  <div className="d-flex align-items-center">
                    <CIcon size="3xl" icon={cilMoodBad} className="me-2" />
                    <span>All Bots are OFF</span>
                  </div>
                ) : (
                  <div className="d-flex align-items-center">
                    <CIcon size="3xl" icon={cilMoodVeryGood} className="me-2" />
                    <span>All Bots are ON</span>
                  </div>
                )}
              </h4>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <br></br>
      <CCard className="bg-warning">
        <CCardBody>
          <CRow>
            <CCol sm={10}>
              <h4 id="traffic" className="mb-2">
                Last time chart was updated:
                {lastChartUpdate
                  ? ` ${lastChartUpdate.formatted_date} - CoinBot Chart Updated: ${lastChartUpdate.coin_bot_name}`
                  : ' Loading...'}
              </h4>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <br></br>
      <br></br>
      <CCard className="bg-info">
        <CCardBody>
          <CRow>
            <CCol sm={10}>
              <h4 id="traffic" className="mb-2">
                Last time Analysis created: 10/01/2024 {} - CoinBot Analysis Created: BTC{}
              </h4>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard
