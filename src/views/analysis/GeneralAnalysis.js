import React, { useEffect, useState } from "react";
import { Item } from "./AllAnalysis";
import config from "src/config";
import "./analysis.css";
import EditModal from "./editModal";

const GeneralAnalysis = ({ success, onSuccess, fetchAnalysis }) => {
  const [generalAnalysis, setGeneralAnalysis] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const openEditModal = (analysis) => {
    setSelectedAnalysis(analysis);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedAnalysis(null);
    setIsEditModalOpen(false);
  };

  const fetchGeneralAnalysis = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/get_analysis`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setGeneralAnalysis(data.message);
      } else {
        console.error("Error fetching coin bots:", data.message);
      }
    } catch (error) {
      console.error("Error fetching coin bots:", error);
    }
  };

  const handleSave = async (analysis_id, editedContent) => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/edit_analysis/${analysis_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({ content: editedContent }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        fetchAnalysis();
        fetchGeneralAnalysis();
        closeEditModal();
      } else {
        console.error("Error updating analysis:", data.error);
      }
    } catch (error) {
      console.error("Error updating analysis:", error);
    }
  };

  useEffect(() => {
    fetchGeneralAnalysis();
  }, []);

  useEffect(() => {
    if (success) {
      fetchGeneralAnalysis();
    }
  }, [success]);

  return (
    <div className="allAnalysismain">
      <h3 className="allAnalysisTitle">General Analysis</h3>
      {generalAnalysis && generalAnalysis.length > 0 ? (
        <ul className="allAnalysisUL">
          {generalAnalysis?.map((item) => (
            <Item
              key={item.analysis_id}
              item={item}
              openEditModal={openEditModal}
            />
            
          ))}
        </ul>
      ) : (
        <span>No Analysis yet</span>
      )}
      {isEditModalOpen && selectedAnalysis && (
        <EditModal
          item={selectedAnalysis}
          onSave={handleSave}
          onClose={closeEditModal}
          fetchAnalysis={fetchAnalysis} // Aquí pasamos fetchAnalysis como prop
        />
      )}
    </div>
  );
};

export default GeneralAnalysis;
