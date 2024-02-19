import React, { useEffect, useState, useCallback } from 'react'
import classNames from 'classnames'
import '../botsSettings/bs.css'
import '../deleteWordsModal/deleteWordsModal.css'
import { CButton, CModal, CModalBody, CModalHeader, CModalTitle, CModalFooter } from '@coreui/react'
import { Form, InputGroup, FormControl, Alert, Modal, Button } from 'react-bootstrap'
import config from '../../config'

const DeleteSitesModal = () => {
  const [showAlert, setShowAlert] = useState(false)
  const [coinBots, setCoinBots] = useState([])
  const [selectedCoinBot, setSelectedCoinBot] = useState('')
  const [sites, setSites] = useState([])
  const [selectedSite, setSelectedSite] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get_all_coin_bots`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        let data = await response.json()
        if (response.ok) {
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
      const response = await fetch(`${config.BASE_URL}/get_sites_for_coin_bot/${selectedCoinBotId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setSites(data.sites || [])
      } else {
        console.error('Error fetching sites:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching sites:', error)
    }
  }

  const clearFields = useCallback(() => {
    setSelectedCoinBot('')
    setSites([])
    setSelectedSite('')
    setShowAlert(false)
  }, [])

  // Deletes a site by ID
  const handleDeleteSite = async () => {
    try {
      if (selectedSite) {
        const response = await fetch(`${config.BASE_URL}/erase_site_by_id`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
          body: JSON.stringify({
            site_id: selectedSite,
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
          console.error('Error deleting site:', data.message || 'Unknown error')
        }
      }
    } catch (error) {
      console.error('Error deleting site:', error)
    }
  }

  return (
    <>
      <CButton className="btn modal-btn" onClick={() => setVisible(!visible)}>
        delete source
      </CButton>
      <Modal show={visible} onHide={() => setVisible(false)} className="custom-modal">
      <span className='closeModalBtn' onClick={() => setVisible((prevVisible) => !prevVisible)}>X</span>
        <Modal.Body className='formBody'>
          <Form className='formMain'>
            <h3>Delete Source</h3>
            <Form.Group className='formSubmain'>
              <Form.Label >Select Coin</Form.Label>
              <Form.Control
                
                as="select"
                value={selectedCoinBot}
                onChange={(e) => handleCoinBotChange(e.target.value)}
              >
                <option value="">Select...</option>
                {coinBots.map((bot) => (
                  <option key={bot.id} value={bot.id}>
                    {bot.name.toUpperCase() || 'No Name'}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {sites.length > 0 && (
              <Form.Group className='formSubmain'>
                <Form.Label >Select Source to Delete</Form.Label>
                <Form.Control
                  
                  as="select"
                  value={selectedSite}
                  onChange={(e) => setSelectedSite(e.target.value)}
                >
                  <option value="">Select...</option>
                  {sites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.url || 'No Site'}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}

            {showAlert && (
              <Alert className='espacio' variant="success" onClose={() => setShowAlert(false)} dismissible>
                Site deleted successfully.
              </Alert>
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer className="button-row">
          <Button
            variant="primary"
            onClick={handleDeleteSite}
            disabled={!selectedSite || !selectedCoinBot}
          >
            Delete Source
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DeleteSitesModal
