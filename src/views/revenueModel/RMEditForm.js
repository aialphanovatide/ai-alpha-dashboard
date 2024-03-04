import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const RMEditForm = ({ onSubmit, revenueModel }) => {
  const [analizedRevenue, setAnalizedRevenue] = useState(revenueModel);
  const [responseMessage, setResponseMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await onSubmit({ analized_revenue: analizedRevenue });
    setResponseMessage(response);
  };

  return (
    <Form className="modalFormMain" onSubmit={handleSubmit}>
      <Form.Group controlId="analizedRevenue">
        <Form.Label>Analized Revenue</Form.Label>
        <Form.Control
          type="text"
          value={analizedRevenue}
          onChange={(e) => {
            const value = e.target.value;
            if (!isNaN(value) || value === "") {
              setAnalizedRevenue(value);
            }
          }}
          placeholder="Enter analized revenue"
        />
      </Form.Group>
      <hr />
      <Button style={{ width: "100%" }} variant="primary" type="submit">
        Update Revenue model
      </Button>
      {responseMessage && (
        <Alert
          className="alertSucess"
          style={{ margin: "1rem" }}
          variant="success"
        >
          {responseMessage}
        </Alert>
      )}
    </Form>
  );
};

export default RMEditForm;
