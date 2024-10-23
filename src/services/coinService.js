import config from "../config";
const headers = {
  'Accept': "*/*",
  "X-Api-Key": config.X_API_KEY_DEV,
};

const createCoin = async (payload) => {
  try {
    const response = await fetch(`${config.BASE_URL_DEV}/coin`, {
      method: "POST",
      headers,
      body: payload,
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
    console.error("Error creating bot:", error);
    return { success: false, error: "Network error or server is unreachable" };
  }
};

const editCoin = async (payload) => {
  try {
    const response = await fetch(`${config.BASE_URL_DEV}/coin`, {
      method: "POST",
      headers,
      body: payload,
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
    console.error("Error creating bot:", error);
    return { success: false, error: "Network error or server is unreachable" };
  }
};

const toggleCoinStatus = async (coin_id) => {
  try {
    const response = await fetch(
      `${config.BASE_URL_DEV}/coin/${coin_id}/toggle-coin`,
      {
        method: "POST",
        headers,
      },
    );

    let responseText = await response.text();

    try {
      const data = JSON.parse(responseText);
      if (response.ok) {
        return { success: true, message: data.message };
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
    console.error("Error toggling coin status:", error);
    return { success: false, error: "Network error or server is unreachable" };
  }
};

export { createCoin, editCoin, toggleCoinStatus };
