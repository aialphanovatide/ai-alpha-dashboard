import React, { useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

const UpgradesEditModal = ({ showModal, handleClose, handleSave, upgrade }) => {
  const [editedUpgrade, setEditedUpgrade] = useState({
    event: upgrade.event,
    date: upgrade.date,
    event_overview: upgrade.event_overview,
    impact: upgrade.impact,
    // Agregar más campos según tus datos
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedUpgrade({ ...editedUpgrade, [name]: value })
  }

  const handleSubmit = () => {
    handleSave(editedUpgrade)
    handleClose()
  }

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Upgrade</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Agregar campos de formulario según tus datos */}
          <Form.Group controlId="formEvent">
            <Form.Label>Event</Form.Label>
            <Form.Control
              type="text"
              name="event"
              value={editedUpgrade.event}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formDate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="text"
              name="date"
              value={editedUpgrade.date}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formEventOverview">
            <Form.Label>Event Overview</Form.Label>
            <Form.Control
              type="text"
              name="event_overview"
              value={editedUpgrade.event_overview}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formImpact">
            <Form.Label>Impact</Form.Label>
            <Form.Control
              type="text"
              name="impact"
              value={editedUpgrade.impact}
              onChange={handleChange}
            />
          </Form.Group>
          {/* Agregar más campos según tus datos */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

UpgradesEditModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  upgrade: PropTypes.object.isRequired,
}

export default UpgradesEditModal
