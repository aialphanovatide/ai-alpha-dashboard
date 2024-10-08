import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./index.css";
import DeleteItemModal from "src/views/DeleteItemModal";
import { HelpOutline } from "@mui/icons-material";
import CustomTooltip from "src/components/ToolTip";
import SpinnerComponent from "src/components/Spinner";
import ListItem from "./ListItem";
import NoData from "src/components/NoData";
import { toggleAllCategoriesState } from "src/services/categoryService";

const CategoryList = ({
  categories,
  toggleDrawer,
  selectedBots,
  setSelectedBots,
  setCategories,
}) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAllStatusSwitchToggle = async (e) => {
    const response = await toggleAllCategoriesState(isEveryCategoryActive);

    // if (response.success) {
    //   setIsItemActive(!isItemActive);
    // }
  };

  const isEveryCategoryActive = useMemo(
    () => categories.every((category) => category.isActive),
    [categories],
  );

  return (
    <>
      <div className="top-container">
        <DeleteItemModal
          categories={categories}
          bots={selectedBots}
          setCategories={setCategories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
        <div style={{ gridColumn: 2 }}></div>
        <button
          className="pause-btn"
          onClick={handleAllStatusSwitchToggle}
          disabled={loading}
        >
          <CustomTooltip
            content={
              "This row of buttons pauses or activates the bots' operation."
            }
          >
            <HelpOutline fontSize="small" />
          </CustomTooltip>
          <span>{isEveryCategoryActive ? "Pause All" : "Activate All"}</span>
        </button>
        {/* <button
          className="hide-btn"
          disabled={loading}
        >
          <CustomTooltip
            content={"This row of buttons shows or hides the app's elements."}
          >
            <HelpOutline fontSize="small" />
          </CustomTooltip>
          <span>{isEveryCategoryActive ? "Hide All" : "Activate All"}</span>
        </button> */}
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
        ) : categories ? (
          categories.map((category, index) => (
            <ListItem
              key={index}
              item={category}
              setSelectedCategories={setSelectedCategories}
              selectedCategories={selectedCategories}
              toggleDrawer={toggleDrawer}
              setSelectedBots={setSelectedBots}
              selectedBots={selectedBots}
              bots={category.coins}
              index={index}
            />
          ))
        ) : (
          <NoData />
        )}
      </div>
    </>
  );
};

export default CategoryList;
