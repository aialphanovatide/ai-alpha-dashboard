import React, { useState, useEffect } from "react";
import { Form, Table, Button } from "react-bootstrap";
import CompetitorForm from "./CompetitorForm";
import config from "../../config";
import CompetitorsEditModal from "./CompetitorsEditModal";

const Competitors = () => {
  const [bots, setBots] = useState([]);
  const [selectedCoinBot, setSelectedCoinBot] = useState("");
  const [competitorsData, setCompetitorsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState("");

  useEffect(() => {
    const getAllBots = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get_all_coin_bots`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });

        const data = await response.json();
        if (data && data.coin_bots) {
          setBots(data.coin_bots);
        } else {
          console.error("Error fetching bots:", data.message);
          setBots([]);
        }
      } catch (error) {
        console.error("Error:", error);
        setBots([]);
      }
    };

    getAllBots();
  }, []);

  useEffect(() => {
    const getCompetitorsData = async () => {
      try {
        const response = await fetch(
          `${config.BASE_URL}/get_competitors/${selectedCoinBot}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();

        if (data && data.competitors) {
          setCompetitorsData(data.competitors);
        } else {
          console.error("Error fetching competitors:", data.message);
          setCompetitorsData([]);
        }
      } catch (error) {
        console.error("Error:", error);
        setCompetitorsData([]);
      }
    };

    if (selectedCoinBot) {
      getCompetitorsData();
    }
  }, [selectedCoinBot]);

  const handleCreateFormSubmit = async (formData) => {
    try {
      const response = await fetch(`${config.BASE_URL}/create_competitor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          coin_bot_id: selectedCoinBot,
          competitor_data: formData,
        }),
      });

      if (!response.ok) {
        // Si la respuesta no es exitosa, lanza un error con el mensaje de la respuesta
        const errorData = await response.json();
        throw new Error(errorData.error || "Error creating competitor");
      }

      const data = await response.json();

      // Puedes manejar la respuesta según tus necesidades (mostrar mensaje, cerrar modal, etc.)
      handleCloseModal();
    } catch (error) {
      console.error("Error creating competitor:", error.message);
      // Puedes mostrar un mensaje de error al usuario aquí
    }
  };

  const handleEditCompetitor = (competitor) => {
    setSelectedCompetitor(competitor);
    setShowEditModal(true);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCoinBot("");
    setCompetitorsData([]);
  };

  const handleCoinBotChange = (value) => {
    setSelectedCoinBot(value);
  };

  const handleSaveEditCompetitor = async (editedCompetitorData) => {
    try {
      // Realiza la solicitud al servidor para guardar los cambios del competidor
      const response = await fetch(`${config.BASE_URL}/update_competitor`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          competitor_id: editedCompetitorData.id, // Suponiendo que este es el ID del competidor
          updated_data: editedCompetitorData, // Los datos actualizados del competidor
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error updating competitor");
      }

      // Puedes manejar la respuesta según tus necesidades
      console.log("Competitor updated successfully");
      // Cerrar el modal de edición
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating competitor:", error.message);
      // Puedes mostrar un mensaje de error al usuario aquí
    }
  };

  // Función para agrupar los datos de competidores por token
  const groupCompetitorsByToken = () => {
    const groupedCompetitors = {};
    competitorsData.forEach((competitor) => {
      const token = competitor.competitor.token;
      if (!groupedCompetitors[token]) {
        groupedCompetitors[token] = [];
      }
      groupedCompetitors[token].push(competitor);
    });
    return groupedCompetitors;
  };

  console.log(selectedCompetitor);

  return (
    <div>
      <div style={{ margin: "20px", overflowX: "auto" }}>
        <h2>Competitors Sub-Section</h2>
        <br />
        <Form.Group controlId="coinBotSelect" style={{ marginBottom: "15px" }}>
          <Form.Label>Select Coin</Form.Label>
          <Form.Control
            as="select"
            value={selectedCoinBot}
            onChange={(e) => handleCoinBotChange(e.target.value)}
          >
            <option value="">Select...</option>
            {bots.map((bot) => (
              <option key={bot.id} value={bot.id}>
                {bot.name.toUpperCase() || "No Name"}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {/* Generar una tabla para cada grupo de datos de competidores */}
        {Object.entries(groupCompetitorsByToken()).map(
          ([token, competitors]) => (
            <div key={token}>
              <br />
              <h3>{token.toUpperCase()}</h3>
              <br />
              <Table striped bordered hover>
                <thead>
                  <tr>
                    {Object.keys(competitors[0].competitor).map(
                      (feature) =>
                        feature !== "coin_bot_id" &&
                        feature !== "id" &&
                        feature !== "created_at" &&
                        feature !== "updated_at" &&
                        feature !== "token" &&
                        feature !== "dynamic" && (
                          <th key={feature}>{feature}</th>
                        ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((competitor, index) => (
                    <tr key={index}>
                      {Object.keys(competitor.competitor).map(
                        (key) =>
                          key !== "coin_bot_id" &&
                          key !== "id" &&
                          key !== "token" &&
                          key !== "created_at" &&
                          key !== "updated_at" &&
                          key !== "dynamic" && (
                            <td key={key}>{competitor.competitor[key]}</td>
                          ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
              <h3>Action:</h3>
              <Button onClick={() => handleEditCompetitor(competitors)}>
                Edit {token.toUpperCase()} Data
              </Button>

              <br />
              <br />
            </div>
          ),
        )}
      </div>
      <Button onClick={handleShowModal}>Add Competitor</Button>
      <CompetitorForm
        showModal={showModal}
        handleClose={handleCloseModal}
        selectedCoinBot={selectedCoinBot}
        handleSave={(formData) => handleCreateFormSubmit(formData)} // Llamar a handleCreateFormSubmit con formData
      />
      {showEditModal && (
        <CompetitorsEditModal
          competitorInfo={selectedCompetitor}
          coinBotId={selectedCoinBot}
          handleClose={() => setShowEditModal(false)}
          handleSave={handleSaveEditCompetitor}
        />
      )}
    </div>
  );
};

export default Competitors;
