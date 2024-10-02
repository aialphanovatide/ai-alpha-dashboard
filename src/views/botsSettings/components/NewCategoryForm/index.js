import { cilPen, cilPlus } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import React, { useMemo, useState } from "react";
import styles from "./index.module.css";
import { HelpOutline } from "@mui/icons-material";
import CustomTooltip from "src/components/ToolTip";
import config from "src/config";

const NewCategoryForm = (params) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { category } = params;

  const [formData, setFormData] = useState({
    name: category ? category.category : "",
    alias: category ? category.alias : "",
    prompt: "",
    slack_channel: "",
    border_color: category ? category.color.slice(1) : "",
    icon: category ? `https://aialphaicons.s3.us-east-2.amazonaws.com/${category.alias.toLowerCase()}.png` : "",
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

    if (file && file.type.match("image.*")) {
      const imagePromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            file,
            previewUrl: e.target.result,
          });
        };
        reader.readAsDataURL(file);
      });

      Promise.resolve(imagePromise).then((img) => {
        setFormData({ ...formData, icon: img.previewUrl });
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");

      console.log(formData);

      const response = await fetch(`${config.BASE_URL}/category`, {
        method: "POST",
        body: {
          name: formData.name,
          alias: formData.alias,
          border_color: formData.border_color,
        },
        headers: {
          "X-API-Key": "alpha_U-06Jgo3vbkcUmD2pVGONhYeb9iNFN-C_7086",
        },
      });

      if (response.ok) {
        alert("Category created successfully!");
        //   // Reset form
        setFormData({
          name: "",
          alias: "",
          prompt: "",
          slack_channel: "",
          border_color: "",
          icon: "",
        });
      } else {
        const errorData = await response.json();
        // setError(errorData.message || "Error creating category");
        console.log(errorData);
      }
    } catch (err) {
      setError("An error occurred while creating the category");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {category ? (
          <h4>
            <CIcon icon={cilPen} size="xl" /> Edit Category
          </h4>
        ) : (
          <h4>
            <CIcon icon={cilPlus} size="xl" /> Create New Category
          </h4>
        )}
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
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
          <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <div className={styles.divInput}>
              <input
                type="file"
                accept=".svg"
                onChange={handleImageChange}
                className={styles.imgPicker}
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
              src={formData.icon}
              className={styles.img}
              style={{
                visibility: formData.icon ? "visible" : "hidden",
              }}
            />
          </div>
          <div
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
        >
          Create
        </button>
      </form>
    </>
  );
};

export default NewCategoryForm;
