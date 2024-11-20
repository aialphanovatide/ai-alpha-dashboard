import config from "../config";
let headers = {
  Accept: "*/*",
  "X-Api-Key": config.X_API_KEY_DEV,
};

const getCategory = async (category_id, isNewsBotsServer) => {
  try {
    const url = isNewsBotsServer
      ? `${config.BOTS_V2_DEV_API}/category?category_name=${category_id}`
      : `${config.BASE_URL_DEV}/category/${category_id}`;

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    let responseText = await response.text();

    try {
      const data = JSON.parse(responseText);
      if (data) {
        return data;
      } else {
        console.error("Error in response:", data.error);
      }
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
    }
  } catch (error) {
    console.error("Error fetching category:", error);
  }
};

const getCategories = async (isNewsBotsServer) => {
  try {
    const url = isNewsBotsServer
      ? `${config.BOTS_V2_DEV_API}/categories`
      : `${config.BASE_URL_DEV}/categories`;

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    let responseText = await response.text();

    try {
      const data = JSON.parse(responseText);
      if (data && (data.categories || data.data.categories)) {
        return !isNewsBotsServer ? data.categories : data.data.categories;
      } else {
        console.error("Error in response:", data.error);
      }
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const createCategory = async (payload, isNewsBotsServer) => {
  try {
    const url = `${
      isNewsBotsServer ? config.BOTS_V2_DEV_API : config.BASE_URL_DEV
    }/category`;

    const customHeaders = isNewsBotsServer
      ? { "Content-Type": "application/json" }
      : { ...headers };

    payload = isNewsBotsServer ? JSON.stringify(payload) : payload;

    const response = await fetch(url, {
      method: "POST",
      headers: customHeaders,
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
    console.error("Error creating category:", error);
    return { success: false, error: "Network error or server is unreachable" };
  }
};

const editCategory = async (payload, category_id, isNewsBotsServer) => {
  try {
    const url = `${
      isNewsBotsServer ? config.BOTS_V2_DEV_API : config.BASE_URL_DEV
    }/category/${category_id}`;

    const customHeaders = isNewsBotsServer
      ? { "Content-Type": "application/json" }
      : { ...headers };

    payload = isNewsBotsServer ? JSON.stringify(payload) : payload;

    const response = await fetch(url, {
      method: "PUT",
      headers: customHeaders,
      body: payload,
    });

    let responseText = await response.text();

    try {
      const data = JSON.parse(responseText);
      if (data) {
        return data;
      } else {
        console.error("Error in response:", data.error);
      }
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
    }
  } catch (error) {
    console.error("Error editing category:", error);
  }
};

const deleteCategory = async (category_id, isNewsBotsServer) => {
  try {
    const url = isNewsBotsServer
      ? `${config.BOTS_V2_DEV_API}/category/${category_id}`
      : `${config.BASE_URL_DEV}/category/${category_id}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    let responseText = await response.text();

    try {
      const data = JSON.parse(responseText);
      if (response.ok) {
        return { success: true, message: "Category deleted successfully." };
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
    console.error("Error deleting category:", error);
    return { success: false, error: "Network error or server is unreachable" };
  }
};

const toggleAllCategoriesState = async (isEveryCategoryActive) => {
  try {
    const response = await fetch(
      `${config.BASE_URL_DEV}/categories/global-toggle`,
      {
        method: "POST",
        headers,
        body: {
          action: isEveryCategoryActive ? "deactivate" : "activate",
        },
      },
    );

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: `Categories ${
          isEveryCategoryActive ? "desactivated" : "activated"
        } successfully`,
        data,
      };
    } else {
      return { success: false, error: data.error || "Unknown error occurred" };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error during toggleAllCategoriesState",
    };
  }
};

const toggleCategoryState = async (category_id, isActive) => {
  try {
    const response = await fetch(
      `${config.BASE_URL_DEV}/categories/${category_id}/toggle-coins`,
      {
        method: "POST",
        headers,
        body: {
          action: isActive ? "deactivate" : "activate",
        },
      },
    );

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: `Category ${
          isActive ? "desactivated" : "activated"
        } successfully`,
        data,
      };
    } else {
      return { success: false, error: data.error || "Unknown error occurred" };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || "Error during toggleCategoryState",
    };
  }
};

export {
  getCategories,
  createCategory,
  editCategory,
  deleteCategory,
  toggleAllCategoriesState,
  toggleCategoryState,
  getCategory,
};
