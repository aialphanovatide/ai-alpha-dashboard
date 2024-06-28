import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import config from "../../config";

const CompetitorsEditModal = ({
  handleEditSuccess,
  competitor,
  show,
  handleClose,
}) => {
  const [editedData, setEditedData] = useState(competitor);
  const [message, setMessage] = useState(null);

  const handleInputChange = (e, key) => {
    const { value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/edit_competitors/${competitor.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ competitor_data: editedData }),
        },
      );

      if (!response.ok) {
        throw new Error("Error updating competitor");
      }

      console.log("Competitor updated successfully");
      setMessage("Competitor updated successfully");
      setTimeout(() => {
        handleClose();
        handleEditSuccess(); // Llamada a la función de retorno para reinicializar estados en el componente padre
      }, 2000); // Retraso de 2 segundos antes de cerrar el modal
    } catch (error) {
      console.error("Error updating competitor:", error.message);
      // Puedes manejar el error de actualización aquí
    }
  };



  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Competitor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form style={{ padding: "10px" }}>
          {Object.entries(competitor).map(
            ([key, value]) =>
              ![
                "coin_bot_id",
                "id",
                "created_at",
                "updated_at",
                "token",
                "dynamic",
              ].includes(key) && (
                <Form.Group controlId={key} key={key}>
                  <Form.Label>{key}</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedData[key] || value}
                    onChange={(e) => handleInputChange(e, key)}
                  />
                  <br />
                </Form.Group>
              ),
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          style={{ width: "100%" }}
          onClick={handleSubmit}
        >
          Save Changes
        </Button>
      </Modal.Footer>
      {message && (
        <Alert
          style={{ margin: "1rem" }}
          variant={message.includes("successfully") ? "success" : "danger"}
        >
          {message}
        </Alert>
      )}
    </Modal>
  );
};

export default CompetitorsEditModal;
