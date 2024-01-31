import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import PropTypes from 'prop-types'

const CompetitorsEditModal = ({ competitorInfo, coinBotId, handleClose, handleSave }) => {
  const [editedCompetitor, setEditedCompetitor] = useState({})
  const [visible, setVisible] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://ntf1vmdf-9000.use.devtunnels.ms/api/competitors?coin_bot_id=${coinBotId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const data = await response.json()
      if (data && data.competitors[0]) {
        setEditedCompetitor(data.competitors[0])
      } else {
        console.log('Error fetching Competitor Details:', data.error)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    fetchData()
    setSuccessMessage('')
  }, [coinBotId, competitorInfo])

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedCompetitor((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleCloseClick = () => {
    console.log('Closing modal...')
    handleClose()
  }

  const handleSaveClick = async () => {
    try {
      const response = await fetch('https://ntf1vmdf-9000.use.devtunnels.ms/api/competitors/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coin_bot_id: coinBotId,
          competitor_data: editedCompetitor,
        }),
      })
      console.log('coin_bot_id', coinBotId)
      console.log('editedCompetitor', editedCompetitor)
      const data = await response.json()
      if (response.ok) {
        handleSave({ ...competitorInfo, ...editedCompetitor })
        setSuccessMessage('Updated successfully')
        setVisible(true)

        setTimeout(() => {
          setSuccessMessage('')
        }, 2000)

        setTimeout(() => {
          setVisible(false)
        }, 4000)
      } else {
        console.error('Error updating competitor data:', data.error)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <>
      <button className="btn modal-btn" onClick={() => setVisible(true)}>
        Edit Competitor
      </button>
      <Modal show={visible} onHide={() => setVisible(false)} onShow={fetchData}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCompetitor">
              {Object.keys(editedCompetitor).map(
                (field) =>
                  !['coin_bot_id', 'id', 'created_at', 'updated_at', 'dynamic'].includes(field) && (
                    <React.Fragment key={field}>
                      <Form.Label>{field}</Form.Label>
                      <Form.Control
                        type="text"
                        name={field}
                        value={editedCompetitor[field] || ''}
                        onChange={handleChange}
                      />
                    </React.Fragment>
                  ),
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseClick}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveClick}>
            Save Changes
          </Button>
          {successMessage && (
            <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
              {successMessage}
            </Alert>
          )}
        </Modal.Footer>
      </Modal>
    </>
  )
}

CompetitorsEditModal.propTypes = {
  competitorInfo: PropTypes.object,
  coinBotId: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
}

export default CompetitorsEditModal
