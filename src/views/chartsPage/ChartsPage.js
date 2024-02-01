import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CInputGroup,
  CInputGroupText,
  CFormInput,
} from '@coreui/react'
import '../chartsPage/ChartsPage.css'
import config from '../../config'

const ChartsPage = () => {
  const [formData, setFormData] = useState({
    support1: '',
    support2: '',
    support3: '',
    support4: '',
    resistance1: '',
    resistance2: '',
    resistance3: '',
    resistance4: '',
    coin_bot_id: '', // Valor por defecto, ajusta según tus necesidades
  })
  const [successMessage, setSuccessMessage] = useState('')
  const [coinBots, setCoinBots] = useState([])

  useEffect(() => {
    const fetchCoinBots = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get_all_coin_bots`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (response.ok) {
          const data = await response.json()
          setCoinBots(data.coin_bots)
        } else {
          console.error('Error fetching coin bots:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching coin bots:', error)
      }
    }

    fetchCoinBots()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch(`${config.BASE_URL}/save_chart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          support_1: formData.support1,
          support_2: formData.support2,
          support_3: formData.support3,
          support_4: formData.support4,
          resistance_1: formData.resistance1,
          resistance_2: formData.resistance2,
          resistance_3: formData.resistance3,
          resistance_4: formData.resistance4,
          coin_bot_id: formData.coin_bot_id,
        }),
      })

      if (response.ok) {
        setFormData({
          support1: '',
          support2: '',
          support3: '',
          support4: '',
          resistance1: '',
          resistance2: '',
          resistance3: '',
          resistance4: '',
          coin_bot_id: '',
        })

        setSuccessMessage('Chart successfully Updated!') // Establece el mensaje de éxito

        // Limpia el mensaje después de unos segundos (ajusta el tiempo según tus preferencias)
        setTimeout(() => {
          setSuccessMessage('')
        }, 3000) // 3000 milisegundos (3 segundos) en este ejemplo
      } else {
        console.error('Error saving chart:', response.statusText)
      }
    } catch (error) {
      console.error('Error saving chart:', error)
    }
  }

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader>
            <strong>Update a Support-Resistance Chart:</strong>
          </CCardHeader>
          <CCardBody>
            <form onSubmit={handleSubmit}>
              {/* Input fields for support */}
              <CRow>
                <CCol md="6">
                  {[1, 2, 3, 4].map((index) => (
                    <div key={`support${index}`} className="mb-3">
                      <CInputGroup>
                        <CInputGroupText>{`Support ${index}`}</CInputGroupText>
                        <CFormInput
                          type="number"
                          name={`support${index}`}
                          value={formData[`support${index}`]}
                          onChange={handleChange}
                          required
                        />
                      </CInputGroup>
                    </div>
                  ))}
                </CCol>
              </CRow>

              {/* Input fields for resistance */}
              <CRow>
                <CCol md="6">
                  {[1, 2, 3, 4].map((index) => (
                    <div key={`resistance${index}`} className="mb-3">
                      <CInputGroup>
                        <CInputGroupText>{`Resistance ${index}`}</CInputGroupText>
                        <CFormInput
                          type="number"
                          name={`resistance${index}`}
                          value={formData[`resistance${index}`]}
                          onChange={handleChange}
                          required
                        />
                      </CInputGroup>
                    </div>
                  ))}
                </CCol>
              </CRow>

              {/* Success message */}
              {successMessage && <div className="success-message space">{successMessage}</div>}

              {/* Additional fields */}
              <div className="mb-3">
                <CInputGroup>
                  <CInputGroupText>Coin Bot</CInputGroupText>
                  <select
                    className="form-control"
                    name="coin_bot_id"
                    value={formData.coin_bot_id}
                    onChange={handleChange}
                    required
                  >
                    <option>Select...</option>
                    {coinBots.map((coinBot) => (
                      <option key={coinBot.id} value={coinBot.id}>
                        {coinBot.name}
                      </option>
                    ))}
                  </select>
                </CInputGroup>
              </div>

              {/* Submit button */}
              <CButton className="save-btn" color="primary" type="submit">
                Save Chart
              </CButton>
            </form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ChartsPage
