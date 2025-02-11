import React from "react";
import useStockStore from "../store/stockStore"; // ✅ Import Zustand stock store
import themeStore from "../store/themeStore"; // ✅ Import theme store

const StockDisplay = ({ stockName }) => {
  const { theme } = themeStore((state) => state);
  const { stocks } = useStockStore(); // ✅ Only fetch stock data, don't connect again
  const stockData = stocks[stockName] || { stockName, price: 0, percentageChange: 0 };

  const { price = 0, percentageChange = 0 } = stockData;
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
