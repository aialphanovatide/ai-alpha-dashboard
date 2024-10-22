import React, { useEffect, useState } from "react";
import "./index.css";
import CustomTooltip from "src/components/CustomTooltip";
import CIcon from "@coreui/icons-react";
import { cilPen } from "@coreui/icons";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { capitalizeFirstLetter, formatDateTime } from "src/utils";
import NewCategoryForm from "../../NewCategoryForm";
import BotForm from "../../BotForm";
import SwitchButton from "src/components/commons/SwitchButton";
import defaultImg from "../../../../../assets/brand/logo.png";
import { toggleCategoryState } from "src/services/categoryService";
import Swal from "sweetalert2";
import { toggleCoinStatus } from "src/services/coinService";

const ListItem = (params) => {
  const {
    item,
    setSelectedCategories,
    selectedCategories = [],
    toggleDrawer,
    isCoin = false,
    selectedCoins = [],
    setSelectedCoins,
    updateCategoryState,
    isCategoryActive,
  } = params;
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryChecked, setCategoryChecked] = useState(false);
  const [isBotChecked, setBotChecked] = useState(false);
  const [isItemActive, setIsItemActive] = useState(false);
  const [isToggleLoading, setIsToggleLoading] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    setIsItemActive(item.is_active);
    isCoin && setIsItemActive(isCategoryActive);
  }, [item.is_active, isCategoryActive]);

  useEffect(() => {
    if (selectedCategories.length === 0) setCategoryChecked(false);
  }, [selectedCategories]);

  const onCategoryCheck = (e) => {
    const checkedCategory = JSON.parse(e.target.value);

    if (isCategoryChecked) {
      setSelectedCategories(
        selectedCategories.filter(
          (category) => category.category_id !== checkedCategory.category_id,
        ),
      );
    } else {
      setSelectedCategories([...selectedCategories, checkedCategory]);
    }

    setCategoryChecked(!isCategoryChecked);
  };

  const onBotCheck = (e) => {
    const checkedBot = JSON.parse(e.target.value);

    if (isBotChecked) {
      setSelectedCoins(selectedCoins.filter((bot) => bot.id !== checkedBot.id));
    } else {
      setSelectedCoins([...selectedCoins, checkedBot]);
    }

    setBotChecked(!isBotChecked);
  };

  const handleStatusSwitchToggle = async (e) => {
    setIsToggleLoading(true);

    // const response = isCoin
    //   ? await toggleCoinStatus(item.bot_id)
    //   : await toggleCategoryState(item.category_id, isItemActive);

    // if (response.success) {
      setIsItemActive(!isItemActive);
      !isCoin && updateCategoryState(item.category_id, !isItemActive);
    // } else {
    //   Swal.fire({ text: response.error, icon: "error", customClass: "swal" });
    // }

    setIsToggleLoading(false);
  };

  return (
    <>
      <div
        className={`item ${
          isCategoryChecked || isBotChecked ? "checked" : ""
        } ${isCoin ? "bot" : ""}`}
      >
        <div className="item-input">
          <CustomTooltip
            content={"Elements of different types cannot be selected."}
            isError={true}
            hide={
              isCoin
                ? !(selectedCategories.length > 0)
                : !(selectedCoins.length > 0)
            }
          >
            <input
              type="checkbox"
              checked={isCoin ? isBotChecked : isCategoryChecked}
              onChange={isCoin ? onBotCheck : onCategoryCheck}
              value={JSON.stringify(item)}
              disabled={
                isCoin ? selectedCategories.length > 0 : selectedCoins.length > 0
              }
            />
          </CustomTooltip>
        </div>
        <div
          className="img-container"
          style={{
            borderRadius: "50%",
            border: "2px solid",
            borderColor: item.border_color ? item.border_color : "gray",
          }}
        >
          <img
            alt={`${isCoin ? "bot" : "category"}-img`}
            src={
              isCoin
                ? `https://aialphaicons.s3.us-east-2.amazonaws.com/coins/${item.name?.toLowerCase()}.png`
                : `https://aialphaicons.s3.us-east-2.amazonaws.com/${
                    item.alias || item.name
                  }.svg`
            }
            onError={(e) => (e.target.src = defaultImg)}
          />
        </div>
        <div className="item-details">
          <div className="item-name">
            {item.name || item.alias || (isCoin ? "Bot name" : "Category name")}
          </div>
          <div>
            {capitalizeFirstLetter(
              item.alias ||
                item.name ||
                (isCoin ? "Bot alias" : "Category alias"),
            )}
          </div>
          {isCoin && (
            <div className="item-last-run">
              Last Run: {formatDateTime(item.updated_at)}
            </div>
          )}
        </div>
        <button
          className="edit-btn"
          onClick={toggleDrawer(
            true,
            isCoin ? (
              <BotForm bot={item} />
            ) : (
              <NewCategoryForm category={item} />
            ),
            "right",
          )}
        >
          <CIcon icon={cilPen} />
          {"  "}
          Edit
        </button>
        <CustomTooltip
          content={
            "Information is missing. Please check Fundamentals, Charts, and News."
          }
          isError={true}
          hide={true}
        >
          <div style={{ gridColumn: 5, height: "fit-content" }}>
            <SwitchButton
              isActive={isItemActive}
              handleClick={handleStatusSwitchToggle}
              isLoading={isToggleLoading}
              isDisabled={isCoin && !isCategoryActive}
            />
          </div>
        </CustomTooltip>
        {/* <div
          style={{ gridColumn: 6, height: "fit-content" }}
          // onClick={() => toggleState(index)}
        >
          <SwitchButton isActive={item.isActive} isAppsSwitch={true} />
        </div> */}
        {!isBot && (
          <button
            onClick={toggleOpen}
            className="chevron-button"
            style={{
              visibility: item.coins?.length > 0 ? "visible" : "hidden",
            }}
          >
            {isOpen ? (
              <ExpandLessIcon color="inherit" fontSize="inherit" />
            ) : (
              <ExpandMoreIcon color="inherit" fontSize="inherit" />
            )}
          </button>
        )}
      </div>
      {isOpen && item.coins && (
        <div>
          {item.coins.map((bot, index) => (
            <ListItem
              key={index}
              item={bot}
              toggleDrawer={toggleDrawer}
              isCoin={true}
              selectedCoins={selectedCoins}
              setSelectedCoins={setSelectedCoins}
              selectedCategories={selectedCategories}
              updateCategoryState={updateCategoryState}
              isCategoryActive={!isCoin && item.is_active}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ListItem;
