import config from "../config";
const headers = {
  "X-API-Key": config.X_API_KEY,
  "Content-Type": "application/json",
};

const createBot = async (payload) => {
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
    console.error("Error creating bot:", error);
    return { success: false, error: "Network error or server is unreachable" };
  }
};


const editBot = async (payload) => {
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
    console.error("Error creating bot:", error);
    return { success: false, error: "Network error or server is unreachable" };
  }
};


export { 
  createBot, 
};