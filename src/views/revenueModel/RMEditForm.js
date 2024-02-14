import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const RMEditForm = ({ onSubmit, revenueModel }) => {

  const [analizedRevenue, setAnalizedRevenue] = useState(revenueModel);
  const [responseMessage, setResponseMessage] = useState(null) 


  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await onSubmit({ analized_revenue: analizedRevenue
   });
   setResponseMessage(response)
  };

  return (
    <Form className='modalFormMain' onSubmit={handleSubmit}>
      <Form.Group controlId="analizedRevenue">
        <Form.Label>Analized Revenue</Form.Label>
        <Form.Control
          type="text"
          value={analizedRevenue}
          onChange={(e) => setAnalizedRevenue(e.target.value)}
          placeholder="Enter analized revenue"
        />
      </Form.Group>
    
      <Button style={{ margin: '0.9rem 0', alignSelf: 'center' }} variant="primary" type="submit">
        Update Revenue model
      </Button>
     
      {responseMessage && <Alert className='alertSucess' variant="success">{responseMessage}</Alert>}
    </Form>
  );
};

export default RMEditForm;
