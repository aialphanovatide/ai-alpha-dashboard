import React, { useState } from "react";
import "./SearchToolItem.css";

const SearchToolItem = ({ article }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false); // Estado para controlar la carga de la imagen

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = (e) => {
    e.stopPropagation(); // Evitar la propagación del evento
    setModalOpen(false);
    setImageLoaded(false); // Reiniciar el estado cuando se cierra el modal
  };

  const handleImageLoaded = () => {
    setImageLoaded(true); // Callback para manejar la carga completa de la imagen
  };

  return (
    <div className="search-tool-item" style={{ width: "20em" }} onClick={openModal}>
      <h3>{article.title}</h3>
      <p>{article.content.slice(0, 300)}...</p>
      <span className={`tag ${article.unwanted ? "bin" : "valid"}`}>
        {article.unwanted ? "Bin" : "Valid"}
      </span>
      <p style={{ float: "left", fontSize: "12px" }}>{article.date}</p>

      {modalOpen && (
        <div className={`modal ${imageLoaded ? "" : "loading"}`}>
          <div className="modal-content">
            <button className="close" onClick={closeModal}>
              &times;
            </button>

            {!imageLoaded && <div className="loader"></div>}
            <img
              className={`img-modal-news ${imageLoaded ? "img-modal-news-show" : "img-modal-news-hide"}`}
              src={`https://sitesnewsposters.s3.us-east-2.amazonaws.com/${article.image}`}
              onLoad={handleImageLoaded}
              alt={article.title}
            />
            <h2>{article.title}</h2>
            <p>{article.date}</p>
            <p>{article.content}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchToolItem;
