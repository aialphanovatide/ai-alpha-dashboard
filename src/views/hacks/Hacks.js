<<<<<<< HEAD
    import React, { useState, useEffect } from "react";
    import { Form, Table, Button, Modal } from "react-bootstrap";
    import HackForm from "./HacksForm";
    import HackEditForm from "./HackEditForm";
    import config from "../../config";

    const Hacks = () => {
      const [bots, setBots] = useState([]);
      const [selectedCoinBot, setSelectedCoinBot] = useState("");
      const [hacks, setHacks] = useState([]);
      const [showCreateButton, setShowCreateButton] = useState(false);
      const [showEditForm, setShowEditForm] = useState(false);
      const [selectedHackForEdit, setSelectedHackForEdit] = useState(null);

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
              setHacks([]);
              console.error("Error fetching bots:", data.message);
            }
          } catch (error) {
            setHacks([]);
            console.error("Error:", error);
          }
        };

        getAllBots();
      }, []);

      const [showCreateForm, setShowCreateForm] = useState(false);

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
          console.log(data);
          setSelectedCoinBot("");
          // Puedes manejar la respuesta según tus necesidades (mostrar mensaje, cerrar modal, etc.)
        } catch (error) {
          console.error("Error editing hack:", error);
        } finally {
          setShowEditForm(false); // Ocultar el modal de edición después de enviar el formulario
          setHacks([]); // Limpiar los hacks para forzar una nueva carga después de la edición
        }
      };
=======
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
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedHackForEdit, setSelectedHackForEdit] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Gets all available coins
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

  // Gets the hacks data of the selected coin
  useEffect(()=> {
    const getHacks = async () => {
      try {
        const response = await fetch(
          `${config.BASE_URL}/api/hacks?coin_bot_id=${selectedCoinBot}`,
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
          setHacks(data.message);
        } else {
          console.error("Error fetching Hacks:", data.message);
          setHacks([]); 
        }
      } catch (error) {
        console.error("Error:", error.message);
        setHacks([]); 
      }
    };

    if (selectedCoinBot){
      getHacks()
    }
  }, [selectedCoinBot])

  
  const handleCreateButtonClick = () => {
    setShowCreateForm(true);
  };
  const handleSelectedCoin = value => {
    setSelectedCoinBot(value);
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
        },
      );

      const data = await response.json();

      if (data && data.status === 200){
        setTimeout(() => {
          setShowEditForm(false)
        }, 1200);
        return data.message
      } else {
        return data.message
      }
     
    } catch (error) {
       return error.message
    } finally {
      setHacks([]); 
      setSelectedCoinBot("");
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
      console.log('data: ', data)
      if (response.status === 201) {
        setTimeout(() => {
          setShowCreateForm(false)
        }, 1200);
        return data.message;
      } else {
        return data.error;
      }
    } catch (error) {
      console.error("Error creating hack:", error.message);
      return error.message
    } finally {
      setSelectedCoinBot('');
      setHacks([]);
    }
  };
>>>>>>> deded38f6a5f2a3f9171db9bac87b6f8940940b4

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

<<<<<<< HEAD
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
                Create Hack Data
              </Button>
            )}

            {hacks && hacks.length > 0 ? (
              <>
                <br />
                <h3 style={{ marginTop: "20px" }}>Hacks</h3>
                <br />
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
                <br />
                <h3 style={{ marginTop: "20px" }}>Hacks</h3>
                <br />
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
=======

  return (
    <div>
      <div style={{ margin: "20px", overflowX: "auto" }}>
        <h2>Hacks</h2>
       
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

          <Button className="hackCreateBtn" disabled={!selectedCoinBot} variant="primary" onClick={handleCreateButtonClick}>
            Create Hack
          </Button>

        {hacks && hacks.length > 0 && (
          <>
           
            <Table className="hacksTable" striped bordered hover>
              <thead>
                <tr>
                  <th className="thCenter">Action</th>
                  <th className="thCenter">Hack name</th>
                  <th className="thCenter">Date</th>
                  <th className="thCenter">What was the Incident?</th>
                  <th className="thCenter">What were the Consequences?</th>
                  <th className="thCenter">What risk mitigation measures have been taken?</th>
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
>>>>>>> deded38f6a5f2a3f9171db9bac87b6f8940940b4

    export default Hacks;
