import React, { useEffect, useState } from "react";
import { Gauge } from "react-circular-gauge";
import config from "../../../config";
import "./index.css";
import SpinnerComponent from "src/components/Spinner";

const ApiUsage = () => {
  const [coingeckoData, setCoingeckoData] = useState(null);
  const [coingeckoUsage, setCoingeckoUsage] = useState(null);
  const [isCoingeckoLoading, setIsCoingeckoLoading] = useState(true);
  // const [openaiData, setOpenaiData] = useState(null);
  // const [isOpenaiLoading, setIsOpenaiLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch CoinGecko data
        const cgResponse = await fetch(`${config.BASE_URL}/coingecko/usage`,
          {
            headers: {
              "x-api-key": config.X_API_KEY,
            },
          },
        )
        if (!cgResponse.ok) {
          throw new Error("Network response was not ok for CoinGecko");
        }
        const cgData = await cgResponse.json();
        setCoingeckoData(cgData.data);
        setCoingeckoUsage(
          cgData.data.monthly_call_credit > 0
            ? (cgData.data.current_total_monthly_calls /
                cgData.data.monthly_call_credit) *
                100
            : 0,
        );
        setIsCoingeckoLoading(false);

        // Fetch OpenAI data
        // const openaiResponse = await fetch(`${config.BOTS_V2_API}/api/openai-usage`);
        // if (!openaiResponse.ok) {
        //   throw new Error('Network response was not ok for OpenAI');
        // }
        // const openaiData = await openaiResponse.json();

        // setOpenaiData(openaiData.data);
        // setIsOpenaiLoading(false);
      } catch (error) {
        console.error("Error fetching usage data:", error);
        setIsCoingeckoLoading(false);
        // setIsOpenaiLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="cards-container">
      {/* CoinGecko Card */}
      <div className="api-card">
        {isCoingeckoLoading ? (
          <SpinnerComponent style={{height: "100%"}} />
        ) : (
          <>
            <h4 style={{ height: "20%" }}>CoinGecko API</h4>
            {coingeckoData ? (
              <div className="coin-gecko-info-container">
                <div className="gauge-container">
                  <Gauge
                    value={coingeckoUsage}
                    min={0}
                    max={100}
                    units="%"
                    renderBottomLabel="%"
                    style={{ width: "90px", height: "90px" }}
                    arcColor={coingeckoUsage > 80 ? "red" : "green"}
                    className="gauge"
                  />
                  <span style={{ fontWeight: 500, fontSize: "small" }}>
                    Usage Percentage
                  </span>
                </div>
                <ul className="coin-gecko-ul">
                  <li><strong>Remaining credits:</strong> {coingeckoData.current_remaining_monthly_calls}</li>
                  <li><strong>Current used credits:</strong> {coingeckoData.current_total_monthly_calls}</li>
                  <li><strong> Total credits:</strong> {coingeckoData.monthly_call_credit}</li>
                  <li><strong>Plan:</strong> {coingeckoData.plan}</li>
                </ul>
              </div>
            ) : (
              <div className="error-container">
                <span>An error ocurred while fetching the data</span>
              </div>
            )}
          </>
        )}
      </div>
      {/* OpenAI Card */}
      {/* <div className="api-card">
        {isOpenaiLoading ? (
          <SpinnerComponent height="100%" />
        ) : (
          <>
            <h4 style={{ height: "20%" }}>OpenAI API</h4>
            {openaiData ? (
              <ul className="openai-info-container">
                <li>
                  <strong>Tokens GPT-4:</strong> {openaiData.total_tokens_gpt4}
                </li>
                <li>
                  <strong>Cost GPT-4:</strong>{" "}
                  {openaiData.total_cost_gpt4.toFixed(2)}
                </li>
                <li>
                  <strong>Images DALL-E 3:</strong>{" "}
                  {openaiData.total_images_dalle3}
                </li>
                <li>
                  <strong>Cost DALL-E 3:</strong>{" "}
                  {openaiData.total_cost_dalle3.toFixed(2)}
                </li>
              </ul>
            ) : (
              <div className="error-container">
                <span>An error ocurred while fetching the data</span>
              </div>
            )}
          </>
        )}
      </div> */}
    </div>
  );
};

export default ApiUsage;
