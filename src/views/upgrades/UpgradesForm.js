import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'

const UpgradesForm = ({ onSubmit }) => {
  const [event, setEvent] = useState('')
  const [date, setDate] = useState('')
  const [event_overview, setEvent_overview] = useState('')
  const [impact, setImpact] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      event,
      date,
      event_overview,
      impact,
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="eventInput">
        <Form.Label>Event</Form.Label>
        <Form.Control
          type="text"
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          required
        />
      </Form.Group>
      <br />
      <Form.Group controlId="dateInput">
        <Form.Label>Date</Form.Label>
        <Form.Control type="text" value={date} onChange={(e) => setDate(e.target.value)} required />
      </Form.Group>
      <br />
      <Form.Group controlId="event_overviewInput">
        <Form.Label>Event Overview</Form.Label>
        <Form.Control
          type="text"
          value={event_overview}
          onChange={(e) => setEvent_overview(e.target.value)}
          required
        />
      </Form.Group>
      <br />
      <Form.Group controlId="impactInput">
        <Form.Label>Impact</Form.Label>
        <Form.Control
          type="text"
          value={impact}
          onChange={(e) => setImpact(e.target.value)}
          required
        />
      </Form.Group>
      <br />
      <Button type="submit" variant="primary">
        Create Upgrade Data
      </Button>
      <br />
    </Form>
  )
}

UpgradesForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export default UpgradesForm
