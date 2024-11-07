import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import styles from "./index.module.css";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";
import { ReactComponent as TrashIcon } from "../../assets/icons/trashIcon.svg";
import { deleteCategory, getCategories } from "../../services/categoryService";
import Swal from "sweetalert2";
import defaultImg from "../../assets/brand/logo.png";
import { capitalizeFirstLetter } from "src/utils";
import { deleteBot, getBots } from "src/services/botService";
import { deleteCoin } from "src/services/coinService";

const DeleteItemModal = (props) => {
  const {
    categories,
    setCategories,
    selectedCategories,
    setSelectedCategories,
    selectedCoins,
    setSelectedCoins,
  } = props;
  const [visible, setVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState([]);

  useEffect(() => {
    setItemsToDelete(
      selectedCategories.length > 0 ? selectedCategories : selectedCoins,
    );
  }, [selectedCategories, selectedCoins]);

  //   const fetchEntitiesFromServer = async (entityType) => {
  //   try {
  //     const response = await fetch(`https://other-server.com/api/${entityType}`);
  //     const data = await response.json();
  //     return data.success ? data[entityType] : [];
  //   } catch (error) {
  //     console.error(`Error fetching ${entityType}:`, error);
  //     return [];
  //   }
  // };

  // const deleteEntities = async (entities, entityType, deleteFunction) => {
  //   try {
  //     const remoteEntities = await fetchEntitiesFromServer(entityType);
  //     const entitiesToDelete = remoteEntities.filter(remoteEntity =>
  //       entities.some(entity => entity.name === remoteEntity.name)
  //     );

  //     // Delete entities from the local server
  //     await Promise.all(entities.map(entity => deleteFunction(entity.id)));

  //     // Delete entities from the remote server
  //     await Promise.all(entitiesToDelete.map(entity => deleteFunction(entity.id, true)));
  //   } catch (error) {
  //     console.error(`Error deleting ${entityType}:`, error);
  //   }
  // };

  // const handleDeleteEntities = async (e, entities, entityType, deleteFunction) => {
  //   e.preventDefault();
  //   try {
  //     setLoading(true);
  //     await deleteEntities(entities, entityType, deleteFunction);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Usage for categories
  // const handleDeleteCategory = (e) => {
  //   handleDeleteEntities(e, selectedCategories, 'categories', deleteCategory);
  // };

  // // Usage for coins
  // const handleDeleteCoinBot = (e) => {
  //   handleDeleteEntities(e, selectedCoins, 'coins', deleteCoin);
  // };

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

  const handleDeleteCoinBot = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const bots = await getBots();
      const botsMap = new Map(bots.data.map((bot) => [bot.name, bot.id]));
      let successCount = 0;
      let errorCount = 0;

      for (const coin of selectedCoins) {
        const botId = botsMap.get(coin.name);
        if (botId) {
          const newsBotsResponse = await deleteBot(botId);
          if (!newsBotsResponse.success) {
            errorCount++;
            continue;
          }
          const response = await deleteCoin(coin.bot_id);
          if (response.success) {
            successCount++;
          } else {
            errorCount++;
          }
        } else {
          const response = await deleteCoin(coin.bot_id);
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
              ? "Coin/Bot deleted successfully."
              : `${successCount} coins/bots deleted successfully.`,
          icon: "success",
          customClass: "swal",
        }).then(async () => {
          const updatedCategories = await getCategories();
          setCategories(updatedCategories);
        });
      }

      if (errorCount > 0) {
        throw new Error(`${errorCount} coins/bots failed to delete.`);
      }
    } catch (error) {
      Swal.fire({ text: error.message, icon: "error", customClass: "swal" });
    } finally {
      setLoading(false);
      setVisible(false);
      setSelectedCoins([]);
    }
  };

  return (
    <>
      <div className={styles.buttonContainer}>
        <button
          className={styles.trashBtn}
          onClick={() => setVisible(true)}
          disabled={selectedCategories.length === 0 && selectedCoins.length === 0}
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
              {itemsToDelete.map((item, index) => (
                <div key={index} className={styles.element}>
                  <div
                    className={styles.iconContainer}
                    style={{
                      borderRadius: "50%",
                      border: "2px solid",
                      borderColor: item.border_color
                        ? item.border_color
                        : "gray",
                    }}
                  >
                    <img
                      src={item.icon || defaultImg}
                      onError={(e) => (e.target.src = defaultImg)}
                      alt={'item-icon'}
                    />
                  </div>
                  <span>{capitalizeFirstLetter(item.name)}</span>
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
                onClick={
                  selectedCategories.length > 0
                    ? handleDeleteCategory
                    : handleDeleteCoinBot
                }
              >
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
