import React, { useState, useEffect } from 'react';
import './selectImage.css'; 

const ImageUpload = ({ onImageSelect }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    onImageSelect(selectedImage);
  }, [selectedImage, onImageSelect]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    // Check if a file is selected and is of the correct format (png or jpg)
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg')) {
      const reader = new FileReader();

      reader.onload = (e) => {
        // Set the selected image and its preview
        setSelectedImage({
          file,
          previewUrl: e.target.result,
        });
      };

      reader.readAsDataURL(file);
    } else {
      // Reset the selected image if the format is not supported
      setSelectedImage(null);
    }
  };

  return (
    <div className="image-upload-container">
      <label className='label' htmlFor="imageUpload">Image</label>
      <input
        type="file"
        id="imageUpload"
        accept=".png, .jpg, .jpeg"
        onChange={handleImageChange}
      />

      {selectedImage && (
        <div>
          <img
            src={selectedImage.previewUrl}
            alt="Selected Preview"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
