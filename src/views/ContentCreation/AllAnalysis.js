import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import EditModal from "./editModal";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { deleteAnalysis } from "src/services/contentCreationService";
import Card from "src/components/commons/Card";
import { ReactComponent as ClockBack } from "src/assets/icons/clock-back.svg";
import styles from "./index.module.css";
import { formatDateTime } from "src/utils";
import { useNavigate } from "react-router-dom";

const Item = ({ item, onDelete }) => {
  const handleDeleteClick = (event) => {
    event.stopPropagation();
    onDelete(item.id, item.section_id);
  };

  return (
    <Card
      onDelete={handleDeleteClick}
      content={item.content}
      title={item.title}
      image={item.image_url}
      date={formatDateTime(item.created_at)}
      sectionName={item.section_name}
      categoryIcon={item.category_icon}
      coinIcon={item.coin_icon}
    />
  );
};

const AllAnalysis = ({ items, fetchAnalysis }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async (analysis_id, section_id) => {
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

  const handleRedirect = () => {
    navigate("/newsSearchTool?data=analysis");
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
              <Item key={index} item={item} onDelete={handleDelete} />
            ))}
          </div>
          <button className={styles.seeMoreButton} onClick={handleRedirect}>
            See more
            <ChevronRightIcon />
          </button>
        </>
      )}
    </div>
  );
};

export { AllAnalysis, Item, EditModal };
