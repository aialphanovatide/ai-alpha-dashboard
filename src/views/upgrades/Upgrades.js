import React, { useState, useEffect } from 'react'
import { Form, Table, Button, Modal } from 'react-bootstrap'
import UpgradesForm from './UpgradesForm'
import config from '../../config'

const Upgrades = () => {
  const [bots, setBots] = useState([])
  const [selectedCoinBot, setSelectedCoinBot] = useState('')
  const [upgrades, setUpgrades] = useState([])
  const [showCreateButton, setShowCreateButton] = useState(false)

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
          setUpgrades([])
          console.error('Error fetching bots:', data.message)
        }
      } catch (error) {
        setUpgrades([])
        console.error('Error:', error)
      }
    }

    getAllBots()
  }, [])

  const [showCreateForm, setShowCreateForm] = useState(false)

  const handleCreateButtonClick = () => {
    setShowCreateForm(true)
  }

  const handleCreateFormSubmit = async (formData) => {
    try {
      const response = await fetch(`${config.BASE_URL}/post_upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          coin_bot_id: selectedCoinBot,
          upgrade_data: formData,
        }),
      })

      const data = await response.json()
      console.log(data)

      // Puedes manejar la respuesta según tus necesidades (mostrar mensaje, cerrar modal, etc.)
    } catch (error) {
      console.error('Error creating upgrade:', error)
    } finally {
      setShowCreateForm(true)
      setUpgrades([])
    }
  }

  const handleCoinBotChange = async (value) => {
    setSelectedCoinBot(value)

    try {
      const response = await fetch(`${config.BASE_URL}/get_upgrades/${value}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const data = await response.json()
      console.log('data Recibida: ', data.message)

      if (data) {
        setUpgrades(data.message)
        setShowCreateButton(true)
      } else {
        console.error('Error fetching Upgrades:', data.error)
        setUpgrades([])
        setShowCreateButton(true) // Mostrar el botón si hay un error o no hay upgrades
      }
    } catch (error) {
      console.error('Error:', error)
      setShowCreateButton(true)
    }
  }

  return (
    <div>
      <div style={{ margin: '20px', overflowX: 'auto' }}>
        <h2>Upgrades Sub-Section</h2>
        <br />
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
          <Button variant="primary" onClick={handleCreateButtonClick}>
            Create Upgrade Data
          </Button>
        )}

        {upgrades && upgrades.length > 0 && (
          <>
            <br />
            <h3 style={{ marginTop: '20px' }}>Upgrades</h3>
            <br />
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Event Overview</th>
                  <th>Impact</th>
                  {/* Agregar más columnas según tus datos */}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(upgrades) ? (
                  upgrades.map((upgrade) => (
                    <tr key={upgrade.upgrade.id}>
                      <td>
                        <button onClick={() => console.log('Edit button clicked')}>Edit</button>
                      </td>
                      <td>{upgrade.upgrade.event}</td>
                      <td>{upgrade.upgrade.date}</td>
                      <td>{upgrade.upgrade.event_overview}</td>
                      <td>{upgrade.upgrade.impact}</td>
                      {/* Agregar más columnas según tus datos */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No upgrades available</td>
                  </tr>
                )}
              </tbody>
            </Table>
            <br />
            <br />
          </>
        )}
      </div>
      {/* Modal para el formulario de creación */}
      <Modal show={showCreateForm} onHide={() => setShowCreateForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Upgrade Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UpgradesForm onSubmit={handleCreateFormSubmit} />
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Upgrades
