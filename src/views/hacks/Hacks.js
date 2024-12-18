import React, { useState, useEffect } from "react";
import { Form, Table, Button, Modal } from "react-bootstrap";
import HackForm from "./HacksForm";
import HackEditForm from "./HackEditForm";
import config from "../../config";
import "./hacks.css";

const Hacks = () => {
  const [bots, setBots] = useState([]);
  const [selectedCoinBot, setSelectedCoinBot] = useState("");
  const [hacks, setHacks] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedHackForEdit, setSelectedHackForEdit] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Function to parse dates
  const parseDate = (dateStr) => {
    const dateParts = dateStr.split(' ');
    if (dateParts.length === 2) {
      return new Date(Date.parse(dateStr));
    } else if (dateParts.length === 3) {
      return new Date(Date.parse(dateStr));
    } else {
      return new Date(dateStr);
    }
  };

  // Function to sort hacks by date
  const sortHacksByDate = (hacks) => {
    return hacks.sort((a, b) => parseDate(b.date) - parseDate(a.date));
  };

  // Gets all available coins
  useEffect(() => {
    const getAllBots = async () => {
      try {
        const response = await fetch(`${config.BOTS_V2_API}/bots`, {
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
          console.error("Error fetching bots:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getAllBots();
  }, []);

  // Gets the hacks data of the selected coin
  useEffect(() => {
    const getHacks = async () => {
      try {
        const response = await fetch(
          `${config.BASE_URL}/api/hacks?coin_bot_id=${selectedCoinBot}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
              'X-Api-Key': config.X_API_KEY
            },
          }
        );

        const data = await response.json();

        if (data && data.status === 200) {
          const sortedHacks = sortHacksByDate(data.message);
          setHacks(sortedHacks);
        } else {
          console.error("Error fetching Hacks:", data.message);
          setHacks([]);
        }
      } catch (error) {
        console.error("Error:", error.message);
        setHacks([]);
      }
    };

    if (selectedCoinBot) {
      getHacks();
    }
  }, [selectedCoinBot]);

  const handleCreateButtonClick = () => {
    setShowCreateForm(true);
  };
  const handleSelectedCoin = (value) => {
    setSelectedCoinBot(value);
  };
  const handleEditButtonClick = (hack) => {
    setSelectedHackForEdit(hack);
    setShowEditForm(true);
  };

  // Edits a hack record
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
        }
      );

      const data = await response.json();

      if (data && data.status === 200) {
        setTimeout(() => {
          setShowEditForm(false);
        }, 1200);
        return data.message;
      } else {
        return data.message;
      }
    } catch (error) {
      return error.message;
    } finally {
      getHacks();
    }
  };

  const getHacks = async () => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/api/hacks?coin_bot_id=${selectedCoinBot}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            'X-Api-Key': config.X_API_KEY
          },
        }
      );

      const data = await response.json();

      if (data && data.status === 200) {
        const sortedHacks = sortHacksByDate(data.message);
        setHacks(sortedHacks);
      } else {
        console.error("Error fetching Hacks:", data.message);
        setHacks([]);
      }
    } catch (error) {
      console.error("Error:", error.message);
      setHacks([]);
    }
  };

  // Creates a hack record
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
      console.log("data: ", data);
      if (response.status === 201) {
        setTimeout(() => {
          setShowCreateForm(false);
        }, 1200);
        return data.message;
      } else {
        return data.error;
      }
    } catch (error) {
      console.error("Error creating hack:", error.message);
      return error.message;
    } finally {
      getHacks();
    }
  };

  const handleDeleteHack = async (hackId) => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/api/hacks/delete/${hackId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const data = await response.json();

      if (data && data.status === 200) {
        // Eliminación exitosa, actualiza la lista de DApps
        getHacks();
      } else {
        console.error("Error deleting DApp:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div style={{ margin: "20px", overflowX: "auto" }}>
        <h3>Hacks</h3>

        <Form.Group controlId="coinBotSelect" style={{ marginBottom: "20px" }}>
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
          className="hackCreateBtn"
          disabled={!selectedCoinBot}
          variant="primary"
          onClick={handleCreateButtonClick}
        >
          Create Hack
        </Button>

        {hacks && hacks.length > 0 && (
          <>
            <Table className="hacksTable" striped bordered hover>
              <thead>
                <tr>
                  <th className="thCenter">Hack name</th>
                  <th className="thCenter">Date</th>
                  <th className="thCenter">What was the Incident?</th>
                  <th className="thCenter">What were the Consequences?</th>
                  <th className="thCenter">
                    What risk mitigation measures have been taken?
                  </th>
                  <th className="thCenter">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hacks.map((hack) => (
                  <tr key={hack.id}>
                    <td>{hack.hack_name}</td>
                    <td>{hack.date}</td>
                    <td>{hack.incident_description}</td>
                    <td>{hack.consequences}</td>
                    <td>{hack.mitigation_measure}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => handleEditButtonClick(hack)}
                      >
                        Edit
                      </Button>
                      <Button
                        style={{ marginLeft: "10px" }}
                        variant="danger"
                        onClick={() => handleDeleteHack(hack.id)}
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
      <Modal show={showCreateForm} onHide={() => setShowCreateForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Hack</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <HackForm onSubmit={handleCreateFormSubmit} />
        </Modal.Body>
      </Modal>
      {/* Modal for edition  */}
      <Modal show={showEditForm} onHide={() => setShowEditForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Hack</Modal.Title>
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
