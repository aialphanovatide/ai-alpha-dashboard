import React, { useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

const CompetitorForm = ({ showModal, handleClose, selectedCoinBot, handleSave }) => {
  const initialFormData = {
    token: '',
    newKeyValuePair: { key: '', value: '' },
    keyValues: [],
  }

  const [formData, setFormData] = useState(initialFormData)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleNewKeyValuePairChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      newKeyValuePair: {
        ...formData.newKeyValuePair,
        [name]: value,
      },
    })
  }

  const handleAddKeyValuePair = () => {
    const { newKeyValuePair, keyValues } = formData
    if (newKeyValuePair.key && newKeyValuePair.value) {
      setFormData({
        ...formData,
        keyValues: [...keyValues, newKeyValuePair],
        newKeyValuePair: { key: '', value: '' },
      })
    }
  }

  const handleRemoveKeyValuePair = (index) => {
    const { keyValues } = formData
    const updatedKeyValues = [...keyValues]
    updatedKeyValues.splice(index, 1)
    setFormData({
      ...formData,
      keyValues: updatedKeyValues,
    })
  }

  const handleSubmit = () => {
    const competitorData = {
      token: formData.token,
      data: formData.keyValues,
      coin_bot_id: selectedCoinBot,
    }
    handleSave(competitorData)
    handleClose()
    handleModalClose()
  }

  const handleModalClose = () => {
    setFormData(initialFormData) // Restablecer el estado del formulario
    handleClose()
  }
  return (
    <Modal show={showModal} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Competitor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="token">
            <Form.Label>Token</Form.Label>
            <br />
            <Form.Control type="text" name="token" value={formData.token} onChange={handleChange} />
          </Form.Group>
          {/* Nuevo campo para ingresar dinámicamente pares key-value */}
          <Form.Group>
          <br />
            <Form.Label>New Key-Value Pair</Form.Label>
            <br />
            <div style={{ display: 'flex', marginBottom: '10px' }}>
              <Form.Control
                style={{ marginRight: '10px' }}
                type="text"
                placeholder="Key"
                name="key"
                value={formData.newKeyValuePair.key}
                onChange={handleNewKeyValuePairChange}
              />
              <br />
              <Form.Control
                style={{ marginRight: '10px' }}
                type="text"
                placeholder="Value"
                name="value"
                value={formData.newKeyValuePair.value}
                onChange={handleNewKeyValuePairChange}
              />
              <br />
              <Button variant="primary" onClick={handleAddKeyValuePair}>
                Add
              </Button>
            </div>
          </Form.Group>
          <br />
          {/* Mostrar los pares key-value ingresados */}
          {formData.keyValues.map((pair, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <Form.Control style={{ marginRight: '10px' }} type="text" value={pair.key} readOnly />
              <br />
              <Form.Control
                style={{ marginRight: '10px' }}
                type="text"
                value={pair.value}
                readOnly
              />
              <br />

              <Button variant="danger" onClick={() => handleRemoveKeyValuePair(index)}>
                Remove
              </Button>
              <hr />
            </div>
          ))}
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
