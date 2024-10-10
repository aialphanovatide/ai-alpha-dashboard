import React from "react";
import "./index.css";
import { AccessTime } from "@mui/icons-material";
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";

const Card = (props) => {
  const { data, onClick, onDelete, onImgLoad } = props;

  return (
    <div
      className="search-tool-item"
      style={{ width: "100%" }}
      onClick={onClick}
    >
      <img
        className={`img-modal-news-card`}
        src={data.image}
        onLoad={onImgLoad}
        alt="news"
      />
      <h6 style={{ margin: 10 }}>
        <strong>{data.title || "No Title"}</strong>
      </h6>
      {data.reason && <p>{data.reason}</p>}
      <p dangerouslySetInnerHTML={{ __html: data.content || "No Content" }} />
      {data.comment && (
        <span style={{ paddingInline: 10 }}>{data.comment}</span>
      )}
      <div className="details-container">
        {data.date && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 14,
            }}
          >
            <AccessTime />
            <strong>{data.date}</strong>
          </span>
        )}
        <div className="tags-container">
          {data.is_top_story && !onDelete && (
            <span className="tag top-story">TOP STORY</span>
          )}
          {data.tagColor && (
            <div
              style={{
                height: 20,
                width: 20,
                borderRadius: "50%",
                background: data.tagColor,
              }}
            ></div>
          )}
          {onDelete && (
            <CIcon
              size="lg"
              icon={cilTrash}
              className="deleteBtn"
              onClick={onDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
