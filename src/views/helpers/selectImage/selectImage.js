// import React, { useState, useEffect } from 'react';
// import './selectImage.css'; 

// const ImageUpload = ({ onImageSelect, success, onSuccess }) => {
//   const [selectedImage, setSelectedImage] = useState(null);
  
//   useEffect(() => {
//     onImageSelect(selectedImage);
//   }, [selectedImage, onImageSelect]);

//   useEffect(()=>{
//     if (success === true){
//       setSelectedImage(null)
//     }
//     onSuccess(false)
//   }, [success])

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];

//     // Check if a file is selected and is of the correct format (png or jpg)
//     if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg')) {
//       const reader = new FileReader();

//       reader.onload = (e) => {
//         // Set the selected image and its preview
//         setSelectedImage({
//           file,
//           previewUrl: e.target.result,
//         });
//       };

//       reader.readAsDataURL(file);
//     } else {
//       // Reset the selected image if the format is not supported
//       setSelectedImage(null);
//     }
//   };

//   return (
//     <div className="image-upload-container">
//       <label className='label' htmlFor="imageUpload">Image</label>
//       <input
//         type="file"
//         id="imageUpload"
//         accept=".png, .jpg, .jpeg"
//         onChange={handleImageChange}
//       />

//       {selectedImage && (
//         <div>
//           <img
//             src={selectedImage.previewUrl}
//             alt="Selected Preview"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageUpload;


import React, { useState, useEffect } from 'react';
import './selectImage.css';

const ImageUpload = ({ success, onSuccess, onImagesSelect }) => {
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    onImagesSelect(selectedImages);
  }, [selectedImages, onImagesSelect]);

  useEffect(() => {
    if (success === true) {
      setSelectedImages([]);
    }
    onSuccess(false);
  }, [success]);

  const handleImageChange = (event) => {
    const files = event.target.files;

    // Check if files are selected and are of the correct format (png or jpg)
    const newImages = Array.from(files).filter(
      (file) =>
        file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg'
    );

    if (newImages.length > 0) {
      const imagePromises = newImages.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              file,
              previewUrl: e.target.result,
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagePromises).then((images) => {
        setSelectedImages((prevImages) => [...prevImages, ...images]);
      });
    }
  };

  const removeImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  return (
    <div className="image-upload-container">
      <div className='image-upload-subcontainer'>
        <label className="label" htmlFor="imageUpload">
          Images   
        </label>
        <input
          type="file"
          id="imageUpload"
          accept=".png, .jpg, .jpeg"
          onChange={handleImageChange}
          multiple
        />
      </div>

      <div className='imagesMain'>
      {selectedImages.length > 0 &&
        selectedImages.map((image, index) => (
          <div key={index} className="selected-image-container">
            <img src={image.previewUrl} alt={`Selected Preview ${index + 1}`} />
            <button className='delete-button' onClick={() => removeImage(index)}></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;

