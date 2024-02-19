import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const HackEditForm = ({ hack, onSubmit }) => {
  const [responseMessage, setResponseMessage] = useState("");
  const [formData, setFormData] = useState({
    hackName: hack.hack_name,
    date: hack.date,
    incidentDescription: hack.incident_description,
    consequences: hack.consequences,
    mitigationMeasure: hack.mitigation_measure,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await onSubmit(formData);
    setResponseMessage(response);
  };

  return (
    <Form className="formGeneral" onSubmit={handleSubmit}>
      <Form.Group className="dappsInput" controlId="hackName">
        <Form.Label>Hack Name</Form.Label>
        <Form.Control
          type="text"
          name="hackName"
          value={formData.hackName}
          onChange={handleChange}
        />
      </Form.Group>
      <br />
      <Form.Group className="dappsInput" controlId="date">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="text"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
      </Form.Group>
      <br />
      <Form.Group className="dappsInput" controlId="incidentDescription">
        <Form.Label>Incident Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="incidentDescription"
          value={formData.incidentDescription}
          onChange={handleChange}
        />
      </Form.Group>
      <br />
      <Form.Group className="dappsInput" controlId="consequences">
        <Form.Label>Consequences</Form.Label>
        <Form.Control
          type="text"
          as="textarea"
          rows={3}
          name="consequences"
          value={formData.consequences}
          onChange={handleChange}
        />
      </Form.Group>
      <br />
      <Form.Group className="dappsInput" controlId="mitigationMeasure">
        <Form.Label>Mitigation Measure</Form.Label>
        <Form.Control
          type="text"
          as="textarea"
          rows={3}
          name="mitigationMeasure"
          value={formData.mitigationMeasure}
          onChange={handleChange}
        />
      </Form.Group>
      <hr />
      <Button
        className="createBtn"
        style={{ width: "100%" }}
        variant="primary"
        type="submit"
      >
        Save Changes
      </Button>
      {responseMessage && (
        <Alert
          className="alertSucess"
          variant="success"
          style={{ margin: "1rem" }}
        >
          {responseMessage}
        </Alert>
      )}
    </Form>
  );
};

export default HackEditForm;
