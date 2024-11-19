import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./index.css";
import DeleteItemModal from "src/views/DeleteItemModal";
import { HelpOutline } from "@mui/icons-material";
import CustomTooltip from "src/components/CustomTooltip";
import SpinnerComponent from "src/components/Spinner";
import ListItem from "./ListItem";
import NoData from "src/components/NoData";

const CategoryList = ({
  categories,
  toggleDrawer,
  selectedCoins,
  setSelectedCoins,
  setCategories,
}) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const updateCategoryState = (categoryId, isActive) => {
    setCategories(prevCategories =>
      prevCategories.map(category =>
        category.category_id === categoryId
          ? { ...category, is_active: isActive }
          : category
      )
    );
  };

  return (
    <>
      <div className="top-container">
        <DeleteItemModal
          categories={categories}
          selectedCoins={selectedCoins}
          setSelectedCoins={setSelectedCoins}
          setCategories={setCategories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
        <div style={{ gridColumn: 2 }}></div>
        {/* <button
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
        </button> */}
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
              setSelectedCoins={setSelectedCoins}
              selectedCoins={selectedCoins}
              bots={category.coins}
              index={index}
              updateCategoryState={updateCategoryState}
              setCategories={setCategories}
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
