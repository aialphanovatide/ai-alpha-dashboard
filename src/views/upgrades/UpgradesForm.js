import React, { useState } from "react";
import PropTypes from "prop-types";
import { Form, Button, Alert } from "react-bootstrap";

const UpgradesForm = ({ onSubmit, onClose }) => {
  const [event, setEvent] = useState("");
  const [date, setDate] = useState("");
  const [event_overview, setEvent_overview] = useState("");
  const [impact, setImpact] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      event,
      date,
      event_overview,
      impact,
    });
    setSuccessMessage("Upgrade created successfully");

    // Limpia los campos después de un breve retraso
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 2000);

    // Llamar a la función para cerrar el modal
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="eventInput">
        <Form.Label>Event</Form.Label>
        <Form.Control
          type="text"
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          required
        />
      </Form.Group>
      <br />
      <Form.Group controlId="dateInput">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </Form.Group>
      <br />
      <Form.Group controlId="event_overviewInput">
        <Form.Label>Event Overview</Form.Label>
        <Form.Control
          type="textarea"
          as="textarea"
          value={event_overview}
          onChange={(e) => setEvent_overview(e.target.value)}
          style={{ height: "100px" }}
          required
        />
      </Form.Group>
      <br />
      <Form.Group controlId="impactInput">
        <Form.Label>Impact</Form.Label>
        <Form.Control
          type="textarea"
          as="textarea"
          value={impact}
          onChange={(e) => setImpact(e.target.value)}
          style={{ height: "100px" }}
          required
        />
      </Form.Group>
      <br />
      <Button type="submit" variant="primary" style={{ width: "100%" }}>
        Create Upgrade
      </Button>

      <br />
      <br />
      {successMessage && (
        <Alert className="alertSucess" variant="success">
          {successMessage}
        </Alert>
      )}
    </Form>
  );
};

UpgradesForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired, // Prop para cerrar el modal
};

export default UpgradesForm;
