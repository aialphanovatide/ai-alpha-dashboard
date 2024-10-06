import config from "../config";
const API_ID_URL = `${config.BOTS_V2_API}/categories`;
const API_NAME_URL = `${config.BASE_URL}/delete_category`;

const fetchCategories = async () => {
  try {
    const response = await fetch(`${config.BOTS_V2_API}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Error fetching categories:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const deleteCategoryById = async (categoryId) => {
  try {
    const response = await fetch(`${API_ID_URL}/${categoryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "Error deleting category by ID.");
    }

    return { success: true, message: "Category deleted by ID successfully." };
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteCategoryByName = async (categoryName) => {
  try {
    const response = await fetch(`${API_NAME_URL}/${categoryName}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ category_name: categoryName }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(
        errorResponse.error || "Error deleting category by Name.",
      );
    }

    return { success: true, message: "Category deleted by Name successfully." };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Function to update category state
const updateCategoryState = async (url, botCategory) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category: botCategory }),
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error(`Error at ${url.includes("activate") ? "Turn ON" : "Turn OFF"}:`, data.message);
      return null;
    }
  } catch (error) {
    console.error("Error during updateCategoryState:", error);
    return null;
  }
};

// Function to turn on all categories
const turnOnAllCategories = async () => {
  try {
    const response = await fetch(`${config.BOTS_V2_API}/activate_all_categories`, {
      method: "POST",
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error("Error activating all categories:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error during turnOnAllCategories:", error);
    return null;
  }
};

// Function to turn off all categories
const turnOffAllCategories = async () => {
  try {
    const response = await fetch(`${config.BOTS_V2_API}/deactivate_all_categories`, {
      method: "POST",
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error("Error deactivating all categories:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error during turnOffAllCategories:", error);
    return null;
  }
};

// Function to toggle a single category's state
const toggleCategoryState = async (category, isActive) => {
  const url = isActive
    ? `${config.BOTS_V2_API}/deactivate_bot_by_id/${category}`
    : `${config.BOTS_V2_API}/activate_bot_by_id/${category}`;

  try {
    const response = await fetch(url, { method: "POST" });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Error:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error during toggleCategoryState:", error);
    return null;
  }
};


export {
  fetchCategories,
  deleteCategoryByName,
  deleteCategoryById,
  toggleCategoryState,
  turnOffAllCategories,
  turnOnAllCategories,
};
