import React, { useEffect, useState } from 'react'
import { Form, Button, Modal, Table } from 'react-bootstrap'
import config from '../../config'
import RMForm from './RMForm'
import RMEditForm from './RMEditForm'

const RevenueModels = () => {
  const [selectedCoinBot, setSelectedCoinBot] = useState('')
  const [content, setContent] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showCreateButton, setShowCreateButton] = useState(false)
  const [revenueModels, setRevenueModels] = useState([])
  const [bots, setBots] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [infoMessage, setInfoMessage] = useState('')
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedRevenueModelForEdit, setSelectedRevenueModelForEdit] = useState(null)

  const handleEditFormSubmit = async (formData) => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/api/edit_revenue_model/${selectedRevenueModelForEdit.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
          body: JSON.stringify(formData),
        },
      )

      const data = await response.json()
      setSelectedCoinBot('')

      // Puedes manejar la respuesta según tus necesidades (mostrar mensaje, cerrar modal, etc.)
    } catch (error) {
      console.error('Error editing revenue model:', error)
    } finally {
      setShowEditForm(false) // Ocultar el modal de edición después de enviar el formulario
      setRevenueModels([]) // Limpiar los modelos de ingresos para forzar una nueva carga después de la edición
    }
  }

  const handleCreateClick = async (formData) => {
    try {
      const response = await fetch(`${config.BASE_URL}/api/create_revenue_model`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        credentials: 'include',
        body: JSON.stringify({
          coin_bot_id: selectedCoinBot,
          analized_revenue: formData.analized_revenue,
          fees_1ys: formData.fees_1ys,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        console.log('Revenue model created successfully:', result)
        setShowModal(true)
        setSelectedCoinBot('')
        // Cierra el modal después de dos segundos
        setTimeout(() => {
          setShowModal(false)
        }, 2000)
      } else {
        console.error('Error creating Revenue Model:', result.error)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }
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

  useEffect(() => {
    const getRevenueModels = async () => {
      try {
        const response = await fetch(
          `${config.BASE_URL}/api/get_revenue_models?coin_bot_id=${selectedCoinBot}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
            credentials: 'include',
          },
        )

        const data = await response.json()
        console.log(data)
        if (data && data.revenue_models) {
          setRevenueModels(data.revenue_models)
          setShowCreateButton(data.revenue_models.length === 0)
          setShowCreateButton(true)
          setInfoMessage('') // Limpiar el mensaje de información
        } else {
          console.error('Error fetching Revenue Models:', data.error)
          setShowCreateButton(true)
          setInfoMessage('No revenue models found for the selected coin.') // Establecer mensaje de falta de información
        }
      } catch (error) {
        console.error('Error:', error)
        setShowCreateButton(true)
        setInfoMessage('Error fetching revenue models.') // Establecer mensaje de error
      }
    }

    if (selectedCoinBot) {
      getRevenueModels()
    }
  }, [selectedCoinBot])

  const handleEditButtonClick = (revenueModel) => {
    setSelectedRevenueModelForEdit(revenueModel) // Establece el modelo de ingresos seleccionado para la edición
    setShowEditForm(true) // Muestra el modal de edición
  }

  const handleCoinBotChange = (value) => {
    setSelectedCoinBot(value)
  }

  const handleContentChange = (value) => {
    setContent(value)
  }

  return (
    <div>
      <div style={{ margin: '20px' }}>
        <h2>Revenue Models Sub-Section</h2>

        <Form.Group controlId="coinBotSelect" style={{ marginBottom: '15px' }}>
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

        {showCreateButton && (
          <Button
            variant="primary"
            style={{ marginTop: '10px' }}
            onClick={() => setShowCreateForm(true)}
          >
            Create RevenueModel Data
          </Button>
        )}
        {infoMessage && <p style={{ color: 'red' }}>{infoMessage}</p>}
        {revenueModels && revenueModels.length > 0 ? (
          <>
            <br />
            <h3 style={{ marginTop: '20px' }}>Revenue Models</h3>
            <br />
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Annualised Revenue</th>
                  <th>Fees (1Y)</th>
                  {/* Add other columns based on your data model */}
                </tr>
              </thead>
              <tbody>
                {revenueModels.map((revenueModel) => (
                  <tr key={revenueModel.id}>
                    <td>
                      <button onClick={() => handleEditButtonClick(revenueModel)}>Edit</button>
                    </td>
                    <td>{revenueModel.analized_revenue}</td>
                    <td>{revenueModel.fees_1ys}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <br />
            <br />
          </>
        ) : null}
      </div>
      {/* Modal para el formulario de creación */}
      <RMForm
        onSubmit={handleCreateClick}
        onCancel={() => setShowCreateForm(false)}
        show={showCreateForm}
      />
      {/* Modal para el formulario de edición */}
      <Modal show={showEditForm} onHide={() => setShowEditForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Revenue Model Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Se pasa el modelo de ingresos seleccionado al formulario de edición solo cuando se está editando */}
          {selectedRevenueModelForEdit && (
            <RMEditForm
              onSubmit={handleEditFormSubmit}
              revenueModel={selectedRevenueModelForEdit}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default RevenueModels
