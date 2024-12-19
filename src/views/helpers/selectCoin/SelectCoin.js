import React, { useState, useEffect, useCallback } from "react";
import "./selectCoinStyles.css";
import { getCoins } from "src/services/coinService";
import Swal from "sweetalert2";
import styles from "./index.module.css";

const DropdownMenu = ({ selectedCoin, onSelectCoin, items }) => {
  const [coinBots, setCoinBots] = useState([]);

  const fetchCoins = useCallback(async () => {
    try {
      const response = await getCoins();
      if (!response.success) {
        throw new Error(response.error);
      }
      setCoinBots(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to fetch coins",
        customClass: "swal",
        backdrop: false,
      });
    }
  }, []);

  useEffect(() => {
    items.length == 0 ? fetchCoins() : setCoinBots(items);
  }, [fetchCoins]);

  const handleDropdownChange = (event) => {
    const selectedCoinId = event.target.value;
    const categoryId = event.target.selectedOptions[0].getAttribute("data-category-id");
    onSelectCoin(selectedCoinId, categoryId);
  };

  return (
    <div className={styles.section}>
      <div className={styles.labelContainer}>
        <label>
          <strong>Coin</strong>
          <span> *</span>
        </label>
      </div>
      <select
        className={styles.select}
        required
        disabled={coinBots.length === 0}
        onChange={handleDropdownChange}
        value={selectedCoin || ""}
      >
        <option value="" disabled>
          Select coin
        </option>
        {coinBots.map((coinBot, index) => (
          <option
            key={index}
            value={coinBot.bot_id}
            data-category-id={coinBot.category_id}
          >
            {coinBot.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownMenu;
