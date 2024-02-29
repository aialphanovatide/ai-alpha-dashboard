import React, { useState } from "react";
import PropTypes from "prop-types";
import { Form, Button, Alert } from "react-bootstrap";

const DAppsForm = ({ onSubmit, coinName }) => {
  const [dapps, setDApps] = useState("");
  const [description, setDescription] = useState("");
  const [tvl, setTVL] = useState("");
  const [responseMessage, setResponseMessage] = useState({
    error: "",
    success: "",
  });

  // Handles the passging of data to the main creation function
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await onSubmit({
      dapps,
      description,
      tvl,
    });

    if (response.success === true) {
      setResponseMessage({
        ...responseMessage,
        success: response.message,
        error: "",
      });
    } else {
      setResponseMessage({
        ...responseMessage,
        error: response.error,
        success: "",
      });
    }
  };

  return (
    <Form className="formGeneral" onSubmit={handleSubmit}>
      <Form.Group className="dappsInput" controlId="coinName">
        <Form.Label>Token</Form.Label>
        <Form.Control readOnly={true} value={coinName} />
      </Form.Group>

      <Form.Group className="dappsInput" controlId="dappsInput">
        <Form.Label>DApp</Form.Label>
        <Form.Control
          type="text"
          value={dapps}
          onChange={(e) => setDApps(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="dappsInput" controlId="descriptionInput">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          as="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="formDescription"
        />
      </Form.Group>
      <Form.Group className="dappsInput" controlId="tvlInput">
        <Form.Label>TVL</Form.Label>
        <Form.Control
          type="text"
          value={tvl}
          onChange={(e) => {
            const value = e.target.value;
            if (!isNaN(value) || value === "") {
              setTVL(value);
            }
          }}
          required
        />
        <hr />
      </Form.Group>

      <Button
        className="createBtn"
        style={{ width: "100%" }}
        disabled={!description || !tvl}
        type="submit"
        variant="primary"
      >
        Create DApp
      </Button>
      <br />
      {responseMessage.success && (
        <Alert
          className="alertSucess"
          style={{ margin: "1rem" }}
          variant="success"
        >
          {responseMessage.success}
        </Alert>
      )}
      {responseMessage.error && (
        <Alert
          className="alertSucess"
          style={{ margin: "1rem" }}
          variant="danger"
        >
          {responseMessage.error}
        </Alert>
      )}
    </Form>
  );
};

DAppsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default DAppsForm;
