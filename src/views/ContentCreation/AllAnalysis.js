import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import EditModal from "./editModal";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  deleteAnalysis,
  editAnalysis,
} from "src/services/contentCreationService";
import Card from "src/components/commons/Card";
import { ReactComponent as ClockBack } from "src/assets/icons/clock-back.svg";
import styles from "./index.module.css";

const Item = ({ item, onDelete, openEditModal, isDeleting }) => {
  const [content, setContent] = useState("");

  const processContent = (item) => {
    const content = item.analysis || item.narrative_trading;
    // const titleMatch = content?.match(/Title:\s*(.*?)\r\n/);

    // if (titleMatch) {
    //   const source = item.analysis ? item.analysis : item.narrative_trading;
    //   return source?.replace(titleMatch[0], "");
    // }
    return content;
  };

  useEffect(() => {
    let content = processContent(item);
    item.content = content;

    setContent(content);
  }, [item]);

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    onDelete(item.analysis_id || item.narrative_trading_id);
  };

  const handleItemClick = () => {
    openEditModal(item);
  };

  return (
    <Card
      data={item}
      onDelete={handleDeleteClick}
      onClick={handleItemClick}
      content={content}
      // onImgLoad={handleImageLoaded}
    />
  );
};

const AllAnalysis = ({ items, fetchAnalysis, section_id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showContent, setShowContent] = useState(false);

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
        section_id: section_id || 34,
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
      closeEditModal();
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => setShowContent(!showContent)}
      >
        <div style={{ display: "flex", gap: 10 }}>
          <ClockBack style={{ height: 28, width: "fit-content" }} />
          <h4 className="allAnalysisTitle">Latests posts</h4>
        </div>
        {showContent ? (
          <ExpandLessIcon color="disabled" fontSize="large" />
        ) : (
          <ExpandMoreIcon color="disabled" fontSize="large" />
        )}
      </div>
      {showContent && (
        <>
          <div className="latestPostsContainer">
            {items.map((item, index) => (
              <Item
                key={index}
                item={item}
                onDelete={handleDelete}
                openEditModal={openEditModal}
                isDeleting={isDeleting}
              />
            ))}
          </div>
          <button className={styles.seeMoreButton}>
            See more
            <ChevronRightIcon />
          </button>
        </>
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
