import React, { useState, useEffect } from 'react'
import { Form, Table, Button, Modal } from 'react-bootstrap'
import DAppsForm from './DAppsForm' // Asegúrate de tener el componente DAppsForm

import config from '../../config'

const DApps = () => {
  const [bots, setBots] = useState([])
  const [selectedCoinBot, setSelectedCoinBot] = useState('')
  const [dapps, setDApps] = useState([])
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
          setDApps([])
          console.error('Error fetching bots:', data.message)
        }
      } catch (error) {
        setDApps([])
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
      const response = await fetch(`${config.BASE_URL}/api/dapps/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          coin_bot_id: selectedCoinBot,
          ...formData,
        }),
      })

      const data = await response.json()
      console.log(data)

      // Puedes manejar la respuesta según tus necesidades (mostrar mensaje, cerrar modal, etc.)
    } catch (error) {
      console.error('Error creating DApp:', error)
    } finally {
      setDApps([])
      setShowCreateForm(false)
    }
  }

  const handleCoinBotChange = async (value) => {
    setSelectedCoinBot(value)

    try {
      const response = await fetch(`${config.BASE_URL}/api/dapps?coin_bot_id=${value}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      const data = await response.json()
      console.log('data', data)

      if (data && data.message) {
        setDApps(data.message)
        setShowCreateButton(data.message.length === 0)
        console.log('data que llega,', data.message)
        setShowCreateButton(true)
      } else {
        console.error('Error fetching DApps:', data.error)
        setShowCreateButton(true)
      }
    } catch (error) {
      console.error('Error:', error)
      setShowCreateButton(true)
    }
  }

  return (
    <div>
      <div style={{ margin: '20px', overflowX: 'auto' }}>
        <h2>DApps Sub-Section</h2>
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
            Create DApp Data
          </Button>
        )}

        {dapps && dapps.length > 0 && (
          <>
            <br />
            <h3 style={{ marginTop: '15px' }}>DApps</h3>
            <br />
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>DApp</th>
                  <th>Description</th>
                  <th>TVL</th>
                </tr>
              </thead>
              <tbody>
                {dapps.map((dapp) => (
                  <tr key={dapp.id}>
                    <td>
                      <button onClick={() => console.log('Edit button clicked')}>Edit</button>
                    </td>
                    <td>{dapp.dapps}</td>
                    <td>{dapp.description}</td>
                    <td>{dapp.tvl}</td>
                  </tr>
                ))}
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
          <Modal.Title>Create DApp Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DAppsForm onSubmit={handleCreateFormSubmit} />
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DApps
