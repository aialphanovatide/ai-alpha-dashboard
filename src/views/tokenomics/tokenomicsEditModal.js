import React, { useState, useEffect } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import config from '../../config'

const TokenomicsEditModal = ({ selectedCoinBot, showEditModal, setShowEditModal }) => {
  const [tokenomicsData, setTokenomicsData] = useState(null)
  const [tokenDistributionData, setTokenDistributionData] = useState({})
  const [tokenUtilityData, setTokenUtilityData] = useState({})
  const [valueAccrualMechanismsData, setValueAccrualMechanismsData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenomicsResponse = await fetch(
          `${config.BASE_URL}/get_tokenomics/${selectedCoinBot}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
          },
        )
        const data = await tokenomicsResponse.json()
        setTokenomicsData(data.message)

        // Actualizar los estados de los datos de tokenomics si los datos están disponibles
        if (data.message) {
          setTokenDistributionData(data.message.token_distribution[0].token_distributions)
          setTokenUtilityData(data.message.token_utility[0].token_utilities)
          setValueAccrualMechanismsData(
            data.message.value_accrual_mechanisms[0].value_accrual_mechanisms,
          )
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    if (selectedCoinBot) {
      fetchData()
    }
  }, [selectedCoinBot])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const dataToSend = {
        token_distribution: {
          holder_category: tokenDistributionData.holder_category || '',
          percentage_held: tokenDistributionData.percentage_held || '',
        },
        token_utility: {
          token_application: tokenUtilityData.token_application || '',
          description: tokenUtilityData.description || '',
        },
        value_accrual_mechanisms: {
          mechanism: valueAccrualMechanismsData.mechanism || '',
          description: valueAccrualMechanismsData.description || '',
        },
      }
      console.log('Data to send:', dataToSend)
      console.log('ID: ', selectedCoinBot)
      const response = await fetch(`${config.BASE_URL}/edit_tokenomics/${selectedCoinBot}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(dataToSend),
      })
      const data = await response.json()
      console.log('Response:', data)
      // Manejar la respuesta del servidor aquí según sea necesario
      // Cerrar el modal después de enviar el formulario
      setShowEditModal(false)
      handleClose()
    } catch (error) {
      console.error('Error:', error)
      // Manejar errores de solicitud aquí según sea necesario
    }
  }

  const handleInputChange = (category, field, value) => {
    switch (category) {
      case 'token_distribution':
        setTokenDistributionData({
          ...tokenDistributionData,
          [field]: value,
        })
        break
      case 'token_utility':
        setTokenUtilityData({
          ...tokenUtilityData,
          [field]: value,
        })
        break
      case 'value_accrual_mechanisms':
        setValueAccrualMechanismsData({
          ...valueAccrualMechanismsData,
          [field]: value,
        })
        break
      default:
        break
    }
  }

  const handleClose = () => {
    // Cerrar el modal utilizando setShowEditModal
    setShowEditModal(false)
  }

  return (
    <Modal show={showEditModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Tokenomics Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Formulario para Token Utility */}
          <Form.Group controlId="tokenApplication">
            <Form.Label>Token Application</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter token application"
              value={tokenUtilityData.token_application || ''}
              onChange={(e) =>
                handleInputChange('token_utility', 'token_application', e.target.value)
              }
            />
          </Form.Group>
          <br />
          <Form.Group controlId="tokenDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter description"
              value={tokenUtilityData.description || ''}
              onChange={(e) => handleInputChange('token_utility', 'description', e.target.value)}
            />
          </Form.Group>
          <br />
          {/* Formulario para Token Distribution */}
          <Form.Group controlId="holderCategory">
            <Form.Label>Holder Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter holder category"
              value={tokenDistributionData.holder_category || ''}
              onChange={(e) =>
                handleInputChange('token_distribution', 'holder_category', e.target.value)
              }
            />
          </Form.Group>
          <br />
          <Form.Group controlId="percentageHeld">
            <Form.Label>Percentage Held</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter percentage held"
              value={tokenDistributionData.percentage_held || ''}
              onChange={(e) =>
                handleInputChange('token_distribution', 'percentage_held', e.target.value)
              }
            />
          </Form.Group>
          <br />
          {/* Formulario para Value Accrual Mechanisms */}
          <Form.Group controlId="mechanism">
            <Form.Label>Mechanism</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter mechanism"
              value={valueAccrualMechanismsData.mechanism || ''}
              onChange={(e) =>
                handleInputChange('value_accrual_mechanisms', 'mechanism', e.target.value)
              }
            />
          </Form.Group>
          <br />
          <Form.Group controlId="mechanismDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter mechanism description"
              value={valueAccrualMechanismsData.description || ''}
              onChange={(e) =>
                handleInputChange('value_accrual_mechanisms', 'description', e.target.value)
              }
            />
          </Form.Group>
          <br />
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default TokenomicsEditModal
