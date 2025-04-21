import React, { useEffect } from "react";
import useStockStore from "../store/stockStore"; 
import themeStore from "../store/themeStore"; 

const StockDisplay = ({ stockName }) => {
  const { theme } = themeStore((state) => state);
  const { stocks } = useStockStore(); 

  // useEffect(()=>{
  //   console.log(stocks);
  // },[stocks])

 
  const changeColor = stocks[stockName]?.price > stocks[stockName]?.previousClosingPrice ? "text-green-400" : "text-red-400";
  // const changePercentage = stocks[stockName]?.percentageChange > 0 ? "text-green-400" : "text-red-400"
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
          <p className={`text-2xl font-semibold ${changeColor}`}>
            Rs {stocks[stockName]?.price.toFixed(2)}
          </p>

          {/* <p className={`text-sm font-medium ${changePercentage}`}>
            {stocks[stockName].percentageChange}
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default StockDisplay;
