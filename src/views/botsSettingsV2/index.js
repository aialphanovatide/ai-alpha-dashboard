import React, { useEffect, useState, useCallback } from "react";
import "./index.css";
import { CButton, CButtonGroup } from "@coreui/react";
import BotList from "./components/BotList";
import AddWordsModal from "../addWordsModal/AddWordsModal";
import DeleteWordsModal from "../deleteWordsModal/DeleteWordsModal";
import DeleteBlacklistWordsModal from "../deleteBlacklistWordsModal/DeleteBlacklistWordsModal";
import config from "../../config";
import UsedKeywordsModal from "../usedKeywordsModal/UsedKeywordsModal";
import CreateBotModal from "../createBotModal/CreateBotModal";
import CreateCategoryModal from "../createCategoryModal/CreateCategoryModal";
import AddBlacklistWordsModal from "../addBlacklistWordsModal/AddBlacklistWordsModal";
import DeleteCategoryModal from "../deleteCategoryModal/DeleteCategoryModal";
import DrawerComponent from "./components/Drawer";
import CIcon from "@coreui/icons-react";
import {
  cilLockLocked,
  cilLockUnlocked,
  cilMinus,
  cilPencil,
  cilPlus,
  cilTrash,
} from "@coreui/icons";

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

  const getAllBots = useCallback(async () => {
    try {
      const response = await fetch(`${config.BOTS_V2_API}/get_all_bots`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const responseText = await response.text();
      console.log("responseText : ", responseText);

      try {
        const data = JSON.parse(responseText);
        console.log("data : ", data);
        if (data && data.data) {
          setBots(data.data);
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
    updateBotState(`${config.BOTS_V2_API}/activate_all_categories`);
  }, [updateBotState]);

  const turnOffAllBots = useCallback(() => {
    setLoading(true);
    updateBotState(`${config.BOTS_V2_API}/deactivate_all_categories`);
  }, [updateBotState]);

  useEffect(() => {
    getAllBots();
  }, [getAllBots]);

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <div className="bot-settings-container">
      <h2>Bot settings</h2>
      <div className="settings-container">
        <div
          className="treshold"
          style={{ width: "15%" }}
          onClick={toggleDrawer(true)}
        >
          <span>Treshold</span>
          <div>
            <button>
              <CIcon icon={cilPencil} size="sm" /> Edit
            </button>
          </div>
        </div>
        <div className="create" style={{ width: "40%" }}>
          <span>Create</span>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-evenly",
              gap: 3,
              alignItems: "center",
            }}
          >
            <button>
              <CIcon icon={cilPlus} /> New Category
            </button>
            <button>
              <CIcon icon={cilPlus} /> New Bot
            </button>
            <button>
              <CIcon icon={cilPlus} /> New Coin
            </button>
          </div>
        </div>
        <div className="keywords" style={{ width: "40%" }}>
          <span>Keywords</span>
          <div>
            <div>
              <span>
                <CIcon icon={cilLockUnlocked} />{" "}
                Whitelist
              </span>
              <div>
                <button>
                  <CIcon icon={cilPlus} /> Add
                </button>
                <button>
                  <CIcon icon={cilMinus} /> Remove
                </button>
              </div>
            </div>
            <div>
              <span>
                <CIcon icon={cilLockLocked} />{" "}
                Blacklist
              </span>
              <div>
                <button>
                  <CIcon icon={cilPlus} /> Add
                </button>
                <button>
                  <CIcon icon={cilMinus} /> Remove
                </button>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
      <div style={{ height: "70%" }}>{/* <BotList bots={bots} /> */}</div>
      <DrawerComponent toggleDrawer={toggleDrawer} open={open}>
        <span>hola</span>
      </DrawerComponent>
    </div>

    // <div>
    //   <CIcon icon={cilTrash}/>
    //   <h3>Are you sure you want to delete these elements?</h3>
    //   <div></div>
    //   <span>This action cannot be undone.</span>
    //   <div>
    //     <button>Cancel</button>
    //     <button>Delete</button>
    //   </div>
    // </div>
  );
};

export default BotsSettings;

{
  /* <CButtonGroup className="mb-2 btn-group-main">
        <div className="d-flex align-items-center main-button">
          <CButton
            className={`btn ${
              bots.every((bot) => bot.isActive) ? "btn-danger" : "btn-success"
            } bot-btn`}
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
          <CreateCategoryModal />
          <DeleteCategoryModal />
          <CreateBotModal />
          <AddWordsModal />
          <DeleteWordsModal />
          <AddBlacklistWordsModal />
          <DeleteBlacklistWordsModal />
          <UsedKeywordsModal />
        </div>
      </div> */
}
