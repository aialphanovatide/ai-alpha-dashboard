import React, { useState, useEffect } from "react";
import { Form, Table, Button } from "react-bootstrap";
import "./tokenomics.css";
import config from "../../config";
import TokenomicsModal from "./TokenomicsModal";
import TokenomicsEditModal from "./tokenomicsEditModal";

const Tokenomics = () => {
  const [bots, setBots] = useState([]);
  const [tokenomicsData, setTokenomicsData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);
  const [selectedCoinBot, setSelectedCoinBot] = useState("");
  const [selectedCoinName, setSelectedCoinName] = useState(null);

  // Gets all the available coins
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
        console.error("Error fetching bots:", error);
      }
    };

    getAllBots();
  }, []);

  // Gets all the tokenomics of a coin - FUNCTION
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/get_tokenomics?coin_bot_id=${selectedCoinBot}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
      );
      const data = await response.json();

      if (data.message) {
        setTokenomicsData(data.message);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Gets all the tokenomics of a coin
  useEffect(() => {
    if (selectedCoinBot) {
      fetchData();
    }
  }, [selectedCoinBot]);

  const handleCoinBotChange = (value) => {
    const selectedBot = bots.find((bot) => bot.id === Number(value));
    setSelectedCoinBot(value);
    setSelectedCoinName(
      selectedBot &&
        tokenomicsData &&
        tokenomicsData.tokenomics_data.length === 0
        ? selectedBot.name
        : null,
    );
  };

  const handleClose = () => {
    setShowModal(false);
    setShowEditModal(false);
    setSelectedCoinBot("");
    setTokenomicsData(null);
  };

  const handleEditButtonClick = (id, endpointName) => {
    setSelectedItemForEdit({ id, endpointName });
    setShowEditModal(true);
  };

  console.log("tokenomicsData: ", tokenomicsData);

  return (
    <div className="formGeneralMain" style={{ margin: "20px" }}>
      <h2>Tokenomics</h2>

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

      <Button disabled={!selectedCoinBot} onClick={() => setShowModal(true)}>
        Add Tokenomics
      </Button>

      {/* TOKENOMICS */}
      {tokenomicsData !== null && (
        <div className="tokenomicsMain">
          {tokenomicsData.tokenomics_data.length > 0 && (
            <Table
              className="tokenomicsTable"
              responsive
              striped
              bordered
              hover
            >
              <h2 className="tableSubTitle">Tokenomic</h2>
              <tbody className="tableBody">
                <tr className="tableHead">
                  <td className="thGeneral">Token</td>
                  <td className="thGeneral">Total Supply</td>
                  <td className="thGeneral">Circulating Supply</td>
                  <td className="thGeneral">% Circulating Supply</td>
                  <td className="thGeneral">Max Supply</td>
                  <td className="thGeneral">Supply Model</td>
                </tr>
                {tokenomicsData.tokenomics_data.length > 0 && (
                  <tr>
                    <td className="tdGeneral">
                      {tokenomicsData.tokenomics_data[0].tokenomics.token}
                    </td>
                    <td className="tdGeneral">
                      {
                        tokenomicsData.tokenomics_data[0].tokenomics
                          .total_supply
                      }
                    </td>
                    <td className="tdGeneral">
                      {
                        tokenomicsData.tokenomics_data[0].tokenomics
                          .circulating_supply
                      }
                    </td>
                    <td className="tdGeneral">
                      {
                        tokenomicsData.tokenomics_data[0].tokenomics
                          .percentage_circulating_supply
                      }
                    </td>
                    <td className="tdGeneral">
                      {tokenomicsData.tokenomics_data[0].tokenomics.max_supply}
                    </td>
                    <td className="tdGeneral">
                      {
                        tokenomicsData.tokenomics_data[0].tokenomics
                          .supply_model
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
          {/* COMPETITORS TOKENOMICS */}
          {tokenomicsData.tokenomics_data.length > 0 && (
            <Table className="tokenomicsTable" striped bordered hover>
              <h2 className="tableSubTitle">Competitors Tokenomics</h2>
              <tbody>
                <tr>
                  <td className="thGeneral">Token</td>
                  <td className="thGeneral">Total Supply</td>
                  <td className="thGeneral">Circulating Supply</td>
                  <td className="thGeneral">% Circulating Supply</td>
                  <td className="thGeneral">Max Supply</td>
                  <td className="thGeneral">Supply Model</td>
                </tr>
                {tokenomicsData.tokenomics_data.length > 1 &&
                  tokenomicsData.tokenomics_data
                    .slice(1)
                    .map((tokenomic, index) => (
                      <tr key={index}>
                        <td className="tdGeneral">
                          {tokenomic.tokenomics.token}
                        </td>
                        <td className="tdGeneral">
                          {tokenomic.tokenomics.total_supply}
                        </td>
                        <td className="tdGeneral">
                          {tokenomic.tokenomics.circulating_supply}
                        </td>
                        <td className="tdGeneral">
                          {tokenomic.tokenomics.percentage_circulating_supply}
                        </td>
                        <td className="tdGeneral">
                          {tokenomic.tokenomics.max_supply}
                        </td>
                        <td className="tdGeneral">
                          {tokenomic.tokenomics.supply_model}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </Table>
          )}
          {/* TOKEN DISTRIBUTION */}
          {tokenomicsData.token_distribution.length > 0 && (
            <Table className="tokenomicsTable" striped bordered hover>
              <h2 className="tableSubTitle">Token Distribution</h2>
              <tbody>
                <tr>
                  <td className="thGeneral">Action</td>
                  <td className="thGeneral">Holder Category</td>
                  <td className="thGeneral">Percentage Held</td>
                </tr>
                {tokenomicsData.token_distribution.map((value, index) => (
                  <tr key={index}>
                    <td className="thGeneral">
                      <Button
                        onClick={() =>
                          handleEditButtonClick(
                            value.token_distributions.id,
                            "token distribution",
                          )
                        }
                      >
                        Edit
                      </Button>
                    </td>
                    <td className="tdGeneral">
                      {value.token_distributions.holder_category}
                    </td>
                    <td className="tdGeneral">
                      {value.token_distributions.percentage_held}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          {/* TOKEN UTILITY */}
          {tokenomicsData.token_utility.length > 0 && (
            <Table className="tokenomicsTable" striped bordered hover>
              <h2 className="tableSubTitle">Token Utility</h2>
              <tbody>
                <tr>
                  <td className="thGeneral">Action</td>
                  <td className="thGeneral">Token Applications</td>
                  <td className="thGeneral">Description</td>
                </tr>
                {tokenomicsData.token_utility.map((value, index) => (
                  <tr key={index}>
                    <td className="thGeneral">
                      <Button
                        onClick={() =>
                          handleEditButtonClick(
                            value.token_utilities.id,
                            "token utility",
                          )
                        }
                      >
                        Edit
                      </Button>
                    </td>
                    <td className="tdGeneral">
                      {value.token_utilities.token_application}
                    </td>
                    <td className="tdGeneral">
                      {value.token_utilities.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* VALUE ACCRUAL MECHANISM */}
          {tokenomicsData.value_accrual_mechanisms.length > 0 && (
            <Table className="tokenomicsTable" striped bordered hover>
              <h2 className="tableSubTitle">Value Accrual Mechanisms</h2>
              <tbody>
                <tr>
                  <td className="thGeneral">Action</td>
                  <td className="thGeneral">Mechanisms</td>
                  <td className="thGeneral">Description</td>
                </tr>
                {tokenomicsData.value_accrual_mechanisms.map((value, index) => (
                  <tr key={index}>
                    <td className="thGeneral">
                      <Button
                        onClick={() =>
                          handleEditButtonClick(
                            value.value_accrual_mechanisms.id,
                            "value accrua mechanisms",
                          )
                        }
                      >
                        Edit
                      </Button>
                    </td>
                    <td className="tdGeneral">
                      {value.value_accrual_mechanisms.mechanism}
                    </td>
                    <td className="tdGeneral">
                      {value.value_accrual_mechanisms.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      )}

      {/* Modal for creation*/}
      <TokenomicsModal
        selectedCoinBot={selectedCoinBot}
        showModal={showModal}
        handleClose={handleClose}
        coinName={selectedCoinName}
      />
      {/* Modal for edition */}
      <TokenomicsEditModal
        selectedCoinBot={selectedCoinBot}
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        selectedItemForEdit={selectedItemForEdit}
        fetchData={fetchData}
      />
    </div>
  );
};

export default Tokenomics;
