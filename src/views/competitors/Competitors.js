import React, { useState, useEffect } from "react";
import { Form, Table, Button, Modal } from "react-bootstrap";
import CompetitorForm from "./CompetitorForm";
import CompetitorsEditModal from "./CompetitorsEditModal";
import config from "../../config";

const Competitors = () => {
  
  const [bots, setBots] = useState([]);
  const [selectedCoinBot, setSelectedCoinBot] = useState("");
  const [competitorsData, setCompetitorsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);


  // gets all the coins
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


  // Gets all the competitor of a coin
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

   // Edits a competitor
   const handleSaveEditCompetitor = async (editedCompetitorData) => {
    try {
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
      
      const data = await response.json();
      if (!response.ok) {
        console.log('response edited: ', data)
      }
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating competitor:", error.message);
    }
  };

  // Creates a new competitor
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

      const data = await response.json();
      if (!response.ok) {
        console.log('response creation: ', data)
        // Si la respuesta no es exitosa, lanza un error con el mensaje de la respuesta
        // throw new Error(errorData.error || "Error creating competitor");
      }
      handleCloseModal(); // Close the creation modal
    } catch (error) {
      console.error("Error creating competitor:", error.message);
    }
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

  const handleShowEditModal = (competitor) => {
    setSelectedCompetitor(competitor);
    setShowModal(true);
  };

  const handleEditSuccess = () => {
    setSelectedCoinBot(""); // Reiniciar el estado de selectedCoinBot
    setCompetitorsData([]); // Reiniciar el estado de selectedCompetitor
  };
  

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedCompetitor(null); // Limpiar el competidor seleccionado al cerrar el modal
  };

  const groupCompetitorsByToken = () => {
    const groupedCompetitors = {};
    competitorsData.forEach((competitor) => {
      const token = competitor.competitor.token;
      if (!groupedCompetitors[token]) {
        groupedCompetitors[token] = [];
      }
      groupedCompetitors[token].push(competitor);
    });
    // console.log('groupedCompetitors: ', groupedCompetitors)
    return groupedCompetitors;
  };

  // console.log('selectedCompetitor: ', selectedCompetitor);
  console.log('competitorsData: ', competitorsData);

  return (
    <div>
      <div style={{ margin: "20px", overflowX: "auto" }}>
        <h2>Competitors</h2>
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

        {Object.entries(groupCompetitorsByToken()).map(
          ([token, competitors]) => (
            <div key={token}>
              <br />
              <h3>{token.toUpperCase()}</h3>
              <br />
              <Table striped bordered hover>
                <thead>
                  <tr>
                  <th>Feature</th>
                  <th>Data</th>
                  <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((competitor, index) => (
                    <tr key={index}>
                      {Object.keys(competitor.competitor).map(
                        (key) =>
                          ![
                            "coin_bot_id",
                            "id",
                            "token",
                            "created_at",
                            "updated_at",
                            "dynamic",
                          ].includes(key) && (
                            <td key={key}>{competitor.competitor[key]}</td>
                          ),
                      )}
                      <td>
                        <Button
                          variant="primary"
                          onClick={() => handleShowEditModal(competitor)}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            
            </div>
          ),
        )}
      </div>
      <Button disabled={!selectedCoinBot} onClick={handleShowModal}>Add Competitor</Button>
      <CompetitorForm
        showModal={showModal && !selectedCompetitor} // Mostrar el formulario solo si no hay un competidor seleccionado
        handleClose={handleCloseModal}
        selectedCoinBot={selectedCoinBot}
        handleSave={(formData) => handleCreateFormSubmit(formData)}
      />
      {selectedCompetitor && ( // Mostrar el modal de edición si hay un competidor seleccionado
        <CompetitorsEditModal
          competitor={selectedCompetitor}
          show={showModal}
          handleClose={handleModalClose}
          handleEditSuccess={handleEditSuccess} // Pasar la función de retorno como prop
        />
      )}
    </div>
  );
};

export default Competitors;


  {/* {Object.keys(competitors[0].competitor).map(
                      (feature) =>
                        ![
                          "coin_bot_id",
                          "id",
                          "created_at",
                          "updated_at",
                          "token",
                          "dynamic",
                        ].includes(feature) && <th key={feature}>Feature</th>,
                    )} */}