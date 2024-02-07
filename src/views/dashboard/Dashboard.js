import React, { useEffect, useState } from 'react'
import config from '../../config'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilMoodBad,
  cilMoodVeryGood,
} from '@coreui/icons'
import { TbReportAnalytics } from "react-icons/tb";
import './dashboardStyles.css';

const CenteredBox = ({ title, coin, date }) => {
  return (
    <div className="centered-box">
      <h1 className="title">{title}</h1>
      <h1 className="subtitle">{coin && `Coin: ${coin}`}</h1>
      <h2 className="subtitle">Last update: {date}</h2>
    </div>
  );
};

const Dashboard = () => {

  const [botStatuses, setBotStatuses] = useState([])
  const [lastChartUpdate, setLastChartUpdate] = useState(null)
  const [allBotsInactive, setAllBotsInactive] = useState(true)

  // Gets the last chart updated
  useEffect(()=>{
    const getLastChartUpdate = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get_last_chart_update`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (response.ok){
          const data = await response.json()
          const { coin_bot_name, formatted_date } = data.last_update
          setLastChartUpdate({ coin_bot_name: coin_bot_name.toUpperCase(), formatted_date })
        } else {
          console.error('Error:', response.statusText)
        }
      } catch (error) {
        console.error('Error making request:', error)
      }
    }
    getLastChartUpdate()
  }, [])

  const coin = lastChartUpdate && lastChartUpdate.coin_bot_name ? lastChartUpdate.coin_bot_name : ''
  const date = lastChartUpdate && lastChartUpdate.formatted_date ? lastChartUpdate.formatted_date : ''
  
  return (
    <div className='dashboardMain'>
    <h3 className="mb-2">General status</h3>
    <div className='dasboardSubMain'>
    <CenteredBox title="News Bot" date="Coming soon..." />
    <CenteredBox title="Chart" coin={coin} date={date} />
    <CenteredBox title="Analysis" date="Coming soon..." />
    </div>
    </div>
  )
}

export default Dashboard








// useEffect(() => {
//   const getBotStatus = async () => {
//     try {
//       const response = await fetch(`${config.BASE_URL}/get_bot_status`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       })

//       const data = await response.json()
//       if (data && data.success && data.bot_statuses) {
//         const botStatusesArray = Object.keys(data.bot_statuses).map((category) => ({
//           category,
//           isActive: data.bot_statuses[category],
//         }))

//         setBotStatuses(botStatusesArray)
//       } else {
//         console.error('La respuesta del servidor no contiene la estructura esperada:', data)
//       }
//     } catch (error) {
//       console.error('Error al realizar la solicitud:', error)
//     }
//   }



//   getBotStatus()
// }, [])

// useEffect(() => {
//   if (Array.isArray(botStatuses) && botStatuses.length > 0) {
//     const areAllBotsInactive = botStatuses.every((bot) => !bot.isActive)
//     console.log('allBotsInactive:', areAllBotsInactive)
//     setAllBotsInactive(areAllBotsInactive)
//   }
// }, [botStatuses])

      {/* <CCard
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
      </CCard> */}
