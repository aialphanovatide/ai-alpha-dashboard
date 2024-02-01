import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import { CButton } from '@coreui/react'
import PropTypes from 'prop-types'
import config from '../../config'

const TokenomicsEditModal = ({ dataToEdit, coinBotId, handleClose, handleSave }) => {
  const [editedData, setEditedData] = useState({
    totalSupply: '',
    circulatingSupply: '',
    percentCirculatingSupply: '',
    maxSupply: '',
    supplyModel: '',
    tokenDistribution: {
      holderCategory: '',
      percentageHeld: '',
    },
    tokenUtility: {
      gasFeesAndTransactionSettlement: '',
    },
    valueAccrualMechanisms: {
      tokenBurning: '',
      tokenBuyback: '',
    },
  })
  const [visible, setVisible] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    setEditedData(
      dataToEdit || {
        totalSupply: '',
        circulatingSupply: '',
        percentCirculatingSupply: '',
        maxSupply: '',
        supplyModel: '',
        tokenDistribution: {
          holderCategory: '',
          percentageHeld: '',
        },
        tokenUtility: {
          gasFeesAndTransactionSettlement: '',
        },
        valueAccrualMechanisms: {
          tokenBurning: '',
          tokenBuyback: '',
        },
      },
    )
    setSuccessMessage('')
  }, [dataToEdit])

  const handleChange = (e) => {
    const { name, value } = e.target

    // Si el nombre contiene un punto, significa que es una propiedad anidada
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setEditedData((prevData) => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value,
        },
      }))
    } else {
      // Si no, simplemente actualiza la propiedad
      setEditedData((prevData) => ({ ...prevData, [name]: value }))
    }
  }

  const handleCloseClick = () => {
    console.log('Closing modal...')
    handleClose()
  }

  const handleSaveClick = async () => {
    // Asegúrate de que editedData esté actualizado antes de realizar la solicitud fetch
    const updatedData = { ...editedData }
    updatedData.coinBotId = coinBotId
    console.log('Data being sent to server:', updatedData)
    try {
      const response = await fetch(`${config.BASE_URL}/save_tokenomics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(updatedData),
      })

      const data = await response.json()
      console.log('Fetch response:', data)

      handleSave({ ...dataToEdit, ...editedData })
      setSuccessMessage('Updated successfully')
      setVisible(true)

      // Configurar un temporizador para ocultar el mensaje después de 2000 milisegundos (2 segundos)
      setTimeout(() => {
        setSuccessMessage('')
      }, 2000)

      // Configurar un temporizador adicional para cerrar el modal después de otros 2000 milisegundos (2 segundos)
      setTimeout(() => {
        setVisible(false)
      }, 4000)
    } catch (error) {
      console.error('Error en la solicitud fetch:', error)
      // Maneja el error según tus necesidades
    }
  }

  return (
    <>
      <CButton className="btn modal-btn" onClick={() => setVisible(!visible)}>
        Edit Tokenomics Data
      </CButton>
      <Modal show={visible} onHide={() => setVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Modal.Title className="subtitleModal">Tokenomics:</Modal.Title>
            <Form.Group controlId="formTokenomics">
              <Form.Label>Total Supply</Form.Label>
              <br />
              <Form.Control
                type="text"
                name="totalSupply"
                value={editedData.totalSupply || ''}
                onChange={handleChange}
              />

              <Form.Label>Circulating Supply</Form.Label>
              <Form.Control
                type="text"
                name="circulatingSupply"
                value={editedData.circulatingSupply || ''}
                onChange={handleChange}
              />
              <Form.Label>% Circulating Supply</Form.Label>
              <Form.Control
                type="text"
                name="percentCirculatingSupply"
                value={editedData.percentCirculatingSupply || ''}
                onChange={handleChange}
              />
              <Form.Label>Max Supply</Form.Label>
              <Form.Control
                type="text"
                name="maxSupply"
                value={editedData.maxSupply || ''}
                onChange={handleChange}
              />
              <Form.Label>Supply Model</Form.Label>
              <Form.Control
                type="text"
                name="supplyModel"
                value={editedData.supplyModel || ''}
                onChange={handleChange}
              />
            </Form.Group>
            <br />
            <Modal.Title className="subtitleModal">Token Distribution:</Modal.Title>
            <Form.Group controlId="tokenDistribution">
              <Form.Label>Holder Category</Form.Label>
              <Form.Control
                type="text"
                name="tokenDistribution.holderCategory"
                value={editedData.tokenDistribution.holderCategory || ''}
                onChange={handleChange}
              />
              <Form.Label>Percentage Held</Form.Label>
              <Form.Control
                type="text"
                name="tokenDistribution.percentageHeld"
                value={editedData.tokenDistribution.percentageHeld || ''}
                onChange={handleChange}
              />
            </Form.Group>
            <br />
            <Modal.Title className="subtitleModal">Token Utility:</Modal.Title>
            <Form.Group controlId="tokenDistribution">
              <Form.Label>Gas Fees and Transaction Settlement</Form.Label>
              <Form.Control
                type="text"
                name="tokenUtility.gasFeesAndTransactionSettlement"
                value={editedData.tokenUtility.gasFeesAndTransactionSettlement || ''}
                onChange={handleChange}
              />
            </Form.Group>
            <br />
            <Modal.Title className="subtitleModal">Value Accrual Mechanisms:</Modal.Title>
            <Form.Group controlId="tokenDistribution">
              <Form.Label>Token Burning</Form.Label>
              <Form.Control
                type="text"
                name="valueAccrualMechanisms.tokenBurning"
                value={editedData.valueAccrualMechanisms.tokenBurning || ''}
                onChange={handleChange}
              />
              <Form.Label>Token Buyback</Form.Label>
              <Form.Control
                type="text"
                name="valueAccrualMechanisms.tokenBuyback"
                value={editedData.valueAccrualMechanisms.tokenBuyback || ''}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="espacio close btn-primary"
            variant="secondary"
            onClick={() => setVisible((prevVisible) => !prevVisible)}
          >
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

TokenomicsEditModal.propTypes = {
  dataToEdit: PropTypes.object,
  coinBotId: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
}

export default TokenomicsEditModal
