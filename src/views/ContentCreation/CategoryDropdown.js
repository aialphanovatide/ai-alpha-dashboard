import React, { useState, useEffect, useCallback } from "react";
import "../helpers/selectCoin/selectCoinStyles.css";
import { getCategories } from "src/services/categoryService";
import Swal from "sweetalert2";
import styles from "./index.module.css";

const CategoryDropdown = ({
  selectedCategory,
  onSelectCategory,
  items,
  disabled,
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const categories = await getCategories();
      setCategories(categories);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to fetch categories",
        customClass: "swal",
        backdrop: false,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    items.length == 0 ? fetchCategories() : setCategories(items);
  }, [fetchCategories]);

  const handleDropdownChange = (event) => {
    const selectedCategory = event.target.value;
    onSelectCategory(selectedCategory);
  };

  return (
    <div className={styles.section}>
      <div className={styles.labelContainer}>
        <label>
          <strong>Category</strong>
          <span> *</span>
        </label>
      </div>
      <select
        className={styles.select}
        required
        onChange={handleDropdownChange}
        value={selectedCategory || ""}
        disabled={loading || categories?.length === 0 || disabled}
      >
        <option value="" disabled>
          Select category
        </option>
        {categories?.map((category) => (
          <option key={category.category_id} value={category.name}>
            {/* <img src={category.icon} alt={category.name} /> */}
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryDropdown;
