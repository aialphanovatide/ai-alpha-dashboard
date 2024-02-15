import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import config from '../../config'
import PropTypes from 'prop-types'

const CustomInput = ({ controlId, label, placeholder, value, onChange, as  }) => (
  <Form.Group className='customInputMain' controlId={controlId}>
    <Form.Label className='customInputLanel'>{label}</Form.Label>
    <Form.Control
      type="text"
      as={as && as}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </Form.Group>
);


const TokenomicsModal = ({ selectedCoinBot, showModal, handleClose, coinName }) => {

  
  const [token, setToken] = useState('') 
  const [tokenApplication, setTokenApplication] = useState('')
  const [tokenDescription, setTokenDescription] = useState('')
  const [holderCategory, setHolderCategory] = useState('')
  const [percentageHeld, setPercentageHeld] = useState('')
  const [mechanism, setMechanism] = useState('')
  const [mechanismDescription, setMechanismDescription] = useState('')
  const [totalSupply, setTotalSupply] = useState('')
  const [circulatingSupply, setCirculatingSupply] = useState('')
  const [percentageCirculatingSupply, setPercentageCirculatingSupply] = useState('')
  const [maxSupply, setMaxSupply] = useState('')
  const [supplyModel, setSupplyModel] = useState('')

  // States for responsemessages
  const [responseMessageTokenomics, setResponseMessageTokenomics] = useState({'success': '', 'error': ''})
  const [responseMessageTokenUtility, setResponseMessageTokenUtility] = useState({'success': '', 'error': ''})
  const [responseMessageTokenDistri, setResponseMessageTokenDistri] = useState({'success': '', 'error': ''})
  const [responseMessageValueAccrual, setResponseMessageValueAccrual] = useState({'success': '', 'error': ''})



  // Create a token utility
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
          coin_bot_id: selectedCoinBot,
          token_application: tokenApplication,
          description: tokenDescription,
        }),
      })

      const data = await response.json()
      if (response.ok){
        setTokenApplication('')
        setTokenDescription('')
        setResponseMessageTokenUtility({ ... responseMessageTokenUtility, success: data.message, error: '' });
        return data.message
      } else {
        setResponseMessageTokenUtility({ ... responseMessageTokenUtility, error: data.error, success: '' });
        return data.error
      }
    } catch (error) {
      setResponseMessageTokenUtility({ ...responseMessageTokenUtility, error: error, success: '' });
    } finally {
      setTimeout(() => {
        setResponseMessageTokenUtility({'success': '', 'error': ''})
      }, 1200);
    }
  }

  // Creates a new tokenomics
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
 
      if (response.ok){
        setTotalSupply('')
        setCirculatingSupply('')
        setPercentageCirculatingSupply('')
        setMaxSupply('')
        setMaxSupply('')
        setResponseMessageTokenomics({ ...responseMessageTokenomics, success: data.message, error: '' });
        return data.message
      } else {
        setResponseMessageTokenomics({ ...responseMessageTokenomics, error: data.error, success: '' });
        return data.error
      }
    } catch (error) {
      setResponseMessageTokenomics({ ...responseMessageTokenomics, error: error, success: '' });
    } finally {
      setTimeout(() => {
        setResponseMessageTokenomics({'success': '', 'error': ''})
      }, 1200);
    }
  }

  // Creates a new token distribution
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
          coin_bot_id: selectedCoinBot,
          holder_category: holderCategory,
          percentage_held: percentageHeld,
        }),
      })
      const data = await response.json()
      if (response.ok){
        setHolderCategory('')
        setPercentageHeld('')
        setResponseMessageTokenDistri({ ...responseMessageTokenDistri, success: data.message, error: '' });
        return data.message
      } else {
        setResponseMessageTokenDistri({ ...responseMessageTokenDistri, error: data.error, success: '' });
        return data.error
      }
    } catch (error) {
      setResponseMessageTokenDistri({ ...responseMessageTokenDistri, error: error, success: '' });
    } finally {
      setTimeout(() => {
        setResponseMessageTokenDistri({'success': '', 'error': ''})
      }, 1200);
    }
  }

  // Creates a new value accrual mechanism
  const handleSubmitValueAccrualMechanisms = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch(`${config.BASE_URL}/post_value_accrual_mechanisms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          coin_bot_id: selectedCoinBot,
          mechanism: mechanism,
          description: mechanismDescription,
        }),
      })
      const data = await response.json()
     
      if (response.ok){
        setMechanism('')
        setMechanismDescription('')
        setResponseMessageValueAccrual({ ...responseMessageValueAccrual, success: data.message, error: '' });
        return data.message
      } else {
        setResponseMessageValueAccrual({ ...responseMessageValueAccrual, error: data.error, success: '' });
        return data.error
      }
    } catch (error) {
      setResponseMessageValueAccrual({ ...responseMessageValueAccrual, error: error, success: '' });
    } finally {
      setTimeout(() => {
        setResponseMessageValueAccrual({'success': '', 'error': ''})
      }, 1200);
    }
  }

  const handleTokenChange = (value) => {
    setToken(value)
  };
  const handleTotalSupplyChange = (value) => {
    setTotalSupply(value)
  };
  const handleCirculatingSupplyChange = (value) => {
    setCirculatingSupply(value)
  };
  const handlePercentageCirculatingSupplyChange = (value) => {
    setPercentageCirculatingSupply(value)
  };
  const handleMaxSupplyChange = (value) => {
    setMaxSupply(value)
  };
  const handleSupplyModelChange = (value) => {
    setSupplyModel(value)
  };

  const handleTokenApplicationChange = (value) => {
    setTokenApplication(value)
  };
  const handleTokenDescriptionChange = (value) => {
    setTokenDescription(value)
  };
  const handleHolderCategoryChange = (value) => {
    setHolderCategory(value)
  };
  const handlePercentageHeldChange = (value) => {
    setPercentageHeld(value)
  };
  const handleMechanismChange = (value) => {
    setMechanism(value)
  };
  const handleMechanismDescriptionChange = (value) => {
    setMechanismDescription(value)
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Tokenomics</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <h3>Tokenomics</h3>
        <Form className='modalForm' onSubmit={handleSubmitTokenomics}>
        <CustomInput
        controlId="token"
        label="Token"
        placeholder="Enter token"
        value={token}
        onChange={handleTokenChange}
        />
        <CustomInput
        controlId="totalSupply"
        label="Total Supply"
        placeholder="Enter total supply"
        value={totalSupply}
        onChange={handleTotalSupplyChange}
        />
        <CustomInput
        controlId="circulatingSupply"
        label="Circulating Supply"
        placeholder="Enter circulating supply"
        value={circulatingSupply}
        onChange={handleCirculatingSupplyChange}
        />
        <CustomInput
        controlId="percentageCirculatingSupply"
        label="% Circulating Supply"
        placeholder="Enter percentage circulating supply"
        value={percentageCirculatingSupply}
        onChange={handlePercentageCirculatingSupplyChange}
        />
        <CustomInput
        controlId="maxSupply"
        label="Max Supply"
        placeholder="Enter max supply"
        value={maxSupply}
        onChange={handleMaxSupplyChange}
        />
        <CustomInput
        controlId="supplyModel"
        label="Supply Model"
        placeholder="Enter supply model"
        value={supplyModel}
        onChange={handleSupplyModelChange}
        />
        <div>
        <Button className='modalFormBtn' variant="primary" type="submit">
          Add Tokenomics
        </Button>
        {responseMessageTokenomics.success && <Alert className='ModalAlert' variant="success">{responseMessageTokenomics.success}</Alert>}
        {responseMessageTokenomics.error && <Alert className='ModalAlert' variant="danger">{responseMessageTokenomics.error}</Alert>}
        </div>
        </Form>

        {/* Token Utility Form */}
        <Form className='modalForm' onSubmit={handleSubmitTokenUtility}>
        <h3>Token Utility</h3>
        <CustomInput
        controlId="tokenApplication"
        label="Token Application"
        placeholder="Enter token application"
        value={tokenApplication}
        onChange={handleTokenApplicationChange}
        />
        <CustomInput
        controlId="tokenDescription"
        label="Token Description"
        as='textarea'
        placeholder="Enter description"
        value={tokenDescription}
        onChange={handleTokenDescriptionChange}
        />
        
        <div>
        <Button className='modalFormBtn' variant="primary" type="submit">
        Add Token Utility
        </Button>
        {responseMessageTokenUtility.success && <Alert className='ModalAlert' variant="success">{responseMessageTokenUtility.success}</Alert>}
        {responseMessageTokenUtility.error && <Alert className='ModalAlert' variant="danger">{responseMessageTokenUtility.error}</Alert>}
        </div>
        </Form>

        {/* Token Distribution Form */}
        <Form className='modalForm' onSubmit={handleSubmitTokenDistribution}>
        <h3>Token Distribution</h3>
        <CustomInput
        controlId="holderCategory"
        label="Holder Category"
        placeholder="Enter holder category"
        value={holderCategory}
        onChange={handleHolderCategoryChange}
        />
        <CustomInput
        controlId="percentageHeld"
        label="Percentage Held"
        placeholder="Enter percentage held"
        value={percentageHeld}
        onChange={handlePercentageHeldChange}
        />

        <div>
        <Button className='modalFormBtn' variant="primary" type="submit">
        Add Token Distribution
        </Button>
        {responseMessageTokenDistri.success && <Alert className='ModalAlert' variant="success">{responseMessageTokenDistri.success}</Alert>}
        {responseMessageTokenDistri.error && <Alert className='ModalAlert' variant="danger">{responseMessageTokenDistri.error}</Alert>}
        </div>
        </Form>
        
        {/* Value Accrual Mechanisms Form */}
        <Form className='modalForm' onSubmit={handleSubmitValueAccrualMechanisms}>
          <h3>Value Accrual Mechanisms</h3>
          <CustomInput
          controlId="mechanism"
          label="Mechanism"
          placeholder="Enter mechanism"
          value={mechanism}
          onChange={handleMechanismChange}
          />
          <CustomInput
          controlId="mechanismDescription"
          label="Description"
          as='textarea'
          placeholder="Enter mechanism description"
          value={mechanismDescription}
          onChange={handleMechanismDescriptionChange}
          />
         
          <div>
        <Button className='modalFormBtn' variant="primary" type="submit">
        Add Value Accrual Mechanisms
        </Button>
        {responseMessageValueAccrual.success && <Alert className='ModalAlert' variant="success">{responseMessageValueAccrual.success}</Alert>}
        {responseMessageValueAccrual.error && <Alert className='ModalAlert' variant="danger">{responseMessageValueAccrual.error}</Alert>}
        </div>
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

TokenomicsModal.propTypes = {
  selectedCoinBot: PropTypes.string.isRequired,
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
}

export default TokenomicsModal
