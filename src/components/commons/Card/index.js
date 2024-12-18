import React, { useState } from "react";
import "./index.css";
import { AccessTime } from "@mui/icons-material";
import defaultImg from "src/assets/brand/logo.png";
import { Modal } from "react-bootstrap";
import styles from "./index.module.css";
import { ReactComponent as TrashIcon } from "src/assets/icons/trash.svg";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";

const Card = (props) => {
  const {
    data = {},
    onClick,
    onDelete,
    onImgLoad,
    content,
    title,
    image,
    date,
    coinIcon,
    categoryIcon,
    sectionName,
  } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="search-tool-item" style={{ width: "100%" }}>
        <img
          className={`img-modal-news-card`}
          src={data?.image || image}
          onLoad={onImgLoad || null}
          alt="card-img"
          onError={(e) => (e.target.src = defaultImg)}
          onClick={onClick ? onClick : () => setIsModalOpen(true)}
        />
        <div
          className={styles.dataContainer}
          onClick={onClick ? onClick : () => setIsModalOpen(true)}
        >
          {(data?.title || title) && (
            <h6 className={styles.title}>{data?.title || title}</h6>
          )}
          {(data?.date || date) && (
            <span className={styles.date}>
              <AccessTime fontSize="small" />
              {data?.date || date}
            </span>
          )}
          {data?.reason && <p>{data?.reason}</p>}
          <p dangerouslySetInnerHTML={{ __html: data?.content || content }} />
          {data?.comment && (
            <span style={{ paddingInline: 10 }}>{data?.comment}</span>
          )}
        </div>
        <div className="details-container">
          {data?.tagColor && (
            <div className="tags-container">
              <div
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: "50%",
                  background: data?.tagColor,
                }}
              ></div>
            </div>
          )}
          {onDelete && (
            <TrashIcon
              onClick={onDelete}
              className="trashBtn"
              style={{ height: 20, width: "fit-content" }}
            />
          )}
          {sectionName && (
            <span style={{ color: "#a3a3a3" }}>{sectionName}</span>
          )}
          <div>
            {categoryIcon && (
              <img
                src={categoryIcon}
                alt="category-icon"
                onError={(e) => (e.target.style.display = "none")}
                className={styles.smallIcon}
              />
            )}
            {coinIcon && (
              <img
                src={coinIcon}
                alt="coin-icon"
                onError={(e) => (e.target.style.display = "none")}
                className={styles.smallIcon}
              />
            )}
          </div>
        </div>
      </div>
      <Modal
        size={"xl"}
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
        className={styles.cardModal}
      >
        <button
          className={styles.closeModalBtn}
          onClick={() => setIsModalOpen(false)}
        >
          <CIcon icon={cilX} size="lg" />
        </button>
        <img
          src={data?.image || image}
          alt="card-img"
          className={styles.modalImg}
          onError={(e) => (e.target.src = defaultImg)}
        />
        <div className={styles.modalDataContainer}>
          <h6 className={styles.modalTitle}>{data?.title || title}</h6>
          <span className={styles.date}>
            <AccessTime fontSize="small" />
            {data?.date || date}
          </span>
          <p
            dangerouslySetInnerHTML={{ __html: data?.content || content }}
            className={styles.content}
          />
        </div>
      </Modal>
    </>
  );
};

export default Card;
