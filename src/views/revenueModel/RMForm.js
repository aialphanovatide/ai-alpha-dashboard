import React, { useState } from 'react'
import { Form, Button, Modal, Alert } from 'react-bootstrap' // Importa el componente de Alert de react-bootstrap
import PropTypes from 'prop-types'

const RMForm = ({ onSubmit, onCancel, show }) => {

  const [analized_revenue, setAnalizedRevenue] = useState('')
  const [successMessage, setSuccessMessage] = useState(null) 

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await onSubmit({
        analized_revenue,
      })

      // Muestra el mensaje de éxito
      setSuccessMessage('Revenue model created successfully')

      // Limpia los campos después de un breve retraso
      setTimeout(() => {
        setAnalizedRevenue('')
        setSuccessMessage(null)
        onCancel()
      }, 2000)
    } catch (error) {
      console.error('Error creating Revenue Model:', error)
    }
  }

  return (
    <Modal show={show} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Create Revenue Model</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className='modalFormMain' onSubmit={handleSubmit}>
          <Form.Group controlId="analizedRevenueInput">
            <Form.Label>Analized Revenue</Form.Label>
            <Form.Control
              type="text"
              value={analized_revenue}
              onChange={(e) => setAnalizedRevenue(e.target.value)}
              required
            />
          </Form.Group>
        
         
          <Button style={{ margin: '1rem 0', alignSelf: 'center' }} type="submit" variant="primary">
            Create Revenue Model
          </Button>
          {/* Muestra el mensaje de éxito */}
          {successMessage && <Alert className='alertSucess' variant="success">{successMessage}</Alert>}
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
