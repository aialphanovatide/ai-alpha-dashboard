import React, { useEffect, useState } from "react";
import "./index.css";
import { AccessTime } from "@mui/icons-material";
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";
import defaultImg from "src/assets/brand/logo.png";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Swal from "sweetalert2";
import { deleteFromTopStories, markAsTopStory } from "src/services/topStoriesService";

const Card = (props) => {
  const { data, onClick, onDelete, onImgLoad } = props;
  const [isTopStory, setIsTopStory] = useState(false);
  const [isTopStoryLoading, setTopStoryLoading] = useState(false);

  useEffect(() => {
    setIsTopStory(data.is_top_story);
  }, [data]);

  const handleTopStoryButton = async () => {
    try {
      setTopStoryLoading(true);

      const response = isTopStory
      ? await deleteFromTopStories(data.id)
      : await markAsTopStory(data.id);

      if (!response.success) {
        throw new Error(response.error);
      }

      setIsTopStory(!isTopStory);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Error marking as top story",
        backdrop: false,
        customClass: 'swal',
      });
    } finally {
      setTopStoryLoading(false);
    }
  };

  return (
    <div
      className="search-tool-item"
      style={{ width: "100%" }}
    >
      <img
        className={`img-modal-news-card`}
        src={data.image}
        onLoad={onImgLoad}
        alt="news"
        onError={(e) => (e.target.src = defaultImg)}
      />
      <h6 style={{ margin: 10 }}>
        <strong>{data.title || "No Title"}</strong>
      </h6>
      {data.reason && <p>{data.reason}</p>}
      <p dangerouslySetInnerHTML={{ __html: data.content || "No Content" }} />
      {data.comment && (
        <span style={{ paddingInline: 10 }}>{data.comment}</span>
      )}
      <div className="details-container" onClick={onClick}>
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
          <button
            className="topStoryButton"
            onClick={handleTopStoryButton}
            disabled={isTopStoryLoading}
          >
            {isTopStory ? <StarIcon /> : <StarBorderIcon />}
          </button>
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
