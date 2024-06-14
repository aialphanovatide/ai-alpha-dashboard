import React, { useEffect, useState } from "react";
import { CButton } from "@coreui/react";
import { Form, Modal, Button, Alert } from "react-bootstrap";
import config from "../../config";
import "../createBotModal/CreateBotModal.css";

const DeleteCategoryModal = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [visible, setVisible] = useState(false);

  console.log("id: " + selectedCategoryId);
  console.log("name: " + selectedCategoryName);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.BOTS_V2_API}/categories`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched categories:", data.data.categories); // Verificar datos aquí
          setCategories(data.data.categories);
        } else {
          console.error("Error fetching categories:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteCategory = async () => {
    console.log("Deleting category:", selectedCategoryId, selectedCategoryName);
    if (!selectedCategoryId && !selectedCategoryName) {
      setAlertMessage("Please select a category.");
      setAlertVariant("danger");
      setShowAlert(true);
      return;
    }

    try {
      // Delete by ID
      const deleteByIdResponse = await fetch(
        `${config.BOTS_V2_API}/categories/${selectedCategoryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      // Delete by Name
      const deleteByNameResponse = await fetch(
        `${config.BASE_URL}/categories/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({ category_name: selectedCategoryName }),
        },
      );

      if (!deleteByIdResponse.ok) {
        const errorResponse = await deleteByIdResponse.json();
        setAlertMessage(
          errorResponse.error || "Error deleting category by ID.",
        );
        setAlertVariant("danger");
        setShowAlert(true);
        return;
      }

      if (!deleteByNameResponse.ok) {
        const errorResponse = await deleteByNameResponse.json();
        setAlertMessage(
          errorResponse.error || "Error deleting category by Name.",
        );
        setAlertVariant("danger");
        setShowAlert(true);
        return;
      }

      setAlertMessage("Category deleted successfully.");
      setAlertVariant("success");
      setShowAlert(true);

      // Refresh categories list
      setCategories(
        categories.filter((category) => category.id !== selectedCategoryId),
      );
      setSelectedCategoryId("");
      setSelectedCategoryName("");

      setTimeout(() => setVisible(false), 2000); // Hide modal after 2 seconds
    } catch (error) {
      setAlertMessage("Error deleting category: " + error.message);
      setAlertVariant("danger");
      setShowAlert(true);
    }
  };

  return (
    <>
      <CButton className="btn modal-btn" onClick={() => setVisible(true)}>
        Delete a Category
      </CButton>
      <Modal
        show={visible}
        onHide={() => setVisible(false)}
        className="custom-modal"
      >
        <span className="closeModalBtn" onClick={() => setVisible(false)}>
          X
        </span>
        <Modal.Body className="formBody">
          <Form className="formMain">
            <h3>Delete Category</h3>
            <Form.Group className="formSubmain">
              <Form.Label>Select Category</Form.Label>
              <Form.Control
                as="select"
                value={selectedCategoryId}
                onChange={(e) => {
                  const selectedCategoryId = e.target.value;
                  setSelectedCategoryId(selectedCategoryId);
                  const selectedCategory = categories.find(
                    (category) => category.id === parseInt(selectedCategoryId),
                  );
                  console.log("Selected category:", selectedCategory);
                  setSelectedCategoryName(
                    selectedCategory ? selectedCategory.alias : "",
                  );
                }}
              >
                <option value="">Select...</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.id}>
                    {category.alias.toLowerCase() || "No Name"}
                  </option>
                ))}
              </Form.Control>
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
            onClick={handleDeleteCategory}
            disabled={!selectedCategoryId || !selectedCategoryName}
          >
            Delete Category
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteCategoryModal;
