import React, { useState, useEffect, useCallback } from "react";
import "./index.css";
import baseURL from "../../../../config";
import CIcon from "@coreui/icons-react";
import {
  cilToggleOn,
  cilToggleOff,
  cilPen,
  // cilTerminal,
} from "@coreui/icons";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteCategoryModal from "src/views/DeleteCategoryModal";

const ListItem = ({ bot, setCategories, categories }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);
  
  const toggleChecked = (e) => {
    const botCategory = JSON.parse(e.target.value);
  
    if (isChecked) {
      setCategories(categories.filter(category => category.alias !== botCategory.alias));
    } else {
      setCategories([...categories, botCategory]);
    }
  
    setIsChecked(!isChecked);
  };
  

  return (
    <>
      <div className={`bot-item ${isChecked ? "checked" : ""}`}>
        <div className="bot-item-input">
          <input type="checkbox" checked={isChecked} onChange={toggleChecked} value={JSON.stringify(bot)}/>
        </div>
        <div className="bot-img-container">
          <img
            src={`https://aialphaicons.s3.us-east-2.amazonaws.com/${bot.alias.toLowerCase()}.png`}
            alt={bot.alias}
          />
        </div>
        <div className="middle-container">
          <div className="bot-details">
            <div className="bot-category">{bot.category}</div>
            <div>{bot.alias}</div>
            <div className="bot-last-run">
              Last Run: {formatDate(bot.updated_at)}
            </div>
          </div>
          <button className="edit-btn">
            <CIcon icon={cilPen} />
            {"  "}
            Edit
          </button>
          {/* <button className="prompt-btn">
            <CIcon icon={cilTerminal} />{"  "}
            Prompt
          </button> */}
          <button
            className={`switch-btn ${
              bot.isActive ? "activeBot" : "inactiveBot"
            }`}
            // onClick={() => toggleBotState(index)}
          >
            {bot.isActive ? (
              <CIcon icon={cilToggleOn} size="xxl" />
            ) : (
              <CIcon icon={cilToggleOff} size="xxl" />
            )}
          </button>
        </div>
        <button onClick={toggleOpen} className="chevron-button">
          {/* {bot.subItems && bot.subItems.length > 0 && (isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />)} */}
          {isOpen ? (
            <ExpandLessIcon color="inherit" fontSize="inherit" />
          ) : (
            <ExpandMoreIcon color="inherit" fontSize="inherit" />
          )}
        </button>
      </div>
      {isOpen && bot.subItems && (
        <div>
          {bot.subItems.map((subItem, index) => (
            <ListItem key={index} item={subItem} />
          ))}
        </div>
      )}
    </>
  );
};

const SpinnerComponent = () => {
  return (
    <div className="spinnergnral">
      <span
        className="spinner-border spinner-border-lg"
        aria-hidden="true"
      ></span>
    </div>
  );
};

// Función para formatear la fecha
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  // Formatear la fecha y hora según las opciones
  return date.toLocaleString("en-GB", options).replace(/,/, "");
};

const BotList = ({ bots, getAllBots }) => {
  const [botList, setBotList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const updateBotState = useCallback(
    async (url, botCategory) => {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category: botCategory }),
        });

        const data = await response.json();
        if (data) {
          await getAllBots();
          console.log(`Bot ${botCategory} Updated After:`, data.bot);
        } else {
          console.error(
            `Error At ${
              url === "activate_bot" ? "TurnON" : "TurnOFF"
            } the bot ${botCategory}:`,
            data.message,
          );
        }
      } catch (error) {
        console.error("Error during:", error);
      } finally {
        setLoading(false);
      }
    },
    [getAllBots],
  );

  const turnOnAllBots = useCallback(() => {
    setLoading(true);
    updateBotState(`${baseURL.BOTS_V2_API}/activate_all_categories`);
  }, [updateBotState]);

  const turnOffAllBots = useCallback(() => {
    setLoading(true);
    updateBotState(`${baseURL.BOTS_V2_API}/deactivate_all_categories`);
  }, [updateBotState]);

  useEffect(() => {
    setBotList(bots); // Actualiza el estado 'botList' con el valor de 'bots'
  }, [bots]); // Establece 'bots' como la dependencia del efecto

  // Función para activar o desactivar un bot
  const toggleBotState = async (index) => {
    // Asegurarse de que botList no sea undefined
    if (botList && botList[index]) {
      const bot = botList[index];
      const url = bot.isActive
        ? `${baseURL.BOTS_V2_API}/deactivate_bot_by_id/${bot.category}`
        : `${baseURL.BOTS_V2_API}/activate_bot_by_id/${bot.category}`;

      try {
        const response = await fetch(url, { method: "POST" });
        if (response.ok) {
          const data = await response.json();

          const updatedBots = [...botList];
          updatedBots[index].isActive = !bot.isActive;
          setBotList(updatedBots);
        } else {
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.error("Bot or botList is undefined.");
    }
  };

  return (
    <>
      <div className="top-container">
        <DeleteCategoryModal categories={categories} />
        <button
          className="pause-btn"
          // onClick={
          //   loading
          //     ? null
          //     : botList.every((bot) => bot.isActive)
          //       ? turnOffAllBots
          //       : turnOnAllBots
          // }
        >
          <span>
            {botList.every((bot) => bot.isActive)
              ? "Pause All Bots"
              : "Activate All Bots"}
          </span>
        </button>
      </div>
      <div className="bot-list-container">
        {loading ? (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SpinnerComponent />
          </div>
        ) : (
          botList.map((bot, index) => <ListItem key={index} bot={bot} setCategories={setCategories} categories={categories} />)
        )}
      </div>
    </>
  );
};

export default BotList;
