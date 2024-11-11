import { cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { getBot } from "src/services/botService";
import Swal from "sweetalert2";
import defaultImg from "../../assets/brand/logo.png";
import { formatDateTime } from "src/utils";
import styles from "./index.module.css";

const CoinBotDetails = ({ isVisible, setIsVisible, coin }) => {
  const [bot, setBot] = useState(null);

  // coin
  // {
  //   "alias": "aliass",
  //   "background_color": "f5f5",
  //   "bot_id": 35,
  //   "category_id": 14,
  //   "created_at": "Thu, 25 Jan 2024 18:34:17 GMT",
  //   "gecko_id": "fetch-ai",
  //   "icon": null,
  //   "is_active": false,
  //   "name": "Fet",
  //   "symbol": "FET",
  //   "updated_at": "Wed, 06 Nov 2024 05:29:07 GMT"
  // }

  // bot
  //   {
  //     "alias": "aliass",
  //     "background_color": "f5f5",
  //     "blacklist": [
  //         "200-Day Moving Average",
  //         "200-day moving average",
  //         "50-Day Moving Average",
  //         "50-day moving average",
  //         "ATH (All-Time High)",
  //         "Bear Market Trends",
  //         "Bearish Trend",
  //         "Bearish/Bullish Trends",
  //         "Breakout",
  //         "Breakout Signals",
  //         "Bull Market Rally",
  //         "Bullish Trend",
  //         "Buy Signal",
  //         "Candlestick Patterns",
  //         "Candlestick Patterns",
  //         "Chart Analysis",
  //         "Chart Patterns",
  //         "Correction Forecast",
  //         "Crypto Dump",
  //         "Crypto Market Crash",
  //         "Crypto Pump",
  //         "Crypto Speculation",
  //         "Cup and Handle Pattern",
  //         "Day Trading",
  //         "Day Trading Tips",
  //         "Double Bottom/Top Pattern",
  //         "Double Top/Bottom",
  //         "Elliott Wave Theory",
  //         "FOMO (Fear of Missing Out)",
  //         "Fibonacci Retracement",
  //         "Fibonacci Retracement",
  //         "Golden Cross/Death Cross",
  //         "HODL (Hold On for Dear Life)",
  //         "HODL Strategy",
  //         "Head and Shoulders Pattern",
  //         "Head and Shoulders Pattern",
  //         "Long-term Price Projection",
  //         "MACD (Moving Average Convergence Divergence)",
  //         "MACD (Moving Average Convergence Divergence)",
  //         "Market Cap Predictions",
  //         "Market Crash",
  //         "Market Sentiment",
  //         "Market Sentiment",
  //         "Mooning",
  //         "Mooning",
  //         "Moving Averages",
  //         "Next Bull Run",
  //         "Next Bull Run",
  //         "Overbought",
  //         "Overbought/Oversold",
  //         "Oversold",
  //         "Overvalued/Undervalued",
  //         "Parabolic Move",
  //         "Price Action",
  //         "Price Action",
  //         "Price Analysis",
  //         "Price Breakout",
  //         "Price Forecast",
  //         "Price Forecast",
  //         "Price Prediction",
  //         "Price Spike",
  //         "Price Target",
  //         "Price Target",
  //         "Profit Potential",
  //         "Profit Potential",
  //         "Pump and Dump",
  //         "Pump and Dump",
  //         "RSI (Relative Strength Index)",
  //         "RSI (Relative Strength Index)",
  //         "Resistance Level",
  //         "Resistance Levels",
  //         "Risk Management Strategies",
  //         "Scalping",
  //         "Sell Signal",
  //         "Sell-off Predictions",
  //         "Sentiment Indicators",
  //         "Short Selling",
  //         "Short-term Gains",
  //         "Speculative Growth",
  //         "Stop Loss",
  //         "Support Level",
  //         "Support Levels",
  //         "Swing Trading",
  //         "Swing Trading Tips",
  //         "Technical Analysis",
  //         "Technical Analysis",
  //         "Trading Volume",
  //         "Trend Reversal",
  //         "Volume Analysis",
  //         "Volume Spikes",
  //         "Whale Movements",
  //         "ath (all-time high)",
  //         "bear market trends",
  //         "bearish trend",
  //         "bearish/bullish trends",
  //         "breakout",
  //         "breakout signals",
  //         "bull market rally",
  //         "bullish trend",
  //         "buy signal",
  //         "candlestick patterns",
  //         "chart analysis",
  //         "chart patterns",
  //         "correction forecast",
  //         "crypto dump",
  //         "crypto market crash",
  //         "crypto pump",
  //         "crypto speculation",
  //         "cup and handle pattern",
  //         "day trading",
  //         "day trading tips",
  //         "double bottom/top pattern",
  //         "double top/bottom",
  //         "elliott wave theory",
  //         "fibonacci retracement",
  //         "fomo (fear of missing out)",
  //         "golden cross/death cross",
  //         "head and shoulders pattern",
  //         "hodl (hold on for dear life)",
  //         "hodl strategy",
  //         "long-term price projection",
  //         "macd (moving average convergence divergence)",
  //         "market cap predictions",
  //         "market crash",
  //         "market sentiment",
  //         "mooning",
  //         "moving averages",
  //         "next bull run",
  //         "overbought",
  //         "overbought/oversold",
  //         "oversold",
  //         "overvalued/undervalued",
  //         "parabolic move",
  //         "price action",
  //         "price analysis",
  //         "price breakout",
  //         "price forecast",
  //         "price prediction",
  //         "price spike",
  //         "price target",
  //         "profit potential",
  //         "pump and dump",
  //         "resistance level",
  //         "resistance levels",
  //         "risk management strategies",
  //         "rsi (relative strength index)",
  //         "scalping",
  //         "sell signal",
  //         "sell-off predictions",
  //         "sentiment indicators",
  //         "short selling",
  //         "short-term gains",
  //         "speculative growth",
  //         "stop loss",
  //         "support level",
  //         "support levels",
  //         "swing trading",
  //         "swing trading tips",
  //         "technical analysis",
  //         "trading volume",
  //         "trend reversal",
  //         "volume analysis",
  //         "volume spikes",
  //         "whale movements"
  //     ],
  //     "category_id": 14,
  //     "created_at": null,
  //     "dalle_prompt": "dalle prompt",
  //     "icon": "https://aialphaicons.s3.us-east-2.amazonaws.com/aliass.svg",
  //     "id": 35,
  //     "is_active": false,
  //     "keywords": [
  //         "AI Cryptocurrency Trends",
  //         "Artificial Superintelligence Alliance (ASI) Token Merger",
  //         "FET Fibonacci Retracement",
  //         "FET Long-Term Investment",
  //         "FET Market Analysis",
  //         "FET Market Sentiment",
  //         "FET Moving Average",
  //         "FET Price Prediction",
  //         "FET RSI Analysis",
  //         "FET Technical Analysis",
  //         "FET Trading Strategies",
  //         "Fetch Crypto Market Trends",
  //         "Fetch.AI AI Integration",
  //         "Fetch.AI Agent-based Systems",
  //         "Fetch.AI Autonomous Economy",
  //         "Fetch.AI Blockchain",
  //         "Fetch.AI Collective Learning",
  //         "Fetch.AI Community Growth",
  //         "Fetch.AI Cryptocurrency",
  //         "Fetch.AI Data Monetization",
  //         "Fetch.AI DeFi Solutions",
  //         "Fetch.AI Decentralized Applications",
  //         "Fetch.AI Developer Updates",
  //         "Fetch.AI Ecosystem Growth",
  //         "Fetch.AI Internet of Things (IoT)",
  //         "Fetch.AI Machine Learning Integration",
  //         "Fetch.AI Multi-agent Framework",
  //         "Fetch.AI News",
  //         "Fetch.AI Partnerships",
  //         "Fetch.AI Partnerships with Bosch",
  //         "Fetch.AI Price Prediction",
  //         "Fetch.AI Roadmap",
  //         "Fetch.AI Smart Contracts",
  //         "Fetch.AI Staking Rewards",
  //         "Fetch.AI Technical Analysis",
  //         "Fetch.AI Token Listings",
  //         "Fetch.AI Token Utility",
  //         "Fetch.AI Tokenomics",
  //         "Fetch.AI Trading Volume",
  //         "Fetch.AI Use Cases",
  //         "Fetch.AI and Ethereum Integration",
  //         "Fetch.ai DabbaFlow Platform",
  //         "Fetch.ai Development Roadmap",
  //         "Fetch.ai Ecosystem Developments",
  //         "Fetch.ai Market Structure",
  //         "Fetch.ai News",
  //         "Fetch.ai Partnerships and Collaborations",
  //         "Fetch.ai Price Action",
  //         "Fetch.ai Price Breakout",
  //         "Fetch.ai Price Forecast",
  //         "Fetch.ai Technical Updates",
  //         "Fetch.ai Token Metrics",
  //         "Fetch.ai Whale Movements",
  //         "ai cryptocurrency trends",
  //         "artificial superintelligence alliance (asi) token merger",
  //         "fet fibonacci retracement",
  //         "fet long-term investment",
  //         "fet market analysis",
  //         "fet market sentiment",
  //         "fet moving average",
  //         "fet price prediction",
  //         "fet rsi analysis",
  //         "fet technical analysis",
  //         "fet trading strategies",
  //         "fetch crypto market trends",
  //         "fetch.ai agent-based systems",
  //         "fetch.ai ai integration",
  //         "fetch.ai and ethereum integration",
  //         "fetch.ai autonomous economy",
  //         "fetch.ai blockchain",
  //         "fetch.ai collective learning",
  //         "fetch.ai community growth",
  //         "fetch.ai cryptocurrency",
  //         "fetch.ai dabbaflow platform",
  //         "fetch.ai data monetization",
  //         "fetch.ai decentralized applications",
  //         "fetch.ai defi solutions",
  //         "fetch.ai developer updates",
  //         "fetch.ai development roadmap",
  //         "fetch.ai ecosystem developments",
  //         "fetch.ai ecosystem growth",
  //         "fetch.ai internet of things (iot)",
  //         "fetch.ai machine learning integration",
  //         "fetch.ai market structure",
  //         "fetch.ai multi-agent framework",
  //         "fetch.ai news",
  //         "fetch.ai partnerships",
  //         "fetch.ai partnerships and collaborations",
  //         "fetch.ai partnerships with bosch",
  //         "fetch.ai price action",
  //         "fetch.ai price breakout",
  //         "fetch.ai price forecast",
  //         "fetch.ai price prediction",
  //         "fetch.ai roadmap",
  //         "fetch.ai smart contracts",
  //         "fetch.ai staking rewards",
  //         "fetch.ai technical analysis",
  //         "fetch.ai technical updates",
  //         "fetch.ai token listings",
  //         "fetch.ai token metrics",
  //         "fetch.ai token utility",
  //         "fetch.ai tokenomics",
  //         "fetch.ai trading volume",
  //         "fetch.ai use cases",
  //         "fetch.ai whale movements"
  //     ],
  //     "last_run_status": null,
  //     "last_run_time": null,
  //     "name": "Fet",
  //     "next_run_time": null,
  //     "prompt": "news prompt",
  //     "run_count": null,
  //     "run_frequency": "24",
  //     "site": {
  //         "bot_id": 35,
  //         "created_at": null,
  //         "id": 496,
  //         "name": "Google News",
  //         "updated_at": null,
  //         "url": "https://news.google.com/search?q=Render%20RNDR%20%22Render%22%20%22RNDR%22%20when%3A1d%20-MSN%20-medium%20-yahoo&hl=en-US&gl=US&ceid=US%3Aen"
  //     },
  //     "status": null,
  //     "updated_at": "Wed, 06 Nov 2024 05:29:08 GMT"
  // }

  const fetchBotDetails = async () => {
    try {
      const bot = await getBot(coin.name, "name");
      setBot(bot.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: error.message,
      });
    }
  };

  useEffect(() => {
    isVisible && fetchBotDetails();
  }, [isVisible]);

  return (
    <Modal show={isVisible} onHide={() => setIsVisible(false)} className={styles.modal}>
      <button onClick={() => setIsVisible(false)} className={styles.closeBtn}>
        <CIcon icon={cilX} size="xl" />
      </button>
      <div>
        <div>
          <div
            className="img-container"
            style={{
              borderRadius: "50%",
              border: "2px solid",
              backgroundColor: coin.background_color
                ? coin.background_color
                : "gray",
            }}
          >
            <img
              alt="item-icon"
              src={
                coin.icon ||
                `https://aialphaicons.s3.us-east-2.amazonaws.com/coins/${coin.name?.toLowerCase()}.png`
              }
              onError={(e) => (e.target.src = defaultImg)}
            />
          </div>
          <div className="item-details">
            <div className="item-name">{coin.name}</div>
            <div>{coin.alias}</div>
            <div className="item-last-run">
              Last Run: {formatDateTime(coin.updated_at)}
            </div>
          </div>
        </div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </Modal>
  );
};

export default CoinBotDetails;
