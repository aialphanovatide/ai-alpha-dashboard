import config from "../config";
import { addKeywords } from "./keywordService";
const headers = {
  "Content-Type": "application/json",
};

const getBot = async (query, searchBy = "id") => {
  try {
    const response = await fetch(
      `${config.BOTS_V2_DEV_API}/bot?bot_${searchBy}=${query}`,
      {
        method: "GET",
        headers,
      },
    );

    let responseText = await response.text();

    try {
      const data = JSON.parse(responseText).data;
      if (response.ok) {
        return { success: true, data };
      } else {
        return {
          success: false,
          error: data.error || "Unknown error occurred",
        };
      }
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return { success: false, error: "Failed to parse server response" };
    }
  } catch (error) {
    console.error("Error fetching bot:", error);
    return { success: false, error: "Network error or server is unreachable" };
  }
};

const createBot = async (payload, keywords) => {
  try {
    const response = await fetch(`${config.BOTS_V2_DEV_API}/bot`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    let responseText = await response.text();

    try {
      const data = JSON.parse(responseText);
      if (response.ok) {
        const { whitelist, blacklist } = keywords;
        const botId = data.bot.id;

        if (whitelist.length > 0) {
          const response = await addKeywords("keywords", whitelist, [botId]);
          if (!response.success) {
            return {
              success: false,
              error: response.error || "Error adding whitelist keywords",
            };
          }
        }

        if (blacklist.length > 0) {
          const response = await addKeywords("blacklist", blacklist, [botId]);
          if (!response.success) {
            if (!response.success) {
              return {
                success: false,
                error: response.error || "Error adding blacklist keywords",
              };
            }
          }
        }

        return { success: true, data };
      } else {
        return {
          success: false,
          error: data.error || "Unknown error occurred",
        };
      }
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return { success: false, error: "Failed to parse server response" };
    }
  } catch (error) {
    console.error("Error creating bot:", error);
    return { success: false, error: "Network error or server is unreachable" };
  }
};

const editBot = async (payload, botID) => {
  try {
    const response = await fetch(`${config.BOTS_V2_DEV_API}/bot/${botID}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });

    let responseText = await response.text();

    try {
      const data = JSON.parse(responseText);
      if (response.ok) {
        return { success: true, data };
      } else {
        return {
          success: false,
          error: data.error || "Unknown error occurred",
        };
      }
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return { success: false, error: "Failed to parse server response" };
    }
  } catch (error) {
    console.error("Error updating bot:", error);
    return { success: false, error: "Network error or server is unreachable" };
  }
};

export { createBot, getBot, editBot };
