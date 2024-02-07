import React, { useState, useEffect } from 'react'
import { Form, Table, Button } from 'react-bootstrap'
import CompetitorForm from './CompetitorForm'
import config from '../../config'

const Competitors = () => {
  const [bots, setBots] = useState([])
  const [selectedCoinBot, setSelectedCoinBot] = useState('')
  const [competitorsData, setCompetitorsData] = useState([])
  const [showModal, setShowModal] = useState(false)

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
          setBots([])
        }
      } catch (error) {
        console.error('Error:', error)
        setBots([])
      }
    }

    getAllBots()
  }, [])

  useEffect(() => {
    const getCompetitorsData = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get_competitors/${selectedCoinBot}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        if (data && Array.isArray(data.competitors)) {
          const competitorsData = data.competitors.map((competitorData, index) => ({
            token: competitorData.competitors.token,
            circulating_supply: competitorData.competitors.circulating_supply,
            token_supply_model: competitorData.competitors.token_supply_model,
            current_market_cap: competitorData.competitors.current_market_cap,
            tvl: competitorData.competitors.tvl,
            daily_active_users: competitorData.competitors.daily_active_users,
            transaction_fees: competitorData.competitors.transaction_fees,
            transaction_speed: competitorData.competitors.transaction_speed,
            inflation_rate_2022: competitorData.competitors.inflation_rate_2022,
            inflation_rate_2023: competitorData.competitors.inflation_rate_2023,
            apr: competitorData.competitors.apr,
            active_developers: competitorData.competitors.active_developers,
            revenue: competitorData.competitors.revenue,
            total_supply: competitorData.tokenomics.total_supply,
            percentage_circulating_supply: competitorData.tokenomics.percentage_circulating_supply,
            max_supply: competitorData.tokenomics.max_supply,
            dynamic: competitorData.tokenomics.dynamic,
            created_at: competitorData.competitors.created_at,
            updated_at: competitorData.competitors.updated_at,
          }))
          setCompetitorsData(competitorsData)
        } else {
          console.error('Error fetching competitors:', data.message)
          setCompetitorsData([])
        }
      } catch (error) {
        console.error('Error:', error)
        setCompetitorsData([])
      }
    }

    if (selectedCoinBot) {
      getCompetitorsData()
    }
  }, [selectedCoinBot])

  const handleCreateFormSubmit = async (formData) => {
    try {
      const response = await fetch(`${config.BASE_URL}/post_competitor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          coin_bot_id: selectedCoinBot,
          competitor_data: formData,
        }),
      })

      if (!response.ok) {
        // Si la respuesta no es exitosa, lanza un error con el mensaje de la respuesta
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error creating competitor')
      }

      const data = await response.json()

      // Puedes manejar la respuesta según tus necesidades (mostrar mensaje, cerrar modal, etc.)
      handleCloseModal()
    } catch (error) {
      console.error('Error creating competitor:', error.message)
      // Puedes mostrar un mensaje de error al usuario aquí
    }
  }

  const handleShowModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleCoinBotChange = (value) => {
    setSelectedCoinBot(value)
  }

  return (
    <div>
      <div style={{ margin: '20px', overflowX: 'auto' }}>
        <h2>Competitors Sub-Section</h2>
        <br />
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

        {competitorsData.length > 0 && (
          <>
            <br />
            <h3>Competitors</h3>
            <br />
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Coin Analyzed</th>
                  {competitorsData.slice(1).map((_, index) => (
                    <th key={index}>{`Competitor ${index + 1}`}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Token</td>
                  <td>{competitorsData[0].token}</td>
                  {competitorsData.slice(1).map((competitor, index) => (
                    <td key={index}>{competitor.token}</td>
                  ))}
                </tr>
                <tr>
                  <td>Circulating Supply</td>
                  <td>{competitorsData[0].circulating_supply}</td>
                  {competitorsData.slice(1).map((competitor, index) => (
                    <td key={index}>{competitor.circulating_supply}</td>
                  ))}
                </tr>
                <tr>
                  <td>Token Supply Model</td>
                  <td>{competitorsData[0].token_supply_model}</td>
                  {competitorsData.slice(1).map((competitor, index) => (
                    <td key={index}>{competitor.token_supply_model}</td>
                  ))}
                </tr>
                <tr>
                  <td>Current Market Cap</td>
                  <td>{competitorsData[0].current_market_cap}</td>
                  {competitorsData.slice(1).map((competitor, index) => (
                    <td key={index}>{competitor.current_market_cap}</td>
                  ))}
                </tr>
                <tr>
                  <td>TVL</td>
                  <td>{competitorsData[0].tvl}</td>
                  {competitorsData.slice(1).map((competitor, index) => (
                    <td key={index}>{competitor.tvl}</td>
                  ))}
                </tr>
                <tr>
                  <td>Daily Active Users</td>
                  <td>{competitorsData[0].daily_active_users}</td>
                  {competitorsData.slice(1).map((competitor, index) => (
                    <td key={index}>{competitor.daily_active_users}</td>
                  ))}
                </tr>
                <tr>
                  <td>Transaction Fees</td>
                  <td>{competitorsData[0].transaction_fees}</td>
                  {competitorsData.slice(1).map((competitor, index) => (
                    <td key={index}>{competitor.transaction_fees}</td>
                  ))}
                </tr>
                <tr>
                  <td>Transaction Speed</td>
                  <td>{competitorsData[0].transaction_speed}</td>
                  {competitorsData.slice(1).map((competitor, index) => (
                    <td key={index}>{competitor.transaction_speed}</td>
                  ))}
                </tr>
                <tr>
                  <td>Inflation Rate 2022</td>
                  <td>{competitorsData[0].inflation_rate_2022}</td>
                  {competitorsData.slice(1).map((competitor, index) => (
                    <td key={index}>{competitor.inflation_rate_2022}</td>
                  ))}
                </tr>
                <tr>
                  <td>Inflation Rate 2023</td>
                  <td>{competitorsData[0].inflation_rate_2023}</td>
                  {competitorsData.slice(1).map((competitor, index) => (
                    <td key={index}>{competitor.inflation_rate_2023}</td>
                  ))}
                </tr>
                <tr>
                  <td>APR</td>
                  <td>{competitorsData[0].apr}</td>
                  {competitorsData.slice(1).map((competitor, index) => (
                    <td key={index}>{competitor.apr}</td>
                  ))}
                </tr>
                <tr>
                  <td>Active Developers</td>
                  <td>{competitorsData[0].active_developers}</td>
                  {competitorsData.slice(1).map((competitor, index) => (
                    <td key={index}>{competitor.active_developers}</td>
                  ))}
                </tr>
                <tr>
                  <td>Revenue</td>
                  <td>{competitorsData[0].revenue}</td>
                  {competitorsData.slice(1).map((competitor, index) => (
                    <td key={index}>{competitor.revenue}</td>
                  ))}
                </tr>
                {/* Asegúrate de agregar más características aquí según sea necesario */}
              </tbody>
            </Table>
            <br />
            <br />
          </>
        )}
      </div>
      <Button onClick={handleShowModal}>Add Competitor</Button>
      <CompetitorForm
        showModal={showModal}
        handleClose={handleCloseModal}
        handleSave={(formData) => handleCreateFormSubmit(formData)} // Llamar a handleCreateFormSubmit con formData
      />
    </div>
  )
}

export default Competitors
