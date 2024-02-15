import React, { useState } from "react";
import { Form, Button, Modal, Alert } from "react-bootstrap"; // Importa el componente de Alert de react-bootstrap
import PropTypes from "prop-types";

const RMForm = ({ onSubmit, onCancel, show }) => {
  const [analized_revenue, setAnalizedRevenue] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await onSubmit({
        analized_revenue,
      });
      setSuccessMessage(response);
      setTimeout(() => {
        setAnalizedRevenue("");
        setSuccessMessage(null);
        onCancel();
      }, 2000);
    } catch (error) {
      setSuccessMessage(error);
    }
  };

  return (
    <Modal show={show} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Create Revenue Model</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="modalFormMain" onSubmit={handleSubmit}>
          <Form.Group controlId="analizedRevenueInput">
            <Form.Label>Analized Revenue</Form.Label>
            <Form.Control
              type="text"
              value={analized_revenue}
              onChange={(e) => setAnalizedRevenue(e.target.value)}
              required
            />
          </Form.Group>
          <br />
          <Button style={{ width: "100%" }} type="submit" variant="primary">
            Create Revenue Model
          </Button>
          
          {successMessage && (
            <Alert className="alertSucess" variant="success">
              {successMessage}
            </Alert>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

RMForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

export default RMForm;
