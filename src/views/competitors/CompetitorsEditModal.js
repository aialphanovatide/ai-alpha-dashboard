import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import config from "../../config";

const CompetitorsEditModal = ({
  competitorInfo,
  coinBotId,
  handleClose,
  handleSave,
}) => {
  const [editedCompetitor, setEditedCompetitor] = useState({
    ...competitorInfo,
  });
  const [visible, setVisible] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCompetitor((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  console.log("competitorInfo", competitorInfo);

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/api/competitors/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          coin_bot_id: coinBotId,
          competitor_data: editedCompetitor,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        handleSave({ ...competitorInfo, ...editedCompetitor });
        setSuccessMessage("Updated successfully");
        setTimeout(() => {
          setSuccessMessage("");
        }, 2000);
        setTimeout(() => {
          setVisible(false);
          handleClose();
        }, 4000);
      } else {
        console.error("Error updating competitor data:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  console.log("editedCompetitor", editedCompetitor);
  return (
    <Modal show={visible} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formCompetitor">
            {Object.keys(editedCompetitor).map(
              (field) =>
                ![
                  "coin_bot_id",
                  "id",
                  "created_at",
                  "updated_at",
                  "dynamic",
                ].includes(field) && (
                  <React.Fragment key={field}>
                    <Form.Label>
                      {editedCompetitor[field].competitor &&
                        editedCompetitor[field].competitor.key}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name={field}
                      value={
                        editedCompetitor[field].competitor
                          ? editedCompetitor[field].competitor.value || ""
                          : ""
                      }
                      onChange={handleChange}
                    />
                  </React.Fragment>
                ),
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveClick}>
          Save Changes
        </Button>
        {successMessage && (
          <Alert
            variant="success"
            onClose={() => setSuccessMessage("")}
            dismissible
          >
            {successMessage}
          </Alert>
        )}
      </Modal.Footer>
    </Modal>
  );
};

CompetitorsEditModal.propTypes = {
  competitorInfo: PropTypes.object,
  coinBotId: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default CompetitorsEditModal;
