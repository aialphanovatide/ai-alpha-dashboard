import React, { useState, useEffect } from "react";
import { Form, Table, Button } from "react-bootstrap";
import CompetitorForm from "./CompetitorForm";
import CompetitorsEditModal from "./CompetitorsEditModal";
import config from "../../config";

const Competitors = () => {
  const [bots, setBots] = useState([]);
  const [selectedCoinBot, setSelectedCoinBot] = useState("");
  const [competitorsData, setCompetitorsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [competitorsCoinNames, setCompetitorsCoinNames] = useState([]);
  const [competitorsTokenomicData, setCompetitorsTokenomicData] = useState([]);
  const [competitorKeyData, setCompetitorKeyData] = useState([]);

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

  // Gets all the competitors of a coin
  useEffect(() => {
    getCompetitorsData()
  }, [selectedCoinBot]);

  const getCompetitorsData = async () => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/get_competitors/${selectedCoinBot}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'ngrok-skip-browser-warning': 'true',
          },
        },
      );

      const data = await response.json();
      console.log('data: ', data)
        
      if (data && data.competitors) {
        setCompetitorsData(data.competitors);
        const coinNames = data.competitors.map(competitor => competitor.competitor.token.trim());
        setCompetitorsCoinNames([...new Set(coinNames)]);
      } else {
        console.error("Error fetching competitors:", data.message);
        setCompetitorsData([]);
        setCompetitorsCoinNames([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setCompetitorsData([]);
      setCompetitorsCoinNames([]);
    }
  };


  useEffect(() => {
    const fetchTokenomicsData = async () => {
      const tokenomicsData = await Promise.all(competitorsCoinNames.map(async (tokenSymbol) => {
        const response = await fetch(
          `https://fsxbdb84-5000.uks1.devtunnels.ms/get/token_data?token_symbol=${tokenSymbol}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          },
        );
        const data = await response.json();
        return { token: tokenSymbol, data: data.data };
      }));

      setCompetitorsTokenomicData(tokenomicsData);
    };

    if (competitorsCoinNames.length > 0) {
      fetchTokenomicsData();
    }
  }, [competitorsCoinNames]);

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
      if (response.ok) {
        return data.message
      } else {
        return data.error
      }
    } catch (error) {
      console.error("Error creating competitor:", error.message);  
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    getCompetitorsData();
    setShowModal(false);

  };

  const handleCoinBotChange = (value) => {
    setSelectedCoinBot(value);
  };

  const handleShowEditModal = (competitor) => {
    setSelectedCompetitor(competitor);
    setShowModal(true);

  };

  const handleEditSuccess = () => {
    getCompetitorsData();// Reiniciar el estado de selectedCompetitor
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedCompetitor(null); // Limpiar el competidor seleccionado al cerrar el modal
  };

  const groupCompetitorsByToken = () => {
    const groupedCompetitors = {};
    competitorsData.forEach((competitor) => {
      const token = competitor.competitor.token.trim();
      if (!groupedCompetitors[token]) {
        groupedCompetitors[token] = [];
      }
      groupedCompetitors[token].push(competitor);
    });
    return groupedCompetitors;
  };

  
  const handleDeleteCompetitor = async (competitorId) => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/delete_competitor/${competitorId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
      );
  
      const data = await response.json();
  
      if (data && data.status === 200) {
        // Eliminación exitosa, actualiza la lista de competidores
        getCompetitorsData();
      } else {
        console.error("Error deleting competitor:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  useEffect(() => {
    // Extraer todos los tokens únicos de los competidores
    const uniqueTokens = [...new Set(competitorsData.map(competitor => competitor.competitor.token.trim()))];
  
    // Crear un objeto para almacenar los datos de los competidores por token
    const tokenCompetitorData = {};
  
    // Iterar sobre cada token único
    uniqueTokens.forEach(token => {
      // Filtrar los competidores por el token actual
      const competitorsByToken = competitorsData.filter(competitor => competitor.competitor.token.trim() === token);
  
      // Crear un array para almacenar los pares de clave-valor de cada competidor
      const tokenData = [];
  
      // Iterar sobre cada competidor y almacenar sus valores
      competitorsByToken.forEach(competitor => {
        // Obtener el competidor actual
        const competitorInfo = competitor.competitor;
  
        // Iterar sobre las claves de cada competidor
        Object.entries(competitorInfo).forEach(([key, value]) => {
          // Excluir las claves que no queremos incluir en el resultado final
          if (!["coin_bot_id", "id", "token", "created_at", "updated_at", "dynamic"].includes(key)) {
            // Almacenar solo los valores
            if (typeof value === "string") {
              tokenData.push(value.trim());
            }
          }
        });
      });
  
      // Agrupar los pares de clave-valor en pares consecutivos
      const pairedTokenData = [];
      for (let i = 0; i < tokenData.length; i += 2) {
        pairedTokenData.push([tokenData[i], tokenData[i + 1]]);
      }
  
      // Almacenar los datos del token en el objeto tokenCompetitorData
      tokenCompetitorData[token] = pairedTokenData;
    });
  
    // Actualizar el estado competitorKeyData con los datos de los competidores agrupados por token
    setCompetitorKeyData(tokenCompetitorData);
  }, [competitorsData]);
  
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
                    <th className="thGeneral">Feature</th>
                    <th className="thGeneral">Data</th>
                    <th className="thGeneral">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((competitor, index) => {
                    let disableButtons = index >= 1 && index <= 4;
                    return (
                      <tr className="thGeneral" key={index}>
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
                            disabled={disableButtons}
                          >
                            Edit
                          </Button>
                          <Button
                            style={{ marginLeft: "10px" }}
                            variant="danger"
                            onClick={() =>
                              handleDeleteCompetitor(competitor.competitor.id)
                            }
                            disabled={disableButtons}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          ),
        )}
      </div>
      <Button disabled={!selectedCoinBot} onClick={handleShowModal}>
        Add Competitor
      </Button>
      <CompetitorForm
        showModal={showModal && !selectedCompetitor}
        handleClose={handleCloseModal}
        selectedCoinBot={selectedCoinBot}
        handleSave={(formData) => handleCreateFormSubmit(formData)}
      />
      {selectedCompetitor && (
        <CompetitorsEditModal
          competitor={selectedCompetitor}
          show={showModal}
          handleClose={handleModalClose}
          handleEditSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
  
};

export default Competitors;













