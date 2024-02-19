import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Alert } from 'react-bootstrap'

const HackForm = ({ onSubmit }) => {
  const [hackName, setHackName] = useState('')
  const [date, setDate] = useState('')
  const [incidentDescription, setIncidentDescription] = useState('')
  const [consequences, setConsequences] = useState('')
  const [mitigationMeasure, setMitigationMeasure] = useState('')
  const [responseMessage, setResponseMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = {
      hackName,
      date,
      incidentDescription,
      consequences,
      mitigationMeasure,
    }
    const response = await onSubmit(formData)
    setResponseMessage(response)
  }

  return (
    <Form className='formGeneral' onSubmit={handleSubmit}>
      <Form.Group className='dappsInput' controlId="hackNameInput">
        <Form.Label>Hack name</Form.Label>
        <Form.Control
          type="text"
          value={hackName}
          onChange={(e) => setHackName(e.target.value)}
          required
        />
      </Form.Group>
      
      <Form.Group className='dappsInput' controlId="dateInput">
        <Form.Label>Date</Form.Label>
        <Form.Control type="text" value={date} onChange={(e) => setDate(e.target.value)} required />
      </Form.Group>
      
      <Form.Group className='dappsInput' controlId="incidentDescriptionInput">
        <Form.Label>What was the Incident?</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={incidentDescription}
          onChange={(e) => setIncidentDescription(e.target.value)}
          required
        />
      </Form.Group>
      
      <Form.Group className='dappsInput' controlId="consequencesInput">
        <Form.Label>What were the Consequences?</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={consequences}
          onChange={(e) => setConsequences(e.target.value)}
          required
        />
      </Form.Group>
      
      <Form.Group className='dappsInput' controlId="mitigationMeasureInput">
        <Form.Label>What risk mitigation measures have been taken?</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={mitigationMeasure}
          onChange={(e) => setMitigationMeasure(e.target.value)}
          required
        />
      </Form.Group>
      <hr />
      <Button  className='createBtn' type="submit" variant="primary">
        Create Hack
      </Button>
      
      {responseMessage && (
        <Alert className="alertSucess" style={{ margin: "1rem" }}  variant="success">
          {responseMessage}
        </Alert>
      )}
      
    </Form>
  )
}

HackForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export default HackForm
