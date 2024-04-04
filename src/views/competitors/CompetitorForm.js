import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import PropTypes from "prop-types";

const CompetitorForm = ({
  showModal,
  handleClose,
  selectedCoinBot,
  handleSave,
}) => {
  const initialFormData = {
    token: "",
    selectedKey: "",
    newKeyValuePair: { key: "", value: "" },
    keyValues: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const keysOptions = [
    "Type of token",
    "Circulating supply",
    "Token supply model",
    "Current Market Cap (Nov 2023)",
    "TVL",
    "Daily active users",
    "Transaction fees",
    "Transaction speed",
    "Inflation rate 2022",
    "Inflation rate 2023",
    "APR",
    "Active developers",
    "Revenue",
  ];

  // Agrega las opciones específicas para "Transaction fees"
  const transactionFeesOptions = ["Select Feature...", "Transaction Fee: TOKEN", "Transaction Fee: USD", "Transaction Fee: %", "Transaction Fee: VARIABLE", "Transaction Fee: N/A"];

  // Modifica la función handleChange para mostrar el campo de entrada de valores dependiendo de la opción seleccionada
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      // Aquí verificamos si la opción seleccionada es "Transaction fees", y mostramos el campo de entrada de valores en consecuencia
      newKeyValuePair: {
        ...formData.newKeyValuePair,
        [name]: value === "Transaction fees" ? transactionFeesOptions[0] : "",
      },
    });
  };

  const handleNewKeyValuePairChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      newKeyValuePair: {
        ...formData.newKeyValuePair,
        [name]: value,
      },
    });
  };

  const handleAddKeyValuePair = () => {
    const { selectedKey, newKeyValuePair, keyValues } = formData;
    const key = selectedKey || newKeyValuePair.key;
    if (key && newKeyValuePair.value) {
      setFormData({
        ...formData,
        keyValues: [...keyValues, { key, value: newKeyValuePair.value }],
        newKeyValuePair: { key: "", value: "" },
        selectedKey: "", // Limpiar el campo de selección
      });
    }
  };

  const handleRemoveKeyValuePair = (index) => {
    const { keyValues } = formData;
    const updatedKeyValues = [...keyValues];
    updatedKeyValues.splice(index, 1);
    setFormData({
      ...formData,
      keyValues: updatedKeyValues,
    });
  };

  const handleSubmit = async () => {
    try {
      const competitorData = {
        token: formData.token,
        data: formData.keyValues,
        coin_bot_id: selectedCoinBot,
      };
      const response = await handleSave(competitorData);

      setSuccessMessage(response);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        handleClose();
        setFormData(initialFormData);
      }, 2000);
    } catch (error) {
      console.error("Error saving competitor:", error);
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Competitor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form style={{ margin: "20px" }}>
          <Form.Group controlId="token">
            <Form.Label>Token</Form.Label>
            <br />
            <Form.Control
              type="text"
              name="token"
              value={formData.token}
              onChange={handleChange}
            />
          </Form.Group>
          {/* Dropdown para seleccionar la key */}
          <br></br>
          <Form.Group controlId="selectedKey">
            <Form.Label>Select Feature</Form.Label>
            <Form.Control
              as="select"
              name="selectedKey"
              value={formData.selectedKey}
              onChange={handleChange}
            >
              <option value="">Select...</option>
              {keysOptions.map((key, index) => (
                <option key={index} value={key}>
                  {key}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          {/* Nuevo campo para ingresar dinámicamente pares key-value */}
          <Form.Group className="modalFormGNR">
            <br />
            <Form.Label>New Feature-Data Pair</Form.Label>
            <br />
            <div style={{ display: "flex", marginBottom: "10px" }}>
              {/* Cambia el campo "Feature" a un select cuando se selecciona "Transaction fees" */}
              {formData.selectedKey === "Transaction fees" ? (
                <Form.Control
                  style={{ marginRight: "10px" }}
                  as="select"
                  name="key"
                  value={formData.newKeyValuePair.key}
                  onChange={handleNewKeyValuePairChange}
                >
                  {transactionFeesOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Control>
              ) : (
                // Mantiene el input para "Feature" en otros casos
                <Form.Control
                  style={{ marginRight: "10px" }}
                  type="text"
                  placeholder="Feature"
                  name="key"
                  value={formData.newKeyValuePair.key}
                  onChange={handleNewKeyValuePairChange}
                />
              )}
              {/* Mantiene el input para "Data" en todos los casos */}
              <Form.Control
                style={{ marginRight: "10px" }}
                type="text"
                placeholder="Data"
                name="value"
                value={formData.newKeyValuePair.value}
                onChange={handleNewKeyValuePairChange}
              />
              <br />
              <Button variant="primary" onClick={handleAddKeyValuePair}>
                Add
              </Button>
            </div>
          </Form.Group>

          <br />
          {/* Mostrar los pares key-value ingresados */}
          {formData.keyValues.map((pair, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <Form.Control
                className="modalFormGNRCompetitor"
                type="text"
                value={pair.key}
                readOnly
              />
              <br />
              <Form.Control
                className="modalFormGNRCompetitor"
                type="text"
                value={pair.value}
                readOnly
              />
              <br />

              <Button
                variant="danger"
                onClick={() => handleRemoveKeyValuePair(index)}
              >
                Remove
              </Button>
              <hr />
            </div>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          style={{ width: "100%" }}
          onClick={handleSubmit}
        >
          Save
        </Button>
      </Modal.Footer>
      {showSuccessMessage && (
        <Alert
          variant="success"
          onClose={() => setShowSuccessMessage(false)}
          dismissible
          style={{ margin: "1rem" }}
        >
          {successMessage}
        </Alert>
      )}
    </Modal>
  );
};

CompetitorForm.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default CompetitorForm;
