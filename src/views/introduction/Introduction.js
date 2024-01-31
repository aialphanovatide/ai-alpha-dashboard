import React, { useEffect, useState } from 'react'
import { Form, Button, Modal } from 'react-bootstrap'

const Introduction = () => {
  const [bots, setBots] = useState([])
  const [selectedCoinBot, setSelectedCoinBot] = useState('')
  const [content, setContent] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const getAllBots = async () => {
      try {
        const response = await fetch('https://ntf1vmdf-9000.use.devtunnels.ms/get_all_coin_bots', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()
        if (data && data.coin_bots) {
          console.log(data)
          setBots(data.coin_bots)
        } else {
          console.error('Error fetching bots:', data.message)
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }

    getAllBots()
  }, [])

  const handleCoinBotChange = (value) => {
    setSelectedCoinBot(value)
  }

  const handleUpdateClick = async () => {
    try {
      // Verificar que se haya seleccionado un Coin Bot
      if (!selectedCoinBot) {
        console.error('Please select a Coin Bot')
        return
      }

      // Construir el cuerpo de la solicitud
      const data = {
        id: selectedCoinBot,
        content: content,
      }

      // Realizar la solicitud POST a la ruta /post_introduction
      const response = await fetch('https://ntf1vmdf-9000.use.devtunnels.ms/post_introduction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      // Mostrar el resultado en la consola o en la interfaz de usuario según lo prefieras
      console.log(responseData)

      // Mostrar el modal de resultado
      setShowModal(true)
    } catch (error) {
      console.error('Error updating content:', error)
    }
  }

  const handleContentChange = (value) => {
    setContent(value)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <div style={{ margin: '20px' }}>
      <h2>Introduction Sub-Section Form</h2>
      <Form.Group controlId="coinBotSelect" style={{ marginBottom: '15px' }}>
        {' '}
        {/* Agregado el estilo de margen al grupo de formulario */}
        <Form.Label>Select Coin Bot</Form.Label>
        <Form.Control
          as="select"
          value={selectedCoinBot}
          onChange={(e) => handleCoinBotChange(e.target.value)}
        >
          <option value="">Select...</option>
          {bots.map((bot) => (
            <option key={bot.id} value={bot.id}>
              {bot.name.toUpperCase() || 'No Name'}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="contentInput" style={{ marginBottom: '15px' }}>
        {' '}
        {/* Agregado el estilo de margen al grupo de formulario */}
        <Form.Label>Content</Form.Label>
        <Form.Control
          style={{ height: '300px' }} // Establece la altura aquí
          as="textarea" // Usa un área de texto para admitir múltiples líneas
          placeholder="Enter content..."
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" onClick={handleUpdateClick} style={{ marginRight: '10px' }}>
        {' '}
        {/* Agregado el estilo de margen al botón */}
        Update
      </Button>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Puedes mostrar aquí el resultado de la actualización */}
          <p>
            Successfully updated with Coin Bot: {selectedCoinBot} and Content: {content}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Introduction
