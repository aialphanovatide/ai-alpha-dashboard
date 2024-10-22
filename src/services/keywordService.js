import config from "../config";
const headers = {
  "X-API-Key": config.X_API_KEY_DEV,
  "Content-Type": "application/json",
};

const deleteKeywords = async (type, keywords, bots_ids) => {
  try {
    const payload = {
      "bot_ids": bots_ids,
    }

    if (type === "blacklist") {
      payload["entries"] = keywords;
    } else {
      payload["keywords"] = keywords;
    }

    const response = await fetch(`${config.BOTS_V2_DEV_API}/${type}`, {
      method: "DELETE",
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
    console.error("Error deleting keywords:", error);
    return { success: false, error: "Network error or server is unreachable" };
  }
}

const addKeywords = async (type, keywords, bots_ids) => {
  try {
    const payload = {
      "bot_ids": bots_ids,
    }

    if (type === "blacklist") {
      payload["entries"] = keywords;
    } else {
      payload["keywords"] = keywords;
    }

    const response = await fetch(`${config.BOTS_V2_DEV_API}/${type}`, {
      method: "POST",
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
    console.error("Error adding keywords:", error);
    return { success: false, error: "Network error or server is unreachable" };
  }
}

const searchKeywords = async (type, query, bots_ids) => {
  try {
    const response = await fetch(`${config.BOTS_V2_DEV_API}/${type}/search`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        "bot_ids": bots_ids,
        "queries": [query],
      }),
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
    console.error("Error searching keywords:", error);
    return { success: false, error: "Network error or server is unreachable" };
  }
}

export {
  addKeywords,
  searchKeywords,
  deleteKeywords,
}