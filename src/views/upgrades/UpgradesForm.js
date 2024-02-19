import React, { useState } from "react";
import PropTypes from "prop-types";
import { Form, Button, Alert } from "react-bootstrap";

const UpgradesForm = ({ onSubmit, onClose, coinName }) => {
  const [event, setEvent] = useState("");
  const [date, setDate] = useState("");
  const [event_overview, setEvent_overview] = useState("");
  const [impact, setImpact] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await onSubmit({
      event,
      date,
      event_overview,
      impact,
    });
    setSuccessMessage(response);

    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 2000);
  };

  return (
    <Form onSubmit={handleSubmit}>
       <Form.Group  controlId="coin_Name">
        <Form.Label>Token</Form.Label>
        <Form.Control
          readOnly={true}
          value={coinName}
        />
      </Form.Group>
      <br />
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
      {successMessage && (
        <Alert className="alertSucess" style={{ margin: "1rem" }} variant="success">
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
