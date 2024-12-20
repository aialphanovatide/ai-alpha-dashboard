import config from "../config";
const headers = {
  "Content-Type": "application/json",
};

const getBot = async (query, searchBy = "id") => {
  try {
    const response = await fetch(
      `${config.BOTS_V2_API}/bot?bot_${searchBy}=${query}`,
      {
        method: "GET",
        headers,
      },
    );

    let responseText = await response.text();

    try {
      const data = JSON.parse(responseText);
      if (response.ok) {
        return { success: true, data: data.data };
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

const getBots = async () => {
  try {
    const response = await fetch(`${config.BOTS_V2_API}/bots`, {
      method: "GET",
      headers,
    });

    let responseText = await response.text();

    try {
      const data = JSON.parse(responseText);
      if (response.ok) {
        return { success: true, data: data.data };
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
    console.error("Error fetching bots:", error);
    return { success: false, error: "Network error or server is unreachable" };
  }
};

const createBot = async (payload) => {
  try {
    const response = await fetch(`${config.BOTS_V2_API}/bot`, {
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
    console.error("Error creating bot:", error);
    return { success: false, error: "Network error or server is unreachable" };
  }
};

const editBot = async (payload, botID) => {
  try {
    const response = await fetch(`${config.BOTS_V2_API}/bot/${botID}`, {
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

const deleteBot = async (botID) => {
  try {
    const response = await fetch(`${config.BOTS_V2_API}/bot/${botID}`, {
      method: "DELETE",
      headers,
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
    console.error("Error deleting bot:", error);
    return { success: false, error: "Network error or server is unreachable" };
  }
};

const getBotLogs = async (botID) => {
  try {
    const response = await fetch(`${config.BOTS_V2_API}/bot/${botID}/logs`, {
      method: "GET",
      headers,
    });

    let responseText = await response.text();

    try {
      const data = JSON.parse(responseText);
      if (response.ok) {
        return { success: true, data: data.data };
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
    console.error("Error fetching bot logs:", error);
    return { success: false, error: "Network error or server is unreachable" };
  }
};

const toggleBotStatus = async (botID) => {
  try {
    const response = await fetch(
      `${config.BOTS_V2_API}/bot/${botID}/toggle-activation`,
      {
        method: "POST",
        headers,
      },
    );

    let responseText = await response.text();

    try {
      const data = JSON.parse(responseText);
      if (!response.ok) {
        return {
          success: false,
          error: JSON.stringify({message: data.error,
          validation_errors: data.validation_errors || []}),
        };
      }
      return { success: true, data };
    } catch (parseError) {
      return { success: false, error: "Failed to parse server response" };
    }
  } catch (error) {
    return { success: false, error: "Network error or server is unreachable" };
  }
};

export {
  createBot,
  getBot,
  editBot,
  getBots,
  deleteBot,
  getBotLogs,
  toggleBotStatus,
};
