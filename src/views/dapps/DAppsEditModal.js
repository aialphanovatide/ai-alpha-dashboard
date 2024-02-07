// DAppsEditModal.js
import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import config from '../../config'

const DAppsEditModal = ({ dapp, onSave, onClose }) => {
  const [editedDApp, setEditedDApp] = useState({
    id: dapp.id,
    dapps: dapp.dapps,
    description: dapp.description,
    tvl: dapp.tvl,
  })


  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedDApp({ ...editedDApp, [name]: value })
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/api/dapps/edit/${dapp.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedDApp),
      })
      console.log(editedDApp)
      if (response.ok) {
        const data = await response.json()
        onSave(editedDApp)
        onClose() // Cerrar el modal después de guardar los cambios
      } else {
        console.error('Error updating DApp:', response.status)
      }
    } catch (error) {
      console.error('Error updating DApp:', error)
    }
  }

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit DApp</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formDAppName">
            <Form.Label>DApp Name</Form.Label>
            <Form.Control
              type="text"
              name="dapps"
              value={editedDApp.dapps}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={editedDApp.description}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formTVL">
            <Form.Label>TVL</Form.Label>
            <Form.Control type="text" name="tvl" value={editedDApp.tvl} onChange={handleChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DAppsEditModal
