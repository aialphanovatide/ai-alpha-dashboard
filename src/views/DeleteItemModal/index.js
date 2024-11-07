import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import styles from "./index.module.css";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";
import { ReactComponent as TrashIcon } from "../../assets/icons/trashIcon.svg";
import { deleteCategory, getCategories } from "../../services/categoryService";
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
      const newsBotsCategories = await getCategories(true);
      const newsBotsCategoriesMap = new Map(
        newsBotsCategories.map((category) => [category.name, category.id]),
      );
      let successCount = 0;
      let errorCount = 0;

      for (const category of selectedCategories) {
        const newsBotsCategoryId = newsBotsCategoriesMap.get(category.name);
        if (newsBotsCategoryId) {
          const newsBotsResponse = await deleteCategory(
            newsBotsCategoryId,
            true,
          );
          if (!newsBotsResponse.success) {
            errorCount++;
            continue;
          }
          const response = await deleteCategory(category.category_id);
          if (response.success) {
            successCount++;
          } else {
            errorCount++;
          }
        }
      }

      if (successCount > 0) {
        Swal.fire({
          text:
            successCount === 1
              ? "Category deleted successfully."
              : `${successCount} categories deleted successfully.`,
          icon: "success",
          customClass: "swal",
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
      }

      if (errorCount > 0) {
        throw new Error(`${errorCount} categories failed to delete.`);
      }
    } catch (error) {
      Swal.fire({ text: error.message, icon: "error", customClass: "swal" });
    } finally {
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
                      src={category.icon}
                      onError={(e) => (e.target.src = defaultImg)}
                      alt={`${category.alias || category.name}-img`}
                    />
                  </div>
                  <span>{capitalizeFirstLetter(category.name)}</span>
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
