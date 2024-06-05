import React, { useState } from 'react'
import { CButton } from '@coreui/react'
import { Form, FormControl, Alert, Modal, Button } from 'react-bootstrap'
import config from '../../config'

const CreateCategoryModal = () => {
  const [showAlert, setShowAlert] = useState(false)
  const [alertVariant, setAlertVariant] = useState('success')
  const [name, setName] = useState('')
  const [alias, setAlias] = useState('')
  const [prompt, setPrompt] = useState('')
  const [timeInterval, setTimeInterval] = useState(50)
  const [slackChannel, setSlackChannel] = useState('')
  const [borderColor, setBorderColor] = useState('')
  const [icon, setIcon] = useState('')
  const [visible, setVisible] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  const clearFields = () => {
    setName('')
    setAlias('')
    setPrompt('')
    setTimeInterval(3)
    setSlackChannel('')
    setBorderColor('')
    setIcon('')
    setShowAlert(false)
    setAlertMessage('')
    setAlertVariant('success')
  }

  const handleCreateCategory = async () => {
    if (!name || !alias || !slackChannel) {
      setAlertMessage('Name, Alias, and Slack Channel are required.')
      setAlertVariant('danger')
      setShowAlert(true)
      return
    }
    try {
      const response = await fetch(`${config.BOTS_V2_API}/add_new_category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          name,
          alias,
          prompt,
          time_interval: timeInterval,
          slack_channel: slackChannel,
          border_color: borderColor,
          icon
        }),
      })
      const result = await response.json()
      console.log(result.success)
      if (result.success) {
        setAlertMessage('Category created successfully.')
        setAlertVariant('success')
        console.log("Category created successfully")
        setShowAlert(true)
        clearFields()
        setTimeout(() => setVisible(false), 2000) // Hide modal after 2 seconds
      } else {
        setAlertMessage(result.error || 'Error creating category.')
        setAlertVariant('danger')
        setShowAlert(true)
      }
    } catch (error) {
      setAlertMessage('Error creating category: ' + error.message)
      setAlertVariant('danger')
      setShowAlert(true)
    }
  }

  return (
    <>
      <CButton className="btn modal-btn" onClick={() => setVisible(!visible)}>
        Create a new Category
      </CButton>
      <Modal show={visible} onHide={() => setVisible(false)} className="custom-modal">
        <span className='closeModalBtn' onClick={() => setVisible((prevVisible) => !prevVisible)}>X</span>
        <Modal.Body className='formBody'>
          <Form className='formMain'>
            <h3>Create New Category</h3>
            <Form.Group className='formSubmain'>
              <Form.Label>Name</Form.Label>
              <FormControl
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
              />
            </Form.Group>
            <Form.Group className='formSubmain'>
              <Form.Label>Alias</Form.Label>
              <FormControl
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Enter category alias"
              />
            </Form.Group>
            <Form.Group className='formSubmain'>
              <Form.Label>Prompt</Form.Label>
              <FormControl
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter DALL-E prompt"
              />
            </Form.Group>
            <Form.Group className='formSubmain'>
              <Form.Label>Time Interval</Form.Label>
              <FormControl
                type="number"
                value={timeInterval}
                onChange={(e) => setTimeInterval(e.target.value)}
                placeholder="Enter time interval (default 50)"
              />
            </Form.Group>
            <Form.Group className='formSubmain'>
              <Form.Label>Slack Channel</Form.Label>
              <FormControl
                type="text"
                value={slackChannel}
                onChange={(e) => setSlackChannel(e.target.value)}
                placeholder="Enter Slack channel"
              />
            </Form.Group>
            <Form.Group className='formSubmain'>
              <Form.Label>Border Color</Form.Label>
              <FormControl
                type="text"
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                placeholder="Enter border color"
              />
            </Form.Group>
            <Form.Group className='formSubmain'>
              <Form.Label>Icon</Form.Label>
              <FormControl
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="Enter icon URL"
              />
            </Form.Group>

            {/* Flash message */}
            {showAlert && (
              <Alert
                variant={alertVariant}
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
            onClick={handleCreateCategory}
            disabled={!name || !alias || !slackChannel}
          >
            Create Category
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CreateCategoryModal
