import React, { useEffect, useState } from 'react'
import { CButton } from '@coreui/react'
import { Form, InputGroup, FormControl, Alert, Modal, Button } from 'react-bootstrap'
import config from '../../config'
import './CreateBotModal.css'

const CreateBotModal = () => {
  const [showAlert, setShowAlert] = useState(false)
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [url, setUrl] = useState('')
  const [keywords, setKeywords] = useState('')
  const [blacklist, setBlacklist] = useState('')
  const [dallePrompt, setDallePrompt] = useState('')
  const [visible, setVisible] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://zztc5v98-5001.uks1.devtunnels.ms/categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        if (response.ok) {
          const data = await response.json()
          console.log("CATEGORIES", data.data.categories)
          setCategories(data.data.categories)
        } else {
          console.error('Error fetching Categories:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching Categories:', error)
      }
    }
    fetchData()
  }, [])

  const clearFields = () => {
    setName('')
    setSelectedCategory('')
    setUrl('')
    setKeywords('')
    setBlacklist('')
    setDallePrompt('')
    setShowAlert(false)
  }

  const handleCreateBot = async () => {
    try {
      const response = await fetch(`https://zztc5v98-5001.uks1.devtunnels.ms/create_bot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          name,
          category_id: selectedCategory,
          url,
          keywords,
          blacklist,
          dalle_prompt: dallePrompt,
        }),
      })
      const result = await response.json()
      if (response.ok) {
        setAlertMessage('Bot created successfully.')
        setShowAlert(true)
        clearFields()
      } else {
        setAlertMessage(result.error || 'Error creating bot.')
        setShowAlert(true)
      }
    } catch (error) {
      setAlertMessage('Error creating bot: ' + error.message)
      setShowAlert(true)
    }
  }

  return (
    <>
      <CButton className="btn modal-btn" onClick={() => setVisible(!visible)}>
        Create a new Bot
      </CButton>
      <Modal show={visible} onHide={() => setVisible(false)} className="custom-modal">
        <span className='closeModalBtn' onClick={() => setVisible((prevVisible) => !prevVisible)}>X</span>
        <Modal.Body className='formBody'>
          <Form className='formMain'>
            <h3>Create New Bot</h3>
            <Form.Group className='formSubmain'>
              <Form.Label>Name</Form.Label>
              <FormControl
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter bot name"
              />
            </Form.Group>
            <Form.Group className='formSubmain'>
              <Form.Label>Select Category</Form.Label>
              <Form.Control
                as="select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Select...</option>
                {categories &&
                  categories.map((category, index) => (
                    <option key={index} value={category.id}>
                      {category.alias.toLowerCase() || 'No Name'}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className='formSubmain'>
              <Form.Label>URL</Form.Label>
              <FormControl
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL"
              />
            </Form.Group>
            <Form.Group className='formSubmain'>
              <Form.Label>Keywords</Form.Label>
              <FormControl
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Enter keywords, separated by commas"
              />
            </Form.Group>
            <Form.Group className='formSubmain'>
              <Form.Label>Blacklist</Form.Label>
              <FormControl
                type="text"
                value={blacklist}
                onChange={(e) => setBlacklist(e.target.value)}
                placeholder="Enter blacklist words, separated by commas"
              />
            </Form.Group>
            <Form.Group className='formSubmain'>
              <Form.Label>DALL-E Prompt</Form.Label>
              <FormControl
                type="text"
                value={dallePrompt}
                onChange={(e) => setDallePrompt(e.target.value)}
                placeholder="Enter DALL-E prompt"
              />
            </Form.Group>

            {/* Flash message */}
            {showAlert && (
              <Alert
                className="espacio"
                variant="success"
                onClose={() => setShowAlert(false)}
                dismissible
              >
                {alertMessage}
              </Alert>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="button-row">
          <Button
            className="espacio close"
            variant="primary"
            onClick={handleCreateBot}
            disabled={!name || !selectedCategory || !url || !keywords || !blacklist || !dallePrompt}
          >
            Create Bot
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CreateBotModal
