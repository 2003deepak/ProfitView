import React, { useState, useEffect } from "react";
import themeStore from "../store/themeStore";

const StockDisplay = ({ stockName }) => {
  const { theme } = themeStore((state) => state);

  const [stockData, setStockData] = useState({
    stockName,
    price: 0,
    percentageChange: 0,
  });

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Update stock data only if it matches the stockName prop
      if (data.stockName === stockName) {
        setStockData({
          stockName: data.stockName,
          price: parseFloat(data.lp) || 0,
          percentageChange: parseFloat(data.pc) || 0,
        });
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, [stockName]);

  const { price, percentageChange } = stockData;

  const changeColor = percentageChange > 0 ? "text-green-400" : "text-red-400";

  return (
    <div
      className={`w-64 p-4 rounded-lg shadow-lg ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">{stockName}</h2>
          <p className="text-sm text-gray-400">Live Stock Data</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold">Rs {price.toFixed(2)}</p>
          <p className={`text-sm font-medium ${changeColor}`}>
            {percentageChange > 0
              ? `+${percentageChange.toFixed(2)}%`
              : `${percentageChange.toFixed(2)}%`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockDisplay;
