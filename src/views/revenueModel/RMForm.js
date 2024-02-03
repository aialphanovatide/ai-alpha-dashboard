import React, { useState } from 'react'
import { Form, Button, Modal, Alert } from 'react-bootstrap' // Importa el componente de Alert de react-bootstrap
import PropTypes from 'prop-types'

const RMForm = ({ onSubmit, onCancel, show }) => {
  const [analized_revenue, setAnalizedRevenue] = useState('')
  const [fees_1ys, setFees1Ys] = useState('')
  const [successMessage, setSuccessMessage] = useState(null) // Nuevo estado para el mensaje de éxito

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Realiza la operación de creación y maneja el éxito
      await onSubmit({
        analized_revenue,
        fees_1ys,
      })

      // Muestra el mensaje de éxito
      setSuccessMessage('Revenue model created successfully')

      // Limpia los campos después de un breve retraso
      setTimeout(() => {
        setAnalizedRevenue('')
        setFees1Ys('')
        setSuccessMessage(null)
        onCancel()
      }, 2000)
    } catch (error) {
      console.error('Error creating Revenue Model:', error)
      // Maneja el error según sea necesario
    }
  }

  return (
    <Modal show={show} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Create RevenueModel Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Muestra el mensaje de éxito */}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="analizedRevenueInput">
            <Form.Label>Analized Revenue</Form.Label>
            <Form.Control
              type="text"
              value={analized_revenue}
              onChange={(e) => setAnalizedRevenue(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="fees1YsInput">
            <Form.Label>Fees (1Y)</Form.Label>
            <Form.Control
              type="text"
              value={fees_1ys}
              onChange={(e) => setFees1Ys(e.target.value)}
              required
            />
          </Form.Group>
          <Button style={{ marginTop: '10px' }} type="submit" variant="primary">
            Create RevenueModel Data
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

RMForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
}

export default RMForm
