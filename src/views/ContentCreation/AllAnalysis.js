import React, { useState } from "react";
import Swal from "sweetalert2";
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";
import EditModal from "./editModal";
import NoData from "src/components/NoData";
import { formatDateTime } from "src/utils";
import {
  deleteAnalysis,
  editAnalysis,
} from "src/services/contentCreationService";
import defaultImg from "../../assets/brand/logo.png";

const Item = ({ item, onDelete, openEditModal, isDeleting }) => {
  const handleDeleteClick = (event) => {
    event.stopPropagation();
    onDelete(item.analysis_id);
  };

  const handleItemClick = () => {
    openEditModal(item);
  };

  return (
    <li className="allAnalysisLI" onClick={handleItemClick}>
      <img
        // className="itemImage"
        onError={(e) => {
          e.target.src = defaultImg;
        }}
        src={item.image_url || defaultImg}
        alt="Analysis"
        style={{
          margin: 0,
          borderRadius: 0,
          with: "inherit",
          height: "100%",
          borderBottomLeftRadius: 5,
          borderTopLeftRadius: 5,
        }}
      />
      <div
        // className="itemContent"
        style={{
          height: "100%",
          padding: "10px",
          gap: "5%",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "gray",
            fontSize: "smaller",
            height: "10%",
          }}
        >
          <span>{formatDateTime(item.updated_at)}</span>
          {onDelete && (
            <CIcon
              size="md"
              icon={cilTrash}
              className="deleteBtn"
              onClick={handleDeleteClick}
              style={{
                color: isDeleting ? "#8080804d" : "gray",
                cursor: isDeleting ? "not-allowed" : "pointer",
              }}
            />
          )}
        </div>
        <span
          style={{
            height: "85%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "block",
          }}
          // className="itemContent"
          dangerouslySetInnerHTML={{
            __html: item.analysis || item.narrative_trading,
          }}
        />
      </div>
    </li>
  );
};

const AllAnalysis = ({
  items,
  fetchAnalysis,
  section_id,
  section_name,
  coin_name,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openEditModal = (item) => {
    setSelectedAnalysis(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (analysis_id) => {
    try {
      setIsDeleting(true);
      const response = await deleteAnalysis(analysis_id, section_id);

      if (!response.success) {
        throw new Error(response.error);
      }

      Swal.fire({
        icon: "success",
        title: "Analysis deleted successfully",
        customClass: "swal",
        backdrop: false,
      });
      fetchAnalysis();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.message || "An error occurred",
        customClass: "swal",
        backdrop: false,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (analysis_id, section_id, editedContent) => {
    try {
      const payload = {
        content: editedContent,
        section_id: section_id || 3,
      };

      const response = await editAnalysis(analysis_id, payload);

      if (!response.success) {
        throw new Error(response.error);
      }

      closeEditModal();
      Swal.fire({
        icon: "success",
        title: "Analysis updated successfully",
        customClass: "swal",
        backdrop: false,
      });
      fetchAnalysis();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.message || "An error occurred",
        customClass: "swal",
        backdrop: false,
      });
    }
  };

  return (
    <div className="analysisSubmain">
      <h4 className="allAnalysisTitle">{`${
        coin_name ? coin_name : ""
      }  ${section_name} Analyses`}</h4>
      {items && items.length > 0 ? (
        <ul className="allAnalysisUL">
          {items.map((item) => (
            <Item
              key={item.analysis_id}
              item={item}
              onDelete={handleDelete}
              openEditModal={openEditModal}
              isDeleting={isDeleting}
            />
          ))}
        </ul>
      ) : (
        <NoData message={"No Analysis found for this coin"} />
      )}
      {isModalOpen && (
        <EditModal
          item={selectedAnalysis}
          onSave={handleSave}
          onClose={closeEditModal}
          section_id={section_id}
        />
      )}
    </div>
  );
};

export { AllAnalysis, Item, EditModal };
