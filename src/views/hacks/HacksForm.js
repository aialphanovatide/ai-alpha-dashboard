import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'

const HackForm = ({ onSubmit }) => {
  const [hackName, setHackName] = useState('')
  const [date, setDate] = useState('')
  const [incidentDescription, setIncidentDescription] = useState('')
  const [consequences, setConsequences] = useState('')
  const [mitigationMeasure, setMitigationMeasure] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Validaciones adicionales si es necesario
    const formData = {
      hackName,
      date,
      incidentDescription,
      consequences,
      mitigationMeasure,
    }
    console.log('Form Data:', formData) // Agrega este console.log para ver los datos antes de enviarlos
    onSubmit(formData)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="hackNameInput">
        <Form.Label>Hack name</Form.Label>
        <Form.Control
          type="text"
          value={hackName}
          onChange={(e) => setHackName(e.target.value)}
          required
        />
      </Form.Group>
      <br />
      <Form.Group controlId="dateInput">
        <Form.Label>Date</Form.Label>
        <Form.Control type="text" value={date} onChange={(e) => setDate(e.target.value)} required />
      </Form.Group>
      <br />
      <Form.Group controlId="incidentDescriptionInput">
        <Form.Label>What was the Incident?</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={incidentDescription}
          onChange={(e) => setIncidentDescription(e.target.value)}
          required
        />
      </Form.Group>
      <br />
      <Form.Group controlId="consequencesInput">
        <Form.Label>What were the Consequences?</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={consequences}
          onChange={(e) => setConsequences(e.target.value)}
          required
        />
      </Form.Group>
      <br />
      <Form.Group controlId="mitigationMeasureInput">
        <Form.Label>What risk mitigation measures have been taken?</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={mitigationMeasure}
          onChange={(e) => setMitigationMeasure(e.target.value)}
          required
        />
      </Form.Group>
      <br />
      <Button type="submit" variant="primary">
        Create Hack Data
      </Button>
      <br />
    </Form>
  )
}

HackForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export default HackForm
