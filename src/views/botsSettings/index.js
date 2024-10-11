import React, { useCallback, useEffect, useState } from "react";
import "./index.css";
import CIcon from "@coreui/icons-react";
import { ReactComponent as OpenLock } from "../../assets/icons/openLock.svg";
import { ReactComponent as ClosedLock } from "../../assets/icons/closedLock.svg";
import { cilMinus, cilPencil, cilPlus, cilSitemap } from "@coreui/icons";
import DrawerComponent from "./components/Drawer";
import CategoryList from "./components/CategoryList";
import TresholdEdit from "./components/TresholdEdit";
import NewCategoryForm from "./components/NewCategoryForm";
import BotForm from "./components/BotForm";
import WhiteList from "./components/WhiteList";
import BlackList from "./components/BlackList";
import SpinnerComponent from "src/components/Spinner";
import NoData from "src/components/NoData";
import { getCategories } from "src/services/categoryService";

const BotsSettings = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [drawerChildren, setDrawerChildren] = useState(<></>);
  const [drawerAnchor, setDrawerAnchor] = useState("right");
  const [selectedBots, setSelectedBots] = useState([]);
  const [error, setError] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const categories = await getCategories();
      setCategories(categories);
    } catch (err) {
      setError(err.message || "Error fetching categories");
    }
    setLoading(false);
  }, [setCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
        <div className="create" style={{ width: "35%" }}>
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
            <button onClick={toggleDrawer(true, <NewCategoryForm setCategories={setCategories} />, "right")}>
              <CIcon icon={cilPlus} /> New Category
            </button>
            <button onClick={toggleDrawer(true, <BotForm />, "right")}>
              <CIcon icon={cilPlus} /> New Coin/Bot
            </button>
          </div>
        </div>
        <div
          className={`keywords ${selectedBots[0] ? "" : "disabled"}`}
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
          <SpinnerComponent style={{ height: "100%" }} />
        ) : categories ? (
          <CategoryList
            categories={categories}
            toggleDrawer={toggleDrawer}
            selectedBots={selectedBots}
            setSelectedBots={setSelectedBots}
            setCategories={setCategories}
          />
        ) : (
          <NoData message={error} />
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
    </div>
  );
};

export default BotsSettings;
