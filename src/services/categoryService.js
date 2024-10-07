import config from "../config";

const getCategories = async () => {
  try {
    const response = await fetch(`${config.BASE_URL}/categories`, {
      method: "GET",
      headers: {
        "X-API-Key": config.X_API_KEY,
        Accept: "application/json",
      },
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
      if (data) {
        return data;
      } else {
        console.error("Error in response:", data.error);
      }
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
    }
  } catch (error) {
    console.error("Error creating category:", error);
  }
}

const editCategory = async (category_id, payload) => {
  try {
    const response = await fetch(`${config.BASE_URL}/category/${category_id}`, {
      method: "PUT",
      headers: {
        "X-API-Key": config.X_API_KEY,
        Accept: "application/json",
      },
      body: payload
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
}

const deleteCategory = async (category_id) => {
  try {
    const response = await fetch(`${config.BASE_URL}/category/${category_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "Error deleting category.");
    }

    return { success: true, message: "Category deleted successfully." };
  } catch (error) {
    throw new Error(error.message);
  }
};

const toggleAllCategoriesState = async (isActive) => {
  try {
    const response = await fetch(
      `${config.BASE_URL}/categories/global-toggle`,
      {
        method: "POST",
        body: {
          action: isActive ? "deactivate" : "activate",
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Error:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error during toggleAllCategoriesState:", error);
    return null;
  }
};

const toggleCategoryState = async (category_id, isActive) => {
  try {
    const response = await fetch(
      `${config.BASE_URL}/categories/${category_id}/toggle-coins`,
      {
        method: "POST",
        body: {
          action: isActive ? "deactivate" : "activate",
        },
      },
    );

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
  getCategories,
  createCategory,
  editCategory,
  deleteCategory,
  toggleAllCategoriesState,
  toggleCategoryState,
};
