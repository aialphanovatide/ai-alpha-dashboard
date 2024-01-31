import React, { useState } from 'react'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import PropTypes from 'prop-types'

// ... (importaciones y código anterior)

const CompetitorsCreateModal = ({ handleClose, coinBotId, handleSave }) => {
  const [newCompetitor, setNewCompetitor] = useState({
    token: '',
    circulating_supply: '',
    token_supply_model: '',
    current_market_cap: '',
    tvl: '',
    daily_active_users: '',
    transaction_fees: '',
    transaction_speed: '',
    inflation_rate: '',
    apr: '',
    active_developers: 0,
    revenue: 0,
    coin_bot_id: coinBotId,
    dynamic: false, // Agrega campos según tus datos
  })
  const initialCompetitorState = {
    token: '',
    circulating_supply: '',
    token_supply_model: '',
    current_market_cap: '',
    tvl: '',
    daily_active_users: '',
    transaction_fees: '',
    transaction_speed: '',
    inflation_rate: '',
    apr: '',
    active_developers: 0,
    revenue: 0,
    coin_bot_id: coinBotId,
    dynamic: false,
  }

  const [visible, setVisible] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const fieldValue = type === 'checkbox' ? checked : value

    setNewCompetitor((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }))
  }

  const clearFields = () => {
    setNewCompetitor({ ...initialCompetitorState })
  }

  const handleCloseClick = () => {
    console.log('Closing modal...')
    clearFields()
    setVisible(false)
  }

  const handleSaveClick = async () => {
    const createdCompetitor = { ...newCompetitor }

    try {
      const response = await fetch(
        'https://ntf1vmdf-9000.use.devtunnels.ms/api/competitors/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            coin_bot_id: coinBotId,
            competitor_data: createdCompetitor,
          }),
        },
      )
      console.log('coin bot enviado', coinBotId)
      const data = await response.json()
      console.log('Fetch response:', data)

      handleSave(data)
      setSuccessMessage('Created successfully')
      setVisible(true)

      setTimeout(() => {
        setSuccessMessage('')
      }, 2000)

      setTimeout(() => {
        setVisible(false)
        clearFields()
      }, 4000)
    } catch (error) {
      console.error('Error en la solicitud fetch:', error)
    }
  }

  return (
    <>
      <button className="btn modal-btn" onClick={() => setVisible(true)}>
        Create Competitor
      </button>
      <Modal show={visible} onHide={() => setVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Competitor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCompetitorCreate">
              <Form.Label>Token</Form.Label>
              <Form.Control
                type="text"
                name="token"
                value={newCompetitor.token || ''}
                onChange={handleChange}
              />
              <Form.Label>Circulating Supply</Form.Label>
              <Form.Control
                type="text"
                name="circulating_supply"
                value={newCompetitor.circulating_supply || ''}
                onChange={handleChange}
              />
              <Form.Label>Token Supply Model</Form.Label>
              <Form.Control
                type="text"
                name="token_supply_model"
                value={newCompetitor.token_supply_model || ''}
                onChange={handleChange}
              />
              <Form.Label>Current Market Cap</Form.Label>
              <Form.Control
                type="text"
                name="current_market_cap"
                value={newCompetitor.current_market_cap || ''}
                onChange={handleChange}
              />
              <Form.Label>TVL</Form.Label>
              <Form.Control
                type="text"
                name="tvl"
                value={newCompetitor.tvl || ''}
                onChange={handleChange}
              />
              <Form.Label>Daily Active Users</Form.Label>
              <Form.Control
                type="text"
                name="daily_active_users"
                value={newCompetitor.daily_active_users || ''}
                onChange={handleChange}
              />
              <Form.Label>Transaction Fees</Form.Label>
              <Form.Control
                type="text"
                name="transaction_fees"
                value={newCompetitor.transaction_fees || ''}
                onChange={handleChange}
              />
              <Form.Label>Transaction Speed</Form.Label>
              <Form.Control
                type="text"
                name="transaction_speed"
                value={newCompetitor.transaction_speed || ''}
                onChange={handleChange}
              />
              <Form.Label>Inflation Rate</Form.Label>
              <Form.Control
                type="text"
                name="inflation_rate"
                value={newCompetitor.inflation_rate || ''}
                onChange={handleChange}
              />
              <Form.Label>APR</Form.Label>
              <Form.Control
                type="text"
                name="apr"
                value={newCompetitor.apr || ''}
                onChange={handleChange}
              />
              <Form.Label>Active Developers</Form.Label>
              <Form.Control
                type="number"
                name="active_developers"
                value={newCompetitor.active_developers}
                onChange={handleChange}
              />
              <Form.Label>Revenue</Form.Label>
              <Form.Control
                type="number"
                name="revenue"
                value={newCompetitor.revenue}
                onChange={handleChange}
              />
              <Form.Label>Dynamic</Form.Label>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseClick}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveClick}>
            Save Competitor
          </Button>
          {successMessage && (
            <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
              {successMessage}
            </Alert>
          )}
        </Modal.Footer>
      </Modal>
    </>
  )
}

CompetitorsCreateModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  coinBotId: PropTypes.string.isRequired,
  handleSave: PropTypes.func.isRequired,
}

export default CompetitorsCreateModal
