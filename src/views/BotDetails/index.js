import { cilArrowLeft, cilClock, cilSearch, cilSettings } from "@coreui/icons";
import * as ReactDOMServer from "react-dom/server";
import CIcon from "@coreui/icons-react";
import React, { useEffect, useState } from "react";
import { getBot, getBotLogs, toggleBotStatus } from "src/services/botService";
import Swal from "sweetalert2";
import defaultImg from "../../assets/brand/logo.png";
import { formatDateTime } from "src/utils";
import styles from "./index.module.css";
import SwitchButton from "src/components/commons/SwitchButton";
import SpinnerComponent from "src/components/Spinner";
import CustomTooltip from "src/components/CustomTooltip";
import { HelpOutline } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import AddIcon from "../../assets/icons/add.svg";
import CheckRepeatIcon from "../../assets/icons/checkRepeat.svg";
import TimeRepeatIcon from "../../assets/icons/timeRepeat.svg";
import ErrorList from "src/components/ErrorList";

const InfoDisplayItem = ({ icon, label, value, isImportedIcon }) => {
  return (
    <div className={styles.infoDisplayItem}>
      <div className="infoDisplayItem-label">
        {isImportedIcon ? (
          <img
            src={icon}
            alt="icon"
            style={{ height: 16 }}
            id="info-display-item-icon"
          />
        ) : (
          <CIcon icon={icon} size="md" />
        )}
        <span>{label}</span>
      </div>
      <span>
        <strong>{value || "-"}</strong>
      </span>
    </div>
  );
};

const returnToPreviousPage = () => {
  window.history.back();
};

