import React, { useState, useEffect } from "react";
import { Form, Table, Button, Modal } from "react-bootstrap";
import HackForm from "./HacksForm";
import HackEditForm from "./HackEditForm";
import config from "../../config";
import './hacks.css'

const Hacks = () => {
  
  const [bots, setBots] = useState([]);
  const [selectedCoinBot, setSelectedCoinBot] = useState("");
  const [hacks, setHacks] = useState([]);
  const [showCreateButton, setShowCreateButton] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedHackForEdit, setSelectedHackForEdit] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

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
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getAllBots();
  }, []);

  
  const handleCreateButtonClick = () => {
    setShowCreateForm(true);
  };

  const handleEditFormSubmit = async (formData) => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/api/hacks/edit/${selectedHackForEdit.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (data && data.status === 200){
        return 
      }
      setSelectedCoinBot("");
    } catch (error) {
       return error
    } finally {
      setShowEditForm(false); 
      setHacks([]); 
    }
  };

  const handleCreateFormSubmit = async (formData) => {
    try {
      const response = await fetch(`${config.BASE_URL}/api/hacks/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          coin_bot_id: selectedCoinBot,
          hackName: formData.hackName,
          date: formData.date,
          incidentDescription: formData.incidentDescription,
          consequences: formData.consequences,
          mitigationMeasure: formData.mitigationMeasure,
        }),
      });

      const data = await response.json();
      if (response.status == 200) {
        return data.message;
      } else {
        return data.error;
      }
    } catch (error) {
      console.error("Error creating hack:", error);
    } finally {
      setShowCreateForm(true);
      setHacks([]);
    }
  };

  const handleEditButtonClick = (hack) => {
    setSelectedHackForEdit(hack); // Establece el hack seleccionado para la edición
    setShowEditForm(true); // Muestra el modal de edición
  };

  const handleCoinBotChange = async (value) => {
    setSelectedCoinBot(value);

    try {
      const response = await fetch(
        `${config.BASE_URL}/api/hacks?coin_bot_id=${value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      const data = await response.json();
      console.log("data", data);

      if (data && data.message) {
        // Si data.hacks existe
        setHacks(data.message);
        setShowCreateButton(data.message.length === 0);
        console.log("data que llega,", data.message);
        setShowCreateButton(true);
      } else {
        // Si data.hacks no existe
        console.error("Error fetching Hacks:", data.error);
        setShowCreateButton(true); // Si hay un error o no hay hacks, mostrar el botón para evitar problemas
        setHacks([]); // Establecer hacks como un array vacío para limpiar la tabla
      }
    } catch (error) {
      console.error("Error:", error);
      setShowCreateButton(true); // En caso de error, mostrar el botón para evitar problemas
      setHacks([]); // Establecer hacks como un array vacío para limpiar la tabla
    }
  };
  console.log(hacks);
  return (
    <div>
      <div style={{ margin: "20px", overflowX: "auto" }}>
        <h2>Hacks</h2>
       
        <Form.Group controlId="coinBotSelect" style={{ marginBottom: "20px" }}>
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

          <Button className="hackCreateBtn" disabled={!selectedCoinBot} variant="primary" onClick={handleCreateButtonClick}>
            Create Hack
          </Button>

        {hacks && hacks.length > 0 ? (
          <>
           
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Hack name</th>
                  <th>Date</th>
                  <th>What was the Incident?</th>
                  <th>What were the Consequences?</th>
                  <th>What risk mitigation measures have been taken?</th>
                </tr>
              </thead>
              <tbody>
                {hacks.map((hack) => (
                  <tr key={hack.id}>
                    <td>
                      <button onClick={() => handleEditButtonClick(hack)}>
                        Edit
                      </button>
                    </td>
                    <td>{hack.hack_name}</td>
                    <td>{hack.date}</td>
                    <td>{hack.incident_description}</td>
                    <td>{hack.consequences}</td>
                    <td>{hack.mitigation_measure}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <br />
            <br />
          </>
        ) : (
          <>
            
            <Table className="tableGeneral" striped bordered hover>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Hack name</th>
                  <th>Date</th>
                  <th>What was the Incident?</th>
                  <th>What were the Consequences?</th>
                  <th>What risk mitigation measures have been taken?</th>
                </tr>
              </thead>
            </Table>
            <p>No Hacks available for selected coin</p>
          </>
        )}
      </div>
      {/* Modal para el formulario de creación */}
      <Modal show={showCreateForm} onHide={() => setShowCreateForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Hack Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <HackForm onSubmit={handleCreateFormSubmit} />
        </Modal.Body>
      </Modal>
      {/* Modal for edition  */}
      <Modal show={showEditForm} onHide={() => setShowEditForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Hack Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <HackEditForm
            onSubmit={handleEditFormSubmit}
            hack={selectedHackForEdit}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Hacks;
