import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CInputGroup,
  CInputGroupText,
  CFormText,
  CFormInput,
} from '@coreui/react'

const Analysis = () => {
  const [formData, setFormData] = useState({
    content: '',
    image: null,
    coinBot: '',
  })

  const [coinBots, setCoinBots] = useState([
    { id: '1', bot_name: 'btc' },
    { id: '2', bot_name: 'eth' },
    { id: '3', bot_name: 'hacks' },
    { id: '4', bot_name: 'ldo' },
    { id: '5', bot_name: 'rpl' },
    { id: '6', bot_name: 'fxs' },
    { id: '7', bot_name: 'atom' },
    { id: '8', bot_name: 'dot' },
    { id: '9', bot_name: 'qnt' },
    { id: '10', bot_name: 'ada' },
    { id: '11', bot_name: 'sol' },
    { id: '12', bot_name: 'avax' },
    { id: '13', bot_name: 'near' },
    { id: '14', bot_name: 'ftm' },
    { id: '15', bot_name: 'kas' },
    { id: '16', bot_name: 'matic' },
    { id: '17', bot_name: 'arb' },
    { id: '18', bot_name: 'op' },
    { id: '19', bot_name: 'link' },
    { id: '20', bot_name: 'api3' },
    { id: '21', bot_name: 'band' },
    { id: '22', bot_name: 'xlm' },
    { id: '23', bot_name: 'algo' },
    { id: '24', bot_name: 'xrp' },
    { id: '25', bot_name: 'dydx' },
    { id: '26', bot_name: 'velo' },
    { id: '27', bot_name: 'gmx' },
    { id: '28', bot_name: 'uni' },
    { id: '29', bot_name: 'sushi' },
    { id: '30', bot_name: 'cake' },
    { id: '31', bot_name: 'aave' },
    { id: '32', bot_name: 'pendle' },
    { id: '33', bot_name: '1inch' },
    { id: '34', bot_name: 'ocean' },
    { id: '35', bot_name: 'fet' },
    { id: '36', bot_name: 'rndr' },
  ])

  const [previewImage, setPreviewImage] = useState(null)

  const handleChange = (event) => {
    const { name, value, files } = event.target

    if (name === 'image' && files && files[0]) {
      setPreviewImage(URL.createObjectURL(files[0]))
    }

    setFormData((prevData) => ({ ...prevData, [name]: name === 'image' ? files[0] : value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const formDataObj = new FormData()
      console.log('FormData:', formDataObj)
      formDataObj.append('coinBot', formData.coinBot)
      formDataObj.append('content', formData.content)
      formDataObj.append('image', formData.image)
      console.log('FormData:', formDataObj)

      const response = await fetch('http://127.0.0.1:9000/post_analysis', {
        method: 'POST',
        body: formDataObj,
      })

      if (response.ok) {
        console.log('Analysis sent successfully')
      } else {
        console.error('Error sending analysis:', response.statusText)
      }
    } catch (error) {
      console.error('Error sending analysis:', error)
    }

    // Limpiar el formulario después de enviar
    setFormData({
      content: '',
      image: null,
      coinBot: '',
    })

    setPreviewImage(null)
  }

  return (
    <CRow>
      <CCol xs="12">
        <CCard>
          <CCardHeader>
            <strong>Create Analysis:</strong>
          </CCardHeader>
          <CCardBody>
            <form onSubmit={handleSubmit}>
              {/* Input field for content */}
              <CInputGroup className="mb-3">
                <CInputGroupText>Content</CInputGroupText>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  style={{ height: '400px', resize: 'vertical' }}
                  className="form-control"
                  required
                />
              </CInputGroup>

              {/* Input field for image */}
              <CInputGroup className="mb-3">
                <CInputGroupText>Image</CInputGroupText>
                <CFormInput
                  id="image"
                  name="image"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleChange}
                />
              </CInputGroup>
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Image Preview"
                  style={{ maxWidth: '100%', marginBottom: '16px' }}
                />
              )}

              {/* Selector for coinBot */}
              <CInputGroup className="mb-3">
                <CInputGroupText>Coin Bot</CInputGroupText>
                <select
                  className="form-control"
                  name="coinBot"
                  value={formData.coinBot}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select...</option>
                  {coinBots.map((coinBot) => (
                    <option key={coinBot.id} value={coinBot.id}>
                      {coinBot.bot_name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </CInputGroup>

              {/* Submit button */}
              <CButton color="primary" type="submit">
                Submit Analysis
              </CButton>
            </form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Analysis