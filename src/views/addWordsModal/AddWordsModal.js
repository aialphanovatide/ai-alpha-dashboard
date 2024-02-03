import React, { useEffect, useState, useCallback } from 'react'
import classNames from 'classnames'
import '../botsSettings/bs.css'
import '../addWordsModal/addWordsModal.css'
import { CButton, CModal, CModalBody, CModalHeader, CModalTitle, CModalFooter } from '@coreui/react'
import { Form, InputGroup, FormControl, Alert, Modal, Button } from 'react-bootstrap'
import config from '../../config'

const AddWordsModal = () => {
  const [showAlert, setShowAlert] = useState(false)
  const [coinBots, setCoinBots] = useState([])
  const [selectedCoinBot, setSelectedCoinBot] = useState('')
  const [keywordValue, setKeywordValue] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get_all_coin_bots`)
        if (response.ok) {
          const data = await response.json()
          setCoinBots(data.coin_bots)
        } else {
          console.error('Error fetching coin bots:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching coin bots:', error)
      }
    }
    fetchData()
  }, [])

  const clearFields = () => {
    setSelectedCoinBot('')
    setKeywordValue('')
    setShowAlert(false)
  }

  const handleAddWords = async () => {
    try {
      if (selectedCoinBot) {
        const response = await fetch(`${config.BASE_URL}/save_keyword`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            keyword: keywordValue,
            coin_bot_id: selectedCoinBot,
          }),
        })

        const data = await response.json()
        if (data.success) {
          clearFields()
          setShowAlert(true)
          setTimeout(() => {
            setShowAlert(false)
          }, 2000)
        } else {
          console.error('Error saving keyword:', data.message)
        }
      } else {
        console.error('No selected coin bot available.')
      }
    } catch (error) {
      console.error('Error saving keyword:', error)
    }
  }

  const handleCoinBotChange = (selectedCoinBotId) => {
    console.log(selectedCoinBotId)
    setSelectedCoinBot(selectedCoinBotId)
  }

  return (
    <>
      <CButton className="btn modal-btn" onClick={() => setVisible(!visible)}>
        Add Words
      </CButton>
      <Modal show={visible} onHide={() => setVisible(false)} className="custom-modal">
        <Modal.Title className="titlemodal">Add Words to Keyword / Blacklist List</Modal.Title>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label className="espacio">Select Coin:</Form.Label>
              <Form.Control
                className="espacio"
                as="select"
                value={selectedCoinBot}
                onChange={(e) => handleCoinBotChange(e.target.value)}
              >
                <option value="">Select...</option>
                {coinBots &&
                  coinBots.map((bot, index) => (
                    <option key={index} value={bot.id}>
                      {bot.name || 'No Name'}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
            <div className="espacio"></div>
            <Form.Group>
              <Form.Label className="espacio">Add New Keyword / Blackword:</Form.Label>
              <InputGroup className="espacio">
                <FormControl
                  type="text"
                  id="keywordInput"
                  value={keywordValue}
                  onChange={(e) => setKeywordValue(e.target.value)}
                  placeholder="Enter Word..."
                />
              </InputGroup>
            </Form.Group>

            {/* Cartel flash */}
            {showAlert && (
              <Alert
                className="espacio"
                variant="success"
                onClose={() => setShowAlert(false)}
                dismissible
              >
                Word added successfully.
              </Alert>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="button-row">
          <Button
            className="espacio close btn-primary"
            variant="secondary"
            onClick={() => setVisible((prevVisible) => !prevVisible)}
          >
            Close
          </Button>
          <Button
            className="espacio close addwords"
            variant="primary"
            onClick={() => {
              handleAddWords()
            }}
            disabled={!selectedCoinBot}
          >
            Add Words
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AddWordsModal
