import React, { useEffect, useState } from "react";
import { Item } from "./AllNarrativeTrading";
import config from "src/config";
import "./analysis.css";
import EditModal from "./editModal";
import NoData from "src/components/NoData";

const GeneralNarrativeTrading = ({
  success,
  onSuccess,
  fetchNarrativeTrading,
}) => {
  const [generalNarrativeTrading, setGeneralNarrativeTrading] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNarrativeTrading, setSelectedNarrativeTrading] =
    useState(null);

  const openEditModal = (NarrativeTrading) => {
    setSelectedNarrativeTrading(NarrativeTrading);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedNarrativeTrading(null);
    setIsEditModalOpen(false);
  };

  const fetchGeneralNarrativeTrading = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/get_narrative_trading`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setGeneralNarrativeTrading(data.data);
      } else {
        console.error("Error fetching coin bots:", data.error);
      }
    } catch (error) {
      console.error("Error fetching coin bots:", error);
    }
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
        },
      );

      const data = await response.json();

      if (response.ok) {
        fetchNarrativeTrading();
        fetchGeneralNarrativeTrading();
        closeEditModal();
      } else {
        console.error("Error updating analysis:", data.error);
      }
    } catch (error) {
      console.error("Error updating analysis:", error);
    }
  };

  useEffect(() => {
    fetchGeneralNarrativeTrading();
  }, []);

  useEffect(() => {
    if (success) {
      fetchGeneralNarrativeTrading();
    }
  }, [success]);

  return (
    <div className="analysisSubmain">
      <h3 className="allAnalysisTitle">General Narrative Trading</h3>
      {generalNarrativeTrading && generalNarrativeTrading.length > 0 ? (
        <ul className="allAnalysisUL">
          {generalNarrativeTrading?.map((item) => (
            <Item
              key={item.narrative_trading_id}
              item={item}
              openEditModal={openEditModal}
            />
          ))}
        </ul>
      ) : (
        <NoData message={"No Analysis yet"} />
      )}
      {isEditModalOpen && selectedNarrativeTrading && (
        <EditModal
          item={selectedNarrativeTrading}
          onSave={handleSave}
          onClose={closeEditModal}
          fetchNarrativeTrading={fetchNarrativeTrading}
        />
      )}
    </div>
  );
};

export default GeneralNarrativeTrading;
