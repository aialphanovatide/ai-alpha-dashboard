import React, { useState } from "react";
import { CButton } from "@coreui/react";
import "./CreateCat.css";
import { FaInfoCircle } from "react-icons/fa";
import {
  Form,
  FormControl,
  Alert,
  Modal,
  Button,
  FormCheck,
} from "react-bootstrap";
import config from "../../config";

const CreateCategoryModal = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState("success");
  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");
  const [prompt, setPrompt] = useState("");
  const [timeInterval, setTimeInterval] = useState(50);
  const [slackChannel, setSlackChannel] = useState("");
  const [borderColor, setBorderColor] = useState("");
  const [visible, setVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showInApp, setShowInApp] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [isCreating, setIsCreating] = useState(false); 

  const clearFields = () => {
    setName("");
    setAlias("");
    setPrompt("");
    setTimeInterval(3);
    setSlackChannel("");
    setBorderColor("");
    setShowAlert(false);
    setAlertMessage("");
    setAlertVariant("success");
    setShowInApp(false);
    setImageFile(null);
  };

  const handleCreateCategory = async () => {
    if (!name || !alias || !slackChannel) {
      setAlertMessage("Name, Alias, and Slack Channel are required.");
      setAlertVariant("danger");
      setShowAlert(true);
      return;
    }

    setIsCreating(true);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      // Other data in JSON format
      const otherData = {
        name,
        alias,
        prompt,
        time_interval: timeInterval,
        slack_channel: slackChannel,
        border_color: borderColor,
      };

      formData.append("data", JSON.stringify(otherData));

      const response = await fetch(`${config.BOTS_V2_API}/add_new_category`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setAlertMessage("Category created successfully.");
        setAlertVariant("success");
        setShowAlert(true);
        setTimeout(() => {
          setIsCreating(false); // Termina el proceso de creación
          clearFields();
          setVisible(false); // Cierra el modal después de que se muestra el mensaje
        }, 2000); // Muestra el mensaje por 2 segundos
      } else {
        setAlertMessage(result.error || "Error creating category.");
        setAlertVariant("danger");
        setShowAlert(true);
        setIsCreating(false); // Termina el proceso de creación
      }
    } catch (error) {
      setAlertMessage("Error creating category: " + error.message);
      setAlertVariant("danger");
      setShowAlert(true);
      setIsCreating(false); // Termina el proceso de creación
    }
  };

  const handleCreateCategoryServer2 = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/create_category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: name,
          category_name: alias,
          time_interval: timeInterval,
          is_active: true,
          border_color: borderColor,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setAlertMessage("Category created successfully in Server 2.");
        setAlertVariant("success");
        setShowAlert(true);
        setTimeout(() => {
          setIsCreating(false); // Termina el proceso de creación
          clearFields();
          setVisible(false); // Cierra el modal después de que se muestra el mensaje
        }, 2000); // Muestra el mensaje por 2 segundos
      } else {
        setAlertMessage(result.error || "Error creating category.");
        setAlertVariant("danger");
        setShowAlert(true);
        setIsCreating(false); // Termina el proceso de creación
      }
    } catch (error) {
      setAlertMessage("Error creating category: " + error.message);
      setAlertVariant("danger");
      setShowAlert(true);
      setIsCreating(false); // Termina el proceso de creación
    }
  };

  const handleCreateBothCategories = async () => {
    await handleCreateCategory();
    if (showInApp) {
      await handleCreateCategoryServer2();
    }
  };

  return (
    <>
      <CButton className="btn modal-btn" onClick={() => setVisible(!visible)}>
        Create a new Category
      </CButton>
      <Modal
        show={visible}
        onHide={() => !isCreating && setVisible(false)} // No permitir cerrar mientras se crea
        className="custom-modal"
      >
        <span
          className="closeModalBtn"
          onClick={() => !isCreating && setVisible((prevVisible) => !prevVisible)} // No permitir cerrar mientras se crea
        >
          X
        </span>
        <Modal.Body className="formBody">
          <Form className="formMain">
            <h3>Create New Category</h3>
            <Form.Group className="formSubmain">
              <Form.Label>Name</Form.Label>
              <FormControl
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
              />
            </Form.Group>
            <Form.Group className="formSubmain">
              <Form.Label>Alias</Form.Label>
              <FormControl
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Enter category alias"
              />
            </Form.Group>
            <Form.Group className="formSubmain">
              <Form.Label>Prompt</Form.Label>
              <div className="info-icon">
                <FaInfoCircle className="info-icon" />
                <div className="info-tooltip">
                  An example of use could be: &quot;Imagine that you are one of the
                  world&apos;s foremost experts on Bitcoin and also a globally
                  renowned journalist skilled at summarizing articles about
                  Bitcoin...&quot;
                </div>
              </div>

              <FormControl
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter Article Generator prompt"
              />
            </Form.Group>
            <Form.Group className="formSubmain">
              <Form.Label>Time Interval</Form.Label>
              <FormControl
                type="number"
                value={timeInterval}
                onChange={(e) => setTimeInterval(e.target.value)}
                placeholder="Enter time interval (default 50)"
              />
            </Form.Group>
            <Form.Group className="formSubmain">
              <Form.Label>Slack Channel</Form.Label>
              <FormControl
                type="text"
                value={slackChannel}
                onChange={(e) => setSlackChannel(e.target.value)}
                placeholder="Enter Slack channel"
              />
            </Form.Group>
            <Form.Group className="formSubmain">
              <Form.Label>Border Color</Form.Label>
              <FormControl
                type="text"
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                placeholder="Enter border color"
              />
            </Form.Group>
            <Form.Group className="formSubmain">
              <Form.Label>Upload Icon</Form.Label>
              <FormControl
                type="file"
                accept="image/png" // Acepta solo archivos PNG
                onChange={(e) => setImageFile(e.target.files[0])}
                placeholder="Upload only PNG icons"
              />
            </Form.Group>
            <Form.Group className="formSubmain">
              <FormCheck
                type="checkbox"
                id="showInAppCheckbox" // ID asociado al checkbox
                label="Show in App"
                checked={showInApp}
                onChange={(e) => setShowInApp(e.target.checked)}
              />
            </Form.Group>

            {showAlert && (
              <Alert
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
            onClick={handleCreateBothCategories}
            disabled={!name || !alias || !slackChannel || isCreating} // Desactivar botón mientras se crea
          >
            Create Category
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateCategoryModal;
