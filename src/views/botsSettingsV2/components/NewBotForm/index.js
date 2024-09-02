import { cilImagePlus, cilPlus } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import React, { useState } from "react";
import styles from "./index.module.css";


const NewBotForm = () => {
  const [selectedImg, setSelectedImg] = useState("");

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
        setSelectedImg(img.previewUrl);
      });
    }
  };

  return (
    <>
    <form>
      <h4>
        <CIcon icon={cilPlus} size="xl" /> Create New Bot
      </h4>
      <div className={styles.section}>
        <label>
          <strong>Name</strong>
        </label>
        <input className={styles.input} placeholder="Enter bot name" />
      </div>
      <div className={styles.section}>
        <label>
          <strong>Category</strong>
        </label>
        <input className={styles.input} placeholder="Select category" />
      </div>
      <div className={styles.section}>
        <label>
          <strong>URL</strong>
        </label>
        <input className={styles.input} placeholder="Enter url" />
      </div>
      <div className={styles.section}>
        <label>
          <strong>URL</strong>
        </label>
        <input className={styles.input} placeholder="Enter url" />
      </div>
      <div className={styles.section}>
        <label>
          <strong>DALL-E Prompt</strong>
        </label>
        <textarea
          className={styles.textarea}
          placeholder="Enter article generator prompt. 
            An example of use could be: 
            “Imagine that you are one of the world’s foremost experts on Bitcoin and also a globally renowned journalist skilled at summarizing articles about Bitcoin...”"
        />
      </div>
      <div className={styles.section}>
        <label>
          <strong>Slack Channel</strong>
        </label>
        <input className={styles.input} placeholder="Enter Slack channel ID" />
      </div>
      <div className={styles.section}>
        <label>
          <strong>Upload Icon</strong>
        </label>
        <div className={styles.divInput}>
          {/* <span>No files detected</span>
          <button className={{ background: "#D4D4D4" }}>
            <CIcon icon={cilImagePlus} size="md" />{" "}
            Upload
          </button> */}
          <input
            type="file"
            // id="imageUpload"
            accept=".png, .jpg, .jpeg"
            onChange={handleImageChange}
            className={styles.imgPicker}
          />
        </div>
      </div>
      {/* <div style={{width: "100%", padding: 20, display: "flex"}}>
      <img src={selectedImg} style={{height: 100, width: "auto", margin: "auto", display: selectedImg === "" ? "none" : "block"}} />
      </div> */}
      <button className={styles.submitButton}>Create</button>
    </form>
    </>
  );
};

export default NewBotForm;
