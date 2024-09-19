import React, { useEffect, useState } from "react";
import config from "src/config";
import "../analysis/analysis.css";
import Swal from "sweetalert2";
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";
import "./index.css";
import { format } from "date-fns";
import Pagination from "../pagination/Pagination";
import SpinnerComponent from "src/components/Spinner";
import NoData from "src/components/NoData";

const Modal = ({ item, base64Image, onClose }) => {
  const formattedSummary = item.analysis
    ? item.analysis.replace(/\n/g, "<br>")
    : item.content.replace(/\n/g, "<br>");

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        {base64Image && (
          <img
            className="modalImage"
            src={`https://appnewsposters.s3.us-east-2.amazonaws.com/${base64Image}`}
            alt="top story"
          />
        )}
        <span
          className="modalText"
          dangerouslySetInnerHTML={{ __html: formattedSummary }}
        />
        <button className="closeButton" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

const Item = ({ item, base64Image, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    onDelete(item.id); // Usamos article_id aquí
  };

  const handleItemClick = (e) => {
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

  const formattedSummary = item.analysis
    ? item.analysis.replace(/\n/g, "<br>")
    : item.content.replace(/\n/g, "<br>");
  const formattedDate = format(new Date(item.date), "MMMM dd, yyyy");
  return (
    <>
      <div className="card" onClick={handleItemClick}>
        {base64Image && (
          <img
            className="card-img-top"
            src={`https://appnewsposters.s3.us-east-2.amazonaws.com/${base64Image}`}
            alt="Analysis"
          />
        )}
        <div className="card-body">
          <h5 className="card-title">{item.title}</h5>
          <p
            className="card-text"
            dangerouslySetInnerHTML={{ __html: formattedSummary }}
          />
          <p className="card-date">
            {formattedDate}
            {onDelete && (
              <CIcon
                size="xxl"
                icon={cilTrash}
                className="deleteBtn"
                onClick={handleClick}
              />
            )}
          </p>
        </div>
      </div>
      {isModalOpen && (
        <Modal
          item={item}
          base64Image={base64Image}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

const TopStories = () => {
  const [topStories, setTopStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(10);

  const getTopStories = async () => {
    try {
      const response1 = await fetch(
        `${config.BOTS_V2_API}/top-stories?limit=150`,
      );
      const data1 = await response1.json();

      if (response1.ok) {
        const topStories = data1.data.filter((article) => article.is_top_story);
        console.log("llegan estas: ", topStories);
        setTopStories(topStories);
      } else {
        console.error("Error fetching:", data1);
      }
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (article_id) => {
    try {
      const response = await fetch(
        `${config.BOTS_V2_API}/api/update/top-story/${article_id}`,
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

  useEffect(() => {
    getTopStories();
  }, []);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = topStories.slice(
    indexOfFirstArticle,
    indexOfLastArticle,
  );

  return (
    <div className="alltopStoriesmain">
      <h3 className="alltopStoriesTitle">Top Stories</h3>
      {loading ? (
        <SpinnerComponent />
      ) : (
        <>
          {currentArticles && currentArticles.length > 0 ? (
            <>
              <div className="card-deck">
                {currentArticles.map((item) => (
                  <Item
                    key={item.article_id}
                    item={item}
                    base64Image={item.image}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
              <Pagination
                totalArticles={topStories.length}
                articlesPerPage={articlesPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </>
          ) : (
            <NoData message={"No Top Stories yet"} />
          )}
        </>
      )}
    </div>
  );
};

export default TopStories;
