import config from "../config";
let headers = {
  Accept: "*/*",
  "X-Api-Key": config.X_API_KEY,
};

const getAnalyses = async (limit) => {
  try {
    let url = `${config.BASE_URL}/analyses?`;
    if (limit) {
      url += `per_page=${limit}&`;
    }

    const response = await fetch(url, {
      method: "GET",
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
      throw new Error(data.error || data.message);
    }

    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const deleteAnalysis = async (analysis_id, section_id) => {
  try {
    const response = await fetch(
      `${config.BASE_URL}/analysis/${analysis_id}?section_id=${section_id}`,
      {
        method: "DELETE",
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
};

const createScheduleAnalysis = async (payload) => {
  try {
    const response = await fetch(`${config.BASE_URL}/scheduled-analyses`, {
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

const deleteScheduledAnalysis = async (analysis_id) => {
  try {
    const response = await fetch(
      `${config.BASE_URL}/scheduled-analyses/${analysis_id}`,
      {
        method: "DELETE",
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

const getScheduledAnalyses = async () => {
  try {
    const response = await fetch(`${config.BASE_URL}/scheduled-analyses`, {
      method: "GET",
      headers,
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    return { success: true, data: data.data.jobs };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const generateAnalysisImage = async (content) => {
  try {
    const response = await fetch(`${config.BASE_URL}/analysis/generate-image`, {
      method: "POST",
      headers,
      body: content,
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    return { success: true, data: data.data.temp_image_url };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export {
  getAnalyses,
  getCoinAnalysis,
  postAnalysis,
  deleteAnalysis,
  editAnalysis,
  createScheduleAnalysis,
  deleteScheduledAnalysis,
  getScheduledAnalyses,
  generateAnalysisImage,
};
