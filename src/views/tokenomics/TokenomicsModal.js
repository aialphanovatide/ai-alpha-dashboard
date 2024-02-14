import React, { useState, useEffect } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import config from '../../config'
import PropTypes from 'prop-types'

const TokenomicsModal = ({ selectedCoinBot, showModal, handleClose }) => {
  const [tokenApplication, setTokenApplication] = useState('')
  const [tokenDescription, setTokenDescription] = useState('')
  const [holderCategory, setHolderCategory] = useState('')
  const [percentageHeld, setPercentageHeld] = useState('')
  const [mechanism, setMechanism] = useState('')
  const [mechanismDescription, setMechanismDescription] = useState('')
  const [currentCoinBotId, setCurrentCoinBotId] = useState('')
  const [token, setToken] = useState('')
  const [totalSupply, setTotalSupply] = useState('')
  const [circulatingSupply, setCirculatingSupply] = useState('')
  const [percentageCirculatingSupply, setPercentageCirculatingSupply] = useState('')
  const [maxSupply, setMaxSupply] = useState('')
  const [supplyModel, setSupplyModel] = useState('')

  useEffect(() => {
    setCurrentCoinBotId(selectedCoinBot)
  }, [selectedCoinBot])

  const handleSubmitTokenUtility = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch(`${config.BASE_URL}/post_token_utility`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          coin_bot_id: currentCoinBotId,
          token_application: tokenApplication,
          description: tokenDescription,
        }),
      })
      const data = await response.json()
      console.log(data)
      // Manejar la respuesta del backend aquí
    } catch (error) {
      console.error('Error submitting token utility:', error)
      // Manejar el error aquí
    }
  }

  const handleSubmitTokenomics = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch(`${config.BASE_URL}/post_tokenomics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          coin_bot_id: selectedCoinBot,
          token: token,
          total_supply: totalSupply,
          circulating_supply: circulatingSupply,
          percentage_circulating_supply: percentageCirculatingSupply,
          max_supply: maxSupply,
          supply_model: supplyModel,
        }),
      })
      const data = await response.json()
      console.log(data)
      // Manejar la respuesta del backend aquí
    } catch (error) {
      console.error('Error submitting tokenomics:', error)
      // Manejar el error aquí
    }
  }

  const handleSubmitTokenDistribution = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch(`${config.BASE_URL}/post_token_distribution`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          coin_bot_id: currentCoinBotId,
          holder_category: holderCategory,
          percentage_held: percentageHeld,
        }),
      })
      const data = await response.json()
      console.log(data)
      // Manejar la respuesta del backend aquí
    } catch (error) {
      console.error('Error submitting token distribution:', error)
      // Manejar el error aquí
    }
  }

  const handleSubmitValueAccrualMechanisms = async (event) => {
    event.preventDefault()
    try {
      console.log('Value of mechanism:', mechanism) // Agrega este console.log para registrar el valor de 'mechanism'

      const response = await fetch(`${config.BASE_URL}/post_value_accrual_mechanisms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          coin_bot_id: currentCoinBotId,
          mechanism: mechanism,
          description: mechanismDescription,
        }),
      })
      const data = await response.json()
      console.log(data)
      // Manejar la respuesta del backend aquí
    } catch (error) {
      console.error('Error submitting value accrual mechanisms:', error)
      // Manejar el error aquí
    }
  }

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Tokenomics Data</Modal.Title>
        <br />
      </Modal.Header>
      <Modal.Body>
        <h3>Tokenomics</h3>
        <Form onSubmit={handleSubmitTokenomics}>
          <Form.Group controlId="token">
            <Form.Label>Token</Form.Label>
            <br />
            <Form.Control
              type="text"
              placeholder="Enter token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </Form.Group>
          <br />
          <Form.Group controlId="totalSupply">
            <Form.Label>Total Supply</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter total supply"
              value={totalSupply}
              onChange={(e) => setTotalSupply(e.target.value)}
            />
          </Form.Group>
          <br />
          <Form.Group controlId="circulatingSupply">
            <Form.Label>Circulating Supply</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter circulating supply"
              value={circulatingSupply}
              onChange={(e) => setCirculatingSupply(e.target.value)}
            />
          </Form.Group>
          <br />
          <Form.Group controlId="percentageCirculatingSupply">
            <Form.Label>% Circulating Supply</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter percentage circulating supply"
              value={percentageCirculatingSupply}
              onChange={(e) => setPercentageCirculatingSupply(e.target.value)}
            />
          </Form.Group>
          <br />
          <Form.Group controlId="maxSupply">
            <Form.Label>Max Supply</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter max supply"
              value={maxSupply}
              onChange={(e) => setMaxSupply(e.target.value)}
            />
          </Form.Group>
          <br />
          <Form.Group controlId="supplyModel">
            <Form.Label>Supply Model</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter supply model"
              value={supplyModel}
              onChange={(e) => setSupplyModel(e.target.value)}
            />
          </Form.Group>
          <br />
          <Button variant="primary" type="submit">
            Add Tokenomics
          </Button>
          <br />
        </Form>

        <hr />

        {/* Formulario para Token Utility */}
        <h3>Token Utility</h3>
        <Form onSubmit={handleSubmitTokenUtility}>
          <Form.Group controlId="tokenApplication">
            <Form.Label>Token Application</Form.Label>
            <br />
            <Form.Control
              type="text"
              placeholder="Enter token application"
              value={tokenApplication}
              onChange={(e) => setTokenApplication(e.target.value)}
            />
          </Form.Group>
          <br />
          <Form.Group controlId="tokenDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter description"
              value={tokenDescription}
              onChange={(e) => setTokenDescription(e.target.value)}
            />
          </Form.Group>
          <br />
          <Button variant="primary" type="submit">
            Add Token Utility
          </Button>
        </Form>
        <hr />

        {/* Formulario para Token Utility */}
        <h3>Token Distribution</h3>

        {/* Formulario para Token Distribution */}
        <Form onSubmit={handleSubmitTokenDistribution}>
          <Form.Group controlId="holderCategory">
            <Form.Label>Holder Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter holder category"
              value={holderCategory}
              onChange={(e) => setHolderCategory(e.target.value)}
            />
          </Form.Group>
          <br />
          <Form.Group controlId="percentageHeld">
            <Form.Label>Percentage Held</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter percentage held"
              value={percentageHeld}
              onChange={(e) => setPercentageHeld(e.target.value)}
            />
          </Form.Group>
          <br />
          <Button variant="primary" type="submit">
            Add Token Distribution
          </Button>
          <hr />

          {/* Formulario para Token Utility */}
          <h3>Value Accrual Mechanisms</h3>
        </Form>
        <br />
        {/* Formulario para Value Accrual Mechanisms */}
        <Form onSubmit={handleSubmitValueAccrualMechanisms}>
          <Form.Group controlId="mechanism">
            <Form.Label>Mechanism</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter mechanism"
              value={mechanism}
              onChange={(e) => setMechanism(e.target.value)}
            />
          </Form.Group>
          <br />
          <Form.Group controlId="mechanismDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter mechanism description"
              value={mechanismDescription}
              onChange={(e) => setMechanismDescription(e.target.value)}
            />
          </Form.Group>
          <br />
          <Button variant="primary" type="submit">
            Add Value Accrual Mechanisms
          </Button>
        </Form>
      </Modal.Body>
      <br />
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

TokenomicsModal.propTypes = {
  selectedCoinBot: PropTypes.string.isRequired,
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
}

export default TokenomicsModal
