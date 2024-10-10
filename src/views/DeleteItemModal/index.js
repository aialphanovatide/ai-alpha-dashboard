import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import styles from "./index.module.css";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";
import { ReactComponent as TrashIcon } from "../../assets/icons/trashIcon.svg";
import { deleteCategory } from "../../services/categoryService";
import Swal from "sweetalert2";
import defaultImg from "../../assets/brand/logo.png";
import { capitalizeFirstLetter } from "src/utils";

const DeleteItemModal = (props) => {
  const {
    categories,
    setCategories,
    selectedCategories,
    setSelectedCategories,
  } = props;
  const [visible, setVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleDeleteCategory = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let successCount = 0;
      let errorCount = 0;

      for (const category of selectedCategories) {
        const response = await deleteCategory(category.category_id);
        if (response.success) {
          successCount++;
        } else {
          errorCount++;
        }
      }

      if (successCount > 0) {
        Swal.fire({
          text:
            successCount === 1
              ? "Category deleted successfully."
              : `${successCount} categories deleted successfully.`,
          icon: "success",
        });

        const updatedCategories = categories.filter(
          (category) =>
            !selectedCategories.some(
              (selectedCategory) =>
                selectedCategory.category_id === category.category_id,
            ),
        );

        setSelectedCategories([]);
        setCategories(updatedCategories);

        setLoading(false);
        setVisible(false);
      }

      if (errorCount > 0) {
        Swal.fire({
          text: `${errorCount} categories failed to delete.`,
          icon: "error",
        });
        setLoading(false);
        setVisible(false);
      }
    } catch (error) {
      Swal.fire({ text: error.message, icon: "error" });
      setLoading(false);
      setVisible(false);
    }
  };

  return (
    <>
      <div className={styles.buttonContainer}>
        <button
          className={styles.trashBtn}
          onClick={() => setVisible(true)}
          disabled={selectedCategories.length === 0}
        >
          <TrashIcon style={{ height: 25 }} />
        </button>
        <Modal
          show={visible}
          onHide={() => setVisible(false)}
          className={styles.modal}
        >
          <button
            className={styles.closeButton}
            onClick={() => setVisible(false)}
          >
            <CIcon icon={cilX} size="xl" />
          </button>
          <div className={styles.subcontainer}>
            <TrashIcon className={styles.icon} />
            <h5>Are you sure you want to delete these elements?</h5>
            <div className={styles.elementsContainer}>
              {selectedCategories.map((category, index) => (
                <div key={index} className={styles.element}>
                  <div
                    className={styles.iconContainer}
                    style={{
                      borderRadius: "50%",
                      border: "2px solid",
                      borderColor: category.border_color
                        ? category.border_color
                        : "gray",
                    }}
                  >
                    <img
                      src={`https://aialphaicons.s3.us-east-2.amazonaws.com/${category.alias?.toLowerCase()}.svg`}
                      onError={(e) => (e.target.src = defaultImg)}
                      alt={`${category.alias || category.name}-img`}
                    />
                  </div>
                  <span>{capitalizeFirstLetter(category.alias || category.name)}</span>
                </div>
              ))}
            </div>
            <span className={styles.disclaimer}>
              This action cannot be undone.
            </span>
            <div className={styles.buttonsContainer}>
              <button
                onClick={() => setVisible(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button onClick={handleDeleteCategory}>
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default DeleteItemModal;
