import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const EditUpgradesForm = ({ upgrade, onSubmit }) => {
  const [formData, setFormData] = useState({
    event: upgrade.event,
    date: upgrade.date,
    event_overview: upgrade.event_overview,
    impact: upgrade.impact,
    upgrade_id: upgrade.id,
    // Añade más campos según sea necesario
  })

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
      <Form.Group controlId="event">
        <Form.Label>Event</Form.Label>
        <Form.Control type="text" name="event" value={formData.event} onChange={handleChange} />
      </Form.Group>
      <br />
      <Form.Group controlId="date">
        <Form.Label>Date</Form.Label>
        <Form.Control type="text" name="date" value={formData.date} onChange={handleChange} />
      </Form.Group>
      <br />
      <Form.Group controlId="eventOverview">
        <Form.Label>Event Overview</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="event_overview"
          value={formData.event_overview}
          onChange={handleChange}
        />
      </Form.Group>
      <br />
      <Form.Group controlId="impact">
        <Form.Label>What Was The Impact?</Form.Label>
        <input type="hidden" name="upgrade_id" value={upgrade.id} />
        <Form.Control type="text" name="impact" value={formData.impact} onChange={handleChange} />
      </Form.Group>
      <br />
      {/* Agrega más campos según sea necesario */}
      <Button variant="primary" type="submit">
        Save Changes
      </Button>
      <br />
    </Form>
  )
}

export default EditUpgradesForm
