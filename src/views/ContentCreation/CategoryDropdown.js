import React, { useState, useEffect, useCallback } from 'react';
import '../helpers/selectCoin/selectCoinStyles.css';
import config from "../../config";

const CategoryDropdown = ({ selectedCategory, onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllBots = useCallback(async () => {
    try {
      const response = await fetch(`${config.BOTS_V2_API}/get_all_bots`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const responseText = await response.text();
      console.log("responseText : ", responseText);

      try {
        const data = JSON.parse(responseText);
        console.log("data : ", data);
        if (data && data.data) {
          // Asumiendo que `data.data` es un array de categorías
          setCategories(data.data);
        } else {
          console.error("Error in response:", data.message);
        }
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllBots();
  }, [getAllBots]);

  const handleDropdownChange = (event) => {
    const selectedCategory = event.target.value;
    onSelectCategory(selectedCategory);
  };

  return (
    <div className="dropdown-container">
      <label htmlFor="coinBotDropdown" className="label"></label>
      <select
        id="coinBotDropdown"
        onChange={handleDropdownChange}
        value={selectedCategory || ''}
        className="select-dropdown"
        disabled={loading || categories.length === 0}
      >
        <option value="" disabled>Select Coin Category...</option>
        {categories.map((category) => (
          <option key={category.id} value={category.alias}>
            {category.alias}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryDropdown;