const BotDetails = () => {
  const [bot, setBot] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const { bot_name } = useParams();
  const [logs, setLogs] = useState("");
  const [isToggleLoading, setIsToggleLoading] = useState(false);
  const [isItemActive, setIsItemActive] = useState(false);

  const fetchBotLogs = async (id) => {
    try {
      setIsFetching(true);
      const data = await getBotLogs(id);
      setLogs(data.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error fetching bot logs",
        text: error.message,
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleStatusSwitchToggle = async (e) => {
    setIsToggleLoading(true);
    try {
      const response = await toggleBotStatus(bot.id);
      if (response.success) {
        setIsItemActive(!isItemActive);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      let parsedError = JSON.parse(error.message);
      Swal.fire({
        title: parsedError.message || "Bot status couldn't be updated",
        icon: "error",
        customClass: "swal",
        backdrop: false,
        html: ReactDOMServer.renderToString(
          <ErrorList errorMessages={parsedError.validation_errors}/>,
        )
      });
    } finally {
      setIsToggleLoading(false);
    }
  };

  const fetchBotDetails = async () => {
    try {
      setIsFetching(true);
      const bot = await getBot(bot_name, "name");
      setBot(bot.data);
      setIsItemActive(bot.data.is_active);
      await fetchBotLogs(bot.data.id);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: error.message,
        backdrop: false,
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchBotDetails();
  }, []);

  return (
    <>
      {isFetching ? (
        <SpinnerComponent style={{ height: "100%" }} />
      ) : (
        <div className={styles.content}>
          <button onClick={returnToPreviousPage} className={styles.returnBtn}>
            <CIcon icon={cilArrowLeft} size="xl" />
          </button>
          <section className={styles.firstSection}>
            <div
              className={styles.imgContainer}
              style={
                bot?.background_color
                  ? {
                      backgroundColor: bot?.background_color?.includes("#")
                        ? bot?.background_color
                        : `#${bot?.background_color}`,
                    }
                  : null
              }
            >
              <img
                alt="item-icon"
                src={
                  bot?.icon ||
                  `https://aialphaicons.s3.us-east-2.amazonaws.com/${bot?.alias?.toLowerCase()}.svg`
                }
                onError={(e) => (e.target.src = defaultImg)}
              />
            </div>
            <div className={styles.botDetails}>
              <span className={styles.botName}>{bot?.name}</span>
              <span>{bot?.alias}</span>
              <span className={styles.lastRun}>
                Last Run: {formatDateTime(bot?.last_run_time) || "-"}
              </span>
            </div>
            <div className={styles.switchContainer}>
              <span
                className={styles.switchLabel}
                id="botDetails-switchContainer-span"
              >
                Status
              </span>
              <SwitchButton
                isActive={isItemActive}
                handleClick={handleStatusSwitchToggle}
                isLoading={isToggleLoading}
                styles={{
                  backgroundColor: isItemActive ? "#2DDA99" : "",
                  marginBlock: 5,
                }}
              />
            </div>
            <div className={styles.statusContainer}>
              <div
                className={styles.statusDot}
                style={{ background: isItemActive ? "#2DDA99" : "#A3A3A3" }}
              ></div>
              <span className={styles.statusLabel}>
                {isItemActive ? "Active" : "Idle"}
              </span>
            </div>
            <span className={styles.lastRun}>
              Last Run: {bot?.last_run_status === "active" ? "Active" : "Idle"}
            </span>
          </section>
          <section className={styles.secondSection}>
            <InfoDisplayItem icon={cilSearch} label="ID" value={bot?.id} />
            <InfoDisplayItem
              icon={cilSettings}
              label="Created at"
              value={formatDateTime(bot?.created_at)}
            />
            <InfoDisplayItem
              icon={CheckRepeatIcon}
              isImportedIcon
              label="Updated at"
              value={formatDateTime(bot?.updated_at)}
            />
            <InfoDisplayItem
              icon={cilClock}
              label="Next Run Time"
              value={formatDateTime(bot?.next_run_time)}
            />
            <InfoDisplayItem
              icon={AddIcon}
              isImportedIcon
              label="Run Count"
              value={bot?.run_count}
            />
            <InfoDisplayItem
              isImportedIcon
              icon={TimeRepeatIcon}
              label="Run Frequency"
              value={bot?.run_frequency}
            />
          </section>
          <section className={styles.thirdSection}>
            <div className={styles.promptContainer}>
              <div className={styles.text}>
                <span>News Prompt</span>
                {/* <CustomTooltip title="" content="">
                  <HelpOutline fontSize="small" />
                </CustomTooltip> */}
              </div>
              <div className={styles.prompt} id="bot-detail-prompt">
                <div>
                  <p>{bot?.prompt}</p>
                </div>
              </div>
            </div>
            <div className={styles.promptContainer}>
              <div className={styles.text}>
                <span>DALL-E Prompt</span>
                {/* <CustomTooltip title="" content="">
                  <HelpOutline fontSize="small" />
                </CustomTooltip> */}
              </div>
              <div className={styles.prompt} id="bot-detail-prompt">
                <div>
                  <p>{bot?.dalle_prompt}</p>
                </div>
              </div>
            </div>
          </section>
          <section className={styles.fourthSection}>
            <div className={styles.logsContainer}>
              <div className={styles.text}>
                <span>Logs</span>
                {/* <CustomTooltip title="" content="">
                  <HelpOutline fontSize="small" />
                </CustomTooltip> */}
              </div>
              <div className={styles.logs}>
                <div>
                  <p>{logs}</p>
                </div>
              </div>
            </div>
          </section>
          <section className={styles.thirdSection}>
            <div className={styles.promptContainer}>
              <div className={styles.text}>
                <span>Whitelist keywords</span>
              </div>
              <div className={styles.keywordsSubcontainer} id="bot-detail-prompt">
                <div >
                {bot?.keywords?.map((keyword, index) => (
                    <div
                    className={styles.keyword}
                    key={index}
                    id="botform-whitelist-keyword"
                  >
                    <span>{keyword}</span>
                  </div>
                  ))}
                  </div>
              </div>
            </div>
            <div className={styles.promptContainer}>
              <div className={styles.text}>
                <span>Blacklist Keywords</span>
              </div>
              <div className={styles.keywordsSubcontainer} id="bot-detail-prompt">
                <div>
                  {bot?.blacklist?.map((keyword, index) => (
                    <div
                    className={styles.keyword}
                    key={index}
                    id="botform-whitelist-keyword"
                  >
                    <span>{keyword}</span>
                  </div>
                  ))}
                  </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default BotDetails;
