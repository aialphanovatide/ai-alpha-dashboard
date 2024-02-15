import React, { useState, useEffect } from 'react'
import { Form, Table, Button } from 'react-bootstrap'
import '../botsSettings/bs.css'
import config from '../../config'
import TokenomicsModal from './TokenomicsModal'
import TokenomicsEditModal from './tokenomicsEditModal'

const Tokenomics = () => {
  const [bots, setBots] = useState([])
  const [selectedCoinBot, setSelectedCoinBot] = useState('')
  const [tokenomicsData, setTokenomicsData] = useState(null)
  const [competitorsData, setCompetitorsData] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null) // Estado para el ítem seleccionado para editar

  // Agregar este useEffect para reiniciar el estado selectedCoinBot cuando cambie la lista de bots
  useEffect(() => {
    setSelectedCoinBot('') // Reiniciar el estado cuando cambie la lista de bots
  }, [bots]) // Ejecutar el efecto cuando la lista de bots cambie

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get_tokenomics/${selectedCoinBot}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        const data = await response.json()
        console.log('tokenomicsData', data.message.tokenomics_data[0].tokenomics)

        if (data.message) {
          setTokenomicsData(data.message)
        } else {
          console.error('No tokenomics data received from the server')
        }
      } catch (error) {
        setSelectedCoinBot('')
        setTokenomicsData(null)
        setCompetitorsData(null)
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
    setShowEditModal(false)
    setSelectedCoinBot('')
    setTokenomicsData(null)
    setCompetitorsData(null)
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

  const handleEditButtonClick = (dataFromTokenomic) => {
    setSelectedItemForEdit(dataFromTokenomic) // Establece el ítem seleccionado para editar
    setShowEditModal(true) // Muestra el modal de edición
  }

  return (
    <div style={{ margin: '20px' }}>
      <h2>Tokenomics</h2>
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

      {tokenomicsData && (
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
              {tokenomicsData && (
                <tr>
                  <td>{tokenomicsData.tokenomics_data[0].tokenomics.total_supply}</td>
                  <td>{tokenomicsData.tokenomics_data[0].tokenomics.circulating_supply}</td>
                  <td>
                    {tokenomicsData.tokenomics_data[0].tokenomics.percentage_circulating_supply}
                  </td>
                  <td>{tokenomicsData.tokenomics_data[0].tokenomics.max_supply}</td>
                  <td>{tokenomicsData.tokenomics_data[0].tokenomics.supply_model}</td>
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
              {tokenomicsData.tokenomics_data.slice(1).map((tokenomic, index) => (
                <tr key={index}>
                  <td>{tokenomic.tokenomics.total_supply}</td>
                  <td>{tokenomic.tokenomics.circulating_supply}</td>
                  <td>{tokenomic.tokenomics.percentage_circulating_supply}</td>
                  <td>{tokenomic.tokenomics.max_supply}</td>
                  <td>{tokenomic.tokenomics.supply_model}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <br></br>
          <h3>Token Distribution</h3>
          {tokenomicsData &&
            tokenomicsData.token_distribution &&
            tokenomicsData.token_distribution[0] && (
              <Table striped bordered hover>
                <tbody>
                  <tr>
                    <td>Action</td>
                    <td>Holder Category</td>
                    <td>Percentage Held</td>
                  </tr>
                  <tr>
                    <td>
                      <Button onClick={() => handleEditButtonClick(tokenomicsData)}>Edit</Button>
                    </td>
                    <td>
                      {tokenomicsData.token_distribution[0].token_distributions.holder_category}
                    </td>
                    <td>
                      {tokenomicsData.token_distribution[0].token_distributions.percentage_held}
                    </td>
                  </tr>
                </tbody>
              </Table>
            )}
          <br />
          <h3>Token Utility</h3>
          {tokenomicsData && tokenomicsData.token_utility && tokenomicsData.token_utility[0] && (
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <td>Action</td>
                  <td>Token Applications</td>
                  <td>Description</td>
                </tr>
                <tr>
                  <td>
                    <Button onClick={() => handleEditButtonClick(tokenomicsData)}>Edit</Button>
                  </td>
                  <td>{tokenomicsData.token_utility[0].token_utilities.token_application}</td>
                  <td>{tokenomicsData.token_utility[0].token_utilities.description}</td>
                </tr>
              </tbody>
            </Table>
          )}
          <br />
          <h3>Value Accrual Mechanisms</h3>
          {tokenomicsData &&
            tokenomicsData.value_accrual_mechanisms &&
            tokenomicsData.value_accrual_mechanisms[0] && (
              <Table striped bordered hover>
                <tbody>
                  <tr>
                    <td>Action</td>
                    <td>Mechanisms</td>
                    <td>Description</td>
                  </tr>
                  <tr>
                    <td>
                      <Button onClick={() => handleEditButtonClick(tokenomicsData)}>Edit</Button>
                    </td>
                    <td>
                      {
                        tokenomicsData.value_accrual_mechanisms[0].value_accrual_mechanisms
                          .mechanism
                      }
                    </td>
                    <td>
                      {
                        tokenomicsData.value_accrual_mechanisms[0].value_accrual_mechanisms
                          .description
                      }
                    </td>
                  </tr>
                </tbody>
              </Table>
            )}
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
      {/* Modal de edición */}
      <TokenomicsEditModal
        selectedItemForEdit={selectedItemForEdit}
        showEditModal={showEditModal} // Cambiado de showEdit a showEditModal
        handleClose={handleClose}
        setShowEditModal={setShowEditModal}
        selectedCoinBot={selectedCoinBot}
      />
    </div>
  )
}

export default Tokenomics
