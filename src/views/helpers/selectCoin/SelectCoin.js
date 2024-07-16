import React, { useState, useEffect } from 'react';
import config from '../../../config';
import './selectCoinStyles.css';

const DropdownMenu = ({ selectedCoin, onSelectCoin }) => {
  const [coinBots, setCoinBots] = useState([]);

  // Gets all the coins
  useEffect(() => {
    const fetchCoinBots = async () => {
      try {
        const response = await fetch(`${config.BOTS_V2_API}/get_all_coin_bots`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCoinBots(data.data.coin_bots);
        } else {
          console.error('Error fetching coin bots:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching coin bots:', error);
      }
    };

    fetchCoinBots();
  }, []);

  const handleDropdownChange = (event) => {
    const selectedCoinId = event.target.value;
    onSelectCoin(selectedCoinId); 
  };

  return (
    <div className="dropdown-container">
      <label htmlFor="coinBotDropdown" className="label marLeft"></label>
      <select
        id="coinBotDropdown"
        onChange={handleDropdownChange}
        value={selectedCoin || ''}
        className="select-dropdown"
      >
        <option value="" disabled>Select Coin...</option>
        {coinBots.map((coinBot) => (
          <option key={coinBot.id} value={coinBot.id}>
            {coinBot.name.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownMenu;
