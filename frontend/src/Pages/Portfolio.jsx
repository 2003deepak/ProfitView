import React from "react";
import Sidebar from "../components/Sidebar";
import TopSearchBar from "../components/TopSearchBar";
import themeStore from "../store/themeStore";

const Portfolio = () => {
  const { theme } = themeStore((state) => state);

  // Dummy Data
  const portfolioSummary = {
    currentValue: 195139,
    investedValue: 99824,
    totalReturns: -4686,
    totalReturnsPercent: -4.69,
    oneDayReturns: -1680,
    oneDayReturnsPercent: -1.74,
  };

  const stocks = [
    {
      company: "Zomato",
      shares: 30,
      avgPrice: "₹129.46",
      mktPrice: "₹214.55",
      returnsPercent: "65.73%",
      returnsValue: "+₹2,552.70",
      currentValue: "₹6,436.50",
      dayChange: "-25.20 (10.51%)",
      chartData: "chart-placeholder",
      isPositive: false,
    },
    {
      company: "Yes Bank",
      shares: 700,
      avgPrice: "₹16.87",
      mktPrice: "₹18.50",
      returnsPercent: "9.66%",
      returnsValue: "+₹1,141.00",
      currentValue: "₹12,950.00",
      dayChange: "-0.43 (2.27%)",
      chartData: "chart-placeholder",
      isPositive: true,
    },
    {
      company: "Avenue Supermarts",
      shares: 2,
      avgPrice: "₹3,655.00",
      mktPrice: "₹3,587.80",
      returnsPercent: "1.84%",
      returnsValue: "-₹134.40",
      currentValue: "₹7,175.60",
      dayChange: "-26.90 (0.74%)",
      chartData: "chart-placeholder",
      isPositive: false,
    },
  ];

  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } h-screen w-screen flex`}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col w-full">
        {/* Top Search Bar */}
        <TopSearchBar />

        {/* Portfolio Summary */}
        <div
          className={`flex flex-col md:flex-row justify-between items-center p-6 mx-6 my-4 rounded-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-gray-200"
          }`}
        >
          <div className="flex flex-col items-start md:items-center">
            <h1 className={`text-3xl font-bold ${(portfolioSummary.currentValue > portfolioSummary.investedValue ) ? "text-green-500" : "text-red-500"}`}>Rs {portfolioSummary.currentValue}</h1>
            <p className="text-sm">Current Value</p>
          </div>
          <div className="flex flex-col md:ml-8 space-y-2 md:space-y-0 md:space-x-8 md:flex-row mt-4 md:mt-0">
            <div className="text-sm">
              <span className="font-bold">Rs {portfolioSummary.investedValue}</span>
              <p>Invested Value</p>
            </div>
            <div className="text-sm">
              <span
                className={`font-bold ${
                  portfolioSummary.totalReturns<0
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                Rs {portfolioSummary.totalReturns} ({portfolioSummary.totalReturnsPercent}%)
              </span>
              <p>Total Returns</p>
            </div>
            <div className="text-sm">
              <span
                className={`font-bold ${
                  portfolioSummary.oneDayReturns<0
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                Rs {portfolioSummary.oneDayReturns} ({portfolioSummary.oneDayReturnsPercent}%)
              </span>
              <p>1D Returns</p>
            </div>
          </div>
        </div>

        {/* Stocks Table */}
        <div className="overflow-x-auto p-6">
          <table className="table-auto w-full text-sm border-collapse">
            <thead>
              <tr
                className={`${
                  theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-800"
                }`}
              >
                <th className="px-6 py-3 text-left">Company</th>
                <th className="px-6 py-3 text-left">Chart</th>
                <th className="px-6 py-3 text-left">Mkt Price</th>
                <th className="px-6 py-3 text-left">Returns (%)</th>
                <th className="px-6 py-3 text-left">Current</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock, index) => (
                <tr
                  key={index}
                  className={`${
                    theme === "dark"
                      ? "hover:bg-gray-600 text-gray-200"
                      : "hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  <td className="px-6 py-8">
                    <div>
                      {stock.company}
                      <div className="text-xs text-gray-400">
                        {stock.shares} shares • Avg: {stock.avgPrice}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    {/* Placeholder for chart */}
                    <div
                      className={`h-14 w-32 ${
                        stock.isPositive ? "bg-green-400" : "bg-red-400"
                      } rounded-md`}
                    >
                      {/* Chart placeholder */}
                    </div>
                  </td>
                  <td className="px-6 py-3">{stock.mktPrice}</td>
                  <td
                    className={`px-6 py-3 ${
                      stock.returnsValue.startsWith("-")
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {stock.returnsValue} ({stock.returnsPercent})
                  </td>
                  <td className="px-6 py-3">{stock.currentValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
