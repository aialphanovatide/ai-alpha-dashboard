import React, { useEffect, useState } from 'react';
import { CButton } from '@coreui/react';
import { Form, InputGroup, FormControl, Alert, Modal, Button } from 'react-bootstrap';
import config from '../../config';
import './CreateBotModal.css';

const CreateBotModal = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState('success');
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [url, setUrl] = useState('');
  const [keywords, setKeywords] = useState('');
  const [blacklist, setBlacklist] = useState('');
  const [dallePrompt, setDallePrompt] = useState('');
  const [visible, setVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.BOTS_V2_API}/categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data.categories);
        } else {
          console.error('Error fetching Categories:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching Categories:', error);
      }
    };
    fetchData();
  }, []);

  const clearFields = () => {
    setName('');
    setSelectedCategory('');
    setUrl('');
    setKeywords('');
    setBlacklist('');
    setDallePrompt('');
    setShowAlert(false);
    setAlertMessage('');
    setAlertVariant('success');
  };

  const handleCreateBot = async () => {
    if (!url.startsWith('https://news.google.com/search?q=')) {
      setAlertMessage('The URL must start with "https://news.google.com/search?q=".');
      setAlertVariant('danger');
      setShowAlert(true);
      return;
    }
    try {
      const createBotResponse = await fetch(`${config.BOTS_V2_API}/create_bot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          name,
          category_id: selectedCategory,
          url,
          keywords,
          blacklist,
          dalle_prompt: dallePrompt,
        }),
      });

      const createBotResult = await createBotResponse.json();
      if (!createBotResponse.ok) {
        setAlertMessage(createBotResult.error || 'Error creating bot.');
        setAlertVariant('danger');
        setShowAlert(true);
        return;
      }

      const createCoinBotResponse = await fetch(`${config.BASE_URL}/create_coin_bot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          bot_name: name,
          category_id: selectedCategory,
          url,
          keywords,
          blacklist,
        }),
      });

      const createCoinBotResult = await createCoinBotResponse.json();
      if (!createCoinBotResponse.ok) {
        setAlertMessage(createCoinBotResult.error || 'Error creating coin bot.');
        setAlertVariant('danger');
        setShowAlert(true);
        return;
      }

      setAlertMessage('Bot created successfully.');
      setAlertVariant('success');
      setShowAlert(true);
      clearFields();
      setTimeout(() => setVisible(false), 2000); // Hide modal after 2 seconds
    } catch (error) {
      setAlertMessage('Error creating bot: ' + error.message);
      setAlertVariant('danger');
      setShowAlert(true);
    }
  };

  return (
    <>
      <CButton className="btn modal-btn" onClick={() => setVisible(!visible)}>
        Create a new Bot
      </CButton>
      <Modal show={visible} onHide={() => setVisible(false)} className="custom-modal">
        <span className='closeModalBtn' onClick={() => setVisible((prevVisible) => !prevVisible)}>X</span>
        <Modal.Body className='formBody'>
          <Form className='formMain'>
            <h3>Create New Bot</h3>
            <Form.Group className='formSubmain'>
              <Form.Label>Name</Form.Label>
              <FormControl
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter bot name"
              />
            </Form.Group>
            <Form.Group className='formSubmain'>
              <Form.Label>Select Category</Form.Label>
              <Form.Control
                as="select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Select...</option>
                {categories &&
                  categories.map((category, index) => (
                    <option key={index} value={category.id}>
                      {category.alias.toLowerCase() || 'No Name'}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className='formSubmain'>
              <Form.Label>URL</Form.Label>
              <FormControl
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL"
              />
            </Form.Group>
            <Form.Group className='formSubmain'>
              <Form.Label>Keywords</Form.Label>
              <FormControl
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Enter keywords, separated by commas"
              />
            </Form.Group>
            <Form.Group className='formSubmain'>
              <Form.Label>Blacklist</Form.Label>
              <FormControl
                type="text"
                value={blacklist}
                onChange={(e) => setBlacklist(e.target.value)}
                placeholder="Enter blacklist words, separated by commas"
              />
            </Form.Group>
            <Form.Group className='formSubmain'>
              <Form.Label>DALL-E Prompt</Form.Label>
              <FormControl
                type="text"
                value={dallePrompt}
                onChange={(e) => setDallePrompt(e.target.value)}
                placeholder="Enter DALL-E prompt"
              />
            </Form.Group>

            {/* Flash message */}
            {showAlert && (
              <Alert
                className="espacio"
                variant={alertVariant}
                onClose={() => setShowAlert(false)}
                dismissible
              >
                {alertMessage}
              </Alert>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="button-row">
          <Button
            className="espacio close"
            variant="primary"
            onClick={handleCreateBot}
            disabled={!name || !selectedCategory || !url || !url.startsWith('https://news.google.com/search?q=') || !keywords || !blacklist || !dallePrompt}
          >
            Create Bot
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateBotModal;