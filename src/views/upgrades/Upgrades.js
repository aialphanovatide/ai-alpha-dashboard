import React, { useState, useEffect } from "react";
import { Form, Table, Button, Modal } from "react-bootstrap";
import UpgradesForm from "./UpgradesForm";
import EditUpgradesForm from "./EditUpgradesForm";

import config from "../../config";

const Upgrades = () => {
  const [bots, setBots] = useState([]);
  const [selectedCoinBot, setSelectedCoinBot] = useState("");
  const [upgrades, setUpgrades] = useState([]);
  const [showCreateButton, setShowCreateButton] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false); // Definir el estado de mostrar el modal de edición
  const [selectedUpgrade, setSelectedUpgrade] = useState(null); // Definir el estado del upgrade seleccionado para editar
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleEditButtonClick = (upgrade) => {
    setSelectedUpgrade(upgrade); // Establecer el upgrade seleccionado para editar
    setShowEditForm(true); // Mostrar el modal de edición
  };

  const handleCloseCreateForm = () => {
    setShowCreateForm(false); // Función para cerrar el modal de creación
  };

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
            upgrate_data: formData,
          }),
        },
      );

      const data = await response.json();

      setSelectedCoinBot("");
      // Puedes manejar la respuesta según tus necesidades (mostrar mensaje, cerrar modal, etc.)
    } catch (error) {
      console.error("Error editing upgrade:", error);
    } finally {
      setShowEditForm(false); // Ocultar el modal de edición después de enviar el formulario
      setUpgrades([]); // Limpiar los upgrades para forzar una nueva carga después de la edición
    }
  };

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
          setUpgrades([]);
          console.error("Error fetching bots:", data.message);
        }
      } catch (error) {
        setUpgrades([]);
        console.error("Error:", error);
      }
    };

    getAllBots();
  }, []);

  const handleCreateButtonClick = () => {
    setShowCreateForm(true);
  };

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

      // Puedes manejar la respuesta según tus necesidades (mostrar mensaje, cerrar modal, etc.)
    } catch (error) {
      console.error("Error creating upgrade:", error);
    } finally {
      setUpgrades([]);
      setSelectedCoinBot('')
    }
  };

  const handleCoinBotChange = async (value) => {
    setSelectedCoinBot(value);

    try {
      const response = await fetch(`${config.BASE_URL}/get_upgrades?coin_bot_id=${value}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await response.json();

      if (data) {
        setUpgrades(data.message);
        setShowCreateButton(true);
      } else {
        console.error("Error fetching Upgrades:", data.error);
        setUpgrades([]);
        setShowCreateButton(true); // Mostrar el botón si hay un error o no hay upgrades
      }
    } catch (error) {
      console.error("Error:", error);
      setShowCreateButton(true);
    }
  };

  return (
    <div>
      <div style={{ margin: "20px", overflowX: "auto" }}>
        <h2>Upgrades</h2>
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

        {showCreateButton && (
          <Button variant="primary" onClick={handleCreateButtonClick}>
            Create Upgrade
          </Button>
        )}

        {upgrades && upgrades.length > 0 && (
          <>
            <br />
            <h3 style={{ marginTop: "20px" }}>Upgrades</h3>
            <br />
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Event Overview</th>
                  <th>Impact</th>
                  {/* Agregar más columnas según tus datos */}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(upgrades) ? (
                  upgrades.map((upgrade) => (
                    <tr key={upgrade.upgrade.id}>
                      <td>
                        <button onClick={() => handleEditButtonClick(upgrade)}>
                          Edit
                        </button>
                      </td>
                      <td>{upgrade.upgrade.event}</td>
                      <td>{upgrade.upgrade.date}</td>
                      <td>{upgrade.upgrade.event_overview}</td>
                      <td>{upgrade.upgrade.impact}</td>
                      {/* Agregar más columnas según tus datos */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No upgrades available</td>
                  </tr>
                )}
              </tbody>
            </Table>
            <br />
            <br />
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
