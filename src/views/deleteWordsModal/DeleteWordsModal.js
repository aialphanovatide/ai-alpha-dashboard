import React, { useEffect, useState, useCallback } from 'react'
import classNames from 'classnames'
import '../botsSettings/bs.css'
import '../deleteWordsModal/deleteWordsModal.css'
import { CButton, CModal, CModalBody, CModalHeader, CModalTitle, CModalFooter } from '@coreui/react'
import { Form, InputGroup, FormControl, Alert, Modal, Button } from 'react-bootstrap'
import config from '../../config'

const DeleteWordsModal = () => {
  const [showAlert, setShowAlert] = useState(false)
  const [coinBots, setCoinBots] = useState([])
  const [selectedCoinBot, setSelectedCoinBot] = useState('')
  const [keywords, setKeywords] = useState([])
  const [selectedKeyword, setSelectedKeyword] = useState('')
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

  const handleCoinBotChange = async (selectedCoinBotId) => {
    setSelectedCoinBot(selectedCoinBotId)
    try {
      const response = await fetch(
        `${config.BASE_URL}/get_keywords_for_coin_bot/${selectedCoinBotId}`,
      )
      if (response.ok) {
        const data = await response.json()
        setKeywords(data.keywords || [])
      } else {
        console.error('Error fetching keywords:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching keywords:', error)
    }
  }

  const clearFields = useCallback(() => {
    setSelectedCoinBot('')
    setKeywords([])
    setSelectedKeyword('')
    setShowAlert(false)
  }, []) // Agrega el arreglo de dependencias vacío para que la función no cambie entre renderizados

  const handleDeleteKeyword = async () => {
    try {
      if (selectedKeyword) {
        const response = await fetch(`${config.BASE_URL}/delete_keyword`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            keyword_id: selectedKeyword,
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
          console.error('Error deleting keyword:', data.message)
        }
      } else {
        console.error('No selected keyword available.')
      }
    } catch (error) {
      console.error('Error deleting keyword:', error)
    }
  }
  return (
    <>
      <CButton className="btn modal-btn" onClick={() => setVisible(!visible)}>
        Delete Words
      </CButton>
      <Modal show={visible} onHide={() => setVisible(false)} className="custom-modal">
        <Modal.Title className="titlemodal">Delete Keywords</Modal.Title>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label className="espacio">Select Coin Bot:</Form.Label>
              <Form.Control
                className="espacio"
                as="select"
                value={selectedCoinBot}
                onChange={(e) => handleCoinBotChange(e.target.value)}
              >
                <option value="">Select...</option>
                {coinBots.map((bot) => (
                  <option key={bot.id} value={bot.id}>
                    {bot.name || 'No Name'}
                  </option>
                ))}
              </Form.Control>
              <div className="espacio"></div>
            </Form.Group>

            {keywords.length > 0 && (
              <Form.Group>
                <Form.Label>Select Keyword to Delete:</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedKeyword}
                  onChange={(e) => setSelectedKeyword(e.target.value)}
                >
                  <option value="">Select...</option>
                  {keywords.map((keyword) => (
                    <option key={keyword.id} value={keyword.id}>
                      {keyword.word || 'No Keyword'}
                    </option>
                  ))}
                </Form.Control>
                <div className="espacio"></div>
              </Form.Group>
            )}

            {showAlert && (
              <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                Keyword deleted successfully.
              </Alert>
            )}
          </Form>
        </Modal.Body>
        <div className="espacio"></div>
        <Modal.Footer>
          <Button
            className="espacio close turn-off-button"
            variant="secondary"
            onClick={() => setVisible(false)}
          >
            Close
          </Button>
          <Button
            className="espacio close turn-off-button"
            variant="primary"
            onClick={handleDeleteKeyword}
            disabled={!selectedKeyword}
          >
            Delete Keyword
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DeleteWordsModal
