import React, { useEffect, useState } from 'react'
import { Form, Button, Modal } from 'react-bootstrap'
import config from '../../config'

const Introduction = () => {
  const [bots, setBots] = useState([])
  const [selectedCoinBot, setSelectedCoinBot] = useState('')
  const [content, setContent] = useState('')
  const [website, setWebsite] = useState('')
  const [whitepaper, setWhitepaper] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const getAllBots = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get_all_coin_bots`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        const data = await response.json()
        if (data && data.coin_bots) {
          console.log(data)
          setBots(data.coin_bots)
        } else {
          console.log(data.coin_bots)
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
      if (!selectedCoinBot) {
        console.error('Please select a Coin Bot')
        return
      }

      const data = {
        coin_bot_id: selectedCoinBot,
        content: content,
        website: website,
        whitepaper: whitepaper,
      }

      const response = await fetch(`${config.BASE_URL}/post_introduction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

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
        <Form.Label>Select Coin</Form.Label>
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
        <Form.Label>Content (Max 400 Characters)</Form.Label>
        <Form.Control
          required
          style={{ height: '300px' }}
          as="textarea"
          placeholder="Enter content..."
          value={content}
          onChange={(e) => handleContentChange(e.target.value.substring(0, 400))}
        />
      </Form.Group>
      <Form.Group controlId="websiteInput" style={{ marginBottom: '15px' }}>
        {' '}
        <Form.Label>Website</Form.Label>
        <Form.Control
          required
          style={{ height: '40px' }}
          as="textarea"
          placeholder="Enter content..."
          value={website}
          onChange={(e) => handleContentChange(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="whitepaperInput" style={{ marginBottom: '15px' }}>
        {' '}
        <Form.Label>Whitepaper</Form.Label>
        <Form.Control
          required
          style={{ height: '400px' }}
          as="textarea"
          placeholder="Enter content..."
          value={whitepaper}
          onChange={(e) => handleContentChange(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" onClick={handleUpdateClick} style={{ marginRight: '10px' }}>
        {' '}
        Update
      </Button>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
