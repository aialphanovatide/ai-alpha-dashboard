import config from "../config";
const headers = {
  "X-API-Key": config.X_API_KEY,
  "Content-Type": "application/json",
};

const getCategories = async () => {
  try {
    const response = await fetch(`${config.BASE_URL}/categories`, {
      method: "GET",
      headers,
    });

    let responseText = await response.text();

    try {
      const data = JSON.parse(responseText);
      if (data && data.categories) {
        return data.categories;
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

const createCategory = async (payload) => {
  try {
    const response = await fetch(`${config.BASE_URL}/category`, {
      method: "POST",
      headers: {
        "X-API-Key": config.X_API_KEY,
        Accept: "application/json",
      },
      body: payload
    });

    let responseText = await response.text();

    try {
      const data = JSON.parse(responseText);
      if (response.ok) {
        // Respuesta de éxito
        return { success: true, data };
      } else {
        // Error de cliente (400) o servidor (500)
        return { success: false, error: data.error || "Unknown error occurred" };
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

const editCategory = async (category_id, payload) => {
  try {
    const response = await fetch(`${config.BASE_URL}/category/${category_id}`, {
      method: "PUT",
      headers,
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

const deleteCategory = async (category_id) => {
  try {
    const response = await fetch(`${config.BASE_URL}/category/${category_id}`, {
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
      `${config.BASE_URL}/categories/global-toggle`,
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
      `${config.BASE_URL}/categories/${category_id}/toggle-coins`,
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
};
