// index.js
import { cilPen, cilPlus } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./index.module.css";
import { HelpOutline } from "@mui/icons-material";
import CustomTooltip from "src/components/CustomTooltip";
import {
  createCategory,
  deleteCategory,
  editCategory,
  getCategories,
  getCategory,
} from "src/services/categoryService";
import Swal from "sweetalert2";
import SpinnerComponent from "src/components/Spinner";
import defaultImg from "../../../../assets/brand/logo.png";
import uploadIcon from "../../../../assets/icons/uploadIcon.svg";

const CategoryForm = ({ category, setCategories }) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newsBotsCategory, setNewsBotsCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: category?.name || "",
    alias: category?.alias || "",
    slack_channel: "",
    border_color: category?.border_color
      ? category.border_color.includes("#")
        ? category.border_color.replace("#", "")
        : ""
      : "",
    icon: "",
    iconPreview: category?.icon || "",
  });

  useEffect(() => {
    if (category) getNewsBotsCategory(category.name);
  }, [category]);

  const getNewsBotsCategory = async (categoryName) => {
    try {
      setIsLoading(true);
      const response = await getCategory(categoryName, true);
      if (!response.success) {
        throw new Error(response.error || "Error fetching news bot category");
      }
      const category = response.data.category;
      setFormData((prev) => ({
        ...prev,
        alias: category.alias,
        name: category.name,
        slack_channel: category.slack_channel,
        iconPreview: formData.iconPreview
          ? formData.iconPreview
          : category.icon,
      }));
      setNewsBotsCategory(category);
    } catch (err) {
      Swal({
        text: err.message || "Error fetching news bot category",
        icon: "error",
        customClass: "swal",
        backdrop: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  let isFormValid = useMemo(
    () => formData.name && formData.alias,
    [formData.name, formData.alias],
  );

  const handleInputChange = (e) => {
    let newData = { ...formData };
    newData[e.target.name] = e.target.value;
    setFormData(newData);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type === "image/svg+xml") {
      const previewUrl = URL.createObjectURL(file);

      setFormData({ ...formData, icon: file, iconPreview: previewUrl });
    } else {
      setError("Please select a valid SVG file");
    }
  };

  const handleSubmit = async (e) => {
    let categoryId;
    try {
      e.preventDefault();
      setIsSubmitting(true);

      let formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("alias", formData.alias);

      if (formData.border_color) {
        formDataToSend.append("border_color", `#${formData.border_color}`);
      }
      if (formData.icon) {
        formDataToSend.append("icon", formData.icon, formData.icon);
      }

      const response = category
        ? await editCategory(formDataToSend, category.category_id)
        : await createCategory(formDataToSend);

      categoryId = response.data?.category.category_id;

      if (!response.success) {
        throw new Error(response.error || "Error creating category");
      }

      let formDataForNewsBotServer = {
        alias: formData.alias,
        border_color: formData.border_color,
        name: formData.name,
        slack_channel: formData.slack_channel,
      };

      const responseFromNewsBotServer = category
        ? await editCategory(
            formDataForNewsBotServer,
            newsBotsCategory.id,
            true,
          )
        : await createCategory(formDataForNewsBotServer, true);

      if (!responseFromNewsBotServer.success) {
        throw new Error(
          responseFromNewsBotServer.error ||
            "Error creating category in news bot server",
        );
      }

      Swal.fire({
        text: `Category ${category ? "updated" : "created"} successfully!`,
        icon: "success",
        customClass: "swal",
        backdrop: false,
      }).then(async () => {
        const updatedCategories = await getCategories();
        setCategories(updatedCategories);
      });

      if (!category) {
        setFormData({
          name: "",
          alias: "",
          border_color: "",
          icon: null,
          iconPreview: null,
          slack_channel: "",
        });
        document.querySelector('input[type="file"]').value = "";
      }
    } catch (err) {
      if (categoryId && !category) {
        await deleteCategory(categoryId);
      }

      Swal.fire({
        title: `Error ${category ? "updating" : "creating"} category`,
        text:
          err.message ||
          `An error occurred while ${
            category ? "updating" : "creating"
          } the category`,
        icon: "error",
        customClass: "swal",
        backdrop: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h4>
        <CIcon icon={category ? cilPen : cilPlus} size="xl" />{" "}
        {category ? "Edit" : "Create New"} Category
      </h4>
      {isLoading ? (
        <SpinnerComponent style={{ height: "80vh" }} />
      ) : (
        <form onSubmit={handleSubmit}>
          {/* {error && <div className={styles.error}>{error}</div>} */}
          <div className={styles.section}>
            <div className={styles.labelContainer}>
              <label>
                <strong>Name</strong>
                <span> *</span>
              </label>
              <CustomTooltip
                title={"Create a coin category"}
                content={
                  "Enter a name and alias to enable the category in Analysis, Fundamentals, Charts and Narrative Trading."
                }
              >
                <HelpOutline fontSize="small" />
              </CustomTooltip>
            </div>
            <input
              className={styles.input}
              placeholder="Enter category name"
              value={formData.name}
              name="name"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.section}>
            <div className={styles.labelContainer}>
              <label>
                <strong>Alias</strong>
                <span> *</span>
              </label>
              <HelpOutline fontSize="small" />
            </div>
            <input
              className={styles.input}
              placeholder="Enter category alias"
              value={formData.alias}
              onChange={handleInputChange}
              name="alias"
              required
            />
          </div>
          <div className={styles.section}>
            <div className={styles.labelContainer}>
              <label>
                <strong>Slack Channel</strong>
              </label>
              <HelpOutline fontSize="small" />
            </div>
            <input
              className={styles.input}
              placeholder="Enter Slack channel ID"
              value={formData.slack_channel}
              onChange={handleInputChange}
              name="slack_channel"
            />
          </div>
          <div className={styles.section}>
            <div className={styles.labelContainer}>
              <label>
                <strong>Upload Icon</strong>
              </label>
              <CustomTooltip
                title={"Enable a category"}
                content={
                  "Fill in all fields to enable the option to display the category in the app."
                }
              >
                <HelpOutline fontSize="small" />
              </CustomTooltip>
            </div>
            <div className={styles.divInput} id="categoryForm-img-input">
              <div
                className={styles.imgPicker}
                id="categoryForm-img-input-button"
              >
                <input
                  type="file"
                  accept=".svg"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  id="categoryform-icon-input"
                />
                <label htmlFor="categoryform-icon-input">
                  <img src={uploadIcon} alt="icon" style={{ height: 16 }} />
                  Upload
                </label>
              </div>
              <span style={formData.icon?.name ? { color: "black" } : {}}>
                {formData.icon ? formData.icon.name : "No files selected"}
              </span>
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.labelContainer}>
              <label>
                <strong>Border Color</strong>
              </label>
              <HelpOutline fontSize="small" />
            </div>
            <div
              className={styles.input}
              style={{
                paddingBlock: 0,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              id="categoryform-border-color-input"
            >
              <span style={{ fontSize: 20, fontWeight: 600 }}>#</span>
              <input
                style={{
                  background: "transparent",
                  border: "none",
                  width: "80%",
                }}
                placeholder="Enter HEX code"
                value={formData.border_color}
                onChange={handleInputChange}
                name="border_color"
              />
              <div
                style={{
                  height: 19,
                  width: 19,
                  borderRadius: "50%",
                  background: formData.border_color
                    ? `#${formData.border_color}`
                    : "transparent",
                }}
              ></div>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              padding: 20,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label style={{ margin: "auto", marginBottom: 15 }}>
              <strong>Preview</strong>
            </label>
            <div
              id="categoryform-icon-container"
              className={styles.imgContainer}
              style={{
                borderColor: formData.border_color
                  ? formData.border_color.includes("#")
                    ? formData.border_color
                    : `#${formData.border_color}`
                  : "transparent",
              }}
            >
              <img
                src={formData.iconPreview}
                onError={(e) => (e.target.src = defaultImg)}
                className={styles.img}
                style={{
                  visibility: formData.iconPreview ? "visible" : "hidden",
                }}
                alt="icon"
              />
            </div>
            <div
              id="category-alias"
              style={{
                margin: "auto",
                marginTop: 15,
                background: formData.alias !== "" ? "transparent" : "#f5f5f5",
                width: 150,
                height: 23,
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              {formData.alias}
            </div>
          </div>
          <button
            className={styles.submitButton}
            type="submit"
            disabled={!isFormValid}
            id="categoryform-submit-button"
          >
            {isSubmitting
              ? category
                ? "Saving..."
                : "Creating..."
              : category
                ? "Save"
                : "Create"}
          </button>
        </form>
      )}
    </>
  );
};

export default CategoryForm;
