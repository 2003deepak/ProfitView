import React, { useEffect } from "react";
import useStockStore from "../store/stockStore"; // Adjust path if needed

const Test = () => {
  const { stocks, connectToSSE, disconnectSSE, connectionStatus } = useStockStore();

  useEffect(() => {
    connectToSSE(); // Start SSE connection when the component mounts

    return () => {
      disconnectSSE(); // Disconnect SSE when the component unmounts
    };
  }, []);

  useEffect(() => {
    console.log("Current Stock Data:", stocks);
  }, [stocks]); // Log whenever stocks update

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Stock Data Viewer</h1>
      <p className="text-gray-500">Connection Status: {connectionStatus}</p>

      <button
        onClick={() => console.log("Stocks Data:", stocks)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Log Stocks
      </button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Stock List</h2>
        <ul className="mt-4 space-y-2">
          {Object.keys(stocks).length > 0 ? (
            Object.entries(stocks).map(([symbol, stock]) => (
              <li key={symbol} className="p-2 border rounded-lg">
                <strong>{stock.symbol}</strong>: ₹{stock.price} (Last Updated:{" "}
                {new Date(stock.lastUpdated).toLocaleTimeString()})
              </li>
            ))
          ) : (
            <p className="text-gray-500">No stock data available.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Test;
