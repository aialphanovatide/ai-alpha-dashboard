import React, { useEffect, useState } from 'react';
import { Gauge } from 'react-circular-gauge';
import './spinner.css'
import config from "../../config";

const SpinnerComponent = () => {
    return (
      <div className="spinner-container">
        <div className="spinner-border"></div>
      </div>
    );
  };

const ApiUsage = () => {
  const [coingeckoData, setCoingeckoData] = useState(null);
  const [openaiData, setOpenaiData] = useState(null);
  const [isCoingeckoLoading, setIsCoingeckoLoading] = useState(true);
  const [isOpenaiLoading, setIsOpenaiLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch CoinGecko data
        const cgResponse = await fetch(`${config.BOTS_V2_API}/api/cg-usage`);
        if (!cgResponse.ok) {
          throw new Error('Network response was not ok for CoinGecko');
        }
        const cgData = await cgResponse.json();
        setCoingeckoData(cgData.data);
        setIsCoingeckoLoading(false);

        // Fetch OpenAI data
        const openaiResponse = await fetch(`${config.BOTS_V2_API}/api/openai-usage`);
        if (!openaiResponse.ok) {
          throw new Error('Network response was not ok for OpenAI');
        }
        const openaiData = await openaiResponse.json();
        setOpenaiData(openaiData.data);
        setIsOpenaiLoading(false);
      } catch (error) {
        console.error('Error fetching usage data:', error);
        setIsCoingeckoLoading(false);
        setIsOpenaiLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px', display: 'flex', gap: '20px' }}>
      {/* CoinGecko Card */}
      <div style={{ flex: 1 }}>
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#f9f9f9',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}>
          <h4>CoinGecko API</h4>
          {isCoingeckoLoading ? (
            <SpinnerComponent />
          ) : (
            coingeckoData && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Gauge
                  value={coingeckoData.monthly_call_credit > 0 
                    ? (coingeckoData.current_total_monthly_calls / coingeckoData.monthly_call_credit) * 100 
                    : 0}
                  min={0}
                  max={100}
                  label="Usage"
                  units="%"
                  style={{ width: '100px', height: '100px' }}
                  color="#90EE90"
                  fillColor="#90EE90"
                />
                <div style={{ marginLeft: '20px' }}>
                  <p>{`Current Credit Usage: ${coingeckoData.current_total_monthly_calls} / ${coingeckoData.monthly_call_credit}`}</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* OpenAI Card */}
      <div style={{ flex: 1 }}>
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#f9f9f9',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}>
          <h4 >OpenAI API</h4>
          {isOpenaiLoading ? (
            <SpinnerComponent />
          ) : (
            openaiData && (
              <div>
                <p style={{ color: '#ff7f50' }}>{`Tokens GPT-4: ${openaiData.total_tokens_gpt4}`}</p>
                <p style={{ color: '#ff7f50' }}>{`Cost GPT-4: $${openaiData.total_cost_gpt4.toFixed(2)}`}</p>
                <p style={{ color: '#ff7f50' }}>{`Images DALL-E 3: ${openaiData.total_images_dalle3}`}</p>
                <p style={{ color: '#ff7f50' }}>{`Cost DALL-E 3: $${openaiData.total_cost_dalle3.toFixed(2)}`}</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiUsage;
