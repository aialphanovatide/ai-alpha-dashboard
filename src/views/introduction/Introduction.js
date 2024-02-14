import React, { useEffect, useState } from 'react'
import { Form, Button, Modal } from 'react-bootstrap'
import config from '../../config'
import Swal from 'sweetalert2'

// sucess
// Swal.fire({
//   icon: "success",
//   title: responseData.message,
//   showConfirmButton: false,
//   timer: 1000
// });
// -------------------------------------------
// Error
// Swal.fire({
//   icon: "error",
//   title: responseData.message,
//   showConfirmButton: false,
// });

const Introduction = () => {

  const [bots, setBots] = useState([])
  const [selectedCoinBot, setSelectedCoinBot] = useState('')
  const [content, setContent] = useState('')
  const [website, setWebsite] = useState('')
  const [whitepaper, setWhitepaper] = useState('')
  const [hasIntroductionData, setHasIntroductionData] = useState(false)

  // Get all the coins
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

  // Get the introduction of the selected coin
  useEffect(() => {
    const getIntroductionData = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get_introduction?id=${selectedCoinBot}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        const data = await response.json()
       
        if (data.message.content) {
          const { content, website, whitepaper } = data.message
          setContent(content || '')
          setWebsite(website || '')
          setWhitepaper(whitepaper || '')
          setHasIntroductionData(true) 
        } else {
          setContent('')
          setWebsite('')
          setWhitepaper('')
          setHasIntroductionData(false) 
        }
      } catch (error) {
        console.error('Error fetching introduction data:', error)
      }
    }
    
    if (selectedCoinBot){
      getIntroductionData();
    }
  }, [selectedCoinBot]);


  const handleWebsiteChange = (value) => {
    setWebsite(value)
  }

  const handleContentChange = (value) => {
    setContent(value)
  }

  const handleWhitepaperChange = (value) => {
    setWhitepaper(value)
  }

  const handleSelectedCoin = (value) => {
    setSelectedCoinBot(value)
  }

  // Updates the introduction of a coin
  const handleUpdateClick = async () => {
    try {
      if (!selectedCoinBot) {
        Swal.fire({
          icon: "error",
          title: "Please, select a coin",
          showConfirmButton: false,
        });
        return
      }

      const data = {
        coin_bot_id: selectedCoinBot,
        content: content,
        website: website,
        whitepaper: whitepaper,
      }

      const response = await fetch(`${config.BASE_URL}/edit_introduction/${selectedCoinBot}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (responseData.status == 200){
        Swal.fire({
          icon: "success",
          title: responseData.message,
          showConfirmButton: false,
          timer: 1000
        });
      } else {
        Swal.fire({
          icon: "error",
          title: responseData.message,
          showConfirmButton: false,
        });
      }

      setContent('')
      setWebsite('')
      setWhitepaper('')
      setHasIntroductionData(false)
      setSelectedCoinBot('')
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error,
        showConfirmButton: false,
      });
    }
  }

  // create an introduction for a coin
  const handleCreateClick = async () => {
    try {
      if (!selectedCoinBot || !content) {
        Swal.fire({
        icon: "error",
        title: "Coin or content is missing",
        showConfirmButton: false,
      });
      return
      }

      const data = {
        coin_bot_id: selectedCoinBot,
        content: content,
        website: website,
        whitepaper: whitepaper,
      }

      const response = await fetch(`${config.BASE_URL}/post_introduction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (responseData.status === 200){
        Swal.fire({
          icon: "success",
          title: responseData.message,
          showConfirmButton: false,
          timer: 3000
        });
      } else {
        Swal.fire({
          icon: "error",
          title: responseData.message,
          showConfirmButton: false,
        });
      }

      setContent('')
      setWebsite('')
      setWhitepaper('')
      setHasIntroductionData(false)
      setSelectedCoinBot('')
      
    } catch (error) {
      Swal.fire({
      icon: "success",
      title: error,
      showConfirmButton: false,
    });
    }
  }


  return (
    <div style={{ margin: '20px' }}>
      <h2>Introduction</h2>
      
      {/* Select coin */}
      <Form.Group controlId="coinBotSelect" style={{ marginBottom: '15px' }}>
        <Form.Label>Select Coin</Form.Label>
        <Form.Control
          as="select"
          value={selectedCoinBot}
          onChange={(e) => handleSelectedCoin(e.target.value)}
        >
          <option value="">Select...</option>
          {bots && bots?.map((bot) => (
            <option key={bot.id} value={bot.id}>
              {bot.name.toUpperCase() || 'No Name'}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      {/* Content of the introduction */}
      <Form.Group controlId="contentInput" style={{ marginBottom: '15px' }}>
        <Form.Label>Content (Max 400 Characters)</Form.Label>
        <Form.Control
          required
          style={{ height: '180px' }}
          as="textarea"
          placeholder="Enter content..."
          value={content}
          onChange={(e) => handleContentChange(e.target.value.substring(0, 400))}
        />
      </Form.Group>

      <Form.Group controlId="websiteInput" style={{ marginBottom: '15px' }}>
        <Form.Label>Website</Form.Label>
        <Form.Control
          required
          style={{ height: '40px' }}
          as="textarea"
          placeholder="Enter website..."
          value={website}
          onChange={(e) => handleWebsiteChange(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="whitepaperInput" style={{ marginBottom: '15px' }}>
        <Form.Label>Whitepaper</Form.Label>
        <Form.Control
          required
          style={{ height: '40px' }}
          as="textarea"
          placeholder="Enter whitepaper..."
          value={whitepaper}
          onChange={(e) => handleWhitepaperChange(e.target.value)}
        />
      </Form.Group>
      {hasIntroductionData ? (
        <Button variant="primary" disabled={!selectedCoinBot} onClick={handleUpdateClick}>
          Update Introduction
        </Button>
      ) : (
        <Button variant="primary" disabled={!selectedCoinBot || !content} onClick={handleCreateClick} >
          Create Introduction
        </Button>
      )}
    </div>
  )
}

export default Introduction
