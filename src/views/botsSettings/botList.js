import React from 'react';
import './bs.css'; 
import Loader from '../loader/loader';
import baseURL from '../../config'

const BotList = ({ bots }) => {
  return (
    <div className="bot-list-container">
      {bots && bots.length > 0 ? (
        bots.map((bot, index) => (
          <div key={index}
          className={`bot-item ${bot.isActive ? 'activeBot' : 'inactiveBot'}`}>
            <div className="bot-icon">
              <img src={`${baseURL.BASE_URL}${bot.icon}`} alt={bot.alias} />
            </div>
            <div className="bot-details">
              <div className="bot-category">{bot.category}</div>
              <div className="bot-alias">{bot.alias}</div>
            </div>
          </div>
        ))
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default BotList;
