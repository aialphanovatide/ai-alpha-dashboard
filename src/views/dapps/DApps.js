import React, { useState, useEffect } from "react";
import { Form, Table, Button, Modal } from "react-bootstrap";
import DAppsForm from "./DAppsForm";
import DAppsEditModal from "./DAppsEditModal";

import config from "../../config";

const DApps = () => {
  const [bots, setBots] = useState([]);
  const [selectedCoinBot, setSelectedCoinBot] = useState("");
  const [dapps, setDApps] = useState([]);
  const [selectedDApp, setSelectedDApp] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const getDappsData = async () => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/api/dapps?coin_bot_id=${selectedCoinBot}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      const data = await response.json();

      if (data && data.status === 200) {
        setDApps(data.message);
      } else {
        console.error("Error fetching DApps:", data.error);
        setDApps([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setDApps([]);
    }
  };

  // Gets all the coins
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
          console.error("Error fetching bots:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getAllBots();
  }, []);

  // Gets all the dapps data of a coin
  useEffect(() => {
    const getDappsData = async () => {
      try {
        const response = await fetch(
          `${config.BASE_URL}/api/dapps?coin_bot_id=${selectedCoinBot}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          },
        );

        const data = await response.json();

        if (data && data.status === 200) {
          setDApps(data.message);
        } else {
          console.error("Error fetching DApps:", data.error);
          setDApps([]);
        }
      } catch (error) {
        console.error("Error:", error);
        setDApps([]);
      }
    };
    if (selectedCoinBot) {
      getDappsData();
    }
  }, [selectedCoinBot]);

  const handleCreateButtonClick = () => {
    setShowCreateForm(true);
  };

  const handleEditDApp = (dapp) => {
    setSelectedDApp(dapp);
    setShowEditModal(true);
  };

  const handleSelectedCoin = (value) => {
    setSelectedCoinBot(value);
  };

  // creates a new record in dapps for a coin
  const handleCreateFormSubmit = async (formData) => {
    try {
      const response = await fetch(`${config.BASE_URL}/api/dapps/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          coin_bot_id: selectedCoinBot,
          ...formData,
        }),
      });

      const data = await response.json();

      if (data && data.status === 201) {
        setTimeout(() => {
          setShowCreateForm(false);
        }, 2000);
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: error };
    } finally {
      setDApps([]);
      setSelectedCoinBot("");
    }
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    getDappsData(); // Vuelve a cargar los datos de dapps
  };

  const selectedBot =
    bots && selectedCoinBot
      ? bots.find((bot) => bot.id === Number(selectedCoinBot))
      : "";
  const coin_name = selectedBot ? selectedBot.name.toUpperCase() : "No Name";

  return (
    <div>
      <div style={{ margin: "20px", overflowX: "auto" }}>
        <h2>DApps</h2>
        <br />
        <Form.Group controlId="coinBotSelect" style={{ marginBottom: "15px" }}>
          <Form.Label>Select Coin</Form.Label>
          <Form.Control
            as="select"
            value={selectedCoinBot}
            onChange={(e) => handleSelectedCoin(e.target.value)}
          >
            <option value="">Select...</option>
            {bots.map((bot) => (
              <option key={bot.id} value={bot.id}>
                {bot.name.toUpperCase() || "No Name"}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button
          disabled={!selectedCoinBot}
          variant="primary"
          onClick={handleCreateButtonClick}
        >
          Create DApp
        </Button>
        <br />
        {dapps && dapps.length > 0 && (
          <>
            <br />
            <Table className="dappsTable" striped bordered hover>
              <thead>
                <tr>
                  <th>DApp</th>
                  <th>Description</th>
                  <th>TVL</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dapps.map((dapp) => (
                  <tr key={dapp.id}>
                    <td>{dapp.dapps}</td>
                    <td>{dapp.description}</td>
                    <td>{dapp.tvl}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => handleEditDApp(dapp)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </div>
      {/* Creation modal */}
      <Modal show={showCreateForm} onHide={() => setShowCreateForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create DApp</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DAppsForm coinName={coin_name} onSubmit={handleCreateFormSubmit} />
        </Modal.Body>
      </Modal>
      {showEditModal && (
        <DAppsEditModal
          show={showEditModal}
          onClose={handleModalClose} // Pasa la función para recargar los datos
          dapp={selectedDApp}
        />
      )}
    </div>
  );
};

export default DApps;
