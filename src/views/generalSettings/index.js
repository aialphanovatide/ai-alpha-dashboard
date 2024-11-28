import React, { useCallback, useEffect, useState } from "react";
import "./index.css";
import CIcon from "@coreui/icons-react";
import { ReactComponent as OpenLock } from "../../assets/icons/openLock.svg";
import { ReactComponent as ClosedLock } from "../../assets/icons/closedLock.svg";
import { cilMinus, cilPencil, cilPlus, cilSitemap } from "@coreui/icons";
import DrawerComponent from "./components/Drawer";
import CategoryList from "./components/CategoryList";
import TresholdEdit from "./components/TresholdEdit";
import CategoryForm from "./components/CategoryForm";
import BotForm from "./components/BotForm";
import KeywordsSettings from "./components/KeywordsSettings";
import SpinnerComponent from "src/components/Spinner";
import NoData from "src/components/NoData";
import { getCategories } from "src/services/categoryService";

const GeneralSettings = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [drawerChildren, setDrawerChildren] = useState(<></>);
  const [drawerAnchor, setDrawerAnchor] = useState("right");
  const [selectedCoins, setSelectedCoins] = useState([]);
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
        General settings
      </h2>
      <div className="settings-container">
        {/* <div className="treshold" style={{ width: "15%" }}>
          <span>Treshold</span>
          <div>
            <button onClick={toggleDrawer(true, <TresholdEdit />, "right")}>
              <CIcon icon={cilPencil} size="sm" /> Edit
            </button>
          </div>
        </div> */}
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
            <button
              onClick={toggleDrawer(
                true,
                <CategoryForm setCategories={setCategories} />,
                "right",
              )}
            >
              <CIcon icon={cilPlus} /> New Category
            </button>
            <button
              onClick={toggleDrawer(
                true,
                <BotForm setCategories={setCategories} />,
                "right",
              )}
            >
              <CIcon icon={cilPlus} /> New Coin/Bot
            </button>
          </div>
        </div>
        <div className={`keywords ${selectedCoins[0] ? "" : "disabled"}`}>
          <span>Keywords</span>
          <div>
            <div>
              <span>
                <OpenLock /> Whitelist
              </span>
              <div>
                <button
                  onClick={toggleDrawer(
                    true,
                    <KeywordsSettings coins={selectedCoins} />,
                    "bottom",
                  )}
                  disabled={!selectedCoins[0]}
                >
                  <CIcon icon={cilPlus} /> Add
                </button>
                <button
                  onClick={toggleDrawer(
                    true,
                    <KeywordsSettings coins={selectedCoins} isRemove={true} />,
                    "bottom",
                  )}
                  disabled={!selectedCoins[0]}
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
                  onClick={toggleDrawer(
                    true,
                    <KeywordsSettings
                      isBlacklist={true}
                      coins={selectedCoins}
                    />,
                    "bottom",
                  )}
                  disabled={!selectedCoins[0]}
                >
                  <CIcon icon={cilPlus} /> Add
                </button>
                <button
                  onClick={toggleDrawer(
                    true,
                    <KeywordsSettings
                      isBlacklist={true}
                      coins={selectedCoins}
                      isRemove={true}
                    />,
                    "bottom",
                  )}
                  disabled={!selectedCoins[0]}
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
            selectedCoins={selectedCoins}
            setSelectedCoins={setSelectedCoins}
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

export default GeneralSettings;
