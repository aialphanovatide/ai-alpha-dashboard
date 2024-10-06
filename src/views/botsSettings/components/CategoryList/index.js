import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./index.css";
import baseURL from "../../../../config";
import DeleteItemModal from "src/views/DeleteItemModal";
import { HelpOutline } from "@mui/icons-material";
import CustomTooltip from "src/components/ToolTip";
import SpinnerComponent from "src/components/Spinner";
import ListItem from "./ListItem";
import NoData from "src/components/NoData";

const CategoryList = ({
  categories,
  getAllCategories,
  toggleDrawer,
  selectedBots,
  setSelectedBots,
}) => {
  const [categoryList, setcategoryList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleCategoryState = async (index) => {
    if (categoryList && categoryList[index]) {
      const category = categoryList[index];
      const url = category.isActive
        ? `${baseURL.BOTS_V2_API}/deactivate_bot_by_id/${category.category}`
        : `${baseURL.BOTS_V2_API}/activate_bot_by_id/${category.category}`;

      try {
        const response = await fetch(url, { method: "POST" });
        if (response.ok) {
          const data = await response.json();

          const updatedCategories = [...categoryList];
          updatedCategories[index].isActive = !category.isActive;
          setcategoryList(updatedCategories);
        } else {
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.error("Bot or categoryList is undefined.");
    }
  };

  const updateCategoryState = useCallback(
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
          await getAllCategories();
        } else {
          console.error(
            `Error At ${
              url === "activate_bot" ? "TurnON" : "TurnOFF"
            } the category ${botCategory}:`,
            data.message,
          );
        }
      } catch (error) {
        console.error("Error during:", error);
      } finally {
        setLoading(false);
      }
    },
    [getAllCategories],
  );

  const turnOnAllCategories = useCallback(() => {
    setLoading(true);
    updateCategoryState(`${baseURL.BOTS_V2_API}/activate_all_categories`);
  }, [updateCategoryState]);

  const turnOffAllCategories = useCallback(() => {
    setLoading(true);
    updateCategoryState(`${baseURL.BOTS_V2_API}/deactivate_all_categories`);
  }, [updateCategoryState]);

  useEffect(() => {
    setcategoryList(categories);
  }, [categories]);

  const isEveryCategoryActive = useMemo(
    () => categoryList.every((category) => category.isActive),
    [categoryList],
  );

  return (
    <>
      <div className="top-container">
        <DeleteItemModal categories={selectedCategories} bots={selectedBots} />
        <div style={{ gridColumn: 2 }}></div>
        <button
          className="pause-btn"
          onClick={
            isEveryCategoryActive ? turnOffAllCategories : turnOnAllCategories
          }
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
        <button
          className="hide-btn"
          onClick={
            isEveryCategoryActive ? turnOffAllCategories : turnOnAllCategories
          }
          disabled={loading}
        >
          <CustomTooltip
            content={"This row of buttons shows or hides the app's elements."}
          >
            <HelpOutline fontSize="small" />
          </CustomTooltip>
          <span>{isEveryCategoryActive ? "Hide All" : "Activate All"}</span>
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
        ) : categoryList ? (
          categoryList.map((category, index) => (
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
