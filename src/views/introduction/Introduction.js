import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import config from "../../config";
import Swal from "sweetalert2";
import RichTextEditor from "../../views/helpers/textEditor/textEditor"; 

const Introduction = () => {
  const [bots, setBots] = useState([]);
  const [selectedCoinBot, setSelectedCoinBot] = useState("");
  const [content, setContent] = useState("");
  const [website, setWebsite] = useState("");
  const [whitepaper, setWhitepaper] = useState("");
  const [hasIntroductionData, setHasIntroductionData] = useState(false);

  // Get all the coins
  useEffect(() => {
    const getAllBots = async () => {
      try {
        const response = await fetch(`${config.BOTS_V2_DEV_API}/bots`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });

        const data = await response.json();
        if (data && data.data) {
          setBots(data.data);
        } else {
          console.error("Error fetching bots:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getAllBots();
  }, []);

  // Get the introduction of the selected coin
  useEffect(() => {
    const getIntroductionData = async () => {
      try {
        const response = await fetch(
          `${config.BASE_URL_DEV}/api/get_introduction?id=${selectedCoinBot}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
              'X-Api-Key': config.X_API_KEY_DEV
            },
          },
        );

        const data = await response.json();

        if (data.message.content) {
          const { content, website, whitepaper } = data.message;
          setContent(content || "");
          setWebsite(website || "");
          setWhitepaper(whitepaper || "");
          setHasIntroductionData(true);
        } else {
          setContent("");
          setWebsite("");
          setWhitepaper("");
          setHasIntroductionData(false);
        }
      } catch (error) {
        console.error("Error fetching introduction data:", error);
      }
    };

    if (selectedCoinBot) {
      getIntroductionData();
    }
  }, [selectedCoinBot]);

  const handleWebsiteChange = (value) => {
    setWebsite(value);
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleWhitepaperChange = (value) => {
    setWhitepaper(value);
  };

  const handleSelectedCoin = (value) => {
    setSelectedCoinBot(value);
  };

  // Updates the introduction of a coin
  const handleUpdateClick = async () => {
    try {
      if (!selectedCoinBot) {
        Swal.fire({
          icon: "error",
          title: "Please, select a coin",
          showConfirmButton: false,
          customClass: "swal",
        });
        return;
      }

      const data = {
        coin_bot_id: selectedCoinBot,
        content: content,
        website: website,
        whitepaper: whitepaper,
      };

      const response = await fetch(
        `${config.BASE_URL}/edit_introduction/${selectedCoinBot}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(data),
        },
      );

      const responseData = await response.json();

      if (responseData.status === 200) {
        Swal.fire({
          icon: "success",
          title: responseData.message,
          showConfirmButton: false,
          timer: 1000,
          customClass: "swal",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: responseData.message,
          showConfirmButton: false,
          customClass: "swal",
        });
      }

      setContent("");
      setWebsite("");
      setWhitepaper("");
      setHasIntroductionData(false);
      setSelectedCoinBot("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error,
        showConfirmButton: false,
        customClass: "swal",
      });
    }
  };

  // create an introduction for a coin
  const handleCreateClick = async () => {
    try {
      if (!selectedCoinBot || !content) {
        Swal.fire({
          icon: "error",
          title: "Coin or content is missing",
          showConfirmButton: false,
          customClass: "swal",
        });
        return;
      }

      const data = {
        coin_bot_id: selectedCoinBot,
        content: content,
        website: website,
        whitepaper: whitepaper,
      };

      const response = await fetch(`${config.BASE_URL_DEV}/post_introduction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          "X-API-KEY": config.X_API_KEY_DEV,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (responseData.status === 200) {
        Swal.fire({
          icon: "success",
          title: responseData.message,
          showConfirmButton: false,
          timer: 3000,
          customClass: "swal",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: responseData.message,
          showConfirmButton: false,
          customClass: "swal",
        });
      }

      setContent("");
      setWebsite("");
      setWhitepaper("");
      setHasIntroductionData(false);
      setSelectedCoinBot("");
    } catch (error) {
      Swal.fire({
        icon: "success",
        title: error,
        showConfirmButton: false,
        customClass: "swal",
      });
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h3>Introduction</h3>

      {/* Select coin */}
      <Form.Group controlId="coinBotSelect" style={{ marginBottom: "15px" }}>
        <Form.Label>Select Coin</Form.Label>
        <Form.Control
          as="select"
          value={selectedCoinBot}
          onChange={(e) => handleSelectedCoin(e.target.value)}
        >
          <option value="">Select...</option>
          {bots &&
            bots?.map((bot) => (
              <option key={bot.id} value={bot.id}>
                {bot.name.toUpperCase() || "No Name"}
              </option>
            ))}
        </Form.Control>
      </Form.Group>
      <Form.Label>Content</Form.Label>        
      <RichTextEditor
        initialContent={content} 
        onContentChange={setContent} 
      />
      <br></br>
      <br></br>
      <br></br>
      <Form.Group controlId="websiteInput" style={{ marginBottom: "15px" }}>
        <Form.Label>Website</Form.Label>
        <Form.Control
          required
          style={{ height: "40px" }}
          type="text"
          placeholder="Enter website..."
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="whitepaperInput" style={{ marginBottom: "15px" }}>
        <Form.Label>Whitepaper</Form.Label>
        <Form.Control
          required
          style={{ height: "40px" }}
          type="text"
          placeholder="Enter whitepaper..."
          value={whitepaper}
          onChange={(e) => setWhitepaper(e.target.value)}
        />
      </Form.Group>
      {hasIntroductionData ? (
        <Button
          variant="primary"
          disabled={!selectedCoinBot}
          onClick={handleUpdateClick}
        >
          Update Introduction
        </Button>
      ) : (
        <Button
          variant="primary"
          disabled={!selectedCoinBot || !content}
          onClick={handleCreateClick}
        >
          Create Introduction
        </Button>
      )}
    </div>
  );
};

export default Introduction;