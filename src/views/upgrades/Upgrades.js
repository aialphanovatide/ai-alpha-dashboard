import React, { useState, useEffect } from "react";
import { Form, Table, Button, Modal } from "react-bootstrap";
import UpgradesForm from "./UpgradesForm";
import EditUpgradesForm from "./EditUpgradesForm";

import config from "../../config";

const Upgrades = () => {
  const [bots, setBots] = useState([]);
  const [selectedCoinBot, setSelectedCoinBot] = useState("");
  const [upgrades, setUpgrades] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false); // Definir el estado de mostrar el modal de edición
  const [selectedUpgrade, setSelectedUpgrade] = useState(null); // Definir el estado del upgrade seleccionado para editar
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Function to parse dates
  const parseDate = (dateStr) => {
    if (dateStr.toLowerCase() === "ongoing") {
      return new Date(9999, 0, 1); 
    }
    const dateParts = dateStr.split(' ');
    if (dateParts.length === 2) {
      return new Date(Date.parse(dateStr));
    } else if (dateParts.length === 3) {
      return new Date(Date.parse(dateStr));
    } else {
      return new Date(dateStr);
    }
  };

  // Function to sort upgrades by date
  const sortUpgradesByDate = (upgrades) => {
    return upgrades.sort((a, b) => parseDate(b.upgrade.date) - parseDate(a.upgrade.date));
  };

  // Gets all the available coins
  useEffect(() => {
    const getAllBots = async () => {
      try {
        const response = await fetch(`${config.BOTS_V2_DEV_API}/bots`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });

        const data = await response.json();
        if (data && data.data) {
          setBots(data.data);
        } else {
          setUpgrades([]);
        }
      } catch (error) {
        setUpgrades([]);
      }
    };

    getAllBots();
  }, []);

  const getUpgradesData = async () => {
    try {
      const response = await fetch(
        `${config.BASE_URL_DEV}/api/get_upgrades?coin_bot_id=${selectedCoinBot}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            'X-Api-Key': config.X_API_KEY_DEV
          },
        },
      );

      const data = await response.json();

      if (data.status === 200) {
        const sortedUpgrades = sortUpgradesByDate(data.message);
        setUpgrades(sortedUpgrades);
      } else {
        setUpgrades([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setUpgrades([]);
    }
  };

  // If a coins is selected gets the upgrades data for it
  useEffect(() => {
    const getUpgrades = async () => {
      try {
        const response = await fetch(
          `${config.BASE_URL_DEV}/api/get_upgrades?coin_bot_id=${selectedCoinBot}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
              'X-Api-Key': config.X_API_KEY_DEV
            },
          },
        );

        const data = await response.json();

        if (data.status === 200) {
          const sortedUpgrades = sortUpgradesByDate(data.message);
          setUpgrades(sortedUpgrades);
        } else {
          setUpgrades([]);
        }
      } catch (error) {
        console.error("Error:", error);
        setUpgrades([]);
      }
    };

    if (selectedCoinBot) {
      getUpgrades();
    }
  }, [selectedCoinBot]);

  const handleEditButtonClick = (upgrade) => {
    setSelectedUpgrade(upgrade); // Establecer el upgrade seleccionado para editar
    setShowEditForm(true); // Mostrar el modal de edición
  };

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
  };

  const handleCreateButtonClick = () => {
    setShowCreateForm(true);
  };

  const handleSelectedCoin = (value) => {
    setSelectedCoinBot(value);
  };

  // Edits an upgrade record
  const handleEditFormSubmit = async (formData) => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/edit_upgrade/${selectedUpgrade.upgrade.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            upgrade_data: formData,
          }),
        },
      );

      const data = await response.json();
      setTimeout(() => {
        setShowEditForm(false);
      }, 1200);
      return data.message;
    } catch (error) {
      console.error("Error editing upgrade:", error);
    } finally {
      getUpgradesData();
    }
  };

  // Creates an upgrade record
  const handleCreateFormSubmit = async (formData) => {
    try {
      const response = await fetch(`${config.BASE_URL}/post_upgrade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          coin_bot_id: selectedCoinBot,
          upgrade_data: formData,
        }),
      });

      const data = await response.json();
      return data.message;
    } catch (error) {
      return error;
    } finally {
      getUpgradesData();
    }
  };

  const handleDeleteUpgrade = async (upgradeId) => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/delete_upgrade/${upgradeId}`,
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
        // Eliminación exitosa, actualiza la lista de upgrades
        getUpgradesData();
      } else {
        console.error("Error deleting upgrade:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const selectedBot =
    bots && selectedCoinBot
      ? bots.find((bot) => bot.id === Number(selectedCoinBot))
      : "";
  const coin_name = selectedBot ? selectedBot.name.toUpperCase() : "No Name";

  return (
    <div>
      <div style={{ margin: "20px", overflowX: "auto" }}>
        <h3>Upgrades</h3>
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
          Create Upgrade
        </Button>

        {upgrades && upgrades.length > 0 && (
          <>
            <Table className="tableGeneral" striped bordered hover>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Event Overview</th>
                  <th>Impact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(upgrades) &&
                  upgrades.map((upgrade) => (
                    <tr key={upgrade.upgrade.id}>
                      <td>{upgrade.upgrade.event}</td>
                      <td>{upgrade.upgrade.date}</td>
                      <td>{upgrade.upgrade.event_overview}</td>
                      <td>{upgrade.upgrade.impact}</td>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() => handleEditButtonClick(upgrade)}
                        >
                          Edit
                        </Button>

                        <Button
                          style={{ marginLeft: "10px" }}
                          variant="danger"
                          onClick={() =>
                            handleDeleteUpgrade(upgrade.upgrade.id)
                          }
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </>
        )}
      </div>
      {/* Modal para el formulario de creación */}
      <Modal show={showCreateForm} onHide={handleCloseCreateForm}>
        <Modal.Header closeButton>
          <Modal.Title>Create Upgrade</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UpgradesForm
            onSubmit={handleCreateFormSubmit}
            onClose={handleCloseCreateForm}
            coinName={coin_name}
          />
        </Modal.Body>
      </Modal>
      <Modal show={showEditForm} onHide={() => setShowEditForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Upgrade Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditUpgradesForm
            upgrade={selectedUpgrade}
            onSubmit={handleEditFormSubmit}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Upgrades;
