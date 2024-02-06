import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'

const DAppsForm = ({ onSubmit }) => {
  const [dapps, setDApps] = useState('')
  const [description, setDescription] = useState('')
  const [tvl, setTVL] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      dapps,
      description,
      tvl,
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="dappsInput">
        <Form.Label>DApp</Form.Label>
        <Form.Control
          type="text"
          value={dapps}
          onChange={(e) => setDApps(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="descriptionInput">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="tvlInput">
        <Form.Label>TVL</Form.Label>
        <Form.Control type="text" value={tvl} onChange={(e) => setTVL(e.target.value)} required />
      </Form.Group>
      <Button type="submit" variant="primary">
        Create DApp Data
      </Button>
    </Form>
  )
}

DAppsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export default DAppsForm
