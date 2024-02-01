import React, { useState, useEffect } from 'react'
import { Form, Table } from 'react-bootstrap'
import CompetitorsEditModal from './CompetitorsEditModal' // Asegúrate de importar correctamente tu componente de edición de competidores
import CompetitorsCreateModal from './CompetitorsCreateModal'
import config from '../../config'

const Competitors = () => {
  const [bots, setBots] = useState([])
  const [selectedCoinBot, setSelectedCoinBot] = useState('')
  const [competitors, setCompetitors] = useState([])
  const [competitorInfo, setCompetitorInfo] = useState(null)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [selectedCompetitorId, setSelectedCompetitorId] = useState(null)

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
          setCompetitors([])
          console.error('Error fetching bots:', data.message)
        }
      } catch (error) {
        setCompetitors([])
        console.log(competitors)
        console.error('Error:', error)
      }
    }

    getAllBots()
  }, [])

  const handleCoinBotChange = async (value) => {
    setSelectedCoinBot(value)

    try {
      const response = await fetch(`${config.BASE_URL}/api/competitors?coin_bot_id=${value}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      if (data && data.competitors) {
        setCompetitors(data.competitors)
      } else {
        console.error('Error fetching Competitors:', data.error)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }
  const openEditModal = (competitorInfo) => {
    setCompetitorInfo(competitorInfo)
    setCreateModalVisible(true) // Cambié setCreateModalVisible a setEditModalVisible
  }

  const handleCompetitorSelect = (competitorId) => {
    setSelectedCompetitorId(competitorId)
    setCreateModalVisible(true)
  }

  const closeModals = () => {
    setCreateModalVisible(false)
    setCompetitors([])
    setSelectedCoinBot('')
  }

  return (
    <div>
      <div style={{ margin: '20px', overflowX: 'auto' }}>
        <h2>Competitors Section</h2>
        <br />
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

        {competitors.length > 0 && (
          <>
            <br />
            <h3>Competitors</h3>
            <br />
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Circulating Supply</th>
                  <th>Token Supply Model</th>
                  <th>Current Market Cap</th>
                  <th>TVL</th>
                  <th>Daily Active Users</th>
                  <th>Transaction Fees</th>
                  <th>Transaction Speed</th>
                  <th>Inflation Rate</th>
                  <th>APR</th>
                  <th>Active Developers</th>
                  {/* Agregar más columnas según tus datos */}
                </tr>
              </thead>
              <tbody>
                {competitors.map((competitor) => (
                  <tr key={competitor.id}>
                    <td>
                      <button onClick={() => handleCompetitorSelect(competitor.id)}>Edit</button>
                    </td>
                    <td>{competitor.token}</td>
                    <td>{competitor.circulating_supply}</td>
                    <td>{competitor.current_market_cap}</td>
                    <td>{competitor.tvl}</td>
                    <td>{competitor.daily_active_users}</td>
                    <td>{competitor.transaction_fees}</td>
                    <td>{competitor.transaction_speed}</td>
                    <td>{competitor.inflation_rate}</td>
                    <td>{competitor.apr}</td>
                    <td>{competitor.active_developers}</td>
                    <td>{competitor.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <br />
            <br />
          </>
        )}
      </div>

      <h3>Actions</h3>

      <CompetitorsEditModal
        competitorInfo={competitorInfo}
        handleClose={() => setCreateModalVisible(false)}
        coinBotId={selectedCoinBot}
        handleSave={(updatedCompetitor) => {
          console.log('Competitor updated:', updatedCompetitor)
          closeModals()
        }}
      />
      <CompetitorsCreateModal
        handleClose={closeModals}
        coinBotId={selectedCoinBot}
        handleSave={(newCompetitor) => {
          console.log('New Competitor created:', newCompetitor)
          closeModals()
        }}
      />
    </div>
  )
}

export default Competitors
