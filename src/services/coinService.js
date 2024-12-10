import config from "../config";
const headers = {
  'Accept': "*/*",
  "X-Api-Key": config.X_API_KEY,
};

const createCoin = async (payload) => {
  try {
    const response = await fetch(`${config.BASE_URL}/coin`, {
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
    console.error("Error creating coin:", error);
    return { success: false, error: "Network error or server is unreachable" };
  }
};

const editCoin = async (payload, coinID) => {
  try {
    const response = await fetch(`${config.BASE_URL}/coin/${coinID}`, {
      method: "PUT",
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
    console.error("Error updating coin:", error);
    return { success: false, error: "Network error or server is unreachable" };
  }
};

const toggleCoinStatus = async (coin_id) => {
  try {
    const response = await fetch(
      `${config.BASE_URL}/coin/${coin_id}/toggle-coin`,
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

const deleteCoin = async (coin_id) => {
  try {
    const response = await fetch(`${config.BASE_URL}/coin/${coin_id}`, {
      method: "DELETE",
      headers,
    });

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
    console.error("Error deleting coin:", error);
    return { success: false, error: "Network error or server is unreachable" };
  }
};

const getCoins = async () => {
  try {
    const response = await fetch(`${config.BASE_URL}/coins`, {
      headers,
    });

    let responseText = await response.text();

    const data = JSON.parse(responseText);
    if (!data.success) {
      throw new Error(data.error);
    }
    return { success: true, data: data.coins };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Network error or server is unreachable",
    };
  }
};

export { createCoin, editCoin, toggleCoinStatus, deleteCoin, getCoins };
