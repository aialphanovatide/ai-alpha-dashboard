import React, { useCallback, useEffect, useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CRow,
  CInputGroup,
  CInputGroupText,
  CFormInput,
} from "@coreui/react";
import "../chartsPage/ChartsPage.css";
import config from "../../config";
import Swal from "sweetalert2";
import Title from "src/components/commons/Title";

const ChartsPage = () => {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [selectedCoinName, setSelectedCoinName] = useState(null);
  const [formData, setFormData] = useState({
    support1: "",
    support2: "",
    support3: "",
    support4: "",
    resistance1: "",
    resistance2: "",
    resistance3: "",
    resistance4: "",
  });
  const [coinBots, setCoinBots] = useState([]);
  const [coinData, setCoinData] = useState([]);
  const [temp, setTemp] = useState("");
  const [pairValue, setPairValue] = useState("");
  const [isEssential, setIsEssential] = useState(false);

  const temporalities = ["1h", "4h", "1d", "1w"];
  const pairs = ["usdt", "btc", "eth"];

  // Gets all the coins
  useEffect(() => {
    const fetchCoinBots = async () => {
      try {
        const response = await fetch(
          `${config.BOTS_V2_API}/get_all_coin_bots`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setCoinBots(data.data.coin_bots);
        } else {
          console.error("Error fetching coin bots:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching coin bots:", error);
      }
    };

    fetchCoinBots();
  }, []);

  const fetchCoinData = useCallback(async () => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/api/coin-support-resistance?coin_id=${selectedCoin}&temporality=${temp}&pair=${pairValue}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
      );
      const data = await response.json();
      if (response.ok) {
        setCoinData(data.message);
      } else {
        setCoinData([]);
        console.error("Error fetching coin data:", response.statusText);
      }
    } catch (error) {
      setCoinData([]);
      console.error("Error fetching coin data:", error);
    }
  }, [selectedCoin, temp, pairValue]);

  // Gets the S&R of a coin
  useEffect(() => {
    if (selectedCoin && temp && pairValue) {
      fetchCoinData();
    }
  }, [selectedCoin, temp, pairValue, fetchCoinData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectedCoin = (event) => {
    setSelectedCoin(event.target.value);

    const selectedCoinName =
      event.target.options[event.target.selectedIndex].id;
    setSelectedCoinName(selectedCoinName);

    setFormData({
      support1: "",
      support2: "",
      support3: "",
      support4: "",
      resistance1: "",
      resistance2: "",
      resistance3: "",
      resistance4: "",
    });
  };

  const handleTemporality = (event) => {
    setTemp(event.target.value);
  };

  const handlePair = (event) => {
    setPairValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${config.BASE_URL_DEV}/chart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          support_1: formData.support1,
          support_2: formData.support2,
          support_3: formData.support3,
          support_4: formData.support4,
          resistance_1: formData.resistance1,
          resistance_2: formData.resistance2,
          resistance_3: formData.resistance3,
          resistance_4: formData.resistance4,
          coin_id: selectedCoin,
          coin_name: selectedCoinName,
          pair: pairValue,
          temporality: temp,
          is_essential: isEssential,
        }),
      });

      const responseData = await response.json();
      if (response.ok) {
        setFormData({
          support1: "",
          support2: "",
          support3: "",
          support4: "",
          resistance1: "",
          resistance2: "",
          resistance3: "",
          resistance4: "",
        });
        setIsEssential(false);
        fetchCoinData();

        Swal.fire({
          icon: "success",
          title: responseData.message,
          showConfirmButton: false,
          timer: 1000,
        });
      } else {
        console.error("Error saving chart:", response.statusText);
        Swal.fire({
          icon: "error",
          title: responseData.message,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error saving chart:", error);
      Swal.fire({
        icon: "error",
        title: error,
        showConfirmButton: false,
      });
    }
  };

  function formatNumberToCurrency(number) {
    const decimalPlaces = (number.toString().split(".")[1] || "").length;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(number);
  }

  const supports = [
    coinData.support_1,
    coinData.support_2,
    coinData.support_3,
    coinData.support_4,
  ];

  const resistances = [
    coinData.resistance_1,
    coinData.resistance_2,
    coinData.resistance_3,
    coinData.resistance_4,
  ];

  return (
    <CRow>
      <CCol className="mainContainer" xs="13">
        <Title>Support & Resistance</Title>
        <CCard className="card">
          <CCardBody className="cardBody">
            <form className="form" onSubmit={handleSubmit}>
              {/* Select coin */}
              <div className="mb-3">
                <CInputGroup>
                  <CInputGroupText>Coin</CInputGroupText>
                  <select
                    className="form-control"
                    name="coin_bot_id"
                    value={selectedCoin}
                    onChange={handleSelectedCoin}
                    required
                  >
                    <option>Select...</option>
                    {coinBots.map((coinBot) => (
                      <option
                        className="coinName"
                        key={coinBot.id}
                        id={coinBot.name}
                        value={coinBot.id}
                      >
                        {coinBot.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </CInputGroup>
              </div>

              {/* Select temporality and pair */}
              <div className="chartOptions">
                <CInputGroup>
                  <CInputGroupText>Temporality</CInputGroupText>
                  <select
                    className="form-control"
                    name="temporality"
                    value={temp}
                    onChange={handleTemporality}
                    required
                  >
                    <option>Select...</option>
                    {temporalities.map((value) => (
                      <option className="tempOption" key={value} value={value}>
                        {value.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </CInputGroup>
                <CInputGroup>
                  <CInputGroupText>Pair</CInputGroupText>
                  <select
                    className="form-control"
                    name="pair"
                    value={pairValue}
                    onChange={handlePair}
                    required
                  >
                    <option>Select...</option>
                    {pairs.map((value) => (
                      <option className="tempOption" key={value} value={value}>
                        {value.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </CInputGroup>
              </div>

              <CRow>
                <CCol className="column" md="6">
                  {[1, 2, 3, 4].map((index) => (
                    <div key={`support${index}`} className="mb-3">
                      <CInputGroup>
                        <CInputGroupText>{`Support ${index}`}</CInputGroupText>
                        <CFormInput
                          type="number"
                          name={`support${index}`}
                          value={formData[`support${index}`]}
                          onChange={handleChange}
                          required
                          className="input"
                          placeholder={
                            supports[index - 1]
                              ? formatNumberToCurrency(supports[index - 1])
                              : ""
                          }
                        />
                      </CInputGroup>
                    </div>
                  ))}
                </CCol>
              </CRow>

              <CRow>
                <CCol className="column" md="6">
                  {[1, 2, 3, 4].map((index) => (
                    <div key={`resistance${index}`} className="mb-3">
                      <CInputGroup>
                        <CInputGroupText>{`Resistance ${index}`}</CInputGroupText>
                        <CFormInput
                          type="number"
                          name={`resistance${index}`}
                          value={formData[`resistance${index}`]}
                          onChange={handleChange}
                          required
                          className="input"
                          placeholder={
                            resistances[index - 1]
                              ? formatNumberToCurrency(resistances[index - 1])
                              : ""
                          }
                        />
                      </CInputGroup>
                    </div>
                  ))}
                </CCol>
              </CRow>
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  value={isEssential}
                  onChange={() => setIsEssential(!isEssential)}
                />
                <label className="label">Essential Update</label>
              </div>
              <div className="lastContainer">
                {/* Submit button */}
                <CButton className="save-btn" type="submit">
                  Save Chart
                </CButton>
              </div>
            </form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ChartsPage;
