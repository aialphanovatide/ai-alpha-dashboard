import React, { useEffect, useState, useCallback } from "react";
import "../botsSettings/bs.css";
import { CButton, CButtonGroup } from "@coreui/react";
import AddWordsModal from "../addWordsModal/AddWordsModal";
import DeleteWordsModal from "../deleteWordsModal/DeleteWordsModal";
import AddSitesModal from "../addSitesModal/AddSitesModal";
import config from "../../config";
import DeleteSitesModal from "../deleteSitesModal/DeleteSitesModal";
import BotList from "./botList";
import UsedKeywordsModal from "../usedKeywordsModal/UsedKeywordsModal";
import CreateBotModal from "../createBotModal/CreateBotModal";

const SpinnerComponent = () => {
  return (
    <div className="spinnergnral">
      <span
        className="spinner-border spinner-border-sm"
        aria-hidden="true"
      ></span>
    </div>
  );
};

const BotsSettings = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(false);

  // get all the botss
  const getAllBots = useCallback(async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/get_all_bots`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const responseText = await response.text();

      try {
        const data = JSON.parse(responseText);
        console.log("Data:", data);

        if (data && data.bots) {
          setBots(data.bots);
        } else {
          console.error("Error in response:", data.message);
        }
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

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
    updateBotState(`${config.BASE_URL}/activate_all_bots`);
  }, [updateBotState]);

  const turnOffAllBots = useCallback(() => {
    setLoading(true);
    updateBotState(`${config.BASE_URL}/deactivate_all_bots`);
  }, [updateBotState]);

  // Loads bots
  useEffect(() => {
    getAllBots();
  }, [getAllBots]);

  return (
    <div className="botsettingsMain">
      <h3 className="botsTitle">Bot settings</h3>
      <BotList bots={bots} />
      <CButtonGroup className="mb-2 btn-group-main">
        <div className="d-flex align-items-center main-button">
          <CButton
            className={`btn ${
              bots.every((bot) => bot.isActive) ? "btn-danger" : "btn-success"
            }
                bot-btn`}
            onClick={
              loading
                ? null
                : bots.every((bot) => bot.isActive)
                  ? turnOffAllBots
                  : turnOnAllBots
            }
          >
            {bots.every((bot) => bot.isActive)
              ? "Turn off all bots"
              : "Turn on all bots"}
          </CButton>
        </div>
        {loading && <SpinnerComponent />}
      </CButtonGroup>

      <div className="actionmain">
        <h4 className="actionsTitle">Actions</h4>
        <div className="actionsSubMain">
          <CreateBotModal />
          <AddWordsModal />
          <DeleteWordsModal />
          <AddSitesModal />
          <DeleteSitesModal />
          <UsedKeywordsModal />
        </div>
      </div>
    </div>
  );
};

export default BotsSettings;
