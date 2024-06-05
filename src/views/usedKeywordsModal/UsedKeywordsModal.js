import React, { useEffect, useState, useCallback } from "react";
import "../botsSettings/bs.css";
import "../deleteWordsModal/deleteWordsModal.css";
import { CButton } from "@coreui/react";
import { Form, Alert, Modal, Button } from "react-bootstrap";
import config from "../../config";

const UsedKeywordsModal = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [noKeywordsAlert, setNoKeywordsAlert] = useState(false); // Nuevo estado para el mensaje de alerta
  const [coinBots, setCoinBots] = useState([]);
  const [selectedCoinBot, setSelectedCoinBot] = useState("");
  const [selectedTemporalidad, setSelectedTemporalidad] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.BOTS_V2_API}/get_all_coin_bots`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCoinBots(data.coin_bots);
        } else {
          console.error("Error fetching coin bots:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching coin bots:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchKeywords = async () => {
      if (!selectedCoinBot || !selectedTemporalidad) {
        // Early return if we don't have enough data to make the request
        return;
      }

      try {
        const response = await fetch(
          `${config.BOTS_V2_API}/api/get_used_keywords_to_download?bot_id=${selectedCoinBot}&time_period=${selectedTemporalidad}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const { keywords } = await response.json();
          // Filtrar elementos vacíos de la matriz de palabras clave
          const filteredKeywords = keywords.filter(
            (keyword) => keyword.trim() !== ""
          );
          setKeywords(filteredKeywords);

          // Mostrar el mensaje de alerta si no hay palabras clave
          setNoKeywordsAlert(filteredKeywords.length === 0);
        } else {
          console.error("Error fetching keywords:", response.statusText);
          setKeywords([]);
        }
      } catch (error) {
        console.error("Error fetching keywords:", error);
        setKeywords([]);
      }
    };

    fetchKeywords();
  }, [selectedCoinBot, selectedTemporalidad]);

  const clearFields = useCallback(() => {
    setSelectedCoinBot("");
    setSelectedTemporalidad("");
    setKeywords([]);
    setShowAlert(false);
    setNoKeywordsAlert(false); // Limpiar el estado del mensaje de alerta de palabras clave
  }, []);

  const handleDownloadKeywords = () => {
    // Verificar si hay palabras clave para descargar
    if (keywords.length === 0) {
      // Si no hay palabras clave, mostrar un mensaje de alerta
      alert("No hay palabras clave disponibles para descargar.");
      // Limpiar el estado y el select de temporalidad
      clearFields();
      return; // Salir de la función
    }

    // Si hay palabras clave disponibles para descargar
    const currentDate = new Date().toLocaleDateString().replaceAll("/", "-");
    const fileName = `${selectedCoinBot}_${selectedTemporalidad}_${currentDate}.txt`;

    const keywordsString = keywords.join("\n");
    const blob = new Blob([keywordsString], { type: "text/plain" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    clearFields();
  };

  console.log("keywords: ", keywords);

  return (
    <>
      <CButton className="btn modal-btn" onClick={() => setVisible(!visible)}>
        Used Keyword File
      </CButton>
      <Modal
        show={visible}
        onHide={() => setVisible(false)}
        className="custom-modal"
      >
        <span
          className="closeModalBtn"
          onClick={() => setVisible((prevVisible) => !prevVisible)}
        >
          X
        </span>
        <Modal.Body className="formBody">
          <Form className="formMain">
            <h3>Download a Used Keywords File</h3>
            <Form.Group className="formSubmain">
              <Form.Label>Select Coin</Form.Label>
              <Form.Control
                as="select"
                value={selectedCoinBot}
                onChange={(e) => setSelectedCoinBot(e.target.value)}
              >
                <option value="">Select a Coin...</option>
                {coinBots.map((bot) => (
                  <option key={bot.id} value={bot.id}>
                    {bot.name ? bot.name.toUpperCase() : "No Name"}
                  </option>
                ))}
              </Form.Control>
              <div className="espacio"></div>
            </Form.Group>

            <Form.Group className="formSubmain">
              <Form.Label>Select Temporality</Form.Label>
              <Form.Control
                as="select"
                value={selectedTemporalidad}
                onChange={(e) => setSelectedTemporalidad(e.target.value)}
              >
                <option value="">Select Period...</option>
                <option value="1w">Last Week</option>
                <option value="1m">Last Month</option>
                <option value="3m">Last 3 Months</option>
              </Form.Control>
            </Form.Group>

            {noKeywordsAlert && (
              <Alert
                className="espacio"
                variant="warning"
                onClose={() => setNoKeywordsAlert(false)}
                dismissible
              >
                No keywords available to download.
              </Alert>
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer className="button-row">
          <Button
            variant="secondary"
            onClick={handleDownloadKeywords}
            disabled={keywords.length === 0}
          >
            Download Keywords
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UsedKeywordsModal;
