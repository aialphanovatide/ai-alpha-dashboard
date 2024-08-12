import React, { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import pdfToText from "react-pdftotext";
import config from "../../config";

const TextExtractor = ({ setAnalysis, coin_bot }) => {
  const [selectedExtractType, setSelectedExtractType] = useState("");
  const [link, setLink] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleExtractContent = async () => {
    setIsExtracting(true);
    try {
      if (selectedExtractType === "pdf" && pdfFile) {
        const formData = new FormData();
        formData.append("file", pdfFile);
        formData.append("folderName", coin_bot); 
        formData.append("fileName", pdfFile.name);
  
        const response = await fetch(`${config.BOTS_V2_API}/upload`, {
          method: "POST",
          body: formData,
        });
  
        const data = await response.json();
        console.log("respuesta ", data )
        if (response.ok) {
          console.log("File uploaded successfully:", data);
          const text = await pdfToText(pdfFile);
          setAnalysis(text);
        } else {
          console.error("Error uploading file", data.response);
        }
      } else {
        let requestData = {
          extract_type: selectedExtractType,
          link: selectedExtractType === "link" || selectedExtractType === "google_docs" ? link : undefined,
        };
  
        const response = await fetch(`${config.BOTS_V2_API}/extract_content`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(requestData),
        });
  
        const data = await response.json();
        if (response.ok) {
          setAnalysis(data.response);
          setSelectedExtractType("");
          setLink("");
          setPdfFile(null);
        } else {
          console.error("Error extracting content:", data.response);
        }
      }
    } catch (error) {
      console.error("Error extracting content:", error);  // Captura más detalles del error
    } finally {
      setIsExtracting(false);
    }
  };
  
  return (
    <div className="text-extractor">
      <Form>
        <Form.Group controlId="extractType">
          <Form.Label>Extract Content From</Form.Label>
          <Form.Control
            as="select"
            value={selectedExtractType}
            onChange={(e) => setSelectedExtractType(e.target.value)}
          >
            <option value="">Select Extract Type</option>
            <option value="link">Link</option>
            <option value="google_docs">Google Docs</option>
            <option value="pdf">PDF</option>
          </Form.Control>
        </Form.Group>
        {selectedExtractType === "link" ||
        selectedExtractType === "google_docs" ? (
          <Form.Group controlId="link">
            <br />
            <Form.Label>Link</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter link. (If you are trying to extract Google Docs text, make sure the document sharing option is set to 'Anyone with the link can edit'.)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </Form.Group>
        ) : selectedExtractType === "pdf" ? (
          <Form.Group controlId="pdfFile">
            <br />
            <Form.Label>PDF File</Form.Label>
            <Form.Control
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
            />
          </Form.Group>
        ) : null}
        <br />
        <Button
          variant="primary"
          onClick={handleExtractContent}
          disabled={
            isExtracting ||
            !selectedExtractType ||
            (selectedExtractType !== "pdf" && !link) ||
            (selectedExtractType === "pdf" && !pdfFile)
          }
        >
          {isExtracting ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            "Extract Content"
          )}
        </Button>
      </Form>
    </div>
  );
};

export default TextExtractor;