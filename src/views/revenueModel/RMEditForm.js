import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import config from '../../config';

const RMEditForm = ({ onSubmit, revenueModel }) => {
  // Estados para almacenar los valores editados del modelo de ingresos
  const [analizedRevenue, setAnalizedRevenue] = useState(revenueModel.analized_revenue);
  const [fees1ys, setFees1ys] = useState(revenueModel.fees_1ys);

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Lógica para enviar los datos editados al servidor
    onSubmit({ analized_revenue: analizedRevenue, fees_1ys: fees1ys });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="analizedRevenue">
        <Form.Label>Analized Revenue</Form.Label>
        <Form.Control
          type="text"
          value={analizedRevenue}
          onChange={(e) => setAnalizedRevenue(e.target.value)}
          placeholder="Enter analized revenue"
        />
      </Form.Group>
      <Form.Group controlId="fees1ys">
        <Form.Label>Fees (1Y)</Form.Label>
        <Form.Control
          type="text"
          value={fees1ys}
          onChange={(e) => setFees1ys(e.target.value)}
          placeholder="Enter fees (1Y)"
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default RMEditForm;
