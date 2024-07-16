import React, { useEffect, useState } from 'react'
import { CButton } from '@coreui/react'
import { Form, InputGroup, FormControl, Alert, Modal, Button } from 'react-bootstrap'
import config from '../../config'
import '../addWordsModal/addWordsModal.css'

const AddBlacklistWordsModal = () => {
  const [showAlert, setShowAlert] = useState(false)
  const [coinBots, setCoinBots] = useState([])
  const [selectedCoinBot, setSelectedCoinBot] = useState('')
  const [keywordValue, setKeywordValue] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    console.log(config.BOTS_V2);
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.BOTS_V2_API}/get_all_coin_bots`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        if (response.ok) {
          const data = await response.json()
          setCoinBots(data.data.coin_bots)
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
        const response = await fetch(`${config.BOTS_V2_API}/add_to_blacklist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
          body: JSON.stringify({
            blacklist: keywordValue,
            bot_id: selectedCoinBot,
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
    setSelectedCoinBot(selectedCoinBotId)
  }

  return (
    <>
      <CButton className="btn modal-btn" onClick={() => setVisible(!visible)}>
        add keyword to blacklist
      </CButton>
      <Modal show={visible} onHide={() => setVisible(false)} className="custom-modal">
      <span className='closeModalBtn' onClick={() => setVisible((prevVisible) => !prevVisible)}>X</span>
        <Modal.Body className='formBody'>
          <Form className='formMain'>
          <h3>Add Keyword to blacklist</h3>
            <Form.Group className='formSubmain'>
              <Form.Label>Select Coin</Form.Label>
              <Form.Control
                as="select"
                value={selectedCoinBot}
                onChange={(e) => handleCoinBotChange(e.target.value)}
              >
                <option value="">Select...</option>
                {coinBots &&
                  coinBots.map((bot, index) => (
                    <option key={index} value={bot.id}>
                      {bot.name.toUpperCase() || 'No Name'}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
          
            <Form.Group className='formSubmain'>
              <Form.Label>Add New Keyword</Form.Label>
              <InputGroup>
                <FormControl
                  type="text"
                  id="keywordInput"
                  value={keywordValue}
                  onChange={(e) => setKeywordValue(e.target.value)}
                  placeholder="Type Word..."
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
            className="espacio close addwords"
            variant="primary"
            onClick={() => {
              handleAddWords()
            }}
            disabled={!selectedCoinBot || !keywordValue}
          >
            Add Keyword
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AddBlacklistWordsModal
