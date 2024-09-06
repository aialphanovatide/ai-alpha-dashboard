import config from "../config";
const API_ID_URL = `${config.BOTS_V2_API}/categories`;
const API_NAME_URL = `${config.BASE_URL}/delete_category`;

// const fetchCategories = async () => {
//   try {
//     const response = await fetch(`${config.BOTS_V2_API}/categories`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "ngrok-skip-browser-warning": "true",
//       },
//     });
//     if (response.ok) {
//       const data = await response.json();
//     } else {
//       console.error("Error fetching categories:", response.statusText);
//     }
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//   }
// };

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

export {
  // fetchCategories,
  deleteCategoryByName,
  deleteCategoryById,
};
