import config from "../config";
const headers = {
  "Content-Type": "application/json",
};

const getBot = async (query, searchBy = "id") => {
  try {
    const response = await fetch(`${config.BOTS_V2_DEV_API}/bot?bot_${searchBy}=${query.toLowerCase()}`, {
      method: "GET",
      headers,
    });

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

const createBot = async (payload) => {
  try {
    const response = await fetch(`${config.BOTS_V2_DEV_API}/bot`, {
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

const editBot = async (payload) => {
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


export { 
  createBot, 
  getBot,
  editBot,
};