// DAppsEditModal.js
import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import config from "../../config";

const DAppsEditModal = ({ show, onClose, dapp }) => {
  const [editedDApp, setEditedDApp] = useState({
    id: dapp.id,
    dapps: dapp.dapps,
    description: dapp.description,
    tvl: dapp.tvl,
  });

  const [responseMessage, setResponseMessage] = useState({
    error: "",
    success: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "tvl" && !isNaN(value)) || value === "") {
      setEditedDApp({ ...editedDApp, [name]: value });
    } else if (name !== "tvl") {
      setEditedDApp({ ...editedDApp, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/api/dapps/edit/${dapp.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": config.X_API_KEY,
          },
          body: JSON.stringify(editedDApp),
        },
      );

      const data = await response.json();
      if (response.status === 200) {
        setTimeout(() => {
          onClose();
        }, 1200);
        setResponseMessage({
          ...responseMessage,
          success: data.message,
          error: "",
        });
      } else {
        setResponseMessage({
          ...responseMessage,
          error: data.message,
          success: "",
        });
      }
    } catch (error) {
      setResponseMessage({ ...responseMessage, error: error, success: "" });
    }
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit DApp</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="formGeneral">
          <Form.Group className="dappsInput" controlId="formDAppName">
            <Form.Label>DApp Name</Form.Label>
            <Form.Control
              type="text"
              name="dapps"
              value={editedDApp.dapps}
              onChange={handleChange}
            />
          </Form.Group>
          <br />
          <Form.Group className="dappsInput" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              as="textarea"
              value={editedDApp.description}
              onChange={handleChange}
            />
          </Form.Group>
          <br />
          <Form.Group className="dappsInput" controlId="formTVL">
            <Form.Label>TVL</Form.Label>
            <Form.Control
              type="text"
              name="tvl"
              value={editedDApp.tvl}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="formGeneral">
        <Button
          className="createBtn"
          variant="primary"
          onClick={handleSubmit}
          style={{ width: "100%" }}
        >
          Save Changes
        </Button>

        {responseMessage.success && (
          <Alert
            style={{ width: "100%" }}
            className="alertSucess"
            variant="success"
          >
            {responseMessage.success}
          </Alert>
        )}
        {responseMessage.error && (
          <Alert
            style={{ width: "100%" }}
            className="alertSucess"
            variant="danger"
          >
            {responseMessage.error}
          </Alert>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default DAppsEditModal;
