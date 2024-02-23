import React, { useState } from "react";
import config from "src/config";
import Swal from "sweetalert2";
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";
import EditModal from "./editModal";

const Item = ({ item, onDelete, base64Image, openEditModal }) => {
  const handleDeleteClick = (event) => {
    event.stopPropagation(); // Detiene la propagación del evento click
    onDelete(item.analysis_id); // Llama a la función onDelete con el ID del análisis
  };

  const handleItemClick = () => {
    openEditModal(item); // Llama a la función openEditModal con el análisis correspondiente
  };

  return (
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
          onClick={handleDeleteClick}
        />
      )}
    </li>
  );
};

const AllAnalysis = ({ items, fetchAnalysis }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null); 

  const openEditModal = (item) => {
    console.log("Opening edit modal for analysis:", item);
    setSelectedAnalysis(item);
    setIsModalOpen(true); 
  };

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
        fetchAnalysis(); // Actualiza la lista de análisis
      } else {
        console.error("Error deleting analysis:", response.statusText);
        Swal.fire({
          icon: "error",
          title: data.error,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error deleting analysis:", error);
      Swal.fire({
        icon: "error",
        title: error.message || "An error occurred",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  // Función para cerrar el modal de edición
  const closeEditModal = () => {
    setIsModalOpen(false); // Cierra el modal
  };

  // Función para guardar los cambios en el análisis
  const handleSave = async (analysis_id, editedContent) => {
    // Implementa la lógica para guardar los cambios en el análisis
  };

  return (
    <div className="allAnalysismain">
      <h3 className="allAnalysisTitle">Selected Coin Analysis</h3>
      {items && items.length > 0 ? (
        <ul className="allAnalysisUL">
          {items.map((item) => (
            <Item
              key={item.analysis_id}
              item={item}
              onDelete={handleDelete}
              openEditModal={openEditModal}
            />
          ))}
        </ul>
      ) : (
        <span>No Analysis found for this coin</span>
      )}
      {isModalOpen && (
        <EditModal
          item={selectedAnalysis}
          onSave={handleSave}
          onClose={closeEditModal}
        />
      )}
      {/* Renderiza el modal si isModalOpen es true */}
    </div>
  );
};

export { AllAnalysis, Item, EditModal };
