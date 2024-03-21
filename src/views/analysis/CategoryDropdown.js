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
        <option value="TOTAL 3">TOTAL 3</option>
        <option value="Bitcoin">Bitcoin</option>
        <option value="Ethereum">Ethereum</option>
        <option value="RootLink">Layer 0</option>
        <option value="BaseBlock">Layer 1 - Large Market Cap</option>
        <option value="CoreChain">Layer 1 - Mid Market Cap</option>
        <option value="X Payments">Cross Border Payments</option>
        <option value="Lsd">LSDs</option>
        <option value="BoostLayer">Layer 2</option>
        <option value="TruthNodes">Oracles</option>
        <option value="CycleSwap">Defi - DEX Perpetuals</option>
        <option value="NexTrade">Defi - DEX</option>
        <option value="DiverseFi">Defi - Other</option>
        <option value="IntelliChain">AI</option>
      </select>
    </div>
  );
};

export default CategoryDropdown;
