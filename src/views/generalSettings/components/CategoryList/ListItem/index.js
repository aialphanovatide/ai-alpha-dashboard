import React, { useEffect, useState } from "react";
import "./index.css";
import * as ReactDOMServer from "react-dom/server";
import CustomTooltip from "src/components/CustomTooltip";
import CIcon from "@coreui/icons-react";
import { cilPen } from "@coreui/icons";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { formatDateTime } from "src/utils";
import CategoryForm from "../../CategoryForm";
import BotForm from "../../BotForm";
import SwitchButton from "src/components/commons/SwitchButton";
import defaultImg from "../../../../../assets/brand/logo.png";
import Swal from "sweetalert2";
import { toggleCoinStatus } from "src/services/coinService";
import ErrorList from "src/components/ErrorList";
import { useNavigate } from "react-router-dom";
import { toggleCategoryState } from "src/services/categoryService";

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
    setCategories,
    isCategoryActive,
  } = params;
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryChecked, setCategoryChecked] = useState(false);
  const [isBotChecked, setBotChecked] = useState(false);
  const [isItemActive, setIsItemActive] = useState(false);
  const [isToggleLoading, setIsToggleLoading] = useState(false);
  const navigate = useNavigate();

  const goToBotDetails = (bot_name) => {
    navigate(`/botdetails/${bot_name}`);
  };

  const toggleOpen = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsItemActive(item.is_active);
  }, [item.is_active]);

  useEffect(() => {
    if (selectedCategories.length === 0) setCategoryChecked(false);
    if (selectedCoins.length === 0) setBotChecked(false);
  }, [selectedCategories, selectedCoins]);

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
      setSelectedCoins(
        selectedCoins.filter((bot) => bot.bot_id !== checkedBot.bot_id),
      );
    } else {
      setSelectedCoins([...selectedCoins, checkedBot]);
    }

    setBotChecked(!isBotChecked);
  };

  const handleStatusSwitchToggle = async (e) => {
    setIsToggleLoading(true);
    try {
      if (isCoin) {
        const response = await toggleCoinStatus(item.bot_id);
        if (response.success) {
          setIsItemActive(!isItemActive);
        } else {
          throw new Error(response.error);
        }
      } else {
        const response = await toggleCategoryState(item.category_id);

        if (!response.success) {
          throw new Error(response.error);
        }

        setIsItemActive(!isItemActive);
      }
    } catch (error) {
      Swal.fire({
        title: `${isCoin ? "Coin" : "Category"} activation failed`,
        icon: "error",
        customClass: "swal",
        backdrop: false,
        text: error.message,
      });
    } finally {
      setIsToggleLoading(false);
    }
  };

  return (
    <>
      <div
        className={`item ${
          isCategoryChecked || isBotChecked ? "checked" : ""
        } ${isCoin ? "bot" : item.coins?.length > 0 ? "clickable" : ""}`}
        onClick={!isCoin && item.coins?.length > 0 ? toggleOpen : null}
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
                isCoin
                  ? selectedCategories.length > 0
                  : selectedCoins.length > 0
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
              item.icon ||
              `https://aialphaicons.s3.us-east-2.amazonaws.com/${item.alias?.toLowerCase()}.svg`
            }
            onError={(e) => (e.target.src = defaultImg)}
          />
        </div>
        <div
          className={`item-details ${isCoin ? "bot" : ""}`}
          onClick={isCoin ? () => goToBotDetails(item.name) : null}
        >
          <div className="item-name">
            {item.name || (isCoin ? "Bot name" : "Category name")}
          </div>
          <div>{item.alias || (isCoin ? "Bot alias" : "Category alias")}</div>
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
              <BotForm coin={item} setCategories={setCategories} />
            ) : (
              <CategoryForm category={item} setCategories={setCategories} />
            ),
            "right",
          )}
        >
          <CIcon icon={cilPen} />
          {"  "}
          Edit
        </button>
        {(!isCoin && item.coins.length !== 0) || isCoin ? (
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
                isDisabled={(isCoin && !isCategoryActive) || isToggleLoading}
              />
            </div>
          </CustomTooltip>
        ) : null}
        {!isCoin && (
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
      {isOpen && item.coins?.length > 0 && (
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
              isCategoryActive={!isCoin && isItemActive}
              setCategories={setCategories}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ListItem;
