import React from 'react';
import '../helpers/selectCoin/selectCoinStyles.css';

const CategoryDropdown = ({ selectedCategory, onSelectCategory }) => {

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
      >
        <option value="" disabled>Select Category...</option>
        <option value="TOTAL 3">AI</option>
        <option value="Bitcoin">RWA</option>
        
      </select>
    </div>
  );
};

export default CategoryDropdown;
