// import React, { useState, useEffect } from "react";
// import "../../index.css";
// import Loader from "../../../loader/loader";
// import baseURL from "../../../../config";
// import CIcon from "@coreui/icons-react";
// import { cilToggleOn, cilToggleOff } from "@coreui/icons";

// const SpinnerComponent = () => {
//   return (
//     <div className="spinnergnral">
//       <span
//         className="spinner-border spinner-border-lg"
//         aria-hidden="true"
//       ></span>
//     </div>
//   );
// };

// // Función para formatear la fecha
// const formatDate = (dateString) => {
//   const date = new Date(dateString);
//   const options = {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: false,
//   };
//   // Formatear la fecha y hora según las opciones
//   return date.toLocaleString("en-GB", options).replace(/,/, "");
// };

// const BotList = ({ bots }) => {
//   const [botList, setBotList] = useState([]);

//   useEffect(() => {
//     setBotList(bots); // Actualiza el estado 'botList' con el valor de 'bots'
//   }, [bots]); // Establece 'bots' como la dependencia del efecto

//   // Función para activar o desactivar un bot
//   const toggleBotState = async (index) => {
//     // Asegurarse de que botList no sea undefined
//     if (botList && botList[index]) {
//       const bot = botList[index];
//       const url = bot.isActive
//         ? `${baseURL.BOTS_V2_API}/deactivate_bot_by_id/${bot.category}`
//         : `${baseURL.BOTS_V2_API}/activate_bot_by_id/${bot.category}`;

//       try {
//         const response = await fetch(url, { method: "POST" });
//         if (response.ok) {
//           const data = await response.json();

//           const updatedBots = [...botList];
//           updatedBots[index].isActive = !bot.isActive;
//           setBotList(updatedBots);
//         } else {
//           console.error("Error:", response.statusText);
//         }
//       } catch (error) {
//         console.error("Error:", error);
//       }
//     } else {
//       console.error("Bot or botList is undefined.");
//     }
//   };

//   return (
//     <div className="bot-list-container">
//       {botList && botList.length > 0 ? (
//         botList.map((bot, index) => (
//           <div
//             key={index}
//             className={`bot-item ${bot.isActive ? "activeBot" : "inactiveBot"}`}
//           >
//             <div className="bot-icon">
//               <img
//                 src={`https://aialphaicons.s3.us-east-2.amazonaws.com/${bot.alias.toLowerCase()}.png`}
//                 alt={bot.alias}
//                 style={{ width: 60, height: 60 }}
//               />
//             </div>
//             <div className="bot-details">
//               <div className="bot-category">{bot.category}</div>
//               <div className="bot-alias">{bot.alias}</div>
//               <div className="bot-alias">
//                 Last Run: {formatDate(bot.updated_at)}
//               </div>
//             </div>
//             <button
//               className={`actdeactBtn ${
//                 bot.isActive ? "activeBot" : "inactiveBot"
//               }`}
//               onClick={() => toggleBotState(index)}
//             >
//               {bot.isActive ? (
//                 <CIcon icon={cilToggleOn} className="text-secondary"/>
//               ) : (
//                 <CIcon icon={cilToggleOff} className="text-secondary"/>
//               )}
//             </button>
//           </div>
//         ))
//       ) : (
//         // <Loader />
//         <SpinnerComponent />
//       )}
//     </div>
//   );
// };

// export default BotList;

import React, { useState } from "react";

const ListItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);
  const toggleChecked = () => setIsChecked(!isChecked);

  return (
    <div style={{ marginLeft: item.level * 20 }}>
      <div>
        <input type="checkbox" checked={isChecked} onChange={toggleChecked} />
        <span onClick={toggleOpen} style={{ cursor: "pointer" }}>
          {item.name}{" "}
          {item.subItems && item.subItems.length > 0 && (isOpen ? "▲" : "▼")}
        </span>
      </div>
      {isOpen && item.subItems && (
        <div>
          {item.subItems.map((subItem) => (
            <ListItem key={subItem.id} item={subItem} />
          ))}
        </div>
      )}
    </div>
  );
};

const List = ({ items }) => {
  return (
    <div>
      {items.map((item) => (
        <ListItem key={item.id} item={item} />
      ))}
    </div>
  );
};

const BotList = () => {
  const items = [
    {
      id: 1,
      name: "Item 1",
      level: 0,
      subItems: [
        { id: 2, name: "SubItem 1.1", level: 1 },
        { id: 3, name: "SubItem 1.2", level: 1 },
      ],
    },
    {
      id: 4,
      name: "Item 2",
      level: 0,
      subItems: [
        { id: 5, name: "SubItem 2.1", level: 1 },
        {
          id: 6,
          name: "SubItem 2.2",
          level: 1,
        },
      ],
    },
  ];

  return <List items={items} />;
};

export default BotList;
