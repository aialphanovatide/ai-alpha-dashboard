import React, { useState, useEffect, useCallback } from 'react';
import '../helpers/selectCoin/selectCoinStyles.css';
import { getCategories } from 'src/services/categoryService';
import Swal from 'sweetalert2';

const CategoryDropdown = ({ selectedCategory, onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const categories = await getCategories();
      setCategories(categories);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to fetch categories',
        customClass: "swal",
        backdrop: false,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
          <option key={category.category_id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryDropdown;
