import config from "../config";
let headers = {
  Accept: "*/*",
  "X-Api-Key": config.X_API_KEY,
};

const getAnalyses = async (section_id) => {
  //tested
  try {
    const response = await fetch(
      `${config.BASE_URL}/analyses?section_id=${section_id}`,
      {
        method: "GET",
        headers,
      },
    );
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const getCoinAnalysis = async (coin_id, section_id) => {
  try {
    const response = await fetch(
      `${config.BASE_URL}/analysis?coin_id=${coin_id}&section_id=${section_id}`,
      {
        method: "GET",
        headers,
      },
    );
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const postAnalysis = async (payload) => {
  try {
    const response = await fetch(`${config.BASE_URL}/analysis`, {
      method: "POST",
      headers,
      body: payload,
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const deleteAnalysis = async (analysis_id, section_id) => {
  try {
    const response = await fetch(`${config.BASE_URL}/analysis/${analysis_id}?section_id=${section_id}`, {
      method: "DELETE",
      headers,
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const editAnalysis = async (analysis_id, payload) => {
  try {
    const response = await fetch(`${config.BASE_URL}/analysis/${analysis_id}`, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export { getAnalyses, getCoinAnalysis, postAnalysis, deleteAnalysis, editAnalysis };
