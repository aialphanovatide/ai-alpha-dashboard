import React, { useEffect, useState, useCallback } from "react";
import "./index.css";
import AddWordsModal from "../addWordsModal/AddWordsModal";
import DeleteWordsModal from "../deleteWordsModal/DeleteWordsModal";
import DeleteBlacklistWordsModal from "../deleteBlacklistWordsModal/DeleteBlacklistWordsModal";
import UsedKeywordsModal from "../usedKeywordsModal/UsedKeywordsModal";
import CreateBotModal from "../createBotModal/CreateBotModal";
import CreateCategoryModal from "../createCategoryModal/CreateCategoryModal";
import AddBlacklistWordsModal from "../addBlacklistWordsModal/AddBlacklistWordsModal";
import CIcon from "@coreui/icons-react";
import { ReactComponent as OpenLock } from "../../assets/icons/openLock.svg";
import { ReactComponent as ClosedLock } from "../../assets/icons/closedLock.svg";
import { cilMinus, cilPencil, cilPlus, cilSitemap } from "@coreui/icons";
import DrawerComponent from "./components/Drawer";
import CategoryList from "./components/CategoryList";
import TresholdEdit from "./components/TresholdEdit";
import NewCategoryForm from "./components/NewCategoryForm";
import NewBotForm from "./components/NewBotForm";
import WhiteList from "./components/WhiteList";
import BlackList from "./components/BlackList";
import config from "src/config";
import SpinnerComponent from "src/components/Spinner";

const BotsSettings = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [drawerChildren, setDrawerChildren] = useState(<></>);
  const [drawerAnchor, setDrawerAnchor] = useState("right");
  const [selectedBots, setSelectedBots] = useState([]);

  const getAllCategories = useCallback(async () => {
    try {
      let headersList = {
        "X-API-Key": config.X_API_KEY,
        Accept: "application/json",
      };

      let response = await fetch(`${config.BASE_URL}/categories`, {
        method: "GET",
        headers: headersList,
      });

      let responseText = await response.text();

      try {
        const data = JSON.parse(responseText);
        if (data && data.categories) {
          setBots(data.categories);
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

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  const toggleDrawer = (newOpen, view, anchor) => () => {
    view && setDrawerChildren(view);
    anchor && setDrawerAnchor(anchor);
    setOpen(newOpen);
  };

  return (
    <div className="bot-settings-container">
      <h2>
        <CIcon icon={cilSitemap} size="3xl" />
        News Bot settings
      </h2>
      <div className="settings-container">
        <div className="treshold" style={{ width: "15%" }}>
          <span>Treshold</span>
          <div>
            <button onClick={toggleDrawer(true, <TresholdEdit />, "right")}>
              <CIcon icon={cilPencil} size="sm" /> Edit
            </button>
          </div>
        </div>
        <div className="create" style={{ width: "30%" }}>
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
            <button onClick={toggleDrawer(true, <NewCategoryForm />, "right")}>
              <CIcon icon={cilPlus} /> New Category
            </button>
            <button onClick={toggleDrawer(true, <NewBotForm />, "right")}>
              <CIcon icon={cilPlus} /> New Coin/Bot
            </button>
          </div>
        </div>
        <div
          className="keywords"
          style={{
            width: "40%",
            color: selectedBots[0] ? "black" : "#a3a3a3",
            borderColor: selectedBots[0] ? "black" : "#a3a3a3",
          }}
        >
          <span>Keywords</span>
          <div>
            <div>
              <span>
                <OpenLock /> Whitelist
              </span>
              <div>
                <button
                  onClick={toggleDrawer(true, <WhiteList />, "bottom")}
                  disabled={!selectedBots[0]}
                >
                  <CIcon icon={cilPlus} /> Add
                </button>
                <button
                  onClick={toggleDrawer(true, <WhiteList isRemove />, "bottom")}
                  disabled={!selectedBots[0]}
                >
                  <CIcon icon={cilMinus} /> Remove
                </button>
              </div>
            </div>
            <div>
              <span>
                <ClosedLock /> Blacklist
              </span>
              <div>
                <button
                  onClick={toggleDrawer(true, <BlackList />, "bottom")}
                  disabled={!selectedBots[0]}
                >
                  <CIcon icon={cilPlus} /> Add
                </button>
                <button
                  onClick={toggleDrawer(true, <BlackList isRemove />, "bottom")}
                  disabled={!selectedBots[0]}
                >
                  <CIcon icon={cilMinus} /> Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: "70%" }}>
        {loading ? (
          <SpinnerComponent />
        ) : (
          <CategoryList
            categories={bots}
            getAllCategories={getAllCategories}
            toggleDrawer={toggleDrawer}
            selectedBots={selectedBots}
            setSelectedBots={setSelectedBots}
          />
        )}
      </div>
      <DrawerComponent
        toggleDrawer={toggleDrawer}
        open={open}
        anchor={drawerAnchor}
        className="draweer"
      >
        {drawerChildren}
      </DrawerComponent>

      {/* <div className="actionmain">
        <h4 className="actionsTitle">Actions</h4>
        <div className="actionsSubMain">
          <CreateCategoryModal />
          <DeleteItemModal />
          <CreateBotModal />
          <AddWordsModal />
          <DeleteWordsModal />
          <AddBlacklistWordsModal />
          <DeleteBlacklistWordsModal />
          <UsedKeywordsModal />
        </div>
      </div>  */}
    </div>
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
          <DeleteItemModal />
          <CreateBotModal />
          <AddWordsModal />
          <DeleteWordsModal />
          <AddBlacklistWordsModal />
          <DeleteBlacklistWordsModal />
          <UsedKeywordsModal />
        </div>
      </div> */
}
