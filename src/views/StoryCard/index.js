import React, { useState } from "react";
import config from "src/config";
import Swal from "sweetalert2";
import { formatDateTime } from "src/utils";
import Card from "src/components/commons/Card";
import SpinnerComponent from "src/components/Spinner";
import { AccessTime } from "@mui/icons-material";

const StoryCard = ({ article, getTopStories }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      const response = await fetch(
        `${config.BOTS_V2_API}/api/update/top-story/${article.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        getTopStories();
      } else {
        console.error("Error updating:", data);
        Swal.fire({
          icon: "error",
          title: data.error,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error updating:", error);
      Swal.fire({
        icon: "error",
        title: error,
        showConfirmButton: false,
      });
    }
  };

  const onClick = (e) => {
    if (
      e.target.classList.contains("deleteBtn") ||
      e.target.parentElement.classList.contains("deleteBtn")
    ) {
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleImageLoaded = () => {
    setImageLoaded(true);
  };

  article = {
    ...article,
    image: `https://appnewsposters.s3.us-east-2.amazonaws.com/${article.image}`,
    date: formatDateTime(article.date),
    content: article.analysis
      ? article.analysis.replace(/\n/g, "<br>")
      : article.content.replace(/\n/g, "<br>"),
  };

  return (
    <>
      <Card
        data={article}
        onDelete={handleDelete}
        onClick={onClick}
        onImgLoad={handleImageLoaded}
      />
      {isModalOpen && (
        <div className={`modal ${imageLoaded ? "" : "loading"}`}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={handleCloseModal}>
              &times;
            </button>
            {!imageLoaded ? (
              <SpinnerComponent />
            ) : (
              <>
                <img
                  className={`img-modal-news ${
                    imageLoaded ? "img-modal-news-show" : "img-modal-news-hide"
                  }`}
                  src={article.image}
                  onLoad={handleImageLoaded}
                  alt="News"
                />
                <h2>{article.title}</h2>
                <p><AccessTime />{" "}{article.date}</p>
                <p>{article.content}</p>
                <p>{article.is_article_efficent}</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default StoryCard;
