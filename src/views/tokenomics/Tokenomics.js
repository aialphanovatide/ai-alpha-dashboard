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
  const [selectedNameBot, setSelectedNameBot] = useState("");
  const [novatideData, setNovatideData] = useState(null);
  const [competitorsCoinNames, setCompetitorsCoinNames] = useState([]);
  const [cometitorsTokenomicData, setCompetitorsTokenomicData] = useState([]);

  useEffect(() => {
    const getAllBots = async () => {
      try {
        const response = await fetch(`${config.BOTS_V2_API}/get_all_coin_bots`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });

        const data = await response.json();
        if (data && data.data.coin_bots) {
          setBots(data.data.coin_bots);
        } else {
          console.error("Error fetching bots:", data.error);
        }
      } catch (error) {
        console.error("Error fetching bots:", error);
      }
    };

    getAllBots();
  }, []);

  useEffect(() => {
    if (tokenomicsData && tokenomicsData.tokenomics_data.length > 1) {
      const competitorsNames = tokenomicsData.tokenomics_data
        .slice(1)
        .map((tokenomic) => tokenomic.tokenomics.token.trim().toLowerCase());
      setCompetitorsCoinNames(competitorsNames);
    }
  }, [tokenomicsData]);


  const fetchData = async () => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/api/get_tokenomics?coin_bot_id=${selectedCoinBot}`,
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

  const fetchNovatideData = async () => {
    try {
      const response = await fetch(
        `https://fsxbdb84-5000.uks1.devtunnels.ms/get/token_data?token_symbol=${selectedNameBot}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
      );
      const data = await response.json();

      if (data) {
        setNovatideData(data.data);
        console.log("fetch novatide", data.data);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchTokenData = async (tokenSymbol) => {
      try {
        const response = await fetch(
          `https://fsxbdb84-5000.uks1.devtunnels.ms/get/token_data?token_symbol=${tokenSymbol}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          },
        );
        const data = await response.json();
        return data.data;
      } catch (error) {
        console.error(`Error fetching data for ${tokenSymbol}:`, error);
        return null;
      }
    };

    if (competitorsCoinNames.length > 0) {
      Promise.all(
        competitorsCoinNames.map((tokenSymbol) => fetchTokenData(tokenSymbol)),
      ).then((results) => {
        const filteredResults = results.filter((result) => result !== null);
        setCompetitorsTokenomicData(filteredResults);
      });
    }
  }, [competitorsCoinNames]);

  useEffect(() => {
    if (selectedCoinBot) {
      fetchData();
      fetchNovatideData();
    }
  }, [selectedCoinBot]);

  const handleCoinBotChange = (value) => {
    const selectedBot = bots.find((bot) => bot.id === Number(value));
    const selectedNameBot = bots.find((bot) => bot.id === Number(value));
    setSelectedCoinBot(value);
    setSelectedNameBot(selectedNameBot ? selectedNameBot.name : "");
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
  };

  const handleEditButtonClick = (id, endpointName) => {
    setSelectedItemForEdit({ id, endpointName });
    setShowEditModal(true);
  };

  const handleDeleteTokenomic = async (tokenomicId) => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/delete_tokenomic/${tokenomicId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      const data = await response.json();

      if (data && data.status === 200) {
        fetchData();
      } else {
        console.error("Error deleting upgrade:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteTokenDistribution = async (tokenDistributionId) => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/delete_token_distribution/${tokenDistributionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      const data = await response.json();

      if (data && data.status === 200) {
        fetchData();
      } else {
        console.error("Error deleting upgrade:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteTokenUtility = async (tokenUtilityId) => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/delete_token_utility/${tokenUtilityId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      const data = await response.json();

      if (data && data.status === 200) {
        fetchData();
      } else {
        console.error("Error deleting TokenUtility:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteValueAccrualMechanisms = async (
    valueAcrrualMechanismId,
  ) => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/delete_value_accrual_mechanism/${valueAcrrualMechanismId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      const data = await response.json();

      if (data && data.status === 200) {
        fetchData();
      } else {
        console.error("Error deleting ValueAccrualMechanisms:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
                  <td className="thGeneral">Action</td>
                </tr>
                <tr>
                  <td className="tdGeneral">
                    {novatideData
                      ? novatideData.tokenname
                      : tokenomicsData.tokenomics_data[0].tokenomics.token}
                  </td>
                  <td className="tdGeneral">
                    {novatideData
                      ? novatideData.total_supply
                      : tokenomicsData.tokenomics_data[0].tokenomics
                          .total_supply}
                  </td>
                  <td className="tdGeneral">
                    {novatideData
                      ? novatideData.circulating_supply
                      : tokenomicsData.tokenomics_data[0].tokenomics
                          .circulating_supply}
                  </td>
                  <td className="tdGeneral">
                    {novatideData
                      ? novatideData.percentage_circulating_supply.toFixed(2)
                      : tokenomicsData.tokenomics_data[0].tokenomics
                          .percentage_circulating_supply}
                  </td>
                  <td className="tdGeneral">
                    {novatideData && novatideData.max_supply
                      ? novatideData.max_supply
                      : tokenomicsData.tokenomics_data[0].tokenomics.max_supply}
                  </td>

                  <td className="tdGeneral">
                    {novatideData
                      ? novatideData.supply_model
                      : tokenomicsData.tokenomics_data[0].tokenomics
                          .supply_model}
                  </td>
                  <td className="tdGeneral">
                    <Button
                      onClick={() =>
                        handleEditButtonClick(
                          tokenomicsData.tokenomics_data[0].tokenomics.id,
                          "tokenomics",
                        )
                      }
                      disabled={!!novatideData} // Deshabilita si novatideData existe
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          )}
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
                  <td className="thGeneral">Actions</td>
                </tr>
                {cometitorsTokenomicData && cometitorsTokenomicData.length > 0
                  ? cometitorsTokenomicData.map((tokenomic, index) => (
                      <tr key={index}>
                        <td className="tdGeneral">
                          {tokenomic.tokenname} / {tokenomic.symbol}
                        </td>
                        <td className="tdGeneral">
                          {tokenomic.total_supply}
                        </td>
                        <td className="tdGeneral">
                          {tokenomic.circulating_supply}
                        </td>
                        <td className="tdGeneral">
                          {tokenomic.percentage_circulating_supply.toFixed(2)}
                        </td>
                        <td className="tdGeneral">
                        {tokenomic && tokenomic.max_supply
                      ? tokenomic.max_supply
                      : "∞"}
                        </td>
                        <td className="tdGeneral">
                          {tokenomic.supply_model}
                        </td>
                        <td className="tdGeneral">
                          <Button
                            disabled
                          >
                            Edit
                          </Button>
                          <Button
                            style={{ marginLeft: "10px" }}
                            variant="danger"
                            disabled
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  : tokenomicsData.tokenomics_data
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
                          <td className="tdGeneral">
                            <Button
                              onClick={() =>
                                handleEditButtonClick(
                                  tokenomic.tokenomics.id,
                                  "tokenomics",
                                )
                              }
                            >
                              Edit
                            </Button>
                            <Button
                              style={{ marginLeft: "10px" }}
                              variant="danger"
                              onClick={() =>
                                handleDeleteTokenomic(tokenomic.tokenomics.id)
                              }
                            >
                              Delete
                            </Button>
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
                  <td className="thGeneral">Holder Category</td>
                  <td className="thGeneral">Percentage Held</td>
                  <td className="thGeneral">Action</td>
                </tr>
                {tokenomicsData.token_distribution.map((value, index) => (
                  <tr key={index}>
                    <td className="tdGeneral">
                      {value.token_distributions.holder_category}
                    </td>
                    <td className="tdGeneral">
                      {value.token_distributions.percentage_held}
                    </td>
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
                      <Button
                        style={{ marginLeft: "10px" }}
                        variant="danger"
                        onClick={() =>
                          handleDeleteTokenDistribution(
                            value.token_distributions.id,
                          )
                        }
                      >
                        Delete
                      </Button>
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
                  <td className="thGeneral">Token Applications</td>
                  <td className="thGeneral">Description</td>
                  <td className="thGeneral">Action</td>
                </tr>
                {tokenomicsData.token_utility.map((value, index) => (
                  <tr key={index}>
                    <td className="tdGeneral">
                      {value.token_utilities.token_application}
                    </td>
                    <td className="tdGeneral">
                      {value.token_utilities.description}
                    </td>
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
                      <Button
                        style={{ marginLeft: "10px" }}
                        variant="danger"
                        onClick={() =>
                          handleDeleteTokenUtility(value.token_utilities.id)
                        }
                      >
                        Delete
                      </Button>
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
                  <td className="thGeneral">Mechanisms</td>
                  <td className="thGeneral">Description</td>
                  <td className="thGeneral">Actions</td>
                </tr>
                {tokenomicsData.value_accrual_mechanisms.map((value, index) => (
                  <tr key={index}>
                    <td className="tdGeneral">
                      {value.value_accrual_mechanisms.mechanism}
                    </td>
                    <td className="tdGeneral">
                      {value.value_accrual_mechanisms.description}
                    </td>
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
                      <Button
                        style={{ marginLeft: "10px" }}
                        variant="danger"
                        onClick={() =>
                          handleDeleteValueAccrualMechanisms(
                            value.value_accrual_mechanisms.id,
                          )
                        }
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      )}

      <TokenomicsModal
        selectedCoinBot={selectedCoinBot}
        showModal={showModal}
        handleClose={handleClose}
        coinName={selectedCoinName}
      />
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
