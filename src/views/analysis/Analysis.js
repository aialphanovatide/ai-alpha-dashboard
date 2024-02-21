import React, { useEffect, useState, useCallback } from "react";
import "quill/dist/quill.snow.css";
import config from "../../config";
import DropdownMenu from "../helpers/selectCoin/SelectCoin";
import "./analysis.css";
import ImageUpload from "../helpers/selectImage/selectImage";
import RichTextEditor from "../helpers/textEditor/textEditor";
import Swal from "sweetalert2";
import { AllAnalysis } from "./AllAnalysis";
import GeneralAnalysis from "./GeneralAnalysis";

const Analysis = () => {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [selectedImage, setSelectedImage] = useState([]);
  const [content, setContent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState([]);
  const [isAnalysisCreated, setIsAnalysisCreated] = useState(false);

  const handleSelectCoin = (coinId) => {
    setSelectedCoin(coinId);
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const handleContentChange = (content) => {
    setContent(content);
  };

  // Define fetchAnalysis as a useCallback to prevent unnecessary re-renders
  const fetchAnalysis = useCallback(async () => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/get_analysis/${selectedCoin}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setItems(data.message);
        setSelectedImage("");
      } else {
        console.error("Error fetching coin bots:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching coin bots:", error);
    }
  }, [selectedCoin]); // selectedCoin is added as a dependency

  // Calls right away all the analysis when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (selectedCoin) {
        await fetchAnalysis();
      }
    };

    fetchData();
  }, [selectedCoin, fetchAnalysis]); // Include fetchAnalysis as a dependency

  // handles the submit of the three values needed - coin Id, content, and image
  const handleSubmit = async () => {
    if (selectedCoin === null || selectedImage === null || content === null) {
      return Swal.fire({
        icon: "error",
        title: "One or more required fields are missing",
        showConfirmButton: false,
        timer: 1000,
      });
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("coinBot", selectedCoin);
    formData.append("content", content);
    formData.append("images", selectedImage);

    try {
      const response = await fetch(`${config.BASE_URL}/post_analysis`, {
        method: "POST",
        body: formData,
      });
      console.log(formData)
      let responseData = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: responseData.message,
          showConfirmButton: false,
          timer: 1000,
        });
        setIsAnalysisCreated(true);
        setContent(null);

        console.log("Before clearing selectedImage:", selectedImage[0]);

        // Limpiar el selector de imagen
        setSelectedImage([]);

        console.log("After clearing selectedImage:", selectedImage);

        await fetchAnalysis();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error creating analysis",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error,
        showConfirmButton: false,
        timer: 1000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log('selectedImage: ', selectedImage)
   console.log('content: ', content)


  return (
    <div className="analysisMain">
      <h3 className="analysisTitle">Analysis</h3>
      <div className="analysisSubmain">
        <DropdownMenu
          selectedCoin={selectedCoin}
          onSelectCoin={handleSelectCoin}
        />
        {/* <ImageUpload
          success={isAnalysisCreated}
          onSuccess={setIsAnalysisCreated}
          onImagesSelect={handleImageSelect}
        /> */}
        <RichTextEditor
          handleImageSelect={handleImageSelect}
          images={selectedImage}
          success={isAnalysisCreated}
          onSuccess={setIsAnalysisCreated}
          onContentChange={handleContentChange}
        />

        <button
          className="submitAnalisys"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
      <AllAnalysis items={items} fetchAnalysis={fetchAnalysis} />
      <GeneralAnalysis
        success={isAnalysisCreated}
        onSuccess={setIsAnalysisCreated}
      />
    </div>
  );
};

export default Analysis;
