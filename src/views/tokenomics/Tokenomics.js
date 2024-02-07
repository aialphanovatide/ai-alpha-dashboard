import React, { useState, useEffect } from 'react'
import { Form, Table, Button } from 'react-bootstrap'
import '../botsSettings/bs.css'
import config from '../../config'
import TokenomicsModal from './TokenomicsModal'

const Tokenomics = () => {
  const [bots, setBots] = useState([])
  const [selectedCoinBot, setSelectedCoinBot] = useState('')
  const [tokenomicsData, setTokenomicsData] = useState(null)
  const [competitorsData, setCompetitorsData] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos de competidores
        const competitorsResponse = await fetch(
          `${config.BASE_URL}/get_competitors/${selectedCoinBot}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
          },
        )
        const competitorsData = await competitorsResponse.json()
        setCompetitorsData(competitorsData.competitors)

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
        const tokenomicsData = await tokenomicsResponse.json()
        console.log('tokenomicsData', tokenomicsData.message)
        setTokenomicsData(tokenomicsData.message)
        console.log(tokenomicsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    if (selectedCoinBot) {
      fetchData()
    }
  }, [selectedCoinBot])

  const handleCoinBotChange = (value) => {
    setSelectedCoinBot(value)
  }

  const handleClose = () => {
    setShowModal(false)
    setSelectedCoinBot('')
    setTokenomicsData('')
    setCompetitorsData('')
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

  return (
    <div style={{ margin: '20px' }}>
      <h2>Tokenomics Sub-Section</h2>
      <br></br>
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

      {competitorsData && (
        <>
          <br></br>
          <h3>Tokenomics</h3>
          <br></br>
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>Total Supply</td>
                <td>Circulating Supply</td>
                <td>% Circulating Supply</td>
                <td>Max Supply</td>
                <td>Supply Model</td>
              </tr>
              {competitorsData && (
                <tr>
                  <td>{competitorsData[0].tokenomics.total_supply}</td>
                  <td>{competitorsData[0].tokenomics.circulating_supply}</td>
                  <td>{competitorsData[0].tokenomics.percentage_circulating_supply}</td>
                  <td>{competitorsData[0].tokenomics.max_supply}</td>
                  <td>{competitorsData[0].tokenomics.token_supply_model}</td>
                </tr>
              )}
              <tr></tr>
              <tr></tr>
              <tr></tr>
            </tbody>
          </Table>
          <br></br>
          <br></br>
          <br></br>
          <h3>Competitors Tokenomics</h3>
          <br></br>
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>Total Supply</td>
                <td>Circulating Supply</td>
                <td>% Circulating Supply</td>
                <td>Max Supply</td>
                <td>Supply Model</td>
              </tr>
              {competitorsData.slice(1).map((competitor, index) => (
                <tr key={index}>
                  <td>{competitor.tokenomics.total_supply}</td>
                  <td>{competitor.tokenomics.circulating_supply}</td>
                  <td>{competitor.tokenomics.percentage_circulating_supply}</td>
                  <td>{competitor.tokenomics.max_supply}</td>
                  <td>{competitor.tokenomics.token_supply_model}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <br></br>
          <h3>Token Distribution</h3>
          <br />
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>Holder Category</td>
                <td>Percentage Held</td>
              </tr>
              {tokenomicsData &&
                tokenomicsData.token_distribution &&
                tokenomicsData.token_distribution.map((item, index) => (
                  <tr key={index}>
                    <td>{item.token_distributions.holder_category}</td>
                    <td>{item.token_distributions.percentage_held}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <br />
          <h3>Token Utility</h3>
          <br />
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>Token Applications</td>
                <td>Description</td>
              </tr>
              {tokenomicsData &&
                tokenomicsData.token_utility &&
                tokenomicsData.token_utility.map((item, index) => (
                  <tr key={index}>
                    <td>{item.token_utilities.token_application}</td>
                    <td>{item.token_utilities.description}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <br />
          <h3>Value Accrual Mechanisms</h3>
          <br />
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>Mechanisms</td>
                <td>Description</td>
              </tr>
              {tokenomicsData &&
                tokenomicsData.value_accrual_mechanisms &&
                tokenomicsData.value_accrual_mechanisms.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td>{item.value_accrual_mechanisms.mechanism}</td>
                      <td>{item.value_accrual_mechanisms.description}</td>
                    </tr>
                  </React.Fragment>
                ))}
            </tbody>
          </Table>
        </>
      )}
      <br></br>
      <br></br>
      <h3>Actions</h3>

      {/* Botón para abrir el modal */}
      <Button onClick={() => setShowModal(true)}>Add Tokenomics Data</Button>

      {/* Modal */}
      <TokenomicsModal
        selectedCoinBot={selectedCoinBot}
        showModal={showModal}
        handleClose={handleClose}
      />
    </div>
  )
}

export default Tokenomics
