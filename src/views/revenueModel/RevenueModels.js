import React, { useEffect, useState } from 'react'
import { Form, Button, Modal, Table } from 'react-bootstrap'
import config from '../../config'
import RMForm from './RMForm'

const RevenueModels = () => {
  const [selectedCoinBot, setSelectedCoinBot] = useState('')
  const [content, setContent] = useState('')
  const [website, setWebsite] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showCreateButton, setShowCreateButton] = useState(false)
  const [revenueModels, setRevenueModels] = useState([])
  const [bots, setBots] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [infoMessage, setInfoMessage] = useState('')

  const handleCreateClick = async (formData) => {
    try {
      const response = await fetch(`${config.BASE_URL}/api/create_revenue_model`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        credentials: 'include',
        body: JSON.stringify({
          coin_bot_id: selectedCoinBot,
          analized_revenue: formData.analizedRevenue,
          fees_1ys: formData.fees_1ys,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        console.log('Revenue model created successfully:', result)
        setShowModal(true)

        // Cierra el modal después de dos segundos
        setTimeout(() => {
          setShowModal(false)
        }, 2000)
      } else {
        console.error('Error creating Revenue Model:', result.error)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }
  useEffect(() => {
    const getAllBots = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get_all_coin_bots`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        const data = await response.json()
        if (data && data.coin_bots) {
          setBots(data.coin_bots)
        } else {
          console.error('Error fetching bots:', data.message)
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }

    getAllBots()
  }, [])

  useEffect(() => {
    const getRevenueModels = async () => {
      try {
        const response = await fetch(
          `${config.BASE_URL}/api/get_revenue_models?coin_bot_id=${selectedCoinBot}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
            credentials: 'include',
          },
        )

        const data = await response.json()
        console.log(data)
        if (data && data.revenue_models) {
          setRevenueModels(data.revenue_models)
          setShowCreateButton(data.revenue_models.length === 0)
          setInfoMessage('') // Limpiar el mensaje de información
        } else {
          console.error('Error fetching Revenue Models:', data.error)
          setShowCreateButton(true)
          setInfoMessage('No revenue models found for the selected coin.') // Establecer mensaje de falta de información
        }
      } catch (error) {
        console.error('Error:', error)
        setShowCreateButton(true)
        setInfoMessage('Error fetching revenue models.') // Establecer mensaje de error
      }
    }

    if (selectedCoinBot) {
      getRevenueModels()
    }
  }, [selectedCoinBot])

  const handleCoinBotChange = (value) => {
    setSelectedCoinBot(value)
  }

  const handleContentChange = (value) => {
    setContent(value)
  }

  return (
    <div>
      <div style={{ margin: '20px' }}>
        <h2>Revenue Models Sub-Section Form</h2>

        <Form.Group controlId="coinBotSelect" style={{ marginBottom: '15px' }}>
          <Form.Label>Select Coin</Form.Label>
          <Form.Control
            as="select"
            value={selectedCoinBot}
            onChange={(e) => handleCoinBotChange(e.target.value)}
          >
            <option value="">Select...</option>
            {bots.map((bot) => (
              <option key={bot.id} value={bot.id}>
                {bot.name.toUpperCase() || 'No Name'}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {showCreateButton && (
          <Button
            variant="primary"
            style={{ marginTop: '10px' }}
            onClick={() => setShowCreateForm(true)}
          >
            Create RevenueModel Data
          </Button>
        )}
        {infoMessage && <p style={{ color: 'red' }}>{infoMessage}</p>}
        {revenueModels && revenueModels.length > 0 ? (
          <>
            <br />
            <h3>Revenue Models</h3>
            <br />
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Action</th>
                  {/* Add other columns based on your data model */}
                </tr>
              </thead>
              <tbody>
                {revenueModels.map((revenueModel) => (
                  <tr key={revenueModel.id}>
                    <td>
                      <button onClick={() => console.log('Edit button clicked')}>Edit</button>
                    </td>
                    {/* Add other columns based on your data model */}
                  </tr>
                ))}
              </tbody>
            </Table>
            <br />
            <br />
          </>
        ) : null}
      </div>
      {/* Modal para el formulario de creación */}
      <RMForm
        onSubmit={handleCreateClick}
        onCancel={() => setShowCreateForm(false)}
        show={showCreateForm}
      />
    </div>
  )
}

export default RevenueModels
