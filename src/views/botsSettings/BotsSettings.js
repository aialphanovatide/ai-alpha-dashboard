import React, { useEffect, useState, useCallback } from 'react'
import classNames from 'classnames'
import '../botsSettings/bs.css'
import { CButton, CButtonGroup, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilXCircle, cilCheckCircle, cilToggleOn, cilToggleOff } from '@coreui/icons'
import AddWordsModal from '../addWordsModal/AddWordsModal'
import DeleteWordsModal from '../deleteWordsModal/DeleteWordsModal'
import AddSitesModal from '../addSitesModal/AddSitesModal'
import config from '../../config'
import DeleteSitesModal from '../deleteSitesModal/DeleteSitesModal'
//bots settings

const BotsSettings = () => {

  const [bots, setBots] = useState([])
  const [loading, setLoading] = useState(false)

  const getAllBots = useCallback(async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/get_all_bots`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const responseText = await response.text()
      console.log('Response Text:', responseText)

      try {
        const data = JSON.parse(responseText)
        console.log('Data:', data)

        if (data && data.bots) {
          setBots(data.bots)
        } else {
          console.error('Error in response:', data.message)
        }
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateBotState = useCallback(
    async (url, botCategory) => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ category: botCategory }),
        })

        const data = await response.json()
        if (data) {
          await getAllBots()
          console.log(`Bot ${botCategory} Updated After:`, data.bot)
        } else {
          console.error(
            `Error At ${url === 'activate_bot' ? 'TurnON' : 'TurnOFF'} the bot ${botCategory}:`,
            data.message,
          )
        }
      } catch (error) {
        console.error('Error during:', error)
      } finally {
        setLoading(false)
      }
    },
    [getAllBots],
  )

  const turnOnAllBots = useCallback(() => {
    setLoading(true)
    updateBotState(`${config.BASE_URL}/activate_all_bots`)
  }, [updateBotState])

  const turnOffAllBots = useCallback(() => {
    setLoading(true)
    updateBotState(`${config.BASE_URL}/deactivate_all_bots`)
  }, [updateBotState])

  useEffect(() => {
    // Cargar bots inicialmente
    getAllBots()
  }, [getAllBots])

  useEffect(() => {
    console.log('Bots State:', bots)
  }, [bots])

  return (
    <>
      <h3 id="traffic" className="mb-2">
        Bot settings
      </h3>
      <br></br>
      <CRow>
        {bots.map((bot, index) => (
          <CCol key={index} sm={4}>
            <CCard
              className={classNames('mb-4', {
                'bg-danger': !bot.isActive,
                'bg-success': bot.isActive,
              })}
            >
              <CCardBody>
                <CRow>
                  <CCol sm={8}>
                    <h4 id="traffic" className="mb-2">
                      {bot.isActive ? (
                        <div className="bot-status green"></div>
                      ) : (
                        <div className="bot-status red"></div>
                      )}
                      <div className="d-flex align-items-center">
                        <CIcon
                          size="3xl"
                          icon={bot.isActive ? cilCheckCircle : cilXCircle}
                          className="me-2"
                        />
                        <span>{bot.category.toUpperCase()}</span>
                      </div>
                    </h4>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
      <CButtonGroup className="mb-2">
        <div className="d-flex align-items-center">
          {loading && (
            <button className="load-btn btn btn-primary me-2" type="button" disabled>
              <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
            </button>
          )}
          <CButton
            className={`btn ${bots.every((bot) => bot.isActive) ? 'btn-danger' : 'btn-success'}
                bot-btn`}
            onClick={
              loading ? null : bots.every((bot) => bot.isActive) ? turnOffAllBots : turnOnAllBots
            }
          >
            {bots.every((bot) => bot.isActive) ? 'Turn Off All Bots' : 'Turn On All Bots'}
          </CButton>
        </div>
      </CButtonGroup>
      <br></br>
     
      <div>
        <h4>Actions</h4>
        <div>
          <AddWordsModal />
          <DeleteWordsModal />
          <AddSitesModal />
          <DeleteSitesModal />
        </div>
      </div>
      <br></br>
    </>
  )
}

export default BotsSettings
