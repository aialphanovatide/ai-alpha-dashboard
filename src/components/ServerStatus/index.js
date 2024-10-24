import React, { useEffect, useState, useCallback } from "react";
import config from "src/config";
import ReportGmailerrorredTwoToneIcon from "@mui/icons-material/ReportGmailerrorredTwoTone";

const styles = {
  container: {
    margin: 5,
    textAlign: "center",
    fontSize: "smaller",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  message: {
    color: "#fca728",
  },
  icon: {
    fontSize: 16,
    color: "gray",
  },
};

const ServerStatus = ({ isFullWidth }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchServerStatus = async () => {
    try {
      const [aiAlphaServerResponse, newsBotsServerResponse] = await Promise.all(
        [fetch(`${config.BASE_URL_DEV}`), fetch(`${config.BOTS_V2_DEV_API}`)],
      );

      if (
        aiAlphaServerResponse.status !== 200 &&
        newsBotsServerResponse.status !== 200
      ) {
        setMessage("Both servers are down. Please contact the administrator.");
      } else if (aiAlphaServerResponse.status !== 200) {
        setMessage(
          "AI Alpha server is down. Please contact the administrator.",
        );
      } else if (newsBotsServerResponse.status !== 200) {
        setMessage(
          "News Bots server is down. Please contact the administrator.",
        );
      } else {
        setMessage("");
      }
    } catch (error) {
      setMessage("Error checking server status: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkServerStatus = useCallback(() => {
    fetchServerStatus();
  }, []);

  useEffect(() => {
    checkServerStatus();
  }, [checkServerStatus]);

  if (loading || !message) {
    return null;
  }

  return (
    <div
      style={{
        ...styles.container,
        width: isFullWidth ? "100%" : "fit-content",
      }}
    >
      {isFullWidth && <ReportGmailerrorredTwoToneIcon sx={styles.icon} />}
      <span style={styles.message}>{message}</span>
    </div>
  );
};

export default ServerStatus;
