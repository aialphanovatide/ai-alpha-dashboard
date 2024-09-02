import {
  cilDataTransferDown,
  cilFile,
  cilImagePlus,
  cilLockLocked,
  cilLockUnlocked,
  cilPlus,
  cilX,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import React, { useState } from "react";
import styles from "./index.module.css";

const NewBotForm = () => {
  const [selectedImg, setSelectedImg] = useState("");
  const [frequency, setFrequency] = useState(50);

  const onFrequencyChange = (e) => {
    setFrequency(e.target.value);
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
          <select className={styles.select}>
            <option defaultValue={"category1"} selected>
              Select category
            </option>
            <option value={"category1"}>category 1</option>
            <option value={"category2"}>catedory 2</option>
            <option value={"category3"}>category 3</option>
          </select>
        </div>
        <div className={styles.section}>
          <label>
            <strong>URL</strong>
          </label>
          <input className={styles.input} placeholder="Enter url" />
        </div>
        <div className={styles.section}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <label>
              <strong>
                <CIcon icon={cilLockUnlocked} />
                Whitelist
              </strong>
            </label>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <button className={styles.button}>
                <CIcon icon={cilFile} />
                Upload .xsl
              </button>
              <button className={styles.button}>
                <CIcon icon={cilDataTransferDown} />
                Download
              </button>
            </div>
          </div>
          <div className={styles.keywordInput}>
            <input placeholder="Enter keywords" />
            <button>
              <CIcon icon={cilPlus} /> Add
            </button>
          </div>
          <div className={styles.keywordsContainer}>
            <div className={styles.keyword}>
              <span>Apple</span>
              <button>
                <CIcon icon={cilX} />
              </button>
            </div>
            <div className={styles.keyword}>
              <span>Comunication</span>
              <button>
                <CIcon icon={cilX} />
              </button>
            </div>
            <div className={styles.keyword}>
              <span>Comunication</span>
              <button>
                <CIcon icon={cilX} />
              </button>
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <label>
              <strong>
                <CIcon icon={cilLockLocked} />
                Blacklist
              </strong>
            </label>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <button className={styles.button}>
                <CIcon icon={cilFile} />
                Upload .xsl
              </button>
              <button className={styles.button}>
                <CIcon icon={cilDataTransferDown} />
                Download
              </button>
            </div>
          </div>
          <div className={styles.keywordInput}>
            <input placeholder="Enter keywords" />
            <button>
              <CIcon icon={cilPlus} /> Add
            </button>
          </div>
          <div className={styles.keywordsContainer}>
            <div className={styles.keyword}>
              <span>Apple</span>
              <button>
                <CIcon icon={cilX} />
              </button>
            </div>
            <div className={styles.keyword}>
              <span>Comunication</span>
              <button>
                <CIcon icon={cilX} />
              </button>
            </div>
            <div className={styles.keyword}>
              <span>Comunication</span>
              <button>
                <CIcon icon={cilX} />
              </button>
            </div>
          </div>
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
            <strong>Run frequency</strong>
          </label>
          <input
            type="number"
            defaultValue={frequency}
            id="frequency"
            onChange={onFrequencyChange}
            className={styles.frequencyInput}
          />
        </div>
        <div className={styles.section}>
          <label>
            <strong>Upload Icon</strong>
          </label>
          <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <div className={styles.imgContainer}></div>
            <div className={styles.divInput}>
              <input
                type="file"
                accept=".png, .jpg, .jpeg"
                onChange={handleImageChange}
                className={styles.imgPicker}
              />
            </div>
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
