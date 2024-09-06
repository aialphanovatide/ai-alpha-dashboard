import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import styles from "./index.module.css";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";
import { ReactComponent as TrashIcon } from "../../assets/icons/trashIcon.svg";
import {
  deleteCategoryById,
  deleteCategoryByName,
} from "../../services/categoryService";

const DeleteCategoryModal = ({ categories }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [visible, setVisible] = useState(false);

  const handleDeleteCategory = async () => {
    try {
      if (selectedCategoryId) {
        await deleteCategoryById(selectedCategoryId);
      }

      if (selectedCategoryName) {
        await deleteCategoryByName(selectedCategoryName);
      }

      // Sweet alert confirmation alert

      // setCategories(categories.filter((category) => category.id !== selectedCategoryId));

      setSelectedCategoryId("");
      setSelectedCategoryName("");

      setTimeout(() => setVisible(false), 2000);
    } catch (error) {
      // Sweet alert error alert
    }
  };

  return (
    <>
      <div className={styles.buttonContainer}>
        <button
          className={styles.trashBtn}
          onClick={() => setVisible(true)}
          disabled={categories.length === 0}
        >
          <TrashIcon />
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
            <CIcon icon={cilX} size="xxl" />
          </button>
          <div className={styles.subcontainer}>
            <TrashIcon className={styles.icon} />
            <h5>Are you sure you want to delete these elements?</h5>
            <div className={styles.elementsContainer}>
              {categories.map((category, index) => (
                <div key={index} className={styles.element}>
                  <img
                    src={`https://aialphaicons.s3.us-east-2.amazonaws.com/${category.alias.toLowerCase()}.png`}
                  />
                  <span>{category.alias}</span>
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
              <button
              // onClick={handleDeleteCategory}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default DeleteCategoryModal;
