import React, { useState } from 'react'
import 'quill/dist/quill.snow.css'
import config from '../../config'
import DropdownMenu from '../helpers/selectCoin/SelectCoin'
import './analysis.css'
import ImageUpload from '../helpers/selectImage/selectImage'
import RichTextEditor from '../helpers/textEditor/textEditor'

const Analysis = () => {

  const [selectedCoin, setSelectedCoin] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [content, setContent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const handleSelectCoin = (coinId) => {
    setSelectedCoin(coinId);
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const handleContentChange = (content) => {
    setContent(content);
  };

  // handles the submit of the three values needed - coin Id, content and image
  const handleSubmit = async () => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('coinBot', selectedCoin);
    formData.append('content', content);
    formData.append('image', selectedImage.file);

    try {
      const response = await fetch(`${config.BASE_URL}/post_analysis`, {
        method: 'POST',
        body: formData,
      });

      const respondaData = await response.json()

      if (response.ok) {
        console.log('Submission successful');
      } else {
        console.error('Submission failed', respondaData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
 
  return (

    <div className='analysisMain'>

      <DropdownMenu selectedCoin={selectedCoin} onSelectCoin={handleSelectCoin} />
      <ImageUpload onImageSelect={handleImageSelect} />
      <RichTextEditor onContentChange={handleContentChange} />
      
      <button
        className='submitAnalisys'
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
      {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>    
      
      </div>
  )
}

export default Analysis



// useEffect(() => {
//   if (isFormSubmitted) {
//     // Después de un tiempo (por ejemplo, 2 segundos), restablecer el estado de isFormSubmitted
//     const timeout = setTimeout(() => {
//       setIsFormSubmitted(false)
//     }, 2000)

//     // Limpiar el temporizador si el componente se desmonta antes de que se ejecute
//     return () => clearTimeout(timeout)
//   }
// }, [isFormSubmitted])


  // <CRow>
    //   <CCol xs="12">
    //     <CCard>
    //       <CCardHeader>
    //         <strong>Create Analysis:</strong>
    //       </CCardHeader>
    //       <CCardBody>
    //         <form onSubmit={handleSubmit}>
    //           {/* Input field for content */}
    //           <CInputGroup className="mb-5">
    //             <CInputGroupText>Content</CInputGroupText>
    //             <ReactQuill
    //               theme="snow"
    //               modules={modules}
    //               formats={formats}
    //               placeholder="write your content ...."
    //               onChange={handleQuillChange}
    //               style={{ height: '160px' }}
    //             ></ReactQuill>
    //           </CInputGroup>

    //           {/* Input field for image */}
    //           <CInputGroup className="mb-3">
    //             <CInputGroupText>Image</CInputGroupText>
    //             <CFormInput
    //               id="image"
    //               name="image"
    //               type="file"
    //               accept="image/png, image/jpeg"
    //               onChange={handleChange}
    //             />
    //           </CInputGroup>
    //           {previewImage && (
    //             <img
    //               src={previewImage}
    //               alt="Image Preview"
    //               style={{ maxWidth: '100%', marginBottom: '16px' }}
    //             />
    //           )}

    //           {/* Selector for coinBot */}
    //           <CInputGroup className="mb-3">
    //             <CInputGroupText>Coin Bot</CInputGroupText>
    //             <select
    //               className="form-control"
    //               name="coinBot"
    //               value={formData.coinBot}
    //               onChange={handleChange}
    //               required
    //             >
    //               <option value="">Select...</option>
    //               {coinBots.map((coinBot) => (
    //                 <option key={coinBot.id} value={coinBot.id}>
    //                   {coinBot.bot_name.toUpperCase()}
    //                 </option>
    //               ))}
    //             </select>
    //           </CInputGroup>

    //           {/* Submit button */}
    //           <CButton color="primary" type="submit" disabled={isFormSubmitted}>
    //             {isFormSubmitted ? 'Submitting...' : 'Submit Analysis'}
    //           </CButton>
    //         </form>
    //       </CCardBody>
    //     </CCard>
    //   </CCol>
    // </CRow>