import React, { useEffect, useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import config from "../../config";
import RMForm from "./RMForm";
import RMEditForm from "./RMEditForm";
import "./revenue.css";

const RevenueModels = () => {
  const [selectedCoinBot, setSelectedCoinBot] = useState("");
  const [revenueModels, setRevenueModels] = useState(null);
  const [bots, setBots] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // Get all the coins
  useEffect(() => {
    const getAllBots = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get_all_coin_bots`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });

        const data = await response.json();
        if (data && data.coin_bots) {
          setBots(data.coin_bots);
        } else {
          console.error("Error fetching bots:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    getAllBots();
  }, []);

  // Gets the revenue of coin
  useEffect(() => {
    const getRevenueModels = async () => {
      try {
        // Clean prev state
        setRevenueModels(null);

        // Get the revenue
        const response = await fetch(
          `${config.BASE_URL}/api/get_revenue_models?coin_id=${selectedCoinBot}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          },
        );

        const data = await response.json();
        if (data && data.status === 200) {
          setRevenueModels(data.revenue_model);
        } else {
          console.error("Error fetching Revenue Models:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (selectedCoinBot) {
      getRevenueModels();
    }
  }, [selectedCoinBot]);

  const handleCoinBotChange = (value) => {
    setSelectedCoinBot(value);
  };

  const getRevenueModels = async () => {
    try {
      // Clean prev state
      setRevenueModels(null);

      // Get the revenue
      const response = await fetch(
        `${config.BASE_URL}/api/get_revenue_models?coin_id=${selectedCoinBot}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      const data = await response.json();
      if (data && data.status === 200) {
        setRevenueModels(data.revenue_model);
      } else {
        console.error("Error fetching Revenue Models:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Edits a revenue model
  const handleEditFormSubmit = async (formData) => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/api/edit_revenue_model/${selectedCoinBot}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();
      if (response.status === 200) {
        setTimeout(() => {
          setShowEditForm(false);
        }, 2000);
        return data.message;
      } else {
        return data.error;
      }
    } catch (error) {
      console.error("Error editing revenue model:", error);
    } finally {
      getRevenueModels();
    }
  };

  // Creates a revenue model
  const handleCreateClick = async (formData) => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/api/create_revenue_model`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            coin_bot_id: selectedCoinBot,
            analized_revenue: formData.analized_revenue,
          }),
        },
      );

      const data = await response.json();
      if (data.status === 200) {
        return data.message;
      } else {
        return data.message;
      }
    } catch (error) {
      return error;
    } finally {
      getRevenueModels();
    }
  };

  return (
    <div>
      <div style={{ margin: "20px" }}>
        <h2>Revenue model</h2>

        {/* Select of the coin */}
        <Form.Group controlId="coinBotSelect" style={{ marginBottom: "15px" }}>
          <Form.Label>Select Coin</Form.Label>
          <Form.Control
            as="select"
            value={selectedCoinBot}
            onChange={(e) => handleCoinBotChange(e.target.value)}
          >
            <option value="">Select...</option>
            {bots.map((bot) => (
              <option key={bot.id} value={bot.id}>
                {bot.name.toUpperCase() || "No Name"}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <div className="revenueMain">
          <div className="revenueTagMain">
            <span className="revenueTitle">Annualised Revenue:</span>
            <span className="revenueTag">*Cumulative last 1yr revenue</span>
          </div>
          <span className="revenueValue">
            {revenueModels && revenueModels.analized_revenue
              ? revenueModels.analized_revenue
              : "No revenue model"}
          </span>
        </div>
        {revenueModels !== null ? (
          <Button
            disabled={!selectedCoinBot}
            variant="primary"
            style={{ marginTop: "10px" }}
            onClick={() => setShowEditForm(true)}
          >
            Update Revenue Model
          </Button>
        ) : (
          <Button
            disabled={!selectedCoinBot}
            variant="primary"
            style={{ marginTop: "10px" }}
            onClick={() => setShowCreateForm(true)}
          >
            Create Revenue Model
          </Button>
        )}
      </div>
      {/* creation modal */}
      <RMForm
        onSubmit={handleCreateClick}
        onCancel={() => setShowCreateForm(false)}
        show={showCreateForm}
      />
      {/* edition modal */}
      <Modal show={showEditForm} onHide={() => setShowEditForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Revenue Model</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RMEditForm
            onSubmit={handleEditFormSubmit}
            revenueModel={
              revenueModels && revenueModels.analized_revenue
                ? revenueModels.analized_revenue
                : "No revenue model"
            }
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RevenueModels;
