  import React, { useState } from "react";
  import config from "src/config";
  import Swal from "sweetalert2";
  import CIcon from "@coreui/icons-react";
  import { cilTrash } from "@coreui/icons";

  const Modal = ({ item, base64Image, onClose }) => {
    const getAlignmentStyle = (alignment) => {
      switch (alignment) {
        case "ql-align-left":
          return { textAlign: "left" };
        case "ql-align-right":
          return { textAlign: "right" };
        case "ql-align-center":
          return { textAlign: "center" };
        default:
          return {};
      }
    };

    const getContentWithStyles = () => {
      const content = item.analysis;
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      const elements = doc.body.childNodes;

      const styledElements = Array.from(elements).map((el, index) => {
        if (el.nodeName === "P") {
          // Obtener las clases de alineación
          const alignment = el.className;
          // Llamar a la función getAlignmentStyle para obtener los estilos de alineación
          const style = getAlignmentStyle(alignment);
          console.log('style', style)
          return (
            <p
              key={index}
              className={alignment}
              style={style}
              dangerouslySetInnerHTML={{ __html: el.innerHTML }}
            />
          );
        } else if (el.nodeName === "IMG") {
          // Manejar imágenes incrustadas manteniendo la funcionalidad actual
          return <img key={index} src={el.src} alt="Analysis Image" />;
        } else {
          // Mantener otros nodos sin estilos
          return null;
        }
      });

      return styledElements.filter((el) => el !== null);
    };

    return (
      <div className="modalOverlay" onClick={onClose}>
        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
          {base64Image && (
            <img
              className="modalImage"
              src={`data:image/png;base64,${base64Image}`}
              alt="Analysis"
            />
          )}
          <div className="modalText">
            {/* Renderizar el contenido con estilos de alineación y manejo de imágenes */}
            {getContentWithStyles()}
          </div>
          <button className="closeButton" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  };

  const Item = ({ item, onDelete, base64Image }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
      onDelete(item.analysis_id);
    };

    const handleItemClick = (e) => {
      // Check if the click target or its parent has the deleteBtn class
      if (
        e.target.classList.contains("deleteBtn") ||
        e.target.parentElement.classList.contains("deleteBtn")
      ) {
        // If it is, do not open the modal
        return;
      }

      // Otherwise, open the modal
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    return (
      <>
        <li className="allAnalysisLI" onClick={handleItemClick}>
          {base64Image && (
            <img
              className="itemImage"
              src={`data:image/png;base64,${base64Image}`}
              alt="Analysis"
            />
          )}
          <span
            className="itemContent"
            dangerouslySetInnerHTML={{ __html: item.analysis }}
          />
          {onDelete && (
            <CIcon
              size="xxl"
              icon={cilTrash}
              className="deleteBtn"
              onClick={handleClick}
            />
          )}
        </li>
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

  const AllAnalysis = ({ items, fetchAnalysis }) => {
    // Deletes an analysis
    const handleDelete = async (analysis_id) => {
      try {
        const response = await fetch(
          `${config.BASE_URL}/delete_analysis/${analysis_id}`,
          {
            method: "DELETE",
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
          fetchAnalysis();
        } else {
          console.error("Error fetching coin bots:", response.statusText);
          Swal.fire({
            icon: "error",
            title: data.error,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        console.error("Error fetching coin bots:", error);
        Swal.fire({
          icon: "error",
          title: error,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };

    return (
      <div className="allAnalysismain">
        <h3 className="allAnalysisTitle">Selected Coin Analysis</h3>
        {items && items.length > 0 ? (
          <ul className="allAnalysisUL">
            {items.map((item) => (
              <Item key={item.analysis_id} item={item} onDelete={handleDelete} />
            ))}
          </ul>
        ) : (
          <span>No Analysis found for this coin</span>
        )}
      </div>
    );
  };

  export { AllAnalysis, Item, Modal };
