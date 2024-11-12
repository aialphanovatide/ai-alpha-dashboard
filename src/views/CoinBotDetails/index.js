import { cilClock, cilSearch, cilSettings, cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { getBot } from "src/services/botService";
import Swal from "sweetalert2";
import defaultImg from "../../assets/brand/logo.png";
import { formatDateTime } from "src/utils";
import styles from "./index.module.css";
import SwitchButton from "src/components/commons/SwitchButton";
import SpinnerComponent from "src/components/Spinner";
import CustomTooltip from "src/components/CustomTooltip";
import { HelpOutline } from "@mui/icons-material";

const InfoDisplayItem = ({ icon, label, value }) => {
  return (
    <div className={styles.infoDisplayItem}>
      <div>
        <CIcon icon={icon} size="md" />
        <span>{label}</span>
      </div>
      <span>
        <strong>{value || "-"}</strong>
      </span>
    </div>
  );
};

const CoinBotDetails = ({ isVisible, setIsVisible, coin }) => {
  const [bot, setBot] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  // coin
  // {
  //   "alias": "aliass",
  //   "background_color": "f5f5",
  //   "bot_id": 35,
  //   "category_id": 14,
  //   "created_at": "Thu, 25 Jan 2024 18:34:17 GMT",
  //   "gecko_id": "fetch-ai",
  //   "icon": null,
  //   "is_active": false,
  //   "name": "Fet",
  //   "symbol": "FET",
  //   "updated_at": "Wed, 06 Nov 2024 05:29:07 GMT"
  // }

  // bot
  //   {
  //     "alias": "aliass",
  //     "background_color": "f5f5",
  //     "blacklist": [],
  //     "category_id": 14,
  //     "created_at": null,
  //     "dalle_prompt": "dalle prompt",
  //     "icon": "https://aialphaicons.s3.us-east-2.amazonaws.com/aliass.svg",
  //     "id": 35,
  //     "is_active": false,
  //     "keywords": []
  //     "last_run_status": null,
  //     "last_run_time": null,
  //     "name": "Fet",
  //     "next_run_time": null,
  //     "prompt": "news prompt",
  //     "run_count": null,
  //     "run_frequency": "24",
  //     "site": {
  //         "bot_id": 35,
  //         "created_at": null,
  //         "id": 496,
  //         "name": "Google News",
  //         "updated_at": null,
  //         "url": "https://news.google.com/search?q=Render%20RNDR%20%22Render%22%20%22RNDR%22%20when%3A1d%20-MSN%20-medium%20-yahoo&hl=en-US&gl=US&ceid=US%3Aen"
  //     },
  //     "status": null,
  //     "updated_at": "Wed, 06 Nov 2024 05:29:08 GMT"
  // }

  const fetchBotDetails = async () => {
    try {
      setIsFetching(true);
      const bot = await getBot(coin.name, "name");
      setBot(bot.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: error.message,
      });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    isVisible && fetchBotDetails();
  }, [isVisible]);

  return (
    <Modal
      show={isVisible}
      onHide={() => setIsVisible(false)}
      className={styles.modal}
    >
      <button onClick={() => setIsVisible(false)} className={styles.closeBtn}>
        <CIcon icon={cilX} size="xl" />
      </button>
      {isFetching ? (
        <SpinnerComponent style={{ height: "100%" }} />
      ) : (
        <div className={styles.content}>
          <section className={styles.firstSection}>
            <div
              style={{
                borderRadius: "50%",
                border: "2px solid",
                backgroundColor: coin.background_color
                  ? `#${coin.background_color}`
                  : "gray",
              }}
            >
              <img
                alt="item-icon"
                src={
                  coin.icon ||
                  `https://aialphaicons.s3.us-east-2.amazonaws.com/coins/${coin.name?.toLowerCase()}.png`
                }
                onError={(e) => (e.target.src = defaultImg)}
              />
            </div>
            <div className="item-details">
              <div className="item-name">{coin.name}</div>
              <div>{coin.alias}</div>
              <div className="item-last-run">
                Last Run: {formatDateTime(coin.updated_at)}
              </div>
            </div>
            <div className={styles.switchContainer}>
              <span className={styles.switchLabel}>Status</span>
              <SwitchButton
                isActive={bot?.is_active}
                styles={bot?.is_active ? { backgroundColor: "#2DDA99" } : null}
              />
            </div>
            <div className={styles.statusContainer}>
              <div
                className={styles.statusDot}
                style={{ background: bot?.is_active ? "#2DDA99" : "#A3A3A3" }}
              ></div>
              <span className={styles.statusLabel}>
                {bot?.is_active ? "Active" : "Idle"}
              </span>
            </div>
            <span className={styles.lastRun}>
              Last Run: {bot?.last_run_status === "active" ? "Active" : "Idle"}
            </span>
          </section>
          <section className={styles.secondSection}>
            <InfoDisplayItem icon={cilSearch} label="ID" value={coin.bot_id} />
            <InfoDisplayItem
              icon={cilSettings}
              label="Created at"
              value={formatDateTime(coin.created_at)}
            />
            <InfoDisplayItem
              icon={cilClock}
              label="Updated at"
              value={formatDateTime(coin.updated_at)}
            />
            <InfoDisplayItem
              icon={cilClock}
              label="Next Run Time"
              value={formatDateTime(bot?.next_run_time)}
            />
            <InfoDisplayItem
              icon={cilSearch}
              label="Run Count"
              value={bot?.run_count}
            />
            <InfoDisplayItem
              icon={cilSearch}
              label="Run Frequency"
              value={bot?.run_frequency}
            />
          </section>
          <section className={styles.thirdSection}>
            <div className={styles.promptContainer}>
              <div className={styles.text}>
                <span>News Prompt</span>
                <CustomTooltip title="" content="">
                  <HelpOutline fontSize="small" />
                </CustomTooltip>
              </div>
              <div className={styles.prompt}>
                <p>{bot?.prompt}</p>
              </div>
            </div>
            <div className={styles.promptContainer}>
              <div className={styles.text}>
                <span>DALL-E Prompt</span>
                <CustomTooltip title="" content="">
                  <HelpOutline fontSize="small" />
                </CustomTooltip>
              </div>
              <div className={styles.prompt}>
                <p>{bot?.dalle_prompt}</p>
              </div>
            </div>
          </section>
          <section className={styles.fourthSection}>
            <div className={styles.logsContainer}>
              <div className={styles.text}>
                <span>Logs</span>
                <CustomTooltip title="" content="">
                  <HelpOutline fontSize="small" />
                </CustomTooltip>
              </div>
              <div className={styles.logs}>
                <p>
                  &quot;prompt&quot;: &quot;\n Imagine that you are one of the world&apos;s greatest experts on various hacks, crashes, and other similar problems that occur in cryptocurrency protocols. You do not specialize in any specific protocol, but your knowledge is extensive enough to follow every relevant story related to cryptocurrency hacks. You can also filter through non-cryptocurrency hacks and never include them in your summaries. Additionally, you are a world-renowned journalist skilled at 
                  &quot;prompt&quot;: &quot;\n Imagine that you are one of the world&apos;s greatest experts on various hacks, crashes, and other similar problems that occur in cryptocurrency protocols. You do not specialize in any specific protocol, but your knowledge is extensive enough to follow every relevant story related to cryptocurrency hacks. You can also filter through non-cryptocurrency hacks and never include them in your summaries. Additionally, you are a world-renowned journalist skilled at 
                  &quot;prompt&quot;: &quot;\n Imagine that you are one of the world&apos;s greatest experts on various hacks, crashes, and other similar problems that occur in cryptocurrency protocols. You do not specialize in any specific protocol, but your knowledge is extensive enough to follow every relevant story related to cryptocurrency hacks. You can also filter through non-cryptocurrency hacks and never include them in your
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </Modal>
  );
};

export default CoinBotDetails;
