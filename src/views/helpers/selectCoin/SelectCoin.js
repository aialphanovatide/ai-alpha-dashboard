import React, { useState, useEffect, useCallback } from 'react';
import config from '../../../config';
import './selectCoinStyles.css';
import { getCoins } from 'src/services/coinService';
import Swal from 'sweetalert2';

const DropdownMenu = ({ selectedCoin, onSelectCoin }) => {
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
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to fetch coins',
        customClass: "swal",
        backdrop: false,
      });
    }
  }, []);

  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  const handleDropdownChange = (event) => {
    const selectedCoinId = event.target.value;
    onSelectCoin(selectedCoinId); 
  };

  return (
    <div className="dropdown-container">
      {/* <label htmlFor="coinBotDropdown" className="label marLeft"></label> */}
      <select
        id="coinBotDropdown"
        onChange={handleDropdownChange}
        value={selectedCoin || ''}
        className="select-dropdown"
      >
        <option value="" disabled>Select Coin...</option>
        {coinBots.map((coinBot, index) => (
          <option key={index} value={coinBot.bot_id}>
            {coinBot.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownMenu;
