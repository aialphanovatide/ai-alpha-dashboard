// index.js
import { cilPen, cilPlus } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import React, { useMemo, useState } from "react";
import styles from "./index.module.css";
import { HelpOutline } from "@mui/icons-material";
import CustomTooltip from "src/components/CustomTooltip";
import {
  createCategory,
  editCategory,
  getCategories,
} from "src/services/categoryService";
import Swal from "sweetalert2";
import SpinnerComponent from "src/components/Spinner";

const NewCategoryForm = ({ category, setCategories }) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: category && category.name ? category.name : "",
    alias: category && category.alias ? category.alias : "",
    // prompt: "",
    slack_channel: "",
    border_color:
      category && category.border_color
        ? category.border_color.includes("#")
          ? category.border_color.replace("#", "")
          : ""
        : "",
    icon: "",
    iconPreview:
      category && category.icon
        ? `https://aialphaicons.s3.us-east-2.amazonaws.com/${
            category.alias || category.name
          }.svg`
        : "",
  });

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

      const response = await createCategory(formDataToSend);

      if (response.success) {
        Swal.fire({
          text: `Category ${category ? "updated" : "created"} successfully!`,
          icon: "success",
          customClass: "swal",
        }).then(async () => {
          const updatedCategories = await getCategories();
          setCategories(updatedCategories);
        });

        setFormData({
          name: "",
          alias: "",
          border_color: "",
          icon: null,
          iconPreview: null,
        });
        document.querySelector('input[type="file"]').value = "";
        setIsSubmitting(false);
      } else {
        Swal.fire({
          text: response.error || "Error creating category",
          icon: "error",
          customClass: "swal",
        });
        setIsSubmitting(false);
      }
    } catch (err) {
      Swal.fire({
        text:
          err.message ||
          `An error occurred while ${
            category ? "updating" : "creating"
          } the category`,
        icon: "error",
        customClass: "swal",
      });
    }
  };

  return (
    <>
      <h4>
        <CIcon icon={category ? cilPen : cilPlus} size="xl" /> {category ? "Edit" : "Create New"}{" "}
        Category
      </h4>
      {isLoading ? (
        <SpinnerComponent style={{height: '80vh'}} />
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
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
          {/* <div className={styles.section}>
            <div className={styles.labelContainer}>
              <label>
                <strong>News Prompt</strong>
              </label>
              <CustomTooltip
                title={"Create a bot category"}
                content={
                  "Add at least one additional detail (excluding icon or background color) to enable the category for news bot creation."
                }
              >
                <HelpOutline fontSize="small" />
              </CustomTooltip>
            </div>
            <textarea
              className={styles.textarea}
              placeholder={
                "Enter article generator prompt.\nAn example of use could be:\n“Imagine that you are one of the world’s foremost experts on Bitcoin and also a globally renowned journalist skilled at summarizing articles about Bitcoin...”"
              }
              value={formData.prompt}
              onChange={handleInputChange}
              name="prompt"
            />
          </div> */}
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
            <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              <div className={styles.divInput}>
                <input
                  type="file"
                  accept=".svg"
                  onChange={handleImageChange}
                  className={styles.imgPicker}
                  id="categoryform-icon-input"
                />
              </div>
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
                ? "Updating..."
                : "Creating..."
              : category
                ? "Update"
                : "Create"}
          </button>
        </form>
      )}
    </>
  );
};

export default NewCategoryForm;
