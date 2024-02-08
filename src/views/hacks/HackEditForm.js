import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const HackEditForm = ({ hack, onSubmit }) => {
  const [formData, setFormData] = useState({
    hackName: hack.hack_name,
    date: hack.date,
    incidentDescription: hack.incident_description,
    consequences: hack.consequences,
    mitigationMeasure: hack.mitigation_measure,
  })

  console.log(hack)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="hackName">
        <Form.Label>Hack Name</Form.Label>
        <Form.Control
          type="text"
          name="hackName"
          value={formData.hackName}
          onChange={handleChange}
        />
      </Form.Group>
      <br />
      <Form.Group controlId="date">
        <Form.Label>Date</Form.Label>
        <Form.Control type="text" name="date" value={formData.date} onChange={handleChange} />
      </Form.Group>
      <br />
      <Form.Group controlId="incidentDescription">
        <Form.Label>Incident Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="incidentDescription"
          value={formData.incidentDescription}
          onChange={handleChange}
        />
      </Form.Group>
      <br />
      <Form.Group controlId="consequences">
        <Form.Label>Consequences</Form.Label>
        <Form.Control
          type="text"
          name="consequences"
          value={formData.consequences}
          onChange={handleChange}
        />
      </Form.Group>
      <br />
      <Form.Group controlId="mitigationMeasure">
        <Form.Label>Mitigation Measure</Form.Label>
        <Form.Control
          type="text"
          name="mitigationMeasure"
          value={formData.mitigationMeasure}
          onChange={handleChange}
        />
      </Form.Group>
      <br />
      <Button variant="primary" type="submit">
        Save Changes
      </Button>
      <br />
    </Form>
  )
}

export default HackEditForm
