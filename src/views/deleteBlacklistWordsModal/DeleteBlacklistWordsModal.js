import React, { useEffect, useState, useCallback } from 'react'
import '../botsSettings/bs.css'
import '../deleteWordsModal/deleteWordsModal.css'
import { CButton } from '@coreui/react'
import { Form, Alert, Modal, Button } from 'react-bootstrap'
import config from '../../config'

const DeleteBlacklistWordsModal = () => {
  const [showAlert, setShowAlert] = useState(false)
  const [coinBots, setCoinBots] = useState([])
  const [selectedCoinBot, setSelectedCoinBot] = useState('')
  const [keywords, setKeywords] = useState([])
  const [selectedKeyword, setSelectedKeyword] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
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
        `${config.BOTS_V2_API}/get_blacklist?bot_id=${selectedCoinBotId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      )
      if (response.ok) {
        const data = await response.json()
        console.log(data)
        setKeywords(data.data || [])
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
  }, []) 

  const handleDeleteKeyword = async () => {
    try {
      if (selectedKeyword) {
        const response = await fetch(`${config.BOTS_V2_API}/delete_from_blacklist?blacklist_id=${selectedKeyword}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true', // (Optional if using ngrok)
          },
          body: JSON.stringify({
            blacklist_id: selectedKeyword, // Include blacklist_id in body
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
        delete keyword from blacklist
      </CButton>
      <Modal show={visible} onHide={() => setVisible(false)} className="custom-modal">
          <span className='closeModalBtn' onClick={() => setVisible((prevVisible) => !prevVisible)}>X</span>
        <Modal.Body className='formBody'>
          <Form className='formMain'>
          <h3>Delete Keyword</h3>
            <Form.Group className='formSubmain'>
              <Form.Label>Select Coin</Form.Label>
              <Form.Control
                as="select"
                value={selectedCoinBot}
                onChange={(e) => handleCoinBotChange(e.target.value)}
              >
                <option value="">Select...</option>
                {coinBots.map((bot) => (
                  <option key={bot.id} value={bot.id}>
                    {bot.name && bot.name.toUpperCase() || 'No Name'}
                  </option>
                ))}
              </Form.Control>
              <div className="espacio"></div>
            </Form.Group>

            {keywords.length > 0 && (
              <Form.Group className='formSubmain'>
                <Form.Label>Select Keyword to Delete</Form.Label>
                <Form.Control
                  className='optioname'
                  as="select"
                  value={selectedKeyword}
                  onChange={(e) => setSelectedKeyword(e.target.value)}
                >
                  <option value="">Select...</option>
                  {keywords.map((keyword) => (
                    <option className='optioname' key={keyword.id} value={keyword.id}>
                      {keyword.name || 'No Keyword'}
                    </option>
                  ))}
                </Form.Control>
        
              </Form.Group>
            )}
              
            {showAlert && (
              <Alert className='espacio' variant="success" onClose={() => setShowAlert(false)} dismissible>
              Keyword deleted successfully.
            </Alert>
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer  className="button-row">
          <Button
            variant="primary"
            onClick={handleDeleteKeyword}
            disabled={!selectedKeyword || !selectedCoinBot}
          >
            Delete Keyword
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DeleteBlacklistWordsModal
