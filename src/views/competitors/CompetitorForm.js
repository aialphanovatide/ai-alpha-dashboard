import React, { useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

const CompetitorForm = ({ showModal, handleClose, handleSave }) => {
  const [formData, setFormData] = useState({
    token: '',
    circulating_supply: '',
    token_supply_model: '',
    current_market_cap: '',
    tvl: '',
    daily_active_users: '',
    transaction_fees: '',
    transaction_speed: '',
    inflation_rate_2022: '',
    inflation_rate_2023: '',
    apr: '',
    active_developers: '',
    revenue: '',
    total_supply: '',
    percentage_circulating_supply: '',
    max_supply: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = () => {
    console.log('formData', formData)
    handleSave(formData)
    handleClose()
  }

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Competitor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="token">
            <Form.Label>Token</Form.Label>
            <Form.Control type="text" name="token" value={formData.token} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="circulating_supply">
            <Form.Label>Circulating Supply</Form.Label>
            <Form.Control
              type="text"
              name="circulating_supply"
              value={formData.circulating_supply}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="token_supply_model">
            <Form.Label>Token Supply Model</Form.Label>
            <Form.Control
              type="text"
              name="token_supply_model"
              value={formData.token_supply_model}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="current_market_cap">
            <Form.Label>Current Market Cap</Form.Label>
            <Form.Control
              type="text"
              name="current_market_cap"
              value={formData.current_market_cap}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="tvl">
            <Form.Label>TVL</Form.Label>
            <Form.Control type="text" name="tvl" value={formData.tvl} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="daily_active_users">
            <Form.Label>Daily Active Users</Form.Label>
            <Form.Control
              type="text"
              name="daily_active_users"
              value={formData.daily_active_users}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="transaction_fees">
            <Form.Label>Transaction Fees</Form.Label>
            <Form.Control
              type="text"
              name="transaction_fees"
              value={formData.transaction_fees}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="transaction_speed">
            <Form.Label>Transaction Speed</Form.Label>
            <Form.Control
              type="text"
              name="transaction_speed"
              value={formData.transaction_speed}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="inflation_rate_2022">
            <Form.Label>Inflation Rate 2022</Form.Label>
            <Form.Control
              type="text"
              name="inflation_rate_2022"
              value={formData.inflation_rate_2022}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="inflation_rate_2023">
            <Form.Label>Inflation Rate 2023</Form.Label>
            <Form.Control
              type="text"
              name="inflation_rate_2023"
              value={formData.inflation_rate_2023}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="apr">
            <Form.Label>APR</Form.Label>
            <Form.Control type="text" name="apr" value={formData.apr} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="active_developers">
            <Form.Label>Active Developers</Form.Label>
            <Form.Control
              type="text"
              name="active_developers"
              value={formData.active_developers}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="revenue">
            <Form.Label>Revenue</Form.Label>
            <Form.Control
              type="text"
              name="revenue"
              value={formData.revenue}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="total_supply">
            <Form.Label>Total Supply</Form.Label>
            <Form.Control
              type="text"
              name="total_supply"
              value={formData.total_supply}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="percentage_circulating_supply">
            <Form.Label>Percentage Circulating Supply</Form.Label>
            <Form.Control
              type="text"
              name="percentage_circulating_supply"
              value={formData.percentage_circulating_supply}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="max_supply">
            <Form.Label>Max Supply</Form.Label>
            <Form.Control
              type="text"
              name="max_supply"
              value={formData.max_supply}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

CompetitorForm.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
}

export default CompetitorForm
