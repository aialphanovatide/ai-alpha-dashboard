import React, { useEffect, useState } from "react";
import config from "../../config";
import "./index.css";
import { Link } from "react-router-dom";
import ApiUsage from "./ApiUsage";
import Title from "src/components/commons/Title";

const CenteredBox = ({ title, coin, date, to }) => {
  return (
    <Link to={to} className="centered-box">
      <h1 className="title">{title}</h1>
      <h1 className="subtitle">{coin && `Coin: ${coin.toUpperCase()}`}</h1>
      <h2 className="subtitle">Last update: {date}</h2>
    </Link>
  );
};

const Home = () => {
  const [lastAnalysis, setLastAnalysis] = useState(null);
  const [lastChartUpdate, setLastChartUpdate] = useState(null);
  const [botsStatusMessage, setBotsStatusMessage] = useState("Loading...");

  // Obtener la última actualización del gráfico
  // useEffect(() => {
  //   const getLastChartUpdate = async () => {
  //     try {
  //       const response = await fetch(
  //         `${config.BASE_URL}/get_last_chart_update`,
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //             "ngrok-skip-browser-warning": "true",
  //           },
  //         },
  //       );

  //       if (response.ok) {
  //         const data = await response.json();
  //         const { coin_bot_name, formatted_date } = data.last_update;
  //         setLastChartUpdate({
  //           coin_bot_name: coin_bot_name.toUpperCase(),
  //           formatted_date,
  //         });
  //       } else {
  //         console.error("Error:", response.statusText);
  //       }
  //     } catch (error) {
  //       console.error("Error making request:", error);
  //     }
  //   };

  //   getLastChartUpdate();
  // }, []);

  // Obtener el último análisis creado
  useEffect(() => {
    const getLastAnalysis = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get_last_analysis`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setLastAnalysis(data.last_analysis);
        } else {
          console.error("Error:", data.error);
        }
      } catch (error) {
        console.error("Error making request:", error);
      }
    };

    getLastAnalysis();
  }, []);

  useEffect(() => {
    const getBotsStatus = async () => {
      try {
        const response = await fetch(`${config.BOTS_V2_API}/get_all_bots`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          const bots = data.data;
          console.log("bots, ", bots);
          const allBotsActive = bots.every((bot) => bot.isActive);
          const allBotsInactive = bots.every((bot) => !bot.isActive);

          if (allBotsActive) {
            setBotsStatusMessage("All bots are activated and working.");
          } else if (allBotsInactive) {
            setBotsStatusMessage("All bots are deactivated and not working.");
          } else {
            setBotsStatusMessage("Some bots are activated and working.");
          }
        } else {
          console.error("Error:", response.statusText);
          setBotsStatusMessage("Error fetching bots status.");
        }
      } catch (error) {
        console.error("Error making request:", error);
        setBotsStatusMessage("Error fetching bots status.");
      }
    };

    getBotsStatus();
  }, []);

  const coin =
    lastChartUpdate && lastChartUpdate.coin_bot_name
      ? lastChartUpdate.coin_bot_name
      : "";
  const date =
    lastChartUpdate && lastChartUpdate.formatted_date
      ? lastChartUpdate.formatted_date
      : "No chart yet";

  const analysisDate =
    lastAnalysis && lastAnalysis.created_at
      ? lastAnalysis.created_at
      : "No Analysis yet";
  const analysisCoin =
    lastAnalysis && lastAnalysis.coin_name ? lastAnalysis.coin_name : "";

  return (
    <div className="homeContainer">
      <Title>Home</Title>
      {/* <h3 className="mb-2">General status</h3>
      <div className='dasboardSubMain'>
        <CenteredBox title="News Bot" date={botsStatusMessage} to={"/botsSettings"} />
        <CenteredBox title="Chart" coin={coin} date={date} to={"/chartsPage"} />
        <CenteredBox title="Analysis" coin={analysisCoin} date={analysisDate} to={"/analysis"} />
      </div> */}
      <div>
        <ApiUsage />
      </div>
    </div>
  );
};

export default Home;
