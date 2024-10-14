import React from "react";
import "../helpers/selectCoin/selectCoinStyles.css";

const ShowInAppSection = ({ selectedSection, onSelectSection }) => {
  const handleDropdownChange = (event) => {
    const selectedSection = event.target.value;
    onSelectSection(selectedSection);
  };

  return ( 
    <div className="dropdown-container">
      <select
        onChange={handleDropdownChange}
        value={selectedSection || ""}
        className="select-dropdown"
        // disabled={}
      >
        <option value="" disabled>
          Select Section to Show in the App
        </option>
        <option value="">{"What's happening today?"}</option>
        <option value="">Daily Deep Dives</option>
        <option value="">Market Narratives</option>
        <option value="">S & R lines</option>
      </select>
    </div>
  );
};

export default ShowInAppSection;
