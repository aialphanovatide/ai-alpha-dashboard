import config from "../config";
let headers = {
  "x-api-key": config.X_API_KEY,
  "Content-Type": "application/json"
 }

const getSections = async () => {
  try {
    const response = await fetch(`${config.BASE_URL}/sections`, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    return { succes: true, data: data.message };
  } catch (error) {
    return { succes: false, error: error.message };
  }
};

const createSection = async (payload) => {
  try {
    const response = await fetch(`${config.BASE_URL}/sections`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    return { succes: true, data: data.message };
  } catch (error) {
    return { succes: false, error: error.message };
  }
};

const deleteSection = async (section_id) => {
  try {
    const response = await fetch(`${config.BASE_URL}/sections/${section_id}`, {
      method: "DELETE",
      headers,
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    return { succes: true, data: data.message };
  } catch (error) {
    return { succes: false, error: error.message };
  }
};

export { getSections, createSection, deleteSection };
