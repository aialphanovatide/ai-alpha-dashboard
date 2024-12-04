import config from "../config";
const headers = {
  "Content-Type": "application/json",
};

const markAsTopStory = async (articleId) => {
  try {
    const response = await fetch(
      `${config.BOTS_V2_API}/top-stories/${articleId}`,
      {
        method: "POST",
        headers,
      },
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Unknown error occurred");
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Network error or server is unreachable",
    };
  }
};

const deleteFromTopStories = async (articleId) => {
  try {
    const response = await fetch(
      `${config.BOTS_V2_API}/top-story/${articleId}`,
      {
        method: "DELETE",
        headers,
      },
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Unknown error occurred");
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Network error or server is unreachable",
    };
  }
};

export { markAsTopStory, deleteFromTopStories };
