import React, { useState, useEffect } from 'react'
import { Form, Table } from 'react-bootstrap'
import TokenomicsEditModal from '../tokenomics/tokenomicsEditModal'
import '../botsSettings/bs.css'

const Tokenomics = () => {
  const [bots, setBots] = useState([])

  const [selectedCoinBot, setSelectedCoinBot] = useState('')
  const [coinBotInfo, setCoinBotInfo] = useState(null)

  // Definir handleCloseFunction para cerrar el modal
  const handleCloseFunction = async () => {
    // Lógica para cerrar el modal
    console.log('Modal cerrado')
    // Recargar la información del bot después de cerrar el modal
    await handleCoinBotChange(selectedCoinBot)
  }

  // Definir handleSaveFunction para guardar los cambios
  const handleSaveFunction = async () => {
    // Lógica para guardar los cambios
    console.log('Cambios guardados')
    // Recargar la información del bot después de guardar los cambios
    await handleCoinBotChange(selectedCoinBot)
  }

  useEffect(() => {
    const getAllBots = async () => {
      try {
        const response = await fetch('https://star-oyster-known.ngrok-free.app/get_all_coin_bots', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
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

  const handleCoinBotChange = async (value) => {
    setSelectedCoinBot(value)

    try {
      const response = await fetch(
        `https://star-oyster-known.ngrok-free.app/get_coin_bot_tokenomics/${value}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const data = await response.json()
      if (data && data.coinBotInfo) {
        setCoinBotInfo(data.coinBotInfo)
      } else {
        console.error('Error fetching Coin Bot info:', data.error)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div style={{ margin: '20px' }}>
      <h2>Tokenomics Section</h2>
      <br></br>
      <Form.Group controlId="coinBotSelect" style={{ marginBottom: '15px' }}>
        <Form.Label>Select Coin Bot</Form.Label>
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

      {coinBotInfo && (
        <>
          <br></br>
          <h3>Tokenomics</h3>
          <br></br>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Supply</td>
                <td>{coinBotInfo.totalSupply}</td>
              </tr>
              <tr>
                <td>Circulating Supply</td>
                <td>{coinBotInfo.circulatingSupply}</td>
              </tr>
              <tr>
                <td>% Circulating Supply</td>
                <td>{coinBotInfo.percentCirculatingSupply}</td>
              </tr>
              <tr>
                <td>Max Supply</td>
                <td>{coinBotInfo.maxSupply}</td>
              </tr>
              <tr>
                <td>Supply Model</td>
                <td>{coinBotInfo.supplyModel}</td>
              </tr>
            </tbody>
          </Table>
          <br></br>
          <h3>Token Distribution</h3>
          <br></br>
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>Holder Category</td>
                <td>{coinBotInfo.tokenDistribution.holderCategory}</td>
              </tr>
              <tr>
                <td>Percentage Held</td>
                <td>{coinBotInfo.tokenDistribution.percentageHeld}</td>
              </tr>
            </tbody>
          </Table>
          <br></br>
          <h3>Token Utility</h3>
          <br></br>
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>Gas Fees and Transaction Settlement</td>
                <td>{coinBotInfo.tokenUtility.gasFeesAndTransactionSettlement}</td>
              </tr>
            </tbody>
          </Table>
          <br></br>
          <h3>Value Accrual Mechanisms</h3>
          <br></br>
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>Token Burning</td>
                <td>{coinBotInfo.valueAccrualMechanisms.tokenBurning}</td>
              </tr>
              <tr>
                <td>Token Buyback</td>
                <td>{coinBotInfo.valueAccrualMechanisms.tokenBuyback}</td>
              </tr>
            </tbody>
          </Table>
          <br></br>
          <br></br>
          <h3>Actions</h3>
          <TokenomicsEditModal
            dataToEdit={coinBotInfo}
            handleClose={handleCloseFunction}
            handleSave={handleSaveFunction}
            coinBotId={selectedCoinBot}
          />
          <br></br>
        </>
      )}
    </div>
  )
}

export default Tokenomics
