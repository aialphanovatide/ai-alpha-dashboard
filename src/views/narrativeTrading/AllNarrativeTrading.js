import React, { useState } from "react";
import config from "src/config";
import Swal from "sweetalert2";
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";
import EditModal from "./editModal";

const Item = ({ item, onDelete, base64Image, openEditModal }) => {
  console.log("item: ", item)
  const handleDeleteClick = (event) => {
    event.stopPropagation(); // Detiene la propagación del evento click
    onDelete(item.narrative_trading_id); // Llama a la función onDelete con el ID del análisis
  };

  const handleItemClick = () => {
    openEditModal(item);
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
        dangerouslySetInnerHTML={{ __html: item.narrative_trading }}
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

const AllNarrativeTrading = ({ items, fetchNarrativeTrading}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNarrativeTrading, setSelectedNarrativeTrading] = useState(null); 

  const openEditModal = (item) => {
    setSelectedNarrativeTrading(item);
    setIsModalOpen(true); 
  };



  // Deletes an analysis
  const handleDelete = async (narrative_trading_id) => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/delete_narrative_trading/${narrative_trading_id}`,
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
        fetchNarrativeTrading();
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
      console.error("Error Narrative Trading:", error);
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
    setIsModalOpen(false)
  };

  const handleSave = async (narrative_trading_id, editedContent) => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/edit_narrative_trading/${narrative_trading_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({ content: editedContent }), 
        }
      );
  
      const data = await response.json();
        
      if (response.ok) {
        console.log("Analysis updated successfully:", data);
        fetchNarrativeTrading();
        closeEditModal(); // Cerrar el modal después de guardar
      } else {
        console.error("Error updating narrative trading:", data.error);
      }
    } catch (error) {
      console.error("Error updating analysis:", error);
    }
  };

  return (
    <div className="allAnalysismain">
      <h3 className="allAnalysisTitle">Selected Coin Narrative Trading</h3>
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
          item={selectedNarrativeTrading}
          onSave={handleSave}
          onClose={closeEditModal}
          fetchNarrativeTrading={fetchNarrativeTrading} 
        />
      )}
      {/* Renderiza el modal si isModalOpen es true */}
    </div>
  );
};

export { AllNarrativeTrading, Item, EditModal };
